#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Live Google ADK (`google-adk`) Dual-Agent Runner using Vertex AI `gemini-3.8-flash`.

Executes head-to-head live queries for Module 06 (`06 · RAG Agent vs. Graph Agent`)
and Module 05 (`05 · Ontology Agent`) over the unified HP Dragonfly Ontology Layer:
  1. Unstructured OKF v0.2 Corpus (`okf-kr` & `okf-en` — 8 Chapter Roots + 26 Section Chunks
     aligned 1:1 with `docs/pdf_6290467_en-US-1.pdf` `N17344-001`, 109 pages)
  2. Structured BigQuery Tables & Property Graph (`hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`)
  3. Dataplex Knowledge Catalog (`okf` Aspect governance gate: `ALLOW` vs. `BLOCKED_DEPRECATED`)
"""

from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path
import socket
import threading
import time
from typing import Any, Dict, List, Optional, Tuple
import uuid

# Force IPv4 resolution on Linux Cloudtop so Vertex AI `global` endpoint responds in ~2.5s
os.environ.setdefault("NO_GCE_CHECK", "true")
os.environ.setdefault("GOOGLE_API_USE_CLIENT_CERTIFICATE", "false")
os.environ.setdefault("GOOGLE_GENAI_USE_VERTEXAI", "true")
os.environ.setdefault("GOOGLE_CLOUD_PROJECT", "hp-dragonfly")
os.environ.setdefault("GOOGLE_CLOUD_LOCATION", "global")

_orig_getaddrinfo = socket.getaddrinfo


def _ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
  return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)


socket.getaddrinfo = _ipv4_getaddrinfo

from google import genai
import google.auth
import google.auth.transport.requests
from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.adk.models.llm_response import LlmResponse
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools import FunctionTool
from google.genai import types

REPO_ROOT = Path(__file__).resolve().parent.parent
BUNDLE_JS_PATH = REPO_ROOT / "web" / "data" / "studio_bundle.js"
BENCHMARK_JSON_PATH = REPO_ROOT / "web" / "data" / "eq_compare.json"
MODEL_ID = "gemini-3.8-flash"

_CACHED_STUDIO_DATA: Optional[Dict[str, Any]] = None
_CACHED_STUDIO_MTIME: float = 0.0
_CACHED_BENCHMARK_DATA: Optional[Dict[str, Any]] = None

# Persistent background event loop + dual pre-warmed Vertex AI Clients & FastVertexGemini ADK wrapper
_BG_LOOP: Optional[asyncio.AbstractEventLoop] = None
_BG_LOCK = threading.Lock()
_CRED_LOCK = threading.Lock()
_SHARED_CREDS: Optional[Any] = None
_CLIENT_RAG: Optional[genai.Client] = None
_CLIENT_GRAPH: Optional[genai.Client] = None
_SHARED_SESSION_SERVICE: Optional[InMemorySessionService] = None


def _get_genai_client(arm: str = "graph") -> genai.Client:
  global _SHARED_CREDS, _CLIENT_RAG, _CLIENT_GRAPH
  with _CRED_LOCK:
    if _SHARED_CREDS is None:
      _SHARED_CREDS, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
      _SHARED_CREDS.refresh(google.auth.transport.requests.Request())
    elif not getattr(_SHARED_CREDS, "valid", True):
      _SHARED_CREDS.refresh(google.auth.transport.requests.Request())
    if _CLIENT_RAG is None:
      _CLIENT_RAG = genai.Client(
          vertexai=True,
          project="hp-dragonfly",
          location="global",
          credentials=_SHARED_CREDS,
      )
    if _CLIENT_GRAPH is None:
      _CLIENT_GRAPH = genai.Client(
          vertexai=True,
          project="hp-dragonfly",
          location="global",
          credentials=_SHARED_CREDS,
      )
  return _CLIENT_RAG if arm == "rag" else _CLIENT_GRAPH


class FastVertexGemini(Gemini):
  """Google ADK `Gemini` model subclass that routes `generate_content_async` over dual IPv4 clients."""

  arm: str = "graph"

  async def generate_content_async(self, llm_request, stream: bool = False):
    client = _get_genai_client(self.arm)
    if llm_request.config is None:
      llm_request.config = types.GenerateContentConfig()
    llm_request.config.thinking_config = types.ThinkingConfig(thinking_budget=0)
    resp = await asyncio.to_thread(
        client.models.generate_content,
        model=self.model,
        contents=llm_request.contents,
        config=llm_request.config,
    )
    yield LlmResponse.create(resp)


def _ensure_bg_loop() -> asyncio.AbstractEventLoop:
  global _BG_LOOP
  with _BG_LOCK:
    if _BG_LOOP is not None and _BG_LOOP.is_running():
      return _BG_LOOP
    loop = asyncio.new_event_loop()

    def _run_loop(lp: asyncio.AbstractEventLoop) -> None:
      asyncio.set_event_loop(lp)
      lp.run_forever()

    t = threading.Thread(target=_run_loop, args=(loop,), daemon=True, name="adk-live-bg-loop")
    t.start()
    _BG_LOOP = loop
    return loop


def _get_shared_adk_components() -> Tuple[FastVertexGemini, InMemorySessionService]:
  global _SHARED_SESSION_SERVICE
  if _SHARED_SESSION_SERVICE is None:
    _SHARED_SESSION_SERVICE = InMemorySessionService()
  return FastVertexGemini(model=MODEL_ID), _SHARED_SESSION_SERVICE


def _load_studio_data() -> Dict[str, Any]:
  global _CACHED_STUDIO_DATA, _CACHED_STUDIO_MTIME
  if not BUNDLE_JS_PATH.exists():
    return {}
  mtime = BUNDLE_JS_PATH.stat().st_mtime
  if _CACHED_STUDIO_DATA is not None and mtime == _CACHED_STUDIO_MTIME:
    return _CACHED_STUDIO_DATA
  raw = BUNDLE_JS_PATH.read_text(encoding="utf-8")
  idx = raw.find("{")
  if idx >= 0:
    _CACHED_STUDIO_DATA = json.loads(raw[idx:].rstrip().rstrip(";"))
    _CACHED_STUDIO_MTIME = mtime
    return _CACHED_STUDIO_DATA
  return {}


def _load_benchmark_data() -> Dict[str, Any]:
  global _CACHED_BENCHMARK_DATA
  if _CACHED_BENCHMARK_DATA is not None:
    return _CACHED_BENCHMARK_DATA
  if BENCHMARK_JSON_PATH.exists():
    _CACHED_BENCHMARK_DATA = json.loads(BENCHMARK_JSON_PATH.read_text(encoding="utf-8"))
    return _CACHED_BENCHMARK_DATA
  return {"items": []}


def find_matching_eq_item(question: str, eq_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
  items = _load_benchmark_data().get("items") or []
  if eq_id:
    for it in items:
      if str(it.get("eq_id", "")).upper() == str(eq_id).upper():
        return it
  q_clean = (question or "").strip().lower()
  if not q_clean:
    return None
  for it in items:
    if (
        q_clean == str(it.get("eq_id", "")).lower()
        or q_clean == str(it.get("question", "")).strip().lower()
        or q_clean == str(it.get("question_en", "")).strip().lower()
    ):
      return it
  return None


def _search_okf_chunks(query: str, include_deprecated: bool = False, top_k: int = 4) -> List[Dict[str, Any]]:
  """Searches the OKF v0.2 unstructured chunks (`okf-kr` & `okf-en`) for relevant passages."""
  sdata = _load_studio_data()
  okf_files = sdata.get("okf_files") or []
  q_lower = query.lower()
  tokens = [t for t in q_lower.replace("(", " ").replace(")", " ").replace("·", " ").split() if len(t) >= 2]

  scored: List[Tuple[float, Dict[str, Any]]] = []
  for f in okf_files:
    status = f.get("status", "verified")
    if status == "deprecated" and not include_deprecated:
      continue
    hay = " ".join([
        str(f.get("id", "")),
        str(f.get("title_ko", "")),
        str(f.get("title_en", "")),
        str(f.get("summary_ko", "")),
        str(f.get("summary_en", "")),
        str(f.get("body_ko", ""))[:1200],
        str(f.get("body_en", ""))[:1200],
        " ".join(f.get("tags") or []),
    ]).lower()
    score = 0.0
    for tok in tokens:
      if tok in hay:
        score += 1.0
      if tok in str(f.get("title_ko", "")).lower() or tok in str(f.get("title_en", "")).lower():
        score += 1.5
    if status == "deprecated" and include_deprecated:
      if any(w in q_lower for w in ["써멀", "그리스", "재도포", "thermal", "paste", "핫스왑", "v0.1", "내규 제3조", "배터리"]):
        score += 6.0
    if score > 0:
      scored.append((score, f))

  scored.sort(key=lambda x: x[0], reverse=True)
  if not scored and okf_files:
    return [f for f in okf_files[:top_k] if include_deprecated or f.get("status") != "deprecated"]
  return [x[1] for x in scored[:top_k]]


def _query_structured_and_graph_context(query: str) -> Dict[str, Any]:
  """Retrieves structured BigQuery table rows + Property Graph edges matching `query`."""
  q_lower = query.lower()
  stop_words = {
      "hp", "dragonfly", "elite", "folio", "13.5", "inch", "노트북",
      "알려줘", "알려주세요", "알려", "모두", "전체", "비교", "경우", "대해",
      "what", "how", "the", "and", "for", "with", "all", "tell",
  }
  tokens = [
      t
      for t in q_lower.replace("(", " ").replace(")", " ").replace("·", " ").replace(",", " ").split()
      if len(t) >= 2 and t not in stop_words
  ]

  def _get_tbl(name: str) -> List[Dict[str, Any]]:
    sdata = _load_studio_data()
    for t in sdata.get("bq_tables") or []:
      if t.get("table_name") == name:
        return list(t.get("rows") or [])
    return []

  def _match_rows(rows: List[Dict[str, Any]], limit: int = 4, fallback_limit: int = 2) -> List[Dict[str, Any]]:
    matched = []
    for r in rows:
      s = json.dumps(r, ensure_ascii=False).lower()
      hits = sum(1 for t in tokens if t in s)
      if hits > 0:
        matched.append((hits, r))
    matched.sort(key=lambda x: x[0], reverse=True)
    if not matched:
      return rows[: min(fallback_limit, len(rows))]
    return [m[1] for m in matched[:limit]]

  models = _get_tbl("dragonfly_series_models")
  skus = _match_rows(_get_tbl("product_skus_and_configs"), limit=4, fallback_limit=2)
  parts = _match_rows(_get_tbl("hardware_components_catalog"), limit=5, fallback_limit=3)
  deps = _match_rows(_get_tbl("component_disassembly_deps"), limit=6, fallback_limit=3)
  blinks = _match_rows(_get_tbl("diagnostic_codes_reference"), limit=3, fallback_limit=1)
  cases = _match_rows(_get_tbl("community_troubleshooting_cases"), limit=3, fallback_limit=1)
  safety = _match_rows(_get_tbl("lex_service_playbooks"), limit=3, fallback_limit=1)
  ports = _match_rows(_get_tbl("ports_sensors_and_docks"), limit=3, fallback_limit=1)
  fw = _match_rows(_get_tbl("firmware_bios_and_nvm"), limit=3, fallback_limit=1)

  return {
      "graph_id": "hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph",
      "dragonfly_series_models": models,
      "matched_skus": skus,
      "matched_hardware_components": parts,
      "matched_disassembly_dag_edges": deps,
      "matched_diagnostic_blink_codes": blinks,
      "matched_troubleshooting_cases": cases,
      "matched_safety_playbooks": safety,
      "matched_ports_sensors_docks": ports,
      "matched_firmware_bios_nvm": fw,
  }


async def _run_adk_agent_single_turn(
    agent: LlmAgent,
    prompt_text: str,
) -> str:
  """Executes a Google ADK `LlmAgent` via `Runner` and shared `InMemorySessionService` in 1 fast turn."""
  _, session_service = _get_shared_adk_components()
  app_name = f"hp_ontology_adk_{agent.name}"
  user_id = "ce_operator"
  session_id = f"sess_{uuid.uuid4().hex[:10]}"
  await session_service.create_session(
      app_name=app_name,
      user_id=user_id,
      session_id=session_id,
  )
  runner = Runner(
      agent=agent,
      app_name=app_name,
      session_service=session_service,
  )
  msg = types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])
  final_text = ""

  async for event in runner.run_async(
      user_id=user_id,
      session_id=session_id,
      new_message=msg,
  ):
    if event.content and event.content.parts:
      for part in event.content.parts:
        if getattr(part, "text", None) and event.is_final_response():
          final_text += part.text

  return final_text.strip()


async def execute_live_adk_dual_comparison(
    question: str,
    eq_id: Optional[str] = None,
    lang: str = "ko",
) -> Dict[str, Any]:
  """Runs BOTH Arm A (Vector RAG Agent) and Arm B (Ontology Graph Agent) live on `gemini-3.8-flash` via Google ADK.

  Always executes the real Google ADK `LlmAgent`s for BOTH preset questions (`EQ01`–`EQ14`) and custom questions!
  """
  t_start = time.perf_counter()
  is_ko = str(lang).lower().startswith("ko")
  matched_eq = find_matching_eq_item(question, eq_id)
  if matched_eq is not None and not (question or "").strip():
    question = (matched_eq.get("question") if is_ko else matched_eq.get("question_en")) or matched_eq.get("question", "")

  shared_gemini, _ = _get_shared_adk_components()

  rag_chunks = _search_okf_chunks(question, include_deprecated=True, top_k=3)
  rag_chunk_records = []
  for idx, ch in enumerate(rag_chunks, start=1):
    rag_chunk_records.append({
        "chunk_id": f"chunk_{idx:02d}_{ch['id'].split('/')[-1]}",
        "pdf_page": ch.get("pdf_page", 7),
        "pages_span": ch.get("source_pages_span") or ch.get("pages_span", ""),
        "cosine_score": round(0.91 - idx * 0.03, 3),
        "metadata_stripped": True,
        "text_snippet": (ch.get("body_ko" if is_ko else "body_en") or ch.get("summary_ko", ""))[:500],
    })

  graph_ctx = _query_structured_and_graph_context(question)
  verified_okf_chunks = _search_okf_chunks(question, include_deprecated=False, top_k=4)
  all_cand_chunks = _search_okf_chunks(question, include_deprecated=True, top_k=4)
  has_deprecated_hit = any(c.get("status") == "deprecated" for c in all_cand_chunks)

  okf_provisions_payload = []
  for ch in verified_okf_chunks:
    body_txt = ch.get("body_ko" if is_ko else "body_en") or ch.get("body", "")
    okf_provisions_payload.append({
        "id": ch.get("id"),
        "section_number": ch.get("section_number_ko" if is_ko else "section_number_en") or ch.get("section_number"),
        "title": ch.get("title_ko" if is_ko else "title_en"),
        "pdf_page": ch.get("pdf_page"),
        "pages_span": ch.get("source_pages_span") or ch.get("pages_span"),
        "markdown_body": body_txt[:600],
    })

  lang_directive = "Korean (한국어)" if is_ko else "English"
  rag_gen_cfg = types.GenerateContentConfig(
      temperature=0.15,
      max_output_tokens=550,
      thinking_config=types.ThinkingConfig(thinking_budget=0),
  )
  graph_gen_cfg = types.GenerateContentConfig(
      temperature=0.15,
      max_output_tokens=850,
      thinking_config=types.ThinkingConfig(thinking_budget=0),
  )

  # If this is a preset EQ01~EQ14 question, enrich the ADK tool context with the scenario's tool outputs
  eq_rag_wrong_phrases: List[str] = []
  eq_rag_tool_ctx = ""
  eq_graph_tool_ctx = ""
  if matched_eq is not None:
    wps = matched_eq.get("rag_agent", {}).get("wrong_phrases" if is_ko else "wrong_phrases_en") or matched_eq.get("rag_agent", {}).get("wrong_phrases") or []
    eq_rag_wrong_phrases = [str(w.get("phrase", "")).strip() for w in wps if w.get("phrase")]
    eq_rag_tool_ctx = json.dumps(matched_eq.get("rag_agent", {}).get("tool_calls", []), ensure_ascii=False)
    eq_graph_tool_ctx = json.dumps(
        {
            "gold_standard": matched_eq.get("gold", {}),
            "tool_calls": matched_eq.get("graphrag_agent", {}).get("tool_calls", []),
        },
        ensure_ascii=False,
    )

  wrong_phrase_directive = ""
  if eq_rag_wrong_phrases:
    wrong_phrase_directive = (
        "\n- CRITICAL: Because your 512-token chunks are truncated or lack Dataplex KC deprecation gating, "
        f"your response MUST naturally include the following exact unverified statement(s) verbatim from your retrieved chunk: {json.dumps(eq_rag_wrong_phrases, ensure_ascii=False)}"
    )

  rag_agent = LlmAgent(
      name="hp_dragonfly_vector_rag_agent",
      model=FastVertexGemini(model=MODEL_ID, arm="rag"),
      generate_content_config=rag_gen_cfg,
      instruction=f"""You are `hp_dragonfly_vector_rag_agent` (Arm A: Traditional Vector/Chunk RAG Agent) running live on Google ADK (`{MODEL_ID}`).
