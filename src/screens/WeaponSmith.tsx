import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

const WEAPONS_DATA: Record<string, any[]> = {
  Artillería: [
    { id: 'Heavy Bombard', name: 'Bombarda Pesada', desc: 'Artillería de Asedio', price: 2400, icon: 'explosion', type: 'cannon', damage: 85, range: 40, reload: 20 },
    { id: 'Serpentine', name: 'Serpentina', desc: 'Cañón Ligero', price: 1200, icon: 'vaping_rooms', type: 'cannon', damage: 45, range: 60, reload: 80 },
    { id: 'Falconet', name: 'Falconete', desc: 'Artillería Naval', price: 850, icon: 'sailing', type: 'cannon', damage: 30, range: 75, reload: 90 },
  ],
  'Armas Blancas': [
    { id: 'Saber', name: 'Sable de Abordaje', desc: 'Acero de Solingen', price: 150, icon: 'swords', type: 'saber', damage: 60, range: 5, reload: 100 },
  ]
}

export function WeaponSmith() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [selectedCategory, setSelectedCategory] = useState('Artillería')
  const [selectedWeaponId, setSelectedWeaponId] = useState('Falconet')
  const [targetShipIndex, setTargetShipIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  if (!player) return null

  const fleet = player.fleet || []
  const weapons = WEAPONS_DATA[selectedCategory] || WEAPONS_DATA['Artillería']
  
  const currentWeapon = useMemo(() => {
    return weapons.find((w: any) => w.id === selectedWeaponId) || weapons[0]
  }, [selectedWeaponId, weapons])

  const handleBuy = () => {
    if (player.gold < currentWeapon.price) {
      setFeedback({ msg: 'Fondos insuficientes para esta pieza.', type: 'error' })
      return
    }
    const result = engine.buyWeapons(currentWeapon.type, 1, targetShipIndex)
    if (result) {
      setFeedback({ msg: `¡${currentWeapon.name} instalado en el ${fleet[targetShipIndex]?.name || 'navío'}!`, type: 'success' })
    } else {
      setFeedback({ msg: 'Error: El navío no tiene espacio para más armamento.', type: 'error' })
    }
    setTimeout(() => setFeedback(null), 3000)
  }

  const gold = Math.floor(player.gold).toLocaleString()

  return (
    <>
<nav className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl gap-4">
<div className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</div>
<nav className="hidden md:flex space-x-md">
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer" onClick={() => setLocation('/world-map')}>Mapa Mundial</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer" onClick={() => setLocation('/ledger')}>Libro Mayor</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer" onClick={() => setLocation('/convoy-manager')}>Convoy</button>
<button className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 cursor-pointer bg-transparent border-0" onClick={() => setLocation('/market')}>Mercado</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer" onClick={() => setLocation('/town-hall')}>Concejo</button>
</nav>
<div className="flex items-center space-x-sm">
<div className="glass-panel px-md py-xs rounded-lg text-tertiary-fixed font-bold text-sm">
  {gold} DUC
</div>
<button onClick={() => setLocation('/messages')} className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform bg-transparent border-0 cursor-pointer" aria-label="Centro de mensajes">notifications</button>
</div>
</nav>

<div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
<img alt="Fragua" className="w-full h-full object-cover" src={ASSETS.FORGE_BG}/>
</div>

<main className="relative z-10 pt-32 pb-24 px-margin h-screen flex flex-col lg:flex-row gap-gutter overflow-hidden">

<aside className="w-full lg:w-1/5 flex flex-col gap-base">
<h2 className="font-headline-lg text-headline-lg text-tertiary-fixed mb-sm font-black uppercase tracking-tighter">Armero Real</h2>
<div className="flex flex-col gap-sm">
{Object.keys(WEAPONS_DATA).map(cat => (
  <button 
    key={cat}
    className={`glass-panel text-left px-md py-sm rounded-xl border-l-4 flex items-center gap-sm group transition-all duration-200 cursor-pointer bg-transparent ${selectedCategory === cat ? 'border-l-tertiary-fixed bg-white/5 text-tertiary-fixed' : 'border-l-transparent text-on-surface-variant hover:bg-white/5'}`} 
    onClick={() => setSelectedCategory(cat)}
  >
    <span className="material-symbols-outlined">{cat === 'Artillería' ? 'bomb' : cat === 'Armas Blancas' ? 'swords' : 'shield'}</span>
    <span className="font-bold text-sm uppercase">{cat}</span>
  </button>
))}
</div>

<div className="mt-auto glass-panel p-md rounded-xl bg-black/40 backdrop-blur-md border border-white/5">
<div className="flex items-center justify-between mb-xs">
<span className="text-[10px] uppercase font-black text-on-surface-variant tracking-widest">Destino</span>
</div>
<select
  value={targetShipIndex}
  onChange={e => setTargetShipIndex(Number(e.target.value))}
  className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-tertiary"
  aria-label="Seleccionar navío destino"
>
  {fleet.map((s: any, i: number) => (
    <option key={i} value={i}>{s.name} ({s.weaponSlots || 0} slots)</option>
  ))}
  {fleet.length === 0 && <option value={0}>Sin barcos disponibles</option>}
</select>
</div>
</aside>

<section className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col bg-black/20">
<div className="p-md border-b border-on-surface/10 bg-surface-container/30 flex justify-between items-center">
<span className="font-bold text-sm text-on-surface uppercase tracking-widest">Colección de {selectedCategory}</span>
</div>
<div className="p-md grid grid-cols-2 lg:grid-cols-3 gap-md overflow-y-auto custom-scrollbar">
{weapons.map(w => (
  <div 
    key={w.id}
    onClick={() => setSelectedWeaponId(w.id)}
    className={`glass-panel p-md rounded-xl flex flex-col items-center gap-sm cursor-pointer border-2 transition-all group ${selectedWeaponId === w.id ? 'border-tertiary bg-amber-500/5' : 'border-transparent hover:border-white/20 hover:bg-white/5'}`} 
  >
    <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-base transition-transform group-hover:scale-110 ${selectedWeaponId === w.id ? 'bg-tertiary text-on-tertiary' : 'bg-primary-container/40 text-tertiary-fixed'}`}>
      <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{w.icon}</span>
    </div>
    <h3 className="font-bold text-sm text-on-surface text-center uppercase">{w.name}</h3>
    <div className="mt-base flex items-center text-tertiary-fixed font-black font-mono">
      <span className="material-symbols-outlined text-xs mr-1">payments</span> {w.price}
    </div>
  </div>
))}
</div>
</section>

<aside className="w-full lg:w-1/4 glass-panel-heavy rounded-xl p-md flex flex-col gap-md shadow-2xl bg-black/60 overflow-y-auto">
{feedback && (
  <div className={`p-sm rounded-lg text-center font-bold text-xs animate-pulse ${feedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
    {feedback.msg}
  </div>
)}
<div className="relative w-full aspect-square glass-panel rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
<img alt="Arma" className="w-full h-full object-cover" src={currentWeapon.img || ASSETS.WEAPON}/>
<div className="absolute top-sm right-sm px-base py-xs bg-tertiary-container text-on-tertiary-container rounded-full font-bold text-[10px]">STOCK: 8</div>
</div>
<div className="flex flex-col gap-xs text-center">
<h2 className="font-black text-xl text-tertiary-fixed uppercase">{currentWeapon.name}</h2>
<p className="text-on-surface-variant text-xs italic">"{currentWeapon.desc}"</p>
</div>
<div className="flex flex-col gap-sm mt-base">
<h4 className="font-black text-[10px] text-white/40 uppercase tracking-[0.2em]">Especificaciones Tácticas</h4>

{[
  { label: 'Daño', val: currentWeapon.damage, color: 'bg-red-500' },
  { label: 'Alcance', val: currentWeapon.range, color: 'bg-blue-500' },
  { label: 'Velocidad', val: currentWeapon.reload, color: 'bg-emerald-500' },
].map(s => (
  <div key={s.label} className="flex flex-col gap-xs">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase">{s.label}</span>
      <span className="text-[10px] font-mono font-black text-white">{s.val} / 100</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.val}%` }}></div>
    </div>
  </div>
))}
</div>
<div className="mt-auto flex flex-col gap-sm">
<button 
  onClick={handleBuy}
  disabled={fleet.length === 0}
  className="w-full bg-tertiary text-on-tertiary py-md rounded-xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase text-sm tracking-widest border-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
>
    INSTALAR ARMAMENTO
</button>
</div>
</aside>
</main>

<style>{`
  .glass-panel {
    background: rgba(0, 31, 63, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(228, 228, 204, 0.05);
  }
  .glass-panel-heavy {
    background: rgba(0, 31, 63, 0.8);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(212, 175, 55, 0.2);
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ffe088;
    border-radius: 10px;
  }
`}</style>
    </>
  )
}
