import { GraphData, AssociateResponse, GraphNode } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  parseText: (text: string): Promise<GraphData> =>
    request("/api/parse", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  associate: (
    nodeId: string,
    nodeLabel: string,
    contextNodes: Partial<GraphNode>[] = []
  ): Promise<AssociateResponse> =>
    request("/api/associate", {
      method: "POST",
      body: JSON.stringify({
        node_id: nodeId,
        node_label: nodeLabel,
        context_nodes: contextNodes,
      }),
    }),

  saveGraph: (nodes: GraphNode[], edges: any[], name = "default") =>
    request("/api/graph/save", {
      method: "POST",
      body: JSON.stringify({ nodes, edges, name }),
    }),

  loadGraph: (name = "default"): Promise<GraphData> =>
    request(`/api/graph/load?name=${name}`),

  listGraphs: (): Promise<{ graphs: string[] }> =>
    request("/api/graph/list"),
};
