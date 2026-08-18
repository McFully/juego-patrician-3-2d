# PRODUCTION CHAINS

**Source files:** `src/database/factories.js`, `src/sim_engine/EconomySystems.ts`

---

## Overview

The production system consists of 19 factory types. Each factory consumes input goods and produces output goods per production cycle. Factories must be built (cost paid) and staffed with at least `minWorkers` workers to operate.

---

## Production Chains

### Primary Producers (No Inputs Required)

These factories produce goods from natural resources only:

#### Grain Farm (`farm`)
```
INPUT:  - (none)
OUTPUT: Grain × 12
Workers: 30-100
```

#### Vineyard (`vineyard`)
```
INPUT:  - (none)
OUTPUT: Wine × 8
Workers: 30-80
```
*Winter output: 50% (inactive in December, January, February)*

#### Sheep Farm (`sheep_farm`)
```
INPUT:  - (none)
OUTPUT: Wool × 10
Workers: 30-80
```

#### Hemp Farm (`hemp_farm`)
```
INPUT:  - (none)
OUTPUT: Hemp × 8
Workers: 30-70
```
*Winter output: 50%*

#### Apiary (`apiary`)
```
INPUT:  - (none)
OUTPUT: Honey × 5
        Wax × 4
Workers: 30-60
```
*Winter output: 50%*

---

### Food Processing Chains

#### Bakery (`bakery`)
```
INPUT:  Grain × 4
OUTPUT: Bread × 20
Ratio:  1 Grain → 5 Bread
Workers: 30-100
```

#### Brewery (`brewery`)
```
INPUT:  Grain × 3
        Timber × 1
OUTPUT: Beer × 15
Ratio:  (3 Grain + 1 Timber) → 15 Beer
Workers: 30-100
```

#### Butcher (`butcher`)
```
INPUT:  Grain × 2
OUTPUT: Meat × 6
Ratio:  2 Grain → 6 Meat (3:1)
Workers: 30-80
```

#### Whale Fishery (`whale_fishery`)
```
INPUT:  Salt × 13.068
        Hemp × 0.603
OUTPUT: Fish × 12
        Meat × 4
Workers: 30-50
Note: Only factory with fractional input amounts (precision values in source)
```

---

### Textile Chain

#### Weaver (`weaver`)
```
INPUT:  Wool × 3
OUTPUT: Cloth × 6
Ratio:  3 Wool → 6 Cloth (1:2)
Workers: 30-80
```

**Full textile chain:**
```
Sheep Farm → Wool → Weaver → Cloth
```

---

### Construction Material Chains

#### Sawmill (`sawmill`)
```
INPUT:  Timber × 5
OUTPUT: Timber × 8
Ratio:  5 Timber → 8 Timber (processing/refining, net +3)
Workers: 30-60
```

#### Brickworks (`brickworks`)
```
INPUT:  Timber × 2
OUTPUT: Bricks × 10
Workers: 30-100
```

#### Tarworks (`tarworks`)
```
INPUT:  Timber × 3
OUTPUT: Tar × 4
Workers: 30-60
```

---

### Metal & Tools Chains

#### Carpenter (`carpenter`)
```
INPUT:  Timber × 4
OUTPUT: Tools × 2
Ratio:  4 Timber → 2 Tools
Workers: 30-60
```

#### Smelter (`smelter`)
```
INPUT:  Iron × 4
        Timber × 2
OUTPUT: Tools × 3
Ratio:  (4 Iron + 2 Timber) → 3 Tools
Workers: 30-80
```

**Tools production comparison:**
- Carpenter: 4 Timber → 2 Tools
- Smelter: 4 Iron + 2 Timber → 3 Tools (higher yield but needs iron)

---

### Salt & Preservation Chains

#### Saltworks (`saltworks`)
```
INPUT:  Timber × 1
OUTPUT: Salt × 8
Workers: 30-80
```

#### Tannery (`tannery`)
```
INPUT:  Salt × 2
OUTPUT: Ropes × 3
Workers: 30-60
Note: Named "tannery" but produces ropes (not leather)
```

