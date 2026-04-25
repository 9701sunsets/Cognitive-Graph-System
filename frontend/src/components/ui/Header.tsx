"use client";
import { useGraphStore } from "@/lib/store";

export default function Header() {
  const { nodes, edges } = useGraphStore();

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] glass-panel relative z-20 shrink-0"
      style={{ minHeight: 52 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        {/* Animated logo mark */}
        <div className="relative w-7 h-7 shrink-0">
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: "conic-gradient(from 0deg, #22d3ee, #a78bfa, #22d3ee)",
              animation: "spin 8s linear infinite",
            }}
          />
          <div
            className="absolute inset-0.5 rounded-full"
            style={{ background: "var(--void)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </div>
        </div>

        <div>
          <h1
            className="text-sm font-bold tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cognitive Graph
          </h1>
          <p className="text-[9px] font-mono text-slate-600 tracking-widest uppercase">
            AI 认知图谱系统
          </p>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-4">
        <StatusChip label="节点" value={nodes.length} color="#22d3ee" />
        <StatusChip label="关系" value={edges.length} color="#a78bfa" />

        <div className="flex items-center gap-1.5 ml-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 6px #34d399", animation: "pulse 2s infinite" }}
          />
          <span className="text-[10px] font-mono text-slate-600">系统就绪</span>
        </div>
      </div>

      {/* Right: shortcuts hint */}
      <div className="hidden md:flex items-center gap-3">
        <Shortcut keys={["Del"]} label="删除节点" />
        <Shortcut keys={["拖拽"]} label="连接节点" />
        <Shortcut keys={["Scroll"]} label="缩放" />
      </div>

      {/* Scanline effect */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </header>
  );
}

function StatusChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: `${color}10`, border: `1px solid ${color}20` }}
    >
      <span className="text-[10px] font-mono" style={{ color: `${color}90` }}>
        {label}
      </span>
      <span className="text-xs font-bold font-mono" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((k) => (
        <kbd
          key={k}
          className="px-1.5 py-0.5 text-[9px] font-mono text-slate-500 rounded"
          style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
        >
          {k}
        </kbd>
      ))}
      <span className="text-[9px] font-mono text-slate-600 ml-0.5">{label}</span>
    </div>
  );
}
