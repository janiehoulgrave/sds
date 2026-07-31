SignatureStudio update
=======================

FIX: CENTER ALIGNMENT NOT ACTUALLY CENTERING IMAGES/LOGOS (src/ only -- no API changes)

Selecting "Center" (or "Right") on a logo or image in a column didn't truly
center it when the element also had left/right padding. The horizontal
padding shrank the centering area on one side, so a "centered" logo sat off
to the left. In the screenshot the Logo had 23px of left padding, which
pulled it left of the column's true center.

Fix: for an image or logo that is centered or right-aligned, horizontal
(left/right) padding is now ignored, since it directly contradicts the
alignment. Top/bottom padding still applies, and padding on text and other
element types is unchanged. "Center" now actually centers the image in its
column, on both the canvas and the pasted signature.

If you want to nudge a centered image sideways, change its column width or
the column gap rather than adding element padding -- padding and centering
work against each other by nature.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
