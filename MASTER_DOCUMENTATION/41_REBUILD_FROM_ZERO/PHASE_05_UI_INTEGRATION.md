# PHASE 05: REACT UI INTEGRATION & THE BRIDGE

## 1. Goal
Connect the pure simulation engine to the React frontend and implement the full 44-screen interface.

## 2. The Bridge (Adaptation Layer)
1. **GameProvider.tsx**:
   - Setup the `GameContext`.
   - Initialize the `GameEngine` and start the `SimulationServer`.
   - Create the `tick` listener that updates the React state.
2. **engineAdapter.ts**:
   - Create type-safe wrappers for all engine methods (e.g., `buyGood`, `hireSailors`).

## 3. Global HUD & Navigation
1. **App.tsx**:
   - Setup Wouter routing for all 44 screen IDs.
2. **HUD.tsx**:
   - Implement the persistent top bar (Gold, Date, Speed) and bottom shortcuts.

## 4. Screen Implementation (Microscopic)
Using the documentation in `MASTER_DOCUMENTATION/21_SCREENS/`, implement the screens in order of importance:
1. **City Overview & World Map** (Navigation core).
2. **Market Hall** (Economy core).
3. **Warehouse & Trading Office** (Management core).
4. **Shipyard & Tavern** (Naval/Recruitment).
5. **Town Hall & Guild** (Politics/Progression).

## 5. UI/UX Polish
1. **Theme System**: Implement the glassmorphism and Hanseatic color palette in `globals.css` and `design-system.css`.
2. **Visual Feedback**: Add toast notifications for every engine transaction.

## 6. Final Verification
- [ ] Full "Zero to Alderman" gameplay loop is functional.
- [ ] Save/Load works via `SaveManager.js`.
- [ ] No hardcoded data remains in the UI components (all data comes from the engine).
