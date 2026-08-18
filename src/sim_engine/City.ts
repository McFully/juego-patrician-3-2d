import { Market } from './Market';
import { CITIES, isShallowCity } from '../database/cities.js';
import { FACTORIES, getSeasonalOutput, getRegionalMultiplier, getAgglomerationBonus } from '../database/factories.js';
import { calculateDemand } from '../database/consumption.js';
import { MoneyLender, Tavern, Cathedral } from './EconomySystems.js';
import { Factory, CityEvents } from './types';

export interface CityDef {
  id: string;
  name: string;
  x: number;
  y: number;
  draft: string;
  production: string;
  popPoor: number;
  popMiddle: number;
  popRich: number;
  popBeggar: number;
}

export class City {
  id: string;
  name: string;
  x: number;
  y: number;
  draft: string;
  production: string;
  market: Market;

  popPoor: number;
  popMiddle: number;
  popRich: number;
  popBeggar: number;

  housingPoor: number;
  housingMiddle: number;
  housingRich: number;

  factories: Factory[];

  moneyLender: MoneyLender;
  tavern: Tavern;
  cathedral: Cathedral;

  warehouseCapacity: number;
  warehouseUsed: number;

  hasWell: boolean;
  hasHospital: boolean;
  hasBathHouse: boolean;
  wallLevel: number;

  events: CityEvents;

  cityChest: number;
  reputation: number;

  constructor(cityDef: CityDef) {
    this.id = cityDef.id;
    this.name = cityDef.name;
    this.x = cityDef.x;
    this.y = cityDef.y;
    this.draft = cityDef.draft;
    this.production = cityDef.production;

    this.popPoor = cityDef.popPoor;
    this.popMiddle = cityDef.popMiddle;
    this.popRich = cityDef.popRich;
    this.popBeggar = Math.floor(cityDef.popBeggar);

    this.market = new Market(this);

    this.housingPoor = Math.ceil(cityDef.popPoor / 4);
    this.housingMiddle = Math.ceil(cityDef.popMiddle / 3);
    this.housingRich = Math.ceil(cityDef.popRich / 2);

    this.factories = (FACTORIES as unknown as Factory[]).map(f => ({
      ...f,
      built: false,
      workers: 0,
      currentInputs: {},
      currentOutputs: {},
    }));

    this.moneyLender = new MoneyLender();
    this.tavern = new Tavern();
    this.cathedral = new Cathedral();

    this.warehouseCapacity = 10000;
    this.warehouseUsed = 0;

    this.hasWell = false;
    this.hasHospital = false;
    this.hasBathHouse = false;
    this.wallLevel = 0;

    this.events = {
      plague: false,
      fire: false,
      siege: false,
      famine: false,
    };

    this.cityChest = 5000;
    this.reputation = 50;
  }

  get totalPopulation(): number {
    return this.popPoor + this.popMiddle + this.popRich + this.popBeggar;
  }

  get housingOccupancyPoor(): number {
    if (this.housingPoor === 0) return 0;
    return this.popPoor / (this.housingPoor * 4);
  }

  get housingOccupancyMiddle(): number {
    if (this.housingMiddle === 0) return 0;
    return this.popMiddle / (this.housingMiddle * 3);
  }

  get housingOccupancyRich(): number {
    if (this.housingRich === 0) return 0;
    return this.popRich / (this.housingRich * 2);
  }

  get shallowAccess(): boolean {
    return isShallowCity(this.id);
  }

  getRegionalFactor(): number {
    return getRegionalMultiplier(this.production);
  }

