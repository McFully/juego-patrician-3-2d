import { useLocation } from 'wouter'
import { useState, useMemo } from 'react'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

const TECH_CATEGORIES = [
  { id: 'warehousing', icon: 'warehouse', name: 'Almacenamiento', subtitle: 'Eficiencia y Capacidad' },
  { id: 'fortifications', icon: 'fort', name: 'Fortificaciones', subtitle: 'Defensa y Resistencia' },
  { id: 'sanitation', icon: 'cleaning_services', name: 'Saneamiento', subtitle: 'Salud Pública y Crecimiento' },
]

const TECH_TREES: any = {
  warehousing: [
    { id: 'wood_sheds', name: 'Tinglados de Madera', icon: 'home', cost: 500, tier: 'done' },
    { id: 'brick_depots', name: 'Depósitos de Ladrillo', icon: 'foundation', cost: 1500, tier: 'available' },
    { id: 'iron_vaults', name: 'Bóvedas de Hierro', icon: 'lock', cost: 5000, tier: 'locked' },
  ],
  fortifications: [
    { id: 'palisades', name: 'Palizadas', icon: 'fence', cost: 1000, tier: 'done' },
    { id: 'stone_walls', name: 'Murallas de Piedra', icon: 'castle', cost: 2500, tier: 'available' },
    { id: 'bastions', name: 'Baluartes', icon: 'fort', cost: 8000, tier: 'locked' },
  ],
  sanitation: [
    { id: 'drainage_wells', name: 'Pozos de Drenaje', icon: 'water_drop', cost: 400, tier: 'done' },
    { id: 'lead_pipes', name: 'Tuberías de Plomo', icon: 'plumbing', cost: 1200, tier: 'available' },
    { id: 'great_sewer', name: 'Gran Cloaca', icon: 'architecture', cost: 6000, tier: 'locked' },
  ],
}

