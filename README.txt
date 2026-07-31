SignatureStudio update
=======================

ADDED 3 AUTHORIZED USERS (src/ + firestore.rules)

Added to the rollout allowlist, in BOTH the code and the Firestore rules:
    sarah.tareen@compass.com
    trevor.evans@compass.com
    ariel.mantilla@compass.com

Full approved list is now 11 people.

DEPLOY -- BOTH PARTS (the two lists must match)
  1. Firebase console -> Firestore Database -> Rules -> paste firestore.rules ->
     Publish.
  2. Drag src/ into the repo root, commit, let Vercel build.
  3. Hard-refresh.

Until BOTH are done, the 3 new users will either see the app but not be able to
save (if only the code is deployed) or be blocked despite looking approved (if
only the rules are published). Do both.

This drop also still includes everything recent: the write-quota save fix, the
publish timeout, the "Start from scratch or use a template" copy, and the
banner sidebar spacing. And the 14 baked-in templates.

NOTE: the Firestore quota is still in effect until the daily reset (midnight
Pacific). These 3 users can sign in once deployed, but saves/publishes won't
persist until the quota resets.
