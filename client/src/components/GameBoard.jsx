import { useState, useCallback, useEffect, useRef } from 'react'
import { useAudio } from '../hooks/useAudio.js'
import { useGameLogic } from '../hooks/useGame.js'
import { useGame } from '../context/GameContext.jsx'
import { noteName, midiToFreq } from '../utils/notes.js'
import { useLocale } from '../context/LocaleContext.jsx'
import ModeSelector from './ModeSelector.jsx'
import ScoreBoard from './ScoreBoard.jsx'
import NoteDisplay from './NoteDisplay.jsx'
import Piano from './Piano.jsx'
import Guitar from './Guitar.jsx'
import SliderFreq from './SliderFreq.jsx'
import GameOverModal from './GameOverModal.jsx'

const MIN_SLIDER_FREQ = 130.81
const MAX_SLIDER_FREQ = 523.25

export default function GameBoard() {
  const { t } = useLocale()
  const { mode, setMode, addResult, resetGame, restartGame, score, total, streak, gameOver } = useGame()
  const { playNote, playSliderFreq, startSliderFreq, updateSliderFreq, stopSlider } = useAudio()
  const game = useGameLogic()
  const [sliderGuessFreq, setSliderGuessFreq] = useState(null)
  const [sliderConfirmed, setSliderConfirmed] = useState(false)
  const [sliderAccuracy, setSliderAccuracy] = useState(null)
  const sliderTargetRef = useRef(null)
  const zeroScoreAutoRestart = useRef(false)

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

  useEffect(() => {
    if (gameOver && score === 0 && !zeroScoreAutoRestart.current) {
      zeroScoreAutoRestart.current = true
      handleRestart()
    }
    if (!gameOver) {
      zeroScoreAutoRestart.current = false
    }
  }, [gameOver, score, handleRestart])

  const handlePlay = useCallback(async () => {
    if (game.currentNote === null) return
    game.incrementPlay()
    if (mode === 'slider') {
      await playSliderFreq(sliderTargetRef.current)
    } else {
      await playNote(mode, game.currentNote)
    }
  }, [game.currentNote, game, mode, playNote, playSliderFreq])

  const handlePianoClick = useCallback((midi) => {
    if (game.feedback) return
    const correct = game.checkAnswer(midi)
    if (correct !== null) {
      addResult(correct)
    }
  }, [game, addResult])

  const handleGuitarClick = useCallback((midi) => {
    if (game.feedback) return
    const correct = game.checkAnswer(midi)
    if (correct !== null) {
      addResult(correct)
    }
  }, [game, addResult])

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
  }, [game, sliderGuessFreq, addResult, stopSlider])

  const handleNext = useCallback(() => {
    setSliderGuessFreq(null)
    setSliderConfirmed(false)
    stopSlider(true)
    startRound()
  }, [startRound, stopSlider])

  const handleRestart = useCallback(() => {
    restartGame()
    setSliderGuessFreq(null)
    setSliderConfirmed(false)
    setSliderAccuracy(null)
    game.setFeedback(null)
    stopSlider(true)
    startRound()
  }, [restartGame, game, stopSlider, startRound])

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

      {!gameOver && (
        <>
      <button
        onClick={handlePlay}
        disabled={!!game.feedback}
        className="line-art-btn px-8 py-3 text-lg disabled:opacity-30"
      >
        ▶ {game.playCount > 0 ? t('game.repeat', { count: game.playCount }) : t('game.play')}
      </button>

      {mode === 'piano' && (
        <div className="w-full flex justify-center" key="piano">
          <Piano
            onNoteClick={handlePianoClick}
            highlightNote={game.feedback === 'wrong' ? game.currentNote : null}
            feedbackNote={game.feedback === 'wrong' ? game.currentNote : null}
          />
        </div>
      )}
      {mode === 'guitar' && (
        <div className="w-full max-w-4xl" key="guitar">
          <Guitar
            onNoteClick={handleGuitarClick}
            highlightNote={game.feedback === 'wrong' ? game.currentNote : null}
            feedbackNote={game.feedback === 'wrong' ? game.currentNote : null}
          />
        </div>
      )}
      {mode === 'slider' && (
        <div className="w-full max-w-4xl" key="slider">
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
                {t('game.confirm')}
              </button>
            </div>
          )}
        </div>
      )}

      <NoteDisplay
        noteName={targetNoteName}
        feedback={game.feedback}
        accuracy={sliderAccuracy}
        targetFreq={isSlider ? targetFreq : null}
      />

      {game.feedback && (
        <button onClick={handleNext} className="line-art-btn px-8 py-2 text-sm mt-2">
          {t('game.next')}
        </button>
      )}
      </>
      )}

      {gameOver && (
        <GameOverModal
          score={score}
          total={total}
          streak={streak}
          mode={mode}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
