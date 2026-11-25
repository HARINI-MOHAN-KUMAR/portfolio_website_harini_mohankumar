# HARINI — BEYOND THE SCREEN

Interactive 3D scroll-story portfolio for Harini Mohankumar.
React + Vite · React Three Fiber / Three.js · GSAP ScrollTrigger · Lucide icons.

All content comes from `src/data/profile.js`, which is taken from the resume
(including the hyperlinks embedded in the PDF). Edit that one file to update the site.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

Requires Node 18+.

## Deploy to Vercel

**Option A — GitHub (recommended)**
1. Push this folder to a new GitHub repository.
2. Go to vercel.com → *Add New… → Project* → import the repository.
3. Vercel auto-detects Vite. Keep the defaults:
   Build command `npm run build`, Output directory `dist`.
4. Click **Deploy**.

**Option B — CLI**
```bash
npm i -g vercel
vercel          # first deploy (preview)
vercel --prod   # production
```

## Updating the resume
Replace `public/Harini_Mohankumar_Resume_Updated.pdf` with the new file (keep the same name).

## Brand assets
- `public/hm-mark.svg` — standalone transparent HM symbol.
- `public/hm-navbar.svg` — rounded-square navbar mark.
- `public/harini-mohan-logo.svg` — transparent HM and HARINI MOHAN lockup.
- `public/favicon.svg` — compact browser favicon.
- The website loader animates the HM mark with a drawn-line and orbit treatment.

## Structure
```
src/
  data/profile.js        all resume content and links (single source of truth)
  three/
    store.js             shared scroll state (story position t = 0..7)
    Scene3D.jsx          Canvas, scroll-driven camera rig, lights
    Character.jsx        procedural animated developer (typing, walking, pointing, waving)
    Stage.jsx            workstation, holo screens, tech lab, project planets,
                         timeline, steps, certificate medals, particles
    textures.js          canvas textures (animated code, skill labels)
  components/            Sections, ProjectModal, ProjectArt, nav/cursor/loader/progress
  App.jsx                GSAP ScrollTrigger story controller, reveals, theme
  styles.css             design tokens, layout, responsive, reduced-motion
```

## Notes
- The 3D bundle is lazy-loaded; the page text is usable before it finishes.
- Mobile: lower pixel ratio, fewer particles, no custom cursor or magnetic effects.
- `prefers-reduced-motion`: scroll animation is applied instantly, the render loop runs
  on demand, and the cursor and idle animations are off.
- The character is built from code (no external model). To use a rigged `.glb`
  instead, swap `Character.jsx` for a `useGLTF` loader.
- Fonts load from Google Fonts; system fonts are the fallback if blocked.
