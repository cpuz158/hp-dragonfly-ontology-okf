---
type: Provision
title: 'Ch.2 §2.3 (Top Cover Keyboard, Electronic Privacy Camera Key, Fingerprint Reader & Quad Speakers)'
description: 'Covers the top cover with integrated spill-resistant backlit keyboard, electronic camera privacy shutter key, match-on-chip fingerprint sensor, glass clickpad, and Bang & Olufsen quad-speaker audio.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 02_ch2_external_components
- verbatim_en
language: en
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 7796294d5d7a087db6c3fb02654130feeb4b231050ee57db0e27766e020412d1
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/02_ch2_external_components/sec_2_3_keyboard_privacy_shutter_biometrics.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 10
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.2 §2.3'
source_page: 10
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 2 §2.3 — Top Cover, KeyboardHotkeys, Biometrics & Audio (pp. 10–13)

## 1. Integrated Top Cover & Keyboard (`N09026-001`)
- The spill-resistant backlit keyboard is thermally welded into the magnesium **Top Cover (`N09026-001`)** and is replaced as a single assembly (specify regional localization code, e.g., `-001` US English, `-AD1` Korean).
- **Critical Function Hotkeys (p. 12):**
  - **`F1`:** Display Switch | **`F2`:** HP Sure View Privacy Screen toggle
  - **`F8`:** Microphone Mute (amber LED indicator)
  - **Camera Privacy Key (next to Power key):** Physically actuates the **electronic electro-mechanical privacy shutter** over the 5MP webcam lens. When amber LED is lit, the shutter is closed at the hardware level.
  - **Power Button with LED:** Integrated into the top row of the keyboard matrix.

## 2. Biometrics & Audio Subsystems
- **Fingerprint Reader (`N08545-001`):** Match-on-Chip capacitive sensor located on the right palmrest; connects via dedicated ZIF ribbon cable (`N09042-001`).
- **Audio by Bang & Olufsen:** Four discrete stereo speakers (2 upward-firing tweeters + 2 downward-firing woofers, `N09029-001`) driven by smart discrete amplifiers.
