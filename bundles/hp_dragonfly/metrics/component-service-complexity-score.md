---
type: Metric
title: Component Disassembly Depth and Service Complexity
description: Number of prerequisite hardware components and fastener groups that must be removed before
  servicing a target FRU.
tags:
- metric
- disassembly
- complexity
- sla
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
---

# Definition

The **Component Service Complexity Score** counts the number of prerequisite removal steps (`COUNT(dependency_id)`) in [component_disassembly_deps](../tables/component_disassembly_deps.md) required to reach a target `part_number` in [hardware_components_catalog](../tables/hardware_components_catalog.md), paired with the average resolution time (`avg_resolution_time_min`) observed in [community_troubleshooting_cases](../tables/community_troubleshooting_cases.md)[^deps-table].

The sanctioned computation is [`computations/multi-hop-disassembly-critical-path.md`](../computations/multi-hop-disassembly-critical-path.md).

[^deps-table]: BigQuery table `hp-dragonfly.prj_ontology_hp_dragonfly.component_disassembly_deps`
