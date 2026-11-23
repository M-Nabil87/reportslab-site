// Quote request (D-058): checks the form, then opens WhatsApp with a ready
// message to the company number. Nothing is stored or sent anywhere else.
(() => {
  const form = document.getElementById('quote-form');
  if (!form) return;
  const companyWhatsApp = '201500555825';
  const field = (id) => document.getElementById(id);

  const checks = [
    { input: field('q-name'), error: field('q-name-error'), ok: (v) => v.trim().length >= 2 },
    {
      input: field('q-phone'),
      error: field('q-phone-error'),
      ok: (v) => /^\+?[0-9]{8,15}$/.test(v.replace(/[\s()-]/g, '')),
    },
    { input: field('q-service'), error: field('q-service-error'), ok: (v) => v !== '' },
  ];

  const show = (check, bad) => {
    check.error.hidden = !bad;
    check.input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    if (bad) check.input.setAttribute('aria-describedby', check.error.id);
    else check.input.removeAttribute('aria-describedby');
  };

  // An error clears as soon as the visitor edits that field.
  checks.forEach((check) => {
    const clear = () => { if (!check.error.hidden) show(check, !check.ok(check.input.value)); };
    check.input.addEventListener('input', clear);
    check.input.addEventListener('change', clear);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstBad = null;
    checks.forEach((check) => {
      const bad = !check.ok(check.input.value);
      show(check, bad);
      if (bad && !firstBad) firstBad = check.input;
    });
    if (firstBad) {
      firstBad.focus();
      return;
    }

    const value = (id) => field(id).value.trim();
    // The office reads Arabic, so the message is in Arabic in both languages.
    const lines = [
      'طلب عرض سعر من موقع reportslab.si',
      `الاسم: ${value('q-name')}`,
      `الموبايل: ${value('q-phone')}`,
      value('q-company') && `الشركة: ${value('q-company')}`,
      `الخدمة: ${value('q-service')}`,
      value('q-location') && `موقع المشروع: ${value('q-location')}`,
      value('q-size') && `عدد الجسات / المساحة: ${value('q-size')}`,
      value('q-start') && `موعد البدء المتوقع: ${value('q-start')}`,
      value('q-notes') && `ملاحظات: ${value('q-notes')}`,
    ].filter(Boolean);

    const url = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
})();
