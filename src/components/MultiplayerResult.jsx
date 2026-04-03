import Confetti from "./Confetti";

function PlayerCard({ label, result, isWinner }) {
  return (
    <div className={`mp-card ${isWinner ? "mp-card--winner" : ""}`}>
      {isWinner && <div className="mp-winner-badge">WINNER 🏆</div>}
      <div className="mp-player-label">{label}</div>
      <div className="mp-amount gold">{result.amount}</div>
      <div className="mp-stats">
        <div className="end-stat correct">✓ {result.correct}</div>
        <div className="end-stat wrong">✗ {result.wrong}</div>
        <div className="end-stat accuracy">{result.accuracy}%</div>
        <div className="end-stat time">⏱ {result.timeTaken}</div>
      </div>
    </div>
  );
}

export default function MultiplayerResult({ p1, p2, onPlayAgain }) {
  const tie =
    p1.correctCount === p2.correctCount && p1.accuracy === p2.accuracy;
  const p1Wins =
    !tie &&
    (p1.correctCount > p2.correctCount ||
      (p1.correctCount === p2.correctCount && p1.accuracy > p2.accuracy));
  const p2Wins = !tie && !p1Wins;

  return (
    <div className="mp-result-screen">
      {(p1Wins || p2Wins) && <Confetti />}

      <div className="mp-result-content">
        <div className="mp-title">
          {tie
            ? "It's a Tie! 🤝"
            : p1Wins
              ? "Player 1 Wins! 🏆"
              : "Player 2 Wins! 🏆"}
        </div>

        <div className="mp-cards">
          <PlayerCard label="Player 1" result={p1} isWinner={p1Wins} />
          <PlayerCard label="Player 2" result={p2} isWinner={p2Wins} />
        </div>

        <button className="btn-primary mp-btn" onClick={onPlayAgain}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
