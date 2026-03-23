"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Tag from "../../../components/Tag";
import FilterChip from "../../../components/FilterChip";
import DateRangeButton from "../../../components/DateRangeButton";
import { FiltersButton, FiltersPopover } from "../../../components/FiltersPopover";


const iconFilter = { filter: "brightness(0) invert(0.53)" };

const agents = [
  { name: "Chat Quality Monitor",      channel: "LiveChat",    channelLabel: "Chat",         team: "Chat",             score: 96, evaluations: 142, trend: 4.2, trendUp: true,  status: "Active", lastRun: "15/03/2026" },
  { name: "Call Center QA Analyst",    channel: "AnswerCall",  channelLabel: "Calls",        team: "Call Center",      score: 94, evaluations: 128, trend: 2.8, trendUp: true,  status: "Active", lastRun: "12/03/2026" },
  { name: "Social Media QA Agent",     channel: "Globe",       channelLabel: "Social Media", team: "Advanced Support", score: 91, evaluations: 98,  trend: 1.5, trendUp: true,  status: "Active", lastRun: "05/03/2026" },
  { name: "Chat Compliance Auditor",   channel: "Email",       channelLabel: "Email",        team: "Social Media",     score: 89, evaluations: 86,  trend: 3.1, trendUp: true,  status: "Draft",  lastRun: "01/03/2026" },
  { name: "Chat Escalation Reviewer",  channel: "LiveChat",    channelLabel: "Chat",         team: "Chat",             score: 88, evaluations: 74,  trend: 0.8, trendUp: true,  status: "Active", lastRun: "22/02/2026" },
  { name: "Call Scoring Analyst",      channel: "AnswerCall",  channelLabel: "Calls",        team: "Social Media",     score: 85, evaluations: 112, trend: 1.2, trendUp: false, status: "Draft",  lastRun: "15/02/2026" },
  { name: "Email SLA Monitor",         channel: "Email",       channelLabel: "Email",        team: "Call Center",      score: 82, evaluations: 95,  trend: 2,   trendUp: true,  status: "Active", lastRun: "05/01/2026" },
  { name: "Social Engagement Auditor", channel: "Globe",       channelLabel: "Social Media", team: "Advanced Support", score: 77, evaluations: 64,  trend: 3.5, trendUp: false, status: "Active", lastRun: "15/12/2025" },
  { name: "Chat CSAT Tracker",         channel: "LiveChat",    channelLabel: "Chat",         team: "Chat",             score: 68, evaluations: 58,  trend: 5.2, trendUp: false, status: "Active", lastRun: "20/12/2025" },
  { name: "Email Response Evaluator",  channel: "Email",       channelLabel: "Email",        team: "Chat",             score: 63, evaluations: 42,  trend: 8.1, trendUp: false, status: "Active", lastRun: "10/11/2025" },
  { name: "Compliance Risk Monitor",   channel: "LiveChat",    channelLabel: "Chat",         team: "Advanced Support", score: 96, evaluations: 142, trend: 4.2, trendUp: true,  status: "Active", lastRun: "14/03/2026" },
  { name: "Tone & Empathy Auditor",    channel: "Globe",       channelLabel: "Social Media", team: "Call Center",      score: 94, evaluations: 128, trend: 2.8, trendUp: true,  status: "Active", lastRun: "25/02/2026" },
  { name: "Knowledge Base Validator",  channel: "AnswerCall",  channelLabel: "Calls",        team: "Social Media",     score: 91, evaluations: 98,  trend: 1.5, trendUp: true,  status: "Active", lastRun: "18/01/2026" },
];

