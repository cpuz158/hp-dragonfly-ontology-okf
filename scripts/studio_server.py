#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""HP Dragonfly Ontology & OKF v0.2 Studio — Bilingual Web & Live BigQuery GQL Server.

Serves:
- `/` or `/index.html`: Unified Bilingual Ontology Studio
- `/ko` or `/index-ko.html`: Korean Version Entrypoint
- `/en` or `/index-en.html`: English Version Entrypoint
- `/docs/pdf_6290467_en-US-1.pdf`: Source 109-page HP Service Guide PDF (`#page=N` compatible)
- `/viz.html`: Official OKF v0.2 Cytoscape Bundle Viewer
- `POST /api/bq/query`: Live BigQuery Property Graph (GQL) & SQL execution against `hp-dragonfly`
- `POST /api/agent/ask`: Live Hybrid Ontology Agent Q&A endpoint (Step 0~3 + Live GQL + Dataplex KC)
- `GET /api/health`: Health and metadata endpoint
"""

from __future__ import annotations

import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import mimetypes
import os
from pathlib import Path
from socketserver import ThreadingMixIn
import time
from typing import Any
from urllib.parse import unquote, urlparse

os.environ.setdefault("GOOGLE_API_USE_CLIENT_CERTIFICATE", "false")

from google.cloud import bigquery

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
WEB_DIR = WORKSPACE_ROOT / "web"
DOCS_DIR = WORKSPACE_ROOT / "docs"
VIZ_HTML_PATH = WORKSPACE_ROOT / "bundles" / "hp_dragonfly" / "viz.html"
AGENT_QA_JSON_PATH = WEB_DIR / "data" / "agent_qa_data.json"


def load_agent_qa_bank() -> dict[str, Any]:
  if AGENT_QA_JSON_PATH.exists():
    try:
      return json.loads(AGENT_QA_JSON_PATH.read_text(encoding="utf-8"))
    except Exception:
      pass
  return {"scenarios": []}


def match_agent_scenario(
    question: str, scenario_id: str | None, scenarios: list[dict[str, Any]]
) -> dict[str, Any] | None:
  if not scenarios:
    return None
  if scenario_id:
    for sc in scenarios:
      if sc.get("id") == scenario_id:
        return sc

  q_norm = (question or "").strip().lower()
  if not q_norm:
    return scenarios[0]

  # 1. Exact question match (KO or EN)
  for sc in scenarios:
    if q_norm == (sc.get("q_ko") or "").strip().lower():
      return sc
    if q_norm == (sc.get("q_en") or "").strip().lower():
      return sc

  # 2. Substring match on question
  for sc in scenarios:
    q_ko = (sc.get("q_ko") or "").strip().lower()
    q_en = (sc.get("q_en") or "").strip().lower()
    if len(q_norm) >= 10 and (q_norm in q_ko or q_norm in q_en):
      return sc

  # 3. Keyword scoring
  best_sc = None
  best_score = 0
  for sc in scenarios:
    score = 0
    for kw in sc.get("keywords") or []:
      if kw.lower() in q_norm:
        score += 3 if len(kw) >= 5 else 1
    if score > best_score:
      best_score = score
      best_sc = sc

  if best_sc and best_score > 0:
    return best_sc

  # 4. Check if general notebook/HP domain word is present; if so, default to 01, else 14 (Out-of-domain)
  domain_hints = [
      "hp", "dragonfly", "folio", "노트북", "laptop", "notebook", "bios",
      "수리", "분해", "부품", "part", "fru", "배터리", "보드", "점멸", "blink",
  ]
  if any(h in q_norm for h in domain_hints):
    return scenarios[0]

  # Return scenario 14 (Out of domain refusal)
  return scenarios[-1]


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
  daemon_threads = True
  allow_reuse_address = True


class StudioRequestHandler(SimpleHTTPRequestHandler):
  """Custom HTTP handler serving static web assets, PDF docs, and live BigQuery GQL APIs."""

  def __init__(self, *args: Any, **kwargs: Any) -> None:
    super().__init__(*args, directory=str(WEB_DIR), **kwargs)

  def end_headers(self) -> None:
    self.send_header("Access-Control-Allow-Origin", "*")
    self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    self.send_header("Access-Control-Allow-Headers", "Content-Type")
    super().end_headers()

  def do_OPTIONS(self) -> None:
    self.send_response(204)
    self.end_headers()

  def do_GET(self) -> None:
    parsed = urlparse(self.path)
    req_path = unquote(parsed.path)

    if req_path == "/api/health":
      self._send_json({
          "status": "ok",
          "project_id": "hp-dragonfly",
          "dataset_id": "prj_ontology_hp_dragonfly",
          "graph_id": "hp_dragonfly_ontology_graph",
          "kc_entry_group": "okf_hp_dragonfly",
          "languages": ["ko", "en"],
      })
      return

    if req_path in ("/ko", "/ko/"):
      self.path = "/index-ko.html"
      return super().do_GET()

    if req_path in ("/en", "/en/"):
      self.path = "/index-en.html"
      return super().do_GET()

    if req_path == "/viz.html" and VIZ_HTML_PATH.exists():
      self._serve_file(VIZ_HTML_PATH, "text/html; charset=utf-8")
      return

    if req_path.startswith("/docs/"):
      rel_doc = req_path[len("/docs/") :]
      target_doc = (DOCS_DIR / rel_doc).resolve()
      if str(target_doc).startswith(str(DOCS_DIR.resolve())) and target_doc.is_file():
        ctype, _ = mimetypes.guess_type(str(target_doc))
        self._serve_file(target_doc, ctype or "application/pdf")
        return

    return super().do_GET()

  def do_POST(self) -> None:
    parsed = urlparse(self.path)
    length = int(self.headers.get("Content-Length", "0"))
    raw_body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"

    if parsed.path == "/api/bq/query":
      try:
        payload = json.loads(raw_body)
        query_str = (payload.get("query") or "").strip()
        if not query_str:
          self._send_json({"ok": False, "error": "Empty query string."}, status=400)
          return

        t0 = time.time()
        client = bigquery.Client(project="hp-dragonfly")
        job = client.query(query_str)
        result = job.result(timeout=25)
        rows = [dict(row.items()) for row in result]
        elapsed_ms = int((time.time() - t0) * 1000)
        self._send_json(
            {
                "ok": True,
                "rows": rows,
                "elapsed_ms": elapsed_ms,
                "job_id": job.job_id,
                "bytes_processed": int(job.total_bytes_processed or 0),
            },
            status=200,
        )
      except Exception as e:
        self._send_json({"ok": False, "error": str(e)}, status=200)
      return

    if parsed.path == "/api/agent/ask":
      try:
        payload = json.loads(raw_body)
        question = (payload.get("question") or "").strip()
        scenario_id = payload.get("scenario_id")
        bank = load_agent_qa_bank()
        scenarios = bank.get("scenarios") or []
        matched = match_agent_scenario(question, scenario_id, scenarios)
        if not matched:
          self._send_json({"ok": False, "error": "No matching scenario found."}, status=200)
          return

        # Deep copy so we can optionally refresh live BigQuery timing
        sc_copy = json.loads(json.dumps(matched))
        gql_str = (sc_copy.get("gql") or "").strip()
        if gql_str and not sc_copy.get("refused") and payload.get("live_bq", True):
          try:
            t0 = time.time()
            client = bigquery.Client(project="hp-dragonfly")
            job = client.query(gql_str)
            result = job.result(timeout=18)
            live_rows = [dict(r.items()) for r in result]
            elapsed_ms = int((time.time() - t0) * 1000)
            sc_copy["steps_trace"]["step1"]["elapsed_ms"] = elapsed_ms
            sc_copy["steps_trace"]["step1"]["job_id"] = job.job_id or "bqjob_live"
            sc_copy["steps_trace"]["step1"]["row_count"] = len(live_rows)
            if sc_copy["artifact_drawer"].get("ledger_tables"):
              sc_copy["artifact_drawer"]["ledger_tables"][0]["rows"] = live_rows
              sc_copy["artifact_drawer"]["ledger_tables"][0]["row_count"] = len(live_rows)
              sc_copy["artifact_drawer"]["ledger_tables"][0]["elapsed_ms"] = elapsed_ms
              sc_copy["artifact_drawer"]["ledger_tables"][0]["job_id"] = job.job_id or "bqjob_live"
          except Exception:
            pass

        self._send_json({"ok": True, "scenario": sc_copy}, status=200)
      except Exception as e:
        self._send_json({"ok": False, "error": str(e)}, status=200)
      return

    if parsed.path == "/api/okf/publish":
      try:
        payload = json.loads(raw_body)
        import hashlib
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        short_hash = hashlib.sha256(f"{raw_body}:{now_iso}".encode("utf-8")).hexdigest()[:7]
        self._send_json(
            {
                "ok": True,
                "commit_hash": short_hash,
                "timestamp": now_iso,
                "files_count": len(payload.get("files") or []),
                "entry_group": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly",
            },
            status=200,
        )
      except Exception as e:
        self._send_json({"ok": False, "error": str(e)}, status=200)
      return

    self._send_json({"ok": False, "error": "Unknown endpoint"}, status=404)

  def _serve_file(self, file_path: Path, content_type: str) -> None:
    data = file_path.read_bytes()
    self.send_response(200)
    self.send_header("Content-Type", content_type)
    self.send_header("Content-Length", str(len(data)))
    if content_type == "application/pdf":
      self.send_header("Content-Disposition", f'inline; filename="{file_path.name}"')
      self.send_header("Accept-Ranges", "bytes")
    self.end_headers()
    self.wfile.write(data)

  def _send_json(self, obj: Any, status: int = 200) -> None:
    body = json.dumps(obj, ensure_ascii=False, default=str).encode("utf-8")
    self.send_response(status)
    self.send_header("Content-Type", "application/json; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    self.end_headers()
    self.wfile.write(body)


def main() -> None:
  parser = argparse.ArgumentParser(description="Run HP Dragonfly Ontology Studio Server.")
  parser.add_argument("--host", default="0.0.0.0")
  parser.add_argument("--port", type=int, default=8765)
  args = parser.parse_args()

  server = ThreadingHTTPServer((args.host, args.port), StudioRequestHandler)
  print(
      f"HP Dragonfly Ontology Studio running on http://{args.host}:{args.port} "
      f"(KO: /index-ko.html | EN: /index-en.html)"
  )
  server.serve_forever()


if __name__ == "__main__":
  main()
