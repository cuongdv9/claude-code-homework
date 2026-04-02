const LABELS = ['A', 'B', 'C', 'D']

export default function AnswerButtons({
  answers,
  correct,
  selectedAnswer,
  phase,
  eliminatedAnswers,
  onSelect,
}) {
  function getState(answer) {
    const isEliminated = eliminatedAnswers.includes(answer)
    if (isEliminated) return 'eliminated'
    if (phase === 'feedback') {
      if (answer === correct) return 'correct'
      if (answer === selectedAnswer) return 'wrong'
      return 'idle'
    }
    if (answer === selectedAnswer) return 'selected'
    return 'idle'
  }

  return (
    <div className="answer-grid">
      {answers.map((answer, i) => {
        const state = getState(answer)
        const isEliminated = state === 'eliminated'
        return (
          <button
            key={answer}
            className={`answer-btn answer-${state}`}
            onClick={() => !isEliminated && phase === 'answering' && onSelect(answer)}
            disabled={isEliminated || phase === 'feedback'}
          >
            <span className="answer-label">{LABELS[i]}</span>
            <span className="answer-text">{answer}</span>
          </button>
        )
      })}
    </div>
  )
}
