# SCREEN_0031: Cathedral Works Charity

## 1. Metadata
- **ID:** SCREEN_0031
- **Name:** Cathedral Works Charity
- **File:** `src/screens/CathedralWorksCharity.tsx`
- **Route:** `/cathedral-charity` (presumably)
- **Context:** Philanthropy and social influence through the funding of religious and civic projects.

## 2. Description
This screen allows players to donate funds to various charitable works and the ongoing construction of the city's cathedral. These actions improve public favor, social class happiness, and political prestige (Council votes). It serves as a secondary progression system tied to the city's development and the player's reputation.

## 3. Key Features
- **Civic Landmark Progress:** Tracks the phases of cathedral construction (e.g., Phase 3 of 5) and displays the cumulative Public Favor bonus.
- **Sacred Commissions:** A list of specific projects players can fund, such as the Cathedral Spire, solstice festivals, or hospital wings, each with distinct costs and rewards.
- **Social Dynamics Panel:** Visualizes the impact of the player's actions on different social strata (Plebeians, Merchants, Patricians) with happiness/efficacy bars and quotes.
- **Active Project Tracker:** Shows current construction status (e.g., "Flying Buttresses") and days until completion.
- **Stained-Glass UI:** Unique CSS-based visual accents that reinforce the religious/gothic theme of the screen.

## 4. State Management
- **Engine Integration:** 
  - Accessed via `useGame`.
  - Intended to use `engine` methods for committing funds (currently mocked in the `handleAction` wrapper).
- **Local State:** `feedback` state displays temporary confirmation messages after a donation.

## 5. Forensic QA Notes
- **Atmospheric Design:** High attention to detail in the visual theme, including gradients and CSS masks for a stained-glass effect.
- **System Feedback:** The use of an animated pulse for feedback after committing funds provides good UX.
- **Progression Hook:** The multi-phase cathedral construction provides a long-term goal for excess capital.
- **Encoding:** This file appears to have cleaner encoding than previous ones, with proper Spanish characters in the source.
- **Navigation:** Header is fully functional and consistent with the rest of the app.

## 6. Layout Diagram
```
[Header: Navigation & Prestige]
-----------------------------------------------------------
| [Cathedral Landmark Status & Favor Bar]                |
-----------------------------------------------------------
| [Sacred Commissions]      | [Social Dynamics]           |
| (Spire, Festival, etc.)   | (Class Happiness/Efficacy)  |
|                           | [Active Project Tracker]    |
-----------------------------------------------------------
[Feedback Toast (Floating)]
```
