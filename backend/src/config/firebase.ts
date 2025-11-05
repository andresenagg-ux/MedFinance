import admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import { env } from './env';
import { logger } from './logger';

let firestoreInstance: Firestore | null = null;

function normalizePrivateKey(privateKey: string): string {
  return privateKey.replace(/\\n/g, '\n');
}

export function isFirebaseConfigured(): boolean {
  return Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
}

export function getFirestore(): Firestore {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  if (!isFirebaseConfigured()) {
    throw new Error('Firebase credentials are not configured.');
  }

  const privateKey = env.FIREBASE_PRIVATE_KEY as string;

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(privateKey),
    }),
  });

  firestoreInstance = app.firestore();

  logger.info('Firebase connection established');

  return firestoreInstance;
}
