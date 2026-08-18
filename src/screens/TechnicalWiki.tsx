import { useState } from 'react'
import { useLocation } from 'wouter'

const WIKI_SECTIONS = [
  { id: 'arch', title: 'Arquitectura', icon: 'account_tree', desc: 'Diseño desacoplado Engine-UI y optimización DOD.' },
  { id: 'econ', title: 'Economía', icon: 'trending_up', desc: 'Fórmulas dinámicas de precios, consumo y producción.' },
  { id: 'sim',  title: 'Simulación', icon: 'settings_input_component', desc: 'Tick-rate, calendario y eventos mundiales.' },
  { id: 'pol',  title: 'Política', icon: 'gavel', desc: 'Rangos, reputación y elecciones de Síndico.' },
  { id: 'ai',   title: 'IA', icon: 'psychology', desc: 'Comportamientos de mercaderes y flotas piratas.' }
]

export function TechnicalWiki() {
  const [, setLocation] = useLocation()
  const [activeId, setActiveId] = useState('arch')

  return (
    <main className="w-full h-full bg-[#05070a] flex flex-col font-montserrat select-none overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 text-on-surface">
        <div className="flex items-center gap-4">
          <button onClick={() => setLocation('/')} className="material-symbols-outlined text-tertiary-fixed bg-transparent border-0 cursor-pointer">arrow_back</button>
          <h1 className="font-black text-sm text-tertiary-fixed uppercase tracking-[0.3em]">Manual Técnico Forense</h1>
        </div>
        <div className="bg-tertiary/20 px-3 py-1 rounded border border-tertiary/30">
          <span className="text-[10px] font-black text-tertiary uppercase tracking-widest">Documentación Indestructible v1.0.0</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-white/10 bg-black/20 flex flex-col p-4 gap-2">
          {WIKI_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`p-3 rounded-xl flex items-center gap-3 transition-all border-0 cursor-pointer ${activeId === s.id ? 'bg-tertiary text-black font-black' : 'text-white/40 hover:bg-white/5 hover:text-white/70 bg-transparent'}`}
            >
              <span className="material-symbols-outlined text-xl">{s.icon}</span>
              <span className="text-xs uppercase tracking-wider">{s.title}</span>
            </button>
          ))}
          <div className="mt-auto p-4 glass-panel rounded-xl border border-white/5 bg-white/2 opacity-50">
             <p className="text-[9px] text-white/40 leading-relaxed italic">"Esta documentación reside en el binario del juego, garantizando su acceso sin conexión perpetua."</p>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-gradient-to-br from-black to-slate-900 text-on-surface">
          <div className="max-w-4xl space-y-8 pb-20">
            
            {activeId === 'arch' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Arquitectura de Sistemas</h2>
                <div className="h-1 w-24 bg-tertiary mb-8"></div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-tertiary-fixed font-bold uppercase tracking-widest text-sm">Desacoplamiento Engine-UI</h3>
                  <p className="text-white/60 text-sm leading-relaxed">El simulador opera de forma independiente al ciclo de renderizado de React. Un adaptador de tipos asegura que la interfaz sea puramente una capa de observación y emisión de acciones.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">Optimización DOD</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Uso de TypedArrays (Float64Array) para el procesamiento por lotes de la economía. Reduce la presión del GC y permite simular miles de entidades en microsegundos.</p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">Persistencia Segura</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Serialización JSON binaria-eficiente con firma criptográfica SHA256 para prevenir la manipulación de archivos de guardado.</p>
                  </div>
                </div>
              </div>
            )}

            {activeId === 'econ' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Motor Económico Hanseatic</h2>
                <div className="h-1 w-24 bg-tertiary mb-8"></div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-tertiary-fixed font-bold uppercase tracking-widest text-sm">Fórmula de Precios Dinámicos</h3>
                  <p className="text-white/60 text-sm leading-relaxed">Los precios se ajustan en cada tick diario según la relación stock/demanda. La curva es una interpolación lineal clampada entre pMin y pMax.</p>
                  <div className="bg-black/40 p-4 rounded-xl font-mono text-emerald-400 text-xs border border-white/5">
                    Price = pMax - ((stock - sMin) / (sMax - sMin)) * (pMax - pMin)
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">Matriz de Consumo</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Cálculo por cada 1000 habitantes segmentado en clases: Pobre, Media y Rica. El consumo es parcial si el stock es insuficiente.</p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">Eficiencia de Producción</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Modificadores regionales y estacionales (+20% madera en invierno en el norte). Bono de aglomeración por fábricas adyacentes.</p>
                  </div>
                </div>
              </div>
            )}

            {activeId === 'sim' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Núcleo de Simulación</h2>
                <div className="h-1 w-24 bg-tertiary mb-8"></div>
                <div className="space-y-4">
                  <div className="flex gap-6">
                    <div className="w-1/3 p-4 glass-panel rounded-xl border border-tertiary/20 text-center">
                      <span className="block text-2xl font-black text-tertiary">1.0s</span>
                      <span className="text-[10px] text-white/40 uppercase">Tick Estándar</span>
                    </div>
                    <div className="w-1/3 p-4 glass-panel rounded-xl border border-white/10 text-center">
                      <span className="block text-2xl font-black text-white">30d</span>
                      <span className="text-[10px] text-white/40 uppercase">Ciclo Lunar</span>
                    </div>
                    <div className="w-1/3 p-4 glass-panel rounded-xl border border-white/10 text-center">
                      <span className="block text-2xl font-black text-white">360d</span>
                      <span className="text-[10px] text-white/40 uppercase">Año Fiscal</span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">El SimulationServer gestiona un bucle determinista sincronizado. Los Web Workers procesan la IA en hilos separados para evitar micro-stuttering en la interfaz principal de React.</p>
                </div>
              </div>
            )}

            {activeId === 'pol' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Jerarquía y Poder Político</h2>
                <div className="h-1 w-24 bg-tertiary mb-8"></div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-tertiary-fixed font-bold uppercase tracking-widest text-sm">Escalafón de la Liga</h3>
                  <p className="text-white/60 text-sm leading-relaxed">La progresión se basa en tres ejes: Valor de Activos, Reputación Local y Méritos de la Hansetag. Los rangos superiores otorgan privilegios de construcción y voto.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">Elecciones de Síndico</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Sistema de votación ponderado por la influencia de los concejales. Los sobornos y la caridad en la catedral modulan el apoyo político.</p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">Misiones de Expansión</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Requisito para el rango de Alderman: Fundación de nuevas ciudades, apertura de rutas terrestres y eliminación de focos de piratería.</p>
                  </div>
                </div>
              </div>
            )}

            {activeId === 'ai' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Inteligencia Artificial Autónoma</h2>
                <div className="h-1 w-24 bg-tertiary mb-8"></div>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-tertiary-fixed font-bold uppercase tracking-widest text-sm">Agentes Competitivos</h3>
                  <p className="text-white/60 text-sm leading-relaxed">La IA utiliza una red de agentes que evalúan el mercado buscando brechas de precios para el arbitraje. Poseen sus propias flotas, oficinas y capital limitado (o ilimitado según dificultad).</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">IA Naval y Piratería</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Cálculo de rutas de interceptación basadas en el valor del cargamento. Los piratas operan desde guaridas ocultas con regeneración táctica.</p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 uppercase text-xs">Equilibrio de Longevidad</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed">Sistema de jubilación de flotas piratas y expansión controlada de la IA para evitar la saturación del Mar Báltico en simulaciones de larga duración.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
      <style>{`
        .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(8px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe088; border-radius: 10px; }
      `}</style>
    </main>
  )
}
