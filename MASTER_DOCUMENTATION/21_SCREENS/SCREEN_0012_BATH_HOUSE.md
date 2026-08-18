# SCREEN: THE BATH HOUSE

## 1. Overview
Political intrigue venue: councilor interaction and bribes.

## 2. Component Structure
- **Root**: `TheBathHouse.tsx`

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: World context.

### 3.2 Sinks
- UI Toasts only.

## 4. UI Layout (Wireframe)
```text
+-----------------------------------------------------------+
| [Back]   CASA DE BAÑOS                  [ INTRIGUE: M ]   |
+-----------------------------------------------------------+
| COUNCILORS IN HOUSE    | RUMORS & SECRETS                 |
| [ Councillor A ] [ $ ] | "The Mayor is weak..."           |
| [ Councillor B ] [ $ ] | "Pirates in Visby..."            |
+-----------------------------------------------------------+
```

## 5. Forensic Audit Notes (QA)
- **Lack of Persistence**: Bribes do not decrease gold or increase influence in the engine.
- **Mock Rumors**: All rumors in the sidebar are hardcoded strings.
