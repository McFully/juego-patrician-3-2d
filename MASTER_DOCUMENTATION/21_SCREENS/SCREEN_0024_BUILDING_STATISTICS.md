# SCREEN: BUILDING STATISTICS (Estadísticas de Edificios)

## 1. Overview
A specialized data screen that allows players to analyze the productivity, maintenance costs, and ROI of their real estate and production assets.

## 2. Component Structure
- **Root**: `BuildingStatistics.tsx`
- **Internal Modules**:
  - `Building List`: All player-owned structures.
  - `Profit/Loss Chart`: Visual representation of economic performance.
  - `Optimization Tool`: Suggestions for improving output (e.g., "Hire more workers").

## 3. Data Flow
### 3.1 Sources
- **`usePlayer()`**: List of buildings and their historical production.
- **`BUILDING_TYPES`**: Base stats for comparison.

### 3.2 Sinks (Engine Calls)
- `engine.upgradeBuilding(buildingId)`
- `engine.setBuildingMaintenance(buildingId, level)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `selectedBuildingId`| `string` | The building currently being analyzed. |
| `timeRange` | `string` | (Day, Week, Month) for the stats chart. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   ESTADÍSTICAS DE PRODUCCIÓN        Total edificios: 12|
+-------------------------------------------------------------+
| BUILDING             | PERFORMANCE CHART                    |
| - Grain Farm #1      |       / \                            |
| - Warehouse Lubeck   |      /   \___                        |
| - Brewery #3         | ____/        \                       |
|                      | Oct   Nov   Dec                      |
+-------------------------------------------------------------+
| DETAILS: Brewery #3        | ACTIONS:                       |
| Cost: 200g/mo              | [ UPGRADE ] (5,000g)           |
| Profit: +850g/mo           | [ SELL ]    (2,500g)           |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Efficiency**: Calculations include raw material costs vs. market value of produced goods.
- **Maintenance**: Cutting maintenance lowers costs but increases the chance of fire or structural failure.

## 7. Forensic Audit Notes (QA)
- **Accuracy**: Ensure the "Net Profit" accounts for city taxes.
- **Charts**: Use a lightweight charting library or custom CSS/SVG bars to avoid bloat.
