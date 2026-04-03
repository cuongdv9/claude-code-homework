# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QuizMillionaire** — A minimalist mobile web quiz app inspired by "Who Wants to Be a Millionaire". Solo play or real-time online multiplayer. 15 randomly selected questions per game, 3 lifelines, 15-second timer, stats-rich end screen, and leaderboard.

## Tech Stack

- **Framework:** React.js with Vite
- **Styling:** CSS custom properties, `data-theme` on `<html>`, Flexbox/Grid, mobile-first
- **Storage:** localStorage for game state and leaderboard
- **Audio:** Web Audio API (synthesized tones — no audio files)
- **Background:** `public/bg.svg` via CSS `background-image`
- **Multiplayer:** Node.js WebSocket server (`ws` package) — `server.js` in project root; Vite proxies `/ws` → `:8080`

## Project Structure

```
/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── bg.svg                    # Studio set background
├── server.js                     # WebSocket server (npm run server)
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx         # START GAME + 🌐 ONLINE buttons, theme swatches
│   │   ├── GameBoard/
│   │   │   ├── index.jsx         # Main game loop, timer, sounds, opponent panel
│   │   │   ├── Header.jsx        # Progress bar, reward, lifelines, timer ring
│   │   │   ├── QuestionBox.jsx
│   │   │   ├── AnswerButtons.jsx
│   │   │   └── LifelineOverlay.jsx
│   │   ├── OpponentPanel.jsx     # Live opponent strip (online mode only)
│   │   ├── MultiplayerLobby.jsx  # Create/join room UI + waiting screen
│   │   ├── MultiplayerResult.jsx # Side-by-side comparison + winner
│   │   ├── EndScreen.jsx         # Win / Game Over / Walk Away + stats + leaderboard
│   │   ├── Leaderboard.jsx       # Top 10 display component
│   │   └── Confetti.jsx          # Physics canvas confetti
│   ├── data/
│   │   └── questions.json        # 45 questions (id, question, answers, correct)
│   ├── hooks/
│   │   ├── useGame.js            # useReducer state machine + LOAD_QUESTIONS action
│   │   ├── useTimer.js           # Countdown timer
│   │   ├── useTheme.js           # Theme selection + localStorage persistence
│   │   └── useMultiplayer.js     # WebSocket client hook
│   ├── utils/
│   │   ├── audio.js              # Web Audio API: playCorrect, playWrong, playTick
│   │   └── leaderboard.js        # localStorage top-10 save/load
│   └── App.jsx                   # Screen router + solo/online mode logic
└── package.json
```

## Commands

```bash
npm install        # Install dependencies
npm run server     # Start WebSocket server on :8080
npm run dev        # Start Vite dev server on :5173
npm run build      # Production build
npm test           # Run tests (Vitest)
npm run lint       # Lint source files
```

> For online multiplayer: run **both** `npm run server` and `npm run dev` in separate terminals.

## Developer Rules

### UI / UX

- All interactive elements must be **minimum 44×44px** for touch targets.
- Layout must work in a single screen — **no vertical scrolling** during gameplay.
- Two-step answer flow: tap to highlight (orange), tap again to confirm. Never skip confirmation.
- Gray out lifeline icons immediately after use; do not hide them.
- Dashboard: logo + theme swatches + START GAME + 🌐 ONLINE, all centered.

### Game Logic

- **Timer is 15 seconds per question.** Expiry = wrong answer; correct answer shown briefly; game continues.
- **Wrong answers do not end the game** (except on Q15).
- **Reward = `MONEY_LADDER[correctCount - 1]`** (or `$0`). Wrong answers never increase `correctCount`.
- Lifelines are **once per game** — enforced in state, not just UI.
- 50/50 removes 2 wrong answers; always preserves the correct answer and the currently selected answer (if any).

### Multiplayer

- Server (`server.js`) manages rooms; picks the same 15 questions for both players in a room.
- Client uses `useMultiplayer` hook — do not manage WebSocket state in components directly.
- `LOAD_QUESTIONS` action in `useGame` injects server questions, overriding the random local pick.
- `isOnlineRef` in App.jsx tracks whether current game is online; used to gate `sendUpdate` calls and opponent panel rendering.
- WS URL: `${protocol}://${window.location.host}/ws` — Vite proxies this to `:8080`.

### Data

- Questions schema:
  ```json
  { "id": 1, "question": "...", "answers": ["A", "B", "C", "D"], "correct": 2 }
  ```
- `correct` is a **0-based index** into `answers`. Validated on load.
- Pool of 45 questions; 15 picked randomly per game (or from server in online mode).

### State & Storage

- Game state persisted to localStorage; discarded if `questions` array is missing (stale format).
- Wrap `localStorage.setItem` in try/catch — quota errors must not crash the game.
- Leaderboard stored separately under `quizMillionaire_leaderboard`; top 10 by correctCount then accuracy.

### End Screen Stats

- `accuracy = Math.round(correct / (correct + wrong) * 100)` — 0% if no answers.
- `timeTaken` measured from game start to `handleEnd()` call in App.jsx.

### Performance

- CSS custom properties for theming — no large stylesheet rewrites per theme.
- Web Audio API only — no audio file downloads.
- SVG for all icons and background.

### Monetization

- Interstitial ads between games; optional banner at dashboard bottom.
- Rewarded ad grants one extra lifeline — distinct flow, not mixed into normal lifeline logic.
