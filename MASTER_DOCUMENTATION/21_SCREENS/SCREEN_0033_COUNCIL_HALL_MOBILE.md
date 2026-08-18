# SCREEN_0033: Council Hall Mobile



## 1. Metadata

- **ID:** SCREEN_0033

- **Name:** Council Hall Mobile

- **File:** `src/screens/CouncilHallMobile.tsx`

- **Route:** `/council-hall-mobile` (presumably)

- **Context:** Mobile-optimized political management and legislative influence.



## 2. Description

This screen provides a streamlined interface for the Council Hall, tailored for mobile devices. It allows players to manage city decrees and interact with individual councilors through a tabbed interface. Players can use their wealth and influence to pass or veto legislation and bribe councilors to increase their support.



## 3. Key Features

- **Tabbed Mobile Navigation:** Switch between "Decretos" (Decrees) and "Concejales" (Councilors) views.

- **Decree Management:** Lists pending laws with descriptive labels, vote progress bars (Pendiente, Aprobndose, Fallando), and quick action buttons for voting or vetoing.

- **Councilor Profiles:** Displays councilor names, factions, and current support levels. Includes a direct "Sobornar" (Bribe) action.

- **Immediate Feedback:** Displays a temporary message at the top of the screen after a political action is taken.

- **Mobile-First Layout:** Uses high-contrast typography and large touch targets suitable for handheld play.



## 4. State Management

- **Engine Integration:** 

  - Retrieves `currentCityId` from `useGame`.

  - Executes `engine.bribeCouncillor(cityId, index, amount)` for both bribes and votes (as a form of financial influence).

- **Local State:** 

  - `tab`: Controls which view is active.

  - `feedback`: Stores the confirmation message for user actions.



## 5. Forensic QA Notes

- **Action Naming:** The "VOTAR S" button maps to `engine.bribeCouncillor`, suggesting that in this simulation, voting and bribery are both handled as financial influence operations.

- **UI Efficiency:** Excellent use of progress bars to show political momentum at a glance.

- **Encoding Issues:** Corrupted characters for Spanish accents (e.g., `Atrás`, `Aprobándose`).

- **Responsive Design:** Strictly vertical layout with fixed headers/footers, following modern mobile app patterns.

- **Functional Integrity:** Direct link to engine methods ensures real impact on the city simulation.



## 6. Layout Diagram

```

[Header: Back, Icon, "Sala del Concejo", Gold]

-----------------------------------------------------------

| [Decretos Tab]              | [Concejales Tab]          |

-----------------------------------------------------------

|                                                         |

|  [Decree Card]              OR   [Councilor Card]       |

|  - Title / Desc                  - Avatar / Name        |

|  - Progress Bar                  - Faction              |

|  - Vote/Veto BTNs                - Support Bar          |

|                                  - Bribe BTN            |

|                                                         |

-----------------------------------------------------------

[Feedback Toast]

```

