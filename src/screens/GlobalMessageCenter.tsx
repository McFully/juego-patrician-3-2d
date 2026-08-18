import { useLocation } from 'wouter'
import { useState } from 'react'
import { ASSETS } from '../utils/proceduralAssets'

const FILTERS = ['Todos', 'LogÃ­stica', 'PolÃ­tica', 'Urgente']

const THREADS = [
  { category: 'Informe Urgente', catClass: 'text-error uppercase tracking-widest font-bold', time: 'Hace 10m', title: 'Avistamiento: Piratas del "Vendaval Negro"', desc: 'El CapitÃ¡n Erik informa de una nave de dudosa reputaciÃ³n cerca de Gotland...', urgent: true },
  { category: 'Alerta de Mercado', catClass: 'text-primary-fixed-dim uppercase tracking-widest', time: 'Hace 2h', title: 'Aumento de Precios de la Sal en Riga', desc: 'Fuertes nevadas han cerrado las rutas terrestres, forzando los precios un 40% al alza...' },
  { category: 'InvitaciÃ³n de la Liga', catClass: 'text-tertiary-fixed uppercase tracking-widest', time: 'Ayer', title: 'Consejo de LÃ¼beck: InvitaciÃ³n Formal', desc: 'El Alto Gremio solicita vuestra presencia para discutir los aranceles comerciales...' },
  { category: 'Rumores de Taberna', catClass: 'text-outline uppercase tracking-widest', time: 'Hace 2d', title: 'Susurros de un Nuevo Pasaje', desc: 'Un navegante ebrio afirma conocer una ruta que elude el portazgo del Sund...', faded: true },
]

