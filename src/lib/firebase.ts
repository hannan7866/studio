
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// import { getFirestore, Firestore } from "firebase/firestore"; // Uncomment if you need Firestore

// These are the keys from firebaseConfig that are essential for Firebase to work correctly.
// We check these to provide a helpful warning if they are missing.
const CONFIG_KEYS_TO_CHECK = {
  'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID is optional, so not strictly checked here
};

// Perform this check only on the client-side where these env vars are expected to be available after build.
if (typeof window !== 'undefined') {
  const missingEnvs = Object.entries(CONFIG_KEYS_TO_CHECK)
    .filter(([, value]) => !value) // Checks for undefined, null, or empty strings
    .map(([key]) => key);

  if (missingEnvs.length > 0) {
    console.warn(
      `🔴 Firebase Configuration Alert 🔴\n` +
      `The SkillSwap application has detected that some critical Firebase environment variables are missing, undefined, or empty:\n` +
      missingEnvs.map(key => `  - ${key}`).join('\n') +
      `\nThis will likely lead to Firebase errors (such as 'auth/invalid-api-key') and prevent Firebase-dependent features from working.\n` +
      `Please ensure these variables are correctly set in your '.env.local' file (for local development) or in your deployment environment's configuration.` +
      `\nValues should be obtained from your Firebase project console (Project settings > General > Your apps > Firebase SDK snippet).` +
      `\n\nExample .env.local content can be found in .env.local.example`
    );
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
// const db: Firestore = getFirestore(app); // Uncomment if you need Firestore

export { app, auth /*, db */ };

