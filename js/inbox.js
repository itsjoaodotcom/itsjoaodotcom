document.addEventListener('DOMContentLoaded', () => {
  // Loading state: show Switching Organization illustration for 5s
  document.body.classList.add('is-loading');
  setTimeout(() => document.body.classList.remove('is-loading'), 5000);

  // Composer input: restore placeholder when emptied
  const composerInput = document.querySelector('.composer-input');
  const addNoteBtn = document.querySelector('.composer-right-note button:last-child');
  const dialogSendBtn = document.querySelector('.btn-split .btn-accent:first-child');

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
  let clientReplyIndex = 0;
  let startCopilotAutoThinking = null;

  function appendChatMessage(dir, text) {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const chatScroll = document.getElementById('chat-scroll');
    const el = document.createElement('div');
    el.innerHTML = MessageBubble({ dir, text, time }, false);
    chatScroll.appendChild(el.firstElementChild);
    chatScroll.scrollTop = chatScroll.scrollHeight;
    if (dir === 'in' && startCopilotAutoThinking) startCopilotAutoThinking();
  }

  function sendDialogMessage() {
    const text = composerInput.textContent.trim();
    if (!text) {
      const composer = composerInput.closest('.composer');
      composer.classList.remove('is-shake');
      composer.offsetWidth; // force reflow to restart animation
      composer.classList.add('is-shake');
      return;
    }
    appendChatMessage('out', text);
    composerInput.innerHTML = '';
    composerInput.dispatchEvent(new Event('input'));
    setTimeout(() => {
      const reply = clientReplies[clientReplyIndex % clientReplies.length];
      clientReplyIndex++;
      appendChatMessage('in', reply);
    }, 3000);
  }

  if (composerInput) {
    composerInput.addEventListener('input', () => {
      const isEmpty = composerInput.textContent.trim() === '';
      if (isEmpty) composerInput.innerHTML = '';
      if (addNoteBtn) addNoteBtn.disabled = isEmpty;
    });

    composerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendDialogMessage();
      }
    });
  }

  // Copilot editable: restore placeholder, multiline layout, send message
  const copilotEditable = document.querySelector('.copilot-editable');
  if (copilotEditable) {
    const copilotInput = copilotEditable.closest('.copilot-input');
    const copilotSendBtn = copilotInput.querySelector('button');
    const singleLineH = 40;
    let isMultiline = false;

    const sendIconHTML = copilotSendBtn.innerHTML;
    let currentStepTimer = null;

    const thinkingSteps = [
      'Generating a ticket summary',
      'Drafting reply',
      'Checking customer history',
      'Preparing response',
    ];

    const aiReplies = [
      "Thank you for reaching out. I understand your concern and I'm here to help you resolve this as quickly as possible.",
      "I appreciate your patience. Based on the information provided, I'll be able to assist you effectively.",
      "Thank you for contacting us. I've reviewed the details and I'm ready to provide you with the best solution.",
      "I understand your situation completely. Let me walk you through the steps to resolve this for you.",
    ];
    let aiReplyIndex = 0;

    function buildAiBlock() {
      const reply = aiReplies[aiReplyIndex % aiReplies.length];
      aiReplyIndex++;
      const html = `<div class="ai-block">
        <div class="ai-reasoning" style="opacity:0">
          <div>
            <button class="btn btn-ghost btn-sm">Reasoning <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt=""/></button>
          </div>
          <div class="reasoning-message"></div>
        </div>
        <div class="ai-cards" style="opacity:0;transform:translateY(16px)">
          <div class="card">
            <div class="card-header">
              <span class="card-label">Suggested reply</span>
              <div class="confidence-badge"><div class="confidence-dot"></div><span class="confidence-text">High</span></div>
            </div>
            <div class="card-body"><p>${reply}</p></div>
            <div class="card-details-header">
              <div><button class="btn btn-ghost btn-sm">Details <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt=""/></button></div>
            </div>
            <div class="card-divider"></div>
            <div class="card-actions">
              <div class="card-actions-left">
                <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsUp.svg" width="16" height="16" alt=""/></button>
                <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsDown.svg" width="16" height="16" alt=""/></button>
                <button class="btn btn-ghost btn-icon"><img src="icons/16px/Retry.svg" width="16" height="16" alt=""/></button>
              </div>
              <div class="card-actions-right">
                <button class="btn btn-inverse btn-insert"><img src="icons/16px/Copy.svg" width="16" height="16" alt=""/> Insert</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
      const reasoning = 'Based on the customer\'s message and context, generating a professional and empathetic response.';
      return { html, reply, reasoning };
    }

    function setCopilotThinking(active) {
      if (active) {
        copilotSendBtn.innerHTML = '<img src="icons/16px/Stop.svg" width="16" height="16" alt=""/>';
        copilotSendBtn.classList.remove('btn-accent');
        copilotSendBtn.classList.add('btn-secondary');
      } else {
        copilotSendBtn.innerHTML = sendIconHTML;
        copilotSendBtn.classList.remove('btn-secondary');
        copilotSendBtn.classList.add('btn-accent');
      }
    }

    function stopCopilotThinking() {
      clearTimeout(currentStepTimer);
      currentStepTimer = null;
      const scroll = document.getElementById('copilot-scroll');
      const thinking = scroll.querySelector('.thinking-section');
      if (thinking) thinking.remove();
      setCopilotThinking(false);
    }

    function startCopilotThinking(scroll) {
      if (scroll.querySelector('.thinking-section')) return;

      const thinkingEl = document.createElement('div');
      thinkingEl.className = 'thinking-section';
      thinkingEl.innerHTML = '<div class="thinking-label"><img src="icons/16px/Thinking.svg" width="16" height="16" alt=""/>Thinking…</div><div class="thinking-steps"></div>';
      thinkingEl.style.marginBottom = scroll.clientHeight + 'px';
      scroll.appendChild(thinkingEl);
      setCopilotThinking(true);

      requestAnimationFrame(() => {
        scroll.scrollTop = thinkingEl.offsetTop - 18;
      });

      const removeThinkingMargin = () => {
        thinkingEl.style.marginBottom = '';
        scroll.removeEventListener('scroll', removeThinkingMargin);
      };
      scroll.addEventListener('scroll', removeThinkingMargin);

      const stepsContainer = thinkingEl.querySelector('.thinking-steps');
      let stepIdx = 0;
      function addNextStep() {
        if (!scroll.contains(thinkingEl)) return;
        if (stepIdx > 0) {
          const connectorEl = document.createElement('div');
          connectorEl.className = 'thinking-connector';
          stepsContainer.appendChild(connectorEl);
        }
        const stepEl = document.createElement('div');
        stepEl.className = 'thinking-step';
        stepEl.innerHTML = `<div class="thinking-step-icon"></div><span class="thinking-step-text">${thinkingSteps[stepIdx]}</span>`;
        stepsContainer.appendChild(stepEl);
        stepIdx++;
        if (stepIdx < thinkingSteps.length) {
          currentStepTimer = setTimeout(addNextStep, 4000);
        } else {
          currentStepTimer = setTimeout(() => {
            if (!scroll.contains(thinkingEl)) return;
            const { html, reply, reasoning: reasoningText } = buildAiBlock();
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            const aiBlock = wrapper.firstElementChild;
            thinkingEl.replaceWith(aiBlock);
            setCopilotThinking(false);

            aiBlock.querySelectorAll('.btn-insert').forEach(btn => {
              btn.addEventListener('click', () => {
                const img = btn.querySelector('img');
                img.src = 'icons/16px/Check.svg';
                setTimeout(() => { img.src = 'icons/16px/Copy.svg'; }, 4000);
              });
            });

            const reasoningEl = aiBlock.querySelector('.ai-reasoning');
            const reasoningMsg = aiBlock.querySelector('.reasoning-message');
            const aiCards = aiBlock.querySelector('.ai-cards');

            reasoningEl.style.transition = 'opacity 0.4s ease';
            requestAnimationFrame(() => requestAnimationFrame(() => {
              reasoningEl.style.opacity = '1';
              let i = 0;
              function typeChar() {
                if (i < reasoningText.length) {
                  reasoningMsg.textContent += reasoningText[i++];
                  scroll.scrollTop = scroll.scrollHeight;
                  setTimeout(typeChar, 18);
                } else {
                  aiCards.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                  aiCards.style.opacity = '1';
                  aiCards.style.transform = 'translateY(0)';
                  setTimeout(() => { scroll.scrollTop = scroll.scrollHeight; }, 500);
                }
              }
              typeChar();
            }));
          }, 4000);
        }
      }
      currentStepTimer = setTimeout(addNextStep, 4000);
    }

    startCopilotAutoThinking = () => {
      const scroll = document.getElementById('copilot-scroll');
      startCopilotThinking(scroll);
    };

    function sendCopilotMessage() {
      const scroll = document.getElementById('copilot-scroll');
      if (scroll.querySelector('.thinking-section')) {
        stopCopilotThinking();
        return;
      }
      const text = copilotEditable.textContent.trim();
      if (!text) {
        copilotInput.classList.remove('is-shake');
        copilotInput.offsetWidth;
        copilotInput.classList.add('is-shake');
        return;
      }
      const msgEl = document.createElement('div');
      msgEl.className = 'copilot-user-msg';
      msgEl.textContent = text;
      scroll.appendChild(msgEl);

      startCopilotThinking(scroll);

      requestAnimationFrame(() => {
        const msgTop = msgEl.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
        scroll.scrollTop = msgTop - 18;
      });
      copilotEditable.innerHTML = '';
      isMultiline = false;
      copilotInput.classList.remove('multiline');
    }

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
    });

    copilotEditable.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const scroll = document.getElementById('copilot-scroll');
        if (scroll.querySelector('.thinking-section')) return;
        sendCopilotMessage();
      }
    });

    copilotSendBtn.addEventListener('click', sendCopilotMessage);
  }

  const chatScroll = document.querySelector('.chat-scroll');
  const copilotScroll = document.querySelector('.copilot-scroll');
  if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight;
  if (copilotScroll) copilotScroll.scrollTop = copilotScroll.scrollHeight;

  const backToBottom = document.querySelector('.composer-back-to-bottom');
  const backToBottomBtn = backToBottom && backToBottom.querySelector('button');
  function updateBackToBottom() {
    if (!chatScroll || !backToBottom) return;
    const atBottom = chatScroll.scrollHeight - chatScroll.scrollTop - chatScroll.clientHeight < 8;
    backToBottom.classList.toggle('is-visible', !atBottom);
  }
  if (chatScroll) chatScroll.addEventListener('scroll', updateBackToBottom);
  if (backToBottomBtn) backToBottomBtn.addEventListener('click', () => {
    chatScroll.scrollTo({ top: chatScroll.scrollHeight, behavior: 'smooth' });
  });

  const copilotBackToBottom = document.querySelector('.copilot-back-to-bottom');
  const copilotBackToBottomBtn = copilotBackToBottom && copilotBackToBottom.querySelector('button');
  function updateCopilotBackToBottom() {
    if (!copilotScroll || !copilotBackToBottom) return;
    const atBottom = copilotScroll.scrollHeight - copilotScroll.scrollTop - copilotScroll.clientHeight < 8;
    copilotBackToBottom.classList.toggle('is-visible', !atBottom);
  }
  if (copilotScroll) copilotScroll.addEventListener('scroll', updateCopilotBackToBottom);
  if (copilotBackToBottomBtn) copilotBackToBottomBtn.addEventListener('click', () => {
    copilotScroll.scrollTo({ top: copilotScroll.scrollHeight, behavior: 'smooth' });
  });

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

  // Send button → send message to dialog
  if (dialogSendBtn) {
    dialogSendBtn.addEventListener('click', sendDialogMessage);
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
      copilotScroll.querySelectorAll('.card-details-header button').forEach(btn => {
        btn.addEventListener('click', () => {
          const header = btn.closest('.card-details-header');
          const isOpen = header.classList.toggle('is-open');
          const img = btn.querySelector('img');
          if (img) img.src = isOpen ? 'icons/16px/ChevronTop.svg' : 'icons/16px/ChevronRight.svg';
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
