export default function Dashboard({ onPlay, hasSavedGame, onResume }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">QuizMillionaire</h1>
        <p className="dashboard-desc">
          Answer 15 questions to win <span className="gold">$1,000,000</span>
        </p>
      </div>

      <div className="dashboard-actions">
        {hasSavedGame && (
          <button className="btn-secondary" onClick={onResume}>
            RESUME GAME
          </button>
        )}
        <button className="btn-primary" onClick={onPlay}>
          {hasSavedGame ? "NEW GAME" : "START GAME"}
        </button>
      </div>
    </div>
  );
}
