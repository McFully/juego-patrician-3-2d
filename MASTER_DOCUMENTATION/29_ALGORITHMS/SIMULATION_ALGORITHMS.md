# SIMULATION ALGORITHMS

**Source files:** `src/sim_engine/AISystem.ts`, `src/sim_engine/DynamicMissions.ts`, `src/sim_engine/Market.ts`

---

## 1. Market Pricing Algorithm (`Market.ts`)

### Pricing Function: `pricePerUnit(goodDef, currentStock)`

The market uses a **continuous linear interpolation** pricing model. Price depends on current stock level:

```
P(S) = pMax - ((S - sMin) / (sMax - sMin)) × (pMax - pMin)

Where:
  S    = current stock
  sMin = low stock threshold (high price zone boundary)
  sMax = high stock threshold (low price zone boundary)
  pMin = price at maximum stock
  pMax = price at minimum stock
```

Boundary conditions:
- `S ≤ sMin` → price = `pMax` (maximum price, scarce)
- `S ≥ sMax` → price = `pMin` (minimum price, abundant)
- `sMin < S < sMax` → linear interpolation

**Example (Grain):** `pMin=12, pMax=24, sMin=300, sMax=1200`
- At stock 300 → price = 24 gold
- At stock 750 → price = 18 gold (midpoint)
- At stock 1200 → price = 12 gold

---

### Buy Cost: `totalBuyCost(goodDef, currentStock, quantity)`

**Unit-by-unit marginal cost simulation:**

```
total = 0
simStock = currentStock
for i in range(quantity):
    unitPrice = pricePerUnit(goodDef, simStock)
    total += unitPrice
    simStock -= 1
return { total, endStock: simStock }
```

Each unit purchased reduces stock by 1, which raises the price for subsequent units. This creates a natural **price impact** for large purchases.

---

### Sell Revenue: `totalSellRevenue(goodDef, currentStock, quantity)`

Mirror of buy: each unit sold increases stock, decreasing price for subsequent units:

```
total = 0
simStock = currentStock
for i in range(quantity):
    unitPrice = pricePerUnit(goodDef, simStock)
    total += unitPrice
    simStock += 1
return { total, endStock: simStock }
```

---

### Market Initialization

At `new Market()`:
```
initialStock = sMin + random(0, (sMax - sMin) × 0.3)
```
Each good starts at between `sMin` and `sMin + 30%` of the range - in the "moderately scarce" zone (higher price region).

---

### Market Class Methods

| Method | Description |
|---|---|
| `getPrice(goodId)` | Returns current price for 1 unit |
| `buy(goodId, quantity)` | Removes stock, returns `{ cost, quantity }` or null |
| `sell(goodId, quantity)` | Adds stock, returns `{ revenue, quantity }` or null |
| `addStock(goodId, amount)` | Directly adds stock (production, delivery) |
| `removeStock(goodId, amount)` | Removes exact amount; returns false if insufficient |
| `removeStockPartial(goodId, amount)` | Removes up to `amount`, returns actual removed |

---

## 2. AI Trading System (`AISystem.ts`)

### FleetManager: Route-Based Trading

AI fleets operate on **hub-and-spoke routes** with fixed trade rules:

#### Route Structure
```ts
Route {
  fleetId: string
  stops: string[]           // ordered city IDs
  currentStopIndex: number  // which stop to visit next
  tradeRules: {
    buy: { goodId: maxBuyPrice }   // buy if market price ≤ maxBuyPrice
    sell: { goodId: minSellPrice } // sell if market price ≥ minSellPrice
  }
  active: boolean
  portStopHours: 6          // immutable: 6 hours per port visit
}
```

#### Fleet Movement Algorithm (`processFleetMove`)

