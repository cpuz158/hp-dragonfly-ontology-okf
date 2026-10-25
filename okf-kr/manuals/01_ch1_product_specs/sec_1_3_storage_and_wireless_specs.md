---
type: section
title: '제1장 표 1-1 — M.2 2280 PCIe Gen4 NVMe 스토리지 · 8MP IR 카메라 · Wi-Fi 6E AX211 · 5G WWAN · TPM 2.0 및 53Whr 배터리 (PDF p.8–10 · Doc p.2–4)'
description: 'M.2 2280 PCIe Gen4x4 NVMe SSD(256GB~2TB TLC/SED), 8MP MIPI + IR 웹캠, Bang & Olufsen 쿼드 스피커, Intel AX211 Wi-Fi 6E, Intel 5000 5G / XMM 7560 R+ LTE WWAN(4x4 안테나), Infineon SLB9672 TPM 2.0, 4셀 53Whr(및 66Wh 호환) 배터리 사양을 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=8
  kind: origin_document
  sha256: 7f884dfd167e76ef0f7780c7cac23831015c83042ac88209c4729c0dd5951e8a
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 01_ch1_product_specs
sequence: 3
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제1장 표 1-1 (NVMe SSD·카메라·무선·보안·배터리)'
source_page: 8
source_pages_span: 'PDF p.8–10 (Doc p.2–4)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제1장 표 1-1 — M.2 2280 PCIe Gen4 NVMe 스토리지 · 8MP IR 카메라 · Wi-Fi 6E AX211 · 5G WWAN · TPM 2.0 및 53Whr 배터리 (PDF p.8–10 · Doc p.2–4)

HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC의 기본 스토리지, 오디오/비디오, 무선 네트워크(WLAN/WWAN), 포트, 센서, 보안 모듈, 키보드 및 전원 사양은 공식 서비스 설명서 표 1-1(PDF p.8–10 · Doc p.2–4)에 상세히 기술되어 있습니다.

---

## 1. 기본 스토리지 사양 (Primary Storage Specifications)

본 시스템은 M.2 2280 단일 규격의 PCIe NVMe 솔리드 스테이트 드라이브(SSD)를 지원하며, 3차원 셀 구조(TLC) 및 하드웨어 암호화(SED OPAL2) 옵션을 제공합니다.

| 스토리지 용량 및 유형 | 기술 규격 및 암호화 지원 | 예비 부품 번호 (Spare Part No.) |
| :--- | :--- | :--- |
| **2 TB**, TLC | M.2 2280 PCIe-4×4 NVMe SSD | `M16560-005` |
| **1 TB**, TLC | M.2 2280 PCIe-4×4 NVMe SSD | `M52027-005` |
| **512 GB**, TLC (SED) | M.2 2280 PCIe-4×4 NVMe Self-Encrypting Drive (OPAL2) | `M52031-005` (또는 `M90790-001`) |
| **512 GB**, TLC | M.2 2280 PCIe-4×4 NVMe SSD | 공식 서비스 파트 카탈로그 준용 |
| **512 GB**, Value | M.2 2280 PCIe NVMe Value SSD | 표준 밸류 라인업 |
| **256 GB**, TLC (SED) | M.2 2280 PCIe NVMe Self-Encrypting Drive (OPAL2) | 공식 서비스 파트 카탈로그 준용 |
| **256 GB**, TLC | M.2 2280 PCIe NVMe SSD | 표준 TLC 라인업 |

---

## 2. 오디오 및 비디오 (Audio and Video)

* **오디오 솔루션**: Bang & Olufsen 튜닝 오디오 시스템
* **스피커 구성**: 쿼드(4개) 스테레오 스피커 탑재
* **마이크**: 디스플레이 상단 모서리 내장형 듀얼 마이크 (Integrated dual top-edge microphones)
* **앰프**: 전용 외장 앰프(Discrete amplifiers) 내장
* **웹캠**: 8 MP 적외선(IR) 카메라, 100° 초광각(ultrawide) 화각, 물리적 HP 카메라 프라이버시 키(HP Camera Privacy Key) 지원

---

## 3. 무선 통신 사양 (WLAN & WWAN)

