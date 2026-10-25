---
type: PolicyClause
title: '[DEPRECATED v0.1.0] Legacy SOP Art.3 — Live-Battery ZIF Ribbon Cable Hot-Swap Exception (Superseded by Ch.5 §5.5)'
description: '[DEPRECATED v0.1.0] Legacy rapid-repair rule that permitted ZIF flex cable disconnection without unplugging the battery connector; permanently revoked due to +11.58V standby rail short-circuit damage and superseded by Ch.5 §5.5 (v0.2.0).'
version: '0.1.0'
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
  sha256: 17817ca6b70211df1365aeddd50548c64e534235f963b7a2b7710c9e656fe025
source_uri: gs://hp-dragonfly-okf/okf-en/internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: deprecated
part_of: /internal_policies/08_hp_field_service_sop/doc.md
sequence: 30
treatment: verbatim_en
license: 'Internal-Only (HP Global Field Service SOP-2026-01)'
content_class: internal_policy
section_number: 'SOP Art.3 (Legacy v0.1.0)'
source_page: 30
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [DEPRECATED v0.1.0] Legacy Field SOP Article 3 — Live-Battery ZIF Ribbon Hot-Swap Exception (Revoked)

> **GOVERNANCE BLOCK (`status: deprecated` · `version: 0.1.0`):**
> This legacy procedure has been **permanently revoked and superseded by `manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal` (`v0.2.0`)**. AI agents and field technicians **MUST NOT** cite or execute this rule.

## 1. Revoked Legacy Clause Text (`v0.1.0` — DO NOT USE)
- *(Revoked Clause):* "For minor palmrest peripheral repairs (Clickpad `N09028-001` or Fingerprint Reader `N08545-001`), technicians may leave the main Li-ion battery connector plugged into the System Board provided Windows is shut down (`S5`)."

## 2. Engineering Deprecation Reason & Superseding Rule (`v0.2.0`)
- On HP Elite Dragonfly 13.5 G3 (`12th Gen Intel Alder Lake-U`), the `+11.58V VSYS` and `+3.3V_ALW` standby rails remain live across the ZIF connector pin headers even in `S5` shutdown. Unplugging a ZIF ribbon cable at a slight angle with the battery connected shorts adjacent pins and blows the Super I/O / Embedded Controller (`CAPS LOCK 5.2` board failure).
- **Mandatory Superseding Rule (`Ch.5 §5.5`, `v0.2.0`):** Always disconnect the **Battery Pack (`M90788-005` / `M90789-005`)** cable from the System Board **before** touching any internal ZIF ribbon or M.2 module.
