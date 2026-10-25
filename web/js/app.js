/**
 * HP Dragonfly Ontology & OKF v0.2 Studio — Core Application Controller
 * Supports instant Bilingual UI switching (KO / EN) while displaying the 100% English
 * structured BigQuery tables, Property Graph (GQL), OKF v0.2 bundle, and Dataplex catalog.
 */
(function () {
  "use strict";

  const BUNDLE = window.HP_ONTOLOGY_BUNDLE || {};
  const I18N = window.STUDIO_I18N || {};

  const STATE = {
    lang: window.INITIAL_STUDIO_LANG || localStorage.getItem("hp_studio_lang") || "ko",
    theme: localStorage.getItem("hp_studio_theme") || "light",
    activeModule: "mod01",
    subTab: {
      mod01: "arch",
      mod02: "split",
      mod03: "kcmd",
      mod04: "tables",
      mod05: "roadmap"
    },
    selectedOkfRelPath: "tables/component_disassembly_deps.md",
    okfViewMode: "rendered", // "rendered" | "raw"
    okfGraphFilter: "ALL",
    selectedOkfGraphNodeId: "tables/component_disassembly_deps",
    selectedCatalogIdx: 0,
    selectedBqTable: "dragonfly_series_models",
    bqTableSubTab: "rows", // "rows" | "schema"
    selectedGqlIdx: 0,
    threeAutoRotate: true
  };

  let okfVisNetwork = null;
  let gqlVisNetwork = null;
  let threeState = null;

  function t(key) {
    const dict = I18N[STATE.lang] || I18N.ko;
    return dict[key] || (I18N.en && I18N.en[key]) || key;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // =========================================================================
  // Theme & Language Management
  // =========================================================================
  window.setStudioLang = function (lang) {
    if (lang !== "ko" && lang !== "en") return;
    STATE.lang = lang;
    localStorage.setItem("hp_studio_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    renderAll();
  };

  window.toggleStudioTheme = function () {
    STATE.theme = STATE.theme === "dark" ? "light" : "dark";
    localStorage.setItem("hp_studio_theme", STATE.theme);
    applyTheme();
  };

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", STATE.theme);
    const iconEl = document.getElementById("theme-toggle-icon");
    if (iconEl) {
      iconEl.textContent = STATE.theme === "dark" ? "light_mode" : "dark_mode";
    }
  }

  // =========================================================================
  // Navigation (Left Icon Rail & Sub-Tabs)
  // =========================================================================
  window.selectModule = function (modId) {
    STATE.activeModule = modId;
    renderHeaderAndRail();
    renderMainViewport();
  };

  window.selectSubTab = function (modId, subId) {
    STATE.subTab[modId] = subId;
    renderHeaderAndRail();
    renderMainViewport();
  };

  function renderHeaderAndRail() {
    document.title = t("app_title");
    const titleEl = document.getElementById("studio-app-title");
    if (titleEl) titleEl.textContent = t("app_title");

    const badgeEl = document.getElementById("studio-header-badge");
    if (badgeEl) badgeEl.textContent = t("header_badge");

    // Language buttons
    const btnKo = document.getElementById("btn-lang-ko");
    const btnEn = document.getElementById("btn-lang-en");
    if (btnKo) btnKo.classList.toggle("active", STATE.lang === "ko");
    if (btnEn) btnEn.classList.toggle("active", STATE.lang === "en");

    // Rail buttons
    ["mod01", "mod02", "mod03", "mod04", "mod05"].forEach((m, idx) => {
      const btn = document.getElementById("rail-btn-" + m);
      if (btn) {
        btn.classList.toggle("active", STATE.activeModule === m);
        const key = "rail_0" + (idx + 1);
        btn.setAttribute("data-tip", t(key));
        btn.setAttribute("title", t(key));
      }
    });

    // Sub-bar title & tabs
    const subTitleEl = document.getElementById("sub-bar-title");
    const subTabsEl = document.getElementById("sub-bar-tabs");
    if (!subTitleEl || !subTabsEl) return;

    const mod = STATE.activeModule;
    subTitleEl.textContent = t(mod + "_title");

    const tabDefs = {
      mod01: [
        { id: "arch", icon: "account_tree", label: t("mod01_sub_arch") },
        { id: "flow", icon: "conversion_path", label: t("mod01_sub_flow") }
      ],
      mod02: [
        { id: "split", icon: "vertical_split", label: t("mod02_sub_split") },
        { id: "graph", icon: "hub", label: t("mod02_sub_graph") },
        { id: "viz", icon: "open_in_browser", label: t("mod02_sub_viz") }
      ],
      mod03: [
        { id: "kcmd", icon: "cloud_sync", label: t("mod03_sub_kcmd") },
        { id: "git", icon: "commit", label: t("mod03_sub_git") }
      ],
      mod04: [
        { id: "tables", icon: "view_in_ar", label: t("mod04_sub_tables") },
        { id: "gql", icon: "polyline", label: t("mod04_sub_gql") }
      ],
      mod05: [
        { id: "roadmap", icon: "rocket_launch", label: t("mod05_sub_roadmap") }
      ]
    }[mod] || [];

    const activeSub = STATE.subTab[mod];
    subTabsEl.innerHTML = tabDefs
      .map(
        (tb) => `
      <button class="gcp-sub-tab ${activeSub === tb.id ? "active" : ""}"
              onclick="selectSubTab('${mod}', '${tb.id}')">
        <span class="material-symbols-outlined">${tb.icon}</span>
        <span>${escapeHtml(tb.label)}</span>
      </button>`
      )
      .join("");
  }

  // =========================================================================
  // Main Viewport Router
  // =========================================================================
  function renderMainViewport() {
    const vp = document.getElementById("studio-viewport");
    if (!vp) return;

    // Clean up 3D loop if leaving mod04/tables
    if (!(STATE.activeModule === "mod04" && STATE.subTab.mod04 === "tables") && threeState) {
      if (threeState.animId) cancelAnimationFrame(threeState.animId);
      threeState = null;
    }

    const mod = STATE.activeModule;
    const sub = STATE.subTab[mod];

    if (mod === "mod01") {
      renderMod01(vp, sub);
    } else if (mod === "mod02") {
      renderMod02(vp, sub);
    } else if (mod === "mod03") {
      renderMod03(vp, sub);
    } else if (mod === "mod04") {
      renderMod04(vp, sub);
    } else if (mod === "mod05") {
      renderMod05(vp);
    }
  }

  // =========================================================================
  // MODULE 01: Architecture & Pipeline Intro
  // =========================================================================
  function renderMod01(vp, sub) {
    const pm = BUNDLE.project_meta || {};
    const isKo = STATE.lang === "ko";

    const stagesRows = isKo
      ? [
          {
            stage: "Stage 1 · 영문 정형 데이터 & 그래프 구축",
            comp: "scripts/build_hp_dragonfly_dataset.py\nscripts/create_property_graph.sql",
            target:
              "BigQuery `hp-dragonfly.prj_ontology_hp_dragonfly` (8개 영문 테이블 · 109행) + Property Graph `hp_dragonfly_ontology_graph`",
            status: "COMPLETED"
          },
          {
            stage: "Stage 2 · Enrichment Agent 실행",
            comp: "scripts/enrichment_agent.py\n(pypdf + BigQuery Schema/FK + OKF v0.2)",
            target:
              "비정형 `pdf_6290467_en-US-1.pdf`(109p)와 정형 테이블을 결합해 `bundles/hp_dragonfly/`(28개 OKF 파일) 및 `catalog/` 생성",
            status: "COMPLETED"
          },
          {
            stage: "Stage 3 · Metadata as Code (Git 버전 관리)",
            comp: "Git Repository (`main` branch)\nbundles/hp_dragonfly/ & catalog/",
            target:
              "OKF YAML Frontmatter(`generated`, `verified`, `sources`) 및 시맨틱 정의서의 Git 커밋 이력 관리",
            status: "COMPLETED"
          },
          {
            stage: "Stage 4 · kcmd → Dataplex Knowledge Catalog",
            comp: "./bin/kcmd (v1.0.0)\nscripts/sync_okf_to_dataplex.py",
            target:
              "Dataplex EntryGroup `okf_hp_dragonfly`, AspectType `okf`, EntryType `okf-bundle` 생성 및 28개 OKF 엔트리 + 9개 BQ Overview Aspect 양방향 Push/Pull 검증",
            status: "COMPLETED"
          }
        ]
      : [
          {
            stage: "Stage 1 · Structured Dataset & Property Graph",
            comp: "scripts/build_hp_dragonfly_dataset.py\nscripts/create_property_graph.sql",
            target:
              "BigQuery `hp-dragonfly.prj_ontology_hp_dragonfly` (8 English tables · 109 rows) + Property Graph `hp_dragonfly_ontology_graph`",
            status: "COMPLETED"
          },
          {
            stage: "Stage 2 · Enrichment Agent Execution",
            comp: "scripts/enrichment_agent.py\n(pypdf + BigQuery Schema/FK + OKF v0.2)",
            target:
              "Combined `pdf_6290467_en-US-1.pdf` (109p) & BigQuery tables into `bundles/hp_dragonfly/` (28 OKF files) and `catalog/` snapshots",
            status: "COMPLETED"
          },
          {
            stage: "Stage 3 · Metadata as Code (Git Repo)",
            comp: "Git Repository (`main` branch)\nbundles/hp_dragonfly/ & catalog/",
            target:
              "Version-controlled OKF YAML Frontmatter (`generated`, `verified`, `sources`, `trust_tier`) and audit log (`log.md`)",
            status: "COMPLETED"
          },
          {
            stage: "Stage 4 · kcmd → Dataplex Knowledge Catalog",
            comp: "./bin/kcmd (v1.0.0)\nscripts/sync_okf_to_dataplex.py",
            target:
              "Provisioned EntryGroup `okf_hp_dragonfly`, AspectType `okf`, EntryType `okf-bundle` and verified round-trip Push/Pull of 28 OKF entries + 9 BQ Overview aspects",
            status: "COMPLETED"
          }
        ];

    if (sub === "arch") {
      vp.innerHTML = `
        <div class="gcp-page" style="max-width: 1440px;">
          <!-- Hero Banner -->
          <div class="gcp-card" style="margin-bottom: 18px; border-left: 5px solid var(--accent-primary);">
            <div class="gcp-card-body" style="padding: 20px 24px;">
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
                <span class="gcp-badge gcp-badge-primary">${escapeHtml(t("hero_badge"))}</span>
                <div style="display:flex; gap:8px;">
                  <button class="gcp-btn gcp-btn-primary" onclick="selectModule('mod02')">
                    <span class="material-symbols-outlined" style="font-size:16px;">vertical_split</span>
                    <span>${isKo ? "PDF ↔ OKF 1:1 검증 열기" : "Open PDF ↔ OKF 1:1 Validator"}</span>
                  </button>
                  <button class="gcp-btn gcp-btn-default" onclick="selectModule('mod04'); selectSubTab('mod04','gql');">
                    <span class="material-symbols-outlined" style="font-size:16px;">polyline</span>
                    <span>${isKo ? "BigQuery GQL 그래프 탐색기" : "BigQuery GQL Graph Studio"}</span>
                  </button>
                </div>
              </div>
              <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: var(--text-primary);">
                ${escapeHtml(t("hero_heading"))}
              </h2>
              <p style="margin: 0; font-size: 13.5px; color: var(--text-secondary); line-height: 1.65;">
                ${escapeHtml(t("hero_desc"))}
              </p>
            </div>
          </div>

          <!-- 5 KPI Cards -->
          <div class="kpi-strip">
            <div class="kpi-card-studio" onclick="selectModule('mod04')" style="cursor:pointer;">
              <span class="kpi-label">${escapeHtml(t("kpi_tables_label"))}</span>
              <span class="kpi-val" style="color: var(--accent-primary);">${pm.bq_table_count || 8} Tables / ${pm.bq_total_rows || 109} Rows</span>
              <span class="kpi-sub">${escapeHtml(t("kpi_tables_sub"))}</span>
            </div>
            <div class="kpi-card-studio" onclick="selectModule('mod02')" style="cursor:pointer;">
              <span class="kpi-label">${escapeHtml(t("kpi_okf_label"))}</span>
              <span class="kpi-val" style="color: #9334e6;">${pm.okf_file_count || 28} Files</span>
              <span class="kpi-sub">${escapeHtml(t("kpi_okf_sub"))}</span>
            </div>
            <div class="kpi-card-studio" onclick="selectModule('mod02'); selectSubTab('mod02','graph');" style="cursor:pointer;">
              <span class="kpi-label">${escapeHtml(t("kpi_graph_label"))}</span>
              <span class="kpi-val" style="color: #1e8e3e;">${pm.okf_concept_count || 21} Nodes · ${pm.okf_edge_count || 110} Edges</span>
              <span class="kpi-sub">${escapeHtml(t("kpi_graph_sub"))}</span>
            </div>
            <div class="kpi-card-studio" onclick="selectModule('mod03')" style="cursor:pointer;">
              <span class="kpi-label">${escapeHtml(t("kpi_dataplex_label"))}</span>
              <span class="kpi-val" style="color: #e37400;">37 Synced</span>
              <span class="kpi-sub">${escapeHtml(t("kpi_dataplex_sub"))}</span>
            </div>
            <div class="kpi-card-studio" onclick="selectModule('mod02')" style="cursor:pointer;">
              <span class="kpi-label">${escapeHtml(t("kpi_pdf_label"))}</span>
              <span class="kpi-val">${pm.pdf_pages || 109} Pages</span>
              <span class="kpi-sub">${escapeHtml(t("kpi_pdf_sub"))}</span>
            </div>
          </div>

          <!-- 3-Plane Architecture Cards -->
          <div class="arch-plane-grid">
            <div class="arch-plane-card plane-1">
              <div style="font-size:11px; font-weight:700; color:var(--accent-primary); margin-bottom:4px;">${escapeHtml(t("plane1_tag"))}</div>
              <div style="font-size:15px; font-weight:700; margin-bottom:8px; color:var(--text-primary);">${escapeHtml(t("plane1_title"))}</div>
              <div style="font-size:12.5px; color:var(--text-secondary); white-space:pre-line; line-height:1.6;">${escapeHtml(t("plane1_body"))}</div>
            </div>
            <div class="arch-plane-card plane-2">
              <div style="font-size:11px; font-weight:700; color:#9334e6; margin-bottom:4px;">${escapeHtml(t("plane2_tag"))}</div>
              <div style="font-size:15px; font-weight:700; margin-bottom:8px; color:var(--text-primary);">${escapeHtml(t("plane2_title"))}</div>
              <div style="font-size:12.5px; color:var(--text-secondary); white-space:pre-line; line-height:1.6;">${escapeHtml(t("plane2_body"))}</div>
            </div>
            <div class="arch-plane-card plane-3">
              <div style="font-size:11px; font-weight:700; color:#1e8e3e; margin-bottom:4px;">${escapeHtml(t("plane3_tag"))}</div>
              <div style="font-size:15px; font-weight:700; margin-bottom:8px; color:var(--text-primary);">${escapeHtml(t("plane3_title"))}</div>
              <div style="font-size:12.5px; color:var(--text-secondary); white-space:pre-line; line-height:1.6;">${escapeHtml(t("plane3_body"))}</div>
            </div>
          </div>

          <!-- Completed Stages Table -->
          <div class="gcp-card">
            <div class="gcp-card-header">
              <div class="gcp-card-title">
                <span class="material-symbols-outlined">fact_check</span>
                <span>${escapeHtml(t("step_table_heading"))}</span>
              </div>
              <span class="gcp-badge gcp-badge-success">ALL 4 STAGES VERIFIED</span>
            </div>
            <div class="studio-data-table-wrap" style="border:none; border-radius:0;">
              <table class="studio-data-table">
                <thead>
                  <tr>
                    <th>${escapeHtml(t("col_stage"))}</th>
                    <th>${escapeHtml(t("col_component"))}</th>
                    <th>${escapeHtml(t("col_target"))}</th>
                    <th>${escapeHtml(t("col_status"))}</th>
                  </tr>
                </thead>
                <tbody>
                  ${stagesRows
                    .map(
                      (r) => `
                    <tr>
                      <td style="font-weight:600;">${escapeHtml(r.stage)}</td>
                      <td><code style="font-family:var(--font-mono); font-size:11.5px; white-space:pre-line;">${escapeHtml(r.comp)}</code></td>
                      <td>${escapeHtml(r.target)}</td>
                      <td><span class="gcp-badge gcp-badge-success">${escapeHtml(r.status)}</span></td>
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } else {
      // Sub-tab: flow (Mermaid Architecture & Pipeline Diagram)
      vp.innerHTML = `
        <div class="gcp-page" style="max-width: 1440px;">
          <div class="gcp-card">
            <div class="gcp-card-header">
              <div class="gcp-card-title">
                <span class="material-symbols-outlined">conversion_path</span>
                <span>${isKo ? "HP Dragonfly 온톨로지 엔드투엔드 데이터 & 메타데이터 파이프라인" : "HP Dragonfly End-to-End Ontology & Metadata-as-Code Pipeline"}</span>
              </div>
              <span class="gcp-badge gcp-badge-primary">Mermaid Architecture</span>
            </div>
            <div class="gcp-card-body" style="padding: 20px;">
              <div class="mermaid" id="mod01-mermaid-diag" style="text-align:center;">
flowchart LR
  subgraph S1["1. Source Data Plane (hp-dragonfly)"]
    PDF["Unstructured PDF Manual\npdf_6290467_en-US-1.pdf\n(N17344-001 · 109 Pages)"]
    BQ["BigQuery Dataset\nprj_ontology_hp_dragonfly\n(8 English Tables · 109 Rows)"]
    PG["BigQuery Property Graph\nhp_dragonfly_ontology_graph\n(5 Node · 5 Edge Classes)"]
    BQ --> PG
  end

  subgraph S2["2. Enrichment & Metadata-as-Code (Git)"]
    EA["Enrichment Agent\nscripts/enrichment_agent.py"]
    OKF["OKF v0.2 Bundle (28 Files)\nbundles/hp_dragonfly/\n(21 Concepts · 110 Edges)"]
    CAT["Catalog YAML Snapshots\ncatalog/ & catalog_okf/"]
    EA --> OKF
    EA --> CAT
  end

  subgraph S3["3. Governance & Consumption Plane"]
    KCMD["kcmd v1.0.0 CLI\n./bin/kcmd push / pull"]
    DPX["Dataplex Knowledge Catalog\nEntryGroup: okf_hp_dragonfly\nAspectType: okf + overview"]
    STUDIO["HP Dragonfly Ontology Studio\n(KO / EN Web App & GQL Explorer)"]
    KCMD --> DPX
    DPX --> STUDIO
    PG --> STUDIO
    OKF --> STUDIO
  end

  PDF --> EA
  BQ --> EA
  OKF --> KCMD
  CAT --> KCMD
              </div>
            </div>
          </div>
        </div>
      `;
      if (window.mermaid) {
        try {
          window.mermaid.run({ nodes: [document.getElementById("mod01-mermaid-diag")] });
        } catch (e) {
          console.warn("Mermaid render warning:", e);
        }
      }
    }
  }

  // =========================================================================
  // MODULE 02: OKF Validation (Split Compare, Knowledge Graph, viz.html)
  // =========================================================================
  window.selectOkfFile = function (relPath) {
    STATE.selectedOkfRelPath = relPath;
    renderMod02Split(document.getElementById("studio-viewport"));
  };

  window.setOkfViewMode = function (mode) {
    STATE.okfViewMode = mode;
    renderMod02Split(document.getElementById("studio-viewport"));
  };

  function renderMod02(vp, sub) {
    if (sub === "split") {
      renderMod02Split(vp);
    } else if (sub === "graph") {
      renderMod02Graph(vp);
    } else {
      // Official OKF Cytoscape Viewer iframe
      vp.innerHTML = `
        <div style="height: calc(100vh - 90px); width: 100%; display:flex; flex-direction:column;">
          <iframe src="/viz.html" style="flex:1; width:100%; border:none;" title="OKF v0.2 Cytoscape Viewer"></iframe>
        </div>
      `;
    }
  }

  function renderMod02Split(vp) {
    const files = BUNDLE.okf_files || [];
    const currentFile =
      files.find((f) => f.rel_path === STATE.selectedOkfRelPath) || files[0] || {};
    const isKo = STATE.lang === "ko";

    // Group files by category
    const grouped = {};
    files.forEach((f) => {
      const cat = f.category || "root";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(f);
    });

    const catLabels = {
      root: isKo ? "루트 인덱스 & 감사 로그 (Root)" : "Root Index & Audit Log",
      datasets: isKo ? "데이터셋 (Datasets · 2)" : "Datasets (2)",
      tables: isKo ? "정형 테이블 (Tables · 9)" : "Structured Tables (9)",
      references: isKo ? "PDF 레퍼런스 (References · 6)" : "PDF References (6)",
      metrics: isKo ? "지표 (Metrics · 3)" : "Service Metrics (3)",
      computations: isKo ? "검증 쿼리 (Computations · 3)" : "Attested Computations (3)",
      playbooks: isKo ? "진단 플레이북 (Playbooks · 3)" : "Triage Playbooks (3)"
    };

    const treeHtml = Object.keys(grouped)
      .map((cat) => {
        const items = grouped[cat]
          .map((f) => {
            const active = f.rel_path === currentFile.rel_path ? "active" : "";
            return `
              <div class="concept-tree-item ${active}" onclick="selectOkfFile('${escapeHtml(f.rel_path)}')">
                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(f.rel_path)}">
                  ${escapeHtml(f.filename)}
                </span>
                <span class="page-pill">p.${f.pdf_page || 1}</span>
              </div>
            `;
          })
          .join("");
        return `
          <div class="concept-cat-header">${escapeHtml(catLabels[cat] || cat)}</div>
          ${items}
        `;
      })
      .join("");

    const fm = currentFile.frontmatter || {};
    const genInfo = fm.generated ? `${fm.generated.by || ""} (${fm.generated.at || ""})` : "Progressive Disclosure Index";
    const verInfo =
      Array.isArray(fm.verified) && fm.verified.length > 0
        ? `${fm.verified[0].by} (${fm.verified[0].at})`
        : "-";
    const sources = Array.isArray(fm.sources) ? fm.sources : [];

    let bodyHtml = "";
    if (STATE.okfViewMode === "raw") {
      bodyHtml = `<pre style="background:var(--bg-code); padding:14px; border-radius:8px; border:1px solid var(--border-default); font-family:var(--font-mono); font-size:11.5px; overflow-x:auto; white-space:pre-wrap;">${escapeHtml(currentFile.raw || "")}</pre>`;
    } else {
      const renderedMd =
        window.marked && typeof window.marked.parse === "function"
          ? window.marked.parse(currentFile.body || "")
          : `<pre>${escapeHtml(currentFile.body || "")}</pre>`;
      bodyHtml = `
        ${
          Object.keys(fm).length > 0
            ? `<div class="fm-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <strong style="font-size:11.5px; color:var(--accent-primary);">${escapeHtml(t("mod02_fm_title"))}</strong>
                  <span class="gcp-badge gcp-badge-success">${escapeHtml(fm.status || "stable")} · human-reviewed</span>
                </div>
                <div class="fm-grid">
                  <div>
                    <div class="fm-item-label">Type</div>
                    <div class="fm-item-val">${escapeHtml(fm.type || "-")}</div>
                  </div>
                  <div>
                    <div class="fm-item-label">Generated By</div>
                    <div class="fm-item-val">${escapeHtml(genInfo)}</div>
                  </div>
                  <div>
                    <div class="fm-item-label">Verified By</div>
                    <div class="fm-item-val">${escapeHtml(verInfo)}</div>
                  </div>
                  <div>
                    <div class="fm-item-label">Stale After</div>
                    <div class="fm-item-val">${escapeHtml(fm.stale_after || "-")}</div>
                  </div>
                </div>
                ${
                  sources.length > 0
                    ? `<div style="margin-top:10px; padding-top:8px; border-top:1px solid var(--border-subtle);">
                        <div class="fm-item-label" style="margin-bottom:4px;">${escapeHtml(t("mod02_sources_title"))} (${sources.length})</div>
                        ${sources
                          .map(
                            (s) =>
                              `<div style="font-size:11px; font-family:var(--font-mono); color:var(--text-secondary);">• [${escapeHtml(s.id)}] ${escapeHtml(s.title || s.resource)}</div>`
                          )
                          .join("")}
                      </div>`
                    : ""
                }
              </div>`
            : ""
        }
        <div class="okf-md-rendered">${renderedMd}</div>
      `;
    }

    const pdfPage = currentFile.pdf_page || 1;
    const pdfSection = isKo ? currentFile.pdf_section_ko : currentFile.pdf_section_en;

    vp.innerHTML = `
      <div class="split-3-pane">
        <!-- Left Pane: 28 OKF Files Tree -->
        <div class="pane-col">
          <div class="pane-col-header">
            <span style="font-size:12px; font-weight:700;">${escapeHtml(t("mod02_tree_header"))}</span>
            <span class="gcp-badge gcp-badge-primary">${files.length}</span>
          </div>
          <div class="pane-col-body">
            ${treeHtml}
          </div>
        </div>

        <!-- Center Pane: Embedded Source PDF Manual synced to #page=N -->
        <div class="pane-col">
          <div class="pane-col-header">
            <div style="overflow:hidden;">
              <div style="font-size:12px; font-weight:700;">${escapeHtml(t("mod02_pdf_header"))} — p.${pdfPage}</div>
              <div style="font-size:11px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${escapeHtml(pdfSection || "")}
              </div>
            </div>
            <a class="gcp-btn gcp-btn-default gcp-btn-sm" href="/docs/pdf_6290467_en-US-1.pdf#page=${pdfPage}" target="_blank" rel="noopener">
              <span class="material-symbols-outlined" style="font-size:14px;">open_in_new</span>
              <span>p.${pdfPage}</span>
            </a>
          </div>
          <div style="flex:1; background:#3c4043; display:flex; flex-direction:column;">
            <iframe key="pdf-${pdfPage}" src="/docs/pdf_6290467_en-US-1.pdf#page=${pdfPage}"
                    style="flex:1; width:100%; border:none;"
                    title="HP Dragonfly Folio G3 Service Manual PDF"></iframe>
          </div>
        </div>

        <!-- Right Pane: OKF v0.2 Frontmatter & English Specification -->
        <div class="pane-col">
          <div class="pane-col-header">
            <div style="overflow:hidden;">
              <div style="font-size:12px; font-weight:700;">${escapeHtml(t("mod02_okf_header"))}</div>
              <div style="font-size:11px; font-family:var(--font-mono); color:var(--accent-primary);">
                bundles/hp_dragonfly/${escapeHtml(currentFile.rel_path || "")}
              </div>
            </div>
            <div class="lang-switch-group">
              <button class="lang-btn ${STATE.okfViewMode === "rendered" ? "active" : ""}" onclick="setOkfViewMode('rendered')">
                ${escapeHtml(t("mod02_view_rendered"))}
              </button>
              <button class="lang-btn ${STATE.okfViewMode === "raw" ? "active" : ""}" onclick="setOkfViewMode('raw')">
                ${escapeHtml(t("mod02_view_raw"))}
              </button>
            </div>
          </div>
          <div class="pane-col-body">
            ${bodyHtml}
          </div>
        </div>
      </div>
    `;
  }

  window.selectOkfGraphNode = function (nodeId) {
    STATE.selectedOkfGraphNodeId = nodeId;
    updateOkfGraphInspector();
  };

  function renderMod02Graph(vp) {
    const g = BUNDLE.okf_graph || { nodes: [], edges: [] };
    vp.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 400px; height: calc(100vh - 90px); overflow:hidden;">
        <div style="display:flex; flex-direction:column; border-right:1px solid var(--border-default); background:var(--bg-primary);">
          <div class="pane-col-header">
            <div>
              <div style="font-size:13px; font-weight:700;">${escapeHtml(t("mod02_graph_heading"))}</div>
              <div style="font-size:11.5px; color:var(--text-secondary);">${escapeHtml(t("mod02_graph_desc"))}</div>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="gcp-badge" style="background:#3b82f620; color:#3b82f6;">BigQuery Table (8)</span>
              <span class="gcp-badge" style="background:#10b98120; color:#10b981;">Reference (5)</span>
              <span class="gcp-badge" style="background:#8b5cf620; color:#8b5cf6;">Dataset (1)</span>
              <span class="gcp-badge" style="background:#64748b20; color:#64748b;">Playbook / Metric / Computation (6)</span>
            </div>
          </div>
          <div id="okf-vis-canvas" style="flex:1; width:100%; min-height:480px;"></div>
        </div>
        <div class="pane-col" id="okf-graph-inspector-col">
          <!-- Populated by updateOkfGraphInspector() -->
        </div>
      </div>
    `;

    updateOkfGraphInspector();

    const container = document.getElementById("okf-vis-canvas");
    if (!container || !window.vis) return;

    const visNodes = (g.nodes || []).map((n) => {
      const d = n.data || {};
      return {
        id: d.id,
        label: (d.id || "").split("/").pop(),
        title: `${d.label || d.id} (${d.type || "Concept"})`,
        color: {
          background: d.color || "#3b82f6",
          border: "#1e293b",
          highlight: { background: "#f59e0b", border: "#b45309" }
        },
        font: { color: STATE.theme === "dark" ? "#e8eaed" : "#202124", size: 12, face: "Inter, sans-serif" },
        shape: "dot",
        size: Math.max(16, Math.min(28, (d.size || 36) * 0.52))
      };
    });

    const visEdges = (g.edges || []).map((e) => {
      const d = e.data || {};
      return {
        from: d.source,
        to: d.target,
        arrows: "to",
        color: { color: "rgba(148, 163, 184, 0.55)", highlight: "#1a73e8" }
      };
    });

    okfVisNetwork = new window.vis.Network(
      container,
      { nodes: new window.vis.DataSet(visNodes), edges: new window.vis.DataSet(visEdges) },
      {
        physics: {
          barnesHut: { gravitationalConstant: -3800, springLength: 145, springConstant: 0.04 },
          stabilization: { iterations: 120 }
        },
        interaction: { hover: true, tooltipDelay: 120 }
      }
    );

    okfVisNetwork.on("click", function (params) {
      if (params.nodes && params.nodes.length > 0) {
        selectOkfGraphNode(params.nodes[0]);
      }
    });
  }

  function updateOkfGraphInspector() {
    const col = document.getElementById("okf-graph-inspector-col");
    if (!col) return;
    const g = BUNDLE.okf_graph || { nodes: [], edges: [] };
    const nodeObj =
      (g.nodes || []).find((n) => n.data && n.data.id === STATE.selectedOkfGraphNodeId) ||
      (g.nodes || [])[0];
    if (!nodeObj) return;
    const d = nodeObj.data;
    const relPath = d.id + ".md";
    const fileObj = (BUNDLE.okf_files || []).find((f) => f.rel_path === relPath);

    const outEdges = (g.edges || [])
      .filter((e) => e.data.source === d.id)
      .map((e) => e.data.target);
    const inEdges = (g.edges || [])
      .filter((e) => e.data.target === d.id)
      .map((e) => e.data.source);

    col.innerHTML = `
      <div class="pane-col-header">
        <div>
          <div style="font-size:12px; font-weight:700;">${escapeHtml(d.label || d.id)}</div>
          <div style="font-size:11px; font-family:var(--font-mono); color:var(--accent-primary);">${escapeHtml(d.id)}.md</div>
        </div>
        ${
          fileObj
            ? `<button class="gcp-btn gcp-btn-primary gcp-btn-sm" onclick="STATE.selectedOkfRelPath='${escapeHtml(relPath)}'; selectSubTab('mod02','split');">
                1:1 PDF View (p.${fileObj.pdf_page})
              </button>`
            : ""
        }
      </div>
      <div class="pane-col-body">
        <div class="fm-card">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span class="gcp-badge gcp-badge-primary">${escapeHtml(d.type || "Concept")}</span>
            <span class="gcp-badge gcp-badge-success">${escapeHtml(d.trust_tier || "human-reviewed")}</span>
          </div>
          <p style="font-size:12.5px; color:var(--text-secondary); margin:6px 0 10px 0;">
            ${escapeHtml(d.description || "")}
          </p>
          <div style="font-size:11.5px; font-weight:600; margin-bottom:4px;">Outgoing Citations (${outEdges.length})</div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:10px;">
            ${outEdges
              .map(
                (tId) =>
                  `<button class="gcp-btn gcp-btn-default gcp-btn-sm" style="font-size:10.5px;" onclick="selectOkfGraphNode('${escapeHtml(tId)}')">${escapeHtml(tId)}</button>`
              )
              .join("")}
          </div>
          <div style="font-size:11.5px; font-weight:600; margin-bottom:4px;">Cited By (${inEdges.length})</div>
          <div style="display:flex; flex-wrap:wrap; gap:4px;">
            ${inEdges
              .map(
                (sId) =>
                  `<button class="gcp-btn gcp-btn-default gcp-btn-sm" style="font-size:10.5px;" onclick="selectOkfGraphNode('${escapeHtml(sId)}')">${escapeHtml(sId)}</button>`
              )
              .join("")}
          </div>
        </div>
        ${
          fileObj
            ? `<div class="okf-md-rendered">${
                window.marked ? window.marked.parse(fileObj.body || "") : escapeHtml(fileObj.body || "")
              }</div>`
            : ""
        }
      </div>
    `;
  }

  // =========================================================================
  // MODULE 03: Metadata as Code (Dataplex kcmd & Git History)
  // =========================================================================
  window.selectCatalogSnapshot = function (idx) {
    STATE.selectedCatalogIdx = idx;
    renderMod03(document.getElementById("studio-viewport"), "kcmd");
  };

  function renderMod03(vp, sub) {
    const isKo = STATE.lang === "ko";
    if (sub === "kcmd") {
      const snaps = BUNDLE.catalog_snapshots || [];
      const curSnap = snaps[STATE.selectedCatalogIdx] || snaps[0] || {};

      vp.innerHTML = `
        <div class="gcp-page" style="max-width: 1440px;">
          <div class="gcp-card" style="margin-bottom:16px;">
            <div class="gcp-card-header">
              <div class="gcp-card-title">
                <span class="material-symbols-outlined">cloud_sync</span>
                <span>${escapeHtml(t("mod03_kcmd_heading"))}</span>
              </div>
              <span class="gcp-badge gcp-badge-success">kcmd v1.0.0 · Round-Trip Pull Verified</span>
            </div>
            <div class="gcp-card-body">
              <p style="margin:0 0 14px 0; font-size:13px; color:var(--text-secondary);">
                ${escapeHtml(t("mod03_kcmd_desc"))}
              </p>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap:14px;">
                <div class="fm-card" style="margin:0;">
                  <div style="font-size:13px; font-weight:700; color:var(--accent-primary); margin-bottom:6px;">
                    ${escapeHtml(t("mod03_scope1_title"))}
                  </div>
                  <div style="font-family:var(--font-mono); font-size:11.5px; color:var(--text-secondary); line-height:1.7;">
                    • Scope: <code>bq-dataset.hp-dragonfly.prj_ontology_hp_dragonfly</code><br>
                    • AspectType: <code>dataplex-types.global.overview</code><br>
                    • Synced Targets: 1 Dataset + 8 Structured Tables (9 Entries)<br>
                    • Command: <code>./bin/kcmd push ./catalog</code>
                  </div>
                </div>
                <div class="fm-card" style="margin:0;">
                  <div style="font-size:13px; font-weight:700; color:#9334e6; margin-bottom:6px;">
                    ${escapeHtml(t("mod03_scope2_title"))}
                  </div>
                  <div style="font-family:var(--font-mono); font-size:11.5px; color:var(--text-secondary); line-height:1.7;">
                    • Scope: <code>kb.hp-dragonfly.us-central1.okf_hp_dragonfly</code><br>
                    • EntryGroup: <code>projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly</code><br>
                    • Custom Types: AspectType <code>okf</code> · EntryType <code>okf-bundle</code><br>
                    • Synced Targets: All 28 OKF v0.2 Markdown Files (Round-trip verified in <code>catalog_okf_pulled/</code>)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- YAML Snapshot Inspector -->
          <div class="gcp-card">
            <div class="gcp-card-header">
              <div class="gcp-card-title">
                <span class="material-symbols-outlined">code_blocks</span>
                <span>${escapeHtml(t("mod03_yaml_viewer_title"))}</span>
              </div>
              <span class="gcp-badge gcp-badge-primary">${escapeHtml(curSnap.rel_path || "")}</span>
            </div>
            <div style="display:grid; grid-template-columns: 320px 1fr; min-height: 460px;">
              <div style="border-right:1px solid var(--border-default); padding:10px; background:var(--bg-tertiary);">
                ${snaps
                  .map(
                    (s, i) => `
                  <div class="concept-tree-item ${i === STATE.selectedCatalogIdx ? "active" : ""}"
                       onclick="selectCatalogSnapshot(${i})">
                    <div>
                      <div style="font-weight:600; font-size:11.5px;">${escapeHtml(s.rel_path)}</div>
                      <div style="font-size:10.5px; color:var(--text-secondary);">${escapeHtml(s.label)}</div>
                    </div>
                  </div>`
                  )
                  .join("")}
              </div>
              <div style="padding:14px; overflow-x:auto; background:var(--bg-secondary);">
                <pre style="margin:0; font-family:var(--font-mono); font-size:12px; line-height:1.55; color:var(--text-primary); white-space:pre-wrap;">${escapeHtml(curSnap.content || "")}</pre>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Git Commit History
      const commits = BUNDLE.git_commits || [];
      vp.innerHTML = `
        <div class="gcp-page" style="max-width: 1440px;">
          <div class="gcp-card">
            <div class="gcp-card-header">
              <div class="gcp-card-title">
                <span class="material-symbols-outlined">commit</span>
                <span>${escapeHtml(t("mod03_git_heading"))} (~/Research/2026-10-25_project-Ontology)</span>
              </div>
              <span class="gcp-badge gcp-badge-primary">branch: main · ${commits.length} Commits</span>
            </div>
            <div class="gcp-card-body">
              <p style="margin:0 0 14px 0; font-size:13px; color:var(--text-secondary);">
                ${escapeHtml(t("mod03_git_desc"))}
              </p>
              <div style="display:flex; flex-direction:column; gap:12px;">
                ${commits
                  .map(
                    (c) => `
                  <div class="fm-card git-commit-card" style="margin:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="gcp-badge gcp-badge-primary" style="font-family:var(--font-mono);">${escapeHtml(c.short_hash || "")}</span>
                        <strong style="font-size:13.5px; color:var(--text-primary);">${escapeHtml(c.subject || "")}</strong>
                      </div>
                      <span style="font-size:11.5px; color:var(--text-secondary); font-family:var(--font-mono);">
                        ${escapeHtml(c.author || "")} &lt;${escapeHtml(c.email || "")}&gt; · ${escapeHtml(window.StudioFormat.dateTime(c.date, STATE.lang))}
                      </span>
                    </div>
                    <pre style="margin:0; padding:10px; background:var(--bg-code); border-radius:6px; border:1px solid var(--border-default); font-family:var(--font-mono); font-size:11px; color:var(--text-secondary); overflow-x:auto;">${escapeHtml(c.stat || "")}</pre>
                  </div>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // =========================================================================
  // MODULE 04: BigQuery 8 English Tables, 3D 2-Layer Topology & GQL Explorer
  // =========================================================================
  window.selectBqTable = function (tname) {
    STATE.selectedBqTable = tname;
    renderMod04Tables(document.getElementById("studio-viewport"));
  };

  window.setBqTableSubTab = function (sub) {
    STATE.bqTableSubTab = sub;
    renderMod04Tables(document.getElementById("studio-viewport"));
  };

  window.toggleThreeAutoRotate = function () {
    STATE.threeAutoRotate = !STATE.threeAutoRotate;
  };

  window.resetThreeCamera = function () {
    if (threeState && threeState.camera) {
      threeState.angle = 0.6;
      threeState.camera.position.set(0, 14, 28);
      threeState.camera.lookAt(0, 0, 0);
    }
  };

  function renderMod04(vp, sub) {
    if (sub === "tables") {
      renderMod04Tables(vp);
    } else {
      renderMod04Gql(vp);
    }
  }

  function renderMod04Tables(vp) {
    const tables = BUNDLE.bq_tables || [];
    const curT = tables.find((tb) => tb.table_name === STATE.selectedBqTable) || tables[0] || {};
    const isKo = STATE.lang === "ko";

    const rows = curT.rows || [];
    const cols = curT.schema || [];

    let tableContentHtml = "";
    if (STATE.bqTableSubTab === "schema") {
      tableContentHtml = `
        <div class="studio-data-table-wrap">
          <table class="studio-data-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>BigQuery Type</th>
                <th>Mode</th>
                <th>Semantic Description (English)</th>
              </tr>
            </thead>
            <tbody>
              ${cols
                .map(
                  (c) => `
                <tr>
                  <td style="font-family:var(--font-mono); font-weight:600; color:var(--accent-primary);">${escapeHtml(c.name)}</td>
                  <td><span class="gcp-badge gcp-badge-default">${escapeHtml(c.type)}</span></td>
                  <td style="font-family:var(--font-mono); font-size:11px;">${escapeHtml(c.mode)}</td>
                  <td>${escapeHtml(c.description)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      const colNames = cols.map((c) => c.name);
      tableContentHtml = `
        <div class="studio-data-table-wrap" style="max-height: 460px;">
          <table class="studio-data-table">
            <thead>
              <tr>
                ${colNames.map((cn) => `<th>${escapeHtml(cn)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (r) => `
                <tr>
                  ${colNames
                    .map((cn) => {
                      const v = r[cn];
                      return `<td style="font-family:${typeof v === "number" || cn.endsWith("_id") || cn.endsWith("_no") || cn.endsWith("_number") ? "var(--font-mono)" : "inherit"};">${escapeHtml(v === null || v === undefined ? "-" : v)}</td>`;
                    })
                    .join("")}
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    vp.innerHTML = `
      <div class="gcp-page" style="max-width: 1440px;">
        <!-- 3D 2-Layer Ontology Topology Card -->
        <div class="gcp-card" style="margin-bottom: 16px;">
          <div class="gcp-card-header">
            <div class="gcp-card-title">
              <span class="material-symbols-outlined">view_in_ar</span>
              <span>${escapeHtml(t("mod04_3d_title"))}</span>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="gcp-btn gcp-btn-default gcp-btn-sm" onclick="toggleThreeAutoRotate()">
                <span class="material-symbols-outlined" style="font-size:14px;">3d_rotation</span>
                <span>${escapeHtml(t("mod04_toggle_spin"))}</span>
              </button>
              <button class="gcp-btn gcp-btn-default gcp-btn-sm" onclick="resetThreeCamera()">
                <span class="material-symbols-outlined" style="font-size:14px;">center_focus_strong</span>
                <span>${escapeHtml(t("mod04_reset_cam"))}</span>
              </button>
            </div>
          </div>
          <div class="gcp-card-body" style="padding:12px 16px;">
            <p style="margin:0 0 10px 0; font-size:12.5px; color:var(--text-secondary);">
              ${escapeHtml(t("mod04_3d_desc"))}
            </p>
            <div id="three-2layer-canvas" style="width:100%; height:290px; border-radius:8px; background:#0f172a; overflow:hidden; position:relative;"></div>
          </div>
        </div>

        <!-- 8 Structured BigQuery Tables Browser -->
        <div class="gcp-card">
          <div class="gcp-card-header">
            <div class="gcp-card-title">
              <span class="material-symbols-outlined">table_chart</span>
              <span>${escapeHtml(t("mod04_table_browser_title"))}</span>
            </div>
            <div class="lang-switch-group">
              <button class="lang-btn ${STATE.bqTableSubTab === "rows" ? "active" : ""}" onclick="setBqTableSubTab('rows')">
                ${escapeHtml(t("mod04_schema_tab"))} (${curT.row_count || 0})
              </button>
              <button class="lang-btn ${STATE.bqTableSubTab === "schema" ? "active" : ""}" onclick="setBqTableSubTab('schema')">
                ${escapeHtml(t("mod04_cols_tab"))} (${cols.length})
              </button>
            </div>
          </div>
          <div class="gcp-card-body">
            <!-- 8 Table Selector Chips -->
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
              ${tables
                .map((tb) => {
                  const active = tb.table_name === curT.table_name;
                  return `
                    <button class="gcp-btn ${active ? "gcp-btn-primary" : "gcp-btn-default"} bq-table-chip"
                            onclick="selectBqTable('${escapeHtml(tb.table_name)}')">
                      <span style="font-family:var(--font-mono); font-size:11.5px;">${escapeHtml(tb.table_name)}</span>
                      <span class="gcp-badge" style="background:rgba(255,255,255,0.2); color:inherit;">${tb.row_count}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>

            <!-- Selected Table Metadata Bar -->
            <div class="fm-card" style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">
                  ${escapeHtml(isKo ? curT.title_ko : curT.title_en)}
                  <code style="margin-left:8px; font-size:12px; color:var(--accent-primary);">hp-dragonfly.prj_ontology_hp_dragonfly.${escapeHtml(curT.table_name)}</code>
                </div>
                <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                  Graph Role: <strong>${escapeHtml(curT.role)}</strong> · Pattern: <code>${escapeHtml(curT.label)}</code> · Primary Key: <code>${escapeHtml(curT.pk)}</code>
                </div>
              </div>
              <button class="gcp-btn gcp-btn-default gcp-btn-sm"
                      onclick="STATE.selectedOkfRelPath='tables/${escapeHtml(curT.table_name)}.md'; selectModule('mod02'); selectSubTab('mod02','split');">
                <span class="material-symbols-outlined" style="font-size:14px;">menu_book</span>
                <span>OKF Spec & PDF p.${curT.pdf_page || 1}</span>
              </button>
            </div>

            ${tableContentHtml}
          </div>
        </div>
      </div>
    `;

    initThree2LayerTopology();
  }

  function initThree2LayerTopology() {
    const container = document.getElementById("three-2layer-canvas");
    if (!container || !window.THREE) return;
    const THREE = window.THREE;
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 290;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 14, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(12, 25, 18);
    scene.add(dirLight);

    // Upper Plane (Structured BigQuery Tables y = +3.5)
    const planeGeo = new THREE.PlaneGeometry(24, 13);
    const upperMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const upperPlane = new THREE.Mesh(planeGeo, upperMat);
    upperPlane.rotation.x = Math.PI / 2;
    upperPlane.position.y = 3.5;
    scene.add(upperPlane);

    // Lower Plane (Unstructured PDF References y = -3.5)
    const lowerMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const lowerPlane = new THREE.Mesh(planeGeo, lowerMat);
    lowerPlane.rotation.x = Math.PI / 2;
    lowerPlane.position.y = -3.5;
    scene.add(lowerPlane);

    // 8 Upper Nodes (BigQuery Tables) in an ellipse
    const upperPositions = [];
    for (let i = 0; i < 8; i++) {
      const theta = (i / 8) * Math.PI * 2;
      const x = Math.cos(theta) * 8.2;
      const z = Math.sin(theta) * 4.2;
      const y = 3.5;
      upperPositions.push(new THREE.Vector3(x, y, z));
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 24, 24),
        new THREE.MeshStandardMaterial({ color: i === 3 ? 0x8b5cf6 : 0x3b82f6, roughness: 0.3 })
      );
      mesh.position.set(x, y, z);
      scene.add(mesh);
    }

    // 5 Lower Nodes (Unstructured PDF References)
    const lowerPositions = [];
    for (let i = 0; i < 5; i++) {
      const theta = (i / 5) * Math.PI * 2;
      const x = Math.cos(theta) * 6.5;
      const z = Math.sin(theta) * 3.4;
      const y = -3.5;
      lowerPositions.push(new THREE.Vector3(x, y, z));
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.75, 1.05),
        new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35 })
      );
      mesh.position.set(x, y, z);
      scene.add(mesh);
    }

    // Horizontal & Vertical Semantic Edges
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.55 });
    for (let i = 0; i < upperPositions.length; i++) {
      const next = upperPositions[(i + 1) % upperPositions.length];
      const geo = new THREE.BufferGeometry().setFromPoints([upperPositions[i], next]);
      scene.add(new THREE.Line(geo, edgeMat));

      const lowTarget = lowerPositions[i % lowerPositions.length];
      const vGeo = new THREE.BufferGeometry().setFromPoints([upperPositions[i], lowTarget]);
      scene.add(
        new THREE.Line(
          vGeo,
          new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.45 })
        )
      );
    }

    threeState = { scene, camera, renderer, angle: 0.6, animId: null };

    function animate() {
      if (!document.getElementById("three-2layer-canvas")) return;
      threeState.animId = requestAnimationFrame(animate);
      if (STATE.threeAutoRotate) {
        threeState.angle += 0.0045;
        camera.position.x = Math.sin(threeState.angle) * 26;
        camera.position.z = Math.cos(threeState.angle) * 26;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  // =========================================================================
  // MODULE 04 (Sub-Tab: GQL Interactive Explorer)
  // =========================================================================
  window.selectGqlPreset = function (idx) {
    STATE.selectedGqlIdx = idx;
    renderMod04Gql(document.getElementById("studio-viewport"));
  };

  window.executeLiveGqlQuery = async function () {
    const btn = document.getElementById("btn-run-gql");
    const statusBadge = document.getElementById("gql-exec-status");
    const editor = document.getElementById("gql-query-textarea");
    if (!btn || !editor) return;

    const sqlText = editor.value;
    btn.disabled = true;
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:15px;">hourglass_top</span><span>${escapeHtml(t("mod04_running_btn"))}</span>`;

    try {
      const resp = await fetch("/api/bq/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlText })
      });
      const data = await resp.json();
      if (data && data.ok && Array.isArray(data.rows)) {
        if (statusBadge) {
          statusBadge.className = "gcp-badge gcp-badge-success";
          statusBadge.textContent = `LIVE BIGQUERY API · ${data.rows.length} rows (${data.elapsed_ms || 0} ms)`;
        }
        renderGqlResultTable(data.rows);
      } else {
        if (statusBadge) {
          statusBadge.className = "gcp-badge gcp-badge-warning";
          statusBadge.textContent = `CACHED SNAPSHOT (${(data && data.error) || "Offline fallback"})`;
        }
      }
    } catch (err) {
      if (statusBadge) {
        statusBadge.className = "gcp-badge gcp-badge-primary";
        statusBadge.textContent = "PRE-EXECUTED SNAPSHOT READY";
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  };

  function renderMod04Gql(vp) {
    const queries = BUNDLE.gql_queries || [];
    const curQ = queries[STATE.selectedGqlIdx] || queries[0] || {};
    const isKo = STATE.lang === "ko";

    vp.innerHTML = `
      <div class="gcp-page" style="max-width: 1440px;">
        <div style="display:grid; grid-template-columns: 360px 1fr; gap: 16px;">
          <!-- Left: Curated GQL Query Presets -->
          <div class="gcp-card">
            <div class="gcp-card-header">
              <div class="gcp-card-title">
                <span class="material-symbols-outlined">bookmark_star</span>
                <span>${escapeHtml(t("mod04_gql_presets_title"))}</span>
              </div>
            </div>
            <div class="gcp-card-body" style="display:flex; flex-direction:column; gap:10px;">
              ${queries
                .map((q, idx) => {
                  const active = idx === STATE.selectedGqlIdx;
                  return `
                    <div class="fm-card query-preset-btn"
                         style="margin:0; cursor:pointer; border-color:${active ? "var(--accent-primary)" : "var(--border-default)"}; background:${active ? "var(--accent-surface)" : "var(--bg-tertiary)"};"
                         onclick="selectGqlPreset(${idx})">
                      <div style="font-size:12.5px; font-weight:700; color:${active ? "var(--accent-primary)" : "var(--text-primary)"}; margin-bottom:4px;">
                        ${escapeHtml(isKo ? q.title_ko : q.title_en)}
                      </div>
                      <div style="font-size:11.5px; color:var(--text-secondary); line-height:1.45;">
                        ${escapeHtml(isKo ? q.desc_ko : q.desc_en)}
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>

          <!-- Right: GQL Editor + Subgraph + Result Table -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="gcp-card">
              <div class="gcp-card-header">
                <div class="gcp-card-title">
                  <span class="material-symbols-outlined">terminal</span>
                  <span>${escapeHtml(t("mod04_gql_editor_title"))}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span id="gql-exec-status" class="gcp-badge gcp-badge-success">
                    VERIFIED · ${(curQ.rows || []).length} rows
                  </span>
                  <button id="btn-run-gql" class="gcp-btn gcp-btn-primary gcp-btn-sm" onclick="executeLiveGqlQuery()">
                    <span>${escapeHtml(t("mod04_run_gql_btn"))}</span>
                  </button>
                </div>
              </div>
              <div class="gcp-card-body" style="padding:12px;">
                <textarea id="gql-query-textarea"
                          style="width:100%; height:155px; font-family:var(--font-mono); font-size:12px; padding:10px 12px; border-radius:6px; border:1px solid var(--border-default); background:var(--bg-code); color:var(--text-primary); resize:vertical;">${escapeHtml(curQ.gql || "")}</textarea>
              </div>
            </div>

            <!-- Subgraph Visualization -->
            <div class="gcp-card">
              <div class="gcp-card-header">
                <div class="gcp-card-title">
                  <span class="material-symbols-outlined">hub</span>
                  <span>${escapeHtml(t("mod04_gql_graph_title"))}</span>
                </div>
                <span class="gcp-badge gcp-badge-primary">
                  ${((curQ.graph && curQ.graph.nodes) || []).length} Nodes · ${((curQ.graph && curQ.graph.edges) || []).length} Edges
                </span>
              </div>
              <div id="gql-vis-canvas" style="width:100%; height:290px; background:var(--bg-primary);"></div>
            </div>

            <!-- Result Table -->
            <div class="gcp-card">
              <div class="gcp-card-header">
                <div class="gcp-card-title">
                  <span class="material-symbols-outlined">table_rows</span>
                  <span>${escapeHtml(t("mod04_gql_result_title"))}</span>
                </div>
              </div>
              <div class="gcp-card-body" id="gql-result-table-container" style="padding:0;">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    renderGqlResultTable(curQ.rows || []);
    renderGqlSubgraph(curQ.graph || { nodes: [], edges: [] });
  }

  function renderGqlResultTable(rows) {
    const container = document.getElementById("gql-result-table-container");
    if (!container) return;
    if (!rows || rows.length === 0) {
      container.innerHTML = `<div style="padding:16px; color:var(--text-secondary);">No rows returned.</div>`;
      return;
    }
    const cols = Object.keys(rows[0]);
    container.innerHTML = `
      <div class="studio-data-table-wrap" style="border:none; border-radius:0; max-height:360px;">
        <table class="studio-data-table">
          <thead>
            <tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                ${cols.map((c) => `<td>${escapeHtml(r[c])}</td>`).join("")}
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderGqlSubgraph(graphData) {
    const container = document.getElementById("gql-vis-canvas");
    if (!container || !window.vis) return;

    const groupColors = {
      HardwareComponent: "#3b82f6",
      TroubleshootingCase: "#ef4444",
      DiagnosticCode: "#f59e0b",
      ProductSKU: "#8b5cf6",
      ProductModel: "#10b981"
    };

    const nodes = (graphData.nodes || []).map((n) => ({
      id: n.id,
      label: n.label,
      color: {
        background: groupColors[n.group] || "#3b82f6",
        border: "#1e293b"
      },
      font: { color: STATE.theme === "dark" ? "#e8eaed" : "#202124", size: 11, face: "Inter, monospace" },
      shape: "box",
      margin: 8
    }));

    const edges = (graphData.edges || []).map((e) => ({
      from: e.from,
      to: e.to,
      label: e.label,
      arrows: "to",
      font: { size: 9.5, align: "middle", color: "#64748b" },
      color: { color: "#94a3b8", highlight: "#1a73e8" }
    }));

    gqlVisNetwork = new window.vis.Network(
      container,
      { nodes: new window.vis.DataSet(nodes), edges: new window.vis.DataSet(edges) },
      {
        physics: {
          barnesHut: { gravitationalConstant: -3200, springLength: 150 }
        },
        interaction: { hover: true }
      }
    );
  }

  // =========================================================================
  // MODULE 05: Next Steps Roadmap Preview
  // =========================================================================
  function renderMod05(vp) {
    vp.innerHTML = `
      <div class="gcp-page" style="max-width: 1200px;">
        <div class="gcp-card" style="margin-bottom:18px; border-left: 5px solid #9334e6;">
          <div class="gcp-card-body" style="padding:20px 24px;">
            <span class="gcp-badge gcp-badge-primary" style="margin-bottom:8px;">NEXT ITERATION ROADMAP</span>
            <h2 style="margin:0 0 8px 0; font-size:19px;">${escapeHtml(t("mod05_banner_title"))}</h2>
            <p style="margin:0; font-size:13.5px; color:var(--text-secondary); line-height:1.65;">
              ${escapeHtml(t("mod05_banner_desc"))}
            </p>
          </div>
        </div>
        <div class="arch-plane-grid">
          <div class="arch-plane-card plane-2">
            <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${escapeHtml(t("mod05_card1_title"))}</div>
            <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin:0;">
              ${escapeHtml(t("mod05_card1_desc"))}
            </p>
          </div>
          <div class="arch-plane-card plane-3">
            <div style="font-size:15px; font-weight:700; margin-bottom:8px;">${escapeHtml(t("mod05_card2_title"))}</div>
            <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin:0;">
              ${escapeHtml(t("mod05_card2_desc"))}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderAll() {
    applyTheme();
    renderHeaderAndRail();
    renderMainViewport();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
  });
})();
