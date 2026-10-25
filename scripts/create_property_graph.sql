-- BigQuery Property Graph DDL for HP Dragonfly Ontology Layer
CREATE OR REPLACE PROPERTY GRAPH `hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`
  NODE TABLES (
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
      PROPERTIES ALL COLUMNS
  )
  EDGE TABLES (
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
      PROPERTIES (case_id, reported_symptom, error_or_diagnostic_code)
  );
