---
type: Provision
title: '제1장 §1.1 (플랫폼 개요 — 12세대 Intel Alder Lake-U 프로세서 및 13.5형 3:2 마그네슘 섀시 아키텍처)'
description: 'HP Elite Dragonfly 13.5 G3 노트북 PC의 프로세서 라인업(i5-1235U, i5-1245U vPro, i7-1255U, i7-1265U vPro), Intel Iris Xe 그래픽 및 13.5형 3:2 종횡비 클램쉘 섀시 설계 기준을 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: adf5d70a8b2c01d688e67e08837a398cf96e8618cc37ea15f2f124adcb8ff990
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/01_ch1_product_specs/sec_1_1_platform_architecture.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/01_ch1_product_specs/doc.md
sequence: 1
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제1장 §1.1'
source_page: 1
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제1장 §1.1 — 제품 개요: 프로세서 및 플랫폼 아키텍처 (pp. 1–2)

## 1. 플랫폼 식별 및 문서 적용 범위
- **대상 제품명:** HP Elite Dragonfly 13.5형 G3 노트북 PC (및 HP Dragonfly Folio 13.5형 G3 2-in-1 레퍼런스)
- **서비스 매뉴얼 문서 파트 번호:** `N17344-001` (초판, 2022년 5월)
- **섀시 폼팩터:** 초경량 마그네슘-알루미늄 합금 클램쉘 · 13.5형 `3:2` 종횡비 디스플레이 (`0.99 kg` / `2.18 lbs` 시작 무게 · 슬레이트 블루 및 내추럴 실버 마감).

## 2. 12세대 Intel® Core™ Alder Lake-U 프로세서 라인업 (15W TDP · 10코어 / 12스레드)
1. **Intel® Core™ i7-1265U (vPro® Enterprise 지원):** Intel Turbo Boost 적용 시 최대 `4.8 GHz`, `12 MB` L3 캐시, 10코어(성능 P-코어 2개 + 효율 E-코어 8개), 12스레드.
2. **Intel® Core™ i7-1255U (Non-vPro):** 최대 `4.7 GHz` 터보 부스트, `12 MB` L3 캐시, 10코어(2P + 8E), 12스레드.
3. **Intel® Core™ i5-1245U (vPro® Enterprise 지원):** 최대 `4.4 GHz` 터보 부스트, `12 MB` L3 캐시, 10코어(2P + 8E), 12스레드.
4. **Intel® Core™ i5-1235U (Non-vPro):** 최대 `4.4 GHz` 터보 부스트, `12 MB` L3 캐시, 10코어(2P + 8E), 12스레드.

## 3. 내장 그래픽 및 플랫폼 컨트롤러 허브 (PCH)
- **그래픽 서브시스템:** 내장 **Intel® Iris® Xe Graphics** (전 출고 SKU에서 듀얼 채널 LPDDR5 메모리 대역폭 활성화).
- **칩셋 아키텍처:** 단일 일체형 시스템 보드(`M90788-601` / `N19201-601`) 상에 통합된 Intel SoC PCH 구조.
