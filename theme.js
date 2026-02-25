(function () {
  var html = document.documentElement;

  // Initialise: saved preference → system preference → light
  var saved = localStorage.getItem('clarity-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    html.classList.add('dark');
  }

  var sunIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
    + '<circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.2"/>'
    + '<path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.55 3.55l.7.7M11.75 11.75l.7.7M11.75 4.25l-.7.7M4.25 11.75l-.7-.7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>'
    + '</svg>';

  var moonIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
    + '<path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5 5.5 5.5 0 1 0 13.5 9.5z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';

  document.addEventListener('DOMContentLoaded', function () {
    var isDark = html.classList.contains('dark');

    var switcher = document.createElement('div');
    switcher.className = 'theme-switcher';

    var lightBtn = document.createElement('button');
    lightBtn.className = 'theme-switcher-btn' + (isDark ? '' : ' active');
    lightBtn.innerHTML = sunIcon + '<span class="theme-switcher-label">Light</span>';

    var darkBtn = document.createElement('button');
    darkBtn.className = 'theme-switcher-btn' + (isDark ? ' active' : '');
    darkBtn.innerHTML = moonIcon + '<span class="theme-switcher-label">Dark</span>';

    lightBtn.addEventListener('click', function () {
      html.classList.remove('dark');
      lightBtn.classList.add('active');
      darkBtn.classList.remove('active');
      localStorage.setItem('clarity-theme', 'light');
    });

    darkBtn.addEventListener('click', function () {
      html.classList.add('dark');
      darkBtn.classList.add('active');
      lightBtn.classList.remove('active');
      localStorage.setItem('clarity-theme', 'dark');
    });

    switcher.appendChild(lightBtn);
    switcher.appendChild(darkBtn);
    document.body.appendChild(switcher);

    // Drag to reposition
    var isDragging = false;
    var dragOffsetX, dragOffsetY;

    switcher.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      isDragging = true;
      var rect = switcher.getBoundingClientRect();
      // Switch from transform-based centering to absolute pixel coords
      switcher.style.transform = 'none';
      switcher.style.left = rect.left + 'px';
      switcher.style.top = rect.top + 'px';
      switcher.style.bottom = 'auto';
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      switcher.setPointerCapture(e.pointerId);
      switcher.style.cursor = 'grabbing';
      e.preventDefault();
    });

    switcher.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      switcher.style.left = (e.clientX - dragOffsetX) + 'px';
      switcher.style.top = (e.clientY - dragOffsetY) + 'px';
    });

    switcher.addEventListener('pointerup', function () {
      if (!isDragging) return;
      isDragging = false;
      switcher.style.cursor = '';
    });
  });
})();
