---
type: Table
title: '제3장 [별표 3-1 상세] 시스템 보드(System Board) FRU 매트릭스 — CPU · vPro · 16GB/32GB LPDDR5 · WWAN 지원별 파트번호'
description: 'LPDDR5 메모리가 온보드 납땜되어 있어 CPU 모델, Intel vPro 유무, 메모리 용량(16GB vs 32GB), 5G WWAN 슬롯 배선 및 OS 라이선스(Win11 Pro: -601 / Non-Win: -001) 조합별로 정확히 매칭해야 하는 시스템 보드 스페어 파트 번호표입니다.'
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
  sha256: 9fa4ef242f5cdd5655a6a327116aa28a1fd89377168b32bbabf8a6749fee4771
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/03_ch3_spare_parts_catalog/doc.md
sequence: 19
treatment: structured_table
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제3장 별표 3-1(보드)'
source_page: 19
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제3장 [별표 3-1 상세] — 시스템 보드(System Board) 16종 SKU 매트릭스 (pp. 19–20)

## 1. 온보드 LPDDR5 및 WWAN 구성별 시스템 보드 스페어 파트 번호
| 대표 SKU ID | 프로세서 (CPU) | Intel vPro | 온보드 LPDDR5 메모리 | 5G WWAN M.2 Key-B 슬롯 | 시스템 보드 파트 번호 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `SKU-DFG3-I732-5G` | Intel Core i7-1265U | **vPro Enterprise** | **32 GB** (온보드 납땜) | **실장 (WWAN-Ready)** | **`N19201-601` / `M90788-601`** |
| `SKU-DFG3-I716-WIFI` | Intel Core i7-1265U | **vPro Enterprise** | **16 GB** (온보드 납땜) | 미실장 (Wi-Fi 전용) | **`N19202-601` / `M90787-601`** |
| `SKU-DFG3-I732-NONVPRO` | Intel Core i7-1255U | Non-vPro | **32 GB** (온보드 납땜) | 실장 (WWAN-Ready) | **`N19203-601` / `M90786-601`** |
| `SKU-DFG3-I516-WIFI` | Intel Core i5-1245U | vPro Enterprise | **16 GB** (온보드 납땜) | 미실장 (Wi-Fi 전용) | **`N19204-601` / `M90785-601`** |

## 2. 시스템 보드 발주 시 필수 검증 규칙
- **인접 행 오매칭 주의:** 표 3-1에서 `N19201-601`(32GB + 5G WWAN)과 `N19202-601`(16GB + Wi-Fi 전용)은 품명이 유사하나 메모리 용량과 M.2 Key-B WWAN 슬롯 실장 여부가 다르므로 반드시 BigQuery Property Graph의 `USES_SYSTEM_BOARD` 엣지로 정밀 대조해야 합니다.
