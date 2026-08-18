import { SimulationServer } from './core/SimulationServer.js';
import { AISystem } from './sim_engine/AISystem';
import { PoliticalSystem, MissionSystem } from './sim_engine/PoliticalSystem';
import { EventSystem } from './sim_engine/EventSystem';
import { Ship } from './data_models/Ship';
import { Player } from './data_models/Player';
import { FleetManager } from './sim_engine/AISystem';
import { SaveManager } from './core/SaveManager.js';
import { DynamicMissionManager } from './sim_engine/DynamicMissions';
import { CombatManager } from './sim_engine/NavalCombat';
import { ForcedAuctionManager } from './sim_engine/ForcedAuction';
import { ShipyardManager } from './sim_engine/Shipyard';
import { Player as PlayerType, Ship as ShipType } from './sim_engine/types';

/**
 * GameEngine: top-level orchestrator that wires all subsystems together.
 * Runs the simulation server, processes events, manages AI, politics, combat.
 */
export class GameEngine {
  server: SimulationServer;
  aiSystem: AISystem;
  playerFleetManager: FleetManager;
  politicalSystem: PoliticalSystem;
  missionSystem: MissionSystem;
  missionManager: DynamicMissionManager | null;
  eventSystem: EventSystem;
  saveManager: SaveManager | null;
  combatManager: CombatManager | null;
  auctionManager: ForcedAuctionManager | null;
  shipyardManager: ShipyardManager;
  player: PlayerType | null;
  running: boolean;
  activeEncounter: any | null;
  _gameOver: string | null;
  _victoryAchieved: boolean;
  _defeatAchieved: boolean;
  _bankruptDays: number;

  constructor() {
    this.server = new SimulationServer();
    this.aiSystem = new AISystem(this.server.world);
    this.playerFleetManager = new FleetManager();
    this.politicalSystem = new PoliticalSystem();
    this.missionSystem = new MissionSystem();
    this.missionManager = null;
    this.eventSystem = new EventSystem(this.server.world);
    this.saveManager = null;
    this.combatManager = null;
    this.auctionManager = null;
    this.shipyardManager = new ShipyardManager();
    this.player = null;
    this.running = false;
    this.activeEncounter = null;
    this._gameOver = null;
    this._victoryAchieved = false;
    this._defeatAchieved = false;
    this._bankruptDays = 0;
  }

  /**
   * Initialize a new game with player.
   */
  newGame(playerName: string, homeCity: string = 'lubeck'): PlayerType {
    const newPlayer = new Player(playerName);
    this.player = newPlayer as unknown as PlayerType;
    this.player.homeCityId = homeCity;
    this.player.currentCityId = homeCity;

    // Give player a starting ship
    const starterShip = new Ship('snaikka', this.player.name);
    starterShip.currentCityId = homeCity;
    this.player.fleet.push(starterShip as unknown as ShipType);

    // Initialize AI competitors
    this.aiSystem = new AISystem(this.server.world);
    this.aiSystem.createAgent('ai_1', 'Hanseatic Trading Co.', 'hamburg', 1);
    this.aiSystem.createAgent('ai_2', 'Baltic Merchant Guild', 'gdansk', 2);
    this.aiSystem.createAgent('ai_3', 'Novgorod Trade Post', 'novgorod', 1);

    // Initialize political councillors for key cities
    for (const city of this.server.world.getAllCities()) {
      this.politicalSystem.initCouncillors(city.id, 3 + Math.floor(Math.random() * 3));
    }

    this.eventSystem = new EventSystem(this.server.world, this.server.eventBus);
    this.missionManager = new DynamicMissionManager(this as any);
    this.combatManager = new CombatManager(this.server.world);
    this.auctionManager = new ForcedAuctionManager();
    this.saveManager = new SaveManager(
      this.server.world,
      this.player as any,
      this.aiSystem.agents,
      this.politicalSystem,
      this.eventSystem
    );

    // Attach player fleet to server AI agents for fleet management
    this.server.aiAgents = this.aiSystem.agents;

    // Add event bus for politics
    this.server.eventBus.on('tick', (state: any) => {
      this.processTick(state);
    });

    this.server.eventBus.emit('game_start', { playerName, homeCity });

    return this.player;
  }

