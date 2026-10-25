---
type: section
title: '제8장 §8.1·8.2 — HP PC Hardware Diagnostics (Windows 및 UEFI F2) · 24자리 Failure ID 코드 및 LED 점멸 진단 코드(3.2 / 2.2 / 4.2) (PDF p.90–93 · Doc p.84–87)'
description: '원본 PDF 제8장(Doc pp. 84–87, PDF p.90–93)의 HP PC Hardware Diagnostics Windows 및 부팅 시 F2 키로 실행하는 HP PC Hardware Diagnostics UEFI(24자리 하드웨어 고장 ID 코드 생성, USB 플래시 드라이브 다운로드)와 POST/Caps Lock LED 점멸 진단 코드(LED 3.2 메모리 오류, LED 2.2 BIOS 손상, LED 4.2 열/팬 오류, POST 601 배터리 경고)를 설명합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- structured_table
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=90
  kind: origin_document
  sha256: 4840ae1eac65e01e44c00699a0320196054180b2ed2f94e00088e8ec5f1e04d5
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 07_ch6_7_bios_diagnostics
sequence: 22
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제8장 §8.1·8.2 (HP PC Hardware Diagnostics Windows/UEFI 및 LED 점멸 진단 코드)'
source_page: 90
source_pages_span: 'PDF p.90–93 (Doc p.84–87)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제8장 §8.1·8.2 — HP PC Hardware Diagnostics (Windows 및 UEFI F2) · 24자리 Failure ID 코드 및 LED 점멸 진단 코드(3.2 / 2.2 / 4.2) (PDF p.90–93 · Doc p.84–87)

## 1. 개요 및 진단 도구 체계 (Overview & Diagnostic Suite)

HP Dragonfly Folio 13.5" G3 2-in-1 노트북의 하드웨어 무결성 및 부품 장애를 검증하기 위해 HP PC Hardware Diagnostics 제품군이 제공됩니다 (PDF p.90, Doc p.84). 진단 도구는 실행 환경과 아키텍처에 따라 세 가지 버전으로 구분됩니다:

1. **HP PC Hardware Diagnostics Windows**: Windows OS 내에서 동작하며 장치 드라이버 및 구성 요소를 점검하는 유틸리티 (일부 모델 지원).
2. **HP PC Hardware Diagnostics UEFI**: 운영체제 외부(Pre-boot/펌웨어 계층)에서 실행되어 OS 또는 소프트웨어 오류와 물리적 하드웨어 결함을 격리 진단하는 도구.
3. **Remote HP PC Hardware Diagnostics UEFI**: 엔터프라이즈 관리 환경에서 펌웨어 기반 원격 진단을 수행하는 기능 (일부 지원 모델).

---

## 2. HP PC Hardware Diagnostics Windows 운용 및 24자리 Failure ID (PDF p.90–92, Doc p.84–86)

### 2.1 24자리 하드웨어 오류 식별 코드 (24-Digit Hardware Failure ID Code)
진단 도구가 하드웨어 부품 교체(Replacement)가 필요한 결함을 감지하면 고유한 **24자리 Failure ID 코드**가 생성됩니다.
* **대화형 테스트(Interactive Tests)**: 키보드, 마우스, 오디오 및 비디오 팔레트와 같은 인터랙티브 항목은 Failure ID 발급 전 문제 해결 절차(Troubleshooting steps)를 선행해야 합니다.
* **사후 조치 옵션**:
  1. **Next** 선택: 사건 접수를 위한 Event Automation Service (EAS) 페이지로 자동 이동.
  2. **QR 코드 스캔**: 모바일 기기로 화면의 QR 코드를 스캔하여 EAS 페이지 접속 및 케이스 로깅.
  3. **코드 복사**: 24자리 Failure ID 옆 확인란을 선택하여 코드를 복사한 후 기술 지원 센터에 전달.

### 2.2 Windows 진단 도구 접근 방법
* **HP Support Assistant 이용 (PDF p.90, Doc p.84)**:
  1. 작업 표시줄 검색창에 `support` 입력 후 앱 실행 또는 작업 표시줄 물음표(`?`) 아이콘 선택.
  2. `Fixes & Diagnostics` 선택.
  3. `Run hardware diagnostics` 선택 후 `Launch` 클릭.
  4. 진단 항목 선택 및 화면 지침 수행 (중단 시 `Cancel` 선택).
* **시작 메뉴 이용 (PDF p.91, Doc p.85)**:
  1. `시작` 버튼 클릭 후 `모든 앱(All apps)` 선택.
  2. `HP PC Hardware Diagnostics Windows` 실행.
  3. 진단 테스트 항목 선택 및 실행.

