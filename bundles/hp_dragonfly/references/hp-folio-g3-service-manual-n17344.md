---
type: Reference
title: HP Dragonfly Folio 13.5 G3 Maintenance & Service Guide (N17344-001)
description: Authoritative 98-page hardware architecture, spare parts catalog, disassembly sequence, and
  diagnostic specification for HP Dragonfly Folio 13.5 G3.
resource: docs/pdf_6290467_en-US-1.pdf
tags:
- service-manual
- n17344-001
- hp-dragonfly-folio-g3
- unstructured-source
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: hp-msg-n17344
  resource: docs/pdf_6290467_en-US-1.pdf
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

This reference concept represents the unstructured PDF manual **`docs/pdf_6290467_en-US-1.pdf`** (*HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide*, Document Part Number **`N17344-001`**, 109 pages)[^hp-msg-n17344]. The Enrichment Agent parses this manual and links its technical specifications to the 8 structured tables in [`datasets/prj_ontology_hp_dragonfly`](../datasets/prj_ontology_hp_dragonfly.md).

# Chapter-to-Ontology Mapping

| Manual Chapter | Pages | Summary of Extracted Knowledge | Linked OKF Concepts |
| :--- | :---: | :--- | :--- |
| **Chapter 1: Product Description** | pp. 1–4 | Alder Lake-U vPro/non-vPro processors, soldered LPDDR5-6400 memory (16/32 GB), 3:2 display options (WUXGA+ 400/1000-nit Sure View & 3K2K OLED), Gen4 NVMe SSDs | [dragonfly_series_models](../tables/dragonfly_series_models.md), [product_skus_and_configs](../tables/product_skus_and_configs.md) |
| **Chapter 2: Components** | pp. 5–16 | Left/Right Thunderbolt 4 ports, 3.5mm audio cutoff jack, magnetic pen charging cradle, 8 MP + IR + ToF camera bezel, serial number label | [ports_sensors_and_docks](../tables/ports_sensors_and_docks.md), [thunderbolt-4-port-and-dock-architecture](thunderbolt-4-port-and-dock-architecture.md) |
| **Chapter 3: Illustrated Parts Catalog** | pp. 17–28 | Exploded mechanical diagrams, system spare part numbers (`N20723-601`..`N20728-601`, `M90788-005`, `N22936-001`), display subcomponents | [hardware_components_catalog](../tables/hardware_components_catalog.md) |
| **Chapter 5: Removal & Replacement** | pp. 32–72 | Prerequisite disassembly DAG, fastener screw torque/dimensions, thermal paste renewal rules, stretch-release adhesive strips | [component_disassembly_deps](../tables/component_disassembly_deps.md), [disassembly-prerequisite-graph-and-esd](disassembly-prerequisite-graph-and-esd.md) |
| **Chapter 6 & Appendix B: Recovery & NVM** | pp. 73–76, 87–89 | System BIOS (`U95`), 8 MB isolated HP Sure Start Golden BIOS flash, 9 MB System BIOS, 7 MB Intel CSE/ME, Infineon TPM 2.0 | [firmware_bios_and_nvm](../tables/firmware_bios_and_nvm.md), [bios-nvm-and-hp-sure-start-security](bios-nvm-and-hp-sure-start-security.md) |
| **Chapter 7 & 8: Diagnostics & ESD** | pp. 77–86 | Power/Battery LED states, Caps Lock blink codes (`2.2`, `3.2`, `5.2`), 24-digit UEFI Failure IDs, 700V MOS ESD threshold | [diagnostic_codes_reference](../tables/diagnostic_codes_reference.md), [post-led-blink-and-uefi-diagnostics](post-led-blink-and-uefi-diagnostics.md) |

# Critical Engineering Constraints

1. **Soldered LPDDR5 Memory:** Memory modules are permanently soldered onto the system board (p. 2, p. 32). Any memory hardware fault (`LED-BLINK-3.2`) requires replacing the entire System Board SKU mapped in [product_skus_and_configs](../tables/product_skus_and_configs.md)[^hp-msg-n17344].
2. **Display Subcomponent Servicing:** Servicing the 8 MP + IR Camera (`N23306-001`) or Display Hub Board (`N22937-001`) does **not** require removing the display assembly from the chassis, but **does** require releasing 8 stretch-release adhesive strips behind the display panel and replacing them using Adhesive Kit `N22925-001` (pp. 66–71)[^hp-msg-n17344].

[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Document Part Number N17344-001, August 2022)
