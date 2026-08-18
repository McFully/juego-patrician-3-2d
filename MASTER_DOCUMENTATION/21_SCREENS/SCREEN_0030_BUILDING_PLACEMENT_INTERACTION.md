# SCREEN_0030: Building Placement Interaction



## 1. Metadata

- **ID:** SCREEN_0030

- **Name:** Building Placement Interaction

- **File:** `src/screens/BuildingPlacementInteraction.tsx`

- **Route:** `/building-placement` (presumably)

- **Context:** Precise placement of new industrial and residential buildings within a city.



## 2. Description

This screen provides an isometric environment where players can physically place buildings on the city grid. It includes a "ghost" preview of the building, real-time validation of the location (checking for obstacles), and a detailed breakdown of costs and requirements before confirming the construction.



## 3. Key Features

- **Isometric Grid Simulation:** Uses CSS 3D transforms (`rotateX`, `rotateZ`) to create a tactical building environment.

- **Ghost Placement:** A transparent preview of the building (`Brickwork`, `Sawmill`, etc.) follows the player's intent.

- **Placement Validation:** Visual indicators (`cell-valid`, `cell-invalid`) show if the current spot is suitable for construction.

- **Cursor-Follow Tooltip:** Displays immediate construction costs (Bricks, Wood) and maintenance near the placement point.

- **Construction Action Wheel:** A circular UI element for selecting building types and confirming actions.

- **Building Info Sidebar:** Detailed description, labor needs (artisans), and flavor text for the selected structure.



## 4. State Management

- **Engine Integration:** 

  - Retrieves player gold and city population from `useGame` / `usePlayer`.

  - Executes `engine.buildFactory(factoryId)` to commit the construction to the simulation.

- **Local State:** 

  - `selectedFactory`: Tracks which building is currently being placed.

  - `statusMsg`: Provides feedback on construction success or failure.



## 5. Forensic QA Notes

- **UI Technique:** Excellent use of CSS transforms for the isometric effect without requiring a full 3D engine.

- **Functional Integration:** Direct link to `engine.buildFactory` makes this a core gameplay loop component.

- **Interactive Feedback:** Valid/Invalid cell highlighting provides clear UX for building placement.

- **Encoding Issues:** Corrupted Spanish characters in text and descriptions (e.g., `Construcción`, `Herrería`).

- **Potential Bug:** The "cursor-follow" tooltip is styled in CSS but lacks the React `onMouseMove` logic to actually track the mouse position in the provided snippet.



## 6. Layout Diagram

```

[Header: Navigation & City Stats]

-----------------------------------------------------------

| [Building Info] |                                       |

| (Sidebar)       |       [Isometric City Grid]           |

|                 |       (Ghost Preview & Cells)         |

| [Confirm BTN]   |                                       |

-----------------------------------------------------------

|                 |                   [Action Wheel]      |

-----------------------------------------------------------

[Floating Tooltip (at Cursor)]

```

