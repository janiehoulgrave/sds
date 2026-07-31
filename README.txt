SignatureStudio update
=======================

COMPASS SANS LIGHT & MEDIUM ARE NOW SELECTABLE (src/ only -- no API changes)

When you provided the Compass fonts, Compass Sans came in several weights
(Light, Regular, Medium, Bold). The font CSS already declared all four, but
the editor only had a Bold on/off button, so Light and Medium could never
actually be chosen.

Added a "Font weight" dropdown to the text formatting toolbar (right after
the B / I / U buttons). Select a text element and pick:
  - Light   (300)
  - Regular (400)
  - Medium  (500)
  - Bold    (700)

The Bold button still works and stays in sync (Bold = weight 700). The
chosen weight shows on the live canvas and carries through to the pasted /
emailed signature.

One caveat worth knowing: the Compass fonts are referenced by name
(local()), not embedded, so Light and Medium display exactly as intended
only on machines that have the Compass fonts installed. On machines without
them, the browser falls back to the nearest weight of the backup font
(Hanken Grotesk), which may look closer to Regular or Bold. This is the same
way Bold has always behaved, just now with more weight options.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
