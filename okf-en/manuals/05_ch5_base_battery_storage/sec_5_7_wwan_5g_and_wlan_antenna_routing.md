---
type: section
title: 'Chapter 5 §5.4–5.7 — Magnetic Pen Slot, SIM Board (N22922-001), 5G WWAN Module (4x4 MIMO Antennas #5–#8) & Wireless Charging Module (N22924-001) (PDF p.43–47 · Doc p.37–41)'
description: 'Details PDF pp. 43–47 (Doc pp. 37–41): removing the Magnetic pen slot, SIM board (`N22922-001`), WWAN module (`N00182-005` / `M52040-005` with foil shield, 4x4 MIMO antennas `#5` Orange, `#6` White/Blue, `#7` Yellow, `#8` Purple, and M2.0×2.5 screw), and Wireless charging module (`N22924-001`).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=43
  kind: origin_document
  sha256: 3e97d2366413793d47ed31e62df2b69200c51153b5f06d5fe49cef6a2de82c56
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 05_ch5_base_storage_wwan
sequence: 17
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.5 §5.4–5.7 (Magnetic Pen Slot, SIM Board, WWAN Module & Wireless Charger)'
source_page: 43
source_pages_span: 'PDF p.43–47 (Doc p.37–41)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.4–5.7 — Magnetic Pen Slot, SIM Board (N22922-001), 5G WWAN Module (4x4 MIMO Antennas #5–#8) & Wireless Charging Module (N22924-001) (PDF p.43–47 · Doc p.37–41)

## 1. Overview and Spare Part Specifications
This section covers the removal and installation procedures for the magnetic pen slot, SIM board, WWAN module, and wireless charging module on the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC.

### Spare Part Numbers Summary
| Component Item | Description / Specification | Spare Part Number |
| :--- | :--- | :--- |
| **Magnetic Pen Slot** | Pen docking and alignment slot | `N26148-001` |
| **SIM Board** | SIM board for use in models with WWAN | `N22940-001` (assembly kit ref: `N22922-001`) |
| | SIM board for use in models with WLAN | `N22941-001` |
| | SIM cable (available in Cable Kit) | `N22929-001` |
| | SIM tray and SIM insert (Misc Parts Kit) | `N22932-001` |
| **WWAN Module** | Intel 5000 5G Solution WWAN (4x4 MIMO) | `N00181-005` |
| | Intel XMM 7560 R+ LTE-Advanced Pro (Cat 16) | `N00182-005` |
| | WWAN card rubber (Rubber Kit) | `N22933-001` |
| | WWAN module bracket (Bracket Kit) | `N22931-001` |
| **Wireless Charging Module** | Wireless charging coil and controller board | `N26149-001` (charger assembly: `N22924-001` / `N19021-001`) |
| | Wireless charging module cable (Cable Kit) | `N22929-001` |

---

## 2. Preliminary Disassembly Steps
Before servicing these components, perform the following prerequisite procedures:
1. Prepare the computer for disassembly (power down, isolate external power).
2. Remove the bottom cover (refer to PDF p.39 / Doc p.33).
3. Disconnect the battery cable from the system board (refer to PDF p.44 / Doc p.42).

---

## 3. Step-by-Step Removal and Installation Procedures

### 3.1 Magnetic Pen Slot (PDF p.43–44 / Doc p.37–38)
1. Remove the single **Phillips M2.0 × 3.0 screw** securing the magnetic pen slot to the chassis.
2. Slide the magnetic pen slot assembly out of the chassis cutout.
3. Reverse the procedure to install the slot.

### 3.2 SIM Board (PDF p.44–45 / Doc p.38–39)
1. Eject and remove the SIM tray (holder) from the side of the computer.
2. Release the ZIF connector latch and disconnect the SIM board cable.
3. Remove the **Phillips M2.0 × 3.0 screw** securing the SIM board.
4. Angle the board upward by approximately 20°, then slide it out from beneath the USB bracket.
> **Installation Note:** When reinstalling, ensure the SIM board edges are firmly positioned under the USB bracket prior to driving the screw.

### 3.3 WWAN Module (PDF p.45–47 / Doc p.39–41)
> **Regulatory Warning:** To avoid system lockouts or unresponsiveness, replace only with an authorized wireless module approved by your regional regulatory agency. Unauthorized modules trigger a firmware warning.

1. Peel back the protective tape covering the antenna connectors.
2. Loosen the **two captive screws** securing the right cooling fan.
3. Carefully disconnect the 4x4 MIMO antenna leads (antennas #5 through #8) from the module terminals.
4. Peel back the gray conductive tape from the module body (leave it anchored near the connector).
5. Remove the **Phillips M1.6 × 1.6 screw**, then extract the module from under the thermal guide plastic tab.
6. **Antenna Terminal Protection:** If an antenna lead remains unattached, cover the connector with a protective sleeve to prevent internal short circuits.
> **Installation Note:** 4G WWAN modules use a reusable bracket; ensure it is migrated. Tighten the two right fan captive screws after module installation.

### 3.4 Wireless Charging Module (PDF p.47 / Doc p.41)
1. Remove the protective rubber piece from the board.
2. Release the ZIF latches and disconnect both cables from the top and bottom of the charging board.
3. Carefully pry the adhesive-backed charging board away from the chassis using a non-marring tool.
4. Remove the **Phillips M2.0 × 3.0 screw** securing the charger bracket, then remove the bracket.

---

## 4. Diagnostics & Ontology Linkage

### [TS-DFG3-002] 5G WWAN "No Service" Triage
* **Symptom:** Intel 5000 5G module (`N00181-005`) fails to acquire cellular service or suffers intermittent dropouts.
* **Resolution Path:**
  1. Inspect all 4 RF antenna connectors (#5, #6, #7, #8 MIMO leads) for bent center pins or unseated snaps.
  2. Ensure the gray conductive grounding tape is restored without contamination.
  3. Verify the SIM board (`N22940-001` / `N22922-001`) cable seating and confirm the board is seated under the USB bracket without mechanical binding.

### [TS-DFG3-006] Wireless Pen Charger Hardware Fault Triage
* **Symptom:** The active digital pen (`N16051-001` / `N19020-001`) fails to charge when seated into the magnetic slot (`N26148-001`).
* **Resolution Path:**
  1. Inspect the wireless charging board (`N26149-001` / charger assembly `N22924-001` / `N19021-001`) top and bottom ZIF FPC cables (`N22929-001`) for tears or skewed insertion.
  2. Verify that the charger bracket is seated flat with the Phillips M2.0 × 3.0 screw properly torqued, ensuring inductive coupling alignment with the pen slot.
