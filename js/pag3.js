// —— Utilities


// —— Apple Pay (simulat)
$('#formApple').addEventListener('submit', (e) => {
e.preventDefault();
// în realitate am apela ApplePaySession; aici doar simulăm succesul
completePayment('Apple Pay', {});
});


// —— SMS submit
$('#formSms').addEventListener('submit', (e) => {
e.preventDefault();
const phone = $('#phone').value.trim();
if(!validPhoneRO(phone)) return alert('Te rugăm să introduci un număr valid (07xxxxxxxx sau +407xxxxxxxx).');
// simulăm trimiterea codului și confirmarea automată
completePayment('SMS', { phone: phone.replace(/\s+/g,'') });
});


// —— Finalizare generică
function completePayment(method, meta={}){
const code = `BRV-${sel.parkingId}-${Date.now().toString(36).toUpperCase()}`;
const record = {
code, method, parkingId: sel.parkingId, hours: sel.hours, rate: sel.rate, total: sel.total,
createdAt: new Date().toISOString(), meta
};
const all = JSON.parse(localStorage.getItem('payments')||'[]');
all.push(record); localStorage.setItem('payments', JSON.stringify(all));


// Consumă 1 loc dacă există disponibilitate simulată pe acest id
try{
const key = `availability_${sel.parkingId}`;
const cur = JSON.parse(localStorage.getItem(key) || '{}');
if(typeof cur.spots === 'number'){
cur.spots = Math.max(0, cur.spots - 1);
cur.updatedAt = Date.now();
localStorage.setItem(key, JSON.stringify(cur));
}
}catch(err){ /* optional: ignore */ }


// Afișează confirmarea
$('#confCode').textContent = code;
$('#confMethod').textContent = method + (meta.masked ? ` (${meta.masked})` : '');
$('#confTotal').textContent = fmtRON(sel.total);
$('#confirmBox').classList.add('show');
window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}


// —— UX mic: formatare număr card & expirare
$('#ccNumber').addEventListener('input', (e)=>{
let v = e.target.value.replace(/\D/g,'').slice(0,19);
e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
});
$('#ccExpiry').addEventListener('input', (e)=>{
let v = e.target.value.replace(/\D/g,'').slice(0,4);
if(v.length>2) v = v.slice(0,2) + '/' + v.slice(2);
e.target.value = v;
});