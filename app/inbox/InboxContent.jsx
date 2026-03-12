"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Data imports ─── */
import {
  conversations,
  allConversations,
  copilotData,
  detailsData,
  VIEW_LABELS,
  CH,
} from "./inboxData";

/* ─── Priority SVG icons for DialogAlert ─── */
const PRIORITY_ICONS = {
  critical: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.089 1.125C7.856 1.125 8.57 1.516 8.984 2.161L10.667 4.786C11.14 5.526 11.14 6.474 10.667 7.214L8.984 9.839C8.57 10.484 7.856 10.875 7.089 10.875H4.91C4.143 10.875 3.429 10.484 3.015 9.839L1.333 7.214C.858 6.474.858 5.526 1.333 4.786L3.015 2.161C3.429 1.516 4.143 1.125 4.91 1.125H7.089Z" fill="currentColor"/><path d="M6.125 7.55c.387 0 .7.313.7.7s-.313.7-.7.7-.7-.314-.7-.7.313-.7.7-.7ZM6.125 3.25a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 1-1 0v-2.5a.5.5 0 0 1 .5-.5Z" fill="white"/></svg>
  ),
  high: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM6 2.4A3.6 3.6 0 0 0 2.4 6H6V2.4Z" fill="currentColor"/></svg>
  ),
  medium: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM6 2.4A3.6 3.6 0 0 0 2.4 6a3.6 3.6 0 0 0 3.6 3.6V2.4Z" fill="currentColor"/></svg>
  ),
  low: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 .9a3.6 3.6 0 0 0-2.549 6.149A3.6 3.6 0 0 0 9.6 6H6V2.4Z" fill="currentColor"/></svg>
  ),
};

const PRIORITY_LABELS = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
const STATUS_LABELS = { open: "Open", pending: "Pending", closed: "Closed", snoozed: "Snoozed" };

/* ═══════════════════════════════════════════════════════════ */
/*  Sub-components                                            */
/* ═══════════════════════════════════════════════════════════ */

