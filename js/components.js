// ── InboxItem ───────────────────────────────────────────────
function InboxItem(c, isActive) {
  return `<div class="isb-item${isActive ? ' active' : ''}">
    <div class="isb-avatar-wrap">
      <div class="isb-avatar" style="background:${c.bg};color:${c.color}">${c.initials}</div>
      <div class="isb-channel">${CH[c.ch]}</div>
    </div>
    <div class="isb-message">
      <div class="isb-header-row">
        <span class="isb-name">${c.name}</span>
        <span class="isb-time">${c.time}</span>
      </div>
      <div class="isb-bottom-row">
        ${c.quote ? '<div class="isb-quote-bar"></div>' : ''}
        <span class="isb-preview">${c.preview}</span>
        ${c.badge ? `<div class="isb-badge">${c.badge}</div>` : ''}
      </div>
    </div>
  </div>`;
}

// ── CopilotContent ──────────────────────────────────────────
function CopilotContent(d) {
  const replyCard = (text, elevated, details) => `
    <div class="card">
      <div class="card-header">
        <span class="card-label">Suggested reply</span>
        <div class="confidence-badge"><div class="confidence-dot"></div><span class="confidence-text">High</span></div>
      </div>
      <div class="card-body"><p>${text}</p></div>
      <div class="card-details-header">
        <div>
          <button class="btn btn-ghost btn-sm">
            Details
            <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt=""/>
          </button>
        </div>
        ${details ? `<div class="card-details-body"><p>${details}</p></div>` : ''}
      </div>
      <div class="card-divider"></div>
      <div class="card-actions">
        <div class="card-actions-left">
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsUp.svg" width="16" height="16" alt=""/></button>
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsDown.svg" width="16" height="16" alt=""/></button>
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/Retry.svg" width="16" height="16" alt=""/></button>
        </div>
        <div class="card-actions-right">
          <button class="btn btn-inverse btn-insert">
            <img src="icons/16px/Copy.svg" width="16" height="16" alt=""/> Insert
          </button>
        </div>
      </div>
    </div>`;

  return `
    <div class="ai-block">
      <div class="ai-reasoning">
        <div>
          <button class="btn btn-ghost btn-sm">
            Reasoning
            <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt=""/>
          </button>
        </div>
        <div class="reasoning-message">${d.reasoning1}</div>
      </div>
      <div class="ai-cards">
        <div class="card">
          <div class="card-summary">
            <div class="card-summary-title">Ticket summary</div>
            <div class="card-summary-text">${d.summary}</div>
          </div>
          <div class="card-details">
            <div class="card-detail-item"><strong>Intent:</strong> ${d.intent}</div>
            <div class="card-detail-item"><strong>Key Facts:</strong> ${d.facts}</div>
            <div class="card-detail-item"><strong>Policy status:</strong> ${d.policy}</div>
            <div class="card-detail-item"><strong>Sentiment:</strong> ${d.sentiment}</div>
          </div>
        </div>
        ${replyCard(d.reply1, false, d.tip)}
      </div>
    </div>
    <div class="ai-block">
      <div class="ai-reasoning">
        <div>
          <button class="btn btn-ghost btn-sm">
            Reasoning
            <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt=""/>
          </button>
        </div>
        <div class="reasoning-message">${d.reasoning2}</div>
      </div>
      <div class="ai-cards">
        ${replyCard(d.reply2, true, d.tip)}
      </div>
    </div>
    `;
}

