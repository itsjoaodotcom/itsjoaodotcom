import DashboardShell from "../../components/DashboardShell";

export const metadata = { title: "Clarity – Agent QA" };

export default function AgentQAPage() {
  return (
    <DashboardShell variant="agent-qa">
      <div className="qa-header">
        <h1 className="voc-page-title">Agent QA</h1>
        <div className="qa-header-actions">
          <div className="qa-date-filter">
            <img src="/icons/16px/Calendar.svg" width={16} height={16} alt="" />
            <span>Last 30 days</span>
            <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" />
          </div>
          <button className="btn btn-accent">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New review
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="voc-kpi-grid">
        <KpiCard icon="Verified" label="Avg. QA Score" badge="3.2% ↗" value="87" unit="/100" subtitle="Across 248 reviews" />
        <KpiCard icon="Emoji" label="CSAT Score" badge="1.8% ↗" value="4.6" unit="/5" subtitle="From 1,204 responses" />
        <KpiCard icon="Check" label="Compliance Rate" badge="0.5% ↘" value="94" unit="%" subtitle="Policy adherence" />
        <KpiCard icon="Clock" label="Avg. Handle Time" badge="8% ↗" value="4:32" subtitle="Minutes per conversation" />
      </div>

      {/* Dashboard row */}
      <div className="voc-dashboard-grid">
        <ScoreBreakdown />
        <AgentRanking />
      </div>

      {/* Reviews table */}
      <ReviewsTable />
    </DashboardShell>
  );
}

function KpiCard({ icon, label, badge, value, unit, subtitle }) {
  return (
    <div className="voc-kpi-card">
      <div className="voc-kpi-header">
        <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt="" />
        <span className="voc-kpi-label">{label}</span>
        <span className="voc-kpi-badge">{badge}</span>
      </div>
      <div className="voc-kpi-value">
        {value}
        {unit && <span className="qa-kpi-unit">{unit}</span>}
      </div>
      <div className="voc-kpi-subtitle">{subtitle}</div>
    </div>
  );
}

const scoreCategories = [
  { label: "Communication", value: 92 },
  { label: "Product Knowledge", value: 88 },
  { label: "Problem Resolution", value: 85 },
  { label: "Empathy & Tone", value: 90 },
  { label: "Compliance", value: 94 },
  { label: "Documentation", value: 78, warning: true },
];

