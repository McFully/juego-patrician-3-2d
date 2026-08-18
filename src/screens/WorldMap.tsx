import { useLocation } from 'wouter'
import { useState, useMemo } from 'react'
import { usePlayer, useGame, useSimulationState } from '../engine/GameProvider'
import db from '../database/index'
import { ASSETS } from '../utils/proceduralAssets'

const { CITIES: CITIES_LIST } = db
const SPEEDS = [1, 2, 4]

export function WorldMap() {
  const [, setLocation] = useLocation()
  const player = usePlayer()
  const { engine } = useGame()
  const sim = useSimulationState()
  const [speedIndex, setSpeedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const cityNodes = useMemo(() => {
    return CITIES_LIST.map((c: any) => {
      // Map coordinates to percentages for visual layout
      // Using city.x and city.y directly if coords is missing
      const posX = c.coords?.x || c.x || 0
      const posY = c.coords?.y || c.y || 0
      return {
        id: c.id,
        name: c.name,
        left: `${(posX / 1000) * 100}%`,
        top: `${(posY / 600) * 100}%`,
        prosperous: true
      }
    })
  }, [])

  if (!player) return null

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dateObj = sim?.date ? new Date(sim.date.year, sim.date.month - 1, sim.date.day) : new Date(1300, 0, 1)
  const monthName = monthNames[dateObj.getMonth()] || 'Enero'
  const year = dateObj.getFullYear() || 1300

  const handlePlayPause = () => {
    if (isPlaying) {
      engine.engine.stop()
      setIsPlaying(false)
    } else {
      engine.engine.start()
      setIsPlaying(true)
    }
  }

  const handleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(next)
    engine.setTickRate(SPEEDS[next])
  }

  const handleForward = () => {
    engine.stepDay()
  }

  const handleCityClick = (cityId: string) => {
    engine.setCurrentCity(cityId)
    setLocation(`/city/${cityId}`)
  }

  const currency = Math.floor(player.gold).toLocaleString()
  const fleetCount = player.fleet?.length || 0
  const cityCount = player.tradingOffices ? Object.keys(player.tradingOffices).length : 0

  return (
    <>
    
<div className="fixed inset-0 z-0">
<img alt="Mapa Macro" className="w-full h-full object-cover grayscale opacity-30" src={ASSETS.MAP_BG}/>
<div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-[#001f3f]/80"></div>
</div>

<nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-md">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
<div className="hidden md:flex gap-md ml-xl">
<button className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer">Mapa Mundial</button>
<button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Libro Mayor</button>
<button onClick={() => setLocation('/convoy-manager')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Convoy</button>
<button onClick={() => setLocation('/city-overview')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Vista Ciudad</button>
</div>
</div>
<div className="flex items-center gap-md">
<div className="glass-panel px-md py-xs rounded-lg text-tertiary-fixed font-bold text-sm">
  {currency} DUC
</div>
<button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform bg-transparent border-0 cursor-pointer">notifications</button>
</div>
</nav>

<main className="relative w-full h-screen overflow-hidden cursor-crosshair">

<div className="absolute inset-0 z-20 pointer-events-none">
{cityNodes.map(node => (
  <div 
    key={node.id}
    className="absolute pointer-events-auto group" 
    style={{ top: node.top, left: node.left }}
  >
    <div className="flex flex-col items-center">
      <div 
        onClick={() => handleCityClick(node.id)}
        className={`w-4 h-4 rounded-full shadow-[0_0_15px_#ffe088] node-pulse cursor-pointer ${node.id === player.currentCityId ? 'bg-amber-400 scale-125' : 'bg-tertiary-fixed'}`}
      ></div>
      <span className="mt-xs font-label-sm text-label-sm text-tertiary-fixed bg-primary-container/80 px-xs rounded">{node.name}</span>

      <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 w-48 glass-panel-heavy p-sm rounded-xl z-50">
        <div className="flex justify-between items-center mb-xs">
          <span className="font-title-md text-tertiary-fixed">{node.name}</span>
          <span className="material-symbols-outlined text-sm text-secondary">verified</span>
        </div>
        <div className="space-y-xs">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant">
            <span>Estado</span>
            <span className="text-secondary-fixed">Próspero</span>
          </div>
          <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
            <div className="bg-secondary w-3/4 h-full"></div>
          </div>
          <button 
            onClick={() => handleCityClick(node.id)}
            className="w-full mt-xs py-1 bg-amber-500 text-black text-[10px] font-bold rounded hover:bg-amber-400 transition-colors"
          >ENTRAR A CIUDAD</button>
        </div>
      </div>
    </div>
  </div>
))}
</div>

<div className="absolute top-md left-margin z-30 flex flex-col gap-md w-full md:w-72 mt-xl">
<div className="glass-panel p-md rounded-xl shadow-lg border-l-4 border-tertiary-fixed">
<div className="flex items-center gap-sm mb-sm">
<span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
<h2 className="font-title-md text-title-md text-on-surface">Tesorería</h2>
</div>
<div className="text-xl text-tertiary-fixed font-black tracking-tight">{currency} <span className="text-xs font-normal">florines</span></div>
<div className="flex items-center gap-xs text-secondary-fixed mt-xs">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="font-label-sm text-label-sm">+1,240 / mes</span>
</div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="glass-panel p-sm rounded-xl bg-black/40">
<div className="text-on-surface-variant font-label-sm text-[10px] uppercase tracking-tighter">Flota Actual</div>
<div className="text-title-md text-on-surface font-black">{fleetCount} Navíos</div>
</div>
<div className="glass-panel p-sm rounded-xl bg-black/40">
<div className="text-on-surface-variant font-label-sm text-[10px] uppercase tracking-tighter">Oficinas</div>
<div className="text-title-md text-on-surface font-black">{cityCount} Ciudades</div>
</div>
</div>
</div>

<div className="absolute bottom-margin left-1/2 -translate-x-1/2 z-40">
<div className="glass-panel-heavy p-sm rounded-2xl flex items-center gap-md border border-tertiary-fixed/20 shadow-2xl">
<div className="flex items-center gap-sm px-md border-r border-on-surface/10">
<div className="flex flex-col">
<span className="text-[10px] uppercase text-on-surface-variant font-black">Hanseatic Standard Time</span>
<span className="text-lg font-black text-white tracking-widest">{sim?.date?.day || 15} {monthName} {year}</span>
</div>
</div>
<div className="flex items-center gap-sm pr-md">
<button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer">
<span className="material-symbols-outlined text-tertiary-fixed">{isPlaying ? 'pause' : 'play_arrow'}</span>
</button>
<button onClick={handleForward} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer">
<span className="material-symbols-outlined text-white/50">fast_forward</span>
</button>
<button onClick={handleSpeed} className="flex items-center gap-1 px-md py-1 bg-tertiary text-on-tertiary rounded-full font-black text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer">
<span className="material-symbols-outlined text-sm">speed</span>
                    x{SPEEDS[speedIndex]}
                </button>
</div>
</div>
</div>

<div className="absolute bottom-margin right-margin z-30 hidden lg:block">
<div className="glass-panel p-md rounded-xl space-y-sm w-full md:w-64 shadow-xl">
<div className="flex items-center gap-sm text-secondary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>anchor</span>
<span className="font-label-sm text-label-sm font-black uppercase tracking-widest">Estado del Mar</span>
</div>
<p className="text-body-md text-white/80">Vientos favorables del Norte. Sin actividad pirata reportada en el sector actual.</p>
</div>
</div>
</main>

    <style>{`
.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .glass-panel-heavy {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
        .node-pulse {
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        body {
            background-color: #001f3f;
            overflow: hidden;
        }
    `}</style>
  </>
  )
}
