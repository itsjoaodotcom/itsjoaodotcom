"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Tag from "../../../components/Tag";
import FilterChip from "../../../components/FilterChip";
import DateRangeButton from "../../../components/DateRangeButton";
import { FiltersButton, FiltersPopover } from "../../../components/FiltersPopover";
import Toggle from "../../../components/Toggle";
import { useShell } from "../../../components/ShellContext";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

/* agents come from ShellContext */

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
  const { agents, deleteAgent, updateAgent } = useShell();
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
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
  }, [agents]);

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
  }, [agents, search, sortField, sortDir, filterSelections, dateFilter]);

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
            <div className="sa-cell sa-col-fixed-120" onClick={(e) => e.stopPropagation()}>
              <Toggle on={a.status === "Active"} onChange={(val) => { updateAgent(a.id, { ...a._form, isDraft: !val }); }} />
            </div>

            {/* Actions */}
            <div className="sa-cell sa-col-fixed-100 sa-cell-actions">
              <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); router.push(`/scoring-agents/${a.name.toLowerCase().replace(/\s+/g, "-")}/edit`); }}>
                <img src="/icons/16px/Edit.svg" width={16} height={16} alt="Edit" style={iconFilter} />
              </button>
              <button className="btn btn-ghost-destructive btn-icon" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(a); }}>
                <img src="/icons/16px/Trash.svg" width={16} height={16} alt="Delete" style={{ filter: "brightness(0) saturate(100%) invert(40%) sepia(78%) saturate(1640%) hue-rotate(335deg) brightness(95%) contrast(97%)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="sa-delete-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="sa-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-delete-modal-inner">
              <div className="sa-delete-content">
                <p className="sa-delete-title">Delete &quot;{deleteConfirm.name}&quot;</p>
                <p className="sa-delete-desc">This action cannot be undone. All configurations, scoring metrics, and associated data will be permanently deleted.</p>
              </div>
              <div className="sa-delete-divider" />
              <div className="sa-delete-actions">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                  <span className="btn-label">Cancel</span>
                </button>
                <button className="btn btn-destructive" onClick={() => { const name = deleteConfirm.name; deleteAgent(deleteConfirm.id); setDeleteConfirm(null); setToast(`${name} has been successfully deleted.`); setTimeout(() => setToast(null), 4000); }}>
                  <span className="btn-label">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="sa-toast">
          <div className="sa-toast-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5ZM8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM9.64648 6.64648C9.84175 6.45122 10.1583 6.45122 10.3535 6.64648C10.5488 6.84175 10.5488 7.15825 10.3535 7.35352L7.85352 9.85352C7.65825 10.0488 7.34175 10.0488 7.14648 9.85352L5.64648 8.35352C5.45122 8.15825 5.45122 7.84175 5.64648 7.64648C5.84175 7.45122 6.15825 7.45122 6.35352 7.64648L7.5 8.79297L9.64648 6.64648Z" fill="var(--utilities-content-content-green, #47ad7a)"/>
            </svg>
          </div>
          <span className="sa-toast-text">{toast}</span>
          <div className="sa-toast-close">
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setToast(null)}>
              <img src="/icons/16px/Cross.svg" width={16} height={16} alt="" style={iconFilter} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
