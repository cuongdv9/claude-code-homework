export default function Dashboard({
  onPlay,
  hasSavedGame,
  onResume,
  theme,
  themes,
  onThemeChange,
}) {
  return (
    <div className="dashboard">
      <div className="splash-logo">
        <div className="splash-title">Quiz</div>
        <div className="splash-subtitle">MILLIONAIRE</div>
        <div className="splash-divider" />
        <div className="splash-tagline">Who wants to be a millionaire?</div>
      </div>

      <div className="theme-picker">
        {themes.map((t) => (
          <button
            key={t.id}
            className={`theme-swatch ${theme === t.id ? "active" : ""}`}
            style={{ "--swatch-color": t.color }}
            onClick={() => onThemeChange(t.id)}
            title={t.label}
          />
        ))}
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
