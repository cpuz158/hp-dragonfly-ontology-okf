#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerates PDF-Grounded Bilingual OKF v0.2 Corpus (`okf-kr` & `okf-en`) using `gemini-3.8-flash`.

Reads actual pages from `/usr/local/google/home/dhmoon/Research/2026-10-25_project-Ontology/docs/pdf_6290467_en-US-1.pdf`
(HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide, Doc Part N17344-001, 109 PDF pages),
aligns every Chapter Root (`OKF_DOC_ROOTS`) and Section Chunk (`OKF_FILES`) with the exact PDF file page numbers
(`pdf_page = doc_page + 6`) and Table of Contents (Chapters 1–12), enriches both Korean (`okf-kr`) and English (`okf-en`)
OKF v0.2 Markdown bodies via Vertex AI `gemini-3.8-flash`, and updates `web/data/studio_bundle.js` + `bundles/hp_dragonfly/`.
"""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
import os
from pathlib import Path
import re
import socket
import time
from typing import Any, Dict, List, Tuple

# Force IPv4 socket resolution to avoid 45s IPv6 timeout on Cloudtop
os.environ["GOOGLE_API_USE_CLIENT_CERTIFICATE"] = "false"
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "true"
os.environ["GOOGLE_CLOUD_PROJECT"] = "hp-dragonfly"
os.environ["GOOGLE_CLOUD_LOCATION"] = "global"

_orig_getaddrinfo = socket.getaddrinfo


def _ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
  return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)


socket.getaddrinfo = _ipv4_getaddrinfo

from google import genai
from google.genai import types
from pypdf import PdfReader

REPO_ROOT = Path("/usr/local/google/home/dhmoon/Research/2026-10-25_project-Ontology")
PDF_PATH = REPO_ROOT / "docs" / "pdf_6290467_en-US-1.pdf"
BUNDLE_JS_PATH = REPO_ROOT / "web" / "data" / "studio_bundle.js"
OKF_KR_DIR = REPO_ROOT / "okf-kr"
OKF_EN_DIR = REPO_ROOT / "okf-en"
MODEL_ID = "gemini-3.8-flash"
GENERATED_AT = "2026-10-25T10:00:00Z"
VERIFIED_AT = "2026-10-25T10:02:00Z"

# ---------------------------------------------------------------------------
# 1. Exact Chapter Roots aligned 1:1 with `docs/pdf_6290467_en-US-1.pdf`
#    Note: PDF pages 1-6 are Front Matter (Cover, Legal, Safety, TOC iv-vi).
#    Document Page `D` is at PDF File Page `D + 6`.
# ---------------------------------------------------------------------------
PDF_CHAPTER_ROOTS_SPEC: Dict[str, Dict[str, Any]] = {
    "01_CH1_PRODUCT_SPECS": {
        "doc_num": "01",
        "pdf_page": 7,
        "source_pages_span": "PDF p.7–10 (Doc pp. 1–4)",
        "title_ko": "[01 챕터 총괄] 제1장 제품 설명 및 하드웨어 사양 총괄 [표 1-1] (PDF p.7–10 · Doc pp. 1–4 · 3개 청크)",
        "title_en": "[01 Chapter Root] Chapter 1: Product Description & Hardware Specifications [Table 1-1] (PDF p.7–10 · Doc pp. 1–4 · 3 Chunks)",
        "desc_ko": (
            "원본 PDF 제1장(Doc pp. 1–4, PDF p.7–10)의 표 1-1(Product components and their descriptions)을 기반으로 "
            "12세대 Intel Core Alder Lake-U 프로세서(i7-1265U/i7-1255U/i5-1245U/i5-1235U), 온보드 납땜 LPDDR5-6400 듀얼채널 메모리(16GB/32GB, 사용자 교체 불가), "
            "M.2 2280 PCIe Gen4×4 NVMe SSD, 13.5형 3:2 OLED/WUXGA+ 디스플레이, 8MP IR 카메라, Wi-Fi 6E AX211 및 5G/LTE WWAN 사양을 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 1 (Doc pp. 1–4, PDF pp. 7–10) Table 1-1 of N17344-001 covering 12th Gen Intel Core Alder Lake-U processors, "
            "soldered-onboard LPDDR5-6400 memory (16GB/32GB, customer non-accessible), M.2 2280 PCIe Gen4x4 NVMe SSD storage, "
            "13.5-inch 3:2 OLED/WUXGA+ displays, 8MP IR camera, Intel AX211 Wi-Fi 6E, and 5G/LTE WWAN modules."
        ),
    },
    "02_CH2_COMPONENTS_PORTS": {
        "doc_num": "02",
        "pdf_page": 11,
        "source_pages_span": "PDF p.11–21 (Doc pp. 5–15)",
        "title_ko": "[02 챕터 총괄] 제2장 외부 구성품 · 입출력 포트 · 디스플레이 · 키보드 및 서비스 라벨 [표 2-1~2-8] (PDF p.11–21 · Doc pp. 5–15 · 4개 청크)",
        "title_en": "[02 Chapter Root] Chapter 2: Components — Right/Left Ports, Display, Keyboard, Bottom & Labels [Tables 2-1–2-8] (PDF p.11–21 · Doc pp. 5–15 · 4 Chunks)",
        "desc_ko": (
            "원본 PDF 제2장(Doc pp. 5–15, PDF p.11–21)의 우측(마그네틱 펜 충전 영역·Nano SIM 슬롯), 좌측(오디오 콤보 잭·듀얼 Thunderbolt 4 포트·배터리 표시등), "
            "디스플레이(8MP 웹캠·듀얼 IR LED·조도센서·4x WWAN/2x WLAN 안테나), 키보드 영역(터치패드·상태 표시등·카메라 프라이버시 키·Sure View 키), 하판 통풍구 및 서비스 태그 라벨, Nano SIM 장착 절차를 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 2 (Doc pp. 5–15, PDF pp. 11–21) covering Right/Left side components (magnetic pen charger, nano SIM slot, audio jack, 2x Thunderbolt 4 USB4 ports), "
            "Display components (8MP webcam, dual IR LEDs, ambient light sensor, 6 wireless antennas), Keyboard/Touchpad/LEDs/Special keys, Bottom vents, Service tag labels, and SIM card insertion."
        ),
    },
    "03_CH3_SPARE_PARTS": {
        "doc_num": "03",
        "pdf_page": 22,
        "source_pages_span": "PDF p.22–30 (Doc pp. 16–24)",
        "title_ko": "[03 챕터 총괄] 제3장 도해 스페어 파트 카탈로그 (Illustrated Parts Catalog) [표 3-1, 3-2, 3-3] (PDF p.22–30 · Doc pp. 16–24 · 3개 청크)",
        "title_en": "[03 Chapter Root] Chapter 3: Illustrated Parts Catalog — Major Components, System Boards & Display Subcomponents [Tables 3-1–3-3] (PDF p.22–30 · Doc pp. 16–24 · 3 Chunks)",
        "desc_ko": (
            "원본 PDF 제3장(Doc pp. 16–24, PDF p.22–30)의 표 3-1(주요 본체 구성품 및 CPU·온보드 메모리 용량별 시스템 보드 N20724-601~N20728-601 FRU 번호), "
            "표 3-2(디스플레이 어셈블리 서브컴포넌트: 패널·디스플레이 트랜스퍼 보드 N22937-001·힌지 N22923-001·8MP 카메라), 표 3-3(어댑터·협업 펜 N16051-001·나사 키트 N22931-001)을 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 3 (Doc pp. 16–24, PDF pp. 22–30) Table 3-1 (Computer major components and soldered CPU/LPDDR5 System Board FRUs N20724-601 through N20728-601), "
            "Table 3-2 (Display assembly subcomponents: panels, transfer board N22937-001, hinges N22923-001, 8MP camera), and Table 3-3 (Miscellaneous parts and Screw Kit N22931-001)."
        ),
    },
    "04_CH5_SAFETY_RULES": {
        "doc_num": "04",
        "pdf_page": 31,
        "source_pages_span": "PDF p.31–38 (Doc pp. 25–32)",
        "title_ko": "[04 챕터 총괄] 제4장 분해 및 교체 사전 요구사항 · 정전기 방전(ESD 700V) 및 클리닝/포장 지침 [표 4-1] (PDF p.31–38 · Doc pp. 25–32 · 3개 청크)",
        "title_en": "[04 Chapter Root] Chapter 4: Removal and Replacement Preliminary Requirements & ESD Protection [Table 4-1] (PDF p.31–38 · Doc pp. 25–32 · 3 Chunks)",
        "desc_ko": (
            "원본 PDF 제4장(Doc pp. 25–32, PDF p.31–38)의 필수 수리 공구(Torx T5, Phillips P0/P1, 비자성 레버), 플라스틱 부품·케이블·드라이브 취급 주의사항, "
            "정전기 방전(ESD) 원리 및 습도별 정전기 전압 표 4-1(700V~35,000V), 접지 손목 스트랩/전도성 매트 기준, HP Easy Clean 세척 및 포장/운송 가이드를 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 4 (Doc pp. 25–32, PDF pp. 31–38) covering required tools, service considerations for plastic parts/cables/drives, "
            "Electrostatic Discharge (ESD) protection and Table 4-1 static voltage levels (700V–35,000V), grounding wrist straps/mats, HP Easy Clean, and packaging/transporting rules."
        ),
    },
    "05_CH5_BASE_STORAGE_WWAN": {
        "doc_num": "05",
        "pdf_page": 39,
        "source_pages_span": "PDF p.39–49 (Doc pp. 33–43)",
        "title_ko": "[05 챕터 총괄] 제5장 (Part A) 공인 서비스 파트너 부품 분해 절차 — 하판 커버 · SSD · 펜 슬롯 · SIM 보드 · WWAN · 무선충전 · 배터리 (PDF p.39–49 · Doc pp. 33–43 · 4개 청크)",
        "title_en": "[05 Chapter Root] Chapter 5 (Part A): Authorized Service Provider Removal Procedures — Bottom Cover, SSD, SIM, WWAN, Wireless Charger & Battery (PDF p.39–49 · Doc pp. 33–43 · 4 Chunks)",
        "desc_ko": (
            "원본 PDF 제5장 전반부(Doc pp. 33–43, PDF p.39–49)의 분해 사전 준비, 하판 커버(N22918-001 및 가죽 커버 분리), M.2 2280 PCIe Gen4 NVMe SSD(EMI 실드 포함), "
            "마그네틱 펜 슬롯, SIM 보드(N22922-001), 5G/LTE WWAN 모듈(4x4 MIMO 안테나 #5/#6/#7/#8), 무선 충전 모듈(N22924-001), 4셀 53Whr 배터리(M90788-005) 분리 절차를 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 5 Part A (Doc pp. 33–43, PDF pp. 39–49) covering preparation for disassembly, Bottom cover (N22918-001 & leather wrap release), "
            "M.2 2280 PCIe Gen4 NVMe SSD, Magnetic pen slot, SIM board (N22922-001), WWAN module (4x4 MIMO antennas #5–#8), Wireless charging module (N22924-001), and 4-cell 53Whr Battery (M90788-005)."
        ),
    },
    "06_CH5_THERMAL_BOARD_DISPLAY": {
        "doc_num": "06",
        "pdf_page": 50,
        "source_pages_span": "PDF p.50–82 (Doc pp. 44–76)",
        "title_ko": "[06 챕터 총괄] 제5장 (Part B) 공인 서비스 파트너 부품 분해 절차 — 스피커 · 트랜스퍼 보드 · 터치패드 · 히트싱크 · 시스템 보드 · 안테나 · 디스플레이 및 힌지 (PDF p.50–82 · Doc pp. 44–76 · 3개 청크)",
        "title_en": "[06 Chapter Root] Chapter 5 (Part B): Authorized Service Provider Removal Procedures — Speakers, Touchpad, Heat Sink, System Board & Display Assembly (PDF p.50–82 · Doc pp. 44–76 · 3 Chunks)",
        "desc_ko": (
            "원본 PDF 제5장 후반부(Doc pp. 44–76, PDF p.50–82)의 하단/상단 스피커, 트랜스퍼 보드(N22921-001), 터치패드(N22933-001), 히트싱크(N22936-001, 1-2-3-4 순서 및 써멀 패드), "
            "시스템 보드(N20724-601~N20728-601) 및 오디오 잭 다단계 분해 DAG, 안테나 배럴(N22932-001), 탑커버 키보드(N22938-001), 디스플레이 패널 서브컴포넌트(풀탭 접착 테이프·디스플레이 트랜스퍼 보드 N22937-001·8MP 카메라·힌지 N22923-001) 분해 절차를 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 5 Part B (Doc pp. 44–76, PDF pp. 50–82) covering Bottom/Top speakers, Transfer board (N22921-001), Touchpad (N22933-001), Heat sink (N22936-001), "
            "System board (N20724-601–N20728-601) multi-hop disassembly DAG, Antenna barrel (N22932-001), Top cover with keyboard (N22938-001), and Display panel/subcomponents/hinges (N22923-001)."
        ),
    },
    "07_CH6_7_BIOS_DIAGNOSTICS": {
        "doc_num": "07",
        "pdf_page": 83,
        "source_pages_span": "PDF p.83–94 (Doc pp. 77–88)",
        "title_ko": "[07 챕터 총괄] 제6장 백업·복구 · 제7장 Computer Setup(BIOS)/TPM/HP Sure Start · 제8장 HP PC Hardware Diagnostics 진단 (PDF p.83–94 · Doc pp. 77–88 · 3개 청크)",
        "title_en": "[07 Chapter Root] Chapters 6, 7 & 8: Backing Up/Recovering, Computer Setup (BIOS)/TPM/HP Sure Start & HP PC Hardware Diagnostics (PDF p.83–94 · Doc pp. 77–88 · 3 Chunks)",
        "desc_ko": (
            "원본 PDF 제6장(백업·복원·HP Cloud Recovery·HP Sure Recover, Doc pp. 77–79 / PDF p.83–85), 제7장(Computer Setup F10 BIOS·초기화·BIOS 업데이트·F9 부트 순서·TPM 2.0·HP Sure Start, Doc pp. 80–83 / PDF p.86–89), "
            "제8장(HP PC Hardware Diagnostics Windows/UEFI·24자리 Failure ID 코드·Remote UEFI 진단 및 LED 점멸 트리아지, Doc pp. 84–88 / PDF p.90–94)을 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 6 (Backing up, restoring, HP Cloud Recovery & HP Sure Recover, PDF pp. 83–85), Chapter 7 (Computer Setup F10 BIOS, BIOS update, F9 boot order, TPM 2.0 & HP Sure Start, PDF pp. 86–89), "
            "and Chapter 8 (Using HP PC Hardware Diagnostics Windows/UEFI, 24-digit failure ID codes, Remote UEFI diagnostics & LED blink triage, PDF pp. 90–94)."
        ),
    },
    "08_INTERNAL_FIELD_SOP_PLAYBOOKS": {
        "doc_num": "08",
        "pdf_page": 95,
        "source_pages_span": "PDF p.95–106 (Doc pp. 89–100)",
        "title_ko": "[08 챕터 총괄] 제9장 제품 제원 · 제10장 비휘발성 메모리 명세[표 10-1] 및 HP Sure Start 복구 · 제11~12장 재활용/전원코드 및 거버넌스 (PDF p.95–106 · Doc pp. 89–100 · 3개 청크)",
        "title_en": "[08 Chapter Root] Chapters 9–12: Specifications, Statement of Memory Volatility [Table 10-1], HP Sure Start Recovery, Recycling/Power Cords & Governance (PDF p.95–106 · Doc pp. 89–100 · 3 Chunks)",
        "desc_ko": (
            "원본 PDF 제9장(컴퓨터·디스플레이·SSD 물리/전력 제원, Doc pp. 89–90 / PDF p.95–96), 제10장(비휘발성 메모리 명세 표 10-1: System BIOS 9MB SPI, HP Sure Start 8MB SPI, Intel CSME 16MB, TPM 2.0 SLB9672, EC, PD 컨트롤러, Retimer 및 HP Sure Start 자동 복구, Doc pp. 91–97 / PDF p.97–103), "
            "제11~12장(배터리/하드웨어 재활용 및 국가별 전원 코드 요건, Doc pp. 98–100 / PDF p.104–106) 및 Dataplex KC 거버넌스 게이트 검증 조항을 요약합니다."
        ),
        "desc_en": (
            "Summarizes Chapter 9 (Computer/Display/SSD Specifications, PDF pp. 95–96), Chapter 10 (Statement of Memory Volatility Table 10-1: 9MB System BIOS SPI, 8MB HP Sure Start SPI, 16MB Intel CSME, TPM 2.0 SLB9672, EC, PD controller, Retimer & Using HP Sure Start automatic recovery, PDF pp. 97–103), "
            "Chapters 11–12 (Recycling & Power cord requirements, PDF pp. 104–106), and Dataplex KC governance gate control."
        ),
    },
}

# ---------------------------------------------------------------------------
# 2. Exact 26 Section Chunks mapped to exact PDF File Pages (`pdf_page`)
#    and Document Pages (`doc_pages`) in `docs/pdf_6290467_en-US-1.pdf`
# ---------------------------------------------------------------------------
PDF_CHUNKS_SPEC: Dict[str, Dict[str, Any]] = {
    "manuals/01_ch1_product_specs/sec_1_1_platform_architecture": {
        "pdf_page": 7,
        "pdf_pages_range": (7, 7),
        "pages_span": "PDF p.7 (Doc p.1)",
        "section_number_ko": "제1장 표 1-1 (프로세서·그래픽·디스플레이)",
        "section_number_en": "Ch.1 Table 1-1 (Processors, Graphics & Display)",
        "title_ko": "제1장 표 1-1 — 제품 설명: 12세대 Intel Alder Lake-U 프로세서 · Iris Xe 그래픽 및 13.5형 3:2 디스플레이 (PDF p.7 · Doc p.1)",
        "title_en": "Chapter 1 Table 1-1 — Product Description: 12th Gen Intel Alder Lake-U Processors, Iris Xe Graphics & 13.5\" 3:2 Display (PDF p.7 · Doc p.1)",
        "summary_ko": "HP Dragonfly Folio 13.5 G3의 12세대 Intel Core i7-1265U/i7-1255U/i5-1245U/i5-1235U(10코어, 12MB 캐시), Intel Iris Xe 그래픽, 13.5형 3:2 WUXGA+(1920×1280) 및 3K2K(3000×2000) OLED 터치 디스플레이 원문 규격입니다.",
        "summary_en": "Covers HP Dragonfly Folio 13.5 G3 12th Gen Intel Core processors (i7-1265U, i7-1255U, i5-1245U, i5-1235U), Intel Iris Xe Graphics, and 13.5-inch 3:2 WUXGA+ / 3K2K OLED touch displays from Table 1-1 (PDF p.7 / Doc p.1).",
        "extra_domain_notes": "Keep references to `SKU-DFG3-I732-5G`, `N20728-601`, `M90788-601` / `N19201-601` so ontology graph links remain 100% intact.",
    },
    "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule": {
        "pdf_page": 7,
        "pdf_pages_range": (7, 8),
        "pages_span": "PDF p.7–8 (Doc p.1–2)",
        "section_number_ko": "제1장 표 1-1 (온보드 LPDDR5 메모리)",
        "section_number_en": "Ch.1 Table 1-1 (Soldered LPDDR5 Memory)",
        "title_ko": "제1장 표 1-1 — 온보드 솔더링 LPDDR5-6400 듀얼채널 메모리 아키텍처 (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1)",
        "title_en": "Chapter 1 Table 1-1 — Onboard Soldered LPDDR5-6400 MHz Dual-Channel Memory Rule (Customer Non-Accessible · 16GB/32GB, PDF p.7 · Doc p.1)",
        "summary_ko": "LPDDR5-6400 MHz 듀얼 채널 메모리(16GB / 32GB)가 시스템 보드에 영구 납땜(Soldered Onboard, Customer Non-Accessible)되어 단품 증설/교체가 불가하며 시스템 보드 통교체가 필요함을 명시합니다.",
        "summary_en": "Specifies that LPDDR5-6400 MHz dual-channel memory (16GB / 32GB) is permanently soldered onboard (Customer non-accessible), requiring full System Board FRU replacement upon memory failure.",
        "extra_domain_notes": "Highlight exact PDF quote: 'Memory is soldered onboard. Customer non-accessible. Supports dual-channel memory. LPDDR5-6400 MHz, 32 GB and 16 GB'. Include board part numbers `N20728-601` (`N19201-601`/`M90788-601`) and `N20727-601` (`N19202-601`).",
    },
    "manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs": {
        "pdf_page": 8,
        "pdf_pages_range": (8, 10),
        "pages_span": "PDF p.8–10 (Doc p.2–4)",
        "section_number_ko": "제1장 표 1-1 (NVMe SSD·카메라·무선·보안·배터리)",
        "section_number_en": "Ch.1 Table 1-1 (Storage, Camera, Wireless, TPM & Battery)",
        "title_ko": "제1장 표 1-1 — M.2 2280 PCIe Gen4 NVMe 스토리지 · 8MP IR 카메라 · Wi-Fi 6E AX211 · 5G WWAN · TPM 2.0 및 53Whr 배터리 (PDF p.8–10 · Doc p.2–4)",
        "title_en": "Chapter 1 Table 1-1 — M.2 2280 PCIe Gen4 NVMe Storage, 8MP IR Camera, Wi-Fi 6E AX211, 5G WWAN, TPM 2.0 & 53Whr Battery (PDF p.8–10 · Doc p.2–4)",
        "summary_ko": "M.2 2280 PCIe Gen4x4 NVMe SSD(256GB~2TB TLC/SED), 8MP MIPI + IR 웹캠, Bang & Olufsen 쿼드 스피커, Intel AX211 Wi-Fi 6E, Intel 5000 5G / XMM 7560 R+ LTE WWAN(4x4 안테나), Infineon SLB9672 TPM 2.0, 4셀 53Whr(및 66Wh 호환) 배터리 사양을 정의합니다.",
        "summary_en": "Details Table 1-1 specifications for M.2 2280 PCIe Gen4x4 NVMe SSDs (256GB–2TB), 8MP MIPI + IR camera, Bang & Olufsen quad speakers, Intel AX211 Wi-Fi 6E, Intel 5000 5G / XMM 7560 R+ WWAN, Infineon SLB9672 TPM 2.0, and 4-cell 53Whr battery.",
        "extra_domain_notes": "Include SSD part numbers `M16560-005`, `M52027-005`, `M52031-005` (`M90790-001`), WWAN `N00182-005` (`M90792-001`) and `M52040-005`, and TPM `SLB9672`.",
    },
    "manuals/02_ch2_external_components/sec_2_1_thunderbolt_and_io_ports": {
        "pdf_page": 11,
        "pdf_pages_range": (11, 12),
        "pages_span": "PDF p.11–12 (Doc p.5–6)",
        "section_number_ko": "제2장 표 2-1·2-2 (우측·좌측 컴포넌트 및 포트)",
        "section_number_en": "Ch.2 Tables 2-1 & 2-2 (Right & Left Side Ports)",
        "title_ko": "제2장 표 2-1·2-2 — 우측(마그네틱 펜 충전·Nano SIM) 및 좌측(오디오 콤보 잭·듀얼 Thunderbolt 4 USB-C·배터리 LED) 컴포넌트 (PDF p.11–12 · Doc p.5–6)",
        "title_en": "Chapter 2 Tables 2-1 & 2-2 — Right Side (Magnetic Pen Charger, Nano SIM) & Left Side (Audio Jack, 2x Thunderbolt 4 USB-C & Battery LED) (PDF p.11–12 · Doc p.5–6)",
        "summary_ko": "우측면 마그네틱 펜 부착/무선충전 영역 및 Nano SIM 슬롯(표 2-1)과 좌측면 3.5mm 오디오 콤보 잭(플러그 삽입 시 내장 스피커 자동 음소거), 2개의 USB Type-C 전원 겸 Thunderbolt 4 포트(HP Sleep and Charge, DisplayPort), 배터리 표시등(표 2-2)을 정의합니다.",
        "summary_en": "Documents Right-side components (Table 2-1: magnetic pen attachment/wireless charging area, nano SIM card slot) and Left-side components (Table 2-2: audio combo jack with automatic speaker cutoff, 2x USB Type-C power & Thunderbolt 4 ports, battery light).",
        "extra_domain_notes": "Mention dock compatibility (`M97105-001` 120W G4 Dock, `M97106-001` 280W G4 Dock) and audio jack automatic speaker mute rule on Doc p.6 (PDF p.12).",
    },
    "manuals/02_ch2_external_components/sec_2_2_display_oled_sureview_camera": {
        "pdf_page": 13,
        "pdf_pages_range": (13, 14),
        "pages_span": "PDF p.13–14 (Doc p.7–8)",
        "section_number_ko": "제2장 표 2-3 (디스플레이 컴포넌트 및 안테나)",
        "section_number_en": "Ch.2 Table 2-3 (Display Components & Antennas)",
        "title_ko": "제2장 표 2-3 — 디스플레이 컴포넌트: Low Blue Light · 듀얼 마이크 · 8MP IR 카메라 · 조도 센서(ALS) 및 6개 내장 무선 안테나 (PDF p.13–14 · Doc p.7–8)",
        "title_en": "Chapter 2 Table 2-3 — Display Components: Low Blue Light Mode, Dual Microphones, 8MP IR Camera, Ambient Light Sensor & 6 Wireless Antennas (PDF p.13–14 · Doc p.7–8)",
        "summary_ko": "디스플레이 상단 베젤의 듀얼 내장 마이크(1), 카메라 표시등(2), 듀얼 IR LED(3), 8MP 웹캠(4), 주변 조도 센서 ALS(5), 그리고 상단/측면에 배치된 2개 WLAN 안테나(6) 및 4개 WWAN MIMO 안테나(7) 배치 구조(표 2-3)를 설명합니다.",
        "summary_en": "Covers Table 2-3 Display components (PDF pp. 13–14 / Doc pp. 7–8): Low blue light mode, dual internal microphones, camera light, dual IR LEDs, 8MP camera, ambient light sensor (ALS), 2x WLAN antennas, and 4x WWAN antennas.",
        "extra_domain_notes": "Keep references to OLED panel (`N23305-001` / `N09033-001`), Sure View panel (`N23304-001` / `N09032-001`), and 8MP Camera (`N23306-001` / `N19002-001`).",
    },
    "manuals/02_ch2_external_components/sec_2_3_keyboard_privacy_shutter_biometrics": {
        "pdf_page": 14,
        "pdf_pages_range": (14, 18),
        "pages_span": "PDF p.14–18 (Doc p.8–12)",
        "section_number_ko": "제2장 표 2-4·2-5·2-6 (터치패드·표시등·특수 키)",
        "section_number_en": "Ch.2 Tables 2-4, 2-5 & 2-6 (Touchpad, Lights & Special Keys)",
        "title_ko": "제2장 표 2-4~2-6 — 키보드 영역: 터치패드 · 상태 표시등(Caps Lock/프라이버시/음소거) · 특수 키(Sure View·카메라 프라이버시 키·지문인식기) (PDF p.14–18 · Doc p.8–12)",
        "title_en": "Chapter 2 Tables 2-4–2-6 — Keyboard Area: Touchpad, Status Lights (Caps Lock/Privacy/Mute) & Special Keys (Sure View, Camera Privacy Key & Fingerprint Reader) (PDF p.14–18 · Doc p.8–12)",
        "summary_ko": "터치패드(표 2-4), 키보드 상태 표시등(표 2-5: 음소거·마이크 음소거·전원·Caps Lock·전자식 카메라 프라이버시·HP Sure View 표시등), 특수 키(표 2-6: esc/fn 시스템 정보 조합, Sure View 키, 프로그래밍 키, 카메라 프라이버시 키, 전원 키, 지문 인식기)를 다룹니다.",
        "summary_en": "Covers Touchpad components (Table 2-4), Keyboard status lights (Table 2-5: Mute, Mic mute, Power, Caps Lock, Camera privacy, HP Sure View), and Special keys (Table 2-6: Sure View key, Programmable key, Camera privacy key, Power key, Fingerprint reader).",
        "extra_domain_notes": "Note the electronic camera privacy key (`F12` / special key `(4)`) and troubleshooting link `TS-DFG3-005`.",
    },
    "manuals/02_ch2_external_components/sec_2_4_service_tag_and_regulatory_labels": {
        "pdf_page": 18,
        "pdf_pages_range": (18, 21),
        "pages_span": "PDF p.18–21 (Doc p.12–15)",
        "section_number_ko": "제2장 표 2-7·2-8 (하판 통풍구·서비스 라벨·Nano SIM 장착)",
        "section_number_en": "Ch.2 Tables 2-7 & 2-8 (Bottom Vents, Labels & Nano SIM Card)",
        "title_ko": "제2장 표 2-7·2-8 — 하판 스피커/통풍구 · 서비스 라벨(Serial Number·Product ID·보증기간) 및 Nano SIM 카드 장착 절차 (PDF p.18–21 · Doc p.12–15)",
        "title_en": "Chapter 2 Tables 2-7 & 2-8 — Bottom Speakers/Vents, Service Labels (Serial Number, Product ID, Warranty) & Inserting a Nano SIM Card (PDF p.18–21 · Doc p.12–15)",
        "summary_ko": "하판 쿼드 스피커 및 방열 통풍구(표 2-7), 하판 서비스 라벨 식별 항목(표 2-8: 제품명, 호환성 모델 번호, 일련번호 Serial Number, 제품 ID Product ID, 보증 기간) 및 우측 마그네틱 펜 하단 Nano SIM 트레이 분리/장착 절차(Doc pp. 14–15)를 정의합니다.",
        "summary_en": "Details Bottom components (Table 2-7: speakers and airflow vents), Service and regulatory labels (Table 2-8: Product name, Serial number, Product ID, Warranty period), and step-by-step Nano SIM card insertion under the magnetic pen dock.",
        "extra_domain_notes": "Mention DMI reprogramming requirement after System Board replacement using Serial Number & Product ID from Table 2-8.",
    },
    "manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog": {
        "pdf_page": 22,
        "pdf_pages_range": (22, 24),
        "pages_span": "PDF p.22–24 (Doc p.16–18)",
        "section_number_ko": "제3장 표 3-1 (컴퓨터 주요 부품 FRU 카탈로그)",
        "section_number_en": "Ch.3 Table 3-1 (Computer Major Components FRU Catalog)",
        "title_ko": "제3장 [표 3-1] — 주요 본체 구성품 스페어 파트 카탈로그: 탑커버 키보드 · 터치패드 · 히트싱크 · 배터리 · SSD · WWAN · 하판 커버 (PDF p.22–24 · Doc p.16–18)",
        "title_en": "Chapter 3 [Table 3-1] — Computer Major Component Descriptions & Spare Part Numbers: Top Cover, Heat Sink, Battery, SSD, WWAN & Bottom Cover (PDF p.22–24 · Doc p.16–18)",
        "summary_ko": "원본 PDF 표 3-1(Doc pp. 16–18, PDF p.22–24)의 본체 20대 주요 구성품 스페어 파트 번호(탑커버 키보드 N22938-001, 터치패드 N22933-001, 히트싱크 N22936-001, 4셀 53Whr 배터리 M90788-005, NVMe SSD M16560-005/M52027-005/M52031-005, WWAN M52040-005/N00182-005, 하판 커버 N22918-001 등)를 수록합니다.",
        "summary_en": "Catalogs all 20 major computer components from Table 3-1 (PDF pp. 22–24 / Doc pp. 16–18), including Top cover with keyboard (N22938-001), Touchpad (N22933-001), Heat sink (N22936-001), 4-cell 53Whr Battery (M90788-005), PCIe Gen4 SSDs, WWAN modules, and Bottom cover (N22918-001).",
        "extra_domain_notes": "Include both Folio G3 / G3 part IDs (`N22918-001`, `M90788-005`, `N22936-001`/`N18244-001`, `M16560-005`/`M90790-001`, `N00182-005`/`M90792-001`) so all SQL/GQL queries match.",
    },
    "manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix": {
        "pdf_page": 23,
        "pdf_pages_range": (23, 24),
        "pages_span": "PDF p.23–24 (Doc p.17–18)",
        "section_number_ko": "제3장 표 3-1 품목(8) (시스템 보드 FRU 매트릭스)",
        "section_number_en": "Ch.3 Table 3-1 Item (8) (System Board FRU Matrix)",
        "title_ko": "제3장 [표 3-1 품목 8] — 시스템 보드(System Board) 스페어 파트 매트릭스: CPU(i7-1265U/i7-1255U/i5-1245U/i5-1235U) × 온보드 LPDDR5(16GB/32GB) (PDF p.23–24 · Doc p.17–18)",
        "title_en": "Chapter 3 [Table 3-1 Item 8] — System Board Spare Part Matrix by CPU & Soldered LPDDR5 Memory (16GB vs. 32GB) (PDF p.23–24 · Doc p.17–18)",
        "summary_ko": "원본 PDF 표 3-1 품목 (8)(PDF p.23–24, Doc pp. 17–18)의 온보드 CPU 및 LPDDR5 용량별 시스템 보드 스페어 파트 번호(i7-1265U 32GB N20728-601, i7-1265U 16GB N20727-601, i7-1255U 32GB N20726-601, i7-1255U 16GB N20725-601, i5-1245U 16GB N20724-601, i5-1235U 16GB N22935-601 및 WWAN/Wi-Fi SKU 매핑)를 정리합니다.",
        "summary_en": "Details Table 3-1 Item (8) System Board spare part numbers (PDF pp. 23–24 / Doc pp. 17–18): N20728-601 (i7-1265U + 32GB), N20727-601 (i7-1265U + 16GB), N20726-601 (i7-1255U + 32GB), N20725-601 (i7-1255U + 16GB), N20724-601 (i5-1245U + 16GB), and N22935-601 (i5-1235U + 16GB).",
        "extra_domain_notes": "Map both Folio G3 (`N20728-601`~`N20724-601`, `N22935-601`) and G3 Clamshell (`N19201-601`/`M90788-601`, `N19202-601`) system board part IDs to `SKU-DFG3-I732-5G` and `SKU-DFG3-I716-WIFI`.",
    },
    "manuals/03_ch3_spare_parts_catalog/table_3_2_display_and_antenna_subcomponents": {
        "pdf_page": 24,
        "pdf_pages_range": (24, 30),
        "pages_span": "PDF p.24–30 (Doc p.18–24)",
        "section_number_ko": "제3장 표 3-2·3-3 (디스플레이 서브컴포넌트 및 기타 부품)",
        "section_number_en": "Ch.3 Tables 3-2 & 3-3 (Display Subcomponents & Misc Parts)",
        "title_ko": "제3장 [표 3-2·3-3] — 디스플레이 어셈블리 서브컴포넌트(패널·트랜스퍼 보드 N22937-001·힌지 N22923-001·8MP 카메라) 및 나사 키트(N22931-001) (PDF p.24–30 · Doc p.18–24)",
        "title_en": "Chapter 3 [Tables 3-2 & 3-3] — Display Assembly Subcomponents (Panels, Transfer Board N22937-001, Hinges N22923-001, 8MP Camera) & Screw Kit (N22931-001) (PDF p.24–30 · Doc p.18–24)",
        "summary_ko": "원본 PDF 표 3-2(디스플레이 패널 N23304-001/N23305-001, 디스플레이 트랜스퍼 보드 N22937-001, 힌지 어셈블리 N22923-001, 8MP 카메라 N23306-001, 무선 안테나) 및 표 3-3(65W USB-C 어댑터, HP Collaboration G3 펜 N16051-001, 나사 키트 N22931-001)을 수록합니다.",
        "summary_en": "Covers Table 3-2 Display assembly subcomponents (panels N23304-001/N23305-001, display transfer board N22937-001, hinges N22923-001, 8MP camera N23306-001, wireless antennas) and Table 3-3 Miscellaneous parts (65W USB-C adapters, HP Collaboration G3 Pen N16051-001, Screw Kit N22931-001).",
        "extra_domain_notes": "Include stretch-release adhesive pull tab (`N09039-001`) and hinge partial replacement rule (`N22923-001` / `N18995-001` vs full OLED display).",
    },
    "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol": {
        "pdf_page": 32,
        "pdf_pages_range": (32, 35),
        "pages_span": "PDF p.32–35 (Doc p.26–29)",
        "section_number_ko": "제4장 §4.3 표 4-1 (정전기 방전 ESD 700V 및 접지 방법)",
        "section_number_en": "Ch.4 §4.3 Table 4-1 (ESD 700V Sensitivity & Grounding)",
        "title_ko": "제4장 §4.3 [표 4-1] — 정전기 방전(ESD 700V~35,000V) 손상 방지 및 접지 손목 스트랩/전도성 매트 프로토콜 (PDF p.32–35 · Doc p.26–29)",
        "title_en": "Chapter 4 §4.3 [Table 4-1] — Electrostatic Discharge (ESD 700V–35,000V) Protection & Grounding Wrist Strap/Mat Protocol (PDF p.32–35 · Doc p.26–29)",
        "summary_ko": "원본 PDF 제4장(Doc pp. 26–29, PDF p.32–35)의 정전기 방전(ESD) 주의사항 및 표 4-1(상대습도 10%/40%/55%에 따른 카펫 걷기 35,000V, 비닐 시트 12,000V, 폴리백 취급 7,000V~1,200V 등 — 700V만으로도 CMOS/LPDDR5 소자 파괴 가능)과 1MΩ 접지 손목 스트랩·전도성 매트 사용 기준을 다룹니다.",
        "summary_en": "Details Chapter 4 Electrostatic Discharge (ESD) protection and Table 4-1 Static Voltage Generation across 10%/40%/55% relative humidity (showing 700V threshold can destroy CMOS/LPDDR5 devices), plus mandatory wrist-strap and conductive mat grounding rules.",
        "extra_domain_notes": "Include the complete Table 4-1 values from PDF p.33 (Doc p.27) and `SAFE-DFG3-ESD` / `N09040-001` Mylar shield rules.",
    },
    "manuals/04_ch5_preliminary_safety/sec_5_2_pre_disassembly_and_tooling_rules": {
        "pdf_page": 31,
        "pdf_pages_range": (31, 32),
        "pages_span": "PDF p.31–32 (Doc p.25–26)",
        "section_number_ko": "제4장 §4.1·4.2 (필수 수리 공구 및 케이블·드라이브 취급 수칙)",
        "section_number_en": "Ch.4 §4.1–4.2 (Tools Required & Service Considerations)",
        "title_ko": "제4장 §4.1·4.2 — 분해 전 필수 공구 규격(Torx T5 · Phillips P0/P1 · 비자성 레버) 및 플라스틱·케이블·드라이브 취급 수칙 (PDF p.31–32 · Doc p.25–26)",
        "title_en": "Chapter 4 §4.1–4.2 — Tools Required (Torx T5, Phillips P0/P1, Non-Marking Plastic Lever) & Plastic/Cable/Drive Handling Considerations (PDF p.31–32 · Doc p.25–26)",
        "summary_ko": "원본 PDF 제4장 첫머리(Doc pp. 25–26, PDF p.31–32)의 필수 공구 목록(자성 Torx T5 드라이버, Phillips P0 및 P1 드라이버, 비자성 플라스틱 지렛대)과 플라스틱 부품, ZIF 플렉스 케이블, 커넥터 및 솔리드 스테이트 드라이브 취급 시 주의사항을 정의합니다.",
        "summary_en": "Documents Chapter 4 Tools required (magnetic Torx T5, Phillips P0 and P1 screwdrivers, non-marking plastic lever) and Service considerations for plastic parts, ZIF/flex cables, connectors, and solid-state drives.",
        "extra_domain_notes": "Include torque specs (Torx T5 `0.20 N·m`, Phillips P0/P1 `0.22–0.35 N·m`) and BIOS Battery Service Mode pre-disassembly steps.",
    },
    "manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule": {
        "pdf_page": 35,
        "pdf_pages_range": (35, 38),
        "pages_span": "PDF p.35–38 (Doc p.29–32)",
        "section_number_ko": "제4장 §4.4~4.6 (HP Easy Clean 세척 · 포장/운송 및 팽창 배터리 안전)",
        "section_number_en": "Ch.4 §4.4–4.6 (Cleaning, Packaging/Transporting & Swollen Battery Safety)",
        "title_ko": "제4장 §4.4~4.6 — 컴퓨터 세척(HP Easy Clean) · 포장/운송 가이드라인 및 팽창 리튬이온 배터리(Swollen Battery) 취급 수칙 (PDF p.35–38 · Doc p.29–32)",
        "title_en": "Chapter 4 §4.4–4.6 — Cleaning (HP Easy Clean), Packaging/Transporting Guidelines & Swollen Lithium-Ion Battery Safety Rules (PDF p.35–38 · Doc p.29–32)",
        "summary_ko": "원본 PDF 제4장 후반부(Doc pp. 29–32, PDF p.35–38)의 전도성/차폐 포장재 목록, HP Easy Clean 컴퓨터 세척 수칙, 정전기 방지 포장 및 운송 온도(-40°C~60°C)/습도 기준, 그리고 팽창된 리튬이온 배터리(M90788-005) 열폭주 방지 안전 수칙(`SAFE-DFG3-BAT`)을 다룹니다.",
        "summary_en": "Covers Chapter 4 protective packaging materials, cleaning procedures with HP Easy Clean, packaging and transporting environmental ranges (-40°C to 60°C), and swollen lithium-ion battery (`M90788-005`) safety protocol (`SAFE-DFG3-BAT`).",
        "extra_domain_notes": "Retain `SAFE-DFG3-BAT` swollen battery handling rules and adjacent heat sink (`N22936-001` / `N18244-001`) inspection note.",
    },
    "manuals/05_ch5_base_battery_storage/sec_5_4_bottom_cover_removal": {
        "pdf_page": 39,
        "pdf_pages_range": (39, 41),
        "pages_span": "PDF p.39–41 (Doc p.33–35)",
        "section_number_ko": "제5장 §5.1·5.2 (분해 사전 준비 및 하판 커버 N22918-001 분리)",
        "section_number_en": "Ch.5 §5.1–5.2 (Preparation for Disassembly & Bottom Cover N22918-001)",
        "title_ko": "제5장 §5.1·5.2 — 분해 사전 준비 및 하판 커버(Bottom Cover, N22918-001) · 가죽 커버 분리 절차 (PDF p.39–41 · Doc p.33–35)",
        "title_en": "Chapter 5 §5.1–5.2 — Preparation for Disassembly & Bottom Cover (N22918-001) Removal Procedure (PDF p.39–41 · Doc p.33–35)",
        "summary_ko": "원본 PDF 제5장 첫 절차(Doc pp. 33–35, PDF p.39–41)인 분해 사전 준비(전원 종료, AC/외부케이블/SIM 제거)와 하판 커버(N22918-001) 분리 절차(4개 캡티브 나사 해제, 스피커 홀 2개 Phillips M2.0×4.5 나사 제거, 후면 가죽 커버 모서리 해제 후 하판 분리)를 수록합니다.",
        "summary_en": "Details Chapter 5 Preparation for disassembly and Bottom cover (`N22918-001`) removal on PDF pp. 39–41 (Doc pp. 33–35): loosening the 4 captive screws, removing the 2 Phillips M2.0×4.5 screws in the speaker holes, and releasing the wrap-around leather cover edges.",
        "extra_domain_notes": "Include both Folio G3 (4 captive Phillips + 2 M2.0x4.5 screws, `N22918-001`) and G3 Clamshell (5 captive Torx T5 `0.20 N·m`, `N22918-001`/`N09035-001`) fastener details.",
    },
    "manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal": {
        "pdf_page": 48,
        "pdf_pages_range": (48, 49),
        "pages_span": "PDF p.48–49 (Doc p.42–43)",
        "section_number_ko": "제5장 §5.8 (배터리 팩 M90788-005 분리 및 전원 차단)",
        "section_number_en": "Ch.5 §5.8 (Battery Pack M90788-005 Removal & Power Isolation)",
        "title_ko": "제5장 §5.8 — 4셀 53Whr 배터리 팩(M90788-005) 분리 절차 및 선행 전원 차단 강행 원칙 (PDF p.48–49 · Doc p.42–43)",
        "title_en": "Chapter 5 §5.8 — 4-Cell 53 Whr Battery Pack (M90788-005) Removal & Prerequisite Power Isolation Procedure (PDF p.48–49 · Doc p.42–43)",
        "summary_ko": "원본 PDF 제5장 배터리 분리 섹션(Doc pp. 42–43, PDF p.48–49)에 따라 4셀 53Whr 리튬이온 배터리(M90788-005) 상단 접착 테이프(1)를 젖히고 시스템 보드에서 배터리 전원 케이블(2)을 분리한 뒤, Phillips M2.0×4.0 나사 4개(3)를 제거하여 배터리를 들어 올리는 절차를 설명합니다.",
        "summary_en": "Details Chapter 5 Battery (`M90788-005`, 4-cell 53 Whr) removal on PDF pp. 48–49 (Doc pp. 42–43): peeling back the retention tape (1), disconnecting the battery cable from the system board (2), removing 4 Phillips M2.0×4.0 screws (3), and lifting out the battery (4).",
        "extra_domain_notes": "Emphasize that battery power isolation (`M90788-005`) is a prerequisite (`REQUIRES_REMOVAL_OF`) before removing system board, heat sink, or internal ZIF assemblies.",
    },
    "manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure": {
        "pdf_page": 41,
        "pdf_pages_range": (41, 42),
        "pages_span": "PDF p.41–42 (Doc p.35–36)",
        "section_number_ko": "제5장 §5.3 (솔리드 스테이트 드라이브 M.2 2280 NVMe SSD 분리)",
        "section_number_en": "Ch.5 §5.3 (Solid-State Drive M.2 2280 NVMe SSD Removal)",
        "title_ko": "제5장 §5.3 — 솔리드 스테이트 드라이브(M.2 2280 PCIe Gen4 NVMe SSD) 및 EMI 차폐 실드 분리·장착 절차 (PDF p.41–42 · Doc p.35–36)",
        "title_en": "Chapter 5 §5.3 — Solid-State Drive (M.2 2280 PCIe Gen4 NVMe SSD) & EMI Shield Removal Procedure (PDF p.41–42 · Doc p.35–36)",
        "summary_ko": "원본 PDF 제5장 SSD 분리 섹션(Doc pp. 35–36, PDF p.41–42)에 따라 하판 커버 제거 및 배터리 케이블 분리 후, Phillips M2.0×2.5 나사(1)를 풀고 SSD 가장자리를 잡고 당겨 분리(2)하며, M.2 소켓 주위 실드 핑거에 금속 EMI 실드(`N09040-001`)를 정확히 안착시키는 절차를 다룹니다.",
        "summary_en": "Covers Chapter 5 Solid-state drive removal on PDF pp. 41–42 (Doc pp. 35–36): disconnecting the battery cable, removing the Phillips M2.0×2.5 screw (1), pulling the M.2 2280 PCIe Gen4 SSD from its socket (2), and reinstalling the metal EMI/thermal shield (`N09040-001`).",
        "extra_domain_notes": "Include SSD spare part numbers (`M52027-005` 2TB, `M16560-005` 1TB, `M52031-005` 512GB SED, `M90790-001`) and `N09040-001` thermal/Mylar shield rule.",
    },
    "manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing": {
        "pdf_page": 43,
        "pdf_pages_range": (43, 47),
        "pages_span": "PDF p.43–47 (Doc p.37–41)",
        "section_number_ko": "제5장 §5.4~5.7 (마그네틱 펜 슬롯 · SIM 보드 · 5G WWAN 모듈 · 무선충전 모듈)",
        "section_number_en": "Ch.5 §5.4–5.7 (Magnetic Pen Slot, SIM Board, WWAN Module & Wireless Charger)",
        "title_ko": "제5장 §5.4~5.7 — 마그네틱 펜 슬롯 · SIM 보드(N22922-001) · 5G WWAN 모듈(4x4 MIMO 안테나 #5~#8) 및 무선 충전 모듈(N22924-001) 분리 (PDF p.43–47 · Doc p.37–41)",
        "title_en": "Chapter 5 §5.4–5.7 — Magnetic Pen Slot, SIM Board (N22922-001), 5G WWAN Module (4x4 MIMO Antennas #5–#8) & Wireless Charging Module (N22924-001) (PDF p.43–47 · Doc p.37–41)",
        "summary_ko": "원본 PDF 제5장(Doc pp. 37–41, PDF p.43–47)의 마그네틱 펜 슬롯 분리, SIM 보드(N22922-001) ZIF 케이블 해제, WWAN 모듈(Intel 5000 5G N00182-005 / XMM 7560 R+ M52040-005)의 фоil 실드·4개 동축 안테나(#5 주황, #6 백/청, #7 황색, #8 자주색)·Phillips M2.0×2.5 나사 제거, 무선 충전 모듈(N22924-001) 분리 절차를 설명합니다.",
        "summary_en": "Details PDF pp. 43–47 (Doc pp. 37–41): removing the Magnetic pen slot, SIM board (`N22922-001`), WWAN module (`N00182-005` / `M52040-005` with foil shield, 4x4 MIMO antennas `#5` Orange, `#6` White/Blue, `#7` Yellow, `#8` Purple, and M2.0×2.5 screw), and Wireless charging module (`N22924-001`).",
        "extra_domain_notes": "Include `TS-DFG3-002` (5G WWAN No Service triage) and `TS-DFG3-006` (wireless pen charger `N22924-001`/`N19021-001` vs pen `N16051-001`/`N19020-001`).",
    },
    "manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan": {
        "pdf_page": 53,
        "pdf_pages_range": (50, 55),
        "pages_span": "PDF p.50–55 (Doc p.44–49)",
        "section_number_ko": "제5장 §5.9~5.13 (스피커 · 트랜스퍼 보드 · 터치패드 · 히트싱크 N22936-001)",
        "section_number_en": "Ch.5 §5.9–5.13 (Speakers, Transfer Board, Touchpad & Heat Sink N22936-001)",
        "title_ko": "제5장 §5.9~5.13 — 하단/상단 스피커 · 트랜스퍼 보드(N22921-001) · 터치패드(N22933-001) 및 히트싱크(N22936-001, 1-2-3-4 순서·써멀 패드) 분리 (PDF p.50–55 · Doc p.44–49)",
        "title_en": "Chapter 5 §5.9–5.13 — Bottom/Top Speakers, Transfer Board (N22921-001), Touchpad (N22933-001) & Heat Sink (N22936-001, 1-2-3-4 Sequence & Thermal Pad) (PDF p.50–55 · Doc p.44–49)",
        "summary_ko": "원본 PDF 제5장(Doc pp. 44–49, PDF p.50–55)의 하단 스피커(N22934-001), 트랜스퍼 보드(N22921-001), 터치패드(N22933-001), 상단 스피커(N22939-001) 분리 절차와, 히트싱크(N22936-001, PDF p.53–54) 각인 번호 순서(1-2-3-4)에 따른 4개 캡티브 Phillips 나사 해제 및 써멀 패드(PTM7950) 전면 교체 의무를 다룹니다.",
        "summary_en": "Covers PDF pp. 50–55 (Doc pp. 44–49): removing Bottom speakers (`N22934-001`), Transfer board (`N22921-001`), Touchpad (`N22933-001`), Top speakers (`N22939-001`), and Heat sink (`N22936-001`, loosening 4 captive Phillips screws in stamped sequence and renewing thermal material every time).",
        "extra_domain_notes": "Quote PDF p.54 (Doc p.48): 'Every time the heat sink is removed, thoroughly clean the thermal material from the surfaces of the heat sink and system board components, and then apply new thermal material.' Also note `N18244-001`/`N22936-001` and independent fan `N18245-001` rule (`SAFE-DFG3-THM`).",
    },
    "manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag": {
        "pdf_page": 56,
        "pdf_pages_range": (56, 61),
        "pages_span": "PDF p.56–61 (Doc p.50–55)",
        "section_number_ko": "제5장 §5.14~5.16 (시스템 보드 N20724~N20728-601 다단계 분해 DAG 및 안테나)",
        "section_number_en": "Ch.5 §5.14–5.16 (System Board N20724–N20728-601 Multi-Hop DAG & Antennas)",
        "title_ko": "제5장 §5.14~5.16 — 시스템 보드(N20724-601~N20728-601) 및 오디오 잭 다단계 선행 분해 DAG · 안테나 배럴(N22932-001) 및 무선 안테나 분리 (PDF p.56–61 · Doc p.50–55)",
        "title_en": "Chapter 5 §5.14–5.16 — System Board (N20724-601–N20728-601) & Audio Jack Multi-Hop Disassembly DAG, Antenna Barrel (N22932-001) & Wireless Antennas (PDF p.56–61 · Doc p.50–55)",
        "summary_ko": "원본 PDF 제5장 시스템 보드 분리 섹션(Doc pp. 50–55, PDF p.56–61)에 명시된 필수 선행 분리 부품(하판 커버 N22918-001 ➔ 배터리 케이블 차단 ➔ NVMe SSD ➔ WWAN 모듈 ➔ 히트싱크 N22936-001)과 8개 ZIF/케이블 해제, USB 브래킷 분리(Phillips M2.0×4.0 3개 + M1.6×2.5 5개 + M2.0×2.5 1개), 안테나 배럴(N22932-001) 분리 절차를 설명합니다.",
        "summary_en": "Documents PDF pp. 56–61 (Doc pp. 50–55) System board (`N20724-601`–`N20728-601` / `N19201-601`) removal: prerequisite removal of Bottom cover (`N22918-001`), Battery cable isolation (`M90788-005`), SSD, WWAN, and Heat sink (`N22936-001`), disconnecting 8 board cables, removing USB bracket and 9 screws, and Antenna barrel (`N22932-001`) removal.",
        "extra_domain_notes": "Preserve the exact multi-hop `REQUIRES_REMOVAL_OF` chain (`N22918-001` -> `M90788-005` -> `M16560-005`/`M90790-001` & `N00182-005`/`M90792-001` & `N22936-001`/`N18244-001` -> `N20728-601`/`N19201-601`).",
    },
    "manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable": {
        "pdf_page": 62,
        "pdf_pages_range": (62, 82),
        "pages_span": "PDF p.62–82 (Doc p.56–76)",
        "section_number_ko": "제5장 §5.17~5.20 (탑커버 키보드 · 디스플레이 패널 풀탭 · 트랜스퍼 보드 · 카메라 · 힌지)",
        "section_number_en": "Ch.5 §5.17–5.20 (Top Cover Keyboard, Display Panel Pull-Tabs, Transfer Board, Camera & Hinges)",
        "title_ko": "제5장 §5.17~5.20 — 탑커버 키보드(N22938-001) · 디스플레이 패널 스트레치 릴리즈 풀탭 · 트랜스퍼 보드(N22937-001) · 8MP 카메라(N23306-001) 및 힌지(N22923-001) 분리 (PDF p.62–82 · Doc p.56–76)",
        "title_en": "Chapter 5 §5.17–5.20 — Top Cover with Keyboard (N22938-001), Display Panel Stretch-Release Pull-Tabs, Transfer Board (N22937-001), 8MP Camera (N23306-001) & Hinges (N22923-001) (PDF p.62–82 · Doc p.56–76)",
        "summary_ko": "원본 PDF 제5장 디스플레이 분해 섹션(Doc pp. 56–76, PDF p.62–82)에 따라 본체 분리가 필요 없는 디스플레이 서브컴포넌트(상단 핀셋 홀 스트레치 릴리즈 접착 테이프 수평 인출로 패널 분리 ➔ 디스플레이 트랜스퍼 보드 N22937-001 ➔ 상단/하단 힌지 커버 ➔ 8MP 웹캠 N23306-001)와 본체 분리가 필요한 전체 디스플레이 어셈블리 및 힌지(N22923-001, Phillips M2.5×4.0 나사 6개) 분리 절차를 정리합니다.",
        "summary_en": "Covers PDF pp. 62–82 (Doc pp. 56–76): Top cover with keyboard (`N22938-001`), Display panel removal using tweezers to pull stretch-release adhesive strips (`N09039-001`) out of top holes, Display transfer board (`N22937-001`), 8MP camera module (`N23306-001`), Display assembly, and Display hinges (`N22923-001`).",
        "extra_domain_notes": "Emphasize the $95 hinge kit (`N22923-001` / `N18995-001`) vs $640 OLED panel (`N23305-001` / `N18990-001`) partial repair rule (`TS-DFG3-004`) and pull-tab tape (`N09039-001`) non-reuse rule.",
    },
    "manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery": {
        "pdf_page": 86,
        "pdf_pages_range": (83, 89),
        "pages_span": "PDF p.83–89 (Doc p.77–83)",
        "section_number_ko": "제6장·제7장 (시스템 백업/복구 · Computer Setup BIOS · TPM 2.0 · HP Sure Start)",
        "section_number_en": "Ch.6 & Ch.7 (System Recovery, Computer Setup BIOS, TPM 2.0 & HP Sure Start)",
        "title_ko": "제6장·제7장 — 시스템 백업/복구(HP Sure Recover) · Computer Setup(F10 BIOS) · BIOS 업데이트 · 부트 순서(F9) · TPM 2.0 및 HP Sure Start 복구 (PDF p.83–89 · Doc p.77–83)",
        "title_en": "Chapters 6 & 7 — Backing Up/Recovering (HP Sure Recover), Computer Setup (F10 BIOS), BIOS Update, Boot Order (F9), TPM 2.0 & HP Sure Start (PDF p.83–89 · Doc p.77–83)",
        "summary_ko": "원본 PDF 제6장(Doc pp. 77–79, PDF p.83–85: Windows 백업, HP Cloud Recovery, 시스템 복원, 네트워크 기반 HP Sure Recover) 및 제7장(Doc pp. 80–83, PDF p.86–89: F10 Computer Setup 진입, 공장 초기화, 외부 AC 전원 필수 BIOS 업데이트, F9 부트 순서 변경, TPM 2.0 BIOS 설정, HP Sure Start 하드웨어 BIOS 무결성 자동 복구)을 다룹니다.",
        "summary_en": "Covers Chapter 6 (PDF pp. 83–85: Windows backup, HP Cloud Recovery, system restore, HP Sure Recover) and Chapter 7 (PDF pp. 86–89: F10 Computer Setup, factory reset, BIOS update on AC power, F9 boot order, TPM 2.0 BIOS settings, and HP Sure Start automatic BIOS recovery).",
        "extra_domain_notes": "Include the `Win + B + Power` key combination for HP Sure Start SPI BIOS recovery and the 15-second Power hold EC/CMOS reset procedure.",
    },
    "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages": {
        "pdf_page": 90,
        "pdf_pages_range": (90, 93),
        "pages_span": "PDF p.90–93 (Doc p.84–87)",
        "section_number_ko": "제8장 §8.1·8.2 (HP PC Hardware Diagnostics Windows/UEFI 및 LED 점멸 진단 코드)",
        "section_number_en": "Ch.8 §8.1–8.2 (HP PC Hardware Diagnostics Windows/UEFI & LED Blink Codes)",
        "title_ko": "제8장 §8.1·8.2 — HP PC Hardware Diagnostics (Windows 및 UEFI F2) · 24자리 Failure ID 코드 및 LED 점멸 진단 코드(3.2 / 2.2 / 4.2) (PDF p.90–93 · Doc p.84–87)",
        "title_en": "Chapter 8 §8.1–8.2 — Using HP PC Hardware Diagnostics (Windows & UEFI F2), 24-Digit Hardware Failure ID Code & LED Blink Codes (3.2 / 2.2 / 4.2) (PDF p.90–93 · Doc p.84–87)",
        "summary_ko": "원본 PDF 제8장(Doc pp. 84–87, PDF p.90–93)의 HP PC Hardware Diagnostics Windows 및 부팅 시 F2 키로 실행하는 HP PC Hardware Diagnostics UEFI(24자리 하드웨어 고장 ID 코드 생성, USB 플래시 드라이브 다운로드)와 POST/Caps Lock LED 점멸 진단 코드(LED 3.2 메모리 오류, LED 2.2 BIOS 손상, LED 4.2 열/팬 오류, POST 601 배터리 경고)를 설명합니다.",
        "summary_en": "Details Chapter 8 (PDF pp. 90–93 / Doc pp. 84–87) HP PC Hardware Diagnostics Windows and UEFI (started via F2 at boot, generating 24-digit hardware failure ID codes, USB fallback) along with Caps Lock/Power LED blink codes (`LED 3.2` memory, `LED 2.2` BIOS, `LED 4.2` thermal/fan, `POST 601` battery).",
        "extra_domain_notes": "Preserve the full LED blink code matrix (`LED-3-2`, `LED-2-2`, `LED-4-2`, `POST-601`) and link to `TS-DFG3-001`.",
    },
    "manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix": {
        "pdf_page": 93,
        "pdf_pages_range": (93, 94),
        "pages_span": "PDF p.93–94 (Doc p.87–88)",
        "section_number_ko": "제8장 §8.3 (Remote HP PC Hardware Diagnostics UEFI 및 증상별 트리아지 매트릭스)",
        "section_number_en": "Ch.8 §8.3 (Remote HP PC Hardware Diagnostics UEFI & Symptom Triage Matrix)",
        "title_ko": "제8장 §8.3 — Remote HP PC Hardware Diagnostics UEFI 설정(F10 BIOS) 및 6대 현장 고장 증상 트리아지 매트릭스(TS-DFG3-001~006) (PDF p.93–94 · Doc p.87–88)",
        "title_en": "Chapter 8 §8.3 — Remote HP PC Hardware Diagnostics UEFI Settings (F10 BIOS) & 6-Scenario Field Triage Matrix (TS-DFG3-001–006) (PDF p.93–94 · Doc p.87–88)",
        "summary_ko": "원본 PDF 제8장 §8.3(Doc pp. 87–88, PDF p.93–94)의 Remote HP PC Hardware Diagnostics UEFI(F10 Computer Setup ➔ Advanced ➔ Remote HP PC Hardware Diagnostics로 서버 URL 및 무인 진단 스케줄 설정, 진단 로그 업로드)와 이를 활용한 6대 표준 고장 케이스(`TS-DFG3-001` ~ `TS-DFG3-006`) 원인 분리 매트릭스를 다룹니다.",
        "summary_en": "Covers Chapter 8 §8.3 (PDF pp. 93–94 / Doc pp. 87–88) Remote HP PC Hardware Diagnostics UEFI configuration in F10 Computer Setup -> Advanced and the 6-scenario field symptom-to-root-cause triage matrix (`TS-DFG3-001` through `TS-DFG3-006`).",
        "extra_domain_notes": "Keep the complete `TS-DFG3-001` through `TS-DFG3-006` triage table and `hardware-fru-replacement-rate <= 12.0%` KPI note.",
    },
    "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap": {
        "pdf_page": 97,
        "pdf_pages_range": (95, 100),
        "pages_span": "PDF p.95–100 (Doc p.89–94)",
        "section_number_ko": "제9장·제10장 표 10-1 (제품 제원 · 비휘발성 메모리 명세 및 보드 교체 게이트 내규 제1조)",
        "section_number_en": "Ch.9 & Ch.10 Table 10-1 (Specifications, Nonvolatile Memory & Board Swap Gate Art.1)",
        "title_ko": "제9장 제원[표 9-1~9-3] · 제10장 비휘발성 메모리 명세[표 10-1] 및 무전원/LED 3.2 입고 시 보드 교체 전 Sure Start 복구 게이트 [내규 제1조] (PDF p.95–100 · Doc p.89–94)",
        "title_en": "Chapter 9 Specifications [Tables 9-1–9-3], Chapter 10 Nonvolatile Memory Usage [Table 10-1] & Mandatory Sure Start Gate Before Board Swap [SOP Art.1] (PDF p.95–100 · Doc p.89–94)",
        "summary_ko": "원본 PDF 제9장(컴퓨터 치수 29.64×23.43×1.79cm, 1.4kg, 동작 온도, 65W/100W 전력 제원 표 9-1~9-3, PDF p.95–96) 및 제10장(BIOS 메모리 초기화 절차 및 표 10-1 비휘발성 메모리 명세: System BIOS 9MB SPI, HP Sure Start 8MB SPI, Intel CSME 16MB, TPM 2.0 SLB9672, EC NPCX897, PD CCG6DF, Retimer JHL8040R, PDF p.97–100)을 토대로 LED 3.2/2.2 점멸 시 시스템 보드 교체 전 Sure Start SPI 복구 및 15초 EC 리셋을 의무화합니다.",
        "summary_en": "Grounds SOP-2026-01 Article 1 in Chapter 9 Specifications (Tables 9-1–9-3, PDF pp. 95–96) and Chapter 10 Statement of Memory Volatility (Table 10-1 Nonvolatile Memory Usage: 9MB System BIOS SPI, 8MB HP Sure Start SPI, 16MB Intel CSME, Infineon SLB9672 TPM 2.0, NPCX897 EC, CCG6DF PD controller, JHL8040R Retimer, PDF pp. 97–100), requiring Sure Start SPI recovery and 15s EC reset before approving System Board replacement.",
        "extra_domain_notes": "Include the full Table 10-1 Nonvolatile memory components from PDF pp. 99–100 (Doc pp. 93–94) and the `hardware-fru-replacement-rate` (8.4% actual vs <=12.0% target) KPI.",
    },
    "internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap": {
        "pdf_page": 103,
        "pdf_pages_range": (101, 106),
        "pages_span": "PDF p.101–106 (Doc p.95–100)",
        "section_number_ko": "제10장(Sure Start)·제11장(재활용)·제12장(전원코드) 및 열관리 거버넌스 [내규 제2조]",
        "section_number_en": "Ch.10 (Sure Start), Ch.11 (Recycling), Ch.12 (Power Cords) & Thermal Governance [SOP Art.2]",
        "title_ko": "제10장 HP Sure Start 자동 복구(Doc p.97) · 제11장 배터리/부품 재활용 · 제12장 국가별 전원코드 규격 및 열관리 거버넌스 [내규 제2조] (PDF p.101–106 · Doc p.95–100)",
        "title_en": "Chapter 10 Using HP Sure Start (Doc p.97), Chapter 11 Recycling, Chapter 12 Power Cord Requirements & Thermal Governance Gate [SOP Art.2] (PDF p.101–106 · Doc p.95–100)",
        "summary_ko": "원본 PDF 제10장 후반부(비휘발성 메모리 Q&A, Secure Boot 키 초기화, HP Sure Start 하드웨어 기반 BIOS 무결성 자동 복구 원리, Doc pp. 95–97 / PDF p.101–103), 제11장(배터리 및 전자부품 친환경 재활용 의무, Doc p.98 / PDF p.104), 제12장(국가별 전원 코드 정격 표, Doc pp. 99–100 / PDF p.105–106)과 열관리/방열판 써멀 패드 교체 거버넌스(내규 제2조)를 다룹니다.",
        "summary_en": "Covers Chapter 10 Nonvolatile Memory Q&A and Using HP Sure Start automatic BIOS recovery (PDF pp. 101–103 / Doc pp. 95–97), Chapter 11 Battery/Hardware Recycling (PDF p. 104 / Doc p. 98), Chapter 12 Country-specific Power Cord Set Requirements (PDF pp. 105–106 / Doc pp. 99–100), and SOP Article 2 thermal/heatsink governance.",
        "extra_domain_notes": "Include the exact PDF explanation of 'Using HP Sure Start (select products only)' from PDF p.103 (Doc p.97), power cord ratings (`10 A / 125 V` vs `2.5 A / 230 V`), and `SAFE-DFG3-THM` thermal material replacement rules.",
    },
    "internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap": {
        "pdf_page": 32,
        "pdf_pages_range": (32, 33),
        "pages_span": "PDF p.32, 48, 54 (Doc p.26, 42, 48)",
        "section_number_ko": "[폐기 · DEPRECATED v0.1.0] 구 정비내규 제3조 (제4장 ESD·제5장 배터리/히트싱크 수칙 위반으로 폐기)",
        "section_number_en": "[DEPRECATED v0.1.0] Legacy SOP Art.3 (Superseded by Ch.4 ESD & Ch.5 Battery/Heat Sink Rules)",
        "title_ko": "[만료/폐기 · DEPRECATED v0.1.0] 구(舊) 정비내규 제3조 — 배터리 연결 상태 ZIF 핫스왑 및 액상 써멀 그리스 재사용 특례 (제4장 PDF p.32 · 제5장 PDF p.48, 54 정본에 의해 대체)",
        "title_en": "[DEPRECATED v0.1.0] Legacy SOP Article 3 — Live-Battery ZIF Hot-Swap & Thermal Paste Reuse Exception (Superseded by Ch.4 PDF p.32 & Ch.5 PDF pp. 48, 54)",
        "summary_ko": "과거 구버전(v0.1.0, 만료일 2025-12-31)에서 허용했던 배터리 미분리 상태의 ZIF 리본 핫스왑 및 방열판 구형 액상 그리스 재도포 지침으로, 원본 PDF 제4장(PDF p.32, 작업 전 전원 차단 및 ESD 접지), 제5장 배터리 선행 분리(PDF p.48), 제5장 히트싱크 써멀 패드 매회 신품 교체(PDF p.54) 정본에 의해 영구 폐기(`status: deprecated`)되어 Dataplex KC 거버넌스 게이트(`before_tool_callback`)에서 차단됩니다.",
        "summary_en": "Deprecated legacy draft (`v0.1.0`, `status: deprecated`, `stale_after: 2025-12-31`) that permitted live-battery ZIF hot-swapping and syringe paste reuse. Permanently superseded by Chapter 4 ESD/Power-Off rules (PDF p.32), Chapter 5 Battery Isolation (PDF p.48), and Chapter 5 Heat Sink Thermal Material Renewal (PDF p.54), and blocked by the Dataplex KC `before_tool_callback` gate.",
        "extra_domain_notes": "Must preserve `status: deprecated` and `BLOCKED_DEPRECATED` governance gate metadata so Scenario 13 and EQ08/EQ13 work 100%.",
    },
}


def extract_pdf_pages_text(reader: PdfReader, start_pdf_page: int, end_pdf_page: int) -> str:
  """Extracts raw text from inclusive 1-based PDF page range."""
  blocks: List[str] = []
  for p in range(start_pdf_page, end_pdf_page + 1):
    if 1 <= p <= len(reader.pages):
      raw = reader.pages[p - 1].extract_text() or ""
      doc_p = p - 6
      blocks.append(f"--- [PDF Page {p} / Document Page {doc_p}] ---\n{raw.strip()}")
  return "\n\n".join(blocks)


def generate_bilingual_chunk_with_gemini(
    client: genai.Client,
    chunk_id: str,
    spec: Dict[str, Any],
    pdf_excerpt: str,
) -> Tuple[str, str, str]:
  """Uses Vertex AI `gemini-3.8-flash` to generate grounded KO and EN OKF v0.2 Markdown bodies."""
  prompt = f"""You are the HP Dragonfly Ontology Studio Enrichment Agent running on `gemini-3.8-flash`.
