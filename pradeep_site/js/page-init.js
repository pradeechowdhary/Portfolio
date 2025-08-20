// page-init.js — safe initializer for the portfolio (no hard dependencies)

/* Utilities */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function hideLoading() {
  const loading = $('#loading-screen');
  if (loading) loading.style.display = 'none';
}

function styleChangingWord() {
  const el = $('#changing-word');
  if (!el) return;
  el.style.opacity = '1';
  el.style.visibility = 'visible';
  el.style.display = 'inline-block';
  el.style.background = 'linear-gradient(90deg, #8b5cf6, #ec4899, #facc15)';
  el.style.backgroundSize = '200% auto';
  el.style.backgroundClip = 'text';
  el.style.webkitBackgroundClip = 'text';
  el.style.webkitTextFillColor = 'transparent';
}

/* Particles + shimmer (no-ops if container missing) */
function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 3 + 1;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.opacity = (Math.random() * 0.5 + 0.1).toString();
    const dur = Math.random() * 15 + 10;
    p.style.animation = `float ${dur}s infinite ease-in-out`;
    p.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(p);
  }

  document.addEventListener('mousemove', (e) => {
    // throttle-ish
    if (Math.random() > 0.1) return;
    const s = document.createElement('div');
    s.className = 'shimmer';
    s.style.left = `${e.clientX}px`;
    s.style.top = `${e.clientY}px`;
    const size = Math.random() * 2 + 1;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    container.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }, { passive: true });
}

/* Smooth scroll (only wires handlers if elements exist) */
function initSmoothScroll() {
  const cta = $('#cta-button');
  const indicator = $('.scroll-indicator');

  const scrollToAboutOrNext = () => {
    const about = $('#about') || $('section:nth-of-type(2)');
    if (about) about.scrollIntoView({ behavior: 'smooth' });
  };

  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToAboutOrNext();
    });
  }
  if (indicator) {
    indicator.addEventListener('click', () => {
      const nxt = $('section:nth-of-type(2)');
      if (nxt) nxt.scrollIntoView({ behavior: 'smooth' });
      else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });
  }
}

/* Responsive base font size */
function initTypeScale() {
  const adjust = () => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    document.documentElement.style.fontSize =
      vw < 768 ? '14px' : (vw < 1024 ? '16px' : '18px');
  };
  adjust();
  window.addEventListener('resize', adjust);
}

/* Reveal support + hard fallback so content never stays hidden */
function initRevealObserver() {
  const targets = $$('.reveal-element');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  targets.forEach((el) => io.observe(el));
}

function forceRevealAll() {
  // Ensure everything shows even if the observer or CSS fails
  const all = [
    ...$$('.reveal-element'),
    ...$$('.reveal-child'),
    ...$$('.reveal-delay'),
    ...$$('[data-delay]')
  ];
  all.forEach((el) => {
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/* Active nav highlight */
function initActiveNav() {
  const sections = $$('section[id]');
  const links = $$('.navbar-link');
  if (!sections.length || !links.length) return;

  const update = () => {
    let current = null;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec;
    }
    links.forEach((a) => {
      const match = current && a.getAttribute('href') === `#${current.id}`;
      a.classList.toggle('active', !!match);
    });
  };
  document.addEventListener('scroll', update, { passive: true });
  update();
}

/* Optional “fast return” flags (safe to ignore if unset) */
function maybeBypassLoadingFromGhosted() {
  const bypassLoading = sessionStorage.getItem('bypassLoading');
  const directToHero  = sessionStorage.getItem('directToHero');
  if (bypassLoading === 'true' && directToHero === 'true') {
    const loading = $('#loading-screen');
    if (loading) loading.style.display = 'none';
    sessionStorage.removeItem('bypassLoading');
    sessionStorage.removeItem('directToHero');
    sessionStorage.removeItem('instantTransition');
    const hero = $('#hero');
    if (hero) hero.style.opacity = '1';
    window.scrollTo(0, 0);
    $$('section').forEach((s) => { if (s.id !== 'loading-screen') s.style.opacity = '1'; });
    window.dispatchEvent(new Event('scroll'));
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  // order is intentional
  hideLoading();
  maybeBypassLoadingFromGhosted();
  styleChangingWord();
  initParticles();
  initSmoothScroll();
  initTypeScale();
  initRevealObserver();
  initActiveNav();

  // Hard fallback after a short delay so sections never remain invisible
  setTimeout(forceRevealAll, 250);
});
document.addEventListener('DOMContentLoaded', () => {
  // Remove reveal classes so they can't re-apply hidden styles
  const toUnreveal = document.querySelectorAll('.reveal-element, .reveal-child, .reveal-delay, [data-delay]');
  toUnreveal.forEach(el => {
    el.classList.remove('reveal-element');
    el.classList.remove('reveal-child');
    el.classList.remove('reveal-delay');
    el.removeAttribute('data-delay');
    // Belt & suspenders
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    el.style.transform = 'none';
  });

  // Ensure the hero background layers cannot overlap content
  ['.depth-layer', '.nebula-overlay', '#particles'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) {
      el.style.pointerEvents = 'none';
      el.style.zIndex = '-1';
    }
  });

  // Kill the loader if present
  const loader = document.getElementById('loading-screen');
  if (loader) {
    loader.style.display = 'none';
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
  }
});

