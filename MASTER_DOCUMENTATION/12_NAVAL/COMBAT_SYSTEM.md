# NAVAL COMBAT SYSTEM

## 1. Overview
The **Naval Combat System** handles ship-to-ship encounters, pirate ambushes, and city sieges. It is divided into a mathematical core (`Combat.ts`) and an operational manager (`NavalCombat.ts`).

## 2. Combat Resolution Phases
### 2.1 Ranged Phase (Exchange of Fire)
Ships fire their cannons based on distance and wind.
- **Hit Chance**: $Base (60\%) \pm WindModifier \pm DistancePenalty$.
- **Damage**: Calculated per cannon type (Light, Medium, Heavy). Heavy cannons do massive structural damage but have a slower reload speed (ticks per shot).
- **Directional Bonus**: Attacking from North-South provides a $+30\%$ accuracy bonus due to "Hanseatic Sailing Advantage."

### 2.2 Boarding Phase (Melee)
Occurs when two ships collide.
- **Boarding Power**: $Sailors \times Sabers \times ExperienceFactor$.
- **Outcome**: The ship with higher power reduces the enemy's crew. If crew reach zero, the ship is **captured**.
- **Capture Chance**: $30\% + (PlayerCaptainSkill \times 10\%)$.

## 3. Tactics & AI
- **Retreat Threshold**: AI ships attempt to flee if HP drops below $20\%$.
- **Pirate Aggression**: Pirates prioritize ships with high-value cargo (Spices, Wine) over well-armed convoys.

## 4. City Raids
High-ranking players or pirates can attack city harbors.
- **Requirements**: At least 2 Cogs (Level 3) or 1 Holk with heavy armaments.
- **Defense**: City towers fire back with high accuracy.
- **Loot**: If successful, the attacker can raid the **City Chest** ($50\% - 100\%$ of city gold).
