import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const MARKET_RUMORS = [
  { text: 'Se rumorea que el precio del Lino subirá un 40% en Brujas la próxima temporada.', risk: 'Bajo' },
  { text: 'Una flota imperial bloquea el puerto de Riga. El Hierro puede escasear.', risk: 'Alto' },
  { text: 'Hay un vendedor dispuesto a ceder una licencia de pesca de bacalao por 3.000 DUC.', risk: 'Medio' },
]

export function HanseaticLeagueMissionBoard() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'missions'|'rumors'>('missions')

  if (!player) return null

  const activeMissions = worldState?.politics?.activeMissions || []
  
  const availableMissions = [
    {
      id: 'pirate_ralf', type: 'Combate', title: 'El Azote del Skagerrak', icon: 'swords',
      desc: 'El pirata Ralf Bluthardt siembra el terror en la ruta entre Hamburgo y Bergen.',
      reward: 4000, difficulty: 'Alta', timeLimit: '30 días', color: 'red',
    },
    {
      id: 'supply_visby', type: 'Suministro', title: 'Grano para Visby', icon: 'local_shipping',
      desc: 'Visby sufre escasez severa. Entrega 150t de grano antes de que llegue el invierno.',
      reward: 2800, difficulty: 'Media', timeLimit: '15 días', color: 'emerald',
    }
  ]

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleAccept = (missionId: string, title: string) => {
    const success = engine.startMission(missionId)
    if (success) {
      flash(`✓ Misión aceptada: "${title}".`, 'ok')
    } else {
      flash('Error al aceptar la misión.', 'err')
    }
  }

  const gold = Math.floor(player.gold).toLocaleString()

  const diffColor = (d: string) =>
    d === 'Alta' || d === 'Muy Alta' ? 'text-red-400' :
    d === 'Media' ? 'text-amber-400' : 'text-emerald-400'

  const typeColor = (c: string) => ({
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }[c] || 'bg-white/10 text-white border-white/20')

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 flex flex-col select-none">
      <header className="flex-none px-6 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-sm flex flex-wrap items-center gap-4">
        <button onClick={() => setLocation('/city-overview')} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-white/70 hover:text-white text-sm">
          <span className="material-symbols-outlined text-base">arrow_back</span> Volver
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">assignment</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Tablero de Misiones</h1>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-amber-300">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="font-mono font-bold">{gold} DUC</span>
          </div>
        </div>
      </header>

      {msg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {msg}
        </div>
      )}

      <div className="flex-none flex gap-1 px-6 pt-3 border-b border-white/10" role="tablist" aria-label="Secciones del tablero de misiones">
        {[
          { id: 'missions', label: 'Misiones', icon: 'assignment', count: availableMissions.length + activeMissions.length },
          { id: 'rumors',   label: 'Rumores', icon: 'forum',      count: MARKET_RUMORS.length },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} role="tab" aria-selected={activeTab === t.id} aria-controls={`panel-${t.id}`} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-semibold transition-all border-b-2 ${activeTab === t.id ? 'border-amber-500 text-amber-300 bg-amber-500/10' : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined text-base">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {activeTab === 'missions' ? (
          <div role="tabpanel" id="panel-missions" aria-label="Misiones">
            {activeMissions.map((m: any) => (
              <div key={m.id} className="glass-panel rounded-xl p-5 border border-amber-500/30 bg-amber-500/5">
                <h3 className="text-white font-bold">{m.title}</h3>
                <p className="text-white/50 text-sm">{m.description}</p>
              </div>
            ))}
            {availableMissions.map(m => (
              <div key={m.id} className="glass-panel rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${typeColor(m.color)}`}><span className="material-symbols-outlined">{m.icon}</span></div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{m.title}</h3>
                    <p className="text-white/50 text-xs">{m.desc}</p>
                  </div>
                  <button onClick={() => handleAccept(m.id, m.title)} className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-sm border-0 cursor-pointer">ACEPTAR</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3" role="tabpanel" id="panel-rumors" aria-label="Rumores">
            {MARKET_RUMORS.map((r, i) => (
              <div key={i} className="glass-panel rounded-xl p-4 border border-white/5">
                <p className="text-white/70 text-sm italic">"{r.text}"</p>
                <span className="text-[10px] text-amber-400 font-bold uppercase">Riesgo {r.risk}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.05); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe088; border-radius: 10px; }
      `}</style>
    </main>
  )
}
