SignatureStudio update
=======================

PHOTO BORDER NO LONGER DISTORTS THE SHAPE (src/ only -- no API changes)

Before: adding a border to a photo that was already at its column's max
width pushed the photo's total size past the column. With nowhere to grow,
the image got squished -- a circle turned into an oval (see the thick blue
border example).

Fixed two ways:
  1. The border now sits INSIDE the photo's box (box-sizing:border-box),
     so it no longer adds to the photo's footprint. A 146px circle with a
     7px border still occupies exactly 146px and stays perfectly round.
  2. The photo's COLUMN now auto-sizes to the photo width on the live
     canvas, exactly like the exported signature already did. So the
     column hugs the photo (plus any column padding) instead of forcing a
     percentage width that squished the shape. Canvas and paste now match.

This applies to both circle and square photos, at any border width.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