  processTick(state: any) {
    // Process AI daily routines
    this.aiSystem.processDaily();

    // Process player fleet movement (advance by 24 hours)
    if (this.player && this.player.fleet) {
      for (let i = 0; i < 4; i++) {
        this.playerFleetManager.processFleetMove({ ships: this.player.fleet as any, ownerId: 'player' }, this.server.world, this.player as any);
        this.checkEncounters();
      }
    }

    // Process player trading offices
    if (this.player) {
      for (const [cityId, office] of Object.entries(this.player.tradingOffices)) {
        const city = this.server.world.getCity(cityId);
        if (city) {
          this.processTradingOffice(city, office);
        }
      }
    }

    // Process events (plague, fire, etc.)
    this.eventSystem.processDaily();

    // Process combat (pirate spawns, etc.)
    if (this.combatManager) {
      this.combatManager.processDaily(state.totalDays);
    }

    // Process missions daily
    if (this.missionManager) {
      this.missionManager.processDaily();
    }

    // Process building systems
    for (const city of this.server.world.getAllCities()) {
      city.tavern.refresh(state.totalDays);
      if (state.totalDays % 7 === 0) {
        const payments = city.moneyLender.processWeekly(this.player as any);
        if (payments.length > 0) {
          console.log(`[GameEngine] Weekly loan payments in ${city.name}:`, payments);
        }
        city.cathedral.checkUpgrade(city);

        // Record player financial history
        if (this.player && city.id === this.player.homeCityId) {
          this.player.financialHistory.push({
            day: state.totalDays,
            gold: this.player.gold,
            revenue: Math.random() * 5000,
            expenses: Math.random() * 2000,
          });
          if (this.player.financialHistory.length > 12) this.player.financialHistory.shift();
        }
      }
    }

    // Process elections yearly
    this.politicalSystem.processElection(
      this.player?.currentCityId || 'lubeck',
      state.totalDays
    );

    // Process monthly political decay
    if (state.date.day === 1) {
      this.politicalSystem.processMonthly();
    }

    // Check rank advancement
    if (this.player) {
      this.politicalSystem.playerGold = this.player.gold;
      this.politicalSystem.playerReputation = this.player.reputation;
      this.politicalSystem.reputationByCity = this.player.reputationByCity;

      const rankedUp = this.politicalSystem.checkRankUp();
      if (rankedUp) {
        this.player.rank = this.politicalSystem.getRankIndex();
      }

      // Check victory/defeat conditions
      if (this.politicalSystem.getRankIndex() >= 7 && !this._victoryAchieved) {
        this._victoryAchieved = true;
        this._gameOver = 'victory';
      }
      if (this.player.gold <= -1000) {
        this._bankruptDays = (this._bankruptDays || 0) + 1;
        if (this._bankruptDays >= 30 && !this._defeatAchieved) {
          this._defeatAchieved = true;
          this._gameOver = 'defeat_bankruptcy';
        }
      } else {
        this._bankruptDays = 0;
      }
      const allRepZero = Object.values(this.politicalSystem.reputationByCity || {}).every(r => r <= 0);
      if (allRepZero && !this._defeatAchieved) {
        this._defeatAchieved = true;
        this._gameOver = 'defeat_exile';
      }
    }
  }

  start() {
    this.running = true;
    this.server.start();
    console.log(`[GameEngine] Game started. Player: ${this.player?.name}, Rank: ${this.politicalSystem.getRankName()}`);
  }

  stop() {
    this.running = false;
    this.server.stop();
    console.log('[GameEngine] Game stopped.');
  }

  stepDay() {
    this.server.tick(true);
  }

  setCurrentCity(cityId: string) {
    if (!this.player) return false;
    const city = this.server.world.getCity(cityId);
    if (!city) return false;
    this.player.currentCityId = cityId;
    return true;
  }

  playerBuy(goodId: string, quantity: number) {
    if (!this.player) return null;
    const city = this.server.world.getCity(this.player.currentCityId);
    if (!city) return null;
    const ship = this.player.fleet[0];
    if (!ship || ship.cargoFree < quantity) return null;
    const quote = city.market.quoteBuy(goodId, quantity);
    if (!quote || this.player.gold < quote.cost) return null;
    const result = city.market.buy(goodId, quantity);
    if (result) {
      this.player.gold -= result.cost;
      ship.loadCargo(goodId, quantity);
      this.server.eventBus.emit('trade_buy', { goodId, quantity, cost: result.cost });
    }
    return result;
  }

