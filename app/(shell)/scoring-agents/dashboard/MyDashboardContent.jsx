"use client";

import { useState } from "react";
import DateRangeButton from "../../../../components/DateRangeButton";
import { FiltersButton } from "../../../../components/FiltersPopover";
import Tag from "../../../../components/Tag";

const iconFilter = { filter: "brightness(0) invert(0.53)" };
const greenFilter = "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(422%) hue-rotate(92deg) brightness(96%) contrast(92%)";
const redFilter = "brightness(0) saturate(100%) invert(38%) sepia(60%) saturate(850%) hue-rotate(327deg) brightness(92%) contrast(90%)";

const metricsRow1 = [
  { icon: "Star", label: "Overall QA Score", value: "96%", trend: "4.2%", trendUp: true, subtitle: "142 conversations" },
  { icon: "Critical", label: "Violations", value: "4", subtitle: "recent QA violations flagged", danger: true, noFilter: true },
  { icon: "Users", label: "CSAT", value: "4.1/5", trend: "+0.2", trendUp: true, subtitle: "vs last week" },
  { icon: "ChartBars", label: "SLA Compliance", value: "87%", trend: "3%", trendUp: true, subtitle: "vs last week" },
];

const metricsRow2 = [
  { icon: "Reports", label: "Open Tickets", value: "3", trend: "+1", trendUp: true, subtitle: "vs yesterday" },
  { icon: "Clock", label: "Avg Handling", value: "5m 18s", trend: "12s", trendUp: false, subtitle: "vs previous week" },
  { icon: "Clock", label: "First response", value: "0m 48s", trend: "6s", trendUp: false, subtitle: "active this week" },
  { icon: "CheckCircle", label: "Resolved today", value: "15", subtitle: "avg 14" },
];

const strengths = [
  { label: "Issue Resolution", pct: 95, color: "var(--utilities-content-content-green)" },
  { label: "Empathy Display", pct: 92, color: "var(--utilities-content-content-green)" },
  { label: "Knowledge Accuracy", pct: 81, color: "var(--utilities-content-content-green)" },
  { label: "Tone Appropriateness", pct: 80, color: "var(--utilities-content-content-green)" },
];

const improvements = [
  { label: "Follow-Up Action", pct: 43, color: "var(--utilities-content-content-red)" },
  { label: "Greeting Protocol", pct: 46, color: "var(--utilities-content-content-red)" },
  { label: "Response Time", pct: 49, color: "var(--utilities-content-content-red)" },
  { label: "Compliance Check", pct: 52, color: "var(--utilities-content-content-red)" },
];

const kbContent = [
  { title: "Updated Refund Policy v2.1", tag: "Policy Update", desc: "New refund windows and approval thresholds for Q1.", date: "2 days ago" },
  { title: "Escalation Procedure Changes", tag: "Process Update", desc: "Revised Tier 2 handoff requirements effective immediately.", date: "2 days ago" },
  { title: "Product Catalog — Spring Launch", tag: "Product Knowledge", desc: "12 new products added with troubleshooting guides.", date: "2 days ago" },
];

