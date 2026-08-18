# STATE MANAGEMENT

**Source files:** `src/store/gameStore.ts`, `src/store/types.ts`

---

## Overview

The project uses **Zustand v4** as its global state management library. The store is a single flat object (`GameStore`) that extends `GameState` with action methods. There is no slice architecture - all state and actions live in one `create()` call.

> **Important:** This Zustand store is the **UI display layer** store, not the simulation source of truth. The canonical game state lives inside `GameEngine` (`src/GameEngine.ts`). The `GameProvider` polls `engine.getGameState()` every 500ms and pushes the result into React state. The Zustand store holds only the UI-specific state that does not come from the engine (selected city, selected convoy, notification count, etc.).

---

## Type Definitions (`src/store/types.ts`)

### `Player`

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Player character name |
| `title` | `string` | Current title (e.g. "Governor") |
| `gold` | `number` | Current gold balance |
| `reputation` | `number` | Global reputation score |
| `fleetSize` | `number` | Number of ships owned |
| `tradeRoutes` | `number` | Number of active trade routes |
| `citiesUnlocked` | `number` | Number of accessible cities |
| `date` | `string` | In-game date string (display only) |
| `season` | `'spring' \| 'summer' \| 'autumn' \| 'winter'` | Current in-game season |

### `City`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique city identifier (lowercase, e.g. `'lubeck'`) |
| `name` | `string` | Display name (e.g. `'Lübeck'`) |
| `population` | `number` | City population count |
| `stability` | `number` | Stability index (0-100) |
| `hasWarehouse` | `boolean` | Whether player owns a warehouse here |
| `warehouseLevel` | `number` | Warehouse level (0 = none, 1+) |
| `resources` | `CityResource[]` | Goods available at this city's market |
| `buildings` | `Building[]` | Player buildings in this city |

### `CityResource`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Good identifier |
| `name` | `string` | Display name |
| `icon` | `string` | Material Symbols icon name |
| `production` | `number` | Units produced per tick (negative = net consumer) |
| `demand` | `number` | Units demanded per tick |
| `price` | `number` | Current market price |
| `inventory` | `number` | Current stock |

### `Building`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Building type identifier |
| `name` | `string` | Display name |
| `type` | `string` | Category: `'storage'`, `'production'`, etc. |
| `level` | `number` | Upgrade level |
| `icon` | `string` | Material Symbols icon name |
| `production?` | `number` | Output per tick (optional) |
| `consumption?` | `number` | Input per tick (optional) |

### `Convoy`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Convoy identifier (e.g. `'convoy-042'`) |
| `name` | `string` | Display name |
| `capacity` | `number` | Total cargo capacity in tons |
| `usedCapacity` | `number` | Currently used cargo |
| `speed` | `number` | Movement speed |
| `range` | `number` | Maximum range |
| `currentPort` | `string` | City name where currently docked |
| `stops` | `ConvoyStop[]` | Ordered list of route stops |
| `status` | `'docked' \| 'sailing' \| 'loading' \| 'idle'` | Current convoy state |

### `ConvoyStop`

| Field | Type | Description |
|---|---|---|
| `cityId` | `string` | City identifier |
| `cityName` | `string` | Display name |
| `order` | `number` | Position in route (1-based) |
| `buyThresholds` | `Record<string, number>` | Max buy price per good |
| `sellThresholds` | `Record<string, number>` | Min sell price per good |

### `TradeRoute`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Route identifier |
| `name` | `string` | Display name |
| `convoyId` | `string` | Associated convoy |
| `stops` | `string[]` | Ordered list of city IDs |
| `isActive` | `boolean` | Whether route is running |
| `profitMargin` | `number` | Calculated profit margin (%) |
| `totalValue` | `number` | Total cargo value (gold) |

### `GameState` (root state shape)

| Field | Type | Description |
|---|---|---|
| `player` | `Player` | Current player data |
| `cities` | `City[]` | All known cities |
| `convoys` | `Convoy[]` | All player convoys |
| `tradeRoutes` | `TradeRoute[]` | All defined trade routes |
| `currentCityId` | `string \| null` | Currently selected/viewed city |
| `selectedConvoyId` | `string \| null` | Currently selected convoy |
| `selectedRouteId` | `string \| null` | Currently selected route |
| `notifications` | `number` | Pending notification count |