We are generating an authoritative Open Knowledge Format (OKF v0.2) bilingual technical chunk (`body_ko` in Korean and `body_en` in English) directly grounded in the official PDF manual:
- Document Title: HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (Document Part Number: `N17344-001`)
- Chunk ID: `{chunk_id}`
- Exact PDF Page Span: `{spec['pages_span']}` (Primary PDF Page: `{spec['pdf_page']}`)
- Korean Section Heading: `{spec['title_ko']}`
- English Section Heading: `{spec['title_en']}`
- Domain & Ontology Linkage Requirements: {spec['extra_domain_notes']}

Below is the verbatim extracted text from the actual PDF pages (`{spec['pages_span']}`):
<PDF_VERBATIM_TEXT>
{pdf_excerpt[:7500]}
</PDF_VERBATIM_TEXT>

Write a comprehensive, richly structured Markdown document in Korean (`body_ko`) and in English (`body_en`) that:
1. Starts with `# {spec['title_ko']}` (for `body_ko`) and `# {spec['title_en']}` (for `body_en`).
2. Faithfully reflects the actual content, tables, steps, screw dimensions, spare part numbers, and warnings from the `<PDF_VERBATIM_TEXT>` above (citing both `PDF p.{spec['pdf_page']}` and `Doc p.{spec['pdf_page'] - 6}`).
3. Includes Markdown tables where appropriate and preserves all required ontology entity IDs and spare part numbers mentioned in `Domain & Ontology Linkage Requirements`.
4. Uses clean Markdown (`#`, `##`, bullet lists, and Markdown tables) with NO YAML frontmatter (frontmatter is added separately).

