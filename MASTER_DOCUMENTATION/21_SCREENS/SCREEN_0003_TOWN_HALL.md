# SCREEN: TOWN HALL (Ayuntamiento)

## 1. Overview
The **Town Hall** serves as the political and administrative center of a city. It provides access to city statistics, council voting, and local history.

## 2. Component Structure
- **Root**: `TownHall.tsx`
- **Internal Modules**:
  - `Header`: Standard navigation.
  - `Stats Bar`: High-level data (Population, Satisfaction, Defense, Weekly Growth).
  - `Tab System`:
    - **Decrees**: List of active and proposed city laws.
    - **Council**: List of councillors and their voting power.
    - **Log**: Chronicle of recent city events (sieges, famines, milestones).

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Accesses world state for city stats.
- **`usePlayer()`**: Checks reputation and citizenship status.

### 3.2 Sinks (Engine Calls)
- `engine.voteOnDecree(id, option)`: Submits the player's vote to the political system.
- `engine.submitCityProposal(type)`: Allows high-ranking players to propose new laws.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `activeTab` | `string` | Currently visible tab ('decrees', 'council', 'log'). |
| `voted` | `boolean` | Flag to prevent multiple votes on the same session. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   AYUNTAMIENTO DE LUBECK        Gold: 12,450g         |
+-------------------------------------------------------------+
| Pop: 2,480 | Felicidad: 84% | Defensa: Fuerte | Crec: +2%    |
+-------------------------------------------------------------+
| [ DECRETOS ] [ CONCEJO ] [ CRONICA ]                         |
+-------------------------------------------------------------+
| PROYECTO DE LEY: Ampliación de Murallas                      |
| Estado: En votación                                          |
| [ Votar a Favor ] [ Votar en Contra ] [ Abstenerse ]         |
|                                                              |
| CRONICA:                                                     |
| - 12/10/1300: Gran Incendio sofocado.                        |
| - 01/09/1300: Inauguración de la Catedral.                   |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Voting Rights**: Only players with the rank of **Councilor** or higher can vote on decrees.
- **Satisfaction Logic**: Low satisfaction in the Town Hall leads to population exodus.
- **History Tracking**: The 'Log' tab is populated by the `EventSystem` records.
