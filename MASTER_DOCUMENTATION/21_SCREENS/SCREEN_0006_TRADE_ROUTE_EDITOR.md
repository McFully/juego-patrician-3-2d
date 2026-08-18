# SCREEN: TRADE ROUTE EDITOR (Editor de Rutas)

## 1. Overview
The **Trade Route Editor** is a high-level logistics interface. It allows the player to define a sequence of city stops and automated buy/sell rules for a convoy to execute indefinitely.

## 2. Component Structure
- **Root**: `TradeRouteEditor.tsx`
- **Internal Modules**:
  - `Header`: Route naming and activation controls.
  - `Stop List`: Vertical list of "Stop Cards" representing city visits.
  - `Rule Panel`: Detail view per stop (Buy Thresholds, Sell Thresholds, Cargo Limits).
  - `Preview Sidebar`: Summary of total route duration and estimated profit.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses the `FleetManager` and existing route definitions.
- **`database/cities.js`**: Provides the list of selectable cities.

### 3.2 Sinks (Engine Calls)
- `engine.setPlayerRoute(cityIds, options)`: Commits the route to the `FleetManager`.
- `engine.toggleRoute(routeId, active)`: Pauses or resumes the automated loop.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `stops` | `Array<Stop>` | Ordered list of city IDs and their associated rules. |
| `routeName` | `string` | Custom name for the route. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Cancel]   RUTA: "Triángulo Báltico"           [ GUARDAR ]  |
+-------------------------------------------------------------+
| LISTA DE PARADAS           | CONFIGURACION DE PARADA        |
|                            |                                |
| 1. [Lubeck] (v)            | Ciudad: Lubeck                 |
| 2. [Visby]  ( )            | [+] Comprar Sal si < 10g       |
| 3. [Riga]   ( )            | [+] Vender Grano si > 5g       |
|                            | [x] Reparar Barco al llegar    |
| [+] Añadir Parada          | [x] Repostar Víveres           |
|                            |                                |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Itinerary Logic**: The convoy moves from Stop N to Stop N+1, then loops from the last stop back to the first.
- **Rule Priorities**: If a ship is full, 'Buy' rules are skipped. If a market has no gold, 'Sell' rules are limited.
- **Validation**: A route must have at least 2 stops to be saved.
