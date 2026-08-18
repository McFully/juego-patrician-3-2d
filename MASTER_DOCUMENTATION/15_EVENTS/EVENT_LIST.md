# WORLD EVENTS: DISASTERS & MILESTONES

## 1. Random Event List
World events are triggered by the `EventSystem.ts` based on world conditions or RNG.

| Event | Trigger | Effect |
|---|---|---|
| **Plague** | Pop > 5,000 & Low Sanitation | -3% Population daily. Production halts. |
| **Fire** | Random (Low if Wells exist) | Destroys 1-3 buildings. Citizens become beggars. |
| **Siege** | Random / Political Tension | Land trade blocked. City chest may be looted. |
| **Famine** | Winter + Low Grain Stock | Grain riots. Looting of warehouses. Satisfaction -50%. |
| **Golden Age** | 6 months of 90% Satisfaction | Double migration rate. Building speed +25%. |

## 2. Trigger Logic
Events are rolled during the `processDaily` tick.
- **Luck Factor**: A global constant in `game_constants.json` scales the frequency of disasters.
- **Player Influence**: Building hospitals reduces plague chance; building wells reduces fire risk.

## 3. Propagation
Some events like **Plague** can spread to neighboring cities if a ship travels from an infected city to a healthy one.
