---
type: section
title: 'Chapter 8 §8.1–8.2 — Using HP PC Hardware Diagnostics (Windows & UEFI F2), 24-Digit Hardware Failure ID Code & LED Blink Codes (3.2 / 2.2 / 4.2) (PDF p.90–93 · Doc p.84–87)'
description: 'Details Chapter 8 (PDF pp. 90–93 / Doc pp. 84–87) HP PC Hardware Diagnostics Windows and UEFI (started via F2 at boot, generating 24-digit hardware failure ID codes, USB fallback) along with Caps Lock/Power LED blink codes (`LED 3.2` memory, `LED 2.2` BIOS, `LED 4.2` thermal/fan, `POST 601` battery).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- structured_table
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=90
  kind: origin_document
  sha256: afcaaaced23983e6210e01f596fbea5bd0c3ae83e953fba412e468b3ab55cee2
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 07_ch6_7_bios_diagnostics
sequence: 22
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.8 §8.1–8.2 (HP PC Hardware Diagnostics Windows/UEFI & LED Blink Codes)'
source_page: 90
source_pages_span: 'PDF p.90–93 (Doc p.84–87)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 8 §8.1–8.2 — Using HP PC Hardware Diagnostics (Windows & UEFI F2), 24-Digit Hardware Failure ID Code & LED Blink Codes (3.2 / 2.2 / 4.2) (PDF p.90–93 · Doc p.84–87)

## 1. Overview and Diagnostic Suite Architecture

The HP PC Hardware Diagnostics utility provides comprehensive isolation testing to verify whether the computer hardware of the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC is functioning properly (PDF p.90, Doc p.84). The suite is provided in three distinct implementations:

1. **HP PC Hardware Diagnostics Windows**: Runs within the Windows operating system to diagnose component-level hardware failures (select products only).
2. **HP PC Hardware Diagnostics UEFI**: Operates outside the operating system at the pre-boot firmware level, isolating hardware failures from OS or software anomalies.
3. **Remote HP PC Hardware Diagnostics UEFI**: A firmware-level feature designed for enterprise remote diagnostic deployment (select products only).

---

## 2. Operating HP PC Hardware Diagnostics Windows & 24-Digit Failure ID (PDF p.90–92, Doc p.84–86)

### 2.1 Using a 24-Digit Failure ID Code
When the Windows diagnostic utility detects a condition requiring physical component replacement, a unique **24-digit failure ID code** is generated.
* **Interactive Tests**: Component tests requiring user interaction (keyboard, mouse, audio/video palette) require troubleshooting steps prior to failure ID generation.
* **Failure ID Case Submission Options**:
  1. Select **Next** to automatically launch the Event Automation Service (EAS) page to log the service case.
  2. Scan the on-screen **QR code** using a mobile device to navigate to the EAS portal.
  3. Select the checkbox adjacent to the 24-digit failure ID to copy the code to the clipboard and transmit it to HP support.

### 2.2 Accessing the Windows Diagnostic Tool
* **Via HP Support Assistant (PDF p.90, Doc p.84)**:
  1. Select the Search icon in the taskbar, enter `support`, and open the HP Support Assistant app (or select the `?` icon in the taskbar).
  2. Navigate to **Fixes & Diagnostics**.
  3. Select **Run hardware diagnostics**, then select **Launch**.
  4. Choose the target diagnostic test and follow on-screen prompts (select `Cancel` to halt a test).
* **Via the Start Menu (PDF p.91, Doc p.85)**:
  1. Select the **Start** button, then select **All apps**.
  2. Select **HP PC Hardware Diagnostics Windows**.
  3. Select the required test suite.

### 2.3 Downloading and Installing Windows Diagnostics (PDF p.91–92, Doc p.85–86)
Because download packages are distributed exclusively as `.exe` binaries, a Windows computer must be used.
* **From HP TechCenter**: Visit `http://www.hp.com/go/techcenter/pcdiags` → select `Download HP Diagnostics Windows` → save to local storage or a USB flash drive.
* **From the Microsoft Store**: Search for `HP PC Hardware Diagnostics Windows` in the Microsoft Store app and proceed with installation.
* **By Product Name/Number**: Go to `http://www.hp.com/support` → select `Software and Drivers` → enter product number/name → under `Diagnostics`, download the executable.
* **Installation**: Double-click the downloaded `.exe` file on local storage or the USB drive and follow standard installation wizards.

---

## 3. Operating HP PC Hardware Diagnostics UEFI (PDF p.92–93, Doc p.86–87)

If the system fails to boot into Windows, HP PC Hardware Diagnostics UEFI provides hardware isolation testing at the firmware layer.

* **Convertible Operating Prerequisite**: The convertible unit must be configured in notebook mode, and the attached physical keyboard must be used.
* **UEFI Invocation Procedure**:
  1. Power on or restart the system, and immediately press `esc` repeatedly.
  2. Press `f2` upon entering the Startup Menu.
  3. The BIOS searches for the diagnostic tools across three repositories in sequential priority (PDF p.92–93, Doc p.86–87):
     - **a. Connected USB flash drive**
     - **b. Hard drive / SSD**
     - **c. BIOS (Firmware ROM)**
  4. Once loaded, select the desired diagnostic test suite (press `esc` to cancel execution).
* **UEFI 24-Digit Failure ID Processing**:
  - Select **Contact HP**, accept the privacy disclaimer, and scan the displayed QR code with a mobile phone. The service center web portal opens with the serial number and failure ID automatically populated.

---

## 4. Ontology Cross-Reference & Blink/POST Code Matrix

Diagnostic outcomes and boot failures correspond directly to the technical troubleshooting subsystem ontology (`TS-DFG3-001`).

| Identifier | Diagnostic Pattern / Indicator | Subsystem / Root Failure Cause | Remediation & Service Guideline |
| :--- | :--- | :--- | :--- |
| `LED-3-2` | Caps Lock/Num Lock 3 Slow + 2 Fast blinks | **Memory Module Failure** (LPDDR5 memory initialization failure) | Execute hard reset/flea power drain; if persistent, replace system board (`TS-DFG3-001`) |
| `LED-2-2` | Caps Lock/Num Lock 2 Slow + 2 Fast blinks | **BIOS/Firmware Corruption** (Main BIOS image integrity failure) | Perform HP BIOS Recovery (`Win + B` or `Win + V` key sequence with external recovery USB) |
| `LED-4-2` | Caps Lock/Num Lock 4 Slow + 2 Fast blinks | **Thermal Sensor / Fan Failure** (Critical over-temperature trip) | Inspect cooling fan operation, clean thermal vents, reseat heatsink and replace thermal interface material |
| `POST-601` | Screen error code ("POST Error 601") | **Primary Battery Health Depletion** (Primary battery failure) | Run UEFI Battery Check, log 24-digit Failure ID, and replace the primary battery pack |
| `EAS-24-ID` | 24-Digit Failure Code (Windows / UEFI) | Specific component failure confirmed | Log via Event Automation Service (EAS) or QR scanner to initiate RMA part dispatch |
