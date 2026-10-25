#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Customer-ready builder script for HP Dragonfly Ontology Structured Dataset in BigQuery.

Usage:
    .venv/bin/python scripts/build_hp_dragonfly_dataset.py \
        --project-id hp-dragonfly \
        --dataset-id prj-ontology-hp-dragonfly \
        --location US \
        --create-property-graph
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List

# Prevent mTLS client-cert helper segfaults on Linux workstations
os.environ.setdefault("GOOGLE_API_USE_CLIENT_CERTIFICATE", "false")

from google.api_core.exceptions import NotFound
from google.cloud import bigquery

from hp_dragonfly_seed_data import SEED_DATA, TABLE_SCHEMAS


def normalize_dataset_id(raw_dataset_id: str) -> str:
    """Normalizes hyphens to underscores because BigQuery dataset IDs only allow [a-zA-Z0-9_]."""
    sanitized = re.sub(r"[^a-zA-Z0-9_]", "_", raw_dataset_id.strip())
    return sanitized


def export_local_jsonl(data_dir: Path) -> None:
    """Exports all seed tables as local JSONL files for Git versioning & offline inspection."""
    data_dir.mkdir(parents=True, exist_ok=True)
    for table_name, rows in SEED_DATA.items():
        out_path = data_dir / f"{table_name}.jsonl"
        with out_path.open("w", encoding="utf-8") as f:
            for row in rows:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")
        print(f"  [LOCAL EXPORT] {out_path} ({len(rows)} rows)")


def build_schema_fields(field_tuples: List[tuple]) -> List[bigquery.SchemaField]:
    """Converts (name, field_type, mode, description) tuples into BigQuery SchemaFields."""
    return [
        bigquery.SchemaField(
            name=name,
            field_type=field_type,
            mode=mode,
            description=description,
        )
        for name, field_type, mode, description in field_tuples
    ]


def ensure_dataset(
    client: bigquery.Client,
    project_id: str,
    requested_dataset_id: str,
    location: str,
) -> str:
    """Creates or updates the target BigQuery dataset."""
    bq_dataset_id = normalize_dataset_id(requested_dataset_id)
    full_dataset_ref = f"{project_id}.{bq_dataset_id}"

    if bq_dataset_id != requested_dataset_id:
        print(
            f"[INFO] BigQuery dataset IDs only allow letters, numbers, and underscores.\n"
            f"       Normalized dataset ID '{requested_dataset_id}' -> '{bq_dataset_id}' "
            f"(friendly_name='{requested_dataset_id}')."
        )

    try:
        dataset = client.get_dataset(full_dataset_ref)
        print(f"[OK] Dataset already exists: {full_dataset_ref} (location={dataset.location})")
    except NotFound:
        dataset = bigquery.Dataset(full_dataset_ref)
        dataset.location = location
        dataset.friendly_name = requested_dataset_id
        dataset.description = (
            f"HP Dragonfly G3 / Folio G3 & Series Ontology Structured Dataset "
            f"(Requested ID: {requested_dataset_id}). Contains product specs, SKUs, "
            f"spare parts catalog, disassembly dependency edges, ports/docks, BIOS/NVM specs, "
            f"diagnostic codes, and community troubleshooting cases."
        )
        dataset.labels = {
            "datacloud": "jetski",
            "domain": "hp-dragonfly-ontology",
            "layer": "structured-ontology",
        }
        dataset = client.create_dataset(dataset, timeout=30)
        print(f"[CREATED] Dataset created: {full_dataset_ref} (location={dataset.location})")

    return bq_dataset_id


def create_and_load_tables(
    client: bigquery.Client,
    project_id: str,
    bq_dataset_id: str,
) -> Dict[str, int]:
    """Creates all structured ontology tables and loads seed data into BigQuery."""
    loaded_counts: Dict[str, int] = {}

    for table_name, meta in TABLE_SCHEMAS.items():
        table_ref = f"{project_id}.{bq_dataset_id}.{table_name}"
        schema = build_schema_fields(meta["fields"])
        rows = SEED_DATA[table_name]

        table = bigquery.Table(table_ref, schema=schema)
        table.description = meta["description"]
        table.labels = {
            "datacloud": "jetski",
            "domain": "hp-dragonfly-ontology",
        }

        # Create or recreate table to ensure schema descriptions are up to date
        client.delete_table(table_ref, not_found_ok=True)
        client.create_table(table)

        job_config = bigquery.LoadJobConfig(
            schema=schema,
            source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
            write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
            labels={"datacloud": "jetski"},
        )

        load_job = client.load_table_from_json(rows, table_ref, job_config=job_config)
        load_job.result()

        dest_table = client.get_table(table_ref)
        loaded_counts[table_name] = dest_table.num_rows
        print(f"  [TABLE LOADED] {table_ref:<65} -> {dest_table.num_rows:>3} rows")

    return loaded_counts


