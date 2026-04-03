import { useState, useCallback, useRef } from "react";
import { useGame } from "./hooks/useGame";
import { useTheme } from "./hooks/useTheme";
import { saveScore } from "./utils/leaderboard";
import Dashboard from "./components/Dashboard";
import GameBoard from "./components/GameBoard";
import EndScreen from "./components/EndScreen";

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [endData, setEndData] = useState(null);
  const game = useGame();
  const { theme, setTheme, themes } = useTheme();
  const startTimeRef = useRef(null);

  const handleEnd = useCallback(
    (reason, amount) => {
      const elapsedMs = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;
      const totalSec = Math.round(elapsedMs / 1000);
      const timeTaken =
        totalSec >= 60
          ? `${Math.floor(totalSec / 60)}m ${totalSec % 60}s`
          : `${totalSec}s`;

      // history tracks Q1..Q(n-1); add current question result for win/wrong
      const finalHistory =
        reason === "walkaway"
          ? game.history
          : [...game.history, reason === "win" ? "correct" : "wrong"];
      const correct = finalHistory.filter((r) => r === "correct").length;
      const wrong = finalHistory.filter((r) => r === "wrong").length;
      const total = correct + wrong;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      const { top10, rank } = saveScore({
        correctCount: game.correctCount,
        amount,
        accuracy,
        timeTaken,
        reason,
      });

      setEndData({
        reason,
        amount,
        correct,
        wrong,
        accuracy,
        timeTaken,
        leaderboard: top10,
        rank,
      });
      setScreen("end");
      game.reset();
    },
    [game.reset, game.history],
  );

  function startNewGame() {
    game.reset();
    startTimeRef.current = Date.now();
    setScreen("game");
  }

  function handlePlayAgain() {
    setEndData(null);
    setScreen("dashboard");
  }

  return (
    <div className="app">
      {screen === "dashboard" && (
        <Dashboard
          onPlay={startNewGame}
          theme={theme}
          themes={themes}
          onThemeChange={setTheme}
        />
      )}

      {screen === "game" && <GameBoard game={game} onEnd={handleEnd} />}

      {screen === "end" && endData && (
        <EndScreen
          reason={endData.reason}
          amount={endData.amount}
          correct={endData.correct}
          wrong={endData.wrong}
          accuracy={endData.accuracy}
          timeTaken={endData.timeTaken}
          leaderboard={endData.leaderboard}
          rank={endData.rank}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
