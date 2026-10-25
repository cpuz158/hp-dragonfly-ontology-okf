---
type: section
title: '[DEPRECATED v0.1.0] Legacy SOP Article 3 — Live-Battery ZIF Hot-Swap & Thermal Paste Reuse Exception (Superseded by Ch.4 PDF p.32 & Ch.5 PDF pp. 48, 54)'
description: 'Deprecated legacy draft (`v0.1.0`, `status: deprecated`, `stale_after: 2025-12-31`) that permitted live-battery ZIF hot-swapping and syringe paste reuse. Permanently superseded by Chapter 4 ESD/Power-Off rules (PDF p.32), Chapter 5 Battery Isolation (PDF p.48), and Chapter 5 Heat Sink Thermal Material Renewal (PDF p.54), and blocked by the Dataplex KC `before_tool_callback` gate.'
version: '0.1.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=32
  kind: origin_document
  sha256: b7b5612073ef2e7b9ef372686fff105a695640b1fee745a4d2654fbcdf98c76c
source_uri: gs://hp-dragonfly-okf/okf-en/internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: deprecated
part_of: 08_internal_field_sop_playbooks
sequence: 26
treatment: deprecated_archive
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: '[DEPRECATED v0.1.0] Legacy SOP Art.3 (Superseded by Ch.4 ESD & Ch.5 Battery/Heat Sink Rules)'
source_page: 32
source_pages_span: 'PDF p.32, 48, 54 (Doc p.26, 42, 48)'
verified:
- by: governance_board:revoked_2025_12
  at: '2026-10-25T10:02:00Z'
  method: deprecation_audit
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [DEPRECATED v0.1.0] Legacy SOP Article 3 — Live-Battery ZIF Hot-Swap & Thermal Paste Reuse Exception (Superseded by Ch.4 PDF p.32 & Ch.5 PDF pp. 48, 54)

## Governance Metadata
- **Status**: `deprecated`
- **Policy Gate**: `BLOCKED_DEPRECATED`
- **Authoritative Source**: HP Dragonfly Folio 13.5" G3 Maintenance and Service Guide (Chapter 4, PDF p.32 / Doc p.26; Chapter 5, PDF pp. 48, 54)

---

## Deprecation Notice & Risk Assessment
The legacy field exception allowing hot-swapping of ZIF/FPC connectors without disconnecting the internal battery and reusing thermal paste during heat sink servicing is completely revoked.

Critical risks of non-compliance include:
- **Electrical Short Circuits**: Servicing internal components while the battery remains attached presents an immediate danger of shorting internal power rails and destroying microcircuitry.
- **Electrostatic Discharge (ESD) Damage**: As detailed in Chapter 4 (PDF p.32, Doc p.26), voltages as low as 700 V can silently alter integrated circuit parameters or degrade internal junction layers, leading to premature failure.
- **Thermal Degradation**: Reusing thermal paste introduces air gaps and voids, drastically compromising cooling efficiency and risking thermal throttling or system shutdown.

---

## Official Grounding and Handling Requirements
Per the official maintenance instructions (PDF pp. 32–33, Doc pp. 26–27), all service personnel must adhere to standard safety protocols:

1. **Pre-Service Shutdown & Power Disconnection**:
   - Fully shut down the unit through the operating system before handling internal drives or components.
   - Ensure the battery is physically disconnected before servicing any internal ribbon cable or board.
2. **Personal Grounding**:
   - Use ESD-protective wrist straps with 1 MΩ ±10% resistance securely fastened against bare skin.
   - Avoid contacting pins, circuit traces, or exposed leads.
3. **Component Protection**:
   - Store sensitive modules in electrostatic-shielded containers until immediately prior to installation.
   - Handle mechanical and solid-state drives on surfaces protected by at least 2.54 cm (1 inch) of shock-proof material.

### Electrostatic Voltage Reference by Activity and Humidity

| Event | 55% Humidity | 40% Humidity | 10% Humidity |
| :--- | :--- | :--- | :--- |
| Walking across carpet | 7,500 V | 15,000 V | 35,000 V |
| Walking across vinyl floor | 3,000 V | 5,000 V | 12,000 V |
| Bench worker movement | 400 V | 800 V | 6,000 V |
| Removing parts from packaging | 400 V | 700 V | 2,000 V |
