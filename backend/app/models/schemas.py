from pydantic import BaseModel, Field
from typing import List, Optional


class Node(BaseModel):
    id: str
    label: str
    description: Optional[str] = ""
    x: Optional[float] = None
    y: Optional[float] = None
    type: Optional[str] = "concept"


class Edge(BaseModel):
    id: str
    source: str
    target: str
    relation: str
    weight: float = 0.5


class Graph(BaseModel):
    nodes: List[Node] = []
    edges: List[Edge] = []


class ParseRequest(BaseModel):
    text: str


class ParseResponse(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class AssociateRequest(BaseModel):
    node_id: str
    node_label: str
    context_nodes: Optional[List[dict]] = []


class AssociateSuggestion(BaseModel):
    label: str
    relation: str
    type: str  # analogy | application | related


class AssociateResponse(BaseModel):
    suggestions: List[AssociateSuggestion]


class SaveGraphRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    name: Optional[str] = "default"
