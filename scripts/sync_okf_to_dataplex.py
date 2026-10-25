#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Synchronizes the HP Dragonfly OKF v0.2 Bundle and BigQuery Catalog with GCP Knowledge Catalog via `kcmd`.

Implements the official `GoogleCloudPlatform/knowledge-catalog/toolbox/mdcode` workflow:
1. `setup`: Creates Dataplex EntryGroup (`okf_hp_dragonfly`), custom AspectType (`okf`),
   and custom EntryType (`okf-bundle`) in GCP project `hp-dragonfly` (`us-central1`).
2. `push-bq`: Executes `./bin/kcmd push` for `scope: bq-dataset.hp-dragonfly.prj_ontology_hp_dragonfly`
   to publish enriched `dataplex-types.global.overview` aspects onto the native BigQuery tables.
3. `push-okf`: Translates `bundles/hp_dragonfly/**/*.md` into the `kcmd` staging layout
   (carrying the full OKF v0.2 signal layer on the `okf` aspect) and executes `./bin/kcmd push`
   into Dataplex EntryGroup `okf_hp_dragonfly`.
4. `pull-okf`: Executes `./bin/kcmd pull` from `okf_hp_dragonfly` and reconstructs clean OKF v0.2
   markdown files in `pulled_okf/` to verify round-trip fidelity.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
from typing import Any
import yaml

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
KCMD_BIN = WORKSPACE_ROOT / "bin" / "kcmd"
OKF_ASPECT_JSON = WORKSPACE_ROOT / "scripts" / "okf-aspect.json"
DEFAULT_BUNDLE_DIR = WORKSPACE_ROOT / "bundles" / "hp_dragonfly"
STAGING_DIR = WORKSPACE_ROOT / ".staging"
PULLED_OKF_DIR = WORKSPACE_ROOT / "pulled_okf"

LAYOUT_KEYS = ["title", "description", "tags"]
SIGNAL_KEYS = [
    "generated",
    "verified",
    "status",
    "stale_after",
    "usage_window",
    "runtime",
    "parameters",
    "computation",
    "executor",
    "attester",
    "sources",
]
MODELED_KEYS = set(LAYOUT_KEYS + SIGNAL_KEYS + ["type", "resource"])
RECORD_KEYS: dict[str, list[str]] = {
    "generated": ["by", "at"],
    "verified": ["by", "at"],
    "usage_window": ["from", "to"],
    "parameters": ["name", "type", "required"],
    "executor": ["resource", "receipt"],
    "attester": ["resource"],
    "sources": [
        "id",
        "resource",
        "title",
        "author",
        "usage_count",
        "last_modified",
    ],
}
LIST_KEYS = {"verified", "parameters", "sources"}


def run_cmd(
    argv: list[str], cwd: Path | None = None, check: bool = True
) -> subprocess.CompletedProcess[str]:
  env = os.environ.copy()
  env["CLOUDSDK_METRICS_ENVIRONMENT"] = "datacloud.jetski"
  return subprocess.run(
      argv,
      cwd=str(cwd or WORKSPACE_ROOT),
      env=env,
      text=True,
      capture_output=False,
      check=check,
  )


def describe_exists(
    kind: str, name: str, project: str, location: str
) -> bool:
  env = os.environ.copy()
  env["CLOUDSDK_METRICS_ENVIRONMENT"] = "datacloud.jetski"
  res = subprocess.run(
      [
          "gcloud",
          "dataplex",
          kind,
          "describe",
          name,
          "--project",
          project,
          "--location",
          location,
      ],
      env=env,
      stdout=subprocess.DEVNULL,
      stderr=subprocess.DEVNULL,
      check=False,
  )
  return res.returncode == 0


def setup_dataplex_okf_resources(
    project: str, location: str, entry_group: str
) -> None:
  """Provisions Dataplex EntryGroup, `okf` AspectType, and `okf-bundle` EntryType."""
  print("=" * 80)
  print(
      f"[STEP 1] Setting up Dataplex Knowledge Catalog resources in"
      f" {project}.{location}..."
  )
  print("=" * 80)

  if describe_exists("entry-groups", entry_group, project, location):
    print(f"  [OK] Existing EntryGroup found: {entry_group}")
  else:
    run_cmd([
        "gcloud",
        "dataplex",
        "entry-groups",
        "create",
        entry_group,
        "--project",
        project,
        "--location",
        location,
        "--description=HP Dragonfly Ontology Open Knowledge Format (OKF v0.2) Bundle",
    ])
    print(f"  [CREATED] EntryGroup: {entry_group}")

  if describe_exists("aspect-types", "okf", project, location):
    run_cmd([
        "gcloud",
        "dataplex",
        "aspect-types",
        "update",
        "okf",
        f"--metadata-template-file-name={OKF_ASPECT_JSON}",
        "--project",
        project,
        "--location",
        location,
    ])
    print("  [UPDATED] Custom AspectType: okf")
  else:
    run_cmd([
        "gcloud",
        "dataplex",
        "aspect-types",
        "create",
        "okf",
        f"--metadata-template-file-name={OKF_ASPECT_JSON}",
        "--project",
        project,
        "--location",
        location,
    ])
    print("  [CREATED] Custom AspectType: okf")

  entry_type_flags = [
      "--display-name=OKF Document",
      "--description=A document in an Open Knowledge Format bundle.",
      "--project",
      project,
      "--location",
      location,
  ]
  if describe_exists("entry-types", "okf-bundle", project, location):
    run_cmd(
        ["gcloud", "dataplex", "entry-types", "update", "okf-bundle"]
        + entry_type_flags
    )
    print("  [UPDATED] Custom EntryType: okf-bundle")
  else:
    run_cmd(
        ["gcloud", "dataplex", "entry-types", "create", "okf-bundle"]
        + entry_type_flags
    )
    print("  [CREATED] Custom EntryType: okf-bundle")


