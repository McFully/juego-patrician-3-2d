# SCREEN: NAVAL COMBAT ARENA (Arena de Combate Naval)

## 1. Overview
The **Naval Combat Arena** is the tactical combat interface where players control their ships during pirate encounters or city sieges. It transitions the game from a macro-economic simulation to a real-time tactical battle.

## 2. Component Structure
- **Root**: `NavalCombatArena.tsx`
- **Internal Modules**:
  - `Tactical Map`: A top-down grid or free-movement area for ships.
  - `Unit Cards`: Status of ships (Hull, Sails, Crew, Reload).
  - `Command Bar`: Actions like "Fire Cannons", "Boarding", "Retreat".

## 3. Data Flow
### 3.1 Sources
- **`useCombat()`**: A specialized hook for real-time battle state.
- **`engine.currentBattle`**: Data about participating ships and terrain.

### 3.2 Sinks (Engine Calls)
- `engine.orderShipMove(shipId, x, y)`
- `engine.orderShipAttack(shipId, targetId)`
- `engine.useCombatAbility(shipId, abilityId)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `selectedShipId` | `string` | The ship currently receiving orders. |
| `battleLog` | `string[]` | History of combat events (e.g., "Hit for 20 dmg"). |
| `windDirection` | `number` | Angle affecting ship movement speed. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [ RETREAT ]         BATTLE OF VISBY          [ PAUSE ]      |
+-------------------------------------------------------------+
|                                                             |
|   (S) SHIP A <--- [ Wind ]                                  |
|                                                             |
|                (X) ENEMY SHIP                               |
|                                                             |
+-------------------------------------------------------------+
| SHIP STATUS:               | ACTIONS:                       |
| Hull: [|||||   ] 60%       | [ FIRE LEFT ]  [ FIRE RIGHT ]  |
| Sails:[||||||||] 100%      | [ FULL SAIL ]  [ REPAIR ]      |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Wind System**: Ships move faster when sailing with the wind.
- **Reloading**: Cannons have a cooldown based on crew skill.
- **Victory Conditions**: Sink all enemies, capture the flagship, or force a retreat.

## 7. Forensic Audit Notes (QA)
- **Performance**: High-frequency updates (60fps ideally) for movement.
- **Sound**: Cannons, wood splintering, and ocean sounds are essential for immersion.
