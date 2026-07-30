SDS UPDATE - "image missing" placeholder for broken/deleted images
==================================================================

FILE THAT CHANGED:
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  (api/* unchanged; included for a complete set, re-dragging is harmless.)

WHAT CHANGED:
  - When an image in a signature fails to load in the EDITOR canvas (its R2
    file was deleted, an old base64 got cleared, or a link died), it now shows
    a gentle dashed "Image missing -- re-upload to fix" placeholder instead of
    the browser's broken-image icon. Covers the main image, headshot, logo,
    and badges.
  - The Media Library grid does the same: a thumbnail that can't load shows a
    small "Image missing" note instead of a broken box.

IMPORTANT -- CANVAS ONLY:
  This is purely an editor-side nicety. The exported/pasted signature HTML is
  a plain string and is completely unchanged -- no error handlers or
  placeholders ever go into an email. If an image is genuinely deleted, the
  email will still show a broken image (nothing we can do about already-sent
  mail); this just makes the EDITOR tell the agent clearly so they can
  re-upload before sending again.

DEPLOY (GitHub web UI):
  1. Unzip -> src/ (and api/).
  2. GitHub: drag src/ into repo root (overwrites SignatureStudio.jsx). Commit.
  3. Vercel auto-deploys. Hard-refresh (Cmd+Shift+R).

TEST:
  - Put an uploaded image in a signature, then delete that image from the
    Media Library, then reopen/!view the signature -> you should see the
    "Image missing" placeholder in the canvas, not a broken icon.

ENV VAR: none new. No Firestore rules change.
