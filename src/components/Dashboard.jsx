export default function Dashboard({ onPlay, hasSavedGame, onResume }) {
  return (
    <div className="dashboard">
      <div className="splash-logo">
        <div className="splash-title">Quiz</div>
        <div className="splash-subtitle">MILLIONAIRE</div>
        <div className="splash-divider" />
        <div className="splash-tagline">Who wants to be a millionaire?</div>
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
