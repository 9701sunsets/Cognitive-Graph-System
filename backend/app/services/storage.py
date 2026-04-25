import json
import os
from typing import Dict, Optional
from app.models.schemas import Graph, Node, Edge

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../data")
os.makedirs(DATA_DIR, exist_ok=True)


def _graph_path(name: str) -> str:
    safe = name.replace("/", "_").replace("..", "")
    return os.path.join(DATA_DIR, f"{safe}.json")


def save_graph(name: str, graph: Graph) -> bool:
    try:
        with open(_graph_path(name), "w", encoding="utf-8") as f:
            json.dump(graph.model_dump(), f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Save error: {e}")
        return False


def load_graph(name: str) -> Optional[Graph]:
    path = _graph_path(name)
    if not os.path.exists(path):
        return Graph(nodes=[], edges=[])
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return Graph(**data)
    except Exception as e:
        print(f"Load error: {e}")
        return Graph(nodes=[], edges=[])


def list_graphs() -> list:
    files = [f[:-5] for f in os.listdir(DATA_DIR) if f.endswith(".json")]
    return files