```
For each ship in fleet:
  if ship.inTransit:
    advance transit by portStopHours (6h)
    if arrived:
      executeTradeAtStop(ship, world, route)
      currentStopIndex = (currentStopIndex + 1) % stops.length
  else:
    nextCityId = stops[currentStopIndex]
    if nextCityId != ship.currentCityId:
      travelHours = calculateTravelHours(ship, from, to, world)
      ship.setTarget(nextCityId, travelHours)
```

#### Travel Time Calculation

```
distance = sqrt((from.x - to.x)² + (from.y - to.y)²)
travelHours = max(1, ceil(distance / ship.speed))
```
Uses Euclidean distance on the 2D world map coordinate space.

#### Trade Execution at Stop (`executeTradeAtStop`)

```
For each (goodId, maxBuyPrice) in route.tradeRules.buy:
  currentPrice = city.market.getPrice(goodId)
  if currentPrice ≤ maxBuyPrice AND ship.cargoFree > 0:
    qty = min(10, ship.cargoFree)
    city.market.buy(goodId, qty)
    ship.loadCargo(goodId, qty)

For each (goodId, minSellPrice) in route.tradeRules.sell:
  currentPrice = city.market.getPrice(goodId)
  if currentPrice ≥ minSellPrice AND ship.cargo[goodId] > 0:
    qty = min(ship.cargo[goodId], 10)
    ship.unloadCargo(goodId, qty)
    city.market.sell(goodId, qty)
```

Trade amounts are capped at **10 units per stop per good** to prevent market flooding.

---

### AISystem: Competitor Agent Behavior

#### `processDaily()` - Per-Agent Daily Loop

For each active AI competitor:

**1. Market Evaluation**
```
agent.evaluateMarket(world)   // defined in AICompetitor (data_models/Player)
```

**2. Housing Construction**
```
if city.housingOccupancyPoor > 0.95 AND agent.gold > 2000:
    city.housingPoor += 1
    agent.gold -= 500

if city.housingOccupancyMiddle > 0.95 AND agent.gold > 5000:
    city.housingMiddle += 1
    agent.gold -= 1500

if city.housingOccupancyRich > 0.95 AND agent.gold > 10000:
    city.housingRich += 1
    agent.gold -= 4000
```

Housing thresholds and costs:
| Housing Type | Occupancy Trigger | Construction Cost |
|---|---|---|
| Poor housing | > 95% | 500 gold |
| Middle housing | > 95% | 1,500 gold |
| Rich housing | > 95% | 4,000 gold |

**3. Fleet Expansion**
```
if agent.gold > 50000 AND agent.fleet.length < 10:
    build Kogge ship (typeId: 'kogge')
    agent.gold -= 15000
    agent.fleet.push(newShip)
```
AI agents cap their fleet at 10 ships. Expansion costs 15,000 gold and is triggered when gold > 50,000.

**4. Market Manipulation**
```
if agent.dailyRoutine.action === 'buy':
    goodId = agent.dailyRoutine.goodId
    if marketGood.stock ≤ 100:
        city.market.buy(goodId, min(50, marketGood.stock))
```
Agents with a `buy` daily routine will purchase goods when stock falls below 100 units (up to 50 units at a time).

---

### AICompetitor Creation

```ts
createAgent(id, name, homeCityId, aggression = 1): AICompetitor
```

Parameters:
- `aggression` - trade aggressiveness multiplier (default 1)
- New agents are added to `this.agents[]` and processed in the daily loop

---

## 3. Dynamic Mission System (`DynamicMissions.ts`)

### Mission Templates

5 mission types are defined:

| ID | Name | Type | Difficulty | Repeatable | Time Limit |
|---|---|---|---|---|---|
| `hunt_pirates` | Cazar Piratas | combat | 1 | ✓ | 60 days |
| `found_city` | Fundar Ciudad | city building | 3 | ✗ | 180 days |
| `create_land_route` | Ruta Terrestre | trade | 2 | ✓ | 90 days |
| `deliver_grain` | Entrega de Emergencia | delivery | 1 | ✓ | 14 days |
| `build_wonder` | Obra Maestra | construction | 3 | ✗ | 365 days |

