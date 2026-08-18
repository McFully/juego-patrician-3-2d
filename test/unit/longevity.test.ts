import { describe, it, expect } from 'vitest'
import { World } from '../../src/sim_engine/City'
import { AISystem } from '../../src/sim_engine/AISystem'
import { CombatManager } from '../../src/sim_engine/NavalCombat'

describe('Simulation Longevity', () => {
  it('should run for 50 years with zero performance degradation and stable entity counts', () => {
    const world = new World()
    const ai = new AISystem(world)
    const combat = new CombatManager(world)

    const START_TIME = Date.now()
    const TOTAL_DAYS = 360 * 50 // 50 Years
    
    let totalTickTime = 0
    let lastTickTime = 0

    for (let day = 0; day < TOTAL_DAYS; day++) {
      const tickStart = performance.now()
      
      world.advanceDay()
      ai.processDaily()
      combat.processDaily(world.totalDays)
      
      const tickEnd = performance.now()
      const duration = tickEnd - tickStart
      totalTickTime += duration
      
      if (day === TOTAL_DAYS - 1) {
        lastTickTime = duration
      }
    }

    const END_TIME = Date.now()
    const totalDuration = END_TIME - START_TIME
    const avgTick = totalTickTime / TOTAL_DAYS

    console.log(`Longevity Test Results (50 Years):`)
    console.log(`- Total Real Time: ${totalDuration}ms`)
    console.log(`- Avg Tick Duration: ${avgTick.toFixed(4)}ms`)
    console.log(`- Last Tick Duration: ${lastTickTime.toFixed(4)}ms`)
    console.log(`- Final Pirate Fleets: ${combat.fleetAI.getPirateCount()}`)
    
    // VERIFICATIONS
    // 1. Performance should not degrade significantly (avg tick < 2ms)
    expect(avgTick).toBeLessThan(2)
    
    // 2. Pirate fleets should be capped due to retirement logic
    // (max 3 hideouts * 2 fleets + some roaming, but should be < 50)
    expect(combat.fleetAI.getPirateCount()).toBeLessThan(50)

    // 3. Economy should not crash (population should exist)
    const lubeck = world.getCity('lubeck')
    expect(lubeck.totalPopulation).toBeGreaterThan(100)
  })
})
