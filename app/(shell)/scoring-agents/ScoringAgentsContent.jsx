"use client";

import { useState, useMemo } from "react";
import Tag from "../../../components/Tag";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

const agents = [
  { name: "Chat Quality Monitor", channel: "LiveChat", channelLabel: "Chat Support", teams: "Chat", extra: 2, score: 96, scoreColor: "var(--green-05)", evaluations: 142, trend: 4.2, trendUp: true, status: "Active" },
  { name: "Call Center QA Analyst", channel: "Globe", channelLabel: "Social media", teams: "Call center", extra: 2, score: 94, scoreColor: "var(--orange-05)", evaluations: 128, trend: 2.8, trendUp: true, status: "Active" },
  { name: "Social Media QA Agent", channel: "Globe", channelLabel: "Social media", teams: "Advanced sup...", extra: 2, score: 91, scoreColor: "var(--green-05)", evaluations: 98, trend: 1.5, trendUp: true, status: "Active" },
  { name: "Chat Compliance Auditor", channel: "Email", channelLabel: "Email", teams: "Social media", extra: 2, score: 89, scoreColor: "var(--green-05)", evaluations: 86, trend: 3.1, trendUp: true, status: "Draft" },
  { name: "Chat Escalation Reviewer", channel: "AnswerCall", channelLabel: "Call center", teams: "Chat", extra: 2, score: 88, scoreColor: "var(--green-05)", evaluations: 74, trend: 0.8, trendUp: true, status: "Active" },
  { name: "Call Scoring Analyst", channel: "Email", channelLabel: "Email", teams: "Social media", extra: 2, score: 85, scoreColor: "var(--green-05)", evaluations: 112, trend: 1.2, trendUp: false, status: "Draft" },
  { name: "Email SLA Monitor", channel: "LiveChat", channelLabel: "Chat Support", teams: "Call center", extra: 2, score: 82, scoreColor: "var(--green-05)", evaluations: 95, trend: 2, trendUp: true, status: "Active" },
  { name: "Social Engagement Auditor", channel: "Email", channelLabel: "Email", teams: "Advanced sup...", extra: 2, score: 77, scoreColor: "var(--orange-05)", evaluations: 64, trend: 3.5, trendUp: false, status: "Active" },
  { name: "Chat CSAT Tracker", channel: "LiveChat", channelLabel: "Chat Support", teams: "Chat", extra: 2, score: 68, scoreColor: "var(--red-05)", evaluations: 58, trend: 5.2, trendUp: false, status: "Active" },
  { name: "Email Response Evaluator", channel: "AnswerCall", channelLabel: "Call center", teams: "Chat", extra: 2, score: 63, scoreColor: "var(--red-05)", evaluations: 42, trend: 8.1, trendUp: false, status: "Active" },
];

function SortIcon({ field, sortField, sortDir }) {
  if (field !== sortField) return <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" />;
  const icon = sortDir === "asc" ? "ArrowTop" : "ArrowBottom";
  return <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt="" />;
}

export default function ScoringAgentsContent() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = [...agents];

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
  }, [search, sortField, sortDir]);

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
          <button className="btn btn-secondary btn-sm btn-icon">
            <img src="/icons/16px/Filter.svg" width={16} height={16} alt="" style={iconFilter} />
          </button>
          <button className="btn btn-accent btn-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="btn-label">Add QA Agent</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sa-table-wrap">
        <div className="sa-table-header">
          <div className="sa-th sa-col-name">
            <button className="btn btn-ghost btn-sm" onClick={() => handleSort("name")}>
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
            <button className="btn btn-ghost btn-sm" onClick={() => handleSort("score")}>
              <span className="btn-label">Score</span>
              <SortIcon field="score" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-120">
            <button className="btn btn-ghost btn-sm" onClick={() => handleSort("evaluations")}>
              <span className="btn-label">Evaluations</span>
              <SortIcon field="evaluations" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-120">
            <button className="btn btn-ghost btn-sm" onClick={() => handleSort("trend")}>
              <span className="btn-label">Trend</span>
              <SortIcon field="trend" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-120">
            <button className="btn btn-ghost btn-sm" onClick={() => handleSort("status")}>
              <span className="btn-label">Status</span>
              <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>
          <div className="sa-th sa-col-fixed-100"></div>
        </div>

        {filtered.map((a) => (
          <div className="sa-row" key={a.name} style={{ cursor: "pointer" }}>
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
                  <Tag size="sm" label={`+${a.extra}`} iconLeft={false} />
                )}
              </div>
            </div>

            {/* Score */}
            <div className="sa-cell sa-col-fixed-120">
              <span className="sa-cell-text" style={{ color: a.scoreColor }}>{a.score}%</span>
            </div>

            {/* Evaluations */}
            <div className="sa-cell sa-col-fixed-120">
              <span className="sa-cell-text sa-cell-tertiary">{a.evaluations}</span>
            </div>

            {/* Trend */}
            <div className="sa-cell sa-col-fixed-120">
              <div className="sa-trend" style={{ color: a.trendUp ? "var(--green-05)" : "var(--red-05)" }}>
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
