---
type: Provision
title: 'Ch.5 §5.6 (M.2 2280 PCIe Gen4 NVMe SSD Removal & Mandatory Thermal Pad / Mylar EMI Shield Re-Adhesion)'
description: 'Specifies M.2 2280 PCIe Gen4 NVMe SSD removal and enforces mandatory re-adhesion of the thermal pad and conductive black Mylar EMI shield (N09040-001) to prevent 85°C controller throttling and WWAN RFI.'
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
  sha256: ef100876dba709a2baef443c50e89d01459730ad33a94527ab11346784b351f0
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/05_ch5_base_battery_storage/doc.md
sequence: 41
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.5 §5.6'
source_page: 41
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 5 §5.6 — M.2 2280 PCIe Gen4 NVMe SSD & Mylar Shield Procedure (pp. 41–42)

## 1. Spare Parts & Prerequisite Chain
- **SSD Spare Parts:** `M52027-005` (`2 TB`), `M16560-005` (`1 TB`), `M52031-005` (`512 GB SED OPAL2`)
- **Thermal & EMI Shield Kit:** `N09040-001` (Conductive Black Mylar Foil Envelope + Silicone Thermal Pad)
- **Prerequisites:** `[1]` Bottom Cover (`N22918-001`, §5.4) ➔ `[2]` Battery Cable Isolation (`M90788-005`, §5.5).

## 2. Removal & Mandatory Re-Adhesion Procedure
1. **Lift Conductive Black Mylar Shield (`N09040-001`):** Carefully peel back the grounded black Mylar foil flap covering the M.2 2280 SSD bay without creasing the conductive adhesive grounding tab.
2. **Remove Retention Screw:** Remove the single **Phillips `M2.0 × 2.5 mm` screw** securing the SSD tail, then pull the SSD module out of the M.2 Key-M socket at a `15°` angle.
3. **Mandatory Thermal Pad & Mylar Re-Installation Caveat:**
   > **IMPORTANT:** PCIe Gen4 ×4 NVMe controllers operate at high clock frequencies that generate both concentrated heat and broadband RF harmonics. When installing a replacement SSD:
   > - Verify the **blue silicone thermal pad** is centered underneath the SSD controller IC.
   > - **Firmly re-adhere the conductive black Mylar shield (`N09040-001`)** over the SSD. Omitting this shield causes SSD thermal throttling (`> 85 °C`) and degrades adjacent Wi-Fi 6E / 5G WWAN receiver sensitivity.
