---
type: PolicyClause
title: 'Ch.1 §1.2 (Soldered On-Board LPDDR5-5200 Memory Architecture — Non-Upgradeable System Board Coupling Rule)'
description: 'Mandates that system memory (16GB or 32GB LPDDR5-5200) is permanently soldered onto the system board with zero SO-DIMM slots; memory capacity changes or repairs require full System Board FRU replacement per Table 3-1.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 7fb81dd66b3a22f29169d92e1619a3ac82ebfec68523fd4479b3b1054ca5e53f
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/01_ch1_product_specs/doc.md
sequence: 2
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.1 §1.2'
source_page: 2
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 1 §1.2 — System Memory Architecture & Non-Upgradeable Coupling Rule (p. 2)

## 1. Verbatim Specification (Service Guide p. 2)
- **Memory Standard:** **LPDDR5-5200 MHz** dual-channel high-speed low-power memory (`4800 MHz` effective operation depending on processor stepping).
- **Supported Capacities:** `16 GB` (`2 × 8 GB` dual-channel) or `32 GB` (`2 × 16 GB` dual-channel).
- **Physical Packaging (Mandatory Caveat):**
  > **IMPORTANT:** System memory is **soldered directly onto the system board (On-Board)** and is **not customer-accessible or field-upgradeable**. No SO-DIMM expansion slots exist inside the chassis.

## 2. Field Service Engineering Consequence
1. **No Standalone RAM Replacement:** Memory bit errors (`CAPS LOCK 3.2` / `NUM LOCK 2` blink code) that persist after HP Sure Start SPI BIOS recovery cannot be resolved by swapping DIMM modules.
2. **Exact System Board FRU Coupling:** Field engineers must select the exact System Board spare part number from **Table 3-1 (p. 19)** matching the customer's **CPU + Intel vPro status + RAM capacity (`16 GB` vs `32 GB`) + 5G WWAN support** (e.g., `M90788-601` for `i7-1265U vPro + 32GB + WWAN`).
