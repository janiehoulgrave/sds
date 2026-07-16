import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";

const ALLOWED_DOMAIN = "compass.com";

// Wraps the whole app. Nothing inside renders until someone is signed in
// AND their email ends in @compass.com -- Firebase Auth confirms who they
// are, this domain check confirms they're allowed in. If someone signs in
// with a non-Compass Google account, they're immediately signed back out
// and shown an error rather than silently let through.
export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  async function handleSignIn() {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || "";
      if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        await signOut(auth);
        setError(`Please sign in with your @${ALLOWED_DOMAIN} email address.`);
      }
    } catch (e) {
      // Popup closed by user, network issue, etc. -- not worth distinguishing
      // for the user, just let them try again.
      setError("Sign-in didn't complete. Please try again.");
    }
  }

  const isAllowed = user && (user.email || "").endsWith(`@${ALLOWED_DOMAIN}`);

  if (checking) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"sans-serif", color:"#6b7280" }}>
        Loading...
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"sans-serif", gap:16, background:"#f9fafb", padding:20, textAlign:"center" }}>
        <div style={{ fontSize:24, fontWeight:800, color:"#111827" }}>SignatureStudio</div>
        <div style={{ fontSize:15, color:"#6b7280", maxWidth:340 }}>Sign in with your Compass Google account to continue.</div>
        {error && (
          <div style={{ fontSize:14, color:"#ef4444", background:"#fef2f2", padding:"8px 14px", borderRadius:6, maxWidth:340 }}>
            {error}
          </div>
        )}
        <button onClick={handleSignIn}
          style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", fontSize:15, fontWeight:600, borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.1)", fontFamily:"inherit" }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  return children;
}