def split_frontmatter(content: str) -> tuple[dict[str, Any] | None, str]:
  lines = content.splitlines()
  if not lines or lines[0].strip() != "---":
    return None, content
  try:
    end_idx = lines.index("---", 1)
  except ValueError:
    return None, content
  meta = yaml.safe_load("\n".join(lines[1:end_idx]))
  body = "\n".join(lines[end_idx + 1 :])
  return meta, body


def render_markdown(meta: dict[str, Any], body: str) -> str:
  fm = yaml.safe_dump(
      meta, sort_keys=False, allow_unicode=True, default_flow_style=False
  ).strip()
  return f"---\n{fm}\n---\n\n{body.strip()}\n"


def pick(obj: dict[str, Any] | None, keys: list[str]) -> dict[str, Any]:
  if not obj:
    return {}
  return {k: obj[k] for k in keys if k in obj and obj[k] is not None}


def to_staging(content: str, okf_key: str, entry_type_key: str) -> str:
  """Translates clean OKF v0.2 markdown to kcmd pushable staging markdown."""
  meta, body = split_frontmatter(content)
  if not meta:
    return render_markdown({"type": entry_type_key}, body)

  extras: list[list[Any]] = []

  def divert(
      val: dict[str, Any], fields: list[str], path_prefix: list[Any]
  ) -> dict[str, Any]:
    kept: dict[str, Any] = {}
    for k, item in val.items():
      if item is None:
        continue
      if k in fields:
        kept[k] = item
      else:
        extras.append([path_prefix + [k], item])
    return pick(kept, fields)

  signal: dict[str, Any] = {}
  if "type" in meta and meta["type"] is not None:
    signal["okf_type"] = meta["type"]

  for key, value in pick(meta, SIGNAL_KEYS).items():
    fields = RECORD_KEYS.get(key)
    if not fields:
      signal[key] = value
    elif key in LIST_KEYS:
      items = value if isinstance(value, list) else [value]
      signal[key] = [
          divert(item, fields, [key, idx]) for idx, item in enumerate(items)
      ]
    else:
      signal[key] = divert(value, fields, [key])

  for key, value in meta.items():
    if key not in MODELED_KEYS:
      extras.append([[key], value])

  if extras:
    signal["extra"] = json.dumps(extras)

  staged: dict[str, Any] = {"type": entry_type_key, **pick(meta, LAYOUT_KEYS)}
  resource_block: dict[str, Any] = {}
  if meta.get("resource"):
    resource_block["name"] = meta["resource"]
  staged["catalogEntry"] = {
      "resource": resource_block,
      "aspects": {okf_key: signal},
  }
  return render_markdown(staged, body)


def from_staging(content: str, okf_key: str) -> str:
  """Restores clean OKF v0.2 markdown from kcmd pulled staging markdown."""
  meta, body = split_frontmatter(content)
  if not meta:
    return content
  ce = meta.get("catalogEntry") or {}
  okf = (ce.get("aspects") or {}).get(okf_key) or {}
  res_name = (ce.get("resource") or {}).get("name")
  has_signal = bool(okf) or (res_name is not None)
  if not has_signal:
    return f"{body.strip()}\n"

  clean: dict[str, Any] = {}
  if "okf_type" in okf:
    clean["type"] = okf["okf_type"]
  if res_name is not None:
    clean["resource"] = res_name
  clean.update(pick(meta, LAYOUT_KEYS))
  for key, value in pick(okf, SIGNAL_KEYS).items():
    fields = RECORD_KEYS.get(key)
    if not fields:
      clean[key] = value
    elif key in LIST_KEYS:
      clean[key] = [pick(item, fields) for item in value]
    else:
      clean[key] = pick(value, fields)
  return render_markdown(clean, body)


def build_okf_manifest(
    project: str, location: str, entry_group: str
) -> dict[str, Any]:
  okf_aspect = f"{project}.{location}.okf"
  okf_entry_type = f"{project}.{location}.okf-bundle"
  return {
      "scope": f"kb.{project}.{location}.{entry_group}",
      "snapshot": {
          "entries": [okf_entry_type],
          "aspects": ["dataplex-types.global.overview", okf_aspect],
      },
      "publishing": {
          "entries": [okf_entry_type],
          "aspects": ["dataplex-types.global.overview", okf_aspect],
      },
  }


