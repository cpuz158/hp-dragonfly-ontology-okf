---
type: section
title: 'Chapters 6 & 7 — Backing Up/Recovering (HP Sure Recover), Computer Setup (F10 BIOS), BIOS Update, Boot Order (F9), TPM 2.0 & HP Sure Start (PDF p.83–89 · Doc p.77–83)'
description: 'Covers Chapter 6 (PDF pp. 83–85: Windows backup, HP Cloud Recovery, system restore, HP Sure Recover) and Chapter 7 (PDF pp. 86–89: F10 Computer Setup, factory reset, BIOS update on AC power, F9 boot order, TPM 2.0 BIOS settings, and HP Sure Start automatic BIOS recovery).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=86
  kind: origin_document
  sha256: 20cd39925c4f719e5dba8a8b465b593f9a70435bbd7ccb57b4102dcb7c880907
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 07_ch6_7_bios_diagnostics
sequence: 21
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.6 & Ch.7 (System Recovery, Computer Setup BIOS, TPM 2.0 & HP Sure Start)'
source_page: 86
source_pages_span: 'PDF p.83–89 (Doc p.77–83)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapters 6 & 7 — Backing Up/Recovering (HP Sure Recover), Computer Setup (F10 BIOS), BIOS Update, Boot Order (F9), TPM 2.0 & HP Sure Start (PDF p.83–89 · Doc p.77–83)

## 1. Overview and Recovery Prerequisites (PDF p.83–85 · Doc p.77–79)

A range of backup and recovery mechanisms are provided to quickly return the system to an operational state following system corruption or software failure.

### Critical Prerequisites
* **Battery Charge Level**: If executing recovery procedures on a tablet, the battery charge must be at least 70% before initiating the process.
* **Keyboard Attachment**: For systems featuring a detachable keyboard, ensure the tablet is securely connected to its keyboard base prior to starting recovery.
* **Initial Backup**: Performing a system backup immediately after initial configuration using external USB flash drives or network destinations is strongly advised.
* **Storage Constraints**: On configurations with internal storage of 32 GB or less, Microsoft System Restore is disabled by default.

### Recovery Methods and Sequences
1. **Microsoft System Restore**: Reverts system configurations and core system files to a predefined restore point.
2. **Reset This PC**: Reinstalls the operating system with options to retain files or clean the drive thoroughly before recycling.
3. **HP Recovery Media**: Created via the HP Cloud Recovery Download Tool on a bootable USB flash drive to reinstall factory images and platform drivers.
4. **HP Sure Recover**: A hardware- and software-integrated recovery architecture that restores the operating system image, platform-specific drivers, and custom image software over network connectivity without relying on local recovery partitions.

### Changing Computer Boot Order (Boot Options - F9)
If the system fails to boot directly into recovery media, adjust the startup device priority:
1. Power on or reboot the machine.
2. Press `Esc` promptly, then press `F9` from the startup menu to open Boot Device Options.
3. Select the attached bootable USB flash drive or optical drive to initiate setup.

---

## 2. Computer Setup (F10 BIOS) and Firmware Management (PDF p.86 · Doc p.80)

### Accessing Computer Setup
* **Functionality**: Basic Input/Output System (BIOS) manages device communication, memory mapping, and boot sequences across all integrated hardware.
* **Entry Method**: Power on or restart the device, and when the HP logo appears, immediately press `F10` to enter Computer Setup.
* **Caution**: Erroneous configuration modifications within BIOS can prevent regular system startup and hardware initialization.

---

## 3. Hardware Recovery Procedures: HP Sure Start and EC/CMOS Reset

Key recovery operations for firmware corruption or no-POST states are structured as follows:

| Recovery Mode | Target Hardware | Execution Procedure | Functional Description |
| :--- | :--- | :--- | :--- |
| **HP Sure Start SPI Recovery** | SPI Flash ROM / BIOS | `Win + B + Power` key sequence | While powered off, press and hold `Win` + `B`, press the Power button for 2–3 seconds, and release the Power button while holding keys to force SPI Flash restoration from the secure hardware controller. |
| **Hardware EC/CMOS Reset** | Embedded Controller (EC) / RTC | 15-second Power button hold | Disconnect AC power and hold the Power button down continuously for at least 15 seconds to discharge internal capacitors and clear volatile EC registers. |
