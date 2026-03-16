"use client";

import { useState } from "react";
import Link from "next/link";
import Tag from "../../../../components/Tag";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const AGENTS = {
  "chat-quality-monitor": "Chat Quality Monitor",
  "call-center-qa-analyst": "Call Center QA Analyst",
  "social-media-qa-agent": "Social Media QA Agent",
  "chat-compliance-auditor": "Chat Compliance Auditor",
  "chat-escalation-reviewer": "Chat Escalation Reviewer",
  "call-scoring-analyst": "Call Scoring Analyst",
  "email-sla-monitor": "Email SLA Monitor",
  "social-engagement-auditor": "Social Engagement Auditor",
  "chat-csat-tracker": "Chat CSAT Tracker",
  "email-response-evaluator": "Email Response Evaluator",
};

const detailMetrics = [
  { icon: "Users", label: "Evaluated", value: "22", subtitle: "closed conversations" },
  { icon: "ChartBars", label: "Average Score", value: "80%", valueColor: "var(--utilities-content-content-green)", subtitle: "weighted average" },
  { icon: "Star", label: "Perfect", value: "0", subtitle: "closed conversations" },
  { icon: "LiveChat", label: "Override", value: "0", subtitle: "Abandoned" },
  { icon: "Critical", label: "Violations", value: "2", labelColor: "var(--utilities-content-content-red)", valueColor: "var(--utilities-content-content-red)", subtitle: "critical criterion failed", subtitleColor: "var(--utilities-content-content-red)", noFilter: true, danger: true },
];

const criterionRates = [
  { label: "Closing Protocol", ratio: "9/10", pct: 90, color: "var(--utilities-content-content-green)" },
  { label: "Response Time", ratio: "9/11", pct: 82, color: "var(--utilities-content-content-green)" },
  { label: "Tone & Empathy", ratio: "8/10", pct: 80, color: "var(--utilities-content-content-green)" },
  { label: "Issue Resolution", ratio: "6/10", pct: 60, color: "var(--utilities-content-content-orange)" },
  { label: "Compliance Check", ratio: "10/10", pct: 100, color: "var(--utilities-content-content-green)" },
];

const scoreDistribution = [
  { range: "81–100%", count: 9, pct: 56 },
  { range: "61–80%", count: 7, pct: 44 },
  { range: "41–60%", count: 6, pct: 31 },
  { range: "21–40%", count: 0, pct: 0 },
  { range: "1–20%", count: 0, pct: 0 },
];

