# PHASE 04: AI, POLITICS & DYNAMIC MISSIONS

## 1. Goal
Animate the world by adding competing agents, a political hierarchy, and objective-based gameplay.

## 2. Multi-Agent AI System
1. **AISystem.ts**:
   - Implement the `Agent` class.
   - Add the `decisionLoop`: Scan markets -> Calculate Profit -> Assign Fleet Task.
2. **AIWorker.js**:
   - Offload the profit calculations to a Web Worker to maintain UI responsiveness.

## 3. Political Hierarchy
1. **PoliticalSystem.ts**:
   - Define the `Rank` enum and the requirement thresholds (Wealth + Reputation).
   - Implement the `checkRankUp()` method.
2. **Elections**:
   - Add the Lord Mayor election logic (occurs every 360 days).
   - Implement the reputation decay logic (day 1 of every month).

## 4. Mission System
1. **DynamicMissions.ts**:
   - Create the `MissionManager`.
   - Implement the 5 core mission templates: Delivery, Pirate Hunt, Escort, Supply, and City Founding.
2. **EventSystem.ts**:
   - Implement the `dailyRoll()` for disasters (Plague, Fire).

## 5. Checklist
- [ ] AI agents can be seen moving on the world map.
- [ ] Player rank increases automatically when thresholds are met.
- [ ] Random events (Plague) trigger correctly and modify city stats.
- [ ] Missions appear in the Tavern and can be accepted/tracked.
