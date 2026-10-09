// Lógica do formulário de inscrição da live.
//
// Funciona com qualquer design, desde que a página tenha estes IDs:
//   #field-name, #field-email, #field-phone  — campos (obrigatórios)
//   #btn-submit                               — botão que envia (obrigatório)
//   #form-error                               — onde aparece a mensagem de erro (opcional)
//   #btn-scroll-form                          — botão que rola até o formulário (opcional)
//
// Ao enviar: grava nome, e-mail e WhatsApp na planilha (Google Apps Script),
// dispara o evento Lead no Meta Pixel e redireciona para a página de obrigado.

// Planilha que recebe as inscrições (Web App do Google Apps Script).
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwpJ0rFd_L7DhatRrw62YgPCxzS1eBLsQlo6_h3JfeyZ5qSD3RUOITQASkz-uYUMB-Y/exec';
// Nome do evento no Meta Pixel — troque a cada nova live.
const LIVE_LABEL = 'Live 30/09';
// Para onde vai depois de inscrever.
const REDIRECT_URL = '/obrigado';

const nameField = document.getElementById('field-name');
const emailField = document.getElementById('field-email');
const phoneField = document.getElementById('field-phone');
const submitBtn = document.getElementById('btn-submit');
const errEl = document.getElementById('form-error');
const scrollBtn = document.getElementById('btn-scroll-form');

function showError(message) {
  if (errEl) {
    errEl.textContent = message;
    errEl.style.display = 'block';
  } else {
    alert(message);
  }
}

function hideError() {
  if (errEl) errEl.style.display = 'none';
}

function trackLead() {
  if (typeof fbq !== 'undefined') fbq('track', 'Lead', { content_name: LIVE_LABEL });
}

// Máscara (11) 90000-0000
phoneField?.addEventListener('input', function () {
  const digits = this.value.replace(/\D/g, '').slice(0, 11);
  let masked = '';
  if (digits.length > 0) masked += '(' + digits.slice(0, 2);
  if (digits.length >= 2) masked += ') ' + digits.slice(2, 7);
  if (digits.length >= 7) masked += '-' + digits.slice(7, 11);
  this.value = masked;
});

scrollBtn?.addEventListener('click', function () {
  if (!nameField) return;
  nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => nameField.focus(), 600);
});

submitBtn?.addEventListener('click', async function () {
  const btn = this;
  const originalLabel = btn.textContent;
  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const phoneRaw = phoneField.value.trim();
  const phone = phoneRaw ? '+55 ' + phoneRaw : '';

  hideError();

  if (!name || !email || !phoneRaw) {
    showError('Por favor, preencha todos os campos.');
    return;
  }

  if (phoneRaw.replace(/\D/g, '').length < 10) {
    showError('Digite um número de WhatsApp válido com DDD.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);

  try {
    const res = await fetch(SHEETS_URL, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Resposta inesperada: ' + res.status);
    trackLead();
    window.location.href = REDIRECT_URL;
  } catch (err) {
    // O Apps Script às vezes bloqueia a leitura da resposta (CORS); reenvia sem ler a resposta.
    try {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name, email, phone }),
      });
      trackLead();
      window.location.href = REDIRECT_URL;
    } catch (_) {
      showError('Erro ao enviar. Verifique sua conexão e tente novamente.');
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  }
});
