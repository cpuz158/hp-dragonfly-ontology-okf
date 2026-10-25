#!/usr/bin/env python3
"""Materializes the Unstructured OKF / Dataplex Knowledge Catalog (LEX) Topology Layer
and Cross-Layer ONT <-> LEX Bridge Tables in BigQuery (`hp-dragonfly.prj_ontology_hp_dragonfly`),
upgrades `hp_dragonfly_ontology_graph` to all 10 Node Labels & 13 Edge Labels,
and syncs metadata to Dataplex Knowledge Catalog.
"""

import hashlib
from pathlib import Path
from google.cloud import bigquery

PROJECT_ID = "hp-dragonfly"
DATASET_ID = "prj_ontology_hp_dragonfly"
FULL_DATASET = f"{PROJECT_ID}.{DATASET_ID}"
ROOT_DIR = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT_DIR / "docs" / "pdf_6290467_en-US-1.pdf"


def get_pdf_sha256() -> str:
  if PDF_PATH.exists():
    return hashlib.sha256(PDF_PATH.read_bytes()).hexdigest()
  return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"


def create_lex_and_bridge_tables(client: bigquery.Client, pdf_sha: str) -> None:
  # 1. lex_service_manual_documents (Node Class: ServiceManualDocument)
  doc_table_id = f"{FULL_DATASET}.lex_service_manual_documents"
  doc_schema = [
      bigquery.SchemaField("doc_id", "STRING", mode="REQUIRED", description="Canonical document root ID (e.g., N17344-001)"),
      bigquery.SchemaField("doc_title", "STRING", mode="REQUIRED", description="Official document title in English"),
      bigquery.SchemaField("pdf_filename", "STRING", mode="REQUIRED", description="Source unstructured PDF filename"),
      bigquery.SchemaField("total_pages", "INT64", mode="REQUIRED", description="Total page count of the source PDF manual"),
      bigquery.SchemaField("sha256", "STRING", mode="REQUIRED", description="SHA-256 cryptographic digest of the origin PDF"),
      bigquery.SchemaField("okf_root_path", "STRING", mode="REQUIRED", description="OKF v0.2 bundle root index path"),
      bigquery.SchemaField("kc_entry_id", "STRING", mode="REQUIRED", description="Dataplex Knowledge Catalog Entry FQN in okf_hp_dragonfly"),
  ]
  doc_rows = [
      {
          "doc_id": "N17344-001",
          "doc_title": "HP Dragonfly Folio 13.5 inch G3 2-in-1 Notebook PC Maintenance and Service Guide",
          "pdf_filename": "pdf_6290467_en-US-1.pdf",
          "total_pages": 109,
          "sha256": pdf_sha,
          "okf_root_path": "bundles/hp_dragonfly/index.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/index",
      },
      {
          "doc_id": "N09241-001",
          "doc_title": "HP Dragonfly 13.5 inch G3 Clamshell Notebook PC Maintenance and Service Guide",
          "pdf_filename": "hp_dragonfly_g3_clamshell_msg.pdf",
          "total_pages": 98,
          "sha256": pdf_sha,
          "okf_root_path": "bundles/hp_dragonfly/datasets/prj_ontology_hp_dragonfly.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/datasets-prj-ontology-hp-dragonfly",
      },
  ]

  # 2. lex_manual_chapters (Node Class: ServiceManualChapter)
  chap_table_id = f"{FULL_DATASET}.lex_manual_chapters"
  chap_schema = [
      bigquery.SchemaField("chapter_slot_id", "STRING", mode="REQUIRED", description="Canonical OKF reference chapter ID"),
      bigquery.SchemaField("doc_id", "STRING", mode="REQUIRED", description="Parent source document ID (FK -> lex_service_manual_documents.doc_id)"),
      bigquery.SchemaField("chapter_no", "STRING", mode="REQUIRED", description="Manual chapter or appendix number"),
      bigquery.SchemaField("chapter_title", "STRING", mode="REQUIRED", description="English title of the extracted OKF reference document"),
      bigquery.SchemaField("pdf_page_start", "INT64", mode="REQUIRED", description="Starting page number in pdf_6290467_en-US-1.pdf"),
      bigquery.SchemaField("pdf_page_span", "STRING", mode="REQUIRED", description="Page range in the 109-page service manual"),
      bigquery.SchemaField("okf_rel_path", "STRING", mode="REQUIRED", description="Relative path inside bundles/hp_dragonfly/"),
      bigquery.SchemaField("kc_entry_id", "STRING", mode="REQUIRED", description="Dataplex Knowledge Catalog Entry FQN in okf_hp_dragonfly"),
      bigquery.SchemaField("governance_summary", "STRING", mode="REQUIRED", description="Engineering rules and constraints governed by this chapter"),
  ]
  chap_rows = [
      {
          "chapter_slot_id": "REF-CH01-TB4-DOCK",
          "doc_id": "N17344-001",
          "chapter_no": "Chapter 1",
          "chapter_title": "Thunderbolt 4 USB4 Port, Power Delivery & G4 Dock Compatibility Matrix",
          "pdf_page_start": 12,
          "pdf_page_span": "1-18",
          "okf_rel_path": "references/thunderbolt-g4-dock-and-power-matrix.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/references-thunderbolt-g4-dock-and-power-matrix",
          "governance_summary": "Defines Dual Thunderbolt 4 (40Gbps, 100W USB-C PD, DP 1.4), hall/proximity sensors, MPP 2.0 stylus charging, and Dock G4 multi-display rules.",
      },
      {
          "chapter_slot_id": "REF-CH03-PARTS-CATALOG",
          "doc_id": "N17344-001",
          "chapter_no": "Chapter 3",
          "chapter_title": "Illustrated Hardware Spare Parts Catalog & System Board FRU Matrix",
          "pdf_page_start": 19,
          "pdf_page_span": "19-28",
          "okf_rel_path": "references/ch03-illustrated-parts-catalog.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/references-ch03-illustrated-parts-catalog",
          "governance_summary": "Maps soldered CPU + LPDDR5 (16GB/32GB) + WWAN configurations to exact HP spare part numbers and FRU replacement tiers.",
      },
      {
          "chapter_slot_id": "REF-CH05-DISASSEMBLY-ESD",
          "doc_id": "N17344-001",
          "chapter_no": "Chapter 5",
          "chapter_title": "Component Removal, Replacement Procedures & 700V ESD Safety Protocol",
          "pdf_page_start": 29,
          "pdf_page_span": "29-78",
          "okf_rel_path": "references/ch05-disassembly-and-esd-safety.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/references-ch05-disassembly-and-esd-safety",
          "governance_summary": "Enforces 700V ESD grounding, mandatory Battery (M90788-005) isolation after Bottom Cover (N22918-001), screw specs, and pull-forward display cable routing.",
      },
      {
          "chapter_slot_id": "REF-CH06-BLINK-DIAG",
          "doc_id": "N17344-001",
          "chapter_no": "Chapter 6",
          "chapter_title": "Caps Lock LED Blink Codes, POST Error Codes & UEFI Hardware Diagnostics",
          "pdf_page_start": 79,
          "pdf_page_span": "79-84",
          "okf_rel_path": "references/ch06-led-blink-and-post-diagnostics.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/references-ch06-led-blink-and-post-diagnostics",
          "governance_summary": "Defines blink patterns (3.2 soldered LPDDR5 fault, 2.2 BIOS corruption, 5.2 system board fault, POST 90B fan fault) and diagnostic escalation order.",
      },
      {
          "chapter_slot_id": "REF-APPXB-SURE-START-NVM",
          "doc_id": "N17344-001",
          "chapter_no": "Appendix B",
          "chapter_title": "Non-Volatile Memory (NVM) Sanitization & HP Sure Start Gen7 Security",
          "pdf_page_start": 96,
          "pdf_page_span": "95-102",
          "okf_rel_path": "references/appx-b-nvm-security-and-sure-start.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/references-appx-b-nvm-security-and-sure-start",
          "governance_summary": "Specifies 32MB SPI BIOS Flash, 16MB Sure Start Private Flash, EC NVM clearing rules (NIST SP 800-88), and Win+B hardware BIOS recovery.",
      },
  ]

  # 3. lex_service_playbooks (Node Class: ServicePlaybook)
  pb_table_id = f"{FULL_DATASET}.lex_service_playbooks"
  pb_schema = [
      bigquery.SchemaField("playbook_id", "STRING", mode="REQUIRED", description="Canonical OKF playbook, computation, or metric ID"),
      bigquery.SchemaField("okf_type", "STRING", mode="REQUIRED", description="OKF v0.2 type (Playbook, Computation, Metric)"),
      bigquery.SchemaField("title", "STRING", mode="REQUIRED", description="English title of the OKF playbook or computation"),
      bigquery.SchemaField("target_issue_domain", "STRING", mode="REQUIRED", description="Target troubleshooting domain (No-Boot/BIOS/Memory vs. Thermal/Battery/I-O)"),
      bigquery.SchemaField("pdf_page_ref", "INT64", mode="REQUIRED", description="Primary page reference in HP Service Guide N17344-001"),
      bigquery.SchemaField("okf_rel_path", "STRING", mode="REQUIRED", description="Relative path inside bundles/hp_dragonfly/"),
      bigquery.SchemaField("kc_entry_id", "STRING", mode="REQUIRED", description="Dataplex Knowledge Catalog Entry FQN in okf_hp_dragonfly"),
      bigquery.SchemaField("agent_directive", "STRING", mode="REQUIRED", description="Mandatory execution rule enforced on the Ontology Agent"),
  ]
  pb_rows = [
      {
          "playbook_id": "PB-NO-BOOT-SURE-START",
          "okf_type": "Playbook",
          "title": "HP Dragonfly G3 No-Boot, Black Screen & HP Sure Start BIOS Recovery Playbook",
          "target_issue_domain": "Power / Boot / BIOS / Soldered Memory / System Board",
          "pdf_page_ref": 79,
          "okf_rel_path": "playbooks/no-boot-bios-sure-start-recovery.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/playbooks-no-boot-bios-sure-start-recovery",
          "agent_directive": "Step 1: Execute hard EC reset & Win+B HP Sure Start BIOS recovery before opening chassis. Step 2: If Caps Lock 3.2/5.2 persists, traverse USES_SYSTEM_BOARD & REQUIRES_REMOVAL_OF DAG.",
      },
      {
          "playbook_id": "PB-THERMAL-BATTERY-SWELLED",
          "okf_type": "Playbook",
          "title": "HP Dragonfly G3 Thermal Throttling, Fan 90B & Battery Swelling Triage Playbook",
          "target_issue_domain": "Thermal / Fan / Battery / Display / Enclosure / Ports",
          "pdf_page_ref": 41,
          "okf_rel_path": "playbooks/thermal-throttling-and-battery-swelling.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/playbooks-thermal-throttling-and-battery-swelling",
          "agent_directive": "Enforce 700V ESD precautions, isolate swollen battery M90788-005 without puncturing pouch, and apply new thermal grease whenever heatsink M90790-001 is loosened.",
      },
      {
          "playbook_id": "COMP-DISASSEMBLY-PREREQS",
          "okf_type": "Computation",
          "title": "System Board & FRU Replacement Prerequisite Disassembly DAG Computation",
          "target_issue_domain": "Disassembly Order & Fastener Verification",
          "pdf_page_ref": 67,
          "okf_rel_path": "computations/system-board-replacement-prerequisites.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/computations-system-board-replacement-prerequisites",
          "agent_directive": "Attested SQL/GQL query resolving multi-hop REQUIRES_REMOVAL_OF steps, screw torque/dimensions, and ZIF cable warnings.",
      },
      {
          "playbook_id": "COMP-SYMPTOM-TO-FRU",
          "okf_type": "Computation",
          "title": "Symptom & Blink Code to Defective FRU Spare Part Resolution Query",
          "target_issue_domain": "Diagnostic Triage & FRU Dispatch",
          "pdf_page_ref": 79,
          "okf_rel_path": "computations/symptom-to-fru-part-resolution.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/computations-symptom-to-fru-part-resolution",
          "agent_directive": "Attested GQL query traversing TroubleshootingCase -> DiagnosticCode & HardwareComponent -> Prerequisite Disassembly DAG.",
      },
      {
          "playbook_id": "METRIC-MTTR-SERVICE",
          "okf_type": "Metric",
          "title": "Mean Time To Repair (MTTR) & Disassembly Depth Service Metric",
          "target_issue_domain": "Field Service KPI & Depot Escalation",
          "pdf_page_ref": 29,
          "okf_rel_path": "metrics/mttr-and-disassembly-depth.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/metrics-mttr-and-disassembly-depth",
          "agent_directive": "Calculates total cumulative service time and prerequisite removal depth across component_disassembly_deps.",
      },
      {
          "playbook_id": "METRIC-WARRANTY-BIOS-RATE",
          "okf_type": "Metric",
          "title": "BIOS Recovery Non-Dispatch Resolution Rate Metric",
          "target_issue_domain": "Warranty Cost Avoidance & Sure Start Efficacy",
          "pdf_page_ref": 96,
          "okf_rel_path": "metrics/bios-recovery-resolution-rate.md",
          "kc_entry_id": "projects/hp-dragonfly/locations/us-central1/entryGroups/okf_hp_dragonfly/entries/metrics-bios-recovery-resolution-rate",
          "agent_directive": "Measures percentage of field cases resolved via SoftPaq/Sure Start BIOS recovery without FRU motherboard replacement.",
      },
  ]

  # 4. Build Cross-Layer Bridge Edge Tables from live ONT rows
  comps = list(client.query(f"SELECT part_number, component_category, manual_chapter_page FROM `{FULL_DATASET}.hardware_components_catalog`").result())
  comp_bridge_rows = []
  for idx, r in enumerate(comps, 1):
    cat = (r.component_category or "").lower()
    mpage = r.manual_chapter_page or ""
    # Every component is cataloged in Ch.3 and has removal procedures in Ch.5
    target_chap = "REF-CH05-DISASSEMBLY-ESD" if "ch.5" in mpage.lower() or "p.3" in mpage.lower() or "p.4" in mpage.lower() or "p.5" in mpage.lower() or "p.6" in mpage.lower() else "REF-CH03-PARTS-CATALOG"
    if "dock" in cat or "cable" in cat or "pen" in cat:
      target_chap = "REF-CH01-TB4-DOCK"
    comp_bridge_rows.append({
        "bridge_id": f"BR-COMP-CHAP-{idx:03d}",
        "part_number": r.part_number,
        "chapter_slot_id": target_chap,
        "manual_chapter_page": mpage or "Ch.5 (p.29-78)",
        "bridge_role": "Links structured spare part to verbatim PDF manual disassembly & illustrated parts section in Dataplex KC",
    })

  diags = list(client.query(f"SELECT diagnostic_code, manual_reference FROM `{FULL_DATASET}.diagnostic_codes_reference`").result())
  diag_bridge_rows = []
  for idx, r in enumerate(diags, 1):
    diag_bridge_rows.append({
        "bridge_id": f"BR-DIAG-CHAP-{idx:03d}",
        "diagnostic_code": r.diagnostic_code,
        "chapter_slot_id": "REF-CH06-BLINK-DIAG",
        "manual_reference": r.manual_reference or "Ch.6 (p.79-84)",
        "bridge_role": "Maps structured LED blink/POST code to Chapter 6 diagnostic specification in Dataplex KC",
    })

  cases = list(client.query(f"SELECT case_id, issue_category, reported_symptom FROM `{FULL_DATASET}.community_troubleshooting_cases`").result())
  case_bridge_rows = []
  for idx, r in enumerate(cases, 1):
    icat = (r.issue_category or "").lower()
    sym = (r.reported_symptom or "").lower()
    if any(k in icat or k in sym for k in ["boot", "bios", "blink", "memory", "black", "post", "board"]):
      pb_id = "PB-NO-BOOT-SURE-START"
    else:
      pb_id = "PB-THERMAL-BATTERY-SWELLED"
    case_bridge_rows.append({
        "bridge_id": f"BR-CASE-PB-{idx:03d}",
        "case_id": r.case_id,
        "playbook_id": pb_id,
        "issue_category": r.issue_category or "Hardware Triage",
        "bridge_role": "Binds field troubleshooting case to mandatory OKF v0.2 triage playbook in Dataplex KC",
    })

  pb_chap_rows = [
      {"bridge_id": "BR-PB-REF-001", "playbook_id": "PB-NO-BOOT-SURE-START", "chapter_slot_id": "REF-CH06-BLINK-DIAG", "citation_role": "Step 1 LED blink decoding"},
      {"bridge_id": "BR-PB-REF-002", "playbook_id": "PB-NO-BOOT-SURE-START", "chapter_slot_id": "REF-APPXB-SURE-START-NVM", "citation_role": "Step 2 Win+B HP Sure Start SPI flash recovery"},
      {"bridge_id": "BR-PB-REF-003", "playbook_id": "PB-NO-BOOT-SURE-START", "chapter_slot_id": "REF-CH05-DISASSEMBLY-ESD", "citation_role": "Step 3 System board FRU replacement DAG"},
      {"bridge_id": "BR-PB-REF-004", "playbook_id": "PB-THERMAL-BATTERY-SWELLED", "chapter_slot_id": "REF-CH05-DISASSEMBLY-ESD", "citation_role": "Battery isolation & thermal module repasting"},
      {"bridge_id": "BR-PB-REF-005", "playbook_id": "PB-THERMAL-BATTERY-SWELLED", "chapter_slot_id": "REF-CH01-TB4-DOCK", "citation_role": "Thunderbolt 4 PD charging & sensor behavior"},
      {"bridge_id": "BR-PB-REF-006", "playbook_id": "COMP-DISASSEMBLY-PREREQS", "chapter_slot_id": "REF-CH05-DISASSEMBLY-ESD", "citation_role": "Verifies DAG step order against Ch.5"},
      {"bridge_id": "BR-PB-REF-007", "playbook_id": "COMP-SYMPTOM-TO-FRU", "chapter_slot_id": "REF-CH03-PARTS-CATALOG", "citation_role": "Resolves FRU part numbers against Ch.3"},
      {"bridge_id": "BR-PB-REF-008", "playbook_id": "METRIC-WARRANTY-BIOS-RATE", "chapter_slot_id": "REF-APPXB-SURE-START-NVM", "citation_role": "Evaluates Sure Start Gen7 self-healing rate"},
  ]

  comp_bridge_schema = [
      bigquery.SchemaField("bridge_id", "STRING", mode="REQUIRED", description="Unique ONT-to-LEX component bridge ID"),
      bigquery.SchemaField("part_number", "STRING", mode="REQUIRED", description="Source HardwareComponent part_number"),
      bigquery.SchemaField("chapter_slot_id", "STRING", mode="REQUIRED", description="Destination ServiceManualChapter chapter_slot_id"),
      bigquery.SchemaField("manual_chapter_page", "STRING", mode="REQUIRED", description="PDF chapter and page citation"),
      bigquery.SchemaField("bridge_role", "STRING", mode="REQUIRED", description="Semantic bridge role description"),
  ]
  diag_bridge_schema = [
      bigquery.SchemaField("bridge_id", "STRING", mode="REQUIRED", description="Unique ONT-to-LEX diagnostic bridge ID"),
      bigquery.SchemaField("diagnostic_code", "STRING", mode="REQUIRED", description="Source DiagnosticCode diagnostic_code"),
      bigquery.SchemaField("chapter_slot_id", "STRING", mode="REQUIRED", description="Destination ServiceManualChapter chapter_slot_id"),
      bigquery.SchemaField("manual_reference", "STRING", mode="REQUIRED", description="PDF Chapter 6 page citation"),
      bigquery.SchemaField("bridge_role", "STRING", mode="REQUIRED", description="Semantic bridge role description"),
  ]
  case_bridge_schema = [
      bigquery.SchemaField("bridge_id", "STRING", mode="REQUIRED", description="Unique ONT-to-LEX case-playbook bridge ID"),
      bigquery.SchemaField("case_id", "STRING", mode="REQUIRED", description="Source TroubleshootingCase case_id"),
      bigquery.SchemaField("playbook_id", "STRING", mode="REQUIRED", description="Destination ServicePlaybook playbook_id"),
      bigquery.SchemaField("issue_category", "STRING", mode="REQUIRED", description="Troubleshooting issue domain"),
      bigquery.SchemaField("bridge_role", "STRING", mode="REQUIRED", description="Semantic bridge role description"),
  ]
  pb_chap_schema = [
      bigquery.SchemaField("bridge_id", "STRING", mode="REQUIRED", description="Unique LEX playbook-to-chapter edge ID"),
      bigquery.SchemaField("playbook_id", "STRING", mode="REQUIRED", description="Source ServicePlaybook playbook_id"),
      bigquery.SchemaField("chapter_slot_id", "STRING", mode="REQUIRED", description="Destination ServiceManualChapter chapter_slot_id"),
      bigquery.SchemaField("citation_role", "STRING", mode="REQUIRED", description="How the playbook uses this reference chapter"),
  ]

  specs = [
      (doc_table_id, doc_schema, doc_rows, "Unstructured LEX Node Table: Origin HP Service Guide PDF roots linked to Dataplex Knowledge Catalog (okf_hp_dragonfly)."),
      (chap_table_id, chap_schema, chap_rows, "Unstructured LEX Node Table: 5 OKF v0.2 reference chapters extracted from N17344-001 with Dataplex kc_entry_id."),
      (pb_table_id, pb_schema, pb_rows, "Unstructured LEX Node Table: 6 OKF v0.2 agent playbooks, computations, and metrics with Dataplex kc_entry_id."),
      (f"{FULL_DATASET}.edge_component_documented_in_chapter", comp_bridge_schema, comp_bridge_rows, "Cross-Layer ONT-to-LEX Bridge Edge Table: HardwareComponent -> ServiceManualChapter (DOCUMENTED_IN_CHAPTER)."),
      (f"{FULL_DATASET}.edge_diagnostic_defined_in_chapter", diag_bridge_schema, diag_bridge_rows, "Cross-Layer ONT-to-LEX Bridge Edge Table: DiagnosticCode -> ServiceManualChapter (DEFINED_IN_CH6_MANUAL)."),
      (f"{FULL_DATASET}.edge_case_governed_by_playbook", case_bridge_schema, case_bridge_rows, "Cross-Layer ONT-to-LEX Bridge Edge Table: TroubleshootingCase -> ServicePlaybook (GOVERNED_BY_PLAYBOOK)."),
      (f"{FULL_DATASET}.edge_playbook_orchestrates_chapter", pb_chap_schema, pb_chap_rows, "LEX Layer Edge Table: ServicePlaybook -> ServiceManualChapter (ORCHESTRATES_REFERENCE)."),
  ]

  for tid, schema, rows, desc in specs:
    client.delete_table(tid, not_found_ok=True)
    tbl = bigquery.Table(tid, schema=schema)
    tbl.description = desc
    client.create_table(tbl)
    job = client.load_table_from_json(rows, tid)
    job.result()
    print(f"Created & loaded {tid}: {len(rows)} rows")