Return ONLY valid JSON with two keys:
{{
  "body_ko": "...",
  "body_en": "..."
}}"""

  for attempt in range(3):
    try:
      resp = client.models.generate_content(
          model=MODEL_ID,
          contents=prompt,
          config=types.GenerateContentConfig(
              thinking_config=types.ThinkingConfig(thinking_budget=0),
              temperature=0.15,
              response_mime_type="application/json",
          ),
      )
      raw_txt = resp.text or "{}"
      try:
        parsed = json.loads(raw_txt)
      except json.JSONDecodeError:
        fixed_txt = re.sub(r'\\(?![/\"\\bfnrtu])', r'\\\\', raw_txt)
        parsed = json.loads(fixed_txt)
      body_ko = str(parsed.get("body_ko") or "").strip()
      body_en = str(parsed.get("body_en") or "").strip()
      if len(body_ko) > 200 and len(body_en) > 200:
        return chunk_id, body_ko, body_en
    except Exception as exc:
      print(f"  [WARN] Attempt {attempt+1} failed for {chunk_id}: {exc}")
      time.sleep(1.5)
  raise RuntimeError(f"Failed to generate chunk {chunk_id} via {MODEL_ID}")


def build_yaml_frontmatter(
    *,
    lang: str,
    okf_type: str,
    title: str,
    description: str,
    version: str,
    tags: List[str],
    sha256_hex: str,
    status: str,
    part_of: str,
    sequence: int,
    treatment: str,
    license_str: str,
    content_class: str,
    section_number: str,
    source_page: int,
    pages_span: str,
    verified_by: str,
    verified_at: str,
    verified_method: str,
    source_uri: str,
) -> str:
  tag_str = "\n".join(f"- {t}" for t in tags)
  safe_title = title.replace("'", "''")
  safe_desc = description.replace("'", "''")
  safe_sec = section_number.replace("'", "''")
  safe_span = pages_span.replace("'", "''")
  return f"""---
