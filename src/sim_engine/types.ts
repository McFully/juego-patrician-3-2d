export interface Good {
  id: string;
  name: string;
  volume: 'barrel' | 'cargo';
  volumeUnits: number;
  pMin: number;
  pMax: number;
  sMin: number;
  sMax: number;
  baseCost: number;
}

export interface MarketGoodData {
  stock: number;
}

export interface BuyResult {
  cost: number;
  quantity: number;
}

export interface SellResult {
  revenue: number;
  quantity: number;
}

export interface FinancialRecord {
  day: number;
  gold: number;
  revenue: number;
  expenses: number;
}

export interface Factory {
  id: string;
  name: string;
  built: boolean;
  workers: number;
  maxWorkers: number;
  minWorkers: number;
  inputs: { goodId: string; amount: number }[];
  outputs: { goodId: string; amount: number }[];
  currentInputs: Record<string, number>;
  currentOutputs: Record<string, number>;
}

export interface CityEvents {
  plague: boolean;
  fire: boolean;
  siege: boolean;
  famine: boolean;
}

export interface Ship {
  typeId: string;
  name: string;
  ownerId: string;
  hp: number;
  hpMax: number;
  crew: number;
 crewMax: number;
  cargo: Record<string, number>;
  cargoUsed: number;
  cargoCapacity: number;
  cargoFree: number;
  upgradeLevel: number;
  weaponSlots: number;
  sabers: number;
  cannons: number;
  currentCityId: string;
  targetCityId?: string;
  inTransit: boolean;
  transitHours: number;
  transitTotalHours: number;
  transitProgress: number;
  fightingSkill?: number;
  captain?: any;
  loadCargo(goodId: string, quantity: number): boolean;
  unloadCargo(goodId: string, quantity: number): boolean;
  setTarget(targetCityId: string, travelHours: number): void;
  advanceTransit(hours: number): boolean;
  upgrade(): boolean;
  getBoardingPower(): number;
}
export interface TradingOffice {
  built: boolean;
  managerHired: boolean;
  autoBuyRules: Record<string, any>;
  autoSellRules: Record<string, any>;
  reserves: Record<string, number>;
  storageLimit: number;
  inventory: Record<string, number>;
  budget: number;
}

export interface Player {
  name: string;
  gold: number;
  rank: number;
  reputation: number;
  homeCityId: string;
  currentCityId: string;
  reputationByCity: Record<string, number>;
  fleet: Ship[];
  tradingOffices: Record<string, TradingOffice>;
  financialHistory: FinancialRecord[];
  skills?: {
    sailing: number;
    trading: number;
    combat: number;
  };
}
