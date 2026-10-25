# HP Dragonfly Ontology Layer Workspace (`2026-10-25_project-Ontology`)

본 워크스페이스는 **HP Dragonfly G3 / Dragonfly Folio 13.5 G3 및 Dragonfly 시리즈 전체(G1, G2, Max, G3, Folio G3, G4)**의 비정형 매뉴얼(`docs/pdf_6290467_en-US-1.pdf`, 109p)과 정형 데이터베이스(`BigQuery`, 100% English)를 결합하여 **GCP Ontology Layer (OKF v0.2 + Metadata as Code Git Repo + `kcmd` + Dataplex Knowledge Catalog + BigQuery Property Graph)**를 구축하는 엔드투엔드 표준 리포지토리입니다.

---

## 1. 전체 아키텍처 및 3단계 파이프라인

1. **Enrichment Agent (`scripts/enrichment_agent.py`)**:
   - 비정형 PDF 매뉴얼(`docs/pdf_6290467_en-US-1.pdf`, Doc Part `N17344-001`)과 BigQuery 8개 정형 테이블(`hp-dragonfly.prj_ontology_hp_dragonfly`)을 읽어 **OKF v0.2 번들(`bundles/hp_dragonfly/`, 28개 마크다운 파일 + `viz.html` 그래프 뷰어)** 및 **Dataplex Overview Aspect(`catalog/`)**를 자동 생성합니다.
2. **Metadata as Code (`git` 버전 관리)**:
   - 생성된 `bundles/hp_dragonfly/`(OKF v0.2), `catalog/`(BigQuery 카탈로그 스냅샷), `catalog.yaml`, `okf_catalog.yaml`을 Git 리포지토리(`main` 브랜치)에서 코드처럼 버전 관리(Diff / Blame / PR)합니다.
3. **`kcmd`를 통한 Dataplex Knowledge Catalog 배포 (`scripts/sync_okf_to_dataplex.py` & `./bin/kcmd`)**:
   - **BigQuery Native Catalog (`scope: bq-dataset.hp-dragonfly.prj_ontology_hp_dragonfly`)**: BigQuery 데이터셋 및 8개 테이블 엔트리에 마크다운 `overview` Aspect를 직접 동기화합니다.
   - **OKF Knowledge Base (`scope: kb.hp-dragonfly.us-central1.okf_hp_dragonfly`)**: 커스텀 EntryType(`okf-bundle`)과 커스텀 AspectType(`okf`)을 통해 28개 OKF 문서와 Provenance/Trust 시그널(`generated`, `verified`, `sources`, `status`, `stale_after`)을 Dataplex Knowledge Catalog에 무손실 배포합니다.

---

## 2. 디렉터리 구조

```text
~/Research/2026-10-25_project-Ontology/
├── .git/                                 # Metadata-as-Code Git 버전 관리 저장소
├── .venv/                                # Python 가상환경 (google-cloud-bigquery, pypdf, reference_agent 등)
├── bin/
│   └── kcmd                              # 컴파일된 공식 Knowledge Catalog Metadata-as-Code CLI (v1.0.0)
├── catalog.yaml                          # BigQuery Dataset Scope 매니페스트 (bq-dataset.hp-dragonfly.prj_ontology_hp_dragonfly)
├── okf_catalog.yaml                      # OKF Bundle EntryGroup Scope 매니페스트 (kb.hp-dragonfly.us-central1.okf_hp_dragonfly)
├── catalog/                              # [Metadata as Code #1] kcmd pull/push용 BigQuery 테이블 YAML 스냅샷
│   ├── hp-dragonfly.prj_ontology_hp_dragonfly.yaml
│   └── hp-dragonfly.prj_ontology_hp_dragonfly/*.yaml
├── bundles/
│   └── hp_dragonfly/                     # [Metadata as Code #2] OKF v0.2 표준 번들 (28개 .md + viz.html)
│       ├── index.md
│       ├── log.md
│       ├── viz.html                      # Cytoscape.js 기반 자체 포함 인터랙티브 지식 그래프 뷰어 (21개 노드, 110개 엣지)
│       ├── datasets/                     # prj_ontology_hp_dragonfly.md
│       ├── tables/                       # 8개 BigQuery 정형 테이블 OKF 문서
│       ├── references/                   # PDF 서비스 매뉴얼(N17344-001)에서 추출한 5개 핵심 엔지니어링 레퍼런스
│       ├── metrics/                      # 2개 서비스성/부품교체율 핵심 지표 (Metric)
│       ├── computations/                 # 2개 공인 SQL/GQL 쿼리 (Attested Computation)
│       └── playbooks/                    # 2개 현장 엔지니어/AI 에이전트 장애 조치 플레이북 (Playbook)
├── docs/
│   └── pdf_6290467_en-US-1.pdf           # [비정형 원천] HP Dragonfly Folio 13.5 G3 Maintenance & Service Guide (N17344-001)
├── data/                                 # [정형 시드] 8개 정형 테이블의 100% 영문 로컬 JSONL 파일
└── scripts/
    ├── hp_dragonfly_seed_data.py         # 8개 정형 테이블 영문 스키마 및 시드 데이터 (109 rows)
    ├── build_hp_dragonfly_dataset.py     # BigQuery 데이터셋/테이블/Property Graph 생성 스크립트
    ├── create_property_graph.sql         # BigQuery Property Graph (GQL) DDL
    ├── enrichment_agent.py               # PDF + BigQuery 결합 OKF v0.2 & Catalog Overview 생성 에이전트
    ├── okf-aspect.json                   # Dataplex 커스텀 AspectType (`okf`) 템플릿
    └── sync_okf_to_dataplex.py           # kcmd 기반 Dataplex Knowledge Catalog 양방향 배포/검증 스크립트
```

---

## 3. 고객사 환경에서 전체 파이프라인 재현하기

```bash
cd ~/Research/2026-10-25_project-Ontology

# Step 1. BigQuery 영문 정형 데이터셋(8개 테이블) 및 Property Graph 구축
.venv/bin/python scripts/build_hp_dragonfly_dataset.py \
  --project-id hp-dragonfly \
  --dataset-id prj-ontology-hp-dragonfly \
  --location US \
  --create-property-graph

# Step 2. Enrichment Agent 실행 (PDF + BigQuery -> OKF v0.2 번들 & Catalog 스냅샷 생성)
.venv/bin/python scripts/enrichment_agent.py \
  --project-id hp-dragonfly \
  --dataset-id prj_ontology_hp_dragonfly

# Step 3. kcmd를 사용하여 Dataplex Knowledge Catalog로 배포 및 Round-Trip 검증
.venv/bin/python scripts/sync_okf_to_dataplex.py \
  --project hp-dragonfly \
  --location us-central1 \
  --entry-group okf_hp_dragonfly \
  --action all
```
