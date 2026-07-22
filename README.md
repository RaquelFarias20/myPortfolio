# Portfolio — Raquel Farías García

Portfolio built with React (Vite). Design language inspired by technical drawing.

## How to run it on your computer

You need to have **Node.js** installed (version 18 or newer).
Download it at https://nodejs.org if you don't have it.

Open the folder in VS Code and, in the terminal:

```bash
npm install      # installs dependencies (only the first time)
npm run dev      # starts the site at http://localhost:5173
```

Open that address in your browser. Every change you save shows up instantly.

## Where to edit your content

- **`src/data.js`** — this is where ALL your text lives: name, bio, projects, awards,
  email, and LinkedIn. Edit this file to change the information.
  You don't need to touch the design.
- **`src/components/`** — each section (Hero, About, Projects, Awards, Footer).
- **`src/index.css`** — colors, fonts, and styles. The color variables
  are at the top of the file.

> Tip: you can ask Claude Code things like "add an illustrations section"
> or "change the blue to olive green" and it will edit these files.

## How to publish it on Vercel (free)

1. Upload this folder to a **GitHub** repository.
2. Go to https://vercel.com and create an account with your GitHub.
3. Click **Add New → Project** and import your repository.
4. Vercel detects Vite automatically. Confirm these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. In ~1 minute you'll have a public URL.

From then on, every time you `git push` to GitHub, Vercel
republishes the site automatically. You don't need to do anything else.

### Custom domain (optional)

In your Vercel project: **Settings → Domains → Add**. If you buy a domain
(~$10–15 USD/year), connect it there and replace the `yourname.vercel.app` URL.
