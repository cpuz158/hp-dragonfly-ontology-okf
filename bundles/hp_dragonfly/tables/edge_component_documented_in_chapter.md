---
type: BigQuery Table
title: edge_component_documented_in_chapter
description: 'Cross-Layer ONT-to-LEX Bridge Edge Table: HardwareComponent -> ServiceManualChapter (DOCUMENTED_IN_CHAPTER).'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/edge_component_documented_in_chapter
tags:
- hp-dragonfly
- ontology
- bigquery-table
- edge-component-documented-in-chapter
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/edge_component_documented_in_chapter
  title: BigQuery Table Metadata for edge_component_documented_in_chapter
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.edge_component_documented_in_chapter` (38 rows) — Cross-Layer ONT-to-LEX Bridge Edge Table: HardwareComponent -> ServiceManualChapter (DOCUMENTED_IN_CHAPTER).[^bq-source]

[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Structured Table
- **Grounded Service Manual Section:** HP Service Guide N17344-001[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `bridge_id` | `STRING` | `REQUIRED` | Unique ONT-to-LEX component bridge ID |
| `part_number` | `STRING` | `REQUIRED` | Source HardwareComponent part_number |
| `chapter_slot_id` | `STRING` | `REQUIRED` | Destination ServiceManualChapter chapter_slot_id |
| `manual_chapter_page` | `STRING` | `REQUIRED` | PDF chapter and page citation |
| `bridge_role` | `STRING` | `REQUIRED` | Semantic bridge role description |

# Cross-Concept Links

**Related BigQuery Tables:**


**Grounded Manual References:**


# Examples

```sql
SELECT * FROM `hp-dragonfly.prj_ontology_hp_dragonfly.edge_component_documented_in_chapter` LIMIT 10;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.edge_component_documented_in_chapter`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
