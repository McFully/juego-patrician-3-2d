import { useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function TheMerchantSLegacy() {
  const [, setLocation] = useLocation()
  const { state: worldState } = useGame()
  const player = usePlayer()

  const achievements = useMemo(() => {
    if (!player) return []
    return [
      { icon: 'sailing', label: 'Almirante', pct: Math.min((player.fleet.length / 20) * 100, 100) },
      { icon: 'paid', label: 'Magnate', pct: Math.min((player.gold / 500000) * 100, 100) },
      { icon: 'castle', label: 'Urbanista', pct: Math.min((Object.keys(player.tradingOffices || {}).length / 10) * 100, 100) },
      { icon: 'public', label: 'Explorador', pct: 100 },
      { icon: 'handshake', label: 'Diplomático', pct: Math.min(player.reputation, 100) },
      { icon: 'storefront', label: 'Comerciante', pct: 85 },
    ]
  }, [player])

  if (!player) return null

  const historicalImpact = Math.floor(player.gold / 100 + player.reputation * 10 + player.fleet.length * 50)
  const conferredTitle = player.rank || 'Mercader'
  const familyName = player.name.split(' ').length > 1 ? player.name.split(' ')[1] : 'Hanse'

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      
      <header className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div className="flex items-center gap-md">
            <button onClick={() => setLocation('/world-map')} className="material-symbols-outlined text-tertiary-fixed hover:scale-110 transition-transform mr-sm bg-transparent border-0 cursor-pointer" aria-label="Volver al mapa mundial">arrow_back</button>
            <span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
          </div>
          <div className="flex items-center gap-md">
              <div className="glass-panel px-md py-xs rounded-lg text-tertiary-fixed font-bold text-sm bg-black/40 border border-white/5">
                {Math.floor(player.gold).toLocaleString()} DUC
              </div>
          </div>
      </header>

      <main className="flex-1 pt-20 pb-8 px-margin max-w-7xl mx-auto overflow-y-auto custom-scrollbar min-h-0">
          
          <section className="mb-lg text-center relative">
              <h2 className="font-black text-4xl text-tertiary-fixed mb-base uppercase tracking-tighter shadow-glow">El Legado del Mercader</h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto italic font-medium">La estirpe de la Casa {familyName} ha dejado una huella imborrable en la historia de la Liga Hanseática.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-lg mt-xl">
                  <div className="glass-panel p-lg rounded-2xl text-center min-w-0 sm:min-w-[240px] border-tertiary/20 bg-black/40 backdrop-blur-md">
                      <span className="block text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mb-xs">Impacto Histórico</span>
                      <span className="block font-black text-5xl text-on-surface">{historicalImpact.toLocaleString()}</span>
                  </div>
                  <div className="glass-panel p-lg rounded-2xl text-center min-w-0 sm:min-w-[240px] bg-black/40 backdrop-blur-md border border-white/5">
                      <span className="block text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mb-xs">Título Otorgado</span>
                      <span className="block font-black text-4xl text-on-surface uppercase tracking-tight">{conferredTitle}</span>
                  </div>
              </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-xl">
              <div className="md:col-span-8 glass-panel rounded-2xl p-md overflow-hidden bg-black/40 backdrop-blur-md border border-white/10">
                  <h3 className="font-black text-sm text-tertiary-fixed flex items-center gap-sm uppercase tracking-widest mb-md">
                      <span className="material-symbols-outlined">family_history</span>
                      Linaje de la Casa {familyName}
                  </h3>
                  <div className="relative min-h-[300px] flex flex-col items-center py-md">
                      <div className="mb-lg">
                          <div className="relative glass-panel p-base rounded-xl border-tertiary/40 w-48 text-center bg-slate-900 shadow-2xl">
                              <img src={ASSETS.GOVERNOR} alt="Fundador" className="w-16 h-16 mx-auto mb-xs rounded-full border border-tertiary/30 object-cover" />
                              <span className="block font-black text-white uppercase text-sm">{player.name}</span>
                              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Fundador del Imperio</span>
                          </div>
                      </div>
                      <div className="w-px h-12 bg-tertiary/20"></div>
                      <div className="flex gap-md mt-md">
                          <div className="glass-panel p-sm rounded-lg w-32 text-center opacity-50">
                              <div className="w-10 h-10 mx-auto mb-xs rounded-full bg-white/5 border border-white/10"></div>
                              <span className="block text-[10px] font-bold text-white uppercase">Sucesores</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="md:col-span-4 glass-panel rounded-2xl p-md flex flex-col items-center justify-between text-center bg-black/40 border border-white/5">
                  <h3 className="font-black text-sm text-tertiary-fixed uppercase tracking-widest mb-md">Monumento al Mérito</h3>
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-2xl">
                      <img src={ASSETS.STATUE} alt="Estatua" className="w-full h-full object-cover grayscale opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant italic leading-relaxed px-4">"Su nombre resonará en cada puerto donde ondee la bandera de la Hansa."</p>
              </div>
          </div>

          <div className="mt-xl glass-panel rounded-2xl p-md bg-black/40 border border-white/5">
              <h3 className="font-black text-sm text-tertiary-fixed mb-6 uppercase tracking-widest">Galería de Logros</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-md">
                  {achievements.map((a: any) => (
                    <div key={a.label} className="flex flex-col items-center gap-xs">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-xs ${a.pct === 100 ? 'bg-tertiary text-on-tertiary' : 'bg-white/5 text-tertiary-fixed border border-white/5'}`}>
                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                        </div>
                        <span className="text-[9px] font-black text-white/70 uppercase tracking-tighter text-center">{a.label}</span>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                            <div className="bg-secondary h-full" style={{ width: `${a.pct}%` }}></div>
                        </div>
                    </div>
                  ))}
              </div>
          </div>

          <div className="mt-xl flex flex-col md:flex-row gap-lg justify-center">
              <button onClick={() => setLocation('/')} className="bg-tertiary text-on-tertiary px-lg py-md rounded-xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all border-0 cursor-pointer">
                  Menú Principal
              </button>
          </div>
      </main>

      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.05); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe088; border-radius: 10px; }
        .shadow-glow { text-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
      `}</style>
    </div>
  )
}
