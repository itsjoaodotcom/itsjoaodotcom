"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tag from "../../../components/Tag";
import Popover from "../../../components/Popover";

const FILTER_CATEGORIES = [
  {
    key: "channels",
    label: "Channels",
    items: ["All", "Call", "Chat", "Email", "Social"],
  },
  {
    key: "teams",
    label: "Teams",
    items: ["All", "Chat", "Call center", "Advanced support", "Social media"],
  },
  {
    key: "agents",
    label: "Agents",
    items: ["All", "Active", "Draft"],
  },
];

function FiltersButton({ filterSelections, onSelect, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function onMouseDown(e) {
      if (!ref.current?.contains(e.target)) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  const hasFilters = FILTER_CATEGORIES.some(
    (cat) => filterSelections[cat.key] && filterSelections[cat.key] !== "All"
  );

  const activeCat = FILTER_CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="btn btn-secondary" onClick={() => { setIsOpen((v) => !v); setActiveCategory(null); }}>
        <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" style={iconFilter} />
        <span className="btn-label">Filters</span>
      </button>
      {isOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 100 }}>
          <Popover
            content="text"
            placeholder="Find filter..."
            sections={[
              FILTER_CATEGORIES.map((cat) => ({
                label: cat.label,
                chevron: true,
                active: activeCategory === cat.key,
                badge: filterSelections[cat.key] ? 1 : null,
              })),
            ]}
            bottomActions={hasFilters}
            onItemHover={(item) => {
              const cat = FILTER_CATEGORIES.find((c) => c.label === item.label);
              if (cat) setActiveCategory(cat.key);
            }}
            onItemClick={(_, sectionIndex) => {
              if (sectionIndex === -1) { onReset(); return; }
            }}
          />
        </div>
      )}
      {isOpen && activeCat && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: "244px", zIndex: 100 }}>
          <Popover
            content="text"
            subheader={activeCat.label}
            sections={[
              activeCat.items.map((label) => ({
                label,
                radio: true,
                radioSelected: filterSelections[activeCategory] === label || (label === "All" && !filterSelections[activeCategory]),
              })),
            ]}
            bottomActions={!!filterSelections[activeCategory]}
            onItemClick={(item, sectionIndex) => {
              if (sectionIndex === -1) { onSelect(activeCategory, null); return; }
              onSelect(activeCategory, item.label === "All" ? null : item.label);
            }}
          />
        </div>
      )}
    </div>
  );
}

function PopoverAnchor({ children, popoverProps, isOpen, onToggle }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    function onMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onToggle(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => onToggle(!isOpen)}>{children}</div>
      {isOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100 }}>
          <Popover {...popoverProps} />
        </div>
      )}
    </div>
  );
}

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const agents = [
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
  { name: "Chat Quality Monitor", channel: "LiveChat", channelLabel: "Chat Support", teams: "Chat", extra: 2, score: 96, evaluations: 142, trend: 4.2, trendUp: true, status: "Active" },
  { name: "Call Center QA Analyst", channel: "Globe", channelLabel: "Social media", teams: "Call center", extra: 2, score: 94, evaluations: 128, trend: 2.8, trendUp: true, status: "Active" },
  { name: "Social Media QA Agent", channel: "Globe", channelLabel: "Social media", teams: "Advanced sup...", extra: 2, score: 91, evaluations: 98, trend: 1.5, trendUp: true, status: "Active" },
];

const METRIC_FILTERS = {
  all: () => true,
  active: (a) => a.status === "Active",
  draft: (a) => a.status === "Draft",
  trendDown: (a) => !a.trendUp,
};

function SortIcon({ field, sortField, sortDir }) {
  if (field !== sortField) return <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" />;
  const icon = sortDir === "asc" ? "ArrowTop" : "ArrowBottom";
  return <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt="" />;
}

function scoreColor(score) {
  if (score >= 80) return "var(--utilities-content-content-green)";
  if (score >= 70) return "var(--utilities-content-content-orange)";
  return "var(--utilities-content-content-red)";
}

