import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const AUCTIONS = [
  { id: 1, name: 'El Gran Grifo (Kogge Nivel IV)', type: 'Embarcación', currentBid: 85200, minIncrement: 5000, timeLeft: '12:45', bidders: 4, condition: 'Excelente' },
]

const EXPEDITIONS = [
  { id: 1, name: 'Ruta de la Seda del Norte', status: 'En ruta', progress: 65, profit: '+12.4k' },
]

const RANKINGS = [
  { rank: 1, name: 'Aritz Bahamonde', city: 'Lübeck', title: 'Patricio', score: 12450 },
]

const TABS = [
  { id: 'auctions', label: 'Subastas', icon: 'gavel', count: AUCTIONS.length },
  { id: 'expeditions', label: 'Expediciones', icon: 'sailing', count: EXPEDITIONS.length },
  { id: 'ranking', label: 'Clasificación', icon: 'leaderboard', count: null },
] as const

const statusColor = (s: string) => {
  if (s === 'En ruta') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  if (s === 'Cargando') return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
}

export function MerchantGuild() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'auctions'|'expeditions'|'ranking'>('auctions')
  const [bidding, setBidding] = useState<number|null>(null)

  const currentCityId = player?.currentCityId || 'lubeck'
  const activeAuction = worldState?.politics?.auctions || null
  const playerName = player?.name || 'Comerciante'

  if (!player) return null

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleBid = (auction: any) => {
    const needed = auction.currentBid + 1000 // Fixed increment for now
    if (player.gold >= needed) {
      setBidding(null)
      flash(`✓ Oferta de ${needed.toLocaleString()} DUC realizada por: ${auction.target.buildingType}`, 'ok')
    } else {
      flash(`Fondos insuficientes. Necesitas ${needed.toLocaleString()} DUC`, 'err')
    }
  }

  // Update RANKINGS to include the actual player
  const dynamicRankings = RANKINGS.map(r => 
    r.name === 'Aritz Bahamonde' ? { ...r, name: playerName, score: Math.round(player.reputation * 1000) } : r
  ).sort((a, b) => b.score - a.score).map((r, i) => ({ ...r, rank: i + 1 }))

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 flex flex-col select-none">

      {/* ── HEADER ── */}
      <header className="flex-none px-6 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-sm flex flex-wrap items-center gap-4 min-w-0">
        <button
          onClick={() => setLocation('/city-overview')}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-white/70 hover:text-white text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">military_tech</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Gremio de Mercaderes</h1>
          <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">Sindicato de {currentCityId.toUpperCase()}</span>
        </div>
        <div className="ml-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-tertiary-fixed">
            <span className="material-symbols-outlined text-base">emoji_events</span>
            <span className="text-xs font-bold uppercase tracking-tight">Rango: {worldState?.politics?.rank || 'Aprendiz'}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="font-mono font-bold">{Math.floor(player.gold).toLocaleString()} DUC</span>
          </div>
        </div>
      </header>

      {/* ── TOAST ── */}
      {msg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {msg}
        </div>
      )}

      {/* ── TABS ── */}
      <div className="flex-none flex flex-wrap gap-1 px-6 pt-3 border-b border-white/10">
        {TABS.map((t: any) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-semibold transition-all border-b-2 ${
              activeTab === t.id
                ? 'border-amber-500 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            {t.label}
            {t.count !== null && (
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* SUBASTAS */}
        {activeTab === 'auctions' && (
          <div className="space-y-4">
            <p className="text-white/40 text-sm">Subasta en curso — Puja por activos estratégicos de la Liga.</p>
            {activeAuction ? (
              <div key="active" className="glass-panel rounded-xl p-5 flex flex-col gap-4 border border-amber-500/40 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="flex-none w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/20 text-purple-400">
                    <span className="material-symbols-outlined">warehouse</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold truncate">{activeAuction.target.buildingType} de {activeAuction.target.ownerId}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/50">Propiedad Forzada</span>
                    </div>
                    <div className="flex gap-4 text-xs text-white/40">
                      <span>Ciudad: <span className="text-white/70">{activeAuction.target.cityId}</span></span>
                      <span>{activeAuction.bids.length} pujas realizadas</span>
                      <span className="text-red-400">⏳ Turnos restantes: {activeAuction.turnsLeft}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-300 font-mono">{activeAuction.currentBid.toLocaleString()}</div>
                    <div className="text-xs text-white/40">DUC — Puja actual</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-white/40">
                    Máximo postor: <span className="text-amber-300 font-bold uppercase">{activeAuction.highestBidder || 'Nadie'}</span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    {bidding === 999 ? (
                      <>
                        <button
                          onClick={() => setBidding(null)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 text-sm transition-all"
                        >Cancelar</button>
                        <button
                          onClick={() => handleBid(activeAuction)}
                          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
                        >✓ Confirmar Puja (+1k)</button>
                      </>
                    ) : (
                      <button
                        onClick={() => setBidding(999)}
                        className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-sm transition-all"
                      >
                        <span className="material-symbols-outlined text-sm mr-1">gavel</span>
                        Pujar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 glass-panel rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-4xl text-white/20">gavel</span>
                <p className="text-white/30 mt-2 italic">No hay subastas forzadas en {currentCityId.toUpperCase()} en este momento.</p>
              </div>
            )}
            
            {/* Legend/Static Auctions */}
            <div className="opacity-50 pointer-events-none">
              <h4 className="text-[10px] font-bold text-white/30 uppercase mb-2">Próximas Subastas (Programadas)</h4>
              {AUCTIONS.slice(0, 1).map(a => (
                <div key={a.id} className="glass-panel rounded-xl p-4 flex items-center gap-4 border border-white/5 grayscale">
                  <span className="material-symbols-outlined text-white/20">inventory_2</span>
                  <div className="flex-1 text-xs text-white/30">{a.name} - {a.type}</div>
                  <div className="text-white/20 font-mono italic">Inicia en {a.timeLeft}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPEDICIONES */}
        {activeTab === 'expeditions' && (
          <div className="space-y-4">
            <p className="text-white/40 text-sm">Explora más allá de la Hansa — Rutas mediterráneas y del Nuevo Mundo.</p>
            {EXPEDITIONS.map(e => (
              <div key={e.id} className="glass-panel rounded-xl p-5 space-y-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold">{e.name}</h3>
                    <div className="flex gap-3 mt-1">
                      <span className={`px-2 py-0.5 text-[10px] rounded border font-bold uppercase ${statusColor(e.status)}`}>{e.status}</span>
                      <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">payments</span>
                        Beneficio Est.: <span className="text-white/70">{e.profit} DUC</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-300 font-mono">{e.progress}%</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-tighter">Progreso</div>
                  </div>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-[3000ms]" style={{ width: `${e.progress}%` }} />
                </div>
              </div>
            ))}
            <button
              onClick={() => setLocation('/expedition-map')}
              className="w-full py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Preparar Nueva Expedición
            </button>
          </div>
        )}

        {/* CLASIFICACIÓN */}
        {activeTab === 'ranking' && (
          <div className="space-y-2">
            <p className="text-white/40 text-sm mb-4">Clasificación de comerciantes de la Liga Hanseática.</p>
            {dynamicRankings.map(r => (
              <div
                key={r.rank}
                className={`glass-panel rounded-xl p-4 flex items-center gap-4 ${r.name === playerName ? 'border border-amber-500/40 bg-amber-500/5' : ''}`}
              >
                <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  r.rank === 1 ? 'bg-yellow-500/30 text-yellow-300' :
                  r.rank === 2 ? 'bg-slate-400/30 text-slate-300' :
                  r.rank === 3 ? 'bg-amber-700/30 text-amber-500' :
                  'bg-white/10 text-white/40'
                }`}>#{r.rank}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold truncate ${r.name === playerName ? 'text-amber-300' : 'text-white'}`}>{r.name}</span>
                    {r.name === playerName && <span className="text-xs text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">(Tú)</span>}
                  </div>
                  <div className="text-xs text-white/40">{r.city} · {r.title}</div>
                </div>
                <div className="text-right font-mono font-bold text-white/80">{r.score.toLocaleString()} pts</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
