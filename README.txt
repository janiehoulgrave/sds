SignatureStudio update
=======================

FIX: CIRCLE PHOTOS RENDERING AS OVALS (src/ only -- no API changes)

A circular photo turned into an oval whenever its width and height were
unequal (e.g. 100px wide x 128px tall). Previously the shape only controlled
corner rounding, so an unequal box with border-radius:50% drew an ellipse.
Unequal values can slip in from a template or from editing width/height with
the size link turned off, which is what caused the "sudden" distortion.

Now, when a photo's shape is Circle, the height is forced to match the width
so it is always a true, round circle -- on both the live canvas and the
pasted/emailed signature. The Circle button in the panel also snaps both
inputs to the width to stay consistent with what you see.

If you actually want an oval, use the Square shape with a 50% corner radius
(All corners at once) -- that keeps width and height independent.

Nothing else about photo sizing changed: Square photos keep fully independent
width and height, and borders still sit inside the box so they never distort
the shape.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
