---
type: section
title: '제5장 §5.8 — 4셀 53Whr 배터리 팩(M90788-005) 분리 절차 및 선행 전원 차단 강행 원칙 (PDF p.48–49 · Doc p.42–43)'
description: '원본 PDF 제5장 배터리 분리 섹션(Doc pp. 42–43, PDF p.48–49)에 따라 4셀 53Whr 리튬이온 배터리(M90788-005) 상단 접착 테이프(1)를 젖히고 시스템 보드에서 배터리 전원 케이블(2)을 분리한 뒤, Phillips M2.0×4.0 나사 4개(3)를 제거하여 배터리를 들어 올리는 절차를 설명합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=48
  kind: origin_document
  sha256: ca408ef361e4a286a6f6cf6a460562beede58231f37e7e33d1eb3c856c971cc9
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 05_ch5_base_storage_wwan
sequence: 15
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제5장 §5.8 (배터리 팩 M90788-005 분리 및 전원 차단)'
source_page: 48
source_pages_span: 'PDF p.48–49 (Doc p.42–43)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.8 — 4셀 53Whr 배터리 팩(M90788-005) 분리 절차 및 선행 전원 차단 강행 원칙 (PDF p.48–49 · Doc p.42–43)

## 1. 부품 개요 및 예비 부품 번호 (PDF p.48 · Doc p.42)

HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC에 탑재된 배터리 팩은 절연체(insulators)가 포함된 4셀 고용량 리튬이온 폴리머 팩입니다. 시스템 보드, 히트싱크, 각종 ZIF 커넥터 케이블 어셈블리 등의 내부 부품을 교체하거나 점검하기 전, 회로 쇼트 및 부품 파손을 방지하기 위한 절대적 선행 조건(`REQUIRES_REMOVAL_OF`)으로 배터리 전원 차단 및 분리가 강제됩니다.

### Table 5-7 Battery description and part number

| 설명 (Description) | 예비 부품 번호 (Spare part number) |
| :--- | :--- |
| Battery, 4 cell, 53 Whr (includes insulators) | **M90788-005** |

---

## 2. 배터리 취급 시 안전 경고 및 주의사항 (PDF p.48–49 · Doc p.42–43)

### 경고 (WARNING!)
인명 부상 및 제품 손상을 방지하기 위해 다음 안전 수칙을 반드시 준수해야 합니다:
- 배터리를 찌르거나(puncture), 비틀거나(twist), 균열을 일으키지 마십시오.
- 배터리 외부에 구멍을 내거나 파열을 유발하지 마십시오. 배터리 내부 단락(short)이 발생하여 열 폭주(thermal runaway)로 이어질 수 있습니다.
- 핀셋이나 플라이어 등 끝이 뾰족한 도구로 배터리 외장 케이스를 다루거나 만지지 마십시오.
- 배터리 케이스 위에 도구나 무거운 물체를 올려놓거나 압착(compress/squeeze)하지 마십시오. 배터리에 과도한 물리적 하중이 가해질 수 있습니다.
- 금속 공구, 나사, 동전 등 전도성 표면이나 금속 물체로 배터리 커넥터 단자를 만지지 마십시오. 단자 간 단락이 발생할 수 있습니다.
- 잠재적 안전 위험을 줄이기 위해 컴퓨터와 함께 제공된 정품 사용자 교체 배터리, HP가 공급한 교체용 배터리 또는 HP 정식 호환 배터리만 사용하십시오.

### 중요 공지 (IMPORTANT)
컴퓨터의 유일한 전원 공급원인 배터리를 분리하면 저장되지 않은 작업 데이터가 손실될 수 있습니다. 데이터 손실을 방지하려면 배터리를 분리하기 전 Windows 환경에서 작업을 저장하고 정상적으로 시스템을 종료하십시오.

---

## 3. 선행 작업 (Prerequisites) (PDF p.48–49 · Doc p.42–43)

배터리 팩을 분리하기 전에 반드시 다음 순서로 선행 단계를 완료해야 합니다:
1. **분해 준비 작업 수행**: 사전 전원 차단 및 준비 절차를 진행합니다 (33페이지 *Preparation for disassembly* 참조).
2. **하판 분리**: 하판 커버를 완전히 제거합니다 (33페이지 *Bottom cover* 참조).

---

## 4. 배터리 분리 절차 (PDF p.49 · Doc p.43)

배터리 팩(`M90788-005`)을 본체에서 안전하게 분리하려면 다음 절차를 순서대로 수행합니다:

1. **배터리 케이블 분리 (1)**:
   - 메인보드(System board) 커넥터에서 배터리 케이블 단자를 수평으로 들어 올려 분리합니다.
2. **고정 나사 체결 해제 (2)**:
   - 배터리를 본체 섀시에 고정하고 있는 **Phillips M2.0 × 3.0 나사 5개**를 풀어냅니다.
3. **안테나 케이블 가이드 분리 (3)**:
   - 배터리 우측면의 고정 클립(clip)에 라우팅되어 있는 안테나 케이블을 조심스럽게 꺼내어 정리합니다.
4. **배터리 팩 적출 (4)**:
   - 배터리 팩을 본체에서 조심스럽게 들어 올려 완전히 분리합니다.

> **조립 시 주의사항**: 배터리를 다시 장착할 때는 위 분해 절차를 역순으로 수행하며, 케이블 찝힘이나 나사 조임 토크 초과로 배터리 외장이 손상되지 않도록 유의하십시오.
