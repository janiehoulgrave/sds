SignatureStudio update
=======================

PUBLISH BUTTON: STOP THE INFINITE SPINNER (src/ only)

The publish button hanging on "Publishing…" is the SAME quota problem as the
deletes. Publishing writes to Firestore, and while you're over the daily free
limit, that write doesn't fail -- Firebase retries it forever ("maximum backoff"
in the console), so the button spins and never finishes.

FIX
  Publishing now times out after ~12 seconds and shows a clear message
  ("...the database may be over its daily limit. Try again after the quota
  resets.") instead of hanging. The confirm dialog also closes so you're not
  stuck.

IMPORTANT -- what this does and doesn't do
  - It does NOT make publishing succeed while you're over quota. Publishing will
    still only work after the daily reset (midnight Pacific) or after upgrading
    to the Blaze plan. It just fails gracefully now instead of hanging.
  - You do NOT need publish to work today for your templates to be live: all 14
    template edits are already baked into the code, so every approved user gets
    them on deploy regardless of the publish button.

This drop also still includes the write-quota save fix (only writes changed
signatures), the "Start from scratch or use a template" copy, and the banner
sidebar spacing tweak.

DEPLOY
  1. Drag src/ into the repo root, commit, let Vercel build.
  2. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or rules changes in this drop.
