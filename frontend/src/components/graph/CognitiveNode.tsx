"use client";
import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useGraphStore } from "@/lib/store";

const TYPE_COLORS: Record<string, { border: string; glow: string; dot: string }> = {
  concept: { border: "#22d3ee", glow: "rgba(34,211,238,0.25)", dot: "#22d3ee" },
  entity:  { border: "#a78bfa", glow: "rgba(167,139,250,0.25)", dot: "#a78bfa" },
  event:   { border: "#34d399", glow: "rgba(52,211,153,0.25)", dot: "#34d399" },
};

function CognitiveNode({ id, data, selected }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const { setSelectedNodeId, selectedNodeId } = useGraphStore();
  const isSelected = selected || selectedNodeId === id;

  const colors = TYPE_COLORS[data.type || "concept"];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setSelectedNodeId(id)}
      style={{
        border: `1px solid ${isSelected || hovered ? colors.border : "#1a2340"}`,
        boxShadow: isSelected
          ? `0 0 0 1px ${colors.border}, 0 0 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`
          : hovered
          ? `0 0 12px ${colors.glow}`
          : "0 4px 20px rgba(0,0,0,0.5)",
        background: isSelected
          ? `linear-gradient(135deg, rgba(13,18,36,0.95) 0%, ${colors.glow} 100%)`
          : "rgba(13,18,36,0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: "10px",
        padding: "10px 16px",
        minWidth: "100px",
        maxWidth: "180px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* Pulse ring when selected */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 14,
            border: `1px solid ${colors.border}`,
            animation: "ring-pulse 2s ease-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Top dot indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: colors.dot,
            boxShadow: `0 0 6px ${colors.dot}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 10,
            color: colors.dot,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em",
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          {data.type || "concept"}
        </span>
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#e2e8f0",
          lineHeight: 1.3,
          wordBreak: "break-word",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {data.label}
      </div>

      {/* Description */}
      {data.description && (
        <div
          style={{
            fontSize: 10,
            color: "#475569",
            marginTop: 4,
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {data.description}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: colors.border,
          border: "2px solid var(--void)",
          width: 8,
          height: 8,
          opacity: hovered || isSelected ? 1 : 0.3,
          transition: "opacity 0.2s",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: colors.border,
          border: "2px solid var(--void)",
          width: 8,
          height: 8,
          opacity: hovered || isSelected ? 1 : 0.3,
          transition: "opacity 0.2s",
        }}
      />
    </div>
  );
}

export default memo(CognitiveNode);
