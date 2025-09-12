import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Validate required environment variables
function validateFirebaseConfig(config: typeof firebaseConfig): void {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field as keyof typeof firebaseConfig]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase config fields: ${missingFields.join(', ')}`);
  }
}

// App initialization with error handling
function getOrInitApp(): FirebaseApp {
  try {
    validateFirebaseConfig(firebaseConfig);
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      console.info('Firebase app initialized successfully');
      return app;
    }
    return getApp();
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error);
    throw new Error('Firebase initialization failed. Check environment variables.');
  }
}

export const app = getOrInitApp();
export const auth = getAuth(app);
export const db = getFirestore(app);