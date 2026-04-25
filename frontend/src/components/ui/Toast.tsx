"use client";
import { useGraphStore } from "@/lib/store";
import { useEffect } from "react";

const TYPE_STYLES = {
  success: { border: "#34d399", color: "#34d399", icon: "✓" },
  error:   { border: "#f87171", color: "#f87171", icon: "✕" },
  info:    { border: "#22d3ee", color: "#22d3ee", icon: "ℹ" },
};

export default function Toast() {
  const { toast, clearToast } = useGraphStore();

  if (!toast) return null;
  const style = TYPE_STYLES[toast.type];

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: "rgba(8,12,24,0.95)",
        border: `1px solid ${style.border}40`,
        boxShadow: `0 0 20px ${style.border}20, 0 8px 32px rgba(0,0,0,0.6)`,
        backdropFilter: "blur(16px)",
        animation: "slideUp 0.3s ease",
        maxWidth: "90vw",
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: `${style.color}20`, color: style.color }}
      >
        {style.icon}
      </span>
      <span className="text-sm text-slate-200 font-mono">{toast.message}</span>
      <button onClick={clearToast} className="text-slate-600 hover:text-slate-300 ml-2 text-xs">
        ✕
      </button>
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to   { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
