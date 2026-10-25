---
type: Attested Computation
title: Multi-Hop Disassembly Critical Path via BigQuery Property Graph (GQL)
description: Sanctioned BigQuery Graph Query Language (GQL) traversal from TroubleshootingCase to target
  HardwareComponent and ordered prerequisite FRU removals.
tags:
- computation
- gql
- property-graph
- disassembly
runtime: bigquery
parameters:
- name: case_id
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
- id: deps-table
  resource: tables/component_disassembly_deps.md
  title: Component Disassembly Dependencies Table
  author: team:hp-commercial-engineering
  last_modified: '2026-10-25T02:50:00Z'
- id: complexity-metric
  resource: metrics/component-service-complexity-score.md
  title: Component Service Complexity Score
  author: human:dhmoon@google.com
  last_modified: '2026-10-25T02:52:00Z'
---

# Computation

```sql
GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
MATCH (t:TroubleshootingCase)-[:AFFECTS_COMPONENT]->(c:HardwareComponent)-[r:REQUIRES_REMOVAL_OF]->(prereq:HardwareComponent)
RETURN
  t.case_id,
  t.issue_category,
  c.part_number AS target_part_number,
  c.component_name AS target_component,
  r.step_order,
  prereq.part_number AS prerequisite_part_number,
  prereq.component_name AS prerequisite_component,
  r.fastener_screw_spec,
  r.required_tools,
  r.caution_note
ORDER BY t.case_id, r.step_order;
```

Traverses the `hp_dragonfly_ontology_graph` Property Graph across [`tables/community_troubleshooting_cases.md`](../tables/community_troubleshooting_cases.md), [`tables/hardware_components_catalog.md`](../tables/hardware_components_catalog.md), and [`tables/component_disassembly_deps.md`](../tables/component_disassembly_deps.md) to output the exact disassembly checklist for [`metrics/component-service-complexity-score.md`](../metrics/component-service-complexity-score.md)[^deps-table][^complexity-metric].

[^deps-table]: Component Disassembly Dependencies Table
[^complexity-metric]: Component Service Complexity Score
