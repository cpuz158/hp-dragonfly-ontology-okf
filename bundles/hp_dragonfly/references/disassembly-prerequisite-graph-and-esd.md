---
type: Reference
title: Disassembly Prerequisite Graph, Screw Torque Specs, and 700V ESD Protocol
description: Physical component removal dependency rules, fastener dimensions, thermal material guidelines,
  and 700V MOS ESD precautions from Chapters 5 and 8 of N17344-001.
tags:
- disassembly
- esd
- fasteners
- thermal-paste
- fru
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

# Disassembly Dependency Hierarchy

Chapter 5 of the Maintenance and Service Guide enforces a strict removal dependency order modeled in [component_disassembly_deps](../tables/component_disassembly_deps.md) and queried via [computations/multi-hop-disassembly-critical-path](../computations/multi-hop-disassembly-critical-path.md)[^hp-msg-n17344]:

1. **Bottom Cover (`N22918-001` / `N22919-001`):** Remove 2x Phillips M2.0x4.0 screws hidden beneath the rear rubber strip and loosen 5x captive Torx T5 screws (pp. 35–37).
2. **Battery (`M90788-005`):** Disconnect the battery cable from the system board immediately after bottom cover removal to isolate electrical power before touching any internal FRU (pp. 44–45).
3. **Heat Sink & Dual Fan Assembly (`N22936-001`):** Loosen 4x captive Phillips M2.0x4.0 screws on the CPU cold plate in reverse-numerical order and remove 2x Phillips M2.0x2.0 fan screws (pp. 59–60). Always clean and apply fresh thermal compound whenever the heat sink is lifted.
4. **System Board (`N20723-601`..`N20728-601`):** Disconnect 10 ribbon/ZIF/coaxial cables, remove the USB-C port reinforcement bracket (`N22923-001`), and remove 6x Phillips M2.0x4.0 + 3x Phillips M1.6x2.5 screws (pp. 63–65).

# Electrostatic Discharge (ESD) 700V Standard

Per Chapter 8 (*Electrostatic Discharge*, pp. 85–86), Metal-Oxide Semiconductor (MOS) devices on the Alder Lake-U System Board can be permanently degraded by static discharges as low as **700 V (0.7 kV)**, whereas a human technician only feels static above ~3,000 V[^hp-msg-n17344]. Field technicians must ground the chassis, wear a conductive wrist strap, and keep replacement boards inside static-shielding bags until installation.

Linked structured concepts:
- [hardware_components_catalog](../tables/hardware_components_catalog.md)
- [component_disassembly_deps](../tables/component_disassembly_deps.md)
- [diagnostic_codes_reference](../tables/diagnostic_codes_reference.md)
- [oled-camera-and-cable-replacement](../playbooks/oled-camera-and-cable-replacement.md)

[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide, Chapters 5 & 8 (pp. 32–72, 85–86)
