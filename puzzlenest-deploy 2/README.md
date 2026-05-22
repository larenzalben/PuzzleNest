# PuzzleNest — Deploy Guide

## What's in this folder

```
puzzlenest/
├── api/
│   └── claude.js        ← Secure API proxy (runs on Vercel's servers)
├── public/
│   └── favicon.svg      ← App icon
├── src/
│   ├── App.jsx          ← Your entire app
│   └── main.jsx         ← React entry point
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## Step 1 — Push to GitHub (drag & drop, no terminal)

1. Go to **github.com** and create a free account
2. Click **"New repository"** → name it `puzzlenest` → click **Create**
3. Click **"uploading an existing file"**
4. Drag the entire contents of this folder into the upload area
5. Click **Commit changes**

---

## Step 2 — Deploy on Vercel (free)

1. Go to **vercel.com** → sign up with your GitHub account
2. Click **"Add New Project"**
3. Select your `puzzlenest` repository
4. Vercel auto-detects Vite/React — click **Deploy**
5. Done! You get a live URL like `puzzlenest.vercel.app` in ~60 seconds

---

## Step 3 — Add your Anthropic API Key (required for puzzle generation)

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com
3. Click **Save**
4. Go to **Deployments** → click **Redeploy**

Your key is now secure on Vercel's servers — never exposed to users.

---

## Step 4 — Add a custom domain (optional, ~$12/yr)

1. Buy a domain on **namecheap.com** or **google.com/domains**
2. In Vercel → your project → **Settings** → **Domains**
3. Add your domain and follow the DNS instructions (takes ~10 min)

---

## Every time you update the app

1. Replace `src/App.jsx` in GitHub with your new file
2. Vercel automatically re-deploys in ~30 seconds

---

## Local development (optional)

If you want to run it on your own computer:

```bash
npm install
npm run dev
```

Then open http://localhost:5173

For the API to work locally, create a `.env` file:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```
