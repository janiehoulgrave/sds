SignatureStudio update
=======================

FIX: EXTRA SPACE AT THE BOTTOM OF THE CANVAS (src/ only -- no API changes)

The row-insert drop zones (added so you can drag a layout row into position)
were each reserving a few pixels of height even when you weren't dragging.
Stacked across the gaps between rows and below the last row, that showed up
as unexplained empty space at the bottom of the canvas.

The drop zones now collapse to zero height when idle and only expand while
you're actively dragging a layout tile from the sidebar. No visible space is
added the rest of the time, and drag-to-insert still works exactly as before.

Note: if a newly added row is still empty, its columns show a dashed
"drop here" placeholder with a set height -- that's expected and goes away
once you drop content into the row.

DEPLOY
------
1. Drag the src/ folder into your GitHub repo root and commit.
2. Let Vercel finish building.
3. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or API changes are needed.
