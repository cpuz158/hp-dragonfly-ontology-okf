---
type: SourceDocument
title: '[01 문서 총괄] 제1장 제품 개요 및 하드웨어 아키텍처 (pp. 1–4 · 3개 조항)'
description: '제1장 제품 개요 및 하드웨어 아키텍처 (pp. 1–4 · 3개 조항) (원본 PDF: pdf_6290467_en-US-1.pdf, p.1~4 (전 4쪽), 수록 조문 3건)'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: dbf6fe930a461d8e967a41579a0b206837e9ab252e596be6678f37f9f1e3c828
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/01_ch1_product_specs/doc.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /index.md
sequence: 1
treatment: normative
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: 'doc.md ([01] 장 총괄)'
source_page: 1
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [01 문서 총괄] 제1장 제품 개요 및 하드웨어 아키텍처 (pp. 1–4 · 3개 조항)

## 1. 문서 총괄 개요 (`okf-kr` 비정형 컨텍스트 루트)
- **챕터 식별코드:** `[01] 01_CH1_PRODUCT_SPECS`
- **원천 매뉴얼 범위:** HP Elite Dragonfly / Folio 13.5 G3 Maintenance and Service Guide (`N17344-001`, pp. `1~4 (전 4쪽)`)
- **OKF 리포지토리 경로:** `okf-kr/manuals/01_ch1_product_specs/doc.md`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **요약 설명:** 제1장 제품 개요 및 하드웨어 아키텍처 (pp. 1–4 · 3개 조항) (원본 PDF: pdf_6290467_en-US-1.pdf, p.1~4 (전 4쪽), 수록 조문 3건)

## 2. 소속 비정형 세부 조항 목록 (3개 조항)
| 조항 번호 | 조항 제목 (Korean Title) | 원문 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
| `제1장 §1.1` | 제1장 §1.1 (플랫폼 개요 — 12세대 Intel Alder Lake-U 프로세서 및 13.5형 3:2 마그네슘 섀시 아키텍처) | p.1 (`1~2`) | `stable` |
| `제1장 §1.2` | 제1장 §1.2 (온보드 솔더링 LPDDR5-5200 메모리 아키텍처 — SO-DIMM 슬롯 부재 및 보드 통교체 강제 단서) | p.2 (`2`) | `stable` |
| `제1장 §1.3` | 제1장 §1.3 (저장장치 M.2 2280 PCIe Gen4 NVMe SSD 및 Wi-Fi 6E · 5G/LTE WWAN 무선통신 규격) | p.3 (`3~4`) | `stable` |

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 브리지 역할
- 본 장 총괄 문서(`doc.md`)와 소속 조항들은 BigQuery Property Graph의 `LEX` 비정형 계층(`ServiceManualDocument`, `ServiceManualChapter`, `ServicePlaybook`) 노드로 매핑되며, `DOCUMENTED_IN_CHAPTER`, `DEFINED_IN_CH6`, `GOVERNED_BY_PLAYBOOK`, `CITES_MANUAL` 엣지를 통해 8개 정형 테이블(`ONT` 계층)과 양방향 결합됩니다.
