"use client";

import { useState, useRef } from "react";

const defaultMetrics = [
  { label: "Follow-up action", user: 88, team: 82 },
  { label: "Knowledge accuracy", user: 85, team: 78 },
  { label: "Escalation handling", user: 72, team: 68 },
  { label: "Closing protocol", user: 95, team: 93 },
  { label: "Empathy display", user: 55, team: 90 },
  { label: "Issue resolution", user: 80, team: 75 },
];

const pctFull = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
const pctMedium = ["0%", "20%", "40%", "60%", "80%", "100%"];
const pctSmall = ["0%", "50%", "100%"];

function buildAxisSets(max, step) {
  const full = [];
  for (let i = 0; i <= max; i += step) full.push(i);
  // medium: every 2nd
  const medium = full.filter((_, i) => i % 2 === 0);
  // small: first, mid, last
  const small = [full[0], full[Math.floor(full.length / 2)], full[full.length - 1]];
  return { full, medium, small };
}

export default function PerformanceComparison({
  title = "Performance vs Team Average",
  userName = "Priya Sharma",
  data = defaultMetrics,
  // Single-bar mode: pass data as [{ label, value }] with singleBar config
  singleBar = null, // { color, max, step, tooltipLabel }
  legend, // custom legend array: [{ label, dotClass }] or null for default
}) {
  const [tooltip, setTooltip] = useState(null);
  const barsRef = useRef(null);

  const isSingle = !!singleBar;
  const max = singleBar?.max || 100;
  const step = singleBar?.step || (max <= 20 ? 2 : 10);
  const barColor = singleBar?.color || "var(--charts-positive)";
  const tooltipLabel = singleBar?.tooltipLabel || "Value";

  // Axis labels
  const axisSets = isSingle
    ? buildAxisSets(max, step)
    : { full: pctFull, medium: pctMedium, small: pctSmall };

  // Grid count = full axis length
  const gridCount = axisSets.full.length;

  function handleHover(e, metric, type) {
    const rect = barsRef.current.getBoundingClientRect();
    setTooltip({
      label: metric.label,
      user: metric.user,
      team: metric.team,
      value: metric.value,
      highlight: type,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div className="perf-compare">
      <div className="perf-compare-header">
        <div className="perf-compare-title">{title}</div>
        {!isSingle && (
          <div className="perf-compare-legend">
            <div className="perf-compare-legend-item">
              <div className="perf-compare-legend-dot perf-compare-legend-dot--user" />
              <span className="perf-compare-legend-label">{userName}</span>
            </div>
            <div className="perf-compare-legend-item">
              <div className="perf-compare-legend-dot perf-compare-legend-dot--team" />
              <span className="perf-compare-legend-label">Team average</span>
            </div>
          </div>
        )}
      </div>

      <div className="perf-compare-content">
        <div className="perf-compare-inner" ref={barsRef} onMouseLeave={() => setTooltip(null)}>
          {/* Grid lines */}
          <div className="perf-compare-grid">
            {axisSets.full.map((_, i) => (
              <div key={i} className="perf-compare-gridline" />
            ))}
          </div>

          {/* Bar rows */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {data.map((metric) => (
              <div key={metric.label} className="perf-compare-row">
                <div className="perf-compare-row-label">{metric.label}</div>
                <div className="perf-compare-bars">
                  {isSingle ? (
                    <div
                      className="perf-compare-bar-track"
                      style={{ height: 16, borderRadius: 4 }}
                      onMouseMove={(e) => handleHover(e, metric, "single")}
                    >
                      <div
                        className="perf-compare-bar-fill"
                        style={{
                          width: `${(metric.value / max) * 100}%`,
                          height: 16,
                          borderRadius: 4,
                          background: barColor,
                          opacity: tooltip && tooltip.label !== metric.label ? 0.4 : 1,
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className="perf-compare-bar-track"
                        onMouseMove={(e) => handleHover(e, metric, "user")}
                      >
                        <div
                          className="perf-compare-bar-fill perf-compare-bar-fill--user"
                          style={{
                            width: `${metric.user}%`,
                            opacity: tooltip && tooltip.label !== metric.label ? 0.4 : 1,
                          }}
                        />
                      </div>
                      <div
                        className="perf-compare-bar-track"
                        onMouseMove={(e) => handleHover(e, metric, "team")}
                      >
                        <div
                          className="perf-compare-bar-fill perf-compare-bar-fill--team"
                          style={{
                            width: `${metric.team}%`,
                            opacity: tooltip && tooltip.label !== metric.label ? 0.4 : 1,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* X-axis variants */}
            <div className="perf-compare-axis perf-compare-axis--full">
              {axisSets.full.map((label) => <span key={label}>{label}</span>)}
            </div>
            <div className="perf-compare-axis perf-compare-axis--medium">
              {axisSets.medium.map((label) => <span key={label}>{label}</span>)}
            </div>
            <div className="perf-compare-axis perf-compare-axis--small">
              {axisSets.small.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div className="perf-compare-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              <div className="perf-compare-tooltip-title">{tooltip.label}</div>
              {isSingle ? (
                <div className="perf-compare-tooltip-row">
                  <span className="perf-compare-tooltip-dot" style={{ background: barColor }} />
                  <span className="perf-compare-tooltip-name">{tooltipLabel}</span>
                  <span className="perf-compare-tooltip-value">{tooltip.value}</span>
                </div>
              ) : (
                <>
                  <div className="perf-compare-tooltip-row">
                    <span className="perf-compare-tooltip-dot perf-compare-tooltip-dot--user" />
                    <span className="perf-compare-tooltip-name">{userName}</span>
                    <span className="perf-compare-tooltip-value">{tooltip.user}%</span>
                  </div>
                  <div className="perf-compare-tooltip-row">
                    <span className="perf-compare-tooltip-dot perf-compare-tooltip-dot--team" />
                    <span className="perf-compare-tooltip-name">Team average</span>
                    <span className="perf-compare-tooltip-value">{tooltip.team}%</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
