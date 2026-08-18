import { useLocation } from 'wouter'
import { useState } from 'react'
import { useGame } from '../engine/GameProvider'

export function TitleScreen() {
  const [, setLocation] = useLocation()
  const { engine } = useGame()
  const [msg, setMsg] = useState('')

  const showMsg = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 4000)
  }

  const handleContinue = () => {
    const save = engine.loadGame('auto_save')
    if (save) {
      setLocation('/city-overview')
    } else {
      showMsg('No hay crónicas automáticas. Inicia una Nueva Campaña.')
    }
  }

  const handleNewGame = () => {
    setLocation('/new-campaign')
  }

  return (
    <main className="w-full h-full bg-[#03050a] flex items-center justify-center overflow-hidden select-none">
      {/* 16:9 Responsive Game Canvas Container */}
      <div 
        className="relative w-full h-full bg-cover bg-center shadow-2xl flex flex-col justify-between p-12"
        style={{ backgroundImage: "url('/images/pantalla_titulo.png')" }}
      >
        {/* Shadow Overlay for Premium Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/75 pointer-events-none" />

        {/* --- BRANDING & VERSION --- */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="px-3 py-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/35 rounded-full font-bold uppercase tracking-wider w-fit">
              Simulador Comercial Báltico
            </span>
          </div>
          <div className="text-right">
            <p className="text-amber-400 font-mono font-black text-xl tracking-widest drop-shadow-md">v1.0.0</p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">© 2026 Aritz Bahamonde Larxé</p>
          </div>
        </div>

        {msg && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 rounded-full bg-amber-500 text-black font-black text-xs shadow-2xl border border-amber-600 animate-bounce">
            {msg}
          </div>
        )}

        {/* --- CENTRAL MEDIEVAL MENU PANEL --- */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          {/* Game Title */}
          <div className="text-center mb-8 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 tracking-[0.25em] uppercase font-headline font-serif">
              PATRICIAN
            </h1>
            <p className="text-amber-100/70 text-lg tracking-[0.6em] uppercase mt-2 font-light">
              Hanseatic Strategos
            </p>
          </div>

          {/* Wooden/Metal Style Menu Panel */}
          <div className="w-full max-w-[360px] p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.85)] flex flex-col gap-3 backdrop-blur-md">
            
            {/* CONTINUAR */}
            <button 
              onClick={handleContinue}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-base tracking-widest transition-all shadow-md shadow-amber-950/50 hover:shadow-amber-400/20 active:scale-95 uppercase cursor-pointer"
            >
              Continuar Crónica
            </button>

            {/* NUEVA CAMPAÑA */}
            <button 
              onClick={handleNewGame}
              className="w-full py-3 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 text-amber-200 hover:text-amber-100 font-bold text-sm tracking-wider transition-all active:scale-95 uppercase cursor-pointer"
            >
              Nueva Campaña
            </button>

            {/* CRÓNICAS GUARDADAS */}
            <button 
              onClick={() => setLocation('/save-load')}
              className="w-full py-3 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 text-amber-200 hover:text-amber-100 font-bold text-sm tracking-wider transition-all active:scale-95 uppercase cursor-pointer"
            >
              Gestión de Crónicas
            </button>

            <div className="flex gap-2">
              {/* AJUSTES */}
              <button 
                onClick={() => setLocation('/settings')}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Ajustes
              </button>

              {/* MANUAL */}
              <button 
                onClick={() => setLocation('/wiki')}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Manual
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM MENU LINKS --- */}
        <div className="relative z-10 flex justify-center gap-8 text-xs font-semibold text-white/40">
          <button 
            onClick={() => showMsg('Soporte: Contacte con la Hansetag en Lubeck.')}
            className="hover:text-amber-400 transition-colors uppercase tracking-widest cursor-pointer bg-transparent border-0"
          >
            Soporte
          </button>
          <span>·</span>
          <button 
            onClick={() => showMsg('Hanseatic Strategos v1.0.0. Desarrollado por Aritz Bahamonde Larxé.')}
            className="hover:text-amber-400 transition-colors uppercase tracking-widest cursor-pointer bg-transparent border-0"
          >
            Créditos
          </button>
          <span>·</span>
          <button 
            onClick={() => {
              if (window.confirm('¿Desea salir del simulador comercial?')) {
                window.close()
              }
            }}
            className="hover:text-red-400 transition-colors uppercase tracking-widest cursor-pointer bg-transparent border-0"
          >
            Salir
          </button>
        </div>
      </div>
    </main>
  )
}
