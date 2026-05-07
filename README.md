# Values Ranker

A minimalist tool for ranking 117 organizational and personal values using Glicko-2 scoring. Pick 1 of 4 values per round — after 100 rounds your top values stabilize into a clear hierarchy.

**Live:** https://notionparallax.github.io/Massive-Ranker/

## How it works

- Each round shows 4 values; click the one most important to you
- A Glicko-2 rating system (like chess rankings) updates all 4 values
- "Least Seen" selection ensures all 117 values get fair exposure
- Progress saves automatically to localStorage
- After 100 rounds: confetti + your full ranked results
- Export your ranking as a `.txt` file at any time

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

Pushes to `main` auto-deploy to GitHub Pages via Actions.

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build locally
```
