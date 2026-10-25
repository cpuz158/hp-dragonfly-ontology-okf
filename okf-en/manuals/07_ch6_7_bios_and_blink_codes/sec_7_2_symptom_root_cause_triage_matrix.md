---
type: section
title: 'Chapter 8 §8.3 — Remote HP PC Hardware Diagnostics UEFI Settings (F10 BIOS) & 6-Scenario Field Triage Matrix (TS-DFG3-001–006) (PDF p.93–94 · Doc p.87–88)'
description: 'Covers Chapter 8 §8.3 (PDF pp. 93–94 / Doc pp. 87–88) Remote HP PC Hardware Diagnostics UEFI configuration in F10 Computer Setup -> Advanced and the 6-scenario field symptom-to-root-cause triage matrix (`TS-DFG3-001` through `TS-DFG3-006`).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 07_ch6_7_bios_and_blink_codes
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=93
  kind: origin_document
  sha256: 966a1940365d3b5adebaade4153daa93a1e75b2438981d21f352422e0fef8012
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 07_ch6_7_bios_diagnostics
sequence: 23
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.8 §8.3 (Remote HP PC Hardware Diagnostics UEFI & Symptom Triage Matrix)'
source_page: 93
source_pages_span: 'PDF p.93–94 (Doc p.87–88)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 8 §8.3 — Remote HP PC Hardware Diagnostics UEFI Settings (F10 BIOS) & 6-Scenario Field Triage Matrix (TS-DFG3-001–006) (PDF p.93–94 · Doc p.87–88)

## 1. Overview and Diagnostic Tool Download Procedures

Hardware diagnosis on the HP Dragonfly Folio 13.5" G3 2-in-1 Notebook PC can be executed through multiple media paths: the factory preinstallation image, local `HP_TOOLS` drive partitions, system firmware, connected USB flash drives, or over an enterprise network (`PDF p.93, Doc p.87`).

### Local Storage Search Order & Execution Priority
When accessing the diagnostics environment, the system searches in the following hierarchical order:
1. Connected USB flash drive
2. Local internal hard drive / SSD
3. System BIOS

When the diagnostic tool opens, select the diagnostic test type and follow the on-screen instructions.

### Downloading HP PC Hardware Diagnostics UEFI to a USB Flash Drive
Downloading the diagnostic suite to an external USB flash drive is necessary when:
- The tool is missing from the preinstallation operating system image.
- The HP Tool partition has been erased, corrupted, or not created.
- The primary internal hard drive / SSD is damaged or inoperable.

> **NOTE:** Download instructions are provided in English only. Because only executable (`.exe`) setup packages are provided, you must use a Windows computer to download and create the bootable HP UEFI support environment.

#### Downloading the Latest Version
1. Navigate to `http://www.hp.com/go/techcenter/pcdiags` (the HP PC Diagnostics home page is displayed).
2. Select **Download HP Diagnostics UEFI**, and then select **Run**.

#### Downloading by Product Name or Number
1. Navigate to `http://www.hp.com/support`.
2. Enter the product name or number (e.g., HP Dragonfly Folio 13.5 inch G3), select your computer, and select the installed operating system.
3. Under the **Diagnostics** section, follow the on-screen instructions to download the specific UEFI Diagnostics package.

---

## 2. Using Remote HP PC Hardware Diagnostics UEFI Settings (F10 BIOS)

Remote HP PC Hardware Diagnostics UEFI is a firmware (BIOS) feature that downloads the diagnostic software directly to the computer over the network, executes tests locally, and automatically uploads the resulting telemetry to a preconfigured server (`PDF p.93–94, Doc p.87–88`). Local physical storage (hard drive or USB drive) is not required.

### Downloading Remote Diagnostics
HP Remote PC Hardware Diagnostics UEFI is available as a deployable SoftPaq package:
- **Diagnostic Portal**: Access `http://www.hp.com/go/techcenter/pcdiags` and select **Download Remote Diagnostics** > **Run**.
- **Support Portal**: Go to `http://www.hp.com/support`, select **Software and Drivers**, enter the product identifier, and locate the Remote UEFI package under **Diagnostics**.

