import { useState } from 'react'
import { usePlayer } from '../engine/GameProvider'
import db from '../database/index'
const { GOODS } = db
import { useIsDesktop } from '../hooks/useCommon'

export function VesselInspection() {
  const { engine } = useGame()
  const player = usePlayer()
  const isDesktop = useIsDesktop()
  
  const [selectedShipIndex, setSelectedShipIndex] = useState(0)

  if (!player) return null

  const currentShip = player.fleet?.[selectedShipIndex]

  return (
    <main className="w-screen h-screen overflow-hidden bg-background text-on-surface isometric-grid">
        {/* Terrain Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, #2d4c2a 0%, #1b2b1a 100%)' }}></div>
        
        <div className="relative z-10 pt-24 px-8 max-w-7xl mx-auto h-full overflow-y-auto">
            <section className="relative h-[300px] rounded-xl overflow-hidden mb-8 glass-panel border border-on-surface/10 p-8 flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent"></div>
                <div className="relative z-10">
                    <p className="font-label-sm text-tertiary-fixed uppercase tracking-widest mb-1">Mantenimiento</p>
                    <h1 className="text-4xl font-black text-on-surface drop-shadow-lg">Inspección de Navío</h1>
                </div>
            </section>

          <div className="grid grid-cols-12 gap-6 pb-24">
            {isDesktop && (
              <aside className="col-span-12 lg:col-span-3 glass-panel rounded-xl p-6 border border-on-surface/10">
                <h2 className="text-xl font-bold text-tertiary-fixed mb-4">Mi Flota ({player.fleet?.length || 0})</h2>
                <div className="space-y-2 overflow-y-auto">
                  {player.fleet?.map((ship: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedShipIndex(idx)}
                      className={`w-full text-left p-4 rounded-xl text-sm transition-all ${
                        selectedShipIndex === idx ? 'bg-tertiary/20 text-tertiary-fixed font-bold border border-tertiary/30' : 'hover:bg-on-surface/5 text-on-surface-variant'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{ship.name}</span>
                        {ship.inTransit && <span className="material-symbols-outlined text-xs text-secondary">sailing</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </aside>
            )}

            <section className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
              {currentShip ? (
                <>
                  <div className="glass-panel rounded-xl p-6 border border-on-surface/10 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-on-surface">{currentShip.name}</h2>
                            <p className="text-xs text-on-surface-variant">Tipo: {currentShip.typeId.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-secondary font-bold uppercase tracking-widest">{currentShip.inTransit ? 'En el Mar' : 'En Puerto'}</p>
                            <p className="text-[10px] text-on-surface-variant">Ubicación: {currentShip.currentCity || 'Desconocida'}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="glass-base p-4 rounded-xl border border-on-surface/10">
                            <p className="text-[10px] text-tertiary uppercase">Condición</p>
                            <p className="text-xl font-bold text-on-surface">{Math.floor((currentShip.hp / currentShip.hpMax) * 100)}%</p>
                        </div>
                        <div className="glass-base p-4 rounded-xl border border-on-surface/10">
                            <p className="text-[10px] text-tertiary uppercase">Tripulación</p>
                            <p className="text-xl font-bold text-on-surface">{currentShip.crew} / {currentShip.crewMax}</p>
                        </div>
                    </div>

                    <div className="glass-base p-4 rounded-xl border border-on-surface/10 flex-grow">
                        <h4 className="font-bold text-on-surface mb-4 uppercase text-sm tracking-widest">Armamento</h4>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                            <span className="material-symbols-outlined text-tertiary-fixed mb-1">swords</span>
                            <p className="text-lg font-bold">{currentShip.sabers || 0}</p>
                            <p className="text-[9px] text-on-surface-variant uppercase">Sables</p>
                            </div>
                            <div>
                            <span className="material-symbols-outlined text-tertiary-fixed mb-1">bomb</span>
                            <p className="text-lg font-bold">{currentShip.cannons || 0}</p>
                            <p className="text-[9px] text-on-surface-variant uppercase">Cañones</p>
                            </div>
                            <div>
                            <span className="material-symbols-outlined text-tertiary-fixed mb-1">shield</span>
                            <p className="text-lg font-bold">{currentShip.upgradeLevel}</p>
                            <p className="text-[9px] text-on-surface-variant uppercase">Armadura</p>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-xl p-6 border border-on-surface/10 overflow-hidden flex flex-col">
                    <h3 className="font-bold text-xl text-on-surface mb-2">Bodega de Carga</h3>
                    <p className="text-xs text-on-surface-variant mb-6">{currentShip.cargoUsed}t / {currentShip.cargoCapacity}t Capacidad</p>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {Object.entries(currentShip.cargo || {}).map(([id, qty]: any) => (
                          <div key={id} className="p-3 glass-base rounded-lg border border-on-surface/5 flex justify-between items-center text-sm">
                            <span className="font-bold text-on-surface">{GOODS.find(g => g.id === id)?.name || id}</span>
                            <span className="font-bold text-tertiary-fixed">{qty}t</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 text-center py-20 text-on-surface-variant italic">
                  No hay navíos en tu flota.
                </div>
              )}
            </section>
          </div>
        </div>
    </main>
  )
}
