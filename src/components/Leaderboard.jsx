const ICONS = { win: "🏆", walkaway: "🚶", wrong: "💀" };
const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ entries, currentRank }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">Top 10</div>
      <ol className="leaderboard-list">
        {entries.map((e, i) => {
          const isCurrentGame = currentRank === i + 1;
          return (
            <li
              key={e.date}
              className={`lb-row ${isCurrentGame ? "lb-row--current" : ""}`}
            >
              <span className="lb-rank">{MEDALS[i] ?? `#${i + 1}`}</span>
              <span className="lb-icon">{ICONS[e.reason] ?? "❓"}</span>
              <span className="lb-amount">{e.amount}</span>
              <span className="lb-meta">
                {e.accuracy}% · {e.timeTaken}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
