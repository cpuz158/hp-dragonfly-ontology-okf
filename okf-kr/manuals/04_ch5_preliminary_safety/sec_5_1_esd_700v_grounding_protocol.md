---
type: PolicyClause
title: '제5장 §5.1 (정전기 방전(ESD 700V) 손상 방지 강행 수칙 — 접지 손목 밴드 · 전도성 매트 및 흑색 Mylar 실드 보존 의무)'
description: '인체 정전기가 700V만으로도 12세대 Alder Lake-U SoC 및 LPDDR5 메모리에 잠재적 열화(Latent Degradation)를 유발하므로, 분해 전 1MΩ 접지 손목 밴드 착용과 전도성 흑색 Mylar 필름 보존을 강제하는 안전 수칙입니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 04_ch5_preliminary_safety
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 2fa203cff736d9ab6124836dc307221ce6da6231649fefa78eeadba0717411ad
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/04_ch5_preliminary_safety/doc.md
sequence: 29
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.1'
source_page: 29
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.1 — 정전기 방전(ESD 700V) 손상 방지 강행 수칙 및 Mylar 실드 보존 의무 (pp. 29–30)

## 1. 700V 정전기 방전(ESD) 민감도 경고 (`SAFE-DFG3-ESD`)
- 인체가 체감하는 정전기 임계치는 약 `3,000 V`이나, HP Dragonfly G3의 12세대 Intel Alder Lake SoC 및 온보드 LPDDR5-6400 컨트롤러는 **`700 V` 이하의 미세 정전기 방전(ESD)**만으로도 영구적인 게이트 산화막 파괴가 발생합니다.

## 2. 필수 ESD 방호 및 차폐 보존 프로토콜
1. **접지 손목 스트랩 및 전도성 매트 착용:** 분해 시작 전 `1 MΩ ± 10%` 안전 저항이 내장된 ESD 손목 밴드를 착용하고 접지된 전도성 작업 매트(상대습도 `40% ~ 60%`) 위에서 작업해야 합니다.
2. **배터리 선행 분리 의무:** 하판 커버(`N22918-001`) 개방 직후 **어떤 ZIF 리본이나 M.2 모듈도 건드리기 전에** 반드시 배터리 팩(`M90788-005`) 전원 커넥터를 분리해야 합니다(구 v0.1.0 핫스왑 특례 영구 폐기).
3. **전도성 흑색 Mylar 차폐 필름(`N09040-001`) 원상 복원:** 시스템 보드와 SSD 상단의 흑색 Mylar 필름은 ESD 및 EMI 간섭을 막는 필수 안전 부품이므로 찢어지거나 누락된 상태로 재조립해서는 안 됩니다.
