---
type: document
title: '[05 챕터 총괄] 제5장 (Part A) 공인 서비스 파트너 부품 분해 절차 — 하판 커버 · SSD · 펜 슬롯 · SIM 보드 · WWAN · 무선충전 · 배터리 (PDF p.39–49 · Doc pp. 33–43 · 4개 청크)'
description: '원본 PDF 제5장 전반부(Doc pp. 33–43, PDF p.39–49)의 분해 사전 준비, 하판 커버(N22918-001 및 가죽 커버 분리), M.2 2280 PCIe Gen4 NVMe SSD(EMI 실드 포함), 마그네틱 펜 슬롯, SIM 보드(N22922-001), 5G/LTE WWAN 모듈(4x4 MIMO 안테나 #5/#6/#7/#8), 무선 충전 모듈(N22924-001), 4셀 53Whr 배터리(M90788-005) 분리 절차를 요약합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=39
  kind: origin_document
  sha256: 77bad6b53de03c494f1d44a5f953ceeab7a05676bbfedc7f89e1ab04ad6f8cde
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/doc.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: hp_dragonfly_folio_g3_service_manual_n17344_001
sequence: 5
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: reference
section_number: 'Chapter 05 Root'
source_page: 39
source_pages_span: 'PDF p.39–49 (Doc pp. 33–43)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [05 챕터 총괄] 제5장 (Part A) 공인 서비스 파트너 부품 분해 절차 — 하판 커버 · SSD · 펜 슬롯 · SIM 보드 · WWAN · 무선충전 · 배터리 (PDF p.39–49 · Doc pp. 33–43 · 4개 청크)

## 1. 챕터 총괄 개요 (`okf-kr` · `docs/pdf_6290467_en-US-1.pdf` 원문 1:1 매핑)
- **챕터 식별코드:** `[05] 05_CH5_BASE_STORAGE_WWAN`
- **원천 서비스 매뉴얼:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **원본 PDF 페이지 범위:** **`PDF p.39–49 (Doc pp. 33–43)`** (클릭 시 PDF 뷰어 `#page=39` 자동 연동)
- **생성 에이전트 및 모델:** `enrichment_agent/gemini-3.8-flash` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF 리포지토리 경로:** `okf-kr/manuals/05_ch5_base_battery_storage/doc.md`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **챕터 핵심 요약:** 원본 PDF 제5장 전반부(Doc pp. 33–43, PDF p.39–49)의 분해 사전 준비, 하판 커버(N22918-001 및 가죽 커버 분리), M.2 2280 PCIe Gen4 NVMe SSD(EMI 실드 포함), 마그네틱 펜 슬롯, SIM 보드(N22922-001), 5G/LTE WWAN 모듈(4x4 MIMO 안테나 #5/#6/#7/#8), 무선 충전 모듈(N22924-001), 4셀 53Whr 배터리(M90788-005) 분리 절차를 요약합니다.

## 2. 소속 PDF 청크(Section Chunks) 목록 (4개 청크)
| 원문 섹션/표 번호 | 청크 제목 (Korean Title) | 원본 PDF / 문서 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
| `제5장 §5.1·5.2 (분해 사전 준비 및 하판 커버 N22918-001 분리)` | 제5장 §5.1·5.2 — 분해 사전 준비 및 하판 커버(Bottom Cover, N22918-001) · 가죽 커버 분리 절차 (PDF p.39–41 · Doc p.33–35) | `PDF p.39` (`PDF p.39–41 (Doc p.33–35)`) | `stable` |
| `제5장 §5.8 (배터리 팩 M90788-005 분리 및 전원 차단)` | 제5장 §5.8 — 4셀 53Whr 배터리 팩(M90788-005) 분리 절차 및 선행 전원 차단 강행 원칙 (PDF p.48–49 · Doc p.42–43) | `PDF p.48` (`PDF p.48–49 (Doc p.42–43)`) | `stable` |
| `제5장 §5.3 (솔리드 스테이트 드라이브 M.2 2280 NVMe SSD 분리)` | 제5장 §5.3 — 솔리드 스테이트 드라이브(M.2 2280 PCIe Gen4 NVMe SSD) 및 EMI 차폐 실드 분리·장착 절차 (PDF p.41–42 · Doc p.35–36) | `PDF p.41` (`PDF p.41–42 (Doc p.35–36)`) | `stable` |
| `제5장 §5.4~5.7 (마그네틱 펜 슬롯 · SIM 보드 · 5G WWAN 모듈 · 무선충전 모듈)` | 제5장 §5.4~5.7 — 마그네틱 펜 슬롯 · SIM 보드(N22922-001) · 5G WWAN 모듈(4x4 MIMO 안테나 #5~#8) 및 무선 충전 모듈(N22924-001) 분리 (PDF p.43–47 · Doc p.37–41) | `PDF p.43` (`PDF p.43–47 (Doc p.37–41)`) | `stable` |

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 및 Dataplex KC 연동 구조
- 본 챕터 총괄 문서(`doc.md`)와 소속 청크들은 원본 PDF(`docs/pdf_6290467_en-US-1.pdf`)의 실제 목차(Chapters 1~12) 및 PDF 페이지 번호(`pdf_page = doc_page + 6`)와 100% 일치하도록 `gemini-3.8-flash` Enrichment Agent로 생성되었으며, `./bin/kcmd` 파이프라인을 통해 Dataplex Knowledge Catalog(`okf` Aspect) 및 BigQuery Property Graph(`hp_dragonfly_ontology_graph`)와 동기화됩니다.
