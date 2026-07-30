SDS UPDATE - animated GIF support
==================================

This zip contains ONLY the two files changed this session, placed at their
correct repo paths. It is NOT the full project (the other files -- firebase.js,
AuthGate.jsx, main.jsx, package.json, vite.config.js, firestore.rules, the
public/ favicons, brandAssets.js -- are unchanged and stay as they are in your
repo).

Files in this zip:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/upload-url.js         -> replaces api/upload-url.js

HOW TO DEPLOY (GitHub web UI):
  1. Unzip this file. You'll get a src/ folder and an api/ folder.
  2. On GitHub, open your repo root.
  3. Drag the src/ folder in -- GitHub places SignatureStudio.jsx inside src/,
     overwriting the existing one. Confirm the commit shows it as a change to
     src/SignatureStudio.jsx (NOT a new file at the root).
  4. Drag the api/ folder in the same way for upload-url.js.
  5. Commit. Vercel auto-deploys.
  6. Hard-refresh sds.janienation.com (Cmd+Shift+R) after the build finishes.

REMINDER: the env var FIREBASE_PROJECT_ID must be set on Vercel
(value: signaturestudio-f49f4) for user GIF uploads to work.
