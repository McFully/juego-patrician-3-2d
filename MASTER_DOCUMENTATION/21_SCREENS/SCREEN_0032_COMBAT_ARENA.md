# SCREEN_0032: Combat Arena

## 1. Metadata
- **ID:** SCREEN_0032
- **Name:** Combat Arena
- **File:** `src/screens/CombatArena.tsx`
- **Route:** `/combat-arena` (presumably triggered from encounter)
- **Context:** Real-time tactical visualization of naval combat between fleets.

## 2. Description
The Combat Arena provides a tactical view of sea battles. It visualizes the positioning of player and enemy ships, tracks their integrity and morale, and provides environmental context such as wind speed and direction. Players can issue combat commands and monitor the battle's progress through a real-time combat log.

## 3. Key Features
- **Tactical Map:** Ships are represented by icons on a dynamic ocean surface with targeting rings and distance indicators.
- **Ship Status HUDs:** Real-time health bars and hull integrity percentages displayed directly below ship icons.
- **Flagship Detail Panel:** Deep dive into the player's flagship stats, including crew count, current speed (knots), and crew morale.
- **Environmental Factors:** A wind rose indicator showing direction and speed, which affects ship maneuvering.
- **Combat Log:** A scrolling feed of battle events (e.g., hits, reloads, wind shifts).
- **Targeting Visuals:** Animated dashed lines connecting ships to represent firing solutions or focus.

## 4. State Management
- **Engine Integration:** 
  - Retrieves encounter and ship data from `state.simulation.activeEncounter`.
  - Executes `engine.resolveEncounter(action)` to process combat turns or actions.
- **Local State:** `result` state to store and display the outcome of combat actions.

## 5. Forensic QA Notes
- **Visual Effects:** Uses CSS-animated SVG paths (`wave-vector`) to create a convincing maritime environment without heavy assets.
- **Tactical UX:** Clear distinction between player (gold/secondary) and enemy (error/red) status indicators.
- **Engine Binding:** Well-structured to receive real ship HP and stats from the `GameEngine`.
- **Interactivity:** The "Broadside Volley" button is positioned for quick access during tense combat phases.
- **Responsive Design:** Central arena scales, while status panels are fixed to margins to ensure readability across resolutions.

## 6. Layout Diagram
```
[Header: Navigation & Global Context]
-----------------------------------------------------------
| [Flagship Status] |       [Tactical Arena]      | [Wind] |
| (Left Sidebar)    |       (Ship Icons & Lines)  | (Right)|
|                   |                             | [Log]  |
-----------------------------------------------------------
|                   | [Combat Actions Row]        |        |
-----------------------------------------------------------
[Ocean Wave Background Effect]
```
