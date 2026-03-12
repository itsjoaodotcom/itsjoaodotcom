import DashboardShell from "../../components/DashboardShell";

export const metadata = { title: "Clarity – Scoring Agents" };

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const scoringAgents = [
  { name: "Chat Quality Monitor", channel: "LiveChat", channelLabel: "Chat Support", teams: "Chat", extra: 2, score: 96, evaluations: 142, trend: 4.2, trendUp: true, status: "Active" },
  { name: "Call Center QA Analyst", channel: "Globe", channelLabel: "Social media", teams: "Call center", extra: 2, score: 94, evaluations: 128, trend: 2.8, trendUp: true, status: "Active" },
  { name: "Social Media QA Agent", channel: "Globe", channelLabel: "Social media", teams: "Advanced sup...", extra: 2, score: 91, evaluations: 98, trend: 1.5, trendUp: true, status: "Active" },
  { name: "Chat Compliance Auditor", channel: "Email", channelLabel: "Email", teams: "Social media", extra: 2, score: 89, evaluations: 86, trend: 3.1, trendUp: true, status: "Draft" },
  { name: "Chat Escalation Reviewer", channel: "AnswerCall", channelLabel: "Call center", teams: "Chat", extra: 2, score: 88, evaluations: 74, trend: 0.8, trendUp: true, status: "Active" },
  { name: "Call Scoring Analyst", channel: "Email", channelLabel: "Email", teams: "Social media", extra: 2, score: 85, evaluations: 112, trend: 1.2, trendUp: false, status: "Draft" },
  { name: "Email SLA Monitor", channel: "LiveChat", channelLabel: "Chat Support", teams: "Call center", extra: 2, score: 82, evaluations: 95, trend: 2, trendUp: true, status: "Active" },
  { name: "Social Engagement Auditor", channel: "Email", channelLabel: "Email", teams: "Advanced sup...", extra: 2, score: 77, evaluations: 64, trend: 3.5, trendUp: false, status: "Active" },
  { name: "Chat CSAT Tracker", channel: "LiveChat", channelLabel: "Chat Support", teams: "Chat", extra: 2, score: 68, evaluations: 58, trend: 5.2, trendUp: false, status: "Active" },
  { name: "Email Response Evaluator", channel: "AnswerCall", channelLabel: "Call center", teams: "Chat", extra: 2, score: 63, evaluations: 42, trend: 8.1, trendUp: false, status: "Active" },
];

function scoreColor(score) {
  if (score >= 80) return "var(--green-05)";
  if (score >= 70) return "var(--content-tertiary)";
  return "var(--red-05)";
}

function trendColor(up) {
  return up ? "var(--green-05)" : "var(--red-05)";
}

export default function AgentQAPage() {
  return (
    <DashboardShell variant="inbox">
      {/* Breadcrumb */}
      <div className="sa-breadcrumb">
        <span className="sa-breadcrumb-title">Scoring agents</span>
      </div>

      {/* Toolbar */}
      <div className="sa-toolbar">
        <div className="sa-toolbar-left">
          <img src="/icons/16px/Search.svg" width={16} height={16} alt="" style={iconFilter} />
          <span className="sa-search-placeholder">Search configured agents...</span>
        </div>
        <div className="sa-toolbar-right">
          <button className="btn btn-secondary btn-icon">
            <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" style={iconFilter} />
          </button>
          <button className="btn btn-accent btn-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add QA Agent
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th className="sa-col-name">
                <span className="sa-th-btn">Name <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" style={iconFilter} /></span>
              </th>
              <th className="sa-col-channel"><span className="sa-th-btn">Channel</span></th>
              <th className="sa-col-teams"><span className="sa-th-btn">Teams</span></th>
              <th className="sa-col-num">
                <span className="sa-th-btn">Score <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" style={iconFilter} /></span>
              </th>
              <th className="sa-col-num">
                <span className="sa-th-btn">Evaluations <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" style={iconFilter} /></span>
              </th>
              <th className="sa-col-num">
                <span className="sa-th-btn">Trend <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" style={iconFilter} /></span>
              </th>
              <th className="sa-col-status">
                <span className="sa-th-btn">Status <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" style={iconFilter} /></span>
              </th>
              <th className="sa-col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {scoringAgents.map((a) => (
              <tr key={a.name}>
                {/* Name */}
                <td className="sa-col-name">
                  <span className="sa-cell-name">{a.name}</span>
                </td>

                {/* Channel */}
                <td className="sa-col-channel">
                  <div className="sa-channel">
                    <img src={`/icons/16px/${a.channel}.svg`} width={16} height={16} alt="" style={iconFilter} />
                    <span>{a.channelLabel}</span>
                  </div>
                </td>

                {/* Teams */}
                <td className="sa-col-teams">
                  <div className="sa-teams">
                    <span>{a.teams}</span>
                    {a.extra > 0 && (
                      <span className="tag tag-sm">
                        <span className="tag-label">+{a.extra}</span>
                      </span>
                    )}
                  </div>
                </td>

                {/* Score */}
                <td className="sa-col-num">
                  <span style={{ color: scoreColor(a.score) }}>{a.score}%</span>
                </td>

                {/* Evaluations */}
                <td className="sa-col-num">
                  <span className="sa-evals">{a.evaluations}</span>
                </td>

                {/* Trend */}
                <td className="sa-col-num">
                  <div className="sa-trend" style={{ color: trendColor(a.trendUp) }}>
                    <span>{a.trend}%</span>
                    <img
                      src={`/icons/16px/${a.trendUp ? "ArrowTop" : "ArrowBottom"}.svg`}
                      width={16} height={16} alt=""
                      style={{ filter: a.trendUp
                        ? "brightness(0) saturate(100%) invert(58%) sepia(52%) saturate(405%) hue-rotate(103deg) brightness(95%) contrast(89%)"
                        : "brightness(0) saturate(100%) invert(40%) sepia(78%) saturate(1640%) hue-rotate(335deg) brightness(95%) contrast(97%)"
                      }}
                    />
                  </div>
                </td>

                {/* Status */}
                <td className="sa-col-status">
                  <span className={`tag${a.status === "Active" ? " tag-green" : ""}`}>
                    <span className="tag-dot">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect width="12" height="12" rx="6" fill="currentColor" />
                      </svg>
                    </span>
                    <span className="tag-label">{a.status}</span>
                  </span>
                </td>

                {/* Actions */}
                <td className="sa-col-actions">
                  <div className="sa-actions">
                    <button className="btn btn-ghost btn-icon">
                      <img src="/icons/16px/Edit.svg" width={16} height={16} alt="Edit" style={iconFilter} />
                    </button>
                    <button className="btn btn-ghost btn-icon">
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
