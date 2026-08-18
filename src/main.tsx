import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router } from 'wouter'
import { GameProvider } from './engine/GameProvider'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <GameProvider>
        <App />
      </GameProvider>
    </Router>
  </React.StrictMode>,
)
