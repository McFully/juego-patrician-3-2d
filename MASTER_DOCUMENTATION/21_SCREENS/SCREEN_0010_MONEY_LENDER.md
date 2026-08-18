# SCREEN: MONEY LENDER

## 1. Overview
The **Money Lender** handles debt, new loans, and credit ratings.

## 2. Component Structure
- **Root**: `MoneyLender.tsx`

## 3. Data Flow
### 3.1 Sources
- **`usePlayer()`**: Gold.
- **`ACTIVE_LOANS`**: Hardcoded array.

### 3.2 Sinks
- `engine.takeLoan`, `engine.repayLoan`.

## 4. State Management
| State | Type | Description |
|---|---|---|
| `msg` | `string` | UI feedback. |

## 5. UI Layout (Wireframe)
(Reconstructed from source analysis)
```text
+-----------------------------------------------------------+
| [Back]   PRESTAMISTA DE LA CIUDAD       [ CREDIT: A+ ]    |
+-----------------------------------------------------------+
| ACTIVE LOANS           | NEW OFFERS                       |
| [ Loan #1 ] [ Repay ]  | [ Small ] [ Med ] [ Large ]      |
| [ Loan #2 ] [ Repay ]  | Int: 12%   Int: 8%   Int: 5%     |
+-----------------------------------------------------------+
```

## 6. Forensic Audit Notes (QA)
- **Purely Hardcoded**: All loans, offers, and reputation are hardcoded.
- **Disconnected Engine**: Repaying a hardcoded loan sends a static ID (1 or 2) to the engine.
