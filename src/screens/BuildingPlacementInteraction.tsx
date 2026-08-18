import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

const FACTORY_TYPES: Record<string, { name: string; icon: string; desc: string; workers: number }> = {
  brickwork: { name: 'Ladrillera', icon: 'precision_manufacturing', desc: 'Esencial para la expansiÃ³n temprana. Produce Ladrillos de Arcilla y Madera.', workers: 20 },
  sawmill: { name: 'Aserradero', icon: 'precision_manufacturing', desc: 'Procesa madera para construcciÃ³n y comercio.', workers: 15 },
  weaver: { name: 'Telar', icon: 'precision_manufacturing', desc: 'Teje lana en telas de alta calidad.', workers: 25 },
  smithy: { name: 'HerrerÃ­a', icon: 'precision_manufacturing', desc: 'Produce herramientas y bienes metÃ¡licos.', workers: 18 },
}

export function BuildingPlacementInteraction() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [selectedFactory, setSelectedFactory] = useState('brickwork')
  const [statusMsg, setStatusMsg] = useState('')

  if (!player) return null

  const currentCityId = player.currentCityId || 'lubeck'

  const handleBuild = () => {
    // Correctly call the engine to build the selected factory in the current city
    const result = engine.buildFactory(currentCityId, selectedFactory)
    if (result) {
      setStatusMsg('¡Construcción iniciada!')
      setTimeout(() => setLocation('/city-overview'), 1500)
    } else {
      setStatusMsg('No se puede construir aquí: Fondos o materiales insuficientes.')
    }
    setTimeout(() => setStatusMsg(''), 3000)
  }

  const factory = FACTORY_TYPES[selectedFactory] || FACTORY_TYPES.brickwork
  const gold = Math.floor(player.gold).toLocaleString()
  const pop = (worldState?.simulation?.cities?.[currentCityId]?.population || 0).toLocaleString()

  return (
    <>
    
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-md min-w-0">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer truncate" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
<nav className="hidden md:flex gap-md ml-xl">
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer" onClick={() => setLocation('/world-map')}>Mapa del Mundo</button>
<button className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer" onClick={() => setLocation('/city-overview')}>Vista de la Ciudad</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer" onClick={() => setLocation('/ledger')}>Libro de Cuentas</button>
</nav>
</div>
<div className="flex items-center gap-sm">
<div className="glass-panel px-md py-xs rounded-lg text-tertiary-fixed font-bold text-sm">
  {gold} DUC
</div>
<button className="material-symbols-outlined text-on-surface-variant p-xs hover:text-tertiary-fixed transition-all" data-icon="notifications" aria-label="Centro de mensajes">notifications</button>
</div>
</header>

<main className="relative w-full h-full bg-[#0a0b04] overflow-hidden">

<div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: "1000px" }}>
<div className="isometric-grid w-[2000px] h-[2000px] relative">

<div className="absolute top-[400px] left-[400px] w-40 h-40 bg-surface-container-highest border border-outline/20"></div>
<div className="absolute top-[400px] left-[560px] w-40 h-40 bg-surface-container-highest border border-outline/20"></div>


<div className="absolute top-[600px] left-[600px] w-20 h-20 cell-valid"></div>
<div className="absolute top-[600px] left-[620px] w-20 h-20 cell-valid"></div>
<div className="absolute top-[620px] left-[600px] w-20 h-20 cell-valid"></div>
<div className="absolute top-[620px] left-[620px] w-20 h-20 cell-valid"></div>

<div className="absolute top-[600px] left-[580px] w-20 h-20 cell-invalid"></div>

<div className="absolute top-[580px] left-[580px] w-60 h-60 ghost-building transition-all" id="ghost-target">
<img alt="Arquitectura de Ladrillo" className="w-full h-full object-contain" src={ASSETS.BUILDING_PREVIEW}/>
</div>
</div>
</div>

<div className="fixed bottom-margin right-margin z-40 w-[180px] h-[180px] md:w-[280px] md:h-[280px] flex items-center justify-center">
<svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 100 100">

<circle cx="50" cy="50" fill="rgba(0, 31, 63, 0.85)" r="48" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="0.5"></circle>

<path className="action-wheel-segment" d="M 50 50 L 50 2 A 48 48 0 0 1 98 50 Z" fill="rgba(212, 175, 55, 0.2)"></path>

<text className="material-symbols-outlined text-[10px] fill-[#D4AF37]" fill="#D4AF37" style={{ fontSize: "8px" }} x="68" y="32">precision_manufacturing</text>

