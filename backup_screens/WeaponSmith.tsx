import { useState } from 'react'
import { useGame, usePlayer } from '../engine/GameProvider'
import db from '../database/index'
const { CITIES } = db
import { useIsDesktop } from '../hooks/useCommon'

export function WeaponSmith() {
  const { engine, state } = useGame()
  const player = usePlayer()
  const isDesktop = useIsDesktop()
  const currentCityId = engine.engine.player?.currentCityId || 'lubeck'
  const cityDef = CITIES.find((c: any) => c.id === currentCityId)
  
  const [selectedShipIndex, setSelectedShipIndex] = useState(0)

  if (!player) return null

  const dockedShips = player.fleet?.filter((s: any) => s.currentCity === currentCityId && !s.inTransit) || []
  const currentShip = dockedShips[selectedShipIndex]

  const handleBuy = (type: 'saber' | 'cannon', count: number) => {
    if (!currentShip) return
    const success = engine.buyWeapons(type, count, player.fleet.indexOf(currentShip))
    if (success) {
      alert(`¡Comprados ${count} ${type === 'saber' ? 'sables' : 'cañones'}!`)
    } else {
      alert('Error: Oro insuficiente.')
    }
  }

  return (
    <main className="w-screen h-screen overflow-hidden bg-background text-on-surface isometric-grid">
        {/* Terrain Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, #2d4c2a 0%, #1b2b1a 100%)' }}></div>
        
        <div className="relative z-10 pt-24 px-8 max-w-7xl mx-auto h-full overflow-y-auto">
            <section className="relative h-[300px] rounded-xl overflow-hidden mb-8 glass-panel border border-on-surface/10 p-8 flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent"></div>
                <div className="relative z-10">
                    <p className="font-label-sm text-tertiary-fixed uppercase tracking-widest mb-1">Defensa</p>
                    <h1 className="text-4xl font-black text-on-surface drop-shadow-lg">{cityDef?.name} — Armero</h1>
                </div>
            </section>

          <div className="grid grid-cols-12 gap-6 pb-24">
            {isDesktop && (
              <aside className="col-span-12 lg:col-span-3 glass-panel rounded-xl p-6 border border-on-surface/10">
                <h2 className="text-xl font-bold text-tertiary-fixed mb-4">Armería</h2>
                <p className="text-sm text-on-surface-variant mb-6">Equipa tu flota.</p>
                
                <h4 className="font-bold text-on-surface mb-4 uppercase text-sm tracking-widest">Seleccionar Navío</h4>
                <div className="space-y-2 overflow-y-auto">
                    {dockedShips.map((ship: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedShipIndex(idx)}
                        className={`w-full text-left p-4 rounded-xl text-sm transition-all ${
                        selectedShipIndex === idx ? 'bg-tertiary/20 text-tertiary-fixed font-bold border border-tertiary/30' : 'hover:bg-on-surface/5 text-on-surface-variant'
                        }`}
                    >
                        {ship.name} ({ship.typeId})
                    </button>
                    ))}
                    {dockedShips.length === 0 && (
                    <p className="text-xs italic text-on-surface-variant">No hay navíos en puerto.</p>
                    )}
                </div>
              </aside>
            )}

            <section className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
              <div className="glass-panel rounded-xl p-6 border border-on-surface/10 flex flex-col">
                <h3 className="text-xl font-bold text-on-surface mb-6">Comprar Armamento</h3>
                <div className="space-y-4">
                  <div className="p-6 glass-base rounded-xl border border-on-surface/10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-container-high rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-tertiary-fixed">swords</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface">Sables de Abordaje</h4>
                      <p className="text-xs text-on-surface-variant mb-4">Combate cuerpo a cuerpo.</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-tertiary-fixed">50 ƒ</span>
                        <div className="flex gap-2">
                          <button className="bg-primary-container px-4 py-2 rounded-lg font-bold hover:bg-surface-variant transition-all" onClick={() => handleBuy('saber', 1)}>+1</button>
                          <button className="bg-primary-container px-4 py-2 rounded-lg font-bold hover:bg-surface-variant transition-all" onClick={() => handleBuy('saber', 10)}>+10</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass-base rounded-xl border border-on-surface/10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-container-high rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-tertiary-fixed">bomb</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface">Cañones de Cubierta</h4>
                      <p className="text-xs text-on-surface-variant mb-4">Combate naval.</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-tertiary-fixed">500 ƒ</span>
                        <div className="flex gap-2">
                          <button className="bg-primary-container px-4 py-2 rounded-lg font-bold hover:bg-surface-variant transition-all" onClick={() => handleBuy('cannon', 1)}>+1</button>
                          <button className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-lg font-black hover:scale-[1.02] active:scale-95 transition-all" onClick={() => handleBuy('cannon', 5)}>+5</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6 border border-on-surface/10">
                <h3 className="text-xl font-bold text-on-surface mb-6">Estado del Navío</h3>
                {currentShip ? (
                    <div className="space-y-4">
                        <div className="glass-base p-6 rounded-xl border border-tertiary/20">
                            <h4 className="font-bold text-tertiary mb-4 uppercase tracking-widest">{currentShip.name}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Sables</span>
                                    <span className="font-bold">{currentShip.sabers || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Cañones</span>
                                    <span className="font-bold">{currentShip.cannons || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Tripulación</span>
                                    <span className="font-bold">{currentShip.crewMax}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">Condición</span>
                                    <span className="font-bold">{Math.floor((currentShip.hp / currentShip.hpMax) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center italic text-on-surface-variant">Selecciona un navío en puerto.</p>
                )}
              </div>
            </section>
          </div>
        </div>
    </main>
  )
}
