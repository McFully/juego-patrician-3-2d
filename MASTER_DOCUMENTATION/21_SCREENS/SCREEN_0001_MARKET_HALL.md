# SCREEN: MARKET HALL (Lonja del Mercado)

## 1. Overview
The **Market Hall** is the primary interface for manual trading between the player and the city. It allows buying/selling goods, monitoring city stock, and checking price trends.

## 2. Component Structure
- **Root**: `MarketHall.tsx`
- **Internal Modules**:
  - `Header`: Navigation and global stats.
  - `Market Table`: The central grid of goods.
  - `Sidebar`: Warehouse status and market news.
- **Note**: This screen uses raw Tailwind CSS and does not consume atomic UI components from `src/components/ui`.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses the `engine` adapter.
- **`usePlayer()`**: Observes player gold and local warehouse inventory.
- **`GOODS` (Local Constant)**: Current source for goods metadata (icons, base prices). *Note: Integration with dynamic engine stock is in progress.*

### 3.2 Sinks (Engine Calls)
- `engine.buyGood(goodId, amount)`
- `engine.VenderGood(goodId, amount)` (Note: Forensic analysis detected a potential naming mismatch with `engine.sellGood`).

## 4. State Management
| State | Type | Description |
|---|---|---|
| `msg` | `string` | Feedback message (e.g., "Trade Success"). |
| `qty` | `Record<string, number>` | Selected amount per good for the transaction. |
| `cat` | `string` | Current category filter (Food, Raw Materials, Luxury). |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   LONJA DEL MERCADO             Gold: 12,450g | Lubeck |
+-------------------------------------------------------------+
| [ Categories: Food | Materials | Luxury | All ]             |
+-------------------------------------------------------------+
| Mercancía   | Stock   | Tendencia | Compra | Venta | Qty    |
|-------------|---------|-----------|--------|-------|--------|
| [Icon] Grain| [==== ] | [Up]      | [Buy]  | [Sell]| [-][1][+]|
| [Icon] Beer | [==   ] | [Down]    | [Buy]  | [Sell]| [-][0][+]|
| ...         | ...     | ...       | ...    | ...   | ...    |
+-------------------------------------------------------------+
| SIDEBAR:                     | FOOTER ACTIONS:              |
| My Warehouse:                | [ Financial Ledger ]         |
| - Grain: 120t                | [ Close Market ]             |
| - Wood: 40t                  |                              |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Category Filtering**: Updates the visible list without a full page reload.
- **Transaction Feedback**: Success/Error toasts appear briefly at the top.
- **Stock Indicators**: Visual bars represent city stock levels relative to demand.

## 7. Forensic Audit Notes (QA)
- **Typo/Bug**: The code calls `engine.VenderGood`, but the standard naming convention in the engine is `sellGood`. This may cause a runtime error if the adapter is strictly typed.
- **Hardcoded Data**: Prices and stock are currently read from a static array in the component file, meaning they do not yet reflect the true dynamic state of the `SimulationServer` in the current build.
