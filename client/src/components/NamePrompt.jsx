import { useState } from 'react'

const STORAGE_KEY = 'noteguesser_player_name'

export function getPlayerName() {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function clearPlayerName() {
  localStorage.removeItem(STORAGE_KEY)
}

export default function NamePrompt({ onConfirm }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) return
    localStorage.setItem(STORAGE_KEY, trimmed)
    onConfirm(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="border border-white/20 rounded-xl p-8 w-full max-w-sm mx-4 bg-[#0a0a0f]"
      >
        <h2 className="text-lg font-medium mb-1">Tu nombre</h2>
        <p className="text-sm text-white/40 mb-6">
          Elegí un nombre para aparecer en el ranking
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingresá tu nombre"
          maxLength={30}
          autoFocus
          className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors mb-4"
        />
        <button
          type="submit"
          disabled={name.trim().length < 2}
          className="w-full line-art-btn px-8 py-2.5 text-sm disabled:opacity-30"
        >
          Comenzar
        </button>
      </form>
    </div>
  )
}
