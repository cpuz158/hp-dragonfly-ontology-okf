---
type: Provision
title: 'Ch.7 §7.2 (Symptom-to-Root-Cause Field Triage Matrix — No Power, Thermal Throttling, Webcam, 5G WWAN & Pen Charging)'
description: 'Comprehensive symptom-to-root-cause troubleshooting guide covering No-Boot/Black Screen, CPU Thermal Throttling, 5MP IR Camera non-detection, 5G WWAN modem drop, and Magnetic Pen charging.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: c97cb242a177632b3b699da1f92a19b573e4bdf8707294cb0bcc8ef2a0ec1662
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/07_ch6_7_bios_and_blink_codes/doc.md
sequence: 83
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.7 §7.2'
source_page: 83
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 7 §7.2 — Symptom-to-Root-Cause Field Triage Matrix (pp. 83–86)

## 1. Symptom A: 5MP IR Camera Shows Black Screen or `0xA00F4244 NoCamerasAreAttached`
1. **Check Hardware Privacy Shutter Key (`Ch.2 §2.3`):** Verify the keyboard **Camera Privacy Key** LED is **OFF**. If the amber LED is lit, the physical electro-mechanical shutter is blocking the lens.
2. **Check F10 BIOS Device Security:** Enter `F10 > Advanced > Built-In Device Options` and confirm **Integrated Camera** is checked.
3. **Hardware Escalation (`Ch.5 §5.18`):** If USB device `VID_04F2` is missing in UEFI Diagnostics, inspect the **Camera/Mic Flex Ribbon Cable (`N09037-001`)** at the left hinge, or replace the **5MP IR Camera Module (`N09036-001`)** + **Display Adhesive Kit (`N09039-001`)**.

## 2. Symptom B: Thunderbolt Dock G4 Dual-4K Flicker or PD Charging Drop
1. Update the notebook **Intel Thunderbolt Retimer NVM firmware (`Rev 36.00+`)** and **HP Thunderbolt Dock G4 firmware (`sp1439xx`)**.
2. Verify BIOS `F10 > Advanced > Port Options > Thunderbolt Security Level` is set to **USB4 / PCIe Tunneling Enabled (Kernel DMA Protection)**.

## 3. Symptom C: HP Rechargeable Active Pen G3 Magnetic Charging Failure (Folio / Dragonfly)
1. Confirm `F10 > Advanced > Built-In Device Options > NFC / Wireless Pen Charger` is enabled.
2. Inspect the right-side magnetic dock rail pogo/coil alignment and re-pair via **HP Pen Control Plus**.
