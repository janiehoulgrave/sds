SignatureStudio update
=======================

FIX: CIRCLE PHOTO WITH A FLATTENED / COLLAPSED EDGE (src/ only -- no API changes)

The real cause of the "one side of the circle is cut off" look: the photo's
wrapper had overflow:hidden with max-width:100%. When the photo's column was
narrower than the photo (e.g. a column set to 23% width), the wrapper shrank
to the column and clipped the overflowing side of the circle flat.

Two changes:
  1. Removed the clipping wrapper. The photo image already carries its own
     rounding and border, so the wrapper no longer needs overflow:hidden --
     which means it can no longer chop a flat edge off the circle.
  2. Hardened the photo-column sizing so a photo whose width is stored as a
     percentage can't be misread as pixels, in both the canvas and the export.

Combined with the previous fix (Circle forces height = width), a circular
photo now stays perfectly round regardless of the column width, on both the
canvas and the pasted signature.

Tip: if a photo column looks too narrow, you can still widen it with the
Col 1 / Col 2 slider, but you no longer have to in order to keep the circle
intact.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