function parseDMY(str) {
  const [d, m, y] = str.split("/");
  return new Date(+y, +m - 1, +d);
}


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
  const [filterSelections, setFilterSelections] = useState({});
  const [dateFilter, setDateFilter] = useState(null);

  function handleFilterSelect(key, value) {
    setFilterSelections((prev) => {
      const next = { ...prev };
      if (value === null) { delete next[key]; return next; }
      const current = prev[key] || { value: [], op: "is" };
      const arr = Array.isArray(current.value) ? [...current.value] : current.value ? [current.value] : [];
      const newArr = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      if (newArr.length === 0) delete next[key];
      else next[key] = { value: newArr, op: current.op };
      return next;
    });
  }

  function handleFilterOpChange(key, op) {
    setFilterSelections((prev) => ({
      ...prev,
      [key]: { ...prev[key], op },
    }));
  }

  function handleFilterReset() {
    setFilterSelections({});
  }


  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filterCategories = useMemo(() => {
    const uniqueTeams = [...new Set(agents.map((a) => a.team))].sort();
    const uniqueChannels = [...new Set(agents.map((a) => a.channelLabel))].sort();
    const uniqueAgents = [...new Set(agents.map((a) => a.name))].sort();
    const uniqueStatuses = [...new Set(agents.map((a) => a.status))].sort();
    return [
      { key: "channels", label: "Channels", icon: "/icons/16px/Channel.svg", items: uniqueChannels },
      { key: "teams",    label: "Team",     icon: "/icons/16px/Users.svg",   items: uniqueTeams },
      { key: "agents",   label: "Agents",   icon: "/icons/16px/User.svg",    items: uniqueAgents },
      { key: "status",   label: "Status",   icon: "/icons/16px/CheckCircle.svg", items: uniqueStatuses },
    ];
  }, []);

  const filtered = useMemo(() => {
    let list = [...agents];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.channelLabel.toLowerCase().includes(q) ||
          a.team.toLowerCase().includes(q) ||
          a.status.toLowerCase().includes(q)
      );
    }

    if (filterSelections.channels?.value?.length) {
      const { value, op } = filterSelections.channels;
      const arr = Array.isArray(value) ? value : [value];
      list = list.filter((a) => op === "is not" ? !arr.includes(a.channelLabel) : arr.includes(a.channelLabel));
    }
    if (filterSelections.teams?.value?.length) {
      const { value, op } = filterSelections.teams;
      const arr = Array.isArray(value) ? value : [value];
      list = list.filter((a) => op === "is not" ? !arr.includes(a.team) : arr.includes(a.team));
    }
    if (filterSelections.agents?.value?.length) {
      const { value, op } = filterSelections.agents;
      const arr = Array.isArray(value) ? value : [value];
      list = list.filter((a) => op === "is not" ? !arr.includes(a.name) : arr.includes(a.name));
    }
    if (filterSelections.status?.value?.length) {
      const { value, op } = filterSelections.status;
      const arr = Array.isArray(value) ? value : [value];
      list = list.filter((a) => op === "is not" ? !arr.includes(a.status) : arr.includes(a.status));
    }

    if (dateFilter) {
      list = list.filter((a) => {
        const d = parseDMY(a.lastRun);
        return d >= dateFilter.from && d <= dateFilter.to;
      });
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
  }, [search, sortField, sortDir, filterSelections, dateFilter]);

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
            filterCategories={filterCategories}
          />
          <DateRangeButton onChange={setDateFilter} />
          <button className="btn btn-accent" onClick={() => router.push("/scoring-agents/new")}>
            <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) invert(1)" }} />
            <span className="btn-label">Add QA Agent</span>
          </button>
        </div>
      </div>

      {/* Active filters bar */}
      {Object.keys(filterSelections).length > 0 && (
        <div className="sa-filters-bar">
          <div className="sa-filters-bar-chips">
            {filterCategories
              .filter((cat) => filterSelections[cat.key]?.value?.length > 0)
              .map((cat) => (
                <FilterChip
                  key={cat.key}
                  label={cat.label}
                  values={filterSelections[cat.key].value}
                  op={filterSelections[cat.key].op ?? "is"}
                  onRemove={() => handleFilterSelect(cat.key, null)}
                  onOpChange={(newOp) => handleFilterOpChange(cat.key, newOp)}
                  categoryItems={cat.items}
                  onValueToggle={(v) => handleFilterSelect(cat.key, v)}
                />
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
            <span className="sa-th-label">Team</span>
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

            {/* Team */}
            <div className="sa-cell sa-col-fixed-180">
              <span className="sa-cell-text">{a.team}</span>
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
