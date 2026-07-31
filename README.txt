SignatureStudio update
=======================

FIX: DEFAULT SPACE ABOVE/BELOW ROWS (src/ only -- no API changes)

Rows had a built-in default padding of 8px top and 8px bottom, applied to
both the live canvas and the exported signature. On a single-row signature
that showed up as a strip of empty space above and below the content inside
the row's selection box.

Row padding now defaults to 0 top and 0 bottom, on both the canvas and the
pasted/emailed signature (they stay in sync). Rows are tight by default, and
you can still add breathing room deliberately per row via Row Settings >
Padding Top / Padding Bottom.

Note: this also tightens any existing rows that never had a padding value
set -- they'll now sit flush instead of with the old 8px. If a specific row
needs space, set it explicitly in Row Settings.

(Per-element padding, like the 12px on a photo, is separate and unchanged --
adjust that in the element's own Padding fields.)

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