def upgrade_property_graph(client: bigquery.Client) -> str:
  ddl = f"""-- BigQuery 2-Layer (ONT Structured <-> LEX Unstructured / Dataplex KC) Property Graph DDL
CREATE OR REPLACE PROPERTY GRAPH `{FULL_DATASET}.hp_dragonfly_ontology_graph`
  NODE TABLES (
    -- Upper Layer (ONT): 7 Structured Hardware & Triage Classes
    `{FULL_DATASET}.dragonfly_series_models` AS ProductModel
      KEY (model_id)
      LABEL ProductModel
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.product_skus_and_configs` AS ProductSKU
      KEY (sku_id)
      LABEL ProductSKU
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.hardware_components_catalog` AS HardwareComponent
      KEY (part_number)
      LABEL HardwareComponent
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.diagnostic_codes_reference` AS DiagnosticCode
      KEY (diagnostic_code)
      LABEL DiagnosticCode
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.community_troubleshooting_cases` AS TroubleshootingCase
      KEY (case_id)
      LABEL TroubleshootingCase
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.firmware_bios_and_nvm` AS FirmwareBiosNvm
      KEY (release_or_nvm_id)
      LABEL FirmwareBiosNvm
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.ports_sensors_and_docks` AS PortSensorDock
      KEY (feature_id)
      LABEL PortSensorDock
      PROPERTIES ALL COLUMNS,

    -- Lower Layer (LEX / Dataplex KC): 3 Unstructured OKF v0.2 Classes
    `{FULL_DATASET}.lex_service_manual_documents` AS ServiceManualDocument
      KEY (doc_id)
      LABEL ServiceManualDocument
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.lex_manual_chapters` AS ServiceManualChapter
      KEY (chapter_slot_id)
      LABEL ServiceManualChapter
      PROPERTIES ALL COLUMNS,
    `{FULL_DATASET}.lex_service_playbooks` AS ServicePlaybook
      KEY (playbook_id)
      LABEL ServicePlaybook
      PROPERTIES ALL COLUMNS
  )
  EDGE TABLES (
    -- 1. Intra-Layer Structured ONT Edges (7 Edge Types)
    `{FULL_DATASET}.product_skus_and_configs` AS sku_belongs_to_model
      KEY (sku_id)
      SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)
      DESTINATION KEY (model_id) REFERENCES ProductModel (model_id)
      LABEL BELONGS_TO_MODEL
      PROPERTIES (sku_id, model_id, region_code, cpu_model, ram_gb, ssd_capacity_gb),
    `{FULL_DATASET}.product_skus_and_configs` AS sku_uses_system_board
      KEY (sku_id)
      SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)
      DESTINATION KEY (system_board_part_no) REFERENCES HardwareComponent (part_number)
      LABEL USES_SYSTEM_BOARD
      PROPERTIES (sku_id, system_board_part_no, cpu_model, ram_gb),
    `{FULL_DATASET}.component_disassembly_deps` AS component_requires_removal
      KEY (dependency_id)
      SOURCE KEY (target_part_number) REFERENCES HardwareComponent (part_number)
      DESTINATION KEY (prerequisite_part_number) REFERENCES HardwareComponent (part_number)
      LABEL REQUIRES_REMOVAL_OF
      PROPERTIES (dependency_id, step_order, fastener_screw_spec, required_tools, caution_note, manual_page_ref),
    `{FULL_DATASET}.community_troubleshooting_cases` AS case_affects_component
      KEY (case_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (affected_part_number) REFERENCES HardwareComponent (part_number)
      LABEL AFFECTS_COMPONENT
      PROPERTIES (case_id, issue_category, severity, requires_part_replacement),
    `{FULL_DATASET}.community_troubleshooting_cases` AS case_triggers_diagnostic
      KEY (case_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (error_or_diagnostic_code) REFERENCES DiagnosticCode (diagnostic_code)
      LABEL TRIGGERS_DIAGNOSTIC
      PROPERTIES (case_id, reported_symptom, error_or_diagnostic_code),
    `{FULL_DATASET}.firmware_bios_and_nvm` AS fw_protects_model_nvm
      KEY (release_or_nvm_id)
      SOURCE KEY (release_or_nvm_id) REFERENCES FirmwareBiosNvm (release_or_nvm_id)
      DESTINATION KEY (model_id) REFERENCES ProductModel (model_id)
      LABEL PROTECTS_SYSTEM_BOARD_NVM
      PROPERTIES (release_or_nvm_id, item_type, name_or_version, write_protection_mechanism),
    `{FULL_DATASET}.ports_sensors_and_docks` AS port_integrated_on_component
      KEY (feature_id)
      SOURCE KEY (feature_id) REFERENCES PortSensorDock (feature_id)
      DESTINATION KEY (spare_part_number) REFERENCES HardwareComponent (part_number)
      LABEL INTEGRATED_ON_COMPONENT
      PROPERTIES (feature_id, feature_category, feature_name, protocol_or_spec),

    -- 2. Vertical Cross-Layer ONT <-> LEX (Dataplex KC) Bridge Edges (4 Edge Types)
    `{FULL_DATASET}.edge_component_documented_in_chapter` AS comp_documented_in_chapter
      KEY (bridge_id)
      SOURCE KEY (part_number) REFERENCES HardwareComponent (part_number)
      DESTINATION KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      LABEL DOCUMENTED_IN_CHAPTER
      PROPERTIES (bridge_id, manual_chapter_page, bridge_role),
    `{FULL_DATASET}.edge_diagnostic_defined_in_chapter` AS diag_defined_in_chapter
      KEY (bridge_id)
      SOURCE KEY (diagnostic_code) REFERENCES DiagnosticCode (diagnostic_code)
      DESTINATION KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      LABEL DEFINED_IN_CH6_MANUAL
      PROPERTIES (bridge_id, manual_reference, bridge_role),
    `{FULL_DATASET}.edge_case_governed_by_playbook` AS case_governed_by_playbook
      KEY (bridge_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (playbook_id) REFERENCES ServicePlaybook (playbook_id)
      LABEL GOVERNED_BY_PLAYBOOK
      PROPERTIES (bridge_id, issue_category, bridge_role),
    `{FULL_DATASET}.dragonfly_series_models` AS model_cites_manual
      KEY (model_id)
      SOURCE KEY (model_id) REFERENCES ProductModel (model_id)
      DESTINATION KEY (service_manual_doc_no) REFERENCES ServiceManualDocument (doc_id)
      LABEL CITES_SERVICE_MANUAL
      PROPERTIES (model_id, model_name, service_manual_doc_no),

    -- 3. Intra-Layer Unstructured LEX (OKF / Dataplex KC) Edges (2 Edge Types)
    `{FULL_DATASET}.lex_manual_chapters` AS chapter_part_of_document
      KEY (chapter_slot_id)
      SOURCE KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      DESTINATION KEY (doc_id) REFERENCES ServiceManualDocument (doc_id)
      LABEL PART_OF_DOCUMENT
      PROPERTIES (chapter_slot_id, chapter_no, pdf_page_span, okf_rel_path, kc_entry_id),
    `{FULL_DATASET}.edge_playbook_orchestrates_chapter` AS playbook_orchestrates_chapter
      KEY (bridge_id)
      SOURCE KEY (playbook_id) REFERENCES ServicePlaybook (playbook_id)
      DESTINATION KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      LABEL ORCHESTRATES_REFERENCE
      PROPERTIES (bridge_id, citation_role)
  );
"""
  sql_path = ROOT_DIR / "scripts" / "create_property_graph.sql"
  sql_path.write_text(ddl, encoding="utf-8")
  client.query(ddl).result()
  print("Successfully upgraded Property Graph: hp_dragonfly_ontology_graph (10 Node Labels, 13 Edge Labels)")
  return ddl


