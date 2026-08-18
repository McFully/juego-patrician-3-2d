# SCREEN_0034: Expedition Map

## 1. Metadata
- **ID:** SCREEN_0034
- **Name:** Expedition Map
- **File:** `src/screens/ExpeditionMap.tsx`
- **Route:** `/expeditions` (presumably)
- **Context:** Strategic management of long-distance maritime expeditions beyond the standard trade routes.

## 2. Description
The Expedition Map allows players to send fleets to remote, lucrative destinations outside the immediate Baltic region. It features a list of potential ports with varying levels of risk and reward. Players must weigh the potential profit against the danger and time commitment of each mission. It also includes a management view for tracking active expeditions.

## 3. Key Features
- **Destination Catalog:** A curated list of expedition targets (e.g., Lisbon, Alexandria, Novgorod) with status (Discovered/Locked).
- **Tactical Data:** Detailed stats for each destination, including distance (km), duration (days), danger level (Media to Extrema), and estimated rewards (DUC).
- **Expedition Tracker:** A separate tab to monitor ongoing missions, showing current status (e.g., "Regresando"), remaining time, and fleet composition.
- **Dynamic Risk Coloring:** Visual indicators for danger levels (Red for Extreme, Orange for Very High, etc.).
- **Interactive Map/List:** Selection-based UI where clicking a destination reveals full details and action buttons.

## 4. State Management
- **Engine Integration:** 
  - Retrieves player gold from `usePlayer`.
  - UI ready for integration with an `engine.sendExpedition` method (currently uses local `handleSend` for demonstration).
- **Local State:** 
  - `activeTab`: Switches between the Destinations map and the Active Expeditions list.
  - `selected`: Tracks the currently inspected destination.
  - `msg/msgType`: Manages a temporary toast notification system for user feedback.

## 5. Forensic QA Notes
- **UI Quality:** High-fidelity design with consistent use of Material Symbols and a polished glassmorphism aesthetic.
- **User Experience:** The use of toast notifications for actions like "Enviando Expedición" provides immediate confirmation.
- **Extensibility:** The `DESTINATIONS` and `MY_EXPEDITIONS` arrays are well-structured for easy binding to real simulation data.
- **Mobile Considerations:** While designed for larger screens, the list-based approach for destinations is adaptable.
- **Safety Checks:** Includes logic to prevent sending expeditions to locked destinations.

## 6. Layout Diagram
```
[Header: Back, Icon, "Mapa de Expediciones", Gold/Active Count]
-----------------------------------------------------------
| [Tabs: Destinos | Mis Expediciones]                     |
-----------------------------------------------------------
| [Destination List] | [Detail Panel]                     |
| (Left Sidebar)     | - Icon / Title / Desc              |
|                    | - Stats Grid (Distance, Risk, etc) |
|                    | - [SEND EXPEDITION BTN]            |
-----------------------------------------------------------
[Toast Notifications (Floating Top)]
```
