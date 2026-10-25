# HP Dragonfly Ontology Layer — OKF v0.2, Metadata-as-Code (`kcmd`), BigQuery Property Graph & Google ADK (`gemini-3.8-flash`)

- **GitHub Repository**: [https://github.com/cpuz158/hp-dragonfly-ontology-okf](https://github.com/cpuz158/hp-dragonfly-ontology-okf)
- **GCP Project**: `hp-dragonfly` (`us-central1` / `US`)
- **BigQuery Property Graph**: `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph` (11 Node/Lexical Tables · 13 Edge Labels)
- **Dataplex Knowledge Catalog EntryGroups**:
  - `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly`
  - `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr` (`gs://hp-dragonfly-okf/okf-kr/`)
  - `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_en` (`gs://hp-dragonfly-okf/okf-en/`)
- **LLM & Agent Framework**: **Google ADK (`google-adk`)** + **Vertex AI `gemini-3.8-flash`** (`location="global"`)

---

## 1. 아키텍처 및 4단계 엔드투엔드 파이프라인

1. **PDF 기반 한·영 이중화 OKF v0.2 청킹 및 Enrichment (`scripts/regenerate_pdf_okf_with_gemini38.py` & `scripts/enrichment_agent.py`)**:
   - 실제 원천 PDF(`docs/pdf_6290467_en-US-1.pdf`, Doc Part `N17344-001`, 109 PDF pages, Chapters 1–12)의 정확한 파일 페이지(`pdf_page = doc_page + 6`) 텍스트를 추출하여 Vertex AI **`gemini-3.8-flash`** 모델로 8개 챕터 루트(`doc.md`)와 26개 세부 조항(`okf-kr/` 34개 파일, `okf-en/` 34개 파일) 및 `bundles/hp_dragonfly/`(35개 OKF 파일 + `viz.html`)를 생성합니다.
2. **Metadata as Code (Git 버전 관리)**:
   - 생성된 `okf-kr/`, `okf-en/`, `bundles/hp_dragonfly/`, `catalog/`, `catalog.yaml`, `okf_catalog.yaml`을 Git 리포지토리([cpuz158/hp-dragonfly-ontology-okf](https://github.com/cpuz158/hp-dragonfly-ontology-okf))에서 코드로 버전 관리합니다.
3. **`kcmd`를 통한 Dataplex Knowledge Catalog 동기화 (`scripts/sync_okf_to_dataplex.py` & `./bin/kcmd`)**:
   - **BigQuery Native Catalog (`scope: bq-dataset.hp-dragonfly.prj_ontology_hp_dragonfly`)**: BigQuery 데이터셋 및 정형/렉시컬 테이블에 `dataplex-types.global.overview` Aspect를 배포합니다.
   - **OKF Knowledge Base (`okf_hp_dragonfly`, `okf_hp_dragonfly_kr`, `okf_hp_dragonfly_en`)**: 커스텀 EntryType(`okf-bundle`)과 커스텀 AspectType(`okf`)을 통해 Provenance/Trust 시그널(`generated`, `verified`, `sources`, `status`, `stale_after`)을 Dataplex Knowledge Catalog에 무손실 배포합니다.
4. **Google ADK (`gemini-3.8-flash`) 기반 RAG Agent vs. Ontology Graph Agent 라이브 비교 (`agents/adk_rag_vs_graph/` & `scripts/adk_live_runner.py`)**:
   - **Arm A (`hp_dragonfly_vector_rag_agent`)**: `LlmAgent(model="gemini-3.8-flash")` + `vertex_rag_search` + 단발성 `execute_sql` (EQ01~EQ14 정확도: **3 / 14, 21.4%**).
   - **Arm B (`hp_dragonfly_ontology_graph_agent`)**: `LlmAgent(model="gemini-3.8-flash")` + `before_agent_callback` + `graph_query_gql` (BigQuery Property Graph) + `kc_lookup_aspect` (Dataplex KC 거버넌스 게이트) + `fetch_okf_provision` (EQ01~EQ14 정확도: **14 / 14, 100.0%**).

---

## 2. 실제 PDF(`N17344-001`, 109p) 챕터 및 페이지 매핑 (`okf-kr/` & `okf-en/`)

| 그룹 번호 | 챕터 루트 (`doc.md`) | 실제 PDF 파일 페이지 (`#page=N`) | 원문 매뉴얼 페이지 | 하위 조항 수 |
| :--- | :--- | :--- | :--- | :--- |
| **`[01]`** | `manuals/01_ch1_product_specs/doc.md` (제1장 제품 사양 및 시스템 아키텍처) | **pp. 7–10** | Chapter 1 (pp. 1–4) | 3개 (`§1.1`~`§1.3`) |
| **`[02]`** | `manuals/02_ch2_external_components/doc.md` (제2장 시스템 외관 구성요소 및 포트·라벨) | **pp. 11–21** | Chapter 2 (pp. 5–15) | 4개 (`§2.1`~`§2.4`) |
| **`[03]`** | `manuals/03_ch3_spare_parts_catalog/doc.md` (제3장 주요 교체 부품 카탈로그, FRU) | **pp. 22–30** | Chapter 3 (pp. 16–24) | 3개 (`별표 3-1`, `보드`, `별표 3-2`) |
| **`[04]`** | `manuals/04_ch5_preliminary_safety/doc.md` (제4장 분해 전 준비 및 정전기·배터리 예방 수칙) | **pp. 31–38** | Chapter 4 (pp. 25–32) | 3개 (`§4.1`~`§4.3`) |
| **`[05]`** | `manuals/05_ch5_base_battery_storage/doc.md` (제5장 Part A 하판·배터리·WWAN·SSD 분해) | **pp. 39–49** | Chapter 5 Part A (pp. 33–43) | 4개 (`§5.1`~`§5.4`) |
| **`[06]`** | `manuals/06_ch5_thermal_sysboard_display/doc.md` (제5장 Part B 방열판·시스템 보드·OLED 분해 DAG) | **pp. 50–82** | Chapter 5 Part B (pp. 44–76) | 3개 (`§5.10`, `§5.13`, `§5.14`) |
| **`[07]`** | `manuals/07_ch6_7_bios_and_blink_codes/doc.md` (제6~8장 Computer Setup(BIOS)·진단·백업) | **pp. 83–94** | Chapters 6–8 (pp. 77–88) | 3개 (`§6.1`, `§7.1`, `§7.2`) |
| **`[08]`** | `internal_policies/08_hp_field_service_sop/doc.md` (제9~12장 전력·정전기(ESD)·서비스 및 지원) | **pp. 95–106** | Chapters 9–12 (pp. 89–100) | 3개 (`§9.1`, `§10.1`, `§11.1`) |

---

## 3. 재현 및 실행 명령어

```bash
cd ~/Research/2026-10-25_project-Ontology

# 1. PDF 원문 기반 한·영 OKF (okf-kr / okf-en) 재생성 (Vertex AI gemini-3.8-flash)
GOOGLE_API_USE_CLIENT_CERTIFICATE=false .venv/bin/python scripts/regenerate_pdf_okf_with_gemini38.py

# 2. Enrichment Agent 실행 (bundles/hp_dragonfly & catalog 스냅샷 생성)
GOOGLE_API_USE_CLIENT_CERTIFICATE=false .venv/bin/python scripts/enrichment_agent.py

# 3. kcmd 기반 Dataplex Knowledge Catalog 배포 (BigQuery + okf_hp_dragonfly + okf_hp_dragonfly_kr/en)
GOOGLE_API_USE_CLIENT_CERTIFICATE=false .venv/bin/python scripts/sync_okf_to_dataplex.py --action all
GOOGLE_API_USE_CLIENT_CERTIFICATE=false .venv/bin/python scripts/sync_okf_to_dataplex.py --action push-okf --bundle-dir okf-kr --entry-group okf_hp_dragonfly_kr
GOOGLE_API_USE_CLIENT_CERTIFICATE=false .venv/bin/python scripts/sync_okf_to_dataplex.py --action push-okf --bundle-dir okf-en --entry-group okf_hp_dragonfly_en

# 4. 웹 스튜디오 서버 실행 (Port 8765, Google ADK gemini-3.8-flash 라이브 연동)
GOOGLE_API_USE_CLIENT_CERTIFICATE=false .venv/bin/python scripts/studio_server.py --port 8765
```
