SDS UPDATE - six fixes (links, black text, company field, social, spacing)
==========================================================================

FILES IN THIS ZIP -- where each goes:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/upload-url.js         -> replaces api/upload-url.js
  api/delete-asset.js       -> NEW FILE, add to api/
  api/_verifyToken.js       -> NEW FILE, add to api/

(Only src/SignatureStudio.jsx changed since last batch; re-dragging api/ is
harmless -- identical.)

THE SIX CHANGES:
  1. Stray spacing around images removed (line-height:0/font-size:0 on the
     image wrapper kills the inline descender gap). NOTE: the ~8px top/bottom
     space on a ROW is intentional row padding -- adjust it in Row Settings >
     Padding Top/Bottom if you want rows tighter.
  2. Links now work without "https://www." -- any URL typed without a scheme
     (e.g. "compass.com") is auto-prefixed with https:// at render. Applies to
     the Website smart field (now clickable), buttons, social icons, and
     custom links.
  3. Signature text now defaults to TRUE BLACK (#000000) instead of dark gray.
     Affects new elements and the render fallback; existing elements keep their
     stored color.
  4. NEW "Company" smart element -- addable from the Smart Fields list, pulls
     from the profile Company field (was renderable in presets but not addable).
  5. Social icons now DEFAULT to 16px (was 28px). Existing socials keep their
     size; new ones and the panel default are 16.
  6. Social selection box in the EDITOR now spans the full column width, so
     it's easy to click. Icons still sit according to their alignment; the
     exported signature is unchanged.

DEPLOY (GitHub web UI):
  1. Unzip -> src/ and api/.
  2. On GitHub, open the repo root.
  3. Drag src/ in (overwrites SignatureStudio.jsx).
  4. Drag api/ in.
  5. Commit. Vercel auto-deploys. Hard-refresh (Cmd+Shift+R).

ENV VAR: none new.
