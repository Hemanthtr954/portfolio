# Hemanth Tirumalarajukupam — Portfolio

Cinematic editorial portfolio (React + Vite + TypeScript, GSAP + ScrollTrigger, Framer Motion).

## Run
    npm install
    npm run dev        # local
    npm run build      # type-check + production build into dist/

## Make it yours (all content lives in src/config.ts)
- **Portrait:** drop a photo at `src/assets/portrait.jpg` (or .png/.webp). Until then a typographic "HT" monogram is shown. Do not use a placeholder face.
- **Contact:** email, LinkedIn and GitHub come from your resume (the PDF's own hyperlinks for LinkedIn/GitHub). Change `email` in config if you want a different public address.
- **Content** (projects, skills, experience, education) is taken from your resume only. Results shown ("~8%", "~11%", "~9%", "~12%", "~15%", "150K+", "50K+", "1,000+") are the ones printed on it.

## Features
- Reusable `<Flashlight>`: rAF + CSS custom properties, CSS radial-gradient mask uncovers a real second layer. Touch drag/tap supported; static fallback on reduced motion or low-power devices.
- GSAP: hero timeline, clip-path reveals, parallax, scroll reveals, string-drawing (dashoffset) and sway.
- Framer Motion: button tilt/hover/tap, glossy sweep, contact overlay (Escape + visible close + focus trap + focus restore).

## Deploy free
Push to GitHub, then Vercel or Netlify: build command `npm run build`, output `dist`. (Vite `base` is relative, so GitHub Pages also works.)
