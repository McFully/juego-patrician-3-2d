import { describe, expect, it } from 'vitest';
import { GameEngine } from '../../src/GameEngine';

describe('GameEngine core playable loop', () => {
  it('enters a selected city, advances a paused day, and buys into ship cargo safely', () => {
    const engine = new GameEngine();
    engine.newGame('Mercader QA', 'lubeck');

    const initialDay = engine.server.world.totalDays;
    expect(engine.setCurrentCity('riga')).toBe(true);
    expect(engine.player?.currentCityId).toBe('riga');

    engine.stepDay();
    expect(engine.server.world.totalDays).toBe(initialDay + 1);

    const goldBefore = engine.player!.gold;
    const grainBefore = engine.player!.fleet[0].cargo.grain || 0;
    const result = engine.playerBuy('grain', 1);

    expect(result).not.toBeNull();
    expect(engine.player!.gold).toBeLessThan(goldBefore);
    expect(engine.player!.fleet[0].cargo.grain).toBe(grainBefore + 1);
  });

  it('does not mutate market or cargo when buying without enough cargo space', () => {
    const engine = new GameEngine();
    engine.newGame('Mercader QA', 'lubeck');

    const ship = engine.player!.fleet[0];
    const city = engine.server.world.getCity(engine.player!.currentCityId);
    const stockBefore = city.market.goods.grain.stock;
    ship.loadCargo('salt', ship.cargoCapacity);

    const result = engine.playerBuy('grain', 1);

    expect(result).toBeNull();
    expect(city.market.goods.grain.stock).toBe(stockBefore);
    expect(ship.cargo.grain).toBeUndefined();
  });

  it('runs a player trade route from the current port to the next stop', () => {
    const engine = new GameEngine();
    engine.newGame('Mercader QA', 'lubeck');
    engine.setPlayerRoute(['lubeck', 'riga'], {
      rules: [
        { cityId: 'lubeck', goodId: 'grain', action: 'buy', buyAt: 1000 },
        { cityId: 'riga', goodId: 'grain', action: 'sell', sellAt: 0 },
      ],
    });

    const ship = engine.player!.fleet[0];
    engine.stepDay();
    expect(ship.cargo.grain).toBeGreaterThan(0);

    for (let i = 0; i < 20 && ship.currentCityId !== 'riga'; i++) {
      engine.stepDay();
    }

    expect(ship.currentCityId).toBe('riga');
    expect(engine.player!.currentCityId).toBe('riga');
    expect(ship.cargo.grain || 0).toBe(0);
  });
});
