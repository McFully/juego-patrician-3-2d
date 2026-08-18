# DIRECTORY STRUCTURE (SRC)

```text
src/
├── main.tsx              # Application Entry Point
├── App.tsx               # Main Router and Layout
├── GameEngine.ts         # Core Simulation Orchestrator
├── ScalableGameEngine.js # High-performance variant
│
├── client_ui/            # Legacy or Specialized UI assets
│   ├── audio.js          # Audio manager
│   ├── graphics.js       # Procedural graphics logic
│   └── screens/          # Legacy JS screens
│
├── components/           # Reusable React components
│   ├── layout/           # Sidebars, Navbars, Page Wrappers
│   └── ui/               # Atomic UI (Button, Card, Modal)
│
├── core/                 # Engine Infrastructure
│   ├── SimulationServer.js # Tick management and World holder
│   └── SaveManager.js    # Persistence logic
│
├── database/             # Static Game Data
│   ├── cities.js         # City definitions and coordinates
│   ├── goods.js          # Good definitions and base prices
│   └── index.js          # Database exporter
│
├── data_models/          # Entity classes
│   ├── Player.ts         # Player state and fleet
│   └── Ship.ts           # Ship properties and cargo
│
├── engine/               # Bridge between Engine and React
│   ├── engineAdapter.ts  # Type-safe API
│   └── GameProvider.tsx  # React Context Provider
│
├── screens/              # 40+ Application Screens (React)
│   ├── MarketHall.tsx
│   ├── TitleScreen.tsx
│   └── ... (see SCREEN_MAP.md)
│
├── sim_engine/           # Pure Simulation Logic
│   ├── EconomySystems.ts # Supply/Demand formulas
│   ├── AISystem.ts      # Merchant agent behavior
│   └── DODEngine.ts     # Data-Oriented performance layer
│
├── store/                # Zustand stores
│   └── gameStore.ts      # UI state persistence
│
├── workers/              # Background processes
│    └── AIWorker.js      # Parallel AI calculations
```
