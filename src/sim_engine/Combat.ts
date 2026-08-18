import { Ship } from '../data_models/Ship';

/**
 * Combat system: naval battles, ballistics, boarding, and town raids.
 */

// Cardinal direction vectors for wind/ballistic modifiers
// const CARDINAL = { N: 0, S: 180, E: 90, W: 270 }; // Unused but kept for reference if needed

/**
 * Calculate ballistic range modifier based on firing axis.
 * North-South: +30% range. East-West: -25% range.
 */
export function getBallisticRangeModifier(firingDirectionDeg: number): number {
  const dir = firingDirectionDeg % 360;
  // N-S axis: 0/180 degrees
  if (Math.abs(dir - 0) < 30 || Math.abs(dir - 180) < 30 || Math.abs(dir - 360) < 30) {
    return 1.30;
  }
  // E-W axis: 90/270 degrees
  if (Math.abs(dir - 90) < 30 || Math.abs(dir - 270) < 30) {
    return 0.75;
  }
  return 1.0;
}

/**
 * Wind modifier: headwind reduces projectile distance.
 * @param windDirectionDeg - direction wind is blowing FROM
 * @param firingDirectionDeg - direction projectile is fired
 * @param windStrength - 0 to 1
 */
export function getWindModifier(windDirectionDeg: number, firingDirectionDeg: number, windStrength: number = 0.5): number {
  const angleDiff = Math.abs((windDirectionDeg + 180) - firingDirectionDeg) % 360;
  const headwindFactor = 1 - (angleDiff / 180); // 1 = full headwind, 0 = full tailwind
  return 1.0 - (headwindFactor * windStrength * 0.3);
}

export interface BoardingResult {
  attackerWins: boolean;
  defenderWins: boolean;
  draw: boolean;
  attackerCasualties: number;
  defenderCasualties: number;
  attackerSurvivors: number;
  defenderSurvivors: number;
}

/**
 * Calculate boarding combat result.
 * Formula: Force = (Sailors × Sabers) × (1.0 + 0.2 × FightingSkill)
 * Without sabers (1:1 ratio), unarmed men deal 90% less damage.
 */
export function resolveBoarding(attackerShip: Ship, defenderShip: Ship): BoardingResult {
  const attackPower = calculateBoardingPower(attackerShip);
  const defensePower = calculateBoardingPower(defenderShip);

  // Effective sabers ratio check
  const attackerEffective = Math.min(attackerShip.sabers, attackerShip.crew);
  const attackerUnarmed = attackerShip.crew - attackerEffective;
  const attackerUnarmedPenalty = attackerUnarmed > 0 ? 0.1 : 1.0;

  const defenderEffective = Math.min(defenderShip.sabers, defenderShip.crew);
  const defenderUnarmed = defenderShip.crew - defenderEffective;
  const defenderUnarmedPenalty = defenderUnarmed > 0 ? 0.1 : 1.0;

  const actualAttack = attackPower * attackerUnarmedPenalty;
  const actualDefense = defensePower * defenderUnarmedPenalty;

  const total = actualAttack + actualDefense;
  if (total === 0) return { 
    attackerWins: false, 
    defenderWins: false, 
    draw: true,
    attackerCasualties: 0,
    defenderCasualties: 0,
    attackerSurvivors: attackerShip.crew,
    defenderSurvivors: defenderShip.crew
  };

  const attackerRoll = Math.random() * actualAttack;
  const defenderRoll = Math.random() * actualDefense;

  const attackerWins = attackerRoll > defenderRoll;

  // Casualties
  const defenderCasualties = attackerWins
    ? Math.ceil(defenderShip.crew * (0.2 + Math.random() * 0.4))
    : Math.ceil(defenderShip.crew * 0.1);
  const attackerCasualties = attackerWins
    ? Math.ceil(attackerShip.crew * 0.1)
    : Math.ceil(attackerShip.crew * (0.2 + Math.random() * 0.4));

  defenderShip.crew = Math.max(0, defenderShip.crew - defenderCasualties);
  attackerShip.crew = Math.max(0, attackerShip.crew - attackerCasualties);

  // Saber loss
  const defenderSaberLoss = Math.ceil(defenderShip.sabers * (0.1 + Math.random() * 0.3));
  const attackerSaberLoss = Math.ceil(attackerShip.sabers * (0.05 + Math.random() * 0.15));
  defenderShip.sabers = Math.max(0, defenderShip.sabers - defenderSaberLoss);
  attackerShip.sabers = Math.max(0, attackerShip.sabers - attackerSaberLoss);

  return {
    attackerWins,
    defenderWins: !attackerWins,
    draw: false,
    attackerCasualties,
    defenderCasualties,
    attackerSurvivors: attackerShip.crew,
    defenderSurvivors: defenderShip.crew,
  };
}

