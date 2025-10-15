// Tab switching
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.payform');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    forms.forEach(f => f.classList.remove('show'));
    document.querySelector(`#form${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`).classList.add('show');
  });
});

// Redirect to pag4.html on any payment
['formCard', 'formApple', 'formSms'].forEach(id => {
  document.getElementById(id).addEventListener('submit', (e) => {
    e.preventDefault();
    // Poți trimite metoda aleasă prin URL
    let method = id.replace('form', '').toUpperCase();
    window.location.href = `pag4.html?method=${method}`;
  });
});
