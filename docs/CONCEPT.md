# QuizMillionaire — Concept

A minimalist, high-tension mobile web app played in short bursts: 15 increasingly difficult questions, lifelines, and a dramatic "safe haven" money structure.

---

## 1. Game Mechanics & Structure

- **Progressive Ladder:** 15 questions increasing in difficulty.
- **Safe Havens:** Questions 5 ($1,000) and 10 ($32,000).
- **Timer:** 30 seconds per question (can be disabled in settings for casual play).

**Lifelines** (once per game):
- **50/50** — Removes two wrong answers.
- **Ask the Audience** — Shows a bar chart (e.g., 60% A, 20% B, 10% C, 10% D).
- **Phone a Friend** — Displays a randomized "expert" opinion (e.g., "I'm 90% sure it's C").

**Final Answer:** Two-step selection — tap to highlight, tap again to confirm (prevents accidental taps).

---

## 2. Mobile UI Design

Built for one-handed play, prioritizing readability and quick feedback.

| Area | Contents |
|------|----------|
| **Header** | Current level (e.g., "$500,000"), lifeline icons (gray out when used), circular timer |
| **Center** | Question box (large, readable font) |
| **Bottom** | Answers A–D in vertical layout, large tappable buttons with gradient-blue TV-show theme |

**Answer Feedback:**
- **Selected:** Orange
- **Correct:** Green + chime sound
- **Incorrect:** Red + buzzer sound, highlights the correct answer

---

## 3. Technical Stack

- **Framework:** React.js or Vue.js for reactive UI updates.
- **Responsiveness:** CSS Flexbox/Grid; no scrolling required.
- **Offline:** Service Worker / PWA support.

**Question data structure:**
```json
{
  "id": 1,
  "money": "100",
  "question": "What is the capital of France?",
  "answers": ["London", "Berlin", "Paris", "Madrid"],
  "correct": "Paris"
}
```

---

## 4. User Journey

1. **Splash Screen** — Logo with subtle background animation.
2. **Dashboard** — "Start New Game" and "View High Scores" buttons.
3. **Gameplay** — Question → Selection → Confirmation → Feedback → Next Level.
4. **Game Over / Win:**
   - Incorrect: "You won [Amount]" screen.
   - Walk Away: "You are walking away with [Amount]" screen.
   - $1M Win: Confetti animation.

---

## 5. Monetization

- **Ad-Supported:** Interstitial ads between games or banner ads at the bottom.
- **Rewarded Ads:** Watch a 15-second video to earn an extra lifeline.

---

## 6. Development Priorities

- **Mobile-First:** Buttons minimum 44×44px.
- **Fast Loading:** Minimal CSS, SVG logos, optimized for mobile data.
- **State Persistence:** LocalStorage to save game progress if the app is closed.
