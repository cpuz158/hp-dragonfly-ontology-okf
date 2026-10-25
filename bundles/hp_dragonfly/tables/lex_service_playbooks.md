---
type: BigQuery Table
title: lex_service_playbooks
description: 'Unstructured LEX Node Table: 6 OKF v0.2 agent playbooks, computations, and metrics with
  Dataplex kc_entry_id.'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/lex_service_playbooks
tags:
- hp-dragonfly
- ontology
- bigquery-table
- lex-service-playbooks
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/lex_service_playbooks
  title: BigQuery Table Metadata for lex_service_playbooks
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_playbooks` (6 rows) — Unstructured LEX Node Table: 6 OKF v0.2 agent playbooks, computations, and metrics with Dataplex kc_entry_id.[^bq-source]

[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Structured Table
- **Grounded Service Manual Section:** HP Service Guide N17344-001[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `playbook_id` | `STRING` | `REQUIRED` | Canonical OKF playbook, computation, or metric ID |
| `okf_type` | `STRING` | `REQUIRED` | OKF v0.2 type (Playbook, Computation, Metric) |
| `title` | `STRING` | `REQUIRED` | English title of the OKF playbook or computation |
| `target_issue_domain` | `STRING` | `REQUIRED` | Target troubleshooting domain (No-Boot/BIOS/Memory vs. Thermal/Battery/I-O) |
| `pdf_page_ref` | `INTEGER` | `REQUIRED` | Primary page reference in HP Service Guide N17344-001 |
| `okf_rel_path` | `STRING` | `REQUIRED` | Relative path inside bundles/hp_dragonfly/ |
| `kc_entry_id` | `STRING` | `REQUIRED` | Dataplex Knowledge Catalog Entry FQN in okf_hp_dragonfly |
| `agent_directive` | `STRING` | `REQUIRED` | Mandatory execution rule enforced on the Ontology Agent |

# Cross-Concept Links

**Related BigQuery Tables:**


**Grounded Manual References:**


# Examples

```sql
SELECT * FROM `hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_playbooks` LIMIT 10;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_playbooks`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
