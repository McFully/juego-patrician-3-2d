# SCREEN: CONSTRUCTION WHEEL

## 1. Overview
Radial interface for building structures.

## 2. Component Structure
- **Root**: `ConstructionActionWheel.tsx`

## 3. Data Flow
### 3.1 Sources
- **`usePlayer()`**: Resources.

### 3.2 Sinks
- Console logs and toasts.

## 4. Forensic Audit Notes (QA)
- **Logic Gap**: `showTooltip` only logs to console; the UI element is never shown by React.
- **Static Reserves**: Material counts are static text.
