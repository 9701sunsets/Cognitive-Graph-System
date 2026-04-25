export interface GraphNode {
  id: string;
  label: string;
  description?: string;
  type?: "concept" | "entity" | "event";
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AssociateSuggestion {
  label: string;
  relation: string;
  type: "analogy" | "application" | "related";
}

export interface AssociateResponse {
  suggestions: AssociateSuggestion[];
}
