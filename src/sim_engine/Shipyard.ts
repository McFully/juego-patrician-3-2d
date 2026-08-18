/**
 * Shipyard system: construction, repair, upgrades, experience (Nv1→4).
 * Each shipyard gains XP from building/repairing ships.
 * Ship upgrades (Nv2→3) sacrifice cargo capacity for weapon slots.
 */

import { Ship } from './types';

export interface ShipyardLevelInfo {
  level: number;
  xpRequired: number;
  buildSpeed: number;
  repairSpeed: number;
}

export const SHIPYARD_XP_TABLE: ShipyardLevelInfo[] = [
  { level: 1, xpRequired: 0, buildSpeed: 1.0, repairSpeed: 1.0 },
  { level: 2, xpRequired: 100, buildSpeed: 1.2, repairSpeed: 1.3 },
  { level: 3, xpRequired: 300, buildSpeed: 1.5, repairSpeed: 1.6 },
  { level: 4, xpRequired: 600, buildSpeed: 2.0, repairSpeed: 2.0 },
];

export interface ShipCost {
  timber: number;
  iron: number;
  ropes: number;
  tar: number;
  gold: number;
}

export const SHIP_BUILD_COST: Record<string, ShipCost> = {
  snaikka: { timber: 30, iron: 10, ropes: 5, tar: 8, gold: 2000 },
  crayer: { timber: 45, iron: 15, ropes: 8, tar: 12, gold: 3500 },
  cog: { timber: 80, iron: 30, ropes: 15, tar: 20, gold: 6000 },
  hulk: { timber: 120, iron: 50, ropes: 25, tar: 35, gold: 10000 },
};

export const SHIP_REPAIR_COST_PER_HP: Record<string, { timber: number; gold: number }> = {
  snaikka: { timber: 0.5, gold: 5 },
  crayer: { timber: 0.6, gold: 7 },
  cog: { timber: 0.8, gold: 10 },
  hulk: { timber: 1.0, gold: 15 },
};

const UPGRADE_CARGO_PENALTY: Record<number, number> = { 2: 50, 3: 100 };
const UPGRADE_WEAPON_SLOTS: Record<number, number> = { 2: 1, 3: 2 };

export class Shipyard {
  cityId: string;
  xp: number;
  level: number;
  shipsBuilt: number;
  shipsRepaired: number;
  totalXpEarned: number;

  constructor(cityId: string) {
    this.cityId = cityId;
    this.xp = 0;
    this.level = 1;
    this.shipsBuilt = 0;
    this.shipsRepaired = 0;
    this.totalXpEarned = 0;
  }

  get levelInfo(): ShipyardLevelInfo {
    return SHIPYARD_XP_TABLE[this.level - 1] || SHIPYARD_XP_TABLE[3];
  }

  get buildSpeedMod(): number { return this.levelInfo.buildSpeed; }
  get repairSpeedMod(): number { return this.levelInfo.repairSpeed; }

  addXp(amount: number): boolean {
    this.xp += amount;
    this.totalXpEarned += amount;
    const nextLevel = SHIPYARD_XP_TABLE[this.level];
    if (nextLevel && this.xp >= nextLevel.xpRequired && this.level < 4) {
      this.level++;
      return true;
    }
    return false;
  }

  canBuild(shipTypeId: string, cityMarket: any): { canBuild: boolean; reason?: string; cost?: ShipCost } {
    const cost = SHIP_BUILD_COST[shipTypeId];
    if (!cost) return { canBuild: false, reason: 'Unknown ship type' };
    for (const [goodId, amount] of Object.entries(cost)) {
      if (goodId === 'gold') continue;
      const stock = cityMarket.goods[goodId]?.stock || 0;
      if (stock < amount) return { canBuild: false, reason: `Not enough ${goodId}` };
    }
    return { canBuild: true, cost };
  }

  buildShip(shipTypeId: string, cityMarket: any, playerGold: number): { success: boolean; reason?: string; cost?: number; daysToBuild?: number } {
    const check = this.canBuild(shipTypeId, cityMarket);
    if (!check.canBuild || !check.cost) return { success: false, reason: check.reason };
    if (playerGold < check.cost.gold) return { success: false, reason: 'Not enough gold' };

    for (const [goodId, amount] of Object.entries(check.cost)) {
      if (goodId === 'gold') continue;
      cityMarket.removeStock(goodId, amount);
    }

    const daysToBuild = this.getBuildDays(shipTypeId);
    this.xp += this.getBuildXp(shipTypeId);

    this.shipsBuilt++;
    this.addXp(this.getBuildXp(shipTypeId));

    return { success: true, cost: check.cost.gold, daysToBuild };
  }

