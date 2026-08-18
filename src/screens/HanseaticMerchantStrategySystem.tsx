import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function HanseaticMerchantStrategySystem() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()

  const metricsData = useMemo(() => {
    if (!player) return { income: '0', fleet: '0', rep: '0' }
    const history = player.financialHistory || []
    const lastWeek = history[history.length - 1] || { revenue: 0, expenses: 0 }
    return {
      income: `${Math.floor(lastWeek.revenue - lastWeek.expenses).toLocaleString()} G/sem`,
      fleet: `${player.fleet?.length || 0} Barcos`,
      rep: Math.floor(player.reputation).toLocaleString()
    }
  }, [player])

  if (!player) return null

  const gold = Math.floor(player.gold).toLocaleString()

  const PILLARS = [
    {
      title: 'Supremacía Económica', icon: 'payments', color: 'text-secondary', borderColor: 'border-secondary',
      metrics: [{ label: 'Ingresos Netos', val: metricsData.income }, { label: 'Oficinas', val: `${Object.keys(player.tradingOffices || {}).length}` }, { label: 'Cuota', val: '24%' }],
      objectives: [
        { name: 'Expandir a Riga', pct: Object.keys(player.tradingOffices || {}).includes('riga') ? 100 : 0, reward: 'Nuevo Mercado' },
        { name: 'Mejorar Almacenes', pct: 45, reward: '+20% Capacidad' },
      ],
    },
    {
      title: 'Dominio Naval', icon: 'shield', color: 'text-tertiary-fixed', borderColor: 'border-tertiary-fixed',
      metrics: [{ label: 'Potencia Flota', val: metricsData.fleet }, { label: 'Amenaza Pirata', val: 'Moderada' }, { label: 'Convoys', val: '2' }],
      objectives: [
        { name: 'Asegurar el Belt', pct: 30, reward: '-15% Riesgo' },
        { name: 'Tratado con Visby', pct: 0, reward: 'Alianza' },
      ],
    },
    {
      title: 'Influencia Diplomática', icon: 'gavel', color: 'text-primary', borderColor: 'border-primary',
      metrics: [{ label: 'Rango', val: player.rank }, { label: 'Reputación', val: metricsData.rep }, { label: 'Votos', val: '3' }],
      objectives: [
        { name: 'Elegir Edil', pct: 20, reward: 'Poder de Veto' },
        { name: 'Unir Puertos', pct: 5, reward: 'Victoria' },
      ],
    },
  ]

  const TIMELINE_PHASES = [
    { era: 'Inicio', years: '1350–1360', focus: 'Establecer rutas comerciales', done: true },
    { era: 'Expansión', years: '1360–1375', focus: 'Construir flota y almacenes', done: player.fleet.length > 5 },
    { era: 'Dominación', years: '1375–1390', focus: 'Asegurar poder político', active: true },
    { era: 'Legado', years: '1390–1400', focus: 'Alcanzar la hegemonía', future: true },
  ]

  return (
    <main className="bg-background text-on-surface font-body-md h-screen overflow-hidden w-screen font-montserrat">
      <div className="fixed inset-0 z-0 opacity-30">
        <img className="w-full h-full object-cover" alt="Fondo del mapa estratégico" src={ASSETS.MAP_BG} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      </div>

      <header className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
        <div className="flex items-center gap-md">
          <button onClick={() => setLocation('/world-map')} className="material-symbols-outlined text-tertiary-fixed hover:scale-110 transition-transform mr-sm bg-transparent border-0 cursor-pointer" aria-label="Volver al mapa mundial">arrow_back</button>
          <span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</span>
          <nav className="hidden md:flex gap-md ml-xl">
            <button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mapa Mundial</button>
            <button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Libro Mayor</button>
            <button onClick={() => setLocation('/convoy-manager')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Convoy</button>
            <button onClick={() => setLocation('/market')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mercado</button>
          </nav>
        </div>
        <div className="flex items-center gap-sm">
          <div className="glass-panel px-md py-xs rounded-lg text-tertiary-fixed font-bold text-sm">
            {gold} DUC
          </div>
          <span onClick={() => setLocation('/messages')} className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform cursor-pointer" role="button" tabIndex={0} aria-label="Centro de mensajes">notifications</span>
        </div>
      </header>

      <div className="relative z-10 pt-24 pb-8 px-margin h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto pb-20">
          <div className="mb-lg">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed opacity-70">Resumen Estratégico</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mt-xs font-black uppercase">La Gran Estrategia</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-sm italic">Coordina los objetivos económicos, navales y diplomáticos de tu imperio. Cada decisión moldea el futuro del Báltico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className={`glass-panel rounded-xl p-md border-t-4 ${pillar.borderColor} hover:scale-[1.01] transition-transform bg-black/40 backdrop-blur-md`}>
                <div className="flex items-center gap-sm mb-md">
                  <span className={`material-symbols-outlined ${pillar.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{pillar.icon}</span>
                  <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest">{pillar.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm mb-md">
                  {pillar.metrics.map((m) => (
                    <div key={m.label} className="bg-surface-container/40 rounded-lg p-sm text-center border border-white/5">
                      <span className="text-[10px] uppercase font-black text-on-surface-variant block">{m.label}</span>
                      <span className="font-bold text-xs text-tertiary-fixed block mt-xs">{m.val}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-sm">
                  {pillar.objectives.map((obj) => (
                    <div key={obj.name} className="bg-surface-container/20 rounded-lg p-sm border border-white/5">
                      <div className="flex justify-between items-center mb-xs">
                        <span className="text-[10px] font-bold text-on-surface uppercase">{obj.name}</span>
                        <span className="text-[10px] font-black text-tertiary-fixed">{obj.reward}</span>
                      </div>
                      <div className="flex items-center gap-sm">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pillar.color.replace('text-', 'bg-')}`} style={{ width: `${obj.pct}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-on-surface-variant min-w-[32px] text-right">{obj.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
            <div className="md:col-span-7 glass-panel rounded-xl p-md bg-black/40 backdrop-blur-md border border-white/5">
              <h3 className="font-bold text-sm text-tertiary-fixed mb-md flex items-center gap-sm uppercase tracking-widest">
                <span className="material-symbols-outlined">timeline</span> Progreso Estratégico
              </h3>
              <div className="h-64 flex items-end justify-between gap-2 px-sm">
                {[35, 42, 58, 64, 71, 83, 78].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-xs group">
                    <span className="text-[10px] font-black text-tertiary-fixed opacity-0 group-hover:opacity-100 transition-opacity">{h}%</span>
                    <div className="w-full rounded-t-sm transition-all duration-500 cursor-pointer" style={{ height: `${h}%`, background: i === 6 ? 'linear-gradient(to top, #eac349, #ffe088)' : 'linear-gradient(to top, #027910, #77dd6a)' }} />
                    <span className="text-[10px] font-bold text-on-surface-variant">{['1350','1355','1360','1365','1370','1375','1400'][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] uppercase font-black text-on-surface-variant mt-md text-center tracking-widest">Finalización de Objetivos Acumulada — Rumbo a la Hegemonía Hanseática</p>
            </div>

            <div className="md:col-span-5 glass-panel rounded-xl p-md bg-black/40 backdrop-blur-md border border-white/5">
              <h3 className="font-bold text-sm text-tertiary-fixed mb-md flex items-center gap-sm uppercase tracking-widest">
                <span className="material-symbols-outlined">flag</span> Fases de la Campaña
              </h3>
              <div className="space-y-md">
                {TIMELINE_PHASES.map((phase, i) => (
                  <div key={i} className="flex gap-md items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${phase.done ? 'bg-secondary border-secondary' : phase.active ? 'bg-tertiary-fixed border-tertiary-fixed shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'bg-surface-container border-on-surface-variant/30'}`}>
                        {phase.done && <span className="material-symbols-outlined text-[12px] text-on-secondary">check</span>}
                      </div>
                      {i < TIMELINE_PHASES.length - 1 && <div className="w-0.5 h-8 bg-on-surface/10" />}
                    </div>
                    <div className={`flex-1 ${phase.future ? 'opacity-50' : ''}`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-bold text-sm ${phase.active ? 'text-tertiary-fixed' : 'text-on-surface'}`}>{phase.era}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">{phase.years}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">{phase.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .glass-panel {
          background: rgba(0, 31, 63, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(228, 228, 204, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ffe088;
          border-radius: 10px;
        }
      `}</style>
    </main>
  )
}
