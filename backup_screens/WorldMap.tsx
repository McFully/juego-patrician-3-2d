import { useGame, usePlayer, useSimulationState } from '../engine/GameProvider'
import { useIsDesktop } from '../hooks/useCommon'
import db from '../database/index'
const { CITIES } = db

export function WorldMap() {
  const { engine } = useGame()
  const player = usePlayer()
  const sim = useSimulationState()
  const isDesktop = useIsDesktop()

  if (!player) return null

  // Current city for the player
  const currentCityId = engine.engine.player?.currentCityId || 'lubeck'
  const activeCitiesCount = Object.keys(sim?.cities || {}).length

  return (
    <main className="w-screen h-screen overflow-hidden bg-background text-on-surface isometric-grid">
        {/* Terrain Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, #2d4c2a 0%, #1b2b1a 100%)' }}></div>
        
        <div className="relative z-10 pt-24 px-8 h-full w-full flex flex-col">
          <section className="glass-panel border border-on-surface/10 p-8 rounded-xl mb-6">
              <h1 className="text-4xl font-black text-on-surface">Mapa del Mundo</h1>
          </section>
            
          <div className="flex-1 flex gap-6 overflow-hidden pb-8">
            {isDesktop && (
              <aside className="w-80 glass-panel rounded-xl p-6 border border-on-surface/10 flex flex-col">
                <h2 className="text-xl font-bold text-tertiary-fixed mb-2">Liga Hanseática</h2>
                <p className="text-sm text-on-surface-variant mb-6">{activeCitiesCount} ciudades en la liga</p>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {CITIES.map((c: any) => (
                    <div key={c.id} className={`p-3 rounded-lg flex items-center justify-between ${c.id === currentCityId ? 'bg-tertiary/20 text-tertiary-fixed' : 'bg-surface-variant/20'}`}>
                        <span className="font-bold text-sm">{c.name}</span>
                        <span className="text-[10px] opacity-70">{c.draft === 'deep' ? 'Puerto' : 'Fluvial'}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-on-surface/10 pt-6 mt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Tamaño de la Flota</span>
                    <span className="font-black text-tertiary-fixed text-lg">{player.fleet?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Rango</span>
                    <span className="font-black text-tertiary-fixed text-lg">{player.rank || 'Mercader'}</span>
                  </div>
                </div>
              </aside>
            )}
            
            <section className="flex-1 relative rounded-xl overflow-hidden glass-panel border border-on-surface/10">
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #0a1628 0%, #1a2d4a 30%, #2d4a3a 60%, #1a2d4a 100%)',
              }} />
              
              <svg className="absolute inset-0 w-full h-full" viewBox="300 200 600 300">
                {CITIES.map((c: any) => {
                  const isActive = sim?.cities?.[c.id]
                  return (
                    <g key={c.id}>
                      <circle 
                        cx={c.x} 
                        cy={c.y} 
                        r={isActive ? "8" : "5"} 
                        fill={isActive ? "#eac349" : "#43474e"} 
                        stroke={isActive ? "#cca830" : "none"} 
                        strokeWidth="2" 
                      />
                      <text 
                        x={c.x + 15} 
                        y={c.y + 5} 
                        fill={isActive ? "#e4e4cc" : "#8e9198"} 
                        fontSize="12" 
                        fontWeight={isActive ? "900" : "400"}
                      >
                        {c.name}
                      </text>
                    </g>
                  )
                })}
              </svg>

              <div className="absolute top-6 left-6 glass-panel rounded-xl px-6 py-3 border border-on-surface/10">
                <p className="font-bold text-tertiary-fixed">Año del Señor • {sim?.date?.day} / {sim?.date?.month} / {sim?.date?.year}</p>
              </div>
              <div className="absolute top-6 right-6 glass-panel rounded-xl px-6 py-3 border border-on-surface/10 flex items-center gap-6">
                <span className="text-tertiary-fixed font-black text-2xl">{Math.floor(player.gold).toLocaleString()} ƒ</span>
                <span className="text-secondary font-bold">Día: {sim?.totalDays || 0}</span>
              </div>
            </section>
          </div>
        </div>
    </main>
  )
}