export default function MyDashboardContent() {
  const [dateFilter, setDateFilter] = useState(null);
  const [kbOpen, setKbOpen] = useState(true);

  return (
    <div className="sa-content">
      {/* Topbar — reuses sad-tabs-bar / sad-tabs-actions from AgentDetailContent */}
      <div className="sad-tabs-bar">
        <div className="sad-tabs">
          <button className="sad-tab sad-tab-active">
            <span>My dashboard</span>
            <div className="sad-tab-indicator" />
          </button>
        </div>
        <div className="sad-tabs-actions">
          <FiltersButton filterSelections={{}} onSelect={() => {}} onReset={() => {}} filterCategories={[]} />
          <DateRangeButton onChange={setDateFilter} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="sad-scroll">
        {/* Metrics row 1 — large cards, same pattern as Teams Report "Team avg score" */}
        <div className="sa-metrics">
          {metricsRow1.map((m) => (
            <div className={`sa-metric-card${m.danger ? " sa-metric-danger" : ""}`} key={m.label} style={{ flex: "1 1 0", minWidth: 240 }}>
              <div className="sa-metric-header">
                <span className="sa-metric-label" style={m.danger ? { color: "var(--utilities-content-content-red)" } : undefined}>{m.label}</span>
              </div>
              <div className="sa-metric-value-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.64px", lineHeight: "36px", color: m.danger ? "var(--utilities-content-content-red)" : "var(--content-primary)" }}>{m.value}</span>
                  {m.trend && (
                    <div style={{ display: "flex", alignItems: "center", gap: 2, paddingBottom: 4 }}>
                      <span style={{ fontSize: 14, color: m.trendUp ? "var(--utilities-content-content-green)" : "var(--utilities-content-content-red)" }}>{m.trend}</span>
                      <img src={`/icons/16px/${m.trendUp ? "ArrowTopRight" : "ArrowBottomRight"}.svg`} width={16} height={16} alt="" style={{ filter: m.trendUp ? greenFilter : redFilter }} />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 14, color: m.danger ? "var(--utilities-content-content-red)" : "var(--content-tertiary)" }}>{m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics row 2 — small cards, same pattern as Teams Report small cards */}
        <div className="sa-metrics" style={{ paddingTop: 0 }}>
          {metricsRow2.map((m) => (
            <div className="sa-metric-card" key={m.label}>
              <div className="sa-metric-header">
                <span className="sa-metric-label">{m.label}</span>
              </div>
              <div className="sa-metric-value-row" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
                  <span className="sa-metric-value">{m.value}</span>
                  {m.trend && (
                    <div style={{ display: "flex", alignItems: "center", gap: 2, paddingBottom: 1 }}>
                      <span style={{ fontSize: 12, color: m.trendUp ? "var(--utilities-content-content-green)" : "var(--utilities-content-content-red)" }}>{m.trend}</span>
                      <img src={`/icons/16px/${m.trendUp ? "ArrowTopRight" : "ArrowBottomRight"}.svg`} width={16} height={16} alt="" style={{ filter: m.trendUp ? greenFilter : redFilter }} />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "var(--content-tertiary)" }}>{m.sub || m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths + Areas of Improvement — reuses sad-bar-item pattern, colored card variant */}
        <div className="sad-charts" style={{ padding: "0 20px 20px" }}>
          {/* Strengths */}
          <div className="sad-chart-card" style={{ background: "rgba(230,247,239,0.4)", borderColor: "#e6f7ef" }}>
            <div className="sad-chart-header">
              <div className="sad-chart-title" style={{ gap: 6 }}>
                <img src="/icons/16px/CheckCircle.svg" width={16} height={16} alt="" style={{ filter: greenFilter }} />
                <span>Strengths</span>
              </div>
            </div>
            <div className="sad-chart-content-wrap">
              <div style={{ background: "var(--surface-primary, white)", border: "1px solid var(--stroke-primary)", borderRadius: 6 }}>
                {strengths.map((s) => (
                  <div className="sad-bar-item" key={s.label}>
                    <div className="sad-bar-label-row">
                      <span className="sad-bar-label">{s.label}</span>
                      <span className="sad-bar-pct" style={{ color: s.color }}>{s.pct}%</span>
                    </div>
                    <div className="sad-bar-track">
                      <div className="sad-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Areas of Improvement */}
          <div className="sad-chart-card" style={{ background: "rgba(255,230,230,0.4)", borderColor: "#ffe6e6" }}>
            <div className="sad-chart-header">
              <div className="sad-chart-title" style={{ gap: 6 }}>
                <img src="/icons/16px/CrossCircle.svg" width={16} height={16} alt="" style={{ filter: redFilter }} />
                <span>Areas of Improvement</span>
              </div>
            </div>
            <div className="sad-chart-content-wrap">
              <div style={{ background: "var(--surface-primary, white)", border: "1px solid var(--stroke-primary)", borderRadius: 6 }}>
                {improvements.map((s) => (
                  <div className="sad-bar-item" key={s.label}>
                    <div className="sad-bar-label-row">
                      <span className="sad-bar-label">{s.label}</span>
                      <span className="sad-bar-pct" style={{ color: s.color }}>{s.pct}%</span>
                    </div>
                    <div className="sad-bar-track">
                      <div className="sad-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New KB content — reuses sad-recent-evals pattern */}
        <div className="sad-recent-evals">
          <div className="sad-recent-evals-header">
            <div className="sad-recent-evals-header-left" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px 10px 12px" }}>
              <img src="/icons/16px/Documentation.svg" width={16} height={16} alt="" style={iconFilter} />
              <span className="sad-recent-evals-title">New KB content</span>
            </div>
            <div className="sad-recent-evals-header-right" style={{ padding: 10 }}>
              <Tag color="red" style="filled" label="0/6 Reviewed" iconLeft={false} size="sm" />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 2px 2px" }}>
            {kbContent.map((kb) => (
              <div key={kb.title} style={{ background: "var(--surface-primary, white)", border: "1px solid var(--stroke-primary)", borderRadius: 6, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "12px 12px 0" }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid var(--stroke-secondarystrong, rgba(0,0,0,0.08))", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--content-quartenary, rgba(0,0,0,0.4))" }}>{kb.date}</span>
                </div>
                <div style={{ padding: "8px 12px 10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 14, lineHeight: "20px", letterSpacing: "-0.28px", color: "var(--content-primary)" }}>{kb.title}</span>
                      <Tag color="grey" style="filled" label={kb.tag} iconLeft={false} size="sm" />
                    </div>
                    <span style={{ fontSize: 14, lineHeight: "20px", letterSpacing: "-0.28px", color: "var(--content-quartenary, rgba(0,0,0,0.4))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kb.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
