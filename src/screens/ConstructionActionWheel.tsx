import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const FACTORIES = [
  { id: 'brickwork', name: 'Alfarería', icon: 'domain', cost: '2,000 DUC', res: 'Arcilla/Leña' },
  { id: 'grain',     name: 'Granja',    icon: 'grain',  cost: '1,500 DUC', res: 'Tierra' },
  { id: 'wood',      name: 'Aserradero', icon: 'forest', cost: '1,200 DUC', res: 'Bosque' },
  { id: 'salt',      name: 'Salina',    icon: 'science', cost: '2,500 DUC', res: 'Marisma' },
]

export function ConstructionActionWheel() {
  const [, setLocation] = useLocation()
  const { engine } = useGame()
  const player = usePlayer()
  const [selected, setSelected] = useState(FACTORIES[0])
  const [msg, setMsg] = useState('')

  if (!player) return null
  const currentCityId = player.currentCityId || 'lubeck'

  const handleBuild = () => {
    const result = engine.buildFactory(currentCityId, selected.id)
    if (result) {
      setMsg(`¡Construcción de ${selected.name} iniciada!`)
      setTimeout(() => setLocation('/city-overview'), 1500)
    } else {
      setMsg('No se puede construir aquí: Fondos insuficientes.')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <main className="w-full h-full bg-black/40 flex items-center justify-center p-md overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent pointer-events-none" />

      {msg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-xl bg-amber-500/90 text-black font-black uppercase tracking-widest shadow-2xl animate-bounce">
          {msg}
        </div>
      )}

      {/* Radial UI Container */}
      <div className="relative w-[min(600px,90vw)] h-[min(600px,90vh)] flex items-center justify-center">
        
        {/* Background decorative rings */}
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-white/5 animate-[spin_60s_linear_infinite] pointer-events-none" />
        <div className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full border border-tertiary-fixed/10 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
        
        {/* Main Center Info */}
        <div className="z-20 w-36 h-36 md:w-48 md:h-48 rounded-full glass-panel-heavy border-2 border-tertiary-fixed/40 flex flex-col items-center justify-center text-center p-md shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          <span className="material-symbols-outlined text-[64px] text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{selected.icon}</span>
          <h2 className="font-title-md text-title-md text-white mt-xs uppercase">{selected.name}</h2>
          <div className="mt-xs">
            <p className="text-tertiary font-black font-mono text-sm">{selected.cost}</p>
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">Recursos: {selected.res}</p>
          </div>
        </div>

        {/* Buttons around the wheel */}
        {FACTORIES.map((f, i) => {
          const angle = (i * (360 / FACTORIES.length)) * (Math.PI / 180)
          const radius = 220
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const isSelected = selected.id === f.id

          return (
            <button
              key={f.id}
              onClick={() => setSelected(f)}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              className={`absolute z-30 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center gap-xs transition-all duration-300 group ${
                isSelected 
                  ? 'bg-tertiary text-on-tertiary shadow-[0_0_30px_rgba(212,175,55,0.4)] scale-110' 
                  : 'glass-panel text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className={`material-symbols-outlined text-[32px] ${isSelected ? '' : 'group-hover:scale-110 transition-transform'}`}>{f.icon}</span>
              <span className="font-label-sm text-[10px] uppercase font-bold">{f.name}</span>
            </button>
          )
        })}

        {/* Action Controls */}
        <div className="absolute bottom-4 flex flex-col sm:flex-row gap-md w-full px-4 sm:w-auto sm:px-0">
          <button 
            onClick={() => setLocation('/city-overview')}
            className="px-xl py-base glass-panel text-white/70 rounded-xl font-bold hover:bg-white/5 transition-all border border-white/10 uppercase tracking-widest"
          >
            Cancelar
          </button>
          <button 
            onClick={handleBuild}
            className="px-xl py-base bg-amber-500 text-black rounded-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-0"
          >
            Confirmar Obra
          </button>
        </div>
      </div>
    </main>
  )
}

// Styles embedded to ensure consistency without CSS class pollution
const styles = `
.glass-panel {
    background: rgba(0, 31, 63, 0.6);
    backdrop-filter: blur(12px);
}
.glass-panel-heavy {
    background: rgba(0, 31, 63, 0.85);
    backdrop-filter: blur(24px);
}
`
