# TECHNOLOGY STACK

## 1. Frontend Core
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Language**: TypeScript 5.3.3
- **Routing**: Wouter 3.1.0 (Lightweight router)

## 2. State Management
- **Primary**: React Context (via `GameProvider.tsx`)
- **Secondary**: Zustand 4.4.7 (Used for UI-specific global state)
- **Engine State**: Managed internally by `GameEngine.ts` and observed by React.

## 3. Styling & UI
- **CSS Framework**: Tailwind CSS 3.3.6
- **Post-processing**: Autoprefixer, PostCSS
- **Icons**: Material Symbols / CSS Custom Shapes (procedural)

## 4. Simulation Engine
- **Runtime**: TypeScript/JavaScript
- **Design Pattern**: Data-Oriented Design (DOD) for performance.
- **Multithreading**: Web Workers (via `AIWorker.js`) for background AI processing.

## 5. Persistence & Infrastructure
- **Data Format**: JSON serialization.
- **Persistence**: Node.js `fs` module (for local/headless) or Browser LocalStorage shims.
- **Testing**: Vitest 1.1.0, Testing Library (React).

## 6. Dev Tools
- **Linting**: ESLint with TypeScript and React plugins.
- **Formatting**: Prettier (standard workspace config).
