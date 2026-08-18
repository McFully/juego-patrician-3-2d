# AI SYSTEM: AGENTS & BEHAVIOR

## 1. Overview
The project uses a **Multi-Agent System** to simulate competing merchants. AI agents follow the same rules as the player: they own ships, buy/sell goods, and build offices.

## 2. Agent Archetypes
- **The Aggressive Trader**: Focuses on high-volume, low-margin goods (Grain, Timber).
- **The Luxury Merchant**: Trades only high-value items (Cloth, Wine, Spices).
- **The Industrialist**: Builds massive factory chains and sells only finished products.
- **The Pirate**: Does not trade; spawns in sea lanes to intercept merchant convoys.

## 3. Decision Making Loop
Calculated in `AISystem.ts` (often offloaded to `AIWorker.js`).

1. **Market Evaluation**: Scan all reachable cities for high price differences.
2. **Profitability Check**: Calculate (SellPrice - BuyPrice) * CargoCapacity - TransitCosts.
3. **Task Generation**: If profit > threshold, create a "Trade Task".
4. **Execution**: The agent moves their fleet to City A, buys, moves to City B, sells.

## 4. Pathfinding
AI ships calculate the shortest path between cities using a coordinate-based distance matrix (from `database/cities.js`). They account for:
- **Wind Speed**: (Simulated factor).
- **Pirate Activity**: AI agents avoid zones with recent combat reports.

## 5. Balancing
AI agents have "Cheating Levels" defined in `game_constants.json`:
- **Easy**: AI has limited gold and moves slowly.
- **Hard**: AI has unlimited starting capital and ignores certain reputation requirements for building.
