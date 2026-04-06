/* ── Theme ── */
const root = document.documentElement;
const tb   = document.getElementById('themeBtn');
function getSystem(){ return matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'; }
function setTheme(t){
  root.setAttribute('data-theme', t);
  if (tb) tb.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('cse-theme', t);
}
setTheme(localStorage.getItem('cse-theme') || getSystem());
if (tb) tb.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
matchMedia('(prefers-color-scheme:dark)').addEventListener('change', e => {
  if (!localStorage.getItem('cse-theme')) setTheme(e.matches ? 'dark' : 'light');
});

/* ── Menu mobile ── */
const nav = document.getElementById('nav');
const ham = document.getElementById('ham');
const nl  = document.getElementById('navLinks');
if (ham && nl) {
  ham.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    ham.textContent = open ? '✕' : '☰';
  });
  nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    ham.textContent = '☰';
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      ham.textContent = '☰';
    }
  });
}

/* ── Reveal on scroll ── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 65);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.09 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── Scroll spy: active nav link ── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('#navLinks a[href^="#"]');
function updateSpy() {
  const y = window.scrollY + 80;
  let current = '';
  sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', updateSpy, { passive: true });
updateSpy();

/* ── Acessibilidade: cards de serviço com teclado ── */
document.querySelectorAll('.svc-card').forEach(c => {
  c.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = '#cta'; }
  });
});
