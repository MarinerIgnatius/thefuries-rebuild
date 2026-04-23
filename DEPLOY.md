# The Furies Archive — Deployment Guide
## Task #4 complete → Tasks #5–8 sequence

---

## Stack
- **Framework**: Astro 4 (static output)
- **CMS**: Decap CMS (Git-backed, no server required)
- **Hosting**: Cloudflare Pages
- **DNS**: Namecheap → Cloudflare

---

## Before you deploy

### Step 1 — Download assets (Task #2 holdover)
```bash
cd thefuries-archive
bash download-assets.sh
# Writes 47 images to ./assets/
# Takes under a minute on local network
```
Then copy to the rebuild:
```bash
cp assets/* thefuries-rebuild/public/images/
```

### Step 2 — Re-pull missing page copy
Three pages need content pulled from the live Wix site **before DNS flip**:

| Page | URL to scrape |
|------|--------------|
| `/media` | https://www.thefuries1986.com/media |
| `/afterlives` | https://www.thefuries1986.com/afterlives |
| `/connect` | https://www.thefuries1986.com/connect |
| `/scene` (full text) | https://www.thefuries1986.com/scene |

Paste extracted copy into the relevant `.astro` page files, replacing the `<div class="placeholder-notice">` blocks.

### Step 3 — Resolve social handles
`/connect` has 6 social links stubbed to `#`. Either:
- **Set real handles** → update hrefs in `src/pages/connect.astro`
- **Remove the block** → delete the socials list from the page

Contact email confirmed: `thefuries1986@gmail.com` — no changes needed.

---

## Deploy to Cloudflare Pages (Task #5)

### Initial setup
1. Push this repo to GitHub (new private repo recommended)
2. Go to **Cloudflare Dashboard → Pages → Create a project**
3. Connect GitHub → select the repo
4. Build settings:
   ```
   Build command:     npm run build
   Build output dir:  dist
   Node version:      20
   ```
5. Click **Save and Deploy** — first build will run

### Custom domain (Task #7 — DNS flip)
In Cloudflare Pages project → **Custom domains → Add domain**:
```
www.thefuries1986.com
```
Cloudflare will prompt you to update Namecheap DNS:
- Change nameservers at Namecheap to Cloudflare's assigned nameservers
- Propagation: 24–48h (usually minutes if Namecheap is fast)

**Do not cancel Wix until DNS is confirmed live on Cloudflare.**

---

## Decap CMS setup (post-deploy)

Decap CMS needs Cloudflare Pages Git Gateway **or** direct GitHub auth.

### Option A — Cloudflare Pages Git Gateway (simplest)
1. In Cloudflare Pages → **Functions → Git Gateway** (if available in your plan)
2. Follow the Decap docs: https://decapcms.org/docs/cloudflare-pages/

### Option B — GitHub backend (more reliable)
Update `public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: YOUR-USERNAME/thefuries-archive
  branch: main
```
Then add OAuth app in GitHub → Settings → Developer settings.

CMS is accessible at: `https://www.thefuries1986.com/admin/`

---

## Post-launch checklist (Tasks #6–8)

- [ ] **Task #5** — Cloudflare Pages live, custom domain resolving
- [ ] **Task #6** — Email: contact is Gmail (`thefuries1986@gmail.com`) — no Wix email to migrate. ✓ No-op.
- [ ] **Task #7** — DNS flipped at Namecheap to Cloudflare nameservers
- [ ] **Task #8** — Verify all pages load, images resolve, links work → cancel Wix

### Verification checklist before Wix cancellation
- [ ] `/` — hero image loads, all 5 section cards link correctly
- [ ] `/band` — timeline renders, pull quote visible
- [ ] `/scene` — all 6 venues listed, DJs section populated
- [ ] `/media` — images load from `/images/`
- [ ] `/afterlives` — content populated from live re-pull
- [ ] `/connect` — email link works, social handles confirmed or removed
- [ ] `/admin/` — Decap CMS loads and can edit content
- [ ] DNS: `www.thefuries1986.com` → Cloudflare Pages IP
- [ ] SSL cert active (Cloudflare auto-provisions)
- [ ] `robots.txt` accessible
- [ ] No broken image 404s in browser devtools

---

## File structure
```
thefuries-rebuild/
├── public/
│   ├── admin/
│   │   ├── index.html        ← Decap CMS UI
│   │   └── config.yml        ← CMS schema
│   ├── images/               ← Drop downloaded assets here
│   ├── _redirects            ← Cloudflare Pages redirects
│   ├── _headers              ← Security + cache headers
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro       ← Home / Entry
│   │   ├── band.astro        ← Full history — done
│   │   ├── scene.astro       ← Venues done; DJs need re-pull
│   │   ├── media.astro       ← Shell ready; needs assets + re-pull
│   │   ├── afterlives.astro  ← Shell ready; needs re-pull
│   │   ├── connect.astro     ← Shell ready; needs social handles
│   │   └── 404.astro
│   └── styles/
│       └── global.css        ← Full design system
├── astro.config.mjs
├── package.json
└── DEPLOY.md                 ← This file
```