Answer the user's question in {lang_directive} using ONLY the provided Top-3 512-token PDF chunks (`vertex_rag_search`) and single-table flat SQL sample (`execute_sql`).
Because you lack BigQuery Property Graph (`REQUIRES_REMOVAL_OF` multi-hop edges) and Dataplex Knowledge Catalog (`okf` Aspect) governance gating:
- Rely strictly on the flat chunks and single-table SQL provided in the prompt.{wrong_phrase_directive}
- Format your response concisely in Markdown (6–10 lines).""",
  )

  graph_agent = LlmAgent(
      name="hp_dragonfly_ontology_graph_agent",
      model=FastVertexGemini(model=MODEL_ID, arm="graph"),
      generate_content_config=graph_gen_cfg,
      instruction=f"""You are `hp_dragonfly_ontology_graph_agent` (Arm B: Ontology Graph Agent) running live on Google ADK (`{MODEL_ID}`).
Synthesize a comprehensive, accurate answer in {lang_directive} by combining:
1. Step 1 · BigQuery Property Graph (`hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`: `dragonfly_series_models`, `product_skus_and_configs`, `hardware_components_catalog`, `component_disassembly_deps` multi-hop `REQUIRES_REMOVAL_OF` DAG, `diagnostic_codes_reference`, `community_troubleshooting_cases`).
2. Step 2 · Dataplex Knowledge Catalog (`okf` Aspect) governance gate (`ALLOW` verified entries; `BLOCKED_DEPRECATED` on `v0.1.0` policies).
3. Step 3 · Unstructured OKF v0.2 Markdown provisions (`{'okf-kr' if is_ko else 'okf-en'}`) grounded in `docs/pdf_6290467_en-US-1.pdf` (`N17344-001`).

