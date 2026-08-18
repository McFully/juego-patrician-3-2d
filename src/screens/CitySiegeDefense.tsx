import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function CitySiegeDefense() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [feedback, setFeedback] = useState('')
  const [oilUses, setOilUses] = useState(3)

  if (!player) return null

  const currentCityId = player.currentCityId || 'lubeck'
  const cityState = worldState?.simulation?.cities?.[currentCityId]
  
  // Dynamic stats from simulation
  const wallIntegrity = cityState?.wallIntegrity ?? 68
  const siegeDuration = cityState?.siegeDuration ?? 14
  const garrisonMorale = cityState?.garrisonMorale ?? 82
  const gold = Math.floor(player.gold).toLocaleString()
  const cityName = cityState?.name?.toUpperCase() || currentCityId.toUpperCase()

  const handleUseOil = () => {
    if (oilUses > 0) {
      const result = engine.resolveEncounter('fight') // Placeholder for siege weapon use
      if (result) {
        setOilUses(p => p - 1)
        setFeedback('¡Aceite vertido sobre los atacantes!')
      }
      setTimeout(() => setFeedback(''), 3000)
    } else {
      setFeedback('No queda más aceite hirviendo.')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  const handleUpgradeGate = () => {
    const success = engine.repairShip(currentCityId, 0)
    if (success) {
      setFeedback('¡Defensas reforzadas con éxito!')
    } else {
      setFeedback('Fondos insuficientes.')
    }
    setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="flex items-center gap-md">
          <span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
          <nav className="hidden md:flex gap-gutter ml-xl">
            <button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer text-sm">Mapa Mundial</button>
            <button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer text-sm">Libro Mayor</button>
            <button onClick={() => setLocation('/town-hall')} className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer text-sm">Concejo</button>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm glass-panel-heavy px-md py-xs rounded-full border border-tertiary/20 bg-primary-container/65 text-on-surface">
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-bold text-tertiary font-mono">{gold} DUC</span>
          </div>
          <button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer" aria-label="Notificaciones">notifications</button>
          <div className="w-10 h-10 rounded-full border-2 border-tertiary shadow-lg overflow-hidden bg-slate-900">
            <img alt="Gobernador" className="w-full h-full object-cover" src={ASSETS.GOVERNOR}/>
          </div>
        </div>
      </header>

      <main className="relative w-screen h-screen pt-[80px] pb-[80px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Asedio" className="w-full h-full object-cover opacity-50 grayscale contrast-125" src={ASSETS.CITY_BG}/>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between p-margin pointer-events-none text-on-surface">
          <div className="flex justify-between items-start pointer-events-auto">
            <div className="w-full md:w-1/3 glass-panel-heavy p-md rounded-xl bg-primary-container/85 border border-white/10">
              <div className="flex justify-between items-end mb-xs">
                <span className="font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Integridad de la Muralla</span>
                <span className={`font-black text-2xl ${wallIntegrity < 30 ? 'text-error' : 'text-amber-400'}`}>{wallIntegrity}%</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full ${wallIntegrity < 30 ? 'bg-error' : 'bg-amber-400'} wall-pulse transition-all duration-1000`} style={{ width: `${wallIntegrity}%` }}></div>
              </div>
              <p className={`font-bold text-[10px] mt-xs flex items-center gap-xs uppercase ${wallIntegrity < 30 ? 'text-error' : 'text-on-surface-variant'}`}>
                {wallIntegrity < 30 ? `BRECHA INMINENTE EN ${cityName}` : 'Defensas Operativas'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-sm">
              <div className="glass-panel-heavy px-md py-sm rounded-xl border-l-4 border-l-tertiary shadow-lg bg-primary-container/85 border border-white/10">
                <span className="block font-bold text-[10px] text-on-surface-variant uppercase tracking-widest text-right">Estado del Embargo</span>
                <span className="font-black text-lg text-tertiary-fixed uppercase">Comercio Cortado</span>
              </div>
              <div className="glass-panel-heavy px-md py-sm rounded-xl bg-primary-container/60 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant text-right block">Día {siegeDuration} de Sitio</span>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="w-full max-w-xl mx-auto pointer-events-auto p-sm bg-secondary/20 border border-secondary/40 text-secondary rounded-lg text-center font-bold animate-pulse">{feedback}</div>
          )}

          <div className="flex justify-center items-center gap-lg mb-4 pointer-events-auto">
            <button onClick={handleUseOil} className="flex flex-col items-center gap-sm glass-panel-heavy p-lg rounded-2xl hover:scale-105 transition-all bg-primary-container/85 border border-white/10 cursor-pointer text-on-surface">
              <span className="material-symbols-outlined text-[32px]">oil_barrel</span>
              <div className="text-center">
                <span className="block font-bold text-xs">Aceite</span>
                <span className="text-[10px] text-tertiary font-bold">{oilUses} USOS</span>
              </div>
            </button>
            <button onClick={handleUpgradeGate} className="flex flex-col items-center gap-sm glass-panel-heavy p-lg rounded-2xl hover:scale-105 transition-all bg-primary-container/85 border border-white/10 cursor-pointer text-on-surface">
              <span className="material-symbols-outlined text-[32px]">door_sliding</span>
              <div className="text-center">
                <span className="block font-bold text-xs">Reforzar</span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Mejorar</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-md pointer-events-auto">
            <div className="col-span-12 md:col-span-8 flex flex-col md:flex-row gap-md">
              <div className="flex-1 glass-panel-heavy p-md rounded-xl border-t-2 border-secondary bg-primary-container/60">
                <div className="flex items-center justify-between mb-sm">
                  <span className="text-[10px] uppercase text-on-surface-variant font-bold">Moral de la Guarnición</span>
                  <span className="text-secondary font-bold font-mono">{garrisonMorale}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full">
                  <div className="h-full bg-secondary" style={{ width: `${garrisonMorale}%` }}></div>
                </div>
              </div>
              <button onClick={() => setLocation('/town-hall')} className="flex-[1.5] bg-tertiary text-on-tertiary font-black text-xl rounded-xl hover:scale-[1.02] transition-all shadow-xl border-0 cursor-pointer uppercase tracking-widest">
                Concejo de {cityName}
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .glass-panel-heavy { background: rgba(0, 31, 63, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.1); }
        .wall-pulse { animation: pulse-red 2s infinite; }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 180, 171, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 180, 171, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 180, 171, 0); }
        }
        body { background-color: #0c0f17; }
      `}</style>
    </>
  )
}
