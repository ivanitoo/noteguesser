import { useState, useCallback } from 'react'
import { noteName, midiToFreq } from '../utils/notes.js'

const NOTE_POOL = Array.from({ length: 13 }, (_, i) => i + 48)

export function useGameLogic() {
  const [currentNote, setCurrentNote] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [playCount, setPlayCount] = useState(0)
  const [round, setRound] = useState(0)

  const generateNote = useCallback(() => {
    const midi = NOTE_POOL[Math.floor(Math.random() * NOTE_POOL.length)]
    setCurrentNote(midi)
    setFeedback(null)
    setPlayCount(0)
    setRound((r) => r + 1)
    return midi
  }, [])

  const checkAnswer = useCallback((answerMidi) => {
    if (currentNote === null) return null
    const correct = answerMidi === currentNote
    setFeedback(correct ? 'correct' : 'wrong')
    return correct
  }, [currentNote])

  const checkFreqAccuracy = useCallback((guessFreq, targetFreq) => {
    const cents = 1200 * Math.log2(guessFreq / targetFreq)
    const accuracy = Math.max(0, Math.min(100, Math.round(100 * (1 - Math.abs(cents) / 100))))
    const correct = accuracy >= 90
    setFeedback(correct ? 'correct' : 'wrong')
    return { correct, accuracy }
  }, [])

  const incrementPlay = useCallback(() => {
    setPlayCount((c) => c + 1)
  }, [])

  return {
    currentNote,
    feedback,
    playCount,
    round,
    generateNote,
    checkAnswer,
    checkFreqAccuracy,
    incrementPlay,
    setFeedback,
  }
}