**Rope chain:**
```
Saltworks → Salt → Tannery → Ropes
```

---

### Artisan Chains

#### Chandler (`chandler`)
```
INPUT:  Wax × 2
OUTPUT: Candles × 5
Workers: 30-50
```

**Full candle chain:**
```
Apiary → Wax → Chandler → Candles
```

#### Potter (`potter`)
```
INPUT:  Timber × 1
OUTPUT: Pottery × 6
Workers: 30-60
```

---

## Dependency Graph

```
Grain Farm ──────────────────► Grain ──► Bakery ──► Bread
                                     ├──► Brewery ──► Beer (+ Timber)
                                     └──► Butcher ──► Meat

Sheep Farm ──────────────────► Wool ───► Weaver ──► Cloth

Hemp Farm ───────────────────► Hemp ──┐
                                       └─► Whale Fishery ──► Fish + Meat (+ Salt)

Vineyard ────────────────────► Wine

Apiary ──────────────────────► Honey
                             └──► Wax ──► Chandler ──► Candles

Saltworks ──► Salt ──────────► Tannery ──► Ropes
                            └─► (Whale Fishery input)

Timber ──────────────────────► Sawmill (refines) ──► Timber (processed)
                             ├─► Brewery (input)
                             ├─► Brickworks ──► Bricks
                             ├─► Tarworks ──► Tar
                             ├─► Carpenter ──► Tools
                             ├─► Smelter (partial) ──► Tools
                             └─► Potter ──► Pottery

Iron ────────────────────────► Smelter (primary) ──► Tools
```

---

## Production Modifiers

### Seasonal Modifiers (`src/database/factories.js`)

Winter months = December (12), January (1), February (2):

| Factory | Winter Multiplier |
|---|---|
| `farm` | 0.67 (reduced grain harvest) |
| `vineyard` | 0.50 |
| `hemp_farm` | 0.50 |
| `apiary` | 0.50 |
| All others | 1.0 (no seasonal effect) |

### Regional Production Multiplier

Based on city's `production` property:

| City Production | Multiplier |
|---|---|
| `low` | 0.75 |
| `medium` | 1.0 |
| `high` | 1.15 |

### Agglomeration Bonus

Based on total number of factories built in a city:

| Factories Built | Bonus Multiplier |
|---|---|
| < 3 | 1.0 |
| 3-5 | 1.03 (+3%) |
| 6-8 | 1.06 (+6%) |
| ≥ 9 | 1.10 (+10%) |

### Combined Output Formula

```
effectiveOutput = baseOutput × seasonalModifier × regionalMultiplier × agglomerationBonus × (workers / maxWorkers)
```

---

## MoneyLender (EconomySystems.ts)

The `MoneyLender` class handles financial production (loan interest):

### Interest Rate Formula
```
baseRate = 0.05 + (weeks × 0.005)
rankDiscount = rankIndex × 0.005
interestRate = max(0.02, baseRate - rankDiscount)
totalToRepay = amount × (1 + interestRate)
```

### Loan Default Penalty
If player cannot repay at term end:
- Penalty = `totalToRepay × 0.10`
- Gold deducted immediately
- Loan extended by 1 week with `totalToRepay += penalty`

### Tavern - Sailor Hiring Cost
```
cost = count × 5 gold per sailor
```

### Tavern - Captain Hiring Cost
```
cost = 500 gold (flat hiring fee)
```
Captain stats: sailing 1-5, trading 1-5, combat 1-5, salary 100-300 gold/week.

### Cathedral - Reputation Gain
```
repIncrease = donationAmount / 1000
```
1 reputation point per 1,000 gold donated.

### Cathedral Upgrade Requirements

| Upgrade | Population Required | Cost |
|---|---|---|
| Chapel → Church | 2,000 | 10,000 gold (from city chest) |
| Church → Cathedral | 10,000 | 50,000 gold (from city chest) |
