# SCREEN: WEAPON SMITH (Herrero de Armas)

## 1. Overview
The **Weapon Smith** is the interface for purchasing ship armament (cannons) and infantry weapons. It allows the player to upgrade their fleet's combat capabilities.

## 2. Component Structure
- **Root**: `WeaponSmith.tsx`
- **Internal Modules**:
  - `Category Sidebar`: Filters for Artillery, Melee, and Defense.
  - `Weapon Grid`: Selection of available items with prices.
  - `Detail Inspector`: Preview image, flavor text, and tactical specs (Damage, Range, Reload).
  - `Purchase Panel`: Final transaction controls.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses `engine` and `state`.
- **`WEAPONS_DATA`**: Registry of weapon items, icons, and prices.
- **`state.player`**: Used to check funds and fleet.

### 3.2 Sinks (Engine Calls)
- `engine.buyWeapons(type, quantity, targetShipIndex)`: Processes the purchase.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `selectedCategory` | `string` | Filter for the weapon grid. |
| `selectedWeapon` | `string` | The weapon currently being inspected. |
| `quantity` | `number` | Amount to buy. |
| `targetShipIndex` | `number` | Index of the ship receiving the weapons. |
| `feedback` | `object` | Success/Error message and type. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------+
| [Logo] [Map] [Ledger] [Convoy] [Market] [Council]     |
+-------------------------------------------------------+
|  ARMERO      |                               | PREVIEW |
|              | [ Artillery ] [ Melee ] [Def] | [Image] |
| [Artillery]  |                               |         |
| [Melee]      | [ Falconet  ] [ Sereptine ]   | Stats:  |
| [Defense]    | [ 850 DUC   ] [ 1200 DUC  ]   | Dmg [==]|
|              | [ Bombard   ] [ Catapult  ]   | Rng [==]|
| Funds:       | [ 2400 DUC  ] [ 1800 DUC  ]   | [ BUY ] |
| 14,250g      |                               |         |
+-------------------------------------------------------+
```

## 6. Logic & Rules
- **Tactical Specs**: Visual progress bars show weapon performance relative to a maximum of 100.
- **Selection Glow**: The active weapon in the grid is highlighted with an `active-glow` shadow.
- **Dynamic Preview**: Images and descriptions update immediately upon selecting a different weapon.

## 7. Forensic Audit Notes (QA)
- **Engine Binding**: The `buyWeapons` call is implemented in the engine adapter, but needs to be verified against the `SimulationServer`'s actual inventory logic.
- **Hardcoded Limits**: Stock levels in the preview (e.g., "En Stock: 12") are currently static text in the JSX.
- **UI Consistency**: Uses the "Hanseatic Strategos" branding and maritime glassmorphism theme seen in other major screens.
