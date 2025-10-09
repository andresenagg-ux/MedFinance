const API_BASE_URL = window.__CONSENT_API__ || 'http://localhost:4000';
const STORAGE_USER_ID = 'medfinance_user_id';
const STORAGE_CONSENT_STATUS = 'medfinance_consent_status';

const banner = document.getElementById('consent-banner');
const acceptButton = document.getElementById('accept-consent');
const manageButton = document.getElementById('manage-consent');
const overlay = document.getElementById('preferences-overlay');
const closePreferencesButton = document.getElementById('close-preferences');
const form = document.getElementById('preferences-form');
const analyticsCheckbox = document.getElementById('analytics-consent');

const ensureUserId = () => {
  let id = localStorage.getItem(STORAGE_USER_ID);
  if (!id) {
    id = `user-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_USER_ID, id);
  }
  return id;
};

const setConsentStatus = (consented) => {
  localStorage.setItem(STORAGE_CONSENT_STATUS, consented ? 'accepted' : 'rejected');
  analyticsCheckbox.checked = consented;
};

const hideBanner = () => banner.classList.add('hidden');
const showBanner = () => banner.classList.remove('hidden');
const openPreferences = () => overlay.classList.remove('hidden');
const closePreferences = () => overlay.classList.add('hidden');

const registerConsent = async (userId, consented) => {
  const response = await fetch(`${API_BASE_URL}/consents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, consented })
  });

  if (!response.ok) {
    throw new Error('Não foi possível salvar o consentimento.');
  }

  return response.json();
};

const revokeConsent = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/consents/${userId}/revoke`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Não foi possível revogar o consentimento.');
  }

  return response.json();
};

const fetchLatestConsent = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/consents/${userId}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Erro ao buscar consentimento.');
  }
  return response.json();
};

const initializeConsent = async () => {
  const userId = ensureUserId();
  const storedStatus = localStorage.getItem(STORAGE_CONSENT_STATUS);

  try {
    const consent = await fetchLatestConsent(userId);
    if (consent) {
      setConsentStatus(consent.consented);
      if (!consent.consented) {
        showBanner();
      }
      return;
    }
  } catch (error) {
    console.warn(error.message);
    if (storedStatus === 'accepted') {
      analyticsCheckbox.checked = true;
      hideBanner();
      return;
    }
  }

  if (storedStatus === 'accepted') {
    analyticsCheckbox.checked = true;
    hideBanner();
  } else if (storedStatus === 'rejected') {
    analyticsCheckbox.checked = false;
    showBanner();
  } else {
    analyticsCheckbox.checked = true;
    showBanner();
  }
};

acceptButton?.addEventListener('click', async () => {
  const userId = ensureUserId();
  try {
    await registerConsent(userId, true);
    setConsentStatus(true);
    hideBanner();
  } catch (error) {
    alert(error.message);
  }
});

manageButton?.addEventListener('click', () => {
  const storedStatus = localStorage.getItem(STORAGE_CONSENT_STATUS);
  analyticsCheckbox.checked = storedStatus !== 'rejected';
  openPreferences();
});

closePreferencesButton?.addEventListener('click', () => {
  closePreferences();
});

overlay?.addEventListener('click', (event) => {
  if (event.target === overlay) {
    closePreferences();
  }
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const userId = ensureUserId();
  const consented = analyticsCheckbox.checked;

  try {
    if (consented) {
      await registerConsent(userId, true);
    } else {
      await revokeConsent(userId);
    }
    setConsentStatus(consented);
    if (consented) {
      hideBanner();
    } else {
      showBanner();
    }
    closePreferences();
  } catch (error) {
    alert(error.message);
  }
});

initializeConsent();
