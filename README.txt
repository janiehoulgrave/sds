SignatureStudio update
=======================

ONE DEPLOY = TEMPLATES BAKED IN + LOADER FIX + ALLOWLIST  (src/ + firestore.rules)

This single drop gets you fully unstuck and live. It includes everything from
the last drop PLUS all 14 of your template edits baked directly into the code.

1. YOUR 14 TEMPLATE EDITS ARE NOW BUILT IN
   All 14 edited templates are baked into the shipped defaults, so every
   approved user gets them automatically on deploy -- no publish step, no
   localStorage, no browser gymnastics needed:
     Classic Professional, Elegant Serif, Clean & Focused, Corporate Clean,
     Editorial, Bold Impact, Modern Luxury, Everyday Essential,
     Signature Monogram, Modern Editorial, Atelier, Marquee, Prestige,
     Italic Classic.
   Each keeps its original thumbnail; your name/description/tagline/style/tags/
   layout edits are applied on top.

2. LOADER HANG FIX
   The account loader now checks the allowlist BEFORE any Firestore call, so a
   not-approved (or mid-rules) user goes straight to "Not authorized" instead of
   hanging on "Loading your account…". This is what fixes the stuck screen.

3. ROLLOUT ALLOWLIST (8 approved emails, in code AND rules)
     janie.houlgrave@compass.com   amy.peery@compass.com
     laura.carr@compass.com        a.vang@compass.com
     sarah.menard@compass.com      kimberly.winters@compass.com
     lindsey.mcnerney@compass.com  toria.hester@compass.com

PUBLISH FLOW GOING FORWARD -- UNAFFECTED
   You can still tweak any template and hit "Publish to all users" as normal.
   Published edits (Firestore) layer OVER these baked defaults. The only change:
   for these 14, "revert to original" now returns to your current baked version,
   not the pristine Compass preset -- which is almost certainly what you want.

DEPLOY -- RULES FIRST
   1. Firebase console -> Firestore Database -> Rules -> paste firestore.rules ->
      Publish. (Your email is in the list, so this unblocks your account.)
   2. Drag src/ into the repo root, commit, let Vercel build.
   3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

AFTER DEPLOY
   - Your account loads normally again.
   - All 14 edited templates appear for every approved user, automatically.
   - You do NOT need to do the console-paste / localStorage restore anymore --
     the templates ship in the code now. Your earlier localStorage edits are
     already captured here.
