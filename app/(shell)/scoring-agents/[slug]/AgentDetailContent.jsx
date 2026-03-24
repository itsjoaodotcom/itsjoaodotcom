"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import Tag from "../../../../components/Tag";
import FilterChip from "../../../../components/FilterChip";
import DateRangeButton from "../../../../components/DateRangeButton";
import { FiltersButton, FiltersPopover } from "../../../../components/FiltersPopover";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const channelColor = { social: "blue", email: "orange", chat: "cyan", call: "green" };

const sampleConversation = [
  { side: "customer", text: "Hi, I'd like to speak with a human agent please.", time: "16:22" },
  { side: "agent", isAI: true, author: "AI Agent", text: "Sure! Let me transfer you now. One moment please.", time: "16:22" },
  { side: "agent", text: "Hello! I'll be assisting you today. How can I help?", time: "16:24" },
  { side: "customer", text: "I'm having an issue with my account. I can't seem to access my billing section.", time: "16:24" },
  { side: "agent", text: "I'm sorry to hear that. Let me pull up your account details right away.", time: "16:25" },
  { side: "customer", text: "Sure, let me give you my email address.", time: "16:25" },
  { side: "agent", text: "Thank you. I can see your account. It looks like there was a temporary lock on your billing section due to a recent security update. I've removed the lock now.", time: "16:26" },
  { side: "customer", text: "Oh that makes sense. Can you also check if my last payment went through?", time: "16:27" },
  { side: "agent", text: "Of course! I can confirm your payment of €49.99 on March 10th was processed successfully. You should have received a confirmation email.", time: "16:28" },
  { side: "customer", text: "Perfect, I see it now. Thank you!", time: "16:28" },
  { side: "agent", text: "You're welcome! Is there anything else I can help you with today?", time: "16:29" },
  { side: "customer", text: "Actually yes — is there a way to update my payment method?", time: "16:29" },
  { side: "agent", text: "Absolutely. You can update your payment method in Settings → Billing → Payment Methods. Would you like me to walk you through it?", time: "16:30" },
  { side: "customer", text: "No, I think I can find it. Thanks for your help!", time: "16:30" },
  { side: "agent", text: "Happy to help! If you need anything else, don't hesitate to reach out. Have a great day!", time: "16:31" },
];

/* Maps each criterion index → message indices it relates to */
const DEFAULT_CRITERION_MESSAGES = [
  [0, 1, 2],
  [4, 6],
  [6, 7, 8],
  [10, 11, 12],
  [13, 14],
];

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
  "compliance-risk-monitor": "Compliance Risk Monitor",
  "tone-empathy-auditor": "Tone & Empathy Auditor",
  "knowledge-base-validator": "Knowledge Base Validator",
};