  processDailyProduction(month: number): void {
    for (const factory of this.factories) {
      if (!factory.built || factory.workers < factory.minWorkers) continue;

      const efficiency = (factory.workers / factory.maxWorkers);
      const seasonal = getSeasonalOutput(factory, month);
      const regional = this.getRegionalFactor();
      const factoryCount = this.factories.filter(f => f.built).length;
      const agglomeration = getAgglomerationBonus(factoryCount);

      const multiplier = efficiency * seasonal * regional * agglomeration;

      // Check inputs
      let canProduce = true;
      for (const input of factory.inputs) {
        const needed = input.amount * multiplier;
        const stock = this.market.goods[input.goodId]?.stock ?? 0;
        if (stock < needed) {
          canProduce = false;
          break;
        }
      }

      if (!canProduce) continue;

      // Consume inputs
      for (const input of factory.inputs) {
        const needed = input.amount * multiplier;
        this.market.removeStock(input.goodId, needed);
      }

      // Produce outputs
      for (const output of factory.outputs) {
        const produced = output.amount * multiplier;
        this.market.addStock(output.goodId, produced);
      }
    }
  }

  processDailyConsumption(): void {
    const demand = calculateDemand(this.popPoor, this.popMiddle, this.popRich);

    for (const [goodId, amount] of Object.entries(demand)) {
      const dailyAmount = (amount as number) / 7;
      this.market.removeStockPartial(goodId, dailyAmount);
    }
  }

  processDailyMigration(): void {
    // Beggars get hired by factories
    const totalFactoryJobs = this.factories
      .filter(f => f.built)
      .reduce((sum, f) => sum + (f.maxWorkers - f.workers), 0);

    if (totalFactoryJobs > 0 && this.popBeggar > 0) {
      const hired = Math.min(this.popBeggar, Math.ceil(totalFactoryJobs * 0.1));
      this.popBeggar -= hired;
      // Distribute to factories needing workers
      let remaining = hired;
      for (const factory of this.factories) {
        if (!factory.built || remaining <= 0) break;
        const needed = factory.maxWorkers - factory.workers;
        if (needed > 0) {
          const assign = Math.min(needed, remaining);
          factory.workers += assign;
          remaining -= assign;
        }
      }
    }

    // Immigration stops if housing too full
    // Closing the stagnation gap: 75% -> 90%
    const immigratePoor = this.housingOccupancyPoor <= 0.90;
    const immigrateMiddle = this.housingOccupancyMiddle <= 0.85;
    const immigrateRich = this.housingOccupancyRich <= 0.80;

    if (immigratePoor) {
      this.popPoor += Math.floor(this.popPoor * 0.002 + 0.5);
    }
    if (immigrateMiddle) {
      this.popMiddle += Math.floor(this.popMiddle * 0.001 + 0.5);
    }
    if (immigrateRich) {
      this.popRich += Math.floor(this.popRich * 0.0005 + 0.5);
    }

    // Beggar generation from poverty
    this.popBeggar += Math.floor(this.popPoor * 0.0005);
  }

  dailyTick(month: number): void {
    this.processDailyProduction(month);
    this.processDailyConsumption();
    this.processDailyMigration();
  }
}

export class World {
  cities: Record<string, City>;
  day: number;
  month: number;
  year: number;
  totalDays: number;

  constructor() {
    this.cities = {};
    for (const cityDef of (CITIES as unknown as CityDef[])) {
      this.cities[cityDef.id] = new City(cityDef);
    }
    this.day = 1;
    this.month = 1;
    this.year = 1300;
    this.totalDays = 0;
  }

  getCity(id: string): City {
    return this.cities[id];
  }

  getAllCities(): City[] {
    return Object.values(this.cities);
  }

  addCity(cityDef: CityDef): void {
    if (!this.cities[cityDef.id]) {
      this.cities[cityDef.id] = new City(cityDef);
    }
  }

  advanceDay(): { day: number; month: number; year: number } {
    this.day++;
    this.totalDays++;
    if (this.day > 30) {
      this.day = 1;
      this.month++;
      if (this.month > 12) {
        this.month = 1;
        this.year++;
      }
    }

    for (const city of this.getAllCities()) {
      // Plague progression
      if (city.events.plague) {
        const reduction = city.totalPopulation * 0.03;
        city.popPoor -= Math.floor(reduction * 0.5);
        city.popMiddle -= Math.floor(reduction * 0.3);
        city.popRich -= Math.floor(reduction * 0.2);
        city.popBeggar += Math.floor(reduction * 0.2);
      }

      city.dailyTick(this.month);
    }

    return { day: this.day, month: this.month, year: this.year };
  }
}
