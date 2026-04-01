"use client";

import { useState } from "react";

export default function DonutChart({ title, subtitle, data = [] }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // Build segments
  let offset = circumference * 0.25; // start from top
  const segments = data.map((d) => {
    const length = (d.value / total) * circumference;
    const seg = { ...d, dasharray: `${length} ${circumference - length}`, dashoffset: -offset };
    offset += length;
    return seg;
  });

  return (
    <div className="sad-chart-card">
      <div className="sad-chart-header">
        <div className="sad-chart-title"><span>{title}</span></div>
        {subtitle && <span className="sad-chart-subtitle">{subtitle}</span>}
      </div>
      <div className="sad-chart-content-wrap">
        <div className="sad-chart-container" style={{ display: "flex", alignItems: "center", gap: 32, padding: "48px" }}>
          {/* Donut SVG */}
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
            {segments.map((seg, i) => (
              <circle
                key={seg.label}
                cx="80" cy="80" r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                style={{
                  opacity: hovered !== null && hovered !== i ? 0.3 : 1,
                  transition: "opacity 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>
          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {data.map((d, i) => (
              <div
                key={d.label}
                style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  opacity: hovered !== null && hovered !== i ? 0.4 : 1,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <span style={{ width: 7, height: 7, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, color: "var(--content-primary)", letterSpacing: "-0.28px" }}>{d.label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--content-primary)" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
