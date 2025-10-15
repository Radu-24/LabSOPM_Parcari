document.addEventListener('DOMContentLoaded', () => {
  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // ===== Rezumat mic din querystring (opțional) =====
  const qs = new URLSearchParams(location.search);
  const hours = qs.get('hours');
  const rate  = qs.get('rate');
  const total = qs.get('total') || (hours && rate ? Number(hours) * Number(rate) : null);
  const park  = qs.get('parkingId');
  const mini  = $('#miniResume');
  const fmtRON = (n) => new Intl.NumberFormat('ro-RO',{style:'currency',currency:'RON'}).format(Number(n||0));

  mini.innerHTML = `
    <div><strong>Parcare:</strong> ${park ?? '—'}</div>
    <div><strong>Ore:</strong> ${hours ?? '—'}</div>
    <div><strong>Tarif/oră:</strong> ${rate ? fmtRON(rate)+'/h' : '—'}</div>
    <div><strong>Total:</strong> ${total ? fmtRON(total) : '—'}</div>
  `;

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

      // mică validare minimală pentru UX (nu blocăm redirectul cu condiții complicate)
      if (id === 'formCard') {
        if (!$('#ccName').value.trim()) { alert('Introdu numele de pe card.'); return; }
        if (!/^\d{2}\/\d{2}$/.test($('#ccExpiry').value.trim())) { alert('Expirare LL/AA.'); return; }
        if (!/^\d{3,4}$/.test($('#ccCvv').value.trim())) { alert('CVV invalid.'); return; }
      }
      if (id === 'formSms') {
        if (!$('#phone').value.trim()) { alert('Introdu numărul de telefon.'); return; }
      }

      const method = id.replace('form','').toUpperCase(); // CARD / APPLE / SMS

      // Păstrăm parametrii existenți din adresa curentă
      const qsIn  = new URLSearchParams(location.search);
      const qsOut = new URLSearchParams(qsIn.toString());
      qsOut.set('method', method);

      // Redirecționare în același folder
      window.location.href = `pag4.html?${qsOut.toString()}`;
    });
  });

  // UX: formatare LL/AA la expirare
  const exp = document.getElementById('ccExpiry');
  if (exp) {
    exp.addEventListener('input', (e)=>{
      let v = e.target.value.replace(/\D/g,'').slice(0,4);
      if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
      e.target.value = v;
    });
  }
});
