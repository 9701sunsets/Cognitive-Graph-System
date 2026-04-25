"use client";
import { EdgeLabelRenderer, EdgeProps, getBezierPath, BaseEdge } from "reactflow";

export default function CognitiveEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "#22d3ee" : "#243060",
          strokeWidth: selected ? 2 : 1.5,
          filter: selected ? "drop-shadow(0 0 4px #22d3ee)" : undefined,
          transition: "all 0.2s",
        }}
      />
      {data?.relation && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "none",
              background: "rgba(8,12,24,0.9)",
              border: `1px solid ${selected ? "#22d3ee40" : "#1a234080"}`,
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              color: selected ? "#22d3ee" : "#475569",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              backdropFilter: "blur(4px)",
              transition: "all 0.2s",
            }}
          >
            {data.relation}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
