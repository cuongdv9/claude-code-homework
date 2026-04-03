export default function HandoffScreen({ p1Result, onReady }) {
  return (
    <div className="handoff-screen">
      <div className="handoff-content">
        <div className="handoff-badge">Player 1</div>
        <div className="handoff-label">finished with</div>
        <div className="handoff-amount gold">{p1Result.amount}</div>
        <div className="handoff-stats">
          <span className="end-stat correct">✓ {p1Result.correct}</span>
          <span className="end-stat wrong">✗ {p1Result.wrong}</span>
          <span className="end-stat accuracy">{p1Result.accuracy}%</span>
          <span className="end-stat time">⏱ {p1Result.timeTaken}</span>
        </div>
        <div className="handoff-divider" />
        <div className="handoff-cta">Pass the device to Player 2</div>
        <button className="btn-primary handoff-btn" onClick={onReady}>
          PLAYER 2 — START
        </button>
      </div>
    </div>
  );
}
