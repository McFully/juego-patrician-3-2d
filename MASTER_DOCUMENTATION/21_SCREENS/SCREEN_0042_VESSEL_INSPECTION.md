# SCREEN: VESSEL INSPECTION (Inspección Naval)

## 1. Overview
The **Vessel Inspection** screen provides a detailed status report of a ship, including physical condition, crew experience, and cargo manifest. It is the primary place for performing ship repairs.

## 2. Component Structure
- **Root**: `VesselInspection.tsx`
- **Internal Modules**:
  - `Header`: Navigation, Ship name, and Repair action.
  - `Ship Stats Row`: Quick summary of type, capacity, speed, etc.
  - `Tabs`: Switching between Overview, Crew, and Cargo views.
  - `Glass Panels`: Data-rich panels for health bars, combat stats, and manifest tables.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses `engine` and `state`.
- **`state.player.fleet`**: Source for ship data.
- **`SHIP_CONDITION_BARS`, `CREW`, `CARGO_MANIFEST`**: Mock data used for detailed breakdowns.

### 3.2 Sinks (Engine Calls)
- `engine.repairShip(cityId, shipIndex)`: Triggers repair logic and deducts gold.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `activeTab` | `'overview' | 'crew' | 'cargo'` | Currently visible detail pane. |
| `msg` | `string` | Success/Error toast message. |
| `msgType` | `'ok' | 'err'` | Styling for the toast message. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------+
| [< Volver]  [Sailing] Inspección Naval (Ship Name) [Repair] |
+-------------------------------------------------------+
| [ Type ] [ Capacity ] [ Speed ] [ Cannons ] [ Crew ]  |
+-------------------------------------------------------+
| [ Inspection ] [ Crew ] [ Cargo ]                     |
+-------------------------------------------------------+
|  +------------------------+  +----------------------+ |
|  | Condition:             |  | Combat Stats:        | |
|  | Hull: [=======   ] 72% |  | Firepower: [====   ] | |
|  | Sails:[=====     ] 55% |  | Defense:   [===    ] | |
|  +------------------------+  +----------------------+ |
|  | Convoy Status: [ Lubeck ] [ Docked ] [ Route ]   | |
+-------------------------------------------------------+
```

## 6. Logic & Rules
- **Repair Calculation**: The UI estimates cost as `(100 - health) * 28` DUC.
- **Condition Coloring**: Dynamic colors (Emerald, Amber, Red) based on percentage thresholds.
- **Navigation Links**: Includes quick links to `Convoy Manager`, `Trade Route`, and `Tavern`.

## 7. Forensic Audit Notes (QA)
- **Data Synchronization**: While basic ship data comes from the engine, the detailed health bars (`Hull`, `Sails`) and crew names are currently hardcoded constants.
- **Engine Interaction**: `repairShip` target is hardcoded to `shipIndex 0`.
- **UX**: Uses `glass-panel` and `backdrop-blur` for a high-end maritime aesthetic.
