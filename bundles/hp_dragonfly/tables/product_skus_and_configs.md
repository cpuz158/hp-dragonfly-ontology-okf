---
type: BigQuery Table
title: HP Dragonfly Regional SKUs and Hardware Configurations
description: 'Commercial SKU configurations and hardware specifications for HP Elite Dragonfly G3, Dragonfly
  Folio G3, and series models (Node Table: ProductSKU)'
resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/product_skus_and_configs
tags:
- hp-dragonfly
- ontology
- bigquery-table
- product-skus-and-configs
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
status: stable
stale_after: '2027-10-25T00:00:00Z'
sources:
- id: bq-source
  resource: https://bigquery.googleapis.com/v2/projects/hp-dragonfly/datasets/prj_ontology_hp_dragonfly/tables/product_skus_and_configs
  title: BigQuery Table Metadata for product_skus_and_configs
  author: team:data-platform
  last_modified: '2026-10-25T10:00:00Z'
- id: hp-msg-n17344
  resource: references/hp-folio-g3-service-manual-n17344.md
  title: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (N17344-001)
  author: team:hp-commercial-engineering
  last_modified: '2022-08-01T00:00:00Z'
---

# Overview

`hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs` (12 rows) — Commercial SKU configurations and hardware specifications for HP Elite Dragonfly G3, Dragonfly Folio G3, and series models (Node Table: ProductSKU)[^bq-source]

Because LPDDR5-6400 Dual-Channel memory (16 GB or 32 GB) and the 12th Gen Intel Core Alder Lake-U processor (i5-1235U, i5-1245U vPro, i7-1255U, i7-1265U vPro) are permanently soldered onto the motherboard, every commercial SKU (`sku_id`) maps deterministically to a specific System Board spare part number (`system_board_part_no`) in [hardware_components_catalog](hardware_components_catalog.md).[^hp-msg-n17344]

- **BigQuery Property Graph Role:** Node Table (`ProductSKU`, Key: `sku_id`) & Edge Tables (`BELONGS_TO_MODEL`, `USES_SYSTEM_BOARD`)
- **Grounded Service Manual Section:** Chapter 1: Product Description (pp. 1–4), Chapter 5: System Board Spare Part Matrix (pp. 63–65)[^hp-msg-n17344]

# Schema

| Column | Type | Mode | Description |
| :--- | :--- | :--- | :--- |
| `sku_id` | `STRING` | `REQUIRED` | Official HP product number / SKU ID (Primary Key, e.g., 6J175UTR#ABA) |
| `model_id` | `STRING` | `REQUIRED` | Parent model identifier (FK -> dragonfly_series_models.model_id) |
| `region_code` | `STRING` | `REQUIRED` | Target market region code (US, KR, EU, APAC, GLOBAL) |
| `cpu_model` | `STRING` | `REQUIRED` | Installed processor model (e.g., Intel Core i7-1265U) |
| `vpro_supported` | `BOOLEAN` | `REQUIRED` | Whether Intel vPro Enterprise management is supported |
| `cpu_cores` | `INTEGER` | `REQUIRED` | Total CPU core count (Performance + Efficient cores) |
| `cpu_max_turbo_ghz` | `FLOAT` | `REQUIRED` | Maximum Intel Turbo Boost clock frequency in GHz |
| `ram_gb` | `INTEGER` | `REQUIRED` | Onboard soldered memory capacity in GB |
| `ram_spec` | `STRING` | `REQUIRED` | Detailed memory specification (e.g., 16 GB LPDDR5-6400 Dual-Channel Soldered) |
| `ssd_capacity_gb` | `INTEGER` | `REQUIRED` | Installed primary NVMe SSD capacity in GB |
| `ssd_spec` | `STRING` | `REQUIRED` | SSD interface and encryption specification (e.g., M.2 2280 PCIe Gen4x4 NVMe TLC SED OPAL2) |
| `display_resolution` | `STRING` | `REQUIRED` | Display resolution (e.g., WUXGA+ 1920x1280, 3K2K 3000x2000) |
| `display_panel_type` | `STRING` | `REQUIRED` | Display panel technology and surface treatment (IPS Anti-Glare, IPS BrightView Touch, OLED BrightView) |
| `brightness_nits` | `INTEGER` | `REQUIRED` | Peak display luminance in nits |
| `sure_view_privacy` | `BOOLEAN` | `REQUIRED` | Whether HP Sure View Reflect integrated privacy screen is equipped |
| `wwan_module` | `STRING` | `REQUIRED` | Installed cellular WWAN modem specification (None, Intel XMM 7560 R+ LTE, Intel 5000 5G) |
| `wlan_module` | `STRING` | `REQUIRED` | Onboard wireless LAN and Bluetooth specification (e.g., Intel AX211 Wi-Fi 6E + BT 5.2) |
| `battery_whr` | `INTEGER` | `REQUIRED` | Installed battery capacity in Whr |
| `os_preinstalled` | `STRING` | `REQUIRED` | Factory preinstalled operating system |
| `system_board_part_no` | `STRING` | `REQUIRED` | Mapped system board spare part number (FK -> hardware_components_catalog.part_number) |
| `msrp_usd` | `INTEGER` | `REQUIRED` | Estimated launch MSRP in USD |

# Cross-Concept Links

**Related BigQuery Tables:**
- [`tables/dragonfly_series_models`](dragonfly_series_models.md)
- [`tables/hardware_components_catalog`](hardware_components_catalog.md)
- [`tables/community_troubleshooting_cases`](community_troubleshooting_cases.md)

**Grounded Manual References:**
- [`references/hp-folio-g3-service-manual-n17344`](../references/hp-folio-g3-service-manual-n17344.md)
- [`references/bios-nvm-and-hp-sure-start-security`](../references/bios-nvm-and-hp-sure-start-security.md)

# Examples

```sql
SELECT
  s.sku_id,
  s.region_code,
  s.cpu_model,
  s.ram_gb,
  s.display_panel_type,
  s.wwan_module,
  s.system_board_part_no,
  c.component_name AS mapped_system_board
FROM `hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs` AS s
JOIN `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog` AS c
  ON s.system_board_part_no = c.part_number
ORDER BY s.model_id, s.sku_id;
```

[^bq-source]: BigQuery Table `hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs`
[^hp-msg-n17344]: HP Dragonfly Folio 13.5 inch G3 Maintenance and Service Guide (Doc Part N17344-001)
