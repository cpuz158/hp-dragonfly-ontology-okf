---
type: Reference
title: Thunderbolt 4 I/O Topology, 3.5mm Audio Cutoff Logic, and G4 Dock Compatibility
description: Physical port layout, dual left-side Thunderbolt 4 controllers on Folio G3, audio jack speaker
  cutoff behavior, and HP Thunderbolt Dock G4 pairing.
tags:
- thunderbolt-4
- docking
- audio-jack
- ports
- pen
generated:
  by: enrichment_agent/gemini-2.5-pro
  at: '2026-10-25T02:50:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T02:52:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: hp-msg-n17344
  resource: docs/pdf_6290467_en-US-1.pdf
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# External Port & Docking Architecture

Chapter 1 (p. 3) and Chapter 2 (pp. 5–7) specify the external interface architecture modeled in [ports_sensors_and_docks](../tables/ports_sensors_and_docks.md)[^hp-msg-n17344]:

- **Dual Left-Side SuperSpeed USB Type-C / Thunderbolt 4 Ports (Folio G3):** Both left-side ports support 40 Gbps data transfer, USB Power Delivery charging, and DisplayPort 1.4 video output. (On the clamshell Elite Dragonfly G3, one Thunderbolt 4 port sits on the left and one on the right.)
- **3.5mm Audio Combo Jack Hardware Cutoff (Manual p. 6):** When a plug or debris is detected inside the right-side 3.5mm audio jack (`N31280-001`), the internal Bang & Olufsen quad speakers (`N22946-001`) are automatically muted in hardware. This is a primary root cause checked in case `TS-DFG3-003` of [community_troubleshooting_cases](../tables/community_troubleshooting_cases.md).
- **Official Enterprise Docks:** Validated with the HP Thunderbolt 120W G4 Dock (`M97105-001`) and 280W G4 Combo Dock (`M97106-001`) running dock firmware SoftPaq `sp149503` in [firmware_bios_and_nvm](../tables/firmware_bios_and_nvm.md).

[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide, Chapters 1 & 2 (pp. 3, 5–7)
