---
type: Provision
title: '제2장 §2.3 (탑커버 키보드 · 전자식 카메라 프라이버시 키(F12) · 지문인식기 및 Bang & Olufsen 쿼드 스피커)'
description: '탑커버 일체형 백라이트 키보드, 하드웨어 전자식 카메라 셔터 키(Camera Privacy Key), 팜레스트 우측 지문인식 센서(N08545-001), 글래스 클릭패드 및 Bang & Olufsen 4-스피커 오디오 서브시스템을 정의합니다.'
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
  sha256: 587e4c7ce126019012d9fc733d13bed45ef6c72708bdb71614c393fcbf4846aa
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/02_ch2_external_components/sec_2_3_keyboard_privacy_shutter_biometrics.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 10
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제2장 §2.3'
source_page: 10
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제2장 §2.3 — 탑커버 키보드 · 전자식 카메라 프라이버시 키(F12) · 지문인식기 및 오디오 (pp. 10–14)

## 1. 탑커버 일체형 백라이트 키보드 및 핫키 아키텍처
- **탑커버 키보드 어셈블리 (`N09042-001` / `N19015-001`):** 마그네슘 팜레스트와 백라이트 키보드가 열융착된 일체형 FRU 구조.
- **F12 전자식 카메라 프라이버시 셔터 키 (Electronic Camera Privacy Key):**
  - 물리적 플라스틱 슬라이더가 아닌 **임베디드 컨트롤러(EC) 인터럽트 기반 전자식 셔터 회로**를 통해 카메라 모듈(`N09036-001` / `N19002-001`)의 광학 셔터와 상태 LED를 제어합니다.
  - F12 작동 불량 시 카메라 모듈을 즉시 교체하지 말고 **HP Hotkey Support 드라이버, EC 펌웨어 리셋, 키보드 ZIF 리본 케이블**을 먼저 점검해야 합니다(제6장 §6.6 `TS-DFG3-005`).

## 2. 생체인증 및 Bang & Olufsen 쿼드 오디오 서브시스템
- **지문 인식 센서 (`N09041-001`):** 키보드 우측 하단 배열에 통합된 Match-on-Chip(MoC) 정전식 지문 센서.
- **Bang & Olufsen 쿼드 스피커 (`N09037-001`):** 상향 트위터 2개 + 하향 우퍼 2개 및 개별 스마트 앰프(Smart Amp) 구성.
