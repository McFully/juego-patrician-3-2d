# RECONSTRUCTION ROADMAP (REBUILD FROM ZERO)

## 1. Objective
To provide a step-by-step technical path to recreate the "Patrician 3 2D" project from an empty directory using modern web technologies.

## 2. Methodology
The reconstruction is divided into 5 major phases, prioritizing the stability of the simulation engine before adding the UI layer.

## 3. Phase Overview
| Phase | Title | Goal | Key Files |
|---|---|---|---|
| **01** | **Foundation** | Bootstrap Vite/TS and core types. | `package.json`, `tsconfig.json` |
| **02** | **World Simulation** | Create the headless `SimulationServer` and `City` market. | `SimulationServer.js`, `City.ts`, `Market.ts` |
| **03** | **Economic Engine** | Implement DOD optimizations and supply/demand formulas. | `DODEngine.ts`, `EconomySystems.ts` |
| **04** | **Game Orchestrator** | Wire the AI, Politics, and Player systems together. | `GameEngine.ts`, `AISystem.ts` |
| **05** | **React Frontend** | Implement the `GameProvider` and basic screens. | `GameProvider.tsx`, `App.tsx`, `MarketHall.tsx` |

## 4. Getting Started
- Follow the phases in order.
- Verify every phase with unit tests (Vitest).
- Refer to the `28_FORMULAS` section for exact mathematical logic.
