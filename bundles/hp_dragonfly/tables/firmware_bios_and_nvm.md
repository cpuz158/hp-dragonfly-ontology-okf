---
type: BigQuery Table
title: System BIOS, SoftPaq Drivers, and Non-Volatile Memory (NVM) Security
description: System BIOS releases, SoftPaq driver packages, and Nonvolatile Memory (NVM) / TPM 2.0 security
  specifications
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/firmware_bios_and_nvm
tags:
- hp-dragonfly
- ontology
- bigquery-table
- firmware-bios-and-nvm
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
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/firmware_bios_and_nvm
  title: BigQuery Table Metadata for firmware_bios_and_nvm
  author: team:data-platform
  last_modified: '2026-10-25T02:50:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm` (8 rows) — System BIOS releases, SoftPaq driver packages, and Nonvolatile Memory (NVM) / TPM 2.0 security specifications[^bq-source]

Maps SoftPaq packages (`sp148210` BIOS U95, `sp146831` Intel Smart Sound Technology, `sp149503` Thunderbolt Dock G4 Firmware, `sp147415` Intel 5000 5G WWAN) and onboard SPI/NVM flash chips (64 Mbit / 8 MB isolated HP Sure Start Golden BIOS flash, 72 Mbit / 9 MB System BIOS, 56 Mbit / 7 MB Intel CSE/ME, Infineon SLB9672 TPM 2.0).[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Firmware & Security Reference Table
- **Grounded Service Manual Section:** Chapter 6: Backing Up, Restoring, and Recovering (pp. 73–76), Appendix B: Non-Volatile Memory & HP Sure Start (pp. 87–89)[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `release_or_nvm_id` | `STRING` | `REQUIRED` | Unique firmware, driver, or NVM item identifier (Primary Key) |
| `model_id` | `STRING` | `REQUIRED` | Target model ID (FK -> dragonfly_series_models.model_id) |
| `item_type` | `STRING` | `REQUIRED` | Item classification (System BIOS, Driver SoftPaq, Dock Firmware, Nonvolatile Memory, Security Chip) |
| `name_or_version` | `STRING` | `REQUIRED` | Firmware version or nonvolatile memory component name |
| `softpaq_id` | `STRING` | `NULLABLE` | Official HP SoftPaq package identifier (e.g., sp148210) |
| `storage_size` | `STRING` | `NULLABLE` | Nonvolatile memory capacity or SoftPaq package size (e.g., 8 MB, 9 MB, 7 MB) |
| `stores_customer_data` | `BOOLEAN` | `REQUIRED` | Whether the nonvolatile memory stores customer/personal data (per Chapter 10 Statement of Memory Volatility) |
| `retains_data_power_off` | `BOOLEAN` | `REQUIRED` | Whether data is retained when all power sources are removed |
| `write_protection_mechanism` | `STRING` | `REQUIRED` | Hardware/cryptographic write-protection mechanism (HP Sure Start EC, Intel Digitally Signed Utility) |
| `sanitization_or_update_steps` | `STRING` | `REQUIRED` | Standard BIOS sanitization (Secure Erase / Factory Reset) or firmware update instructions |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/dragonfly_series_models`](dragonfly_series_models.md)
- [`tables/community_troubleshooting_cases`](community_troubleshooting_cases.md)

**Grounded Manual References:**
- [`references/bios-nvm-and-hp-sure-start-security`](../references/bios-nvm-and-hp-sure-start-security.md)
- [`references/no-boot-bios-sure-start-recovery`](../references/no-boot-bios-sure-start-recovery.md)

# Examples

```sql
SELECT
  firmware_id,
  component_type,
  softpaq_id,
  version_string,
  nvm_chip_capacity_mbit,
  hardware_root_of_trust,
  remediation_target
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm`
ORDER BY firmware_id;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
