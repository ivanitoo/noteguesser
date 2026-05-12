import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GameProvider } from './context/GameContext.jsx'
import { VolumeProvider } from './context/VolumeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VolumeProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </VolumeProvider>
    </BrowserRouter>
  </StrictMode>,
)
