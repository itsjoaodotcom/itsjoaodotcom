"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";

const ShellContext = createContext();

const CHANNEL_MAP = { Chat: "LiveChat", Calls: "AnswerCall", "Social Media": "Globe", Email: "Email" };

const DEFAULT_AGENTS = [
  { id: "a1",  name: "Chat Quality Monitor",      channel: "LiveChat",    channelLabel: "Chat",         team: "Chat",             score: 96, evaluations: 142, trend: 4.2, trendUp: true,  status: "Active", lastRun: "15/03/2026" },
  { id: "a2",  name: "Call Center QA Analyst",    channel: "AnswerCall",  channelLabel: "Calls",        team: "Call Center",      score: 94, evaluations: 128, trend: 2.8, trendUp: true,  status: "Active", lastRun: "12/03/2026" },
  { id: "a3",  name: "Social Media QA Agent",     channel: "Globe",       channelLabel: "Social Media", team: "Advanced Support", score: 91, evaluations: 98,  trend: 1.5, trendUp: true,  status: "Active", lastRun: "05/03/2026" },
  { id: "a4",  name: "Chat Compliance Auditor",   channel: "Email",       channelLabel: "Email",        team: "Social Media",     score: 89, evaluations: 86,  trend: 3.1, trendUp: true,  status: "Draft",  lastRun: "01/03/2026" },
  { id: "a5",  name: "Chat Escalation Reviewer",  channel: "LiveChat",    channelLabel: "Chat",         team: "Chat",             score: 88, evaluations: 74,  trend: 0.8, trendUp: true,  status: "Active", lastRun: "22/02/2026" },
  { id: "a6",  name: "Call Scoring Analyst",      channel: "AnswerCall",  channelLabel: "Calls",        team: "Social Media",     score: 85, evaluations: 112, trend: 1.2, trendUp: false, status: "Draft",  lastRun: "15/02/2026" },
  { id: "a7",  name: "Email SLA Monitor",         channel: "Email",       channelLabel: "Email",        team: "Call Center",      score: 82, evaluations: 95,  trend: 2,   trendUp: true,  status: "Active", lastRun: "05/01/2026" },
  { id: "a8",  name: "Social Engagement Auditor", channel: "Globe",       channelLabel: "Social Media", team: "Advanced Support", score: 77, evaluations: 64,  trend: 3.5, trendUp: false, status: "Active", lastRun: "15/12/2025" },
  { id: "a9",  name: "Chat CSAT Tracker",         channel: "LiveChat",    channelLabel: "Chat",         team: "Chat",             score: 68, evaluations: 58,  trend: 5.2, trendUp: false, status: "Active", lastRun: "20/12/2025" },
  { id: "a10", name: "Email Response Evaluator",  channel: "Email",       channelLabel: "Email",        team: "Chat",             score: 63, evaluations: 42,  trend: 8.1, trendUp: false, status: "Active", lastRun: "10/11/2025" },
  { id: "a11", name: "Compliance Risk Monitor",   channel: "LiveChat",    channelLabel: "Chat",         team: "Advanced Support", score: 96, evaluations: 142, trend: 4.2, trendUp: true,  status: "Active", lastRun: "14/03/2026" },
  { id: "a12", name: "Tone & Empathy Auditor",    channel: "Globe",       channelLabel: "Social Media", team: "Call Center",      score: 94, evaluations: 128, trend: 2.8, trendUp: true,  status: "Active", lastRun: "25/02/2026" },
  { id: "a13", name: "Knowledge Base Validator",  channel: "AnswerCall",  channelLabel: "Calls",        team: "Social Media",     score: 91, evaluations: 98,  trend: 1.5, trendUp: true,  status: "Active", lastRun: "18/01/2026" },
];

function generateId() {
  return "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function todayFormatted() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function ShellProvider({ children }) {
  const [activeView, setActiveView] = useState("assigned");
  const hasLoadedRef = useRef(false);
  const [agents, setAgents] = useState(DEFAULT_AGENTS);

  const addAgent = useCallback((formData) => {
    const channelLabel = formData.channel || "Chat";
    const channel = CHANNEL_MAP[channelLabel] || "LiveChat";
    const status = formData.isDraft ? "Draft" : "Active";
    const newAgent = {
      id: generateId(),
      name: formData.agentName || "Untitled Agent",
      channel,
      channelLabel,
      team: "Chat",
      score: null,
      evaluations: 0,
      trend: 0,
      trendUp: true,
      status,
      lastRun: todayFormatted(),
      /* store full form for editing */
      _form: formData,
    };
    setAgents((prev) => [newAgent, ...prev]);
    return newAgent;
  }, []);

  const updateAgent = useCallback((id, formData) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const channelLabel = formData.channel || a.channelLabel;
        const channel = CHANNEL_MAP[channelLabel] || a.channel;
        const status = formData.isDraft ? "Draft" : "Active";
        return { ...a, name: formData.agentName || a.name, channel, channelLabel, status, _form: formData };
      })
    );
  }, []);

  const deleteAgent = useCallback((id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getAgentBySlug = useCallback(
    (slug) => agents.find((a) => a.name.toLowerCase().replace(/\s+/g, "-") === slug) || null,
    [agents]
  );

  const getAgentById = useCallback(
    (id) => agents.find((a) => a.id === id) || null,
    [agents]
  );

  return (
    <ShellContext.Provider value={{ activeView, setActiveView, hasLoadedRef, agents, addAgent, updateAgent, deleteAgent, getAgentBySlug, getAgentById }}>
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  return useContext(ShellContext);
}
