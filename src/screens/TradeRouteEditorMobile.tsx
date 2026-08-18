import { useLocation } from 'wouter'
import { useState, useMemo } from 'react'
import { usePlayer, useGame } from '../engine/GameProvider'
import db from '../database/index'

const { CITIES: CITIES_BASE, GOODS: GOODS_BASE } = db

interface MarketOrder {
  icon: string
  name: string
  goodId: string
  status: string
  statusClass: string
  buyBelow: number
  sellAbove: number
}

interface RUTAStop {
  id: number
  cityId: string
  name: string
  active: boolean
  orders: MarketOrder[]
}

export function TradeRouteEditorMobile() {
  const [, setLocation] = useLocation()
  const player = usePlayer()
  const { engine } = useGame()
  
  const [stops, setStops] = useState<RUTAStop[]>([
    {
      id: 1, cityId: 'lubeck', name: 'Lübeck', active: true,
      orders: [
        { icon: 'water_drop', name: 'Sal', goodId: 'salt', status: 'Excedente', statusClass: 'text-emerald-400', buyBelow: 14, sellAbove: 22 },
        { icon: 'forest', name: 'Madera', goodId: 'wood', status: 'Escasez', statusClass: 'text-error', buyBelow: 45, sellAbove: 68 },
      ],
    },
    { id: 2, cityId: 'visby', name: 'Visby', active: false, orders: [] },
  ])
  
  const [feedback, setFeedback] = useState('')

  if (!player) return null

  const toggleStop = (id: number) => {
    setStops(prev => prev.map(s => ({ ...s, active: s.id === id ? !s.active : false })))
  }

  const handleLaunchRoute = () => {
    const activeStops = stops.filter(s => s.active)
    if (activeStops.length < 1) {
      setFeedback('Selecciona al menos una escala activa.')
      return
    }
    const cityIds = activeStops.map(s => s.cityId)
    engine.setPlayerRoute(cityIds, { mobile: true })
    setFeedback('¡Ruta móvil activada!')
    setTimeout(() => { setFeedback(''); setLocation('/world-map'); }, 1500)
  }

  const gold = Math.floor(player.gold).toLocaleString()

  return (
    <main className="w-screen h-screen flex flex-col bg-[#0a0f1a] text-on-surface font-montserrat select-none">
      <header className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation('/city-overview')} className="material-symbols-outlined text-tertiary-fixed bg-transparent border-0 cursor-pointer" aria-label="Volver">arrow_back</button>
          <h1 className="font-black text-xs text-tertiary-fixed uppercase tracking-widest">Rutas Móviles</h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold font-mono text-tertiary-fixed text-xs">{gold} DUC</span>
        </div>
      </header>

      <main className="mt-16 px-4 pt-6 flex-1 overflow-y-auto pb-32">
        <div className="mb-6">
          <h2 className="font-bold text-lg text-white mb-1">Editor de Automatización</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-tighter">Configurando convoy: <span className="text-secondary font-black">ESTRELLA DEL NORTE</span></p>
        </div>

        {feedback && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-center font-bold text-xs animate-pulse">
            {feedback}
          </div>
        )}

        <div className="space-y-4 relative">
          <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-white/5 z-0"></div>

          {stops.map(s => (
            <section 
              key={s.id}
              className={`bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative z-10 transition-all ${s.active ? 'border-amber-500/50 ring-1 ring-amber-500/20 shadow-2xl' : 'opacity-60'}`}
              onClick={() => toggleStop(s.id)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${s.active ? 'bg-amber-400 shadow-[0_0_10px_#ffe088]' : 'bg-white/20'}`}></div>
                  <div>
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest block mb-0.5">ESCALA {s.id}</span>
                    <h3 className="font-black text-white uppercase">{s.name}</h3>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-white/20 transition-transform ${s.active ? 'rotate-180' : ''}`}>expand_more</span>
              </div>
              
              {s.active && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {s.orders.length > 0 ? (
                    <div className="space-y-3">
                      {s.orders.map((o, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-amber-400 text-sm">{o.icon}</span>
                              <span className="font-bold text-xs text-white/80">{o.name}</span>
                            </div>
                            <span className={`text-[9px] font-black uppercase ${o.statusClass}`}>{o.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                              <label className="text-[8px] font-black text-white/30 uppercase block mb-1">MÍN COMPRA</label>
                              <span className="text-emerald-400 font-mono text-xs font-bold">{o.buyBelow} DUC</span>
                            </div>
                            <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                              <label className="text-[8px] font-black text-white/30 uppercase block mb-1">MÁX VENTA</label>
                              <span className="text-amber-400 font-mono text-xs font-bold">{o.sellAbove} DUC</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-white/20 text-xs italic">Sin directivas configuradas</div>
                  )}
                </div>
              )}
            </section>
          ))}

          <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:bg-white/5 transition-all bg-transparent cursor-pointer font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined">add_circle</span>
            Añadir Escala
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-50">
        <button onClick={handleLaunchRoute} className="w-full py-4 bg-amber-500 text-black rounded-2xl font-black shadow-[0_0_30px_rgba(212,175,55,0.3)] active:scale-95 transition-all border-0 cursor-pointer uppercase tracking-widest">
          INICIAR RUTA COMERCIAL
        </button>
      </div>

      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        body { background-color: #0a0f1a; }
      `}</style>
    </main>
  )
}
