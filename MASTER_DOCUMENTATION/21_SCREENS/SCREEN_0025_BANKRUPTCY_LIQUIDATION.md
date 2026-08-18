# SCREEN: BANKRUPTCY & LIQUIDATION STATE (Estado de Bancarrota y Liquidación)

## 1. Overview
The "Game Over" or "Crisis" screen triggered when a player's gold remains negative for too long. It presents the forced sale of assets to cover debts.

## 2. Component Structure
- **Root**: `BankruptcyLiquidationState.tsx`
- **Internal Modules**:
  - `Debt Summary`: Total amount owed to creditors.
  - `Liquidation List`: Automatic/Manual selection of ships and buildings to sell.
  - `Final Verdict`: Whether the player can continue or must retire.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Triggers this screen when `player.gold < engine.BANKRUPTCY_LIMIT`.
- **`usePlayer()`**: Inventory of assets to be liquidated.

### 3.2 Sinks (Engine Calls)
- `engine.liquidateAsset(assetId)`
- `engine.declareBankruptcy()` (Hard reset/End game)

## 4. State Management
| State | Type | Description |
|---|---|---|
| `totalDebt` | `number` | The target amount to reach via liquidation. |
| `recoveredAmount`| `number` | Amount gained from selected assets. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [!] AVISO DE LIQUIDACIÓN FORZOSA [!]                        |
+-------------------------------------------------------------+
| DEUDA TOTAL: 125,000g       FALTAN: 45,000g                 |
+-------------------------------------------------------------+
| ACTIVOS A LIQUIDAR:             | VALOR DE MERCADO (50%)    |
| [X] Goleta 'Santa María'        | 12,000g                   |
| [X] Almacén en Danzig           | 25,000g                   |
| [ ] Granja de Grano             | 8,000g                    |
+-------------------------------------------------------------+
| [ CONFIRMAR LIQUIDACIÓN ]   [ DECLARAR BANCARROTA TOTAL ]   |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Fire Sale**: Assets sold during liquidation only yield 50% of their true value.
- **Priority**: Creditors take ships first, then buildings, then luxury items.
- **Recovery**: If the debt is cleared, the player returns to the game with 0g.

## 7. Forensic Audit Notes (QA)
- **Audio**: Dramatic, somber music should play.
- **Visuals**: Desaturated colors (sepia or grey) to indicate the dire situation.
