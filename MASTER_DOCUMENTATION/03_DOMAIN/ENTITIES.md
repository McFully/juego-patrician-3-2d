# DOMAIN ENTITIES: DATA MODELS

## 1. Player (`data_models/Player.ts`)
Represents the human player's state.

| Field | Type | Description |
|---|---|---|
| `name` | string | Player's chosen name. |
| `gold` | number | Current liquid currency. |
| `rank` | number | Rank index (0-7). |
| `reputation` | number | Global reputation. |
| `homeCityId` | string | City where the player is a citizen. |
| `currentCityId` | string | Current location of the player avatar. |
| `fleet` | Ship[] | Array of ships owned by the player. |
| `tradingOffices` | Map | Keyed by cityId. Status of offices and warehouses. |
| `financialHistory` | Array | 12-week rolling window of revenue/expenses. |

## 2. Ship (`data_models/Ship.ts`)
Represents a single vessel.

| Field | Type | Description |
|---|---|---|
| `typeId` | string | `snaikka`, `crayer`, `cog`, `holk`. |
| `name` | string | Custom ship name. |
| `cargo` | Object | Map of `{ goodId: quantity }`. |
| `cargoCapacity` | number | Max units (based on ship type). |
| `hp` | number | Current structural integrity. |
| `crew` | number | Current sailors on board. |
| `upgradeLevel` | number | 0-3 (affects combat stats). |
| `inTransit` | boolean | If currently moving between cities. |
| `transitProgress`| number | 0.0 to 1.0 based on distance. |

## 3. City (`sim_engine/City.ts`)
The primary simulation node.

| Sub-System | Description |
|---|---|
| **Market** | Manages stock, prices, and buy/sell operations. |
| **Population** | Tracks Poor, Middle, and Wealthy counts. |
| **Factories** | Array of production buildings. |
| **Tavern** | Hiring pool for sailors and captains. |
| **Cathedral** | Donation and prestige tracking. |
| **MoneyLender** | Loan generation and repayment logic. |

## 4. Trading Office (`data_models/TradingOffice.js`)
Player presence in a city.

| Field | Description |
|---|---|
| `built` | boolean status. |
| `managerHired` | Enables automated buying/selling. |
| `inventory` | Stock currently in the office warehouse. |
| `autoBuyRules` | Rules for the manager to buy from market. |
| `autoSellRules` | Rules for the manager to sell to market. |

## 5. Relationships
- **Player** *owns* **Ships** and **TradingOffices**.
- **TradingOffices** *exist in* **Cities**.
- **Ships** *trade with* **Cities** or *transit* between them.
- **AI Agents** *simulate* **Player** behavior using identical entities.
