import { useState, useCallback } from "react";
import { useGame } from "./hooks/useGame";
import { useTheme } from "./hooks/useTheme";
import Dashboard from "./components/Dashboard";
import GameBoard from "./components/GameBoard";
import EndScreen from "./components/EndScreen";

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [endData, setEndData] = useState(null);
  const game = useGame();
  const { theme, setTheme, themes } = useTheme();

  const handleEnd = useCallback(
    (reason, amount) => {
      // history tracks Q1..Q(n-1); add current question result for win/wrong
      const finalHistory =
        reason === "walkaway"
          ? game.history
          : [...game.history, reason === "win" ? "correct" : "wrong"];
      const correct = finalHistory.filter((r) => r === "correct").length;
      const wrong = finalHistory.filter((r) => r === "wrong").length;
      setEndData({ reason, amount, correct, wrong });
      setScreen("end");
      game.reset();
    },
    [game.reset, game.history],
  );

  function startNewGame() {
    game.reset();
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
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
