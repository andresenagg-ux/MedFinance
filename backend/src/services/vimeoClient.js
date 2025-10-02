import { Vimeo } from '@vimeo/vimeo';
import dotenv from 'dotenv';

dotenv.config();

const {
  VIMEO_CLIENT_ID,
  VIMEO_CLIENT_SECRET,
  VIMEO_ACCESS_TOKEN,
} = process.env;

let clientInstance = null;

function ensureCredentials() {
  if (!VIMEO_CLIENT_ID || !VIMEO_CLIENT_SECRET || !VIMEO_ACCESS_TOKEN) {
    throw new Error(
      'Credenciais da API Vimeo ausentes. Defina VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET e VIMEO_ACCESS_TOKEN.'
    );
  }
}

function getClient() {
  if (clientInstance) {
    return clientInstance;
  }

  ensureCredentials();
  clientInstance = new Vimeo(VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET, VIMEO_ACCESS_TOKEN);
  return clientInstance;
}

export async function createTusUpload({ name, size, privacyView = 'unlisted', redirectUrl }) {
  const client = getClient();

  const body = {
    name,
    privacy: { view: privacyView },
    upload: {
      approach: 'tus',
      size,
    },
  };

  if (redirectUrl) {
    body.upload.redirect_url = redirectUrl;
  }

  return new Promise((resolve, reject) => {
    client.request(
      {
        method: 'POST',
        path: '/me/videos',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      },
      (error, response) => {
        if (error) {
          return reject(error);
        }

        resolve(response);
      }
    );
  });
}
