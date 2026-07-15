# SignatureStudio

## Local development

```
npm install
npm run dev
```

## Deploying (GitHub + Vercel)

1. Create a new GitHub repo, push this project to it:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_ORG/signaturestudio.git
   git push -u origin main
   ```
2. In Vercel: **Add New Project → Import Git Repository**, select the repo.
   Vercel auto-detects Vite; no config changes needed. Build command
   `npm run build`, output directory `dist`.
3. Deploy. That's it for this first pass — no environment variables needed
   yet, since nothing external (R2, Firebase) is wired in.

## Current state vs. where this is headed

This is the app exactly as it existed in the Claude artifact, with only the
minimum scaffolding added to make it a real, deployable project (Vite config,
entry point, package.json). Nothing about the app's internals changed.

Two things intentionally NOT done in this pass, since they're substantial
enough to warrant their own focused work (in Claude Code, ideally, given the
iterative file-by-file nature):

- **Image hosting (Cloudflare R2).** Every photo/logo/badge is currently
  embedded as base64 directly in element data, which is why the production
  bundle is ~4.3MB. Moving uploads to R2 (upload once, store a URL) is what
  actually fixes both the bundle size and the "signature too long" email
  client limits.
- **Firestore + Auth.** Templates and admin roles currently live in
  `localStorage`, tied to one browser. Moving templates to Firestore (with
  Firebase Auth restricted to @compass.com) is what makes "admin publishes a
  template, every agent sees it" actually work, instead of being local to
  whoever's browser made the edit.

## Splitting SignatureStudio.jsx

`src/SignatureStudio.jsx` is currently one large file (matches the original
artifact). It works and builds cleanly as-is. Splitting it into logical
modules (Editor, Gallery, ProfileForm, the various panel components, the
render/export helpers) is worth doing at some point for maintainability, but
is a separate, lower-urgency refactor from the R2/Firebase work above.
