
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics"; // Added Analytics import
// import { getFirestore, Firestore } from "firebase/firestore"; // Uncomment if you need Firestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXoG-IfoLJ5sgK9XwmmJVFmI69KLjjglE",
  authDomain: "timebank-b1dc2.firebaseapp.com",
  projectId: "timebank-b1dc2",
  storageBucket: "timebank-b1dc2.appspot.com", // Corrected: .appspot.com is typical for storageBucket
  messagingSenderId: "291438162874",
  appId: "1:291438162874:web:cbd3b64bfeafcaf7d0e383",
  measurementId: "G-HD3DTBTFL9"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// const db: Firestore = getFirestore(app); // Uncomment if you need Firestore

export { app, auth, analytics /*, db */ };
