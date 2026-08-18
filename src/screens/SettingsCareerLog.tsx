import { useLocation } from 'wouter'
import { useState, useMemo } from 'react'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

const SETTINGS_CATEGORIES = ['Video', 'Audio', 'Controles', 'Redes']
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL']

export function SettingsCareerLog() {
  const [, setLocation] = useLocation()
  const { state: worldState } = useGame()
  const player = usePlayer()
  const [activeTab, setActiveTab] = useState<'career' | 'settings'>('career')
  const [uiScale, setUiScale] = useState(115)
  const [masterVol, setMasterVol] = useState(85)
  const [ambientVol, setAmbientVol] = useState(60)
  const [selCategory, setSelCategory] = useState('Video')
  const [msg, setMsg] = useState('')

  const handleApply = () => {
    setMsg('✓ Proclamaciones aplicadas y guardadas con éxito.')
    setTimeout(() => setMsg(''), 4000)
  }

  const history = player?.financialHistory || []
  
  // Dynamic wealth accumulation graph data
  const wealthData = useMemo(() => {
    if (history.length === 0) return Array(7).fill(0)
    return history.slice(-7).map((h: any) => h.gold)
  }, [history])

  const maxWealth = Math.max(...wealthData, 10000)
  const currentWealth = player?.gold || 0

  if (!player) return null

  const ACHIEVEMENTS = [
    { year: `Anno ${worldState?.simulation?.date?.year || 1300}`, title: 'Reconocimiento de la Hansetag', desc: `Elegido oficialmente como ${player.rank} del distrito de ${player.homeCityId?.toUpperCase()}.`, icon: 'verified', color: 'bg-tertiary-fixed/20 border-tertiary-fixed text-tertiary-fixed' },
    { year: 'Anno 1356', title: 'Príncipe Mercader del Norte', desc: `Operó con éxito ${player.fleet.length} buques mercantes independientes en toda la Hansa.`, icon: 'sailing', color: 'bg-secondary/20 border-secondary text-secondary' },
    { year: 'Anno 1350', title: 'Hito de Capital', desc: `Acumuló un capital total de ${currentWealth.toLocaleString()} DUC mediante el comercio estratégico.`, icon: 'payments', color: 'bg-on-surface-variant/20 border-on-surface-variant/50 text-on-surface-variant' },
  ]

  return (
    <>
    
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-md">
<h1 className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</h1>
<nav className="hidden md:flex gap-md ml-xl">
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 cursor-pointer" onClick={() => setLocation('/world-map')}>Mapa Mundial</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 cursor-pointer" onClick={() => setLocation('/ledger')}>Libro Mayor</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 cursor-pointer" onClick={() => setLocation('/convoy-manager')}>Convoy</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 cursor-pointer" onClick={() => setLocation('/market')}>Mercado</button>
<button className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 cursor-pointer" onClick={() => setLocation('/city-overview')}>Ciudad</button>
</nav>
</div>
<div className="flex items-center gap-md">
{msg && (
  <div className="px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-pulse">
    {msg}
  </div>
)}
<button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed scale-105 active:scale-95 transition-all" aria-label="Centro de mensajes">notifications</button>
<button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed scale-105 active:scale-95 transition-all" aria-label="Ayuda">help</button>
<button className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-all" aria-label="Configuración">settings</button>
<div className="w-10 h-10 rounded-full border-2 border-tertiary-fixed/30 overflow-hidden">
<img alt="Retrato" src={ASSETS.GOVERNOR}/>
</div>
</div>
</header>

<main className="mt-[80px] mb-[80px] flex-grow px-margin py-md relative overflow-hidden overflow-x-hidden">

<div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[120px]"></div>
<div className="max-w-7xl mx-auto h-full flex flex-col gap-md min-w-0">

<div className="flex justify-between items-end">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed opacity-70">Centro Administrativo</span>
<h2 className="font-headline-xl text-headline-xl text-on-surface">Cámaras Estatales</h2>
</div>

<div className="flex bg-surface-variant/40 p-1 rounded-xl glass-panel" role="tablist">
<button
  className={`px-md py-sm rounded-lg font-title-md text-title-md tab-transition ${activeTab === 'career' ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
  onClick={() => setActiveTab('career')}
  role="tab"
  aria-selected={activeTab === 'career'}
>Historial</button>
<button
  className={`px-md py-sm rounded-lg font-title-md text-title-md tab-transition ${activeTab === 'settings' ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
  onClick={() => setActiveTab('settings')}
  role="tab"
  aria-selected={activeTab === 'settings'}
>Ajustes Globales</button>
</div>
</div>

<div className="flex-grow items-stretch">

{activeTab === 'career' && (
<div className="grid grid-cols-12 gap-md h-full" role="tabpanel">

<div className="col-span-12 lg:col-span-4 flex flex-col gap-md">
<div className="glass-panel-active rounded-xl p-md flex flex-col items-center text-center">
<div className="w-32 h-32 rounded-full border-4 border-tertiary-fixed p-1 mb-md relative">
<img alt="Retrato del Gobernador" className="w-full h-full rounded-full object-cover" src={ASSETS.GOVERNOR}/>
<div className="absolute -bottom-2 -right-2 bg-tertiary-fixed text-on-tertiary-fixed p-2 rounded-lg shadow-xl">
<span className="material-symbols-outlined text-[32px]">military_tech</span>
</div>
</div>
<h3 className="font-headline-lg text-headline-lg text-tertiary-fixed">{player.rank}</h3>
<p className="font-body-md text-body-md text-on-surface-variant max-w-[200px]">{player.name} de {player.homeCityId?.toUpperCase()}</p>
<div className="mt-xl w-full flex flex-col gap-sm">
<div className="flex justify-between font-label-sm text-label-sm">
<span>Progreso de Prestigio</span>
<span className="text-tertiary-fixed">{Math.floor(player.reputation * 100)} / 10,000</span>
</div>
<div className="w-full h-2 bg-primary-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary-fixed shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all" style={{ width: `${Math.min(player.reputation, 100)}%` }}></div>
</div>
</div>
</div>
<div className="glass-panel rounded-xl p-md flex flex-col gap-sm">
<h4 className="font-title-md text-title-md text-on-surface border-b border-on-surface/10 pb-xs mb-xs">Posición en el Gremio</h4>
<div className="flex items-center justify-between">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary">anchor</span>
<span className="font-body-md text-body-md">Influencia Comercial</span>
</div>
<span className="font-headline-lg text-headline-lg-mobile text-secondary">A+</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary">shield</span>
<span className="font-body-md text-body-md">Poder Militar</span>
</div>
<span className="font-headline-lg text-headline-lg-mobile text-tertiary-fixed">B</span>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-8 flex flex-col gap-md">

<div className="glass-panel rounded-xl p-md flex-grow-0 min-h-[300px] flex flex-col">
<div className="flex justify-between items-start mb-md">
<h4 className="font-title-md text-title-md text-on-surface">Acumulación Total de Riqueza</h4>
<div className="text-right">
<span className="font-headline-lg text-headline-lg text-secondary">{Math.floor(currentWealth).toLocaleString()} <span className="text-label-sm font-label-sm text-on-surface-variant">DUC</span></span>
<p className="text-secondary-fixed text-label-sm">+12% respecto al trimestre anterior</p>
</div>
</div>
<div className="flex-grow flex items-end gap-2 px-sm">
{wealthData.map((val: any, i: number) => (
  <div 
    key={i} 
    className={`flex-1 ${i === wealthData.length - 1 ? 'bg-tertiary-fixed shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse' : 'bg-secondary-container/40'} rounded-t-sm hover:bg-secondary-container transition-all`} 
    style={{ height: `${(val / maxWealth) * 100}%` }}
    title={`${MONTHS[i]}: ${val.toLocaleString()} DUC`}
  ></div>
))}
</div>
<div className="flex justify-between pt-sm font-label-sm text-label-sm text-on-surface-variant">
{MONTHS.map(m => <span key={m}>{m}</span>)}
</div>
</div>

<div className="glass-panel rounded-xl p-md flex-grow overflow-hidden flex flex-col">
<h4 className="font-title-md text-title-md text-on-surface mb-md">Hitos de la Carrera</h4>
<div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-base">
{ACHIEVEMENTS.map((a, i) => (
  <div key={i} className="flex gap-md items-start p-sm hover:bg-surface-variant/20 rounded-lg transition-colors group">
    <div className="flex flex-col items-center">
      <div className={`w-8 h-8 rounded-full ${a.color} border flex items-center justify-center`}>
        <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
      </div>
      {i < ACHIEVEMENTS.length - 1 && <div className="w-0.5 h-16 bg-on-surface/10 mt-xs"></div>}
    </div>
    <div>
      <span className="font-label-sm text-label-sm text-on-surface-variant">{a.year}</span>
      <p className="font-title-md text-title-md text-on-surface group-hover:text-tertiary-fixed transition-colors">{a.title}</p>
      <p className="font-body-md text-body-md text-on-surface-variant">{a.desc}</p>
    </div>
  </div>
))}
</div>
</div>
</div>
</div>
)}

{activeTab === 'settings' && (
<div className="grid grid-cols-12 gap-md h-full" role="tabpanel">

<div className="col-span-12 lg:col-span-3 glass-panel rounded-xl p-sm flex flex-col gap-xs">
{SETTINGS_CATEGORIES.map(c => (
  <button 
    key={c}
    className={`flex items-center gap-sm p-sm rounded-lg font-title-md text-title-md w-full transition-all ${selCategory === c ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'hover:bg-surface-variant/30 text-on-surface-variant'}`}
    onClick={() => setSelCategory(c)}
  >
    <span className="material-symbols-outlined">
      {c === 'Video' ? 'display_settings' : c === 'Audio' ? 'volume_up' : c === 'Controles' ? 'gamepad' : 'public'}
    </span> 
    {c}
  </button>
))}
<div className="mt-auto p-sm">
<div className="p-md bg-primary-container/40 rounded-lg border border-primary-fixed/10">
<p className="text-label-sm font-label-sm text-on-primary-container">Núcleo Estratégico v1.4.2</p>
<p className="text-[10px] text-on-surface-variant mt-xs">Todos los sistemas operativos. Sincronización de datos marítimos activa.</p>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-9 glass-panel-active rounded-xl p-xl flex flex-col gap-xl overflow-y-auto custom-scrollbar">

{selCategory === 'Video' && (
<section className="flex flex-col gap-md">
<h3 className="font-headline-lg text-headline-lg text-on-surface border-b border-on-surface/10 pb-sm">Configuración de Video</h3>

<div className="flex items-center justify-between">
<div>
<p className="font-title-md text-title-md text-on-surface">Resolución de Pantalla</p>
<p className="font-body-md text-body-md text-on-surface-variant">Recomendado para tu pantalla oceánica</p>
</div>
<div className="flex gap-sm">
<button className="px-md py-xs rounded-lg border border-tertiary-fixed text-tertiary-fixed hover:bg-tertiary-fixed/10 transition-all cursor-pointer">4K Ultra</button>
<button className="px-md py-xs rounded-lg bg-tertiary-fixed text-on-tertiary-fixed shadow-lg scale-105 cursor-pointer">8K Cinematográfica</button>
</div>
</div>

<div className="flex flex-col gap-sm">
<div className="flex justify-between">
<p className="font-title-md text-title-md text-on-surface">Escala de IU</p>
<span className="text-tertiary-fixed font-title-md">{uiScale}%</span>
</div>
<input
  className="w-full h-2 bg-primary-container rounded-lg appearance-none cursor-pointer accent-tertiary-fixed"
  max="200" min="75" type="range" value={uiScale} onChange={e => setUiScale(parseInt(e.target.value))}
  aria-label="Escala de interfaz"
/>
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span>Enfoque (75%)</span>
<span>Estándar</span>
<span>Expandido (200%)</span>
</div>
</div>
</section>
)}

{selCategory === 'Audio' && (
<section className="flex flex-col gap-md">
<h3 className="font-headline-lg text-headline-lg text-on-surface border-b border-on-surface/10 pb-sm">Audio y Ambiente</h3>
<div className="flex flex-col gap-lg">
<div className="flex items-center gap-xl">
<span className="material-symbols-outlined text-tertiary w-8">music_note</span>
<div className="flex-grow flex flex-col gap-xs">
<div className="flex justify-between text-label-sm font-label-sm">
<span>Orquesta Principal</span>
<span>{masterVol}%</span>
</div>
<div className="h-1.5 w-full bg-primary-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary-fixed transition-all" style={{ width: `${masterVol}%` }}></div>
</div>
<input type="range" min="0" max="100" value={masterVol} onChange={e => setMasterVol(parseInt(e.target.value))} className="w-full opacity-0 -mt-2 cursor-pointer" aria-label="Volumen orquesta principal" />
</div>
</div>
<div className="flex items-center gap-xl">
<span className="material-symbols-outlined text-tertiary w-8">waves</span>
<div className="flex-grow flex flex-col gap-xs">
<div className="flex justify-between text-label-sm font-label-sm">
<span>Ambiente Costero</span>
<span>{ambientVol}%</span>
</div>
<div className="h-1.5 w-full bg-primary-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary-fixed transition-all" style={{ width: `${ambientVol}%` }}></div>
</div>
<input type="range" min="0" max="100" value={ambientVol} onChange={e => setAmbientVol(parseInt(e.target.value))} className="w-full opacity-0 -mt-2 cursor-pointer" aria-label="Volumen ambiente costero" />
</div>
</div>
</div>
</section>
)}

<div className="flex justify-end gap-md pt-xl border-t border-on-surface/10 mt-auto">
<button className="px-xl py-md rounded-lg font-bold border-2 border-on-surface-variant text-on-surface-variant hover:bg-on-surface-variant/10 transition-all cursor-pointer">Restablecer Valores</button>
<button 
  className="px-xl py-md rounded-lg font-bold bg-tertiary text-on-tertiary shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-0"
  onClick={handleApply}
>Aplicar Proclamaciones</button>
</div>
</div>
</div>
)}
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
        .glass-panel-active {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        body {
            font-family: var(--font-main), sans-serif;
            background-color: #131407;
            color: #e4e4cc;
            overflow-x: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 31, 63, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ffe088;
            border-radius: 10px;
        }
        .tab-transition {
            transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
    `}</style>
  </>
  )
}