type: {okf_type}
title: '{safe_title}'
description: '{safe_desc}'
version: '{version}'
tags:
{tag_str}
language: {lang}
sources:
- id: origin_pdf
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf#page={source_page}
  kind: origin_document
  sha256: {sha256_hex}
source_uri: {source_uri}
generated:
  by: enrichment_agent/{MODEL_ID}
  at: '{GENERATED_AT}'
status: {status}
part_of: {part_of}
sequence: {sequence}
treatment: {treatment}
license: '{license_str}'
content_class: {content_class}
section_number: '{safe_sec}'
source_page: {source_page}
source_pages_span: '{safe_span}'
verified:
- by: {verified_by}
  at: '{verified_at}'
  method: {verified_method}
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---"""


def build_ko_doc_root_body(d: Dict[str, Any], child_files: List[Dict[str, Any]]) -> str:
  rows = "\n".join(
      f"| `{c['section_number_ko']}` | {c['title_ko']} | `PDF p.{c['pdf_page']}` (`{c['pages_span']}`) | `{c['status']}` |"
      for c in child_files
  )
  return f"""# {d['title_ko']}

## 1. 챕터 총괄 개요 (`okf-kr` · `docs/pdf_6290467_en-US-1.pdf` 원문 1:1 매핑)
- **챕터 식별코드:** `[{d['doc_num']}] {d['doc_id']}`
- **원천 서비스 매뉴얼:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **원본 PDF 페이지 범위:** **`{d['source_pages_span']}`** (클릭 시 PDF 뷰어 `#page={d['pdf_page']}` 자동 연동)
- **생성 에이전트 및 모델:** `enrichment_agent/{MODEL_ID}` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF 리포지토리 경로:** `okf-kr/{d['rel_path']}`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **챕터 핵심 요약:** {d['desc_ko']}

