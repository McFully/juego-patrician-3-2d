import { useLocation } from 'wouter'
import { ASSETS } from '../utils/proceduralAssets'

export function OfficialLandingPage() {
  const [, setLocation] = useLocation()
  return (
    <div className="w-full h-full bg-slate-950 text-on-surface font-montserrat select-none overflow-y-auto">
      
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight cursor-pointer" onClick={() => setLocation('/')}>Hanseatic Strategos</div>
        <nav className="hidden md:flex gap-md">
          {['Comercio', 'Construcción', 'Conquista', 'Historia'].map(item => (
            <button key={item} className="text-white/60 hover:text-tertiary-fixed transition-colors text-[10px] font-black uppercase tracking-widest bg-transparent border-0 cursor-pointer">{item}</button>
          ))}
        </nav>
        <button 
          onClick={() => setLocation('/')}
          className="bg-tertiary-fixed text-on-tertiary-fixed px-md py-xs rounded-lg font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all border-0 cursor-pointer"
        >
          Iniciar Simulación
        </button>
      </header>

      <section className="relative h-screen flex items-center pt-xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover scale-110 animate-[pulse-slow_20s_infinite_alternate]" src={ASSETS.CITY_BG} alt="Vista de la ciudad hanseática"/>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
        <div className="relative z-10 px-margin max-w-4xl">
          <h1 className="font-black text-3xl md:text-6xl text-white mb-sm uppercase tracking-tighter leading-none shadow-glow">Domina el Imperio del Báltico</h1>
          <p className="text-body-lg text-on-surface-variant mb-xl max-w-2xl font-medium italic leading-relaxed pr-0 md:pr-8">
            La Liga Hanseática aguarda a su estratega más astuto. Erige tu dinastía comercial mediante la precisión económica, el ingenio diplomático y la supremacía naval.
          </p>
          <div className="flex flex-col sm:flex-row gap-md">
            <button onClick={() => setLocation('/')} className="bg-tertiary text-on-tertiary px-xl py-base rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest border-0 cursor-pointer">
              Jugar Ahora
            </button>
            <button className="border-2 border-white/20 text-white px-xl py-base rounded-2xl font-black text-xl hover:bg-white/5 transition-all backdrop-blur-md uppercase tracking-widest bg-transparent cursor-pointer">
              Ver Demostración
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-margin bg-slate-950 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[
            { icon: 'payments', title: 'Comercio', desc: 'Domina una compleja economía de oferta y demanda en 40 puertos medievales auténticos.' },
            { icon: 'architecture', title: 'Construcción', desc: 'Transforma pequeños puestos de avanzada en prósperas urbes hanseáticas.' },
            { icon: 'shield', title: 'Conquista', desc: 'Protege tus convoyes de los piratas o desata tu flota sobre las rutas comerciales rivales.' },
          ].map(f => (
            <div key={f.title} className="glass-panel p-lg rounded-3xl flex flex-col items-center text-center group hover:border-tertiary-fixed/40 transition-all duration-500 bg-black/40 backdrop-blur-md border border-white/10">
              <div className="mb-md p-md bg-tertiary-fixed/10 rounded-full group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary-fixed !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
              </div>
              <h3 className="font-black text-2xl text-on-surface mb-sm uppercase tracking-tight">{f.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-medium px-4">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-black py-xl px-margin text-center border-t border-white/5">
        <div className="font-black text-3xl text-tertiary-fixed mb-md uppercase tracking-tighter shadow-glow">Hanseatic Strategos</div>
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-md">© 2026 Aritz Bahamonde Larxé. Todos los derechos reservados.</p>
      </footer>

      <style>{`
        .glass-panel { background: rgba(0, 31, 63, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(228, 228, 204, 0.05); }
        .shadow-glow { text-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
        @keyframes pulse-slow { from { transform: scale(1); } to { transform: scale(1.1); } }
      `}</style>
    </div>
  )
}
