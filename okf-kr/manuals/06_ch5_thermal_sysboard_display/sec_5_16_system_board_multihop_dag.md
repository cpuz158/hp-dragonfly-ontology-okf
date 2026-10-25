---
type: section
title: '제5장 §5.14~5.16 — 시스템 보드(N20724-601~N20728-601) 및 오디오 잭 다단계 선행 분해 DAG · 안테나 배럴(N22932-001) 및 무선 안테나 분리 (PDF p.56–61 · Doc p.50–55)'
description: '원본 PDF 제5장 시스템 보드 분리 섹션(Doc pp. 50–55, PDF p.56–61)에 명시된 필수 선행 분리 부품(하판 커버 N22918-001 ➔ 배터리 케이블 차단 ➔ NVMe SSD ➔ WWAN 모듈 ➔ 히트싱크 N22936-001)과 8개 ZIF/케이블 해제, USB 브래킷 분리(Phillips M2.0×4.0 3개 + M1.6×2.5 5개 + M2.0×2.5 1개), 안테나 배럴(N22932-001) 분리 절차를 설명합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=56
  kind: origin_document
  sha256: bacc53b1cb265510305cdc4f06e6577469b222f1506b8d1da916e99b6b3de3b7
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 06_ch5_thermal_board_display
sequence: 19
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제5장 §5.14~5.16 (시스템 보드 N20724~N20728-601 다단계 분해 DAG 및 안테나)'
source_page: 56
source_pages_span: 'PDF p.56–61 (Doc p.50–55)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.14~5.16 — 시스템 보드(N20724-601~N20728-601) 및 오디오 잭 다단계 선행 분해 DAG · 안테나 배럴(N22932-001) 및 무선 안테나 분리 (PDF p.56–61 · Doc p.50–55)

본 절은 HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC의 핵심 제어 장치인 시스템 보드(System Board) 및 오디오 잭(Audio Jack), 안테나 배럴(Antenna Barrel), 그리고 무선 안테나(Wireless Antennas) 조립체의 분리 및 교체 절차를 규정합니다 (PDF p.56–61 · Doc p.50–55).

---

## 1. 부품 번호 명세 (Spare Part Numbers)

### 표 5-13: 시스템 보드 및 관련 부품 (PDF p.56–57 · Doc p.50–51)

모든 시스템 보드는 통합 프로세서를 포함하며, 운영체제 구분에 따라 `xxxxxx-001`(Non-Windows) 및 `xxxxxx-601`(Windows) 번호 체계를 따릅니다.

| 설명 (Description) | 예비 부품 번호 (Spare Part Number) |
| :--- | :--- |
| **통합 vPro WLAN 모델** | |
| - Intel Core i7-1265U 프로세서 + 32 GB 시스템 메모리 | N20728-xxx (N20728-601) |
| - Intel Core i7-1265U 프로세서 + 16 GB 시스템 메모리 | N20727-xxx |
| - Intel Core i7-1265U 프로세서 + 16 GB 시스템 메모리 (OSR) | N20726-xxx |
| - Intel Core i5-1245U 프로세서 + 16 GB 시스템 메모리 | N20723-xxx |
| - Intel Core i5-1245U 프로세서 + 16 GB 시스템 메모리 (OSR) | N20722-xxx |
| **통합 Non-vPro WLAN 모델** | |
| - Intel Core i7-1255U 프로세서 + 32 GB 시스템 메모리 | N20725-xxx |
| - Intel Core i7-1255U 프로세서 + 16 GB 시스템 메모리 | N20724-xxx (N20724-601) |
| - Intel Core i5-1235U 프로세서 + 16 GB 시스템 메모리 | N20720-xxx |
| - Intel Core i5-1235U 프로세서 + 8 GB 시스템 메모리 | N20721-xxx |
| **브래킷 및 보조 부품** | |
| - USB 브래킷 (Bracket Kit에 포함) | N22931-001 |
| - 오디오 잭 (Audio Jack) | N31280-001 |

### 표 5-14: 안테나 배럴 부품 (PDF p.60 · Doc p.54)

| 설명 (Description) | 예비 부품 번호 (Spare Part Number) |
| :--- | :--- |
| 안테나 배럴 (WWAN 모델용) | N22928-001 (키트 N22932-001 연계) |
| 안테나 배럴 (WLAN 전용 모델용) | N22927-001 |
| 범퍼 (Rubber Kit에 포함) | N22933-001 |

### 표 5-15: 무선 안테나 및 케이블 (PDF p.61 · Doc p.55)

| 설명 (Description) | 예비 부품 번호 (Spare Part Number) |
| :--- | :--- |
| 무선 안테나 및 케이블 (aux2) | N22921-001 |
| 무선 안테나 및 케이블 (aux3) | N22922-001 |

---

## 2. 분해 선행 조건 (Prerequisites & DAG Chain)

온톨로지 다단계 선행 종속성 체계(`REQUIRES_REMOVAL_OF`)를 준수해야 합니다:

