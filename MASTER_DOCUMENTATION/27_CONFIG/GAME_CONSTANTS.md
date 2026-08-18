# GAME CONSTANTS

**Source files:** `src/sim_engine/types.ts`, `src/database/index.js`, `src/database/goods.js`

---

## Overview

Game constants are split across two locations:
- `src/database/goods.js` - Spanish-named goods (used by simulation)
- `src/database/index.js` - English-named goods + cities + ships + ranks (used as reference/UI data)

Both files define the same 20 goods but with different `name` fields. The `goods.js` file is imported by `Market.ts` for simulation pricing.

---

## Goods Catalog

All goods and their market parameters. Two volume types exist:
- **`barrel`** - 1 volumeUnit per barrel (dense goods)
- **`cargo`** - 10 volumeUnits per cargo unit (bulk goods)

Pricing formula: `P(S) = pMax - ((S - sMin) / (sMax - sMin)) * (pMax - pMin)`
- At `S ≤ sMin` → price is `pMax`
- At `S ≥ sMax` → price is `pMin`
- Between sMin and sMax → linear interpolation

| ID | Name (EN) | Volume | Vol. Units | pMin | pMax | sMin | sMax | baseCost |
|---|---|---|---|---|---|---|---|---|
| `beer` | Beer | barrel | 1 | 18 | 32 | 100 | 500 | 25 |
| `fish` | Fish | barrel | 1 | 15 | 28 | 80 | 400 | 20 |
| `meat` | Meat | barrel | 1 | 30 | 55 | 50 | 250 | 40 |
| `bread` | Bread | barrel | 1 | 8 | 16 | 200 | 800 | 12 |
| `grain` | Grain | cargo | 10 | 12 | 24 | 300 | 1200 | 18 |
| `wool` | Wool | cargo | 10 | 35 | 68 | 60 | 300 | 50 |
| `cloth` | Cloth | cargo | 10 | 55 | 100 | 40 | 200 | 75 |
| `wine` | Wine | barrel | 1 | 45 | 85 | 30 | 150 | 60 |
| `timber` | Timber | cargo | 10 | 10 | 20 | 400 | 1500 | 15 |
| `iron` | Iron Ore | cargo | 10 | 20 | 38 | 100 | 500 | 28 |
| `salt` | Salt | barrel | 1 | 14 | 26 | 150 | 600 | 20 |
| `honey` | Honey | barrel | 1 | 40 | 75 | 30 | 150 | 55 |
| `wax` | Wax | barrel | 1 | 25 | 48 | 50 | 250 | 35 |
| `hemp` | Hemp | cargo | 10 | 15 | 28 | 80 | 400 | 20 |
| `ropes` | Ropes | cargo | 10 | 30 | 55 | 40 | 200 | 40 |
| `tar` | Tar | barrel | 1 | 20 | 38 | 60 | 300 | 28 |
| `bricks` | Bricks | cargo | 10 | 8 | 16 | 500 | 2000 | 12 |
| `tools` | Tools | cargo | 10 | 50 | 95 | 30 | 150 | 70 |
| `candles` | Candles | barrel | 1 | 22 | 42 | 50 | 250 | 30 |
| `pottery` | Pottery | barrel | 1 | 12 | 24 | 100 | 500 | 18 |

### Market Initial Stock
At market creation, each good receives: `sMin + random(0, (sMax - sMin) * 0.3)` units.

---

## Ship Types

| ID | Name | Cargo | Crew Max | Draft | Speed | HP Max | Weapon Slots |
|---|---|---|---|---|---|---|---|
| `snaikka` | Snaikka | 250 | 20 | shallow | 8 | 40 | 1 |
| `crayer` | Crayer | 350 | 28 | shallow | 10 | 55 | 2 |
| `cog` | Cog | 550 | 45 | deep | 6 | 80 | 3 |
| `hulk` | Hulk | 700 | 55 | deep | 4 | 100 | 4 |

