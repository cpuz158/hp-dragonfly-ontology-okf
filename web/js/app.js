/* ==========================================================================
   HP Dragonfly Ontology & OKF v0.2 Studio — Core Application Controller
   100% Aligned with `gcp-console.css` & `krda-ontology-studio` DOM Architecture
   Supports Instant Bilingual UI (KO / EN) over 100% English Underlying Data.
   ========================================================================== */
(function () {
  "use strict";

  const BUNDLE = window.HP_ONTOLOGY_BUNDLE || {};
  const OKF_FILES = BUNDLE.okf_files || [];
  const OKF_GRAPH = BUNDLE.okf_graph || { nodes: [], edges: [] };
  const BQ_TABLES = BUNDLE.bq_tables || [];
  const GQL_QUERIES = BUNDLE.gql_queries || [];
  const CATALOG_SNAPS = BUNDLE.catalog_snapshots || [];
  const GIT_COMMITS = BUNDLE.git_commits || [];

  // Global Studio State
  let LANG = window.INITIAL_STUDIO_LANG || localStorage.getItem("hp_studio_lang") || "ko";
  let ACTIVE_MODULE = "intro";
  let INTRO_TAB = "arch"; // 'arch' | 'pipeline'
  let MGMT_TAB = "kcmd"; // 'kcmd' | 'git'
  let GRAPH_MODE = false;
  let CURRENT_OKF_IDX = Math.max(
    0,
    OKF_FILES.findIndex((f) => f.rel_path === "tables/component_disassembly_deps.md")
  );
  let OPEN_CATS = {
    datasets: true,
    tables: true,
    references: true,
    metrics: true,
    computations: true,
    playbooks: true,
    root: true
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
    setTxt("tip-desc-03", "Metadata as Code (Git) · Dataplex kcmd 배포", "Metadata as Code (Git) & Dataplex kcmd");
    setTxt("tip-desc-04", "BigQuery 8개 정형 테이블 · 3D 스키마 · GQL 그래프", "BigQuery 8 Tables · 3D Schema · GQL Graph");
    setTxt("tip-desc-05", "하이브리드 온톨로지 에이전트 & Playbook 추론", "Hybrid Ontology Agent & Playbook Reasoning");
    setTxt("tip-desc-06", "Vector RAG vs. Ontology Graph RAG 벤치마크", "Vector RAG vs. Ontology Graph RAG Benchmark");

    setTxt("lbl-source-pdf", "원본 PDF", "Source PDF");
    setTxt("lbl-okf-file", "OKF 파일", "OKF File");
    setTxt("g-sidebar-title", "OKF 시맨틱 지식그래프", "OKF Knowledge Graph");
    setTxt(
      "g-sidebar-sub",
      "노드를 클릭하면 우측 패널에 해당 OKF 문서의 YAML Frontmatter와 영문 마크다운 원문이 표시됩니다.",
      "Click any concept node to inspect its YAML Frontmatter and English Markdown specification in the right panel."
    );
    setTxt("lbl-fit-graph", "화면 맞춤", "Fit Screen");
    setTxt("lbl-phys-graph", "물리엔진", "Physics");
    setTxt("lbl-open-pdf-compare", "PDF 대조뷰로 열기", "Open 1:1 PDF View");

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
  // =========================================================================
  window.toggleCatGroup = function (cat) {
    OPEN_CATS[cat] = !OPEN_CATS[cat];
    renderSidebar();
  };

  window.renderSidebar = function () {
    const searchEl = document.getElementById("nav-search");
    const q = ((searchEl && searchEl.value) || "").trim().toLowerCase();
    const box = document.getElementById("nav-list");
    if (!box) return;

    const k = isKo();
    const catTitles = {
      datasets: k ? "01. 데이터셋 (datasets/)" : "01. Datasets (datasets/)",
      tables: k ? "02. 정형 테이블 (tables/ · 8)" : "02. Structured Tables (tables/ · 8)",
      references: k ? "03. PDF 레퍼런스 (references/ · 5)" : "03. PDF References (references/ · 5)",
      metrics: k ? "04. 서비스 지표 (metrics/ · 2)" : "04. Service Metrics (metrics/ · 2)",
      computations: k ? "05. 검증 쿼리 (computations/ · 2)" : "05. Computations (computations/ · 2)",
      playbooks: k ? "06. 진단 플레이북 (playbooks/ · 2)" : "06. Playbooks (playbooks/ · 2)",
      root: k ? "07. 루트 인덱스 & 감사 로그" : "07. Root Index & Audit Log"
    };

    const byCat = {};
    OKF_FILES.forEach((f, idx) => {
      if (q) {
        const hay = `${f.rel_path} ${f.filename} ${f.pdf_section_en} ${f.pdf_section_ko} ${f.body}`.toLowerCase();
        if (!hay.includes(q)) return;
      }
      const c = f.category || "root";
      if (!byCat[c]) byCat[c] = [];
      byCat[c].push({ ...f, idx });
    });

    box.innerHTML = Object.entries(byCat)
      .map(([cat, items]) => {
        const isOpen = q ? true : Boolean(OPEN_CATS[cat]);
        return `
          <div class="doc-section">
            <div class="doc-group-title" onclick="toggleCatGroup('${escapeHtml(cat)}')">
              <span>${escapeHtml(catTitles[cat] || cat)}</span>
              <span style="font-size:11px; font-weight:500; color:var(--text-sub);">${items.length}</span>
            </div>
            <div class="doc-items ${isOpen ? "" : "collapsed"}">
              ${items
                .map(
                  (it) => `
                <div class="nav-item ${it.idx === CURRENT_OKF_IDX ? "active" : ""}" onclick="selectItem(${it.idx})">
                  <div class="nav-item-top">
                    <span>${escapeHtml(it.filename)}</span>
                    <span class="nav-page">p.${it.pdf_page}</span>
                  </div>
                  <div class="nav-item-sub">${escapeHtml(
                    (it.frontmatter && (it.frontmatter.title || it.frontmatter.description)) ||
                      (k ? it.pdf_section_ko : it.pdf_section_en)
                  )}</div>
                </div>
              `
                )
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
    const targetRel = conceptId.endsWith(".md") ? conceptId : conceptId + ".md";
    const idx = OKF_FILES.findIndex((f) => f.rel_path === targetRel || f.id === conceptId);
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

  function buildOkfDetailMarkup(f) {
    const k = isKo();
    const cid = f.id;
    const allEdges = (OKF_GRAPH.edges || []).map((e) => e.data || {});
    const relEdges = allEdges.filter((e) => e.source === cid || e.target === cid);

    let relHtml = "";
    if (relEdges.length > 0) {
      relHtml = `
        <div class="section-label">
          <span>${k ? "OKF 시맨틱 연결 관계" : "OKF Semantic Relations"} (${relEdges.length})</span>
          <span>${k ? "클릭 시 해당 컨셉으로 이동" : "Click to jump to concept"}</span>
        </div>
        <div class="biz-edge-list">
          ${relEdges
            .slice(0, 14)
            .map((e) => {
              const isOut = e.source === cid;
              const otherId = isOut ? e.target : e.source;
              const otherFile = OKF_FILES.find((x) => x.id === otherId);
              const otherPage = otherFile ? `p.${otherFile.pdf_page}` : "";
              const dotColor = isOut ? "#3b6ea5" : "#3b735b";
              return `
                <div class="biz-edge-item" onclick="selectByConceptId('${escapeHtml(otherId)}')">
                  <div class="biz-edge-top">
                    <span class="edge-badge">
                      <span class="edge-dot" style="background:${dotColor};"></span>
                      ${isOut ? "REFERENCES ➔" : "CITED BY ⬅"}
                    </span>
                    <span class="edge-jump-meta">${escapeHtml(otherId)} ${otherPage ? `(${otherPage})` : ""} ↗</span>
                  </div>
                  <div class="edge-target">
                    <span class="edge-kw">from</span>
                    <span class="${isOut ? "edge-sec-self" : "edge-sec-peer"}">${escapeHtml(e.source)}</span>
                    <span class="edge-arrow">➔</span>
                    <span class="edge-kw">to</span>
                    <span class="${isOut ? "edge-sec-peer" : "edge-sec-self"}">${escapeHtml(e.target)}</span>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    }

    // Extract raw YAML frontmatter block
    const rawMatch = (f.raw || "").match(/^---\s*\n([\s\S]*?)\n---/);
    const rawYaml = rawMatch ? `---\n${rawMatch[1]}\n---` : "# Progressive Disclosure Index (No YAML Frontmatter)";
    const fmType = (f.frontmatter && f.frontmatter.type) || "Index";
    const renderedMd =
      window.marked && typeof window.marked.parse === "function"
        ? window.marked.parse(f.body || "")
        : `<pre>${escapeHtml(f.body || "")}</pre>`;

    return `
      <div class="okf-subpath-line">bundles/hp_dragonfly/${escapeHtml(f.rel_path)}</div>
      ${relHtml}
      <details class="fm-accordion" ${FM_OPEN ? "open" : ""} ontoggle="onFmToggle(this.open)">
        <summary>
          <span class="fm-summary-left">
            <span>YAML Frontmatter</span>
            <span class="fm-summary-meta">${escapeHtml(fmType)} · PDF p.${f.pdf_page}</span>
          </span>
          <span class="material-symbols-outlined fm-chevron">expand_more</span>
        </summary>
        <div class="frontmatter-block">${colorizeYaml(rawYaml)}</div>
      </details>

      <div class="section-label">
        <span>${k ? "OKF v0.2 영문 마크다운 명세 (Markdown Body)" : "OKF v0.2 English Specification (Markdown Body)"}</span>
      </div>
      <div class="okf-title">${escapeHtml(
        (f.frontmatter && (f.frontmatter.title || f.frontmatter.description)) || f.filename
      )}</div>
      <div class="okf-body-box okf-md-content">${renderedMd}</div>
    `;
  }

  window.selectItem = function (idx) {
    CURRENT_OKF_IDX = idx;
    const f = OKF_FILES[CURRENT_OKF_IDX];
    if (!f) return;
    OPEN_CATS[f.category || "root"] = true;
    renderSidebar();

    const k = isKo();
    const pdfUrl = `/docs/pdf_6290467_en-US-1.pdf#page=${f.pdf_page}&zoom=100`;
    const pdfNameEl = document.getElementById("pdf-name-label");
    if (pdfNameEl) pdfNameEl.textContent = "pdf_6290467_en-US-1.pdf (N17344-001)";

    const pdfPageEl = document.getElementById("pdf-page-label");
    if (pdfPageEl) {
      pdfPageEl.textContent = k
        ? `p.${f.pdf_page} / 총 109쪽 · ${f.pdf_section_ko}`
        : `p.${f.pdf_page} of 109 · ${f.pdf_section_en}`;
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
    if (okfFileEl) okfFileEl.textContent = f.rel_path;

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
  };

  function openGraphDetailForIdx(idx) {
    CURRENT_OKF_IDX = idx;
    const f = OKF_FILES[CURRENT_OKF_IDX];
    if (!f) return;
    const pathEl = document.getElementById("graph-detail-path");
    if (pathEl) pathEl.textContent = f.rel_path;
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
    const isDark = document.body.classList.contains("dark-mode");

    const rawNodes = (OKF_GRAPH.nodes || []).map((n) => n.data || {});
    const rawEdges = (OKF_GRAPH.edges || []).map((e) => e.data || {});

    const filteredNodes = rawNodes.filter((n) => {
      if (!scope || scope === "ALL") return true;
      if (scope === "tables") return n.id.startsWith("tables/") || n.id.startsWith("datasets/");
      if (scope === "references") return n.id.startsWith("references/") || n.id.startsWith("tables/");
      if (scope === "playbooks") {
        return (
          n.id.startsWith("playbooks/") ||
          n.id.startsWith("computations/") ||
          n.id.startsWith("metrics/") ||
          n.id.startsWith("tables/")
        );
      }
      return true;
    });

    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const visNodes = filteredNodes.map((d) => {
      const fIdx = OKF_FILES.findIndex((f) => f.id === d.id);
      let bg = d.color || "#3b82f6";
      if (d.id.startsWith("playbooks/")) bg = "#f59e0b";
      return {
        id: d.id,
        provIdx: fIdx >= 0 ? fIdx : 0,
        label: d.id.split("/").pop(),
        title: `${d.label || d.id} (${d.type || "Concept"})`,
        shape: "dot",
        size: Math.max(16, Math.min(28, (d.size || 36) * 0.52)),
        color: {
          background: bg,
          border: isDark ? "#e3e3e3" : "#ffffff",
          highlight: { background: "#1a73e8", border: "#174ea6" }
        },
        font: {
          color: isDark ? "#e3e3e3" : "#202124",
          size: 11.5,
          face: "Google Sans, Noto Sans KR, sans-serif"
        }
      };
    });

    const visEdges = rawEdges
      .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map((e) => ({
        from: e.source,
        to: e.target,
        arrows: "to",
        color: { color: isDark ? "rgba(154,160,166,0.35)" : "rgba(95,99,104,0.32)", highlight: "#1a73e8" }
      }));

    const stProvs = document.getElementById("g-stat-provs");
    const stEdges = document.getElementById("g-stat-edges");
    if (stProvs) stProvs.textContent = String(visNodes.length);
    if (stEdges) stEdges.textContent = String(visEdges.length);

    if (okfNetwork) okfNetwork.destroy();
    okfNetwork = new window.vis.Network(
      container,
      { nodes: new window.vis.DataSet(visNodes), edges: new window.vis.DataSet(visEdges) },
      {
        physics: {
          enabled: okfPhysics,
          solver: "forceAtlas2Based",
          forceAtlas2Based: {
            gravitationalConstant: -45,
            centralGravity: 0.01,
            springLength: 95,
            springConstant: 0.08,
            damping: 0.45
          },
          stabilization: { iterations: 120 }
        },
        interaction: { hover: true, tooltipDelay: 150 }
      }
    );

    okfNetwork.on("click", function (params) {
      if (params.nodes && params.nodes.length > 0) {
        const clickedId = params.nodes[0];
        const fIdx = OKF_FILES.findIndex((f) => f.id === clickedId);
        if (fIdx >= 0) openGraphDetailForIdx(fIdx);
      }
    });
  };

  window.searchGraphNode = function (term) {
    const q = (term || "").trim().toLowerCase();
    if (!q || !okfNetwork) return;
    const found = OKF_FILES.findIndex(
      (f) => f.id.toLowerCase().includes(q) || (f.body || "").toLowerCase().includes(q)
    );
    if (found >= 0) {
      const id = OKF_FILES[found].id;
      try {
        okfNetwork.selectNodes([id]);
        okfNetwork.focus(id, { scale: 1.25, animation: { duration: 400 } });
        openGraphDetailForIdx(found);
      } catch (_) {}
    }
  };

  window.fitGraph = function () {
    if (okfNetwork) okfNetwork.fit({ animation: true });
  };

  window.togglePhysics = function () {
    okfPhysics = !okfPhysics;
    if (okfNetwork) okfNetwork.setOptions({ physics: { enabled: okfPhysics } });
  };

  // =========================================================================
  // 5. MODULE 03: OKF & kcmd Management (`#module-enrollment`)
  // =========================================================================
  window.setMgmtTab = function (tab) {
    MGMT_TAB = tab;
    renderManagementModule();
  };

  window.selectSnapIdx = function (idx) {
    SELECTED_SNAP_IDX = idx;
    renderManagementModule();
  };

  function renderManagementModule() {
    const box = document.getElementById("module-enrollment");
    if (!box) return;
    const k = isKo();
    const curSnap = CATALOG_SNAPS[SELECTED_SNAP_IDX] || CATALOG_SNAPS[0] || {};
    const curFile = OKF_FILES[CURRENT_OKF_IDX] || OKF_FILES[0] || {};

    const kcmdCliPreview = `# 1. Push Enriched BigQuery Overview Aspects (1 Dataset + 8 Tables)
./bin/kcmd push ./catalog
# Scope: bq-dataset.hp-dragonfly.prj_ontology_hp_dragonfly

# 2. Push Full OKF v0.2 Bundle (28 Files) to Custom EntryGroup
./bin/kcmd push ./catalog_okf
# Scope: kb.hp-dragonfly.us-central1.okf_hp_dragonfly

# 3. Round-Trip Pull Verification from Dataplex Knowledge Catalog
./bin/kcmd pull ./catalog_okf_pulled -s kb.hp-dragonfly.us-central1.okf_hp_dragonfly`;

    box.innerHTML = `
      <div class="module-container">
        <div class="mod-hero">
          <div>
            <div class="mod-tag">03 · Metadata as Code (Git) &amp; Dataplex kcmd Pipeline</div>
            <div class="mod-title">
              ${
                k
                  ? "Enrichment Agent 생성 OKF v0.2 번들의 Git 버전 관리 및 <code>./bin/kcmd</code> Dataplex 배포"
                  : "Git Version Control &amp; <code>./bin/kcmd</code> Dataplex Knowledge Catalog Synchronization"
              }
            </div>
            <div class="mod-desc">
              ${
                k
                  ? "1) <strong>Enrichment Agent</strong>(<code>scripts/enrichment_agent.py</code>)로 생성한 28개 OKF 마크다운 파일과 <code>catalog/</code> 스냅샷을 2) <strong>Git 리포지토리(Metadata as Code)</strong>에 커밋하여 버전 관리하고, 3) <strong><code>kcmd</code> v1.0.0 CLI</strong>(<code>./bin/kcmd</code>)로 GCP Dataplex Knowledge Catalog(<code>hp-dragonfly</code>)에 양방향 Push/Pull 동기화한 현황입니다."
                  : "1) Synthesizes 28 OKF v0.2 markdown files and <code>catalog/</code> YAML snapshots via the <strong>Enrichment Agent</strong>, 2) Versions all semantic definitions in <strong>Git (Metadata as Code)</strong>, and 3) Pushes &amp; pulls entries to GCP Dataplex Knowledge Catalog (<code>hp-dragonfly</code>) via <strong><code>./bin/kcmd</code> v1.0.0</strong>."
              }
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end; flex-shrink:0;">
            <span class="mod-badge green">bq-dataset: 9 / 9 Overview Synced</span>
            <span class="mod-badge blue">okf_hp_dragonfly: 28 / 28 OKF Entries Active</span>
          </div>
        </div>

        <div class="mod-grid-4">
          <div class="mod-card">
            <div class="mod-card-header"><span class="mod-badge blue">Step 1</span><span class="material-symbols-outlined" style="color:var(--gcp-blue);">auto_awesome</span></div>
            <div class="mod-card-title">${k ? "Enrichment Agent 실행" : "Enrichment Agent Run"}</div>
            <div style="font-size:12px; color:var(--text-sub); line-height:1.6;">
              • <strong>Script</strong>: <code>scripts/enrichment_agent.py</code><br>
              • <strong>Input</strong>: <code>pdf_6290467_en-US-1.pdf</code> + 8 BQ Tables<br>
              • <strong>Output</strong>: 28 OKF <code>.md</code> + <code>viz.html</code>
            </div>
          </div>
          <div class="mod-card">
            <div class="mod-card-header"><span class="mod-badge blue">Step 2</span><span class="material-symbols-outlined" style="color:var(--gcp-blue);">commit</span></div>
            <div class="mod-card-title">${k ? "Metadata as Code (Git)" : "Metadata as Code (Git)"}</div>
            <div style="font-size:12px; color:var(--text-sub); line-height:1.6;">
              • <strong>Repo</strong>: <code>~/Research/2026-10-25_project-Ontology</code><br>
              • <strong>Branch</strong>: <code>main</code> (${GIT_COMMITS.length} Commits)<br>
              • <strong>Provenance</strong>: <code>generated</code> / <code>verified</code>
            </div>
          </div>
          <div class="mod-card">
            <div class="mod-card-header"><span class="mod-badge blue">Step 3</span><span class="material-symbols-outlined" style="color:var(--gcp-blue);">inventory_2</span></div>
            <div class="mod-card-title">${k ? "Dataplex 카탈로그 스키마" : "Dataplex Catalog Types"}</div>
            <div style="font-size:12px; color:var(--text-sub); line-height:1.6;">
              • <strong>EntryGroup</strong>: <code>okf_hp_dragonfly</code><br>
              • <strong>AspectType</strong>: <code>okf</code> (<code>okf-aspect.json</code>)<br>
              • <strong>EntryType</strong>: <code>okf-bundle</code>
            </div>
          </div>
          <div class="mod-card">
            <div class="mod-card-header"><span class="mod-badge green">Step 4</span><span class="material-symbols-outlined" style="color:var(--gcp-green);">published_with_changes</span></div>
            <div class="mod-card-title">${k ? "kcmd Push & Pull 검증" : "kcmd Push & Pull Sync"}</div>
            <div style="font-size:12px; color:var(--text-sub); line-height:1.6;">
              • <strong>Binary</strong>: <code>./bin/kcmd</code> (v1.0.0)<br>
              • <strong>Pushed</strong>: 9 BQ + 28 OKF Entries<br>
              • <strong>Round-Trip</strong>: <code>catalog_okf_pulled/</code> Verified
            </div>
          </div>
        </div>

        <div class="mod-card">
          <div class="mod-card-header">
            <div class="mod-card-title">
              <span class="material-symbols-outlined" style="color:var(--gcp-blue);">terminal</span>
              <span>${
                k
                  ? "Metadata-as-Code YAML 스냅샷 인스펙터 & Git 버전 커밋 히스토리"
                  : "Metadata-as-Code YAML Snapshot Inspector & Git Commit History"
              }</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:12px; color:var(--text-sub);">${k ? "스냅샷 파일 선택:" : "Select YAML Snapshot:"}</span>
              <select class="gcp-select" style="width:360px;" onchange="selectSnapIdx(Number(this.value))">
                ${CATALOG_SNAPS.map(
                  (s, i) =>
                    `<option value="${i}" ${i === SELECTED_SNAP_IDX ? "selected" : ""}>${escapeHtml(s.rel_path)} — ${escapeHtml(s.label)}</option>`
                ).join("")}
              </select>
              <button class="gcp-action-btn" style="padding:6px 12px;" onclick="switchModule('okf-validation'); selectItem(${CURRENT_OKF_IDX});">
                <span class="material-symbols-outlined">open_in_new</span> ${k ? "02 · 1:1 대조뷰 열기" : "Open 02 · 1:1 Validator"}
              </button>
            </div>
          </div>

          <div class="mod-grid-2" style="margin-top:6px;">
            <div>
              <div class="section-label">
                <span>1. Selected Metadata-as-Code YAML (${escapeHtml(curSnap.rel_path || "")})</span>
                <span>kcmd Snapshot</span>
              </div>
              <div class="frontmatter-block" style="border:1px solid var(--border); border-radius:6px; max-height:360px; overflow-y:auto;">${colorizeYaml(curSnap.content || "")}</div>
            </div>
            <div>
              <div class="section-label">
                <span>2. kcmd CLI Commands &amp; Git Commit Provenance (${GIT_COMMITS.length} Commits)</span>
                <span>branch: main</span>
              </div>
              <div class="frontmatter-block" style="border:1px solid var(--border); border-radius:6px; margin-bottom:10px;">${escapeHtml(kcmdCliPreview)}</div>
              <div style="max-height:210px; overflow-y:auto; border:1px solid var(--border); border-radius:6px;">
                <table class="mod-table">
                  <thead>
                    <tr>
                      <th>Commit</th>
                      <th>Date</th>
                      <th>Message (Metadata as Code)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${GIT_COMMITS.map(
                      (c) => `
                      <tr>
                        <td><code>${escapeHtml(c.short_hash)}</code></td>
                        <td style="white-space:nowrap; font-size:11.5px; color:var(--text-sub);">${escapeHtml((c.date || "").slice(0, 16))}</td>
                        <td><b>${escapeHtml(c.subject)}</b></td>
                      </tr>`
                    ).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

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
      ko: "하드웨어 스페어 부품 허브 (25 rows)",
      enSub: "Hardware Spare Parts Hub (25 rows)",
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
        "HP Dragonfly G3 및 Folio G3의 교체 가능 하드웨어 부품(FRU/CRU 25종: 온보드 LPDDR5 시스템 보드 6종, 배터리, OLED/IPS 디스플레이, 열전도 모듈, 하판 커버 등)을 정의하는 핵심 허브 클래스입니다. 부품 간 선행 분해 의존성(REQUIRES_REMOVAL_OF DAG 18건) 및 고장 사례(AFFECTS_COMPONENT)의 중심 엔티티입니다.",
      desc_en:
        "Central ontology hub class representing 25 field-replaceable and customer-replaceable hardware spare parts (6 soldered LPDDR5 system boards, batteries, OLED/IPS displays, thermal modules, bottom covers) and anchoring the 18-edge prerequisite disassembly DAG (REQUIRES_REMOVAL_OF).",
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
      ko: "노트북 세부 SKU 구성 (15 rows)",
      enSub: "Configured Laptop SKUs (15 rows)",
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
        "CPU(Intel i5-1235U ~ i7-1265U vPro), 온보드 납땜 LPDDR5 메모리 용량(16GB/32GB), 3K2K OLED / WUXGA+ IPS 디스플레이, 5G/LTE WWAN 조합별 15개 세부 SKU 및 장착 시스템 보드 파트 번호(USES_SYSTEM_BOARD)를 정의합니다.",
      desc_en:
        "Defines 15 factory-configured HP Dragonfly G3 and Folio G3 SKUs by processor, soldered LPDDR5 memory capacity (16GB/32GB), display panel, WWAN modem, and exact system board spare part number (USES_SYSTEM_BOARD).",
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
      ko: "LED 점멸 · POST 진단코드 (11 rows)",
      enSub: "LED Blink & POST Codes (11 rows)",
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
        "Reference dictionary of 11 Caps Lock / Power LED blink patterns (e.g., 3.2 Memory error, 2.2 BIOS corruption, 5.2 System board failure) and POST codes with subsystem mapping and recovery actions.",
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
      ko: "BIOS · SoftPaq · NVM 보안 (10 rows)",
      enSub: "BIOS, SoftPaq & NVM Chips (10 rows)",
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
        "Tracks 10 firmware releases (U95 System BIOS, Thunderbolt 4 retimer, ISH sensor hub) and Appendix B Non-Volatile Memory (NVM) chips protected by HP Sure Start Gen7.",
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
      ko: "I/O 포트 · 센서 · TB4 독 (12 rows)",
      enSub: "I/O Ports, Sensors & Docks (12 rows)",
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
        "Specifies 12 external I/O ports (Thunderbolt 4 40Gbps), hall/proximity sensors, magnetic stylus charging, and HP Thunderbolt Dock G4 display/power matrices.",
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
      view: "okf_hp_dragonfly.ServiceManualDocument",
      table: "docs/pdf_6290467_en-US-1.pdf (bundles/hp_dragonfly/index.md)",
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
      view: "okf_hp_dragonfly.ServiceManualChapter",
      table: "bundles/hp_dragonfly/references/*.md (5 Files)",
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
      view: "okf_hp_dragonfly.ServicePlaybook",
      table: "bundles/hp_dragonfly/playbooks/*.md & computations/*.md",
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
      badgeLabel: "REQUIRES_REMOVAL_OF (DAG · 18)",
      isSelfLoop: true,
      loopIdx: 0,
      color: 0xa85c56,
      view: "component_disassembly_deps (18 rows)",
      joinKeys: "target_part_number ➔ prerequisite_part_number",
      desc_ko:
        "[선행 분해 의존성 DAG · 18건] 특정 하드웨어 부품(target_part_number, 예: 시스템 보드 M90788-601)을 분리하기 전에 반드시 먼저 제거해야 하는 선행 부품(prerequisite_part_number: 하판 커버 N22918-001 → 배터리 M90788-005 → 방열판 M90790-001), 작업 순서(step_order), 나사 규격(Torx T5 / Phillips PH0), ZIF 케이블 주의사항을 정의하는 자기참조 그래프 엣지입니다.",
      desc_en:
        "[Prerequisite Disassembly DAG · 18 rows] Self-referential directed edge on HardwareComponent (backed by component_disassembly_deps) specifying which prerequisite spare part must be removed prior to the target component, along with step_order, screw spec, and ZIF cable cautions.",
      ddl: `EDGE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.component_disassembly_deps\`\n    KEY (dependency_id)\n    SOURCE KEY (target_part_number) REFERENCES HardwareComponent (part_number)\n    DESTINATION KEY (prerequisite_part_number) REFERENCES HardwareComponent (part_number)\n    LABEL REQUIRES_REMOVAL_OF\n    PROPERTIES (dependency_id, step_order, relationship_type, fastener_spec, cable_disconnect_note, safety_warning, manual_section_ref, manual_page_ref)\n)`
    },
    {
      id: "EDGE_USES_SYSBOARD",
      source: "CLS_SKU",
      target: "CLS_HW_COMP",
      rel: "USES_SYSTEM_BOARD",
      badgeLabel: "USES_SYSTEM_BOARD (15)",
      color: 0x3b6ea5,
      badgeOffsetY: 12,
      view: "product_skus_and_configs (15 rows)",
      joinKeys: "ProductSKU.system_board_part_number ➔ HardwareComponent.part_number",
      desc_ko:
        "[SKU별 전용 시스템 보드 매핑 · 15건] HP Dragonfly G3 / Folio G3는 CPU와 LPDDR5(16GB/32GB) 메모리가 마더보드에 온보드 납땜(Soldered)되어 있으므로, 각 노트북 SKU가 사용하는 정확한 시스템 보드 스페어 파트 번호를 1:1로 연결하는 핵심 정형 엣지입니다.",
      desc_en:
        "[SKU-to-Motherboard Binding · 15 rows] Links each configured ProductSKU to its exact soldered CPU + LPDDR5 System Board spare part in HardwareComponent via system_board_part_number.",
      ddl: `EDGE TABLES (\n  \`hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs\` AS sku_uses_system_board\n    KEY (sku_id)\n    SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)\n    DESTINATION KEY (system_board_part_number) REFERENCES HardwareComponent (part_number)\n    LABEL USES_SYSTEM_BOARD\n    PROPERTIES (cpu_model, ram_gb, ram_type, wwan_module)\n)`
    },
    {
      id: "EDGE_BELONGS_TO_MODEL",
      source: "CLS_SKU",
      target: "CLS_MODEL",
      rel: "BELONGS_TO_MODEL",
      badgeLabel: "BELONGS_TO_MODEL (15)",
      color: 0x567ba8,
      badgeOffsetY: 10,
      view: "product_skus_and_configs (15 rows)",
      joinKeys: "ProductSKU.model_id ➔ ProductModel.model_id",
      desc_ko:
        "[세부 SKU → 마스터 모델 소속 · 15건] 15개 세부 노트북 구성 SKU(sku_id)가 속한 상위 제품군 마스터 모델(HP Dragonfly Folio G3 2-in-1 또는 Dragonfly G3 Clamshell)을 연결합니다.",
      desc_en:
        "[SKU-to-Series Hierarchy · 15 rows] Associates each ProductSKU configuration with its parent ProductModel series via model_id.",
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
            ${k ? "4. 테이블 (8)" : "4. Tables (8)"}
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
      ProductModel: "#3b735b"
    };

    const nodes = (q.graph.nodes || []).map((n) => ({
      id: n.id,
      label: n.label,
      title: `${n.group || "Node"} · ${n.id}`,
      shape: "dot",
      size: 21,
      color: {
        background: groupColors[n.group] || "#3b6ea5",
        border: isDark ? "#e3e3e3" : "#ffffff"
      },
      font: {
        color: isDark ? "#e3e3e3" : "#202124",
        size: 11.5,
        face: "Google Sans, Roboto Mono, sans-serif"
      },
      rawNode: n
    }));

    const edges = (q.graph.edges || []).map((e, idx) => ({
      id: `inst_e_${idx}`,
      from: e.from,
      to: e.to,
      label: e.label,
      arrows: "to",
      font: {
        size: 10,
        color: isDark ? "#e3e3e3" : "#202124",
        background: isDark ? "rgba(31,31,31,0.88)" : "rgba(255,255,255,0.92)",
        strokeWidth: 0,
        align: "middle"
      },
      color: { color: "#6b88a8", highlight: "#1a73e8" },
      rawEdge: e
    }));

    if (window.bqVisNet) window.bqVisNet.destroy();
    window.bqVisNet = new window.vis.Network(
      container,
      { nodes: new window.vis.DataSet(nodes), edges: new window.vis.DataSet(edges) },
      {
        physics: {
          solver: "forceAtlas2Based",
          forceAtlas2Based: { gravitationalConstant: -55, springLength: 125 },
          stabilization: { iterations: 130 }
        },
        interaction: { hover: true, tooltipDelay: 150 }
      }
    );

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
  // 7. MODULE 05 & 06: Agent & Benchmark Preview Workspaces
  // =========================================================================
  function renderAgentModule() {
    const box = document.getElementById("module-agent");
    if (!box) return;
    const k = isKo();
    const playbooks = OKF_FILES.filter((f) => f.category === "playbooks");
    const computations = OKF_FILES.filter((f) => f.category === "computations");

    box.innerHTML = `
      <div class="module-container">
        <div class="mod-hero">
          <div>
            <div class="mod-tag">05 · Ontology-Driven Hardware Diagnostic Agent Workspace</div>
            <div class="mod-title">
              ${
                k
                  ? "OKF v0.2 Playbook + BigQuery Property Graph(GQL) 기반 하이브리드 진단 에이전트"
                  : "Hybrid Diagnostic Agent Powered by OKF v0.2 Playbooks &amp; BigQuery Property Graph (GQL)"
              }
            </div>
            <div class="mod-desc">
              ${
                k
                  ? "에이전트가 질문에 답할 때 원문 PDF 전체를 무작정 검색하는 대신, Dataplex에 등록된 <code>index.md</code> → <code>playbooks/</code> → <code>computations/</code>를 단계적(Progressive Disclosure)으로 탐색하고 <code>hp_dragonfly_ontology_graph</code>에 검증된 GQL을 실행하여 100% 근거가 확보된 답변을 생성합니다."
                  : "Instead of blindly retrieving raw PDF chunks, the agent traverses the Dataplex-synced OKF hierarchy (<code>index.md</code> → <code>playbooks/</code> → <code>computations/</code>) via Progressive Disclosure and executes attested GQL queries against <code>hp_dragonfly_ontology_graph</code>."
              }
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end; flex-shrink:0;">
            <span class="mod-badge green">2 Triage Playbooks Active</span>
            <span class="mod-badge blue">2 Attested Computations Ready</span>
          </div>
        </div>

        <div class="mod-grid-2">
          ${playbooks
            .map(
              (pb) => `
            <div class="mod-card">
              <div class="mod-card-header">
                <div class="mod-card-title">
                  <span class="material-symbols-outlined" style="color:var(--gcp-blue);">menu_book</span>
                  <span>${escapeHtml((pb.frontmatter && pb.frontmatter.title) || pb.filename)}</span>
                </div>
                <span class="mod-badge green">Playbook · p.${pb.pdf_page}</span>
              </div>
              <div style="font-size:12.5px; color:var(--text-sub); line-height:1.6;">
                ${escapeHtml((pb.frontmatter && pb.frontmatter.description) || "")}
              </div>
              <div class="okf-md-content" style="max-height:280px; overflow-y:auto; padding:10px; background:var(--code-bg); border:1px solid var(--border); border-radius:6px;">
                ${window.marked ? window.marked.parse(pb.body || "") : escapeHtml(pb.body || "")}
              </div>
            </div>`
            )
            .join("")}
        </div>

        <div class="mod-grid-2">
          ${computations
            .map(
              (cp) => `
            <div class="mod-card">
              <div class="mod-card-header">
                <div class="mod-card-title">
                  <span class="material-symbols-outlined" style="color:var(--gcp-blue);">terminal</span>
                  <span>${escapeHtml((cp.frontmatter && cp.frontmatter.title) || cp.filename)}</span>
                </div>
                <span class="mod-badge blue">Attested Computation</span>
              </div>
              <div style="font-size:12.5px; color:var(--text-sub); line-height:1.6;">
                ${escapeHtml((cp.frontmatter && cp.frontmatter.description) || "")}
              </div>
              <div class="okf-md-content" style="max-height:260px; overflow-y:auto; padding:10px; background:var(--code-bg); border:1px solid var(--border); border-radius:6px;">
                ${window.marked ? window.marked.parse(cp.body || "") : escapeHtml(cp.body || "")}
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderBenchmarkModule() {
    const box = document.getElementById("module-benchmark");
    if (!box) return;
    const k = isKo();

    box.innerHTML = `
      <div class="module-container">
        <div class="mod-hero">
          <div>
            <div class="mod-tag">06 · Standard Vector RAG vs. Ontology Graph RAG Benchmark</div>
            <div class="mod-title">
              ${
                k
                  ? "단순 PDF 벡터 검색(Vector RAG) vs. BigQuery Property Graph + OKF v0.2 비교 검증"
                  : "Standard PDF Chunk Vector RAG vs. BigQuery Property Graph + OKF v0.2 Benchmark"
              }
            </div>
            <div class="mod-desc">
              ${
                k
                  ? "HP Dragonfly Folio G3 서비스 매뉴얼(109p) 및 8개 정형 테이블을 대상으로 멀티홉 분해 순서(Disassembly DAG), SKU별 온보드 시스템 보드 매핑, LED 점멸 코드 진단 시나리오를 비교 평가합니다."
                  : "Evaluates multi-hop disassembly precedence (DAG), soldered LPDDR5 SKU-to-System-Board resolution, and POST LED blink code triage across Vector RAG vs. our Ontology Layer."
              }
            </div>
          </div>
          <span class="mod-badge green">Ontology Accuracy: 100% Grounded</span>
        </div>

        <div class="mod-card">
          <div class="mod-card-header">
            <div class="mod-card-title">
              <span class="material-symbols-outlined" style="color:var(--gcp-blue);">compare_arrows</span>
              <span>${k ? "핵심 엔지니어링 평가 시나리오 비교표" : "Core Engineering Evaluation Scenarios"}</span>
            </div>
          </div>
          <table class="mod-table">
            <thead>
              <tr>
                <th>${k ? "평가 시나리오" : "Evaluation Scenario"}</th>
                <th>${k ? "일반 PDF 청크 Vector RAG 한계" : "Naive PDF Chunk Vector RAG Failure Mode"}</th>
                <th>${k ? "HP Dragonfly 온톨로지 (GQL + OKF v0.2) 해법" : "HP Dragonfly Ontology (GQL + OKF v0.2) Resolution"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>1. Multi-Hop FRU Disassembly Order</b><br><span style="font-size:11.5px; color:var(--text-sub);">System Board / Thermal Fan Replacement</span></td>
                <td>${
                  k
                    ? "5장(pp.29-72) 여러 페이지에 흩어진 선행 분리 단계를 누락하여 배터리 분리 전 리본 케이블 탈거를 안내함"
                    : "Misses cross-page prerequisite steps in Chapter 5 (pp. 29–72), risking 700V ESD damage"
                }</td>
                <td>${
                  k
                    ? "<code>REQUIRES_REMOVAL_OF</code> 엣지 탐색으로 Bottom Cover(N22918-001) → Battery(M90788-005) → Heatsink 순서 및 나사 규격을 100% 보장"
                    : "Traverses <code>REQUIRES_REMOVAL_OF</code> edges for deterministic step order, screw specs, and ESD rules"
                }</td>
              </tr>
              <tr>
                <td><b>2. Soldered LPDDR5 System Board SKU Match</b><br><span style="font-size:11.5px; color:var(--text-sub);">i7-1265U vPro + 32GB + 5G WWAN</span></td>
                <td>${
                  k
                    ? "표3-1의 16개 유사 시스템 보드 파트 번호 중 비-vPro 또는 16GB 보드 번호를 잘못 매칭함"
                    : "Confuses 16 adjacent system board part numbers in Table 3-1 across RAM/vPro variants"
                }</td>
                <td>${
                  k
                    ? "<code>ProductSKU -[:USES_SYSTEM_BOARD]-> HardwareComponent</code> 정형 그래프 조인으로 단일 스페어 파트 번호를 정확히 반환"
                    : "Exact join via <code>ProductSKU -[:USES_SYSTEM_BOARD]-> HardwareComponent</code> in BigQuery Property Graph"
                }</td>
              </tr>
              <tr>
                <td><b>3. LED Blink 3.2 &amp; Camera Privacy Triage</b><br><span style="font-size:11.5px; color:var(--text-sub);">TS-DFG3-001 / TS-DFG3-005</span></td>
                <td>${
                  k
                    ? "즉시 메인보드 또는 3K2K OLED 패널 통교체(고가 FRU)를 권고하여 불필요한 수리 비용 유발"
                    : "Immediately recommends costly motherboard or full OLED display replacement"
                }</td>
                <td>${
                  k
                    ? "OKF Playbook과 <code>hardware-fru-replacement-rate</code> 지표를 결합해 무분해 HP Sure Start 복구 및 펌웨어(SoftPaq) 해결책을 선제 제시"
                    : "Applies OKF Playbooks &amp; SoftPaq remediation before escalating to physical FRU replacement"
                }</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

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
    switchModule("intro");
  });
})();
