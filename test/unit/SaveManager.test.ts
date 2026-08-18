import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaveManager } from '../../src/core/SaveManager';
import { storage } from '../../src/utils/storage';

// Mock storage
vi.mock('../../src/utils/storage', () => ({
  storage: {
    save: vi.fn(),
    load: vi.fn(),
    list: vi.fn(() => [])
  }
}));

describe('SaveManager', () => {
  let world: any;
  let player: any;
  let sm: SaveManager;
  let lubeck: any;

  beforeEach(() => {
    lubeck = {
      id: 'lubeck', popPoor: 1000, popMiddle: 500, popRich: 100, popBeggar: 50,
      housingPoor: 10, housingMiddle: 5, housingRich: 1,
      cityChest: 10000, reputation: 50, hasWell: true, hasHospital: false,
      hasBathHouse: false, wallLevel: 1, events: {},
      factories: [],
      market: { goods: { grain: { stock: 100 } } }
    };
    world = {
      day: 1, month: 1, year: 1300, totalDays: 0,
      getAllCities: () => [lubeck],
      getCity: (id: string) => id === 'lubeck' ? lubeck : null
    };
    player = {
      name: 'Test', gold: 10000, rank: 0, reputation: 10,
      homeCityId: 'lubeck', currentCityId: 'lubeck',
      reputationByCity: { lubeck: 50 },
      fleet: []
    };
    sm = new SaveManager(world, player, [], {}, {});
  });

  it('serializes state correctly', () => {
    const envelope = sm.serialize();
    expect(envelope.data.version).toBe(1);
    expect(envelope.data.world.cities.lubeck.popPoor).toBe(1000);
    expect(envelope.data.player.name).toBe('Test');
    expect(envelope.data.world.cities.lubeck.market.goods.grain.stock).toBe(100);
  });

  it('restores state correctly', () => {
    const envelope = sm.serialize();
    envelope.data.world.cities.lubeck.popPoor = 2000;

    sm.restore(world, envelope.data);

    expect(lubeck.popPoor).toBe(2000);
  });
});