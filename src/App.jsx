import { useState, useCallback } from 'react'
import { useGame } from './hooks/useGame'
import SplashScreen from './components/SplashScreen'
import Dashboard from './components/Dashboard'
import GameBoard from './components/GameBoard'
import EndScreen from './components/EndScreen'

const STORAGE_KEY = 'quizMillionaire_state'

function hasSavedGame() {
  try {
    return !!localStorage.getItem(STORAGE_KEY)
  } catch { return false }
}

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [endData, setEndData] = useState(null)
  const game = useGame()

  const handleEnd = useCallback((reason, amount) => {
    setEndData({ reason, amount })
    setScreen('end')
    game.reset()
  }, [game.reset])

  function startNewGame() {
    game.reset()
    setScreen('game')
  }

  function resumeGame() {
    setScreen('game')
  }

  function handlePlayAgain() {
    setEndData(null)
    setScreen('dashboard')
  }

  return (
    <div className="app">
      {screen === 'splash' && (
        <SplashScreen onContinue={() => setScreen('dashboard')} />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          onPlay={startNewGame}
          hasSavedGame={hasSavedGame()}
          onResume={resumeGame}
        />
      )}

      {screen === 'game' && (
        <GameBoard game={game} onEnd={handleEnd} />
      )}

      {screen === 'end' && endData && (
        <EndScreen
          reason={endData.reason}
          amount={endData.amount}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}
