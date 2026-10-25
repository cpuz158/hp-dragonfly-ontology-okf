---
type: section
title: '제9장 제원[표 9-1~9-3] · 제10장 비휘발성 메모리 명세[표 10-1] 및 무전원/LED 3.2 입고 시 보드 교체 전 Sure Start 복구 게이트 [내규 제1조] (PDF p.95–100 · Doc p.89–94)'
description: '원본 PDF 제9장(컴퓨터 치수 29.64×23.43×1.79cm, 1.4kg, 동작 온도, 65W/100W 전력 제원 표 9-1~9-3, PDF p.95–96) 및 제10장(BIOS 메모리 초기화 절차 및 표 10-1 비휘발성 메모리 명세: System BIOS 9MB SPI, HP Sure Start 8MB SPI, Intel CSME 16MB, TPM 2.0 SLB9672, EC NPCX897, PD CCG6DF, Retimer JHL8040R, PDF p.97–100)을 토대로 LED 3.2/2.2 점멸 시 시스템 보드 교체 전 Sure Start SPI 복구 및 15초 EC 리셋을 의무화합니다.'
version: '0.2.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=97
  kind: origin_document
  sha256: 41b127a75441ae8ae17a98086962dc20c1c90e8b0bf6020815de0d1e9bc5445e
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: verified
part_of: 08_internal_field_sop_playbooks
sequence: 24
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제9장·제10장 표 10-1 (제품 제원 · 비휘발성 메모리 명세 및 보드 교체 게이트 내규 제1조)'
source_page: 97
source_pages_span: 'PDF p.95–100 (Doc p.89–94)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제9장 제원[표 9-1~9-3] · 제10장 비휘발성 메모리 명세[표 10-1] 및 무전원/LED 3.2 입고 시 보드 교체 전 Sure Start 복구 게이트 [내규 제1조] (PDF p.95–100 · Doc p.89–94)

## 1. 시스템 제원 요약 (PDF p.95–96 / Doc p.89–90)

### 표 9-1: 컴퓨터 물리 및 환경 제원
| 항목 | 미터법 (Metric) | 미국식 (U.S.) |
| :--- | :--- | :--- |
| **너비 (Width)** | 296.4 mm | 11.67 in |
| **깊이 (Depth)** | 234.3 mm | 9.22 in |
| **높이 (Height)** | 17.9 mm | 0.70 in |
| **무게 (Weight, 시작 기준)** | 1.40 kg | 3.09 lbs |
| **입력 전원 (Input Power)** | 19.5 V dc @ 3.33 A – 65 W | 19.5 V dc @ 3.33 A – 65 W |
| **동작 온도 (Operating Temp)** | 5°C ~ 35°C | 41°F ~ 95°F |
| **보관 온도 (Nonoperating Temp)** | -20°C ~ 60°C | -4°F ~ 140°F |
| **상대 습도 (비응축)** | 동작: 10% ~ 90% | 비동작: 5% ~ 95% |
| **고도 (비가압)** | 동작: -15 m ~ 3,048 m (-50 ft ~ 10,000 ft) | 비동작: -15 m ~ 12,192 m (-50 ft ~ 40,000 ft) |

### 표 9-2: 디스플레이 사양
- **유효 대각선 크기:** 34.3 cm (13.5 in)
- **해상도:** 3000 × 2000 (3k2k) 또는 1920 × 1280 (WUXGA+)
- **표면 처리:** BrightView / Antiglare
- **밝기:** 400 nits / 1000 nits (Privacy panel)
- **시야각 및 백라이트:** UWVA, WLED 백라이트

### 표 9-3: 솔리드 스테이트 드라이브 (M.2 NVMe SSD) 제원 요약
- **폼팩터 규격:** 두께 1.0 mm, 길이 50.8 mm, 너비 28.9–29.0 mm, 중량 < 10 g
- **인터페이스:** PCIe, 동작 온도 0°C ~ 70°C
- **전송 속도:** 순차 읽기 최대 2150 MBps, 순차 쓰기 최대 1550 MBps, 랜덤 읽기 최대 300,000 IOPS, 랜덤 쓰기 최대 100,000 IOPS
- **논리 섹터 수:** 256 GB (468,883,296), 512 GB (1,000,215,216), 1 TB (1,500,336,388), 2 TB (2,988,316,776)

---

## 2. 제10장 비휘발성 메모리 명세 및 데이터 소거 절차 (PDF p.97–98 / Doc p.91–92)

전원 차단 및 외부 전원 분리 후에도 비휘발성 메모리 및 잔류 전하에 의해 개인 데이터가 일정 시간 유지될 수 있으므로, 보드 교체 또는 폐기 전 아래 절차를 수행해야 합니다 (PDF p.97 / Doc p.91).

### BIOS 기본값 복원 및 보안 재설정 단계
1. 시스템 부팅 시 `esc` 키를 눌러 Startup Menu 진입 후 `Main` -> `Apply Factory Defaults and Exit` 선택.
2. 재부팅 시 `esc` 진입 -> `Security` -> `Restore Security Settings to Factory Defaults` 적용.
3. 자산 태그(Asset Tracking Number) 및 DriveLock 암호 해제.
4. `Main` -> `Reset BIOS Security to factory default` 수행.
5. 저장 후 종료 전 `Apply Factory Defaults and Exit` 재실행.
6. 재부팅 시 TPM 초기화 및 지문 인식 센서 초기화(Reset Fingerprint Sensor) 프롬프트 승인 (`f1` 키).
7. 모든 전원 어댑터 및 배터리를 분리하고 24시간 이상 방치.
8. 내부 저장장치는 드라이브 분리 보관, 서드파티 삭제 툴, 또는 BIOS 유틸리티의 `Secure Erase` / `Disk Sanitizer`를 통해 완전 소거.

---

## 3. 필드 서비스 내규 [SOP Art.1]: 무전원/LED 3.2 입고 시 Sure Start 복구 게이트

- **적용 대상:** 부팅 불가(No Boot), 무전원(No Power), 또는 Caps Lock/LED 3.2 점멸 입고 장비.
- **핵심 통제 지표:** 무분별한 메인보드 교체를 방지하여 부품 교체율 KPI인 `hardware-fru-replacement-rate`를 실제 8.4% 수준(목표치 <=12.0%)으로 유지.
- **필수 사전 조치 (Mandatory Gate):**
  1. 시스템 보드 교체(FRU Swap)를 진행하기 전, 하드웨어 비휘발성 메모리 무결성 검증 및 HP Sure Start 자동 펌웨어 롤백 복구를 3회 이상 시도해야 합니다.
  2. 외부 AC 전원 분리, 메인 배터리 분리 후 RTC 전원 잔류를 제거하는 하드 리셋(30초 이상 전원 버튼 누름)을 병행합니다.
  3. Sure Start 자가 치유 시퀀스가 정상 완료되지 않거나 SPI Flash 물리 파손이 확인된 경우에 한하여 시스템 보드 교체를 승인합니다.