export function ArchitectsGuildResearch() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [activeCategory, setActiveCategory] = useState('warehousing')
  const [researchedIds, setResearchedIds] = useState<string[]>(['wood_sheds', 'palisades', 'drainage_wells'])
  const [msg, setMsg] = useState('')
  
  const currentCityId = player?.currentCityId || 'lubeck'
  const cityState = worldState?.simulation?.cities?.[currentCityId]

  const nodes = useMemo(() => {
    const baseNodes = TECH_TREES[activeCategory] || []
    return baseNodes.map((n: any) => {
      if (researchedIds.includes(n.id)) return { ...n, tier: 'done', status: 'INVESTIGADO', statusColor: 'text-secondary' }
      if (n.tier === 'locked') return { ...n, status: 'BLOQUEADO', statusColor: 'text-on-surface-variant' }
      return { ...n, status: `${n.cost.toLocaleString()} ORO`, statusColor: 'text-on-surface-variant', tier: 'available' }
    })
  }, [activeCategory, researchedIds])

  const [selectedNodeId, setSelectedNodeId] = useState(nodes[1]?.id)
  
  const selectedNode = useMemo(() => {
    return nodes.find((n: any) => n.id === selectedNodeId) || nodes[0]
  }, [selectedNodeId, nodes])

  if (!player) return null

  const handleInvestigate = () => {
    if (selectedNode.tier === 'done') return
    if (player.gold < selectedNode.cost) {
      setMsg('Oro insuficiente para investigación.')
      setTimeout(() => setMsg(''), 3000)
      return
    }
    
    engine.donateToCathedral(selectedNode.cost)
    setResearchedIds(prev => [...prev, selectedNode.id])
    setMsg(`✓ ${selectedNode.name} iniciada.`)
    setTimeout(() => setMsg(''), 4000)
  }

  const gold = Math.floor(player.gold).toLocaleString()
  const pop = (cityState?.population || 0).toLocaleString()

  return (
    <div className="w-full h-full flex flex-col bg-slate-950">
      <header className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl gap-4">
        <div className="flex items-center gap-md">
          <span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
          <nav className="hidden md:flex items-center gap-md ml-xl">
            <button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mapa del Mundo</button>
            <button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Libro de Cuentas</button>
            <button className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer">Gremio de Arquitectos</button>
            <button onClick={() => setLocation('/town-hall')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Ayuntamiento</button>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          {msg && (
            <div className="px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-pulse mr-4">
              {msg}
            </div>
          )}
          <button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-transform scale-105 active:scale-95 bg-transparent border-0 cursor-pointer" aria-label="Centro de mensajes">notifications</button>
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-tertiary-fixed/30 ml-2">
            <img alt="Retrato" src={ASSETS.GOVERNOR}/>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-20 px-margin relative blueprint-grid overflow-hidden bg-primary-container min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img alt="Plano" className="w-full h-full object-cover" src={ASSETS.BLUEPRINT}/>
        </div>

        <div className="absolute top-32 left-margin z-20 flex flex-col gap-sm w-64">
          <h2 className="font-headline-lg text-headline-lg text-tertiary-fixed mb-sm font-black uppercase">Planos del Gremio</h2>
          {TECH_CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)} 
              className={`glass-panel w-full p-md text-left flex items-center gap-sm group transition-all border-l-4 bg-transparent cursor-pointer ${activeCategory === cat.id ? 'border-l-tertiary-fixed bg-white/5' : 'border-l-transparent hover:bg-white/5'}`}
            >
              <span className={`material-symbols-outlined ${activeCategory === cat.id ? 'text-tertiary-fixed' : 'text-on-surface-variant group-hover:text-tertiary-fixed'}`}>{cat.icon}</span>
              <div>
                <span className={`block font-bold text-sm ${activeCategory === cat.id ? 'text-tertiary-fixed' : 'text-on-surface'}`}>{cat.name}</span>
                <span className="text-[10px] uppercase tracking-tight text-on-surface-variant">{cat.subtitle}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="relative z-10 ml-72 mr-[380px] h-full overflow-x-auto scroll-hide flex items-center">
          <div className="min-w-[1200px] h-full relative p-lg flex flex-col justify-center gap-xl">
            <div className="flex items-center gap-xl relative">
              {nodes.map((node: any, i: number) => {
                const isSelected = selectedNodeId === node.id
                return (
                  <div key={node.id} className="flex items-center gap-xl">
                    <div className="tech-node flex flex-col items-center group relative z-10">
                      <div 
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`glass-panel-heavy p-lg rounded-xl border-2 w-48 text-center cursor-pointer transform transition-all duration-300 ${isSelected ? 'border-tertiary shadow-[0_0_30px_rgba(212,175,55,0.3)] scale-105' : node.tier === 'locked' ? 'opacity-60 grayscale border-on-surface/20' : 'border-white/10 hover:border-white/30'}`}
                      >
                        <span className="material-symbols-outlined text-[48px] text-tertiary-fixed mb-sm block" style={node.tier === 'done' ? { fontVariationSettings: "'FILL' 1" } : {}}>{node.icon}</span>
                        <h3 className={`font-bold text-sm leading-tight ${node.tier === 'locked' ? 'text-on-surface-variant' : 'text-on-surface'}`}>{node.name}</h3>
                        <div className={`mt-xs font-bold text-[10px] uppercase tracking-widest ${node.statusColor}`}>{node.status}</div>
                      </div>
                    </div>
                    {i < nodes.length - 1 && <div className={`w-32 h-1 rounded-full ${nodes[i+1].tier === 'locked' ? 'bg-surface-variant/30' : 'bg-tertiary-fixed/30'}`}></div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="absolute top-32 right-margin z-30 w-80">
          <div className="glass-panel-heavy p-md rounded-xl space-y-md border-t-4 border-t-tertiary-fixed shadow-2xl">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-sm text-on-surface uppercase tracking-widest">Foco de Investigación</h4>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-xs py-1 rounded text-[10px] font-black">NIVEL II</span>
            </div>
            <div className="aspect-video bg-primary-container/80 rounded-lg overflow-hidden border border-on-surface/10">
              <img alt="Detalle del plano" className="w-full h-full object-cover" src={ASSETS.BLUEPRINT}/>
            </div>
            <div>
              <h5 className="text-tertiary-fixed font-black uppercase text-sm">{selectedNode?.name}</h5>
              <p className="text-on-surface-variant text-xs mt-xs leading-relaxed">
                  La mejora en {selectedNode?.name} incrementa la eficiencia de {currentCityId.toUpperCase()} y expande nuestras capacidades comerciales.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <div className="bg-surface-variant/20 p-sm rounded-lg border border-white/5 text-center">
                <span className="block text-[10px] text-on-surface-variant uppercase font-bold mb-1">Tiempo</span>
                <span className="font-mono text-sm text-tertiary-fixed">2d 14h</span>
              </div>
              <div className="bg-surface-variant/20 p-sm rounded-lg border border-white/5 text-center">
                <span className="block text-[10px] text-on-surface-variant uppercase font-bold mb-1">Coste</span>
                <span className="font-mono text-sm text-tertiary-fixed">{selectedNode?.cost} DUC</span>
              </div>
            </div>
            <button 
              disabled={selectedNode?.tier === 'done' || selectedNode?.tier === 'locked'}
              className="w-full bg-tertiary text-on-tertiary font-black py-sm rounded-lg hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg uppercase text-sm tracking-widest border-0 cursor-pointer"
              onClick={handleInvestigate}
            >
                {selectedNode?.tier === 'done' ? 'INVESTIGADO' : 'INICIAR INVESTIGACIÓN'}
            </button>
          </div>
        </div>

        <div className="fixed bottom-margin left-1/2 -translate-x-1/2 z-40 flex flex-wrap justify-center gap-gutter px-lg py-sm glass-panel rounded-full shadow-2xl border border-tertiary-fixed/20 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-mono text-sm font-bold text-on-surface">{gold}</span>
          </div>
          <div className="h-6 w-px bg-on-surface/10 mx-2"></div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-tertiary-fixed">architecture</span>
            <span className="font-mono text-sm font-bold text-on-surface">{researchedIds.length}</span>
          </div>
          <div className="h-6 w-px bg-on-surface/10 mx-2"></div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-tertiary-fixed">groups</span>
            <span className="font-mono text-sm font-bold text-on-surface">{pop}</span>
          </div>
        </div>
      </main>

      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.1); }
        .glass-panel-heavy { background: rgba(0, 31, 63, 0.85); backdrop-filter: blur(24px); border: 1px solid rgba(228, 228, 204, 0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .blueprint-grid { background-image: radial-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px); background-size: 40px 40px; }
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
