# STATE ARCHITECTURE - Data Flow: Engine → Store → UI

**Source files:** `src/engine/GameProvider.tsx`, `src/engine/engineAdapter.ts`, `src/store/gameStore.ts`

---

## Overview

The application has **two parallel state systems** that serve different purposes:

1. **`GameEngine` (simulation state)** - the canonical source of truth for all game mechanics. Runs independently in a `SimulationServer` loop.
2. **Zustand store (UI state)** - display-only state, seeded with demo defaults; holds UI selections.

These two systems are bridged by `GameProvider` + `EngineAdapter`.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME ENGINE LAYER                       │
│                                                                 │
│  GameEngine (src/GameEngine.ts)                                 │
│  ├── SimulationServer (tick loop, event bus)                    │
│  ├── World (cities, market, population)                         │
│  ├── Player (gold, fleet, tradingOffices)                       │
│  ├── AISystem (competitor agents)                               │
│  ├── MoneyLender (loans)                                        │
│  ├── Tavern (sailors, captains)                                 │
│  ├── DynamicMissionManager (missions)                           │
│  └── SaveManager (persistence)                                  │
│                                                                 │
│  ┌──────────────────────────────────┐                           │
│  │  SimulationServer.eventBus       │  ← emits: tick,           │
│  │  (Node EventEmitter-style)       │     trade_buy, trade_sell, │
│  └──────────────────────────────────┘     encounter_start, etc. │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    EngineAdapter (src/engine/engineAdapter.ts)
                    Thin façade over GameEngine
                    ├── Exposes action methods
                    ├── Forwards events from engine.server.eventBus
                    ├── getState() → engine.getGameState()
                    └── getStatus() → engine.getGameStatus()
                             │
                             │ created once, held in useRef
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       REACT BRIDGE LAYER                        │
│                                                                 │
│  GameProvider (src/engine/GameProvider.tsx)                     │
│  ├── adapterRef: useRef<EngineAdapter>                          │
│  ├── state: React.useState  ← adapter.getState() every 500ms   │
│  ├── status: React.useState ← adapter.getStatus() every 500ms  │
│  ├── tick: React.useState   ← incremented on 'tick' event       │
│  └── isReady: React.useState                                    │
│                                                                 │
│  Polling interval: 500ms via setInterval                        │
│  Event listeners: tick, game_start, trade_buy, trade_sell,      │
│                   encounter_start (trigger audio via audioManager)│
│  Global click listener: plays click SFX on any button click     │
│                                                                 │
│  React Context: GameContext                                     │
│  ├── engine: EngineAdapter                                      │
│  ├── state: any (engine game state snapshot)                    │
│  ├── status: any (engine status snapshot)                       │
│  ├── tick: number (increments each engine tick)                 │
│  └── isReady: boolean                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │ React Context (useGame hook)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                         UI COMPONENT LAYER                      │
│                                                                 │
│  Screen Components (src/screens/*.tsx)                          │
│  ├── useGame()            → full engine context                 │
│  ├── usePlayer()          → state?.player                       │
│  ├── useSimulationState() → state?.simulation                   │
│  └── useGameStore()       → UI-only state (Zustand)             │
│                                                                 │
│  Actions dispatched via:                                        │
│  ├── engine.buyGood(...)      → engine.playerBuy()              │
│  ├── engine.sellGood(...)     → engine.playerSell()             │
│  ├── engine.buildFactory(...) → engine.buildFactory()           │
│  └── useGameStore().addGold() → local UI state only             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  PARALLEL: ZUSTAND UI STORE                     │
│                                                                 │
│  useGameStore (src/store/gameStore.ts)                          │
│  ├── player (display defaults - NOT engine state)               │
│  ├── cities (3 seeded cities - NOT engine state)                │
│  ├── convoys (1 seeded convoy - NOT engine state)               │
│  ├── tradeRoutes (1 seeded route - NOT engine state)            │
│  ├── currentCityId (UI navigation selection)                    │
│  ├── selectedConvoyId (UI navigation selection)                 │
│  ├── selectedRouteId (UI navigation selection)                  │
│  └── notifications (static default: 3)                          │
│                                                                 │
│  NOTE: Zustand store is NOT synced with GameEngine.             │
│  It holds demo defaults used by screens before/during engine    │
│  initialization and for UI-only state like city selection.      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Tick Cycle

```
Every engine tick (SimulationServer)
│
├── eventBus.emit('tick', { totalDays })
│     │
│     └── GameProvider listener:
│           setTick(t => t+1)
│           setState(adapter.getState())     ← snapshot of engine state
│           setStatus(adapter.getStatus())
│           audioManager.playTick()
│
├── Every 500ms (setInterval in GameProvider):
│     setState(adapter.getState())
│     setStatus(adapter.getStatus())
│
└── Components re-render via React Context
      └── useGame().state contains latest engine snapshot
```

---

## Data Flow: User Action

```
User clicks "Buy Grain"
│
├── Component calls: engine.buyGood('grain', 50)
│     │
│     └── EngineAdapter.buyGood(goodId, amount)
│           └── GameEngine.playerBuy('grain', 50)
│                 ├── Validates stock and gold
│                 ├── Updates market stock
│                 ├── Deducts player gold
│                 └── eventBus.emit('trade_buy', ...)
│
├── eventBus triggers:
│     └── GameProvider.on('trade_buy') → audioManager.playCoin()
│
└── Next 500ms poll:
      setState(adapter.getState())   ← updated gold/market reflected
      Components re-render
```

---

## EngineAdapter Interface

The adapter is a plain object (factory function, not class) wrapping `GameEngine`. All methods map 1:1 to engine methods:

| Adapter Method | Engine Method | Description |
|---|---|---|
| `startNewGame(playerName, homeCity)` | `engine.newGame(...)` | Initialize new game |
| `loadGame(saveName)` | `engine.loadGame(...)` | Load from localStorage |
| `saveGame(saveName)` | `engine.saveGame(...)` | Persist to localStorage |
| `buyGood(goodId, amount)` | `engine.playerBuy(...)` | Purchase goods at city market |
| `sellGood(goodId, amount)` | `engine.playerSell(...)` | Sell goods at city market |
| `setTickRate(rate)` | `engine.server.tickRate = 1000/rate` | Adjust simulation speed |
| `updateTradingOfficeRules(cityId, rules)` | Direct office mutation | Auto-trade configuration |
| `commissionShip(cityId, shipTypeId)` | `engine.buildShip(...)` | Build a new ship |
| `CONTRATARSailors(count, shipIndex)` | `engine.hireSailors(...)` | Hire crew |
| `CONTRATARCaptain(captainId, shipIndex)` | `engine.hireCaptain(...)` | Hire captain |
| `donateToCathedral(amount)` | `engine.donateToCathedral(...)` | Donate for reputation |
| `takeLoan(amount, weeks)` | `engine.takeLoan(...)` | Take a loan |
| `repayLoan(id)` | `engine.repayLoan(...)` | Repay existing loan |
| `bribeCouncillor(cityId, index, amount)` | `engine.bribeCouncillor(...)` | Political bribery |
| `setPlayerRoute(cityIds, options)` | `engine.setPlayerRoute(...)` | Define convoy route |
| `buildFactory(cityId, factoryId)` | `engine.buildFactory(...)` | Construct production building |
| `hireWorkers(factoryId, count)` | `engine.hireWorkers(...)` | Staff a factory |
| `resolveEncounter(action)` | `engine.resolveEncounter(...)` | Handle at-sea encounter |
| `startMission(missionId)` | `engine.startMission(...)` | Begin a mission |
| `buyWeapons(type, count, shipIndex)` | `engine.buyWeapons(...)` | Arm a ship |
| `repairShip(cityId, shipIndex)` | `engine.repairShip(...)` | Repair ship hull |
| `getState()` | `engine.getGameState()` | Full state snapshot |
| `getStatus()` | `engine.getGameStatus()` | Status snapshot |
| `on(event, cb)` | `engine.server.eventBus.on(...)` | Subscribe to engine events |
| `off(event, cb)` | Local listener list filter | Unsubscribe |

---

## Engine Events

Events emitted by `engine.server.eventBus`:

| Event | Trigger | GameProvider Handler |
|---|---|---|
| `tick` | Every simulation tick | Increment tick counter, poll state |
| `game_start` | New game initialized | `audioManager.playHorn()` |
| `trade_buy` | Player buys goods | `audioManager.playCoin()` |
| `trade_sell` | Player sells goods | `audioManager.playCoin()` |
| `encounter_start` | At-sea encounter | `audioManager.playHorn()` |

---

## Custom React Hooks

| Hook | Source | Returns |
|---|---|---|
| `useGame()` | `GameProvider.tsx` | `{ engine, state, status, tick, isReady }` |
| `usePlayer()` | `GameProvider.tsx` | `state?.player ?? null` |
| `useSimulationState()` | `GameProvider.tsx` | `state?.simulation ?? null` |
| `useGameStore()` | `gameStore.ts` (Zustand) | Full Zustand store |

---

## Initialization Sequence

```
1. App mounts → <GameProvider> renders
2. useEffect runs:
   a. createEngineAdapter() → new GameEngine()
   b. Register event listeners on eventBus
   c. Register global click listener (audio)
   d. setIsReady(true)
3. Second useEffect (depends on isReady):
   a. Start 500ms polling interval
4. GameContext provided to all children
5. Screens use useGame() to access engine state
6. Screens use useGameStore() for UI-only selections
```

---

## Key Architectural Decisions

| Decision | Rationale |
|---|---|
| Polling (500ms) instead of reactive store | Engine state is a complex JS class graph; Zustand cannot wrap it directly |
| EngineAdapter as thin façade | Decouples UI from internal engine API; easier to mock/test |
| Two parallel state systems | Zustand for simple UI state; React context for engine-derived data |
| `useRef` for adapter | Prevents re-creation on each render; adapter is a singleton per session |
| `useMemo` for context value | Prevents unnecessary re-renders when `state`/`status` objects change |
