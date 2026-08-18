# SCREEN: VICTORY HISTORICAL SUMMARY (Resumen Histórico de Victoria)

## 1. Overview
The **Victory Historical Summary** is an end-game "Hall of Fame" style screen that presents the player's achievements, total wealth, and historical legacy after completing a campaign.

## 2. Component Structure
- **Root**: `VictoryHistoricalSummary.tsx`
- **Internal Modules**:
  - `Hero Section`: Cinematic background with title and rank.
  - `Legacy Stats`: Major metrics (Wealth, Fleet, Rank).
  - `Growth Chart`: Visual representation of economic progress.
  - `Fleet Breakdown`: Progress bars for different ship classes.
  - `Council Hegemony`: Social/Political status indicator.

## 3. Data Flow
### 3.1 Sources
- **`FLEET`, `BARS` (Constants)**: Hardcoded data representing a "successful" campaign state.
- **`useLocation()`**: For navigation back to main menu.

### 3.2 Sinks (Engine Calls)
- None. This is a read-only presentation screen.

## 4. State Management
- No internal state beyond navigation.

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------+
|  Hanseatic Strategos            [Notifications][User] |
+-------------------------------------------------------+
|                                                       |
|           EL AUGE DEL PATRICIO                        |
|     "Your name is carved in eternal stone..."         |
|                                                       |
|  +---------------------+  +-------------------------+ |
|  | HISTORICAL LEGACY   |  | ECONOMIC GROWTH (CHART) | |
|  | Rank: Patrician     |  |                         | |
|  | Wealth: 4.2M DUC    |  | [_][_][_][_][#][#][#]   | |
|  +---------------------+  +-------------------------+ |
|                                                       |
|  [ REVIEW CHRONICLE ]      [ MAIN MENU ]              |
+-------------------------------------------------------+
```

## 6. Logic & Rules
- **Visual Effects**: Uses `victory-glow` shadows and `glass-panel-heavy` for emphasis.
- **Cinematic Background**: Uses a dramatic AI-generated image of a Hanseatic town square.
- **Progress Animation**: Economic chart bars are styled with transitions (though static in current React render).

## 7. Forensic Audit Notes (QA)
- **Static Content**: The entire screen is currently static/mocked. It does not pull real data from the `GameEngine` or a saved state yet.
- **Naming**: The rank "Señor Patricio" and wealth "4,280,500" are hardcoded.
- **Internationalization**: Contains UTF-8 characters for Spanish (e.g., `Campaña`, `Patricio`) which may require proper encoding handling in some environments.
