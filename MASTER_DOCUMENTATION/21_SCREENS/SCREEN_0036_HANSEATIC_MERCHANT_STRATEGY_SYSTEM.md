# SCREEN_0036: Hanseatic Merchant Strategy System

## 1. Metadata
- **ID:** SCREEN_0036
- **Name:** Hanseatic Merchant Strategy System
- **File:** `src/screens/HanseaticMerchantStrategySystem.tsx`
- **Route:** `/strategy` (presumably)
- **Context:** High-level strategic planning and long-term objective tracking for the merchant empire.

## 2. Description
The Grand Strategy screen provides a birds-eye view of the player's progress across the three main domains of the game: Economy, Navy, and Diplomacy. It visualizes the current campaign phase, tracks progress toward major strategic goals (e.g., salt monopoly, naval hegemony), and provides AI-driven recommendations based on current game conditions.

## 3. Key Features
- **Strategic Pillars:** Three distinct panels for Economic Supremacy, Naval Dominance, and Diplomatic Influence, each tracking three key metrics and three long-term objectives.
- **Objective Progress Bars:** Visual tracking of completion percentages for major goals, with highlighted rewards upon completion.
- **Strategic Progress Chart:** A bar chart visualizing growth over game decades (1350-1400), showing the player's cumulative success.
- **Campaign Timeline:** A connected node timeline showing the evolution of the player's career through different eras (Expansion, Domination, etc.).
- **Smart Recommendations:** A section providing "High", "Medium", and "Low" priority advice, such as responding to rising piracy or upcoming council elections.

## 4. State Management
- **Engine Integration:** 
  - Designed to aggregate data from multiple simulation modules (Economy, Naval, Politics).
  - Uses `useLocation` for navigation back to the world map or other management screens.
- **Local State:** Primarily static mock data in the current implementation, serving as a template for real-time engine binding.

## 5. Forensic QA Notes
- **Visual Sophistication:** One of the most visually complex screens, utilizing CSS gradients, backdrop filters, and intricate SVG-like layouts for the charts.
- **Information Density:** High information density handled well through clear categorization and visual hierarchy.
- **Thematic Integration:** The backdrop image and glassmorphic styling reinforce the "Hanseatic Strategos" brand identity.
- **Actionable UI:** Recommendations include "Review Strategy" links, providing a direct path to addressing identified issues.
- **Scalability:** The pillar-based architecture allows for additional strategic domains to be added easily.

## 6. Layout Diagram
```
[Header: Global Navigation & Brand]
-----------------------------------------------------------
| [Economic Pillar]   | [Naval Pillar]    | [Diplomatic]  |
| - Metrics (3)       | - Metrics (3)     | - Metrics (3) |
| - Objectives (3)    | - Objectives (3)  | - Objectives (3)|
-----------------------------------------------------------
| [Progress Chart] (7 cols)    | [Campaign Phases] (5 col)|
-----------------------------------------------------------
| [Strategic Recommendations: High / Medium / Low]        |
-----------------------------------------------------------
```
