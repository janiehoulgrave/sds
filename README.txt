SignatureStudio update
=======================

DELETE-BUG DIAGNOSTICS + COPY CHANGE (src/ only)

1. "Create New Design" card copy changed from
     "Select a modern layout and customize it"
   to
     "Start from scratch or use a template"

2. RECENT PROJECTS UN-DELETING ON REFRESH -- instrumented to find the cause.
   The delete now logs to the browser console exactly what it does:
     - "[saveSigs] deleting from Firestore: [ids] for uid ..."
     - "[saveSigs] deleted OK: <id>"   (delete reached the server)
     - "[saveSigs] delete FAILED for <id> ..."  (server rejected it)
   It also shows a toast if the server delete fails, instead of silently
   swallowing the error like before.

   HOW TO HELP ME PIN IT DOWN AFTER DEPLOY:
     a. Open the app, right-click -> Inspect -> Console.
     b. Delete a recent project.
     c. Tell me which of the three log lines above appears (copy the text).
   That single line tells us whether the delete is reaching Firestore or being
   rejected -- and I'll ship the real fix immediately.

   (Note: writes and deletes are now issued separately rather than in one
   combined batch, which on its own may resolve a race that let a delete get
   undone by a concurrent write.)

DEPLOY
  1. Drag src/ into the repo root, commit, let Vercel build.
  2. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or rules changes in this drop.