### 온보드 무선랜 (WLAN - Onboard, Not Removable)
무선랜 모듈은 시스템 보드에 온보드 납땜 방식으로 장착되어 교체 및 분리가 불가능합니다.
* **Intel AX211 Wi-Fi® 6E + Bluetooth® 5.2 WLAN**
* **Intel AX211 Wi-Fi 6E + Bluetooth 5.2 vPro WLAN**
* **주요 지원 기능**:
  - Miracast® 무선 화면 미러링 지원
  - HP LAN-Wireless Protection 지원 (WLAN/LAN/WWAN 자동 전환 기능)
  - HP Connection Optimizer 및 HP Extended Range Wireless LAN 지원
  - UEFI Wi-Fi 환경 지원
  - 인도네시아 신규 주파수 대역(Indonesia New Band) 지원
  - WLAN용 시간 평균 전력(Time Average Power) 제어 지원
  - 동적 안테나 게인 제어 (Dynamic Antenna Gain, 유럽연합 EU 전용)
  - InTile 추적 기능 지원
  - A2DP 블루투스 오디오 오프로드(BT Audio Offload) 지원

### 무선 광역 네트워크 (WWAN - 일부 제품 한정)
* **Intel 5000 5G Solution WWAN**:
  - 모듈 내장형 eSIM (eSIM on module)
  - 폼 팩터: M.2 3052 PCIe 소켓 (`N00182-005` / `M90792-001`)
* **Intel XMM 7560 R+ LTE-Advanced Pro WWAN (Cat 16)**:
  - 모듈 내장형 eSIM (eSIM on module)
  - 글로벌 시리즈(Global Series) 지원
  - 폼 팩터: M.2 3042 PCIe 소켓 (`M52040-005`)

---

## 4. 입출력 포트 및 내장 센서 (Ports & Sensors)

* **외부 포트 (Ports)**:
  - 3.5mm 오디오 출력(헤드폰)/오디오 입력(마이크) 콤보 잭 1개
  - USB Type-C® 전원 커넥터 겸 Thunderbolt™ 포트 2개 (HP Sleep and Charge 기능 지원)
* **센서군 (Sensors)**:
  - 홀 센서 (Hall sensor)
  - 3축 가속도계 + 자이로스코프 + 전자나침반 (Accelerometer + Gyroscope + eCompass)
  - 주변 조도 센서 (Ambient Light Sensor)
  - 적응형 색상 센서 (Adaptive Color Sensor)
  - 적외선 열 감지 센서 (IR Thermal Sensor)
  - 자기센서 (Magnetometer)
  - 비행시간거리측정 센서 (Time of Flight, ToF)

---

## 5. 보안, 키보드 및 전원 사양 (Security, Input & Power)

* **보안 모듈 (TPM)**:
  - 신뢰할 수 있는 플랫폼 모듈 TPM 2.0 지원
  - 칩셋: **Infineon SLB9672** (SLB9672VU2.0, 펌웨어 버전 15.21)
  - FIPS 140-2 보안 표준 인증 및 IPv6 지원
* **키보드 및 입력 장치**:
  - HP 프리미엄 키보드 (백라이트, 누수 지연 액체 유입 방지 설계)
  - HP 프라이버시 백라이트 방수 키보드 (선택 사양)
  - 멀티터치 제스처를 지원하는 고정밀 클릭패드(Clickpad)
  - HP Dragonfly Folio Pen (선택 사양)
* **배터리 사양**:
  - 4셀 53 Whr 리튬이온 배터리 (HP Long Life, HP Fast Charge 고속 충전 기술 지원)
* **AC 어댑터 및 전원 코드**:
  - 65 W Slim nPFC USB Type-C 어댑터 (1.8m)
  - 65 W Standard nPFC USB Type-C 어댑터 (1.8m)
  - C5 전원 코드: 1.0m 프리미엄 또는 1.0m 표준

---

## 6. 서비스 가능성 분류 (Serviceability)

본 제품은 엔드 유저(고객)가 직접 교체할 수 있는 부품(End User Replaceable Parts, CSR)을 **AC 어댑터**와 **디지털 펜**으로 제한하고 있습니다. 스토리지, 배터리, 시스템 보드, WWAN 모듈 등의 내부 부품은 공인 서비스 기술자(Authorized Technician)에 의해 수리되어야 합니다.