**Draft types:**
- `shallow` - can enter shallow-draft ports (e.g. Novgorod, Ladoga, Toruń, Köln)
- `deep` - requires deep-water port; cannot access shallow ports

---

## City Database

24 Hanseatic cities with map coordinates and production levels:

| ID | Name | X | Y | Draft | Production |
|---|---|---|---|---|---|
| `lubeck` | Lübeck | 600 | 350 | deep | high |
| `hamburg` | Hamburg | 550 | 380 | deep | high |
| `bremen` | Bremen | 520 | 410 | deep | medium |
| `rostock` | Rostock | 630 | 360 | deep | medium |
| `stralsund` | Stralsund | 660 | 370 | deep | medium |
| `gdansk` | Gdańsk | 720 | 380 | deep | high |
| `visby` | Visby | 700 | 320 | deep | medium |
| `riga` | Riga | 780 | 340 | deep | medium |
| `reval` | Reval | 800 | 330 | deep | low |
| `novgorod` | Novgorod | 850 | 310 | shallow | high |
| `ladoga` | Ladoga | 850 | 290 | shallow | low |
| `bergen` | Bergen | 480 | 280 | deep | high |
| `oslo` | Oslo | 500 | 300 | deep | medium |
| `torsberg` | Tønsberg | 520 | 310 | deep | low |
| `kopenhagen` | Kopenhagen | 620 | 400 | deep | medium |
| `malmo` | Malmö | 650 | 400 | deep | low |
| `stettin` | Stettin | 690 | 390 | deep | medium |
| `torun` | Toruń | 740 | 400 | shallow | medium |
| `elbing` | Elbing | 750 | 390 | deep | medium |
| `koln` | Köln | 480 | 460 | shallow | high |
| `magdeburg` | Magdeburg | 550 | 440 | deep | medium |
| `bristol` | Bristol | 350 | 450 | deep | medium |
| `london` | London | 380 | 440 | deep | high |
| `bruges` | Bruges | 430 | 470 | deep | high |

---

## Rank System

8 merchant ranks with gold and reputation requirements:

| Index | Title | Gold Required | Reputation Required |
|---|---|---|---|
| 0 | Shopkeeper | 0 | 0 |
| 1 | Trader | 5,000 | 10 |
| 2 | Merchant | 20,000 | 25 |
| 3 | Itinerant Merchant | 50,000 | 45 |
| 4 | Councillor | 100,000 | 70 |
| 5 | Patrician | 250,000 | 100 |
| 6 | Lord Mayor | 500,000 | 150 |
| 7 | Alderman | 1,000,000 | 200 |

---

## Factory Types (Summary)

All factories require a minimum of 30 workers and have a cap. Full production details in `10_PRODUCTION/PRODUCTION_CHAINS.md`.

| ID | Name | Min Workers | Max Workers |
|---|---|---|---|
| `bakery` | Bakery | 30 | 100 |
| `brewery` | Brewery | 30 | 100 |
| `butcher` | Butcher | 30 | 80 |
| `weaver` | Weaver | 30 | 80 |
| `carpenter` | Carpenter | 30 | 60 |
| `smelter` | Smelter | 30 | 80 |
| `sawmill` | Sawmill | 30 | 60 |
| `farm` | Grain Farm | 30 | 100 |
| `vineyard` | Vineyard | 30 | 80 |
| `sheep_farm` | Sheep Farm | 30 | 80 |
| `hemp_farm` | Hemp Farm | 30 | 70 |
| `apiary` | Apiary | 30 | 60 |
| `brickworks` | Brickworks | 30 | 100 |
| `saltworks` | Saltworks | 30 | 80 |
| `tannery` | Tannery | 30 | 60 |
| `tarworks` | Tar Works | 30 | 60 |
| `chandler` | Chandler | 30 | 50 |
| `potter` | Potter | 30 | 60 |
| `whale_fishery` | Whale Fishery | 30 | 50 |

