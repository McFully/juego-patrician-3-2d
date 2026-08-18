import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer, useSimulationState } from '../engine/GameProvider'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import db from '../database/index'

const { GOODS: GOODS_BASE } = db

const CATEGORIES = ['Todos', 'Alimentos', 'Materiales', 'Lujo']

// Metadata for UI (Icons and Categories)
const UI_METADATA: Record<string, { icon: string, category: string }> = {
  grain: { icon: 'grass', category: 'Alimentos' },
  fish: { icon: 'set_meal', category: 'Alimentos' },
  salt: { icon: 'water_drop', category: 'Alimentos' },
  beer: { icon: 'sports_bar', category: 'Alimentos' },
  meat: { icon: 'kebab_dining', category: 'Alimentos' },
  cheese: { icon: 'cheese', category: 'Alimentos' },
  wine: { icon: 'wine_bar', category: 'Lujo' },
  spices: { icon: 'spa', category: 'Lujo' },
  cloth: { icon: 'format_color_fill', category: 'Materiales' },
  wood: { icon: 'forest', category: 'Materiales' },
  timber: { icon: 'forest', category: 'Materiales' },
  iron: { icon: 'hardware', category: 'Materiales' },
  tools: { icon: 'build', category: 'Materiales' },
  bricks: { icon: 'domain', category: 'Materiales' },
  hemp: { icon: 'eco', category: 'Materiales' },
  honey: { icon: 'hive', category: 'Alimentos' },
  wax: { icon: 'candle', category: 'Materiales' },
  furs: { icon: 'pets', category: 'Lujo' },
  linen: { icon: 'texture', category: 'Lujo' },
  pitch: { icon: 'opacity', category: 'Materiales' },
}

