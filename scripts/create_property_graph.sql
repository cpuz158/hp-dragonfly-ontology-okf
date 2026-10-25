-- BigQuery 2-Layer (ONT Structured <-> LEX Unstructured / Dataplex KC) Property Graph DDL
CREATE OR REPLACE PROPERTY GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
  NODE TABLES (
    -- Upper Layer (ONT): 7 Structured Hardware & Triage Classes
    `hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models` AS ProductModel
      KEY (model_id)
      LABEL ProductModel
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs` AS ProductSKU
      KEY (sku_id)
      LABEL ProductSKU
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.hardware_components_catalog` AS HardwareComponent
      KEY (part_number)
      LABEL HardwareComponent
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.diagnostic_codes_reference` AS DiagnosticCode
      KEY (diagnostic_code)
      LABEL DiagnosticCode
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases` AS TroubleshootingCase
      KEY (case_id)
      LABEL TroubleshootingCase
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm` AS FirmwareBiosNvm
      KEY (release_or_nvm_id)
      LABEL FirmwareBiosNvm
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.ports_sensors_and_docks` AS PortSensorDock
      KEY (feature_id)
      LABEL PortSensorDock
      PROPERTIES ALL COLUMNS,

    -- Lower Layer (LEX / Dataplex KC): 3 Unstructured OKF v0.2 Classes
    `hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_manual_documents` AS ServiceManualDocument
      KEY (doc_id)
      LABEL ServiceManualDocument
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.lex_manual_chapters` AS ServiceManualChapter
      KEY (chapter_slot_id)
      LABEL ServiceManualChapter
      PROPERTIES ALL COLUMNS,
    `hp-dragonfly.prj_ontology_hp_dragonfly.lex_service_playbooks` AS ServicePlaybook
      KEY (playbook_id)
      LABEL ServicePlaybook
      PROPERTIES ALL COLUMNS
  )
  EDGE TABLES (
    -- 1. Intra-Layer Structured ONT Edges (7 Edge Types)
    `hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs` AS sku_belongs_to_model
      KEY (sku_id)
      SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)
      DESTINATION KEY (model_id) REFERENCES ProductModel (model_id)
      LABEL BELONGS_TO_MODEL
      PROPERTIES (sku_id, model_id, region_code, cpu_model, ram_gb, ssd_capacity_gb),
    `hp-dragonfly.prj_ontology_hp_dragonfly.product_skus_and_configs` AS sku_uses_system_board
      KEY (sku_id)
      SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)
      DESTINATION KEY (system_board_part_no) REFERENCES HardwareComponent (part_number)
      LABEL USES_SYSTEM_BOARD
      PROPERTIES (sku_id, system_board_part_no, cpu_model, ram_gb),
    `hp-dragonfly.prj_ontology_hp_dragonfly.component_disassembly_deps` AS component_requires_removal
      KEY (dependency_id)
      SOURCE KEY (target_part_number) REFERENCES HardwareComponent (part_number)
      DESTINATION KEY (prerequisite_part_number) REFERENCES HardwareComponent (part_number)
      LABEL REQUIRES_REMOVAL_OF
      PROPERTIES (dependency_id, step_order, fastener_screw_spec, required_tools, caution_note, manual_page_ref),
    `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases` AS case_affects_component
      KEY (case_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (affected_part_number) REFERENCES HardwareComponent (part_number)
      LABEL AFFECTS_COMPONENT
      PROPERTIES (case_id, issue_category, severity, requires_part_replacement),
    `hp-dragonfly.prj_ontology_hp_dragonfly.community_troubleshooting_cases` AS case_triggers_diagnostic
      KEY (case_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (error_or_diagnostic_code) REFERENCES DiagnosticCode (diagnostic_code)
      LABEL TRIGGERS_DIAGNOSTIC
      PROPERTIES (case_id, reported_symptom, error_or_diagnostic_code),
    `hp-dragonfly.prj_ontology_hp_dragonfly.firmware_bios_and_nvm` AS fw_protects_model_nvm
      KEY (release_or_nvm_id)
      SOURCE KEY (release_or_nvm_id) REFERENCES FirmwareBiosNvm (release_or_nvm_id)
      DESTINATION KEY (model_id) REFERENCES ProductModel (model_id)
      LABEL PROTECTS_SYSTEM_BOARD_NVM
      PROPERTIES (release_or_nvm_id, item_type, name_or_version, write_protection_mechanism),
    `hp-dragonfly.prj_ontology_hp_dragonfly.ports_sensors_and_docks` AS port_integrated_on_component
      KEY (feature_id)
      SOURCE KEY (feature_id) REFERENCES PortSensorDock (feature_id)
      DESTINATION KEY (spare_part_number) REFERENCES HardwareComponent (part_number)
      LABEL INTEGRATED_ON_COMPONENT
      PROPERTIES (feature_id, feature_category, feature_name, protocol_or_spec),

    -- 2. Vertical Cross-Layer ONT <-> LEX (Dataplex KC) Bridge Edges (4 Edge Types)
    `hp-dragonfly.prj_ontology_hp_dragonfly.edge_component_documented_in_chapter` AS comp_documented_in_chapter
      KEY (bridge_id)
      SOURCE KEY (part_number) REFERENCES HardwareComponent (part_number)
      DESTINATION KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      LABEL DOCUMENTED_IN_CHAPTER
      PROPERTIES (bridge_id, manual_chapter_page, bridge_role),
    `hp-dragonfly.prj_ontology_hp_dragonfly.edge_diagnostic_defined_in_chapter` AS diag_defined_in_chapter
      KEY (bridge_id)
      SOURCE KEY (diagnostic_code) REFERENCES DiagnosticCode (diagnostic_code)
      DESTINATION KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      LABEL DEFINED_IN_CH6_MANUAL
      PROPERTIES (bridge_id, manual_reference, bridge_role),
    `hp-dragonfly.prj_ontology_hp_dragonfly.edge_case_governed_by_playbook` AS case_governed_by_playbook
      KEY (bridge_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (playbook_id) REFERENCES ServicePlaybook (playbook_id)
      LABEL GOVERNED_BY_PLAYBOOK
      PROPERTIES (bridge_id, issue_category, bridge_role),
    `hp-dragonfly.prj_ontology_hp_dragonfly.dragonfly_series_models` AS model_cites_manual
      KEY (model_id)
      SOURCE KEY (model_id) REFERENCES ProductModel (model_id)
      DESTINATION KEY (service_manual_doc_no) REFERENCES ServiceManualDocument (doc_id)
      LABEL CITES_SERVICE_MANUAL
      PROPERTIES (model_id, model_name, service_manual_doc_no),

    -- 3. Intra-Layer Unstructured LEX (OKF / Dataplex KC) Edges (2 Edge Types)
    `hp-dragonfly.prj_ontology_hp_dragonfly.lex_manual_chapters` AS chapter_part_of_document
      KEY (chapter_slot_id)
      SOURCE KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      DESTINATION KEY (doc_id) REFERENCES ServiceManualDocument (doc_id)
      LABEL PART_OF_DOCUMENT
      PROPERTIES (chapter_slot_id, chapter_no, pdf_page_span, okf_rel_path, kc_entry_id),
    `hp-dragonfly.prj_ontology_hp_dragonfly.edge_playbook_orchestrates_chapter` AS playbook_orchestrates_chapter
      KEY (bridge_id)
      SOURCE KEY (playbook_id) REFERENCES ServicePlaybook (playbook_id)
      DESTINATION KEY (chapter_slot_id) REFERENCES ServiceManualChapter (chapter_slot_id)
      LABEL ORCHESTRATES_REFERENCE
      PROPERTIES (bridge_id, citation_role)
  );
