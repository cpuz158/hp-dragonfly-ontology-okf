/**
 * HP Dragonfly Ontology Studio — Bilingual (KO / EN) Internationalization Catalog
 * Complies with Google i18n guidelines: externalized message dictionary, no hardcoded
 * date/number string concatenation, uses Intl.DateTimeFormat & Intl.NumberFormat.
 */
window.STUDIO_I18N = {
  ko: {
    app_title: "HP Dragonfly 온톨로지 & OKF v0.2 스튜디오",
    header_badge: "OKF v0.2 · 영문 데이터셋 (KO/EN UI)",
    project_label: "hp-dragonfly · prj-ontology-hp-dragonfly",
    theme_toggle_tip: "라이트 / 다크 테마 전환",
    lang_ko_label: "🇰🇷 한국어 버전",
    lang_en_label: "🇺🇸 English Version",

    // Left Rail & Module Titles
    rail_01: "01 · 아키텍처 및 파이프라인 개요 (Intro)",
    rail_02: "02 · OKF 검증 (PDF ↔ OKF 1:1 비교 및 지식 그래프)",
    rail_03: "03 · OKF & kcmd 관리 (Metadata as Code & Dataplex)",
    rail_04: "04 · BigQuery 정형 테이블 & Property Graph GQL",
    rail_05: "05 · 온톨로지 에이전트 & 벤치마크 (다음 단계 로드맵)",

    mod01_title: "01 · HP Dragonfly 온톨로지 레이어 아키텍처 & 파이프라인",
    mod01_sub_arch: "3-Plane 아키텍처 & 구축 현황",
    mod01_sub_flow: "Enrichment Agent → Git → kcmd 파이프라인",

    mod02_title: "02 · OKF v0.2 시맨틱 검증 (원본 PDF ↔ OKF 1:1 대조 & 그래프)",
    mod02_sub_split: "PDF 매뉴얼 ↔ OKF 1:1 분할 검증",
    mod02_sub_graph: "OKF 컨셉 지식 그래프 (21 Nodes · 110 Edges)",
    mod02_sub_viz: "OKF 공식 Cytoscape 뷰어 (viz.html)",

    mod03_title: "03 · Metadata as Code (Git 버전 관리 & Dataplex kcmd 동기화)",
    mod03_sub_kcmd: "Dataplex Knowledge Catalog & kcmd 스냅샷",
    mod03_sub_git: "Git 리포지토리 커밋 히스토리 (Metadata as Code)",

    mod04_title: "04 · BigQuery 영문 정형 데이터셋 (8 Tables) & Property Graph (GQL)",
    mod04_sub_tables: "8개 영문 정형 테이블 & 3D 2-Layer 온톨로지",
    mod04_sub_gql: "BigQuery Property Graph (GQL) 인터랙티브 탐색기",

    mod05_title: "05 · 다음 단계 로드맵: 하이브리드 온톨로지 에이전트 & RAG vs Graph 벤치마크",
    mod05_sub_roadmap: "Phase 5~6 구축 로드맵 프리뷰",

    // Module 01 Content
    hero_badge: "Google Cloud 엔터프라이즈 온톨로지 레퍼런스 · HP Dragonfly G3 / Folio G3",
    hero_heading: "비정형 PDF 서비스 매뉴얼과 BigQuery 정형 테이블을 결합한 GCP 온톨로지 레이어",
    hero_desc:
      "실제 엔지니어링 매뉴얼(HP Dragonfly Folio 13.5 G3 Maintenance & Service Guide, N17344-001, 109p)과 BigQuery 영문 정형 데이터셋(8개 테이블, 109행, Property Graph)을 Enrichment Agent로 통합하여 Open Knowledge Format(OKF v0.2)을 생성하고, Git 기반 Metadata-as-Code 버전 관리 및 kcmd CLI를 통해 Dataplex Knowledge Catalog까지 연결한 엔드투엔드 온톨로지 워크스페이스입니다.",

    kpi_tables_label: "BigQuery 영문 정형 테이블",
    kpi_tables_sub: "Node 5개 · Edge 5개 (총 109행, 100% 영문)",
    kpi_okf_label: "OKF v0.2 마크다운 파일",
    kpi_okf_sub: "bundles/hp_dragonfly/ (Git 버전 관리)",
    kpi_graph_label: "OKF 시맨틱 컨셉 & 엣지",
    kpi_graph_sub: "21개 컨셉 노드 · 110개 교차 참조 엣지",
    kpi_dataplex_label: "Dataplex 카탈로그 엔트리",
    kpi_dataplex_sub: "bq-dataset (9) + okf_hp_dragonfly (28)",
    kpi_pdf_label: "비정형 원본 PDF 매뉴얼",
    kpi_pdf_sub: "Doc Part N17344-001 (109 Pages 매핑)",

    plane1_tag: "PLANE 1 · 정형 및 비정형 원천 데이터 계층",
    plane1_title: "BigQuery 정형 테이블 + HP 서비스 매뉴얼 PDF",
    plane1_body:
      "• 정형 데이터: `hp-dragonfly.prj_ontology_hp_dragonfly` 데이터셋 내 8개 영문 테이블(제품 모델, SKU, 스페어 파트 FRU, 분해 선행 조건 DAG, 포트/독, 펌웨어/NVM, 진단 점멸 코드, 현장 트러블슈팅 사례) 및 `hp_dragonfly_ontology_graph` Property Graph.\n• 비정형 데이터: `pdf_6290467_en-US-1.pdf` (109페이지 하드웨어 분해·조립·점멸 코드 서비스 가이드).",

    plane2_tag: "PLANE 2 · 시맨틱 강화 및 코드형 메타데이터 계층",
    plane2_title: "Enrichment Agent + OKF v0.2 + Git (Metadata as Code)",
    plane2_body:
      "• Enrichment Agent (`scripts/enrichment_agent.py`): PDF 매뉴얼의 챕터/페이지 문맥과 BigQuery 스키마·외래키를 결합하여 28개 OKF v0.2 파일(`datasets/`, `tables/`, `references/`, `metrics/`, `computations/`, `playbooks/`) 자동 생성.\n• Metadata as Code: Git 리포지토리(`main` 브랜치)에서 YAML Frontmatter(`generated`, `verified`, `sources`, `trust_tier`)와 마크다운 문서를 코드처럼 버전 관리.",

    plane3_tag: "PLANE 3 · 거버넌스 배포 및 그래프 추론 계층",
    plane3_title: "kcmd CLI → Dataplex Knowledge Catalog & GQL 추론",
    plane3_body:
      "• `kcmd` v1.0.0 (`./bin/kcmd`): 로컬 Git의 OKF 번들과 Overview Aspect를 Dataplex Knowledge Catalog(`okf_hp_dragonfly` EntryGroup 및 `bq-dataset` 스코프)로 양방향 Push / Pull 동기화.\n• 에이전트 및 분석가 활용: BigQuery GQL 멀티홉 그래프 탐색과 OKF Playbook/Computation을 결합하여 할루시네이션 없는 하드웨어 진단 수행.",

    step_table_heading: "지금까지 완료된 온톨로지 구축 단계 요약 (Step 1 ~ Step 4)",
    col_stage: "구축 단계",
    col_component: "핵심 컴포넌트 및 스크립트",
    col_target: "생성된 GCP / 워크스페이스 리소스",
    col_status: "상태",

    // Module 02 Content
    mod02_tree_header: "OKF v0.2 번들 파일 트리 (28 Files)",
    mod02_pdf_header: "비정형 원천 PDF 매뉴얼 (N17344-001)",
    mod02_okf_header: "OKF v0.2 Frontmatter & 영문 시맨틱 명세",
    mod02_open_pdf_tab: "새 탭에서 PDF 열기",
    mod02_view_rendered: "렌더링 뷰",
    mod02_view_raw: "원문 YAML + Markdown",
    mod02_fm_title: "OKF v0.2 거버넌스 메타데이터 (YAML Frontmatter)",
    mod02_sources_title: "근거 출처 및 계보 (Lineage Sources)",
    mod02_graph_heading: "OKF v0.2 시맨틱 지식 그래프 (21 Concepts · 110 Edges)",
    mod02_graph_desc: "노드를 클릭하면 우측 패널에서 해당 컨셉의 영문 OKF 정의서, 신뢰 등급(Trust Tier), 그리고 연결된 상·하위 컨셉 및 원본 PDF 페이지를 즉시 확인할 수 있습니다.",
    mod02_filter_all: "전체 컨셉 (21)",

    // Module 03 Content
    mod03_kcmd_heading: "kcmd (Knowledge Catalog Metadata Driver) & Dataplex 동기화 현황",
    mod03_kcmd_desc:
      "Enrichment Agent가 생성하고 Git으로 버전 관리되는 로컬 YAML 파일(`catalog/` 및 `catalog_okf/`)을 `./bin/kcmd` 바이너리를 통해 GCP Dataplex Knowledge Catalog(`hp-dragonfly`)로 배포한 실제 스냅샷입니다.",
    mod03_scope1_title: "스코프 1: BigQuery 데이터셋 & 8개 테이블 Overview Aspect",
    mod03_scope2_title: "스코프 2: 커스텀 OKF v0.2 번들 EntryGroup (okf_hp_dragonfly)",
    mod03_yaml_viewer_title: "Metadata-as-Code YAML 스냅샷 파일 인스펙터",
    mod03_git_heading: "Git 버전 관리 이력 (Metadata as Code Commits)",
    mod03_git_desc: "메타데이터와 온톨로지 정의서의 모든 변경 사항이 Git 커밋 해시와 작성자·검증자 이력으로 추적됩니다.",

    // Module 04 Content
    mod04_3d_title: "2-Layer 하이브리드 온톨로지 3D 토폴로지 (Three.js)",
    mod04_3d_desc: "상단 레이어(청색/보라색)는 BigQuery 정형 테이블(Node/Edge 클래스)을, 하단 레이어(녹색)는 비정형 PDF 매뉴얼에서 추출한 OKF Reference 문서를 나타내며, 수직 엣지는 정형-비정형 시맨틱 연결을 시각화합니다.",
    mod04_reset_cam: "카메라 초기화",
    mod04_toggle_spin: "자동 회전 토글",
    mod04_table_browser_title: "BigQuery 영문 정형 테이블 브라우저 (8 Tables · 109 Rows)",
    mod04_schema_tab: "테이블 데이터 (영문 행)",
    mod04_cols_tab: "컬럼 스키마 명세",
    mod04_gql_presets_title: "사전 검증된 BigQuery Property Graph (GQL) 쿼리 라이브러리",
    mod04_gql_editor_title: "GQL / SQL 쿼리 에디터 (`hp_dragonfly_ontology_graph`)",
    mod04_run_gql_btn: "▶ GQL 쿼리 실행 (Live BigQuery API)",
    mod04_running_btn: "실행 중...",
    mod04_gql_graph_title: "GQL 멀티홉 서브그래프 시각화",
    mod04_gql_result_title: "쿼리 실행 결과 테이블 (영문 데이터)",

    // Module 05 Roadmap Content
    mod05_banner_title: "다음 단계 구축 예고 (Phase 5 & Phase 6)",
    mod05_banner_desc:
      "지금까지 구축한 ① BigQuery 정형 테이블 & Property Graph, ② OKF v0.2 시맨틱 번들, ③ Git Metadata-as-Code, ④ Dataplex Knowledge Catalog(`kcmd`) 위에서 다음 단계로 확장할 수 있는 두 가지 핵심 모듈입니다.",
    mod05_card1_title: "05 · Hybrid Ontology Agent (Gemini + GQL + OKF Playbooks)",
    mod05_card1_desc:
      "사용자가 자연어(한국어 또는 영어)로 고장 증상이나 부품 교체를 질문하면, 에이전트가 Dataplex/OKF 인덱스를 먼저 탐색(Progressive Disclosure)하여 검증된 Playbook과 GQL 쿼리를 호출하고 정확한 스페어 파트 번호(예: M90788-005)와 분해 순서를 답변합니다.",
    mod05_card2_title: "06 · Standard Vector RAG vs. Ontology Graph RAG 벤치마크 스튜디오",
    mod05_card2_desc:
      "단순 PDF 청크 벡터 검색(Vector RAG)이 범하기 쉬운 멀티홉 분해 순서 누락·시스템 보드 파트 번호 혼동 문제를, BigQuery Property Graph(GQL) + OKF v0.2 하이브리드 아키텍처와 정량 비교(정확도·근거 추적성·지연 시간)하는 벤치마크 모듈입니다."
  },

  en: {
    app_title: "HP Dragonfly Ontology & OKF v0.2 Studio",
    header_badge: "OKF v0.2 · English Dataset (KO/EN UI)",
    project_label: "hp-dragonfly · prj-ontology-hp-dragonfly",
    theme_toggle_tip: "Toggle Light / Dark Theme",
    lang_ko_label: "🇰🇷 한국어 버전",
    lang_en_label: "🇺🇸 English Version",

    // Left Rail & Module Titles
    rail_01: "01 · Architecture & Pipeline Overview (Intro)",
    rail_02: "02 · OKF Validation (PDF ↔ OKF 1:1 Compare & Knowledge Graph)",
    rail_03: "03 · OKF & kcmd Management (Metadata as Code & Dataplex)",
    rail_04: "04 · BigQuery Structured Tables & Property Graph GQL",
    rail_05: "05 · Ontology Agent & Benchmark (Next Phase Roadmap)",

    mod01_title: "01 · HP Dragonfly Ontology Layer Architecture & Pipeline",
    mod01_sub_arch: "3-Plane Architecture & Build Status",
    mod01_sub_flow: "Enrichment Agent → Git → kcmd Pipeline",

    mod02_title: "02 · OKF v0.2 Semantic Validation (Source PDF ↔ OKF 1:1 & Graph)",
    mod02_sub_split: "PDF Manual ↔ OKF 1:1 Split Compare",
    mod02_sub_graph: "OKF Concept Knowledge Graph (21 Nodes · 110 Edges)",
    mod02_sub_viz: "Official OKF Cytoscape Viewer (viz.html)",

    mod03_title: "03 · Metadata as Code (Git Version Control & Dataplex kcmd Sync)",
    mod03_sub_kcmd: "Dataplex Knowledge Catalog & kcmd Snapshots",
    mod03_sub_git: "Git Repository Commit History (Metadata as Code)",

    mod04_title: "04 · BigQuery Structured Dataset (8 Tables) & Property Graph (GQL)",
    mod04_sub_tables: "8 Structured Tables & 3D 2-Layer Ontology",
    mod04_sub_gql: "BigQuery Property Graph (GQL) Interactive Explorer",

    mod05_title: "05 · Next Phase Roadmap: Hybrid Ontology Agent & RAG vs Graph Benchmark",
    mod05_sub_roadmap: "Phase 5~6 Build Roadmap Preview",

    // Module 01 Content
    hero_badge: "Google Cloud Enterprise Ontology Reference · HP Dragonfly G3 / Folio G3",
    hero_heading: "GCP Ontology Layer Unifying Unstructured Service Manuals & BigQuery Property Graphs",
    hero_desc:
      "An end-to-end Enterprise Ontology workspace uniting the authoritative HP Dragonfly Folio 13.5 G3 Maintenance & Service Guide PDF (Doc Part N17344-001, 109 pages) with an 8-table English BigQuery dataset (109 rows + Property Graph). Powered by an Enrichment Agent generating Open Knowledge Format (OKF v0.2), versioned via Git Metadata-as-Code, and synchronized to Dataplex Knowledge Catalog via the kcmd CLI.",

    kpi_tables_label: "BigQuery Structured Tables",
    kpi_tables_sub: "5 Node · 5 Edge Classes (109 English rows)",
    kpi_okf_label: "OKF v0.2 Markdown Files",
    kpi_okf_sub: "bundles/hp_dragonfly/ (Git versioned)",
    kpi_graph_label: "OKF Semantic Concepts & Edges",
    kpi_graph_sub: "21 Concept Nodes · 110 Cross-Links",
    kpi_dataplex_label: "Dataplex Catalog Entries",
    kpi_dataplex_sub: "bq-dataset (9) + okf_hp_dragonfly (28)",
    kpi_pdf_label: "Unstructured Source PDF Manual",
    kpi_pdf_sub: "Doc Part N17344-001 (109 Pages Mapped)",

    plane1_tag: "PLANE 1 · STRUCTURED & UNSTRUCTURED SOURCE DATA",
    plane1_title: "BigQuery Structured Tables + HP Service Manual PDF",
    plane1_body:
      "• Structured Data: 8 English tables in `hp-dragonfly.prj_ontology_hp_dragonfly` (Product Models, SKUs, Spare Parts FRU Catalog, Disassembly Precedence DAG, Ports/Docks, Firmware/NVM, Diagnostic Blink Codes, Community Troubleshooting Cases) + `hp_dragonfly_ontology_graph`.\n• Unstructured Data: `pdf_6290467_en-US-1.pdf` (109-page official hardware service manual).",

    plane2_tag: "PLANE 2 · SEMANTIC ENRICHMENT & METADATA AS CODE",
    plane2_title: "Enrichment Agent + OKF v0.2 + Git Repository",
    plane2_body:
      "• Enrichment Agent (`scripts/enrichment_agent.py`): Combines PDF chapter/page citations with BigQuery schemas & foreign keys to synthesize 28 OKF v0.2 files (`datasets/`, `tables/`, `references/`, `metrics/`, `computations/`, `playbooks/`).\n• Metadata as Code: Tracks YAML Frontmatter (`generated`, `verified`, `sources`, `trust_tier`) and markdown definitions in Git (`main` branch).",

    plane3_tag: "PLANE 3 · GOVERNANCE DEPLOYMENT & GRAPH REASONING",
    plane3_title: "kcmd CLI → Dataplex Knowledge Catalog & GQL Reasoning",
    plane3_body:
      "• `kcmd` v1.0.0 (`./bin/kcmd`): Bi-directionally pushes and pulls local Git OKF bundles and Overview Aspects to Dataplex Knowledge Catalog (`okf_hp_dragonfly` EntryGroup & `bq-dataset` scope).\n• Agent & Analyst Consumption: Pairs BigQuery GQL multi-hop traversal with OKF Playbooks & Attested Computations for zero-hallucination hardware triage.",

    step_table_heading: "Summary of Completed Ontology Build Stages (Step 1 ~ Step 4)",
    col_stage: "Build Stage",
    col_component: "Core Component & Script",
    col_target: "Provisioned GCP / Workspace Resource",
    col_status: "Status",

    // Module 02 Content
    mod02_tree_header: "OKF v0.2 Bundle File Tree (28 Files)",
    mod02_pdf_header: "Unstructured Source PDF Manual (N17344-001)",
    mod02_okf_header: "OKF v0.2 Frontmatter & English Semantic Spec",
    mod02_open_pdf_tab: "Open PDF in New Tab",
    mod02_view_rendered: "Rendered View",
    mod02_view_raw: "Raw YAML + Markdown",
    mod02_fm_title: "OKF v0.2 Governance Metadata (YAML Frontmatter)",
    mod02_sources_title: "Lineage & Authoritative Sources",
    mod02_graph_heading: "OKF v0.2 Semantic Knowledge Graph (21 Concepts · 110 Edges)",
    mod02_graph_desc: "Click any concept node to inspect its English OKF specification, Trust Tier, provenance timestamps, and linked upstream/downstream concepts alongside its source PDF manual page.",
    mod02_filter_all: "All Concepts (21)",

    // Module 03 Content
    mod03_kcmd_heading: "kcmd (Knowledge Catalog Metadata Driver) & Dataplex Sync Status",
    mod03_kcmd_desc:
      "Live Metadata-as-Code YAML snapshots (`catalog/` and `catalog_okf/`) generated by the Enrichment Agent, versioned in Git, and pushed to GCP Dataplex Knowledge Catalog (`hp-dragonfly`) via `./bin/kcmd`.",
    mod03_scope1_title: "Scope 1: BigQuery Dataset & 8 Table Overview Aspects",
    mod03_scope2_title: "Scope 2: Custom OKF v0.2 Bundle EntryGroup (okf_hp_dragonfly)",
    mod03_yaml_viewer_title: "Metadata-as-Code YAML Snapshot File Inspector",
    mod03_git_heading: "Git Version Control History (Metadata as Code Commits)",
    mod03_git_desc: "Every update to the ontology schema, OKF bundle, and Dataplex catalog aspects is versioned in Git with full commit provenance.",

    // Module 04 Content
    mod04_3d_title: "2-Layer Hybrid Ontology 3D Topology (Three.js)",
    mod04_3d_desc: "The Upper Layer (Blue/Purple) represents structured BigQuery tables (Node/Edge classes), while the Lower Layer (Green) represents unstructured PDF Reference documents linked via vertical semantic provenance edges.",
    mod04_reset_cam: "Reset Camera",
    mod04_toggle_spin: "Toggle Auto-Rotate",
    mod04_table_browser_title: "BigQuery English Structured Table Browser (8 Tables · 109 Rows)",
    mod04_schema_tab: "Table Rows (English Data)",
    mod04_cols_tab: "Column Schema Spec",
    mod04_gql_presets_title: "Curated BigQuery Property Graph (GQL) Query Library",
    mod04_gql_editor_title: "GQL / SQL Query Editor (`hp_dragonfly_ontology_graph`)",
    mod04_run_gql_btn: "▶ Run GQL Query (Live BigQuery API)",
    mod04_running_btn: "Running...",
    mod04_gql_graph_title: "GQL Multi-Hop Subgraph Visualization",
    mod04_gql_result_title: "Query Execution Result Table (English Data)",

    // Module 05 Roadmap Content
    mod05_banner_title: "Upcoming Build Phases (Phase 5 & Phase 6 Preview)",
    mod05_banner_desc:
      "Built atop our completed foundation — (1) BigQuery Structured Tables & Property Graph, (2) OKF v0.2 Semantic Bundle, (3) Git Metadata-as-Code, and (4) Dataplex Knowledge Catalog (`kcmd`) — these two modules represent the next interactive expansion stages:",
    mod05_card1_title: "05 · Hybrid Ontology Agent (Gemini + GQL + OKF Playbooks)",
    mod05_card1_desc:
      "Answers natural-language support queries (in Korean or English) by progressively traversing the OKF index (`index.md` -> `playbooks/` -> `computations/`), executing attested BigQuery GQL queries, and returning exact spare part numbers (e.g., M90788-005) and ordered removal steps.",
    mod05_card2_title: "06 · Standard Vector RAG vs. Ontology Graph RAG Benchmark Studio",
    mod05_card2_desc:
      "Quantitatively benchmarks naive PDF chunk Vector RAG against our BigQuery Property Graph (GQL) + OKF v0.2 Hybrid Ontology across multi-hop disassembly ordering, SKU-to-System-Board resolution accuracy, and citation groundedness."
  }
};

/**
 * Locale-aware number & date formatting helpers (per Google i18n skill)
 */
window.StudioFormat = {
  number(val, lang) {
    const locale = lang === "ko" ? "ko-KR" : "en-US";
    return new Intl.NumberFormat(locale).format(val);
  },
  currencyUSD(val, lang) {
    const locale = lang === "ko" ? "ko-KR" : "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  },
  dateTime(isoStr, lang) {
    if (!isoStr) return "-";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const locale = lang === "ko" ? "ko-KR" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  }
};
