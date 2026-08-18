import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useGame } from '../engine/GameProvider'

/**
 * useHotkeys: Global keyboard navigation and simulation control manager.
 * Implements professional strategy game shortcuts for the 'Gold Master' release.
 */
export function useHotkeys() {
  const [location, setLocation] = useLocation()
  const { engine } = useGame()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
        return
      }

      const key = event.code

      switch (key) {
        // --- NAVIGATION ---
        case 'KeyM':
          setLocation('/market')
          break
        case 'KeyL':
          setLocation('/ledger')
          break
        case 'KeyW':
          setLocation('/world-map')
          break
        case 'KeyC':
          setLocation('/city-overview')
          break
        case 'KeyT':
          setLocation('/tavern')
          break
        case 'KeyS':
          setLocation('/shipyard')
          break
        case 'KeyG':
          setLocation('/merchant-guild')
          break
        case 'KeyO':
          setLocation('/trading-office')
          break
        case 'KeyR':
          setLocation('/trade-routes')
          break
        case 'Escape':
          // Contextual back logic
          if (location !== '/' && location !== '/city-overview') {
            setLocation('/city-overview')
          }
          break

        // --- SIMULATION CONTROL ---
        case 'Space':
          event.preventDefault()
          if (engine.engine.server.running) {
            engine.engine.stop()
          } else {
            engine.engine.start()
          }
          break
        case 'Digit1':
          engine.setTickRate(1)
          break
        case 'Digit2':
          engine.setTickRate(2)
          break
        case 'Digit3':
          engine.setTickRate(4)
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [location, setLocation, engine])
}
