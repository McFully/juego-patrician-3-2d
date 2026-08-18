# Project Goals

## High-Level Vision
To create a modern, high-performance, and visually stunning 2D reimagining of the classic Hanseatic trading simulation. The game focuses on economic depth, political intrigue, and naval strategic management within the historical context of the Hanseatic League.

## Strategic Objectives
1. **Simulation Fidelity**: Implement a complex, multi-agent economic model where every transaction and event (plagues, fires, sieges) has a measurable impact on the world state.
2. **Reactive UI**: Build a "live" interface that reflects the simulation's heartbeats (1-second ticks) without performance degradation, using modern React patterns and Tailwind CSS.
3. **Cross-Platform Accessibility**: Ensure the game is fully playable and optimized for both desktop and mobile devices via a responsive layout system.
4. **Architectural Integrity**: Maintain a strict separation between the Simulation Engine (Core Logic) and the React Interface (Presentation), bridged by a type-safe `EngineAdapter`.

## User Experience Goals
- **Immersive Atmosphere**: Use glassmorphism and rich typography to create a "Tactical Navigator" feel.
- **Contextual Awareness**: Provide users with immediate feedback on global events via the `MessageCenter` and `EncounterOverlay`.
- **Strategic Depth**: Offer detailed screens for every aspect of the game (Market, Shipyard, Town Hall, etc.) while keeping the core navigation simple and intuitive.
