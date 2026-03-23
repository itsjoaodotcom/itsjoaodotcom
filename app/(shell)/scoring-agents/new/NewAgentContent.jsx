"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Popover from "../../../../components/Popover";

const iconFilter = { filter: "brightness(0) invert(0.53)" };
const iconTab = { filter: "brightness(0) invert(0.5)", width: 16, height: 16 };
const iconTabActive = { filter: "brightness(0)", width: 16, height: 16 };

const tabs = [
  { key: "details",   label: "Agent Details",   icon: "/icons/16px/User.svg" },
  { key: "knowledge", label: "Knowledge Base",   icon: "/icons/16px/Documentation.svg" },
  { key: "scoring",   label: "Scoring Matrix",   icon: "/icons/16px/Grid.svg" },
  { key: "settings",  label: "Settings",         icon: "/icons/16px/Settings.svg" },
];

export default function NewAgentContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [agentName, setAgentName] = useState("");
  const [channel, setChannel] = useState("Choose a channel");
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
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const [scoringModel, setScoringModel] = useState("Weighted (Points per criterion)");
  const [modelOpen, setModelOpen] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    if (!channelOpen && !freqOpen && !langOpen && !modelOpen) return;
    function onDown(e) {
      if (channelOpen && channelRef.current && !channelRef.current.contains(e.target)) setChannelOpen(false);
      if (freqOpen && freqRef.current && !freqRef.current.contains(e.target)) setFreqOpen(false);
      if (langOpen && langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (modelOpen && modelRef.current && !modelRef.current.contains(e.target)) setModelOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [channelOpen, freqOpen, langOpen, modelOpen]);

  const channelOptions = ["Chat", "Email", "Calls", "Social Media"];
  const frequencyOptions = ["All Conversations", "Random 25%", "Random 50%", "Flagged Only"];
  const languageOptions = ["English", "Arabic", "French", "Spanish"];
  const scoringModelOptions = ["Binary (Pass/Fail per dimension)", "Weighted (Points per criterion)", "Hybrid (Points + Compliance)"];

  return (
    <div className="sa-content na-content">
      {/* Breadcrumb */}
      <div className="sa-breadcrumb">
        <Link href="/scoring-agents" className="sad-breadcrumb-link">Agents QA</Link>
        <img src="/icons/16px/Slash.svg" width={16} height={16} alt="" style={iconFilter} />
        <span className="sad-breadcrumb-current">New Agent QA</span>
      </div>

      <div className="na-body">
        {/* Header */}
        <div className="na-header">
          <button className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => router.push("/scoring-agents")}>
            <img src="/icons/16px/ChevronLeft.svg" width={16} height={16} alt="" style={iconFilter} />
            <span className="btn-label">Back</span>
          </button>

          <div>
            <h1 className="na-title">Add Agent QA</h1>
            <p className="na-subtitle">Configure a new QA agent with evaluation settings</p>
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
                <div className="na-field">
                  <label className="na-field-label">Agent name</label>
                  <input className="na-input" type="text" placeholder="Enter agent name" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
                </div>

                <div className="na-row">
                  <div className="na-field" ref={channelRef} style={{ position: "relative" }}>
                    <label className="na-field-label">Channel</label>
                    <div className="na-select-wrap" onClick={() => setChannelOpen((v) => !v)} style={{ cursor: "pointer" }}>
                      <span className="na-select-value">{channel}</span>
                      <button className="na-select-btn" type="button">
                        <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" style={iconFilter} />
                      </button>
                    </div>
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
                  <div className="na-field" ref={freqRef} style={{ position: "relative" }}>
                    <label className="na-field-label">Evaluation frequency</label>
                    <div className="na-select-wrap" onClick={() => setFreqOpen((v) => !v)} style={{ cursor: "pointer" }}>
                      <span className="na-select-value">{frequency}</span>
                      <button className="na-select-btn" type="button">
                        <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" style={iconFilter} />
                      </button>
                    </div>
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

                <div className="na-field">
                  <label className="na-field-label">Description</label>
                  <textarea className="na-textarea" placeholder="Describe the purpose and scope of this QA Agent" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="na-toggle-row">
                  <button className={`na-toggle ${autoEval ? "on" : "off"}`} onClick={() => setAutoEval(!autoEval)}>
                    <div className="na-toggle-knob" />
                  </button>
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
                      <button
                        className={`na-toggle ${isOn ? "on" : "off"}`}
                        onClick={() => {
                          if (col.key === "all") {
                            const allOn = kbCollections.slice(1).every((c) => kbToggles[c.key]);
                            const next = {};
                            if (!allOn) kbCollections.slice(1).forEach((c) => { next[c.key] = true; });
                            setKbToggles(next);
                          } else {
                            setKbToggles((prev) => ({ ...prev, [col.key]: !prev[col.key] }));
                          }
                        }}
                      >
                        <div className="na-toggle-knob" />
                      </button>
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
                  <div className="na-field">
                    <label className="na-field-label">Scorecard name</label>
                    <input className="na-input" type="text" placeholder="e.g. Tier Chat  Quality" />
                  </div>
                  <div className="na-row" style={{ gap: 12 }}>
                    <div className="na-field" ref={modelRef} style={{ position: "relative" }}>
                      <label className="na-field-label">Scoring model</label>
                      <div className="na-select-wrap" onClick={() => setModelOpen((v) => !v)} style={{ cursor: "pointer" }}>
                        <span className="na-select-value">{scoringModel}</span>
                        <button className="na-select-btn" type="button">
                          <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" style={iconFilter} />
                        </button>
                      </div>
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
                    <div className="na-field" ref={langRef} style={{ position: "relative" }}>
                      <label className="na-field-label">Output language</label>
                      <div className="na-select-wrap" onClick={() => setLangOpen((v) => !v)} style={{ cursor: "pointer" }}>
                        <span className="na-select-value">{language}</span>
                        <button className="na-select-btn" type="button">
                          <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" style={iconFilter} />
                        </button>
                      </div>
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
              <div className="na-section-header">Categories &amp; Criteria</div>
              <div className="na-section-body">
                <div className="na-section-card" style={{ alignItems: "center", justifyContent: "center", padding: "24px 14px" }}>
                  <div className="na-empty-state">
                    <p className="na-empty-text">No categories added yet</p>
                    <button className="btn btn-accent btn-sm">
                      <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) invert(1)" }} />
                      <span className="btn-label">Add category</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <div className="na-section">
            <div className="na-section-header">Settings</div>
            <div className="na-section-body">
              <div className="na-section-card">
                <p className="na-subtitle">Configure notification preferences, scheduling, and advanced agent settings.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions bar */}
      <div className="na-actions">
        <button className="btn btn-ghost btn-sm">
          <img src="/icons/16px/NoteEdit.svg" width={16} height={16} alt="" style={iconFilter} />
          <span className="btn-label">Save as a draft</span>
        </button>
        <div className="na-actions-divider" />
        <div className="na-actions-right">
          <button className="btn btn-secondary btn-sm" onClick={() => router.push("/scoring-agents")}>
            <span className="btn-label">Cancel</span>
          </button>
          <button className="btn btn-accent btn-sm">
            <span className="btn-label">Save and active</span>
          </button>
        </div>
      </div>
    </div>
  );
}
