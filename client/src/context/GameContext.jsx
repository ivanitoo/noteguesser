import { createContext, useContext, useState } from 'react'

const GameContext = createContext(null)

const MAX_WRONG = 3

export function GameProvider({ children }) {
  const [mode, setMode] = useState('piano')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastResult, setLastResult] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  const addResult = (correct) => {
    const nextScore = score + (correct ? 1 : 0)
    const nextTotal = total + 1
    setScore(nextScore)
    setTotal(nextTotal)
    setStreak(correct ? streak + 1 : 0)
    setLastResult(correct ? 'correct' : 'wrong')
    if (nextTotal - nextScore >= MAX_WRONG) {
      setGameOver(true)
    }
  }

  const resetGame = () => {
    setScore(0)
    setTotal(0)
    setStreak(0)
    setLastResult(null)
  }

  const restartGame = () => {
    resetGame()
    setGameOver(false)
  }

  return (
    <GameContext.Provider value={{
      mode, setMode, score, total, streak, lastResult, gameOver,
      addResult, resetGame, restartGame, setLastResult,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
