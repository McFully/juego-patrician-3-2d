import { describe, it, expect, beforeEach } from 'vitest';
import { Market, pricePerUnit, totalBuyCost, totalSellRevenue } from '../../src/sim_engine/Market';
import { GOODS } from '../../src/database/goods.js';

describe('Market Economy Formulas', () => {
  const grainDef = GOODS.find(g => g.id === 'grain');

  it('pricePerUnit returns pMax when stock is below sMin', () => {
    const price = pricePerUnit(grainDef, 0);
    expect(price).toBe(grainDef.pMax);
  });

  it('pricePerUnit returns pMin when stock is above sMax', () => {
    const price = pricePerUnit(grainDef, 2000);
    expect(price).toBe(grainDef.pMin);
  });

  it('pricePerUnit calculates linear price between sMin and sMax', () => {
    const midpointStock = (grainDef.sMin + grainDef.sMax) / 2;
    const midpointPrice = (grainDef.pMin + grainDef.pMax) / 2;
    const price = pricePerUnit(grainDef, midpointStock);
    expect(price).toBe(midpointPrice);
  });

  it('totalBuyCost increases marginal price as stock decreases', () => {
    const result = totalBuyCost(grainDef, 310, 10);
    expect(result.total).toBeGreaterThan(10 * pricePerUnit(grainDef, 310));
    expect(result.endStock).toBe(300);
  });

  it('totalSellRevenue decreases marginal price as stock increases', () => {
    const result = totalSellRevenue(grainDef, 300, 10);
    expect(result.total).toBeLessThan(10 * pricePerUnit(grainDef, 300));
    expect(result.endStock).toBe(310);
  });
});

describe('Market Class', () => {
  let market: Market;

  beforeEach(() => {
    market = new Market();
  });

  it('initializes with random stock within reasonable bounds', () => {
    for (const g of GOODS) {
      const stock = market.goods[g.id].stock;
      expect(stock).toBeGreaterThanOrEqual(g.sMin);
    }
  });

  it('updates stock after buy', () => {
    const goodId = 'grain';
    const initialStock = market.goods[goodId].stock;
    market.buy(goodId, 5);
    expect(market.goods[goodId].stock).toBe(initialStock - 5);
  });

  it('returns null if buying more than available stock', () => {
    const goodId = 'grain';
    market.goods[goodId].stock = 10;
    const result = market.buy(goodId, 11);
    expect(result).toBeNull();
  });
});
