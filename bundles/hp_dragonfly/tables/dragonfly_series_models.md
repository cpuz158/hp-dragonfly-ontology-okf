---
type: BigQuery Table
title: HP Dragonfly Series Models Master
description: 'Master lineup and physical specifications for the HP Dragonfly product family (G1, G2, Max,
  G3, Folio G3, G4) (Node Table: ProductModel)'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/dragonfly_series_models
tags:
- hp-dragonfly
- ontology
- bigquery-table
- dragonfly-series-models
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/dragonfly_series_models
  title: BigQuery Table Metadata for dragonfly_series_models
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models` (6 rows) — Master lineup and physical specifications for the HP Dragonfly product family (G1, G2, Max, G3, Folio G3, G4) (Node Table: ProductModel)[^bq-source]

Captures the structural evolution of the HP Dragonfly product line from G1/G2/Max (13.3-inch 16:9 convertible clamshell) to the G3 (13.5-inch 3:2 ultralight clamshell) and the Folio G3 (13.5-inch 3:2 pull-forward magnesium/aluminum convertible with wrap-around polyurethane leather). All SKUs in [product_skus_and_configs](product_skus_and_configs.md) and field cases in [community_troubleshooting_cases](community_troubleshooting_cases.md) anchor to `model_id`.[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Node Table (`ProductModel`, Key: `model_id`)
- **Grounded Service Manual Section:** Chapter 1: Product Description (pp. 1–4), Chapter 2: Getting to Know the Computer (pp. 5–16)[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `model_id` | `STRING` | `REQUIRED` | Unique model identifier (Primary Key, e.g., MDL-DF-G3, MDL-DF-FOLIO-G3) |
| `model_name` | `STRING` | `REQUIRED` | Official HP commercial product name (e.g., HP Elite Dragonfly G3 Notebook PC) |
| `generation` | `STRING` | `REQUIRED` | Generation designation (G1, G2, Max, G3, Folio G3, G4) |
| `release_year` | `INTEGER` | `REQUIRED` | Commercial release year |
| `form_factor` | `STRING` | `REQUIRED` | Chassis form factor (Clamshell 180°, 360° Convertible 2-in-1, Pull-Forward Folio 2-in-1) |
| `cpu_architecture` | `STRING` | `REQUIRED` | Supported Intel Core processor generation and series |
| `display_size_inch` | `FLOAT` | `REQUIRED` | Active display diagonal size in inches |
| `aspect_ratio` | `STRING` | `REQUIRED` | Display aspect ratio (16:9 or 3:2) |
| `memory_type` | `STRING` | `REQUIRED` | System memory specification (LPDDR3, LPDDR4x, LPDDR5-6400, soldered onboard status) |
| `max_memory_gb` | `INTEGER` | `REQUIRED` | Maximum supported system memory capacity in GB |
| `max_storage_tb` | `FLOAT` | `REQUIRED` | Maximum supported M.2 PCIe NVMe SSD capacity in TB |
| `camera_spec` | `STRING` | `REQUIRED` | Integrated webcam, IR sensor, and privacy shutter/key specifications |
| `audio_spec` | `STRING` | `REQUIRED` | Audio subsystem, speaker configuration, and microphone specifications |
| `battery_options` | `STRING` | `REQUIRED` | Supported battery cell count and watt-hour (Whr) options |
| `starting_weight_kg` | `FLOAT` | `REQUIRED` | Minimum starting weight in kilograms (kg) |
| `dimensions_mm` | `STRING` | `REQUIRED` | Physical dimensions (Width x Depth x Height in mm) |
| `chassis_material` | `STRING` | `REQUIRED` | Chassis construction material and finish color options |
| `service_manual_doc_no` | `STRING` | `NULLABLE` | Official HP Maintenance and Service Guide document part number (e.g., N17344-001) |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/product_skus_and_configs`](product_skus_and_configs.md)
- [`tables/hardware_components_catalog`](hardware_components_catalog.md)
- [`tables/ports_sensors_and_docks`](ports_sensors_and_docks.md)
- [`tables/firmware_bios_and_nvm`](firmware_bios_and_nvm.md)
- [`tables/community_troubleshooting_cases`](community_troubleshooting_cases.md)

**Grounded Manual References:**
- [`references/hp-folio-g3-service-manual-n17344`](../references/hp-folio-g3-service-manual-n17344.md)
- [`references/thunderbolt-4-port-and-dock-architecture`](../references/thunderbolt-4-port-and-dock-architecture.md)

# Examples

```sql
SELECT
  model_id,
  model_name,
  generation,
  form_factor,
  cpu_architecture,
  aspect_ratio,
  min_weight_kg,
  service_manual_doc_id
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models`
ORDER BY release_year, model_id;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
