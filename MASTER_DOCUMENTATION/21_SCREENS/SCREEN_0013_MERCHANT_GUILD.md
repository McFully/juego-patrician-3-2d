# SCREEN: MERCHANT GUILD

## 1. Overview
Auctions, expeditions, and global merchant rankings.

## 2. Component Structure
- **Root**: `MerchantGuild.tsx`

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: State.

### 3.2 Sinks
- Navigation only.

## 4. UI Layout (Wireframe)
```text
+-----------------------------------------------------------+
| [Back]   GREMIO DE MERCADERES           [ RANK: TRADER ]  |
+-----------------------------------------------------------+
| ACTIVE AUCTIONS        | GLOBAL RANKING                   |
| [ Cog "Maria" ] [ BID ]| 1. Player (Aritz)                |
| [ Warehouse ]   [ BID ]| 2. AI_Hamburg                    |
+-----------------------------------------------------------+
| [ EXPEDITIONS ]        | [ GUILD PERMITS ]                |
+-----------------------------------------------------------+
```

## 5. Forensic Audit Notes (QA)
- **Hardcoded Identity**: User is hardcoded as "Aritz Bahamonde" in ranking logic.
- **Fake Real-Time**: "Time Left" and "Bidders" are static strings.
