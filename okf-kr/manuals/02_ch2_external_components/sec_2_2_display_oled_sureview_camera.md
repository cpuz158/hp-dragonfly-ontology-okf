---
type: Provision
title: '제2장 §2.2 (디스플레이 서브시스템 — 13.5형 3K2K OLED vs WUXGA+ Sure View Reflect 및 5MP IR 웹캠)'
description: '13.5형 3:2 디스플레이 패널 3종(3000x2000 3K2K OLED 터치, 1920x1280 WUXGA+ 1000-nit HP Sure View Reflect 보안 패널, 400-nit 저전력 IPS)과 상단 베젤의 5MP IR 카메라·조도 센서·듀얼 마이크 구조를 정의합니다.'
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
  sha256: 4208fc687ed183bb5fc4c030d37c8605237d67d06ac60c4440f4510d69a2dead
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/02_ch2_external_components/sec_2_2_display_oled_sureview_camera.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 7
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제2장 §2.2'
source_page: 7
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제2장 §2.2 — 디스플레이 어셈블리 · 패널 옵션 및 상단 베젤 센서 구조 (pp. 7–9)

## 1. 13.5형 (34.3 cm) `3:2` 디스플레이 패널 3대 옵션
1. **3K2K (`3000 × 2000`) OLED BrightView 터치 디스플레이 (`N09033-001` / `N18990-001`):**
   - `400 nits` 휘도, `100% DCI-P3` 색역, Corning® Gorilla® Glass 5, VESA TrueBlack HDR 500 인증.
   - 전용 **40핀 고속 eDP 1.4b + 터치 통합 케이블 (`N09038-001`)** 적용.
2. **WUXGA+ (`1920 × 1280`) HP Sure View Reflect 통합 보안 디스플레이 (`N09032-001`):**
   - `1000 nits` 휘도, 눈부심 방지(Anti-Glare), 키보드 **`F2`** 핫키로 즉시 작동하는 하드웨어 구리 반사형 측면 시야 차단 레이어 내장.
3. **WUXGA+ (`1920 × 1280`) 저전력 IPS 디스플레이 (`N09031-001`):**
   - `400 nits` 휘도, `100% sRGB`, 초저전력 `1W` 패널 소비전력.

## 2. 상단 베젤 웹캠 및 센서 어레이 (서비스 매뉴얼 p. 7)
- **5 MP / 8 MP + IR MIPI/USB2 카메라 모듈 (`N09036-001` / `N19002-001`):** **HP Auto Frame**, Windows Hello 안면 인식용 듀얼 IR 발광기, **HP Presence** 조도 보정 지원.
- **주변 조도 및 색온도 센서 (ALS):** 주변 환경에 맞춰 OLED/IPS 휘도 및 화이트밸런스 자동 보정.
- **내장 듀얼 어레이 디지털 마이크:** 상단 베젤 에지 빔포밍 AI 노이즈 캔슬링 마이크.
