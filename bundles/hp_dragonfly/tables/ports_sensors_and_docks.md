---
type: BigQuery Table
title: External I/O Ports, Biometric/Thermal Sensors, and Official Docks
description: External I/O ports, internal sensors, status LEDs, active pen, and official HP docking station
  compatibility matrix
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/ports_sensors_and_docks
tags:
- hp-dragonfly
- ontology
- bigquery-table
- ports-sensors-and-docks
generated:
  by: enrichment_agent/gemini-2.5-pro
  at: '2026-10-25T02:50:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T02:52:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: bq-source
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/ports_sensors_and_docks
  title: BigQuery Table Metadata for ports_sensors_and_docks
  author: team:data-platform
  last_modified: '2026-10-25T02:50:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.ports_sensors_and_docks` (10 rows) — External I/O ports, internal sensors, status LEDs, active pen, and official HP docking station compatibility matrix[^bq-source]

Documents physical placement (`LEFT_SIDE`, `RIGHT_SIDE`, `TOP_BEZEL`, `INTERNAL_BOARD`, `EXTERNAL_DOCK`), electrical protocols (40 Gbps Thunderbolt 4 / USB4, DisplayPort 1.4, USB Power Delivery), automatic 3.5mm audio jack speaker cutoff logic (Manual p. 6), Time-of-Flight human presence sensor, and official HP Thunderbolt 120W/280W G4 Dock spare part numbers (`M97105-001`, `M97106-001`).[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Attribute & Compatibility Reference Table
- **Grounded Service Manual Section:** Chapter 1: External Ports & Docks (p. 3), Chapter 2: Left/Right Side & Display Components (pp. 5–9)[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `feature_id` | `STRING` | `REQUIRED` | Unique port, sensor, or dock identifier (Primary Key) |
| `model_id` | `STRING` | `REQUIRED` | Target model ID (FK -> dragonfly_series_models.model_id) |
| `feature_category` | `STRING` | `REQUIRED` | Feature classification (External Port, Internal Sensor, Status LED, Docking Station, Active Pen) |
| `feature_name` | `STRING` | `REQUIRED` | Port, sensor, or peripheral name |
| `location_on_chassis` | `STRING` | `REQUIRED` | Physical location (Left Side, Right Side, Top Display Bezel, System Board, External USB-C) |
| `protocol_or_spec` | `STRING` | `REQUIRED` | Supported electrical/data protocols and specifications (Thunderbolt 4 40Gbps, DP 1.4, USB-PD 65W/100W) |
| `spare_part_number` | `STRING` | `NULLABLE` | Associated replacement or accessory spare part number |
| `operational_behavior` | `STRING` | `REQUIRED` | Operational behavior and mode-specific constraints (e.g., keyboard auto-disable in tablet mode) |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/dragonfly_series_models`](dragonfly_series_models.md)
- [`tables/firmware_bios_and_nvm`](firmware_bios_and_nvm.md)
- [`tables/community_troubleshooting_cases`](community_troubleshooting_cases.md)

**Grounded Manual References:**
- [`references/thunderbolt-4-port-and-dock-architecture`](../references/thunderbolt-4-port-and-dock-architecture.md)

# Examples

```sql
SELECT
  interface_id,
  model_id,
  interface_category,
  interface_name,
  physical_location,
  max_data_rate_gbps,
  compatible_dock_part_no
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.ports_sensors_and_docks`
ORDER BY interface_id;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.ports_sensors_and_docks`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
