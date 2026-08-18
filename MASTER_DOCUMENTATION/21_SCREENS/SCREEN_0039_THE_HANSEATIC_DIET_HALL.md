# SCREEN_0039: The Hanseatic Diet Hall

## 1. Metadata
- **ID:** SCREEN_0039
- **Name:** The Hanseatic Diet Hall
- **File:** `src/screens/TheHanseaticDietHall.tsx`
- **Route:** `/diet-hall` (presumably)
- **Context:** High-level political elections and league-wide policy decisions.

## 2. Description
The Hanseatic Diet Hall (Hansetag) is where the most powerful merchants and city representatives gather to elect the Grand Alderman of the Hanseatic League. It visualizes the political weight of various cities and allows the player to influence league-wide politics by casting their vote for candidates with different strategic platforms.

## 3. Key Features
- **Grand Alderman Election:** A formal election process with distinct candidates representing different political ideologies (e.g., Expansionist vs. Isolationist).
- **Influence Map:** A tactical map showing the current voting power of major Hanseatic cities like Lübeck and Danzig.
- **Vote Weighting System:** Displays the player's specific contribution to the total vote (e.g., 12.5%) based on their mercantile, military, and political reputation.
- **Candidate Profiles:** Detailed cards for each candidate including their portrait, political stance, and current percentage of support.
- **Reputation Metrics:** Visual tracking of the player's Standing in various domains (Mercantile, Military, Political).
- **Live Session HUD:** Includes a "LIVE SESSION" indicator to convey real-time political events.

## 4. State Management
- **Engine Integration:** 
  - Accessed via `useGame`.
  - Intended to sync with global league simulation and political reputation scores.
- **Local State:** 
  - `selectedCandidate`: Tracks the player's choice before casting the vote.
  - `feedback`: Manages temporary confirmation messages post-voting.

## 5. Forensic QA Notes
- **Atmospheric UI:** Uses a grand, golden-accented theme with backdrop filters to create a sense of legislative importance.
- **Tactical Information:** The breakdown of "Vote Weight" provides clear feedback on how the player's actions in other parts of the game (trade, war) translate into political power.
- **Candidate Variety:** Candidates have specific "Political Stances" which likely influence the global simulation if they win (e.g., Expansionist might reduce trade costs but increase pirate risk).
- **Polish:** High attention to visual detail, including pulsing animations for live indicators and hover effects on city nodes.

## 6. Layout Diagram
```
[Header: Navigation & Prestige]
-----------------------------------------------------------
| [Diet Title & Context]                                  |
-----------------------------------------------------------
| [Influence Map] (8 cols)    | [Candidates] (4 cols)     |
| - City Nodes & Weights      | - Portrait / Stance       |
| - [Stats: Mercantile/Mil]   | - Support %               |
| - [Total Reputation Score]  | - [CAST VOTE BTN]         |
-----------------------------------------------------------
```
