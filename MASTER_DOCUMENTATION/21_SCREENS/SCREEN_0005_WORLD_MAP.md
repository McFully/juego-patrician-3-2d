# SCREEN: WORLD MAP (Mapa del Mundo)

## 1. Overview
The **World Map** is the strategic visualization layer of the Hanseatic League. It handles navigation between cities, real-time fleet tracking, and time management.

## 2. Component Structure
- **Root**: `WorldMap.tsx`
- **Internal Modules**:
  - `Map Canvas`: SVG or Canvas-based nautical chart.
  - `City Nodes`: Interactive points representing cities.
  - `Fleet Icons`: Dynamic markers for player and AI ships.
  - `Floating UI Panels`: Treasury summary (left) and mini-market prices (right).
  - `Playback Console`: Time controls (Play/Pause, Speed x1/x2/x4).

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses the global `World` and `Fleet` states.
- **`useSimulationState()`**: Accesses the current game date and tick status.

### 3.2 Sinks (Engine Calls)
- `engine.engine.start() / .stop()`: Controls the SimulationServer timer.
- `engine.setTickRate(rate)`: Adjusts the speed of game time.
- `engine.moveFleet(fleetId, targetCityId)`: Initiates transit logic.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `isPlaying` | `boolean` | Simulation playback status. |
| `speedIndex` | `number` | Multiplier for tick frequency. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Hansa Nav] [Date: 15 Oct 1300] [Gold: 124,000g] [Menu]     |
+-------------------------------------------------------------+
|  ( ) Lubeck        ( ) Rostock        ( ) Danzig            |
|     \               /                  /                    |
|      \---[Ship]---/                   /                     |
|           ^                          /                      |
| [Stats]   |          NAUTICAL CHART /        [Quick Prices] |
| Pop: 50k  |          (The Baltic)  /         Grain: 4g      |
| Rep: 80%  |                       /          Beer:  12g     |
+-------------------------------------------------------------+
| Controls: [ << ] [ || ] [ >> ] [ x1 | x2 | x4 ]             |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Fog of War**: Cities not yet visited may appear with limited information.
- **Transit Visualization**: Ships move linearly between city coordinates stored in `database/cities.js`.
- **Interactivity**: Clicking a city node while a fleet is selected assigns a new destination.
