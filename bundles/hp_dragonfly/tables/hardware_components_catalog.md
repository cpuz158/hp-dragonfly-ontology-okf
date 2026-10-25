---
type: BigQuery Table
title: HP Official Spare Parts and FRU Catalog
description: 'Official spare parts catalog for HP Dragonfly G3 and Folio G3 including major components,
  display subcomponents, and kits (Node Table: HardwareComponent)'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/hardware_components_catalog
tags:
- hp-dragonfly
- ontology
- bigquery-table
- hardware-components-catalog
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: bq-source
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/hardware_components_catalog
  title: BigQuery Table Metadata for hardware_components_catalog
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog` (38 rows) — Official spare parts catalog for HP Dragonfly G3 and Folio G3 including major components, display subcomponents, and kits (Node Table: HardwareComponent)[^bq-source]

Contains 38 official HP spare parts across System Boards, Memory (Soldered), Primary Storage (M.2 2280 PCIe Gen4x4 NVMe SSDs), Battery (`M90788-005`), Thermal (`N22936-001`), WWAN/WLAN modules, Display Subcomponents (`N23304-001`, `N23305-001`, `N23306-001`), and Top Cover/Keyboard assemblies. Distinguishes Customer Self-Repair (`CUSTOMER_SELF_Repair_OPTIONAL`) from `AUTHORIZED_SERVICE_PROVIDER_ONLY` components.[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Node Table (`HardwareComponent`, Key: `part_number`)
- **Grounded Service Manual Section:** Chapter 3: Illustrated Parts Catalog (pp. 17–28), Chapter 5: Removal and Replacement Procedures (pp. 32–72)[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `part_number` | `STRING` | `REQUIRED` | Official HP Spare Part Number (Primary Key, e.g., M90788-005, M52027-005, N20728-601) |
| `model_id` | `STRING` | `REQUIRED` | Compatible model ID (FK -> dragonfly_series_models.model_id) |
| `component_category` | `STRING` | `REQUIRED` | Component category (System Board, Solid-State Drive, Battery, Display Subcomponent, Thermal, WWAN, Audio, Input/Cover, Kit/Accessory) |
| `component_name` | `STRING` | `REQUIRED` | Official component name |
| `technical_specs` | `STRING` | `REQUIRED` | Detailed component technical specifications, capacity, interface, and included accessories |
| `serviceability_tier` | `STRING` | `REQUIRED` | Service replacement tier (End-User Replaceable, Authorized Service Provider Only) |
| `esd_sensitive` | `BOOLEAN` | `REQUIRED` | Whether the part is sensitive to Electrostatic Discharge (degrades at >= 700V) |
| `requires_thermal_paste` | `BOOLEAN` | `REQUIRED` | Whether thermal grease or thermal pad replacement is required during service |
| `manual_chapter_page` | `STRING` | `REQUIRED` | Reference chapter and page numbers in the HP Maintenance and Service Guide |
| `estimated_replace_min` | `INTEGER` | `REQUIRED` | Standard estimated service replacement time in minutes |
| `unit_price_usd` | `FLOAT` | `REQUIRED` | Reference spare part unit price in USD |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/component_disassembly_deps`](component_disassembly_deps.md)
- [`tables/product_skus_and_configs`](product_skus_and_configs.md)
- [`tables/community_troubleshooting_cases`](community_troubleshooting_cases.md)

**Grounded Manual References:**
- [`references/hp-folio-g3-service-manual-n17344`](../references/hp-folio-g3-service-manual-n17344.md)
- [`references/disassembly-prerequisite-graph-and-esd`](../references/disassembly-prerequisite-graph-and-esd.md)

# Examples

```sql
SELECT
  part_number,
  component_category,
  component_name,
  serviceability_tier,
  is_soldered,
  requires_thermal_paste_renewal,
  manual_page_ref
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog`
ORDER BY component_category, part_number;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
