import { useState, useCallback, useRef } from "react";
import { useGame } from "./hooks/useGame";
import { useTheme } from "./hooks/useTheme";
import { saveScore } from "./utils/leaderboard";
import Dashboard from "./components/Dashboard";
import GameBoard from "./components/GameBoard";
import EndScreen from "./components/EndScreen";
import HandoffScreen from "./components/HandoffScreen";
import MultiplayerResult from "./components/MultiplayerResult";

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [endData, setEndData] = useState(null);
  const [mpData, setMpData] = useState(null); // { p1: result } during MP
  const game = useGame();
  const { theme, setTheme, themes } = useTheme();
  const startTimeRef = useRef(null);
  const isMpRef = useRef(false); // true when in multiplayer mode

  const buildResult = useCallback(
    (reason, amount) => {
      const elapsedMs = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;
      const totalSec = Math.round(elapsedMs / 1000);
      const timeTaken =
        totalSec >= 60
          ? `${Math.floor(totalSec / 60)}m ${totalSec % 60}s`
          : `${totalSec}s`;
      const finalHistory =
        reason === "walkaway"
          ? game.history
          : [...game.history, reason === "win" ? "correct" : "wrong"];
      const correct = finalHistory.filter((r) => r === "correct").length;
      const wrong = finalHistory.filter((r) => r === "wrong").length;
      const total = correct + wrong;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      return {
        reason,
        amount,
        correct,
        wrong,
        accuracy,
        timeTaken,
        correctCount: game.correctCount,
      };
    },
    [game.history, game.correctCount],
  );

  const handleEnd = useCallback(
    (reason, amount) => {
      const result = buildResult(reason, amount);

      if (isMpRef.current) {
        // Multiplayer flow
        if (!mpData) {
          // P1 just finished → go to handoff
          game.reset();
          setMpData({ p1: result });
          setScreen("handoff");
        } else {
          // P2 just finished → show final comparison
          const p1 = mpData.p1;
          isMpRef.current = false;
          game.reset();
          setMpData({ p1, p2: result });
          setScreen("mp-result");
        }
      } else {
        // Single-player flow
        const { top10, rank } = saveScore({
          correctCount: result.correctCount,
          amount,
          accuracy: result.accuracy,
          timeTaken: result.timeTaken,
          reason,
        });
        setEndData({ ...result, leaderboard: top10, rank });
        setScreen("end");
        game.reset();
      }
    },
    [buildResult, game.reset, mpData],
  );

  function startGame() {
    isMpRef.current = false;
    game.reset();
    startTimeRef.current = Date.now();
    setScreen("game");
  }

  function startMultiplayer() {
    isMpRef.current = true;
    setMpData(null);
    game.reset();
    startTimeRef.current = Date.now();
    setScreen("game");
  }

  function startP2() {
    game.reset();
    startTimeRef.current = Date.now();
    setScreen("game");
  }

  function backToDashboard() {
    isMpRef.current = false;
    setEndData(null);
    setMpData(null);
    setScreen("dashboard");
  }

  return (
    <div className="app">
      {screen === "dashboard" && (
        <Dashboard
          onPlay={startGame}
          onMultiplayer={startMultiplayer}
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
          onPlayAgain={backToDashboard}
        />
      )}

      {screen === "handoff" && mpData?.p1 && (
        <HandoffScreen p1Result={mpData.p1} onReady={startP2} />
      )}

      {screen === "mp-result" && mpData?.p1 && mpData?.p2 && (
        <MultiplayerResult
          p1={mpData.p1}
          p2={mpData.p2}
          onPlayAgain={backToDashboard}
        />
      )}
    </div>
  );
}
