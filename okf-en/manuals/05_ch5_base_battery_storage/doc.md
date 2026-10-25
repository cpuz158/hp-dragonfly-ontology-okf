---
type: SourceDocument
title: '[05 Chapter Root] Chapter 5 Sec.2: Bottom Cover, Battery Pack, NVMe SSD & 5G WWAN Removal Procedures (pp. 35–51)'
description: 'Chapter 5 Sec.2: Bottom Cover, Battery Pack, NVMe SSD & 5G WWAN Removal Procedures (pp. 35–51) (Source PDF: pdf_6290467_en-US-1.pdf, p.35~51 (전 17쪽), 4 clauses)'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 05_ch5_base_battery_storage
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 8ebd4c6175546b821769124e3751dc30f67b63f14751c4b15411c6917ea47b34
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/05_ch5_base_battery_storage/doc.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /index.md
sequence: 35
treatment: normative
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'doc.md ([05] Chapter Root)'
source_page: 35
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [05] Chapter 5 Sec.2: Bottom Cover, Battery Pack, NVMe SSD & 5G WWAN Removal Procedures (pp. 35–51)

- **Source PDF:** `pdf_6290467_en-US-1.pdf` (HP Elite Dragonfly 13.5 G3 Maintenance and Service Guide, Doc Part `N17344-001`, Pages `p.35~51 (전 17쪽)`)
- **Included Unstructured Clauses (`Provisions`):** `4` clauses

## Unstructured Context Clauses in This Chapter (`Provisions`)
* **[Ch.5 §5.4 — Ch.5 §5.4 (Bottom Cover N22918-001 Removal Procedure — 5 Captive Torx T5 Screws & Rear Hinge Clip Release)](sec_5_4_bottom_cover_removal.md)** (`p.35`): Step 0 root prerequisite for all internal repairs: loosening the 5 captive Torx T5 screws and releasing the Bottom Cover (N22918-001) starting from the rear hinge edge.
* **[Ch.5 §5.5 — Ch.5 §5.5 (Battery Pack M90788-005 Removal — Mandatory First-Step Power Isolation Before Any ZIF/FRU Work)](sec_5_5_battery_pack_isolation_and_removal.md)** (`p.38`): Mandatory Step 1 power isolation rule: immediately after Bottom Cover removal, the battery cable (M90788-005 / M90789-005) must be disconnected before touching any ZIF cable or M.2 card.
* **[Ch.5 §5.6 — Ch.5 §5.6 (M.2 2280 PCIe Gen4 NVMe SSD Removal & Mandatory Thermal Pad / Mylar EMI Shield Re-Adhesion)](sec_5_6_nvme_ssd_and_mylar_shield_procedure.md)** (`p.41`): Specifies M.2 2280 PCIe Gen4 NVMe SSD removal and enforces mandatory re-adhesion of the thermal pad and conductive black Mylar EMI shield (N09040-001) to prevent 85°C controller throttling and WWAN RFI.
* **[Ch.5 §5.7 — Ch.5 §5.7 (5G/LTE WWAN Module Removal, 4x4 MIMO Coaxial Antenna Color Mapping 5/6/7/8 & BIOS Whitelist)](sec_5_7_wwan_5g_and_wlan_antenna_routing.md)** (`p.43`): Details 5G/LTE WWAN module removal, U.FL coaxial connector vertical unseating, 4x4 MIMO antenna color-to-terminal mapping (5:Orange, 6:White, 7:Yellow, 8:Purple), and BIOS FCC whitelist rules.
