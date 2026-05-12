import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import * as Tone from 'tone'
import { useVolume } from '../context/VolumeContext.jsx'

export default function BackgroundMusic() {
  const { volume, isMuted, getMasterGain } = useVolume()
  const location = useLocation()
  const playerRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const startMusic = async () => {
      await Tone.start()
      if (cancelled) return
      if (startedRef.current) return
      startedRef.current = true

      const gain = getMasterGain()
      const db = isMuted ? -100 : -14 + (volume * 16)

      playerRef.current = new Tone.Player({
        url: '/noteguesser.mp3',
        loop: true,
        autostart: true,
        volume: db,
      }).connect(gain)
    }

    const onInteraction = () => {
      if (location.pathname === '/' && !startedRef.current) {
        startMusic()
      }
    }

    document.addEventListener('pointerdown', onInteraction)

    return () => {
      cancelled = true
      document.removeEventListener('pointerdown', onInteraction)
      if (playerRef.current) {
        playerRef.current.stop()
        playerRef.current.dispose()
        playerRef.current = null
      }
      startedRef.current = false
    }
  }, [location.pathname, getMasterGain])

  useEffect(() => {
    if (playerRef.current) {
      const db = isMuted ? -Infinity : -14 + (volume * 16)
      playerRef.current.volume.rampTo(db, 0.3)
    }
  }, [volume, isMuted])

  return null
}
