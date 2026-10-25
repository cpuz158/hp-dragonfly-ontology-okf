---
type: Provision
title: '제5장 §5.12 (냉각 팬(M90791-001) 및 베이퍼 챔버 히트싱크(M90790-001) 분리 — 대각선(1→2→3→4) 토크 체결 및 써멀 그리스 도포 규격)'
description: '냉각 팬(M90791-001) 및 베이퍼 챔버 히트싱크(M90790-001) 분리·재장착 시 Alder Lake-U 코어 다이 균열 및 편측 들뜸으로 인한 97°C 과열 쓰로틀링을 막기 위해 히트싱크 각인 번호(1→2→3→4) 대각선 교차 체결과 신품 써멀 컴파운드 재도포를 강제합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 29d687c87128d20efc60f1d5bf8f97b765e3b09c9b21adf8bda67bbcf66d6bce
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/06_ch5_thermal_sysboard_display/doc.md
sequence: 54
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.12'
source_page: 54
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.12 — 냉각 팬(`N18245-001`) 및 베이퍼 챔버 방열판(`N18244-001`) 분리 · PTM7950 규격 (pp. 52–59)

## 1. 냉각 팬(`N18245-001`)과 베이퍼 챔버 방열판(`N18244-001`)의 독립 분해 관계
- **핵심 분해 DAG 규칙:**
  - **냉각 팬(`N18245-001` / `M90791-001`) 단독 교체 시:** `N22918-001`(하판 커버) ➔ `M90788-005`(배터리)만 분리하면 즉시 팬 나사 3개와 4핀 PWM 케이블을 풀어 교체할 수 있으며, **베이퍼 챔버 방열판(`N18244-001`)을 떼어내서는 안 됩니다.**
  - 불필요하게 방열판을 탈거하면 상변화 써멀 패드(`Shin-Etsu PTM7950`) 밀착층이 파괴되어 방열판 키트까지 재교체해야 합니다.

## 2. 베이퍼 챔버 방열판(`N18244-001`) 탈거 및 대각선 토크 순서 (`SAFE-DFG3-THM`)
1. **분해 시:** 방열판 다이 플레이트에 각인된 번호의 **역순(`4 ➔ 3 ➔ 2 ➔ 1` 대각선 순서)**으로 캡티브 Phillips PM2.0×3.0 나사 4개를 풉니다.
2. **재장착 시:** 주사기형 액상 써멀 그리스 재도포(폐기된 구 v0.1.0 내규 제3조)는 엄격히 금지되며, 반드시 정품 **Shin-Etsu PTM7950 상변화 패드**가 사전 부착된 방열판을 **`1 ➔ 2 ➔ 3 ➔ 4` 대각선 순서(`0.25 N·m`)**로 체결합니다.
