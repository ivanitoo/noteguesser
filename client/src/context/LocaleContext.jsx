import { createContext, useContext, useState, useCallback } from 'react'

const dict = {
  es: {
    'app.title': '♫ Adivina la Nota',
    'nav.play': 'Jugar',
    'nav.ranking': 'Ranking',
    'language.en': 'EN',
    'language.es': 'ES',
    'game.play': 'Play',
    'game.repeat': 'Repetir ({count})',
    'game.confirm': 'Confirmar nota',
    'game.next': 'Siguiente nota →',
    'name.title': 'Tu nombre',
    'name.description': 'Elegí un nombre para aparecer en el ranking',
    'name.placeholder': 'Ingresá tu nombre',
    'name.button': 'Comenzar',
    'feedback.correct': '¡Correcto!',
    'feedback.wrong': 'Incorrecto',
    'feedback.itwas': 'Era: {note}',
    'feedback.accuracy': 'Precisión: {accuracy}%',
    'score.label': 'Score:',
    'score.hits': 'Aciertos:',
    'score.streak': 'Racha:',
    'mode.piano': 'Piano',
    'mode.guitar': 'Guitarra',
    'mode.slider': 'Slider Hz',
    'volume.activate': 'Activar sonido',
    'volume.mute': 'Silenciar',
    'landing.title': 'Adivina la Nota',
    'landing.subtitle': 'Entrena tu oído musical. Escucha la nota, encuéntrala en el piano, la guitarra o con el slider de frecuencia.',
    'landing.cta': 'Jugar ahora',
    'landing.ranking': 'Ranking',
    'landing.cta2': 'Jugar ahora →',
    'landing.mode.piano.title': 'Modo Piano',
    'landing.mode.piano.desc': '2 octavas completas con sostenidos. Toca la nota que escuchaste.',
    'landing.mode.guitar.title': 'Modo Guitarra',
    'landing.mode.guitar.desc': 'Mástil interactivo con 6 cuerdas y 12 trastes. Encuentra la nota.',
    'landing.mode.slider.title': 'Modo Slider',
    'landing.mode.slider.desc': 'Ajusta la frecuencia en Hz. Prueba tu oído absoluto.',
    'game.pageTitle': 'Jugar',
    'leaderboard.title': 'Ranking',
    'leaderboard.loading': 'Cargando...',
    'leaderboard.empty': 'Todavía no hay puntajes esta semana. ¡Sé el primero!',
    'leaderboard.rank': '#',
    'leaderboard.player': 'Jugador',
    'leaderboard.score': 'Puntaje',
    'leaderboard.accuracy': 'Precisión',
    'notfound.title': '404',
    'notfound.message': 'Esta página no existe',
    'notfound.back': 'Volver al inicio',
    'gameover.title': '¡Juego terminado!',
    'gameover.namePrompt': 'Ingresá tu nombre para guardar tu puntaje',
    'gameover.submit': 'Guardar puntaje',
    'gameover.skip': 'Omitir',
    'gameover.saving': 'Guardando...',
    'gameover.saved': '¡Puntaje guardado!',
    'gameover.playAgain': 'Jugar de nuevo',
  },
  en: {
    'app.title': '♫ Guess the Note',
    'nav.play': 'Play',
    'nav.ranking': 'Leaderboard',
    'language.en': 'EN',
    'language.es': 'ES',
    'game.play': 'Play',
    'game.repeat': 'Repeat ({count})',
    'game.confirm': 'Confirm note',
    'game.next': 'Next note →',
    'name.title': 'Your name',
    'name.description': 'Pick a name to appear on the leaderboard',
    'name.placeholder': 'Enter your name',
    'name.button': 'Start',
    'feedback.correct': 'Correct!',
    'feedback.wrong': 'Wrong',
    'feedback.itwas': 'It was: {note}',
    'feedback.accuracy': 'Accuracy: {accuracy}%',
    'score.label': 'Score:',
    'score.hits': 'Hits:',
    'score.streak': 'Streak:',
    'mode.piano': 'Piano',
    'mode.guitar': 'Guitar',
    'mode.slider': 'Slider Hz',
    'volume.activate': 'Activate sound',
    'volume.mute': 'Mute',
    'landing.title': 'Guess the Note',
    'landing.subtitle': 'Train your ear. Listen to the note, find it on the piano, guitar, or frequency slider.',
    'landing.cta': 'Play now',
    'landing.ranking': 'Leaderboard',
    'landing.cta2': 'Play now →',
    'landing.mode.piano.title': 'Piano Mode',
    'landing.mode.piano.desc': '2 full octaves with sharps. Tap the note you heard.',
    'landing.mode.guitar.title': 'Guitar Mode',
    'landing.mode.guitar.desc': 'Interactive fretboard with 6 strings and 12 frets. Find the note.',
    'landing.mode.slider.title': 'Slider Mode',
    'landing.mode.slider.desc': 'Adjust the frequency in Hz. Test your perfect pitch.',
    'game.pageTitle': 'Play',
    'leaderboard.title': 'Leaderboard',
    'leaderboard.loading': 'Loading...',
    'leaderboard.empty': 'No scores this week yet. Be the first!',
    'leaderboard.rank': '#',
    'leaderboard.player': 'Player',
    'leaderboard.score': 'Score',
    'leaderboard.accuracy': 'Accuracy',
    'notfound.title': '404',
    'notfound.message': 'This page does not exist',
    'notfound.back': 'Back to home',
    'gameover.title': 'Game Over!',
    'gameover.namePrompt': 'Enter your name to save your score',
    'gameover.submit': 'Save score',
    'gameover.skip': 'Skip',
    'gameover.saving': 'Saving...',
    'gameover.saved': 'Score saved!',
    'gameover.playAgain': 'Play again',
  },
}

const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const saved = localStorage.getItem('noteguesser_locale')
  const [locale, setLocaleState] = useState(saved === 'en' ? 'en' : 'es')

  const setLocale = useCallback((l) => {
    setLocaleState(l)
    localStorage.setItem('noteguesser_locale', l)
  }, [])

  const t = useCallback((key, params = {}) => {
    let text = dict[locale][key]
    if (text === undefined) return key
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v)
    }
    return text
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale debe usarse dentro de LocaleProvider')
  return ctx
}
