---
type: Provision
title: '제7장 §7.2 (증상별 하드웨어·펌웨어 원인 트리아지 매트릭스 — 무전원 · 과열 쓰로틀링 · 웹캠 미검출 · 5G WWAN 끊김 · 펜 무선충전)'
description: '현장에서 빈발하는 5대 복합 증상(무전원/블랙스크린, 97°C CPU 과열 쓰로틀링, 5MP IR 웹캠 미인식/셔터 잠김, 5G WWAN 모뎀 실종, 충전식 MPP 2.0 틸트 펜 자석 충전 불량)에 대한 소프트웨어/펌웨어 우선 점검 및 하드웨어 FRU 에스컬레이션 순서를 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 7bec2c944c49fec7ed51f85cdd4904bbe50c3383ef994748fbe95e1242d90a61
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/07_ch6_7_bios_and_blink_codes/doc.md
sequence: 83
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제7장 §7.2'
source_page: 83
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제7장 §7.2 — 증상별 하드웨어·펌웨어 원인 트리아지 매트릭스 (`TS-DFG3-001` ~ `TS-DFG3-006`, pp. 85–88)

## 1. 6대 표준 트러블슈팅 케이스 (`TroubleshootingCase`) 및 과잉 수리 방지 매핑
| 케이스 ID | 현장 접수 증상 | 연관 부품 (`MITIGATES_CASE`) | 비침습 1차 진단 게이트 (`hardware-fru-replacement-rate <= 12.0%`) |
| :---: | :--- | :--- | :--- |
| `TS-DFG3-001` | 전원 인가 후 블랙스크린 & LED `3.2` 점멸 | `N19201-601` (시스템 보드) | `Win+B+Power` Sure Start 복구 + `15초` EC 리셋 선행 (무분해 해결률 `78%`) |
| `TS-DFG3-002` | 5G WWAN `No Service` 또는 모뎀 미인식 | `M90792-001`, `N19210-001` | BIOS IMEI 화이트리스트 · SIM 트레이(`N22920-001`) · 4×4 MIMO 안테나(`#5~#8`) 체결 확인 |
| `TS-DFG3-003` | 고부하 시 CPU `95°C` 쓰로틀링 및 팬 소음 | `N18245-001`, `N18244-001` | Intel DPTF 드라이버 업데이트 및 팬 단독 점검(방열판 불필요 탈거 금지) |
| `TS-DFG3-004` | 폴리오 모드 전환 시 힌지 유격·자석 안착 불량 | `N18995-001` vs `N18990-001` | `$640` OLED 통교체 금지 ➔ `$95` 폴리오 힌지 키트(`N18995-001`) 부분 교체 |
| `TS-DFG3-005` | F12 카메라 프라이버시 키 무반응·웹캠 블랙 | `N19015-001`, `N19002-001` | HP Hotkey Support / EC 리셋 ➔ 키보드 ZIF 리본 ➔ 8MP IR 카메라 순 분리 진단 |
| `TS-DFG3-006` | 우측 마그네틱 도크 부착 시 와콤 펜 충전 불가 | `N19020-001`, `N19021-001` | 펜 상단 USB-C 직결 충전 교차 테스트로 펜(`N19020-001`) vs 본체 도크(`N19021-001`) 분리 |
