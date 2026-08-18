# SCREEN: POLITICAL EXILE (Estado de Exilio Político)

## 1. Overview
A specialized state screen triggered by severe reputation loss, criminal acts, or losing a high-stakes political battle in the Hanseatic Diet. The player is barred from certain cities or the entire Hansa for a period.

## 2. Component Structure
- **Root**: `PoliticalExileState.tsx`
- **Internal Modules**:
  - `Exile Banner`: Visual indicator of the player's pariah status.
  - `Restricted Map`: World map showing inaccessible ports.
  - `Pardon Path`: List of tasks or bribes required to end the exile.

## 3. Data Flow
### 3.1 Sources
- **`usePlayer()`**: Reputation data and active "Exile" status.
- **`engine.politicalClimate`**: Current laws and active bans.

### 3.2 Sinks (Engine Calls)
- `engine.payBribe(amount)`
- `engine.petitionPardon()`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `daysRemaining` | `number` | Duration of the exile. |
| `exileReason` | `string` | Narrative explanation (e.g., "Smuggling", "Treason"). |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
|          EXILIADO DE LA LIGA HANSEÁTICA                     |
+-------------------------------------------------------------+
| MOTIVO: Traición y Contrabando en el Sund.                  |
| ESTADO: PARIA (Los mercaderes te ignoran)                   |
+-------------------------------------------------------------+
| CIUDADES PROHIBIDAS:        | CAMINO A LA REDENCIÓN:        |
| - Lubeck (Total)            | [ ] Pagar multa de 50,000g    |
| - Danzig (Comercio Bloqueado)| [ ] Donar 3 barcos a la Liga |
| - Visby (Peligro)           | [ ] Esperar 12 meses          |
+-------------------------------------------------------------+
| [ RETIRARSE AL MEDITERRÁNEO (Game Over) ]  [ ACEPTAR PENA ] |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Trade Block**: Attempting to trade in an exile city triggers a battle with the city guard.
- **Information Blackout**: Player no longer receives global trade messages.
- **Black Market**: Only the Tavern "Secret Room" remains accessible in banned cities.

## 7. Forensic Audit Notes (QA)
- **Consistency**: This screen must be consistent with the `PoliticalExileState.tsx` implementation which is mostly text-heavy.
- **Visuals**: Branding must reflect the "Aritz Bahamonde Larxé" copyright even in failure states.