export default function ScoringAgentsContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [activeMetric, setActiveMetric] = useState("all");
  const [openPopover, setOpenPopover] = useState(null);
  const [filterSelections, setFilterSelections] = useState({});

  function handleFilterSelect(key, value) {
    setFilterSelections((prev) => ({ ...prev, [key]: value }));
  }

  function handleFilterReset() {
    setFilterSelections({});
  }

  const activeCount = agents.filter((a) => a.status === "Active").length;
  const avgScore = Math.round(agents.reduce((s, a) => s + a.score, 0) / agents.length);
  const totalEvals = agents.reduce((s, a) => s + a.evaluations, 0);
  const trendDownCount = agents.filter((a) => !a.trendUp).length;

  const metrics = [
    { key: "all", icon: "Users", label: "Total Agents", value: String(agents.length) },
    { key: "active", icon: "ActiveUser", label: "Active", value: String(activeCount), valueColor: "var(--utilities-content-content-green)", filterable: true },
    { key: "all", icon: "ChartBars", label: "Average Score", value: `${avgScore}%`, valueColor: "var(--utilities-content-content-green)", trend: "4.2%", trendUp: true },
    { key: "all", icon: "LiveChat", label: "Total Evaluations", value: String(totalEvals) },
    { key: "trendDown", icon: "Trend", label: "Trending Down", value: String(trendDownCount), labelColor: "var(--utilities-content-content-red)", valueColor: "var(--utilities-content-content-red)", iconStyle: { filter: "brightness(0) saturate(100%) invert(40%) sepia(78%) saturate(1640%) hue-rotate(335deg) brightness(95%) contrast(97%)" }, danger: true, filterable: true },
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = agents.filter(METRIC_FILTERS[activeMetric] || METRIC_FILTERS.all);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.channelLabel.toLowerCase().includes(q) ||
          a.teams.toLowerCase().includes(q) ||
          a.status.toLowerCase().includes(q)
      );
    }

    if (sortField) {
      list.sort((a, b) => {
        let va = a[sortField];
        let vb = b[sortField];
        if (typeof va === "string") {
          va = va.toLowerCase();
          vb = vb.toLowerCase();
          return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return sortDir === "asc" ? va - vb : vb - va;
      });
    }

    return list;
  }, [search, sortField, sortDir, activeMetric]);

  return (
    <div className="sa-content">
      {/* Breadcrumb */}
      <div className="sa-breadcrumb">
        <span className="sa-breadcrumb-title">Scoring agents</span>
      </div>

      {/* Toolbar */}
      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <img src="/icons/16px/Search.svg" width={16} height={16} alt="" style={iconFilter} />
          <input
            type="text"
            className="sa-search-input"
            placeholder="Search configured agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sa-toolbar-actions">
          <FiltersButton
            filterSelections={filterSelections}
            onSelect={handleFilterSelect}
            onReset={handleFilterReset}
          />
          <PopoverAnchor
            isOpen={openPopover === "date"}
            onToggle={(v) => setOpenPopover(v ? "date" : null)}
            popoverProps={{
              content: "text",
              placeholder: "Search...",
              sections: [[
                { label: "Last 7 days",   icon: "/icons/16px/Clock.svg" },
                { label: "Last 30 days",  icon: "/icons/16px/Clock.svg" },
                { label: "Last 90 days",  icon: "/icons/16px/Clock.svg" },
                { label: "Last 6 months", icon: "/icons/16px/Calendar.svg" },
                { label: "Last year",     icon: "/icons/16px/Calendar.svg" },
              ]],
            }}
          >
            <button className="btn btn-secondary">
              <img src="/icons/16px/Calendar.svg" width={16} height={16} alt="" style={iconFilter} />
              <span className="btn-label">Last 30 days</span>
            </button>
          </PopoverAnchor>
          <button className="btn btn-accent">
            <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) invert(1)" }} />
            <span className="btn-label">Add QA Agent</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="sa-metrics">
        {metrics.map((m) => (
          <div
            className={`sa-metric-card${m.danger ? " sa-metric-danger" : ""}${m.filterable && activeMetric === m.key ? " sa-metric-active" : ""}`}
            key={m.label}
            onClick={m.filterable ? () => setActiveMetric(activeMetric === m.key ? "all" : m.key) : undefined}
            style={{ cursor: m.filterable ? "pointer" : "default" }}
          >
            <div className="sa-metric-header">
              <img src={`/icons/16px/${m.icon}.svg`} width={16} height={16} alt="" style={m.iconStyle || iconFilter} />
              <span className="sa-metric-label" style={m.labelColor ? { color: m.labelColor } : undefined}>{m.label}</span>
            </div>
            <div className="sa-metric-value-row">
              <span className="sa-metric-value" style={m.valueColor ? { color: m.valueColor } : undefined}>{m.value}</span>
              {m.trend && (
                <div className="sa-metric-trend">
                  <span style={{ color: "var(--utilities-content-content-green)" }}>{m.trend}</span>
                  <img src="/icons/16px/ArrowTopRight.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) saturate(100%) invert(58%) sepia(52%) saturate(405%) hue-rotate(103deg) brightness(95%) contrast(89%)" }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="sa-table-wrap">
        <div className="sa-table-header">
          <div className="sa-th sa-col-name">
            <button className="btn btn-ghost" onClick={() => handleSort("name")}>
              <span className="btn-label">Name</span>
              <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-180">
            <span className="sa-th-label">Channel</span>
          </div>
          <div className="sa-th sa-col-fixed-180">
            <span className="sa-th-label">Teams</span>
          </div>
          <div className="sa-th sa-col-fixed-120">
            <button className="btn btn-ghost" onClick={() => handleSort("score")}>
              <span className="btn-label">Score</span>
              <SortIcon field="score" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-120">
            <button className="btn btn-ghost" onClick={() => handleSort("evaluations")}>
              <span className="btn-label">Evaluations</span>
              <SortIcon field="evaluations" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-120">
            <button className="btn btn-ghost" onClick={() => handleSort("trend")}>
              <span className="btn-label">Trend</span>
              <SortIcon field="trend" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-120">
            <span className="sa-th-label">Status</span>
          </div>
          <div className="sa-th sa-col-fixed-100"></div>
        </div>

        {filtered.map((a, i) => (
          <div className="sa-row" key={i} style={{ cursor: "pointer" }} onClick={() => router.push(`/scoring-agents/${a.name.toLowerCase().replace(/\s+/g, "-")}`)}>
            {/* Name */}
            <div className="sa-cell sa-col-name">
              <span className="sa-cell-text sa-cell-primary">{a.name}</span>
            </div>

            {/* Channel */}
            <div className="sa-cell sa-col-fixed-180">
              <div className="sa-channel">
                <img src={`/icons/16px/${a.channel}.svg`} width={16} height={16} alt="" style={iconFilter} />
                <span className="sa-cell-text">{a.channelLabel}</span>
              </div>
            </div>

            {/* Teams */}
            <div className="sa-cell sa-col-fixed-180">
              <div className="sa-teams">
                <span className="sa-cell-text">{a.teams}</span>
                {a.extra > 0 && (
                  <Tag
                    size="sm"
                    label={`+${a.extra}`}
                    iconLeft={false}
                    icon12Left={<img src="/icons/12px/Plus.svg" width={12} height={12} alt="" style={iconFilter} />}
                  />
                )}
              </div>
            </div>

            {/* Score */}
            <div className="sa-cell sa-col-fixed-120">
              <span className="sa-cell-text" style={{ color: scoreColor(a.score) }}>{a.score}%</span>
            </div>

            {/* Evaluations */}
            <div className="sa-cell sa-col-fixed-120">
              <span className="sa-cell-text">{a.evaluations}</span>
            </div>

            {/* Trend */}
            <div className="sa-cell sa-col-fixed-120">
              <div className="sa-trend" style={{ color: a.trendUp ? "var(--utilities-content-content-green)" : "var(--utilities-content-content-red)" }}>
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
            </div>

            {/* Status */}
            <div className="sa-cell sa-col-fixed-120">
              <Tag color={a.status === "Active" ? "green" : "grey"} label={a.status} />
            </div>

            {/* Actions */}
            <div className="sa-cell sa-col-fixed-100 sa-cell-actions">
              <button className="btn btn-ghost btn-icon" onClick={(e) => e.stopPropagation()}>
                <img src="/icons/16px/Edit.svg" width={16} height={16} alt="Edit" style={iconFilter} />
              </button>
              <button className="btn btn-ghost-destructive btn-icon" onClick={(e) => e.stopPropagation()}>
                <img src="/icons/16px/Trash.svg" width={16} height={16} alt="Delete" style={{ filter: "brightness(0) saturate(100%) invert(40%) sepia(78%) saturate(1640%) hue-rotate(335deg) brightness(95%) contrast(97%)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
