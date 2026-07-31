SignatureStudio update
=======================

PUBLISH TEMPLATES TO ALL USERS (admin-only)  --  src/ + firestore.rules

You can now publish your templates to every agent straight from admin mode,
with no code deploy and no JSON export. This replaces the old export-and-bake
workflow.

HOW IT WORKS
  - Admin controls (including Publish) are locked to your account only
    (UID 1idnAdK800UUzg7xW9hmH76OgH82). No other signed-in user can open admin
    mode or publish, even with the passphrase.
  - On the Templates screen in admin mode you'll see a blue "Publish to all
    users" button, plus a "Last published ..." timestamp.
  - Publishing writes your current templates (your built-in tweaks + any custom
    templates) to a shared Firestore doc: shared/publishedTemplates.
  - Every user loads that shared doc on startup, so your published templates
    become their defaults automatically.
  - Publishing asks for confirmation first, and is cumulative -- it merges over
    whatever was published before, so it never silently drops earlier work.
  - Your own unpublished local edits still layer on top for YOUR preview, so you
    can tweak, review, then publish when ready. After publishing, your local
    override layer is cleared (since it's now the shared default).

SECURITY
  Two locks: the UI only shows admin/publish to your account, AND the Firestore
  rules only allow WRITES to shared/* from your UID. Reads are open to all
  signed-in @compass.com users. So even someone bypassing the front-end cannot
  publish.

DEPLOY -- TWO STEPS, RULES FIRST
  1. Publish the Firestore rules FIRST (this is required or publishing will be
     denied):
       - Firebase console -> Firestore Database -> Rules
       - Replace the rules with the contents of firestore.rules from this zip
       - Click Publish
  2. Then deploy the code:
       - Drag the src/ folder into your GitHub repo root and commit
       - Let Vercel build
       - Hard-refresh sds.janienation.com (Cmd+Shift+R)

FIRST PUBLISH
  After both steps, open Templates in admin mode and click "Publish to all
  users" once to push your current templates live for everyone. Confirm the
  "Last published" timestamp updates.

NOTE
  The old "Export JSON" button is still there as a backup, but you shouldn't
  need it anymore.
