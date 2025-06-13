/* =========================================================
   script.js – G-Sprach Landing (Stripe + Brevo, no mailto)
   ========================================================= */
const STRIPE_PK     = 'pk_live_xxxxxxxxxxxxxxxxxxxxxx';   // TODO
const BREVO_LIST_ID = 10;                                 // ID списка в Brevo

/* --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* 0. Preloader */
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (pre) { pre.classList.add('hidden'); setTimeout(() => pre.remove(), 500); }
  });

  /* 1. Stripe */
  const stripe = Stripe(STRIPE_PK);
  document.querySelectorAll('.stripe-pay').forEach(btn => {
    btn.addEventListener('click', () => {
      fetch('/create-checkout', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ priceId: btn.dataset.price })
      })
      .then(r => r.json())
      .then(d => stripe.redirectToCheckout({ sessionId: d.id }))
      .catch(() => toast('Stripe error', false));
    });
  });

  /* 2. Swiper + flatpickr */
  if (typeof Swiper   !== 'undefined')
    new Swiper('.studio-swiper', { loop:true, pagination:{ el:'.swiper-pagination', clickable:true }});
  if (typeof flatpickr !== 'undefined')
    flatpickr('#datetime', { enableTime:true, dateFormat:'Y-m-d H:i', time_24hr:true, minDate:'today' });

  /* 3. Форма */
  const form = document.getElementById('bookingForm');
  if (!form) return;

  /* 3.1 скрытые UTM */
  const qs         = new URLSearchParams(location.search);
  const utmSource  = qs.get('utm_source')  || 'direct';
  const utmMedium  = qs.get('utm_medium')  || 'none';
  [['utm_source', utmSource], ['utm_medium', utmMedium]].forEach(([n,v]) => {
    const h = document.createElement('input');
    h.type='hidden'; h.name=n; h.value=v; form.append(h);
  });

  /* 3.2 submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const d = Object.fromEntries(new FormData(form).entries());
    if (!d.name || !d.phone || !d.email || !d.package) {
      return toast('Заповніть усі обов’язкові поля', false);
    }

    toggle(true);
    const ok = await brevoContact(d);
    toggle(false);

    ok ? (toast('Дякуємо! Ми звʼяжемось.', true), form.reset())
       :  toast('Помилка. Спробуйте ще раз.', false);
  });

  /* ---------- Brevo прокси ---------- */
  async function brevoContact(d) {
    const body = {
      email: d.email,
      attributes: {
        NAME       : d.name,
        HANDY      : d.phone.replace(/\D/g,''),
        TARIF      : [d.package],
        DATUM      : d.datetime || '',
        NACHRICHT  : d.message  || '',
        UTM_SOURCE : utmSource,
        UTM_MEDIUM : utmMedium,
        OPT_IN     : d.optin === 'true'
      },
      listIds:[BREVO_LIST_ID],
      updateEnabled:true
    };

    try {
      const r = await fetch('/api/brevo', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify(body)
      });
      if (!r.ok) console.error('Brevo', await r.text());
      return r.ok;
    } catch (err) {
      console.error('Brevo fetch', err);
      return false;
    }
  }

  /* ---------- Helpers ---------- */
  function toast(msg, ok = true) {
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.cssText =
      `position:fixed;top:20px;right:20px;z-index:10000;padding:12px 20px;
       background:${ok ? '#4CAF50' : '#f44336'};color:#fff;border-radius:4px;
       font-weight:600;opacity:0;transition:.3s`;
    document.body.append(n);
    requestAnimationFrame(() => (n.style.opacity = 1));
    setTimeout(() => { n.style.opacity = 0; setTimeout(() => n.remove(), 300); }, 4000);
  }

  function toggle(disabled) {
    const b = form.querySelector('.form-submit');
    if (b) {
      b.disabled = disabled;
      b.textContent = disabled ? 'Відправляємо…' : 'Відправити';
    }
  }

  /* защита от случайных mailto */
  document.addEventListener('submit', e => {
    if (e.target.tagName === 'FORM' && e.target.action.startsWith('mailto:')) {
      e.preventDefault();
      alert('У форми mailto — замініть action="#"');
    }
  });

});  // конец DOMContentLoaded
