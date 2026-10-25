---
type: Provision
title: 'Ch.2 §2.2 (Display Subsystem — 13.5" 3K2K OLED vs. WUXGA+ Sure View Reflect & 5MP IR Camera)'
description: 'Specifies the three 13.5-inch 3:2 display panel options (3K2K 3000x2000 OLED Touch, WUXGA+ 1000-nit HP Sure View Reflect, 400-nit Low-Power IPS) and the 5MP IR webcam, ambient light sensor, and dual-array microphones.'
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
  sha256: 6c6bf2de5662be1f972990c42ac981610ed0008fb93e8b78d56d135937603e17
source_uri: gs://hp-dragonfly-okf/okf-en/manuals/02_ch2_external_components/sec_2_2_display_oled_sureview_camera.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/02_ch2_external_components/doc.md
sequence: 7
treatment: verbatim_en
license: 'Proprietary (HP Inc. Maintenance & Service Guide N17344-001)'
content_class: authentic
section_number: 'Ch.2 §2.2'
source_page: 7
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# Chapter 2 §2.2 — Display Assembly, Panels & Upper Bezel Sensors (pp. 7–9)

## 1. 13.5-inch (34.3 cm) `3:2` Display Panel Options
1. **3K2K (`3000 × 2000`) OLED BrightView Touch Display (`N09033-001`):**
   - `400 nits` brightness, `100% DCI-P3` color gamut, Corning® Gorilla® Glass 5, VESA TrueBlack HDR 500.
   - Uses a dedicated **40-pin high-speed eDP 1.4b + Touch cable (`N09038-001`)**.
2. **WUXGA+ (`1920 × 1280`) HP Sure View Reflect Integrated Privacy Screen (`N09032-001`):**
   - `1000 nits` brightness, `72% NTSC`, anti-glare, hardware copper-reflective privacy layer toggled via keyboard **`F2`** key.
3. **WUXGA+ (`1920 × 1280`) Low-Power IPS Display (`N09031-001`):**
   - `400 nits` brightness, `100% sRGB`, ultra-low `1W` panel power consumption.

## 2. Upper Bezel Camera & Sensor Array (Service Guide p. 7)
- **5 MP + IR USB2 Camera Module (`N09036-001`):** Supports **HP Auto Frame**, Windows Hello facial recognition (dual IR emitters), and **HP Presence** AI noise/lighting optimization.
- **Ambient Light & Color Temperature Sensor (ALS):** Automatically calibrates OLED/IPS luminance and white balance.
- **Internal Dual-Array Digital Microphones:** Top-edge beamforming microphones for AI noise reduction.
