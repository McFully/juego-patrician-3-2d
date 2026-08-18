import { World } from '../sim_engine/City';

export class SimulationEventBus {
  constructor() {
    this.listeners = {};
    this.events = [];
  }

  on(eventType, callback) {
    if (!this.listeners[eventType]) this.listeners[eventType] = [];
    this.listeners[eventType].push(callback);
  }

  off(eventType, callback) {
    const cbs = this.listeners[eventType];
    if (!cbs) return;
    this.listeners[eventType] = cbs.filter(cb => cb !== callback);
  }

  emit(eventType, data) {
    this.events.push({ type: eventType, data, time: Date.now() });
    const cbs = this.listeners[eventType];
    if (cbs) {
      for (const cb of cbs) cb(data);
    }
  }

  drain() {
    this.events = [];
  }
}

export class SimulationServer {
  constructor() {
    this.world = new World();
    this.eventBus = new SimulationEventBus();
    this.running = false;
    this.tickRate = 1000; // 1 second per game day
    this.tickInterval = null;
    this.daysPerTick = 1;
    this.aiAgents = [];
  }

  start() {
    this.running = true;
    this.tickInterval = setInterval(() => this.tick(), this.tickRate);
  }

  stop() {
    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  tick(force = false) {
    if (!this.running && !force) return;

    for (let d = 0; d < this.daysPerTick; d++) {
      const dateInfo = this.world.advanceDay();

      for (const agent of this.aiAgents) {
        if (Math.random() < 0.5) agent.evaluateMarket(this.world);
      }
    }

    const state = this.getState();
    this.eventBus.emit('tick', state);
    this.eventBus.drain();
  }

  getState() {
    const cities = {};
    for (const city of this.world.getAllCities()) {
      const marketPrices = {};
      for (const [goodId, entry] of Object.entries(city.market.goods)) {
        marketPrices[goodId] = {
          stock: Math.round(entry.stock * 100) / 100,
          price: Math.round(city.market.getPrice(goodId) * 100) / 100,
        };
      }
      cities[city.id] = {
        name: city.name,
        population: city.totalPopulation,
        reputation: city.reputation,
        popPoor: city.popPoor,
        popMiddle: city.popMiddle,
        popRich: city.popRich,
        popBeggar: city.popBeggar,
        prices: marketPrices,
        events: city.events,
        cathedral: {
          totalDonated: city.cathedral.totalDonated,
          upgradeLevel: city.cathedral.upgradeLevel,
        },
        moneyLender: {
          loans: city.moneyLender.loans.map(l => ({ ...l })),
        },
        tavern: {
          sailorsAvailable: city.tavern.sailorsAvailable,
          captains: city.tavern.captains.map(c => ({ ...c })),
        }
      };
    }

    return {
      date: { day: this.world.day, month: this.world.month, year: this.world.year },
      totalDays: this.world.totalDays,
      cities,
    };
  }

  getWorld() {
    return this.world;
  }
}
