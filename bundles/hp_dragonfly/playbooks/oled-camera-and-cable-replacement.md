---
type: Playbook
title: 'Playbook: 8MP Camera / Privacy Key Triage and Stretch-Release Display Servicing'
description: Step-by-step service procedure for diagnosing missing 8MP camera symptoms (TS-DFG3-005) and
  safely servicing display subcomponents without damaging the 3K2K OLED panel.
tags:
- playbook
- camera
- oled-display
- adhesive-kit
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: disassembly-ref
  resource: references/disassembly-prerequisite-graph-and-esd.md
  title: Disassembly Prerequisite Graph & ESD Reference
  author: team:hp-commercial-engineering
  last_modified: '2026-10-25T10:00:00Z'
---

# Trigger Conditions

Invoke this playbook for case `TS-DFG3-005` in [community_troubleshooting_cases](../tables/community_troubleshooting_cases.md) when the HP 8MP + IR Camera (`N23306-001`) fails with Windows Camera error `0xA00F4244`[^disassembly-ref].

# Step-by-Step Procedure

1. **Verify Hardware Privacy Key State (No Disassembly):**
   - Check the electronic camera privacy key LED on the top row of the keyboard (`N23845-001`). Unlike older generations with a physical slider, the Folio G3 privacy shutter is electronically actuated via the Display Hub Board (`N22937-001` / `N22938-001`).
   - Update System BIOS (`sp148210`) in [firmware_bios_and_nvm](../tables/firmware_bios_and_nvm.md) and toggle the privacy key.
2. **Physical Subcomponent Servicing (If USB Device Absent in Device Manager):**
   - Per [component_disassembly_deps](../tables/component_disassembly_deps.md) (`DEP-010`, `DEP-011`, `DEP-012`), servicing `N23306-001` or the Display & Camera Cable Kit (`N22922-001`) requires releasing the display panel (`N23305-001` / `N23304-001`) in-place using non-marking suction cups and pulling the **8 stretch-release adhesive strips** at a shallow angle (Manual pp. 66–71).
   - Always order Display & Foil Adhesive Kit `N22925-001` from [hardware_components_catalog](../tables/hardware_components_catalog.md) prior to opening the display bezel.

[^disassembly-ref]: Disassembly Prerequisite Graph & ESD Reference
