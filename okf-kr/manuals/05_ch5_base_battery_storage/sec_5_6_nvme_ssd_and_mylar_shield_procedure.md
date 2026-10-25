---
type: section
title: '제5장 §5.3 — 솔리드 스테이트 드라이브(M.2 2280 PCIe Gen4 NVMe SSD) 및 EMI 차폐 실드 분리·장착 절차 (PDF p.41–42 · Doc p.35–36)'
description: '원본 PDF 제5장 SSD 분리 섹션(Doc pp. 35–36, PDF p.41–42)에 따라 하판 커버 제거 및 배터리 케이블 분리 후, Phillips M2.0×2.5 나사(1)를 풀고 SSD 가장자리를 잡고 당겨 분리(2)하며, M.2 소켓 주위 실드 핑거에 금속 EMI 실드(`N09040-001`)를 정확히 안착시키는 절차를 다룹니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=41
  kind: origin_document
  sha256: 92c24f10f9a4d08cc81b8d3509b5ac6525b3d599ebecc2cc60399cd511cd1380
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 05_ch5_base_storage_wwan
sequence: 16
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '제5장 §5.3 (솔리드 스테이트 드라이브 M.2 2280 NVMe SSD 분리)'
source_page: 41
source_pages_span: 'PDF p.41–42 (Doc p.35–36)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.3 — 솔리드 스테이트 드라이브(M.2 2280 PCIe Gen4 NVMe SSD) 및 EMI 차폐 실드 분리·장착 절차 (PDF p.41–42 · Doc p.35–36)

## 1. 개요 및 부품 사양 (PDF p.41–42 · Doc p.35–36)

HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC는 고성능 저장장치로 M.2 2280 PCIe Gen4 NVMe 솔리드 스테이트 드라이브(SSD)를 장착합니다. 유지보수 및 교체를 위한 공식 예비 부품 번호(Spare Part Number)와 관련 브래킷/차폐 실드 구성품 정보는 다음과 같습니다.

### 표 5-2: 솔리드 스테이트 드라이브 부품 설명 및 예비 부품 번호

| 부품 설명 (Description) | 예비 부품 번호 (Spare Part Number) |
| :--- | :--- |
| 2 TB, PCIe-4 × 4, TLC | `M52027-005` |
| 1 TB, PCIe-4 × 4, TLC | `M16560-005` |
| 512 GB, PCIe-4 × 4, TLC | `M17436-005` |
| 512 GB, PCIe-3 × 4, TLC | `L85360-001` |
| 512 GB, PCIe-4 × 4, TLC, SED (Self-Encrypting Drive) | `M52031-005` |
| 256 GB, PCIe-4 × 4, TLC | `M52025-005` |
| 256 GB, PCIe-4 × 4, TLC, SED (Self-Encrypting Drive) | `M52029-005` |
| 솔리드 스테이트 드라이브 브래킷 (Bracket Kit에 포함) | `N22931-001` |
| SSD 서멀 패드 및 마일러 차폐 실드 (온톨로지 연계 규격) | `N09040-001` / `M90790-001` |

---

## 2. 사전 준비 작업 (Pre-disassembly Procedures)

솔리드 스테이트 드라이브를 분리하기 전 반드시 다음 단계를 순서대로 완료해야 합니다 (PDF p.42 · Doc p.36):

1. **분해 준비 작업 수행**: 컴퓨터를 완전히 종료하고 외부 전원 및 연결 장치를 모두 분리합니다 (33페이지 참조).
2. **하판 커버(Bottom cover) 분리**: 가죽 커버 가장자리를 안쪽으로 밀어 푼 뒤, 5개의 캡티브 Torx T5 나사를 풀고 툴을 이용해 하판을 분리합니다 (PDF p.41 · Doc p.35 참조).
3. **배터리 케이블 분리**: 시스템 보드에 연결된 배터리 케이블을 안전하게 분리하여 작업 중 쇼트 및 정전기 손상을 방지합니다 (42페이지 참조).

---

## 3. SSD 분리 절차 (Removal Procedure)

1. **고정 나사 분리**: SSD를 섀시/시스템 보드에 고정하고 있는 1개의 **Phillips M1.4 × 1.2 나사 (1)**를 드라이버를 이용해 제거합니다.
2. **드라이브 탈거**: SSD의 모듈을 살짝 들어 올린 후, M.2 슬롯 소켓으로부터 각도를 유지하며 당겨내어 분리합니다 (2).

---

## 4. 장착 및 조립 시 주의사항 (Replacement & Reassembly)

* **SSD 재장착**: 분리 절차의 역순으로 진행합니다. M.2 슬롯에 SSD 핀을 정확히 맞물려 비스듬히 삽입한 뒤, 아래로 내려 **Phillips M1.4 × 1.2 나사**로 고정합니다. (차폐 실드 및 방열 서멀 컴포넌트가 손상되지 않도록 정위치에 부착되어 있는지 확인합니다.)
* **하판 커버 장착 시 주의 (PDF p.41 · Doc p.35)**:
  * 하판 커버를 다시 장착할 때는 커버의 하단(bottom) 부분을 먼저 맞물리도록 밀어 넣은(toe in) 후 측면을 따라 클립을 결합해야 합니다.
  * 측면 나사를 조이기 전에 모든 내부 클립이 정상적으로 완전히 결합되었는지 반드시 확인하십시오.
