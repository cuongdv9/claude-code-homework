import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame, MONEY_LADDER } from './useGame'

// Clear localStorage before each test
beforeEach(() => localStorage.clear())

describe('useGame — initial state', () => {
  it('starts at question 0', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.questionIndex).toBe(0)
  })

  it('starts in answering phase', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.phase).toBe('answering')
  })

  it('starts with all lifelines available', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.lifelines).toEqual({ fifty: true, audience: true, phone: true })
  })
})

describe('useGame — answer selection', () => {
  it('highlights answer on first tap', () => {
    const { result } = renderHook(() => useGame())
    const answer = result.current.currentQuestion.answers[0]
    act(() => result.current.selectAnswer(answer))
    expect(result.current.selectedAnswer).toBe(answer)
    expect(result.current.phase).toBe('answering')
  })

  it('confirms answer on second tap of same answer', () => {
    const { result } = renderHook(() => useGame())
    const answer = result.current.currentQuestion.answers[0]
    act(() => result.current.selectAnswer(answer))
    act(() => result.current.selectAnswer(answer))
    expect(result.current.phase).toBe('feedback')
  })

  it('changes selection when tapping a different answer', () => {
    const { result } = renderHook(() => useGame())
    const [a, b] = result.current.currentQuestion.answers
    act(() => result.current.selectAnswer(a))
    act(() => result.current.selectAnswer(b))
    expect(result.current.selectedAnswer).toBe(b)
    expect(result.current.phase).toBe('answering')
  })
})

describe('useGame — feedback phase', () => {
  it('sets isCorrect true for right answer', () => {
    const { result } = renderHook(() => useGame())
    const correct = result.current.currentQuestion.correct
    act(() => result.current.selectAnswer(correct))
    act(() => result.current.confirmAnswer())
    expect(result.current.isCorrect).toBe(true)
  })

  it('sets isCorrect false for wrong answer', () => {
    const { result } = renderHook(() => useGame())
    const wrong = result.current.currentQuestion.answers.find(
      a => a !== result.current.currentQuestion.correct
    )
    act(() => result.current.selectAnswer(wrong))
    act(() => result.current.confirmAnswer())
    expect(result.current.isCorrect).toBe(false)
  })
})

describe('useGame — progression', () => {
  it('advances to next question', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.nextQuestion())
    expect(result.current.questionIndex).toBe(1)
  })

  it('preserves lifelines across questions', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.useFifty())
    act(() => result.current.nextQuestion())
    expect(result.current.lifelines.fifty).toBe(false)
    expect(result.current.lifelines.audience).toBe(true)
  })

  it('resets selection and phase on next question', () => {
    const { result } = renderHook(() => useGame())
    const answer = result.current.currentQuestion.answers[0]
    act(() => result.current.selectAnswer(answer))
    act(() => result.current.nextQuestion())
    expect(result.current.selectedAnswer).toBeNull()
    expect(result.current.phase).toBe('answering')
  })
})

describe('useGame — lifelines', () => {
  it('50/50 removes exactly 2 wrong answers', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.useFifty())
    expect(result.current.eliminatedAnswers).toHaveLength(2)
    result.current.eliminatedAnswers.forEach(a => {
      expect(a).not.toBe(result.current.currentQuestion.correct)
    })
  })

  it('50/50 cannot be used twice', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.useFifty())
    act(() => result.current.useFifty())
    expect(result.current.lifelines.fifty).toBe(false)
    expect(result.current.eliminatedAnswers).toHaveLength(2)
  })

  it('audience data has 4 percentages summing to 100', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.useAudience())
    const total = result.current.audienceData.reduce((s, n) => s + n, 0)
    expect(result.current.audienceData).toHaveLength(4)
    expect(total).toBe(100)
  })

  it('phone data has an answer and confidence', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.usePhone())
    expect(result.current.phoneData.answer).toBeTruthy()
    expect(result.current.phoneData.confidence).toBeGreaterThan(0)
  })
})

describe('useGame — timer expiry', () => {
  it('enters feedback with isCorrect false on timeout', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.onTimerExpired())
    expect(result.current.phase).toBe('feedback')
    expect(result.current.isCorrect).toBe(false)
  })
})

describe('useGame — money ladder', () => {
  it('has 15 prize levels', () => {
    expect(MONEY_LADDER).toHaveLength(15)
  })

  it('currentAmount matches questionIndex', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.currentAmount).toBe(MONEY_LADDER[0])
    act(() => result.current.nextQuestion())
    expect(result.current.currentAmount).toBe(MONEY_LADDER[1])
  })

  it('isLastQuestion is true at index 14', () => {
    const { result } = renderHook(() => useGame())
    for (let i = 0; i < 14; i++) act(() => result.current.nextQuestion())
    expect(result.current.isLastQuestion).toBe(true)
  })
})

describe('useGame — reset', () => {
  it('resets all state to initial', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.nextQuestion())
    act(() => result.current.useFifty())
    act(() => result.current.reset())
    expect(result.current.questionIndex).toBe(0)
    expect(result.current.lifelines).toEqual({ fifty: true, audience: true, phone: true })
  })
})
