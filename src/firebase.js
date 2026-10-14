import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// All values come from Vercel/local environment variables -- never hardcode
// these directly in source, even though Firebase web config isn't a secret
// in the traditional sense (it's visible in the browser regardless). Keeping
// it in env vars just means swapping Firebase projects (e.g. dev vs prod)
// doesn't require a code change.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Auto-detects networks (corporate VPNs/proxies, some office Wi-Fi) that
// block Firestore's default streaming connection and silently switches to
// long-polling instead. Without this, writes on those networks can sit
// "pending" forever -- no error, no save -- which is exactly how a Share
// Link or "Make a Copy" looks when it spins and never finishes.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