### Requirements Gating

```
canAcceptMission(template):
  if req.rank AND player.rank < req.rank → reject
  if req.reputation AND player.reputation < req.reputation → reject
  if req.gold AND player.gold < req.gold → reject
  return true
```

| Mission | Min Rank | Min Rep | Min Gold |
|---|---|---|---|
| `hunt_pirates` | 2 | 20 | - |
| `found_city` | 5 | 100 | 200,000 |
| `create_land_route` | 3 | 50 | - |
| `deliver_grain` | 1 | - | - |
| `build_wonder` | 6 | 150 | 500,000 |

### Mission Generation Algorithm

```
generateAvailableMissions():
  for template in missionTemplates:
    if NOT repeatable AND already completed → skip
    if canAcceptMission(template) → add to available list
  return available
```

### Mission Start - Special Setup

**`deliver_grain`:** Target city is selected by finding cities with famine events or grain stock < 100. Falls back to random city.

**`create_land_route`:** Both `fromCity` and `toCity` are randomly selected from shallow-draft cities (inland accessible). Prevents same-city routes.

**`found_city`:** Creates a `CityFoundingProject` with fixed target:
- City name: `'Nueva Hansa'`
- Coordinates: `x=750, y=300`
- Resource requirements: Bricks×200, Timber×100, Tools×50, Grain×100
- Construction time: 90 days

### Mission Progress: `processDaily()`

**Time Limit Check:**
```
elapsed = totalDays - mission.startedAt
if elapsed > mission.timeLimit → mission.status = 'failed'
```

**Progress by Type:**

`found_city` - Three-phase progression:
```
Phase 1 (accumulation):
  Check if all targetResources met
  If all met → phase = 'construction'

Phase 2 (construction):
  daysInConstruction++
  If daysInConstruction >= 90:
    phase = 'completed'
    Spawn new city in world
    Initial population: poor=200, middle=50, rich=10, beggar=20

Phase 3 (completed):
  Track spawned city's totalPopulation
  Complete when population >= 1000
```

`create_land_route`:
```
If player has tradingOffices in BOTH fromCity AND toCity:
  routeBuilt = true
```

`deliver_grain`: Progress updated via `onGrainSold(cityId, amount)` event hook.

`hunt_pirates`: Progress updated via `onPirateKilled()` event hook.

`build_wonder`: Progress updated via `onBuildingUpgraded(cityId, type, level)` event hook.

### Mission Completion

```
completeMission(mission):
  mission.status = 'completed'
  player.gold += rewards.gold
  player.reputation += rewards.reputation
  push to completedMissions
  return { completed: true, rewards }
```

Mission rewards:

| Mission | Gold Reward | Rep Reward | Rank XP | Special |
|---|---|---|---|---|
| `hunt_pirates` | 50,000 | 20 | 100 | - |
| `found_city` | 100,000 | 50 | 500 | - |
| `create_land_route` | 30,000 | 15 | 200 | - |
| `deliver_grain` | 20,000 | 15 | 50 | - |
| `build_wonder` | 0 | 100 | 1,000 | `alderman_credit` |

### Mission Cooldown

```
generationCooldown: number  // days before new missions can generate
```
The cooldown field exists but its reset logic is not visible in the current source (managed elsewhere in `GameEngine`).

---

## 4. Integration Points

| Event | Source | Handler |
|---|---|---|
| Pirate fleet destroyed | Combat system | `missionManager.onPirateKilled()` |
| Grain sold to city | Market system | `missionManager.onGrainSold(cityId, amount)` |
| City founded | City founding | `missionManager.onCityFounded(cityId, population)` |
| Building upgraded | Town hall system | `missionManager.onBuildingUpgraded(cityId, type, level)` |
| AI agent daily tick | `SimulationServer` | `aiSystem.processDaily()` |
| Fleet movement | `SimulationServer` | `fleetManager.processFleetMove(fleet, world)` |
