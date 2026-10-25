---
type: section
title: '제5장 §5.4~5.7 — 마그네틱 펜 슬롯 · SIM 보드(N22922-001) · 5G WWAN 모듈(4x4 MIMO 안테나 #5~#8) 및 무선 충전 모듈(N22924-001) 분리 (PDF p.43–47 · Doc p.37–41)'
description: '원본 PDF 제5장(Doc pp. 37–41, PDF p.43–47)의 마그네틱 펜 슬롯 분리, SIM 보드(N22922-001) ZIF 케이블 해제, WWAN 모듈(Intel 5000 5G N00182-005 / XMM 7560 R+ M52040-005)의 фоil 실드·4개 동축 안테나(#5 주황, #6 백/청, #7 황색, #8 자주색)·Phillips M2.0×2.5 나사 제거, 무선 충전 모듈(N22924-001) 분리 절차를 설명합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=43
  kind: origin_document
  sha256: 3a0e19d1c9055eaf6d47e1a4ec03779a86fe57b9106ed464ce1a2c20775b854d
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 05_ch5_base_storage_wwan
sequence: 17
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제5장 §5.4~5.7 (마그네틱 펜 슬롯 · SIM 보드 · 5G WWAN 모듈 · 무선충전 모듈)'
source_page: 43
source_pages_span: 'PDF p.43–47 (Doc p.37–41)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.4~5.7 — 마그네틱 펜 슬롯 · SIM 보드(N22922-001) · 5G WWAN 모듈(4x4 MIMO 안테나 #5~#8) 및 무선 충전 모듈(N22924-001) 분리 (PDF p.43–47 · Doc p.37–41)

## 1. 개요 및 부품 규격 일람
본 섹션에서는 HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC의 마그네틱 펜 슬롯, SIM 보드, WWAN 모듈 및 무선 충전 모듈의 분리 및 교체 절차를 다룹니다.

### 주요 예비 부품 번호 (Spare Part Numbers)
| 구성품 항목 | 설명 및 사양 | 부품 번호 (Spare Part No.) |
| :--- | :--- | :--- |
| **마그네틱 펜 슬롯 (Magnetic pen slot)** | 펜 거치 및 정렬 슬롯 | `N26148-001` |
| **SIM 보드 (SIM board)** | WWAN 지원 모델용 SIM 보드 | `N22940-001` (연관 어셈블리 키트: `N22922-001`) |
| | WLAN 전용 모델용 더미 SIM 보드 | `N22941-001` |
| | SIM 케이블 (케이블 키트 포함) | `N22929-001` |
| | SIM 트레이 및 인서트 (기타 부품 키트 포함) | `N22932-001` |
| **WWAN 모듈 (WWAN module)** | Intel 5000 5G Solution WWAN (4x4 MIMO) | `N00181-005` |
| | Intel XMM 7560 R+ LTE-Advanced Pro (Cat 16) | `N00182-005` |
| | WWAN 카드 고무 패드 (Rubber Kit) | `N22933-001` |
| | WWAN 모듈 브래킷 (Bracket Kit) | `N22931-001` |
| **무선 충전 모듈 (Wireless charging module)** | 무선 충전 코일 및 제어 보드 | `N26149-001` (충전 어셈블리: `N22924-001` / `N19021-001`) |
| | 무선 충전 모듈 FPC 케이블 (케이블 키트) | `N22929-001` |

---

## 2. 사전 준비 작업
모든 서브 모듈 분리 작업 전 다음 절차를 필히 수행해야 합니다:
1. 컴퓨터 분해 준비 완료 (컴퓨터 전원 종료 및 외부 전원 분리).
2. 베이스 하판(Bottom cover) 분리 완료 (PDF p.39 / Doc p.33 참조).
3. 시스템 보드에서 배터리 케이블 분리 완료 (PDF p.44 / Doc p.42 참조).

---

## 3. 세부 분리 및 장착 절차

### 3.1 마그네틱 펜 슬롯 (Magnetic Pen Slot, PDF p.43–44 / Doc p.37–38)
1. 마그네틱 펜 슬롯을 본체 프레임에 고정하는 **Phillips M2.0 × 3.0 나사 1개**를 제거합니다.
2. 슬롯 어셈블리를 컴퓨터 섀시 밖으로 밀어내어 분리합니다.
3. 장착은 분리의 역순으로 수행합니다.

