"use client";

import { useState, useRef } from "react";

export default function HorizontalBarChart({ title, subtitle, data = [], max, color = "var(--utilities-content-content-red)" }) {
  const [hovered, setHovered] = useState(null);
  const wrapRef = useRef(null);
  const computedMax = max || Math.ceil(Math.max(...data.map((d) => d.value)) / 2) * 2;
  const ticks = [];
  const step = computedMax <= 10 ? 2 : Math.ceil(computedMax / 5);
  for (let i = 0; i <= computedMax; i += step) ticks.push(i);

  function handleHover(e, d, i) {
    const rect = wrapRef.current.getBoundingClientRect();
    setHovered({ index: i, label: d.label, value: d.value, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div className="sad-chart-card">
      <div className="sad-chart-header">
        <div className="sad-chart-title"><span>{title}</span></div>
        {subtitle && <span className="sad-chart-subtitle">{subtitle}</span>}
      </div>
      <div className="sad-chart-content-wrap">
        <div className="sad-chart-container" ref={wrapRef} style={{ position: "relative", padding: "12px 14px" }} onMouseLeave={() => setHovered(null)}>
          {data.map((d, i) => (
            <div
              key={d.label}
              style={{ display: "flex", alignItems: "center", padding: "8px 0", cursor: "pointer" }}
              onMouseMove={(e) => handleHover(e, d, i)}
            >
              <div style={{ width: 100, flexShrink: 0, fontSize: 12, color: "var(--content-tertiary)" }}>{d.label}</div>
              <div style={{ flex: 1, height: 16, borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  width: `${(d.value / computedMax) * 100}%`,
                  height: "100%",
                  background: d.color || color,
                  borderRadius: 2,
                  opacity: hovered !== null && hovered.index !== i ? 0.4 : 1,
                  transition: "opacity 0.15s",
                }} />
              </div>
            </div>
          ))}
          {/* X-axis */}
          <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 100, fontSize: 12, color: "var(--content-tertiary)", paddingTop: 4 }}>
            {ticks.map((v) => <span key={v}>{v}</span>)}
          </div>

          {/* Tooltip */}
          {hovered && (
            <div style={{
              position: "absolute", zIndex: 10, pointerEvents: "none",
              background: "var(--surface-tooltip, #010103)", color: "var(--content-ontooltip, #fafafc)",
              borderRadius: 6, padding: "8px 10px", fontFamily: "var(--font-family)",
              fontSize: 12, lineHeight: "16px", whiteSpace: "nowrap",
              transform: "translate(-50%, -100%)", marginTop: -10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              left: hovered.x, top: hovered.y,
            }}>
              <div style={{ fontWeight: 500, marginBottom: 2 }}>{hovered.label}</div>
              <div style={{ color: "rgba(250,250,252,0.5)" }}>Violations: <span style={{ color: "#fff", fontWeight: 500 }}>{hovered.value}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
