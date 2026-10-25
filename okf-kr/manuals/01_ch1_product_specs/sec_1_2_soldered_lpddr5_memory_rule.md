---
type: PolicyClause
title: '제1장 §1.2 (온보드 솔더링 LPDDR5-5200 메모리 아키텍처 — SO-DIMM 슬롯 부재 및 보드 통교체 강제 단서)'
description: '모든 시스템 메모리(16GB / 32GB LPDDR5-5200)가 메인보드에 직접 납땜(Soldered On-Board)되어 있어 단품 메모리 증설·교체가 불가하며, 용량 변경 시 반드시 해당 SKU 전용 시스템 보드 FRU(표 3-1)로 통교체해야 함을 규정합니다.'
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
  sha256: af4e9ce989880e4509349469747e7bff6573c5a53b380f6cd4e23da936aa121d
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/01_ch1_product_specs/doc.md
sequence: 2
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제1장 §1.2'
source_page: 2
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제1장 §1.2 — 온보드 솔더링 LPDDR5 메모리 아키텍처 및 시스템 보드 결합 강행 단서 (p. 2)

## 1. 매뉴얼 원문 기술 규격 (서비스 매뉴얼 p. 2)
- **메모리 표준 규격:** **LPDDR5-5200 / 6400 MHz** 듀얼 채널 초저전력 고속 메모리 (`4800 MHz` 실효 클럭 구동).
- **지원 용량 옵션:** `16 GB` (`2 × 8 GB` 듀얼 채널) 또는 `32 GB` (`2 × 16 GB` 듀얼 채널).
- **물리적 실장 형태 (필수 주의 단서 · Caveat):**
  > **중요 (IMPORTANT):** 시스템 메모리는 **시스템 보드(System Board)에 직접 납땜(Soldered On-Board)**되어 출고되며, **고객이나 현장 엔지니어가 개별 메모리 모듈을 증설하거나 단품 교체할 수 없습니다.** 섀시 내부에 SO-DIMM 확장 슬롯이 존재하지 않습니다.

## 2. 현장 서비스 엔지니어링 조치 지침
1. **단품 RAM 교체 불가:** HP Sure Start SPI BIOS 복구(`Win + B + Power`) 이후에도 지속되는 메모리 비트 오류(`CAPS LOCK 3.2` 점멸 코드)는 SO-DIMM 재장착으로 해결할 수 없습니다.
2. **정확한 시스템 보드 FRU 1:1 매칭 의무:** 메모리 용량 변경이나 불량 수리 시 반드시 **제3장 별표 3-1(p. 19)**에서 **CPU 모델 + Intel vPro 지원 여부 + RAM 용량(`16 GB` vs `32 GB`) + 5G WWAN 슬롯 유무**가 일치하는 시스템 보드 스페어 파트 번호(예: `i7-1265U vPro + 32GB + WWAN` ➔ `M90788-601` / `N19201-601`)로 통교체해야 합니다.
