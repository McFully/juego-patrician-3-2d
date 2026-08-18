import { useLocation } from 'wouter'
import { useState } from 'react'
import { useGame, usePlayer } from '../engine/GameProvider'

interface Councilor {
  name: string
  influence: number
  status: string
  statusClass: string
  quote: string
}

export function TheBathHouse() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [bribes, setBribes] = useState<Record<number, number>>({})
  const [feedback, setFeedback] = useState('')

  const currentCityId = player?.currentCityId || 'lubeck'
  const councillors = worldState?.politics?.councillors || []

  if (!player) return null

  const handleSendBribe = (index: number, name: string, amt: number) => {
    if (player.gold >= amt) {
      const ok = engine.bribeCouncillor(currentCityId, index, amt)
      if (ok) {
        setFeedback(`¡Incentivo de ${amt} DUC enviado a ${name}! Su opinión sobre ti mejora.`)
      } else {
        setFeedback('Error al procesar el soborno.')
      }
    } else {
      setFeedback('Fondos insuficientes para el soborno.')
    }
    setTimeout(() => setFeedback(''), 3000)
  }

  const handleCallSession = () => {
    setFeedback('¡Sesión extraordinaria del Concejo convocada! Discusión fiscal iniciada.')
    setTimeout(() => setFeedback(''), 3000)
  }

  const handleWhisperAction = (actionName: string) => {
    setFeedback(`Acción de intriga iniciada: ${actionName}`)
    setTimeout(() => setFeedback(''), 3000)
  }

  const councilors: Councilor[] = [
    { name: 'Barón Ulrich', influence: 8, status: 'TRANQUILO', statusClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', quote: '"El mar provee, pero la ley decide."' },
    { name: 'Lady Isolde', influence: 6, status: 'SOSPECHOSA', statusClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30', quote: '"Cada secreto tiene su peso en plata."' },
    { name: 'Maestre Gero', influence: 4, status: 'EBRIO', statusClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30', quote: '"Un baño caliente, una cerveza fría y un nuevo impuesto."' },
    { name: 'Concejal Erik', influence: 5, status: 'NEUTRAL', statusClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30', quote: '"El comercio es la única religión verdadera."' },
  ]

  return (
    <main className="w-full h-screen overflow-hidden bg-gradient-to-br from-[#08070d] to-[#161224] text-on-surface p-margin flex flex-col gap-md">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between border-b border-white/10 pb-sm">
        <div className="flex items-center gap-md">
          <button
            onClick={() => setLocation('/city-overview')}
            className="flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 transition-all cursor-pointer"
            title="Volver a la Ciudad"
            aria-label="Volver a la ciudad"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-tertiary-fixed tracking-tight font-black uppercase">Los Baños Termales (Intriga)</h1>
            <p className="text-on-surface-variant font-body-md">Cámara oculta para influir en los ediles y obtener favores políticos.</p>
          </div>
        </div>
        <div className="flex gap-sm">
          <button 
            onClick={() => setLocation('/ledger')}
            className="border border-white/10 text-on-surface hover:bg-white/5 px-md py-xs rounded-lg text-xs font-bold cursor-pointer"
          >
            VER LIBRO MAYOR
          </button>
          <button 
            onClick={handleCallSession}
            className="bg-amber-500 text-on-tertiary-fixed hover:bg-amber-600 px-md py-xs rounded-lg text-xs font-black cursor-pointer border-0 shadow-lg shadow-amber-500/10 uppercase"
          >
            Convocatoria Urgente
          </button>
        </div>
      </header>

      {feedback && (
        <div className="p-sm bg-secondary/15 border border-secondary/35 text-secondary rounded-lg text-center font-bold animate-pulse">
          {feedback}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter flex-1 items-stretch">
        
        {/* Left column: Councilors */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-md overflow-y-auto min-h-0">
          <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs">
            <span className="material-symbols-outlined">gavel</span>
            Concejales de {currentCityId.toUpperCase()}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            {councillors.map((c: any, index: number) => {
              const bribeVal = bribes[index] || 0
              const status = c.bribed ? 'SOBORNADO' : 'ESCÉPTICO'
              const statusClass = c.bribed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'

              return (
                <div key={index} className="p-md rounded-xl bg-white/5 border border-white/10 flex flex-col gap-xs justify-between hover:border-amber-500/35 transition-all">
                  <div>
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-base text-on-surface">{c.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${statusClass}`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-xs italic text-on-surface-variant my-xs">"Los intereses de la ciudad son mis intereses... si son rentables."</p>
                    <div className="text-xs text-on-surface-variant mt-sm">
                      Peso del Voto: <span className="font-bold text-on-surface">{((c.voteWeight || 0.2) * 10).toFixed(1)}/10</span>
                    </div>
                  </div>
                  
                  <div className="mt-md pt-sm border-t border-white/5">
                    <label className="block text-[10px] text-on-surface-variant uppercase font-bold mb-xs">Oferta de Incentivo: {bribeVal} DUC</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={bribeVal}
                      onChange={e => setBribes({ ...bribes, [index]: parseInt(e.target.value) || 0 })}
                      className="w-full accent-amber-500 bg-white/10 h-1 rounded-lg outline-none cursor-pointer"
                      aria-label={`Cantidad de incentivo para ${c.name}`}
                    />
                    <button 
                      onClick={() => handleSendBribe(index, c.name, bribeVal)}
                      disabled={c.bribed}
                      className="w-full mt-sm bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-sm py-2.5 rounded transition-all cursor-pointer font-bold border border-amber-500/30 disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      {c.bribed ? 'Ya Sobornado' : 'Enviar Incentivo'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Right column: Whispers & Conspiracies */}
        <section className="col-span-12 lg:col-span-5 glass-panel rounded-xl p-md flex flex-col gap-md">
          <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs border-b border-white/10 pb-xs">
            <span className="material-symbols-outlined">forum</span>
            Rumores y Conspiraciones
          </h2>
          
          <div className="space-y-sm overflow-y-auto max-h-[500px] custom-scrollbar pr-xs">
            
            {/* Whisper 1 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-center text-xs">
                <span className="text-tertiary font-bold uppercase tracking-wider">Rumor</span>
                <span className="text-[10px] text-on-surface-variant">Hace 2 días</span>
              </div>
              <p className="text-xs text-on-surface-variant">El Maestre Gero planea proponer un nuevo Impuesto a la Sal en la próxima sesión.</p>
              <button 
                onClick={() => handleWhisperAction('Investigar Ley de Sal')}
                className="mt-xs bg-white/5 hover:bg-white/10 text-sm py-2.5 rounded transition-all cursor-pointer text-on-surface border border-white/10"
              >
                Investigar Asunto
              </button>
            </div>

            {/* Whisper 2 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider">Favor Disponible</span>
                <span className="text-[10px] text-emerald-400">NUEVO</span>
              </div>
              <p className="text-xs text-on-surface-variant">Lady Isolde puede "extraviar" el último manifiesto de grano por una tarifa.</p>
              <button 
                onClick={() => handleWhisperAction('Reclamar favor por 500 DUC')}
                className="mt-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-sm py-2.5 rounded transition-all cursor-pointer font-bold"
              >
                Reclamar (500 DUC)
              </button>
            </div>

            {/* Whisper 3 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-400 font-bold uppercase tracking-wider">Amenaza</span>
                <span className="text-[10px] text-rose-400 font-bold">URGENTE</span>
              </div>
              <p className="text-xs text-on-surface-variant">Los Caballeros del Báltico cuestionan tu reciente expansión en Riga.</p>
              <button 
                onClick={() => handleWhisperAction('Silenciar Críticos')}
                className="mt-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-sm py-2.5 rounded transition-all cursor-pointer font-bold"
              >
                Silenciar Críticos
              </button>
            </div>

          </div>
        </section>

      </div>
    </main>
  )
}
