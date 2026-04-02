# QuizMillionaire — Concept

A minimalist, high-tension mobile web app played in short bursts: 15 randomly selected questions, 3 lifelines, and a 15-second timer per question.

---

## 1. Game Mechanics & Structure

- **Progressive Ladder:** 15 questions drawn randomly from a pool of 45. Questions are shuffled each game.
- **Timer:** 15 seconds per question. When time runs out, the correct answer is briefly revealed, then the game auto-skips to the next question (no game over).
- **Wrong Answer:** Shows the correct answer briefly, then skips to the next question — no game over, no penalty except losing that question's reward.
- **Walk Away:** Player can exit at any time and keep the total reward earned from correct answers so far.
- **Game Over:** Only occurs when the player answers Q15 incorrectly or the timer expires on Q15.

**Reward System:**

- `currentAmount` reflects only correctly answered questions — wrong answers do not increase the reward.
- Rewards follow the money ladder: $100, $200, $300, $500, $1,000, $2,000, $4,000, $8,000, $16,000, $32,000, $64,000, $125,000, $250,000, $500,000, $1,000,000.

**Lifelines** (once per game):

- **50/50** — Removes two wrong answers, always preserving the correct answer and the currently selected answer (if any).
- **Ask the Audience** — Shows a bar chart of audience vote percentages (e.g., 60% A, 20% B, 10% C, 10% D). The correct answer receives 50–74%.
- **Phone a Friend** — Displays a randomized "expert" opinion with a confidence percentage. 85% chance of being correct.

**Final Answer:** Two-step selection — tap to highlight (orange), tap again to confirm (or tap the "FINAL ANSWER" button). Prevents accidental taps.

---

## 2. Mobile UI Design

Built for one-handed play, prioritizing readability and quick feedback.

| Area       | Contents                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Header** | Progress bar (15 segments — green = correct, red = wrong, gold = current), current reward amount, lifeline icons (gray out when used), circular countdown timer |
| **Center** | Question box (large, readable font)                                                                                                                             |
| **Bottom** | Answers A–D in vertical layout, large tappable buttons (min 44×44px) with gradient-blue TV-show theme                                                           |

**Answer Feedback:**

- **Selected:** Orange highlight
- **Correct:** Green flash + ascending chime arpeggio + confetti burst from bottom corners
- **Incorrect:** Red flash + shake animation + descending buzzer sound, highlights the correct answer → auto-skips after 1.5s

**Progress Bar:** 15 segments above the header:

- Dim = not yet reached
- Green = correctly answered
- Red = wrong answer (game continued)
- Gold = current question

**Themes:** 4 selectable color themes on the dashboard (Classic blue, Midnight indigo, Forest green, Crimson red), persisted in localStorage.

---

## 3. Technical Stack

- **Framework:** React.js with Vite.
- **Styling:** CSS custom properties with `data-theme` attribute for theming; Flexbox/Grid; no scrolling during gameplay.
- **State:** `useReducer` hook as central game state machine; persisted to localStorage.
- **Audio:** Web Audio API — synthesized tones (no audio files required).
- **Background:** SVG scene of the Millionaire studio set (spotlights, audience, hot seat).

**Question data structure:**

```json
{
  "id": 1,
  "question": "What is the capital of France?",
  "answers": ["London", "Berlin", "Paris", "Madrid"],
  "correct": "Paris"
}
```

`correct` must be a value that exists in `answers`. Validated on load.

**State shape (key fields):**

```js
{
  questions: Question[],   // 15 shuffled questions for this game
  questionIndex: number,   // current question (0–14)
  correctCount: number,    // number of correct answers so far
  history: ('correct'|'wrong')[],  // per-question result
  phase: 'answering'|'feedback',
  selectedAnswer: string|null,
  isCorrect: boolean|null,
  lifelines: { fifty, audience, phone },
}
```

---

## 4. User Journey

1. **Dashboard** — Logo with pulse animation, theme swatches, "START GAME" button.
2. **Gameplay** — Question → Selection → Confirmation → Feedback → Next Question (or End).
3. **End Screen:**
   - Wrong on Q15 / timeout on Q15: shows total earned from correct answers.
   - Walk Away: shows total earned so far.
   - Win ($1M): confetti + trophy.
   - Displays correct/wrong answer counts.

---

## 5. Monetization

- **Ad-Supported:** Interstitial ads between games or banner ads at the dashboard bottom.
- **Rewarded Ads:** Watch a 15-second video to earn an extra lifeline (distinct flow from normal lifelines).

---

## 6. Development Priorities

- **Mobile-First:** Buttons minimum 44×44px; no vertical scrolling during gameplay.
- **Fast Loading:** Minimal CSS, SVG assets, Web Audio API (no audio file downloads).
- **State Persistence:** localStorage saves and restores game progress; stale saves without `questions` array are discarded.
- **Question Bank:** 45 questions total; 15 randomly shuffled per game using Fisher-Yates.
