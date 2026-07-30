SDS UPDATE - Media Library delete (from library AND R2 storage)
================================================================

FILES IN THIS ZIP -- where each goes:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/upload-url.js         -> replaces api/upload-url.js  (refactored)
  api/delete-asset.js       -> NEW FILE, add to api/
  api/_verifyToken.js       -> NEW FILE, add to api/  (shared by the other two)

IMPORTANT: all four must be deployed together. upload-url.js now imports
_verifyToken.js, and delete-asset.js needs both _verifyToken.js and it. If you
deploy only some, the functions will error.

WHAT'S NEW:
  - Deleting from the Media Library now ALSO deletes the file from R2 storage,
    reclaiming space (previously it only removed the library entry).
  - Before deleting, the app checks whether the image is used in any of your
    saved signatures. If it is, you get a clear warning naming those
    signatures and explaining the delete will break the image in emails
    already sent -- with a "Delete anyway" option. If it's not used anywhere,
    it deletes with a simple confirm.
  - Security: the delete endpoint only lets a signed-in @compass.com user
    delete files under their OWN user-uploads/<uid>/ prefix. No one can delete
    another agent's files or any banner.

DEPLOY (GitHub web UI):
  1. Unzip. You'll get src/ and api/ folders.
  2. On GitHub, open your repo root.
  3. Drag the src/ folder in (overwrites src/SignatureStudio.jsx).
  4. Drag the api/ folder in (overwrites upload-url.js, adds delete-asset.js
     and _verifyToken.js). Confirm the commit shows 1 changed + 2 new files
     under api/.
  5. Commit. Vercel auto-deploys.
  6. Hard-refresh sds.janienation.com (Cmd+Shift+R).

ENV VAR: no new ones needed. FIREBASE_PROJECT_ID (already set) is reused by
the delete endpoint.

TESTING:
  - Delete an UNUSED uploaded image -> simple confirm -> gone from library,
    and its R2 URL should now 404 (file removed).
  - Put an uploaded image in a signature, save, then try deleting it from the
    library -> you should get the "in use" warning naming that signature.
