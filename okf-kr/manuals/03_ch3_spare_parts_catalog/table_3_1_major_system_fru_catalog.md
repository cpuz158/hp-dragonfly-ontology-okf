---
type: Table
title: '제3장 [별표 3-1] 주요 시스템 FRU 스페어 파트 카탈로그 (탑커버 · 하판 · 배터리 · 베이퍼챔버 히트싱크 · SSD 파트번호)'
description: '서비스 매뉴얼 3장 도해 카탈로그(표 3-1, pp. 17–21)에 수록된 주요 하드웨어 교체 부품(FRU/CRU)의 공식 HP 스페어 파트 번호와 호환 규격을 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 03_ch3_spare_parts_catalog
- structured_table
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 4d3c28c0da993cd6b23129d3c0f4ec40bebebea838f91d18831580862a83f738
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/03_ch3_spare_parts_catalog/doc.md
sequence: 17
treatment: structured_table
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제3장 별표 3-1'
source_page: 17
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제3장 [별표 3-1] — 주요 시스템 FRU 스페어 파트 카탈로그 총괄 (pp. 17–21)

## 1. 섀시 · 전원 · 열관리 · 스토리지 핵심 스페어 파트 매핑표
| 번호 | 부품명 (Component Description) | 스페어 파트 번호 (FRU Part ID) | 교체 시 필수 선행 분리 (`REQUIRES_REMOVAL_OF`) |
| :---: | :--- | :---: | :--- |
| 1 | 탑커버 일체형 백라이트 키보드 (Slate Blue, 한국어/영문) | `N09042-001` / `N19015-001` | 하판 커버 ➔ 배터리 ➔ 시스템 보드 전체 분리 후 교체 |
| 2 | 베이퍼 챔버 방열판 (Vapor Chamber Heatsink, PTM7950 부착) | `M90790-001` / `N18244-001` | `N22918-001`(하판 커버) ➔ `M90788-005`(배터리) |
| 3 | 듀얼 액정 폴리머 냉각 팬 (Cooling Fan Assembly) | `M90791-001` / `N18245-001` | `N22918-001`(하판 커버) ➔ `M90788-005`(배터리) *(히트싱크 탈거 불필요)* |
| 4 | 66Wh 4셀 리튬이온 스마트 배터리 팩 (XL-Long Life) | `M90788-005` / `M90789-005` | `N22918-001`(하판 커버 분리 직후 제1순위로 전원 커넥터 차단) |
| 5 | 1TB / 2TB PCIe Gen4×4 NVMe M.2 2280 TLC SSD | `M16560-005` / `M90790-001` | `N22918-001`(하판 커버) ➔ `M90788-005`(배터리) + 흑색 Mylar 실드(`N09040-001`) 이관 |
| 6 | 마그네슘-알루미늄 하판 커버 (Bottom Cover, 캡티브 T5×5) | `N22918-001` / `N09035-001` | 최외곽 루트 부품 (선행 분리 조건 없음, Torx T5 0.20 N·m) |
