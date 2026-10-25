---
type: section
title: '제8장 §8.3 — Remote HP PC Hardware Diagnostics UEFI 설정(F10 BIOS) 및 6대 현장 고장 증상 트리아지 매트릭스(TS-DFG3-001~006) (PDF p.93–94 · Doc p.87–88)'
description: '원본 PDF 제8장 §8.3(Doc pp. 87–88, PDF p.93–94)의 Remote HP PC Hardware Diagnostics UEFI(F10 Computer Setup ➔ Advanced ➔ Remote HP PC Hardware Diagnostics로 서버 URL 및 무인 진단 스케줄 설정, 진단 로그 업로드)와 이를 활용한 6대 표준 고장 케이스(`TS-DFG3-001` ~ `TS-DFG3-006`) 원인 분리 매트릭스를 다룹니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=93
  kind: origin_document
  sha256: 6991ef1de292461a23d4c5a5a4808d8c280599cd5076244adc3957f735c940c8
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 07_ch6_7_bios_diagnostics
sequence: 23
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제8장 §8.3 (Remote HP PC Hardware Diagnostics UEFI 및 증상별 트리아지 매트릭스)'
source_page: 93
source_pages_span: 'PDF p.93–94 (Doc p.87–88)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제8장 §8.3 — Remote HP PC Hardware Diagnostics UEFI 설정(F10 BIOS) 및 6대 현장 고장 증상 트리아지 매트릭스(TS-DFG3-001~006) (PDF p.93–94 · Doc p.87–88)

## 1. 개요 및 진단 도구 다운로드 절차

HP Dragonfly Folio 13.5" G3 2-in-1 노트북의 하드웨어 진단은 로컬 환경(사전 설치 이미지, `HP_TOOLS` 파티션, BIOS)뿐만 아니라 외장 USB 플래시 드라이브 또는 네트워크 원격 환경을 통해 유연하게 실행될 수 있습니다 (`PDF p.93, Doc p.87`).

### 로컬 저장소 검색 순서 및 실행 우선순위
진단 진입 시 시스템은 다음 순서로 진단 환경을 탐색합니다:
1. 연결된 USB 플래시 드라이브 (Connected USB flash drive)
2. 내장 하드 드라이브 / SSD (Hard drive)
3. 시스템 BIOS 펌웨어 파티션 (BIOS)

진단 도구가 실행되면 화면 지침에 따라 수행할 진단 테스트 유형을 선택할 수 있습니다.

### USB 플래시 드라이브 기반 진단 도구 다운로드
다음과 같은 상황에서는 USB 플래시 드라이브로 진단 도구를 생성하는 것이 권장됩니다:
- 공장 출하 사전 설치 이미지에 HP PC Hardware Diagnostics UEFI가 포함되지 않은 경우
- `HP_TOOLS` 파티션이 누락되었거나 손상된 경우
- 내장 스토리지 드라이브가 물리적으로 손상되어 부팅이 불가능한 경우

> **주의:** 다운로드 지침은 영문으로만 제공되며, 생성 패키지가 `.exe` 실행 파일로 제공되므로 반드시 Windows 운영체제 기반 PC에서 USB 드라이브를 제작해야 합니다.

#### 최신 버전 다운로드 절차
1. `http://www.hp.com/go/techcenter/pcdiags` 접속 (HP PC Diagnostics 홈 페이지 표시)
2. **Download HP Diagnostics UEFI** 선택 후 **Run** 실행

#### 제품명 또는 일련번호를 통한 맞춤 다운로드
1. `http://www.hp.com/support` 접속
2. 제품명(HP Dragonfly Folio 13.5 inch G3) 또는 일련번호 입력 후 기기 및 OS 선택
3. **Diagnostics** 섹션 안내에 따라 모델 전용 UEFI Diagnostics 버전 다운로드

---

## 2. Remote HP PC Hardware Diagnostics UEFI 설정 (F10 BIOS)

Remote HP PC Hardware Diagnostics UEFI는 펌웨어(BIOS) 레벨에서 진단 패키지를 자동으로 다운로드하고, 자체 진단을 실행한 후 그 결과를 사전 구성된 서버로 자동 전송하는 엔터프라이즈 관리 기능입니다 (`PDF p.93–94, Doc p.87–88`). 로컬 스토리지 드라이브나 USB가 없는 무디스크 환경에서도 동작합니다.

### 소프트웨어(SoftPaq) 다운로드 및 배포
- **공식 진단 웹페이지**: `http://www.hp.com/go/techcenter/pcdiags` 접속 후 **Download Remote Diagnostics** 선택 및 실행
- **소프트웨어 및 드라이버 검색**: `http://www.hp.com/support`의 **Software and Drivers** 섹션에서 제품 지정 후 Remote UEFI 패키지 다운로드

