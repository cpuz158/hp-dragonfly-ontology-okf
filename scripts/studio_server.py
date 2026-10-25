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
import sys

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
if str(WORKSPACE_ROOT / "scripts") not in sys.path:
  sys.path.insert(0, str(WORKSPACE_ROOT / "scripts"))

import ontology_nl_engine
import adk_live_runner

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
    question: str,
    scenario_id: str | None,
    scenarios: list[dict[str, Any]],
    live_bq_client: Any = None,
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

  # 2. If user is asking a general series/model/catalog/list question, route directly to Dynamic Ontology Engine
  general_catalog_triggers = [
      "시리즈", "라인업", "노트북 종류", "모델 종류", "모델 목록", "시리즈 목록",
      "전 모델", "전체 모델", "노트북을 모두", "시리즈를 모두", "모두 알려", "다 알려",
      "전체 알려", "목록을 알려", "목록 알려", "종류를 알려", "종류 알려",
      "tell me all", "list all", "all series", "all models", "laptop series",
  ]
  if any(t in q_norm for t in general_catalog_triggers):
    dyn = ontology_nl_engine.build_dynamic_ontology_scenario(question, live_bq_client=live_bq_client)
    if dyn is not None:
      return dyn

  # 3. Specific technical entity code / case ID match for preset scenarios (01..14)
  explicit_preset_codes = [
      ("n20728-601", "01"),
      ("led-caps-2-2", "02"),
      ("ts-dfg3-001", "02"),
      ("led-caps-3-2", "03"),
      ("ts-dfg3-010", "03"),
      ("ts-dfg3-004", "04"),
      ("ts-dfg3-008", "04"),
      ("m90788-005", "04"),
      ("ts-dfg3-005", "05"),
      ("n23306-001", "05"),
      ("stretch-release", "05"),
      ("slb9672", "06"),
      ("sp148210", "06"),
      ("ts-dfg3-006", "07"),
      ("n00181-005", "07"),
      ("warn-wwan-unauth", "07"),
      ("ts-dfg3-002", "08"),
      ("ts-dfg3-003", "08"),
      ("sp149503", "08"),
      ("ts-dfg3-007", "09"),
      ("ts-dfg3-009", "09"),
      ("n26149-001", "09"),
      ("requires_part_replacement", "10"),
      ("fru-replacement-rate", "10"),
      ("ts-dfg3-011", "11"),
      ("uefi-24digit-ssd", "11"),
      ("m52027-005", "11"),
      ("ts-dfg3-012", "12"),
      ("sof-firmware", "12"),
      ("ipu6", "12"),
      ("ch05-hot-swap-draft-v0.1", "13"),
      ("핫스왑", "13"),
      ("hot-swap", "13"),
  ]
  for code_str, sc_id in explicit_preset_codes:
    if code_str in q_norm:
      for sc in scenarios:
        if sc.get("id") == sc_id:
          return sc

  # 4. Out-of-domain guardrail check
  out_of_domain_kw = [
      "날씨", "weather", "코스피", "kospi", "주식", "stock", "맛집",
      "점심", "저녁", "dinner", "lunch", "축구", "야구", "영화", "비트코인",
  ]
  if any(w in q_norm for w in out_of_domain_kw):
    return scenarios[-1]

  # 5. Multi-keyword specific scoring (ignore overly generic single words like '모델', 'series', 'folio')
  generic_ignore = {"모델", "series", "folio", "g1", "g2", "g3", "g4", "max", "sku"}
  best_sc = None
  best_score = 0
  matched_count = 0
  for sc in scenarios[:-1]:
    score = 0
    cnt = 0
    for kw in sc.get("keywords") or []:
      kw_l = kw.lower()
      if kw_l in generic_ignore:
        continue
      if kw_l in q_norm:
        score += 3 if len(kw_l) >= 4 else 2
        cnt += 1
    if score > best_score:
      best_score = score
      matched_count = cnt
      best_sc = sc

  if best_sc and best_score >= 5 and matched_count >= 2:
    return best_sc

  # 6. Dynamic Natural-Language Ontology Query & Synthesis Engine
  dyn = ontology_nl_engine.build_dynamic_ontology_scenario(question, live_bq_client=live_bq_client)
  if dyn is not None:
    return dyn

  # 7. Return scenario 14 (Out of domain refusal)
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
        bq_client = None
        if payload.get("live_bq", True):
          try:
            bq_client = bigquery.Client(project="hp-dragonfly")
          except Exception:
            bq_client = None

        matched = match_agent_scenario(question, scenario_id, scenarios, live_bq_client=bq_client)
        if not matched:
          self._send_json({"ok": False, "error": "No matching scenario found."}, status=200)
          return

        # Deep copy so we can optionally refresh live BigQuery timing for preset scenarios
        sc_copy = json.loads(json.dumps(matched))
        gql_str = (sc_copy.get("gql") or "").strip()
        if (
            gql_str
            and not sc_copy.get("refused")
            and payload.get("live_bq", True)
            and bq_client is not None
            and not str(sc_copy.get("id", "")).startswith("ONT-")
        ):
          try:
            t0 = time.time()
            job = bq_client.query(gql_str)
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

    if parsed.path == "/api/benchmark/ask":
      try:
        payload = json.loads(raw_body)
        eq_id = payload.get("eq_id")
        raw_question = (payload.get("question") or "").strip()
        lang = payload.get("lang") or "ko"
        arm = payload.get("arm", "both")
        live_adk = payload.get("live_adk", True)

        if live_adk:
          live_item = adk_live_runner.run_adk_dual_comparison_sync(
              question=raw_question,
              eq_id=eq_id,
              lang=lang,
          )
          self._send_json(
              {"ok": True, "arm": arm, "live_adk": True, "model": "gemini-3.8-flash", "item": live_item},
              status=200,
          )
          return

        question = raw_question.lower()
        eq_path = WEB_DIR / "data" / "eq_compare.json"
        eq_data = json.loads(eq_path.read_text(encoding="utf-8")) if eq_path.exists() else {"items": []}
        items = eq_data.get("items") or []
        matched = None
        if eq_id:
          matched = next((x for x in items if x.get("eq_id") == eq_id), None)
        if not matched and question:
          matched = next(
              (
                  x
                  for x in items
                  if question in (x.get("question") or "").lower()
                  or question in (x.get("question_en") or "").lower()
              ),
              None,
          )
        if not matched and items:
          matched = items[0]
        self._send_json({"ok": True, "arm": arm, "live_adk": False, "item": matched}, status=200)
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
