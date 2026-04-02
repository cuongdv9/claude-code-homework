const LABELS = ['A', 'B', 'C', 'D']

function AudienceChart({ answers, audienceData }) {
  return (
    <div className="overlay-content">
      <h3 className="overlay-title">Ask the Audience</h3>
      <div className="audience-bars">
        {answers.map((answer, i) => (
          <div key={answer} className="bar-row">
            <span className="bar-label">{LABELS[i]}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${audienceData[i]}%` }}
              />
            </div>
            <span className="bar-pct">{audienceData[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PhoneFriend({ phoneData }) {
  return (
    <div className="overlay-content">
      <h3 className="overlay-title">Phone a Friend</h3>
      <div className="phone-message">
        <div className="phone-avatar">👤</div>
        <p className="phone-text">
          "I'm <strong>{phoneData.confidence}% sure</strong> the answer is{' '}
          <strong className="gold">"{phoneData.answer}"</strong>"
        </p>
      </div>
    </div>
  )
}

export default function LifelineOverlay({ activeLifeline, answers, audienceData, phoneData, onClose }) {
  if (!activeLifeline) return null

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-card" onClick={e => e.stopPropagation()}>
        {activeLifeline === 'audience' && (
          <AudienceChart answers={answers} audienceData={audienceData} />
        )}
        {activeLifeline === 'phone' && <PhoneFriend phoneData={phoneData} />}
        <button className="btn-secondary overlay-close" onClick={onClose}>
          CLOSE
        </button>
      </div>
    </div>
  )
}
