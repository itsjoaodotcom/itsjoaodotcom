"use client";

import { useRef, useEffect, useState } from "react";

const navLinks = [
  { icon: "ChartCircle", label: "View all", active: true },
  { icon: "Light", label: "Discover" },
  { icon: "LiveChat", label: "Feed" },
  { icon: "Anomalie", label: "Anomalies" },
  { icon: "Bugs", label: "Bugs" },
  { icon: "Reports", label: "Reports" },
  { icon: "Workflows", label: "Worflows" },
];

const insights = [
  { label: "Bugs", badge: "blue", value: 174 },
  { label: "Feature requests", badge: "orange", value: 352 },
  { label: "Churn", badge: "blue", value: 282 },
  { label: "Fraud", badge: "orange", value: 573 },
  { label: "Legal", badge: "blue", value: 138 },
];

const topicCards = [
  [
    {
      title: "Top 10 most severe bugs",
      items: [
        "Game crashes on opening frequently",
        "Major connection issues during gameplay",
        "Unbalanced matchmaking against higher-level players",
        "Bugs with new card abilities causing freezes",
        "Audio desync after extended play sessions",
        "UI elements overlapping on smaller screens",
        "Progress lost after unexpected app closure",
        "Clan war results not updating properly",
        "Emotes and animations cause frame drops",
        "Tutorial skipping leads to broken quests",
      ],
    },
    {
      title: "Top 10 payment issues",
      items: [
        "Game heavily favors paying players",
        "Unbalanced cards create unfair competition",
        "New cards are overpowered for purchases",
        "Progression requires significant monetary investment",
        "Refund process is slow and unclear",
        "In-app purchases not delivered after payment",
        "Subscription auto-renewal without warning",
        "Price differences across regions feel unfair",
        "Gems disappear without purchase confirmation",
        "Bundle pricing misleading compared to individual items",
      ],
    },
  ],
  [
    {
      title: "What do customers want to improve?",
      items: [
        "Reduce pay-to-win mechanics in gameplay",
        "Improve matchmaking fairness and balance",
        "Address hero card strength disparities",
        "Reintroduce season shop features",
        "Better reward distribution for free players",
        "More frequent balance patches and updates",
        "Add tournament mode for competitive play",
        "Improve clan management tools",
        "Reduce loading times between matches",
        "Allow card trading between clan members",
      ],
    },
    {
      title: "Top 10 churn reasons",
      items: [
        "Unbalanced matchmaking leads to frustration",
        "Game heavily favors pay-to-win players",
        "Toxic community behavior discourages play",
        "Heroes and high-level cards dominate matches",
        "Lack of new content keeps game stale",
        "Frequent crashes erode player trust",
        "Rewards feel insignificant at higher levels",
        "Cheating and bot accounts ruin experience",
        "Season pass value has declined over time",
        "No meaningful endgame for maxed players",
      ],
    },
  ],
  [
    {
      title: "Most interesting customer complaints",
      items: [
        "Game feels pay-to-win and unbalanced",
        "Matchmaking favors higher-level opponents",
        "Heroes disrupt game balance and strategy",
        "Players frustrated with elixir discrepancies",
        "Support response times too slow",
        "Repeated issues never get properly resolved",
        "Lack of transparency in drop rates",
        "Event timings unfair for different time zones",
        "Excessive ads interrupt gameplay flow",
        "Reporting system feels ineffective",
      ],
    },
    {
      title: "What do customers love?",
      items: [
        "Engaging gameplay with friends and community",
        "Strategic deck-building enhances player experience",
        "Nostalgic value for long-time players",
        "Positive social interactions within clans",
        "Regular updates keep the game fresh",
        "Quick match format fits busy schedules",
        "Clan wars bring exciting team competition",
        "Art style and animations are top quality",
        "Variety of viable deck strategies",
        "Free-to-play progression feels rewarding",
      ],
    },
  ],
];

