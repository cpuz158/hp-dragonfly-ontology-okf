---
type: PolicyClause
title: 'Ch.5 §5.5 (Battery Pack M90788-005 Removal — Mandatory First-Step Power Isolation Before Any ZIF/FRU Work)'
description: 'Mandatory Step 1 power isolation rule: immediately after Bottom Cover removal, the battery cable (M90788-005 / M90789-005) must be disconnected before touching any ZIF cable or M.2 card.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 3bbcf70f504cb28653cd9f41e6e64afd0e066fcab65131930487e0a49ba863bc
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/05_ch5_base_battery_storage/doc.md
sequence: 38
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.5'
source_page: 38
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.5 — Battery Pack (`M90788-005` / `M90789-005`) Isolation & Removal (pp. 38–40)

## 1. Spare Part Numbers & Prerequisite Rule
- **6-Cell `68 Wh` Li-ion Polymer Battery:** `M90788-005` (`11.58 V`, `4.42 Ah`)
- **4-Cell `45 Wh` Li-ion Polymer Battery:** `M90789-005` (`7.72 V`, `3.92 Ah`)
- **Prerequisites:** `[1]` Bottom Cover (`N22918-001`, Ch.5 §5.4).

## 2. Mandatory Electrical Isolation Rule (Supersedes Legacy SOP Art.2 v0.1.0)
> **CAUTION — LIVE `+11.58V VSYS` RAIL:** The `+11.58V` battery main power rail remains energized even when the notebook is powered off (`S5`). **You MUST disconnect the battery cable from the System Board before disconnecting any ZIF flex cable (Clickpad, Keyboard, Fingerprint, eDP Display) or removing the NVMe SSD / WWAN modules.**

## 3. Removal Procedure (Service Guide p. 39)
1. **Peel Back Protective Mylar Flap:** Gently lift the black adhesive Mylar flap covering the battery-to-system-board connector.
2. **Disconnect Battery Connector:** Using two fingernails or a flat plastic tool, pull the battery connector plug horizontally toward the front of the chassis to unseat it from the System Board header.
3. **Remove 4 Phillips P1 Screws:** Remove the **four (4) Phillips `M2.0 × 4.0 mm` screws** securing the battery frame to the Top Cover, then lift the rear edge of the battery up at a `25°` angle and slide the front tabs out.
