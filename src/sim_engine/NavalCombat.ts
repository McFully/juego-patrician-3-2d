/**
 * Tactical naval combat:
 * - Fleet AI for interception and patrol
 * - Ship capture mechanics
 * - Pirate fleets
 * - Auto-resolve with wind/ballistic modifiers
 */

import { getBallisticRangeModifier, getWindModifier, resolveBoarding, calculateBoardingPower, canRaidTown, Weapon } from './Combat';
import { Ship } from '../data_models/Ship';
import { City, World } from './City';

export interface PatrolRegion {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export class PirateFleet {
  ships: Ship[];
  aggression: number;
  patrolRegion: PatrolRegion | null;
  lastRaid: number;
  spawnDay: number;
  originHideoutId: string | null;

  constructor(spawnDay: number = 0, originHideoutId: string | null = null) {
    this.ships = [];
    this.aggression = 0.5 + Math.random() * 0.5;
    this.patrolRegion = null; // { minX, maxX, minY, maxY }
    this.lastRaid = 0;
    this.spawnDay = spawnDay;
    this.originHideoutId = originHideoutId;
  }

  generatePirateFleet(difficulty: number = 1): void {
    const count = 1 + Math.floor(Math.random() * 2 * difficulty);
    const types = ['snaikka', 'crayer'];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const ship = new Ship(type, 'pirates');
      ship.crew = Math.ceil(ship.crewMax * (0.6 + Math.random() * 0.4));
      ship.sabers = Math.ceil(ship.crew * (0.3 + Math.random() * 0.7));
      ship.fightingSkill = 0.5 + Math.random() * 1.5;
      ship.hp = ship.hpMax;
      // Equip random weapons
      const weaponTypes = ['light_cannon', 'catapult', 'medium_cannon'];
      for (let w = 0; w < ship.weaponSlots; w++) {
        const wt = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
        ship.weapons = ship.weapons || [];
        ship.weapons.push(new Weapon(wt, Math.random() * 360));
      }
      this.ships.push(ship);
    }
  }

  get totalPower(): number {
    return this.ships.reduce((sum, s) => sum + calculateBoardingPower(s), 0);
  }
}

export class FleetAI {
  pirateFleets: PirateFleet[];
  tradeRoutes: Record<string, any>; // { fleetId: { waypoints, currentIndex } }
  lastPirateSpawn: number;
  pirateSpawnInterval: number;

  constructor() {
    this.pirateFleets = [];
    this.tradeRoutes = {}; // { fleetId: { waypoints, currentIndex } }
    this.lastPirateSpawn = 0;
    this.pirateSpawnInterval = 30; // days
  }

  /**
   * Spawn pirate fleets periodically.
   */
  spawnPirates(totalDays: number, cities: City[], difficulty: number = 1): void {
    if (totalDays - this.lastPirateSpawn < this.pirateSpawnInterval) return;
    this.lastPirateSpawn = totalDays;

    if (Math.random() < 0.3 * difficulty) {
      const pf = new PirateFleet(totalDays);
      pf.generatePirateFleet(difficulty);
      // Assign to a random region
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      pf.patrolRegion = {
        minX: randomCity.x - 80,
        maxX: randomCity.x + 80,
        minY: randomCity.y - 60,
        maxY: randomCity.y + 60,
      };
      this.pirateFleets.push(pf);
    }
  }

  /**
   * Check if a trade fleet is intercepted by pirates.
   */
  checkInterception(_ship: Ship, fromCity: City, toCity: City): PirateFleet | null {
    for (const pf of this.pirateFleets) {
      const region = pf.patrolRegion;
      if (!region) continue;

      // Check if route passes through pirate region
      const midX = (fromCity.x + toCity.x) / 2;
      const midY = (fromCity.y + toCity.y) / 2;

      if (midX >= region.minX && midX <= region.maxX &&
          midY >= region.minY && midY <= region.maxY) {
        const interceptChance = pf.aggression * 0.3;
        if (Math.random() < interceptChance) {
          return pf;
        }
      }
    }
    return null;
  }

