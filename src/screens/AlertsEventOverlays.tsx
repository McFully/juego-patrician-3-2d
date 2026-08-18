import { useLocation } from 'wouter'
import { useState } from 'react'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function AlertsEventOverlays() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  if (!player) return null

  const activeEvents = worldState?.simulation?.world?.events || []
  const date = worldState?.simulation?.world?.date || { day: 1, month: 1, year: 1300 }

  const handleClearAll = () => {
    // Logic to dismiss all current alerts
  }

  const handleAction = (eventId: string) => {
    setSelectedEvent(eventId)
    // Dynamic logic based on event type
  }

  return (
    <>
    
<div className="fixed inset-0 z-0 scale-110">
<img alt="Mapa Macro del Báltico" className="w-full h-full object-cover filter brightness-50 contrast-125" src={ASSETS.MAP_BG}/>
<div className="absolute inset-0 bg-gradient-to-b from-primary-container/20 to-background/80 pointer-events-none"></div>
</div>

<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-md min-w-0">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer truncate" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
<nav className="hidden md:flex gap-md ml-xl">
<button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mapa Mundial</button>
<button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Libro de Cuentas</button>
<button onClick={() => setLocation('/convoy-manager')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Flota</button>
<button onClick={() => setLocation('/market')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mercado</button>
</nav>
</div>
<div className="flex items-center gap-sm">
<div className="glass-base px-md py-xs rounded-lg border border-tertiary-fixed/30 text-tertiary-fixed font-bold text-sm">
  {Math.floor(player.gold).toLocaleString()} DUC
</div>
<button className="p-xs text-tertiary-fixed transition-all scale-105 active:scale-95" aria-label="Notificaciones activas">
<span className="material-symbols-outlined">notifications_active</span>
</button>
</div>
</header>

<main className="relative z-10 w-full h-full pt-[80px] pb-[100px] px-margin flex items-center justify-center">

{/* Main Alert Dialog */}
<div className="relative max-w-2xl w-full glass-modal rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform animate-in fade-in zoom-in duration-500" role="dialog" aria-modal="true" aria-label="Centro de alertas">
<div className="relative h-48 w-full overflow-hidden">
<img alt="Evento de la Liga" className="w-full h-full object-cover" src={ASSETS.CITY_BG}/>
<div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 to-transparent"></div>
<div className="absolute bottom-md left-md">
<h2 className="font-headline-lg text-headline-lg text-tertiary-fixed drop-shadow-lg">Centro de Mensajes</h2>
<p className="font-body-md text-on-surface/80">Hanseatic Strategos v0.1.0 · Lübeck</p>
</div>
</div>

<div className="p-md space-y-sm">
<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Últimas Notificaciones</h3>
<div className="space-y-xs max-h-64 overflow-y-auto custom-scrollbar pr-xs">
{activeEvents.length === 0 ? (
  <div className="text-center py-8 text-on-surface/30 italic">No hay alertas activas en la Hansa.</div>
) : (
  activeEvents.map((e: any, i: number) => (
    <div key={i} className="flex items-center justify-between py-xs border-b border-on-surface/5 hover:bg-white/5 px-2 rounded transition-all">
      <div className="flex items-center gap-sm">
        <span className={`material-symbols-outlined text-sm ${e.type === 'crisis' ? 'text-error' : e.type === 'info' ? 'text-blue-400' : 'text-tertiary'}`}>
          {e.type === 'crisis' ? 'warning' : e.type === 'info' ? 'info' : 'campaign'}
        </span>
        <span className="text-sm text-on-surface/70">{e.message}</span>
      </div>
      <span className="text-[10px] text-white/30 font-mono">{e.date}</span>
    </div>
  ))
)}
</div>
</div>
<div className="p-md flex justify-end gap-md border-t border-on-surface/10">
<button onClick={() => setLocation('/city-overview')} className="px-md py-sm bg-tertiary text-on-tertiary rounded-lg font-bold text-sm hover:scale-105 hover:shadow-lg transition-all animate-pulse-gold">
                    Cerrar y Continuar
                </button>
</div>
</div>

<aside className="fixed right-margin top-[100px] bottom-[120px] w-80 hidden lg:flex flex-col gap-sm z-20 pointer-events-none">

<div className="pointer-events-auto glass-base p-md rounded-xl border-l-4 border-error transform hover:translate-x-[-8px] transition-transform duration-300 shadow-xl group">
<div className="flex items-start gap-sm">
<div className="p-xs bg-error/20 rounded-lg text-error">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
</div>
<div className="flex-1">
<h4 className="font-label-sm text-label-sm text-error mb-xs">PELIGRO CRÍTICO</h4>
<p className="font-title-md text-title-md text-on-surface leading-tight">¡El Convoy Alfa está bajo ataque pirata!</p>
<div className="mt-sm flex justify-between items-center">
<span className="text-label-sm font-label-sm text-on-surface/50">Cerca de Jutlandia</span>
<button onClick={() => setLocation('/combat')} className="text-error font-label-sm text-label-sm hover:underline">Intervenir</button>
</div>
</div>
</div>
</div>
</aside>

<div className="pointer-events-auto lg:hidden glass-base p-md rounded-xl border-l-4 border-error mt-4 shadow-xl">
<div className="flex items-start gap-sm">
<div className="p-xs bg-error/20 rounded-lg text-error">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
</div>
<div className="flex-1">
<h4 className="font-label-sm text-label-sm text-error mb-xs">PELIGRO CRÍTICO</h4>
<p className="font-title-md text-title-md text-on-surface leading-tight">¡El Convoy Alfa está bajo ataque pirata!</p>
<div className="mt-sm flex justify-between items-center">
<span className="text-label-sm font-label-sm text-on-surface/50">Cerca de Jutlandia</span>
<button onClick={() => setLocation('/combat')} className="text-error font-label-sm text-label-sm hover:underline">Intervenir</button>
</div>
</div>
</div>
</div>

</main>

<div className="fixed inset-0 pointer-events-none z-[5]" id="map-interaction"></div>


    <style>{`
.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-base {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .glass-modal {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #D4AF37;
            border-radius: 10px;
        }
        @keyframes pulse-gold {
            0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
            100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        .animate-pulse-gold {
            animation: pulse-gold 2s infinite;
        }
    `}</style>
  </>
  )
}
