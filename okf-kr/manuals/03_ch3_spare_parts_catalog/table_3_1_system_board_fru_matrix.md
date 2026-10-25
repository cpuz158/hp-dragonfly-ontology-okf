---
type: section
title: '제3장 [표 3-1 품목 8] — 시스템 보드(System Board) 스페어 파트 매트릭스: CPU(i7-1265U/i7-1255U/i5-1245U/i5-1235U) × 온보드 LPDDR5(16GB/32GB) (PDF p.23–24 · Doc p.17–18)'
description: '원본 PDF 표 3-1 품목 (8)(PDF p.23–24, Doc pp. 17–18)의 온보드 CPU 및 LPDDR5 용량별 시스템 보드 스페어 파트 번호(i7-1265U 32GB N20728-601, i7-1265U 16GB N20727-601, i7-1255U 32GB N20726-601, i7-1255U 16GB N20725-601, i5-1245U 16GB N20724-601, i5-1235U 16GB N22935-601 및 WWAN/Wi-Fi SKU 매핑)를 정리합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 03_ch3_spare_parts_catalog
- structured_table
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=23
  kind: origin_document
  sha256: 1526ba576a6025fb1d3dbff74b975e6d508ced64f9df1d886356ab77cb930fa1
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 03_ch3_spare_parts
sequence: 9
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제3장 표 3-1 품목(8) (시스템 보드 FRU 매트릭스)'
source_page: 23
source_pages_span: 'PDF p.23–24 (Doc p.17–18)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제3장 [표 3-1 품목 8] — 시스템 보드(System Board) 스페어 파트 매트릭스: CPU(i7-1265U/i7-1255U/i5-1245U/i5-1235U) × 온보드 LPDDR5(16GB/32GB) (PDF p.23–24 · Doc p.17–18)

## 개요 및 서비스 엔지니어링 지침

HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC의 메인보드(시스템 보드)는 온보드 납땜형(Soldered) LPDDR5 메모리와 프로세서(CPU)가 단일 기판에 통합된 일체형 아키텍처를 채택하고 있습니다. 따라서 메모리 용량 변경이나 CPU 교체 시 개별 모듈 업그레이드가 불가하며 시스템 보드 어셈블리 전체를 교체해야 합니다.

시스템 보드 파트 번호는 운영체제 라이선스 탑재 여부에 따라 서픽스(접미사)가 구분됩니다:
- **`xxxxxx-001`**: Non-Windows(FreeDOS / Linux 등) 운영체제 탑재 모델
- **`xxxxxx-601`**: Windows 운영체제 DPK(Digital Product Key) 포함 모델

---

## 표 3-1 시스템 보드(System Board) 스페어 파트 매트릭스

시스템 보드는 관리 기능(vPro 지원 여부), 프로세서 모델, 온보드 LPDDR5 시스템 메모리 규격에 따라 세분화됩니다 (PDF p.23–24, Doc p.17–18).

### 1. vPro WLAN 지원 모델 (Enterprise Manageability)

| 프로세서(CPU) | 온보드 시스템 메모리 | OSR 여부 | 스페어 파트 번호 (기본) | Windows DPK 탑재 파트 번호 | 온톨로지 SKU 맵핑 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Intel Core i7-1265U** | **32 GB LPDDR5** | 일반 | `N20728-xxx` | `N20728-601` | `SKU-DFG3-I732-5G` |
| **Intel Core i7-1265U** | **16 GB LPDDR5** | 일반 | `N20727-xxx` | `N20727-601` | `SKU-DFG3-I716-WIFI` |
| **Intel Core i7-1265U** | **16 GB LPDDR5** | OSR (One-Time Service Replacement) | `N20726-xxx` | `N20726-601` | - |
| **Intel Core i5-1245U** | **16 GB LPDDR5** | 일반 | `N20723-xxx` | `N20723-601` | - |
| **Intel Core i5-1245U** | **16 GB LPDDR5** | OSR (One-Time Service Replacement) | `N20722-xxx` | `N20722-601` | - |

### 2. Non-vPro WLAN 지원 모델 (Standard WLAN)

| 프로세서(CPU) | 온보드 시스템 메모리 | 스페어 파트 번호 (기본) | Windows DPK 탑재 파트 번호 | 온톨로지 SKU 맵핑 |
| :--- | :--- | :--- | :--- | :--- |
| **Intel Core i7-1255U** | **32 GB LPDDR5** | `N20725-xxx` | `N20725-601` | `SKU-DFG3-I732-5G` (대체 플랫)
| **Intel Core i7-1255U** | **16 GB LPDDR5** | `N20724-xxx` | `N20724-601` | `SKU-DFG3-I716-WIFI` |
| **Intel Core i5-1235U** | **16 GB LPDDR5** | `N20720-xxx` | `N20720-601` | - |
| **Intel Core i5-1235U** | **8 GB LPDDR5** | `N20721-xxx` | `N20721-601` | - |

---

## Dragonfly 폼팩터 및 온톨로지 상호 참조 (Folio G3 vs. G3 Clamshell)

공식 정비 매뉴얼(N17344-001) 및 패밀리 아키텍처에 정의된 주요 시스템 보드 파트 번호 및 배터리/섀시 맵핑 정보는 다음과 같습니다:

- **HP Dragonfly Folio 13.5 inch G3 (2-in-1)**:
  - 플래그십 vPro 32GB 구성: `N20728-601` (`SKU-DFG3-I732-5G`에 매핑)
  - 표준 vPro/Non-vPro 16GB 구성: `N20727-601`, `N20724-601` (`SKU-DFG3-I716-WIFI`에 매핑)
  - 대체/파생 시스템 보드 파트: `N22935-601`
  - 배터리: 4-cell 53 Whr (파트 번호 `M90788-005`)

- **HP Elite Dragonfly G3 (Clamshell)**:
  - Clamshell 메인보드 FRU: `N19201-601`, `N19202-601`, `M90788-601`
  - 온톨로지 관리 상 Folio G3와 동일한 Tier-1 Core 사양(`SKU-DFG3-I732-5G` 및 `SKU-DFG3-I716-WIFI`)으로 분류 연동되어 부품 교체 및 재고 추적 프로파일을 상호 참조합니다.

---

## 현장 수리 및 교체 시 기술 참고 사항

1. **서멀 그리스(Thermal Grease) 및 방열판 어셈블리**:
   - 시스템 보드 분리 및 교체 시 히트싱크 및 팬 어셈블리(파트 번호 `N22936-001`)를 분리해야 하며, 재장착 시 기존 서멀 인터페이스 잔여물을 세척하고 새 서멀 그리스를 균일하게 도포해야 합니다.
2. **케이블 키트(Cable Kit, `N22929-001`) 연동 부품**:
   - 터치패드 케이블, SIM 보드 케이블, 트랜스퍼 보드(Transfer board, `N22942-001`) 케이블, 무선 충전 모듈(Wireless charging module, `N26149-001`) 케이블 등 시스템 보드에 연결되는 주요 FPC 케이블의 손상에 주의하십시오.
3. **DPK 및 보드 구성 복구**:
   - 교체 후 시스템 보드에 맞는 Windows DPK 활성화(`-601` 파트 사용 여부 확인) 및 HP BIOS Configuration Utility(BCU)를 통한 일련번호, SKU 번호, 제품 ID 동기화 작업을 필히 완료해야 합니다.
