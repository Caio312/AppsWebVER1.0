/* ═══════════════════════════════════════
   TEMA / NAV SCROLL
═══════════════════════════════════════ */
(function () {
  'use strict';

  const nav = document.getElementById('nav');

  // Nav scroll state
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ═══════════════════════════════════════
     MENU MOBILE
  ═══════════════════════════════════════ */
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  const btnNav    = document.querySelector('.btn-nav');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));

      // Show/hide CTA button inside mobile menu
      if (btnNav) {
        btnNav.classList.toggle('open-cta', isOpen);
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (btnNav) btnNav.classList.remove('open-cta');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (btnNav) btnNav.classList.remove('open-cta');
      }
    });
  }

  /* ═══════════════════════════════════════
     REVEAL ON SCROLL
  ═══════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ═══════════════════════════════════════
     ACTIVE NAV LINK (SCROLL SPY)
  ═══════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    var scrollY = window.scrollY + 80;
    var current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ═══════════════════════════════════════
     ACESSIBILIDADE — ESC fecha menu
  ═══════════════════════════════════════ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      if (btnNav) btnNav.classList.remove('open-cta');
      hamburger.focus();
    }
  });
})();
