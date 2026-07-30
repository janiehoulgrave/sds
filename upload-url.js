// Runs on Vercel's server, never in the browser -- this is the only place
// that ever touches the real R2 secret credentials. The browser calls this
// function, this function proves the caller has permission, and hands back a
// short-lived signed URL. The browser then uploads the actual file bytes
// directly to R2 using that signed URL -- the file itself never passes
// through this function or through Vercel at all, just the permission to
// upload it.
//
// There are now TWO ways to be authorized:
//
//   1. adminSecret === ADMIN_UPLOAD_SECRET
//        -> the banner-upload path (Janie only). Files land under banners/.
//
//   2. A valid Firebase ID token from a signed-in @compass.com user.
//        -> the regular-agent path, e.g. uploading an animated GIF for their
//           own signature. Files land under user-uploads/<uid>/ so every
//           agent's uploads are namespaced to their own Firebase UID.
//
// The token is verified here on the server by checking its signature against
// Google's public keys, plus issuer / audience / expiry / email domain. This
// needs no Firebase Admin SDK and no service-account secret -- just the
// project ID -- so it stays a zero-dependency addition on top of what the
// function already imported.

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPublicKey, createVerify } from "crypto";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Google rotates the signing certs for Firebase ID tokens periodically, so we
// fetch them on demand and cache them until the max-age the response tells us
// to. This keeps token verification working without redeploys.
let certCache = { certs: null, expiresAt: 0 };

async function getGoogleCerts() {
  const now = Date.now();
  if (certCache.certs && now < certCache.expiresAt) return certCache.certs;

  const res = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
  );
  if (!res.ok) throw new Error("Could not fetch Google signing certs");
  const certs = await res.json();

  // Respect the Cache-Control max-age so we refresh in step with rotation.
  let maxAgeMs = 60 * 60 * 1000; // sensible default of 1 hour
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

// Verifies a Firebase ID token the way the Firebase docs prescribe for
// third-party verification: RS256 signature against the matching Google cert
// (by the token's `kid`), correct issuer + audience for this project, and an
// unexpired token. Returns the decoded payload if everything checks out,
// otherwise throws.
async function verifyFirebaseToken(idToken, projectId) {
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { adminSecret, idToken, filename, contentType } = req.body || {};
  if (!filename || !contentType) {
    return res.status(400).json({ error: "Missing filename or contentType" });
  }

  // Figure out who this is and where their file is allowed to land.
  let keyPrefix = null;

  // Path 1: admin banner upload.
  if (adminSecret && adminSecret === process.env.ADMIN_UPLOAD_SECRET) {
    keyPrefix = "banners";
  } else if (idToken) {
    // Path 2: a regular signed-in Compass agent uploading their own asset.
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.error("FIREBASE_PROJECT_ID env var is not set");
      return res.status(500).json({ error: "Server auth is not configured" });
    }
    try {
      const payload = await verifyFirebaseToken(idToken, projectId);
      const email = (payload.email || "").toLowerCase();
      const emailVerified = payload.email_verified === true;
      if (!emailVerified || !/@compass\.com$/.test(email)) {
        return res.status(403).json({ error: "Compass account required" });
      }
      // Namespace every user's uploads under their own UID.
      keyPrefix = `user-uploads/${payload.sub}`;
    } catch (err) {
      return res.status(401).json({ error: "Not authorized" });
    }
  }

  if (!keyPrefix) {
    return res.status(401).json({ error: "Not authorized" });
  }

  // Guard the content type for the user path -- agents may only upload images,
  // never arbitrary files. (The admin banner path is trusted, so it isn't
  // restricted here.) This is belt-and-suspenders alongside the client cap.
  if (keyPrefix.startsWith("user-uploads/") && !/^image\//.test(contentType)) {
    return res.status(400).json({ error: "Only image uploads are allowed" });
  }

  // Unique object key so two people uploading "logo.gif" don't collide.
  const ext = (filename.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    // Signed URL is valid for 5 minutes -- plenty of time for an upload to
    // start, short enough that it's useless to anyone who intercepts it later.
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return res.status(200).json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("R2 signed URL error:", err);
    return res.status(500).json({ error: "Could not generate upload URL" });
  }
}
