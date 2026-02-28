function slideOpen(el, onDone) {
  el.style.display = 'block';
  el.style.overflow = 'hidden';
  el.style.height = '0';
  el.style.opacity = '0';
  void el.offsetHeight; // force reflow
  el.style.transition = 'height 0.25s ease, opacity 0.2s ease';
  el.style.height = el.scrollHeight + 'px';
  el.style.opacity = '1';
  el.addEventListener('transitionend', function handler(e) {
    if (e.propertyName !== 'height') return;
    el.removeEventListener('transitionend', handler);
    el.style.height = 'auto';
    el.style.overflow = '';
    el.style.transition = '';
    el.style.opacity = '';
    if (onDone) onDone();
  });
}

function slideClose(el, onDone) {
  el.style.height = el.scrollHeight + 'px';
  el.style.overflow = 'hidden';
  void el.offsetHeight; // force reflow
  el.style.transition = 'height 0.25s ease, opacity 0.2s ease';
  el.style.height = '0';
  el.style.opacity = '0';
  el.addEventListener('transitionend', function handler(e) {
    if (e.propertyName !== 'height') return;
    el.removeEventListener('transitionend', handler);
    el.style.display = 'none';
    el.style.height = '';
    el.style.opacity = '';
    el.style.overflow = '';
    el.style.transition = '';
    if (onDone) onDone();
  });
}

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
  let stopCopilotAutoThinking = null;
  let scrollResizeObserver = null;

  function appendChatMessage(dir, text, isNote = false) {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const chatScroll = document.getElementById('chat-scroll');
    const el = document.createElement('div');
    el.innerHTML = MessageBubble({ dir, text, time, isNote }, false);
    chatScroll.appendChild(el.firstElementChild);
    chatScroll.scrollTop = chatScroll.scrollHeight;
    if (dir === 'in' && startCopilotAutoThinking) setTimeout(startCopilotAutoThinking, 500);
  }

  function sendDialogMessage() {
    if (composerInput.closest('.composer').classList.contains('internal-note')) return;
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
        const isNote = composerInput.closest('.composer').classList.contains('internal-note');
        if (isNote) {
          const text = composerInput.textContent.trim();
          if (!text) return;
          appendChatMessage('out', text, true);
          composerInput.innerHTML = '';
          composerInput.dispatchEvent(new Event('input'));
        } else {
          sendDialogMessage();
        }
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
    let streamingInterval = null;

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
      `<p>The customer is disputing a charge that appeared on their account. They believe the transaction was unauthorised and are requesting a refund. There is no prior contact on this specific charge.</p>
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
<p>For disputed transactions, the standard process is to freeze the card immediately, open a chargeback case, and inform the customer of the timeline (typically 5–10 business days for resolution).</p>`,
      `<p>The customer is asking about plan limits and whether upgrading would benefit them. They are on the Standard plan and have hit their monthly transfer limit twice in the last 30 days.</p>
<p>Here's a summary of the ticket:</p>
<ul>
  <li>Customer on Standard plan, hitting transfer limits.</li>
  <li>Interested in higher limits and additional features.</li>
  <li>Has been a customer for 14 months with a good standing account.</li>
</ul>
<div class="reasoning-sources">
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/8/102">articles/8/102</a>
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/8/117">articles/8/117</a>
  <a class="reasoning-source" href="/ai-hub/knowledge-base/articles/8/134">articles/8/134</a>
</div>
<p>The Premium plan offers 5× higher transfer limits, priority support, and free international ATM withdrawals up to €400/month. Given the customer's usage history, this would resolve their current friction points.</p>`,
      `<p>The customer cannot log in to their account. They report that the verification code is not arriving via SMS. The account was last accessed 6 days ago without issues.</p>
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
<p>Common causes include SMS carrier delays, number portability issues, or spam filters. The recommended resolution path is to offer an alternative verification method (email or authenticator app) and check if the number has recently been ported.</p>`,
    ];

    let aiReplyIndex = 0;

    function buildAiBlock() {
      const idx = aiReplyIndex % aiReplies.length;
      const reply = aiReplies[idx];
      const aiMessage = aiMessages[idx];
      const details = aiDetails[idx];
      const reasoning = aiReasonings[idx];
      aiReplyIndex++;
      const html = `<div class="ai-block">
        <div class="ai-reasoning" style="opacity:0">
          <div>
            <button class="btn btn-ghost btn-sm">Reasoning <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt=""/></button>
          </div>
          <div class="reasoning-message"></div>
        </div>
        <div class="ai-message" style="opacity:0">
          <p>${aiMessage}</p>
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
              <div class="card-details-body">
                <p>${details}</p>
              </div>
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
      if (scrollResizeObserver) { scrollResizeObserver.disconnect(); scrollResizeObserver = null; }
      const scroll = document.getElementById('copilot-scroll');
      const thinking = scroll.querySelector('.thinking-section');
      if (!thinking) { setCopilotThinking(false); return; }

      const prevEl = thinking.previousElementSibling;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `<div class="ai-block">
        <div class="ai-reasoning">
          <div>
            <button class="btn btn-ghost btn-sm">Reasoning <img src="icons/16px/ChevronRight.svg" width="16" height="16" alt=""/></button>
          </div>
          <div class="reasoning-message"></div>
        </div>
        <div class="ai-message">
          <p class="ai-skipped-label" style="color:var(--content-tertiary)">Answer skipped</p>
        </div>
        <div class="card-actions-left" style="padding-left:2px">
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsUp.svg" width="16" height="16" alt=""/></button>
          <button class="btn btn-ghost btn-icon"><img src="icons/16px/ThumbsDown.svg" width="16" height="16" alt=""/></button>
          <button class="btn btn-ghost btn-icon ai-retry-btn"><img src="icons/16px/Retry.svg" width="16" height="16" alt=""/></button>
        </div>
      </div>`;
      const skippedBlock = wrapper.firstElementChild;
      thinking.replaceWith(skippedBlock);

      const reasoningBtn = skippedBlock.querySelector('.ai-reasoning button');
      const reasoningMsg = skippedBlock.querySelector('.reasoning-message');
      const chevronImg = reasoningBtn.querySelector('img');
      chevronImg.style.transition = 'transform 0.2s ease';
      let reasoningOpen = false;
      reasoningBtn.addEventListener('click', () => {
        reasoningOpen = !reasoningOpen;
        reasoningOpen ? slideOpen(reasoningMsg) : slideClose(reasoningMsg);
        chevronImg.style.transform = reasoningOpen ? 'rotate(90deg)' : '';
      });

      skippedBlock.querySelector('.ai-retry-btn').addEventListener('click', () => {
        const existingSpacer = scroll.querySelector('.copilot-ai-spacer');
        if (existingSpacer) existingSpacer.remove();
        skippedBlock.remove();
        startCopilotThinking(scroll);
      });

      const existingSpacer = scroll.querySelector('.copilot-ai-spacer');
      if (existingSpacer) existingSpacer.remove();
      const aiSpacer = document.createElement('div');
      aiSpacer.className = 'copilot-ai-spacer';
      aiSpacer.style.flexShrink = '0';
      const updateAiSpacer = () => {
        if (!prevEl) { aiSpacer.style.height = '0'; return; }
        aiSpacer.style.height = Math.max(0, scroll.clientHeight - prevEl.offsetHeight - skippedBlock.offsetHeight - 78) + 'px';
        updateCopilotBackToBottom();
      };
      updateAiSpacer();
      scroll.appendChild(aiSpacer);
      scroll.scrollTo({ top: prevEl ? prevEl.offsetTop - 18 : 0, behavior: 'smooth' });

      setCopilotThinking(false);
    }

    function startCopilotThinking(scroll) {
      if (scroll.querySelector('.thinking-section')) return;

      if (scrollResizeObserver) { scrollResizeObserver.disconnect(); scrollResizeObserver = null; }

      const existingSpacer = scroll.querySelector('.copilot-ai-spacer');
      if (existingSpacer) existingSpacer.remove();

      const prevEl = scroll.lastElementChild;

      const thinkingEl = document.createElement('div');
      thinkingEl.className = 'thinking-section';
      thinkingEl.innerHTML = '<div class="thinking-label"><img src="icons/16px/Thinking.svg" width="14" height="14" alt=""/><span class="thinking-text">Thinking</span><span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span></div><div class="thinking-steps"></div>';

      thinkingEl.style.height = (prevEl ? Math.max(0, scroll.clientHeight - prevEl.offsetHeight - 58) : scroll.clientHeight) + 'px';
      scroll.appendChild(thinkingEl);
      setCopilotThinking(true);
      scroll.scrollTo({ top: prevEl ? prevEl.offsetTop - 18 : 0, behavior: 'smooth' });

      let onResizeFn = () => {};
      scrollResizeObserver = new ResizeObserver(() => onResizeFn());
      scrollResizeObserver.observe(scroll);
      onResizeFn = () => {
        if (scroll.contains(thinkingEl)) {
          thinkingEl.style.height = (prevEl ? Math.max(0, scroll.clientHeight - prevEl.offsetHeight - 58) : scroll.clientHeight) + 'px';
        }
        scroll.scrollTo({ top: prevEl ? prevEl.offsetTop - 18 : 0, behavior: 'auto' });
      };

      const stepsContainer = thinkingEl.querySelector('.thinking-steps');
      let stepIdx = 0;

      function transformThinkingLabel() {
        if (!scroll.contains(thinkingEl)) return;
        const textSpan = thinkingEl.querySelector('.thinking-text');
        const img = thinkingEl.querySelector('.thinking-label img');
        const dots = thinkingEl.querySelector('.thinking-dots');
        if (!textSpan) return;
        dots.style.transition = 'opacity 0.2s';
        dots.style.opacity = '0';
        const newText = 'Reading KB';
        let currentText = textSpan.textContent;
        const deleteInterval = setInterval(() => {
          if (!scroll.contains(thinkingEl)) { clearInterval(deleteInterval); return; }
          if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
            textSpan.textContent = currentText;
          } else {
            clearInterval(deleteInterval);
            img.src = 'icons/16px/Knowledge.svg';
            img.width = 14; img.height = 14;
            let typeIdx = 0;
            const typeInterval = setInterval(() => {
              if (!scroll.contains(thinkingEl)) { clearInterval(typeInterval); return; }
              if (typeIdx < newText.length) {
                textSpan.textContent += newText[typeIdx++];
              } else {
                clearInterval(typeInterval);
                dots.style.opacity = '1';
              }
            }, 50);
          }
        }, 40);
      }

      const collectedSteps = [];

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
        collectedSteps.push(thinkingSteps[stepIdx]);
        stepIdx++;
        if (stepIdx === 3) setTimeout(transformThinkingLabel, 700);
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
            const aiSpacer = document.createElement('div');
            aiSpacer.className = 'copilot-ai-spacer';
            aiSpacer.style.flexShrink = '0';
            function updateAiSpacer() {
              if (!prevEl) { aiSpacer.style.height = '0'; return; }
              aiSpacer.style.height = Math.max(0, scroll.clientHeight - prevEl.offsetHeight - aiBlock.offsetHeight - 78) + 'px';
              updateCopilotBackToBottom();
            }
            updateAiSpacer();
            scroll.appendChild(aiSpacer);
            onResizeFn = () => {
              if (!prevEl) { aiSpacer.style.height = '0'; return; }
              aiSpacer.style.height = Math.max(0, scroll.clientHeight - prevEl.offsetHeight - aiBlock.offsetHeight - 78) + 'px';
              scroll.scrollTo({ top: prevEl.offsetTop - 18, behavior: 'auto' });
            };
            setCopilotThinking(false);
            scroll.scrollTo({ top: prevEl ? prevEl.offsetTop - 18 : 0, behavior: 'smooth' });

            aiBlock.querySelectorAll('.btn-insert').forEach(btn => {
              btn.addEventListener('click', () => {
                const img = btn.querySelector('img');
                img.src = 'icons/16px/Check.svg';
                setTimeout(() => { img.src = 'icons/16px/Copy.svg'; }, 4000);

                const cardText = btn.closest('.card').querySelector('.card-body p').textContent;
                const composerInput = document.querySelector('.composer-input');
                if (composerInput) {
                  composerInput.textContent = cardText;
                  composerInput.dispatchEvent(new Event('input'));
                  composerInput.focus();
                }
              });
            });

            const detailsHeader = aiBlock.querySelector('.card-details-header');
            const detailsBody = aiBlock.querySelector('.card-details-body');
            const detailsBtn = detailsHeader.querySelector('button');
            const detailsChevron = detailsBtn.querySelector('img');
            detailsChevron.style.transition = 'transform 0.2s ease';
            let detailsOpen = false;
            detailsBtn.addEventListener('click', () => {
              detailsOpen = !detailsOpen;
              detailsOpen ? slideOpen(detailsBody, updateBackToBottom) : slideClose(detailsBody, updateBackToBottom);
              detailsChevron.style.transform = detailsOpen ? 'rotate(90deg)' : '';
              updateAiSpacer();
            });

            const reasoningEl = aiBlock.querySelector('.ai-reasoning');
            const reasoningMsg = aiBlock.querySelector('.reasoning-message');
            const aiCards = aiBlock.querySelector('.ai-cards');

            reasoningMsg.innerHTML = reasoningText;

            const reasoningBtn = reasoningEl.querySelector('button');
            const chevronImg = reasoningBtn.querySelector('img');
            chevronImg.style.transition = 'transform 0.2s ease';
            let reasoningOpen = false;
            reasoningBtn.addEventListener('click', () => {
              reasoningOpen = !reasoningOpen;
              reasoningOpen ? slideOpen(reasoningMsg, updateBackToBottom) : slideClose(reasoningMsg, updateBackToBottom);
              chevronImg.style.transform = reasoningOpen ? 'rotate(90deg)' : '';
              updateAiSpacer();
            });

            const aiMessage = aiBlock.querySelector('.ai-message');

            reasoningEl.style.transition = 'opacity 0.4s ease';
            aiMessage.style.transition = 'opacity 0.4s ease';
            requestAnimationFrame(() => requestAnimationFrame(() => {
              reasoningEl.style.opacity = '1';
              aiMessage.style.opacity = '1';
              updateAiSpacer();
              aiCards.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              aiCards.style.opacity = '1';
              aiCards.style.transform = 'translateY(0)';
              scroll.scrollTo({ top: prevEl ? prevEl.offsetTop - 18 : 0, behavior: 'smooth' });
              setTimeout(showSuggestions, 600);
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

    stopCopilotAutoThinking = stopCopilotThinking;

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
      scroll.scrollTo({ top: Math.max(0, msgEl.offsetTop - 18), behavior: 'smooth' });
      setTimeout(() => startCopilotThinking(scroll), 500);
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

    window.tourSendCopilotMessage = function (text) {
      copilotEditable.textContent = text;
      copilotEditable.dispatchEvent(new Event('input'));
      sendCopilotMessage();
    };

    // Suggestion chips
    const suggestionsEl = document.querySelector('.copilot-suggestions');
    const copilotScrollEl = document.getElementById('copilot-scroll');
    let suggestionsHiddenByTyping = false;

    function suggestionsOverlapContent() {
      if (!copilotScrollEl) return false;
      const canScroll = copilotScrollEl.scrollHeight > copilotScrollEl.clientHeight;
      if (!canScroll) return false;
      const distFromBottom = copilotScrollEl.scrollHeight - copilotScrollEl.scrollTop - copilotScrollEl.clientHeight;
      return distFromBottom > 40;
    }

    function hideSuggestions() {
      suggestionsHiddenByTyping = true;
      if (suggestionsEl) suggestionsEl.classList.add('is-hidden');
    }

    function showSuggestions() {
      suggestionsHiddenByTyping = false;
      if (!suggestionsEl) return;
      if (!suggestionsOverlapContent()) suggestionsEl.classList.remove('is-hidden');
      copilotEditable.addEventListener('input', hideSuggestions, { once: true });
    }

    if (copilotScrollEl) {
      copilotScrollEl.addEventListener('scroll', () => {
        if (!suggestionsEl || suggestionsHiddenByTyping) return;
        if (suggestionsOverlapContent()) {
          suggestionsEl.classList.add('is-hidden');
        } else {
          suggestionsEl.classList.remove('is-hidden');
        }
      });
    }
    copilotEditable.addEventListener('input', hideSuggestions, { once: true });
    if (suggestionsEl) {
      suggestionsEl.querySelectorAll('.copilot-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
          copilotEditable.textContent = btn.textContent.trim();
          copilotEditable.dispatchEvent(new Event('input'));
          sendCopilotMessage();
        });
      });
    }

    document.querySelectorAll('.composer-right-default .btn-secondary, .composer-right-note .btn-secondary').forEach(btn => {
      if (btn.textContent.trim() === 'Generate reply') {
        btn.addEventListener('click', () => {
          copilotEditable.textContent = 'Generate reply';
          copilotEditable.dispatchEvent(new Event('input'));
          sendCopilotMessage();
        });
      }
    });
  }

  const chatScroll = document.querySelector('.chat-scroll');
  const copilotScroll = document.querySelector('.copilot-scroll');
  if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight;
  if (copilotScroll) copilotScroll.scrollTop = copilotScroll.scrollHeight;

  const backToBottom = document.querySelector('.composer-back-to-bottom');
  const backToBottomBtn = backToBottom && backToBottom.querySelector('button');
  const composerEl = document.querySelector('.composer');
  let chatWasAtBottom = true;
  function updateBackToBottom() {
    if (!chatScroll || !backToBottom) return;
    const atBottom = chatScroll.scrollHeight - chatScroll.scrollTop - chatScroll.clientHeight < 8;
    backToBottom.classList.toggle('is-visible', !atBottom);
    chatWasAtBottom = atBottom;
  }
  if (chatScroll) chatScroll.addEventListener('scroll', updateBackToBottom);
  if (backToBottomBtn) backToBottomBtn.addEventListener('click', () => {
    chatScroll.scrollTo({ top: chatScroll.scrollHeight, behavior: 'smooth' });
  });
  updateBackToBottom();

  const copilotBackToBottom = document.querySelector('.copilot-back-to-bottom');
  const copilotBackToBottomBtn = copilotBackToBottom && copilotBackToBottom.querySelector('button');
  function updateCopilotBackToBottom() {
    if (!copilotScroll || !copilotBackToBottom) return;
    const atBottom = copilotScroll.scrollHeight - copilotScroll.scrollTop - copilotScroll.clientHeight < 8;
    copilotBackToBottom.classList.toggle('is-visible', !atBottom);
  }
  if (copilotScroll) copilotScroll.addEventListener('scroll', updateCopilotBackToBottom);
  if (copilotScroll) new ResizeObserver(updateCopilotBackToBottom).observe(copilotScroll);
  if (copilotBackToBottomBtn) copilotBackToBottomBtn.addEventListener('click', () => {
    copilotScroll.scrollTo({ top: copilotScroll.scrollHeight, behavior: 'smooth' });
  });
  updateCopilotBackToBottom();

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

  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
      const text = composerInput.textContent.trim();
      if (!text) return;
      appendChatMessage('out', text, true);
      composerInput.innerHTML = '';
      composerInput.dispatchEvent(new Event('input'));
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
    if (stopCopilotAutoThinking) stopCopilotAutoThinking();
    if (copilotScroll) copilotScroll.innerHTML = '';

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
