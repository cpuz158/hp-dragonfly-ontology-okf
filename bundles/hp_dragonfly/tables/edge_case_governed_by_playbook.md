---
type: BigQuery Table
title: edge_case_governed_by_playbook
description: 'Cross-Layer ONT-to-LEX Bridge Edge Table: TroubleshootingCase -> ServicePlaybook (GOVERNED_BY_PLAYBOOK).'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/edge_case_governed_by_playbook
tags:
- hp-dragonfly
- ontology
- bigquery-table
- edge-case-governed-by-playbook
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/edge_case_governed_by_playbook
  title: BigQuery Table Metadata for edge_case_governed_by_playbook
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.edge_case_governed_by_playbook` (12 rows) — Cross-Layer ONT-to-LEX Bridge Edge Table: TroubleshootingCase -> ServicePlaybook (GOVERNED_BY_PLAYBOOK).[^bq-source]

[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Structured Table
- **Grounded Service Manual Section:** HP Service Guide N17344-001[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `bridge_id` | `STRING` | `REQUIRED` | Unique ONT-to-LEX case-playbook bridge ID |
| `case_id` | `STRING` | `REQUIRED` | Source TroubleshootingCase case_id |
| `playbook_id` | `STRING` | `REQUIRED` | Destination ServicePlaybook playbook_id |
| `issue_category` | `STRING` | `REQUIRED` | Troubleshooting issue domain |
| `bridge_role` | `STRING` | `REQUIRED` | Semantic bridge role description |

# Cross-Concept Links

**Related BigQuery Tables:**


**Grounded Manual References:**


# Examples

```sql
SELECT * FROM `hp-dragonfly.prj_ontology_hp_dragonfly.edge_case_governed_by_playbook` LIMIT 10;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.edge_case_governed_by_playbook`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
