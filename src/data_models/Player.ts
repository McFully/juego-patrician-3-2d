import { FinancialRecord } from '../sim_engine/types';

export class Player {
  name: string;
  gold: number;
  rank: number;
  reputation: number;
  reputationByCity: Record<string, number>;
  homeCityId: string;
  fleet: any[]; // Will be Ship[]
  factories: any[];
  tradingOffices: Record<string, any>;
  currentCityId: string;
  financialHistory: FinancialRecord[];

  constructor(name: string) {
    this.name = name;
    this.gold = 10000;
    this.rank = 0; // index into RANKS array
    this.reputation = 0;
    this.reputationByCity = {};
    this.homeCityId = 'lubeck';
    this.fleet = [];
    this.factories = [];
    this.tradingOffices = {};
    this.currentCityId = 'lubeck';
    this.financialHistory = []; // Array of { day, gold, revenue, expenses }
  }
}

export class AICompetitor {
  id: string;
  name: string;
  homeCityId: string;
  gold: number;
  aggression: number;
  fleet: any[]; // Will be Ship[]
  factories: any[];
  reputation: number;
  active: boolean;
  dailyRoutine: { action: string; goodId: string; priority: string } | null;

  constructor(id: string, name: string, homeCityId: string, aggression: number = 1) {
    this.id = id;
    this.name = name;
    this.homeCityId = homeCityId;
    this.gold = 5000 + Math.random() * 20000;
    this.aggression = aggression;
    this.fleet = [];
    this.factories = [];
    this.reputation = 20 + Math.random() * 30;
    this.active = true;
    this.dailyRoutine = null;
  }

  evaluateMarket(world: any): void {
    const city = world.getCity(this.homeCityId);
    if (!city || !city.market) return;
    for (const [goodId, entry] of Object.entries(city.market.goods as Record<string, { stock: number }>)) {
      if (entry.stock <= 100) {
        this.dailyRoutine = { action: 'buy', goodId, priority: 'high' };
      }
    }
  }
}
