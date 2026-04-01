"use client";

import { useState, useRef } from "react";

const defaultScores = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 84 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 97 },
  { month: "Jun", score: 78 },
  { month: "Jul", score: 66 },
];

const yLabels = [100, 90, 80, 70, 60];
const yMin = 60;
const yMax = 100;
const yRange = yMax - yMin;

function buildCurvePath(scores) {
  const n = scores.length;
  const pts = scores.map((s, i) => ({
    x: (i / (n - 1)) * 1000,
    y: ((yMax - s.score) / yRange) * 1000,
  }));

  let path = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    path += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  return path;
}

export default function ScoreTimeline({ userName = "Priya Sharma", data = defaultScores }) {
  const [hovered, setHovered] = useState(null);
  const wrapRef = useRef(null);
  const linePath = buildCurvePath(data);
  const fillPath = linePath + " L1000,1000 L0,1000 Z";

  function handleDotHover(e, d, i) {
    const rect = wrapRef.current.getBoundingClientRect();
    setHovered({
      index: i,
      month: d.month,
      score: d.score,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div className="score-timeline">
      <div className="score-timeline-header">
        <div className="score-timeline-title">Score timeline</div>
        <div className="score-timeline-legend">
          <div className="score-timeline-legend-item">
            <div className="score-timeline-legend-dot" />
            <span className="score-timeline-legend-label">{userName}</span>
          </div>
        </div>
      </div>

      <div className="score-timeline-content">
        <div className="score-timeline-inner" ref={wrapRef} onMouseLeave={() => setHovered(null)}>
          {/* Y-axis */}
          <div className="score-timeline-yaxis">
            {yLabels.map((v) => <span key={v}>{v}</span>)}
          </div>

          {/* Chart body */}
          <div className="score-timeline-body">
            <div className="score-timeline-chart-area">
              {/* Grid lines */}
              <div className="score-timeline-grid">
                {yLabels.map((v) => <div key={v} className="score-timeline-gridline" />)}
              </div>

              {/* SVG curve + fill */}
              <div className="score-timeline-svg-wrap">
                <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="scoreTimelineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--charts-positive)" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="var(--charts-positive)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={fillPath} fill="url(#scoreTimelineGrad)" />
                  <path d={linePath} stroke="var(--charts-positive)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" />
                </svg>

                {/* Dots */}
                {data.map((d, i) => (
                  <div
                    key={i}
                    className={`score-timeline-dot${hovered && hovered.index === i ? " score-timeline-dot--active" : ""}`}
                    style={{
                      left: `${(i / (data.length - 1)) * 100}%`,
                      top: `${((yMax - d.score) / yRange) * 100}%`,
                    }}
                    onMouseEnter={(e) => handleDotHover(e, d, i)}
                  />
                ))}

                {/* Hover hit areas (larger invisible zones) */}
                {data.map((d, i) => (
                  <div
                    key={`hit-${i}`}
                    className="score-timeline-hit"
                    style={{
                      left: `${(i / (data.length - 1)) * 100}%`,
                      top: `${((yMax - d.score) / yRange) * 100}%`,
                    }}
                    onMouseEnter={(e) => handleDotHover(e, d, i)}
                  />
                ))}
              </div>
            </div>

            {/* X-axis */}
            <div className="score-timeline-xaxis">
              {data.map((d) => <span key={d.month}>{d.month}</span>)}
            </div>
          </div>

          {/* Tooltip */}
          {hovered && (
            <div className="score-timeline-tooltip" style={{ left: hovered.x, top: hovered.y }}>
              <div className="score-timeline-tooltip-title">{hovered.month}</div>
              <div className="score-timeline-tooltip-row">
                <span className="score-timeline-tooltip-dot" />
                <span className="score-timeline-tooltip-name">{userName}</span>
                <span className="score-timeline-tooltip-value">{hovered.score}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
