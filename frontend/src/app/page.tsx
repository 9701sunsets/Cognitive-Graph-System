"use client";
import dynamic from "next/dynamic";
import Header from "@/components/ui/Header";
import InputPanel from "@/components/panels/InputPanel";
import InfoPanel from "@/components/panels/InfoPanel";
import Toast from "@/components/ui/Toast";

// GraphCanvas uses ReactFlow which requires browser APIs
const GraphCanvas = dynamic(() => import("@/components/graph/GraphCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
            style={{ animation: "spin 2s linear infinite" }}
          />
          <div
            className="absolute inset-2 rounded-full border-t-2 border-cyan-400"
            style={{ animation: "spin 1.5s linear infinite reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>
        <p className="text-xs font-mono text-slate-600">初始化图谱引擎...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[var(--void)] relative">
      {/* Ambient background blobs */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)",
          top: "10%",
          left: "30%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute pointer-events-none z-0"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)",
          bottom: "10%",
          right: "20%",
        }}
      />

      {/* Header */}
      <Header />

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left: Input */}
        <div className="w-[280px] shrink-0 flex flex-col overflow-hidden">
          <InputPanel />
        </div>

        {/* Center: Graph canvas */}
        <div className="flex-1 relative overflow-hidden">
          <GraphCanvas />
        </div>

        {/* Right: Info & Association */}
        <div className="w-[300px] shrink-0 flex flex-col overflow-hidden">
          <InfoPanel />
        </div>
      </div>

      {/* Toast */}
      <Toast />
    </div>
  );
}
