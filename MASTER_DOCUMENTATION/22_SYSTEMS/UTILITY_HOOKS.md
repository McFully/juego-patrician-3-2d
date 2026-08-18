# Utility Hooks

This document details the custom React hooks available in the project to handle common UI and state logic.

## Common Hooks (`src/hooks/useCommon.ts`)

A collection of general-purpose utility hooks.

### `useClickOutside<T>(handler: () => void)`
Triggers a callback when a click or touch event occurs outside the referenced element.
- **Returns**: `RefObject<T | null>` - The ref to attach to the element.
- **Usage**:
  ```tsx
  const ref = useClickOutside(() => setIsOpen(false));
  return <div ref={ref}>...</div>;
  ```

### `useKeyboard(key: string, handler: () => void, enabled = true)`
Listens for a specific key press globally.
- **Props**:
  - `key`: The `e.key` to listen for (e.g., `'Escape'`, `'Enter'`).
  - `handler`: Callback to execute.
  - `enabled`: Toggle the listener.

### `useDebounce<T>(value: T, delay = 300)`
Debounces a value to limit the frequency of updates.
- **Returns**: The debounced value.

### `useMediaQuery(query: string)`
Tracks the status of a CSS media query.
- **Returns**: `boolean` - Whether the query currently matches.

### `useIsMobile()`
Shortcut for `useMediaQuery('(max-width: 767px)')`.

### `useIsTablet()`
Shortcut for `useMediaQuery('(min-width: 768px) and (max-width: 1023px)')`.

### `useIsDesktop()`
Shortcut for `useMediaQuery('(min-width: 1024px)')`.

### `useLocalStorage<T>(key: string, initialValue: T)`
Syncs state with `localStorage`.
- **Returns**: `[storedValue, setValue]` (similar to `useState`).
- **Features**: Type-safe, handles JSON serialization/deserialization, and quota errors.

---

## Game Hook (`src/engine/GameProvider.tsx`)

Accesses the simulation engine and global game state.

### `useGame()`
Exposes the engine adapter.
- **Returns**: `{ engine: EngineAdapter }`
- **Context**: Must be used within a `GameProvider`.
