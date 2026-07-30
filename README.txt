SDS UPDATE - social alignment control + font defaults + prior batch
===================================================================

FILES IN THIS ZIP -- where each goes:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/upload-url.js         -> replaces api/upload-url.js
  api/delete-asset.js       -> NEW FILE, add to api/
  api/_verifyToken.js       -> NEW FILE, add to api/

(Only src/SignatureStudio.jsx changed since the last batch. Re-dragging the
api/ files is harmless -- identical.)

WHAT CHANGED THIS BUILD:
  - SOCIAL ICONS: added a left/center/right Alignment control to the social
    element panel (it was missing -- that's why alignment felt uncontrollable).
    The row still shrink-wraps to the icons; the Alignment control slides that
    group left/center/right within the column, live in the canvas and in the
    export. (Note: this is the correct approach -- making the container itself
    full-width would actually BREAK alignment, since text-align needs the row
    to shrink-wrap to have room to move it.)
  - FONT DEFAULTS for NEW elements: Name defaults to 24px; everything else
    defaults to 11px (was 13px). Existing elements keep whatever size they
    already have -- this only affects newly added elements. The render
    fallback for any element with no stored size is now 11px too.

STILL IN THIS BUILD (recent batches):
  - Flush line spacing by default (add space via Padding).
  - Media Library page: delete removes the R2 file + warns if image is in use.
  - Image-block uploads add to the Media Library.
  - Media icon below Build in the sidebar.

DEPLOY (GitHub web UI):
  1. Unzip -> src/ and api/.
  2. On GitHub, open the repo root.
  3. Drag src/ in (overwrites SignatureStudio.jsx).
  4. Drag api/ in.
  5. Commit. Vercel auto-deploys. Hard-refresh (Cmd+Shift+R).

ENV VAR: none new.
