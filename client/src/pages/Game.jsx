import { useState } from 'react'
import GameBoard from '../components/GameBoard.jsx'
import NamePrompt, { getPlayerName } from '../components/NamePrompt.jsx'

export default function Game() {
  const [hasName, setHasName] = useState(!!getPlayerName())

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Jugar</h2>
      {hasName ? (
        <GameBoard />
      ) : (
        <NamePrompt onConfirm={() => setHasName(true)} />
      )}
    </div>
  )
}
