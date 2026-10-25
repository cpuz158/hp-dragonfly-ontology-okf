---
type: Provision
title: '제2장 §2.1 (우측·좌측 입출력 포트 — 듀얼 Thunderbolt 4 USB4 40Gbps · USB-A 3.2 · HDMI 2.0b · Nano-SIM)'
description: '본체 우측 및 좌측에 배치된 2개의 Thunderbolt 4(USB Type-C 40Gbps, USB PD 65W/100W 충전 및 DisplayPort 1.4a Alt-Mode), USB-A 5Gbps, HDMI 2.0b 및 Nano-SIM 슬롯의 물리적 위치와 전력 규격을 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 02_ch2_external_components
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 2b7f1261c7af162f0b4d7c21187e63b35c373dc63bdca6182a24015223ea8788
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/02_ch2_external_components/sec_2_1_thunderbolt_and_io_ports.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 5
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제2장 §2.1'
source_page: 5
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제2장 §2.1 — 우측 및 좌측 외부 입출력(I/O) 컴포넌트 규격 (pp. 5–6)

## 1. 우측면 구성품 (서비스 매뉴얼 p. 5)
1. **오디오 출력(헤드폰) / 오디오 입력(마이크) 콤보 잭 (`3.5 mm`):** CTIA 규격 4극 스테레오 헤드셋 지원.
2. **SuperSpeed USB Type-A `5 Gbps` 포트 (HP Sleep and Charge 지원):** 절전 모드(`S0ix`) 또는 전원 오프 상태에서도 `5V / 1.5A` 상시 충전 제공.
3. **나노 시큐리티 락 슬롯 (Nano Security Lock Slot):** 초박형 물리 보안 케이블 잠금장치 연결부.
4. **USB Type-C® 전원 커넥터 겸 Thunderbolt™ 4 포트 #1 (우측):** USB4 `40 Gbps` 데이터 전송, USB Power Delivery 3.0 (`65W` 표준 / `100W` 고속 충전), **DisplayPort™ 1.4a** (`DSC 1.2`) 비디오 출력 지원.
5. **배터리 / AC 어댑터 상태 표시등:**
   - **백색 점등 (Solid White):** AC 어댑터 연결 및 배터리 충전 완료 (`> 90%`).
   - **호박색 점등 (Solid Amber):** AC 어댑터 연결 및 급속 충전 중.
   - **호박색 점멸 (8회 깜빡임):** 배터리 정품 인증 오류 또는 셀 전압 불량 (`POST 601`).

## 2. 좌측면 구성품 (서비스 매뉴얼 p. 6)
1. **HDMI® 2.0b 포트:** 최대 `4K @ 60 Hz` (`3840 × 2160`) 디지털 영상/음성 직접 출력.
2. **Nano-SIM 카드 트레이 (WWAN 모델 전용, `N22920-001`):** 푸시-이젝트 방식 5G/LTE USIM 트레이 (내장형 **eSIM** 병행 지원).
3. **USB Type-C® 전원 커넥터 겸 Thunderbolt™ 4 포트 #2 (좌측):** **HP Thunderbolt Dock G4 (`120W` / `280W`)** 연결 시 듀얼 4K `@ 60 Hz` 또는 단일 `8K @ 60 Hz` 출력 및 Intel VT-d DMA 메모리 보호 지원.
