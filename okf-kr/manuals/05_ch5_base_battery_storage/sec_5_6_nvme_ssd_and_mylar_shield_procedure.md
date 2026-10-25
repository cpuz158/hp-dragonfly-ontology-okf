---
type: Provision
title: '제5장 §5.6 (M.2 2280 PCIe Gen4 NVMe SSD 분리 및 써멀 패드 · 전도성 흑색 Mylar 차폐 필름(N09040-001) 재부착 의무)'
description: 'M.2 2280 PCIe Gen4 NVMe SSD 분리 및 교체 시 컨트롤러 과열(85°C 쓰로틀링)과 인접 5G WWAN/Wi-Fi 6E 고주파 간섭(RFI)을 막기 위해 써멀 패드와 전도성 흑색 Mylar 차폐 필름(N09040-001)을 반드시 재부착하도록 규정합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 3bd22bc08862b60247ee949510f1f7679d0b87f9815c6ac62768ffa4ed6fd279
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/05_ch5_base_battery_storage/doc.md
sequence: 41
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제5장 §5.6'
source_page: 41
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제5장 §5.6 — M.2 2280 PCIe Gen4 NVMe SSD 분리 및 흑색 Mylar 방열 실드(`N09040-001`) 이관 절차 (pp. 40–42)

## 1. 대상 FRU 및 선행 분해 DAG
- **부품 번호:** `M90790-001` / `M16560-005` (1TB PCIe Gen4×4 TLC SSD), `M90791-001` / `M52027-005` (2TB), `N09040-001` (SSD 써멀 패드 및 흑색 Mylar 실드 키트).
- **선행 분리 경로 (`REQUIRES_REMOVAL_OF` 2-Hop):**
  `N22918-001`(하판 커버) ➔ `M90788-005`(배터리 전원 분리) ➔ `M90790-001`(NVMe SSD).

## 2. 상세 교체 및 방열 실드 이관 지침
1. SSD 상단을 덮고 있는 **전도성 흑색 Mylar EMI 차폐 플랩(`N09040-001`)**을 조심스럽게 젖힙니다.
2. **Phillips PM2.0×2.5 나사 1개**를 제거하고 SSD를 `25°` 각도로 들어 올려 M.2 슬롯에서 분리합니다.
3. 기존 SSD에 부착된 **구리 방열 실드(Copper Thermal Shield)와 실리콘 써멀 패드**를 손상 없이 신규 SSD에 이관하여 부착합니다(누락 시 PCIe Gen4 컨트롤러 `85°C` 과열 쓰로틀링 발생).
