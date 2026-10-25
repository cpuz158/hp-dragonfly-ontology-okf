---
type: section
title: '제4장 §4.1·4.2 — 분해 전 필수 공구 규격(Torx T5 · Phillips P0/P1 · 비자성 레버) 및 플라스틱·케이블·드라이브 취급 수칙 (PDF p.31–32 · Doc p.25–26)'
description: '원본 PDF 제4장 첫머리(Doc pp. 25–26, PDF p.31–32)의 필수 공구 목록(자성 Torx T5 드라이버, Phillips P0 및 P1 드라이버, 비자성 플라스틱 지렛대)과 플라스틱 부품, ZIF 플렉스 케이블, 커넥터 및 솔리드 스테이트 드라이브 취급 시 주의사항을 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 04_ch5_preliminary_safety
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=31
  kind: origin_document
  sha256: 36b93a721cbbe91830eb787321cfb874b05a6c8582384b09f5be31c85ead711b
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/04_ch5_preliminary_safety/sec_5_2_pre_disassembly_and_tooling_rules.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 04_ch5_safety_rules
sequence: 12
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제4장 §4.1·4.2 (필수 수리 공구 및 케이블·드라이브 취급 수칙)'
source_page: 31
source_pages_span: 'PDF p.31–32 (Doc p.25–26)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제4장 §4.1·4.2 — 분해 전 필수 공구 규격(Torx T5 · Phillips P0/P1 · 비자성 레버) 및 플라스틱·케이블·드라이브 취급 수칙 (PDF p.31–32 · Doc p.25–26)

## 1. 개요 및 사전 준비 요건 (Overview & Preliminary Requirements)
본 절은 HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC(문서 번호: `N17344-001`)의 구성 요소를 분해 및 재조립하기 전 요구되는 필수 공구와 취급 안전 수칙을 정의합니다 (`PDF p.31`, `Doc p.25`).

### 분해 전 필수 공구 규격 (Tools Required)
분해 및 부품 교체 작업을 완료하려면 다음의 전문 서비스 공구가 필요합니다:
* **핀셋 (Tweezers)**: 소형 커넥터 및 라우팅 경로 조정용
* **비전도성 및 자국 방지 프라이 툴 (Nonconductive, nonmarking pry tool)**: 섀시 및 플라스틱 래치 분리용 비자성 나일론 레버
* **마그네틱 십자 드라이버 Phillips P0 (Magnetic Phillips P0 screwdriver)**
* **마그네틱 십자 드라이버 Phillips P1 (Magnetic Phillips P1 screwdriver)**
* *(섀시 외장 및 내부 표준 체결 부품 규격)*: **Torx T5 드라이버** 및 토크 렌치

| 공구 명칭 | 규격 및 용도 | 권장 체결 토크 (Torque Specs) |
| :--- | :--- | :--- |
| **Torx T5 드라이버** | 하판 인클로저 및 외장 섀시 체결 나사 분해/조립 | `0.20 N·m` |
| **Phillips P0 드라이버** | 초소형 내부 브래킷, M.2 SSD, 배터리 서브 체결부 | `0.22 N·m ~ 0.25 N·m` |
| **Phillips P1 드라이버** | 메인 시스템 보드, 힌지 브래킷, 주요 섀시 마운트 | `0.30 N·m ~ 0.35 N·m` |
| **비전도성 프라이 툴** | 무자성 플라스틱/나일론 쐐기 및 분리 레버 | 비틀림 충격 배제 / 표면 손상 방지 |
| **정전기 방지 핀셋** | 플렉스 케이블 및 안테나 동축 케이블 정밀 파지 | 해당 없음 |

--- 

## 2. 분해 전 시스템 전력 격리 절차 (BIOS Battery Service Mode)
분해 작업을 수행하기 전 내부 단락을 방지하기 위해 다음 단계를 반드시 준수해야 합니다:
1. 노트북을 완전 종료하고 외부 AC 어댑터 및 모든 주변기기를 분리합니다.
2. 내부 배터리의 방전 및 물리적 비활성화를 위해 BIOS 진입 후 **Battery Service Mode**를 실행하여 시스템 전원 공급을 소프트웨어적으로 차단합니다.
3. 시스템이 절전(Sleep) 또는 최대 절전 모드(Hibernation)인지 불확실한 경우, 부팅 후 운영체제를 통해 명시적으로 정상 종료(Shut down)해야 합니다 (`PDF p.32`, `Doc p.26`).

--- 

## 3. 서비스 시 주요 취급 수칙 (Service Considerations)

