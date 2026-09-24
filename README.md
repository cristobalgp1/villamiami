# Villa Miami × Lacruz Design Studio — Netlify deploy

## Before deploying
Add the three videos to `assets/`:
- `assets/home-living-room.mp4`
- `assets/villa-mezzo.mp4`
- `assets/villa-piano.mp4`

## Deploy (Git or CLI — required for the password gate)
**Git:** push this folder to a GitHub repo → Netlify → Add new site → Import from Git. No build command; publish directory `.`

**CLI:**
```
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

## Password
Netlify → Site configuration → Environment variables → add `SITE_PASSWORD`, then redeploy.
- No variable set = site is public.
- The "Log out" button in the header clears the session (`/logout`).

⚠️ Drag-and-drop deploys (Netlify Drop) skip edge functions, so the site goes live **without** the password gate.
