"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Tag from "../../../components/Tag";
import Toggle from "../../../components/Toggle";

const iconFilter = { filter: "brightness(0) invert(0.53)" };

/* ─── Hex color → Tag color mapping ─── */
const HEX_TAG_MAP = {
  "#22c55e": "green", "#87888a": "grey", "#4061d8": "blue",
  "#7c3aed": "purple", "#ef4444": "red", "#f59e0b": "orange",
};
function hexToTagColor(hex) {
  return HEX_TAG_MAP[hex?.toLowerCase()] || "grey";
}

const STATUS_LABELS = { draft: "Draft", published: "Published", archived: "Archived" };
const PRIORITY_LABELS = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };

/* ─── Details panel sub-components (same as inbox) ─── */

function DetailSection({ title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

  return (
    <div className={`det-section${!open ? " det-collapsed" : ""}`}>
      <div className="det-section-header">
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)}>
          <span className="btn-label">{title}</span>
          <img
            src={`/icons/16px/${open ? "ChevronBottom" : "ChevronRight"}.svg`}
            width={16} height={16} alt=""
            className="det-chevron"
            style={{ transition: "transform 0.2s ease" }}
          />
        </button>
      </div>
      <div
        className="det-section-content"
        ref={contentRef}
        style={{ height: open ? "auto" : 0, overflow: "hidden", transition: "height 0.25s ease" }}
      >
        <div className="det-section-inner">{children}</div>
      </div>
    </div>
  );
}

function DsRow({ label, value }) {
  return (
    <div className="ds-row">
      <div className="ds-label"><span className="ds-label-text">{label}</span></div>
      {value}
      <button className="btn btn-secondary btn-micro btn-icon ds-action-btn">
        <img src="/icons/12px/Edit.svg" width={12} height={12} alt="" />
      </button>
    </div>
  );
}

function DsText({ text }) {
  return <div className="ds-value"><span className="ds-value-inner">{text}</span></div>;
}

function DsEmpty({ icon, placeholder }) {
  return (
    <div className="ds-value">
      <img src={`/icons/16px/${icon}.svg`} width={16} height={16} alt="" />
      <span className="ds-value-inner ds-empty">{placeholder}</span>
    </div>
  );
}

function TagPills({ tags }) {
  if (!tags || tags.length === 0) return <DsEmpty icon="Plus" placeholder="Add tags" />;
  return (
    <div className="ds-value ds-value-tags">
      {tags.map((tag, i) => (
        <Tag key={i} color={hexToTagColor(tag.color)} label={tag.label} />
      ))}
    </div>
  );
}

function KbDetailsPanel() {
  return (
    <>
      <DetailSection title="Properties" defaultOpen>
        <DsRow label="Created" value={<DsText text="2 December" />} />
        <DsRow label="Updated" value={<DsText text="10 December" />} />
        <DsRow label="Status" value={<DsText text="Draft" />} />
        <DsRow label="Collection" value={
          <div className="ds-value ds-value-tags">
            <Tag color="purple" label="Revolut KB" />
          </div>
        } />
        <DsRow label="Source" value={
          <div className="ds-value ds-value-tags">
            <div className="kb-attachment">
              <div className="kb-attachment-content">
                <img src="/icons/files-pdf-sm.svg" width={16} height={16} alt="" className="kb-attachment-preview" />
                <div className="kb-attachment-details">
                  <span className="kb-attachment-name">pitch.pdf</span>
                  <span className="kb-attachment-size">2.0 MB</span>
                </div>
              </div>
              <div className="kb-attachment-action">
                <button className="btn btn-ghost btn-micro btn-icon">
                  <img src="/icons/12px/Download.svg" width={12} height={12} alt="" />
                </button>
              </div>
            </div>
          </div>
        } />
        <DsRow label="Criticatily" value={
          <div className="ds-value" style={{ gap: 4 }}>
            <img src="/icons/16px/Minor.svg" width={16} height={16} alt="" style={iconFilter} />
            <span className="ds-value-inner">Minor</span>
          </div>
        } />
        <DsRow label="Confidence" value={
          <div className="ds-value" style={{ gap: 4 }}>
            <img src="/icons/16px/High.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(422%) hue-rotate(92deg) brightness(96%) contrast(92%)" }} />
            <span className="ds-value-inner">High</span>
          </div>
        } />
        <DsRow label="Used" value={<DsText text="45 times" />} />
      </DetailSection>
      <DetailSection title="Linked ticket references" defaultOpen>
        <DsRow label="Positive" value={
          <div className="ds-value ds-value-tags">
            <Tag color="grey" label="Ticket-123" iconLeft={false} />
            <Tag color="grey" label="Ticket-838" iconLeft={false} />
          </div>
        } />
        <DsRow label="Negative" value={
          <div className="ds-value ds-value-tags">
            <Tag color="grey" label="Ticket-838" iconLeft={false} />
            <Tag color="grey" label="Ticket-123" iconLeft={false} />
          </div>
        } />
      </DetailSection>
    </>
  );
}

const ARTICLE = {
  title: "Wallet Security Authentication",
  status: "Draft",
  collection: "Revolut KB",
  criticality: "Minor Criticality",
  confidence: "High Confidence",
  summary:
    "We blocked your card successfully, you can request a new card on your app. Just before we finish, I've sent you an offer for our Gold Credit Card—it includes extra fraud protection and emergency blocking. You'll find all the details in your email, and if you have any questions, feel free to reach out anytime.",
  body: [
    "When customers cannot access their online banking accounts, it creates immediate stress and concern about account security.",
    "When customers cannot access their online banking accounts, it creates immediate stress and concern about account security. This guide provides a systematic approach to resolving the most common account access problems.",
    "It ensures you maintain security protocols while delivering excellent customer service. The first step in addressing account access issues is to verify the customer's identity through our standard authentication process. Ask for the customer's full name, date of birth, and the last four digits of their account number. Once identity is confirmed, you can proceed with troubleshooting. Never bypass security protocols, even when customers express urgency or frustration.",
    "Password reset requests are the most common account access issue. When a customer has forgotten their password, guide them through the self-service password reset process available on our website and mobile app. The customer should click \"Forgot Password\" on the login page and follow the prompts to receive a verification code via email or SMS. If the customer cannot access their registered email or phone number, you will need to verify their identity through additional security questions before manually initiating a password reset.",
  ],
};

const CONFLICTS = [
  { label: "Account security guidelines v3.2", color: "var(--utilities-content-content-blue)" },
  { label: "Two-factor authentication protocol", color: "var(--utilities-content-content-orange)" },
];

const DUPLICATES = [
  { label: "Customer Service Documentation Standards" },
  { label: "Browser compatibility guide" },
  { label: "Account security guidelines v3.2" },
  { label: "Account security guidelines v3.2" },
];

