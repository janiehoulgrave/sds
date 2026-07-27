// Runs on Vercel's server, never in the browser -- this is the only place
// that ever touches the real R2 secret credentials. The browser calls this
// function, this function proves it has permission (via a shared admin
// secret, same pattern as the app's existing admin passphrase) and hands
// back a short-lived signed URL. The browser then uploads the actual file
// bytes directly to R2 using that signed URL -- the file itself never
// passes through this function or through Vercel at all, just the
// permission to upload it.

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

  // Lightweight abuse guard -- reuses the same "compass-admin" style shared
  // secret concept already used elsewhere in the app, rather than requiring
  // full server-side Firebase token verification for this first pass.
  const { adminSecret, filename, contentType } = req.body || {};
  if (!adminSecret || adminSecret !== process.env.ADMIN_UPLOAD_SECRET) {
    return res.status(401).json({ error: "Not authorized" });
  }
  if (!filename || !contentType) {
    return res.status(400).json({ error: "Missing filename or contentType" });
  }

  // Unique object key so two people uploading "banner.gif" don't collide.
  const ext = filename.split(".").pop();
  const key = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

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
