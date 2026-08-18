# SCREEN: TRADING OFFICE

## 1. Overview
The **Trading Office** allows players to automate the buying and selling of goods from their city warehouse.

## 2. Component Structure
- **Root**: `TradingOffice.tsx`
- **Internal Modules**:
  - `Inventory List`: Left-hand grid of all tradeable goods.
  - `Policy Editor`: Right-hand form for setting price and stock thresholds.

## 3. Data Flow
### 3.1 Sources
- **`usePlayer()`**: Used to get the `currentCityId`.
- **`GOODS`**: Static metadata for listing products.

### 3.2 Sinks
- Placeholder `handleApplyMandate` mock.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `selectedGood` | `string` | The ID of the good being configured. |
| `buyPrice` | `number` | Maximum purchase price. |
| `targetStock` | `number` | Ideal quantity to maintain. |

## 5. UI Layout (Wireframe)
```text
+-----------------------------------------------------------+
| [Back]   OFICINA COMERCIAL - LUBECK        [OPEN LEDGER]  |
+-----------------------------------------------------------+
| INVENTORY              | DIRECTIVES: [Grain]              |
| +-------+ +-------+    | [Price Max] [ Target ] (Buy)     |
| | Grain | | Wood  |    | [Price Min] [ Reserve] (Sell)    |
| | Stock | | Stock |    |                                  |
| +-------+ +-------+    | [ ] Auto-Trade   [ ] Guild Pref  |
| ...                    | [ DISCARD ]     [ APPLY MANDATE ]|
+-----------------------------------------------------------+
```

## 6. Logic & Rules
- Clicking a good in the grid updates the "Directives" panel.
- Policies currently only trigger a local feedback toast.

## 7. Forensic Audit Notes (QA)
- **CRITICAL BUG**: `sellPrice` input incorrectly calls `setBuyPrice`.
- **CRITICAL BUG**: `reserveStock` input incorrectly calls `setTargetStock`.
- **Hardcoded Stock**: All items display a static "Stock: 400 t".
- **Naming Mismatch**: Button says "APLICAR MANDATE" instead of "Aplicar Mandato".
