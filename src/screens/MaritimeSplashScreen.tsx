import { useState, useEffect } from 'react'
import { ASSETS } from '../utils/proceduralAssets'

export function MaritimeSplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Inicializando Hansa...')

  useEffect(() => {
    const steps = [
      { p: 10, s: 'Cargando Núcleo DODEngine...' },
      { p: 30, s: 'Generando Mercados Bálticos...' },
      { p: 60, s: 'Desplegando Flotas de la IA...' },
      { p: 85, s: 'Sincronizando Persistencia SHA256...' },
      { p: 100, s: 'Listo para Gobernar.' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p)
        setStatus(steps[currentStep].s)
        currentStep++
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 800)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="w-screen h-screen bg-[#05070a] flex items-center justify-center font-montserrat text-on-surface overflow-hidden">
      <div className="absolute inset-0 opacity-10">
         <img src={ASSETS.MAP_VELLUM} className="w-full h-full object-cover" alt="Mapa de Bienvenida"/>
      </div>

      <div className="relative flex flex-col items-center space-y-8 animate-in fade-in duration-1000">
        <div className="w-24 h-24 bg-tertiary rounded-2xl flex items-center justify-center shadow-2xl shadow-tertiary/20 animate-pulse">
           <span className="material-symbols-outlined text-5xl text-black">sailing</span>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Hanseatic Strategos</h1>
          <p className="text-[10px] tracking-[0.5em] text-tertiary-fixed font-bold uppercase mt-2">v1.0.0 "Indestructible"</p>
        </div>

        <div className="w-64 space-y-3">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-tertiary transition-all duration-500 ease-out shadow-[0_0_15px_rgba(212,175,55,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[9px] text-center text-white/40 uppercase tracking-widest font-black animate-pulse">{status}</p>
        </div>
      </div>
    </div>
  )
}