def push_bigquery_catalog() -> None:
  """Pushes the enriched BigQuery dataset and table overview aspects via `kcmd push`."""
  print("=" * 80)
  print(
      "[STEP 2] Pushing enriched BigQuery Dataset & Table Metadata via `kcmd"
      " push`..."
  )
  print("=" * 80)
  run_cmd([str(KCMD_BIN), "push", "--force"], cwd=WORKSPACE_ROOT)


def push_okf_bundle(
    project: str, location: str, entry_group: str, bundle_dir: Path
) -> None:
  """Stages the OKF v0.2 bundle and pushes it to Dataplex EntryGroup via `kcmd push`."""
  print("=" * 80)
  print(
      f"[STEP 3] Pushing OKF v0.2 Bundle ({bundle_dir.name}) to EntryGroup"
      f" `{entry_group}` via `kcmd push`..."
  )
  print("=" * 80)
  okf_key = f"{project}.{location}.okf"
  entry_type_key = f"{project}.{location}.okf-bundle"

  shutil.rmtree(STAGING_DIR, ignore_errors=True)
  staging_catalog = STAGING_DIR / "catalog"
  staging_catalog.mkdir(parents=True, exist_ok=True)

  manifest = build_okf_manifest(project, location, entry_group)
  (STAGING_DIR / "catalog.yaml").write_text(
      yaml.safe_dump(manifest, sort_keys=False, allow_unicode=True),
      encoding="utf-8",
  )
  # Also save a tracked copy in workspace root as `okf_catalog.yaml` for Git versioning
  (WORKSPACE_ROOT / "okf_catalog.yaml").write_text(
      yaml.safe_dump(manifest, sort_keys=False, allow_unicode=True),
      encoding="utf-8",
  )

  md_files = sorted(bundle_dir.rglob("*.md"))
  for md_file in md_files:
    rel = md_file.relative_to(bundle_dir)
    dest = staging_catalog / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    staged_content = to_staging(
        md_file.read_text(encoding="utf-8"), okf_key, entry_type_key
    )
    dest.write_text(staged_content, encoding="utf-8")

  try:
    run_cmd([str(KCMD_BIN), "push", "--force"], cwd=STAGING_DIR)
  finally:
    shutil.rmtree(STAGING_DIR, ignore_errors=True)


def pull_okf_bundle(
    project: str, location: str, entry_group: str, target_dir: Path
) -> None:
  """Pulls the OKF v0.2 bundle back from Dataplex EntryGroup via `kcmd pull`."""
  print("=" * 80)
  print(
      f"[STEP 4] Pulling OKF v0.2 Bundle from EntryGroup `{entry_group}` via"
      " `kcmd pull` to verify round-trip..."
  )
  print("=" * 80)
  okf_key = f"{project}.{location}.okf"
  shutil.rmtree(STAGING_DIR, ignore_errors=True)
  staging_catalog = STAGING_DIR / "catalog"
  staging_catalog.mkdir(parents=True, exist_ok=True)

  manifest = build_okf_manifest(project, location, entry_group)
  (STAGING_DIR / "catalog.yaml").write_text(
      yaml.safe_dump(manifest, sort_keys=False, allow_unicode=True),
      encoding="utf-8",
  )

  try:
    run_cmd([str(KCMD_BIN), "pull"], cwd=STAGING_DIR)
    shutil.rmtree(target_dir, ignore_errors=True)
    for md_file in sorted(staging_catalog.rglob("*.md")):
      rel = md_file.relative_to(staging_catalog)
      dest = target_dir / rel
      dest.parent.mkdir(parents=True, exist_ok=True)
      dest.write_text(
          from_staging(md_file.read_text(encoding="utf-8"), okf_key),
          encoding="utf-8",
      )
    pulled_count = len(list(target_dir.rglob("*.md")))
    print(f"  [VERIFIED ROUND-TRIP] Pulled {pulled_count} clean OKF files -> {target_dir}")
  finally:
    shutil.rmtree(STAGING_DIR, ignore_errors=True)


def main() -> None:
  parser = argparse.ArgumentParser(
      description="Sync OKF v0.2 bundle & BigQuery metadata with GCP Knowledge Catalog via kcmd."
  )
  parser.add_argument("--project", default="hp-dragonfly")
  parser.add_argument("--location", default="us-central1")
  parser.add_argument("--entry-group", default="okf_hp_dragonfly")
  parser.add_argument("--bundle-dir", type=Path, default=DEFAULT_BUNDLE_DIR)
  parser.add_argument(
      "--action",
      choices=["all", "setup", "push-bq", "push-okf", "pull-okf"],
      default="all",
  )
  args = parser.parse_args()

  if args.action in ("all", "setup"):
    setup_dataplex_okf_resources(args.project, args.location, args.entry_group)
  if args.action in ("all", "push-bq"):
    push_bigquery_catalog()
  if args.action in ("all", "push-okf"):
    push_okf_bundle(
        args.project, args.location, args.entry_group, args.bundle_dir
    )
  if args.action in ("all", "pull-okf"):
    pull_okf_bundle(
        args.project, args.location, args.entry_group, PULLED_OKF_DIR
    )


if __name__ == "__main__":
  main()
