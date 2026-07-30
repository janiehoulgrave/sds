SDS UPDATE - image element now adds to media library (+ prior batch)
====================================================================

FILES IN THIS ZIP -- where each goes:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/upload-url.js         -> replaces api/upload-url.js
  api/delete-asset.js       -> NEW FILE, add to api/
  api/_verifyToken.js       -> NEW FILE, add to api/  (shared by the other two)

(Only src/SignatureStudio.jsx changed since the last batch. Re-dragging the
api/ files is harmless -- they're identical.)

WHAT CHANGED THIS BUILD:
  - Uploading an image via the generic Image block ("Replace Image") now also
    adds it to your Media Library, matching how headshot/logo/badge uploads
    already behave. Every upload path is now consistent.

STILL IN THIS BUILD (from recent batches):
  - Flush line spacing by default (add space via Padding controls).
  - Media Library page: delete removes the R2 file too, with an in-use warning
    naming any signature that references the image.
  - Media icon sits below Build in the sidebar.

DEPLOY (GitHub web UI):
  1. Unzip -> src/ and api/ folders.
  2. On GitHub, open the repo root.
  3. Drag src/ in (overwrites SignatureStudio.jsx).
  4. Drag api/ in (overwrites upload-url.js, adds delete-asset.js + _verifyToken.js).
  5. Commit. Vercel auto-deploys. Hard-refresh (Cmd+Shift+R).

ENV VAR: none new.
