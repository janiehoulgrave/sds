import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";
import { HERO_PHOTO } from "./brandAssets.js";

const ALLOWED_DOMAIN = "compass.com";
const INACTIVITY_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours
const LAST_ACTIVITY_KEY = "ss_last_activity";

// Wraps the whole app. Nothing inside renders until someone is signed in
// AND their email ends in @compass.com -- Firebase Auth confirms who they
// are, this domain check confirms they're allowed in. If someone signs in
// with a non-Compass Google account, they're immediately signed back out
// and shown an error rather than silently let through.
//
// Session behavior: Firebase's default persistence already keeps someone
// signed in across tabs and page reloads indefinitely on its own -- no code
// needed for that part. What Firebase does NOT do on its own is expire a
// session after a period of inactivity, so that's tracked here explicitly:
// every real user interaction (click/keydown/scroll) stamps a timestamp in
// localStorage (shared across tabs, since it's the same key). On load, and
// periodically while the tab is open, if more time than the limit has
// passed since that timestamp, the user is signed out -- even though
// Firebase's own session would otherwise have stayed valid forever.
export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const signedOutForInactivity = useRef(false);

  function getLastActivity() {
    const v = localStorage.getItem(LAST_ACTIVITY_KEY);
    return v ? parseInt(v, 10) : null;
  }
  function markActivity() {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        const last = getLastActivity();
        if (last && Date.now() - last > INACTIVITY_LIMIT_MS) {
          // Stale session -- sign out rather than silently letting it
          // through just because Firebase's own token is still valid.
          signedOutForInactivity.current = true;
          signOut(auth);
          return;
        }
        markActivity();
      }
      setUser(u);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  // Track real activity while signed in, and periodically re-check in case
  // the tab is left open past the limit without a reload.
  useEffect(() => {
    if (!user) return;
    const events = ["click", "keydown", "scroll", "mousemove"];
    let lastMark = 0;
    function onActivity() {
      // Throttle localStorage writes -- no need to write on every single
      // mousemove event, once every 30s of active use is plenty.
      const now = Date.now();
      if (now - lastMark > 30000) { markActivity(); lastMark = now; }
    }
    events.forEach(e => window.addEventListener(e, onActivity));

    const interval = setInterval(() => {
      const last = getLastActivity();
      if (last && Date.now() - last > INACTIVITY_LIMIT_MS) {
        signedOutForInactivity.current = true;
        signOut(auth);
      }
    }, 60000); // check once a minute

    return () => {
      events.forEach(e => window.removeEventListener(e, onActivity));
      clearInterval(interval);
    };
  }, [user]);

  async function handleSignIn() {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || "";
      if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        await signOut(auth);
        setError(`Please sign in with your @${ALLOWED_DOMAIN} email address.`);
      } else {
        markActivity();
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
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"sans-serif", color:"#fff", background:"#161616" }}>
        Loading...
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"sans-serif", padding:20, background:"#161616" }}>
        <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", maxWidth:480, width:"100%", boxShadow:"0 25px 70px rgba(0,0,0,0.4)" }}>

          {/* Hero strip -- same dark-into-photo treatment as the actual
              Dashboard banner someone lands on right after signing in, just
              sized to fit inside a compact card instead of the full page. */}
          <div style={{ position:"relative", height:210, background:"#161616", display:"flex", alignItems:"flex-end", overflow:"hidden" }}>
            <img src={HERO_PHOTO} alt="" aria-hidden="true"
              style={{ position:"absolute", top:0, right:0, width:"55%", height:"100%", objectFit:"cover", objectPosition:"center center", pointerEvents:"none" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, #161616 0%, #161616 45%, rgba(22,22,22,0.7) 60%, rgba(22,22,22,0.15) 80%, rgba(22,22,22,0) 100%)" }} />
            <div style={{ position:"relative", zIndex:1, padding:"30px 36px" }}>
              <h1 style={{ fontSize:27, fontWeight:800, color:"#fff", letterSpacing:-0.3, lineHeight:1.2 }}>
                Signature Design Studio
              </h1>
            </div>
          </div>

          {/* Sign-in action */}
          <div style={{ padding:"34px 40px 40px", textAlign:"center" }}>
            <div style={{ fontSize:15, color:"#6b7280", marginBottom:26, lineHeight:1.55 }}>
              Sign in with your Compass Google account to create and manage your professional email signature.
            </div>

            {signedOutForInactivity.current && (
              <div style={{ fontSize:13, color:"#374151", background:"#f3f4f6", padding:"10px 14px", borderRadius:8, marginBottom:14, textAlign:"left" }}>
                You were signed out after a period of inactivity. Please sign in again.
              </div>
            )}
            {error && (
              <div style={{ fontSize:13, color:"#ef4444", background:"#fef2f2", padding:"10px 14px", borderRadius:8, marginBottom:14, textAlign:"left" }}>
                {error}
              </div>
            )}

            <button onClick={handleSignIn}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", padding:"13px 20px", fontSize:15, fontWeight:600, borderRadius:10, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer", boxShadow:"0 1px 2px rgba(0,0,0,0.05)", fontFamily:"inherit", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in with Google
            </button>

            <div style={{ fontSize:13, color:"#9ca3af", marginTop:20 }}>
              For Compass agents only &middot; @compass.com accounts
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