const evaluations = [
  {
    id: "01", name: "James Mitchell", avatar: "/avatars/Avatar 01.png", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 98, violations: null, date: "14/03/2026", time: "09:14:22",
    contactName: "Priya Sharma", contactAvatar: "/avatars/Avatar 8.png", title: "Account Access & Verification Issue", channelTag: "social",
    description: "Customer contacted support regarding an account inquiry. The agent handled the interaction via social media. The conversation included 5 evaluated criteria points.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", score: 96, reasoning: "Responded within 30 seconds, well within SLA." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", score: 92, reasoning: "Used empathetic language and active listening." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", score: 88, reasoning: "Escalated correctly when issue exceeded scope." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Fail", score: 34, reasoning: "Failed to confirm resolution before closing." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", score: 95, reasoning: "Mirrored concerns and asked clarifying questions." },
    ],
  },
  {
    id: "02", name: "Sofia Martinez", avatar: "/avatars/Avatar 2.png", team: "Call Center", channel: "Calls", channelIcon: "AnswerCall", score: 59, violations: null, date: "12/03/2026", time: "14:52:07",
    contactName: "Carlos Rivera", contactAvatar: "/avatars/Avatar 9.png", title: "Billing Dispute Resolution", channelTag: "social",
    description: "Customer contacted support regarding a billing discrepancy. The agent handled the interaction professionally and resolved the issue within the session.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", score: 72, reasoning: "Picked up within SLA window." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", score: 65, reasoning: "Validated concern before starting resolution." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", score: 58, reasoning: "Resolved within authority level." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", score: 44, reasoning: "Corrected discrepancy and sent confirmation." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", score: 55, reasoning: "Listened without interrupting." },
    ],
  },
  {
    id: "03", name: "Ahmed Mansour", avatar: "/avatars/Avatar 3.png", team: "Advanced Support", channel: "Chat", channelIcon: "LiveChat", score: 98, violations: null, date: "05/03/2026", time: "11:30:45",
    contactName: "Fatima Al-Rashid", contactAvatar: "/avatars/Avatar 10.png", title: "Product Return & Refund Request", channelTag: "email",
    description: "Customer requested a return and refund for a defective product. The agent guided the customer through the process and confirmed the refund timeline.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", score: 98, reasoning: "Replied within 2 hours, under 4-hour SLA." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", score: 96, reasoning: "Apologised for the defective product." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", score: 100, reasoning: "Processed at agent level, no escalation needed." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", score: 97, reasoning: "Refund initiated with 5–7 day timeline." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", score: 99, reasoning: "Addressed all specific concerns raised." },
    ],
  },
  {
    id: "04", name: "Yuki Tanaka", avatar: "/avatars/Avatar 4.png", team: "Social Media", channel: "Social Media", channelIcon: "Globe", score: 86, violations: 1, date: "22/02/2026", time: "16:08:33", violationText: ["Agent failed to document the escalation case correctly, leaving the technical team with incomplete information.", '"Case notes were missing required fields at the point of escalation transfer."'],
    contactName: "Liam O'Connor", contactAvatar: "/avatars/Avatar 11.png", title: "Service Outage Complaint", channelTag: "chat",
    description: "Customer reported a service outage affecting their account. The agent acknowledged the issue and escalated to the technical team but failed to follow up within the promised timeframe.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", score: 90, reasoning: "Responded within 45 minutes of report." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", score: 85, reasoning: "Acknowledged business impact appropriately." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Fail", score: 42, reasoning: "Documentation incomplete at escalation." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", score: 82, reasoning: "Outage resolved, root cause explained." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", score: 91, reasoning: "Communicated priority clearly." },
    ],
  },
  {
    id: "05", name: "Marcus Webb", avatar: "/avatars/Avatar 5.png", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 74, violations: null, date: "10/01/2026", time: "10:21:59",
    contactName: "Sarah Chen", contactAvatar: "/avatars/Avatar 12.png", title: "Subscription Upgrade Inquiry", channelTag: "call",
    description: "Customer called to inquire about upgrading their subscription plan. The agent provided clear information about the available options and pricing.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", score: 78, reasoning: "Answered on second ring." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", score: 74, reasoning: "Matched customer's enthusiasm." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", score: 80, reasoning: "No escalation needed." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", score: 68, reasoning: "Upgrade completed during call." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", score: 71, reasoning: "Identified primary motivation for upgrade." },
    ],
  },
  {
    id: "06", name: "Nina Petrov", avatar: "/avatars/Avatar 6.png", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 88, violations: null, date: "20/12/2025", time: "08:44:17",
    contactName: "David Park", contactAvatar: "/avatars/Avatar 13.png", title: "Password Reset Assistance", channelTag: "chat",
    description: "Customer needed help resetting their account password. The agent walked the customer through the reset process and verified the account was accessible.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", score: 94, reasoning: "Responded within 20 seconds." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", score: 88, reasoning: "Reassured quick account restoration." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", score: 90, reasoning: "Resolved within chat session." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", score: 85, reasoning: "Password reset confirmed step-by-step." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", score: 82, reasoning: "Adapted to customer's technical level." },
    ],
  },
  {
    id: "07", name: "Omar Khalid", avatar: "/avatars/Avatar 7.png", team: "Social Media", channel: "Email", channelIcon: "Email", score: 85, violations: 2, date: "15/11/2025", time: "17:03:41", violationText: ["Agent deviated from established compliance protocol during interaction.", '"Transcript segment shows non-compliant response pattern detected in two separate exchanges."'],
    contactName: "Anna Kowalski", contactAvatar: "/avatars/Avatar 14.png", title: "Delivery Delay Investigation", channelTag: "email",
    description: "Customer reported a delayed delivery. The agent investigated and found a logistics issue but failed to provide a resolution or compensation within the interaction.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Fail", score: 28, reasoning: "Exceeded 4-hour SLA by 2 hours." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", score: 86, reasoning: "Acknowledged inconvenience caused." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Fail", score: 18, reasoning: "No escalation created, case closed prematurely." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", score: 75, reasoning: "Provided status info and estimated delivery." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", score: 82, reasoning: "Did not dismiss any raised concerns." },
    ],
  },
];

