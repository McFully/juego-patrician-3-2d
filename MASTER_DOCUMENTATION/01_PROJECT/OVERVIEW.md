# PROJECT OVERVIEW: Patrician 3 2D

## 1. Identity
**Patrician 3 2D** is a spiritual successor and 2D reconstruction of the classic trading simulation "Patrician III". It focuses on the Hanseatic League in the late Middle Ages, combining economic simulation, political progression, naval combat, and city building.

## 2. Core Vision
The project aims to replicate the depth of the original game's simulation (production chains, city growth, political ranks) within a modern, scalable web-based architecture (React/TS).

## 3. Architecture Summary
The application follows a **Decoupled Engine-UI Architecture**:
- **Simulation Layer**: A headless, tick-based engine that calculates the world state independently of the frame rate.
- **Presentation Layer**: A React-based UI that observes the engine's state and renders screens according to the current location and context of the player.
- **Adaptation Layer**: An `EngineAdapter` that provides type-safe methods and state hooks for React to interact with the Simulation.

## 4. Key Systems
- **World Simulation**: Cities have populations, production, and demand.
- **Dynamic Economy**: Prices fluctuate based on supply and demand, influenced by production events and player/AI trade.
- **AI Agents**: Competitive merchants that trade between cities using the same rules as the player.
- **Political Hierarchy**: Ranks from Shopkeeper to Alderman, requiring reputation and wealth.
- **Naval Combat**: Encounter system for pirates and hostile convoys.

## 5. Implementation Status
The project features over 40 functional screens covering:
- Trading (Market, Office, Warehouse).
- Production (Foundries, Mills, etc.).
- City Services (Cathedral, Bath House, Tavern, Money Lender).
- World Interaction (Map, Convoys, Shipyard).
- Meta (Title Screen, Save/Load, Career Settings).
