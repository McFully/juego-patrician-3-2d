import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import db from '../database/index'

const { CITIES: CITIES_BASE } = db

type Tab = 'cargo' | 'weapons' | 'route'

const GOODS_AVAIL = [
  { id: 'grain', name: 'Grano',    icon: 'grass',    inHold: 80,  capacity: 200 },
  { id: 'wood',  name: 'Madera',   icon: 'forest',   inHold: 40,  capacity: 200 },
  { id: 'salt',  name: 'Sal',      icon: 'water_drop', inHold: 0, capacity: 200 },
  { id: 'linen', name: 'Lino',     icon: 'texture',  inHold: 20,  capacity: 200 },
]

const WEAPONS = [
  { id: 'cannons', name: 'Cañones',         qty: 8,  max: 20, icon: 'rocket' },
  { id: 'archers', name: 'Arqueros',         qty: 12, max: 40, icon: 'person' },
  { id: 'marines', name: 'Infantes de Marina', qty: 6, max: 30, icon: 'shield' },
]

const ROUTE_CITIES = ['Lübeck', 'Hamburgo', 'Riga', 'Danzig', 'Visby']

export function ConvoyManagerModal() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<Tab>('cargo')
  const [weapons, setWeapons] = useState<Record<string, number>>({ cannons: 8, archers: 12, marines: 6 })
  const [selectedCities, setSelectedCities] = useState<string[]>(['lubeck', 'riga'])

  if (!player) return null

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const activeShip = player.fleet?.[0] || { name: 'Sin Navío', cargoCapacity: 200, cargo: {} }
  const liveCargo = activeShip.cargo || {}
  const totalCargo = activeShip.cargoUsed ?? Object.values(liveCargo).reduce((a: number, v: any) => a + Number(v || 0), 0)
  const maxCargo = activeShip.cargoCapacity || 200

  const handleSave = () => {
    if (selectedCities.length < 2) {
      flash('Error: selecciona al menos dos ciudades.', 'err')
      return
    }
    engine.setPlayerRoute(selectedCities, {
      rules: selectedCities.map((cityId, idx) => ({
        cityId,
        goodId: 'grain',
        action: idx === 0 ? 'buy' : 'sell',
        buyAt: 1000,
        sellAt: 0,
      }))
    })
    flash('✓ Ruta de convoy guardada en el motor. Listo para zarpar.', 'ok')
    setTimeout(() => setLocation('/city-overview'), 1500)
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'cargo',   label: 'Carga',      icon: 'inventory_2' },
    { id: 'weapons', label: 'Armamento',  icon: 'security' },
    { id: 'route',   label: 'Ruta',       icon: 'route' },
  ]

  const convoyName = activeShip.name

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 flex flex-col select-none" role="dialog" aria-modal="true" aria-label="Gestor de convoy">

      {/* ── HEADER ── */}
      <header className="flex-none px-6 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-sm flex flex-wrap items-center gap-4">
        <button
          onClick={() => setLocation('/city-overview')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-white/70 hover:text-white text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400">sailing</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Convoy: {convoyName}</h1>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-1 text-amber-300">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="font-mono font-bold text-sm">{Math.floor(player.gold).toLocaleString()} DUC</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLocation('/city-overview')}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/60 text-sm transition-all"
            >Cancelar</button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-all"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Guardar Plan
            </button>
          </div>
        </div>
      </header>

      {/* ── TOAST ── */}
      {msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {msg}
        </div>
      )}

      {/* ── CARGO SUMMARY BAR ── */}
      <div className="flex-none px-6 py-2 border-b border-white/10 flex items-center gap-4">
        <span className="text-white/40 text-xs">Carga total:</span>
        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${totalCargo > maxCargo * 0.9 ? 'bg-red-500' : totalCargo > maxCargo * 0.7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min((totalCargo / maxCargo) * 100, 100)}%` }}
          />
        </div>
        <span className={`text-xs font-mono font-bold ${totalCargo > maxCargo ? 'text-red-400' : 'text-white/70'}`}>{totalCargo}/{maxCargo}t</span>
      </div>

      {/* ── TABS ── */}
      <div className="flex-none flex gap-1 px-6 pt-3 border-b border-white/10 overflow-x-auto" role="tablist" aria-label="Secciones del convoy">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
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
      <div className="flex-1 overflow-y-auto p-6">

        {/* CARGO */}
        {activeTab === 'cargo' && (
          <div className="space-y-3" role="tabpanel" id="panel-cargo" aria-label="Carga">
            <p className="text-white/40 text-sm">Gestiona la carga de bodega. Equilibra mercancías para maximizar beneficios.</p>
            {GOODS_AVAIL.map(g => {
                  const loaded = liveCargo[g.id] ?? 0
              const pct = Math.round((loaded / maxCargo) * 100)
              return (
                <div key={g.id} className="glass-panel rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-400">{g.icon}</span>
                    <span className="text-white font-semibold">{g.name}</span>
                    <span className="ml-auto text-amber-300 font-mono font-bold">{loaded}t</span>
                  </div>
                  <input
                    type="range" min={0} max={maxCargo} step={5}
                    value={loaded}
                    readOnly
                    disabled
                    className="w-full accent-amber-500"
                    aria-label={`Cantidad de ${g.name} en bodega`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocation('/market')}
                      className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white/60 transition-all"
                    >Abrir Lonja</button>
                    <button
                      onClick={() => setActiveTab('route')}
                      className="px-2 py-1 text-xs rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-all"
                    >Asignar Ruta</button>
                    <button
                      onClick={() => setLocation('/trade-route')}
                      className="px-2 py-1 text-xs rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all"
                    >Editor Avanzado</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* WEAPONS */}
        {activeTab === 'weapons' && (
          <div className="space-y-3" role="tabpanel" id="panel-weapons" aria-label="Armamento">
            <p className="text-white/40 text-sm">Configura el armamento del convoy para defenderte de piratas.</p>
            {WEAPONS.map(w => {
              const qty = weapons[w.id] ?? w.qty
              return (
                <div key={w.id} className="glass-panel rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-400">{w.icon}</span>
                    <span className="text-white font-semibold">{w.name}</span>
                    <span className="ml-auto text-red-300 font-mono font-bold">{qty}/{w.max}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full">
                    <div className="h-full bg-red-500/70 rounded-full transition-all" style={{ width: `${(qty / w.max) * 100}%` }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setWeapons(s => ({ ...s, [w.id]: Math.max(0, (s[w.id] ?? w.qty) - 1) }))}
                      className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white/60 text-lg flex items-center justify-center" aria-label={`Reducir ${w.name}`}>−</button>
                    <input
                      type="range" min={0} max={w.max} step={1}
                      value={qty}
                      onChange={e => setWeapons(s => ({ ...s, [w.id]: Number(e.target.value) }))}
                      className="flex-1 accent-red-500"
                      aria-label={`Cantidad de ${w.name}`}
                    />
                    <button onClick={() => setWeapons(s => ({ ...s, [w.id]: Math.min(w.max, (s[w.id] ?? w.qty) + 1) }))}
                      className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white/60 text-lg flex items-center justify-center" aria-label={`Aumentar ${w.name}`}>+</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ROUTE */}
        {activeTab === 'route' && (
          <div className="space-y-3" role="tabpanel" id="panel-route" aria-label="Ruta">
            <p className="text-white/40 text-sm">Define los puertos de escala del convoy.</p>
            <div className="glass-panel rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-300">directions_boat</span>
                <div>
                  <div className="text-white font-semibold">{activeShip.name}</div>
                  <div className="text-white/40 text-xs">
                    {activeShip.inTransit
                      ? `En ruta hacia ${(activeShip as any).targetCity || 'destino'} · ${Math.round(((activeShip as any).transitProgress || 0) * 100)}%`
                      : `Atracado en ${(activeShip as any).currentCity || player.currentCityId}`}
                  </div>
                </div>
              </div>
            </div>
            {CITIES_BASE.map(city => {
              const selected = selectedCities.includes(city.id)
              return (
                <div key={city.id} className={`glass-panel rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${selected ? 'border border-amber-500/40 bg-amber-500/5' : 'hover:bg-white/5'}`}
                  onClick={() => setSelectedCities(s => selected ? s.filter(c => c !== city.id) : [...s, city.id])}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-amber-500/30 text-amber-300' : 'bg-white/10 text-white/30'}`}>
                    <span className="material-symbols-outlined">anchor</span>
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${selected ? 'text-amber-300' : 'text-white/60'}`}>{city.name}</div>
                    <div className="text-white/30 text-xs">{selected ? `Escala ${selectedCities.indexOf(city.id) + 1}` : 'Sin incluir'}</div>
                  </div>
                  {selected && (
                    <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-400 text-sm">check</span>
                    </div>
                  )}
                </div>
              )
            })}
            <div className="glass-panel rounded-xl p-4 border border-dashed border-white/20 text-center text-white/30 text-sm py-6">
              <span className="material-symbols-outlined text-2xl">add_location</span>
              <p className="mt-1 text-xs">Selecciona ciudades arriba para añadirlas a la ruta</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
