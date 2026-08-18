# SCREEN: CITY OVERVIEW

## 1. Overview
The **City Overview** is the main interactive map of the current city. It provides an isometric view where players can select buildings to perform actions (upgrading, repairing, etc.) and view district-wide statistics.

## 2. Component Structure
- **Root**: `CityOverview.tsx`
- **Internal Modules**:
  - `Header`: Global navigation and currency display.
  - `City Grid`: SVG-based isometric grid with interactive building sprites.
  - `Action Wheel`: A custom radial menu that appears upon building interaction.
  - `District Sidebar`: Displays population, stability, and production trends.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses engine methods like `getCityStats`.
- **`useSimulationState()`**: Obtains real-time city data (prices, state).
- **`db` (Local Database)**: Pulls static metadata for `CITIES` and `GOODS`.

### 3.2 Sinks (Engine Calls)
- `engine.getCityStats(currentCityId)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `activeBuilding` | `string` | ID of the currently focused building. |
| `showMarket` | `boolean` | Toggle for the market overlay. |
| `wheelTitle` | `string` | Label displayed inside the radial menu. |

## 5. UI Layout (Wireframe)
```text
+-----------------------------------------------------------+
| [Hanseatic Strategos]  [City Center] [Diplomacy]  12,450g |
+-----------------------------------------------------------+
|                                                           |
|      ( ISOMETRIC CITY GRID )           +---------------+  |
|                                        | DISTRICT INFO |  |
|      [Warehouse]      [Mill]           | Pop: 2,480    |  |
|                                        | Stab: 84%     |  |
|             [Forge]                    |               |  |
|                                        | [BUILD NEW]   |  |
|        [ACTION WHEEL]                  +---------------+  |
|                                                           |
+-----------------------------------------------------------+
```

## 6. Logic & Rules
- **Radial Menu**: Triggered via `toggleRadialWheel`. It uses direct DOM manipulation (`document.getElementById`) to position itself relative to the mouse cursor.
- **Building Interaction**: Hovering over buildings applies a drop-shadow filter and scaling effect via CSS.

## 7. Forensic Audit Notes (QA)
- **Brittle DOM Logic**: The Action Wheel relies on `document.getElementById` and manual class manipulation instead of React-managed state.
- **Inconsistent Data**: Population and Stability are hardcoded in the Sidebar JSX, bypassing the actual `cityStats` engine data.
- **Positioning Issues**: Using `event.clientX/Y` for the wheel may cause displacement on window resize.
