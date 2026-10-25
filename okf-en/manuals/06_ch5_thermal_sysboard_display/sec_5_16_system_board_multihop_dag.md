---
type: section
title: 'Chapter 5 §5.14–5.16 — System Board (N20724-601–N20728-601) & Audio Jack Multi-Hop Disassembly DAG, Antenna Barrel (N22932-001) & Wireless Antennas (PDF p.56–61 · Doc p.50–55)'
description: 'Documents PDF pp. 56–61 (Doc pp. 50–55) System board (`N20724-601`–`N20728-601` / `N19201-601`) removal: prerequisite removal of Bottom cover (`N22918-001`), Battery cable isolation (`M90788-005`), SSD, WWAN, and Heat sink (`N22936-001`), disconnecting 8 board cables, removing USB bracket and 9 screws, and Antenna barrel (`N22932-001`) removal.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=56
  kind: origin_document
  sha256: 4a8f37683b22a41c27dda742930d8c653f728b7d7476b33ad9e1ba6d1d68570c
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 06_ch5_thermal_board_display
sequence: 19
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.5 §5.14–5.16 (System Board N20724–N20728-601 Multi-Hop DAG & Antennas)'
source_page: 56
source_pages_span: 'PDF p.56–61 (Doc p.50–55)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.14–5.16 — System Board (N20724-601–N20728-601) & Audio Jack Multi-Hop Disassembly DAG, Antenna Barrel (N22932-001) & Wireless Antennas (PDF p.56–61 · Doc p.50–55)

This section establishes the official removal and replacement procedures for the System Board, Audio Jack, Antenna Barrel, and Wireless Antennas on the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC (PDF p.56–61 · Doc p.50–55).

---

## 1. Spare Part Numbers and Identification

### Table 5-13: System Board and Audio Jack Descriptions and Part Numbers (PDF p.56–57 · Doc p.50–51)

All system boards include an integrated processor and adhere to the standard HP spare numbering schema: `xxxxxx-001` for non-Windows operating systems and `xxxxxx-601` for Windows operating systems.

| Description | Spare Part Number |
| :--- | :--- |
| **Models with Integrated vPro WLAN** | |
| - Intel Core i7-1265U processor and 32 GB system memory | N20728-xxx (N20728-601) |
| - Intel Core i7-1265U processor and 16 GB system memory | N20727-xxx |
| - Intel Core i7-1265U processor and 16 GB system memory (OSR) | N20726-xxx |
| - Intel Core i5-1245U processor and 16 GB system memory | N20723-xxx |
| - Intel Core i5-1245U processor and 16 GB system memory (OSR) | N20722-xxx |
| **Models with Integrated Non-vPro WLAN** | |
| - Intel Core i7-1255U processor and 32 GB system memory | N20725-xxx |
| - Intel Core i7-1255U processor and 16 GB system memory | N20724-xxx (N20724-601) |
| - Intel Core i5-1235U processor and 16 GB system memory | N20720-xxx |
| - Intel Core i5-1235U processor and 8 GB system memory | N20721-xxx |
| **Brackets & Sub-components** | |
| - USB bracket (included in Bracket Kit) | N22931-001 |
| - Audio jack | N31280-001 |

### Table 5-14: Antenna Barrel Descriptions and Part Numbers (PDF p.60 · Doc p.54)

| Description | Spare Part Number |
| :--- | :--- |
| Antenna barrel (WWAN models) | N22928-001 (Kit N22932-001) |
| Antenna barrel (WLAN-only models) | N22927-001 |
| Bumpers (included in Rubber Kit) | N22933-001 |

### Table 5-15: Wireless Antennas and Cables Descriptions and Part Numbers (PDF p.61 · Doc p.55)

| Description | Spare Part Number |
| :--- | :--- |
| Wireless antennas and cables (aux2) | N22921-001 |
| Wireless antennas and cables (aux3) | N22922-001 |

---

## 2. Multi-Hop Disassembly DAG Requirements

Technicians must strictly adhere to the prerequisite multi-hop dependency chain (`REQUIRES_REMOVAL_OF`) prior to hardware servicing:

1. `N22918-001` (Bottom Cover) removed (PDF p.39 · Doc p.33).
2. `M90788-005` (Battery Pack cable disconnected) (PDF p.48 · Doc p.42).
3. `M16560-005` / `M90790-001` (Wireless Charging Module), `N00182-005` / `M90792-001` (M.2 Solid-State Drive), and `N22936-001` / `N18244-001` (Heat Sink assembly) removed (PDF p.53 · Doc p.47).
4. Terminal Target: `N20728-601` / `N19201-601` (System Board).

---

## 3. System Board and Audio Jack Removal Procedure (PDF p.57–59 · Doc p.51–53)

### 3.1. Cable Disconnections (10 Dedicated Paths)
Carefully disconnect the following cables from the top side of the system board:
1. Left top speaker cable
2. Camera cable
3. Display cable (*Note: Requires removing one screw and the display cable bracket to access*)
4. Antenna cables from the onboard WLAN module
5. WWAN antenna cables from the WWAN module
6. WWAN antenna cables routed along the onboard system channels
7. Right top speaker cable
8. Audio board cable
9. SIM board cable
10. Transfer board cable

### 3.2. Fastener & Bracket Removal
1. Remove the **four Phillips M2.0 × 4.0 screws** securing the board.
2. Remove the **USB bracket** (N22931-001).
3. Remove the **two Phillips M2.0 × 2.0 screws** (may be concealed under protective Mylar).
4. Remove the single **Phillips M2.0 × 4.0 screw** securing the audio jack.
5. Release the audio jack from the computer frame.
6. Peel the audio board cable away from the chassis surface.

> **Critical Service Notice (Audio Jack Underside Attachment):**
> The audio jack cable attaches to a dedicated header located on the bottom (reverse) side of the system board. Attempting to detach the cable prior to board extraction will cause terminal damage. Technicians are required to leave the cable connected and remove the audio jack simultaneously with the system board (PDF p.58–59).

### 3.3. Board Extraction
- With the audio jack and its harness remaining securely attached, lift the left edge of the system board upward.
- Shift and pull the system board assembly toward the left and out of the enclosure.
- When replacing the system board, disconnect the audio jack and harness assembly from the underside of the defective board and transfer it to the replacement unit.

---

## 4. Antenna Barrel Removal (PDF p.60 · Doc p.54)

*Prerequisites: System board removed.*

1. Extract the three rubber plugs situated on the antenna barrel.
2. Remove the **five Phillips M2.0 × 4.0 screws** securing the barrel to the chassis frame.
   - *Note orientation:* Three screws are oriented vertically; two screws are oriented horizontally.
3. Carefully peel back the orange flex cable overlaying the barrel structure.
4. Disengage the antenna barrel cables on both left and right extremes from the retention clips along the top wall of the chassis (release orange hinge Mylar gently if present).
5. Lift and extract the antenna barrel assembly out of the chassis.

---

## 5. Wireless Antennas and Cables Removal (PDF p.61 · Doc p.55)

*Prerequisites: Wireless module, heat sink, and system board removed.*

1. Peel back the orange cable that conceals the left antenna routing path.
2. Delicately peel the left and right antenna transceiver patches off the chassis structure.
3. Unroute the left antenna cable from the guiding clips running along the top and side walls.
4. Peel away the retention tape adjacent to the SIM board securing the right cable run.
5. Lift the antennas and attached harnesses out of the computer.

Reinstallation for all assemblies is executed by reversing the removal steps.
