"use client";

import { useState, useRef } from "react";

const defaultWeeks = [
  { week: "Week 1", pct: 90, color: "var(--utilities-content-content-green)" },
  { week: "Week 2", pct: 88, color: "var(--utilities-content-content-green)" },
  { week: "Week 3", pct: 48, color: "var(--utilities-content-content-red)" },
  { week: "Week 4", pct: 85, color: "var(--utilities-content-content-orange)" },
];

const yLabels = ["100%", "80%", "60%", "40%", "20%", "0%"];

export default function WeeklyPerformance({ title = "Weekly performance · Chat support", subtitle = "Average score per week", data = defaultWeeks }) {
  const [hovered, setHovered] = useState(null);
  const barsRef = useRef(null);

  function handleBarHover(e, w, i) {
    const rect = barsRef.current.getBoundingClientRect();
    setHovered({
      index: i,
      week: w.week,
      pct: w.pct,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
      <div className="sad-chart-card">
        <div className="sad-chart-header">
          <div className="sad-chart-title"><span>{title}</span></div>
          {subtitle && <span className="sad-chart-subtitle">{subtitle}</span>}
        </div>
        <div className="sad-chart-content-wrap">
          <div className="sad-chart-container" style={{ display: "flex", gap: 0, minHeight: 220 }}>
            {/* Y-axis */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 0 28px 14px", fontSize: 12, color: "var(--content-tertiary)", textAlign: "right", width: 45, flexShrink: 0, fontFeatureSettings: "'lnum' 1, 'pnum' 1" }}>
              {yLabels.map((v) => <span key={v}>{v}</span>)}
            </div>
            {/* Bars area */}
            <div ref={barsRef} style={{ flex: 1, position: "relative", padding: "20px 14px 0 14px" }} onMouseLeave={() => setHovered(null)}>
              {/* Grid lines — dashed */}
              <div style={{ position: "absolute", inset: "20px 14px 28px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                {yLabels.map((v, i) => (
                  <div
                    key={v}
                    style={{
                      width: "100%",
                      height: 0,
                      borderTop: i === 0 || i === yLabels.length - 1
                        ? "1px solid var(--stroke-secondarystrong)"
                        : "1px dashed var(--stroke-dashed)",
                    }}
                  />
                ))}
              </div>
              {/* Bars */}
              <div style={{ display: "flex", height: "calc(100% - 28px)", position: "relative" }}>
                {data.map((w, i) => (
                  <div
                    key={w.week}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 12px", cursor: "pointer" }}
                    onMouseMove={(e) => handleBarHover(e, w, i)}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 64,
                        background: w.color,
                        borderRadius: "4px 4px 0 0",
                        height: `${w.pct}%`,
                        minHeight: 4,
                        opacity: hovered !== null && hovered.index !== i ? 0.4 : 1,
                        transition: "opacity 0.15s",
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* X-axis */}
              <div style={{ display: "flex", height: 28 }}>
                {data.map((w) => (
                  <div key={w.week} style={{ flex: 1, textAlign: "center", fontSize: 12, color: "var(--content-tertiary)", paddingTop: 4, fontFeatureSettings: "'lnum' 1, 'pnum' 1" }}>{w.week}</div>
                ))}
              </div>

              {/* Tooltip */}
              {hovered && (
                <div style={{
                  position: "absolute",
                  zIndex: 10,
                  pointerEvents: "none",
                  background: "var(--surface-tooltip, #010103)",
                  color: "var(--content-ontooltip, #fafafc)",
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontFamily: "var(--font-family)",
                  fontSize: 12,
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                  transform: "translate(-50%, -100%)",
                  marginTop: -10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  left: hovered.x,
                  top: hovered.y,
                }}>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>{hovered.week}</div>
                  <div style={{ color: "rgba(250,250,252,0.5)" }}>Score: <span style={{ color: "#fff", fontWeight: 500 }}>{hovered.pct}%</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
