---
type: PolicyClause
title: 'SOP Art.2 (CPU 95°C Thermal Throttling & Fan Noise Triage — Intel DPTF SoftPaq & Diagonal Torque Check Before Heatsink Swap)'
description: 'Mandates BIOS U90 01.14.00 + Intel Dynamic Tuning (DTT) firmware update and 1-2-3-4 diagonal screw torque inspection before replacing the Vapor Chamber Heatsink (M90790-001).'
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
  sha256: e76ad28eb5164fe21be69587599f48fa2114b17c53d122c44fbc084286152e26
source_uri: gs://hp-dragonfly-okf/okf-en/internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: verified
part_of: /internal_policies/08_hp_field_service_sop/doc.md
sequence: 55
treatment: verbatim_en
license: 'Internal-Only (HP Global Field Service SOP-2026-01)'
content_class: internal_policy
section_number: 'SOP Art.2'
source_page: 55
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Field Service SOP Article 2 — Thermal Throttling (`PROCHOT#`) Software-First Triage Rule (Ref: Service Guide pp. 54–57)

## Article 2 §1 (Software & EC Fan Table Calibration First)
When an HP Elite Dragonfly 13.5 G3 reports sustained CPU package temperatures above `95 °C`, fan whine, or processor throttling to `400 MHz` during Thunderbolt 4 docking + video conferencing:
1. **Step 1 (Non-Invasive Firmware Patch):** Apply **HP System BIOS `U90 Ver. 01.14.00+`** and **Intel Dynamic Tuning Technology (DTT / IPF) Driver (`SoftPaq sp144xxx`)** to recalibrate PL1/PL2 power limits and EC fan ramp curves.
2. **Step 2 (UEFI Thermal & Fan Diagnostic):** Run `F2 HP PC Hardware Diagnostics UEFI > Component Tests > System Board > Thermal & Fan Test`.

## Article 2 §2 (Physical Coldplate & Thermal Paste Remediation)
If `POST 90B` or `> 95 °C` core delta (`> 15 °C` between P-cores) persists after Step 1:
- Follow **Ch.5 §5.12 (p. 54)**: Disconnect Battery (`§5.5`), clean hardened thermal paste, apply fresh phase-change compound, and torque the **Vapor Chamber Heatsink (`M90790-001`)** screws strictly in **`1 ➔ 2 ➔ 3 ➔ 4` diagonal sequence (`2.0 kgf·cm`)**.
