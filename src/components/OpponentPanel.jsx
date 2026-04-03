export default function OpponentPanel({ opponent }) {
  if (!opponent) return null;
  return (
    <div className="opponent-panel">
      <span className="opponent-label">Opponent</span>
      <span className="opponent-amount gold">{opponent.amount}</span>
      <span className="opponent-q">Q{(opponent.questionIndex ?? 0) + 1}</span>
      {opponent.finished && <span className="opponent-done">✓ Done</span>}
    </div>
  );
}
