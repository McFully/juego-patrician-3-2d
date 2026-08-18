# Layout System

This document describes the layout architecture and the structural components used to build the Hanseatic Strategos interface.

## PageLayout (`src/components/layout/PageLayout.tsx`)

The root layout component that orchestrates the navigation and sidebars.

### Props
- `title`: `string` - Title shown in the TopNav.
- `showBack`: `boolean` - Whether to show the back button.
- `onBack`: `() => void` - Custom back button handler.
- `rightContent`: `React.ReactNode` - Custom content for the right side of TopNav.
- `fullScreen`: `boolean` - If true, removes margins and TopNav/BottomNav (useful for World Map).
- `children`: `React.ReactNode` - Page content.

### Structure
- `TopNav` (fixed top)
- `RightSidebar` (fixed right)
- `main` (content area with padding for navs)
- `MessageCenter` (floating notification hub)
- `EncounterOverlay` (event-driven overlay)
- `BottomNav` (fixed bottom, mobile only)

---

## TopNav (`src/components/layout/TopNav.tsx`)

The global header navigation bar.

### Props
- `title`: `string` (Default: `'Hanseatic Strategos'`)
- `showBack`: `boolean`
- `onBack`: `() => void`
- `rightContent`: `React.ReactNode`

### Styling Logic (Tailwind)
- **Container**: `fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl`
- **Navigation Links (Desktop)**: `hidden md:flex items-center gap-lg`
- **Active State**: `text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1`

---

## BottomNav (`src/components/layout/BottomNav.tsx`)

Mobile-specific navigation bar fixed to the bottom.

### Props
- `items`: `NavItemConfig[]` (Default: `MOBILE_NAV_ITEMS`)

### Styling Logic (Tailwind)
- **Container**: `fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin py-sm bg-primary-container/60 backdrop-blur-xl border-t border-on-surface/10 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] rounded-t-xl md:hidden`
- **Item Active**: `bg-tertiary-fixed text-on-tertiary-fixed scale-102`
- **Item Inactive**: `text-on-surface-variant hover:bg-surface-variant/30`

---

## Sidebar (`src/components/layout/Sidebar.tsx`)

A sidebar component used for contextual navigation or information.

### Components
- `Sidebar`: The main container.
  - `title`: `string`
  - `subtitle`: `string`
- `SidebarNav`: Navigation menu within the sidebar.
  - `items`: `(NavItemConfig & { badge?: string | number })[]`

### Styling Logic (Tailwind)
- **Container**: `w-full md:w-64 lg:w-72 shrink-0 glass-panel p-md rounded-xl space-y-md`
- **Nav Link Active**: `bg-tertiary/20 text-tertiary-fixed font-bold border border-tertiary/30`

---

## MessageCenter (`src/components/layout/MessageCenter.tsx`)

A reactive notification hub that listens to simulation events.

### State & Logic
- **`messages`**: Array of event messages (plague, fire, siege, etc.).
- **`isOpen`**: Boolean for the expanded view.
- **Subscription**: Listens to `game_event` from the `engine` via `useGame`.

### Styling Logic (Tailwind)
- **Floating Button**: `fixed bottom-24 right-8 z-50 rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg bg-tertiary`
- **Message List**: `absolute bottom-16 right-0 w-80 max-h-[400px] overflow-y-auto space-y-sm glass-modal shadow-2xl border-tertiary/20`
- **Badges**: `bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full`
