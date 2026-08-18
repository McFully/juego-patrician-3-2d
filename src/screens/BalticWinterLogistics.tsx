import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, useSimulationState } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function BalticWinterLogistics() {
  const [, setLocation] = useLocation()
  const { engine } = useGame()
  const sim = useSimulationState()
  const winterMonth = 4
  const thawCountdown = '22:14:09'
  const [msg, setMsg] = useState('')

  const winterData = sim?.winter || {
    grainReserve: 75,
    woodReserve: 50,
    depletionDays: 18,
    unrestLevel: 'CRÃTICO',
    temperature: -18,
    iceDepth: 1.4,
    fleetIdle: 12,
  }

  const handleEmergencyRelease = () => {
    engine.sellGood('grain', 100)
    setMsg('¡Granos de emergencia liberados!')
  }

  const handleAllocateFirewood = () => {
    engine.buyGood('wood', 50)
    setMsg('Leña asignada a la población')
  }

  return (
    <>
    
<div className="fixed inset-0 z-0">
<img alt="Mar Báltico helado" className="w-full h-full object-cover grayscale opacity-40" data-alt="Vista panorámica cenital del mar Báltico congelado durante un invierno severo." data-location="Mar Báltico" src={ASSETS.CITY_WINTER}/>
<div className="absolute inset-0 frost-overlay ice-texture"></div>
</div>

<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10">
<div className="flex items-center gap-md min-w-0">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight truncate">Hanseatic Strategos</span>
<nav className="hidden md:flex items-center gap-md ml-xl">
<button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mapa del Mundo</button>
<button onClick={() => setLocation('/winter')} className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer">Crisis de Invierno</button>
<button onClick={() => setLocation('/shipyard')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Astillero</button>
</nav>
</div>
<div className="flex items-center gap-sm">
<div className="flex gap-xs items-center px-sm py-xs bg-error-container/40 rounded-lg border border-error/20">
<span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
<span className="text-label-sm font-label-sm text-error uppercase tracking-widest">Helada Severa</span>
</div>
<button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-colors p-xs bg-transparent border-0 cursor-pointer" aria-label="Centro de mensajes">notifications</button>
<button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-colors p-xs bg-transparent border-0 cursor-pointer" aria-label="Ayuda">help</button>
<div className="w-10 h-10 rounded-full bg-primary overflow-hidden border-2 border-tertiary-fixed/30">
<img alt="Retrato del Gobernador" src={ASSETS.GOVERNOR}/>
</div>
</div>
</header>

<main className="relative z-10 pt-32 pb-16 px-margin h-screen flex flex-col pointer-events-none overflow-y-auto">

<div className="grid grid-cols-12 gap-gutter pointer-events-auto">

<section className="col-span-12 lg:col-span-4 glass-panel-active rounded-xl p-md flex flex-col gap-md">
<div className="flex justify-between items-center">
<h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs">
<span className="material-symbols-outlined">inventory_2</span> Reservas de Recursos
                    </h2>
<span className="text-label-sm font-label-sm text-on-surface-variant">MES 4 DEL INVIERNO</span>
</div>
<div className="space-y-md">

<div className="space-y-xs">
<div className="flex justify-between text-label-sm font-label-sm">
<span className="text-on-surface">TRIGO Y PESCADO SALADO</span>
<span className="text-error font-bold">-124 / DÃ­a</span>
</div>
<div className="h-3 w-full bg-primary-container rounded-full overflow-hidden border border-on-surface/5">
<div className="h-full bg-secondary w-3/4 rounded-full shadow-[0_0_10px_rgba(119,221,106,0.3)]"></div>
</div>
<p className="text-[10px] text-on-surface-variant italic">Agotamiento estimado: 18 dÃ­as</p>
</div>

<div className="space-y-xs">
<div className="flex justify-between text-label-sm font-label-sm">
<span className="text-on-surface">LANA Y LEÃ‘A</span>
<span className="text-tertiary-fixed font-bold">-82 / DÃ­a</span>
</div>
<div className="h-3 w-full bg-primary-container rounded-full overflow-hidden border border-on-surface/5">
<div className="h-full bg-tertiary-container w-1/2 rounded-full shadow-[0_0_10px_rgba(204,168,48,0.3)]"></div>
</div>
<p className="text-[10px] text-on-surface-variant italic">Malestar social en aumento en LÃ¼beck</p>
</div>
</div>
{msg && <p className="text-label-sm text-secondary text-center">{msg}</p>}
<div className="flex flex-col gap-sm">
  <button onClick={handleEmergencyRelease} className="mt-base bg-tertiary-fixed text-on-tertiary-fixed font-title-md text-body-md py-sm rounded-lg hover:scale-105 active:scale-95 transition-transform flex justify-center items-center gap-xs cursor-pointer">
    <span className="material-symbols-outlined">payments</span> Liberar Grano de Emergencia
  </button>
  <button onClick={handleAllocateFirewood} className="bg-surface-variant text-on-surface-variant font-title-md text-body-md py-sm rounded-lg hover:scale-105 active:scale-95 transition-transform flex justify-center items-center gap-xs cursor-pointer">
    <span className="material-symbols-outlined">forest</span> Asignar LeÃ±a de Reserva
  </button>
</div>
</section>

<section className="col-span-12 lg:col-span-4 flex flex-col items-center justify-center">
<div className="glass-panel-active rounded-full p-xl border-4 border-tertiary-fixed/20 relative">

<div className="absolute inset-0 border-t-4 border-primary rounded-full animate-[spin_10s_linear_infinite] opacity-40"></div>
<div className="flex flex-col items-center text-center">
<span className="text-label-sm font-label-sm text-primary tracking-widest uppercase">Cuenta para el Deshielo</span>
<div className="font-headline-xl text-headline-xl text-tertiary-fixed drop-shadow-[0_0_15px_rgba(255,224,136,0.4)]" id="countdown">
                            22:14:09
                        </div>
<span className="text-body-md font-body-md text-on-surface-variant">DÃ­as hasta la Primavera</span>
</div>
</div>
</section>

<section className="col-span-12 lg:col-span-4 glass-panel rounded-xl p-md overflow-hidden flex flex-col gap-sm">
<h2 className="font-title-md text-title-md text-on-surface flex items-center gap-xs">
<span className="material-symbols-outlined text-primary">hub</span> Rutas Congeladas
                </h2>
<div className="relative flex-grow rounded-lg overflow-hidden border border-primary/20 bg-primary-container">
<img alt="Carta náutica" className="w-full h-48 object-cover mix-blend-overlay opacity-80" data-alt="Carta náutica de puertos del Báltico" data-location="Puertos del Báltico" src={ASSETS.MAP_BG}/>

<div className="absolute top-1/4 left-1/3 w-3 h-3 bg-error rounded-full animate-pulse shadow-[0_0_10px_#ffb4ab]"></div>
<div className="absolute top-1/2 right-1/4 w-3 h-3 bg-error rounded-full animate-pulse shadow-[0_0_10px_#ffb4ab]"></div>
<div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-secondary rounded-full shadow-[0_0_10px_#77dd6a]"></div>

<div className="absolute bottom-2 left-2 flex flex-col gap-1 bg-background/80 backdrop-blur-md p-xs rounded border border-on-surface/10">
<div className="flex items-center gap-xs">
<div className="w-2 h-2 bg-error rounded-full"></div>
<span className="text-[10px] text-on-surface">Bloqueado por Hielo</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-2 h-2 bg-secondary rounded-full"></div>
<span className="text-[10px] text-on-surface">Passo Abierto</span>
</div>
</div>
</div>
<div className="flex gap-sm">
<div className="flex-1 glass-panel border-on-surface/5 p-xs rounded text-center">
<div className="text-label-sm font-label-sm text-on-surface-variant">Flota Inactiva</div>
<div className="text-body-md font-bold text-on-surface">12 INACTIVAS</div>
</div>
<div className="flex-1 glass-panel border-on-surface/5 p-xs rounded text-center">
<div className="text-label-sm font-label-sm text-on-surface-variant">Espesor Hielo</div>
<div className="text-body-md font-bold text-primary">1,4m</div>
</div>
</div>
</section>
</div>

<div className="flex-grow"></div>

<div className="grid grid-cols-12 gap-gutter mt-auto pointer-events-auto">
<div className="col-span-12 flex justify-between items-end">
<div className="flex flex-col sm:flex-row gap-md mb-base">
<button onClick={() => setLocation('/convoy-manager')} className="flex items-center gap-sm bg-surface-container-high hover:bg-surface-container-highest transition-colors px-md py-sm rounded-xl border border-on-surface/10 group cursor-pointer">
<span className="material-symbols-outlined text-tertiary-fixed group-hover:scale-110 transition-transform">sailing</span>
<div className="text-left">
<p className="text-label-sm font-label-sm text-on-surface-variant leading-none">Gestor de Flota</p>
<p className="text-body-md font-bold text-on-surface">Convoy Rompehielos</p>
</div>
</button>
<button onClick={() => setLocation('/diet-hall')} className="flex items-center gap-sm bg-surface-container-high hover:bg-surface-container-highest transition-colors px-md py-sm rounded-xl border border-on-surface/10 group cursor-pointer">
<span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">campaign</span>
<div className="text-left">
<p className="text-label-sm font-label-sm text-on-surface-variant leading-none">Diplomacia</p>
<p className="text-body-md font-bold text-on-surface">Concejo de Invierno</p>
</div>
</button>
</div>
<div className="mb-base glass-panel-active px-lg py-sm rounded-full flex gap-md sm:gap-xl items-center border border-primary/20 flex-wrap">
<div className="flex flex-col items-center">
<span className="text-[10px] text-on-surface-variant uppercase tracking-tighter font-bold">Temp. LÃ¼beck</span>
<span className="text-title-md font-bold text-primary">-18Â°C</span>
</div>
<div className="w-[1px] h-8 bg-on-surface/10"></div>
<div className="flex flex-col items-center">
<span className="text-[10px] text-on-surface-variant uppercase tracking-tighter font-bold">Malestar</span>
<span className="text-title-md font-bold text-error">CRÃTICO</span>
</div>
</div>
</div>
</div>
</main>

<button onClick={() => setLocation('/alerts')} className="fixed right-margin bottom-32 z-50 bg-tertiary-fixed text-on-tertiary-fixed w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-4 border-primary-container cursor-pointer" aria-label="Ver alertas">
<span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-12 transition-transform">priority_high</span>
</button>

    <style>{`
.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .frost-overlay {
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%);
            pointer-events: none;
        }
        .ice-texture {
            background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
            background-size: 24px 24px;
        }
        @keyframes pulse-gold {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        .animate-pulse-gold {
            animation: pulse-gold 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .glass-panel {
            backdrop-filter: blur(12px);
            background: rgba(0, 31, 63, 0.6);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .glass-panel-active {
            backdrop-filter: blur(24px);
            background: rgba(0, 31, 63, 0.85);
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
    `}</style>
  </>
  )
}
