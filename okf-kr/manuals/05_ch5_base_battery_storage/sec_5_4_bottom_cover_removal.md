---
type: section
title: '제5장 §5.1·5.2 — 분해 사전 준비 및 하판 커버(Bottom Cover, N22918-001) · 가죽 커버 분리 절차 (PDF p.39–41 · Doc p.33–35)'
description: '원본 PDF 제5장 첫 절차(Doc pp. 33–35, PDF p.39–41)인 분해 사전 준비(전원 종료, AC/외부케이블/SIM 제거)와 하판 커버(N22918-001) 분리 절차(4개 캡티브 나사 해제, 스피커 홀 2개 Phillips M2.0×4.5 나사 제거, 후면 가죽 커버 모서리 해제 후 하판 분리)를 수록합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=39
  kind: origin_document
  sha256: 863fb50d1823c6a2b4cee6ca27764729d22aacedf03ef8bcb77a7aa140281e71
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/sec_5_4_bottom_cover_removal.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 05_ch5_base_storage_wwan
sequence: 14
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제5장 §5.1·5.2 (분해 사전 준비 및 하판 커버 N22918-001 분리)'
source_page: 39
source_pages_span: 'PDF p.39–41 (Doc p.33–35)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.1·5.2 — 분해 사전 준비 및 하판 커버(Bottom Cover, N22918-001) · 가죽 커버 분리 절차 (PDF p.39–41 · Doc p.33–35)

## 1. 개요 및 공인 서비스 제공자 주의사항 (PDF p.39 / Doc p.33)

본 장은 공인 서비스 제공자(Authorized Service Provider) 전용 부품의 분해 및 교체 절차를 규정합니다.

- **중요 경고(IMPORTANT)**: 본 장에 기술된 내부 부품은 반드시 공인 서비스 엔지니어만 분해 및 접근해야 합니다. 비인가자의 분해는 기기 손상을 초래하거나 보증을 무효화할 수 있습니다.
- **기기 식별 정보(NOTE)**: 모델 번호, 일련번호(Serial Number), 제품 키(Product Key), 보증 기간 등 세부 정보는 컴퓨터 바닥면에 위치한 서비스 태그(Service Tag)에 기재되어 있습니다.
- **부품 최신 정보**: 부품 업데이트 정보는 HP PartSurfer 웹사이트에서 최신 상태로 확인할 수 있으며, 분해 시 나사 크기와 체결 위치를 철저히 기록해야 합니다.

### 분해 사전 준비 단계 (Preparation for Disassembly)
1. 컴퓨터 전원을 끕니다. 전원 상태가 불확실하거나 최대 절전 모드(Hibernation)인 경우, 전원을 켠 후 OS 종료 메뉴를 통해 완전히 종료합니다.
2. 컴퓨터에 연결된 AC 전원 코드(어댑터)를 뽑아 전원을 완전히 차단합니다.
3. 컴퓨터에 연결된 모든 외부 장치 및 주변기기를 분리합니다.

---

## 2. 하판 커버 및 관련 부품 사양 (PDF p.39 / Doc p.33)

### 표 5-1 하판 커버 부품 설명 및 예비 부품 번호 (Table 5-1 Bottom cover descriptions and part numbers)
| 부품 설명 (Description) | 예비 부품 번호 (Spare Part Number) |
| :--- | :--- |
| 하판 커버 (Bottom cover, WWAN 모델) | **N22918-001** |
| 하판 커버 (Bottom cover, WLAN 모델) | **N22919-001** |
| 엔드 커버 (End covers, 좌/우 1쌍) | **N26146-001** |

> **온톨로지 연계 및 하드웨어 비교 노트**: 
> - **Folio G3 (2-in-1 폼팩터)**: 상단 힌지 라인을 감싸는 외장 가죽 커버 플러그 내부에 2개의 Phillips M2.0×4.0 나사가 장착되며, 하단 본체에 5개의 캡티브 Torx T5 나사가 체결됩니다. (일부 Folio 변체 모델에 따라 4 captive Phillips + 2 M2.0x4.5 나사 체결 구조 사용)
> - **일반 Clamshell 모델 (G3 Clamshell)**: 가죽 커버 랩 어셈블리가 없으며, 하판에 5개의 캡티브 Torx T5 나사(권장 조임 토크: `0.20 N·m`)로 고정됩니다 (하판 스페어: `N22918-001` / `N09035-001`).

---

## 3. 하판 커버 및 가죽 커버 분리 단계 (PDF p.40–41 / Doc p.34–35)

### 가죽 랩 및 엔드 커버 나사 분리 (PDF p.40 / Doc p.34)
1. **디스플레이 각도 조절**: 컴퓨터 후면을 감싸는 커버에 여유 공간(slack)이 생기도록 디스플레이를 약 **110°** 각도로 엽니다.
2. **커버 플러그 분리**: 분해 공구(Prying tool)를 사용하여 컴퓨터 양쪽 끝 커버 안쪽에서 커버 플러그를 들어 올려 분리합니다.
3. **상단 고정 나사 제거**: 각 커버 플러그 아래에 위치한 **Phillips M2.0 × 4.0** 나사 2개를 제거합니다.

### 가죽 커버 및 하판 섀시 분리 (PDF p.41 / Doc p.35)
4. **가죽 커버 분리**: 가죽 커버는 기기 후면을 감싸 바닥면 커버까지 이어집니다. 가죽 커버의 바깥쪽 가장자리를 비스듬한 각도로 외부에서 내부 방향으로 밀어 양쪽 측면 래치를 해제한 다음, 커버 중앙부를 밀어내어 섀시에서 완전히 분리합니다.
5. **Torx T5 나사 해제 및 섀시 오픈**: 하판에 체결된 **5개의 캡티브 Torx T5 나사**를 풉니다. 커버 하단 가장자리에 있는 슬롯(분해 홈)에 공구를 삽입하고 위로 들어 올려 하판 커버 래치를 분리하고 탈거합니다.

---

## 4. 재조립 및 장착 시 주의사항 (PDF p.41 / Doc p.35)

- 하판 커버를 재장착할 때는 분해 역순으로 진행합니다.
- **체결 가이드(NOTE)**: 하판 커버를 장착할 때는 먼저 하단 가장자리를 정렬하여 밀어 넣은 후(toe-in), 양쪽 측면 클립이 완전히 맞물릴 때까지 눌러줍니다. 측면 나사를 장착하기 전에 모든 내부 클립이 완벽하게 체결되었는지 반드시 확인해야 합니다.
