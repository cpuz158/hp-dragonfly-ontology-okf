---
type: Reference
title: HP Sure Start Hardware Root of Trust and Non-Volatile Memory (NVM) Architecture
description: Specification of onboard SPI flash partitions, HP Sure Start automatic BIOS self-healing,
  Intel Management Engine, and Infineon TPM 2.0 from Appendix B of N17344-001.
tags:
- bios
- hp-sure-start
- nvm
- security
- tpm
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: hp-msg-n17344
  resource: docs/pdf_6290467_en-US-1.pdf
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Non-Volatile Memory (NVM) Partition Architecture

Appendix B (*Table B-1 Nonvolatile Memory Specifications*, pp. 87–89) defines four isolated non-volatile memory devices on the HP Dragonfly Folio G3 and Elite Dragonfly G3 system boards[^hp-msg-n17344]:

1. **HP Sure Start Private SPI Flash (64 Mbit / 8 MB):** Stores the cryptographically signed Golden BIOS backup image and HP Sure Start controller firmware. Write-protected in hardware against host OS or SMM tampering.
2. **System BIOS SPI Flash (72 Mbit / 9 MB):** Active UEFI System BIOS (`U95` family, SoftPaq `sp148210`) and user F10 configuration settings.
3. **Intel Converged Security & Management Engine Flash (56 Mbit / 7 MB):** Intel CSE / vPro AMT firmware partition.
4. **Discrete Trusted Platform Module (Infineon SLB9672 TPM 2.0):** FIPS 140-2 certified cryptographic co-processor storing BitLocker VMKs and Windows Hello keys. **Important:** Replacing the System Board clears TPM keys and requires the customer's 48-digit BitLocker Recovery Key upon first boot.

Linked structured concepts:
- [firmware_bios_and_nvm](../tables/firmware_bios_and_nvm.md)
- [product_skus_and_configs](../tables/product_skus_and_configs.md)
- [community_troubleshooting_cases](../tables/community_troubleshooting_cases.md)
- [no-boot-bios-sure-start-recovery](../playbooks/no-boot-bios-sure-start-recovery.md)

[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide, Appendix B (pp. 87–89)
