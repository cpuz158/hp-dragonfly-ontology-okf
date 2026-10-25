---
type: section
title: '제6장·제7장 — 시스템 백업/복구(HP Sure Recover) · Computer Setup(F10 BIOS) · BIOS 업데이트 · 부트 순서(F9) · TPM 2.0 및 HP Sure Start 복구 (PDF p.83–89 · Doc p.77–83)'
description: '원본 PDF 제6장(Doc pp. 77–79, PDF p.83–85: Windows 백업, HP Cloud Recovery, 시스템 복원, 네트워크 기반 HP Sure Recover) 및 제7장(Doc pp. 80–83, PDF p.86–89: F10 Computer Setup 진입, 공장 초기화, 외부 AC 전원 필수 BIOS 업데이트, F9 부트 순서 변경, TPM 2.0 BIOS 설정, HP Sure Start 하드웨어 BIOS 무결성 자동 복구)을 다룹니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=86
  kind: origin_document
  sha256: fc08518165bb5f54a5c1afb530bf7eab51b365951dd2fffaeee9a055ce0b4c4a
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 07_ch6_7_bios_diagnostics
sequence: 21
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제6장·제7장 (시스템 백업/복구 · Computer Setup BIOS · TPM 2.0 · HP Sure Start)'
source_page: 86
source_pages_span: 'PDF p.83–89 (Doc p.77–83)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제6장·제7장 — 시스템 백업/복구(HP Sure Recover) · Computer Setup(F10 BIOS) · BIOS 업데이트 · 부트 순서(F9) · TPM 2.0 및 HP Sure Start 복구 (PDF p.83–89 · Doc p.77–83)

## 1. 개요 및 복구 준비 사항 (PDF p.83–85 · Doc p.77–79)

시스템 장애 발생 시 정상 작동 상태로 신속하게 복원하기 위해 다양한 백업 및 복구 옵션이 제공됩니다.

### 복구 전 필수 주의사항
* **배터리 충전 잔량**: 태블릿 환경에서 복구 작업을 수행할 경우 배터리가 최소 70% 이상 충전되어 있어야 합니다.
* **키보드 연결**: 분리형 키보드가 장착된 태블릿의 경우 복구 절차를 시작하기 전에 반드시 키보드 베이스에 결합해야 합니다.
* **초기 설정 직후 백업 권장**: 최초 설정 완료 후 외장 USB 플래시 드라이브 또는 온라인 백업을 통해 개인 데이터를 즉시 백업하는 것이 권장됩니다.
* **저장 용량 제한**: 내부 저장 장치 용량이 32GB 이하인 경우 Microsoft 시스템 복원 기능이 기본적으로 비활성화됩니다.

### 복구 미디어 및 단계별 복구 방법
1. **Microsoft 시스템 복원**: 시스템 파일 및 설정에 생성된 복원 지점으로 되돌립니다.
2. **이 PC 초기화 (Reset this PC)**: 운영체제를 재설정하며, 폐기 또는 재활용 전에는 모든 드라이브 정리 옵션을 선택하여 데이터를 완전히 삭제할 수 있습니다.
3. **HP 복구 미디어 (HP Recovery Media)**: HP Cloud Recovery Download Tool을 사용하여 부팅 가능한 USB 플래시 드라이브 형태로 공장 출하 OS 및 전용 드라이버를 생성하여 복구합니다.
4. **HP Sure Recover**: 네트워크 또는 하드웨어 내장 복구 솔루션을 통해 별도의 복구 파티션이나 외장 미디어 없이 최신 OS 및 드라이버를 자동 배포 및 복원합니다.

### 부팅 순서 변경 (Boot Order - F9)
복구 미디어로 부팅되지 않을 경우 부트 장치 순서를 수동으로 변경해야 합니다.
1. 시스템 전원을 켜거나 재시작합니다.
2. 화면에 로고가 나타날 때 `Esc` 키를 연속으로 누른 후, 표시되는 메뉴에서 `F9` 키를 눌러 부팅 옵션(Boot Options)으로 진입합니다.
3. 연결된 USB 플래시 드라이브 또는 광학 드라이브를 선택하여 부팅합니다.

---

## 2. Computer Setup (F10 BIOS) 및 보안 기능 (PDF p.86 · Doc p.80)

### BIOS 진입 및 기본 역할
* **BIOS 역할**: 시스템의 모든 입출력 장치(스토리지, 디스플레이, 키보드, 마우스 등) 간의 통신을 제어하고 시작 순서 및 메모리 구성을 관리합니다.
* **진입 절차**: 컴퓨터 전원을 켜거나 다시 시작할 때 HP 로고가 표시되면 즉시 `F10` 키를 눌러 Computer Setup으로 진입합니다.
* **주의**: 잘못된 BIOS 설정값 변경은 시스템 부팅 장애를 유발할 수 있으므로 주의해야 합니다.

---

## 3. 온톨로지 하드웨어 복구 절차: HP Sure Start 및 EC/CMOS 리셋

펌웨어 손상 또는 부팅 불가 상태에 대응하기 위한 주요 복구 절차는 다음과 같습니다.

| 복구 유형 | 대상 컴포넌트 | 실행 절차 및 키 조합 | 설명 |
| :--- | :--- | :--- | :--- |
| **HP Sure Start SPI 복구** | SPI Flash ROM / BIOS | `Win + B + 전원 버튼` 조합 | 전원이 꺼진 상태에서 `Win` 키와 `B` 키를 동시에 누른 채 전원 버튼을 2~3초간 눌렀다 뗀 후 키를 유지하여 백업 하드웨어 레벨에서 정상 BIOS 펌웨어를 복구합니다. |
| **하드웨어 EC/CMOS 리셋** | Embedded Controller (EC) / RTC | 전원 버튼 15초 유지 | AC 어댑터를 분리하고 전원 버튼을 15초 이상 길게 눌러 EC 레지스터 및 임시 하드웨어 상태를 강제 방전 초기화합니다. |
