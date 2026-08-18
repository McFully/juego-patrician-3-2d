import { storage } from '../utils/storage';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'hanseatic-strategos-integrity-key-2026';

/**
 * Save/load system: environment-agnostic JSON persistence with integrity verification.
 * Serializes entire Entity-Component map and appends a SHA256 checksum.
 */
export class SaveManager {
  constructor(world, player, aiAgents, politicalSystem, eventSystem) {
    this.world = world;
    this.player = player;
    this.aiAgents = aiAgents;
    this.politicalSystem = politicalSystem;
    this.eventSystem = eventSystem;
  }

  /**
   * Generates a checksum for the given data string.
   */
  generateChecksum(data) {
    return CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
  }

  /**
   * Serialize full game state and sign with checksum.
   */
  serialize() {
    const cities = {};
    // ... existing serialization logic ...
    for (const city of this.world.getAllCities()) {
      cities[city.id] = {
        popPoor: city.popPoor,
        popMiddle: city.popMiddle,
        popRich: city.popRich,
        popBeggar: city.popBeggar,
        housingPoor: city.housingPoor,
        housingMiddle: city.housingMiddle,
        housingRich: city.housingRich,
        cityChest: city.cityChest,
        reputation: city.reputation,
        hasWell: city.hasWell,
        hasHospital: city.hasHospital,
        hasBathHouse: city.hasBathHouse,
        wallLevel: city.wallLevel,
        events: { ...city.events },
        factories: city.factories.map(f => ({
          id: f.id,
          built: f.built,
          workers: f.workers,
        })),
        market: {
          goods: Object.fromEntries(
            Object.entries(city.market.goods)
              .map(([k, v]) => [k, { stock: v.stock }])
          ),
        },
      };
    }

    const payload = {
      version: 1,
      timestamp: Date.now(),
      world: {
        day: this.world.day,
        month: this.world.month,
        year: this.world.year,
        totalDays: this.world.totalDays,
        cities,
      },
      player: this.player ? {
        name: this.player.name,
        gold: this.player.gold,
        rank: this.player.rank,
        reputation: this.player.reputation,
        homeCityId: this.player.homeCityId,
        currentCityId: this.player.currentCityId,
        reputationByCity: this.player.reputationByCity,
        fleet: (this.player.fleet || []).map(ship => ({
          typeId: ship.typeId,
          name: ship.name,
          cargoCapacity: ship.cargoCapacity,
          crew: ship.crew,
          crewMax: ship.crewMax,
          hp: ship.hp,
          hpMax: ship.hpMax,
          upgradeLevel: ship.upgradeLevel,
          sabers: ship.sabers,
          fightingSkill: ship.fightingSkill,
          currentCityId: ship.currentCityId,
          targetCityId: ship.targetCityId,
          inTransit: ship.inTransit,
          transitHours: ship.transitHours,
          transitTotalHours: ship.transitTotalHours,
          cargo: { ...ship.cargo },
          x: ship.x,
          y: ship.y,
          weaponSlots: ship.weaponSlots,
        })),
      } : null,
      aiAgents: (this.aiAgents || []).map(a => ({
        id: a.id,
        name: a.name,
        homeCityId: a.homeCityId,
        gold: a.gold,
        reputation: a.reputation,
        aggression: a.aggression,
        active: a.active,
      })) || [],
    };

    const dataString = JSON.stringify(payload);
    const checksum = this.generateChecksum(dataString);

    return {
      data: payload,
      signature: checksum
    };
  }

  /**
   * Save game state with signature.
   */
  save(saveName) {
    const envelope = this.serialize();
    const json = JSON.stringify(envelope);
    storage.save(saveName, json);
    return { name: saveName, size: json.length };
  }

  /**
   * Load game state and verify signature.
   */
  load(saveName) {
    const json = storage.load(saveName);
    if (!json) return null;
    
    try {
      const envelope = JSON.parse(json);
      if (!envelope.signature || !envelope.data) {
        console.error('Save file corrupt: missing signature.');
        return null;
      }

      const verifiedChecksum = this.generateChecksum(JSON.stringify(envelope.data));
      if (verifiedChecksum !== envelope.signature) {
        console.error('Save file integrity violation! Unauthorized modifications detected.');
        return null;
      }

      return envelope.data;
    } catch (e) {
      console.error('Error parsing save file.', e);
      return null;
    }
  }

  /**
   * Restore world state from loaded data.
   */
  restore(world, data) {
    world.day = data.world.day;
    world.month = data.world.month;
    world.year = data.world.year;
    world.totalDays = data.world.totalDays;

    for (const [cityId, cityData] of Object.entries(data.world.cities)) {
      const city = world.getCity(cityId);
      if (!city) continue;

      city.popPoor = cityData.popPoor;
      city.popMiddle = cityData.popMiddle;
      city.popRich = cityData.popRich;
      city.popBeggar = cityData.popBeggar;
      city.housingPoor = cityData.housingPoor;
      city.housingMiddle = cityData.housingMiddle;
      city.housingRich = cityData.housingRich;
      city.cityChest = cityData.cityChest;
      city.reputation = cityData.reputation;
      city.hasWell = cityData.hasWell;
      city.hasHospital = cityData.hasHospital;
      city.hasBathHouse = cityData.hasBathHouse;
      city.wallLevel = cityData.wallLevel;
      city.events = { ...cityData.events };

      for (const fd of cityData.factories) {
        const factory = city.factories.find(f => f.id === fd.id);
        if (factory) {
          factory.built = fd.built;
          factory.workers = fd.workers;
        }
      }

      for (const [goodId, gd] of Object.entries(cityData.market.goods)) {
        if (city.market.goods[goodId]) {
          city.market.goods[goodId].stock = gd.stock;
        }
      }
    }

    return world;
  }

  listSaves() {
    return storage.list().map(name => ({
      name,
      modified: Date.now() // LocalStorage doesn't provide mtime
    }));
  }
}