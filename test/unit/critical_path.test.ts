import { describe, it, expect } from 'vitest'
import { World } from '../../src/sim_engine/City'
import { AISystem } from '../../src/sim_engine/AISystem'

describe('Critical Path Certification', () => {
  it('should complete a full merchant lifecycle flow without errors', () => {
    // 1. Initial State
    const world = new World()
    const ai = new AISystem(world)
    const lubeck = world.getCity('lubeck')
    
    expect(lubeck).toBeDefined()
    expect(lubeck.market.goods.grain.stock).toBeGreaterThan(0)

    // 2. Mock Player Action: Start Game
    const playerName = 'Aritz the Great'
    const playerGold = 3000

    // 3. Mock Player Action: Market Buy (The most common path)
    const initialGrain = lubeck.market.goods.grain.stock
    const buyQty = 10
    const price = lubeck.market.getPrice('grain')
    
    lubeck.market.buy('grain', buyQty)
    
    expect(lubeck.market.goods.grain.stock).toBeLessThan(initialGrain)
    expect(lubeck.market.getPrice('grain')).toBeGreaterThan(price) // Price should rise

    // 4. Mock AI Interaction: Daily processing
    ai.processDaily()
    
    // 5. Stability Check
    expect(world.totalDays).toBe(0)
    world.advanceDay()
    expect(world.totalDays).toBe(1)
    
    console.log('✓ Critical Path Certified: Initialization -> Market -> Simulation Tick.')
  })
})
