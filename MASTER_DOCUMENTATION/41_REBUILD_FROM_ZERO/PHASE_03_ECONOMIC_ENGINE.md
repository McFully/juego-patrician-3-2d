# PHASE 03: ECONOMIC ENGINE & PERFORMANCE (DOD)

## 1. Goal
Optimize the simulation to handle the massive data flow and implement the full Hanseatic supply chain.

## 2. Supply Chain Implementation
1. **EconomySystems.ts**:
   - Implement the factory input/output logic.
   - Add "Regional Bonuses" (e.g., more timber in Scandinavia).
2. **Consumption.js**:
   - Define the daily needs of the three social classes (Poor, Middle, Wealthy).

## 3. Performance Optimization (DOD)
1. **DODEngine.ts**:
   - Map world data to `Float64Array`.
   - Implement batch processing for demand and production to bypass JS object overhead.

## 4. AI Agents (Basics)
1. **AISystem.ts**:
   - Create a basic "Arbitrage" agent that looks for price gaps between cities.
   - Implement simple pathfinding based on city coordinates.

## 5. Checklist
- [ ] Factory production consumes raw materials from the market.
- [ ] Simulation can run 10,000 days in < 5 seconds using DOD.
- [ ] AI agents successfully transfer goods from "Production Cities" to "Consumption Cities".
