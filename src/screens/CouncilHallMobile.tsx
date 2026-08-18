import { useLocation } from 'wouter'
import { useState } from 'react'
import { useGame, usePlayer } from '../engine/GameProvider'

const DECREES = [
  { id: 1, label: 'Impuesto Portuario', votes: '12 / 25', status: 'Pendiente', icon: 'toll', desc: 'Aumenta ingresos +15% pero reduce felicidad.' },
  { id: 2, label: 'Requisición de Grano', votes: '18 / 25', status: 'Aprobándose', icon: 'grain', desc: 'Asegura suministro durante escasez.' },
  { id: 3, label: 'Presupuesto Naval', votes: '8 / 25', status: 'Fallando', icon: 'directions_boat', desc: 'Asigna fondos para buques de guerra.' },
]

export function CouncilHallMobile() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [tab, setTab] = useState<'decrees' | 'councilors'>('decrees')
  const [feedback, setFeedback] = useState('')

  if (!player) return null

  const currentCityId = player.currentCityId || 'lubeck'
  const councillors = worldState?.politics?.councillors || []
  const gold = Math.floor(player.gold).toLocaleString()

  const handleBribe = (index: number, name: string) => {
    if (player.gold < 500) {
      setFeedback('Fondos insuficientes.')
      setTimeout(() => setFeedback(''), 3000)
      return
    }
    const ok = engine.bribeCouncillor(currentCityId, index, 500)
    if (ok) {
      setFeedback(`Incentivo enviado a ${name}.`)
    } else {
      setFeedback('Error al procesar.')
    }
    setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <main className="w-screen h-screen flex flex-col bg-slate-950 text-on-surface font-montserrat">
      <header className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation('/city-overview')} className="material-symbols-outlined text-tertiary-fixed bg-transparent border-0 cursor-pointer" aria-label="Volver a la vista de la ciudad">arrow_back</button>
          <h1 className="font-black text-sm text-tertiary-fixed uppercase tracking-widest">Sala del Concejo</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold font-mono text-tertiary-fixed text-xs">{gold} DUC</span>
        </div>
      </header>

      <div className="mt-16 flex border-b border-white/10 bg-black/20" role="tablist">
        {['decrees', 'councilors'].map((t) => (
          <button
            key={t}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-white/40'}`}
            onClick={() => setTab(t as typeof tab)}
            role="tab"
            aria-selected={tab === t}
          >
            {t === 'decrees' ? 'Decretos' : 'Concejales'}
          </button>
        ))}
      </div>

      <main className="flex-grow overflow-y-auto p-4 pb-24 space-y-4">
        {feedback && (
          <div className="p-3 rounded-lg bg-secondary/20 border border-secondary/40 text-secondary text-center font-bold text-xs animate-pulse">
            {feedback}
          </div>
        )}
        
        {tab === 'decrees' ? (
          <div role="tabpanel">
          {DECREES.map((decree) => (
            <div key={decree.id} className="bg-black/40 border border-white/10 rounded-xl p-4 shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary-fixed">{decree.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xs uppercase">{decree.label}</h3>
                  <p className="text-[10px] text-white/40 leading-tight">{decree.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-secondary" style={{ width: '60%' }} />
                </div>
                <span className="text-[10px] font-black text-secondary uppercase">{decree.status}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-secondary text-black py-2 rounded-lg text-[10px] font-black uppercase border-0">VOTAR SÍ</button>
                <button className="flex-1 border border-white/20 text-white/60 py-2 rounded-lg text-[10px] font-black uppercase bg-transparent">VETAR</button>
              </div>
            </div>
          ))}
          </div>
        ) : (
          <div role="tabpanel">
          {councillors.map((c: any, i: number) => {
            const support = Math.floor((c.support || 0) * 100)
            return (
              <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center border border-tertiary/30 text-tertiary font-black">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xs">{c.name}</h3>
                  <div className="h-1 w-full bg-white/5 rounded-full mt-1">
                    <div className="h-full bg-secondary" style={{ width: `${support}%` }} />
                  </div>
                  <button onClick={() => handleBribe(i, c.name)} className="mt-2 w-full bg-tertiary/10 text-tertiary-fixed border border-tertiary/20 py-1 rounded text-[9px] font-black uppercase">Influir (+500)</button>
                </div>
              </div>
            )
          })}
          </div>
        )}
      </main>
    </main>
  )
}
