---
type: SourceDocument
title: '[08 Chapter Root] [Internal Field Service Policy SOP-2026-01] Field Triage Playbooks & Safety Governance (3 Clauses)'
description: '[Internal Field Service Policy SOP-2026-01] Field Triage Playbooks & Safety Governance (3 Clauses) (Source PDF: pdf_6290467_en-US-1.pdf, p.30, 55, 81, 3 clauses)'
version: '0.2.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 42efbbfacf699b6c86211ebdb3c6592ef7854c04014542b09d6565f4be5a51be
source_uri: gs://hp-dragonfly-okf/okf-en/internal_policies/08_hp_field_service_sop/doc.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /index.md
sequence: 81
treatment: normative
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: internal_policy
section_number: 'doc.md ([08] Chapter Root)'
source_page: 81
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [08] [Internal Field Service Policy SOP-2026-01] Field Triage Playbooks & Safety Governance (3 Clauses)

- **Source PDF:** `pdf_6290467_en-US-1.pdf` (HP Elite Dragonfly 13.5 G3 Maintenance and Service Guide, Doc Part `N17344-001`, Pages `p.30, 55, 81`)
- **Included Unstructured Clauses (`Provisions`):** `3` clauses

## Unstructured Context Clauses in This Chapter (`Provisions`)
* **[SOP Art.1 — SOP Art.1 (Mandatory Non-Invasive Sure Start SPI Recovery Gate Before Approving System Board M90788-601 FRU Replacement)](sop_art_001_no_boot_sure_start_before_board_swap.md)** (`p.81`): Internal field engineering policy prohibiting immediate System Board ($680 FRU) replacement on LED 3.2/2.2 no-boot tickets until (1) 15s EC Hard Reset and (2) Win+B HP Sure Start SPI recovery have been executed and logged.
* **[SOP Art.2 — SOP Art.2 (CPU 95°C Thermal Throttling & Fan Noise Triage — Intel DPTF SoftPaq & Diagonal Torque Check Before Heatsink Swap)](sop_art_002_thermal_dptf_before_heatsink_swap.md)** (`p.55`): Mandates BIOS U90 01.14.00 + Intel Dynamic Tuning (DTT) firmware update and 1-2-3-4 diagonal screw torque inspection before replacing the Vapor Chamber Heatsink (M90790-001).
* **[SOP Art.3 (Legacy v0.1.0) — [DEPRECATED v0.1.0] Legacy SOP Art.3 — Live-Battery ZIF Ribbon Cable Hot-Swap Exception (Superseded by Ch.5 §5.5)](sop_art_003_v1_deprecated_live_battery_hotswap.md)** (`p.30`): [DEPRECATED v0.1.0] Legacy rapid-repair rule that permitted ZIF flex cable disconnection without unplugging the battery connector; permanently revoked due to +11.58V standby rail short-circuit damage and superseded by Ch.5 §5.5 (v0.2.0).
