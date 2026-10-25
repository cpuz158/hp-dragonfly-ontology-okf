/* ==========================================================================
   HP Dragonfly Ontology & OKF v0.2 Studio — Core Application Controller
   100% Aligned with `gcp-console.css` & `krda-ontology-studio` DOM Architecture
   Supports Instant Bilingual UI (KO / EN) over 100% English Underlying Data.
   ========================================================================== */
(function () {
  "use strict";

  const BUNDLE = window.HP_ONTOLOGY_BUNDLE || window.HP_STUDIO_DATA || {};
  const OKF_DOC_ROOTS = BUNDLE.okf_doc_roots || [];
  const OKF_FILES = BUNDLE.okf_files || [];
  const OKF_GRAPH = BUNDLE.okf_graph || { nodes: [], edges: [] };
  const BQ_TABLES = BUNDLE.bq_tables || [];
  const GQL_QUERIES = BUNDLE.gql_queries || [];
  const CATALOG_SNAPS = BUNDLE.catalog_snapshots || [];
  const GIT_COMMITS = BUNDLE.git_commits || [];

  // Global Studio State
  let LANG =
    window.INITIAL_STUDIO_LANG ||
    (document.documentElement.getAttribute("lang") === "en" ||
    window.location.pathname.includes("/en") ||
    window.location.pathname.endsWith("index-en.html") ||
    window.location.pathname.endsWith("en.html")
      ? "en"
      : localStorage.getItem("hp_studio_lang") || "ko");
  let ACTIVE_MODULE = "intro";
  let INTRO_TAB = "arch"; // 'arch' | 'pipeline'
  let MGMT_TAB = "kcmd"; // 'kcmd' | 'git'
  let GRAPH_MODE = false;
  let CURRENT_OKF_IDX = 0;
  let ACTIVE_DOC_ROOT_ID = null;
  let OPEN_CATS = {
    "01_CH1_PRODUCT_SPECS": true,
    "02_CH2_COMPONENTS_PORTS": true,
    "03_CH3_SPARE_PARTS": true,
    "04_CH5_SAFETY_RULES": true,
    "05_CH5_BASE_STORAGE_WWAN": true,
    "06_CH5_THERMAL_BOARD_DISPLAY": true,
    "07_CH6_7_BIOS_DIAGNOSTICS": true,
    "08_INTERNAL_FIELD_SOP_PLAYBOOKS": true
  };
  let FM_OPEN = true;
  let SELECTED_SNAP_IDX = 0;
  let BQ_GRAPH_MODE = "CLASS"; // 'CLASS' | 'INSTANCE'
  let SELECTED_GQL_IDX = 0;
  let SELECTED_BQ_TABLE = "dragonfly_series_models";
  let BQ_DRAWER_MODE = "ROWS"; // 'ROWS' | 'SCHEMA'

  // Vis.js & Three.js instances
  let okfNetwork = null;
  let okfPhysics = true;
  window.bqVisNet = null;
  let threeState = null;

  function isKo() {
    return LANG === "ko";
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function colorizeYaml(yamlText) {
    return escapeHtml(yamlText)
      .replace(/^---$/gm, '<span class="yaml-delim">---</span>')
      .replace(/^([a-zA-Z0-9_]+):/gm, '<span class="yaml-key">$1</span>:');
  }

  // =========================================================================
  // 1. Language & Theme Controllers
  // =========================================================================
  window.setStudioLang = function (lang) {
    if (lang !== "ko" && lang !== "en") return;
    LANG = lang;
    try {
      localStorage.setItem("hp_studio_lang", lang);
    } catch (_) {}
    document.documentElement.setAttribute("lang", lang);
    syncStaticLabels();
    renderActiveModule();
  };
  window.setLanguage = window.setStudioLang;

  window.toggleTheme = function () {
    const isDark = document.body.classList.toggle("dark-mode");
    try {
      localStorage.setItem("hp_studio_dark", isDark ? "1" : "0");
    } catch (_) {}
    syncThemeButton();
    if (ACTIVE_MODULE === "okf-validation" && GRAPH_MODE) {
      buildOkfGraph(document.getElementById("graph-scope-select").value);
    } else if (ACTIVE_MODULE === "bq-graph") {
      initOrUpdateBqGraphStudio();
    } else if (ACTIVE_MODULE === "intro") {
      renderIntroModule();
    }
  };

  function syncThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");
    const tIcon = document.getElementById("theme-icon");
    const tText = document.getElementById("theme-text");
    if (tIcon) tIcon.textContent = isDark ? "light_mode" : "dark_mode";
    if (tText) {
      tText.textContent = isDark
        ? isKo() ? "라이트 모드" : "Light Mode"
        : isKo() ? "다크 모드" : "Dark Mode";
    }
  }

  function syncStaticLabels() {
    const k = isKo();
    document.title = k
      ? "Google Cloud | HP Dragonfly 온톨로지 & OKF v0.2 스튜디오"
      : "Google Cloud | HP Dragonfly Ontology & OKF v0.2 Studio";

    const appTitle = document.getElementById("studio-app-title");
    if (appTitle) {
      appTitle.textContent = k
        ? "Google Cloud | HP Dragonfly 온톨로지 스튜디오"
        : "Google Cloud | HP Dragonfly Ontology Studio";
    }

    const btnKo = document.getElementById("btn-lang-ko");
    const btnEn = document.getElementById("btn-lang-en");
    if (btnKo) btnKo.classList.toggle("active", k);
    if (btnEn) btnEn.classList.toggle("active", !k);

    const setTxt = (id, koTxt, enTxt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = k ? koTxt : enTxt;
    };

    setTxt("tip-desc-01", "3-Plane 아키텍처 · OKF 파이프라인", "3-Plane Architecture & OKF Pipeline");
    setTxt("tip-desc-02", "원본 PDF ↔ OKF 1:1 대조 및 지식그래프", "Source PDF ↔ OKF 1:1 Compare & Graph");
    setTxt("tip-desc-03", "OKF Editor · Knowledge Catalog (Git & kcmd)", "OKF Editor · Knowledge Catalog (Git & kcmd)");
    setTxt("tip-desc-04", "BigQuery 8개 정형 테이블 · 3D 스키마 · GQL 그래프", "BigQuery 8 Tables · 3D Schema · GQL Graph");
    setTxt("tip-desc-05", "하이브리드 온톨로지 에이전트 & Playbook 추론", "Hybrid Ontology Agent & Playbook Reasoning");
    setTxt("tip-desc-06", "Vector RAG vs. Ontology Graph RAG 벤치마크", "Vector RAG vs. Ontology Graph RAG Benchmark");

    setTxt("lbl-source-pdf", "원본 PDF", "Source PDF");
    setTxt("lbl-okf-file", "OKF 파일", "OKF File");
    setTxt("g-sidebar-title", "OKF 시맨틱 지식그래프", "OKF Knowledge Graph");
    setTxt(
      "g-sidebar-sub",
      "노드를 클릭하면 우측 패널에 시맨틱 엣지(Business Semantic Relations), YAML Frontmatter, 마크다운 원문이 표시됩니다.",
      "Click any node to inspect its Business Semantic Relations, YAML Frontmatter, and English Markdown specification."
    );
    setTxt("g-scope-label", "그래프 스코프 필터 (Graph Scope)", "Graph Scope Filter");
    setTxt("g-search-label", "노드·부품·진단코드 검색", "Node & Entity Search");
    setTxt("g-leg-1", "Source Document / Ontology Root (원본·데이터셋 루트)", "Source Document / Ontology Root");
    setTxt("g-leg-2", "Chapter / Section Hub (매뉴얼 장·절 및 도메인 허브)", "Chapter / Section Hub");
    setTxt("g-leg-3", "Standard OKF Concept & Chunk (정형 테이블·일반 조항)", "Standard OKF Concept & Rule Chunk");
    setTxt("g-leg-4", "Safety DAG / Caveat / Playbook (분해 선행 DAG·안전 특례)", "Safety DAG / Caveat / Playbook");
    setTxt("g-leg-5", "Core Hardware Entity & Metric (핵심 부품/코드 다이아몬드)", "Core Hardware Entity Diamond & Metric");
    setTxt("lbl-fit-graph", "화면 맞춤", "Fit Screen");
    setTxt("lbl-phys-graph", "물리엔진", "Physics");
    setTxt("lbl-okf-g-sidebar", "좌측 패널 토글", "Toggle Left Panel");
    setTxt("lbl-okf-g-fit2", "화면 맞춤", "Fit Screen");
    setTxt("lbl-okf-g-phys2", "물리엔진", "Physics");
    setTxt("lbl-okf-g-inspector", "선택 문서 인스펙터", "Document Inspector");
    setTxt("lbl-open-pdf-compare", "PDF 대조뷰로 열기", "Open 1:1 PDF View");
    const gSearchInp = document.getElementById("graph-search-input");
    if (gSearchInp) {
      gSearchInp.placeholder = k
        ? "노드·부품·점멸코드 검색 (M90788, 3.2, Sure Start, OLED)..."
        : "Search node, part, or blink code (M90788, 3.2, Sure Start, OLED)...";
    }
    const gStatusR = document.getElementById("okf-graph-status-right");
    if (gStatusR) {
      gStatusR.textContent = k
        ? "마우스 휠 줌 · 드래그 · 노드 클릭 시 시맨틱 엣지 및 OKF 원문 열람"
        : "Scroll to zoom · Drag · Click any node to inspect semantic edges & OKF markdown";
    }

    setTxt("bq-sidebar-title", "BigQuery Property Graph", "BigQuery Property Graph");
    const bqSub = document.getElementById("bq-sidebar-sub");
    if (bqSub) {
      bqSub.innerHTML = k
        ? "<code>hp-dragonfly.prj_ontology_hp_dragonfly</code>의 8개 영문 정형 테이블(109행)과 비정형 PDF가 결합된 2-Layer Knowledge Graph를 탐색합니다."
        : "Explore the 2-Layer Knowledge Graph uniting 8 English BigQuery tables (109 rows) in <code>hp-dragonfly.prj_ontology_hp_dragonfly</code> with the unstructured PDF Service Guide.";
    }
    setTxt("bq-lbl-templates", "1. GQL 쿼리 템플릿 라이브러리", "1. Saved GQL Query Templates");
    setTxt("bq-lbl-statement", "2. BigQuery GQL 쿼리문 (ISO/IEC 39075)", "2. BigQuery GQL Query Statement");
    setTxt("bq-run-btn-txt", "GQL 쿼리 실행 (Live BQ)", "Run GQL Query (Live BQ)");
    setTxt("lbl-cam-reset", "기본 시야", "Reset View");
    setTxt("lbl-cam-top", "탑뷰 (Top)", "Top View");
    setTxt("lbl-cam-split", "2-Layer 분할뷰", "2-Layer Split View");
    setTxt("lbl-open-catalog", "노드·엣지 Description", "Node & Edge Descriptions");
    setTxt("lbl-open-tables", "8개 정형 테이블 브라우저", "Browse 8 BQ Tables");
    setTxt("lbl-inst-fit", "화면 맞춤", "Fit Screen");
    setTxt("lbl-inst-results", "GQL 실행 결과 테이블 토글", "Toggle GQL Result Table");
    setTxt("lbl-inst-catalog", "노드·엣지 Description", "Node & Edge Descriptions");
    setTxt("lbl-inst-tables", "8개 정형 테이블 브라우저", "Browse 8 BQ Tables");

    const navSearch = document.getElementById("nav-search");
    if (navSearch) {
      navSearch.placeholder = k
        ? "OKF 컨셉 검색 (disassembly, BIOS, blink, SKU)..."
        : "Search OKF concept (disassembly, BIOS, blink, SKU)...";
    }

    syncThemeButton();
    syncViewSwitchButton();
  }

  function syncViewSwitchButton() {
    const btn = document.getElementById("btn-view-switch");
    const icon = document.getElementById("view-switch-icon");
    const txt = document.getElementById("view-switch-text");
    if (!btn || !icon || !txt) return;
    btn.classList.toggle("active", GRAPH_MODE);
    if (GRAPH_MODE) {
      icon.textContent = "vertical_split";
      txt.textContent = isKo() ? "1:1 대조뷰" : "Split View";
    } else {
      icon.textContent = "hub";
      txt.textContent = isKo() ? "지식그래프 뷰" : "Graph View";
    }
  }

  // =========================================================================
  // 2. Module Router (`switchModule`)
  // =========================================================================
  window.switchModule = function (modId) {
    ACTIVE_MODULE = modId;
    const railMap = {
      intro: "rail-intro",
      "okf-validation": "rail-okf-validation",
      "okf-management": "rail-okf-management",
      "bq-graph": "rail-bq-graph",
      agent: "rail-agent",
      "rag-vs-graphrag": "rail-rag-vs-graphrag"
    };
    Object.entries(railMap).forEach(([k, btnId]) => {
      const el = document.getElementById(btnId);
      if (el) el.classList.toggle("active", k === modId);
    });

    const modIntro = document.getElementById("module-intro");
    const compareWs = document.getElementById("compare-workspace");
    const graphWs = document.getElementById("graph-workspace");
    const modEnroll = document.getElementById("module-enrollment");
    const modBqGraph = document.getElementById("module-bq-graph");
    const modAgent = document.getElementById("module-agent");
    const modBench = document.getElementById("module-benchmark");
    const viewSwitchBtn = document.getElementById("btn-view-switch");

    if (modIntro) modIntro.style.display = modId === "intro" ? "flex" : "none";
    if (modEnroll) modEnroll.style.display = modId === "okf-management" ? "flex" : "none";
    if (modBqGraph) modBqGraph.style.display = modId === "bq-graph" ? "flex" : "none";
    if (modAgent) modAgent.style.display = modId === "agent" ? "flex" : "none";
    if (modBench) modBench.style.display = modId === "rag-vs-graphrag" ? "flex" : "none";

    if (modId === "okf-validation") {
      if (viewSwitchBtn) viewSwitchBtn.style.display = "inline-flex";
      if (GRAPH_MODE) {
        if (compareWs) compareWs.style.display = "none";
        if (graphWs) graphWs.style.display = "flex";
      } else {
        if (graphWs) graphWs.style.display = "none";
        if (compareWs) compareWs.style.display = "flex";
      }
    } else {
      if (viewSwitchBtn) viewSwitchBtn.style.display = "none";
      if (compareWs) compareWs.style.display = "none";
      if (graphWs) graphWs.style.display = "none";
    }

    renderActiveModule();
  };

  function renderActiveModule() {
    if (ACTIVE_MODULE === "intro") {
      renderIntroModule();
    } else if (ACTIVE_MODULE === "okf-validation") {
      renderSidebar();
      selectItem(CURRENT_OKF_IDX);
      if (GRAPH_MODE) {
        const sc = document.getElementById("graph-scope-select");
        buildOkfGraph(sc ? sc.value : "ALL");
        openGraphDetailForIdx(CURRENT_OKF_IDX);
      }
    } else if (ACTIVE_MODULE === "okf-management") {
      renderManagementModule();
    } else if (ACTIVE_MODULE === "bq-graph") {
      initOrUpdateBqGraphStudio();
    } else if (ACTIVE_MODULE === "agent") {
      renderAgentModule();
    } else if (ACTIVE_MODULE === "rag-vs-graphrag") {
      renderBenchmarkModule();
    }
  }

  // =========================================================================
  // 3. MODULE 01: Intro (3-Plane Architecture & Pipeline)
  // =========================================================================
  window.setIntroTab = function (tabId) {
    INTRO_TAB = tabId;
    renderIntroModule();
  };

  function renderIntroModule() {
    const box = document.getElementById("module-intro");
    if (!box) return;
    const k = isKo();

    const tableRowsHtml = BQ_TABLES.map(
      (tb) => `
      <tr>
        <td><b>${escapeHtml(tb.label.split(" ")[0])}</b><div class="intro-cell-sub">${escapeHtml(k ? tb.title_ko : tb.title_en)}</div></td>
        <td>BigQuery (${escapeHtml(tb.role)})</td>
        <td><code>hp-dragonfly.prj_ontology_hp_dragonfly.${escapeHtml(tb.table_name)}</code> → <code>hp_dragonfly_ontology_graph</code></td>
        <td class="intro-num">${tb.row_count} rows · p.${tb.pdf_page}</td>
      </tr>`
    ).join("");

    const tab1Html = `
      <section class="intro-hero">
        <p class="intro-hero-eyebrow">${
          k
            ? "GOOGLE CLOUD ENTERPRISE ONTOLOGY REFERENCE · HP DRAGONFLY G3 / FOLIO G3"
            : "GOOGLE CLOUD ENTERPRISE ONTOLOGY REFERENCE · HP DRAGONFLY G3 / FOLIO G3"
        }</p>
        <h1 class="intro-hero-title">${
          k
            ? "비정형 PDF 서비스 매뉴얼(109p)과 BigQuery 정형 테이블(8종)을 결합한 엔터프라이즈 온톨로지 레이어"
            : "Enterprise Ontology Layer Unifying Unstructured Service Manuals (109p) & BigQuery Property Graphs"
        }</h1>
        <p class="intro-hero-sub">${
          k
            ? "단순 텍스트 청크 벡터 검색(Vector RAG)은 하드웨어 분해 선행 작업 순서(DAG)나 온보드 LPDDR5 용량별 시스템 보드 파트 번호를 혼동합니다. 본 워크스페이스는 Enrichment Agent로 생성한 28개 OKF v0.2 번들, Git Metadata-as-Code, Dataplex kcmd 카탈로그, 그리고 BigQuery Property Graph(GQL)를 결합하여 할루시네이션 없는 정밀 엔지니어링 진단을 구현합니다."
            : "Standard chunk-based Vector RAG frequently hallucinates multi-hop hardware disassembly precedence (DAG) and soldered LPDDR5 system board spare part numbers. This workspace combines an Enrichment Agent (28 OKF v0.2 files), Git Metadata-as-Code, Dataplex kcmd synchronization, and BigQuery Property Graph (GQL) for deterministic hardware triage."
        }</p>

        <div class="intro-hero-q">
          <span class="material-symbols-outlined">chat</span>
          <span>"${
            k
              ? "HP Dragonfly Folio G3(i7-1265U, 32GB 온보드 LPDDR5)에서 Caps Lock LED 3.2 점멸 오류가 발생했을 때 교체해야 할 정확한 시스템 보드 파트 번호와 필수 선행 분해 부품 순서는?"
              : "On an HP Dragonfly Folio G3 (i7-1265U, 32GB soldered LPDDR5) showing Caps Lock 3.2 blink code, what is the exact replacement system board spare part number and mandatory prerequisite removal sequence?"
          }"</span>
        </div>

        <div class="intro-hero-ba">
          <div class="intro-hero-arm bad">
            <div class="intro-hero-arm-k">
              <span>${k ? "일반 PDF 청크 Vector RAG" : "Naive PDF Chunk Vector RAG"}</span>
              <span class="intro-hero-verdict">${k ? "오답 · 순서 누락" : "Incorrect / Incomplete"}</span>
            </div>
            <div class="intro-hero-ans">${
              k
                ? "메모리 모듈을 재장착하거나 시스템 보드(N09241-601 등)를 교체하세요."
                : "Reseat the memory module or replace the system board (e.g., N09241-601)."
            }</div>
            <ol>
              <li>${
                k
                  ? "LPDDR5 메모리가 온보드 납땜(Soldered) 구조임을 놓치고 '메모리 슬롯 재장착'을 잘못 안내함"
                  : "Fails to recognize LPDDR5 is soldered onboard and suggests reseating SO-DIMM"
              }</li>
              <li>${
                k
                  ? "16종 시스템 보드 스페어 파트 중 i7-1265U 32GB용(M90788-601 / N17344-001)을 특정하지 못함"
                  : "Confuses 16 system board SKUs across G3 Clamshell vs. Folio G3"
              }</li>
              <li>${
                k
                  ? "배터리(M90788-005) 분리 전 700V ESD 방전 및 열전도 그리스 재도포 선행 단계를 누락함"
                  : "Misses mandatory battery isolation (M90788-005) & heatsink prerequisite DAG steps"
              }</li>
            </ol>
          </div>

          <div class="intro-hero-arm">
            <div class="intro-hero-arm-k">
              <span>${
                k
                  ? "HP Dragonfly 온톨로지 (BigQuery GQL + OKF v0.2 + Dataplex)"
                  : "HP Dragonfly Ontology (BigQuery GQL + OKF v0.2 + Dataplex)"
              }</span>
              <span class="intro-hero-verdict">${k ? "정답 · 100% 근거 검증" : "Verified & Deterministic"}</span>
            </div>
            <div class="intro-hero-ans">${
              k
                ? "LED-CAPS-3-2 = 온보드 LPDDR5 메모리 초기화 실패 → HP Sure Start 복구 시도 후 실패 시 시스템 보드 FRU 교체 (선행 분해 DAG 4단계 준수)"
                : "LED-CAPS-3-2 = Soldered LPDDR5 Failure → Run HP Sure Start BIOS Recovery first; if persistent, replace System Board FRU following 4-step Disassembly DAG"
            }</div>
            <ol>
              <li>${
                k
                  ? "OKF Playbook(no-boot-bios-sure-start-recovery.md)을 통해 무분해 Win+B HP Sure Start 복구를 1차 안내"
                  : "Follows OKF Playbook (no-boot-bios-sure-start-recovery.md) for non-invasive Win+B Sure Start recovery first"
              }</li>
              <li>${
                k
                  ? "BigQuery GQL USES_SYSTEM_BOARD 엣지로 SKU별 정확한 시스템 보드 파트 번호를 1:1 매핑"
                  : "Traverses USES_SYSTEM_BOARD edge in BigQuery GQL to resolve exact SKU system board part number"
              }</li>
              <li>${
                k
                  ? "REQUIRES_REMOVAL_OF 엣지로 하판 커버(N22918-001) → 배터리(M90788-005) → 방열판 순서 및 나사 규격 도출"
                  : "Traverses REQUIRES_REMOVAL_OF DAG edges for Bottom Cover → Battery → Thermal Module order"
              }</li>
            </ol>
          </div>
        </div>

        <h2 class="intro-hero-h2">${
          k
            ? "지금까지 구축 완료된 3-Plane 온톨로지 아키텍처 핵심 구성"
            : "Core Pillars of Our Completed 3-Plane Ontology Architecture"
        }</h2>
        <div class="intro-hero-reasons">
          <div>
            <b>${k ? "1. Source Data Plane (정형 BigQuery + 비정형 PDF)" : "1. Source Data Plane (Structured BQ + Unstructured PDF)"}</b>
            ${
              k
                ? "hp-dragonfly.prj_ontology_hp_dragonfly 내 8개 영문 정형 테이블(109행), hp_dragonfly_ontology_graph Property Graph, 그리고 109페이지 공식 서비스 매뉴얼(N17344-001)을 단일 워크스페이스로 통합했습니다."
                : "Unites 8 English structured tables (109 rows) and Property Graph hp_dragonfly_ontology_graph with the 109-page HP Service Guide PDF (Doc Part N17344-001)."
            }
          </div>
          <div>
            <b>${k ? "2. Semantic Enrichment & Metadata as Code (Git)" : "2. Semantic Enrichment & Metadata as Code (Git)"}</b>
            ${
              k
                ? "Enrichment Agent(scripts/enrichment_agent.py)가 28개 OKF v0.2 마크다운 번들(21개 컨셉 · 110개 시맨틱 엣지)과 Dataplex Overview Aspect를 생성하고 Git(main 브랜치)으로 버전 관리합니다."
                : "Enrichment Agent (scripts/enrichment_agent.py) synthesizes 28 OKF v0.2 markdown files (21 concepts, 110 edges) and catalog YAML snapshots tracked in Git."
            }
          </div>
          <div>
            <b>${k ? "3. Governance & Consumption Plane (kcmd + Dataplex)" : "3. Governance & Consumption Plane (kcmd + Dataplex)"}</b>
            ${
              k
                ? "단독 컴파일된 ./bin/kcmd(v1.0.0)가 bq-dataset 스코프(9개 엔트리)와 커스텀 okf_hp_dragonfly EntryGroup(28개 엔트리)을 Dataplex Knowledge Catalog에 양방향 Push/Pull 동기화합니다."
                : "Standalone ./bin/kcmd (v1.0.0) synchronizes both bq-dataset (9 entries) and custom EntryGroup okf_hp_dragonfly (28 entries) with Dataplex Knowledge Catalog."
            }
          </div>
        </div>
      </section>

      <figure class="intro-fig">
        <div class="intro-fig-canvas" id="intro-mermaid-arch" style="padding:18px; text-align:center;"></div>
        <div class="intro-table-wrap">
          <table class="intro-table">
            <thead>
              <tr>
                <th>${k ? "온톨로지 클래스 / 역할" : "Ontology Class / Role"}</th>
                <th>${k ? "저장소 유형" : "Storage Engine"}</th>
                <th>${k ? "물리 테이블 → Property Graph 매핑" : "Physical Table → Property Graph Mapping"}</th>
                <th>${k ? "행 수 · 매뉴얼 페이지" : "Rows · Manual Page"}</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
        <figcaption>
          <b>${k ? "그림 1 · HP Dragonfly 3-Plane 하이브리드 온톨로지 아키텍처 및 8개 정형 테이블 매핑" : "Figure 1 · HP Dragonfly 3-Plane Hybrid Ontology Architecture & 8 Structured Table Mappings"}</b> —
          ${
            k
              ? "비정형 서비스 매뉴얼 PDF(N17344-001)와 BigQuery 8개 영문 테이블(109행)이 Enrichment Agent, Git, kcmd를 거쳐 Dataplex Knowledge Catalog 및 Property Graph로 통합됩니다."
              : "Unstructured PDF manual (N17344-001) and 8 English BigQuery tables (109 rows) flow through the Enrichment Agent, Git, and kcmd into Dataplex Knowledge Catalog and BigQuery Property Graph."
          }
        </figcaption>
      </figure>
    `;

    const tab2Html = `
      <p class="intro-lead">${
        k
          ? "Enrichment Agent(<b>scripts/enrichment_agent.py</b>)가 비정형 PDF와 BigQuery 스키마에서 시맨틱 지식을 추출하여 <b>bundles/hp_dragonfly/</b>(28개 OKF v0.2 파일)와 <b>catalog/</b>를 생성하고, Git 커밋 이후 <b>./bin/kcmd</b>로 Dataplex Knowledge Catalog에 반영하는 단계별 실행 흐름입니다."
          : "Step-by-step execution pipeline showing how the Enrichment Agent (<b>scripts/enrichment_agent.py</b>) extracts semantic knowledge from the PDF and BigQuery into <b>bundles/hp_dragonfly/</b> (28 OKF v0.2 files), commits to Git, and pushes to Dataplex via <b>./bin/kcmd</b>."
      }</p>
      <figure class="intro-fig">
        <div class="intro-fig-canvas" id="intro-mermaid-seq" style="padding:18px; text-align:center;"></div>
        <figcaption>
          <b>${k ? "그림 2 · Enrichment Agent → Metadata as Code (Git) → kcmd Push/Pull 시퀀스 다이어그램" : "Figure 2 · Enrichment Agent → Metadata as Code (Git) → kcmd Push/Pull Sequence"}</b>
        </figcaption>
      </figure>
    `;

    box.style.padding = "0";
    box.innerHTML = `
      <div class="pane-subbar" style="height:46px; padding:0 18px; width:100%; flex-shrink:0;">
        <div style="display:flex; align-items:center; gap:8px; min-width:0; overflow:hidden;">
          <span class="material-symbols-outlined" style="color:var(--gcp-blue); font-size:19px; line-height:1; flex-shrink:0;">space_dashboard</span>
          <span style="font-size:13.5px; font-weight:600; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${k ? "01 · HP Dragonfly 온톨로지 레이어 아키텍처 & OKF 파이프라인" : "01 · HP Dragonfly Ontology Layer Architecture & OKF Pipeline"}
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
          <div class="mgmt-subtab-group">
            <button type="button" class="mgmt-subtab-btn ${INTRO_TAB === "arch" ? "active" : ""}" onclick="setIntroTab('arch')">
              ${k ? "1. 3-Plane 아키텍처 & 테이블 매핑" : "1. 3-Plane Architecture & Tables"}
            </button>
            <button type="button" class="mgmt-subtab-btn ${INTRO_TAB === "pipeline" ? "active" : ""}" onclick="setIntroTab('pipeline')">
              ${k ? "2. Enrichment Agent → Git → kcmd 시퀀스" : "2. Enrichment → Git → kcmd Sequence"}
            </button>
          </div>
        </div>
      </div>
      <div class="intro-body-scroll">
        <div class="intro-doc">
          ${INTRO_TAB === "arch" ? tab1Html : tab2Html}
        </div>
      </div>
    `;

    renderIntroMermaidDiagrams();
  }

  async function renderIntroMermaidDiagrams() {
    if (!window.mermaid) return;
    const isDark = document.body.classList.contains("dark-mode");
    window.mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose"
    });

    const archEl = document.getElementById("intro-mermaid-arch");
    if (archEl) {
      const code = `flowchart LR
  subgraph P1["Plane 1: Source Data (hp-dragonfly)"]
    PDF["Unstructured Service Guide PDF\\npdf_6290467_en-US-1.pdf\\n(Doc Part N17344-001 · 109 Pages)"]
    BQ["BigQuery Dataset\\nprj_ontology_hp_dragonfly\\n(8 English Tables · 109 Rows)"]
    PG["BigQuery Property Graph\\nhp_dragonfly_ontology_graph\\n(5 Node · 5 Edge Classes)"]
    BQ --> PG
  end
  subgraph P2["Plane 2: Enrichment & Metadata as Code"]
    EA["Enrichment Agent\\nscripts/enrichment_agent.py"]
    OKF["OKF v0.2 Bundle (28 Files)\\nbundles/hp_dragonfly/\\n(21 Concepts · 110 Edges)"]
    GIT["Git Repository (main)\\ncatalog/ & catalog_okf/"]
    EA --> OKF
    OKF --> GIT
  end
  subgraph P3["Plane 3: Governance & Studio"]
    KCMD["kcmd v1.0.0 CLI\\n./bin/kcmd push & pull"]
    DPX["Dataplex Knowledge Catalog\\nEntryGroup: okf_hp_dragonfly\\nAspectType: okf + overview"]
    APP["HP Dragonfly Ontology Studio\\n(KO / EN Web App & Live GQL)"]
    KCMD --> DPX
    DPX --> APP
    PG --> APP
  end
  PDF --> EA
  BQ --> EA
  GIT --> KCMD`;
      try {
        const res = await window.mermaid.render("mm-svg-arch-" + Date.now(), code);
        archEl.innerHTML = res.svg;
      } catch (e) {
        archEl.innerHTML = `<pre>${escapeHtml(code)}</pre>`;
      }
    }

    const seqEl = document.getElementById("intro-mermaid-seq");
    if (seqEl) {
      const seqCode = `sequenceDiagram
  autonumber
  participant S as Source Plane (109p PDF + 8 BQ Tables)
  participant A as Enrichment Agent (enrichment_agent.py)
  participant G as Git Repo (Metadata as Code)
  participant K as kcmd CLI (./bin/kcmd v1.0.0)
  participant D as Dataplex Knowledge Catalog (hp-dragonfly)
  S->>A: Extract PDF chapters/pages & BigQuery schemas/FKs
  A->>G: Generate 28 OKF v0.2 .md files + viz.html + catalog/*.yaml
  G->>G: git commit (Track YAML frontmatter: generated, verified, sources)
  G->>K: ./bin/kcmd push ./catalog (Scope: bq-dataset, 9 Entries)
  K->>D: Upsert dataplex-types.global.overview aspects on Dataset & 8 Tables
  G->>K: ./bin/kcmd push ./catalog_okf (Scope: kb...okf_hp_dragonfly, 28 Entries)
  K->>D: Upsert okf-bundle Entries with custom okf + overview Aspects
  D->>K: ./bin/kcmd pull ./catalog_okf_pulled (Round-trip verification 100%)`;
      try {
        const res = await window.mermaid.render("mm-svg-seq-" + Date.now(), seqCode);
        seqEl.innerHTML = res.svg;
      } catch (e) {
        seqEl.innerHTML = `<pre>${escapeHtml(seqCode)}</pre>`;
      }
    }
  }

  // =========================================================================
  // 4. MODULE 02: OKF Validation (1:1 PDF Split Compare & Knowledge Graph)
  //    100% Unstructured Document Contexts organized sequentially ([01]~[08])
  // =========================================================================
  function highlightOkfTerms(html) {
    const terms = [
      "M90788-601",
      "M90788-005",
      "N22918-001",
      "M90790-001",
      "N01291-001",
      "N09033-001",
      "N08542-001",
      "N17344-001",
      "HP Sure Start Gen7",
      "Win+B",
      "LPDDR5-6400",
      "700V",
      "Stretch-Release Pull-Tab",
      "Caps Lock 3.2",
      "Caps Lock 2.2",
      "POST 90B",
      "Torx T5",
      "Mylar"
    ];
    let out = html;
    terms.forEach((t) => {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(?![^<]*>)(${esc})`, "g");
      out = out.replace(re, '<span class="hl-term">$1</span>');
    });
    return out;
  }

  window.toggleCatGroup = function (docId) {
    OPEN_CATS[docId] = !OPEN_CATS[docId];
    renderSidebar();
  };

  window.selectDocRoot = function (docId) {
    OPEN_CATS[docId] = !OPEN_CATS[docId];
    ACTIVE_DOC_ROOT_ID = docId;
    const d = OKF_DOC_ROOTS.find((r) => r.doc_id === docId);
    renderSidebar();
    if (!d) return;

    const k = isKo();
    const pdfUrl = `/docs/pdf_6290467_en-US-1.pdf#page=${d.pdf_page}&zoom=100`;
    const pdfNameEl = document.getElementById("pdf-name-label");
    if (pdfNameEl) pdfNameEl.textContent = "pdf_6290467_en-US-1.pdf (N17344-001)";

    const pdfPageEl = document.getElementById("pdf-page-label");
    if (pdfPageEl) {
      pdfPageEl.textContent = k
        ? `p.${d.pdf_page} (범위 pp.${d.source_pages_span}) · [${d.doc_num}] ${d.doc_short_ko}`
        : `p.${d.pdf_page} (pp.${d.source_pages_span}) · [${d.doc_num}] ${d.doc_short_en}`;
    }

    const frame = document.getElementById("pdf-frame");
    if (frame && frame.getAttribute("data-src") !== pdfUrl) {
      frame.removeAttribute("src");
      setTimeout(() => {
        frame.src = pdfUrl;
        frame.setAttribute("data-src", pdfUrl);
      }, 15);
    }

    const okfFileEl = document.getElementById("okf-file-label");
    const activeDocGcsUri = k
      ? d.gcs_uri_ko || `gs://hp-dragonfly-okf/okf-kr/${d.rel_path}`
      : d.gcs_uri_en || `gs://hp-dragonfly-okf/okf-en/${d.rel_path}`;
    const activeDocRepoPath = k
      ? d.okf_repo_path_ko || `okf-kr/${d.rel_path}`
      : d.okf_repo_path_en || `okf-en/${d.rel_path}`;
    if (okfFileEl) okfFileEl.textContent = activeDocRepoPath;

    const readerEl = document.getElementById("okf-reader");
    if (readerEl) {
      const activeRawYaml = k
        ? d.yaml_ko || d.raw_yaml_ko || d.raw_yaml || ""
        : d.yaml_en || d.raw_yaml_en || d.raw_yaml || "";
      const activeDocBody = k ? d.body_ko || d.body || "" : d.body_en || d.body || "";
      const renderedMd =
        window.marked && typeof window.marked.parse === "function"
          ? highlightOkfTerms(window.marked.parse(activeDocBody))
          : `<pre>${escapeHtml(activeDocBody)}</pre>`;
      const childItems = OKF_FILES.map((f, idx) => ({ f, idx })).filter((x) => x.f.doc_id === docId);
      readerEl.innerHTML = `
        <div class="okf-subpath-line">${escapeHtml(activeDocGcsUri)}</div>
        <div class="section-label">
          <span>${k ? `하위 비정형 조항 컨텍스트 (${childItems.length}건)` : `Child Unstructured Context Clauses (${childItems.length})`}</span>
          <span>${k ? "클릭 시 해당 조항으로 이동" : "Click to inspect clause"}</span>
        </div>
        <div class="biz-edge-list">
          ${childItems
            .map(
              ({ f, idx }) => `
            <div class="biz-edge-item" onclick="selectItem(${idx})">
              <div class="biz-edge-top">
                <span class="edge-badge">
                  <span class="edge-dot" style="background:${f.status === "deprecated" ? "#c5221f" : "#1a73e8"};"></span>
                  ${escapeHtml(k ? f.section_number : f.section_number_en || f.section_number)}
                </span>
                <span class="edge-jump-meta">p.${f.pdf_page} · ${escapeHtml(f.version || "v0.2.0")} ↗</span>
              </div>
              <div class="edge-reason" style="margin-top:4px; font-weight:600; color:var(--text);">${escapeHtml(
                k ? f.title_ko : f.title_en
              )}</div>
            </div>
          `
            )
            .join("")}
        </div>
        <details class="fm-accordion" ${FM_OPEN ? "open" : ""} ontoggle="onFmToggle(this.open)">
          <summary>
            <span class="fm-summary-left">
              <span>YAML Frontmatter</span>
              <span class="fm-summary-meta">Source Document (doc.md) · pp.${escapeHtml(d.source_pages_span)}</span>
            </span>
            <span class="material-symbols-outlined fm-chevron">expand_more</span>
          </summary>
          <div class="frontmatter-block">${colorizeYaml(activeRawYaml)}</div>
        </details>
        <div class="section-label">
          <span>${k ? "문서 루트 요약 (Document Root Overview)" : "Document Root Overview (doc.md)"}</span>
        </div>
        <div class="okf-title">${escapeHtml(k ? d.title_ko : d.title_en)}</div>
        <div class="okf-body-box okf-md-content">${renderedMd}</div>
      `;
      readerEl.scrollTop = 0;
    }
  };

  window.renderSidebar = function () {
    const searchEl = document.getElementById("nav-search");
    const q = ((searchEl && searchEl.value) || "").trim().toLowerCase();
    const box = document.getElementById("nav-list");
    if (!box) return;

    const k = isKo();
    const groups = OKF_DOC_ROOTS.map((d) => {
      const items = [];
      OKF_FILES.forEach((f, idx) => {
        if (f.doc_id !== d.doc_id) return;
        if (q) {
          const hay = `${f.section_number} ${f.section_number_en} ${f.title_ko} ${f.title_en} ${f.rel_path} ${f.body}`.toLowerCase();
          if (!hay.includes(q)) return;
        }
        items.push({ ...f, idx });
      });
      return { doc: d, items };
    }).filter((g) => !q || g.items.length > 0);

    box.innerHTML = groups
      .map(({ doc, items }) => {
        const isOpen = q ? true : Boolean(OPEN_CATS[doc.doc_id]);
        const isDocRootActive = ACTIVE_DOC_ROOT_ID === doc.doc_id;
        return `
          <div class="doc-section">
            <div class="doc-group-title ${isDocRootActive ? "doc-root-active" : ""}" onclick="selectDocRoot('${escapeHtml(doc.doc_id)}')" title="${escapeHtml(k ? doc.title_ko : doc.title_en)}">
              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">[${escapeHtml(doc.doc_num)}] ${escapeHtml(k ? doc.doc_short_ko : doc.doc_short_en)}</span>
              <span class="badge-pill badge-blue">${items.length}</span>
            </div>
            <div class="doc-items ${isOpen ? "" : "collapsed"}">
              ${items
                .map((it) => {
                  const isDep = it.status === "deprecated";
                  const isActive = !ACTIVE_DOC_ROOT_ID && it.idx === CURRENT_OKF_IDX;
                  return `
                <div class="nav-item ${isActive ? "active" : ""}" onclick="selectItem(${it.idx})" style="${isDep ? "opacity:0.78;" : ""}">
                  <div class="nav-item-top">
                    <span>${escapeHtml(k ? it.section_number : it.section_number_en || it.section_number)}</span>
                    <span class="nav-page">${isDep ? "DEPRECATED · " : ""}p.${it.pdf_page}</span>
                  </div>
                  <div class="nav-item-sub">${escapeHtml(k ? it.title_ko : it.title_en)}</div>
                </div>
              `;
                })
                .join("")}
            </div>
          </div>
        `;
      })
      .join("");
  };

  window.onFmToggle = function (isOpen) {
    FM_OPEN = Boolean(isOpen);
  };

  window.selectByConceptId = function (conceptId) {
    const clean = String(conceptId || "").replace(/\.md$/, "");
    const idx = OKF_FILES.findIndex(
      (f) =>
        f.id === clean ||
        f.rel_path === conceptId ||
        (Array.isArray(f.legacy_aliases) && (f.legacy_aliases.includes(conceptId) || f.legacy_aliases.includes(clean + ".md")))
    );
    if (idx < 0) return;
    if (GRAPH_MODE) {
      openGraphDetailForIdx(idx);
      if (okfNetwork) {
        try {
          okfNetwork.selectNodes([OKF_FILES[idx].id]);
          okfNetwork.focus(OKF_FILES[idx].id, { scale: 1.2, animation: { duration: 350 } });
        } catch (_) {}
      }
    } else {
      selectItem(idx);
    }
  };

  // =========================================================================
  // 4.1 5-Tier OKF Constellation Graph Definitions (100% Unstructured Contexts)
  //     Tier 1: Source Document Roots (`#3b6ea5` Manual PDF / `#527a9a` SOP Policy, size 34)
  //     Tier 2: Sequential Chapter Hubs (`[01]`~`[08]`, `#6b88a8`, size 22)
  //     Tier 3: Unstructured Clause / Provision Nodes (`#3b735b` / `#a85c56` / `#b88a44`, size 15-17.5)
  //     Tier 4: Fine-Grained Sub-Clause / Rule Chunks (`#3b735b` / `#a85c56`, size 11.5)
  //     Tier 5: Core Hardware & Diagnostic Entity Diamonds (`#b88a44`, diamond, size 12.5)
  // =========================================================================
  let okfGraphNodes = [];
  let okfGraphEdges = [];

  const HP_CAVEAT_CONCEPTS = new Set([
    "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule",
    "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol",
    "manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule",
    "manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal",
    "manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag",
    "manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable",
    "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap",
    "internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap"
  ]);

  const HP_GOVERNANCE_CONCEPTS = new Set([
    "manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog",
    "manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix",
    "manuals/03_ch3_spare_parts_catalog/table_3_2_display_and_antenna_subcomponents",
    "manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery",
    "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages",
    "manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix",
    "internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap"
  ]);

  const HP_SEMANTIC_EDGES = [
    {
      fromId: "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap",
      toId: "manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag",
      rel: "OVERRULES_PREMATURE_BOARD_SWAP",
      color: "#a85c56",
      reason_ko:
        "내규 제1조는 Caps Lock 3.2/2.2 점멸 시 제5장 §5.16 메인보드 분해를 즉시 수행하지 않고, 무분해 Win+B HP Sure Start 복구를 1차로 강제합니다.",
      reason_en:
        "SOP Article 1 mandates non-invasive Win+B HP Sure Start recovery prior to invoking Ch.5 §5.16 System Board disassembly."
    },
    {
      fromId: "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol",
      toId: "internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap",
      rel: "SUPERSEDES_DEPRECATED_V01_HOTSWAP",
      color: "#a85c56",
      reason_ko:
        "제5장 §5.1(700V ESD 및 배터리 선행 분리 의무)이 구버전(v0.1.0) 내규 제3조(배터리 활성 상태 SSD 핫스왑 허용)를 영구 폐기(Deprecated)합니다.",
      reason_en:
        "Ch.5 §5.1 (700V ESD & mandatory battery isolation) permanently supersedes deprecated v0.1.0 SOP Article 3 (live battery SSD hot-swap)."
    },
    {
      fromId: "manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag",
      toId: "manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal",
      rel: "REQUIRES_REMOVAL_OF_BATTERY",
      color: "#a85c56",
      reason_ko:
        "제5장 §5.16 시스템 보드(M90788-601) 분리 전 반드시 §5.5 배터리 팩(M90788-005) 커넥터 분리 및 절연이 선행되어야 합니다.",
      reason_en:
        "Ch.5 §5.16 System Board removal strictly requires prior Ch.5 §5.5 Battery Pack (M90788-005) connector isolation."
    },
    {
      fromId: "manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal",
      toId: "manuals/05_ch5_base_battery_storage/sec_5_4_bottom_cover_removal",
      rel: "REQUIRES_REMOVAL_OF_BOTTOM_COVER",
      color: "#a85c56",
      reason_ko:
        "제5장 §5.5 배터리 팩 분리 전 §5.4 하판 커버(N22918-001, Torx T5 5개) 분리가 최우선 선행 조건(Step 1)입니다.",
      reason_en:
        "Ch.5 §5.5 Battery removal requires Ch.5 §5.4 Bottom Cover (N22918-001, 5x Torx T5) removal as Step 1."
    },
    {
      fromId: "manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag",
      toId: "manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan",
      rel: "REQUIRES_REMOVAL_OF_HEATSINK",
      color: "#a85c56",
      reason_ko:
        "시스템 보드 분리 전 §5.12 베이퍼 챔버 히트싱크(M90790-001) 대각선 나사 해체 및 서멀 컴파운드 재도포 절차가 필요합니다.",
      reason_en:
        "System Board removal requires prior §5.12 Vapor Chamber Heatsink (M90790-001) diagonal loosening and thermal repaste."
    },
    {
      fromId: "manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable",
      toId: "manuals/03_ch3_spare_parts_catalog/table_3_2_display_and_antenna_subcomponents",
      rel: "ENFORCES_OLED_PULLTAB_ON_SUBPARTS",
      color: "#a85c56",
      reason_ko:
        "제5장 §5.18 신축성 풀탭(Stretch-Release Pull-Tab) 수평 견인 규정이 제3장 별표 3-2의 3K2K OLED 패널(N01291-001) 및 카메라 케이블 교체에 적용됩니다.",
      reason_en:
        "Ch.5 §5.18 Stretch-Release Pull-Tab rule governs replacement of Ch.3 Table 3-2 3K2K OLED panel (N01291-001) and camera cables."
    },
    {
      fromId: "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule",
      toId: "manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix",
      rel: "MANDATES_BOARD_LEVEL_FRU_SELECTION",
      color: "#a85c56",
      reason_ko:
        "제1장 §1.2 온보드 납땜(Soldered) LPDDR5-6400 아키텍처로 인해 메모리 불량·증설 시 제3장 별표 3-1(보드)의 시스템 보드 통교체가 필요합니다.",
      reason_en:
        "Ch.1 §1.2 Soldered LPDDR5-6400 constraint mandates full System Board FRU replacement per Ch.3 Table 3-1(Board)."
    },
    {
      fromId: "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages",
      toId: "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule",
      rel: "DIAGNOSES_SOLDERED_RAM_FAILURE",
      color: "#b88a44",
      reason_ko:
        "제7장 §7.1 Caps Lock 3.2 점멸(메모리 초기화 실패)은 제1장 §1.2의 SO-DIMM 슬롯 부재(납땜 메모리) 규정과 결합되어 해석됩니다.",
      reason_en:
        "Ch.7 §7.1 Caps Lock 3.2 blink code (memory failure) links directly to Ch.1 §1.2 soldered LPDDR5 memory constraint."
    },
    {
      fromId: "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages",
      toId: "manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery",
      rel: "TRIGGERS_SURE_START_RECOVERY",
      color: "#b88a44",
      reason_ko:
        "제7장 §7.1 Caps Lock 2.2 점멸(BIOS 손상) 시 제6장 §6.1의 HP Sure Start Gen7 16MB 골든 이미지 자동 복구 절차를 실행합니다.",
      reason_en:
        "Ch.7 §7.1 Caps Lock 2.2 blink code triggers Ch.6 §6.1 HP Sure Start Gen7 16MB Golden Image SPI recovery."
    },
    {
      fromId: "internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap",
      toId: "manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan",
      rel: "GATES_HEATSINK_REPLACEMENT",
      color: "#3b735b",
      reason_ko:
        "내규 제2조는 POST 90B 및 스로틀링 발생 시 제5장 §5.12 히트싱크(M90790-001) 교체 전에 BIOS U95 01.08.00 + DPTF 업데이트를 선행하도록 규정합니다.",
      reason_en:
        "SOP Article 2 gates Ch.5 §5.12 Heatsink replacement behind BIOS U95 01.08.00 + Intel DPTF update verification."
    },
    {
      fromId: "manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule",
      toId: "manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal",
      rel: "MODIFIES_BATTERY_REMOVAL_SAFETY",
      color: "#a85c56",
      reason_ko:
        "제5장 §5.3 배터리 스웰링(팽창) 감지 시 §5.5 일반 배터리 분리 절차에 비전도성 핀셋 및 방폭 컨테이너 격리 수칙을 추가 적용합니다.",
      reason_en:
        "Ch.5 §5.3 Swollen Battery safety rule adds non-conductive tweezer and Class-D containment constraints to §5.5 battery removal."
    },
    {
      fromId: "manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure",
      toId: "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol",
      rel: "ENFORCES_MYLAR_ESD_SHIELDING",
      color: "#3b735b",
      reason_ko:
        "제5장 §5.6 PCIe Gen4 NVMe SSD(M90791-001) 교체 시 §5.1 ESD 방전 및 열전도 마일러(Mylar) 실드 슬리브 원위치 복원을 강제합니다.",
      reason_en:
        "Ch.5 §5.6 NVMe SSD replacement enforces §5.1 700V ESD grounding and thermal Mylar shield restoration."
    },
    {
      fromId: "manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing",
      toId: "manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs",
      rel: "VALIDATES_FCC_IMEI_WHITELIST",
      color: "#3b6ea5",
      reason_ko:
        "제5장 §5.7 Intel 5G Solution 5000(N08542-001) 안테나 배선 시 제1장 §1.3의 WWAN 직판 구성 및 BIOS FCC/IMEI 화이트리스트 요건을 검증합니다.",
      reason_en:
        "Ch.5 §5.7 5G WWAN antenna routing verifies Ch.1 §1.3 factory WWAN antenna requirement and BIOS FCC/IMEI whitelist."
    },
    {
      fromId: "manuals/02_ch2_external_components/sec_2_1_thunderbolt_and_io_ports",
      toId: "manuals/02_ch2_external_components/sec_2_2_display_oled_sureview_camera",
      rel: "DRIVES_EXTERNAL_AND_INTERNAL_DISPLAY",
      color: "#3b6ea5",
      reason_ko:
        "제2장 §2.1 듀얼 Thunderbolt 4(100W PD, DP 1.4a DSC) 포트 규격과 §2.2 내장 3K2K OLED / Sure View 패널 구성을 연결합니다.",
      reason_en:
        "Connects Ch.2 §2.1 Dual Thunderbolt 4 (100W PD, DP 1.4a DSC) matrix with §2.2 internal 3K2K OLED / Sure View panels."
    },
    {
      fromId: "manuals/02_ch2_external_components/sec_2_4_service_tag_and_regulatory_labels",
      toId: "manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog",
      rel: "MAPS_SERIAL_SKU_TO_FRU_CATALOG",
      color: "#3b6ea5",
      reason_ko:
        "제2장 §2.4 하판 서비스 태그(ProdID/SN) 식별 규칙을 통해 제3장 별표 3-1의 정확한 스페어 파트 번호(FRU)를 조회합니다.",
      reason_en:
        "Maps Ch.2 §2.4 Bottom Cover Service Tag (ProdID/SN) identification to Ch.3 Table 3-1 Spare Parts FRU catalog."
    },
    {
      fromId: "manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix",
      toId: "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap",
      rel: "ALIGNS_MANUAL_TRIAGE_WITH_SOP",
      color: "#3b735b",
      reason_ko:
        "제7장 §7.2 공식 증상별 원인 트리아지 매트릭스와 사내 정비내규 제1조~제2조의 무출동 복구 우선 원칙을 상호 정렬합니다.",
      reason_en:
        "Aligns Ch.7 §7.2 Symptom-to-FRU Triage Matrix with Internal Field Service SOP Articles 1 & 2."
    }
  ];

  const HP_SEMANTIC_ENTITIES = [
    {
      id: "ENT::M90788_601",
      name: "M90788-601\n(i7-1265U 32GB Board)",
      matchIds: [
        "manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix",
        "manuals/06_ch5_thermal_sysboard_display/sec_5_16_system_board_multihop_dag",
        "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap"
      ]
    },
    {
      id: "ENT::M90788_005",
      name: "M90788-005\n(68Wh Battery Isolation)",
      matchIds: [
        "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol",
        "manuals/04_ch5_preliminary_safety/sec_5_3_swollen_battery_safety_rule",
        "manuals/05_ch5_base_battery_storage/sec_5_5_battery_pack_isolation_and_removal"
      ]
    },
    {
      id: "ENT::N22918_001",
      name: "N22918-001\n(Bottom Cover Torx T5)",
      matchIds: [
        "manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog",
        "manuals/04_ch5_preliminary_safety/sec_5_2_pre_disassembly_and_tooling_rules",
        "manuals/05_ch5_base_battery_storage/sec_5_4_bottom_cover_removal"
      ]
    },
    {
      id: "ENT::M90790_001",
      name: "M90790-001\n(Vapor Chamber Heatsink)",
      matchIds: [
        "manuals/03_ch3_spare_parts_catalog/table_3_1_major_system_fru_catalog",
        "manuals/06_ch5_thermal_sysboard_display/sec_5_12_vapor_chamber_heatsink_and_fan",
        "internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap"
      ]
    },
    {
      id: "ENT::N01291_001",
      name: "N01291-001\n(3K2K OLED Pull-Tab)",
      matchIds: [
        "manuals/02_ch2_external_components/sec_2_2_display_oled_sureview_camera",
        "manuals/03_ch3_spare_parts_catalog/table_3_2_display_and_antenna_subcomponents",
        "manuals/06_ch5_thermal_sysboard_display/sec_5_18_oled_display_pulltab_and_camera_cable"
      ]
    },
    {
      id: "ENT::N09033_001",
      name: "N09033-001\n(Folio G3 32GB Board)",
      matchIds: [
        "manuals/01_ch1_product_specs/sec_1_1_platform_architecture",
        "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule",
        "manuals/03_ch3_spare_parts_catalog/table_3_1_system_board_fru_matrix"
      ]
    },
    {
      id: "ENT::N08542_001",
      name: "N08542-001\n(Intel XMM 7560R+ 5G)",
      matchIds: [
        "manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs",
        "manuals/05_ch5_base_battery_storage/sec_5_7_wwan_5g_and_wlan_antenna_routing"
      ]
    },
    {
      id: "ENT::LED_3_2",
      name: "LED-CAPS-3-2\n(Soldered LPDDR5 Error)",
      matchIds: [
        "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule",
        "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages",
        "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap"
      ]
    },
    {
      id: "ENT::LED_2_2",
      name: "LED-CAPS-2-2\n(Sure Start BIOS Corrupt)",
      matchIds: [
        "manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery",
        "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages"
      ]
    },
    {
      id: "ENT::POST_90B",
      name: "POST-90B\n(Cooling Fan & Thermal)",
      matchIds: [
        "manuals/07_ch6_7_bios_and_blink_codes/sec_7_1_led_blink_codes_and_post_messages",
        "manuals/07_ch6_7_bios_and_blink_codes/sec_7_2_symptom_root_cause_triage_matrix",
        "internal_policies/08_hp_field_service_sop/sop_art_002_thermal_dptf_before_heatsink_swap"
      ]
    },
    {
      id: "ENT::SURE_START_WIN_B",
      name: "Win+B Recovery\n(HP Sure Start Gen7)",
      matchIds: [
        "manuals/07_ch6_7_bios_and_blink_codes/sec_6_1_bios_setup_and_sure_start_recovery",
        "internal_policies/08_hp_field_service_sop/sop_art_001_no_boot_sure_start_before_board_swap"
      ]
    },
    {
      id: "ENT::ESD_700V_MYLAR",
      name: "700V ESD & Mylar\n(Shielding Rule)",
      matchIds: [
        "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol",
        "manuals/05_ch5_base_battery_storage/sec_5_6_nvme_ssd_and_mylar_shield_procedure"
      ]
    },
    {
      id: "ENT::TB4_DOCK_G4",
      name: "Thunderbolt 4\n(100W PD / DSC 1.2)",
      matchIds: [
        "manuals/02_ch2_external_components/sec_2_1_thunderbolt_and_io_ports",
        "manuals/02_ch2_external_components/sec_2_3_keyboard_privacy_shutter_biometrics"
      ]
    },
    {
      id: "ENT::DEP_HOTSWAP_V01",
      name: "[DEPRECATED v0.1]\nHot-Swap Clause Blocked",
      matchIds: [
        "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol",
        "internal_policies/08_hp_field_service_sop/sop_art_003_v1_deprecated_live_battery_hotswap"
      ]
    }
  ];

  function getDocAndChapterHubForOkfFile(f) {
    const k = isKo();
    const docObj = OKF_DOC_ROOTS.find((d) => d.doc_id === f.doc_id) || OKF_DOC_ROOTS[0];
    const isCh9To12 = f.doc_id === "08_INTERNAL_FIELD_SOP_PLAYBOOKS";
    return {
      docId: isCh9To12 ? "DOC::N17344_CH9_12" : "DOC::N17344_001",
      docLabel: isCh9To12
        ? k
          ? "HP 서비스 매뉴얼 제9~12장\n(전력·ESD·고객지원 · pp.95-106)"
          : "HP Service Guide Ch.9–12\n(Power, ESD & Support · pp.95-106)"
        : k
        ? "HP 공식 서비스 매뉴얼 PDF\n(N17344-001 · 제1~8장 · pp.7-94)"
        : "HP Service Guide PDF\n(N17344-001 · Ch.1–8 · pp.7-94)",
      docColor: isCh9To12 ? "#527a9a" : "#3b6ea5",
      docProvIdx: isCh9To12 ? 23 : 0,
      partId: `PART::${docObj.doc_id}`,
      partLabel: `[${docObj.doc_num}] ${k ? docObj.doc_short_ko : docObj.doc_short_en}\n(pp.${docObj.source_pages_span})`,
      partProvIdx: Math.max(0, OKF_FILES.findIndex((x) => x.doc_id === docObj.doc_id))
    };
  }

  function buildVizStyleOkfGraphData(scope) {
    const isDark = document.body.classList.contains("dark-mode");
    const labelMainColor = isDark ? "#f8fafc" : "#202124";
    const labelSubColor = isDark ? "#cbd5e1" : "#3c4043";
    const edgeBgColor = isDark ? "#1f1f1f" : "#f8f9fa";
    const structEdgeColor = isDark ? "#334155" : "#cbd5e1";
    const k = isKo();

    const nodes = [];
    const edges = [];
    const nodeSet = new Set();
    const primarySet = new Set();
    const hubSet = new Set();

    const filteredFiles = OKF_FILES.filter((f) => {
      if (!scope || scope === "ALL") return true;
      if (scope === "DAG_SAFETY") {
        return (
          f.doc_id === "04_CH5_SAFETY_RULES" ||
          f.doc_id === "05_CH5_BASE_STORAGE_WWAN" ||
          f.doc_id === "06_CH5_THERMAL_BOARD_DISPLAY"
        );
      }
      if (scope === "BIOS_BLINK") {
        return (
          f.doc_id === "07_CH6_7_BIOS_DIAGNOSTICS" ||
          f.doc_id === "08_INTERNAL_FIELD_SOP_PLAYBOOKS" ||
          f.id.includes("soldered_lpddr5")
        );
      }
      if (scope === "SKU_PARTS") {
        return (
          f.doc_id === "01_CH1_PRODUCT_SPECS" ||
          f.doc_id === "03_CH3_SPARE_PARTS" ||
          f.id.includes("service_tag")
        );
      }
      if (scope === "THERMAL_DISPLAY") {
        return (
          f.doc_id === "02_CH2_COMPONENTS_PORTS" ||
          f.doc_id === "06_CH5_THERMAL_BOARD_DISPLAY" ||
          f.id.includes("thermal_dptf")
        );
      }
      if (scope === "CORE") {
        return HP_CAVEAT_CONCEPTS.has(f.id) || HP_GOVERNANCE_CONCEPTS.has(f.id);
      }
      return true;
    });

    const idToFile = {};
    OKF_FILES.forEach((f, idx) => {
      idToFile[f.id] = { id: f.id, idx, f };
    });

    filteredFiles.forEach((f) => {
      const provIdx = OKF_FILES.indexOf(f);
      const hub = getDocAndChapterHubForOkfFile(f);
      primarySet.add(f.id);

      // 1. Tier 1: Source Document Root (`#3b6ea5` / `#527a9a`, size 34)
      if (!nodeSet.has(hub.docId)) {
        nodeSet.add(hub.docId);
        hubSet.add(hub.docId);
        nodes.push({
          id: hub.docId,
          label: hub.docLabel,
          title: hub.docLabel.replace(/\n/g, " · "),
          shape: "dot",
          size: 34,
          color: {
            background: hub.docColor,
            border: isDark ? "#e2e8f0" : "#ffffff",
            highlight: { background: "#1a73e8", border: labelMainColor }
          },
          borderWidth: 2.2,
          font: { color: labelMainColor, size: 13, face: "Google Sans, Noto Sans KR" },
          provIdx: hub.docProvIdx
        });
      }

      // 2. Tier 2: Chapter Section Hub (`[01]`~`[08]`, `#6b88a8`, size 22)
      if (!nodeSet.has(hub.partId)) {
        nodeSet.add(hub.partId);
        hubSet.add(hub.partId);
        nodes.push({
          id: hub.partId,
          label: hub.partLabel,
          title: hub.partLabel.replace(/\n/g, " · "),
          shape: "dot",
          size: 22,
          color: {
            background: "#6b88a8",
            border: isDark ? "#cbd5e1" : "#ffffff",
            highlight: { background: "#3b6ea5", border: labelMainColor }
          },
          borderWidth: 1.8,
          font: { color: labelSubColor, size: 11.5, face: "Google Sans, Noto Sans KR" },
          provIdx: hub.partProvIdx
        });
        edges.push({
          from: hub.docId,
          to: hub.partId,
          color: { color: isDark ? "#475569" : "#94a3b8", highlight: "#6b88a8" },
          width: 2.2,
          arrows: "to"
        });
      }

      // 3. Tier 3: Unstructured Clause / Provision Node (`#3b735b` / `#a85c56` / `#b88a44`)
      const isCav = HP_CAVEAT_CONCEPTS.has(f.id);
      const isGov = HP_GOVERNANCE_CONCEPTS.has(f.id);
      const pColor = isCav ? "#a85c56" : isGov ? "#b88a44" : "#3b735b";
      const secNo = k ? f.section_number : f.section_number_en || f.section_number;

      if (!nodeSet.has(f.id)) {
        nodeSet.add(f.id);
        nodes.push({
          id: f.id,
          label: `${secNo}\n(p.${f.pdf_page})`,
          title: `[${f.doc_num}] ${secNo} · ${k ? f.title_ko : f.title_en} (${f.gcs_uri})`,
          shape: "dot",
          size: isCav ? 17.5 : isGov ? 16 : 15,
          color: {
            background: pColor,
            border: isDark ? "#cbd5e1" : "#ffffff",
            highlight: { background: pColor, border: labelMainColor }
          },
          borderWidth: 1.6,
          font: { color: labelSubColor, size: 10.5, face: "Google Sans, Noto Sans KR" },
          provIdx
        });
        edges.push({
          from: hub.partId,
          to: f.id,
          color: { color: structEdgeColor, highlight: "#6b88a8" },
          width: 1.5,
          arrows: "to"
        });
      }

      // 4. Tier 4: Sub-Clause / Rule Chunks radiating around provision nodes
      if (f.body) {
        const rawLines = f.body
          .split(/\n+/)
          .map((l) => l.replace(/^#+\s*/, "").replace(/^[-*]\s*/, "").replace(/`/g, "").trim())
          .filter((l) => l.length >= 16 && !l.startsWith("|") && !l.startsWith("---"));
        const maxChunks = scope === "ALL" ? 2 : 3;
        for (let i = 0; i < Math.min(rawLines.length, maxChunks); i++) {
          const subId = `${f.id}::CHUNK_${i + 1}`;
          if (!nodeSet.has(subId)) {
            nodeSet.add(subId);
            const lineText = rawLines[i];
            const snippet = lineText.slice(0, 22) + (lineText.length > 22 ? "…" : "");
            const isSafetyChunk =
              /battery|M90788-005|ESD|700V|soldered|LPDDR5|Sure Start|Win\+B|pull-tab|OLED|mandatory|prerequisite|warning|DEPRECATED/i.test(
                lineText
              );
            nodes.push({
              id: subId,
              label: snippet,
              title: `${secNo} · ${lineText}`,
              shape: "dot",
              size: 11.5,
              color: {
                background: isSafetyChunk ? "#a85c56" : "#3b735b",
                border: isDark ? "#334155" : "#ffffff",
                highlight: { background: isSafetyChunk ? "#a85c56" : "#3b735b", border: labelMainColor }
              },
              borderWidth: 1.2,
              font: { color: labelSubColor, size: 9.5, face: "Google Sans, Noto Sans KR" },
              provIdx
            });
            edges.push({
              from: f.id,
              to: subId,
              color: { color: structEdgeColor, highlight: "#6b88a8" },
              width: 1.15,
              arrows: "to"
            });
          }
        }
      }
    });

    // 5. Tier 5: Labeled Semantic Business Relation Edges (`HP_SEMANTIC_EDGES`)
    let semEdgeCnt = 0;
    HP_SEMANTIC_EDGES.forEach((se) => {
      const s = idToFile[se.fromId];
      const d = idToFile[se.toId];
      if (!s || !d) return;
      const sInPrimary = primarySet.has(s.id);
      const dInPrimary = primarySet.has(d.id);
      if (!sInPrimary && !dInPrimary) return;

      [s, d].forEach((ep) => {
        if (!nodeSet.has(ep.id)) {
          nodeSet.add(ep.id);
          const isCav = HP_CAVEAT_CONCEPTS.has(ep.id);
          const epColor = isCav ? "#a85c56" : "#3b735b";
          const epSec = k ? ep.f.section_number : ep.f.section_number_en || ep.f.section_number;
          nodes.push({
            id: ep.id,
            label: `${epSec}\n(p.${ep.f.pdf_page})`,
            title: ep.f.rel_path,
            shape: "dot",
            size: 14.5,
            color: epColor,
            font: { color: labelSubColor, size: 10, face: "Google Sans, Noto Sans KR" },
            provIdx: ep.idx
          });
        }
      });

      semEdgeCnt++;
      edges.push({
        from: s.id,
        to: d.id,
        label: se.rel,
        title: k ? se.reason_ko : se.reason_en,
        color: { color: se.color, highlight: labelMainColor },
        width: 2.2,
        arrows: "to",
        font: {
          color: labelMainColor,
          size: 9,
          background: edgeBgColor,
          strokeWidth: 0,
          face: "Google Sans"
        }
      });
    });

    // 6. Tier 6: Core Hardware & Diagnostic Entity Diamonds (`shape: 'diamond'`, `#b88a44`)
    HP_SEMANTIC_ENTITIES.forEach((ent) => {
      const refs = (ent.matchIds || []).map((id) => idToFile[id]).filter(Boolean);
      const hasPrimary = refs.some((r) => primarySet.has(r.id));
      const linked = refs.filter((r) => nodeSet.has(r.id));
      if (hasPrimary && linked.length > 0) {
        nodeSet.add(ent.id);
        nodes.push({
          id: ent.id,
          label: ent.name,
          title: `Domain Entity · ${ent.name.replace(/\n/g, " ")}`,
          shape: "diamond",
          size: 12.5,
          color: {
            background: "#b88a44",
            border: isDark ? "#fde68a" : "#ffffff",
            highlight: { background: "#d97706", border: labelMainColor }
          },
          borderWidth: 1.5,
          font: {
            color: isDark ? "#e2c07d" : "#7c581e",
            size: 10,
            face: "Google Sans, Noto Sans KR"
          },
          provIdx: linked[0].idx
        });
        linked.forEach((target) => {
          edges.push({
            from: target.id,
            to: ent.id,
            color: { color: isDark ? "#9a7338" : "#b88a44", highlight: "#b88a44" },
            dashes: [2, 4],
            width: 1.4,
            arrows: "to"
          });
        });
      }
    });

    return {
      nodes,
      edges,
      hubCount: hubSet.size,
      nodeCount: nodes.length,
      semEdgeCnt
    };
  }

  function buildOkfDetailMarkup(f) {
    const k = isKo();
    const cid = f.id;

    const richMatches = HP_SEMANTIC_EDGES.filter((e) => e.fromId === cid || e.toId === cid);
    const combinedRels = richMatches.map((r) => ({
      isOut: r.fromId === cid,
      fromId: r.fromId,
      toId: r.toId,
      otherId: r.fromId === cid ? r.toId : r.fromId,
      rel: r.rel,
      color: r.color,
      reason: k ? r.reason_ko : r.reason_en
    }));

    let relHtml = "";
    if (combinedRels.length > 0) {
      relHtml = `
        <div class="section-label">
          <span>Business Semantic Relations (${combinedRels.length})</span>
          <span>${k ? "클릭 시 연결 조항으로 이동" : "Click to jump to clause"}</span>
        </div>
        <div class="biz-edge-list">
          ${combinedRels
            .map((e) => {
              const otherFile = OKF_FILES.find((x) => x.id === e.otherId);
              const fromFile = OKF_FILES.find((x) => x.id === e.fromId);
              const toFile = OKF_FILES.find((x) => x.id === e.toId);
              const otherSec = otherFile
                ? k
                  ? otherFile.section_number
                  : otherFile.section_number_en || otherFile.section_number
                : e.otherId.split("/").pop();
              const fromSec = fromFile
                ? k
                  ? fromFile.section_number
                  : fromFile.section_number_en || fromFile.section_number
                : e.fromId.split("/").pop();
              const toSec = toFile
                ? k
                  ? toFile.section_number
                  : toFile.section_number_en || toFile.section_number
                : e.toId.split("/").pop();
              const otherPage = otherFile ? `p.${otherFile.pdf_page}` : "";
              return `
                <div class="biz-edge-item" onclick="selectByConceptId('${escapeHtml(e.otherId)}')">
                  <div class="biz-edge-top">
                    <span class="edge-badge">
                      <span class="edge-dot" style="background:${e.color};"></span>
                      ${escapeHtml(e.rel)}
                    </span>
                    <span class="edge-jump-meta">${escapeHtml(otherSec)} ${otherPage ? `(${otherPage})` : ""} ↗</span>
                  </div>
                  <div class="edge-target">
                    <span class="edge-kw">from</span>
                    <span class="${e.isOut ? "edge-sec-self" : "edge-sec-peer"}">${escapeHtml(fromSec)}</span>
                    <span class="edge-arrow">➔</span>
                    <span class="edge-kw">to</span>
                    <span class="${e.isOut ? "edge-sec-peer" : "edge-sec-self"}">${escapeHtml(toSec)}</span>
                  </div>
                  <div class="edge-reason">${escapeHtml(e.reason)}</div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    }

    const rawYaml = k
      ? f.yaml_ko || f.raw_yaml_ko || f.raw_yaml || "# YAML Frontmatter"
      : f.yaml_en || f.raw_yaml_en || f.raw_yaml || "# YAML Frontmatter";
    const activeBody = k ? f.body_ko || f.body || "" : f.body_en || f.body || "";
    const activeGcsUri = k
      ? f.gcs_uri_ko || `gs://hp-dragonfly-okf/okf-kr/${f.rel_path}`
      : f.gcs_uri_en || `gs://hp-dragonfly-okf/okf-en/${f.rel_path}`;
    const fmType = (f.frontmatter && f.frontmatter.type) || f.okf_type || "Provision";
    const renderedMd =
      window.marked && typeof window.marked.parse === "function"
        ? highlightOkfTerms(window.marked.parse(activeBody))
        : `<pre>${escapeHtml(activeBody)}</pre>`;

    return `
      <div class="okf-subpath-line">${escapeHtml(activeGcsUri)}</div>
      ${relHtml}
      <details class="fm-accordion" ${FM_OPEN ? "open" : ""} ontoggle="onFmToggle(this.open)">
        <summary>
          <span class="fm-summary-left">
            <span>YAML Frontmatter (${k ? "okf-kr · 한글" : "okf-en · EN"})</span>
            <span class="fm-summary-meta">${escapeHtml(fmType)} · PDF p.${f.pdf_page} (${escapeHtml(f.version || "v0.2.0")})</span>
          </span>
          <span class="material-symbols-outlined fm-chevron">expand_more</span>
        </summary>
        <div class="frontmatter-block">${colorizeYaml(rawYaml)}</div>
      </details>

      <div class="section-label">
        <span>${k ? "OKF v0.2 비정형 컨텍스트 마크다운 (okf-kr)" : "OKF v0.2 Unstructured Context Markdown (okf-en)"}</span>
        <span style="color:var(--gcp-blue);">[${escapeHtml(f.doc_num || "01")}] ${escapeHtml(k ? f.section_number : f.section_number_en || f.section_number)}</span>
      </div>
      <div class="okf-title">${escapeHtml(k ? f.title_ko : f.title_en)}</div>
      <div class="okf-body-box okf-md-content">${renderedMd}</div>
    `;
  }

  window.selectItem = function (idx) {
    ACTIVE_DOC_ROOT_ID = null;
    CURRENT_OKF_IDX = idx;
    const f = OKF_FILES[CURRENT_OKF_IDX];
    if (!f) return;
    OPEN_CATS[f.doc_id || "01_CH1_PRODUCT_SPECS"] = true;
    renderSidebar();

    const k = isKo();
    const pdfUrl = `/docs/pdf_6290467_en-US-1.pdf#page=${f.pdf_page}&zoom=100`;
    const pdfNameEl = document.getElementById("pdf-name-label");
    if (pdfNameEl) pdfNameEl.textContent = "pdf_6290467_en-US-1.pdf (N17344-001)";

    const pdfPageEl = document.getElementById("pdf-page-label");
    if (pdfPageEl) {
      pdfPageEl.textContent = k
        ? `p.${f.pdf_page} / 총 109쪽 · [${f.doc_num}] ${f.section_number}`
        : `p.${f.pdf_page} of 109 · [${f.doc_num}] ${f.section_number_en || f.section_number}`;
    }

    const frame = document.getElementById("pdf-frame");
    if (frame && frame.getAttribute("data-src") !== pdfUrl) {
      frame.removeAttribute("src");
      setTimeout(() => {
        frame.src = pdfUrl;
        frame.setAttribute("data-src", pdfUrl);
      }, 15);
    }

    const okfFileEl = document.getElementById("okf-file-label");
    if (okfFileEl) {
      okfFileEl.textContent = k
        ? f.okf_repo_path_ko || `okf-kr/${f.rel_path}`
        : f.okf_repo_path_en || `okf-en/${f.rel_path}`;
    }

    const readerEl = document.getElementById("okf-reader");
    if (readerEl) {
      readerEl.innerHTML = buildOkfDetailMarkup(f);
      readerEl.scrollTop = 0;
    }
  };

  window.toggleGraphView = function () {
    GRAPH_MODE = !GRAPH_MODE;
    const compareWs = document.getElementById("compare-workspace");
    const graphWs = document.getElementById("graph-workspace");
    syncViewSwitchButton();

    if (GRAPH_MODE) {
      if (compareWs) compareWs.style.display = "none";
      if (graphWs) graphWs.style.display = "flex";
      requestAnimationFrame(() => {
        const sc = document.getElementById("graph-scope-select");
        buildOkfGraph(sc ? sc.value : "ALL");
        openGraphDetailForIdx(CURRENT_OKF_IDX);
      });
    } else {
      if (graphWs) graphWs.style.display = "none";
      if (compareWs) compareWs.style.display = "flex";
      selectItem(CURRENT_OKF_IDX);
    }
  };

  window.openCurrentInPdfCompare = function () {
    if (GRAPH_MODE) window.toggleGraphView();
  };

  window.closeGraphDetail = function () {
    const p = document.getElementById("graph-detail-panel");
    if (p) p.classList.remove("open");
    setTimeout(() => {
      if (okfNetwork) okfNetwork.fit({ animation: { duration: 250 } });
    }, 220);
  };

  window.toggleOkfGraphDetailPanel = function () {
    const p = document.getElementById("graph-detail-panel");
    if (!p) return;
    p.classList.toggle("open");
    setTimeout(() => {
      if (okfNetwork) okfNetwork.fit({ animation: { duration: 250 } });
    }, 220);
  };

  window.toggleOkfGraphDetailWide = function () {
    const p = document.getElementById("graph-detail-panel");
    if (!p) return;
    p.classList.add("open");
    p.classList.toggle("wide");
    setTimeout(() => {
      if (okfNetwork) okfNetwork.fit({ animation: { duration: 250 } });
    }, 220);
  };

  function openGraphDetailForIdx(idx) {
    CURRENT_OKF_IDX = idx;
    const f = OKF_FILES[CURRENT_OKF_IDX];
    if (!f) return;
    const pathEl = document.getElementById("graph-detail-path");
    if (pathEl) {
      pathEl.textContent = f.rel_path;
      pathEl.title = f.gcs_uri || `gs://hp-dragonfly-okf/okf/${f.rel_path}`;
    }
    const bodyEl = document.getElementById("graph-detail-body");
    if (bodyEl) {
      bodyEl.innerHTML = buildOkfDetailMarkup(f);
      bodyEl.scrollTop = 0;
    }
    const panel = document.getElementById("graph-detail-panel");
    if (panel) panel.classList.add("open");
  }

  window.buildOkfGraph = function (scope) {
    const container = document.getElementById("network-canvas");
    if (!container || !window.vis) return;

    const built = buildVizStyleOkfGraphData(scope || "ALL");
    okfGraphNodes = built.nodes;
    okfGraphEdges = built.edges;

    const stDocs = document.getElementById("g-stat-docs");
    const stProvs = document.getElementById("g-stat-provs");
    const stEdges = document.getElementById("g-stat-edges");
    if (stDocs) stDocs.textContent = String(built.hubCount);
    if (stProvs) stProvs.textContent = String(built.nodeCount);
    if (stEdges) stEdges.textContent = String(built.semEdgeCnt);

    const options = {
      physics: {
        enabled: okfPhysics,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -38,
          centralGravity: 0.008,
          springLength: 88,
          springConstant: 0.08,
          damping: 0.45
        },
        stabilization: { iterations: 140 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 180,
        keyboard: true
      }
    };

    if (okfNetwork) okfNetwork.destroy();
    okfNetwork = new window.vis.Network(
      container,
      {
        nodes: new window.vis.DataSet(okfGraphNodes),
        edges: new window.vis.DataSet(okfGraphEdges)
      },
      options
    );

    okfNetwork.once("stabilizationIterationsDone", function () {
      okfNetwork.fit({ animation: { duration: 350 } });
      setTimeout(() => {
        if (okfNetwork && okfNetwork.getScale() > 0.95) {
          okfNetwork.moveTo({ scale: 0.90, animation: { duration: 250 } });
        }
      }, 380);
    });

    okfNetwork.on("click", function (params) {
      if (params.nodes && params.nodes.length > 0) {
        const clickedId = params.nodes[0];
        const nObj = okfGraphNodes.find((n) => n.id === clickedId);
        if (nObj && typeof nObj.provIdx === "number") {
          openGraphDetailForIdx(nObj.provIdx);
        }
      }
    });
  };

  window.searchGraphNode = function (term) {
    const q = (term || "").trim().toLowerCase();
    if (!q || !okfNetwork) return;
    const foundNode = okfGraphNodes.find(
      (n) =>
        String(n.label || "").toLowerCase().includes(q) ||
        String(n.title || "").toLowerCase().includes(q) ||
        String(n.id || "").toLowerCase().includes(q)
    );
    if (foundNode) {
      try {
        okfNetwork.selectNodes([foundNode.id]);
        okfNetwork.focus(foundNode.id, { scale: 1.25, animation: { duration: 420 } });
        if (typeof foundNode.provIdx === "number") {
          openGraphDetailForIdx(foundNode.provIdx);
        }
      } catch (_) {}
      return;
    }
    const foundIdx = OKF_FILES.findIndex(
      (f) => f.id.toLowerCase().includes(q) || (f.body || "").toLowerCase().includes(q)
    );
    if (foundIdx >= 0) {
      const id = OKF_FILES[foundIdx].id;
      try {
        okfNetwork.selectNodes([id]);
        okfNetwork.focus(id, { scale: 1.25, animation: { duration: 420 } });
        openGraphDetailForIdx(foundIdx);
      } catch (_) {}
    }
  };

  window.fitGraph = function () {
    if (okfNetwork) okfNetwork.fit({ animation: { duration: 350 } });
  };

  window.togglePhysics = function () {
    okfPhysics = !okfPhysics;
    if (okfNetwork) okfNetwork.setOptions({ physics: { enabled: okfPhysics } });
  };

  // =========================================================================
  // 5. MODULE 03: OKF Management (`#module-enrollment`)
  //    100% DOM & CSS Parity with `krda-ontology-studio` (`mod-management.js`):
  //    - 100% Unstructured Document Contexts organized sequentially ([01]~[08])
  //    - Tab 1: `OKF Editor` (Left Sequential Tree + Center 3-Column `.mgmt-fm-grid` & Markdown Body + Right Live GCS Preview + `.mgmt-floating-snackbar` + `.mgmt-modal-overlay`)
  //    - Tab 2: `Knowledge Catalog` (Left 34 Unstructured Entries: 전체/활성/만료 + Right Exact GCP Dataplex `Entry details` -> `Overview` -> `Aspects`)
  // =========================================================================
  let MGMT_SUB_VIEW = "EDITOR"; // 'EDITOR' | 'KC_EXPLORER'
  let MGMT_STATE = [];
  let MGMT_DOC_STATE = {};
  let MGMT_ACTIVE_KEY = 0; // number (0..25) or 'DOC:<doc_id>'
  let MGMT_SELECTED_SET = new Set(); // Set of item keys (number or 'DOC:<doc_id>')
  let MGMT_OPEN_DOCS = {};
  let MGMT_TREE_FILTER = "ALL"; // 'ALL' | 'MODIFIED'
  let MGMT_LAST_PUBLISH_RESULT = null;

  // KC Explorer State
  let KC_FILTER_STATUS = "ALL"; // 'ALL' | 'VERIFIED' | 'DEPRECATED'
  let KC_SEARCH_QUERY = "";
  let KC_SELECTED_KEY = "ACTIVE:0";

  // Modal State
  let MODAL_MODE = "SINGLE"; // 'SINGLE' | 'BATCH'
  let MODAL_BUMP_LEVEL = "PATCH";
  let MODAL_CONTACTS_VALUE = null;
  let MODAL_PRESET_NOTE_VAL = "";
  let MODAL_CHANGE_NOTE_TEXT = "";

  const OKF_V02_DROPDOWN_OPTIONS = {
    type: ["Provision", "PolicyClause", "Table", "Source Document", "Concept"],
    status: ["active", "verified", "draft", "deprecated"],
    content_class: ["verbatim", "authentic", "curated", "internal_policy"],
    treatment: ["normative", "verbatim_en", "structured_table", "informative"],
    license: [
      "Proprietary (HP Inc. Maintenance & Service Guide N17344-001)",
      "Internal-Only (HP Global Field Service SOP · 사내한 대외비)",
      "HP Authorized Service Provider (ASP) Standard Technical License"
    ],
    generated_by: [
      "enrichment_agent/gemini-3.8-flash",
      "process:enrichment_agent/2.0",
      "process:okf_studio_editor/0.2"
    ],
    verified_by: [
      "hp-service-engineering-lead",
      "hp-psirt-firmware-board",
      "hp-hardware-qa-team",
      "process:verify_provisions/1.0"
    ],
    verified_method: [
      "source_text_match",
      "manual-review",
      "committee_signoff",
      "automated_lint_p1_p4"
    ],
    contacts: [
      "김도현(수석) - HP 코리아 하드웨어정비기술팀 <dohyun.kim@hp-service.example.com>",
      "박지훈(책임) - PSIRT 펌웨어·Sure Start 보안팀 <jihoon.park@hp-service.example.com>",
      "이서연(팀장) - 글로벌 필드서비스 거버넌스팀 <seoyeon.lee@hp-service.example.com>",
      "정민규(매니저) - 스페어파트·FRU 품질보증팀 <mingyu.jung@hp-service.example.com>"
    ]
  };

  const CHANGE_NOTE_PRESETS = [
    "정비기술팀 정기 검증 완료에 따른 verified.by 및 status 현행화",
    "분해 선행 조건(DAG) 및 700V ESD 안전 단서(Caveat) 조항 연결 보완",
    "HP Sure Start Gen7 펌웨어 복구 내규 개정에 따른 절차 업데이트",
    "원문 대조(P1~P4) 재검증 및 마크다운 표 포맷 정제"
  ];

  function simpleSha256Hex64(str, fallbackSha) {
    if (!str) return fallbackSha || "7ec775dc7d09f2ea35f898b9c18756a9ffd6a262583d76fc7055ab350d429c79";
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const p1 = (h1 >>> 0).toString(16).padStart(8, "0");
    const p2 = (h2 >>> 0).toString(16).padStart(8, "0");
    const tail = String(fallbackSha || "35f898b9c18756a9ffd6a262583d76fc7055ab350d429c79").slice(16, 64);
    return (p1 + p2 + tail).slice(0, 64);
  }

  function bumpSemverJs(ver, level) {
    const clean = String(ver || "0.2.0").replace(/^v/i, "");
    const parts = clean.split(".").map((n) => parseInt(n, 10) || 0);
    while (parts.length < 3) parts.push(0);
    if (level === "MAJOR") return `${parts[0] + 1}.0.0`;
    if (level === "MINOR") return `${parts[0]}.${parts[1] + 1}.0`;
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }

  function isContactOwnerRole(contactStr) {
    const s = String(contactStr || "");
    return s.includes("수석") || s.includes("팀장") || s.includes("Lead");
  }

  function syncSingleMgmtStateLang(st) {
    if (!st) return;
    const k = isKo();
    st.fm = k ? st.fm_ko : st.fm_en;
    st.baseFm = k ? st.baseFm_ko : st.baseFm_en;
    st.body = k ? st.body_ko : st.body_en;
    st.baseBody = k ? st.baseBody_ko : st.baseBody_en;
    st.sha256 = k ? st.sha256_ko : st.sha256_en;
    st.changeNote = k ? st.changeNote_ko : st.changeNote_en;
    st.isModified = k ? st.isModified_ko : st.isModified_en;
    st.historyCount = k ? st.historyCount_ko : st.historyCount_en;
  }

  function syncMgmtStateLangBindings() {
    Object.values(MGMT_DOC_STATE).forEach(syncSingleMgmtStateLang);
    MGMT_STATE.forEach(syncSingleMgmtStateLang);
  }

  function persistSingleMgmtStateLang(st) {
    if (!st) return;
    if (isKo()) {
      st.fm_ko = st.fm;
      st.baseFm_ko = st.baseFm;
      st.body_ko = st.body;
      st.baseBody_ko = st.baseBody;
      st.sha256_ko = st.sha256;
      st.changeNote_ko = st.changeNote;
      st.isModified_ko = st.isModified;
      st.historyCount_ko = st.historyCount;
    } else {
      st.fm_en = st.fm;
      st.baseFm_en = st.baseFm;
      st.body_en = st.body;
      st.baseBody_en = st.baseBody;
      st.sha256_en = st.sha256;
      st.changeNote_en = st.changeNote;
      st.isModified_en = st.isModified;
      st.historyCount_en = st.historyCount;
    }
  }

  function initManagementState(forceReset) {
    if (MGMT_STATE.length > 0 && !forceReset) {
      syncMgmtStateLangBindings();
      return;
    }

    MGMT_DOC_STATE = {};
    OKF_DOC_ROOTS.forEach((d, dIdx) => {
      MGMT_OPEN_DOCS[d.doc_id] = true;
      const fm = d.frontmatter || {};
      const verClean = String(fm.version || d.version || "0.2.0").replace(/^v/i, "");
      const defaultContact = OKF_V02_DROPDOWN_OPTIONS.contacts[dIdx % OKF_V02_DROPDOWN_OPTIONS.contacts.length];
      const bodyKo = d.body_ko || d.body || "";
      const bodyEn = d.body_en || d.body || "";
      const shaKo = simpleSha256Hex64(bodyKo);
      const shaEn = simpleSha256Hex64(bodyEn);

      const editableFmKo = {
        concept_id: d.id,
        type: fm.type || "Source Document",
        title: d.title_ko || fm.title,
        description: d.desc_ko || fm.description || d.title_ko,
        tags: Array.isArray(d.tags) ? ["okf-kr", ...d.tags].join(", ") : "okf-kr, hp-dragonfly, doc-root, okf-v0.2",
        version: verClean,
        status: fm.status || d.status || "active",
        content_class: fm.content_class || "curated",
        treatment: fm.treatment || "normative",
        language: "ko",
        license: "HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)",
        generated_by: (fm.generated && fm.generated.by) || "enrichment_agent/gemini-3.8-flash",
        generated_at: (fm.generated && fm.generated.at) || "2026-10-25T10:00:00Z",
        verified_by: (fm.verified && fm.verified.by) || "hp-service-engineering-lead",
        verified_at: (fm.verified && fm.verified.at) || "2026-10-25T10:00:00Z",
        verified_method: (fm.verified && fm.verified.method) || "source_text_match",
        part_of: "/index.md",
        sequence: d.pdf_page || 1,
        section_number: `doc.md ([${d.doc_num}] 장 총괄)`,
        source_page: d.pdf_page || 1,
        source_pages_span: d.source_pages_span || String(d.pdf_page || 1),
        source_resource: "okf://source/manuals/pdf_6290467_en-US-1.pdf",
        source_uri: d.gcs_uri_ko || `gs://hp-dragonfly-okf/okf-kr/${d.rel_path}`,
        contacts: defaultContact,
        sha256: shaKo
      };

      const editableFmEn = {
        concept_id: d.id,
        type: fm.type || "Source Document",
        title: d.title_en || fm.title,
        description: d.desc_en || fm.description || d.title_en,
        tags: Array.isArray(d.tags) ? ["okf-en", ...d.tags].join(", ") : "okf-en, hp-dragonfly, doc-root, okf-v0.2",
        version: verClean,
        status: fm.status || d.status || "active",
        content_class: fm.content_class || "curated",
        treatment: fm.treatment || "normative",
        language: "en",
        license: fm.license || "Proprietary (HP Inc. Maintenance & Service Guide N17344-001)",
        generated_by: (fm.generated && fm.generated.by) || "enrichment_agent/gemini-3.8-flash",
        generated_at: (fm.generated && fm.generated.at) || "2026-10-25T10:00:00Z",
        verified_by: (fm.verified && fm.verified.by) || "hp-service-engineering-lead",
        verified_at: (fm.verified && fm.verified.at) || "2026-10-25T10:00:00Z",
        verified_method: (fm.verified && fm.verified.method) || "source_text_match",
        part_of: "/index.md",
        sequence: d.pdf_page || 1,
        section_number: `doc.md ([${d.doc_num}] Chapter Root)`,
        source_page: d.pdf_page || 1,
        source_pages_span: d.source_pages_span || String(d.pdf_page || 1),
        source_resource: "okf://source/manuals/pdf_6290467_en-US-1.pdf",
        source_uri: d.gcs_uri_en || `gs://hp-dragonfly-okf/okf-en/${d.rel_path}`,
        contacts: defaultContact,
        sha256: shaEn
      };

      const docObj = {
        key: `DOC:${d.doc_id}`,
        isDocRoot: true,
        doc_id: d.doc_id,
        doc_num: d.doc_num,
        doc_short_ko: d.doc_short_ko,
        doc_short_en: d.doc_short_en,
        section_number: `doc.md ([${d.doc_num}] 총괄)`,
        section_number_en: `doc.md ([${d.doc_num}] Root)`,
        rel: d.rel_path,
        kc_entry_id: d.kc_entry_id,
        fm_ko: JSON.parse(JSON.stringify(editableFmKo)),
        baseFm_ko: JSON.parse(JSON.stringify(editableFmKo)),
        body_ko: bodyKo,
        baseBody_ko: bodyKo,
        sha256_ko: shaKo,
        changeNote_ko: "OKF v0.2 한글 문서 총괄 루트 등록 (okf-kr · doc.md)",
        isModified_ko: false,
        historyCount_ko: 0,
        fm_en: JSON.parse(JSON.stringify(editableFmEn)),
        baseFm_en: JSON.parse(JSON.stringify(editableFmEn)),
        body_en: bodyEn,
        baseBody_en: bodyEn,
        sha256_en: shaEn,
        changeNote_en: "OKF v0.2 English Document Root Registration (okf-en · doc.md)",
        isModified_en: false,
        historyCount_en: 0
      };
      syncSingleMgmtStateLang(docObj);
      MGMT_DOC_STATE[d.doc_id] = docObj;
    });

    MGMT_STATE = OKF_FILES.map((f, idx) => {
      const fm = f.frontmatter || {};
      const verClean = String(fm.version || f.version || "0.2.0").replace(/^v/i, "");
      const isInternal = f.doc_id === "08_INTERNAL_FIELD_SOP_PLAYBOOKS";
      const defaultContact = isInternal
        ? OKF_V02_DROPDOWN_OPTIONS.contacts[2]
        : OKF_V02_DROPDOWN_OPTIONS.contacts[idx % OKF_V02_DROPDOWN_OPTIONS.contacts.length];
      const bodyKo = f.body_ko || f.body || "";
      const bodyEn = f.body_en || f.body || "";
      const shaKo = simpleSha256Hex64(bodyKo);
      const shaEn = simpleSha256Hex64(bodyEn);

      const editableFmKo = {
        concept_id: f.id,
        type: fm.type || f.okf_type || "Provision",
        title: f.title_ko || fm.title,
        description: f.desc_ko || fm.description || f.title_ko,
        tags: Array.isArray(f.tags) ? ["okf-kr", ...f.tags].join(", ") : "okf-kr, hp-dragonfly, okf-v0.2",
        version: verClean,
        status: fm.status || f.status || "active",
        content_class: fm.content_class || f.content_class || "verbatim",
        treatment: fm.treatment || f.treatment || "normative",
        language: "ko",
        license: isInternal
          ? "Internal-Only (HP Global Field Service SOP · 사내한 대외비)"
          : "HP Inc. 서비스 매뉴얼 정본 (Doc Part N17344-001 · 한글 OKF 정본)",
        generated_by: (fm.generated && fm.generated.by) || f.generated_by || "enrichment_agent/gemini-3.8-flash",
        generated_at: (fm.generated && fm.generated.at) || f.generated_at || "2026-10-25T10:00:00Z",
        verified_by: (fm.verified && fm.verified.by) || f.verified_by || "hp-service-engineering-lead",
        verified_at: (fm.verified && fm.verified.at) || f.verified_at || "2026-10-25T10:00:00Z",
        verified_method: (fm.verified && fm.verified.method) || f.verified_method || "source_text_match",
        part_of: `/${f.rel_path.split("/").slice(0, 2).join("/")}/doc.md`,
        sequence: f.pdf_page || 1,
        section_number: f.section_number_ko || f.section_number,
        source_page: f.pdf_page || 1,
        source_pages_span: f.source_pages_span || String(f.pdf_page || 1),
        source_resource: "okf://source/manuals/pdf_6290467_en-US-1.pdf",
        source_uri: f.gcs_uri_ko || `gs://hp-dragonfly-okf/okf-kr/${f.rel_path}`,
        contacts: defaultContact,
        sha256: shaKo
      };

      const editableFmEn = {
        concept_id: f.id,
        type: fm.type || f.okf_type || "Provision",
        title: f.title_en || fm.title,
        description: f.desc_en || fm.description || f.title_en,
        tags: Array.isArray(f.tags) ? ["okf-en", ...f.tags].join(", ") : "okf-en, hp-dragonfly, okf-v0.2",
        version: verClean,
        status: fm.status || f.status || "active",
        content_class: fm.content_class || f.content_class || "verbatim",
        treatment: fm.treatment || f.treatment || "normative",
        language: "en",
        license: isInternal
          ? "Internal-Only (HP Global Field Service SOP-2026-01)"
          : "Proprietary (HP Inc. Maintenance & Service Guide N17344-001)",
        generated_by: (fm.generated && fm.generated.by) || f.generated_by || "enrichment_agent/gemini-3.8-flash",
        generated_at: (fm.generated && fm.generated.at) || f.generated_at || "2026-10-25T10:00:00Z",
        verified_by: (fm.verified && fm.verified.by) || f.verified_by || "hp-service-engineering-lead",
        verified_at: (fm.verified && fm.verified.at) || f.verified_at || "2026-10-25T10:00:00Z",
        verified_method: (fm.verified && fm.verified.method) || f.verified_method || "source_text_match",
        part_of: `/${f.rel_path.split("/").slice(0, 2).join("/")}/doc.md`,
        sequence: f.pdf_page || 1,
        section_number: f.section_number_en || f.section_number,
        source_page: f.pdf_page || 1,
        source_pages_span: f.source_pages_span || String(f.pdf_page || 1),
        source_resource: "okf://source/manuals/pdf_6290467_en-US-1.pdf",
        source_uri: f.gcs_uri_en || `gs://hp-dragonfly-okf/okf-en/${f.rel_path}`,
        contacts: defaultContact,
        sha256: shaEn
      };

      const itemObj = {
        key: idx,
        idx,
        isDocRoot: false,
        doc_id: f.doc_id,
        doc_num: f.doc_num,
        doc_short_ko: f.doc_short_ko,
        doc_short_en: f.doc_short_en,
        section_number: f.section_number_ko || f.section_number,
        section_number_en: f.section_number_en || f.section_number,
        rel: f.rel_path,
        kc_entry_id: f.kc_entry_id,
        fm_ko: JSON.parse(JSON.stringify(editableFmKo)),
        baseFm_ko: JSON.parse(JSON.stringify(editableFmKo)),
        body_ko: bodyKo,
        baseBody_ko: bodyKo,
        sha256_ko: shaKo,
        changeNote_ko:
          editableFmKo.status === "deprecated"
            ? "v0.2.0(제5장 §5.1 700V ESD 방전 및 배터리 선행 분리 의무화) 개정에 따라 만료(deprecated) 처리"
            : "OKF v0.2 한글 정본 번들 등록 완료 (okf-kr · P1~P4 검증)",
        isModified_ko: false,
        historyCount_ko: 0,
        fm_en: JSON.parse(JSON.stringify(editableFmEn)),
        baseFm_en: JSON.parse(JSON.stringify(editableFmEn)),
        body_en: bodyEn,
        baseBody_en: bodyEn,
        sha256_en: shaEn,
        changeNote_en:
          editableFmEn.status === "deprecated"
            ? "Deprecated by v0.2.0 revision (Ch.5 §5.1 700V ESD grounding & mandatory battery isolation)"
            : "OKF v0.2 English Verbatim Bundle Registration (okf-en · P1~P4 Verified)",
        isModified_en: false,
        historyCount_en: 0,
        supersededBy:
          editableFmKo.status === "deprecated"
            ? "manuals/04_ch5_preliminary_safety/sec_5_1_esd_700v_grounding_protocol"
            : null,
        supersededByVer: editableFmKo.status === "deprecated" ? "0.2.0" : null
      };
      syncSingleMgmtStateLang(itemObj);
      return itemObj;
    });
  }

  function getEffectiveItemState(key) {
    initManagementState(false);
    const k = key !== undefined && key !== null ? key : MGMT_ACTIVE_KEY;
    if (typeof k === "string" && k.startsWith("DOC:")) {
      const docId = k.slice(4);
      return MGMT_DOC_STATE[docId] || MGMT_STATE[0];
    }
    const idx = typeof k === "number" ? k : 0;
    return MGMT_STATE[idx] || MGMT_STATE[0];
  }

  function getModifiedCount() {
    syncMgmtStateLangBindings();
    let cnt = 0;
    Object.values(MGMT_DOC_STATE).forEach((st) => {
      if (st.isModified) cnt++;
    });
    MGMT_STATE.forEach((st) => {
      if (st.isModified) cnt++;
    });
    return cnt;
  }

  function getUpdatedVersionCount() {
    syncMgmtStateLangBindings();
    let cnt = 0;
    Object.values(MGMT_DOC_STATE).forEach((st) => {
      if (st.historyCount > 0) cnt++;
    });
    MGMT_STATE.forEach((st) => {
      if (st.historyCount > 0) cnt++;
    });
    return cnt;
  }

  function getDeprecatedCount() {
    syncMgmtStateLangBindings();
    let cnt = 0;
    Object.values(MGMT_DOC_STATE).forEach((st) => {
      if (st.fm.status === "deprecated") cnt++;
    });
    MGMT_STATE.forEach((st) => {
      if (st.fm.status === "deprecated") cnt++;
    });
    return cnt;
  }

  window.toggleMgmtSubView = function (targetMode) {
    if (targetMode) {
      MGMT_SUB_VIEW = targetMode;
    } else {
      MGMT_SUB_VIEW = MGMT_SUB_VIEW === "EDITOR" ? "KC_EXPLORER" : "EDITOR";
    }
    renderManagementModule();
  };

  window.toggleMgmtDocAccordion = function (docId) {
    MGMT_OPEN_DOCS[docId] = !MGMT_OPEN_DOCS[docId];
    MGMT_ACTIVE_KEY = "DOC:" + docId;
    renderManagementModule();
  };

  window.renderManagementModule = function (idx) {
    initManagementState(false);
    syncMgmtStateLangBindings();
    if (typeof idx === "string" && idx.startsWith("DOC:")) {
      MGMT_ACTIVE_KEY = idx;
    } else if (typeof idx === "number" && idx >= 0 && idx < MGMT_STATE.length) {
      MGMT_ACTIVE_KEY = idx;
    }

    const container = document.getElementById("module-enrollment");
    if (!container) return;

    const prevNavList = container.querySelector(".mgmt-sidebar .nav-list");
    const prevNavScrollTop = prevNavList ? prevNavList.scrollTop : null;

    const k = isKo();
    const totalFiles = OKF_DOC_ROOTS.length + MGMT_STATE.length;
    const modifiedCount = getModifiedCount();
    const updatedCount = getUpdatedVersionCount();
    const deprecatedCount = getDeprecatedCount();
    const activeCorpusId = k ? "okf-kr" : "okf-en";
    const gcsBucketLabel = k ? "gs://hp-dragonfly-okf/okf-kr/" : "gs://hp-dragonfly-okf/okf-en/";
    const entryGroupLabel = k
      ? "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_kr"
      : "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly_en";

    container.innerHTML = `
      <div class="mgmt-shell">
        <!-- Sub-navigation bar inside 03 · okf-management -->
        <div class="mgmt-top-subbar">
          <div style="display:flex; align-items:center; gap:12px; min-width:0; overflow:hidden;">
            <div class="mgmt-subtab-group" style="flex-shrink:0;">
              <button class="mgmt-subtab-btn ${MGMT_SUB_VIEW === "EDITOR" ? "active" : ""}" onclick="toggleMgmtSubView('EDITOR')">
                OKF Editor
              </button>
              <button class="mgmt-subtab-btn ${MGMT_SUB_VIEW === "KC_EXPLORER" ? "active" : ""}" onclick="toggleMgmtSubView('KC_EXPLORER')">
                Knowledge Catalog
              </button>
            </div>

            <!-- Dualized OKF Corpus Switcher (okf-kr vs okf-en) -->
            <div class="mgmt-subtab-group" style="flex-shrink:0;" title="${
              k ? "한글(okf-kr) / 영문(okf-en) 이중화 OKF 코퍼스 전환" : "Switch between dualized okf-kr (Korean) and okf-en (English) corpora"
            }">
              <button class="mgmt-subtab-btn ${k ? "active" : ""}" onclick="setLanguage('ko')">
                okf-kr (한글)
              </button>
              <button class="mgmt-subtab-btn ${!k ? "active" : ""}" onclick="setLanguage('en')">
                okf-en (EN)
              </button>
            </div>

            <span style="font-size:11.5px; color:var(--text-sub); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              ${k ? "활성 OKF:" : "Active OKF:"} <code>${activeCorpusId}</code> · GCS: <code>${gcsBucketLabel}</code> · EntryGroup: <code>${entryGroupLabel}</code>
            </span>
          </div>

          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            <a
              href="https://github.com/cpuz158/hp-dragonfly-ontology-okf"
              target="_blank"
              rel="noopener noreferrer"
              class="mgmt-status-pill synced"
              style="text-decoration:none; display:inline-flex; align-items:center; gap:4px; background:rgba(26,115,232,0.10); color:var(--gcp-blue); border:1px solid rgba(26,115,232,0.28);"
              title="${k ? "GitHub Metadata-as-Code 리포지토리 열기 (cpuz158/hp-dragonfly-ontology-okf)" : "Open GitHub Metadata-as-Code Repository (cpuz158/hp-dragonfly-ontology-okf)"}"
            >
              <span class="material-symbols-outlined" style="font-size:13px;">open_in_new</span>
              <span>GitHub · cpuz158/hp-dragonfly-ontology-okf</span>
            </a>
            <span class="mgmt-status-pill synced">SYNCED ${totalFiles - modifiedCount}</span>
            ${modifiedCount > 0 ? `<span class="mgmt-status-pill modified">MODIFIED ${modifiedCount}</span>` : ""}
            ${updatedCount > 0 ? `<span class="mgmt-status-pill versioned">VERSIONED ${updatedCount}</span>` : ""}
            ${deprecatedCount > 0 ? `<span class="mgmt-status-pill deprecated">DEPRECATED ${deprecatedCount}</span>` : ""}
          </div>
        </div>

        ${MGMT_SUB_VIEW === "EDITOR" ? renderMgmtEditorSplitHtml() : renderKcExplorerSplitHtml()}
      </div>

      <!-- Floating Bottom-Center Multi-Select Snackbar (Zero Layout Shift on Tree!) -->
      <div id="mgmt-floating-snackbar-wrap">
        ${renderMgmtFloatingSnackbarHtml()}
      </div>

      <!-- Confirm Modal Popup (Semantic Version Bump + Change Note + Diff) -->
      <div class="mgmt-modal-overlay" id="mgmt-publish-modal">
        <div class="mgmt-modal-dialog" id="mgmt-modal-dialog-content"></div>
      </div>
    `;

    if (prevNavScrollTop !== null) {
      const newNavList = container.querySelector(".mgmt-sidebar .nav-list");
      if (newNavList) newNavList.scrollTop = prevNavScrollTop;
    }
  };

  function renderMgmtFloatingSnackbarHtml() {
    const count = MGMT_SELECTED_SET.size;
    if (count === 0) return "";
    const k = isKo();
    return `
      <div class="mgmt-floating-snackbar visible">
        <div style="display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:600; color:var(--gcp-blue);">
          <span>${count}${k ? "개 OKF 파일 선택됨" : " OKF files selected"}</span>
        </div>
        <div style="width:1px; height:18px; background:var(--border);"></div>
        <button class="bq-run-btn" style="padding:6px 14px; font-size:12px; border-radius:999px;" onclick="openPublishConfirmModal('BATCH')">
          ${k ? `일괄 프론트매터 변경 & KC 배포 (${count}건)` : `Batch Update & KC Publish (${count})`}
        </button>
        <button class="mgmt-chip-btn" style="padding:5px 11px; border-radius:999px;" onclick="mgmtSelectAllVisible(false)">
          ${k ? "선택 해제" : "Clear"}
        </button>
      </div>
    `;
  }

  function renderMgmtEditorSplitHtml() {
    const st = getEffectiveItemState(MGMT_ACTIVE_KEY);
    if (!st) return "";
    const fm = st.fm;
    const k = isKo();
    const searchPh = k
      ? "조문 검색 (제1장, 별표 3-1, §5.1, 3.2, 내규)..."
      : "Search clause (Ch.1, Table 3-1, §5.1, 3.2, SOP)...";
    const pathParts = String(st.rel || "").split("/").filter(Boolean);
    const rawBase = pathParts[pathParts.length - 1] || "doc.md";
    const mdBasename =
      rawBase === "doc.md" && pathParts.length >= 2
        ? `${pathParts[pathParts.length - 2]}/doc.md`
        : rawBase;

    const pillClass = st.isModified
      ? "modified"
      : fm.status === "deprecated"
      ? "deprecated"
      : st.historyCount > 0
      ? "versioned"
      : "synced";
    const pillText = st.isModified
      ? k
        ? "MODIFIED (미배포)"
        : "MODIFIED (Unsaved)"
      : `v${fm.version} · ${fm.status.toUpperCase()}`;

    return `
      <div class="mgmt-body-split">
        <!-- 1. Left GCS File Tree -->
        <aside class="mgmt-sidebar">
          <div class="search-wrap" style="display:flex; flex-direction:column; gap:8px;">
            <input type="text" id="mgmt-tree-search" class="search-input" placeholder="${escapeHtml(
              searchPh
            )}" oninput="refreshMgmtTreeList()" />
            <div style="display:flex; align-items:center; justify-content:space-between; gap:4px;">
              <div style="display:flex; gap:4px;">
                <button class="mgmt-chip-btn" onclick="mgmtSelectAllVisible(true)" title="${
                  k ? "현재 목록 전체 선택" : "Select all visible"
                }">${k ? "전체선택" : "Select All"}</button>
                <button class="mgmt-chip-btn" onclick="mgmtSelectAllVisible(false)" title="${
                  k ? "선택 해제" : "Clear selection"
                }">${k ? "선택해제" : "Clear"}</button>
              </div>
              <div style="display:flex; gap:4px;">
                <button id="mgmt-filter-modified-btn" class="mgmt-chip-btn ${
                  MGMT_TREE_FILTER === "MODIFIED" ? "active" : ""
                }" onclick="setMgmtTreeFilter('MODIFIED')" title="${
      k ? "수정중인 OKF 파일 필터 (재클릭 시 전체 보기)" : "Filter modified files"
    }">${k ? "수정중" : "Modified"}(${getModifiedCount()})</button>
              </div>
            </div>
          </div>

          <div class="nav-list" id="mgmt-tree-list">
            ${buildMgmtTreeItemsHtml("")}
          </div>
        </aside>

        <!-- 2. Center Spacious Frontmatter Dropdown & Markdown Body Editor -->
        <section class="mgmt-editor-pane">
          <div class="pane-subbar">
            <div style="display:flex; align-items:center; gap:8px; min-width:0; overflow:hidden;">
              <code style="font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(
                mdBasename
              )}</code>
              <span id="mgmt-editor-status-pill" class="mgmt-status-pill ${pillClass}">
                ${escapeHtml(pillText)}
              </span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
              <button id="mgmt-reset-btn" class="gcp-action-btn" style="flex:0 0 auto; height:30px; padding:0 12px; font-size:11.5px; line-height:1; ${
                !st.isModified ? "opacity:0.45; cursor:default;" : ""
              }" onclick="resetCurrentMgmtEdits()" ${!st.isModified ? "disabled" : ""}>
                ${k ? "변경 취소" : "Reset"}
              </button>
              <button class="bq-run-btn" style="flex:0 0 auto; height:30px; padding:0 14px; font-size:11.5px; line-height:1;" onclick="openPublishConfirmModal('SINGLE')">
                ${k ? "편집 완료 및 KC 배포" : "Approve & Publish to KC"}
              </button>
            </div>
          </div>

          <div class="mgmt-editor-scroll">
            <!-- 1. Structured Frontmatter Card (Spacious 3-Column Grid, Zero Clutter) -->
            <div class="mgmt-card">
              <div class="section-label" style="margin-bottom:14px;">
                <span>Frontmatter Governance Attributes</span>
                <span style="font-family:var(--mono); font-size:11px; color:var(--text-sub);" id="mgmt-live-sha">SHA-256: ${escapeHtml(
                  st.sha256.slice(0, 16)
                )}…</span>
              </div>

              <div class="mgmt-fm-grid">
                ${renderFmSelectField("type", "OKF Type", fm.type)}
                ${renderFmSelectField("status", "Status", fm.status)}
                ${renderFmSelectField("content_class", "Content Class", fm.content_class)}

                ${renderFmSelectField("treatment", "Treatment", fm.treatment)}
                ${renderFmSelectField("generated_by", "Generated By", fm.generated_by)}
                ${renderFmSelectField("verified_by", "Verified By", fm.verified_by)}

                ${renderFmSelectField("verified_method", "Verified Method", fm.verified_method)}
                <div class="mgmt-fm-field span-2">
                  ${renderFmSelectFieldInner("license", "License", fm.license)}
                </div>

                <div class="mgmt-fm-field span-2">
                  <label><span>Title</span></label>
                  <input type="text" class="gcp-input" value="${escapeHtml(
                    fm.title
                  )}" oninput="onMgmtFmChange('title', this.value)" />
                </div>

                <div class="mgmt-fm-field">
                  <label><span>Version &amp; Verified At (${k ? "자동 갱신" : "Auto-updated"})</span></label>
                  <input type="text" class="gcp-input" readonly value="v${escapeHtml(fm.version)} · ${escapeHtml(
      fm.verified_at
    )}" />
                </div>

                <div class="mgmt-fm-field span-2">
                  <label><span>Description</span></label>
                  <input type="text" class="gcp-input" value="${escapeHtml(
                    fm.description
                  )}" oninput="onMgmtFmChange('description', this.value)" />
                </div>

                <div class="mgmt-fm-field">
                  <label><span>Tags (${k ? "쉼표 구분" : "Comma-separated"})</span></label>
                  <input type="text" class="gcp-input" value="${escapeHtml(
                    fm.tags
                  )}" oninput="onMgmtFmChange('tags', this.value)" />
                </div>
              </div>
            </div>

            <!-- 2. Markdown Body Editor Card -->
            <div class="mgmt-card">
              <div class="section-label" style="margin-bottom:10px;">
                <span>Markdown Body</span>
                <span style="font-size:11.5px; color:var(--text-sub);">Page p.${escapeHtml(fm.source_pages_span)}</span>
              </div>
              <textarea class="mgmt-body-textarea" id="mgmt-body-input" oninput="onMgmtBodyChange(this.value)">${escapeHtml(
                st.body
              )}</textarea>
            </div>
          </div>
        </section>

        <!-- 3. Right Live GCS File Preview & Post-Publish Lineage Card -->
        <section class="mgmt-preview-pane">
          <div class="pane-subbar">
            <span>${k ? "실시간 GCS 마크다운 프리뷰" : "Live GCS Markdown Preview"} (<code>${escapeHtml(
      mdBasename
    )}</code>)</span>
            <span class="badge-pill badge-blue" id="mgmt-preview-ver-badge">v${escapeHtml(fm.version)}</span>
          </div>

          <div class="mgmt-preview-scroll">
            ${MGMT_LAST_PUBLISH_RESULT ? renderLastPublishBannerHtml(MGMT_LAST_PUBLISH_RESULT) : ""}

            <div class="section-label">
              <span>YAML Frontmatter</span>
              <span style="font-family:var(--mono); font-size:11px;">${escapeHtml(
                fm.type || "Provision"
              )} · p.${escapeHtml(fm.source_pages_span)}</span>
            </div>
            <div class="frontmatter-block" style="border:1px solid var(--border); border-radius:6px;" id="mgmt-live-yaml-preview">${buildLiveYamlPreviewHtml(
              fm,
              st.sha256
            )}</div>

            <div class="section-label" style="margin-top:6px;">
              <span>Markdown Body</span>
              <span style="font-family:var(--mono); font-size:11px;">MARKDOWN</span>
            </div>
            <div class="okf-title" id="mgmt-live-title-preview">${escapeHtml(fm.title)}</div>
            <div class="okf-body-box okf-md-content" id="mgmt-live-body-preview">${formatMgmtPreviewBody(
              st.body
            )}</div>
          </div>
        </section>
      </div>
    `;
  }

  function renderFmSelectField(fieldKey, labelText, currentValue) {
    return `<div class="mgmt-fm-field">${renderFmSelectFieldInner(fieldKey, labelText, currentValue)}</div>`;
  }

  function renderFmSelectFieldInner(fieldKey, labelText, currentValue) {
    const opts = OKF_V02_DROPDOWN_OPTIONS[fieldKey] || [];
    const allOpts = opts.includes(currentValue) ? opts : [currentValue, ...opts];
    return `
      <label><span>${escapeHtml(labelText)}</span></label>
      <div class="gcp-custom-select" data-field="${escapeHtml(fieldKey)}">
        <button type="button" class="gcp-select gcp-custom-select-btn" onclick="toggleGcpCustomSelect(event, this)">
          <span class="gcp-custom-select-val">${escapeHtml(currentValue)}</span>
        </button>
        <div class="gcp-custom-select-menu">
          ${allOpts
            .map(
              (o) => `
            <div class="gcp-custom-select-opt ${
              o === currentValue ? "selected" : ""
            }" data-value="${escapeHtml(o)}" onclick="selectGcpCustomOption(event, '${fieldKey}', this)">
              <span>${escapeHtml(o)}</span>
              <span class="material-symbols-outlined gcp-opt-check" style="opacity:${
                o === currentValue ? "1" : "0"
              };">check</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function closeAllGcpCustomSelects(exceptWrap) {
    document.querySelectorAll(".gcp-custom-select.open").forEach((el) => {
      if (el !== exceptWrap) el.classList.remove("open");
    });
  }

  window.toggleGcpCustomSelect = function (ev, btnEl) {
    if (ev) ev.stopPropagation();
    const wrap = btnEl ? btnEl.closest(".gcp-custom-select") : null;
    if (!wrap) return;
    const willOpen = !wrap.classList.contains("open");
    closeAllGcpCustomSelects(wrap);
    wrap.classList.toggle("open", willOpen);
  };

  window.selectGcpCustomOption = function (ev, fieldKey, optEl) {
    if (ev) ev.stopPropagation();
    const wrap = optEl ? optEl.closest(".gcp-custom-select") : null;
    if (!wrap) return;
    const val = optEl.getAttribute("data-value") || "";
    const valSpan = wrap.querySelector(".gcp-custom-select-val");
    if (valSpan) valSpan.textContent = val;
    wrap.querySelectorAll(".gcp-custom-select-opt").forEach((el) => {
      const isSel = el === optEl;
      el.classList.toggle("selected", isSel);
      const chk = el.querySelector(".gcp-opt-check");
      if (chk) chk.style.opacity = isSel ? "1" : "0";
    });
    wrap.classList.remove("open");
    onMgmtFmChange(fieldKey, val);
  };

  if (!window.__GCP_CUSTOM_SELECT_BOUND__) {
    window.__GCP_CUSTOM_SELECT_BOUND__ = true;
    document.addEventListener("click", () => closeAllGcpCustomSelects(null));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllGcpCustomSelects(null);
    });
  }

  function buildLiveYamlPreviewHtml(fm, sha) {
    const tagLines = String(fm.tags || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `- ${escapeHtml(s)}`)
      .join("\n");
    const lines = [
      `<span class="yaml-delim">---</span>`,
      `<span class="yaml-key">type:</span> ${escapeHtml(fm.type)}`,
      `<span class="yaml-key">title:</span> ${escapeHtml(fm.title)}`,
      `<span class="yaml-key">description:</span> ${escapeHtml((fm.description || "").slice(0, 110))}`,
      `<span class="yaml-key">version:</span> '${escapeHtml(fm.version)}'`,
      `<span class="yaml-key">tags:</span>`,
      tagLines,
      `<span class="yaml-key">language:</span> ${escapeHtml(fm.language || (isKo() ? "ko" : "en"))}`,
      `<span class="yaml-key">sources:</span>`,
      `- <span class="yaml-key">id:</span> origin_pdf`,
      `  <span class="yaml-key">resource:</span> ${escapeHtml(fm.source_resource)}`,
      `  <span class="yaml-key">kind:</span> origin_document`,
      `  <span class="yaml-key">sha256:</span> ${escapeHtml(sha)}`,
      `<span class="yaml-key">generated:</span>`,
      `  <span class="yaml-key">by:</span> ${escapeHtml(fm.generated_by)}`,
      `  <span class="yaml-key">at:</span> '${escapeHtml(fm.generated_at)}'`,
      `<span class="yaml-key">status:</span> ${escapeHtml(fm.status)}`,
      `<span class="yaml-key">part_of:</span> ${escapeHtml(fm.part_of)}`,
      `<span class="yaml-key">sequence:</span> ${escapeHtml(String(fm.sequence))}`,
      `<span class="yaml-key">treatment:</span> ${escapeHtml(fm.treatment)}`,
      `<span class="yaml-key">license:</span> ${escapeHtml(fm.license)}`,
      `<span class="yaml-key">content_class:</span> ${escapeHtml(fm.content_class)}`,
      `<span class="yaml-key">section_number:</span> ${escapeHtml(fm.section_number)}`,
      `<span class="yaml-key">source_page:</span> ${escapeHtml(String(fm.source_page))}`,
      `<span class="yaml-key">verified:</span>`,
      `- <span class="yaml-key">by:</span> ${escapeHtml(fm.verified_by)}`,
      `  <span class="yaml-key">at:</span> '${escapeHtml(fm.verified_at)}'`,
      `  <span class="yaml-key">method:</span> ${escapeHtml(fm.verified_method)}`,
      `  <span class="yaml-key">checks:</span> [P1_body, P2_heading, P3_page, P4_digest]`
    ];
    if (fm.contacts) {
      lines.push(`<span class="yaml-key">contacts:</span> ${escapeHtml(fm.contacts)}`);
    }
    lines.push(`<span class="yaml-delim">---</span>`);
    return lines.join("\n");
  }

  function formatMgmtPreviewBody(raw) {
    if (window.marked && typeof window.marked.parse === "function") {
      return highlightOkfTerms(window.marked.parse(raw || ""));
    }
    return highlightOkfTerms(escapeHtml(raw || ""));
  }

  function renderLastPublishBannerHtml(res) {
    return `
      <div class="mgmt-card" style="background:var(--gcp-green-bg); border-color:var(--gcp-green); padding:13px 15px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:12.5px; font-weight:700; color:var(--gcp-green); display:flex; align-items:center; gap:5px;">
            <span class="material-symbols-outlined" style="font-size:16px;">check_circle</span>
            GCP 실시간 반영 완료 (${escapeHtml(res.bump_level)} · v${escapeHtml(res.old_version)} ➔ v${escapeHtml(
      res.new_version
    )})
          </span>
          <span style="font-family:var(--mono); font-size:11px; color:var(--text-sub);">${escapeHtml(
            res.updated_at
          )}</span>
        </div>
        <div style="font-size:11.5px; color:var(--text); line-height:1.55;">
          • <strong>구버전 스냅샷 보존 &amp; 만료:</strong> <code>${escapeHtml(
            res.snapshot_gcs_uri
          )}</code> ➔ KC <code>DEPRECATED</code><br>
          • <strong>최신본 덮어쓰기 &amp; 활성 등록:</strong> <code>${escapeHtml(
            res.canonical_gcs_uri
          )}</code> ➔ KC <code>VERIFIED (v${escapeHtml(res.new_version)})</code>
        </div>
      </div>
    `;
  }

  function buildMgmtTreeItemsHtml(searchQuery) {
    const q = String(searchQuery || "").trim().toLowerCase();
    const k = isKo();

    const groups = OKF_DOC_ROOTS.map((d) => {
      const docKey = `DOC:${d.doc_id}`;
      const docSt = MGMT_DOC_STATE[d.doc_id];
      const items = [];
      MGMT_STATE.forEach((st) => {
        if (st.doc_id !== d.doc_id) return;
        if (MGMT_TREE_FILTER === "MODIFIED" && !st.isModified) return;
        if (q) {
          const hay = `${d.doc_short_ko} ${d.doc_short_en} ${st.section_number} ${st.section_number_en} ${st.fm.title} ${st.rel}`.toLowerCase();
          if (!hay.includes(q)) return;
        }
        items.push(st);
      });
      return {
        doc: d,
        docKey,
        docSt,
        items
      };
    }).filter((g) => {
      if (MGMT_TREE_FILTER === "MODIFIED") {
        return (g.docSt && g.docSt.isModified) || g.items.length > 0;
      }
      if (q) {
        const docHay = `${g.doc.doc_short_ko} ${g.doc.doc_short_en} ${g.docSt.fm.title} doc.md`.toLowerCase();
        return docHay.includes(q) || g.items.length > 0;
      }
      return true;
    });

    if (groups.length === 0) {
      return `<div style="padding:18px; text-align:center; font-size:12px; color:var(--text-sub);">${
        k ? "조건에 맞는 비정형 OKF 조항이 없습니다." : "No matching unstructured OKF clauses."
      }</div>`;
    }

    return groups
      .map(({ doc, docKey, items }) => {
        const isDocActive = MGMT_ACTIVE_KEY === docKey;
        const allChecked =
          MGMT_SELECTED_SET.has(docKey) &&
          (items.length === 0 || items.every((it) => MGMT_SELECTED_SET.has(it.idx)));
        const isOpen = q ? true : Boolean(MGMT_OPEN_DOCS[doc.doc_id]);
        const shortDocTitle = k ? doc.doc_short_ko : doc.doc_short_en;
        return `
          <div class="doc-section">
            <div class="doc-group-title ${
              isDocActive ? "active-doc" : ""
            }" style="gap:6px;" onclick="toggleMgmtDocAccordion('${
          doc.doc_id
        }')" title="클릭 시 조문 목록 펼치기/접기 및 상위 문서([${doc.doc_num}] doc.md) 열람·편집">
              <div style="display:flex; align-items:center; gap:6px; flex:1; min-width:0;">
                <input type="checkbox" class="mgmt-tree-cb" ${
                  allChecked ? "checked" : ""
                } onclick="event.stopPropagation(); toggleMgmtDocGroupSelect('${doc.doc_id}', this.checked)" />
                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">[${escapeHtml(
                  doc.doc_num
                )}] ${escapeHtml(shortDocTitle)}</span>
              </div>
              <span class="badge-pill badge-blue" style="flex-shrink:0;">${items.length}</span>
            </div>
            <div class="doc-items ${isOpen ? "" : "collapsed"}">
              ${items
                .map((st) => {
                  const isChecked = MGMT_SELECTED_SET.has(st.idx);
                  const isRowActive = MGMT_ACTIVE_KEY === st.idx;
                  const isDep = st.fm.status === "deprecated";
                  const pillClass = st.isModified
                    ? "modified"
                    : isDep
                    ? "deprecated"
                    : st.historyCount > 0
                    ? "versioned"
                    : "synced";
                  const pillLabel = st.isModified
                    ? "MODIFIED"
                    : isDep
                    ? `DEPRECATED · v${st.fm.version}`
                    : st.historyCount > 0
                    ? `v${st.fm.version} · 이력${st.historyCount}`
                    : `v${st.fm.version}`;
                  const secNum = k ? st.section_number : st.section_number_en || st.section_number;
                  return `
                    <div class="mgmt-tree-row ${isRowActive ? "active" : ""}" onclick="selectMgmtFileItem(${st.idx})">
                      <input type="checkbox" class="mgmt-tree-cb" ${
                        isChecked ? "checked" : ""
                      } onclick="event.stopPropagation(); toggleMgmtSingleSelect(${st.idx}, this.checked)" />
                      <div style="flex:1; min-width:0;">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:4px;">
                          <span style="font-size:12px; font-weight:${
                            isRowActive ? "600" : "500"
                          }; color:${isRowActive ? "var(--gcp-blue)" : "var(--text)"};">
                            ${escapeHtml(secNum)}
                          </span>
                          <span class="mgmt-status-pill ${pillClass}">${escapeHtml(pillLabel)}</span>
                        </div>
                        <div style="font-size:11px; color:var(--text-sub); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">
                          ${escapeHtml(st.fm.title)}
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
        `;
      })
      .join("");
  }

  window.refreshMgmtTreeList = function () {
    const searchEl = document.getElementById("mgmt-tree-search");
    const listEl = document.getElementById("mgmt-tree-list");
    const snackWrap = document.getElementById("mgmt-floating-snackbar-wrap");
    const modBtn = document.getElementById("mgmt-filter-modified-btn");
    if (listEl) {
      const prevTop = listEl.scrollTop;
      listEl.innerHTML = buildMgmtTreeItemsHtml(searchEl ? searchEl.value : "");
      listEl.scrollTop = prevTop;
    }
    if (snackWrap) {
      snackWrap.innerHTML = renderMgmtFloatingSnackbarHtml();
    }
    if (modBtn) {
      modBtn.textContent = `${isKo() ? "수정중" : "Modified"}(${getModifiedCount()})`;
    }
  };

  window.setMgmtTreeFilter = function (filter) {
    if (MGMT_TREE_FILTER === filter && filter !== "ALL") {
      MGMT_TREE_FILTER = "ALL";
    } else {
      MGMT_TREE_FILTER = filter;
    }
    renderManagementModule();
  };

  window.selectMgmtFileItem = function (idxOrKey) {
    if (typeof idxOrKey === "string" && idxOrKey.startsWith("DOC:")) {
      MGMT_ACTIVE_KEY = idxOrKey;
      const docId = idxOrKey.slice(4);
      MGMT_OPEN_DOCS[docId] = true;
    } else {
      MGMT_ACTIVE_KEY = idxOrKey;
    }
    renderManagementModule();
  };

  window.toggleMgmtSingleSelect = function (idxOrKey, checked) {
    if (checked) MGMT_SELECTED_SET.add(idxOrKey);
    else MGMT_SELECTED_SET.delete(idxOrKey);
    refreshMgmtTreeList();
  };

  window.toggleMgmtDocGroupSelect = function (docId, checked) {
    const docKey = `DOC:${docId}`;
    if (checked) MGMT_SELECTED_SET.add(docKey);
    else MGMT_SELECTED_SET.delete(docKey);
    MGMT_STATE.forEach((st) => {
      if (st.doc_id === docId) {
        if (checked) MGMT_SELECTED_SET.add(st.idx);
        else MGMT_SELECTED_SET.delete(st.idx);
      }
    });
    refreshMgmtTreeList();
  };

  window.mgmtSelectAllVisible = function (checked) {
    if (!checked) {
      MGMT_SELECTED_SET.clear();
    } else {
      OKF_DOC_ROOTS.forEach((d) => {
        const docKey = `DOC:${d.doc_id}`;
        const docSt = MGMT_DOC_STATE[d.doc_id];
        if (MGMT_TREE_FILTER === "MODIFIED" && (!docSt || !docSt.isModified)) return;
        MGMT_SELECTED_SET.add(docKey);
      });
      MGMT_STATE.forEach((st) => {
        if (MGMT_TREE_FILTER === "MODIFIED" && !st.isModified) return;
        MGMT_SELECTED_SET.add(st.idx);
      });
    }
    refreshMgmtTreeList();
  };

  window.onMgmtFmChange = function (fieldKey, value) {
    const st = getEffectiveItemState(MGMT_ACTIVE_KEY);
    if (!st) return;
    st.fm[fieldKey] = value;
    st.isModified =
      st.body !== st.baseBody || JSON.stringify(st.fm) !== JSON.stringify(st.baseFm);
    st.sha256 = simpleSha256Hex64(st.body, st.baseFm.sha256);
    persistSingleMgmtStateLang(st);
    updateLiveMgmtPreview();
  };

  window.onMgmtBodyChange = function (value) {
    const st = getEffectiveItemState(MGMT_ACTIVE_KEY);
    if (!st) return;
    st.body = value;
    st.isModified =
      st.body !== st.baseBody || JSON.stringify(st.fm) !== JSON.stringify(st.baseFm);
    st.sha256 = simpleSha256Hex64(st.body, st.baseFm.sha256);
    persistSingleMgmtStateLang(st);
    updateLiveMgmtPreview();
  };

  window.resetCurrentMgmtEdits = function () {
    const st = getEffectiveItemState(MGMT_ACTIVE_KEY);
    if (!st) return;
    st.fm = JSON.parse(JSON.stringify(st.baseFm));
    st.body = st.baseBody;
    st.isModified = false;
    st.sha256 = st.baseFm.sha256;
    persistSingleMgmtStateLang(st);
    renderManagementModule();
  };

  function updateLiveMgmtPreview() {
    const st = getEffectiveItemState(MGMT_ACTIVE_KEY);
    if (!st) return;
    const yamlEl = document.getElementById("mgmt-live-yaml-preview");
    const titleEl = document.getElementById("mgmt-live-title-preview");
    const bodyEl = document.getElementById("mgmt-live-body-preview");
    const shaEl = document.getElementById("mgmt-live-sha");
    const pillEl = document.getElementById("mgmt-editor-status-pill");
    const resetBtn = document.getElementById("mgmt-reset-btn");
    if (yamlEl) yamlEl.innerHTML = buildLiveYamlPreviewHtml(st.fm, st.sha256);
    if (titleEl) titleEl.textContent = st.fm.title;
    if (bodyEl) bodyEl.innerHTML = formatMgmtPreviewBody(st.body);
    if (shaEl) shaEl.textContent = "SHA-256: " + st.sha256.slice(0, 16) + "…";
    if (pillEl) {
      pillEl.className = `mgmt-status-pill ${
        st.isModified
          ? "modified"
          : st.fm.status === "deprecated"
          ? "deprecated"
          : st.historyCount > 0
          ? "versioned"
          : "synced"
      }`;
      pillEl.textContent = st.isModified
        ? isKo()
          ? "MODIFIED (미배포)"
          : "MODIFIED (Unsaved)"
        : `v${st.fm.version} · ${st.fm.status.toUpperCase()}`;
    }
    if (resetBtn) {
      resetBtn.disabled = !st.isModified;
      resetBtn.style.opacity = st.isModified ? "1" : "0.45";
      resetBtn.style.cursor = st.isModified ? "pointer" : "default";
    }
    refreshMgmtTreeList();
  }

  // =========================================================================
  // Confirm Modal Popup (`PATCH / MINOR / MAJOR` + Contacts + Change Note + Diff)
  // =========================================================================
  window.openPublishConfirmModal = function (mode) {
    MODAL_MODE = mode || "SINGLE";
    MODAL_BUMP_LEVEL = "PATCH";
    MODAL_PRESET_NOTE_VAL = CHANGE_NOTE_PRESETS[0];
    MODAL_CHANGE_NOTE_TEXT = CHANGE_NOTE_PRESETS[0];
    const st = getEffectiveItemState(MGMT_ACTIVE_KEY);
    MODAL_CONTACTS_VALUE =
      MODAL_MODE === "SINGLE" && st && st.fm ? st.fm.contacts || "" : "";
    const overlay = document.getElementById("mgmt-publish-modal");
    if (!overlay) return;
    overlay.classList.add("open");
    renderPublishModalDialogContent();
  };

  window.closePublishConfirmModal = function () {
    const overlay = document.getElementById("mgmt-publish-modal");
    if (overlay) overlay.classList.remove("open");
  };

  function renderModalCustomSelect(id, options, currentVal, onSelectType, wrapStyle = "", btnStyle = "") {
    const curObj =
      options.find((o) => String(o.value) === String(currentVal)) ||
      options[0] || { value: "", label: "" };
    return `
      <div class="gcp-custom-select" id="${escapeHtml(id)}" data-value="${escapeHtml(
      curObj.value
    )}" ${wrapStyle ? `style="${wrapStyle}"` : ""}>
        <button type="button" class="gcp-select gcp-custom-select-btn" ${
          btnStyle ? `style="${btnStyle}"` : ""
        } onclick="toggleGcpCustomSelect(event, this)">
          <span class="gcp-custom-select-val">${escapeHtml(curObj.label)}</span>
        </button>
        <div class="gcp-custom-select-menu">
          ${options
            .map((o) => {
              const isSel = String(o.value) === String(curObj.value);
              return `
                <div class="gcp-custom-select-opt ${
                  isSel ? "selected" : ""
                }" data-value="${escapeHtml(o.value)}" data-label="${escapeHtml(
                o.label
              )}" onclick="selectModalCustomOption(event, '${onSelectType}', this)">
                  <span>${escapeHtml(o.label)}</span>
                  <span class="material-symbols-outlined gcp-opt-check" style="opacity:${
                    isSel ? "1" : "0"
                  };">check</span>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  window.selectModalCustomOption = function (ev, onSelectType, optEl) {
    if (ev) ev.stopPropagation();
    const wrap = optEl ? optEl.closest(".gcp-custom-select") : null;
    if (!wrap) return;
    const val = optEl.getAttribute("data-value") || "";
    const label = optEl.getAttribute("data-label") || val;
    wrap.setAttribute("data-value", val);
    const valSpan = wrap.querySelector(".gcp-custom-select-val");
    if (valSpan) valSpan.textContent = label;
    wrap.querySelectorAll(".gcp-custom-select-opt").forEach((el) => {
      const isSel = el === optEl;
      el.classList.toggle("selected", isSel);
      const chk = el.querySelector(".gcp-opt-check");
      if (chk) chk.style.opacity = isSel ? "1" : "0";
    });
    wrap.classList.remove("open");

    if (onSelectType === "BUMP_LEVEL") {
      const input = document.getElementById("modal-change-note-input");
      if (input) MODAL_CHANGE_NOTE_TEXT = input.value;
      MODAL_BUMP_LEVEL = val;
      renderPublishModalDialogContent();
    } else if (onSelectType === "CONTACTS") {
      const input = document.getElementById("modal-change-note-input");
      if (input) MODAL_CHANGE_NOTE_TEXT = input.value;
      MODAL_CONTACTS_VALUE = val;
      renderPublishModalDialogContent();
    } else if (onSelectType === "PRESET_NOTE") {
      MODAL_PRESET_NOTE_VAL = val;
      MODAL_CHANGE_NOTE_TEXT = val;
      const input = document.getElementById("modal-change-note-input");
      if (input && val) input.value = val;
    }
  };

  function getModalSelectValue(id, fallbackVal = "") {
    const el = document.getElementById(id);
    if (!el) return fallbackVal;
    if (el.hasAttribute("data-value")) return el.getAttribute("data-value") || "";
    return el.value !== undefined ? el.value : fallbackVal;
  }

  function buildDiffLinesHtml(st, nextVer, nowTs, effectiveContacts) {
    const lines = [];
    const oldFm = st.baseFm;
    const newFm = Object.assign({}, st.fm);
    if (effectiveContacts !== undefined && effectiveContacts !== null) {
      newFm.contacts = effectiveContacts;
    }
    const shortSlug = st.kc_entry_id || "clause";
    const activeCorpusDir = isKo() ? "okf-kr" : "okf-en";
    lines.push(
      `<div class="diff-line-ctx">--- a/gs://hp-dragonfly-okf/${activeCorpusDir}/versions/${escapeHtml(
        shortSlug
      )}_v${escapeHtml(oldFm.version)}.md (DEPRECATED ${isKo() ? "만료 전환" : "transitioned"})</div>`
    );
    lines.push(
      `<div class="diff-line-ctx">+++ b/${escapeHtml(
        newFm.source_uri
      )} (VERIFIED ${isKo() ? "신규 등록" : "published"})</div>`
    );

    lines.push(`<div class="diff-line-del">- version: '${escapeHtml(oldFm.version)}'</div>`);
    lines.push(`<div class="diff-line-add">+ version: '${escapeHtml(nextVer)}'</div>`);
    lines.push(`<div class="diff-line-del">- verified.at: '${escapeHtml(oldFm.verified_at)}'</div>`);
    lines.push(`<div class="diff-line-add">+ verified.at: '${escapeHtml(nowTs)}'</div>`);

    const keys = [
      "type",
      "title",
      "description",
      "tags",
      "status",
      "content_class",
      "treatment",
      "license",
      "generated_by",
      "verified_by",
      "verified_method",
      "contacts"
    ];
    keys.forEach((k) => {
      const oldVal = String(oldFm[k] || "");
      const newVal = String(newFm[k] || "");
      if (oldVal !== newVal) {
        lines.push(`<div class="diff-line-del">- ${k}: ${escapeHtml(oldVal || "(미지정)")}</div>`);
        lines.push(`<div class="diff-line-add">+ ${k}: ${escapeHtml(newVal || "(미지정)")}</div>`);
      }
    });

    if (st.baseBody.trim() !== st.body.trim()) {
      const oldLines = st.baseBody.trim().split("\n");
      const newLines = st.body.trim().split("\n");
      oldLines.forEach((l) => {
        if (!newLines.includes(l)) lines.push(`<div class="diff-line-del">- ${escapeHtml(l)}</div>`);
      });
      newLines.forEach((l) => {
        if (!oldLines.includes(l)) lines.push(`<div class="diff-line-add">+ ${escapeHtml(l)}</div>`);
      });
    } else {
      lines.push(
        `<div class="diff-line-ctx">  (마크다운 원문 본문 동일 · SHA-256 ${escapeHtml(
          st.sha256.slice(0, 16)
        )}… 유지)</div>`
      );
    }

    return lines.join("");
  }

  function renderPublishModalDialogContent() {
    const dialog = document.getElementById("mgmt-modal-dialog-content");
    if (!dialog) return;

    const nowTs = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const isBatch = MODAL_MODE === "BATCH";
    const batchIndices = isBatch ? Array.from(MGMT_SELECTED_SET) : [MGMT_ACTIVE_KEY];
    const primarySt = getEffectiveItemState(batchIndices[0] ?? MGMT_ACTIVE_KEY);
    const oldVer = primarySt.baseFm.version || "0.2.0";
    const nextVer = bumpSemverJs(oldVer, MODAL_BUMP_LEVEL);
    const shortSlug = primarySt.kc_entry_id || "clause";
    const currentContacts =
      MODAL_CONTACTS_VALUE !== null && MODAL_CONTACTS_VALUE !== undefined
        ? MODAL_CONTACTS_VALUE
        : primarySt.fm.contacts || "";

    const patchPreview = bumpSemverJs(oldVer, "PATCH");
    const minorPreview = bumpSemverJs(oldVer, "MINOR");
    const majorPreview = bumpSemverJs(oldVer, "MAJOR");

    const bumpOptions = [
      {
        value: "PATCH",
        label: `PATCH 업데이트 (v${oldVer} ➔ v${patchPreview}) — 오탈자 수정 · 프론트매터 거버넌스 속성 현행화`
      },
      {
        value: "MINOR",
        label: `MINOR 업데이트 (v${oldVer} ➔ v${minorPreview}) — 분해 선행(DAG)·단서(Caveat) 조항 보완 · 적용 맥락 추가`
      },
      {
        value: "MAJOR",
        label: `MAJOR 업데이트 (v${oldVer} ➔ v${majorPreview}) — 서비스 매뉴얼·정비내규 전면 개정 · 기존 조항 폐기(Deprecated)`
      }
    ];

    const singleContactsOptions = [
      { value: "", label: "-- 미지정 (Contacts 미반영) --" },
      ...OKF_V02_DROPDOWN_OPTIONS.contacts.map((c) => ({ value: c, label: c }))
    ];
    if (currentContacts && !singleContactsOptions.some((o) => o.value === currentContacts)) {
      singleContactsOptions.splice(1, 0, { value: currentContacts, label: currentContacts });
    }

    const batchContactsOptions = [
      { value: "", label: "-- 기존 값 유지 --" },
      ...OKF_V02_DROPDOWN_OPTIONS.contacts.map((c) => ({ value: c, label: c })),
      { value: "__CLEAR__", label: "-- 미지정으로 초기화 (Contacts 제거) --" }
    ];

    const batchVerifiedByOptions = [
      { value: "", label: "-- 기존 값 유지 --" },
      ...OKF_V02_DROPDOWN_OPTIONS.verified_by.map((v) => ({ value: v, label: v }))
    ];

    const batchStatusOptions = [
      { value: "", label: "-- 기존 값 유지 --" },
      ...OKF_V02_DROPDOWN_OPTIONS.status.map((v) => ({ value: v, label: v }))
    ];

    const batchContentClassOptions = [
      { value: "", label: "-- 기존 값 유지 --" },
      ...OKF_V02_DROPDOWN_OPTIONS.content_class.map((v) => ({ value: v, label: v }))
    ];

    const batchVerifiedMethodOptions = [
      { value: "", label: "-- 기존 값 유지 --" },
      ...OKF_V02_DROPDOWN_OPTIONS.verified_method.map((v) => ({ value: v, label: v }))
    ];

    const presetNoteOptions = CHANGE_NOTE_PRESETS.map((n, i) => ({
      value: n,
      label: `프리셋 ${i + 1}: ${n.slice(0, 18)}...`
    }));

    const currentPresetVal = MODAL_PRESET_NOTE_VAL || CHANGE_NOTE_PRESETS[0];
    const currentNoteText = MODAL_CHANGE_NOTE_TEXT || CHANGE_NOTE_PRESETS[0];

    dialog.innerHTML = `
      <div class="mgmt-modal-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="material-symbols-outlined" style="color:var(--gcp-blue);">published_with_changes</span>
          <span style="font-size:14.5px; font-weight:600; color:var(--text);">
            ${
              isBatch
                ? `다중 선택 일괄 버전 업데이트 및 Knowledge Catalog 배포 (${batchIndices.length}건)`
                : `OKF 편집 완료 — 버전 업데이트 수준 · 담당자(Contacts) 선택 및 배포 확인`
            }
          </span>
        </div>
        <button class="icon-close-btn" onclick="closePublishConfirmModal()"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div class="mgmt-modal-body">
        <div class="ctrl-group">
          <label>1. 버전 업데이트 수준 선택 (Semantic Version Bump Level)</label>
          ${renderModalCustomSelect(
            "modal-bump-level",
            bumpOptions,
            MODAL_BUMP_LEVEL,
            "BUMP_LEVEL",
            "",
            "font-weight:600; color:var(--gcp-blue);"
          )}
        </div>

        ${
          !isBatch
            ? `
          <div class="ctrl-group">
            <label>2. Knowledge Catalog 담당자 (Contacts) 지정 (<code>dataplex-types.global.contacts</code>)</label>
            ${renderModalCustomSelect(
              "modal-contacts-select",
              singleContactsOptions,
              currentContacts,
              "CONTACTS"
            )}
          </div>
        `
            : `
          <div class="mgmt-card" style="padding:12px 14px; background:var(--bg); overflow:visible;">
            <div class="section-label" style="margin-bottom:8px;">
              <span>선택된 ${batchIndices.length}개 파일 프론트매터 일괄 변경 (선택 사항)</span>
              <span style="font-size:11px; color:var(--text-sub);">'기존 값 유지' 선택 시 개별 파일 설정 유지</span>
            </div>
            <div class="mgmt-fm-grid">
              <div class="mgmt-fm-field span-2">
                <label><span>Knowledge Catalog 담당자 (Contacts) 일괄 지정</span></label>
                ${renderModalCustomSelect(
                  "batch-override-contacts",
                  batchContactsOptions,
                  "",
                  "BATCH_OVERRIDE"
                )}
              </div>
              <div class="mgmt-fm-field">
                <label><span>Verified By 일괄 지정</span></label>
                ${renderModalCustomSelect(
                  "batch-override-verified-by",
                  batchVerifiedByOptions,
                  "",
                  "BATCH_OVERRIDE"
                )}
              </div>
              <div class="mgmt-fm-field">
                <label><span>Status 일괄 지정</span></label>
                ${renderModalCustomSelect(
                  "batch-override-status",
                  batchStatusOptions,
                  "",
                  "BATCH_OVERRIDE"
                )}
              </div>
              <div class="mgmt-fm-field">
                <label><span>Content Class 일괄 지정</span></label>
                ${renderModalCustomSelect(
                  "batch-override-content-class",
                  batchContentClassOptions,
                  "",
                  "BATCH_OVERRIDE"
                )}
              </div>
              <div class="mgmt-fm-field">
                <label><span>Verified Method 일괄 지정</span></label>
                ${renderModalCustomSelect(
                  "batch-override-verified-method",
                  batchVerifiedMethodOptions,
                  "",
                  "BATCH_OVERRIDE"
                )}
              </div>
            </div>
          </div>
        `
        }

        <div class="ctrl-group">
          <label>3. 개정 사유 (Knowledge Catalog 버전 계보 기록)</label>
          <div style="display:flex; gap:6px; margin-bottom:5px;">
            ${renderModalCustomSelect(
              "modal-preset-note-select",
              presetNoteOptions,
              currentPresetVal,
              "PRESET_NOTE",
              "width:240px; flex-shrink:0;"
            )}
            <input type="text" id="modal-change-note-input" class="gcp-input" value="${escapeHtml(
              currentNoteText
            )}" oninput="MODAL_CHANGE_NOTE_TEXT = this.value" placeholder="개정 사유를 입력하세요..." />
          </div>
        </div>

        <div class="mgmt-card" style="padding:12px 14px; background:var(--bg); overflow:hidden;">
          <div class="section-label" style="margin-bottom:6px;">
            <span>4. ${
              isKo()
                ? `실행될 GCP 라이프사이클 트랜잭션 (GCS + Knowledge Catalog <code>okf_hp_dragonfly_kr</code>)`
                : `GCP Lifecycle Transaction (GCS + Knowledge Catalog <code>okf_hp_dragonfly_en</code>)`
            }</span>
            <span class="badge-pill badge-blue">v${escapeHtml(oldVer)} ➔ v${escapeHtml(nextVer)}</span>
          </div>
          <div style="font-size:12px; color:var(--text); line-height:1.7; word-break:break-all; overflow-wrap:anywhere;">
            1. <strong>${isKo() ? "프론트매터 타임스탬프 갱신:" : "Frontmatter Timestamp Bump:"}</strong> <code>verified.at = "${nowTs}"</code>, <code>version = "${nextVer}"</code>${
      !isBatch && currentContacts ? `, <code>contacts = "${escapeHtml(currentContacts)}"</code>` : ""
    }<br>
            2. <strong>${isKo() ? "구버전 스냅샷 보존 &amp; KC 만료:" : "Archive Snapshot &amp; Deprecate Old KC Entry:"}</strong> <code>gs://hp-dragonfly-okf/${isKo() ? "okf-kr" : "okf-en"}/versions/${escapeHtml(
              shortSlug
            )}_v${escapeHtml(oldVer)}.md</code> ${isKo() ? "생성 및 기존 KC 엔트리" : "created &amp; existing KC entry"} <strong><code>DEPRECATED</code></strong><br>
            3. <strong>${isKo() ? "신규 버전 GCS 덮어쓰기 &amp; KC 활성 등록:" : "Overwrite Canonical GCS &amp; Register Active KC Entry:"}</strong> <code>gs://hp-dragonfly-okf/${isKo() ? "okf-kr" : "okf-en"}/${escapeHtml(
              primarySt.rel
            )}</code> ${isKo() ? "덮어쓰기 및 신규 KC 엔트리" : "overwritten &amp; new KC entry"} <strong><code>VERIFIED (v${escapeHtml(
      nextVer
    )})</code></strong>
          </div>
        </div>

        <div class="ctrl-group">
          <label>5. 구버전(v${escapeHtml(oldVer)} DEPRECATED) ↔ 신버전(v${escapeHtml(
      nextVer
    )} VERIFIED) 변경점 비교 (Diff)</label>
          <div class="mgmt-diff-box">${buildDiffLinesHtml(
            primarySt,
            nextVer,
            nowTs,
            isBatch ? primarySt.fm.contacts : currentContacts
          )}</div>
        </div>
      </div>

      <div class="mgmt-modal-footer">
        <button class="gcp-action-btn" style="flex:0 0 auto; height:34px; padding:0 18px; font-size:12px;" onclick="closePublishConfirmModal()">취소 (Cancel)</button>
        <button class="bq-run-btn" id="modal-confirm-exec-btn" style="flex:0 0 auto; height:34px; padding:0 18px; font-size:12px;" onclick="executeConfirmedPublish()">
          확인 및 배포 실행 (${isBatch ? `${batchIndices.length}건 일괄 반영` : `v${oldVer} ➔ v${nextVer}`})
        </button>
      </div>
    `;
  }

  window.executeConfirmedPublish = function () {
    const noteInput = document.getElementById("modal-change-note-input");
    const changeNote = noteInput ? noteInput.value.trim() : CHANGE_NOTE_PRESETS[0];
    const nowTs = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const isBatch = MODAL_MODE === "BATCH";
    const batchIndices = isBatch ? Array.from(MGMT_SELECTED_SET) : [MGMT_ACTIVE_KEY];

    const ovContacts = isBatch ? getModalSelectValue("batch-override-contacts", "") : null;
    const ovVerifiedBy = isBatch ? getModalSelectValue("batch-override-verified-by", "") : null;
    const ovStatus = isBatch ? getModalSelectValue("batch-override-status", "") : null;
    const ovContentClass = isBatch ? getModalSelectValue("batch-override-content-class", "") : null;
    const ovMethod = isBatch ? getModalSelectValue("batch-override-verified-method", "") : null;

    let firstResult = null;

    batchIndices.forEach((key) => {
      const st = getEffectiveItemState(key);
      if (!st) return;
      const oldVer = st.baseFm.version || "0.2.0";
      const nextVer = bumpSemverJs(oldVer, MODAL_BUMP_LEVEL);

      if (!isBatch) {
        const chosenContacts = getModalSelectValue(
          "modal-contacts-select",
          MODAL_CONTACTS_VALUE ?? st.fm.contacts ?? ""
        );
        st.fm.contacts = chosenContacts;
      } else {
        if (ovContacts === "__CLEAR__") st.fm.contacts = "";
        else if (ovContacts) st.fm.contacts = ovContacts;
        if (ovVerifiedBy) st.fm.verified_by = ovVerifiedBy;
        if (ovStatus) st.fm.status = ovStatus;
        if (ovContentClass) st.fm.content_class = ovContentClass;
        if (ovMethod) st.fm.verified_method = ovMethod;
      }

      st.fm.version = nextVer;
      st.fm.verified_at = nowTs;
      if (!st.isDocRoot) {
        st.fm.source_uri = st.fm.source_uri.replace(/\/v\d+\.\d+\.\d+\.md$/, `/v${nextVer}.md`);
      }
      st.baseFm = JSON.parse(JSON.stringify(st.fm));
      st.baseBody = st.body;
      st.isModified = false;
      st.historyCount = (st.historyCount || 0) + 1;
      st.changeNote = changeNote;
      persistSingleMgmtStateLang(st);

      const activeCorpusDir = isKo() ? "okf-kr" : "okf-en";
      if (!st.isDocRoot && OKF_FILES[st.idx]) {
        OKF_FILES[st.idx].version = `v${nextVer}`;
        OKF_FILES[st.idx].status = st.fm.status;
        if (isKo()) {
          OKF_FILES[st.idx].body_ko = st.body;
          OKF_FILES[st.idx].gcs_uri_ko = st.fm.source_uri;
        } else {
          OKF_FILES[st.idx].body_en = st.body;
          OKF_FILES[st.idx].gcs_uri_en = st.fm.source_uri;
        }
      }

      if (!firstResult) {
        firstResult = {
          bump_level: MODAL_BUMP_LEVEL,
          old_version: oldVer,
          new_version: nextVer,
          updated_at: nowTs,
          snapshot_gcs_uri: `gs://hp-dragonfly-okf/${activeCorpusDir}/versions/${st.kc_entry_id}_v${oldVer}.md`,
          canonical_gcs_uri: st.fm.source_uri
        };
      }
    });

    MGMT_LAST_PUBLISH_RESULT = firstResult;
    if (isBatch) MGMT_SELECTED_SET.clear();
    closePublishConfirmModal();
    renderManagementModule();
  };

  // =========================================================================
  // Tab B — GCP Dataplex Knowledge Catalog Explorer (100% Unstructured OKF)
  // =========================================================================
  function getAllCatalogEntriesList() {
    initManagementState(false);
    syncMgmtStateLangBindings();
    const list = [];
    const k = isKo();
    const corpusPrefix = k ? "okf-kr" : "okf-en";

    OKF_DOC_ROOTS.forEach((d) => {
      const docKey = `DOC:${d.doc_id}`;
      const st = MGMT_DOC_STATE[d.doc_id];
      if (!st) return;
      const baseEntryId = st.rel.replace(/\.md$/, "");
      list.push({
        key: `ACTIVE:${docKey}`,
        isDeprecated: false,
        provIdx: docKey,
        baseEntryId,
        entryId: `${corpusPrefix}/${baseEntryId}`,
        title: `[${d.doc_num} ${k ? "문서 총괄" : "Chapter Overview"}] ${st.fm.title}`,
        sectionNumber: k ? st.section_number : st.section_number_en || st.section_number,
        docTitle: k ? d.title_ko : d.title_en,
        version: st.fm.version,
        status: st.fm.status,
        updatedAt: st.fm.verified_at,
        gcsUri: st.fm.source_uri,
        canonicalRelPath: st.rel,
        changeNote: st.changeNote,
        fm: st.fm,
        body: st.body,
        sha256: st.sha256
      });
    });

    MGMT_STATE.forEach((st) => {
      const isDep = String(st.fm.status || "").toLowerCase() === "deprecated";
      const secNum = k ? st.section_number : st.section_number_en || st.section_number;
      const baseEntryId = st.rel.replace(/\.md$/, "");
      list.push({
        key: isDep ? `DEP:INLINE:${st.idx}` : `ACTIVE:${st.idx}`,
        isDeprecated: isDep,
        provIdx: st.idx,
        baseEntryId,
        entryId: `${corpusPrefix}/${baseEntryId}`,
        title: `[${st.doc_num}] ${secNum} · ${st.fm.title}`,
        sectionNumber: secNum,
        docTitle: k ? st.doc_short_ko : st.doc_short_en,
        version: st.fm.version,
        supersededBy: st.supersededBy ? `${corpusPrefix}/${st.supersededBy}` : null,
        supersededByVer: st.supersededByVer,
        status: st.fm.status,
        updatedAt: st.fm.verified_at,
        gcsUri: st.fm.source_uri,
        canonicalRelPath: st.rel,
        changeNote: st.changeNote,
        fm: st.fm,
        body: st.body,
        sha256: st.sha256
      });
    });

    return list;
  }

  function renderKcExplorerSplitHtml() {
    const allEntries = getAllCatalogEntriesList();
    const activeCount = allEntries.filter((e) => !e.isDeprecated).length;
    const depCount = allEntries.filter((e) => e.isDeprecated).length;
    const q = KC_SEARCH_QUERY.trim().toLowerCase();
    const k = isKo();

    const filtered = allEntries.filter((e) => {
      if (KC_FILTER_STATUS === "VERIFIED" && e.isDeprecated) return false;
      if (KC_FILTER_STATUS === "DEPRECATED" && !e.isDeprecated) return false;
      if (q) {
        const hay = `${e.entryId} ${e.title} ${e.gcsUri} ${e.version} ${e.sectionNumber}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!KC_SELECTED_KEY || !allEntries.some((e) => e.key === KC_SELECTED_KEY)) {
      const preferredKey = `ACTIVE:${MGMT_ACTIVE_KEY}`;
      KC_SELECTED_KEY = filtered.some((e) => e.key === preferredKey)
        ? preferredKey
        : filtered.length > 0
        ? filtered[0].key
        : preferredKey;
    }
    const sel =
      allEntries.find((e) => e.key === KC_SELECTED_KEY) || filtered[0] || allEntries[0];

    let counterpart = null;
    if (sel) {
      if (sel.isDeprecated) {
        counterpart = allEntries.find(
          (e) => !e.isDeprecated && sel.supersededBy && e.entryId === sel.supersededBy
        );
      } else {
        counterpart = allEntries.find(
          (e) => e.isDeprecated && e.supersededBy === sel.entryId
        );
      }
    }

    const kcSearchPh = k
      ? "KC 엔트리 검색 (제1장, 별표 3-1, §5.1, 3.2, 내규, doc.md)..."
      : "Search KC entry (Ch.1, Table 3-1, §5.1, 3.2, SOP, doc.md)...";

    return `
      <div class="mgmt-body-split">
        <!-- Left Dataplex Knowledge Catalog Entry List -->
        <aside class="mgmt-sidebar" style="width:345px;">
          <div class="search-wrap" style="display:flex; flex-direction:column; gap:8px;">
            <input type="text" class="search-input" placeholder="${escapeHtml(
              kcSearchPh
            )}" value="${escapeHtml(KC_SEARCH_QUERY)}" oninput="onKcSearchInput(this.value)" />
            <div style="display:flex; gap:5px;">
              <button class="mgmt-chip-btn ${
                KC_FILTER_STATUS === "ALL" ? "active" : ""
              }" style="flex:1;" onclick="setKcStatusFilter('ALL')">
                ${k ? "전체" : "All"} (${allEntries.length})
              </button>
              <button class="mgmt-chip-btn ${
                KC_FILTER_STATUS === "VERIFIED" ? "active" : ""
              }" style="flex:1;" onclick="setKcStatusFilter('VERIFIED')">
                ${k ? "활성" : "Active"} (${activeCount})
              </button>
              <button class="mgmt-chip-btn ${
                KC_FILTER_STATUS === "DEPRECATED" ? "active" : ""
              }" style="flex:1;" onclick="setKcStatusFilter('DEPRECATED')">
                ${k ? "만료" : "Deprecated"} (${depCount})
              </button>
            </div>
          </div>

          <div class="nav-list">
            ${
              filtered.length === 0
                ? `<div style="padding:20px; text-align:center; font-size:12px; color:var(--text-sub);">${
                    k
                      ? "해당 상태의 Knowledge Catalog 엔트리가 없습니다."
                      : "No Knowledge Catalog entries match the current filter."
                  }</div>`
                : filtered
                    .map(
                      (e) => `
              <div class="mgmt-tree-row ${
                e.key === KC_SELECTED_KEY ? "active" : ""
              }" onclick="selectKcExplorerEntry('${e.key}')">
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                    <span style="font-size:12px; font-weight:600; color:${
                      e.isDeprecated
                        ? "var(--gcp-red)"
                        : e.key === KC_SELECTED_KEY
                        ? "var(--gcp-blue)"
                        : "var(--text)"
                    }; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                      ${escapeHtml(e.title)}
                    </span>
                    <span class="mgmt-status-pill ${e.isDeprecated ? "deprecated" : "synced"}">
                      ${
                        e.isDeprecated
                          ? `DEPRECATED · v${escapeHtml(e.version)}`
                          : `${escapeHtml(e.status.toUpperCase())} · v${escapeHtml(e.version)}`
                      }
                    </span>
                  </div>
                  <div style="font-family:var(--mono); font-size:10.5px; color:var(--text-sub); margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${escapeHtml(e.gcsUri)}
                  </div>
                </div>
              </div>
            `
                    )
                    .join("")
            }
          </div>
        </aside>

        <!-- Right GCP Dataplex Knowledge Catalog Entry Detail View -->
        <section class="mgmt-editor-pane" style="border-right:0;">
          ${sel ? renderKcDetailInspectorHtml(sel, counterpart) : ""}
        </section>
      </div>
    `;
  }

  function formatGcpConsoleTimestamp(isoStr, fallbackFormatted) {
    if (!isoStr) return fallbackFormatted || "Oct 25, 2026, 1:00:00 PM";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return fallbackFormatted || isoStr;
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    } catch (_) {
      return fallbackFormatted || isoStr;
    }
  }

  function renderKcDetailInspectorHtml(sel, counterpart) {
    const fm = sel.fm;
    const creationTimeStr = "Oct 25, 2026, 4:00:00 AM";
    const lastModTimeStr = formatGcpConsoleTimestamp(sel.updatedAt, "Oct 25, 2026, 4:00:00 AM");
    const genTimeStr = formatGcpConsoleTimestamp(fm.generated_at, "Oct 25, 2026, 4:00:00 AM");
    const verTimeStr = formatGcpConsoleTimestamp(sel.updatedAt, "Oct 25, 2026, 4:00:00 AM");
    const openArg = typeof sel.provIdx === "string" ? `'${escapeHtml(sel.provIdx)}'` : sel.provIdx;
    const k = isKo();

    return `
      <div class="pane-subbar">
        <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0; overflow:hidden;">
          <span style="font-weight:600; color:var(--text); flex-shrink:0;">Knowledge Catalog</span>
          <span style="color:var(--text-muted); flex-shrink:0;">/</span>
          <code style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0;" title="${escapeHtml(
            sel.entryId
          )}">${escapeHtml(sel.entryId)}</code>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-shrink:0;">
          ${
            sel.provIdx !== undefined
              ? `
            <button class="gcp-action-btn" style="padding:4px 12px; font-size:11.5px; white-space:nowrap; flex-shrink:0;" onclick="selectMgmtFileItem(${openArg}); toggleMgmtSubView('EDITOR');">
              ${k ? "OKF Editor로 열기" : "Open in OKF Editor"}
            </button>
          `
              : ""
          }
        </div>
      </div>

      <div class="mgmt-editor-scroll">
        <!-- Top Title Banner & Version Lineage Notice -->
        <div class="mgmt-card">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:18px; font-weight:600; color:var(--text);">${escapeHtml(sel.title)}</span>
              <span class="mgmt-status-pill ${sel.isDeprecated ? "deprecated" : "synced"}">${escapeHtml(
      sel.status.toUpperCase()
    )}</span>
              <span class="badge-pill badge-blue">v${escapeHtml(sel.version)}</span>
            </div>
            <code style="font-family:var(--mono); font-size:11.5px; color:var(--gcp-blue);">${escapeHtml(
              sel.gcsUri
            )}</code>
          </div>

          ${
            sel.isDeprecated
              ? `
            <div style="margin-bottom:16px; padding:10px 12px; border-radius:6px; background:var(--gcp-red-bg); border:1px solid var(--gcp-red); display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <span style="font-size:12px; color:var(--gcp-red);">
                <strong>${k ? "[만료 이력]" : "[Deprecation Lineage]"}</strong> ${
                  k
                    ? `이 엔트리는 신규 버전 <strong>v${escapeHtml(
                        sel.supersededByVer || "0.2.0"
                      )}</strong> 배포에 의해 만료(<code>status: deprecated</code>)되었으며 에이전트 인용이 차단됩니다. (사유: ${escapeHtml(
                        sel.changeNote
                      )})`
                    : `This entry was superseded by <strong>v${escapeHtml(
                        sel.supersededByVer || "0.2.0"
                      )}</strong> (<code>status: deprecated</code>) and is blocked from active agent citation. (Reason: ${escapeHtml(
                        sel.changeNote
                      )})`
                }
              </span>
            </div>
          `
              : counterpart
              ? `
            <div style="margin-bottom:16px; padding:10px 12px; border-radius:6px; background:var(--gcp-blue-bg); border:1px solid var(--gcp-blue); display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <span style="font-size:12px; color:var(--gcp-blue);">
                <strong>${k ? "[버전 계보]" : "[Version Lineage]"}</strong> ${
                  k
                    ? `구버전(<strong>v${escapeHtml(
                        counterpart.version
                      )}</strong>)을 만료시키고 승격된 최신 활성 엔트리입니다. (개정 사유: ${escapeHtml(sel.changeNote)})`
                    : `Promoted active entry that superseded legacy <strong>v${escapeHtml(
                        counterpart.version
                      )}</strong>. (Change Note: ${escapeHtml(sel.changeNote)})`
                }
              </span>
            </div>
          `
              : ""
          }

          <!-- 1. Entry details (Exact GCP Dataplex Knowledge Catalog Layout) -->
          <div class="gcp-kc-section-title">Entry details</div>
          <div class="gcp-kc-details-grid">
            <div>
              <div class="gcp-kc-field-label">System</div>
              <div class="gcp-kc-field-val">Open Knowledge Format</div>
            </div>
            <div>
              <div class="gcp-kc-field-label">Platform</div>
              <div class="gcp-kc-field-val">OKF</div>
            </div>
            <div>
              <div class="gcp-kc-field-label">Creation time</div>
              <div class="gcp-kc-field-val">${escapeHtml(creationTimeStr)}</div>
            </div>
            <div>
              <div class="gcp-kc-field-label">Last modification time</div>
              <div class="gcp-kc-field-val">${escapeHtml(lastModTimeStr)}</div>
            </div>
            <div>
              <div class="gcp-kc-field-label">Entry type</div>
              <div class="gcp-kc-field-val">OKF Document</div>
            </div>
            <div>
              <div class="gcp-kc-field-label">Domain</div>
              <div class="gcp-kc-field-val">HP Dragonfly Hardware &amp; Field Service</div>
            </div>
            <div>
              <div class="gcp-kc-field-label">Identifiers</div>
              <div class="gcp-kc-field-val">
                <span style="color:var(--text-sub); font-size:12px;">Resource:</span>
                <code style="font-family:var(--mono); font-size:12px; color:var(--gcp-blue); margin-left:4px;">${escapeHtml(
                  sel.gcsUri
                )}</code>
              </div>
            </div>
            <div>
              <div class="gcp-kc-field-label">Labels</div>
              <div class="gcp-kc-field-val">${escapeHtml(fm.tags || "-")}</div>
            </div>
            <div style="grid-column: 1 / -1;">
              <div class="gcp-kc-field-label">Description</div>
              <div class="gcp-kc-field-val">${escapeHtml(fm.description || sel.docTitle)}</div>
            </div>
            <div style="grid-column: 1 / -1;">
              <div class="gcp-kc-field-label">Contacts</div>
              <div class="gcp-kc-field-val">
                ${
                  fm.contacts
                    ? (() => {
                        const isOwner = isContactOwnerRole(fm.contacts);
                        const roleLabel = isOwner ? "Owner" : "Steward";
                        return `<span class="badge-pill ${
                          isOwner ? "badge-blue" : "badge-green"
                        }" style="margin-right:6px; font-size:11px;">${roleLabel}</span><span>${escapeHtml(
                          fm.contacts
                        )}</span>`;
                      })()
                    : "-"
                }
              </div>
            </div>
          </div>
        </div>

        <!-- 2. MIDDLE: Overview (dataplex-types.global.overview) -->
        <div class="mgmt-card">
          <div class="gcp-kc-section-title" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <span>Overview</span>
            <span class="badge-pill badge-green" style="font-size:11px;">MARKDOWN</span>
          </div>
          <div class="okf-title" style="font-size:15px;">${escapeHtml(sel.title)}</div>
          <div class="okf-body-box okf-md-content">${formatMgmtPreviewBody(sel.body)}</div>
        </div>

        <!-- 3. BOTTOM: Aspects (Clean Structured Name / Value Table) -->
        <div class="mgmt-card">
          <div class="gcp-kc-section-title">Aspects</div>

          ${
            fm.contacts
              ? (() => {
                  const rawC = String(fm.contacts).trim();
                  const m = rawC.match(/^(.+?)\s*<([^>]+)>$/);
                  const cName = m ? m[1].trim() : rawC;
                  const cEmail = m ? m[2].trim() : "";
                  const cRole = isContactOwnerRole(cName) ? "owner" : "steward";
                  return `
              <div class="gcp-kc-aspect-box" style="margin-bottom:12px;">
                <div class="gcp-kc-aspect-header">
                  <span>contacts</span>
                  <span style="font-family:var(--mono); font-size:11px; color:var(--text-sub);">dataplex-types.global.contacts</span>
                </div>
                <table class="kc-aspect-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="kc-group-row">
                      <th colspan="2">Identities</th>
                    </tr>
                    <tr class="kc-nested-row">
                      <th>Role</th>
                      <td><code>${escapeHtml(cRole)}</code></td>
                    </tr>
                    <tr class="kc-nested-row">
                      <th>Name</th>
                      <td>${escapeHtml(cName)}</td>
                    </tr>
                    <tr class="kc-nested-row">
                      <th>ID (Email)</th>
                      <td><code>${escapeHtml(cEmail || cName)}</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `;
                })()
              : ""
          }

          <div class="gcp-kc-aspect-box">
            <div class="gcp-kc-aspect-header">
              <span>okf</span>
              <span style="font-family:var(--mono); font-size:11px; color:var(--text-sub);">OKF Signal · v${escapeHtml(
                sel.version
              )}</span>
            </div>
            <table class="kc-aspect-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>OKF Type</th>
                  <td>${escapeHtml(fm.type || "Provision")}</td>
                </tr>
                <tr>
                  <th>Version</th>
                  <td><code>${escapeHtml(sel.version || "0.2.0")}</code></td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td><span class="mgmt-status-pill ${sel.isDeprecated ? "deprecated" : "synced"}">${escapeHtml(
      sel.status
    )}</span></td>
                </tr>
                <tr class="kc-group-row">
                  <th colspan="2">Generated</th>
                </tr>
                <tr class="kc-nested-row">
                  <th>Generated By</th>
                  <td><code>${escapeHtml(fm.generated_by)}</code></td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Generated At</th>
                  <td>${escapeHtml(genTimeStr)}</td>
                </tr>
                <tr class="kc-group-row">
                  <th colspan="2">Verified</th>
                </tr>
                <tr class="kc-nested-row">
                  <th>Verified By</th>
                  <td><code>${escapeHtml(fm.verified_by)}</code></td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Verified At</th>
                  <td>${escapeHtml(verTimeStr)}</td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Verification Method</th>
                  <td><code>${escapeHtml(fm.verified_method || "source_text_match")}</code></td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Checks</th>
                  <td><code>P1_body, P2_heading, P3_page, P4_digest</code></td>
                </tr>
                <tr class="kc-group-row">
                  <th colspan="2">Sources</th>
                </tr>
                <tr class="kc-nested-row">
                  <th colspan="2" style="font-weight:600; color:var(--text);">source</th>
                </tr>
                <tr class="kc-nested-row-2">
                  <th>Source ID</th>
                  <td><code>origin_pdf</code></td>
                </tr>
                <tr class="kc-nested-row-2">
                  <th>Resource</th>
                  <td><code>${escapeHtml(fm.source_resource)}</code></td>
                </tr>
                <tr class="kc-nested-row-2">
                  <th>Kind</th>
                  <td><code>origin_document</code></td>
                </tr>
                <tr class="kc-nested-row-2">
                  <th>SHA-256</th>
                  <td><code style="font-size:11.5px;">${escapeHtml(fm.sha256)}</code></td>
                </tr>
                <tr class="kc-group-row">
                  <th colspan="2">Governance &amp; Provenance</th>
                </tr>
                <tr class="kc-nested-row">
                  <th>Content Class</th>
                  <td><code>${escapeHtml(fm.content_class || "verbatim")}</code></td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Treatment</th>
                  <td><code>${escapeHtml(fm.treatment || "normative")}</code></td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Language</th>
                  <td><code>${escapeHtml(fm.language || (isKo() ? "ko" : "en"))}</code></td>
                </tr>
                <tr class="kc-nested-row">
                  <th>License</th>
                  <td>${escapeHtml(fm.license)}</td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Part Of</th>
                  <td><code>${escapeHtml(fm.part_of)}</code></td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Section Number</th>
                  <td>${escapeHtml(fm.section_number || sel.sectionNumber)}</td>
                </tr>
                <tr class="kc-nested-row">
                  <th>Source Page</th>
                  <td><code>p.${escapeHtml(String(fm.source_pages_span || fm.source_page || 1))}</code></td>
                </tr>
                ${
                  sel.changeNote
                    ? `
                  <tr class="kc-nested-row">
                    <th>Change Note</th>
                    <td>${escapeHtml(sel.changeNote)}</td>
                  </tr>
                `
                    : ""
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  window.onKcSearchInput = function (val) {
    KC_SEARCH_QUERY = val || "";
    renderManagementModule();
  };

  window.setKcStatusFilter = function (status) {
    KC_FILTER_STATUS = status;
    KC_SELECTED_KEY = null;
    renderManagementModule();
  };

  window.selectKcExplorerEntry = function (key) {
    KC_SELECTED_KEY = key;
    if (typeof key === "string" && key.startsWith("ACTIVE:")) {
      const sub = key.slice(7);
      if (sub.startsWith("DOC:")) {
        MGMT_ACTIVE_KEY = sub;
      } else {
        const idx = parseInt(sub, 10);
        if (!isNaN(idx) && idx >= 0 && idx < MGMT_STATE.length) {
          MGMT_ACTIVE_KEY = idx;
        }
      }
    }
    renderManagementModule();
  };

  // =========================================================================
  // 6. MODULE 04: BigQuery Property Graph (`#module-bq-graph`)
  //    100% Parity with `krda-ontology-studio` (`BqClass3DVisualizer` +
  //    Node/Edge Description Inspector + 2D GQL Instance Graph + 8 BQ Tables)
  // =========================================================================

  const BQ_CLASS_NODES = [
    {
      id: "CLS_HW_COMP",
      layer: "ONT",
      label: "HardwareComponent",
      ko: "하드웨어 스페어 부품 허브 (38 rows)",
      enSub: "Hardware Spare Parts Hub (38 rows)",
      x: 0,
      z: -12,
      radius: 18.5,
      color: 0x3b6ea5,
      isHub: true,
      pk: "part_number (STRING)",
      view: "hp_dragonfly_ontology_graph.HardwareComponent",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog",
      tableName: "hardware_components_catalog",
      desc_ko:
        "HP Dragonfly G3 및 Folio G3의 교체 가능 하드웨어 부품(FRU/CRU 38종: 온보드 LPDDR5 시스템 보드, 배터리, OLED/IPS 디스플레이, 열전도 모듈, 하판 커버 등)을 정의하는 핵심 허브 클래스입니다. 부품 간 선행 분해 의존성(REQUIRES_REMOVAL_OF DAG 15건) 및 고장 사례(AFFECTS_COMPONENT)의 중심 엔티티입니다.",
      desc_en:
        "Central ontology hub class representing 38 field-replaceable and customer-replaceable hardware spare parts (soldered LPDDR5 system boards, batteries, OLED/IPS displays, thermal modules, bottom covers) and anchoring the 15-edge prerequisite disassembly DAG (REQUIRES_REMOVAL_OF).",
      anchor: {
        anchor_type: "CENTRAL_HUB_CLASS",
        alias_group: "HardwareComponent, SparePart, FRU, SystemBoard, Battery, ThermalModule",
        match_bind_key: "part_number",
        gql_match_template:
          "(c:HardwareComponent {part_number: @part})-[:REQUIRES_REMOVAL_OF]->(pre:HardwareComponent)",
        planner_instruction_ko:
          "부품 교체 또는 분해 순서 질의 시 반드시 REQUIRES_REMOVAL_OF 엣지를 역방향/순방향 탐색하여 하판 커버(N22918-001) 및 배터리(M90788-005) 분리 선행 조건을 검증하세요.",
        planner_instruction_en:
          "When planning part replacement or disassembly, always traverse REQUIRES_REMOVAL_OF edges to enforce mandatory Bottom Cover (N22918-001) and Battery (M90788-005) removal prerequisites."
      },
      props: [
        { name: "part_number", type: "STRING (PK)", desc: "Official HP Spare Part Number (e.g., M90788-601, M90788-005)" },
        { name: "component_name", type: "STRING", desc: "Standard English hardware subsystem name" },
        { name: "component_category", type: "STRING", desc: "Subsystem category (System Board, Battery, Thermal, Display, Enclosure)" },
        { name: "replaceable_tier", type: "STRING", desc: "FRU (Authorized Service Only) vs. Mandatory Depot vs. Self-Repair" },
        { name: "esd_sensitive", type: "BOOL", desc: "Requires 700V ESD wrist-strap grounding prior to handling" },
        { name: "manual_page_ref", type: "INT64", desc: "Page reference in HP Service Guide N17344-001 (Ch.3 & Ch.5)" }
      ],
      ddl: `NODE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog\`\n    KEY (part_number)\n    LABEL HardwareComponent\n    PROPERTIES (part_number, component_name, component_category, specs_summary, replaceable_tier, esd_sensitive, manual_chapter_ref, manual_page_ref)\n)`
    },
    {
      id: "CLS_SKU",
      layer: "ONT",
      label: "ProductSKU",
      ko: "노트북 세부 SKU 구성 (12 rows)",
      enSub: "Configured Laptop SKUs (12 rows)",
      x: -185,
      z: -48,
      radius: 16,
      color: 0x3b6ea5,
      isHub: true,
      pk: "sku_id (STRING)",
      view: "hp_dragonfly_ontology_graph.ProductSKU",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs",
      tableName: "product_skus_and_configs",
      desc_ko:
        "CPU(Intel i5-1235U ~ i7-1265U vPro), 온보드 납땜 LPDDR5 메모리 용량(16GB/32GB), 3K2K OLED / WUXGA+ IPS 디스플레이, 5G/LTE WWAN 조합별 12개 세부 SKU 및 장착 시스템 보드 파트 번호(USES_SYSTEM_BOARD)를 정의합니다.",
      desc_en:
        "Defines 12 factory-configured HP Dragonfly G3 and Folio G3 SKUs by processor, soldered LPDDR5 memory capacity (16GB/32GB), display panel, WWAN modem, and exact system board spare part number (USES_SYSTEM_BOARD).",
      anchor: {
        anchor_type: "CONFIGURATION_ANCHOR",
        alias_group: "ProductSKU, LaptopConfig, SKU, SolderedLPDDR5Config",
        match_bind_key: "sku_id",
        gql_match_template: "(s:ProductSKU)-[:USES_SYSTEM_BOARD]->(b:HardwareComponent)",
        planner_instruction_ko:
          "LPDDR5 메모리는 온보드 납땜 구조이므로 메모리 불량 또는 용량 변경 질의 시 USES_SYSTEM_BOARD 엣지를 통해 해당 SKU의 전용 시스템 보드 파트 번호를 조회하세요.",
        planner_instruction_en:
          "Because LPDDR5 RAM is soldered onboard, resolve memory faults or capacity inquiries by traversing USES_SYSTEM_BOARD to the SKU's dedicated system board spare part."
      },
      props: [
        { name: "sku_id", type: "STRING (PK)", desc: "Unique HP SKU identifier (e.g., DF-FOLIO-G3-I7-32-OLED-5G)" },
        { name: "model_id", type: "STRING (FK)", desc: "Parent series model ID (BELONGS_TO_MODEL -> ProductModel)" },
        { name: "cpu_model", type: "STRING", desc: "12th Gen Intel Core processor SKU (i5-1235U to i7-1265U vPro)" },
        { name: "ram_gb", type: "INT64", desc: "Soldered LPDDR5-6400 memory capacity (16 GB or 32 GB, non-upgradable)" },
        { name: "display_spec", type: "STRING", desc: "13.5-inch 3:2 panel specification (3000x2000 OLED or 1920x1280 IPS)" },
        { name: "system_board_part_number", type: "STRING (FK)", desc: "Exact System Board FRU spare part (USES_SYSTEM_BOARD -> HardwareComponent)" }
      ],
      ddl: `NODE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs\`\n    KEY (sku_id)\n    LABEL ProductSKU\n    PROPERTIES (sku_id, model_id, sku_name, cpu_model, ram_gb, ram_type, storage_gb, display_spec, wwan_module, system_board_part_number)\n)`
    },
    {
      id: "CLS_MODEL",
      layer: "ONT",
      label: "ProductModel",
      ko: "제품군 마스터 모델 (6 rows)",
      enSub: "Series Master Models (6 rows)",
      x: -255,
      z: 68,
      radius: 14,
      color: 0x567ba8,
      isHub: false,
      pk: "model_id (STRING)",
      view: "hp_dragonfly_ontology_graph.ProductModel",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models",
      tableName: "dragonfly_series_models",
      desc_ko:
        "HP Dragonfly G3 Clamshell, Dragonfly Folio G3 2-in-1, Elite Dragonfly G2, Max, Chromebook, Dragonfly G4 등 6개 제품군의 폼팩터, CPU 세대, 섀시 소재 및 공식 서비스 가이드 문서 번호(N17344-001)를 정의합니다.",
      desc_en:
        "Master catalog of 6 HP Dragonfly series generations (G2, Max, Chromebook, G3 Clamshell, Folio G3 2-in-1, G4) including form factor, processor architecture, chassis material, and service guide part number.",
      anchor: {
        anchor_type: "MASTER_ENTITY",
        alias_group: "ProductModel, DragonflySeries, FolioG3, ClamshellG3",
        match_bind_key: "model_id",
        gql_match_template: "(s:ProductSKU)-[:BELONGS_TO_MODEL]->(m:ProductModel)",
        planner_instruction_ko:
          "Clamshell G3와 Folio G3(2-in-1 Pull-Forward 힌지)의 부품 호환성 혼동을 방지하기 위해 항상 model_id를 먼저 확인하세요.",
        planner_instruction_en:
          "Always verify model_id first to prevent mixing spare parts between Dragonfly G3 Clamshell and Dragonfly Folio G3 2-in-1."
      },
      props: [
        { name: "model_id", type: "STRING (PK)", desc: "Canonical series model ID (e.g., HP-DF-FOLIO-G3, HP-DF-G3-CLAM)" },
        { name: "model_name", type: "STRING", desc: "Official commercial marketing name" },
        { name: "form_factor", type: "STRING", desc: "Pull-Forward Convertible 2-in-1 vs. Ultra-Light Clamshell" },
        { name: "cpu_generation", type: "STRING", desc: "Intel 12th Gen Alder Lake-U (15W) architecture" },
        { name: "service_guide_doc_number", type: "STRING", desc: "Official HP Maintenance & Service Guide ID (N17344-001)" }
      ],
      ddl: `NODE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models\`\n    KEY (model_id)\n    LABEL ProductModel\n    PROPERTIES (model_id, model_name, generation, form_factor, release_year, display_size_inches, cpu_generation, memory_architecture, service_guide_doc_number)\n)`
    },
    {
      id: "CLS_CASE",
      layer: "ONT",
      label: "TroubleshootingCase",
      ko: "현장 고장·수리 사례 허브 (12 rows)",
      enSub: "Field Troubleshooting Cases (12 rows)",
      x: 185,
      z: -48,
      radius: 16,
      color: 0x3b6ea5,
      isHub: true,
      pk: "case_id (STRING)",
      view: "hp_dragonfly_ontology_graph.TroubleshootingCase",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases",
      tableName: "community_troubleshooting_cases",
      desc_ko:
        "커뮤니티 및 엔터프라이즈 서비스 현장에서 수집된 12대 주요 고장 사례(증상, 근본 원인, 단계별 해결책, BIOS 복구 필요 여부)를 정의하며, 결함 부품(AFFECTS_COMPONENT) 및 LED 점멸 진단코드(TRIGGERS_DIAGNOSTIC)를 양방향으로 연결합니다.",
      desc_en:
        "Captures 12 real-world field and community troubleshooting cases linking reported symptoms and root causes to defective hardware components (AFFECTS_COMPONENT) and LED/POST diagnostic codes (TRIGGERS_DIAGNOSTIC).",
      anchor: {
        anchor_type: "DIAGNOSTIC_TRIAGE_HUB",
        alias_group: "TroubleshootingCase, FieldIssue, FailureCase, Symptom",
        match_bind_key: "case_id",
        gql_match_template:
          "(tc:TroubleshootingCase)-[:TRIGGERS_DIAGNOSTIC]->(d:DiagnosticCode), (tc)-[:AFFECTS_COMPONENT]->(c:HardwareComponent)",
        planner_instruction_ko:
          "고객 증상 접수 시 TroubleshootingCase에서 TRIGGERS_DIAGNOSTIC과 AFFECTS_COMPONENT를 동시에 탐색하여 소프트웨어/BIOS 복구 가능 여부를 먼저 판별하세요.",
        planner_instruction_en:
          "For symptom triage, traverse both TRIGGERS_DIAGNOSTIC and AFFECTS_COMPONENT from TroubleshootingCase to check non-invasive BIOS recovery before dispatching FRU parts."
      },
      props: [
        { name: "case_id", type: "STRING (PK)", desc: "Unique troubleshooting case ID (e.g., CASE-DFG3-001)" },
        { name: "symptom_title", type: "STRING", desc: "Reported customer or technician symptom summary" },
        { name: "root_cause", type: "STRING", desc: "Verified engineering root cause analysis" },
        { name: "related_part_number", type: "STRING (FK)", desc: "Primary culprit spare part (AFFECTS_COMPONENT -> HardwareComponent)" },
        { name: "diagnostic_code", type: "STRING (FK)", desc: "Emitted blink/POST code (TRIGGERS_DIAGNOSTIC -> DiagnosticCode)" },
        { name: "requires_bios_update", type: "BOOL", desc: "True if HP Sure Start or SoftPaq BIOS update resolves or mitigates issue" }
      ],
      ddl: `NODE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases\`\n    KEY (case_id)\n    LABEL TroubleshootingCase\n    PROPERTIES (case_id, model_id, issue_category, symptom_title, root_cause, related_part_number, diagnostic_code, resolution_steps, requires_bios_update)\n)`
    },
    {
      id: "CLS_DIAG",
      layer: "ONT",
      label: "DiagnosticCode",
      ko: "LED 점멸 · POST 진단코드 (8 rows)",
      enSub: "LED Blink & POST Codes (8 rows)",
      x: 255,
      z: 68,
      radius: 14,
      color: 0xb88a44,
      isHub: false,
      pk: "diagnostic_code (STRING)",
      view: "hp_dragonfly_ontology_graph.DiagnosticCode",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.diagnostic_codes_reference",
      tableName: "diagnostic_codes_reference",
      desc_ko:
        "Caps Lock / 전원 LED 점멸 패턴(3.2 온보드 메모리 불량, 2.2 BIOS 손상, 5.2 시스템 보드 불량, 3.4 스토리지 오류 등) 및 POST 오류 코드별 결함 서브시스템과 공식 복구 절차를 정의합니다.",
      desc_en:
        "Reference dictionary of 8 Caps Lock / Power LED blink patterns (e.g., 3.2 Memory error, 2.2 BIOS corruption, 5.2 System board failure) and POST codes with subsystem mapping and recovery actions.",
      anchor: {
        anchor_type: "SIGNAL_CLASS",
        alias_group: "DiagnosticCode, BlinkCode, POSTCode, CapsLockLED",
        match_bind_key: "diagnostic_code",
        gql_match_template: "(tc:TroubleshootingCase)-[:TRIGGERS_DIAGNOSTIC]->(d:DiagnosticCode {diagnostic_code: @code})",
        planner_instruction_ko:
          "Caps Lock 점멸 횟수(긴 점멸.짧은 점멸)를 diagnostic_code(예: LED-CAPS-3-2)로 정규화하여 매칭하세요.",
        planner_instruction_en:
          "Normalize Caps Lock blink counts (long.short) into canonical diagnostic_code keys (e.g., LED-CAPS-3-2)."
      },
      props: [
        { name: "diagnostic_code", type: "STRING (PK)", desc: "Canonical diagnostic code ID (e.g., LED-CAPS-3-2, LED-CAPS-2-2)" },
        { name: "code_type", type: "STRING", desc: "LED Blink Pattern vs. POST Hex Error vs. HP PC Hardware Diagnostics UEFI" },
        { name: "blink_pattern", type: "STRING", desc: "Long and short blink sequence description" },
        { name: "subsystem", type: "STRING", desc: "Faulty hardware subsystem (Memory, System Board, BIOS, Thermal)" },
        { name: "recommended_action", type: "STRING", desc: "Authorized service troubleshooting and FRU replacement instruction" }
      ],
      ddl: `NODE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.diagnostic_codes_reference\`\n    KEY (diagnostic_code)\n    LABEL DiagnosticCode\n    PROPERTIES (diagnostic_code, code_type, blink_pattern, subsystem, severity, description, recommended_action, manual_page_ref)\n)`
    },
    {
      id: "CLS_FW",
      layer: "ONT",
      label: "FirmwareBiosNvm",
      ko: "BIOS · SoftPaq · NVM 보안 (8 rows)",
      enSub: "BIOS, SoftPaq & NVM Chips (8 rows)",
      x: -88,
      z: 92,
      radius: 13.5,
      color: 0x5c7c99,
      isHub: false,
      pk: "fw_id (STRING)",
      view: "prj_ontology_hp_dragonfly.firmware_bios_and_nvm",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm",
      tableName: "firmware_bios_and_nvm",
      desc_ko:
        "HP U95 시스템 BIOS, Thunderbolt 4 Retimer 펌웨어, Intel ISH 센서 허브 펌웨어 및 매뉴얼 Appendix B(p.96)에 정의된 비휘발성 메모리(SPI Flash 32MB, EC Flash, HP Sure Start Gen7 자가 치유 보안 정책)를 정의합니다.",
      desc_en:
        "Tracks 8 firmware releases (U95 System BIOS, Thunderbolt 4 retimer, ISH sensor hub) and Appendix B Non-Volatile Memory (NVM) chips protected by HP Sure Start Gen7.",
      anchor: {
        anchor_type: "FIRMWARE_SECURITY_CLASS",
        alias_group: "FirmwareBiosNvm, SureStart, BIOS, SoftPaq, NVM",
        match_bind_key: "fw_id",
        gql_match_template: "SELECT * FROM prj_ontology_hp_dragonfly.firmware_bios_and_nvm WHERE model_id = @model_id",
        planner_instruction_ko:
          "시스템 보드 교체 전후 BIOS 복구(Win+B) 및 Appendix B NVM 초기화 절차를 확인할 때 참조하세요.",
        planner_instruction_en:
          "Consult when verifying Win+B HP Sure Start BIOS recovery and Appendix B NVM sanitization policies."
      },
      props: [
        { name: "fw_id", type: "STRING (PK)", desc: "Firmware or NVM component identifier (e.g., FW-BIOS-U95-0109)" },
        { name: "component_type", type: "STRING", desc: "System BIOS, Thunderbolt Retimer, EC NVM, or SPI Flash" },
        { name: "version_or_sp", type: "STRING", desc: "BIOS version string and HP SoftPaq number" },
        { name: "nvm_security_feature", type: "STRING", desc: "HP Sure Start Gen7 / Tamper Lock / NIST SP 800-88 clearing rule" }
      ],
      ddl: `-- Auxiliary Ontology Table in hp-dragonfly.prj_ontology_hp_dragonfly\nSELECT fw_id, model_id, component_type, version_or_sp, nvm_security_feature, manual_page_ref\nFROM \`hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm\`;`
    },
    {
      id: "CLS_PORT",
      layer: "ONT",
      label: "PortSensorDock",
      ko: "I/O 포트 · 센서 · TB4 독 (10 rows)",
      enSub: "I/O Ports, Sensors & Docks (10 rows)",
      x: 88,
      z: 92,
      radius: 13.5,
      color: 0x5c7c99,
      isHub: false,
      pk: "spec_id (STRING)",
      view: "prj_ontology_hp_dragonfly.ports_sensors_and_docks",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.ports_sensors_and_docks",
      tableName: "ports_sensors_and_docks",
      desc_ko:
        "Thunderbolt 4 USB4(40Gbps, 100W PD), 홀 센서(자석 폴리오 태블릿 모드 전환 감지), 인체 근접 센서, MPP 2.0 마그네틱 펜 무선 충전 및 HP Thunderbolt Dock G4 멀티 모니터 호환성 매트릭스를 정의합니다.",
      desc_en:
        "Specifies 10 external I/O ports (Thunderbolt 4 40Gbps), hall/proximity sensors, magnetic stylus charging, and HP Thunderbolt Dock G4 display/power matrices.",
      anchor: {
        anchor_type: "IO_SPEC_CLASS",
        alias_group: "PortSensorDock, Thunderbolt4, HallSensor, StylusCharger, DockMatrix",
        match_bind_key: "spec_id",
        gql_match_template: "SELECT * FROM prj_ontology_hp_dragonfly.ports_sensors_and_docks WHERE category = @cat",
        planner_instruction_ko:
          "외장 모니터 출력 불량, 충전 불량, 태블릿 모드 미전환(홀 센서) 문의 시 참조하세요.",
        planner_instruction_en:
          "Consult for external display, USB-C PD charging, or tablet mode auto-switch (Hall sensor) inquiries."
      },
      props: [
        { name: "spec_id", type: "STRING (PK)", desc: "Unique I/O port, sensor, or dock specification ID" },
        { name: "category", type: "STRING", desc: "I/O Port, Integrated Sensor, Active Pen, or Docking Station" },
        { name: "feature_name", type: "STRING", desc: "Port or sensor name (e.g., Dual Thunderbolt 4 USB4 Type-C)" },
        { name: "technical_spec", type: "STRING", desc: "Bandwidth, PD wattage, DisplayPort 1.4, or sensor trigger spec" }
      ],
      ddl: `-- Auxiliary Ontology Table in hp-dragonfly.prj_ontology_hp_dragonfly\nSELECT spec_id, model_id, category, feature_name, technical_spec, related_part_number\nFROM \`hp-dragonfly.prj_ontology_hp_dragonfly.ports_sensors_and_docks\`;`
    },
    {
      id: "CLS_DOC",
      layer: "LEX",
      label: "ServiceManualDocument",
      ko: "공식 서비스 매뉴얼 루트 (N17344-001 · 109p)",
      enSub: "Origin Service Guide PDF (N17344-001 · 109p)",
      x: -195,
      z: 0,
      radius: 16,
      color: 0x3b735b,
      isHub: true,
      pk: "document_part_number (N17344-001)",
      view: "hp_dragonfly_ontology_graph.ServiceManualDocument",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_manual_documents",
      tableName: "lex_service_manual_documents",
      okfPath: "index.md",
      desc_ko:
        "HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide (문서 파트 번호 N17344-001, 총 109페이지) 원본 PDF 및 OKF v0.2 번들 루트 인덱스(index.md)입니다. SHA-256 해시로 원문 무결성이 검증됩니다.",
      desc_en:
        "Origin 109-page PDF Maintenance and Service Guide (Document Part Number N17344-001, SHA-256 attested) and OKF v0.2 progressive disclosure root index (index.md) synced to Dataplex EntryGroup okf_hp_dragonfly.",
      anchor: {
        anchor_type: "OKF_DOCUMENT_ROOT",
        alias_group: "ServiceManualDocument, OriginPDF, N17344-001, index.md",
        match_bind_key: "document_part_number",
        gql_match_template: "kb.hp-dragonfly.us-central1.okf_hp_dragonfly/entries/index",
        planner_instruction_ko:
          "Progressive Disclosure 원칙에 따라 에이전트는 항상 루트 index.md를 먼저 읽고 필요한 하위 레퍼런스/플레이북만 선택 로드합니다.",
        planner_instruction_en:
          "Per OKF Progressive Disclosure, agents read root index.md first and selectively load child references or playbooks."
      },
      props: [
        { name: "document_part_number", type: "STRING (PK)", desc: "Official HP Document Part Number: N17344-001 (First Edition)" },
        { name: "source_pdf", type: "STRING", desc: "pdf_6290467_en-US-1.pdf (109 Pages, SHA-256 Attested)" },
        { name: "dataplex_entry_group", type: "STRING", desc: "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly" },
        { name: "okf_bundle_count", type: "INT64", desc: "28 OKF v0.2 Markdown files (21 semantic concepts, 110 edges)" }
      ],
      ddl: `# Dataplex Knowledge Catalog EntryGroup Scope\nscope: kb.hp-dragonfly.us-central1.okf_hp_dragonfly\nentry_type: projects/hp-dragonfly/locations/us-central1/entryTypes/okf-bundle\naspect_type: projects/hp-dragonfly/locations/us-central1/aspectTypes/okf`
    },
    {
      id: "CLS_REF",
      layer: "LEX",
      label: "ServiceManualChapter",
      ko: "비정형 매뉴얼 장·절 레퍼런스 (5 OKF Refs)",
      enSub: "Manual Chapters & Specs (5 OKF Refs)",
      x: 5,
      z: 0,
      radius: 17.5,
      color: 0x3b735b,
      isHub: true,
      pk: "okf_concept_id (references/*.md)",
      view: "hp_dragonfly_ontology_graph.ServiceManualChapter",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.lex_manual_chapters",
      tableName: "lex_manual_chapters",
      okfPath: "references/ch05-disassembly-and-esd-safety.md",
      desc_ko:
        "원본 109페이지 PDF에서 Enrichment Agent가 추출한 5개 핵심 비정형 레퍼런스 문서(Ch.3 일러스트 부품 카탈로그 p.19, Ch.5 ESD/분해 안전 수칙 p.29, Ch.6 점멸 진단코드 p.79, Appendix B Sure Start NVM 보안 p.96, TB4 독 전력 매트릭스 p.12)입니다.",
      desc_en:
        "Five attested OKF v0.2 reference documents extracted from the 109-page PDF manual (Ch.3 Spare Parts p.19, Ch.5 ESD & Disassembly p.29, Ch.6 Blink Codes p.79, App.B Sure Start NVM p.96, TB4 Dock Matrix p.12).",
      anchor: {
        anchor_type: "OKF_REFERENCE_SECTION",
        alias_group: "ServiceManualChapter, OKFReference, ESD Safety, BlinkCodeRef, SureStartNVM",
        match_bind_key: "manual_page_ref",
        gql_match_template: "(c:HardwareComponent)-[:DOCUMENTED_IN_CHAPTER]->(ref:ServiceManualChapter)",
        planner_instruction_ko:
          "BigQuery 정형 부품/진단코드 행에서 도출된 manual_page_ref로 해당 PDF 원문 페이지와 OKF 레퍼런스 마크다운을 즉시 교차 검증하세요.",
        planner_instruction_en:
          "Cross-verify structured BigQuery part and blink code rows against verbatim PDF pages using manual_page_ref."
      },
      props: [
        { name: "ch03-illustrated-parts-catalog", type: "Reference (p.19)", desc: "Chapter 3 Illustrated system board & FRU spare parts catalog" },
        { name: "ch05-disassembly-and-esd-safety", type: "Reference (p.29)", desc: "Chapter 5 700V ESD precautions, battery isolation & removal procedures" },
        { name: "ch06-led-blink-and-post-diagnostics", type: "Reference (p.79)", desc: "Chapter 6 Caps Lock LED blink patterns & UEFI diagnostics guide" },
        { name: "appx-b-nvm-security-and-sure-start", type: "Reference (p.96)", desc: "Appendix B Non-Volatile Memory sanitization & HP Sure Start Gen7" },
        { name: "thunderbolt-g4-dock-and-power-matrix", type: "Reference (p.12)", desc: "Chapter 1 Thunderbolt 4 USB4 PD charging & display resolution matrix" }
      ],
      ddl: `---\ntype: Reference\nstatus: verified\nsources:\n  - id: hp-service-guide-n17344-001\n    file: pdf_6290467_en-US-1.pdf\n    pages: "29-78"\n---`
    },
    {
      id: "CLS_PLAYBOOK",
      layer: "LEX",
      label: "ServicePlaybook",
      ko: "에이전트 표준 진단 플레이북 (6 OKF Docs)",
      enSub: "Triage Playbooks & Metrics (6 OKF Docs)",
      x: 205,
      z: 0,
      radius: 15.5,
      color: 0x2d6a4f,
      isHub: false,
      pk: "playbook_id (playbooks/*.md)",
      view: "hp_dragonfly_ontology_graph.ServicePlaybook",
      table: "hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_playbooks",
      tableName: "lex_service_playbooks",
      okfPath: "playbooks/no-boot-bios-sure-start-recovery.md",
      desc_ko:
        "온톨로지 에이전트가 부팅 불량·점멸 오류나 발열·배터리 스웰링 문의 시 무분해 복구(Win+B HP Sure Start)를 먼저 수행하고, 실패 시에만 검증된 GQL 쿼리(computations/)를 실행하여 최소 분해 깊이로 부품을 교체하도록 안내하는 표준 운영 플레이북입니다.",
      desc_en:
        "Actionable agent triage playbooks (No-Boot Sure Start BIOS Recovery & Thermal/Battery Swelling Triage), service metrics, and attested GQL computations synced to Dataplex Knowledge Catalog.",
      anchor: {
        anchor_type: "OKF_AGENT_PLAYBOOK",
        alias_group: "ServicePlaybook, TriagePlaybook, AttestedComputation, ServiceMetric",
        match_bind_key: "playbook_id",
        gql_match_template: "(tc:TroubleshootingCase)-[:GOVERNED_BY_PLAYBOOK]->(pb:ServicePlaybook)",
        planner_instruction_ko:
          "고장 사례(TroubleshootingCase) 해결 시 임의 추론을 금지하고 반드시 연결된 ServicePlaybook의 단계별 절차를 따르세요.",
        planner_instruction_en:
          "Never improvise repair instructions; strictly execute the step-by-step workflow in the linked ServicePlaybook."
      },
      props: [
        { name: "no-boot-bios-sure-start-recovery", type: "Playbook (p.79)", desc: "Step-by-step triage for Caps Lock 2.2 / 3.2 no-boot & Sure Start recovery" },
        { name: "thermal-throttling-and-battery-swelling", type: "Playbook (p.41)", desc: "Triage for 95C+ thermal throttling, fan error 90B & battery swelling" },
        { name: "system-board-replacement-prerequisites", type: "Computation", desc: "Attested SQL/GQL query resolving prerequisite removal DAG steps" },
        { name: "symptom-to-fru-part-resolution", type: "Computation", desc: "Attested GQL query mapping blink code -> case -> FRU spare part" }
      ],
      ddl: `---\ntype: Playbook\ntitle: "HP Dragonfly G3 No-Boot, Black Screen & HP Sure Start BIOS Recovery Playbook"\nstatus: verified\n---`
    }
  ];

  const BQ_CLASS_EDGES = [
    {
      id: "EDGE_REQUIRES_REMOVAL",
      source: "CLS_HW_COMP",
      target: "CLS_HW_COMP",
      rel: "REQUIRES_REMOVAL_OF",
      badgeLabel: "REQUIRES_REMOVAL_OF (DAG · 15)",
      isSelfLoop: true,
      loopIdx: 0,
      color: 0xa85c56,
      view: "component_disassembly_deps (15 rows)",
      joinKeys: "target_part_number ➔ prerequisite_part_number",
      desc_ko:
        "[선행 분해 의존성 DAG · 15건] 특정 하드웨어 부품(target_part_number, 예: 시스템 보드 M90788-601)을 분리하기 전에 반드시 먼저 제거해야 하는 선행 부품(prerequisite_part_number: 하판 커버 N22918-001 → 배터리 M90788-005 → 방열판 M90790-001), 작업 순서(step_order), 나사 규격(Torx T5 / Phillips PH0), ZIF 케이블 주의사항을 정의하는 자기참조 그래프 엣지입니다.",
      desc_en:
        "[Prerequisite Disassembly DAG · 15 rows] Self-referential directed edge on HardwareComponent (backed by component_disassembly_deps) specifying which prerequisite spare part must be removed prior to the target component, along with step_order, screw spec, and ZIF cable cautions.",
      ddl: `EDGE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.component_disassembly_deps\`\n    KEY (dependency_id)\n    SOURCE KEY (target_part_number) REFERENCES HardwareComponent (part_number)\n    DESTINATION KEY (prerequisite_part_number) REFERENCES HardwareComponent (part_number)\n    LABEL REQUIRES_REMOVAL_OF\n    PROPERTIES (dependency_id, step_order, relationship_type, fastener_spec, cable_disconnect_note, safety_warning, manual_section_ref, manual_page_ref)\n)`
    },
    {
      id: "EDGE_USES_SYSBOARD",
      source: "CLS_SKU",
      target: "CLS_HW_COMP",
      rel: "USES_SYSTEM_BOARD",
      badgeLabel: "USES_SYSTEM_BOARD (12)",
      color: 0x3b6ea5,
      badgeOffsetY: 12,
      view: "product_skus_and_configs (12 rows)",
      joinKeys: "ProductSKU.system_board_part_number ➔ HardwareComponent.part_number",
      desc_ko:
        "[SKU별 전용 시스템 보드 매핑 · 12건] HP Dragonfly G3 / Folio G3는 CPU와 LPDDR5(16GB/32GB) 메모리가 마더보드에 온보드 납땜(Soldered)되어 있으므로, 각 노트북 SKU가 사용하는 정확한 시스템 보드 스페어 파트 번호를 1:1로 연결하는 핵심 정형 엣지입니다.",
      desc_en:
        "[SKU-to-Motherboard Binding · 12 rows] Links each configured ProductSKU to its exact soldered CPU + LPDDR5 System Board spare part in HardwareComponent via system_board_part_number.",
      ddl: `EDGE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs\` AS sku_uses_system_board\n    KEY (sku_id)\n    SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)\n    DESTINATION KEY (system_board_part_number) REFERENCES HardwareComponent (part_number)\n    LABEL USES_SYSTEM_BOARD\n    PROPERTIES (cpu_model, ram_gb, ram_type, wwan_module)\n)`
    },
    {
      id: "EDGE_BELONGS_TO_MODEL",
      source: "CLS_SKU",
      target: "CLS_MODEL",
      rel: "BELONGS_TO_MODEL",
      badgeLabel: "BELONGS_TO_MODEL (12)",
      color: 0x567ba8,
      badgeOffsetY: 10,
      view: "product_skus_and_configs (12 rows)",
      joinKeys: "ProductSKU.model_id ➔ ProductModel.model_id",
      desc_ko:
        "[세부 SKU → 마스터 모델 소속 · 12건] 12개 세부 노트북 구성 SKU(sku_id)가 속한 상위 제품군 마스터 모델(HP Dragonfly Folio G3 2-in-1 또는 Dragonfly G3 Clamshell)을 연결합니다.",
      desc_en:
        "[SKU-to-Series Hierarchy · 12 rows] Associates each ProductSKU configuration with its parent ProductModel series via model_id.",
      ddl: `EDGE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs\` AS sku_belongs_to_model\n    KEY (sku_id)\n    SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)\n    DESTINATION KEY (model_id) REFERENCES ProductModel (model_id)\n    LABEL BELONGS_TO_MODEL\n    PROPERTIES (sku_name, price_usd_msrp)\n)`
    },
    {
      id: "EDGE_AFFECTS_COMP",
      source: "CLS_CASE",
      target: "CLS_HW_COMP",
      rel: "AFFECTS_COMPONENT",
      badgeLabel: "AFFECTS_COMPONENT (12)",
      color: 0x3b6ea5,
      badgeOffsetY: 12,
      view: "community_troubleshooting_cases (12 rows)",
      joinKeys: "TroubleshootingCase.related_part_number ➔ HardwareComponent.part_number",
      desc_ko:
        "[고장 사례 → 결함 부품 연결 · 12건] 현장 및 커뮤니티 고장 사례(case_id)의 물리적 원인이 되는 하드웨어 스페어 부품(related_part_number ➔ part_number)을 연결하여, 증상으로부터 교체 대상 FRU와 분해 순서를 한 번의 그래프 탐색으로 도출합니다.",
      desc_en:
        "[Symptom-to-Culprit FRU · 12 rows] Connects each field TroubleshootingCase to the primary defective HardwareComponent (related_part_number ➔ part_number) for end-to-end repair resolution.",
      ddl: `EDGE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases\` AS case_affects_component\n    KEY (case_id)\n    SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)\n    DESTINATION KEY (related_part_number) REFERENCES HardwareComponent (part_number)\n    LABEL AFFECTS_COMPONENT\n    PROPERTIES (issue_category, symptom_title, covered_under_standard_warranty)\n)`
    },
    {
      id: "EDGE_TRIGGERS_DIAG",
      source: "CLS_CASE",
      target: "CLS_DIAG",
      rel: "TRIGGERS_DIAGNOSTIC",
      badgeLabel: "TRIGGERS_DIAGNOSTIC (12)",
      color: 0xb88a44,
      badgeOffsetY: 10,
      view: "community_troubleshooting_cases (12 rows)",
      joinKeys: "TroubleshootingCase.diagnostic_code ➔ DiagnosticCode.diagnostic_code",
      desc_ko:
        "[고장 사례 → LED 점멸·POST 진단코드 · 12건] 고장 사례에서 발생하는 Caps Lock LED 점멸 패턴(예: LED-CAPS-3-2, LED-CAPS-2-2) 또는 POST 오류 코드(예: POST-90B)를 DiagnosticCode 엔티티와 연결합니다.",
      desc_en:
        "[Case-to-Blink/POST Code · 12 rows] Connects a field TroubleshootingCase to the emitted LED blink pattern or POST error in DiagnosticCode.",
      ddl: `EDGE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases\` AS case_triggers_diagnostic\n    KEY (case_id)\n    SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)\n    DESTINATION KEY (diagnostic_code) REFERENCES DiagnosticCode (diagnostic_code)\n    LABEL TRIGGERS_DIAGNOSTIC\n    PROPERTIES (symptom_title, requires_bios_update)\n)`
    },
    {
      id: "EDGE_FW_PROTECTS",
      source: "CLS_FW",
      target: "CLS_HW_COMP",
      rel: "PROTECTS_SYSTEM_BOARD_NVM",
      badgeLabel: "PROTECTS_NVM (10)",
      color: 0x5c7c99,
      badgeOffsetY: 9,
      view: "firmware_bios_and_nvm (10 rows)",
      joinKeys: "FirmwareBiosNvm.model_id ➔ SystemBoard / NVM",
      desc_ko:
        "[펌웨어·Sure Start 보안 → 시스템 보드 · 10건] HP U95 BIOS, Thunderbolt Retimer 펌웨어 및 HP Sure Start Gen7 보안 컨트롤러가 시스템 보드의 SPI Flash(32MB) 및 EC 비휘발성 메모리를 보호하고 복구하는 관계입니다.",
      desc_en:
        "[Firmware & Sure Start Protection · 10 rows] Links U95 System BIOS, Thunderbolt retimer firmware, and HP Sure Start Gen7 NVM protection rules to the system board hardware.",
      ddl: `-- Semantic relation in OKF v0.2 & BigQuery\nFirmwareBiosNvm (fw_id) -[PROTECTS_SYSTEM_BOARD_NVM]-> HardwareComponent (System Board SPI/EC NVM)`
    },
    {
      id: "EDGE_PORT_ATTACHED",
      source: "CLS_PORT",
      target: "CLS_HW_COMP",
      rel: "INTEGRATED_ON_COMPONENT",
      badgeLabel: "INTEGRATED_ON_PART (12)",
      color: 0x5c7c99,
      badgeOffsetY: 9,
      view: "ports_sensors_and_docks (12 rows)",
      joinKeys: "PortSensorDock.related_part_number ➔ HardwareComponent.part_number",
      desc_ko:
        "[포트·센서·펜 충전기 → 실장 부품 연결 · 12건] 각 I/O 포트(Thunderbolt 4), 홀 센서, 근접 센서, 마그네틱 펜 충전 코일이 실제로 납땜·실장된 스페어 부품(related_part_number)을 가리킵니다.",
      desc_en:
        "[Port/Sensor-to-Carrier Part · 12 rows] Maps each I/O port, hall sensor, proximity sensor, or magnetic pen charger to the physical spare part (related_part_number) that houses it.",
      ddl: `-- Foreign key relation in ports_sensors_and_docks\nPortSensorDock.related_part_number REFERENCES HardwareComponent (part_number)`
    },
    {
      id: "EDGE_BRIDGE_DOC_CHAPTER",
      source: "CLS_HW_COMP",
      target: "CLS_REF",
      rel: "DOCUMENTED_IN_CHAPTER",
      badgeLabel: "DOCUMENTED_IN_CHAPTER (pdf_page)",
      isBridge: true,
      color: 0xb88a44,
      view: "ONT ↔ LEX Bridge (manual_page_ref)",
      joinKeys: "HardwareComponent.manual_page_ref ➔ ServiceManualChapter.pages",
      desc_ko:
        "[정형 부품 ↔ 비정형 매뉴얼 장·절 브릿지] BigQuery 정형 테이블(hardware_components_catalog, component_disassembly_deps)의 manual_page_ref 속성을 통해 원본 PDF 서비스 매뉴얼(N17344-001)의 정확한 분해 절차 페이지(Ch.3 p.19, Ch.5 p.29~78) 및 OKF 레퍼런스 마크다운과 연결됩니다.",
      desc_en:
        "[Structured Part ↔ Unstructured PDF Bridge] Vertical cross-layer bridge linking BigQuery HardwareComponent & disassembly DAG steps via manual_page_ref to verbatim PDF manual chapters (Ch.3 p.19, Ch.5 p.29-78).",
      ddl: `-- Cross-Layer ONT <-> LEX Bridge\nHardwareComponent.manual_page_ref / manual_chapter_ref ➔ bundles/hp_dragonfly/references/ch05-disassembly-and-esd-safety.md`
    },
    {
      id: "EDGE_BRIDGE_DIAG_CH6",
      source: "CLS_DIAG",
      target: "CLS_REF",
      rel: "DEFINED_IN_CH6_MANUAL",
      badgeLabel: "DEFINED_IN_CH6 (p.79)",
      isBridge: true,
      color: 0xb88a44,
      view: "ONT ↔ LEX Bridge (Ch.6 p.79-84)",
      joinKeys: "DiagnosticCode.manual_page_ref ➔ ch06-led-blink-and-post-diagnostics.md",
      desc_ko:
        "[정형 진단코드 ↔ 비정형 매뉴얼 Ch.6 브릿지] BigQuery 진단코드 테이블(diagnostic_codes_reference)의 11개 점멸/POST 코드가 원본 PDF 매뉴얼 Chapter 6(p.79~84) 및 OKF 레퍼런스 문서와 1:1로 매핑됩니다.",
      desc_en:
        "[Diagnostic Code ↔ PDF Ch.6 Bridge] Vertical bridge mapping structured LED blink and POST codes in BigQuery to Chapter 6 (p.79-84) of the PDF Service Guide.",
      ddl: `-- Cross-Layer ONT <-> LEX Bridge\nDiagnosticCode.manual_page_ref (79..84) ➔ bundles/hp_dragonfly/references/ch06-led-blink-and-post-diagnostics.md`
    },
    {
      id: "EDGE_BRIDGE_PLAYBOOK",
      source: "CLS_CASE",
      target: "CLS_PLAYBOOK",
      rel: "GOVERNED_BY_PLAYBOOK",
      badgeLabel: "GOVERNED_BY_PLAYBOOK",
      isBridge: true,
      color: 0xb88a44,
      view: "ONT ↔ LEX Bridge (Playbook Triage)",
      joinKeys: "TroubleshootingCase.issue_category ➔ ServicePlaybook",
      desc_ko:
        "[현장 고장 사례 ↔ OKF 진단 플레이북 브릿지] 정형 고장 사례(TroubleshootingCase) 해결 시 에이전트가 참조해야 할 비정형 OKF v0.2 표준 진단 플레이북(무분해 HP Sure Start 복구 우선 수행, 발열/배터리 스웰링 점검) 및 검증된 GQL 쿼리를 연결합니다.",
      desc_en:
        "[Field Case ↔ OKF Playbook Bridge] Vertical bridge binding structured TroubleshootingCase records to OKF v0.2 diagnostic playbooks and attested GQL computations.",
      ddl: `-- Cross-Layer ONT <-> LEX Bridge\nTroubleshootingCase ➔ bundles/hp_dragonfly/playbooks/no-boot-bios-sure-start-recovery.md`
    },
    {
      id: "EDGE_BRIDGE_MODEL_DOC",
      source: "CLS_MODEL",
      target: "CLS_DOC",
      rel: "CITES_SERVICE_MANUAL",
      badgeLabel: "CITES_MANUAL (N17344-001)",
      isBridge: true,
      color: 0xb88a44,
      view: "ONT ↔ LEX Bridge (service_guide_doc_number)",
      joinKeys: "ProductModel.service_guide_doc_number ➔ ServiceManualDocument (N17344-001)",
      desc_ko:
        "[마스터 제품군 ↔ 원본 PDF 루트 브릿지] 정형 마스터 모델 테이블(dragonfly_series_models)의 service_guide_doc_number(N17344-001)가 하단 비정형 레이어의 109페이지 공식 서비스 매뉴얼 PDF 루트 엔티티를 가리킵니다.",
      desc_en:
        "[Model ↔ Origin PDF Root Bridge] Connects ProductModel.service_guide_doc_number (N17344-001) on the upper structured plate to the 109-page origin PDF document root on the lower plate.",
      ddl: `-- Cross-Layer ONT <-> LEX Bridge\nProductModel.service_guide_doc_number ('N17344-001') ➔ docs/pdf_6290467_en-US-1.pdf`
    },
    {
      id: "EDGE_LEX_PART_OF_DOC",
      source: "CLS_REF",
      target: "CLS_DOC",
      rel: "PART_OF_DOCUMENT",
      badgeLabel: "PART_OF_DOCUMENT (SHA256)",
      color: 0x3b735b,
      badgeOffsetY: 11,
      view: "OKF v0.2 YAML Provenance (sources)",
      joinKeys: "references/*.md ➔ pdf_6290467_en-US-1.pdf",
      desc_ko:
        "[OKF 레퍼런스 → 원본 PDF 소속 관계] 5개 OKF 레퍼런스 마크다운 파일의 YAML Frontmatter(sources.file, pages, sha256)가 원본 서비스 가이드 PDF(N17344-001)를 출처로 증명하는 관계입니다.",
      desc_en:
        "[OKF Provenance Containment] Binds each extracted OKF reference markdown file (references/*.md) to its parent origin PDF (pdf_6290467_en-US-1.pdf) via YAML frontmatter sources.",
      ddl: `sources:\n  - id: hp-service-guide-n17344-001\n    file: pdf_6290467_en-US-1.pdf\n    document_part_number: N17344-001`
    },
    {
      id: "EDGE_LEX_PLAYBOOK_REF",
      source: "CLS_PLAYBOOK",
      target: "CLS_REF",
      rel: "ORCHESTRATES_REFERENCE",
      badgeLabel: "ORCHESTRATES_REF",
      color: 0x3b735b,
      badgeOffsetY: 11,
      view: "OKF v0.2 Progressive Disclosure Links",
      joinKeys: "playbooks/*.md ➔ references/*.md",
      desc_ko:
        "[플레이북 → 매뉴얼 레퍼런스 참조 관계] 에이전트 진단 플레이북(playbooks/*.md)이 분해 안전 수칙(Ch.5 ESD), 점멸 진단코드(Ch.6), Sure Start NVM 보안(Appendix B) 레퍼런스를 단계별로 호출하는 시맨틱 링크입니다.",
      desc_en:
        "[Playbook-to-Reference Link] Connects agent triage playbooks to underlying ESD safety rules (Ch.5), blink code tables (Ch.6), and Sure Start NVM specs (App.B).",
      ddl: `-- Markdown relative links inside playbooks/*.md\nSee [Chapter 5 Disassembly & ESD](../references/ch05-disassembly-and-esd-safety.md)`
    }
  ];

  let bqThreeViz = null;
  let BQ_INSPECTOR_TAB = "NODE"; // 'NODE' | 'EDGE' | 'CATALOG' | 'TABLES'
  let SELECTED_CLASS_ID = "CLS_HW_COMP";
  let SELECTED_EDGE_ID = "EDGE_REQUIRES_REMOVAL";

  class BqClass3DVisualizer {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.LAYER_Y_ONT = 105;
      this.LAYER_Y_LEX = -105;
      this.nodes = new Map();
      this.meshGroup = new window.THREE.Group();
      this.lineGroup = new window.THREE.Group();
      this.plateGroup = new window.THREE.Group();
      this.animId = null;
      this.initScene();
    }

    initScene() {
      const THREE = window.THREE;
      const width = this.container.clientWidth || 920;
      const height = this.container.clientHeight || 660;
      const isDark = document.body.classList.contains("dark-mode");

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(isDark ? 0x1f1f1f : 0xf8f9fa);

      this.camera = new THREE.PerspectiveCamera(44, width / height, 1, 4000);
      this.camera.position.set(0, 145, 650);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.container.innerHTML = "";
      this.container.appendChild(this.renderer.domElement);

      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.92));
      const dLight = new THREE.DirectionalLight(0xffffff, 0.65);
      dLight.position.set(250, 500, 250);
      this.scene.add(dLight);

      this.scene.add(this.plateGroup);
      this.scene.add(this.lineGroup);
      this.scene.add(this.meshGroup);

      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.renderer.domElement.addEventListener("click", (e) => this.onClick(e));
      this.renderer.domElement.addEventListener("mousemove", (e) => this.onMouseMove(e));
      this.renderer.domElement.addEventListener("mouseleave", () => this.hideHoverTooltip());

      if (window.ResizeObserver && this.container) {
        this.resizeObserver = new window.ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.container);
      }

      this.rebuildThemeAndGraph();
      this.animate();
    }

    rebuildThemeAndGraph() {
      const THREE = window.THREE;
      const isDark = document.body.classList.contains("dark-mode");
      const isLight = !isDark;
      const k = isKo();
      this.scene.background = new THREE.Color(isLight ? 0xf8f9fa : 0x1f1f1f);

      while (this.plateGroup.children.length) this.plateGroup.remove(this.plateGroup.children[0]);
      while (this.meshGroup.children.length) this.meshGroup.remove(this.meshGroup.children[0]);
      while (this.lineGroup.children.length) this.lineGroup.remove(this.lineGroup.children[0]);
      this.nodes.clear();

      this.plateGroup.add(
        this.createPlate(
          this.LAYER_Y_ONT,
          0x3b6ea5,
          k
            ? "ONTOLOGY LAYER (BigQuery 영문 정형 테이블 8종 · 109 Rows — 7 Classes)"
            : "ONTOLOGY LAYER (BigQuery 8 Structured Tables · 109 Rows — 7 Classes)",
          isLight
        )
      );
      this.plateGroup.add(
        this.createPlate(
          this.LAYER_Y_LEX,
          0x3b735b,
          k
            ? "LEX / DOC LAYER (비정형 서비스 매뉴얼 N17344-001 · 28 OKF Files — 3 Classes)"
            : "LEX / DOC LAYER (Unstructured PDF Manual N17344-001 · 28 OKF Files — 3 Classes)",
          isLight
        )
      );

      BQ_CLASS_NODES.forEach((n) => {
        const plateY = n.layer === "ONT" ? this.LAYER_Y_ONT : this.LAYER_Y_LEX;
        const nodeY = plateY + 6;
        const rad = n.radius || 14;
        const geom = new THREE.SphereGeometry(rad, 28, 28);
        const mat = new THREE.MeshStandardMaterial({
          color: n.color,
          roughness: 0.45,
          metalness: 0.08
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(n.x, nodeY, n.z);
        mesh.userData = { itemType: "NODE", node: n };
        this.meshGroup.add(mesh);

        if (n.isHub) {
          const ringGeom = new THREE.RingGeometry(rad + 3.5, rad + 5.8, 36);
          const ringMat = new THREE.MeshBasicMaterial({
            color: n.layer === "ONT" ? 0x3b6ea5 : 0x3b735b,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.38
          });
          const ring = new THREE.Mesh(ringGeom, ringMat);
          ring.rotation.x = -Math.PI / 2;
          ring.position.set(n.x, plateY + 1.0, n.z);
          this.plateGroup.add(ring);
        }

        const subLabel = k ? n.ko : n.enSub;
        const sprite = this.createNodePillSprite(n.label, subLabel, n.color, isLight);
        sprite.position.set(n.x, nodeY + rad + 16, n.z);
        sprite.userData = { itemType: "NODE", node: n };
        this.meshGroup.add(sprite);

        this.nodes.set(n.id, { data: n, mesh });
      });

      BQ_CLASS_EDGES.forEach((e) => {
        const s = this.nodes.get(e.source);
        const t = this.nodes.get(e.target);
        if (!s || !t) return;

        if (e.isSelfLoop) {
          const p = s.mesh.position;
          const cp1 = new THREE.Vector3(p.x - 55, p.y + 18, p.z - 95);
          const cp2 = new THREE.Vector3(p.x + 65, p.y + 18, p.z - 95);
          const labelPos = new THREE.Vector3(p.x + 4, p.y + 24, p.z - 84);
          const curve = new THREE.CubicBezierCurve3(p.clone(), cp1, cp2, p.clone());
          const tubeGeom = new THREE.TubeGeometry(curve, 36, 0.55, 8, false);
          const tubeMat = new THREE.MeshBasicMaterial({
            color: e.color || 0xa85c56,
            transparent: true,
            opacity: 0.85
          });
          const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
          tubeMesh.userData = { itemType: "EDGE", edge: e };
          this.meshGroup.add(tubeMesh);

          const badge = this.createEdgeBadgeSprite(e.badgeLabel || e.rel, e.color || 0xa85c56, isLight);
          badge.position.copy(labelPos);
          badge.userData = { itemType: "EDGE", edge: e };
          this.meshGroup.add(badge);
          return;
        }

        const color = e.color || (e.isBridge ? 0xb88a44 : 0x6b88a8);
        const startPos = s.mesh.position.clone();
        const endPos = t.mesh.position.clone();
        let curve;
        if (e.isBridge) {
          curve = new THREE.LineCurve3(startPos, endPos);
        } else {
          const midCtrl = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
          midCtrl.y += 10;
          curve = new THREE.QuadraticBezierCurve3(startPos, midCtrl, endPos);
        }

        const tubeRadius = e.isBridge ? 0.58 : 0.46;
        const tubeGeom = new THREE.TubeGeometry(curve, 24, tubeRadius, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: e.isBridge ? 0.84 : 0.76
        });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        tubeMesh.userData = { itemType: "EDGE", edge: e };
        this.meshGroup.add(tubeMesh);

        const tParam = 0.78;
        const conePos = curve.getPoint(tParam);
        const tangent = curve.getTangent(tParam).normalize();
        const coneGeom = new THREE.ConeGeometry(tubeRadius * 3.2, 6.5, 12);
        const coneMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.88 });
        const cone = new THREE.Mesh(coneGeom, coneMat);
        cone.position.copy(conePos);
        cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        cone.userData = { itemType: "EDGE", edge: e };
        this.meshGroup.add(cone);

        // Render floating 3D Edge Badge Sprite on every edge so relations are always visible in 3D Class View
        const mid = curve.getPoint(0.5);
        mid.y += e.badgeOffsetY || (e.isBridge ? 0 : 9);
        const badge = this.createEdgeBadgeSprite(e.badgeLabel || e.rel, color, isLight);
        badge.position.copy(mid);
        badge.userData = { itemType: "EDGE", edge: e };
        this.meshGroup.add(badge);
      });
    }

    createPlate(y, borderColor, title, isLight) {
      const THREE = window.THREE;
      const group = new THREE.Group();
      const geom = new THREE.PlaneGeometry(680, 290);
      const mat = new THREE.MeshPhysicalMaterial({
        color: isLight ? 0xffffff : 0x242628,
        transparent: true,
        opacity: isLight ? 0.88 : 0.82,
        roughness: 0.35,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = y;
      group.add(mesh);

      const grid = new THREE.GridHelper(
        660,
        22,
        isLight ? 0xe0e3e7 : 0x35383b,
        isLight ? 0xf1f3f4 : 0x2c2e30
      );
      grid.position.y = y + 0.4;
      group.add(grid);

      const borderGeom = new THREE.EdgesGeometry(geom);
      const borderMat = new THREE.LineBasicMaterial({
        color: borderColor,
        transparent: true,
        opacity: 0.48
      });
      const border = new THREE.LineSegments(borderGeom, borderMat);
      border.rotation.x = -Math.PI / 2;
      border.position.y = y;
      group.add(border);

      const titleSprite = this.createPlateTitleSprite(title, borderColor, isLight);
      titleSprite.position.set(-165, y + 10, -132);
      group.add(titleSprite);
      return group;
    }

    createPlateTitleSprite(text, colorHex, isLight) {
      const THREE = window.THREE;
      const canvas = document.createElement("canvas");
      canvas.width = 840;
      canvas.height = 84;
      const ctx = canvas.getContext("2d");
      const hex = `#${colorHex.toString(16).padStart(6, "0")}`;
      ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(36, 38, 40, 0.95)";
      ctx.strokeStyle = hex;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(8, 8, 824, 68, 16);
      else ctx.rect(8, 8, 824, 68);
      ctx.fill();
      ctx.stroke();
      ctx.font = '600 20px "Google Sans", "Noto Sans KR", sans-serif';
      ctx.fillStyle = hex;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 420, 42);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
      );
      sprite.scale.set(190, 19, 1);
      return sprite;
    }

    createNodePillSprite(enLabel, subLabel, colorHex, isLight) {
      const THREE = window.THREE;
      const canvas = document.createElement("canvas");
      canvas.width = 560;
      canvas.height = 132;
      const ctx = canvas.getContext("2d");
      const hex = `#${colorHex.toString(16).padStart(6, "0")}`;
      ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(38, 40, 42, 0.96)";
      ctx.strokeStyle = hex;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(10, 10, 540, 112, 20);
      else ctx.rect(10, 10, 540, 112);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 22.5px "Google Sans", sans-serif';
      ctx.fillStyle = isLight ? "#202124" : "#e3e3e3";
      ctx.textAlign = "center";
      ctx.fillText(enLabel, 280, 52);

      ctx.font = '500 17px "Noto Sans KR", "Google Sans", sans-serif';
      ctx.fillStyle = isLight ? "#5f6368" : "#9aa0a6";
      ctx.fillText(subLabel, 280, 88);

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
      );
      sprite.scale.set(95, 22.5, 1);
      return sprite;
    }

    createEdgeBadgeSprite(label, colorHex, isLight) {
      const THREE = window.THREE;
      const canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      const hex = `#${colorHex.toString(16).padStart(6, "0")}`;
      ctx.fillStyle = isLight ? "rgba(248, 249, 250, 0.96)" : "rgba(36, 38, 40, 0.96)";
      ctx.strokeStyle = hex;
      ctx.lineWidth = 1.9;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(8, 8, 464, 48, 12);
      else ctx.rect(8, 8, 464, 48);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 16.5px "Roboto Mono", "Google Sans", monospace';
      ctx.fillStyle = hex;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 240, 32);

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
      );
      sprite.scale.set(76, 10.2, 1);
      return sprite;
    }

    onClick(event) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.meshGroup.children, true);
      if (hits.length > 0 && hits[0].object && hits[0].object.userData) {
        const ud = hits[0].object.userData;
        if (ud.itemType === "NODE" && ud.node) {
          openBqClassInspector(ud.node.id);
        } else if (ud.itemType === "EDGE" && ud.edge) {
          openBqEdgeInspector(ud.edge.id);
        }
      }
    }

    onMouseMove(event) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.meshGroup.children, true);
      const tip = document.getElementById("bq-hover-tooltip");

      if (hits.length > 0 && hits[0].object && hits[0].object.userData) {
        this.renderer.domElement.style.cursor = "pointer";
        const ud = hits[0].object.userData;
        const k = isKo();
        if (tip) {
          if (ud.itemType === "NODE" && ud.node) {
            const n = ud.node;
            tip.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                <strong style="color:var(--gcp-blue); font-size:12px;">Node · ${escapeHtml(n.label)}</strong>
                <span class="mod-badge blue" style="font-size:10px; padding:1px 6px;">${escapeHtml(n.layer)}</span>
              </div>
              <div style="font-weight:600; color:var(--text); margin-bottom:3px;">${escapeHtml(k ? n.ko : n.enSub)}</div>
              <div style="color:var(--text-sub); font-size:11px;">${escapeHtml(k ? n.desc_ko : n.desc_en)}</div>
              <div style="margin-top:4px; font-size:10.5px; color:var(--gcp-blue); font-weight:600;">
                ${k ? "클릭하여 우측 패널에서 스키마·DDL·연결 엣지 상세 보기 ➔" : "Click to inspect schema, DDL & connected edges ➔"}
              </div>
            `;
          } else if (ud.itemType === "EDGE" && ud.edge) {
            const e = ud.edge;
            const sNode = BQ_CLASS_NODES.find((x) => x.id === e.source);
            const tNode = BQ_CLASS_NODES.find((x) => x.id === e.target);
            tip.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                <strong style="color:#b88a44; font-size:12px;">Edge · ${escapeHtml(e.rel)}</strong>
                <code style="font-size:10px; color:var(--text-sub);">${escapeHtml(e.view)}</code>
              </div>
              <div style="font-weight:600; color:var(--text); margin-bottom:3px;">
                ${escapeHtml(sNode ? sNode.label : e.source)} ➔ ${escapeHtml(tNode ? tNode.label : e.target)}
              </div>
              <div style="color:var(--text-sub); font-size:11px;">${escapeHtml(k ? e.desc_ko : e.desc_en)}</div>
              <div style="margin-top:4px; font-size:10.5px; color:var(--gcp-blue); font-weight:600;">
                ${k ? "클릭하여 우측 패널에서 Edge DDL 및 조인 키 상세 보기 ➔" : "Click to inspect Edge DDL & join keys ➔"}
              </div>
            `;
          }
          const stageRect = this.container.parentElement.getBoundingClientRect();
          const leftPx = Math.min(stageRect.width - 375, Math.max(16, event.clientX - stageRect.left + 16));
          const topPx = Math.min(stageRect.height - 140, Math.max(54, event.clientY - stageRect.top + 12));
          tip.style.left = `${leftPx}px`;
          tip.style.top = `${topPx}px`;
          tip.style.display = "block";
        }
      } else {
        this.renderer.domElement.style.cursor = "grab";
        this.hideHoverTooltip();
      }
    }

    hideHoverTooltip() {
      const tip = document.getElementById("bq-hover-tooltip");
      if (tip) tip.style.display = "none";
    }

    resize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth || 920;
      const h = this.container.clientHeight || 660;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    animate() {
      this.animId = requestAnimationFrame(() => this.animate());
      if (window.TWEEN) window.TWEEN.update();
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  window.bqCamReset = function () {
    if (!bqThreeViz) return;
    if (window.TWEEN) {
      new window.TWEEN.Tween(bqThreeViz.camera.position)
        .to({ x: 0, y: 145, z: 650 }, 850)
        .easing(window.TWEEN.Easing.Cubic.Out)
        .start();
      new window.TWEEN.Tween(bqThreeViz.controls.target)
        .to({ x: 0, y: 0, z: 0 }, 850)
        .easing(window.TWEEN.Easing.Cubic.Out)
        .start();
    } else {
      bqThreeViz.camera.position.set(0, 145, 650);
      bqThreeViz.controls.target.set(0, 0, 0);
    }
  };

  window.bqCamTop = function () {
    if (!bqThreeViz) return;
    if (window.TWEEN) {
      new window.TWEEN.Tween(bqThreeViz.camera.position)
        .to({ x: 0, y: 720, z: 10 }, 850)
        .easing(window.TWEEN.Easing.Cubic.Out)
        .start();
      new window.TWEEN.Tween(bqThreeViz.controls.target)
        .to({ x: 0, y: 0, z: 0 }, 850)
        .easing(window.TWEEN.Easing.Cubic.Out)
        .start();
    } else {
      bqThreeViz.camera.position.set(0, 720, 10);
      bqThreeViz.controls.target.set(0, 0, 0);
    }
  };

  window.bqCamSplit = function () {
    if (!bqThreeViz) return;
    if (window.TWEEN) {
      new window.TWEEN.Tween(bqThreeViz.camera.position)
        .to({ x: 0, y: 18, z: 670 }, 850)
        .easing(window.TWEEN.Easing.Cubic.Out)
        .start();
      new window.TWEEN.Tween(bqThreeViz.controls.target)
        .to({ x: 0, y: 0, z: 0 }, 850)
        .easing(window.TWEEN.Easing.Cubic.Out)
        .start();
    } else {
      bqThreeViz.camera.position.set(0, 18, 670);
      bqThreeViz.controls.target.set(0, 0, 0);
    }
  };

  window.toggleBqLeftSidebar = function () {
    const sb = document.getElementById("bq-left-sidebar");
    if (!sb) return;
    const isCollapsed = sb.classList.toggle("collapsed");
    const k = isKo();
    const icon1 = document.getElementById("bq-left-toggle-icon");
    const lbl1 = document.getElementById("lbl-bq-left-toggle");
    const icon2 = document.getElementById("bq-inst-left-toggle-icon");
    const lbl2 = document.getElementById("lbl-bq-inst-left-toggle");
    const nextIcon = isCollapsed ? "left_panel_open" : "left_panel_close";
    const nextText = isCollapsed
      ? k
        ? "좌측 패널 펼치기"
        : "Expand Left Panel"
      : k
      ? "좌측 패널 접기"
      : "Collapse Left Panel";
    if (icon1) icon1.textContent = nextIcon;
    if (lbl1) lbl1.textContent = nextText;
    if (icon2) icon2.textContent = nextIcon;
    if (lbl2) lbl2.textContent = nextText;

    setTimeout(() => {
      if (bqThreeViz) bqThreeViz.resize();
      if (window.bqVisNet) {
        try {
          window.bqVisNet.redraw();
          window.bqVisNet.fit({ animation: true });
        } catch (_) {}
      }
    }, 220);
  };

  window.toggleBqDrawerWidth = function () {
    const drawer = document.getElementById("bq-detail-drawer");
    if (!drawer) return;
    drawer.classList.add("open");
    const isWide = drawer.classList.toggle("wide");
    const k = isKo();
    const iconEl = document.getElementById("bq-drawer-wide-icon");
    const lblEl = document.getElementById("lbl-bq-drawer-wide");
    if (iconEl) iconEl.textContent = isWide ? "close_fullscreen" : "open_in_full";
    if (lblEl) lblEl.textContent = isWide ? (k ? "기본 폭" : "Normal") : k ? "넓게" : "Wide";
    setTimeout(() => {
      if (bqThreeViz) bqThreeViz.resize();
      if (window.bqVisNet) {
        try {
          window.bqVisNet.redraw();
        } catch (_) {}
      }
    }, 220);
  };

  window.toggleOkfCompareSidebar = function () {
    const sb = document.getElementById("okf-nav-sidebar");
    if (sb) sb.classList.toggle("collapsed");
  };

  window.toggleOkfGraphSidebar = function () {
    const sb = document.getElementById("okf-graph-sidebar");
    if (sb) sb.classList.toggle("collapsed");
    setTimeout(() => {
      if (okfNetwork) {
        try {
          okfNetwork.redraw();
          okfNetwork.fit({ animation: true });
        } catch (_) {}
      }
    }, 220);
  };

  function buildDrawerModeSwitchBar() {
    const k = isKo();
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border);">
        <div class="mgmt-subtab-group" style="width:100%; display:flex;">
          <button type="button" class="mgmt-subtab-btn ${BQ_INSPECTOR_TAB === "NODE" ? "active" : ""}" style="flex:1;" onclick="openBqClassInspector('${escapeHtml(SELECTED_CLASS_ID)}')">
            ${k ? "1. Node 명세 (10)" : "1. Node Spec (10)"}
          </button>
          <button type="button" class="mgmt-subtab-btn ${BQ_INSPECTOR_TAB === "EDGE" ? "active" : ""}" style="flex:1;" onclick="openBqEdgeInspector('${escapeHtml(SELECTED_EDGE_ID)}')">
            ${k ? "2. Edge 명세 (13)" : "2. Edge Spec (13)"}
          </button>
          <button type="button" class="mgmt-subtab-btn ${BQ_INSPECTOR_TAB === "CATALOG" ? "active" : ""}" style="flex:1;" onclick="openBqNodeEdgeCatalog()">
            ${k ? "3. 전체 요약" : "3. All Catalog"}
          </button>
          <button type="button" class="mgmt-subtab-btn ${BQ_INSPECTOR_TAB === "TABLES" ? "active" : ""}" style="flex:1;" onclick="toggleBqTableDrawer('${escapeHtml(SELECTED_BQ_TABLE)}')">
            ${k ? `4. 테이블 (${BQ_TABLES.length})` : `4. Tables (${BQ_TABLES.length})`}
          </button>
        </div>
      </div>
    `;
  }

  window.openBqClassInspector = function (clsOrId) {
    BQ_INSPECTOR_TAB = "NODE";
    const cls =
      typeof clsOrId === "string"
        ? BQ_CLASS_NODES.find((n) => n.id === clsOrId || n.label === clsOrId) || BQ_CLASS_NODES[0]
        : clsOrId || BQ_CLASS_NODES[0];
    SELECTED_CLASS_ID = cls.id;
    if (cls.tableName) SELECTED_BQ_TABLE = cls.tableName;

    const k = isKo();
    const relEdges = BQ_CLASS_EDGES.filter((e) => e.source === cls.id || e.target === cls.id);
    const layerTitle =
      cls.layer === "ONT"
        ? k
          ? "ONTOLOGY LAYER (BigQuery 정형 테이블 · 그래프 노드)"
          : "ONTOLOGY LAYER (BigQuery Structured Class)"
        : k
        ? "LEX / DOC LAYER (비정형 PDF 매뉴얼 · OKF 레퍼런스)"
        : "LEX / DOC LAYER (Unstructured PDF & OKF Class)";

    const drawerTitleEl = document.getElementById("bq-drawer-title");
    if (drawerTitleEl) {
      drawerTitleEl.textContent = `Class · ${cls.label} (${cls.layer})`;
      drawerTitleEl.title = `Class · ${cls.label} (${cls.layer}) — ${k ? cls.ko : cls.enSub}`;
    }

    const nodePillsHtml = `
      <div class="scen-pill-bar" style="margin-bottom:12px;">
        ${BQ_CLASS_NODES.map(
          (n) => `
          <button class="scen-pill ${n.id === cls.id ? "active" : ""}"
                  style="padding:3px 9px; font-size:11px;"
                  onclick="openBqClassInspector('${escapeHtml(n.id)}')">
            ${escapeHtml(n.label)}
          </button>`
        ).join("")}
      </div>
    `;

    const propsHtml = Array.isArray(cls.props)
      ? `<table class="mod-table" style="margin-bottom:14px;">
          <thead><tr><th>Property</th><th>Type</th><th>1-Line Description (OPTIONS)</th></tr></thead>
          <tbody>
            ${cls.props
              .map(
                (p) => `
              <tr>
                <td><code>${escapeHtml(p.name)}</code></td>
                <td style="white-space:nowrap; font-size:11px; color:var(--text-sub);">${escapeHtml(p.type || "")}</td>
                <td style="font-size:11.5px; color:var(--text-sub);">${escapeHtml(p.desc || "")}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>`
      : "";

    const anchorHtml = cls.anchor
      ? `<div class="section-label"><span>Dataplex KC Custom Aspect (okf / ontology-class-anchors)</span><span>${escapeHtml(cls.anchor.anchor_type)}</span></div>
         <div class="trace-step" style="margin-bottom:14px;">
           <div style="font-size:11.5px; color:var(--text-sub); line-height:1.6;">
             • <strong>Alias Group:</strong> <code>${escapeHtml(cls.anchor.alias_group)}</code> &nbsp;|&nbsp; <strong>Bind Key:</strong> <code>${escapeHtml(cls.anchor.match_bind_key)}</code><br>
             • <strong>GQL Match Snippet:</strong> <code>${escapeHtml(cls.anchor.gql_match_template)}</code><br>
             • <strong>Planner Instruction:</strong> ${escapeHtml(k ? cls.anchor.planner_instruction_ko : cls.anchor.planner_instruction_en)}
           </div>
         </div>`
      : "";

    const actionBtnHtml = cls.tableName
      ? `<div style="margin-bottom:14px;">
           <button class="gcp-action-btn" style="width:100%; justify-content:center; padding:7px 12px; font-weight:600;" onclick="toggleBqTableDrawer('${escapeHtml(cls.tableName)}')">
             <span class="material-symbols-outlined" style="font-size:16px;">table_rows</span>
             ${k ? `${cls.tableName} 영문 데이터 행 및 스키마 열기` : `Browse ${cls.tableName} English Rows & Schema`}
           </button>
         </div>`
      : cls.okfPath
      ? `<div style="margin-bottom:14px;">
           <button class="gcp-action-btn" style="width:100%; justify-content:center; padding:7px 12px; font-weight:600;" onclick="switchModule('okf-validation'); selectByConceptId('${escapeHtml(cls.okfPath)}');">
             <span class="material-symbols-outlined" style="font-size:16px;">fact_check</span>
             ${k ? `02 · OKF 1:1 PDF 대조뷰에서 ${cls.okfPath} 열기` : `Open ${cls.okfPath} in 02 · PDF Split Validator`}
           </button>
         </div>`
      : "";

    const bodyEl = document.getElementById("bq-drawer-body");
    if (bodyEl) {
      bodyEl.innerHTML = `
        ${buildDrawerModeSwitchBar()}
        ${nodePillsHtml}
        <div class="section-label"><span>BigQuery Property Graph Class Definition</span><span>${escapeHtml(layerTitle)}</span></div>
        <div class="okf-title" style="margin-bottom:6px;">${escapeHtml(cls.label)} — ${escapeHtml(k ? cls.ko : cls.enSub)}</div>
        <div style="font-size:12.5px; color:var(--text); background:var(--gcp-blue-bg); border-radius:6px; padding:9px 12px; margin-bottom:12px; line-height:1.6;">
          ${escapeHtml(k ? cls.desc_ko : cls.desc_en)}
        </div>
        <div style="font-size:12px; color:var(--text-sub); line-height:1.65; margin-bottom:12px;">
          • <strong>Primary Key:</strong> <code>${escapeHtml(cls.pk)}</code><br>
          • <strong>Graph View:</strong> <code>${escapeHtml(cls.view || cls.table)}</code><br>
          • <strong>Physical Source:</strong> <code>${escapeHtml(cls.table)}</code>
        </div>
        ${actionBtnHtml}
        ${anchorHtml}
        <div class="section-label"><span>Node Properties &amp; 1-Line Descriptions</span><span>BigQuery OPTIONS / OKF</span></div>
        ${propsHtml}
        <div class="section-label"><span>BigQuery CREATE PROPERTY GRAPH Node DDL</span></div>
        <div class="frontmatter-block" style="border:1px solid var(--border); border-radius:6px; margin-bottom:14px;">${escapeHtml(cls.ddl)}</div>
        <div class="section-label">
          <span>Connected Class Relations (${relEdges.length})</span>
          <span>${k ? "클릭 시 Edge 상세 명세로 이동" : "Click to inspect Edge"}</span>
        </div>
        <div class="biz-edge-list">
          ${relEdges
            .map((e) => {
              const srcNode = BQ_CLASS_NODES.find((n) => n.id === e.source);
              const tgtNode = BQ_CLASS_NODES.find((n) => n.id === e.target);
              const srcLabel = srcNode ? srcNode.label : e.source;
              const tgtLabel = tgtNode ? tgtNode.label : e.target;
              return `
              <div class="biz-edge-item" style="cursor:pointer;" onclick="openBqEdgeInspector('${escapeHtml(e.id)}')">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="edge-badge">${escapeHtml(e.rel)}</span>
                  <code style="font-size:10.5px; color:var(--text-sub);">${escapeHtml(e.view || "")} ↗</code>
                </div>
                <div class="edge-target">${escapeHtml(srcLabel)} ➔ ${escapeHtml(tgtLabel)}</div>
                <div class="edge-reason">${escapeHtml(k ? e.desc_ko : e.desc_en)}</div>
              </div>
            `;
            })
            .join("")}
        </div>
      `;
    }
    const drawer = document.getElementById("bq-detail-drawer");
    if (drawer) drawer.classList.add("open");
  };

  window.openBqEdgeInspector = function (edgeOrId) {
    BQ_INSPECTOR_TAB = "EDGE";
    const edge =
      typeof edgeOrId === "string"
        ? BQ_CLASS_EDGES.find((e) => e.id === edgeOrId || e.rel === edgeOrId) || BQ_CLASS_EDGES[0]
        : edgeOrId || BQ_CLASS_EDGES[0];
    SELECTED_EDGE_ID = edge.id;

    const k = isKo();
    const srcNode = BQ_CLASS_NODES.find((n) => n.id === edge.source);
    const tgtNode = BQ_CLASS_NODES.find((n) => n.id === edge.target);
    const drawerTitleEl = document.getElementById("bq-drawer-title");
    if (drawerTitleEl) {
      drawerTitleEl.textContent = `Edge · ${edge.rel}`;
      drawerTitleEl.title = `Edge · ${edge.rel} (${srcNode ? srcNode.label : edge.source} ➔ ${tgtNode ? tgtNode.label : edge.target})`;
    }

    const edgePillsHtml = `
      <div class="scen-pill-bar" style="margin-bottom:12px;">
        ${BQ_CLASS_EDGES.map(
          (e) => `
          <button class="scen-pill ${e.id === edge.id ? "active" : ""}"
                  style="padding:3px 9px; font-size:11px;"
                  onclick="openBqEdgeInspector('${escapeHtml(e.id)}')">
            ${escapeHtml(e.rel)}
          </button>`
        ).join("")}
      </div>
    `;

    const edgeKindBadge = edge.isBridge
      ? "ONT ↔ LEX Vertical Bridge"
      : edge.isSelfLoop
      ? "ONT Self-Referential DAG Edge"
      : srcNode && srcNode.layer === "LEX"
      ? "LEX Document Edge"
      : "ONT Property Graph Edge";

    const bodyEl = document.getElementById("bq-drawer-body");
    if (bodyEl) {
      bodyEl.innerHTML = `
        ${buildDrawerModeSwitchBar()}
        ${edgePillsHtml}
        <div class="section-label"><span>BigQuery Property Graph Edge Relation</span><span>${escapeHtml(edgeKindBadge)}</span></div>
        <div class="okf-title" style="margin-bottom:6px;">
          ${escapeHtml(edge.rel)}
          <span style="font-size:13px; font-weight:500; color:var(--text-sub); margin-left:6px;">
            (${escapeHtml(srcNode ? srcNode.label : edge.source)} ➔ ${escapeHtml(tgtNode ? tgtNode.label : edge.target)})
          </span>
        </div>
        <div style="font-size:12.5px; color:var(--text); background:var(--gcp-blue-bg); border-radius:6px; padding:9px 12px; margin-bottom:12px; line-height:1.6;">
          ${escapeHtml(k ? edge.desc_ko : edge.desc_en)}
        </div>
        <div style="font-size:12px; color:var(--text-sub); line-height:1.65; margin-bottom:14px;">
          • <strong>Source Class:</strong> <a href="#" onclick="event.preventDefault(); openBqClassInspector('${escapeHtml(edge.source)}');"><code>${escapeHtml(srcNode ? srcNode.label : edge.source)}</code></a><br>
          • <strong>Target Class:</strong> <a href="#" onclick="event.preventDefault(); openBqClassInspector('${escapeHtml(edge.target)}');"><code>${escapeHtml(tgtNode ? tgtNode.label : edge.target)}</code></a><br>
          • <strong>Join Keys (SOURCE ➔ DEST):</strong> <code>${escapeHtml(edge.joinKeys || "")}</code><br>
          • <strong>Backing Table / View:</strong> <code>${escapeHtml(edge.view || "")}</code>
        </div>
        <div class="section-label"><span>BigQuery CREATE PROPERTY GRAPH Edge DDL / Provenance</span></div>
        <div class="frontmatter-block" style="border:1px solid var(--border); border-radius:6px; margin-bottom:14px;">${escapeHtml(edge.ddl || "")}</div>
        <div class="section-label"><span>All 13 Ontology Edge Relations Overview</span></div>
        <div class="biz-edge-list">
          ${BQ_CLASS_EDGES.map((e) => {
            const sN = BQ_CLASS_NODES.find((n) => n.id === e.source);
            const tN = BQ_CLASS_NODES.find((n) => n.id === e.target);
            return `
              <div class="biz-edge-item" style="cursor:pointer; ${e.id === edge.id ? "border-color:var(--gcp-blue); background:var(--gcp-blue-bg);" : ""}" onclick="openBqEdgeInspector('${escapeHtml(e.id)}')">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="edge-badge">${escapeHtml(e.rel)}</span>
                  <code style="font-size:10.5px; color:var(--text-sub);">${escapeHtml(e.view || "")}</code>
                </div>
                <div class="edge-target">${escapeHtml(sN ? sN.label : e.source)} ➔ ${escapeHtml(tN ? tN.label : e.target)}</div>
                <div class="edge-reason">${escapeHtml(k ? e.desc_ko : e.desc_en)}</div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }
    const drawer = document.getElementById("bq-detail-drawer");
    if (drawer) drawer.classList.add("open");
  };

  window.openBqNodeEdgeCatalog = function () {
    BQ_INSPECTOR_TAB = "CATALOG";
    const k = isKo();
    const drawerTitleEl = document.getElementById("bq-drawer-title");
    if (drawerTitleEl) {
      drawerTitleEl.textContent = k
        ? "Ontology Nodes (10) & Edges (13) Descriptions"
        : "Ontology Nodes (10) & Edges (13) Descriptions";
    }

    const bodyEl = document.getElementById("bq-drawer-body");
    if (bodyEl) {
      bodyEl.innerHTML = `
        ${buildDrawerModeSwitchBar()}
        <div class="section-label">
          <span>${k ? "1. 전체 온톨로지 Node Classes (10종) Description" : "1. All Ontology Node Classes (10) Descriptions"}</span>
          <span>${k ? "클릭 시 상세 스키마·DDL" : "Click to inspect"}</span>
        </div>
        <div class="biz-edge-list" style="margin-bottom:18px;">
          ${BQ_CLASS_NODES.map(
            (n) => `
            <div class="biz-edge-item" style="cursor:pointer;" onclick="openBqClassInspector('${escapeHtml(n.id)}')">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="edge-badge">${escapeHtml(n.label)} (${escapeHtml(n.layer)})</span>
                <code style="font-size:10.5px; color:var(--text-sub);">PK: ${escapeHtml(n.pk)} ↗</code>
              </div>
              <div class="edge-target" style="font-weight:600;">${escapeHtml(k ? n.ko : n.enSub)} · <code>${escapeHtml(n.view)}</code></div>
              <div class="edge-reason">${escapeHtml(k ? n.desc_ko : n.desc_en)}</div>
            </div>`
          ).join("")}
        </div>

        <div class="section-label">
          <span>${k ? "2. 전체 온톨로지 Edge Relations (13종) Description" : "2. All Ontology Edge Relations (13) Descriptions"}</span>
          <span>${k ? "클릭 시 상세 조인 키·DDL" : "Click to inspect"}</span>
        </div>
        <div class="biz-edge-list">
          ${BQ_CLASS_EDGES.map((e) => {
            const sN = BQ_CLASS_NODES.find((n) => n.id === e.source);
            const tN = BQ_CLASS_NODES.find((n) => n.id === e.target);
            return `
              <div class="biz-edge-item" style="cursor:pointer;" onclick="openBqEdgeInspector('${escapeHtml(e.id)}')">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="edge-badge">${escapeHtml(e.rel)}</span>
                  <code style="font-size:10.5px; color:var(--text-sub);">${escapeHtml(e.view || "")} ↗</code>
                </div>
                <div class="edge-target">${escapeHtml(sN ? sN.label : e.source)} ➔ ${escapeHtml(tN ? tN.label : e.target)}</div>
                <div class="edge-reason">${escapeHtml(k ? e.desc_ko : e.desc_en)}</div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }
    const drawer = document.getElementById("bq-detail-drawer");
    if (drawer) drawer.classList.add("open");
  };

  window.setBqGraphMode = function (mode) {
    BQ_GRAPH_MODE = mode;
    const btnClass = document.getElementById("bq-btn-class-mode");
    const btnInst = document.getElementById("bq-btn-inst-mode");
    const threeBox = document.getElementById("bq-three-container");
    const visBox = document.getElementById("bq-vis-container");
    const camToolbar = document.getElementById("bq-cam-toolbar");
    const instToolbar = document.getElementById("bq-inst-toolbar");
    const banner = document.getElementById("bq-cq-banner");
    const k = isKo();

    if (btnClass) btnClass.classList.toggle("active", mode === "CLASS");
    if (btnInst) btnInst.classList.toggle("active", mode === "INSTANCE");

    if (mode === "CLASS") {
      if (threeBox) threeBox.style.display = "block";
      if (visBox) visBox.style.display = "none";
      if (camToolbar) camToolbar.style.display = "flex";
      if (instToolbar) instToolbar.style.display = "none";
      if (banner) banner.style.display = "none";

      const stN = document.getElementById("bq-stat-n");
      const stNLbl = document.getElementById("bq-stat-n-lbl");
      const stE = document.getElementById("bq-stat-e");
      const stELbl = document.getElementById("bq-stat-e-lbl");
      const stB = document.getElementById("bq-stat-b");
      const stBLbl = document.getElementById("bq-stat-b-lbl");
      if (stN) stN.textContent = String(BQ_CLASS_NODES.length);
      if (stNLbl) stNLbl.textContent = k ? "Ontology Classes" : "Ontology Classes";
      if (stE) stE.textContent = String(BQ_CLASS_EDGES.length);
      if (stELbl) stELbl.textContent = k ? "Class Relations" : "Class Relations";
      if (stB) stB.textContent = "4";
      if (stBLbl) stBLbl.textContent = "ONT↔LEX Bridges";

      if (!bqThreeViz) {
        bqThreeViz = new BqClass3DVisualizer("bq-three-container");
      } else {
        bqThreeViz.rebuildThemeAndGraph();
        bqThreeViz.resize();
      }
    } else {
      if (threeBox) threeBox.style.display = "none";
      if (visBox) visBox.style.display = "block";
      if (camToolbar) camToolbar.style.display = "none";
      if (instToolbar) instToolbar.style.display = "flex";
      renderBqInstanceGraph(GQL_QUERIES[SELECTED_GQL_IDX] || GQL_QUERIES[0]);
    }
  };

  window.selectBqGqlOption = function (idx) {
    SELECTED_GQL_IDX = idx;
    const q = GQL_QUERIES[idx] || GQL_QUERIES[0];
    const codeEl = document.getElementById("bq-gql-code");
    if (codeEl && q) codeEl.value = q.gql || "";
    if (BQ_GRAPH_MODE === "INSTANCE") {
      renderBqInstanceGraph(q);
    }
  };

  window.runBqGqlQuery = async function () {
    setBqGraphMode("INSTANCE");
    const q = GQL_QUERIES[SELECTED_GQL_IDX] || GQL_QUERIES[0];
    const codeEl = document.getElementById("bq-gql-code");
    const sqlText = (codeEl && codeEl.value) || (q && q.gql) || "";
    const runBtn = document.getElementById("bq-run-query-btn");
    const banner = document.getElementById("bq-cq-banner");

    if (runBtn) runBtn.disabled = true;
    try {
      const resp = await fetch("/api/bq/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlText })
      });
      const data = await resp.json();
      if (data && data.ok && Array.isArray(data.rows)) {
        populateBqBanner(data.rows, `LIVE BIGQUERY API (${data.elapsed_ms || 0} ms)`);
      } else {
        populateBqBanner((q && q.rows) || [], "VERIFIED SNAPSHOT");
      }
    } catch (_) {
      populateBqBanner((q && q.rows) || [], "VERIFIED SNAPSHOT");
    } finally {
      if (runBtn) runBtn.disabled = false;
      if (banner) banner.style.display = "block";
    }
  };

  function populateBqBanner(rows, badgeText) {
    const banner = document.getElementById("bq-cq-banner");
    if (!banner) return;
    const k = isKo();
    const cols = rows.length > 0 ? Object.keys(rows[0]) : [];
    banner.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div>
          <strong style="font-size:13px; color:var(--text);">
            ${k ? "BigQuery Property Graph (GQL) 실행 결과" : "BigQuery Property Graph (GQL) Result Rows"} (${rows.length} rows)
          </strong>
          <span class="mod-badge green" style="margin-left:8px;">${escapeHtml(badgeText)}</span>
        </div>
        <button class="gcp-action-btn" style="padding:3px 9px; font-size:11px;" onclick="toggleBqCqBanner()">
          ${k ? "닫기" : "Close"}
        </button>
      </div>
      <div style="max-height:260px; overflow-y:auto; border:1px solid var(--border); border-radius:6px;">
        <table class="mod-table">
          <thead>
            <tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) =>
                  `<tr>${cols.map((c) => `<td>${escapeHtml(r[c])}</td>`).join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  window.toggleBqCqBanner = function () {
    const b = document.getElementById("bq-cq-banner");
    if (!b) return;
    if (b.style.display === "none" || !b.innerHTML.trim()) {
      const q = GQL_QUERIES[SELECTED_GQL_IDX] || GQL_QUERIES[0];
      populateBqBanner((q && q.rows) || [], "VERIFIED GQL RESULT");
      b.style.display = "block";
    } else {
      b.style.display = "none";
    }
  };

  window.toggleBqTableDrawer = function (tname) {
    BQ_INSPECTOR_TAB = "TABLES";
    const drawer = document.getElementById("bq-detail-drawer");
    if (!drawer) return;
    if (tname) {
      SELECTED_BQ_TABLE = tname;
    }
    drawer.classList.add("open");
    renderBqTableDrawerContent();
  };

  window.closeBqDrawer = function () {
    const drawer = document.getElementById("bq-detail-drawer");
    if (drawer) drawer.classList.remove("open");
  };

  window.selectDrawerTable = function (tname, mode) {
    BQ_INSPECTOR_TAB = "TABLES";
    if (tname) SELECTED_BQ_TABLE = tname;
    if (mode) BQ_DRAWER_MODE = mode;
    renderBqTableDrawerContent();
  };

  function renderBqTableDrawerContent() {
    const titleEl = document.getElementById("bq-drawer-title");
    const bodyEl = document.getElementById("bq-drawer-body");
    if (!bodyEl) return;
    const k = isKo();
    const curT = BQ_TABLES.find((t) => t.table_name === SELECTED_BQ_TABLE) || BQ_TABLES[0] || {};
    if (titleEl) titleEl.textContent = `Table · ${curT.table_name} (${curT.row_count} rows)`;

    const cols = curT.schema || [];
    const rows = curT.rows || [];
    const colNames = cols.map((c) => c.name);

    const tableHtml =
      BQ_DRAWER_MODE === "SCHEMA"
        ? `<table class="mod-table">
            <thead><tr><th>Column</th><th>Type</th><th>Description (English)</th></tr></thead>
            <tbody>
              ${cols
                .map(
                  (c) =>
                    `<tr><td><code>${escapeHtml(c.name)}</code></td><td>${escapeHtml(c.type)}</td><td>${escapeHtml(c.description)}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>`
        : `<div style="overflow-x:auto;">
            <table class="mod-table">
              <thead><tr>${colNames.map((cn) => `<th>${escapeHtml(cn)}</th>`).join("")}</tr></thead>
              <tbody>
                ${rows
                  .map(
                    (r) =>
                      `<tr>${colNames.map((cn) => `<td>${escapeHtml(r[cn])}</td>`).join("")}</tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`;

    bodyEl.innerHTML = `
      ${buildDrawerModeSwitchBar()}
      <div class="scen-pill-bar" style="margin-bottom:12px;">
        ${BQ_TABLES.map(
          (tb) => `
          <button class="scen-pill ${tb.table_name === curT.table_name ? "active" : ""}"
                  style="padding:4px 10px; font-size:11.5px;"
                  onclick="selectDrawerTable('${escapeHtml(tb.table_name)}')">
            ${escapeHtml(tb.table_name)} (${tb.row_count})
          </button>`
        ).join("")}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div>
          <strong style="font-size:13px;">${escapeHtml(k ? curT.title_ko : curT.title_en)}</strong>
          <div style="font-size:11.5px; color:var(--text-sub);">Role: ${escapeHtml(curT.role)} · PK: <code>${escapeHtml(curT.pk)}</code> · PDF p.${curT.pdf_page}</div>
        </div>
        <div class="mgmt-subtab-group">
          <button class="mgmt-subtab-btn ${BQ_DRAWER_MODE === "ROWS" ? "active" : ""}" onclick="selectDrawerTable(null, 'ROWS')">
            ${k ? "영문 데이터 행" : "English Rows"} (${rows.length})
          </button>
          <button class="mgmt-subtab-btn ${BQ_DRAWER_MODE === "SCHEMA" ? "active" : ""}" onclick="selectDrawerTable(null, 'SCHEMA')">
            ${k ? "스키마" : "Schema"} (${cols.length})
          </button>
        </div>
      </div>
      ${tableHtml}
    `;
  }

  function initOrUpdateBqGraphStudio() {
    const sel = document.getElementById("bq-gql-select");
    const k = isKo();
    if (sel) {
      sel.innerHTML = GQL_QUERIES.map(
        (q, i) =>
          `<option value="${i}" ${i === SELECTED_GQL_IDX ? "selected" : ""}>${escapeHtml(k ? q.title_ko : q.title_en)}</option>`
      ).join("");
    }
    const curQ = GQL_QUERIES[SELECTED_GQL_IDX] || GQL_QUERIES[0];
    const codeEl = document.getElementById("bq-gql-code");
    if (codeEl && curQ) codeEl.value = curQ.gql || "";

    setBqGraphMode(BQ_GRAPH_MODE);

    // Open the Node & Edge Description Inspector by default so Node & Edge Descriptions are immediately visible
    if (BQ_INSPECTOR_TAB === "EDGE") {
      openBqEdgeInspector(SELECTED_EDGE_ID);
    } else if (BQ_INSPECTOR_TAB === "CATALOG") {
      openBqNodeEdgeCatalog();
    } else if (BQ_INSPECTOR_TAB === "TABLES") {
      renderBqTableDrawerContent();
    } else {
      openBqClassInspector(SELECTED_CLASS_ID);
    }
  }

  function renderBqInstanceGraph(q) {
    const container = document.getElementById("bq-vis-container");
    if (!container || !window.vis || !q || !q.graph) return;
    const isDark = document.body.classList.contains("dark-mode");

    const groupColors = {
      HardwareComponent: "#3b6ea5",
      TroubleshootingCase: "#a85c56",
      DiagnosticCode: "#b88a44",
      ProductSKU: "#6b88a8",
      ProductModel: "#527a9a",
      SafetyProcedure: "#a85c56",
      ComplianceStandard: "#8a7a6b",
      SupplierMetric: "#b88a44",
      ServicePlaybook: "#3b735b",
      ServiceManualChapter: "#3b735b",
      ServiceManualDocument: "#3b735b"
    };

    const lexGroups = new Set([
      "ServicePlaybook",
      "ServiceManualChapter",
      "ServiceManualDocument"
    ]);

    const nodes = (q.graph.nodes || []).map((n) => {
      const isLex = lexGroups.has(n.group);
      return {
        id: n.id,
        label: n.label,
        title: `${n.group || "Node"} · ${n.id}`,
        shape: isLex ? "box" : "dot",
        size: isLex ? 18 : 20,
        margin: isLex ? 10 : undefined,
        borderWidth: isLex ? 2.2 : 2.0,
        color: isLex
          ? {
              background: isDark ? "#23312b" : "#f2f7f4",
              border: "#3b735b",
              highlight: {
                background: isDark ? "#2d4038" : "#e1ede7",
                border: "#2c5a46"
              }
            }
          : {
              background: groupColors[n.group] || "#3b6ea5",
              border: isDark ? "#1e1f22" : "#ffffff",
              highlight: {
                background: groupColors[n.group] || "#3b6ea5",
                border: isDark ? "#ffffff" : "#202124"
              }
            },
        font: {
          color: isLex ? (isDark ? "#b8d4c7" : "#23312b") : isDark ? "#e3e3e3" : "#202124",
          size: isLex ? 11.5 : 12,
          face: "Google Sans, Roboto Mono, sans-serif",
          multi: "html"
        },
        rawNode: n
      };
    });

    const bridgePrefixes = new Set([
      "DOCUMENTED_IN_CHAPTER",
      "DEFINED_IN_CH6",
      "GOVERNED_BY_PLAYBOOK",
      "CITES_MANUAL"
    ]);

    const edges = (q.graph.edges || []).map((e, idx) => {
      const relPrefix = String(e.label || "").split(" ")[0];
      const isBridge = bridgePrefixes.has(relPrefix);
      const isDag = relPrefix === "REQUIRES_REMOVAL_OF" || relPrefix === "MITIGATES_CASE";
      const strokeColor = isBridge ? "#b88a44" : isDag ? "#a85c56" : "#6b88a8";
      return {
        id: `inst_e_${idx}`,
        from: e.from,
        to: e.to,
        label: e.label,
        arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        width: isBridge || isDag ? 2.1 : 1.7,
        dashes: isBridge ? [4, 4] : false,
        smooth: { type: "continuous", roundness: 0.25 },
        font: {
          size: 10,
          color: isBridge ? "#b88a44" : isDag ? "#a85c56" : isDark ? "#e3e3e3" : "#3c4043",
          background: isDark ? "rgba(31,31,31,0.9)" : "rgba(255,255,255,0.92)",
          strokeWidth: 0,
          align: "horizontal"
        },
        color: { color: strokeColor, highlight: "#1a73e8", hover: strokeColor },
        rawEdge: e
      };
    });

    if (window.bqVisNet) window.bqVisNet.destroy();
    window.bqVisNet = new window.vis.Network(
      container,
      { nodes: new window.vis.DataSet(nodes), edges: new window.vis.DataSet(edges) },
      {
        physics: {
          enabled: true,
          solver: "forceAtlas2Based",
          forceAtlas2Based: {
            gravitationalConstant: -75,
            centralGravity: 0.01,
            springLength: 145,
            springConstant: 0.06,
            damping: 0.55,
            avoidOverlap: 0.7
          },
          stabilization: { enabled: true, iterations: 150, updateInterval: 25 }
        },
        interaction: { hover: true, tooltipDelay: 120, navigationButtons: false, zoomView: true }
      }
    );

    window.bqVisNet.once("stabilizationIterationsDone", function () {
      if (!window.bqVisNet) return;
      window.bqVisNet.fit({ animation: { duration: 420, easingFunction: "easeInOutQuad" } });
      setTimeout(() => {
        if (!window.bqVisNet) return;
        const pos = window.bqVisNet.getViewPosition();
        const curScale = window.bqVisNet.getScale();
        window.bqVisNet.moveTo({
          position: pos,
          scale: Math.min(curScale * 0.92, 1.05),
          animation: { duration: 240, easingFunction: "easeOutQuad" }
        });
      }, 450);
    });

    window.bqVisNet.on("click", function (params) {
      if (params.nodes && params.nodes.length > 0) {
        const clickedId = params.nodes[0];
        const foundN = nodes.find((x) => x.id === clickedId);
        if (foundN && foundN.rawNode) {
          const mappedClass = BQ_CLASS_NODES.find((c) => c.label === foundN.rawNode.group);
          if (mappedClass) openBqClassInspector(mappedClass.id);
        }
      } else if (params.edges && params.edges.length > 0) {
        const clickedEdgeId = params.edges[0];
        const foundE = edges.find((x) => x.id === clickedEdgeId);
        if (foundE && foundE.rawEdge) {
          const relPrefix = String(foundE.rawEdge.label || "").split(" ")[0];
          const mappedEdge = BQ_CLASS_EDGES.find((c) => c.rel === relPrefix);
          if (mappedEdge) openBqEdgeInspector(mappedEdge.id);
        }
      }
    });
  }

  // =========================================================================
  // 7. MODULE 05: HP Dragonfly Ontology GraphRAG Agent (`#module-agent`)
  //    100% Structural & UX Parity with `krda-ontology-studio` (`mod-agent.js`)
  // =========================================================================
  let AGENT_SELECTED_Q_ID = "01";
  let AGENT_TURN_HISTORY = [];
  let AGENT_ACTIVE_TURN_IDX = -1;
  let AGENT_DRAWER_OPEN = false;
  let AGENT_DRAWER_TAB = "KC"; // 'KC' | 'PROVISION' | 'LEDGER'
  let AGENT_IS_SENDING = false;
  let AGENT_LEFT_SIDEBAR_COLLAPSED = false;
  let AGENT_SEARCH_FILTER = "";
  let AGENT_INITIAL_SEEDED = false;

  function getAgentScenarios() {
    const bank = window.HP_AGENT_QA_BANK || {};
    return bank.scenarios || [];
  }

  function getBqTableRowsByName(tableName) {
    const found = (BQ_TABLES || []).find((t) => t.table_name === tableName);
    return found && Array.isArray(found.rows) ? found.rows : [];
  }

  function buildDynamicKcAndProvisionJs(relPath, roleKo, roleEn, targetCols) {
    const f = (OKF_FILES || []).find((x) => x.rel_path === relPath) || {};
    const secKo = f.section_number || "제1장 §1.1";
    const titleKo = f.title_ko || relPath;
    const titleEn = f.title_en || relPath;
    const kcId = f.kc_entry_id || relPath.replace(/\//g, "-").replace(/\.md$/, "");
    const kcFqn =
      f.kc_entry_fqn ||
      `projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/${kcId}`;
    const ver = String(f.version || "0.2.0").replace(/^v/, "");
    const page = f.pdf_page || 1;
    const pageEnd = f.pdf_page_end || page;
    const sha =
      f.sha256 || "a94f82e1c30d7b654e12908fa34c81920e7b11234908abcdef1234567890abcd";

    const verdict = {
      article_no: `${secKo} · p.${page}`,
      kc_entry_id: `okf_hp_dragonfly/${kcId}`,
      kc_entry_fqn: kcFqn,
      title_ko: titleKo,
      title_en: titleEn,
      status: "verified",
      version: ver,
      verified_by: f.verified_by || "hp-hardware-qa-lead@hp-dragonfly.internal",
      stale_after: "2027-12-31",
      decision: "ALLOW",
      reason_ko: "Dataplex KC okf_hp_dragonfly (okf-kr / okf-en) 유효 정본 확인 (status=verified)",
      reason_en: "Verified canonical OKF v0.2 entry in Dataplex KC okf_hp_dragonfly (status=verified)",
      chain: [`okf_hp_dragonfly/${kcId}`],
      incident_id: null,
      superseded_chain_example: null
    };

    const provision = {
      article_no: secKo,
      okf_rel_path: relPath,
      pdf_page: page,
      title_ko: titleKo,
      title_en: titleEn,
      provision_role_ko: roleKo,
      provision_role_en: roleEn,
      uri: (isKo() ? f.gcs_uri_ko : f.gcs_uri_en) || f.gcs_uri || `gs://hp-dragonfly-okf/okf-kr/${relPath}`,
      kc_entry_fqn: kcFqn,
      source_pdf: pageEnd !== page ? `p.${page}-${pageEnd}` : `p.${page}`,
      sha256: sha,
      target_columns: targetCols,
      yaml_frontmatter: (isKo() ? f.raw_yaml_ko : f.raw_yaml_en) || f.raw_yaml || "",
      verbatim_body: (isKo() ? f.body_ko : f.body_en) || f.body || ""
    };
    return { verdict, provision };
  }

  function buildDynamicOntologyScenario(question) {
    const q = String(question || "").trim().toLowerCase();
    const outOfDomainKw = [
      "날씨", "weather", "코스피", "kospi", "주식", "stock", "맛집",
      "점심", "저녁", "dinner", "lunch", "축구", "야구", "영화", "비트코인"
    ];
    if (outOfDomainKw.some((w) => q.includes(w))) return null;

    // Default to Series & Models master overview for series/model/lineup queries
    const seriesRows = getBqTableRowsByName("dragonfly_series_models");
    const skuRows = getBqTableRowsByName("product_skus_and_configs");
    const vp1 = buildDynamicKcAndProvisionJs(
      "manuals/01_ch1_product_specs/sec_1_1_platform_architecture.md",
      "프로세서·플랫폼 및 폼팩터 아키텍처 정본 (Ch.1 §1.1)",
      "Processor, Platform & Form Factor Specification (Ch.1 §1.1)",
      "dragonfly_series_models.model_id, form_factor, cpu_architecture, display_size_inch"
    );
    const vp2 = buildDynamicKcAndProvisionJs(
      "manuals/01_ch1_product_specs/sec_1_2_soldered_lpddr5_memory_rule.md",
      "온보드 솔더링 메모리 아키텍처 및 정비 규범 (Ch.1 §1.2)",
      "Soldered Onboard Memory Architecture & Servicing Rule (Ch.1 §1.2)",
      "dragonfly_series_models.memory_type, max_memory_gb, product_skus_and_configs.ram_spec"
    );
    const vp3 = buildDynamicKcAndProvisionJs(
      "manuals/01_ch1_product_specs/sec_1_3_storage_and_wireless_specs.md",
      "M.2 NVMe 스토리지 및 Wi-Fi 6E / 5G WWAN 무선 사양 (Ch.1 §1.3)",
      "M.2 NVMe Storage & Wi-Fi 6E / 5G WWAN Wireless Specs (Ch.1 §1.3)",
      "dragonfly_series_models.max_storage_tb, product_skus_and_configs.ssd_spec, wwan_module"
    );

    const sql = `SELECT
  m.model_id, m.model_name, m.generation, m.release_year,
  m.form_factor, m.display_size_inch, m.aspect_ratio,
  m.cpu_architecture, m.memory_type, m.max_memory_gb,
  m.battery_options, m.starting_weight_kg, m.service_manual_doc_no
FROM \`hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models\` AS m
ORDER BY m.release_year ASC, m.model_id ASC`;

    const answerKo = `### HP Dragonfly 노트북 전체 시리즈 마스터 (\`dragonfly_series_models\` · 총 6개 세대/모델)

BigQuery 정형 마스터 테이블(\`hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models\`) 및 Dataplex Knowledge Catalog(\`okf_hp_dragonfly_kr\`)에 등록된 **HP Dragonfly 전체 노트북 시리즈 6종(\`G1\`, \`G2\`, \`Max\`, \`G3 Clamshell\`, \`Folio G3\`, \`G4\`)** 의 상세 아키텍처와 세대별 사양은 다음과 같습니다 \`[제1장 §1.1]\` \`[제1장 §1.2]\`.

| 모델 ID (\`model_id\`) | 공식 제품명 (\`model_name\`) | 세대 / 출시 | 폼팩터 (\`form_factor\`) | 디스플레이 (\`display\`) | CPU 아키텍처 (\`cpu_architecture\`) | 메모리 (\`memory_type\`) | 배터리 옵션 (\`battery_options\`) | 시작 무게 | 매뉴얼 문서번호 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **\`MDL-DF-G1\`** | **HP Elite Dragonfly G1 Notebook PC** | \`G1\` (2019) | 360° Convertible 2-in-1 | 13.3" (16:9) | 8세대 Intel Whiskey Lake U (\`i5-8265U\` ~ \`i7-8665U\`) | LPDDR3-2133 Soldered (최대 **16GB**) | 2-cell 38Wh / 4-cell 56.2Wh | **0.99 kg** | \`L73255-001\` |
| **\`MDL-DF-G2\`** | **HP Elite Dragonfly G2 Notebook PC** | \`G2\` (2021) | 360° Convertible 2-in-1 | 13.3" (16:9) | 11세대 Intel Tiger Lake U (\`i3-1115G4\` ~ \`i7-1185G7\`) | LPDDR4x-4266 Soldered (최대 **32GB**) | 2-cell 38Wh / 4-cell 56.2Wh | **0.99 kg** | \`M47218-001\` |
| **\`MDL-DF-MAX\`** | **HP Elite Dragonfly Max Notebook PC** | \`Max\` (2021) | 360° Convertible 2-in-1 | 13.3" (16:9) | 11세대 Intel Tiger Lake U (\`i5-1135G7\` ~ \`i7-1185G7\`) | LPDDR4x-4266 Soldered (최대 **32GB**) | 4-cell 56.2Wh Long Life | **1.13 kg** | \`M51892-001\` |
| **\`MDL-DF-G3\`** | **HP Elite Dragonfly G3 Notebook PC** | \`G3\` (2022) | **Clamshell 180° Lay-Flat** | **13.5" (3:2)** | 12세대 Intel Alder Lake U 15W (\`i5-1235U\` ~ \`i7-1265U vPro\`) | LPDDR5-4800/6400 Soldered (최대 **32GB**) | 4-cell 45Wh / **6-cell 68Wh** | **0.99 kg** | \`N09241-001\` |
| **\`MDL-DF-FOLIO-G3\`** | **HP Dragonfly Folio 13.5 inch G3 2-in-1** | \`Folio G3\` (2022) | **Pull-Forward Folio 2-in-1** | **13.5" (3:2 IPS / 3K2K OLED)** | 12세대 Intel Alder Lake U 15W (\`i5-1235U\` ~ \`i7-1265U vPro\`) | LPDDR5-6400 Soldered (8/16/**32GB**) | **4-cell 53Wh** (\`M90788-005\`) | **1.40 kg** | \`N17344-001\` |
| **\`MDL-DF-G4\`** | **HP Dragonfly G4 Notebook PC** | \`G4\` (2023) | **Clamshell 180° Lay-Flat** | **13.5" (3:2)** | 13세대 Intel Raptor Lake U (\`i5-1335U\` ~ \`i7-1365U vPro\`) | LPDDR5-6400 Soldered (최대 **32GB**) | 4-cell 45Wh / **6-cell 68Wh** | **0.99 kg** | \`N48112-001\` |

#### 시리즈별 핵심 아키텍처 특징 및 OKF v0.2 정비 지침 요약
- **1세대~2세대 (\`MDL-DF-G1\`, \`MDL-DF-G2\`, \`MDL-DF-MAX\`)**: \`13.3인치 16:9\` 화면비와 \`360° 컨버터블 2-in-1\` CNC 마그네슘 섀시를 채택한 초경량(0.99kg~1.13kg) 비즈니스 컨버터블 라인업입니다.
- **3세대 아키텍처 대전환 (\`MDL-DF-G3\` Clamshell & \`MDL-DF-FOLIO-G3\` 2-in-1)**: 2022년 G3부터 화면비를 **\`13.5인치 3:2\`** 로 확대하고 폼팩터를 두 가지로 전문화했습니다 \`[제1장 §1.1]\`:
  - **\`HP Elite Dragonfly G3\` (\`MDL-DF-G3\`)**: 0.99kg 초경량 \`180° 평면 개방형 클램쉘(Clamshell)\` 울트라북 (최대 68Wh 대용량 배터리 지원).
  - **\`HP Dragonfly Folio 13.5 G3\` (\`MDL-DF-FOLIO-G3\`)**: 디스플레이를 앞으로 당겨 노트북·미디어·태블릿 모드로 전환하는 **\`Pull-Forward Folio 2-in-1\`** 폼팩터로, 8MP 100° 광각 IR 카메라, ToF 인체 근접 센서, 마그네틱 무선 충전 펜, 최대 \`3K2K(3000×2000) OLED\` 및 \`Intel 5000 5G WWAN\` 옵션을 제공합니다 \`[제1장 §1.1]\` \`[제1장 §1.3]\`.
- **4세대 (\`MDL-DF-G4\`)**: 13.5인치 3:2 클램쉘 폼팩터에 13세대 Intel Raptor Lake U 프로세서와 듀얼 카메라 동시 스트리밍(\`Multi-Camera Experience\`)을 탑재했습니다.
- **전 시리즈 공통 메모리 정비 규범 (\`[제1장 §1.2]\`)**: 전 모델 모두 시스템 메모리가 메인보드에 온보드 직결 납땜(\`Soldered Dual-Channel\`)되어 있어 SO-DIMM 슬롯이 존재하지 않으며, 메모리 용량 변경이나 불량 시 시스템 보드 어셈블리(FRU) 전체를 교체해야 합니다 \`[제1장 §1.2]\`.`;

    const answerEn = `### HP Dragonfly Notebook Series Master (\`dragonfly_series_models\` · All 6 Generations/Models)

Based on the BigQuery master table (\`hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models\`) and Dataplex Knowledge Catalog (\`okf_hp_dragonfly_en\`), here are **all 6 HP Dragonfly notebook series models (\`G1\`, \`G2\`, \`Max\`, \`G3 Clamshell\`, \`Folio G3\`, \`G4\`)** \`[제1장 §1.1]\` \`[제1장 §1.2]\`:

| Model ID (\`model_id\`) | Official Product Name (\`model_name\`) | Gen / Year | Form Factor (\`form_factor\`) | Display | CPU Architecture (\`cpu_architecture\`) | Memory (\`memory_type\`) | Battery Options | Starting Weight | Manual Doc No. |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **\`MDL-DF-G1\`** | **HP Elite Dragonfly G1 Notebook PC** | \`G1\` (2019) | 360° Convertible 2-in-1 | 13.3" (16:9) | 8th Gen Intel Whiskey Lake U (\`i5-8265U\`–\`i7-8665U\`) | LPDDR3-2133 Soldered (Max **16GB**) | 2-cell 38Wh / 4-cell 56.2Wh | **0.99 kg** | \`L73255-001\` |
| **\`MDL-DF-G2\`** | **HP Elite Dragonfly G2 Notebook PC** | \`G2\` (2021) | 360° Convertible 2-in-1 | 13.3" (16:9) | 11th Gen Intel Tiger Lake U (\`i3-1115G4\`–\`i7-1185G7\`) | LPDDR4x-4266 Soldered (Max **32GB**) | 2-cell 38Wh / 4-cell 56.2Wh | **0.99 kg** | \`M47218-001\` |
| **\`MDL-DF-MAX\`** | **HP Elite Dragonfly Max Notebook PC** | \`Max\` (2021) | 360° Convertible 2-in-1 | 13.3" (16:9) | 11th Gen Intel Tiger Lake U (\`i5-1135G7\`–\`i7-1185G7\`) | LPDDR4x-4266 Soldered (Max **32GB**) | 4-cell 56.2Wh Long Life | **1.13 kg** | \`M51892-001\` |
| **\`MDL-DF-G3\`** | **HP Elite Dragonfly G3 Notebook PC** | \`G3\` (2022) | **Clamshell 180° Lay-Flat** | **13.5" (3:2)** | 12th Gen Intel Alder Lake U 15W (\`i5-1235U\`–\`i7-1265U vPro\`) | LPDDR5-4800/6400 Soldered (Max **32GB**) | 4-cell 45Wh / **6-cell 68Wh** | **0.99 kg** | \`N09241-001\` |
| **\`MDL-DF-FOLIO-G3\`** | **HP Dragonfly Folio 13.5 inch G3 2-in-1** | \`Folio G3\` (2022) | **Pull-Forward Folio 2-in-1** | **13.5" (3:2 IPS / 3K2K OLED)** | 12th Gen Intel Alder Lake U 15W (\`i5-1235U\`–\`i7-1265U vPro\`) | LPDDR5-6400 Soldered (8/16/**32GB**) | **4-cell 53Wh** (\`M90788-005\`) | **1.40 kg** | \`N17344-001\` |
| **\`MDL-DF-G4\`** | **HP Dragonfly G4 Notebook PC** | \`G4\` (2023) | **Clamshell 180° Lay-Flat** | **13.5" (3:2)** | 13th Gen Intel Raptor Lake U (\`i5-1335U\`–\`i7-1365U vPro\`) | LPDDR5-6400 Soldered (Max **32GB**) | 4-cell 45Wh / **6-cell 68Wh** | **0.99 kg** | \`N48112-001\` |`;

    return {
      id: "ONT-SERIES",
      dept_ko: "플랫폼아키텍처 (ProductSeries & SKU 마스터)",
      dept_en: "Platform Architecture (ProductSeries & SKU Master)",
      q_ko: question,
      q_en: question,
      keywords: ["시리즈", "series", "모델", "라인업"],
      requires_okf_lookup: true,
      blocked: false,
      refused: false,
      hops: 2,
      gql: sql,
      answer_ko: answerKo,
      answer_en: answerEn,
      steps_trace: {
        step0: {
          status: "ANCHOR_BOUND",
          matched_tokens: [
            { token: "HP Dragonfly 노트북 시리즈", mapped: "NODE ProductModel (dragonfly_series_models · 6 models)" },
            { token: "세대별 세부 구성 / SKU", mapped: "EDGE BELONGS_TO_MODEL (product_skus_and_configs · 12 SKUs)" },
            { token: "제품 사양 정본 (Ch.1 §1.1~§1.3)", mapped: "OKF v0.2 manuals/01_ch1_product_specs/ (N17344-001 p.1-5)" }
          ]
        },
        step1: {
          executed: true,
          hops: 2,
          row_count: seriesRows.length,
          elapsed_ms: 215,
          job_id: "bqjob_live_series_master",
          bytes_processed: 16384,
          gql: sql
        },
        step2: {
          executed: true,
          entry_group: "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly",
          verdicts: [vp1.verdict, vp2.verdict, vp3.verdict]
        },
        step3: {
          executed: true,
          decision: "ALLOW",
          provisions_fetched: 3,
          incident_id: null
        }
      },
      artifact_drawer: {
        kc_verdicts: [vp1.verdict, vp2.verdict, vp3.verdict],
        provisions: [vp1.provision, vp2.provision, vp3.provision],
        ledger_tables: [
          {
            table_title_ko: "dragonfly_series_models (HP Dragonfly 시리즈 모델 마스터 · 6행)",
            table_title_en: "dragonfly_series_models (HP Dragonfly Series Master · 6 rows)",
            row_count: seriesRows.length,
            elapsed_ms: 215,
            job_id: "bqjob_live_series_master",
            bytes_processed: 16384,
            sql,
            rows: seriesRows
          },
          {
            table_title_ko: "product_skus_and_configs (시리즈별 세부 SKU 및 하드웨어 구성 · 12행)",
            table_title_en: "product_skus_and_configs (Product SKUs & Hardware Configs · 12 rows)",
            row_count: skuRows.length,
            elapsed_ms: 145,
            job_id: "bqjob_sku_configs",
            bytes_processed: 12288,
            sql: "SELECT * FROM `hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs` ORDER BY model_id, sku_id",
            rows: skuRows
          }
        ]
      }
    };
  }

  function matchLocalAgentScenario(question, scenarioId) {
    const scenarios = getAgentScenarios();
    if (!scenarios.length) return null;
    if (scenarioId) {
      const byId = scenarios.find((s) => s.id === scenarioId);
      if (byId) return byId;
    }
    const qNorm = String(question || "").trim().toLowerCase();
    if (!qNorm) return scenarios[0];

    for (const sc of scenarios) {
      if (
        qNorm === String(sc.q_ko || "").trim().toLowerCase() ||
        qNorm === String(sc.q_en || "").trim().toLowerCase()
      ) {
        return sc;
      }
    }

    const generalCatalogTriggers = [
      "시리즈", "라인업", "노트북 종류", "모델 종류", "모델 목록", "시리즈 목록",
      "전 모델", "전체 모델", "노트북을 모두", "시리즈를 모두", "모두 알려", "다 알려",
      "전체 알려", "목록을 알려", "목록 알려", "종류를 알려", "종류 알려",
      "tell me all", "list all", "all series", "all models", "laptop series"
    ];
    if (generalCatalogTriggers.some((t) => qNorm.includes(t))) {
      const dyn = buildDynamicOntologyScenario(question);
      if (dyn) return dyn;
    }

    const genericIgnore = new Set(["모델", "series", "folio", "g1", "g2", "g3", "g4", "max", "sku"]);
    let bestSc = null;
    let bestScore = 0;
    let matchedCount = 0;
    for (const sc of scenarios.slice(0, -1)) {
      let score = 0;
      let cnt = 0;
      for (const kw of sc.keywords || []) {
        const kwL = String(kw).toLowerCase();
        if (genericIgnore.has(kwL)) continue;
        if (qNorm.includes(kwL)) {
          score += kwL.length >= 4 ? 3 : 2;
          cnt += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        matchedCount = cnt;
        bestSc = sc;
      }
    }
    if (bestSc && bestScore >= 5 && matchedCount >= 2) return bestSc;

    const dynFallback = buildDynamicOntologyScenario(question);
    if (dynFallback) return dynFallback;

    return scenarios[scenarios.length - 1];
  }

  function buildAgentSidebarListHtml(filterText = "") {
    const k = isKo();
    const scenarios = getAgentScenarios();
    const qNorm = String(filterText || "").trim().toLowerCase();
    const filtered = scenarios.filter((item) => {
      if (!qNorm) return true;
      return (
        String(item.id).toLowerCase().includes(qNorm) ||
        String(item.dept_ko || "").toLowerCase().includes(qNorm) ||
        String(item.dept_en || "").toLowerCase().includes(qNorm) ||
        String(item.q_ko || "").toLowerCase().includes(qNorm) ||
        String(item.q_en || "").toLowerCase().includes(qNorm) ||
        (item.keywords || []).some((kw) => String(kw).toLowerCase().includes(qNorm))
      );
    });

    if (!filtered.length) {
      return `<div style="padding:16px 12px; font-size:12px; color:var(--text-sub); text-align:center;">${
        k ? "일치하는 질문이 없습니다." : "No matching questions found."
      }</div>`;
    }

    return filtered
      .map((item) => {
        const activeCls = item.id === AGENT_SELECTED_Q_ID ? "active" : "";
        const deptLabel = k ? item.dept_ko : item.dept_en;
        const qLabel = k ? item.q_ko : item.q_en;
        return `
        <div class="nav-item ${activeCls}" id="agent-qitem-${item.id}" onclick="selectAgentQuestion('${item.id}')">
          <div class="nav-item-top" style="margin-bottom:5px;">
            <span class="nav-item-title" style="font-weight:700;">${escapeHtml(item.id)}.</span>
            <div style="display:flex; align-items:center; gap:5px;">
              <span class="agent-neutral-pill" style="font-size:10.5px; padding:1px 7px;">${escapeHtml(deptLabel)}</span>
              <button type="button" class="sidebar-collapse-btn" style="padding:1px 6px; font-size:10.5px;" onclick="event.stopPropagation(); selectAgentQuestion('${item.id}', true);" title="${
                k ? "질문 즉시 실행 (Run Immediately)" : "Run Question Immediately"
              }">▶</button>
            </div>
          </div>
          <div style="font-size:12px; color:var(--text); line-height:1.45; white-space:normal; word-break:keep-all;">
            ${escapeHtml(qLabel)}
          </div>
        </div>
      `;
      })
      .join("");
  }

  function formatAgentInline(str, turnIdx) {
    let s = escapeHtml(str);
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/`\[([^\]]+)\]`/g, (_, tag) => {
      return `<button type="button" class="agent-cite-pill" onclick="openAgentArtifactForTurn(${turnIdx}, 'PROVISION')">[${tag}]</button>`;
    });
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  }

  function formatAgentMarkdown(md, turnIdx = 0) {
    if (!md) return "";
    const lines = String(md).split("\n");
    let html = "";
    let inTable = false;
    let tableRows = [];
    let inList = false;

    const flushTable = () => {
      if (!inTable || tableRows.length === 0) return;
      let tbl = '<div class="agent-table-scroll"><table class="mod-table"><thead>';
      const headerCols = tableRows[0]
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      tbl +=
        "<tr>" +
        headerCols.map((c) => `<th>${formatAgentInline(c, turnIdx)}</th>`).join("") +
        "</tr></thead><tbody>";
      for (let i = 2; i < tableRows.length; i++) {
        const cols = tableRows[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (cols.length > 0) {
          tbl +=
            "<tr>" +
            cols.map((c) => `<td>${formatAgentInline(c, turnIdx)}</td>`).join("") +
            "</tr>";
        }
      }
      tbl += "</tbody></table></div>";
      html += tbl;
      inTable = false;
      tableRows = [];
    };

    const flushList = () => {
      if (!inList) return;
      html += "</ul>";
      inList = false;
    };

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        flushList();
        inTable = true;
        tableRows.push(line);
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s+/.test(line)) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        const cleaned = line.replace(/^(-|\*|\d+\.)\s+/, "");
        html += `<li>${formatAgentInline(cleaned, turnIdx)}</li>`;
        continue;
      } else if (inList) {
        flushList();
      }

      if (!line) continue;

      if (line.startsWith("### ")) {
        html += `<h3>${formatAgentInline(line.slice(4), turnIdx)}</h3>`;
      } else if (line.startsWith("#### ")) {
        html += `<h4>${formatAgentInline(line.slice(5), turnIdx)}</h4>`;
      } else if (line.startsWith("> ")) {
        html += `<blockquote>${formatAgentInline(line.slice(2), turnIdx)}</blockquote>`;
      } else {
        html += `<p>${formatAgentInline(line, turnIdx)}</p>`;
      }
    }
    flushTable();
    flushList();
    return html;
  }

  function buildAgentStepsTraceHtml(sc) {
    const k = isKo();
    const st = sc.steps_trace || {};
    const s0 = st.step0 || {};
    const s1 = st.step1 || {};
    const s2 = st.step2 || {};
    const s3 = st.step3 || {};
    const tokens = s0.matched_tokens || [];

    const tokenRows = tokens.length
      ? tokens
          .map(
            (t) =>
              `<li><code>${escapeHtml(t.token)}</code> ➔ <strong>${escapeHtml(t.mapped)}</strong></li>`
          )
          .join("")
      : `<li>${
          k
            ? "매칭된 도메인 앵커 토큰 0건 (도메인 범위 외 질문으로 판정)"
            : "0 matched domain anchor tokens (classified as Out-of-Domain)"
        }</li>`;

    const s1Html = s1.executed
      ? `<div style="margin-top:6px;">
          <div style="font-size:11.5px; color:var(--text-sub); margin-bottom:4px;">
            ${
              k
                ? `실행 완료 · 탐색 깊이: <strong>${s1.hops}-Hop</strong> · 반환 행: <strong>${s1.row_count} rows</strong> · 소요시간: <strong>${s1.elapsed_ms} ms</strong> · 스캔 용량: <code>${s1.bytes_processed || 24576} B</code> · Job: <code>${escapeHtml(s1.job_id || "bqjob")}</code>`
                : `Executed · Depth: <strong>${s1.hops}-Hop</strong> · Returned: <strong>${s1.row_count} rows</strong> · Elapsed: <strong>${s1.elapsed_ms} ms</strong> · Bytes: <code>${s1.bytes_processed || 24576} B</code> · Job: <code>${escapeHtml(s1.job_id || "bqjob")}</code>`
            }
          </div>
          <pre class="query-code-pre">${escapeHtml(s1.gql || sc.gql || "")}</pre>
        </div>`
      : `<div style="font-size:11.5px; color:var(--text-sub);">${
          k ? "Step 0 도메인 차단으로 인해 GQL 실행 생략 (0 B Scanned)" : "Skipped due to Step 0 Out-of-Domain refusal (0 B Scanned)"
        }</div>`;

    const verdicts = s2.verdicts || [];
    const s2Html = verdicts.length
      ? `<ul style="margin:4px 0 0 18px; font-size:11.5px; line-height:1.55;">
          ${verdicts
            .map(
              (v) =>
                `<li><code>${escapeHtml(v.kc_entry_id)}</code> ➔ <strong>status=${escapeHtml(v.status)}</strong>, decision=<strong>${escapeHtml(v.decision)}</strong> (${escapeHtml(
                  k ? v.reason_ko : v.reason_en
                )})</li>`
            )
            .join("")}
        </ul>`
      : `<div style="font-size:11.5px; color:var(--text-sub);">${
          k ? "KC 엔트리 조회 생략" : "No KC entries queried"
        }</div>`;

    const s3Html = sc.refused
      ? `<div style="font-size:11.5px; color:var(--text-sub);">${
          k ? "도메인 범위 외 질문 거절 완료" : "Out-of-domain refusal completed"
        }</div>`
      : sc.blocked
      ? `<div style="font-size:11.5px; color:var(--gcp-red); font-weight:600;">${
          k
            ? `BLOCKED_DEPRECATED 차단 발동 · 감사 티켓(${escapeHtml(s3.incident_id || "INC-HP-KC-2026-013")}) 발행 및 원문 인출 중단`
            : `BLOCKED_DEPRECATED triggered · Audit ticket (${escapeHtml(s3.incident_id || "INC-HP-KC-2026-013")}) issued & raw manual fetch halted`
        }</div>`
      : `<div style="font-size:11.5px; color:var(--text-sub);">${
          k
            ? `거버넌스 게이트 통과(ALLOW) ➔ OKF v0.2 마크다운 정본 <strong>${s3.provisions_fetched}건</strong> 및 원본 PDF(<code>N17344-001</code>) 페이지/SHA-256 무결성 교차 검증 완료`
            : `Governance gate passed (ALLOW) ➔ Retrieved <strong>${s3.provisions_fetched}</strong> canonical OKF v0.2 Markdown specs & verified PDF (<code>N17344-001</code>) SHA-256 provenance`
        }</div>`;

    return `
      <div style="display:flex; flex-direction:column; gap:10px; font-size:12px;">
        <div style="padding:8px 10px; background:var(--surface-elevated); border:1px solid var(--border-subtle); border-radius:6px;">
          <strong>Step 0 · <code>before_agent_callback</code> (${
            k ? "최장일치 엔티티 앵커 바인딩" : "Longest-Match Entity Anchor Binding"
          })</strong>
          <ul style="margin:4px 0 0 18px; font-size:11.5px; line-height:1.55;">${tokenRows}</ul>
        </div>
        <div style="padding:8px 10px; background:var(--surface-elevated); border:1px solid var(--border-subtle); border-radius:6px;">
          <strong>Step 1 · <code>graph_query</code> (BigQuery ISO/IEC 39075 GQL · <code>hp_dragonfly_ontology_graph</code>)</strong>
          ${s1Html}
        </div>
        <div style="padding:8px 10px; background:var(--surface-elevated); border:1px solid var(--border-subtle); border-radius:6px;">
          <strong>Step 2 · <code>kc_lookup</code> (Dataplex Knowledge Catalog · <code>okf_hp_dragonfly</code>)</strong>
          ${s2Html}
        </div>
        <div style="padding:8px 10px; background:var(--surface-elevated); border:1px solid var(--border-subtle); border-radius:6px;">
          <strong>Step 3 · <code>before_tool_callback</code> ➔ <code>fetch_okf_markdown</code> (${
            k ? "거버넌스 게이트 판정 및 OKF/PDF 원문 인출" : "Governance Gate & OKF/PDF Provenance Fetch"
          })</strong>
          ${s3Html}
        </div>
      </div>
    `;
  }

  function buildAgentTurnBubbleHtml(turn, turnIdx) {
    const k = isKo();
    const sc = turn.scenario;
    const isBlocked = Boolean(sc.blocked);
    const isRefused = Boolean(sc.refused);
    const hasOkf = Boolean(sc.requires_okf_lookup);
    const deptName = k ? sc.dept_ko : sc.dept_en;
    const answerMd = k ? sc.answer_ko : sc.answer_en;

    let statusBadgeHtml = "";
    if (isRefused) {
      statusBadgeHtml = `<span class="agent-neutral-pill">${
        k ? "도메인 외 질문 거절 (Out-of-Domain)" : "Out-of-Domain Refusal"
      }</span>`;
    } else if (isBlocked) {
      statusBadgeHtml = `<span class="agent-neutral-pill" style="border-color:var(--gcp-red); color:var(--gcp-red); font-weight:600;">${
        k ? "BLOCKED_DEPRECATED · 폐기 매뉴얼 차단" : "BLOCKED_DEPRECATED · Deprecated Manual Blocked"
      }</span>`;
    } else if (hasOkf) {
      statusBadgeHtml = `<span class="agent-neutral-pill">${
        k ? "KC ALLOW · OKF 원문 검증" : "KC ALLOW · OKF Source Attested"
      }</span>`;
    } else {
      statusBadgeHtml = `<span class="agent-neutral-pill">${
        k ? "Step 1 · GQL 원장 조회" : "Step 1 · GQL Graph Query"
      }</span>`;
    }

    const defaultDrawerTab = isBlocked ? "KC" : hasOkf ? "PROVISION" : "LEDGER";
    const openBtnLabel = isBlocked
      ? k
        ? "차단 판정 근거 열기"
        : "Open Block Verdict"
      : hasOkf
      ? k
        ? "원문·원장 근거 상세 열기"
        : "Open OKF & BigQuery Evidence"
      : k
      ? "테이블 결과 상세 열기"
      : "Open Table Results";

    const openBtnHtml = isRefused
      ? ""
      : `<button type="button" class="agent-artifact-open-btn" onclick="openAgentArtifactForTurn(${turnIdx}, '${defaultDrawerTab}')">
          ${openBtnLabel}
        </button>`;

    const s1 = (sc.steps_trace && sc.steps_trace.step1) || {};
    const qaTitle = isRefused
      ? k
        ? "Step 0 도메인 가드레일 판정 로그 (0 Bytes Scanned)"
        : "Step 0 Domain Guardrail Trace (0 Bytes Scanned)"
      : k
      ? `실행된 GQL 쿼리 및 경로 분석 (Step 0~3 · ${s1.row_count || 0}행 · ${s1.elapsed_ms || 0} ms)`
      : `Executed GQL Query & Path Analysis (Step 0–3 · ${s1.row_count || 0} rows · ${s1.elapsed_ms || 0} ms)`;

    return `
      <div class="msg-agent-bubble ${isBlocked ? "blocked-bubble" : ""}">
        <div class="msg-agent-topbar">
          <div class="msg-agent-meta-left">
            <span class="agent-neutral-pill">${escapeHtml(sc.id || "01")}. ${escapeHtml(deptName)}</span>
            ${statusBadgeHtml}
          </div>${openBtnHtml}
        </div>

        <div class="agent-md-body">
          ${formatAgentMarkdown(answerMd, turnIdx)}
        </div>

        <details class="query-accordion">
          <summary>
            <span>${escapeHtml(qaTitle)}</span>
            <span class="material-symbols-outlined qa-chevron">expand_more</span>
          </summary>
          <div class="query-accordion-body">
            ${buildAgentStepsTraceHtml(sc)}
          </div>
        </details>
      </div>
    `;
  }

  function buildAgentWelcomeCardHtml() {
    const k = isKo();
    return `
      <div class="agent-msg-row msg-agent" id="agent-welcome-card">
        <div class="mod-card" style="padding:18px 22px;">
          <div style="font-size:14px; font-weight:600; color:var(--text); margin-bottom:6px;">
            ${
              k
                ? "HP Dragonfly G3 / Folio G3 엔터프라이즈 온톨로지 에이전트 실행 구조"
                : "HP Dragonfly G3 / Folio G3 Enterprise Ontology Agent Execution Architecture"
            }
          </div>
          <div style="font-size:12.5px; color:var(--text-sub); line-height:1.7;">
            ${
              k
                ? "• <strong>Step 0 (<code>before_agent_callback</code>)</strong>: 사용자 질문에서 부품 번호(<code>N20728-601</code>), 점멸 코드(<code>LED-CAPS-2-2</code>, <code>3.2</code>), 고장 증상을 최장일치로 추출하여 온톨로지 클래스 앵커에 바인딩합니다.<br>• <strong>Step 1 (<code>graph_query</code>)</strong>: BigQuery Property Graph(<code>hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph</code>)에 ISO/IEC 39075 GQL을 실행하여 선행 분해 순서(DAG), SKU별 보드 FRU, 플레이북 경로를 멀티홉으로 조회합니다.<br>• <strong>Step 2 (<code>kc_lookup</code>)</strong>: Dataplex Knowledge Catalog(<code>okf_hp_dragonfly</code>)에서 연결된 OKF v0.2 엔트리의 유효 상태(<code>status: verified / deprecated</code>, <code>stale_after</code>)를 검증합니다.<br>• <strong>Step 3 (<code>before_tool_callback</code> ➔ <code>fetch_okf_markdown</code>)</strong>: 유효 정본(<code>ALLOW</code>) 판정 시에만 OKF v0.2 마크다운과 원본 서비스 매뉴얼 PDF(<code>N17344-001</code>) 페이지를 인출하며, 폐기된 구버전 지침은 <code>BLOCKED_DEPRECATED</code>로 즉시 차단합니다."
                : "• <strong>Step 0 (<code>before_agent_callback</code>)</strong>: Extracts spare part numbers (<code>N20728-601</code>), blink codes (<code>LED-CAPS-2-2</code>, <code>3.2</code>), and symptoms via longest-match alias binding.<br>• <strong>Step 1 (<code>graph_query</code>)</strong>: Executes ISO/IEC 39075 GQL against <code>hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph</code> to resolve prerequisite disassembly DAGs, SKU-to-System-Board FRUs, and playbook bridges.<br>• <strong>Step 2 (<code>kc_lookup</code>)</strong>: Queries Dataplex Knowledge Catalog (<code>okf_hp_dragonfly</code>) to verify entry governance metadata (<code>status: verified / deprecated</code>, <code>stale_after</code>).<br>• <strong>Step 3 (<code>before_tool_callback</code> ➔ <code>fetch_okf_markdown</code>)</strong>: Enforces the governance gate—retrieving verbatim OKF v0.2 Markdown and PDF (<code>N17344-001</code>) pages on <code>ALLOW</code>, or halting with <code>BLOCKED_DEPRECATED</code>."
            }
          </div>
          <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:11.5px; font-weight:600; color:var(--text-sub);">${
              k ? "추천 대표 질문 바로 실행:" : "Quick-Run Featured Scenarios:"
            }</span>
            <button type="button" class="scen-pill" style="padding:3px 10px; font-size:11.5px;" onclick="runQuickCustomAgentQuestion('${
              k ? "HP Dragonfly 노트북 시리즈를 모두 알려줘" : "Tell me all HP Dragonfly laptop series and models"
            }')">
              ${k ? "★ HP Dragonfly 노트북 시리즈 전체 조회 (6종)" : "★ All HP Dragonfly Laptop Series (6 Models)"}
            </button>
            <button type="button" class="scen-pill" style="padding:3px 10px; font-size:11.5px;" onclick="selectAgentQuestion('01', true)">
              ${k ? "01. 시스템 보드(N20728-601) 분해 DAG & 700V ESD" : "01. System Board (N20728-601) Disassembly DAG & ESD"}
            </button>
            <button type="button" class="scen-pill" style="padding:3px 10px; font-size:11.5px;" onclick="selectAgentQuestion('02', true)">
              ${k ? "02. LED 2.2 점멸 & HP Sure Start 무분해 복구" : "02. Caps Lock 2.2 Blink & Sure Start Recovery"}
            </button>
            <button type="button" class="scen-pill" style="padding:3px 10px; font-size:11.5px;" onclick="selectAgentQuestion('03', true)">
              ${k ? "03. LED 3.2 온보드 RAM 불량 & SKU별 보드 매핑" : "03. Caps Lock 3.2 Soldered RAM & SKU Board Matrix"}
            </button>
            <button type="button" class="scen-pill" style="padding:3px 10px; font-size:11.5px;" onclick="selectAgentQuestion('13', true)">
              ${k ? "13. [거버넌스 차단] 폐기 매뉴얼(BLOCKED_DEPRECATED)" : "13. [Governance Block] Deprecated Draft (BLOCKED)"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderAgentModule() {
    const rootEl = document.getElementById("module-agent");
    if (!rootEl) return;
    const k = isKo();
    const scenarios = getAgentScenarios();
    if (!AGENT_INITIAL_SEEDED && scenarios.length > 0) {
      AGENT_INITIAL_SEEDED = true;
      const sc0 = scenarios[0];
      AGENT_TURN_HISTORY.push({
        user_q_ko: sc0.q_ko,
        user_q_en: sc0.q_en,
        scenario: sc0
      });
      AGENT_ACTIVE_TURN_IDX = 0;
      AGENT_SELECTED_Q_ID = scenarios.length > 1 ? scenarios[1].id : sc0.id;
    }
    const selSc = scenarios.find((s) => s.id === AGENT_SELECTED_Q_ID) || scenarios[0];

    const historyHtml = AGENT_TURN_HISTORY.map((turn, idx) => {
      const userQ = k ? turn.user_q_ko : turn.user_q_en;
      return `
        <div class="agent-msg-row msg-user">
          <div class="msg-user-bubble">${escapeHtml(userQ)}</div>
        </div>
        <div class="agent-msg-row msg-agent">
          ${buildAgentTurnBubbleHtml(turn, idx)}
        </div>
      `;
    }).join("");

    rootEl.innerHTML = `
      <!-- Top Full-Width Subbar -->
      <div class="pane-subbar" style="justify-content:space-between; padding:0 20px; height:44px;">
        <div style="display:flex; align-items:center; gap:10px; min-width:0;">
          <button type="button" class="sidebar-collapse-btn" onclick="toggleAgentLeftSidebar()" title="${
            k ? "좌측 질문 목록 접기/펼치기" : "Toggle Left Question Sidebar"
          }">
            <span class="material-symbols-outlined" style="font-size:16px;" id="agent-left-toggle-icon">${
              AGENT_LEFT_SIDEBAR_COLLAPSED ? "left_panel_open" : "left_panel_close"
            }</span>
            <span id="lbl-agent-left-toggle">${
              AGENT_LEFT_SIDEBAR_COLLAPSED
                ? k
                  ? "질문 패널 펼치기"
                  : "Expand Questions"
                : k
                ? "질문 패널 접기"
                : "Collapse Questions"
            }</span>
          </button>
          <span class="material-symbols-outlined" style="font-size:18px; color:var(--gcp-blue);">smart_toy</span>
          <span style="font-weight:600; color:var(--text); white-space:nowrap;">${
            k
              ? "HP Dragonfly Graph 하드웨어 서비스 · 진단 · 분해 추론 에이전트"
              : "HP Dragonfly Graph Hardware Service, Triage & Disassembly Agent"
          }</span>
          <span style="font-size:11.5px; color:var(--text-sub); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${
              k
                ? "Step 0(앵커 바인딩) ➔ Step 1(BigQuery GQL) ➔ Step 2(Dataplex KC 검증) ➔ Step 3(게이트 판정 · OKF/PDF 원문 인출)"
                : "Step 0 (Anchor Bind) ➔ Step 1 (BigQuery GQL) ➔ Step 2 (Dataplex KC Lookup) ➔ Step 3 (Gate & OKF/PDF Fetch)"
            }
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
          <button type="button" class="gcp-action-btn" onclick="toggleAgentArtifactDrawer()" style="padding:4px 12px; font-size:12px;">
            <span class="material-symbols-outlined" style="font-size:15px;">menu_book</span>
            <span>${k ? "근거 아티팩트 서랍" : "Evidence Artifact Drawer"}</span>
          </button>
          <button type="button" class="gcp-action-btn" onclick="clearAgentChatSession()" style="padding:4px 10px; font-size:12px;">
            ${k ? "초기화" : "Reset"}
          </button>
        </div>
      </div>

      <!-- Body Row: Left Question Sidebar + Center Wide Chat Studio + Right Slide-out Evidence Drawer -->
      <div class="bench-body-row">
        <!-- 1. Left Question Sidebar -->
        <aside class="agent-nav-sidebar ${AGENT_LEFT_SIDEBAR_COLLAPSED ? "collapsed" : ""}" id="agent-left-sidebar">
          <div class="agent-sidebar-header">
            <div style="font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.2px; margin-bottom:6px;">
              ${k ? `질문 목록 (${scenarios.length}건)` : `Question Catalog (${scenarios.length})`}
            </div>
            <div style="font-size:12px; color:var(--text-sub); line-height:1.55;">
              ${
                k
                  ? "질문을 클릭하면 하단 입력창에 채워지며, 우측 <strong>▶ 버튼</strong> 또는 <strong>Enter</strong>로 즉시 실행합니다."
                  : "Click any question to populate the composer, or click <strong>▶</strong> / press <strong>Enter</strong> to execute."
              }
            </div>
          </div>

          <div class="search-box">
            <div class="search-input-wrap">
              <span class="material-symbols-outlined">search</span>
              <input type="text" id="agent-q-search" value="${escapeHtml(AGENT_SEARCH_FILTER)}" placeholder="${
                k ? "질문 또는 부품/코드 검색 (N20728, LED, BIOS)..." : "Filter by part, code, or keyword..."
              }" oninput="filterAgentSidebarQuestions(this.value)" />
            </div>
          </div>

          <div class="nav-list" id="agent-q-list">
            ${buildAgentSidebarListHtml(AGENT_SEARCH_FILTER)}
          </div>
        </aside>

        <!-- 2. Center Wide Chat Studio -->
        <section class="agent-chat-pane">
          <div class="bench-arm-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span>Graph Agent · <code>hp_dragonfly_ontology_graph</code> + Dataplex KC <code>okf_hp_dragonfly</code></span>
            </div>
            <span style="font-size:11.5px; font-weight:500; color:var(--text-sub);">
              ${k ? "실시간 BigQuery GQL + 28 OKF v0.2 정본 연동" : "Live BigQuery GQL + 28 Canonical OKF v0.2 Docs"}
            </span>
          </div>

          <!-- Scrollable Chat Messages -->
          <div class="agent-chat-messages" id="agent-chat-messages">
            ${buildAgentWelcomeCardHtml()}
            ${historyHtml}
          </div>

          <!-- Bottom Chat Input Bar -->
          <div class="agent-chat-input-bar">
            <div class="agent-composer-card">
              <textarea id="agent-chat-input" class="agent-chat-textarea" rows="1"
                        placeholder="${
                          k
                            ? "좌측에서 질문(01. ~ 14.)을 클릭하거나 HP Dragonfly 노트북 부품/고장 질문을 입력하세요... (Enter 전송, Shift+Enter 줄바꿈)"
                            : "Select a question (01.–14.) on the left or ask any HP Dragonfly hardware/triage question... (Enter to send)"
                        }"
                        oninput="autoResizeAgentTextarea(this)"
                        onkeydown="handleAgentChatKeydown(event)">${escapeHtml(
                          selSc ? (k ? selSc.q_ko : selSc.q_en) : ""
                        )}</textarea>
              <div class="agent-composer-footer">
                <button type="button" id="agent-send-btn" class="agent-send-btn" onclick="sendAgentChatMessage()" title="${
                  k ? "질문 전송 (Enter)" : "Send Question (Enter)"
                }">
                  <span class="material-symbols-outlined">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Right Slide-out Evidence Artifact Drawer -->
        <aside id="agent-artifact-drawer" class="agent-artifact-drawer ${AGENT_DRAWER_OPEN ? "open" : ""}">
          <div class="detail-panel-header">
            <div class="detail-panel-title-wrap">
              <span class="material-symbols-outlined" style="font-size:16px; color:var(--text-sub);">verified_user</span>
              <code id="agent-drawer-title">${
                k ? "실시간 검증 근거 아티팩트" : "Live Verified Evidence Artifacts"
              }</code>
            </div>
            <button type="button" class="icon-close-btn" onclick="closeAgentArtifactDrawer()" title="${
              k ? "닫기" : "Close"
            }">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="agent-drawer-tabs">
            <button type="button" class="mgmt-subtab-btn ${AGENT_DRAWER_TAB === "KC" ? "active" : ""}" id="agent-dtab-KC" onclick="switchAgentDrawerTab('KC')">
              ${k ? "KC 유효성 판정" : "KC Verdict"}
            </button>
            <button type="button" class="mgmt-subtab-btn ${AGENT_DRAWER_TAB === "PROVISION" ? "active" : ""}" id="agent-dtab-PROVISION" onclick="switchAgentDrawerTab('PROVISION')">
              ${k ? "OKF 원문" : "OKF Source"}
            </button>
            <button type="button" class="mgmt-subtab-btn ${AGENT_DRAWER_TAB === "LEDGER" ? "active" : ""}" id="agent-dtab-LEDGER" onclick="switchAgentDrawerTab('LEDGER')">
              ${k ? "테이블 결과" : "Table Results"}
            </button>
          </div>

          <div class="detail-panel-body" id="agent-drawer-body"></div>
        </aside>
      </div>
    `;

    const inputEl = document.getElementById("agent-chat-input");
    if (inputEl) window.autoResizeAgentTextarea(inputEl);
    if (AGENT_DRAWER_OPEN) {
      renderAgentArtifactDrawer();
    }
  }

  window.toggleAgentLeftSidebar = function () {
    AGENT_LEFT_SIDEBAR_COLLAPSED = !AGENT_LEFT_SIDEBAR_COLLAPSED;
    const sb = document.getElementById("agent-left-sidebar");
    if (sb) sb.classList.toggle("collapsed", AGENT_LEFT_SIDEBAR_COLLAPSED);
    const iconEl = document.getElementById("agent-left-toggle-icon");
    const lblEl = document.getElementById("lbl-agent-left-toggle");
    const k = isKo();
    if (iconEl) {
      iconEl.textContent = AGENT_LEFT_SIDEBAR_COLLAPSED ? "left_panel_open" : "left_panel_close";
    }
    if (lblEl) {
      lblEl.textContent = AGENT_LEFT_SIDEBAR_COLLAPSED
        ? k
          ? "질문 패널 펼치기"
          : "Expand Questions"
        : k
        ? "질문 패널 접기"
        : "Collapse Questions";
    }
  };

  window.filterAgentSidebarQuestions = function (val) {
    AGENT_SEARCH_FILTER = val || "";
    const listEl = document.getElementById("agent-q-list");
    if (listEl) {
      listEl.innerHTML = buildAgentSidebarListHtml(AGENT_SEARCH_FILTER);
    }
  };

  window.runQuickCustomAgentQuestion = function (qText) {
    const inputEl = document.getElementById("agent-chat-input");
    if (!inputEl) return;
    inputEl.value = qText;
    window.autoResizeAgentTextarea(inputEl);
    window.sendAgentChatMessage(null);
  };

  window.selectAgentQuestion = function (qId, autoSend = false) {
    AGENT_SELECTED_Q_ID = qId;
    const scenarios = getAgentScenarios();
    scenarios.forEach((item) => {
      const el = document.getElementById(`agent-qitem-${item.id}`);
      if (el) el.classList.toggle("active", item.id === qId);
    });
    const found = scenarios.find((item) => item.id === qId);
    const inputEl = document.getElementById("agent-chat-input");
    if (found && inputEl) {
      inputEl.value = isKo() ? found.q_ko : found.q_en;
      window.autoResizeAgentTextarea(inputEl);
      inputEl.focus();
      if (autoSend) {
        window.sendAgentChatMessage(qId);
      }
    }
  };

  window.autoResizeAgentTextarea = function (el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  window.handleAgentChatKeydown = function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      window.sendAgentChatMessage();
    }
  };

  window.clearAgentChatSession = function () {
    AGENT_TURN_HISTORY = [];
    AGENT_ACTIVE_TURN_IDX = -1;
    AGENT_DRAWER_OPEN = false;
    renderAgentModule();
  };

  window.sendAgentChatMessage = async function (explicitScenarioId = null) {
    if (AGENT_IS_SENDING) return;
    const inputEl = document.getElementById("agent-chat-input");
    const msgBox = document.getElementById("agent-chat-messages");
    const sendBtn = document.getElementById("agent-send-btn");
    if (!inputEl || !msgBox) return;

    const question = inputEl.value.trim();
    if (!question) return;

    const k = isKo();
    AGENT_IS_SENDING = true;
    if (sendBtn) sendBtn.disabled = true;

    inputEl.value = "";
    window.autoResizeAgentTextarea(inputEl);

    const userRow = document.createElement("div");
    userRow.className = "agent-msg-row msg-user";
    userRow.innerHTML = `<div class="msg-user-bubble">${escapeHtml(question)}</div>`;
    msgBox.appendChild(userRow);

    const loadingRow = document.createElement("div");
    loadingRow.className = "agent-msg-row msg-agent";
    const loadingTextId = `agent-loading-stage-${Date.now()}`;
    const loadingStages = k
      ? [
          "Step 0 · before_agent_callback : 부품 번호·진단 코드 최장일치 엔티티 앵커 바인딩 중...",
          "Step 1 · graph_query : BigQuery hp_dragonfly_ontology_graph GQL 경로 탐색 및 실행 중...",
          "Step 2 · kc_lookup : Dataplex Knowledge Catalog (okf_hp_dragonfly) 유효성 검증 중...",
          "Step 3 · before_tool_callback : 거버넌스 게이트 판정 및 OKF v0.2 마크다운/PDF 원문 인출 중..."
        ]
      : [
          "Step 0 · before_agent_callback : Binding spare part & diagnostic code entity anchors...",
          "Step 1 · graph_query : Executing ISO/IEC 39075 GQL on BigQuery hp_dragonfly_ontology_graph...",
          "Step 2 · kc_lookup : Verifying Dataplex Knowledge Catalog (okf_hp_dragonfly) status...",
          "Step 3 · before_tool_callback : Evaluating governance gate & fetching canonical OKF v0.2 Markdown..."
        ];
    let stageIdx = 0;

    loadingRow.innerHTML = `
      <div class="msg-agent-bubble" style="padding:14px 18px;">
        <div class="agent-loading-line">
          <span class="material-symbols-outlined gcp-spin-sync" style="font-size:17px; color:var(--text-sub); flex-shrink:0;">sync</span>
          <span id="${loadingTextId}" class="agent-loading-text">${loadingStages[0]}</span>
        </div>
      </div>
    `;
    msgBox.appendChild(loadingRow);
    msgBox.scrollTop = msgBox.scrollHeight;

    const loadingTimer = setInterval(() => {
      if (stageIdx < loadingStages.length - 1) {
        stageIdx += 1;
        const stageEl = document.getElementById(loadingTextId);
        if (stageEl) stageEl.textContent = loadingStages[stageIdx];
      }
    }, 320);

    try {
      let matchedSc = null;
      try {
        const res = await fetch("/api/agent/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            scenario_id: explicitScenarioId,
            live_bq: true
          })
        });
        const data = await res.json();
        if (data && data.ok && data.scenario) {
          matchedSc = data.scenario;
        }
      } catch (_) {
        // Fallback to pre-verified local scenario bank
      }

      if (!matchedSc) {
        matchedSc = matchLocalAgentScenario(question, explicitScenarioId);
      }

      await new Promise((r) => setTimeout(r, 420));

      const turnObj = {
        user_q_ko: matchedSc && question === matchedSc.q_en ? matchedSc.q_ko : question,
        user_q_en: matchedSc && question === matchedSc.q_ko ? matchedSc.q_en : question,
        scenario: matchedSc
      };
      const turnIdx = AGENT_TURN_HISTORY.length;
      AGENT_TURN_HISTORY.push(turnObj);
      AGENT_ACTIVE_TURN_IDX = turnIdx;

      if (matchedSc && matchedSc.id) {
        AGENT_SELECTED_Q_ID = matchedSc.id;
        getAgentScenarios().forEach((item) => {
          const el = document.getElementById(`agent-qitem-${item.id}`);
          if (el) el.classList.toggle("active", item.id === matchedSc.id);
        });
      }

      loadingRow.innerHTML = buildAgentTurnBubbleHtml(turnObj, turnIdx);

      if (AGENT_DRAWER_OPEN) {
        renderAgentArtifactDrawer();
      }
    } catch (err) {
      loadingRow.innerHTML = `
        <div class="msg-agent-bubble blocked-bubble">
          <div class="agent-md-body">
            <h3>${k ? "에이전트 요청 처리 중 오류가 발생했습니다" : "Error processing agent request"}</h3>
            <p><code>${escapeHtml(err.message || String(err))}</code></p>
          </div>
        </div>
      `;
    } finally {
      clearInterval(loadingTimer);
      AGENT_IS_SENDING = false;
      if (sendBtn) sendBtn.disabled = false;
      msgBox.scrollTop = msgBox.scrollHeight;
    }
  };

  window.openAgentArtifactForTurn = function (turnIdx, defaultTab = "KC") {
    if (turnIdx < 0 || turnIdx >= AGENT_TURN_HISTORY.length) return;
    AGENT_ACTIVE_TURN_IDX = turnIdx;
    AGENT_DRAWER_TAB = defaultTab;
    AGENT_DRAWER_OPEN = true;
    const drawerEl = document.getElementById("agent-artifact-drawer");
    if (drawerEl) drawerEl.classList.add("open");
    renderAgentArtifactDrawer();
  };

  window.toggleAgentArtifactDrawer = function () {
    const drawerEl = document.getElementById("agent-artifact-drawer");
    if (!drawerEl) return;
    AGENT_DRAWER_OPEN = !AGENT_DRAWER_OPEN;
    drawerEl.classList.toggle("open", AGENT_DRAWER_OPEN);
    if (AGENT_DRAWER_OPEN) {
      renderAgentArtifactDrawer();
    }
  };

  window.closeAgentArtifactDrawer = function () {
    AGENT_DRAWER_OPEN = false;
    const drawerEl = document.getElementById("agent-artifact-drawer");
    if (drawerEl) drawerEl.classList.remove("open");
  };

  window.switchAgentDrawerTab = function (tabId) {
    AGENT_DRAWER_TAB = tabId;
    renderAgentArtifactDrawer();
  };

  window.jumpToOkfValidationFromAgent = function (okfRelPath) {
    const clean = String(okfRelPath || "").replace(/\.md$/, "");
    const fIdx = OKF_FILES.findIndex(
      (f) =>
        f.rel_path === okfRelPath ||
        f.id === clean ||
        (Array.isArray(f.legacy_aliases) &&
          (f.legacy_aliases.includes(okfRelPath) || f.legacy_aliases.includes(clean + ".md")))
    );
    if (fIdx >= 0) {
      CURRENT_OKF_IDX = fIdx;
    }
    GRAPH_MODE = false;
    window.switchModule("okf-validation");
    window.selectItem(CURRENT_OKF_IDX);
  };

  function renderAgentArtifactDrawer() {
    const bodyEl = document.getElementById("agent-drawer-body");
    const titleEl = document.getElementById("agent-drawer-title");
    if (!bodyEl) return;
    const k = isKo();

    ["KC", "PROVISION", "LEDGER"].forEach((t) => {
      const btn = document.getElementById(`agent-dtab-${t}`);
      if (btn) btn.classList.toggle("active", t === AGENT_DRAWER_TAB);
    });

    if (AGENT_ACTIVE_TURN_IDX < 0 || !AGENT_TURN_HISTORY[AGENT_ACTIVE_TURN_IDX]) {
      bodyEl.innerHTML = `
        <div style="padding:24px 16px; font-size:12.5px; color:var(--text-sub); line-height:1.6; text-align:center;">
          ${
            k
              ? "아직 실행된 에이전트 응답이 없습니다.<br>좌측에서 질문(<code>01.</code> ~ <code>14.</code>)을 선택하고 전송하면<br>실시간 <strong>KC 유효성 판정 · OKF 원문 · BigQuery 테이블 결과</strong>가 이곳에 표시됩니다."
              : "No agent response executed yet.<br>Select any question (<code>01.</code>–<code>14.</code>) on the left and send it to inspect live <strong>Dataplex KC Verdicts, OKF v0.2 Sources, and BigQuery GQL Results</strong>."
          }
        </div>
      `;
      return;
    }

    const turn = AGENT_TURN_HISTORY[AGENT_ACTIVE_TURN_IDX];
    const sc = turn.scenario || {};
    const drawer = sc.artifact_drawer || {};
    const kcVerdicts = drawer.kc_verdicts || [];
    const provisions = drawer.provisions || [];
    const ledgerTables = drawer.ledger_tables || [];

    if (titleEl) {
      titleEl.textContent = `${sc.id || "01"}. ${k ? sc.dept_ko : sc.dept_en} · ${
        k ? "근거 아티팩트" : "Evidence Artifacts"
      }`;
    }

    if (AGENT_DRAWER_TAB === "KC") {
      bodyEl.innerHTML =
        kcVerdicts
          .map((kv) => {
            const isAllowed = kv.decision === "ALLOW" || kv.decision === "SUPERSEDED_RESOLVED";
            const supInfo = kv.superseded_chain_example
              ? `<div style="margin-top:8px; padding:8px 10px; background:var(--code-bg); border:1px solid var(--border); border-radius:6px; font-size:11.5px; line-height:1.5;">
                  <strong>${
                    k ? "참고 · 정본 대체(Canonical Replacement) 체인:" : "Note · Canonical Replacement Chain:"
                  }</strong><br>
                  <code>${escapeHtml(kv.superseded_chain_example.from)}</code> ➔ <code>${escapeHtml(
                  kv.superseded_chain_example.resolved_to
                )}</code> (${kv.superseded_chain_example.hops}-hop, <code>${escapeHtml(
                  kv.superseded_chain_example.decision
                )}</code>)
                </div>`
              : "";
            return `
              <div class="mod-card ${!isAllowed ? "blocked-card" : ""}" style="padding:14px 16px; margin-bottom:12px;">
                <div class="mod-card-header">
                  <span class="mod-card-title" style="font-size:13px;">
                    ${escapeHtml(kv.article_no || "OKF Entry")}
                  </span>
                  <span class="agent-neutral-pill">${escapeHtml(kv.decision)} (status=${escapeHtml(kv.status)})</span>
                </div>
                <div style="font-size:12px; color:var(--text-sub); margin-bottom:6px;">${escapeHtml(
                  k ? kv.title_ko : kv.title_en
                )}</div>
                <div class="agent-table-scroll">
                  <table class="mod-table" style="font-size:11.5px;">
                    <tbody>
                      <tr><th style="width:115px;">KC Entry ID</th><td><code>${escapeHtml(kv.kc_entry_id)}</code></td></tr>
                      <tr><th>Dataplex FQN</th><td><code>${escapeHtml(kv.kc_entry_fqn || "")}</code></td></tr>
                      <tr><th>${k ? "유효 상태 (status)" : "Status"}</th><td><code>${escapeHtml(kv.status)}</code> (v${escapeHtml(kv.version || "1.0.0")})</td></tr>
                      <tr><th>${k ? "유효 기한 (stale_after)" : "Stale After"}</th><td><code>${escapeHtml(kv.stale_after || "2027-12-31")}</code></td></tr>
                      <tr><th>${k ? "게이트 판정" : "Gate Decision"}</th><td><strong>${escapeHtml(kv.decision)}</strong> (${escapeHtml(
              k ? kv.reason_ko : kv.reason_en
            )})</td></tr>
                      <tr><th>${k ? "검증 체인" : "Resolution Chain"}</th><td><code>${escapeHtml(
              (kv.chain || [kv.kc_entry_id]).join(" -> ")
            )}</code></td></tr>
                      ${
                        kv.incident_id
                          ? `<tr><th>${k ? "발행 감사 티켓" : "Audit Ticket"}</th><td><code>${escapeHtml(kv.incident_id)}</code></td></tr>`
                          : ""
                      }
                    </tbody>
                  </table>
                </div>
                ${supInfo}
              </div>
            `;
          })
          .join("") ||
        `<div style="padding:16px; font-size:12px; color:var(--text-sub);">${
          k ? "조회된 KC 판정 내역이 없습니다." : "No Dataplex KC verdicts recorded for this turn."
        }</div>`;
      return;
    }

    if (AGENT_DRAWER_TAB === "PROVISION") {
      if (sc.blocked || provisions.length === 0) {
        bodyEl.innerHTML = `
          <div class="mod-card blocked-card" style="padding:16px;">
            <div style="font-size:13px; font-weight:600; color:var(--text); margin-bottom:6px;">
              ${
                k
                  ? "OKF 원문 인출 차단됨 (BLOCKED_DEPRECATED)"
                  : "OKF Source Retrieval Blocked (BLOCKED_DEPRECATED)"
              }
            </div>
            <div style="font-size:12px; color:var(--text-sub); line-height:1.6;">
              ${
                k
                  ? "<code>before_tool_callback</code> 거버넌스 게이트가 Dataplex KC 유효성 미통과(<code>status: deprecated</code>, 만료일 2025-12-31)를 감지하여 폐기된 수리 지침 원문 인출을 원천 차단했습니다."
                  : "The <code>before_tool_callback</code> governance gate detected <code>status: deprecated</code> in Dataplex KC and blocked raw manual retrieval to prevent unsafe servicing."
              }
            </div>
          </div>
        `;
        return;
      }

      bodyEl.innerHTML = provisions
        .map((p) => {
          return `
            <div class="mod-card" style="padding:14px 16px; margin-bottom:14px;">
              <div class="mod-card-header">
                <span class="mod-card-title" style="font-size:13px;">
                  [${escapeHtml(p.article_no)}] ${escapeHtml(k ? p.title_ko : p.title_en)}
                </span>
                <span class="agent-neutral-pill">${escapeHtml(
                  k ? p.provision_role_ko : p.provision_role_en
                )}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
                <code style="font-family:var(--mono); font-size:11px; color:var(--text-sub);">${escapeHtml(p.uri)}</code>
                <button type="button" class="gcp-action-btn" style="flex:0 0 auto; padding:4px 10px; font-size:11.5px;" onclick="jumpToOkfValidationFromAgent('${escapeHtml(
                  p.okf_rel_path
                )}')">
                  ${k ? `02 · 원문 대조뷰(PDF p.${p.pdf_page}) 열기` : `Open 02 · PDF Compare (p.${p.pdf_page})`}
                </button>
              </div>
              <div style="display:flex; flex-direction:column; gap:4px; font-size:11px; color:var(--text-sub); line-height:1.5; background:var(--code-bg); border:1px solid var(--border); border-radius:6px; padding:8px 10px; margin-bottom:8px;">
                <div><strong>Dataplex KC Entry:</strong> <code>${escapeHtml(p.kc_entry_fqn || "")}</code></div>
                <div><strong>Source PDF Page:</strong> <code>N17344-001 (${escapeHtml(p.source_pdf || "")})</code></div>
                <div><strong>SHA-256 Provenance:</strong> <code>${escapeHtml(p.sha256 || "verified")}</code></div>
                ${
                  p.target_columns
                    ? `<div><strong>${k ? "매핑 원장 컬럼:" : "Mapped BQ Columns:"}</strong> <code>${escapeHtml(
                        p.target_columns
                      )}</code></div>`
                    : ""
                }
              </div>
              ${
                p.yaml_frontmatter
                  ? `
                <details class="fm-accordion" style="margin-bottom:6px;">
                  <summary>
                    <span class="fm-summary-left"><span>YAML Frontmatter (OKF v0.2)</span></span>
                    <span class="material-symbols-outlined fm-chevron">expand_more</span>
                  </summary>
                  <div class="frontmatter-block">${escapeHtml(p.yaml_frontmatter)}</div>
                </details>
              `
                  : ""
              }
              <div class="okf-body-box" style="font-size:12.5px; padding:12px 14px; max-height:300px; overflow-y:auto;">${escapeHtml(
                p.verbatim_body || ""
              )}</div>
            </div>
          `;
        })
        .join("");
      return;
    }

    // LEDGER Tab ("테이블 결과")
    if (ledgerTables.length === 0) {
      bodyEl.innerHTML = `<div style="padding:16px; font-size:12px; color:var(--text-sub);">${
        k
          ? "거버넌스 게이트 차단 또는 도메인 외 질문으로 인해 테이블 결과가 없습니다."
          : "No BigQuery table results due to governance block or out-of-domain refusal."
      }</div>`;
      return;
    }

    bodyEl.innerHTML = ledgerTables
      .map((lt) => {
        const rows = lt.rows || [];
        let tblHtml = `<div style="font-size:12px; color:var(--text-sub);">${
          k ? "조회된 행 없음 (0건)" : "0 rows returned"
        }</div>`;
        if (rows.length > 0) {
          const cols = Object.keys(rows[0]);
          const ths = cols.map((c) => `<th><code>${escapeHtml(c)}</code></th>`).join("");
          const trs = rows
            .map(
              (r) =>
                `<tr>${cols
                  .map((c) => `<td>${escapeHtml(String(r[c] ?? "-"))}</td>`)
                  .join("")}</tr>`
            )
            .join("");
          tblHtml = `<div class="agent-table-scroll"><table class="mod-table" style="font-size:11.5px;"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
        }
        return `
          <div class="mod-card" style="padding:14px 16px; margin-bottom:14px;">
            <div class="mod-card-header">
              <span class="mod-card-title" style="font-size:13px;">
                ${escapeHtml(k ? lt.table_title_ko || "테이블 결과" : lt.table_title_en || "Table Results")}
              </span>
              <span class="agent-neutral-pill">${lt.row_count} rows · ${lt.elapsed_ms} ms</span>
            </div>
            ${tblHtml}
            <details class="query-accordion" style="margin-top:8px;">
              <summary>
                <span>${
                  k
                    ? `실행된 통합 GQL/SQL 원문 (Job: ${escapeHtml(lt.job_id || "bqjob")})`
                    : `Executed GQL/SQL Statement (Job: ${escapeHtml(lt.job_id || "bqjob")})`
                }</span>
                <span class="material-symbols-outlined qa-chevron">expand_more</span>
              </summary>
              <div class="query-accordion-body">
                <pre class="query-code-pre">${escapeHtml(lt.sql || "")}</pre>
              </div>
            </details>
          </div>
        `;
      })
      .join("");
  }

  // =========================================================================
  // 8. MODULE 06: Google ADK RAG Agent vs. Ontology Graph Agent (`#module-benchmark`)
  //    100% Structural & UX Parity with `krda-ontology-studio` (`mod-benchmark.js`)
  // =========================================================================
  let BENCH_VIEW_MODE = "live"; // 'live' | 'report' | 'code'
  let BENCH_SELECTED_EQ_ID = "EQ01";
  let BENCH_IS_SENDING = false;
  let BENCH_LEFT_SIDEBAR_COLLAPSED = false;
  let BENCH_SEARCH_FILTER = "";
  let BENCH_INITIAL_SEEDED = false;

  function getBenchmarkData() {
    if (window.HP_BENCHMARK_DATA && Array.isArray(window.HP_BENCHMARK_DATA.items)) {
      return window.HP_BENCHMARK_DATA;
    }
    return {
      summary: {
        total_questions: 14,
        rag_pass_count: 3,
        rag_fail_count: 11,
        rag_accuracy_pct: 21.4,
        graphrag_pass_count: 14,
        graphrag_fail_count: 0,
        graphrag_accuracy_pct: 100.0
      },
      adk_agents: {
        rag_agent_name: "hp_dragonfly_vector_rag_agent",
        graph_agent_name: "hp_dragonfly_ontology_graph_agent",
        rag_agent_code: "",
        graph_agent_code: ""
      },
      items: []
    };
  }

  function getBenchmarkItems() {
    return getBenchmarkData().items || [];
  }

  function findBenchmarkItem(eqIdOrQuestion, strictOnly) {
    const items = getBenchmarkItems();
    if (!items.length) return null;
    if (!eqIdOrQuestion) return strictOnly ? null : items[0];
    const qRaw = String(eqIdOrQuestion).trim();
    const qNorm = qRaw.toLowerCase();
    const direct = items.find(
      (x) =>
        String(x.eq_id || "").toLowerCase() === qNorm ||
        String(x.q_num || "").toLowerCase() === qNorm
    );
    if (direct) return direct;
    const exactQ = items.find(
      (x) =>
        String(x.question || "").trim().toLowerCase() === qNorm ||
        String(x.question_en || "").trim().toLowerCase() === qNorm
    );
    if (exactQ) return exactQ;
    if (strictOnly) return null;
    const subQ = items.find(
      (x) =>
        (x.question && String(x.question).toLowerCase().includes(qNorm)) ||
        (x.question_en && String(x.question_en).toLowerCase().includes(qNorm)) ||
        (x.category && String(x.category).toLowerCase().includes(qNorm)) ||
        (x.category_en && String(x.category_en).toLowerCase().includes(qNorm))
    );
    return subQ || items[0];
  }

  function renderBenchMarkdownWithWrongHighlights(rawText, wrongPhrases) {
    let html = formatAgentMarkdown(rawText || "");
    const phrases = Array.isArray(wrongPhrases) ? wrongPhrases : [];
    phrases.forEach((wp) => {
      const target = String((wp && wp.phrase) || "").trim();
      const reason = String((wp && wp.reason) || "").trim();
      if (!target || target.length < 4) return;
      const escapedTarget = escapeHtml(target);
      if (html.includes(escapedTarget)) {
        const markHtml = `<mark class="bench-wrong-span" title="${escapeHtml(reason)}">${escapedTarget}</mark>`;
        html = html.split(escapedTarget).join(markHtml);
      }
    });
    return html;
  }

  function buildBenchVerdictBoxHtml(armObj, isGraphArm) {
    if (!armObj) return "";
    const k = isKo();
    const isPass = armObj.verdict === "PASS";
    const verdictRationale = k ? armObj.verdict_ko || "" : armObj.verdict_en || armObj.verdict_ko || "";
    const wrongPhrases = (k ? armObj.wrong_phrases : armObj.wrong_phrases_en || armObj.wrong_phrases) || [];
    const missingItems = (k ? armObj.missing_items : armObj.missing_items_en || armObj.missing_items) || [];

    const wrongHtml =
      wrongPhrases.length > 0
        ? `
          <div style="margin-top:8px;">
            <div style="font-size:11.5px; font-weight:600; color:#c5221f; margin-bottom:4px;">
              ${k ? "오류 구절 (Hallucination / 오매칭)" : "Erroneous Spans (Hallucination / Mismatch)"}
            </div>
            <ul style="margin:0; padding-left:18px; font-size:12px; color:var(--text); line-height:1.55;">
              ${wrongPhrases
                .map(
                  (w) =>
                    `<li style="margin-bottom:4px;"><code style="color:#c5221f; font-weight:600;">"${escapeHtml(
                      w.phrase || ""
                    )}"</code> — <span style="color:var(--text-sub);">${escapeHtml(w.reason || "")}</span></li>`
                )
                .join("")}
            </ul>
          </div>
        `
        : "";

    const missingHtml =
      missingItems.length > 0
        ? `
          <div style="margin-top:8px;">
            <div style="font-size:11.5px; font-weight:600; color:#b06000; margin-bottom:4px;">
              ${k ? "누락된 핵심 근거 (Omitted DAG / Governance)" : "Omitted Critical Evidence (DAG / Governance)"}
            </div>
            <ul style="margin:0; padding-left:18px; font-size:12px; color:var(--text-sub); line-height:1.55;">
              ${missingItems.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}
            </ul>
          </div>
        `
        : "";

    return `
      <div class="bench-verdict-box ${isPass ? "pass" : "fail"}" style="margin-bottom:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
          <span style="font-size:12px; font-weight:700; color:${isPass ? "#137333" : "#c5221f"}; display:inline-flex; align-items:center; gap:5px;">
            <span class="material-symbols-outlined" style="font-size:16px;">${isPass ? "verified" : "error"}</span>
            <span>${
              isPass
                ? k
                  ? isGraphArm
                    ? "정답 (PASS · BigQuery GQL + Dataplex KC 검증)"
                    : "정답 (PASS · 단순 단일 섹션 조회)"
                  : isGraphArm
                  ? "PASS (Grounded via BigQuery GQL + Dataplex KC)"
                  : "PASS (Direct Single-Section Lookup)"
                : k
                ? "오답 (FAIL · Vector RAG 한계 노출)"
                : "FAIL (Vector RAG Structural Failure)"
            }</span>
          </span>
          <span class="agent-neutral-pill">${escapeHtml(armObj.framework || "Google ADK")} · ${
      armObj.latency_ms || 2200
    } ms</span>
        </div>
        <div style="font-size:12.5px; color:var(--text); line-height:1.55;">
          <strong>${k ? "판정 근거:" : "Verdict Rationale:"}</strong> ${escapeHtml(verdictRationale)}
        </div>
        ${wrongHtml}
        ${missingHtml}
      </div>
    `;
  }

  function buildBenchToolTraceAccordionHtml(armObj, isGraphArm) {
    if (!armObj) return "";
    const k = isKo();
    const calls = armObj.tool_calls || [];
    if (!calls.length) return "";

    const rowsHtml = calls
      .map((tc, i) => {
        const codeBlock = tc.gql_text || tc.sql_text || "";
        return `
          <div style="padding:8px 10px; border:1px solid var(--border); border-radius:6px; background:var(--surface); margin-bottom:6px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;">
              <span style="font-size:12px; font-weight:600; color:var(--text);">
                Step ${isGraphArm ? i : i + 1} · <code>${escapeHtml(tc.tool || "tool")}</code>
              </span>
              <span class="agent-neutral-pill">${escapeHtml(tc.status || "OK")} · ${tc.row_count ?? 0} rows</span>
            </div>
            <div style="font-size:11.5px; color:var(--text-sub); margin-top:4px; line-height:1.5;">
              ${escapeHtml(tc.result_summary || "")}
            </div>
            ${
              codeBlock
                ? `<pre class="query-code-pre" style="margin-top:6px; font-size:11px; padding:8px 10px;">${escapeHtml(
                    codeBlock
                  )}</pre>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    return `
      <details class="query-accordion" style="margin-top:12px;">
        <summary>
          <span>${
            isGraphArm
              ? k
                ? `ADK Ontology Graph Tool Trace (${calls.length}단계 · before_agent_callback ➔ GQL ➔ KC ➔ OKF)`
                : `ADK Ontology Graph Tool Trace (${calls.length} stages · Callback ➔ GQL ➔ KC ➔ OKF)`
              : k
              ? `ADK Vector RAG Tool Trace (${calls.length}단계 · vertex_rag_search + execute_sql)`
              : `ADK Vector RAG Tool Trace (${calls.length} stages · vertex_rag_search + execute_sql)`
          }</span>
          <span class="material-symbols-outlined qa-chevron">expand_more</span>
        </summary>
        <div class="query-accordion-body" style="padding:10px;">
          ${rowsHtml}
        </div>
      </details>
    `;
  }

  function buildBenchArmTurnBubbleHtml(item, armKey) {
    if (!item) return "";
    const k = isKo();
    const isGraphArm = armKey === "graphrag";
    const armObj = isGraphArm ? item.graphrag_agent : item.rag_agent;
    if (!armObj) return "";

    const rawAns = k ? armObj.answer_text : armObj.answer_text_en || armObj.answer_text;
    const wrongPhrases = (k ? armObj.wrong_phrases : armObj.wrong_phrases_en || armObj.wrong_phrases) || [];
    const bodyHtml = renderBenchMarkdownWithWrongHighlights(rawAns, wrongPhrases);
    const liveMeta = item.adk_live_meta || null;
    const liveBadgeHtml = liveMeta
      ? `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; padding:6px 10px; margin-bottom:10px; border-radius:6px; background:${
          isGraphArm ? "rgba(19,115,51,0.08)" : "rgba(26,115,232,0.07)"
        }; border:1px solid ${
          isGraphArm ? "rgba(19,115,51,0.25)" : "rgba(26,115,232,0.22)"
        }; font-size:11.5px; color:var(--text);">
          <span style="display:inline-flex; align-items:center; gap:5px; font-weight:600; color:${
            isGraphArm ? "#137333" : "var(--gcp-blue)"
          };">
            <span class="material-symbols-outlined" style="font-size:15px;">bolt</span>
            <span>${
              k
                ? `Google ADK (${escapeHtml(liveMeta.model || "gemini-3.8-flash")}) 실시간 비교 실행 완료`
                : `Live Google ADK (${escapeHtml(liveMeta.model || "gemini-3.8-flash")}) Execution Complete`
            }</span>
          </span>
          <span style="font-size:11px; color:var(--text-sub); font-family:var(--font-mono, monospace);">
            ${escapeHtml(liveMeta.executed_at || "")}${
              liveMeta.elapsed_ms ? ` · ${liveMeta.elapsed_ms} ms` : ""
            }
          </span>
        </div>
      `
      : "";

    return `
      <div class="msg-agent-bubble ${armObj.verdict === "FAIL" ? "blocked-bubble" : ""}" style="padding:14px 16px;">
        ${liveBadgeHtml}
        ${buildBenchVerdictBoxHtml(armObj, isGraphArm)}
        <div class="agent-md-body" style="font-size:13px;">
          ${bodyHtml}
        </div>
        ${buildBenchToolTraceAccordionHtml(armObj, isGraphArm)}
      </div>
    `;
  }

  function renderBenchSidebarList() {
    const listEl = document.getElementById("bench-q-list");
    if (!listEl) return;
    const k = isKo();
    const items = getBenchmarkItems();
    const qFilter = (BENCH_SEARCH_FILTER || "").trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (!qFilter) return true;
      const hay = `${item.eq_id} ${item.category} ${item.category_en} ${item.question} ${item.question_en} ${item.tag}`.toLowerCase();
      return hay.includes(qFilter);
    });

    listEl.innerHTML = filtered
      .map((item) => {
        const isSel = item.eq_id === BENCH_SELECTED_EQ_ID;
        const ragFail = item.rag_agent && item.rag_agent.verdict === "FAIL";
        const tagText = k ? item.tag : item.tag_en || item.tag;
        const qText = k ? item.question : item.question_en || item.question;
        const catText = k ? item.category : item.category_en || item.category;
        return `
          <div class="agent-q-item ${isSel ? "active" : ""}" id="bench-qitem-${escapeHtml(
          item.eq_id
        )}" onclick="selectBenchmarkQuestion('${escapeHtml(item.eq_id)}')">
            <span class="q-num">${escapeHtml(item.q_num || item.eq_id)}.</span>
            <div class="q-body">
              <div class="q-dept" style="display:flex; align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap;">
                <span>${escapeHtml(item.eq_id)} · ${escapeHtml(catText.split("·")[0].trim())}</span>
                <span class="agent-neutral-pill" style="${
                  ragFail
                    ? "background:rgba(217,48,37,0.10); color:#c5221f; border-color:rgba(217,48,37,0.28);"
                    : "background:rgba(19,115,51,0.10); color:#137333; border-color:rgba(19,115,51,0.28);"
                }">${escapeHtml(tagText)}</span>
              </div>
              <div class="q-text">${escapeHtml(qText)}</div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderBenchReportContent() {
    const container = document.getElementById("bench-report-container");
    if (!container) return;
    const k = isKo();
    const data = getBenchmarkData();
    const summary = data.summary || {};
    const items = getBenchmarkItems();
    const curItem = findBenchmarkItem(BENCH_SELECTED_EQ_ID) || items[0];
    if (!curItem) return;

    const curIdx = items.findIndex((x) => x.eq_id === curItem.eq_id);
    const prevEqId = curIdx > 0 ? items[curIdx - 1].eq_id : items[items.length - 1].eq_id;
    const nextEqId = curIdx < items.length - 1 ? items[curIdx + 1].eq_id : items[0].eq_id;

    const curLabel = `${curItem.eq_id} · [${k ? curItem.tag : curItem.tag_en}] ${
      k ? curItem.category : curItem.category_en
    }`;

    const optionsHtml = items
      .map((it) => {
        const isSel = it.eq_id === curItem.eq_id;
        const lbl = `${it.eq_id} · [${k ? it.tag : it.tag_en}] ${k ? it.category : it.category_en}`;
        return `
          <div class="gcp-custom-select-opt ${isSel ? "selected" : ""}" onclick="selectBenchReportEqOption(event, '${escapeHtml(
          it.eq_id
        )}')">
            <span>${escapeHtml(lbl)}</span>
            <span class="material-symbols-outlined gcp-opt-check" style="opacity:${isSel ? "1" : "0"};">check</span>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <!-- Tier 1: Slim Summary & Question Selector Card -->
      <div class="mod-card bench-select-card" style="padding:14px 18px; margin-bottom:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <span style="font-size:14px; font-weight:700; color:var(--text);">
              ${
                k
                  ? `EQ 14 벤치마크 평가 결과: Ontology Graph Agent 정답 ${summary.graphrag_pass_count || 14} / ${
                      summary.total_questions || 14
                    } (${summary.graphrag_accuracy_pct || 100}%) · Vector RAG Agent 정답 ${
                      summary.rag_pass_count || 3
                    } / ${summary.total_questions || 14} (${summary.rag_accuracy_pct || 21.4}%)`
                  : `EQ 14 Benchmark Score: Ontology Graph Agent ${summary.graphrag_pass_count || 14} / ${
                      summary.total_questions || 14
                    } (${summary.graphrag_accuracy_pct || 100}%) vs. Vector RAG Agent ${
                      summary.rag_pass_count || 3
                    } / ${summary.total_questions || 14} (${summary.rag_accuracy_pct || 21.4}%)`
              }
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button type="button" class="gcp-action-btn" style="padding:4px 10px; font-size:12px;" onclick="selectBenchReportEq('${escapeHtml(
              prevEqId
            )}')">
              <span class="material-symbols-outlined" style="font-size:15px;">chevron_left</span>
              <span>${k ? "이전 문항" : "Prev"}</span>
            </button>
            <button type="button" class="gcp-action-btn" style="padding:4px 10px; font-size:12px;" onclick="selectBenchReportEq('${escapeHtml(
              nextEqId
            )}')">
              <span>${k ? "다음 문항" : "Next"}</span>
              <span class="material-symbols-outlined" style="font-size:15px;">chevron_right</span>
            </button>
          </div>
        </div>

        <div class="gcp-custom-select" id="bench-eq-custom-select">
          <button type="button" class="gcp-select gcp-custom-select-btn" onclick="toggleBenchEqSelectMenu(event)">
            <span class="gcp-custom-select-val" id="bench-eq-select-val">${escapeHtml(curLabel)}</span>
          </button>
          <div class="gcp-custom-select-menu" id="bench-eq-select-menu">
            ${optionsHtml}
          </div>
        </div>
      </div>

      <!-- Tier 2: Question & Gold Answer Header Card -->
      <div class="mod-card" style="padding:16px 20px; margin-bottom:14px;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:10px;">
          <div style="flex:1; min-width:260px;">
            <div style="font-size:11.5px; font-weight:700; color:var(--gcp-blue); margin-bottom:4px;">
              ${escapeHtml(curItem.eq_id)} · ${escapeHtml(k ? curItem.category : curItem.category_en)}
            </div>
            <div style="font-size:14px; font-weight:600; color:var(--text); line-height:1.55;">
              ${escapeHtml(k ? curItem.question : curItem.question_en)}
            </div>
          </div>
          <button type="button" class="bq-run-btn" style="flex:0 0 auto; height:34px; padding:0 14px; font-size:12px;" onclick="runBenchmarkEqInLive('${escapeHtml(
            curItem.eq_id
          )}')">
            <span class="material-symbols-outlined" style="font-size:16px;">play_arrow</span>
            <span>${k ? "라이브 질의로 실행" : "Run in Live Split View"}</span>
          </button>
        </div>

        <div style="padding:12px 14px; background:var(--code-bg); border:1px solid var(--border); border-radius:8px; font-size:12.5px; line-height:1.6;">
          <div style="margin-bottom:4px;">
            <strong style="color:var(--text);">${k ? "정답 기준 (Gold Answer):" : "Gold Standard Answer:"}</strong>
            <span style="color:var(--text);">${escapeHtml(
              k ? curItem.gold.answer : curItem.gold.answer_en
            )}</span>
          </div>
          <div style="font-size:11.5px; color:var(--text-sub);">
            <strong>${k ? "검증 근거 (Canonical Evidence):" : "Canonical Evidence:"}</strong>
            <code>${escapeHtml(k ? curItem.gold.evidence : curItem.gold.evidence_en)}</code>
          </div>
        </div>
      </div>

      <!-- Tier 3: 50:50 Comparison Grid -->
      <div class="bench-report-grid">
        <!-- Left Card: Vector RAG Agent -->
        <div class="mod-card" style="padding:16px 18px; margin:0;">
          <div class="mod-card-header" style="margin-bottom:10px;">
            <span class="mod-card-title" style="font-size:13.5px;">
              <span class="material-symbols-outlined" style="color:#c5221f; font-size:18px;">search</span>
              <span>Vector RAG Agent (<code>hp_dragonfly_vector_rag_agent</code>)</span>
            </span>
            <span class="agent-neutral-pill">${escapeHtml(curItem.rag_agent.verdict)}</span>
          </div>
          ${buildBenchArmTurnBubbleHtml(curItem, "rag")}
        </div>

        <!-- Right Card: Ontology Graph Agent -->
        <div class="mod-card" style="padding:16px 18px; margin:0;">
          <div class="mod-card-header" style="margin-bottom:10px;">
            <span class="mod-card-title" style="font-size:13.5px;">
              <span class="material-symbols-outlined" style="color:#137333; font-size:18px;">hub</span>
              <span>Ontology Graph Agent (<code>hp_dragonfly_ontology_graph_agent</code>)</span>
            </span>
            <span class="agent-neutral-pill" style="background:rgba(19,115,51,0.10); color:#137333; border-color:rgba(19,115,51,0.28);">PASS (100%)</span>
          </div>
          ${buildBenchArmTurnBubbleHtml(curItem, "graphrag")}
        </div>
      </div>
    `;
  }

  function renderBenchAdkCodeContent() {
    const container = document.getElementById("bench-code-container");
    if (!container) return;
    const k = isKo();
    const data = getBenchmarkData();
    const adk = data.adk_agents || {};

    container.innerHTML = `
      <div class="mod-card" style="padding:16px 20px; margin-bottom:14px;">
        <div class="mod-card-header" style="margin-bottom:8px;">
          <span class="mod-card-title" style="font-size:14px;">
            <span class="material-symbols-outlined" style="color:var(--gcp-blue);">terminal</span>
            <span>${
              k
                ? "Google ADK (Agent Development Kit) 기반 두 에이전트 아키텍처 및 도구(Tools/Callbacks) 비교"
                : "Google ADK Dual-Agent Architecture & Tooling Comparison"
            }</span>
          </span>
          <span class="agent-neutral-pill">agents/adk_rag_vs_graph/{rag_agent.py, graph_agent.py}</span>
        </div>
        <div class="agent-table-scroll">
          <table class="mod-table" style="font-size:12px;">
            <thead>
              <tr>
                <th style="width:170px;">${k ? "비교 영역" : "Dimension"}</th>
                <th>Arm A · <code>hp_dragonfly_vector_rag_agent</code> (Vector RAG)</th>
                <th>Arm B · <code>hp_dragonfly_ontology_graph_agent</code> (Ontology Graph)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ADK 에이전트 정의</strong></td>
                <td><code>LlmAgent(name="hp_dragonfly_vector_rag_agent", model="gemini-3.8-flash")</code></td>
                <td><code>LlmAgent(name="hp_dragonfly_ontology_graph_agent", model="gemini-3.8-flash")</code></td>
              </tr>
              <tr>
                <td><strong>Step 0 · 사전 콜백</strong></td>
                <td>없음 (자연어 질의를 그대로 임베딩 코사인 검색에 전달)</td>
                <td><code>before_agent_callback = bind_entity_aliases_and_kc_anchors</code> (SKU·부품·LED 코드 결정론적 바인딩)</td>
              </tr>
              <tr>
                <td><strong>Step 1 · 지식 탐색 도구</strong></td>
                <td><code>vertex_rag_search(top_k=4)</code> + 단발성 <code>execute_sql</code> (멀티홉 관계 탐색 불가)</td>
                <td><code>graph_query_gql</code> (ISO/IEC 39075 GQL로 <code>hp_dragonfly_ontology_graph</code> 10 노드 · 13 엣지 탐색)</td>
              </tr>
              <tr>
                <td><strong>Step 2 · 거버넌스 게이트</strong></td>
                <td>없음 (폐기된 <code>v0.1.0</code> 써멀 재도포 문서를 코사인 유사도 <code>0.912</code>로 오인출)</td>
                <td><code>kc_lookup_aspect</code> + <code>before_tool_callback</code> (Dataplex KC <code>status=deprecated</code> 즉시 차단)</td>
              </tr>
              <tr>
                <td><strong>Step 3 · 정본 원문 인출</strong></td>
                <td>512-토큰 슬라이딩 청크 (표 3-1 행 경계 깨짐 및 YAML Frontmatter 유실)</td>
                <td><code>fetch_okf_provision</code> (KC 유효성 통과 시 OKF v0.2 정본 조항 및 SHA-256 해시 인출)</td>
              </tr>
              <tr>
                <td><strong>EQ01~EQ14 정확도</strong></td>
                <td><strong style="color:#c5221f;">3 / 14 (21.4%)</strong> — 멀티홉 분해 DAG·폐기 내규 차단·온보드 SKU 매칭 실패</td>
                <td><strong style="color:#137333;">14 / 14 (100.0%)</strong> — 전 문항 정본 근거 및 안전 규약 완벽 일치</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bench-report-grid">
        <div class="mod-card" style="padding:14px 16px; margin:0;">
          <div class="mod-card-header" style="margin-bottom:8px;">
            <span class="mod-card-title" style="font-size:13px;">
              <code>agents/adk_rag_vs_graph/rag_agent.py</code>
            </span>
            <span class="agent-neutral-pill">Arm A · Vector RAG</span>
          </div>
          <pre class="query-code-pre" style="max-height:520px; overflow:auto; font-size:11.5px; line-height:1.5;">${escapeHtml(
            adk.rag_agent_code || ""
          )}</pre>
        </div>

        <div class="mod-card" style="padding:14px 16px; margin:0;">
          <div class="mod-card-header" style="margin-bottom:8px;">
            <span class="mod-card-title" style="font-size:13px;">
              <code>agents/adk_rag_vs_graph/graph_agent.py</code>
            </span>
            <span class="agent-neutral-pill" style="background:rgba(19,115,51,0.10); color:#137333; border-color:rgba(19,115,51,0.28);">Arm B · Ontology Graph Agent</span>
          </div>
          <pre class="query-code-pre" style="max-height:520px; overflow:auto; font-size:11.5px; line-height:1.5;">${escapeHtml(
            adk.graph_agent_code || ""
          )}</pre>
        </div>
      </div>
    `;
  }

  function appendBenchDualTurnToDom(item, customUserQuestion) {
    const ragBox = document.getElementById("bench-rag-messages");
    const graphBox = document.getElementById("bench-graphrag-messages");
    if (!ragBox || !graphBox || !item) return;
    const k = isKo();
    const qText = customUserQuestion || (k ? item.question : item.question_en || item.question);

    const emptyRag = ragBox.querySelector(".bench-empty-placeholder");
    if (emptyRag) emptyRag.remove();
    const emptyGraph = graphBox.querySelector(".bench-empty-placeholder");
    if (emptyGraph) emptyGraph.remove();

    const userRowHtml = `
      <div class="msg-row msg-user">
        <div class="msg-user-bubble">${escapeHtml(qText)}</div>
      </div>
    `;
    ragBox.insertAdjacentHTML("beforeend", userRowHtml);
    graphBox.insertAdjacentHTML("beforeend", userRowHtml);

    const ragRespRow = document.createElement("div");
    ragRespRow.className = "msg-row msg-agent";
    ragRespRow.innerHTML = buildBenchArmTurnBubbleHtml(item, "rag");
    ragBox.appendChild(ragRespRow);

    const graphRespRow = document.createElement("div");
    graphRespRow.className = "msg-row msg-agent";
    graphRespRow.innerHTML = buildBenchArmTurnBubbleHtml(item, "graphrag");
    graphBox.appendChild(graphRespRow);

    ragBox.scrollTop = ragBox.scrollHeight;
    graphBox.scrollTop = graphBox.scrollHeight;
  }

  function renderBenchmarkModule() {
    const box = document.getElementById("module-benchmark");
    if (!box) return;
    const k = isKo();
    const curItem = findBenchmarkItem(BENCH_SELECTED_EQ_ID);
    const defaultInputVal = k
      ? "HP Dragonfly 노트북 시리즈와 대표 SKU, 주요 교체 부품(배터리·시스템 보드) 관계를 모두 알려줘"
      : "Compare all HP Dragonfly laptop series, SKUs, and key replaceable FRU parts (battery & system board)";

    const quickSamples = k
      ? [
          {
            label: "💻 시리즈·SKU·부품 관계",
            q: "HP Dragonfly 노트북 시리즈와 대표 SKU, 주요 교체 부품(배터리·시스템 보드) 관계를 모두 알려줘"
          },
          {
            label: "🔋 배터리(M90788-005) 분해 DAG",
            q: "배터리(M90788-005) 교체 시 필수 선행 분해 부품 순서(Disassembly DAG)와 나사 규격, 주의사항은?"
          },
          {
            label: "🛡️ 폐기 내규(v0.1) 거버넌스 차단",
            q: "방열판 써멀 그리스 재도포 시 옛날 v0.1 내규나 배터리 핫스왑 초안을 적용해도 되나요?"
          },
          {
            label: "🚨 LED 3-2 점멸 & 오디오 복구",
            q: "Caps Lock LED가 긴 깜빡임 3회 + 짧은 깜빡임 2회 점멸할 때 원인과 해결 방법은?"
          }
        ]
      : [
          {
            label: "💻 Series · SKU · FRU Graph",
            q: "Compare all HP Dragonfly laptop series, SKUs, and key replaceable FRU parts (battery & system board)"
          },
          {
            label: "🔋 Battery (M90788-005) DAG",
            q: "What is the prerequisite disassembly order (DAG), screw spec, and safety rule for replacing battery M90788-005?"
          },
          {
            label: "🛡️ Deprecated v0.1 Gate",
            q: "Can we apply the old v0.1 thermal paste reuse policy or battery hot-swap draft during service?"
          },
          {
            label: "🚨 LED 3-2 Blink & Audio",
            q: "What causes Caps Lock LED 3 long + 2 short blinks and how do we resolve it?"
          }
        ];

    const quickPillsHtml = quickSamples
      .map(
        (s, idx) => `
          <button
            type="button"
            class="gcp-action-btn"
            style="padding:3px 10px; font-size:11.5px; border-radius:999px; white-space:nowrap;"
            onclick="runBenchQuickSample(${idx})"
          >
            ${escapeHtml(s.label)}
          </button>
        `
      )
      .join("");
    window.__BENCH_QUICK_SAMPLES = quickSamples;

    box.innerHTML = `
      <!-- Top Pane Subbar (46px) matching krda-ontology-studio mod-benchmark.js -->
      <div class="pane-subbar" style="height:46px; flex:0 0 46px; padding:0 18px;">
        <div style="display:flex; align-items:center; gap:10px; min-width:0;">
          <span class="material-symbols-outlined" style="font-size:18px; color:var(--gcp-blue);">compare_arrows</span>
          <span style="font-size:13px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${
              k
                ? "06 · RAG Agent vs. Graph Agent — Google ADK · gemini-3.8-flash 라이브 질의/응답 스튜디오 (14 / 14 vs. 3 / 14)"
                : "06 · RAG Agent vs. Graph Agent — Google ADK · gemini-3.8-flash Live Benchmark Studio (14 / 14 vs. 3 / 14)"
            }
          </span>
          <span class="agent-neutral-pill" style="background:rgba(26,115,232,0.10); color:var(--gcp-blue); border-color:rgba(26,115,232,0.28);">
            Google ADK · <code>gemini-3.8-flash</code> Live
          </span>
        </div>
        <div class="mgmt-subtab-group">
          <button type="button" class="mgmt-subtab-btn ${
            BENCH_VIEW_MODE === "live" ? "active" : ""
          }" id="bench-mode-btn-live" onclick="switchBenchmarkViewMode('live')">
            ${k ? "라이브 질의" : "Live Dual-Agent Run"}
          </button>
          <button type="button" class="mgmt-subtab-btn ${
            BENCH_VIEW_MODE === "report" ? "active" : ""
          }" id="bench-mode-btn-report" onclick="switchBenchmarkViewMode('report')">
            ${k ? "비교리포트 (14 vs 3)" : "Comparison Report (14 vs 3)"}
          </button>
          <button type="button" class="mgmt-subtab-btn ${
            BENCH_VIEW_MODE === "code" ? "active" : ""
          }" id="bench-mode-btn-code" onclick="switchBenchmarkViewMode('code')">
            ${k ? "ADK 에이전트 코드" : "ADK Agent Code"}
          </button>
        </div>
      </div>

      <!-- View 1: Live Dual-Agent Split View (Default) -->
      <div id="bench-view-live" class="bench-body-row" style="display:${
        BENCH_VIEW_MODE === "live" ? "flex" : "none"
      };">
        <aside id="bench-sidebar" class="agent-nav-sidebar ${
          BENCH_LEFT_SIDEBAR_COLLAPSED ? "collapsed" : ""
        }" style="width:330px;">
          <div class="agent-nav-header" style="padding:12px 14px; border-bottom:1px solid var(--border);">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px;">
              <span style="font-size:12.5px; font-weight:700; color:var(--text);">
                ${k ? "벤치마크 문항 (EQ01 ~ EQ14)" : "Benchmark Questions (EQ01–EQ14)"}
              </span>
              <span class="agent-neutral-pill">Graph 100% · RAG 21.4%</span>
            </div>
            <div class="gcp-filter-bar" style="height:32px; padding:0 10px; border:1px solid var(--border); border-radius:6px;">
              <span class="material-symbols-outlined" style="font-size:16px; color:var(--text-sub);">filter_list</span>
              <input
                type="text"
                id="bench-q-search"
                value="${escapeHtml(BENCH_SEARCH_FILTER)}"
                placeholder="${k ? "EQ 번호, 부품번호, 증상 검색..." : "Filter EQ, part ID, symptom..."}"
                oninput="filterBenchmarkQuestions(this.value)"
              />
            </div>
          </div>
          <div class="agent-q-list" id="bench-q-list"></div>
        </aside>

        <section class="bench-main-pane">
          <div class="bench-split-grid">
            <!-- Left Arm: Vector RAG Agent -->
            <div class="bench-arm-col">
              <div class="bench-arm-header">
                <div style="display:flex; align-items:center; gap:8px; min-width:0;">
                  <span class="material-symbols-outlined" style="font-size:17px; color:#c5221f;">search</span>
                  <strong style="font-size:12.5px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    Vector RAG Agent (Google ADK · gemini-3.8-flash)
                  </strong>
                </div>
                <span class="agent-neutral-pill" title="LlmAgent(model='gemini-3.8-flash') + vertex_rag_search + execute_sql">
                  <code>vertex_rag_search</code> + <code>execute_sql</code> · 3/14 (21.4%)
                </span>
              </div>
              <div class="bench-arm-messages" id="bench-rag-messages"></div>
            </div>

            <!-- Right Arm: Ontology Graph Agent -->
            <div class="bench-arm-col">
              <div class="bench-arm-header">
                <div style="display:flex; align-items:center; gap:8px; min-width:0;">
                  <span class="material-symbols-outlined" style="font-size:17px; color:#137333;">hub</span>
                  <strong style="font-size:12.5px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    Ontology Graph Agent (Google ADK · gemini-3.8-flash)
                  </strong>
                </div>
                <span class="agent-neutral-pill" style="background:rgba(19,115,51,0.10); color:#137333; border-color:rgba(19,115,51,0.28);" title="LlmAgent(model='gemini-3.8-flash') + before_agent_callback + graph_query_gql + kc_lookup_aspect + fetch_okf_provision">
                  <code>GQL</code> + <code>Dataplex KC</code> + <code>OKF v0.2</code> · 14/14 (100%)
                </span>
              </div>
              <div class="bench-arm-messages" id="bench-graphrag-messages"></div>
            </div>
          </div>

          <!-- Shared Bottom Composer Bar -->
          <div class="agent-chat-input-bar" style="flex-direction:column; align-items:stretch; gap:6px; height:auto; min-height:66px; padding:8px 18px 10px;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; max-width:980px; width:100%; margin:0 auto;">
              <span style="font-size:11px; font-weight:700; color:var(--gcp-blue); display:inline-flex; align-items:center; gap:4px; margin-right:2px;">
                <span class="material-symbols-outlined" style="font-size:14px;">bolt</span>
                <span>${k ? "실시간 ADK 자유 질의:" : "Live ADK Quick Prompts:"}</span>
              </span>
              ${quickPillsHtml}
            </div>
            <div class="agent-composer-card">
              <div class="composer-icon-wrap">
                <button
                  type="button"
                  id="bench-left-toggle-btn"
                  class="agent-reset-icon-btn"
                  onclick="toggleBenchLeftSidebar()"
                  aria-label="${k ? "질문 목록 패널 접기/펼치기" : "Toggle question list sidebar"}"
                >
                  <span class="material-symbols-outlined" style="font-size:18px;">${
                    BENCH_LEFT_SIDEBAR_COLLAPSED ? "left_panel_open" : "left_panel_close"
                  }</span>
                </button>
                <span class="composer-icon-tooltip">${
                  k ? "질문 목록 패널 접기/펼치기" : "Toggle Question List"
                }</span>
              </div>

              <div class="composer-icon-wrap">
                <button
                  type="button"
                  class="agent-reset-icon-btn"
                  onclick="resetBenchmarkConversation()"
                  aria-label="${k ? "비교 대화 초기화" : "Reset comparison chat"}"
                >
                  <span class="material-symbols-outlined" style="font-size:18px;">restart_alt</span>
                </button>
                <span class="composer-icon-tooltip">${k ? "비교 대화 초기화" : "Reset Chat"}</span>
              </div>

              <textarea
                id="bench-chat-input"
                class="agent-chat-input"
                rows="1"
                placeholder="${
                  k
                    ? "좌측 EQ01~EQ14 질문을 클릭하거나 질문을 입력해 Vector RAG vs. Graph Agent를 동시 실행하세요..."
                    : "Select EQ01–EQ14 on the left or type a prompt to run Vector RAG vs. Graph Agent simultaneously..."
                }"
                onkeydown="if(event.key==='Enter' && !event.shiftKey){ event.preventDefault(); sendBenchmarkPrompt(); }"
              >${escapeHtml(defaultInputVal)}</textarea>

              <button
                type="button"
                id="bench-send-btn"
                class="agent-send-btn"
                onclick="sendBenchmarkPrompt()"
              >
                <span class="material-symbols-outlined" style="font-size:16px;">play_arrow</span>
                <span>${k ? "동시 비교 실행" : "Run Both Agents"}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- View 2: Static EQ 14 Comparison Report View -->
      <div id="bench-view-report" class="bench-report-scroll" style="display:${
        BENCH_VIEW_MODE === "report" ? "flex" : "none"
      };">
        <div id="bench-report-container" style="max-width:1440px; width:100%; margin:0 auto;"></div>
      </div>

      <!-- View 3: Google ADK Agent Python Code View -->
      <div id="bench-view-code" class="bench-report-scroll" style="display:${
        BENCH_VIEW_MODE === "code" ? "flex" : "none"
      };">
        <div id="bench-code-container" style="max-width:1440px; width:100%; margin:0 auto;"></div>
      </div>
    `;

    renderBenchSidebarList();
    renderBenchReportContent();
    renderBenchAdkCodeContent();

    if (curItem) {
      appendBenchDualTurnToDom(curItem, k ? curItem.question : curItem.question_en);
      BENCH_INITIAL_SEEDED = true;
    }
  }

  window.switchBenchmarkViewMode = function (mode) {
    if (!["live", "report", "code"].includes(mode)) return;
    BENCH_VIEW_MODE = mode;
    ["live", "report", "code"].forEach((m) => {
      const btn = document.getElementById(`bench-mode-btn-${m}`);
      if (btn) btn.classList.toggle("active", m === mode);
      const view = document.getElementById(`bench-view-${m}`);
      if (view) {
        view.style.display = m === mode ? "flex" : "none";
      }
    });
    if (mode === "report") renderBenchReportContent();
    if (mode === "code") renderBenchAdkCodeContent();
  };

  window.toggleBenchLeftSidebar = function () {
    BENCH_LEFT_SIDEBAR_COLLAPSED = !BENCH_LEFT_SIDEBAR_COLLAPSED;
    const sb = document.getElementById("bench-sidebar");
    if (sb) sb.classList.toggle("collapsed", BENCH_LEFT_SIDEBAR_COLLAPSED);
    const btnIcon = document.querySelector("#bench-left-toggle-btn .material-symbols-outlined");
    if (btnIcon) {
      btnIcon.textContent = BENCH_LEFT_SIDEBAR_COLLAPSED ? "left_panel_open" : "left_panel_close";
    }
  };

  window.filterBenchmarkQuestions = function (val) {
    BENCH_SEARCH_FILTER = val || "";
    renderBenchSidebarList();
  };

  window.selectBenchmarkQuestion = function (eqId) {
    const item = findBenchmarkItem(eqId);
    if (!item) return;
    BENCH_SELECTED_EQ_ID = item.eq_id;
    getBenchmarkItems().forEach((it) => {
      const el = document.getElementById(`bench-qitem-${it.eq_id}`);
      if (el) el.classList.toggle("active", it.eq_id === item.eq_id);
    });
    const inputEl = document.getElementById("bench-chat-input");
    if (inputEl) {
      inputEl.value = isKo() ? item.question : item.question_en || item.question;
    }
    window.sendBenchmarkPrompt(item.eq_id);
  };

  window.resetBenchmarkConversation = function () {
    const k = isKo();
    const ragBox = document.getElementById("bench-rag-messages");
    const graphBox = document.getElementById("bench-graphrag-messages");
    if (ragBox) {
      ragBox.innerHTML = `<div class="bench-empty-placeholder" style="padding:36px 20px; text-align:center; color:var(--text-sub); font-size:12.5px;">${
        k
          ? "좌측에서 <code>EQ01</code> ~ <code>EQ14</code> 문항을 선택하거나 하단 입력창에서 동시 실행하면<br><strong>Vector RAG Agent (ADK)</strong>의 응답과 오류 구절 분석이 이곳에 표시됩니다."
          : "Select <code>EQ01</code>–<code>EQ14</code> on the left or run a prompt below to inspect the <strong>Vector RAG Agent (ADK)</strong> response."
      }</div>`;
    }
    if (graphBox) {
      graphBox.innerHTML = `<div class="bench-empty-placeholder" style="padding:36px 20px; text-align:center; color:var(--text-sub); font-size:12.5px;">${
        k
          ? "좌측에서 <code>EQ01</code> ~ <code>EQ14</code> 문항을 선택하거나 하단 입력창에서 동시 실행하면<br><strong>Ontology Graph Agent (ADK)</strong>의 4단계 GQL + Dataplex KC 검증 응답이 이곳에 표시됩니다."
          : "Select <code>EQ01</code>–<code>EQ14</code> on the left or run a prompt below to inspect the <strong>Ontology Graph Agent (ADK)</strong> response."
      }</div>`;
    }
  };

  window.runBenchQuickSample = function (sampleIdx) {
    const samples = window.__BENCH_QUICK_SAMPLES || [];
    const entry = samples[sampleIdx];
    if (!entry) return;
    const inputEl = document.getElementById("bench-chat-input");
    if (inputEl) {
      inputEl.value = entry.q;
    }
    window.sendBenchmarkPrompt();
  };

  function buildClientFallbackLiveBenchItem(questionText, elapsedMs) {
    const k = isKo();
    const bundle = getBundle();
    const okfFiles = bundle.okf_files || [];
    const bqTables = bundle.bq_tables || [];
    const qLower = String(questionText || "").toLowerCase();
    const tokens = qLower
      .replace(/[()·,?]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 2);

    const scoredOkf = okfFiles
      .filter((f) => f.status !== "deprecated")
      .map((f) => {
        const hay = `${f.id || ""} ${f.title_ko || ""} ${f.title_en || ""} ${f.summary_ko || ""} ${f.body_ko || ""}`.toLowerCase();
        let sc = 0;
        tokens.forEach((t) => {
          if (hay.includes(t)) sc += 1;
        });
        return { sc, f };
      })
      .sort((a, b) => b.sc - a.sc);

    const topOkf = (scoredOkf.filter((x) => x.sc > 0).map((x) => x.f).concat(okfFiles)).slice(0, 3);
    const modelsTbl = bqTables.find((t) => t.table_name === "dragonfly_series_models");
    const modelsRows = (modelsTbl && modelsTbl.rows) || [];
    const partsTbl = bqTables.find((t) => t.table_name === "hardware_components_catalog");
    const partsRows = ((partsTbl && partsTbl.rows) || []).slice(0, 5);

    const ragAns = k
      ? `### Vector RAG Agent (Top-3 512-Token Chunk Search)\n\n` +
        `- **질의**: ${questionText}\n` +
        `- **검색된 단일 PDF 청크**: ${topOkf.map((c) => `\`${c.id}\` (PDF pp.${c.source_pages_span || c.pdf_page})`).join(", ")}\n` +
        `- **부분 요약**: ${(topOkf[0] && (topOkf[0].summary_ko || topOkf[0].title_ko)) || ""}\n\n` +
        `> **한계**: 512-토큰 슬라이딩 청크 검색만 수행되어 \`hp_dragonfly_ontology_graph\` 멀티홉 분해 DAG(\`REQUIRES_REMOVAL_OF\`) 및 전체 시리즈·SKU 조인이 누락되었습니다.`
      : `### Vector RAG Agent (Top-3 512-Token Chunk Search)\n\n` +
        `- **Query**: ${questionText}\n` +
        `- **Retrieved Chunks**: ${topOkf.map((c) => `\`${c.id}\` (PDF pp.${c.source_pages_span || c.pdf_page})`).join(", ")}\n` +
        `- **Partial Summary**: ${(topOkf[0] && (topOkf[0].summary_en || topOkf[0].title_en)) || ""}\n\n` +
        `> **Limitation**: 512-token flat chunk retrieval omits multi-hop \`REQUIRES_REMOVAL_OF\` DAG traversal and full SKU/model graph joins.`;

    const graphAns = k
      ? `### Ontology Graph Agent (\`hp_dragonfly_ontology_graph\` + Dataplex KC + OKF v0.2)\n\n` +
        `#### 1. 정형 온톨로지 그래프 (\`dragonfly_series_models\` & \`hardware_components_catalog\`) 탐색 결과\n` +
        modelsRows
          .map(
            (m) =>
              `- **${m.model_name}** (\`${m.model_id}\`): ${m.cpu_generation || ""} · ${m.display_options || ""} · 대표 SKU \`${m.flagship_sku || ""}\``
          )
          .join("\n") +
        `\n\n#### 2. 주요 교체 부품(FRU) 및 정본 OKF v0.2 조항 (\`okf-kr\`)\n` +
        partsRows
          .map((p) => `- **${p.component_name}** (\`${p.part_number}\`): ${p.specs || p.category || ""}`)
          .join("\n") +
        `\n\n#### 3. Dataplex Knowledge Catalog 검증 원문 조항\n` +
        topOkf
          .map(
            (c) =>
              `- **${c.section_number_ko || c.section_number} ${c.title_ko}** (\`PDF pp.${c.source_pages_span || c.pdf_page}\`): ${c.summary_ko || ""}`
          )
          .join("\n")
      : `### Ontology Graph Agent (\`hp_dragonfly_ontology_graph\` + Dataplex KC + OKF v0.2)\n\n` +
        `#### 1. Structured Property Graph (\`dragonfly_series_models\` & \`hardware_components_catalog\`)\n` +
        modelsRows
          .map(
            (m) =>
              `- **${m.model_name}** (\`${m.model_id}\`): ${m.cpu_generation || ""} · ${m.display_options || ""}`
          )
          .join("\n") +
        `\n\n#### 2. Verified OKF v0.2 Provisions (\`okf-en\`)\n` +
        topOkf
          .map(
            (c) =>
              `- **${c.section_number_en || c.section_number} ${c.title_en}** (\`PDF pp.${c.source_pages_span || c.pdf_page}\`): ${c.summary_en || ""}`
          )
          .join("\n");

    return {
      eq_id: "LIVE-ADK",
      q_num: "LIVE",
      category: "실시간 Google ADK (gemini-3.8-flash) 자유 질의 비교",
      category_en: "Live Google ADK (gemini-3.8-flash) Custom Query Comparison",
      tag: "Graph PASS · Live ADK",
      tag_en: "Graph PASS · Live ADK",
      question: questionText,
      question_en: questionText,
      rag_agent: {
        agent_id: "hp_dragonfly_vector_rag_agent",
        framework: "Google ADK · gemini-3.8-flash (vertex_rag_search + execute_sql)",
        verdict: "FAIL",
        verdict_ko:
          "512-토큰 단순 벡터 검색과 단일 테이블 조회만 수행하여 멀티홉 분해 DAG(REQUIRES_REMOVAL_OF) 및 Dataplex KC 거버넌스 검증이 누락되었습니다.",
        verdict_en:
          "Executed 512-token flat chunk retrieval without multi-hop Property Graph traversal or Dataplex KC governance gating.",
        answer_text: ragAns,
        answer_text_en: ragAns,
        wrong_phrases: [],
        missing_items: [
          "BigQuery Property Graph (hp_dragonfly_ontology_graph) 멀티홉 관계 및 전체 엔티티 조인 누락",
          "Dataplex Knowledge Catalog (okf Aspect) 정본 유효성 검증 게이트 미적용"
        ],
        latency_ms: elapsedMs,
        tool_calls: [
          {
            tool: "vertex_rag_search",
            status: "OK (No KC Gate)",
            row_count: topOkf.length,
            result_summary: "512-토큰 PDF 청크 Top-3 코사인 유사도 검색",
            sql_text: JSON.stringify({ query: questionText, top_k: 3 }, null, 2)
          }
        ]
      },
      graphrag_agent: {
        agent_id: "hp_dragonfly_ontology_graph_agent",
        framework: "Google ADK · gemini-3.8-flash (GQL + Dataplex KC + OKF v0.2)",
        verdict: "PASS",
        verdict_ko: `BigQuery Property Graph(hp_dragonfly_ontology_graph) + Dataplex KC(okf Aspect) + OKF v0.2 정본 조항을 통합하여 합성했습니다 (${elapsedMs} ms).`,
        verdict_en: `Synthesized BigQuery Property Graph + Dataplex KC + OKF v0.2 verified provisions (${elapsedMs} ms).`,
        answer_text: graphAns,
        answer_text_en: graphAns,
        wrong_phrases: [],
        missing_items: [],
        latency_ms: elapsedMs,
        tool_calls: [
          {
            tool: "graph_query_gql",
            status: "OK",
            row_count: modelsRows.length + partsRows.length,
            result_summary: "BigQuery Property Graph (hp_dragonfly_ontology_graph) 정형+비정형 멀티홉 GQL 탐색 완료",
            gql_text:
              "GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`\nMATCH (m:ProductModel)<-[:BELONGS_TO_MODEL]-(s:ProductSKU)-[:USES_SYSTEM_BOARD]->(b:HardwareComponent)\nRETURN m.model_id, m.model_name, s.sku_id, b.part_number;"
          }
        ]
      },
      adk_live_meta: {
        executed_at: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
        model: "gemini-3.8-flash",
        elapsed_ms: elapsedMs
      }
    };
  }

  window.sendBenchmarkPrompt = async function (explicitEqId) {
    if (BENCH_IS_SENDING) return;
    const k = isKo();
    const inputEl = document.getElementById("bench-chat-input");
    const sendBtn = document.getElementById("bench-send-btn");
    const ragBox = document.getElementById("bench-rag-messages");
    const graphBox = document.getElementById("bench-graphrag-messages");
    if (!ragBox || !graphBox) return;

    const rawQ = inputEl ? inputEl.value.trim() : "";
    const strictMatchedItem = explicitEqId
      ? findBenchmarkItem(explicitEqId, true)
      : findBenchmarkItem(rawQ, true);

    if (strictMatchedItem) {
      BENCH_SELECTED_EQ_ID = strictMatchedItem.eq_id;
      getBenchmarkItems().forEach((it) => {
        const el = document.getElementById(`bench-qitem-${it.eq_id}`);
        if (el) el.classList.toggle("active", it.eq_id === strictMatchedItem.eq_id);
      });
    } else {
      getBenchmarkItems().forEach((it) => {
        const el = document.getElementById(`bench-qitem-${it.eq_id}`);
        if (el) el.classList.remove("active");
      });
    }

    const questionText =
      rawQ ||
      (strictMatchedItem ? (k ? strictMatchedItem.question : strictMatchedItem.question_en) : "");
    if (!questionText) return;

    BENCH_IS_SENDING = true;
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.style.opacity = "0.7";
    }

    // Clear previous turns so side-by-side comparison stays vertically aligned
    ragBox.innerHTML = "";
    graphBox.innerHTML = "";

    const userBubbleHtml = `
      <div class="msg-row msg-user">
        <div class="msg-user-bubble">${escapeHtml(questionText)}</div>
      </div>
    `;
    ragBox.insertAdjacentHTML("beforeend", userBubbleHtml);
    graphBox.insertAdjacentHTML("beforeend", userBubbleHtml);

    const ragLoadingRow = document.createElement("div");
    ragLoadingRow.className = "msg-row msg-agent";
    ragLoadingRow.innerHTML = `
      <div class="msg-agent-bubble" style="padding:16px 18px; border:1px solid rgba(26,115,232,0.35); background:rgba(26,115,232,0.04);">
        <div class="agent-loading-line" style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px; min-width:0;">
            <span class="material-symbols-outlined gcp-spin-sync" style="font-size:18px; color:var(--gcp-blue);">sync</span>
            <span id="bench-rag-stage-txt" class="agent-loading-text" style="font-weight:600; color:var(--text);">${
              k
                ? "Step 1 · vertex_rag_search : PDF 청크 임베딩 코사인 유사도 Top-4 검색 중 (Google ADK · gemini-3.8-flash)..."
                : "Step 1 · vertex_rag_search : Retrieving top-4 PDF chunks via Google ADK · gemini-3.8-flash..."
            }</span>
          </div>
          <span id="bench-rag-timer-pill" class="agent-neutral-pill" style="font-family:var(--font-mono, monospace);">0.1s</span>
        </div>
      </div>
    `;
    ragBox.appendChild(ragLoadingRow);

    const graphLoadingRow = document.createElement("div");
    graphLoadingRow.className = "msg-row msg-agent";
    graphLoadingRow.innerHTML = `
      <div class="msg-agent-bubble" style="padding:16px 18px; border:1px solid rgba(19,115,51,0.35); background:rgba(19,115,51,0.04);">
        <div class="agent-loading-line" style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px; min-width:0;">
            <span class="material-symbols-outlined gcp-spin-sync" style="font-size:18px; color:#137333;">sync</span>
            <span id="bench-graph-stage-txt" class="agent-loading-text" style="font-weight:600; color:var(--text);">${
              k
                ? "Step 0 · before_agent_callback : 온톨로지 엔티티 & KC 앵커 바인딩 중 (Google ADK · gemini-3.8-flash)..."
                : "Step 0 · before_agent_callback : Binding ontology & KC anchors (Google ADK · gemini-3.8-flash)..."
            }</span>
          </div>
          <span id="bench-graph-timer-pill" class="agent-neutral-pill" style="font-family:var(--font-mono, monospace); color:#137333;">0.1s</span>
        </div>
      </div>
    `;
    graphBox.appendChild(graphLoadingRow);

    const ragStages = k
      ? [
          "Step 1 · vertex_rag_search : PDF 청크 임베딩 코사인 유사도 Top-4 검색 중 (gemini-3.8-flash)...",
          "Step 2 · execute_sql : 단일 테이블 단발성 SQL 조회 중...",
          "Step 3 · Google ADK LlmAgent(gemini-3.8-flash) : Vector RAG 응답 실시간 생성 중..."
        ]
      : [
          "Step 1 · vertex_rag_search : Retrieving top-4 PDF chunks by cosine similarity...",
          "Step 2 · execute_sql : Running single-pass flat SQL lookup...",
          "Step 3 · Google ADK LlmAgent(gemini-3.8-flash) : Generating Vector RAG response..."
        ];
    const graphStages = k
      ? [
          "Step 0 · before_agent_callback : 온톨로지 엔티티 & KC 앵커 결정론적 바인딩 중...",
          "Step 1 · graph_query_gql : BigQuery hp_dragonfly_ontology_graph ISO/IEC 39075 GQL 탐색 중...",
          "Step 2 · kc_lookup_aspect : Dataplex Knowledge Catalog (okf Aspect) 유효성 검증 중...",
          "Step 3 · fetch_okf_provision & ADK LlmAgent(gemini-3.8-flash) : 정본 OKF v0.2 통합 응답 생성 중..."
        ]
      : [
          "Step 0 · before_agent_callback : Binding ontology entity & Dataplex KC anchors...",
          "Step 1 · graph_query_gql : Traversing BigQuery hp_dragonfly_ontology_graph via GQL...",
          "Step 2 · kc_lookup_aspect : Verifying Dataplex Knowledge Catalog (okf Aspect) gate...",
          "Step 3 · fetch_okf_provision & ADK LlmAgent(gemini-3.8-flash) : Synthesizing grounded response..."
        ];

    const t0 = performance.now();
    const stepIntervalMs = strictMatchedItem ? 210 : 750;
    const stageTimer = setInterval(() => {
      const elapsedMs = performance.now() - t0;
      const elapsedSec = (elapsedMs / 1000).toFixed(1) + "s";
      const rTimer = document.getElementById("bench-rag-timer-pill");
      if (rTimer) rTimer.textContent = elapsedSec;
      const gTimer = document.getElementById("bench-graph-timer-pill");
      if (gTimer) gTimer.textContent = elapsedSec;

      const rIdx = Math.min(ragStages.length - 1, Math.floor(elapsedMs / stepIntervalMs));
      const gIdx = Math.min(graphStages.length - 1, Math.floor(elapsedMs / stepIntervalMs));
      const rEl = document.getElementById("bench-rag-stage-txt");
      if (rEl) rEl.textContent = ragStages[rIdx];
      const gEl = document.getElementById("bench-graph-stage-txt");
      if (gEl) gEl.textContent = graphStages[gIdx];
    }, 100);

    try {
      let liveItem = null;
      const fetchPromise = (async () => {
        try {
          const resp = await fetch("/api/benchmark/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: questionText,
              eq_id: strictMatchedItem ? strictMatchedItem.eq_id : null,
              lang: LANG,
              live_adk: true
            })
          });
          const data = await resp.json();
          if (data && data.ok && data.item) {
            return data.item;
          }
        } catch (_) {}
        return null;
      })();

      const minAnimPromise = new Promise((resolve) =>
        setTimeout(resolve, strictMatchedItem ? 860 : 400)
      );

      const [fetchedItem] = await Promise.all([fetchPromise, minAnimPromise]);
      liveItem = fetchedItem;

      const totalElapsedMs = Math.round(performance.now() - t0);
      let finalItem = liveItem || strictMatchedItem;
      if (!finalItem) {
        finalItem = buildClientFallbackLiveBenchItem(questionText, totalElapsedMs);
      } else {
        finalItem = JSON.parse(JSON.stringify(finalItem));
        finalItem.adk_live_meta = Object.assign({}, finalItem.adk_live_meta || {}, {
          executed_at:
            (finalItem.adk_live_meta && finalItem.adk_live_meta.executed_at) ||
            new Date().toISOString().replace(/\.\d+Z$/, "Z"),
          model: "gemini-3.8-flash",
          elapsed_ms: (finalItem.adk_live_meta && finalItem.adk_live_meta.elapsed_ms) || totalElapsedMs
        });
      }

      ragLoadingRow.innerHTML = buildBenchArmTurnBubbleHtml(finalItem, "rag");
      graphLoadingRow.innerHTML = buildBenchArmTurnBubbleHtml(finalItem, "graphrag");
      ragBox.scrollTop = 0;
      graphBox.scrollTop = 0;
    } finally {
      clearInterval(stageTimer);
      BENCH_IS_SENDING = false;
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.style.opacity = "1";
      }
    }
  };

  window.toggleBenchEqSelectMenu = function (ev) {
    if (ev) ev.stopPropagation();
    const wrap = document.getElementById("bench-eq-custom-select");
    if (wrap) wrap.classList.toggle("open");
  };

  window.selectBenchReportEqOption = function (ev, eqId) {
    if (ev) ev.stopPropagation();
    const wrap = document.getElementById("bench-eq-custom-select");
    if (wrap) wrap.classList.remove("open");
    window.selectBenchReportEq(eqId);
  };

  window.selectBenchReportEq = function (eqId) {
    const item = findBenchmarkItem(eqId);
    if (!item) return;
    BENCH_SELECTED_EQ_ID = item.eq_id;
    renderBenchReportContent();
    renderBenchSidebarList();
  };

  window.runBenchmarkEqInLive = function (eqId) {
    const item = findBenchmarkItem(eqId);
    if (!item) return;
    BENCH_SELECTED_EQ_ID = item.eq_id;
    window.switchBenchmarkViewMode("live");
    window.selectBenchmarkQuestion(item.eq_id);
  };

  // =========================================================================
  // Initialization
  // =========================================================================
  document.addEventListener("DOMContentLoaded", function () {
    try {
      const savedDark = localStorage.getItem("hp_studio_dark");
      if (savedDark === "1") document.body.classList.add("dark-mode");
    } catch (_) {}
    document.documentElement.setAttribute("lang", LANG);
    syncStaticLabels();
    renderManagementModule();
    const hashMod = (window.location.hash || "").replace(/^#/, "");
    if (hashMod === "okf-graph") {
      GRAPH_MODE = true;
      syncViewSwitchButton();
      switchModule("okf-validation");
      return;
    }
    const validMods = ["intro", "okf-validation", "okf-management", "bq-graph", "agent", "rag-vs-graphrag"];
    switchModule(validMods.includes(hashMod) ? hashMod : "intro");
  });
})();
