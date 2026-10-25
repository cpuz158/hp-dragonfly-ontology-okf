---
type: Provision
title: '제6장 §6.1 (HP Computer Setup(F10) · HP Sure Start Gen7 듀얼 플래시 SPI 자가복구(Win+B) 및 펌웨어 안티롤백 보안 정책)'
description: 'HP Computer Setup(F10) 유틸리티, 32MB 주 SPI 플래시 손상 시 16MB 하드웨어 격리 골든 이미지에서 자동 복구하는 HP Sure Start Gen7 아키텍처, 키 조합(Win+B) 강제 복구 절차 및 Minimum Security Version(SVN) 롤백 방지 정책을 정의합니다.'
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
  sha256: 62e9636e7329a76b4b9d6b74313d9e96c40dd43443fef6385cb95071cf27ef80
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/07_ch6_7_bios_and_blink_codes/doc.md
sequence: 73
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제6장 §6.1'
source_page: 73
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제6장 §6.1 — HP Computer Setup(F10) · HP Sure Start Gen7 듀얼 플래시 SPI 자가복구(`Win+B`) (pp. 73–80)

## 1. HP Sure Start Gen7 하드웨어 기반 BIOS/EC 무결성 보호 아키텍처
- HP Dragonfly G3는 시스템 보드에 독립된 **HP Endpoint Security Controller (ESC)**와 프라이머리/백업 듀얼 SPI 플래시 메모리를 탑재하여 부팅 전 BIOS 및 임베디드 컨트롤러(EC) 펌웨어의 암호화 서명을 하드웨어 레벨에서 검증합니다.

## 2. 무분해 강제 SPI BIOS 복구 절차 (`Win + B + Power` 3단계)
부팅 불가(No POST), 블랙스크린, 또는 전원/Caps Lock LED `2.2` / `3.2` 점멸 시 **하판을 개봉하기 전에 반드시 아래 무분해 복구를 1차로 수행**해야 합니다:
1. 전원을 완전히 끄고 정품 65W USB-C AC 어댑터를 연결합니다.
2. 키보드의 **`Windows 로고 키 + B 키`**를 동시에 누른 상태에서 **전원 버튼을 `2~3초`간 눌렀다 뗍니다**(이때 `Win + B` 키는 화면이 켜지거나 비프음이 날 때까지 `10초`간 계속 유지).
3. HP Sure Start Gen7이 격리된 골든 SPI 플래시에서 프라이머리 BIOS와 EC 이미지를 자동 복원하고 재부팅합니다(복구 후 **전원 버튼 `15초` 홀드 CMOS/EC 리셋** 병행).
