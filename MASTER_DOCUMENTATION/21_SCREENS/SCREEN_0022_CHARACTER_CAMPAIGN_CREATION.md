# SCREEN: CHARACTER & CAMPAIGN CREATION (Creación de Personaje y Campaña)

## 1. Overview
This is the starting point for new players. It allows selecting a starting city, character background (traits), and campaign difficulty/length.

## 2. Component Structure
- **Root**: `CharacterCampaignCreation.tsx`
- **Internal Modules**:
  - `City Selector`: Interactive map or list of starting ports.
  - `Trait Selector`: Perks and flaws (e.g., "Master Navigator", "In debt").
  - `Difficulty Slider`: Adjusts economic ruthlessness.

## 3. Data Flow
### 3.1 Sources
- **`CITIES_CONFIG`**: List of valid starting cities.
- **`TRAITS_DATABASE`**: Available perks/traits.

### 3.2 Sinks (Engine Calls)
- `engine.createNewGame(config)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `charName` | `string` | Player name. |
| `startCity` | `string` | ID of the chosen starting city. |
| `selectedTraits`| `string[]` | IDs of chosen traits. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
|        NUEVA CARRERA HANSEÁTICA - AÑO 1350                  |
+-------------------------------------------------------------+
| NOMBRE: [__________]       | CIUDAD DE INICIO: [ Lubeck ]   |
|                            | (Grains, Beer, Bricks)         |
+----------------------------+--------------------------------+
| RASGOS:                    | DIFICULTAD:                    |
| [ ] Mercader Astuto (+10%) | [====|-------] MEDIA           |
| [ ] Lobo de Mar (Velocidad)|                                |
| [ ] Herencia Familiar      | [ COMENZAR AVENTURA ]          |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Mutual Exclusivity**: Certain traits cannot be selected together (e.g., "Rich Parent" and "In Debt").
- **City Impact**: Starting city determines initial goods prices and available ships.

## 7. Forensic Audit Notes (QA)
- **Visuals**: Use high-quality portrait placeholder (e.g., `public/images/portrait_default.png`).
- **Validation**: "Start Adventure" button is disabled until a name and city are selected.
