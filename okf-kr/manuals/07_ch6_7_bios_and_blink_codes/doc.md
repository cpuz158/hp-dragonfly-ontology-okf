---
type: document
title: '[07 챕터 총괄] 제6장 백업·복구 · 제7장 Computer Setup(BIOS)/TPM/HP Sure Start · 제8장 HP PC Hardware Diagnostics 진단 (PDF p.83–94 · Doc pp. 77–88 · 3개 청크)'
description: '원본 PDF 제6장(백업·복원·HP Cloud Recovery·HP Sure Recover, Doc pp. 77–79 / PDF p.83–85), 제7장(Computer Setup F10 BIOS·초기화·BIOS 업데이트·F9 부트 순서·TPM 2.0·HP Sure Start, Doc pp. 80–83 / PDF p.86–89), 제8장(HP PC Hardware Diagnostics Windows/UEFI·24자리 Failure ID 코드·Remote UEFI 진단 및 LED 점멸 트리아지, Doc pp. 84–88 / PDF p.90–94)을 요약합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=83
  kind: origin_document
  sha256: 684a09e3132de5156062ef0be3a5a2ab499e686f0e9ea827b65735c1a5dd6533
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/07_ch6_7_bios_and_blink_codes/doc.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: hp_dragonfly_folio_g3_service_manual_n17344_001
sequence: 7
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: reference
section_number: 'Chapter 07 Root'
source_page: 83
source_pages_span: 'PDF p.83–94 (Doc pp. 77–88)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [07 챕터 총괄] 제6장 백업·복구 · 제7장 Computer Setup(BIOS)/TPM/HP Sure Start · 제8장 HP PC Hardware Diagnostics 진단 (PDF p.83–94 · Doc pp. 77–88 · 3개 청크)

## 1. 챕터 총괄 개요 (`okf-kr` · `docs/pdf_6290467_en-US-1.pdf` 원문 1:1 매핑)
- **챕터 식별코드:** `[07] 07_CH6_7_BIOS_DIAGNOSTICS`
- **원천 서비스 매뉴얼:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **원본 PDF 페이지 범위:** **`PDF p.83–94 (Doc pp. 77–88)`** (클릭 시 PDF 뷰어 `#page=83` 자동 연동)
- **생성 에이전트 및 모델:** `enrichment_agent/gemini-3.8-flash` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF 리포지토리 경로:** `okf-kr/manuals/07_ch6_7_bios_and_blink_codes/doc.md`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **챕터 핵심 요약:** 원본 PDF 제6장(백업·복원·HP Cloud Recovery·HP Sure Recover, Doc pp. 77–79 / PDF p.83–85), 제7장(Computer Setup F10 BIOS·초기화·BIOS 업데이트·F9 부트 순서·TPM 2.0·HP Sure Start, Doc pp. 80–83 / PDF p.86–89), 제8장(HP PC Hardware Diagnostics Windows/UEFI·24자리 Failure ID 코드·Remote UEFI 진단 및 LED 점멸 트리아지, Doc pp. 84–88 / PDF p.90–94)을 요약합니다.

## 2. 소속 PDF 청크(Section Chunks) 목록 (3개 청크)
| 원문 섹션/표 번호 | 청크 제목 (Korean Title) | 원본 PDF / 문서 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
| `제6장·제7장 (시스템 백업/복구 · Computer Setup BIOS · TPM 2.0 · HP Sure Start)` | 제6장·제7장 — 시스템 백업/복구(HP Sure Recover) · Computer Setup(F10 BIOS) · BIOS 업데이트 · 부트 순서(F9) · TPM 2.0 및 HP Sure Start 복구 (PDF p.83–89 · Doc p.77–83) | `PDF p.86` (`PDF p.83–89 (Doc p.77–83)`) | `stable` |
| `제8장 §8.1·8.2 (HP PC Hardware Diagnostics Windows/UEFI 및 LED 점멸 진단 코드)` | 제8장 §8.1·8.2 — HP PC Hardware Diagnostics (Windows 및 UEFI F2) · 24자리 Failure ID 코드 및 LED 점멸 진단 코드(3.2 / 2.2 / 4.2) (PDF p.90–93 · Doc p.84–87) | `PDF p.90` (`PDF p.90–93 (Doc p.84–87)`) | `stable` |
| `제8장 §8.3 (Remote HP PC Hardware Diagnostics UEFI 및 증상별 트리아지 매트릭스)` | 제8장 §8.3 — Remote HP PC Hardware Diagnostics UEFI 설정(F10 BIOS) 및 6대 현장 고장 증상 트리아지 매트릭스(TS-DFG3-001~006) (PDF p.93–94 · Doc p.87–88) | `PDF p.93` (`PDF p.93–94 (Doc p.87–88)`) | `stable` |

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 및 Dataplex KC 연동 구조
- 본 챕터 총괄 문서(`doc.md`)와 소속 청크들은 원본 PDF(`docs/pdf_6290467_en-US-1.pdf`)의 실제 목차(Chapters 1~12) 및 PDF 페이지 번호(`pdf_page = doc_page + 6`)와 100% 일치하도록 `gemini-3.8-flash` Enrichment Agent로 생성되었으며, `./bin/kcmd` 파이프라인을 통해 Dataplex Knowledge Catalog(`okf` Aspect) 및 BigQuery Property Graph(`hp_dragonfly_ontology_graph`)와 동기화됩니다.
