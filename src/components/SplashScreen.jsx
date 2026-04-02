export default function SplashScreen({ onContinue }) {
  return (
    <div className="splash">
      <div className="splash-logo">
        <div className="splash-title">Quiz</div>
        <div className="splash-subtitle">MILLIONAIRE</div>
        <div className="splash-divider" />
        <div className="splash-tagline">Who wants to be a millionaire?</div>
      </div>
      <button className="btn-primary splash-btn" onClick={onContinue}>
        PLAY NOW
      </button>
    </div>
  )
}