  playerSell(goodId: string, quantity: number) {
    if (!this.player) return null;
    const city = this.server.world.getCity(this.player.currentCityId);
    if (!city) return null;
    const ship = this.player.fleet[0];
    if (ship) {
      const unloaded = ship.unloadCargo(goodId, quantity);
      if (!unloaded) return null;
    }
    const result = city.market.sell(goodId, quantity);
    if (result) {
      this.player.gold += result.revenue;
      if (goodId === 'grain') {
        this.onGrainSold(city.id, quantity);
      }
      this.server.eventBus.emit('trade_sell', { goodId, quantity, revenue: result.revenue });
    }
    return result;
  }

  buildFactory(factoryId: string) {
    if (!this.player) return false;
    const city = this.server.world.getCity(this.player.currentCityId);
    if (!city) return false;
    const factory = city.factories.find((f: any) => f.id === factoryId);
    if (!factory || factory.built) return false;

    const buildCost = 2000;
    if (this.player.gold < buildCost) return false;

    this.player.gold -= buildCost;
    factory.built = true;
    factory.workers = 0;
    return true;
  }

  hireWorkers(factoryId: string, count: number) {
    const city = this.server.world.getCity(this.player?.currentCityId || 'lubeck');
    if (!city) return false;
    const factory = city.factories.find((f: any) => f.id === factoryId);
    if (!factory || !factory.built) return false;

    const available = Math.min(city.popBeggar, count, factory.maxWorkers - factory.workers);
    if (available <= 0) return false;

    city.popBeggar -= available;
    factory.workers += available;
    return available;
  }

  buildShip(cityId: string, shipTypeId: string) {
    const city = this.server.world.getCity(cityId);
    if (!city) return { success: false, reason: 'City not found' };

    const shipyard = this.shipyardManager.getShipyard(cityId);
    const result = shipyard.buildShip(shipTypeId, city.market, this.player?.gold || 0);

    if (result.success && this.player) {
      this.player.gold -= result.cost || 0;
    }

    return result;
  }

  repairShip(cityId: string, shipIndex: number) {
    const city = this.server.world.getCity(cityId);
    const ship = this.player?.fleet[shipIndex];
    if (!city || !ship) {
      return { success: false, reason: 'Invalid ship or city' };
    }

    const shipyard = this.shipyardManager.getShipyard(cityId);
    const result = shipyard.repairShip(ship as any, city.market, this.player?.gold || 0);

    if (result.success) {
      if (this.player) this.player.gold -= result.cost || 0;
    }

    return result;
  }

  upgradeShip(cityId: string, shipIndex: number) {
    const city = this.server.world.getCity(cityId);
    const ship = this.player?.fleet[shipIndex];
    if (!city || !ship) {
      return { success: false, reason: 'Invalid ship or city' };
    }

    const shipyard = this.shipyardManager.getShipyard(cityId);
    const result = shipyard.upgradeShip(ship as any, city.market, this.player?.gold || 0);

    if (result.success) {
      if (this.player) this.player.gold -= result.cost || 0;
    }

    return result;
  }

  getShipyardInfo(cityId: string) {
    const shipyard = this.shipyardManager.getShipyard(cityId);
    return {
      level: shipyard.level,
      xp: shipyard.xp,
      buildSpeed: shipyard.buildSpeedMod,
      repairSpeed: shipyard.repairSpeedMod,
    };
  }

  setPlayerRoute(cityIds: string[], routeOptions: any = {}) {
    const normalizedRules = this.normalizeRouteRules(routeOptions);
    this.playerFleetManager.createRoute('player', cityIds, normalizedRules);
  }

  normalizeRouteRules(routeOptions: any) {
    const rules = Array.isArray(routeOptions?.rules) ? routeOptions.rules : null;
    if (!rules) return routeOptions || {};

    const perStop: Record<string, { buy: Record<string, number>; sell: Record<string, number> }> = {};
    for (const rule of rules) {
      if (!rule?.cityId || !rule?.goodId) continue;
      if (!perStop[rule.cityId]) perStop[rule.cityId] = { buy: {}, sell: {} };
      if (rule.action === 'buy' || rule.action === 'both') {
        perStop[rule.cityId].buy[rule.goodId] = Number(rule.buyAt) || 0;
      }
      if (rule.action === 'sell' || rule.action === 'both') {
        perStop[rule.cityId].sell[rule.goodId] = Number(rule.sellAt) || 0;
      }
    }

    return { perStop };
  }

