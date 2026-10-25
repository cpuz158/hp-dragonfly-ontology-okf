---
type: Metric
title: Hardware FRU Replacement Rate by Issue Category
description: Proportion of weighted community and field troubleshooting incidents that require physical
  spare-part (FRU) replacement rather than firmware/SoftPaq remediation.
tags:
- metric
- serviceability
- fru
- troubleshooting
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
---

# Definition

The **Hardware FRU Replacement Rate** measures the share of weighted incident volume (`SUM(occurrence_count)`) in [community_troubleshooting_cases](../tables/community_troubleshooting_cases.md) where `requires_part_replacement = TRUE` versus total reported incidents in that `issue_category`[^ts-cases].

The sanctioned computation is [`computations/fru-replacement-rate-by-category.md`](../computations/fru-replacement-rate-by-category.md).

# Operational Interpretation

- **0% FRU Replacement Rate (Firmware/Driver Solvable):** Categories such as `BIOS & Boot`, `Thunderbolt & Docking`, and `Battery & Standby` are primarily resolved via SoftPaq updates (`sp148210`, `sp149503`) tracked in [firmware_bios_and_nvm](../tables/firmware_bios_and_nvm.md).
- **High FRU Replacement Rate (Depot / Onsite Dispatch):** Categories involving soldered LPDDR5 memory (`LED-BLINK-3.2`), worn fan bearings (`N22936-001`), or pinched camera ZIF cables (`N23306-001`) require physical spare parts from [hardware_components_catalog](../tables/hardware_components_catalog.md) and prerequisite disassembly steps from [component_disassembly_deps](../tables/component_disassembly_deps.md).

[^ts-cases]: BigQuery table `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases`
