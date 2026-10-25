---
type: Provision
title: '제1장 §1.3 (저장장치 M.2 2280 PCIe Gen4 NVMe SSD 및 Wi-Fi 6E · 5G/LTE WWAN 무선통신 규격)'
description: 'M.2 2280 PCIe Gen4 x4 NVMe SSD(최대 2TB, SED Opal 2 암호화 드라이브 포함) 및 Intel AX211 Wi-Fi 6E, Intel 5000 5G / XMM 7560 R+ LTE-A Pro 무선 모듈 사양을 정의합니다.'
version: '0.2.0'
tags:
- unstructured_context
- authentic
- 01_ch1_product_specs
- verbatim_en
language: ko
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: 42d8b0799f233925f56b8f338ce82f680247e87441410abb1119786ff43c4ac2
source_uri: gs://hp-dragonfly-okf/okf-kr/manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs.md
generated:
  by: agent:gemini-2.5-pro
  at: '2026-10-25T04:00:00Z'
status: stable
part_of: /manuals/01_ch1_product_specs/doc.md
sequence: 3
treatment: verbatim_en
license: 'HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)'
content_class: authentic
section_number: '제1장 §1.3'
source_page: 3
verified:
- by: hp-service-engineering-lead
  at: '2026-10-25T04:00:00Z'
  method: source_text_match
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---

# 제1장 §1.3 — M.2 2280 PCIe Gen4 NVMe 스토리지 및 Wi-Fi 6E / 5G WWAN 무선통신 규격 (pp. 3–4)

## 1. 주 저장장치 (`M.2 2280` 슬롯)
- **폼팩터 및 인터페이스:** **PCIe® Gen4 ×4 NVMe™** SSD를 지원하는 단일 `M.2 2280` 소켓.
- **지원 출고 용량 및 스페어 파트 번호:**
  - `2 TB` PCIe-4×4 NVMe TLC SSD (`M52027-005` / `M90791-001`)
  - `1 TB` PCIe-4×4 NVMe TLC SSD (`M16560-005` / `M90790-001`)
  - `512 GB` PCIe-4×4 NVMe TLC 자체 암호화 드라이브 (SED OPAL2, `M52031-005`)
  - `512 GB` / `256 GB` PCIe-4×4 NVMe Value SSD
- **방열 및 전자파 차폐(EMI) 필수 요건:** 모든 PCIe Gen4 NVMe SSD 장착 시 전도성 흑색 Mylar EMI 차폐 필름 및 구리 써멀 패드 어셈블리(`N09040-001`, 제5장 §5.6 참조)를 반드시 재부착해야 합니다.

## 2. 무선 LAN (WLAN) 및 셀룰러 광역망 (WWAN) 서브시스템
- **WLAN:** Intel® Wi-Fi 6E **AX211** (`802.11ax` 2×2 MIMO, `6 GHz` 대역 지원) + Bluetooth® 5.2 (CNVi 아키텍처).
- **WWAN (출고 시 WWAN-Ready 구성 필수):**
  - **Intel® 5000 5G Solution / Quectel RM505Q-AE** (Sub-6 GHz 5G NR / LTE-A Pro, M.2 3052 Key-B, `N00182-005` / `M90792-001`)
  - **Intel® XMM™ 7560 R+ LTE-Advanced Pro** (Cat 16, `M52040-005`)
  - *주의:* Wi-Fi 전용 시스템 보드(`N19202-601`)에는 M.2 Key-B WWAN 소켓 및 `4×4 MIMO` 동축 안테나(`주황/5`, `백색/6`, `황색/7`, `자주/8`)가 미실장되어 있으므로 사후 5G 모뎀 추가 장착이 불가합니다.
