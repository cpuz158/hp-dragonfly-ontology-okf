---
type: section
title: '[만료/폐기 · DEPRECATED v0.1.0] 구(舊) 정비내규 제3조 — 배터리 연결 상태 ZIF 핫스왑 및 액상 써멀 그리스 재사용 특례 (제4장 PDF p.32 · 제5장 PDF p.48, 54 정본에 의해 대체)'
description: '과거 구버전(v0.1.0, 만료일 2025-12-31)에서 허용했던 배터리 미분리 상태의 ZIF 리본 핫스왑 및 방열판 구형 액상 그리스 재도포 지침으로, 원본 PDF 제4장(PDF p.32, 작업 전 전원 차단 및 ESD 접지), 제5장 배터리 선행 분리(PDF p.48), 제5장 히트싱크 써멀 패드 매회 신품 교체(PDF p.54) 정본에 의해 영구 폐기(`status: deprecated`)되어 Dataplex KC 거버넌스 게이트(`before_tool_callback`)에서 차단됩니다.'
version: '0.1.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=32
  kind: origin_document
  sha256: f183c303a282204e7f80678d7f33104f2f4c925f5f66efaaa0e07df8a3947bb9
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: deprecated
part_of: 08_internal_field_sop_playbooks
sequence: 26
treatment: deprecated_archive
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '[폐기 · DEPRECATED v0.1.0] 구 정비내규 제3조 (제4장 ESD·제5장 배터리/히트싱크 수칙 위반으로 폐기)'
source_page: 32
source_pages_span: 'PDF p.32, 48, 54 (Doc p.26, 42, 48)'
verified:
- by: governance_board:revoked_2025_12
  at: '2026-10-25T10:02:00Z'
  method: deprecation_audit
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [만료/폐기 · DEPRECATED v0.1.0] 구(舊) 정비내규 제3조 — 배터리 연결 상태 ZIF 핫스왑 및 액상 써멀 그리스 재사용 특례 (제4장 PDF p.32 · 제5장 PDF p.48, 54 정본에 의해 대체)

## 거버넌스 및 정책 상태 (Governance Metadata)
- **상태 (Status)**: `deprecated`
- **정책 게이트 (Policy Gate)**: `BLOCKED_DEPRECATED`
- **관련 규정 및 대체 문서**: HP Dragonfly Folio 13.5" G3 정비 및 유지보수 가이드 (제4장 PDF p.32 / Doc p.26, 제5장 PDF p.48, 54)

---

## 폐기 개요 및 위험성 경고 (Deprecated Policy Overview)
과거 현장 정비 효율성을 위해 한시적으로 운영되었던 배터리 미분리 상태(Live-Battery)에서의 ZIF/FPC 커넥터 탈부착 및 방열판 분리 시 기존 써멀 그리스의 단순 재사용 규정은 완전 폐기되었습니다.

주요 위험 요소는 다음과 같습니다:
- **전원 인가 상태 쇼트**: 배터리가 연결된 상태에서 내부 ZIF 또는 메인보드 회로를 접촉할 경우, 미세 정전기 또는 순간 단락으로 인해 메인보드 전원부 및 내장 IC가 영구 소손될 수 있습니다.
- **정전기 방전(ESD) 파괴**: Chapter 4(PDF p.32, Doc p.26)에 명시된 바와 같이, 단 700V 수준의 저전압 정전기로도 반도체 내부 층이 열화되어 제품 수명이 단축되고 즉각적 또는 지연된 기능 장애가 발생합니다.
- **열 전도 성능 저하**: 방열판(Heat sink) 탈거 시 도포된 써멀 그리스는 산화 및 기포가 발생하므로, 잔류물을 알코올 패드로 완전히 제거한 후 규정된 규격으로 재도포해야 합니다.

---

## 정본 유지보수 규정 준수 사항 (Official Grounding & Handling Requirements)
공식 유지보수 가이드라인(PDF p.32~33, Doc p.26~27)에 의거하여 다음과 같은 절차를 의무적으로 준수해야 합니다:

1. **전원 차단 및 배터리 분리 선행**:
   - 드라이브 및 내부 부품 탈부착 전 반드시 운영체제를 통해 시스템을 정상 종료해야 합니다.
   - 컴퓨터가 대기 모드인지 최대 절전 모드인지 불확실한 경우 전원을 켠 후 OS 종료 절차를 거쳐야 합니다.
2. **개인 정전기 접지 장비 착용**:
   - 손목 스트랩(최대 1MΩ ±10% 저항)을 맨살에 밀착 착용하고 접지 매트에 연결합니다.
   - 부품의 핀, 리드 및 회로 패턴과의 직접 접촉을 엄격히 금지합니다.
3. **부품 보관 및 충격 방지**:
   - 민감 부품은 정전기 방지 용기에서 작업 직전까지 보관해야 합니다.
   - 드라이브 등 주요 부품은 최소 2.54cm(1인치) 이상의 충격 방지 폼 위에서만 취급해야 합니다.

### 습도 및 작업 환경별 정전기 발생량 참고

| 작업 환경 (Event) | 55% 상대습도 | 40% 상대습도 | 10% 상대습도 |
| :--- | :--- | :--- | :--- |
| 카펫 보행 (Walking across carpet) | 7,500 V | 15,000 V | 35,000 V |
| 비닐 바닥 보행 (Walking across vinyl floor) | 3,000 V | 5,000 V | 12,000 V |
| 작업대 작업자 동작 (Motions of bench worker) | 400 V | 800 V | 6,000 V |
| 플라스틱 튜브에서 부품 인출 | 400 V | 700 V | 2,000 V |
