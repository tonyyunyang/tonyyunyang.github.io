# My Macintosh — sources & provenance

Adapted from Henry Heffernan's portfolio with his explicit permission
("Please go ahead and use anything you find useful!", July 2026):

- `shell/`: github.com/henryjeff/portfolio-website @ c53c5a50183655eb83d70048403a5084f5d1214c (MIT)
- `os/`: github.com/henryjeff/portfolio-inner-site @ 23cf84acd5c76d2c719e1d04c3d976dc4b0b49f8

## What was changed (everything else is Henry's, untouched)

shell (3D scene):
- `src/index.html` — title/meta → Tony; removed Henry's Google Analytics + og images
- `src/Application/UI/components/LoadingScreen.tsx` — BIOS text (TYBIOS / Yang, Tongyun Inc. / TYS Showcase 2026)
- `src/Application/UI/components/InfoOverlay.tsx` — name/title overlay
- `src/Application/World/MonitorScreen.ts` — iframe → self-hosted relative `os/`; title TonyOS
- `src/Application/UI/components/HomeButton.tsx` (new) — "← Home" overlay control back to the landing page, joins the mute/freecam row
- `static/models/Computer/baked_computer.jpg` — bezel + keyboard "Heffernan henry inc" repainted "Yang tongyun inc" (PIL script)
- removed: `server/` (his nodemailer relay), unused `static/textures/monitor/video/real.mp4`, social preview jpgs
- devDep pin: `@types/node@16` (new majors break TS 4.9 build)

os (inner 2D OS):
- Showcase content (Home/About/Experience/Projects/Contact/ResumeDownload/VerticalNavbar) → Tony's CV
- `projects/Music.tsx`/`Art.tsx` → `Research.tsx`/`Life.tsx`; routes software/research/life
- ShowcaseExplorer: BrowserRouter → MemoryRouter (works from any subpath, incl. GH Pages); title/©
- Hook imports `react-router` → `react-router-dom` (dual-package instance crash on fresh installs)
- Contact form: POST to api.henryheffernan.com → mailto compose (static hosting, no backend)
- Henordle → Tonordle; word TONYS; icon letter H → T; Words.ts += 'tonys'
- Credits.tsx: added leading "Original Work" slide crediting Henry + both repos; his slides kept verbatim
- `package.json` homepage "." (relative asset paths under /macintosh/os/)
- removed: Henry's personal photos/music/resume that were replaced by Tony's content
- assets added: `src/assets/pictures/tony-*.jpg`, `src/assets/resume/Tongyun_Yang_Resume.pdf`

`assets-originals/` holds Tony's original full-resolution photos + CV.

## Rebuild

    cd os    && npm install --legacy-peer-deps && CI= npm run build   # → os/build/
    cd shell && npm install --legacy-peer-deps && npm run build       # → shell/public/

Deploy: rsync `os/build/` → `../macintosh/os/`, `shell/public/` → `../macintosh/` .
