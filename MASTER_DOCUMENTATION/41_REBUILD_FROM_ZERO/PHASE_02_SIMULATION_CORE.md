# PHASE 02: WORLD SIMULATION & MARKET CORE

## 1. Goal
Implement the heart of the game: the tick-based simulation server and the fundamental city/market logic.

## 2. Headless Simulation Server
1. **SimulationServer.js**:
   - Create a class that manages the main `interval`.
   - Implement the `EventBus` to emit daily ticks.
   - Store the `World` object.

## 3. The World & City Entities
1. **World.js**: Container for all cities and AI agents.
2. **City.ts**: 
   - Define sub-systems: `Market`, `Population`, `Factories`.
   - Implement `dailyTick()` to trigger production and consumption.

## 4. Market Logic (The Priority)
1. **Market.ts**:
   - Implement `calculatePrice(goodId)` using the formula from `28_FORMULAS/ECONOMY_FORMULAS.md`.
   - Implement `buy(goodId, qty)` and `sell(goodId, qty)` with marginal price increases/decreases.

## 5. Verification
- Run a "headless" script (e.g., `node src/headless.js`) for 100 ticks.
- Log prices to verify they fluctuate based on consumption.
- [ ] Prices increase when stock is low.
- [ ] Population decreases if food (Grain/Fish) is at 0 for > 7 days.
