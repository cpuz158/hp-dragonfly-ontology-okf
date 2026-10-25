---
type: Playbook
title: 'Playbook: Black Screen / LED Blink 2.2 & 3.2 Triage and HP Sure Start Recovery'
description: Standard operating playbook for field engineers and AI support agents triaging post-update
  black screen and Caps Lock blink codes on HP Dragonfly G3 / Folio G3.
tags:
- playbook
- bios-recovery
- hp-sure-start
- triage
generated:
  by: enrichment_agent/gemini-2.5-pro
  at: '2026-10-25T02:50:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T02:52:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: post-ref
  resource: references/post-led-blink-and-uefi-diagnostics.md
  title: POST LED Blink Codes Reference
  author: team:hp-commercial-engineering
  last_modified: '2026-10-25T02:50:00Z'
---

# Trigger Conditions

Invoke this playbook when a user or ticket in [community_troubleshooting_cases](../tables/community_troubleshooting_cases.md) reports a black screen at power-on accompanied by Caps Lock LED blink patterns defined in [diagnostic_codes_reference](../tables/diagnostic_codes_reference.md)[^post-ref].

# Step-by-Step Procedure

1. **Identify Blink Code (`LED-BLINK-2.2` vs `LED-BLINK-3.2`):**
   - **2 Long, 2 Short (`LED-BLINK-2.2` — Case `TS-DFG3-001`):** Main BIOS image in the 9 MB SPI flash is corrupted. Proceed to **Step 2 (Software/NVM Recovery)**.
   - **3 Long, 2 Short (`LED-BLINK-3.2` — Case `TS-DFG3-010`):** Soldered LPDDR5-6400 memory training failure. Skip software recovery and proceed to **Step 3 (System Board Replacement)**.
2. **Execute HP Sure Start Golden BIOS Recovery (`LED-BLINK-2.2`):**
   - Disconnect all external docks ([ports_sensors_and_docks](../tables/ports_sensors_and_docks.md)) and connect the 65W USB-C AC adapter (`L04650-850`) directly to the left Thunderbolt 4 port.
   - Hold the power button for 15 seconds to reset the Embedded Controller, then power on and wait up to 90 seconds for the isolated 8 MB **HP Sure Start** flash ([bios-nvm-and-hp-sure-start-security](../references/bios-nvm-and-hp-sure-start-security.md)) to re-flash the Golden BIOS image.
   - Once booted, apply SoftPaq `sp148210` from [firmware_bios_and_nvm](../tables/firmware_bios_and_nvm.md).
3. **Dispatch System Board FRU (`LED-BLINK-3.2`):**
   - Look up the customer's `sku_id` in [product_skus_and_configs](../tables/product_skus_and_configs.md) to determine the exact `system_board_part_no` (`N20723-601`..`N20728-601`) in [hardware_components_catalog](../tables/hardware_components_catalog.md).
   - Follow the 3-step prerequisite removal sequence in [component_disassembly_deps](../tables/component_disassembly_deps.md) (`N22918-001` Bottom Cover -> `M90788-005` Battery -> `N22936-001` Heat Sink) while observing the 700V ESD threshold ([disassembly-prerequisite-graph-and-esd](../references/disassembly-prerequisite-graph-and-esd.md)).

[^post-ref]: POST LED Blink Codes Reference
