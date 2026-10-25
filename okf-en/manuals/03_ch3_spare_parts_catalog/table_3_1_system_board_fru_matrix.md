---
type: Table
title: 'Ch.3 [Table 3-1 Matrix] System Board FRU Matrix by CPU, vPro, Soldered 16GB/32GB LPDDR5 & WWAN'
description: 'Complete Table 3-1 System Board spare part lookup matrix indexed by Intel CPU model, vPro enterprise support, soldered LPDDR5 capacity (16GB vs 32GB), and 5G WWAN routing.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 03_ch3_spare_parts_catalog
- structured_table
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 15a38259cb508ac095631a2011147b97aa584a150a5f72980de1b96a8e18157e
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/03_ch3_spare_parts_catalog/doc.md
sequence: 19
treatment: structured_table
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.3 Table 3-1(Boards)'
source_page: 19
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 3 [Table 3-1 Callout 9] — System Board FRU Spare Part Matrix (pp. 19–20)

> **CRITICAL ORDERING RULE:** Because both the **12th Gen Intel Alder Lake-U CPU** and **LPDDR5-5200 RAM (`16 GB` or `32 GB`)** are permanently soldered to the System Board, verify all 4 attributes (`CPU`, `vPro`, `RAM`, `WWAN/OLED`) before ordering. Suffix `-601` includes a digital Windows 11 Pro DPK license; `-001` is for Linux/FreeDOS/non-Windows deployments.

| HP Spare Part (Win11 `-601`) | HP Spare Part (Std `-001`) | Processor Model | Intel vPro | Soldered LPDDR5 RAM | 5G WWAN & OLED Support |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **`M90788-601`** | `M90788-001` | Intel Core **i7-1265U** | **Yes (vPro)** | **`32 GB` LPDDR5-5200** | **WWAN + 3K2K OLED Ready** |
| **`N01285-601`** | `N01285-001` | Intel Core **i7-1265U** | **Yes (vPro)** | **`16 GB` LPDDR5-5200** | WWAN + WUXGA+ Sure View |
| **`N01286-601`** | `N01286-001` | Intel Core **i7-1255U** | No (Non-vPro) | **`32 GB` LPDDR5-5200** | **WWAN + 3K2K OLED Ready** |
| **`N01287-601`** | `N01287-001` | Intel Core **i7-1255U** | No (Non-vPro) | **`16 GB` LPDDR5-5200** | WLAN-Only / WUXGA+ IPS |
| **`N01288-601`** | `N01288-001` | Intel Core **i5-1245U** | **Yes (vPro)** | **`16 GB` LPDDR5-5200** | **WWAN + Sure View Ready** |
| **`N01289-601`** | `N01289-001` | Intel Core **i5-1235U** | No (Non-vPro) | **`16 GB` LPDDR5-5200** | WLAN-Only Standard |
