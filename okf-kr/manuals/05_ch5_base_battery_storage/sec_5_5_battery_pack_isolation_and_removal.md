---
type: PolicyClause
title: '제5장 §5.5 (배터리 팩(M90788-005 / M90789-005) 분리 — 모든 내부 FRU 및 ZIF 리본 탈거 전 제1선행 전원 차단 강행 원칙)'
description: '하판 커버 분리 직후 반드시 수행해야 하는 제1선행 안전 절차로, 배터리 전원 케이블을 시스템 보드에서 분리하기 전에는 어떠한 ZIF 리본 케이블이나 M.2 모듈도 건드리지 못하도록 강제합니다(구 v0.1.0 핫스왑 특례 폐기).'
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
  sha256: f41a47fda0aa900ee1e31f121fca0e922fe0809d8a7a9d13479abb2c58edc708
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/05_ch5_base_battery_storage/doc.md
sequence: 38
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.5'
source_page: 38
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.5 — 66Wh 배터리 팩(`M90788-005`) 분리 및 제1선행 전원 차단 강행 원칙 (pp. 37–39)

## 1. 대상 FRU 및 필수 선행 조건 (`REQUIRES_REMOVAL_OF`)
- **부품 번호:** `M90788-005` / `M90789-005` (4셀 `66 Wh` 리튬이온 폴리머 배터리)
- **필수 선행 단계:** [Step 1] `N22918-001` 하판 커버 분리 완료(제5장 §5.4).
- **하위 의존 부품:** NVMe SSD(`M90790-001`), 5G WWAN(`M90792-001`), 냉각 팬(`N18245-001`), 베이퍼 챔버 방열판(`N18244-001`), 시스템 보드(`N19201-601`) 등 **모든 내부 부품 탈거의 필수 선행 조건(Step 2)**입니다.

## 2. 상세 분리 절차
1. **배터리 전원 커넥터 최우선 분리:** 손톱이나 비자성 나일론 스퍼저만 사용하여 배터리 케이블 플러그를 시스템 보드 소켓에서 수평으로 밀어 분리합니다.
2. 배터리 팩 하단 플랜지를 고정하는 **Phillips PM2.0×3.0 나사 4개(`0.22 N·m`)**를 제거합니다.
3. 배터리 상단 가장자리를 잡고 앞쪽으로 들어 올려 섀시에서 분리합니다.
