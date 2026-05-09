export default function ScoreBoard({ score, total, streak }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="flex items-center gap-8 text-sm font-mono">
      <div>
        <span className="text-white/40">Score: </span>
        <span className="text-white">{score}/{total}</span>
      </div>
      <div>
        <span className="text-white/40">Aciertos: </span>
        <span className="text-green-400">{pct}%</span>
      </div>
      {streak > 1 && (
        <div>
          <span className="text-white/40">Racha: </span>
          <span className="text-yellow-400">{streak}🔥</span>
        </div>
      )}
    </div>
  )
}
