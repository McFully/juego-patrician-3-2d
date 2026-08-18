# MISSION SYSTEM: QUESTS & PROGRESSION

## 1. Mission Categories
Managed by `DynamicMissions.ts`, missions provide alternative ways to earn reputation and gold.

### 1.1 Commercial Missions
- **Emergency Delivery**: Supply X units of Y to city Z within 10 days.
- **Market Squeeze**: Monopolize a specific good in the Hansa for a week.

### 1.2 Combat Missions
- **Pirate Hunt**: Destroy a specific pirate fleet reported in a sea zone.
- **Patrol**: Keep a sea lane clear of encounters for 30 days.

### 1.3 Political/Expansion Missions
- **Found City**: Establish a new settlement (Requires rank: Lord Mayor).
- **Land Route**: Open a land-based trade path between two inland cities.

## 2. Reward Logic
- **Gold**: Scaled by mission difficulty and player rank.
- **Reputation**: Ranges from $+15$ (Delivery) to $+100$ (Founding a City).
- **Alderman Credits**: Special points required for the final rank advancement.

## 3. Failure Conditions
- **Time Out**: Most missions have a strict deadline.
- **Bankruptcy**: Failing to fund an expansion mission midway.
- **Capture**: If the player's ship is captured during a mission, it is marked as failed.
