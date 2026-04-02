import { MONEY_LADDER, SAFE_HAVEN_INDICES } from '../hooks/useGame'

export default function Dashboard({ onPlay, hasSavedGame, onResume }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">QuizMillionaire</h1>
        <p className="dashboard-desc">
          Answer 15 questions to win <span className="gold">$1,000,000</span>
        </p>
      </div>

      <div className="money-ladder">
        {[...MONEY_LADDER].reverse().map((amount, i) => {
          const index = MONEY_LADDER.length - 1 - i
          const isSafe = SAFE_HAVEN_INDICES.includes(index)
          return (
            <div key={index} className={`ladder-row ${isSafe ? 'safe-haven' : ''}`}>
              <span className="ladder-num">{index + 1}</span>
              <span className="ladder-amount">{amount}</span>
              {isSafe && <span className="safe-tag">SAFE</span>}
            </div>
          )
        })}
      </div>

      <div className="dashboard-actions">
        {hasSavedGame && (
          <button className="btn-secondary" onClick={onResume}>
            RESUME GAME
          </button>
        )}
        <button className="btn-primary" onClick={onPlay}>
          {hasSavedGame ? 'NEW GAME' : 'START GAME'}
        </button>
      </div>
    </div>
  )
}
