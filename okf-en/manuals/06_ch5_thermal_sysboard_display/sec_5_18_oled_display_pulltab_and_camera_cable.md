---
type: Provision
title: 'Ch.5 §5.18 (13.5" 3K2K OLED Display N09033-001 Disassembly — Stretch-Release Pull-Tab Adhesive N09039-001 & Webcam Cable Replacement)'
description: 'Governs display assembly removal, 3K2K OLED panel extraction using stretch-release adhesive pull-tabs (<30° angle), and mandatory replacement of single-use adhesive strips (N09039-001) when servicing the 5MP IR camera or cable.'
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
  sha256: ab2e484f2519cb8bc5d050e3b9383d7a277a59c8654184f6ae45a48611176e00
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/06_ch5_thermal_sysboard_display/doc.md
sequence: 67
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.18'
source_page: 67
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.18 — Display Assembly & 3K2K OLED Panel Pull-Tab Disassembly (pp. 67–72)

## 1. Architectural Dependency: Camera & Cable Sit Behind the Display Panel
- Both the **5 MP + IR Camera Module (`N09036-001`)** and the **Camera/Microphone Hub Flex Cable (`N09037-001`)** are routed inside the magnesium display back cover **underneath the bonded display panel (`N09033-001`)**.
- Therefore, replacing a faulty camera or frayed hinge cable requires extracting the display panel without cracking the ultra-thin `0.6 mm` Gorilla Glass 5 / OLED substrate.

## 2. Stretch-Release Pull-Tab Extraction Procedure (Service Guide pp. 69–70)
1. **Remove Display Assembly from Base:** After removing Bottom Cover (`§5.4`) and disconnecting Battery (`§5.5`), unroute the eDP cable (`N09038-001`) and WWAN/WLAN antennas, then remove the **six (6) Phillips `M2.5 × 4.0 mm` hinge screws** (3 left, 3 right).
2. **Release Bottom Bezel Trim:** Gently unclip the lower hinge bezel strip to expose the two black **stretch-release adhesive pull-tabs** at the bottom-left and bottom-right corners of the panel.
3. **Pull Stretch-Release Tape at `< 30°` Low Angle:**
   > **CRITICAL PANEL FRACTURE WARNING:** Wrap each adhesive tab around cylindrical tweezers and pull **slowly and horizontally (`< 30°` angle relative to the panel plane)** until the entire `220 mm` strip stretches free. Pulling upward at `90°` will snap the tape or crack the `3K2K OLED` glass (`N09033-001`).
4. **Mandatory Companion Kit (`N09039-001`):** Stretch-release adhesive strips are **single-use only**. Always install a brand-new **Display Adhesive Tape Kit (`N09039-001`)** before bonding the panel back into the rear enclosure.