export function GlobalMessageCenter() {
  const [, setLocation] = useLocation()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [activeThread, setActiveThread] = useState(0)

  return (
    <>
    
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-md">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight">Hanseatic Strategos</span>
<nav className="hidden md:flex gap-gutter items-center ml-lg">
<a className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200" href="#">Mapa del Mundo</a>
<a className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200" href="#">Libro de Cuentas</a>
<a className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200" href="#">Convoyes</a>
<a className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200" href="#">Mercado</a>
<a className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1" href="#">Consejo</a>
</nav>
</div>
<div className="flex items-center gap-sm">
<button className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform" aria-label="Centro de mensajes">notifications</button>
<button className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform" aria-label="Ayuda">help</button>
<button className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform" aria-label="Configuración">settings</button>
<img alt="Retrato del Gobernador" className="w-10 h-10 rounded-full border-2 border-tertiary-fixed" src={ASSETS.GOVERNOR}/>
</div>
</header>

<main className="pt-[80px] pb-[80px] px-margin h-full relative overflow-hidden flex items-center justify-center">

<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
<img className="w-full h-full object-cover grayscale invert" src={ASSETS.MAP_BG} alt="Fondo del mapa del Báltico"/>
</div>

<div className="relative z-10 w-full max-w-7xl h-full flex glass-modal rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] min-w-0" role="dialog" aria-modal="true" aria-label="Centro de mensajes">

<aside className="w-1/3 border-r border-on-surface/10 flex flex-col bg-surface-container-lowest/40 min-w-0 overflow-hidden">
<div className="p-md border-b border-on-surface/10">
<h2 className="font-headline-lg text-headline-lg text-tertiary-fixed mb-sm">Centro de Mensajes</h2>
<div className="flex gap-xs flex-wrap">
<span className="px-sm py-xs bg-tertiary-fixed/10 text-tertiary-fixed font-label-sm text-label-sm rounded-full border border-tertiary-fixed/30 cursor-pointer">Todos</span>
<span className="px-sm py-xs hover:bg-surface-variant/30 text-on-surface-variant font-label-sm text-label-sm rounded-full border border-outline/20 cursor-pointer transition-colors">LogÃ­stica</span>
<span className="px-sm py-xs hover:bg-surface-variant/30 text-on-surface-variant font-label-sm text-label-sm rounded-full border border-outline/20 cursor-pointer transition-colors">PolÃ­tica</span>
<span className="px-sm py-xs hover:bg-surface-variant/30 text-on-surface-variant font-label-sm text-label-sm rounded-full border border-outline/20 cursor-pointer transition-colors">Urgente</span>
</div>
</div>
<div className="flex-1 overflow-y-auto scrollbar-hide">

<div className="p-md border-b border-on-surface/5 bg-tertiary-fixed/5 cursor-pointer hover:bg-tertiary-fixed/10 transition-colors relative border-l-4 border-error">
<div className="flex justify-between items-start mb-xs">
<span className="font-label-sm text-label-sm text-error uppercase tracking-widest font-bold">Informe Urgente</span>
<span className="font-label-sm text-label-sm text-outline">Hace 10m</span>
</div>
<h3 className="font-title-md text-title-md text-on-surface mb-xs truncate">Avistamiento: Piratas del "Vendaval Negro"</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">El CapitÃ¡n Erik informa de una nave de dudosa reputaciÃ³n cerca de Gotland...</p>
</div>

<div className="p-md border-b border-on-surface/5 cursor-pointer hover:bg-surface-variant/20 transition-colors">
<div className="flex justify-between items-start mb-xs">
<span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-widest">Alerta de Mercado</span>
<span className="font-label-sm text-label-sm text-outline">Hace 2h</span>
</div>
<h3 className="font-title-md text-title-md text-on-surface mb-xs truncate">Aumento de Precios de la Sal en Riga</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">Fuertes nevadas han cerrado las rutas terrestres, forzando los precios un 40% al alza...</p>
</div>

<div className="p-md border-b border-on-surface/5 cursor-pointer hover:bg-surface-variant/20 transition-colors">
<div className="flex justify-between items-start mb-xs">
<span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-widest">InvitaciÃ³n de la Liga</span>
<span className="font-label-sm text-label-sm text-outline">Ayer</span>
</div>
<h3 className="font-title-md text-title-md text-on-surface mb-xs truncate">Consejo de LÃ¼beck: InvitaciÃ³n Formal</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">El Alto Gremio solicita vuestra presencia para discutir los aranceles comerciales...</p>
</div>

<div className="p-md border-b border-on-surface/5 cursor-pointer hover:bg-surface-variant/20 transition-colors opacity-70">
<div className="flex justify-between items-start mb-xs">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Rumores de Taberna</span>
<span className="font-label-sm text-label-sm text-outline">Hace 2d</span>
</div>
<h3 className="font-title-md text-title-md text-on-surface mb-xs truncate">Susurros de un Nuevo Pasaje</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">Un navegante ebrio afirma conocer una ruta que elude el portazgo del Sund...</p>
</div>
</div>
</aside>

<section className="flex-1 flex flex-col bg-surface-container-low/20 backdrop-blur-sm min-w-0 overflow-hidden">

<div className="p-lg flex justify-between items-start border-b border-on-surface/10">
<div>
<div className="flex items-center gap-sm mb-base">
<span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
<span className="text-error font-bold tracking-widest uppercase font-label-sm text-label-sm">Brecha de Seguridad - AcciÃ³n Inmediata Requerida</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface">Avistamiento Pirata: El "Vendaval Negro" cerca de Gotland</h1>
<p className="mt-xs text-on-surface-variant font-body-md">Enviado por: <span className="text-tertiary-fixed">CapitÃ¡n Erik von Strohm</span> | Flota: <span className="text-primary">Estrella del Norte</span></p>
</div>
<div className="flex gap-sm">
<button className="w-12 h-12 flex items-center justify-center rounded-lg border border-outline/30 hover:border-tertiary-fixed text-on-surface transition-all active:scale-95" aria-label="Archivar mensaje">
<span className="material-symbols-outlined">archive</span>
</button>
<button className="w-12 h-12 flex items-center justify-center rounded-lg border border-outline/30 hover:border-tertiary-fixed text-on-surface transition-all active:scale-95" aria-label="Eliminar mensaje">
<span className="material-symbols-outlined">delete</span>
</button>
</div>
</div>

<div className="flex-1 p-lg overflow-y-auto scrollbar-hide">
<div className="max-w-3xl space-y-lg">

<div className="parchment-text p-md rounded-r-lg">
<p className="font-body-lg text-body-lg text-on-surface italic leading-relaxed">
                                "Mi SeÃ±or Gobernador, avistamos la nave conocida como el 'Vendaval Negro' mientras navegÃ¡bamos los bancos de niebla al norte de Visby. No entablaron combate, mas sus maniobras sugieren que aguardan a las cocas cargadas que se dirigen al Sund. Nuestro ARMAMENTOo basta para disuadirlos, pero las cocas mercantes a nuestra popa son vulnerables."
                            </p>
</div>

<div className="grid grid-cols-2 gap-md">
<div className="p-md rounded-xl bg-surface-container-high/40 border border-on-surface/5">
<span className="text-outline font-label-sm text-label-sm uppercase mb-xs block">Nivel de Inteligencia</span>
<div className="flex items-center gap-sm">
<div className="h-2 flex-1 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-secondary w-3/4"></div>
</div>
<span className="text-secondary font-bold">Alto</span>
</div>
</div>
<div className="p-md rounded-xl bg-surface-container-high/40 border border-on-surface/5">
<span className="text-outline font-label-sm text-label-sm uppercase mb-xs block">Peligro Estimado</span>
<span className="text-error font-bold font-title-md text-title-md">Severo (Grado IV)</span>
</div>
</div>

<div className="relative rounded-xl overflow-hidden h-48 border border-tertiary-fixed/30 group cursor-pointer gold-glow">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={ASSETS.TACTICAL_MAP} alt="Mapa táctico de interceptación"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent flex items-end p-md">
<span className="text-tertiary-fixed font-bold flex items-center gap-xs">
<span className="material-symbols-outlined text-[20px]">location_on</span>
                                    Coordenadas de InterceptaciÃ³n: 57.63N, 18.29E
                                </span>
</div>
</div>
<div className="p-md bg-secondary-container/10 border border-secondary/20 rounded-xl">
<h4 className="text-secondary font-bold mb-xs">Oportunidad EstratÃ©gica</h4>
<p className="text-on-surface-variant font-body-md">Si despachÃ¡is una escolta ahora, obtendrÃ©is <span className="text-secondary">+15 de ReputaciÃ³n</span> con el Gremio de Mercaderes de LÃ¼beck.</p>
</div>
</div>
</div>

<div className="p-lg bg-surface-container-high/50 flex justify-end gap-md">
<button className="px-lg py-sm font-bold border-2 border-on-surface/30 text-on-surface rounded-lg hover:bg-on-surface/10 transition-all active:scale-95">
                        Desestimar Informe
                    </button>
<button className="px-lg py-sm font-bold bg-tertiary-fixed text-on-tertiary-fixed rounded-lg shadow-lg hover:scale-[1.02] transition-all active:scale-95 gold-glow">
                        Despachar Escolta Armada
                    </button>
</div>
</section>
</div>
</main>



    <style>{`
.glass-base {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
        }
        .glass-modal {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .parchment-text {
            background: rgba(228, 228, 204, 0.05);
            border-left: 3px solid #ffe088;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .gold-glow {
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }
    `}</style>
  </>
  )
}
