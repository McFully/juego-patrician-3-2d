# SCREEN_0027: Architects Guild Research



## 1. Metadata

- **ID:** SCREEN_0027

- **Name:** Architects Guild Research

- **File:** `src/screens/ArchitectsGuildResearch.tsx`

- **Route:** `/architects-guild`

- **Context:** Research and development of city infrastructure and technology.



## 2. Description

The Architects Guild Research screen allows players to invest in technological advancements for their cities. It features a horizontal tech tree layout with categories for warehousing, fortifications, and sanitation. Players can track progress on current research and unlock new tiers of infrastructure.



## 3. Key Features

- **Categorized Tech Trees:** Switch between different research branches (Warehousing, Fortifications, Sanitation).

- **Progress Tracking:** Visual representation of researched, active, and locked technologies.

- **Research Details Panel:** Displays specific benefits, time remaining, and cost for the currently selected/active research.

- **Acceleration Mechanism:** Button to speed up research (presumably with gold or influence).

- **Blueprint UI:** Thematic background and node styling matching the architectural context.



## 4. State Management

- **Local State:** 

  - `activeCategory`: String identifying the currently displayed tech branch.

- **Mock Data:** `TECH_CATEGORIES` and `TECH_TREES` provide the structural information for the UI.



## 5. Forensic QA Notes

- **Navigation:** Header links are functional and use `wouter`.

- **Interactivity:** Category switching is responsive. Node hover effects are present.

- **Visuals:** Uses glassmorphic effects and a blueprint grid pattern. High-quality AI-generated imagery for portraits and technical drawings.

- **Engine Integration:** Currently uses static mock data. Needs binding to the `GameEngine` research state.

- **Encoding:** Some special characters (e.g., `Pública`) suggest UTF-8 encoding issues in the source file or during display.

- **Responsiveness:** Horizontal scroll implemented for the tech tree, but layout is primarily designed for desktop.



## 6. Layout Diagram

```

[Header: Navigation & Prestige]

[Category Sidebar (Left)] [Main Research Tree (Center)] [Detail Panel (Right)]

[Stats Bar (Floating Bottom)]

```

