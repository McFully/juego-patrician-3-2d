import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function VictoryHistoricalSummary() {
  const [, setLocation] = useLocation()
  const { state: worldState } = useGame()
  const player = usePlayer()

  const stats = useMemo(() => {
    if (!player) return null
    const history = player.financialHistory || []
    const fleet = player.fleet || []
    
    // Count active routes - since engine doesn't explicitly track count, 
    // we use a reasonable estimation or 0
    const activeRoutes = 1; // At least the player has one fleet

    return {
      rank: player.rank || 'Patricio',
      gold: Math.floor(player.gold).toLocaleString(),
      fleetPower: fleet.length,
      cities: Object.keys(player.tradingOffices || {}).length,
      routes: activeRoutes,
      years: Math.floor((worldState?.totalDays || 0) / 360) + 1,
      wealthGrowth: history.length > 0 ? history.map((h: any) => h.gold || 0) : [player.gold]
    }
  }, [player, worldState])

  if (!player || !stats) return null

  const BARS = stats.wealthGrowth.length > 0 ? stats.wealthGrowth : [15, 25, 40, 35, 65, 85, 100]
  const maxBar = Math.max(...BARS, 100)

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</div>
        <div className="flex items-center gap-md">
          <button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-tertiary-fixed hover:scale-105 active:scale-95 transition-transform bg-transparent border-0 cursor-pointer" aria-label="Centro de mensajes">notifications</button>
          <div className="w-10 h-10 rounded-full border border-tertiary/30 overflow-hidden bg-slate-900">
            <img alt="Gobernador" className="w-full h-full object-cover" src={ASSETS.GOVERNOR}/>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-40 px-margin h-screen overflow-y-auto custom-scrollbar flex flex-col items-center relative min-w-0">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <img className="w-full h-full object-cover" src={ASSETS.CITY_BG} alt="Fondo de la ciudad"/>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        </div>

        <section className="relative z-10 text-center mt-lg max-w-4xl">
          <div className="inline-block px-md py-xs bg-tertiary/20 border border-tertiary text-tertiary rounded-full font-black text-[10px] mb-base tracking-widest uppercase shadow-glow">Resumen Histórico</div>
          <h1 className="font-black text-5xl text-on-surface mb-sm drop-shadow-2xl uppercase tracking-tighter">Trayectoria de {player.name}</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto italic font-medium leading-relaxed">
            Tu impacto en el Báltico ha sido documentado por los cronistas de la Hansa.
          </p>
        </section>

        <section className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-gutter mt-xl overflow-x-auto">
          <div className="md:col-span-8 glass-panel-heavy rounded-2xl p-lg flex flex-col justify-between bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
            <div>
              <h2 className="font-black text-sm text-tertiary mb-md flex items-center gap-sm uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">stars</span>
                Resumen del Legado
              </h2>
              <div className="flex flex-col gap-sm">
                <div className="flex justify-between items-end border-b border-white/5 pb-sm">
                  <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">Rango Alcanzado</span>
                  <span className="text-2xl font-black text-white uppercase">{stats.rank}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-sm">
                  <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">Oro Acumulado</span>
                  <span className="text-2xl font-black text-secondary font-mono">{stats.gold} DUC</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-sm">
                  <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">Flota Mercantil</span>
                  <span className="text-2xl font-black text-white">{stats.fleetPower} Buques</span>
                </div>
              </div>
            </div>
            <div className="mt-lg pt-lg border-t border-white/10 grid grid-cols-3 gap-md text-center">
              <div>
                <div className="text-on-surface-variant font-black text-[10px] uppercase mb-xs tracking-widest">Oficinas</div>
                <div className="text-3xl font-black text-tertiary-fixed">{stats.cities}</div>
              </div>
              <div>
                <div className="text-on-surface-variant font-black text-[10px] uppercase mb-xs tracking-widest">Rutas</div>
                <div className="text-3xl font-black text-tertiary-fixed">{stats.routes}</div>
              </div>
              <div>
                <div className="text-on-surface-variant font-black text-[10px] uppercase mb-xs tracking-widest">Tiempo</div>
                <div className="text-3xl font-black text-tertiary-fixed">{stats.years}A</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 glass-panel rounded-2xl p-md flex flex-col bg-black/40 backdrop-blur-md border border-white/5">
            <h3 className="font-black text-[10px] text-on-surface-variant uppercase tracking-widest mb-lg text-center">Historial de Riqueza</h3>
            <div className="flex-grow flex items-end justify-between gap-1 px-base mb-md h-48">
              {BARS.map((h: any, i: number) => (
                <div key={i} className={`w-full ${i === BARS.length - 1 ? 'bg-tertiary shadow-glow' : 'bg-secondary/40'} rounded-t-sm transition-all duration-1000`} style={{ height: `${(h / maxBar) * 100}%` }}></div>
              ))}
            </div>
            <p className="mt-lg text-[11px] text-on-surface-variant leading-relaxed italic text-center px-2">
              Progreso financiero documentado durante tu carrera comercial.
            </p>
          </div>
        </section>

        <section className="relative z-10 flex flex-col md:flex-row gap-lg mt-xl">
          <button onClick={() => setLocation('/legacy')} className="px-xl py-md bg-tertiary text-on-tertiary font-black rounded-xl hover:scale-105 transition-all shadow-xl border-0 cursor-pointer uppercase tracking-widest text-sm">
            Ver Legado
          </button>
          <button onClick={() => setLocation('/')} className="px-xl py-md border-2 border-white/10 bg-white/5 text-on-surface font-bold rounded-xl hover:bg-white/10 transition-all cursor-pointer uppercase tracking-widest text-sm">
            Menú Principal
          </button>
        </section>
      </main>

      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.1); }
        .glass-panel-heavy { background: rgba(0, 31, 63, 0.85); backdrop-filter: blur(24px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe088; border-radius: 10px; }
        .shadow-glow { text-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
      `}</style>
    </div>
  )
}