function ScoreBreakdown() {
  return (
    <div className="voc-section-card">
      <div className="voc-section-header">
        <h2 className="voc-section-title">QA Score Breakdown</h2>
      </div>
      <div className="qa-score-breakdown">
        {scoreCategories.map((cat) => (
          <div className="qa-score-item" key={cat.label}>
            <div className="qa-score-item-header">
              <span className="qa-score-item-label">{cat.label}</span>
              <span className="qa-score-item-value">{cat.value}%</span>
            </div>
            <div className="qa-score-bar-track">
              <div
                className={`qa-score-bar-fill${cat.warning ? " warning" : ""}`}
                style={{ width: `${cat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const agents = [
  { rank: 1, initials: "SR", name: "Sarah Reyes", reviews: 42, score: 96, color: "#3B82F6" },
  { rank: 2, initials: "MK", name: "Michael Kim", reviews: 38, score: 93, color: "#8B5CF6" },
  { rank: 3, initials: "EJ", name: "Emily Johnson", reviews: 45, score: 91, color: "#2BC4AD" },
  { rank: 4, initials: "DP", name: "David Park", reviews: 36, score: 84, color: "#F97316" },
  { rank: 5, initials: "AL", name: "Ana Lopez", reviews: 31, score: 79, color: "#EF4444" },
];

function scoreTier(score) {
  if (score >= 90) return "high";
  if (score >= 75) return "mid";
  return "low";
}

function AgentRanking() {
  return (
    <div className="voc-section-card">
      <div className="voc-section-header">
        <h2 className="voc-section-title">Agent Ranking</h2>
        <a className="voc-section-link" href="#">View all agents</a>
      </div>
      <div className="qa-agent-ranking">
        {agents.map((a) => (
          <div className="qa-agent-row" key={a.rank}>
            <span className="qa-agent-rank">{a.rank}</span>
            <div className="qa-agent-avatar" style={{ background: a.color }}>{a.initials}</div>
            <div className="qa-agent-info">
              <span className="qa-agent-name">{a.name}</span>
              <span className="qa-agent-reviews">{a.reviews} reviews</span>
            </div>
            <div className={`qa-agent-score ${scoreTier(a.score)}`}>{a.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const reviews = [
  { id: "#4821", subject: "Payment failed on checkout", agent: "Sarah Reyes", initials: "SR", color: "#3B82F6", category: "Billing", catColor: "blue", score: 95, csat: "5.0", date: "Mar 10", status: "Passed", statusColor: "green" },
  { id: "#4819", subject: "Account locked after login", agent: "Michael Kim", initials: "MK", color: "#8B5CF6", category: "Security", catColor: "purple", score: 91, csat: "4.0", date: "Mar 10", status: "Passed", statusColor: "green" },
  { id: "#4815", subject: "Refund request for subscription", agent: "David Park", initials: "DP", color: "#F97316", category: "Refunds", catColor: "orange", score: 76, csat: "3.0", date: "Mar 9", status: "Needs Review", statusColor: "orange" },
  { id: "#4812", subject: "Can't transfer to savings", agent: "Emily Johnson", initials: "EJ", color: "#2BC4AD", category: "Transfers", catColor: "cyan", score: 89, csat: "5.0", date: "Mar 9", status: "Passed", statusColor: "green" },
  { id: "#4808", subject: "Abusive language from customer", agent: "Ana Lopez", initials: "AL", color: "#EF4444", category: "Escalation", catColor: "red", score: 62, csat: "2.0", date: "Mar 8", status: "Failed", statusColor: "red" },
  { id: "#4805", subject: "Card delivery delay inquiry", agent: "Sarah Reyes", initials: "SR", color: "#3B82F6", category: "Shipping", catColor: "green", score: 97, csat: "5.0", date: "Mar 8", status: "Passed", statusColor: "green" },
];

function ReviewsTable() {
  return (
    <div className="voc-section-card qa-reviews-card">
      <div className="voc-section-header">
        <h2 className="voc-section-title">Recent Reviews</h2>
        <div className="qa-reviews-filters">
          <button className="btn btn-secondary btn-sm">
            <img src="/icons/16px/Sort.svg" width={16} height={16} alt="" />
            Sort
          </button>
          <button className="btn btn-secondary btn-sm">
            <img src="/icons/16px/Search.svg" width={16} height={16} alt="" />
            Filter
          </button>
        </div>
      </div>
      <table className="qa-table">
        <thead>
          <tr>
            <th>Conversation</th>
            <th>Agent</th>
            <th>Category</th>
            <th>QA Score</th>
            <th>CSAT</th>
            <th>Reviewed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="qa-conversation-cell">
                  <span className="qa-conv-id">{r.id}</span>
                  <span className="qa-conv-subject">{r.subject}</span>
                </div>
              </td>
              <td>
                <div className="qa-agent-cell">
                  <div className="qa-agent-avatar-sm" style={{ background: r.color }}>{r.initials}</div>
                  <span>{r.agent}</span>
                </div>
              </td>
              <td>
                <span className={`tag tag-${r.catColor} tag-sm`}>
                  <span className="tag-dot"></span>
                  <span className="tag-label">{r.category}</span>
                </span>
              </td>
              <td><span className={`qa-score-badge ${scoreTier(r.score)}`}>{r.score}</span></td>
              <td><span className="qa-csat-stars">{r.csat}</span></td>
              <td><span className="qa-date">{r.date}</span></td>
              <td>
                <span className={`tag tag-filled tag-${r.statusColor} tag-sm`}>
                  <span className="tag-dot"></span>
                  <span className="tag-label">{r.status}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
