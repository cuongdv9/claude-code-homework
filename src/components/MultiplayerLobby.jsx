import { useState } from "react";

export default function MultiplayerLobby({
  status,
  roomCode,
  error,
  onCreate,
  onJoin,
  onBack,
}) {
  const [code, setCode] = useState("");
  const [view, setView] = useState("menu"); // menu | join

  if (status === "waiting") {
    return (
      <div className="lobby-screen">
        <div className="lobby-content">
          <div className="lobby-title">Room Created</div>
          <div className="lobby-label">Share this code with your opponent</div>
          <div className="lobby-code">{roomCode}</div>
          <div className="lobby-waiting">
            <span className="lobby-dot" />
            <span className="lobby-dot" />
            <span className="lobby-dot" />
            Waiting for opponent…
          </div>
          <button className="btn-secondary lobby-back" onClick={onBack}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="lobby-screen">
        <div className="lobby-content">
          <div className="lobby-title">Connecting…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lobby-screen">
      <div className="lobby-content">
        <div className="lobby-title">Online Multiplayer</div>

        {error && <div className="lobby-error">{error}</div>}

        {view === "menu" && (
          <>
            <button className="btn-primary" onClick={onCreate}>
              🏠 Create Room
            </button>
            <button className="btn-secondary" onClick={() => setView("join")}>
              🔗 Join Room
            </button>
            <button className="btn-secondary lobby-back" onClick={onBack}>
              ← Back
            </button>
          </>
        )}

        {view === "join" && (
          <>
            <div className="lobby-label">Enter room code</div>
            <input
              className="lobby-input"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().slice(0, 4))
              }
              placeholder="XXXX"
              maxLength={4}
              autoFocus
            />
            <button
              className="btn-primary"
              onClick={() => onJoin(code)}
              disabled={code.length < 4}
            >
              Join
            </button>
            <button
              className="btn-secondary lobby-back"
              onClick={() => setView("menu")}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
