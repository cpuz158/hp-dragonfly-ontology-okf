---
type: Provision
title: 'Ch.5 §5.7 (5G/LTE WWAN Module Removal, 4x4 MIMO Coaxial Antenna Color Mapping 5/6/7/8 & BIOS Whitelist)'
description: 'Details 5G/LTE WWAN module removal, U.FL coaxial connector vertical unseating, 4x4 MIMO antenna color-to-terminal mapping (5:Orange, 6:White, 7:Yellow, 8:Purple), and BIOS FCC whitelist rules.'
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
  sha256: 64caae656baf08ed485526c0cfe219add2d670c8fd23de23c44e51591232c2e3
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/05_ch5_base_battery_storage/doc.md
sequence: 43
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.7'
source_page: 43
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.7 — 5G/LTE WWAN Module & 4×4 MIMO Antenna Routing (pp. 43–46)

## 1. Approved WWAN Spare Parts (HP BIOS FCC Whitelist Enforced)
- **Intel® 5000 5G Solution (M.2 3052):** `N00182-005`
- **Intel® XMM™ 7560 R+ LTE-Advanced Pro (Cat 16):** `M52040-005`
- **BIOS Whitelist Rule:** Only HP spare-part-branded WWAN modules with matching PCI Subsystem Vendor/Device IDs are permitted by UEFI BIOS; generic retail M.2 modems trigger `POST Error 702 (Wireless Module Not Supported)`.

## 2. `4×4 MIMO` Coaxial Antenna Terminal Color Mapping (Service Guide p. 44)
When reconnecting the four micro-coaxial U.FL cables to the 5G WWAN module, match each numbered sleeve and jacket color to the exact PCB pad:
1. **Terminal `5` (Main TX/RX):** **Orange** coaxial cable
2. **Terminal `6` (MIMO RX1):** **White / Grey** coaxial cable
3. **Terminal `7` (MIMO RX2):** **Yellow** coaxial cable
4. **Terminal `8` (Aux / GNSS RX):** **Purple / Blue** coaxial cable

> **CAUTION:** Always use a pair of flat-tip U.FL coaxial extraction tweezers to lift antenna snaps straight up (`90°`). Pulling on the coaxial wire jacket will rip the surface-mount U.FL receptacle off the WWAN PCB.
