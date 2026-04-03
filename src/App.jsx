import { useState, useCallback, useRef, useEffect } from "react";
import { useGame } from "./hooks/useGame";
import { useTheme } from "./hooks/useTheme";
import { useMultiplayer } from "./hooks/useMultiplayer";
import { saveScore } from "./utils/leaderboard";
import Dashboard from "./components/Dashboard";
import GameBoard from "./components/GameBoard";
import EndScreen from "./components/EndScreen";
import HandoffScreen from "./components/HandoffScreen";
import MultiplayerResult from "./components/MultiplayerResult";
import MultiplayerLobby from "./components/MultiplayerLobby";

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [endData, setEndData] = useState(null);
  const [mpData, setMpData] = useState(null);
  const game = useGame();
  const mp = useMultiplayer();
  const { theme, setTheme, themes } = useTheme();
  const startTimeRef = useRef(null);
  const modeRef = useRef("solo"); // "solo" | "local" | "online"

  // When server sends questions, load them into the game and start playing
  useEffect(() => {
    if (mp.status === "playing" && mp.questions) {
      game.loadQuestions(mp.questions);
      startTimeRef.current = Date.now();
      setScreen("game");
    }
  }, [mp.status, mp.questions]);

  // Send live updates to opponent during online game
  useEffect(() => {
    if (modeRef.current !== "online" || screen !== "game") return;
    mp.sendUpdate({
      correctCount: game.correctCount,
      amount: game.currentAmount,
      questionIndex: game.questionIndex,
    });
  }, [game.correctCount, game.questionIndex]);

  // When both online players finish, show final result
  useEffect(() => {
    if (mp.status === "finished" && mp.finalResult) {
      setScreen("mp-result");
      setMpData({ p1: mp.finalResult.p1, p2: mp.finalResult.p2 });
    }
  }, [mp.status, mp.finalResult]);

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
      const mode = modeRef.current;

      game.reset();

      if (mode === "online") {
        mp.sendGameOver(result);
        // Show waiting screen until both players finish (mp.status → 'finishing')
        setScreen("mp-waiting");
      } else if (mode === "local") {
        if (!mpData) {
          // P1 done → handoff
          setMpData({ p1: result });
          setScreen("handoff");
        } else {
          // P2 done → result
          setMpData((d) => ({ ...d, p2: result }));
          modeRef.current = "solo";
          setScreen("mp-result");
        }
      } else {
        // Solo
        const { top10, rank } = saveScore({
          correctCount: result.correctCount,
          amount,
          accuracy: result.accuracy,
          timeTaken: result.timeTaken,
          reason,
        });
        setEndData({ ...result, leaderboard: top10, rank });
        setScreen("end");
      }
    },
    [buildResult, game.reset, mpData, mp.sendGameOver],
  );

  // ── Starters ──────────────────────────────────────────
  function startSolo() {
    modeRef.current = "solo";
    setMpData(null);
    game.reset();
    startTimeRef.current = Date.now();
    setScreen("game");
  }

  function startLocalMP() {
    modeRef.current = "local";
    setMpData(null);
    game.reset();
    startTimeRef.current = Date.now();
    setScreen("game");
  }

  function startP2Local() {
    game.reset();
    startTimeRef.current = Date.now();
    setScreen("game");
  }

  function openOnlineLobby() {
    modeRef.current = "online";
    mp.reset();
    setScreen("mp-lobby");
  }

  function backToDashboard() {
    modeRef.current = "solo";
    setEndData(null);
    setMpData(null);
    mp.reset();
    setScreen("dashboard");
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="app">
      {screen === "dashboard" && (
        <Dashboard
          onPlay={startSolo}
          onLocalMP={startLocalMP}
          onOnlineMP={openOnlineLobby}
          theme={theme}
          themes={themes}
          onThemeChange={setTheme}
        />
      )}

      {screen === "mp-lobby" && (
        <MultiplayerLobby
          status={mp.status}
          roomCode={mp.roomCode}
          error={mp.error}
          onCreate={mp.createRoom}
          onJoin={mp.joinRoom}
          onBack={backToDashboard}
        />
      )}

      {screen === "game" && (
        <GameBoard
          game={game}
          onEnd={handleEnd}
          opponent={modeRef.current === "online" ? mp.opponent : null}
        />
      )}

      {screen === "mp-waiting" && (
        <div className="lobby-screen">
          <div className="lobby-content">
            <div className="lobby-title">You finished!</div>
            <div className="lobby-waiting">
              <span className="lobby-dot" />
              <span className="lobby-dot" />
              <span className="lobby-dot" />
              Waiting for opponent…
            </div>
          </div>
        </div>
      )}

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
        <HandoffScreen p1Result={mpData.p1} onReady={startP2Local} />
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