const evaluations = [
  {
    id: "01", name: "James Mitchell", icon: "LiveChat", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 98, violations: null, date: "14/03/2026",
    contactName: "Priya Sharma", title: "Account Access & Verification Issue", channelTag: "social",
    description: "Customer contacted support regarding a account inquiry. They were transferred to Ahmed Mansour who handled the interaction via social. The conversation included 4 evaluated criteria points.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", reasoning: "Agent responded within the first 30 seconds of the customer initiating the chat, well within the 60-second SLA threshold. The greeting was prompt and professional." },
      { criterion: "Empathy Display", category: "Process", result: "Pass" },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass" },
      { criterion: "Issue Resolution", category: "Compliance", result: "Fail" },
      { criterion: "Empathy & Active Listening", category: "behavioral", result: "Pass" },
    ],
  },
  {
    id: "02", name: "Social media", icon: "Globe", team: "Call center", channel: "Call center", channelIcon: "AnswerCall", score: 59, violations: null, date: "14/03/2026",
    contactName: "Carlos Rivera", title: "Billing Dispute Resolution", channelTag: "social",
    description: "Customer contacted support regarding a billing discrepancy. The agent handled the interaction professionally and resolved the issue within the session.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass" },
      { criterion: "Empathy Display", category: "Process", result: "Pass" },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass" },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass" },
      { criterion: "Empathy & Active Listening", category: "behavioral", result: "Pass" },
    ],
  },
  {
    id: "03", name: "Social media", icon: "Globe", team: "Advanced support", channel: "Advanced support", channelIcon: "Globe", score: 98, violations: null, date: "14/03/2026",
    contactName: "Fatima Al-Rashid", title: "Product Return & Refund Request", channelTag: "email",
    description: "Customer requested a return and refund for a defective product. The agent guided the customer through the process and confirmed the refund timeline.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass" },
      { criterion: "Empathy Display", category: "Process", result: "Pass" },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass" },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass" },
      { criterion: "Empathy & Active Listening", category: "behavioral", result: "Pass" },
    ],
  },
  {
    id: "04", name: "Email", icon: "Email", team: "Social media", channel: "Social media", channelIcon: "Globe", score: 86, violations: 1, date: "14/03/2026",
    contactName: "Liam O'Connor", title: "Service Outage Complaint", channelTag: "chat",
    description: "Customer reported a service outage affecting their account. The agent acknowledged the issue and escalated to the technical team but failed to follow up within the promised timeframe.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass" },
      { criterion: "Empathy Display", category: "Process", result: "Pass" },
      { criterion: "Escalation Handling", category: "Compliance", result: "Fail" },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass" },
      { criterion: "Empathy & Active Listening", category: "behavioral", result: "Pass" },
    ],
  },
  {
    id: "05", name: "Call center", icon: "AnswerCall", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 74, violations: null, date: "14/03/2026",
    contactName: "Sarah Chen", title: "Subscription Upgrade Inquiry", channelTag: "call",
    description: "Customer called to inquire about upgrading their subscription plan. The agent provided clear information about the available options and pricing.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass" },
      { criterion: "Empathy Display", category: "Process", result: "Pass" },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass" },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass" },
      { criterion: "Empathy & Active Listening", category: "behavioral", result: "Pass" },
    ],
  },
  {
    id: "06", name: "Call center", icon: "AnswerCall", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 88, violations: null, date: "14/03/2026",
    contactName: "David Park", title: "Password Reset Assistance", channelTag: "chat",
    description: "Customer needed help resetting their account password. The agent walked the customer through the reset process and verified the account was accessible.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass" },
      { criterion: "Empathy Display", category: "Process", result: "Pass" },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass" },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass" },
      { criterion: "Empathy & Active Listening", category: "behavioral", result: "Pass" },
    ],
  },
  {
    id: "07", name: "Email", icon: "Email", team: "Social media", channel: "Email", channelIcon: "Email", score: 85, violations: 2, date: "14/03/2026",
    contactName: "Anna Kowalski", title: "Delivery Delay Investigation", channelTag: "email",
    description: "Customer reported a delayed delivery. The agent investigated and found a logistics issue but failed to provide a resolution or compensation within the interaction.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Fail" },
      { criterion: "Empathy Display", category: "Process", result: "Pass" },
      { criterion: "Escalation Handling", category: "Compliance", result: "Fail" },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass" },
      { criterion: "Empathy & Active Listening", category: "behavioral", result: "Pass" },
    ],
  },
];

const tabs = ["Evaluations", "Agents Report", "Teams Report", "History"];
const tabIcons = { "Evaluations": "Reports", "Agents Report": "Users", "Teams Report": "Reports" };

