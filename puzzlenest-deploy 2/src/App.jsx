import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── Google Fonts ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap";
document.head.appendChild(fontLink);

// ─── Styles ──────────────────────────────────────────────────────────────────
const GS = `
  :root {
    --cream: #F8F4ED;
    --navy: #0F1729;
    --navy-mid: #1A2744;
    --coral: #E8582A;
    --coral-hover: #D44820;
    --coral-light: #F28B6A;
    --coral-pale: #FEF0EB;
    --teal: #0E9B8A;
    --teal-pale: #E6F7F5;
    --gold: #D4A840;
    --gold-pale: #FBF4E3;
    --ink: #1C2536;
    --body: #3D4A5C;
    --muted: #7A8899;
    --border: #DDD7CC;
    --border-light: #EDE9E2;
    --white: #FFFFFF;
    --shadow-sm: 0 1px 3px rgba(15,23,41,0.08), 0 1px 2px rgba(15,23,41,0.04);
    --shadow-md: 0 4px 16px rgba(15,23,41,0.10), 0 2px 6px rgba(15,23,41,0.06);
    --shadow-lg: 0 12px 40px rgba(15,23,41,0.14), 0 4px 12px rgba(15,23,41,0.08);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--cream); font-family: 'Inter', 'Nunito', sans-serif; color: var(--ink); }
  
  .app-wrap { min-height: 100vh; background: var(--cream); }

  /* ── Sticky nav ── */
  .sticky-bar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(248,244,237,0.97);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 14px 28px;
    display: flex; flex-wrap: wrap; align-items: center; gap: 12px;
    box-shadow: 0 1px 0 rgba(15,23,41,0.04);
  }
  .bar-logo { display: flex; flex-direction: column; align-items: center; margin-right: 12px; }
  .bar-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 900; color: var(--navy); letter-spacing: -0.5px; white-space: nowrap; line-height: 1.1; }
  .bar-title span { color: var(--coral); }
  .bar-tagline { font-family: 'Inter', sans-serif; font-size: 0.52rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); white-space: nowrap; margin-top: 2px; }
  .bar-tagline span { color: var(--coral); }

  .controls-group { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; flex: 1; }

  .pill-select {
    appearance: none; background: var(--white);
    border: 1.5px solid var(--border); border-radius: 999px;
    padding: 8px 36px 8px 16px;
    font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 600; color: var(--ink);
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231C2536' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    transition: border-color 0.2s, box-shadow 0.2s; box-shadow: var(--shadow-sm);
  }
  .pill-select:hover, .pill-select:focus { border-color: var(--coral); outline: none; box-shadow: 0 0 0 3px rgba(232,88,42,0.12); }

  .custom-input {
    border: 1.5px solid var(--coral); border-radius: 999px; padding: 8px 16px;
    font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 600; color: var(--ink);
    background: var(--white); width: 180px; transition: box-shadow 0.2s; box-shadow: var(--shadow-sm);
  }
  .custom-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(232,88,42,0.15); }
  .custom-input::placeholder { color: var(--muted); font-weight: 400; }

  .gen-btn {
    background: linear-gradient(135deg, var(--coral) 0%, #C94420 100%);
    color: white; border: none; border-radius: 999px; padding: 10px 24px;
    font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.3px;
    cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 14px rgba(232,88,42,0.38); white-space: nowrap;
  }
  .gen-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(232,88,42,0.48); }
  .gen-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(232,88,42,0.28); }
  .gen-btn:disabled { background: var(--muted); box-shadow: none; cursor: not-allowed; transform: none; }

  .print-btn { background: transparent; color: var(--body); border: 1.5px solid var(--border); border-radius: 999px; padding: 8px 16px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
  .print-btn:hover { border-color: var(--ink); color: var(--ink); }
  .reset-btn { background: transparent; color: var(--muted); border: 1.5px solid var(--border-light); border-radius: 999px; padding: 8px 16px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
  .reset-btn:hover { border-color: #e05050; color: #c0392b; }

  /* ── Stats pill in nav ── */
  .stats-pill {
    display: flex; align-items: center; gap: 6px;
    background: var(--gold-pale); border: 1px solid rgba(212,168,64,0.3);
    border-radius: 999px; padding: 6px 14px;
    font-family: 'DM Mono', monospace; font-size: 0.72rem; font-weight: 500;
    color: var(--gold); cursor: pointer; transition: background 0.2s;
    white-space: nowrap;
  }
  .stats-pill:hover { background: #f5e9c8; }

  /* ── Timer display ── */
  .timer-wrap {
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Mono', monospace; font-size: 0.82rem; font-weight: 500;
    color: var(--muted); padding: 6px 12px;
    background: var(--white); border: 1px solid var(--border-light);
    border-radius: 999px; box-shadow: var(--shadow-sm);
  }
  .timer-wrap.running { color: var(--coral); border-color: rgba(232,88,42,0.2); }
  .timer-wrap.done { color: var(--teal); border-color: rgba(14,155,138,0.2); background: var(--teal-pale); }

  .main-content {
    max-width: 100%; margin: 0 auto; padding: 0 24px 60px;
    min-height: calc(100vh - 57px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }

  /* ── In-app hero ── */
  .landing-hero { text-align: center; padding: 72px 20px 56px; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--teal-pale); color: var(--teal); border: 1px solid rgba(14,155,138,0.2);
    border-radius: 999px; font-family: 'Inter', sans-serif; font-size: 0.73rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; margin-bottom: 24px;
  }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 900; line-height: 1.08; color: var(--navy); margin-bottom: 20px; letter-spacing: -0.5px; }
  .hero-title em { color: var(--coral); font-style: italic; }
  .hero-sub { font-family: 'Inter', sans-serif; font-size: 1.05rem; color: var(--body); max-width: 500px; margin: 0 auto; line-height: 1.75; font-weight: 400; }
  .hero-ornament { margin: 44px auto 0; display: flex; align-items: center; justify-content: center; gap: 14px; color: var(--border); font-size: 1rem; letter-spacing: 6px; }
  .hero-ornament-line { flex: 1; max-width: 100px; height: 1px; background: var(--border); }

  .hero-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 680px; margin: 36px auto 0; }
  @media (max-width: 600px) { .hero-benefits { grid-template-columns: 1fr; } }
  .benefit-card { background: var(--white); border: 1px solid var(--border-light); border-radius: 14px; padding: 20px 18px; text-align: center; box-shadow: var(--shadow-sm); }
  .benefit-icon { font-size: 1.6rem; margin-bottom: 10px; }
  .benefit-title { font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
  .benefit-desc { font-family: 'Inter', sans-serif; font-size: 0.76rem; color: var(--muted); line-height: 1.55; }

  .hero-custom-promo { max-width: 560px; margin: 0 auto; text-align: center; padding: 36px 0 0; }
  .hero-custom-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--gold-pale); color: var(--gold); border: 1px solid rgba(212,168,64,0.25); border-radius: 999px; font-family: 'Inter', sans-serif; font-size: 0.71rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; margin-bottom: 16px; }
  .hero-custom-title { font-family: 'Playfair Display', serif; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900; color: var(--navy); line-height: 1.2; margin-bottom: 16px; letter-spacing: -0.3px; }
  .hero-custom-title em { color: var(--coral); font-style: italic; }
  .hero-custom-body { font-family: 'Inter', sans-serif; font-size: 0.95rem; color: var(--body); line-height: 1.78; max-width: 480px; margin: 0 auto; }
  .hero-custom-body strong { color: var(--ink); font-weight: 700; }

  .hero-bookmark-promo { max-width: 560px; margin: 0 auto; text-align: center; padding: 36px 0; }
  .hero-bookmark-img-wrap { margin: 24px 0; border-radius: 16px; overflow: hidden; border: 1px solid var(--border-light); box-shadow: var(--shadow-md); }
  .hero-bookmark-img { width: 100%; height: auto; display: block; }

  /* ── Loading ── */
  .loading-wrap { text-align: center; padding: 80px 20px; }
  .typewriter-dots { display: inline-flex; gap: 8px; margin-bottom: 20px; }
  .typewriter-dots span { width: 10px; height: 10px; border-radius: 50%; background: var(--coral); animation: bounce 1.2s infinite; }
  .typewriter-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typewriter-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-10px); opacity: 1; } }
  .loading-text { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--muted); font-style: italic; }

  /* ── Puzzle wrapper ── */
  .puzzle-wrap { animation: fadeUp 0.5s ease both; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 980px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .puzzle-header { text-align: center; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid var(--border); width: 100%; }
  .puzzle-type-tag { display: inline-block; background: var(--coral-pale); color: var(--coral); font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; padding: 4px 14px; border-radius: 999px; border: 1px solid rgba(232,88,42,0.2); margin-bottom: 12px; }
  .puzzle-title { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; color: var(--navy); line-height: 1.15; letter-spacing: -0.3px; }
  .puzzle-meta { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--muted); margin-top: 8px; letter-spacing: 1px; }

  /* ── Word Search ── */
  .ws-outer { display: flex; justify-content: center; width: 100%; }
  .ws-layout { display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .ws-grid-wrap { overflow-x: auto; display: flex; justify-content: center; }
  .ws-grid { display: inline-grid; border: 2px solid var(--navy); border-radius: 4px; overflow: hidden; box-shadow: 5px 5px 0 var(--navy); cursor: crosshair; }
  .ws-cell { width: var(--cell, 34px); height: var(--cell, 34px); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: calc(var(--cell, 34px) * 0.42); font-weight: 500; color: var(--ink); border: 1px solid rgba(28,37,54,0.09); transition: background 0.1s, color 0.1s; user-select: none; text-transform: uppercase; }
  .ws-cell.selecting { background: rgba(232,88,42,0.22); }
  .ws-cell.found { background: var(--coral); color: white; font-weight: 700; }
  .ws-words { background: var(--white); border: 1px solid var(--border-light); border-radius: 14px; padding: 20px; width: 100%; box-shadow: var(--shadow-sm); }
  .ws-words-title { font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 700; color: var(--ink); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border-light); }
  .ws-words-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 6px; }
  .ws-word-item { font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--body); padding: 4px 6px; border-radius: 4px; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
  .ws-word-item.found { text-decoration: line-through; text-decoration-color: var(--coral); text-decoration-thickness: 2px; color: var(--muted); opacity: 0.55; }
  .progress-bar-wrap { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-light); }
  .progress-label { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--muted); margin-bottom: 6px; letter-spacing: 1px; }
  .progress-bar { height: 5px; background: var(--border-light); border-radius: 99px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--coral), var(--coral-light)); border-radius: 99px; transition: width 0.4s ease; }

  /* ── Crossword ── */
  .cw-layout { display: grid; grid-template-columns: auto 1fr; gap: 32px; align-items: start; justify-items: center; }
  @media (max-width: 720px) { .cw-layout { grid-template-columns: 1fr; } }
  .cw-grid-table { border-collapse: collapse; border: 2px solid var(--navy); box-shadow: 5px 5px 0 var(--navy); border-radius: 2px; overflow: hidden; }
  .cw-cell-td { padding: 0; position: relative; }
  .cw-black { width: clamp(28px, 4vw, 40px); height: clamp(28px, 4vw, 40px); background: var(--navy); display: block; }
  .cw-white { width: clamp(28px, 4vw, 40px); height: clamp(28px, 4vw, 40px); border: 1px solid rgba(28,37,54,0.18); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; background: white; transition: background 0.1s; }
  .cw-white.active { background: rgba(232,88,42,0.18); }
  .cw-white.active-word { background: rgba(232,88,42,0.07); }
  .cw-white.correct { background: rgba(14,155,138,0.12); }
  .cw-white.incorrect { background: rgba(220,80,60,0.1); }
  .cw-num { position: absolute; top: 2px; left: 2px; font-family: 'DM Mono', monospace; font-size: 0.52rem; color: var(--navy); line-height: 1; font-weight: 500; }
  .cw-letter { font-family: 'DM Mono', monospace; font-size: 1rem; font-weight: 500; color: var(--ink); text-transform: uppercase; pointer-events: none; }
  .cw-input-hidden { position: absolute; opacity: 0; width: 1px; height: 1px; top: 0; left: 0; }
  .cw-clues { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 520px) { .cw-clues { grid-template-columns: 1fr; } }
  .cw-clue-panel { background: var(--white); border: 1px solid var(--border-light); border-radius: 14px; padding: 18px; box-shadow: var(--shadow-sm); }
  .cw-clue-panel-title { font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 700; color: var(--ink); margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border-light); display: flex; align-items: center; gap: 8px; }
  .cw-clue-dir-badge { background: var(--navy); color: white; font-family: 'DM Mono', monospace; font-size: 0.62rem; padding: 2px 8px; border-radius: 99px; letter-spacing: 1px; }
  .cw-clue-item { display: flex; gap: 8px; margin-bottom: 10px; cursor: pointer; padding: 5px 6px; border-radius: 6px; transition: background 0.15s; }
  .cw-clue-item:hover { background: var(--coral-pale); }
  .cw-clue-item.active { background: var(--coral-pale); }
  .cw-clue-num { font-family: 'DM Mono', monospace; font-size: 0.73rem; font-weight: 500; color: var(--coral); min-width: 22px; padding-top: 1px; }
  .cw-clue-text { font-family: 'Inter', sans-serif; font-size: 0.81rem; color: var(--body); line-height: 1.5; }
  .cw-clue-item.solved .cw-clue-text { text-decoration: line-through; color: var(--muted); }

  /* ── Sudoku ── */
  .sdk-wrap { display: flex; flex-direction: column; align-items: center; gap: 28px; }
  .sdk-grid { border: 3px solid var(--navy); display: inline-grid; grid-template-columns: repeat(9, 1fr); box-shadow: 5px 5px 0 var(--navy); border-radius: 2px; overflow: hidden; }
  .sdk-cell { width: clamp(38px, 7.5vw, 56px); height: clamp(38px, 7.5vw, 56px); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: clamp(0.9rem, 1.8vw, 1.2rem); font-weight: 500; color: var(--ink); cursor: pointer; border: 1px solid rgba(28,37,54,0.13); transition: background 0.1s; position: relative; background: white; }
  .sdk-cell:hover { background: var(--coral-pale); }
  .sdk-cell.given { font-weight: 700; background: #f2ede4; cursor: default; }
  .sdk-cell.selected { background: rgba(232,88,42,0.18) !important; }
  .sdk-cell.highlight { background: rgba(232,88,42,0.06); }
  .sdk-cell.error { color: #c0392b; }
  .sdk-cell.correct-entered { color: var(--teal); }
  .sdk-cell.thick-right { border-right: 2.5px solid var(--navy); }
  .sdk-cell.thick-bottom { border-bottom: 2.5px solid var(--navy); }
  .sdk-numpad { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; max-width: 300px; width: 100%; }
  .sdk-num-btn { padding: 10px; border: 1.5px solid var(--border); border-radius: 8px; background: white; font-family: 'DM Mono', monospace; font-size: 1.1rem; font-weight: 500; color: var(--ink); cursor: pointer; transition: all 0.15s; text-align: center; box-shadow: var(--shadow-sm); }
  .sdk-num-btn:hover { border-color: var(--coral); background: var(--coral-pale); color: var(--coral); }
  .sdk-num-btn.erase { font-size: 0.8rem; color: var(--muted); }
  .sdk-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .sdk-action-btn { padding: 10px 22px; border-radius: 999px; font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 700; cursor: pointer; transition: all 0.15s; border: 1.5px solid var(--ink); background: white; color: var(--ink); }
  .sdk-action-btn:hover { background: var(--navy); color: white; border-color: var(--navy); }
  .sdk-action-btn.check { border-color: var(--coral); color: var(--coral); }
  .sdk-action-btn.check:hover { background: var(--coral); color: white; border-color: var(--coral); }
  .sdk-status { font-family: 'DM Mono', monospace; font-size: 0.8rem; color: var(--muted); text-align: center; letter-spacing: 1px; }
  .sdk-status.win { color: var(--teal); font-weight: 700; font-size: 1rem; }

  /* ── Word Scramble ── */
  .scrm-wrap { display: flex; flex-direction: column; align-items: center; gap: 28px; width: 100%; max-width: 600px; }
  .scrm-progress-header { width: 100%; display: flex; justify-content: space-between; align-items: center; font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--muted); letter-spacing: 1px; }
  .scrm-card {
    width: 100%; background: var(--white);
    border: 1.5px solid var(--border-light); border-radius: 20px;
    padding: 36px 32px; box-shadow: var(--shadow-md);
    display: flex; flex-direction: column; align-items: center; gap: 20px;
    animation: fadeUp 0.4s ease both;
  }
  .scrm-letters { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .scrm-tile {
    width: 48px; height: 56px; background: var(--navy);
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 1.4rem; font-weight: 700; color: white;
    box-shadow: 0 3px 0 rgba(0,0,0,0.35); cursor: pointer; transition: transform 0.1s;
    user-select: none;
  }
  .scrm-tile:hover { transform: translateY(-3px); }
  .scrm-tile.used { background: var(--border); color: var(--border-light); box-shadow: none; cursor: default; transform: none; }
  .scrm-answer-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; min-height: 56px; }
  .scrm-answer-slot {
    width: 48px; height: 56px; border-bottom: 2.5px solid var(--navy);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 1.4rem; font-weight: 700; color: var(--ink);
    cursor: pointer; transition: background 0.1s; border-radius: 6px 6px 0 0;
  }
  .scrm-answer-slot:hover { background: var(--coral-pale); }
  .scrm-answer-slot.correct { background: rgba(14,155,138,0.1); border-color: var(--teal); color: var(--teal); }
  .scrm-answer-slot.wrong { background: rgba(220,80,60,0.08); border-color: #c0392b; color: #c0392b; }
  .scrm-clue { font-family: 'Inter', sans-serif; font-size: 0.92rem; color: var(--body); text-align: center; font-style: italic; line-height: 1.6; padding: 0 16px; }
  .scrm-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .scrm-btn { padding: 8px 20px; border-radius: 999px; font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 700; cursor: pointer; transition: all 0.15s; border: 1.5px solid var(--border); background: white; color: var(--body); }
  .scrm-btn:hover { border-color: var(--ink); color: var(--ink); }
  .scrm-btn.primary { background: var(--coral); border-color: var(--coral); color: white; box-shadow: 0 3px 12px rgba(232,88,42,0.3); }
  .scrm-btn.primary:hover { background: var(--coral-hover); }
  .scrm-score-row { display: flex; gap: 12px; align-items: center; }
  .scrm-score-badge { background: var(--teal-pale); color: var(--teal); border: 1px solid rgba(14,155,138,0.2); border-radius: 999px; padding: 4px 12px; font-family: 'DM Mono', monospace; font-size: 0.75rem; font-weight: 500; }
  .scrm-word-list { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; width: 100%; }
  .scrm-word-pill { padding: 5px 14px; border-radius: 999px; font-family: 'DM Mono', monospace; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.5px; }
  .scrm-word-pill.pending { background: var(--border-light); color: var(--muted); }
  .scrm-word-pill.solved { background: var(--teal-pale); color: var(--teal); border: 1px solid rgba(14,155,138,0.2); text-decoration: none; }
  .scrm-word-pill.skipped { background: var(--coral-pale); color: var(--coral); text-decoration: line-through; }

  /* ── Win Modal ── */
  .win-overlay { position: fixed; inset: 0; background: rgba(15,23,41,0.7); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeOverlay 0.3s ease; }
  @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
  .win-modal {
    background: var(--white); border-radius: 24px; padding: 48px 40px;
    max-width: 440px; width: 100%; text-align: center;
    box-shadow: 0 24px 80px rgba(15,23,41,0.3);
    animation: winPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    position: relative; overflow: hidden;
  }
  @keyframes winPop { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .win-confetti-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .confetti-piece { position: absolute; width: 8px; height: 8px; border-radius: 2px; animation: confettiFall linear both; }
  @keyframes confettiFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(200px) rotate(720deg); opacity: 0; } }
  .win-emoji { font-size: 3.5rem; margin-bottom: 16px; animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; display: block; }
  @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }
  .win-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: var(--navy); margin-bottom: 8px; }
  .win-sub { font-family: 'Inter', sans-serif; font-size: 0.95rem; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
  .win-stats { display: flex; justify-content: center; gap: 24px; margin-bottom: 32px; }
  .win-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .win-stat-val { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: var(--ink); }
  .win-stat-label { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; }
  .win-btn { background: linear-gradient(135deg, var(--coral) 0%, #C94420 100%); color: white; border: none; border-radius: 999px; padding: 14px 36px; font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 18px rgba(232,88,42,0.38); transition: transform 0.15s; margin: 0 6px; }
  .win-btn:hover { transform: translateY(-2px); }
  .win-btn.ghost { background: transparent; border: 1.5px solid var(--border); color: var(--body); box-shadow: none; }
  .win-btn.ghost:hover { border-color: var(--ink); color: var(--ink); }
  .win-streak { display: inline-flex; align-items: center; gap: 6px; background: var(--gold-pale); color: var(--gold); border: 1px solid rgba(212,168,64,0.3); border-radius: 999px; padding: 6px 16px; font-family: 'DM Mono', monospace; font-size: 0.78rem; margin-bottom: 20px; }

  /* ── Stats Modal ── */
  .stats-overlay { position: fixed; inset: 0; background: rgba(15,23,41,0.7); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeOverlay 0.3s ease; }
  .stats-modal { background: var(--navy); border-radius: 24px; padding: 40px; max-width: 480px; width: 100%; color: var(--cream); box-shadow: 0 24px 80px rgba(0,0,0,0.5); animation: winPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
  .stats-modal-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; margin-bottom: 4px; }
  .stats-modal-title span { color: var(--coral); }
  .stats-close { float: right; background: none; border: none; color: rgba(255,255,255,0.35); font-size: 1.3rem; cursor: pointer; line-height: 1; margin-top: 2px; }
  .stats-close:hover { color: var(--cream); }
  .stats-section { margin-top: 28px; }
  .stats-section-label { font-family: 'DM Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.35); margin-bottom: 14px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .stats-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px 12px; text-align: center; }
  .stats-card-val { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; color: var(--cream); line-height: 1; margin-bottom: 4px; }
  .stats-card-label { font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; }
  .stats-type-row { display: flex; flex-direction: column; gap: 8px; }
  .stats-type-item { display: flex; align-items: center; gap: 12px; }
  .stats-type-label { font-family: 'Inter', sans-serif; font-size: 0.82rem; color: rgba(255,255,255,0.7); min-width: 110px; }
  .stats-type-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden; }
  .stats-type-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
  .stats-type-count { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: rgba(255,255,255,0.4); min-width: 24px; text-align: right; }
  .stats-best-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .stats-best-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; display: flex; flex-direction: column; gap: 3px; }
  .stats-best-item .val { font-family: 'DM Mono', monospace; font-size: 0.88rem; color: var(--gold); }
  .stats-best-item .lbl { font-size: 0.65rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Error ── */
  .error-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 14px; padding: 28px; text-align: center; max-width: 480px; margin: 60px auto; }
  .error-box h3 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #b91c1c; margin-bottom: 10px; }
  .error-box p { font-family: 'Inter', sans-serif; font-size: 0.88rem; color: #7f1d1d; line-height: 1.6; }

  /* ── Landing Page ── */
  .lp-wrap { min-height: 100vh; background: linear-gradient(160deg, #0A1628 0%, #0F1F3D 45%, #0D2235 100%); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 30px 24px 60px; position: relative; overflow: hidden; }
  .lp-wrap::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(ellipse 80% 60% at 10% 15%, rgba(14,155,138,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(232,88,42,0.10) 0%, transparent 55%), radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 100% 100%, 100% 100%, 36px 36px; pointer-events: none; }
  .lp-inner { position: relative; z-index: 1; width: 100%; max-width: 500px; display: flex; flex-direction: column; align-items: center; animation: lpFadeIn 0.7s ease both; }
  @keyframes lpFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .lp-social { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 7px 18px; margin-bottom: 36px; }
  .lp-stars { color: var(--gold); font-size: 0.78rem; letter-spacing: 2px; }
  .lp-social-text { font-family: 'Inter', sans-serif; font-size: 0.74rem; font-weight: 600; color: rgba(255,255,255,0.6); letter-spacing: 0.3px; }
  .lp-social-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.25); }
  .lp-eyebrow { font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--teal); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .lp-eyebrow::before, .lp-eyebrow::after { content: ''; display: inline-block; width: 20px; height: 1px; background: var(--teal); opacity: 0.5; }
  .lp-promo { text-align: center; margin-bottom: 12px; }
  .lp-promo-line1 { font-family: 'Playfair Display', serif; font-size: clamp(2.1rem, 5.5vw, 3.4rem); font-weight: 900; color: #F0EBE1; line-height: 1.08; margin-bottom: 18px; letter-spacing: -0.5px; }
  .lp-promo-line1 em { color: var(--coral); font-style: italic; }
  .lp-promo-line2 { font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 400; color: rgba(240,235,225,0.62); line-height: 1.72; max-width: 400px; margin: 0 auto; }
  .lp-props { display: flex; gap: 8px; margin: 28px 0 32px; flex-wrap: wrap; justify-content: center; }
  .lp-prop { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); border-radius: 999px; padding: 5px 12px; font-family: 'Inter', sans-serif; font-size: 0.74rem; font-weight: 600; color: rgba(240,235,225,0.7); }
  .lp-prop-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); flex-shrink: 0; }
  .lp-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.08); margin: 0 0 32px; border-radius: 99px; }
  .lp-form-label { font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 700; color: rgba(240,235,225,0.5); letter-spacing: 0.5px; margin-bottom: 12px; text-align: center; }
  .lp-form { width: 100%; display: flex; flex-direction: column; gap: 12px; }
  .lp-input { width: 100%; background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.13); border-radius: 12px; padding: 15px 20px; font-family: 'Inter', sans-serif; font-size: 1.2rem; font-weight: 400; color: #F0EBE1; outline: none; transition: border-color 0.2s, background 0.2s; }
  .lp-input::placeholder { color: rgba(240,235,225,0.28); }
  .lp-input:focus { border-color: rgba(14,155,138,0.6); background: rgba(255,255,255,0.1); }
  .lp-input.error { border-color: rgba(232,88,42,0.6); }
  .lp-submit { width: 100%; background: linear-gradient(135deg, var(--coral) 0%, #C44020 100%); color: white; border: none; border-radius: 12px; padding: 18px 20px; font-family: 'Inter', sans-serif; font-size: 1.2rem; font-weight: 800; letter-spacing: 0.3px; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 6px 28px rgba(232,88,42,0.4); margin-top: 2px; }
  .lp-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(232,88,42,0.52); }
  .lp-submit:active { transform: translateY(0); box-shadow: 0 4px 14px rgba(232,88,42,0.3); }
  .lp-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .lp-consent { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; margin-top: 2px; }
  .lp-consent input[type="checkbox"] { margin-top: 3px; accent-color: var(--teal); width: 16px; height: 16px; flex-shrink: 0; cursor: pointer; }
  .lp-consent-text { font-family: 'Inter', sans-serif; font-size: 0.96rem; color: rgba(240,235,225,0.38); line-height: 1.55; }
  .lp-consent-text a { color: rgba(14,155,138,0.9); text-decoration: underline; cursor: pointer; }
  .lp-consent.error-consent .lp-consent-text { color: rgba(232,88,42,0.85); }
  .lp-error-msg { font-family: 'Inter', sans-serif; font-size: 0.93rem; color: rgba(232,88,42,0.9); text-align: center; }
  .lp-fine-print { margin-top: 18px; font-family: 'Inter', sans-serif; font-size: 0.92rem; color: rgba(240,235,225,0.22); text-align: center; line-height: 1.6; }
  .lp-saved { text-align: center; padding: 16px 20px; background: rgba(14,155,138,0.1); border: 1px solid rgba(14,155,138,0.25); border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 700; color: rgba(100,220,180,0.95); letter-spacing: 0.3px; }
  .privacy-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; animation: lpFadeIn 0.2s ease; }
  .privacy-modal { background: #131E35; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 36px; max-width: 520px; width: 100%; max-height: 80vh; overflow-y: auto; position: relative; }
  .privacy-modal h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #F0EBE1; margin-bottom: 18px; }
  .privacy-modal p { font-family: 'Inter', sans-serif; font-size: 0.84rem; color: rgba(240,235,225,0.58); line-height: 1.72; margin-bottom: 14px; }
  .privacy-modal strong { color: rgba(240,235,225,0.85); }
  .privacy-close { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: rgba(240,235,225,0.35); font-size: 1.3rem; line-height: 1; }
  .privacy-close:hover { color: #F0EBE1; }

  /* ── Admin Panel ── */
  .admin-wrap { min-height: 100vh; background: var(--navy); color: var(--cream); padding: 40px 32px; font-family: 'Inter', sans-serif; }
  .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .admin-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; color: var(--cream); }
  .admin-title span { color: var(--coral); }
  .admin-badge { background: rgba(232,88,42,0.15); border: 1px solid rgba(232,88,42,0.3); color: var(--coral); font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; }
  .admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .admin-stat { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px 24px; }
  .admin-stat-num { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; color: var(--cream); line-height: 1; margin-bottom: 6px; }
  .admin-stat-label { font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; }
  .admin-toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .admin-btn { padding: 9px 20px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: none; transition: opacity 0.15s; }
  .admin-btn:hover { opacity: 0.85; }
  .admin-btn-coral { background: var(--coral); color: white; }
  .admin-btn-ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.12); }
  .admin-table-wrap { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden; }
  .admin-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
  .admin-table th { background: rgba(255,255,255,0.06); padding: 12px 18px; text-align: left; font-weight: 700; font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.45); border-bottom: 1px solid rgba(255,255,255,0.08); }
  .admin-table td { padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: rgba(255,255,255,0.03); }
  .admin-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.68rem; font-weight: 700; letter-spacing: 1px; }
  .admin-pill-green { background: rgba(14,155,138,0.15); color: rgba(100,220,180,0.9); border: 1px solid rgba(14,155,138,0.3); }
  .admin-pill-grey { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); }
  .admin-empty { text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.25); font-size: 0.9rem; }
  .admin-loading { text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.4); font-size: 0.9rem; font-style: italic; }
  .admin-loops-banner { background: rgba(14,155,138,0.08); border: 1px solid rgba(14,155,138,0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: flex-start; gap: 12px; }
  .admin-loops-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
  .admin-loops-text { font-size: 0.82rem; color: rgba(240,235,225,0.6); line-height: 1.6; }
  .admin-loops-text strong { color: rgba(14,155,138,0.95); }
  .admin-loops-key-row { display: flex; gap: 10px; margin-top: 12px; align-items: center; flex-wrap: wrap; }
  .admin-loops-input { flex: 1; min-width: 220px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 9px 14px; font-family: 'DM Mono', monospace; font-size: 0.82rem; color: var(--cream); outline: none; }
  .admin-loops-input:focus { border-color: rgba(14,155,138,0.5); }
  .admin-loops-input::placeholder { color: rgba(255,255,255,0.25); }
  .admin-loops-save { padding: 9px 18px; background: rgba(14,155,138,0.85); border: none; border-radius: 8px; color: white; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; }
  .admin-loops-save:hover { background: var(--teal); }

  /* ── Spelling Bee ── */
  .bee-wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; max-width: 560px; }
  .bee-input-row { display: flex; gap: 10px; width: 100%; max-width: 420px; }
  .bee-input { flex: 1; border: 2px solid var(--border); border-radius: 12px; padding: 12px 18px; font-family: 'DM Mono', monospace; font-size: 1.1rem; font-weight: 500; color: var(--ink); background: var(--white); outline: none; text-transform: uppercase; letter-spacing: 2px; transition: border-color 0.2s; }
  .bee-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212,168,64,0.15); }
  .bee-input.shake { animation: beeShake 0.35s ease; }
  @keyframes beeShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  .bee-submit { background: var(--gold); border: none; border-radius: 12px; padding: 12px 20px; font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 700; color: var(--navy); cursor: pointer; white-space: nowrap; transition: background 0.15s, transform 0.1s; }
  .bee-submit:hover { background: #c49830; transform: translateY(-1px); }
  .bee-submit:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; transform: none; }
  .bee-hive { position: relative; width: 260px; height: 280px; margin: 0 auto; flex-shrink: 0; }
  .bee-hex { position: absolute; cursor: pointer; user-select: none; transition: transform 0.12s, filter 0.12s; }
  .bee-hex:hover { transform: scale(1.08); filter: brightness(1.08); }
  .bee-hex:active { transform: scale(0.96); }
  .bee-hex svg { display: block; }
  .bee-hex-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 1.3rem; font-weight: 700; pointer-events: none; letter-spacing: 1px; }
  .bee-feedback { font-family: 'DM Mono', monospace; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; height: 20px; transition: color 0.2s; }
  .bee-feedback.good { color: var(--teal); }
  .bee-feedback.bad { color: #c0392b; }
  .bee-feedback.great { color: var(--gold); }
  .bee-score-bar { width: 100%; max-width: 420px; }
  .bee-score-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .bee-rank { font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 700; color: var(--gold); }
  .bee-pts { font-family: 'DM Mono', monospace; font-size: 0.82rem; color: var(--muted); }
  .bee-track { height: 6px; background: var(--border-light); border-radius: 99px; overflow: hidden; }
  .bee-track-fill { height: 100%; background: linear-gradient(90deg, var(--gold), #f0c040); border-radius: 99px; transition: width 0.5s ease; }
  .bee-found-list { width: 100%; max-width: 420px; display: flex; flex-wrap: wrap; gap: 6px; min-height: 36px; }
  .bee-found-word { background: var(--gold-pale); color: var(--ink); border: 1px solid rgba(212,168,64,0.3); border-radius: 999px; padding: 4px 12px; font-family: 'DM Mono', monospace; font-size: 0.73rem; letter-spacing: 0.5px; animation: fadeUp 0.2s ease both; }
  .bee-found-word.pangram { background: var(--gold); color: var(--navy); font-weight: 700; }
  .bee-progress-header { width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: center; font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--muted); letter-spacing: 1px; }

  /* ── Math Sprint ── */
  .math-wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; max-width: 520px; }
  .math-timer-ring { position: relative; width: 96px; height: 96px; flex-shrink: 0; }
  .math-timer-ring svg { transform: rotate(-90deg); }
  .math-timer-ring .ring-track { fill: none; stroke: var(--border-light); stroke-width: 6; }
  .math-timer-ring .ring-fill { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.5s linear, stroke 0.3s; }
  .math-timer-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 1.4rem; font-weight: 700; color: var(--ink); }
  .math-header-row { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 16px; }
  .math-score-pill { background: var(--teal-pale); border: 1px solid rgba(14,155,138,0.2); border-radius: 999px; padding: 6px 16px; font-family: 'DM Mono', monospace; font-size: 0.82rem; color: var(--teal); }
  .math-card { width: 100%; background: var(--white); border: 1.5px solid var(--border-light); border-radius: 20px; padding: 40px 32px 32px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; align-items: center; gap: 24px; position: relative; overflow: hidden; }
  .math-question { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 6vw, 3.2rem); font-weight: 900; color: var(--navy); letter-spacing: -1px; text-align: center; line-height: 1.1; }
  .math-question em { color: var(--coral); font-style: normal; }
  .math-answer-input { width: 100%; max-width: 220px; border: 2px solid var(--border); border-radius: 12px; padding: 14px 20px; font-family: 'DM Mono', monospace; font-size: 1.4rem; font-weight: 700; color: var(--ink); text-align: center; outline: none; background: var(--cream); transition: border-color 0.2s, background 0.2s; }
  .math-answer-input:focus { border-color: var(--coral); background: var(--white); box-shadow: 0 0 0 3px rgba(232,88,42,0.1); }
  .math-answer-input.correct-flash { border-color: var(--teal); background: var(--teal-pale); animation: correctPop 0.3s ease; }
  .math-answer-input.wrong-flash { border-color: #c0392b; background: #fef2f2; animation: beeShake 0.35s ease; }
  @keyframes correctPop { 0%{transform:scale(1)} 40%{transform:scale(1.06)} 100%{transform:scale(1)} }
  .math-numpad { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 100%; max-width: 320px; }
  .math-num-btn { padding: 13px 6px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--white); font-family: 'DM Mono', monospace; font-size: 1rem; font-weight: 500; color: var(--ink); cursor: pointer; transition: all 0.12s; box-shadow: var(--shadow-sm); }
  .math-num-btn:hover { border-color: var(--coral); background: var(--coral-pale); color: var(--coral); }
  .math-num-btn.neg { font-size: 0.8rem; color: var(--muted); }
  .math-num-btn.del { font-size: 0.8rem; color: var(--muted); }
  .math-num-btn.ok { background: var(--coral); border-color: var(--coral); color: white; font-weight: 700; }
  .math-num-btn.ok:hover { background: var(--coral-hover); }
  .math-streak-badge { display: flex; gap: 6px; align-items: center; font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--gold); background: var(--gold-pale); border: 1px solid rgba(212,168,64,0.25); border-radius: 999px; padding: 4px 12px; }
  .math-results { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .math-results-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; color: var(--navy); }
  .math-results-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; width: 100%; }
  .math-results-card { background: var(--white); border: 1px solid var(--border-light); border-radius: 14px; padding: 16px; text-align: center; box-shadow: var(--shadow-sm); }
  .math-results-val { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: var(--navy); line-height: 1; margin-bottom: 4px; }
  .math-results-lbl { font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .math-history { width: 100%; display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto; }
  .math-history-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; border-radius: 8px; font-family: 'DM Mono', monospace; font-size: 0.76rem; }
  .math-history-row.right { background: var(--teal-pale); color: var(--teal); }
  .math-history-row.wrong { background: var(--coral-pale); color: var(--coral); }

  /* ── Print ── */
  @media print {
    .sticky-bar, .sdk-numpad, .sdk-actions, .gen-btn, .print-btn, .reset-btn, .win-overlay, .stats-overlay { display: none !important; }
    .app-wrap { background: white; }
    .ws-grid { box-shadow: none; border-color: black; }
    .cw-grid-table { box-shadow: none; }
  }
  @media (max-width: 640px) {
    .sticky-bar { padding: 12px 14px; gap: 8px; }
    .ws-cell { width: 28px; height: 28px; font-size: 0.72rem; }
    .sdk-cell { width: 36px; height: 36px; font-size: 0.9rem; }
    .cw-white, .cw-black { width: 30px; height: 30px; }
    .scrm-tile, .scrm-answer-slot { width: 40px; height: 48px; font-size: 1.2rem; }
    .math-numpad { grid-template-columns: repeat(4,1fr); }
    .bee-hive { width: 220px; height: 240px; }
  }
`;

