---
type: section
title: 'Chapter 5 §5.3 — Solid-State Drive (M.2 2280 PCIe Gen4 NVMe SSD) & EMI Shield Removal Procedure (PDF p.41–42 · Doc p.35–36)'
description: 'Covers Chapter 5 Solid-state drive removal on PDF pp. 41–42 (Doc pp. 35–36): disconnecting the battery cable, removing the Phillips M2.0×2.5 screw (1), pulling the M.2 2280 PCIe Gen4 SSD from its socket (2), and reinstalling the metal EMI/thermal shield (`N09040-001`).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=41
  kind: origin_document
  sha256: 40a9da6350ded7da25ea9c092e3aa51c8e6448ba9f7eb059e368c041e8fdb101
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 05_ch5_base_storage_wwan
sequence: 16
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.5 §5.3 (Solid-State Drive M.2 2280 NVMe SSD Removal)'
source_page: 41
source_pages_span: 'PDF p.41–42 (Doc p.35–36)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.3 — Solid-State Drive (M.2 2280 PCIe Gen4 NVMe SSD) & EMI Shield Removal Procedure (PDF p.41–42 · Doc p.35–36)

## 1. Overview and Spare Part Specifications (PDF p.41–42 · Doc p.35–36)

The HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC utilizes an M.2 2280 PCIe Gen4 NVMe Solid-State Drive (SSD) for primary high-performance storage. The spare part numbers and associated bracket/shield components are detailed below:

### Table 5-2: Solid-state drive descriptions and part numbers

| Description | Spare part number |
| :--- | :--- |
| 2 TB, PCIe-4 × 4, TLC | `M52027-005` |
| 1 TB, PCIe-4 × 4, TLC | `M16560-005` |
| 512 GB, PCIe-4 × 4, TLC | `M17436-005` |
| 512 GB, PCIe-3 × 4, TLC | `L85360-001` |
| 512 GB, PCIe-4 × 4, TLC, self-encrypting drive (SED) | `M52031-005` |
| 256 GB, PCIe-4 × 4, TLC | `M52025-005` |
| 256 GB, PCIe-4 × 4, TLC, self-encrypting drive (SED) | `M52029-005` |
| Solid-state drive bracket (available in the Bracket Kit) | `N22931-001` |
| SSD Thermal / Mylar Shield Rule & Component Linkage | `N09040-001` / `M90790-001` |

---

## 2. Mandatory Pre-disassembly Steps

Before removing the solid-state drive, complete the following preparatory steps (PDF p.42 · Doc p.36):

1. **Prepare the computer for disassembly**: Disconnect all external devices and AC power (see Preparation for disassembly on page 33).
2. **Remove the bottom cover**: Release the leather cover edges, loosen the five captive Torx T5 screws, and separate the cover (see Bottom cover on page 33 / PDF p.41).
3. **Disconnect the battery cable**: Unplug the battery cable from the system board connector to eliminate electrical risk (see Battery on page 42).

---

## 3. SSD Removal Procedure

1. **Remove Screw**: Remove the single **Phillips M1.4 × 1.2 screw (1)** that secures the drive to the computer chassis.
2. **Extract Drive**: Pull the solid-state drive gently away from the M.2 socket at an angle to remove it (2).

---

## 4. Replacement and Reassembly Notice

* **Reinstalling the Drive**: Reverse the removal procedure. Seat the M.2 drive firmly into the slot connector, press down gently, and tighten the **Phillips M1.4 × 1.2 screw**.
* **Bottom Cover Replacement Note (PDF p.41 · Doc p.35)**:
  * When replacing the bottom cover, be sure to toe the cover in at the bottom and clip it in place up the sides.
  * Ensure all retention clips are fully engaged before installing and tightening the screws in the sides.
