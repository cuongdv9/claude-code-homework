import { useEffect, useRef } from 'react'

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${Math.random() * 1.5 + 2}s`,
    color: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#f87171', '#a78bfa'][i % 6],
    size: Math.random() * 8 + 5,
    rotate: Math.random() * 360,
  }))

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            '--rotate': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}

export default function EndScreen({ reason, amount, onPlayAgain }) {
  const isWin = reason === 'win'
  const isWalkaway = reason === 'walkaway'

  const title = isWin
    ? '🏆 YOU ARE A MILLIONAIRE!'
    : isWalkaway
    ? 'You walked away...'
    : 'Game Over'

  const message = isWin
    ? 'Congratulations! You answered all 15 questions!'
    : isWalkaway
    ? `You chose to walk away safely.`
    : `You gave the wrong answer.`

  return (
    <div className={`end-screen ${isWin ? 'end-win' : ''}`}>
      {isWin && <Confetti />}

      <div className="end-content">
        <div className="end-title">{title}</div>
        <div className="end-message">{message}</div>
        <div className="end-amount-label">
          {isWin ? 'You won' : isWalkaway ? 'You leave with' : 'You go home with'}
        </div>
        <div className="end-amount gold">{amount}</div>

        <button className="btn-primary end-btn" onClick={onPlayAgain}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  )
}
