---
type: Reference
title: POST LED Blink Codes and UEFI Hardware Diagnostic Reference
description: Interpretation of Power/Battery LED indicators, Caps Lock/Num Lock blink patterns (2.2, 3.2,
  5.2), and 24-digit UEFI Failure IDs from Chapter 7 of N17344-001.
tags:
- diagnostics
- post
- led-blink-codes
- uefi
- triage
generated:
  by: enrichment_agent/gemini-2.5-pro
  at: '2026-10-25T02:50:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T02:52:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: hp-msg-n17344
  resource: docs/pdf_6290467_en-US-1.pdf
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# POST LED Blink Code Matrix

When the notebook fails to complete Power-On Self-Test (POST) prior to initializing video output, the Caps Lock LED flashes a two-part sequence (long flashes = major category, short flashes = minor subcode)[^hp-msg-n17344]:

| Diagnostic Code | Blink Pattern | Subsystem | Root Cause & Required Action |
| :--- | :--- | :--- | :--- |
| `LED-BLINK-2.2` | 2 Long, 2 Short (Red/White) | System BIOS Flash | Main BIOS image corrupted (`sp148210`). Connect AC power and allow **HP Sure Start** (8 MB isolated flash) to restore the Golden BIOS image, or press `Win+B` + `Power`. See [no-boot-bios-sure-start-recovery](../playbooks/no-boot-bios-sure-start-recovery.md). |
| `LED-BLINK-3.2` | 3 Long, 2 Short | Memory (`LPDDR5-6400`) | Pre-video memory initialization failure. Because LPDDR5 memory is soldered, replace the SKU-matched System Board from [hardware_components_catalog](../tables/hardware_components_catalog.md). |
| `LED-BLINK-5.2` | 5 Long, 2 Short | Embedded Controller (EC) | EC firmware failure or board power rail short. Perform a 15-second hard EC reset; if persistent, replace the System Board. |
| `LED-PWR-BLINK-WHITE` | Continuous White Blink (Power LED) | ACPI Modern Standby (`S0ix`) | System is in Modern Standby. If accompanied by chassis heat inside a bag, update BIOS (`sp148210`) to disable network-triggered wake in battery mode. |

Linked structured concepts:
- [diagnostic_codes_reference](../tables/diagnostic_codes_reference.md)
- [community_troubleshooting_cases](../tables/community_troubleshooting_cases.md)
- [firmware_bios_and_nvm](../tables/firmware_bios_and_nvm.md)

[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide, Chapter 7 (pp. 77–84)
