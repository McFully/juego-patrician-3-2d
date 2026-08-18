import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

import db from '../database/index'

const { CITIES: CITIES_BASE, GOODS: GOODS_BASE } = db

type Stop = {
  cityId: string
  action: 'buy' | 'sell' | 'both'
  goodId: string
  buyThreshold: number
  sellThreshold: number
}

const defaultStop = (cityId: string): Stop => ({
  cityId,
  action: 'buy',
  goodId: 'grain',
  buyThreshold: 170,
  sellThreshold: 205,
})

export function TradeRouteEditor() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [stops, setStops] = useState<Stop[]>([
    defaultStop('lubeck'),
    defaultStop('riga'),
    defaultStop('danzig'),
  ])
  const [routeName, setRouteName] = useState('Nueva Ruta Comercial')

  if (!player) return null

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleSave = () => {
    if (stops.length < 2) {
      flash('Error: Una ruta debe tener al menos 2 escalas.', 'err')
      return
    }
    try {
      // Map stops to the format expected by the engine
      const cityIds = stops.map(s => s.cityId)
      const rules = stops.map(s => ({
        cityId: s.cityId,
        goodId: s.goodId,
        action: s.action,
        buyAt: s.buyThreshold,
        sellAt: s.sellThreshold
      }))
      
      engine.setPlayerRoute(cityIds, { name: routeName, rules })
      flash(`✓ Ruta "${routeName}" guardada con ${stops.length} escalas.`, 'ok')
    } catch { flash('Error al guardar la ruta.', 'err') }
  }

  const handleStart = () => {
    if (stops.length < 2) {
      flash('Error: Una ruta debe tener al menos 2 escalas.', 'err')
      return
    }
    handleSave()
    setTimeout(() => setLocation('/world-map'), 1000)
  }

  const addStop = () => {
    setStops(s => [...s, defaultStop('visby')])
  }

  const removeStop = (i: number) => {
    setStops(s => s.filter((_, idx) => idx !== i))
  }

  const updateStop = (i: number, patch: Partial<Stop>) => {
    setStops(s => s.map((stop, idx) => idx === i ? { ...stop, ...patch } : stop))
  }

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 flex flex-col select-none">

      {/* ── HEADER ── */}
      <header className="flex-none px-6 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-sm flex items-center gap-4">
        <button
          onClick={() => setLocation('/city-overview')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-white/70 hover:text-white text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">route</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Editor de Rutas Comerciales</h1>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 text-sm font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-base">save</span>
            Guardar
          </button>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-all"
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
            Iniciar Ruta
          </button>
        </div>
      </header>

      {/* ── TOAST ── */}
      {msg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {msg}
        </div>
      )}

      {/* ── BODY ── */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4">

        {/* LEFT: ROUTE BUILDER */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {/* Route name */}
          <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-sm">edit</span>
            <input
              type="text"
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              className="flex-1 bg-transparent text-white font-semibold text-lg focus:outline-none placeholder:text-white/30 border-b border-transparent focus:border-amber-500/50 transition-all"
              aria-label="Nombre de la ruta comercial"
            />
            <span className="text-white/30 text-xs">{stops.length} escalas</span>
          </div>

          {/* Stops */}
          {stops.map((stop, i) => (
            <div key={i} className="glass-panel rounded-xl p-4 space-y-3 relative">
              {/* Stop header */}
              <div className="flex items-center gap-3">
                <div className="flex-none w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <span className="text-white/40 text-xs">{i === 0 ? 'Puerto de Origen' : i === stops.length - 1 ? 'Puerto Final' : 'Escala'}</span>
                {stops.length > 2 && (
                  <button
                    onClick={() => removeStop(i)}
                    className="ml-auto w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-all"
                    aria-label={`Eliminar escala ${i + 1}`}
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>

              {/* Controls grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* City */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block" htmlFor={`city-${i}`}>Ciudad</label>
                  <select
                    id={`city-${i}`}
                    value={stop.cityId}
                    onChange={e => updateStop(i, { cityId: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    {CITIES_BASE.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                  </select>
                </div>

                {/* Good */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block" htmlFor={`good-${i}`}>Mercancía</label>
                  <select
                    id={`good-${i}`}
                    value={stop.goodId}
                    onChange={e => updateStop(i, { goodId: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    {GOODS_BASE.map(g => <option key={g.id} value={g.id} className="bg-slate-900">{g.name}</option>)}
                  </select>
                </div>

                {/* Action */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Acción</label>
                  <div className="flex gap-1">
                    {(['buy', 'sell', 'both'] as const).map(a => (
                      <button
                        key={a}
                        onClick={() => updateStop(i, { action: a })}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                          stop.action === a
                            ? a === 'buy' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                              : a === 'sell' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              : 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
                            : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {a === 'buy' ? 'COMPRAR' : a === 'sell' ? 'VENDER' : 'AMBAS'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thresholds */}
                <div className="space-y-2">
                  <div>
                    <label className="text-white/40 text-xs" htmlFor={`buy-threshold-${i}`}>Comprar si precio &lt; <span className="text-emerald-400 font-mono">{stop.buyThreshold}</span> DUC</label>
                    <input
                      id={`buy-threshold-${i}`}
                      type="range" min={5} max={1000} step={5}
                      value={stop.buyThreshold}
                      onChange={e => updateStop(i, { buyThreshold: Number(e.target.value) })}
                      className="w-full accent-emerald-500"
                      aria-label={`Umbral de compra para ${GOODS_BASE.find(g => g.id === stop.goodId)?.name || stop.goodId}`}
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs" htmlFor={`sell-threshold-${i}`}>Vender si precio &gt; <span className="text-amber-400 font-mono">{stop.sellThreshold}</span> DUC</label>
                    <input
                      id={`sell-threshold-${i}`}
                      type="range" min={5} max={1200} step={5}
                      value={stop.sellThreshold}
                      onChange={e => updateStop(i, { sellThreshold: Number(e.target.value) })}
                      className="w-full accent-amber-500"
                      aria-label={`Umbral de venta para ${GOODS_BASE.find(g => g.id === stop.goodId)?.name || stop.goodId}`}
                    />
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              {i < stops.length - 1 && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/30 text-xl">↓</div>
              )}
            </div>
          ))}

          {/* Add stop */}
          <button
            onClick={addStop}
            className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-white/50 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Añadir Escala
          </button>
        </div>

        {/* RIGHT: ROUTE PREVIEW + TIPS */}
        <div className="w-full lg:w-64 flex flex-col gap-3">
          <div className="glass-panel rounded-xl p-4 flex-1">
            <h3 className="text-amber-300 font-bold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">map</span>
              Resumen de Ruta
            </h3>
            <div className="space-y-2">
              {stops.map((s, i) => {
                const city = CITIES_BASE.find(c => c.id === s.cityId)
                const good = GOODS_BASE.find(g => g.id === s.goodId)
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-none">{i + 1}</div>
                    <div>
                      <div className="text-white font-semibold">{city?.name || s.cityId}</div>
                      <div className="text-white/40">{good?.name || s.goodId} · {s.action === 'buy' ? 'Comprar' : s.action === 'sell' ? 'Vender' : 'Comprar/Vender'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Escalas</span>
                <span className="text-white/70">{stops.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Est. viaje</span>
                <span className="text-white/70">{stops.length * 3}–{stops.length * 5} días</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-blue-300 font-bold text-sm mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">lightbulb</span>
              Consejo
            </h3>
            <p className="text-white/40 text-xs leading-relaxed">
              Compra grano barato en Danzig y véndelo caro en Hamburgo. El diferencial en temporada de escasez puede superar el 40%.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
