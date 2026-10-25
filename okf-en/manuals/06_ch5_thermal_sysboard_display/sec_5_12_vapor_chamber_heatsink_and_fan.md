---
type: section
title: 'Chapter 5 §5.9–5.13 — Bottom/Top Speakers, Transfer Board (N22921-001), Touchpad (N22933-001) & Heat Sink (N22936-001, 1-2-3-4 Sequence & Thermal Pad) (PDF p.50–55 · Doc p.44–49)'
description: 'Covers PDF pp. 50–55 (Doc pp. 44–49): removing Bottom speakers (`N22934-001`), Transfer board (`N22921-001`), Touchpad (`N22933-001`), Top speakers (`N22939-001`), and Heat sink (`N22936-001`, loosening 4 captive Phillips screws in stamped sequence and renewing thermal material every time).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=53
  kind: origin_document
  sha256: eabdd8e43bc6fee2d71ea8e3c2f2379a038f921d61d719d32f529ee24af605c7
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 06_ch5_thermal_board_display
sequence: 18
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.5 §5.9–5.13 (Speakers, Transfer Board, Touchpad & Heat Sink N22936-001)'
source_page: 53
source_pages_span: 'PDF p.50–55 (Doc p.44–49)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.9–5.13 — Bottom/Top Speakers, Transfer Board (N22921-001), Touchpad (N22933-001) & Heat Sink (N22936-001, 1-2-3-4 Sequence & Thermal Pad) (PDF p.50–55 · Doc p.44–49)

This section covers the removal and replacement procedures for authorized service provider parts in the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (Doc Part Number: `N17344-001`). It details the procedures, fastener specs, and spare part numbers for the bottom speakers, transfer board, touchpad, heat sink, and top speakers (`PDF p.50–55 · Doc p.44–49`).

---

## 1. Bottom Speakers

### Part Numbers and Descriptions
- **Speakers (includes all speakers)**: `N22946-001` (Table 5-8)

### Preliminary Steps
1. Prepare the computer for disassembly (page 33).
2. Remove the bottom cover (page 33).
3. Remove the battery (page 42).

### Removal Procedure (PDF p.50–51 · Doc p.44–45)
1. Disconnect both speaker cables from the system board (1).
2. Remove the three Phillips M2.0 × 3.0 screws (2) securing each speaker (total 6 screws).
3. Free the speaker cable from the two Mylar tabs securing it (3).
   - *NOTE*: To avoid tearing the tabs, gently pull up on the tabs when releasing the cable.
4. Remove the bottom speakers from the computer chassis (4).

### Installation Note
- Reverse the procedure to install the bottom speakers.
- *NOTE*: When installing the speakers, ensure that rubber washers are properly seated in the screw holes of the speakers.

---

## 2. Transfer Board

Acts as the central junction board routing keyboard, backlight, touchpad, and system board signals.

### Spare Part Numbers
| Component Description | Spare Part Number |
| :--- | :--- |
| Transfer board | `N22942-001` (Ontology cross-ref: `N22921-001`) |
| Transfer board cable (available in Cable Kit) | `N22929-001` |

### Prerequisites
1. Disassembly preparation completed.
2. Bottom cover removed.
3. Battery removed.
4. Bottom speakers removed.

### Removal Steps (PDF p.51–52 · Doc p.45–46)
1. Disconnect the keyboard cable from the transfer board (1).
2. Disconnect the system board cable from the transfer board (2).
3. Disconnect the touchpad cable from the transfer board (3).
4. Disconnect the backlight cable from the transfer board (4).
5. Use a plastic pry tool to pry and release the board from the computer chassis (5). The board is secured with structural adhesive.

---

## 3. Touchpad

### Spare Part Numbers
| Component Description | Spare Part Number |
| :--- | :--- |
| Touchpad | `N22947-001` (Ontology cross-ref: `N22933-001`) |
| Touchpad cable (included in Cable Kit) | `N22929-001` |

### Prerequisites
- Prepare for disassembly, remove bottom cover, battery, and bottom speakers.

### Removal Steps (PDF p.52–53 · Doc p.46–47)
1. Disconnect the touchpad cable from the touchpad ZIF connector (1).
2. Gently pull up to release the keyboard cable from the long adhesive strip securing it to the top surface of the touchpad (2).
3. Remove the three Phillips M2.0 × 2.0 screws (3) securing the touchpad to the chassis.
   - *NOTE (Display Protection)*: To avoid damaging the display, lift the computer off the display before removing the touchpad. Because the top of the touchpad must be rotated up at an angle during removal, the bottom edge can pivot downwards and crack or scratch the display if resting directly on top of it.
4. Rotate the touchpad upward to a 20° to 30° angle (4), and pull the touchpad inwards into the computer chassis at an angle to disengage and remove it (5).

### Installation Precaution
- *IMPORTANT*: Before inserting the touchpad during reinstallation, lift the computer chassis up off the display to prevent pressure damage to the screen.

---

## 4. Heat Sink and Fans Assembly

### Part Numbers & Engineering Context
- **Heat sink Spare Part Number**: `N22936-001` (Related thermal kits / fan references: `N18244-001`, standalone fan rule `N18245-001`, `SAFE-DFG3-THM`)
- **Screws**: 8 captive Phillips screws

### Prerequisites
1. Prepare for disassembly.
2. Remove the bottom cover.
3. Disconnect the battery cable from the system board (full battery removal not required).

### Removal Procedure (PDF p.53–54 · Doc p.47–48)
1. Disconnect the two fan cables from the system board (1).
2. Loosen the eight captive Phillips screws (2) securing the heat sink and dual fans to the computer in the reverse numbered/cross-pattern sequence.
3. Unroute and release the antenna cable from the adhesive tape and routing clips around the right fan (3).
4. Lift the left side of the heat sink up to approximately 45°, then pull the assembly to the left and out of the computer (4).

### Thermal Interface Material (TIM) Requirements (PDF p.54 · Doc p.48)
> "Every time the heat sink is removed, thoroughly clean the thermal material from the surfaces of the heat sink and system board components, and then apply new thermal material."

- **Thermal Paste**: Thoroughly clean thermal residue using an approved solvent/wipe and reapply fresh compound before reseating.
- **Thermal Pad**: If a replacement thermal pad is not present in the replacement heat sink kit, reuse the existing thermal pad (`NOTE`). The official replacement heat sink comes with a pre-installed thermal pad on the bottom section extending over the WWAN module.

---

## 5. Top Speakers

### Part Numbers and Descriptions
- **Speakers (includes all speakers)**: `N22946-001` (Table 5-12)

### Preliminary Steps (PDF p.55 · Doc p.49)
1. Prepare computer for disassembly.
2. Remove bottom cover.
3. Disconnect the battery cable from the system board.
4. Remove the heat sink assembly.

### Removal Steps
1. Disconnect both speaker cables from the system board (1).
2. Unroute the antenna cables from the retention clips located in each speaker housing (2).
