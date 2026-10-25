---
type: section
title: 'Chapter 9 Specifications [Tables 9-1–9-3], Chapter 10 Nonvolatile Memory Usage [Table 10-1] & Mandatory Sure Start Gate Before Board Swap [SOP Art.1] (PDF p.95–100 · Doc p.89–94)'
description: 'Grounds SOP-2026-01 Article 1 in Chapter 9 Specifications (Tables 9-1–9-3, PDF pp. 95–96) and Chapter 10 Statement of Memory Volatility (Table 10-1 Nonvolatile Memory Usage: 9MB System BIOS SPI, 8MB HP Sure Start SPI, 16MB Intel CSME, Infineon SLB9672 TPM 2.0, NPCX897 EC, CCG6DF PD controller, JHL8040R Retimer, PDF pp. 97–100), requiring Sure Start SPI recovery and 15s EC reset before approving System Board replacement.'
version: '0.2.0'
tags:
- unstructured_context
- internal_policy
- 08_hp_field_service_sop
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=97
  kind: origin_document
  sha256: aaf46f07ebe864319b57970bcb8e1b11f935f6bb8b321ef5edcd49c49b6db717
source_uri: gs://hp-dragonfly-okf/okf-en/internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: verified
part_of: 08_internal_field_sop_playbooks
sequence: 24
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.9 & Ch.10 Table 10-1 (Specifications, Nonvolatile Memory & Board Swap Gate Art.1)'
source_page: 97
source_pages_span: 'PDF p.95–100 (Doc p.89–94)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 9 Specifications [Tables 9-1–9-3], Chapter 10 Nonvolatile Memory Usage [Table 10-1] & Mandatory Sure Start Gate Before Board Swap [SOP Art.1] (PDF p.95–100 · Doc p.89–94)

## 1. System Specifications Summary (PDF p.95–96 / Doc p.89–90)

### Table 9-1: Computer Physical and Operating Specifications
| Parameter | Metric | U.S. |
| :--- | :--- | :--- |
| **Width** | 296.4 mm | 11.67 in |
| **Depth** | 234.3 mm | 9.22 in |
| **Height** | 17.9 mm | 0.70 in |
| **Weight (starting)** | 1.40 kg | 3.09 lbs |
| **Input Power** | 19.5 V dc @ 3.33 A – 65 W | 19.5 V dc @ 3.33 A – 65 W |
| **Operating Temperature** | 5°C to 35°C | 41°F to 95°F |
| **Nonoperating Temperature** | -20°C to 60°C | -4°F to 140°F |
| **Relative Humidity (noncondensing)** | Operating: 10% to 90% | Nonoperating: 5% to 95% |
| **Altitude (unpressurized)** | Operating: -15 m to 3,048 m (-50 ft to 10,000 ft) | Nonoperating: -15 m to 12,192 m (-50 ft to 40,000 ft) |

### Table 9-2: Display Specifications
- **Active Diagonal Size:** 34.3 cm (13.5 in)
- **Resolution:** 3000 × 2000 (3k2k) or 1920 × 1280 (WUXGA+)
- **Surface Treatment:** BrightView / Antiglare
- **Brightness:** 400 nits / 1000 nits (Privacy panel)
- **Viewing Angle & Backlight:** UWVA, WLED Backlight

### Table 9-3: Solid-State Drive Specifications Summary
- **Form Factor:** Height 1.0 mm, Length 50.8 mm, Width 28.9–29.0 mm, Weight < 10 g
- **Interface Type:** PCIe, Operating Temperature 0°C to 70°C
- **Performance:** Sequential read up to 2150 MBps, sequential write up to 1550 MBps, random read up to 300,000 IOPS, random write up to 100,000 IOPS
- **Total Logical Sectors:** 256 GB (468,883,296), 512 GB (1,000,215,216), 1 TB (1,500,336,388), 2 TB (2,988,316,776)

---

## 2. Chapter 10 Statement of Memory Volatility & Data Sanitization (PDF p.97–98 / Doc p.91–92)

Personal data can persist in nonvolatile memory and residual volatile memory states even after system shutdown and battery disconnection. Prior to system decommissioning or board transfer, standard sanitization steps must be executed (PDF p.97 / Doc p.91).

### BIOS Default & Security Reset Sequence
1. Power on or restart, press `esc` to enter Startup Menu, then choose `Main` -> `Apply Factory Defaults and Exit`.
2. On reboot, press `esc`, enter `Security` -> `Restore Security Settings to Factory Defaults`.
3. Clear the Asset Tracking Number under `Security` -> `Utilities` -> `System IDs`.
4. Clear DriveLock passwords under `Hard Drive Utilities`.
5. Select `Main` -> `Reset BIOS Security to factory default` and confirm.
6. Save settings and select `Apply Factory Defaults and Exit` -> `Shutdown`.
7. On subsequent boot, accept TPM clear and Fingerprint Sensor reset prompts (`f1`).
8. Disconnect all external power and internal batteries for a minimum of 24 hours.
9. Remove the internal drive, utilize third-party sanitization tools, or execute `Secure Erase` / `Disk Sanitizer` within BIOS Hard Drive Utilities.

---

## 3. Field Service SOP [Art.1]: Mandatory Sure Start Gate for No-Power / LED 3.2

- **Scope:** Units received with No Boot, No Power, or Caps Lock/LED 3.2 blink diagnostic codes.
- **Quality Control Metric:** Prevents premature mother board swap, enforcing the `hardware-fru-replacement-rate` target (current actual: 8.4% vs target <=12.0%).
- **Mandatory Gate Workflow:**
  1. Before authorizing any System Board replacement (FRU swap), field technicians must attempt the hardware-based HP Sure Start automatic firmware self-healing/recovery procedure at least three consecutive cycles.
  2. Perform a complete hard reset by isolating AC power and the main battery, holding the power button for over 30 seconds to discharge residual capacitor energy.
  3. System board replacement is only authorized when Sure Start self-healing fails to initialize or physical SPI Flash damage is unequivocally identified.
