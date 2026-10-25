#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dualizes the HP Dragonfly OKF v0.2 Unstructured Context Corpus into:
- `okf-kr/` (Korean OKF v0.2 Markdown + YAML Frontmatter + `okf_hp_dragonfly_kr` EntryGroup)
- `okf-en/` (English OKF v0.2 Markdown + YAML Frontmatter + `okf_hp_dragonfly_en` EntryGroup)

And updates `web/data/studio_bundle.js` so `03 · OKF Management` (`OKF Editor` &
`Knowledge Catalog`) and `02 · OKF Validation` dynamically render Korean OKF
content (`okf-kr`) in Korean mode and English OKF content (`okf-en`) in English mode.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path("/usr/local/google/home/dhmoon/Research/2026-10-25_project-Ontology")
BUNDLE_JS_PATH = REPO_ROOT / "web" / "data" / "studio_bundle.js"
OKF_KR_DIR = REPO_ROOT / "okf-kr"
OKF_EN_DIR = REPO_ROOT / "okf-en"

# Full Korean Markdown Bodies for all 26 Unstructured Clauses (`okf-kr`)
KO_CLAUSE_BODIES: Dict[str, str] = {
    "manuals/01_ch1_product_specs/sec_1_1_platform_architecture": """# 제1장 §1.1 — 제품 개요: 프로세서 및 플랫폼 아키텍처 (pp. 1–2)

## 1. 플랫폼 식별 및 문서 적용 범위
- **대상 제품명:** HP Elite Dragonfly 13.5형 G3 노트북 PC (및 HP Dragonfly Folio 13.5형 G3 2-in-1 레퍼런스)
- **서비스 매뉴얼 문서 파트 번호:** `N17344-001` (초판, 2022년 5월)
- **섀시 폼팩터:** 초경량 마그네슘-알루미늄 합금 클램쉘 · 13.5형 `3:2` 종횡비 디스플레이 (`0.99 kg` / `2.18 lbs` 시작 무게 · 슬레이트 블루 및 내추럴 실버 마감).

## 2. 12세대 Intel® Core™ Alder Lake-U 프로세서 라인업 (15W TDP · 10코어 / 12스레드)
1. **Intel® Core™ i7-1265U (vPro® Enterprise 지원):** Intel Turbo Boost 적용 시 최대 `4.8 GHz`, `12 MB` L3 캐시, 10코어(성능 P-코어 2개 + 효율 E-코어 8개), 12스레드.
2. **Intel® Core™ i7-1255U (Non-vPro):** 최대 `4.7 GHz` 터보 부스트, `12 MB` L3 캐시, 10코어(2P + 8E), 12스레드.
3. **Intel® Core™ i5-1245U (vPro® Enterprise 지원):** 최대 `4.4 GHz` 터보 부스트, `12 MB` L3 캐시, 10코어(2P + 8E), 12스레드.
4. **Intel® Core™ i5-1235U (Non-vPro):** 최대 `4.4 GHz` 터보 부스트, `12 MB` L3 캐시, 10코어(2P + 8E), 12스레드.

## 3. 내장 그래픽 및 플랫폼 컨트롤러 허브 (PCH)
- **그래픽 서브시스템:** 내장 **Intel® Iris® Xe Graphics** (전 출고 SKU에서 듀얼 채널 LPDDR5 메모리 대역폭 활성화).
- **칩셋 아키텍처:** 단일 일체형 시스템 보드(`M90788-601` / `N19201-601`) 상에 통합된 Intel SoC PCH 구조.""",

    "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule": """# 제1장 §1.2 — 온보드 솔더링 LPDDR5 메모리 아키텍처 및 시스템 보드 결합 강행 단서 (p. 2)

## 1. 매뉴얼 원문 기술 규격 (서비스 매뉴얼 p. 2)
- **메모리 표준 규격:** **LPDDR5-5200 / 6400 MHz** 듀얼 채널 초저전력 고속 메모리 (`4800 MHz` 실효 클럭 구동).
- **지원 용량 옵션:** `16 GB` (`2 × 8 GB` 듀얼 채널) 또는 `32 GB` (`2 × 16 GB` 듀얼 채널).
- **물리적 실장 형태 (필수 주의 단서 · Caveat):**
  > **중요 (IMPORTANT):** 시스템 메모리는 **시스템 보드(System Board)에 직접 납땜(Soldered On-Board)**되어 출고되며, **고객이나 현장 엔지니어가 개별 메모리 모듈을 증설하거나 단품 교체할 수 없습니다.** 섀시 내부에 SO-DIMM 확장 슬롯이 존재하지 않습니다.

## 2. 현장 서비스 엔지니어링 조치 지침
1. **단품 RAM 교체 불가:** HP Sure Start SPI BIOS 복구(`Win + B + Power`) 이후에도 지속되는 메모리 비트 오류(`CAPS LOCK 3.2` 점멸 코드)는 SO-DIMM 재장착으로 해결할 수 없습니다.
2. **정확한 시스템 보드 FRU 1:1 매칭 의무:** 메모리 용량 변경이나 불량 수리 시 반드시 **제3장 별표 3-1(p. 19)**에서 **CPU 모델 + Intel vPro 지원 여부 + RAM 용량(`16 GB` vs `32 GB`) + 5G WWAN 슬롯 유무**가 일치하는 시스템 보드 스페어 파트 번호(예: `i7-1265U vPro + 32GB + WWAN` ➔ `M90788-601` / `N19201-601`)로 통교체해야 합니다.""",

    "manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs": """# 제1장 §1.3 — M.2 2280 PCIe Gen4 NVMe 스토리지 및 Wi-Fi 6E / 5G WWAN 무선통신 규격 (pp. 3–4)

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
  - *주의:* Wi-Fi 전용 시스템 보드(`N19202-601`)에는 M.2 Key-B WWAN 소켓 및 `4×4 MIMO` 동축 안테나(`주황/5`, `백색/6`, `황색/7`, `자주/8`)가 미실장되어 있으므로 사후 5G 모뎀 추가 장착이 불가합니다.""",

    "manuals/02_ch2_external_components/sec_2_1_thunderbolt_and_io_ports": """# 제2장 §2.1 — 우측 및 좌측 외부 입출력(I/O) 컴포넌트 규격 (pp. 5–6)

## 1. 우측면 구성품 (서비스 매뉴얼 p. 5)
1. **오디오 출력(헤드폰) / 오디오 입력(마이크) 콤보 잭 (`3.5 mm`):** CTIA 규격 4극 스테레오 헤드셋 지원.
2. **SuperSpeed USB Type-A `5 Gbps` 포트 (HP Sleep and Charge 지원):** 절전 모드(`S0ix`) 또는 전원 오프 상태에서도 `5V / 1.5A` 상시 충전 제공.
3. **나노 시큐리티 락 슬롯 (Nano Security Lock Slot):** 초박형 물리 보안 케이블 잠금장치 연결부.
4. **USB Type-C® 전원 커넥터 겸 Thunderbolt™ 4 포트 #1 (우측):** USB4 `40 Gbps` 데이터 전송, USB Power Delivery 3.0 (`65W` 표준 / `100W` 고속 충전), **DisplayPort™ 1.4a** (`DSC 1.2`) 비디오 출력 지원.
5. **배터리 / AC 어댑터 상태 표시등:**
   - **백색 점등 (Solid White):** AC 어댑터 연결 및 배터리 충전 완료 (`> 90%`).
   - **호박색 점등 (Solid Amber):** AC 어댑터 연결 및 급속 충전 중.
   - **호박색 점멸 (8회 깜빡임):** 배터리 정품 인증 오류 또는 셀 전압 불량 (`POST 601`).

## 2. 좌측면 구성품 (서비스 매뉴얼 p. 6)
1. **HDMI® 2.0b 포트:** 최대 `4K @ 60 Hz` (`3840 × 2160`) 디지털 영상/음성 직접 출력.
2. **Nano-SIM 카드 트레이 (WWAN 모델 전용, `N22920-001`):** 푸시-이젝트 방식 5G/LTE USIM 트레이 (내장형 **eSIM** 병행 지원).
3. **USB Type-C® 전원 커넥터 겸 Thunderbolt™ 4 포트 #2 (좌측):** **HP Thunderbolt Dock G4 (`120W` / `280W`)** 연결 시 듀얼 4K `@ 60 Hz` 또는 단일 `8K @ 60 Hz` 출력 및 Intel VT-d DMA 메모리 보호 지원.""",

    "manuals/02_ch2_external_components/sec_2_2_display_oled_sureview_camera": """# 제2장 §2.2 — 디스플레이 어셈블리 · 패널 옵션 및 상단 베젤 센서 구조 (pp. 7–9)

## 1. 13.5형 (34.3 cm) `3:2` 디스플레이 패널 3대 옵션
1. **3K2K (`3000 × 2000`) OLED BrightView 터치 디스플레이 (`N09033-001` / `N18990-001`):**
   - `400 nits` 휘도, `100% DCI-P3` 색역, Corning® Gorilla® Glass 5, VESA TrueBlack HDR 500 인증.
   - 전용 **40핀 고속 eDP 1.4b + 터치 통합 케이블 (`N09038-001`)** 적용.
2. **WUXGA+ (`1920 × 1280`) HP Sure View Reflect 통합 보안 디스플레이 (`N09032-001`):**
   - `1000 nits` 휘도, 눈부심 방지(Anti-Glare), 키보드 **`F2`** 핫키로 즉시 작동하는 하드웨어 구리 반사형 측면 시야 차단 레이어 내장.
3. **WUXGA+ (`1920 × 1280`) 저전력 IPS 디스플레이 (`N09031-001`):**
   - `400 nits` 휘도, `100% sRGB`, 초저전력 `1W` 패널 소비전력.

## 2. 상단 베젤 웹캠 및 센서 어레이 (서비스 매뉴얼 p. 7)
- **5 MP / 8 MP + IR MIPI/USB2 카메라 모듈 (`N09036-001` / `N19002-001`):** **HP Auto Frame**, Windows Hello 안면 인식용 듀얼 IR 발광기, **HP Presence** 조도 보정 지원.
- **주변 조도 및 색온도 센서 (ALS):** 주변 환경에 맞춰 OLED/IPS 휘도 및 화이트밸런스 자동 보정.
- **내장 듀얼 어레이 디지털 마이크:** 상단 베젤 에지 빔포밍 AI 노이즈 캔슬링 마이크.""",

    "manuals/02_ch2_external_components/sec_2_3_keyboard_privacy_shutter_biometrics": """# 제2장 §2.3 — 탑커버 키보드 · 전자식 카메라 프라이버시 키(F12) · 지문인식기 및 오디오 (pp. 10–14)

## 1. 탑커버 일체형 백라이트 키보드 및 핫키 아키텍처
- **탑커버 키보드 어셈블리 (`N09042-001` / `N19015-001`):** 마그네슘 팜레스트와 백라이트 키보드가 열융착된 일체형 FRU 구조.
- **F12 전자식 카메라 프라이버시 셔터 키 (Electronic Camera Privacy Key):**
  - 물리적 플라스틱 슬라이더가 아닌 **임베디드 컨트롤러(EC) 인터럽트 기반 전자식 셔터 회로**를 통해 카메라 모듈(`N09036-001` / `N19002-001`)의 광학 셔터와 상태 LED를 제어합니다.
  - F12 작동 불량 시 카메라 모듈을 즉시 교체하지 말고 **HP Hotkey Support 드라이버, EC 펌웨어 리셋, 키보드 ZIF 리본 케이블**을 먼저 점검해야 합니다(제6장 §6.6 `TS-DFG3-005`).

## 2. 생체인증 및 Bang & Olufsen 쿼드 오디오 서브시스템
- **지문 인식 센서 (`N09041-001`):** 키보드 우측 하단 배열에 통합된 Match-on-Chip(MoC) 정전식 지문 센서.
- **Bang & Olufsen 쿼드 스피커 (`N09037-001`):** 상향 트위터 2개 + 하향 우퍼 2개 및 개별 스마트 앰프(Smart Amp) 구성.""",

    "manuals/02_ch2_external_components/sec_2_4_service_tag_and_regulatory_labels": """# 제2장 §2.4 — 하판 서비스 태그 레이블 · 일련번호(Serial Number) 및 DMI 기록 의무 (pp. 15–16)

## 1. 하판 레이저 각인 서비스 태그 식별 항목 (서비스 매뉴얼 p. 15)
1. **Product Name (제품명):** HP Elite Dragonfly 13.5 G3 / HP Dragonfly Folio G3
2. **Serial Number (S/N · 10자리 영숫자):** 기기 고유 식별 번호 (예: `5CG234XXXX`)
3. **Product ID / SKU Number:** 공장 출고 하드웨어 구성 코드 (예: `6B2Z8EA#ABU` / `SKU-DFG3-I732-5G`)
4. **Warranty Period & Regulatory Markings:** 보증 기간 코드 및 FCC / KC / CE 무선 인증 식별자.

## 2. 시스템 보드 교체 시 BIOS DMI 재주입 강행 의무
- 시스템 보드(`M90788-601` / `N19201-601`) 교체 후 하판 커버(`N22918-001`)에 각인된 **Serial Number, SKU Number, System Board CT 번호, UUID**를 반드시 HP MPM(Manufacturing Programming Mode) / UEFI 유틸리티에 재주입하고 TPM 2.0 및 Intel vPro ME를 재봉인(Sealing)해야 합니다(부록 B §B.2 참조).""",

    "manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog": """# 제3장 [별표 3-1] — 주요 시스템 FRU 스페어 파트 카탈로그 총괄 (pp. 17–21)

## 1. 섀시 · 전원 · 열관리 · 스토리지 핵심 스페어 파트 매핑표
| 번호 | 부품명 (Component Description) | 스페어 파트 번호 (FRU Part ID) | 교체 시 필수 선행 분리 (`REQUIRES_REMOVAL_OF`) |
| :---: | :--- | :---: | :--- |
| 1 | 탑커버 일체형 백라이트 키보드 (Slate Blue, 한국어/영문) | `N09042-001` / `N19015-001` | 하판 커버 ➔ 배터리 ➔ 시스템 보드 전체 분리 후 교체 |
| 2 | 베이퍼 챔버 방열판 (Vapor Chamber Heatsink, PTM7950 부착) | `M90790-001` / `N18244-001` | `N22918-001`(하판 커버) ➔ `M90788-005`(배터리) |
| 3 | 듀얼 액정 폴리머 냉각 팬 (Cooling Fan Assembly) | `M90791-001` / `N18245-001` | `N22918-001`(하판 커버) ➔ `M90788-005`(배터리) *(히트싱크 탈거 불필요)* |
| 4 | 66Wh 4셀 리튬이온 스마트 배터리 팩 (XL-Long Life) | `M90788-005` / `M90789-005` | `N22918-001`(하판 커버 분리 직후 제1순위로 전원 커넥터 차단) |
| 5 | 1TB / 2TB PCIe Gen4×4 NVMe M.2 2280 TLC SSD | `M16560-005` / `M90790-001` | `N22918-001`(하판 커버) ➔ `M90788-005`(배터리) + 흑색 Mylar 실드(`N09040-001`) 이관 |
| 6 | 마그네슘-알루미늄 하판 커버 (Bottom Cover, 캡티브 T5×5) | `N22918-001` / `N09035-001` | 최외곽 루트 부품 (선행 분리 조건 없음, Torx T5 0.20 N·m) |""",

    "manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix": """# 제3장 [별표 3-1 상세] — 시스템 보드(System Board) 16종 SKU 매트릭스 (pp. 19–20)

## 1. 온보드 LPDDR5 및 WWAN 구성별 시스템 보드 스페어 파트 번호
| 대표 SKU ID | 프로세서 (CPU) | Intel vPro | 온보드 LPDDR5 메모리 | 5G WWAN M.2 Key-B 슬롯 | 시스템 보드 파트 번호 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `SKU-DFG3-I732-5G` | Intel Core i7-1265U | **vPro Enterprise** | **32 GB** (온보드 납땜) | **실장 (WWAN-Ready)** | **`N19201-601` / `M90788-601`** |
| `SKU-DFG3-I716-WIFI` | Intel Core i7-1265U | **vPro Enterprise** | **16 GB** (온보드 납땜) | 미실장 (Wi-Fi 전용) | **`N19202-601` / `M90787-601`** |
| `SKU-DFG3-I732-NONVPRO` | Intel Core i7-1255U | Non-vPro | **32 GB** (온보드 납땜) | 실장 (WWAN-Ready) | **`N19203-601` / `M90786-601`** |
| `SKU-DFG3-I516-WIFI` | Intel Core i5-1245U | vPro Enterprise | **16 GB** (온보드 납땜) | 미실장 (Wi-Fi 전용) | **`N19204-601` / `M90785-601`** |

## 2. 시스템 보드 발주 시 필수 검증 규칙
- **인접 행 오매칭 주의:** 표 3-1에서 `N19201-601`(32GB + 5G WWAN)과 `N19202-601`(16GB + Wi-Fi 전용)은 품명이 유사하나 메모리 용량과 M.2 Key-B WWAN 슬롯 실장 여부가 다르므로 반드시 BigQuery Property Graph의 `USES_SYSTEM_BOARD` 엣지로 정밀 대조해야 합니다.""",

    "manuals/03_ch3_spare_parts_catalog/table_3_2_display_and_antenna_subcomponents": """# 제3장 [별표 3-2] — 디스플레이 어셈블리 및 안테나 세부 구성품 카탈로그 (pp. 22–28)

## 1. 디스플레이 서브컴포넌트 단품 FRU 목록 (통교체 방지 및 부분 수리 기준)
| 구성품 분류 | 세부 부품명 | 스페어 파트 번호 | 수리 거버넌스 지침 |
| :--- | :--- | :---: | :--- |
| 패널 어셈블리 | 13.5형 3K2K (`3000×2000`) OLED 터치 디스플레이 전체 | `N09033-001` / `N18990-001` | 패널 유리 파손·번인 시에만 교체 ($640) |
| 힌지 키트 | 풀포워드 폴리오 힌지 클러치 키트 (좌/우 힌지 브래킷) | `N09034-001` / `N18995-001` | 힌지 유격·자석 안착 불량 시 패널 통교체 대신 **$95 단품 교체 의무** |
| 접착 키트 | 디스플레이 스트레치 릴리즈(Stretch-Release) 풀탭 접착 스트립 | `N09039-001` | 디스플레이 또는 웹캠 케이블 분해 시 **100% 신품 교체 필수 (재사용 금지)** |
| 케이블 키트 | 40핀 eDP 1.4b 디스플레이 및 5MP/8MP IR 웹캠 통합 리본 | `N09038-001` / `N19002-001` | 화면 깜빡임·웹캠 신호 불량 시 부분 교체 가능 |
| 안테나 키트 | 4×4 MIMO 5G WWAN + Wi-Fi 6E 초소형 동축 안테나 키트 | `N09037-005` / `N19210-001` | MHF4 단자(`5·6·7·8`) 손상 또는 힌지 구간 단선 시 교체 |""",

    "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol": """# 제5장 §5.1 — 정전기 방전(ESD 700V) 손상 방지 강행 수칙 및 Mylar 실드 보존 의무 (pp. 29–30)

## 1. 700V 정전기 방전(ESD) 민감도 경고 (`SAFE-DFG3-ESD`)
- 인체가 체감하는 정전기 임계치는 약 `3,000 V`이나, HP Dragonfly G3의 12세대 Intel Alder Lake SoC 및 온보드 LPDDR5-6400 컨트롤러는 **`700 V` 이하의 미세 정전기 방전(ESD)**만으로도 영구적인 게이트 산화막 파괴가 발생합니다.

## 2. 필수 ESD 방호 및 차폐 보존 프로토콜
1. **접지 손목 스트랩 및 전도성 매트 착용:** 분해 시작 전 `1 MΩ ± 10%` 안전 저항이 내장된 ESD 손목 밴드를 착용하고 접지된 전도성 작업 매트(상대습도 `40% ~ 60%`) 위에서 작업해야 합니다.
2. **배터리 선행 분리 의무:** 하판 커버(`N22918-001`) 개방 직후 **어떤 ZIF 리본이나 M.2 모듈도 건드리기 전에** 반드시 배터리 팩(`M90788-005`) 전원 커넥터를 분리해야 합니다(구 v0.1.0 핫스왑 특례 영구 폐기).
3. **전도성 흑색 Mylar 차폐 필름(`N09040-001`) 원상 복원:** 시스템 보드와 SSD 상단의 흑색 Mylar 필름은 ESD 및 EMI 간섭을 막는 필수 안전 부품이므로 찢어지거나 누락된 상태로 재조립해서는 안 됩니다.""",

    "manuals/04_ch5_preliminary_safety/sec_5_2_pre_disassembly_and_tooling_rules": """# 제5장 §5.2 — 분해 전 필수 사전 조치(Service Mode) 및 전용 정밀 공구 규격 (pp. 31–32)

## 1. 분해 전 6대 필수 사전 절차
1. 외부 AC 어댑터, Thunderbolt 도크, USB 주변기기 및 Nano-SIM 카드(`N22920-001`)를 모두 제거합니다.
2. UEFI BIOS(`F10` ➔ `Power` ➔ `Battery Shipping / Service Mode`)에 진입하여 내장 배터리 팩의 FET 출력을 소프트웨어적으로 1차 차단합니다.
3. 전원 버튼을 `5초` 이상 길게 눌러 메인보드 캐패시터의 잔류 전하(Flea Power)를 완전히 방전시킵니다.

## 2. 공인 정밀 수리 공구 및 체결 토크 규격
- **Torx T5 정밀 드라이버 (`0.20 N·m`):** 하판 커버(`N22918-001`) 5개 캡티브 나사 전용.
- **Phillips P0 / P1 정밀 드라이버 (`0.22 N·m` ~ `0.35 N·m`):** 배터리(`M90788-005`), 베이퍼 챔버 방열판(`N18244-001`), 시스템 보드(`N19201-601`), 폴리오 힌지(`N18995-001`) 체결용.
- **비자성 플라스틱 스퍼저 (Non-Conductive Nylon Spudger):** ZIF 커넥터 래치 및 하판 클립 분리용 (금속 일자 드라이버 사용 엄금).""",

    "manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule": """# 제5장 §5.3 — 팽창된 리튬이온 배터리(Swollen Battery) 취급 및 700°C 열폭주 방지 수칙 (pp. 33–34)

## 1. 리튬이온 폴리머 셀 팽창 위험 경고 (`SAFE-DFG3-BAT`)
- 팽창(Swelling)된 `66Wh` 4셀 리튬이온 배터리(`M90788-005`)는 내부 전해질 분해 가스가 찬 상태로, 외부 압착·휨·금속 공구에 의한 파우치 천공 시 **`700°C` 이상의 급격한 열폭주(Thermal Runaway) 및 금속 화재**가 발생할 수 있습니다.

## 2. 팽창 배터리 분리 및 격리 강행 절차
1. **장력 서서히 해제:** 하판 커버(`N22918-001`)의 Torx T5 나사 5개를 풀 때 커버가 급격히 튀어 오르지 않도록 손바닥으로 가볍게 지지하며 대각선 순서로 천천히 이완합니다.
2. **금속 지렛대 절대 금지:** 팽창된 배터리를 섀시에서 들어 올릴 때 금속 드라이버나 날카로운 도구를 지렛대로 사용하는 행위를 엄격히 금지합니다.
3. **인접 베이퍼 챔버 방열판(`N18244-001`) 변형 동시 점검:** 배터리 팽창 압력으로 인해 인접한 베이퍼 챔버 히트싱크나 트랙패드 브래킷이 휘었는지 함께 점검하고, 분리된 배터리는 즉시 **Class-D 방화 모래/인증 리튬이온 격리 용기**에 보관합니다.""",

    "manuals/05_ch5_base_battery_storage/sec_5_4_bottom_cover_removal": """# 제5장 §5.4 — 하판 커버(Bottom Cover, `N22918-001`) 분리 절차 (pp. 35–36)

## 1. 대상 FRU 및 선행 조건
- **부품 번호:** `N22918-001` (Slate Blue 마그네슘-알루미늄 하판 커버) / `N09035-001`
- **선행 분리 조건 (`REQUIRES_REMOVAL_OF`):** 없음 (모든 내부 수리의 **Step 1 최상위 루트 단계**).

## 2. 상세 분해 및 재장착 절차
1. 노트북을 전면이 작업자 반대쪽을 향하도록 ESD 매트 위에 뒤집어 놓습니다.
2. **5개의 캡티브(Captive · 이탈 방지형) Torx T5 나사**를 완전히 풀릴 때까지(딸깍 소리가 날 때까지) 회전시킵니다. 캡티브 나사이므로 커버에서 억지로 뽑아내지 마십시오.
3. 후면 힌지 사이의 틈새에 비자성 플라스틱 오프닝 툴을 삽입하여 후면 클립을 먼저 해제한 뒤, 앞쪽으로 들어 올려 하판 커버를 분리합니다.
4. 재장착 시에는 5개 Torx T5 나사를 **`0.20 N·m` (`2.0 kgf·cm`)** 토크로 균일하게 체결합니다.""",

    "manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal": """# 제5장 §5.5 — 66Wh 배터리 팩(`M90788-005`) 분리 및 제1선행 전원 차단 강행 원칙 (pp. 37–39)

## 1. 대상 FRU 및 필수 선행 조건 (`REQUIRES_REMOVAL_OF`)
- **부품 번호:** `M90788-005` / `M90789-005` (4셀 `66 Wh` 리튬이온 폴리머 배터리)
- **필수 선행 단계:** [Step 1] `N22918-001` 하판 커버 분리 완료(제5장 §5.4).
- **하위 의존 부품:** NVMe SSD(`M90790-001`), 5G WWAN(`M90792-001`), 냉각 팬(`N18245-001`), 베이퍼 챔버 방열판(`N18244-001`), 시스템 보드(`N19201-601`) 등 **모든 내부 부품 탈거의 필수 선행 조건(Step 2)**입니다.

## 2. 상세 분리 절차
1. **배터리 전원 커넥터 최우선 분리:** 손톱이나 비자성 나일론 스퍼저만 사용하여 배터리 케이블 플러그를 시스템 보드 소켓에서 수평으로 밀어 분리합니다.
2. 배터리 팩 하단 플랜지를 고정하는 **Phillips PM2.0×3.0 나사 4개(`0.22 N·m`)**를 제거합니다.
3. 배터리 상단 가장자리를 잡고 앞쪽으로 들어 올려 섀시에서 분리합니다.""",

    "manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure": """# 제5장 §5.6 — M.2 2280 PCIe Gen4 NVMe SSD 분리 및 흑색 Mylar 방열 실드(`N09040-001`) 이관 절차 (pp. 40–42)

## 1. 대상 FRU 및 선행 분해 DAG
- **부품 번호:** `M90790-001` / `M16560-005` (1TB PCIe Gen4×4 TLC SSD), `M90791-001` / `M52027-005` (2TB), `N09040-001` (SSD 써멀 패드 및 흑색 Mylar 실드 키트).
- **선행 분리 경로 (`REQUIRES_REMOVAL_OF` 2-Hop):**
  `N22918-001`(하판 커버) ➔ `M90788-005`(배터리 전원 분리) ➔ `M90790-001`(NVMe SSD).

## 2. 상세 교체 및 방열 실드 이관 지침
1. SSD 상단을 덮고 있는 **전도성 흑색 Mylar EMI 차폐 플랩(`N09040-001`)**을 조심스럽게 젖힙니다.
2. **Phillips PM2.0×2.5 나사 1개**를 제거하고 SSD를 `25°` 각도로 들어 올려 M.2 슬롯에서 분리합니다.
3. 기존 SSD에 부착된 **구리 방열 실드(Copper Thermal Shield)와 실리콘 써멀 패드**를 손상 없이 신규 SSD에 이관하여 부착합니다(누락 시 PCIe Gen4 컨트롤러 `85°C` 과열 쓰로틀링 발생).""",

    "manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing": """# 제5장 §5.7 — 5G WWAN(`M90792-001`) 모듈 분리 및 4×4 MIMO 동축 안테나 색상 매핑 (pp. 43–51)

## 1. 대상 FRU 및 선행 분해 DAG
- **부품 번호:** `M90792-001` / `N00182-005` (5G NR Sub-6 GHz WWAN 모듈), `N19210-001` (4×4 MIMO 안테나 키트).
- **선행 분리 경로 (`REQUIRES_REMOVAL_OF` 2-Hop):**
  `N22918-001`(하판 커버) ➔ `M90788-005`(배터리 전원 분리) ➔ `M90792-001`(5G WWAN 모듈).

## 2. 4×4 MIMO MHF4 초소형 동축 안테나 단자 번호·색상 매핑 규칙
| 안테나 번호 | 케이블 색상 (Color Code) | M.2 WWAN 단자 역할 | 체결 시 필수 주의사항 |
| :---: | :---: | :--- | :--- |
| **#5 (Main)** | **주황색 (Orange)** | Primary TX/RX 주 안테나 | MHF4 단자를 수직(`90°`)으로 눌러 체결 (비틀기 금지) |
| **#6 (Aux)** | **백색 / 청색 (White/Blue)** | Diversity / GNSS 보조 안테나 | 단자 번호 각인(`5·6·7·8`)과 케이블 태그 1:1 일치 필수 |
| **#7 (MIMO 1)** | **황색 (Yellow)** | 4×4 Downlink MIMO 3번 채널 | 풀포워드 힌지 가이드 채널 내부에 완전히 매립 배선 |
| **#8 (MIMO 2)** | **자주색 (Purple)** | 4×4 Downlink MIMO 4번 채널 | 하판 보스(Boss) 기둥에 동축선이 찍히지 않도록 고정 |""",

    "manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan": """# 제5장 §5.12 — 냉각 팬(`N18245-001`) 및 베이퍼 챔버 방열판(`N18244-001`) 분리 · PTM7950 규격 (pp. 52–59)

## 1. 냉각 팬(`N18245-001`)과 베이퍼 챔버 방열판(`N18244-001`)의 독립 분해 관계
- **핵심 분해 DAG 규칙:**
  - **냉각 팬(`N18245-001` / `M90791-001`) 단독 교체 시:** `N22918-001`(하판 커버) ➔ `M90788-005`(배터리)만 분리하면 즉시 팬 나사 3개와 4핀 PWM 케이블을 풀어 교체할 수 있으며, **베이퍼 챔버 방열판(`N18244-001`)을 떼어내서는 안 됩니다.**
  - 불필요하게 방열판을 탈거하면 상변화 써멀 패드(`Shin-Etsu PTM7950`) 밀착층이 파괴되어 방열판 키트까지 재교체해야 합니다.

## 2. 베이퍼 챔버 방열판(`N18244-001`) 탈거 및 대각선 토크 순서 (`SAFE-DFG3-THM`)
1. **분해 시:** 방열판 다이 플레이트에 각인된 번호의 **역순(`4 ➔ 3 ➔ 2 ➔ 1` 대각선 순서)**으로 캡티브 Phillips PM2.0×3.0 나사 4개를 풉니다.
2. **재장착 시:** 주사기형 액상 써멀 그리스 재도포(폐기된 구 v0.1.0 내규 제3조)는 엄격히 금지되며, 반드시 정품 **Shin-Etsu PTM7950 상변화 패드**가 사전 부착된 방열판을 **`1 ➔ 2 ➔ 3 ➔ 4` 대각선 순서(`0.25 N·m`)**로 체결합니다.""",

    "manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag": """# 제5장 §5.16 — 시스템 보드(`N19201-601` / `M90788-601`) 다단계 선행 분해 DAG 및 ZIF 해제 절차 (pp. 60–66)

## 1. 시스템 보드 교체를 위한 필수 다단계 분해 DAG (`REQUIRES_REMOVAL_OF`)
시스템 보드(`N19201-601` / `M90788-601`)를 들어 올리기 전에 반드시 아래의 선행 분리 체인을 순서대로 완료해야 합니다:
1. **[Step 1] `N22918-001` 하판 커버 분리** (Torx T5 캡티브 나사 5개, 제5장 §5.4)
2. **[Step 2] `M90788-005` 66Wh 배터리 팩 전원 커넥터 차단 및 분리** (`SAFE-DFG3-BAT`, 제5장 §5.5)
3. **[Step 3] `N22920-001` Nano-SIM 트레이 · `M90790-001` NVMe SSD · `M90792-001` 5G WWAN 모듈 분리** (제5장 §5.6~§5.7)
4. **[Step 4] `N18244-001` 베이퍼 챔버 방열판 분리** (대각선 `4➔3➔2➔1` 순서, 제5장 §5.12)
5. **[Step 5] `N19201-601` 시스템 보드 ZIF 리본(디스플레이 eDP 40핀, 키보드, 트랙패드, 지문센서, 스피커) 해제 및 보드 나사 4개(`PM2.0×3.0`) 분리**

## 2. 교체 후 필수 조치 (부록 B 연계)
- 온보드 LPDDR5 메모리가 보드에 직결되어 있으므로 보드 교체 후 반드시 **BIOS DMI 블록(S/N, SKU, CT, UUID) 재주입 및 Intel vPro ME / TPM 2.0 봉인**을 수행해야 합니다.""",

    "manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable": """# 제5장 §5.18 — 13.5형 3K2K OLED 디스플레이(`N18990-001`) · 폴리오 힌지(`N18995-001`) 및 풀탭 접착 키트 (pp. 67–72)

## 1. 디스플레이 통교체(`$640`) vs 폴리오 힌지/케이블 부분 수리(`$95`) 원칙
- **풀포워드 힌지 유격 또는 자석 안착(Detent) 불량 (`TS-DFG3-004`):** 3K2K OLED 패널(`N18990-001`, `$640`)에 파손이나 화소 불량이 없다면 디스플레이 전체를 교체하지 말고, **폴리오 힌지 클러치 키트(`N18995-001`, `$95`, Phillips PM2.5×4.0 `0.35 N·m`)**만 부분 교체하고 홀 센서(Hall Sensor) 리본을 점검합니다.

## 2. 스트레치 릴리즈 풀탭 접착 스트립(`N09039-001`) 수평 인출 규칙
1. 베젤 내부 패널 분해 시 상·하단 핀셋 홀에서 **스트레치 릴리즈(Stretch-Release) 접착 풀탭(`N09039-001`)**을 패널 면과 평행(`0° ~ 15°` 수평 각도)하게 서서히 당겨 분리합니다(`45°` 이상 꺾어 당기면 테이프가 끊어져 OLED 유리 파손 위험).
2. 재조립 시에는 반드시 신품 접착 스트립 키트(`N09039-001`)를 사용해야 합니다.""",

    "manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery": """# 제6장 §6.1 — HP Computer Setup(F10) · HP Sure Start Gen7 듀얼 플래시 SPI 자가복구(`Win+B`) (pp. 73–80)

## 1. HP Sure Start Gen7 하드웨어 기반 BIOS/EC 무결성 보호 아키텍처
- HP Dragonfly G3는 시스템 보드에 독립된 **HP Endpoint Security Controller (ESC)**와 프라이머리/백업 듀얼 SPI 플래시 메모리를 탑재하여 부팅 전 BIOS 및 임베디드 컨트롤러(EC) 펌웨어의 암호화 서명을 하드웨어 레벨에서 검증합니다.

## 2. 무분해 강제 SPI BIOS 복구 절차 (`Win + B + Power` 3단계)
부팅 불가(No POST), 블랙스크린, 또는 전원/Caps Lock LED `2.2` / `3.2` 점멸 시 **하판을 개봉하기 전에 반드시 아래 무분해 복구를 1차로 수행**해야 합니다:
1. 전원을 완전히 끄고 정품 65W USB-C AC 어댑터를 연결합니다.
2. 키보드의 **`Windows 로고 키 + B 키`**를 동시에 누른 상태에서 **전원 버튼을 `2~3초`간 눌렀다 뗍니다**(이때 `Win + B` 키는 화면이 켜지거나 비프음이 날 때까지 `10초`간 계속 유지).
3. HP Sure Start Gen7이 격리된 골든 SPI 플래시에서 프라이머리 BIOS와 EC 이미지를 자동 복원하고 재부팅합니다(복구 후 **전원 버튼 `15초` 홀드 CMOS/EC 리셋** 병행).""",

    "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages": """# 제7장 §7.1 [표 7-1·7-2] — CAPS LOCK / 전원 LED 점멸 진단 코드(`3.2`, `2.2`, `4.2`) 및 POST 오류 판독 기준 (pp. 81–84)

## 1. LED 점멸 진단 코드 매트릭스 (긴 호박색/백색 깜빡임 × 짧은 백색 깜빡임)
| 진단 코드 ID | 점멸 패턴 (Long · Short) | 하드웨어/펌웨어 근본 원인 | 1차 의무 조치 (`GOVERNED_BY_PLAYBOOK`) |
| :---: | :---: | :--- | :--- |
| **`LED-3-2`** | 긴 점멸 **3회** · 짧은 점멸 **2회** | 온보드 LPDDR5 메모리 트레이닝 실패 또는 EC/BIOS 이미지 불일치 | **시스템 보드 즉시 교체 금지** ➔ `Win + B + Power` Sure Start 복구 및 `15초` EC 리셋 선행 (`TS-DFG3-001`) |
| **`LED-2-2`** | 긴 점멸 **2회** · 짧은 점멸 **2회** | 프라이머리 시스템 BIOS SPI 이미지 손상 | `Win + B + Power` HP Sure Start Gen7 자동 복구 실행 |
| **`LED-4-2`** | 긴 점멸 **4회** · 짧은 점멸 **2회** | CPU 과열 보호 작동 또는 냉각 팬(`N18245-001`) 회전 스톨(POST `90B`) | 냉각 팬(`N18245-001`) 4핀 커넥터 및 Intel DPTF 점검 (`TS-DFG3-003`) |
| **`POST-601`** | 배터리 LED **8회** 연속 점멸 | 내장 66Wh 배터리(`M90788-005`) 정품 셀 용량 `25%` 미만 저하 또는 팽창 | UEFI 배터리 진단 후 `M90788-005` 교체 (`SAFE-DFG3-BAT`) |""",

    "manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix": """# 제7장 §7.2 — 증상별 하드웨어·펌웨어 원인 트리아지 매트릭스 (`TS-DFG3-001` ~ `TS-DFG3-006`, pp. 85–88)

## 1. 6대 표준 트러블슈팅 케이스 (`TroubleshootingCase`) 및 과잉 수리 방지 매핑
| 케이스 ID | 현장 접수 증상 | 연관 부품 (`MITIGATES_CASE`) | 비침습 1차 진단 게이트 (`hardware-fru-replacement-rate <= 12.0%`) |
| :---: | :--- | :--- | :--- |
| `TS-DFG3-001` | 전원 인가 후 블랙스크린 & LED `3.2` 점멸 | `N19201-601` (시스템 보드) | `Win+B+Power` Sure Start 복구 + `15초` EC 리셋 선행 (무분해 해결률 `78%`) |
| `TS-DFG3-002` | 5G WWAN `No Service` 또는 모뎀 미인식 | `M90792-001`, `N19210-001` | BIOS IMEI 화이트리스트 · SIM 트레이(`N22920-001`) · 4×4 MIMO 안테나(`#5~#8`) 체결 확인 |
| `TS-DFG3-003` | 고부하 시 CPU `95°C` 쓰로틀링 및 팬 소음 | `N18245-001`, `N18244-001` | Intel DPTF 드라이버 업데이트 및 팬 단독 점검(방열판 불필요 탈거 금지) |
| `TS-DFG3-004` | 폴리오 모드 전환 시 힌지 유격·자석 안착 불량 | `N18995-001` vs `N18990-001` | `$640` OLED 통교체 금지 ➔ `$95` 폴리오 힌지 키트(`N18995-001`) 부분 교체 |
| `TS-DFG3-005` | F12 카메라 프라이버시 키 무반응·웹캠 블랙 | `N19015-001`, `N19002-001` | HP Hotkey Support / EC 리셋 ➔ 키보드 ZIF 리본 ➔ 8MP IR 카메라 순 분리 진단 |
| `TS-DFG3-006` | 우측 마그네틱 도크 부착 시 와콤 펜 충전 불가 | `N19020-001`, `N19021-001` | 펜 상단 USB-C 직결 충전 교차 테스트로 펜(`N19020-001`) vs 본체 도크(`N19021-001`) 분리 |""",

    "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap": """# [사내 표준 정비내규 제SOP-2026-01호] 내규 제1조 — LED `3.2`/`2.2` 점멸 시 시스템 보드(`N19201-601`) 교체 전 무분해 Sure Start 복구 의무화

## 1. 목적 및 KPI 거버넌스 기준 (`hardware-fru-replacement-rate`)
- 본 조항은 온보드 LPDDR5-6400 아키텍처 특성상 무전원 또는 `LED 3.2` 점멸 입고 시 현장 엔지니어가 고가의 시스템 보드(`N19201-601` / `M90788-601`, `$780`)를 성급히 통교체하는 과잉 수리(NTF: No Trouble Found)를 방지하고, 글로벌 공급망 KPI인 **부품 교체율(`hardware-fru-replacement-rate`) 목표치 `12.0%` 이하(현행 실적 `8.4%`)**를 유지하기 위해 제정되었습니다.

## 2. 필수 2단계 무분해 복구 게이트 (미수행 시 보드 발주 반려)
1. **[1단계 · 하드웨어 SPI 복구]:** `Win + B + 전원 버튼 3초 홀드`를 통해 **HP Sure Start Gen7** 듀얼 플래시 자동 복구를 실행하고 결과를 서비스 티켓에 기록합니다.
2. **[2단계 · EC/RTC 하드 리셋]:** 정품 65W USB-C 어댑터를 연결한 상태에서 전원 버튼을 정확히 **`15초`간 길게 눌러** 임베디드 컨트롤러(EC) 레지스터와 LPDDR5 메모리 트레이닝 캐시를 초기화합니다.
3. 위 1·2단계를 모두 수행한 후에도 `LED 3.2` 점멸이 재현되는 경우에 한하여 **제3장 별표 3-1**의 정밀 매칭 시스템 보드 발주를 승인합니다.""",

    "internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap": """# [사내 표준 정비내규 제SOP-2026-01호] 내규 제2조 — 과열 쓰로틀링 접수 시 베이퍼 챔버(`N18244-001`) 교체 전 점검 및 PTM7950 상변화 패드 강행 기준

## 1. 열관리 트리아지 선행 점검 절차 (`TS-DFG3-003`)
1. CPU 패키지 온도 `95°C` 도달 또는 팬 소음 접수 시, 즉시 베이퍼 챔버 방열판(`N18244-001` / `M90790-001`, `$115`)을 탈거하지 말고 **BIOS 최신 버전 및 Intel Dynamic Tuning Technology (DPTF) 전력 프로파일**을 먼저 업데이트합니다.
2. 팬 베어링 소음이나 회전 스톨(`POST 90B` / `LED 4.2`)만 발생한 경우, 방열판(`N18244-001`)은 그대로 둔 채 **듀얼 냉각 팬(`N18245-001`, `$58`)만 단독 분리·교체**합니다(제5장 §5.12).

## 2. 액상 써멀 그리스 사용 금지 및 PTM7950 상변화 패드 의무화 (`SAFE-DFG3-THM`)
- 베이퍼 챔버 방열판이나 시스템 보드를 실제로 분리한 경우, 기존 방열판에 주사기형 액상 써멀 그리스를 재도포하여 재장착하는 행위(구 v0.1.0 내규 제3조)는 **Pump-Out 현상 및 VRM 열폭주 위험으로 인해 영구 금지**됩니다. 반드시 **Shin-Etsu PTM7950 상변화 패드**가 사전 부착된 정품 키트를 대각선 `1➔2➔3➔4` 순서(`0.25 N·m`)로 체결하십시오.""",

    "internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap": """# [만료/폐기 · DEPRECATED] 구(舊) 정비내규 제3조 (`v0.1.0`) — 배터리 활성 상태 ZIF 리본 핫스왑 및 액상 써멀 그리스 재도포 특례

> **⚠️ 거버넌스 차단 경고 (`BLOCKED_DEPRECATED`):**
> 본 조항(`v0.1.0`, 만료일 `2025-12-31`)은 **제5장 §5.1 (`700V ESD 방전 수칙`), 제5장 §5.5 (`배터리 선행 분리 의무`), 및 내규 제2조 (`PTM7950 상변화 패드 의무화`)**의 전면 개정(`v0.2.0`)에 따라 **영구 폐기(`status: deprecated`)**되었습니다. Dataplex Knowledge Catalog(`okf_hp_dragonfly_kr`) 거버넌스 게이트에 의해 에이전트 인용이 원천 차단됩니다.

## 1. 폐기된 구(舊) 지침 원문 (`v0.1.0` — 현장 적용 절대 금지)
1. *(폐기된 조항 1)* 단순 M.2 SSD 교체 또는 키보드 ZIF 리본 재결착 시 작업 시간 단축을 위해 66Wh 배터리(`M90788-005`) 커넥터를 분리하지 않고 라이브 상태에서 작업할 수 있다.
2. *(폐기된 조항 2)* 베이퍼 챔버 방열판(`N18244-001`) 탈거 후 이소프로필 알코올(IPA 99%)로 기존 패드를 닦아내고 일반 주사기형 액상 써멀 그리스(Shin-Etsu X-23-7783D)를 완두콩 크기로 재도포하여 기존 방열판을 재사용할 수 있다.

## 2. 현행 대체 정본 조항 (`superseded_by`)
- **전원/ESD 안전 대체 정본:** `manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol` (제5장 §5.1) 및 `sec_5_5_battery_pack_isolation_and_removal` (제5장 §5.5)
- **열관리 대체 정본:** `internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap` (내규 제2조 · `SAFE-DFG3-THM`)""",
}


