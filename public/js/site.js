(function () {
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link')) nav.classList.remove('open');
    });
  }

  // scroll reveal (adds .reveal only when JS runs, so no-JS stays visible)
  var targets = document.querySelectorAll(
    '.section,.page-hero,.prod-card,.adv-card,.svc-card,.news-card,.stat,.step-card,.client-card,.cert-card'
  );
  targets.forEach(function (el) { el.classList.add('reveal'); });

  // stagger grid children
  document.querySelectorAll('.prod-grid,.adv-grid,.svc-grid,.stats-grid,.step-grid,.client-grid,.cert-grid').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (el, i) {
      el.style.setProperty('--d', (i * 0.06) + 's');
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // count-up animation for stat numbers (e.g. 15+ , 100% , 4)
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(function (el) {
    var txt = el.textContent.trim();
    var m = txt.match(/([\d.,]+)(.*)/);
    if (!m) return; // non-numeric (e.g. "OEM") -> leave as is
    var target = parseFloat(m[1].replace(/,/g, ''));
    var suffix = m[2] || '';
    var dec = (m[1].split('.')[1] || '').length;
    el._target = target; el._suffix = suffix; el._dec = dec;
    if (!reduce) el.textContent = (dec ? (0).toFixed(dec) : '0') + suffix;
  });
  function runCount(el) {
    var target = el._target, suffix = el._suffix, dec = el._dec, dur = 1300, start = null;
    function tick(now) {
      if (!start) start = now;
      var p = Math.min(1, (now - start) / dur);
      var val = target * (1 - Math.pow(1 - p, 3));
      el.textContent = (dec ? val.toFixed(dec) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { if (el._target != null) io2.observe(el); });
  }
})();
