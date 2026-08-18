import DATA from '../database/index.js';
const SHIPS = DATA.SHIPS;

export interface ShipTemplate {
  id: string;
  name: string;
  cargo: number;
  crewMax: number;
  draft: string;
  speed: number;
  hpMax: number;
  weaponSlots: number;
}

export class Ship {
  typeId: string;
  name: string;
  ownerId: string | null;

  cargoCapacity: number;
  crewMax: number;
  crew: number;
  draft: string;
  speed: number;
  hp: number;
  hpMax: number;
  weaponSlots: number;
  upgradeLevel: number;
  sabers: number;

  cargo: Record<string, number>;
  currentCityId: string | null;
  targetCityId: string | null;
  inTransit: boolean;
  transitHours: number;
  transitTotalHours: number;
  x: number;
  y: number;
  fightingSkill: number;
  weapons: any[];

  constructor(typeId: string, ownerId: string | null = null) {
    const template = (SHIPS as unknown as ShipTemplate[]).find(s => s.id === typeId);
    if (!template) throw new Error(`Unknown ship type: ${typeId}`);

    this.typeId = typeId;
    this.name = template.name;
    this.ownerId = ownerId;

    this.cargoCapacity = template.cargo;
    this.crewMax = template.crewMax;
    this.crew = template.crewMax;
    this.draft = template.draft;
    this.speed = template.speed;
    this.hp = template.hpMax;
    this.hpMax = template.hpMax;
    this.weaponSlots = template.weaponSlots;
    this.upgradeLevel = 1;
    this.sabers = Math.floor(template.crewMax * 0.5);

    this.cargo = {};
    this.currentCityId = null;
    this.targetCityId = null;
    this.inTransit = false;
    this.transitHours = 0;
    this.transitTotalHours = 0;
    this.x = 0;
    this.y = 0;
    this.fightingSkill = 1;
    this.weapons = [];
  }

  get cargoUsed(): number {
    let total = 0;
    for (const qty of Object.values(this.cargo)) {
      total += qty;
    }
    return total;
  }

  get cargoFree(): number {
    return this.cargoCapacity - this.cargoUsed;
  }

  loadCargo(goodId: string, quantity: number): boolean {
    const free = this.cargoFree;
    if (free < quantity) return false;
    this.cargo[goodId] = (this.cargo[goodId] || 0) + quantity;
    return true;
  }

  unloadCargo(goodId: string, quantity: number): boolean {
    const current = this.cargo[goodId] || 0;
    if (current < quantity) return false;
    this.cargo[goodId] = current - quantity;
    if (this.cargo[goodId] <= 0) delete this.cargo[goodId];
    return true;
  }

  setTarget(targetCityId: string, travelHours: number): void {
    this.targetCityId = targetCityId;
    this.inTransit = true;
    this.transitHours = 0;
    this.transitTotalHours = travelHours;
  }

  advanceTransit(hours: number): boolean {
    if (!this.inTransit) return false;
    this.transitHours += hours;
    if (this.transitHours >= this.transitTotalHours) {
      this.inTransit = false;
      this.currentCityId = this.targetCityId;
      this.targetCityId = null;
      return true;
    }
    return false;
  }

  upgrade(): boolean {
    if (this.upgradeLevel >= 3) return false;
    this.upgradeLevel++;
    const cargoPenalty = this.upgradeLevel === 2 ? 50 : 100;
    this.cargoCapacity = Math.max(50, this.cargoCapacity - cargoPenalty);
    this.weaponSlots += 1;
    return true;
  }

  getBoardingPower(): number {
    const effectiveSabers = Math.min(this.sabers, this.crew);
    const unarmed = this.crew - effectiveSabers;
    const unarmedPower = unarmed * 0.1;
    const armedPower = effectiveSabers;
    return (armedPower + unarmedPower) * (1.0 + 0.2 * this.fightingSkill);
  }
}

export class Fleet {
  ownerId: string;
  ships: Ship[];

  constructor(ownerId: string) {
    this.ownerId = ownerId;
    this.ships = [];
  }

  addShip(ship: Ship): void {
    this.ships.push(ship);
  }

  removeShip(shipId: string): boolean {
    const idx = this.ships.findIndex(s => (s as any).id === shipId); // Assuming id exists or using some unique prop
    if (idx >= 0) {
      this.ships.splice(idx, 1);
      return true;
    }
    return false;
  }

  get totalCargoCapacity(): number {
    return this.ships.reduce((sum, s) => sum + s.cargoCapacity, 0);
  }

  get totalCrew(): number {
    return this.ships.reduce((sum, s) => sum + s.crew, 0);
  }
}
