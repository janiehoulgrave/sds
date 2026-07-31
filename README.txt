SignatureStudio update
=======================

BANNER SIDEBAR: MORE SPACING + CLEARER TITLE HIERARCHY (src/ only)

  - More breathing room between banner categories (was 10px, now 22px between
    each group like Compass Programs, Our Company, etc.).
  - The category sub-titles are now SMALLER than the main "Compass Banners"
    heading (they were actually a hair larger before). New hierarchy:
      "Compass Banners"  -> 11px, bold, dark grey  (the parent heading)
      category names      ->  9px, lighter grey     (the sub-sections)

This is a sidebar-only cosmetic change; nothing about the signatures or the
banners themselves changed.

NOTE: this build also still contains everything from the last drop (the 14
baked-in templates, the loader fix, and the allowlist). If you already deployed
that, this simply layers the sidebar tweak on top -- just deploy src/ as usual.

DEPLOY
  1. Drag src/ into the repo root, commit, let Vercel build.
  2. Hard-refresh sds.janienation.com (Cmd+Shift+R).

No Firebase or rules changes in this drop.
