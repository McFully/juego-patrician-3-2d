# SCALABILITY: DATA-ORIENTED DESIGN (DOD)

## 1. The Problem
Simulating 20 cities, each with 20 goods, 3 population groups, and dozens of factories in a high-frequency tick loop creates significant overhead if using traditional Object-Oriented patterns (JS objects, property lookups).

## 2. The Solution: `DODEngine.ts`
The engine uses contiguous memory blocks (`Float64Array`) to store world data.

### 2.1 Memory Layout
| Buffer | Content |
|---|---|
| `STOCK_BUFFER` | Flat array of [City0_Good0, City0_Good1, ..., CityN_GoodM] |
| `DEMAND_BUFFER` | Weekly demand values for all city-good pairs. |
| `PRICE_BUFFER` | Cached calculated prices. |

### 2.2 Batch Processing
Instead of looping over cities and then over goods using nested `for...of` loops on objects:
1. Data is loaded into a flat `Float64Array`.
2. Calculations are performed in a single, cache-friendly loop.
3. Results are committed back to the entity state.

## 3. Multithreading (`AIWorker.js`)
The **AI Decision Making** is offloaded to a Web Worker.
- **Main Thread**: Handles UI, User Input, and basic State.
- **Worker Thread**: Performs the heavy `Market Evaluation` for AI agents.
- **Communication**: Via `postMessage` with transferrable objects (SharedArrayBuffer where supported).

## 4. Impact
- **Reduced GC Pressure**: Fewer object allocations per tick.
- **Consistent Frame Rate**: Complex logic doesn't block the React rendering cycle.
- **Scalability**: Can handle hundreds of cities and thousands of ships if the world expands.
