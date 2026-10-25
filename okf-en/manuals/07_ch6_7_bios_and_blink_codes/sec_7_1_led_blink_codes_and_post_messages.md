---
type: Table
title: 'Ch.7 §7.1 [Tables 7-1 & 7-2] (CAPS/NUM LOCK LED Blink Codes 3.2/2.2/5.2 & POST Error Codes 90B/601/502 Matrix)'
description: 'Reference table mapping CAPS LOCK (long) and NUM LOCK (short) LED blink patterns (2.2, 3.2, 3.3, 3.4, 5.2) and POST numeric error codes (90B, 601, 502) to root causes and actions.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- structured_table
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: f8e71284c58ecbf05d40481f30b3eefeda092a7f1a9be77af9310edcf5461f83
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/07_ch6_7_bios_and_blink_codes/doc.md
sequence: 79
treatment: structured_table
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.7 §7.1'
source_page: 79
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 7 §7.1 — POST Error Messages & LED Blink Code Reference (pp. 79–82)

## 1. Table 7-2: `CAPS LOCK` (Long Blink) / `NUM LOCK` (Short Blink) Diagnostic Codes (p. 81)

| Blink Code (`Long.Short`) | Caps Lock (Long Red/White) | Num Lock (Short White) | Subsystem Fault Condition | Mandatory First-Line Action (Before FRU Swap) |
| :---: | :---: | :---: | :--- | :--- |
| **`2.2`** | 2 Long Blinks | 2 Short Blinks | **Main System BIOS SPI Image Corrupted** | Execute **HP Sure Start (`Win + B`)** crisis recovery (`60–90s`); do **not** replace board first |
| **`3.2`** | 3 Long Blinks | 2 Short Blinks | **Pre-Video Memory / SPI Training Timeout** | Perform Hard EC Reset (`Power 15s`) + **`Win + B` Sure Start**; replace System Board (`M90788-601`) only if failure persists after 2 recovery cycles |
| **`3.3`** | 3 Long Blinks | 3 Short Blinks | **Embedded Graphics / eDP Display Init Fault** | Reseat eDP cable (`N09038-001`) at System Board; test external HDMI 2.0b output |
| **`3.4`** | 3 Long Blinks | 4 Short Blinks | **USB-C Power Delivery / VRM Rail Fault** | Disconnect non-HP charger; test with known-good `65W` HP USB-C AC adapter on both TB4 ports |
| **`5.2`** | 5 Long Blinks | 2 Short Blinks | **Embedded Controller (EC) / Endpoint Security Fault** | Perform AC + Battery hard disconnect (`§5.5`) for `60s` to clear EC latch |

## 2. Table 7-1: Numeric POST Boot Error Messages (pp. 79–80)
- **`POST 90B` (System Fan 90B Alert):** Cooling fan (`M90791-001`) RPM below minimum threshold or stalled. Inspect fan vents, verify 4-pin fan header, and update EC/BIOS (`U90 Ver. 01.14.00`); if rotor fails UEFI Fan Test, replace fan (`M90791-001`).
- **`POST 601` (Primary Battery 601 Alert):** Battery pack (`M90788-005` / `M90789-005`) full-charge capacity degraded below `25%` of design capacity or cell imbalance detected.
- **`POST 502` (CMOS Checksum Invalid):** Real-Time Clock (RTC) / CMOS NVRAM reset after main battery depletion; press `Enter` to load factory defaults.
