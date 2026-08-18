import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const DECREES = [
  {
    id: 'trade_tax',
    title: 'Decreto Fiscal de Comercio',
    desc: 'Incremento del 5% en impuestos sobre mercancías importadas para financiar la defensa del puerto.',
    impact: [
      { label: 'Ingresos municipales', value: '+2.400 DUC/mes', positive: true },
      { label: 'Comercio exterior', value: '−8%', positive: false },
      { label: 'Popularidad', value: '−5 pts', positive: false },
    ],
    votesFor: 7, votesAgainst: 3, status: 'Votación activa',
  },
  {
    id: 'expansion',
    title: 'Expansión del Puerto',
    desc: 'Construcción de dos nuevos muelles para aumentar la capacidad de carga y atracción de flotas extranjeras.',
    impact: [
      { label: 'Capacidad puerto', value: '+40 barcos', positive: true },
      { label: 'Ingresos portuarios', value: '+15%', positive: true },
      { label: 'Costo único', value: '−18.000 DUC', positive: false },
    ],
    votesFor: 9, votesAgainst: 1, status: 'Aprobado',
  },
]



const EVENTS = [
  { date: '12 Mar 1400', event: 'Decreto Fiscal aprobado (8-2)', type: 'decreto' },
  { date: '5 Feb 1400', event: 'Nueva ruta postal hacia Hamburgo', type: 'info' },
  { date: '28 Ene 1400', event: 'Incendio en almacén municipal. Daños: 3.200 DUC', type: 'crisis' },
]

