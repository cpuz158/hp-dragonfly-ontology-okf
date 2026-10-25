---
type: section
title: '제5장 §5.17~5.20 — 탑커버 키보드(N22938-001) · 디스플레이 패널 스트레치 릴리즈 풀탭 · 트랜스퍼 보드(N22937-001) · 8MP 카메라(N23306-001) 및 힌지(N22923-001) 분리 (PDF p.62–82 · Doc p.56–76)'
description: '원본 PDF 제5장 디스플레이 분해 섹션(Doc pp. 56–76, PDF p.62–82)에 따라 본체 분리가 필요 없는 디스플레이 서브컴포넌트(상단 핀셋 홀 스트레치 릴리즈 접착 테이프 수평 인출로 패널 분리 ➔ 디스플레이 트랜스퍼 보드 N22937-001 ➔ 상단/하단 힌지 커버 ➔ 8MP 웹캠 N23306-001)와 본체 분리가 필요한 전체 디스플레이 어셈블리 및 힌지(N22923-001, Phillips M2.5×4.0 나사 6개) 분리 절차를 정리합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=62
  kind: origin_document
  sha256: 4ac5d582fedbf1a827ad3068f64cf6d0a4ba1792d637125af0faa720be2424be
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 06_ch5_thermal_board_display
sequence: 20
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제5장 §5.17~5.20 (탑커버 키보드 · 디스플레이 패널 풀탭 · 트랜스퍼 보드 · 카메라 · 힌지)'
source_page: 62
source_pages_span: 'PDF p.62–82 (Doc p.56–76)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.17~5.20 — 탑커버 키보드(N22938-001) · 디스플레이 패널 스트레치 릴리즈 풀탭 · 트랜스퍼 보드(N22937-001) · 8MP 카메라(N23306-001) 및 힌지(N22923-001) 분리 (PDF p.62–82 · Doc p.56–76)

## 1. 개요 및 사전 준비 작업 (Preparation Procedures)

본 섹션은 HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC의 최종 분해 단계인 키보드 일체형 탑커버(Top Cover with Keyboard), 디스플레이 패널 분해 스트레치 릴리즈 풀탭(Stretch-Release Adhesive Pull-Tabs), 트랜스퍼 보드(Transfer Board), 8MP 웹카메라 모듈 및 힌지 어셈블리 분해 절차를 다룹니다 (PDF p.62–82, Doc p.56–76).

### 분해 전 필수 절차
1. 컴퓨터 분해 준비 완료 (문서 33페이지).
2. 하판 베이스 인클로저(Bottom Cover) 분리 (문서 33페이지).
3. 시스템 보드에서 배터리 케이블 분리 (문서 42페이지).

---

## 2. 키보드 일체형 탑커버 부품 번호 (Top Cover with Keyboard)

컴퓨터에서 모든 내부 하위 모듈(배터리, 시스템 보드, 쿨링 모듈 등)을 탈거하고 최종적으로 남는 베이스 섀시 구조입니다 (PDF p.62 / Doc p.56).

| 부품 설명 (Description) | 예비 부품 번호 (Spare Part Number) |
| :--- | :--- |
| Top cover with keyboard, privacy models (서멀 구리스 및 교체용 안테나 포함) | **N22552-xxx** (한국: `-AD1`, 키보드 어셈블리 베이스: `N22938-001`) |
| Top cover with keyboard, nonprivacy models with antiglare display (서멀 구리스 및 교체용 안테나 포함) | **N24787-xxx** (한국: `-AD1`) |
| Top cover with keyboard, nonprivacy models with BrightView display (서멀 구리스 및 교체용 안테나 포함) | **N22553-xxx** (한국: `-AD1`) |

*주요 국가 코드: 대한민국 `-AD1`, 미국 `-001`, 일본 `-291`, 영국 `-031`, 독일 `-041` 등.*

---

## 3. 디스플레이 패널 분해: 8개 스트레치 릴리즈 테이프 분리 절차

Dragonfly Folio G3의 디스플레이 패널은 나사 체결 방식이 아닌 총 8개의 신축성 스트레치 릴리즈 테이프(Stretch-release adhesive tape)로 고정되어 있습니다 (PDF p.63–68 / Doc p.57–62).

### 분해 절차 가이드라인
1. **컴퓨터 전개 및 플립:** 컴퓨터를 열고(1), 디스플레이를 뒤집어 키보드 반대 방향을 향하도록 위치시킵니다(2) (PDF p.63).
2. **하단 좌/우 고무 플러그 제거:** 디스플레이 하단 모서리의 좌측 및 우측 고무 플러그를 제거합니다(1). 핀셋(Tweezers)을 사용하여 좌/우측 패널 뒤쪽 테이프 끝단을 잡고, 핀셋을 천천히 회전시켜 테이프를 감으면서 당겨냅니다(2, 3).
   - **주의:** 테이프를 급격히 잡아당기면 중간에 끊어질 수 있으므로, 핀셋을 제자리에서 굴리며 감아내야 합니다.
3. **중앙 하단 플러그 및 테이프 분리:** 중앙 하단 고무 플러그(1)를 제거한 후, 좌측(2) 및 우측(3)으로 분기되는 테이프를 각각 핀셋으로 감아 추출합니다(4) (PDF p.64–65).
4. **패널 상단 좌/우측 테이프 분리:** 패널을 살짝 들어올린 후 상단 우측(Callout 3) 및 상단 좌측(Callout 4)의 테이프를 수직 방향으로 핀셋에 감아 완전히 제거합니다 (PDF p.66–67).
5. **중앙 추가 고정 테이프 분리 (Callout 5):** 2개의 추가 테이프 끝단을 핀셋으로 감아 완전히 분리합니다 (PDF p.67–68).
   - *참고:* 제거 도중 테이프가 끊어지면 얇은 프라이 툴(Pry tool)을 패널 가장자리에 조심스럽게 삽입하여 릴리즈합니다.
6. **케이블 분리 및 패널 탈거:**
   - 좌측 커넥터의 테이프(1)를 제거하고 잠금 레버(2)를 올린 후 디스플레이 케이블(3)을 분리합니다 (PDF p.69 / Doc p.63).
   - 우측 트랜스퍼 보드의 포일 테이프(4)를 제거하고, 2개의 ZIF 커넥터 잠금을 해제한 후 케이블(5)을 분리합니다.

### 디스플레이 패널 부품 번호 및 수리 경제성 원칙 (Rule TS-DFG3-004)

- **N23302-001:** WUXGA, Antiglare Panel
- **N23304-001:** WUXGA, BrightView Panel
- **N23303-001:** WUXGA, Privacy Panel
- **N23305-001** (호환 `N18990-001`): OLED Panel ($640 상당)
- **재장착 스트레치 테이프 킷:** **N09039-001** (재사용 절대 불가, 재조립 시 신품 8조 필수 장착)
- **힌지 모듈:** **N22923-001** (호환 `N18995-001`, $95 상당)

> **[중요 기술 지침: Rule TS-DFG3-004]**
> 힌지 장력 불량, 유격 또는 트랜스퍼 보드(`N22937-001`), 웹카메라(`N23306-001`) 케이블 결함 발생 시 고가의 $640 OLED 패널(`N23305-001`) 전체를 교체하지 마십시오. 반드시 스트레치 릴리즈 테이프(`N09039-001`)를 분리한 후 독립 부품인 $95 힌지 킷(`N22923-001`) 또는 서브보드만 단독 교체하여 수리 비용을 최적화해야 합니다.
