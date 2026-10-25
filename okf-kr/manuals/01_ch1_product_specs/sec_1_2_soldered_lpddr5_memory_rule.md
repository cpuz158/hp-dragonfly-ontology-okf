---
type: section
title: '제1장 표 1-1 — 온보드 솔더링 LPDDR5-6400 듀얼채널 메모리 아키텍처 (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1)'
description: 'LPDDR5-6400 MHz 듀얼 채널 메모리(16GB / 32GB)가 시스템 보드에 영구 납땜(Soldered Onboard, Customer Non-Accessible)되어 단품 증설/교체가 불가하며 시스템 보드 통교체가 필요함을 명시합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=7
  kind: origin_document
  sha256: 7c690e393f7aa2e2a29c851e585a69b1561125c0e80d9551b1817973990c7433
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 01_ch1_product_specs
sequence: 2
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제1장 표 1-1 (온보드 LPDDR5 메모리)'
source_page: 7
source_pages_span: 'PDF p.7–8 (Doc p.1–2)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제1장 표 1-1 — 온보드 솔더링 LPDDR5-6400 듀얼채널 메모리 아키텍처 (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1)

## 1. 개요 및 메모리 서브시스템 아키텍처

HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC의 메인 메모리 하위 시스템은 고성능 저전력 온보드(Onboard) 솔더링 아키텍처로 설계되어 있습니다 (PDF p.7, Doc p.1, 표 1-1 참조).

공식 서비스 설명서에 명시된 주요 아키텍처 사양 및 제약 사항은 다음과 같습니다:
- **솔더링 및 접근성 제한**: "Memory is soldered onboard. Customer non-accessible. Supports dual-channel memory. LPDDR5-6400 MHz, 32 GB and 16 GB" (온보드 고정 납땜 방식으로 고객 접근 불가).
- **업그레이드 불가 (Non-upgradable)**: 표준 SO-DIMM 슬롯이 제공되지 않으며 메인보드(시스템 보드)에 영구 실장되어 출하되므로, 구매 후 용량 확장이 불가능합니다.
- **동작 클록 및 버스 규격**: LPDDR5-6400 MHz (듀얼 채널 구성 지원).
- **지원 메모리 용량 구성**:
  - 32 GB
  - 16 GB
  - 8 GB

---

## 2. 제품 구성 요소 및 메모리 규격 상세 (표 1-1 발췌)

| 카테고리 (Category) | 상세 설명 (Description) | 서비스 및 유지보수 규칙 |
| :--- | :--- | :--- |
| **제품명** | HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC | PDF p.7 (Doc p.1) |
| **프로세서** | 12세대 Intel® Core™ 프로세서군 (U-시리즈 10코어 플랫폼)<br>- Intel Core i7-1265U (최대 4.8 GHz, 12MB 캐시)<br>- Intel Core i7-1255U (최대 4.7 GHz, 12MB 캐시)<br>- Intel Core i5-1245U (최대 4.4 GHz, 12MB 캐시)<br>- Intel Core i5-1235U (최대 4.4 GHz, 12MB 캐시) | 프로세서 통합 메모리 컨트롤러와 직접 연결 |
| **메모리 (Memory)** | **Onboard, non upgradable memory supporting up to 32 GB of RAM**<br>- **LPDDR5-6400**<br>- **듀얼 채널(Dual-channel) 메모리 지원**<br>- 지원 구성: 32 GB, 16 GB, 8 GB | 고객 접근 불가 (Customer Non-Accessible). 슬롯 교체 불가 |
| **1차 스토리지 (Primary Storage)** | M.2 2280 NVMe PCIe SSD (256 GB ~ 2 TB TLC/SED 지원) | 탈부착 및 단독 교체 가능 (PDF p.8, Doc p.2) |
| **무선랜 (WLAN)** | Intel AX211 Wi-Fi 6E + Bluetooth 5.2 (vPro 옵션 포함) | 온보드 솔더링 (Onboard, not removable) |

---

## 3. 온보드 메모리 종속 시스템 보드 스페어 파트 번호 연계

LPDDR5 메모리는 메인보드에 일체형으로 실장되어 있으므로, 메모리 결함 발생 시 또는 메모리 용량 변경 수리 시 시스템 보드 어셈블리 전체를 교체해야 합니다. 온톨로지 연계 시스템 보드 예비 부품 번호는 다음과 같습니다:

- **32 GB LPDDR5 탑재 시스템 보드 어셈블리**:
  - 기본 예비 부품 번호: `N20728-601`
  - 상호 참조/대체 파트: `N19201-601`, `M90788-601`
- **16 GB LPDDR5 탑재 시스템 보드 어셈블리**:
  - 기본 예비 부품 번호: `N20727-601`
  - 상호 참조/대체 파트: `N19202-601`

> **유지보수 주의사항 (Service Advisory)**: 메모리 모듈만 단독으로 분리하거나 재납땜하는 작업은 HP 공인 서비스 절차에서 허용되지 않으며, 현장 교체 단위(FRU)는 시스템 보드 단위로만 처리됩니다.
