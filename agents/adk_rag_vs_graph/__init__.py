"""Google ADK (Agent Development Kit) Dual-Agent Benchmark Package.

Compares:
1. `vector_rag_agent` (`rag_agent.py`):
   Standard Vector/Chunk RAG + 1-pass SQL agent (`vertex_rag_search`, `execute_sql`).
2. `ontology_graph_agent` (`graph_agent.py`):
   Ontology-grounded GraphRAG agent (`before_agent_callback`, `graph_query_gql`,
   `kc_lookup_aspect`, `before_tool_callback`, `fetch_okf_provision`) backed by
   BigQuery Property Graph (`hp-dragonfly.prj_ontology_hp_dragonfly.hp_dragonfly_ontology_graph`)
   and Dataplex Knowledge Catalog (`okf` Aspect) + OKF v0.2 Markdown.
"""

from .rag_agent import build_vector_rag_agent, run_vector_rag_turn
from .graph_agent import build_ontology_graph_agent, run_ontology_graph_turn

__all__ = [
    "build_vector_rag_agent",
    "run_vector_rag_turn",
    "build_ontology_graph_agent",
    "run_ontology_graph_turn",
]
