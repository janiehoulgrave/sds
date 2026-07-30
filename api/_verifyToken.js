// Shared Firebase ID token verification, used by both the upload and delete
// endpoints. Verifies an ID token the way the Firebase docs prescribe for
// third-party verification: RS256 signature against the matching Google cert
// (by the token's `kid`), correct issuer + audience for this project, and an
// unexpired token. Needs no Firebase Admin SDK and no service-account secret,
// just the project ID (FIREBASE_PROJECT_ID). Returns the decoded payload if
// everything checks out, otherwise throws.

import { createPublicKey, createVerify } from "crypto";

// Google rotates the signing certs for Firebase ID tokens periodically, so we
// fetch them on demand and cache them until the max-age the response tells us.
let certCache = { certs: null, expiresAt: 0 };

async function getGoogleCerts() {
  const now = Date.now();
  if (certCache.certs && now < certCache.expiresAt) return certCache.certs;

  const res = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
  );
  if (!res.ok) throw new Error("Could not fetch Google signing certs");
  const certs = await res.json();

  let maxAgeMs = 60 * 60 * 1000; // default 1 hour
  const cc = res.headers.get("cache-control") || "";
  const m = cc.match(/max-age=(\d+)/);
  if (m) maxAgeMs = parseInt(m[1], 10) * 1000;

  certCache = { certs, expiresAt: now + maxAgeMs };
  return certs;
}

function b64urlToBuffer(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function decodeSegment(seg) {
  return JSON.parse(b64urlToBuffer(seg).toString("utf8"));
}

export async function verifyFirebaseToken(idToken, projectId) {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Malformed token");
  const [headerB64, payloadB64, sigB64] = parts;

  const header = decodeSegment(headerB64);
  const payload = decodeSegment(payloadB64);

  if (header.alg !== "RS256") throw new Error("Wrong token algorithm");
  if (!header.kid) throw new Error("Token missing key id");

  const certs = await getGoogleCerts();
  const certPem = certs[header.kid];
  if (!certPem) throw new Error("No matching signing key");

  const publicKey = createPublicKey(certPem);
  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();
  const ok = verifier.verify(publicKey, b64urlToBuffer(sigB64));
  if (!ok) throw new Error("Bad token signature");

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp <= nowSec) throw new Error("Token expired");
  if (payload.iat > nowSec + 300) throw new Error("Token issued in the future");
  if (payload.aud !== projectId) throw new Error("Token audience mismatch");
  if (payload.iss !== `https://securetoken.google.com/${projectId}`)
    throw new Error("Token issuer mismatch");
  if (!payload.sub) throw new Error("Token missing subject");

  return payload;
}