---

## Sim Engine Types (`src/sim_engine/types.ts`)

### `Good` Interface
| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique good identifier |
| `name` | `string` | Display name |
| `volume` | `'barrel' \| 'cargo'` | Packaging type |
| `volumeUnits` | `number` | Units per package (1 or 10) |
| `pMin` | `number` | Minimum price (at stock ≥ sMax) |
| `pMax` | `number` | Maximum price (at stock ≤ sMin) |
| `sMin` | `number` | Low stock threshold |
| `sMax` | `number` | High stock threshold |
| `baseCost` | `number` | Base production cost |

### `Ship` Interface
| Field | Type | Description |
|---|---|---|
| `typeId` | `string` | Ship type key |
| `name` | `string` | Instance name |
| `ownerId` | `string` | Owner (player or AI id) |
| `hp / hpMax` | `number` | Current / max hull points |
| `crew / crewMax` | `number` | Current / max crew |
| `cargo` | `Record<string, number>` | Cargo by good ID |
| `cargoUsed / cargoCapacity` | `number` | Cargo fill levels |
| `upgradeLevel` | `number` | Ship upgrade tier |
| `weaponSlots` | `number` | Available weapon slots |
| `sabers / cannons` | `number` | Armed weapons |
| `currentCityId` | `string` | Current docked city |
| `targetCityId?` | `string` | Destination (if in transit) |
| `inTransit` | `boolean` | Currently sailing flag |
| `transitHours / transitTotalHours / transitProgress` | `number` | Transit state |
| `fightingSkill?` | `number` | Combat modifier |
| `captain?` | `any` | Assigned captain object |

### `Factory` Interface
| Field | Type | Description |
|---|---|---|
| `id` | `string` | Factory type key |
| `name` | `string` | Display name |
| `built` | `boolean` | Whether constructed |
| `workers / maxWorkers / minWorkers` | `number` | Staffing |
| `inputs` | `{ goodId, amount }[]` | Input goods per production cycle |
| `outputs` | `{ goodId, amount }[]` | Output goods per production cycle |
| `currentInputs / currentOutputs` | `Record<string, number>` | Running totals |

### `Player` Interface (sim_engine)
| Field | Type | Description |
|---|---|---|
| `name` | `string` | Character name |
| `gold` | `number` | Treasury |
| `rank` | `number` | Rank index (0-7) |
| `reputation` | `number` | Global reputation |
| `homeCityId` | `string` | Home city |
| `currentCityId` | `string` | Current city location |
| `reputationByCity` | `Record<string, number>` | Per-city reputation |
| `fleet` | `Ship[]` | Owned ships |
| `tradingOffices` | `Record<string, TradingOffice>` | Offices by city ID |
| `financialHistory` | `FinancialRecord[]` | Daily financial log |

### `TradingOffice` Interface
| Field | Type | Description |
|---|---|---|
| `built` | `boolean` | Constructed flag |
| `managerHired` | `boolean` | Auto-trade manager hired |
| `autoBuyRules` | `Record<string, any>` | Auto-buy thresholds |
| `autoSellRules` | `Record<string, any>` | Auto-sell thresholds |
| `reserves` | `Record<string, number>` | Reserved stock (no-sell) |
| `storageLimit` | `number` | Max inventory |
| `inventory` | `Record<string, number>` | Current stock |
| `budget` | `number` | Auto-trade budget |

### `CityEvents` Interface
| Field | Type | Description |
|---|---|---|
| `plague` | `boolean` | Plague event active |
| `fire` | `boolean` | Fire event active |
| `siege` | `boolean` | Siege event active |
| `famine` | `boolean` | Famine event active |

### Financial Record
| Field | Type | Description |
|---|---|---|
| `day` | `number` | Day number |
| `gold` | `number` | Treasury at end of day |
| `revenue` | `number` | Income that day |
| `expenses` | `number` | Expenses that day |