export default function AgentDetailContent({ slug }) {
  const [activeTab, setActiveTab] = useState("Evaluations");
  const [criteriaOpen, setCriteriaOpen] = useState(true);
  const [selectedEval, setSelectedEval] = useState(null);
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const agentName = AGENTS[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="sa-content">
      {/* Breadcrumb */}
      <div className="sa-breadcrumb">
        <Link href="/scoring-agents" className="sad-breadcrumb-link">Scoring agents</Link>
        <img src="/icons/16px/Slash.svg" width={16} height={16} alt="" style={iconFilter} />
        <span className="sad-breadcrumb-current">{agentName}</span>
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
          <button className="btn btn-secondary">
            <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" style={iconFilter} />
            <span className="btn-label">Filters</span>
          </button>
          <button className="btn btn-secondary">
            <img src="/icons/16px/Calendar.svg" width={16} height={16} alt="" style={iconFilter} />
            <span className="btn-label">Last 30 days</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="sad-scroll">
        {/* Metrics */}
        <div className="sa-metrics">
          {detailMetrics.map((m) => (
            <div className={`sa-metric-card${m.danger ? " sa-metric-danger" : ""}`} key={m.label}>
              <div className="sa-metric-header">
                <img src={`/icons/16px/${m.icon}.svg`} width={16} height={16} alt="" style={m.noFilter ? undefined : iconFilter} />
                <span className="sa-metric-label" style={m.labelColor ? { color: m.labelColor } : undefined}>{m.label}</span>
              </div>
              <div className="sa-metric-value-row">
                <span className="sa-metric-value" style={m.valueColor ? { color: m.valueColor } : undefined}>{m.value}</span>
                <span className="sad-metric-subtitle" style={m.subtitleColor ? { color: m.subtitleColor } : undefined}>{m.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="sad-charts">
          {/* Criterion Pass Rates */}
          <div className="sad-chart-card sad-chart-fixed">
            <div className="sad-chart-header">
              <div className="sad-chart-title">
                <span>Criterion Pass Rates</span>
              </div>
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

          {/* Score Distribution */}
          <div className="sad-chart-card">
            <div className="sad-chart-header">
              <div className="sad-chart-title">
                <span>Score Distribution</span>
                <img src="/icons/16px/Info.svg" width={16} height={16} alt="" style={iconFilter} />
              </div>
              <span className="sad-chart-subtitle">Conversations</span>
            </div>
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                {scoreDistribution.map((d) => (
                  <div className="sad-bar-item" key={d.range}>
                    <div className="sad-bar-label-row">
                      <span className="sad-bar-label">{d.range}</span>
                      <span className="sad-dist-count">{d.count}</span>
                    </div>
                    <div className="sad-bar-track">
                      {d.pct > 0 && <div className="sad-bar-fill sad-dist-fill" style={{ width: `${d.pct}%` }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="sad-recent-evals">
          <div className="sad-recent-evals-header">
            <span className="sad-recent-evals-title">Recent Evaluations</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setCriteriaOpen((o) => !o)}>
              <img src={`/icons/16px/${criteriaOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" style={iconFilter} />
            </button>
          </div>
          {criteriaOpen && (
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                <div className="sa-table-header">
                  <div className="sa-th sad-col-id"><span className="sa-th-label">ID</span></div>
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Agent Name</span></div>
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Team</span></div>
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Channel</span></div>
                  <div className="sa-th sad-col-148"><span className="sa-th-label">Score</span></div>
                  <div className="sa-th sad-col-148"><span className="sa-th-label">Violations</span></div>
                  <div className="sa-th sad-col-140"><span className="sa-th-label">Date</span></div>
                </div>

                {evaluations.map((e) => (
                  <div className="sa-row sad-row-clickable" key={e.id} onClick={() => { setSelectedEval(e); setExpandedReasoning({}); }}>
                    <div className="sa-cell sad-col-id">
                      <span className="sa-cell-text" style={{ color: "var(--content-tertiary)" }}>{e.id}</span>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <div className="sa-channel">
                        <img src={`/icons/16px/${e.icon}.svg`} width={16} height={16} alt="" style={iconFilter} />
                        <span className="sa-cell-text">{e.name}</span>
                      </div>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <span className="sa-cell-text">{e.team}</span>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <span className="sa-cell-text">{e.channel}</span>
                    </div>
                    <div className="sa-cell sad-col-148">
                      <span className="sa-cell-text">{e.score}</span>
                    </div>
                    <div className="sa-cell sad-col-148">
                      {e.violations ? (
                        <div className="sa-channel">
                          <img src="/icons/16px/Critical.svg" width={16} height={16} alt="" />
                          <span className="sa-cell-text" style={{ color: "var(--utilities-content-content-red)" }}>{e.violations}</span>
                        </div>
                      ) : (
                        <span className="sa-cell-text" style={{ color: "var(--content-tertiary)" }}>—</span>
                      )}
                    </div>
                    <div className="sa-cell sad-col-140">
                      <span className="sa-cell-text" style={{ color: "var(--content-tertiary)" }}>{e.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Detail Modal */}
      {selectedEval && (
        <div className="sad-modal-overlay" onClick={() => setSelectedEval(null)}>
          <div className="sad-modal" onClick={(ev) => ev.stopPropagation()}>
            {/* Header */}
            <div className="sad-modal-header">
              <div className="sad-modal-header-left">
                <div className="sad-modal-avatar">{selectedEval.score}</div>
                <div className="sad-modal-header-info">
                  <span className="sad-modal-title">{selectedEval.title}</span>
                  <div className="sad-modal-subtitle-row">
                    <span className="sad-modal-contact">{selectedEval.contactName}</span>
                    <Tag color="grey" label={selectedEval.channelTag} size="sm" />
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary sad-modal-close" onClick={() => setSelectedEval(null)}>
                <img src="/icons/16px/Cross.svg" width={16} height={16} alt="Close" style={iconFilter} />
              </button>
            </div>

            {/* Description */}
            <div className="sad-modal-description">
              <p className="sad-modal-description-text">{selectedEval.description}</p>
            </div>

            {/* Criteria Table */}
            <div className="sad-modal-table-wrap">
              <div className="sad-modal-table-header">
                <div className="sad-modal-th sad-modal-col-criterion"><span className="sa-th-label">Criterion</span></div>
                <div className="sad-modal-th sad-modal-col-category"><span className="sa-th-label">Category</span></div>
                <div className="sad-modal-th sad-modal-col-result"><span className="sa-th-label">Result</span></div>
              </div>
              {selectedEval.criteria.map((c, i) => (
                <div key={i} className={`sad-modal-row-group${c.result === "Fail" ? " sad-modal-row-fail" : ""}`}>
                  <div className="sad-modal-row">
                    <div className="sad-modal-cell sad-modal-col-criterion">
                      <span className="sa-cell-text">{c.criterion}</span>
                    </div>
                    <div className="sad-modal-cell sad-modal-col-category">
                      <Tag color="grey" label={c.category} size="sm" />
                    </div>
                    <div className="sad-modal-cell sad-modal-col-result">
                      <Tag
                        color={c.result === "Pass" ? "green" : "red"}
                        label={c.result}
                        size="sm"
                        style="filled"
                      />
                    </div>
                  </div>
                  {c.reasoning && (
                    <div className="sad-modal-reasoning-wrap">
                      <button
                        className="sad-modal-reasoning-toggle"
                        onClick={() => setExpandedReasoning((prev) => ({ ...prev, [i]: !prev[i] }))}
                      >
                        <span>Reasoning</span>
                        <img
                          src={`/icons/16px/${expandedReasoning[i] ? "ChevronBottom" : "ChevronRight"}.svg`}
                          width={12}
                          height={12}
                          alt=""
                          style={iconFilter}
                        />
                      </button>
                      {expandedReasoning[i] && (
                        <div className="sad-modal-reasoning-content">
                          <span className="sad-modal-reasoning-label">Agent</span>
                          <span className="sad-modal-reasoning-text">{c.reasoning}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="sad-modal-footer">
              <div className="sad-modal-footer-actions">
                <button className="btn btn-secondary" onClick={() => setSelectedEval(null)}>
                  <span className="btn-label">Cancel</span>
                </button>
                <button className="btn btn-accent">
                  <span className="btn-label">Save & Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
