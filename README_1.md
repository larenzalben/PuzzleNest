# 🧩 PuzzleNest

**Free daily brain training — think, solve, repeat.**

PuzzleNest is a web-based puzzle platform offering six AI-powered puzzle types designed to sharpen memory, expand vocabulary, strengthen logic, and support mental wellness. Every puzzle is uniquely generated — no two are ever the same.

---

## ✦ Puzzle Types

| Game | Description |
|------|-------------|
| 🔤 **Word Search** | Find hidden words in every direction across a letter grid |
| ✏️ **Crossword** | Solve AI-generated clues across and down |
| 🔢 **Sudoku** | Fill the 9×9 grid using pure logic — no words needed |
| 🔀 **Word Scramble** | Unscramble letter tiles using definition clues |
| 🐝 **Spelling Bee** | Build words from a honeycomb of 7 letters |
| 🧮 **Math Sprint** | Answer as many arithmetic questions as you can before time runs out |

---

## ✦ Features

- **AI-generated content** — every puzzle is freshly created around your chosen theme
- **6 difficulty levels** — Beginner, Intermediate, Advanced, and Extreme across all games
- **Custom themes** — type any topic and every puzzle is built around it
- **Live timer** — tracks your solve time on every puzzle
- **Win celebrations** — confetti modal on every completed puzzle
- **Streak & stats tracking** — persistent across sessions via browser storage
- **How to play** — rules and instructions shown below every puzzle
- **Print support** — clean print layout for any puzzle
- **Admin panel** — subscriber management and Loops.so email integration
- **Email capture landing page** — GDPR-compliant with newsletter consent
- **Donation support** — PayPal, Cash App, and Venmo integration
- **Fully responsive** — works on desktop and mobile

---

## ✦ Tech Stack

- **React 18** — UI and state management
- **Vite** — build tool and local dev server
- **Claude API (Anthropic)** — AI puzzle generation via `claude-sonnet-4-20250514`
- **Vercel** — hosting and serverless API proxy
- **Google Fonts** — Playfair Display, DM Mono, Inter
- **Vanilla CSS** — custom design system with CSS variables, no UI library

---

## ✦ Project Structure

```
puzzlenest/
├── api/
│   └── claude.js          # Vercel serverless function — secure API proxy
├── public/
│   └── favicon.svg        # App icon
├── src/
│   ├── App.jsx            # Entire application (single file)
│   └── main.jsx           # React entry point
├── index.html             # HTML shell
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+ — [nodejs.org](https://nodejs.org)
- An Anthropic API key — [console.anthropic.com](https://console.anthropic.com)

### Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/puzzlenest.git
cd puzzlenest

# Install dependencies
npm install

# Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." > .env

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## ✦ Deployment (Vercel)

The easiest way to deploy PuzzleNest is with Vercel.

**1. Push to GitHub**
Upload this project to a GitHub repository.

**2. Import to Vercel**
- Go to [vercel.com](https://vercel.com) and sign in with GitHub
- Click **Add New Project** → select your repository
- Vercel auto-detects Vite — click **Deploy**

**3. Add your API key**
- Vercel dashboard → your project → **Settings** → **Environment Variables**
- Add `ANTHROPIC_API_KEY` with your key from Anthropic
- Click **Save** → go to **Deployments** → **Redeploy**

Your API key stays secure on Vercel's servers and is never exposed to users.

**4. Custom domain (optional)**
- Vercel → Settings → Domains → add your domain
- Update DNS records as instructed (~10 min to propagate)

---

## ✦ Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key — required for all AI puzzle generation |

---

## ✦ Admin Panel

Access the hidden admin panel to manage email subscribers:

- **Desktop:** type `adm` anywhere on the page
- **Mobile:** tap the PuzzleNest logo 5 times quickly

The admin panel shows subscriber count, consent status, signup dates, and CSV export. Optionally connect a [Loops.so](https://loops.so) API key to sync subscribers automatically.

---

## ✦ Roadmap

- [ ] Mobile app (iOS & Android via Capacitor)
- [ ] User accounts and cloud-synced stats
- [ ] Pro subscription tier (Stripe)
- [ ] More puzzle types
- [ ] Leaderboards
- [ ] Educator / classroom mode

---

## ✦ Mental Health Mission

PuzzleNest was built around the belief that regular mental exercise is one of the simplest things you can do for your brain and your wellbeing. Research shows that daily puzzling reduces stress, improves focus, and helps keep the mind resilient as we age. Every puzzle is free. Come back tomorrow — your mind will thank you.

---

## ✦ Support the Project

If PuzzleNest has earned a spot in your routine, consider buying the developer a tea ☕ or a sandwich 🥪.

- [PayPal](https://paypal.me)
- [Cash App](https://cash.app)
- [Venmo](https://venmo.com)

Totally optional. Deeply appreciated.

---

## ✦ License

MIT License — free to use, modify, and distribute.

---

*Built with ☕ and a love for puzzles.*