### 2.3 Windows 진단 유틸리티 다운로드 및 설치 (PDF p.91–92, Doc p.85–86)
설치 파일은 `.exe` 형식으로 제공되므로 Windows PC 환경에서 다운로드해야 합니다.
* **HP TechCenter 웹사이트**: `http://www.hp.com/go/techcenter/pcdiags` 접속 → `Download HP Diagnostics Windows` 선택 후 PC 또는 USB 플래시 드라이브에 저장.
* **Microsoft Store**: Microsoft Store 앱 검색창에 `HP PC Hardware Diagnostics Windows` 입력 후 설치.
* **HP 지원 사이트**: `http://www.hp.com/support` → `Software and Drivers` → 제품명 또는 제품 번호 입력 → `Diagnostics` 섹션에서 다운로드.
* **설치**: 다운로드한 디렉터리 또는 USB 드라이브에서 `.exe` 파일을 실행하여 지침에 따라 설치.

---

## 3. HP PC Hardware Diagnostics UEFI 운용 (PDF p.92–93, Doc p.86–87)

운영체제로 정상 부팅되지 않는 치명적 결함 상황에서는 OS 독립적인 UEFI 진단 도구를 사용합니다.

* **전환형(Convertible) 폼팩터 실행 조건**: 노트북 모드(Notebook mode)로 거치하고 본체 연결 키보드를 사용해야 진단 진입이 가능합니다.
* **UEFI 진단 실행 절차**:
  1. 컴퓨터 전원을 켜거나 재부팅한 직후 즉시 `esc` 키를 연타합니다.
  2. 시작 메뉴가 표시되면 `f2` 키를 누릅니다.
  3. BIOS는 다음 우선순위 순서대로 진단 도구를 탐색합니다 (PDF p.92–93, Doc p.86–87):
     - **a. 연결된 USB 플래시 드라이브 (Connected USB flash drive)**
     - **b. 하드 드라이브 / SSD (Hard drive)**
     - **c. 시스템 BIOS (Firmware)**
  4. 진단 도구가 로드되면 테스트 유형을 선택하여 진단을 수행합니다 (중단 시 `esc` 키 입력).
* **UEFI 24자리 Failure ID 처리**:
  - 화면에서 `Contact HP`를 선택하고 개인정보 고지에 동의한 뒤, 모바일 기기로 화면의 QR/바코드를 스캔하면 HP 고객 지원 서비스 센터 페이지에 시리얼 및 Failure ID가 자동 입력됩니다.

---

## 4. 온톨로지 연계 및 주요 진단/점멸 코드 매트릭스 (LED Blink Codes & POST Codes)

본 장의 진단 절차 및 장애 추적 체계는 메인보드 및 핵심 서브시스템 온톨로지(`TS-DFG3-001`)와 직접 연계됩니다.

| 식별자 (ID) | 진단 유형 / 패턴 | 장애 원인 및 하드웨어 구성 요소 | 권장 조치 및 서비스 가이드라인 |
| :--- | :--- | :--- | :--- |
| `LED-3-2` | Caps Lock/Num Lock 3회 느린 점멸 + 2회 빠른 점멸 (Amber/White) | **메모리(RAM) 모듈 오류** (온보드 LPDDR5 또는 DIMM 초기화 실패) | 전원 리셋 수행, 잔류 전하 방전, 지속 시 시스템 보드 교체 검토 (`TS-DFG3-001`) |
| `LED-2-2` | Caps Lock/Num Lock 2회 느린 점멸 + 2회 빠른 점멸 | **BIOS/펌웨어 손상** (주 BIOS 이미지 무결성 실패) | `Win + B` 또는 `Win + V` 키를 사용한 HP BIOS 복구 시도, 복구 USB 사용 |
| `LED-4-2` | Caps Lock/Num Lock 4회 느린 점멸 + 2회 빠른 점멸 | **열(Thermal) 센서 또는 팬 장애** (임계 과열 차단) | 쿨링 팬 회전 여부 확인, 방열판 서멀 컴파운드 및 흡기구 이물질 점검 |
| `POST-601` | 화면 오류 메시지 ("POST Error 601") | **주 배터리 성능 저하 / 통신 오류** (Primary Battery 601) | HP Diagnostics UEFI 배터리 테스트 실행, 24자리 Failure ID 확인 후 배터리 팩 교체 |
| `EAS-24-ID` | 24자리 영숫자 Failure ID (Windows / UEFI) | 하드웨어 구성 요소 기능 불량 (대화형/비대화형 테스트 검출) | QR 코드 스캔 또는 Event Automation Service (EAS) 케이스 등록 후 RMA 부품 수령 |
