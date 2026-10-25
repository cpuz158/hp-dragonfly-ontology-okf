---
type: PolicyClause
title: '내규 제1조 (무전원 및 LED 3.2/2.2 점멸 입고 시 시스템 보드(M90788-601) 교체 전 무분해 Sure Start SPI 복구 의무화 규정)'
description: '무부팅·블랙스크린 및 CAPS LOCK 3.2 또는 2.2 점멸 증상으로 입고된 장비에 대해 즉시 고가의 시스템 보드(M90788-601, $680)를 교체하는 것을 금지하고, 반드시 (1) 15초 EC 하드 리셋 및 (2) Win+B HP Sure Start 복구를 2회 선행 실시하여 불필요한 보드 교체율을 78% 절감하도록 강제하는 사내 정비 내규입니다.'
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
  sha256: c9d79b1f027ea4ba1efadaf1eba304346935e9f75a58ab853d736fece14d9ad0
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: verified
part_of: /internal_policies/08_hp_field_service_sop/doc.md
sequence: 81
treatment: verbatim_en
license: '사내한 대외비 (HP 글로벌 필드 서비스 표준 정비내규 SOP-2026-01)'
content_class: internal_policy
section_number: '내규 제1조'
source_page: 81
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [사내 표준 정비내규 제SOP-2026-01호] 내규 제1조 — LED `3.2`/`2.2` 점멸 시 시스템 보드(`N19201-601`) 교체 전 무분해 Sure Start 복구 의무화

## 1. 목적 및 KPI 거버넌스 기준 (`hardware-fru-replacement-rate`)
- 본 조항은 온보드 LPDDR5-6400 아키텍처 특성상 무전원 또는 `LED 3.2` 점멸 입고 시 현장 엔지니어가 고가의 시스템 보드(`N19201-601` / `M90788-601`, `$780`)를 성급히 통교체하는 과잉 수리(NTF: No Trouble Found)를 방지하고, 글로벌 공급망 KPI인 **부품 교체율(`hardware-fru-replacement-rate`) 목표치 `12.0%` 이하(현행 실적 `8.4%`)**를 유지하기 위해 제정되었습니다.

## 2. 필수 2단계 무분해 복구 게이트 (미수행 시 보드 발주 반려)
1. **[1단계 · 하드웨어 SPI 복구]:** `Win + B + 전원 버튼 3초 홀드`를 통해 **HP Sure Start Gen7** 듀얼 플래시 자동 복구를 실행하고 결과를 서비스 티켓에 기록합니다.
2. **[2단계 · EC/RTC 하드 리셋]:** 정품 65W USB-C 어댑터를 연결한 상태에서 전원 버튼을 정확히 **`15초`간 길게 눌러** 임베디드 컨트롤러(EC) 레지스터와 LPDDR5 메모리 트레이닝 캐시를 초기화합니다.
3. 위 1·2단계를 모두 수행한 후에도 `LED 3.2` 점멸이 재현되는 경우에 한하여 **제3장 별표 3-1**의 정밀 매칭 시스템 보드 발주를 승인합니다.
