"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Tag from "../../../../components/Tag";
import FilterChip from "../../../../components/FilterChip";
import DateRangeButton from "../../../../components/DateRangeButton";
import { FiltersButton, FiltersPopover } from "../../../../components/FiltersPopover";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const channelColor = { social: "blue", email: "orange", chat: "cyan", call: "green" };

const sampleConversation = [
  { side: "customer", text: "I'd like to speak with a human agent." },
  { side: "agent", isAI: true, author: "AI Agent", text: "What would you like to do?" },
  { side: "customer", text: "I'm having an issue with my account." },
  { side: "agent", isAI: true, author: "AI Agent", text: "Thank you for your patience. Let me look into this for you." },
  { side: "customer", text: "No, thank you!" },
  { side: "agent", author: "Emma Rodriguez", text: "I understand your concern. Let me pull up your account details." },
  { side: "customer", text: "My service isn't working properly." },
  { side: "agent", author: "Emma Rodriguez", text: "I've escalated this to our specialist team. You should hear back within 24 hours." },
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
    id: "01", name: "James Mitchell", avatar: "/avatars/Avatar 01.png", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 98, violations: null, date: "14/03/2026", time: "09:14:22",
    contactName: "Priya Sharma", title: "Account Access & Verification Issue", channelTag: "social",
    description: "Customer contacted support regarding a account inquiry. They were transferred to Ahmed Mansour who handled the interaction via social. The conversation included 4 evaluated criteria points.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", reasoning: "Agent responded within the first 30 seconds of the customer initiating the chat, well within the 60-second SLA threshold. The greeting was prompt and professional." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", reasoning: "Agent acknowledged the customer's frustration and used empathetic language throughout the conversation, reflecting active listening and care." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", reasoning: "When the issue exceeded the agent's scope, escalation was initiated correctly and the customer was informed of next steps in a timely manner." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Fail", reasoning: "The agent failed to confirm that the issue was fully resolved before closing the conversation. No follow-up action was scheduled." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", reasoning: "Agent mirrored the customer's concerns and asked clarifying questions to ensure full understanding before providing a solution." },
    ],
  },
  {
    id: "02", name: "Sofia Martinez", avatar: "/avatars/Avatar 2.png", team: "Call center", channel: "Call center", channelIcon: "AnswerCall", score: 59, violations: null, date: "12/03/2026", time: "14:52:07",
    contactName: "Carlos Rivera", title: "Billing Dispute Resolution", channelTag: "social",
    description: "Customer contacted support regarding a billing discrepancy. The agent handled the interaction professionally and resolved the issue within the session.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", reasoning: "Agent picked up the call within the expected SLA window and immediately identified the customer in the system." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", reasoning: "The agent validated the customer's concern about the billing error and expressed genuine understanding before beginning resolution steps." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", reasoning: "No escalation was required; the agent resolved the billing dispute within their authority level without unnecessary transfers." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", reasoning: "The billing discrepancy was identified, corrected, and confirmed with the customer before ending the call. A confirmation email was sent." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", reasoning: "Agent listened without interrupting, reflected back the customer's concern accurately, and provided a clear resolution path." },
    ],
  },
  {
    id: "03", name: "Ahmed Mansour", avatar: "/avatars/Avatar 3.png", team: "Advanced support", channel: "Advanced support", channelIcon: "Globe", score: 98, violations: null, date: "05/03/2026", time: "11:30:45",
    contactName: "Fatima Al-Rashid", title: "Product Return & Refund Request", channelTag: "email",
    description: "Customer requested a return and refund for a defective product. The agent guided the customer through the process and confirmed the refund timeline.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", reasoning: "Email response was sent within 2 hours of receipt, meeting the advanced support SLA of 4 hours for product return requests." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", reasoning: "The agent expressed regret for the defective product experience and offered a direct apology before outlining the resolution." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", reasoning: "The return was processed at the agent's level without requiring escalation. Correct internal procedures were followed." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", reasoning: "Refund was initiated and the customer received a confirmation with the expected credit timeline of 5–7 business days." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", reasoning: "Agent demonstrated thorough understanding of the customer's situation and tailored the response to address all specific concerns raised." },
    ],
  },
  {
    id: "04", name: "Yuki Tanaka", avatar: "/avatars/Avatar 4.png", team: "Social media", channel: "Social media", channelIcon: "Globe", score: 86, violations: 1, date: "22/02/2026", time: "16:08:33", violationText: ["Agent failed to document the escalation case correctly, leaving the technical team with incomplete information.", '"Case notes were missing required fields at the point of escalation transfer."'],
    contactName: "Liam O'Connor", title: "Service Outage Complaint", channelTag: "chat",
    description: "Customer reported a service outage affecting their account. The agent acknowledged the issue and escalated to the technical team but failed to follow up within the promised timeframe.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", reasoning: "Initial response was sent within 45 minutes of the outage report, complying with the critical issue SLA of 1 hour." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", reasoning: "The agent acknowledged the business impact of the outage and communicated urgency in their language and tone appropriately." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Fail", reasoning: "Escalation was initiated but the agent failed to document the case correctly, resulting in the technical team receiving incomplete information." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", reasoning: "Although follow-up was delayed, the outage was eventually resolved and the customer received an explanation of the root cause." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", reasoning: "Agent listened attentively to all impacted areas described by the customer and communicated clearly that the issue was being escalated with priority." },
    ],
  },
  {
    id: "05", name: "Marcus Webb", avatar: "/avatars/Avatar 5.png", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 74, violations: null, date: "10/01/2026", time: "10:21:59",
    contactName: "Sarah Chen", title: "Subscription Upgrade Inquiry", channelTag: "call",
    description: "Customer called to inquire about upgrading their subscription plan. The agent provided clear information about the available options and pricing.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", reasoning: "Call was answered on the second ring and the agent was prepared with the customer's account information before the conversation began." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", reasoning: "The agent matched the customer's enthusiasm about upgrading and used positive reinforcement when discussing plan benefits." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", reasoning: "No escalation was needed. All upgrade-related questions were answered within the agent's knowledge and authority." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", reasoning: "The upgrade was completed during the call, the customer confirmed satisfaction, and a confirmation email was dispatched immediately." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", reasoning: "Agent identified the customer's primary motivation for upgrading (storage needs) and guided the conversation to the most relevant plan." },
    ],
  },
  {
    id: "06", name: "Nina Petrov", avatar: "/avatars/Avatar 6.png", team: "Chat", channel: "Chat", channelIcon: "LiveChat", score: 88, violations: null, date: "20/12/2025", time: "08:44:17",
    contactName: "David Park", title: "Password Reset Assistance", channelTag: "chat",
    description: "Customer needed help resetting their account password. The agent walked the customer through the reset process and verified the account was accessible.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Pass", reasoning: "Agent responded to the chat within 20 seconds and immediately confirmed they could assist with the password reset." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", reasoning: "The agent reassured the customer that account access would be restored quickly, reducing anxiety about the locked account." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Pass", reasoning: "The issue was resolved entirely within the chat session. No escalation was required or initiated." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", reasoning: "Password reset was completed step-by-step with the customer confirming successful login before the session was closed." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", reasoning: "Agent adapted the instructions to the customer's technical level, confirming understanding at each step before proceeding." },
    ],
  },
  {
    id: "07", name: "Omar Khalid", avatar: "/avatars/Avatar 7.png", team: "Social media", channel: "Email", channelIcon: "Email", score: 85, violations: 2, date: "15/11/2025", time: "17:03:41", violationText: ["Agent deviated from established compliance protocol during interaction.", '"Transcript segment shows non-compliant response pattern detected in two separate exchanges."'],
    contactName: "Anna Kowalski", title: "Delivery Delay Investigation", channelTag: "email",
    description: "Customer reported a delayed delivery. The agent investigated and found a logistics issue but failed to provide a resolution or compensation within the interaction.",
    criteria: [
      { criterion: "Response Time", category: "Communication", result: "Fail", reasoning: "The initial response exceeded the 4-hour SLA by 2 hours. No automated acknowledgement was sent to manage customer expectations during the delay." },
      { criterion: "Empathy Display", category: "Process", result: "Pass", reasoning: "The agent expressed understanding of the inconvenience caused by the delay and acknowledged the impact on the customer's plans." },
      { criterion: "Escalation Handling", category: "Compliance", result: "Fail", reasoning: "The logistics issue required escalation to the fulfilment team, but no escalation was created. The case was closed without resolution." },
      { criterion: "Issue Resolution", category: "Compliance", result: "Pass", reasoning: "While full resolution was not achieved in this session, the agent provided accurate status information and an estimated delivery date." },
      { criterion: "Empathy & Active Listening", category: "Behavioral", result: "Pass", reasoning: "The agent acknowledged the full scope of the issue as described by the customer and did not dismiss any of the raised concerns." },
    ],
  },
];

