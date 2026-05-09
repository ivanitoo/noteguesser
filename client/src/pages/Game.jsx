import GameBoard from '../components/GameBoard.jsx'

export default function Game() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Jugar</h2>
      <GameBoard />
    </div>
  )
}
