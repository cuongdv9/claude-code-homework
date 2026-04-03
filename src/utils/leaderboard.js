const STORAGE_KEY = "quizMillionaire_leaderboard";

export function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// Returns updated top-10 board and the rank of the new entry (1-based), or null if not in top 10
export function saveScore({
  correctCount,
  amount,
  accuracy,
  timeTaken,
  reason,
}) {
  const entry = {
    correctCount,
    amount,
    accuracy,
    timeTaken,
    reason,
    date: Date.now(),
  };
  const board = loadLeaderboard();
  board.push(entry);
  board.sort(
    (a, b) => b.correctCount - a.correctCount || b.accuracy - a.accuracy,
  );
  const top10 = board.slice(0, 10);
  const rank = top10.findIndex((e) => e.date === entry.date);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
  } catch {}
  return { top10, rank: rank === -1 ? null : rank + 1 };
}
