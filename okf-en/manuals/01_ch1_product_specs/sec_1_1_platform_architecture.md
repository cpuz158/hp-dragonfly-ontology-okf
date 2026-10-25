---
type: section
title: 'Chapter 1 Table 1-1 — Product Description: 12th Gen Intel Alder Lake-U Processors, Iris Xe Graphics & 13.5" 3:2 Display (PDF p.7 · Doc p.1)'
description: 'Covers HP Dragonfly Folio 13.5 G3 12th Gen Intel Core processors (i7-1265U, i7-1255U, i5-1245U, i5-1235U), Intel Iris Xe Graphics, and 13.5-inch 3:2 WUXGA+ / 3K2K OLED touch displays from Table 1-1 (PDF p.7 / Doc p.1).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=7
  kind: origin_document
  sha256: 5ec0c7cb8bdd4bb4a32fa35735475706e45e57852fc43ba5379ad4622165f9a7
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/01_ch1_product_specs/sec_1_1_platform_architecture.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 01_ch1_product_specs
sequence: 1
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.1 Table 1-1 (Processors, Graphics & Display)'
source_page: 7
source_pages_span: 'PDF p.7 (Doc p.1)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 1 Table 1-1 — Product Description: 12th Gen Intel Alder Lake-U Processors, Iris Xe Graphics & 13.5" 3:2 Display (PDF p.7 · Doc p.1)

## 1. Overview and Product Description

This section details the platform architecture, processor specifications, graphics subsystem, 13.5-inch 3:2 display panels, and onboard system memory from **Table 1-1 (Product components and their descriptions)** of the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (Document Part Number: `N17344-001`, PDF p.7 / Doc p.1).

Ontology Graph Reference Mapping:
- Representative Enterprise 5G SKU: `SKU-DFG3-I732-5G`
- Onboard System Board Spare Part Number (e.g., i7-1265U / 32 GB LPDDR5): `N20728-601`
- Display Subsystem & Panel Assembly Linkage IDs: `M90788-601` / `N19201-601`

---

## 2. Table 1-1: Product Components and Their Descriptions (PDF p.7 / Doc p.1)

### 2.1 Processors

The notebook is powered by 12th generation Intel® Core™ mobile processors (Alder Lake-U architecture, 10-core hybrid configuration):

| Processor Model | Base Clock & Max Turbo Frequency | Cores | Intel Smart Cache |
| :--- | :--- | :--- | :--- |
| **Intel Core i7-1265U processor** | 1.8 GHz (max turbo frequency 4.8 GHz) | 10 cores (2P + 8E) | 12 MB Intel® Smart Cache |
| **Intel Core i7-1255U processor** | 1.7 GHz (max turbo frequency 4.7 GHz) | 10 cores (2P + 8E) | 12 MB Intel® Smart Cache |
| **Intel Core i5-1245U processor** | 1.2 GHz (max turbo frequency 4.4 GHz) | 10 cores (2P + 8E) | 12 MB Intel® Smart Cache |
| **Intel Core i5-1235U processor** | 1.3 GHz (max turbo frequency 4.4 GHz) | 10 cores (2P + 8E) | 12 MB Intel® Smart Cache |

---

### 2.2 Graphics Subsystem

Integrated **Intel Iris® Xe Graphics** subsystem features:

- **Hardware Decode & Video Standard**: Supports HD Decode, DX12, HDMI™ 2.0
- **DirectX Support**: DirectX 12.1
- **OpenGL Support**: OpenGL 4.6
- **OpenCL Support**: OpenCL 3.0
- **Displays Supported**: Up to 4 simultaneous independent displays
- **Multiformat Codec Engines**: 2 hardware engines

---

### 2.3 Display Panel Specifications

All configurations feature a 34.3 cm (13.5 in) 3:2 aspect ratio display with touch screen support, Corning® Gorilla® Glass 7 protection, and HP Eye Ease low blue light technology:

| Resolution | Panel Tech & Surface | Color Gamut | Brightness | Privacy Feature |
| :--- | :--- | :--- | :--- | :--- |
| **WUXGA+ (1920 × 1280)** | IPS UWVA, BrightView Touch | sRGB 100% | 400 nits | Standard |
| **WUXGA+ (1920 × 1280)** | IPS UWVA, Antiglare Touch | sRGB 100% | 400 nits | Standard |
| **WUXGA+ (1920 × 1280)** | IPS UWVA, BrightView Touch | sRGB 100% | 1000 nits | HP Sure View Reflect integrated privacy screen |
| **3k2k (3000 × 2000)** | OLED, BrightView Touch | DCI-P3 100% | 400 nits | Standard |

---

### 2.4 System Memory

Memory is implemented as high-frequency low-power soldered system RAM:

- **Type & Upgradability**: Onboard, non-upgradable memory supporting up to 32 GB of RAM
- **Standard & Architecture**: LPDDR5-6400, supports dual-channel memory
- **Supported Memory Configurations**:
  - 32 GB (maximum capacity, paired with system board spare parts such as `N20728-601` under `SKU-DFG3-I732-5G`)
  - 16 GB
  - 8 GB
