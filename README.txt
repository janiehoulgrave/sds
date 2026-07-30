SDS UPDATE - Media Library delete + nav order (Media now below Build)
=====================================================================

FILES IN THIS ZIP -- where each goes:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/upload-url.js         -> replaces api/upload-url.js  (refactored)
  api/delete-asset.js       -> NEW FILE, add to api/
  api/_verifyToken.js       -> NEW FILE, add to api/  (shared by the other two)

IMPORTANT: all four must be deployed together. upload-url.js imports
_verifyToken.js, and delete-asset.js needs both. Deploying only some will error.

WHAT'S IN THIS BUILD:
  - Media Library sidebar icon now sits BELOW Build (order: Home, Recent,
    Templates, Build, Media).
  - Deleting from the Media Library deletes the file from R2 storage too.
  - Before deleting, checks if the image is used in any saved signature and
    warns (naming them) with a "Delete anyway" option. Unused images delete
    with a simple confirm.
  - Delete endpoint only lets a signed-in @compass.com user delete their OWN
    user-uploads/<uid>/ files.

DEPLOY (GitHub web UI):
  1. Unzip -> src/ and api/ folders.
  2. On GitHub, open the repo root.
  3. Drag src/ in (overwrites SignatureStudio.jsx).
  4. Drag api/ in (overwrites upload-url.js, adds delete-asset.js + _verifyToken.js).
  5. Commit. Vercel auto-deploys. Hard-refresh (Cmd+Shift+R).

ENV VAR: none new. Reuses FIREBASE_PROJECT_ID.
