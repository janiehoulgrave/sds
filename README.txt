SignatureStudio update
=======================

FIX STUCK "LOADING YOUR ACCOUNT" + APPROVED-USER ALLOWLIST  (src/ + firestore.rules)

WHAT WENT WRONG
The app hung on "Loading your account…" because the account loader was making
Firestore calls that the new rules denied (your email wasn't in the allowlist
yet), and a denied call can leave the SDK retrying instead of failing cleanly.

FIXES
  1. The loader now checks the allowlist BEFORE any Firestore call. A user who
     isn't approved skips the data load entirely and goes straight to the
     "Not authorized" screen -- it can never hang on a denied call again.
  2. The 8 approved emails are baked into BOTH the code and the Firestore rules:
        janie.houlgrave@compass.com   amy.peery@compass.com
        laura.carr@compass.com        a.vang@compass.com
        sarah.menard@compass.com      kimberly.winters@compass.com
        lindsey.mcnerney@compass.com  toria.hester@compass.com

APPROVING MORE PEOPLE LATER
  Add the lowercase email in TWO places, then redeploy both:
    - ALLOWED_EMAILS in src/SignatureStudio.jsx
    - isAllowed() list in firestore.rules
  The two lists must always match.

OPENING TO ALL COMPASS USERS LATER
  - In the code: set ALLOWLIST_ENABLED = false
  - In the rules: make isAllowed() return isCompass()
  (I can do this final flip for you as a small drop when you're ready.)

DEPLOY -- RULES FIRST
  1. Firebase console -> Firestore Database -> Rules -> paste firestore.rules ->
     Publish. (Do this first, or approved users' saves will be denied.)
  2. Drag src/ into the repo root, commit, let Vercel build.
  3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

AFTER DEPLOY
  Your account (janie.houlgrave@compass.com) will load normally again. The other
  7 approved users can sign in and use it; anyone else sees "Not authorized."
