import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function AtSeaEncounterMenu() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const encounter = worldState?.simulation?.activeEncounter

  if (!player) return null

  const handleAction = (action: 'fight' | 'flee' | 'surrender') => {
    engine.resolveEncounter(action)
    setLocation('/world-map')
  }

  const enemyFleet = encounter?.enemyFleet
  const enemyShip = enemyFleet?.ships?.[0] || { hp: 80, hpMax: 100, name: 'Venganza' }
  const playerShip = encounter?.ship || player.fleet?.[0] || { name: 'Vanguardia de Lübeck', hp: 92, hpMax: 100 }
  
  const gold = Math.floor(player.gold).toLocaleString()
  const fleetStr = `${player.fleet?.length || 0}/${player.rankIndex * 5 + 5}`

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none" role="dialog" aria-modal="true" aria-label="Encuentro marítimo">
      <img alt="Fondo táctico" className="fixed inset-0 w-full h-full object-cover filter brightness-[0.25] saturate-[0.7]" src={ASSETS.TACTICAL_MAP}/>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="flex items-center gap-md">
          <span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
          <nav className="hidden md:flex gap-md ml-lg">
            <button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer">Mapa Mundial</button>
            <button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors bg-transparent border-0 cursor-pointer">Libro de Cuentas</button>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex gap-sm mr-md border-r border-white/10 pr-md">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-tertiary text-sm">payments</span>
              <span className="font-black text-xs text-tertiary font-mono">{gold}</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-sm">sailing</span>
              <span className="font-black text-xs text-primary font-mono">{fleetStr}</span>
            </div>
          </div>
          <button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed cursor-pointer bg-transparent border-0" aria-label="Notificaciones">notifications</button>
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-tertiary-fixed/30 overflow-hidden">
            <img alt="Gobernador" src={ASSETS.GOVERNOR}/>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center pt-24">
        <div className="glass-modal w-full max-w-6xl mx-margin rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
          
          <div className="col-span-12 md:col-span-3 p-lg flex flex-col justify-between md:border-r border-white/10 bg-black/20">
            <div>
              <h3 className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mb-xs">Tu Escuadra</h3>
              <h2 className="font-black text-2xl text-on-surface uppercase tracking-tight">{playerShip.name}</h2>
              <div className="mt-md space-y-md">
                <div className="p-md glass-panel rounded-xl border border-white/5 bg-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-white/40 uppercase">Condición</span>
                    <span className="text-sm font-black text-secondary">{Math.round((playerShip.hp/playerShip.hpMax)*100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${(playerShip.hp/playerShip.hpMax)*100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs font-medium text-on-surface-variant italic leading-relaxed">"Gobernador, los vientos del Báltico nos han traído compañía. ¿Cuáles son sus órdenes?"</p>
          </div>

          <div className="col-span-12 md:col-span-6 relative flex flex-col items-center justify-center p-xl">
            <div className="absolute top-8 glass-panel px-xl py-xs rounded-full flex flex-wrap items-center gap-md border border-tertiary/20">
              <div className="text-center">
                <span className="block text-[8px] font-black text-on-surface-variant uppercase">Riesgo</span>
                <span className="font-black text-lg text-error">CRÍTICO</span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <span className="material-symbols-outlined text-tertiary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>swords</span>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-center">
                <span className="block text-[8px] font-black text-on-surface-variant uppercase">Victoria</span>
                <span className="font-black text-lg text-secondary">ALTA</span>
              </div>
            </div>

            <div className="relative group mt-12">
              <div className="absolute -inset-12 border-2 border-dashed border-error/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <img alt="Enemigo" className="w-40 h-40 md:w-80 md:h-80 rounded-full object-cover border-4 border-error/40 shadow-[0_0_50px_rgba(255,0,0,0.2)] transition-transform duration-700 group-hover:scale-105" src={ASSETS.ENEMY}/>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 glass-panel px-md py-xs rounded-lg border-error/40 shadow-xl bg-red-950/60">
                <span className="text-[10px] font-black text-error uppercase tracking-widest">{enemyFleet?.name || 'Kogge Mercenaria'}</span>
              </div>
            </div>

            <div className="mt-16 w-full flex gap-md">
              <button onClick={() => handleAction('flee')} className="flex-1 py-md rounded-2xl border-2 border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95 bg-transparent cursor-pointer">Ignorar</button>
              <button onClick={() => handleAction('surrender')} className="flex-1 py-md rounded-2xl border-2 border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95 bg-transparent cursor-pointer">Negociar</button>
              <button onClick={() => handleAction('fight')} className="flex-1 py-md rounded-2xl bg-tertiary text-on-tertiary font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95 border-0 cursor-pointer">Abordar</button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 p-lg flex flex-col justify-between md:border-l border-white/10 bg-error-container/5">
            <div className="text-right">
              <h3 className="text-[10px] font-black text-error uppercase tracking-[0.2em] mb-xs">Hostil</h3>
              <h2 className="font-black text-2xl text-on-surface mb-md uppercase tracking-tight">{enemyFleet?.captain || 'Erik Varg'}</h2>
              <div className="relative inline-block mb-md">
                <img alt="Pirata" className="w-32 h-32 rounded-2xl object-cover border-2 border-error shadow-xl" src={ASSETS.ENEMY}/>
              </div>
              <div className="space-y-md">
                <div className="p-md glass-panel rounded-xl border border-white/5 bg-black/40">
                  <div className="text-[10px] font-black text-white/40 uppercase mb-1">Fuerza Detectada</div>
                  <div className="text-2xl font-black text-error font-mono">{Math.floor(enemyShip.hp * 8)}</div>
                </div>
              </div>
            </div>
            <p className="text-right text-xs font-medium text-on-surface-variant italic leading-relaxed">"Arriad las velas o alimentad a las anguilas, mercader."</p>
          </div>
        </div>
      </main>

      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.05); }
        .glass-modal { background: rgba(0, 31, 63, 0.8); backdrop-filter: blur(32px); }
        .shadow-glow { text-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
      `}</style>
    </div>
  )
}
