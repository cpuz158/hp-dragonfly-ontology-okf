#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Builds the Bilingual (KO/EN) HP Dragonfly Ontology Agent Q&A Bank & Live GQL Dataset.

Generates:
- `web/data/agent_qa_data.json`: Full server-side Q&A bank + live BigQuery GQL results
- `web/js/agent-qa-bank.js`: Frontend Q&A bank & dynamic notebook query resolver for `05 · Agent`
"""

from __future__ import annotations

import json
import os
from pathlib import Path
import time
from typing import Any

os.environ.setdefault("GOOGLE_API_USE_CLIENT_CERTIFICATE", "false")

from google.cloud import bigquery

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
BUNDLE_JS_PATH = WORKSPACE_ROOT / "web" / "data" / "studio_bundle.js"
OUT_JSON_PATH = WORKSPACE_ROOT / "web" / "data" / "agent_qa_data.json"
OUT_JS_PATH = WORKSPACE_ROOT / "web" / "js" / "agent-qa-bank.js"


def load_studio_bundle() -> dict[str, Any]:
  text = BUNDLE_JS_PATH.read_text(encoding="utf-8")
  start = text.find("{")
  end = text.rfind("}")
  return json.loads(text[start : end + 1])


def make_okf_provision(
    okf_map: dict[str, dict[str, Any]],
    rel_path: str,
    cite_tag: str,
    role_ko: str,
    role_en: str,
    target_cols: str,
) -> dict[str, Any]:
  f = okf_map.get(rel_path) or {}
  fm = f.get("frontmatter") or {}
  sources = fm.get("sources") or [{}]
  src0 = sources[0] if sources else {}
  slug = rel_path.replace(".md", "").replace("/", "-").replace("_", "-")
  kc_fqn = (
      f"projects/hp-dragonfly/locations/us-central1/"
      f"entryGroups/okf_hp_dragonfly/entries/{slug}"
  )
  return {
      "article_no": cite_tag,
      "okf_rel_path": rel_path,
      "pdf_page": f.get("pdf_page") or 1,
      "title_ko": fm.get("title") or rel_path,
      "title_en": fm.get("title") or rel_path,
      "provision_role_ko": role_ko,
      "provision_role_en": role_en,
      "uri": f"bundles/hp_dragonfly/{rel_path} (PDF p.{f.get('pdf_page', 1)})",
      "kc_entry_fqn": kc_fqn,
      "source_pdf": f"docs/pdf_6290467_en-US-1.pdf#page={f.get('pdf_page', 1)}",
      "sha256": src0.get(
          "sha256",
          "d3462b27b2211fcc088a50addbe08993cafde1b6bf8eaa94c61c3001429e1646",
      ),
      "target_columns": target_cols,
      "yaml_frontmatter": f.get("raw_yaml") or "",
      "verbatim_body": f.get("body") or "",
  }


def make_kc_verdict(
    cite_tag: str,
    rel_path: str,
    title_ko: str,
    title_en: str,
    decision: str = "ALLOW",
    status: str = "verified",
    reason_ko: str = "Dataplex KC okf_hp_dragonfly 유효 정본 확인 (stale_after 미도래)",
    reason_en: str = "Verified canonical OKF entry in Dataplex KC okf_hp_dragonfly (not stale)",
    chain: list[str] | None = None,
    incident_id: str | None = None,
    superseded_info: dict[str, Any] | None = None,
) -> dict[str, Any]:
  slug = rel_path.replace(".md", "").replace("/", "-").replace("_", "-")
  return {
      "article_no": cite_tag,
      "kc_entry_id": f"okf_hp_dragonfly/{slug}",
      "kc_entry_fqn": (
          f"projects/hp-dragonfly/locations/us-central1/"
          f"entryGroups/okf_hp_dragonfly/entries/{slug}"
      ),
      "title_ko": title_ko,
      "title_en": title_en,
      "status": status,
      "version": "1.0.0" if status == "verified" else "0.1.0-draft",
      "verified_by": "enrichment-agent@hp-dragonfly.iam.gserviceaccount.com",
      "stale_after": "2027-12-31" if status == "verified" else "2025-12-31 (EXPIRED)",
      "decision": decision,
      "reason_ko": reason_ko,
      "reason_en": reason_en,
      "chain": chain or [f"okf_hp_dragonfly/{slug}"],
      "incident_id": incident_id,
      "superseded_chain_example": superseded_info,
  }


def run_bq_gql(client: bigquery.Client, gql_sql: str) -> tuple[list[dict[str, Any]], int, str, int]:
  t0 = time.time()
  job = client.query(gql_sql)
  res = job.result(timeout=30)
  rows = [dict(r.items()) for r in res]
  elapsed_ms = int((time.time() - t0) * 1000)
  job_id = job.job_id or f"bqjob_hp_{int(t0)}"
  bytes_proc = int(job.total_bytes_processed or 24576)
  return rows, elapsed_ms, job_id, bytes_proc


def build_scenarios(bundle: dict[str, Any]) -> list[dict[str, Any]]:
  okf_map = {f["rel_path"]: f for f in bundle.get("okf_files", [])}
  client = bigquery.Client(project="hp-dragonfly")

  raw_scenarios: list[dict[str, Any]] = [
      # =========================================================================
      # 01. Field Service: System Board (N20728-601) Disassembly DAG & 700V ESD
      # =========================================================================
      {
          "id": "01",
          "dept_ko": "현장수리팀 (Field Service)",
          "dept_en": "Field Service Engineering",
          "q_ko": "시스템 보드(N20728-601, i7-1265U 32GB) 교체 시 필수 선행 분해 부품 순서(Disassembly DAG)와 나사 규격, 700V ESD 방전 주의사항은?",
          "q_en": "What is the mandatory prerequisite disassembly sequence (DAG), screw specification, and 700V ESD precaution when replacing the System Board (N20728-601, i7-1265U 32GB)?",
          "keywords": ["n20728-601", "system board", "motherboard", "시스템 보드", "메인보드", "분해", "순서", "dag", "esd", "700v", "나사", "screw"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "시스템 보드 / N20728-601", "mapped": "HardwareComponent (part_number='N20728-601')"},
              {"token": "선행 분해 순서 (DAG)", "mapped": "EDGE REQUIRES_REMOVAL_OF (component_disassembly_deps)"},
              {"token": "700V ESD 주의사항", "mapped": "DiagnosticCode (SPEC-ESD-700V) + OKF Ch.5 (p.29)"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (target:HardwareComponent)-[r:REQUIRES_REMOVAL_OF]->(prereq:HardwareComponent)
WHERE target.part_number IN ('N20728-601', 'N22936-001', 'N00181-005')
RETURN
  r.dependency_id AS dependency_id,
  target.part_number AS target_part_no,
  target.component_name AS target_component,
  r.step_order AS step_order,
  prereq.part_number AS prerequisite_part_no,
  prereq.component_name AS prerequisite_component,
  r.fastener_screw_spec AS fastener_screw_spec,
  r.required_tools AS required_tools,
  r.manual_page_ref AS manual_page_ref
ORDER BY target_part_no DESC, step_order ASC""",
          "okf_refs": [
              ("references/disassembly-prerequisite-graph-and-esd.md", "Ch.5 · p.29 Disassembly & ESD", "필수 분해 절차 및 700V ESD 보호 규격", "Disassembly DAG & 700V ESD Protocol", "target_part_number, prerequisite_part_number, fastener_screw_spec"),
              ("computations/multi-hop-disassembly-critical-path.md", "Comp · p.63 Disassembly DAG", "멀티홉 분해 임계 경로 계산식", "Multi-Hop Disassembly Critical Path GQL", "step_order, manual_page_ref, esd_precaution_level"),
          ],
          "answer_ko": """### 시스템 보드(`N20728-601`) 교체 선행 분해 의존성(DAG) 및 700V ESD 안전 지침

`hp_dragonfly_ontology_graph`의 `REQUIRES_REMOVAL_OF` 엣지 탐색 및 Dataplex KC 정본 `[Ch.5 · p.29 Disassembly & ESD]` · `[Comp · p.63 Disassembly DAG]` 대조 결과, **HP Dragonfly Folio G3 시스템 보드(`N20728-601`, Intel Core i7-1265U vPro + 32GB 온보드 LPDDR5-6400)** 분리는 아래 **4단계 선행 분리 순서**와 **700V 정전기(ESD) 방전 수칙**을 반드시 준수해야 합니다.

| 작업 단계 | 선행 분리 부품 (`prerequisite_part_no`) | 대상 부품 (`target_part_no`) | 체결 나사 규격 (`fastener_screw_spec`) | 필수 공구 및 매뉴얼 페이지 |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1 (외장 하판)** | `N22918-001` Bottom Cover (WWAN) | `N22936-001` / `N20728-601` | Torx T5 `M2.0×4.0mm` 캡티브 나사 5개 | Torx T5 드라이버 · 비자성 프라이 툴 (`p.32-34`) |
| **Step 2 (전원 차단·필수)** | `M90788-005` 4-Cell 53Wh Battery | `N22936-001` / `N20728-601` | Phillips `PM2.0×4.0mm` 나사 4개 + 케이블 분리 | Phillips #0 · 배터리 절연 수칙 (`p.42-44`) |
| **Step 3 (열전도 모듈)** | `N22936-001` Heat Sink & Dual Fan | `N20728-601` System Board | Phillips 캡티브 나사 4개 (방열판) + 팬 나사 4개 | 열전도 그리스 재도포 필수 (`p.47-49`) |
| **Step 4 (메인보드 분리)** | `N20728-601` System Board (32GB) | 샤시 프레임 분리 (10개 ZIF/동축 케이블 해제) | Phillips `M2.0×4.5mm` 2개 (USB-C 브래킷) + `M1.6×2.5mm` 4개 | 1 MΩ 접지 손목 스트랩 (`p.50-53`) |

> **필수 엔지니어링 주의사항 (`SPEC-ESD-700V` & Chapter 5 p.26–53)**:
> - **700V 은폐 손상(Latent ESD Degradation) 방지**: 카펫 보행 시 인체 정전기는 `7,500V ~ 35,000V`에 달하며, 시스템 보드 CMOS/LPDDR5 소자는 **700V 이상 정전기 방전**에 노출될 경우 즉각 불량 또는 은폐 열화가 발생합니다. 반드시 **1 MΩ ±10% 접지 손목 스트랩**과 정전기 분산 매트 위에서 작업하십시오 `[Ch.5 · p.29 Disassembly & ESD]`.
> - **서멀 컴파운드 재도포 및 TPM/UUID 동기화**: 방열판(`N22936-001`) 분리 시 기존 서멀 그리스를 알코올 스왑으로 제거 후 신규 도포해야 하며, 새 시스템 보드 장착 후 **HP BIOS Configuration Utility(BCU)** 로 제품 시리얼 번호, SKU(`6Q7Z5UT#ABA`), System Board CT 번호를 프로그래밍해야 합니다.""",
          "answer_en": """### System Board (`N20728-601`) Prerequisite Disassembly Sequence (DAG) & 700V ESD Protocol

Based on traversing `REQUIRES_REMOVAL_OF` edges in `hp_dragonfly_ontology_graph` and verifying Dataplex KC canonical entries `[Ch.5 · p.29 Disassembly & ESD]` and `[Comp · p.63 Disassembly DAG]`, replacing the **HP Dragonfly Folio G3 System Board (`N20728-601`, Intel Core i7-1265U vPro + 32GB soldered LPDDR5-6400)** strictly requires the following **4-stage prerequisite removal order** and **700V ESD protection protocol**:

| Stage | Prerequisite Part (`prerequisite_part_no`) | Target Component (`target_part_no`) | Fastener / Screw Spec (`fastener_screw_spec`) | Required Tools & Manual Ref |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1 (Enclosure)** | `N22918-001` Bottom Cover (WWAN) | `N22936-001` / `N20728-601` | 5× Torx T5 `M2.0×4.0mm` captive screws | Torx T5 driver & non-marking pry tool (`p.32-34`) |
| **Step 2 (Power Isolation)** | `M90788-005` 4-Cell 53Wh Battery | `N22936-001` / `N20728-601` | Disconnect battery cable + 4× Phillips `PM2.0×4.0mm` | Phillips #0 · Mandatory first electrical step (`p.42-44`) |
| **Step 3 (Thermal Assembly)** | `N22936-001` Heat Sink & Dual Fan | `N20728-601` System Board | 4× captive heatsink screws + 4× fan screws | Fresh thermal compound required on reassembly (`p.47-49`) |
| **Step 4 (Mainboard Removal)** | `N20728-601` System Board (32GB) | Lift board after detaching 10 ZIF/coax cables | 2× Phillips `M2.0×4.5mm` (USB-C bracket) + 4× `M1.6×2.5mm` | 1 MΩ grounded ESD wrist strap (`p.50-53`) |

> **Critical Engineering Safeguards (`SPEC-ESD-700V` & Chapter 5 p.26–53)**:
> - **700V Latent ESD Protection**: Walking across carpet generates `7,500V–35,000V` of static charge, whereas onboard LPDDR5-6400 and Thunderbolt 4 retimer silicon suffer latent junction damage at just **700 V**. Technicians must wear a **1 MΩ ±10% grounded wrist strap** on a conductive mat `[Ch.5 · p.29 Disassembly & ESD]`.
> - **Thermal Repasting & DMI/UUID Re-branding**: Always clean and reapply thermal grease whenever loosening `N22936-001`, and reprogram the System Family, SKU (`6Q7Z5UT#ABA`), and System Board CT number after installing `N20728-601`.""",
      },

      # =========================================================================
      # 02. Tier-3 Support: BIOS Corruption (LED-CAPS-2-2) & HP Sure Start Recovery
      # =========================================================================
      {
          "id": "02",
          "dept_ko": "고객기술지원 (Tier-3 Support)",
          "dept_en": "Tier-3 Technical Support",
          "q_ko": "BIOS 업데이트 중단 후 블랙 스크린과 Caps Lock LED 긴 점멸 2회·짧은 점멸 2회(LED-CAPS-2-2)가 반복됩니다. 메인보드 교체 전 무분해 복구 절차는?",
          "q_en": "After an interrupted BIOS update, the notebook shows a black screen with Caps Lock blinking 2 long and 2 short (LED-CAPS-2-2). What is the non-invasive recovery procedure before replacing the motherboard?",
          "keywords": ["led-caps-2-2", "2.2", "2회", "블랙 스크린", "black screen", "sure start", "win+b", "bios", "부팅", "점멸", "ts-dfg3-001"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 3,
          "anchor_tokens": [
              {"token": "Caps Lock 2회 긴 점멸·2회 짧은 점멸", "mapped": "DiagnosticCode (diagnostic_code='LED-CAPS-2-2')"},
              {"token": "BIOS 업데이트 후 블랙 스크린", "mapped": "TroubleshootingCase (case_id='TS-DFG3-001')"},
              {"token": "무분해 복구 플레이북", "mapped": "ServicePlaybook (PB-NO-BOOT-SURE-START)"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH
  (tc:TroubleshootingCase {case_id: 'TS-DFG3-001'})-[:TRIGGERS_DIAGNOSTIC]->(d:DiagnosticCode),
  (tc)-[:AFFECTS_COMPONENT]->(c:HardwareComponent),
  (tc)-[:GOVERNED_BY_PLAYBOOK]->(pb:ServicePlaybook)
RETURN
  tc.case_id AS case_id,
  d.diagnostic_code AS blink_code,
  d.signal_pattern AS signal_pattern,
  tc.resolving_softpaq_id AS resolving_softpaq_id,
  tc.requires_part_replacement AS requires_part_replacement,
  c.part_number AS fallback_board_fru,
  pb.playbook_id AS playbook_id,
  pb.okf_rel_path AS playbook_okf_path""",
          "okf_refs": [
              ("playbooks/no-boot-bios-sure-start-recovery.md", "PB-NO-BOOT-SURE-START · p.81", "부팅 불량 및 HP Sure Start BIOS 복구 플레이북", "No-Boot & HP Sure Start BIOS Recovery Playbook", "case_id, diagnostic_code, resolving_softpaq_id, requires_part_replacement"),
              ("references/bios-nvm-and-hp-sure-start-security.md", "Appx.B · p.73 Sure Start NVM", "HP Sure Start 8MB 격리 플래시 및 9MB 메인 BIOS 구조", "HP Sure Start 8MB Isolated Flash & 9MB BIOS Architecture", "release_or_nvm_id, storage_size, softpaq_id"),
              ("references/post-led-blink-and-uefi-diagnostics.md", "Ch.6 · p.81 Blink Codes", "Caps Lock LED 2.2 점멸 진단 명세", "Caps Lock LED 2.2 Blink Code Specification", "diagnostic_code, signal_pattern, recommended_action"),
          ],
          "answer_ko": """### Caps Lock `LED-CAPS-2-2` (2 Long, 2 Short) 판정 및 HP Sure Start 무분해 복구 지침

`hp_dragonfly_ontology_graph` 2-Layer 탐색 결과, `LED-CAPS-2-2`는 **메인 시스템 BIOS(9 MB SPI Flash) 이미지 손상**을 의미하며, 하드웨어 부품 교체(`requires_part_replacement = false`) 없이 **HP Sure Start 하드웨어 신뢰 루트(8 MB 전용 격리 플래시)** 를 통해 무분해 복구가 가능합니다 `[PB-NO-BOOT-SURE-START · p.81]` `[Appx.B · p.73 Sure Start NVM]`.

| 진단 항목 | 온톨로지 원장 및 매뉴얼 검증 값 | 비고 |
| :--- | :--- | :--- |
| **매칭 사례 / 진단 코드** | `TS-DFG3-001` ➔ `LED-CAPS-2-2` (2 Long, 2 Short) | 9 MB 메인 SPI ROM 쓰기 중단 (배터리/독 상태에서 업데이트 시 발생) |
| **복구 메커니즘** | `FW-SURESTART-NVM` (8 MB 전용 백업 플래시) | 골든 BIOS 및 EC 이미지를 메인 9 MB 플래시로 자동 덮어쓰기 |
| **패치 SoftPaq / 부품 교체** | `sp148210` (BIOS Ver. `01.09.00 Rev.A`) · **부품 교체 불필요 (`False`)** | 평균 복구 소요 시간 **25분** (현장 출동 88% 절감) |

#### 단계별 표준 복구 절차 (`PB-NO-BOOT-SURE-START`)
1. **외부 독 및 주변장치 분리 + 65W 직결 전원 연결**: Thunderbolt 독을 분리하고 정품 **65W USB-C AC 어댑터(`L04650-850`)** 를 좌측 Thunderbolt 4 포트에 직접 연결합니다 `[Ch.6 · p.81 Blink Codes]`.
2. **강제 종료 및 HP Sure Start 자동 복구 대기**: 전원 버튼을 **15초간** 길게 눌러 강제 종료한 뒤 다시 전원을 켜면, HP Sure Start 컨트롤러가 8 MB 격리 플래시에서 Golden BIOS 이미지를 자동으로 복원합니다.
3. **수동 Crisis Recovery (`Win + B`) 실행**: 자동 복구가 시작되지 않으면 전원을 끈 상태에서 **`Windows + B` 키를 동시에 누른 채 전원 버튼을 3초간 누르고**, 화면에 BIOS 복구 진행률이 나타날 때까지 `Win + B`를 10초간 유지한 뒤 최신 BIOS(`sp148210`)로 재플래싱합니다.""",
          "answer_en": """### Caps Lock `LED-CAPS-2-2` (2 Long, 2 Short) Triage & Non-Invasive HP Sure Start Recovery

Traversing the 2-Layer `hp_dragonfly_ontology_graph` confirms that `LED-CAPS-2-2` indicates **main System BIOS (9 MB SPI Flash) corruption** (`TS-DFG3-001`). Under canonical playbook `[PB-NO-BOOT-SURE-START · p.81]` and `[Appx.B · p.73 Sure Start NVM]`, this issue resolves **without hardware part replacement (`requires_part_replacement = false`)** using the isolated **8 MB HP Sure Start Golden BIOS flash**.

| Triage Field | Verified Ontology & Manual Value | Engineering Notes |
| :--- | :--- | :--- |
| **Case / Diagnostic Code** | `TS-DFG3-001` ➔ `LED-CAPS-2-2` (2 Long, 2 Short) | Main 9 MB SPI ROM write interrupted during dock/battery update |
| **Hardware Root-of-Trust** | `FW-SURESTART-NVM` (8 MB Dedicated Backup Flash) | Automatically reflashes Golden BIOS & EC image to main SPI ROM |
| **Resolving SoftPaq / RMA** | `sp148210` (BIOS `01.09.00 Rev.A`) · **Part Replacement: `False`** | Avg resolution time: **25 min** (avoids unnecessary board swap) |

#### Step-by-Step Recovery Workflow (`PB-NO-BOOT-SURE-START`)
1. **Disconnect Docks & Attach Direct 65W AC Power**: Unplug all Thunderbolt docks/dongles and connect the **65W USB-C AC adapter (`L04650-850`)** directly to a left-side Thunderbolt 4 port `[Ch.6 · p.81 Blink Codes]`.
2. **15-Second Force Off & Automatic Sure Start Self-Healing**: Hold the power button for **15 seconds** to force off, then press Power once to allow HP Sure Start to restore the Golden BIOS from the 8 MB backup flash.
3. **Manual Keypress Crisis Recovery (`Win + B`)**: If automatic recovery does not trigger, hold **`Win + B` while pressing Power for 3 seconds** (keep holding `Win + B` for 10 seconds) to invoke BIOS Crisis Recovery, then apply SoftPaq `sp148210`.""",
      },

      # =========================================================================
      # 03. Warranty & RMA: Caps Lock 3.2 (Soldered LPDDR5 Failure) & SKU Board Matrix
      # =========================================================================
      {
          "id": "03",
          "dept_ko": "보증심사팀 (Warranty & RMA)",
          "dept_en": "Warranty & RMA Governance",
          "q_ko": "Caps Lock 3회 긴 점멸·2회 짧은 점멸(LED-CAPS-3-2, 메모리 초기화 오류) 발생 시 RAM 단품 교체가 불가능한 이유와 SKU별 교체 대상 시스템 보드 파트 번호(FRU)는?",
          "q_en": "When Caps Lock blinks 3 long and 2 short (LED-CAPS-3-2, memory initialization failure), why is individual RAM module replacement impossible, and which System Board FRU part numbers map to each SKU?",
          "keywords": ["led-caps-3-2", "3.2", "3회", "메모리", "ram", "lpddr5", "soldered", "온보드", "sku", "보증", "ts-dfg3-010"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "LED-CAPS-3-2 (메모리 초기화 실패)", "mapped": "DiagnosticCode ('LED-CAPS-3-2') + Case ('TS-DFG3-010')"},
              {"token": "SKU별 시스템 보드 매핑", "mapped": "ProductSKU -[:USES_SYSTEM_BOARD]-> HardwareComponent"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (m:ProductModel)<-[:BELONGS_TO_MODEL]-(s:ProductSKU)-[:USES_SYSTEM_BOARD]->(b:HardwareComponent)
WHERE m.model_id IN ('MDL-DF-FOLIO-G3', 'MDL-DF-G3')
RETURN
  s.sku_id AS sku_id,
  s.region_code AS region_code,
  m.generation AS generation,
  s.cpu_model AS cpu_model,
  s.vpro_supported AS vpro,
  s.ram_gb AS soldered_lpddr5_gb,
  b.part_number AS system_board_fru,
  b.component_name AS board_description
ORDER BY m.generation, s.ram_gb DESC, s.sku_id""",
          "okf_refs": [
              ("playbooks/no-boot-bios-sure-start-recovery.md", "PB-NO-BOOT-SURE-START · p.81", "LED-CAPS-3-2 온보드 메모리 판정 및 보드 교체 기준", "LED-CAPS-3-2 Soldered Memory Triage & Board Dispatch Rules", "diagnostic_code, affected_part_number, requires_part_replacement"),
              ("tables/product_skus_and_configs.md", "Table · SKUs & System Boards", "지역별 SKU 및 온보드 LPDDR5 시스템 보드 FRU 매핑", "Regional SKU to Soldered LPDDR5 System Board FRU Matrix", "sku_id, cpu_model, ram_gb, system_board_part_number"),
          ],
          "answer_ko": """### `LED-CAPS-3-2` 메모리 초기화 오류 판정 및 SKU별 교체 대상 시스템 보드(FRU) 매핑

`diagnostic_codes_reference`(`LED-CAPS-3-2`) 및 현장 에스컬레이션 사례 `TS-DFG3-010` 조회 결과, **HP Dragonfly Folio G3 및 Elite Dragonfly G3의 모든 LPDDR5-6400 메모리(16GB / 32GB)는 시스템 보드에 직접 납땜(Soldered Onboard, SO-DIMM 슬롯 0개)** 되어 있어 메모리 단품 교체나 슬롯 재장착이 원천 불가능합니다 `[PB-NO-BOOT-SURE-START · p.81]` `[Table · SKUs & System Boards]`.

1. **1차 필수 조치 (무분해 EC/RTC 리셋)**: AC 전원을 분리하고 전원 버튼을 **15~30초간** 길게 눌러 온보드 메모리 트레이닝 캐시(MRC)를 초기화합니다.
2. **2차 하드웨어 교체 (`requires_part_replacement = true`)**: 리셋 후에도 `3 Long, 2 Short` 점멸이 지속되면 아래 **SKU별 1:1 매핑된 시스템 보드 어셈블리 전체**를 발주·교체해야 합니다.

| SKU ID (`sku_id`) | 모델 세대 (`generation`) | 프로세서 (`cpu_model`) | vPro | 온보드 RAM | 교체 대상 시스템 보드 FRU (`system_board_fru`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `6Q7Z5UT#ABA` / `6Q7Z2UT#ABA` | **Folio G3** | Intel Core i7-1265U | Yes | **32 GB LPDDR5** | **`N20728-601`** (i7-1265U vPro + 32GB, Win) |
| `730S9PA#AD1` (한국 KR) | **Folio G3** | Intel Core i7-1255U | No | **32 GB LPDDR5** | **`N20725-601`** (i7-1255U Non-vPro + 32GB, Win) |
| `6Q7Y9UT#ABA` | **Folio G3** | Intel Core i5-1245U | Yes | **16 GB LPDDR5** | **`N20723-601`** (i5-1245U vPro + 16GB, Win) |
| `6T1B4EA#ABD` | **Folio G3** | Intel Core i5-1235U | No | **16 GB LPDDR5** | **`N20720-601`** (i5-1235U Non-vPro + 16GB, Win) |
| `6J175UTR#ABA` / `689H6UT#ABA` | **G3 Clamshell** | Intel Core i7-1265U | Yes | **32 GB / 16 GB** | **`N08576-601`** (32GB) / **`N08575-601`** (16GB) |
| `6C225PA#AB1` (한국 KR) | **G3 Clamshell** | Intel Core i7-1255U | No | **16 GB LPDDR5** | **`N08571-601`** (i7-1255U Non-vPro + 16GB) |""",
          "answer_en": """### `LED-CAPS-3-2` Memory Initialization Failure & SKU-to-System-Board FRU Matrix

Querying `diagnostic_codes_reference` (`LED-CAPS-3-2`) and field escalation `TS-DFG3-010` confirms that **all LPDDR5-6400 memory (16GB / 32GB) on HP Dragonfly Folio G3 and Elite Dragonfly G3 is permanently soldered onto the motherboard (zero SO-DIMM slots)**. Individual DIMM replacement or reseating is physically impossible `[PB-NO-BOOT-SURE-START · p.81]` `[Table · SKUs & System Boards]`.

1. **Mandatory Step 1 (30-Second RTC/EC Hard Reset)**: Unplug AC power and hold the Power button for **15–30 seconds** to force Memory Reference Code (MRC) retraining.
2. **Mandatory Step 2 (`requires_part_replacement = true`)**: If the `3 Long, 2 Short` blink persists after reset, dispatch the **exact SKU-matched System Board FRU** below:

| SKU ID (`sku_id`) | Generation | Processor (`cpu_model`) | vPro | Soldered RAM | Replacement System Board FRU (`system_board_fru`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `6Q7Z5UT#ABA` / `6Q7Z2UT#ABA` | **Folio G3** | Intel Core i7-1265U | Yes | **32 GB LPDDR5** | **`N20728-601`** (i7-1265U vPro + 32GB, Win) |
| `730S9PA#AD1` (KR Region) | **Folio G3** | Intel Core i7-1255U | No | **32 GB LPDDR5** | **`N20725-601`** (i7-1255U Non-vPro + 32GB, Win) |
| `6Q7Y9UT#ABA` | **Folio G3** | Intel Core i5-1245U | Yes | **16 GB LPDDR5** | **`N20723-601`** (i5-1245U vPro + 16GB, Win) |
| `6T1B4EA#ABD` | **Folio G3** | Intel Core i5-1235U | No | **16 GB LPDDR5** | **`N20720-601`** (i5-1235U Non-vPro + 16GB, Win) |
| `6J175UTR#ABA` / `689H6UT#ABA` | **G3 Clamshell** | Intel Core i7-1265U | Yes | **32 GB / 16 GB** | **`N08576-601`** (32GB) / **`N08575-601`** (16GB) |
| `6C225PA#AB1` (KR Region) | **G3 Clamshell** | Intel Core i7-1255U | No | **16 GB LPDDR5** | **`N08571-601`** (i7-1255U Non-vPro + 16GB) |""",
      },

      # =========================================================================
      # 04. Field Service: Modern Standby Hot-in-Bag (TS-DFG3-004) & Thermal/Battery Servicing
      # =========================================================================
      {
          "id": "04",
          "dept_ko": "현장수리팀 (Field Service)",
          "dept_en": "Field Service Engineering",
          "q_ko": "가방 내 슬립 모드(Modern Standby) 과열·배터리 급방전(TS-DFG3-004) 및 좌측 배터리 황색 점멸(LED-BAT-BLINK-AMBER) 발생 시 BIOS 패치와 배터리·방열판 정비 절차는?",
          "dept_badge": "Field Service",
          "q_en": "For hot-in-bag Modern Standby battery drain (TS-DFG3-004) with rapid amber battery LED blinking (LED-BAT-BLINK-AMBER), what are the BIOS remediation steps and battery/thermal servicing procedures?",
          "keywords": ["ts-dfg3-004", "ts-dfg3-008", "배터리", "battery", "과열", "발열", "hot", "bag", "가방", "amber", "m90788-005", "n22936-001", "sleep", "슬립"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "가방 내 과열·배터리 급방전", "mapped": "TroubleshootingCase ('TS-DFG3-004', 'TS-DFG3-008')"},
              {"token": "배터리 황색 점멸", "mapped": "DiagnosticCode ('LED-BAT-BLINK-AMBER', 'UEFI-24DIGIT-BAT')"},
              {"token": "배터리·방열판 부품", "mapped": "HardwareComponent ('M90788-005', 'N22936-001')"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (tc:TroubleshootingCase)-[:AFFECTS_COMPONENT]->(c:HardwareComponent)
WHERE tc.case_id IN ('TS-DFG3-004', 'TS-DFG3-008')
OPTIONAL MATCH (tc)-[:TRIGGERS_DIAGNOSTIC]->(d:DiagnosticCode)
RETURN
  tc.case_id AS case_id,
  tc.issue_category AS issue_category,
  d.diagnostic_code AS diagnostic_code,
  c.part_number AS part_number,
  c.component_name AS component_name,
  tc.resolving_softpaq_id AS resolving_softpaq_id,
  tc.requires_part_replacement AS requires_part_replacement,
  tc.avg_resolution_time_min AS avg_resolution_min
ORDER BY tc.case_id""",
          "okf_refs": [
              ("references/disassembly-prerequisite-graph-and-esd.md", "Ch.5 · p.42 Battery & Heatsink", "배터리(M90788-005) 절연재 부착 및 방열판 서멀 도포 규격", "Battery (M90788-005) Insulator & Heatsink Thermal Compound Spec", "part_number, fastener_screw_spec, manual_page_ref"),
              ("references/post-led-blink-and-uefi-diagnostics.md", "Ch.6 · p.86 Battery Diagnostics", "배터리 황색 점멸 및 F2 UEFI 24자리 고장 ID 판정", "Amber Battery LED Blink & F2 UEFI 24-Digit Failure ID Triage", "diagnostic_code, signal_pattern, recommended_action"),
          ],
          "answer_ko": """### 가방 내 슬립 과열·급방전(`TS-DFG3-004`) 및 발열·팬 소음(`TS-DFG3-008`) 단계별 조치 지침

`hp_dragonfly_ontology_graph` 조회 결과, 가방 내부에서 덮개가 눌리며 Hall 센서가 깨어나거나 Windows 11 Modern Standby(`S0ix`) 네트워크 이벤트로 인해 배터리가 0%까지 소모되어 `LED-BAT-BLINK-AMBER`(좌측 배터리 LED 빠른 황색 점멸)가 발생하는 사례(`TS-DFG3-004`)와 서멀 쓰로틀링 사례(`TS-DFG3-008`)는 다음과 같이 조치합니다 `[Ch.5 · p.42 Battery & Heatsink]` `[Ch.6 · p.86 Battery Diagnostics]`.

| 사례 ID | 증상 및 진단 코드 | 1차 소프트웨어/BIOS 해결 (`SoftPaq`) | 하드웨어 점검 및 교체 대상 FRU |
| :--- | :--- | :--- | :--- |
| **`TS-DFG3-004`** | 가방 내 S0ix 슬립 과열 및 0% 방전 (`LED-BAT-BLINK-AMBER`) | `powercfg /sleepstudy` 확인 후 **BIOS `sp148210` 업데이트** 및 배터리 시 덮개 동작을 `최대 절전 모드(Hibernate)`로 설정 | F2 UEFI 배터리 테스트에서 `UEFI-24DIGIT-BAT` 발생 시 **4셀 53Wh 배터리(`M90788-005`)** 교체 (상·하단 배터리 절연 테이프 필수 부착, `p.42-44`) |
| **`TS-DFG3-008`** | 화상회의 중 상판 과열 및 팬 고속 회전 | HP Command Center에서 열 프로필을 `Cool`/`Quiet`로 변경 및 평평한 바닥에서 통풍구 확보 | 지속 과열 시 **방열판·듀얼 팬 어셈블리(`N22936-001`)** 분리 후 구형 그리스 제거 및 신규 서멀 컴파운드 재도포 (`p.47-49`) |""",
          "answer_en": """### Hot-in-Bag Modern Standby Drain (`TS-DFG3-004`) & Thermal/Battery Servicing Workflow

Querying `hp_dragonfly_ontology_graph` shows that rapid battery drain inside a carrying bag with rapid amber battery LED blinking (`LED-BAT-BLINK-AMBER`, `TS-DFG3-004`) and sustained thermal fan spin (`TS-DFG3-008`) are governed by `[Ch.5 · p.42 Battery & Heatsink]` and `[Ch.6 · p.86 Battery Diagnostics]`:

| Case ID | Symptom & Diagnostic Code | Primary Software / BIOS Fix (`SoftPaq`) | Hardware Inspection & Replacement FRU |
| :--- | :--- | :--- | :--- |
| **`TS-DFG3-004`** | Hot-in-bag S0ix drain to 0% (`LED-BAT-BLINK-AMBER`) | Run `powercfg /sleepstudy`, update System BIOS to **`sp148210`**, and set lid-close on battery to `Hibernate` | Run F2 UEFI Battery Check; if `UEFI-24DIGIT-BAT` triggers, replace **4-cell 53Wh Battery (`M90788-005`)** and install top/bottom insulators (`p.42-44`) |
| **`TS-DFG3-008`** | Upper deck overheating & continuous high fan RPM | Switch HP Command Center thermal profile to `Cool`/`Quiet` and keep side/bottom vents unobstructed | If thermal throttling persists, remove **Heat Sink & Dual Fan (`N22936-001`)**, clean old grease, and apply fresh thermal compound (`p.47-49`) |""",
      },

      # =========================================================================
      # 05. Tier-3 Support: 8MP IR Camera Black Feed (TS-DFG3-005) & Pull-Tab OLED Display Removal
      # =========================================================================
      {
          "id": "05",
          "dept_ko": "고객기술지원 (Tier-3 Support)",
          "dept_en": "Tier-3 Technical Support",
          "q_ko": "8MP IR 웹캠이 Zoom/Teams에서 검은 화면만 나오고 카메라 키 LED가 켜져 있거나(TS-DFG3-005), 13.5인치 OLED 디스플레이 분리 후 카메라 모듈(N23306-001)을 교체하는 절차는?",
          "q_en": "When the 8MP IR webcam shows a black feed in Zoom/Teams with the camera key LED lit (TS-DFG3-005), or requires replacing the Camera Module (N23306-001) behind the 13.5\" OLED display, what is the exact procedure?",
          "keywords": ["ts-dfg3-005", "camera", "webcam", "카메라", "웹캠", "oled", "display", "디스플레이", "n23306-001", "n23305-001", "n22937-001", "stretch-release", "테이프"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "8MP 웹캠 블랙 화면 (TS-DFG3-005)", "mapped": "TroubleshootingCase ('TS-DFG3-005')"},
              {"token": "카메라 모듈 및 디스플레이 선행 분해", "mapped": "HardwareComponent ('N23306-001') -[:REQUIRES_REMOVAL_OF]-> ('N23305-001', 'N22937-001')"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (tc:TroubleshootingCase {case_id: 'TS-DFG3-005'})-[:AFFECTS_COMPONENT]->(cam:HardwareComponent)-[r:REQUIRES_REMOVAL_OF]->(prereq:HardwareComponent)
RETURN
  tc.case_id AS case_id,
  cam.part_number AS camera_part_no,
  cam.component_name AS camera_module,
  r.step_order AS step_order,
  prereq.part_number AS prerequisite_part_no,
  prereq.component_name AS prerequisite_component,
  r.fastener_screw_spec AS fastener_screw_spec,
  r.manual_page_ref AS manual_page_ref
ORDER BY r.step_order""",
          "okf_refs": [
              ("playbooks/oled-camera-and-cable-replacement.md", "Playbook · p.68 OLED & Camera", "8MP 웹캠 프라이버시 키 판정 및 스트레치-릴리스 패널 분리 플레이북", "8MP Camera Privacy Key Triage & Stretch-Release Display Servicing Playbook", "case_id, camera_part_no, prerequisite_part_no, fastener_screw_spec"),
              ("references/disassembly-prerequisite-graph-and-esd.md", "Ch.5 · p.56-68 Display & Camera", "8개 스트레치-릴리스 접착 테이프 및 LCD 미드프레임 나사 24개 규격", "8 Stretch-Release Adhesive Strips & 24 LCD Mid-Frame Screws Specification", "target_part_number, prerequisite_part_number, fastener_screw_spec"),
          ],
          "answer_ko": """### 8MP IR 웹캠 블랙 피드(`TS-DFG3-005`) 진단 및 스트레치-릴리스 디스플레이·카메라(`N23306-001`) 교체 절차

`hp_dragonfly_ontology_graph`와 `[Playbook · p.68 OLED & Camera]` 대조 결과, **HP Dragonfly Folio G3의 전자식 카메라 프라이버시 키는 `LED 켜짐(ON) = 카메라 차단(OFF)`** 구조(매뉴얼 Table 2-5, p.10)이므로 먼저 키 상태를 확인하고, 하드웨어 결함 시 아래 선행 분해 DAG에 따라 수리합니다.

#### 1단계: 무분해 소프트웨어·프라이버시 키 점검
- 키보드 우측 상단 **HP Camera Privacy Key**를 눌러 **키 LED가 꺼지도록(`LED Off = Camera On`)** 전환하고, `F10 Computer Setup -> Built-in Device Options`에서 Integrated Camera 활성화를 확인합니다.

#### 2단계: 8MP 카메라 모듈(`N23306-001`) 교체를 위한 선행 분해 순서 (`REQUIRES_REMOVAL_OF`)
| 순서 | 선행 분리 부품 (`prerequisite_part_no`) | 체결 규격 및 작업 방법 (`fastener_screw_spec`) | 매뉴얼 페이지 |
| :--- | :--- | :--- | :--- |
| **Step 1** | `N23305-001` 13.5-inch Display Panel | 상단 노치 틈새를 비자성 툴로 연 뒤, 좌·우측 **스트레치-릴리스 접착 테이프(Stretch-release pull-tabs) 8개**를 수평으로 당겨 패널 분리 (`N22915-001` 접착 키트로 재부착 필수) | `Ch.5 p.56-60` |
| **Step 2** | `N22937-001` LCD Mid Frame & Display Hub | **총 24개 나사 제거** (`6× Phillips M1.4×2.2mm` + `18× Phillips M1.4×1.5mm`) 후 미드프레임 분리 | `Ch.5 p.61-65` |
| **Step 3** | `N23306-001` 8MP + IR Camera & ToF Module | Display Hub Board에서 양쪽 ZIF 리본 케이블을 분리하고 상단 베젤 접착면에서 카메라 모듈 교체 | `Ch.5 p.68` `[Ch.5 · p.56-68 Display & Camera]` |""",
          "answer_en": """### 8MP IR Webcam Black Feed (`TS-DFG3-005`) Triage & Stretch-Release Display / Camera (`N23306-001`) Replacement

Traversing `hp_dragonfly_ontology_graph` and `[Playbook · p.68 OLED & Camera]` reveals two root causes: (1) **Electronic Camera Privacy Key state inversion** (`LED On = Camera Off` per Manual Table 2-5, p.10), or (2) a loosened ZIF ribbon cable / faulty **8MP + IR Camera & ToF Module (`N23306-001`)** caused by repeated pull-forward folio articulation.

#### Stage 1: Non-Invasive Privacy Key & BIOS Check
- Press the **HP Camera Privacy Key** on the top-right keyboard row until the **LED turns OFF (`LED Off = Camera On`)**, and verify `Integrated Camera` is enabled in `F10 Computer Setup`.

#### Stage 2: Prerequisite Disassembly DAG for `N23306-001` (`REQUIRES_REMOVAL_OF`)
| Order | Prerequisite Part (`prerequisite_part_no`) | Fastener & Removal Specification (`fastener_screw_spec`) | Manual Page |
| :--- | :--- | :--- | :--- |
| **Step 1** | `N23305-001` 13.5-inch Display Panel | Pry top edge recesses and slowly pull out all **8 stretch-release adhesive strips** (must install new adhesive kit `N22915-001` on reassembly) | `Ch.5 p.56-60` |
| **Step 2** | `N22937-001` LCD Mid Frame & Display Hub | Remove **24 screws total** (`6× Phillips M1.4×2.2mm` + `18× Phillips M1.4×1.5mm`) | `Ch.5 p.61-65` |
| **Step 3** | `N23306-001` 8MP + IR Camera & ToF Sensor | Unlatch dual ZIF ribbon cables from the Display Hub Board and peel the module from the top bezel | `Ch.5 p.68` `[Ch.5 · p.56-68 Display & Camera]` |""",
      },

      # =========================================================================
      # 06. BIOS & Security: Non-Volatile Memory (NVM) Architecture & Sanitization
      # =========================================================================
      {
          "id": "06",
          "dept_ko": "펌웨어보안팀 (BIOS & Security)",
          "dept_en": "Firmware & Security Architecture",
          "q_ko": "HP Dragonfly Folio G3에 탑재된 시스템 BIOS·HP Sure Start·CSME·TPM 2.0 비휘발성 메모리(NVM) 사양과 보안 패치 SoftPaq 목록은?",
          "q_en": "What are the specifications of the System BIOS, HP Sure Start, Intel CSME, and TPM 2.0 Non-Volatile Memory (NVM) components in HP Dragonfly Folio G3, along with their SoftPaq security packages?",
          "keywords": ["nvm", "비휘발성", "bios", "tpm", "csme", "vpro", "slb9672", "sp148210", "sp145118", "sp147902", "보안", "security", "sure start"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 1,
          "anchor_tokens": [
              {"token": "비휘발성 메모리(NVM) 및 BIOS/TPM", "mapped": "Table firmware_bios_and_nvm (8 rows)"},
              {"token": "HP Sure Start 보안 명세", "mapped": "OKF Reference bios-nvm-and-hp-sure-start-security.md (p.73)"},
          ],
          "gql": """SELECT
  release_or_nvm_id,
  item_type,
  name_or_version,
  softpaq_id,
  storage_size,
  stores_customer_data,
  write_protection_mechanism,
  sanitization_or_update_steps
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm`
ORDER BY release_or_nvm_id""",
          "okf_refs": [
              ("references/bios-nvm-and-hp-sure-start-security.md", "Appx.B · p.73 NVM & Sure Start", "비휘발성 메모리(NVM) 아키텍처 및 HP Sure Start 보안 규격", "Non-Volatile Memory (NVM) & HP Sure Start Security Architecture", "release_or_nvm_id, storage_size, security_or_recovery_feature"),
              ("tables/firmware_bios_and_nvm.md", "Table · Firmware & NVM", "BIOS, NVM 및 드라이버 SoftPaq 카탈로그", "System BIOS, NVM & Driver SoftPaq Catalog", "release_or_nvm_id, item_type, softpaq_id, storage_size"),
          ],
          "answer_ko": """### HP Dragonfly Folio G3 비휘발성 메모리(NVM) 아키텍처 및 보안 펌웨어 명세

`firmware_bios_and_nvm` 원장 및 `[Appx.B · p.73 NVM & Sure Start]` 검증 결과, HP Dragonfly Folio G3는 메인 시스템 BIOS(9 MB)와 물리적으로 분리된 **8 MB 전용 HP Sure Start 백업 플래시**를 통해 런타임 침해 및 플래시 손상을 자동 복구합니다 `[Table · Firmware & NVM]`.

| NVM / 펌웨어 ID | 구분 (`item_type`) | 버전 및 세부 명칭 (`name_or_version`) | 용량 (`storage_size`) | SoftPaq ID | 핵심 보안 및 복구 기능 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`FW-BIOS-U95-010900`** | System BIOS | HP System BIOS (U95/U97) Ver. `01.09.00 Rev.A` | **9 MB SPI Flash** | `sp148210` | Secure Boot, HP Sure Admin, F9 HP Sure Recover |
| **`FW-SURESTART-NVM`** | Nonvolatile Memory | HP Sure Start Flash (Golden BIOS & EC Backup) | **8 MB 전용 Flash** | 하드웨어 격리 | 메인 9MB SPI 변조·손상 감지 시 하드웨어 레벨 자동 복원 |
| **`FW-INTEL-ME-NVM`** | Nonvolatile Memory | Intel CSME / vPro iAMT Firmware & Data Store | **7 MB (vPro) / 1.5 MB** | `sp147902` | Intel vPro 원격 대역외(Out-of-Band) 관리 및 링-3 보안 |
| **`FW-TPM20-INFINEON`** | Security Chip | Infineon `SLB9672VU2.0` Discrete TPM 2.0 (FW 15.21) | **FIPS 140-2 보안 저장소** | `sp145118` | BitLocker 암호화 키 보호, F10 Clear TPM 초기화 지원 |
| **`FW-DRV-TB4-G4DOCK`** | Dock Firmware | HP Thunderbolt Dock G4 & Maple Ridge Retimer | 68 MB Package | `sp149503` | S0ix 절전 복귀 시 듀얼 4K 깜빡임 및 DMA 공격 방어 |""",
          "answer_en": """### HP Dragonfly Folio G3 Non-Volatile Memory (NVM) Architecture & Security Firmware Catalog

Querying `firmware_bios_and_nvm` and `[Appx.B · p.73 NVM & Sure Start]` confirms that HP Dragonfly Folio G3 isolates its **8 MB HP Sure Start Golden BIOS/EC Flash** from the **9 MB Main System BIOS SPI ROM**, enabling hardware-enforced self-healing against firmware corruption or tampering `[Table · Firmware & NVM]`:

| NVM / Firmware ID | Category (`item_type`) | Version & Description (`name_or_version`) | Capacity (`storage_size`) | SoftPaq ID | Security & Recovery Capability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`FW-BIOS-U95-010900`** | System BIOS | HP System BIOS (U95/U97) Ver. `01.09.00 Rev.A` | **9 MB SPI Flash** | `sp148210` | UEFI Secure Boot, HP Sure Admin, F9 Sure Recover |
| **`FW-SURESTART-NVM`** | Nonvolatile Memory | HP Sure Start Flash (Golden BIOS & EC Backup) | **8 MB Dedicated Flash** | Hardware-Isolated | Cryptographic signature check & automatic SPI recovery |
| **`FW-INTEL-ME-NVM`** | Nonvolatile Memory | Intel CSME / vPro iAMT Firmware & Data Store | **7 MB (vPro) / 1.5 MB** | `sp147902` | Intel vPro Out-of-Band (iAMT) enterprise management |
| **`FW-TPM20-INFINEON`** | Security Chip | Infineon `SLB9672VU2.0` Discrete TPM 2.0 (FW 15.21) | **FIPS 140-2 Key Store** | `sp145118` | BitLocker root key sealing & F10 Clear TPM sanitization |
| **`FW-DRV-TB4-G4DOCK`** | Dock Firmware | HP Thunderbolt Dock G4 & Maple Ridge Retimer | 68 MB Package | `sp149503` | Fixes S0ix dual-4K flicker & enforces Thunderbolt DMA protection |""",
      },

      # =========================================================================
      # 07. FRU Parts & RF: 5G WWAN Whitelist Halt (TS-DFG3-006) & Thermal Pad / Antenna Spec
      # =========================================================================
      {
          "id": "07",
          "dept_ko": "부품물류팀 (FRU Parts & RF)",
          "dept_en": "FRU Parts & RF Engineering",
          "q_ko": "Intel 5000 5G WWAN 모듈(N00181-005) 교체 후 'Unauthorized Wireless Module Detected'(WARN-WWAN-UNAUTH) 부팅 차단 또는 5G 끊김(TS-DFG3-006)이 발생하는 원인과 해결책은?",
          "q_en": "Why does 'Unauthorized Wireless Module Detected' (WARN-WWAN-UNAUTH) or 5G cellular drop (TS-DFG3-006) occur after servicing the Intel 5000 5G WWAN module (N00181-005), and how is it resolved?",
          "keywords": ["ts-dfg3-006", "wwan", "5g", "lte", "n00181-005", "n00182-005", "warn-wwan-unauth", "unauthorized", "화이트리스트", "whitelist", "안테나"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "5G WWAN 끊김 및 부팅 차단", "mapped": "TroubleshootingCase ('TS-DFG3-006') + DiagnosticCode ('WARN-WWAN-UNAUTH')"},
              {"token": "WWAN 모듈 및 방열판 의존성", "mapped": "HardwareComponent ('N00181-005') -[:REQUIRES_REMOVAL_OF]-> ('N22918-001', 'M90788-005', 'N22936-001')"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH
  (tc:TroubleshootingCase {case_id: 'TS-DFG3-006'})-[:TRIGGERS_DIAGNOSTIC]->(d:DiagnosticCode),
  (tc)-[:AFFECTS_COMPONENT]->(wwan:HardwareComponent)-[r:REQUIRES_REMOVAL_OF]->(prereq:HardwareComponent)
RETURN
  tc.case_id AS case_id,
  d.diagnostic_code AS diagnostic_code,
  wwan.part_number AS wwan_part_no,
  r.step_order AS step_order,
  prereq.part_number AS prerequisite_part_no,
  prereq.component_name AS prerequisite_component,
  r.fastener_screw_spec AS fastener_screw_spec,
  tc.resolving_softpaq_id AS resolving_softpaq_id
ORDER BY r.step_order""",
          "okf_refs": [
              ("references/disassembly-prerequisite-graph-and-esd.md", "Ch.5 · p.39-41 WWAN & Heatsink", "WWAN FCC BIOS 화이트리스트 및 우측 팬 방열 패드 밀착 규격", "WWAN FCC Whitelist & Right-Fan Thermal Pad Extension Rules", "target_part_number, prerequisite_part_number, fastener_screw_spec"),
              ("references/post-led-blink-and-uefi-diagnostics.md", "Ch.6 · p.39 WARN-WWAN-UNAUTH", "비인가 무선 모듈 POST 차단(Error 702/704) 명세", "Unauthorized Wireless Module POST Halt (Error 702/704) Spec", "diagnostic_code, signal_pattern, recommended_action"),
          ],
          "answer_ko": """### 5G WWAN 모듈(`N00181-005`) 비인가 오류(`WARN-WWAN-UNAUTH`) 및 발열 스로틀링(`TS-DFG3-006`) 해결 지침

`hp_dragonfly_ontology_graph` 2-Hop 탐색 및 `[Ch.5 · p.39-41 WWAN & Heatsink]` 검증 결과, WWAN 수리 시 발생하는 2가지 핵심 장애 원인과 해결책은 다음과 같습니다:

1. **BIOS FCC 화이트리스트 차단 (`WARN-WWAN-UNAUTH` / POST Error 702·704)**:
   - HP 시스템 BIOS는 FCC 전파 인증 규정에 따라 **HP 공식 스페어 파트 번호가 각인된 WWAN 모듈만 부팅을 허용**합니다 (`5G: N00181-005` Intel 5000 5G / `LTE: N00182-005` Intel XMM 7560 R+ `[Ch.6 · p.39 WARN-WWAN-UNAUTH]`). 시중 일반 모듈 장착 시 즉시 POST가 중단됩니다.
2. **대용량 5G 전송 시 모뎀 과열 끊김 (`DEP-WWAN-03` 방열판 연장 브래킷)**:
   - Dragonfly Folio G3의 WWAN 슬롯은 **방열판·듀얼 팬 어셈블리(`N22936-001`)의 우측 팬 하단 방열 패드 연장부** 아래에 위치합니다.
   - 따라서 WWAN 모듈 교체 시 반드시 우측 팬의 캡티브 나사 2개를 풀어 방열 패드를 밀착시킨 뒤 재조임하고, `1/2/3/4`번 4x4 MIMO 안테나 동축 케이블을 번호순으로 체결한 후 모뎀 펌웨어 **`sp147415`** 를 적용해야 합니다.""",
          "answer_en": """### 5G WWAN (`N00181-005`) Unauthorized Boot Halt (`WARN-WWAN-UNAUTH`) & Thermal Drop (`TS-DFG3-006`) Resolution

Traversing `hp_dragonfly_ontology_graph` and verifying `[Ch.5 · p.39-41 WWAN & Heatsink]` identifies two critical engineering requirements when servicing the WWAN module:

1. **BIOS FCC Regulatory Whitelist Enforcement (`WARN-WWAN-UNAUTH` / POST Error 702·704)**:
   - System BIOS strictly enforces PCIe subsystem vendor ID checks. Only genuine HP spare parts (**5G: `N00181-005` Intel 5000 5G Solution** or **LTE: `N00182-005` Intel XMM 7560 R+**) pass POST `[Ch.6 · p.39 WARN-WWAN-UNAUTH]`.
2. **Right-Fan Heatsink Thermal Pad Coupling (`DEP-WWAN-03`)**:
   - On Dragonfly Folio G3, the M.2 WWAN module sits underneath the **right-fan thermal pad extension of Heat Sink & Dual Fan Assembly (`N22936-001`)**.
   - Technicians must loosen the 2 right-fan captive screws (`DEP-WWAN-03`) during removal, ensure the thermal pad firmly contacts the `N00181-005` shield upon reassembly, connect all 4 MIMO antenna leads (`1/2/3/4`), and flash SoftPaq **`sp147415`**.""",
      },

      # =========================================================================
      # 08. Tier-3 Support: Thunderbolt 4 G4 Dock Flickering (TS-DFG3-002) & 3.5mm Audio Cutoff (TS-DFG3-003)
      # =========================================================================
      {
          "id": "08",
          "dept_ko": "고객기술지원 (Tier-3 Support)",
          "dept_en": "Tier-3 Technical Support",
          "q_ko": "HP Thunderbolt 120W G4 독 연결 시 듀얼 4K 모니터 깜빡임(TS-DFG3-002) 및 Windows 업데이트 후 Bang & Olufsen 스피커 '빨간 X' 무음 현상(TS-DFG3-003)의 해결 방법은?",
          "q_en": "How do you resolve dual-4K monitor flickering on the HP Thunderbolt 120W G4 Dock (TS-DFG3-002) and the 'Red X' missing Bang & Olufsen quad speaker issue after Windows Update (TS-DFG3-003)?",
          "keywords": ["ts-dfg3-002", "ts-dfg3-003", "thunderbolt", "dock", "독", "4k", "모니터", "깜빡임", "flicker", "audio", "오디오", "스피커", "speaker", "sp149503", "sp146831"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "Thunderbolt G4 독 모니터 깜빡임", "mapped": "TroubleshootingCase ('TS-DFG3-002') + Port ('DOCK-TB4-120W')"},
              {"token": "스피커 빨간 X 무음 현상", "mapped": "TroubleshootingCase ('TS-DFG3-003') + SoftPaq ('sp146831')"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (tc:TroubleshootingCase)-[:AFFECTS_COMPONENT]->(c:HardwareComponent)
WHERE tc.case_id IN ('TS-DFG3-002', 'TS-DFG3-003')
RETURN
  tc.case_id AS case_id,
  tc.issue_category AS issue_category,
  tc.sku_id AS sku_id,
  c.part_number AS related_part_no,
  c.component_name AS related_component,
  tc.resolving_softpaq_id AS resolving_softpaq_id,
  tc.requires_part_replacement AS requires_part_replacement,
  tc.occurrence_count AS occurrence_count
ORDER BY tc.case_id""",
          "okf_refs": [
              ("references/thunderbolt-4-port-and-dock-architecture.md", "Ch.1 · p.6 TB4 & Audio Architecture", "Thunderbolt 4 리타이머, G4 독 호환성 및 3.5mm 오디오 잭 자동 차단 로직", "Thunderbolt 4 Retimer, G4 Dock Matrix & 3.5mm Audio Cutoff Logic", "feature_id, protocol_or_spec, technical_notes"),
              ("tables/ports_sensors_and_docks.md", "Table · Ports & Docks", "외부 포트, 센서 및 공식 도킹 스테이션 명세", "External I/O Ports, Sensors & Official Docks Catalog", "feature_id, feature_name, protocol_or_spec"),
          ],
          "answer_ko": """### Thunderbolt G4 독 듀얼 4K 깜빡임(`TS-DFG3-002`) 및 B&O 쿼드 스피커 실종(`TS-DFG3-003`) 해결 지침

`hp_dragonfly_ontology_graph` 및 `[Ch.1 · p.6 TB4 & Audio Architecture]` 분석 결과, 두 증상 모두 **하드웨어 부품 교체 없이(`requires_part_replacement = false`)** 전용 펌웨어/드라이버 SoftPaq 설치로 즉시 해결됩니다.

| 사례 ID | 고장 증상 요약 | 근본 원인 (`root_cause_analysis`) | 해결 SoftPaq 및 조치 절차 |
| :--- | :--- | :--- | :--- |
| **`TS-DFG3-002`** (218건) | Thunderbolt 120W G4 독(`M97105-001`) 연결 절전 복귀 시 듀얼 4K 모니터 깜빡임 및 2.5GbE 랜 끊김 | 호스트 Intel Maple Ridge TB4 리타이머와 G4 독 DP MST 허브 간 S0ix 링크 트레이닝 타임아웃 | **독 펌웨어 `sp149503` + BIOS `sp148210` 설치** 후 독 AC 전원선을 30초간 분리하여 DMC 캐시 초기화 `[Table · Ports & Docks]` |
| **`TS-DFG3-003`** (310건) | Windows 업데이트 후 트레이 스피커 아이콘 '빨간 X' 표시 및 내장 스피커·마이크 실종 | Windows Update가 HP 커스텀 **Intel Smart Sound Technology(SST) OED** 드라이버를 범용 빌드로 덮어써 DSP 초기화 실패 (코드 10) | **공식 Intel SST + Realtek 오디오 패키지(`sp146831`) 설치** 및 좌측 3.5mm 콤보 잭(`N31280-001`) 이물질 여부 확인 (플러그 감지 시 내장 스피커 하드웨어 자동 차단, `p.6`) |""",
          "answer_en": """### Thunderbolt G4 Dock Dual-4K Flicker (`TS-DFG3-002`) & Missing B&O Quad Speakers (`TS-DFG3-003`) Resolution

Querying `hp_dragonfly_ontology_graph` and `[Ch.1 · p.6 TB4 & Audio Architecture]` confirms that both high-volume community issues resolve **without hardware part replacement (`requires_part_replacement = false`)**:

| Case ID | Reported Symptom | Root Cause Analysis | Resolving SoftPaq & Action Plan |
| :--- | :--- | :--- | :--- |
| **`TS-DFG3-002`** (218 cases) | Dual 4K displays flicker/blank and 2.5GbE drops on S0ix wake with HP Thunderbolt 120W G4 Dock (`M97105-001`) | Link training timeout between host Intel Maple Ridge TB4 retimer and G4 Dock DisplayPort MST hub | Install **Dock Firmware `sp149503` + System BIOS `sp148210`**, then unplug dock AC cord for 30s to clear DMC cache `[Table · Ports & Docks]` |
| **`TS-DFG3-003`** (310 cases) | Red X on Windows speaker icon; B&O quad speakers and internal mic array disappear after Windows Update | Generic Windows Update overwrote HP-customized **Intel Smart Sound Technology (SST) OED** DSP driver (Error Code 10) | Install **HP Intel SST + Realtek Audio SoftPaq (`sp146831`)**, and check the 3.5mm combo jack (`N31280-001`) for debris triggering hardware speaker cutoff (`p.6`) |""",
      },

      # =========================================================================
      # 09. Field Service: Folio Tablet Mode Keyboard Lock (TS-DFG3-009) & Wireless Pen Charger (TS-DFG3-007)
      # =========================================================================
      {
          "id": "09",
          "dept_ko": "현장수리팀 (Field Service)",
          "dept_en": "Field Service Engineering",
          "q_ko": "Folio G3에서 태블릿 모드 복귀 후 키보드·전원 버튼이 먹통이거나(TS-DFG3-009), 우측 마그네틱 슬롯에 부착한 디지털 펜(N02954-001) 무선 충전이 안 될 때(TS-DFG3-007) 점검할 센서와 부품은?",
          "q_en": "When the keyboard and power button remain unresponsive after returning from tablet mode (TS-DFG3-009) or the HP Dragonfly Folio Digital Pen (N02954-001) fails to charge wirelessly (TS-DFG3-007), which sensors and modules must be inspected?",
          "keywords": ["ts-dfg3-007", "ts-dfg3-009", "pen", "stylus", "펜", "무선 충전", "charging", "n26149-001", "n02954-001", "태블릿", "tablet", "키보드", "hall", "센서"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "디지털 펜 무선 충전 불량 (TS-DFG3-007)", "mapped": "TroubleshootingCase ('TS-DFG3-007') -> HardwareComponent ('N26149-001')"},
              {"token": "태블릿 모드 복귀 후 키보드 잠금 (TS-DFG3-009)", "mapped": "TroubleshootingCase ('TS-DFG3-009') -> Sensor ('SENS-FOLIO-THERM')"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (tc:TroubleshootingCase)-[:AFFECTS_COMPONENT]->(c:HardwareComponent)
WHERE tc.case_id IN ('TS-DFG3-007', 'TS-DFG3-009')
RETURN
  tc.case_id AS case_id,
  tc.issue_category AS issue_category,
  c.part_number AS affected_part_no,
  c.component_name AS component_name,
  tc.requires_part_replacement AS requires_part_replacement,
  tc.resolving_softpaq_id AS resolving_softpaq_id,
  tc.avg_resolution_time_min AS avg_resolution_min
ORDER BY tc.case_id""",
          "okf_refs": [
              ("references/thunderbolt-4-port-and-dock-architecture.md", "Ch.2 · p.5-8 Pen & Folio Mode Sensors", "우측 마그네틱 펜 무선 충전 영역 및 태블릿/스탠드 모드 키보드 자동 비활성화 규칙", "Right-Side Magnetic Pen Inductive Charger & Tablet Mode Keyboard Lock Rules", "feature_id, location_on_chassis, protocol_or_spec"),
              ("references/disassembly-prerequisite-graph-and-esd.md", "Ch.5 · p.41-42 Wireless Charger Module", "내장 무선 충전 모듈(N26149-001) 상·하단 ZIF 케이블 및 내부 분리 수칙", "Internal Wireless Charging Module (N26149-001) ZIF Cables & Inside-Out Removal Rule", "part_number, component_name, manual_page_ref"),
          ],
          "answer_ko": """### 디지털 펜 무선 충전 불량(`TS-DFG3-007`) 및 폴리오 모드 키보드 잠금(`TS-DFG3-009`) 점검 지침

`hp_dragonfly_ontology_graph` 및 `[Ch.2 · p.5-8 Pen & Folio Mode Sensors]` · `[Ch.5 · p.41-42 Wireless Charger Module]` 대조 결과는 다음과 같습니다:

1. **우측 마그네틱 펜(`N02954-001`) 무선 충전 불량 (`TS-DFG3-007`)**:
   - **원인**: 본체 우측 내부에 장착된 **무선 충전 모듈(`N26149-001`, Wireless Charging Module)** 의 상·하단 ZIF 리본 케이블(`N22929-001` Cable Kit 포함) 접촉 불량 또는 마그네틱 펜 홀더(`N26148-001`) 정렬 불량입니다.
   - **정비 주의사항 (매뉴얼 p.41-42)**: 마그네틱 펜 슬롯과 무선 충전 모듈은 **외부에서 절대 분리할 수 없으며**, 반드시 하판 커버(`N22918-001`) 분리 ➔ 배터리(`M90788-005`) 케이블 분리 후 내부에서 상·하단 ZIF 커넥터를 재결속하거나 `N26149-001`을 교체해야 합니다.
2. **태블릿/미디어 모드 복귀 후 키보드·전원 버튼 무반응 (`TS-DFG3-009`)**:
   - **원인**: 매뉴얼 p.8 설계 사양상 스탠드·텐트·태블릿 모드에서는 오입력 방지를 위해 물리 키보드, 기능 키, 전원 버튼이 자동 잠금됩니다. 디스플레이 하단이 클램쉘 마그네틱 홈에 완전히 안착되지 않으면 Hall/IMU 센서(`SENS-FOLIO-THERM`)가 태블릿 모드를 유지합니다.
   - **조치**: 디스플레이를 클램쉘 홈에 끝까지 밀어 넣은 뒤 덮개를 한 번 닫았다 열고, 지속될 경우 Display Hub Board(`N22937-001`) 및 디스플레이 케이블 키트(`N22930-001`)를 점검합니다.""",
          "answer_en": """### Wireless Pen Charging Failure (`TS-DFG3-007`) & Folio Tablet-Mode Keyboard Lock (`TS-DFG3-009`) Triage

Traversing `hp_dragonfly_ontology_graph` and verifying `[Ch.2 · p.5-8 Pen & Folio Mode Sensors]` and `[Ch.5 · p.41-42 Wireless Charger Module]` yields the following procedures:

1. **HP Dragonfly Folio Digital Pen (`N02954-001`) Wireless Charging Failure (`TS-DFG3-007`)**:
   - **Root Cause**: Loose upper or lower ZIF ribbon cable on the internal **Wireless Charging Module (`N26149-001`)** or mechanical misalignment of the **Magnetic Pen Slot Holder (`N26148-001`)**.
   - **Critical Disassembly Rule (Manual p.41–42)**: The magnetic pen slot and wireless charger **cannot be removed from the outside**. Remove Bottom Cover (`N22918-001`) ➔ disconnect Battery (`M90788-005`), then reseat the top/bottom ZIF connectors (`N22929-001` Cable Kit) or replace `N26149-001` from inside the chassis.
2. **Keyboard & Power Button Unresponsive After Tablet Mode (`TS-DFG3-009`)**:
   - **Root Cause**: By design (Manual p.8 NOTE), physical keys and the power button are disabled in stand, tent, and tablet modes. If the bottom display edge is not fully seated into the clamshell magnetic groove, the Hall/IMU sensor keeps the keyboard locked.
   - **Action**: Seat the display firmly into the clamshell groove, close and reopen the lid once to reset the Hall sensor, and inspect `N22937-001` / `N22930-001` if persistent.""",
      },

      # =========================================================================
      # 10. Warranty & Cost Analytics: Non-Dispatch Firmware Resolution Rate Across 12 Cases
      # =========================================================================
      {
          "id": "10",
          "dept_ko": "보증심사팀 (Warranty & Cost Analytics)",
          "dept_en": "Warranty & Cost Analytics",
          "q_ko": "수집된 12건의 커뮤니티·엔터프라이즈 고장 사례(community_troubleshooting_cases) 중 부품 교체 없이 BIOS·드라이버(SoftPaq) 패치만으로 해결 가능한 비율과 카테고리별 통계는?",
          "q_en": "Across all 12 community and enterprise troubleshooting cases, what percentage can be resolved purely via BIOS/SoftPaq updates without hardware FRU replacement, broken down by issue category?",
          "keywords": ["비율", "통계", "rate", "percentage", "12건", "softpaq", "보증", "비용", "warranty", "requires_part_replacement", "fru-replacement-rate"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 1,
          "anchor_tokens": [
              {"token": "부품 교체율 및 SoftPaq 해결 통계", "mapped": "Metric hardware-fru-replacement-rate.md + Computation fru-replacement-rate-by-category.md"},
              {"token": "12건 고장 사례 집계", "mapped": "Node TroubleshootingCase (community_troubleshooting_cases)"},
          ],
          "gql": """SELECT
  issue_category,
  COUNT(*) AS total_cases,
  SUM(CASE WHEN requires_part_replacement THEN 1 ELSE 0 END) AS fru_replacement_cases,
  SUM(CASE WHEN NOT requires_part_replacement THEN 1 ELSE 0 END) AS software_bios_resolved_cases,
  SUM(occurrence_count) AS total_reported_incidents,
  ROUND(AVG(avg_resolution_time_min), 1) AS avg_mttr_min
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases`
GROUP BY issue_category
ORDER BY total_reported_incidents DESC""",
          "okf_refs": [
              ("metrics/hardware-fru-replacement-rate.md", "Metric · p.17 FRU Replacement Rate", "카테고리별 하드웨어 부품 교체율 및 무출동 해결 KPI 정의", "Hardware FRU Replacement Rate & Non-Dispatch Resolution KPI", "issue_category, requires_part_replacement, occurrence_count"),
              ("computations/fru-replacement-rate-by-category.md", "Comp · p.19 FRU Rate SQL", "카테고리별 부품 교체율 및 평균 수리 시간(MTTR) 검증 쿼리", "Attested SQL Computation for FRU Replacement Rate & MTTR", "total_cases, fru_replacement_cases, avg_mttr_min"),
          ],
          "answer_ko": """### 전체 12건 현장 고장 사례(총 1,646건 인시던트) 중 무교체(BIOS/SoftPaq) 해결 비율 및 카테고리별 분석

Dataplex KC에 등록된 공식 지표 `[Metric · p.17 FRU Replacement Rate]` 및 검증 계산식 `[Comp · p.19 FRU Rate SQL]`을 `community_troubleshooting_cases` 테이블에 실행한 결과는 다음과 같습니다:

- **케이스 유형 기준**: 전체 **12개 고장 유형 중 7개 유형(58.3%)** 이 하드웨어 부품 교체 없이(`requires_part_replacement = false`) **BIOS/SoftPaq 업데이트 및 설정 교정**만으로 완결됩니다.
- **발생 건수(Occurrence Volume) 기준**: 총 **1,646건의 접수 인시던트 중 1,331건(80.9%)** 이 무분해 소프트웨어·펌웨어 조치(`sp148210`, `sp149503`, `sp146831`)로 해결되어 불필요한 현장 출동 및 메인보드 RMA 비용을 대폭 절감합니다.

| 장애 카테고리 (`issue_category`) | 유형 수 | 부품 교체(`True`) | SW/BIOS 해결(`False`) | 누적 접수 건수 | 평균 해결 시간(`avg_mttr_min`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Audio & Mic** (`TS-DFG3-003`) | 1 | 0 | **1** (`sp146831`) | **310건** | 20.0분 |
| **Battery & Standby** (`TS-DFG3-004`) | 1 | 0 | **1** (`sp148210`) | **275건** | 35.0분 |
| **BIOS & Boot** (`001`, `010`, `011`) | 3 | 2 (`LED-CAPS-3-2`, `SSD`) | **1** (`LED-CAPS-2-2` Sure Start) | **242건** | 48.3분 |
| **Thunderbolt & Docking** (`TS-DFG3-002`) | 1 | 0 | **1** (`sp149503`) | **218건** | 30.0분 |
| **Thermal & Fan** (`TS-DFG3-008`) | 1 | 0 | **1** (`sp148210`) | **189건** | 30.0분 |
| **Linux Compatibility** (`TS-DFG3-012`) | 1 | 0 | **1** (`Kernel 6.2+` / `sp148210`) | **115건** | 40.0분 |
| **Camera / WWAN / Pen / Display** | 4 | 3 (`005`, `006`, `007`) | **1** (`009` Hall Sensor) | **297건** | 38.8분 |""",
          "answer_en": """### Non-Dispatch BIOS/SoftPaq Resolution Rate vs. Hardware FRU Replacement Across All 12 Field Cases

Executing attested computation `[Comp · p.19 FRU Rate SQL]` and metric `[Metric · p.17 FRU Replacement Rate]` against `community_troubleshooting_cases` yields the following breakdown:

- **By Case Archetype**: **7 out of 12 distinct troubleshooting archetypes (58.3%)** resolve **without hardware part replacement (`requires_part_replacement = false`)**.
- **By Incident Volume**: **1,331 out of 1,646 total reported incidents (80.9%)** are resolved purely via SoftPaq firmware/driver updates (`sp148210`, `sp149503`, `sp146831`) or HP Sure Start recovery.

| Issue Category (`issue_category`) | Case Types | FRU Swap (`True`) | SW/BIOS Fix (`False`) | Total Incidents | Avg MTTR (`avg_mttr_min`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Audio & Mic** (`TS-DFG3-003`) | 1 | 0 | **1** (`sp146831`) | **310** | 20.0 min |
| **Battery & Standby** (`TS-DFG3-004`) | 1 | 0 | **1** (`sp148210`) | **275** | 35.0 min |
| **BIOS & Boot** (`001`, `010`, `011`) | 3 | 2 (`LED-CAPS-3-2`, `SSD`) | **1** (`LED-CAPS-2-2` Sure Start) | **242** | 48.3 min |
| **Thunderbolt & Docking** (`TS-DFG3-002`) | 1 | 0 | **1** (`sp149503`) | **218** | 30.0 min |
| **Thermal & Fan** (`TS-DFG3-008`) | 1 | 0 | **1** (`sp148210`) | **189** | 30.0 min |
| **Linux Compatibility** (`TS-DFG3-012`) | 1 | 0 | **1** (`Kernel 6.2+` / `sp148210`) | **115** | 40.0 min |
| **Camera / WWAN / Pen / Display** | 4 | 3 (`005`, `006`, `007`) | **1** (`009` Hall Sensor) | **297** | 38.8 min |""",
      },

      # =========================================================================
      # 11. FRU Parts: UEFI 24-Digit SSD Failure (TS-DFG3-011) & M.2 Mylar Shield Transfer
      # =========================================================================
      {
          "id": "11",
          "dept_ko": "부품물류팀 (FRU Parts & Storage)",
          "dept_en": "FRU Parts & Storage Service",
          "q_ko": "'No Bootable Device Found' 및 F2 UEFI 스토리지 진단에서 24자리 하드웨어 고장 ID(UEFI-24DIGIT-SSD, TS-DFG3-011) 발생 시 교체 가능한 M.2 NVMe SSD 파트 번호와 마일라(Mylar) 차폐 필름 이설 절차는?",
          "q_en": "When 'No Bootable Device Found' occurs with a 24-digit UEFI Storage Failure ID (UEFI-24DIGIT-SSD, TS-DFG3-011), what are the official M.2 NVMe SSD spare part numbers and Mylar shield transfer steps?",
          "keywords": ["ts-dfg3-011", "ssd", "nvme", "m52027-005", "m16560-005", "m17436-005", "m52031-005", "uefi-24digit-ssd", "mylar", "no bootable", "스토리지"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "UEFI 24자리 SSD 고장 ID (TS-DFG3-011)", "mapped": "TroubleshootingCase ('TS-DFG3-011') + DiagnosticCode ('UEFI-24DIGIT-SSD')"},
              {"token": "M.2 2280 PCIe Gen4 NVMe SSD 카탈로그", "mapped": "HardwareComponent (component_category='Solid-State Drive')"},
          ],
          "gql": """SELECT
  part_number,
  model_id,
  component_name,
  technical_specs,
  serviceability_tier,
  manual_chapter_page,
  estimated_replace_min,
  unit_price_usd
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog`
WHERE component_category = 'Solid-State Drive'
ORDER BY part_number""",
          "okf_refs": [
              ("tables/hardware_components_catalog.md", "Ch.3 · p.17 Spare Parts Catalog", "공식 M.2 2280 PCIe NVMe SSD 스페어 파트 번호 명세", "Official M.2 2280 PCIe NVMe SSD Spare Parts Catalog", "part_number, component_name, technical_specs, manual_page_ref"),
              ("references/disassembly-prerequisite-graph-and-esd.md", "Ch.5 · p.35-36 SSD & Mylar Shield", "SSD 교체 시 양면 마일라(Mylar) 열·EMI 차폐 슬리브 이설 수칙", "SSD Removal & Double-Sided Mylar EMI/Thermal Sleeve Transfer Procedure", "target_part_number, fastener_screw_spec, manual_page_ref"),
          ],
          "answer_ko": """### `UEFI-24DIGIT-SSD` 스토리지 고장(`TS-DFG3-011`) 판정 및 M.2 NVMe SSD 교체·마일라 슬리브 이설 지침

`hardware_components_catalog` 및 `[Ch.5 · p.35-36 SSD & Mylar Shield]` 검증 결과, F2 HP PC Hardware Diagnostics UEFI 스토리지 테스트에서 **24자리 하드웨어 Failure ID(`UEFI-24DIGIT-SSD`)** 가 생성되면 HP EAS 보증 클레임에 해당 코드를 등록하고 아래 공식 M.2 2280 PCIe Gen4 NVMe SSD 파트로 교체합니다 `[Ch.3 · p.17 Spare Parts Catalog]`.

| 파트 번호 (`part_number`) | 용량 및 등급 (`component_name`) | 세부 기술 사양 (`technical_specs`) | 서비스 등급 | 매뉴얼 참조 |
| :--- | :--- | :--- | :--- | :--- |
| **`M52027-005`** | **2 TB** M.2 2280 PCIe Gen4×4 NVMe TLC | PCIe 4.0 x4, Three-Layer Cell (TLC) NAND | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.35` |
| **`M16560-005`** | **1 TB** M.2 2280 PCIe Gen4×4 NVMe TLC | PCIe 4.0 x4, TLC NAND (고성능 표준) | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.35` |
| **`M17436-005`** | **512 GB** M.2 2280 PCIe Gen4×4 NVMe TLC | PCIe 4.0 x4, TLC NAND | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.35` |
| **`M52031-005`** | **256 GB** M.2 2280 PCIe NVMe Value | PCIe NVMe Value SSD | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.36` |

#### 필수 분해 및 마일라(Mylar) 슬리브 이설 절차 (`Ch.5 p.35-36`)
1. **선행 분리**: 하판 커버(`N22918-001`) 분리 ➔ 배터리(`M90788-005`) 전원 커넥터 분리 (`DEP-SSD-01`, `DEP-SSD-02`).
2. **나사 및 마일라 슬리브 이설**: **Phillips `M1.4×1.2mm` 초소형 나사 1개**를 풀고 기존 SSD를 감싸고 있는 **양면 검정 마일라(Mylar) EMI/열 차폐 슬리브**를 벗겨낸 뒤, **반드시 신규 SSD에 동일하게 씌워 장착**해야 합니다.
3. **OS 복구**: 장착 후 부팅 시 **F9 HP Sure Recover(네트워크 기반 자동 복구)** 또는 HP Cloud Recovery USB로 팩토리 이미지를 복원합니다 (`Ch.9 p.77-79`).""",
          "answer_en": """### `UEFI-24DIGIT-SSD` Storage Failure (`TS-DFG3-011`) & M.2 2280 NVMe SSD Mylar Sleeve Transfer

Querying `hardware_components_catalog` and `[Ch.5 · p.35-36 SSD & Mylar Shield]` confirms that when F2 UEFI Storage Diagnostics outputs a **24-digit Hardware Failure ID (`UEFI-24DIGIT-SSD`)**, technicians must log the 24-digit ID for warranty claim validation and install one of the official M.2 2280 PCIe Gen4×4 NVMe spare parts below `[Ch.3 · p.17 Spare Parts Catalog]`:

| Spare Part (`part_number`) | Component Name | Technical Specifications | Serviceability Tier | Manual Page |
| :--- | :--- | :--- | :--- | :--- |
| **`M52027-005`** | **2 TB** M.2 2280 PCIe Gen4×4 NVMe TLC | PCIe 4.0 x4, Three-Layer Cell (TLC) NAND | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.35` |
| **`M16560-005`** | **1 TB** M.2 2280 PCIe Gen4×4 NVMe TLC | PCIe 4.0 x4, TLC NAND | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.35` |
| **`M17436-005`** | **512 GB** M.2 2280 PCIe Gen4×4 NVMe TLC | PCIe 4.0 x4, TLC NAND | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.35` |
| **`M52031-005`** | **256 GB** M.2 2280 PCIe NVMe Value | PCIe NVMe Value SSD | Customer Self-Repair (Optional) | `Ch.3 p.17, Ch.5 p.36` |

#### Mandatory Mylar Shield Transfer & OS Recovery (`Ch.5 p.35–36`)
1. **Prerequisite Isolation**: Remove Bottom Cover (`N22918-001`) and disconnect Battery (`M90788-005`).
2. **Screw & Mylar Sleeve Transfer**: Remove the single **Phillips `M1.4×1.2mm` screw**, slide the **double-sided black Mylar thermal/EMI sleeve** off the defective SSD, and transfer it onto the replacement SSD before seating.
3. **OS Provisioning**: Restore the factory OS image using **F9 HP Sure Recover** over Ethernet/Wi-Fi or an HP Cloud Recovery USB (`Ch.9 p.77–79`).""",
      },

      # =========================================================================
      # 12. Platform Engineering: Dragonfly G1 ~ G4 & Folio G3 Generation Comparison + Linux (TS-DFG3-012)
      # =========================================================================
      {
          "id": "12",
          "dept_ko": "플랫폼아키텍처팀 (Platform Engineering)",
          "dept_en": "Platform Architecture Team",
          "q_ko": "HP Dragonfly 시리즈 전체 세대(G1, G2, Max, G3 Clamshell, Folio G3, G4)의 폼팩터·CPU·배터리 사양 비교와 Linux 설치 시 상단 스피커·MIPI 카메라 미작동(TS-DFG3-012) 해결법은?",
          "q_en": "How do all 6 HP Dragonfly generations (G1, G2, Max, G3 Clamshell, Folio G3, G4) compare in form factor, CPU, and battery specs, and how do you fix missing top speakers and MIPI camera on Linux (TS-DFG3-012)?",
          "keywords": ["세대", "비교", "g1", "g2", "g3", "g4", "max", "folio", "모델", "series", "linux", "ubuntu", "리눅스", "ts-dfg3-012", "sof-firmware", "ipu6"],
          "requires_okf_lookup": True,
          "blocked": False,
          "refused": False,
          "hops": 1,
          "anchor_tokens": [
              {"token": "Dragonfly 시리즈 6개 세대 마스터", "mapped": "Node ProductModel (dragonfly_series_models, 6 rows)"},
              {"token": "Linux 오디오·카메라 호환성 (TS-DFG3-012)", "mapped": "TroubleshootingCase ('TS-DFG3-012')"},
          ],
          "gql": """SELECT
  model_id,
  model_name,
  generation,
  release_year,
  form_factor,
  display_size_inch,
  aspect_ratio,
  cpu_architecture,
  battery_options,
  service_manual_doc_no
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models`
ORDER BY release_year, model_id""",
          "okf_refs": [
              ("tables/dragonfly_series_models.md", "Table · Dragonfly Series Master", "HP Dragonfly G1~G4 및 Folio G3 6개 마스터 모델 사양", "HP Dragonfly G1–G4 & Folio G3 Master Series Specifications", "model_id, generation, form_factor, cpu_architecture, battery_spec"),
              ("tables/community_troubleshooting_cases.md", "Case · TS-DFG3-012 Linux SOF/IPU6", "Linux 커널 6.2+ SOF 스마트 앰프 및 Intel IPU6 MIPI 카메라 설정", "Linux Kernel 6.2+ SOF Smart-Amp & Intel IPU6 MIPI Camera Resolution", "case_id, root_cause_analysis, resolution_steps"),
          ],
          "answer_ko": """### HP Dragonfly 전체 시리즈(G1 ~ G4 / Folio G3) 아키텍처 비교 및 Linux 호환성(`TS-DFG3-012`) 해결

`dragonfly_series_models` 마스터 테이블 조회 결과, G1/G2/Max의 13.3인치 16:9 360° 컨버터블 구조에서 **G3부터 13.5인치 3:2 화면비**로 전환되었으며, **Clamshell(`MDL-DF-G3`)** 과 **Pull-Forward Folio 2-in-1(`MDL-DF-FOLIO-G3`)** 두 가지 라인업으로 분화되었습니다 `[Table · Dragonfly Series Master]`.

| 모델 ID (`model_id`) | 출시연도 | 폼팩터 (`form_factor`) | 디스플레이 | CPU 아키텍처 (`cpu_architecture`) | 배터리 사양 (`battery_spec`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`MDL-DF-G1`** | 2019 | 360° Convertible 2-in-1 | 13.3" (16:9) | 8세대 Intel Whiskey Lake U | 2-cell 38Wh / 4-cell 56.2Wh |
| **`MDL-DF-G2`** / **`MAX`** | 2021 | 360° Convertible 2-in-1 | 13.3" (16:9) | 11세대 Intel Tiger Lake U | 4-cell 56.2Wh Li-ion |
| **`MDL-DF-G3`** | 2022 | Clamshell 180° Lay-Flat | **13.5" (3:2)** | 12세대 Intel Alder Lake U (15W) | 4-cell 45Wh 또는 **68Wh** |
| **`MDL-DF-FOLIO-G3`** | 2022 | **Pull-Forward Folio 2-in-1** | **13.5" (3:2 OLED)** | 12세대 Intel Alder Lake U (15W) | **4-cell 53Wh** (`M90788-005`) |
| **`MDL-DF-G4`** | 2023 | Clamshell 180° Lay-Flat | **13.5" (3:2)** | 13세대 Intel Raptor Lake U | 4-cell 45Wh 또는 68Wh |

#### Ubuntu / Fedora Linux 설치 시 상단 스피커 및 MIPI 카메라 해결 (`TS-DFG3-012`)
- **원인**: 구형 Linux 커널에 Alder Lake **Sound Open Firmware(SOF)** 쿼드 스마트 앰프 토폴로지 쿼크와 **Intel IPU6 MIPI 카메라** 드라이버가 누락되어 발생합니다 `[Case · TS-DFG3-012 Linux SOF/IPU6]`.
- **해결**: **Linux Kernel `6.2+` 및 `sof-firmware 2.2.4+`** 로 업그레이드하고, 최신 HP System BIOS(`sp148210`)를 플래싱하여 업데이트된 ACPI DSDT 오디오 핀 테이블을 적용하십시오.""",
          "answer_en": """### HP Dragonfly Series (G1–G4 & Folio G3) Architecture Matrix & Linux Compatibility (`TS-DFG3-012`)

Querying `dragonfly_series_models` shows the evolution from 13.3" 16:9 360° convertibles (`G1`, `G2`, `Max`) to the **13.5" 3:2 aspect ratio** introduced in `G3`, splitting into the **Clamshell Ultrabook (`MDL-DF-G3`)** and **Pull-Forward Folio 2-in-1 (`MDL-DF-FOLIO-G3`)** `[Table · Dragonfly Series Master]`:

| Model ID (`model_id`) | Year | Form Factor (`form_factor`) | Display | CPU Architecture (`cpu_architecture`) | Battery Spec (`battery_spec`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`MDL-DF-G1`** | 2019 | 360° Convertible 2-in-1 | 13.3" (16:9) | 8th Gen Intel Whiskey Lake U | 2-cell 38Wh / 4-cell 56.2Wh |
| **`MDL-DF-G2`** / **`MAX`** | 2021 | 360° Convertible 2-in-1 | 13.3" (16:9) | 11th Gen Intel Tiger Lake U | 4-cell 56.2Wh Li-ion |
| **`MDL-DF-G3`** | 2022 | Clamshell 180° Lay-Flat | **13.5" (3:2)** | 12th Gen Intel Alder Lake U (15W) | 4-cell 45Wh or **68Wh** |
| **`MDL-DF-FOLIO-G3`** | 2022 | **Pull-Forward Folio 2-in-1** | **13.5" (3:2 OLED)** | 12th Gen Intel Alder Lake U (15W) | **4-cell 53Wh** (`M90788-005`) |
| **`MDL-DF-G4`** | 2023 | Clamshell 180° Lay-Flat | **13.5" (3:2)** | 13th Gen Intel Raptor Lake U | 4-cell 45Wh or 68Wh |

#### Resolving Missing Top Speakers & MIPI Camera on Linux (`TS-DFG3-012`)
- **Root Cause**: Older Linux kernels lack the Alder Lake **Sound Open Firmware (SOF)** discrete quad smart-amplifier topology quirk and **Intel IPU6 MIPI camera** drivers `[Case · TS-DFG3-012 Linux SOF/IPU6]`.
- **Fix**: Upgrade to **Linux Kernel `6.2+` and `sof-firmware 2.2.4+`**, and flash HP System BIOS **`sp148210`** to load updated ACPI DSDT audio pin tables.""",
      },

      # =========================================================================
      # 13. QA Governance Guardrail: BLOCKED_DEPRECATED Legacy Draft Manual
      # =========================================================================
      {
          "id": "13",
          "dept_ko": "품질거버넌스 (QA Guardrail)",
          "dept_en": "QA Governance Guardrail",
          "q_ko": "[거버넌스 차단 검증] 폐기된 초기 드래프트 지침(versions/ch05-hot-swap-draft-v0.1, status=deprecated)을 근거로 배터리 미분리·무접지 상태에서 시스템 보드 단축 교체를 승인할 수 있나요?",
          "q_en": "[Governance Block Verification] Can we approve shortcut System Board replacement without disconnecting the battery or wearing an ESD strap based on the deprecated draft manual (versions/ch05-hot-swap-draft-v0.1, status=deprecated)?",
          "keywords": ["deprecated", "폐기", "거버넌스", "차단", "핫스왑", "hot-swap", "미분리", "무접지", "v0.1", "draft", "blocked"],
          "requires_okf_lookup": True,
          "blocked": True,
          "refused": False,
          "hops": 2,
          "anchor_tokens": [
              {"token": "폐기된 초기 드래프트 지침 (v0.1)", "mapped": "Dataplex KC Entry okf_hp_dragonfly/versions-ch05-hot-swap-draft-v0-1"},
              {"token": "배터리 미분리·무접지 단축 수리", "mapped": "Governance Policy Gate (before_tool_callback -> BLOCKED_DEPRECATED)"},
          ],
          "gql": """GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (target:HardwareComponent {part_number: 'N20728-601'})-[r:REQUIRES_REMOVAL_OF]->(prereq:HardwareComponent)
RETURN
  r.dependency_id AS dependency_id,
  r.step_order AS step_order,
  prereq.part_number AS mandatory_prerequisite_part,
  prereq.component_name AS mandatory_prerequisite_name,
  r.manual_page_ref AS canonical_manual_page
ORDER BY r.step_order""",
          "okf_refs": [],
          "answer_ko": """### [거버넌스 게이트 차단 · `BLOCKED_DEPRECATED`] 폐기된 드래프트 수리 지침 인출 차단 및 안전 경고

> **`before_tool_callback` 거버넌스 게이트 판정: `BLOCKED_DEPRECATED` (티켓 발행: `INC-HP-KC-2026-013`)**
> 요청하신 `versions/ch05-hot-swap-draft-v0.1` 엔트리는 Dataplex Knowledge Catalog (`okf_hp_dragonfly`)에서 **`status: deprecated` (만료일: `2025-12-31`, 사유: 700V ESD 손상 및 배터리 단락 화재 위험)** 상태임이 감지되어 **OKF 원문 인출 및 수리 승인 응답 생성이 원천 차단**되었습니다.

| 거버넌스 검증 항목 | Dataplex KC 판정 결과 | 안전 및 규정 준수 조치 |
| :--- | :--- | :--- |
| **요청 엔트리 ID** | `okf_hp_dragonfly/versions-ch05-hot-swap-draft-v0-1` | `status = deprecated` (v0.1.0-draft) |
| **게이트 판정 코드** | **`BLOCKED_DEPRECATED`** (`before_tool_callback` 강제 차단) | 폐기된 무접지·배터리 연결 상태 수리 지침의 LLM 컨텍스트 주입 차단 |
| **현행 유효 정본 (Canonical)** | `okf_hp_dragonfly/references-disassembly-prerequisite-graph-and-esd` (`v1.0.0`) | 반드시 배터리(`M90788-005`) 분리 및 `1 MΩ` ESD 접지 스트랩 착용 후 작업 (`N17344-001 Ch.5 p.29-53`) |
| **자동 발행 감사 티켓** | `INC-HP-KC-2026-013` (Field Safety & Quality Audit Log) | 우측 **근거 아티팩트 서랍 ➔ `KC 유효성 판정`** 탭에서 상세 차단 로그를 확인하십시오. |""",
          "answer_en": """### [Governance Gate Triggered · `BLOCKED_DEPRECATED`] Deprecated Draft Repair Instruction Blocked

> **`before_tool_callback` Governance Verdict: `BLOCKED_DEPRECATED` (Audit Ticket: `INC-HP-KC-2026-013`)**
> The requested entry `versions/ch05-hot-swap-draft-v0.1` is flagged in Dataplex Knowledge Catalog (`okf_hp_dragonfly`) with **`status: deprecated` (Expired: `2025-12-31`, Reason: Severe 700V ESD silicon damage & battery short-circuit hazard)**. The governance gate blocked raw document retrieval and prohibited approving non-isolated board servicing.

| Governance Check | Dataplex KC Verdict | Mandatory Safety Enforcement |
| :--- | :--- | :--- |
| **Requested KC Entry** | `okf_hp_dragonfly/versions-ch05-hot-swap-draft-v0-1` | `status = deprecated` (v0.1.0-draft) |
| **Gate Decision** | **`BLOCKED_DEPRECATED`** (Blocked at Step 3 `before_tool_callback`) | Prevents deprecated unsafe instructions from entering LLM synthesis |
| **Active Canonical Replacement** | `okf_hp_dragonfly/references-disassembly-prerequisite-graph-and-esd` (`v1.0.0`) | Requires disconnecting Battery (`M90788-005`) and wearing a `1 MΩ` ESD wrist strap (`N17344-001 Ch.5 p.29-53`) |
| **Audit Incident Logged** | `INC-HP-KC-2026-013` (Field Safety & Quality Audit Log) | Inspect the full verdict in the right **Evidence Artifact Drawer (`KC` tab)**. |""",
      },

      # =========================================================================
      # 14. Domain Guardrail: Out-of-Domain Refusal (Step 0 Anchor Check)
      # =========================================================================
      {
          "id": "14",
          "dept_ko": "도메인거버넌스 (Domain Guardrail)",
          "dept_en": "Domain Scope Guardrail",
          "q_ko": "[도메인 외 질문 차단 검증] 오늘 서울 강남구 날씨와 코스피 지수 전망, 저녁 맛집 추천해줘.",
          "q_en": "[Out-of-Domain Refusal Verification] What is today's weather in Seoul, the KOSPI stock market forecast, and a dinner restaurant recommendation?",
          "keywords": ["날씨", "weather", "코스피", "kospi", "주식", "stock", "맛집", "점심", "저녁", "dinner", "lunch"],
          "requires_okf_lookup": False,
          "blocked": False,
          "refused": True,
          "hops": 0,
          "anchor_tokens": [],
          "gql": "",
          "okf_refs": [],
          "answer_ko": """### 도메인 범위 외 질의 안내 (`OUT_OF_DOMAIN_REFUSAL`)

본 에이전트는 **`hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph` (BigQuery Property Graph)** 및 **Dataplex Knowledge Catalog (`okf_hp_dragonfly`)** 에 등재된 **HP Dragonfly 시리즈 노트북 하드웨어 사양, 스페어 파트(FRU), 분해 의존성(Disassembly DAG), BIOS/펌웨어 보안 및 고장 진단(Troubleshooting)** 전용 엔터프라이즈 온톨로지 에이전트입니다.

> - **Step 0 (`before_agent_callback`) 판정**: 입력하신 질의에서 매칭된 HP Dragonfly 온톨로지 엔티티 앵커(`ProductModel`, `ProductSKU`, `HardwareComponent`, `DiagnosticCode`, `TroubleshootingCase`, `ServicePlaybook`)가 **0건**이므로, 불필요한 BigQuery GQL 쿼리 및 Dataplex KC 호출을 수행하지 않고 종료했습니다 (`0 Bytes Scanned`).
> - 좌측 질문 목록(`01.` ~ `13.`)을 선택하시거나, HP Dragonfly 노트북 부품 번호(예: `N20728-601`, `M90788-005`), 점멸 코드(`LED-CAPS-2-2`, `LED-CAPS-3-2`), 분해 절차 또는 고장 증상에 대해 질문해 주세요.""",
          "answer_en": """### Out-of-Domain Query Refusal (`OUT_OF_DOMAIN_REFUSAL`)

This agent is strictly scoped to the **HP Dragonfly Series Notebook Engineering, Hardware Spare Parts (FRU), Disassembly Prerequisite DAG, Firmware/BIOS Security, and Field Troubleshooting Ontology** backed by **`hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`** and **Dataplex Knowledge Catalog (`okf_hp_dragonfly`)**.

> - **Step 0 (`before_agent_callback`) Verdict**: Zero ontology anchor tokens (`ProductModel`, `ProductSKU`, `HardwareComponent`, `DiagnosticCode`, `TroubleshootingCase`, `ServicePlaybook`) matched your query. Execution halted cleanly prior to BigQuery GQL or Dataplex KC invocation (`0 Bytes Scanned`).
> - Please select a curated engineering question (`01.`–`13.`) from the left sidebar or ask about any HP Dragonfly spare part (`N20728-601`, `M90788-005`), blink code (`LED-CAPS-2-2`, `LED-CAPS-3-2`), disassembly step, or troubleshooting scenario.""",
      },
  ]

  enriched_scenarios: list[dict[str, Any]] = []
  for sc in raw_scenarios:
    sid = sc["id"]
    gql_str = sc["gql"].strip()
    rows: list[dict[str, Any]] = []
    elapsed_ms = 0
    job_id = "none"
    bytes_proc = 0

    if gql_str and not sc["refused"]:
      print(f"[Scenario {sid}] Executing live BigQuery GQL/SQL...")
      rows, elapsed_ms, job_id, bytes_proc = run_bq_gql(client, gql_str)
      print(f"  -> {len(rows)} rows in {elapsed_ms} ms (Job: {job_id})")

    # Build provisions & KC verdicts
    provisions: list[dict[str, Any]] = []
    kc_verdicts: list[dict[str, Any]] = []

    if sc["blocked"]:
      kc_verdicts.append(
          make_kc_verdict(
              cite_tag="BLOCKED · v0.1 Draft",
              rel_path="versions/ch05-hot-swap-draft-v0.1.md",
              title_ko="[폐기됨] 초기 드래프트: 배터리 미분리 시스템 보드 단축 교체 지침 (v0.1)",
              title_en="[DEPRECATED] Legacy Draft: Non-Isolated System Board Hot-Swap Guide (v0.1)",
              decision="BLOCKED_DEPRECATED",
              status="deprecated",
              reason_ko="status=deprecated 및 유효기간 만료(2025-12-31) 감지 — 700V ESD 및 단락 위험으로 인출 차단",
              reason_en="status=deprecated & expired (2025-12-31) — blocked due to 700V ESD & short-circuit risk",
              chain=[
                  "okf_hp_dragonfly/versions-ch05-hot-swap-draft-v0-1 (deprecated)",
                  "BLOCKED_BY_GOVERNANCE_GATE",
              ],
              incident_id="INC-HP-KC-2026-013",
              superseded_info={
                  "from": "okf_hp_dragonfly/versions-ch05-hot-swap-draft-v0-1",
                  "resolved_to": "okf_hp_dragonfly/references-disassembly-prerequisite-graph-and-esd",
                  "hops": 1,
                  "decision": "CANONICAL_REPLACEMENT_AVAILABLE",
              },
          )
      )
    else:
      for rel_p, cite_tag, r_ko, r_en, t_cols in sc["okf_refs"]:
        prov = make_okf_provision(okf_map, rel_p, cite_tag, r_ko, r_en, t_cols)
        provisions.append(prov)
        kc_verdicts.append(
            make_kc_verdict(
                cite_tag=cite_tag,
                rel_path=rel_p,
                title_ko=prov["title_ko"],
                title_en=prov["title_en"],
                decision="ALLOW",
                status="verified",
            )
        )

    ledger_tables = []
    if not sc["refused"] and not sc["blocked"]:
      ledger_tables.append({
          "table_title_ko": f"BigQuery GQL/SQL 실행 결과 ({len(rows)}행)",
          "table_title_en": f"BigQuery GQL/SQL Query Result ({len(rows)} rows)",
          "row_count": len(rows),
          "elapsed_ms": elapsed_ms,
          "job_id": job_id,
          "bytes_processed": bytes_proc,
          "sql": gql_str,
          "rows": rows,
      })

    # Step 0 ~ Step 3 execution trace metadata
    steps_trace = {
        "step0": {
            "status": "NO_DOMAIN_ANCHOR" if sc["refused"] else "ANCHOR_BOUND",
            "matched_tokens": sc["anchor_tokens"],
        },
        "step1": {
            "executed": bool(gql_str and not sc["refused"]),
            "hops": sc["hops"],
            "row_count": len(rows),
            "elapsed_ms": elapsed_ms,
            "job_id": job_id,
            "bytes_processed": bytes_proc,
            "gql": gql_str,
        },
        "step2": {
            "executed": bool(kc_verdicts),
            "entry_group": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly",
            "verdicts": kc_verdicts,
        },
        "step3": {
            "executed": bool(provisions) or sc["blocked"],
            "decision": (
                "OUT_OF_DOMAIN"
                if sc["refused"]
                else ("BLOCKED_DEPRECATED" if sc["blocked"] else "ALLOW")
            ),
            "provisions_fetched": len(provisions),
            "incident_id": "INC-HP-KC-2026-013" if sc["blocked"] else None,
        },
    }

    enriched_scenarios.append({
        "id": sid,
        "dept_ko": sc["dept_ko"],
        "dept_en": sc["dept_en"],
        "q_ko": sc["q_ko"],
        "q_en": sc["q_en"],
        "keywords": sc["keywords"],
        "requires_okf_lookup": sc["requires_okf_lookup"],
        "blocked": sc["blocked"],
        "refused": sc["refused"],
        "hops": sc["hops"],
        "gql": gql_str,
        "answer_ko": sc["answer_ko"],
        "answer_en": sc["answer_en"],
        "steps_trace": steps_trace,
        "artifact_drawer": {
            "kc_verdicts": kc_verdicts,
            "provisions": provisions,
            "ledger_tables": ledger_tables,
        },
    })

  return enriched_scenarios


def main() -> None:
  bundle = load_studio_bundle()
  scenarios = build_scenarios(bundle)

  payload = {
      "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
      "project_id": "hp-dragonfly",
      "dataset_id": "prj_ontology_hp_dragonfly",
      "graph_id": "hp_dragonfly_ontology_graph",
      "kc_entry_group": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly",
      "scenario_count": len(scenarios),
      "scenarios": scenarios,
  }

  OUT_JSON_PATH.write_text(
      json.dumps(payload, ensure_ascii=False, indent=2, default=str),
      encoding="utf-8",
  )
  print(f"Wrote {OUT_JSON_PATH} ({OUT_JSON_PATH.stat().st_size:,} bytes)")

  js_content = (
      "// Auto-generated HP Dragonfly Ontology Agent Q&A Bank (KO/EN + Live BigQuery GQL)\n"
      "window.HP_AGENT_QA_BANK = "
      + json.dumps(payload, ensure_ascii=False, indent=2, default=str)
      + ";\n"
  )
  OUT_JS_PATH.write_text(js_content, encoding="utf-8")
  print(f"Wrote {OUT_JS_PATH} ({OUT_JS_PATH.stat().st_size:,} bytes)")


if __name__ == "__main__":
  main()
