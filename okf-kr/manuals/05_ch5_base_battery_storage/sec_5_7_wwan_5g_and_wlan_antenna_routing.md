---
type: Provision
title: '제5장 §5.7 (5G WWAN(Intel 5000 / XMM 7560 R+) 모듈 분리 · 4x4 MIMO 동축 안테나 색상 매핑(5·6·7·8) 및 BIOS 화이트리스트)'
description: '5G/LTE WWAN 모듈(N00182-005 / M52040-005) 분리 시 U.FL 마이크로 동축 커넥터 파손을 방지하는 수직 분리 수칙과 4개 MIMO 안테나 케이블 번호·색상 매핑(5:주황, 6:백색, 7:황색, 8:보라), HP BIOS FCC 화이트리스트 제한을 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 553617ab56f39860f6d774dbd618b83bb2cd65f9700fb01c7a4e80c4b1c0cf19
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/05_ch5_base_battery_storage/doc.md
sequence: 43
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.7'
source_page: 43
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.7 — 5G WWAN(`M90792-001`) 모듈 분리 및 4×4 MIMO 동축 안테나 색상 매핑 (pp. 43–51)

## 1. 대상 FRU 및 선행 분해 DAG
- **부품 번호:** `M90792-001` / `N00182-005` (5G NR Sub-6 GHz WWAN 모듈), `N19210-001` (4×4 MIMO 안테나 키트).
- **선행 분리 경로 (`REQUIRES_REMOVAL_OF` 2-Hop):**
  `N22918-001`(하판 커버) ➔ `M90788-005`(배터리 전원 분리) ➔ `M90792-001`(5G WWAN 모듈).

## 2. 4×4 MIMO MHF4 초소형 동축 안테나 단자 번호·색상 매핑 규칙
| 안테나 번호 | 케이블 색상 (Color Code) | M.2 WWAN 단자 역할 | 체결 시 필수 주의사항 |
| :---: | :---: | :--- | :--- |
| **#5 (Main)** | **주황색 (Orange)** | Primary TX/RX 주 안테나 | MHF4 단자를 수직(`90°`)으로 눌러 체결 (비틀기 금지) |
| **#6 (Aux)** | **백색 / 청색 (White/Blue)** | Diversity / GNSS 보조 안테나 | 단자 번호 각인(`5·6·7·8`)과 케이블 태그 1:1 일치 필수 |
| **#7 (MIMO 1)** | **황색 (Yellow)** | 4×4 Downlink MIMO 3번 채널 | 풀포워드 힌지 가이드 채널 내부에 완전히 매립 배선 |
| **#8 (MIMO 2)** | **자주색 (Purple)** | 4×4 Downlink MIMO 4번 채널 | 하판 보스(Boss) 기둥에 동축선이 찍히지 않도록 고정 |
