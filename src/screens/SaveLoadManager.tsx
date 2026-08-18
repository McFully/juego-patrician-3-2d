import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { useGame } from '../engine/GameProvider'

export function SaveLoadManager() {
  const [, setLocation] = useLocation()
  const { engine } = useGame()
  const [feedback, setFeedback] = useState('')

  const saveFiles = useMemo(() => {
    return engine.engine.saveManager?.listSaves() || []
  }, [engine])

  const handleSave = (name: string) => {
    const res = engine.saveGame(name || `Crónica_${new Date().toLocaleDateString()}`)
    if (res) {
      setFeedback(`¡Crónica "${name}" guardada con éxito!`)
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  const handleLoad = (name: string) => {
    const success = engine.loadGame(name)
    if (success) {
      setLocation('/city-overview')
    } else {
      setFeedback('Error: Archivo de guardado corrupto o incompatible.')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  return (
    <main className="w-full h-full bg-[#0c0f17] flex flex-col font-montserrat select-none">
      <header className="flex-none h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setLocation('/')} className="material-symbols-outlined text-tertiary-fixed bg-transparent border-0 cursor-pointer">arrow_back</button>
          <h1 className="font-black text-sm text-tertiary-fixed uppercase tracking-[0.3em]">Gestor de Crónicas</h1>
        </div>
      </header>

      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col items-center">
        <div className="max-w-4xl w-full space-y-8">
          
          {feedback && (
            <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-center font-bold animate-pulse">
              {feedback}
            </div>
          )}

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight border-l-4 border-tertiary pl-4">Archivos Guardados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {saveFiles.length === 0 ? (
                <div className="col-span-2 py-20 text-center glass-panel rounded-2xl border border-white/5 opacity-40 italic">
                  No se han encontrado crónicas en los registros locales.
                </div>
              ) : (
                saveFiles.map((f: any) => (
                  <div key={f.name} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-tertiary/40 transition-all group flex justify-between items-center bg-black/20">
                    <div>
                      <h3 className="font-bold text-white uppercase">{f.name}</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Última modificación: {new Date(f.modified).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleLoad(f.name)} className="p-2 rounded-lg bg-tertiary text-black hover:scale-105 transition-transform border-0 cursor-pointer">
                        <span className="material-symbols-outlined">play_circle</span>
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all border-0 cursor-pointer">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="pt-8 border-t border-white/10 flex justify-center">
            <button 
              onClick={() => handleSave(`Nueva_Cronica_${Date.now().toString().slice(-4)}`)}
              className="px-xl py-md bg-amber-500 text-black rounded-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl border-0 cursor-pointer"
            >
              Grabar Nueva Crónica
            </button>
          </section>
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
