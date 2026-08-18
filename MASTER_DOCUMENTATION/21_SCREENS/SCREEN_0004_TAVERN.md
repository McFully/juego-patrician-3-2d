# SCREEN: TAVERN (Taberna)

## 1. Overview
The **Tavern** is the hub for recruitment, gossip, and unofficial contracts. It is where players find specialized personnel and high-risk/high-reward missions.

## 2. Component Structure
- **Root**: `Tavern.tsx`
- **Internal Modules**:
  - `Header`: Standard navigation.
  - `NPC List`: Visual cards for interactable characters (The Informant, The Drunkard, The Captain).
  - `Recruitment Center`: Interface for hiring sailors for the current fleet.
  - `Contract Board`: List of dynamic missions (e.g., Courier, Pirate Hunt).

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses hiring pools (sailors available today).
- **`usePlayer()`**: Checks gold and ship space.

### 3.2 Sinks (Engine Calls)
- `engine.CONTRATARSailors(count)`: (Internal: `hireSailors`).
- `engine.CONTRATARCaptain(captainId)`: (Internal: `hireCaptain`).
- `engine.acceptMission(missionId)`: Links a mission to the player's active tasks.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `msg` | `string` | Feedback for hiring success/failure. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   TABERNA DEL PUERTO            Gold: 12,450g         |
+-------------------------------------------------------------+
| PERSONAJES             | RECLUTAMIENTO      | MISIONES      |
|                        |                    |               |
| [Capitán Vane]         | Marineros: 15/20   | [Escolta]     |
| "Busco barco..."       | Coste: 2g/día      | [Suministros] |
|                        |                    |               |
| [Informador]           | [ RECLUTAR 5 ]     | [Pirata]      |
| "Sé de un convoy..."   | [ CONTRATAR CAP ]  |               |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Sailor Availability**: The pool of sailors refreshes every tick based on city population.
- **Captain Stats**: Captains have randomized skills (Navigation, Combat, Trade) which affect fleet performance.
- **Morale**: Hiring sailors in a tavern can occasionally boost fleet morale.