---

## Initial State (`src/store/gameStore.ts`)

The store is bootstrapped with hardcoded default data for demonstration/preview purposes:

### Default Player
```ts
{
  name: 'Erik von Handel',
  title: 'Governor',
  gold: 12450,
  reputation: 72,
  fleetSize: 4,
  tradeRoutes: 3,
  citiesUnlocked: 6,
  date: 'October 15, 1452',
  season: 'autumn',
}
```

### Default Cities (3 seeded)

| City | Population | Stability | Warehouse Level | Resources |
|---|---|---|---|---|
| Lübeck | 2480 | 84 | 2 | Fish, Wood, Grain, Cloth |
| Visby | 1840 | 76 | 1 | Fine Salt, Hardwood, Iron Ore |
| Riga | 1620 | 68 | 0 (none) | Beeswax, Fur |

### Default Convoys (1 seeded)

| Field | Value |
|---|---|
| ID | `convoy-042` |
| Name | The Northern Star |
| Capacity | 800 t |
| Used Capacity | 295 t |
| Speed | 12 |
| Range | 1200 |
| Current Port | Lübeck |
| Status | `docked` |
| Stops | Lübeck → Visby → Riga |

### Default Trade Routes (1 seeded)

| Field | Value |
|---|---|
| ID | `route-001` |
| Name | Baltic Triangle |
| Convoy | `convoy-042` |
| Stops | lubeck → visby → riga |
| Active | `true` |
| Profit Margin | 14% |
| Total Value | 12,450 gold |

### Initial UI Selection
```ts
currentCityId: 'lubeck'
selectedConvoyId: 'convoy-042'
selectedRouteId: 'route-001'
notifications: 3
```

---

## Actions

All actions are defined inside the single `create()` call and are part of `GameStore`.

| Action | Signature | Description |
|---|---|---|
| `setPlayer` | `(player: Partial<Player>) => void` | Merges partial update into player state |
| `setCurrentCity` | `(cityId: string \| null) => void` | Sets the currently viewed city |
| `setSelectedConvoy` | `(convoyId: string \| null) => void` | Sets the selected convoy |
| `addGold` | `(amount: number) => void` | Adds gold to player balance |
| `deductGold` | `(amount: number) => boolean` | Deducts gold; returns `false` if insufficient |
| `updateCity` | `(cityId: string, updates: Partial<City>) => void` | Merges partial update into a specific city |
| `updateConvoy` | `(convoyId: string, updates: Partial<Convoy>) => void` | Merges partial update into a specific convoy |
| `toggleRouteActive` | `(routeId: string) => void` | Toggles `isActive` on a trade route |

### `deductGold` - Special Logic
```ts
deductGold: (amount) => {
  const state = get()
  if (state.player.gold < amount) return false  // guard against overdraft
  set({ player: { ...state.player, gold: state.player.gold - amount } })
  return true
}
```

---

## Selectors

There are **no custom selectors** defined in the store file itself. Components import `useGameStore` and destructure what they need:

```ts
const { player, cities, addGold } = useGameStore()
```

For engine-derived state (live simulation data), components use the custom hooks from `GameProvider`:
- `useGame()` - full context (engine, state, status, tick, isReady)
- `usePlayer()` - shorthand for `state?.player`
- `useSimulationState()` - shorthand for `state?.simulation`

---

## What is Global vs. Local

| Category | Where Stored | Notes |
|---|---|---|
| UI selection (currentCityId, etc.) | Zustand store | UI-only, no simulation impact |
| Player gold, reputation (display) | Zustand store (default data) | Overridden by engine state when game runs |
| Live simulation state | `GameProvider` React state | Polled from `GameEngine` every 500ms |
| Engine internals (markets, fleets, AI) | `GameEngine` class | Not in React/Zustand, accessed via `EngineAdapter` |
| Notifications count | Zustand store | Static default of 3 |
