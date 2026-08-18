import { useLocation } from 'wouter'
import { useState } from 'react'
import { usePlayer, useSimulationState, useGame } from '../engine/GameProvider'

export function HUD() {
  const [, setLocation] = useLocation()
  const player = usePlayer()
  const sim = useSimulationState()
  const { engine } = useGame()
  const [speedIndex, setSpeedIndex] = useState(1) // Default to x1
  const [isPlaying, setIsPlaying] = useState(true)

  if (!player) return null

  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const day = sim?.date?.day || 15
  const monthName = monthNames[(sim?.date?.month || 10) - 1] || 'Oct'
  const year = sim?.date?.year || 1300

  // P3 speed values: Pausa, x1, x2, x4
  const setSimSpeed = (speed: number, play: boolean) => {
    setIsPlaying(play)
    if (!play) {
      engine.engine.stop()
    } else {
      engine.engine.start()
      engine.setTickRate(speed)
    }
  }

  // Get active rank name
  const getRankName = (gold: number) => {
    if (gold < 15000) return 'Tendero'
    if (gold < 40000) return 'Buhonero'
    if (gold < 100000) return 'Comerciante'
    if (gold < 250000) return 'Mercader'
    return 'Patricio'
  }

  return (
    <header className="fixed top-0 left-0 w-full h-[5vh] min-h-[40px] max-h-[50px] bg-[#0a101d] border-b border-amber-500/30 px-6 flex items-center justify-between z-[999] select-none text-white pointer-events-auto">
      {/* 1. Date Indicator */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-amber-500 text-lg">calendar_month</span>
        <span className="font-mono font-bold text-sm tracking-wider text-amber-100">
          {day < 10 ? `0${day}` : day}.{monthName}.{year}
        </span>
      </div>

      {/* 2. Central Section: Gold, Rank, Messages & Ledger */}
      <div className="flex items-center gap-8">
        {/* Gold Balance */}
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg border border-amber-500/10">
          <span className="material-symbols-outlined text-amber-400 text-base">payments</span>
          <span className="font-mono font-black text-amber-300 text-sm">
            {Math.floor(player.gold).toLocaleString()} Oro
          </span>
        </div>

        {/* Honorific Rank */}
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg border border-amber-500/10">
          <span className="material-symbols-outlined text-amber-400 text-base">military_tech</span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
            {getRankName(player.gold)}
          </span>
        </div>

        {/* Message Envelope Indicator */}
        <button 
          onClick={() => setLocation('/messages')}
          className="relative flex items-center justify-center p-1 rounded hover:bg-white/5 cursor-pointer text-amber-400"
          title="Buzón de Mensajes"
        >
          <span className="material-symbols-outlined text-xl">mail</span>
          {/* Pulsing red badge if there are messages */}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse border border-slate-950" />
        </button>

        {/* Ledger Book Link */}
        <button 
          onClick={() => setLocation('/ledger')}
          className="flex items-center justify-center p-1 rounded hover:bg-white/5 cursor-pointer text-amber-400"
          title="Libro Mayor Financiero"
        >
          <span className="material-symbols-outlined text-xl">menu_book</span>
        </button>
      </div>

      {/* 3. Speed Controls (Pause, x1, x2, x4) */}
      <div className="flex items-center bg-black/50 rounded-lg p-0.5 border border-amber-500/20">
        {/* Pause Button */}
        <button 
          onClick={() => setSimSpeed(1, false)}
          className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition-all cursor-pointer ${!isPlaying ? 'bg-amber-500 text-black font-black' : 'text-amber-500/60 hover:text-amber-400'}`}
        >
          PAUSA
        </button>
        {/* Speed x1 */}
        <button 
          onClick={() => { setSpeedIndex(1); setSimSpeed(1, true); }}
          className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition-all cursor-pointer ${isPlaying && speedIndex === 1 ? 'bg-amber-500 text-black font-black' : 'text-amber-500/60 hover:text-amber-400'}`}
        >
          &gt;
        </button>
        {/* Speed x2 */}
        <button 
          onClick={() => { setSpeedIndex(2); setSimSpeed(2, true); }}
          className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition-all cursor-pointer ${isPlaying && speedIndex === 2 ? 'bg-amber-500 text-black font-black' : 'text-amber-500/60 hover:text-amber-400'}`}
        >
          &gt;&gt;
        </button>
        {/* Speed x4 */}
        <button 
          onClick={() => { setSpeedIndex(4); setSimSpeed(4, true); }}
          className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition-all cursor-pointer ${isPlaying && speedIndex === 4 ? 'bg-amber-500 text-black font-black' : 'text-amber-500/60 hover:text-amber-400'}`}
        >
          &gt;&gt;&gt;
        </button>
      </div>
    </header>
  )
}
