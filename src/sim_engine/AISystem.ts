import { AICompetitor } from '../data_models/Player';
import { Ship } from '../data_models/Ship';
import { World } from './City';

export interface TradeRules {
  buy?: Record<string, number>;
  sell?: Record<string, number>;
  perStop?: Record<string, TradeRules>;
}

export interface Route {
  fleetId: string;
  stops: string[];
  currentStopIndex: number;
  tradeRules: TradeRules;
  active: boolean;
  portStopHours: number;
}

/**
 * FleetManager: handles AI fleet movement, trading logic, and ship automation.
 * Port stop consumes exactly 6 hours per stop (HUB-AND-SPOKE).
 */
export class FleetManager {
  routes: Record<string, Route>;

  constructor() {
    this.routes = {};
  }

  /**
   * Create a trade route for a fleet between cities.
   * @param fleetId
   * @param cityIds - ordered list of stops
   * @param tradeRules - { buy: { goodId: maxPrice }, sell: { goodId: minPrice } }
   */
  createRoute(fleetId: string, cityIds: string[], tradeRules: TradeRules): void {
    this.routes[fleetId] = {
      fleetId,
      stops: cityIds,
      currentStopIndex: 0,
      tradeRules,
      active: true,
      portStopHours: 6, // immutable: 6 hours per port stop
    };
  }

  /**
   * Process fleet move: advance along route.
   * Each port stop = 6 hours consumed.
   */
  processFleetMove(fleet: { fleetId?: string; ownerId: string; ships: Ship[] }, world: World, owner: { gold: number; currentCityId?: string }): void {
    const route = this.routes[fleet.fleetId || fleet.ownerId];
    if (!route || !route.active) return;

    for (const ship of fleet.ships) {
      if (ship.inTransit) {
        const arrived = ship.advanceTransit(route.portStopHours);
        if (arrived) {
          owner.currentCityId = ship.currentCityId || owner.currentCityId;
          this.executeTradeAtStop(ship, world, route, owner);
          route.currentStopIndex = (route.currentStopIndex + 1) % route.stops.length;
        }
      } else {
        // Begin transit to next stop
        const nextCityId = route.stops[route.currentStopIndex];
        if (nextCityId && nextCityId === ship.currentCityId) {
          this.executeTradeAtStop(ship, world, route, owner);
          route.currentStopIndex = (route.currentStopIndex + 1) % route.stops.length;
        } else if (nextCityId) {
          const travelHours = this.calculateTravelHours(ship, ship.currentCityId!, nextCityId, world);
          ship.setTarget(nextCityId, travelHours);
        }
      }
    }
  }

  calculateTravelHours(ship: Ship, fromCityId: string, toCityId: string, world: World): number {
    const from = world.getCity(fromCityId);
    const to = world.getCity(toCityId);
    if (!from || !to) return 12;
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.max(1, Math.ceil(distance / ship.speed));
  }

  executeTradeAtStop(ship: Ship, world: World, route: Route, owner: { gold: number }): void {
    const city = world.getCity(ship.currentCityId!);
    if (!city) return;
    const tradeRules = route.tradeRules.perStop?.[city.id] || route.tradeRules;

    for (const [goodId, maxBuyPrice] of Object.entries(tradeRules.buy || {})) {
      const price = city.market.getPrice(goodId);
      if (price <= maxBuyPrice && ship.cargoFree > 0) {
        const maxAffordable = Math.floor(owner.gold / price);
        const qty = Math.min(10, ship.cargoFree, maxAffordable);
        if (qty > 0) {
          const result = city.market.buy(goodId, qty);
          if (result) {
            owner.gold -= result.cost;
            ship.loadCargo(goodId, qty);
          }
        }
      }
    }

    for (const [goodId, minSellPrice] of Object.entries(tradeRules.sell || {})) {
      const price = city.market.getPrice(goodId);
      if (price >= minSellPrice && (ship.cargo[goodId] || 0) > 0) {
        const qty = Math.min(ship.cargo[goodId], 10);
        const result = city.market.sell(goodId, qty);
        if (result) {
          owner.gold += result.revenue;
          ship.unloadCargo(goodId, qty);
        }
      }
    }
  }
}

export class AISystem {
  world: World;
  agents: AICompetitor[];
  fleetManager: FleetManager;

  constructor(world: World) {
    this.world = world;
    this.agents = [];
    this.fleetManager = new FleetManager();
  }

  createAgent(id: string, name: string, homeCityId: string, aggression: number = 1): AICompetitor {
    const agent = new AICompetitor(id, name, homeCityId, aggression);
    
    // Give AI a starting ship
    const starterShip = new Ship('snaikka', agent.id);
    starterShip.currentCityId = homeCityId;
    agent.fleet.push(starterShip);

    // Create an automatic trade route for this agent: Home city to lubeck/hamburg and back
    const otherStops = homeCityId === 'lubeck' ? ['hamburg', 'gdansk'] : ['lubeck', homeCityId];
    this.fleetManager.createRoute(agent.id, [homeCityId, ...otherStops], {
      buy: { salt: 20, grain: 15, beer: 35, timber: 12 },
      sell: { salt: 40, grain: 25, beer: 55, timber: 25 }
    });

    this.agents.push(agent);
    return agent;
  }

  processDaily(): void {
    for (const agent of this.agents) {
      if (!agent.active) continue;
      agent.evaluateMarket(this.world);

      // Check housing: if occupancy > 95%, build houses
      const city = this.world.getCity(agent.homeCityId);
      if (city) {
        if (city.housingOccupancyPoor > 0.95 && agent.gold > 2000) {
          city.housingPoor += 1;
          agent.gold -= 500;
        }
        if (city.housingOccupancyMiddle > 0.95 && agent.gold > 5000) {
          city.housingMiddle += 1;
          agent.gold -= 1500;
        }
        if (city.housingOccupancyRich > 0.95 && agent.gold > 10000) {
          city.housingRich += 1;
          agent.gold -= 4000;
        }

        // Fleet Expansion: build new ships if wealthy
        if (agent.gold > 50000 && agent.fleet.length < 10) {
          const ship = new Ship('snaikka', agent.id); // Snaikka templates are dynamic
          agent.gold -= 15000;
          agent.fleet.push(ship);
          
          // Re-create route with additional stops for expanded fleet
          this.fleetManager.createRoute(agent.id, [agent.homeCityId, 'lubeck', 'hamburg', 'gdansk'], {
            buy: { salt: 22, grain: 16, beer: 38, timber: 14 },
            sell: { salt: 38, grain: 24, beer: 52, timber: 22 }
          });
        }
      }

      // Process AI daily fleet movement (4 hours advances per day step)
      if (agent.fleet && agent.fleet.length > 0) {
        for (let i = 0; i < 4; i++) {
          this.fleetManager.processFleetMove({ ships: agent.fleet, ownerId: agent.id }, this.world, agent);
        }
      }

      // Market manipulation: if good below sMin, buy and transport
      if (agent.dailyRoutine && agent.dailyRoutine.action === 'buy') {
        const goodId = agent.dailyRoutine.goodId;
        const marketGood = city?.market.goods[goodId];
        if (marketGood && marketGood.stock <= 100) {
          const buyResult = city.market.buy(goodId, Math.min(50, marketGood.stock));
          if (buyResult) {
            agent.gold -= buyResult.cost;
          }
        }
      }
    }
  }
}
