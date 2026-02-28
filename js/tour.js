(function () {

  const steps = [
    {
      target: '.sidebar-nav',
      title: 'Nav-sidebar',
      description: '- Padding +4px<br>- Background color Surface Secondary (#FAFAFA)<br>- Open/Collapse subtle animation<br>- When expanded, menu doesn\'t collapse others',
      position: 'right',
    },
    {
      target: '.snav-subitems',
      title: 'Subitems',
      description: '- Gap 1px',
      position: 'right',
    },
    {
      target: '.content',
      title: 'Main content',
      description: '- Padding 6px top · right · bottom',
      position: 'right',
      onEnter: function () {
        var firstItem = document.querySelector('.isb-item');
        if (firstItem) firstItem.click();
      },
    },
    {
      target: '.chat-scroll',
      title: 'Dialog',
      description: '- Background color Surface Secondary (#FAFAFA)<br>- Hour color same as inbox list item<br>- Message hour only appears on hover',
      position: 'left',
      onEnter: function () {
        var btn = document.querySelector('.composer-back-to-bottom');
        if (btn) btn.classList.add('is-visible');
        var msg = document.querySelector('.msg-wrapper.outbound');
        if (msg) msg.classList.add('tour-show-time');
      },
      onLeave: function () {
        document.querySelectorAll('.tour-show-time').forEach(function (el) {
          el.classList.remove('tour-show-time');
        });
        var btn = document.querySelector('.composer-back-to-bottom');
        if (btn) btn.classList.remove('is-visible');
      },
    },
    {
      target: '.system-alert',
      title: 'Dialog',
      description: '- Alert font size changed to 14px<br>- Tag font color changed to content-tertiary',
      position: 'bottom',
    },
    {
      target: '.btn-split',
      title: 'Dialog',
      description: '- Send button always default state<br>- Send button click when composer is empty — error animation',
      position: 'top',
    },
    {
      target: '.composer-wrap',
      title: 'Composer scroll animation',
      description: '- Scroll up shows subtle animation',
      position: 'top',
    },
    {
      target: '#copilot-composer',
      title: 'Copilot',
      description: '- Composer single line vs multiple lines<br>- Button always active + empty button error<br>- Suggestions disappear when the user scrolls<br>- Thinking with icon, Reading Knowledge Base icon and dots animation<br>- Thinking step by step with typing animation',
      position: 'left',
      onLeave: function () {
        if (typeof window.tourSendCopilotMessage === 'function') {
          window.tourSendCopilotMessage('Generate reply');
        }
      },
    },
    {
      target: '.ai-cards',
      title: 'Copilot',
      description: '- Card surface secondary background color<br>- Bottom padding header 8px<br>- Details in a dropdown (removed info button)',
      position: 'left',
    },
    {
      target: '#copilot-scroll',
      title: 'Copilot',
      description: '- Most recent message always appears on top',
      position: 'left',
    },
  ];

  let currentStep = 0;
  let spotlightEl = null;
  let tooltipEl = null;
  let active = false;

  // ─── Public API ────────────────────────────────────────
  function start() {
    if (active) return;
    active = true;
    currentStep = 0;

    spotlightEl = document.createElement('div');
    spotlightEl.className = 'tour-spotlight';
    document.body.appendChild(spotlightEl);

    tooltipEl = document.createElement('div');
    tooltipEl.className = 'tour-tooltip';
    document.body.appendChild(tooltipEl);

    render();
  }

  function end() {
    active = false;
    spotlightEl?.remove(); spotlightEl = null;
    tooltipEl?.remove();   tooltipEl = null;
    document.querySelectorAll('.tour-show-time').forEach(function (el) {
      el.classList.remove('tour-show-time');
    });
    var btn = document.querySelector('.composer-back-to-bottom');
    if (btn) btn.classList.remove('is-visible');
  }

  window.startTour = start;
  window.endTour   = end;

  // ─── Render ────────────────────────────────────────────
  function render() {
    const step   = steps[currentStep];
    if (step.onEnter) step.onEnter();
    const target = document.querySelector(step.target);

    if (!target) {
      currentStep < steps.length - 1 ? (currentStep++, render()) : end();
      return;
    }

    const rect    = target.getBoundingClientRect();
    const PAD     = -6;
    const isFirst = currentStep === 0;
    const isLast  = currentStep === steps.length - 1;

    // Spotlight
    spotlightEl.style.top    = (rect.top    - PAD) + 'px';
    spotlightEl.style.left   = (rect.left   - PAD) + 'px';
    spotlightEl.style.width  = (rect.width  + PAD * 2) + 'px';
    spotlightEl.style.height = (rect.height + PAD * 2) + 'px';

    // Tooltip
    tooltipEl.innerHTML = `
      <div class="tour-summary">
        <div class="tour-summary-label">
          <span>Change</span>
          <span class="tour-counter">
            <span class="tour-counter-current">${currentStep + 1}</span><span class="tour-counter-sep">/</span><span class="tour-counter-total">${steps.length}</span>
          </span>
        </div>
        <div class="tour-summary-actions">
          ${!isFirst ? '<button class="btn btn-ghost btn-sm tour-prev">Back</button>' : ''}
          ${isLast
            ? '<button class="btn btn-secondary btn-sm tour-finish">Done</button>'
            : '<button class="btn btn-secondary btn-sm tour-next">Next</button>'
          }
          <button class="btn btn-ghost btn-icon btn-sm tour-close" aria-label="Close tour"><img src="icons/16px/Cross.svg" width="16" height="16" alt=""/></button>
        </div>
      </div>
      <div class="tour-divider"></div>
      <div class="tour-body">
        <p class="tour-title">${step.title}</p>
        <p class="tour-description">${step.description}</p>
      </div>
    `;

    tooltipEl.querySelector('.tour-close')?.addEventListener('click', end);
    tooltipEl.querySelector('.tour-next')?.addEventListener('click', next);
    tooltipEl.querySelector('.tour-prev')?.addEventListener('click', prev);
    tooltipEl.querySelector('.tour-finish')?.addEventListener('click', end);

    requestAnimationFrame(() => positionTooltip(tooltipEl, rect, step.position || 'right'));
  }

  // ─── Positioning ──────────────────────────────────────
  function positionTooltip(el, targetRect, preferred) {
    const GAP = 16;
    const PAD = 16;
    const tw  = el.offsetWidth;
    const th  = el.offsetHeight;
    const vw  = window.innerWidth;
    const vh  = window.innerHeight;

    const calc = {
      right:  () => ({ top: targetRect.top  + targetRect.height / 2 - th / 2, left: targetRect.right  + GAP,       arrow: 'arrow-left'   }),
      left:   () => ({ top: targetRect.top  + targetRect.height / 2 - th / 2, left: targetRect.left   - tw - GAP,  arrow: 'arrow-right'  }),
      bottom: () => ({ top: targetRect.bottom + GAP,                           left: targetRect.left   + targetRect.width / 2 - tw / 2, arrow: 'arrow-top'    }),
      top:    () => ({ top: targetRect.top  - th - GAP,                        left: targetRect.left   + targetRect.width / 2 - tw / 2, arrow: 'arrow-bottom' }),
    };

    let chosen;
    for (const pos of [preferred, 'right', 'bottom', 'left', 'top']) {
      const c = calc[pos]?.();
      if (!c) continue;
      if (c.top >= PAD && c.top + th <= vh - PAD && c.left >= PAD && c.left + tw <= vw - PAD) {
        chosen = c; break;
      }
    }

    if (!chosen) {
      chosen = calc[preferred]?.() || calc.right();
      chosen.top  = Math.max(PAD, Math.min(chosen.top,  vh - th - PAD));
      chosen.left = Math.max(PAD, Math.min(chosen.left, vw - tw - PAD));
      chosen.arrow = 'arrow-none';
    }

    el.style.top  = chosen.top  + 'px';
    el.style.left = chosen.left + 'px';
    el.className  = 'tour-tooltip ' + chosen.arrow;
  }

  // ─── Navigation ────────────────────────────────────────
  function next() {
    steps[currentStep]?.onLeave?.();
    if (currentStep < steps.length - 1) { currentStep++; render(); }
    else end();
  }

  function prev() {
    steps[currentStep]?.onLeave?.();
    if (currentStep > 0) { currentStep--; render(); }
  }

  // ─── Keyboard ──────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (!active) return;
    if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft')                        { e.preventDefault(); prev(); }
    if (e.key === 'Escape')                           end();
  });

})();
