(function () {

  const steps = [
    {
      target: '.sidebar-nav',
      title: 'Nav-sidebar',
      description: 'Padding +4px',
      position: 'right',
    },
    {
      target: '.snav-subitems',
      title: 'Subitems',
      description: 'Gap: 1px<br>Background color: Surface Secondary (#FAFAFA)<br>Open/Collapse: subtle animation<br>When expanded, menu doesn\'t collapse others',
      position: 'right',
    },
    {
      target: '.snav-subitems',
      title: 'Subitems',
      description: 'Gap 1px',
      position: 'right',
    },
    {
      target: '.content',
      title: 'Main content',
      description: 'Padding 6px top · right · bottom',
      position: 'right',
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
  }

  window.startTour = start;
  window.endTour   = end;

  // ─── Render ────────────────────────────────────────────
  function render() {
    const step   = steps[currentStep];
    const target = document.querySelector(step.target);

    if (!target) {
      currentStep < steps.length - 1 ? (currentStep++, render()) : end();
      return;
    }

    const rect    = target.getBoundingClientRect();
    const PAD     = 4;
    const isFirst = currentStep === 0;
    const isLast  = currentStep === steps.length - 1;

    // Spotlight
    spotlightEl.style.top    = (rect.top    - PAD) + 'px';
    spotlightEl.style.left   = (rect.left   - PAD) + 'px';
    spotlightEl.style.width  = (rect.width  + PAD * 2) + 'px';
    spotlightEl.style.height = (rect.height + PAD * 2) + 'px';

    // Tooltip
    tooltipEl.innerHTML = `
      <div class="tour-header">
        <div class="tour-header-text">
          <span class="tour-step-label">Step ${currentStep + 1} of ${steps.length}</span>
          <h3 class="tour-title">${step.title}</h3>
        </div>
        <button class="tour-close" aria-label="Close tour">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <p class="tour-description">${step.description}</p>
      <div class="tour-footer">
        <div class="tour-dots">
          ${steps.map((_, i) => `<span class="tour-dot${i === currentStep ? ' active' : ''}"></span>`).join('')}
        </div>
        <div class="tour-actions">
          ${!isFirst ? '<button class="btn btn-ghost btn-sm tour-prev">Back</button>' : ''}
          ${isLast
            ? '<button class="btn btn-accent btn-sm tour-finish">Done</button>'
            : '<button class="btn btn-accent btn-sm tour-next">Next</button>'
          }
        </div>
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
    if (currentStep < steps.length - 1) { currentStep++; render(); }
    else end();
  }

  function prev() {
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
