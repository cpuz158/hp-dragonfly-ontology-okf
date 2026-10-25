---
type: Provision
title: 'Ch.2 §2.1 (Right & Left Side I/O Ports — Dual Thunderbolt 4 USB4 40Gbps, USB-A, HDMI 2.0b & Nano-SIM)'
description: 'Defines the physical layout and electrical capabilities of right/left side ports: two Thunderbolt 4 USB4 Type-C ports (40Gbps, USB-PD 3.0 65W/100W, DP 1.4a), SuperSpeed USB-A, HDMI 2.0b, and Nano-SIM tray.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 02_ch2_external_components
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 599b108d003b53ebb9d4b3c318638a058ac9f54409ead57050e224f930a46a82
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/02_ch2_external_components/sec_2_1_thunderbolt_and_io_ports.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 5
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.2 §2.1'
source_page: 5
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 2 §2.1 — Right-Side and Left-Side External I/O Components (pp. 5–6)

## 1. Right-Side Components (Service Guide p. 5)
1. **Audio-out (headphone) / Audio-in (microphone) combo jack (`3.5 mm`):** Supports CTIA-standard 4-conductor stereo headsets.
2. **SuperSpeed USB Type-A `5 Gbps` signaling rate port (with HP Sleep and Charge):** Delivers `5V / 1.5A` charging even when the notebook is in Modern Standby (`S0ix`) or powered off.
3. **Nano Security Lock Slot:** Compatible with nano-profile physical security cable locks.
4. **USB Type-C® power connector & Thunderbolt™ 4 port #1 (Right):** Supports USB4 `40 Gbps`, USB Power Delivery 3.0 (`65W` standard / `100W` fast charge), and **DisplayPort™ 1.4a** (`DSC 1.2`) output.
5. **Battery / AC Adapter Light:**
   - **Solid White:** AC adapter connected and battery charged (`> 90%`).
   - **Solid Amber:** AC adapter connected and battery charging.
   - **Blinking Amber (8 blinks):** Battery authentication or cell failure (`POST 601`).

## 2. Left-Side Components (Service Guide p. 6)
1. **HDMI® 2.0b Port:** Supports direct digital video/audio up to `4K @ 60 Hz` (`3840 × 2160`).
2. **Nano-SIM Card Tray (WWAN models only):** Spring-eject tray for 5G/LTE subscriber identity module; also supports embedded **eSIM**.
3. **USB Type-C® power connector & Thunderbolt™ 4 port #2 (Left):** Supports dual-4K `@ 60 Hz` or single `8K @ 60 Hz` external displays via **HP Thunderbolt Dock G4 (`120W` / `280W`)** with Intel VT-d DMA protection.
