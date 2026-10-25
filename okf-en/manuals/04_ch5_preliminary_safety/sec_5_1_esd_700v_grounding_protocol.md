---
type: section
title: 'Chapter 4 §4.3 [Table 4-1] — Electrostatic Discharge (ESD 700V–35,000V) Protection & Grounding Wrist Strap/Mat Protocol (PDF p.32–35 · Doc p.26–29)'
description: 'Details Chapter 4 Electrostatic Discharge (ESD) protection and Table 4-1 Static Voltage Generation across 10%/40%/55% relative humidity (showing 700V threshold can destroy CMOS/LPDDR5 devices), plus mandatory wrist-strap and conductive mat grounding rules.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 04_ch5_preliminary_safety
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=32
  kind: origin_document
  sha256: 258c9a2cdf8c20b844850cf03e69f40736170b034854745f0083a2c9eaff47c1
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 04_ch5_safety_rules
sequence: 11
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.4 §4.3 Table 4-1 (ESD 700V Sensitivity & Grounding)'
source_page: 32
source_pages_span: 'PDF p.32–35 (Doc p.26–29)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 4 §4.3 [Table 4-1] — Electrostatic Discharge (ESD 700V–35,000V) Protection & Grounding Wrist Strap/Mat Protocol (PDF p.32–35 · Doc p.26–29)

## 1. Overview and Drive Handling Precautions (PDF p.32 · Doc p.26)

Strict technical handling standards must be maintained during disassembly and component replacement to prevent damage caused by electrostatic discharge (ESD). Adhere to the following rules when handling drives:

- Before removing or installing a hard drive, shut down the computer. If uncertain whether the unit is off or in Hibernation, turn it on and shut down via the OS.
- Discharge personal static electricity before touching a drive; do not touch connector pins.
- Ensure optical drive media is removed and the tray is closed prior to drive removal.
- Handle drives exclusively on surfaces cushioned with at least 2.54 cm (1 inch) of shock-proof foam.
- Prevent drives from dropping from any elevation onto any surface.
- Immediately seal removed drives in static-proof bags.
- Keep drives away from magnetic field sources such as monitors and audio speakers.
- Avoid exposing drives to liquid ingress or extreme temperatures.
- If shipping is required, use bubble pack packaging and clearly affix a "FRAGILE" label.

## 2. Electrostatic Discharge Principles & Precautions (PDF p.32 · Doc p.26)

Sudden electrostatic discharge from human fingers or conductive materials can destroy microcircuitry. Sparks are frequently silent and invisible. An ESD-exposed component may function normally initially, but internal layers degrade, drastically decreasing life expectancy or melting silicon junctions.

- **Core Handling Precautions**:
  - Keep spare parts in static-safe containers until installation.
  - Discharge static electricity using certified personal grounding equipment prior to handling parts.
  - Avoid touching pins, leads, and printed traces; minimize handling.
  - Enclose removed components in electrostatic-safe packaging immediately.

## 3. Static Electricity Generation by Humidity Level (Table 4-1) (PDF p.33 · Doc p.27)

Static charge levels increase significantly as relative humidity drops. Static voltages as low as 700 V can degrade electronic components.

| Event | Relative Humidity 55% | Relative Humidity 40% | Relative Humidity 10% |
| :--- | :--- | :--- | :--- |
| Walking across carpet | 7,500 V | 15,000 V | 35,000 V |
| Walking across vinyl floor | 3,000 V | 5,000 V | 12,000 V |
| Motions of bench worker | 400 V | 800 V | 6,000 V |
| Removing dual in-line packages (DIPs) from plastic tube | 400 V | 700 V | 2,000 V |
| Removing DIPs from vinyl tray | 2,000 V | 4,000 V | 11,500 V |
| Removing DIPs from polystyrene foam | 3,500 V | 5,000 V | 14,500 V |
| Removing bubble pack from PCB (printed circuit board) | 7,000 V | 20,000 V | 26,500 V |
| Packing PCBs in foam-lined box | 5,000 V | 11,000 V | 21,000 V |

## 4. Personal Grounding & Shielding Protection Levels (Table 4-2) (PDF p.33–34 · Doc p.27–28)

### Grounding Equipment Specifications
- **Wrist Straps**: Ground cords must incorporate a 1 MΩ ±10% resistance. The strap must be worn snug against bare skin, with its banana plug securely engaged in the grounding mat or bench receptacle.
- **Footwear Straps**: Heel, toe, or boot straps utilized at standing workstations require wear on both feet over conductive or dissipative flooring, preserving a maximum of 1 MΩ ±10% resistance to ground.

### Static Shielding Protection Levels (Table 4-2)

| Method | Voltage Protection |
| :--- | :--- |
| Antistatic plastic | 1,500 V |
| Carbon-loaded plastic | 7,500 V |
| Metallized laminate | 15,000 V |

## 5. Workstation Grounding & Recommended ESD Equipment (PDF p.34–35 · Doc p.28–29)

### Work Area Precautions
- Cover work surfaces with approved static-dissipative material.
- Utilize grounding mats, grounded footwear, and air ionizers.
- Handle circuit boards and sensitive assemblies strictly by edges or laminate sections.
- Eliminate nonconductive plastics and styrofoam materials from the bench area.
- Utilize conductive hand tools (screwdrivers, cutters) and ESD vacuums.
- Fully power off equipment and disconnect signal lines prior to mating or unmating connectors.

### HP Recommended Tools & Packaging
- Antistatic tape, smocks, aprons, and sleeve protectors
- Conductive foam, bins, and workstations with 1 MΩ ±10% ground cords
- Static-dissipative floor and table mats with dedicated hard ground ties
- Wrist straps and footwear straps rated at 1 MΩ ±10% resistance
- Conductive plastic containers, opaque shielding bags, and transparent metallized shielding bags

## 6. Technical Ontology & Component Integration

- **Safety Protocol Entity**: Under `SAFE-DFG3-ESD`, technicians must ensure full personal and environmental grounding before servicing internal assemblies, as components degrade at charges as low as 700 V.
- **Internal Mylar Shield**: When accessing internal hardware beneath the enclosure, take caution to preserve the Mylar protective shield (`N09040-001`), ensuring it is repositioned flat and undamaged during reassembly to maintain proper insulation.