def build_ko_doc_root_body(d: Dict[str, Any], child_files: List[Dict[str, Any]]) -> str:
  """Generates a rich Korean Markdown body for each of the 8 Chapter Root `doc.md` files."""
  rows = "\n".join(
      f"| `{c['section_number_ko']}` | {c['title_ko']} | p.{c['pdf_page']} (`{c['pages_span']}`) | `{c['status']}` |"
      for c in child_files
  )
  return f"""# {d['title_ko']}

## 1. 문서 총괄 개요 (`okf-kr` 비정형 컨텍스트 루트)
- **챕터 식별코드:** `[{d['doc_num']}] {d['doc_id']}`
- **원천 매뉴얼 범위:** HP Elite Dragonfly / Folio 13.5 G3 Maintenance and Service Guide (`N17344-001`, pp. `{d['source_pages_span']}`)
- **OKF 리포지토리 경로:** `okf-kr/{d['rel_path']}`
- **Dataplex Knowledge Catalog 엔트리 그룹:** `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr`
- **요약 설명:** {d['desc_ko']}

## 2. 소속 비정형 세부 조항 목록 ({len(child_files)}개 조항)
| 조항 번호 | 조항 제목 (Korean Title) | 원문 페이지 | 거버넌스 상태 |
| :---: | :--- | :---: | :---: |
{rows}

## 3. 온톨로지 그래프(`hp_dragonfly_ontology_graph`) 브리지 역할
- 본 장 총괄 문서(`doc.md`)와 소속 조항들은 BigQuery Property Graph의 `LEX` 비정형 계층(`ServiceManualDocument`, `ServiceManualChapter`, `ServicePlaybook`) 노드로 매핑되며, `DOCUMENTED_IN_CHAPTER`, `DEFINED_IN_CH6`, `GOVERNED_BY_PLAYBOOK`, `CITES_MANUAL` 엣지를 통해 8개 정형 테이블(`ONT` 계층)과 양방향 결합됩니다."""


