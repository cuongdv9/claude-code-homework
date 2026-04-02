# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QuizMillionaire** — A minimalist mobile web quiz app inspired by "Who Wants to Be a Millionaire". 15 randomly selected questions per game, 3 lifelines (50/50, Ask the Audience, Phone a Friend), a 15-second timer, and a stats-rich end screen.

## Tech Stack

- **Framework:** React.js with Vite
- **Styling:** CSS custom properties, `data-theme` on `<html>`, Flexbox/Grid, mobile-first
- **Storage:** localStorage for game state persistence
- **Audio:** Web Audio API (synthesized tones — no audio files)
- **Background:** Static SVG (`public/bg.svg`) via CSS `background-image`

## Project Structure

```
/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── bg.svg                 # Studio set background image
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Start screen (logo, themes, START GAME)
│   │   ├── GameBoard/
│   │   │   ├── index.jsx      # Main game loop, timer, sounds
│   │   │   ├── Header.jsx     # Progress bar, reward, lifelines, timer ring
│   │   │   ├── QuestionBox.jsx
│   │   │   ├── AnswerButtons.jsx
│   │   │   └── LifelineOverlay.jsx
│   │   ├── EndScreen.jsx      # Win / Game Over / Walk Away + stats
│   │   └── Confetti.jsx       # Physics canvas confetti
│   ├── data/
│   │   └── questions.json     # 45 questions (id, question, answers, correct)
│   ├── hooks/
│   │   ├── useGame.js         # useReducer state machine
│   │   ├── useTimer.js        # Countdown timer
│   │   └── useTheme.js        # Theme selection + persistence
│   ├── utils/
│   │   └── audio.js           # Web Audio API helpers
│   └── App.jsx
└── package.json
```

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build
npm test           # Run tests (Vitest)
npm run lint       # Lint source files
```

## Developer Rules

### UI / UX

- All interactive elements must be **minimum 44×44px** for touch targets.
- Layout must work in a single screen — **no vertical scrolling** during gameplay.
- Use the two-step answer flow: tap to highlight (orange), tap again to confirm. Never skip confirmation.
- Gray out lifeline icons immediately after use; do not hide them.
- Dashboard is centered (logo + theme swatches + START GAME button); no Resume Game.

### Game Logic

- **Timer is 15 seconds per question.** Expiry counts as wrong — correct answer is shown briefly, then game continues to next question.
- **Wrong answers do not end the game** (except on Q15). Game always continues.
- **Reward tracks `correctCount` only** — `currentAmount = MONEY_LADDER[correctCount - 1]` or `$0`. Wrong answers never increase it.
- Lifelines are **once per game** — enforced in state, not just UI.
- Always highlight the correct answer when the player answers incorrectly.
- 50/50 removes 2 wrong answers while always preserving the correct answer and the player's currently selected answer (if any).

### Data

- Questions must follow this schema exactly:
  ```json
  {
    "id": 1,
    "question": "...",
    "answers": ["A", "B", "C", "D"],
    "correct": 2
  }
  ```
- `correct` is a **0-based index** into `answers` (not a string value).
- Validated on load: `typeof correct === "number"` and `correct >= 0 && correct < answers.length`.
- Pool of 45 questions; 15 are picked randomly each game.

### State & Storage

- Persist game state to localStorage so a closed app can resume mid-game.
- Clear saved state on game over, walk away, or win (`game.reset()`).
- Discard saved state if it has no `questions` array (stale format) — call `makeInitialState()` instead.
- Wrap `localStorage.setItem` in try/catch — quota errors must not crash the game.

### End Screen Stats

- Show: total prize amount, correct count, wrong count, accuracy %, time taken.
- `accuracy = Math.round(correct / (correct + wrong) * 100)` — 0% if no answers yet.
- `timeTaken` measured from `startNewGame()` to `handleEnd()` in App.jsx.

### Performance

- Keep CSS minimal; use CSS custom properties for theming.
- Use SVG for all logos and icons — no raster images for UI elements.
- Web Audio API only — no audio file downloads.

### Monetization

- Ad placements: interstitial between games, optional banner at dashboard bottom.
- Rewarded ad grants exactly one extra lifeline — implement as a clearly distinct flow, not mixed into normal lifeline logic.
