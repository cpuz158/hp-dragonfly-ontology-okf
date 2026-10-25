---
type: Provision
title: '제5장 §5.16 (시스템 보드(System Board, M90788-601) 분리 — 6단계 선행 분리 DAG(하판→배터리→SIM→SSD→WWAN→히트싱크) 및 ZIF 해제 절차)'
description: '시스템 보드(M90788-601) 교체 시 반드시 준수해야 하는 6단계 선행 부품 분리 순서(하판 커버 ➔ 배터리 ➔ Nano-SIM 트레이 ➔ M.2 NVMe SSD ➔ 5G WWAN 모듈 ➔ 냉각 팬 및 베이퍼 챔버 히트싱크)와 7개 ZIF 리본 케이블 해제·오른쪽 USB-C 브래킷 분리 절차를 규정합니다.'
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
  sha256: dc7c726095f0c757781f992398695b3846a29be3ebd1c4b17858525b63396d9b
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/06_ch5_thermal_sysboard_display/doc.md
sequence: 62
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.16'
source_page: 62
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.16 — 시스템 보드(`N19201-601` / `M90788-601`) 다단계 선행 분해 DAG 및 ZIF 해제 절차 (pp. 60–66)

## 1. 시스템 보드 교체를 위한 필수 다단계 분해 DAG (`REQUIRES_REMOVAL_OF`)
시스템 보드(`N19201-601` / `M90788-601`)를 들어 올리기 전에 반드시 아래의 선행 분리 체인을 순서대로 완료해야 합니다:
1. **[Step 1] `N22918-001` 하판 커버 분리** (Torx T5 캡티브 나사 5개, 제5장 §5.4)
2. **[Step 2] `M90788-005` 66Wh 배터리 팩 전원 커넥터 차단 및 분리** (`SAFE-DFG3-BAT`, 제5장 §5.5)
3. **[Step 3] `N22920-001` Nano-SIM 트레이 · `M90790-001` NVMe SSD · `M90792-001` 5G WWAN 모듈 분리** (제5장 §5.6~§5.7)
4. **[Step 4] `N18244-001` 베이퍼 챔버 방열판 분리** (대각선 `4➔3➔2➔1` 순서, 제5장 §5.12)
5. **[Step 5] `N19201-601` 시스템 보드 ZIF 리본(디스플레이 eDP 40핀, 키보드, 트랙패드, 지문센서, 스피커) 해제 및 보드 나사 4개(`PM2.0×3.0`) 분리**

## 2. 교체 후 필수 조치 (부록 B 연계)
- 온보드 LPDDR5 메모리가 보드에 직결되어 있으므로 보드 교체 후 반드시 **BIOS DMI 블록(S/N, SKU, CT, UUID) 재주입 및 Intel vPro ME / TPM 2.0 봉인**을 수행해야 합니다.
