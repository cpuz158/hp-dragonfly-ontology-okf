---
type: BigQuery Table
title: Hardware Component Disassembly Prerequisite Graph Edges
description: 'Physical disassembly prerequisite edges defining which component must be removed before
  another component (Edge Table: REQUIRES_REMOVAL_OF)'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/component_disassembly_deps
tags:
- hp-dragonfly
- ontology
- bigquery-table
- component-disassembly-deps
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/component_disassembly_deps
  title: BigQuery Table Metadata for component_disassembly_deps
  author: team:data-platform
  last_modified: '2026-10-25T02:50:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.component_disassembly_deps` (15 rows) — Physical disassembly prerequisite edges defining which component must be removed before another component (Edge Table: REQUIRES_REMOVAL_OF)[^bq-source]

Encodes the physical service dependency DAG from Chapter 5 of N17344-001. For example, replacing System Board `N20728-601` requires ordered removal of Bottom Cover `N22918-001` (Step 1), Battery `M90788-005` (Step 2), and Heat Sink/Dual Fan Assembly `N22936-001` (Step 3), while replacing the 8 MP Camera Module `N23306-001` requires removing the stretch-release adhesive display panel `N23305-001` and Display Hub Board `N22937-001`.[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Edge Table (`REQUIRES_REMOVAL_OF`: `HardwareComponent` -> `HardwareComponent`)
- **Grounded Service Manual Section:** Chapter 5: Removal and Replacement Procedures (pp. 32–72), Chapter 8: Screw Listing & ESD Specifications (pp. 85–90)[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `dependency_id` | `STRING` | `REQUIRED` | Unique disassembly dependency rule ID (Primary Key) |
| `model_id` | `STRING` | `REQUIRED` | Target model ID (FK -> dragonfly_series_models.model_id) |
| `target_part_number` | `STRING` | `REQUIRED` | Target spare part number to be serviced/removed (FK -> hardware_components_catalog.part_number) |
| `target_component_name` | `STRING` | `REQUIRED` | Target component name |
| `prerequisite_part_number` | `STRING` | `REQUIRED` | Prerequisite spare part number that must be removed first (FK -> hardware_components_catalog.part_number) |
| `prerequisite_component_name` | `STRING` | `REQUIRED` | Prerequisite component name |
| `step_order` | `INTEGER` | `REQUIRED` | Ordered disassembly prerequisite sequence step (1, 2, 3...) |
| `fastener_screw_spec` | `STRING` | `REQUIRED` | Fastener screw dimensions and connector types (e.g., 5x Torx T5 + 2x Phillips M2.0x4.0, ZIF connector) |
| `required_tools` | `STRING` | `REQUIRED` | Required service tools (e.g., Magnetic Phillips P0/P1, Torx T5, Nonconductive pry tool, Tweezers) |
| `caution_note` | `STRING` | `REQUIRED` | Critical service caution note to prevent hardware damage during disassembly/reassembly |
| `manual_page_ref` | `STRING` | `REQUIRED` | Service manual page reference (e.g., N17344-001 p.35-36) |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/hardware_components_catalog`](hardware_components_catalog.md)
- [`tables/community_troubleshooting_cases`](community_troubleshooting_cases.md)

**Grounded Manual References:**
- [`references/disassembly-prerequisite-graph-and-esd`](../references/disassembly-prerequisite-graph-and-esd.md)
- [`references/oled-camera-and-cable-replacement`](../references/oled-camera-and-cable-replacement.md)

# Examples

```sql
SELECT
  d.dependency_id,
  d.target_part_number,
  t.component_name AS target_component,
  d.step_order,
  d.prerequisite_part_number,
  p.component_name AS prerequisite_component,
  d.fastener_screw_spec,
  d.caution_note
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.component_disassembly_deps` AS d
JOIN `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog` AS t
  ON d.target_part_number = t.part_number
JOIN `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog` AS p
  ON d.prerequisite_part_number = p.part_number
ORDER BY d.target_part_number, d.step_order;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.component_disassembly_deps`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
