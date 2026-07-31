SignatureStudio update
=======================

TWO FIXES IN THIS DROP (src/ only -- no API changes)

1. ROW PADDING NOW WORKS ON THE CANVAS
   Row Settings > Padding Top / Padding Bottom already changed the exported
   HTML, but the live editor canvas ignored those values, so it looked like
   nothing happened and there was always extra space top and bottom. The
   canvas row now applies the same padding the export uses (default 8px top
   and bottom). To remove the extra space, select the row and set Padding
   Top and Padding Bottom to 0px -- the canvas and the pasted signature will
   now match.

2. LOGO SMART FIELD
   Added a "Logo" element to the element palette (next to Headshot). Drop it
   in and it pulls the Compass office logo straight from your Profile
   (Profile > Logo). If no logo is set yet it shows a dashed "Logo"
   placeholder. It supports the same width/height and crop controls as the
   other image elements.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit
   (this replaces src/SignatureStudio.jsx).
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed for this update.
