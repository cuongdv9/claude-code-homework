# QuizMillionaire — Concept

A minimalist, high-tension mobile web app played in short bursts: 15 randomly selected questions, 3 lifelines, and a 15-second timer per question.

---

## 1. Game Mechanics & Structure

- **Progressive Ladder:** 15 questions drawn randomly from a pool of 45. Questions are reshuffled every new game.
- **Timer:** 15 seconds per question. Expiry reveals the correct answer briefly, then auto-skips to the next question (no game over).
- **Wrong Answer:** Shows the correct answer for 1.5s, then continues to the next question — no game over, no penalty except losing that question's reward.
- **Walk Away:** Player can exit at any time and keep the total reward earned from correct answers so far.
- **Game Over:** Only when the player answers Q15 incorrectly or the timer expires on Q15.

**Reward System:**

- Reward is based solely on `correctCount` — wrong answers do not increase it.
- Money ladder: $100 → $200 → $300 → $500 → $1,000 → $2,000 → $4,000 → $8,000 → $16,000 → $32,000 → $64,000 → $125,000 → $250,000 → $500,000 → $1,000,000.

**Lifelines** (once per game):

- **50/50** — Removes two wrong answers, always preserving the correct answer and the player's currently selected answer (if any).
- **Ask the Audience** — Bar chart of audience vote percentages; correct answer receives 50–74%.
- **Phone a Friend** — Randomized expert opinion with confidence %. 85% chance of being correct.

**Final Answer:** Two-step — tap to highlight (orange), tap again or press "FINAL ANSWER" to confirm.

---

## 2. Mobile UI Design

Built for one-handed play, prioritizing readability and quick feedback.

| Area       | Contents                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| **Header** | Progress bar (15 segments), current reward, lifeline icons (grayed when used), circular countdown timer |
| **Center** | Question box                                                                                            |
| **Bottom** | Answers A–D, large tappable buttons (min 44×44px)                                                       |

**Progress Bar segments:**

- Dim = not yet reached
- Green = correctly answered
- Red = wrong answer (game continued)
- Gold = current question

**Answer Feedback:**

- **Selected:** Orange highlight
- **Correct:** Green flash + ascending chime arpeggio + confetti burst from both bottom corners
- **Incorrect:** Red flash + shake animation + descending buzzer, correct answer highlighted → auto-skips after 1.5s

**Dashboard (Start Screen):**

- Centered layout: logo with pulse animation, 4 theme swatches, "START GAME" button
- No "Resume Game" — each session starts fresh

**End Screen shows:**

- Title (Win / Game Over / Walked Away)
- Total prize amount earned
- ✓ N correct · ✗ N wrong · N% accuracy · ⏱ time taken

**Themes:** 4 selectable via colored swatches, persisted in localStorage:

- Classic (blue) · Midnight (indigo) · Forest (green) · Crimson (red)

---

## 3. Technical Stack

- **Framework:** React.js with Vite
- **Styling:** CSS custom properties + `data-theme` on `<html>` for theming; Flexbox/Grid
- **State:** `useReducer` central game state machine, persisted to localStorage
- **Audio:** Web Audio API — synthesized tones only, no audio files
- **Background:** Static SVG (`public/bg.svg`) — Millionaire studio set scene (spotlights, audience, hot seat), applied via CSS `background-image`

**Question data structure:**

```json
{
  "id": 1,
  "question": "What is the capital of France?",
  "answers": ["London", "Berlin", "Paris", "Madrid"],
  "correct": 2
}
```

- `correct` is a **0-based index** into `answers`. Validated on load (`typeof correct === "number"` and in bounds).

**State shape (key fields):**

```js
{
  questions: Question[],        // 15 shuffled for this game
  questionIndex: number,        // 0–14
  correctCount: number,         // increments only on correct answers
  history: ('correct'|'wrong')[],
  phase: 'answering'|'feedback',
  selectedAnswer: string|null,
  isCorrect: boolean|null,
  lifelines: { fifty, audience, phone },
}
```

---

## 4. User Journey

1. **Dashboard** — Centered logo, theme swatches, "START GAME" button.
2. **Gameplay** — Question → Selection → Confirmation → Feedback (1.5s) → Next Question (or End).
3. **End Screen:**
   - Wrong on Q15 / timeout on Q15: total earned from correct answers + stats.
   - Walk Away: total earned so far + stats.
   - Win ($1M): confetti + trophy + stats.
   - Stats: correct count, wrong count, accuracy %, time taken.

---

## 5. Monetization

- **Ad-Supported:** Interstitial ads between games; optional banner at dashboard bottom.
- **Rewarded Ads:** Watch a video to earn one extra lifeline — distinct flow from normal lifelines.

---

## 6. Development Priorities

- **Mobile-First:** Buttons minimum 44×44px; single screen, no scrolling during gameplay.
- **Fast Loading:** Minimal CSS, Web Audio API (no audio file downloads), SVG background.
- **State Persistence:** localStorage auto-saves; stale saves without `questions` array are discarded on load.
- **Question Bank:** 45 questions; 15 picked per game via array shuffle + slice.
