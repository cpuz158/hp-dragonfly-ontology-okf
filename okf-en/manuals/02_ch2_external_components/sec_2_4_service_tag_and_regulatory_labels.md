---
type: section
title: 'Chapter 2 Tables 2-7 & 2-8 — Bottom Speakers/Vents, Service Labels (Serial Number, Product ID, Warranty) & Inserting a Nano SIM Card (PDF p.18–21 · Doc p.12–15)'
description: 'Details Bottom components (Table 2-7: speakers and airflow vents), Service and regulatory labels (Table 2-8: Product name, Serial number, Product ID, Warranty period), and step-by-step Nano SIM card insertion under the magnetic pen dock.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 02_ch2_external_components
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=18
  kind: origin_document
  sha256: ef99f88ceabf4df2bbd518148b25373a0f806b91894b6ba1eb08a2c081480d52
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/02_ch2_external_components/sec_2_4_service_tag_and_regulatory_labels.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 02_ch2_components_ports
sequence: 7
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.2 Tables 2-7 & 2-8 (Bottom Vents, Labels & Nano SIM Card)'
source_page: 18
source_pages_span: 'PDF p.18–21 (Doc p.12–15)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 2 Tables 2-7 & 2-8 — Bottom Speakers/Vents, Service Labels (Serial Number, Product ID, Warranty) & Inserting a Nano SIM Card (PDF p.18–21 · Doc p.12–15)

This document provides comprehensive technical details for the bottom components, service and regulatory labels, and the nano SIM card installation and removal procedures on the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC.

---

## 1. Bottom Components

The bottom of the chassis houses ventilation slots required for proper thermal management and internal airflow (`PDF p.19`, `Doc p.13`).

### Table 2-7 Bottom components and their descriptions
| Component | Description |
| :--- | :--- |
| **Vent** | Enable airflow to cool internal components.<br>**NOTE:** The computer fan starts up automatically to cool internal components and prevent overheating. It is normal for the internal fan to cycle on and off during routine operation. |

---

## 2. Service and Regulatory Labels

The labels affixed to the computer or imprinted on the housing provide essential identifying information required during technical troubleshooting, warranty verification, or international travel (`PDF p.19–20`, `Doc p.13–14`).

> **IMPORTANT:**
> Check the following locations for the labels described in this section:
> - The bottom of the computer
> - Inside the battery bay
> - Under the service door
> - On the back of the display
> - On the bottom of a tablet kickstand

### Service Label Layouts (Tables 2-8, 2-9, 2-10)
When contacting HP Support, you may be asked to provide the serial number, product ID, or model number. Depending on the production revision, the service label matches one of the following layouts:

#### Table 2-8 Service label components
| Item | Component |
| :---: | :--- |
| **(1)** | Serial number |
| **(2)** | Product ID |
| **(3)** | HP product name |

#### Table 2-9 Service label components
| Item | Component |
| :---: | :--- |
| **(1)** | HP product name |
| **(2)** | Product ID |
| **(3)** | Serial number |
| **(4)** | Warranty period |

#### Table 2-10 Service label components
| Item | Component |
| :---: | :--- |
| **(1)** | HP product name |
| **(2)** | Warranty period |
| **(3)** | Product ID |
| **(4)** | Serial number |

### Additional Labels
- **Regulatory labels:** Provide regulatory and legal compliance information about the computer.
- **Wireless certification labels:** Provide regulatory compliance and approval markings for optional wireless and WWAN devices in various countries or regions.

> **Domain & System Board Replacement Linkage:**
> Following a System Board replacement, service technicians must re-program the DMI (Desktop Management Interface) data via official HP service tools using the Serial Number and Product ID recorded on the service label (Table 2-8). Failure to reprogram the DMI correctly will result in invalid serial number alerts, failed Windows activation, and software entitlement issues.

---

## 3. Using a SIM Card (Select Products Only)

For configurations equipped with mobile broadband (WWAN), follow these instructions to determine the correct SIM format and handle nano SIM cards (`PDF p.20–21`, `Doc p.14–15`).

> **IMPORTANT:**
> Inserting the wrong size SIM card or inserting the card/tray in the incorrect orientation can damage the card and slot pins, or cause the card to become lodged. **Do not use SIM card adapters.** To prevent physical damage to the SIM card or internal connectors, apply minimal force during insertion and removal.

### Determining the Correct SIM Card Size
1. Navigate to `http://www.hp.com/support` and search by computer product name or number.
2. Select **Product Information**.
3. Refer to the listed hardware options to confirm compatible nano SIM specifications.

### Inserting a Nano SIM Card
1. Turn off the computer by using the operating system **Shut down** command.
2. Position the computer display-side up on a clean, flat surface.
3. Press in gently on the SIM card access tray to disengage the internal SIM lock; the tray will pop out of the chassis slot (1).
4. Pull the tray (2) completely out of the slot and position the nano SIM card (3) into the tray recess.
5. Reinsert the tray into the computer slot. Press in gently on the tray (4) until it clicks and is firmly seated flush with the chassis.

### Removing a Nano SIM Card
1. Press in gently on the SIM card access tray to disengage the spring lock mechanism until the tray pops outward.
2. Remove the nano SIM card from the tray.
3. Reinsert the empty tray into the slot and press gently inward until firmly locked.
