import { useState, useRef, useCallback, useEffect } from 'react'
import { NOTES, noteName } from '../utils/notes.js'

// C3=48 to C6=84
const WHITE_KEYS = []
const BLACK_KEYS = []
for (let m = 48; m <= 84; m++) {
  const note = NOTES[m % 12]
  if (note.includes('#')) {
    BLACK_KEYS.push(m)
  } else {
    WHITE_KEYS.push(m)
  }
}

import { memo } from 'react'

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

  const keyClass = (midi, isWhite) => {
    let cls = isWhite ? 'piano-key white' : 'piano-key black'
    if (activeNote === midi) cls += ' active'
    if (highlightNote === midi) cls += ' correct'
    if (feedbackNote === midi) cls += ' wrong'
    return cls
  }

  const renderWhiteNoteLabel = (midi) => noteName(midi)

  return (
    <div className="instrument-container relative">
      {/* Black keys */}
      <div className="flex absolute top-0 left-0 pointer-events-none" style={{ marginLeft: '36px' }}>
        {BLACK_KEYS.map((midi) => {
          // Position calculation based on white key index
          const whiteIndex = WHITE_KEYS.indexOf(midi - 1)
          return (
            <button
              key={midi}
              onClick={() => handleClick(midi)}
              className={`${keyClass(midi, false)} pointer-events-auto`}
              style={{
                marginLeft: whiteIndex >= 0 ? '0' : undefined,
                position: 'relative',
                left: `${whiteIndex * 48 + 24}px`,
                width: '28px',
                marginRight: '-28px',
              }}
              title={noteName(midi)}
            >
              <span className="text-[8px] absolute bottom-1 left-1/2 -translate-x-1/2 text-white/60">
                {NOTES[midi % 12]}
              </span>
            </button>
          )
        })}
      </div>
      {/* White keys */}
      <div className="flex">
        {WHITE_KEYS.map((midi) => (
          <button
            key={midi}
            onClick={() => handleClick(midi)}
            className={keyClass(midi, true)}
            title={noteName(midi)}
          >
            <span className="text-[10px] absolute bottom-2 left-1/2 -translate-x-1/2 text-white/60">
              {renderWhiteNoteLabel(midi)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
})

export default Piano
