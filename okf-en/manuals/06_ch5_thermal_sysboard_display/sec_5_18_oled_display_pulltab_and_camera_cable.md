---
type: section
title: 'Chapter 5 §5.17–5.20 — Top Cover with Keyboard (N22938-001), Display Panel Stretch-Release Pull-Tabs, Transfer Board (N22937-001), 8MP Camera (N23306-001) & Hinges (N22923-001) (PDF p.62–82 · Doc p.56–76)'
description: 'Covers PDF pp. 62–82 (Doc pp. 56–76): Top cover with keyboard (`N22938-001`), Display panel removal using tweezers to pull stretch-release adhesive strips (`N09039-001`) out of top holes, Display transfer board (`N22937-001`), 8MP camera module (`N23306-001`), Display assembly, and Display hinges (`N22923-001`).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 06_ch5_thermal_sysboard_display
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=62
  kind: origin_document
  sha256: 3b784118692f65bd8d729a386e4fef2a204e6e4ce8405aa8a43304ac355948ee
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 06_ch5_thermal_board_display
sequence: 20
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.5 §5.17–5.20 (Top Cover Keyboard, Display Panel Pull-Tabs, Transfer Board, Camera & Hinges)'
source_page: 62
source_pages_span: 'PDF p.62–82 (Doc p.56–76)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.17–5.20 — Top Cover with Keyboard (N22938-001), Display Panel Stretch-Release Pull-Tabs, Transfer Board (N22937-001), 8MP Camera (N23306-001) & Hinges (N22923-001) (PDF p.62–82 · Doc p.56–76)

## 1. Overview and Preliminary Service Procedures

This section covers the terminal structural disassembly procedures for the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC, including the Top Cover with Keyboard, the Display Panel stretch-release pull-tab detachment, the Transfer Board, the 8MP Camera module, and the Hinge assemblies (PDF p.62–82, Doc p.56–76).

### Preliminary Steps Before Disassembly
1. Prepare the computer for disassembly (see Doc page 33).
2. Remove the bottom cover (see Doc page 33).
3. Disconnect the battery cable from the system board (see Doc page 42).

---

## 2. Top Cover with Keyboard Spare Part Numbers

The top cover with keyboard remains after removing all other internal subcomponents and modules from the chassis (PDF p.62 / Doc p.56).

| Description | Spare Part Number |
| :--- | :--- |
| Top cover with keyboard, privacy models (includes thermal grease and replacement antennas) | **N22552-xxx** (Keyboard sub-base: `N22938-001`) |
| Top cover with keyboard, nonprivacy models with an antiglare display (includes thermal grease and replacement antennas) | **N24787-xxx** |
| Top cover with keyboard, nonprivacy models with a BrightView display (includes thermal grease and replacement antennas) | **N22553-xxx** |

*Key Country Codes: South Korea `-AD1`, United States `-001`, Japan `-291`, United Kingdom `-031`, Germany `-041`.*

---

## 3. Display Panel Removal: 8-Piece Stretch-Release Adhesive Tape Procedure

The display panel is secured to the enclosure using eight individual stretch-release adhesive pull-tabs rather than mechanical screws (PDF p.63–68 / Doc p.57–62).

### Removal Sequence
1. **Orient Display:** Open the computer (1) and flip the display so that it faces away from the keyboard base (2) (PDF p.63).
2. **Bottom Left/Right Adhesive (Callout 1):** Remove the rubber plugs from the bottom corners (1). Grasp the exposed tape ends with tweezers, then rotate and wrap the tape around the tweezers (2) while steadily pulling outward (3). Repeat until fully extracted.
   - **Important:** Slowly and carefully wrap the tape around the tweezers. Pulling abruptly can cause the adhesive strip to shear prematurely.
3. **Bottom Center Adhesive (Callout 2):** Remove the center rubber plug (1). Extract the left-routed tape (2) and right-routed tape (3) by rolling the tweezers in place without tugging (PDF p.64–65).
4. **Upper Right & Left Adhesive (Callouts 3 & 4):** Tilt the panel slightly forward (1). Using tweezers (2), grasp the upper tape ends perpendicular to the panel edge (3) and wind out the right and left strips completely (4) (PDF p.66–67).
5. **Center Upper Adhesive (Callout 5):** Carefully grasp and extract the final two central tape strips (2, 3) (PDF p.67–68).
   - *Note:* If a tape segment snaps, carefully insert a thin non-marring pry tool along the panel perimeter to release the bond.
6. **Disconnect Panel Cables:**
   - Peel the tape off the left connector (1), pivot the locking latch open (2), and disconnect the display cable (3) (PDF p.69 / Doc p.63).
   - Peel the protective foil tape from the two right ZIF connectors (4) and detach the ribbon cables (5).

### Spare Part Numbers & Partial Repair Economic Mandate (Rule TS-DFG3-004)

- **N23302-001:** WUXGA, Antiglare Panel
- **N23304-001:** WUXGA, BrightView Panel
- **N23303-001:** WUXGA, Privacy Panel
- **N23305-001** (Cross-ref `N18990-001`): OLED Panel ($640 replacement tier)
- **N09039-001:** Stretch-Release Adhesive Kit (Strict non-reuse rule; must be replaced every service iteration)
- **N22923-001** (Cross-ref `N18995-001`): Hinge Kit ($95 replacement tier)
- **N22937-001:** Transfer Board
- **N23306-001:** 8MP Camera Module

> **[Critical Service Directive: Rule TS-DFG3-004]**
> When diagnosing hinge tension failures, mechanical tilt play, or camera/transfer board connectivity faults, service technicians must NOT replace the complete $640 OLED assembly (`N23305-001`). Technicians are strictly instructed to execute the stretch-release tape removal procedure and perform modular component replacement using the $95 hinge kit (`N22923-001`), transfer board (`N22937-001`), or camera (`N23306-001`) with a fresh adhesive kit (`N09039-001`), avoiding unnecessary bill-of-materials costs.
