---
type: BigQuery Dataset
title: HP Dragonfly Structured Ontology Dataset (prj-ontology-hp-dragonfly)
description: 'HP Dragonfly G3 / Folio G3 & Series Ontology Structured Dataset (Requested ID: prj-ontology-hp-dragonfly).
  Contains product specs, SKUs, spare parts catalog, disassembly dependency edges, ports/docks, BIOS/NVM
  specs, diagnostic codes, and community troubleshooting cases.'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly
tags:
- hp-dragonfly
- ontology
- bigquery-dataset
- property-graph
generated:
  by: enrichment_agent/gemini-2.5-pro
  at: '2026-10-25T02:50:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T02:52:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: bq-ds
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly
  title: BigQuery Dataset hp-dragonfly.prj_ontology_hp_dragonfly
  author: team:data-platform
  last_modified: '2026-10-25T02:50:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

The `hp-dragonfly.prj_ontology_hp_dragonfly` dataset (friendly name: `prj-ontology-hp-dragonfly`) is the structured backbone of the **HP Dragonfly Ontology Layer** on Google Cloud[^bq-ds]. It integrates product architecture, regional SKUs, official spare part catalogs, physical disassembly prerequisite edges, Thunderbolt 4 port/dock specifications, BIOS/NVM security chips, POST LED blink codes, and community troubleshooting cases grounded in the *HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide* (`N17344-001`)[^hp-msg-n17344].

It also hosts the native BigQuery Property Graph **`hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`**, enabling multi-hop GQL graph traversal across [`computations/multi-hop-disassembly-critical-path`](../computations/multi-hop-disassembly-critical-path.md).

# Schema (Tables in Dataset)

- [`tables/community_troubleshooting_cases`](../tables/community_troubleshooting_cases.md) (12 rows): Real-world hardware, firmware, and OS troubleshooting cases collected from HP Support Community, Reddit, and enterprise field escalations (Node Table: TroubleshootingCase)
- [`tables/component_disassembly_deps`](../tables/component_disassembly_deps.md) (15 rows): Physical disassembly prerequisite edges defining which component must be removed before another component (Edge Table: REQUIRES_REMOVAL_OF)
- [`tables/diagnostic_codes_reference`](../tables/diagnostic_codes_reference.md) (8 rows): HP PC Hardware Diagnostics UEFI/Windows failure codes, power/battery LED blink patterns, and ESD/thermal thresholds (Node Table: DiagnosticCode)
- [`tables/dragonfly_series_models`](../tables/dragonfly_series_models.md) (6 rows): Master lineup and physical specifications for the HP Dragonfly product family (G1, G2, Max, G3, Folio G3, G4) (Node Table: ProductModel)
- [`tables/firmware_bios_and_nvm`](../tables/firmware_bios_and_nvm.md) (8 rows): System BIOS releases, SoftPaq driver packages, and Nonvolatile Memory (NVM) / TPM 2.0 security specifications
- [`tables/hardware_components_catalog`](../tables/hardware_components_catalog.md) (38 rows): Official spare parts catalog for HP Dragonfly G3 and Folio G3 including major components, display subcomponents, and kits (Node Table: HardwareComponent)
- [`tables/ports_sensors_and_docks`](../tables/ports_sensors_and_docks.md) (10 rows): External I/O ports, internal sensors, status LEDs, active pen, and official HP docking station compatibility matrix
- [`tables/product_skus_and_configs`](../tables/product_skus_and_configs.md) (12 rows): Commercial SKU configurations and hardware specifications for HP Elite Dragonfly G3, Dragonfly Folio G3, and series models (Node Table: ProductSKU)

# Grounded Knowledge References

- [`references/hp-folio-g3-service-manual-n17344`](../references/hp-folio-g3-service-manual-n17344.md)
- [`references/disassembly-prerequisite-graph-and-esd`](../references/disassembly-prerequisite-graph-and-esd.md)
- [`references/post-led-blink-and-uefi-diagnostics`](../references/post-led-blink-and-uefi-diagnostics.md)
- [`references/bios-nvm-and-hp-sure-start-security`](../references/bios-nvm-and-hp-sure-start-security.md)
- [`references/thunderbolt-4-port-and-dock-architecture`](../references/thunderbolt-4-port-and-dock-architecture.md)

[^bq-ds]: BigQuery Dataset `hp-dragonfly.prj_ontology_hp_dragonfly`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
