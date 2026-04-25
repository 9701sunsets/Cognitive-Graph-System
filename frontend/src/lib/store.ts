import { create } from "zustand";
import { GraphNode, GraphEdge, AssociateSuggestion } from "@/types";

interface GraphStore {
  // Graph data
  nodes: GraphNode[];
  edges: GraphEdge[];
  setNodes: (nodes: GraphNode[]) => void;
  setEdges: (edges: GraphEdge[]) => void;
  addNodes: (nodes: GraphNode[]) => void;
  addEdges: (edges: GraphEdge[]) => void;
  updateNode: (id: string, data: Partial<GraphNode>) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;

  // UI state
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Input panel
  inputText: string;
  setInputText: (text: string) => void;
  isParsing: boolean;
  setIsParsing: (v: boolean) => void;

  // Association panel
  suggestions: AssociateSuggestion[];
  setSuggestions: (s: AssociateSuggestion[]) => void;
  isAssociating: boolean;
  setIsAssociating: (v: boolean) => void;

  // Notifications
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNodes: (newNodes) =>
    set((s) => {
      const existingIds = new Set(s.nodes.map((n) => n.id));
      const unique = newNodes.filter((n) => !existingIds.has(n.id));
      return { nodes: [...s.nodes, ...unique] };
    }),
  addEdges: (newEdges) =>
    set((s) => {
      const existingIds = new Set(s.edges.map((e) => e.id));
      const unique = newEdges.filter((e) => !existingIds.has(e.id));
      return { edges: [...s.edges, ...unique] };
    }),
  updateNode: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),
  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    })),
  removeEdge: (id) =>
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),

  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id, suggestions: [] }),

  inputText: "",
  setInputText: (text) => set({ inputText: text }),
  isParsing: false,
  setIsParsing: (v) => set({ isParsing: v }),

  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
  isAssociating: false,
  setIsAssociating: (v) => set({ isAssociating: v }),

  toast: null,
  showToast: (message, type = "info") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 5000);
  },
  clearToast: () => set({ toast: null }),
}));
