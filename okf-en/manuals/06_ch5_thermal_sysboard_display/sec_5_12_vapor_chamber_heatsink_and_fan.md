---
type: Provision
title: 'Ch.5 §5.12 (Thermal Fan M90791-001 & Vapor Chamber Heatsink M90790-001 — Cross-Pattern Sequence & Thermal Paste Rule)'
description: 'Specifies removal and installation of the Thermal Fan (M90791-001) and Vapor Chamber Heatsink (M90790-001), enforcing the stamped 1-2-3-4 diagonal cross-pattern screw tightening sequence and thermal compound renewal.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 0d3de6b9efcc64ae29638949b720e258ebfe5d0699edbb9c26db4fc8b80f94ae
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/06_ch5_thermal_sysboard_display/doc.md
sequence: 54
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.12'
source_page: 54
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.12 — Thermal Fan (`M90791-001`) & Vapor Chamber Heatsink (`M90790-001`) (pp. 54–57)

## 1. Prerequisite Disassembly Chain
- `[1]` Bottom Cover (`N22918-001`, §5.4) ➔ `[2]` Battery Pack Isolation (`M90788-005`, §5.5).

## 2. Thermal Fan (`M90791-001`) Removal (Service Guide p. 54)
1. Disconnect the 4-pin PWM fan cable from the System Board ZIF/header connector.
2. Remove the **three (3) Phillips `M2.0 × 3.5 mm` screws** securing the fan housing to the Top Cover and lift the fan straight out.

## 3. Vapor Chamber Heatsink (`M90790-001`) Diagonal Sequence & Thermal Compound Rule (p. 56)
1. **Loosen Captive Screws in Reverse Stamped Order (`4 ➔ 3 ➔ 2 ➔ 1`):** Slowly loosen the four spring-loaded captive Phillips screws stamped `1`, `2`, `3`, `4` around the Intel Alder Lake-U processor coldplate.
2. **Mandatory Thermal Interface Renewal:**
   > **CAUTION:** Whenever the Vapor Chamber Heatsink (`M90790-001`) is lifted off the System Board, you **must** clean all residual thermal compound from both the copper coldplate and the dual Intel CPU/PCH silicon dies using `99%` isopropyl alcohol, and apply fresh shin-etsu / phase-change thermal compound (`0.15 g` pea-dot pattern).
3. **Diagonal Cross-Pattern Tightening (`1 ➔ 2 ➔ 3 ➔ 4` at `2.0 kgf·cm`):** During reassembly, tighten the four captive coldplate screws strictly in stamped diagonal order **`1 ➔ 2 ➔ 3 ➔ 4`** to prevent bare silicon die corner cracking and uneven contact pressure.
