"use client";

import { useState } from "react";
import Tag from "../../../../components/Tag";
import DateRangeButton from "../../../../components/DateRangeButton";
import { FiltersButton } from "../../../../components/FiltersPopover";
import DonutChart from "../../../../components/DonutChart";
import PerformanceComparison from "../../../../components/PerformanceComparison";

const iconFilter = { filter: "brightness(0) invert(0.53)" };
const greenFilter = "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(422%) hue-rotate(92deg) brightness(96%) contrast(92%)";
const redFilter = "brightness(0) saturate(100%) invert(38%) sepia(60%) saturate(850%) hue-rotate(327deg) brightness(92%) contrast(90%)";

const tabs = ["Overview", "Teams", "Agents", "Alerts"];
const tabIcons = { Overview: "One part", Teams: "Users", Agents: "Reports" };

/* ── Metric data ── */
const largeMetrics = [
  { label: "Evaluations", value: "80", trend: "12%", trendUp: true, subtitle: "vs previous period" },
  { label: "Organic Score", value: "70%", trend: "3.2%", trendUp: true, subtitle: "vs previous period", valueColor: "var(--utilities-content-content-green)" },
  { label: "Compliance Rate", value: "80%", trend: "2.5%", trendUp: true, subtitle: "vs previous period", valueColor: "var(--utilities-content-content-green)" },
  { label: "Critical Alerts", value: "2", trend: "3.2%", trendUp: false, subtitle: "vs previous period", danger: true },
];

const smallMetrics = [
  { label: "FCR Rate", value: "78%", trend: "5%", trendUp: true, subtitle: "vs previous period" },
  { label: "Active Agents", value: "4", subtitle: "active this week" },
  { icon: "Clock", label: "Avg Response Time", value: "3.8m", trend: "0.4%", trendUp: false, subtitle: "vs previous period" },
  { icon: "Clock", label: "CSAT", value: "4.8/5", trend: "0.3%", trendUp: true, subtitle: "vs previous week" },
];

/* ── Performance Trend data ── */
const trendPeriods = ["1 Mar 2026 — 8 Mar 2026", "9 Mar 2026 — 16 Mar 2026", "17 Mar 2026 — 24 Mar 2026", "25 Mar 2026 — 31 Mar 2026"];
const trendLines = [
  { name: "Overall Score", color: "#4061d8", data: [55, 22, 52, 70] },
  { name: "Team Average", color: "#d17f3a", data: [40, 75, 38, 80] },
];
const trendYLabels = ["100%", "80%", "60%", "40%", "20%", "0%"];

