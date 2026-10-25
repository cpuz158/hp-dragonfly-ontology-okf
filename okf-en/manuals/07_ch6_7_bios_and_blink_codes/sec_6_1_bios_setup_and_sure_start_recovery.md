---
type: Provision
title: 'Ch.6 §6.1 (HP Computer Setup F10, HP Sure Start Gen7 Dual-Flash SPI Recovery Win+B & Anti-Rollback Policy)'
description: 'Defines HP Computer Setup (F10), HP Sure Start Gen7 hardware-enforced dual-flash SPI recovery (32MB Main + 16MB Isolated Golden Copy), Win+B key-chord recovery, and anti-rollback SVN protection.'
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
  sha256: ef49192b462f8d7c36f0f8283432d197867826808f48074f09293241c35f8d1c
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/07_ch6_7_bios_and_blink_codes/doc.md
sequence: 73
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.6 §6.1'
source_page: 73
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 6 §6.1 — Computer Setup (BIOS), TPM 2.0 & HP Sure Start Gen7 Recovery (pp. 73–78)

## 1. HP Sure Start Gen7 Dual-Flash SPI Architecture (`U4201` + `U4202`)
- **Primary System SPI Flash (`32 MB`):** Stores the active UEFI BIOS image (`U90` family), Intel Management Engine (ME) firmware, and NVRAM variables.
- **Sure Start Private SPI Flash (`16 MB` Hardware-Isolated):** Monitored by the dedicated **HP Endpoint Security Controller (ESC)**. Contains the cryptographically signed golden BIOS image, Intel CPU microcode, and DMI/TPM identity keys.

## 2. Emergency Key-Chord BIOS Crisis Recovery (`Win + B` Procedure, p. 76)
When a firmware update is interrupted or the unit exhibits a black screen with `CAPS LOCK` blinking (`2.2` or `3.2`):
1. Connect the `65W` USB-C AC adapter to a Thunderbolt 4 port and ensure the unit is powered off.
2. Press and hold **`Windows Key + B`** simultaneously, then press and hold the **Power button for `2 to 3 seconds`**.
3. Release the Power button while continuing to hold **`Windows + B` for `10 seconds`** until the display backlight activates or the `CAPS LOCK` LED begins rapid flashing (`60–90 seconds` SPI re-flash cycle).

## 3. Anti-Rollback Minimum Security Version (`SVN`) Policy
- BIOS releases marked as **Security Critical** increment the hardware fuse **Minimum SVN** inside the Endpoint Security Controller. Downgrading to an older BIOS version below the active SVN is permanently blocked by hardware.
