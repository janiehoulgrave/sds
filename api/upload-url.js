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
import { verifyFirebaseToken } from "./_verifyToken.js";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});


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
      // Surface the specific reason in the server logs so a 401 can be
      // diagnosed (audience mismatch, expired token, bad signature, etc.)
      // rather than being an opaque "Not authorized".
      console.error("Firebase token verification failed:", err && err.message);
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