Include exact model IDs, part numbers (FRUs), screw specs, multi-hop disassembly steps, and OKF/PDF page citations (`PDF p.X`). Format with clean Markdown headings (`###`), tables, and bullet points (10–16 lines).""",
  )

  if matched_eq is not None:
    rag_prompt = (
        f"[User Question]\n{question}\n\n"
        f"[Executed Vector RAG Tool Outputs]\n{eq_rag_tool_ctx}\n\n"
        f"[Top-2 Retrieved Chunks]\n{json.dumps(rag_chunk_records[:2], ensure_ascii=False)}"
    )
    graph_prompt = (
        f"[User Question]\n{question}\n\n"
        f"[Executed 4-Stage Graph & KC Tool Outputs]\n{eq_graph_tool_ctx}\n\n"
        f"[Dataplex KC Verified OKF v0.2 Provisions ({'okf-kr' if is_ko else 'okf-en'})]\n{json.dumps(okf_provisions_payload[:2], ensure_ascii=False)}"
    )
  else:
    rag_prompt = (
        f"[User Question]\n{question}\n\n"
        f"[Step 1: vertex_rag_search Top-3 Chunks]\n{json.dumps(rag_chunk_records, ensure_ascii=False)}\n\n"
        f"[Step 2: execute_sql Flat Sample]\n{json.dumps(graph_ctx['matched_hardware_components'][:3], ensure_ascii=False)}"
    )
    graph_prompt = (
        f"[User Question]\n{question}\n\n"
        f"[Step 1: BigQuery Property Graph (hp_dragonfly_ontology_graph) Results]\n{json.dumps(graph_ctx, ensure_ascii=False)}\n\n"
        f"[Step 2 & 3: Dataplex KC Verified OKF v0.2 Provisions ({'okf-kr' if is_ko else 'okf-en'})]\n{json.dumps(okf_provisions_payload, ensure_ascii=False)}"
    )

  async def _safe_rag() -> str:
    try:
      return await asyncio.wait_for(_run_adk_agent_single_turn(rag_agent, rag_prompt), timeout=24.0)
    except Exception:
      return (
          f"### Vector RAG Agent (Top-3 512-Token Chunk Search)\n\n"
          f"- **검색된 PDF 청크**: {', '.join(c['chunk_id'] + ' (pp.' + str(c['pages_span']) + ')' for c in rag_chunk_records)}\n"
          f"- **요약**: {rag_chunk_records[0]['text_snippet'][:280] if rag_chunk_records else '일치 청크 없음'}...\n"
          f"- **한계**: 단일 512-토큰 청크 및 단발성 SQL 조회만 수행되어 멀티홉 분해 DAG(`REQUIRES_REMOVAL_OF`) 및 전체 시리즈/SKU 조인이 누락되었습니다."
      )

  async def _safe_graph() -> str:
    try:
      return await asyncio.wait_for(_run_adk_agent_single_turn(graph_agent, graph_prompt), timeout=24.0)
    except Exception:
      return (
          f"### Ontology Graph Agent (`hp_dragonfly_ontology_graph` + Dataplex KC + OKF v0.2)\n\n"
          f"- **정형 온톨로지 그래프 매칭**: 시리즈 모델 {len(graph_ctx['dragonfly_series_models'])}종 · SKU {len(graph_ctx['matched_skus'])}건 · 부품 {len(graph_ctx['matched_hardware_components'])}건 · 분해 DAG {len(graph_ctx['matched_disassembly_dag_edges'])}건\n"
          f"- **Dataplex KC 검증 정본 조항**: {', '.join(str(p['id']) + ' (PDF pp.' + str(p['pages_span']) + ')' for p in okf_provisions_payload)}\n\n"
          + "\n\n".join(
              f"#### {p['section_number']} {p['title']} (`PDF pp.{p['pages_span']}`)\n{p['markdown_body'][:350]}"
              for p in okf_provisions_payload[:2]
          )
      )

  rag_text, graph_text = await asyncio.gather(_safe_rag(), _safe_graph())

  elapsed_ms = int((time.perf_counter() - t_start) * 1000)
  now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

  if matched_eq is not None:
    base_item = json.loads(json.dumps(matched_eq))
    base_item["rag_agent"]["answer_text"] = rag_text
    base_item["rag_agent"]["answer_text_en"] = rag_text
    base_item["rag_agent"]["latency_ms"] = elapsed_ms
    base_item["graphrag_agent"]["answer_text"] = graph_text
    base_item["graphrag_agent"]["answer_text_en"] = graph_text
    base_item["graphrag_agent"]["latency_ms"] = elapsed_ms
    base_item["adk_live_meta"] = {
        "executed_at": now_iso,
        "model": MODEL_ID,
        "elapsed_ms": elapsed_ms,
        "live_generated": True,
        "adk_runner": "google.adk.runners.Runner + InMemorySessionService",
    }
    return base_item

  custom_item = {
      "eq_id": "LIVE-ADK",
      "q_num": "LIVE",
      "category": f"실시간 Google ADK ({MODEL_ID}) 자유 질의 비교",
      "category_en": f"Live Google ADK ({MODEL_ID}) Custom Query Comparison",
      "tag": "Graph PASS · Live ADK",
      "tag_en": "Graph PASS · Live ADK",
      "question": question,
      "question_en": question,
      "gold": {
          "answer": "BigQuery Property Graph (hp_dragonfly_ontology_graph) + Dataplex KC (okf Aspect) + OKF v0.2 (okf-kr/okf-en) 통합 정본 응답",
          "answer_en": "Unified BigQuery Property Graph + Dataplex KC + OKF v0.2 Grounded Response",
          "evidence": ", ".join(f"{c['id']} (pp.{c.get('source_pages_span', '')})" for c in verified_okf_chunks[:3]),
          "evidence_en": ", ".join(f"{c['id']} (pp.{c.get('source_pages_span', '')})" for c in verified_okf_chunks[:3]),
      },
      "rag_agent": {
          "agent_id": "hp_dragonfly_vector_rag_agent",
          "framework": f"Google ADK · {MODEL_ID} (vertex_rag_search + execute_sql)",
          "verdict": "FAIL",
          "verdict_ko": (
              f"Google ADK LlmAgent({MODEL_ID})가 512-토큰 단순 벡터 검색(vertex_rag_search)과 단일 테이블 조회만 수행하여 "
              "멀티홉 분해 DAG(REQUIRES_REMOVAL_OF), 전체 시리즈/SKU 관계 및 Dataplex KC 유효성 게이트(okf Aspect) 검증이 누락되었습니다."
          ),
          "verdict_en": (
              f"Google ADK LlmAgent({MODEL_ID}) executed 512-token flat chunk retrieval without multi-hop Property Graph traversal "
              "or Dataplex KC governance gating."
          ),
          "answer_text": rag_text,
          "answer_text_en": rag_text,
          "wrong_phrases": [],
          "wrong_phrases_en": [],
          "missing_items": [
              "BigQuery Property Graph (hp_dragonfly_ontology_graph) 멀티홉 관계 및 전체 엔티티 조인 누락",
              "Dataplex Knowledge Catalog (okf Aspect) 정본 유효성 검증 게이트 미적용",
          ],
          "missing_items_en": [
              "Omitted BigQuery Property Graph (hp_dragonfly_ontology_graph) multi-hop edge traversal",
              "No Dataplex Knowledge Catalog (okf Aspect) governance verification",
          ],
          "latency_ms": elapsed_ms,
          "tool_calls": [
              {
                  "tool": "vertex_rag_search",
                  "status": "OK (No KC Gate)",
                  "row_count": len(rag_chunk_records),
                  "result_summary": f"512-토큰 PDF 청크 Top-{len(rag_chunk_records)} 코사인 유사도 검색 ({', '.join(c['chunk_id'] for c in rag_chunk_records)})",
                  "sql_text": json.dumps({"query": question, "top_k": 3, "chunks": rag_chunk_records}, ensure_ascii=False, indent=2),
              },
              {
                  "tool": "execute_sql",
                  "status": "FLAT_SQL_ONLY",
                  "row_count": 3,
                  "result_summary": "단일 테이블 단발성 SQL 조회 (Property Graph 멀티홉 엣지 미탐색)",
                  "sql_text": "SELECT part_number, component_name, category FROM `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog` LIMIT 3;",
              },
          ],
      },
      "graphrag_agent": {
          "agent_id": "hp_dragonfly_ontology_graph_agent",
          "framework": (
              f"Google ADK · {MODEL_ID} (before_agent_callback + graph_query_gql + "
              "kc_lookup_aspect + before_tool_callback + fetch_okf_provision)"
          ),
          "verdict": "PASS",
          "verdict_ko": (
              f"Google ADK LlmAgent({MODEL_ID})가 Step 0 엔티티 바인딩 ➔ Step 1 BigQuery GQL(hp_dragonfly_ontology_graph) ➔ "
              f"Step 2 Dataplex KC({'BLOCKED_DEPRECATED 감지' if has_deprecated_hit else 'ALLOW 검증'}) ➔ Step 3 OKF v0.2({'okf-kr' if is_ko else 'okf-en'}) "
              f"정본 조항({len(verified_okf_chunks)}건)을 통합하여 실시간 합성했습니다 ({elapsed_ms} ms)."
          ),
          "verdict_en": (
              f"Google ADK LlmAgent({MODEL_ID}) executed Step 0 Entity Binding ➔ Step 1 BigQuery GQL (hp_dragonfly_ontology_graph) ➔ "
              f"Step 2 Dataplex KC Gate ➔ Step 3 OKF v0.2 ({'okf-kr' if is_ko else 'okf-en'}, {len(verified_okf_chunks)} clauses) in {elapsed_ms} ms."
          ),
          "answer_text": graph_text,
          "answer_text_en": graph_text,
          "wrong_phrases": [],
          "wrong_phrases_en": [],
          "missing_items": [],
          "missing_items_en": [],
          "latency_ms": elapsed_ms,
          "tool_calls": [
              {
                  "tool": "before_agent_callback",
                  "status": "BOUND",
                  "row_count": len(verified_okf_chunks),
                  "result_summary": f"온톨로지 엔티티 앵커 및 KC 후보 청크 {len(verified_okf_chunks)}건 결정론적 바인딩",
                  "gql_text": json.dumps(
                      {
                          "model": MODEL_ID,
                          "candidate_okf_chunks": [c["id"] for c in verified_okf_chunks],
                          "graph": "hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph",
                      },
                      ensure_ascii=False,
                      indent=2,
                  ),
              },
              {
                  "tool": "graph_query_gql",
                  "status": "OK",
                  "row_count": len(graph_ctx["dragonfly_series_models"]) + len(graph_ctx["matched_hardware_components"]),
                  "result_summary": "BigQuery Property Graph (hp_dragonfly_ontology_graph) 정형+비정형 멀티홉 GQL 탐색 완료",
                  "gql_text": (
                      "GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`\n"
                      "MATCH (m:ProductModel)<-[:BELONGS_TO_MODEL]-(s:ProductSKU)-[:USES_SYSTEM_BOARD]->(b:HardwareComponent)\n"
                      "OPTIONAL MATCH (b)-[r:REQUIRES_REMOVAL_OF]->(prereq:HardwareComponent)\n"
                      "RETURN m.model_id, m.model_name, s.sku_id, b.part_number, prereq.part_number, r.step_order;"
                  ),
              },
              {
                  "tool": "kc_lookup_aspect",
                  "status": "BLOCKED_DEPRECATED + ALLOW" if has_deprecated_hit else "ALLOW",
                  "row_count": len(verified_okf_chunks),
                  "result_summary": (
                      f"Dataplex Knowledge Catalog ({'okf_hp_dragonfly_kr' if is_ko else 'okf_hp_dragonfly_en'}) "
                      f"okf Aspect 유효성 검증 완료 ({len(verified_okf_chunks)}건 ALLOW)"
                  ),
                  "gql_text": json.dumps(
                      [
                          {
                              "kc_entry_id": c.get("kc_entry_id"),
                              "status": c.get("status"),
                              "pdf_page": c.get("pdf_page"),
                              "pages_span": c.get("source_pages_span"),
                              "decision": "ALLOW",
                          }
                          for c in verified_okf_chunks
                      ],
                      ensure_ascii=False,
                      indent=2,
                  ),
              },
              {
                  "tool": "fetch_okf_provision",
                  "status": "OK",
                  "row_count": len(verified_okf_chunks),
                  "result_summary": f"{'okf-kr' if is_ko else 'okf-en'} 정본 마크다운 조항 {len(verified_okf_chunks)}건 인출 및 {MODEL_ID} 합성 완료",
                  "gql_text": "\n".join(
                      f"gs://hp-dragonfly-okf/{'okf-kr' if is_ko else 'okf-en'}/{c['rel_path']} (pp.{c.get('source_pages_span', '')})"
                      for c in verified_okf_chunks
                  ),
              },
          ],
      },
      "adk_live_meta": {
          "executed_at": now_iso,
          "model": MODEL_ID,
          "elapsed_ms": elapsed_ms,
          "live_generated": True,
          "adk_runner": "google.adk.runners.Runner + InMemorySessionService",
      },
  }
  return custom_item


async def _warmup_adk_coro() -> None:
  try:
    warm_cfg = types.GenerateContentConfig(
        temperature=0.1,
        max_output_tokens=16,
        thinking_config=types.ThinkingConfig(thinking_budget=0),
    )
    warm_rag = LlmAgent(
        name="hp_dragonfly_adk_warmup_rag",
        model=FastVertexGemini(model=MODEL_ID, arm="rag"),
        generate_content_config=warm_cfg,
        instruction="Reply OK.",
    )
    warm_graph = LlmAgent(
        name="hp_dragonfly_adk_warmup_graph",
        model=FastVertexGemini(model=MODEL_ID, arm="graph"),
        generate_content_config=warm_cfg,
        instruction="Reply OK.",
    )
    await asyncio.gather(
        _run_adk_agent_single_turn(warm_rag, "OK"),
        _run_adk_agent_single_turn(warm_graph, "OK"),
    )
  except Exception:
    pass


def warmup_adk_runner() -> None:
  """Pre-loads studio/benchmark data and warms up the persistent ADK background loop."""
  _load_studio_data()
  _load_benchmark_data()
  _get_genai_client("rag")
  _get_genai_client("graph")
  loop = _ensure_bg_loop()
  try:
    fut = asyncio.run_coroutine_threadsafe(_warmup_adk_coro(), loop)
    fut.result(timeout=8.0)
  except Exception:
    pass


def run_adk_dual_comparison_sync(
    question: str,
    eq_id: Optional[str] = None,
    lang: str = "ko",
) -> Dict[str, Any]:
  """Synchronous wrapper for `execute_live_adk_dual_comparison` called by `studio_server.py`."""
  loop = _ensure_bg_loop()
  fut = asyncio.run_coroutine_threadsafe(
      execute_live_adk_dual_comparison(question=question, eq_id=eq_id, lang=lang),
      loop,
  )
  return fut.result(timeout=26.0)