### 3.2 SIM 보드 (SIM Board, PDF p.44–45 / Doc p.38–39)
1. 컴퓨터 측면 개구부에서 SIM 트레이(Holder)를 먼저 추출합니다.
2. SIM 보드의 ZIF 커넥터 래치를 풀고 케이블을 분리합니다.
3. SIM 보드를 섀시에 고정하는 **Phillips M2.0 × 3.0 나사 1개**를 분리합니다.
4. 보드 한쪽을 약 20도 각도로 들어 올린 후, USB 브래킷 하단에서 보드를 조심스럽게 꺼냅니다.
> **주의:** SIM 보드를 재장착할 때는 반드시 보드 가장자리를 USB 브래킷 밑으로 정확히 삽입한 뒤 나사를 체결해야 합니다.

### 3.3 WWAN 모듈 (5G/4G Module & MIMO 안테나, PDF p.45–47 / Doc p.39–41)
> **규정 준수 경고:** 무선 모듈은 해당 국가 및 지역의 무선 통신 규제 기관에서 승인한 공식 인증 모듈만 장착해야 합니다. 비인가 모듈 장착 시 시스템 경고 메시지가 발생하며 부팅이 제한될 수 있습니다.

1. 모듈 커넥터 상단에 부착된 절연 테이프를 제거합니다.
2. 우측 팬(Right fan)의 **캡티브(탈락 방지형) 나사 2개**를 풉니다.
3. 4x4 MIMO 안테나 단자(안테나 번호 #5~#8 등)에서 동축 안테나 케이블을 손상 없이 수직으로 분리합니다.
4. 모듈을 덮고 있는 회색 도전성 테이프(Conductive tape)를 벗겨냅니다 (커넥터 쪽은 붙여두어도 무방).
5. **Phillips M1.6 × 1.6 고정 나사 1개**를 제거한 뒤, 서멀 모듈에서 연장된 플라스틱 가이드 아래에서 모듈을 당겨 빼냅니다.
6. **안테나 슬리브 보호 조치:** 모듈이 장착되지 않는 단자의 안테나 커넥터에는 보호용 절연 슬리브를 씌워 합선을 방지합니다.
> **조립 유의사항:** 4G WWAN 모듈에는 재사용 브래킷이 포함되어 있으므로 교체 시 누락하지 마십시오. WWAN 모듈 장착 후 반드시 우측 팬 고정 나사 2개를 다시 견고하게 조여야 합니다.

### 3.4 무선 충전 모듈 (Wireless Charging Module, PDF p.47 / Doc p.41)
1. 보드 표면에 부착된 고무 조각(Rubber piece)을 분리합니다.
2. 보드 상단 및 하단에 위치한 ZIF 커넥터 2곳에서 FPC 플랫 케이블을 분리합니다.
3. 보드는 하판에 접착 테이프로 고정되어 있으므로 비도전성 리무버 툴을 사용하여 조심스럽게 점착면을 박리합니다.
4. 무선 충전기 브래킷을 고정하는 **Phillips M2.0 × 3.0 나사 1개**를 풀고 브래킷을 본체에서 떼어냅니다.

---

## 4. 연계 장애 분석 및 점검 가이드 (Ontology Linkage)

### [TS-DFG3-002] 5G WWAN 서비스 없음 (No Service) 점검
* **증상:** Intel 5000 5G WWAN (`N00181-005`) 장착 모델에서 이동통신 네트워크가 인식되지 않거나 간헐적으로 통신 두절 발생.
* **점검 순서:**
  1. 안테나 케이블 4선(#5, #6, #7, #8 MIMO 안테나)이 모듈 각 포트에 규격대로 결속되었는지 확인.
  2. 회색 도전성 테이프 및 절연 테이프가 정상 복원되어 접지가 유지되는지 점검.
  3. SIM 보드(`N22940-001`) 연결 FPC 케이블 체결 및 USB 브래킷 하단 장착 간섭 여부 점검.

### [TS-DFG3-006] 마그네틱 무선 펜 충전 불량 점검
* **증상:** 스타일러스 펜(`N16051-001` / `N19020-001`)을 마그네틱 펜 슬롯(`N26148-001`)에 결합했으나 충전 인식이 되지 않음.
* **점검 순서:**
  1. 무선 충전 모듈 어셈블리(`N26149-001` / `N22924-001` / `N19021-001`) 상/하단 ZIF FPC 케이블 단선 및 결속 상태 확인.
  2. 마그네틱 슬롯 체결 각도 및 나사 고정 상태, 충전 코일 위치와의 물리적 정렬 상태 확인.
