import { World } from './City';

/**
 * Dynamic event system: plagues, fires, sieges, famines.
 */

export interface GameEvent {
  type: string;
  cityId: string;
  resolved: boolean;
  daysLeft?: number;
  intensity?: number;
}

export class EventSystem {
  world: World;
  eventBus: any;
  eventChance: number;
  activeEvents: GameEvent[];

  constructor(world: World, eventBus: any = null) {
    this.world = world;
    this.eventBus = eventBus;
    this.eventChance = 0.002; // 0.2% per day base
    this.activeEvents = [];
  }

  processDaily(): void {
    // Process existing events
    for (const event of this.activeEvents) {
      this.processEvent(event);
    }
    this.activeEvents = this.activeEvents.filter(e => !e.resolved);

    // Roll for new event
    if (Math.random() < this.eventChance) {
      this.triggerRandomEvent();
    }
  }

  triggerRandomEvent(): void {
    const events = ['plague', 'fire', 'siege', 'famine'];
    const type = events[Math.floor(Math.random() * events.length)];
    const cities = this.world.getAllCities();
    const city = cities[Math.floor(Math.random() * cities.length)];

    let triggered = false;
    const eventData = { type, cityId: city.id, cityName: city.name };

    switch (type) {
      case 'plague':
        if (city.totalPopulation > 800 && !city.hasWell && !city.hasHospital) {
          city.events.plague = true;
          this.activeEvents.push({ type: 'plague', cityId: city.id, daysLeft: 20 + Math.random() * 30, resolved: false });
          triggered = true;
        }
        break;
      case 'fire':
        if (city.housingPoor > 10 && !city.hasWell) {
          city.events.fire = true;
          this.activeEvents.push({ type: 'fire', cityId: city.id, intensity: 0.1 + Math.random() * 0.3, resolved: false });
          triggered = true;
        }
        break;
      case 'siege':
        city.events.siege = true;
        this.activeEvents.push({ type: 'siege', cityId: city.id, daysLeft: 15 + Math.random() * 20, resolved: false });
        triggered = true;
        break;
      case 'famine':
        if (this.world.month >= 11 || this.world.month <= 2) {
          city.events.famine = true;
          this.activeEvents.push({ type: 'famine', cityId: city.id, daysLeft: 30 + Math.random() * 30, resolved: false });
          triggered = true;
        }
        break;
    }

    if (triggered && this.eventBus) {
      this.eventBus.emit('game_event', eventData);
    }
  }

  processEvent(event: GameEvent): void {
    const city = this.world.getCity(event.cityId);
    if (!city) { event.resolved = true; return; }

    switch (event.type) {
      case 'plague': {
        // Reduce population 3% daily, stop industries when <30 workers
        const reduction = city.totalPopulation * 0.03;
        city.popPoor = Math.max(0, Math.floor(city.popPoor - reduction * 0.5));
        city.popMiddle = Math.max(0, Math.floor(city.popMiddle - reduction * 0.3));
        city.popRich = Math.max(0, Math.floor(city.popRich - reduction * 0.2));
        city.popBeggar += Math.floor(reduction * 0.3);

        for (const factory of city.factories) {
          if (factory.built && factory.workers < 30) {
            factory.workers = 0;
          }
        }

        if (event.daysLeft !== undefined) {
          event.daysLeft--;
          if (event.daysLeft <= 0) {
            city.events.plague = false;
            event.resolved = true;
          }
        }
        break;
      }

      case 'fire': {
        // Destroy housing blocks sequentially
        const housesDestroyed = Math.max(1, Math.floor(city.housingPoor * (event.intensity || 0.1)));
        city.housingPoor = Math.max(0, city.housingPoor - housesDestroyed);
        city.popPoor = Math.max(0, city.popPoor - housesDestroyed * 4);
        city.popBeggar += housesDestroyed;

        // Fire ends after 3-5 days
        event.daysLeft = (event.daysLeft || 3) - 1;
        if (event.daysLeft <= 0) {
          city.events.fire = false;
          event.resolved = true;
        }
        break;
      }

      case 'siege': {
        // Stop land exports
        if (event.daysLeft !== undefined) {
          event.daysLeft--;
          if (event.daysLeft <= 0) {
            city.events.siege = false;
            // If siege wins: confiscate 50-100% of city chest
            if (city.wallLevel === 0 || Math.random() < 0.4) {
              const confiscation = city.cityChest * (0.5 + Math.random() * 0.5);
              city.cityChest -= Math.floor(confiscation);
            }
            event.resolved = true;
          }
        }
        break;
      }

      case 'famine': {
        // Winter famine: grain reserves depleted, riots assault player warehouses
        const grainStock = city.market.goods['grain']?.stock || 0;
        if (grainStock < 100 && city.popPoor > 200) {
          // Riots
          const stolen = Math.min(city.market.goods['grain']?.stock || 0, 50);
          if (stolen > 0) {
            city.market.removeStock('grain', stolen);
            city.popBeggar += 10;
          }
        }
        if (event.daysLeft !== undefined) {
          event.daysLeft--;
          if (event.daysLeft <= 0) {
            city.events.famine = false;
            event.resolved = true;
          }
        }
        break;
      }
    }
  }
}
