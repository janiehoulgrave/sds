SDS UPDATE - flush line spacing + media delete + nav order
==========================================================

FILES IN THIS ZIP -- where each goes:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/upload-url.js         -> replaces api/upload-url.js
  api/delete-asset.js       -> NEW FILE, add to api/
  api/_verifyToken.js       -> NEW FILE, add to api/  (shared by the other two)

(If you already deployed the media-delete batch, only src/SignatureStudio.jsx
changed since then -- but re-dragging the api/ files is harmless, they're
identical.)

WHAT CHANGED THIS BUILD:
  - Text lines now default to NO bottom spacing (was a hidden 2px). Lines sit
    flush; add space with the Padding controls in the panel. This fixes the
    "spacing I can't control" between name/title and below the address.
  - HEADS UP: this reflows spacing everywhere the old 2px default was in play.
    The 13 preset templates will look slightly tighter than before. Elements
    with an explicit margin/padding are unaffected. Re-tune presets later if
    any look too tight.
  - (Also in this batch, from before: Media Library page with delete-from-R2 +
    in-use warning; Media icon sits below Build in the sidebar.)

DEPLOY (GitHub web UI):
  1. Unzip -> src/ and api/ folders.
  2. On GitHub, open the repo root.
  3. Drag src/ in (overwrites SignatureStudio.jsx).
  4. Drag api/ in (overwrites upload-url.js, adds delete-asset.js + _verifyToken.js).
  5. Commit. Vercel auto-deploys. Hard-refresh (Cmd+Shift+R).

ENV VAR: none new.
