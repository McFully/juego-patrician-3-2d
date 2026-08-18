# SCREEN: CITY SIEGE DEFENSE (Defensa de Asedio de Ciudad)

## 1. Overview
When a city is attacked by land (princes) or sea (pirates), this screen manages the defense effort. Players can donate funds, mobilize convoys for defense, or influence the council's strategy.

## 2. Component Structure
- **Root**: `CitySiegeDefense.tsx`
- **Internal Modules**:
  - `Siege Status`: Progress of the attack and wall integrity.
  - `Defense Actions`: Buttons to fund mercenaries or donate food.
  - `Council Chat`: Brief feedback from city officials.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Active siege data (attack strength, remaining days).
- **`useCity()`**: Local city resources and morale.

### 3.2 Sinks (Engine Calls)
- `engine.donateToDefense(amount)`
- `engine.mobilizeConvoy(convoyId)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `defenseBudget` | `number` | Amount of gold player is willing to contribute. |
| `isMobilized` | `boolean` | Whether the player has committed ships to the defense. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [!] CIUDAD BAJO ASEDIO: LUBECK        Días restantes: 4     |
+-------------------------------------------------------------+
| ESTADO DE LAS MURALLAS: [||||||||--] 80%                    |
| MORAL DE LA POBLACIÓN:  [|||||-----] 50%                    |
+-------------------------------------------------------------+
| ACCIONES DE DEFENSA:       | IMPACTO:                       |
| [ DONAR 10,000g ]          | +10% Resistencia Muralla       |
| [ ENTREGAR GRANO ]         | +15% Moral de ciudadanos       |
| [ CONVOCAR CONVOY ]        | Defensa Naval Activa           |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Reputation**: High contribution to city defense grants massive reputation boosts.
- **Economic Impact**: Trade is blocked during a sea siege.
- **Failure Condition**: If walls fall, player warehouses may be looted.

## 7. Forensic Audit Notes (QA)
- **Urgency**: UI should use red accents and "pulsing" alerts to indicate danger.
- **Feedback**: Immediate visual update on morale/walls when a donation is made.