function CopilotEmptySvg() {
  return (
    <svg width="236" height="173" viewBox="0 0 236 173" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34 10C34 8.9 34.9 8 36 8H80C81.1 8 82 8.9 82 10S81.1 12 80 12H36C34.9 12 34 11.1 34 10Z" fill="var(--illus-skeleton)" />
      <path d="M34 26C34 24.9 34.9 24 36 24S38 24.9 38 26 37.1 28 36 28 34 27.1 34 26Z" fill="var(--illus-skeleton)" />
      <path d="M42 26C42 24.9 42.9 24 44 24H173C174.1 24 175 24.9 175 26S174.1 28 173 28H44C42.9 28 42 27.1 42 26Z" fill="var(--illus-skeleton)" />
      <path d="M36 30V36" stroke="var(--illus-skeleton)" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M34 40C34 38.9 34.9 38 36 38S38 38.9 38 40 37.1 42 36 42 34 41.1 34 40Z" fill="var(--illus-skeleton)" />
      <path d="M42 40C42 38.9 42.9 38 44 38H133C134.1 38 135 38.9 135 40S134.1 42 133 42H44C42.9 42 42 41.1 42 40Z" fill="var(--illus-skeleton)" />
      <path d="M36 44V50" stroke="var(--illus-skeleton)" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M34 54C34 52.9 34.9 52 36 52S38 52.9 38 54 37.1 56 36 56 34 55.1 34 54Z" fill="var(--illus-skeleton)" />
      <path d="M42 54C42 52.9 42.9 52 44 52H153C154.1 52 155 52.9 155 54S154.1 56 153 56H44C42.9 56 42 55.1 42 54Z" fill="var(--illus-skeleton)" />
      <g filter="url(#cf0kb)">
        <path d="M26 80C26 75.58 29.58 72 34 72H202C206.42 72 210 75.58 210 80V156C210 160.42 206.42 164 202 164H34C29.58 164 26 160.42 26 156V80Z" fill="var(--illus-card-bg)" shapeRendering="crispEdges" />
        <path d="M34 72.5H202C206.14 72.5 209.5 75.86 209.5 80V156C209.5 160.14 206.14 163.5 202 163.5H34C29.86 163.5 26.5 160.14 26.5 156V80C26.5 75.86 29.86 72.5 34 72.5Z" stroke="var(--illus-border)" shapeRendering="crispEdges" />
        <path d="M34 83C34 81.34 35.34 80 37 80H104C105.66 80 107 81.34 107 83S105.66 86 104 86H37C35.34 86 34 84.66 34 83Z" fill="var(--illus-skeleton)" />
        <path d="M34 93C34 91.34 35.34 90 37 90H154C155.66 90 157 91.34 157 93S155.66 96 154 96H37C35.34 96 34 94.66 34 93Z" fill="var(--illus-skeleton)" />
        <g opacity="0.8">
          <path d="M34 106C34 104.9 34.9 104 36 104H200C201.1 104 202 104.9 202 106S201.1 108 200 108H36C34.9 108 34 107.1 34 106Z" fill="var(--illus-skeleton)" />
          <path d="M34 114C34 112.9 34.9 112 36 112H200C201.1 112 202 112.9 202 114S201.1 116 200 116H36C34.9 116 34 115.1 34 114Z" fill="var(--illus-skeleton)" />
          <path d="M34 122C34 120.9 34.9 120 36 120H164C165.1 120 166 120.9 166 122S165.1 124 164 124H36C34.9 124 34 123.1 34 122Z" fill="var(--illus-skeleton)" />
        </g>
        <path d="M27 132H209" stroke="var(--illus-border)" />
        <path d="M154 142C154 139.79 155.79 138 158 138H200C202.21 138 204 139.79 204 142V154C204 156.21 202.21 158 200 158H158C155.79 158 154 156.21 154 154V142Z" fill="var(--illus-dark-surface)" />
      </g>
      <defs>
        <filter id="cf0kb" x="20" y="69" width="196" height="104" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a" /><feOffset dy="3" /><feGaussianBlur stdDeviation="3" /><feComposite in2="a" operator="out" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" /><feBlend in2="bg" result="s" /><feBlend in="SourceGraphic" in2="s" />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Copilot sub-components (same as inbox) ─── */

function AiBlock({ aiReply, aiMessage, aiReasoning, onRegenerate }) {
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  return (
    <div className="ai-block">
      <div className="ai-reasoning" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => setReasoningOpen(!reasoningOpen)}>
            <span className="btn-label">Reasoning</span>
            <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" style={{ transition: "transform 0.2s ease", transform: reasoningOpen ? "rotate(90deg)" : "" }} />
          </button>
        </div>
        {reasoningOpen && <div className="reasoning-message" style={{ display: "block" }} dangerouslySetInnerHTML={{ __html: aiReasoning }} />}
      </div>
      <div className="ai-message" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <p>{aiMessage}</p>
      </div>
      <div className="ai-cards" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
        <div className="card">
          <div className="card-header"><span className="card-label">Suggested reply</span></div>
          <div className="card-body"><p dangerouslySetInnerHTML={{ __html: aiReply }} /></div>
          <div className="card-divider"></div>
          <div className="card-actions">
            <div className="card-actions-left">
              <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsUp.svg" width={16} height={16} alt="" /></button>
              <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsDown.svg" width={16} height={16} alt="" /></button>
              <button className="btn btn-ghost btn-icon" onClick={onRegenerate}><img src="/icons/16px/Retry.svg" width={16} height={16} alt="" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkippedBlock({ onRetry }) {
  const [reasoningOpen, setReasoningOpen] = useState(false);
  return (
    <div className="ai-block">
      <div className="ai-reasoning">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => setReasoningOpen(!reasoningOpen)}>
            <span className="btn-label">Reasoning</span>
            <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" style={{ transition: "transform 0.2s ease", transform: reasoningOpen ? "rotate(90deg)" : "" }} />
          </button>
        </div>
        {reasoningOpen && <div className="reasoning-message"></div>}
      </div>
      <div className="ai-message"><p style={{ color: "var(--content-tertiary)" }}>Answer skipped</p></div>
      <div className="card-actions-left" style={{ paddingLeft: "2px" }}>
        <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsUp.svg" width={16} height={16} alt="" /></button>
        <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsDown.svg" width={16} height={16} alt="" /></button>
        <button className="btn btn-ghost btn-icon" onClick={onRetry}><img src="/icons/16px/Retry.svg" width={16} height={16} alt="" /></button>
      </div>
    </div>
  );
}

function ThinkingSection({ steps, readingKB, scrollContainerRef }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef(null);
  const imgRef = useRef(null);
  const hasTransformedRef = useRef(false);
  const intervalsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const scroll = scrollContainerRef?.current;
    if (!section || !scroll) return;
    const prevEl = section.previousElementSibling;
    const updateHeight = () => {
      if (!scroll.contains(section)) return;
      const h = prevEl ? Math.max(0, scroll.clientHeight - prevEl.offsetHeight - 58) : scroll.clientHeight;
      section.style.height = h + "px";
    };
    updateHeight();
    const target = prevEl ? prevEl.offsetTop - 18 : 0;
    const start = scroll.scrollTop;
    const dist = target - start;
    if (Math.abs(dist) > 1) {
      const dur = 180;
      const t0 = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => { const p = Math.min((now - t0) / dur, 1); scroll.scrollTop = start + dist * ease(p); if (p < 1) rafId = requestAnimationFrame(tick); };
      var rafId = requestAnimationFrame(tick);
    }
    let resizeTimer;
    const observer = new ResizeObserver(() => { updateHeight(); clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { scroll.scrollTop = prevEl ? prevEl.offsetTop - 18 : 0; }, 50); });
    observer.observe(scroll);
    return () => { observer.disconnect(); clearTimeout(resizeTimer); cancelAnimationFrame(rafId); };
  }, []);

  useEffect(() => {
    if (!readingKB || hasTransformedRef.current) return;
    hasTransformedRef.current = true;
    const timer = setTimeout(() => {
      const textSpan = textRef.current; const dots = dotsRef.current; const img = imgRef.current;
      if (!textSpan || !dots || !img) return;
      dots.style.transition = "opacity 0.2s"; dots.style.opacity = "0";
      let currentText = textSpan.textContent; const newText = "Reading KB";
      const deleteInterval = setInterval(() => {
        if (currentText.length > 0) { currentText = currentText.slice(0, -1); textSpan.textContent = currentText; }
        else { clearInterval(deleteInterval); img.src = "/icons/16px/Knowledge.svg"; let typeIdx = 0;
          const typeInterval = setInterval(() => { if (typeIdx < newText.length) { textSpan.textContent += newText[typeIdx++]; } else { clearInterval(typeInterval); dots.style.opacity = "1"; } }, 50);
          intervalsRef.current.push(typeInterval); }
      }, 40);
      intervalsRef.current.push(deleteInterval);
    }, 700);
    return () => { clearTimeout(timer); intervalsRef.current.forEach(clearInterval); intervalsRef.current = []; };
  }, [readingKB]);

  return (
    <div className="thinking-section" ref={sectionRef}>
      <div className="thinking-label">
        <img ref={imgRef} src="/icons/16px/Thinking.svg" width={14} height={14} alt="" />
        <span className="thinking-text" ref={textRef}>Thinking</span>
        <span className="thinking-dots" ref={dotsRef}><span>.</span><span>.</span><span>.</span></span>
      </div>
      <div className="thinking-steps">
        {steps.map((step, i) => (
          <div key={i}>
            {i > 0 && <div className="thinking-connector"></div>}
            <div className="thinking-step"><div className="thinking-step-icon"></div><span className="thinking-step-text">{step}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CopilotSpacer({ scrollContainerRef }) {
  const spacerRef = useRef(null);
  useEffect(() => {
    const spacer = spacerRef.current; const scroll = scrollContainerRef?.current;
    if (!spacer || !scroll) return;
    const aiBlock = spacer.previousElementSibling; const userMsg = aiBlock?.previousElementSibling;
    const updateHeight = () => { if (!userMsg || !aiBlock) { spacer.style.height = "0"; return; } spacer.style.height = Math.max(0, scroll.clientHeight - userMsg.offsetHeight - aiBlock.offsetHeight - 78) + "px"; };
    updateHeight(); const timer = setTimeout(updateHeight, 600);
    const observer = new ResizeObserver(updateHeight); observer.observe(scroll);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [scrollContainerRef]);
  return <div className="copilot-ai-spacer" ref={spacerRef} style={{ flexShrink: 0 }} />;
}

/* ─── Copilot data ─── */
const thinkingSteps = ["Generating a ticket summary", "Drafting reply", "Checking customer history", "Preparing response"];
const aiReplies = [
  "Thank you for reaching out. I understand your concern and I'm here to help you resolve this as quickly as possible.",
  "I appreciate your patience. Based on the information provided, I'll be able to assist you effectively.",
  "Thank you for contacting us. I've reviewed the details and I'm ready to provide you with the best solution.",
];
const aiMessages = [
  "Recommend the Gold Credit Card — better fraud protection and emergency blocking.",
  "Customer has 3 open tickets this month — consider escalating to an account specialist.",
  "Offer the Premium plan upgrade — usage patterns suggest they'd benefit from higher limits.",
];
const aiReasonings = [
  `<p>The customer is asking about account security. Based on the knowledge base article, the recommended approach is to verify identity first.</p><p>Here's a summary:</p><ul><li>Verify customer identity</li><li>Check recent account activity</li><li>Provide security recommendations</li></ul>`,
  `<p>The customer has multiple open tickets. Analysis shows a pattern of billing-related concerns that may benefit from specialist attention.</p>`,
  `<p>Usage analysis indicates the customer would benefit from upgraded limits. The Premium plan offers 3x the current transaction limits.</p>`,
];

export default function KnowledgeBaseContent() {
  const [activeTab, setActiveTab] = useState("conflicts");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const copilotEditableRef = useRef(null);
  const copilotPanelRef = useRef(null);
  const resizeZoneRef = useRef(null);
  const savedCopilotWidthRef = useRef("");
  const copilotScrollRef = useRef(null);
  const aiReplyIndexRef = useRef(0);
  const thinkingTimerRef = useRef(null);

  /* ─── Copilot state ─── */
  const [copilotItems, setCopilotItems] = useState([]);
  const [copilotThinking, setCopilotThinking] = useState(false);
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);
  const [copilotMultiline, setCopilotMultiline] = useState(false);
  const [copilotBackToBottom, setCopilotBackToBottom] = useState(false);

  const updateCopilotBackToBottom = useCallback(() => {
    const el = copilotScrollRef.current;
    if (!el) return;
    setCopilotBackToBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 40);
  }, []);

  /* ─── Stop copilot thinking ─── */
  const stopCopilotThinking = useCallback(() => {
    clearTimeout(thinkingTimerRef.current);
    setCopilotItems((prev) => [...prev.filter((item) => item.type !== "thinking"), { type: "skipped" }]);
    setCopilotThinking(false);
    setSuggestionsHidden(false);
  }, []);

  /* ─── Copilot thinking flow ─── */
  const startCopilotThinkingFlow = useCallback(() => {
    if (copilotThinking) return;
    setCopilotThinking(true);
    setSuggestionsHidden(true);
    setCopilotItems((prev) => {
      if (prev.some((item) => item.type === "thinking")) return prev;
      return [...prev, { type: "thinking", steps: [], readingKB: false }];
    });

    let stepIdx = 0;
    const steps = [];
    const addStep = () => {
      steps.push(thinkingSteps[stepIdx]);
      const thinkingItem = { type: "thinking", steps: [...steps], readingKB: steps.length >= 3 };
      setCopilotItems((prev) => [...prev.filter((item) => item.type !== "thinking"), thinkingItem]);
      stepIdx++;
      if (stepIdx < thinkingSteps.length) {
        thinkingTimerRef.current = setTimeout(addStep, 4000);
      } else {
        thinkingTimerRef.current = setTimeout(() => {
          const idx = aiReplyIndexRef.current % aiReplies.length;
          aiReplyIndexRef.current++;
          const aiItem = { type: "ai", aiReply: aiReplies[idx], aiMessage: aiMessages[idx], aiReasoning: aiReasonings[idx] };
          setCopilotItems((prev) => [...prev.filter((item) => item.type !== "thinking"), aiItem]);
          setCopilotThinking(false);
          setSuggestionsHidden(false);
        }, 4000);
      }
    };
    thinkingTimerRef.current = setTimeout(addStep, 4000);
  }, [copilotThinking]);

  /* ─── Send copilot message ─── */
  const sendCopilotMessage = useCallback(() => {
    if (copilotThinking) { stopCopilotThinking(); return; }
    const el = copilotEditableRef.current;
    if (!el) return;
    const text = el.textContent.trim();
    if (!text) {
      const input = el.closest(".copilot-input");
      if (input) { input.classList.remove("is-shake"); void input.offsetWidth; input.classList.add("is-shake"); }
      return;
    }
    el.innerHTML = "";
    setCopilotMultiline(false);
    setCopilotItems((prev) => [...prev, { type: "user", text }, { type: "thinking", steps: [], readingKB: false }]);
    setSuggestionsHidden(true);
    startCopilotThinkingFlow();
  }, [copilotThinking, stopCopilotThinking, startCopilotThinkingFlow]);

  /* ─── Text selection toolbar ─── */
  const [toolbar, setToolbar] = useState(null); // { x, y }
  const articleRef = useRef(null);

  useEffect(() => {
    const showToolbar = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { setToolbar(null); return; }
      const range = sel.getRangeAt(0);
      const container = articleRef.current;
      if (!container || !container.contains(range.commonAncestorContainer)) { setToolbar(null); return; }
      const rect = range.getBoundingClientRect();
      const scrollEl = container.closest(".kb-article-scroll");
      const scrollRect = scrollEl?.getBoundingClientRect();
      if (!scrollRect) return;
      setToolbar({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
      updateFormatState();
    };
    const hideOnCollapse = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) setToolbar(null);
    };
    document.addEventListener("mouseup", showToolbar);
    document.addEventListener("selectionchange", hideOnCollapse);
    return () => {
      document.removeEventListener("mouseup", showToolbar);
      document.removeEventListener("selectionchange", hideOnCollapse);
    };
  }, []);

  const [formatState, setFormatState] = useState({});

  const updateFormatState = useCallback(() => {
    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      underline: document.queryCommandState("underline"),
    });
  }, []);

  const execCmd = (cmd) => {
    document.execCommand(cmd, false, null);
    updateFormatState();
  };

  /* ─── Table editing ─── */
  const [activeTable, setActiveTable] = useState(null);
  const [tableMenuPos, setTableMenuPos] = useState(null);
  const [tablePopover, setTablePopover] = useState(null); // { type, pos: {x,y}, rowIdx? }
  const [tableHoverEdge, setTableHoverEdge] = useState(null); // "right" | "bottom" | null

  const openTablePopover = useCallback((e, type, rowIdx) => {
    const btnRect = e.currentTarget.getBoundingClientRect();
    setTablePopover((prev) => prev?.type === type ? null : { type, pos: { x: btnRect.right + 4, y: btnRect.top }, rowIdx });
  }, []);

  // Detect hover on table and table edges
  useEffect(() => {
    const onMouseMove = (e) => {
      const body = bodyRef.current;
      if (!body) return;

      // Find table under mouse
      const table = e.target.closest?.("table");
      const hoveredTable = table && body.contains(table) ? table : null;

      if (hoveredTable) {
        if (hoveredTable !== activeTable) {
          setActiveTable(hoveredTable);
          setTableMenuPos(true);
        }
        const rect = hoveredTable.getBoundingClientRect();
        const threshold = 30;
        const nearRight = e.clientX >= rect.right - 8 && e.clientX <= rect.right + threshold && e.clientY >= rect.top && e.clientY <= rect.bottom;
        const nearBottom = e.clientY >= rect.bottom - 8 && e.clientY <= rect.bottom + threshold && e.clientX >= rect.left && e.clientX <= rect.right;
        if (nearRight) setTableHoverEdge("right");
        else if (nearBottom) setTableHoverEdge("bottom");
        else setTableHoverEdge(null);
      } else if (e.target.closest(".kb-table-opt") || e.target.closest(".kb-table-popover")) {
        // Keep active when hovering buttons/popovers
      } else if (activeTable) {
        const rect = activeTable.getBoundingClientRect();
        const threshold = 30;
        const nearRight = e.clientX >= rect.right - 8 && e.clientX <= rect.right + threshold && e.clientY >= rect.top && e.clientY <= rect.bottom;
        const nearBottom = e.clientY >= rect.bottom - 8 && e.clientY <= rect.bottom + threshold && e.clientX >= rect.left && e.clientX <= rect.right;
        if (nearRight) setTableHoverEdge("right");
        else if (nearBottom) setTableHoverEdge("bottom");
        else {
          setTableHoverEdge(null);
          if (!tablePopover) {
            setActiveTable(null);
            setTableMenuPos(null);
          }
        }
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [activeTable, tablePopover]);

  const updateTableMenu = useCallback((tableEl) => {
    if (!tableEl) { setActiveTable(null); setTableMenuPos(null); return; }
    const scrollEl = tableEl.closest(".kb-article-scroll");
    if (!scrollEl) return;
    const tableRect = tableEl.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();
    setActiveTable(tableEl);
    setTableMenuPos({
      x: tableRect.left + tableRect.width / 2 - scrollRect.left,
      y: tableRect.top - scrollRect.top + scrollEl.scrollTop - 36,
    });
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const td = e.target.closest("td, th");
      if (td) {
        const table = td.closest("table");
        if (table && bodyRef.current?.contains(table)) {
          updateTableMenu(table);
          return;
        }
      }
      if (!e.target.closest(".kb-table-opt") && !e.target.closest(".kb-table-popover")) {
        setActiveTable(null);
        setTableMenuPos(null);
        setTablePopover(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [updateTableMenu]);

  const tableAddRow = useCallback(() => {
    if (!activeTable) return;
    const rows = activeTable.rows;
    const cols = rows[0]?.cells.length || 2;
    const newRow = activeTable.insertRow(-1);
    for (let i = 0; i < cols; i++) {
      const cell = newRow.insertCell(-1);
      cell.innerHTML = "<br>";
    }
    updateTableMenu(activeTable);
  }, [activeTable, updateTableMenu]);

  const tableAddCol = useCallback(() => {
    if (!activeTable) return;
    for (let i = 0; i < activeTable.rows.length; i++) {
      const cell = activeTable.rows[i].insertCell(-1);
      cell.innerHTML = "<br>";
    }
    updateTableMenu(activeTable);
  }, [activeTable, updateTableMenu]);

  const tableDeleteRow = useCallback(() => {
    if (!activeTable) return;
    const sel = window.getSelection();
    const td = sel?.anchorNode?.parentElement?.closest("td, th");
    if (!td) return;
    const row = td.parentElement;
    if (activeTable.rows.length <= 1) { activeTable.remove(); setActiveTable(null); setTableMenuPos(null); return; }
    row.remove();
    updateTableMenu(activeTable);
  }, [activeTable, updateTableMenu]);

  const tableDeleteCol = useCallback(() => {
    if (!activeTable) return;
    const sel = window.getSelection();
    const td = sel?.anchorNode?.parentElement?.closest("td, th");
    if (!td) return;
    const colIdx = td.cellIndex;
    if (activeTable.rows[0].cells.length <= 1) { activeTable.remove(); setActiveTable(null); setTableMenuPos(null); return; }
    for (let i = 0; i < activeTable.rows.length; i++) {
      activeTable.rows[i].deleteCell(colIdx);
    }
    updateTableMenu(activeTable);
  }, [activeTable, updateTableMenu]);

  const tableDelete = useCallback(() => {
    if (!activeTable) return;
    activeTable.remove();
    setActiveTable(null);
    setTableMenuPos(null);
  }, [activeTable]);

  /* ─── Table column resize (divider between columns) ─── */
  const tableResizeRef = useRef(null);

  useEffect(() => {
    const zone = tableResizeRef.current;
    if (!zone) return;
    let isResizing = false;
    let startX = 0;
    let table = null;

    const onMouseDown = (e) => {
      if (!e.target.closest(".kb-table-resize-zone")) return;
      table = activeTable;
      if (!table || !table.rows[0] || table.rows[0].cells.length < 2) return;
      isResizing = true;
      startX = e.clientX;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isResizing || !table) return;
      const tableRect = table.getBoundingClientRect();
      const pct = Math.min(0.85, Math.max(0.15, (e.clientX - tableRect.left) / tableRect.width));
      const cells = table.rows[0].cells;
      cells[0].style.width = (pct * 100) + "%";
      cells[1].style.width = ((1 - pct) * 100) + "%";
    };

    const onMouseUp = () => {
      if (!isResizing) return;
      isResizing = false;
      table = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeTable]);

  /* ─── Table multi-cell selection ─── */
  const [selectedCells, setSelectedCells] = useState([]);
  const anchorCellRef = useRef(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const onMouseDown = (e) => {
      const td = e.target.closest("td");
      if (!td || !body.contains(td)) { setSelectedCells([]); anchorCellRef.current = null; return; }

      if (e.shiftKey && anchorCellRef.current) {
        // Select range from anchor to this cell
        e.preventDefault();
        const table = td.closest("table");
        if (!table || !table.contains(anchorCellRef.current)) return;
        const cells = Array.from(table.querySelectorAll("td"));
        const anchorIdx = cells.indexOf(anchorCellRef.current);
        const targetIdx = cells.indexOf(td);
        const anchorRow = anchorCellRef.current.parentElement.rowIndex;
        const anchorCol = anchorCellRef.current.cellIndex;
        const targetRow = td.parentElement.rowIndex;
        const targetCol = td.cellIndex;
        const minRow = Math.min(anchorRow, targetRow);
        const maxRow = Math.max(anchorRow, targetRow);
        const minCol = Math.min(anchorCol, targetCol);
        const maxCol = Math.max(anchorCol, targetCol);

        const selected = [];
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            const cell = table.rows[r]?.cells[c];
            if (cell) selected.push(cell);
          }
        }
        setSelectedCells(selected);
      } else {
        anchorCellRef.current = td;
        setSelectedCells([td]);
      }
    };

    body.addEventListener("mousedown", onMouseDown);
    return () => body.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Apply/remove selected class (only highlight when multiple cells selected)
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.querySelectorAll("td.kb-cell-multi-selected").forEach((el) => el.classList.remove("kb-cell-multi-selected"));
    if (selectedCells.length > 1) {
      selectedCells.forEach((cell) => cell.classList.add("kb-cell-multi-selected"));
    }
  }, [selectedCells]);

  /* ─── Floating add-block button ─── */
  const [addBtnTop, setAddBtnTop] = useState(0);
  const [addBlockOpen, setAddBlockOpen] = useState(false);
  const [textPopoverOpen, setTextPopoverOpen] = useState(false);
  const bodyRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [addBtnVisible, setAddBtnVisible] = useState(false);
  const [activeBlockEl, setActiveBlockEl] = useState(null);

  useEffect(() => {
    const onSelectionChange = () => {
      const body = bodyRef.current;
      if (!body) return;
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      if (!body.contains(sel.anchorNode)) {
        setAddBtnVisible(false);
        return;
      }

      // Track active table cell
      const td = sel.anchorNode?.nodeType === 3 ? sel.anchorNode.parentElement?.closest("td") : sel.anchorNode?.closest?.("td");
      body.querySelectorAll("td.kb-cell-active").forEach((el) => el.classList.remove("kb-cell-active"));
      if (td && body.contains(td)) td.classList.add("kb-cell-active");

      // Find the block element (direct child of body) containing the caret
      let node = sel.anchorNode;
      while (node && node.parentNode !== body) node = node.parentNode;
      if (!node || node.parentNode !== body) return;

      const scrollEl = body.closest(".kb-article-scroll");
      if (!scrollEl) return;
      const scrollRect = scrollEl.getBoundingClientRect();
      const blockRect = node.getBoundingClientRect();

      const newTop = blockRect.top - scrollRect.top + scrollEl.scrollTop + (blockRect.height > 24 ? 0 : (blockRect.height - 24) / 2);
      setAddBtnTop(newTop);
      setAddBtnVisible(true);
      setActiveBlockEl(node);
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  /* ─── Auto-scroll on new copilot items ─── */
  useEffect(() => {
    const el = copilotScrollRef.current;
    if (!el || copilotItems.length === 0) return;
    const lastItem = copilotItems[copilotItems.length - 1];
    if (lastItem.type === "ai" || lastItem.type === "skipped") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [copilotItems]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const panel = copilotPanelRef.current;
      if (panel) {
        if (!prev) {
          savedCopilotWidthRef.current = panel.style.width;
          panel.style.width = "";
        } else {
          panel.style.width = savedCopilotWidthRef.current;
        }
      }
      return !prev;
    });
  }, []);

  /* ─── Copilot panel resize ─── */
  useEffect(() => {
    const resizeZone = resizeZoneRef.current;
    const panel = copilotPanelRef.current;
    if (!resizeZone || !panel) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    const onMouseDown = (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = panel.getBoundingClientRect().width;
      panel.style.transition = "none";
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(startWidth - (e.clientX - startX), 220), window.innerWidth * 0.7);
      panel.style.width = newWidth + "px";
    };
    const onMouseUp = () => {
      if (!isResizing) return;
      isResizing = false;
      panel.style.transition = "";
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    resizeZone.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      resizeZone.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="content">
      {/* Center: Article editor (reuses .dialog layout) */}
      <div className="dialog" style={{ paddingBottom: 0, background: "var(--surface-primary)" }}>
        {/* Breadcrumbs topbar (reuses .dialog-topbar) */}
        <div className={`dialog-topbar${sidebarCollapsed ? " copilot-closed" : ""}`}>
          <div className="dialog-title">
            <span className="dialog-name">Knowledge base</span>
            <img src="/icons/16px/Slash.svg" width={16} height={16} alt="" style={iconFilter} />
            <span style={{ fontSize: 14, letterSpacing: "-0.28px", color: "var(--content-tertiary)" }}>
              Wallet Security Authentication
            </span>
          </div>
          <div className="topbar-actions">
            {sidebarCollapsed && (
              <div className="copilot-tab-actions">
                <button className="btn btn-ghost btn-icon" title="New message">
                  <img src="/icons/16px/NewMessage.svg" width={16} height={16} alt="New message" />
                </button>
                <button className="btn btn-ghost btn-icon" title="Toggle sidebar" onClick={toggleSidebar}>
                  <img src="/icons/16px/SidebarRight.svg" width={16} height={16} alt="Toggle sidebar" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Article body */}
        <div className="kb-article-scroll" style={{ position: "relative" }}>
          <div className="kb-article" ref={articleRef}>
            {/* Status + Title */}
            <div className="kb-article-top">
              <div className="kb-article-status">
                <span className="kb-status-dot" style={{ background: "var(--content-tertiary)" }} />
                <span className="kb-status-label">Draft</span>
              </div>
              <h1 className="kb-article-title" contentEditable suppressContentEditableWarning>{ARTICLE.title}</h1>
            </div>

            {/* Properties */}
            <div className="kb-properties">
              <span className="kb-properties-label">Properties</span>
              <div className="kb-properties-tags">
                <span className="tag tag-purple">
                  <span className="tag-dot"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect width="12" height="12" rx="6" fill="currentColor" /></svg></span>
                  <span className="tag-label">{ARTICLE.collection}</span>
                </span>
                <div className="kb-property-item">
                  <img src="/icons/16px/Minor.svg" width={16} height={16} alt="" style={iconFilter} />
                  <span>{ARTICLE.criticality}</span>
                </div>
                <div className="kb-property-item">
                  <img src="/icons/16px/High.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(422%) hue-rotate(92deg) brightness(96%) contrast(92%)" }} />
                  <span>{ARTICLE.confidence}</span>
                </div>
                <button className="btn btn-ghost btn-icon">
                  <img src="/icons/16px/Dots.svg" width={16} height={16} alt="" style={iconFilter} />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="kb-summary">
              <div className="kb-summary-header">
                <img src="/icons/16px/AI.svg" width={16} height={16} alt="" style={iconFilter} />
                <span>Summary</span>
              </div>
              <p className="kb-summary-text">{ARTICLE.summary}</p>
            </div>

            {/* Body */}
            <div className="kb-body" contentEditable suppressContentEditableWarning ref={bodyRef}
              onKeyDown={(e) => {
                if ((e.key === "Delete" || e.key === "Backspace") && selectedCells.length > 1) {
                  e.preventDefault();
                  selectedCells.forEach((cell) => { cell.innerHTML = "<br>"; });
                  setSelectedCells([]);
                  return;
                }
                if (e.key === "Tab") {
                  const sel = window.getSelection();
                  const td = sel?.anchorNode?.nodeType === 3 ? sel.anchorNode.parentElement?.closest("td") : sel?.anchorNode?.closest?.("td");
                  if (!td) return;
                  e.preventDefault();
                  const table = td.closest("table");
                  if (!table) return;
                  const cells = Array.from(table.querySelectorAll("td"));
                  const idx = cells.indexOf(td);
                  const next = e.shiftKey ? cells[idx - 1] : cells[idx + 1];
                  if (next) {
                    const r = document.createRange();
                    r.selectNodeContents(next);
                    r.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(r);
                  }
                }
              }}>
              {ARTICLE.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Floating add-block button */}
          {addBtnVisible && <div className="kb-add-block-wrap" style={{ top: addBtnTop }}>
            <button className="btn btn-secondary btn-sm btn-icon kb-add-block-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setAddBlockOpen((v) => !v)}>
              <img src="/icons/16px/Plus.svg" width={16} height={16} alt="" />
            </button>
            {addBlockOpen && (
              <div className="kb-add-block-popover" onMouseDown={(e) => e.preventDefault()}>
                {[
                  { icon: "H1", label: "Heading 1", cmd: "h1" },
                  { icon: "h2", label: "Heading 2", cmd: "h2" },
                  { icon: "H3", label: "Heading 3", cmd: "h3" },
                  { icon: "Text", label: "Body", cmd: "p" },
                  { icon: "BulletedList", label: "Bulleted list", cmd: "insertUnorderedList" },
                  { icon: "NumberedList", label: "Numbered list", cmd: "insertOrderedList" },
                  { icon: "Table", label: "Table", cmd: "table" },
                  { icon: "Divider", label: "Divider", cmd: "hr" },
                ].map((item) => (
                  <button key={item.label} className="kb-add-block-item" onMouseDown={(e) => {
                    e.preventDefault();
                    const body = bodyRef.current;
                    if (!body) { setAddBlockOpen(false); return; }

                    // Create the new element
                    let newEl;
                    if (item.cmd === "insertUnorderedList") {
                      newEl = document.createElement("ul");
                      const li = document.createElement("li");
                      li.innerHTML = "<br>";
                      newEl.appendChild(li);
                    } else if (item.cmd === "insertOrderedList") {
                      newEl = document.createElement("ol");
                      const li = document.createElement("li");
                      li.innerHTML = "<br>";
                      newEl.appendChild(li);
                    } else if (item.cmd === "hr") {
                      newEl = document.createElement("hr");
                    } else if (item.cmd === "table") {
                      newEl = document.createElement("table");
                      for (let r = 0; r < 2; r++) {
                        const row = newEl.insertRow();
                        for (let c = 0; c < 2; c++) { row.insertCell().innerHTML = "<br>"; }
                      }
                    } else {
                      newEl = document.createElement(item.cmd);
                      newEl.innerHTML = "<br>";
                    }

                    // Insert after the active block
                    if (activeBlockEl && body.contains(activeBlockEl)) {
                      activeBlockEl.after(newEl);
                    } else {
                      body.appendChild(newEl);
                    }

                    // Focus the new element
                    const sel = window.getSelection();
                    const r = document.createRange();
                    const focusTarget = newEl.querySelector("td, li") || newEl;
                    if (newEl.tagName !== "HR") {
                      r.selectNodeContents(focusTarget);
                      r.collapse(true);
                      sel.removeAllRanges();
                      sel.addRange(r);
                    }

                    setAddBlockOpen(false);
                  }}>
                    <img src={`/icons/16px/${item.icon}.svg`} width={16} height={16} alt="" style={iconFilter} />
                    <span className="kb-add-block-label">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>}

          {/* Table context menus */}
          {activeTable && tableMenuPos && (() => {
            const scrollEl = bodyRef.current?.closest(".kb-article-scroll");
            if (!scrollEl) return null;
            const scrollRect = scrollEl.getBoundingClientRect();
            const tableRect = activeTable.getBoundingClientRect();
            const tTop = tableRect.top - scrollRect.top + scrollEl.scrollTop;
            const tLeft = tableRect.left - scrollRect.left;
            const tW = tableRect.width;
            const tH = tableRect.height;

            return (
              <>
                {/* Top-right: always visible (delete table) */}
                <div className="kb-table-opt" style={{ left: tLeft + tW + 4, top: tTop - 4 }}>
                  <button className="btn btn-secondary btn-micro btn-icon" onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => openTablePopover(e, "table")}>
                    <img src="/icons/12px/Options.svg" width={12} height={12} alt="" />
                  </button>
                </div>

                {/* Right-middle: visible on hover right edge (add column) */}
                {tableHoverEdge === "right" && (
                  <div className="kb-table-opt" style={{ left: tLeft + tW + 4, top: tTop + tH / 2 - 10 }}>
                    <button className="btn btn-secondary btn-micro btn-icon" onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { tableAddCol(); updateTableMenu(activeTable); }}>
                      <img src="/icons/12px/Plus.svg" width={12} height={12} alt="" />
                    </button>
                  </div>
                )}

                {/* Bottom-center: visible on hover bottom edge (add row) */}
                {tableHoverEdge === "bottom" && (
                  <div className="kb-table-opt" style={{ left: tLeft + tW / 2 - 10, top: tTop + tH + 4 }}>
                    <button className="btn btn-secondary btn-micro btn-icon" onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { tableAddRow(); updateTableMenu(activeTable); }}>
                      <img src="/icons/12px/Plus.svg" width={12} height={12} alt="" />
                    </button>
                  </div>
                )}

                {/* Column resize handles */}
                {activeTable.rows[0] && (() => {
                  const cells = activeTable.rows[0].cells;
                  let x = tLeft;
                  const handles = [];
                  for (let c = 0; c < cells.length - 1; c++) {
                    x += cells[c].offsetWidth;
                    handles.push(
                      <div key={`resize-${c}`} className="kb-table-resize-zone" ref={tableResizeRef}
                        style={{ left: x - 4, top: tTop, height: tH }}>
                        <div className="kb-table-resize-handle" />
                      </div>
                    );
                  }
                  return handles;
                })()}
              </>
            );
          })()}

          {/* Selection toolbar */}
          {toolbar && (
            <div className="kb-toolbar" style={{ left: toolbar.x, top: toolbar.y }} onMouseDown={(e) => e.preventDefault()}>
              <button className="btn btn-ghost btn-sm" onClick={() => {}}>
                <img src="/icons/16px/AI.svg" width={16} height={16} alt="" />
                <span className="btn-label">Ask Copilot</span>
              </button>
              <div className="kb-toolbar-divider" />
              <div style={{ position: "relative" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setTextPopoverOpen((v) => !v)}>
                  <span className="btn-label">Text</span>
                  <img src={`/icons/16px/${textPopoverOpen ? "ChevronTop" : "ChevronBottom"}.svg`} width={16} height={16} alt="" />
                </button>
                {textPopoverOpen && (
                  <div className="kb-text-popover" onMouseDown={(e) => e.preventDefault()}>
                    <span className="kb-text-popover-title">Turn into</span>
                    {[
                      { icon: "Text", label: "Body", cmd: "p" },
                      { icon: "H1", label: "Heading 1", cmd: "h1" },
                      { icon: "h2", label: "Heading 2", cmd: "h2" },
                      { icon: "H3", label: "Heading 3", cmd: "h3" },
                    ].map((item) => {
                      const sel = window.getSelection();
                      const block = sel?.anchorNode?.parentElement?.closest("h1,h2,h3,p,div");
                      const currentTag = block?.tagName?.toLowerCase() || "p";
                      const isActive = currentTag === item.cmd;
                      return (
                        <button key={item.label} className="kb-add-block-item" onClick={() => {
                          document.execCommand("formatBlock", false, item.cmd);
                          setTextPopoverOpen(false);
                        }}>
                          <img src={`/icons/16px/${item.icon}.svg`} width={16} height={16} alt="" style={iconFilter} />
                          <span className="kb-add-block-label">{item.label}</span>
                          {isActive && <img src="/icons/16px/Check.svg" width={16} height={16} alt="" style={{ ...iconFilter, marginLeft: "auto" }} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button className={`btn btn-ghost btn-sm btn-icon${formatState.bold ? " kb-toolbar-active" : ""}`} onClick={() => execCmd("bold")}>
                <img src="/icons/16px/Bold.svg" width={16} height={16} alt="" />
              </button>
              <button className={`btn btn-ghost btn-sm btn-icon${formatState.italic ? " kb-toolbar-active" : ""}`} onClick={() => execCmd("italic")}>
                <img src="/icons/16px/Italic.svg" width={16} height={16} alt="" />
              </button>
              <button className={`btn btn-ghost btn-sm btn-icon${formatState.strikeThrough ? " kb-toolbar-active" : ""}`} onClick={() => execCmd("strikeThrough")}>
                <img src="/icons/16px/Strike-through.svg" width={16} height={16} alt="" />
              </button>
              <button className={`btn btn-ghost btn-sm btn-icon${formatState.underline ? " kb-toolbar-active" : ""}`} onClick={() => execCmd("underline")}>
                <img src="/icons/16px/Underline.svg" width={16} height={16} alt="" />
              </button>
            </div>
          )}
        </div>

        {/* Table popover (fixed, renders above everything) */}
        {tablePopover && (
          <div className="kb-table-popover" style={{ left: tablePopover.pos.x, top: tablePopover.pos.y }} onMouseDown={(e) => e.preventDefault()}>
            {tablePopover.type === "table" && (
              <button className="kb-add-block-item" onClick={() => { tableDelete(); setTablePopover(null); }}>
                <img src="/icons/16px/Trash.svg" width={16} height={16} alt="" style={{ filter: "brightness(0) saturate(100%) invert(38%) sepia(60%) saturate(850%) hue-rotate(327deg) brightness(92%) contrast(90%)" }} />
                <span className="kb-add-block-label" style={{ color: "var(--utilities-content-content-red)" }}>Delete table</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom bar */}
        <div className="kb-bottom-bar">
          <div className="kb-bottom-left">
            <button className="btn btn-ghost btn-icon">
              <img src="/icons/16px/Attachments.svg" width={16} height={16} alt="" style={iconFilter} />
            </button>
            <div className="kb-divider-v" />
            <div className="kb-autosave">
              <Toggle on={autoSave} onChange={setAutoSave} />
              <span className="kb-autosave-label">AutoSave</span>
            </div>
          </div>
          <div className="kb-bottom-right">
            <button className="btn btn-ghost">
              <img src="/icons/16px/Eye open.svg" width={16} height={16} alt="" />
              <span className="btn-label">Preview</span>
            </button>
            <div className="kb-divider-v" />
            <div className="kb-bottom-actions">
              <button className="btn btn-secondary">
                <span className="btn-label">Cancel</span>
              </button>
              <div className="btn-split">
                <button className="btn btn-accent">
                  <span className="btn-label">Publish</span>
                </button>
                <button className="btn btn-accent btn-icon">
                  <img src="/icons/16px/ChevronBottom.svg" width={16} height={16} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="cop-resize-zone" ref={resizeZoneRef}>
          <div className="cop-resize-handle"></div>
        </div>
      </div>

      {/* Right sidebar (same as inbox, with added Conflicts tab) */}
      <div className={`copilot${sidebarCollapsed ? " collapsed" : ""}`} ref={copilotPanelRef}>
        <div className="copilot-tabs">
          <div className="tabs-list">
            <div className={`tab${activeTab === "details" ? " active" : ""}`} onClick={() => setActiveTab("details")}>Details</div>
            <div className={`tab${activeTab === "conflicts" ? " active" : ""}`} onClick={() => setActiveTab("conflicts")}>Conflicts</div>
            <div className={`tab${activeTab === "copilot" ? " active" : ""}`} onClick={() => setActiveTab("copilot")}>AI Copilot</div>
          </div>
          {!sidebarCollapsed && (
            <div className="copilot-tab-actions">
              <button className="btn btn-ghost btn-icon" title="Refresh">
                <img src="/icons/16px/Retry.svg" width={16} height={16} alt="Refresh" />
              </button>
              <button className="btn btn-ghost btn-icon" title="Toggle sidebar" onClick={toggleSidebar}>
                <img src="/icons/16px/SidebarRight.svg" width={16} height={16} alt="Toggle sidebar" />
              </button>
            </div>
          )}
        </div>

        {/* Details tab */}
        <div
          id="copilot-panel-details"
          style={{ display: activeTab === "details" ? "flex" : "none", flex: 1, minHeight: 0 }}
        >
          <KbDetailsPanel />
        </div>

        {/* Conflicts tab */}
        <div style={{ display: activeTab === "conflicts" ? "flex" : "none", flex: 1, flexDirection: "column", overflowY: "auto" }}>
          {/* Progress */}
          <div className="kb-conflicts-progress">
            <div className="kb-conflicts-progress-header">
              <span className="kb-conflicts-progress-label">Conflicts detection</span>
              <span className="kb-conflicts-progress-count">1/6 Resolved</span>
            </div>
            <div className="kb-conflicts-progress-bar">
              <div className="kb-progress-segment kb-progress-green" style={{ flex: 1 }} />
              <div className="kb-progress-segment kb-progress-blue" style={{ flex: 2 }} />
              <div className="kb-progress-segment kb-progress-orange" style={{ flex: 1 }} />
              <div className="kb-progress-segment kb-progress-red" style={{ flex: 2 }} />
            </div>
          </div>

          {/* Conflicts list */}
          <div className="kb-conflicts-section">
            <div className="kb-conflicts-section-header">
              <span className="kb-conflicts-dot" style={{ background: "var(--utilities-content-content-red)" }} />
              <span className="kb-conflicts-section-title">Conflicts</span>
              <span className="kb-conflicts-section-count">2</span>
            </div>
            {CONFLICTS.map((item, i) => (
              <div className="kb-conflicts-item" key={i}>
                <span className="kb-conflicts-item-dot" style={{ background: item.color }} />
                <span className="kb-conflicts-item-label">{item.label}</span>
                <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" style={iconFilter} />
              </div>
            ))}
          </div>

          {/* Duplicates list */}
          <div className="kb-conflicts-section">
            <div className="kb-conflicts-section-header">
              <span className="kb-conflicts-dot" style={{ background: "var(--utilities-content-content-blue)" }} />
              <span className="kb-conflicts-section-title">Duplicates</span>
              <span className="kb-conflicts-section-count">4</span>
            </div>
            {DUPLICATES.map((item, i) => (
              <div className="kb-conflicts-item" key={i}>
                <span className="kb-conflicts-item-dot" style={{ background: "var(--utilities-content-content-blue)" }} />
                <span className="kb-conflicts-item-label">{item.label}</span>
                <img src="/icons/16px/ChevronRight.svg" width={16} height={16} alt="" style={iconFilter} />
              </div>
            ))}
          </div>
        </div>

        {/* AI Copilot tab (same as inbox) */}
        <div
          className="copilot-content"
          style={{ display: activeTab === "copilot" ? "" : "none" }}
        >
          <div className="copilot-scroll" ref={copilotScrollRef} onScroll={updateCopilotBackToBottom}>
            {copilotItems.map((item, i) => {
              if (item.type === "user") return <div key={i} className="copilot-user-msg">{item.text}</div>;
              if (item.type === "thinking") return <ThinkingSection key={`thinking-${i}`} steps={item.steps} readingKB={item.readingKB} scrollContainerRef={copilotScrollRef} />;
              if (item.type === "ai") return (
                <AiBlock key={i} aiReply={item.aiReply} aiMessage={item.aiMessage} aiReasoning={item.aiReasoning}
                  onRegenerate={() => { setCopilotItems((prev) => prev.filter((_, idx) => idx !== i)); startCopilotThinkingFlow(); }} />
              );
              if (item.type === "skipped") return (
                <SkippedBlock key={i} onRetry={() => { setCopilotItems((prev) => prev.filter((_, idx) => idx !== i)); startCopilotThinkingFlow(); }} />
              );
              return null;
            })}
            {copilotItems.length > 0 && ["ai", "skipped"].includes(copilotItems[copilotItems.length - 1].type) && (
              <CopilotSpacer key={copilotItems.length} scrollContainerRef={copilotScrollRef} />
            )}
          </div>
          <div className="copilot-empty-state" style={copilotItems.length > 0 ? { display: "none" } : undefined}>
            <div className="empty-state">
              <CopilotEmptySvg />
              <div className="empty-state-content">
                <div className="empty-state-text">
                  <p className="empty-state-title">How can I help you today?</p>
                  <p className="empty-state-description">Ask anything about this article to get AI&#8209;powered help with content or conflicts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copilot composer (same as inbox) */}
        <div className="copilot-composer" style={{ display: activeTab === "copilot" ? "" : "none" }}>
          <div className={`copilot-back-to-bottom${copilotBackToBottom ? " is-visible" : ""}`}>
            <button className="btn btn-secondary btn-icon" title="Back to bottom"
              onClick={() => copilotScrollRef.current?.scrollTo({ top: copilotScrollRef.current.scrollHeight, behavior: "smooth" })}>
              <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" />
            </button>
          </div>
          <div className={`copilot-suggestions${suggestionsHidden ? " is-hidden" : ""}`}>
            {["Summarize this article", "Check for conflicts", "Suggest improvements"].map((label) => (
              <button key={label} className="copilot-suggestion" onClick={() => {
                const el = copilotEditableRef.current;
                if (el) el.textContent = label;
                sendCopilotMessage();
              }}>
                <img src="/icons/16px/Shortcut.svg" width={16} height={16} alt="" />
                {label}
              </button>
            ))}
          </div>
          <div className={`copilot-input${copilotMultiline ? " multiline" : ""}`}>
            <div
              contentEditable
              className="copilot-editable"
              suppressContentEditableWarning
              ref={copilotEditableRef}
              onInput={() => {
                const el = copilotEditableRef.current;
                if (el && el.textContent.trim() === "") { el.innerHTML = ""; setCopilotMultiline(false); setSuggestionsHidden(false); }
                else if (el) { setCopilotMultiline(el.scrollHeight > 40); setSuggestionsHidden(true); }
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!copilotThinking) sendCopilotMessage(); } }}
            />
            <button
              className={`btn ${copilotThinking ? "btn-secondary" : "btn-accent"} btn-icon copilot-send-btn`}
              onClick={sendCopilotMessage}
            >
              {copilotThinking ? (
                <img src="/icons/16px/Stop.svg" width={16} height={16} alt="" />
              ) : (
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12.5V3.5M4.5 7l3.5-3.5L11.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
