---
type: BigQuery Table
title: lex_manual_chapters
description: 'Unstructured LEX Node Table: 5 OKF v0.2 reference chapters extracted from N17344-001 with
  Dataplex kc_entry_id.'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/lex_manual_chapters
tags:
- hp-dragonfly
- ontology
- bigquery-table
- lex-manual-chapters
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/lex_manual_chapters
  title: BigQuery Table Metadata for lex_manual_chapters
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.lex_manual_chapters` (5 rows) — Unstructured LEX Node Table: 5 OKF v0.2 reference chapters extracted from N17344-001 with Dataplex kc_entry_id.[^bq-source]

[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Structured Table
- **Grounded Service Manual Section:** HP Service Guide N17344-001[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `chapter_slot_id` | `STRING` | `REQUIRED` | Canonical OKF reference chapter ID |
| `doc_id` | `STRING` | `REQUIRED` | Parent source document ID (FK -> lex_service_manual_documents.doc_id) |
| `chapter_no` | `STRING` | `REQUIRED` | Manual chapter or appendix number |
| `chapter_title` | `STRING` | `REQUIRED` | English title of the extracted OKF reference document |
| `pdf_page_start` | `INTEGER` | `REQUIRED` | Starting page number in pdf_6290467_en-US-1.pdf |
| `pdf_page_span` | `STRING` | `REQUIRED` | Page range in the 109-page service manual |
| `okf_rel_path` | `STRING` | `REQUIRED` | Relative path inside bundles/hp_dragonfly/ |
| `kc_entry_id` | `STRING` | `REQUIRED` | Dataplex Knowledge Catalog Entry FQN in okf_hp_dragonfly |
| `governance_summary` | `STRING` | `REQUIRED` | Engineering rules and constraints governed by this chapter |

# Cross-Concept Links

**Related BigQuery Tables:**


**Grounded Manual References:**


# Examples

```sql
SELECT * FROM `hp-dragonfly.prj_ontology_hp_dragonfly.lex_manual_chapters` LIMIT 10;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.lex_manual_chapters`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
