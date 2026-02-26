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
  const replyCard = (text, elevated) => `
    <div class="card${elevated ? ' elevated' : ''}">
      <div class="card-header">
        <span class="card-label">Suggested reply</span>
        <div class="confidence-badge"><div class="confidence-dot"></div><span class="confidence-text">High</span></div>
      </div>
      <div class="card-body"><p>${text}</p></div>
      <div class="card-divider"></div>
      <div class="card-actions">
        <div class="card-actions-left">
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsUp.svg" width="16" height="16" alt=""/></button>
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsDown.svg" width="16" height="16" alt=""/></button>
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/Retry.svg" width="16" height="16" alt=""/></button>
        </div>
        <div class="card-actions-right">
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/Info.svg" width="16" height="16" alt=""/></button>
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
          <div class="internal-tip">
            <svg class="internal-tip-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2C5 2 2.5 4.5 2.5 7.5c0 2 1.1 3.8 2.75 4.75V14h5.5v-1.75A5 5 0 0 0 13.5 7.5C13.5 4.5 11 2 8 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              <path d="M5.5 14h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            <span class="internal-tip-text">${d.tip}</span>
          </div>
        </div>
        ${replyCard(d.reply1, false)}
        <div class="card">
          <div class="card-header"><span class="card-label">Suggested action</span></div>
          <div class="card-body"><p>${d.action}</p></div>
          <div class="card-divider"></div>
          <div class="card-footer-actions">
            <button class="btn btn-ghost">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Confirmed
            </button>
          </div>
        </div>
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
        ${replyCard(d.reply2, true)}
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
  const PRIORITY_ICONS  = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

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
      return `<div class="da">
        <div class="da-date-sep">
          <div class="da-line"></div>
          <span>${d.date}</span>
          <div class="da-line"></div>
        </div>
      </div>
      <div class="da">
        <span class="da-ticket-title">New ticket created</span>
        <span class="da-ticket-dot">·</span>
        <span class="da-ticket-name">${d.name}</span>
      </div>`;

    case 'not-assigned':
      return `<div class="da">
        <span>Ticket is not assigned yet</span>
        <button class="btn btn-secondary btn-sm">Assign to me</button>
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
        <div class="da-tag">
          <div class="da-tag-dot" style="background:${d.color}"></div>
          <span>${d.status}</span>
        </div>
      </div>`;

    case 'priority':
      return `<div class="da">
        <span>Priority changed to</span>
        <div class="da-priority da-priority-${d.priority}">
          <img src="icons/12px/${PRIORITY_ICONS[d.priority]}.svg" width="12" height="12" alt=""/>
          <span>${PRIORITY_LABELS[d.priority]}</span>
        </div>
      </div>`;

    case 'feedback':
      return `<div class="da">
        <span>Received</span>
        <div class="da-feedback-tag">
          <span class="da-score">${d.score}</span><span class="da-total">/${d.total}</span>
        </div>
        <span>feedback points</span>
      </div>`;

    case 'new-chat':
      return `<div class="da">
        <span>${d.text || 'A new version of the AI agent is available'}</span>
        <button class="btn btn-accent btn-sm">Start new chat</button>
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
