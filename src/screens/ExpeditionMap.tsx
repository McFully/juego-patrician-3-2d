import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const DESTINATIONS = [
  {
    id: 'lisboa', name: 'Lisboa', region: 'Península Ibérica',
    distance: '2.800 km', duration: '45 días', danger: 'Alta', reward: '8.000–15.000 DUC',
    icon: 'anchor', available: true, discovered: true,
    desc: 'Puerto atlántico con acceso a especias y seda de Oriente. Alta rentabilidad, alta peligrosidad marítima.',
  },
  {
    id: 'alexandria', name: 'Alejandría', region: 'Norte de África',
    distance: '4.200 km', duration: '70 días', danger: 'Muy Alta', reward: '20.000–40.000 DUC',
    icon: 'explore', available: true, discovered: true,
    desc: 'Ciudad milenaria de comercio. Acceso a bienes exóticos de África y Asia. Ruta peligrosa y muy lucrativa.',
  },
  {
    id: 'novgorod_east', name: 'Novgorod Este', region: 'Rusia Interior',
    distance: '1.400 km', duration: '25 días', danger: 'Media', reward: '5.000–9.000 DUC',
    icon: 'forest', available: true, discovered: true,
    desc: 'Ricos mercados de pieles y miel. Acceso a rutas de la Ruta de la Seda hacia el este.',
  },
  {
    id: 'incognita', name: 'Tierra Incógnita', region: 'Desconocida',
    distance: '???', duration: '???', danger: 'Extrema', reward: 'Incalculable',
    icon: 'help', available: false, discovered: false,
    desc: 'Rumores de tierras al oeste del horizonte. Nadie que haya ido ha regresado para contarlo.',
  },
]

const MY_EXPEDITIONS = [
  { name: 'Exploración Lisboa', dest: 'Lisboa', status: 'Regresando', days: 8, ships: 2, profit: 11400 },
  { name: 'Misión Novgorod', dest: 'Novgorod Este', status: 'Cargando', days: 3, ships: 1, profit: null },
]

