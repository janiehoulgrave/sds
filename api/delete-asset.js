// Deletes a single object from R2. Authorized ONLY by a signed-in @compass.com
// user's Firebase ID token, and a user may only delete files under their own
// user-uploads/<uid>/ prefix. (Banners are admin-managed and are not deletable
// through this endpoint.) The client sends the object key to delete; we
// re-derive the caller's allowed prefix from their verified token and refuse
// anything outside it, so one agent can never delete another's file even if
// they somehow guessed the key.

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { verifyFirebaseToken } from "./_verifyToken.js";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Turn a public URL back into its R2 object key. The client stores full public
// URLs (R2_PUBLIC_URL + "/" + key), so we strip the known public-URL prefix.
function keyFromUrl(url) {
  const base = process.env.R2_PUBLIC_URL || "";
  if (base && url.startsWith(base + "/")) return url.slice(base.length + 1);
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idToken, url } = req.body || {};
  if (!idToken || !url) {
    return res.status(400).json({ error: "Missing idToken or url" });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error("FIREBASE_PROJECT_ID env var is not set");
    return res.status(500).json({ error: "Server auth is not configured" });
  }

  let payload;
  try {
    payload = await verifyFirebaseToken(idToken, projectId);
  } catch (err) {
    console.error("Firebase token verification failed:", err && err.message);
    return res.status(401).json({ error: "Not authorized" });
  }

  const email = (payload.email || "").toLowerCase();
  if (payload.email_verified !== true || !/@compass\.com$/.test(email)) {
    return res.status(403).json({ error: "Compass account required" });
  }

  const key = keyFromUrl(url);
  if (!key) {
    // Not one of our R2 URLs (e.g. a base64 data URL, or a preset asset).
    // Nothing to delete from storage; treat as a no-op success so the client
    // can still drop the library entry.
    return res.status(200).json({ deleted: false, reason: "not-an-r2-url" });
  }

  // A user may only delete their OWN uploads. Re-derive the allowed prefix
  // from the verified token rather than trusting anything from the client.
  const allowedPrefix = `user-uploads/${payload.sub}/`;
  if (!key.startsWith(allowedPrefix)) {
    return res.status(403).json({ error: "You can only delete your own uploads." });
  }

  try {
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }));
    return res.status(200).json({ deleted: true });
  } catch (err) {
    console.error("R2 delete error:", err);
    return res.status(500).json({ error: "Could not delete the file from storage." });
  }
}