const criteriaDefinitions = [
  { criterion: "Response Time",             strategy: "behavioral",  strategyColor: "green",  weight: "20%",            definition: "Agent responds to the customer within the defined SLA window. Measured from the moment the customer initiates contact to the first agent reply." },
  { criterion: "Empathy Display",           strategy: "sentiment",   strategyColor: "purple", weight: "15%",            definition: "Agent demonstrates empathy and understanding throughout the conversation, acknowledging the customer's feelings and frustrations." },
  { criterion: "Escalation Handling",       strategy: "outcome",     strategyColor: "blue",   weight: "20%",            definition: "When an issue exceeds the agent's scope, escalation is initiated correctly with complete documentation and the customer is informed of next steps." },
  { criterion: "Issue Resolution",          strategy: "outcome",     strategyColor: "blue",   weight: "25%",            definition: "Agent resolves the customer's issue completely within the interaction, providing accurate and relevant solutions. Confirmed with the customer before closing." },
  { criterion: "Empathy & Active Listening",strategy: "sentiment",   strategyColor: "purple", weight: "20%",            definition: "Agent mirrors the customer's concerns, asks clarifying questions, and confirms understanding before providing solutions. No dismissing or interrupting." },
];

const tabs = ["Evaluations", "Agents Report", "Teams Report", "History"];
const tabIcons = { "Evaluations": "Reports", "Agents Report": "Users", "Teams Report": "Reports" };

