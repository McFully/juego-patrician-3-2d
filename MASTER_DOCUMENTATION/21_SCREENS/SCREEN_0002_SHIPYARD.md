# SCREEN: SHIPYARD (Astillero)

## 1. Overview
The **Shipyard** is the interface for commissioning, repairing, and upgrading naval vessels. It is the primary sink for timber, iron, and large amounts of gold.

## 2. Component Structure
- **Root**: `Shipyard.tsx`
- **Internal Modules**:
  - `Header`: Navigation, gold display, and city context.
  - `Ship Catalog`: Grid of cards showing available ship types (Snaikka, Crayer, Cog, Holk).
  - `Build Panel`: Detail view of the selected ship's requirements and construction time.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses the engine instance.
- **`usePlayer()`**: Checks gold and current city location.
- **`SHIP_TYPES` (Internal)**: Constant defining base ship stats and costs.

### 3.2 Sinks (Engine Calls)
- `engine.commissionShip(cityId, shipTypeId)`: Starts a new construction project.
- `engine.repairShip(shipId)`: Restoration of HP.
- `engine.upgradeShip(shipId)`: Increases cargo or combat slots.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `selectedShipId` | `string` | Currently highlighted ship type in the catalog. |
| `msg` | `string` | UI feedback (e.g., "Not enough materials"). |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   ASTILLERO REAL                Gold: 50,000g | Lubeck |
+-------------------------------------------------------------+
| CATALOGO DE NAVIOS         | DETALLES DE CONSTRUCCION       |
|                            |                                |
| [Snaikka Card] [Crayer Card]| Seleccionado: Holk             |
| [Cog Card]     [Holk Card]  | Coste: 15,000g                 |
|                            | Madera: 120t                   |
|                            | Hierro: 40t                    |
|                            | Tiempo: 24 Días                |
|                            |                                |
|                            |      [ ENCARGAR CONSTRUCCION ] |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Prerequisites**: Some ship types require the city to have a certain Shipyard Level (upgraded via city council).
- **Material Check**: The ship cannot be commissioned if the required materials are not in the player's local warehouse.
- **Capacity**: Only one ship can be built at a time per shipyard level.
