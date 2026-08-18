import { createContext, useContext, useRef, useState, useEffect, ReactNode, useMemo } from 'react'
import { createEngineAdapter, EngineAdapter } from './engineAdapter'
import { audioManager } from '../client_ui/audio'

interface GameContextValue {
  engine: EngineAdapter
  state: any
  status: any
  tick: number
  isReady: boolean
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const adapterRef = useRef<EngineAdapter | null>(null)
  const [state, setState] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [tick, setTick] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const adapter = createEngineAdapter()
    adapterRef.current = adapter

    adapter.on('tick', (tickData: any) => {
      setTick((t) => t + 1)
      setState(adapter.getState())
      setStatus(adapter.getStatus())
      
      // Play tick sound (every day)
      audioManager.playTick()
      
      // Every week (assuming 7 days/ticks) play a slightly different sound if needed
      // but requirement says Day/Week ticks.
      if (tickData?.totalDays % 7 === 0) {
        // Weekly logic if any
      }
    })

    adapter.on('game_start', () => {
      audioManager.playHorn()
    })

    adapter.on('trade_buy', () => audioManager.playCoin())
    adapter.on('trade_sell', () => audioManager.playCoin())
    
    adapter.on('encounter_start', () => audioManager.playHorn())

    // Global click listener for UI buttons
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        audioManager.playClick()
      }
    }
    window.addEventListener('click', handleGlobalClick)

    setIsReady(true)

    return () => {
      adapter.engine.stop()
      window.removeEventListener('click', handleGlobalClick)
    }
  }, [])

  useEffect(() => {
    if (!adapterRef.current) return
    const interval = setInterval(() => {
      const st = adapterRef.current!.getState()
      const st2 = adapterRef.current!.getStatus()
      setState(st)
      setStatus(st2)
    }, 500)
    return () => clearInterval(interval)
  }, [isReady])

  const contextValue = useMemo(() => ({
    engine: adapterRef.current!,
    state,
    status,
    tick,
    isReady
  }), [state, status, tick, isReady])

  if (!adapterRef.current) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-on-surface">
        <p className="font-title-md text-title-md">Initializing game engine...</p>
      </div>
    )
  }

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within a GameProvider')
  return ctx
}

export function usePlayer() {
  const { state } = useGame()
  return state?.player ?? null
}

export function useSimulationState() {
  const { state } = useGame()
  return state?.simulation ?? null
}
