---
type: section
title: 'Chapter 4 §4.1–4.2 — Tools Required (Torx T5, Phillips P0/P1, Non-Marking Plastic Lever) & Plastic/Cable/Drive Handling Considerations (PDF p.31–32 · Doc p.25–26)'
description: 'Documents Chapter 4 Tools required (magnetic Torx T5, Phillips P0 and P1 screwdrivers, non-marking plastic lever) and Service considerations for plastic parts, ZIF/flex cables, connectors, and solid-state drives.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 04_ch5_preliminary_safety
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=31
  kind: origin_document
  sha256: 42a0addaf39ccfc59f5861454b37010240b19758e4ebf49b8716750496fa613b
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/04_ch5_preliminary_safety/sec_5_2_pre_disassembly_and_tooling_rules.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 04_ch5_safety_rules
sequence: 12
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.4 §4.1–4.2 (Tools Required & Service Considerations)'
source_page: 31
source_pages_span: 'PDF p.31–32 (Doc p.25–26)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 4 §4.1–4.2 — Tools Required (Torx T5, Phillips P0/P1, Non-Marking Plastic Lever) & Plastic/Cable/Drive Handling Considerations (PDF p.31–32 · Doc p.25–26)

## 1. Overview & Preliminary Requirements
This section outlines the essential service tooling, handling precautions, and electrostatic safety standards required prior to disassembling and reassembling the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC (Document Part Number: `N17344-001`) (`PDF p.31`, `Doc p.25`).

### Required Tooling Specifications
To successfully perform disassembly and component replacement procedures, service technicians must utilize the following specialized tools:
* **Tweezers**: For handling precision routing, antenna latches, and miniature connectors.
* **Nonconductive, non-marking pry tool**: Non-magnetic nylon/plastic levers designed to release chassis latches without cosmetic or structural damage.
* **Magnetic Phillips P0 screwdriver**
* **Magnetic Phillips P1 screwdriver**
* *(Chassis enclosure standard fastener tooling)*: **Torx T5 screwdriver** and calibrated torque driver.

| Tool Designation | Specification & Target Components | Fastener Torque Rating |
| :--- | :--- | :--- |
| **Torx T5 Screwdriver** | Base enclosure perimeter screws and external chassis fasteners | `0.20 N·m` |
| **Phillips P0 Screwdriver** | Micro-brackets, M.2 solid-state drive hold-down, battery secondary fasteners | `0.22 N·m – 0.25 N·m` |
| **Phillips P1 Screwdriver** | Main system board, display hinges, structural chassis fasteners | `0.30 N·m – 0.35 N·m` |
| **Non-marking Pry Tool** | Plastic chassis edge separation, seam unlatching | No excessive prying / Zero cosmetic marring |
| **ESD-Safe Tweezers** | Precision connector insertion and FPC/FFC cable alignment | N/A |

---

## 2. Pre-Disassembly Power Isolation (BIOS Battery Service Mode)
Before initiating internal service, complete the following power isolation steps to avoid electrical shorts:
1. Shut down the system completely and disconnect the AC adapter and all external peripherals.
2. Access the system BIOS and activate **Battery Service Mode** to electronically disconnect internal battery power before chassis entry.
3. If it is uncertain whether the computer is powered off or in Hibernation, turn the device on and then perform a standard operating system shut down (`PDF p.32`, `Doc p.26`).

---

## 3. Disassembly & Assembly Service Considerations

### 3.1 Plastic Parts Handling
* Excessive force applied during disassembly or reassembly causes latch fracture and chassis deformation (`PDF p.31`, `Doc p.25`).
* As each subassembly is removed, store the unit and all associated fasteners safely away from the active work area to prevent accidental damage or component loss.

### 3.2 Cables and Connectors Guidelines
* **Extreme Caution**: Always handle internal cables with extreme care to prevent internal conductor breakage.
* **IMPORTANT**: When servicing the unit, ensure all cables are routed into their exact factory positions during reassembly. Improper cable routing can lead to pinch damage and system failure (`PDF p.31`, `Doc p.25`).
* **Seating Tension**: Apply only the minimum tension required to disconnect or seat connectors. Always manipulate cables by the connector body rather than pulling on the harness.
* **Physical Integrity**: Prevent bending, twisting, or tearing cables. Verify that cabling is routed free from snag points during part removal and replacement. Flexible printed circuit (flex) cables tear easily and must be handled with utmost care.

### 3.3 Drive Handling Protocol
Drives are delicate precision assemblies. To prevent equipment failure, physical shock, or permanent data loss, adhere to the following precautions (`PDF p.31–32`, `Doc p.25–26`):
* **Power State Verification**: Shut down the notebook before removing or installing any drive unit.
* **Static Discharge**: Discharge personal electrostatic potential before handling drives, and avoid touching contact gold fingers or interface pins.
* **Shock-Proof Work Surfaces**: Always manipulate drives over work surfaces cushioned with at least `2.54 cm (1 inch)` of shock-proof foam.
* **Drop Prevention**: Never allow drives to drop onto any surface from any height.
* **ESD Containment**: Seal removed drive assemblies inside static-shielding bags immediately upon removal.
* **Magnetic Field Isolation**: Avoid exposing drives to magnetic field emitters, including display panels, transformers, and unshielded audio speakers.
* **Environmental Protection**: Protect drive assemblies from thermal extremes and liquid ingress.
* **Transit Packaging**: If shipping is required, encapsulate the drive inside a bubble pack mailer or equivalent protective container and label the parcel "FRAGILE".

---

## 4. Electrostatic Discharge (ESD) Prevention

### 4.1 ESD Mechanism and Latent Degradation
* Electrostatic discharges from human contact or ungrounded equipment can destroy microcircuitry and semiconductor layers (`PDF p.32`, `Doc p.26`).
* Often, ESD events are silent and unfelt, yet inflict irreversible damage. Affected components may pass functional testing initially but suffer from latent gate degradation, dramatically shortening component operational lifespan.
* Built-in silicon protective clamps offer limited protection; static discharges frequently deliver sufficient energy to alter silicon junction characteristics or permanently fuse internal circuitry.

### 4.2 Protective Procedures
* Store replacement components in electrostatic-safe packaging until final installation.
* Ground technician personal static charge via certified ESD wrist straps and grounded work surfaces prior to handling sensitive parts.
* Do not touch conductive pins, component leads, or printed circuit traces; maintain minimal contact with electronic subassemblies.
* Recognize that static generation increases significantly in low-humidity environments, requiring strict compliance with ESD mitigation protocol.
