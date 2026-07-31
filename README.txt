SignatureStudio update
=======================

THREE CHANGES (src/ only -- no API changes)

1. FONT FALLBACKS UPDATED
   - Compass Sans  -> DM Sans (Google Font, weights 300-700), Hanken Grotesk
     kept as a secondary fallback. Light and Medium render in fallback.
   - Compass Serif -> Georgia (system serif), Times New Roman as backstop.
     No web font needed for the serif now.
   - Compass Display -> Tenor Sans (unchanged from last update), Hanken behind.
   Source Serif 4 is no longer loaded. DM Sans is now loaded in the editor and
   in the exported signature's @import.

2. ADD-COLUMN BUTTON
   When a row already has 2+ columns, the "+" add-column button is now a small
   square the same height as the Col 1 / Col 2 blocks, instead of a tall strip.
   (With a single column it still shows the full "Add Column" label.)

3. DRAG A ROW INTO POSITION
   You can now drag a layout tile (1 / 2 / 3 / 4 Col) from the sidebar and drop
   it ABOVE or BELOW any existing row, not just at the end. While you drag a
   layout tile, thin drop zones open up in the gaps between rows (and above the
   first / below the last row); a blue line shows where the new row will land.
   Dropping in empty canvas space still appends to the end as before, and
   clicking a layout tile still adds to the end as before.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
