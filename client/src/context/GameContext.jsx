import { createContext, useContext, useState, useRef } from 'react'

const GameContext = createContext(null)

const MAX_WRONG = 3

export function GameProvider({ children }) {
  const [mode, setMode] = useState('piano')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastResult, setLastResult] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  const scoreRef = useRef(0)
  const totalRef = useRef(0)
  const gameOverRef = useRef(false)

  const resetAll = () => {
    scoreRef.current = 0
    totalRef.current = 0
    setScore(0)
    setTotal(0)
    setStreak(0)
    setLastResult(null)
    setGameOver(false)
    gameOverRef.current = false
  }

  const addResult = (correct) => {
    const nextScore = correct ? scoreRef.current + 1 : scoreRef.current
    const nextTotal = totalRef.current + 1
    scoreRef.current = nextScore
    totalRef.current = nextTotal

    setScore(nextScore)
    setTotal(nextTotal)
    setStreak(correct ? (s) => s + 1 : 0)
    setLastResult(correct ? 'correct' : 'wrong')

    if (nextTotal - nextScore >= MAX_WRONG) {
      gameOverRef.current = true
      if (nextScore === 0) {
        resetAll()
      } else {
        setGameOver(true)
      }
    }
  }

  const resetGame = () => {
    resetAll()
  }

  const restartGame = () => {
    resetAll()
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