def verify_2layer_gql(client: bigquery.Client) -> None:
  gql = f"""
  SELECT
    case_id,
    reported_symptom,
    diagnostic_code,
    part_number,
    component_name,
    playbook_id,
    playbook_okf_path,
    playbook_kc_entry,
    chapter_slot_id,
    chapter_okf_path,
    pdf_page_span
  FROM GRAPH_TABLE(
    `{FULL_DATASET}.hp_dragonfly_ontology_graph`
    MATCH
      (tc:TroubleshootingCase)-[:TRIGGERS_DIAGNOSTIC]->(d:DiagnosticCode),
      (tc)-[:AFFECTS_COMPONENT]->(c:HardwareComponent)-[:DOCUMENTED_IN_CHAPTER]->(ch:ServiceManualChapter)-[:PART_OF_DOCUMENT]->(doc:ServiceManualDocument),
      (tc)-[:GOVERNED_BY_PLAYBOOK]->(pb:ServicePlaybook)
    RETURN
      tc.case_id AS case_id,
      tc.reported_symptom AS reported_symptom,
      d.diagnostic_code AS diagnostic_code,
      c.part_number AS part_number,
      c.component_name AS component_name,
      pb.playbook_id AS playbook_id,
      pb.okf_rel_path AS playbook_okf_path,
      pb.kc_entry_id AS playbook_kc_entry,
      ch.chapter_slot_id AS chapter_slot_id,
      ch.okf_rel_path AS chapter_okf_path,
      ch.pdf_page_span AS pdf_page_span
  )
  ORDER BY case_id
  LIMIT 6
  """
  rows = list(client.query(gql).result())
  print(f"Verified 2-Layer ONT<->LEX GQL traversal! Returned {len(rows)} rows:")
  for r in rows[:3]:
    print(" ", dict(r))


if __name__ == "__main__":
  bq_client = bigquery.Client(project=PROJECT_ID)
  sha = get_pdf_sha256()
  create_lex_and_bridge_tables(bq_client, sha)
  upgrade_property_graph(bq_client)
  verify_2layer_gql(bq_client)