export function calculateBoardingPower(ship: Ship): number {
  return (ship.crew * ship.sabers) * (1.0 + 0.2 * (ship.fightingSkill || 1));
}

/**
 * Town raid requirement check.
 * Automatic success at base level needs: 2x Cog L3 + 1x Crayer L3 with heavy cannons.
 */
export function canRaidTown(fleet: Ship[]): boolean {
  let heavyCogs = 0;
  let heavyCrayers = 0;

  for (const ship of fleet) {
    if (ship.typeId === 'cog' && ship.upgradeLevel >= 3) {
      const hasHeavyCannons = (ship.weapons as Weapon[])?.filter(w => w.type === 'heavy_cannon').length >= 2;
      if (hasHeavyCannons) heavyCogs++;
    }
    if (ship.typeId === 'crayer' && ship.upgradeLevel >= 3) {
      const hasHeavyCannons = (ship.weapons as Weapon[])?.filter(w => w.type === 'heavy_cannon').length >= 1;
      if (hasHeavyCannons) heavyCrayers++;
    }
  }

  return heavyCogs >= 2 && heavyCrayers >= 1;
}

export interface BombardResult {
  success: boolean;
  defensesDestroyed: number;
}

/**
 * City bombardment - damage to coastal defenses.
 */
export function bombardCity(cityDefenses: number, attackingFleet: Ship[]): BombardResult {
  let totalFirepower = 0;
  for (const ship of attackingFleet) {
    for (const weapon of ((ship.weapons || []) as Weapon[])) {
      const mod = getBallisticRangeModifier(weapon.firingDirection || 90);
      totalFirepower += weapon.damage * mod;
    }
  }

  const defensePower = cityDefenses * 10;
  const defenderRoll = defensePower * (0.5 + Math.random() * 0.5);

  if (totalFirepower > defenderRoll) {
    return { success: true, defensesDestroyed: Math.min(cityDefenses, Math.ceil(totalFirepower / defensePower * cityDefenses)) };
  }
  return { success: false, defensesDestroyed: 0 };
}

export const WEAPON_TYPES: Record<string, { name: string; damage: number; range: number; cost: number }> = {
  light_cannon: { name: 'Light Cannon', damage: 15, range: 100, cost: 200 },
  medium_cannon: { name: 'Medium Cannon', damage: 30, range: 150, cost: 500 },
  heavy_cannon: { name: 'Heavy Cannon', damage: 50, range: 200, cost: 1000 },
  catapult: { name: 'Catapult', damage: 20, range: 120, cost: 300 },
};

export interface IWeapon {
  type: string;
  name: string;
  damage: number;
  range: number;
  cost: number;
  firingDirection: number;
}

export class Weapon implements IWeapon {
  type: string;
  name: string;
  damage: number;
  range: number;
  cost: number;
  firingDirection: number;

  constructor(type: string, firingDirection: number = 90) {
    const def = WEAPON_TYPES[type];
    if (!def) throw new Error(`Unknown weapon: ${type}`);
    this.type = type;
    this.name = def.name;
    this.damage = def.damage;
    this.range = def.range;
    this.cost = def.cost;
    this.firingDirection = firingDirection;
  }
}
