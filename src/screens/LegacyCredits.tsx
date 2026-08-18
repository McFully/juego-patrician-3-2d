import { useLocation } from 'wouter'
import { ASSETS } from '../utils/proceduralAssets'

export function LegacyCredits() {
  const [, setLocation] = useLocation()

  return (
    <main className="w-full h-full bg-[#05070a] flex flex-col font-montserrat select-none overflow-hidden text-on-surface">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img alt="Fondo de Mapa" className="w-full h-full object-cover grayscale" src={ASSETS.MAP_VELLUM}/>
      </div>

      <header className="flex-none h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setLocation('/')} className="material-symbols-outlined text-tertiary-fixed bg-transparent border-0 cursor-pointer">arrow_back</button>
          <h1 className="font-black text-sm text-tertiary-fixed uppercase tracking-[0.3em]">Herencia y Créditos</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-12 z-10 relative overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl w-full text-center space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Hanseatic Strategos</h2>
            <p className="text-tertiary-fixed font-bold tracking-[0.4em] text-sm uppercase">Reconstrucción Soberana v1.0.0</p>
          </section>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-tertiary to-transparent mx-auto"></div>

          <section className="space-y-6">
            <div>
              <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Director y Desarrollador</h3>
              <p className="text-3xl font-black text-white tracking-tight">Aritz Bahamonde Larxé</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/2">
                <h4 className="text-tertiary-fixed text-xs font-black uppercase mb-4 tracking-widest">Stack Tecnológico</h4>
                <ul className="text-white/60 text-xs space-y-2 font-mono">
                  <li>DODEngine (O(1) Core)</li>
                  <li>React 18 + Vite</li>
                  <li>TypeScript Strict</li>
                  <li>Tailwind CSS</li>
                  <li>Zustand State</li>
                </ul>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/2">
                <h4 className="text-tertiary-fixed text-xs font-black uppercase mb-4 tracking-widest">Filosofía AntiGravity</h4>
                <p className="text-white/40 text-[10px] leading-relaxed text-left">
                  Este software ha sido diseñado bajo los principios de soberanía absoluta, 
                  eliminando toda dependencia de la nube y garantizando su funcionamiento 
                  perpetuo en aislamiento total.
                </p>
              </div>
            </div>
          </section>

          <footer className="pt-12 text-[9px] text-white/20 uppercase tracking-[0.2em] space-y-2">
            <p>© 2026 Aritz Bahamonde Larxé. Todos los derechos reservados.</p>
            <p className="italic">"Construido para durar, diseñado para conquistar."</p>
          </footer>
        </div>
      </div>

      <style>{`
        .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(8px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffe088; border-radius: 10px; }
      `}</style>
    </main>
  )
}
