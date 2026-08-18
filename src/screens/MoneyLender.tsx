import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const ACTIVE_LOANS = [
  { id: 1, name: 'Astillero de Lübeck', amount: 5000, remaining: 3200, interest: 4, dueWeeks: 8, lender: 'Sindicato Lübeck' },
  { id: 2, name: 'Almacén Puerto Riga', amount: 8000, remaining: 6500, interest: 6, dueWeeks: 14, lender: 'Casa Báltica' },
]

const LOAN_OFFERS = [
  { id: 'small', name: 'Préstamo Menor', amount: 2000, weeks: 8, interest: 3, risk: 'Bajo', available: true },
  { id: 'medium', name: 'Préstamo Estándar', amount: 5000, weeks: 12, interest: 4, risk: 'Moderado', available: true },
  { id: 'large', name: 'Préstamo Mercantil', amount: 15000, weeks: 20, interest: 7, risk: 'Alto', available: true },
  { id: 'emergency', name: 'Crédito de Emergencia', amount: 30000, weeks: 8, interest: 15, risk: 'Muy Alto', available: true },
]

const REPUTATION = [
  { faction: 'Sindicato Lübeck', status: 'Excelente', color: 'text-emerald-400', score: 92 },
  { faction: 'Liga Báltica',     status: 'Neutral',   color: 'text-white/60',    score: 50 },
  { faction: 'Corona Danesa',    status: 'Hostil',    color: 'text-red-400',     score: 15 },
]

export function MoneyLender() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'loans'|'new'|'credit'>('loans')

  const currentCityId = player?.currentCityId || 'lubeck'
  const cityData = worldState?.simulation?.world?.cities?.[currentCityId]
  const activeLoans = cityData?.moneyLender?.loans || []

  if (!player) return null

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleTakeLoan = (offer: typeof LOAN_OFFERS[0]) => {
    try {
      const result = engine.takeLoan(offer.amount, offer.weeks)
      if (result) {
        flash(`✓ Préstamo de ${offer.amount.toLocaleString()} DUC concedido. Vence en ${offer.weeks} semanas.`, 'ok')
      } else {
        flash('Límite de crédito alcanzado o fondos insuficientes en la ciudad.', 'err')
      }
    } catch {
      flash('Error al solicitar préstamo.', 'err')
    }
  }

  const handleRepay = (id: number) => {
    try {
      const ok = engine.repayLoan(id)
      if (ok) flash(`✓ Préstamo saldado con éxito.`, 'ok')
      else flash('Fondos insuficientes para saldar la deuda.', 'err')
    } catch {
      flash('Error al pagar el préstamo.', 'err')
    }
  }

  const TABS = [
    { id: 'loans', label: 'Mis Deudas', icon: 'receipt_long' },
    { id: 'new', label: 'Pedir Préstamo', icon: 'currency_exchange' },
    { id: 'credit', label: 'Crédito', icon: 'credit_score' },
  ] as const

  const totalDebt = activeLoans.reduce((a: number, l: any) => a + (l.totalToRepay || 0), 0)

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 flex flex-col select-none">

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
          <span className="material-symbols-outlined text-amber-400">account_balance</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Prestamista</h1>
          <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">Oficina del Sindicato de Crédito</span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-red-300">
            <span className="material-symbols-outlined text-base">money_off</span>
            <span className="font-mono">Deuda: {totalDebt.toLocaleString()} DUC</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="font-mono font-bold">{player.gold.toLocaleString()} DUC</span>
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
      <div className="flex-none flex gap-1 px-6 pt-3 border-b border-white/10">
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

        {/* MIS DEUDAS */}
        {activeTab === 'loans' && (
          <div className="space-y-4">
            {activeLoans.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <span className="material-symbols-outlined text-5xl">check_circle</span>
                <p className="mt-2">Sin deudas activas</p>
              </div>
            ) : (
              activeLoans.map((l: any) => {
                const pct = Math.round(((l.totalToRepay - l.amount) / l.totalToRepay) * 100) // This is just a visual placeholder for progress
                return (
                  <div key={l.id} className="glass-panel rounded-xl p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-none w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-400">receipt_long</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold">Préstamo #{l.id}</h3>
                        <div className="text-white/40 text-xs mt-0.5">Sindicato de {currentCityId.toUpperCase()} · Interés: {Math.round(l.interestRate * 100)}% · Vence: {l.weeksRemaining} sem.</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-400 font-mono">{Math.round(l.totalToRepay).toLocaleString()}</div>
                        <div className="text-xs text-white/40">DUC pendientes (Total)</div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleRepay(l.id)}
                        className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm font-bold transition-all"
                      >
                        <span className="material-symbols-outlined text-sm mr-1">payments</span>
                        Saldar Deuda Total
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* PEDIR PRÉSTAMO */}
        {activeTab === 'new' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOAN_OFFERS.map(o => {
              const totalRepay = o.amount * (1 + o.interest / 100)
              const riskColor =
                o.risk === 'Bajo' ? 'text-emerald-400' :
                o.risk === 'Moderado' ? 'text-amber-400' :
                o.risk === 'Alto' ? 'text-orange-400' : 'text-red-400'

              return (
                <div key={o.id} className="glass-panel rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-none w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-400">currency_exchange</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{o.name}</h3>
                      <span className={`text-xs ${riskColor}`}>Riesgo: {o.risk}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-emerald-300 font-mono font-bold">{o.amount.toLocaleString()}</div>
                      <div className="text-white/40 text-xs">DUC recibidos</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-red-300 font-mono font-bold">{Math.round(totalRepay).toLocaleString()}</div>
                      <div className="text-white/40 text-xs">DUC a devolver</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-amber-300 font-mono font-bold">{o.interest}%</div>
                      <div className="text-white/40 text-xs">Interés</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-blue-300 font-mono font-bold">{o.weeks}</div>
                      <div className="text-white/40 text-xs">Semanas</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTakeLoan(o)}
                    className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-sm transition-all"
                  >SOLICITAR PRÉSTAMO</button>
                </div>
              )
            })}
          </div>
        )}

        {/* CRÉDITO */}
        {activeTab === 'credit' && (
          <div className="space-y-4">
            <div className="glass-panel rounded-xl p-5 space-y-4">
              <h3 className="text-amber-300 font-bold">Reputación Crediticia</h3>
              <div className="flex items-center gap-4">
                <div className="text-6xl font-black text-emerald-400 font-mono">A+</div>
                <div>
                  <div className="text-white font-semibold">Calificación Excelente</div>
                  <div className="text-white/40 text-sm">Acceso a todos los productos de crédito</div>
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded-full">
                <div className="h-full w-[85%] bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>Insolvente</span>
                <span>Neutral</span>
                <span>Excelente</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Relaciones por Facción</h3>
              {REPUTATION.map(r => (
                <div key={r.faction} className="glass-panel rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{r.faction}</div>
                    <div className={`text-xs font-semibold ${r.color}`}>{r.status}</div>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-white/10 rounded-full">
                      <div
                        className={`h-full rounded-full ${r.score > 70 ? 'bg-emerald-500' : r.score > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white/60 font-mono text-sm w-8 text-right">{r.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
