---
type: Provision
title: 'Ch.5 §5.16 (System Board M90788-601 Removal — 6-Stage Prerequisite Disassembly DAG & 7 ZIF Ribbon Release Sequence)'
description: 'Defines the complete 6-stage prerequisite removal DAG and 7 ZIF ribbon connector release sequence required before lifting the System Board (M90788-601).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 6e5f759bdbba638f52a681d4f162e3063f8be37c6392cf1cd25c720a268f675b
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/06_ch5_thermal_sysboard_display/doc.md
sequence: 62
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.16'
source_page: 62
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.16 — System Board (`M90788-601`) Multi-Hop Disassembly DAG (pp. 62–66)

## 1. Mandatory 6-Stage Prerequisite Removal DAG (`REQUIRES_REMOVAL_OF`)
Before attempting to unfasten or lift the **System Board (`M90788-601` / `M90788-001`)**, remove the following prerequisite components in strict topological order:
1. **Stage 1:** **Bottom Cover (`N22918-001`)** — 5 captive Torx T5 screws (Ch.5 §5.4, p. 35)
2. **Stage 2:** **Battery Pack (`M90788-005`)** — Disconnect battery cable & remove 4 Phillips P1 screws (Ch.5 §5.5, p. 38)
3. **Stage 3:** **Nano-SIM Card Tray** — Eject from left side slot so tray does not snag SIM socket (Ch.5 §5.2, p. 31)
4. **Stage 4:** **M.2 2280 NVMe SSD (`M16560-005`) & Mylar Shield (`N09040-001`)** — 1 Phillips P1 screw (Ch.5 §5.6, p. 41)
5. **Stage 5:** **5G WWAN Module (`N00182-005`)** — Disconnect 4 MIMO coaxial leads (`5/6/7/8`) & 1 screw (Ch.5 §5.7, p. 43)
6. **Stage 6:** **Thermal Fan (`M90791-001`) & Vapor Chamber Heatsink (`M90790-001`)** — 3 fan screws + 4 captive coldplate screws (Ch.5 §5.12, p. 54)

## 2. Disconnecting the 7 System Board Cables & Brackets (Service Guide pp. 63–65)
Flip up the ZIF locking actuators using a non-magnetic plastic tool and disconnect:
- `(a)` Display eDP 1.4b cable (`N09038-001`) + Peel back WLAN antenna leads from board channel
- `(b)` Camera / Microphone hub cable (`N09037-001`)
- `(c)` Top Cover Keyboard backlight & matrix ZIF ribbons (2× wide ZIF connectors)
- `(d)` Glass Clickpad ZIF ribbon (`N09041-001`) and Fingerprint Reader ZIF ribbon (`N09042-001`)
- `(e)` Left/Right Bang & Olufsen Speaker cable plug (`N09029-001`)
- **Remove Screws & USB-C Bracket:** Remove the **three (3) Phillips `M2.0 × 4.0 mm` screws** securing the right-side Thunderbolt 4 USB-C reinforcement bracket, remove the **two (2) Phillips `M2.0 × 2.5 mm` board screws**, lift the right edge of the System Board at a `20°` angle, and slide the left HDMI/USB-C ports clear of the chassis cutouts.
