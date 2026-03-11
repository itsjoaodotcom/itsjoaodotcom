import DashboardShell from "../../components/DashboardShell";

export const metadata = { title: "Clarity – Overview" };

export default function OverviewPage() {
  return (
    <DashboardShell>
      <h1 className="voc-page-title">Overview</h1>

      {/* KPI cards row 1 */}
      <div className="voc-kpi-grid">
        <KpiCard icon="Magaphone" label="Share of Voice" badge="4.2% ↗" value="28.4%" subtitle="Across 4 sources" />
        <KpiCard icon="ChartBars" label="Total Volume" badge="12% ↗" value="12.8k" subtitle="Across 4 sources" />
        <KpiCard icon="Lightning" label="Engagement" badge="1.5% ↗" value="12.8k" subtitle="Avg. rate per post" />
      </div>

      {/* KPI cards row 2 */}
      <div className="voc-kpi-grid">
        <KpiCard icon="Emoji" label="Net Sentiment" badge="8% ↗" value="64" subtitle="Avg. rate per post" />
        <KpiCard icon="Globe" label="Total reach" badge="8% ↗" value="2.4M" subtitle="Potential impressions" />
        <KpiCard icon="Inbox" label="Open tickets" badge="2% ↗" value="142" subtitle="Action required" />
      </div>

      {/* Dashboard: Sentiment + Competitors */}
      <div className="voc-dashboard-grid">
        <SentimentBySource />
        <Competitors />
      </div>

      {/* Dashboard: Momentum + Verbatims */}
      <div className="voc-dashboard-grid">
        <SentimentMomentum />
        <Verbatims />
      </div>
    </DashboardShell>
  );
}

function KpiCard({ icon, label, badge, value, subtitle }) {
  return (
    <div className="voc-kpi-card">
      <div className="voc-kpi-header">
        <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt="" />
        <span className="voc-kpi-label">{label}</span>
        <span className="voc-kpi-badge">{badge}</span>
      </div>
      <div className="voc-kpi-value">{value}</div>
      <div className="voc-kpi-subtitle">{subtitle}</div>
    </div>
  );
}

const sentimentSources = [
  { icon: "Globe", label: "Social Media", count: "4,281 mentions", positive: 60, neutral: 25, negative: 15 },
  { icon: "Bookmark", label: "Reviews", count: "1,820 reviews", positive: 45, neutral: 30, negative: 25 },
  { icon: "Grid", label: "Surveys (NPS)", count: "850 responses", positive: 35, neutral: 25, negative: 40 },
];

