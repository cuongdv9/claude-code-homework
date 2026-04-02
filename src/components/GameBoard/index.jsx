import { useEffect } from "react";
import { useTimer } from "../../hooks/useTimer";
import { MONEY_LADDER } from "../../hooks/useGame";
import Header from "./Header";
import QuestionBox from "./QuestionBox";
import AnswerButtons from "./AnswerButtons";
import LifelineOverlay from "./LifelineOverlay";
import Confetti from "../Confetti";

const TIMER_SECONDS = 15;

export default function GameBoard({ game, onEnd }) {
  const {
    questionIndex,
    phase,
    selectedAnswer,
    isCorrect,
    lifelines,
    eliminatedAnswers,
    audienceData,
    phoneData,
    activeLifeline,
    currentQuestion,
    currentAmount,
    correctCount,
    history,
    isLastQuestion,
    selectAnswer,
    confirmAnswer,
    nextQuestion,
    onTimerExpired,
    useFifty,
    useAudience,
    usePhone,
    closeLifeline,
  } = game;

  const timeLeft = useTimer({
    totalSeconds: TIMER_SECONDS,
    active: phase === "answering",
    resetKey: questionIndex,
    onExpire: onTimerExpired,
  });

  // After feedback: auto-advance or end game after delay
  useEffect(() => {
    if (phase !== "feedback") return;
    const delay = setTimeout(() => {
      if (isCorrect && isLastQuestion) {
        onEnd("win", MONEY_LADDER[correctCount]);
      } else if (!isCorrect && !isLastQuestion) {
        nextQuestion();
      } else if (!isCorrect && isLastQuestion) {
        onEnd("wrong", currentAmount);
      }
      // correct + not last: wait for user to tap Continue
    }, 1500);
    return () => clearTimeout(delay);
  }, [phase, isCorrect, isLastQuestion]);

  function handleWalkAway() {
    onEnd("walkaway", currentAmount);
  }

  return (
    <div className="gameboard">
      {phase === "feedback" && isCorrect && <Confetti />}
      <Header
        questionIndex={questionIndex}
        history={history}
        currentAmount={currentAmount}
        lifelines={lifelines}
        timeLeft={timeLeft}
        totalTime={TIMER_SECONDS}
        onUseFifty={useFifty}
        onUseAudience={useAudience}
        onUsePhone={usePhone}
      />

      <div className="gameboard-body">
        <QuestionBox
          question={currentQuestion.question}
          questionIndex={questionIndex}
        />

        <AnswerButtons
          answers={currentQuestion.answers}
          correct={currentQuestion.correct}
          selectedAnswer={selectedAnswer}
          phase={phase}
          eliminatedAnswers={eliminatedAnswers}
          onSelect={selectAnswer}
        />

        {phase === "answering" && selectedAnswer && (
          <button className="btn-confirm" onClick={confirmAnswer}>
            FINAL ANSWER
          </button>
        )}

        {phase === "feedback" && isCorrect && !isLastQuestion && (
          <button className="btn-confirm" onClick={nextQuestion}>
            CONTINUE →
          </button>
        )}

        {phase === "answering" && (
          <button className="btn-walkaway" onClick={handleWalkAway}>
            Walk Away
          </button>
        )}
      </div>

      <LifelineOverlay
        activeLifeline={activeLifeline}
        answers={currentQuestion.answers}
        audienceData={audienceData}
        phoneData={phoneData}
        onClose={closeLifeline}
      />
    </div>
  );
}
