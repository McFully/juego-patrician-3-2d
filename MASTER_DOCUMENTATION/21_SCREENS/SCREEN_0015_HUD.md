# SCREEN: HUD OVERLAY

## 1. Overview
Persistent overlay for time controls, gold, and navigation.

## 2. Component Structure
- **Root**: `HUD.tsx`
- **Internal Modules**:
  - `Top Bar`: Gold, Date, City Name.
  - `Bottom Console`: Navigation shortcuts.
  - `Time Controls`: Play/Pause and speed buttons.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Engine instance.
- **`useSimulationState()`**: Reactive world state.

### 3.2 Sinks
- `engine.engine.server.tickRate`.

## 4. Forensic Audit Notes (QA)
- **Architectural Violation**: Directly modifies `engine.engine.server.tickRate`, bypassing the adapter.
- **Route Typo**: Button links to `/trade-RUTA-editor` (inconsistent case).
