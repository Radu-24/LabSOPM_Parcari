document.addEventListener('DOMContentLoaded', () => {
  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const fmtRON = (n) => new Intl.NumberFormat('ro-RO',{style:'currency',currency:'RON'}).format(Number(n||0));

  // --- helper: minute -> "X h și Y min"
  function formatDuration(mins) {
    if (mins == null || isNaN(mins)) return '—';
    const m = Math.max(0, Math.round(mins));
    const h = Math.floor(m / 60);
    const r = m % 60;
    if (h > 0 && r > 0) return `${h} h și ${r} min`;
    if (h > 0 && r === 0) return `${h} h`;
    return `${r} min`;
  }

  // ===== Citește parametrii din URL =====
  const qs = new URLSearchParams(location.search);

  // suportă ambele formate: minutes SAU hours/rate/total
  const hours = qs.get('hours') != null ? Number(qs.get('hours')) : null;
  const minutes = qs.get('minutes') != null
      ? Number(qs.get('minutes'))
      : (hours != null ? Math.round(hours * 60) : null);

  const rate  = qs.get('rate')  != null ? Number(qs.get('rate'))  : (qs.get('total') && hours != null ? Number(qs.get('total'))/hours : null);
  const total = qs.get('total') != null ? Number(qs.get('total')) : (rate != null && hours != null ? rate*hours : (qs.get('price') ? Number(qs.get('price')) : null));

  // Parcare / zonă (ia ce găsește)
  const park = qs.get('zoneLabel') || qs.get('name') || qs.get('parkingId') || '—';

  // ===== Rezumatul din Pag. 3 =====
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
  const tabs  = $$('.tab');
  const forms = $$('.payform');
  const map   = { card:'#formCard', apple:'#formApple', sms:'#formSms' };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      forms.forEach(f => f.classList.remove('show'));
      const target = map[tab.dataset.tab];
      if (target) document.querySelector(target).classList.add('show');
    });
  });

  // ===== Redirect la pag4 pe orice submit =====
  ['formCard','formApple','formSms'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validări minime
      if (id === 'formCard') {
        if (!$('#ccName').value.trim())                       { alert('Introdu numele de pe card.'); return; }
        if (!/^\d{2}\/\d{2}$/.test($('#ccExpiry').value.trim())) { alert('Expirare LL/AA.'); return; }
        if (!/^\d{3}$/.test($('#ccCvv').value.trim()))           { alert('CVV trebuie să aibă exact 3 cifre.'); return; }
      }
      if (id === 'formSms') {
        if (!$('#phone').value.trim()) { alert('Introdu numărul de telefon.'); return; }
      }

      const method = id.replace('form','').toUpperCase(); // CARD / APPLE / SMS

      // păstrăm toți parametrii existenți + metoda
      const qsOut = new URLSearchParams(location.search);
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
    cvv.setAttribute('maxlength','3');          // limită hard 3
    cvv.setAttribute('inputmode','numeric');
    cvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g,'').slice(0,3); // doar cifre, max 3
    });
  }
});