<path d="M 50 50 L 98 50 A 48 48 0 0 1 50 98 Z" fill="transparent" stroke="rgba(228, 228, 204, 0.1)" strokeWidth="0.5"></path>
<path d="M 50 50 L 50 98 A 48 48 0 0 1 2 50 Z" fill="transparent" stroke="rgba(228, 228, 204, 0.1)" strokeWidth="0.5"></path>
<path d="M 50 50 L 2 50 A 48 48 0 0 1 50 2 Z" fill="transparent" stroke="rgba(228, 228, 204, 0.1)" strokeWidth="0.5"></path>
</svg>

<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
<span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest">Construir</span>
<span className="font-title-md text-title-md text-on-surface">{factory.name}</span>
</div>
</div>

<div className="cursor-follow glass-modal p-sm rounded-xl min-w-[140px] md:min-w-[180px] z-30 hidden md:block" id="cursor-tooltip">
<div className="flex flex-col gap-xs">
<div className="flex justify-between items-center border-b border-on-surface/10 pb-xs mb-xs">
<span className="font-label-sm text-label-sm text-tertiary">Costes de ConstrucciÃ³n</span>
</div>
<div className="flex items-center gap-sm">
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-sm text-[#D4AF37]" data-icon="square">square</span>
<span className="font-body-md text-body-md text-on-surface">Ladrillos: 40</span>
</div>
<div className="flex items-center gap-xs ml-auto">
<span className="material-symbols-outlined text-sm text-[#D4AF37]" data-icon="forest">forest</span>
<span className="font-body-md text-body-md text-on-surface">Madera: 20</span>
</div>
</div>
<div className="flex justify-between items-center mt-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Mantenimiento:</span>
<span className="font-label-sm text-label-sm text-error">12 Oro</span>
</div>
<div className="mt-sm pt-xs border-t border-on-surface/10 flex items-center gap-xs text-secondary">
<span className="material-symbols-outlined text-[16px]" data-icon="check_circle">check_circle</span>
<span className="font-label-sm text-label-sm">UbicaciÃ³n VÃ¡lida</span>
</div>
</div>
</div>
</main>

<div className="fixed top-[80px] left-margin flex flex-wrap gap-md z-40">
<div className="glass-panel px-md py-sm rounded-lg flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary" data-icon="payments">payments</span>
<span className="font-title-md text-title-md text-on-surface">{gold} <span className="text-tertiary font-label-sm">Oro</span></span>
</div>
<div className="glass-panel px-md py-sm rounded-lg flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="group">group</span>
<span className="font-title-md text-title-md text-on-surface">{pop} <span className="text-on-surface-variant font-label-sm">Hab.</span></span>
</div>
</div>



<aside className="fixed left-margin top-[160px] w-full md:w-72 max-w-[280px] flex flex-col gap-md z-40 animate-fade-in">
<div className="glass-modal p-md rounded-xl">
<h3 className="font-title-md text-title-md text-tertiary mb-sm">Edificio Seleccionado</h3>
<div className="relative w-full h-32 rounded-lg bg-surface-container-low mb-md overflow-hidden border border-outline/10">
<img alt="Vista Previa de ConstrucciÃ³n" className="w-full h-full object-cover opacity-80" src={ASSETS.BUILDING_PREVIEW}/>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-md">
                {factory.desc}
            </p>
<div className="flex flex-col gap-xs">
<div className="flex justify-between items-center text-on-surface">
<span className="font-label-sm text-label-sm">Mano de Obra</span>
<span className="font-label-sm text-label-sm">{factory.workers} Artesanos</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-xs">
<div className="bg-secondary h-full w-[65%] shadow-[0_0_8px_rgba(119,221,106,0.5)]"></div>
</div>
</div>
</div>
<button onClick={handleBuild} className="bg-tertiary text-on-tertiary-fixed font-bold py-sm px-md rounded-lg flex items-center justify-center gap-sm scale-100 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
<span className="material-symbols-outlined" data-icon="build">build</span>
            CONFIRMAR UBICACIÃ“N
        </button>
</aside>

    <style>{`
body {
            background-color: #131407;
            color: #e4e4cc;
            overflow: hidden;
            font-family: 'Montserrat', sans-serif;
        }
        .isometric-grid {
            transform: rotateX(60deg) rotateZ(45deg);
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, rgba(228, 228, 204, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(228, 228, 204, 0.05) 1px, transparent 1px);
        }
        .glass-panel {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .glass-modal {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(228, 228, 204, 0.15);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .action-wheel-segment {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ghost-building {
            pointer-events: none;
            opacity: 0.6;
            filter: drop-shadow(0 0 10px #D4AF37);
        }
        .cell-valid { background: rgba(119, 221, 106, 0.3); border: 1px solid #77dd6a; }
        .cell-invalid { background: rgba(147, 0, 10, 0.4); border: 1px solid #ffb4ab; }
        @keyframes pulse-gold {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }
        .cursor-follow {
            position: fixed;
            pointer-events: none;
            z-index: 100;
            transition: transform 0.05s linear;
        }
    `}</style>
  </>
  )
}
