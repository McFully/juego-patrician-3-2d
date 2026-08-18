import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

export function CombatArena() {
  const { engine, state: worldState } = useGame()
  const [, setLocation] = useLocation()
  const player = usePlayer()

  const [result, setResult] = useState<{ action: string; success: boolean; message: string } | null>(null)

  if (!player) return null

  const handleAction = (action: 'fight' | 'flee' | 'surrender') => {
    const res = engine.resolveEncounter(action)
    setResult(res)
    // If encounter resolved, redirect after delay
    if (res) {
      setTimeout(() => setLocation('/world-map'), 3000)
    }
  }

  const encounter = worldState?.simulation?.activeEncounter
  const playerShip = encounter?.ship || player.fleet?.[0]
  const enemyFleet = encounter?.enemyFleet
  const enemyShip = enemyFleet?.ships?.[0] || { hp: 80, hpMax: 100, name: 'Revenge' }

  const playerHp = playerShip ? (playerShip.hp / (playerShip.hpMax || 1)) * 100 : 100
  const enemyHp = enemyShip ? (enemyShip.hp / (enemyShip.hpMax || 1)) * 100 : 80

  return (
    <>
    
<nav className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-md min-w-0">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer truncate" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
<div className="hidden md:flex gap-md ml-xl">
<button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mapa Mundial</button>
<button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Libro Mayor</button>
<button className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer">Combate Naval</button>
</div>
</div>
<div className="flex items-center gap-md">
<div className="glass-panel px-md py-xs rounded-lg text-tertiary-fixed font-bold text-sm">
  {Math.floor(player.gold).toLocaleString()} DUC
</div>
</div>
</nav>

<main className="relative w-full h-screen ocean-waves flex items-center justify-center">
<div className="wave-vector"></div>
<div className="wave-vector" style={{ animationDelay: "-5s", opacity: "0.3" }}></div>

{/* Resolution Toast */}
{result && (
  <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 animate-in fade-in slide-in-from-top-4 ${result.success ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
    <h2 className="text-xl font-black uppercase tracking-widest">{result.success ? '¡Victoria!' : 'Derrota'}</h2>
    <p className="font-medium">{result.message}</p>
  </div>
)}

<div className="fixed top-xl right-margin mt-md z-40 hidden md:block">
<div className="glass-panel p-md rounded-xl flex flex-col items-center gap-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Dirección del Viento</span>
<div className="relative w-16 h-16 flex items-center justify-center">
<span className="material-symbols-outlined text-[48px] text-tertiary-fixed transform rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>navigation</span>
</div>
<span className="font-label-sm text-label-sm text-tertiary-fixed font-mono uppercase">14 NUDOS NE</span>
</div>
</div>

<div className="relative w-full h-full max-w-7xl mx-auto pointer-events-none">

{/* Player Ship */}
<div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-auto group transition-all">
<div className="tactical-ring w-48 h-48 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
<div className="relative">
<div className="w-24 h-24 glass-panel-heavy rounded-full flex items-center justify-center border-2 border-tertiary-fixed scale-105 transition-transform hover:scale-110">
<span className="material-symbols-outlined text-[48px] text-tertiary-fixed" data-icon="sailing" style={{ fontVariationSettings: "'FILL' 1" }}>sailing</span>
</div>

<div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 flex flex-col gap-xs">
<div className="h-2 w-full bg-primary-container rounded-full overflow-hidden border border-white/10">
<div className="h-full bg-secondary transition-all duration-500" style={{ width: `${playerHp}%` }}></div>
</div>
<span className="text-center font-label-sm text-label-sm text-white drop-shadow-md uppercase tracking-tighter">{playerShip?.name || 'Navío'} ({Math.round(playerHp)}%)</span>
</div>
</div>
</div>

{/* Enemy Ship */}
<div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
<div className="w-40 h-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-error/30 rounded-full animate-pulse"></div>
<div className="relative">
<div className="w-20 h-20 bg-error-container/40 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-error/60 shadow-[0_0_30px_rgba(255,0,0,0.3)]">
<span className="material-symbols-outlined text-[40px] text-error" data-icon="sailing">sailing</span>
</div>
<div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-28 flex flex-col gap-xs">
<div className="h-2 w-full bg-primary-container rounded-full overflow-hidden border border-white/10">
<div className="h-full bg-error transition-all duration-500" style={{ width: `${enemyHp}%` }}></div>
</div>
<span className="text-center font-label-sm text-label-sm text-white drop-shadow-md uppercase tracking-tighter">{enemyShip.name} ({Math.round(enemyHp)}%)</span>
</div>
</div>
</div>
</div>

<div className="fixed left-0 bottom-margin z-40 w-full max-w-lg px-margin flex gap-md">
<div className="glass-panel-heavy p-md rounded-xl flex-1 flex flex-col gap-sm border border-white/10 shadow-2xl">
<h3 className="font-label-sm text-label-sm text-tertiary-fixed uppercase font-black tracking-widest mb-xs">Ordenes de Combate</h3>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
  <button 
    onClick={() => handleAction('fight')}
    className="flex flex-col items-center gap-1 p-md rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 transition-all group active:scale-95"
  >
    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">bolt</span>
    <span className="font-bold text-[10px] uppercase">Atacar</span>
  </button>
  <button 
    onClick={() => handleAction('flee')}
    className="flex flex-col items-center gap-1 p-md rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition-all group active:scale-95"
  >
    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">directions_run</span>
    <span className="font-bold text-[10px] uppercase">Huir</span>
  </button>
  <button 
    onClick={() => handleAction('surrender')}
    className="flex flex-col items-center gap-1 p-md rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all group active:scale-95"
  >
    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">flag</span>
    <span className="font-bold text-[10px] uppercase">Rendirse</span>
  </button>
</div>
</div>
</div>
</main>

    <style>{`
.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
        }
        .glass-panel {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(212, 175, 55, 0.1);
        }
        .glass-panel-heavy {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .ocean-waves {
            background: radial-gradient(circle at 50% 50%, #001f3f 0%, #131407 100%);
            position: relative;
            overflow: hidden;
        }
        .wave-vector {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Cpath d='M0 400 Q 200 300 400 400 T 800 400' fill='none' stroke='rgba(175, 200, 240, 0.05)' stroke-width='2'/%3E%3C/svg%3E");
            animation: drift 20s linear infinite;
            pointer-events: none;
        }
        @keyframes drift {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .tactical-ring {
            border: 2px dashed rgba(212, 175, 55, 0.4);
            border-radius: 50%;
            animation: pulse-ring 4s ease-in-out infinite;
        }
        @keyframes pulse-ring {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.05); opacity: 0.6; }
        }
    `}</style>
  </>
  )
}
