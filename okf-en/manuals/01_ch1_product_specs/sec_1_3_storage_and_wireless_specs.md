---
type: Provision
title: 'Ch.1 §1.3 (M.2 2280 PCIe Gen4 NVMe Storage & Wi-Fi 6E / 5G WWAN Wireless Specifications)'
description: 'Specifies primary M.2 2280 PCIe Gen4 x4 NVMe SSD configurations (256GB to 2TB, including TLC Self-Encrypting Opal 2 drives) and Intel AX211 Wi-Fi 6E + 5G/4G WWAN wireless subsystems.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 87270bcdc81ee8846630d5a6f479f5ea0e0dd146546acf45f6d893faaa413a4e
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/01_ch1_product_specs/doc.md
sequence: 3
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.1 §1.3'
source_page: 3
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 1 §1.3 — Primary Storage & Wireless Networking Specifications (pp. 3–4)

## 1. Primary Solid-State Storage (`M.2 2280` Slot)
- **Form Factor & Interface:** Single `M.2 2280` socket supporting **PCIe® Gen4 ×4 NVMe™** solid-state drives.
- **Supported Factory Capacities:**
  - `2 TB` PCIe-4×4 NVMe TLC SSD (`M52027-005`)
  - `1 TB` PCIe-4×4 NVMe TLC SSD (`M16560-005`)
  - `512 GB` PCIe-4×4 NVMe TLC Self-Encrypting Drive (SED OPAL2, `M52031-005`)
  - `512 GB` / `256 GB` PCIe-4×4 NVMe Value SSD
- **Thermal & EMI Requirement:** All PCIe Gen4 NVMe SSDs require the conductive black Mylar EMI shield and thermal pad assembly (`N09040-001`, see Ch.5 §5.6).

## 2. Wireless LAN & Wireless WAN Subsystems
- **WLAN:** Intel® Wi-Fi 6E **AX211** (`802.11ax` 2×2 MIMO, `6 GHz` band support) + Bluetooth® 5.2 (vPro and non-vPro variants, soldered CNVi architecture).
- **WWAN (Optional Factory CTO Requirement):**
  - **Intel® 5000 5G Solution** (Sub-6 GHz 5G NR / LTE-A Pro, M.2 3052 key-B, `N00182-005`)
  - **Intel® XMM™ 7560 R+ LTE-Advanced Pro** (Cat 16, `M52040-005`)
  - *Note:* WWAN upgrade requires a factory WWAN-enabled display assembly with pre-routed `4×4 MIMO` coaxial antennas (`Orange/5`, `White/6`, `Yellow/7`, `Purple/8`).
