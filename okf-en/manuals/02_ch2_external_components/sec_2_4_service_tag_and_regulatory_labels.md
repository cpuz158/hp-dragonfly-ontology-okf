---
type: Provision
title: 'Ch.2 §2.4 (Bottom Cover Service Tag Labels — Serial Number, Product ID, Warranty & DMI Programming Rule)'
description: 'Details the Serial Number, Product ID, and Regulatory Label locations on the bottom cover, and the mandatory DMI tattooing procedure after System Board replacement.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 02_ch2_external_components
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 83e3ce7e19f5adac437f0247fbc55aae14a5a2f8e9fd7639b930a09e38fb1c82
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/02_ch2_external_components/sec_2_4_service_tag_and_regulatory_labels.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 14
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.2 §2.4'
source_page: 14
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 2 §2.4 — Service Tag Labels & System Board DMI Programming (pp. 14–16)

## 1. Service Label Identification (Service Guide p. 15)
When ordering spare parts or escalating to HP Global Engineering Support, verify the four identifiers laser-etched onto the **Bottom Cover (`N22918-001`)**:
1. **Product Name:** `HP Elite Dragonfly 13.5 inch G3 Notebook PC`
2. **Serial Number (`S/N`):** 10-character alphanumeric device identifier (e.g., `5CG234XXXX`).
3. **Product ID (`ProdID`):** 7-character base SKU + `#ABA` / `#AB1` localization suffix (e.g., `689H4UT#ABA`).
4. **Warranty Period:** 1-year or 3-year enterprise onsite warranty code (`3/3/0` or `3/3/3`).

## 2. Mandatory Post-Repair DMI / Feature Byte Re-Programming
- Whenever the **System Board (`M90788-601` / `M90788-001`)** is replaced, the service technician **must** program the original Serial Number, SKU Number, CT Number, and **Build ID / Feature Byte** into NVRAM using the HP DMI Maintenance Tool before booting into Windows 11.
