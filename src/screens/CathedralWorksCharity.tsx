import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function CathedralWorksCharity() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [feedback, setFeedback] = useState('')

  if (!player) return null

  const currentCityId = player.currentCityId || 'lubeck'
  const cityState = worldState?.simulation?.cities?.[currentCityId]
  const cathedral = cityState?.cathedral || { upgradeLevel: 2, totalDonated: 4500 }
  
  const gold = Math.floor(player.gold).toLocaleString()
  const cityName = cityState?.name?.toUpperCase() || currentCityId.toUpperCase()

  const handleAction = (name: string, cost: number) => {
    if (player.gold < cost) {
      setFeedback('Fondos insuficientes para esta comisión sagrada.')
      setTimeout(() => setFeedback(''), 3000)
      return
    }
    engine.donateToCathedral(cost)
    setFeedback(`Has financiado '${name}' por ${cost.toLocaleString()} DUC. Tu prestigio aumenta.`)
    setTimeout(() => setFeedback(''), 4000)
  }

  const plebsFavor = Math.floor((cathedral.totalDonated / 5000) * 100)
  const patricianFavor = Math.min(Math.floor(player.reputation), 100)

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      <header className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="flex items-center gap-md">
          <span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
          <span className="px-2 py-0.5 text-[10px] bg-white/10 rounded-full text-white/40 uppercase font-black ml-md">{currentCityId}</span>
        </div>
        <nav className="hidden md:flex items-center gap-lg text-on-surface">
          <button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer text-sm">Mapa Mundial</button>
          <button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer text-sm">Libro Mayor</button>
          <button onClick={() => setLocation('/town-hall')} className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer text-sm">Concejo</button>
        </nav>
        <div className="flex items-center gap-md">
          <div className="glass-panel px-md py-xs rounded-full text-tertiary-fixed font-bold text-sm bg-primary-container/40 border border-white/5">
            {gold} DUC
          </div>
          <button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer" aria-label="Centro de mensajes">notifications</button>
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-tertiary overflow-hidden shadow-lg">
            <img alt="Gobernador" className="w-full h-full object-cover" src={ASSETS.GOVERNOR}/>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-margin space-y-lg h-screen overflow-hidden pt-20 pb-8 flex flex-col text-on-surface">
        {feedback && (
          <div className="mb-md p-sm bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-center font-bold animate-pulse shadow-lg">{feedback}</div>
        )}

        <section className="relative flex-none h-[160px] md:h-[240px] w-full rounded-2xl overflow-hidden glass-panel group shadow-2xl border border-white/10">
          <img alt="Catedral" className="absolute inset-0 w-full h-full object-cover opacity-60" src={ASSETS.CATHEDRAL}/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-md w-full flex justify-between items-end">
            <div className="space-y-xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-tertiary-fixed">Hito Cívico</span>
              <h1 className="font-black text-3xl text-on-surface uppercase tracking-tight">Catedral de San Magnus</h1>
              <p className="text-xs text-on-surface-variant max-w-xl font-medium italic">Fase {cathedral.upgradeLevel} de 5. Contribuye al legado en {cityName}.</p>
            </div>
            <div className="glass-panel p-md rounded-xl space-y-xs min-w-0 md:min-w-[280px] bg-black/60 border border-white/5">
              <div className="flex justify-between items-center mb-xs">
                <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">Favor Público</span>
                <span className="text-sm font-black text-tertiary font-mono">{(cathedral.totalDonated / 100).toFixed(0)} / 100</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-tertiary transition-all duration-1000 shadow-[0_0_15px_rgba(212,175,55,0.4)]" style={{ width: `${Math.min(cathedral.totalDonated / 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 overflow-hidden">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-md overflow-hidden">
            <h2 className="font-black text-xl text-on-surface border-l-4 border-tertiary pl-md uppercase tracking-tight">Comisiones Sagradas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md overflow-y-auto custom-scrollbar pr-xs">
              
              <div className="glass-panel p-md rounded-xl hover:border-tertiary transition-all duration-300 group bg-white/5 border border-white/5 flex flex-col justify-between min-h-[160px]">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface mb-xs uppercase">Comisión de la Aguja</h3>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">Financia la mampostería artesanal para los arcos góticos.</p>
                  </div>
                  <div className="flex items-center justify-between mt-md pt-md border-t border-white/5">
                    <span className="font-black text-tertiary-fixed font-mono">12.500 DUC</span>
                    <button onClick={() => handleAction('Comisión de la Aguja', 12500)} className="bg-tertiary text-on-tertiary px-md py-xs rounded-lg font-black text-[10px] hover:scale-105 active:scale-95 transition-all border-0 cursor-pointer uppercase">Financiar</button>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel p-md rounded-xl hover:border-tertiary transition-all duration-300 group bg-white/5 border border-white/5 flex flex-col justify-between min-h-[160px]">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface mb-xs uppercase">Festival del Solsticio</h3>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">Patrocina cerveza y carne gratis para los plebeyos.</p>
                  </div>
                  <div className="flex items-center justify-between mt-md pt-md border-t border-white/5">
                    <span className="font-black text-tertiary-fixed font-mono">4.200 DUC</span>
                    <button onClick={() => handleAction('Festival del Solsticio', 4200)} className="bg-tertiary text-on-tertiary px-md py-xs rounded-lg font-black text-[10px] hover:scale-105 active:scale-95 transition-all border-0 cursor-pointer uppercase">Organizar</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-md rounded-xl space-y-md border border-tertiary/20 bg-black/60 shadow-2xl">
              <h2 className="font-bold text-sm text-on-surface flex items-center gap-sm uppercase tracking-widest border-b border-white/5 pb-2">Dinámica Social en {cityName}</h2>
              <div className="space-y-sm">
                <div className="space-y-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-tight text-white/60">Clase Plebeya</span>
                    <span className="text-[10px] font-black text-secondary">{plebsFavor}% Favor</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${plebsFavor}%` }}></div>
                  </div>
                </div>
                <div className="space-y-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-tight text-white/60">Círculo Patricio</span>
                    <span className="text-[10px] font-black text-tertiary">{patricianFavor}% Apoyo</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary shadow-[0_0_10px_rgba(234,195,73,0.3)]" style={{ width: `${patricianFavor}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe088; border-radius: 10px; }
        body { background-color: #0a0c10; }
      `}</style>
    </div>
  )
}
