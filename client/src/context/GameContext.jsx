import { createContext, useContext, useState } from 'react'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [mode, setMode] = useState('piano')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastResult, setLastResult] = useState(null)

  const addResult = (correct) => {
    setTotal((t) => t + 1)
    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
      setLastResult('correct')
    } else {
      setStreak(0)
      setLastResult('wrong')
    }
  }

  const resetGame = () => {
    setScore(0)
    setTotal(0)
    setStreak(0)
    setLastResult(null)
  }

  return (
    <GameContext.Provider value={{
      mode, setMode, score, total, streak, lastResult,
      addResult, resetGame, setLastResult,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
