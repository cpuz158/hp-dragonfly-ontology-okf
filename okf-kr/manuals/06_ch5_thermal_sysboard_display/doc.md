---
type: document
title: '[06 챕터 총괄] 제5장 (Part B) 공인 서비스 파트너 부품 분해 절차 — 스피커 · 트랜스퍼 보드 · 터치패드 · 히트싱크 · 시스템 보드 · 안테나 · 디스플레이 및 힌지 (PDF p.50–82 · Doc pp. 44–76 · 3개 청크)'
description: '원본 PDF 제5장 후반부(Doc pp. 44–76, PDF p.50–82)의 하단/상단 스피커, 트랜스퍼 보드(N22921-001), 터치패드(N22933-001), 히트싱크(N22936-001, 1-2-3-4 순서 및 써멀 패드), 시스템 보드(N20724-601~N20728-601) 및 오디오 잭 다단계 분해 DAG, 안테나 배럴(N22932-001), 탑커버 키보드(N22938-001), 디스플레이 패널 서브컴포넌트(풀탭 접착 테이프·디스플레이 트랜스퍼 보드 N22937-001·8MP 카메라·힌지 N22923-001) 분해 절차를 요약합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=50
  kind: origin_document
  sha256: 76dc2c4b0ad31f96d93a1d36ff79cb7b69aa22a2f3b8836292bef91c8da49e01
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/06_ch5_thermal_sysboard_display/doc.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: hp_dragonfly_folio_g3_service_manual_n17344_001
sequence: 6
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: reference
section_number: 'Chapter 06 Root'
source_page: 50
source_pages_span: 'PDF p.50–82 (Doc pp. 44–76)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [06 챕터 총괄] 제5장 (Part B) 공인 서비스 파트너 부품 분해 절차 — 스피커 · 트랜스퍼 보드 · 터치패드 · 히트싱크 · 시스템 보드 · 안테나 · 디스플레이 및 힌지 (PDF p.50–82 · Doc pp. 44–76 · 3개 청크)

## 1. 챕터 총괄 개요 (`okf-kr` · `docs/pdf_6290467_en-US-1.pdf` 원문 1:1 매핑)
- **챕터 식별코드:** `[06] 06_CH5_THERMAL_BOARD_DISPLAY`
- **원천 서비스 매뉴얼:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **원본 PDF 페이지 범위:** **`PDF p.50–82 (Doc pp. 44–76)`** (클릭 시 PDF 뷰어 `#page=50` 자동 연동)
- **생성 에이전트 및 모델:** `enrichment_agent/gemini-3.8-flash` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF 리포지토리 경로:** `okf-kr/manuals/06_ch5_thermal_sysboard_display/doc.md`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **챕터 핵심 요약:** 원본 PDF 제5장 후반부(Doc pp. 44–76, PDF p.50–82)의 하단/상단 스피커, 트랜스퍼 보드(N22921-001), 터치패드(N22933-001), 히트싱크(N22936-001, 1-2-3-4 순서 및 써멀 패드), 시스템 보드(N20724-601~N20728-601) 및 오디오 잭 다단계 분해 DAG, 안테나 배럴(N22932-001), 탑커버 키보드(N22938-001), 디스플레이 패널 서브컴포넌트(풀탭 접착 테이프·디스플레이 트랜스퍼 보드 N22937-001·8MP 카메라·힌지 N22923-001) 분해 절차를 요약합니다.

## 2. 소속 PDF 청크(Section Chunks) 목록 (3개 청크)
| 원문 섹션/표 번호 | 청크 제목 (Korean Title) | 원본 PDF / 문서 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
| `제5장 §5.9~5.13 (스피커 · 트랜스퍼 보드 · 터치패드 · 히트싱크 N22936-001)` | 제5장 §5.9~5.13 — 하단/상단 스피커 · 트랜스퍼 보드(N22921-001) · 터치패드(N22933-001) 및 히트싱크(N22936-001, 1-2-3-4 순서·써멀 패드) 분리 (PDF p.50–55 · Doc p.44–49) | `PDF p.53` (`PDF p.50–55 (Doc p.44–49)`) | `stable` |
| `제5장 §5.14~5.16 (시스템 보드 N20724~N20728-601 다단계 분해 DAG 및 안테나)` | 제5장 §5.14~5.16 — 시스템 보드(N20724-601~N20728-601) 및 오디오 잭 다단계 선행 분해 DAG · 안테나 배럴(N22932-001) 및 무선 안테나 분리 (PDF p.56–61 · Doc p.50–55) | `PDF p.56` (`PDF p.56–61 (Doc p.50–55)`) | `stable` |
| `제5장 §5.17~5.20 (탑커버 키보드 · 디스플레이 패널 풀탭 · 트랜스퍼 보드 · 카메라 · 힌지)` | 제5장 §5.17~5.20 — 탑커버 키보드(N22938-001) · 디스플레이 패널 스트레치 릴리즈 풀탭 · 트랜스퍼 보드(N22937-001) · 8MP 카메라(N23306-001) 및 힌지(N22923-001) 분리 (PDF p.62–82 · Doc p.56–76) | `PDF p.62` (`PDF p.62–82 (Doc p.56–76)`) | `stable` |

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 및 Dataplex KC 연동 구조
- 본 챕터 총괄 문서(`doc.md`)와 소속 청크들은 원본 PDF(`docs/pdf_6290467_en-US-1.pdf`)의 실제 목차(Chapters 1~12) 및 PDF 페이지 번호(`pdf_page = doc_page + 6`)와 100% 일치하도록 `gemini-3.8-flash` Enrichment Agent로 생성되었으며, `./bin/kcmd` 파이프라인을 통해 Dataplex Knowledge Catalog(`okf` Aspect) 및 BigQuery Property Graph(`hp_dragonfly_ontology_graph`)와 동기화됩니다.