1. `N22918-001` (베이스 플라스틱 커버/Bottom Cover) 분리 (PDF p.39 · Doc p.33).
2. `M90788-005` (배터리 케이블 분리 필수, Battery Pack) (PDF p.48 · Doc p.42).
3. `M16560-005` / `M90790-001` (무선 충전 모듈 / Wireless Charging Module) 및 `N00182-005` / `M90792-001` (SSD), `N22936-001` / `N18244-001` (히트싱크 / Heat Sink) 해제 (PDF p.53 · Doc p.47).
4. 최종 단계: `N20728-601` / `N19201-601` (시스템 보드) 제거.

---

## 3. 시스템 보드 및 오디오 잭 분리 절차 (PDF p.57–59 · Doc p.51–53)

### 3.1. 케이블 연결 해제 (10개 경로)
시스템 보드 상단에서 다음 케이블을 순차적으로 분리합니다:
1. 좌측 상단 스피커 케이블
2. 카메라 케이블
3. 디스플레이 케이블 (참고: 나사 1개 및 브래킷을 제거해야 접근 가능)
4. 온보드 WLAN 모듈 연결 안테나 케이블
5. WWAN 모듈 연결 WWAN 안테나 케이블
6. 시스템 보드 라우팅 채널에 고정된 WWAN 안테나 케이블
7. 우측 상단 스피커 케이블
8. 오디오 보드 케이블
9. SIM 보드 케이블
10. 트랜스퍼 보드 케이블

### 3.2. 나사 및 브래킷 제거
1. **Phillips M2.0 × 4.0 나사 4개**를 제거합니다.
2. **USB 브래킷**(N22931-001)을 떼어냅니다.
3. **Phillips M2.0 × 2.0 나사 2개**를 제거합니다 (참고: 마일러 필름에 덮여 있을 수 있음).
4. 오디오 잭을 고정하는 **Phillips M2.0 × 4.0 나사 1개**를 제거합니다.
5. 오디오 잭을 하우징에서 릴리스합니다.
6. 섀시에 부착된 오디오 보드 케이블을 조심스럽게 박리합니다.

> **중요 주의사항 (Audio Jack Cable Handling):**
> 오디오 잭 케이블은 시스템 보드 하단부(Bottom side)에 연결되어 있습니다. 따라서 억지로 보드에서 커넥터를 뽑으려 하지 말고, 케이블이 보드에 결속된 상태를 유지하면서 오디오 잭을 시스템 보드와 함께 들어 올려 섀시 밖으로 꺼내는 것이 권장됩니다 (PDF p.58–59).

### 3.3. 시스템 보드 적출
- 오디오 잭과 케이블이 연결된 상태에서 시스템 보드의 좌측면을 먼저 들어 올립니다.
- 시스템 보드를 오디오 잭 조립체와 함께 비스듬히 좌측 방향으로 당기면서 컴퓨터 본체에서 들어냅니다.
- 새 시스템 보드로 교체 시, 기존 보드 하부에서 오디오 잭 및 케이블 조립체를 분리하여 새 보드의 하단 커넥터에 재장착합니다.

---

## 4. 안테나 배럴 분리 절차 (PDF p.60 · Doc p.54)

선행 조건: 시스템 보드 분리 완료 후 진행합니다.

1. 안테나 배럴 표면의 고무 플러그(Rubber plugs) 3개를 제거합니다.
2. 안테나 배럴을 본체에 고정하는 **Phillips M2.0 × 4.0 나사 5개**를 제거합니다.
   - **방향 주의:** 나사 중 3개는 수직 방향(Vertical)으로 제거되며, 2개는 수평 방향(Horizontal)으로 제거됩니다.
3. 배럴을 덮고 있는 오렌지색 케이블을 들어 올려 벗겨냅니다.
4. 컴퓨터 상단 클립에 라우팅된 배럴 좌/우측 종단의 안테나 배럴 케이블을 릴리스합니다 (힌지를 덮는 오렌지색 마일러가 있는 경우 부드럽게 당겨 해제).
5. 안테나 배럴을 섀시에서 최종 분리합니다.

---

## 5. 무선 안테나 및 케이블 분리 (PDF p.61 · Doc p.55)

선행 조건: 무선 충전 모듈, 히트싱크, 시스템 보드 제거 완료 후 진행합니다.

1. 좌측 안테나 케이블 상단을 덮고 있는 오렌지색 케이블을 박리합니다.
2. 섀시 바닥에 접착된 좌측 및 우측 안테나 트랜시버를 조심스럽게 떼어냅니다.
3. 컴퓨터 측면과 상단 클립을 따라 결속된 좌측 안테나 케이블을 라우팅 경로에서 제거합니다.
4. SIM 보드 부근에서 우측 케이블을 섀시에 고정하는 테이프를 제거합니다.
5. 무선 안테나와 케이블 일체를 컴퓨터에서 분리합니다.

모든 조립 절차는 분해의 역순으로 진행합니다.
