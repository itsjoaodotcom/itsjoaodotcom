document.addEventListener('DOMContentLoaded', () => {
  // Composer input: restore placeholder when emptied
  const composerInput = document.querySelector('.composer-input');
  if (composerInput) {
    composerInput.addEventListener('input', () => {
      if (composerInput.innerHTML === '<br>' || composerInput.innerHTML === '') {
        composerInput.innerHTML = '';
      }
    });
  }

  // Copilot editable: restore placeholder when emptied + toggle multiline layout
  const copilotEditable = document.querySelector('.copilot-editable');
  if (copilotEditable) {
    const copilotInput = copilotEditable.closest('.copilot-input');
    const singleLineHeight = 40; // 10px padding-top + 20px line-height + 10px padding-bottom

    copilotEditable.addEventListener('input', () => {
      if (copilotEditable.innerHTML === '<br>' || copilotEditable.innerHTML === '') {
        copilotEditable.innerHTML = '';
      }
      copilotInput.classList.toggle('multiline', copilotEditable.scrollHeight > singleLineHeight);
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

  toggleCopilotBtn.addEventListener('click', () => {
    const isCollapsed = copilotPanel.classList.toggle('collapsed');
    dialogTopbar.classList.toggle('copilot-closed', isCollapsed);
    if (isCollapsed) {
      dialogTopbarActions.appendChild(copilotTabActions);
    } else {
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

  // ── Render functions ────────────────────────────────────
  function renderDialog(name) {
    const chatScroll = document.getElementById('chat-scroll');
    const dialogName = document.getElementById('dialog-name');
    dialogName.textContent = name;
    const msgs = conversations[name] || [];
    let firstOut = true;
    chatScroll.innerHTML = msgs.map(m => {
      const showAuthor = m.dir === 'out' && firstOut;
      if (m.dir === 'out') firstOut = false;
      return MessageBubble(m, showAuthor);
    }).join('');
    chatScroll.scrollTop = chatScroll.scrollHeight;
  }

  function renderInbox(view) {
    const list = document.getElementById('isb-list');
    const title = document.getElementById('isb-title');
    const count = document.getElementById('isb-count');
    const items = allConversations.filter(c => c.views.includes(view));
    title.textContent = VIEW_LABELS[view];
    count.textContent = items.length;
    list.innerHTML = items.map((c, i) => InboxItem(c, i === 0)).join('');
  }

  renderInbox('assigned');

  document.querySelectorAll('.snav-sublink[data-view]').forEach(link => {
    link.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.snav-sublink[data-view]').forEach(l => l.closest('.snav-subitem').classList.remove('active'));
      link.closest('.snav-subitem').classList.add('active');
      renderInbox(link.dataset.view);
    });
  });

  // Click conversation → update dialog
  document.getElementById('isb-list').addEventListener('click', e => {
    const item = e.target.closest('.isb-item');
    if (!item) return;
    document.querySelectorAll('#isb-list .isb-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const name = item.querySelector('.isb-name')?.textContent;
    if (name) renderDialog(name);
  });

  // Insert button: Copy → Check → Copy
  document.querySelectorAll('.btn-insert').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      img.src = 'icons/16px/Check.svg';
      setTimeout(() => { img.src = 'icons/16px/Copy.svg'; }, 4000);
    });
  });
});