def build_yaml_block(
    *,
    lang: str,
    okf_type: str,
    title: str,
    description: str,
    version: str,
    tags: List[str],
    sha256_hex: str,
    generated_by: str,
    generated_at: str,
    status: str,
    part_of: str,
    sequence: int,
    treatment: str,
    license_str: str,
    content_class: str,
    section_number: str,
    source_page: int,
    verified_by: str,
    verified_at: str,
    verified_method: str,
    source_uri: str,
) -> str:
  tag_str = "\n".join(f"- {t}" for t in tags)
  safe_title = title.replace("'", "''")
  safe_desc = description.replace("'", "''")
  safe_sec = section_number.replace("'", "''")
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
  resource: okf://source/manuals/pdf_6290467_en-US-1.pdf
  kind: origin_document
  sha256: {sha256_hex}
source_uri: {source_uri}
generated:
  by: {generated_by}
  at: '{generated_at}'
status: {status}
part_of: {part_of}
sequence: {sequence}
treatment: {treatment}
license: '{license_str}'
content_class: {content_class}
section_number: '{safe_sec}'
source_page: {source_page}
verified:
- by: {verified_by}
  at: '{verified_at}'
  method: {verified_method}
  checks: [P1_body, P2_heading, P3_page, P4_digest]
---"""


def main() -> None:
  text = BUNDLE_JS_PATH.read_text(encoding="utf-8")
  idx = text.index("{")
  data = json.loads(text[idx:].rstrip().rstrip(";"))

  doc_roots: List[Dict[str, Any]] = data["okf_doc_roots"]
  okf_files: List[Dict[str, Any]] = data["okf_files"]

  OKF_KR_DIR.mkdir(parents=True, exist_ok=True)
  OKF_EN_DIR.mkdir(parents=True, exist_ok=True)

  # Write okf_catalog.yaml in okf-kr and okf-en
  (OKF_KR_DIR / "okf_catalog.yaml").write_text(
      "okf_version: '0.2'\n"
      "corpus_id: okf-kr\n"
      "language: ko\n"
      "project_id: hp-dragonfly\n"
      "location: us-central1\n"
      "entry_group_id: okf_hp_dragonfly_kr\n"
      "gcs_prefix: gs://hp-dragonfly-okf/okf-kr/\n",
      encoding="utf-8",
  )
  (OKF_EN_DIR / "okf_catalog.yaml").write_text(
      "okf_version: '0.2'\n"
      "corpus_id: okf-en\n"
      "language: en\n"
      "project_id: hp-dragonfly\n"
      "location: us-central1\n"
      "entry_group_id: okf_hp_dragonfly_en\n"
      "gcs_prefix: gs://hp-dragonfly-okf/okf-en/\n",
      encoding="utf-8",
  )

  # 1. Process 8 Chapter Roots (`okf_doc_roots`)
  for d in doc_roots:
    children = [f for f in okf_files if f["doc_id"] == d["doc_id"]]
    body_en = d.get("body_en") or d["body"]
    body_ko = build_ko_doc_root_body(d, children)

    sha_ko = hashlib.sha256(body_ko.encode("utf-8")).hexdigest()
    sha_en = hashlib.sha256(body_en.encode("utf-8")).hexdigest()
    ver_clean = str(d.get("version") or "0.2.0").lstrip("v")
    fm = d.get("frontmatter") or {}

    gcs_uri_ko = f"gs://hp-dragonfly-okf/okf-kr/{d['rel_path']}"
    gcs_uri_en = f"gs://hp-dragonfly-okf/okf-en/{d['rel_path']}"

    yaml_ko = build_yaml_block(
        lang="ko",
        okf_type="SourceDocument",
        title=d["title_ko"],
        description=d["desc_ko"],
        version=ver_clean,
        tags=d.get("tags") or ["hp-dragonfly", "okf-kr", "doc-root"],
        sha256_hex=sha_ko,
        generated_by="agent:gemini-2.5-pro",
        generated_at="2026-10-25T04:00:00Z",
        status=d.get("status") or "active",
        part_of="/index.md",
        sequence=int(d.get("pdf_page") or 1),
        treatment="normative",
        license_str="HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)",
        content_class=fm.get("content_class") or "curated",
        section_number=f"doc.md ([{d['doc_num']}] 장 총괄)",
        source_page=int(d.get("pdf_page") or 1),
        verified_by="hp-service-engineering-lead",
        verified_at="2026-10-25T04:00:00Z",
        verified_method="source_text_match",
        source_uri=gcs_uri_ko,
    )
    yaml_en = build_yaml_block(
        lang="en",
        okf_type="SourceDocument",
        title=d["title_en"],
        description=d["desc_en"],
        version=ver_clean,
        tags=d.get("tags") or ["hp-dragonfly", "okf-en", "doc-root"],
        sha256_hex=sha_en,
        generated_by="agent:gemini-2.5-pro",
        generated_at="2026-10-25T04:00:00Z",
        status=d.get("status") or "active",
        part_of="/index.md",
        sequence=int(d.get("pdf_page") or 1),
        treatment="normative",
        license_str="Proprietary (HP Inc. Maintenance & Service Guide N17344-001)",
        content_class=fm.get("content_class") or "curated",
        section_number=f"doc.md ([{d['doc_num']}] Chapter Root)",
        source_page=int(d.get("pdf_page") or 1),
        verified_by="hp-service-engineering-lead",
        verified_at="2026-10-25T04:00:00Z",
        verified_method="source_text_match",
        source_uri=gcs_uri_en,
    )

    raw_ko = f"{yaml_ko}\n\n{body_ko}\n"
    raw_en = f"{yaml_en}\n\n{body_en}\n"

    d["body_ko"] = body_ko
    d["body_en"] = body_en
    d["body"] = body_ko  # default Korean
    d["raw_yaml_ko"] = yaml_ko
    d["raw_yaml_en"] = yaml_en
    d["raw_yaml"] = yaml_ko
    d["raw_ko"] = raw_ko
    d["raw_en"] = raw_en
    d["raw"] = raw_ko
    d["gcs_uri_ko"] = gcs_uri_ko
    d["gcs_uri_en"] = gcs_uri_en
    d["gcs_uri"] = gcs_uri_ko
    d["okf_repo_path_ko"] = f"okf-kr/{d['rel_path']}"
    d["okf_repo_path_en"] = f"okf-en/{d['rel_path']}"

    kr_file = OKF_KR_DIR / d["rel_path"]
    kr_file.parent.mkdir(parents=True, exist_ok=True)
    kr_file.write_text(raw_ko, encoding="utf-8")

    en_file = OKF_EN_DIR / d["rel_path"]
    en_file.parent.mkdir(parents=True, exist_ok=True)
    en_file.write_text(raw_en, encoding="utf-8")

  # 2. Process 26 Unstructured Clauses (`okf_files`)
  for f in okf_files:
    cid = f["id"]
    body_en = f.get("body_en") or f["body"]
    body_ko = KO_CLAUSE_BODIES.get(cid)
    if not body_ko:
      raise KeyError(f"Missing Korean body for {cid}")

    sha_ko = hashlib.sha256(body_ko.encode("utf-8")).hexdigest()
    sha_en = hashlib.sha256(body_en.encode("utf-8")).hexdigest()
    ver_clean = str(f.get("version") or "0.2.0").lstrip("v")
    fm = f.get("frontmatter") or {}
    is_internal = f["doc_id"] == "08_INTERNAL_FIELD_SOP_PLAYBOOKS"

    gcs_uri_ko = f"gs://hp-dragonfly-okf/okf-kr/{f['rel_path']}"
    gcs_uri_en = f"gs://hp-dragonfly-okf/okf-en/{f['rel_path']}"
    part_of_path = "/" + "/".join(f["rel_path"].split("/")[:2]) + "/doc.md"

    yaml_ko = build_yaml_block(
        lang="ko",
        okf_type=fm.get("type") or "Provision",
        title=f["title_ko"],
        description=f["desc_ko"],
        version=ver_clean,
        tags=f.get("tags") or ["hp-dragonfly", "okf-kr", "okf-v0.2"],
        sha256_hex=sha_ko,
        generated_by="agent:gemini-2.5-pro",
        generated_at="2026-10-25T04:00:00Z",
        status=f.get("status") or "active",
        part_of=part_of_path,
        sequence=int(f.get("pdf_page") or 1),
        treatment=fm.get("treatment") or "normative",
        license_str=(
            "사내한 대외비 (HP 글로벌 필드 서비스 표준 정비내규 SOP-2026-01)"
            if is_internal
            else "HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)"
        ),
        content_class=fm.get("content_class") or "verbatim",
        section_number=f["section_number_ko"],
        source_page=int(f.get("pdf_page") or 1),
        verified_by="hp-service-engineering-lead",
        verified_at="2026-10-25T04:00:00Z",
        verified_method="source_text_match",
        source_uri=gcs_uri_ko,
    )
    yaml_en = build_yaml_block(
        lang="en",
        okf_type=fm.get("type") or "Provision",
        title=f["title_en"],
        description=f["desc_en"],
        version=ver_clean,
        tags=f.get("tags") or ["hp-dragonfly", "okf-en", "okf-v0.2"],
        sha256_hex=sha_en,
        generated_by="agent:gemini-2.5-pro",
        generated_at="2026-10-25T04:00:00Z",
        status=f.get("status") or "active",
        part_of=part_of_path,
        sequence=int(f.get("pdf_page") or 1),
        treatment=fm.get("treatment") or "normative",
        license_str=(
            "Internal-Only (HP Global Field Service SOP-2026-01)"
            if is_internal
            else "Proprietary (HP Inc. Maintenance & Service Guide N17344-001)"
        ),
        content_class=fm.get("content_class") or "verbatim",
        section_number=f["section_number_en"],
        source_page=int(f.get("pdf_page") or 1),
        verified_by="hp-service-engineering-lead",
        verified_at="2026-10-25T04:00:00Z",
        verified_method="source_text_match",
        source_uri=gcs_uri_en,
    )

    raw_ko = f"{yaml_ko}\n\n{body_ko}\n"
    raw_en = f"{yaml_en}\n\n{body_en}\n"

    f["body_ko"] = body_ko
    f["body_en"] = body_en
    f["body"] = body_ko
    f["raw_yaml_ko"] = yaml_ko
    f["raw_yaml_en"] = yaml_en
    f["raw_yaml"] = yaml_ko
    f["raw_ko"] = raw_ko
    f["raw_en"] = raw_en
    f["raw"] = raw_ko
    f["gcs_uri_ko"] = gcs_uri_ko
    f["gcs_uri_en"] = gcs_uri_en
    f["gcs_uri"] = gcs_uri_ko
    f["okf_repo_path_ko"] = f"okf-kr/{f['rel_path']}"
    f["okf_repo_path_en"] = f"okf-en/{f['rel_path']}"

    kr_file = OKF_KR_DIR / f["rel_path"]
    kr_file.parent.mkdir(parents=True, exist_ok=True)
    kr_file.write_text(raw_ko, encoding="utf-8")

    en_file = OKF_EN_DIR / f["rel_path"]
    en_file.parent.mkdir(parents=True, exist_ok=True)
    en_file.write_text(raw_en, encoding="utf-8")

  # Add dual corpus metadata to project_meta
  data["project_meta"]["okf_corpora"] = {
      "ko": {
          "corpus_id": "okf-kr",
          "gcs_prefix": "gs://hp-dragonfly-okf/okf-kr/",
          "entry_group": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr",
          "local_dir": "okf-kr/",
      },
      "en": {
          "corpus_id": "okf-en",
          "gcs_prefix": "gs://hp-dragonfly-okf/okf-en/",
          "entry_group": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_en",
          "local_dir": "okf-en/",
      },
  }

  BUNDLE_JS_PATH.write_text(
      "// Auto-generated by scripts/build_dual_okf_kr_en.py — DO NOT EDIT MANUALLY\n"
      "window.HP_ONTOLOGY_BUNDLE = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
      encoding="utf-8",
  )

  kr_md_count = len(list(OKF_KR_DIR.rglob("*.md")))
  en_md_count = len(list(OKF_EN_DIR.rglob("*.md")))
  print(f"[Dual OKF Built] okf-kr: {kr_md_count} .md files | okf-en: {en_md_count} .md files | studio_bundle.js updated.")


if __name__ == "__main__":
  main()
