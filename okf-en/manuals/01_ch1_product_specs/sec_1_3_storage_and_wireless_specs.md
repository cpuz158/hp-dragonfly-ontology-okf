---
type: section
title: 'Chapter 1 Table 1-1 — M.2 2280 PCIe Gen4 NVMe Storage, 8MP IR Camera, Wi-Fi 6E AX211, 5G WWAN, TPM 2.0 & 53Whr Battery (PDF p.8–10 · Doc p.2–4)'
description: 'Details Table 1-1 specifications for M.2 2280 PCIe Gen4x4 NVMe SSDs (256GB–2TB), 8MP MIPI + IR camera, Bang & Olufsen quad speakers, Intel AX211 Wi-Fi 6E, Intel 5000 5G / XMM 7560 R+ WWAN, Infineon SLB9672 TPM 2.0, and 4-cell 53Whr battery.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=8
  kind: origin_document
  sha256: 3886a257d8b375f821aceb1e3a437e0d553324b88e6eb30e97e9ecf1f764dda4
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: 01_ch1_product_specs
sequence: 3
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: procedural
section_number: 'Ch.1 Table 1-1 (Storage, Camera, Wireless, TPM & Battery)'
source_page: 8
source_pages_span: 'PDF p.8–10 (Doc p.2–4)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 1 Table 1-1 — M.2 2280 PCIe Gen4 NVMe Storage, 8MP IR Camera, Wi-Fi 6E AX211, 5G WWAN, TPM 2.0 & 53Whr Battery (PDF p.8–10 · Doc p.2–4)

The primary storage, audio/video, wireless networking (WLAN/WWAN), ports, sensors, security modules, keyboard, and power specifications for the HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC are detailed in Table 1-1 of the official Maintenance and Service Guide (PDF p.8–10 · Doc p.2–4).

---

## 1. Primary Storage Specifications

The notebook supports M.2 2280 form factor PCIe NVMe solid-state drives (SSDs) across various performance tiers, including TLC (triple-level cell) and self-encrypting drives (SED OPAL2).

| Storage Capacity & Configuration | Technical Interface & Encryption | Spare Part Number |
| :--- | :--- | :--- |
| **2 TB**, TLC | M.2 2280 PCIe-4×4 NVMe SSD | `M16560-005` |
| **1 TB**, TLC | M.2 2280 PCIe-4×4 NVMe SSD | `M52027-005` |
| **512 GB**, TLC (SED) | M.2 2280 PCIe-4×4 NVMe Self-Encrypting Drive (OPAL2) | `M52031-005` (or `M90790-001`) |
| **512 GB**, TLC | M.2 2280 PCIe-4×4 NVMe SSD | Standard TLC spares catalog |
| **512 GB**, Value | M.2 2280 PCIe NVMe Value SSD | Value line spares catalog |
| **256 GB**, TLC (SED) | M.2 2280 PCIe NVMe Self-Encrypting Drive (OPAL2) | Standard SED spares catalog |
| **256 GB**, TLC | M.2 2280 PCIe NVMe SSD | Standard TLC spares catalog |

---

## 2. Audio and Video

* **Audio Tuning**: Audio by Bang & Olufsen
* **Speaker Subsystem**: Quad stereo speakers
* **Microphone Setup**: Integrated dual top-edge microphones
* **Amplification**: Discrete amplifiers
* **Camera**: 8 MP IR (Infrared) camera with a 100° ultrawide viewing angle and dedicated hardware HP Camera Privacy Key

---

## 3. Wireless Specifications (WLAN & WWAN)

### Wireless Local Area Network (WLAN — Onboard, Not Removable)
The WLAN module is soldered directly onto the system board and cannot be removed or upgraded independently.
* **Intel AX211 Wi-Fi® 6E + Bluetooth® 5.2 WLAN**
* **Intel AX211 Wi-Fi 6E + Bluetooth 5.2 vPro WLAN**
* **Advanced Wireless Features**:
  - Miracast® support
  - HP LAN-Wireless Protection support (automated WLAN/LAN/WWAN switching)
  - HP Connection Optimizer & HP Extended Range Wireless LAN
  - UEFI Wi-Fi support
  - Indonesia New Band compliance
  - Time Average Power support for WLAN
  - Dynamic Antenna gain support (EU only)
  - InTile tracking capability support
  - BT Audio Offload for A2DP support

### Wireless Wide Area Network (WWAN — Select Products Only)
* **Intel 5000 5G Solution WWAN**:
  - Integrated eSIM on module
  - Socket form factor: M.2 3052 PCIe socket (`N00182-005` / `M90792-001`)
* **Intel XMM 7560 R+ LTE-Advanced Pro WWAN (Cat 16)**:
  - Integrated eSIM on module
  - Global Series network band support
  - Socket form factor: M.2 3042 PCIe socket (`M52040-005`)

---

## 4. Input/Output Ports & Sensors

* **Physical Ports**:
  - (1) Audio-out (headphone)/audio-in (microphone) combo jack
  - (2) USB Type-C® power connectors and Thunderbolt™ ports with HP Sleep and Charge
* **Integrated Sensor Suite**:
  - Hall sensor
  - Accelerometer + Gyroscope + eCompass
  - Ambient light sensor
  - Adaptive color sensor
  - IR thermal sensor
  - Magnetometer
  - Time of Flight (ToF) proximity sensor

---

## 5. Security, Input & Power Requirements

* **Hardware Security (TPM)**:
  - Trusted Platform Module (TPM) 2.0
  - Controller: Infineon **SLB9672** (SLB9672VU2.0, Firmware Version: 15.21)
  - FIPS 140-2 compliant, IPv6 supported
* **Keyboard & Pointing Devices**:
  - HP Premium Keyboard (Backlit, spill resistant)
  - Backlit, spill resistant privacy filter option
  - Precision Clickpad with multi-touch gesture support
  - HP Dragonfly Folio Pen (select products only)
* **Primary Battery**:
  - 4-cell, 53 Whr HP Long Life Li-ion polymer battery
  - Supports HP Fast Charge Technology
* **AC Power Adapters & Cords**:
  - 65 W slim, nPFC, USB Type-C (1.8 m / 6 ft)
  - 65 W standard, nPFC, USB Type-C (1.8 m / 6 ft)
  - Power cord: C5, 1.0 m (3.3 ft) premium or standard

---

## 6. Serviceability Classification

Under HP Customer Self-Repair (CSR) guidelines, only the following items are designated as end-user replaceable parts:
* **AC adapter**
* **Digital Pen**

All internal hardware components—including the M.2 SSD, 53 Whr battery, and WWAN module—require service by an authorized service provider.
