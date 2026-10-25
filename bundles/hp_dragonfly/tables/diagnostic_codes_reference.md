---
type: BigQuery Table
title: POST LED Blink Codes, UEFI Failure IDs, and ESD Thresholds
description: 'HP PC Hardware Diagnostics UEFI/Windows failure codes, power/battery LED blink patterns,
  and ESD/thermal thresholds (Node Table: DiagnosticCode)'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/diagnostic_codes_reference
tags:
- hp-dragonfly
- ontology
- bigquery-table
- diagnostic-codes-reference
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/diagnostic_codes_reference
  title: BigQuery Table Metadata for diagnostic_codes_reference
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.diagnostic_codes_reference` (8 rows) — HP PC Hardware Diagnostics UEFI/Windows failure codes, power/battery LED blink patterns, and ESD/thermal thresholds (Node Table: DiagnosticCode)[^bq-source]

Standardizes hardware symptom codes including `LED-BLINK-2.2` (Main area of BIOS corrupted -> HP Sure Start recovery), `LED-BLINK-3.2` (Pre-video memory error on soldered LPDDR5 -> System Board replacement), `LED-BLINK-5.2` (Embedded Controller failure), `UEFI-24DIGIT-NVME-DST-FAIL`, and the 700V (0.7 kV) MOS electrostatic discharge damage threshold.[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Node Table (`DiagnosticCode`, Key: `diagnostic_code`)
- **Grounded Service Manual Section:** Chapter 7: Troubleshooting & POST Diagnostic Blink Codes (pp. 77–84), Chapter 8: Electrostatic Discharge (pp. 85–86)[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `diagnostic_code` | `STRING` | `REQUIRED` | Unique diagnostic code or LED blink identifier (Primary Key, e.g., LED-CAPS-3-2, UEFI-24DIGIT-SSD) |
| `diagnostic_category` | `STRING` | `REQUIRED` | Diagnostic category (Power/Battery LED, CapsLock Blink Code, UEFI Hardware Diagnostics, ESD Threshold) |
| `signal_pattern` | `STRING` | `REQUIRED` | Observed LED blink pattern, failure code format, or voltage measurement |
| `indicated_condition` | `STRING` | `REQUIRED` | Hardware fault or system condition indicated by the pattern |
| `Suspected_component_category` | `STRING` | `REQUIRED` | Primary suspected hardware component category |
| `recommended_action` | `STRING` | `REQUIRED` | Official HP recommended troubleshooting and remediation action |
| `manual_reference` | `STRING` | `REQUIRED` | Service manual chapter and page citation |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/community_troubleshooting_cases`](community_troubleshooting_cases.md)
- [`tables/hardware_components_catalog`](hardware_components_catalog.md)

**Grounded Manual References:**
- [`references/post-led-blink-and-uefi-diagnostics`](../references/post-led-blink-and-uefi-diagnostics.md)
- [`references/no-boot-bios-sure-start-recovery`](../references/no-boot-bios-sure-start-recovery.md)

# Examples

```sql
SELECT
  diagnostic_code,
  signal_type,
  blink_pattern_or_code,
  subsystem_affected,
  root_cause_meaning,
  recommended_action,
  manual_page_ref
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.diagnostic_codes_reference`
ORDER BY diagnostic_code;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.diagnostic_codes_reference`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
