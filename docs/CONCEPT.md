# QuizMillionaire — Concept

A minimalist, high-tension mobile web app played in short bursts: 15 increasingly difficult questions and 3 lifelines.

---

## 1. Game Mechanics & Structure

- **Progressive Ladder:** 15 questions increasing in difficulty.
- **Timer:** 15 seconds per question. When time runs out, the correct answer is briefly revealed then the game auto-skips to the next question.
- **Wrong Answer:** Shows the correct answer briefly, then skips to the next question — no game over, no penalty.
- **Walk Away:** Player can exit at any time and keep the current question's prize amount.
- **Game Over:** Only occurs when the player answers Q15 incorrectly or the timer expires on Q15.

**Lifelines** (once per game):
- **50/50** — Removes two wrong answers.
- **Ask the Audience** — Shows a bar chart (e.g., 60% A, 20% B, 10% C, 10% D).
- **Phone a Friend** — Displays a randomized "expert" opinion (e.g., "I'm 90% sure it's C").

**Final Answer:** Two-step selection — tap to highlight, tap again to confirm (or tap the "FINAL ANSWER" button). Prevents accidental taps.

---

## 2. Mobile UI Design

Built for one-handed play, prioritizing readability and quick feedback.

| Area | Contents |
|------|----------|
| **Header** | Progress bar (15 segments), current level (e.g., "$500,000"), lifeline icons (gray out when used), circular timer |
| **Center** | Question box (large, readable font) |
| **Bottom** | Answers A–D in vertical layout, large tappable buttons with gradient-blue TV-show theme |

**Answer Feedback:**
- **Selected:** Orange highlight
- **Correct:** Green + chime sound
- **Incorrect:** Red + buzzer sound, highlights the correct answer → auto-skips after 1.5s

**Progress Bar:** 15 segments above the header — dim (unanswered), blue (answered), gold (current question).

---

## 3. Technical Stack

- **Framework:** React.js with Vite.
- **Styling:** CSS custom properties, Flexbox/Grid; no scrolling required.
- **State:** `useReducer` hook as central game state machine.
- **Offline:** Service Worker / PWA support.

**Question data structure:**
```json
{
  "id": 1,
  "question": "What is the capital of France?",
  "answers": ["London", "Berlin", "Paris", "Madrid"],
  "correct": "Paris"
}
```

---

## 4. User Journey

1. **Splash Screen** — Logo with pulse animation.
2. **Dashboard** — Money ladder preview, "Start Game" / "Resume Game" buttons.
3. **Gameplay** — Question → Selection → Confirmation → Feedback → Next Question.
4. **End Screen:**
   - Wrong on Q15 / timeout on Q15: "You go home with $0".
   - Walk Away: "You are walking away with [Amount]".
   - $1M Win: Confetti animation.

---

## 5. Monetization

- **Ad-Supported:** Interstitial ads between games or banner ads at the bottom.
- **Rewarded Ads:** Watch a 15-second video to earn an extra lifeline.

---

## 6. Development Priorities

- **Mobile-First:** Buttons minimum 44×44px.
- **Fast Loading:** Minimal CSS, SVG logos, optimized for mobile data.
- **State Persistence:** LocalStorage saves and restores game progress automatically.
