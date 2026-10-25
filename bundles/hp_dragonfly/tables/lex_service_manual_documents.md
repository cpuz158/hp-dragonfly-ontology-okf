---
type: BigQuery Table
title: lex_service_manual_documents
description: 'Unstructured LEX Node Table: Origin HP Service Guide PDF roots linked to Dataplex Knowledge
  Catalog (okf_hp_dragonfly).'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/lex_service_manual_documents
tags:
- hp-dragonfly
- ontology
- bigquery-table
- lex-service-manual-documents
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/lex_service_manual_documents
  title: BigQuery Table Metadata for lex_service_manual_documents
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_manual_documents` (2 rows) — Unstructured LEX Node Table: Origin HP Service Guide PDF roots linked to Dataplex Knowledge Catalog (okf_hp_dragonfly).[^bq-source]

[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Structured Table
- **Grounded Service Manual Section:** HP Service Guide N17344-001[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `doc_id` | `STRING` | `REQUIRED` | Canonical document root ID (e.g., N17344-001) |
| `doc_title` | `STRING` | `REQUIRED` | Official document title in English |
| `pdf_filename` | `STRING` | `REQUIRED` | Source unstructured PDF filename |
| `total_pages` | `INTEGER` | `REQUIRED` | Total page count of the source PDF manual |
| `sha256` | `STRING` | `REQUIRED` | SHA-256 cryptographic digest of the origin PDF |
| `okf_root_path` | `STRING` | `REQUIRED` | OKF v0.2 bundle root index path |
| `kc_entry_id` | `STRING` | `REQUIRED` | Dataplex Knowledge Catalog Entry FQN in okf_hp_dragonfly |

# Cross-Concept Links

**Related BigQuery Tables:**


**Grounded Manual References:**


# Examples

```sql
SELECT * FROM `hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_manual_documents` LIMIT 10;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_manual_documents`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
