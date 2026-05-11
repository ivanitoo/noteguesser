import { useState, useRef, useCallback, useEffect, memo } from 'react'
import { NOTES, noteName } from '../utils/notes.js'

const FIRST = 48
const LAST = 60

const ALL_KEYS = []
for (let m = FIRST; m <= LAST; m++) {
  ALL_KEYS.push(m)
}

const WHITE_W = 88
const WHITE_H = 240
const BLACK_W = 60
const BLACK_H = 160

const Piano = memo(function Piano({ onNoteClick, highlightNote, feedbackNote }) {
  const [activeNote, setActiveNote] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = useCallback((midi) => {
    setActiveNote(midi)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setActiveNote(null), 200)
    onNoteClick?.(midi)
  }, [onNoteClick])

  const isBlack = (midi) => NOTES[midi % 12].includes('#')

  const keyClass = (midi) => {
    const black = isBlack(midi)
    let cls = black ? 'piano-key black' : 'piano-key white'
    if (activeNote === midi) cls += ' active'
    if (highlightNote === midi) cls += ' correct'
    if (feedbackNote === midi) cls += ' wrong'
    return cls
  }

  return (
    <div className="instrument-container relative inline-flex">
      {ALL_KEYS.map((midi) => {
        const black = isBlack(midi)
        return (
          <button
            key={midi}
            onClick={() => handleClick(midi)}
            className={keyClass(midi)}
            style={{
              width: black ? BLACK_W : WHITE_W,
              height: black ? BLACK_H : WHITE_H,
              marginLeft: black ? -(BLACK_W / 2) : 0,
              marginRight: black ? -(BLACK_W / 2) : 0,
              zIndex: black ? 2 : 1,
              flexShrink: 0,
              position: 'relative',
            }}
            title={noteName(midi)}
          >
            <span
              className={
                black
                  ? 'text-[8px] absolute bottom-1 left-1/2 -translate-x-1/2 text-white/60 pointer-events-none'
                  : 'text-[10px] absolute bottom-2 left-1/2 -translate-x-1/2 text-white/60 pointer-events-none'
              }
            >
              {black ? NOTES[midi % 12] : noteName(midi)}
            </span>
          </button>
        )
      })}
    </div>
  )
})

export default Piano