/* ─── InboxItem ─── */
function InboxItem({ c, isActive, onClick }) {
  return (
    <div className={`isb-item${isActive ? " active" : ""}`} onClick={onClick}>
      <div className="isb-avatar-wrap">
        <div className="isb-avatar" style={{ background: c.bg, color: c.color }}>{c.initials}</div>
        <div className="isb-channel">
          <img src={`/icons/12px/${CH[c.ch]}.svg`} width={12} height={12} alt={CH[c.ch]} />
        </div>
      </div>
      <div className="isb-message">
        <div className="isb-header-row">
          <span className="isb-name">{c.name}</span>
          <span className="isb-time">{c.time}</span>
        </div>
        <div className="isb-bottom-row">
          {c.quote && <div className="isb-quote-bar"></div>}
          <span className="isb-preview">{c.preview}</span>
          {c.badge > 0 && <div className="isb-badge">{c.badge}</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── DialogAlert ─── */
function DialogAlertComponent({ d }) {
  switch (d.type) {
    case "date":
      return (
        <div className="da">
          <div className="da-date-sep">
            <div className="da-line"></div>
            <span>{d.date}</span>
            <div className="da-line"></div>
          </div>
        </div>
      );
    case "ticket-created":
      return (
        <div className="da da-ticket-created">
          <div className="da-content">
            <span className="da-ticket-title">New ticket created</span>
            <span className="da-ticket-dot">&middot;</span>
            <span className="da-ticket-name">{d.date}</span>
          </div>
        </div>
      );
    case "not-assigned":
      return (
        <div className="da">
          <span>Ticket is not assigned yet</span>
          <button className="btn btn-secondary">Assign to me</button>
        </div>
      );
    case "assign-to":
      return (
        <div className="da">
          <span>Ticket assigned to</span>
          <span className="da-name">{d.name}</span>
        </div>
      );
    case "reassigned":
      return (
        <div className="da">
          <span>Ticket was reassigned from</span>
          <span className="da-name">{d.from}</span>
          <span>to</span>
          <span className="da-name">{d.to}</span>
        </div>
      );
    case "snooze-started":
      return (
        <div className="da">
          <img src="/icons/12px/Clock.svg" width={12} height={12} alt="" />
          <span>Ticket snoozed until {d.until}</span>
        </div>
      );
    case "snooze-ended":
      return (
        <div className="da">
          <img src="/icons/12px/Clock.svg" width={12} height={12} alt="" />
          <span>Ticket snooze ended</span>
        </div>
      );
    case "change-status":
      return (
        <div className="da">
          <span>Ticket status changed to</span>
          <span className="tag tag-sm">
            <span className="tag-dot">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="2.5" y="2.5" width="7" height="7" rx="3.5" fill={d.color} />
              </svg>
            </span>
            <span className="tag-label">{d.status}</span>
          </span>
        </div>
      );
    case "priority":
      return (
        <div className="da">
          <span>Priority changed to</span>
          <div className={`da-priority da-priority-${d.priority}`}>
            {PRIORITY_ICONS[d.priority]}
            <span>{PRIORITY_LABELS[d.priority]}</span>
          </div>
        </div>
      );
    case "feedback":
      return (
        <div className="da">
          <span>Received</span>
          <span className="tag tag-sm">
            <span className="tag-label">{d.score}/{d.total}</span>
          </span>
          <span>feedback points</span>
        </div>
      );
    case "new-chat":
      return (
        <div className="da">
          <span>{d.text || "A new version of the AI agent is available"}</span>
          <button className="btn btn-accent">Start new chat</button>
        </div>
      );
    default:
      return null;
  }
}

/* ─── MessageBubble ─── */
function MessageBubble({ m, showAuthor }) {
  const isOut = m.dir === "out";
  const isNote = !!m.isNote;
  return (
    <div className={`msg-wrapper ${isOut ? "outbound" : "inbound"}`}>
      <div className={`msg-bubble${isNote ? " note" : ""}`}>
        {showAuthor && (
          <div className="msg-author">
            <div className="msg-author-logo">
              <img src="/icons/16px/ClarityLogo.svg" width={16} height={16} alt="" />
            </div>
            <span className="msg-author-name">Agent</span>
          </div>
        )}
        <div className="msg-body" dangerouslySetInnerHTML={{ __html: m.text }} />
      </div>
      <span className="msg-time">{m.time}</span>
    </div>
  );
}

/* ─── DetailsPanel ─── */
function DetailsPanel({ data }) {
  if (!data) return null;
  const c = data.contact;
  const t = data.ticket;

  return (
    <>
      <DetailSection title="Details" defaultOpen>
        <DsRow label="Name" value={<DsText text={c.name} />} />
        <DsRow label="Phone" value={c.phone ? <DsText text={c.phone} /> : <DsEmpty icon="Plus" placeholder="Not set" />} />
        <DsRow label="Email" value={<DsText text={c.email} />} />
        <DsRow label="Tags" value={<TagPills tags={c.tags} />} />
        <DsRow label="External ID" value={c.externalId ? <DsText text={c.externalId} /> : <DsEmpty icon="Plus" placeholder="Set ID" />} />
      </DetailSection>
      <DetailSection title="Ticket" defaultOpen>
        <DsRow label="ID" value={<DsText text={t.id} />} />
        <DsRow label="Assignee" value={t.assignee ? (
          <div className="ds-value ds-value-user">
            <div className="avatar avatar-sm" style={{ background: t.assignee.bg, color: t.assignee.color }}>{t.assignee.initials[0]}</div>
            <span className="ds-value-inner">{t.assignee.name}</span>
          </div>
        ) : <DsEmpty icon="Plus" placeholder="Set assignee" />} />
        <DsRow label="Team inbox" value={t.teamInbox ? <DsText text={t.teamInbox} /> : <DsEmpty icon="Plus" placeholder="Set team" />} />
        <DsRow label="Status" value={<div className="ds-value"><span className={`ds-value-inner ds-status-${t.status}`}>{STATUS_LABELS[t.status]}</span></div>} />
        <DsRow label="Tags" value={<TagPills tags={t.tags} />} />
        <DsRow label="Category" value={<DsText text={t.category} />} />
        <DsRow label="Priority" value={
          <div className={`ds-value ds-value-priority ds-priority-${t.priority}`}>
            <div className="ds-priority-dot"></div>
            <span className="ds-value-inner">{PRIORITY_LABELS[t.priority]}</span>
          </div>
        } />
      </DetailSection>
      <DetailSection title="Recent tickets" defaultOpen={false}>
        {data.recentTickets && data.recentTickets.length > 0 && (
          <div style={{ padding: "0 8px 8px" }}>
            <div className="tli-list" style={{ padding: 0 }}>
              {data.recentTickets.map((rt, i) => (
                <div className={`tli${i === 0 ? " current" : ""}`} key={i}>
                  <div className="tli-step">
                    <div className={`tli-dot tli-dot-${rt.status}`}></div>
                    {i < data.recentTickets.length - 1 && <div className="tli-line"></div>}
                  </div>
                  <div className="tli-body">
                    <div className="tli-header">
                      <span className="tli-status">{rt.status.charAt(0).toUpperCase() + rt.status.slice(1)}</span>
                      <span className="tli-date">{rt.date}</span>
                    </div>
                    <p className="tli-preview">{rt.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DetailSection>
    </>
  );
}

function DetailSection({ title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

  return (
    <div className={`det-section${!open ? " det-collapsed" : ""}`}>
      <div className="det-section-header">
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)}>
          <span>{title}</span>
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
        <div className="tag-pill" key={i}>
          <span className="tag-dot" style={{ background: tag.color }}></span>
          {tag.label}
        </div>
      ))}
    </div>
  );
}

/* ─── AiBlock (Copilot suggested reply card) ─── */
function AiBlock({ aiReply, aiMessage, aiDetails, aiReasoning, onInsert, onRegenerate }) {
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [insertIcon, setInsertIcon] = useState("Copy");
  const reasoningRef = useRef(null);
  const detailsRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleInsert = () => {
    setInsertIcon("Check");
    setTimeout(() => setInsertIcon("Copy"), 4000);
    if (onInsert) onInsert(aiReply);
  };

  return (
    <div className="ai-block">
      <div className="ai-reasoning" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => setReasoningOpen(!reasoningOpen)}>
            Reasoning
            <img
              src="/icons/16px/ChevronRight.svg" width={16} height={16} alt=""
              style={{ transition: "transform 0.2s ease", transform: reasoningOpen ? "rotate(90deg)" : "" }}
            />
          </button>
        </div>
        <div
          className="reasoning-message"
          ref={reasoningRef}
          style={{ display: reasoningOpen ? "block" : undefined }}
          dangerouslySetInnerHTML={{ __html: aiReasoning }}
        />
      </div>
      <div className="ai-message" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <p>{aiMessage}</p>
      </div>
      <div
        className="ai-cards"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div className="card">
          <div className="card-header">
            <span className="card-label">Suggested reply</span>
            <div className="confidence-badge">
              <div className="confidence-dot"></div>
              <span className="confidence-text">High</span>
            </div>
          </div>
          <div className="card-body"><p dangerouslySetInnerHTML={{ __html: aiReply }} /></div>
          <div className={`card-details-header${detailsOpen ? " is-open" : ""}`}>
            <div>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetailsOpen(!detailsOpen)}>
                Details
                <img
                  src="/icons/16px/ChevronRight.svg" width={16} height={16} alt=""
                  style={{ transition: "transform 0.2s ease", transform: detailsOpen ? "rotate(90deg)" : "" }}
                />
              </button>
            </div>
            {detailsOpen && (
              <div className="card-details-body" ref={detailsRef} style={{ display: "block" }}>
                <p>{aiDetails}</p>
              </div>
            )}
          </div>
          <div className="card-divider"></div>
          <div className="card-actions">
            <div className="card-actions-left">
              <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsUp.svg" width={16} height={16} alt="" /></button>
              <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsDown.svg" width={16} height={16} alt="" /></button>
              <button className="btn btn-ghost btn-icon" onClick={onRegenerate}><img src="/icons/16px/Retry.svg" width={16} height={16} alt="" /></button>
            </div>
            <div className="card-actions-right">
              <button className="btn btn-inverse btn-insert" onClick={handleInsert}>
                <img src={`/icons/16px/${insertIcon}.svg`} width={16} height={16} alt="" /> Insert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SkippedBlock ─── */
function SkippedBlock({ onRetry }) {
  const [reasoningOpen, setReasoningOpen] = useState(false);
  return (
    <div className="ai-block">
      <div className="ai-reasoning">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => setReasoningOpen(!reasoningOpen)}>
            Reasoning
            <img
              src="/icons/16px/ChevronRight.svg" width={16} height={16} alt=""
              style={{ transition: "transform 0.2s ease", transform: reasoningOpen ? "rotate(90deg)" : "" }}
            />
          </button>
        </div>
        {reasoningOpen && <div className="reasoning-message"></div>}
      </div>
      <div className="ai-message">
        <p className="ai-skipped-label" style={{ color: "var(--content-tertiary)" }}>Answer skipped</p>
      </div>
      <div className="card-actions-left" style={{ paddingLeft: "2px" }}>
        <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsUp.svg" width={16} height={16} alt="" /></button>
        <button className="btn btn-ghost btn-icon"><img src="/icons/16px/ThumbsDown.svg" width={16} height={16} alt="" /></button>
        <button className="btn btn-ghost btn-icon" onClick={onRetry}><img src="/icons/16px/Retry.svg" width={16} height={16} alt="" /></button>
      </div>
    </div>
  );
}

/* ─── ThinkingSection ─── */
function ThinkingSection({ steps, readingKB, scrollContainerRef }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef(null);
  const imgRef = useRef(null);
  const hasTransformedRef = useRef(false);
  const intervalsRef = useRef([]);

  /* Dynamic height + scroll positioning + ResizeObserver */
  useEffect(() => {
    const section = sectionRef.current;
    const scroll = scrollContainerRef?.current;
    if (!section || !scroll) return;

    const prevEl = section.previousElementSibling;

    const updateHeight = () => {
      if (!scroll.contains(section)) return;
      const h = prevEl
        ? Math.max(0, scroll.clientHeight - prevEl.offsetHeight - 58)
        : scroll.clientHeight;
      section.style.height = h + "px";
    };

    updateHeight();

    // Ultra-fast animated scroll — message appears at bottom, viewport
    // compensates almost imperceptibly (~180ms ease-out) so the user message
    // ends up near the top without a visible jump or a slow push.
    const target = prevEl ? prevEl.offsetTop - 18 : 0;
    const start = scroll.scrollTop;
    const dist = target - start;
    if (Math.abs(dist) > 1) {
      const dur = 180;
      const t0 = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        scroll.scrollTop = start + dist * ease(p);
        if (p < 1) rafId = requestAnimationFrame(tick);
      };
      var rafId = requestAnimationFrame(tick);
    }

    let resizeTimer;
    const observer = new ResizeObserver(() => {
      updateHeight();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        scroll.scrollTop = prevEl ? prevEl.offsetTop - 18 : 0;
      }, 50);
    });
    observer.observe(scroll);

    return () => { observer.disconnect(); clearTimeout(resizeTimer); cancelAnimationFrame(rafId); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* "Reading KB" character-by-character typing animation */
  useEffect(() => {
    if (!readingKB || hasTransformedRef.current) return;
    hasTransformedRef.current = true;

    const timer = setTimeout(() => {
      const textSpan = textRef.current;
      const dots = dotsRef.current;
      const img = imgRef.current;
      if (!textSpan || !dots || !img) return;

      dots.style.transition = "opacity 0.2s";
      dots.style.opacity = "0";
      let currentText = textSpan.textContent;
      const newText = "Reading KB";

      const deleteInterval = setInterval(() => {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          textSpan.textContent = currentText;
        } else {
          clearInterval(deleteInterval);
          img.src = "/icons/16px/Knowledge.svg";
          let typeIdx = 0;
          const typeInterval = setInterval(() => {
            if (typeIdx < newText.length) {
              textSpan.textContent += newText[typeIdx++];
            } else {
              clearInterval(typeInterval);
              dots.style.opacity = "1";
            }
          }, 50);
          intervalsRef.current.push(typeInterval);
        }
      }, 40);
      intervalsRef.current.push(deleteInterval);
    }, 700);

    return () => {
      clearTimeout(timer);
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
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
            <div className="thinking-step">
              <div className="thinking-step-icon"></div>
              <span className="thinking-step-text">{step}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CopilotSpacer (fills remaining space after AI/skipped blocks) ─── */
function CopilotSpacer({ scrollContainerRef }) {
  const spacerRef = useRef(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const scroll = scrollContainerRef?.current;
    if (!spacer || !scroll) return;

    const aiBlock = spacer.previousElementSibling;
    const userMsg = aiBlock?.previousElementSibling;

    const updateHeight = () => {
      if (!userMsg || !aiBlock) { spacer.style.height = "0"; return; }
      spacer.style.height = Math.max(0, scroll.clientHeight - userMsg.offsetHeight - aiBlock.offsetHeight - 78) + "px";
    };

    updateHeight();
    const timer = setTimeout(updateHeight, 600);

    const observer = new ResizeObserver(updateHeight);
    observer.observe(scroll);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [scrollContainerRef]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="copilot-ai-spacer" ref={spacerRef} style={{ flexShrink: 0 }} />;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Copilot AI data arrays                                    */
/* ═══════════════════════════════════════════════════════════ */

const thinkingSteps = [
  "Generating a ticket summary",
  "Drafting reply",
  "Checking customer history",
  "Preparing response",
];

const clientReplies = [
  "Ok, thank you!",
  "Got it, appreciate the help.",
  "Alright, that makes sense.",
  "Thanks, I'll wait for the update.",
  "Perfect, that's exactly what I needed.",
  "Understood, thank you so much.",
  "Great, I appreciate it!",
  "Thanks for the quick response.",
];

const aiReplies = [
  "Thank you for reaching out. I understand your concern and I'm here to help you resolve this as quickly as possible.",
  "I appreciate your patience. Based on the information provided, I'll be able to assist you effectively.",
  "Thank you for contacting us. I've reviewed the details and I'm ready to provide you with the best solution.",
  "I understand your situation completely. Let me walk you through the steps to resolve this for you.",
];

const aiMessages = [
  "Recommend the Gold Credit Card — better fraud protection and emergency blocking.",
  "Customer has 3 open tickets this month — consider escalating to an account specialist.",
  "Offer the Premium plan upgrade — usage patterns suggest they'd benefit from higher limits.",
  "Check if two-factor authentication is enabled — may be relevant to their security concern.",
];

const aiDetails = [
  "The suggested response addresses the customer's request to view their virtual card by providing clear step-by-step instructions. It also includes creation steps in case the card doesn't exist yet. The confidence is high because the information is directly sourced from the knowledge base and matches the customer's specific query.",
  "The response acknowledges the customer's frustration while providing a clear path to resolution. Confidence is high as this issue is well-documented with a proven fix. The tone is empathetic and professional, appropriate for a billing-related concern.",
  "The suggested reply leverages the customer's account history to offer a personalised solution. Confidence is medium-high — the core information is accurate but the exact outcome may vary depending on account settings not visible in this view.",
  "The response directly addresses the query with structured instructions sourced from the knowledge base. Confidence is high given the exact match between the customer's question and available documentation. Escalation is unlikely to be needed.",
];

const aiReasonings = [
  `<p>The customer is asking to see their virtual card. They previously asked for general help with their card, and the AI Deflection Agent asked for more details. The customer then clarified their request to specifically be about a virtual card.</p>
<p>Here's a summary of the ticket:</p>
<ul>
  <li>Customer wants to see their virtual card.</li>
  <li>Previous agent asked clarifying questions about card issues.</li>
  <li>Customer specified virtual card access.</li>
</ul>
<div class="reasoning-sources">
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/5/18">articles/5/18</a>
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/5/178">articles/5/178</a>
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/761265115897895">articles/761265115897895</a>
</div>
<p>A virtual card is a digital payment card that you can use for online purchases and with Apple Pay/Google Pay. They are free to create and offer enhanced security.</p>
<p>To view your virtual card details:</p>
<ol>
  <li>Go to your 'Home' screen in the app.</li>
  <li>Tap the cards icon in the top-right corner.</li>
  <li>Tap your virtual card, then tap 'Show details'.</li>
  <li>Enter your passcode (you might also be asked for a one-time passcode).</li>
</ol>`,
  `<p>The customer is disputing a charge that appeared on their account. They believe the transaction was unauthorised and are requesting a refund.</p>
<p>Here's a summary of the ticket:</p>
<ul>
  <li>Customer reports an unrecognised transaction of €34.99.</li>
  <li>Transaction date: 3 days ago, merchant listed as "ONLINESVC".</li>
  <li>Customer requests immediate refund and card freeze.</li>
</ul>
<div class="reasoning-sources">
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/2/44">articles/2/44</a>
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/2/51">articles/2/51</a>
</div>
<p>For disputed transactions, the standard process is to freeze the card immediately, open a chargeback case, and inform the customer of the timeline.</p>`,
  `<p>The customer is asking about plan limits and whether upgrading would benefit them.</p>
<p>Here's a summary of the ticket:</p>
<ul>
  <li>Customer on Standard plan, hitting transfer limits.</li>
  <li>Interested in higher limits and additional features.</li>
  <li>Has been a customer for 14 months with a good standing account.</li>
</ul>
<div class="reasoning-sources">
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/8/102">articles/8/102</a>
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/8/117">articles/8/117</a>
</div>
<p>The Premium plan offers 5× higher transfer limits, priority support, and free international ATM withdrawals up to €400/month.</p>`,
  `<p>The customer cannot log in to their account. They report that the verification code is not arriving via SMS.</p>
<p>Here's a summary of the ticket:</p>
<ul>
  <li>Customer locked out — SMS verification not being received.</li>
  <li>Phone number on file appears to be correct.</li>
  <li>No recent changes to account security settings.</li>
</ul>
<div class="reasoning-sources">
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/1/9">articles/1/9</a>
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/1/23">articles/1/23</a>
</div>
<p>Common causes include SMS carrier delays, number portability issues, or spam filters. The recommended resolution path is to offer an alternative verification method.</p>`,
];

/* ═══════════════════════════════════════════════════════════ */
/*  Loading SVGs (extracted to keep JSX readable)              */
/* ═══════════════════════════════════════════════════════════ */

function LoadingSvg() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    fetch("/illustrations/Switching organization.svg")
      .then((r) => r.text())
      .then((svg) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
  }, []);
  return <div ref={ref} style={{ width: 236, height: 164, display: "flex", alignItems: "center", justifyContent: "center" }} />;
}

function EmptyStateSvg() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    fetch("/illustrations/SelectConversation.svg")
      .then((r) => r.text())
      .then((svg) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
  }, []);
  return <div ref={ref} style={{ width: 236, height: 164, display: "flex", alignItems: "center", justifyContent: "center" }} />;
}

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
      <g filter="url(#cf0)">
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
        <filter id="cf0" x="20" y="69" width="196" height="104" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a" /><feOffset dy="3" /><feGaussianBlur stdDeviation="3" /><feComposite in2="a" operator="out" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" /><feBlend in2="bg" result="s" /><feBlend in="SourceGraphic" in2="s" />
        </filter>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  Main InboxContent component                               */
/* ═══════════════════════════════════════════════════════════ */

export default function InboxContent({ currentView = "assigned", onViewChange }) {
  /* ─── Core state ─── */
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [activeTab, setActiveTab] = useState("copilot");
  const [copilotCollapsed, setCopilotCollapsed] = useState(false);

  /* ─── Copilot state ─── */
  const [copilotItems, setCopilotItems] = useState([]); // [{type:'user',text}, {type:'thinking',steps,readingKB}, {type:'ai',...}, {type:'skipped'}]
  const [copilotThinking, setCopilotThinking] = useState(false);
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);
  const [chatBackToBottom, setChatBackToBottom] = useState(false);
  const [copilotBackToBottom, setCopilotBackToBottom] = useState(false);
  const [copilotMultiline, setCopilotMultiline] = useState(false);

  /* ─── Refs ─── */
  const contentRef = useRef(null);
  const chatScrollRef = useRef(null);
  const copilotScrollRef = useRef(null);
  const composerInputRef = useRef(null);
  const copilotEditableRef = useRef(null);
  const inboxSidebarRef = useRef(null);
  const copilotPanelRef = useRef(null);
  const composerRef = useRef(null);
  const savedCopilotWidthRef = useRef("");
  const copilotTabActionsRef = useRef(null);
  const dialogTopbarActionsRef = useRef(null);

  /* ─── Mutable refs for counters ─── */
  const clientReplyIndexRef = useRef(0);
  const aiReplyIndexRef = useRef(0);
  const thinkingTimerRef = useRef(null);
  const startCopilotThinkingRef = useRef(null);

  /* ─── Conversation history cache ─── */
  const historyCache = useRef({}); // { [convName]: { chatMessages, copilotItems, copilotThinking, suggestionsHidden } }
  const viewConvCache = useRef({}); // { [view]: selectedConvName }
  const selectedConvRef = useRef(null); // mirrors selectedConv for use in async callbacks
  const thinkingConvRef = useRef(null); // which conversation has an active thinking process

  /* ─── Derived ─── */
  const items = allConversations.filter((c) => c.views.includes(currentView));

  // Keep selectedConvRef in sync
  useEffect(() => { selectedConvRef.current = selectedConv; }, [selectedConv]);

  /* ─── Save current conversation to cache ─── */
  const saveCurrentConv = useCallback(() => {
    if (!selectedConv) return;
    const isThinkingForThis = thinkingConvRef.current === selectedConv.name;
    historyCache.current[selectedConv.name] = {
      chatMessages,
      copilotItems: isThinkingForThis ? copilotItems : copilotItems.filter((item) => item.type !== "thinking"),
      copilotThinking: isThinkingForThis,
      suggestionsHidden: copilotItems.length > 0,
    };
  }, [selectedConv, chatMessages, copilotItems]);

  /* ─── Restore or reset for a conversation ─── */
  const restoreOrResetConv = useCallback((conv) => {
    const cached = conv ? historyCache.current[conv.name] : null;
    if (cached) {
      setChatMessages(cached.chatMessages);
      setCopilotItems(cached.copilotItems);
      setCopilotThinking(cached.copilotThinking || false);
      setSuggestionsHidden(cached.suggestionsHidden);
    } else {
      const msgs = conv ? (conversations[conv.name] || []) : [];
      setChatMessages(msgs);
      setCopilotItems([]);
      setCopilotThinking(false);
      setSuggestionsHidden(false);
    }
  }, []);

  /* ─── Handle view change — restore previous conversation for this view ─── */
  useEffect(() => {
    // Don't cancel thinking timer — it may be running for a background conversation
    const prevConvName = viewConvCache.current[currentView];
    const prevConv = prevConvName ? allConversations.find((c) => c.name === prevConvName && c.views.includes(currentView)) : null;
    if (prevConv) {
      setSelectedConv(prevConv);
      restoreOrResetConv(prevConv);
    } else {
      setSelectedConv(null);
      setChatMessages([]);
      setCopilotItems([]);
      setCopilotThinking(false);
      setSuggestionsHidden(false);
    }
  }, [currentView]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Loading effect ─── */
  useEffect(() => {
    document.body.classList.add("is-loading");
    const timer = setTimeout(() => {
      document.body.classList.remove("is-loading");
      setIsLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
      document.body.classList.remove("is-loading");
    };
  }, []);

  /* ─── Scroll chat to bottom when messages change ─── */
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chatMessages]);

  /* ─── Chat back-to-bottom handler ─── */
  const updateChatBackToBottom = useCallback(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setChatBackToBottom(!atBottom);
  }, []);

  /* ─── Copilot back-to-bottom handler ─── */
  const updateCopilotBackToBottom = useCallback(() => {
    const el = copilotScrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setCopilotBackToBottom(!atBottom);
  }, []);

  /* ─── Helper: current time ─── */
  const nowTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  };

  /* ─── Append chat message ─── */
  const appendChatMessage = useCallback((dir, text, isNote = false) => {
    setChatMessages((prev) => [...prev, { dir, text, time: nowTime(), isNote }]);
    if (dir === "in") {
      setTimeout(() => startCopilotThinkingRef.current?.(), 500);
    }
  }, []);

  /* ─── Send dialog message ─── */
  const sendDialogMessage = useCallback(() => {
    const el = composerInputRef.current;
    if (!el) return;
    if (isNoteMode) return;
    const text = el.textContent.trim();
    if (!text) {
      shakeElement(composerRef.current);
      return;
    }
    appendChatMessage("out", text);
    el.innerHTML = "";
    setTimeout(() => {
      const reply = clientReplies[clientReplyIndexRef.current % clientReplies.length];
      clientReplyIndexRef.current++;
      appendChatMessage("in", reply);
    }, 3000);
  }, [isNoteMode, appendChatMessage]);

  /* ─── Send note ─── */
  const sendNote = useCallback(() => {
    const el = composerInputRef.current;
    if (!el) return;
    const text = el.textContent.trim();
    if (!text) {
      shakeElement(composerRef.current);
      return;
    }
    appendChatMessage("out", text, true);
    el.innerHTML = "";
  }, [appendChatMessage]);

  /* ─── Shake helper ─── */
  const shakeElement = (el) => {
    if (!el) return;
    el.classList.remove("is-shake");
    void el.offsetWidth;
    el.classList.add("is-shake");
  };

  /* ─── Helper: update copilot items for a conversation (active → state, background → cache) ─── */
  const updateConvCopilotItems = useCallback((convName, updater) => {
    if (selectedConvRef.current?.name === convName) {
      setCopilotItems(updater);
    } else {
      const cached = historyCache.current[convName];
      if (cached) cached.copilotItems = updater(cached.copilotItems);
    }
  }, []);

  /* ─── Copilot thinking flow ─── */
  const startCopilotThinkingFlow = useCallback(() => {
    if (copilotThinking) return;
    const convName = selectedConv?.name;
    if (!convName) return;
    thinkingConvRef.current = convName;
    setCopilotThinking(true);
    setSuggestionsHidden(true);
    // Ensure thinking item exists (may already be added by sendCopilotMessage)
    setCopilotItems((prev) => {
      if (prev.some((item) => item.type === "thinking")) return prev;
      return [...prev, { type: "thinking", steps: [], readingKB: false }];
    });

    let stepIdx = 0;
    const steps = [];

    const addStep = () => {
      steps.push(thinkingSteps[stepIdx]);
      const thinkingItem = { type: "thinking", steps: [...steps], readingKB: steps.length >= 3 };
      updateConvCopilotItems(convName, (prev) => {
        const filtered = prev.filter((item) => item.type !== "thinking");
        return [...filtered, thinkingItem];
      });
      stepIdx++;
      if (stepIdx < thinkingSteps.length) {
        thinkingTimerRef.current = setTimeout(addStep, 4000);
      } else {
        thinkingTimerRef.current = setTimeout(() => {
          const idx = aiReplyIndexRef.current % aiReplies.length;
          aiReplyIndexRef.current++;
          const aiItem = {
            type: "ai",
            aiReply: aiReplies[idx],
            aiMessage: aiMessages[idx],
            aiDetails: aiDetails[idx],
            aiReasoning: aiReasonings[idx],
          };
          updateConvCopilotItems(convName, (prev) => {
            const filtered = prev.filter((item) => item.type !== "thinking");
            return [...filtered, aiItem];
          });
          thinkingConvRef.current = null;
          // If still on this conversation, update state; otherwise update cache
          if (selectedConvRef.current?.name === convName) {
            setCopilotThinking(false);
            setSuggestionsHidden(false);
          } else {
            const cached = historyCache.current[convName];
            if (cached) {
              cached.copilotThinking = false;
              cached.suggestionsHidden = false;
            }
          }
        }, 4000);
      }
    };
    thinkingTimerRef.current = setTimeout(addStep, 4000);
  }, [copilotThinking, selectedConv, updateConvCopilotItems]);

  // Keep ref in sync so appendChatMessage can call it without stale closures
  startCopilotThinkingRef.current = startCopilotThinkingFlow;

  /* ─── Stop copilot thinking ─── */
  const stopCopilotThinking = useCallback(() => {
    clearTimeout(thinkingTimerRef.current);
    thinkingConvRef.current = null;
    setCopilotItems((prev) => {
      const filtered = prev.filter((item) => item.type !== "thinking");
      return [...filtered, { type: "skipped" }];
    });
    setCopilotThinking(false);
    setSuggestionsHidden(false);
  }, []);

  /* ─── Send copilot message ─── */
  const sendCopilotMessage = useCallback(() => {
    if (copilotThinking) {
      stopCopilotThinking();
      return;
    }
    const el = copilotEditableRef.current;
    if (!el) return;
    const text = el.textContent.trim();
    if (!text) {
      const copilotInput = el.closest(".copilot-input");
      shakeElement(copilotInput);
      return;
    }
    el.innerHTML = "";
    setCopilotMultiline(false);
    // Add user message + thinking in one update so they render together
    setCopilotItems((prev) => [
      ...prev,
      { type: "user", text },
      { type: "thinking", steps: [], readingKB: false },
    ]);
    setSuggestionsHidden(true);
    // Start the thinking step progression
    startCopilotThinkingFlow();
  }, [copilotThinking, stopCopilotThinking, startCopilotThinkingFlow]);

  /* ─── Insert reply into composer ─── */
  const handleInsertReply = useCallback((text) => {
    const el = composerInputRef.current;
    if (el) {
      el.textContent = text.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
      el.focus();
    }
  }, []);

  /* ─── Select conversation ─── */
  const selectConversation = useCallback((conv) => {
    saveCurrentConv();
    viewConvCache.current[currentView] = conv.name;
    setSelectedConv(conv);
    // Only cancel thinking timer if it does NOT belong to a background conversation
    if (!thinkingConvRef.current || thinkingConvRef.current === conv.name) {
      // Switching to the conversation that owns the timer — keep it running
    } else {
      // Timer belongs to another conversation — it will update cache directly, don't cancel
    }
    restoreOrResetConv(conv);
  }, [saveCurrentConv, restoreOrResetConv, currentView]);

  /* ─── Switch view ─── */
  const switchView = useCallback((view) => {
    saveCurrentConv();
    if (selectedConv) viewConvCache.current[currentView] = selectedConv.name;
    if (onViewChange) onViewChange(view);
  }, [onViewChange, saveCurrentConv, selectedConv, currentView]);

  /* ─── Tab switch ─── */
  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  /* ─── Toggle copilot panel ─── */
  const toggleCopilot = useCallback(() => {
    setCopilotCollapsed((prev) => {
      const panel = copilotPanelRef.current;
      if (panel) {
        if (!prev) {
          // Collapsing: save current width
          savedCopilotWidthRef.current = panel.style.width;
          panel.style.width = "";
        } else {
          // Expanding: restore saved width
          panel.style.width = savedCopilotWidthRef.current;
        }
      }
      return !prev;
    });
  }, []);

  /* ─── Inbox sidebar resize ─── */
  useEffect(() => {
    const resizeZone = document.querySelector(".isb-resize-zone");
    const sidebar = inboxSidebarRef.current;
    if (!resizeZone || !sidebar) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    const onMouseDown = (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = sidebar.getBoundingClientRect().width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(startWidth + (e.clientX - startX), 220), window.innerWidth * 0.7);
      sidebar.style.width = newWidth + "px";
    };
    const onMouseUp = () => {
      if (!isResizing) return;
      isResizing = false;
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

  /* ─── Copilot panel resize ─── */
  useEffect(() => {
    const resizeZone = document.querySelector(".cop-resize-zone");
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

  /* ─── Generate reply button ─── */
  const handleGenerateReply = useCallback(() => {
    const el = copilotEditableRef.current;
    if (el) {
      el.textContent = "Generate reply";
    }
    sendCopilotMessage();
  }, [sendCopilotMessage]);

  /* ─── Copilot scroll → position items near top ─── */
  useEffect(() => {
    const el = copilotScrollRef.current;
    if (!el || copilotItems.length === 0) return;
    const lastItem = copilotItems[copilotItems.length - 1];
    // "user" / "thinking" types: ThinkingSection handles scroll positioning on mount
    // "ai" / "skipped" type: scroll to last user message near top
    if (lastItem.type === "ai" || lastItem.type === "skipped") {
      requestAnimationFrame(() => {
        const userEls = el.querySelectorAll(".copilot-user-msg");
        const lastUserEl = userEls[userEls.length - 1];
        if (lastUserEl) {
          el.scrollTo({ top: Math.max(0, lastUserEl.offsetTop - 18), behavior: "smooth" });
        }
      });
    }
    // "thinking" type: ThinkingSection handles its own scroll positioning
  }, [copilotItems]);

  /* ─── Render messages ─── */
  const renderMessages = () => {
    let firstOut = true;
    return chatMessages.map((m, i) => {
      if (m.da) return <DialogAlertComponent key={i} d={m.da} />;
      const showAuthor = m.dir === "out" && firstOut;
      if (m.dir === "out") firstOut = false;
      return <MessageBubble key={i} m={m} showAuthor={showAuthor} />;
    });
  };

  /* ─── Has selection ─── */
  const hasSelection = selectedConv !== null;

  return (
    <div className={`content${hasSelection ? " has-selection" : ""}`} ref={contentRef}>
      {/* ── Inbox Sidebar ── */}
      <aside className="inbox-sidebar" ref={inboxSidebarRef}>
        <div className="isb-topbar">
          <div className="isb-title-wrap">
            <span className="isb-title">{VIEW_LABELS[currentView]}</span>
            <div className="isb-badge">{items.length}</div>
          </div>
          <div className="isb-actions">
            <button className="btn btn-ghost btn-icon" title="Search">
              <img src="/icons/16px/Search.svg" width={16} height={16} alt="Search" />
            </button>
            <button className="btn btn-ghost btn-icon" title="Filter">
              <img src="/icons/16px/Filter.svg" width={16} height={16} alt="Filter" />
            </button>
          </div>
        </div>
        <div className="isb-list">
          {items.map((c) => (
            <InboxItem
              key={c.name}
              c={c}
              isActive={selectedConv?.name === c.name}
              onClick={() => selectConversation(c)}
            />
          ))}
        </div>
        <div className="isb-resize-zone">
          <div className="isb-resize-handle"></div>
        </div>
      </aside>

      {/* ── Loading state ── */}
      <div id="dialog-loading">
        <div className="empty-state">
          <LoadingSvg />
          <div className="empty-state-content">
            <div className="empty-state-text">
              <p className="empty-state-title">Getting things ready</p>
              <p className="empty-state-description">We are preparing your workspace</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      <div id="dialog-empty">
        <div className="empty-state">
          <EmptyStateSvg />
          <div className="empty-state-content">
            <div className="empty-state-text">
              <p className="empty-state-title">Select a conversation</p>
              <p className="empty-state-description">Choose a conversation from the list on the left to start helping your customer.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dialog (Chat) ── */}
      <div className="dialog">
        <div className={`dialog-topbar${copilotCollapsed ? " copilot-closed" : ""}`}>
          <div className="dialog-title">
            <div
              className="avatar-16"
              style={selectedConv ? { background: selectedConv.bg, color: selectedConv.color } : {}}
            >
              {selectedConv?.initials?.[0] || ""}
            </div>
            <span className="dialog-name">{selectedConv?.name || ""}</span>
          </div>
          <div className="topbar-actions" ref={dialogTopbarActionsRef}>
            <button className="btn btn-ghost btn-icon" title="Snooze">
              <img src="/icons/16px/Snooze.svg" width={16} height={16} alt="Snooze" />
            </button>
            <button className="btn btn-ghost btn-icon" title="Resolve">
              <img src="/icons/16px/CheckCircle.svg" width={16} height={16} alt="Resolve" />
            </button>
            {copilotCollapsed && (
              <div className="copilot-tab-actions">
                <button className="btn btn-ghost btn-icon" title="New message">
                  <img src="/icons/16px/NewMessage.svg" width={16} height={16} alt="New message" />
                </button>
                <button className="btn btn-ghost btn-icon" title="Toggle sidebar" onClick={toggleCopilot}>
                  <img src="/icons/16px/SidebarRight.svg" width={16} height={16} alt="Toggle sidebar" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="dialog-content">
          <div className="chat-scroll" ref={chatScrollRef} onScroll={updateChatBackToBottom}>
            {renderMessages()}
          </div>
        </div>

        <div className="composer-wrap">
          <div className={`composer-back-to-bottom${chatBackToBottom ? " is-visible" : ""}`}>
            <button
              className="btn btn-secondary btn-icon"
              title="Back to bottom"
              onClick={() => chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" })}
            >
              <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" />
            </button>
          </div>
          <div className={`composer${isNoteMode ? " internal-note" : ""}`} ref={composerRef}>
            <div
              className="composer-input"
              contentEditable
              suppressContentEditableWarning
              ref={composerInputRef}
              onInput={() => {
                const el = composerInputRef.current;
                if (el && el.textContent.trim() === "") el.innerHTML = "";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (isNoteMode) sendNote();
                  else sendDialogMessage();
                }
              }}
            />
            <div className="composer-actions">
              <div className="composer-left">
                <button className="btn btn-ghost btn-icon" title="Attach file">
                  <img src="/icons/16px/Attachments.svg" width={16} height={16} alt="Attach file" />
                </button>
                <div className="v-divider"></div>
                <div className="toggle-wrap" onClick={() => setIsNoteMode(!isNoteMode)}>
                  <div className={`toggle${isNoteMode ? " on" : ""}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                  <span className="toggle-label">Internal note</span>
                </div>
              </div>
              <div className="composer-right">
                <div className="composer-right-default" style={{ display: isNoteMode ? "none" : "flex", gap: "4px", alignItems: "center" }}>
                  <button className="btn btn-secondary" onClick={handleGenerateReply} disabled={copilotThinking}>
                    <img src="/icons/16px/AI.svg" width={16} height={16} alt="" />
                    Generate reply
                  </button>
                  <div className="btn-split">
                    <button className="btn btn-accent" onClick={sendDialogMessage}>Send</button>
                    <button className="btn btn-accent btn-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4.5 6.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="composer-right-note" style={{ display: isNoteMode ? "flex" : "none", gap: "4px", alignItems: "center" }}>
                  <button className="btn btn-secondary" onClick={sendNote}>Add note</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cop-resize-zone">
          <div className="cop-resize-handle"></div>
        </div>
      </div>

      {/* ── AI Copilot Panel ── */}
      <div className={`copilot${copilotCollapsed ? " collapsed" : ""}`} ref={copilotPanelRef}>
        <div className="copilot-tabs">
          <div className="tabs-list">
            <div className={`tab${activeTab === "details" ? " active" : ""}`} onClick={() => switchTab("details")}>Details</div>
            <div className={`tab${activeTab === "copilot" ? " active" : ""}`} onClick={() => switchTab("copilot")}>AI Copilot</div>
          </div>
          {!copilotCollapsed && (
            <div className="copilot-tab-actions" ref={copilotTabActionsRef}>
              <button className="btn btn-ghost btn-icon" title="New message">
                <img src="/icons/16px/NewMessage.svg" width={16} height={16} alt="New message" />
              </button>
              <button className="btn btn-ghost btn-icon" title="Toggle sidebar" onClick={toggleCopilot}>
                <img src="/icons/16px/SidebarRight.svg" width={16} height={16} alt="Toggle sidebar" />
              </button>
            </div>
          )}
        </div>

        {/* Copilot Content */}
        <div
          className="copilot-content"
          style={{ display: activeTab === "copilot" ? "" : "none" }}
        >
          <div id="copilot-scroll" className="copilot-scroll" ref={copilotScrollRef} onScroll={updateCopilotBackToBottom}>
            {copilotItems.map((item, i) => {
              if (item.type === "user") {
                return <div key={i} className="copilot-user-msg">{item.text}</div>;
              }
              if (item.type === "thinking") {
                return <ThinkingSection key={`thinking-${i}`} steps={item.steps} readingKB={item.readingKB} scrollContainerRef={copilotScrollRef} />;
              }
              if (item.type === "ai") {
                return (
                  <AiBlock
                    key={i}
                    aiReply={item.aiReply}
                    aiMessage={item.aiMessage}
                    aiDetails={item.aiDetails}
                    aiReasoning={item.aiReasoning}
                    onInsert={handleInsertReply}
                    onRegenerate={() => {
                      setCopilotItems((prev) => prev.filter((_, idx) => idx !== i));
                      startCopilotThinkingFlow();
                    }}
                  />
                );
              }
              if (item.type === "skipped") {
                return (
                  <SkippedBlock
                    key={i}
                    onRetry={() => {
                      setCopilotItems((prev) => prev.filter((_, idx) => idx !== i));
                      startCopilotThinkingFlow();
                    }}
                  />
                );
              }
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
                  <p className="empty-state-description">Ask anything about this customer to get AI&#8209;powered help with replies or loan details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div
          id="copilot-panel-details"
          style={{ display: activeTab === "details" ? "flex" : "none", flex: 1, minHeight: 0 }}
        >
          {selectedConv && <DetailsPanel data={detailsData[selectedConv.name]} />}
        </div>

        {/* Copilot Composer */}
        <div className="copilot-composer" style={{ display: activeTab === "copilot" ? "" : "none" }}>
          <div className={`copilot-back-to-bottom${copilotBackToBottom ? " is-visible" : ""}`}>
            <button
              className="btn btn-secondary btn-icon"
              title="Back to bottom"
              onClick={() => copilotScrollRef.current?.scrollTo({ top: copilotScrollRef.current.scrollHeight, behavior: "smooth" })}
            >
              <img src="/icons/16px/ArrowBottom.svg" width={16} height={16} alt="" />
            </button>
          </div>
          <div className={`copilot-suggestions${suggestionsHidden ? " is-hidden" : ""}`}>
            {["Summarize this conversation", "Draft a reply", "Generate reply"].map((label) => (
              <button
                key={label}
                className="copilot-suggestion"
                onClick={() => {
                  const el = copilotEditableRef.current;
                  if (el) el.textContent = label;
                  sendCopilotMessage();
                }}
              >
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
                if (el && el.textContent.trim() === "") {
                  el.innerHTML = "";
                  setCopilotMultiline(false);
                  setSuggestionsHidden(false);
                } else if (el) {
                  setCopilotMultiline(el.scrollHeight > 40);
                  setSuggestionsHidden(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!copilotThinking) sendCopilotMessage();
                }
              }}
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
