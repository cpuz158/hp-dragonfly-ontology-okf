# HP Dragonfly Ontology Layer Workspace (`2026-10-25_project-Ontology`)

본 워크스페이스는 **HP Dragonfly G3 / Dragonfly Folio 13.5 G3 및 Dragonfly 시리즈 전체(G1, G2, Max, G3, Folio G3, G4)**의 비정형 매뉴얼(`docs/pdf_6290467_en-US-1.pdf`)과 정형 데이터베이스(`BigQuery`)를 결합하여 **GCP Ontology Layer (OKF + Dataplex Knowledge Catalog + BigQuery Property Graph)**를 구축하기 위한 표준 프로젝트입니다.

---

## 1. 디렉터리 구조

```text
~/Research/2026-10-25_project-Ontology/
├── .venv/                                # Python 가상환경 (google-cloud-bigquery 설치됨)
├── requirements.txt                      # 의존성 패키지 목록
├── README.md                             # 워크스페이스 및 고객사 배포 가이드
├── docs/
│   └── pdf_6290467_en-US-1.pdf           # [비정형 원천] HP Dragonfly Folio 13.5 G3 Maintenance & Service Guide (N17344-001)
├── data/                                 # [정형 시드] 8개 정형 테이블의 로컬 JSONL 익스포트 파일
│   ├── dragonfly_series_models.jsonl
│   ├── product_skus_and_configs.jsonl
│   ├── hardware_components_catalog.jsonl
│   ├── component_disassembly_deps.jsonl
│   ├── ports_sensors_and_docks.jsonl
│   ├── firmware_bios_and_nvm.jsonl
│   ├── diagnostic_codes_reference.jsonl
│   └── community_troubleshooting_cases.jsonl
└── scripts/
    ├── hp_dragonfly_seed_data.py         # 8개 테이블 스키마(컬럼 설명 포함) 및 상세 시드 데이터 모듈
    ├── build_hp_dragonfly_dataset.py     # 고객사 환경 단독 실행용 BigQuery 데이터셋/테이블/그래프 구축 스크립트
    └── create_property_graph.sql         # 자동 생성된 BigQuery Property Graph (GQL) DDL
```

---

## 2. BigQuery 정형 데이터셋 및 8개 테이블 명세

> **참고**: BigQuery 데이터셋 ID 규격상 하이픈(`-`)은 허용되지 않고 영문/숫자/언더스코어(`_`)만 허용되므로, `--dataset-id prj-ontology-hp-dragonfly` 입력 시 물리적 데이터셋 ID는 `prj_ontology_hp_dragonfly`(표시 이름 `friendly_name: prj-ontology-hp-dragonfly`)로 자동 정규화되어 생성됩니다.

| 번호 | 테이블명 | 그래프 역할 | 설명 |
| :---: | :--- | :---: | :--- |
| **1** | `dragonfly_series_models` | `Node (ProductModel)` | HP Dragonfly 시리즈(G1, G2, Max, G3, Folio G3, G4) 세대별 폼팩터, CPU 아키텍처, 화면비(16:9 vs 3:2), 무게/치수, 매뉴얼 문서번호 마스터 |
| **2** | `product_skus_and_configs` | `Node (ProductSKU)` / `Edge` | 권역별(US, KR, EU, APAC) 상용 SKU 구성(CPU, vPro, RAM, SSD, OLED/Sure View 디스플레이, 5G/LTE WWAN, 매핑 메인보드 파트번호) |
| **3** | `hardware_components_catalog` | `Node (HardwareComponent)` | 공식 스페어 파트 카탈로그 (시스템 보드, Gen4 NVMe SSD, 배터리 `M90788-005`, 히트싱크 `N22936-001`, 디스플레이/카메라 서브컴포넌트 등 31종) |
| **4** | `component_disassembly_deps` | `Edge (REQUIRES_REMOVAL_OF)` | 부품 교체 시 선행 분리해야 하는 물리적 작업 순서, 나사 규격(Torx T5, Phillips M2.0x4.0 등), 필수 공구, 파손 주의사항 |
| **5** | `ports_sensors_and_docks` | `Attribute / Compatibility` | 좌·우측 포트(Thunderbolt 4, 3.5mm 오디오, Nano-SIM, 무선 충전 펜 슬롯), 내장 센서(ToF, Hall, IR 열센서), 공식 G4/G5 독 호환성 |
| **6** | `firmware_bios_and_nvm` | `Security / Firmware` | 시스템 BIOS(`U95`), SoftPaq 드라이버(`sp148210`, `sp146831`, `sp149503` 등), 비휘발성 메모리(HP Sure Start 8MB, System BIOS 9MB, Intel ME 7MB, TPM 2.0) |
| **7** | `diagnostic_codes_reference` | `Node (DiagnosticCode)` | 전원/배터리 LED 패턴, Caps Lock 깜빡임 코드(`2.2`, `3.2`, `5.2`), UEFI 24자리 Failure ID, 정전기(ESD 700V) 임계치 기준 |
| **8** | `community_troubleshooting_cases` | `Node (TroubleshootingCase)` / `Edge` | HP Support Community, Reddit, 필드 엔지니어링에서 수집한 고장·문의 증상, 근본 원인(Root Cause), 해결 SoftPaq/파트 번호 및 단계별 조치 이력 |

---

## 3. 고객사 환경에서 직접 데이터셋 구축하기 (실행 방법)

고객사 GCP 환경에서도 아래 명령어만으로 동일한 데이터셋, 8개 정형 테이블(컬럼 설명 메타데이터 포함), 그리고 BigQuery Property Graph(`hp_dragonfly_ontology_graph`)까지 한 번에 생성할 수 있습니다.

```bash
cd ~/Research/2026-10-25_project-Ontology

# 1. 가상환경 생성 및 패키지 설치 (최초 1회)
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# 2. 대상 GCP 프로젝트 및 데이터셋 지정하여 실행
.venv/bin/python scripts/build_hp_dragonfly_dataset.py \
  --project-id hp-dragonfly \
  --dataset-id prj-ontology-hp-dragonfly \
  --location US \
  --create-property-graph
```
