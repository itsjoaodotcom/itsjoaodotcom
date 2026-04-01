const metrics = [
  { label: "Follow-up action", user: 88, team: 82 },
  { label: "Knowledge accuracy", user: 85, team: 78 },
  { label: "Escalation handling", user: 72, team: 68 },
  { label: "Closing protocol", user: 95, team: 93 },
  { label: "Empathy display", user: 55, team: 90 },
  { label: "Issue resolution", user: 80, team: 75 },
];

const axisFull = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
const axisMedium = ["0%", "20%", "40%", "60%", "80%", "100%"];
const axisSmall = ["0%", "50%", "100%"];

export default function PerformanceComparison({ userName = "Priya Sharma", data = metrics }) {
  return (
    <div className="perf-compare">
      <div className="perf-compare-header">
        <div className="perf-compare-title">Performance vs Team Average</div>
        <div className="perf-compare-legend">
          <div className="perf-compare-legend-item">
            <div className="perf-compare-legend-dot perf-compare-legend-dot--user" />
            <span className="perf-compare-legend-label">{userName}</span>
          </div>
          <div className="perf-compare-legend-item">
            <div className="perf-compare-legend-dot perf-compare-legend-dot--team" />
            <span className="perf-compare-legend-label">Team average</span>
          </div>
        </div>
      </div>

      <div className="perf-compare-content">
        <div className="perf-compare-inner">
          {/* Grid lines — always 11 for consistent spacing */}
          <div className="perf-compare-grid">
            {axisFull.map((_, i) => (
              <div key={i} className="perf-compare-gridline" />
            ))}
          </div>

          {/* Bar rows */}
          <div>
            {data.map((metric) => (
              <div key={metric.label} className="perf-compare-row">
                <div className="perf-compare-row-label">{metric.label}</div>
                <div className="perf-compare-bars">
                  <div className="perf-compare-bar-track">
                    <div
                      className="perf-compare-bar-fill perf-compare-bar-fill--user"
                      style={{ width: `${metric.user}%` }}
                    />
                  </div>
                  <div className="perf-compare-bar-track">
                    <div
                      className="perf-compare-bar-fill perf-compare-bar-fill--team"
                      style={{ width: `${metric.team}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* X-axis: 3 variants, CSS shows the right one */}
            <div className="perf-compare-axis perf-compare-axis--full">
              {axisFull.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="perf-compare-axis perf-compare-axis--medium">
              {axisMedium.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="perf-compare-axis perf-compare-axis--small">
              {axisSmall.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
