# QuizMillionaire — Concept

A minimalist, high-tension mobile web quiz app: 15 randomly selected questions, 3 lifelines, a 15-second timer, and real-time online multiplayer.

---

## 1. Game Modes

### Solo

- Play 15 questions from a pool of 45 (reshuffled each game).
- End screen shows prize, stats, and leaderboard.

### Online Multiplayer

- Two players connect via WebSocket through a 4-character room code.
- The server picks **the same 15 questions** for both players — fair competition.
- Both play simultaneously on their own devices.
- A live opponent panel shows the opponent's current prize and question number.
- When both finish, a comparison screen declares the winner (by correctCount, then accuracy as tiebreaker).

---

## 2. Game Mechanics

- **Timer:** 15 seconds per question. Expiry reveals the correct answer briefly, then auto-skips (no game over).
- **Wrong Answer:** Shows correct answer for 1.5s, continues to next question — no game over except on Q15.
- **Walk Away:** Player exits at any time, keeps total reward from correct answers so far.
- **Game Over:** Only when Q15 is answered wrong or timer expires on Q15.

**Reward System:** Based solely on `correctCount` — wrong answers never increase it.
Money ladder: $100 → $200 → $300 → $500 → $1,000 → $2,000 → $4,000 → $8,000 → $16,000 → $32,000 → $64,000 → $125,000 → $250,000 → $500,000 → $1,000,000.

**Lifelines** (once per game):

- **50/50** — Removes 2 wrong answers; preserves correct answer and selected answer (if any).
- **Ask the Audience** — Bar chart; correct answer gets 50–74%.
- **Phone a Friend** — Expert opinion with confidence %; 85% chance correct.

**Final Answer:** Tap to highlight (orange) → tap again or press "FINAL ANSWER" to confirm.

---

## 3. Mobile UI Design

| Area       | Contents                                                                   |
| ---------- | -------------------------------------------------------------------------- |
| **Header** | Progress bar (15 segments), current reward, lifeline icons, circular timer |
| **Center** | Question box                                                               |
| **Bottom** | Answers A–D (min 44×44px)                                                  |

**Progress bar:** Dim = not reached · Green = correct · Red = wrong · Gold = current

**Answer feedback:**

- Correct: green flash + chime arpeggio + confetti from bottom corners
- Incorrect: red flash + shake + buzzer → auto-skips after 1.5s

**Dashboard:** Logo (pulse animation) · 4 theme swatches · START GAME · 🌐 ONLINE

**Online Multiplayer lobby:**

- Create Room → 4-char code displayed, waiting animation
- Join Room → enter code → both players start simultaneously
- Error shown if server is not running

**Opponent panel (during online game):** compact strip showing opponent's live amount, question number, and ✓ Done when they finish.

**End Screen:** Prize amount · ✓/✗ counts · accuracy % · time taken · Top 10 leaderboard
**Multiplayer Result:** Side-by-side cards · winner gets gold border + "WINNER 🏆" badge · confetti

**Themes:** Classic (blue) · Midnight (indigo) · Forest (green) · Crimson (red) — persisted in localStorage.