  processTradingOffice(city: any, office: any) {
    if (!office?.built || !office.managerHired) return;
    office.inventory ||= {};
    office.autoBuyRules ||= {};
    office.autoSellRules ||= {};
    office.reserves ||= {};
    office.storageLimit ||= 5000;
    office.budget ||= 0;

    const storageUsed = Object.values(office.inventory).reduce((sum: number, qty: any) => sum + Number(qty || 0), 0);

    for (const [goodId, rule] of Object.entries(office.autoBuyRules) as any[]) {
      if (rule.active === false) continue;
      const maxPrice = Number(rule.maxPrice ?? rule.buyPrice ?? 0);
      const targetStock = Number(rule.targetStock ?? rule.maxQuantity ?? 0);
      const currentStock = Number(office.inventory[goodId] || 0);
      const wanted = Math.max(0, targetStock - currentStock);
      if (wanted <= 0 || city.market.getPrice(goodId) > maxPrice) continue;

      let qty = Math.floor(Math.min(wanted, office.storageLimit - storageUsed, office.budget / Math.max(city.market.getPrice(goodId), 1)));
      while (qty > 0) {
        const quote = city.market.quoteBuy(goodId, qty);
        if (quote && quote.cost <= office.budget) break;
        qty -= 1;
      }
      if (qty <= 0) continue;

      const result = city.market.buy(goodId, qty);
      if (result) {
        office.budget -= result.cost;
        office.inventory[goodId] = currentStock + result.quantity;
      }
    }

    for (const [goodId, rule] of Object.entries(office.autoSellRules) as any[]) {
      if (rule.active === false) continue;
      const minPrice = Number(rule.minPrice ?? rule.sellPrice ?? 0);
      const reserve = Number(rule.reserveStock ?? office.reserves[goodId] ?? 0);
      const currentStock = Number(office.inventory[goodId] || 0);
      const available = Math.max(0, currentStock - reserve);
      if (available <= 0 || city.market.getPrice(goodId) < minPrice) continue;

      const maxQuantity = Number(rule.maxQuantity ?? available);
      const qty = Math.floor(Math.min(available, maxQuantity));
      const result = city.market.sell(goodId, qty);
      if (result) {
        office.budget += result.revenue;
        office.inventory[goodId] = currentStock - result.quantity;
      }
    }
  }

  bribeCouncillor(cityId: string, councillorIndex: number, amount: number) {
    if (!this.player) return false;
    this.politicalSystem.playerGold = this.player.gold;
    const success = this.politicalSystem.bribeCouncillor(cityId, councillorIndex, amount);
    if (success) {
      this.player.gold = this.politicalSystem.playerGold;
    }
    return success;
  }

  buildTradingOffice() {
    if (!this.player) return false;
    const city = this.server.world.getCity(this.player.currentCityId);
    if (!city) return false;

    const cost: Record<string, number> = { bricks: 60, timber: 20, tools: 10 };
    const ship = this.player.fleet[0];
    if (!ship) return false;

    for (const [goodId, amount] of Object.entries(cost)) {
      if ((ship.cargo[goodId] || 0) < amount) return false;
    }
    for (const [goodId, amount] of Object.entries(cost)) {
      ship.unloadCargo(goodId, amount);
    }

    this.player.tradingOffices[city.id] = {
      built: true,
      managerHired: false,
      autoBuyRules: {},
      autoSellRules: {},
      reserves: {},
      storageLimit: 5000,
      inventory: {},
      budget: 0,
    };
    return true;
  }

  ensureTradingOffice(cityId: string) {
    if (!this.player) return false;
    const city = this.server.world.getCity(cityId);
    if (!city) return false;
    if (!this.player.tradingOffices[cityId]) {
      this.player.tradingOffices[cityId] = {
        built: true,
        managerHired: false,
        autoBuyRules: {},
        autoSellRules: {},
        reserves: {},
        storageLimit: 5000,
        inventory: {},
        budget: 0,
      };
    }
    return true;
  }

  hireOfficeManager(cityId: string) {
    if (!this.player) return false;
    const office = this.player.tradingOffices[cityId];
    if (!office?.built) return false;
    if (office.managerHired) return true;
    const cost = 300;
    if (this.player.gold < cost) return false;
    this.player.gold -= cost;
    office.managerHired = true;
    return true;
  }

  transferOfficeBudget(cityId: string, amount: number) {
    if (!this.player) return false;
    const office = this.player.tradingOffices[cityId];
    if (!office?.built || amount === 0) return false;
    if (amount > 0) {
      if (this.player.gold < amount) return false;
      this.player.gold -= amount;
      office.budget = (office.budget || 0) + amount;
      return true;
    }
    const withdraw = Math.abs(amount);
    if ((office.budget || 0) < withdraw) return false;
    office.budget -= withdraw;
    this.player.gold += withdraw;
    return true;
  }

