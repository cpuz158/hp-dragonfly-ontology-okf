---
type: SourceDocument
title: '[04 Chapter Root] Chapter 5 Sec.1: Preliminary Disassembly Safety, ESD 700V & Swollen Battery Rules (pp. 29–34)'
description: 'Chapter 5 Sec.1: Preliminary Disassembly Safety, ESD 700V & Swollen Battery Rules (pp. 29–34) (Source PDF: pdf_6290467_en-US-1.pdf, p.29~34 (전 6쪽), 3 clauses)'
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
  sha256: 40c5e92933b5273e3580a9b0bbc918714c33d6502990f277525f9a758f292660
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/04_ch5_preliminary_safety/doc.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /index.md
sequence: 29
treatment: normative
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'doc.md ([04] Chapter Root)'
source_page: 29
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [04] Chapter 5 Sec.1: Preliminary Disassembly Safety, ESD 700V & Swollen Battery Rules (pp. 29–34)

- **Source PDF:** `pdf_6290467_en-US-1.pdf` (HP Elite Dragonfly 13.5 G3 Maintenance and Service Guide, Doc Part `N17344-001`, Pages `p.29~34 (전 6쪽)`)
- **Included Unstructured Clauses (`Provisions`):** `3` clauses

## Unstructured Context Clauses in This Chapter (`Provisions`)
* **[Ch.5 §5.1 — Ch.5 §5.1 (Mandatory Electrostatic Discharge ESD 700V Protection — Wrist Strap, Mat & Conductive Mylar Rule)](sec_5_1_esd_700v_grounding_protocol.md)** (`p.29`): Enforces mandatory ESD grounding (1 MOhm wrist strap and conductive mat) because static discharges as low as 700V degrade 12th Gen Intel SoC and soldered LPDDR5 components.
* **[Ch.5 §5.2 — Ch.5 §5.2 (Pre-Disassembly Mandatory Sequence & Required Tooling — Torx T5, Phillips #0/#1, Non-Magnetic Pry Tool)](sec_5_2_pre_disassembly_and_tooling_rules.md)** (`p.31`): Defines the mandatory pre-disassembly shutdown checklist, peripheral removal, and approved non-magnetic tooling to prevent magnesium chassis gouging.
* **[Ch.5 §5.3 — Ch.5 §5.3 (Swollen Li-ion Polymer Battery Handling & Thermal Runaway Prevention Rule)](sec_5_3_swollen_battery_safety_rule.md)** (`p.33`): Strict safety policy governing swollen 6-cell 68Wh (M90788-005) and 4-cell 45Wh (M90789-005) Li-ion pouch batteries to prevent puncture and thermal runaway.
