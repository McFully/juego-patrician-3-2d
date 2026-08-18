# SCREEN_0029: Baltic Winter Logistics



## 1. Metadata

- **ID:** SCREEN_0029

- **Name:** Baltic Winter Logistics

- **File:** `src/screens/BalticWinterLogistics.tsx`

- **Route:** `/winter`

- **Context:** Seasonal management of resources and trade during the harsh Baltic winter.



## 2. Description

This screen manages the unique challenges of the winter season in the Baltic. It tracks food and fuel reserves, sea ice thickness, and social unrest. Players must make critical decisions to release emergency supplies to prevent starvation and riots when sea trade is restricted by ice.



## 3. Key Features

- **Resource Reserves Monitoring:** Progress bars for Grain and Firewood with depletion rate and "days remaining" estimates.

- **Thaw Countdown:** A prominent visual timer showing the time remaining until spring.

- **Frozen Routes Map:** A tactical map indicating which ports are inaccessible due to ice and which lanes remain open.

- **Emergency Actions:** Buttons to "Liberar Grano de Emergencia" and "Asignar Lea de Reserva," directly impacting simulation state.

- **Climate Indicators:** Real-time display of local temperature (-18C) and social unrest levels (e.g., "CRTICO").

- **Visual Theming:** Grayscale, frosted UI elements and ice textures to convey the season.



## 4. State Management

- **Engine Integration:** 

  - Retrieves data from `state.winter` via `useSimulationState`.

  - Executes `engine.VenderGood` and `engine.buyGood` for emergency resource management.

- **Local State:** `msg` state to provide feedback on actions performed.



## 5. Forensic QA Notes

- **Mechanic Integration:** Correctly hooks into the engine's seasonal simulation logic.

- **Navigation:** Links to `Convoy Manager` (for icebreakers) and `Diet Hall` (for political winter council).

- **Encoding Issues:** Spanish accents are corrupted in the source (e.g., `CRÍTICO`, `Leña`). This needs fixing in the source file for correct rendering.

- **Visuals:** High-quality atmospheric backdrop. Map markers use CSS animations for a "live" radar feel.

- **Responsiveness:** Primarily designed for full-screen desktop, but utilizes a flexible grid system.



## 6. Layout Diagram

```

[Header: Navigation & "Severe Frost" Warning]

-----------------------------------------------------------

| [Reserves] |        [Thaw Timer]        | [Ice Map]     |

| (Depletion)|        (Spring ETA)        | (Blocked/Open)|

-----------------------------------------------------------

|            | [Quick Actions: Fleet/Diet]| [Global Stats]|

-----------------------------------------------------------

[Emergency Button (Floating)]

```

