import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ✅ Replace these with your own Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyB8vbXjQUxBpOBQ6Tv1X4pZWx-QujV-ovw",
  authDomain: "ngo-proposal-c1d63.firebaseapp.com",
  projectId: "ngo-proposal-c1d63",
  storageBucket: "ngo-proposal-c1d63.firebasestorage.app",
  messagingSenderId: "83959652171",
  appId: "1:83959652171:web:cfd5c8a1cf2b56a7e812ce",
  measurementId: "G-DJ7Z2E8T2X"
};

// ✅ Prevent multiple initializations in Next.js hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export your Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
