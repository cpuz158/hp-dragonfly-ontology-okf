---
type: document
title: '[01 Chapter Root] Chapter 1: Product Description & Hardware Specifications [Table 1-1] (PDF p.7–10 · Doc pp. 1–4 · 3 Chunks)'
description: 'Summarizes Chapter 1 (Doc pp. 1–4, PDF pp. 7–10) Table 1-1 of N17344-001 covering 12th Gen Intel Core Alder Lake-U processors, soldered-onboard LPDDR5-6400 memory (16GB/32GB, customer non-accessible), M.2 2280 PCIe Gen4x4 NVMe SSD storage, 13.5-inch 3:2 OLED/WUXGA+ displays, 8MP IR camera, Intel AX211 Wi-Fi 6E, and 5G/LTE WWAN modules.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page=7
  kind: origin_document
  sha256: b3db00a7ca6fde378caf0842ebcb0e43253cf3943306a695e835dbc83a363d7c
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/01_ch1_product_specs/doc.md
generated:
  by: enrichment_agent/gemini-3.8-flash
  at: '2026-10-25T10:00:00Z'
status: stable
part_of: hp_dragonfly_folio_g3_service_manual_n17344_001
sequence: 1
treatment: normative
license: 'HP Inc. Authorized Service & Engineering Documentation (N17344-001)'
content_class: reference
section_number: 'Chapter 01 Root'
source_page: 7
source_pages_span: 'PDF p.7–10 (Doc pp. 1–4)'
verified:
- by: human:dhmoon@google.com
  at: '2026-10-25T10:02:00Z'
  method: manual_review
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# [01 Chapter Root] Chapter 1: Product Description & Hardware Specifications [Table 1-1] (PDF p.7–10 · Doc pp. 1–4 · 3 Chunks)

## 1. Chapter Root Overview (`okf-en` · 1:1 Grounded in `docs/pdf_6290467_en-US-1.pdf`)
- **Chapter Identifier:** `[01] 01_CH1_PRODUCT_SPECS`
- **Source Service Manual:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **Exact PDF Page Span:** **`PDF p.7–10 (Doc pp. 1–4)`** (Opens PDF viewer at `#page=7`)
- **Enrichment Agent & Model:** `enrichment_agent/gemini-3.8-flash` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF Repository Path:** `okf-en/manuals/01_ch1_product_specs/doc.md`
- **Dataplex Knowledge Catalog EntryGroup:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_en`
- **Chapter Executive Summary:** Summarizes Chapter 1 (Doc pp. 1–4, PDF pp. 7–10) Table 1-1 of N17344-001 covering 12th Gen Intel Core Alder Lake-U processors, soldered-onboard LPDDR5-6400 memory (16GB/32GB, customer non-accessible), M.2 2280 PCIe Gen4x4 NVMe SSD storage, 13.5-inch 3:2 OLED/WUXGA+ displays, 8MP IR camera, Intel AX211 Wi-Fi 6E, and 5G/LTE WWAN modules.

## 2. Child PDF Section Chunks (3 Chunks)
| Section / Table | Chunk Title (English) | Exact PDF / Doc Page | Governance Status |
| :---: | :--- | :---: | :---: |
| `Ch.1 Table 1-1 (Processors, Graphics & Display)` | Chapter 1 Table 1-1 — Product Description: 12th Gen Intel Alder Lake-U Processors, Iris Xe Graphics & 13.5" 3:2 Display (PDF p.7 · Doc p.1) | `PDF p.7` (`PDF p.7 (Doc p.1)`) | `stable` |
| `Ch.1 Table 1-1 (Soldered LPDDR5 Memory)` | Chapter 1 Table 1-1 — Onboard Soldered LPDDR5-6400 MHz Dual-Channel Memory Rule (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1) | `PDF p.7` (`PDF p.7–8 (Doc p.1–2)`) | `stable` |
| `Ch.1 Table 1-1 (Storage, Camera, Wireless, TPM & Battery)` | Chapter 1 Table 1-1 — M.2 2280 PCIe Gen4 NVMe Storage, 8MP IR Camera, Wi-Fi 6E AX211, 5G WWAN, TPM 2.0 & 53Whr Battery (PDF p.8–10 · Doc p.2–4) | `PDF p.8` (`PDF p.8–10 (Doc p.2–4)`) | `stable` |

## 3. Ontology Property Graph (`hp_dragonfly_ontology_graph`) & Dataplex KC Linkage
- This Chapter Root (`doc.md`) and its child chunks are generated directly from `docs/pdf_6290467_en-US-1.pdf` (Chapters 1–12, `pdf_page = doc_page + 6`) using the `gemini-3.8-flash` Enrichment Agent and published to Dataplex Knowledge Catalog (`okf` Aspect) and BigQuery Property Graph (`hp_dragonfly_ontology_graph`) via `./bin/kcmd`.
