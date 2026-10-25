---
type: PolicyClause
title: 'Ch.5 §5.3 (Swollen Li-ion Polymer Battery Handling & Thermal Runaway Prevention Rule)'
description: 'Strict safety policy governing swollen 6-cell 68Wh (M90788-005) and 4-cell 45Wh (M90789-005) Li-ion pouch batteries to prevent puncture and thermal runaway.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 04_ch5_preliminary_safety
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: edb136ca5beacc93b5aca7a6b6bfa1f68434ffac21400938a8bfc9398ba1f822
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/04_ch5_preliminary_safety/doc.md
sequence: 33
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.3'
source_page: 33
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.3 — Swollen Li-ion Polymer Battery Safety & Containment Rule (pp. 33–34)

## 1. Warning Indicators of Pouch Cell Swelling
- Upward bowing or loss of click tactile travel on the **Glass Clickpad (`N09028-001`)**.
- Visible gap along the front palmrest seam or rocking of the **Bottom Cover (`N22918-001`)** on a flat bench.

## 2. Mandatory Safety Prohibitions (Thermal Runaway Prevention)
> **WARNING!** Crushing, puncturing, or bending a swollen lithium-ion polymer pouch cell (`M90788-005` / `M90789-005`) can cause an internal short circuit, violent **thermal runaway (`> 600 °C`)**, toxic HF gas venting, and fire.

1. **Do NOT Apply Downward Pressure:** Never force the Bottom Cover closed over a swollen battery.
2. **Do NOT Puncture to "Vent" Gas:** Never prick or slice the foil pouch of a swollen cell.
3. **Captive Screw Release Precautions:** Wear safety glasses and heat-resistant gloves when backing out the 5 Bottom Cover Torx T5 screws, as upward spring tension from the swollen cell may cause the cover to pop open suddenly.
4. **Approved HazMat Containment:** Place removed swollen batteries immediately into a UL-approved fireproof vermiculite / Li-ion battery containment drum (`Class 9 Hazardous Material` shipping rules apply; never ship via air freight).
