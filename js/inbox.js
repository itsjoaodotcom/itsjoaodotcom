document.addEventListener('DOMContentLoaded', () => {
  // Loading state: show Switching Organization illustration for 5s
  document.body.classList.add('is-loading');
  setTimeout(() => document.body.classList.remove('is-loading'), 5000);

  // Composer input: restore placeholder when emptied
  const composerInput = document.querySelector('.composer-input');
  const addNoteBtn = document.querySelector('.composer-right-note button:last-child');
  if (composerInput) {
    composerInput.addEventListener('input', () => {
      const isEmpty = composerInput.textContent.trim() === '';
      if (isEmpty) composerInput.innerHTML = '';
      if (addNoteBtn) addNoteBtn.disabled = isEmpty;
    });
  }

  // Copilot editable: restore placeholder when emptied + toggle multiline layout
  const copilotEditable = document.querySelector('.copilot-editable');
  if (copilotEditable) {
    const copilotInput = copilotEditable.closest('.copilot-input');
    const copilotSendBtn = copilotInput.querySelector('button');
    // 40 = min-height from CSS (padding 12 + line-height 16 + padding 12)
    // offsetHeight is read during the input event when the element IS visible
    const singleLineH = 40;
    let isMultiline = false;

    copilotEditable.addEventListener('input', () => {
      const isEmpty = copilotEditable.textContent.trim() === '';
      if (isEmpty) {
        copilotEditable.innerHTML = '';
        isMultiline = false;
      } else {
        const h = copilotEditable.scrollHeight;
        if (!isMultiline && h > singleLineH) isMultiline = true;
        else if (isMultiline && h <= singleLineH) isMultiline = false;
      }
      copilotInput.classList.toggle('multiline', isMultiline);
      copilotSendBtn.disabled = isEmpty;
    });
  }

  const chatScroll = document.querySelector('.chat-scroll');
  const copilotScroll = document.querySelector('.copilot-scroll');
  if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight;
  if (copilotScroll) copilotScroll.scrollTop = copilotScroll.scrollHeight;

  const toggle = document.querySelector('.toggle');
  const composer = document.querySelector('.composer');
  const rightDefault = document.querySelector('.composer-right-default');
  const rightNote = document.querySelector('.composer-right-note');
  const composerPlaceholder = document.querySelector('.composer-placeholder');
  toggle.addEventListener('click', () => {
    const isOn = toggle.classList.toggle('on');
    composer.classList.toggle('internal-note', isOn);
    rightDefault.style.display = isOn ? 'none' : 'flex';
    rightNote.style.display = isOn ? 'flex' : 'none';
    composerPlaceholder.textContent = isOn ? 'Leave an internal note…' : 'Write your answer…';
  });

  document.querySelectorAll('.tabs-list .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tabs-list .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.tab;
      document.getElementById('copilot-panel-copilot').style.display = which === 'copilot' ? '' : 'none';
      document.getElementById('copilot-panel-details').style.display = which === 'details' ? 'flex' : 'none';
      document.getElementById('copilot-composer').style.display = which === 'copilot' ? '' : 'none';
    });
  });

  const toggleCopilotBtn = document.getElementById('toggle-copilot-btn');
  const copilotPanel = document.querySelector('.copilot');
  const copilotTabs = document.getElementById('copilot-tabs');
  const copilotTabActions = document.querySelector('.copilot-tab-actions');
  const dialogTopbarActions = document.getElementById('dialog-topbar-actions');
  const dialogTopbar = document.querySelector('.dialog-topbar');

  let savedCopilotWidth = '';
  toggleCopilotBtn.addEventListener('click', () => {
    const isCollapsed = copilotPanel.classList.toggle('collapsed');
    dialogTopbar.classList.toggle('copilot-closed', isCollapsed);
    if (isCollapsed) {
      savedCopilotWidth = copilotPanel.style.width;
      copilotPanel.style.width = '';
      dialogTopbarActions.appendChild(copilotTabActions);
    } else {
      copilotPanel.style.width = savedCopilotWidth;
      copilotTabs.appendChild(copilotTabActions);
    }
  });

  const collapseBtn = document.getElementById('collapse-sidebar-btn');
  const sidebarNav = document.querySelector('.sidebar-nav');
  collapseBtn.addEventListener('click', () => {
    sidebarNav.classList.toggle('collapsed');
  });

  // Nav group collapse/expand
  let firstExpandable = null;
  document.querySelectorAll('.snav-item').forEach(item => {
    const chevron = item.querySelector('.snav-chevron');
    if (!chevron) return;
    const subitems = item.nextElementSibling;
    if (!subitems || !subitems.classList.contains('snav-subitems')) return;
    subitems.classList.add('collapsed');
    if (!firstExpandable) firstExpandable = item;
    item.querySelector('.snav-link').addEventListener('click', () => {
      const isExpanded = item.classList.toggle('expanded');
      subitems.classList.toggle('collapsed');
      const chevronImg = chevron.querySelector('img');
      if (chevronImg) {
        chevronImg.src = isExpanded ? 'icons/16px/ChevronBottom.svg' : 'icons/16px/ChevronRight.svg';
      }
    });
  });
  if (firstExpandable) {
    firstExpandable.classList.add('expanded');
    firstExpandable.nextElementSibling.classList.remove('collapsed');
    const firstChevronImg = firstExpandable.querySelector('.snav-chevron img');
    if (firstChevronImg) firstChevronImg.src = 'icons/16px/ChevronBottom.svg';
  }
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  // Send button → append Thinking to copilot
  const sendBtn = document.querySelector('.btn-split .btn-accent:first-child');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const copilotScroll = document.getElementById('copilot-scroll');
      if (!copilotScroll) return;
      const thinking = document.createElement('div');
      thinking.className = 'thinking-section';
      thinking.innerHTML = '<div class="thinking-item"><span class="thinking-text">Thinking…</span></div>';
      copilotScroll.appendChild(thinking);
      copilotScroll.scrollTop = copilotScroll.scrollHeight;
    });
  }

  // ── Render functions ────────────────────────────────────
  function renderDialog(c) {
    const chatScroll = document.getElementById('chat-scroll');
    const dialogName = document.getElementById('dialog-name');
    const dialogAvatar = document.getElementById('dialog-avatar');
    dialogName.textContent = c.name;
    dialogAvatar.textContent = c.initials[0];
    dialogAvatar.style.background = c.bg;
    dialogAvatar.style.color = c.color;
    const msgs = conversations[c.name] || [];
    let firstOut = true;
    chatScroll.innerHTML = msgs.map(m => {
      if (m.da) return DialogAlert(m.da);
      const showAuthor = m.dir === 'out' && firstOut;
      if (m.dir === 'out') firstOut = false;
      return MessageBubble(m, showAuthor);
    }).join('');
    chatScroll.scrollTop = chatScroll.scrollHeight;

    const copilotScroll = document.getElementById('copilot-scroll');
    const d = copilotData[c.name];
    if (copilotScroll && d) {
      copilotScroll.innerHTML = CopilotContent(d);
      copilotScroll.scrollTop = copilotScroll.scrollHeight;
      copilotScroll.querySelectorAll('.btn-insert').forEach(btn => {
        btn.addEventListener('click', () => {
          const img = btn.querySelector('img');
          img.src = 'icons/16px/Check.svg';
          setTimeout(() => { img.src = 'icons/16px/Copy.svg'; }, 4000);
        });
      });
    }

    const detailsPanel = document.getElementById('copilot-panel-details');
    const dd = detailsData[c.name];
    if (detailsPanel && dd) {
      detailsPanel.innerHTML = DetailsContent(dd);
      detailsPanel.querySelectorAll('.det-section-header button').forEach(btn => {
        btn.addEventListener('click', () => {
          const section = btn.closest('.det-section');
          const content = section.querySelector('.det-section-content');
          const chevron = btn.querySelector('img');

          if (!content) return; // sections with no content (e.g. Recent tickets placeholder)

          if (section.classList.contains('det-collapsed')) {
            // Expanding: set explicit 0 → scrollHeight
            content.style.height = '0';
            section.classList.remove('det-collapsed');
            content.offsetHeight; // force reflow
            content.style.height = content.scrollHeight + 'px';
            content.addEventListener('transitionend', () => {
              content.style.height = 'auto';
            }, { once: true });
            chevron.src = 'icons/16px/ChevronBottom.svg';
          } else {
            // Collapsing: scrollHeight → 0
            content.style.height = content.scrollHeight + 'px';
            content.offsetHeight; // force reflow
            content.style.height = '0';
            section.classList.add('det-collapsed');
            chevron.src = 'icons/16px/ChevronRight.svg';
          }
        });
      });
    }
  }

  function renderInbox(view) {
    const list = document.getElementById('isb-list');
    const title = document.getElementById('isb-title');
    const count = document.getElementById('isb-count');
    const items = allConversations.filter(c => c.views.includes(view));
    title.textContent = VIEW_LABELS[view];
    count.textContent = items.length;
    list.innerHTML = items.map(c => InboxItem(c, false)).join('');
  }

  renderInbox('assigned');

  document.querySelectorAll('.snav-sublink[data-view]').forEach(link => {
    link.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.snav-sublink[data-view]').forEach(l => l.closest('.snav-subitem').classList.remove('active'));
      link.closest('.snav-subitem').classList.add('active');
      renderInbox(link.dataset.view);
      content.classList.remove('has-selection');
      const copilotScroll = document.getElementById('copilot-scroll');
      if (copilotScroll) copilotScroll.innerHTML = '';
    });
  });

  // Click conversation → update dialog
  const content = document.querySelector('.content');
  document.getElementById('isb-list').addEventListener('click', e => {
    const item = e.target.closest('.isb-item');
    if (!item) return;
    document.querySelectorAll('#isb-list .isb-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    content.classList.add('has-selection');
    const name = item.querySelector('.isb-name')?.textContent;
    const conv = allConversations.find(c => c.name === name);
    if (conv) renderDialog(conv);
  });

  // ── Inbox sidebar resize ──────────────────────────────────
  const inboxSidebar = document.querySelector('.inbox-sidebar');
  const resizeZone = document.querySelector('.isb-resize-zone');
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  resizeZone.addEventListener('mousedown', e => {
    isResizing = true;
    startX = e.clientX;
    startWidth = inboxSidebar.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isResizing) return;
    const newWidth = Math.min(
      Math.max(startWidth + (e.clientX - startX), 220),
      window.innerWidth * 0.7
    );
    inboxSidebar.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  // ── Copilot panel resize ──────────────────────────────────
  const copResizeZone = document.querySelector('.cop-resize-zone');
  let isCopResizing = false;
  let copStartX = 0;
  let copStartWidth = 0;

  copResizeZone.addEventListener('mousedown', e => {
    isCopResizing = true;
    copStartX = e.clientX;
    copStartWidth = copilotPanel.getBoundingClientRect().width;
    copilotPanel.style.transition = 'none';
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isCopResizing) return;
    const newWidth = Math.min(
      Math.max(copStartWidth - (e.clientX - copStartX), 220),
      window.innerWidth * 0.7
    );
    copilotPanel.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isCopResizing) return;
    isCopResizing = false;
    copilotPanel.style.transition = '';
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
});