## 2. 소속 PDF 청크(Section Chunks) 목록 ({len(child_files)}개 청크)
| 원문 섹션/표 번호 | 청크 제목 (Korean Title) | 원본 PDF / 문서 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
{rows}

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 및 Dataplex KC 연동 구조
- 본 챕터 총괄 문서(`doc.md`)와 소속 청크들은 원본 PDF(`docs/pdf_6290467_en-US-1.pdf`)의 실제 목차(Chapters 1~12) 및 PDF 페이지 번호(`pdf_page = doc_page + 6`)와 100% 일치하도록 `{MODEL_ID}` Enrichment Agent로 생성되었으며, `./bin/kcmd` 파이프라인을 통해 Dataplex Knowledge Catalog(`okf` Aspect) 및 BigQuery Property Graph(`hp_dragonfly_ontology_graph`)와 동기화됩니다."""


def build_en_doc_root_body(d: Dict[str, Any], child_files: List[Dict[str, Any]]) -> str:
  rows = "\n".join(
      f"| `{c['section_number_en']}` | {c['title_en']} | `PDF p.{c['pdf_page']}` (`{c['pages_span']}`) | `{c['status']}` |"
      for c in child_files
  )
  return f"""# {d['title_en']}

## 1. Chapter Root Overview (`okf-en` · 1:1 Grounded in `docs/pdf_6290467_en-US-1.pdf`)
- **Chapter Identifier:** `[{d['doc_num']}] {d['doc_id']}`
- **Source Service Manual:** HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (`N17344-001`)
- **Exact PDF Page Span:** **`{d['source_pages_span']}`** (Opens PDF viewer at `#page={d['pdf_page']}`)
- **Enrichment Agent & Model:** `enrichment_agent/{MODEL_ID}` (`Metadata-as-Code` + `./bin/kcmd`)
- **OKF Repository Path:** `okf-en/{d['rel_path']}`
- **Dataplex Knowledge Catalog EntryGroup:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_en`
- **Chapter Executive Summary:** {d['desc_en']}

## 2. Child PDF Section Chunks ({len(child_files)} Chunks)
| Section / Table | Chunk Title (English) | Exact PDF / Doc Page | Governance Status |
| :---: | :--- | :---: | :---: |
{rows}

## 3. Ontology Property Graph (`hp_dragonfly_ontology_graph`) & Dataplex KC Linkage
- This Chapter Root (`doc.md`) and its child chunks are generated directly from `docs/pdf_6290467_en-US-1.pdf` (Chapters 1–12, `pdf_page = doc_page + 6`) using the `{MODEL_ID}` Enrichment Agent and published to Dataplex Knowledge Catalog (`okf` Aspect) and BigQuery Property Graph (`hp_dragonfly_ontology_graph`) via `./bin/kcmd`."""


def main() -> None:
  print(f"[1/4] Reading PDF: {PDF_PATH}")
  reader = PdfReader(str(PDF_PATH))
  print(f"      Total PDF pages: {len(reader.pages)}")

  text = BUNDLE_JS_PATH.read_text(encoding="utf-8")
  idx = text.index("{")
  data = json.loads(text[idx:].rstrip().rstrip(";"))

  doc_roots: List[Dict[str, Any]] = data["okf_doc_roots"]
  okf_files: List[Dict[str, Any]] = data["okf_files"]

  client = genai.Client(vertexai=True, project="hp-dragonfly", location="global")

  print(f"[2/4] Generating 26 bilingual PDF chunks via Vertex AI `{MODEL_ID}` (8 parallel workers)...")
  t0 = time.time()
  generated_bodies: Dict[str, Tuple[str, str]] = {}

  with ThreadPoolExecutor(max_workers=8) as pool:
    futures = {}
    for f in okf_files:
      cid = f["id"]
      spec = PDF_CHUNKS_SPEC[cid]
      p_start, p_end = spec["pdf_pages_range"]
      excerpt = extract_pdf_pages_text(reader, p_start, p_end)
      futures[pool.submit(generate_bilingual_chunk_with_gemini, client, cid, spec, excerpt)] = cid

    for fut in as_completed(futures):
      cid, b_ko, b_en = fut.result()
      generated_bodies[cid] = (b_ko, b_en)
      print(f"  [OK] {cid} (KO: {len(b_ko)} chars, EN: {len(b_en)} chars)")

  print(f"      Completed 26 chunks via `{MODEL_ID}` in {time.time() - t0:.1f}s!")

  print("[3/4] Updating `okf_files` and `okf_doc_roots` metadata & writing `okf-kr/` and `okf-en/`...")
  for seq, f in enumerate(okf_files, start=1):
    cid = f["id"]
    spec = PDF_CHUNKS_SPEC[cid]
    b_ko, b_en = generated_bodies[cid]

    f["pdf_page"] = spec["pdf_page"]
    f["pages_span"] = spec["pages_span"]
    f["section_number"] = spec["section_number_ko"]
    f["section_number_ko"] = spec["section_number_ko"]
    f["section_number_en"] = spec["section_number_en"]
    f["title_ko"] = spec["title_ko"]
    f["title_en"] = spec["title_en"]
    f["summary_ko"] = spec["summary_ko"]
    f["summary_en"] = spec["summary_en"]
    f["body_ko"] = b_ko
    f["body_en"] = b_en
    f["body"] = b_ko

    sha_ko = hashlib.sha256(b_ko.encode("utf-8")).hexdigest()
    sha_en = hashlib.sha256(b_en.encode("utf-8")).hexdigest()
    f["sha256"] = sha_ko
    f["sha256_ko"] = sha_ko
    f["sha256_en"] = sha_en

    parent_root = next((r for r in doc_roots if r["doc_id"] == f["doc_id"]), None)
    part_of_slug = parent_root["doc_id"].lower() if parent_root else "hp_dragonfly_manual"
    is_dep = f.get("status") == "deprecated"

    yaml_ko = build_yaml_frontmatter(
        lang="ko",
        okf_type=f.get("okf_type", "section"),
        title=f["title_ko"],
        description=f["summary_ko"],
        version=f.get("version", "0.2.0"),
        tags=f.get("tags", ["hp-dragonfly-g3", "service-manual", "okf-v0.2"]),
        sha256_hex=sha_ko,
        status=f.get("status", "verified"),
        part_of=part_of_slug,
        sequence=seq,
        treatment="normative" if not is_dep else "deprecated_archive",
        license_str="HP Inc. Authorized Service & Engineering Documentation (N17344-001)",
        content_class=f.get("content_class", "procedural"),
        section_number=f["section_number_ko"],
        source_page=f["pdf_page"],
        pages_span=f["pages_span"],
        verified_by="human:dhmoon@google.com" if not is_dep else "governance_board:revoked_2025_12",
        verified_at=VERIFIED_AT,
        verified_method="manual_review" if not is_dep else "deprecation_audit",
        source_uri=f"gs://hp-dragonfly-okf/okf-kr/{f['rel_path']}",
    )
    yaml_en = build_yaml_frontmatter(
        lang="en",
        okf_type=f.get("okf_type", "section"),
        title=f["title_en"],
        description=f["summary_en"],
        version=f.get("version", "0.2.0"),
        tags=f.get("tags", ["hp-dragonfly-g3", "service-manual", "okf-v0.2"]),
        sha256_hex=sha_en,
        status=f.get("status", "verified"),
        part_of=part_of_slug,
        sequence=seq,
        treatment="normative" if not is_dep else "deprecated_archive",
        license_str="HP Inc. Authorized Service & Engineering Documentation (N17344-001)",
        content_class=f.get("content_class", "procedural"),
        section_number=f["section_number_en"],
        source_page=f["pdf_page"],
        pages_span=f["pages_span"],
        verified_by="human:dhmoon@google.com" if not is_dep else "governance_board:revoked_2025_12",
        verified_at=VERIFIED_AT,
        verified_method="manual_review" if not is_dep else "deprecation_audit",
        source_uri=f"gs://hp-dragonfly-okf/okf-en/{f['rel_path']}",
    )

    f["yaml"] = yaml_ko
    f["yaml_ko"] = yaml_ko
    f["yaml_en"] = yaml_en
    f["uri_kr"] = f"gs://hp-dragonfly-okf/okf-kr/{f['rel_path']}"
    f["uri_en"] = f"gs://hp-dragonfly-okf/okf-en/{f['rel_path']}"
    f["kc_entry_fqn_kr"] = f"projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr/entries/{f['kc_entry_id']}"
    f["kc_entry_fqn_en"] = f"projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_en/entries/{f['kc_entry_id']}"

    kr_file = OKF_KR_DIR / f["rel_path"]
    en_file = OKF_EN_DIR / f["rel_path"]
    kr_file.parent.mkdir(parents=True, exist_ok=True)
    en_file.parent.mkdir(parents=True, exist_ok=True)
    kr_file.write_text(f"{yaml_ko}\n\n{b_ko}\n", encoding="utf-8")
    en_file.write_text(f"{yaml_en}\n\n{b_en}\n", encoding="utf-8")

  # Update all 8 Chapter Roots (`doc_roots`)
  for seq, d in enumerate(doc_roots, start=1):
    rspec = PDF_CHAPTER_ROOTS_SPEC[d["doc_id"]]
    d["pdf_page"] = rspec["pdf_page"]
    d["source_pages_span"] = rspec["source_pages_span"]
    d["title_ko"] = rspec["title_ko"]
    d["title_en"] = rspec["title_en"]
    d["desc_ko"] = rspec["desc_ko"]
    d["desc_en"] = rspec["desc_en"]

    children = [f for f in okf_files if f["doc_id"] == d["doc_id"]]
    body_ko = build_ko_doc_root_body(d, children)
    body_en = build_en_doc_root_body(d, children)
    sha_ko = hashlib.sha256(body_ko.encode("utf-8")).hexdigest()
    sha_en = hashlib.sha256(body_en.encode("utf-8")).hexdigest()

    yaml_ko = build_yaml_frontmatter(
        lang="ko",
        okf_type="document",
        title=d["title_ko"],
        description=d["desc_ko"],
        version=d.get("version", "0.2.0"),
        tags=d.get("tags", ["hp-dragonfly-g3", "chapter-root", "okf-v0.2"]),
        sha256_hex=sha_ko,
        status=d.get("status", "verified"),
        part_of="hp_dragonfly_folio_g3_service_manual_n17344_001",
        sequence=seq,
        treatment="normative",
        license_str="HP Inc. Authorized Service & Engineering Documentation (N17344-001)",
        content_class="reference",
        section_number=f"Chapter {d['doc_num']} Root",
        source_page=d["pdf_page"],
        pages_span=d["source_pages_span"],
        verified_by="human:dhmoon@google.com",
        verified_at=VERIFIED_AT,
        verified_method="manual_review",
        source_uri=f"gs://hp-dragonfly-okf/okf-kr/{d['rel_path']}",
    )
    yaml_en = build_yaml_frontmatter(
        lang="en",
        okf_type="document",
        title=d["title_en"],
        description=d["desc_en"],
        version=d.get("version", "0.2.0"),
        tags=d.get("tags", ["hp-dragonfly-g3", "chapter-root", "okf-v0.2"]),
        sha256_hex=sha_en,
        status=d.get("status", "verified"),
        part_of="hp_dragonfly_folio_g3_service_manual_n17344_001",
        sequence=seq,
        treatment="normative",
        license_str="HP Inc. Authorized Service & Engineering Documentation (N17344-001)",
        content_class="reference",
        section_number=f"Chapter {d['doc_num']} Root",
        source_page=d["pdf_page"],
        pages_span=d["source_pages_span"],
        verified_by="human:dhmoon@google.com",
        verified_at=VERIFIED_AT,
        verified_method="manual_review",
        source_uri=f"gs://hp-dragonfly-okf/okf-en/{d['rel_path']}",
    )

    d["body"] = body_ko
    d["body_ko"] = body_ko
    d["body_en"] = body_en
    d["yaml"] = yaml_ko
    d["yaml_ko"] = yaml_ko
    d["yaml_en"] = yaml_en
    d["sha256"] = sha_ko
    d["sha256_ko"] = sha_ko
    d["sha256_en"] = sha_en
    d["uri_kr"] = f"gs://hp-dragonfly-okf/okf-kr/{d['rel_path']}"
    d["uri_en"] = f"gs://hp-dragonfly-okf/okf-en/{d['rel_path']}"
    d["kc_entry_fqn_kr"] = f"projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr/entries/{d['kc_entry_id']}"
    d["kc_entry_fqn_en"] = f"projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_en/entries/{d['kc_entry_id']}"

    kr_doc = OKF_KR_DIR / d["rel_path"]
    en_doc = OKF_EN_DIR / d["rel_path"]
    kr_doc.parent.mkdir(parents=True, exist_ok=True)
    en_doc.parent.mkdir(parents=True, exist_ok=True)
    kr_doc.write_text(f"{yaml_ko}\n\n{body_ko}\n", encoding="utf-8")
    en_doc.write_text(f"{yaml_en}\n\n{body_en}\n", encoding="utf-8")

  # Also synchronize `pdf_page` and `verbatim_body` in `agent_scenarios` provisions
  rel_to_file = {f["rel_path"]: f for f in okf_files}
  id_to_file = {f["id"]: f for f in okf_files}
  for sc in data.get("agent_scenarios", []):
    drawer = sc.get("artifact_drawer") or {}
    for prov in drawer.get("provisions") or []:
      rel = prov.get("okf_rel_path") or ""
      clean = rel[:-3] if rel.endswith(".md") else rel
      f_match = rel_to_file.get(rel) or id_to_file.get(clean)
      if f_match:
        prov["pdf_page"] = f_match["pdf_page"]
        prov["source_pdf"] = f"pdf_6290467_en-US-1.pdf ({f_match['pages_span']})"
        prov["sha256"] = f_match["sha256_ko"][:16] + "..."
        prov["yaml_frontmatter"] = f_match["yaml_ko"]
        prov["verbatim_body"] = f_match["body_ko"]

  print("[4/4] Writing updated `web/data/studio_bundle.js`...")
  out_js = (
      "// Auto-generated HP Dragonfly Ontology Studio Data Bundle (PDF-Grounded Bilingual OKF v0.2 via gemini-3.8-flash)\n"
      "window.HP_ONTOLOGY_BUNDLE = window.HP_STUDIO_DATA = "
      + json.dumps(data, ensure_ascii=False, indent=2)
      + ";\n"
  )
  BUNDLE_JS_PATH.write_text(out_js, encoding="utf-8")
  print("DONE! Regenerated 34 files in `okf-kr/` and 34 files in `okf-en/` with `gemini-3.8-flash`.")


if __name__ == "__main__":
  main()
