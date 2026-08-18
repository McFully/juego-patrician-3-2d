import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function BuildingStatistics() {
  const [, setLocation] = useLocation()
  const { engine, state } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')

  if (!player) return null

  const factories = player.factories || []
  const activeFactory = factories[0] || { id: 'refinery', name: 'Gran Refinería de Sal', workers: 142, maxWorkers: 150, efficiency: 94, type: 'Industria • Nivel III', status: 'OPERATIVA', district: 'DISTRITO DE LÜBECK' }

  const handleHireWorkers = () => {
    const result = engine.hireWorkers(activeFactory.id, 10)
    if (result !== false) {
      setMsg(`${result} trabajadores contratados en ${activeFactory.name}`)
    } else {
      setMsg('No se pueden contratar más trabajadores')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const gold = Math.floor(player.gold).toLocaleString()
  const currentCityId = player.currentCityId || 'lubeck'
  const pop = (state?.simulation?.cities?.[currentCityId]?.population || 0).toLocaleString()

  return (
    <>
    
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary-fixed text-[32px]">anchor</span>
<h1 className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</h1>
</div>
<nav className="hidden md:flex items-center gap-lg">
<button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mapa Mundial</button>
<button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Libro de Cuentas</button>
<button onClick={() => setLocation('/convoy-manager')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Convoyes</button>
</nav>
<div className="flex items-center gap-md">
<div className="glass-panel px-md py-xs rounded-lg text-tertiary-fixed font-bold text-sm">
  {gold} DUC
</div>
<button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed scale-105 active:scale-95 transition-all bg-transparent border-0 cursor-pointer" aria-label="Notificaciones">notifications</button>
</div>
</header>

<main className="relative h-screen w-screen pt-[80px] pb-[80px]">
<div className="absolute inset-0 z-0">
<img alt="Vista de la ciudad" className="w-full h-full object-cover opacity-60" src={ASSETS.CITY_BG}/>
</div>

<div className="absolute top-[80px] left-margin z-[60] flex gap-md">
<div className="glass-panel px-md py-sm rounded-xl flex items-center gap-sm bg-black/40 backdrop-blur-md">
<span className="material-symbols-outlined text-tertiary-fixed">payments</span>
<span className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary-fixed font-black tracking-tight">{gold}</span>
</div>
<div className="glass-panel px-md py-sm rounded-xl flex items-center gap-sm bg-black/40 backdrop-blur-md">
<span className="material-symbols-outlined text-secondary">groups</span>
<span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-black tracking-tight">{pop}</span>
</div>
</div>

<aside className="absolute top-margin right-margin z-20 w-full lg:w-[420px] h-[calc(100vh-140px)] bg-black/70 backdrop-blur-2xl rounded-xl flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-tertiary-fixed/20 animate-in fade-in slide-in-from-right-10 duration-500 overflow-hidden">

<div className="p-md border-b border-on-surface/10">
<div className="flex justify-between items-start mb-base">
<div>
<span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-widest">{activeFactory.type}</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight font-black">{activeFactory.name}</h2>
</div>
<button onClick={() => setLocation('/city-overview')} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors bg-transparent border-0 cursor-pointer" aria-label="Cerrar">close</button>
</div>
<div className="flex gap-xs">
<span className="px-xs py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold uppercase">{activeFactory.status}</span>
<span className="px-xs py-1 rounded bg-surface-variant text-on-surface-variant font-label-sm text-[10px] font-bold uppercase">{activeFactory.district}</span>
</div>
</div>

<div className="flex-1 overflow-y-auto custom-scrollbar p-md space-y-lg">

<section>
<div className="flex justify-between items-end mb-xs">
<h3 className="font-title-md text-title-md text-on-surface">Eficiencia de Producción</h3>
<span className="font-headline-lg text-headline-lg text-secondary text-shadow-gold">{activeFactory.efficiency}%</span>
</div>
<div className="w-full h-3 bg-surface-container rounded-full overflow-hidden border border-white/5">
<div className="h-full bg-gradient-to-r from-secondary-container to-secondary transition-all duration-1000 shadow-[0_0_15px_rgba(119,221,106,0.4)]" style={{ width: `${activeFactory.efficiency}%` }}></div>
</div>
<p className="mt-xs font-label-sm text-label-sm text-on-surface-variant italic">Rendimiento óptimo basado en la mano de obra actual.</p>
</section>

<section className="space-y-sm">
<div className="flex justify-between items-center">
<h3 className="font-title-md text-title-md text-on-surface">Mano de Obra</h3>
<span className="font-body-md text-body-md text-on-surface">{activeFactory.workers} / {activeFactory.maxWorkers}</span>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="bg-surface-container-high/40 p-sm rounded-lg border border-outline-variant/30">
<span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Trabajadores Activos</span>
<span className="font-title-md text-title-md text-on-primary-container">{activeFactory.workers}</span>
</div>
<div className="bg-surface-container-high/40 p-sm rounded-lg border border-outline-variant/30">
<span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Plazas Vacantes</span>
<span className="font-title-md text-title-md text-on-primary-container">{activeFactory.maxWorkers - activeFactory.workers}</span>
</div>
</div>
{msg && <p className="text-label-sm text-secondary text-center font-bold animate-pulse">{msg}</p>}
<button onClick={handleHireWorkers} className="w-full bg-tertiary text-on-tertiary-fixed font-black py-sm rounded-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-sm cursor-pointer uppercase tracking-widest">
<span className="material-symbols-outlined">person_add</span>
                        Contratar 10 Obreros
                    </button>
</section>

<section className="bg-surface-container-lowest/50 p-md rounded-xl border border-white/5 space-y-md overflow-x-auto">
<h3 className="font-title-md text-title-md text-tertiary-fixed border-b border-tertiary-fixed/20 pb-xs">Estadísticas Económicas</h3>
<div className="space-y-sm font-mono text-xs">
<div className="flex justify-between">
<span className="text-on-surface-variant">Mantenimiento Diario</span>
<span className="text-red-400 font-bold">- 450 DUC</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Sueldos (100%)</span>
<span className="text-red-400 font-bold">- 120 DUC</span>
</div>
<div className="flex justify-between pt-xs border-t border-white/10">
<span className="text-on-surface font-bold">Coste Diario Total</span>
<span className="text-red-400 font-black px-2 bg-red-500/10 rounded">- 570 DUC</span>
</div>
</div>
</section>
</div>

<div className="p-md bg-surface-container-highest/20 border-t border-on-surface/10 grid grid-cols-2 gap-sm">
<button className="border-2 border-on-surface/30 hover:bg-white/10 text-on-surface font-black py-base rounded-lg transition-all flex items-center justify-center gap-xs cursor-pointer uppercase text-xs tracking-widest">
<span className="material-symbols-outlined">upgrade</span>
                    Mejorar
                </button>
<button className="border-2 border-error/50 hover:bg-error/10 text-error font-black py-base rounded-lg transition-all flex items-center justify-center gap-xs cursor-pointer uppercase text-xs tracking-widest">
<span className="material-symbols-outlined">delete</span>
                    Demoler
                </button>
</div>
</aside>
</main>

    <style>{`
.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .text-shadow-gold {
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ffe088;
            border-radius: 10px;
        }
    `}</style>
  </>
  )
}