export default function AgentDetailContent({ slug }) {
  const [activeTab, setActiveTab] = useState("Evaluations");
  const [criteriaDefsOpen, setCriteriaDefsOpen] = useState(false);
  const [criteriaOpen, setCriteriaOpen] = useState(true);
  const [selectedEval, setSelectedEval] = useState(null);
  const [selectedCriterion, setSelectedCriterion] = useState(0);
  const [resultFilter, setResultFilter] = useState(null); // null | "Pass" | "Fail"
  const [filterSelections, setFilterSelections] = useState({});
  const [dateFilter, setDateFilter] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [copiedTooltip, setCopiedTooltip] = useState(null);
  const chatBottomRef = useRef(null);
  const msgRefs = useRef([]);

  function parseDMY(str) {
    const [d, m, y] = str.split("/");
    return new Date(+y, +m - 1, +d);
  }

  const filterCategories = useMemo(() => {
    const channels = [...new Set(evaluations.map((e) => e.channel))];
    const teams = [...new Set(evaluations.map((e) => e.team))];
    return [
      { key: "channel", label: "Channel", icon: "/icons/16px/Channel.svg", items: channels },
      { key: "team",    label: "Team",    icon: "/icons/16px/Users.svg",   items: teams },
    ];
  }, []);

  function handleFilterSelect(key, value) {
    setFilterSelections((prev) => {
      const current = prev[key]?.value ?? [];
      if (value === null) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      const exists = current.includes(value);
      const next = exists ? current.filter((v) => v !== value) : [...current, value];
      if (next.length === 0) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: { value: next, op: prev[key]?.op ?? "is" } };
    });
  }

  function handleFilterReset() {
    setFilterSelections({});
  }

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((e) => {
      if (dateFilter) {
        const d = parseDMY(e.date);
        if (d < dateFilter.from || d > dateFilter.to) return false;
      }
      for (const [key, sel] of Object.entries(filterSelections)) {
        if (!sel.value?.length) continue;
        const val = key === "channel" ? e.channel : key === "team" ? e.team : null;
        if (val === null) continue;
        const match = sel.value.includes(val);
        if (sel.op === "is not" ? match : !match) return false;
      }
      return true;
    });
  }, [filterSelections, dateFilter]);

  const detailMetrics = useMemo(() => {
    const count = filteredEvaluations.length;
    const avg = count ? Math.round(filteredEvaluations.reduce((s, e) => s + e.score, 0) / count) : 0;
    const perfect = filteredEvaluations.filter((e) => e.score === 100).length;
    const violationCount = filteredEvaluations.filter((e) => e.violations > 0).length;
    const avgColor = avg >= 80 ? "var(--utilities-content-content-green)" : avg >= 60 ? "var(--utilities-content-content-orange)" : "var(--utilities-content-content-red)";
    return [
      { icon: "Users", label: "Evaluated", value: String(count), subtitle: "closed conversations" },
      { icon: "ChartBars", label: "Average Score", value: `${avg}%`, valueColor: avgColor, subtitle: "weighted average" },
      { icon: "Star", label: "Perfect", value: String(perfect), subtitle: "closed conversations" },
      { icon: "LiveChat", label: "Override", value: "0", subtitle: "abandoned conversations" },
      { icon: "Critical", label: "Violations", value: String(violationCount), labelColor: "var(--utilities-content-content-red)", valueColor: "var(--utilities-content-content-red)", subtitle: "critical criterion failed", subtitleColor: "var(--utilities-content-content-red)", noFilter: true, danger: true },
    ];
  }, [filteredEvaluations]);

  const criterionRates = useMemo(() => {
    const totals = {};
    filteredEvaluations.forEach((e) => {
      e.criteria.forEach((c) => {
        if (!totals[c.criterion]) totals[c.criterion] = { pass: 0, total: 0 };
        totals[c.criterion].total++;
        if (c.result === "Pass") totals[c.criterion].pass++;
      });
    });
    return Object.entries(totals)
      .map(([label, { pass, total }]) => {
        const pct = total ? Math.round((pass / total) * 100) : 0;
        const color = pct >= 80 ? "var(--utilities-content-content-green)" : pct >= 60 ? "var(--utilities-content-content-orange)" : "var(--utilities-content-content-red)";
        return { label, ratio: `${pass}/${total}`, pct, color };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [filteredEvaluations]);

  const scoreDistribution = useMemo(() => {
    const ranges = [
      { range: "81–100%", min: 81, max: 100, color: "green" },
      { range: "61–80%",  min: 61, max: 80,  color: "orange" },
      { range: "41–60%",  min: 41, max: 60,  color: "red" },
      { range: "21–40%",  min: 21, max: 40,  color: "red" },
      { range: "1–20%",   min: 1,  max: 20,  color: "red" },
    ];
    return ranges.map((r) => ({
      ...r,
      count: filteredEvaluations.filter((e) => e.score >= r.min && e.score <= r.max).length,
    }));
  }, [filteredEvaluations]);

  const hasFilters = filterCategories.some((cat) => filterSelections[cat.key]?.value?.length > 0);

  function handleSelectCriterion(i) {
    if (selectedCriterion === i) {
      setSelectedCriterion(null);
      return;
    }
    setSelectedCriterion(i);
    if (!chatOpen) setChatOpen(true);
    const indices = selectedEval?.criteria?.[i]?.messages || DEFAULT_CRITERION_MESSAGES[i] || [];
    const first = indices[0];
    if (first != null && msgRefs.current[first]) {
      setTimeout(() => {
        msgRefs.current[first]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, chatOpen ? 0 : 350);
    }
  }

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
          <FiltersButton filterSelections={filterSelections} onSelect={handleFilterSelect} onReset={handleFilterReset} filterCategories={filterCategories} />
          <DateRangeButton onChange={setDateFilter} />
        </div>
      </div>

      {hasFilters && (
        <div className="sa-filters-bar">
          <div className="sa-filters-bar-chips">
            {filterCategories.filter((cat) => filterSelections[cat.key]?.value?.length > 0).map((cat) => (
              <FiltersPopover
                key={cat.key}
                filterSelections={filterSelections}
                onSelect={handleFilterSelect}
                onReset={handleFilterReset}
                filterCategories={filterCategories}
              >
                <FilterChip
                  label={cat.label}
                  values={filterSelections[cat.key]?.value ?? []}
                  op={filterSelections[cat.key]?.op ?? "is"}
                  onRemove={() => handleFilterSelect(cat.key, null)}
                  onOpChange={(newOp) => setFilterSelections((prev) => ({ ...prev, [cat.key]: { ...prev[cat.key], op: newOp } }))}
                  categoryItems={cat.items}
                  onValueToggle={(v) => handleFilterSelect(cat.key, v)}
                />
              </FiltersPopover>
            ))}
            <FiltersPopover filterSelections={filterSelections} onSelect={handleFilterSelect} onReset={handleFilterReset} filterCategories={filterCategories} hideReset>
              <button className="sa-add-filter-btn">
                <img src="/icons/16px/Plus.svg" width={12} height={12} alt="" style={iconFilter} />
                <span>Add filter</span>
              </button>
            </FiltersPopover>
          </div>
          <div className="sa-filters-bar-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleFilterReset}>
              <img src="/icons/16px/Cross.svg" width={16} height={16} alt="" style={iconFilter} />
              <span className="btn-label">Clear</span>
            </button>
          </div>
        </div>
      )}

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
          <div className="sad-chart-card">
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
                {(() => {
                  const maxCount = Math.max(...scoreDistribution.map((d) => d.count), 1);
                  return scoreDistribution.map((d) => (
                    <div className="sad-bar-item" key={d.range}>
                      <div className="sad-bar-label-row">
                        <span className="sad-bar-label">{d.range}</span>
                        <span className="sad-dist-count">{d.count}</span>
                      </div>
                      <div className="sad-bar-track">
                        {d.count > 0 && <div className={`sad-bar-fill sad-dist-fill-${d.color}`} style={{ width: `${(d.count / maxCount) * 100}%` }} />}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Criteria Definitions */}
        <div className="sad-criteria-defs-section">
          <div className="sad-chart-card">
            <div className="sad-chart-header">
              <div className="sad-chart-title">
                <span>Criteria Definitions</span>
                <span className="popover-item-badge">{criteriaDefinitions.length}</span>
              </div>
              <div style={{ padding: "8px" }}>
                <button className="btn btn-ghost btn-icon" onClick={() => setCriteriaDefsOpen((o) => !o)}>
                  <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" style={iconFilter} className={`sad-chevron${criteriaDefsOpen ? " sad-chevron-open" : ""}`} />
                </button>
              </div>
            </div>
            <div className={`sad-collapse${criteriaDefsOpen ? " sad-collapse-open" : ""}`}>
              <div className="sad-collapse-inner">
              <div className="sad-criteria-defs-wrap">
                <div className="sad-criteria-defs-table">
                  <div className="sa-table-header">
                    <div className="sa-th sad-col-flex"><span className="sa-th-label">Criterion</span></div>
                    <div className="sa-th sad-col-strategy"><span className="sa-th-label">Strategy</span></div>
                    <div className="sa-th sad-col-148"><span className="sa-th-label">Weight</span></div>
                    <div className="sa-th sad-col-definition"><span className="sa-th-label">Definition</span></div>
                  </div>
                  {criteriaDefinitions.map((c) => (
                    <div className="sa-row" key={c.criterion}>
                      <div className="sa-cell sad-col-flex">
                        <span className="sa-cell-text">{c.criterion}</span>
                      </div>
                      <div className="sa-cell sad-col-strategy">
                        <Tag color={c.strategyColor} label={c.strategy} size="sm" />
                      </div>
                      <div className="sa-cell sad-col-148">
                        <span className="sa-cell-text">{c.weight}</span>
                      </div>
                      <div className="sa-cell sad-col-definition">
                        <span className="sa-cell-text sad-criteria-def-text">{c.definition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluations */}
        <div className="sad-recent-evals">
          <div className="sad-recent-evals-header">
            <div className="sad-recent-evals-header-left">
              <span className="sad-recent-evals-title">Evaluations</span>
            </div>
            <div className="sad-recent-evals-header-right">
              <button className="btn btn-ghost btn-icon" onClick={() => setCriteriaOpen((o) => !o)}>
                <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" style={iconFilter} className={`sad-chevron${criteriaOpen ? " sad-chevron-open" : ""}`} />
              </button>
            </div>
          </div>
          <div className={`sad-collapse${criteriaOpen ? " sad-collapse-open" : ""}`}>
            <div className="sad-collapse-inner">
            <div className="sad-chart-content-wrap">
              <div className="sad-chart-container">
                <div className="sa-table-header">
                  <div className="sa-th sad-col-id"><span className="sa-th-label">ID</span></div>
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Agent Name</span></div>
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Channel</span></div>
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Team</span></div>
                  <div className="sa-th sad-col-148"><span className="sa-th-label">Score</span></div>
                  <div className="sa-th sad-col-148"><span className="sa-th-label">Violations</span></div>
                  <div className="sa-th sad-col-140"><span className="sa-th-label">Date</span></div>
                </div>

                {filteredEvaluations.map((e) => (
                  <div className="sa-row sad-row-clickable" key={e.id} onClick={() => { setSelectedEval(e); setSelectedCriterion(0); setResultFilter(null); }}>
                    <div className="sa-cell sad-col-id">
                      <span className="sa-cell-text" style={{ color: "var(--content-tertiary)" }}>{e.id}</span>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <span className="sa-cell-text">{e.name}</span>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <div className="sa-channel">
                        <img src={`/icons/16px/${e.channelIcon}.svg`} width={16} height={16} alt="" style={iconFilter} />
                        <span className="sa-cell-text">{e.channel}</span>
                      </div>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <span className="sa-cell-text">{e.team}</span>
                    </div>
                    <div className="sa-cell sad-col-148">
                      <span className="sa-cell-text" style={{ color: e.score >= 80 ? "var(--utilities-content-content-green)" : e.score >= 60 ? "var(--utilities-content-content-orange)" : "var(--utilities-content-content-red)" }}>{e.score}</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Detail Modal */}
      {selectedEval && (
        <div className="sad-modal-overlay" onClick={() => { setSelectedEval(null); setSelectedCriterion(0); setResultFilter(null); }}>
          <div className={`sad-modal-stroke${!chatOpen ? " sad-modal-collapsed" : ""}`}>
          <div className="sad-modal" onClick={(ev) => ev.stopPropagation()}>
            {/* ── Left Panel ── */}
            <div className="sad-modal-left">
              {/* Top bar */}
              <div className="sad-modal-topbar">
                <div className="sad-modal-topbar-left">
                  <img src={selectedEval.contactAvatar || selectedEval.avatar} className="sad-modal-topbar-avatar" width={16} height={16} alt="" />
                  <span className="sad-modal-topbar-name">{selectedEval.contactName}</span>
                  <Tag color="grey" label={selectedEval.channelTag} size="sm" iconLeft={false} />
                </div>
                <div className="sad-modal-topbar-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); setChatOpen((v) => { if (v) setSelectedCriterion(null); return !v; }); }}>
                    <img src={`/icons/16px/${chatOpen ? "Collapse" : "LiveChat"}.svg`} width={16} height={16} alt="" style={iconFilter} />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="sad-modal-left-scroll">
                {/* Details card */}
                <div className="sad-modal-details-wrap">
                  <div className="sad-modal-details">
                    <div className="sad-modal-details-header">
                      <div className="sad-modal-details-meta">
                        <div className="sad-modal-details-label">
                          <img src="/icons/16px/Calendar.svg" width={16} height={16} alt="" style={iconFilter} />
                          <span className="sad-modal-details-label-text">{selectedEval.date}</span>
                        </div>
                        <div className="sad-modal-details-label">
                          <img src="/icons/16px/Clock.svg" width={16} height={16} alt="" style={iconFilter} />
                          <span className="sad-modal-details-label-text">{selectedEval.time}</span>
                        </div>
                      </div>
                      <span
                        className="sad-modal-details-id"
                        onClick={(e) => {
                          navigator.clipboard.writeText(`conv-${selectedEval.id}b103e2-9a70-4037-9ac0-ffcf63bc73a7`);
                          setCopiedTooltip({ x: e.clientX, y: e.clientY });
                          setTimeout(() => setCopiedTooltip(null), 1500);
                        }}
                      >
                        conv-{selectedEval.id}b103e2-9a70-4037-9ac0-ffcf63bc73a7
                      </span>
                    </div>
                    <div className="sad-modal-details-body">
                      <div className="sad-modal-details-card">
                        <div className={`sad-modal-score-avatar${selectedEval.score >= 80 ? " sad-modal-score-green" : selectedEval.score >= 60 ? " sad-modal-score-orange" : " sad-modal-score-red"}`}>
                          {selectedEval.score}
                        </div>
                        <div className="sad-modal-details-card-text">
                          <p className="sad-modal-details-title">{selectedEval.title}</p>
                          <p className="sad-modal-details-desc">{selectedEval.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evaluation section */}
                <div className="sad-modal-eval-wrap">
                  <div className="sad-modal-eval">
                    <div className="sad-modal-eval-title">
                      <span className="sad-modal-eval-title-text">Evaluation</span>
                    </div>
                    <div className="sad-modal-eval-table-wrap">
                      <div className="sad-modal-eval-table">
                        <div className="sad-modal-eval-thead">
                          <div className="sad-modal-eval-th sad-modal-eval-col-criterion"><span className="sa-th-label">Criterion</span></div>
                          <div className="sad-modal-eval-th sad-modal-eval-col-category"><span className="sa-th-label">Category</span></div>
                          <div className="sad-modal-eval-th sad-modal-eval-col-result">
                            <button
                              className={`sad-modal-th-btn${resultFilter ? " sad-modal-th-btn-active" : ""}`}
                              onClick={() => setResultFilter(f => f === null ? "Pass" : f === "Pass" ? "Fail" : null)}
                            >
                              <span className="sa-th-label">Result</span>
                              <img
                                src={`/icons/16px/${resultFilter === "Fail" ? "ArrowTop" : "ArrowBottom"}.svg`}
                                width={16} height={16} alt=""
                                style={resultFilter ? undefined : iconFilter}
                              />
                            </button>
                          </div>
                          <div className="sad-modal-eval-th sad-modal-eval-col-score"><span className="sa-th-label">Score</span></div>
                          <div className="sad-modal-eval-th sad-modal-eval-col-reasoning"><span className="sa-th-label">Reasoning</span></div>
                          <div className="sad-modal-eval-th sad-modal-eval-col-radio" />
                        </div>
                        {selectedEval.criteria
                          .filter(c => !resultFilter || c.result === resultFilter)
                          .map((c, i) => (
                          <div
                            key={i}
                            className={`sad-modal-eval-row${selectedCriterion === i ? " sad-modal-eval-row-selected" : ""}`}
                            onClick={() => handleSelectCriterion(i)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="sad-modal-eval-cell sad-modal-eval-col-criterion">
                              <span className="sa-cell-text">{c.criterion}</span>
                            </div>
                            <div className="sad-modal-eval-cell sad-modal-eval-col-category">
                              <Tag color="grey" label={c.category} size="sm" iconLeft={false} />
                            </div>
                            <div className="sad-modal-eval-cell sad-modal-eval-col-result">
                              <Tag
                                color={c.result === "Pass" ? "green" : "red"}
                                label={c.result}
                                size="sm"
                                style="filled"
                              />
                            </div>
                            <div className="sad-modal-eval-cell sad-modal-eval-col-score">
                              <span style={{ color: c.score >= 80 ? "var(--utilities-content-content-green, #47ad7a)" : c.score >= 60 ? "var(--utilities-content-content-orange, #d17f3a)" : "var(--utilities-content-content-red, #d14c4d)" }}>{c.score}</span>
                            </div>
                            <div className="sad-modal-eval-cell sad-modal-eval-col-reasoning">
                              <span className="sa-cell-text">{c.reasoning}</span>
                            </div>
                            <div className="sad-modal-eval-cell sad-modal-eval-col-radio">
                              <div className={`sad-modal-radio${selectedCriterion === i ? " sad-modal-radio-on" : ""}`}>
                                {selectedCriterion === i && <div className="sad-modal-radio-dot" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Panel: Conversation ── */}
            <div className={`sad-modal-right${!chatOpen ? " sad-modal-right-collapsed" : ""}`}>
              <div className="sad-modal-right-inner">
              <div className="sad-modal-topbar">
                <div className="sad-modal-topbar-left">
                  <span className="sad-modal-topbar-name">Conversation</span>
                </div>
                <div className="sad-modal-topbar-actions">
                  <button className="btn btn-secondary btn-icon btn-sm" onClick={() => { setSelectedEval(null); setSelectedCriterion(0); setResultFilter(null); }}>
                    <img src="/icons/16px/Cross.svg" width={16} height={16} alt="" style={iconFilter} />
                  </button>
                </div>
              </div>
              <div className="sad-modal-chat-wrap">
                {(() => {
                  const hasSelection = selectedCriterion != null;
                  const selectedResult = hasSelection ? selectedEval.criteria[selectedCriterion]?.result : null;
                  const highlightedIndices = hasSelection
                    ? (selectedEval.criteria[selectedCriterion]?.messages || DEFAULT_CRITERION_MESSAGES[selectedCriterion] || [])
                    : [];
                  return (selectedEval.conversation || sampleConversation).map((msg, i) => {
                    const highlighted = !hasSelection || highlightedIndices.includes(i);
                    const sideClass = msg.side === "customer" ? "sad-modal-chat-msg-customer" : "sad-modal-chat-msg-agent";
                    const highlightClass = highlighted && hasSelection ? (selectedResult === "Fail" ? "sad-modal-chat-msg-highlighted-fail" : "sad-modal-chat-msg-highlighted") : "";
                    const fadeClass = !hasSelection ? "" : (highlighted ? highlightClass : "sad-modal-chat-msg-faded");
                    if (msg.side === "customer") {
                      return (
                        <div key={i} ref={el => msgRefs.current[i] = el} className={`sad-modal-chat-msg ${sideClass} ${fadeClass}`}>
                          <div className="sad-modal-chat-bubble sad-modal-chat-bubble-customer">
                            <p className="sad-modal-chat-text">{msg.text}</p>
                          </div>
                          <div className="sad-modal-chat-status">
                            {msg.time && <span className="sad-modal-chat-time">{msg.time}</span>}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={i} ref={el => msgRefs.current[i] = el} className={`sad-modal-chat-msg ${sideClass} ${fadeClass}`}>
                        <div className="sad-modal-chat-bubble sad-modal-chat-bubble-agent">
                          <div className="sad-modal-chat-author">
                            <img
                              src={msg.isAI ? "/images/Revolut_Logo.png" : selectedEval.avatar}
                              className={`sad-modal-chat-avatar${msg.isAI ? "" : " sad-modal-chat-avatar-human"}`}
                              width={16} height={16} alt=""
                            />
                            <span className="sad-modal-chat-author-name">{msg.isAI ? msg.author : selectedEval.name}</span>
                          </div>
                          <p className="sad-modal-chat-text sad-modal-chat-text-agent">{msg.text}</p>
                        </div>
                        <div className="sad-modal-chat-status sad-modal-chat-status-agent">
                          {msg.time && <span className="sad-modal-chat-time">{msg.time}</span>}
                        </div>
                      </div>
                    );
                  });
                })()}
                <div ref={chatBottomRef} />
              </div>
              </div>
            </div>
            {copiedTooltip && <span className="sad-modal-tooltip" style={{ left: copiedTooltip.x, top: copiedTooltip.y + 10 }}>Copied</span>}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
