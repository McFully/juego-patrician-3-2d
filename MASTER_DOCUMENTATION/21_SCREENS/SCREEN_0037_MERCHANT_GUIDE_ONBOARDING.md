# SCREEN_0037: Merchant Guide Onboarding



## 1. Metadata

- **ID:** SCREEN_0037

- **Name:** Merchant Guide Onboarding

- **File:** `src/screens/MerchantGuideOnboarding.tsx`

- **Route:** Initial load or `/onboarding`

- **Context:** New player introduction to core game mechanics and UI elements.



## 2. Description

The Merchant Guide Onboarding is an interactive tutorial led by "Gunnar the Old," a veteran merchant. It uses a modal overlay to guide players through the basic interface elements, such as gold tracking, market prices (Grain, Herring, Salt), and executing trade orders. It establishes the game's setting and provides essential mechanical context.



## 3. Key Features

- **Guided Dialogue System:** A multi-step conversation with a character portrait, providing flavor text and instructions.

- **UI Focused Overlay:** A semi-transparent backdrop that highlights specific parts of the main game interface (market, gold, convoys).

- **Progress Tracking:** A visual progress bar within the dialogue box showing how far the player is through the tutorial.

- **Highlighted Elements:** CSS-animated rings intended to draw attention to specific UI components during the guide steps.

- **Market Preview:** Displays a functional-looking market view with price fluctuations (Low, Stable, Scarcity) to illustrate trading concepts.



## 4. State Management

- **Local State:** 

  - `step`: Tracks the current index in the `STEPS` array.

  - `visible`: Toggles the entire onboarding overlay.

- **Navigation:** Returns control to the main game interface (closes the overlay) once completed or skipped.



## 5. Forensic QA Notes

- **Highlighting Logic:** The HTML includes `ring-gold` and `ring-trade` elements, but they are currently set to `hidden`. A fully functional version would require these to be positioned and shown dynamically based on the current step.

- **Encoding:** Significant encoding issues in the Spanish dialogue text (e.g., `recién`, `gobernar el Báltico`).

- **Visuals:** High-quality character portrait and historical map backdrop consistent with the "Hanseatic Strategos" aesthetic.

- **User Agency:** Includes a "Skip Tutorial" option, adhering to AntiGravity interaction protocols (minimizing intrusive forced actions).



## 6. Layout Diagram

```

[Header: Navigation & Gold (Highlighted during step 2)]

-----------------------------------------------------------

| [Market View]               | [Active Convoy]           |

| (Highlighted during step 3) |                           |

|                             |                           |

| [Execute Trade BTN]         |                           |

| (Highlighted during step 4) |                           |

-----------------------------------------------------------

| [Onboarding Overlay (Modal)]                            |

| - Character Portrait (Left)                             |

| - Dialogue Text (Right)                                 |

| - Progress Bar & [Continue BTN]                         |

-----------------------------------------------------------

```

