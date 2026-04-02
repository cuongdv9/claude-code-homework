# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QuizMillionaire** — A minimalist mobile web quiz app inspired by "Who Wants to Be a Millionaire". 15 progressive questions, 3 lifelines (50/50, Ask the Audience, Phone a Friend), safe havens at Q5 and Q10, a 30-second timer, and PWA/offline support.

## Tech Stack

- **Framework:** React.js (preferred) or Vue.js
- **Styling:** CSS Flexbox/Grid, mobile-first
- **Storage:** LocalStorage for game state persistence
- **PWA:** Service Worker for offline capability

## Project Structure

```
/
├── public/
│   ├── index.html
│   └── manifest.json          # PWA manifest
├── src/
│   ├── assets/                # SVG logos, sounds (chime, buzzer)
│   ├── components/
│   │   ├── SplashScreen/
│   │   ├── Dashboard/
│   │   ├── GameBoard/
│   │   │   ├── Header/        # Level display, lifeline icons, timer
│   │   │   ├── QuestionBox/
│   │   │   └── AnswerButtons/ # A/B/C/D vertical layout
│   │   ├── Lifelines/         # 50/50, AskAudience, PhoneFriend
│   │   └── EndScreen/         # Win / Game Over / Walk Away
│   ├── data/
│   │   └── questions.json     # Question bank (id, money, question, answers, correct)
│   ├── hooks/                 # Game logic hooks (useGame, useTimer, useLifeline)
│   ├── utils/                 # LocalStorage helpers, audio helpers
│   └── App.jsx
├── service-worker.js
└── package.json
```

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build
npm test           # Run tests
npm run lint       # Lint source files
```

## Developer Rules

### UI / UX
- All interactive elements must be **minimum 44×44px** for touch targets.
- Layout must work in a single screen — **no vertical scrolling** during gameplay.
- Use the two-step answer flow: tap to highlight (orange), tap again to confirm. Never skip confirmation.
- Gray out lifeline icons immediately after use; do not hide them.

### Game Logic
- Safe havens are Q5 and Q10 only. Never award safe-haven amounts for any other question.
- Lifelines are **once per game** — enforce this in state, not just UI.
- Timer is 30 seconds per question. Expiry counts as an incorrect answer.
- Always highlight the correct answer when the player answers incorrectly.

### Data
- Questions must follow this schema exactly:
  ```json
  {
    "id": 1,
    "money": "100",
    "question": "...",
    "answers": ["A", "B", "C", "D"],
    "correct": "Paris"
  }
  ```
- `correct` must be a value that exists in `answers`.

### State & Storage
- Persist game state to LocalStorage so a closed app can resume.
- Clear saved state on game over, walk away, or win.

### Performance
- Keep CSS minimal; prefer utility classes over large stylesheets.
- Use SVG for all logos and icons — no raster images for UI elements.
- Optimize any audio assets for fast load over mobile data.

### Monetization
- Ad placements: interstitial between games, optional banner at dashboard bottom.
- Rewarded ad grants exactly one extra lifeline — implement as a clearly distinct flow, not mixed into normal lifeline logic.
