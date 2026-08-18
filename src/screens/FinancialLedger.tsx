import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const TRANSACTIONS = [
  { date: '12 Mar', type: 'Venta',     item: 'Madera × 80t',      amount: +1360,  city: 'Hamburgo' },
  { date: '11 Mar', type: 'Compra',    item: 'Grano × 120t',      amount: -1440,  city: 'Danzig' },
  { date: '10 Mar', type: 'Flete',     item: 'Ruta Lübeck-Riga',  amount: -320,   city: 'Lübeck' },
  { date: '9 Mar',  type: 'Venta',     item: 'Especias × 15t',    amount: +1800,  city: 'Brujas' },
  { date: '8 Mar',  type: 'Interés',   item: 'Préstamo Astillero', amount: -200,  city: 'Lübeck' },
  { date: '7 Mar',  type: 'Venta',     item: 'Lino × 40t',        amount: +1920,  city: 'Riga' },
  { date: '7 Mar',  type: 'Impuesto',  item: 'Cuota Gremio',      amount: -500,   city: 'Lübeck' },
  { date: '6 Mar',  type: 'Compra',    item: 'Hierro × 30t',      amount: -1350,  city: 'Hamburgo' },
]

const INVESTMENTS = [
  { name: 'Astillero de Lübeck', category: 'Naval', invested: 12000, currentValue: 15800, roi: 31, status: 'Activo' },
  { name: 'Almacén Puerto Riga', category: 'Inmueble', invested: 8000, currentValue: 9200, roi: 15, status: 'Activo' },
  { name: 'Licencia Paños-Londres', category: 'Licencia', invested: 4500, currentValue: 6750, roi: 50, status: 'Activo' },
]

export function FinancialLedger() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'transactions'|'investments'|'loans'>('transactions')

  const history = player?.financialHistory || []
  const currentWeek = history[history.length - 1] || { revenue: 0, expenses: 0 }
  
  const currentCityId = player?.currentCityId || 'lubeck'
  const cityData = worldState?.simulation?.world?.cities?.[currentCityId]
  const activeLoans = cityData?.moneyLender?.loans || []

  if (!player) return null

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleTakeLoan = () => {
    try {
      const result = engine.takeLoan(50000, 52)
      if (result) flash('✓ Préstamo de 50.000 DUC concedido.', 'ok')
      else flash('Límite de crédito superado.', 'err')
    } catch { flash('Error al solicitar préstamo.', 'err') }
  }

  const handleRepay = (id: number) => {
    try {
      const ok = engine.repayLoan(id)
      if (ok) flash('✓ Préstamo saldado.', 'ok')
      else flash('Fondos insuficientes.', 'err')
    } catch { flash('Error al pagar.', 'err') }
  }

  const typeColor = (type: string) => {
    if (type === 'Venta') return 'text-emerald-400'
    if (type === 'Compra' || type === 'Flete' || type === 'Interés' || type === 'Impuesto') return 'text-red-400'
    return 'text-white/60'
  }

  const netBalance = currentWeek.revenue - currentWeek.expenses
  const totalAssets = player.gold + INVESTMENTS.reduce((a, i) => a + i.currentValue, 0)

  const TABS = [
    { id: 'transactions', label: 'Transacciones', icon: 'receipt_long' },
    { id: 'investments', label: 'Inversiones', icon: 'trending_up' },
    { id: 'loans', label: 'Préstamos', icon: 'currency_exchange' },
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
          <span className="material-symbols-outlined text-amber-400">menu_book</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Libro Mayor</h1>
        </div>
        <div className="ml-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-emerald-300">
            <span className="material-symbols-outlined text-base">trending_up</span>
            <span className="font-mono">Semana: +{Math.round(netBalance).toLocaleString()} DUC</span>
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

      {/* ── SUMMARY ROW ── */}
      <div className="flex-none grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3 border-b border-white/10">
        {[
          { label: 'Ingresos Semana', value: `+${Math.round(currentWeek.revenue).toLocaleString()} DUC`, color: 'text-emerald-400', icon: 'arrow_upward' },
          { label: 'Gastos Semana',   value: `-${Math.round(currentWeek.expenses).toLocaleString()} DUC`, color: 'text-red-400', icon: 'arrow_downward' },
          { label: 'Balance Neto',    value: `${netBalance >= 0 ? '+' : ''}${Math.round(netBalance).toLocaleString()} DUC`, color: netBalance >= 0 ? 'text-amber-400' : 'text-red-400', icon: 'balance' },
          { label: 'Patrimonio',      value: `${Math.round(totalAssets).toLocaleString()} DUC`, color: 'text-purple-400', icon: 'savings' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-lg px-4 py-2 flex items-center gap-3">
            <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
            <div>
              <div className={`font-bold font-mono text-sm ${s.color}`}>{s.value}</div>
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

        {/* TRANSACCIONES */}
        {activeTab === 'transactions' && (
          <div className="glass-panel rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Detalle</th>
                  <th className="px-4 py-3 text-left">Ciudad</th>
                  <th className="px-4 py-3 text-right">Importe</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t, i) => (
                  <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        t.amount > 0
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-red-400 bg-red-500/10'
                      }`}>{t.type}</span>
                    </td>
                    <td className="px-4 py-3 text-white/70">{t.item}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">{t.city}</td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${typeColor(t.type)}`}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()} DUC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* INVERSIONES */}
        {activeTab === 'investments' && (
          <div className="space-y-3">
            {INVESTMENTS.map(inv => (
              <div key={inv.name} className="glass-panel rounded-xl p-5 flex items-center gap-4">
                <div className="flex-none w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-400">trending_up</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold">{inv.name}</div>
                  <div className="text-white/40 text-xs">{inv.category}</div>
                </div>
                <div className="text-center">
                  <div className="text-white/60 font-mono text-sm">{inv.invested.toLocaleString()}</div>
                  <div className="text-xs text-white/30">Invertido</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 font-mono font-bold">{inv.currentValue.toLocaleString()}</div>
                  <div className="text-xs text-white/30">Valor actual</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-mono font-bold text-xl">+{inv.roi}%</div>
                  <div className="text-xs text-white/30">ROI</div>
                </div>
              </div>
            ))}

            <div className="glass-panel rounded-xl p-5 border border-amber-500/30">
              <h3 className="text-amber-300 font-bold mb-3">Buscar Nuevas Inversiones</h3>
              <p className="text-white/40 text-sm mb-4">El Astillero de Lübeck busca capital para una nueva flota. Retorno estimado: 24%.</p>
              <button
                onClick={handleTakeLoan}
                className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm font-bold transition-all"
              >EMITIR CRÉDITO (50.000 DUC)</button>
            </div>
          </div>
        )}

        {/* PRÉSTAMOS */}
        {activeTab === 'loans' && (
          <div className="space-y-3">
            {activeLoans.length === 0 ? (
              <div className="text-center py-16 text-white/30 italic">Sin deudas activas</div>
            ) : (
              activeLoans.map((l: any) => (
                <div key={l.id} className="glass-panel rounded-xl p-5 flex items-center gap-4">
                  <div className="flex-none w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-400">receipt_long</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">Préstamo #{l.id}</div>
                    <div className="text-white/40 text-xs">Interés: {Math.round(l.interestRate * 100)}% · Vence: {l.weeksRemaining} semanas</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-red-400 font-mono font-bold">{Math.round(l.totalToRepay).toLocaleString()} DUC</div>
                    <div className="text-xs text-white/30">pendiente</div>
                  </div>
                  <button
                    onClick={() => handleRepay(l.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm font-bold transition-all"
                  >SALDAR</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
