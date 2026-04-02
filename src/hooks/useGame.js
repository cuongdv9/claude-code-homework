import { useReducer, useCallback, useEffect } from "react";
import questions from "../data/questions.json";

export const MONEY_LADDER = [
  "$100",
  "$200",
  "$300",
  "$500",
  "$1,000",
  "$2,000",
  "$4,000",
  "$8,000",
  "$16,000",
  "$32,000",
  "$64,000",
  "$125,000",
  "$250,000",
  "$500,000",
  "$1,000,000",
];

const INITIAL_STATE = {
  questionIndex: 0,
  correctCount: 0,
  history: [], // 'correct' | 'wrong' per answered question
  phase: "answering", // 'answering' | 'feedback'
  selectedAnswer: null,
  isCorrect: null,
  timedOut: false,
  lifelines: { fifty: true, audience: true, phone: true },
  eliminatedAnswers: [],
  audienceData: null,
  phoneData: null,
  activeLifeline: null, // 'audience' | 'phone' | null
};

function generateAudienceData(answers, correct) {
  const correctPct = Math.floor(Math.random() * 25) + 50;
  const remaining = 100 - correctPct;
  const wrongAnswers = answers.filter((a) => a !== correct);
  const splits = splitRandomly(remaining, wrongAnswers.length);
  return answers.map((a) => {
    if (a === correct) return correctPct;
    return splits[wrongAnswers.indexOf(a)];
  });
}

function splitRandomly(total, count) {
  const parts = Array(count).fill(0);
  for (let i = 0; i < total; i++) parts[Math.floor(Math.random() * count)]++;
  return parts.sort((a, b) => b - a);
}

function generatePhoneData(answers, correct) {
  const isRight = Math.random() < 0.85;
  const answer = isRight ? correct : answers.filter((a) => a !== correct)[0];
  const confidence = isRight
    ? Math.floor(Math.random() * 20) + 75
    : Math.floor(Math.random() * 30) + 40;
  return { answer, confidence };
}

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_ANSWER":
      if (state.phase !== "answering") return state;
      return { ...state, selectedAnswer: action.answer };

    case "CONFIRM_ANSWER": {
      if (state.phase !== "answering" || !state.selectedAnswer) return state;
      const q = questions[state.questionIndex];
      return {
        ...state,
        phase: "feedback",
        isCorrect: state.selectedAnswer === q.correct,
      };
    }

    case "TIMER_EXPIRED":
      if (state.phase !== "answering") return state;
      return { ...state, phase: "feedback", isCorrect: false, timedOut: true };

    case "NEXT_QUESTION":
      return {
        ...INITIAL_STATE,
        questionIndex: state.questionIndex + 1,
        correctCount: state.isCorrect
          ? state.correctCount + 1
          : state.correctCount,
        history: [...state.history, state.isCorrect ? "correct" : "wrong"],
        lifelines: state.lifelines,
      };

    case "USE_FIFTY": {
      if (!state.lifelines.fifty || state.phase !== "answering") return state;
      const q = questions[state.questionIndex];
      const wrong = q.answers.filter(
        (a) => a !== q.correct && a !== state.selectedAnswer,
      );
      const toRemove = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
      return {
        ...state,
        lifelines: { ...state.lifelines, fifty: false },
        eliminatedAnswers: toRemove,
      };
    }

    case "USE_AUDIENCE": {
      if (!state.lifelines.audience || state.phase !== "answering")
        return state;
      const q = questions[state.questionIndex];
      return {
        ...state,
        lifelines: { ...state.lifelines, audience: false },
        audienceData: generateAudienceData(q.answers, q.correct),
        activeLifeline: "audience",
      };
    }

    case "USE_PHONE": {
      if (!state.lifelines.phone || state.phase !== "answering") return state;
      const q = questions[state.questionIndex];
      return {
        ...state,
        lifelines: { ...state.lifelines, phone: false },
        phoneData: generatePhoneData(q.answers, q.correct),
        activeLifeline: "phone",
      };
    }

    case "CLOSE_LIFELINE":
      return { ...state, activeLifeline: null };

    case "RESET":
      return INITIAL_STATE;

    default:
      return state;
  }
}

const STORAGE_KEY = "quizMillionaire_state";

function loadSaved() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(
    reducer,
    null,
    () => loadSaved() || INITIAL_STATE,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentQuestion = questions[state.questionIndex];
  const currentAmount =
    state.correctCount === 0 ? "$0" : MONEY_LADDER[state.correctCount - 1];
  const isLastQuestion = state.questionIndex === questions.length - 1;

  const selectAnswer = useCallback(
    (answer) => {
      if (state.selectedAnswer === answer) {
        dispatch({ type: "CONFIRM_ANSWER" });
      } else {
        dispatch({ type: "SELECT_ANSWER", answer });
      }
    },
    [state.selectedAnswer],
  );

  const confirmAnswer = useCallback(
    () => dispatch({ type: "CONFIRM_ANSWER" }),
    [],
  );
  const nextQuestion = useCallback(
    () => dispatch({ type: "NEXT_QUESTION" }),
    [],
  );
  const onTimerExpired = useCallback(
    () => dispatch({ type: "TIMER_EXPIRED" }),
    [],
  );
  const useFifty = useCallback(() => dispatch({ type: "USE_FIFTY" }), []);
  const useAudience = useCallback(() => dispatch({ type: "USE_AUDIENCE" }), []);
  const usePhone = useCallback(() => dispatch({ type: "USE_PHONE" }), []);
  const closeLifeline = useCallback(
    () => dispatch({ type: "CLOSE_LIFELINE" }),
    [],
  );
  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESET" });
  }, []);

  return {
    ...state,
    currentQuestion,
    currentAmount,
    isLastQuestion,
    selectAnswer,
    confirmAnswer,
    nextQuestion,
    onTimerExpired,
    useFifty,
    useAudience,
    usePhone,
    closeLifeline,
    reset,
  };
}
