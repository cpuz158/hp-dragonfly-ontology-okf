---
type: document
title: '[08 챕터 총괄] 제9장 제품 제원 · 제10장 비휘발성 메모리 명세[표 10-1] 및 HP Sure Start 복구 · 제11~12장 재활용/전원코드 및 거버넌스 (PDF p.95–106 · Doc pp. 89–100 · 3개 청크)'
description: '원본 PDF 제9장(컴퓨터·디스플레이·SSD 물리/전력 제원, Doc pp. 89–90 / PDF p.95–96), 제10장(비휘발성 메모리 명세 표 10-1: System BIOS 9MB SPI, HP Sure Start 8MB SPI, Intel CSME 16MB, TPM 2.0 SLB9672, EC, PD 컨트롤러, Retimer 및 HP Sure Start 자동 복구, Doc pp. 91–97 / PDF p.97–103), 제11~12장(배터리/하드웨어 재활용 및 국가별 전원 코드 요건, Doc pp. 98–100 / PDF p.104–106) 및 Dataplex KC 거버넌스 게이트 검증 조항을 요약합니다.'
version: '0.2.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=95
  kind: origin_document
  sha256: 3181104ff8c5b88d19d77ff89cdf027dfb96b376db49d4070517839c3f25572b
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/doc.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: hp_dragonfly_folio_g3_service_manual_n17344_001
sequence: 8
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: reference
section_number: 'Chapter 08 Root'
source_page: 95
source_pages_span: 'PDF p.95–106 (Doc pp. 89–100)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [08 챕터 총괄] 제9장 제품 제원 · 제10장 비휘발성 메모리 명세[표 10-1] 및 HP Sure Start 복구 · 제11~12장 재활용/전원코드 및 거버넌스 (PDF p.95–106 · Doc pp. 89–100 · 3개 청크)

## 1. 챕터 총괄 개요 (`okf-kr` · `docs/pdf_6290467_en-US-1.pdf` 원문 1:1 매핑)
- **챕터 식별코드:** `[08] 08_INTERNAL_FIELD_SOP_PLAYBOOKS`
- **원천 서비스 매뉴얼:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **원본 PDF 페이지 범위:** **`PDF p.95–106 (Doc pp. 89–100)`** (클릭 시 PDF 뷰어 `#page=95` 자동 연동)
- **생성 에이전트 및 모델:** `enrichment_agent/gemini-3.8-flash` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF 리포지토리 경로:** `okf-kr/internal_policies/08_hp_field_service_sop/doc.md`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **챕터 핵심 요약:** 원본 PDF 제9장(컴퓨터·디스플레이·SSD 물리/전력 제원, Doc pp. 89–90 / PDF p.95–96), 제10장(비휘발성 메모리 명세 표 10-1: System BIOS 9MB SPI, HP Sure Start 8MB SPI, Intel CSME 16MB, TPM 2.0 SLB9672, EC, PD 컨트롤러, Retimer 및 HP Sure Start 자동 복구, Doc pp. 91–97 / PDF p.97–103), 제11~12장(배터리/하드웨어 재활용 및 국가별 전원 코드 요건, Doc pp. 98–100 / PDF p.104–106) 및 Dataplex KC 거버넌스 게이트 검증 조항을 요약합니다.

## 2. 소속 PDF 청크(Section Chunks) 목록 (3개 청크)
| 원문 섹션/표 번호 | 청크 제목 (Korean Title) | 원본 PDF / 문서 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
| `제9장·제10장 표 10-1 (제품 제원 · 비휘발성 메모리 명세 및 보드 교체 게이트 내규 제1조)` | 제9장 제원[표 9-1~9-3] · 제10장 비휘발성 메모리 명세[표 10-1] 및 무전원/LED 3.2 입고 시 보드 교체 전 Sure Start 복구 게이트 [내규 제1조] (PDF p.95–100 · Doc p.89–94) | `PDF p.97` (`PDF p.95–100 (Doc p.89–94)`) | `verified` |
| `제10장(Sure Start)·제11장(재활용)·제12장(전원코드) 및 열관리 거버넌스 [내규 제2조]` | 제10장 HP Sure Start 자동 복구(Doc p.97) · 제11장 배터리/부품 재활용 · 제12장 국가별 전원코드 규격 및 열관리 거버넌스 [내규 제2조] (PDF p.101–106 · Doc p.95–100) | `PDF p.103` (`PDF p.101–106 (Doc p.95–100)`) | `verified` |
| `[폐기 · DEPRECATED v0.1.0] 구 정비내규 제3조 (제4장 ESD·제5장 배터리/히트싱크 수칙 위반으로 폐기)` | [만료/폐기 · DEPRECATED v0.1.0] 구(舊) 정비내규 제3조 — 배터리 연결 상태 ZIF 핫스왑 및 액상 써멀 그리스 재사용 특례 (제4장 PDF p.32 · 제5장 PDF p.48, 54 정본에 의해 대체) | `PDF p.32` (`PDF p.32, 48, 54 (Doc p.26, 42, 48)`) | `deprecated` |

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 및 Dataplex KC 연동 구조
- 본 챕터 총괄 문서(`doc.md`)와 소속 청크들은 원본 PDF(`docs/pdf_6290467_en-US-1.pdf`)의 실제 목차(Chapters 1~12) 및 PDF 페이지 번호(`pdf_page = doc_page + 6`)와 100% 일치하도록 `gemini-3.8-flash` Enrichment Agent로 생성되었으며, `./bin/kcmd` 파이프라인을 통해 Dataplex Knowledge Catalog(`okf` Aspect) 및 BigQuery Property Graph(`hp_dragonfly_ontology_graph`)와 동기화됩니다.
