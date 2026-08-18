# SCREEN: TRADE ROUTE EDITOR MOBILE (Editor de Rutas Comerciales Móvil)

## 1. Overview
The **Trade Route Editor Mobile** is a specialized, mobile-optimized interface for configuring automated trade routes for specific convoys. It focuses on stop management and per-good buy/sell automation thresholds.

## 2. Component Structure
- **Root**: `TradeRouteEditorMobile.tsx`
- **Internal Modules**:
  - `Fixed Header`: Navigation back to city overview and player status.
  - `Stop List`: Vertical timeline-style list of city stops.
  - `Order Card`: Expandable details for specific goods at each stop.
  - `Action Bar`: "Iniciar Ruta" button fixed at the bottom.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses the `engine` adapter.
- **`usePlayer()`**: Observes player data.
- **`stops` (Local State)**: Initialized with mock data for Lübeck, Visby, and Riga.

### 3.2 Sinks (Engine Calls)
- `engine.setPlayerRoute(cityIds, config)`: Sets the automated route for the selected convoy.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `stops` | `RUTAStop[]` | Array of stop configurations including city names and orders. |
| `feedback` | `string` | Transient feedback message (e.g., "¡Ruta lanzada!"). |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------+
| [<]  Hanseatic Strategos            1.250 DUC | 85 Rep |
+-------------------------------------------------------+
| Editor de Rutas Comerciales                           |
| Convoy: Baltic Star                                   |
+-------------------------------------------------------+
|  |  [o] PARADA 01: Lübeck                        [^]  |
|  |      [Icon] Sal    - Excedente                     |
|  |      Buy < [ 14DUC ]   Sell > [ 22DUC ]            |
|  |      [Icon] Madera - Escasez                       |
|  |      Buy < [ 45DUC ]   Sell > [ 68DUC ]            |
|  |                                                    |
|  |  [ ] PARADA 02: Visby                         [v]  |
|  |  [ ] PARADA 03: Riga                          [v]  |
|  |                                                    |
|  |  [ + Añadir Nueva Parada ]                         |
+-------------------------------------------------------+
|                   [ INICIAR RUTA ]                    |
+-------------------------------------------------------+
```

## 6. Logic & Rules
- **Accordion Navigation**: Only one stop is expanded at a time (controlled by `toggleStop`).
- **Route Launch**: Filters active stops, extracts city IDs, and sends them to the engine.
- **Visual Feedback**: The active stop has a "glow" effect and a connection line to the next stop.

## 7. Forensic Audit Notes (QA)
- **Hardcoded Logic**: `setPlayerRoute` is called with an empty object for `config` (`{}`), meaning the specific price thresholds set in the UI are not yet passed to the engine.
- **UI Interaction**: The "expand" logic uses `max-height` transitions for smooth mobile feel.
- **Mobile First**: Uses `material-symbols-outlined` and Tailwind utility classes for a responsive, touch-friendly layout.
