SDS UPDATE - Media Library migrated to Firestore (cross-device)
===============================================================

*** TWO-PART DEPLOY -- DO THE RULES FIRST ***

PART 1 (do this FIRST, before the code goes live):
  Update your Firestore security rules. The new media library needs a rule
  for the users/{uid}/media subcollection -- WITHOUT it, saves are DENIED and
  the library will appear empty with console errors.
    - firestore.rules in this zip is the full, updated ruleset.
    - Firebase console -> your project -> Firestore Database -> Rules tab ->
      paste it over the existing rules -> Publish. (Takes effect immediately.)
  The only change from your current rules is a new match /media/{mediaId}
  block, with the same per-user isolation as signatures.

PART 2 (the code):
  src/SignatureStudio.jsx   -> replaces src/SignatureStudio.jsx
  api/*                     -> unchanged this batch (included for a complete
                               set; re-dragging is harmless)

WHAT CHANGED:
  - The media library now loads from and saves to Firestore
    (users/{uid}/media), exactly like profiles and signatures. Uploads now
    follow an agent across devices and survive a browser cache clear.
  - Automatic one-time migration: the first time an existing agent loads the
    app, any media still in their browser's localStorage is copied up into
    Firestore. No action needed from them; nothing is lost.
  - localStorage is kept as a fast-paint cache only; Firestore is the source
    of truth.

DEPLOY ORDER:
  1. Publish the Firestore rules (Part 1). <-- don't skip or do second
  2. GitHub: drag src/ into repo root (overwrites SignatureStudio.jsx). Commit.
  3. Vercel auto-deploys. Hard-refresh (Cmd+Shift+R).

TEST:
  - Upload an image on one browser, then open the app in another browser (or
    incognito, signed in as the same account) -> it should appear.
  - Check the browser console for any "Failed to save media item to Firestore"
    errors -> if you see those, the rules weren't published.

ENV VAR: none new.
