# SCREEN: GLOBAL MESSAGE CENTER (Centro de Mensajes Global)

## 1. Overview
The **Global Message Center** serves as the inbox for all non-critical communication, trade reports, and diplomatic letters. It allows players to manage historical data and track their influence across the Hansa.

## 2. Component Structure
- **Root**: `GlobalMessageCenter.tsx`
- **Internal Modules**:
  - `Inbox List`: Categorized messages (Trade, Politics, War, Social).
  - `Message Reader`: Detailed view of the selected message.
  - `Archive`: Storage for saved important communications.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Full history of player-received messages.
- **`usePlayer()`**: Player's diplomatic status affecting message tone.

### 3.2 Sinks (Engine Calls)
- `engine.deleteMessage(msgId)`
- `engine.markAsRead(msgId)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `selectedMsgId` | `string` | The message currently being read. |
| `filter` | `string` | Current category filter for the inbox. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   CENTRO DE MENSAJES                 [ Delete All ]  |
+-------------------------------------------------------------+
| INBOX                | MESSAGE CONTENT                      |
| [!] Trade: Lubeck    | From: Mayor of Lubeck                |
| [ ] Politics: Riga   | Date: Oct 1350                       |
| [ ] News: Famine     |                                      |
|                      | "We are pleased to inform you that   |
|                      | your recent donation has increased   |
|                      | your standing in the council..."    |
|                      |                                      |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Persistence**: Messages are saved across sessions until deleted by the player.
- **Unread Counter**: A notification badge on the main HUD reflects the number of unread messages.

## 7. Forensic Audit Notes (QA)
- **UX**: Add a "Mark all as read" button to reduce clutter.
- **Formatting**: Support for basic rich text (bold, colors) for emphasized economic numbers.
