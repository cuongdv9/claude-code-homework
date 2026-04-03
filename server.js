import { WebSocketServer } from "ws";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const allQuestions = JSON.parse(
  readFileSync(join(__dirname, "src/data/questions.json"), "utf8"),
);

const PORT = 8080;
const rooms = new Map(); // code → { p1, p2, questions, results }

function pickQuestions() {
  return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 15);
}

function makeCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function send(ws, msg) {
  if (ws?.readyState === 1) ws.send(JSON.stringify(msg));
}

function broadcast(room, msg) {
  send(room.p1, msg);
  send(room.p2, msg);
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  ws.roomCode = null;
  ws.playerNum = null;

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    if (msg.type === "create-room") {
      const code = makeCode();
      rooms.set(code, {
        p1: ws,
        p2: null,
        questions: pickQuestions(),
        results: {},
      });
      ws.roomCode = code;
      ws.playerNum = 1;
      send(ws, { type: "room-created", code });
    } else if (msg.type === "join-room") {
      const code = msg.code?.toUpperCase();
      const room = rooms.get(code);
      if (!room) {
        send(ws, { type: "error", message: "Room not found" });
        return;
      }
      if (room.p2) {
        send(ws, { type: "error", message: "Room is full" });
        return;
      }
      room.p2 = ws;
      ws.roomCode = code;
      ws.playerNum = 2;
      broadcast(room, { type: "game-start", questions: room.questions });
    } else if (msg.type === "update") {
      const room = rooms.get(ws.roomCode);
      if (!room) return;
      const opponent = ws.playerNum === 1 ? room.p2 : room.p1;
      send(opponent, { type: "opponent-update", ...msg.data });
    } else if (msg.type === "game-over") {
      const room = rooms.get(ws.roomCode);
      if (!room) return;
      const key = `p${ws.playerNum}`;
      room.results[key] = msg.result;
      const other = ws.playerNum === 1 ? room.p2 : room.p1;
      // Notify the other player this one finished
      send(other, { type: "opponent-finished", result: msg.result });
      // If both done, broadcast final
      if (room.results.p1 && room.results.p2) {
        broadcast(room, {
          type: "final-result",
          p1: room.results.p1,
          p2: room.results.p2,
        });
        rooms.delete(ws.roomCode);
      }
    }
  });

  ws.on("close", () => {
    const room = ws.roomCode ? rooms.get(ws.roomCode) : null;
    if (!room) return;
    const opponent = ws.playerNum === 1 ? room.p2 : room.p1;
    send(opponent, { type: "opponent-disconnected" });
    rooms.delete(ws.roomCode);
  });
});

console.log(`WebSocket server on ws://localhost:${PORT}`);
