---
type: PolicyClause
title: '제5장 §5.3 (팽창된 리튬이온 배터리(Swollen Battery) 취급 및 열폭주 방지 강행 수칙 — 압착·천공 금지 및 방화 격리)'
description: '6셀 68Wh(M90788-005) 또는 4셀 45Wh(M90789-005) 리튬이온 폴리머 배터리가 부풀어 올라 클릭패드 들뜸이나 하판 변형이 발생한 경우, 금속 공구 사용·압착·구멍 뚫기를 엄격히 금지하고 방화 모래/용기에 격리하도록 규정합니다.'
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
  sha256: 2a94143d3bb3e2c34c1dd2c8dab2b5f087e25545b543798a34bf418b977d2889
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/04_ch5_preliminary_safety/doc.md
sequence: 33
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.3'
source_page: 33
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.3 — 팽창된 리튬이온 배터리(Swollen Battery) 취급 및 700°C 열폭주 방지 수칙 (pp. 33–34)

## 1. 리튬이온 폴리머 셀 팽창 위험 경고 (`SAFE-DFG3-BAT`)
- 팽창(Swelling)된 `66Wh` 4셀 리튬이온 배터리(`M90788-005`)는 내부 전해질 분해 가스가 찬 상태로, 외부 압착·휨·금속 공구에 의한 파우치 천공 시 **`700°C` 이상의 급격한 열폭주(Thermal Runaway) 및 금속 화재**가 발생할 수 있습니다.

## 2. 팽창 배터리 분리 및 격리 강행 절차
1. **장력 서서히 해제:** 하판 커버(`N22918-001`)의 Torx T5 나사 5개를 풀 때 커버가 급격히 튀어 오르지 않도록 손바닥으로 가볍게 지지하며 대각선 순서로 천천히 이완합니다.
2. **금속 지렛대 절대 금지:** 팽창된 배터리를 섀시에서 들어 올릴 때 금속 드라이버나 날카로운 도구를 지렛대로 사용하는 행위를 엄격히 금지합니다.
3. **인접 베이퍼 챔버 방열판(`N18244-001`) 변형 동시 점검:** 배터리 팽창 압력으로 인해 인접한 베이퍼 챔버 히트싱크나 트랙패드 브래킷이 휘었는지 함께 점검하고, 분리된 배터리는 즉시 **Class-D 방화 모래/인증 리튬이온 격리 용기**에 보관합니다.
