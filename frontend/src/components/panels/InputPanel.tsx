"use client";
import { useState } from "react";
import { useGraphStore } from "@/lib/store";
import { api } from "@/lib/api";

const EXAMPLE_TEXTS = [
  "神经网络通过反向传播算法训练，利用梯度下降优化权重。深度学习是机器学习的子领域，包含卷积神经网络（CNN）和循环神经网络（RNN）。",
  "量子计算利用量子叠加和量子纠缠实现并行计算。量子比特不同于经典比特，可以同时处于0和1的叠加态。",
  "CRISPR-Cas9基因编辑技术允许精确修改DNA序列。该技术在医学、农业和基础研究中有广泛应用，可用于治疗遗传疾病。",
];

export default function InputPanel() {
  const { inputText, setInputText, isParsing, setIsParsing, setNodes, setEdges, showToast } =
    useGraphStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleParse = async () => {
    if (!inputText.trim() || isParsing) return;
    setIsParsing(true);
    try {
      const result = await api.parseText(inputText);
      setNodes(result.nodes);
      setEdges(result.edges);
      showToast(`已生成 ${result.nodes.length} 个节点，${result.edges.length} 条关系`, "success");
    } catch (e: any) {
      showToast(e.message || "解析失败，请检查API配置", "error");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    const { nodes, edges } = useGraphStore.getState();
    try {
      await api.saveGraph(nodes, edges);
      showToast("图谱已保存", "success");
    } catch {
      showToast("保存失败", "error");
    }
  };

  const handleLoad = async () => {
    try {
      const data = await api.loadGraph();
      if (data.nodes.length === 0) {
        showToast("没有找到保存的图谱", "info");
        return;
      }
      setNodes(data.nodes);
      setEdges(data.edges);
      showToast("图谱已加载", "success");
    } catch {
      showToast("加载失败", "error");
    }
  };

  return (
    <div className="h-full flex flex-col glass-panel border-r border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
            知识输入
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
        >
          {isExpanded ? "─" : "+"}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Textarea */}
          <div className="flex-1 p-3 overflow-hidden">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入知识文本，AI将自动提取概念和关系..."
              className="w-full h-full bg-transparent text-sm text-slate-300 placeholder-slate-600 resize-none outline-none font-mono leading-relaxed"
              style={{ minHeight: 120 }}
            />
          </div>

          {/* Char count */}
          <div className="px-3 pb-1">
            <span className="text-[10px] font-mono text-slate-600">
              {inputText.length} 字符
            </span>
          </div>

          {/* Examples */}
          <div className="px-3 pb-2">
            <p className="text-[10px] font-mono text-slate-600 mb-2 uppercase tracking-wider">
              示例文本
            </p>
            <div className="flex flex-col gap-1">
              {EXAMPLE_TEXTS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(t)}
                  className="text-left text-[10px] text-slate-500 hover:text-cyan-400 transition-colors line-clamp-1 truncate font-mono"
                >
                  › {t.slice(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          {/* Parse button */}
          <div className="p-3 border-t border-[var(--border)]">
            <button
              onClick={handleParse}
              disabled={isParsing || !inputText.trim()}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isParsing
                  ? "rgba(34,211,238,0.1)"
                  : "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.05) 100%)",
                border: "1px solid rgba(34,211,238,0.4)",
                color: "#22d3ee",
                boxShadow: isParsing ? "none" : "0 0 12px rgba(34,211,238,0.1)",
              }}
            >
              {isParsing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="flex gap-1">
                    <span className="dot-1 w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                    <span className="dot-2 w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                    <span className="dot-3 w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                  </span>
                  AI 解析中...
                </span>
              ) : (
                "⚡ 生成知识图谱"
              )}
            </button>
          </div>

          {/* Save / Load */}
          <div className="px-3 pb-3 flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-1.5 rounded text-xs font-mono transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "#475569",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              ↑ 保存
            </button>
            <button
              onClick={handleLoad}
              className="flex-1 py-1.5 rounded text-xs font-mono transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "#475569",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              ↓ 加载
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
