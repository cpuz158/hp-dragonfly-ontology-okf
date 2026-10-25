---
type: Table
title: 'Ch.3 [Table 3-1] Major System FRU Spare Parts Catalog (Chassis, Battery, Thermal, Storage Part Numbers)'
description: 'Authoritative Table 3-1 spare part numbers for major chassis, battery, thermal, storage, and audio field-replaceable units (FRUs).'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 03_ch3_spare_parts_catalog
- structured_table
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 40c3d9260f335444cad964780d3c058c2ed6e515ac9fb5ef79511c3651dad4e8
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/03_ch3_spare_parts_catalog/doc.md
sequence: 17
treatment: structured_table
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.3 Table 3-1'
source_page: 17
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 3 [Table 3-1] — Illustrated Major System Components Catalog (pp. 17–18)

| Callout | Spare Part Description | Official HP Spare Part Number | Service Tier & Technical Notes |
| :---: | :--- | :---: | :--- |
| **(1)** | **Top Cover with Integrated Backlit Keyboard** | `N09026-001` (Slate Blue) / `N09027-001` (Silver) | Authorized FRU · Append `-001` (US) or `-AD1` (KR) |
| **(2)** | **Touchpad (Clickpad) Glass Assembly** | `N09028-001` (Slate Blue) / `N09028-002` (Silver) | Authorized FRU · Excludes ribbon cable (`N09041-001`) |
| **(5)** | **Speaker Assembly (Bang & Olufsen Quad Set)** | `N09029-001` | CSR Optional · Left & Right speaker modules |
| **(7)** | **Thermal Fan Module (5V DC Low-Noise Blower)** | `M90791-001` | Authorized FRU · Replace if `POST 90B` persists |
| **(8)** | **Vapor Chamber Heatsink Assembly** | `M90790-001` | Authorized FRU · Includes pre-applied phase-change pad |
| **(10)** | **Battery Pack, 6-Cell `68 Wh` Li-ion Polymer** | `M90788-005` (`4.42 Ah`) | Authorized FRU · Long-life high-capacity pack |
| **(10)** | **Battery Pack, 4-Cell `45 Wh` Li-ion Polymer** | `M90789-005` (`3.92 Ah`) | Authorized FRU · Ultra-lightweight configuration |
| **(11)** | **Solid-State Drive, `1 TB` PCIe Gen4×4 NVMe TLC** | `M16560-005` | CSR Customer Self-Repair · Requires Mylar shield (`N09040-001`) |
| **(11)** | **Solid-State Drive, `512 GB` PCIe Gen4×4 SED OPAL2** | `M52031-005` | CSR Customer Self-Repair · Hardware self-encrypting |
| **(13)** | **Bottom Cover (Base Enclosure Assembly)** | `N22918-001` (Slate Blue) / `N22919-001` (Silver) | CSR Optional · 5 captive Torx T5 screws |
