"use client";
import { useEffect, useState } from "react";
import { useGraphStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AssociateSuggestion } from "@/types";
import { clsx } from "clsx";

const TYPE_META: Record<string, { label: string; color: string; icon: string }> = {
  analogy:     { label: "类比", color: "#a78bfa", icon: "◈" },
  application: { label: "应用", color: "#34d399", icon: "◆" },
  related:     { label: "关联", color: "#fbbf24", icon: "◇" },
};

export default function InfoPanel() {
  const {
    nodes,
    edges,
    selectedNodeId,
    suggestions,
    setSuggestions,
    isAssociating,
    setIsAssociating,
    updateNode,
    showToast,
    addNodes,
    addEdges,
  } = useGraphStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const [editLabel, setEditLabel] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setEditLabel(selectedNode.label);
      setEditDesc(selectedNode.description || "");
    }
  }, [selectedNodeId]);

  const connectedEdges = edges.filter(
    (e) => e.source === selectedNodeId || e.target === selectedNodeId
  );
  const connectedNodeIds = new Set(
    connectedEdges.flatMap((e) => [e.source, e.target]).filter((id) => id !== selectedNodeId)
  );
  const connectedNodes = nodes.filter((n) => connectedNodeIds.has(n.id));

  const handleAssociate = async () => {
    if (!selectedNode || isAssociating) return;
    setIsAssociating(true);
    setSuggestions([]);
    try {
      const res = await api.associate(
        selectedNode.id,
        selectedNode.label,
        connectedNodes.map((n) => ({ label: n.label }))
      );
      setSuggestions(res.suggestions);
    } catch (e: any) {
      showToast(e.message || "联想生成失败", "error");
    } finally {
      setIsAssociating(false);
    }
  };

  const handleAddSuggestion = (s: AssociateSuggestion) => {
    if (!selectedNode) return;
    const newId = `s-${Date.now()}`;
    addNodes([{ id: newId, label: s.label, type: "concept", description: "" }]);
    addEdges([{
      id: `e-${Date.now()}`,
      source: selectedNode.id,
      target: newId,
      relation: s.relation,
    }]);
    showToast(`已添加节点「${s.label}」`, "success");
  };

  const handleSaveEdit = () => {
    if (!selectedNodeId) return;
    updateNode(selectedNodeId, { label: editLabel, description: editDesc });
    setIsEditing(false);
    showToast("节点已更新", "success");
  };

  return (
    <div className="h-full flex flex-col glass-panel border-l border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
        <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa]" />
        <span className="text-xs font-mono text-violet-400 tracking-wider uppercase">
          节点信息 & 联想
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selectedNode ? (
          /* No selection */
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="text-3xl mb-3 opacity-30">◎</div>
            <p className="text-xs font-mono text-slate-600">点击图谱中的节点<br />查看详情和生成联想</p>

            {/* Graph stats */}
            <div className="mt-8 w-full space-y-2">
              <StatRow label="节点总数" value={nodes.length} color="#22d3ee" />
              <StatRow label="关系总数" value={edges.length} color="#a78bfa" />
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Node card */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "rgba(34,211,238,0.04)",
                border: "1px solid rgba(34,211,238,0.2)",
              }}
            >
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full bg-transparent border-b border-cyan-400/40 text-sm text-white outline-none pb-1 font-semibold"
                    placeholder="节点名称"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-400 outline-none resize-none font-mono"
                    rows={2}
                    placeholder="描述（可选）"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 py-1 text-xs rounded"
                      style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)" }}
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-1 text-xs rounded text-slate-500"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-bold text-white">{selectedNode.label}</p>
                      {selectedNode.description && (
                        <p className="text-xs text-slate-500 mt-1 font-mono leading-relaxed">
                          {selectedNode.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-slate-600 hover:text-cyan-400 text-xs transition-colors shrink-0"
                    >
                      ✎
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
                    <span className="text-[10px] font-mono text-slate-600">
                      ID: <span className="text-slate-500">{selectedNode.id}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      连接: <span className="text-cyan-400">{connectedNodes.length}</span>
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Connected nodes */}
            {connectedNodes.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-2">
                  关联节点 ({connectedNodes.length})
                </p>
                <div className="space-y-1">
                  {connectedNodes.map((n) => {
                    const edge = connectedEdges.find(
                      (e) => (e.source === n.id && e.target === selectedNodeId) ||
                             (e.target === n.id && e.source === selectedNodeId)
                    );
                    const isSource = edge?.source === selectedNodeId;
                    return (
                      <div
                        key={n.id}
                        className="flex items-center gap-2 py-1.5 px-2 rounded"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
                      >
                        <span className="text-[10px] font-mono text-slate-600">
                          {isSource ? "→" : "←"}
                        </span>
                        <span className="text-xs text-slate-300 flex-1 truncate">{n.label}</span>
                        {edge?.relation && (
                          <span className="text-[9px] font-mono text-slate-600 shrink-0">
                            {edge.relation}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Associate button */}
            <button
              onClick={handleAssociate}
              disabled={isAssociating}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(167,139,250,0.05) 100%)",
                border: "1px solid rgba(167,139,250,0.4)",
                color: "#a78bfa",
                boxShadow: "0 0 12px rgba(167,139,250,0.1)",
              }}
            >
              {isAssociating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="flex gap-1">
                    <span className="dot-1 w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                    <span className="dot-2 w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                    <span className="dot-3 w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
                  </span>
                  生成联想中...
                </span>
              ) : (
                "✦ 生成认知联想"
              )}
            </button>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-2">
                  联想结果 — 点击添加到图谱
                </p>
                <div className="space-y-2">
                  {suggestions.map((s, i) => {
                    const meta = TYPE_META[s.type] || TYPE_META.related;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAddSuggestion(s)}
                        className="w-full text-left rounded-lg p-3 transition-all duration-200 group"
                        style={{
                          background: `rgba(${s.type === "analogy" ? "167,139,250" : s.type === "application" ? "52,211,153" : "251,191,36"},0.04)`,
                          border: `1px solid ${meta.color}20`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${meta.color}50`;
                          e.currentTarget.style.background = `rgba(${s.type === "analogy" ? "167,139,250" : s.type === "application" ? "52,211,153" : "251,191,36"},0.08)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `${meta.color}20`;
                          e.currentTarget.style.background = `rgba(${s.type === "analogy" ? "167,139,250" : s.type === "application" ? "52,211,153" : "251,191,36"},0.04)`;
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: meta.color, fontSize: 10 }}>{meta.icon}</span>
                          <span className="text-[10px] font-mono" style={{ color: meta.color }}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 ml-auto">
                            {s.relation} +
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-200">{s.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
      <span className="text-[10px] font-mono text-slate-600">{label}</span>
      <span className="text-sm font-bold font-mono" style={{ color }}>{value}</span>
    </div>
  );
}