def generate_property_graph_ddl(project_id: str, bq_dataset_id: str) -> str:
    """Generates the BigQuery SQL/GQL Property Graph DDL linking models, SKUs, parts, and cases."""
    return f"""-- BigQuery Property Graph DDL for HP Dragonfly Ontology Layer
CREATE OR REPLACE PROPERTY GRAPH `{project_id}.{bq_dataset_id}.hp_dragonfly_ontology_graph`
  NODE TABLES (
    `{project_id}.{bq_dataset_id}.dragonfly_series_models` AS ProductModel
      KEY (model_id)
      LABEL ProductModel
      PROPERTIES ALL COLUMNS,
    `{project_id}.{bq_dataset_id}.product_skus_and_configs` AS ProductSKU
      KEY (sku_id)
      LABEL ProductSKU
      PROPERTIES ALL COLUMNS,
    `{project_id}.{bq_dataset_id}.hardware_components_catalog` AS HardwareComponent
      KEY (part_number)
      LABEL HardwareComponent
      PROPERTIES ALL COLUMNS,
    `{project_id}.{bq_dataset_id}.diagnostic_codes_reference` AS DiagnosticCode
      KEY (diagnostic_code)
      LABEL DiagnosticCode
      PROPERTIES ALL COLUMNS,
    `{project_id}.{bq_dataset_id}.community_troubleshooting_cases` AS TroubleshootingCase
      KEY (case_id)
      LABEL TroubleshootingCase
      PROPERTIES ALL COLUMNS
  )
  EDGE TABLES (
    `{project_id}.{bq_dataset_id}.product_skus_and_configs` AS sku_belongs_to_model
      KEY (sku_id)
      SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)
      DESTINATION KEY (model_id) REFERENCES ProductModel (model_id)
      LABEL BELONGS_TO_MODEL
      PROPERTIES (sku_id, model_id, region_code, cpu_model, ram_gb, ssd_capacity_gb),
    `{project_id}.{bq_dataset_id}.product_skus_and_configs` AS sku_uses_system_board
      KEY (sku_id)
      SOURCE KEY (sku_id) REFERENCES ProductSKU (sku_id)
      DESTINATION KEY (system_board_part_no) REFERENCES HardwareComponent (part_number)
      LABEL USES_SYSTEM_BOARD
      PROPERTIES (sku_id, system_board_part_no, cpu_model, ram_gb),
    `{project_id}.{bq_dataset_id}.component_disassembly_deps` AS component_requires_removal
      KEY (dependency_id)
      SOURCE KEY (target_part_number) REFERENCES HardwareComponent (part_number)
      DESTINATION KEY (prerequisite_part_number) REFERENCES HardwareComponent (part_number)
      LABEL REQUIRES_REMOVAL_OF
      PROPERTIES (dependency_id, step_order, fastener_screw_spec, required_tools, caution_note, manual_page_ref),
    `{project_id}.{bq_dataset_id}.community_troubleshooting_cases` AS case_affects_component
      KEY (case_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (affected_part_number) REFERENCES HardwareComponent (part_number)
      LABEL AFFECTS_COMPONENT
      PROPERTIES (case_id, issue_category, severity, requires_part_replacement),
    `{project_id}.{bq_dataset_id}.community_troubleshooting_cases` AS case_triggers_diagnostic
      KEY (case_id)
      SOURCE KEY (case_id) REFERENCES TroubleshootingCase (case_id)
      DESTINATION KEY (error_or_diagnostic_code) REFERENCES DiagnosticCode (diagnostic_code)
      LABEL TRIGGERS_DIAGNOSTIC
      PROPERTIES (case_id, reported_symptom, error_or_diagnostic_code)
  );
"""


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build HP Dragonfly Ontology Structured Dataset in BigQuery."
    )
    parser.add_argument(
        "--project-id",
        default="hp-dragonfly",
        help="Target GCP Project ID (default: hp-dragonfly)",
    )
    parser.add_argument(
        "--dataset-id",
        default="prj-ontology-hp-dragonfly",
        help="Requested BigQuery Dataset ID (default: prj-ontology-hp-dragonfly)",
    )
    parser.add_argument(
        "--location",
        default="US",
        help="BigQuery Dataset Location (default: US)",
    )
    parser.add_argument(
        "--create-property-graph",
        action="store_true",
        default=True,
        help="Also create the BigQuery Property Graph (hp_dragonfly_ontology_graph)",
    )
    args = parser.parse_args()

    workspace_root = Path(__file__).resolve().parent.parent
    data_dir = workspace_root / "data"
    scripts_dir = workspace_root / "scripts"

    print("=" * 80)
    print("HP Dragonfly Ontology Dataset Builder")
    print("=" * 80)
    print(f"Workspace Root : {workspace_root}")
    print(f"Target Project : {args.project_id}")
    print(f"Requested DS   : {args.dataset_id}")

    print("\n[STEP 1] Exporting local JSONL seed files...")
    export_local_jsonl(data_dir)

    print("\n[STEP 2] Initializing BigQuery client & dataset...")
    client = bigquery.Client(project=args.project_id)
    bq_dataset_id = ensure_dataset(
        client=client,
        project_id=args.project_id,
        requested_dataset_id=args.dataset_id,
        location=args.location,
    )

    print("\n[STEP 3] Creating and populating 8 structured tables in BigQuery...")
    loaded_counts = create_and_load_tables(
        client=client,
        project_id=args.project_id,
        bq_dataset_id=bq_dataset_id,
    )

    ddl_sql = generate_property_graph_ddl(args.project_id, bq_dataset_id)
    ddl_path = scripts_dir / "create_property_graph.sql"
    ddl_path.write_text(ddl_sql, encoding="utf-8")
    print(f"\n[STEP 4] Saved Property Graph DDL to {ddl_path}")

    if args.create_property_graph:
        print("         Executing CREATE OR REPLACE PROPERTY GRAPH in BigQuery...")
        q_config = bigquery.QueryJobConfig(labels={"datacloud": "jetski"})
        client.query(ddl_sql, job_config=q_config).result()
        print(
            f"  [GRAPH CREATED] `{args.project_id}.{bq_dataset_id}.hp_dragonfly_ontology_graph`"
        )

    print("\n" + "=" * 80)
    print(f"SUCCESS: All {len(loaded_counts)} tables provisioned in `{args.project_id}.{bq_dataset_id}`")
    print("=" * 80)
    return 0


if __name__ == "__main__":
    sys.exit(main())
