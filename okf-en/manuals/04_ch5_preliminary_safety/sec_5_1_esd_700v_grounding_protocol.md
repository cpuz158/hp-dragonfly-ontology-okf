---
type: PolicyClause
title: 'Ch.5 §5.1 (Mandatory Electrostatic Discharge ESD 700V Protection — Wrist Strap, Mat & Conductive Mylar Rule)'
description: 'Enforces mandatory ESD grounding (1 MOhm wrist strap and conductive mat) because static discharges as low as 700V degrade 12th Gen Intel SoC and soldered LPDDR5 components.'
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
  sha256: c7a08fb0544d1f615a0534b3a1c1af7072d7e4889cd9e4e245d850ac8aa397ba
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/04_ch5_preliminary_safety/doc.md
sequence: 29
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.1'
source_page: 29
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.1 — Electrostatic Discharge (ESD) Protection Protocol (pp. 29–30)

## 1. ESD Sensitivity Threshold (`700 V` Latent Failure Warning)
- **Human Perception vs. MOSFET Breakdown:** A technician cannot feel an electrostatic discharge below `3,000 V`, and cannot see a spark below `5,000 V`. However, **less than `700 V` of static electricity** can permanently rupture CMOS gate oxides on the 12th Gen Intel Alder Lake-U SoC, Thunderbolt 4 retimers, and soldered LPDDR5-5200 memory dies.

## 2. Mandatory Field Service Grounding Procedure
1. **Grounded Wrist Strap (`1 MΩ` current-limiting resistor):** Attach the ESD wrist strap directly to bare skin and clip the ground cord to an unpainted metal chassis ground or grounded field service mat **before** removing the Bottom Cover (`N22918-001`).
2. **Conductive Foam & Shielded Bags:** Transport all replacement System Boards (`M90788-601`), NVMe SSDs (`M16560-005`), and WWAN cards inside static-shielding metallized bags; place removed boards component-side up on conductive foam pads (never on plastic or paper surfaces).
3. **Conductive Black Mylar Shield Integrity:** Never discard or tear the black conductive Mylar shields covering the System Board, NVMe SSD (`N09040-001`), and memory zone; they act as both EMI Faraday cages and secondary ESD barriers.
