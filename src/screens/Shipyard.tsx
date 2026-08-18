import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

interface ShipConfig {
  id: string
  name: string
  buildTime: string
  desc: string
  speed: string
  cargo: string
  bricks: number
  tools: number
  gold: number
}

export function Shipyard() {
  const [, setLocation] = useLocation()
  const { engine, state } = useGame()
  const player = usePlayer()
  const [selectedShipId, setSelectedShipId] = useState('cog')
  const [msg, setMsg] = useState('')

  if (!player) return null

  const ships: ShipConfig[] = [
    { id: 'snaikka', name: 'Snaikka (Lancha Rápida)', buildTime: '3 días', desc: 'Exploración rápida y pequeña capacidad de carga.', speed: '9 kt', cargo: '150 t', bricks: 10, tools: 5, gold: 3000 },
    { id: 'crayer', name: 'Crayer (Barco Mercante)', buildTime: '5 días', desc: 'Barco mercante estándar, balanceado y seguro.', speed: '7 kt', cargo: '280 t', bricks: 15, tools: 8, gold: 5000 },
    { id: 'cog', name: 'Cogge Hanseático', buildTime: '8 días', desc: 'El caballo de batalla de la liga. Gran capacidad.', speed: '6 kt', cargo: '450 t', bricks: 25, tools: 15, gold: 8000 },
    { id: 'hulk', name: 'Hulk (Escolta Pesada)', buildTime: '12 días', desc: 'Navío de guerra imperial fuertemente armado.', speed: '5 kt', cargo: '600 t', bricks: 40, tools: 25, gold: 12000 },
  ]

  const activeShip = ships.find(s => s.id === selectedShipId) || ships[2]

  const currentCityId = player?.currentCityId || 'lubeck'

  const handleCommission = () => {
    try {
      const result = engine.commissionShip(currentCityId, activeShip.id)
      if (result) {
        setMsg(`¡Construcción de ${activeShip.name} iniciada con éxito en ${currentCityId.toUpperCase()}!`)
      } else {
        setMsg('Recursos o fondos insuficientes en la ciudad')
      }
    } catch {
      setMsg('Error al comisionar navío')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#0c0f17] to-[#161d2d] text-on-surface p-margin flex flex-col gap-md">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between border-b border-white/10 pb-sm gap-4">
        <div className="flex items-center gap-md">
          <button 
            onClick={() => setLocation('/city-overview')}
            className="flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 transition-all cursor-pointer"
            title="Volver a la Ciudad"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-tertiary-fixed tracking-tight font-black uppercase">Astillero Naval de {currentCityId.toUpperCase()}</h1>
            <p className="text-on-surface-variant font-body-md">Construye y comisiona nuevos navíos para expandir tu flota.</p>
          </div>
        </div>
        <div className="flex gap-sm">
          <div className="glass-panel px-md py-xs rounded-xl bg-primary-container/40">
            <span className="text-xs uppercase text-on-surface-variant block">Oro disponible</span>
            <span className="text-xl font-bold text-tertiary">{Math.floor(player.gold || 0).toLocaleString()} DUC</span>
          </div>
        </div>
      </header>

      {msg && (
        <div className="p-sm bg-secondary/15 border border-secondary/35 text-secondary rounded-lg text-center font-bold animate-pulse">
          {msg}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 items-stretch">
        
        {/* Left side: Ship Catalog */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-md">
          <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs">
            <span className="material-symbols-outlined">sailing</span>
            Catálogo de Embarcaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            {ships.map(ship => {
              const isSelected = ship.id === selectedShipId
              return (
                <button
                  key={ship.id}
                  onClick={() => setSelectedShipId(ship.id)}
                  className={`text-left p-md rounded-xl border transition-all cursor-pointer flex flex-col gap-xs ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-bold text-lg text-on-surface">{ship.name}</span>
                    <span className="text-xs text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded uppercase">{ship.buildTime}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-xs">{ship.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs mt-sm text-xs border-t border-white/10 pt-sm">
                    <div>
                      <span className="text-on-surface-variant">Velocidad: </span>
                      <span className="font-bold text-on-surface">{ship.speed}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Capacidad: </span>
                      <span className="font-bold text-on-surface">{ship.cargo}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Right side: Requisite & Commission */}
        <section className="col-span-12 lg:col-span-5 glass-panel rounded-xl p-md flex flex-col justify-between">
          <div>
            <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs border-b border-white/10 pb-xs mb-md">
              <span className="material-symbols-outlined">construction</span>
              Requerimientos de Construcción
            </h2>
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 mb-md">
              <h3 className="font-bold text-lg text-on-surface mb-xs">{activeShip.name}</h3>
              <p className="text-xs text-on-surface-variant">{activeShip.desc}</p>
            </div>
            
            <div className="space-y-sm">
              <h4 className="text-xs uppercase text-on-surface-variant font-bold">Materiales Necesarios:</h4>
              
              {/* Ladrillos */}
              <div className="flex justify-between items-center p-xs border-b border-white/5">
                <span className="text-sm">Ladrillos</span>
                <span className="font-bold text-sm">
                  {activeShip.bricks} t
                </span>
              </div>

              {/* Herramientas */}
              <div className="flex justify-between items-center p-xs border-b border-white/5">
                <span className="text-sm">Herramientas</span>
                <span className="font-bold text-sm">
                  {activeShip.tools} t
                </span>
              </div>

              {/* Coste monetario */}
              <div className="flex justify-between items-center p-xs border-b border-white/5">
                <span className="text-sm">Coste de Mano de Obra</span>
                <span className="font-bold text-sm text-tertiary">
                  {activeShip.gold.toLocaleString()} DUC
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCommission}
            className="w-full mt-md bg-amber-500 hover:bg-amber-600 text-on-tertiary-fixed font-black text-center py-3 rounded-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border-0 shadow-xl shadow-amber-500/10 uppercase tracking-widest"
          >
            Comisionar Embarcación
          </button>
        </section>

      </div>
    </main>
  )
}