  /**
   * Auto-resolve a fleet battle.
   */
  resolveBattle(attackerFleet: Ship[], defenderFleet: Ship[], windDirection: number = 180, windStrength: number = 0.5): any[] {
    const results: any[] = [];
    let attackerIndex = 0;
    let defenderIndex = 0;

    while (attackerIndex < attackerFleet.length && defenderIndex < defenderFleet.length) {
      const attacker = attackerFleet[attackerIndex];
      const defender = defenderFleet[defenderIndex];

      if (attacker.hp <= 0) { attackerIndex++; continue; }
      if (defender.hp <= 0) { defenderIndex++; continue; }

      // Ranged phase (if both have weapons)
      if ((attacker.weapons?.length || 0) > 0 && (defender.weapons?.length || 0) > 0) {
        const attPower = attacker.weapons.reduce((sum, w) => {
          const bMod = getBallisticRangeModifier(w.firingDirection);
          const wMod = getWindModifier(windDirection, w.firingDirection, windStrength);
          return sum + w.damage * bMod * wMod;
        }, 0);

        const defPower = defender.weapons.reduce((sum, w) => {
          const bMod = getBallisticRangeModifier(w.firingDirection);
          const wMod = getWindModifier(windDirection, w.firingDirection, windStrength);
          return sum + w.damage * bMod * wMod;
        }, 0);

        const attRoll = attPower * (0.5 + Math.random());
        const defRoll = defPower * (0.5 + Math.random());

        defender.hp -= Math.max(0, attRoll * 0.3);
        attacker.hp -= Math.max(0, defRoll * 0.3);

        results.push({ type: 'ranged', attacker: attRoll, defender: defRoll });
      }

      // Boarding phase (if close range)
      if (attacker.hp > 0 && defender.hp > 0 &&
          Math.abs(attacker.hp - defender.hp) < 20) {
        const boardingResult = resolveBoarding(attacker, defender);
        results.push({ type: 'boarding', ...boardingResult });

        if (boardingResult.attackerWins && defender.hp <= 0) {
          // Capture check
          const captureChance = 0.3 + (attacker.fightingSkill || 1) * 0.1;
          if (Math.random() < captureChance) {
            defender.ownerId = attacker.ownerId;
            defender.hp = Math.max(1, defender.hpMax * 0.3);
            defender.crew = Math.max(1, Math.ceil(defender.crewMax * 0.3));
            results.push({ type: 'capture', shipType: defender.typeId });
          }
        }
      }

      // Retreat logic
      if (attacker.hp < attacker.hpMax * 0.2) {
        attackerIndex++;
        results.push({ type: 'retreat', side: 'attacker' });
      }
      if (defender.hp < defender.hpMax * 0.2) {
        defenderIndex++;
        results.push({ type: 'retreat', side: 'defender' });
      }

      // Limit iterations
      if (results.length > 50) break;
    }

    return results;
  }

  /**
   * Clean up destroyed or retired pirate fleets.
   * Pirates retire after 1 game year (360 days) to prevent Baltic overcrowding.
   */
  cleanupPirates(totalDays: number): void {
    this.pirateFleets = this.pirateFleets.filter(pf =>
      pf.ships.some(s => s.hp > 0) && (totalDays - pf.spawnDay < 360)
    );
  }

  getPirateCount(): number {
    return this.pirateFleets.length;
  }

  getTotalPirateShips(): number {
    return this.pirateFleets.reduce((sum, pf) => sum + pf.ships.filter(s => s.hp > 0).length, 0);
  }
}

export class PirateHideout {
  id: string;
  name: string;
  x: number;
  y: number;
  level: number;
  gold: number;
  lastSpawnDay: number;

  constructor(id: string, name: string, x: number, y: number) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.level = 1;
    this.gold = 50000;
    this.lastSpawnDay = 0;
  }
}

/**
 * CombatManager — ties combat to the world simulation.
 */
export class CombatManager {
  world: World;
  fleetAI: FleetAI;
  hideouts: PirateHideout[];
  difficulty: number;

