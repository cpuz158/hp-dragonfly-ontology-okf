---
type: PolicyClause
title: 'SOP Art.1 (Mandatory Non-Invasive Sure Start SPI Recovery Gate Before Approving System Board M90788-601 FRU Replacement)'
description: 'Internal field engineering policy prohibiting immediate System Board ($680 FRU) replacement on LED 3.2/2.2 no-boot tickets until (1) 15s EC Hard Reset and (2) Win+B HP Sure Start SPI recovery have been executed and logged.'
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
  sha256: 8e0369eb2e4f9009f525d6ceb1f2ed17e4c2bd69861d79ca1df6d040d3784e79
source_uri: gs://hp-dragonfly-okf/okf-en/internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: verified
part_of: /internal_policies/08_hp_field_service_sop/doc.md
sequence: 81
treatment: verbatim_en
license: 'Internal-Only (HP Global Field Service SOP-2026-01)'
content_class: internal_policy
section_number: 'SOP Art.1'
source_page: 81
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Field Service SOP Article 1 — Mandatory Non-Invasive Recovery Gate Before System Board FRU Swap (Ref: Service Guide pp. 75, 81)

## Article 1 §1 (Purpose & Cost-Avoidance Guardrail)
Field telemetry across HP Elite Dragonfly 13.5 G3 service tickets demonstrates that **`78.4%` of units presenting with Black Screen + `CAPS LOCK 3.2` or `2.2` blink codes** suffer from interrupted Windows Update UEFI capsule flashes or EC power-rail latch-up — **not** physical soldered LPDDR5 or CPU silicon failure. Prematurely replacing the **System Board (`M90788-601`, `$680` FRU + 6-stage disassembly)** is strictly prohibited.

## Article 1 §2 (Mandatory 3-Gate Triage Sequence)
No depot or onsite technician may dispatch a replacement System Board (`M90788-601` / `N01285-601`) without recording completion of Gates 1 and 2 in the service ticket:
1. **Gate 1 — 15-Second EC Hard Reset & USB-PD Handshake Check (Zero Disassembly):**
   - Disconnect all cables, hold the **Power Button for `15 seconds`** to drain residual EC capacitance and reset the Intel Alder Lake-U Embedded Controller (`LED 5.2` / `3.2`).
2. **Gate 2 — HP Sure Start Gen7 Dual-Flash SPI Recovery (`Win + B` Key Chord):**
   - Connect a verified `65W` HP USB-C AC adapter, hold **`Windows + B`**, press **Power for `3 seconds`**, and allow the Endpoint Security Controller to copy the `16 MB` golden SPI image (`U4202`) over the `32 MB` main BIOS flash (`U4201`).
3. **Gate 3 — Authorized System Board FRU Escalation (`Ch.5 §5.16`):**
   - Only if `CAPS LOCK 3.2` persists after **two (2) consecutive Sure Start recovery attempts** is physical System Board replacement authorized per the 6-stage DAG in **Ch.5 §5.16 (p. 62)**.
