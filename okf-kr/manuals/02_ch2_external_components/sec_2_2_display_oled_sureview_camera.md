---
type: section
title: '제2장 표 2-3 — 디스플레이 컴포넌트: Low Blue Light · 듀얼 마이크 · 8MP IR 카메라 · 조도 센서(ALS) 및 6개 내장 무선 안테나 (PDF p.13–14 · Doc p.7–8)'
description: '디스플레이 상단 베젤의 듀얼 내장 마이크(1), 카메라 표시등(2), 듀얼 IR LED(3), 8MP 웹캠(4), 주변 조도 센서 ALS(5), 그리고 상단/측면에 배치된 2개 WLAN 안테나(6) 및 4개 WWAN MIMO 안테나(7) 배치 구조(표 2-3)를 설명합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 02_ch2_external_components
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=13
  kind: origin_document
  sha256: 3fa272354ebb2b37c7dc4363ce2e7b2c28ed95281cae63717438d77eb8af1adb
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/02_ch2_external_components/sec_2_2_display_oled_sureview_camera.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 02_ch2_components_ports
sequence: 5
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제2장 표 2-3 (디스플레이 컴포넌트 및 안테나)'
source_page: 13
source_pages_span: 'PDF p.13–14 (Doc p.7–8)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제2장 표 2-3 — 디스플레이 컴포넌트: Low Blue Light · 듀얼 마이크 · 8MP IR 카메라 · 조도 센서(ALS) 및 6개 내장 무선 안테나 (PDF p.13–14 · Doc p.7–8)

## 1. 디스플레이 및 로우 블루라이트(Low Blue Light) 개요

HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC의 디스플레이 어셈블리 상단 베젤 및 패널 구조에는 지능형 센서, 고해상도 카메라 모듈, 무선 통신 안테나가 고밀도로 집적되어 있습니다 (PDF p.13, Doc p.7).

- **로우 블루라이트 모드 (Low Blue Light Mode - 일부 모델 전용)**:
  - 시각적 편안함과 안전을 위해 공장 출하 시 기본적으로 로우 블루라이트 모드가 활성화되어 배송됩니다.
  - 야간 사용 또는 문서 판독 시 청색광 방출량을 자동으로 조정하여 눈의 피로를 최소화합니다.
- **안전 및 인체공학 주의사항 (경고)**:
  - 심각한 부상 위험을 줄이기 위해 *Safety & Comfort Guide*(안전 및 편의 안내서)를 확인하십시오. 올바른 워크스테이션 설정, 자세, 건강 및 컴퓨터 사용 습관을 안내하며 중요한 전기적/기계적 안전 정보를 제공합니다 (`http://www.hp.com/ergo`).

---

## 2. 디스플레이 컴포넌트 상세 명세 (표 2-3)

다음 표는 디스플레이 상단 베젤 및 외곽 프레임에 배치된 주요 센서 및 통신 컴포넌트의 구성과 기능을 설명합니다 (PDF p.13–14, Doc p.7–8).

| 번호 | 컴포넌트 명칭 | 기능 및 상세 설명 |
| :--- | :--- | :--- |
| **(1)** | **사용자 근접 센서 (User-proximity sensor)** | 얼굴 인식을 활용하여 컴퓨터 앞 사용자의 재실 여부를 모니터링합니다. 자리를 비우면 절전(Sleep) 상태로 자동 전환되며, 복귀 시 키 입력이나 마우스 조작 없이도 사용자를 인식하고 시스템을 자동으로 깨워 보안과 전력 절감을 동시에 제공합니다. |
| **(2)** | **적외선(IR) 카메라 표시등** | **켜짐(On)**: IR 카메라가 작동 중임을 나타냅니다. |
| **(3)** | **적외선(IR) 카메라 렌즈** | 카메라의 적외선 감지 기능을 활성화합니다 (Windows Hello 얼굴 인식 등 연동). |
| **(4)** | **카메라 (8MP 고해상도 카메라)** | 화상 채팅, 비디오 녹화, 정지 이미지 촬영을 지원합니다. 패스워드 입력 대신 Windows 얼굴 인식 로그온 기능을 지원합니다. (*참고: 세부 기능은 장착된 카메라 하드웨어 및 소프트웨어에 따라 다를 수 있음*). |
| **(5)** | **카메라 표시등** | **켜짐(On)**: 카메라가 사용 중임을 나타냅니다. |
| **(6)** | **조도 및 색상 센서 (Ambient light and color sensor)** | 주변 환경 조도에 따라 디스플레이 밝기를 자동으로 조절하고 색온도(Color temperature)를 제어합니다. 광원의 따뜻함이나 차가움을 측정하여 최적의 시각 경험을 제공합니다. |
| **(7)** | **WWAN 안테나 (WWAN antennas\*)** | 광역 무선 네트워크(WWAN) 통신을 위한 무선 신호를 송수신합니다. |
| **(8)** | **WLAN 안테나 (WLAN antennas\*)** | 근거리 무선 네트워크(WLAN) 통신을 위한 무선 신호를 송수신합니다. |

> **안테나 및 센서 배치 주의사항 (\*)**:
> 조도 센서, 색상 센서, 기타 내장 센서 및 안테나는 기기 외부에서 육안으로 식별될 수 있습니다. 최적의 무선 신호 송수신을 위해 안테나 주변 영역에 장애물이 없도록 유지하십시오. 해당 국가/지역의 무선 규제 고지는 작업표시줄 검색창에서 `HP Documentation`을 검색하여 확인할 수 있습니다 (PDF p.14, Doc p.8).

---

## 3. 관련 주요 스페어 파트 및 온톨로지 연계 정보

디스플레이 하우징 상단 및 패널 내부에는 사양에 따라 다음과 같은 주요 파트가 탑재됩니다:

- **8MP IR 카메라 모듈 (8MP Camera Module)**:
  - 스페어 부품 번호: `N23306-001` / `N19002-001`
  - 통합 듀얼 디지털 어레이 마이크 및 근접 센서 제어 회로 연동
- **13.5인치 OLED 디스플레이 패널 (3K2K LBL BrightView)**:
  - 스페어 부품 번호: `N23305-001` / `N09033-001`
- **13.5인치 HP Sure View 프라이버시 패널 (1000 nits)**:
  - 스페어 부품 번호: `N23304-001` / `N09032-001`

---

## 4. 모드 전환 시 키보드 동작 및 터치패드 설정 안내

- **폼팩터 모드별 키보드 비활성화 특성 (PDF p.14, Doc p.8)**:
  - 스탠드(Stand), 텐트(Tent), 태블릿(Tablet) 모드에서는 기능 키 및 전원 키를 포함한 전체 키보드 입력이 비활성화됩니다.
  - 전원 키를 포함한 키보드를 다시 사용하려면 기본 노트북 형태인 **클램쉘(Clamshell) 모드**로 전환해야 합니다.
- **터치패드 설정 및 제스처 조정 방법**:
  1. 작업표시줄에서 **검색(Search)** 아이콘을 선택하고 검색창에 `touchpad settings`를 입력한 후 Enter 키를 누릅니다.
  2. 원하는 설정 항목을 구성하거나 터치패드를 켭니다.
