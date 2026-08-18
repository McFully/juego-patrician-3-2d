# SCREEN: FINANCIAL LEDGER

## 1. Overview
Breakdown of economic activity, transactions, and investments.

## 2. Component Structure
- **Root**: `FinancialLedger.tsx`

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Engine context.

### 3.2 Sinks
- Navigation only.

## 4. UI Layout (Wireframe)
```text
+-----------------------------------------------------------+
| [Back]   LIBRO MAYOR FINANCIERO         [ TOTAL: 124k ]   |
+-----------------------------------------------------------+
| WEEKLY SUMMARY         | TRANSACTION LOG                  |
| Revenue: 15,000g       | [12/10] Sold Grain (+120g)       |
| Expenses: 5,000g       | [11/10] Paid Sailors (-40g)      |
+-----------------------------------------------------------+
```

## 5. Forensic Audit Notes (QA)
- **No Engine Integration**: Transaction table uses hardcoded historical data instead of server logs.
- **ROI**: Percentages are hardcoded strings.