// ─── Stats Storage (Persistent) ───────────────────────────────────────────────
const STATS_KEY = "puzzlenest-stats-v1";

async function loadStats() {
  try {
    const result = await window.storage.get(STATS_KEY);
    return result ? JSON.parse(result.value) : null;
  } catch (_) { return null; }
}

async function saveStats(stats) {
  try {
    await window.storage.set(STATS_KEY, JSON.stringify(stats));
  } catch (_) {}
}

function defaultStats() {
  return {
    totalSolved: 0,
    streak: 0,
    lastSolvedDate: null,
    byType: { "Word Search": 0, "Crossword": 0, "Sudoku": 0, "Word Scramble": 0, "Spelling Bee": 0, "Math Sprint": 0 },
    bestTimes: { "Word Search": null, "Crossword": null, "Sudoku": null, "Word Scramble": null, "Spelling Bee": null, "Math Sprint": null },
  };
}

function formatTime(secs) {
  if (!secs && secs !== 0) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

// ─── Timer Hook ───────────────────────────────────────────────────────────────
function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const startedRef = useRef(false);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setRunning(true);
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setDone(true);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setElapsed(0);
    setRunning(false);
    setDone(false);
    startedRef.current = false;
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { elapsed, running, done, start, stop, reset };
}

// ─── Win Confetti ─────────────────────────────────────────────────────────────
function WinConfetti() {
  const pieces = useMemo(() => {
    const colors = ["#E8582A","#0E9B8A","#D4A840","#0F1729","#F28B6A","#E6F7F5"];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      delay: `${Math.random() * 0.8}s`,
      duration: `${1.2 + Math.random() * 1}s`,
      size: `${6 + Math.random() * 8}px`,
    }));
  }, []);
  return (
    <div className="win-confetti-bg">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{ left: p.left, top: "-10px", background: p.color, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

// ─── Win Modal ────────────────────────────────────────────────────────────────
function WinModal({ puzzleType, elapsed, streak, onNext, onClose }) {
  return (
    <div className="win-overlay" onClick={onClose}>
      <div className="win-modal" onClick={e => e.stopPropagation()}>
        <WinConfetti />
        <span className="win-emoji">🎉</span>
        <h2 className="win-title">Puzzle Solved!</h2>
        <p className="win-sub">You completed the {puzzleType}. Excellent brain work!</p>
        {streak > 1 && (
          <div className="win-streak">🔥 {streak}-puzzle streak!</div>
        )}
        <div className="win-stats">
          <div className="win-stat">
            <span className="win-stat-val">{formatTime(elapsed)}</span>
            <span className="win-stat-label">Your Time</span>
          </div>
          <div className="win-stat">
            <span className="win-stat-val">{streak}</span>
            <span className="win-stat-label">Streak</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="win-btn" onClick={onNext}>Play Again →</button>
          <button className="win-btn ghost" onClick={onClose}>Keep Exploring</button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Modal ──────────────────────────────────────────────────────────────
function StatsModal({ stats, onClose }) {
  const total = stats.totalSolved || 0;
  const typeColors = { "Word Search": "var(--coral)", "Crossword": "var(--teal)", "Sudoku": "var(--gold)", "Word Scramble": "#9B6EE8" };
  const maxByType = Math.max(1, ...Object.values(stats.byType || {}));
  return (
    <div className="stats-overlay" onClick={onClose}>
      <div className="stats-modal" onClick={e => e.stopPropagation()}>
        <button className="stats-close" onClick={onClose}>✕</button>
        <div className="stats-modal-title">Puzzle<span>Nest</span> Stats</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 4, fontFamily: "'Inter',sans-serif" }}>Your brain training progress</div>

        <div className="stats-section">
          <div className="stats-section-label">Overview</div>
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-card-val">{total}</div>
              <div className="stats-card-label">Solved</div>
            </div>
            <div className="stats-card">
              <div className="stats-card-val">{stats.streak || 0}</div>
              <div className="stats-card-label">Streak</div>
            </div>
            <div className="stats-card">
              <div className="stats-card-val">{stats.bestTimes?.["Word Search"] ? formatTime(stats.bestTimes["Word Search"]) : "—"}</div>
              <div className="stats-card-label">Best WS</div>
            </div>
            <div className="stats-card">
              <div className="stats-card-val">{stats.bestTimes?.["Sudoku"] ? formatTime(stats.bestTimes["Sudoku"]) : "—"}</div>
              <div className="stats-card-label">Best SDK</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-section-label">By Puzzle Type</div>
          <div className="stats-type-row">
            {Object.entries(stats.byType || {}).map(([type, count]) => (
              <div key={type} className="stats-type-item">
                <span className="stats-type-label">{type}</span>
                <div className="stats-type-bar-bg">
                  <div className="stats-type-bar-fill" style={{ width: `${(count / maxByType) * 100}%`, background: typeColors[type] || "var(--coral)" }} />
                </div>
                <span className="stats-type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-section-label">Best Times</div>
          <div className="stats-best-row">
            {Object.entries(stats.bestTimes || {}).map(([type, t]) => (
              <div key={type} className="stats-best-item">
                <span className="val">{t ? formatTime(t) : "—"}</span>
                <span className="lbl">{type.replace("Word ", "")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Timer Display ────────────────────────────────────────────────────────────
function TimerDisplay({ elapsed, running, done }) {
  return (
    <div className={`timer-wrap ${running ? "running" : ""} ${done ? "done" : ""}`}>
      {done ? "✓" : "⏱"} {formatTime(elapsed)}
    </div>
  );
}

// ─── Sudoku Generator ────────────────────────────────────────────────────────
function generateSudoku(difficulty) {
  const revealed = { Beginner: 46, Intermediate: 36, Advanced: 28, Extreme: 20 }[difficulty] || 36;
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  function isValid(g, r, c, num) {
    for (let i = 0; i < 9; i++) if (g[r][i] === num || g[i][c] === num) return false;
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (g[br+i][bc+j] === num) return false;
    return true;
  }
  function solve(g) {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (g[r][c] === 0) {
        const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
        for (const n of nums) { if (isValid(g,r,c,n)) { g[r][c]=n; if (solve(g)) return true; g[r][c]=0; } }
        return false;
      }
    }
    return true;
  }
  solve(grid);
  const solution = grid.map(r => [...r]);
  const cells = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
  const toReveal = new Set(cells.slice(0, revealed));
  const puzzle = grid.map((row, r) => row.map((v, c) => toReveal.has(r*9+c) ? v : 0));
  return { puzzle, solution };
}

// ─── API Call ────────────────────────────────────────────────────────────────
async function callClaude(prompt, useWebSearch = false, maxTokens = 1000) {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] };
  if (useWebSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "API error");
  return data.content.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n");
}

function parseJSON(raw) {
  let cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = cleaned.search(/[\[{]/);
  if (start === -1) throw new Error("No JSON found in response");
  const opener = cleaned[start], closer = opener === "[" ? "]" : "}";
  let depth = 0, inStr = false, escape = false;
  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inStr) { escape = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === opener) depth++;
    else if (ch === closer) { depth--; if (depth === 0) return JSON.parse(cleaned.slice(start, i+1)); }
  }
  throw new Error("Malformed JSON in response");
}

// ─── Word Search Logic ───────────────────────────────────────────────────────
function buildWordSearchGrid(words, size, difficulty) {
  const dirs = [
    [0,1],[1,0],[1,1],
    ...(difficulty !== "Beginner" ? [[0,-1],[-1,0]] : []),
    ...(difficulty === "Advanced" || difficulty === "Extreme" ? [[-1,-1],[1,-1],[-1,1]] : []),
  ];
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  const placed = [];
  for (const word of words) {
    let ok = false;
    for (let attempt = 0; attempt < 200 && !ok; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const [dr, dc] = dir;
      const r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size);
      const cells = [];
      let valid = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) { valid = false; break; }
        if (grid[nr][nc] !== "" && grid[nr][nc] !== word[i]) { valid = false; break; }
        cells.push([nr, nc]);
      }
      if (valid) { cells.forEach(([nr, nc], i) => { grid[nr][nc] = word[i]; }); placed.push({ word, cells }); ok = true; }
    }
  }
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = alpha[Math.floor(Math.random() * 26)];
  return { grid, placed };
}

// ─── Crossword Builder (Improved) ─────────────────────────────────────────────
function buildCrossword(wordClues, title) {
  const GRID = 21;
  const blank = () => Array.from({ length: GRID }, () => Array(GRID).fill("#"));
  const placed = [];

  // Relaxed canPlace: allows sharing a letter with an existing word (intersection),
  // but prevents new parallel adjacency
  const canPlace = (grid, word, row, col, dir) => {
    let intersects = 0;
    for (let i = 0; i < word.length; i++) {
      const r = dir === "across" ? row : row + i;
      const c = dir === "across" ? col + i : col;
      if (r < 0 || r >= GRID || c < 0 || c >= GRID) return false;
      const cell = grid[r][c];
      if (cell !== "#") {
        if (cell !== word[i]) return false;
        intersects++;
      } else {
        // check before/after endpoints only (not side neighbours for non-endpoints)
        if (i === 0) {
          const br = dir === "across" ? r : r - 1;
          const bc = dir === "across" ? c - 1 : c;
          if (br >= 0 && bc >= 0 && grid[br]?.[bc] !== "#") return false;
        }
        if (i === word.length - 1) {
          const er = dir === "across" ? r : r + 1;
          const ec = dir === "across" ? c + 1 : c;
          if (er < GRID && ec < GRID && grid[er]?.[ec] !== "#") return false;
        }
        // perpendicular neighbours only for new cells
        const left  = dir === "across" ? grid[r-1]?.[c] : grid[r]?.[c-1];
        const right = dir === "across" ? grid[r+1]?.[c] : grid[r]?.[c+1];
        if (left && left !== "#") return false;
        if (right && right !== "#") return false;
      }
    }
    return intersects > 0 || placed.length === 0;
  };

  const placeWord = (grid, word, row, col, dir) => {
    for (let i = 0; i < word.length; i++) {
      const r = dir === "across" ? row : row + i;
      const c = dir === "across" ? col + i : col;
      grid[r][c] = word[i];
    }
  };

  const findPlacements = (grid, word) => {
    const options = [];
    for (const p of placed) {
      for (let wi = 0; wi < word.length; wi++) {
        for (let pi = 0; pi < p.word.length; pi++) {
          if (word[wi] !== p.word[pi]) continue;
          const newDir = p.dir === "across" ? "down" : "across";
          let row, col;
          if (newDir === "down") { row = p.row - wi; col = p.col + pi; }
          else { row = p.row + pi; col = p.col - wi; }
          if (canPlace(grid, word, row, col, newDir)) options.push({ row, col, dir: newDir });
        }
      }
    }
    return options;
  };

  const grid = blank();
  const startRow = Math.floor(GRID / 2);
  const startCol = Math.floor((GRID - wordClues[0].word.length) / 2);
  placeWord(grid, wordClues[0].word, startRow, startCol, "across");
  placed.push({ ...wordClues[0], row: startRow, col: startCol, dir: "across" });

  for (let wi = 1; wi < wordClues.length; wi++) {
    const word = wordClues[wi].word;
    const options = findPlacements(grid, word);
    if (options.length === 0) continue;
    const cx = GRID / 2, cy = GRID / 2;
    options.sort((a, b) => Math.abs(a.row-cx)+Math.abs(a.col-cy) - Math.abs(b.row-cx)-Math.abs(b.col-cy));
    const best = options[0];
    placeWord(grid, word, best.row, best.col, best.dir);
    placed.push({ ...wordClues[wi], row: best.row, col: best.col, dir: best.dir });
  }

  let minR = GRID, maxR = 0, minC = GRID, maxC = 0;
  for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) if (grid[r][c] !== "#") { minR = Math.min(minR,r); maxR = Math.max(maxR,r); minC = Math.min(minC,c); maxC = Math.max(maxC,c); }
  minR = Math.max(0, minR-1); minC = Math.max(0, minC-1);
  maxR = Math.min(GRID-1, maxR+1); maxC = Math.min(GRID-1, maxC+1);
  const finalGrid = [];
  for (let r = minR; r <= maxR; r++) finalGrid.push(grid[r].slice(minC, maxC+1));
  const remapped = placed.map(p => ({ ...p, row: p.row-minR, col: p.col-minC }));
  const rows = finalGrid.length, cols = finalGrid[0].length;
  const numMap = {};
  let n = 1;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (finalGrid[r][c] === "#") continue;
    const sA = (c===0||finalGrid[r][c-1]==="#") && c+1<cols && finalGrid[r][c+1]!=="#";
    const sD = (r===0||finalGrid[r-1]?.[c]==="#") && r+1<rows && finalGrid[r+1]?.[c]!=="#";
    if (sA||sD) numMap[`${r},${c}`] = n++;
  }
  const across = [], down = [];
  for (const p of remapped) {
    const num = numMap[`${p.row},${p.col}`];
    if (num == null) continue;
    const entry = { number: num, clue: p.clue, answer: p.word, row: p.row, col: p.col };
    if (p.dir === "across") across.push(entry); else down.push(entry);
  }
  across.sort((a,b) => a.number-b.number); down.sort((a,b) => a.number-b.number);
  return { title, grid: finalGrid, clues: { across, down } };
}

// ─── Components ──────────────────────────────────────────────────────────────

function WordSearchPuzzle({ data, difficulty, onWin }) {
  const sizeMap = { Beginner: 12, Intermediate: 14, Advanced: 16, Extreme: 18 };
  const size = sizeMap[difficulty] || 14;
  const upperWords = useMemo(() => data.words.map(w => w.toUpperCase()), [data.words]);
  const { grid, placed } = useMemo(() => buildWordSearchGrid(upperWords, size, difficulty), [upperWords.join(","), size, difficulty]);
  const { elapsed, running, done, start, stop } = useTimer();
  const isDragging = useRef(false), dragStart = useRef(null);
  const [selecting, setSelecting] = useState([]);
  const [found, setFound] = useState([]);
  const wonRef = useRef(false);

  const foundCells = useMemo(() => new Set(found.flatMap(f => f.cells.map(([r,c]) => `${r},${c}`))), [found]);
  const selSet = useMemo(() => new Set(selecting.map(([r,c]) => `${r},${c}`)), [selecting]);
  const buildSelection = (r0,c0,r1,c1) => {
    const dr=r1-r0, dc=c1-c0, len=Math.max(Math.abs(dr),Math.abs(dc));
    if(len===0) return [[r0,c0]];
    const ndr=dr===0?0:dr/Math.abs(dr), ndc=dc===0?0:dc/Math.abs(dc);
    const cells=[];
    for(let i=0;i<=len;i++) cells.push([r0+ndr*i,c0+ndc*i]);
    return cells;
  };
  const handleCellDown = (r,c) => { start(); isDragging.current=true; dragStart.current=[r,c]; setSelecting([[r,c]]); };
  const handleCellEnter = (r,c) => { if(!isDragging.current||!dragStart.current) return; const [r0,c0]=dragStart.current; setSelecting(buildSelection(r0,c0,r,c)); };
  const handleMouseUp = () => {
    isDragging.current=false; dragStart.current=null;
    if(selecting.length>1) {
      const forward=selecting.map(([r,c])=>grid[r][c]).join(""), backward=forward.split("").reverse().join("");
      const match=placed.find(p=>p.word===forward||p.word===backward);
      if(match&&!found.find(f=>f.word===match.word)) {
        const newFound=[...found, match];
        setFound(newFound);
        if(newFound.length===upperWords.length && !wonRef.current) { wonRef.current=true; stop(); setTimeout(()=>onWin(elapsed+1),200); }
      }
    }
    setSelecting([]);
  };
  const cancelDrag = () => { if(isDragging.current) { isDragging.current=false; dragStart.current=null; setSelecting([]); } };
  const pct = Math.round(found.length/upperWords.length*100);
  const cellSize = Math.min(36, Math.floor((window.innerWidth*0.85)/size));
  const gridWidth = size*cellSize+4;

  return (
    <div className="ws-layout" style={{ width: gridWidth }}>
      <div style={{ display:"flex", justifyContent:"space-between", width:"100%", alignItems:"center" }}>
        <div className="ws-words-title" style={{ marginBottom:0, paddingBottom:0, borderBottom:"none" }}>Find {upperWords.length} Words</div>
        <TimerDisplay elapsed={elapsed} running={running} done={done} />
      </div>
      <div className="ws-grid-wrap" onMouseLeave={cancelDrag} style={{ width: gridWidth }}>
        <div className="ws-grid" style={{ gridTemplateColumns:`repeat(${size},1fr)`, "--cell":`${cellSize}px` }} onMouseUp={handleMouseUp}>
          {grid.map((row,r)=>row.map((letter,c)=>{
            const key=`${r},${c}`, isSel=selSet.has(key), isFound=foundCells.has(key);
            return <div key={key} className={`ws-cell${isSel?" selecting":""}${isFound?" found":""}`} onMouseDown={()=>handleCellDown(r,c)} onMouseEnter={()=>handleCellEnter(r,c)}>{letter}</div>;
          }))}
        </div>
      </div>
      <div className="ws-words" style={{ width: gridWidth }}>
        <div className="ws-words-title">Find the Words</div>
        <div className="ws-words-list">
          {upperWords.map(w=><div key={w} className={`ws-word-item${found.find(f=>f.word===w)?" found":""}`}>{w}</div>)}
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-label">PROGRESS — {found.length}/{upperWords.length}</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%` }} /></div>
        </div>
      </div>
    </div>
  );
}

function CrosswordPuzzle({ data, onWin }) {
  const { grid: rawGrid, clues } = data;
  const rows = rawGrid.length, cols = rawGrid[0]?.length || 0;
  const numMap = useMemo(() => {
    const m = {}; let n = 1;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (rawGrid[r][c]==="#") continue;
      const sA=(c===0||rawGrid[r][c-1]==="#")&&c+1<cols&&rawGrid[r][c+1]!=="#";
      const sD=(r===0||rawGrid[r-1]?.[c]==="#")&&r+1<rows&&rawGrid[r+1]?.[c]!=="#";
      if(sA||sD) m[`${r},${c}`]=n++;
    }
    return m;
  }, [rawGrid, rows, cols]);

  const [userGrid, setUserGrid] = useState(()=>Array.from({length:rows},()=>Array(cols).fill("")));
  const [selected, setSelected] = useState(null);
  const [dir, setDir] = useState("across");
  const [checked, setChecked] = useState(false);
  const inputRef = useRef(null);
  const { elapsed, running, done, start, stop } = useTimer();
  const wonRef = useRef(false);

  const solutionMap = useMemo(()=>{
    const m = {};
    const proc = (list, d) => list?.forEach(cl => { let r=cl.row,c=cl.col; for(const ch of (cl.answer||"").toUpperCase()){m[`${r},${c}`]=ch; if(d==="across")c++;else r++; } });
    proc(clues.across,"across"); proc(clues.down,"down"); return m;
  }, [clues]);

  const getWordCells = (r,c,direction) => {
    const cells=[];
    if(direction==="across"){let sc=c;while(sc>0&&rawGrid[r][sc-1]!=="#")sc--;while(sc<cols&&rawGrid[r][sc]!=="#"){cells.push([r,sc]);sc++;}}
    else{let sr=r;while(sr>0&&rawGrid[sr-1]?.[c]!=="#")sr--;while(sr<rows&&rawGrid[sr]?.[c]!=="#"){cells.push([sr,c]);sr++;}}
    return cells;
  };

  const activeWord = selected ? getWordCells(selected[0],selected[1],dir) : [];
  const activeWordSet = new Set(activeWord.map(([r,c])=>`${r},${c}`));

  const handleCellClick = (r,c) => {
    if(rawGrid[r][c]==="#") return;
    start();
    if(selected&&selected[0]===r&&selected[1]===c) setDir(d=>d==="across"?"down":"across");
    else setSelected([r,c]);
    setTimeout(()=>inputRef.current?.focus(),10);
  };

  const checkSolved = useCallback((ng) => {
    const allCells = Object.entries(solutionMap);
    if(!allCells.every(([k,v])=>{const[r,c]=k.split(",").map(Number);return ng[r][c]===v;})) return;
    if(!wonRef.current){wonRef.current=true; stop(); setTimeout(()=>onWin(elapsed+1),200);}
  }, [solutionMap, elapsed, stop, onWin]);

  const handleKey = (e) => {
    if(!selected) return;
    const [r,c]=selected;
    if(e.key.length===1&&/[a-zA-Z]/.test(e.key)){
      const ng=userGrid.map(row=>[...row]); ng[r][c]=e.key.toUpperCase(); setUserGrid(ng); setChecked(false);
      const word=getWordCells(r,c,dir); const idx=word.findIndex(([wr,wc])=>wr===r&&wc===c);
      if(idx<word.length-1) setSelected(word[idx+1]);
      checkSolved(ng);
    } else if(e.key==="Backspace"){
      const ng=userGrid.map(row=>[...row]);
      if(ng[r][c]){ng[r][c]="";setUserGrid(ng);}
      else{const word=getWordCells(r,c,dir);const idx=word.findIndex(([wr,wc])=>wr===r&&wc===c);if(idx>0){const[pr,pc]=word[idx-1];ng[pr][pc]="";setSelected([pr,pc]);setUserGrid(ng);}}
      setChecked(false);
    } else if(e.key==="Tab"){e.preventDefault();setDir(d=>d==="across"?"down":"across");}
  };

  const isSolvedWord = (cl,d) => { let r=cl.row,c=cl.col; for(const ch of (cl.answer||"").toUpperCase()){if(userGrid[r]?.[c]!==ch)return false;if(d==="across")c++;else r++;}return true;};
  const getClueForCell = (r,c,d) => {const word=getWordCells(r,c,d);if(!word.length)return null;const[wr,wc]=word[0];const cellNum=numMap[`${wr},${wc}`];return (d==="across"?clues.across:clues.down)?.find(cl=>cl.number===cellNum||cl.number===String(cellNum));};
  const activeClue = selected ? getClueForCell(selected[0],selected[1],dir) : null;

  return (
    <div style={{ width:"100%",maxWidth:900,display:"flex",flexDirection:"column",alignItems:"center",gap:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", width:"100%", marginBottom:16, alignItems:"center" }}>
        {activeClue ? (
          <div style={{ background:"rgba(232,88,42,0.06)",border:"1px solid rgba(232,88,42,0.25)",borderRadius:10,padding:"10px 18px",fontFamily:"'Inter',sans-serif",fontSize:"0.9rem",color:"var(--ink)",flex:1,marginRight:12 }}>
            <span style={{ fontFamily:"'DM Mono',monospace",color:"var(--coral)",fontWeight:700,marginRight:8 }}>{activeClue.number} {dir.toUpperCase()}</span>{activeClue.clue}
          </div>
        ) : <div />}
        <TimerDisplay elapsed={elapsed} running={running} done={done} />
      </div>
      <div className="cw-layout" style={{ width:"100%" }}>
        <div style={{ overflowX:"auto",display:"flex",justifyContent:"center" }}>
          <input ref={inputRef} className="cw-input-hidden" onKeyDown={handleKey} readOnly />
          <table className="cw-grid-table" onClick={()=>inputRef.current?.focus()}>
            <tbody>
              {rawGrid.map((row,r)=>(
                <tr key={r}>{row.map((cell,c)=>{
                  const key=`${r},${c}`,isBlack=cell==="#",isSel=selected?.[0]===r&&selected?.[1]===c,isWord=activeWordSet.has(key);
                  const entered=userGrid[r][c],correct=checked&&entered&&solutionMap[key]===entered,wrong=checked&&entered&&solutionMap[key]&&solutionMap[key]!==entered;
                  return(<td key={c} className="cw-cell-td" onClick={()=>handleCellClick(r,c)}>{isBlack?<div className="cw-black"/>:(<div className={`cw-white ${isSel?"active":""} ${isWord&&!isSel?"active-word":""} ${correct?"correct":""} ${wrong?"incorrect":""}`}>{numMap[key]&&<span className="cw-num">{numMap[key]}</span>}<span className="cw-letter">{entered}</span></div>)}</td>);
                })}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="cw-clues">
            {["across","down"].map(d=>(
              <div key={d} className="cw-clue-panel">
                <div className="cw-clue-panel-title"><span className="cw-clue-dir-badge">{d.toUpperCase()}</span></div>
                {(clues[d]||[]).map(cl=>{
                  const solved=isSolvedWord(cl,d),active=activeClue&&dir===d&&(activeClue.number===cl.number||activeClue.number===String(cl.number));
                  return(<div key={cl.number} className={`cw-clue-item ${active?"active":""} ${solved?"solved":""}`} onClick={()=>{setDir(d);if(cl.row>=0&&cl.col>=0)setSelected([cl.row,cl.col]);setTimeout(()=>inputRef.current?.focus(),10);}}>
                    <span className="cw-clue-num">{cl.number}</span><span className="cw-clue-text">{cl.clue}</span>
                  </div>);
                })}
              </div>
            ))}
          </div>
          <div style={{ marginTop:16,display:"flex",gap:12 }}>
            <button className="sdk-action-btn check" onClick={()=>setChecked(true)}>Check Answers</button>
            <button className="sdk-action-btn" onClick={()=>{const ng=userGrid.map((row,r)=>row.map((_,c)=>solutionMap[`${r},${c}`]||""));setUserGrid(ng);setChecked(false);}}>Reveal All</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SudokuPuzzle({ difficulty, onWin }) {
  const [{ puzzle, solution }] = useState(()=>generateSudoku(difficulty));
  const given = puzzle.map(r=>r.map(v=>v!==0));
  const [userGrid, setUserGrid] = useState(()=>puzzle.map(r=>[...r]));
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState("");
  const { elapsed, running, done, start, stop } = useTimer();
  const wonRef = useRef(false);

  const handleNum = (num) => {
    if(!selected) return;
    const [r,c]=selected;
    if(given[r][c]) return;
    start();
    const ng=userGrid.map(row=>[...row]);
    ng[r][c]=num; setUserGrid(ng); setChecked(false); setStatus("");
    if(ng.every((row,ri)=>row.every((v,ci)=>v===solution[ri][ci]))) {
      setStatus("win");
      if(!wonRef.current){wonRef.current=true; stop(); setTimeout(()=>onWin(elapsed+1),200);}
    }
  };

  const checkAll = () => {
    setChecked(true);
    const allFilled=userGrid.every(row=>row.every(v=>v!==0));
    if(allFilled&&userGrid.every((row,r)=>row.every((v,c)=>v===solution[r][c]))){setStatus("win");if(!wonRef.current){wonRef.current=true;stop();setTimeout(()=>onWin(elapsed+1),200);}}
    else if(allFilled) setStatus("errors");
    else setStatus("checking");
  };

  const highlightSet = selected ? new Set([...Array.from({length:9},(_,i)=>`${selected[0]},${i}`),...Array.from({length:9},(_,i)=>`${i},${selected[1]}`),...(()=>{const cells=[];const br=Math.floor(selected[0]/3)*3,bc=Math.floor(selected[1]/3)*3;for(let i=0;i<3;i++)for(let j=0;j<3;j++)cells.push(`${br+i},${bc+j}`);return cells;})()]) : new Set();

  return (
    <div className="sdk-wrap">
      <TimerDisplay elapsed={elapsed} running={running} done={done} />
      <div className="sdk-grid">
        {userGrid.map((row,r)=>row.map((val,c)=>{
          const isGiven=given[r][c],isSel=selected?.[0]===r&&selected?.[1]===c,isHl=!isSel&&highlightSet.has(`${r},${c}`),isErr=checked&&!isGiven&&val!==0&&val!==solution[r][c],isOk=checked&&!isGiven&&val!==0&&val===solution[r][c],thickR=c===2||c===5,thickB=r===2||r===5;
          return(<div key={`${r},${c}`} className={`sdk-cell ${isGiven?"given":""} ${isSel?"selected":""} ${isHl?"highlight":""} ${isErr?"error":""} ${isOk?"correct-entered":""} ${thickR?"thick-right":""} ${thickB?"thick-bottom":""}`} onClick={()=>{if(!revealed){setSelected([r,c]);start();}}}>{val!==0?val:""}</div>);
        }))}
      </div>
      {status==="win"?<div className="sdk-status win">🎉 PUZZLE SOLVED!</div>:status==="errors"?<div className="sdk-status" style={{color:"#c0392b"}}>Some errors — keep trying!</div>:null}
      <div className="sdk-numpad">
        {[1,2,3,4,5,6,7,8,9].map(n=><button key={n} className="sdk-num-btn" onClick={()=>handleNum(n)}>{n}</button>)}
        <button className="sdk-num-btn erase" onClick={()=>handleNum(0)}>⌫ DEL</button>
      </div>
      <div className="sdk-actions">
        <button className="sdk-action-btn check" onClick={checkAll}>Check</button>
        <button className="sdk-action-btn" onClick={()=>{setUserGrid(solution.map(r=>[...r]));setRevealed(true);setChecked(false);setStatus("");}}>Reveal Solution</button>
        <button className="sdk-action-btn" onClick={()=>{setUserGrid(puzzle.map(r=>[...r]));setChecked(false);setRevealed(false);setStatus("");}}>Reset</button>
      </div>
    </div>
  );
}

// ─── Word Scramble Puzzle ────────────────────────────────────────────────────
function WordScramblePuzzle({ data, onWin }) {
  const words = useMemo(() => data.words.map(w => ({ ...w, word: w.word.toUpperCase() })), [data.words]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState(() => words.map(() => null)); // null | "solved" | "skipped"
  const [answer, setAnswer] = useState([]);
  const [usedTiles, setUsedTiles] = useState([]);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong"
  const { elapsed, running, done, start, stop } = useTimer();
  const wonRef = useRef(false);

  const current = words[currentIdx];
  const scrambled = useMemo(() => {
    if (!current) return [];
    let arr = current.word.split("");
    // Guarantee scrambled !== original
    for (let attempt = 0; attempt < 20; attempt++) {
      arr = arr.sort(() => Math.random() - 0.5);
      if (arr.join("") !== current.word) break;
    }
    return arr;
  }, [current?.word]);

  const solved = results.filter(r => r === "solved").length;
  const skipped = results.filter(r => r === "skipped").length;
  const allDone = results.every(r => r !== null);

  useEffect(() => {
    setAnswer([]);
    setUsedTiles([]);
    setFeedback(null);
  }, [currentIdx]);

  useEffect(() => {
    if (allDone && !wonRef.current) {
      wonRef.current = true;
      stop();
      setTimeout(() => onWin(elapsed + 1), 400);
    }
  }, [allDone]);

  const handleTileClick = (tileIdx) => {
    if (usedTiles.includes(tileIdx)) return;
    start();
    const newAnswer = [...answer, { letter: scrambled[tileIdx], tileIdx }];
    const newUsed = [...usedTiles, tileIdx];
    setAnswer(newAnswer);
    setUsedTiles(newUsed);
    setFeedback(null);

    if (newAnswer.length === current.word.length) {
      const attempt = newAnswer.map(a => a.letter).join("");
      if (attempt === current.word) {
        setFeedback("correct");
        const newResults = [...results]; newResults[currentIdx] = "solved"; setResults(newResults);
        setTimeout(() => advanceOrFinish(newResults), 700);
      } else {
        setFeedback("wrong");
        setTimeout(() => { setAnswer([]); setUsedTiles([]); setFeedback(null); }, 700);
      }
    }
  };

  const handleAnswerClick = (slotIdx) => {
    if (slotIdx >= answer.length) return;
    const removed = answer[slotIdx];
    setAnswer(answer.filter((_, i) => i !== slotIdx));
    setUsedTiles(usedTiles.filter(t => t !== removed.tileIdx));
    setFeedback(null);
  };

  const advanceOrFinish = (newResults) => {
    const next = newResults.findIndex((r, i) => i > currentIdx && r === null);
    if (next !== -1) setCurrentIdx(next);
    else {
      const firstEmpty = newResults.findIndex(r => r === null);
      if (firstEmpty !== -1) setCurrentIdx(firstEmpty);
    }
  };

  const handleSkip = () => {
    const newResults = [...results]; newResults[currentIdx] = "skipped"; setResults(newResults);
    setAnswer([]); setUsedTiles([]); setFeedback(null);
    advanceOrFinish(newResults);
  };

  const handleShuffle = () => { setAnswer([]); setUsedTiles([]); setFeedback(null); };

  if (!current) return null;

  return (
    <div className="scrm-wrap">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
        <div className="scrm-progress-header">
          WORD {currentIdx+1} / {words.length} · {solved} SOLVED · {skipped} SKIPPED
        </div>
        <TimerDisplay elapsed={elapsed} running={running} done={done} />
      </div>

      <div className="scrm-word-list">
        {words.map((w, i) => (
          <div key={i} className={`scrm-word-pill ${results[i]==="solved"?"solved":results[i]==="skipped"?"skipped":i===currentIdx?"pending":""}`}
            style={{ cursor: results[i]===null&&i!==currentIdx?"pointer":"default", outline: i===currentIdx?"2px solid var(--coral)":"none" }}
            onClick={() => { if (results[i]===null) setCurrentIdx(i); }}>
            {results[i]==="solved" ? w.word : results[i]==="skipped" ? w.word : `${i+1}`}
          </div>
        ))}
      </div>

      <div className="scrm-card">
        <div className="scrm-clue">"{current.clue}"</div>

        {/* Answer row */}
        <div className="scrm-answer-row">
          {Array.from({ length: current.word.length }).map((_, i) => {
            const slot = answer[i];
            const slotClass = feedback === "correct" ? "correct" : feedback === "wrong" ? "wrong" : "";
            return (
              <div key={i} className={`scrm-answer-slot ${slotClass}`} onClick={() => handleAnswerClick(i)}>
                {slot ? slot.letter : ""}
              </div>
            );
          })}
        </div>

        {/* Scrambled tiles */}
        <div className="scrm-letters">
          {scrambled.map((letter, i) => (
            <div key={i} className={`scrm-tile ${usedTiles.includes(i) ? "used" : ""}`} onClick={() => handleTileClick(i)}>
              {letter}
            </div>
          ))}
        </div>

        <div className="scrm-actions">
          <button className="scrm-btn" onClick={handleShuffle}>↺ Reset</button>
          <button className="scrm-btn" onClick={handleSkip}>Skip →</button>
        </div>

        {feedback === "correct" && <div style={{ color:"var(--teal)", fontFamily:"'DM Mono',monospace", fontSize:"0.82rem", fontWeight:700, letterSpacing:1 }}>✓ CORRECT!</div>}
        {feedback === "wrong" && <div style={{ color:"#c0392b", fontFamily:"'DM Mono',monospace", fontSize:"0.82rem", fontWeight:700, letterSpacing:1 }}>✗ TRY AGAIN</div>}
      </div>
    </div>
  );
}

// ─── Spelling Bee Puzzle ──────────────────────────────────────────────────────
// Hex layout: center + 6 surrounding positions
const HEX_POSITIONS = [
  { x: 90, y: 90 },   // center
  { x: 90, y: 14 },   // top
  { x: 157, y: 52 },  // top-right
  { x: 157, y: 128 }, // bottom-right
  { x: 90, y: 166 },  // bottom
  { x: 23, y: 128 },  // bottom-left
  { x: 23, y: 52 },   // top-left
];

function HexTile({ x, y, letter, isCenter, onClick }) {
  const fill = isCenter ? "var(--gold)" : "var(--navy)";
  const textColor = isCenter ? "var(--navy)" : "white";
  return (
    <g className="bee-hex"
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      style={{ cursor:"pointer" }}
      transform={`translate(${x},${y})`}
    >
      <polygon points="28,0 56,16 56,48 28,64 0,48 0,16" fill={fill} stroke="var(--cream)" strokeWidth="3" />
      <text x="28" y="38" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="18" fontWeight="700" fill={textColor} style={{ userSelect:"none", pointerEvents:"none" }}>{letter}</text>
    </g>
  );
}

function SpellingBeePuzzle({ data, onWin }) {
  const { centerLetter, outerLetters, validWords, pangrams } = data;
  const allLetters = useMemo(() => [centerLetter, ...outerLetters].map(l => l.toUpperCase()), [centerLetter, outerLetters]);
  const validWordsUpper = useMemo(() => validWords.map(w => w.toUpperCase()), [validWords]);
  const pangramsUpper = useMemo(() => (pangrams||[]).map(p => p.toUpperCase()), [pangrams]);

  const [found, setFound] = useState([]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState({ msg: "", type: "" });
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  const feedbackTimer = useRef(null);
  const shakeTimer = useRef(null);
  const { elapsed, running, done, start, stop } = useTimer();
  const wonRef = useRef(false);

  function wordScore(word) {
    if (word.length === 4) return 1;
    return pangramsUpper.includes(word) ? word.length + 7 : word.length;
  }

  const RANKS = useMemo(() => {
    const total = validWordsUpper.reduce((s, w) => s + wordScore(w), 0);
    return [
      { name:"Beginner", pct:0 }, { name:"Good Start", pct:0.05 }, { name:"Moving Up", pct:0.12 },
      { name:"Good", pct:0.22 }, { name:"Solid", pct:0.35 }, { name:"Nice", pct:0.50 },
      { name:"Great", pct:0.65 }, { name:"Amazing", pct:0.80 }, { name:"Genius", pct:1.0 },
    ].map(r => ({ ...r, pts: Math.floor(r.pct * total) }));
  }, [validWordsUpper]);

  const score = useMemo(() => found.reduce((s, w) => s + wordScore(w), 0), [found]);
  const maxScore = useMemo(() => validWordsUpper.reduce((s, w) => s + wordScore(w), 0), [validWordsUpper]);
  const rank = useMemo(() => [...RANKS].reverse().find(r => score >= r.pts) || RANKS[0], [score, RANKS]);

  const flash = useCallback((msg, type) => {
    clearTimeout(feedbackTimer.current);
    setFeedback({ msg, type });
    feedbackTimer.current = setTimeout(() => setFeedback({ msg:"", type:"" }), 1400);
  }, []);

  const doShake = useCallback(() => {
    clearTimeout(shakeTimer.current);
    setShake(true);
    shakeTimer.current = setTimeout(() => setShake(false), 400);
  }, []);

  useEffect(() => () => { clearTimeout(feedbackTimer.current); clearTimeout(shakeTimer.current); }, []);

  // Stable submit that reads input from a ref so it never goes stale
  const inputRef2 = useRef("");
  useEffect(() => { inputRef2.current = input; }, [input]);
  const foundRef = useRef([]);
  useEffect(() => { foundRef.current = found; }, [found]);
  const elapsedRef = useRef(0);
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);

  const submitWord = useCallback(() => {
    const word = inputRef2.current.toUpperCase().trim();
    if (!word) return;
    start();
    if (word.length < 4) { flash("Too short!", "bad"); doShake(); setInput(""); return; }
    if (!word.includes(centerLetter.toUpperCase())) { flash(`Must use ${centerLetter.toUpperCase()}!`, "bad"); doShake(); setInput(""); return; }
    if (word.split("").some(l => !allLetters.includes(l))) { flash("Bad letters!", "bad"); doShake(); setInput(""); return; }
    if (foundRef.current.includes(word)) { flash("Already found!", "bad"); doShake(); setInput(""); return; }
    if (!validWordsUpper.includes(word)) { flash("Not in word list!", "bad"); doShake(); setInput(""); return; }
    const isPangram = pangramsUpper.includes(word);
    const pts = wordScore(word);
    const newFound = [...foundRef.current, word];
    setFound(newFound);
    setInput("");
    flash(isPangram ? `🌟 Pangram! +${pts}` : pts === 1 ? "Good! +1" : `Great! +${pts}`, isPangram ? "great" : "good");
    if (newFound.length >= validWordsUpper.length && !wonRef.current) {
      wonRef.current = true; stop(); setTimeout(() => onWin(elapsedRef.current + 1), 500);
    }
  }, [centerLetter, allLetters, validWordsUpper, pangramsUpper, flash, doShake, start, stop, onWin]);

  // Hex tile click: append letter directly to state, no focus change (avoids double-fire)
  const addLetter = useCallback((l) => {
    start();
    setInput(p => p + l.toUpperCase());
  }, [start]);

  const handleInputKeyDown = useCallback((e) => {
    if (e.key === "Enter") { e.preventDefault(); submitWord(); }
    else if (e.key === "Escape") { e.preventDefault(); setInput(""); }
  }, [submitWord]);

  const handleInputChange = useCallback((e) => {
    // Filter to only valid hive letters
    const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    // Only allow letters that are in the hive
    const filtered = v.split("").filter(l => allLetters.includes(l)).join("");
    if (filtered !== v) doShake();
    setInput(filtered);
    if (filtered.length > 0) start();
  }, [allLetters, doShake, start]);

  const pct = maxScore > 0 ? Math.min(100, Math.round(score / maxScore * 100)) : 0;

  return (
    <div className="bee-wrap">
      <div className="bee-progress-header">
        <TimerDisplay elapsed={elapsed} running={running} done={done} />
        <span>{found.length} / {validWordsUpper.length} words found</span>
      </div>

      <div className="bee-score-bar">
        <div className="bee-score-header">
          <span className="bee-rank">{rank.name}</span>
          <span className="bee-pts">{score} pts · {pct}%</span>
        </div>
        <div className="bee-track"><div className="bee-track-fill" style={{ width:`${pct}%` }} /></div>
      </div>

      {/* Input row */}
      <div className="bee-input-row">
        <input
          ref={inputRef}
          className={`bee-input${shake ? " shake" : ""}`}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type or tap letters…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus
        />
        <button className="bee-submit" onClick={submitWord} disabled={!input.trim()}>Enter</button>
      </div>

      <div className={`bee-feedback ${feedback.type}`}>{feedback.msg}</div>

      {/* Honeycomb — pointer events only on polygon, not text */}
      <svg width="220" height="230" viewBox="0 0 220 230" style={{ overflow:"visible", touchAction:"manipulation" }}>
        {HEX_POSITIONS.map((pos, i) => (
          <HexTile key={i} x={pos.x} y={pos.y} letter={allLetters[i]} isCenter={i===0}
            onClick={() => addLetter(allLetters[i])} />
        ))}
      </svg>

      {/* Action buttons */}
      <div className="scrm-actions">
        <button className="scrm-btn" onMouseDown={e=>e.preventDefault()} onClick={() => setInput("")}>Clear</button>
        <button className="scrm-btn" onMouseDown={e=>e.preventDefault()} onClick={() => setInput(p => p.slice(0,-1))}>⌫ Delete</button>
        <button className="scrm-btn primary" onMouseDown={e=>e.preventDefault()} onClick={submitWord} disabled={!input.trim()}>Submit</button>
      </div>

      {/* Found words */}
      {found.length > 0 && (
        <div className="bee-found-list">
          {[...found].reverse().map(w => (
            <span key={w} className={`bee-found-word${pangramsUpper.includes(w) ? " pangram" : ""}`}>{w}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Math Sprint Puzzle ───────────────────────────────────────────────────────
const MATH_CONFIG = {
  Beginner:     { time: 90,  ops: ["+","-"],       maxVal: 10,  negAllowed: false, label:"Addition & Subtraction to 10" },
  Intermediate: { time: 75,  ops: ["+","-","×"],   maxVal: 12,  negAllowed: false, label:"+ − × up to 12" },
  Advanced:     { time: 60,  ops: ["+","-","×","÷"],maxVal: 15, negAllowed: true,  label:"All ops, negatives" },
  Extreme:      { time: 45,  ops: ["+","-","×","÷"],maxVal: 20, negAllowed: true,  label:"Fast & hard" },
};

function generateQuestion(cfg) {
  const op = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];
  let a, b, answer;
  if (op === "+") {
    a = Math.floor(Math.random() * cfg.maxVal) + 1;
    b = Math.floor(Math.random() * cfg.maxVal) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * cfg.maxVal) + 1;
    b = Math.floor(Math.random() * (cfg.negAllowed ? cfg.maxVal : a)) + (cfg.negAllowed ? 1 : 0);
    if (!cfg.negAllowed && b > a) [a, b] = [b, a];
    answer = a - b;
  } else if (op === "×") {
    a = Math.floor(Math.random() * Math.min(cfg.maxVal, 12)) + 1;
    b = Math.floor(Math.random() * Math.min(cfg.maxVal, 12)) + 1;
    answer = a * b;
  } else { // ÷
    b = Math.floor(Math.random() * 11) + 1;
    answer = Math.floor(Math.random() * 11) + 1;
    a = b * answer;
  }
  return { question: `${a} ${op} ${b}`, answer };
}

function MathSprintPuzzle({ difficulty, onWin }) {
  const cfg = MATH_CONFIG[difficulty] || MATH_CONFIG.Intermediate;
  const [phase, setPhase] = useState("ready"); // ready | playing | done
  const [timeLeft, setTimeLeft] = useState(cfg.time);
  const [current, setCurrent] = useState(() => generateQuestion(cfg));
  const [inputVal, setInputVal] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [flash, setFlash] = useState(""); // "correct-flash" | "wrong-flash"
  const inputRef = useRef(null);
  const intervalRef = useRef(null);
  const wonRef = useRef(false);

  const startGame = () => {
    setPhase("playing");
    setTimeLeft(cfg.time);
    setScore(0); setStreak(0); setBestStreak(0); setHistory([]);
    setCurrent(generateQuestion(cfg));
    setInputVal("");
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (phase === "done" && !wonRef.current) {
      wonRef.current = true;
      // score itself is the "time" equivalent for win tracking
      setTimeout(() => onWin(score || 1), 400);
    }
  }, [phase]);

  const submitAnswer = useCallback(() => {
    if (phase !== "playing") return;
    const num = parseInt(inputVal, 10);
    if (isNaN(num)) return;
    const correct = num === current.answer;
    setHistory(h => [{ q: current.question, a: current.answer, given: num, correct }, ...h].slice(0, 30));
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => { const ns = s+1; setBestStreak(b => Math.max(b,ns)); return ns; });
      setFlash("correct-flash");
    } else {
      setStreak(0);
      setFlash("wrong-flash");
    }
    setTimeout(() => setFlash(""), 300);
    setInputVal("");
    setCurrent(generateQuestion(cfg));
    inputRef.current?.focus();
  }, [phase, inputVal, current, cfg]);

  const handleKey = (e) => { if (e.key === "Enter") { e.preventDefault(); submitAnswer(); } };
  const appendDigit = (d) => { if (phase!=="playing") return; setInputVal(p => p === "" && d==="-" ? "-" : p + d); inputRef.current?.focus(); };
  const deleteDigit = () => { setInputVal(p => p.slice(0,-1)); inputRef.current?.focus(); };

  // Ring math
  const radius = 38, circ = 2 * Math.PI * radius;
  const pct = timeLeft / cfg.time;
  const ringColor = pct > 0.5 ? "var(--teal)" : pct > 0.25 ? "var(--gold)" : "var(--coral)";

  if (phase === "done") {
    const accuracy = history.length > 0 ? Math.round(history.filter(h=>h.correct).length / history.length * 100) : 0;
    return (
      <div className="math-wrap">
        <div className="math-results">
          <div className="math-results-title">Time's Up!</div>
          <div className="math-results-grid">
            <div className="math-results-card"><div className="math-results-val">{score}</div><div className="math-results-lbl">Correct</div></div>
            <div className="math-results-card"><div className="math-results-val">{accuracy}%</div><div className="math-results-lbl">Accuracy</div></div>
            <div className="math-results-card"><div className="math-results-val">{bestStreak}</div><div className="math-results-lbl">Best Streak</div></div>
          </div>
          <button className="gen-btn" onClick={() => { wonRef.current=false; startGame(); }}>Play Again</button>
          {history.length > 0 && (
            <div className="math-history">
              {history.map((h,i) => (
                <div key={i} className={`math-history-row ${h.correct?"right":"wrong"}`}>
                  <span>{h.q} = {h.a}</span>
                  <span>You: {h.given} {h.correct?"✓":"✗"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="math-wrap">
        <div style={{ textAlign:"center", maxWidth:400 }}>
          <div style={{ fontSize:"3rem", marginBottom:16 }}>🧮</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:"var(--navy)", marginBottom:8 }}>Math Sprint</div>
          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.9rem", color:"var(--muted)", marginBottom:6 }}>{cfg.label}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.78rem", color:"var(--coral)", marginBottom:28, letterSpacing:"0.5px" }}>⏱ {cfg.time} seconds · answer as many as you can</div>
          <button className="gen-btn" style={{ fontSize:"1rem", padding:"14px 36px" }} onClick={startGame}>Start Sprint →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="math-wrap">
      <div className="math-header-row">
        <div className="math-score-pill">✓ {score} correct</div>
        <div className="math-timer-ring">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle className="ring-track" cx="48" cy="48" r={radius} />
            <circle className="ring-fill" cx="48" cy="48" r={radius}
              stroke={ringColor}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
            />
          </svg>
          <div className="math-timer-label">{timeLeft}</div>
        </div>
        {streak >= 3 && <div className="math-streak-badge">🔥 {streak}</div>}
      </div>

      <div className="math-card">
        <div className="math-question">{current.question} = <em>?</em></div>
        <input
          ref={inputRef}
          className={`math-answer-input ${flash}`}
          type="number"
          inputMode="numeric"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          placeholder="?"
          autoFocus
        />
        <div className="math-numpad">
          {["7","8","9","⌫","4","5","6","OK","1","2","3","−","0","00","",""].map((k,i) => {
            if (!k) return <div key={i} />;
            const cls = k==="OK"?"ok" : k==="⌫"?"del" : k==="−"?"neg" : "";
            return (
              <button key={i} className={`math-num-btn ${cls}`}
                onClick={() => {
                  if (k==="OK") submitAnswer();
                  else if (k==="⌫") deleteDigit();
                  else if (k==="−") appendDigit("-");
                  else appendDigit(k);
                }}
              >{k}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Privacy Modal ────────────────────────────────────────────────────────────
function PrivacyModal({ onClose }) {
  return (
    <div className="privacy-overlay" onClick={onClose}>
      <div className="privacy-modal" onClick={e=>e.stopPropagation()}>
        <button className="privacy-close" onClick={onClose}>✕</button>
        <h2>Privacy Policy & Email Consent</h2>
        <p><strong>What we collect:</strong> When you enter your email address, we store it to give you access to PuzzleNest and to send you our monthly newsletter.</p>
        <p><strong>How we use it:</strong> Your email is used solely for the purposes stated above. No more than one newsletter per month. Never sold or shared.</p>
        <p><strong>Your rights:</strong> You may withdraw consent at any time by emailing <strong>privacy@puzzlenest.app</strong>. Every newsletter includes a one-click unsubscribe link.</p>
        <p><strong>Legal basis:</strong> GDPR Art. 6(1)(a) and CAN-SPAM Act compliant.</p>
        <p><strong>Controller:</strong> PuzzleNest · privacy@puzzlenest.app</p>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onAccess }) {
  const [email, setEmail] = useState(""), [touched, setTouched] = useState(false);
  const [consented, setConsented] = useState(false), [consentTouched, setConsentTouched] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [saving, setSaving] = useState(false), [saved, setSaved] = useState(false);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async () => {
    setTouched(true); setConsentTouched(true);
    if(!isValidEmail||!consented) return;
    setSaving(true);
    const record = { email:email.trim(), consented:true, consentedAt:new Date().toISOString(), source:"landing_page", newsletter:true };
    try { const key=`subscriber:${email.trim().toLowerCase().replace(/[^a-z0-9]/g,"_")}`; const existing=JSON.parse(localStorage.getItem("puzzlenest_subscribers")||"{}"); existing[key]=record; localStorage.setItem("puzzlenest_subscribers",JSON.stringify(existing)); } catch(_){}
    try { const loopsApiKey=localStorage.getItem("puzzlenest_loops_key"); if(loopsApiKey){await fetch("https://app.loops.so/api/v1/contacts/create",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${loopsApiKey}`},body:JSON.stringify({email:email.trim(),source:"PuzzleNest Landing Page",subscribed:true,userGroup:"newsletter"})});} } catch(_){}
    setSaving(false); setSaved(true);
    setTimeout(()=>onAccess(email.trim()),900);
  };

  return (
    <>
      <style>{GS}</style>
      {showPrivacy && <PrivacyModal onClose={()=>setShowPrivacy(false)} />}
      <div className="lp-wrap">
        <div className="lp-inner">
          <div className="lp-eyebrow">✦ Free Daily Brain Training</div>
          <div className="lp-social">
            <span className="lp-stars">★★★★★</span><span className="lp-social-dot" />
            <span className="lp-social-text">Trusted by 12,000+ daily puzzle solvers</span>
          </div>
          <div className="lp-promo">
            <div className="lp-promo-line1">Train your brain with<br /><em>unlimited puzzles</em></div>
            <div className="lp-promo-line2">Word searches, crosswords, sudoku, word scrambles, spelling bee, and math sprints — designed to sharpen memory, expand vocabulary, and keep your mind at its best.</div>
          </div>
          <div className="lp-props">
            {["🔤 Word Search","✏️ Crossword","🔢 Sudoku","🔀 Word Scramble","🐝 Spelling Bee","🧮 Math Sprint"].map(p=><div key={p} className="lp-prop"><div className="lp-prop-dot"/>{p}</div>)}
          </div>
          <div className="lp-divider" />
          <div className="lp-form-label">Join free — start playing instantly</div>
          <div className="lp-form">
            {saved ? <div className="lp-saved">✓ Welcome to PuzzleNest — loading your games…</div> : (
              <>
                <input className={`lp-input${touched&&!isValidEmail?" error":""}`} type="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setTouched(false);}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} autoFocus />
                {touched&&!isValidEmail&&<div className="lp-error-msg">Please enter a valid email address.</div>}
                <label className={`lp-consent${consentTouched&&!consented?" error-consent":""}`}>
                  <input type="checkbox" checked={consented} onChange={e=>{setConsented(e.target.checked);setConsentTouched(false);}} />
                  <span className="lp-consent-text">I agree to receive PuzzleNest's monthly newsletter and accept the <a onClick={e=>{e.preventDefault();setShowPrivacy(true);}}>Privacy Policy</a>.</span>
                </label>
                {consentTouched&&!consented&&<div className="lp-error-msg">Please check the box above to continue.</div>}
                <button className="lp-submit" onClick={handleSubmit} disabled={saving}>{saving?"Saving…":"Start Training My Brain →"}</button>
              </>
            )}
          </div>
          <div className="lp-fine-print">No credit card. No spam. One brain-boosting email per month, max.</div>
        </div>
      </div>
    </>
  );
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────
function AdminPanel({ onExit }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loopsKey, setLoopsKey] = useState(""), [loopsKeySaved, setLoopsKeySaved] = useState(false), [loopsKeyLoaded, setLoopsKeyLoaded] = useState("");
  useEffect(()=>{
    try{const stored=JSON.parse(localStorage.getItem("puzzlenest_subscribers")||"{}");const records=Object.values(stored);records.sort((a,b)=>new Date(b.consentedAt)-new Date(a.consentedAt));setSubscribers(records);}catch(_){}
    try{const k=localStorage.getItem("puzzlenest_loops_key");if(k)setLoopsKeyLoaded(k);}catch(_){}
    setLoading(false);
  },[]);
  const saveLoopsKey=()=>{if(!loopsKey.trim())return;try{localStorage.setItem("puzzlenest_loops_key",loopsKey.trim());setLoopsKeyLoaded(loopsKey.trim());setLoopsKey("");setLoopsKeySaved(true);setTimeout(()=>setLoopsKeySaved(false),3000);}catch(_){}};
  const copyCSV=()=>{const header="Email,Consented,Date,Source";const rows=subscribers.map(s=>`${s.email},${s.consented},${new Date(s.consentedAt).toLocaleString()},${s.source}`);navigator.clipboard.writeText([header,...rows].join("\n"));setCopied(true);setTimeout(()=>setCopied(false),2500);};
  const formatDate=iso=>{try{return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}catch(_){return iso;}};
  return (
    <>
      <style>{GS}</style>
      <div className="admin-wrap">
        <div className="admin-header">
          <div><div className="admin-title">Puzzle<span>Nest</span> Admin</div><div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.35)",marginTop:4,fontFamily:"'Inter',sans-serif"}}>Subscriber Management</div></div>
          <div className="admin-badge">Admin Only</div>
        </div>
        <div className="admin-loops-banner">
          <div className="admin-loops-icon">🔁</div>
          <div className="admin-loops-text">
            <strong>Loops.so Integration</strong> — {loopsKeyLoaded?"✓ API key configured.":"Paste your Loops API key to sync signups."}
            <div className="admin-loops-key-row">
              <input className="admin-loops-input" placeholder={loopsKeyLoaded?"••••••••• (saved)":"sk_live_xxxxxxxxxxxxx"} value={loopsKey} onChange={e=>setLoopsKey(e.target.value)} type="password" />
              <button className="admin-loops-save" onClick={saveLoopsKey}>{loopsKeySaved?"✓ Saved!":"Save Key"}</button>
            </div>
          </div>
        </div>
        <div className="admin-stats">
          <div className="admin-stat"><div className="admin-stat-num">{loading?"—":subscribers.length}</div><div className="admin-stat-label">Total Subscribers</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{loading?"—":subscribers.filter(s=>s.consented).length}</div><div className="admin-stat-label">Consented</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{loading?"—":(subscribers[0]?formatDate(subscribers[0].consentedAt):"—")}</div><div className="admin-stat-label">Latest Signup</div></div>
          <div className="admin-stat"><div className="admin-stat-num" style={{color:loopsKeyLoaded?"rgba(100,220,180,0.9)":"rgba(255,255,255,0.3)",fontSize:"1.1rem",paddingTop:6}}>{loopsKeyLoaded?"● Live":"○ Not set"}</div><div className="admin-stat-label">Loops Status</div></div>
        </div>
        <div className="admin-toolbar">
          <button className="admin-btn admin-btn-coral" onClick={copyCSV} disabled={!subscribers.length}>{copied?"✓ Copied!":"⬇ Export CSV"}</button>
          <button className="admin-btn admin-btn-ghost" onClick={onExit}>← Back to PuzzleNest</button>
        </div>
        <div className="admin-table-wrap">
          {loading?<div className="admin-loading">Loading…</div>:subscribers.length===0?<div className="admin-empty">No subscribers yet.</div>:(
            <table className="admin-table">
              <thead><tr><th>#</th><th>Email</th><th>Date</th><th>Consented</th><th>Source</th></tr></thead>
              <tbody>{subscribers.map((s,i)=>(
                <tr key={s.email}>
                  <td style={{color:"rgba(255,255,255,0.25)"}}>{subscribers.length-i}</td>
                  <td>{s.email}</td>
                  <td style={{color:"rgba(255,255,255,0.45)"}}>{formatDate(s.consentedAt)}</td>
                  <td><span className={`admin-pill ${s.consented?"admin-pill-green":"admin-pill-grey"}`}>{s.consented?"YES":"NO"}</span></td>
                  <td style={{color:"rgba(255,255,255,0.4)",fontSize:"0.75rem"}}>{s.source||"landing_page"}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const keySeq = useRef([]);
  useEffect(()=>{
    const handler=(e)=>{keySeq.current=[...keySeq.current,e.key.toLowerCase()].slice(-3);if(keySeq.current.join("")==="adm"){setIsAdmin(true);keySeq.current=[];}};
    window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);
  },[]);
  const tapCount=useRef(0),tapTimer=useRef(null);
  const handleLogoTap=()=>{tapCount.current+=1;clearTimeout(tapTimer.current);tapTimer.current=setTimeout(()=>{tapCount.current=0;},2000);if(tapCount.current>=5){tapCount.current=0;setIsAdmin(true);}};
  if(isAdmin) return <AdminPanel onExit={()=>setIsAdmin(false)} />;
  if(!hasAccess) return <LandingPage onAccess={()=>setHasAccess(true)} />;
  return <PuzzleApp onLogoTap={handleLogoTap} />;
}

function PuzzleApp({ onLogoTap }) {
  const [gameType, setGameType] = useState("Word Search");
  const [theme, setTheme] = useState("Summer");
  const [customTheme, setCustomTheme] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [loading, setLoading] = useState(false);
  const [puzzle, setPuzzle] = useState(null);
  const [error, setError] = useState(null);
  const [winModal, setWinModal] = useState(null); // { puzzleType, elapsed }
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(defaultStats());
  const activeTheme = theme === "Custom" ? customTheme : theme;

  // Load stats on mount
  useEffect(() => {
    loadStats().then(s => { if (s) setStats(s); });
  }, []);

  const recordWin = useCallback(async (puzzleType, elapsed) => {
    const today = new Date().toDateString();
    setStats(prev => {
      const next = { ...prev, byType: { ...prev.byType }, bestTimes: { ...prev.bestTimes } };
      next.totalSolved = (prev.totalSolved || 0) + 1;
      next.byType[puzzleType] = (prev.byType[puzzleType] || 0) + 1;
      if (!prev.bestTimes[puzzleType] || elapsed < prev.bestTimes[puzzleType]) next.bestTimes[puzzleType] = elapsed;
      if (prev.lastSolvedDate === today) next.streak = (prev.streak || 1);
      else if (prev.lastSolvedDate === new Date(Date.now()-86400000).toDateString()) next.streak = (prev.streak || 0) + 1;
      else next.streak = 1;
      next.lastSolvedDate = today;
      saveStats(next);
      return next;
    });
  }, []);

  const handleWin = useCallback((puzzleType, elapsed) => {
    recordWin(puzzleType, elapsed);
    setWinModal({ puzzleType, elapsed });
  }, [recordWin]);

  const generate = async () => {
    if (gameType === "Sudoku" || gameType === "Math Sprint") {
      setPuzzle({ type:gameType, title:`${difficulty} ${gameType}`, difficulty }); return;
    }
    if (!activeTheme.trim()) { setError("Please enter a custom theme."); return; }
    setLoading(true); setError(null); setPuzzle(null);

    try {
      if (gameType === "Word Search") {
        const isCustom = theme === "Custom";
        let words;
        if (isCustom) {
          const raw = await callClaude(`Search the web for 12–16 current, relevant, interesting vocabulary words related to "${customTheme}". Return ONLY a JSON array of the words, uppercase, no explanation, no markdown fences.`, true);
          words = parseJSON(raw);
        } else {
          const sizeMap = { Beginner:"8–10 short (4–6 letters)", Intermediate:"10–12 medium", Advanced:"12–14 longer (6–9 letters)", Extreme:"14–16 long (7–12 letters)" };
          const raw = await callClaude(`Generate a word search puzzle for the theme "${activeTheme}" at ${difficulty} difficulty.\nReturn ONLY a JSON object (no markdown, no explanation) with:\n- "title": a fun puzzle title\n- "words": an array of ${sizeMap[difficulty]} uppercase words related to the theme\n\nExample format: {"title":"Summer Fun","words":["BEACH","OCEAN","SUNTAN"]}`);
          const parsed = parseJSON(raw);
          setPuzzle({ type:"Word Search", title:parsed.title, words:parsed.words, difficulty });
          setLoading(false); return;
        }
        setPuzzle({ type:"Word Search", title:`${customTheme} Word Search`, words, difficulty });

      } else if (gameType === "Crossword") {
        const wordCountMap = { Beginner:6, Intermediate:8, Advanced:10, Extreme:12 };
        const wordsPrompt = `Create a crossword puzzle with exactly ${wordCountMap[difficulty]} words on the theme "${activeTheme}".\n\nReturn ONLY a JSON object, no explanation, no markdown. Format:\n{\n  "title": "Fun Puzzle Title",\n  "words": [\n    {"word": "EXAMPLE", "clue": "A sample or instance"}\n  ]\n}\n\nRules:\n- All words uppercase, letters only (no spaces, hyphens, or punctuation)\n- Words between 3 and 10 letters long\n- Clues should be concise (under 10 words)\n- Choose words that share common letters so they can intersect\n- Return ONLY the JSON object`;
        const wordsRaw = await callClaude(wordsPrompt, false, 1000);
        const wordsData = parseJSON(wordsRaw);
        const words = wordsData.words || [];
        if (!words.length) throw new Error("No words returned from API");
        const crosswordData = buildCrossword(words, wordsData.title || `${activeTheme} Crossword`);
        setPuzzle({ type:"Crossword", ...crosswordData, difficulty });

      } else if (gameType === "Word Scramble") {
        const countMap = { Beginner:6, Intermediate:8, Advanced:10, Extreme:12 };
        const prompt = `Create a word scramble puzzle with ${countMap[difficulty]} words on the theme "${activeTheme}".\n\nReturn ONLY a JSON object, no explanation, no markdown:\n{\n  "title": "Fun Puzzle Title",\n  "words": [\n    {"word": "EXAMPLE", "clue": "A sample or instance of something"},\n    {"word": "ANOTHER", "clue": "One more of the same"}\n  ]\n}\n\nRules:\n- All words uppercase, letters only, no spaces or hyphens\n- ${difficulty === "Beginner" ? "Words 4–5 letters long" : difficulty === "Intermediate" ? "Words 5–7 letters long" : difficulty === "Advanced" ? "Words 6–9 letters long" : "Words 7–12 letters long"}\n- Clues should be helpful definitions (10–15 words)\n- Return ONLY the JSON object`;
        const raw = await callClaude(prompt, false, 1000);
        const parsed = parseJSON(raw);
        if (!parsed.words?.length) throw new Error("No words returned from API");
        setPuzzle({ type:"Word Scramble", title:parsed.title || `${activeTheme} Word Scramble`, words:parsed.words, difficulty });

      } else if (gameType === "Spelling Bee") {
        const wordCountMap = { Beginner:15, Intermediate:25, Advanced:40, Extreme:60 };
        const minLen = { Beginner:4, Intermediate:4, Advanced:4, Extreme:4 }[difficulty];
        const prompt = `Create a Spelling Bee puzzle on the theme "${activeTheme}".
Choose 7 letters (1 center letter + 6 outer letters) such that many English words can be formed using only those letters, and every valid word must contain the center letter.

Return ONLY a JSON object, no markdown:
{
  "title": "Fun Spelling Bee Title",
  "centerLetter": "A",
  "outerLetters": ["B","C","D","E","F","G"],
  "validWords": ["WORD1","WORD2",...],
  "pangrams": ["PANGRAM1"]
}

Rules:
- centerLetter and outerLetters are single uppercase letters, no repeats across all 7
- validWords: ${wordCountMap[difficulty]}+ common English words, all uppercase, minimum ${minLen} letters, each containing centerLetter, using only the 7 letters (letters CAN repeat in words)
- pangrams: words that use all 7 letters at least once (can be empty array if none)
- Aim for a theme-inspired letter set and title
- Return ONLY the JSON object`;
        const raw = await callClaude(prompt, false, 1500);
        const parsed = parseJSON(raw);
        if (!parsed.validWords?.length || !parsed.centerLetter) throw new Error("Invalid Spelling Bee data from API");
        setPuzzle({ type:"Spelling Bee", title:parsed.title || `${activeTheme} Spelling Bee`, centerLetter:parsed.centerLetter.toUpperCase(), outerLetters:parsed.outerLetters.map(l=>l.toUpperCase()), validWords:parsed.validWords.map(w=>w.toUpperCase()), pangrams:(parsed.pangrams||[]).map(p=>p.toUpperCase()), difficulty });

      } else if (gameType === "Math Sprint") {
        // Math Sprint needs no API — generate locally
        setPuzzle({ type:"Math Sprint", title:`${difficulty} Math Sprint`, difficulty });
      }
    } catch (e) {
      setError(e.message || "Failed to generate puzzle. Please try again.");
    }
    setLoading(false);
  };

  const diffEmoji = { Beginner:"🟢", Intermediate:"🟡", Advanced:"🔴", Extreme:"⚫" };

  return (
    <>
      <style>{GS}</style>
      {winModal && (
        <WinModal
          puzzleType={winModal.puzzleType}
          elapsed={winModal.elapsed}
          streak={stats.streak}
          onNext={() => { setWinModal(null); setPuzzle(null); setError(null); }}
          onClose={() => setWinModal(null)}
        />
      )}
      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}

      <div className="app-wrap">
        <div className="sticky-bar no-print">
          <div className="bar-logo" onClick={onLogoTap} style={{ cursor:"default" }}>
            <div className="bar-title">Puzzle<span>Nest</span></div>
            <div className="bar-tagline">Think. Solve. <span>Repeat.</span></div>
          </div>
          <div className="controls-group">
            <select className="pill-select" value={gameType} onChange={e=>{setGameType(e.target.value);setPuzzle(null);setError(null);}}>
              {["Word Search","Crossword","Sudoku","Word Scramble","Spelling Bee","Math Sprint"].map(t=><option key={t}>{t}</option>)}
            </select>

            {gameType !== "Sudoku" && gameType !== "Math Sprint" && (
              <>
                <select className="pill-select" value={theme} onChange={e=>setTheme(e.target.value)}>
                  {["Summer","Animals","Space","Food & Cooking","Sports","Holidays","Science","History","Music","Movies","Technology","Custom"].map(t=>(
                    <option key={t} value={t}>{t==="Custom"?"➕ Custom Theme...":t}</option>
                  ))}
                </select>
                {theme === "Custom" && (
                  <input className="custom-input" placeholder="Enter your theme…" value={customTheme} onChange={e=>setCustomTheme(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()} />
                )}
              </>
            )}

            <select className="pill-select" value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
              {["Beginner","Intermediate","Advanced","Extreme"].map(d=><option key={d} value={d}>{diffEmoji[d]} {d}</option>)}
            </select>

            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading ? "Typesetting…" : "Generate Puzzle"}
            </button>
            {puzzle && <button className="print-btn" onClick={()=>window.print()}>🖨 Print</button>}
            {puzzle && <button className="reset-btn" onClick={()=>{setPuzzle(null);setError(null);setGameType("Word Search");setTheme("Summer");setCustomTheme("");setDifficulty("Intermediate");}}>↺ Reset</button>}
            <button className="stats-pill" onClick={()=>setShowStats(true)}>
              🔥 {stats.streak || 0} streak · {stats.totalSolved || 0} solved
            </button>
          </div>
        </div>

        <div className="main-content">
          {!puzzle && !loading && !error && (
            <div className="landing-hero">
              <div className="hero-eyebrow">✦ Your Daily Brain Workout</div>
              <h1 className="hero-title">Get smarter,<br /><em>one puzzle at a time</em></h1>
              <p className="hero-sub">Choose a game, pick a topic, set your challenge level — and put your mind to work. Crosswords build vocabulary, word searches sharpen focus, sudoku strengthens logic, and word scrambles expand spelling skills.</p>
              <div className="hero-ornament"><div className="hero-ornament-line" />✦ ✦ ✦<div className="hero-ornament-line" /></div>
              <div className="hero-custom-promo">
                <div className="hero-custom-tag">✦ Custom Theme</div>
                <h2 className="hero-custom-title">Stay sharp on what <em>matters to you</em></h2>
                <p className="hero-custom-body">Select <strong>Custom Theme</strong> and type anything — your profession, a hobby, a period of history, a language you're learning — and every puzzle will be built around it.</p>
              </div>
              <div className="hero-ornament"><div className="hero-ornament-line" />✦ ✦ ✦<div className="hero-ornament-line" /></div>

              {/* ── Bookmark Section ── */}
              <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center", padding:"36px 0" }}>
                <div className="hero-custom-tag" style={{ background:"var(--teal-pale)", color:"var(--teal)", border:"1px solid rgba(14,155,138,0.2)", marginBottom:16 }}>✦ Bookmark This Page</div>
                <h2 className="hero-custom-title" style={{ marginBottom:16 }}>A sharper mind, <em>every single day</em></h2>
                <p className="hero-custom-body" style={{ marginBottom:32 }}>
                  Research shows that regular mental exercise reduces stress, improves focus, and helps keep your mind resilient as you age. A few minutes of puzzling each day is one of the simplest things you can do for your brain — and your wellbeing. Come back tomorrow. Your mind will thank you.
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, maxWidth:480, margin:"0 auto 28px" }}>
                  {[
                    { num:"∞", label:"Unique puzzles", sub:"Never repeated" },
                    { num:"6",  label:"Puzzle types",  sub:"More coming soon" },
                    { num:"🔥", label:"Daily streak",  sub:"Build the habit" },
                  ].map(s => (
                    <div key={s.label} style={{ background:"var(--white)", border:"1px solid var(--border-light)", borderRadius:14, padding:"18px 12px", boxShadow:"var(--shadow-sm)" }}>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:900, color:"var(--navy)", lineHeight:1, marginBottom:6 }}>{s.num}</div>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.75rem", fontWeight:700, color:"var(--ink)", marginBottom:3 }}>{s.label}</div>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.68rem", color:"var(--muted)" }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"linear-gradient(135deg,var(--navy) 0%,#1A2744 100%)", borderRadius:16, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"var(--shadow-md)" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", fontWeight:700, color:"var(--cream)" }}>Press <span style={{ color:"var(--gold)" }}>⌘D</span> to bookmark</div>
                </div>
              </div>

              <div className="hero-ornament"><div className="hero-ornament-line" />✦ ✦ ✦<div className="hero-ornament-line" /></div>
              <div style={{ maxWidth:520, margin:"0 auto", textAlign:"center", paddingBottom:36 }}>
                <div className="hero-custom-tag" style={{ marginBottom:16 }}>✦ Quick Play</div>
                <h2 className="hero-custom-title" style={{ marginBottom:20 }}>Jump right in — <em>pick a puzzle</em></h2>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, maxWidth:600, margin:"0 auto" }}>
                  {[
                    { icon:"🔤", title:"Word Search",  desc:"Find hidden words",   type:"Word Search",   theme:"Summer" },
                    { icon:"✏️", title:"Crossword",    desc:"Solve clue by clue",  type:"Crossword",     theme:"Animals" },
                    { icon:"🔢", title:"Sudoku",       desc:"Pure logic puzzle",   type:"Sudoku",        theme:null },
                    { icon:"🔀", title:"Word Scramble",desc:"Unscramble letters",  type:"Word Scramble", theme:"Space" },
                    { icon:"🐝", title:"Spelling Bee", desc:"Make words from hive",type:"Spelling Bee",  theme:"Nature" },
                    { icon:"🧮", title:"Math Sprint",  desc:"Beat the clock",      type:"Math Sprint",   theme:null },
                  ].map(b => (
                    <button
                      key={b.title}
                      disabled={loading}
                      onClick={() => {
                        setGameType(b.type);
                        if (b.theme) setTheme(b.theme);
                        setDifficulty("Intermediate");
                        setPuzzle(null); setError(null);
                        setTimeout(() => {
                          const doGenerate = async () => {
                            setLoading(true); setError(null); setPuzzle(null);
                            try {
                              if (b.type === "Sudoku") {
                                setPuzzle({ type:"Sudoku", title:"Intermediate Sudoku", difficulty:"Intermediate" });
                                setLoading(false); return;
                              }
                              if (b.type === "Math Sprint") {
                                setPuzzle({ type:"Math Sprint", title:"Intermediate Math Sprint", difficulty:"Intermediate" });
                                setLoading(false); return;
                              }
                              if (b.type === "Word Search") {
                                const raw = await callClaude(`Generate a word search puzzle for the theme "${b.theme}" at Intermediate difficulty.\nReturn ONLY a JSON object with:\n- "title": a fun puzzle title\n- "words": an array of 10-12 medium uppercase words\n\nExample: {"title":"Summer Fun","words":["BEACH","OCEAN","SUNTAN"]}`);
                                const parsed = parseJSON(raw);
                                setPuzzle({ type:"Word Search", title:parsed.title, words:parsed.words, difficulty:"Intermediate" });
                              } else if (b.type === "Crossword") {
                                const raw = await callClaude(`Create a crossword puzzle with exactly 8 words on the theme "${b.theme}".\nReturn ONLY a JSON object:\n{"title":"...","words":[{"word":"EXAMPLE","clue":"A sample or instance"}]}\nRules: uppercase, letters only, 3-10 letters, concise clues, words that share letters.`);
                                const parsed = parseJSON(raw);
                                if (!parsed.words?.length) throw new Error("No words returned");
                                setPuzzle({ type:"Crossword", ...buildCrossword(parsed.words, parsed.title || `${b.theme} Crossword`), difficulty:"Intermediate" });
                              } else if (b.type === "Word Scramble") {
                                const raw = await callClaude(`Create a word scramble puzzle with 8 words on the theme "${b.theme}".\nReturn ONLY a JSON object:\n{"title":"...","words":[{"word":"EXAMPLE","clue":"A sample or instance of something"}]}\nRules: uppercase, letters only, 5-7 letters, helpful definitions.`);
                                const parsed = parseJSON(raw);
                                if (!parsed.words?.length) throw new Error("No words returned");
                                setPuzzle({ type:"Word Scramble", title:parsed.title || `${b.theme} Word Scramble`, words:parsed.words, difficulty:"Intermediate" });
                              } else if (b.type === "Spelling Bee") {
                                const raw = await callClaude(`Create a Spelling Bee puzzle on the theme "${b.theme}".\nChoose 7 letters (1 center + 6 outer) so many English words can be formed.\nReturn ONLY a JSON object:\n{"title":"...","centerLetter":"A","outerLetters":["B","C","D","E","F","G"],"validWords":["WORD1","WORD2",...],"pangrams":[]}\nRules: 25+ common words min 4 letters, all must contain center letter, use only the 7 letters (can repeat), uppercase throughout.`, false, 1500);
                                const parsed = parseJSON(raw);
                                if (!parsed.validWords?.length || !parsed.centerLetter) throw new Error("Invalid Spelling Bee data");
                                setPuzzle({ type:"Spelling Bee", title:parsed.title||`${b.theme} Spelling Bee`, centerLetter:parsed.centerLetter.toUpperCase(), outerLetters:parsed.outerLetters.map(l=>l.toUpperCase()), validWords:parsed.validWords.map(w=>w.toUpperCase()), pangrams:(parsed.pangrams||[]).map(p=>p.toUpperCase()), difficulty:"Intermediate" });
                              }
                            } catch(e) { setError(e.message || "Failed to generate puzzle."); }
                            setLoading(false);
                          };
                          doGenerate();
                        }, 0);
                      }}
                      style={{
                        background:"var(--white)", border:"1.5px solid var(--border-light)",
                        borderRadius:16, padding:"20px 16px", cursor:"pointer",
                        textAlign:"left", transition:"all 0.18s",
                        boxShadow:"var(--shadow-sm)", display:"flex", flexDirection:"column", gap:7,
                      }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--coral)"; e.currentTarget.style.boxShadow="0 4px 18px rgba(232,88,42,0.14)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border-light)"; e.currentTarget.style.boxShadow="var(--shadow-sm)"; e.currentTarget.style.transform="none"; }}
                    >
                      <span style={{ fontSize:"1.6rem", lineHeight:1 }}>{b.icon}</span>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.88rem", color:"var(--ink)" }}>{b.title}</span>
                      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.72rem", color:"var(--muted)", lineHeight:1.4 }}>{b.desc}</span>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:"var(--coral)", letterSpacing:"1px", marginTop:2 }}>PLAY NOW →</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="hero-ornament"><div className="hero-ornament-line" />✦ ✦ ✦<div className="hero-ornament-line" /></div>

              {/* ── Donations ── */}
              <div style={{ textAlign:"center", padding:"36px 0 8px" }}>
                <div className="hero-custom-tag">✦ Support PuzzleNest</div>
                <h2 className="hero-custom-title" style={{ marginBottom:10 }}>Enjoying the puzzles?</h2>
                <p className="hero-custom-body" style={{ marginBottom:24 }}>
                  If PuzzleNest has earned a spot in your routine, consider buying me a tea ☕, a sandwich 🥪, or whatever keeps a puzzle-maker going. Totally optional. Deeply appreciated.
                </p>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, maxWidth:220, margin:"0 auto" }}>
                  {[
                    { label:"☕  PayPal",   color:"#003087", bg:"#EEF4FF", href:"https://paypal.me" },
                    { label:"💸  Cash App", color:"#00A86B", bg:"#E6F8F0", href:"https://cash.app" },
                    { label:"🫰  Venmo",    color:"#3D95CE", bg:"#EAF4FB", href:"https://venmo.com" },
                  ].map(b => (
                    <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
                      style={{
                        display:"block", width:"100%",
                        background:b.bg, color:b.color,
                        border:`1.5px solid ${b.color}22`,
                        borderRadius:999, padding:"8px 20px",
                        fontFamily:"'Inter',sans-serif", fontSize:"0.82rem", fontWeight:700,
                        textDecoration:"none", letterSpacing:"0.2px",
                        transition:"all 0.15s", boxShadow:"var(--shadow-sm)",
                      }}
                      onMouseEnter={e=>{ e.currentTarget.style.background=b.color; e.currentTarget.style.color="white"; e.currentTarget.style.transform="translateY(-1px)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=b.bg; e.currentTarget.style.color=b.color; e.currentTarget.style.transform="none"; }}
                    >{b.label}</a>
                  ))}
                </div>
                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", color:"var(--muted)", marginTop:16, letterSpacing:"0.5px" }}>
                  no pressure · only gratitude
                </p>
              </div>

            </div>
          )}

          {loading && (
            <div className="loading-wrap">
              <div className="typewriter-dots"><span /><span /><span /></div>
              <div className="loading-text">Building your brain challenge…</div>
            </div>
          )}

          {error && (
            <div className="error-box"><h3>Generation Error</h3><p>{error}</p></div>
          )}

          {puzzle && !loading && (
            <div className="puzzle-wrap">
              <div className="puzzle-header">
                <div className="puzzle-type-tag">{puzzle.type}</div>
                <h2 className="puzzle-title">{puzzle.title}</h2>
                <div className="puzzle-meta">{diffEmoji[difficulty]} {difficulty} · {activeTheme !== "Custom" ? activeTheme : customTheme}</div>
              </div>
              {puzzle.type === "Word Search" && <WordSearchPuzzle data={puzzle} difficulty={difficulty} onWin={(t)=>handleWin("Word Search",t)} />}
              {puzzle.type === "Crossword" && <CrosswordPuzzle data={puzzle} onWin={(t)=>handleWin("Crossword",t)} />}
              {puzzle.type === "Sudoku" && <SudokuPuzzle difficulty={difficulty} key={difficulty+Date.now()} onWin={(t)=>handleWin("Sudoku",t)} />}
              {puzzle.type === "Word Scramble" && <WordScramblePuzzle data={puzzle} onWin={(t)=>handleWin("Word Scramble",t)} />}
              {puzzle.type === "Spelling Bee" && <SpellingBeePuzzle data={puzzle} onWin={(t)=>handleWin("Spelling Bee",t)} />}
              {puzzle.type === "Math Sprint" && <MathSprintPuzzle difficulty={difficulty} key={difficulty+Date.now()} onWin={(t)=>handleWin("Math Sprint",t)} />}

              {/* ── How to Play ── */}
              <div style={{ width:"100%", maxWidth:680, marginTop:56 }}>
                <div className="hero-ornament"><div className="hero-ornament-line" />✦ ✦ ✦<div className="hero-ornament-line" /></div>
                <div style={{ textAlign:"center", marginTop:36, marginBottom:28 }}>
                  <div className="puzzle-type-tag">How to Play</div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.4rem,3vw,1.9rem)", fontWeight:900, color:"var(--navy)", marginTop:10, letterSpacing:"-0.3px" }}>
                    {puzzle.type === "Word Search" && "Rules & Instructions"}
                    {puzzle.type === "Crossword" && "Rules & Instructions"}
                    {puzzle.type === "Sudoku" && "Rules & Instructions"}
                    {puzzle.type === "Word Scramble" && "Rules & Instructions"}
                    {puzzle.type === "Spelling Bee" && "Rules & Instructions"}
                    {puzzle.type === "Math Sprint" && "Rules & Instructions"}
                  </h2>
                </div>

                {puzzle.type === "Word Search" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
                    {[
                      { n:"1", title:"Find the words", body:"All the words listed below the grid are hidden somewhere in the letter grid. Words can run horizontally, vertically, or diagonally." },
                      { n:"2", title:"Click and drag", body:"Click on the first letter of a word, hold, drag to the last letter, then release. A correct match highlights the word in coral." },
                      { n:"3", title:"Direction matters", body:"On Intermediate and above, words can run backwards. On Advanced and Extreme, diagonal directions are also added." },
                      { n:"4", title:"Track your progress", body:"Found words are struck through in the word list. The progress bar fills as you find more. Find them all to complete the puzzle." },
                    ].map(r => (
                      <div key={r.n} style={{ background:"var(--white)", border:"1px solid var(--border-light)", borderRadius:14, padding:"20px 20px", boxShadow:"var(--shadow-sm)", display:"flex", gap:14 }}>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:"var(--coral)", lineHeight:1, flexShrink:0 }}>{r.n}</span>
                        <div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.85rem", color:"var(--ink)", marginBottom:5 }}>{r.title}</div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", color:"var(--body)", lineHeight:1.65 }}>{r.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {puzzle.type === "Crossword" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
                    {[
                      { n:"1", title:"Click a square", body:"Click any white square to select it. The current word highlights in pale coral. Click the same square again to toggle between Across and Down." },
                      { n:"2", title:"Type your answer", body:"Just start typing — letters fill into the grid. Backspace removes the last letter. Tab also toggles direction." },
                      { n:"3", title:"Use the clue list", body:"Click any clue in the Across or Down panels to jump directly to that word's starting square." },
                      { n:"4", title:"Check your work", body:"Hit Check Answers to highlight correct entries in green and errors in red. Use Reveal All only if you're truly stuck." },
                    ].map(r => (
                      <div key={r.n} style={{ background:"var(--white)", border:"1px solid var(--border-light)", borderRadius:14, padding:"20px 20px", boxShadow:"var(--shadow-sm)", display:"flex", gap:14 }}>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:"var(--coral)", lineHeight:1, flexShrink:0 }}>{r.n}</span>
                        <div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.85rem", color:"var(--ink)", marginBottom:5 }}>{r.title}</div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", color:"var(--body)", lineHeight:1.65 }}>{r.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {puzzle.type === "Sudoku" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
                    {[
                      { n:"1", title:"One of each", body:"Fill the 9×9 grid so every row, every column, and every 3×3 box contains the digits 1–9 exactly once. No repeats allowed." },
                      { n:"2", title:"Select and enter", body:"Click any empty cell to select it — its row, column, and box highlight to help you spot conflicts. Then tap a number on the pad or type it." },
                      { n:"3", title:"Use the highlights", body:"The coral highlight shows all cells that share a row, column, or box with your selection, making it easier to eliminate candidates." },
                      { n:"4", title:"Check and reveal", body:"Press Check to mark your entries green (correct) or red (wrong). Reset clears your inputs. Reveal Solution shows the completed grid." },
                    ].map(r => (
                      <div key={r.n} style={{ background:"var(--white)", border:"1px solid var(--border-light)", borderRadius:14, padding:"20px 20px", boxShadow:"var(--shadow-sm)", display:"flex", gap:14 }}>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:"var(--coral)", lineHeight:1, flexShrink:0 }}>{r.n}</span>
                        <div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.85rem", color:"var(--ink)", marginBottom:5 }}>{r.title}</div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", color:"var(--body)", lineHeight:1.65 }}>{r.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {puzzle.type === "Word Scramble" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
                    {[
                      { n:"1", title:"Read the clue", body:"Each round shows a definition clue. Use it to figure out the word, then tap the scrambled letter tiles to spell it out in order." },
                      { n:"2", title:"Tap to build", body:"Tap scrambled tiles one at a time to place letters in the answer slots above. Tap a filled slot to remove that letter and try again." },
                      { n:"3", title:"Auto-check", body:"When you place the last letter the answer is checked instantly. Correct words turn teal. Wrong answers shake and reset so you can try again." },
                      { n:"4", title:"Skip if stuck", body:"Hit Skip to move past a word and come back to it later. The word pill row at the top shows your progress across all words in the set." },
                    ].map(r => (
                      <div key={r.n} style={{ background:"var(--white)", border:"1px solid var(--border-light)", borderRadius:14, padding:"20px 20px", boxShadow:"var(--shadow-sm)", display:"flex", gap:14 }}>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:"var(--coral)", lineHeight:1, flexShrink:0 }}>{r.n}</span>
                        <div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.85rem", color:"var(--ink)", marginBottom:5 }}>{r.title}</div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", color:"var(--body)", lineHeight:1.65 }}>{r.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {puzzle.type === "Spelling Bee" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
                    {[
                      { n:"1", title:"Use only the hive letters", body:"You may only use the 7 letters shown in the honeycomb. Letters can be used more than once in a single word." },
                      { n:"2", title:"Center letter is required", body:"Every word you submit must contain the gold center letter. Words that skip it will be rejected." },
                      { n:"3", title:"Minimum 4 letters", body:"Words must be at least 4 letters long. Common short words like 'the' or 'and' don't count." },
                      { n:"4", title:"Score with longer words", body:"4-letter words score 1 point. Longer words score 1 point per letter. Pangrams — words using all 7 letters — earn a 7-point bonus." },
                    ].map(r => (
                      <div key={r.n} style={{ background:"var(--white)", border:"1px solid var(--border-light)", borderRadius:14, padding:"20px 20px", boxShadow:"var(--shadow-sm)", display:"flex", gap:14 }}>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:"var(--coral)", lineHeight:1, flexShrink:0 }}>{r.n}</span>
                        <div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.85rem", color:"var(--ink)", marginBottom:5 }}>{r.title}</div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", color:"var(--body)", lineHeight:1.65 }}>{r.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {puzzle.type === "Math Sprint" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
                    {[
                      { n:"1", title:"Race the clock", body:"Answer as many arithmetic questions as you can before time runs out. The countdown ring turns from green to gold to red as time gets short." },
                      { n:"2", title:"Type or tap your answer", body:"Type the answer with your keyboard or use the on-screen number pad. Press Enter or OK to submit and instantly move to the next question." },
                      { n:"3", title:"Build a streak", body:"Answer consecutive questions correctly to build a streak. A 🔥 badge appears at 3 in a row. Streaks reset on any wrong answer." },
                      { n:"4", title:"Difficulty scales the challenge", body:"Beginner uses + and − to 10. Intermediate adds ×. Advanced and Extreme add ÷ and negative answers with tighter time limits." },
                    ].map(r => (
                      <div key={r.n} style={{ background:"var(--white)", border:"1px solid var(--border-light)", borderRadius:14, padding:"20px 20px", boxShadow:"var(--shadow-sm)", display:"flex", gap:14 }}>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:"var(--coral)", lineHeight:1, flexShrink:0 }}>{r.n}</span>
                        <div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.85rem", color:"var(--ink)", marginBottom:5 }}>{r.title}</div>
                          <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", color:"var(--body)", lineHeight:1.65 }}>{r.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="hero-ornament" style={{ marginTop:44 }}><div className="hero-ornament-line" />✦ ✦ ✦<div className="hero-ornament-line" /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
