# SCREEN_0035: Hanseatic League Mission Board

## 1. Metadata
- **ID:** SCREEN_0035
- **Name:** Hanseatic League Mission Board
- **File:** `src/screens/HanseaticLeagueMissionBoard.tsx`
- **Route:** `/missions` (presumably)
- **Context:** Formal quest system provided by the Hanseatic League and informal market intelligence.

## 2. Description
The Mission Board serves as the primary source of structured objectives for the player. It offers tasks ranging from pirate hunting to supply delivery and diplomatic mediation. Additionally, it provides a "Market Rumors" section that gives the player hints about upcoming economic shifts or political crises, which can be used for speculative trading.

## 3. Key Features
- **Categorized Missions:** Quests are labeled by type (Combat, Supply, Trade, Diplomacy) and color-coded for quick identification.
- **Quest Metadata:** Each mission displays its reward in DUC, difficulty level (Media to Muy Alta), and a strict time limit.
- **Mission Acceptance System:** Players can accept missions directly from the board, which then update to an "EN CURSO" (In Progress) status.
- **Market Rumors:** A list of informal tips with reliability assessments ("Riesgo") that inform the player's trading strategy.
- **League Integration:** Branded as a Hanseatic League office, reinforcing the player's role within the organization.

## 4. State Management
- **Engine Integration:** 
  - Accesses player gold via `usePlayer`.
  - Intended to sync with `state.missions` (currently uses local `accepted` state for UI toggling).
- **Local State:** 
  - `activeTab`: Toggles between formal Missions and informal Rumors.
  - `accepted`: An array of IDs for missions the player has committed to.
  - `msg/msgType`: Manages UI feedback via toast notifications.

## 5. Forensic QA Notes
- **UI Design:** Strong thematic consistency with the "Expedition Map" screen. Uses Material Symbols effectively for mission categories.
- **Status Tracking:** The "Active" counter in the header provides a quick reference for the player's current workload.
- **Interactivity:** Mission acceptance is responsive and provides immediate visual feedback.
- **Thematic Flavor:** Rumors are presented as quotes, adding to the immersion of gathering intelligence in port taverns.
- **Reliability Mechanic:** The "Risk" level on rumors adds a layer of decision-making to speculative trading.

## 6. Layout Diagram
```
[Header: Back, Icon, "Tablón de Misiones", Active Count/Gold]
-----------------------------------------------------------
| [Tabs: Misiones de la Liga | Rumores del Mercado]       |
-----------------------------------------------------------
|                                                         |
|  [Mission Card]              OR   [Rumor Card]          |
|  - Type Icon & Label              - Icon                |
|  - Title / Description            - Rumor Text          |
|  - Stats (Reward, Diff, Time)     - Reliability (Risk)  |
|  - [ACEPTAR MISIÓN BTN]                                 |
|                                                         |
-----------------------------------------------------------
[Toast Notifications (Floating Top)]
```
