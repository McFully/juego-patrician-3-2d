import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'

export function TheHanseaticDietHall() {
  const [, setLocation] = useLocation()
  const { engine, state } = useGame()
  const [selectedCandidate, setSelectedCandidate] = useState('Janos de Riga')
  const [feedback, setFeedback] = useState('')

  const handleCastVote = () => {
    setFeedback(`¡Has emitido tu voto (12.5% de peso) por ${selectedCandidate}!`)
    setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl gap-4">
        <div className="flex items-center gap-md">
          <span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight">Hanseatic Strategos</span>
        </div>
        <nav className="hidden md:flex gap-lg">
          <button onClick={() => setLocation('/world-map')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mapa Mundial</button>
          <button onClick={() => setLocation('/ledger')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Libro Mayor</button>
          <button onClick={() => setLocation('/convoy-manager')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Convoy</button>
          <button onClick={() => setLocation('/market')} className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 bg-transparent border-0 cursor-pointer">Mercado</button>
          <button onClick={() => setLocation('/town-hall')} className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 bg-transparent border-0 cursor-pointer">Concejo</button>
        </nav>
        <div className="flex items-center gap-sm">
          <button onClick={() => setLocation('/messages')} className="material-symbols-outlined p-xs text-tertiary-fixed hover:bg-surface-variant/30 rounded-full transition-all scale-105 active:scale-95 bg-transparent border-0 cursor-pointer" data-icon="notifications" aria-label="Notificaciones">notifications</button>
          <button onClick={() => setLocation('/settings')} className="material-symbols-outlined p-xs text-tertiary-fixed hover:bg-surface-variant/30 rounded-full transition-all scale-105 active:scale-95 bg-transparent border-0 cursor-pointer" data-icon="settings" aria-label="Configuración">settings</button>
          <div className="w-10 h-10 rounded-full border-2 border-tertiary-fixed overflow-hidden ml-xs">
            <img alt="Retrato del Gobernador" className="w-full h-full object-cover" src={ASSETS.GOVERNOR}/>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-8 px-margin h-screen overflow-hidden relative">
        {feedback && (
          <div className="max-w-7xl mx-auto mb-md p-sm bg-secondary/20 border border-secondary/40 text-secondary rounded-lg text-center font-bold animate-pulse">
            {feedback}
          </div>
        )}

        <div className="max-w-7xl mx-auto mb-lg text-center text-on-surface">
          <h1 className="font-headline-xl text-headline-xl text-tertiary-fixed text-glow-gold mb-xs">La Dieta de Lübeck</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Elección del Gran Síndico de la Liga Hanseática. Cada voto redefine el futuro del comercio báltico.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter h-[calc(100vh-180px)]">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-md">
            <div className="glass-panel rounded-xl p-md h-[180px] md:h-[260px] relative overflow-hidden group bg-primary-container/60">
              <div className="absolute inset-0 z-0">
                <img alt="Mapa Estratégico Báltico" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]" src={ASSETS.TACTICAL_MAP}/>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between text-on-surface">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-title-md text-title-md text-tertiary-fixed font-bold">Mapa de Influencia Urbana</h2>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Peso del voto en tiempo real por centro comercial</p>
                  </div>
                  <div className="flex gap-xs">
                    <span className="px-sm py-xs bg-secondary-container/30 border border-secondary text-secondary rounded-lg text-label-sm font-bold flex items-center gap-xs">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> SESIÓN EN VIVO
                    </span>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/4 -translate-y-1/2">
                  <div className="flex flex-col items-center group/city cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-tertiary shadow-[0_0_10px_#ffe088] group-hover/city:scale-125 transition-transform"></div>
                    <span className="font-label-sm text-label-sm mt-xs glass-panel px-xs rounded bg-primary-container/80 font-bold">Lübeck (24%)</span>
                  </div>
                </div>
                <div className="absolute bottom-1/3 right-1/4">
                  <div className="flex flex-col items-center group/city cursor-pointer">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#afc8f0] group-hover/city:scale-125 transition-transform"></div>
                    <span className="font-label-sm text-label-sm mt-xs glass-panel px-xs rounded bg-primary-container/80 font-bold">Danzig (18%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-on-surface">
              <div className="glass-panel rounded-xl p-md bg-primary-container/60">
                <h3 className="font-title-md text-title-md text-on-surface mb-sm font-bold">Distribución de Peso</h3>
                <div className="space-y-sm">
                  <div className="space-y-xs">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-on-surface-variant">
                      <span>Posición Mercantil</span>
                      <span className="text-tertiary-fixed font-bold">Alta</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary-fixed w-[85%]"></div>
                    </div>
                  </div>
                  <div className="space-y-xs">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-on-surface-variant">
                      <span>Contribución Militar</span>
                      <span className="text-secondary font-bold">Moderada</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[45%]"></div>
                    </div>
                  </div>
                  <div className="space-y-xs">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-on-surface-variant">
                      <span>Favor Político</span>
                      <span className="text-primary font-bold">Máximo</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary-fixed w-[98%] shadow-[0_0_8px_#afc8f0]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-panel rounded-xl p-md flex flex-col justify-center items-center text-center bg-primary-container/60">
                <span className="material-symbols-outlined text-headline-xl text-tertiary-fixed mb-xs" data-icon="stars" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <div className="font-headline-lg text-headline-lg text-on-surface font-bold">1.450</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Puntuación de Reputación Global</div>
                <p className="font-label-sm text-label-sm text-tertiary-fixed/70 mt-sm">Tu voto representa el 12.5% del peso total de la Dieta.</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 h-full">
            <div className="glass-panel-active rounded-xl p-md flex flex-col justify-between h-full border-t-4 border-tertiary-fixed bg-primary-container/85 text-on-surface">
              <div>
                <h2 className="font-title-md text-title-md text-tertiary-fixed mb-md flex items-center gap-xs font-bold">
                  <span className="material-symbols-outlined" data-icon="gavel">gavel</span> Candidatos de la Elección
                </h2>
                <div className="space-y-sm">
                  {/* Candidate 1 */}
                  <div
                    onClick={() => setSelectedCandidate('Magnus von Visby')}
                    className={`glass-panel rounded-xl p-sm border-l-4 transition-all cursor-pointer group hover:bg-surface-variant/20 ${selectedCandidate === 'Magnus von Visby' ? 'border-l-tertiary-fixed bg-tertiary-container/10 border border-tertiary-fixed/30' : 'border-l-primary'}`}
                  >
                    <div className="flex items-center gap-md">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <img alt="Magnus von Visby" className="w-full h-full object-cover" src={ASSETS.GOVERNOR}/>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-on-surface">Magnus von Visby</h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-primary font-bold">Política Aislacionista</span>
                          <span className="text-on-surface-variant font-bold">32% Apoyo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate 2 */}
                  <div
                    onClick={() => setSelectedCandidate('Janos de Riga')}
                    className={`glass-panel rounded-xl p-sm border-l-4 transition-all cursor-pointer group hover:bg-surface-variant/20 ${selectedCandidate === 'Janos de Riga' ? 'border-l-tertiary-fixed bg-tertiary-container/10 border border-tertiary-fixed/30' : 'border-l-primary'}`}
                  >
                    <div className="flex items-center gap-md">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <img alt="Janos de Riga" className="w-full h-full object-cover" src={ASSETS.GOVERNOR}/>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-on-surface">Janos de Riga</h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-tertiary font-bold">Política Expansionista</span>
                          <span className="text-on-surface-variant font-bold">48% Apoyo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate 3 */}
                  <div
                    onClick={() => setSelectedCandidate('Henrik de Estocolmo')}
                    className={`glass-panel rounded-xl p-sm border-l-4 transition-all cursor-pointer group hover:bg-surface-variant/20 ${selectedCandidate === 'Henrik de Estocolmo' ? 'border-l-tertiary-fixed bg-tertiary-container/10 border border-tertiary-fixed/30' : 'border-l-primary'}`}
                  >
                    <div className="flex items-center gap-md">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <img alt="Henrik de Estocolmo" className="w-full h-full object-cover" src={ASSETS.GOVERNOR}/>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-on-surface">Henrik de Estocolmo</h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-on-surface-variant font-bold">Política Neutral</span>
                          <span className="text-on-surface-variant font-bold">20% Apoyo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-md">
                <button onClick={handleCastVote} className="w-full bg-tertiary text-on-tertiary font-black py-sm rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-sm border-0 cursor-pointer">
                  <span className="material-symbols-outlined" data-icon="how_to_vote" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_vote</span>
                  EMITIR MI VOTO
                </button>
                <p className="text-center font-label-sm text-xs text-on-surface-variant mt-xs">
                  Los votos son definitivos una vez enviados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
          background: rgba(0, 31, 63, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .glass-panel-active {
          background: rgba(0, 31, 63, 0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .text-glow-gold {
          text-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
        }
        body {
          background-color: #131407;
          background-image: radial-gradient(circle at center, #163152 0%, #131407 100%);
          min-height: 100vh;
        }
      `}</style>
    </>
  )
}
