import { useState, useEffect } from 'react'
import { useGame } from '../../engine/GameProvider'
import { Button, Modal } from '../ui'
import { useLocation } from 'wouter'

export function EncounterOverlay() {
  const { engine } = useGame()
  const [, setLocation] = useLocation()
  const [encounter, setEncounter] = useState<any>(null)

  useEffect(() => {
    const handleEncounter = (data: any) => {
      setEncounter(data)
    }
    engine.on('encounter_start', handleEncounter)
    return () => engine.off('encounter_start', handleEncounter)
  }, [engine])

  const handleAction = (action: 'fight' | 'flee' | 'surrender') => {
    const result = engine.resolveEncounter(action)
    if (result.action === 'fight') {
      setLocation('/combat')
      setEncounter(null)
    } else {
      alert(result.message)
      if (result.success || action === 'surrender') {
        setEncounter(null)
      }
    }
  }

  if (!encounter) return null

  return (
    <Modal isOpen={!!encounter} onClose={() => {}} title="Encuentro en el Mar" size="md">
      <div className="text-center space-y-md w-full max-w-[600px] mx-auto overflow-y-auto max-h-[90vh]">
        <div className="w-24 h-24 mx-auto bg-error/20 rounded-full flex items-center justify-center border-4 border-error animate-pulse">
          <span className="material-symbols-outlined text-5xl text-error">skull</span>
        </div>
        
        <div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">¡Intercepción Pirata!</h3>
          <p className="text-on-surface-variant">
            Una flota de <span className="text-error font-bold">{encounter.enemyFleet.name}</span> ha interceptado tu nave <span className="text-tertiary-fixed font-bold">{encounter.ship.name}</span>!
          </p>
        </div>

        <div className="bg-surface-container-highest p-md rounded-xl text-left space-y-sm border border-error/20">
          <h4 className="font-label-sm text-label-sm text-error uppercase">Fuerza Enemiga</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm">Naves: {encounter.enemyFleet.ships.length}</span>
            <span className="text-xs text-on-surface-variant italic">Evaluación: Peligroso</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
          <Button variant="primary" fullWidth onClick={() => handleAction('fight')}>
            COMBATIR
          </Button>
          <Button variant="secondary" fullWidth onClick={() => handleAction('flee')}>
            HUIR
          </Button>
          <Button variant="ghost" fullWidth className="text-error" onClick={() => handleAction('surrender')}>
            RENDIRSE
          </Button>
        </div>
      </div>
    </Modal>
  )
}
