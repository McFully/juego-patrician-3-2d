# SCREEN: WAREHOUSE STOCK MANAGEMENT

## 1. Overview
The **Warehouse Stock Management** screen focuses on resource allocation between production and market sale.

## 2. Component Structure
- **Root**: `WarehouseStockManagement.tsx`
- **Internal Modules**:
  - `Allocation Cards`: Sliders for Salt, Wood, Wool, and Grain.
  - `Logistics Orders`: Sidebar for upgrades.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses the `engine` and `state`.
- **`GOODS`**: Metadata.

### 3.2 Sinks
- `engine.buyGood`, `engine.VenderGood`.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `sliders` | `Record` | Stores allocation percentages. |

## 5. UI Layout (Wireframe)
```text
+-----------------------------------------------------------+
| WAREHOUSE CENTRAL              [ 78% Capacity ] [ Risk: M ]|
+-----------------------------------------------------------+
| [ SALT CARD ]   [ WOOD CARD ]   [ WOOL CARD ]             |
| Sliders: 30%    Sliders: 80%    Sliders: 10%              |
+-----------------------------------------------------------+
| [ GRAIN ALLOCATION (Large) ]   | LOGISTICS ORDERS         |
+-----------------------------------------------------------+
```

## 6. Logic & Rules
- Sliders visually represent the split between "Personal Use" and "Market Sale".

## 7. Forensic Audit Notes (QA)
- **Dead Code**: `handleBuy` and `handleVender` are defined but never called by any button in the JSX.
- **UI Inconsistency**: Only shows 4 hardcoded goods (Salt, Wood, Wool, Grain).
- **Engine Typo**: Calls `engine.VenderGood` instead of `sellGood`.
