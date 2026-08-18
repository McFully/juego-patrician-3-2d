import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

export function VesselInspection() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'overview'|'crew'|'cargo'>('overview')

  if (!player || !player.fleet || player.fleet.length === 0) return null

  const ship = player.fleet[0]
  const currentCityId = player.currentCityId || 'lubeck'

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleRepair = () => {
    const success = engine.repairShip(currentCityId, 0)
    if (success) flash('✓ Barco reparado al 100%.', 'ok')
    else flash('Error al reparar: Fondos insuficientes.', 'err')
  }

  const TABS = [
    { id: 'overview', label: 'Inspección', icon: 'search' },
    { id: 'crew',     label: 'Tripulación', icon: 'group' },
    { id: 'cargo',    label: 'Manifiesto', icon: 'inventory_2' },
  ] as const

  const overallHealth = Math.round((ship.hp / ship.hpMax) * 100)

  return (
    <main className="w-full h-full overflow-hidden bg-slate-950 flex flex-col select-none">
      <header className="flex-none px-6 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-sm flex flex-wrap items-center gap-4 text-on-surface">
        <button onClick={() => setLocation('/city-overview')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-white/70 text-sm cursor-pointer">
          <span className="material-symbols-outlined text-base">arrow_back</span> Volver
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400">sailing</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide uppercase">Inspección de Navío</h1>
          <span className="px-2 py-0.5 text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full uppercase">{ship.name}</span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-6">
          <div className={`flex items-center gap-1 text-sm font-black uppercase ${overallHealth > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            <span className="material-symbols-outlined text-base">health_and_safety</span> {overallHealth}% CONDICIÓN
          </div>
          <button onClick={handleRepair} className="bg-tertiary text-on-tertiary px-6 py-2 rounded-xl text-xs font-black uppercase shadow-lg hover:scale-105 transition-all border-0 cursor-pointer">REPARAR</button>
        </div>
      </header>

      {msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {msg}
        </div>
      )}

      <div className="flex-none grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 px-6 py-3 border-b border-white/10 bg-black/20">
        {[
          { label: 'Tipo', value: ship.typeId?.toUpperCase() || 'KOGGE', icon: 'category' },
          { label: 'Capacidad', value: `${ship.cargoCapacity}t`, icon: 'inventory_2' },
          { label: 'Tripulación', value: `${ship.crew}/${ship.crewMax || 25}`, icon: 'group' },
          { label: 'Integridad', value: `${ship.hp} PV`, icon: 'shield' },
          { label: 'Cañones', value: `${ship.cannons || 0}`, icon: 'bomb' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3 border border-white/5">
            <span className="material-symbols-outlined text-tertiary-fixed text-xl">{s.icon}</span>
            <div>
              <div className="text-white font-black font-mono text-sm leading-none">{s.value}</div>
              <div className="text-white/30 text-[9px] font-black uppercase tracking-tighter mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-none flex gap-1 px-6 pt-3 border-b border-white/10" role="tablist" aria-label="Secciones de inspección">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} role="tab" aria-selected={activeTab === t.id} aria-controls={`panel-${t.id}`} className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === t.id ? 'border-amber-500 text-amber-300 bg-amber-500/10' : 'border-transparent text-white/30 hover:text-white/60'}`}>
            <span className="material-symbols-outlined text-base">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" role="tabpanel" id="panel-overview" aria-label="Inspección">
            <div className="glass-panel rounded-2xl p-6 space-y-6 border border-white/10 bg-black/40 shadow-2xl">
              <h3 className="text-amber-300 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-4">
                <span className="material-symbols-outlined">health_and_safety</span> Evaluación Estructural
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Integridad del Casco', pct: overallHealth },
                  { label: 'Aparejo y Velamen', pct: 85 },
                  { label: 'Batería de Artillería', pct: 100 },
                ].map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase mb-2">
                      <span>{c.label}</span>
                      <span className="text-white font-mono">{c.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${c.pct > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${c.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-6 bg-black/40 border border-white/10">
              <h3 className="text-red-400 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                <span className="material-symbols-outlined">military_tech</span> Preparación para Combate
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <div className="text-2xl font-black text-white font-mono">{ship.sabers || 0}</div>
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Sables</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl text-center">
                  <div className="text-2xl font-black text-white font-mono">{ship.cannons || 0}</div>
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Piezas</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cargo' && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 bg-black/40" role="tabpanel" id="panel-cargo" aria-label="Manifiesto">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
              <span>Manifiesto de Carga</span>
              <span>Tonelaje</span>
            </div>
            <div className="divide-y divide-white/5">
              {Object.entries(ship.cargo || {}).map(([good, qty]) => (
                <div key={good} className="px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <span className="text-white font-bold uppercase text-xs">{good}</span>
                  <span className="text-amber-300 font-black font-mono">{String(qty)}t</span>
                </div>
              ))}
              {(!ship.cargo || Object.keys(ship.cargo).length === 0) && (
                <div className="px-6 py-12 text-center text-white/20 italic text-sm font-medium tracking-tight">Bodega de carga vacía</div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.4); backdrop-filter: blur(12px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe088; border-radius: 10px; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        body { background-color: #0c0f17; }
      `}</style>
    </main>
  )
}