  checkEncounters() {
    if (!this.player) return;
    
    for (const ship of this.player.fleet) {
      if (ship.inTransit && !this.activeEncounter) {
        if (Math.random() < 0.05) {
          this.activeEncounter = {
            type: 'pirate',
            ship: ship,
            enemyFleet: {
              name: 'Black Beard Piracy',
              ships: [{ typeId: 'snaikka', hp: 80, hpMax: 100, name: 'Revenge' }]
            }
          };
          this.server.eventBus.emit('encounter_start', this.activeEncounter);
        }
      }
    }
  }

  resolveEncounter(action: string) {
    if (!this.activeEncounter) return null;

    const result = { action, success: false, message: '' };

    if (action === 'flee') {
      const success = Math.random() < 0.6;
      result.success = success;
      result.message = success ? 'Has logrado escapar.' : 'La huida ha fallado. Debes combatir.';
      if (success) this.activeEncounter = null;
    } else if (action === 'fight') {
      result.success = true;
      result.message = 'Combate iniciado.';
    } else if (action === 'surrender') {
      this.activeEncounter.ship.cargo = {};
      result.success = true;
      result.message = 'Has entregado la carga. Los piratas se retiran.';
      this.activeEncounter = null;
    }

    return result;
  }

  getAvailableMissions() {
    return this.missionManager?.generateAvailableMissions() || [];
  }

  getActiveMissions() {
    return this.missionManager?.activeMissions || [];
  }

  getCompletedMissions() {
    return this.missionManager?.completedMissions || [];
  }

  startMission(missionId: string) {
    return this.missionManager?.startMission(missionId) || { success: false };
  }

  getMissionProgress(missionId: string) {
    return this.missionManager?.getMissionProgress(missionId) || { status: 'unknown' };
  }

  onPirateKilled() {
    this.missionManager?.onPirateKilled();
  }

  onGrainSold(cityId: string, amount: number) {
    this.missionManager?.onGrainSold(cityId, amount);
  }

  onCityFounded(cityId: string, population: number) {
    this.missionManager?.onCityFounded(cityId, population);
  }

  onBuildingUpgraded(cityId: string, buildingType: string, level: number) {
    this.missionManager?.onBuildingUpgraded(cityId, buildingType, level);
  }

  takeLoan(amount: number, weeks: number) {
    if (!this.player) return null;
    const city = this.server.world.getCity(this.player.currentCityId);
    if (!city) return null;
    
    const loan = city.moneyLender.takeLoan(amount, weeks, this.player.rank);
    this.player.gold += loan.amount;
    return loan;
  }

  repayLoan(loanId: number) {
    if (!this.player) return false;
    const city = this.server.world.getCity(this.player.currentCityId);
    if (!city) return false;
    return city.moneyLender.repayLoan(loanId, this.player as any);
  }

  getLoans() {
    if (!this.player) return [];
    const city = this.server.world.getCity(this.player.currentCityId);
    return city?.moneyLender.loans || [];
  }

  getTavernInfo() {
    const city = this.server.world.getCity(this.player?.currentCityId || 'lubeck');
    if (!city) return null;
    return {
      sailorsAvailable: city.tavern.sailorsAvailable,
      captains: city.tavern.captains
    };
  }

  hireSailors(count: number, shipIndex: number) {
    if (!this.player) return 0;
    const city = this.server.world.getCity(this.player.currentCityId);
    const ship = this.player.fleet[shipIndex];
    if (!city || !ship) return 0;
    return city.tavern.hireSailors(count, ship as any, this.player as any);
  }

  hireCaptain(captainId: string, shipIndex: number) {
    if (!this.player) return false;
    const city = this.server.world.getCity(this.player.currentCityId);
    const ship = this.player.fleet[shipIndex];
    if (!city || !ship) return false;
    return city.tavern.hireCaptain(captainId, ship as any, this.player as any);
  }

  donateToCathedral(amount: number) {
    if (!this.player) return 0;
    const city = this.server.world.getCity(this.player.currentCityId);
    if (!city) return 0;
    return city.cathedral.donate(amount, this.player as any, city);
  }

