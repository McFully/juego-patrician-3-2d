# SCREEN: CATHEDRAL

## 1. Overview
Reputation management: donations, charity, and building expansions.

## 2. Component Structure
- **Root**: `Cathedral.tsx`

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: State and Date.

### 3.2 Sinks
- UI Toasts only.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `showModal` | `boolean` | Toggle for donation popup. |

## 5. UI Layout (Wireframe)
```text
+-----------------------------------------------------------+
| [Back]   CATEDRAL DE SANTA MARIA        [ PRESTIGE: 84 ]  |
+-----------------------------------------------------------+
| SERVICES               | CITY CHARITY                     |
| [ Mass ] [ Blessing ]  | [ Donate Food ] [ Donate Gold ]  |
+-----------------------------------------------------------+
| [ EXPANSION PROJECTS ] | [ PRAYER LOG ]                   |
+-----------------------------------------------------------+
```

## 6. Forensic Audit Notes (QA)
- **Mockup Only**: Buttons for "Blessing", "Donate", and "Fund" only trigger UI toasts; they do not modify engine state.
- **Hardcoded Stats**: Devotion, Popularity, and Reputation are static values.
