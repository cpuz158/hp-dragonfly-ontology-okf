---
type: BigQuery Table
title: Community and Enterprise Field Troubleshooting Cases
description: 'Real-world hardware, firmware, and OS troubleshooting cases collected from HP Support Community,
  Reddit, and enterprise field escalations (Node Table: TroubleshootingCase)'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/community_troubleshooting_cases
tags:
- hp-dragonfly
- ontology
- bigquery-table
- community-troubleshooting-cases
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/community_troubleshooting_cases
  title: BigQuery Table Metadata for community_troubleshooting_cases
  author: team:data-platform
  last_modified: '2026-10-25T02:50:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases` (12 rows) — Real-world hardware, firmware, and OS troubleshooting cases collected from HP Support Community, Reddit, and enterprise field escalations (Node Table: TroubleshootingCase)[^bq-source]

Bridges unstructured customer symptoms (black screen after BIOS update, dual 4K dock flicker, Windows 11 Intel SST red X audio loss, Modern Standby hot-bag drain, 8 MP camera disconnect, 5G WWAN thermal throttling) to structured diagnostic codes (`error_or_diagnostic_code`), SoftPaq fixes (`resolving_softpaq_id`), and exact replacement spare parts (`affected_part_number`).[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Node Table (`TroubleshootingCase`, Key: `case_id`) & Edge Tables (`AFFECTS_COMPONENT`, `TRIGGERS_DIAGNOSTIC`)
- **Grounded Service Manual Section:** Cross-links Chapters 3, 5, 6, and 7 of Service Guide N17344-001 with field incident reports[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `case_id` | `STRING` | `REQUIRED` | Unique troubleshooting case ID (Primary Key, e.g., TS-DFG3-001) |
| `model_id` | `STRING` | `REQUIRED` | Affected model ID (FK -> dragonfly_series_models.model_id) |
| `sku_id` | `STRING` | `NULLABLE` | Representative affected SKU ID (FK -> product_skus_and_configs.sku_id) |
| `issue_category` | `STRING` | `REQUIRED` | Issue domain (BIOS & Boot, Thunderbolt & Docking, Audio & Mic, Camera & Presence, Battery & Standby, Thermal & Fan, WWAN & 5G, Display & Sure View, Pen & Charging, Linux Compatibility) |
| `severity` | `STRING` | `REQUIRED` | Impact severity level (CRITICAL, HIGH, MEDIUM, LOW) |
| `source_channel` | `STRING` | `REQUIRED` | Reporting source channel (HP Support Community, Reddit r/Hewlett_Packard, Enterprise Field Escalation, Linux Kernel Bugzilla) |
| `reported_symptom` | `STRING` | `REQUIRED` | Detailed user-reported symptom and failure behavior in English |
| `error_or_diagnostic_code` | `STRING` | `NULLABLE` | Associated diagnostic or blink code (FK -> diagnostic_codes_reference.diagnostic_code) |
| `affected_part_number` | `STRING` | `NULLABLE` | Root-cause or replacement HP spare part number (FK -> hardware_components_catalog.part_number) |
| `resolving_softpaq_id` | `STRING` | `NULLABLE` | Resolving BIOS or driver SoftPaq ID (FK -> firmware_bios_and_nvm.softpaq_id) |
| `root_cause_analysis` | `STRING` | `REQUIRED` | Technical root cause analysis in English |
| `resolution_steps` | `STRING` | `REQUIRED` | Step-by-step troubleshooting and remediation procedure in English |
| `requires_part_replacement` | `BOOLEAN` | `REQUIRED` | Whether physical hardware component (FRU) replacement is required |
| `occurrence_count` | `INTEGER` | `REQUIRED` | Number of similar community/field incident reports |
| `avg_resolution_time_min` | `INTEGER` | `REQUIRED` | Average time to resolution in minutes |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/dragonfly_series_models`](dragonfly_series_models.md)
- [`tables/product_skus_and_configs`](product_skus_and_configs.md)
- [`tables/hardware_components_catalog`](hardware_components_catalog.md)
- [`tables/component_disassembly_deps`](component_disassembly_deps.md)
- [`tables/firmware_bios_and_nvm`](firmware_bios_and_nvm.md)
- [`tables/diagnostic_codes_reference`](diagnostic_codes_reference.md)

**Grounded Manual References:**
- [`references/post-led-blink-and-uefi-diagnostics`](../references/post-led-blink-and-uefi-diagnostics.md)
- [`references/bios-nvm-and-hp-sure-start-security`](../references/bios-nvm-and-hp-sure-start-security.md)
- [`references/disassembly-prerequisite-graph-and-esd`](../references/disassembly-prerequisite-graph-and-esd.md)

# Examples

```sql
SELECT
  case_id,
  model_id,
  issue_category,
  severity,
  error_or_diagnostic_code,
  affected_part_number,
  resolving_softpaq_id,
  requires_part_replacement,
  occurrence_count,
  avg_resolution_time_min
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases`
ORDER BY occurrence_count DESC;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
