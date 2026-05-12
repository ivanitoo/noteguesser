import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext.jsx'

export default function NotFound() {
  const { t } = useLocale()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="text-7xl font-light text-white/20">{t('notfound.title')}</div>
      <p className="text-white/50 text-lg">{t('notfound.message')}</p>
      <Link to="/" className="line-art-btn px-6 py-2 text-sm">
        {t('notfound.back')}
      </Link>
    </div>
  )
}
