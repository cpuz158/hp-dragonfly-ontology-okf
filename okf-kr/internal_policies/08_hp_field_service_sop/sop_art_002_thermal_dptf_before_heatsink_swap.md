---
type: section
title: '제10장 HP Sure Start 자동 복구(Doc p.97) · 제11장 배터리/부품 재활용 · 제12장 국가별 전원코드 규격 및 열관리 거버넌스 [내규 제2조] (PDF p.101–106 · Doc p.95–100)'
description: '원본 PDF 제10장 후반부(비휘발성 메모리 Q&A, Secure Boot 키 초기화, HP Sure Start 하드웨어 기반 BIOS 무결성 자동 복구 원리, Doc pp. 95–97 / PDF p.101–103), 제11장(배터리 및 전자부품 친환경 재활용 의무, Doc p.98 / PDF p.104), 제12장(국가별 전원 코드 정격 표, Doc pp. 99–100 / PDF p.105–106)과 열관리/방열판 써멀 패드 교체 거버넌스(내규 제2조)를 다룹니다.'
version: '0.2.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=103
  kind: origin_document
  sha256: 337bcf36c27d7eb9f202d321fdfac23dfa375f109c2b3287722d3651689773b1
source_uri: gs://hp-dragonfly-okf/okf-kr/internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: verified
part_of: 08_internal_field_sop_playbooks
sequence: 25
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제10장(Sure Start)·제11장(재활용)·제12장(전원코드) 및 열관리 거버넌스 [내규 제2조]'
source_page: 103
source_pages_span: 'PDF p.101–106 (Doc p.95–100)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제10장 HP Sure Start 자동 복구(Doc p.97) · 제11장 배터리/부품 재활용 · 제12장 국가별 전원코드 규격 및 열관리 거버넌스 [내규 제2조] (PDF p.101–106 · Doc p.95–100)

## 1. 개요 및 비휘발성 메모리 보안 거버넌스 (PDF p.101–103 · Doc p.95–97)

본 장은 HP Dragonfly Folio 13.5" G3 2-in-1 Notebook PC의 비휘발성 메모리 구성 요소의 기술 사양, UEFI BIOS 복원 절차, `HP Sure Start` 자율 복구 아키텍처 및 현장 서비스 엔지니어링 표준(SOP Art.2)을 규정합니다.

### 비휘발성 메모리 사양 요약 (PDF p.101 · Doc p.95)

* **802.11 WLAN EEPROM**: 4 Kb ~ 8 Kb 용량으로 구성 및 캘리브레이션 데이터를 저장합니다. 사용자 데이터는 저장되지 않으며 공장 출하 시 프로그래밍됩니다. 펌웨어 업그레이드 등 특수 목적 외에는 일반에 비공개된 전용 유틸리티로만 쓰기 작업이 가능합니다.
* **Camera 메모리 (일부 모델 적용)**: 64 Kb 용량으로 카메라 펌웨어 및 설정값을 유지하며 사용자 데이터는 보관하지 않습니다. 장치 제조업체 유틸리티를 통해서만 갱신됩니다.
* **지문 인식기 (Fingerprint Reader, 일부 모델 적용)**: 512 KB 플래시 메모리를 탑재하여 지문 템플릿을 저장합니다. HP ProtectTools Security Manager 등록을 통해 프로그래밍되며, 디지털 서명된 공인 애플리케이션 호출을 통해서만 플래시 메모리 기록이 허용됩니다.

### BIOS 공장 출하값 복원 및 Secure Boot 키 삭제 절차 (PDF p.101–103)

1. **BIOS 기본값 복원 (Apply Factory Defaults)**:
   * 전원을 켜거나 재부팅한 후 즉시 `Esc` 키를 연타하여 시작 메뉴로 진입합니다.
   * `Main` 메뉴에서 `Apply Factory Defaults and Exit`를 선택하고 화면 지침에 따라 변경 사항을 저장(`Save Changes and Exit`)합니다.
   * *주의*: 기본값 복원은 드라이브 내 데이터를 완전 삭제하지 않으며, 사용자 지정 커스텀 보안 부팅(Custom Secure Boot) 키를 초기화하지 않습니다.
