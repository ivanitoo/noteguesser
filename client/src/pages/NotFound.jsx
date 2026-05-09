import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="text-7xl font-light text-white/20">404</div>
      <p className="text-white/50 text-lg">Esta página no existe</p>
      <Link to="/" className="line-art-btn px-6 py-2 text-sm">
        Volver al inicio
      </Link>
    </div>
  )
}