export function MarketHall() {
  const [, setLocation] = useLocation()
  const { engine } = useGame()
  const player = usePlayer()
  const sim = useSimulationState()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [qty, setQty] = useState<Record<string, number>>({})
  const [cat, setCat] = useState('Todos')

  const currentCityId = player?.currentCityId || 'lubeck'
  
  const marketGoods = useMemo(() => {
    const cityState = sim?.cities?.[currentCityId]
    if (!cityState) return []

    return (GOODS_BASE as any[]).map(g => {
      const marketPrice = cityState.prices?.[g.id]
      const stock = marketPrice?.stock || 0
      const price = marketPrice?.price || g.pMax
      const meta = UI_METADATA[g.id] || { icon: 'inventory_2', category: 'Otros' }
      
      return {
        id: g.id,
        name: g.name,
        icon: meta.icon,
        category: meta.category,
        buyPrice: Math.ceil(price),
        sellPrice: Math.floor(price * 0.95), // 5% spread for the UI
        stock: stock,
        trend: 'stable', 
        sMax: g.sMax
      }
    })
  }, [sim, currentCityId])

  if (!player) return null

  const getQty = (id: string) => qty[id] ?? 1

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleBuy = (goodId: string, name: string) => {
    const amount = getQty(goodId)
    const result = engine.buyGood(goodId, amount)
    if (result) {
      flash(`✓ Comprado: ${amount}t de ${name} por ${Math.ceil(result.cost)} DUC`, 'ok')
    } else {
      flash('Error: No hay suficiente stock o dinero', 'err')
    }
  }

  const handleSell = (goodId: string, name: string) => {
    const amount = getQty(goodId)
    const result = engine.sellGood(goodId, amount)
    if (result) {
      flash(`✓ Vendido: ${amount}t de ${name} por ${Math.floor(result.revenue)} DUC`, 'ok')
    } else {
      flash('Error: No tienes suficiente mercancía', 'err')
    }
  }

  const filtered = cat === 'Todos' ? marketGoods : marketGoods.filter(g => g.category === cat)

  const trendIcon = (t: string) =>
    t === 'up' ? 'trending_up' : t === 'down' ? 'trending_down' : 'trending_flat'
  const trendColor = (t: string) =>
    t === 'up' ? 'text-emerald-400' : t === 'down' ? 'text-red-400' : 'text-amber-400'

  return (
    <main className="w-full h-full overflow-hidden bg-[#0a0f14] text-on-surface flex flex-col select-none relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-amber-900/10 pointer-events-none" />

      {/* ── HEADER ── */}
      <header className="flex-none px-6 py-4 bg-surface-container/40 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center gap-6 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setLocation('/city-overview')}
          icon={<span className="material-symbols-outlined text-sm">arrow_back</span>}
        >
          Volver
        </Button>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary-fixed text-2xl">store</span>
          <div>
            <h1 className="text-xl font-bold text-tertiary-fixed tracking-tight leading-none">Lonja del Mercado</h1>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mt-1">{currentCityId}</p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Tu Tesorería</span>
            <div className="flex items-center gap-2 text-tertiary-fixed">
              <span className="material-symbols-outlined text-base">payments</span>
              <span className="font-mono font-bold text-lg">{Math.floor(player.gold).toLocaleString()} <span className="text-xs">DUC</span></span>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Fecha Actual</span>
            <div className="text-on-surface font-mono text-sm">
              {sim?.date?.day} / {sim?.date?.month} / {sim?.date?.year}
            </div>
          </div>
        </div>
      </header>

      {/* ── TOAST ── */}
      {msg && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-bold shadow-2xl backdrop-blur-xl border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 ${msgType === 'ok' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}>
          <span className="material-symbols-outlined text-base">{msgType === 'ok' ? 'check_circle' : 'error'}</span>
          {msg}
        </div>
      )}

      {/* ── BODY ── */}
      <div className="flex-1 overflow-hidden flex gap-6 p-6 z-0">

        {/* LEFT: MARKET TABLE */}
        <Card variant="panel" padding="none" className="flex-1 flex flex-col overflow-hidden border-white/5 min-w-0">
          {/* Category filters */}
          <div className="flex-none flex flex-wrap items-center gap-2 p-4 border-b border-white/10 bg-white/2">
            {CATEGORIES.map(c => (
              <Button
                key={c}
                variant={cat === c ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCat(c)}
                className={cat !== c ? 'text-on-surface-variant' : ''}
              >
                {c}
              </Button>
            ))}
            <div className="ml-auto flex items-center gap-2 text-on-surface-variant text-xs italic">
              <span className="material-symbols-outlined text-sm">info</span>
              Precios dinámicos por oferta/demanda local
            </div>
          </div>

          {/* Table header */}
          <div className="flex-none grid grid-cols-[2.5fr_1.5fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-white/5 bg-black/20 overflow-x-auto">
            <span>Mercancía</span>
            <span className="text-center">Existencias</span>
            <span className="text-center">Tendencia</span>
            <span className="text-center text-emerald-400/80">Compra</span>
            <span className="text-center text-amber-400/80">Venta</span>
            <span className="text-center">Cantidad</span>
          </div>

          {/* Table rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.map((g, i) => (
              <div
                key={g.id}
                className={`grid grid-cols-[2.5fr_1.5fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-all group ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
              >
                {/* Name */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container/60 flex items-center justify-center border border-white/10 group-hover:border-tertiary/30 transition-colors shadow-inner">
                    <span className="material-symbols-outlined text-tertiary-fixed/70 text-xl">{g.icon}</span>
                  </div>
                  <div>
                    <div className="text-on-surface font-bold text-sm tracking-tight">{g.name}</div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-medium">{g.category}</div>
                  </div>
                </div>

                {/* Stock bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                    <span>{Math.floor(g.stock)}t</span>
                    <span className="opacity-40">{g.sMax}t max</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5 p-[1px] border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${g.stock < 20 ? 'bg-error' : g.stock < 100 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(g.stock / g.sMax * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Trend */}
                <div className="flex justify-center">
                  <span className={`material-symbols-outlined ${trendColor(g.trend)} group-hover:scale-110 transition-transform`}>
                    {trendIcon(g.trend)}
                  </span>
                </div>

                {/* Buy price + btn */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-emerald-400 font-mono font-bold text-sm">{g.buyPrice} <span className="text-[10px] opacity-60">DUC</span></span>
                  <Button
                    variant="primary"
                    size="sm"
                    className="min-h-[44px] text-sm px-3 font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/40"
                    onClick={() => handleBuy(g.id, g.name)}
                  >
                    COMPRAR
                  </Button>
                </div>

                {/* Sell price + btn */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-amber-400 font-mono font-bold text-sm">{g.sellPrice} <span className="text-[10px] opacity-60">DUC</span></span>
                  <Button
                    variant="primary"
                    size="sm"
                    className="min-h-[44px] text-sm px-3 font-bold bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/40"
                    onClick={() => handleSell(g.id, g.name)}
                  >
                    VENDER
                  </Button>
                </div>

                {/* Qty */}
                <div className="flex items-center justify-center bg-black/20 rounded-lg p-1 border border-white/5">
                  <button
                    onClick={() => setQty(q => ({ ...q, [g.id]: Math.max(1, (q[g.id] ?? 1) - 5) }))}
                    className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="text-on-surface font-mono text-sm w-8 text-center font-bold">{getQty(g.id)}</span>
                  <button
                    onClick={() => setQty(q => ({ ...q, [g.id]: (q[g.id] ?? 1) + 5 }))}
                    className="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* RIGHT: SIDEBAR INFO */}
        <div className="w-80 flex flex-col gap-6 min-w-0">
          {/* Almacén propio */}
          <Card variant="panel" className="bg-surface-container/30 border-white/5">
            <CardHeader className="mb-4">
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tertiary-fixed">warehouse</span>
                Mi Almacén local
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {player.warehouse && Object.entries(player.warehouse).filter(([, v]) => (v as number) > 0).length > 0 ? (
                  Object.entries(player.warehouse).filter(([, v]) => (v as number) > 0).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center group">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-tertiary/40 group-hover:bg-tertiary transition-colors" />
                        <span className="text-xs text-on-surface-variant capitalize">{k}</span>
                      </div>
                      <span className="text-on-surface font-mono font-bold text-sm">{String(v)}t</span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <span className="material-symbols-outlined text-4xl text-white/5 mb-2">inventory_2</span>
                    <p className="text-on-surface-variant text-xs italic">Almacén vacío</p>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                  <span>Capacidad Utilizada</span>
                  <span className="text-on-surface">0 / 500t</span>
                </div>
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-fixed/30 w-0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado de la Ciudad */}
          <Card variant="panel" className="bg-surface-container/30 border-white/5">
             <CardHeader className="mb-4">
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-tertiary-fixed">location_city</span>
                Info. de {currentCityId}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Población</p>
                  <p className="text-lg font-bold text-on-surface">{sim?.cities?.[currentCityId]?.population?.toLocaleString() ?? '—'}</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-tertiary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary/60">groups</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-on-surface-variant">Suministros</span>
                   <span className="text-xs font-bold text-emerald-400">Estable</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-on-surface-variant">Crecimiento</span>
                   <span className="text-xs font-bold text-amber-400">+0.2% / día</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <div className="mt-auto flex flex-col gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setLocation('/ledger')}
              icon={<span className="material-symbols-outlined">menu_book</span>}
            >
              Libro Mayor
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setLocation('/city-overview')}
              className="text-on-surface-variant hover:text-white"
            >
              Cerrar Lonja
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.2);
        }
      `}</style>
    </main>
  )
}
