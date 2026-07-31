SignatureStudio update
=======================

FIX: THIN STRIP BELOW THE LAST ROW ON THE CANVAS (src/ only -- no API changes)

Every row on the canvas had a 4px bottom margin so rows have a little space
between them. That margin was also applied to the LAST row, leaving a thin
strip of empty space between the signature and the bottom edge of the canvas.

The bottom margin is now dropped on the last row only, so the canvas ends
flush with the signature. Spacing between rows is unchanged.

This is a canvas-only cosmetic tweak -- the exported/pasted signature was
never affected by it.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
