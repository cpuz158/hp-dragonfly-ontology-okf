---
type: Table
title: '제7장 §7.1 [표 7-1·7-2] (CAPS LOCK / NUM LOCK LED 점멸 진단 코드(3.2, 2.2, 5.2) 및 POST 오류 메시지(90B, 601, 502) 판독 기준)'
description: '부팅 실패 시 CAPS LOCK(긴 점멸)과 NUM LOCK(짧은 점멸) 조합으로 출력되는 하드웨어 진단 코드(2.2, 3.2, 3.3, 3.4, 5.2) 및 화면 POST 오류 메시지(90B 팬 고장, 601 배터리 용량 저하, 502 CMOS 체크섬 오류)의 원인과 표준 조치를 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- structured_table
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: d22f4316733743f1e4690f0f36adebb0deee1f3fd056a5ddf9befd6031db6993
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/07_ch6_7_bios_and_blink_codes/doc.md
sequence: 79
treatment: structured_table
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제7장 §7.1'
source_page: 79
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제7장 §7.1 [표 7-1·7-2] — CAPS LOCK / 전원 LED 점멸 진단 코드(`3.2`, `2.2`, `4.2`) 및 POST 오류 판독 기준 (pp. 81–84)

## 1. LED 점멸 진단 코드 매트릭스 (긴 호박색/백색 깜빡임 × 짧은 백색 깜빡임)
| 진단 코드 ID | 점멸 패턴 (Long · Short) | 하드웨어/펌웨어 근본 원인 | 1차 의무 조치 (`GOVERNED_BY_PLAYBOOK`) |
| :---: | :---: | :--- | :--- |
| **`LED-3-2`** | 긴 점멸 **3회** · 짧은 점멸 **2회** | 온보드 LPDDR5 메모리 트레이닝 실패 또는 EC/BIOS 이미지 불일치 | **시스템 보드 즉시 교체 금지** ➔ `Win + B + Power` Sure Start 복구 및 `15초` EC 리셋 선행 (`TS-DFG3-001`) |
| **`LED-2-2`** | 긴 점멸 **2회** · 짧은 점멸 **2회** | 프라이머리 시스템 BIOS SPI 이미지 손상 | `Win + B + Power` HP Sure Start Gen7 자동 복구 실행 |
| **`LED-4-2`** | 긴 점멸 **4회** · 짧은 점멸 **2회** | CPU 과열 보호 작동 또는 냉각 팬(`N18245-001`) 회전 스톨(POST `90B`) | 냉각 팬(`N18245-001`) 4핀 커넥터 및 Intel DPTF 점검 (`TS-DFG3-003`) |
| **`POST-601`** | 배터리 LED **8회** 연속 점멸 | 내장 66Wh 배터리(`M90788-005`) 정품 셀 용량 `25%` 미만 저하 또는 팽창 | UEFI 배터리 진단 후 `M90788-005` 교체 (`SAFE-DFG3-BAT`) |
