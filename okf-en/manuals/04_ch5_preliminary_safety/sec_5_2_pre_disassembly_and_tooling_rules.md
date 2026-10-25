---
type: PolicyClause
title: 'Ch.5 §5.2 (Pre-Disassembly Mandatory Sequence & Required Tooling — Torx T5, Phillips #0/#1, Non-Magnetic Pry Tool)'
description: 'Defines the mandatory pre-disassembly shutdown checklist, peripheral removal, and approved non-magnetic tooling to prevent magnesium chassis gouging.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 04_ch5_preliminary_safety
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 55ca94d99bda803310213decebef2e04195663abf92a3e3eadec000115ed8f5d
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/04_ch5_preliminary_safety/sec_5_2_pre_disassembly_and_tooling_rules.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/04_ch5_preliminary_safety/doc.md
sequence: 31
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.2'
source_page: 31
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.2 — Actions Before Disassembly & Approved Service Tooling (pp. 31–32)

## 1. Mandatory Pre-Disassembly Checklist (Execute in Strict Order)
1. **Full OS Shutdown (`S5` State):** Shut down Windows 11 completely (do **not** leave the unit in Modern Standby `S0ix` or Hibernation). If servicing a system board with intact power, enter `F10 BIOS Setup > Main > Apply Factory Defaults and Exit` or enable **Battery Ship Mode**.
2. **Disconnect All External Power & Peripherals:** Unplug the USB-C AC adapter, HP Thunderbolt Dock G4, external monitors, and USB devices.
3. **Eject Nano-SIM Card Tray (WWAN SKUs):** Insert a SIM eject pin into the left-side tray pinhole and remove the **Nano-SIM tray** *before* lifting the System Board (`M90788-601`). Failure to remove the SIM tray will shear the SIM socket pins during board lift.

## 2. Required Precision Service Tools (Service Guide p. 32)
- **Torx `T5` screwdriver:** Required for the 5 captive Bottom Cover screws (`N22918-001`).
- **Phillips `P0` and `P1` torque-calibrated screwdrivers:** Required for internal battery, SSD, thermal heatsink (`2.0 kgf·cm`), and system board screws.
- **Non-conductive, non-magnetic flat plastic opening tool (spudger):** Mandatory for releasing chassis retention clips and ZIF connector locking bars. **Never use metal screwdrivers as pry levers.**
