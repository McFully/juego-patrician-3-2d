import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame } from '../engine/GameProvider'

export function Tavern() {
  const [, setLocation] = useLocation()
  const { engine, state } = useGame()
  const [msg, setMsg] = useState('')

  if (!state?.player) return null

  const handleNpcAction = (npcId: string, npcName: string, actionId: string) => {
    if (actionId === 'CONTRATARcrew') {
      engine.CONTRATARSailors(5, 0)
      setMsg('¡5 marineros contratados!')
    } else if (actionId === 'CONTRATARcaptain') {
      engine.CONTRATARCaptain(npcId, 0)
      setMsg(`¡Capitán ${npcName} contratado!`)
    } else {
      setMsg(`Preguntaste a ${npcName}: "Las rutas del este están tranquilas hoy".`)
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const player = state?.player
  const currentCityId = player?.currentCityId || 'lubeck'

  const handleRECLUTAR = () => {
    const success = engine.CONTRATARSailors(10, 0)
    if (success) setMsg('¡10 marineros reclutados!')
    else setMsg('Error: Fondos insuficientes o límite de tripulación.')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleCONTRATARNavigator = () => {
    const success = engine.CONTRATARCaptain('navigator', 0)
    if (success) setMsg('¡Navegante contratado!')
    else setMsg('Error: No puedes permitirte este oficial.')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleCONTRATARCaptainCard = () => {
    const success = engine.CONTRATARCaptain('vandermeer', 0)
    if (success) setMsg('¡Almirante Van Der Meer contratado!')
    else setMsg('Error: Fondos insuficientes.')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleMissionAccept = (missionName: string) => {
    setMsg(`¡Contrato formalizado: ${missionName}! Consulta tu diario.`)
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <main className="w-full h-screen overflow-hidden bg-gradient-to-br from-[#070b12] to-[#121926] text-on-surface p-margin flex flex-col gap-md">
      {/* Header section with back button */}
      <header className="flex flex-wrap items-center justify-between border-b border-white/10 pb-sm">
        <div className="flex items-center gap-md">
          <button 
            onClick={() => setLocation('/city-overview')}
            className="flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 transition-all cursor-pointer"
            title="Volver a la Ciudad"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-tertiary-fixed tracking-tight font-black uppercase">La Taberna de {currentCityId.toUpperCase()}</h1>
            <p className="text-on-surface-variant font-body-md">Refugio de marineros, capitanes de fortuna y contratos clandestinos.</p>
          </div>
        </div>
        <div className="glass-panel px-md py-xs rounded-xl border-l-4 border-l-tertiary bg-primary-container/40">
          <span className="text-xs uppercase text-on-surface-variant block">Oro disponible</span>
          <span className="text-xl font-bold text-tertiary">{Math.floor(player?.gold || 0).toLocaleString()} DUC</span>
        </div>
      </header>

      {msg && (
        <div className="p-sm bg-secondary/15 border border-secondary/35 text-secondary rounded-lg text-center font-bold animate-pulse">
          {msg}
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-gutter flex-1 items-stretch">
        
        {/* Left column: NPCs */}
        <section className="col-span-12 lg:col-span-4 glass-panel rounded-xl p-md flex flex-col gap-md">
          <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs border-b border-white/10 pb-xs">
            <span className="material-symbols-outlined">groups</span>
            Personajes Clave
          </h2>
          <div className="space-y-sm overflow-y-auto max-h-[600px] custom-scrollbar pr-xs">
            
            {/* NPC 1 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-on-surface">Capitán 'Hierro' Klaus</h3>
                  <p className="text-xs text-on-surface-variant">Lobo de mar veterano</p>
                </div>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Navegante</span>
              </div>
              <div className="flex gap-sm mt-xs">
                <button 
                  onClick={() => handleNpcAction('ironklaus', "Capitán 'Hierro' Klaus", 'Preguntar')}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-sm py-2.5 rounded transition-all cursor-pointer border border-white/10 text-on-surface"
                >
                  Inquirir Rumores
                </button>
                <button 
                  onClick={() => handleNpcAction('ironklaus', "Capitán 'Hierro' Klaus", 'CONTRATARcaptain')}
                  className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm py-2.5 rounded transition-all cursor-pointer border border-amber-500/30"
                >
                  Contratar
                </button>
              </div>
            </div>

            {/* NPC 2 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-on-surface">Elara la Silenciosa</h3>
                  <p className="text-xs text-on-surface-variant">Informante y espía de muelles</p>
                </div>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Información</span>
              </div>
              <div className="flex gap-sm mt-xs">
                <button 
                  onClick={() => handleNpcAction('elara', 'Elara la Silenciosa', 'buysecrets')}
                  className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm py-2.5 rounded transition-all cursor-pointer border border-purple-500/30"
                >
                  Comprar Secretos
                </button>
              </div>
            </div>

            {/* NPC 3 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-on-surface">Viejo Barnaby</h3>
                  <p className="text-xs text-on-surface-variant">Contratista de tripulación local</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Mano de Obra</span>
              </div>
              <div className="flex gap-sm mt-xs">
                <button 
                  onClick={() => handleNpcAction('barnaby', 'Viejo Barnaby', 'CONTRATARcrew')}
                  className="flex-grow bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-sm py-2.5 rounded transition-all cursor-pointer border border-emerald-500/30"
                >
                  Contratar Marineros (5)
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Center column: Recruitment Hub */}
        <section className="col-span-12 lg:col-span-4 glass-panel rounded-xl p-md flex flex-col gap-md">
          <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs border-b border-white/10 pb-xs">
            <span className="material-symbols-outlined">sailing</span>
            Centro de Reclutamiento
          </h2>
          
          <div className="space-y-md flex-1">
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs">
              <h3 className="font-bold">Contratar Marineros</h3>
              <p className="text-xs text-on-surface-variant">Los marineros son esenciales para operar tus navíos y convoyes.</p>
              <button 
                onClick={handleRECLUTAR}
                className="mt-xs w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded transition-all cursor-pointer border-0"
              >
                Reclutar 10 Marineros
              </button>
            </div>

            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs">
              <h3 className="font-bold">Navegante Experimentado</h3>
              <p className="text-xs text-on-surface-variant">Aumenta la velocidad máxima del convoy y mejora la navegación con tormentas.</p>
              <button 
                onClick={handleCONTRATARNavigator}
                className="mt-xs w-full bg-amber-500 text-on-tertiary-fixed font-bold py-2 rounded transition-all hover:scale-[1.02] cursor-pointer border-0"
              >
                Contratar Navegante (150 DUC)
              </button>
            </div>

            <div className="p-sm rounded-lg bg-white/5 border border-white/10 flex flex-col gap-xs">
              <h3 className="font-bold">Almirante Van Der Meer</h3>
              <p className="text-xs text-on-surface-variant">Capitán Legendario. Aumenta la moral de la tripulación en combate y la precisión de los cañones.</p>
              <button 
                onClick={handleCONTRATARCaptainCard}
                className="mt-xs w-full bg-indigo-600 text-white font-bold py-2 rounded transition-all hover:scale-[1.02] cursor-pointer border-0"
              >
                Contratar Almirante (500 DUC)
              </button>
            </div>
          </div>
        </section>

        {/* Right column: Secret Room / Contracts */}
        <section className="col-span-12 lg:col-span-4 glass-panel rounded-xl p-md flex flex-col gap-md">
          <h2 className="font-title-md text-title-md text-tertiary-fixed flex items-center gap-xs border-b border-white/10 pb-xs">
            <span className="material-symbols-outlined">lock</span>
            La Habitación Secreta
          </h2>
          <div className="space-y-sm overflow-y-auto max-h-[600px] custom-scrollbar pr-xs">
            
            {/* Contract 1 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-on-surface">El Tesoro de Visby</span>
                <span className="text-xs text-amber-400 font-bold">2.500 DUC</span>
              </div>
              <p className="text-xs text-on-surface-variant">Encuentra y recupera el cofre hundido en las coordenadas norte.</p>
              <button 
                onClick={() => handleMissionAccept('El Tesoro de Visby')}
                className="mt-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs py-2 rounded transition-all cursor-pointer font-bold"
              >
                Aceptar Contrato
              </button>
            </div>

            {/* Contract 2 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-on-surface">Hundimiento de 'El Kraken'</span>
                <span className="text-xs text-amber-400 font-bold">4.000 DUC</span>
              </div>
              <p className="text-xs text-on-surface-variant">Destruye la fragata pirata que asola la ruta de Estocolmo.</p>
              <button 
                onClick={() => handleMissionAccept("Hundimiento de 'El Kraken'")}
                className="mt-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs py-2 rounded transition-all cursor-pointer font-bold"
              >
                Aceptar Contrato
              </button>
            </div>

            {/* Contract 3 */}
            <div className="p-sm rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-on-surface">Monopolio del Ámbar</span>
                <span className="text-xs text-amber-400 font-bold">+15% Beneficio</span>
              </div>
              <p className="text-xs text-on-surface-variant">Establece un enlace comercial exclusivo de ámbar con Riga.</p>
              <button 
                onClick={() => handleMissionAccept('El Monopolio del Ámbar')}
                className="mt-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs py-2 rounded transition-all cursor-pointer font-bold"
              >
                Aceptar Contrato
              </button>
            </div>

          </div>
        </section>

      </div>
    </main>
  )
}
