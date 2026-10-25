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
    setTxt("lbl-open-tables", "8개 정형 테이블 브라우저", "Browse 8 BQ Tables");
    setTxt("lbl-inst-fit", "화면 맞춤", "Fit Screen");
    setTxt("lbl-inst-results", "GQL 실행 결과 테이블 토글", "Toggle GQL Result Table");
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
  // =========================================================================
  window.setBqGraphMode = function (mode) {
    BQ_GRAPH_MODE = mode;
    const btnClass = document.getElementById("bq-btn-class-mode");
    const btnInst = document.getElementById("bq-btn-inst-mode");
    const threeBox = document.getElementById("bq-three-container");
    const visBox = document.getElementById("bq-vis-container");
    const camToolbar = document.getElementById("bq-cam-toolbar");
    const instToolbar = document.getElementById("bq-inst-toolbar");
    const banner = document.getElementById("bq-cq-banner");

    if (btnClass) btnClass.classList.toggle("active", mode === "CLASS");
    if (btnInst) btnInst.classList.toggle("active", mode === "INSTANCE");

    if (mode === "CLASS") {
      if (threeBox) threeBox.style.display = "block";
      if (visBox) visBox.style.display = "none";
      if (camToolbar) camToolbar.style.display = "flex";
      if (instToolbar) instToolbar.style.display = "none";
      if (banner) banner.style.display = "none";
      initThreeScene();
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
    const drawer = document.getElementById("bq-detail-drawer");
    if (!drawer) return;
    if (tname) {
      SELECTED_BQ_TABLE = tname;
      drawer.classList.add("open");
    } else {
      drawer.classList.toggle("open");
    }
    if (drawer.classList.contains("open")) {
      renderBqTableDrawerContent();
    }
  };

  window.closeBqDrawer = function () {
    const drawer = document.getElementById("bq-detail-drawer");
    if (drawer) drawer.classList.remove("open");
  };

  window.selectDrawerTable = function (tname, mode) {
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
    if (titleEl) titleEl.textContent = `${curT.table_name} (${curT.row_count} rows)`;

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
    // Open the 8-table drawer initially so user sees both the 3D topology and the 8 English tables immediately
    const drawer = document.getElementById("bq-detail-drawer");
    if (drawer && !drawer.classList.contains("open")) {
      drawer.classList.add("open");
      renderBqTableDrawerContent();
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
      shape: "dot",
      size: 20,
      color: {
        background: groupColors[n.group] || "#3b6ea5",
        border: isDark ? "#e3e3e3" : "#ffffff"
      },
      font: {
        color: isDark ? "#e3e3e3" : "#202124",
        size: 11.5,
        face: "Google Sans, Roboto Mono, sans-serif"
      }
    }));

    const edges = (q.graph.edges || []).map((e) => ({
      from: e.from,
      to: e.to,
      label: e.label,
      arrows: "to",
      font: { size: 10, color: isDark ? "#9aa0a6" : "#5f6368", align: "middle" },
      color: { color: "#80868b", highlight: "#1a73e8" }
    }));

    if (window.bqVisNet) window.bqVisNet.destroy();
    window.bqVisNet = new window.vis.Network(
      container,
      { nodes: new window.vis.DataSet(nodes), edges: new window.vis.DataSet(edges) },
      {
        physics: {
          solver: "forceAtlas2Based",
          forceAtlas2Based: { gravitationalConstant: -55, springLength: 120 },
          stabilization: { iterations: 120 }
        },
        interaction: { hover: true }
      }
    );
  }

  function initThreeScene() {
    const container = document.getElementById("bq-three-container");
    if (!container || !window.THREE) return;
    if (threeState && threeState.animId) cancelAnimationFrame(threeState.animId);

    const THREE = window.THREE;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 620;
    const isDark = document.body.classList.contains("dark-mode");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x1f1f1f : 0xf8f9fa);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    let controls = null;
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight.position.set(14, 24, 18);
    scene.add(dirLight);

    // Upper Plane: 8 Structured BigQuery Tables (y = +3.5)
    const planeGeo = new THREE.PlaneGeometry(24, 14);
    const upPlane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({ color: 0x3b6ea5, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    upPlane.rotation.x = Math.PI / 2;
    upPlane.position.y = 3.5;
    scene.add(upPlane);

    // Lower Plane: 5 Unstructured PDF Reference Concepts (y = -3.5)
    const lowPlane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({ color: 0x3b735b, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    lowPlane.rotation.x = Math.PI / 2;
    lowPlane.position.y = -3.5;
    scene.add(lowPlane);

    const upPts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const v = new THREE.Vector3(Math.cos(a) * 8.2, 3.5, Math.sin(a) * 4.4);
      upPts.push(v);
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.75, 24, 24),
        new THREE.MeshStandardMaterial({ color: i === 3 ? 0xb88a44 : 0x3b6ea5, roughness: 0.35 })
      );
      m.position.copy(v);
      scene.add(m);
    }

    const lowPts = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const v = new THREE.Vector3(Math.cos(a) * 6.5, -3.5, Math.sin(a) * 3.5);
      lowPts.push(v);
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.8, 1.15),
        new THREE.MeshStandardMaterial({ color: 0x3b735b, roughness: 0.4 })
      );
      m.position.copy(v);
      scene.add(m);
    }

    for (let i = 0; i < upPts.length; i++) {
      const next = upPts[(i + 1) % upPts.length];
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([upPts[i], next]),
          new THREE.LineBasicMaterial({ color: 0x3b6ea5, transparent: true, opacity: 0.55 })
        )
      );
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([upPts[i], lowPts[i % lowPts.length]]),
          new THREE.LineBasicMaterial({ color: 0xb88a44, transparent: true, opacity: 0.5 })
        )
      );
    }

    threeState = { scene, camera, renderer, controls, angle: 0.5, animId: null };

    function animate() {
      if (ACTIVE_MODULE !== "bq-graph" || BQ_GRAPH_MODE !== "CLASS") return;
      threeState.animId = requestAnimationFrame(animate);
      if (controls) {
        controls.update();
      } else {
        threeState.angle += 0.003;
        camera.position.x = Math.sin(threeState.angle) * 28;
        camera.position.z = Math.cos(threeState.angle) * 28;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  window.bqCamReset = function () {
    if (threeState && threeState.camera) {
      threeState.camera.position.set(0, 15, 30);
      threeState.camera.lookAt(0, 0, 0);
    }
  };

  window.bqCamTop = function () {
    if (threeState && threeState.camera) {
      threeState.camera.position.set(0, 32, 0.1);
      threeState.camera.lookAt(0, 0, 0);
    }
  };

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