  getCathedralInfo() {
    const city = this.server.world.getCity(this.player?.currentCityId || 'lubeck');
    if (!city) return null;
    return {
      totalDonated: city.cathedral.totalDonated,
      upgradeLevel: city.cathedral.upgradeLevel,
      nextUpgrade: city.cathedral.getUpgradeRequirement(city.cathedral.upgradeLevel)
    }
  }

  buyWeapons(type: 'saber' | 'cannon', count: number, shipIndex: number) {
    if (!this.player) return false;
    const ship = this.player.fleet[shipIndex];
    if (!ship) return false;

    const costs = {
      saber: 50,
      cannon: 500
    };
    const cost = (costs[type] || 0) * count;
    if (this.player.gold < cost) return false;

    this.player.gold -= cost;
    if (type === 'saber') {
      ship.sabers = (ship.sabers || 0) + count;
    } else if (type === 'cannon') {
      ship.cannons = (ship.cannons || 0) + count;
    }
    return true;
  }

  getMissionUIData() {
    return this.missionManager?.getUIData() || { available: [], active: [], completed: [] };
  }

  deliverResourcesToFoundingSite(missionId: string, goodId: string, quantity: number) {
    return this.missionManager?.deliverToFoundingSite(missionId, goodId, quantity) || false;
  }

  raidHideout(hideoutId: string) {
    if (!this.player || !this.combatManager) return { success: false, reason: 'No player or combat manager' };
    const playerFleet = this.player.fleet.filter(s => s.currentCityId === this.player?.currentCityId); // Assume raiding from current city or similar logic
    // Actually, normally you'd raid with the fleet at the hideout's location.
    // For now, let's use the first fleet for simplicity in this engine-level bridge.
    return this.combatManager.raidHideout(this.player.fleet as any, hideoutId);
  }

  saveGame(saveName: string) {
    if (!this.saveManager) return null;
    return this.saveManager.save(saveName);
  }

  loadGame(saveName: string) {
    if (!this.saveManager) return null;
    const data = this.saveManager.load(saveName);
    if (!data) return null;
    this.saveManager.restore(this.server.world, data);
    if (data.player && this.player) {
      this.player.gold = data.player.gold;
      this.player.rank = data.player.rank;
      this.player.reputation = data.player.reputation;
      this.player.homeCityId = data.player.homeCityId;
      this.player.currentCityId = data.player.currentCityId;
      this.player.reputationByCity = data.player.reputationByCity;
    }
    return data;
  }

  getGameState() {
    const simState = this.server.getState();
    return {
      simulation: simState,
      player: this.player ? {
        name: this.player.name,
        gold: this.player.gold,
        rank: this.politicalSystem.getRankName(),
        rankIndex: this.player.rank,
        reputation: this.player.reputation,
        currentCity: this.player.currentCityId,
        currentCityId: this.player.currentCityId,
        tradingOffices: this.player.tradingOffices,
        financialHistory: this.player.financialHistory,
        fleet: this.player.fleet.map(s => ({
          typeId: s.typeId,
          name: s.name,
          cargo: s.cargo,
          cargoUsed: s.cargoUsed,
          cargoCapacity: s.cargoCapacity,
          crew: s.crew,
          crewMax: s.crewMax,
          hp: s.hp,
          hpMax: s.hpMax,
          upgradeLevel: s.upgradeLevel,
          sabers: s.sabers,
          currentCity: s.currentCityId,
          targetCity: s.targetCityId,
          inTransit: s.inTransit,
          transitProgress: s.inTransit ? (s.transitHours / s.transitTotalHours) : 0,
        })),
        activeRoute: this.playerFleetManager.routes.player || null,
      } : null,
      politics: {
        rank: this.politicalSystem.getRankName(),
        rankIndex: this.player?.rank ?? 0,
        gold: this.player?.gold ?? 0,
        reputation: this.player?.reputation ?? 0,
        councillors: this.politicalSystem.councillors[this.player?.currentCityId || 'lubeck'] || [],
        auctions: this.auctionManager ? this.auctionManager.getAuction(this.player?.currentCityId || 'lubeck').currentAuction : null,
        canBecomeAlderman: this.politicalSystem.canBecomeAlderman(this.missionManager?.completedMissions || []),
        activeMissions: this.missionManager?.activeMissions || [],
      },
    };
  }

  getGameStatus() {
    return {
      gameOver: this._gameOver || null,
      victory: this._victoryAchieved || false,
      bankruptDays: this._bankruptDays || 0,
      rank: this.politicalSystem?.getRankName(),
      rankIndex: this.politicalSystem?.getRankIndex(),
    };
  }
}
