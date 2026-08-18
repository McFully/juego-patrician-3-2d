# SCREEN_0038: Official Landing Page



## 1. Metadata

- **ID:** SCREEN_0038

- **Name:** Official Landing Page

- **File:** `src/screens/OfficialLandingPage.tsx`

- **Route:** `/` or `/landing`

- **Context:** Primary marketing and entry point for the "Hanseatic Strategos" ecosystem.



## 2. Description

The Official Landing Page is a professional, high-fidelity marketing site designed to showcase the game's features and atmosphere. It uses epic cinematic visuals of medieval Lbeck, detailed breakdowns of core gameplay pillars (Trade, Build, Conquer), and social proof in the form of "historical" testimonials. It serves to convert visitors into players and establish the premium maritime theme.



## 3. Key Features

- **Hero Section:** High-impact panoramic view of Lbeck at sunset with a compelling headline and dual CTAs ("Jugar Ahora", "Ver Demostracin").

- **Core Pillars Section:** Three cards highlighting the main gameplay loops: Economics, Architecture, and Naval Warfare, each with thematic icons.

- **Feature Showcase Grid:** A "Gobierna Cada Detalle" section using a bento-style grid to highlight specific modules like the dynamic map, fleet management, and council politics.

- **Historical Testimonials:** Fictional quotes from historical figures (e.g., Mayor Hinrich Castorp) using high-detail AI portraits to build immersion and credibility.

- **Professional Footer:** Includes essential links (Privacy, Terms, Support) and mandatory global branding/copyright metadata.



## 4. State Management

- **Local State:** None; purely presentational.

- **Navigation:** Links to the main game entry point and auxiliary informational pages.



## 5. Forensic QA Notes

- **Branding Alignment:** Perfectly follows the "Hanseatic Strategos" identity and the AntiGravity Master Protocol regarding publisher branding (Aritz Bahamonde Larx).

- **Visual Excellence:** Utilizes sophisticated CSS (backdrop-blur, text-shadow-glow, gradients) and high-quality AI imagery.

- **Encoding Issues:** Frequent corrupted Spanish characters (e.g., `Hanseática`, `Nóvgorod`, `dinastía`).

- **Interaction Protocol:** Adheres to non-intrusive protocols; provides clear navigation and information without forced popups.

- **Responsiveness:** Designed with a mobile-first approach using Tailwind's responsive grid system.



## 6. Layout Diagram

```

[Header: Navigation & Global Context (Fixed)]

-----------------------------------------------------------

| [Hero: Cinematic Backdrop & CTAs]                       |

-----------------------------------------------------------

| [Core Pillars: Trade, Build, Conquer]                   |

-----------------------------------------------------------

| [Feature Grid: Map, Fleet, Council, Ledger]             |

-----------------------------------------------------------

| [Historical Testimonials / Quotes]                      |

-----------------------------------------------------------

| [Final CTA: "Iniciar Strategos"]                        |

-----------------------------------------------------------

[Footer: Brand & Copyright]

```