// ── DetailsContent ──────────────────────────────────────────
function DetailsContent(d) {
  const c = d.contact;
  const t = d.ticket;

  const STATUS_LABELS   = { open: 'Open', pending: 'Pending', closed: 'Closed', snoozed: 'Snoozed' };
  const PRIORITY_LABELS = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

  const ACTION_BTN = '<button class="btn btn-secondary btn-micro btn-icon ds-action-btn"><img src="icons/12px/Edit.svg" width="12" height="12" alt=""/></button>';

  function injectAction(valueHtml) {
    const idx = valueHtml.lastIndexOf('</div>');
    return valueHtml.slice(0, idx) + ACTION_BTN + valueHtml.slice(idx);
  }

  function dsRow(labelText, valueHtml) {
    return `
      <div class="ds-row">
        <div class="ds-label">
          <span class="ds-label-text">${labelText}</span>
        </div>
        ${injectAction(valueHtml)}
      </div>`;
  }

  function dsText(text) {
    return `<div class="ds-value"><span class="ds-value-inner">${text}</span></div>`;
  }

  function dsEmpty(icon, placeholder) {
    return `<div class="ds-value"><img src="icons/16px/${icon}" width="16" height="16" alt=""/><span class="ds-value-inner ds-empty">${placeholder}</span></div>`;
  }

  function tagPills(tags) {
    if (!tags || tags.length === 0) return dsEmpty('Plus.svg', 'Add tags');
    return `<div class="ds-value ds-value-tags">${tags.map(tag =>
      `<div class="tag-pill"><span class="tag-dot" style="background:${tag.color}"></span>${tag.label}</div>`
    ).join('')}</div>`;
  }

  const assigneeHtml = t.assignee
    ? `<div class="ds-value ds-value-user"><div class="avatar avatar-sm" style="background:${t.assignee.bg};color:${t.assignee.color}">${t.assignee.initials[0]}</div><span class="ds-value-inner">${t.assignee.name}</span></div>`
    : dsEmpty('Plus.svg', 'Set assignee');

  const priorityHtml = `<div class="ds-value ds-value-priority ds-priority-${t.priority}"><div class="ds-priority-dot"></div><span class="ds-value-inner">${PRIORITY_LABELS[t.priority]}</span></div>`;

  const statusHtml = `<div class="ds-value"><span class="ds-value-inner ds-status-${t.status}">${STATUS_LABELS[t.status]}</span></div>`;

  return `
    <div class="det-section">
      <div class="det-section-header">
        <button class="btn btn-ghost btn-sm">
          <span>Details</span>
          <img src="icons/16px/ChevronBottom.svg" width="16" height="16" alt="" class="det-chevron"/>
        </button>
      </div>
      <div class="det-section-content">
        <div class="det-section-inner">
          ${dsRow('Name',        dsText(c.name))}
          ${dsRow('Phone',        c.phone ? dsText(c.phone) : dsEmpty('Plus.svg', 'Not set'))}
          ${dsRow('Email',        dsText(c.email))}
          ${dsRow('Tags',         tagPills(c.tags))}
          ${dsRow('External ID',  c.externalId ? dsText(c.externalId) : dsEmpty('Plus.svg', 'Set ID'))}
        </div>
      </div>
    </div>

    <div class="det-section">
      <div class="det-section-header">
        <button class="btn btn-ghost btn-sm">
          <span>Ticket</span>
          <img src="icons/16px/ChevronBottom.svg" width="16" height="16" alt="" class="det-chevron"/>
        </button>
      </div>
      <div class="det-section-content">
        <div class="det-section-inner">
          ${dsRow('ID',         dsText(t.id))}
          ${dsRow('Assignee',   assigneeHtml)}
          ${dsRow('Team inbox', t.teamInbox ? dsText(t.teamInbox) : dsEmpty('Plus.svg', 'Set team'))}
          ${dsRow('Status',     statusHtml)}
          ${dsRow('Tags',       tagPills(t.tags))}
          ${dsRow('Category',   dsText(t.category))}
          ${dsRow('Priority',   priorityHtml)}
        </div>
      </div>
    </div>

    <div class="det-section det-collapsed">
      <div class="det-section-header">
        <button class="btn btn-ghost btn-sm">
          <span>Recent tickets</span>
          <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt="" class="det-chevron"/>
        </button>
      </div>
      ${d.recentTickets && d.recentTickets.length ? `
      <div class="det-section-content">
        <div class="det-section-inner" style="padding: 0 8px 8px;">
          <div class="tli-list" style="padding: 0;">
            ${d.recentTickets.map((rt, i) => `
            <div class="tli${i === 0 ? ' current' : ''}">
              <div class="tli-step">
                <div class="tli-dot tli-dot-${rt.status}"></div>
                ${i < d.recentTickets.length - 1 ? '<div class="tli-line"></div>' : ''}
              </div>
              <div class="tli-body">
                <div class="tli-header">
                  <span class="tli-status">${rt.status.charAt(0).toUpperCase() + rt.status.slice(1)}</span>
                  <span class="tli-date">${rt.date}</span>
                </div>
                <p class="tli-preview">${rt.preview}</p>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>` : ''}
    </div>
  `;
}

// ── DialogAlert ─────────────────────────────────────────────
function DialogAlert(d) {
  const PRIORITY_LABELS = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
  const PRIORITY_ICONS  = {
    critical: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.08937 1.125C7.85592 1.125 8.57016 1.51585 8.9839 2.16113L10.6665 4.78613C11.1407 5.52603 11.1407 6.47397 10.6665 7.21387L8.9839 9.83887C8.57016 10.4842 7.85592 10.875 7.08937 10.875H4.90968C4.14323 10.8748 3.42879 10.4841 3.01515 9.83887L1.33253 7.21387C0.858555 6.47408 0.858555 5.52592 1.33253 4.78613L3.01515 2.16113C3.42879 1.51585 4.14323 1.12516 4.90968 1.125H7.08937Z" fill="currentColor"/><path d="M6.12541 7.5498C6.51182 7.55003 6.82561 7.86354 6.82561 8.25C6.82561 8.63646 6.51182 8.94997 6.12541 8.9502C5.73881 8.9502 5.42522 8.6366 5.42522 8.25C5.42522 7.8634 5.73881 7.5498 6.12541 7.5498ZM6.12541 3.25C6.40136 3.25022 6.62541 3.47399 6.62541 3.75V6.25C6.62541 6.52601 6.40136 6.74978 6.12541 6.75C5.84927 6.75 5.62541 6.52614 5.62541 6.25V3.75C5.62541 3.47386 5.84927 3.25 6.12541 3.25Z" fill="white"/></svg>`,
    high:     `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5ZM6 2.40039C5.04522 2.40039 4.12923 2.77897 3.4541 3.4541C2.77897 4.12923 2.40039 5.04522 2.40039 6H6V2.40039Z" fill="currentColor"/></svg>`,
    medium:   `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5ZM6 2.40039C5.04522 2.40039 4.12923 2.77897 3.4541 3.4541C2.77897 4.12923 2.40039 5.04522 2.40039 6C2.40039 6.95477 2.77898 7.87077 3.4541 8.5459C4.12923 9.22103 5.04522 9.59961 6 9.59961V2.40039Z" fill="currentColor"/></svg>`,
    low:      `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5ZM6 2.40039C5.28799 2.40039 4.59202 2.61126 4 3.00684C3.40804 3.40238 2.94631 3.96433 2.67383 4.62207C2.40138 5.27981 2.32991 6.00389 2.46875 6.70215C2.60766 7.40048 2.95063 8.04243 3.4541 8.5459C3.95757 9.04936 4.59952 9.39234 5.29785 9.53125C5.9961 9.67009 6.7202 9.59861 7.37793 9.32617C8.03567 9.05369 8.59763 8.59196 8.99316 8C9.38874 7.40798 9.59961 6.71201 9.59961 6H6V2.40039Z" fill="currentColor"/></svg>`,
  };

  switch (d.type) {

    case 'date':
      return `<div class="da">
        <div class="da-date-sep">
          <div class="da-line"></div>
          <span>${d.date}</span>
          <div class="da-line"></div>
        </div>
      </div>`;

    case 'ticket-created':
      return `<div class="da da-ticket-created">
        <div class="da-content">
          <span class="da-ticket-title">New ticket created</span>
          <span class="da-ticket-dot">·</span>
          <span class="da-ticket-name">${d.date}</span>
        </div>
      </div>`;

    case 'not-assigned':
      return `<div class="da">
        <span>Ticket is not assigned yet</span>
        <button class="btn btn-secondary">Assign to me</button>
      </div>`;

    case 'assign-to':
      return `<div class="da">
        <span>Ticket assigned to</span>
        <span class="da-name">${d.name}</span>
      </div>`;

    case 'reassigned':
      return `<div class="da">
        <span>Ticket was reassigned from</span>
        <span class="da-name">${d.from}</span>
        <span>to</span>
        <span class="da-name">${d.to}</span>
      </div>`;

    case 'snooze-started':
      return `<div class="da">
        <img src="icons/12px/Clock.svg" width="12" height="12" alt=""/>
        <span>Ticket snoozed until ${d.until}</span>
      </div>`;

    case 'snooze-ended':
      return `<div class="da">
        <img src="icons/12px/Clock.svg" width="12" height="12" alt=""/>
        <span>Ticket snooze ended</span>
      </div>`;

    case 'change-status':
      return `<div class="da">
        <span>Ticket status changed to</span>
        <span class="tag tag-sm">
          <span class="tag-dot"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2.5" y="2.5" width="7" height="7" rx="3.5" fill="${d.color}"/></svg></span>
          <span class="tag-label">${d.status}</span>
        </span>
      </div>`;

    case 'priority':
      return `<div class="da">
        <span>Priority changed to</span>
        <div class="da-priority da-priority-${d.priority}">
          ${PRIORITY_ICONS[d.priority]}
          <span>${PRIORITY_LABELS[d.priority]}</span>
        </div>
      </div>`;

    case 'feedback':
      return `<div class="da">
        <span>Received</span>
        <span class="tag tag-sm">
          <span class="tag-label">${d.score}/${d.total}</span>
        </span>
        <span>feedback points</span>
      </div>`;

    case 'new-chat':
      return `<div class="da">
        <span>${d.text || 'A new version of the AI agent is available'}</span>
        <button class="btn btn-accent">Start new chat</button>
      </div>`;

    default:
      return '';
  }
}

// ── MessageBubble ───────────────────────────────────────────
function MessageBubble(m, showAuthor) {
  const isOut = m.dir === 'out';
  const logo = `<div class="msg-author-logo"><img src="icons/16px/ClarityLogo.svg" width="16" height="16" alt=""/></div>`;
  return `<div class="msg-wrapper ${isOut ? 'outbound' : 'inbound'}">
    <div class="msg-bubble">
      ${showAuthor ? `<div class="msg-author">${logo}<span class="msg-author-name">Agent</span></div>` : ''}
      <div class="msg-body">${m.text}</div>
    </div>
    <span class="msg-time">${m.time}</span>
  </div>`;
}
