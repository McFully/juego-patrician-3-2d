# Codebase Map

This document outlines the source directory structure, core module responsibilities, and components layout for Patrician 3 2D.

## Directory Overview

```
src/
├── client_ui/        # Legacy or decoupled UI components
├── components/       # Reusable layout and atomic UI elements
│   ├── layout/       # Navigation, bars, headers, grids
│   └── ui/           # Buttons, modals, panels, inputs
├── core/             # Central non-visual managers (SaveManager, ModSupport)
├── data_models/      # Data structures definitions
├── database/         # Static datasets (cities, goods, consumption, factories)
├── engine/           # State-to-UI adapter bindings and providers
├── hooks/            # Custom React hooks (hotkeys, common utilities)
├── locales/          # Localization resources (mainly Spanish fallback assets)
├── screens/          # Individual full-screen modules (44+ screens)
├── sim_engine/       # Simulation systems (AI, Economy, Cities, Combat)
├── store/            # Zustand state engine
├── styles/           # CSS, custom tokens, and glassmorphism styling
├── utils/            # General helpers (procedural assets, storage utilities)
└── workers/          # Web Workers for async computation tasks
```

## Module Responsibilities

| Directory/File | Description | Primary Responsibility |
|---|---|---|
| `src/main.tsx` | Main entry point | Bootstrap React application and load root styling. |
| `src/App.tsx` | Root Component | Global container scaling (1920x1080), route definitions, HUD. |
| `src/GameEngine.ts` | Game Loop Engine | Orchestrates clock cycles, updates systems, triggers simulation steps. |
| `src/store/gameStore.ts` | Zustand Store | Global reactive state container, actions, persistent memory updates. |
| `src/sim_engine/` | Sim Systems | Core game algorithms (Economy, AI, Cities, Naval Combat). |
| `src/core/SaveManager.js` | Save Manager | Handles game state serialization, JSON exports, and local file storage. |
| `src/database/` | Static Database | Holds raw structures like goods list, production formulas, city nodes. |

## Core Integration Flow

1. **`GameEngine`** performs simulation ticks and processes logic.
2. Updates are dispatched to the **`gameStore`** (Zustand).
3. The React hierarchy listens to the store changes and forces UI redraws on scaled canvases in **`App.tsx`**.
