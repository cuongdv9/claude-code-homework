import { SAFE_HAVEN_INDICES, MONEY_LADDER } from '../../hooks/useGame'

const TOTAL = MONEY_LADDER.length

function ProgressBar({ questionIndex }) {
  return (
    <div className="progress-bar-wrap" aria-label={`Question ${questionIndex + 1} of ${TOTAL}`}>
      {MONEY_LADDER.map((_, i) => {
        const done = i < questionIndex
        const current = i === questionIndex
        const safe = SAFE_HAVEN_INDICES.includes(i)
        return (
          <div
            key={i}
            className={`progress-seg ${done ? 'done' : ''} ${current ? 'current' : ''} ${safe ? 'safe' : ''}`}
          />
        )
      })}
    </div>
  )
}

const TIMER_SIZE = 56
const RADIUS = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function TimerRing({ timeLeft, total }) {
  const progress = timeLeft / total
  const offset = CIRCUMFERENCE * (1 - progress)
  const isUrgent = timeLeft <= 10

  return (
    <svg className={`timer-ring ${isUrgent ? 'urgent' : ''}`} width={TIMER_SIZE} height={TIMER_SIZE}>
      <circle cx={TIMER_SIZE / 2} cy={TIMER_SIZE / 2} r={RADIUS} className="timer-track" />
      <circle
        cx={TIMER_SIZE / 2}
        cy={TIMER_SIZE / 2}
        r={RADIUS}
        className="timer-progress"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="timer-text">
        {timeLeft}
      </text>
    </svg>
  )
}

export default function Header({
  questionIndex,
  currentAmount,
  lifelines,
  timeLeft,
  totalTime,
  onUseFifty,
  onUseAudience,
  onUsePhone,
}) {
  const isSafe = SAFE_HAVEN_INDICES.includes(questionIndex)

  return (
    <div className="header-wrap">
    <ProgressBar questionIndex={questionIndex} />
    <div className="header">
      <div className={`level-badge ${isSafe ? 'safe-haven-badge' : ''}`}>
        <span className="level-num">Q{questionIndex + 1}</span>
        <span className="level-amount">{currentAmount}</span>
        {isSafe && <span className="safe-indicator">⭐ SAFE HAVEN</span>}
      </div>

      <div className="lifelines">
        <button
          className={`lifeline-btn ${!lifelines.fifty ? 'used' : ''}`}
          onClick={onUseFifty}
          disabled={!lifelines.fifty}
          title="50:50"
        >
          50:50
        </button>
        <button
          className={`lifeline-btn ${!lifelines.audience ? 'used' : ''}`}
          onClick={onUseAudience}
          disabled={!lifelines.audience}
          title="Ask the Audience"
        >
          👥
        </button>
        <button
          className={`lifeline-btn ${!lifelines.phone ? 'used' : ''}`}
          onClick={onUsePhone}
          disabled={!lifelines.phone}
          title="Phone a Friend"
        >
          📞
        </button>
      </div>

      <TimerRing timeLeft={timeLeft} total={totalTime} />
    </div>
    </div>
  )
}
