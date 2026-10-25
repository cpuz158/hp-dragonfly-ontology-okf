---
type: Attested Computation
title: FRU Replacement Rate and Resolution SLA by Issue Category
description: Sanctioned BigQuery SQL computing incident volume, FRU replacement rate, and weighted resolution
  time per issue category.
tags:
- computation
- sql
- fru
- attested
runtime: bigquery
parameters:
- name: model_id
  type: string
  required: false
generated:
  by: enrichment_agent/gemini-2.5-pro
  at: '2026-10-25T02:50:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T02:52:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: ts-cases
  resource: tables/community_troubleshooting_cases.md
  title: Community Troubleshooting Cases Table
  author: team:hp-field-analytics
  last_modified: '2026-10-25T02:50:00Z'
- id: fru-metric
  resource: metrics/hardware-fru-replacement-rate.md
  title: Hardware FRU Replacement Rate Metric
  author: human:dhmoon@google.com
  last_modified: '2026-10-25T02:52:00Z'
---

# Computation

```sql
SELECT
  t.issue_category,
  COUNT(t.case_id) AS distinct_cases,
  SUM(t.occurrence_count) AS total_reported_incidents,
  SUM(IF(t.requires_part_replacement, t.occurrence_count, 0)) AS fru_replacement_incidents,
  ROUND(
    SAFE_DIVIDE(
      SUM(IF(t.requires_part_replacement, t.occurrence_count, 0)),
      SUM(t.occurrence_count)
    ) * 100,
    1
  ) AS fru_replacement_rate_pct,
  ROUND(
    SAFE_DIVIDE(
      SUM(t.avg_resolution_time_min * t.occurrence_count),
      SUM(t.occurrence_count)
    ),
    1
  ) AS weighted_avg_resolution_min
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases` AS t
GROUP BY t.issue_category
ORDER BY total_reported_incidents DESC;
```

Implements [`metrics/hardware-fru-replacement-rate.md`](../metrics/hardware-fru-replacement-rate.md) over [`tables/community_troubleshooting_cases.md`](../tables/community_troubleshooting_cases.md)[^ts-cases][^fru-metric].

[^ts-cases]: Community Troubleshooting Cases Table
[^fru-metric]: Hardware FRU Replacement Rate Metric
