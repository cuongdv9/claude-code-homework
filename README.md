# QuizMillionaire

A minimalist mobile web quiz app inspired by "Who Wants to Be a Millionaire". Solo play or real-time online multiplayer.

## Prerequisites

- Node.js (v18+)
- npm

## Installation

```bash
npm install
```

## Running the App

### Solo mode only

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### With online multiplayer

Start both servers in separate terminals:

```bash
# Terminal 1 — WebSocket server
npm run server

# Terminal 2 — Vite dev server
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/ws` to the WebSocket server on `:8080`.

## Other Commands

```bash
npm run build   # Production build
npm test        # Run tests (Vitest)
npm run lint    # Lint source files
```
