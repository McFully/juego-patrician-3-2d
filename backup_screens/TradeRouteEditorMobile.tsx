import { usePlayer } from '../engine/GameProvider'

const RESOURCES_MOBILE = [
  { id: 'salt', name: 'Sal Fina', icon: 'grain', buy: 12, sell: 28 },
  { id: 'wood', name: 'Madera Dura', icon: 'forest', buy: 5, sell: 15 },
  { id: 'wine', name: 'Vino Francés', icon: 'liquor', buy: 45, sell: 90 },
]

export function TradeRouteEditorMobile() {
  const player = usePlayer()
  if (!player) return null

  return (
    <main className="w-screen h-screen overflow-hidden bg-background text-on-surface isometric-grid">
        {/* Terrain Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, #2d4c2a 0%, #1b2b1a 100%)' }}></div>
        
        <div className="relative z-10 pt-24 px-8 max-w-lg mx-auto h-full overflow-y-auto">
          <section className="glass-panel border border-on-surface/10 p-6 rounded-xl mb-6">
              <h1 className="text-2xl font-black text-on-surface">Ruta Comercial</h1>
          </section>

          <div className="space-y-4 pb-24">
            <div className="glass-panel border border-on-surface/10 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-bold">Lübeck</p>
                    <p className="text-xs text-on-surface-variant">Puerto Base</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary">check_circle</span>
            </div>
            
            <div className="glass-panel border border-on-surface/10 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Órdenes de Mercado</h3>
                <span className="text-tertiary-fixed font-bold text-xl">{player.gold.toLocaleString()} ƒ</span>
              </div>
              <div className="space-y-4">
                {RESOURCES_MOBILE.map((res) => (
                  <div key={res.id} className="glass-base p-4 rounded-xl flex items-center gap-4">
                    <span className="material-symbols-outlined text-tertiary-fixed text-2xl">{res.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{res.name}</p>
                      <p className="text-xs text-on-surface-variant">Compra @ {res.buy}ƒ | Venta @ {res.sell}ƒ</p>
                    </div>
                    <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-sm font-bold">EDITAR</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 left-0 right-0 px-8 z-20">
            <button className="w-full bg-tertiary-fixed text-on-tertiary-fixed py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-2xl">
              <span className="material-symbols-outlined">play_arrow</span>
              INICIAR RUTA
            </button>
          </div>
        </div>
    </main>
  )
}
