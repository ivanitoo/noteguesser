import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../hooks/useAudio.js'
import { useGameLogic } from '../hooks/useGame.js'
import { useGame } from '../context/GameContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { noteName, midiToFreq } from '../utils/notes.js'
import { saveScore } from '../services/api.js'
import ModeSelector from './ModeSelector.jsx'
import ScoreBoard from './ScoreBoard.jsx'
import NoteDisplay from './NoteDisplay.jsx'
import Piano from './Piano.jsx'
import Guitar from './Guitar.jsx'
import SliderFreq from './SliderFreq.jsx'

const MIN_SLIDER_FREQ = 130.81
const MAX_SLIDER_FREQ = 523.25

export default function GameBoard() {
  const { mode, setMode, addResult, resetGame, score, total, streak } = useGame()
  const { user } = useAuth()
  const { playNote, playSliderFreq, startSliderFreq, updateSliderFreq, stopSlider } = useAudio()
  const game = useGameLogic()
  const [sliderGuessFreq, setSliderGuessFreq] = useState(null)
  const [sliderConfirmed, setSliderConfirmed] = useState(false)
  const [sliderAccuracy, setSliderAccuracy] = useState(null)
  const sliderTargetRef = useRef(null)

  const startRound = useCallback(() => {
    game.generateNote()
    sliderTargetRef.current = MIN_SLIDER_FREQ + Math.random() * (MAX_SLIDER_FREQ - MIN_SLIDER_FREQ)
    setSliderAccuracy(null)
  }, [game])

  useEffect(() => {
    if (game.currentNote === null && !game.feedback) {
      startRound()
    }
  }, [game.currentNote, game.feedback, startRound])

  const handlePlay = useCallback(async () => {
    if (game.currentNote === null) return
    game.incrementPlay()
    if (mode === 'slider') {
      await playSliderFreq(sliderTargetRef.current)
    } else {
      await playNote(mode, game.currentNote)
    }
  }, [game.currentNote, game, mode, playNote, playSliderFreq])

  const saveGameScore = useCallback((correct) => {
    if (user) {
      saveScore(mode, correct ? 1 : 0, 1).catch(() => {})
    }
  }, [user, mode])

  const handlePianoClick = useCallback((midi) => {
    if (game.feedback) return
    const correct = game.checkAnswer(midi)
    if (correct !== null) {
      addResult(correct)
      saveGameScore(correct)
    }
  }, [game, addResult, saveGameScore])

  const handleGuitarClick = useCallback((midi) => {
    if (game.feedback) return
    const correct = game.checkAnswer(midi)
    if (correct !== null) {
      addResult(correct)
      saveGameScore(correct)
    }
  }, [game, addResult, saveGameScore])

  const handleSliderChange = useCallback((freq) => {
    setSliderGuessFreq(freq)
    updateSliderFreq(freq)
  }, [updateSliderFreq])

  const handleSliderStart = useCallback((freq) => {
    startSliderFreq(freq)
  }, [startSliderFreq])

  const handleSliderEnd = useCallback(() => {
    stopSlider()
  }, [stopSlider])

  const handleSliderConfirm = useCallback(() => {
    if (game.feedback || sliderGuessFreq === null || sliderTargetRef.current === null) return
    const target = sliderTargetRef.current
    const { correct, accuracy } = game.checkFreqAccuracy(sliderGuessFreq, target)
    setSliderAccuracy(accuracy)
    addResult(correct)
    setSliderConfirmed(true)
    stopSlider(true)
    saveGameScore(correct)
  }, [game, sliderGuessFreq, addResult, stopSlider, saveGameScore])

  const handleNext = useCallback(() => {
    setSliderGuessFreq(null)
    setSliderConfirmed(false)
    stopSlider(true)
    startRound()
  }, [startRound, stopSlider])

  const handleModeChange = useCallback((m) => {
    setMode(m)
    resetGame()
    game.setFeedback(null)
    stopSlider(true)
    game.generateNote()
  }, [setMode, resetGame, game, stopSlider])

  // Compute target info depending on mode
  const isSlider = mode === 'slider'
  const sliderTarget = sliderTargetRef.current
  const targetMidi = isSlider && sliderTarget
    ? Math.round(12 * Math.log2(sliderTarget / 440) + 69)
    : game.currentNote
  const targetNoteName = targetMidi !== null ? noteName(targetMidi) : null
  const targetFreq = isSlider && sliderTarget
    ? sliderTarget
    : (game.currentNote !== null ? midiToFreq(game.currentNote) : null)

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <ModeSelector mode={mode} onChange={handleModeChange} />

      <ScoreBoard score={score} total={total} streak={streak} />

      <button
        onClick={handlePlay}
        disabled={!!game.feedback}
        className="line-art-btn px-8 py-3 text-lg disabled:opacity-30"
      >
        ▶ {game.playCount > 0 ? `Repetir (${game.playCount})` : 'Play'}
      </button>

      <div className="w-full max-w-3xl">
        {mode === 'piano' && (
          <Piano
            onNoteClick={handlePianoClick}
            highlightNote={game.feedback === 'wrong' ? game.currentNote : null}
            feedbackNote={game.feedback === 'wrong' ? game.currentNote : null}
          />
        )}
        {mode === 'guitar' && (
          <Guitar
            onNoteClick={handleGuitarClick}
            highlightNote={game.feedback === 'wrong' ? game.currentNote : null}
            feedbackNote={game.feedback === 'wrong' ? game.currentNote : null}
          />
        )}
        {mode === 'slider' && (
          <>
            <SliderFreq
              onSliderChange={handleSliderChange}
              onSliderStart={handleSliderStart}
              onSliderEnd={handleSliderEnd}
              highlightFreq={targetFreq}
              feedbackNote={game.feedback === 'wrong' ? targetNoteName : null}
            />
            {!sliderConfirmed && !game.feedback && (
              <div className="flex justify-center mt-4">
                <button onClick={handleSliderConfirm} className="line-art-btn px-8 py-2 text-sm">
                  Confirmar nota
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <NoteDisplay
        noteName={targetNoteName}
        feedback={game.feedback}
        accuracy={sliderAccuracy}
        targetFreq={isSlider ? targetFreq : null}
      />

      {game.feedback && (
        <button onClick={handleNext} className="line-art-btn px-8 py-2 text-sm mt-2">
          Siguiente nota →
        </button>
      )}
    </div>
  )
}