2. **Custom Secure Boot Keys 초기화 절차 (PDF p.102–103 · Doc p.96–97)**:
   * `Esc` 키로 진입 후 `Security` 메뉴 선택.
   * `Secure Boot Configuration` 창으로 이동한 후 `Secure Boot` 항목 내 `Clear Secure Boot Keys`를 실행하여 수동으로 등록된 모든 인증 키를 소거합니다.

---

## 2. HP Sure Start 자율 복구 기술 (PDF p.103 · Doc p.97)

일부 모델에 탑재된 `HP Sure Start`는 시스템 BIOS에 대한 외부 공격이나 펌웨어 손상을 하드웨어 레벨에서 상시 모니터링하는 내장 보안 기술입니다.

* **자율 복구 메커니즘**: BIOS 무결성이 훼손되거나 악의적 변조 공격이 감지되면 사용자의 수동 개입 없이 자동으로 시스템을 이전의 검증된 안전한 상태(previously safe state)로 복원합니다.
* **기본 활성화 정책**: 해당 모델은 출하 시 HP Sure Start가 기본 구성 및 활성화되어 제공되므로 대다수 사용자가 별도 설정 없이 즉시 보호받을 수 있으며, 고급 관리자는 설정을 커스터마이징할 수 있습니다.

---

## 3. 부품 재활용 및 국가별 전원 코드 기술 규격 (PDF p.104–106 · Doc p.98–100)

### 배터리 및 부품 재활용 거버넌스 (제11장, PDF p.104 · Doc p.98)
* 충전식 및 비충전식 배터리가 수명 한계에 도달한 경우 일반 생활폐기물로 폐기해서는 안 되며, 현지 관련 법령과 규정에 따라 수거/처리해야 합니다.
* 전자 하드웨어 및 정품 카트리지 폐기 시 공식 재활용 프로그램(`hp.com/recycle`)을 준수합니다.

### 전원 코드 정격 및 국가별 기술 기준 (제12장, PDF p.105–106)
노트북의 광대역 입력(Wide-range input) 전원 공급 장치를 안전하게 운용하기 위해 국가별 인증 전원 코드를 반드시 준수해야 합니다.

| 국가 및 지역 | 정격 전압 / 전류 규격 | 인증 규격 및 플러그 형태 |
| :--- | :--- | :--- |
| **북미 / 미국 (USA)** | `10 A / 125 V` | NEMA 5-15P 플러그, 3도체 접지형, UL/CSA 승인 |
| **유럽 / 국제 표준** | `2.5 A / 230 V` (또는 `10 A / 250 V`) | CEE 7/7, VDE/IEC 공인 안전 인증 전원선 |

---

## 4. [내규 제2조] 열관리 및 히트싱크 교체 엔지니어링 거버넌스 (`SAFE-DFG3-THM`)

1. **DPTF 및 열 해석 사전 진단 원칙**:
   * 히트싱크 또는 쿨링 팬 어셈블리를 물리적으로 분해·교체하기 전, 엔지니어는 반드시 OS 환경의 Intel Dynamic Tuning Technology (DPTF) 로그 및 HP Support Assistant 열 해석 데이터를 사전 점검해야 합니다.
2. **열전달 물질(Thermal Material) 의무 재도포 규정**:
   * 방열판 어셈블리가 시스템 보드에서 분리될 때마다 기존 서멀 그리스 및 패드는 반드시 완전 제거되어야 합니다.
   * 프로세서 다이 및 접촉 부위에 지정된 고성능 서멀 그리스(`SAFE-DFG3-THM` 규격)를 정량 도포하고 새 서멀 패드를 정확한 위치에 부착해야 합니다.
   * 결합 스크루는 히트싱크 표면에 각인된 대각선 순서 번호(1 -> 2 -> 3 -> 4)에 따라 균등한 토크로 체결하여 코어 크랙 방지 및 최적의 열전도도를 보장해야 합니다.