### Computer Setup (F10 BIOS) 맞춤 구성 설정
1. 컴퓨터 전원을 켜거나 재부팅한 뒤, HP 로고가 나타날 때 `f10` 키를 반복 입력하여 **Computer Setup** 화면으로 진입합니다.
2. **Advanced** 메뉴를 선택한 뒤 **Settings**로 이동합니다.
3. 다음 맞춤 설정을 구성합니다:
   - **무인 진단 스케줄 설정 (Unattended Schedule)**: 정기 자동 진단 예약 또는 `Execute Remote HP PC Hardware Diagnostics`를 통한 즉시 대화형 진단 실행
   - **진단 도구 다운로드 소스 지정**: HP 공식 웹사이트 또는 인트라넷 사전 구성 서버 지정
   - **결과 저장 위치 및 인증 정보 구성**: 테스트 결과 업로드 서버 URL, 사용자 이름(Username) 및 암호(Password) 입력
   - **이전 실행 상태 정보 조회 (Execution Status)**: 이전 진단 세션의 통과/실패 이력 표시
4. **Exit** 선택 후 **Save Changes and Exit**를 눌러 설정을 저장합니다. 시스템이 재부팅되면서 변경 사항이 적용됩니다 (`PDF p.94, Doc p.88`).

---

## 3. 현장 고장 증상별 원인 분석 및 트리아지 매트릭스 (TS-DFG3-001 ~ TS-DFG3-006)

원격 및 로컬 하드웨어 진단 결과에 따라 현장 엔지니어가 부품 교체(FRU) 전 필수적으로 수행해야 하는 6대 증상별 점검 경로 매트릭스입니다.

| 트리아지 ID | 고장 증상 범주 | 추정 근본 원인 (Root Cause) | 현장 점검 및 조치 순서 (Step-by-Step) | 1차 교체 검토 FRU 부품 | 판정 기준 및 비고 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-DFG3-001** | 전원 무반응 (No Power / No POST) | 배터리 완전 방전, USB-C 충전 포트 접촉 불량, DC-in 파워 레일 차단 | 1. 65W/100W 공인 USB-C 어댑터 연결 상태 15분 이상 유지<br>2. 전원 버튼 15초 하드 리셋 수행<br>3. BIOS 복구 단축키(`Win + B`) 시도 | 메인보드 (System Board) / USB-C 포트 I/O 어셈블리 | LED 인디케이터 반응 유무 확인 |
| **TS-DFG3-002** | 화면 무출력 (Blink Code: Cap 3.2 / 5.3) | 메모리 초기화 실패, 내장 eDP 케이블 접촉 불량, 패널 전원 차단 | 1. 외장 HDMI/Type-C 모니터 연결 테스트<br>2. 캡스록 블링크 패턴(3.2/5.3) 해독<br>3. F10 진입 후 Remote Diagnostics 로그 확인 | 디스플레이 어셈블리 (Display Assembly), 메인보드 | 블링크 코드 발생 시 BIOS 복구 우선 권장 |
| **TS-DFG3-003** | 스토리지 미인식 (3F0 Boot Device Not Found) | M.2 NVMe SSD 장착 이탈, 파일 시스템 손상, PCIe 레인 접촉 불량 | 1. F2/F10 UEFI Diagnostics의 Storage Component Test 실행<br>2. M.2 차폐 캔 및 나사 체결 토크 점검<br>3. USB 진단 드라이브 부팅 후 인식 검증 | M.2 Solid-State Drive (SSD) | 단순 접촉 불량 여부 우선 확인 |
| **TS-DFG3-004** | 발열 및 팬 소음 과다 (Thermal Throttle) | 방열판 써멀 컴파운드 경화, 쿨링팬 이물질 유입, 통풍구 차단 | 1. UEFI System Diagnostics의 System Fan Test 수행<br>2. 통풍구 먼지 제거 및 팬 회전축 점검<br>3. 써멀 모듈 압착 나사 체결 순서(1~4) 점검 | 팬/히트싱크 쿨링 어셈블리 (Thermal Module) | 소프트웨어적 백그라운드 프로세스 부하 배제 |
| **TS-DFG3-005** | 배터리 급속 방전 및 충전 불가 | 배터리 셀 노후화, 퓨즈 단선, 충전 제어 IC(EC) 오동작 | 1. F2 UEFI Component Test의 Battery Check 실행<br>2. 배터리 상태 코드(Cycle Count, Full Charge Capacity) 판정<br>3. Type-C 충전기 및 케이블 무결성 점검 | 충전식 배터리 팩 (68 Wh / 53 Wh) | Advanced Battery Check 통과 여부 검증 |
| **TS-DFG3-006** | 터치스크린 및 디지털 펜 인식 불량 | Wacom 디지타이저 FPC 접촉 불량, 전자기 차폐 간섭, 드라이버 충돌 | 1. UEFI Touch Test 인터페이스에서 좌표 검증<br>2. 충전식 무선 펜 배터리 잔량 및 펜 팁 마모 확인<br>3. 디스플레이 힌지 내부 FPC 케이블 체결 확인 | 터치/펜 컨트롤러 FPC, 디스플레이 패널, 무선 펜 | 기계적 손상 여부 육안 검사 병행 |

> **운영 KPI 권장 사항:** 불필요한 메인보드 및 패널 교체를 방지하기 위해 진단 도구 기반의 소프트웨어/펌웨어 초기화를 선행해야 하며, 하드웨어 부품 교체율(hardware-fru-replacement-rate)은 **12.0% 이하**로 유지되어야 합니다.
