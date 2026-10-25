---
type: PolicyClause
title: '[폐기] 구(舊) 정비내규 제3조 v0.1.0 — 배터리 연결 상태에서의 ZIF 리본 케이블 핫스왑 허용 특례 (제5장 §5.5 전면 개정에 따라 만료)'
description: '[만료 주의: status: deprecated] 구버전(v0.1.0) 현장 신속 수리 지침에서 허용했던 ''전원만 끈 상태에서 배터리 커넥터 분리 없이 클릭패드·지문인식기 ZIF 리본 케이블을 바로 탈부착하는 특례''로, 12세대 Alder Lake-U 보드의 +11.58V 대기전원 쇼트 사고로 인해 폐기되었으며 현행 제5장 §5.5(배터리 제1선행 분리 원칙, v0.2.0)로 대체되었습니다.'
version: '0.1.0'
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
  sha256: 98c3f95b6a96c496459ccb9d596e155156a1b160111e37a463c098a9d3e7a514
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: deprecated
part_of: /internal_policies/08_hp_field_service_sop/doc.md
sequence: 30
treatment: verbatim_en
license: '사내한 대외비 (HP 글로벌 필드 서비스 표준 정비내규 SOP-2026-01)'
content_class: internal_policy
section_number: '내규 제3조(구 v0.1.0)'
source_page: 30
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [만료/폐기 · DEPRECATED] 구(舊) 정비내규 제3조 (`v0.1.0`) — 배터리 활성 상태 ZIF 리본 핫스왑 및 액상 써멀 그리스 재도포 특례

> **⚠️ 거버넌스 차단 경고 (`BLOCKED_DEPRECATED`):**
> 본 조항(`v0.1.0`, 만료일 `2025-12-31`)은 **제5장 §5.1 (`700V ESD 방전 수칙`), 제5장 §5.5 (`배터리 선행 분리 의무`), 및 내규 제2조 (`PTM7950 상변화 패드 의무화`)**의 전면 개정(`v0.2.0`)에 따라 **영구 폐기(`status: deprecated`)**되었습니다. Dataplex Knowledge Catalog(`okf_hp_dragonfly_kr`) 거버넌스 게이트에 의해 에이전트 인용이 원천 차단됩니다.

## 1. 폐기된 구(舊) 지침 원문 (`v0.1.0` — 현장 적용 절대 금지)
1. *(폐기된 조항 1)* 단순 M.2 SSD 교체 또는 키보드 ZIF 리본 재결착 시 작업 시간 단축을 위해 66Wh 배터리(`M90788-005`) 커넥터를 분리하지 않고 라이브 상태에서 작업할 수 있다.
2. *(폐기된 조항 2)* 베이퍼 챔버 방열판(`N18244-001`) 탈거 후 이소프로필 알코올(IPA 99%)로 기존 패드를 닦아내고 일반 주사기형 액상 써멀 그리스(Shin-Etsu X-23-7783D)를 완두콩 크기로 재도포하여 기존 방열판을 재사용할 수 있다.

## 2. 현행 대체 정본 조항 (`superseded_by`)
- **전원/ESD 안전 대체 정본:** `manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol` (제5장 §5.1) 및 `sec_5_5_battery_pack_isolation_and_removal` (제5장 §5.5)
- **열관리 대체 정본:** `internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap` (내규 제2조 · `SAFE-DFG3-THM`)