const criteriaDefinitions = [
  { criterion: "Greeting Protocol",    strategy: "behavioral",        strategyColor: "green",  weight: "15%",           definition: "Agent greets the customer appropriately using standard greeting words/phrases (hello, welcome, hi, good morning/evening, how can I help/assist)." },
  { criterion: "Issue Resolution",     strategy: "outcome",           strategyColor: "blue",   weight: "25%",           definition: "Agent resolves the customer's issue completely within the interaction, providing accurate and relevant solutions." },
  { criterion: "Empathy Display",      strategy: "sentiment",         strategyColor: "purple", weight: "10%",           definition: "Agent demonstrates empathy and understanding throughout the conversation, acknowledging the customer's feelings and frustrations." },
  { criterion: "Knowledge Accuracy",   strategy: "knowledge_accuracy",strategyColor: "orange", weight: "25%",           definition: "Agent's information is accurate and verified against the Knowledge Base. Violated when agent contradicts KB, fabricates details, or gives wrong information." },
  { criterion: "Compliance Check",     strategy: "override",          strategyColor: "red",    weight: "Override (100%)",definition: "Agent responded throughout the conversation and did not abandon it. If violated, ALL other criteria are ignored and the interaction score is forced to 0." },
  { criterion: "Tone Appropriateness", strategy: "sentiment",         strategyColor: "purple", weight: "15%",           definition: "Agent maintains professional, respectful language throughout. Violated when blaming, dismissive, condescending, unprofessional, sarcastic, or aggressive language is detected." },
  { criterion: "Follow-up Action",     strategy: "behavioral",        strategyColor: "green",  weight: "10%",           definition: "Agent clearly communicates next steps and follow-up actions to the customer before closing the interaction." },
];

