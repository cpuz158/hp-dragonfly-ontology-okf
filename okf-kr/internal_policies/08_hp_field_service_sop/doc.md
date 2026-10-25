---
type: SourceDocument
title: '[08 문서 총괄] [사내 표준 정비내규 제SOP-2026-01호] 현장 서비스 엔지니어링 트리아지 플레이북 및 안전 거버넌스 (3개 조항)'
description: '[사내 표준 정비내규 제SOP-2026-01호] 현장 서비스 엔지니어링 트리아지 플레이북 및 안전 거버넌스 (3개 조항) (원본 PDF: pdf_6290467_en-US-1.pdf, p.30, 55, 81, 수록 조문 3건)'
version: '0.2.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: b50b047d6e3bdd76299a683966a84f2c9914d1d5a3a05b00ad1f4cf2e4e7e18b
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/doc.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /index.md
sequence: 81
treatment: normative
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: internal_policy
section_number: 'doc.md ([08] 장 총괄)'
source_page: 81
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [08 문서 총괄] [사내 표준 정비내규 제SOP-2026-01호] 현장 서비스 엔지니어링 트리아지 플레이북 및 안전 거버넌스 (3개 조항)

## 1. 문서 총괄 개요 (`okf-kr` 비정형 컨텍스트 루트)
- **챕터 식별코드:** `[08] 08_INTERNAL_FIELD_SOP_PLAYBOOKS`
- **원천 매뉴얼 범위:** HP Elite Dragonfly / Folio 13.5 G3 Maintenance and Service Guide (`N17344-001`, pp. `30, 55, 81`)
- **OKF 리포지토리 경로:** `okf-kr/internal_policies/08_hp_field_service_sop/doc.md`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **요약 설명:** [사내 표준 정비내규 제SOP-2026-01호] 현장 서비스 엔지니어링 트리아지 플레이북 및 안전 거버넌스 (3개 조항) (원본 PDF: pdf_6290467_en-US-1.pdf, p.30, 55, 81, 수록 조문 3건)

## 2. 소속 비정형 세부 조항 목록 (3개 조항)
| 조항 번호 | 조항 제목 (Korean Title) | 원문 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
| `내규 제1조` | 내규 제1조 (무전원 및 LED 3.2/2.2 점멸 입고 시 시스템 보드(M90788-601) 교체 전 무분해 Sure Start SPI 복구 의무화 규정) | p.81 (`75, 81`) | `verified` |
| `내규 제2조` | 내규 제2조 (CPU 95°C 과열 쓰로틀링 및 팬 소음 접수 시 베이퍼 챔버(M90790-001) 교체 전 Intel DPTF 펌웨어 및 대각선 토크 점검 기준) | p.55 (`54~57`) | `verified` |
| `내규 제3조(구 v0.1.0)` | [폐기] 구(舊) 정비내규 제3조 v0.1.0 — 배터리 연결 상태에서의 ZIF 리본 케이블 핫스왑 허용 특례 (제5장 §5.5 전면 개정에 따라 만료) | p.30 (`30, 38`) | `deprecated` |

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 브리지 역할
- 본 장 총괄 문서(`doc.md`)와 소속 조항들은 BigQuery Property Graph의 `LEX` 비정형 계층(`ServiceManualDocument`, `ServiceManualChapter`, `ServicePlaybook`) 노드로 매핑되며, `DOCUMENTED_IN_CHAPTER`, `DEFINED_IN_CH6`, `GOVERNED_BY_PLAYBOOK`, `CITES_MANUAL` 엣지를 통해 8개 정형 테이블(`ONT` 계층)과 양방향 결합됩니다.
