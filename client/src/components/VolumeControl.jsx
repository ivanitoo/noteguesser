import { useVolume } from '../context/VolumeContext.jsx'

export default function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = useVolume()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-xs leading-none text-white/30 hover:text-white/60 transition-colors duration-200"
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isMuted || volume === 0 ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              {volume > 0.5 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
            </>
          )}
        </svg>
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={(e) => {
          const val = parseFloat(e.target.value)
          setVolume(val)
          if (val > 0 && isMuted) toggleMute()
        }}
        className="volume-slider"
        style={{ width: '64px', height: '3px' }}
      />
    </div>
  )
}
