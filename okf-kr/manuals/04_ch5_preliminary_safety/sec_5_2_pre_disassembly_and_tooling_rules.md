---
type: PolicyClause
title: '제5장 §5.2 (분해 전 필수 사전 조치 및 전용 공구 규격 — Torx T5 · Phillips #0/#1 · 비자성 플라스틱 오프닝 툴)'
description: '하판 개방 전 Windows 완전 종료(S5), AC 어댑터·Thunderbolt 독 분리, Nano-SIM 트레이 제거 절차와 마그네슘 섀시 손상 방지를 위한 전용 공구 및 토크 규격을 정의합니다.'
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
  sha256: 584a22296c836ae923ea5a746151cc74c6f88b17d01fb6173895d549b3e27b88
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/04_ch5_preliminary_safety/sec_5_2_pre_disassembly_and_tooling_rules.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/04_ch5_preliminary_safety/doc.md
sequence: 31
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.2'
source_page: 31
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.2 — 분해 전 필수 사전 조치(Service Mode) 및 전용 정밀 공구 규격 (pp. 31–32)

## 1. 분해 전 6대 필수 사전 절차
1. 외부 AC 어댑터, Thunderbolt 도크, USB 주변기기 및 Nano-SIM 카드(`N22920-001`)를 모두 제거합니다.
2. UEFI BIOS(`F10` ➔ `Power` ➔ `Battery Shipping / Service Mode`)에 진입하여 내장 배터리 팩의 FET 출력을 소프트웨어적으로 1차 차단합니다.
3. 전원 버튼을 `5초` 이상 길게 눌러 메인보드 캐패시터의 잔류 전하(Flea Power)를 완전히 방전시킵니다.

## 2. 공인 정밀 수리 공구 및 체결 토크 규격
- **Torx T5 정밀 드라이버 (`0.20 N·m`):** 하판 커버(`N22918-001`) 5개 캡티브 나사 전용.
- **Phillips P0 / P1 정밀 드라이버 (`0.22 N·m` ~ `0.35 N·m`):** 배터리(`M90788-005`), 베이퍼 챔버 방열판(`N18244-001`), 시스템 보드(`N19201-601`), 폴리오 힌지(`N18995-001`) 체결용.
- **비자성 플라스틱 스퍼저 (Non-Conductive Nylon Spudger):** ZIF 커넥터 래치 및 하판 클립 분리용 (금속 일자 드라이버 사용 엄금).
