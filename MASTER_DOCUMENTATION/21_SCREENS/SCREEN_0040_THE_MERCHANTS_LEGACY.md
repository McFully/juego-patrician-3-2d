# SCREEN_0040: The Merchant's Legacy

## 1. Metadata
- **ID:** SCREEN_0040
- **Name:** The Merchant's Legacy
- **File:** `src/screens/TheMerchantSLegacy.tsx`
- **Route:** `/legacy`
- **Context:** Dynasty summary, end-game statistics, and achievement museum.

## 2. Description
The Merchant's Legacy screen serves as a grand epilogue to a player's campaign or a summary of their current dynasty's standing. it celebrates the player's achievements through a "Museum" of progress, a family lineage tree, and a commemorative monument. It provides a sense of closure and historical impact for the merchant house.

## 3. Key Features
- **Dynasty Summary:** Displays a high-level "Historical Impact" score and a conferred title based on performance (e.g., Arch-Magnate).
- **Lineage Tree:** A visual family tree showing the founder and descendants, utilizing pixel art portraits for a distinct "ancestral" look.
- **Museum of Achievements:** A collection of badges and progress bars for various mastery areas: Fleet Admiral, Goldhoarder, Metropolis King, Cartographer, Diplomat, and Monopolist.
- **Monument of Merit:** A thematic section featuring a marble statue and honorific title dedicated to the player's main character.
- **Path of Conquest Timeline:** A horizontal timeline visualizing major historical milestones achieved during the game (e.g., annexation of ports, imperial favor).
- **Restart/Share Actions:** Buttons to start a new game lineage or share the current achievements ("Record to Chronicles").

## 4. State Management
- **Local State:** Primarily presentational; uses `useLocation` for navigation.
- **Data Structures:** Utilizes `ACHIEVEMENTS` and `TIMELINE` arrays to populate the museum and path sections.

## 5. Forensic QA Notes
- **Visual Stylings:** Combines the core glassmorphism aesthetic with specialized textures (marble monument, pixel art portraits) to create a unique "end-game" feel.
- **Information Architecture:** Effectively summarizes a long-term simulation into a single, readable screen.
- **Interactive Details:** Includes hover effects on achievement badges and lineage nodes to reveal additional detail or provide a sense of reactivity.
- **Mobile Adaptability:** The horizontal timeline and bento-grid achievements are designed to stack on smaller screens.
- **Consistency:** Uses the established gold/navy palette but shifts toward brighter, more celebratory tones.

## 6. Layout Diagram
```
[Header: Navigation & Brand]
-----------------------------------------------------------
| [Legacy Hero: Title & Impact Score]                     |
-----------------------------------------------------------
| [Family Lineage Tree] (8 cols) | [Monument] (4 cols)    |
| - Portraits & Dates            | - Statue Image         |
|                                | - Honorific Text       |
-----------------------------------------------------------
| [Museum of Achievements: Grid of 6 Icons/Bars]          |
-----------------------------------------------------------
| [Path of Conquest: Horizontal Timeline]                 |
-----------------------------------------------------------
| [Begin New Lineage BTN] | [Share Chronicles BTN]        |
-----------------------------------------------------------
```
