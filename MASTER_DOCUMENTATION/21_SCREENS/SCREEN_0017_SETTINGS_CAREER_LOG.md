# SCREEN: SETTINGS & CAREER LOG (Ajustes y Registro de Carrera)

## 1. Overview
The **Settings & Career Log** screen provides a centralized hub for game configuration (audio, graphics, gameplay) and a detailed historical record of the player's achievements, rank progression, and milestones.

## 2. Component Structure
- **Root**: `SettingsCareerLog.tsx`
- **Internal Modules**:
  - `Settings Tabs`: Toggle between Game, Audio, Video, and Account.
  - `Career Timeline`: A scrollable list of historical events.
  - `Player Badge`: Visual representation of current rank and prestige.
- **Note**: Uses `glass-panel` for the main container and Montserrat for all typography.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: For global settings state.
- **`usePlayer()`**: For career history and stats.
- **`game_constants.json`**: For default setting ranges.

### 3.2 Sinks (Engine Calls)
- `engine.updateSettings(newSettings)`
- `engine.resetCareer()` (Confirmation required)

## 4. State Management
| State | Type | Description |
|---|---|---|
| `activeTab` | `string` | Currently selected setting category. |
| `isDirty` | `boolean` | Whether settings have been modified but not saved. |
| `historyFilter` | `string` | Filter for the career log (All, Triumphs, Failures). |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   AJUSTES Y REGISTRO DE CARRERA       Ver: v1.0.5     |
+-------------------------------------------------------------+
| [ OPCIONES ] | [ MI CARRERA ] | [ LOGROS ]                  |
+-------------------------------------------------------------+
| SETTINGS PANEL               | CAREER LOG                   |
| - Music Vol: [====] 80%      | 1350: Promoted to Merchant   |
| - SFX Vol:   [==  ] 40%      | 1351: Built first Warehouse  |
| - Language:  [ Spanish ]     | 1352: Survived City Siege    |
| - Autosave:  [ ON ]          | 1353: Elected Lord Mayor     |
|                              |                              |
| [ APPLY ] [ DEFAULTS ]       | [ Export Log ]               |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Live Preview**: Audio volume changes apply immediately.
- **Career Persistence**: The career log is read-only and immutable once an event is recorded.
- **Version Display**: Shows the build version as defined in `package.json`.

## 7. Forensic Audit Notes (QA)
- **Check**: Ensure `localStorage` is used for non-simulation settings (like volume).
- **Consistency**: Branding must show "Aritz Bahamonde Larxé" in the footer or "About" section.
