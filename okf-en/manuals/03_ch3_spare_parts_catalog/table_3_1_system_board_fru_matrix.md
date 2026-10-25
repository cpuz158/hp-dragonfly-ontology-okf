---
type: section
title: 'Chapter 3 [Table 3-1 Item 8] — System Board Spare Part Matrix by CPU & Soldered LPDDR5 Memory (16GB vs. 32GB) (PDF p.23–24 · Doc p.17–18)'
description: 'Details Table 3-1 Item (8) System Board spare part numbers (PDF pp. 23–24 / Doc pp. 17–18): N20728-601 (i7-1265U + 32GB), N20727-601 (i7-1265U + 16GB), N20726-601 (i7-1255U + 32GB), N20725-601 (i7-1255U + 16GB), N20724-601 (i5-1245U + 16GB), and N22935-601 (i5-1235U + 16GB).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 03_ch3_spare_parts_catalog
- structured_table
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=23
  kind: origin_document
  sha256: 056ed3ac2b1f54b0a9a6bb6a6c600ae32ce2809667941633ddd55fe5760ec788
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 03_ch3_spare_parts
sequence: 9
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.3 Table 3-1 Item (8) (System Board FRU Matrix)'
source_page: 23
source_pages_span: 'PDF p.23–24 (Doc p.17–18)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 3 [Table 3-1 Item 8] — System Board Spare Part Matrix by CPU & Soldered LPDDR5 Memory (16GB vs. 32GB) (PDF p.23–24 · Doc p.17–18)

## Overview & Engineering Guidelines

The system board of the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC features an integrated architecture where the Intel 12th Generation Core processor and soldered onboard LPDDR5 memory are permanently mounted to the printed circuit board. Memory capacity upgrades or processor replacements cannot be performed modularly and require replacing the entire system board assembly.

System board spare part numbers are categorized by operating system licensing via part suffixes:
- **`xxxxxx-001`**: Models with non-Windows operating systems (e.g., FreeDOS / Linux)
- **`xxxxxx-601`**: Models with Windows operating system Digital Product Key (DPK)

---

## Table 3-1 System Board Spare Part Matrix

System boards are differentiated by manageability features (vPro vs. non-vPro), processor model, and soldered LPDDR5 memory capacity (PDF p.23–24, Doc p.17–18).

### 1. Models with Integrated vPro WLAN

| Processor | Soldered System Memory | OSR Variant | Base Spare Part Number | Windows DPK Spare Part Number | Ontology SKU Linkage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Intel Core i7-1265U** | **32 GB LPDDR5** | Standard | `N20728-xxx` | `N20728-601` | `SKU-DFG3-I732-5G` |
| **Intel Core i7-1265U** | **16 GB LPDDR5** | Standard | `N20727-xxx` | `N20727-601` | `SKU-DFG3-I716-WIFI` |
| **Intel Core i7-1265U** | **16 GB LPDDR5** | OSR (One-Time Service Replacement) | `N20726-xxx` | `N20726-601` | - |
| **Intel Core i5-1245U** | **16 GB LPDDR5** | Standard | `N20723-xxx` | `N20723-601` | - |
| **Intel Core i5-1245U** | **16 GB LPDDR5** | OSR (One-Time Service Replacement) | `N20722-xxx` | `N20722-601` | - |

### 2. Models with Integrated Non-vPro WLAN

| Processor | Soldered System Memory | Base Spare Part Number | Windows DPK Spare Part Number | Ontology SKU Linkage |
| :--- | :--- | :--- | :--- | :--- |
| **Intel Core i7-1255U** | **32 GB LPDDR5** | `N20725-xxx` | `N20725-601` | `SKU-DFG3-I732-5G` (Alternate) |
| **Intel Core i7-1255U** | **16 GB LPDDR5** | `N20724-xxx` | `N20724-601` | `SKU-DFG3-I716-WIFI` |
| **Intel Core i5-1235U** | **16 GB LPDDR5** | `N20720-xxx` | `N20720-601` | - |
| **Intel Core i5-1235U** | **8 GB LPDDR5** | `N20721-xxx` | `N20721-601` | - |

---

## Form Factor & Ontology Cross-References (Folio G3 vs. G3 Clamshell)

According to the official Maintenance and Service Guide (N17344-001) and family architecture mappings:

- **HP Dragonfly Folio 13.5 inch G3 (2-in-1)**:
  - Flagship vPro 32GB Board: `N20728-601` (mapped to `SKU-DFG3-I732-5G`)
  - Mainstream 16GB Boards: `N20727-601`, `N20724-601` (mapped to `SKU-DFG3-I716-WIFI`)
  - Alternate/derivative board FRU: `N22935-601`
  - Primary Battery: 4-cell, 53 Whr (Spare Part `M90788-005`)

- **HP Elite Dragonfly G3 (Clamshell)**:
  - Clamshell System Board FRUs: `N19201-601`, `N19202-601`, `M90788-601`
  - Cross-referenced in the ontology studio against equivalent functional hardware profiles (`SKU-DFG3-I732-5G` and `SKU-DFG3-I716-WIFI`) for inventory tracking and warranty validation.

---

## Service & Replacement Considerations

1. **Thermal Grease & Heat Sink Assembly**:
   - Whenever replacing the system board, remove the heat sink and fan assembly (`N22936-001`). Clean residual thermal paste completely from mating surfaces and reapply thermal grease uniformly prior to reassembly.
2. **Associated Subcomponents via Cable Kit (`N22929-001`)**:
   - Disconnect and inspect flex cables connecting to the system board, including the Touchpad cable, SIM board cable (`N22940-001` for WWAN, `N22941-001` for WLAN), Transfer board (`N22942-001`), and Wireless charging module (`N26149-001`).
3. **Post-Replacement Provisioning**:
   - Confirm the correct operating system board suffix (`-601` for Windows license injection) and commit system serial number, SKU number, and system tracking data via HP internal configuration utilities.