### Customizing Settings in Computer Setup (BIOS F10)
1. Turn on or restart the computer. When the HP logo appears, press `f10` to enter **Computer Setup**.
2. Select **Advanced**, and then select **Settings**.
3. Configure the following parameters:
   - **Unattended Execution Schedule**: Set a timer for unattended background diagnostics, or select **Execute Remote HP PC Hardware Diagnostics** for immediate interactive testing.
   - **Download Location**: Set the server source to fetch diagnostic tools (HP official repository or custom intranet server).
   - **Results Storage Location & Credentials**: Specify the upload server URI, along with the designated upload username and password.
   - **Previous Execution Status**: Review status logs from previously completed diagnostic runs.
4. Select **Exit**, then select **Save Changes and Exit**. Changes will take effect upon system reboot (`PDF p.94, Doc p.88`).

---

## 3. Field Symptom Root-Cause Triage Matrix (TS-DFG3-001 through TS-DFG3-006)

Before initiating physical component replacements, field service technicians must triage device failures against the following 6-scenario root-cause matrix.

| Triage ID | Symptom Category | Potential Root Cause | Step-by-Step Triage & Action Sequence | Primary Replacement Candidate (FRU) | Verification Criteria & Remarks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TS-DFG3-001** | No Power / No POST | Deeply discharged battery, defective USB-C charging port, open DC-in power rail | 1. Connect authorized 65W/100W AC adapter for >=15 min.<br>2. Execute 15-second hard power-button reset.<br>3. Attempt BIOS Recovery shortcut (`Win + B`). | System Board / USB-C Sub-assembly | Verify charge LED indicator behavior |
| **TS-DFG3-002** | No Video / Blink Codes (Caps 3.2 / 5.3) | Memory initialization failure, eDP harness disconnect, display panel rail collapse | 1. Test external display via HDMI or Type-C.<br>2. Decode Caps Lock blink sequence (3.2/5.3).<br>3. Review Remote Diagnostics log in F10 BIOS. | Display Assembly / System Board | Prioritize BIOS firmware recovery before replacement |
| **TS-DFG3-003** | Boot Device Not Found (3F0) | Disseated M.2 NVMe SSD, corrupt partition tables, PCIe lane link failure | 1. Run Storage Component Test via F2/F10 UEFI.<br>2. Inspect M.2 thermal shielding and fastening torque.<br>3. Boot from external USB diagnostic environment to isolate drive. | M.2 Solid-State Drive (SSD) | Exclude seating/interface contamination first |
| **TS-DFG3-004** | Excessive Heat & Fan Noise | Degraded thermal interface material, debris clogging fan vents, thermal policy misconfiguration | 1. Execute System Fan Test via UEFI Diagnostics.<br>2. Clean fan blades and exhaust fins.<br>3. Inspect thermal module screw tension sequence (1 through 4). | Fan / Heat Sink Thermal Module | Verify baseline CPU load under clean OS environment |
| **TS-DFG3-005** | Rapid Battery Drain / Not Charging | Cell degradation, blown protective fuse, charging controller/EC state desynchronization | 1. Run Battery Check in F2 UEFI Component Tests.<br>2. Inspect cycle count and Full Charge Capacity (FCC).<br>3. Verify Type-C adapter and cable with test load. | Rechargeable Battery Pack (68 Wh / 53 Wh) | Validate failure code via Advanced Battery Check |
| **TS-DFG3-006** | Digitizer & Touch Screen Failure | Loose Wacom digitizer FPC, grounding/shielding defect, stylus battery depleted | 1. Verify touch coordinates in UEFI Touch Test interface.<br>2. Check stylus charge level and tip integrity.<br>3. Inspect display hinge FPC routing and connector latches. | Touch/Pen Controller FPC, Display Panel, Wireless Pen | Perform visual inspection for physical flex cable damage |

> **Operational KPI Guideline:** To minimize unnecessary module swap costs, software and firmware diagnostics must be completed prior to dispatching replacement components. The field hardware replacement rate (`hardware-fru-replacement-rate`) must be maintained at **<= 12.0%**.
