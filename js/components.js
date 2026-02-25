// ── InboxItem ───────────────────────────────────────────────
function InboxItem(c, isActive) {
  return `<div class="isb-item${isActive ? ' active' : ''}">
    <div class="isb-avatar-wrap">
      <div class="isb-avatar" style="background:${c.bg}">${c.initials}</div>
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
