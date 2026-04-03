import { useState, useRef, useCallback } from "react";

// Vite proxies /ws → ws://localhost:8080 in dev
// window.location.host includes port (e.g. "localhost:5173")
const WS_URL = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`;

export function useMultiplayer() {
  const [status, setStatus] = useState("idle"); // idle | connecting | waiting | playing | finishing | finished
  const [roomCode, setRoomCode] = useState(null);
  const [opponent, setOpponent] = useState(null); // live opponent state
  const [questions, setQuestions] = useState(null); // server-provided questions
  const [finalResult, setFinalResult] = useState(null); // { p1, p2 }
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  const reset = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("idle");
    setRoomCode(null);
    setOpponent(null);
    setQuestions(null);
    setFinalResult(null);
    setError(null);
  }, []);

  const openSocket = useCallback((onOpen) => {
    setStatus("connecting");
    setError(null);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => onOpen(ws);

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "room-created") {
        setRoomCode(msg.code);
        setStatus("waiting");
      }
      if (msg.type === "game-start") {
        setQuestions(msg.questions);
        setOpponent({
          correctCount: 0,
          amount: "$0",
          questionIndex: 0,
          finished: false,
        });
        setStatus("playing");
      }
      if (msg.type === "opponent-update") {
        setOpponent((prev) => ({ ...prev, ...msg, finished: false }));
      }
      if (msg.type === "opponent-finished") {
        setOpponent((prev) => ({ ...prev, ...msg.result, finished: true }));
      }
      if (msg.type === "final-result") {
        setFinalResult({ p1: msg.p1, p2: msg.p2 });
        setStatus("finished");
      }
      if (msg.type === "opponent-disconnected") {
        setError("Opponent disconnected");
        setStatus("idle");
      }
      if (msg.type === "error") {
        setError(msg.message);
        setStatus("idle");
      }
    };

    ws.onerror = () => {
      setError("Cannot connect to server. Run: npm run server");
      setStatus("idle");
    };

    ws.onclose = () => {
      setStatus((s) => (s === "finished" ? s : "idle"));
    };
  }, []);

  const createRoom = useCallback(() => {
    openSocket((ws) => ws.send(JSON.stringify({ type: "create-room" })));
  }, [openSocket]);

  const joinRoom = useCallback(
    (code) => {
      openSocket((ws) => ws.send(JSON.stringify({ type: "join-room", code })));
    },
    [openSocket],
  );

  const sendUpdate = useCallback((data) => {
    wsRef.current?.send(JSON.stringify({ type: "update", data }));
  }, []);

  const sendGameOver = useCallback((result) => {
    setStatus("finishing");
    wsRef.current?.send(JSON.stringify({ type: "game-over", result }));
  }, []);

  return {
    status,
    roomCode,
    opponent,
    questions,
    finalResult,
    error,
    createRoom,
    joinRoom,
    sendUpdate,
    sendGameOver,
    reset,
  };
}
