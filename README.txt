SignatureStudio update
=======================

FIX: "EDITED LOCALLY" BADGE STAYING AFTER PUBLISH (src/ only)

Before, a template's "Edited locally" badge kept showing even after you
published it, because the badge treated local edits and published edits the
same. Now they're separate:

  - "Edited locally" (blue)  -> an UNPUBLISHED local edit only you can see.
  - "Published" (green, admin-only) -> the edit is live for all users.

When you publish, your local edit is cleared and folded into the published
version, so the badge switches from "Edited locally" to "Published"
automatically. The revert button now also only appears when there's an actual
unpublished local edit to discard.

WHY IT LOOKED STUCK EARLIER
Publishing was silently failing due to the Firestore quota, so the local edit
never cleared. Now that you're on the Blaze plan, publishing succeeds and the
badge updates correctly. This fix + Blaze together resolve it.

DEPLOY
  1. Drag src/ into the repo root, commit, let Vercel build.
  2. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or rules changes in this drop.
