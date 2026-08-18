# CORE SIMULATION: GAME ENGINE & SERVER

## 1. Orchestration Architecture
The simulation is split into two main layers: the **Simulation Server** (World state & basic economy) and the **Game Engine** (High-level logic & Player interaction).

### 1.1 SimulationServer.js
The heart of the low-level simulation. It maintains the `World` object and manages the "Tick" frequency.
- **Tick Rate**: Default 1000ms = 1 Game Day.
- **World Advancement**: Calls `world.advanceDay()`, which triggers `dailyTick()` on all cities.
- **Event Bus**: Emits `'tick'` to notify the Game Engine and UI.

### 1.2 GameEngine.ts
The high-level orchestrator. It listens to the Server and runs the complex game logic.
- **processTick(state)**: The main entry point for daily logic.
- **Subsystems managed**:
  - `AISystem`: Competitor behavior.
  - `PoliticalSystem`: Ranks, reputation, elections.
  - `EventSystem`: Random disasters (plague, fire).
  - `CombatManager`: Pirate encounters.
  - `MissionManager`: Dynamic mission generation.

---

## 2. Time Representation
| Scale | unit | Logic |
|---|---|---|
| **TotalDays** | Integer | Incremented every tick. Used for modulo checks (weekly/monthly). |
| **Calendar** | `{d, m, y}` | Starts 1/1/1300. 30 days per month. |
| **Fleet Hours** | 6h segments | Movement is processed 4 times per tick to provide 6-hour resolution. |

---

## 3. The Daily Tick Flow (Forensic Trace)
1. **Server Tick Start**: `world.advanceDay()`
   - Every `City` processes **Production** (Factories consume resources -> produce goods).
   - Every `City` processes **Consumption** (Population buys goods from market).
   - **Market Prices** update based on new supply/demand ratios.
2. **Engine ProcessTick**:
   - `aiSystem.processDaily()`: Competitors decide where to buy/sell.
   - `playerFleetManager.processFleetMove` (x4): Moves player ships and checks for encounters.
   - `eventSystem.processDaily()`: Rolls for plague, fire, or sieges.
   - **Periodic Checks**:
     - `totalDays % 7 == 0`: Weekly loans, Cathedral upgrades, financial history.
     - `date.day == 1`: Monthly political decay.
     - `rankUpdate`: Checks if player meets wealth/rep requirements for next rank.
3. **End of Tick**: Victory/Defeat condition check.

---

## 4. Player Action Lifecycle
Example: **Buying Goods**
1. **UI Call**: `engine.playerBuy(goodId, qty)`
2. **Context**: Identifies `player.currentCityId`.
3. **Execution**: `city.market.buy(goodId, qty)`
   - Validates stock.
   - Calculates dynamic price.
4. **State Change**:
   - `market.stock` down.
   - `player.gold` down.
   - `ship.cargo` up.
5. **Observation**: React `useGame()` hook detects state change and re-renders.

---

## 5. Performance Optimizations
- **DODEngine**: Used for heavy economic calculations in batch arrays.
- **AIWorker.js**: Offloads AI pathfinding and market evaluation to a background thread to prevent UI freezing during large world updates.
