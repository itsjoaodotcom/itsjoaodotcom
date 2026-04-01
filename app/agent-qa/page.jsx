import Link from "next/link";
import DashboardShell from "../../components/DashboardShell";

export const metadata = { title: "Clarity – Scoring Agents" };

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const scoringAgents = [
  { name: "Chat Quality Monitor", description: "Evaluates live chat interactions for tone, accuracy, and resolution", channel: "LiveChat", channelLabel: "Live Chat", teams: ["Support", "Sales"], score: 94, evaluations: 1247, trend: 3.2, trendUp: true, status: "Active" },
  { name: "Call Center QA Analyst", description: "Reviews phone call recordings against compliance standards", channel: "AnswerCall", channelLabel: "Phone", teams: ["Support"], score: 87, evaluations: 892, trend: -1.5, trendUp: false, status: "Active" },
  { name: "Email Response Scorer", description: "Scores email support responses for clarity and completeness", channel: "Email", channelLabel: "Email", teams: ["Support", "Billing"], score: 91, evaluations: 634, trend: 2.8, trendUp: true, status: "Active" },
  { name: "Escalation Handler Reviewer", description: "Assesses escalation handling procedures and outcomes", channel: "LiveChat", channelLabel: "Live Chat", teams: ["Escalation"], score: 78, evaluations: 156, trend: -4.1, trendUp: false, status: "Active" },
  { name: "Social Media Agent Scorer", description: "Monitors social media response quality and brand voice", channel: "Globe", channelLabel: "Social", teams: ["Marketing", "Support"], score: 89, evaluations: 423, trend: 5.6, trendUp: true, status: "Active" },
  { name: "Onboarding QA Agent", description: "Evaluates new customer onboarding interaction quality", channel: "LiveChat", channelLabel: "Live Chat", teams: ["Onboarding", "Success"], score: 92, evaluations: 312, trend: 1.2, trendUp: true, status: "Draft" },
  { name: "Refund Process Auditor", description: "Reviews refund request handling for policy compliance", channel: "Email", channelLabel: "Email", teams: ["Billing"], score: 85, evaluations: 278, trend: -0.8, trendUp: false, status: "Active" },
  { name: "VIP Client QA Specialist", description: "Dedicated scoring for high-value client interactions", channel: "AnswerCall", channelLabel: "Phone", teams: ["VIP", "Support"], score: 96, evaluations: 189, trend: 2.1, trendUp: true, status: "Active" },
  { name: "Technical Support Scorer", description: "Evaluates technical troubleshooting accuracy and efficiency", channel: "LiveChat", channelLabel: "Live Chat", teams: ["Technical"], score: 83, evaluations: 567, trend: -2.3, trendUp: false, status: "Draft" },
  { name: "Multilingual QA Agent", description: "Scores interactions across multiple languages for consistency", channel: "Globe", channelLabel: "Social", teams: ["International", "Support"], score: 88, evaluations: 345, trend: 4.7, trendUp: true, status: "Active" },
];

function scoreTier(score) {
  if (score >= 90) return "high";
  if (score >= 75) return "mid";
  return "low";
}

export default function AgentQAPage() {
  return (
    <DashboardShell variant="agent-qa">
      {/* Breadcrumb */}
      <div className="qa-breadcrumb">
        <span className="qa-breadcrumb-title">Scoring agents</span>
      </div>

      {/* Toolbar: search + filter + add button */}
      <div className="qa-toolbar">
        <div className="qa-toolbar-left">
          <div className="qa-search-input">
            <img src="/icons/16px/Search.svg" width={16} height={16} alt="" style={iconFilter} />
            <span className="qa-search-placeholder">Search configured agents...</span>
          </div>
          <button className="btn btn-ghost btn-icon">
            <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" style={iconFilter} />
          </button>
        </div>
        <button className="btn btn-accent">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add QA Agent
        </button>
      </div>

      {/* Agents table */}
      <div className="qa-agents-table-wrap">
        <table className="qa-table">
          <thead>
            <tr>
              <th className="col-name">Name</th>
              <th className="col-channel">Channel</th>
              <th className="col-teams">Teams</th>
              <th className="col-score">Score</th>
              <th className="col-evals">Evaluations</th>
              <th className="col-trend">Trend</th>
              <th className="col-status">Status</th>
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {scoringAgents.map((agent) => (
              <tr key={agent.name}>
                <td>
                  <div className="qa-name-cell">
                    <span className="qa-name-primary">{agent.name}</span>
                    <span className="qa-name-desc">{agent.description}</span>
                  </div>
                </td>
                <td>
                  <div className="qa-channel-cell">
                    <img src={`/icons/16px/${agent.channel}.svg`} width={16} height={16} alt="" style={iconFilter} />
                    <span>{agent.channelLabel}</span>
                  </div>
                </td>
                <td>
                  <div className="qa-teams-cell">
                    <span className="tag tag-neutral tag-sm">
                      <span className="tag-label">{agent.teams[0]}</span>
                    </span>
                    {agent.teams.length > 1 && (
                      <span className="tag tag-neutral tag-sm">
                        <span className="tag-label">+{agent.teams.length - 1}</span>
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`qa-score-value ${scoreTier(agent.score)}`}>{agent.score}%</span>
                </td>
                <td>
                  <span className="qa-evals-value">{agent.evaluations.toLocaleString()}</span>
                </td>
                <td>
                  <span className={`qa-trend-value ${agent.trendUp ? "up" : "down"}`}>
                    {agent.trendUp ? "↑" : "↓"} {Math.abs(agent.trend)}%
                  </span>
                </td>
                <td>
                  <span className={`tag tag-filled tag-sm ${agent.status === "Active" ? "tag-green" : "tag-neutral"}`}>
                    <span className="tag-dot"></span>
                    <span className="tag-label">{agent.status}</span>
                  </span>
                </td>
                <td>
                  <div className="qa-actions-cell">
                    <Link href="/scoring-agents/new" className="btn btn-ghost btn-icon btn-sm">
                      <img src="/icons/16px/Edit.svg" width={16} height={16} alt="Edit" style={iconFilter} />
                    </Link>
                    <button className="btn btn-ghost btn-icon btn-sm">
                      <img src="/icons/16px/Trash.svg" width={16} height={16} alt="Delete" style={iconFilter} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