function SentimentBySource() {
  return (
    <div className="voc-section-card">
      <div className="voc-section-header">
        <h2 className="voc-section-title">Sentiment by source</h2>
      </div>
      <div className="voc-sentiment-row">
        {sentimentSources.map((s) => (
          <div className="voc-sentiment-item" key={s.label}>
            <div className="voc-sentiment-item-header">
              <span className="voc-sentiment-item-label">
                <img src={`/icons/16px/${s.icon}.svg`} width={16} height={16} alt="" /> {s.label}
              </span>
              <span className="voc-sentiment-item-count">{s.count}</span>
            </div>
            <div className="voc-stacked-bar">
              <div className="voc-bar-positive" style={{ flex: s.positive }}></div>
              <div className="voc-bar-neutral" style={{ flex: s.neutral }}></div>
              <div className="voc-bar-negative" style={{ flex: s.negative }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="voc-sentiment-legend">
        <span className="voc-legend-dot positive">Positive</span>
        <span className="voc-legend-dot neutral">Neutral</span>
        <span className="voc-legend-dot negative">Negative</span>
      </div>
    </div>
  );
}

const competitors = [
  { logo: "R", name: "Revolut", bg: "#111118", width: "90%", pct: "12% ↗", dir: "up" },
  { logo: "N26", name: "N26", bg: "#48D4A0", width: "72%", pct: "1.5% ↘", dir: "down" },
  { logo: "7", name: "Wize", bg: "#7C3AED", width: "35%", pct: "0% –", dir: "flat" },
  { logo: "M", name: "Monzo", bg: "#F43F5E", width: "68%", pct: "8% ↗", dir: "up" },
  { logo: "A", name: "Airwallex", bg: "#F97316", width: "55%", pct: "4.2% ↗", dir: "up" },
];

function Competitors() {
  return (
    <div className="voc-section-card">
      <div className="voc-section-header">
        <h2 className="voc-section-title">Who is dominating?</h2>
        <span className="voc-section-subtitle">Share of Voice vs Sentiment</span>
      </div>
      <div className="voc-competitors">
        {competitors.map((c) => (
          <div className="voc-competitor-row" key={c.name}>
            <div className="voc-competitor-logo" style={{ background: c.bg }}>{c.logo}</div>
            <span className="voc-competitor-name">{c.name}</span>
            <div className="voc-competitor-bar-wrap">
              <div className="voc-competitor-bar" style={{ width: c.width }}></div>
            </div>
            <span className={`voc-competitor-pct ${c.dir}`}>{c.pct}</span>
          </div>
        ))}
      </div>
      <div className="voc-competitor-footer">
        <span>Bars represent Total Volume. Percentage shows Sentiment Shift.</span>
        <a className="voc-section-link" href="#">View deep dive</a>
      </div>
    </div>
  );
}

function SentimentMomentum() {
  return (
    <div className="voc-section-card">
      <div className="voc-section-header">
        <h2 className="voc-section-title">Sentiment momentum</h2>
        <div className="voc-momentum-legend">
          <span className="voc-legend-dot positive">Positivity</span>
          <span className="voc-legend-dot neutral">Baseline</span>
        </div>
      </div>
      <div className="voc-momentum-chart">
        <svg viewBox="0 0 500 180" preserveAspectRatio="none" fill="none">
          <line x1="0" y1="90" x2="500" y2="90" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
          <path
            d="M0,140 C60,130 100,100 140,80 C180,60 200,30 250,25 C300,20 320,40 350,55 C380,70 420,75 450,65 C480,55 500,70 500,70"
            stroke="#3B82F6" strokeWidth="2" fill="none"
          />
          <path
            d="M0,140 C60,130 100,100 140,80 C180,60 200,30 250,25 C300,20 320,40 350,55 C380,70 420,75 450,65 C480,55 500,70 500,70 L500,180 L0,180 Z"
            fill="#3B82F6" opacity="0.06"
          />
          <circle cx="140" cy="80" r="4" fill="#3B82F6" />
          <circle cx="250" cy="25" r="4" fill="#3B82F6" />
          <circle cx="350" cy="55" r="4" fill="#3B82F6" />
          <circle cx="450" cy="65" r="4" fill="#3B82F6" />
        </svg>
      </div>
      <div className="voc-momentum-xaxis">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
      <div className="voc-momentum-insight">
        Sentiment is shifting positively in the &lsquo;Feature Request&rsquo; category over the last 14 days.
      </div>
    </div>
  );
}

const verbatimData = [
  { icon: "𝕏", name: "Twitter", bg: "#111118", sentiment: "positive", text: "\"The new multilingual support is a game changer for our goal team. Finally, a tool that gets sentiment right across languages.\"" },
  { icon: "A", name: "App store", bg: "#3B82F6", sentiment: "negative", text: "\"The new multilingual support is a game changer for our goal team. Finally, a tool that gets sentiment right across languages.\"" },
  { icon: "📍", name: "Google Maps", bg: "#EF4444", sentiment: "positive", text: "\"The new multilingual support is a game changer for our goal team. Finally, a tool that gets sentiment right across languages.\"" },
];

function Verbatims() {
  return (
    <div className="voc-section-card">
      <div className="voc-section-header">
        <h2 className="voc-section-title">Voice of Customer Verbatims</h2>
        <a className="voc-section-link" href="#">View all 1.2k comments</a>
      </div>
      <div className="voc-verbatims">
        {verbatimData.map((v, i) => (
          <div className="voc-verbatim" key={i}>
            <div className="voc-verbatim-source">
              <div className="voc-verbatim-source-left">
                <div className="voc-verbatim-source-icon" style={{ background: v.bg }}>{v.icon}</div>
                <span className="voc-verbatim-source-name">{v.name}</span>
              </div>
              <span className={`voc-verbatim-sentiment ${v.sentiment}`}>{v.sentiment.charAt(0).toUpperCase() + v.sentiment.slice(1)}</span>
            </div>
            <p className="voc-verbatim-text">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
