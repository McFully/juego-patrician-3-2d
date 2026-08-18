# SCREEN: ALERTS & EVENT OVERLAYS (Alertas y Superposiciones de Eventos)

## 1. Overview
This is a high-priority UI layer that manages critical notifications, world events, and mission prompts. It intercepts the main gameplay loop to present the player with choices or urgent information.

## 2. Component Structure
- **Root**: `AlertsEventOverlays.tsx`
- **Internal Modules**:
  - `Modal Manager`: Handles stacking of multiple alerts.
  - `Event Card`: Individual container for a narrative or economic event.
  - `Action Buttons`: Context-specific choices (e.g., "Accept Mission", "Pay Fine").

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Listens for `engine.events` emitted during the simulation tick.
- **`EventManifest`**: Local JSON/Data model defining event types and images.

### 3.2 Sinks (Engine Calls)
- `engine.resolveEvent(eventId, optionIndex)`
- `engine.dismissAlert(alertId)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `activeEvent` | `Event | null` | The current event being displayed. |
| `queue` | `Event[]` | Queue of pending alerts if multiple trigger at once. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
|                      CRITICAL ALERT                         |
+-------------------------------------------------------------+
|                                                             |
|      [ICON: PIRACY]   PIRATAS EN EL BÁLTICO                 |
|                                                             |
|   Un convoy ha sido interceptado cerca de Visby.            |
|   Nuestros espías informan de una flota de 3 carracas.      |
|                                                             |
+-------------------------------------------------------------+
|      [ ENVIAR REFUERZOS ]         [ IGNORAR (Riesgo) ]      |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Pause State**: Critical events should pause the simulation (`engine.pause()`) until resolved.
- **Priority**: System alerts (low funds) > Narrative events > Information (trade complete).
- **Auto-dismiss**: Minor notifications fade out after 5 seconds.

## 7. Forensic Audit Notes (QA)
- **Bug**: Ensure the "Z-Index" is high enough to cover all other modals.
- **Sound**: Every alert should trigger its specific `audio.js` sound effect.
