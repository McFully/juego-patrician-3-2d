import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import db from '../database/index'
const { GOODS } = db

export function TradingOffice() {
  const [, setLocation] = useLocation()
  const { engine } = useGame()
  const player = usePlayer()
  const [selectedGood, setSelectedGood] = useState('grain')
  const [buyPrice, setBuyPrice] = useState(12)
  const [targetStock, setTargetStock] = useState(200)
  const [sellPrice, setSellPrice] = useState(18)
  const [reserveStock, setReserveStock] = useState(50)
  const [autoTrade, setAutoTrade] = useState(true)
  const [prioritizeGuild, setPrioritizeGuild] = useState(false)
  const [feedback, setFeedback] = useState('')

  if (!player) return null

  const currentCityId = player.currentCityId || player.currentCity || 'lubeck'
  const office = player.tradingOffices?.[currentCityId]

  const flash = (text: string) => {
    setFeedback(text)
    setTimeout(() => setFeedback(''), 3000)
  }

  const handleApplyMandate = () => {
    const rules = {
      autoBuyRules: {
        [selectedGood]: { buyPrice, targetStock, active: autoTrade }
      },
      autoSellRules: {
        [selectedGood]: { sellPrice, reserveStock, active: autoTrade }
      }
    }
    
    const success = engine.updateTradingOfficeRules(currentCityId, rules)
    
    if (success) {
      flash(`¡Mandato de autocomercio para ${selectedGood.toUpperCase()} aplicado con éxito!`)
    } else {
      flash(`Error: Debes construir una oficina en ${currentCityId} primero.`)
    }
  }

  const handleBuildOffice = () => {
    flash(engine.buildTradingOffice(currentCityId)
      ? '✓ Oficina comercial construida.'
      : 'Error: se requieren 60t Ladrillos, 20t Madera y 10t Herramientas en tu barco.'
    )
  }

  const handleHireManager = () => {
    flash(engine.hireOfficeManager(currentCityId)
      ? '✓ Administrador contratado.'
      : 'Error: necesitas una oficina y 300 DUC.'
    )
  }

  const handleTransferBudget = (amount: number) => {
    flash(engine.transferOfficeBudget(currentCityId, amount)
      ? amount > 0 ? `✓ Añadidos ${amount} DUC al presupuesto.` : `✓ Retirados ${Math.abs(amount)} DUC.`
      : 'Error: fondos insuficientes.'
    )
  }

  const handleDiscard = () => {
    setLocation('/city-overview')
  }

  const selectedGoodDef = GOODS.find(g => g.id === selectedGood) || GOODS[0]

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#090b11] to-[#141a27] text-on-surface p-margin flex flex-col gap-md">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 pb-sm">
        <div className="flex items-center gap-md">
          <button 
            onClick={handleDiscard}
            className="flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 transition-all cursor-pointer"
            title="Volver a la Ciudad"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-tertiary-fixed tracking-tight font-black uppercase">Oficina Comercial de {currentCityId.toUpperCase()}</h1>
            <p className="text-on-surface-variant font-body-md">Establece directivas y políticas automatizadas para el inventario de tu almacén.</p>
          </div>
        </div>
        <button 
          onClick={() => setLocation('/ledger')}
          className="border border-amber-500/30 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-xl py-xs rounded-lg font-bold text-xs cursor-pointer transition-all"
        >
          ABRIR LIBRO MAYOR
        </button>
      </header>

      {feedback && (
        <div className={`p-sm border rounded-lg text-center font-bold animate-pulse ${feedback.includes('Error') ? 'bg-red-500/15 border-red-500/35 text-red-400' : 'bg-secondary/15 border-secondary/35 text-secondary'}`}>
          {feedback}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter flex-1 items-stretch">
        
        {/* Left column: Warehouse Inventory */}
        <section className="col-span-12 lg:col-span-6 glass-panel rounded-xl p-md flex flex-col gap-md">
          <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs border-b border-white/10 pb-xs">
            <span className="material-symbols-outlined">warehouse</span>
            Inventario del Almacén
          </h2>

          <div className="grid grid-cols-3 gap-sm text-xs">
            <div className="bg-white/5 rounded-lg p-sm border border-white/10">
              <div className="text-on-surface-variant uppercase text-[10px]">Estado</div>
              <div className="font-bold text-on-surface">{office?.built ? 'Construida' : 'Sin oficina'}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-sm border border-white/10">
              <div className="text-on-surface-variant uppercase text-[10px]">Administrador</div>
              <div className="font-bold text-on-surface">{office?.managerHired ? 'Contratado' : 'Pendiente'}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-sm border border-white/10">
              <div className="text-on-surface-variant uppercase text-[10px]">Presupuesto</div>
              <div className="font-bold text-tertiary-fixed">{Math.floor(office?.budget || 0).toLocaleString()} DUC</div>
            </div>
          </div>

          {!office?.built ? (
            <button onClick={handleBuildOffice} className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase">
              Construir Oficina
            </button>
          ) : !office.managerHired ? (
            <button onClick={handleHireManager} className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase">
              Contratar Administrador (300 DUC)
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-sm">
              <button onClick={() => handleTransferBudget(1000)} className="py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-sm">
                Añadir 1.000 DUC
              </button>
              <button onClick={() => handleTransferBudget(-1000)} className="py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 font-bold text-sm">
                Retirar 1.000 DUC
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-sm overflow-y-auto max-h-[560px] pr-xs custom-scrollbar">
            {GOODS.map(g => {
              const isSelected = g.id === selectedGood
              const stock = office?.inventory?.[g.id] || 0
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGood(g.id)}
                  className={`p-sm rounded-lg border text-left flex flex-col items-center gap-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl text-tertiary-fixed">inventory_2</span>
                  <span className="font-bold text-xs truncate w-full text-center">{g.name}</span>
                  <span className="text-[10px] text-on-surface-variant">Stock: {stock} t</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Right column: Automated Trading Policies */}
        <section className="col-span-12 lg:col-span-6 glass-panel rounded-xl p-md flex flex-col justify-between overflow-y-auto">
          <div>
            <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs border-b border-white/10 pb-xs mb-md">
              <span className="material-symbols-outlined">settings</span>
              Directivas para {selectedGoodDef?.name || 'Recurso'}
            </h2>

            <div className="grid grid-cols-2 gap-md">
              
              {/* Compra */}
              <div className="space-y-sm p-sm rounded-lg bg-white/5 border border-white/5">
                <h3 className="font-bold text-sm text-emerald-400">Políticas de Compra</h3>
                
                <div>
                  <label className="block text-xs text-on-surface-variant mb-xs">Precio Máx de Compra (per t)</label>
                  <input 
                    type="number" 
                    value={buyPrice} 
                    onChange={e => setBuyPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1b2536] border border-white/10 rounded px-2 py-1.5 text-sm outline-none text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs text-on-surface-variant mb-xs">Stock Objetivo (t)</label>
                  <input 
                    type="number" 
                    value={targetStock} 
                    onChange={e => setTargetStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1b2536] border border-white/10 rounded px-2 py-1.5 text-sm outline-none text-on-surface"
                  />
                </div>
              </div>

              {/* Venta */}
              <div className="space-y-sm p-sm rounded-lg bg-white/5 border border-white/5">
                <h3 className="font-bold text-sm text-amber-400">Políticas de Venta</h3>
                
                <div>
                  <label className="block text-xs text-on-surface-variant mb-xs">Precio Mín de Venta (per t)</label>
                  <input 
                    type="number" 
                    value={sellPrice} 
                    onChange={e => setSellPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1b2536] border border-white/10 rounded px-2 py-1.5 text-sm outline-none text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs text-on-surface-variant mb-xs">Stock de Reserva (No vender)</label>
                  <input 
                    type="number" 
                    value={reserveStock} 
                    onChange={e => setReserveStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1b2536] border border-white/10 rounded px-2 py-1.5 text-sm outline-none text-on-surface"
                  />
                </div>
              </div>

            </div>

            <div className="flex gap-md mt-md">
              <label className="flex items-center gap-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoTrade} 
                  onChange={e => setAutoTrade(e.target.checked)}
                  className="rounded bg-[#1b2536] border-white/10 text-amber-500 outline-none"
                />
                <span className="text-xs font-bold uppercase">Autocomercio Activado</span>
              </label>

              <label className="flex items-center gap-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={prioritizeGuild} 
                  onChange={e => setPrioritizeGuild(e.target.checked)}
                  className="rounded bg-[#1b2536] border-white/10 text-amber-500 outline-none"
                />
                <span className="text-xs font-bold uppercase">Priorizar Gremio</span>
              </label>
            </div>
          </div>

          <div className="flex gap-sm mt-md">
            <button 
              onClick={handleDiscard}
              className="flex-1 bg-white/5 hover:bg-white/10 text-on-surface py-3 rounded-xl font-bold cursor-pointer transition-all border border-white/10"
            >
              DESCARTAR
            </button>
            <button 
              onClick={handleApplyMandate}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-on-tertiary-fixed py-3 rounded-xl font-black cursor-pointer transition-all border-0 shadow-lg shadow-amber-500/10"
            >
              APLICAR MANDATO
            </button>
          </div>
        </section>

      </div>
      <style>{`
        .glass-panel {
          background: rgba(0, 31, 63, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffe088;
          border-radius: 10px;
        }
      `}</style>
    </main>
  )
}
