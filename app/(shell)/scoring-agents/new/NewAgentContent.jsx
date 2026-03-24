"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Popover from "../../../../components/Popover";
import Tag from "../../../../components/Tag";
import Input from "../../../../components/Input";
import Toggle from "../../../../components/Toggle";
import { useShell } from "../../../../components/ShellContext";

const iconFilter = { filter: "brightness(0) invert(0.53)" };
const iconTab = { filter: "brightness(0) invert(0.5)", width: 16, height: 16 };
const iconTabActive = { filter: "brightness(0)", width: 16, height: 16 };

const tabs = [
  { key: "details",   label: "Agent Details",   icon: "/icons/16px/User.svg" },
  { key: "knowledge", label: "Knowledge Base",   icon: "/icons/16px/Documentation.svg" },
  { key: "scoring",   label: "Scoring Matrix",   icon: "/icons/16px/Grid.svg" },
  { key: "settings",  label: "Settings",         icon: "/icons/16px/Settings.svg" },
];

export default function NewAgentContent({ editId } = {}) {
  const router = useRouter();
  const { addAgent, updateAgent, getAgentById } = useShell();
  const [activeTab, setActiveTab] = useState("details");
  const [agentName, setAgentName] = useState("");
  const [channel, setChannel] = useState("Chat");
  const [channelOpen, setChannelOpen] = useState(false);
  const channelRef = useRef(null);
  const [frequency, setFrequency] = useState("All Conversations");
  const [freqOpen, setFreqOpen] = useState(false);
  const freqRef = useRef(null);
  const [description, setDescription] = useState("");

  const kbCollections = [
    { key: "all",        label: "All content",        detail: "Select all available collections (5 collections)" },
    { key: "workflows",  label: "Workflows",           detail: "1 article" },
    { key: "product",    label: "Product Knowledge",    detail: "1 article" },
    { key: "refund",     label: "Refund Policy",        detail: "1 article" },
    { key: "greeting",   label: "Greeting Closing",     detail: "1 article" },
    { key: "escalation", label: "Escalation Policy",    detail: "1 article" },
  ];
  const [kbToggles, setKbToggles] = useState({});
  const [autoEval, setAutoEval] = useState(true);
  const [categories, setCategories] = useState([]);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatIndex, setEditingCatIndex] = useState(null);
  const [catName, setCatName] = useState("");
  const [catWeight, setCatWeight] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [critModalOpen, setCritModalOpen] = useState(null); // index of category, or null
  const [critName, setCritName] = useState("");
  const [critDesc, setCritDesc] = useState("");
  const [critStrategy, setCritStrategy] = useState("Behavioral");
  const [critStrategyOpen, setCritStrategyOpen] = useState(false);
  const critStrategyRef = useRef(null);
  const [critMet, setCritMet] = useState("");
  const [critNotMet, setCritNotMet] = useState("");
  const [critWeight, setCritWeight] = useState("1.2");
  const [critViolation, setCritViolation] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [editingPermIndex, setEditingPermIndex] = useState(null);
  const [reportToggles, setReportToggles] = useState({ dailySummary: false, weeklyReport: false, scoreDrop: false, criticalAlerts: false });
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [permUsers, setPermUsers] = useState([]);
  const [permUserOpen, setPermUserOpen] = useState(false);
  const permUserRef = useRef(null);
  const [permEdit, setPermEdit] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [critZeroIfViolated, setCritZeroIfViolated] = useState(true);
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const [scoringModel, setScoringModel] = useState("Weighted (Points per criterion)");
  const [modelOpen, setModelOpen] = useState(false);
  const modelRef = useRef(null);
  const [scorecardName, setScorecardName] = useState("");
  const [outputLang, setOutputLang] = useState("English");

  /* Load form data when editing an existing agent */
  useEffect(() => {
    if (!editId) return;
    const agent = getAgentById(editId);
    if (!agent?._form) return;
    const f = agent._form;
    if (f.agentName) setAgentName(f.agentName);
    if (f.channel) setChannel(f.channel);
    if (f.frequency) setFrequency(f.frequency);
    if (f.description) setDescription(f.description);
    if (f.autoEval !== undefined) setAutoEval(f.autoEval);
    if (f.kbToggles) setKbToggles(f.kbToggles);
    if (f.categories) setCategories(f.categories);
    if (f.scorecardName) setScorecardName(f.scorecardName);
    if (f.scoringModel) setScoringModel(f.scoringModel);
    if (f.outputLang) setOutputLang(f.outputLang);
  }, [editId, getAgentById]);

  useEffect(() => {
    function onDown(e) {
      if (channelRef.current && !channelRef.current.contains(e.target)) setChannelOpen(false);
      if (freqRef.current && !freqRef.current.contains(e.target)) setFreqOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (modelRef.current && !modelRef.current.contains(e.target)) setModelOpen(false);
      if (critStrategyRef.current && !critStrategyRef.current.contains(e.target)) setCritStrategyOpen(false);
      if (permUserRef.current && !permUserRef.current.contains(e.target)) setPermUserOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const channelOptions = ["Chat", "Email", "Calls", "Social Media"];
  const frequencyOptions = ["All Conversations", "Random 25%", "Random 50%", "Flagged Only"];
  const languageOptions = ["English", "Arabic", "French", "Spanish"];
  const scoringModelOptions = ["Binary (Pass/Fail per dimension)", "Weighted (Points per criterion)", "Hybrid (Points + Compliance)"];
  const strategyOptions = ["Behavioral", "Compliance", "Technical", "Process"];
  const settingsAgents = [
    { name: "Sarah Al-Rashid",  detail: "Chat Support · chat",       avatar: "/avatars/Avatar 01.png" },
    { name: "James Mitchell",   detail: "Chat Support · chat",       avatar: "/avatars/Avatar 2.png" },
    { name: "Fatima Noor",       detail: "Call Center · call",        avatar: "/avatars/Avatar 3.png" },
    { name: "David Chen",        detail: "Advanced Support · email",  avatar: "/avatars/Avatar 4.png" },
    { name: "Layla Hassan",      detail: "Social Media · social",     avatar: "/avatars/Avatar 5.png" },
    { name: "Omar Khalil",       detail: "Chat Support · chat",       avatar: "/avatars/Avatar 6.png" },
    { name: "Emma Rodriguez",    detail: "Call Center · call",        avatar: "/avatars/Avatar 7.png" },
    { name: "Ahmed Mansour",     detail: "Advanced Support · email",  avatar: "/avatars/Avatar 8.png" },
    { name: "Priya Sharma",      detail: "Social Media · social",     avatar: "/avatars/Avatar 9.png" },
    { name: "Nadia El-Amin",     detail: "Chat Support · chat",       avatar: "/avatars/Avatar 10.png" },
  ];
  const checkedAgents = settingsAgents.filter((a) => selectedAgents[a.name]);
  const checkedAgentNames = checkedAgents.map((a) => a.name);

  return (
    <div className="sa-content na-content">
      {/* Breadcrumb */}
      <div className="sa-breadcrumb">
        <Link href="/scoring-agents" className="sad-breadcrumb-link">Agents QA</Link>
        <img src="/icons/16px/Slash.svg" width={16} height={16} alt="" style={iconFilter} />
        <span className="sad-breadcrumb-current">{editId ? "Edit Agent QA" : "New Agent QA"}</span>
      </div>

      <div className="na-body">
        {/* Header */}
        <div className="na-header">
          <button className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => router.push("/scoring-agents")}>
            <img src="/icons/16px/ChevronLeft.svg" width={16} height={16} alt="" style={iconFilter} />
            <span className="btn-label">Back</span>
          </button>

          <div>
            <h1 className="na-title">{editId ? "Edit Agent QA" : "Add Agent QA"}</h1>
            <p className="na-subtitle">{editId ? "Update your QA agent configuration" : "Configure a new QA agent with evaluation settings"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="na-tabs">
          {tabs.map((t) => (
            <button key={t.key} className={`na-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
              <img src={t.icon} alt="" style={activeTab === t.key ? iconTabActive : iconTab} className="na-tab-icon" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Agent Details tab */}
        {activeTab === "details" && (
          <div className="na-section">
            <div className="na-section-header">Agent Details</div>
            <div className="na-section-body">
              <div className="na-section-card">
                <Input label="Agent name" placeholder="Enter agent name" value={agentName} onChange={(e) => setAgentName(e.target.value)} />

                <div className="na-row">
                  <div ref={channelRef} style={{ position: "relative" }}>
                    <Input
                      label="Channel"
                      value={channel}
                      readOnly
                      onMouseDown={(e) => { e.stopPropagation(); setChannelOpen((v) => !v); }}
                      button={<button className="btn btn-ghost btn-sm btn-icon" type="button"><img src={`/icons/16px/${channelOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" style={iconFilter} /></button>}
                    />
                    {channelOpen && (
                      <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200 }}>
                        <Popover
                          content="text"
                          noHeader
                          sections={[channelOptions.map((c) => ({
                            label: c,
                            tick: true,
                            selected: channel === c,
                          }))]}
                          onItemClick={(item) => { setChannel(item.label); setChannelOpen(false); }}
                        />
                      </div>
                    )}
                  </div>
                  <div ref={freqRef} style={{ position: "relative" }}>
                    <Input
                      label="Evaluation frequency"
                      value={frequency}
                      readOnly
                      onMouseDown={(e) => { e.stopPropagation(); setFreqOpen((v) => !v); }}
                      button={<button className="btn btn-ghost btn-sm btn-icon" type="button"><img src={`/icons/16px/${freqOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" style={iconFilter} /></button>}
                    />
                    {freqOpen && (
                      <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200 }}>
                        <Popover
                          content="text"
                          noHeader
                          sections={[frequencyOptions.map((f) => ({
                            label: f,
                            tick: true,
                            selected: frequency === f,
                          }))]}
                          onItemClick={(item) => { setFrequency(item.label); setFreqOpen(false); }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Input label="Description" textArea placeholder="Describe the purpose and scope of this QA Agent" value={description} onChange={(e) => setDescription(e.target.value)} />

                <div className="na-toggle-row">
                  <Toggle on={autoEval} onChange={setAutoEval} />
                  <span className="na-toggle-label">Automatically evaluate conversations as they come in</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base tab */}
        {activeTab === "knowledge" && (
          <div className="na-section">
            <div className="na-section-header">Knowledge base collections</div>
            <div className="na-section-body">
              <div className="na-section-card" style={{ gap: 8 }}>
                {kbCollections.map((col) => {
                  const isOn = col.key === "all"
                    ? Object.keys(kbToggles).length > 0 && kbCollections.slice(1).every((c) => kbToggles[c.key])
                    : !!kbToggles[col.key];
                  return (
                    <div key={col.key} className="na-kb-row">
                      <Toggle
                        on={isOn}
                        onChange={() => {
                          if (col.key === "all") {
                            const allOn = kbCollections.slice(1).every((c) => kbToggles[c.key]);
                            const next = {};
                            if (!allOn) kbCollections.slice(1).forEach((c) => { next[c.key] = true; });
                            setKbToggles(next);
                          } else {
                            setKbToggles((prev) => ({ ...prev, [col.key]: !prev[col.key] }));
                          }
                        }}
                      />
                      <div className="na-kb-text">
                        <span className="na-kb-label">{col.label}</span>
                        <span className="na-kb-detail">{col.detail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Scoring Matrix tab */}
        {activeTab === "scoring" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 880, width: "100%" }}>
            <div className="na-section">
              <div className="na-section-header">Scorecard details</div>
              <div className="na-section-body">
                <div className="na-section-card">
                  <Input label="Scorecard name" placeholder="e.g. Tier Chat  Quality" />
                  <div className="na-row" style={{ gap: 12 }}>
                    <div ref={modelRef} style={{ position: "relative" }}>
                      <Input
                        label="Scoring model"
                        value={scoringModel}
                        readOnly
                        onMouseDown={(e) => { e.stopPropagation(); setModelOpen((v) => !v); }}
                        button={<button className="btn btn-ghost btn-sm btn-icon" type="button"><img src={`/icons/16px/${modelOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" style={iconFilter} /></button>}
                      />
                      {modelOpen && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200 }}>
                          <Popover
                            content="text"
                            noHeader
                            sections={[scoringModelOptions.map((m) => ({
                              label: m,
                              tick: true,
                              selected: scoringModel === m,
                            }))]}
                            onItemClick={(item) => { setScoringModel(item.label); setModelOpen(false); }}
                          />
                        </div>
                      )}
                    </div>
                    <div ref={langRef} style={{ position: "relative" }}>
                      <Input
                        label="Output language"
                        value={language}
                        readOnly
                        onMouseDown={(e) => { e.stopPropagation(); setLangOpen((v) => !v); }}
                        button={<button className="btn btn-ghost btn-sm btn-icon" type="button"><img src={`/icons/16px/${langOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" style={iconFilter} /></button>}
                      />
                      {langOpen && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200 }}>
                          <Popover
                            content="text"
                            noHeader
                            sections={[languageOptions.map((l) => ({
                              label: l,
                              tick: true,
                              selected: language === l,
                            }))]}
                            onItemClick={(item) => { setLanguage(item.label); setLangOpen(false); }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="na-section">
              <div className="na-section-header-row">
                <div className="na-section-header">Categories &amp; Criteria</div>
                {categories.length > 0 && (
                  <div style={{ padding: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingCatIndex(null); setCatName(""); setCatWeight(""); setCatDesc(""); setCatModalOpen(true); }}>
                      <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={iconFilter} />
                      <span className="btn-label">Add category</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="na-section-body">
                {categories.length === 0 ? (
                  <div className="na-section-card" style={{ alignItems: "center", justifyContent: "center", padding: "24px 14px" }}>
                    <div className="na-empty-state">
                      <img src="/illustrations/Categories.svg" alt="" />
                      <p className="na-empty-text">No categories added yet</p>
                      <button className="btn btn-accent btn-sm" onClick={() => { setEditingCatIndex(null); setCatName(""); setCatWeight(""); setCatDesc(""); setCatModalOpen(true); }}>
                        <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) invert(1)" }} />
                        <span className="btn-label">Add category</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {categories.map((cat, i) => (
                      <div key={i} className="na-cat-group">
                        <div className="na-cat-row-wrap">
                          <div className="na-cat-row" style={{ cursor: "pointer" }} onClick={() => {
                            setEditingCatIndex(i);
                            setCatName(cat.name);
                            setCatWeight(cat.weight);
                            setCatDesc(cat.description || "");
                            setCatModalOpen(true);
                          }}>
                            <div className="na-cat-info">
                              <span className="na-cat-name">{cat.name}</span>
                              <Tag size="sm" label={`Weight: ${cat.weight}`} />
                            </div>
                            <div className="na-cat-actions">
                              <button
                                className="btn btn-ghost btn-sm btn-icon"
                                onClick={(e) => { e.stopPropagation(); setCategories((prev) => prev.filter((_, j) => j !== i)); }}
                              >
                                <img src="/icons/16px/Trash.svg" width={16} height={16} alt="" style={{ filter: "invert(38%) sepia(72%) saturate(1200%) hue-rotate(331deg) brightness(92%) contrast(90%)" }} />
                              </button>
                            </div>
                          </div>
                        </div>
                        {cat.criteria && cat.criteria.length > 0 && (
                          <>
                            <div className="na-crit-divider" />
                            <div className="na-crit-items">
                              {cat.criteria.map((crit, ci) => (
                                <div key={ci} className="na-crit-row">
                                  <span className="na-crit-name">{crit.name}</span>
                                  <Tag size="sm" label={`Weight: ${crit.weight}`} />
                                  <Tag size="sm" label={crit.strategy} variant="dot" />
                                  <Tag size="sm" label={`Weight: ${crit.weight}`} />
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        <div className="na-cat-criteria">
                          <button className="btn btn-ghost na-add-criterion-btn" onClick={() => {
                            setCritModalOpen(i);
                            setCritName(""); setCritDesc(""); setCritStrategy("Behavioral"); setCritMet(""); setCritNotMet(""); setCritWeight("1.2"); setCritViolation(true); setCritZeroIfViolated(true);
                          }}>
                            <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={iconFilter} />
                            <span className="btn-label" style={{ color: "var(--content-quartenary, rgba(0,0,0,0.4))" }}>Add criterion</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 880, width: "100%" }}>
            <div className="na-section">
              <div className="na-section-header">Teams &amp; Agents Assignment</div>
              <div className="na-section-body" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Teams */}
                <div className="na-settings-card">
                  <div className="na-settings-subheader">Teams</div>
                  <div className="na-settings-grid">
                    {[
                      { name: "Daily Summary Email", detail: "8 agents · email" },
                      { name: "Chat Support",        detail: "12 agents · chat" },
                      { name: "Social Media",        detail: "6 agents · social" },
                      { name: "Call Center",          detail: "8 agents · call" },
                    ].map((t) => (
                      <label key={t.name} className="na-checkbox-row">
                        <input type="checkbox" className="na-checkbox" />
                        <div className="na-checkbox-text">
                          <span className="na-checkbox-label">{t.name}</span>
                          <span className="na-checkbox-detail">{t.detail}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Agents */}
                <div className="na-settings-card">
                  <div className="na-settings-subheader">Agents</div>
                  <div className="na-settings-grid">
                    {settingsAgents.map((a) => (
                      <label key={a.name} className="na-checkbox-row">
                        <input
                          type="checkbox"
                          className="na-checkbox"
                          checked={!!selectedAgents[a.name]}
                          onChange={() => setSelectedAgents((prev) => ({ ...prev, [a.name]: !prev[a.name] }))}
                        />
                        <div className="na-checkbox-text">
                          <span className="na-checkbox-label">{a.name}</span>
                          <span className="na-checkbox-detail">{a.detail}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="na-section">
              <div className="na-section-header">Reporting Settings</div>
              <div className="na-section-body">
                <div className="na-section-card">
                  <div className="na-settings-grid">
                    {[
                      { key: "dailySummary",   label: "Daily Summary Email",     desc: "Receive daily performance summaries" },
                      { key: "weeklyReport",   label: "Weekly Report",           desc: "Detailed weekly analytics report" },
                      { key: "scoreDrop",      label: "Alert on Score Drop",     desc: "Notify when score drops below threshold" },
                      { key: "criticalAlerts", label: "Critical Violation Alerts", desc: "Immediate alerts for critical violations" },
                    ].map((item) => (
                      <div key={item.key} className="na-toggle-card">
                        <Toggle on={reportToggles[item.key]} onChange={(v) => setReportToggles((prev) => ({ ...prev, [item.key]: v }))} />
                        <div className="na-toggle-card-text">
                          <span className="na-toggle-card-label">{item.label}</span>
                          <span className="na-toggle-card-desc">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Input
                    label="Emails to be notified"
                    placeholder="e.g. qa-lead@company.com, manager@company.com"
                    caption="Separate multiple emails with commas"
                  />
                </div>
              </div>
            </div>

            <div className="na-section">
              <div className="na-section-header-row">
                <div className="na-section-header">Permissions</div>
                {permissions.length > 0 && (
                  <div style={{ padding: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingPermIndex(null); setPermUsers([]); setPermEdit(false); setPermModalOpen(true); }}>
                      <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={iconFilter} />
                      <span className="btn-label">Add permission</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="na-section-body">
                {permissions.length === 0 ? (
                  <div className="na-section-card" style={{ alignItems: "center", justifyContent: "center", padding: "24px 14px" }}>
                    <div className="na-empty-state">
                      <img src="/illustrations/Permissions.svg" alt="" />
                      <p className="na-empty-text">No permissions configured</p>
                      <button className="btn btn-accent btn-sm" onClick={() => { setEditingPermIndex(null); setPermUsers([]); setPermEdit(false); setPermModalOpen(true); }}>
                        <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) invert(1)" }} />
                        <span className="btn-label">Add permission</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="na-perm-card">
                    {permissions.map((perm, i) => (
                      <div key={i} className="na-perm-row" style={{ cursor: "pointer" }} onClick={() => {
                        setEditingPermIndex(i);
                        setPermUsers([perm.name]);
                        setPermEdit(perm.canEdit);
                        setPermModalOpen(true);
                      }}>
                        <div className="na-perm-info">
                          <img src={perm.avatar} width={16} height={16} alt="" className="na-perm-avatar" />
                          <span className="na-perm-name">{perm.name}</span>
                          <Tag
                            size="sm"
                            label={perm.canEdit ? "Can edit" : "Can view"}
                            iconLeft={true}
                            icon12Left={<img src={`/icons/12px/${perm.canEdit ? "Edit" : "Eye open"}.svg`} width={12} height={12} alt="" style={iconFilter} />}
                          />
                        </div>
                        <div className="na-cat-actions">
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={(e) => { e.stopPropagation(); setPermissions((prev) => prev.filter((_, j) => j !== i)); }}>
                            <img src="/icons/16px/Trash.svg" width={16} height={16} alt="" style={{ filter: "invert(38%) sepia(72%) saturate(1200%) hue-rotate(331deg) brightness(92%) contrast(90%)" }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions bar */}
      <div className="na-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => {
          const formData = { agentName, channel, frequency, description, autoEval, kbToggles, categories, scorecardName, scoringModel, outputLang, isDraft: true };
          if (editId) { updateAgent(editId, formData); } else { addAgent(formData); }
          router.push("/scoring-agents");
        }}>
          <img src="/icons/16px/NoteEdit.svg" width={16} height={16} alt="" style={iconFilter} />
          <span className="btn-label">Save as a draft</span>
        </button>
        <div className="na-actions-divider" />
        <div className="na-actions-right">
          <button className="btn btn-secondary btn-sm" onClick={() => router.push("/scoring-agents")}>
            <span className="btn-label">Cancel</span>
          </button>
          <button className="btn btn-accent btn-sm" onClick={() => {
            const formData = { agentName, channel, frequency, description, autoEval, kbToggles, categories, scorecardName, scoringModel, outputLang, isDraft: false };
            if (editId) { updateAgent(editId, formData); } else { addAgent(formData); }
            router.push("/scoring-agents");
          }}>
            <span className="btn-label">{editId ? "Save changes" : "Save and active"}</span>
          </button>
        </div>
      </div>

      {/* Add category modal */}
      {catModalOpen && (
        <div className="na-modal-overlay" onClick={() => setCatModalOpen(false)}>
          <div className="na-modal" onClick={(e) => e.stopPropagation()}>
            <div className="na-modal-header">
              <span className="na-modal-title">{editingCatIndex !== null ? "Edit category" : "Add new category"}</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setCatModalOpen(false)}>
                <img src="/icons/16px/Cross.svg" width={16} height={16} alt="" style={iconFilter} />
              </button>
            </div>
            <div className="na-modal-body">
              <Input label="Category name" placeholder="e.g. Customer Impact" value={catName} onChange={(e) => setCatName(e.target.value)} />
              <div className="input-field">
                <label className="input-label">Weight</label>
                <div className="na-weight-wrap">
                  <input className="na-weight-value" type="number" step="0.1" min="0" placeholder="1.2" value={catWeight} onChange={(e) => setCatWeight(e.target.value)} />
                  <div className="na-weight-arrows">
                    <button type="button" className="na-weight-arrow" onClick={() => setCatWeight((v) => (Math.max(0.1, parseFloat(v || 0) - 0.1)).toFixed(1))}>
                      <img src="/icons/16px/ChevronLeft.svg" width={16} height={16} alt="" style={iconFilter} />
                    </button>
                    <button type="button" className="na-weight-arrow" onClick={() => setCatWeight((v) => (parseFloat(v || 0) + 0.1).toFixed(1))}>
                      <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" style={iconFilter} />
                    </button>
                  </div>
                </div>
              </div>
              <Input label="Description" textArea placeholder="Describe the purpose and scope of this QA Agent" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
            </div>
            <div className="na-modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setCatModalOpen(false)}>
                <span className="btn-label">Cancel</span>
              </button>
              <button
                className="btn btn-accent btn-sm"
                onClick={() => {
                  if (catName.trim()) {
                    if (editingCatIndex !== null) {
                      setCategories((prev) => prev.map((c, j) => j === editingCatIndex ? { name: catName, weight: catWeight || "1", description: catDesc } : c));
                    } else {
                      setCategories((prev) => [...prev, { name: catName, weight: catWeight || "1", description: catDesc }]);
                    }
                    setCatName("");
                    setCatWeight("");
                    setCatDesc("");
                    setEditingCatIndex(null);
                    setCatModalOpen(false);
                  }
                }}
              >
                <span className="btn-label">{editingCatIndex !== null ? "Save" : "Add category"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add criteria modal */}
      {critModalOpen !== null && (
        <div className="na-modal-overlay" onClick={() => setCritModalOpen(null)}>
          <div className="na-modal na-modal-fixed" onClick={(e) => e.stopPropagation()}>
            <div className="na-modal-header">
              <span className="na-modal-title">Add criteria</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setCritModalOpen(null)}>
                <img src="/icons/16px/Cross.svg" width={16} height={16} alt="" style={iconFilter} />
              </button>
            </div>
            <div className="na-modal-body">
              <Input label="Criteria name" placeholder="e.g. Empathy & Active Listening" value={critName} onChange={(e) => setCritName(e.target.value)} />
              <Input label="Description" textArea placeholder="Describe what this criterion evaluates..." value={critDesc} onChange={(e) => setCritDesc(e.target.value)} />
              <div ref={critStrategyRef} style={{ position: "relative" }}>
                <Input
                  label="Evaluation Strategy"
                  value={critStrategy}
                  readOnly
                  onMouseDown={(e) => { e.stopPropagation(); setCritStrategyOpen((v) => !v); }}
                  button={<button className="btn btn-ghost btn-sm btn-icon" type="button"><img src={`/icons/16px/${critStrategyOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" style={iconFilter} /></button>}
                />
                {critStrategyOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200 }}>
                    <Popover
                      content="text"
                      noHeader
                      sections={[strategyOptions.map((s) => ({ label: s, tick: true, selected: critStrategy === s }))]}
                      onItemClick={(item) => { setCritStrategy(item.label); setCritStrategyOpen(false); }}
                    />
                  </div>
                )}
              </div>
              <div className="na-row">
                <Input label="Met Definition" textArea placeholder="When is this met?" value={critMet} onChange={(e) => setCritMet(e.target.value)} style={{ minHeight: 80 }} />
                <Input label="Not Met Definition" textArea placeholder="When is this not met?" value={critNotMet} onChange={(e) => setCritNotMet(e.target.value)} style={{ minHeight: 80 }} />
              </div>
              <div className="input-field">
                <label className="input-label">Weight</label>
                <div className="na-weight-wrap">
                  <input className="na-weight-value" type="number" step="0.1" min="0" placeholder="1.2" value={critWeight} onChange={(e) => setCritWeight(e.target.value)} />
                  <div className="na-weight-arrows">
                    <button type="button" className="na-weight-arrow" onClick={() => setCritWeight((v) => (Math.max(0.1, parseFloat(v || 0) - 0.1)).toFixed(1))}>
                      <img src="/icons/16px/ChevronLeft.svg" width={16} height={16} alt="" style={iconFilter} />
                    </button>
                    <button type="button" className="na-weight-arrow" onClick={() => setCritWeight((v) => (parseFloat(v || 0) + 0.1).toFixed(1))}>
                      <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" style={iconFilter} />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="na-toggle-row">
                  <Toggle on={critViolation} onChange={setCritViolation} />
                  <span className="na-toggle-label">Critical Violation</span>
                </div>
                <div className="na-toggle-row">
                  <Toggle on={critZeroIfViolated} onChange={setCritZeroIfViolated} />
                  <span className="na-toggle-label">Set overall evaluation to 0 if violated</span>
                </div>
              </div>
            </div>
            <div className="na-modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setCritModalOpen(null)}>
                <span className="btn-label">Cancel</span>
              </button>
              <button
                className="btn btn-accent btn-sm"
                onClick={() => {
                  if (critName.trim()) {
                    setCategories((prev) => prev.map((cat, j) => j === critModalOpen
                      ? { ...cat, criteria: [...(cat.criteria || []), { name: critName, description: critDesc, strategy: critStrategy, met: critMet, notMet: critNotMet, weight: critWeight }] }
                      : cat
                    ));
                    setCritModalOpen(null);
                  }
                }}
              >
                <span className="btn-label">Add criteria</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add permission modal */}
      {permModalOpen && (
        <div className="na-modal-overlay" onClick={() => setPermModalOpen(false)}>
          <div className="na-modal" onClick={(e) => e.stopPropagation()}>
            <div className="na-modal-header">
              <span className="na-modal-title">{editingPermIndex !== null ? "Edit permission" : "Add permission"}</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setPermModalOpen(false)}>
                <img src="/icons/16px/Cross.svg" width={16} height={16} alt="" style={iconFilter} />
              </button>
            </div>
            <div className="na-modal-body">
              <div ref={permUserRef} style={{ position: "relative" }}>
                <Input
                  label="Select users"
                  placeholder="Select users..."
                  value={permUsers.join(", ")}
                  readOnly
                  onMouseDown={(e) => { e.stopPropagation(); setPermUserOpen((v) => !v); }}
                  button={<button className="btn btn-ghost btn-sm btn-icon" type="button"><img src={`/icons/16px/${permUserOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" style={iconFilter} /></button>}
                />
                {permUserOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 200 }}>
                    <Popover
                      content="users"
                      placeholder="Search agents..."
                      checkbox
                      selectedLabels={permUsers}
                      sections={(() => {
                        const existingNames = permissions.filter((_, j) => j !== editingPermIndex).map((p) => p.name);
                        const available = checkedAgents.filter((a) => !existingNames.includes(a.name));
                        return available.length > 0 ? [available.map((a) => ({ label: a.name, avatar: a.avatar }))] : [];
                      })()}
                      emptyMessage="No agents found"
                      onItemClick={(item) => {
                        setPermUsers((prev) =>
                          prev.includes(item.label)
                            ? prev.filter((n) => n !== item.label)
                            : [...prev, item.label]
                        );
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="na-toggle-row">
                <Toggle on={permEdit} onChange={setPermEdit} />
                <span className="na-toggle-label">Can edit agent settings</span>
              </div>
            </div>
            <div className="na-modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setPermModalOpen(false)}>
                <span className="btn-label">Cancel</span>
              </button>
              <button className="btn btn-accent btn-sm" onClick={() => {
                if (permUsers.length > 0) {
                  if (editingPermIndex !== null) {
                    const agent = settingsAgents.find((a) => a.name === permUsers[0]);
                    setPermissions((prev) => prev.map((p, j) => j === editingPermIndex ? { name: permUsers[0], avatar: agent?.avatar || "/avatars/Avatar 01.png", canEdit: permEdit } : p));
                  } else {
                    const newPerms = permUsers.map((name) => {
                      const agent = settingsAgents.find((a) => a.name === name);
                      return { name, avatar: agent?.avatar || "/avatars/Avatar 01.png", canEdit: permEdit };
                    });
                    setPermissions((prev) => [...prev, ...newPerms]);
                  }
                }
                setEditingPermIndex(null);
                setPermModalOpen(false);
              }}>
                <span className="btn-label">{editingPermIndex !== null ? "Save permission" : "Add permission"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
