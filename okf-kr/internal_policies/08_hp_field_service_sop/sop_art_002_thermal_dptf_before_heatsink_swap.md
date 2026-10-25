---
type: PolicyClause
title: '내규 제2조 (CPU 95°C 과열 쓰로틀링 및 팬 소음 접수 시 베이퍼 챔버(M90790-001) 교체 전 Intel DPTF 펌웨어 및 대각선 토크 점검 기준)'
description: '화상회의 중 CPU 95°C 이상 과열 및 400MHz 클럭 저하(PROCHOT#) 증상 시 즉시 베이퍼 챔버 히트싱크(M90790-001)를 교체하지 않고, BIOS U90 01.14.00 및 Intel DTT 드라이버 업데이트 후 히트싱크 1-2-3-4 대각선 체결 토크와 써멀 그리스를 먼저 점검하도록 규정합니다.'
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
  sha256: cbcab6437edb7987543cc6548e84b503a13be12dac816858a2f3798b3da8ef14
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: verified
part_of: /internal_policies/08_hp_field_service_sop/doc.md
sequence: 55
treatment: verbatim_en
license: '사내한 대외비 (HP 글로벌 필드 서비스 표준 정비내규 SOP-2026-01)'
content_class: internal_policy
section_number: '내규 제2조'
source_page: 55
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [사내 표준 정비내규 제SOP-2026-01호] 내규 제2조 — 과열 쓰로틀링 접수 시 베이퍼 챔버(`N18244-001`) 교체 전 점검 및 PTM7950 상변화 패드 강행 기준

## 1. 열관리 트리아지 선행 점검 절차 (`TS-DFG3-003`)
1. CPU 패키지 온도 `95°C` 도달 또는 팬 소음 접수 시, 즉시 베이퍼 챔버 방열판(`N18244-001` / `M90790-001`, `$115`)을 탈거하지 말고 **BIOS 최신 버전 및 Intel Dynamic Tuning Technology (DPTF) 전력 프로파일**을 먼저 업데이트합니다.
2. 팬 베어링 소음이나 회전 스톨(`POST 90B` / `LED 4.2`)만 발생한 경우, 방열판(`N18244-001`)은 그대로 둔 채 **듀얼 냉각 팬(`N18245-001`, `$58`)만 단독 분리·교체**합니다(제5장 §5.12).

## 2. 액상 써멀 그리스 사용 금지 및 PTM7950 상변화 패드 의무화 (`SAFE-DFG3-THM`)
- 베이퍼 챔버 방열판이나 시스템 보드를 실제로 분리한 경우, 기존 방열판에 주사기형 액상 써멀 그리스를 재도포하여 재장착하는 행위(구 v0.1.0 내규 제3조)는 **Pump-Out 현상 및 VRM 열폭주 위험으로 인해 영구 금지**됩니다. 반드시 **Shin-Etsu PTM7950 상변화 패드**가 사전 부착된 정품 키트를 대각선 `1➔2➔3➔4` 순서(`0.25 N·m`)로 체결하십시오.