  getBuildDays(shipTypeId: string): number {
    const baseDays: Record<string, number> = { snaikka: 15, crayer: 20, cog: 30, hulk: 45 };
    return Math.ceil((baseDays[shipTypeId] || 20) / this.buildSpeedMod);
  }

  getBuildXp(shipTypeId: string): number {
    const xpMap: Record<string, number> = { snaikka: 15, crayer: 25, cog: 40, hulk: 60 };
    return xpMap[shipTypeId] || 20;
  }

  getRepairCost(ship: Ship): { cost: Record<string, number>; gold: number } {
    const missingHp = ship.hpMax - ship.hp;
    if (missingHp <= 0) return { cost: {}, gold: 0 };
    const costPerHp = SHIP_REPAIR_COST_PER_HP[ship.typeId] || SHIP_REPAIR_COST_PER_HP.cog;
    return {
      cost: { timber: Math.ceil(costPerHp.timber * missingHp) },
      gold: Math.ceil(costPerHp.gold * missingHp),
    };
  }

  repairShip(ship: Ship, cityMarket: any, playerGold: number): { success: boolean; reason?: string; cost?: number } {
    if (ship.hp >= ship.hpMax) return { success: false, reason: 'Ship already at full HP' };

    const repair = this.getRepairCost(ship);
    const timberStock = cityMarket.goods['timber']?.stock || 0;
    if (timberStock < repair.cost.timber) return { success: false, reason: 'Not enough timber' };
    if (playerGold < repair.gold) return { success: false, reason: 'Not enough gold' };

    cityMarket.removeStock('timber', repair.cost.timber);
    ship.hp = ship.hpMax;

    this.shipsRepaired++;
    this.addXp(Math.ceil(repair.gold / 20));

    return { success: true, cost: repair.gold };
  }

  calculateUpgrade(ship: Ship): { canUpgrade: boolean; reason?: string; newCargoCapacity?: number; newWeaponSlots?: number; goldCost?: number; timberCost?: number; ironCost?: number } {
    if (ship.upgradeLevel >= 3) return { canUpgrade: false, reason: 'Already max level' };
    const nextLevel = ship.upgradeLevel + 1;
    const cargoPenalty = UPGRADE_CARGO_PENALTY[nextLevel] || 0;
    const weaponGain = UPGRADE_WEAPON_SLOTS[nextLevel] || 1;
    return {
      canUpgrade: true,
      newCargoCapacity: Math.max(50, ship.cargoCapacity - cargoPenalty),
      newWeaponSlots: ship.weaponSlots + weaponGain,
      goldCost: nextLevel === 2 ? 3000 : 6000,
      timberCost: nextLevel === 2 ? 20 : 40,
      ironCost: nextLevel === 2 ? 10 : 25,
    };
  }

  upgradeShip(ship: Ship, cityMarket: any, playerGold: number): { success: boolean; reason?: string; cost?: number; newLevel?: number } {
    const calc = this.calculateUpgrade(ship);
    if (!calc.canUpgrade) return { success: false, reason: calc.reason };

    if (playerGold < (calc.goldCost || 0)) return { success: false, reason: 'Not enough gold' };
    if ((cityMarket.goods['timber']?.stock || 0) < (calc.timberCost || 0)) return { success: false, reason: 'Not enough timber' };
    if ((cityMarket.goods['iron']?.stock || 0) < (calc.ironCost || 0)) return { success: false, reason: 'Not enough iron' };

    cityMarket.removeStock('timber', calc.timberCost || 0);
    cityMarket.removeStock('iron', calc.ironCost || 0);

    ship.cargoCapacity = calc.newCargoCapacity || ship.cargoCapacity;
    ship.weaponSlots = calc.newWeaponSlots || ship.weaponSlots;
    ship.upgradeLevel++;

    this.addXp(40);

    return { success: true, cost: calc.goldCost, newLevel: ship.upgradeLevel };
  }
}

/**
 * ShipyardManager — manages all shipyards across cities.
 */
export class ShipyardManager {
  shipyards: Record<string, Shipyard>;

  constructor() {
    this.shipyards = {};
  }

  getShipyard(cityId: string): Shipyard {
    if (!this.shipyards[cityId]) {
      this.shipyards[cityId] = new Shipyard(cityId);
    }
    return this.shipyards[cityId];
  }
}
