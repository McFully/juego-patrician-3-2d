# BUILDING CATALOG

**Source files:** `src/database/factories.js`, `src/database/index.js`

---

## Overview

The game has one category of player-buildable structures: **factories** (production buildings). Infrastructure buildings (warehouses, wells, hospitals, bath houses, walls) are tracked per-city as simple boolean/integer flags and are not listed in the factory catalog.

All factories share the same base structure:
- Built one per city (no duplicates)
- Require a minimum of **30 workers** to operate
- Have a maximum worker cap
- Are initially `built: false`, `workers: 0`

---

## Factory Catalog

### Food Production

#### Bakery (`bakery`)
| Property | Value |
|---|---|
| ID | `bakery` |
| Display Name | Panadería (ES) / Bakery (EN) |
| Min Workers | 30 |
| Max Workers | 100 |
| Input | Grain × 4 per cycle |
| Output | Bread × 20 per cycle |
| Notes | High bread yield; grain-dependent |

#### Brewery (`brewery`)
| Property | Value |
|---|---|
| ID | `brewery` |
| Display Name | Cervecería (ES) / Brewery (EN) |
| Min Workers | 30 |
| Max Workers | 100 |
| Input | Grain × 3 + Timber × 1 per cycle |
| Output | Beer × 15 per cycle |
| Notes | Requires both grain and timber |

#### Butcher (`butcher`)
| Property | Value |
|---|---|
| ID | `butcher` |
| Display Name | Carnicería (ES) / Butcher (EN) |
| Min Workers | 30 |
| Max Workers | 80 |
| Input | Grain × 2 per cycle |
| Output | Meat × 6 per cycle |
| Notes | Efficient grain-to-protein converter |

#### Whale Fishery (`whale_fishery`)
| Property | Value |
|---|---|
| ID | `whale_fishery` |
| Display Name | Pesquería de Ballenas (ES) / Whale Fishery (EN) |
| Min Workers | 30 |
| Max Workers | 50 |
| Input | Salt × 13.068 + Hemp × 0.603 per cycle |
| Output | Fish × 12 + Meat × 4 per cycle |
| Notes | Only dual-output factory; fractional input values; low worker cap |

---

### Agricultural

#### Grain Farm (`farm`)
| Property | Value |
|---|---|
| ID | `farm` |
| Display Name | Granja de Grano (ES) / Grain Farm (EN) |
| Min Workers | 30 |
| Max Workers | 100 |
| Input | None |
| Output | Grain × 12 per cycle |
| Notes | Primary staple producer; 67% output in winter |

#### Vineyard (`vineyard`)
| Property | Value |
|---|---|
| ID | `vineyard` |
| Display Name | Viñedo (ES) / Vineyard (EN) |
| Min Workers | 30 |
| Max Workers | 80 |
| Input | None |
| Output | Wine × 8 per cycle |
| Notes | 50% output in winter |

#### Sheep Farm (`sheep_farm`)
| Property | Value |
|---|---|
| ID | `sheep_farm` |
| Display Name | Granja Ovina (ES) / Sheep Farm (EN) |
| Min Workers | 30 |
| Max Workers | 80 |
| Input | None |
| Output | Wool × 10 per cycle |
| Notes | No seasonal penalty |

#### Hemp Farm (`hemp_farm`)
| Property | Value |
|---|---|
| ID | `hemp_farm` |
| Display Name | Plantación de Cáñamo (ES) / Hemp Farm (EN) |
| Min Workers | 30 |
| Max Workers | 70 |
| Input | None |
| Output | Hemp × 8 per cycle |
| Notes | 50% output in winter |

#### Apiary (`apiary`)
| Property | Value |
|---|---|
| ID | `apiary` |
| Display Name | Colmenar (ES) / Apiary (EN) |
| Min Workers | 30 |
| Max Workers | 60 |
| Input | None |
| Output | Honey × 5 + Wax × 4 per cycle |
| Notes | Dual output; 50% output in winter |

---

### Textiles

#### Weaver (`weaver`)
| Property | Value |
|---|---|
| ID | `weaver` |
| Display Name | Telar (ES) / Weaver (EN) |
| Min Workers | 30 |
| Max Workers | 80 |
| Input | Wool × 3 per cycle |
| Output | Cloth × 6 per cycle |
| Notes | Converts low-value wool into high-value cloth |

---

### Construction Materials

#### Sawmill (`sawmill`)
| Property | Value |
|---|---|
| ID | `sawmill` |
| Display Name | Aserradero (ES) / Sawmill (EN) |
| Min Workers | 30 |
| Max Workers | 60 |
| Input | Timber × 5 per cycle |
| Output | Timber × 8 per cycle |
| Notes | Processes raw timber into refined timber (net gain of 3 units) |

#### Brickworks (`brickworks`)
| Property | Value |
|---|---|
| ID | `brickworks` |
| Display Name | Ladrillera (ES) / Brickworks (EN) |
| Min Workers | 30 |
| Max Workers | 100 |
| Input | Timber × 2 per cycle |
| Output | Bricks × 10 per cycle |
| Notes | High demand for city construction |

#### Tarworks (`tarworks`)
| Property | Value |
|---|---|
| ID | `tarworks` |
| Display Name | Fábrica de Brea (ES) / Tar Works (EN) |
| Min Workers | 30 |
| Max Workers | 60 |
| Input | Timber × 3 per cycle |
| Output | Tar × 4 per cycle |
| Notes | Naval maintenance material |