  constructor(world: World) {
    this.world = world;
    this.fleetAI = new FleetAI();
    this.hideouts = [
      new PirateHideout('hideout_1', 'Cueva del Capitán Garfio', 450, 250),
      new PirateHideout('hideout_2', 'Isla de la Tortuga del Báltico', 880, 280),
      new PirateHideout('hideout_3', 'Nido de Cuervos Marinos', 300, 480),
    ];
    this.difficulty = 1;
  }

  processDaily(totalDays: number): void {
    const cities = this.world.getAllCities();
    this.fleetAI.spawnPirates(totalDays, cities, this.difficulty);
    
    // Spawn hideout fleets
    for (const hideout of this.hideouts) {
      const activeFleets = this.fleetAI.pirateFleets.filter(pf => pf.originHideoutId === hideout.id);
      if (totalDays - hideout.lastSpawnDay > 60 && activeFleets.length < 2) {
        const pf = new PirateFleet(totalDays, hideout.id);
        pf.generatePirateFleet(this.difficulty + hideout.level - 1);
        pf.patrolRegion = {
          minX: hideout.x - 50,
          maxX: hideout.x + 50,
          minY: hideout.y - 50,
          maxY: hideout.y + 50,
        };
        this.fleetAI.pirateFleets.push(pf);
        hideout.lastSpawnDay = totalDays;
      }
    }

    this.fleetAI.cleanupPirates(totalDays);
  }

  /**
   * Raid a pirate hideout.
   */
  raidHideout(attackingFleet: Ship[], hideoutId: string): any {
    const hideout = this.hideouts.find(h => h.id === hideoutId);
    if (!hideout) return { success: false, reason: 'Hideout not found' };

    // Player must first fight the defense fleets in the region
    const localFleets = this.fleetAI.pirateFleets.filter(pf => pf.originHideoutId === hideout.id);
    if (localFleets.length > 0) {
      return { success: false, reason: 'Must defeat pirate fleets guarding the hideout first', fleets: localFleets.length };
    }

    const defensePower = hideout.level * 100 + 50;
    const attackerPower = attackingFleet.reduce((sum, s) => {
      return sum + (s.crew || 0) * (s.sabers || 0) * 0.01 + (s.hp / 10);
    }, 0);

    if (attackerPower > defensePower) {
      const loot = hideout.gold;
      hideout.gold = 0;
      hideout.level = Math.max(0, hideout.level - 1);
      
      // Hideout is destroyed if level 0
      if (hideout.level === 0) {
        this.hideouts = this.hideouts.filter(h => h.id !== hideoutId);
      } else {
        hideout.gold = 10000; // Reset some gold for next time
      }

      return { success: true, loot, message: `Successfully raided ${hideout.name}!` };
    }

    // Damage attacking ships on failure
    for (const ship of attackingFleet) {
      ship.hp -= 10 + Math.random() * 20;
    }

    return { success: false, reason: 'Hideout defenses were too strong!', defenderPower: defensePower };
  }

  /**
   * Attempt a town raid.
   */
  attemptTownRaid(attackingFleet: Ship[], targetCityId: string): any {
    const city = this.world.getCity(targetCityId);
    if (!city) return { success: false, reason: 'City not found' };

    // Check coastal defenses
    if (!canRaidTown(attackingFleet)) {
      return { success: false, reason: 'Insufficient forces (need 2x Cog L3 + 1x Crayer L3 with heavy cannons)' };
    }

    const defensePower = city.wallLevel * 10 + 20;
    const attackerPower = attackingFleet.reduce((sum, s) => {
      return sum + (s.crew || 0) * (s.sabers || 0) * 0.01;
    }, 0);

    if (attackerPower > defensePower) {
      const loot = Math.floor(city.cityChest * (0.2 + Math.random() * 0.3));
      city.cityChest -= loot;
      city.reputation = Math.max(0, city.reputation - 15);

      // Destroy some defenses
      city.wallLevel = Math.max(0, city.wallLevel - 1);

      return { success: true, loot, reputation: city.reputation };
    }

    return { success: false, reason: 'Defenses hold', defenderPower: defensePower };
  }
}
