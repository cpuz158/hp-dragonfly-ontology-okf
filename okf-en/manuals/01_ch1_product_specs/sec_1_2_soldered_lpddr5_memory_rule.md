---
type: section
title: 'Chapter 1 Table 1-1 — Onboard Soldered LPDDR5-6400 MHz Dual-Channel Memory Rule (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1)'
description: 'Specifies that LPDDR5-6400 MHz dual-channel memory (16GB / 32GB) is permanently soldered onboard (Customer non-accessible), requiring full System Board FRU replacement upon memory failure.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=7
  kind: origin_document
  sha256: b29ff64820fb62a1fbbf6dadb5f7d43b4a9877cf3c228f29fadf2875d6dc9243
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 01_ch1_product_specs
sequence: 2
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.1 Table 1-1 (Soldered LPDDR5 Memory)'
source_page: 7
source_pages_span: 'PDF p.7–8 (Doc p.1–2)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 1 Table 1-1 — Onboard Soldered LPDDR5-6400 MHz Dual-Channel Memory Rule (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1)

## 1. Overview and Memory Subsystem Architecture

The main memory architecture of the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC is engineered as a high-frequency, low-power onboard soldered implementation (referenced from PDF p.7, Doc p.1, Table 1-1).

Key architectural specifications and service constraints documented in the official service guide include:
- **Soldered & Customer Accessibility Rule**: "Memory is soldered onboard. Customer non-accessible. Supports dual-channel memory. LPDDR5-6400 MHz, 32 GB and 16 GB".
- **Non-upgradable Design**: The system does not incorporate standard SO-DIMM memory expansion sockets. RAM chips are factory-soldered directly onto the system board, precluding post-purchase module replacement or upgrade.
- **Clock Frequency and Bus Topology**: LPDDR5-6400 MHz running in high-efficiency dual-channel configuration.
- **Supported Memory Capacities**:
  - 32 GB
  - 16 GB
  - 8 GB

---

## 2. Product Components and Memory Specifications (Table 1-1 Excerpt)

| Category | Description | Service & Maintenance Rules |
| :--- | :--- | :--- |
| **Product Name** | HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC | Document p.1 (PDF p.7) |
| **Processors** | 12th generation Intel® Core™ processors (10 cores, U-series platform)<br>- Intel Core i7-1265U (1.8 GHz, up to 4.8 GHz Turbo, 12 MB Cache)<br>- Intel Core i7-1255U (1.7 GHz, up to 4.7 GHz Turbo, 12 MB Cache)<br>- Intel Core i5-1245U (1.2 GHz, up to 4.4 GHz Turbo, 12 MB Cache)<br>- Intel Core i5-1235U (1.3 GHz, up to 4.4 GHz Turbo, 12 MB Cache) | Interfaced directly to processor memory controller |
| **Memory** | **Onboard, non upgradable memory supporting up to 32 GB of RAM**<br>- **LPDDR5-6400, supports dual channel memory**<br>- Supported configurations: 32 GB, 16 GB, 8 GB | Customer non-accessible. Not field-upgradable individually |
| **Primary Storage** | M.2 2280 PCIe NVMe SSDs (256 GB to 2 TB TLC/SED options) | Removable and field-replaceable (PDF p.8, Doc p.2) |
| **Wireless LAN** | Intel AX211 Wi-Fi 6E + Bluetooth 5.2 (including vPro options) | Onboard, not removable |

---

## 3. System Board Spare Part Numbers Linked to Memory Capacity

Because the LPDDR5 memory chips are surface-mounted directly to the printed circuit board, any memory diagnostic failure or required configuration change necessitates the replacement of the complete system board assembly. Associated spare part numbers in the ontology include:

- **System Board Assembly with 32 GB LPDDR5**:
  - Primary Spare Part Number: `N20728-601`
  - Cross-Reference / Associated Parts: `N19201-601`, `M90788-601`
- **System Board Assembly with 16 GB LPDDR5**:
  - Primary Spare Part Number: `N20727-601`
  - Cross-Reference / Associated Parts: `N19202-601`

> **Service Advisory**: Individual desoldering and resoldering of memory ICs is strictly prohibited in authorized HP servicing. The Field Replaceable Unit (FRU) boundary is governed entirely at the system board level.
