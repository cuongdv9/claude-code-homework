import { useEffect, useRef } from "react";
import Confetti from "./Confetti";

export default function EndScreen({ reason, amount, onPlayAgain }) {
  const isWin = reason === "win";
  const isWalkaway = reason === "walkaway";

  const title = isWin
    ? "🏆 YOU ARE A MILLIONAIRE!"
    : isWalkaway
      ? "You walked away..."
      : "Game Over";

  const message = isWin
    ? "Congratulations! You answered all 15 questions!"
    : isWalkaway
      ? `You chose to walk away safely.`
      : `You gave the wrong answer.`;

  return (
    <div className={`end-screen ${isWin ? "end-win" : ""}`}>
      {isWin && <Confetti />}

      <div className="end-content">
        <div className="end-title">{title}</div>
        <div className="end-message">{message}</div>
        <div className="end-amount-label">
          {isWin
            ? "You won"
            : isWalkaway
              ? "You leave with"
              : "You go home with"}
        </div>
        <div className="end-amount gold">{amount}</div>

        <button className="btn-primary end-btn" onClick={onPlayAgain}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
