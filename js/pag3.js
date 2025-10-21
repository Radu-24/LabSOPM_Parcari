document.addEventListener('DOMContentLoaded', () => {
  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const fmtRON = (n) => new Intl.NumberFormat('ro-RO',{style:'currency',currency:'RON'}).format(Number(n||0));

  // ===== Helper: minute -> "X h și Y min"
  function formatDuration(mins) {
    if (mins == null || isNaN(mins)) return '—';
    const m = Math.max(0, Math.round(mins));
    const h = Math.floor(m / 60);
    const r = m % 60;
    if (h > 0 && r > 0) return `${h} h și ${r} min`;
    if (h > 0 && r === 0) return `${h} h`;
    return `${r} min`;
  }

  // ===== Preluare parametri din URL (acceptă ambele formate)
  const qs = new URLSearchParams(location.search);

  // Durata în minute are prioritate; altfel din hours; altfel din total/rate
  const minutes =
    qs.get('minutes') != null ? Number(qs.get('minutes')) :
    (qs.get('hours')   != null ? Math.round(Number(qs.get('hours')) * 60) :
    (qs.get('total') != null && qs.get('rate') != null
      ? Math.round((Number(qs.get('total')) / Number(qs.get('rate'))) * 60)
      : null));

  const hours = minutes != null ? minutes / 60 : (qs.get('hours') != null ? Number(qs.get('hours')) : null);
  const rate  = qs.get('rate')  != null ? Number(qs.get('rate'))  : (qs.get('total') && hours ? Number(qs.get('total'))/hours : null);
  const total = qs.get('total') != null ? Number(qs.get('total')) : (rate && hours ? rate*hours : (qs.get('price') ? Number(qs.get('price')) : null));

  // Parcare / Zona (preferă zoneLabel trimis din pag.2)
  const park = qs.get('zoneLabel') || qs.get('name') || qs.get('parkingId') || '—';

  // ===== Rezumat (sus) =====
  const mini = $('#miniResume');
  if (mini) {
    mini.innerHTML = `
      <div><strong>Parcare:</strong> ${park}</div>
      <div><strong>Durată:</strong> ${formatDuration(minutes)}</div>
      <div><strong>Tarif/oră:</strong> ${rate != null ? fmtRON(rate) + '/h' : '—'}</div>
      <div><strong>Total:</strong> ${total != null ? fmtRON(total) : '—'}</div>
    `;
  }

  // ===== Tabs =====
  const map = { card:'#formCard', apple:'#formApple', sms:'#formSms' };
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $$('.payform').forEach(f => f.classList.remove('show'));
      const target = map[tab.dataset.tab];
      if (target) document.querySelector(target).classList.add('show');
      fitOneScreen(); // re-calculează la schimbarea tabului
    });
  });

  // ===== Submits -> pag4.html =====
  ['formCard','formApple','formSms'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (id === 'formCard') {
        if (!$('#ccName').value.trim()) { alert('Introdu numele de pe card.'); return; }
        if (!/^\d{2}\/\d{2}$/.test($('#ccExpiry').value.trim())) { alert('Expirare LL/AA.'); return; }
        if (!/^\d{3}$/.test($('#ccCvv').value.trim())) { alert('CVV trebuie să aibă exact 3 cifre.'); return; }
      }
      if (id === 'formSms') {
        if (!$('#phone').value.trim()) { alert('Introdu numărul de telefon.'); return; }
      }

      const method = id.replace('form','').toUpperCase(); // CARD / APPLE / SMS
      const qsOut  = new URLSearchParams(location.search);
      qsOut.set('method', method);
      window.location.href = `pag4.html?${qsOut.toString()}`;
    });
  });

  // ===== UX: input masks =====
  const exp = document.getElementById('ccExpiry');
  if (exp) {
    exp.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g,'').slice(0,4);
      if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
      e.target.value = v;
    });
  }
  const cvv = document.getElementById('ccCvv');
  if (cvv) {
    cvv.setAttribute('maxlength','3');
    cvv.setAttribute('inputmode','numeric');
    cvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g,'').slice(0,3);
    });
  }

  // ===== Face Pag.3 să încapă pe un singur ecran (fără scroll) =====
  function fitOneScreen() {
    const el = document.querySelector('.page');
    if (!el) return;

    el.style.transform = 'scale(1)';
    el.style.marginTop = '0px';

    const viewportH = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const neededH = rect.height;

    let s = Math.min(1, (viewportH - 16) / neededH);   // -16 px spațiu respirat
    if (!isFinite(s) || s <= 0) s = 1;

    el.style.transform = `scale(${s})`;

    const finalH = neededH * s;
    const top = Math.max(0, (viewportH - finalH) / 2);
    el.style.marginTop = `${top}px`;
  }

  window.addEventListener('load', fitOneScreen);
  window.addEventListener('resize', fitOneScreen);
  setTimeout(fitOneScreen, 120); // după fonturi/layout
});