function buildCurvePath(scores, yMin, yMax) {
  const n = scores.length;
  const range = yMax - yMin;
  const pts = scores.map((s, i) => ({
    x: (i / (n - 1)) * 1000,
    y: ((yMax - s) / range) * 1000,
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

/* ── Overview tab data ── */
const scoreBarData = [
  { label: "Social media", value: 88 },
  { label: "EMEA", value: 60 },
  { label: "VIP Support", value: 78 },
  { label: "Chat Support", value: 20 },
];

const scoreBarChannels = [
  { label: "Chat", value: 90 },
  { label: "Email", value: 65 },
  { label: "Social", value: 80 },
  { label: "Call", value: 25 },
];

/* ── Teams tab data ── */
const teamComparisonData = [
  { label: "Empathy Display", value: 74 },
  { label: "Issue Resolution", value: 98 },
  { label: "Escalation handling", value: 88 },
  { label: "Closing protocol", value: 80 },
];

const teamsTable = [
  { team: "Chat Support", icon: "LiveChat", agents: 4, avgScore: "79%", scoreColor: "var(--utilities-content-content-orange)", evals: 10, violations: 2 },
  { team: "Social media", icon: "Globe", agents: 2, avgScore: "76%", scoreColor: "var(--utilities-content-content-orange)", evals: 3, violations: 0 },
  { team: "Email", icon: "Email", agents: 3, avgScore: "68%", scoreColor: "var(--utilities-content-content-red)", evals: 5, violations: 0 },
  { team: "VIP Support", icon: "Star", agents: 2, avgScore: "92%", scoreColor: "var(--utilities-content-content-green)", evals: 4, violations: 0 },
];

/* ── Agents tab data ── */
const criterionRates = [
  { label: "Closing Protocol", ratio: "9/10", pct: 90, color: "var(--utilities-content-content-green)" },
  { label: "Response Time", ratio: "9/11", pct: 82, color: "var(--utilities-content-content-green)" },
  { label: "Empathy Display", ratio: "8/10", pct: 80, color: "var(--utilities-content-content-green)" },
  { label: "Escalation Handling", ratio: "5/7", pct: 71, color: "var(--utilities-content-content-orange)" },
  { label: "Issue Resolution", ratio: "6/10", pct: 60, color: "var(--utilities-content-content-orange)" },
];

const agentBars = [
  { name: "Sarah Al-Rashid", avatar: "/avatars/Avatar 01.png", pct: 94, color: "var(--utilities-content-content-green)" },
  { name: "Fatima Noor", avatar: "/avatars/Avatar 2.png", pct: 88, color: "var(--utilities-content-content-green)" },
  { name: "Priya Sharma", avatar: "/avatars/Avatar 3.png", pct: 83, color: "var(--utilities-content-content-green)" },
  { name: "Layla Hassan", avatar: "/avatars/Avatar 4.png", pct: 78, color: "var(--utilities-content-content-green)" },
  { name: "Emma Rodriguez", avatar: "/avatars/Avatar 5.png", pct: 64, color: "var(--utilities-content-content-orange)" },
];

const agentsTable = [
  { name: "Sarah Al-Rashid", avatar: "/avatars/Avatar 01.png", team: "Chat Support", score: "94%", scoreColor: "var(--utilities-content-content-green)", evals: 12, violations: 0 },
  { name: "Fatima Noor", avatar: "/avatars/Avatar 2.png", team: "Social media", score: "88%", scoreColor: "var(--utilities-content-content-green)", evals: 10, violations: 0 },
  { name: "Priya Sharma", avatar: "/avatars/Avatar 3.png", team: "Email", score: "83%", scoreColor: "var(--utilities-content-content-green)", evals: 8, violations: 1 },
  { name: "Layla Hassan", avatar: "/avatars/Avatar 4.png", team: "VIP Support", score: "78%", scoreColor: "var(--utilities-content-content-green)", evals: 6, violations: 0 },
  { name: "Emma Rodriguez", avatar: "/avatars/Avatar 5.png", team: "Chat Support", score: "64%", scoreColor: "var(--utilities-content-content-orange)", evals: 5, violations: 2 },
];

/* ── Alerts tab data ── */
const alertsTable = [
  { criterion: "Greeting Protocol", agent: "Emma Rodriguez", team: "Chat Support", severity: "Critical", date: "2 days ago" },
  { criterion: "Compliance Check", agent: "Layla Hassan", team: "VIP Support", severity: "Warning", date: "3 days ago" },
  { criterion: "Response Time", agent: "Fatima Noor", team: "Social media", severity: "Warning", date: "4 days ago" },
  { criterion: "Closing Protocol", agent: "Emma Rodriguez", team: "Chat Support", severity: "Critical", date: "5 days ago" },
];

export default function AnalyticsContent() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [dateFilter, setDateFilter] = useState(null);
  const [scoreTab, setScoreTab] = useState("Teams");

  return (
    <div className="sa-content">
      {/* Breadcrumb */}
      <div className="sa-breadcrumb">
        <span className="sad-breadcrumb-current">Analytics</span>
      </div>

      {/* Tabs */}
      <div className="sad-tabs-bar">
        <div className="sad-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`sad-tab${activeTab === tab ? " sad-tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabIcons[tab] && (
                <img src={`/icons/16px/${tabIcons[tab]}.svg`} width={16} height={16} alt="" style={iconFilter} />
              )}
              <span>{tab}</span>
              {activeTab === tab && <div className="sad-tab-indicator" />}
            </button>
          ))}
        </div>
        <div className="sad-tabs-actions">
          <FiltersButton filterSelections={{}} onSelect={() => {}} onReset={() => {}} filterCategories={[]} />
          <DateRangeButton onChange={setDateFilter} />
        </div>
      </div>

      {/* ═══ Overview Tab ═══ */}
      <div className="sad-scroll" style={{ display: activeTab === "Overview" ? "" : "none" }}>
        {/* Large metric cards */}
        <div className="sa-metrics">
          {largeMetrics.map((m) => (
            <div className={`sa-metric-card${m.danger ? " sa-metric-danger" : ""}`} key={m.label} style={{ flex: "1 1 0", minWidth: 240 }}>
              <div className="sa-metric-header">
                <span className="sa-metric-label" style={m.danger ? { color: "var(--utilities-content-content-red)" } : undefined}>{m.label}</span>
                {m.trend && (
                  <Tag color={m.trendUp ? "green" : "red"} style="filled" label={m.trend} iconLeft={false} size="sm"
                    icon12Left={<img src={`/icons/12px/${m.trendUp ? "ArrowTopRight" : "ArrowBottomRight"}.svg`} width={12} height={12} alt="" style={{ filter: m.trendUp ? greenFilter : redFilter }} />}
                  />
                )}
              </div>
              <div className="sa-metric-value-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.64px", lineHeight: "36px", color: m.danger ? "var(--utilities-content-content-red)" : m.valueColor || "var(--content-primary)" }}>{m.value}</span>
                </div>
                <span style={{ fontSize: 12, color: m.danger ? "var(--utilities-content-content-red)" : "var(--content-tertiary)" }}>{m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Small metric cards */}
        <div className="sa-metrics" style={{ paddingTop: 0 }}>
          {smallMetrics.map((m) => (
            <div className="sa-metric-card" key={m.label}>
              <div className="sa-metric-header">
                {m.icon && <img src={`/icons/16px/${m.icon}.svg`} width={16} height={16} alt="" style={iconFilter} />}
                <span className="sa-metric-label">{m.label}</span>
                {m.trend && (
                  <Tag color={m.trendUp ? "green" : "red"} style="filled" label={m.trend} iconLeft={false} size="sm"
                    icon12Left={<img src={`/icons/12px/${m.trendUp ? "ArrowTopRight" : "ArrowBottomRight"}.svg`} width={12} height={12} alt="" style={{ filter: m.trendUp ? greenFilter : redFilter }} />}
                  />
                )}
              </div>
              <div className="sa-metric-value-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
                  <span className="sa-metric-value">{m.value}</span>
                </div>
                <span style={{ fontSize: 12, color: "var(--content-tertiary)" }}>{m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Trend */}
        <div className="sad-charts" style={{ padding: "0 20px 20px" }}>
          <div className="sad-chart-card" style={{ minHeight: 310 }}>
            <div className="sad-chart-header">
              <div className="sad-chart-title"><span>Performance Trend</span></div>
              <div style={{ display: "flex", gap: 12, padding: "12px", alignItems: "center" }}>
                {trendLines.map((l) => (
                  <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: l.color }} />
                    <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--content-tertiary)" }}>{l.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sad-chart-content-wrap">
              <div style={{ background: "var(--surface-primary, white)", border: "1px solid var(--stroke-primary)", borderRadius: 6, display: "flex", flex: 1 }}>
                {/* Y-axis */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 0 36px 14px", fontSize: 12, color: "var(--content-tertiary)", textAlign: "right", width: 45, flexShrink: 0 }}>
                  {trendYLabels.map((v) => <span key={v}>{v}</span>)}
                </div>
                {/* Chart + X-axis */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1, position: "relative", padding: "20px 22px 12px 14px" }}>
                    {/* Grid lines */}
                    <div style={{ position: "absolute", inset: "20px 22px 12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                      {trendYLabels.map((v, i) => (
                        <div key={v} style={{ width: "100%", height: 0, borderTop: "1px dashed var(--stroke-dashed, rgba(0,0,0,0.06))" }} />
                      ))}
                    </div>
                    {/* SVG curves */}
                    <div style={{ position: "absolute", inset: "20px 22px 12px 14px" }}>
                      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                        {trendLines.map((line) => {
                          const path = buildCurvePath(line.data, 0, 100);
                          const fillPath = path + " L1000,1000 L0,1000 Z";
                          return (
                            <g key={line.name}>
                              <defs>
                                <linearGradient id={`grad-${line.name.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={line.color} stopOpacity="0.08" />
                                  <stop offset="100%" stopColor={line.color} stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path d={fillPath} fill={`url(#grad-${line.name.replace(/\s/g, "")})`} />
                              <path d={path} stroke={line.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" />
                            </g>
                          );
                        })}
                        {/* Dots */}
                        {trendLines.map((line) =>
                          line.data.map((score, i) => (
                            <circle
                              key={`${line.name}-${i}`}
                              cx={(i / (line.data.length - 1)) * 1000}
                              cy={((100 - score) / 100) * 1000}
                              r="4"
                              fill={line.color}
                              vectorEffect="non-scaling-stroke"
                            />
                          ))
                        )}
                      </svg>
                    </div>
                  </div>
                  {/* X-axis */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 14px 12px 2px", fontSize: 12, color: "var(--content-tertiary)", textAlign: "center" }}>
                    {trendPeriods.map((p) => <span key={p}>{p}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score by Teams/Channels */}
        <div className="sad-charts" style={{ padding: "0 20px 20px" }}>
          <PerformanceComparison
            title="Score"
            singleBar={{ color: "#4061d8", max: 100, step: 20, tooltipLabel: "Score" }}
            data={scoreTab === "Teams" ? scoreBarData : scoreBarChannels}
          />
        </div>
      </div>

      {/* ═══ Teams Tab ═══ */}
      <div className="sad-scroll" style={{ display: activeTab === "Teams" ? "" : "none" }}>
        {/* Large metric cards (reuse same) */}
        <div className="sa-metrics">
          {largeMetrics.map((m) => (
            <div className={`sa-metric-card${m.danger ? " sa-metric-danger" : ""}`} key={m.label} style={{ flex: "1 1 0", minWidth: 240 }}>
              <div className="sa-metric-header">
                <span className="sa-metric-label" style={m.danger ? { color: "var(--utilities-content-content-red)" } : undefined}>{m.label}</span>
              </div>
              <div className="sa-metric-value-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.64px", lineHeight: "36px", color: m.danger ? "var(--utilities-content-content-red)" : m.valueColor || "var(--content-primary)" }}>{m.value}</span>
                </div>
                <span style={{ fontSize: 12, color: m.danger ? "var(--utilities-content-content-red)" : "var(--content-tertiary)" }}>{m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Team Comparison + Donut Chart */}
        <div className="sad-charts" style={{ padding: "0 20px 20px" }}>
          <PerformanceComparison
            title="Team Comparison"
            singleBar={{ color: "var(--utilities-content-content-blue)", max: 100, step: 20, tooltipLabel: "Score" }}
            data={teamComparisonData}
          />
          <DonutChart
            title="Channel Split"
            data={[
              { label: "Chat", value: 45, color: "var(--charts-blue)" },
              { label: "Email", value: 25, color: "var(--charts-orange)" },
              { label: "Social", value: 20, color: "var(--charts-green)" },
              { label: "Call", value: 10, color: "var(--charts-purple)" },
            ]}
          />
        </div>

        {/* Teams Table */}
        <div style={{ padding: "0 20px 20px" }}>
          <div className="sad-chart-card" style={{ flex: "none" }}>
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                <div className="sa-table-header">
                  <div className="sa-th" style={{ flex: 1 }}><span className="sa-th-label">Team</span></div>
                  <div className="sa-th" style={{ width: 100 }}><span className="sa-th-label">Agents</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Avg Score</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Evaluations</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Violations</span></div>
                </div>
                {teamsTable.map((t) => (
                  <div className="sa-row" key={t.team}>
                    <div className="sa-cell" style={{ flex: 1 }}>
                      <div className="sa-channel">
                        <img src={`/icons/16px/${t.icon}.svg`} width={16} height={16} alt="" style={iconFilter} />
                        <span className="sa-cell-text">{t.team}</span>
                      </div>
                    </div>
                    <div className="sa-cell" style={{ width: 100 }}><span className="sa-cell-text">{t.agents}</span></div>
                    <div className="sa-cell" style={{ width: 120 }}><span className="sa-cell-text" style={{ color: t.scoreColor }}>{t.avgScore}</span></div>
                    <div className="sa-cell" style={{ width: 120 }}><span className="sa-cell-text">{t.evals}</span></div>
                    <div className="sa-cell" style={{ width: 120 }}>
                      <span className="sa-cell-text">{t.violations > 0 ? <><img src="/icons/16px/Critical.svg" width={16} height={16} alt="" style={{ verticalAlign: "middle", marginRight: 4 }} />{t.violations}</> : "0"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Agents Tab ═══ */}
      <div className="sad-scroll" style={{ display: activeTab === "Agents" ? "" : "none" }}>
        {/* Large metric cards */}
        <div className="sa-metrics">
          {largeMetrics.map((m) => (
            <div className={`sa-metric-card${m.danger ? " sa-metric-danger" : ""}`} key={m.label} style={{ flex: "1 1 0", minWidth: 240 }}>
              <div className="sa-metric-header">
                <span className="sa-metric-label" style={m.danger ? { color: "var(--utilities-content-content-red)" } : undefined}>{m.label}</span>
              </div>
              <div className="sa-metric-value-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.64px", lineHeight: "36px", color: m.danger ? "var(--utilities-content-content-red)" : m.valueColor || "var(--content-primary)" }}>{m.value}</span>
                </div>
                <span style={{ fontSize: 12, color: m.danger ? "var(--utilities-content-content-red)" : "var(--content-tertiary)" }}>{m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Criterion Pass Rates + Agent Performance */}
        <div className="sad-charts" style={{ padding: "0 20px 20px" }}>
          {/* Organization Criteria Performance */}
          <div className="sad-chart-card">
            <div className="sad-chart-header">
              <div className="sad-chart-title"><span>Organization Criteria Performance</span></div>
              <span className="sad-chart-subtitle">Met / Total</span>
            </div>
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                {criterionRates.map((c) => (
                  <div className="sad-bar-item" key={c.label}>
                    <div className="sad-bar-label-row">
                      <span className="sad-bar-label">{c.label}</span>
                      <span className="sad-bar-ratio">{c.ratio}</span>
                      <span className="sad-bar-pct" style={{ color: c.color }}>{c.pct}%</span>
                    </div>
                    <div className="sad-bar-track">
                      <div className="sad-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Score Distribution */}
          <div className="sad-chart-card">
            <div className="sad-chart-header">
              <div className="sad-chart-title"><span>Agent Score Distribution</span></div>
            </div>
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                {agentBars.map((a) => (
                  <div className="sad-bar-item" key={a.name}>
                    <div className="sad-bar-label-row">
                      <div className="sa-channel">
                        <img src={a.avatar} width={16} height={16} alt="" style={{ borderRadius: 999, border: "1px solid var(--stroke-primary)" }} />
                        <span className="sad-bar-label">{a.name}</span>
                      </div>
                      <span className="sad-bar-pct" style={{ color: a.color }}>{a.pct}%</span>
                    </div>
                    <div className="sad-bar-track">
                      <div className="sad-bar-fill" style={{ width: `${a.pct}%`, background: a.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agents Table */}
        <div style={{ padding: "0 20px 20px" }}>
          <div className="sad-chart-card" style={{ flex: "none" }}>
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                <div className="sa-table-header">
                  <div className="sa-th" style={{ flex: 1 }}><span className="sa-th-label">Agent</span></div>
                  <div className="sa-th" style={{ flex: 1 }}><span className="sa-th-label">Team</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Score</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Evaluations</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Violations</span></div>
                </div>
                {agentsTable.map((a) => (
                  <div className="sa-row" key={a.name}>
                    <div className="sa-cell" style={{ flex: 1 }}>
                      <div className="sa-channel">
                        <img src={a.avatar} width={16} height={16} alt="" style={{ borderRadius: 999, objectFit: "cover", border: "1px solid var(--stroke-primary)" }} />
                        <span className="sa-cell-text">{a.name}</span>
                      </div>
                    </div>
                    <div className="sa-cell" style={{ flex: 1 }}><span className="sa-cell-text">{a.team}</span></div>
                    <div className="sa-cell" style={{ width: 120 }}><span className="sa-cell-text" style={{ color: a.scoreColor }}>{a.score}</span></div>
                    <div className="sa-cell" style={{ width: 120 }}><span className="sa-cell-text">{a.evals}</span></div>
                    <div className="sa-cell" style={{ width: 120 }}>
                      <span className="sa-cell-text">{a.violations > 0 ? <><img src="/icons/16px/Critical.svg" width={16} height={16} alt="" style={{ verticalAlign: "middle", marginRight: 4 }} />{a.violations}</> : "0"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Alerts Tab ═══ */}
      <div className="sad-scroll" style={{ display: activeTab === "Alerts" ? "" : "none" }}>
        {/* Large metric cards */}
        <div className="sa-metrics">
          {largeMetrics.map((m) => (
            <div className={`sa-metric-card${m.danger ? " sa-metric-danger" : ""}`} key={m.label} style={{ flex: "1 1 0", minWidth: 240 }}>
              <div className="sa-metric-header">
                <span className="sa-metric-label" style={m.danger ? { color: "var(--utilities-content-content-red)" } : undefined}>{m.label}</span>
              </div>
              <div className="sa-metric-value-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.64px", lineHeight: "36px", color: m.danger ? "var(--utilities-content-content-red)" : m.valueColor || "var(--content-primary)" }}>{m.value}</span>
                </div>
                <span style={{ fontSize: 12, color: m.danger ? "var(--utilities-content-content-red)" : "var(--content-tertiary)" }}>{m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Violation Trend + Donut */}
        <div className="sad-charts" style={{ padding: "0 20px 20px" }}>
          <PerformanceComparison
            title="Violations by Channel"
            singleBar={{ color: "#d14c4d", max: 10, step: 2, tooltipLabel: "Violations" }}
            data={[
              { label: "Chat", value: 8 },
              { label: "Email", value: 4 },
              { label: "Social", value: 2 },
              { label: "Call", value: 1 },
            ]}
          />
          <DonutChart
            title="Severity Split"
            data={[
              { label: "Critical", value: 4, color: "var(--utilities-content-content-red)" },
              { label: "Warning", value: 8, color: "var(--utilities-content-content-orange)" },
              { label: "Info", value: 3, color: "var(--utilities-content-content-blue)" },
            ]}
          />
        </div>

        {/* Alerts Table */}
        <div style={{ padding: "0 20px 20px" }}>
          <div className="sad-chart-card" style={{ flex: "none" }}>
            <div className="sad-chart-header">
              <div className="sad-chart-title" style={{ gap: 6 }}>
                <img src="/icons/16px/Critical.svg" width={16} height={16} alt="" />
                <span>Recent Alerts</span>
              </div>
            </div>
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                <div className="sa-table-header">
                  <div className="sa-th" style={{ flex: 1 }}><span className="sa-th-label">Criterion</span></div>
                  <div className="sa-th" style={{ flex: 1 }}><span className="sa-th-label">Agent</span></div>
                  <div className="sa-th" style={{ width: 140 }}><span className="sa-th-label">Team</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Severity</span></div>
                  <div className="sa-th" style={{ width: 120 }}><span className="sa-th-label">Date</span></div>
                </div>
                {alertsTable.map((a, i) => (
                  <div className="sa-row" key={i}>
                    <div className="sa-cell" style={{ flex: 1 }}><span className="sa-cell-text">{a.criterion}</span></div>
                    <div className="sa-cell" style={{ flex: 1 }}><span className="sa-cell-text">{a.agent}</span></div>
                    <div className="sa-cell" style={{ width: 140 }}><span className="sa-cell-text">{a.team}</span></div>
                    <div className="sa-cell" style={{ width: 120 }}>
                      <Tag color={a.severity === "Critical" ? "red" : "orange"} style="filled" label={a.severity} iconLeft={false} size="sm" />
                    </div>
                    <div className="sa-cell" style={{ width: 120 }}><span className="sa-cell-text" style={{ color: "var(--content-tertiary)" }}>{a.date}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
