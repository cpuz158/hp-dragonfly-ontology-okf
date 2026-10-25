---
type: section
title: 'Chapter 5 §5.8 — 4-Cell 53 Whr Battery Pack (M90788-005) Removal & Prerequisite Power Isolation Procedure (PDF p.48–49 · Doc p.42–43)'
description: 'Details Chapter 5 Battery (`M90788-005`, 4-cell 53 Whr) removal on PDF pp. 48–49 (Doc pp. 42–43): peeling back the retention tape (1), disconnecting the battery cable from the system board (2), removing 4 Phillips M2.0×4.0 screws (3), and lifting out the battery (4).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=48
  kind: origin_document
  sha256: c3ee3fcfbdbcbf572a8df110dda438ce7868dfd680073dbc5b3703030e68a77d
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 05_ch5_base_storage_wwan
sequence: 15
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.5 §5.8 (Battery Pack M90788-005 Removal & Power Isolation)'
source_page: 48
source_pages_span: 'PDF p.48–49 (Doc p.42–43)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.8 — 4-Cell 53 Whr Battery Pack (M90788-005) Removal & Prerequisite Power Isolation Procedure (PDF p.48–49 · Doc p.42–43)

## 1. Component Overview & Spare Part Number (PDF p.48 · Doc p.42)

The internal battery incorporated in the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC is a 4-cell, 53 Whr lithium-ion polymer pack with insulators included. Power isolation and physical removal of the battery (`M90788-005`) serves as an absolute mandatory prerequisite (`REQUIRES_REMOVAL_OF`) prior to servicing downstream components, such as the system board, heat sink assembly, and internal ZIF interconnects, in order to prevent electrical shorts and board-level component damage.

### Table 5-7 Battery description and part number

| Description | Spare part number |
| :--- | :--- |
| Battery, 4 cell, 53 Whr (includes insulators) | **M90788-005** |

---

## 2. Safety Warnings and Handling Precautions (PDF p.48–49 · Doc p.42–43)

### WARNING!
To avoid personal injury and damage to the product, strictly adhere to the following precautions:
- Do not puncture, twist, or crack the battery.
- Do not cause an external puncture or rupture to the battery. External punctures can cause an internal short inside the battery cells, which can result in thermal runaway.
- Do not handle or touch the battery enclosure with sharp objects such as tweezers or pliers that might puncture the battery casing.
- Do not compress or squeeze the battery case with tools or heavy objects stacked on top of the case, as these actions apply undue force to the internal cells.
- Do not touch the battery connectors with any metallic surface or conductive objects, such as metal screwdrivers, screws, or coins, which can cause dead-shorting across the connector pins.
- To reduce potential safety issues, use only the user-replaceable battery provided with the computer, an authorized replacement battery provided by HP, or a compatible battery purchased directly from HP.

### IMPORTANT
Removing a battery that is the sole power source for the computer can cause loss of information. To prevent data loss, save all work and shut down the computer completely through the Windows operating system before attempting battery disconnection.

---

## 3. Prerequisite Procedures (PDF p.48–49 · Doc p.42–43)

Before removing the battery pack, execute the following prerequisite service steps in order:
1. **Prepare the computer for disassembly** (see *Preparation for disassembly on page 33*).
2. **Remove the bottom cover** (see *Bottom cover on page 33*).

---

## 4. Battery Removal Procedure (PDF p.49 · Doc p.43)

To safely disconnect and extract the battery (`M90788-005`), follow these numbered steps:

1. **Disconnect the Battery Cable (1)**:
   - Disconnect the main battery power cable from the mating receptacle on the system board.
2. **Remove the Retaining Screws (2)**:
   - Remove the **five Phillips M2.0 × 3.0 screws** that secure the battery assembly to the computer chassis.
3. **Release the Antenna Cable (3)**:
   - Disengage the antenna cable from the retaining clip located on the right side of the battery.
4. **Extract the Battery Pack (4)**:
   - Carefully lift and remove the battery pack from the computer chassis.

> **Reinstallation Note**: Reverse this procedure to install the replacement battery pack. Ensure proper routing of the antenna cable along the retaining clip and verify that the battery cable is seated firmly into the system board connector without pinching.