export function TownHall() {
  const [, setLocation] = useLocation()
  const { engine, state } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'decrees'|'council'|'log'>('decrees')
  const [voted, setVoted] = useState<Record<string, 'for'|'against'>>({})

  if (!player) return null

  const currentCityId = player?.currentCityId || 'lubeck'
  const cityState = state?.simulation?.cities?.[currentCityId]

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleVote = (decreeId: string, support: boolean) => {
    // Check if player has the rank to vote (Index 4: Councilor)
    if (player.rankIndex < 4) {
      flash('Error: Debes ser Consejero para votar en el ayuntamiento.', 'err')
      return
    }
    setVoted(v => ({ ...v, [decreeId]: support ? 'for' : 'against' }))
    flash(
      support
        ? '✓ Voto A FAVOR registrado. El consejo delibera.'
        : '✓ Voto EN CONTRA (VETO) registrado.',
      'ok'
    )
  }

  const TABS = [
    { id: 'decrees', label: 'Decretos', icon: 'policy' },
    { id: 'council', label: 'Consejo', icon: 'how_to_vote' },
    { id: 'log', label: 'Registro', icon: 'history' },
  ] as const

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
          <span className="material-symbols-outlined text-amber-400">account_balance</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Ayuntamiento</h1>
          <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">Cámara Municipal de {currentCityId.toUpperCase()}</span>
        </div>
        <div className="ml-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-blue-300">
            <span className="material-symbols-outlined text-base">how_to_vote</span>
            <span className="text-xs">Sede Municipal · {currentCityId.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="font-mono font-bold">{Math.floor(player.gold).toLocaleString()} DUC</span>
          </div>
        </div>
      </header>

      {/* ── TOAST ── */}
      {msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {msg}
        </div>
      )}

      {/* ── STATS ROW ── */}
      <div className="flex-none grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3 border-b border-white/10">
        {[
          { label: 'Censo Ciudadano', value: (cityState?.population || 0).toLocaleString(), icon: 'groups', color: 'text-emerald-400' },
          { label: 'Estabilidad Política', value: '74 / 100', icon: 'balance', color: 'text-blue-400' },
          { label: 'Reputación Local', value: `${Math.floor(player.reputation)}%`, icon: 'thumb_up', color: 'text-amber-400' },
          { label: 'Fondos Municipales', value: '42.300 DUC', icon: 'savings', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-lg px-4 py-2 flex items-center gap-3">
            <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
            <div>
              <div className={`font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div className="flex-none flex flex-wrap gap-1 px-6 pt-3 border-b border-white/10">
        {TABS.map(t => (
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
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* DECRETOS */}
        {activeTab === 'decrees' && (
          <div className="space-y-4">
            {DECREES.map(d => {
              const myVote = voted[d.id]
              const total = d.votesFor + d.votesAgainst
              const pct = Math.round((d.votesFor / total) * 100)
              return (
                <div key={d.id} className="glass-panel rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-none w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-400">policy</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold">{d.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${
                          d.status === 'Aprobado'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        }`}>{d.status}</span>
                      </div>
                      <p className="text-white/50 text-sm">{d.desc}</p>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {d.impact.map(i => (
                      <div key={i.label} className={`px-3 py-2 rounded-lg text-xs text-center ${i.positive ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                        <div className={`font-bold font-mono ${i.positive ? 'text-emerald-400' : 'text-red-400'}`}>{i.value}</div>
                        <div className="text-white/40 mt-0.5">{i.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Vote bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/40">
                      <span>A favor: {d.votesFor}</span>
                      <span>En contra: {d.votesAgainst}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Voting buttons */}
                  {d.status === 'Votación activa' && (
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      {myVote && (
                        <div className="text-xs text-white/40 mr-auto self-center">
                          Tu voto: <span className={myVote === 'for' ? 'text-emerald-400' : 'text-red-400'}>{myVote === 'for' ? 'A FAVOR' : 'EN CONTRA'}</span>
                        </div>
                      )}
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={() => handleVote(d.id, true)}
                          disabled={!!myVote}
                          className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm font-bold transition-all disabled:opacity-40"
                        >✓ Apoyar</button>
                        <button
                          onClick={() => handleVote(d.id, false)}
                          disabled={!!myVote}
                          className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-sm font-bold transition-all disabled:opacity-40"
                        >✗ Vetar</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* CONSEJO */}
        {activeTab === 'council' && (
          <div className="space-y-2">
            <p className="text-white/40 text-sm mb-4">Composición del Consejo Municipal. Un concejal sobornado (LEAL) apoyará tus propuestas de decretos en las asambleas.</p>
            {(state?.politics?.councillors || []).map((c: any, index: number) => {
              const stance = c.bribed ? 'favor' : 'contra'
              const influencePct = Math.round((c.voteWeight || 0.2) * 250) // Normalize weight to a visual 0-100% scale
              
              const handleBribe = () => {
                const bribeCost = 1000
                if (player.gold < bribeCost) {
                  flash('Fondos insuficientes. Se requieren 1.000 DUC para sobornar.', 'err')
                  return
                }
                const ok = engine.bribeCouncillor(currentCityId, index, bribeCost)
                if (ok) {
                  flash(`✓ Concejal ${c.name} sobornado con éxito por 1.000 DUC. Ahora es LEAL.`, 'ok')
                } else {
                  flash('Error al procesar el soborno (ya sobornado o error del motor).', 'err')
                }
              }

              return (
                <div key={index} className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:border-amber-500/20 transition-all">
                  <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center ${stance === 'favor' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <span className="material-symbols-outlined">{stance === 'favor' ? 'thumb_up' : 'thumb_down'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">Concejal {c.name}</div>
                    <div className="text-white/40 text-xs">{c.bribed ? 'Patrocinado por el jugador' : 'Independiente'}</div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">Influencia</span>
                      <span className="text-white/70">{influencePct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div className={`h-full rounded-full ${stance === 'favor' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${influencePct}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${stance === 'favor' ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
                      {stance === 'favor' ? 'LEAL (A FAVOR)' : 'OPOSICIÓN'}
                    </span>
                    {!c.bribed && (
                      <button
                        onClick={handleBribe}
                        className="px-2.5 py-2.5 text-sm font-bold bg-amber-500/20 hover:bg-amber-500 border border-amber-500/35 hover:text-black rounded transition-all"
                      >
                        Sobornar (1k DUC)
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* REGISTRO */}
        {activeTab === 'log' && (
          <div className="space-y-2">
            <p className="text-white/40 text-sm mb-4">Historial de decisiones municipales.</p>
            {EVENTS.map((e, i) => (
              <div key={i} className="glass-panel rounded-xl p-4 flex items-center gap-4">
                <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center ${
                  e.type === 'decreto' ? 'bg-amber-500/20 text-amber-400' :
                  e.type === 'crisis' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {e.type === 'decreto' ? 'policy' : e.type === 'crisis' ? 'warning' : 'info'}
                  </span>
                </div>
                <div className="flex-1 text-sm text-white/70">{e.event}</div>
                <span className="text-xs text-white/30">{e.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