const tabs = ["Evaluations", "Agents Report", "Teams Report", "History"];
const tabIcons = { "Evaluations": "Reports", "Agents Report": "Users", "Teams Report": "Reports" };

export default function AgentDetailContent({ slug }) {
  const [activeTab, setActiveTab] = useState("Evaluations");
  const [criteriaDefsOpen, setCriteriaDefsOpen] = useState(false);
  const [criteriaOpen, setCriteriaOpen] = useState(true);
  const [selectedEval, setSelectedEval] = useState(null);
  const [expandedReasoning, setExpandedReasoning] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("Evaluation results");
  const [resultFilter, setResultFilter] = useState(null); // null | "Pass" | "Fail"
  const [filterSelections, setFilterSelections] = useState({});
  const [dateFilter, setDateFilter] = useState(null);
  const chatBottomRef = useRef(null);

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

  const hasFilters = filterCategories.some((cat) => filterSelections[cat.key]?.value?.length > 0);

  useEffect(() => {
    if (activeModalTab === "Conversation history" && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView();
    }
  }, [activeModalTab, selectedEval]);

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
            <FiltersPopover filterSelections={filterSelections} onSelect={handleFilterSelect} onReset={handleFilterReset} filterCategories={filterCategories}>
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

        {/* Recent Evaluations */}
        <div className="sad-recent-evals">
          <div className="sad-recent-evals-header">
            <div className="sad-recent-evals-header-left">
              <span className="sad-recent-evals-title">Recent Evaluations</span>
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
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Team</span></div>
                  <div className="sa-th sad-col-flex"><span className="sa-th-label">Channel</span></div>
                  <div className="sa-th sad-col-148"><span className="sa-th-label">Score</span></div>
                  <div className="sa-th sad-col-148"><span className="sa-th-label">Violations</span></div>
                  <div className="sa-th sad-col-140"><span className="sa-th-label">Date</span></div>
                </div>

                {filteredEvaluations.map((e) => (
                  <div className="sa-row sad-row-clickable" key={e.id} onClick={() => { setSelectedEval(e); setExpandedReasoning(null); setActiveModalTab("Evaluation results"); setResultFilter(null); }}>
                    <div className="sa-cell sad-col-id">
                      <span className="sa-cell-text" style={{ color: "var(--content-tertiary)" }}>{e.id}</span>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <span className="sa-cell-text">{e.name}</span>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <span className="sa-cell-text">{e.team}</span>
                    </div>
                    <div className="sa-cell sad-col-flex">
                      <span className="sa-cell-text">{e.channel}</span>
                    </div>
                    <div className="sa-cell sad-col-148">
                      <span className="sa-cell-text" style={{ color: e.score >= 80 ? "var(--utilities-content-content-green)" : e.score >= 70 ? "var(--utilities-content-content-orange)" : "var(--utilities-content-content-red)" }}>{e.score}</span>
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
        <div className="sad-modal-overlay" onClick={() => setSelectedEval(null)}>
          <div className="sad-modal-stroke">
          <div className="sad-modal" onClick={(ev) => ev.stopPropagation()}>
            {/* Header */}
            <div className="sad-modal-header">
              <div className="sad-modal-header-left">
                <div className={`sad-modal-avatar${selectedEval.score >= 80 ? " sad-modal-avatar-green" : selectedEval.score >= 60 ? " sad-modal-avatar-orange" : " sad-modal-avatar-red"}`}>{selectedEval.score}</div>
                <div className="sad-modal-header-info">
                  <span className="sad-modal-title">{selectedEval.title}</span>
                  <div className="sad-modal-subtitle-row">
                    <span className="sad-modal-contact">{selectedEval.name}</span>
                    <Tag color="grey" label={selectedEval.channelTag} size="sm" iconLeft={false} />
                  </div>
                </div>
              </div>
              <div className="sad-modal-header-right">
                <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setSelectedEval(null)}>
                  <img src="/icons/16px/Cross.svg" width={16} height={16} alt="Close" style={iconFilter} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="sad-modal-description">
              <div className="sad-modal-details">
                <div className="sad-modal-details-header">
                  <div className="sad-modal-details-label">
                    <img src="/icons/16px/Calendar.svg" width={16} height={16} alt="" style={iconFilter} />
                    <span className="sad-modal-details-label-text">{selectedEval.date}</span>
                  </div>
                  <div className="sad-modal-details-label">
                    <img src="/icons/16px/Clock.svg" width={16} height={16} alt="" style={iconFilter} />
                    <span className="sad-modal-details-label-text">{selectedEval.time}</span>
                  </div>
                </div>
                <div className="sad-modal-details-content">
                  <p className="sad-modal-details-text">{selectedEval.description}</p>
                </div>
              </div>
            </div>

            {/* Violations card */}
            {selectedEval.violations > 0 && (
              <div className="sad-modal-violation">
                <div className="sad-modal-violation-card">
                  <div className="sad-modal-violation-header">
                    <img src="/icons/16px/Critical.svg" width={16} height={16} alt="" />
                    <span className="sad-modal-violation-title">Critical Violations</span>
                  </div>
                  <div className="sad-modal-violation-content">
                    {(selectedEval.violationText || []).map((line, i) => (
                      <p key={i} className="sad-modal-violation-text">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="sad-modal-tabs">
              <button
                className={`sad-modal-tab${activeModalTab === "Evaluation results" ? " sad-modal-tab-active" : ""}`}
                onClick={() => setActiveModalTab("Evaluation results")}
              >
                <span>Evaluation results</span>
                {activeModalTab === "Evaluation results" && <div className="sad-modal-tab-indicator" />}
              </button>
              <button
                className={`sad-modal-tab${activeModalTab === "Conversation history" ? " sad-modal-tab-active" : ""}`}
                onClick={() => setActiveModalTab("Conversation history")}
              >
                <span>Conversation history</span>
                <span className="sad-modal-tab-badge">{selectedEval.criteria.length}</span>
                {activeModalTab === "Conversation history" && <div className="sad-modal-tab-indicator" />}
              </button>
            </div>

            {/* Tab content */}
            {activeModalTab === "Evaluation results" ? (
              <div className="sad-modal-table-wrap">
                <div className="sad-modal-table-header">
                  <div className="sad-modal-th sad-modal-col-criterion"><span className="sa-th-label">Criterion</span></div>
                  <div className="sad-modal-th sad-modal-col-category"><span className="sa-th-label">Category</span></div>
                  <div className="sad-modal-th sad-modal-col-result">
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
                  <div className="sad-modal-th sad-modal-col-chevron" />
                </div>
                {selectedEval.criteria
                  .filter(c => !resultFilter || c.result === resultFilter)
                  .map((c, i) => (
                  <div key={i} className={`sad-modal-row-group${expandedReasoning === i ? " sad-modal-row-expanded" : ""}`}>
                    <div
                      className="sad-modal-row"
                      onClick={() => setExpandedReasoning((prev) => prev === i ? null : i)}
                      style={{ cursor: "pointer" }}
                    >
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
                      <div className="sad-modal-cell sad-modal-col-chevron">
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={(ev) => { ev.stopPropagation(); setExpandedReasoning((prev) => prev === i ? null : i); }}
                        >
                          <img
                            src={`/icons/16px/${expandedReasoning === i ? "ChevronTop" : "ChevronBottom"}.svg`}
                            width={16}
                            height={16}
                            alt=""
                            style={iconFilter}
                          />
                        </button>
                      </div>
                    </div>
                    {c.reasoning && expandedReasoning === i && (
                      <div className="sad-modal-reasoning-wrap">
                        <div className="sad-modal-connection-item">
                          <div className="sad-modal-connection-note">
                            <img src="/icons/16px/Info.svg" width={16} height={16} alt="" style={iconFilter} />
                            <span className="sad-modal-connection-note-text">Agent followed the expected protocol correctly.</span>
                          </div>
                          <div className="sad-modal-connection-divider" />
                          <div className="sad-modal-connection-content">
                            <div className="sad-modal-connection-author">
                              <img src={selectedEval.avatar} className="sad-modal-connection-avatar" width={16} height={16} alt="" />
                              <span className="sad-modal-connection-author-name">{selectedEval.name}</span>
                            </div>
                            <p className="sad-modal-connection-message">{c.reasoning}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="sad-modal-chat-wrap">
                {(selectedEval.conversation || sampleConversation).map((msg, i) => {
                  if (msg.side === "customer") {
                    return (
                      <div key={i} className="sad-modal-chat-row sad-modal-chat-row-customer">
                        <div className="sad-modal-chat-bubble sad-modal-chat-bubble-customer">
                          <p className="sad-modal-chat-text">{msg.text}</p>
                        </div>
                        {msg.time && <span className="sad-modal-chat-time">{msg.time}</span>}
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="sad-modal-chat-row sad-modal-chat-row-agent">
                      <div className="sad-modal-chat-bubble sad-modal-chat-bubble-agent">
                        <div className="sad-modal-chat-author">
                          <img
                            src={msg.isAI ? "/images/Revolut_Logo.png" : selectedEval.avatar}
                            className={`sad-modal-chat-avatar${msg.isAI ? "" : " sad-modal-chat-avatar-human"}`}
                            width={16}
                            height={16}
                            alt=""
                          />
                          <span className="sad-modal-chat-author-name">{msg.isAI ? msg.author : selectedEval.name}</span>
                        </div>
                        <p className="sad-modal-chat-text sad-modal-chat-text-agent">{msg.text}</p>
                      </div>
                      {msg.time && <span className="sad-modal-chat-time sad-modal-chat-time-agent">{msg.time}</span>}
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
