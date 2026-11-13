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