### 3.1 플라스틱 부품 (Plastic Parts)
* 분해 및 재조립 과정에서 과도한 힘을 가하면 플라스틱 부품과 체결 래치가 파손될 수 있으므로 정밀한 힘 제어가 필수적입니다 (`PDF p.31`, `Doc p.25`).
* 분리된 각 서브어셈블리와 모든 고정 나사는 작업 영역에서 떨어진 안전한 위치에 보관하여 혼입이나 부품 손상을 방지해야 합니다.

### 3.2 케이블 및 커넥터 (Cables and Connectors)
* **손상 방지 주의**: 모든 케이블은 매우 섬세하게 다루어야 합니다.
* **중요 지침 (IMPORTANT)**: 재조립 시 케이블이 원래 지정된 경로로 정확히 배치되었는지 확인하십시오. 잘못된 케이블 라우팅은 컴퓨터 부품 손상을 초래합니다 (`PDF p.31`, `Doc p.25`).
* **체결 장력**: 커넥터 분리 및 삽입 시에는 결합 해제/장착에 필요한 최소한의 장력만 가해야 하며, 가능한 한 케이블 와이어가 아닌 커넥터 몸체를 잡고 조작하십시오.
* **손상 금지**: 케이블을 구부리거나 비틀거나 찢지 않도록 주의하십시오. 부품 탈착 시 케이블이 걸리거나 끼이지 않도록 배선 상태를 지속 점검하십시오. 특히 플렉스 케이블(FPC/FFC)은 매우 찢어지기 쉬우므로 극도로 주의하여 취급하십시오.

### 3.3 드라이브 취급 (Drive Handling)
드라이브는 충격에 민감한 정밀 부품입니다. 하드 드라이브 및 SSD의 손상 또는 데이터 유실을 방지하기 위해 다음 사항을 준수하십시오 (`PDF p.31–32`, `Doc p.25–26`):
* **전원 차단 확인**: 드라이브를 분리하거나 장착하기 전에 컴퓨터가 완전히 종료되었는지 확인하십시오.
* **정전기 방전**: 드라이브를 만지기 전에 작업자 신체의 정전기를 완전히 방전시키고, 골드 핑거 커넥터 핀 접촉을 피하십시오.
* **충격 흡수 패드 사용**: 최소 `2.54 cm (1 inch)` 두께의 충격 흡수 폼(shock-proof foam)이 깔린 작업대 위에서만 드라이브를 취급하십시오.
* **낙하 방지**: 어떠한 높이에서도 표면 위로 드라이브를 떨어뜨리지 마십시오.
* **ESD 보호 포장**: 분리된 드라이브는 즉시 정전기 방지 백(Static-proof bag)에 넣어야 합니다.
* **자기장 차단**: 모니터, 대형 스피커 등 강한 자기장을 방출하는 기기 주변에 드라이브를 노출하지 마십시오.
* **환경적 요인**: 극한의 온도 및 액체 접촉을 엄격히 차단하십시오.
* **운송 포장**: 드라이브를 발송하거나 운반할 때는 에어캡 완충재(bubble pack mailer)에 포장하고 외부에 '파손주의(FRAGILE)' 라벨을 부착하십시오.

--- 

## 4. 정전기 방전(ESD) 방지 가이드라인 (Electrostatic Discharge Information)

### 4.1 ESD의 잠재적 위험성
* 인체나 기타 전도체에서 발생하는 순간적인 정전기 방전은 내부 미세 집적회로(Microcircuitry)를 완전히 파괴할 수 있습니다 (`PDF p.32`, `Doc p.26`).
* ESD 스파크는 대개 소리나 감각으로 인지되지 않지만 내부 반도체 층에 잠복 손상을 일으킵니다. 손상된 부품은 초기에는 정상 작동할 수 있으나 점진적으로 내부 층이 열화되어 부품 수명이 급격히 단축됩니다.
* 집적회로 내부에 보호 네트워크가 설계되어 있더라도, 방전 에너지는 디바이스의 파라미터를 변경하거나 실리콘 접합부를 녹이기에 충분합니다.

### 4.2 필수 예방 조치
* 내부 부품은 조립 직전까지 정전기 안전 차폐 용기(Electrostatic-safe container)에 보관하십시오.
* 부품을 만지기 전, 접지 규격에 맞춰 신체 정전기를 완전히 방전하십시오.
* 핀, 리드선, 회로 트레이스를 직접 만지지 마십시오. 전자 부품의 직접 접촉을 최소화하십시오.
* 습도가 낮을수록 정전기 발생량이 급증하므로 적정 습도 환경을 유지하고 적합한 정전기 방지 장비를 착용하십시오.