export function ExpeditionMap() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'map'|'active'>('map')
  const [selected, setSelected] = useState<string | null>(null)

  if (!player) return null

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleSend = (dest: typeof DESTINATIONS[0]) => {
    if (!dest.available) {
      flash('Destino no desbloqueado todavía.', 'err')
      return
    }
    // We can simulate an engine call or use missions system
    flash(`✓ ¡Expedición enviada hacia ${dest.name}! Duración estimada: ${dest.duration}.`, 'ok')
    setSelected(null)
  }

  const gold = Math.floor(player.gold).toLocaleString()

  const dangerColor = (d: string) =>
    d === 'Extrema' ? 'text-red-500' :
    d === 'Muy Alta' ? 'text-orange-400' :
    d === 'Alta' ? 'text-amber-400' : 'text-emerald-400'

  const selectedDest = DESTINATIONS.find(d => d.id === selected)

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900 flex flex-col select-none">

      {/* ── HEADER ── */}
      <header className="flex-none px-6 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-sm flex flex-wrap items-center gap-4">
        <button
          onClick={() => setLocation('/city-overview')}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-white/70 hover:text-white text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400">explore</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Mapa de Expediciones</h1>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-blue-300">
            <span className="material-symbols-outlined text-base">sailing</span>
            <span>{MY_EXPEDITIONS.length} expedición(es) activa(s)</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="font-mono font-bold">{gold} DUC</span>
          </div>
        </div>
      </header>

      {/* ── TOAST ── */}
      {msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {msg}
        </div>
      )}

      {/* ── TABS ── */}
      <div className="flex-none flex gap-1 px-6 pt-3 border-b border-white/10" role="tablist" aria-label="Secciones de expediciones">
        {[
          { id: 'map',    label: 'Destinos', icon: 'map' },
          { id: 'active', label: 'Mis Expediciones', icon: 'sailing' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            role="tab"
            aria-selected={activeTab === t.id}
            aria-controls={`panel-${t.id}`}
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
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 p-4">

        {/* DESTINOS */}
        {activeTab === 'map' && (
          <div role="tabpanel" id="panel-map" aria-label="Destinos">
            {/* Destination list */}
            <div className="w-full md:w-80 flex flex-col gap-3 overflow-y-auto">
              {DESTINATIONS.map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelected(d.id === selected ? null : d.id)}
                  className={`glass-panel rounded-xl p-4 cursor-pointer transition-all ${
                    selected === d.id ? 'border border-amber-500/50 bg-amber-500/5' : 'hover:bg-white/5'
                  } ${!d.available ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.discovered ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/30'}`}>
                      <span className="material-symbols-outlined">{d.icon}</span>
                    </div>
                    <div>
                      <div className={`font-bold ${d.discovered ? 'text-white' : 'text-white/30'}`}>{d.name}</div>
                      <div className="text-white/40 text-xs">{d.region}</div>
                    </div>
                    {!d.available && (
                      <span className="ml-auto material-symbols-outlined text-white/20">lock</span>
                    )}
                  </div>
                  {d.discovered && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                      <span className="text-white/40">Peligro: <span className={dangerColor(d.danger)}>{d.danger}</span></span>
                      <span className="text-white/40">Duración: <span className="text-white/70">{d.duration}</span></span>
                      <span className="text-white/40 col-span-2">Recompensa: <span className="text-emerald-400">{d.reward}</span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Detail panel */}
            <div className="flex-1">
              {selectedDest ? (
                <div className="glass-panel rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-400 text-3xl">{selectedDest.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-bold">{selectedDest.name}</h2>
                      <p className="text-white/40">{selectedDest.region}</p>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-6">{selectedDest.desc}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { label: 'Distancia', value: selectedDest.distance, icon: 'straighten' },
                      { label: 'Duración', value: selectedDest.duration, icon: 'schedule' },
                      { label: 'Nivel de Peligro', value: selectedDest.danger, icon: 'warning' },
                      { label: 'Recompensa Est.', value: selectedDest.reward, icon: 'paid' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/5 rounded-xl p-4">
                        <span className="material-symbols-outlined text-amber-400 text-base block mb-1">{s.icon}</span>
                        <div className={`font-bold font-mono text-sm ${s.label === 'Nivel de Peligro' ? dangerColor(selectedDest.danger) : s.label === 'Recompensa Est.' ? 'text-emerald-400' : 'text-white'}`}>{s.value}</div>
                        <div className="text-white/30 text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleSend(selectedDest)}
                      disabled={!selectedDest.available}
                      className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:text-white/30 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">sailing</span>
                      {selectedDest.available ? 'ENVIAR EXPEDICIÓN' : 'DESTINO BLOQUEADO'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-panel rounded-xl h-full flex flex-col items-center justify-center text-white/20">
                  <span className="material-symbols-outlined text-6xl mb-3">explore</span>
                  <p className="text-lg font-semibold">Selecciona un destino</p>
                  <p className="text-sm mt-1">para ver los detalles y enviar la expedición</p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ACTIVAS */}
        {activeTab === 'active' && (
          <div className="flex-1 space-y-3" role="tabpanel" id="panel-active" aria-label="Mis expediciones">
            {MY_EXPEDITIONS.map((e, i) => (
              <div key={i} className="glass-panel rounded-xl p-5 flex items-center gap-4">
                <div className="flex-none w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400">sailing</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold">{e.name}</div>
                  <div className="text-white/40 text-sm">Destino: {e.dest} · {e.ships} barco(s)</div>
                  <div className={`text-xs font-semibold mt-1 ${e.status === 'Regresando' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ● {e.status} — {e.days} días restantes
                  </div>
                </div>
                {e.profit && (
                  <div className="text-right">
                    <div className="text-emerald-400 font-mono font-bold text-lg">+{e.profit.toLocaleString()}</div>
                    <div className="text-white/30 text-xs">DUC estimados</div>
                  </div>
                )}
                <button
                  onClick={() => setLocation('/world-map')}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 text-sm transition-all"
                  aria-label="Ver en mapa mundial"
                >
                  <span className="material-symbols-outlined text-sm">map</span>
                </button>
              </div>
            ))}
            {MY_EXPEDITIONS.length === 0 && (
              <div className="text-center py-16 text-white/30">
                <span className="material-symbols-outlined text-5xl">sailing</span>
                <p className="mt-2">Sin expediciones activas</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
