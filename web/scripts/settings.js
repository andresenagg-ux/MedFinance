const API_BASE_URL = window.__CONSENT_API__ || 'http://localhost:4000';
const STORAGE_USER_ID = 'medfinance_user_id';
const STORAGE_CONSENT_STATUS = 'medfinance_consent_status';

const statusLabel = document.getElementById('consent-status');
const messageBox = document.getElementById('status-message');
const revokeButton = document.getElementById('revoke-button');
const acceptButton = document.getElementById('accept-again');

const ensureUserId = () => {
  let id = localStorage.getItem(STORAGE_USER_ID);
  if (!id) {
    id = `user-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_USER_ID, id);
  }
  return id;
};

const updateMessage = (text) => {
  messageBox.textContent = text;
  messageBox.classList.remove('hidden');
};

const clearMessage = () => {
  messageBox.classList.add('hidden');
  messageBox.textContent = '';
};

const updateStatus = ({ consented, createdAt }) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString('pt-BR')
    : 'data indisponível';
  statusLabel.textContent = consented
    ? `Consentimento ativo desde ${formattedDate}.`
    : `Consentimento revogado em ${formattedDate}.`;

  localStorage.setItem(STORAGE_CONSENT_STATUS, consented ? 'accepted' : 'rejected');
};

const loadStatus = async () => {
  const userId = ensureUserId();
  clearMessage();
  statusLabel.textContent = 'Verificando seu consentimento...';

  try {
    const response = await fetch(`${API_BASE_URL}/consents/${userId}`);
    if (response.status === 404) {
      statusLabel.textContent = 'Nenhum consentimento registrado ainda.';
      revokeButton.disabled = true;
      return;
    }
    if (!response.ok) {
      throw new Error();
    }
    const consent = await response.json();
    updateStatus(consent);
    revokeButton.disabled = !consent.consented;
  } catch (error) {
    statusLabel.textContent = 'Não foi possível carregar o status do consentimento.';
    updateMessage('Tente novamente mais tarde ou verifique sua conexão com o servidor.');
  }
};

const registerConsent = async () => {
  const userId = ensureUserId();
  clearMessage();
  try {
    const response = await fetch(`${API_BASE_URL}/consents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, consented: true })
    });
    if (!response.ok) {
      throw new Error();
    }
    const consent = await response.json();
    updateStatus(consent);
    revokeButton.disabled = false;
    updateMessage('Consentimento salvo com sucesso.');
  } catch (error) {
    updateMessage('Erro ao registrar consentimento. Tente novamente.');
  }
};

const revokeConsent = async () => {
  const userId = ensureUserId();
  clearMessage();
  try {
    const response = await fetch(`${API_BASE_URL}/consents/${userId}/revoke`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error();
    }
    const consent = await response.json();
    updateStatus(consent);
    revokeButton.disabled = true;
    updateMessage('Consentimento revogado. Você pode aceitar novamente quando quiser.');
  } catch (error) {
    updateMessage('Não foi possível revogar o consentimento.');
  }
};

revokeButton?.addEventListener('click', revokeConsent);
acceptButton?.addEventListener('click', registerConsent);

loadStatus();
