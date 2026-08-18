# PHASE 01: PROJECT BOOTSTRAP & FOUNDATION

## 1. Goal
Initialize the development environment and define the basic data structures (Types/Interfaces) that will be used across the entire project.

## 2. Setup
1. **Init Vite**: `npm create vite@latest patrician-rebuilt -- --template react-ts`.
2. **Install Dependencies**:
   - Routing: `npm install wouter`.
   - State: `npm install zustand`.
   - Styling: `npm install -D tailwindcss postcss autoprefixer`.
3. **Configure Tailwind**: Initialize `tailwind.config.js` and add the Hanseatic color palette (Rich browns, paper yellows, gold accents).

## 3. Core Types Definition
Create `src/sim_engine/types.ts`.
- **GoodId**: Enum or Type of the 20 goods.
- **CityId**: Type of the 20 Hanseatic cities.
- **WorldState**: Interface for the serialized world.

## 4. Static Database
Recreate the `database/` directory.
- `cities.js`: Add coordinates and base production for each city.
- `goods.js`: Define base prices and consumption rates.

## 5. Checklist
- [ ] Project compiles with `tsc`.
- [ ] `database/index.js` correctly exports all static data.
- [ ] Tailwind is configured and functional.
