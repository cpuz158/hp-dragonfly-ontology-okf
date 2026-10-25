---
type: section
title: 'Chapter 4 §4.4–4.6 — Cleaning (HP Easy Clean), Packaging/Transporting Guidelines & Swollen Lithium-Ion Battery Safety Rules (PDF p.35–38 · Doc p.29–32)'
description: 'Covers Chapter 4 protective packaging materials, cleaning procedures with HP Easy Clean, packaging and transporting environmental ranges (-40°C to 60°C), and swollen lithium-ion battery (`M90788-005`) safety protocol (`SAFE-DFG3-BAT`).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 04_ch5_preliminary_safety
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=35
  kind: origin_document
  sha256: b6b84d2779d71c52e88ba749334df2a24a8d8578b332aab32abb5bb37acee729
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 04_ch5_safety_rules
sequence: 13
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.4 §4.4–4.6 (Cleaning, Packaging/Transporting & Swollen Battery Safety)'
source_page: 35
source_pages_span: 'PDF p.35–38 (Doc p.29–32)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 4 §4.4–4.6 — Cleaning (HP Easy Clean), Packaging/Transporting Guidelines & Swollen Lithium-Ion Battery Safety Rules (PDF p.35–38 · Doc p.29–32)

## 1. Overview and Cleaning Preparation (PDF p.35 · Doc p.29)

Regularly cleaning your computer removes dirt and debris so that the device continues to operate at its best (PDF p.35 · Doc p.29). This section details the proper cleaning methods for external surfaces, packaging and transportation ESD rules, support resource locations, and swollen battery handling protocols.

### Approved ESD Protective Packaging Materials (PDF p.35 · Doc p.29)
When storing or transporting sensitive electronics, use:
- Conductive plastic bags
- Conductive plastic tubes
- Conductive tote boxes
- Opaque shielding bags
- Transparent metallized shielding bags
- Transparent shielding tubes

---

## 2. Enabling HP Easy Clean and Cleaning Procedures (PDF p.35–36 · Doc p.29–30)

### 2.1 Enabling HP Easy Clean (Select Products Only)
HP Easy Clean prevents accidental key strikes and touchpad inputs while wiping computer surfaces by disabling devices such as the keyboard, touch screen, and touchpad for a preset period.

**Starting HP Easy Clean (Choose one method):**
1. Select the **Start** menu, and then select **HP Easy Clean**.
2. Select the **HP Easy Clean** icon located in the taskbar.
3. Select **Start**, and then select the **HP Easy Clean** tile.

### 2.2 Removing Dirt and Debris from Your Computer
1. Wear disposable latex gloves (or nitrile gloves if latex-sensitive) when cleaning surfaces.
2. Turn off your device and disconnect the power cord and all attached external devices. Remove batteries from external accessories such as wireless keyboards.
   - **CAUTION:** To prevent electric shock or damage to components, never clean a product while it is turned on or plugged into AC power.
3. Moisten a microfiber cloth with water. The cloth must be moist, but not dripping wet.
   - **IMPORTANT:** To avoid damaging the surface finish, avoid abrasive cloths, towels, and paper towels.
4. Wipe the exterior gently with the moistened cloth.
   - **IMPORTANT:** Keep liquids away from the product. Avoid getting moisture into any openings. If liquid penetrates the interior, it can cause severe hardware failure. Do not spray liquids directly on the product. Do not use aerosol sprays, solvents, abrasives, or cleaners containing hydrogen peroxide or bleach.
5. When cleaning displays, wipe carefully in one direction from top to bottom. Finish by cleaning flexible cables (power cord, USB cables, keyboard cords).
6. Ensure all surfaces have completely air-dried before turning the device back on.
7. Discard gloves after each cleaning session and wash hands immediately.

---

## 3. Packaging and Transporting Guidelines (PDF p.36 · Doc p.30)

Adhere to the following grounding rules when handling and moving sensitive equipment:
- Transport products in static-safe tubes, bags, or boxes to avoid hand contact.
- Protect ESD-sensitive parts and assemblies using approved conductive containers.
- Keep ESD-sensitive parts inside their packaging until reaching an electrostatic-free workstation.
- Place containers on a grounded surface before unpacking contents.
- Ensure personnel are grounded (e.g., wearing a functional ESD wrist strap) before touching components.
- Store reusable ESD-sensitive parts in protective packaging or nonconductive foam.
- Use transport belts and conveyors with antistatic belts and roller bushings. Ensure all mechanized handling equipment is grounded. If grounding is unfeasible, operate an ionizer to dissipate electrostatic charges.

---

## 4. Accessing Support Information (PDF p.37–38 · Doc p.31–32)

| Service Consideration | Path to Access Information |
| :--- | :--- |
| **Records of reported failure incidents stored on the computer** | **Windows:**<br>1. *Pre-operating system failures (BIOS Event Log):*<br>  - Press the power button.<br>  - Immediately and repeatedly press `esc` when the power button light turns white.<br>  - Press `f10` to enter BIOS setup.<br>  - Commercial models: Under **Main** tab > select **BIOS event log** > select **View BIOS Event Log**.<br>  - Consumer models: Under **Main** tab > select **System Log**.<br>2. *Post-operating system failures (Event Viewer):*<br>  - Boot Windows, open Search on the taskbar, type `Event Viewer`, press Enter, and review logs in the right panel.<br><br>**Chrome:**<br>- Visit `support.google.com/chrome` and search `collect Chrome device logs`. |
| **Technical bulletins** | 1. Go to `www.hp.com`.<br>2. Hover over **Problem solving**.<br>3. Select **Support & Troubleshooting**.<br>4. Enter the serial number, product number, or product name.<br>5. Select **Advisories** to inspect bulletins. |
| **Repair professionals** | 1. Go to `www.hp.com`.<br>2. Hover over **Support resources**.<br>3. Select **Authorized service providers**. |
| **Component & diagnosis information, failure detection, and actions** | 1. Go to `http://www.hp.com/go/techcenter/pcdiags`.<br>2. Select **Get Support**.<br>3. Near the bottom, select **Notebook PCs**, then choose the appropriate region/location. |

---

## 5. Swollen Lithium-Ion Battery Handling Rules and Heat Sink Inspection (SAFE-DFG3-BAT)

### 5.1 Swollen Battery Safety Rules (`SAFE-DFG3-BAT`)
- If an internal lithium-ion battery cell exhibits swelling or deformation, immediately discontinue charging and operation.
- Do not puncture, drop, crush, or bend the battery casing. Piercing the pouch can ignite volatile electrolytes resulting in thermal runaway.
- Use non-conductive nylon or plastic tools during battery removal. Place degraded packs in an approved fireproof Li-ion battery disposal receptacle.

### 5.2 Heat Sink Inspection & Part Number Linkage
- Overheating can exacerbate battery swelling. When servicing thermal issues or replacing batteries, inspect the adjacent heat sink assembly:
  - **Heat sink for Intel Core i7-1265U / i7-1255U / i5-1245U / i5-1235U processors:** Spare Part Number **`N22936-001`**
  - **Heat sink for alternate configurations:** Spare Part Number **`N18244-001`**
- Ensure cooling fins are clear of dust and debris, and reapply thermal paste/pads whenever the thermal module is detached.
