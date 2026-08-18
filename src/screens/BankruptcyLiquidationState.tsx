import { useLocation } from 'wouter'
import { ASSETS } from '../utils/proceduralAssets'

export function BankruptcyLiquidationState() {
  const [, setLocation] = useLocation()

  return (
    <>
    
<div className="fixed inset-0 z-0">
<img alt="Calle empedrada oscura" className="w-full h-full object-cover grayscale opacity-40 brightness-50" data-alt="Una calle empedrada fría y oscura en ángulo bajo, cinematográfica" src={ASSETS.CITY_BG}/>
<div className="absolute inset-0 rain-overlay"></div>
<div className="absolute inset-0 vignette"></div>
</div>

<main className="relative z-10 flex-grow flex items-center justify-center p-margin">
<div className="max-w-4xl w-full flex flex-col items-center">

<div className="text-center mb-lg space-y-base">
<span className="font-label-sm text-label-sm text-tertiary-fixed tracking-[0.3em] uppercase opacity-70">El Libro Mayor estÃ¡ Cerrado</span>
<h1 className="font-headline-xl text-headline-xl text-on-surface-variant font-black tracking-tighter sm:text-7xl md:text-8xl">
                        LIQUIDACIÃ“N <span className="text-tertiary-fixed">FORZOSA</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant/60 max-w-xl mx-auto italic">
                        "La fortuna es como el vidrio; cuanto mÃ¡s brilla, mÃ¡s fÃ¡cil se quiebra." â€” El Concejo de LÃ¼beck
                    </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-md w-full mb-xl">
<div className="glass-panel p-md rounded-xl border-l-4 border-error text-center">
<div className="text-[10px] font-black text-on-surface-variant uppercase mb-1">Deuda Total</div>
<div className="text-2xl font-black text-error">42.850 G</div>
</div>
<div className="glass-panel p-md rounded-xl border-l-4 border-tertiary-fixed text-center">
<div className="text-[10px] font-black text-on-surface-variant uppercase mb-1">Activos Incautados</div>
<div className="text-2xl font-black text-on-surface">3 Barcos</div>
</div>
<div className="glass-panel p-md rounded-xl border-l-4 border-primary text-center">
<div className="text-[10px] font-black text-on-surface-variant uppercase mb-1">Estado Civil</div>
<div className="text-2xl font-black text-primary">BANCARROTA</div>
</div>
</div>

<div className="flex flex-col sm:flex-row gap-md">
<button onClick={() => setLocation('/')} className="px-xl py-base bg-tertiary text-on-tertiary font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] cursor-pointer border-0">
                        Reiniciar Legado
                    </button>
<button onClick={() => window.history.back()} className="px-xl py-base border-2 border-white/10 text-white/50 font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all cursor-pointer bg-transparent">
                        Cargar Guardado
                    </button>
</div>
</div>
</main>

<style>{`
.rain-overlay {
            background-image: url('${ASSETS.NOISE}');
            opacity: 0.1;
        }
        .vignette {
            background: radial-gradient(circle, transparent 40%, black 150%);
        }
        .glass-panel {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        body {
            background-color: #050505;
        }
    `}</style>
  </>
  )
}
