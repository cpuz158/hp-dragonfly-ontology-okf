---
type: Provision
title: '제2장 §2.4 (하판 서비스 태그 레이블 — 일련번호(Serial Number) · Product ID · 보증 기간 및 DMI 기록 의무)'
description: '하판 커버에 각인된 Serial Number, Product ID, 모델명, 보증 코드의 식별 방법과 시스템 보드 FRU 교체 후 HP BIOS Configuration Utility(BCU)로 DMI 정보를 재주입해야 하는 의무를 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 02_ch2_external_components
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 2633918e9f59cbc0fd9c61f6b8bfed0834b7d1ea81905f7b07b8d726d7b47a06
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/02_ch2_external_components/sec_2_4_service_tag_and_regulatory_labels.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 14
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제2장 §2.4'
source_page: 14
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제2장 §2.4 — 하판 서비스 태그 레이블 · 일련번호(Serial Number) 및 DMI 기록 의무 (pp. 15–16)

## 1. 하판 레이저 각인 서비스 태그 식별 항목 (서비스 매뉴얼 p. 15)
1. **Product Name (제품명):** HP Elite Dragonfly 13.5 G3 / HP Dragonfly Folio G3
2. **Serial Number (S/N · 10자리 영숫자):** 기기 고유 식별 번호 (예: `5CG234XXXX`)
3. **Product ID / SKU Number:** 공장 출고 하드웨어 구성 코드 (예: `6B2Z8EA#ABU` / `SKU-DFG3-I732-5G`)
4. **Warranty Period & Regulatory Markings:** 보증 기간 코드 및 FCC / KC / CE 무선 인증 식별자.

## 2. 시스템 보드 교체 시 BIOS DMI 재주입 강행 의무
- 시스템 보드(`M90788-601` / `N19201-601`) 교체 후 하판 커버(`N22918-001`)에 각인된 **Serial Number, SKU Number, System Board CT 번호, UUID**를 반드시 HP MPM(Manufacturing Programming Mode) / UEFI 유틸리티에 재주입하고 TPM 2.0 및 Intel vPro ME를 재봉인(Sealing)해야 합니다(부록 B §B.2 참조).
