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

## ✦ How to Play

### 🔤 Word Search

Find every word from the list hidden somewhere in the letter grid. Words can run horizontally, vertically, or diagonally. On Intermediate and above, words can also run backwards. On Advanced and Extreme, all diagonal directions are added.

**To play:** Click on the first letter of a word, hold, drag to the last letter, then release. A correct match highlights the word in coral and strikes it from the list. Find all words to complete the puzzle.

**Difficulty scaling:**
- Beginner — 8–10 short words, horizontal and vertical only
- Intermediate — 10–12 medium words, backwards added
- Advanced — 12–14 longer words, all diagonals
- Extreme — 14–16 long words, full directional chaos

---

### ✏️ Crossword

Fill the grid by solving AI-generated clues across and down. Every crossword is freshly built around your chosen theme — no two are ever the same.

**To play:** Click any white square to select it. The current word highlights in pale coral. Click the same square again to toggle between Across and Down. Start typing — letters fill into the grid automatically. Backspace removes the last letter. Click any clue in the panel to jump to that word.

**Tips:**
- Use **Check Answers** to highlight correct entries in green and errors in red
- Use **Reveal All** only if you're truly stuck
- Tab also toggles direction between Across and Down

---

### 🔢 Sudoku

Fill the 9×9 grid so every row, every column, and every 3×3 box contains the digits 1–9 exactly once. No repeats, no guessing — pure logic.

**To play:** Click any empty cell to select it. Its row, column, and box highlight to help you spot conflicts. Tap a number on the pad or type it directly. Press **Check** to mark correct entries green and errors red. Use **Reset** to clear your inputs or **Reveal Solution** if you're stuck.

**Difficulty scaling:**
- Beginner — 46 cells revealed
- Intermediate — 36 cells revealed
- Advanced — 28 cells revealed
- Extreme — 20 cells revealed (very hard)

---

### 🔀 Word Scramble

A definition clue is shown for each word. Use it to figure out the answer, then tap the scrambled letter tiles to spell it out in order.

**To play:** Tap scrambled tiles one at a time to place letters into the answer slots. Tap a filled slot to remove that letter and try again. When you place the last letter the answer is checked instantly — correct words turn teal, wrong answers shake and reset. Hit **Skip** to move past a word and return to it later.

**Rules:**
- Every letter tile can only be used once per word
- Words must be spelled in the correct order
- All words in the set must be resolved to complete the puzzle

---

### 🐝 Spelling Bee

Seven letters are arranged in a honeycomb — one gold center letter surrounded by six outer letters. Make as many words as you can using only those letters.

**Rules:**
- Every word must contain the **center letter**
- You may only use the 7 hive letters (but can repeat them within a word)
- Words must be at least **4 letters long**
- 4-letter words score **1 point**
- Longer words score **1 point per letter**
- **Pangrams** — words that use all 7 letters at least once — earn a **7-point bonus**

**Ranking ladder:** Beginner → Good Start → Moving Up → Good → Solid → Nice → Great → Amazing → Genius

**To play:** Tap hex tiles to build a word, or type directly into the input. Press Enter or the Submit button to check. Work your way up the rank ladder to complete the puzzle.

---

### 🧮 Math Sprint

A timed arithmetic challenge. Answer as many questions correctly as you can before the clock runs out. The countdown ring turns green → gold → red as time gets short.

**To play:** A math question appears on screen. Type your answer using the keyboard or the on-screen number pad. Press Enter or OK to submit and instantly move to the next question. Build a streak of consecutive correct answers to earn a 🔥 badge.

**Difficulty scaling:**
- Beginner — addition and subtraction to 10, 90 seconds
- Intermediate — adds multiplication, 75 seconds
- Advanced — all four operations with negative answers, 60 seconds
- Extreme — all operations, larger numbers, only 45 seconds

At the end of each round you'll see your score, accuracy percentage, best streak, and a full answer history.

---

## ✦ Newsletter

Stay connected with the PuzzleNest community through our **monthly newsletter** — sent once a month, no exceptions.

**Each edition includes:**
- 🆕 New puzzle types and feature announcements
- 📰 Articles on brain health, mental wellness, and the science of puzzling
- 🏆 Top player highlights and leaderboard updates
- 💡 Tips and strategies for each puzzle type
- 🎉 Community spotlights and milestone celebrations
- 🗺 A look at what's coming next for PuzzleNest

**Our promise to you:**
- One email per month — never more
- No spam, no third-party sharing, no selling your data
- Unsubscribe anytime with a single click — every newsletter includes an unsubscribe link at the bottom
- Your email is yours. We treat it that way.

Sign up on the [PuzzleNest homepage](https://puzzlenest.app) to join the community.


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
