---
type: section
title: 'Chapter 10 Using HP Sure Start (Doc p.97), Chapter 11 Recycling, Chapter 12 Power Cord Requirements & Thermal Governance Gate [SOP Art.2] (PDF p.101–106 · Doc p.95–100)'
description: 'Covers Chapter 10 Nonvolatile Memory Q&A and Using HP Sure Start automatic BIOS recovery (PDF pp. 101–103 / Doc pp. 95–97), Chapter 11 Battery/Hardware Recycling (PDF p. 104 / Doc p. 98), Chapter 12 Country-specific Power Cord Set Requirements (PDF pp. 105–106 / Doc pp. 99–100), and SOP Article 2 thermal/heatsink governance.'
version: '0.2.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=103
  kind: origin_document
  sha256: 960dee0c91f0daa37c71b3ff5414a271e6ae49240076070c78893b4b573d1acf
source_uri: gs://hp-dragonfly-okf/okf-en/internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: verified
part_of: 08_internal_field_sop_playbooks
sequence: 25
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.10 (Sure Start), Ch.11 (Recycling), Ch.12 (Power Cords) & Thermal Governance [SOP Art.2]'
source_page: 103
source_pages_span: 'PDF p.101–106 (Doc p.95–100)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 10 Using HP Sure Start (Doc p.97), Chapter 11 Recycling, Chapter 12 Power Cord Requirements & Thermal Governance Gate [SOP Art.2] (PDF p.101–106 · Doc p.95–100)

## 1. Overview & Nonvolatile Memory Volatility Governance (PDF p.101–103 · Doc p.95–97)

This section defines technical specifications, UEFI BIOS recovery routines, `HP Sure Start` autonomous restoration mechanics, and field service governance (SOP Art.2) for the HP Dragonfly Folio 13.5" G3 2-in-1 Notebook PC.

### Nonvolatile Memory Characteristics (PDF p.101 · Doc p.95)

* **802.11 WLAN EEPROM**: Sized at 4 Kb to 8 Kb; retains system configuration and calibration data without storing customer data. Programmed during factory manufacturing; modification utilities are restricted from public release.
* **Camera Flash (Select Products Only)**: 64 Kb capacity; stores camera operational firmware and sensor configuration. It does not retain user data and is flashed via manufacturer utility packages.
* **Fingerprint Reader Flash (Select Products Only)**: 512 KB flash memory storing encrypted biometric fingerprint templates. Programmed through HP ProtectTools Security Manager; write operations require digitally signed calls.

### BIOS Restoration & Custom Secure Boot Key Deletion (PDF p.101–103)

1. **BIOS Factory Default Restoration**:
   * Power cycle or restart the device, immediately pressing `Esc` to enter setup.
   * Select `Main` -> `Apply Factory Defaults and Exit`, then confirm with `Save Changes and Exit`.
   * *Important*: Restoring defaults does not sanitize user storage drives nor clear Custom Secure Boot Keys.
2. **Clearing Custom Secure Boot Keys (PDF p.102–103 · Doc p.96–97)**:
   * Access BIOS via `Esc` key during boot.
   * Navigate to `Security` -> `Secure Boot Configuration`.
   * Select `Secure Boot`, then execute `Clear Secure Boot Keys` and follow instructions to erase all custom keys.

---

## 2. Using HP Sure Start (PDF p.103 · Doc p.97)

Select computer models are configured with HP Sure Start, an active hardware-enforced protection technology that continuously monitors system BIOS for attacks or integrity corruption.

* **Autonomous Self-Healing**: If BIOS corruption occurs or a firmware attack is detected, HP Sure Start automatically restores the platform BIOS to its previously safe state without requiring manual user intervention.
* **Factory-Enabled Deployment**: Qualifying systems ship with HP Sure Start pre-configured and enabled by default for baseline reliability, while advanced administrators can adjust settings.

---

## 3. Recycling & Power Cord Specifications (PDF p.104–106 · Doc p.98–100)

### Component Recycling Policies (Chapter 11, PDF p.104 · Doc p.98)
* Nonrechargeable and rechargeable batteries must not be discarded in general household waste at end-of-life; disposal must adhere to local statutory regulations.
* Electronic hardware and spent HP print cartridges should be channeled through HP recycling programs (`hp.com/recycle`).

### Power Cord Set Criteria (Chapter 12, PDF p.105–106)
To maintain compliance with the wide-range input power supply, certified power cables matching specific territorial standards must be deployed:

| Country / Region | Electrical Rating | Plug & Conductor Requirements |
| :--- | :--- | :--- |
| **United States / North America** | `10 A / 125 V` | NEMA 5-15P plug, 3-conductor grounded cord, UL/CSA listed |
| **Europe & International** | `2.5 A / 230 V` (or `10 A / 250 V`) | CEE 7/7 or relevant agency-approved molded plug and cable |

---

## 4. [Field SOP Art. 2] Thermal Governance & Heatsink Replacement (`SAFE-DFG3-THM`)

1. **Pre-Replacement Thermal Diagnostics Gate**:
   * Prior to physical removal or replacement of the heatsink or cooling fan, technicians must verify system thermal metrics using Intel Dynamic Tuning Technology (DPTF) diagnostic traces and HP Support Assistant logs.
2. **Thermal Interface Material (TIM) Replacement Mandate**:
   * Whenever a heatsink assembly is detached from the system board, old thermal grease and pads must be thoroughly cleaned off using approved solvents.
   * Fresh thermal material complying with `SAFE-DFG3-THM` standards must be reapplied to processor dies and thermal pads positioned on designated secondary components.
   * Fastening screws must be torqued in the strict numbered diagonal pattern (1 -> 2 -> 3 -> 4) cast onto the heatsink frame to maintain uniform pressure and prevent core cracking.
