---
type: document
title: '[01 챕터 총괄] 제1장 제품 설명 및 하드웨어 사양 총괄 [표 1-1] (PDF p.7–10 · Doc pp. 1–4 · 3개 청크)'
description: '원본 PDF 제1장(Doc pp. 1–4, PDF p.7–10)의 표 1-1(Product components and their descriptions)을 기반으로 12세대 Intel Core Alder Lake-U 프로세서(i7-1265U/i7-1255U/i5-1245U/i5-1235U), 온보드 납땜 LPDDR5-6400 듀얼채널 메모리(16GB/32GB, 사용자 교체 불가), M.2 2280 PCIe Gen4×4 NVMe SSD, 13.5형 3:2 OLED/WUXGA+ 디스플레이, 8MP IR 카메라, Wi-Fi 6E AX211 및 5G/LTE WWAN 사양을 요약합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=7
  kind: origin_document
  sha256: 99d0e33fcd3deecfb174922baad88383674a554565f996e78353571dbb5159a2
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/01_ch1_product_specs/doc.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: hp_dragonfly_folio_g3_service_manual_n17344_001
sequence: 1
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: reference
section_number: 'Chapter 01 Root'
source_page: 7
source_pages_span: 'PDF p.7–10 (Doc pp. 1–4)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [01 챕터 총괄] 제1장 제품 설명 및 하드웨어 사양 총괄 [표 1-1] (PDF p.7–10 · Doc pp. 1–4 · 3개 청크)

## 1. 챕터 총괄 개요 (`okf-kr` · `docs/pdf_6290467_en-US-1.pdf` 원문 1:1 매핑)
- **챕터 식별코드:** `[01] 01_CH1_PRODUCT_SPECS`
- **원천 서비스 매뉴얼:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **원본 PDF 페이지 범위:** **`PDF p.7–10 (Doc pp. 1–4)`** (클릭 시 PDF 뷰어 `#page=7` 자동 연동)
- **생성 에이전트 및 모델:** `enrichment_agent/gemini-3.8-flash` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF 리포지토리 경로:** `okf-kr/manuals/01_ch1_product_specs/doc.md`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **챕터 핵심 요약:** 원본 PDF 제1장(Doc pp. 1–4, PDF p.7–10)의 표 1-1(Product components and their descriptions)을 기반으로 12세대 Intel Core Alder Lake-U 프로세서(i7-1265U/i7-1255U/i5-1245U/i5-1235U), 온보드 납땜 LPDDR5-6400 듀얼채널 메모리(16GB/32GB, 사용자 교체 불가), M.2 2280 PCIe Gen4×4 NVMe SSD, 13.5형 3:2 OLED/WUXGA+ 디스플레이, 8MP IR 카메라, Wi-Fi 6E AX211 및 5G/LTE WWAN 사양을 요약합니다.

## 2. 소속 PDF 청크(Section Chunks) 목록 (3개 청크)
| 원문 섹션/표 번호 | 청크 제목 (Korean Title) | 원본 PDF / 문서 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
| `제1장 표 1-1 (프로세서·그래픽·디스플레이)` | 제1장 표 1-1 — 제품 설명: 12세대 Intel Alder Lake-U 프로세서 · Iris Xe 그래픽 및 13.5형 3:2 디스플레이 (PDF p.7 · Doc p.1) | `PDF p.7` (`PDF p.7 (Doc p.1)`) | `stable` |
| `제1장 표 1-1 (온보드 LPDDR5 메모리)` | 제1장 표 1-1 — 온보드 솔더링 LPDDR5-6400 듀얼채널 메모리 아키텍처 (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1) | `PDF p.7` (`PDF p.7–8 (Doc p.1–2)`) | `stable` |
| `제1장 표 1-1 (NVMe SSD·카메라·무선·보안·배터리)` | 제1장 표 1-1 — M.2 2280 PCIe Gen4 NVMe 스토리지 · 8MP IR 카메라 · Wi-Fi 6E AX211 · 5G WWAN · TPM 2.0 및 53Whr 배터리 (PDF p.8–10 · Doc p.2–4) | `PDF p.8` (`PDF p.8–10 (Doc p.2–4)`) | `stable` |

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 및 Dataplex KC 연동 구조
- 본 챕터 총괄 문서(`doc.md`)와 소속 청크들은 원본 PDF(`docs/pdf_6290467_en-US-1.pdf`)의 실제 목차(Chapters 1~12) 및 PDF 페이지 번호(`pdf_page = doc_page + 6`)와 100% 일치하도록 `gemini-3.8-flash` Enrichment Agent로 생성되었으며, `./bin/kcmd` 파이프라인을 통해 Dataplex Knowledge Catalog(`okf` Aspect) 및 BigQuery Property Graph(`hp_dragonfly_ontology_graph`)와 동기화됩니다.