function TopicCard({ title, items }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="qw-topic-card">
      <div className="qw-topic-header">
        <div className="qw-topic-badge blue">
          <img src="/icons/16px/Bugs.svg" width={16} height={16} alt="" />
        </div>
        <h3 className="qw-topic-title">{title}</h3>
        <a className="qw-topic-overview" href="#">
          <span>View all</span>
          <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" />
        </a>
      </div>
      <div className="qw-topic-list">
        {items.map((text, i) => (
          <a
            className={`qw-topic-item${i >= 4 ? " hidden" : ""}${i >= 4 && expanded ? " visible" : ""}`}
            href="#"
            key={i}
          >
            <span>{text}</span>
            <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" />
          </a>
        ))}
      </div>
      <div className="qw-topic-footer">
        <button
          className={`qw-topic-more${expanded ? " expanded" : ""}`}
          onClick={() => setExpanded(!expanded)}
        >
          <span>{expanded ? "Show less" : "Show more"}</span>
          <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" />
        </button>
      </div>
    </div>
  );
}

export default function QuickWinsClient() {
  const [activePeriod, setActivePeriod] = useState(0);
  const [activeChartTab, setActiveChartTab] = useState(0);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("chart.js/auto").then((mod) => {
      if (cancelled || !chartRef.current) return;
      const Chart = mod.default;
      const ctx = chartRef.current;
      const isDark = document.documentElement.classList.contains("dark");
      const lineColor = isDark ? "#7B8EC8" : "#3D4F8F";
      const tickColor = isDark ? "#87888a" : "#9CA3AF";
      const gridColor = isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB";
      const tooltipBg = isDark ? "#2c2d2e" : "#fff";
      const tooltipText = isDark ? "#cccdd0" : "#010103";
      const tooltipBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
      const surfacePrimary = isDark ? "#1d1e1f" : "#fff";
      const fontFamily = "var(--font-family), system-ui, sans-serif";

      const labels = ["2025-12-02","2025-12-04","2025-12-06","2025-12-08","2025-12-10","2025-12-12","2025-12-14","2025-12-16","2025-12-18","2025-12-20","2025-12-22","2025-12-24","2025-12-26","2025-12-28","2025-12-30"];
      const data = [830, 1050, 520, 1150, 870, 900, 420, 1150, 780, 950, 360, 740, 310, 780, 500];

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
            data,
            borderColor: lineColor,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: lineColor,
            pointHoverBorderColor: surfacePrimary,
            pointHoverBorderWidth: 2,
            fill: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: tooltipText,
              bodyColor: tooltipText,
              borderColor: tooltipBorder,
              borderWidth: 1,
              padding: { top: 8, bottom: 8, left: 12, right: 12 },
              cornerRadius: 8,
              titleFont: { family: fontFamily, size: 13, weight: "500" },
              bodyFont: { family: fontFamily, size: 13 },
              displayColors: false,
              callbacks: {
                title: (items) => items[0].label,
                label: (item) => "Volume: " + item.formattedValue,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: tickColor, font: { size: 11, family: fontFamily }, maxRotation: 45, minRotation: 45 },
              border: { display: false },
            },
            y: {
              min: 0,
              max: 1200,
              ticks: { stepSize: 300, color: tickColor, font: { size: 11, family: fontFamily } },
              grid: { color: gridColor, lineWidth: 0.5 },
              border: { display: false },
              title: { display: true, text: "Interactions volume", color: tickColor, font: { size: 11, family: fontFamily } },
            },
          },
        },
      });
    });
    return () => {
      cancelled = true;
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  const periods = ["Daily", "Weekly", "Monthly"];
  const chartTabs = ["Trend", "Distribution"];

  return (
    <div className="qw-frame">
      {/* Navbar */}
      <nav className="qw-navbar">
        <div className="qw-navbar-logo">
          <img src="/icons/ClarityLogoFull.svg" width={85} height={20} alt="Clarity" />
        </div>
        <div className="qw-navbar-links">
          {navLinks.map((link) => (
            <a className={`qw-navbar-link${link.active ? " active" : ""}`} href="#" key={link.label}>
              <img src={`/icons/16px/${link.icon}.svg`} width={16} height={16} alt="" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
        <div className="qw-navbar-search">
          <img src="/icons/16px/Search.svg" width={16} height={16} alt="" />
          <input type="text" placeholder="Search for insights" />
          <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" className="qw-navbar-search-filter" />
        </div>
        <div className="qw-navbar-user">
          <div className="qw-navbar-avatar">G</div>
          <span className="qw-navbar-username">Gameball</span>
        </div>
      </nav>

      {/* Main */}
      <main className="qw-main">
        <div className="qw-ask">
          <div className="qw-ask-bg"></div>
          <div className="qw-ask-bar">
            <div className="qw-ask-input">
              <img src="/icons/16px/Search.svg" width={20} height={20} alt="" />
              <input type="text" placeholder="Search your feedback for instant answers" />
            </div>
            <div className="qw-ask-actions">
              <button className="qw-ask-filter-btn">
                <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" />
                <span>Advanced filters</span>
              </button>
            </div>
          </div>
        </div>

        <button className="qw-date-btn">
          <img src="/icons/16px/Calendar.svg" width={16} height={16} alt="" />
          <span>Last 30 days</span>
          <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" />
        </button>

        <div className="qw-content">
          {/* Insights */}
          <section className="qw-insights">
            <h2 className="qw-heading">Your product insights</h2>
            <div className="qw-insights-row">
              {insights.map((ins) => (
                <div className="qw-insight-card" key={ins.label}>
                  <div className="qw-insight-label">{ins.label}</div>
                  <div className="qw-insight-value">
                    <div className={`qw-insight-badge ${ins.badge}`}>
                      <img src="/icons/16px/Bugs.svg" width={16} height={16} alt="" />
                    </div>
                    <span className="qw-insight-number">{ins.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Topics */}
          <section className="qw-topics">
            <h2 className="qw-heading">Trending topics</h2>
            <div className="qw-topics-grid">
              {topicCards.map((row, ri) => (
                <div className="qw-topics-row" key={ri}>
                  {row.map((card) => (
                    <TopicCard key={card.title} title={card.title} items={card.items} />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Chart */}
          <section className="qw-chart-section">
            <div className="qw-chart-header">
              <div className="qw-chart-tabs">
                {chartTabs.map((tab, i) => (
                  <button
                    className={`qw-chart-tab${activeChartTab === i ? " active" : ""}`}
                    key={tab}
                    onClick={() => setActiveChartTab(i)}
                  >
                    <span>{tab}</span>
                  </button>
                ))}
              </div>
              <div className="qw-chart-actions">
                <button className="qw-chart-action">
                  <img src="/icons/16px/Pin.svg" width={16} height={16} alt="" />
                  <span>Pin to report</span>
                </button>
                <button className="qw-chart-action icon-only">
                  <img src="/icons/16px/Grid.svg" width={16} height={16} alt="" />
                </button>
              </div>
            </div>
            <div className="qw-chart-controls">
              <div className="qw-chart-dropdowns">
                <button className="qw-chart-dropdown">
                  <span>Trend on: <strong>Tickets volume</strong></span>
                  <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" />
                </button>
                <button className="qw-chart-dropdown">
                  <span>Select breakdown</span>
                  <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" />
                </button>
              </div>
              <div className="qw-period-toggle" style={{ "--toggle-index": activePeriod }}>
                {periods.map((p, i) => (
                  <button
                    className={`qw-period-btn${activePeriod === i ? " active" : ""}`}
                    key={p}
                    onClick={() => setActivePeriod(i)}
                  >
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="qw-chart-area">
              <canvas ref={chartRef}></canvas>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