---

### Metal & Tools

#### Carpenter (`carpenter`)
| Property | Value |
|---|---|
| ID | `carpenter` |
| Display Name | Carpintería (ES) / Carpenter (EN) |
| Min Workers | 30 |
| Max Workers | 60 |
| Input | Timber × 4 per cycle |
| Output | Tools × 2 per cycle |
| Notes | Basic tools production from timber only |

#### Smelter (`smelter`)
| Property | Value |
|---|---|
| ID | `smelter` |
| Display Name | Fundición (ES) / Smelter (EN) |
| Min Workers | 30 |
| Max Workers | 80 |
| Input | Iron × 4 + Timber × 2 per cycle |
| Output | Tools × 3 per cycle |
| Notes | Higher tools yield than carpenter; requires iron ore |

---

### Salt & Preserves

#### Saltworks (`saltworks`)
| Property | Value |
|---|---|
| ID | `saltworks` |
| Display Name | Salina (ES) / Saltworks (EN) |
| Min Workers | 30 |
| Max Workers | 80 |
| Input | Timber × 1 per cycle |
| Output | Salt × 8 per cycle |
| Notes | Salt is critical for food preservation and rope-making |

#### Tannery (`tannery`)
| Property | Value |
|---|---|
| ID | `tannery` |
| Display Name | Peletería (ES) / Tannery (EN) |
| Min Workers | 30 |
| Max Workers | 60 |
| Input | Salt × 2 per cycle |
| Output | Ropes × 3 per cycle |
| Notes | Named "tannery" in source but produces ropes, not leather |

---

### Artisan

#### Chandler (`chandler`)
| Property | Value |
|---|---|
| ID | `chandler` |
| Display Name | Candelero (ES) / Chandler (EN) |
| Min Workers | 30 |
| Max Workers | 50 |
| Input | Wax × 2 per cycle |
| Output | Candles × 5 per cycle |
| Notes | Converts apiary wax into candles |

#### Potter (`potter`)
| Property | Value |
|---|---|
| ID | `potter` |
| Display Name | Alfarero (ES) / Potter (EN) |
| Min Workers | 30 |
| Max Workers | 60 |
| Input | Timber × 1 per cycle |
| Output | Pottery × 6 per cycle |
| Notes | Fuel-fired kilns require timber |

---

## Summary Table

| ID | EN Name | Min W | Max W | Inputs | Outputs |
|---|---|---|---|---|---|
| `bakery` | Bakery | 30 | 100 | Grain×4 | Bread×20 |
| `brewery` | Brewery | 30 | 100 | Grain×3, Timber×1 | Beer×15 |
| `butcher` | Butcher | 30 | 80 | Grain×2 | Meat×6 |
| `weaver` | Weaver | 30 | 80 | Wool×3 | Cloth×6 |
| `carpenter` | Carpenter | 30 | 60 | Timber×4 | Tools×2 |
| `smelter` | Smelter | 30 | 80 | Iron×4, Timber×2 | Tools×3 |
| `sawmill` | Sawmill | 30 | 60 | Timber×5 | Timber×8 |
| `farm` | Grain Farm | 30 | 100 | - | Grain×12 |
| `vineyard` | Vineyard | 30 | 80 | - | Wine×8 |
| `sheep_farm` | Sheep Farm | 30 | 80 | - | Wool×10 |
| `hemp_farm` | Hemp Farm | 30 | 70 | - | Hemp×8 |
| `apiary` | Apiary | 30 | 60 | - | Honey×5, Wax×4 |
| `brickworks` | Brickworks | 30 | 100 | Timber×2 | Bricks×10 |
| `saltworks` | Saltworks | 30 | 80 | Timber×1 | Salt×8 |
| `tannery` | Tannery | 30 | 60 | Salt×2 | Ropes×3 |
| `tarworks` | Tar Works | 30 | 60 | Timber×3 | Tar×4 |
| `chandler` | Chandler | 30 | 50 | Wax×2 | Candles×5 |
| `potter` | Potter | 30 | 60 | Timber×1 | Pottery×6 |
| `whale_fishery` | Whale Fishery | 30 | 50 | Salt×13.068, Hemp×0.603 | Fish×12, Meat×4 |

---

## Infrastructure Buildings (Non-Factory)

These are tracked as city-level flags, not as factory objects:

| Building | Type | Field |
|---|---|---|
| Warehouse | Storage | `hasWarehouse: boolean`, `warehouseLevel: number` |
| Well | Infrastructure | `hasWell: boolean` |
| Hospital | Infrastructure | `hasHospital: boolean` |
| Bath House | Infrastructure | `hasBathHouse: boolean` |
| City Walls | Defense | `wallLevel: number` (0 = none) |
| Trading Office | Commerce | `player.tradingOffices[cityId]` |

---

## Notes on Build System

- Build cost is not defined in `factories.js` or `index.js`. The construction cost is implemented in `GameEngine.buildFactory()` (see `src/GameEngine.ts`).
- `buildFactory(factoryId)` in the engine ignores the `cityId` parameter (noted as "ignored in original engine" in `engineAdapter.ts`).
- The `FACTORIES` array in `index.js` only stores `{ id, name, minWorkers }` - abbreviated version without full production data.
- Full production data (inputs/outputs) is only in `factories.js`.
