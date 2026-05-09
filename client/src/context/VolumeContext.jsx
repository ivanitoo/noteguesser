import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import * as Tone from 'tone'

const VolumeContext = createContext(null)

export function VolumeProvider({ children }) {
  const [volume, setVolumeState] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const masterGainRef = useRef(null)
  const volumeRef = useRef(0.5)

  const getMasterGain = useCallback(() => {
    if (!masterGainRef.current) {
      masterGainRef.current = new Tone.Gain(volume).toDestination()
    }
    return masterGainRef.current
  }, []) 

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(isMuted ? 0 : volume, Tone.now())
    }
  }, [volume, isMuted])

  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, val))
    volumeRef.current = clamped
    setVolumeState(clamped)
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(clamped, Tone.now())
    }
    if (isMuted && val > 0) {
      setIsMuted(false)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev
      if (masterGainRef.current) {
        masterGainRef.current.gain.setValueAtTime(
          next ? 0 : volumeRef.current,
          Tone.now()
        )
      }
      return next
    })
  }, [])

  return (
    <VolumeContext.Provider value={{
      volume: isMuted ? 0 : volume,
      rawVolume: volumeRef.current,
      isMuted,
      setVolume,
      toggleMute,
      getMasterGain,
    }}>
      {children}
    </VolumeContext.Provider>
  )
}

export const useVolume = () => useContext(VolumeContext)
