import { useLocation } from 'wouter'
import { useState } from 'react'
import { ASSETS } from '../utils/proceduralAssets'

const STEPS = [
  { text: '"Bienvenido, reciÃ©n llegado. Para gobernar el BÃ¡ltico, uno debe primero comprender el peso del oro y la velocidad de la vela. Comencemos con vuestras arcas."' },
  { text: '"Tus reservas de oro se muestran en la parte superior. Cada ducado cuenta al negociar con los seÃ±ores mercaderes de Riga y Danzig."' },
  { text: '"El mercado de LÃ¼beck estÃ¡ en su apogeo hoy. Â¿Ves los precios? El grano es barato y la sal es tan preciosa como los rubÃ­es. La compra estratÃ©gica es tu espada."' },
  { text: '"Una vez cargados tus barcos, debes ejecutar el comercio. Este botÃ³n envÃ­a tus Ã³rdenes al capitÃ¡n del puerto. Si vacilas, la ganancia se desvanecerÃ¡ como la niebla."' },
  { text: '"Ahora, id adelante. La Liga HanseÃ¡tica aguarda a su prÃ³ximo gran Estratega. Que los vientos os sean siempre propicios."' },
]

export function MerchantGuideOnboarding() {
  const [, setLocation] = useLocation()
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setVisible(false)
    }
  }

  return (
    <>
    
<div className="fixed inset-0 z-0 bg-cover bg-center opacity-40 grayscale-[0.2]" style={{ backgroundImage: `url('${ASSETS.MAP_BG}')` }}>
</div>

<header className="fixed top-0 left-0 w-full z-10 px-margin py-base flex justify-between items-center bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-md min-w-0">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight truncate">Hanseatic Strategos</span>
<div className="flex items-center gap-sm bg-surface-container-highest px-md py-xs rounded-full border border-tertiary/20" id="gold-counter">
<span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
<span className="font-title-md text-title-md text-tertiary-fixed">12.450,00</span>
</div>
</div>
<div className="flex gap-md">
<button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-colors" aria-label="Centro de mensajes">notifications</button>
<button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-colors" aria-label="Ayuda">help</button>
<button className="material-symbols-outlined text-on-surface-variant hover:text-tertiary-fixed transition-colors" aria-label="Configuración">settings</button>
</div>
</header>

<main className="relative z-0 pt-32 px-margin pb-32 grid grid-cols-12 gap-gutter max-w-[1600px] mx-auto h-screen overflow-hidden">

<section className="col-span-12 md:col-span-8 glass-panel p-md rounded-xl">
<h2 className="font-headline-lg text-headline-lg mb-md text-tertiary-fixed">Mercado de LÃ¼beck</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
<div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
<div className="flex justify-between items-start mb-sm">
<span className="font-title-md text-title-md">Grano</span>
<span className="text-on-secondary-container bg-secondary-container px-sm py-xs rounded text-xs">Precio Bajo</span>
</div>
<p className="text-on-surface-variant text-sm mb-base">Esencial para el crecimiento</p>
<div className="flex justify-between items-end">
<span className="text-xl font-bold">4,20 <span className="text-xs font-normal">/ton</span></span>
<span className="text-secondary flex items-center"><span className="material-symbols-outlined text-sm">arrow_downward</span> 12%</span>
</div>
</div>

<div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
<div className="flex justify-between items-start mb-sm">
<span className="font-title-md text-title-md">Arenque</span>
<span className="text-on-surface-variant bg-surface-variant px-sm py-xs rounded text-xs">Estable</span>
</div>
<p className="text-on-surface-variant text-sm mb-base">Alimento bÃ¡sico del BÃ¡ltico</p>
<div className="flex justify-between items-end">
<span className="text-xl font-bold">8,50 <span className="text-xs font-normal">/ton</span></span>
<span className="text-on-surface-variant flex items-center">--</span>
</div>
</div>
<div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
<div className="flex justify-between items-start mb-sm">
<span className="font-title-md text-title-md">Sal</span>
<span className="text-error bg-error-container px-sm py-xs rounded text-xs">Escasez</span>
</div>
<p className="text-on-surface-variant text-sm mb-base">El Oro Blanco</p>
<div className="flex justify-between items-end">
<span className="text-xl font-bold">42,10 <span className="text-xs font-normal">/ton</span></span>
<span className="text-error flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span> 45%</span>
</div>
</div>
</div>
<div className="mt-lg flex justify-center">
<button onClick={handleNext} className="bg-tertiary text-on-tertiary-fixed font-title-md text-title-md px-xl py-base rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-sm" id="trade-btn-target">
<span className="material-symbols-outlined">trending_up</span>
                    Ejecutar Acuerdo Comercial
                </button>
</div>
</section>

<section className="col-span-12 md:col-span-4 glass-panel p-md rounded-xl flex flex-col">
<h2 className="font-headline-lg text-headline-lg mb-md text-tertiary-fixed">Convoy Activo</h2>
<div className="space-y-sm overflow-y-auto">
<div className="bg-surface-container-low p-sm rounded-lg flex gap-md items-center border border-outline-variant">
<div className="w-16 h-16 bg-primary-container rounded flex items-center justify-center">
<span className="material-symbols-outlined text-3xl text-primary">sailing</span>
</div>
<div>
<p className="font-title-md text-title-md">La Estrella del Norte</p>
<p className="text-sm text-on-surface-variant">LÃ¼beck â†’ Riga</p>
<div className="w-full bg-surface-variant h-1 rounded-full mt-base">
<div className="bg-secondary h-1 rounded-full" style={{ width: "65%" }}></div>
</div>
</div>
</div>
</div>
</section>
</main>

<div className="fixed inset-0 z-[100] bg-surface-dim/80 backdrop-blur-sm transition-opacity duration-500" id="onboarding-overlay">

<div className="absolute w-48 h-12 rounded-full border-4 border-tertiary highlight-ring pointer-events-none hidden" id="ring-gold"></div>
<div className="absolute w-72 h-16 rounded-full border-4 border-tertiary highlight-ring pointer-events-none hidden" id="ring-trade"></div>

<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-margin">
<div className="glass-modal rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl" role="dialog" aria-modal="true" aria-label="Tutorial del mercader">

<div className="md:w-1/3 bg-primary-container/40 relative min-h-[250px] md:min-h-0 border-b md:border-b-0 md:border-r border-on-surface/10 overflow-hidden">
<img className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 contrast-125" src={ASSETS.GOVERNOR} alt="Maestro Mercader"/>
<div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary-container to-transparent h-24"></div>
<div className="absolute bottom-sm left-sm bg-tertiary-fixed text-on-tertiary-fixed font-bold px-sm py-xs rounded text-xs tracking-widest uppercase">Maestro Mercader</div>
</div>

<div className="md:w-2/3 p-lg flex flex-col justify-between">
<div>
<div className="flex justify-between items-center mb-base">
<span className="text-tertiary-fixed font-bold tracking-tight text-xl">Gunnar el Viejo</span>
<span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">Paso {step + 1} de {STEPS.length}</span>
</div>
<div className="text-headline-lg-mobile md:text-title-md font-title-md leading-relaxed text-on-surface transition-opacity duration-300" id="dialogue-text">
                            {STEPS[step].text}
                        </div>
</div>
<div className="mt-lg flex flex-col gap-sm">

<div className="w-full bg-surface-variant/40 h-1.5 rounded-full overflow-hidden mb-base">
<div className="bg-tertiary h-full transition-all duration-700 ease-out" id="progress-bar" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}></div>
</div>
<div className="flex justify-between items-center">
<button onClick={() => setVisible(false)} className="text-on-surface-variant font-label-sm hover:text-on-surface transition-colors" id="skip-btn">Omitir Tutorial</button>
<button onClick={handleNext} className="bg-tertiary text-on-tertiary-fixed font-bold px-lg py-sm rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-xs" id="next-btn">
<span>Continuar</span>
<span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>



    <style>{`
.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .glass-modal {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(228, 228, 204, 0.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        @keyframes pulse-gold {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        .highlight-ring {
            animation: pulse-gold 2s infinite;
        }
    `}</style>
  </>
  )
}
