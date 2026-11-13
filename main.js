// Language switch (Arabic page text, English in data-en) and the phone menu.
(() => {
  const root = document.documentElement;
  const button = document.getElementById('lang');
  const nodes = [...document.querySelectorAll('[data-en]')];
  const alts = [...document.querySelectorAll('[data-en-alt]')];
  // Keep the Arabic as written in the page.
  nodes.forEach((n) => { n.dataset.ar = n.innerHTML; });
  alts.forEach((n) => { n.dataset.arAlt = n.getAttribute('alt') || ''; });
  const titles = {
    ar: document.title,
    en: 'Reports for Engineering Consultancy | Quality you can trust',
  };

  function apply(lang) {
    const en = lang === 'en';
    root.lang = en ? 'en' : 'ar';
    root.dir = en ? 'ltr' : 'rtl';
    nodes.forEach((n) => { n.innerHTML = en ? n.dataset.en : n.dataset.ar; });
    alts.forEach((n) => n.setAttribute('alt', en ? n.dataset.enAlt : n.dataset.arAlt));
    button.textContent = en ? 'عربي' : 'EN';
    button.setAttribute('aria-label', en ? 'العربية' : 'English');
    document.title = en ? titles.en : titles.ar;
    try { localStorage.setItem('reports-lang', lang); } catch (_) {}
  }

  let saved = 'ar';
  try { saved = localStorage.getItem('reports-lang') || 'ar'; } catch (_) {}
  if (saved === 'en') apply('en');
  button.addEventListener('click', () => apply(root.lang === 'en' ? 'ar' : 'en'));

  // Motion: skipped entirely when the visitor asks for reduced motion.
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The header gains a shadow once the page scrolls.
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Things rise into view, one after another within the same group.
  const groups = [
    '.section .eyebrow', '.section h2', '.section .intro', '.split > div',
    '.photo', '.card', '.chips span', '.steps li', '.contact-list li',
    '.test-lists > div', '.ticks li', '.app-visual', '.stat-item',
  ];
  const targets = [...document.querySelectorAll(groups.join(','))];
  if (!calm && 'IntersectionObserver' in window) {
    targets.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => targets.includes(c));
      el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 6) * 0.08}s`);
      el.classList.add('reveal');
      if (el.matches('.photo, .app-visual')) el.classList.add('from-side');
    });
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        seen.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => seen.observe(el));
  }

  // The numbers count up when the strip comes into view.
  const counters = [...document.querySelectorAll('.count[data-to]')];
  const run = (el) => {
    const to = Number(el.dataset.to);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(to * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!calm && 'IntersectionObserver' in window) {
    const watch = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run(e.target);
        watch.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => { el.textContent = `0${el.dataset.suffix || ''}`; watch.observe(el); });
  }

  const menu = document.getElementById('menu');
  const nav = document.getElementById('nav');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });
})();
