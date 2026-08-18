# SCREEN_0028: At Sea Encounter Menu

## 1. Metadata
- **ID:** SCREEN_0028
- **Name:** At Sea Encounter Menu
- **File:** `src/screens/AtSeaEncounterMenu.tsx`
- **Route:** `/at-sea-encounter` (presumably, though often triggered via event)
- **Context:** Immediate decision-making when fleets encounter others at sea.

## 2. Description
This screen presents a tactical choice to the player when their fleet meets another vessel or fleet. It provides critical information such as combat power, ship integrity, and enemy cargo to inform the decision to fight, flee, or negotiate.

## 3. Key Features
- **Fleet Comparison:** Side-by-side stats for the player's fleet and the encounter opponent.
- **Tactical Information:** Displays probability of success, risk level, and known enemy cargo.
- **Character Portraits:** High-detail portraits of the player's governor and the opponent (e.g., Pirate Captain).
- **Action Buttons:** Large, distinct buttons for "Abordar" (Fight), "Ignorar" (Flee), and "Negociar" (Surrender/Negotiate).
- **Cinematic Atmosphere:** Full-screen backdrop of a turbulent sea and atmospheric "fog" overlay.

## 4. State Management
- **Engine Integration:** 
  - Accesses `state.simulation.activeEncounter` for encounter data.
  - Calls `engine.resolveEncounter(action)` to progress the simulation based on the player's choice.
- **Navigation:** Returns to `/world-map` after an action is selected.

## 5. Forensic QA Notes
- **Direct Engine Link:** Unlike earlier mock-heavy screens, this one directly interacts with `engine.resolveEncounter`, indicating it's functionally wired.
- **UI Consistency:** Follows the "Hanseatic Strategos" branding with deep navy/gold palette and glassmorphism.
- **Responsive Design:** Uses a grid layout that adjusts, though the 12-column modal is optimized for wider screens.
- **Accessibility:** Buttons have clear icons and labels.
- **Visuals:** Uses CSS animations (`animate-spin-slow`) for tactical targeting visuals.

## 6. Layout Diagram
```
[Header: Global Stats & Nav]
-----------------------------------------------------------
| [Player Stats] |    [Targeting View]    | [Enemy Stats] |
| (Left 3 cols)  |    (Center 6 cols)     | (Right 3 cols)|
-----------------------------------------------------------
|                | [Action Buttons Row]   |               |
-----------------------------------------------------------
[Cinematic Backdrop]
```
