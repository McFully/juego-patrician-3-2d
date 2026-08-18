import { Factory, Good } from './types';

/**
 * Data-Oriented Design (DOD) optimizations.
 * Uses contiguous flat arrays (Float64Array, Uint32Array) instead of objects
 * for massive population elasticity and goods consumption calculations.
 *
 * 1000 inhabitants consuming beer, fish, bread, etc. are processed as
 * array operations rather than object property lookups.
 */

// Good IDs mapped to indices for array access
export const GOOD_INDICES: Record<string, number> = {
  beer: 0, fish: 1, meat: 2, bread: 3, grain: 4,
  wool: 5, cloth: 6, wine: 7, timber: 8, iron: 9,
  salt: 10, honey: 11, wax: 12, hemp: 13, ropes: 14,
  tar: 15, bricks: 16, tools: 17, candles: 18, pottery: 19,
};

// Weekly consumption per 1000 pop, stored in flat arrays [poor, middle, rich]
const CONSUMPTION_MATRIX = new Float64Array([
  // beer: poor=20, middle=25, rich=0
  20, 25, 0,
  // fish: poor=15, middle=0, rich=0
  15, 0, 0,
  // meat: poor=0, middle=10, rich=15
  0, 10, 15,
  // bread: poor=30, middle=15, rich=5
  30, 15, 5,
  // grain: poor=10, middle=0, rich=0
  10, 0, 0,
  // wool: poor=0, middle=0, rich=0
  0, 0, 0,
  // cloth: poor=0, middle=3, rich=8
  0, 3, 8,
  // wine: poor=0, middle=5, rich=20
  0, 5, 20,
  // timber: poor=0, middle=0, rich=0
  0, 0, 0,
  // iron: poor=0, middle=0, rich=0
  0, 0, 0,
  // salt: poor=0, middle=0, rich=0
  0, 0, 0,
  // honey: poor=0, middle=2, rich=5
  0, 2, 5,
  // wax: poor=0, middle=0, rich=3
  0, 0, 3,
  // hemp: poor=0, middle=0, rich=0
  0, 0, 0,
  // ropes: poor=0, middle=0, rich=0
  0, 0, 0,
  // tar: poor=0, middle=0, rich=0
  0, 0, 0,
  // bricks: poor=0, middle=0, rich=0
  0, 0, 0,
  // tools: poor=0, middle=0, rich=0
  0, 0, 0,
  // candles: poor=3, middle=5, rich=10
  3, 5, 10,
  // pottery: poor=2, middle=4, rich=2
  2, 4, 2,
]);

const GOODS_COUNT = 20;
const CLASSES = 3;

/**
 * Calculate daily demand vector as flat Float64Array.
 * @param popPoor
 * @param popMiddle
 * @param popRich
 * @param scale - population scale (default 1000)
 * @returns length 20, values = daily demand per good
 */
export function calculateDemandDOD(popPoor: number, popMiddle: number, popRich: number, scale: number = 1000): Float64Array {
  const demand = new Float64Array(GOODS_COUNT);
  const pops = [popPoor, popMiddle, popRich];
  const dailyFactor = 1 / 7; // weekly → daily

  for (let g = 0; g < GOODS_COUNT; g++) {
    let total = 0;
    for (let c = 0; c < CLASSES; c++) {
      const rate = CONSUMPTION_MATRIX[g * CLASSES + c];
      if (rate > 0) {
        total += (pops[c] / scale) * rate;
      }
    }
    demand[g] = total * dailyFactor;
  }

  return demand;
}

export interface MarketSubset {
  goods: Record<string, { stock: number }>;
}

/**
 * Batch consume goods from city market stock (fast array ops).
 * @param market - market with goods object
 * @param demand - demand vector from calculateDemandDOD
 */
export function batchConsume(market: MarketSubset, demand: Float64Array): void {
  const goodNames = Object.keys(GOOD_INDICES);
  for (let g = 0; g < GOODS_COUNT; g++) {
    if (demand[g] <= 0) continue;
    const goodId = goodNames[g];
    if (market.goods[goodId]) {
      market.goods[goodId].stock = Math.max(0, market.goods[goodId].stock - demand[g]);
    }
  }
}

/**
 * Agglomeration & regional factory efficiency as flat arrays.
 * @param factories - factory objects with .built and .workers
 * @param cityProduction - 'low', 'medium', 'high'
 * @param month - 1-12
 * @returns efficiency multipliers per factory
 */
export function calculateFactoryEfficiencies(factories: Factory[], cityProduction: string, month: number): Float64Array {
  const n = factories.length;
  const eff = new Float64Array(n);

  const factoryCount = factories.filter(f => f.built).length;
  const regionalMult = cityProduction === 'low' ? 0.75 : cityProduction === 'high' ? 1.15 : 1.0;
  const agglomMult = factoryCount >= 9 ? 1.10 : factoryCount >= 6 ? 1.06 : factoryCount >= 3 ? 1.03 : 1.0;

  const isWinter = month === 12 || month === 1 || month === 2;

  for (let i = 0; i < n; i++) {
    const f = factories[i];
    if (!f.built || f.workers < 30) {
      eff[i] = 0;
      continue;
    }

    let seasonMult = 1.0;
    if (isWinter) {
      if (f.id === 'farm') seasonMult = 0.67;
      else if (['vineyard', 'hemp_farm', 'apiary'].includes(f.id)) seasonMult = 0.50;
    }

    const workerEff = f.workers / f.maxWorkers;
    eff[i] = workerEff * seasonMult * regionalMult * agglomMult;
  }

  return eff;
}

/**
 * Price elasticity batch — calculates all market prices in one pass.
 * @param market - market goods object
 * @param goodDefs - GOODS array with pMin, pMax, sMin, sMax
 * @returns prices per good
 */
export function batchPrices(market: MarketSubset, goodDefs: Good[]): Float64Array {
  const prices = new Float64Array(GOODS_COUNT);

  for (let g = 0; g < GOODS_COUNT; g++) {
    const def = goodDefs[g];
    const stock = market.goods[def.id]?.stock ?? 0;

    if (stock <= def.sMin) prices[g] = def.pMax;
    else if (stock >= def.sMax) prices[g] = def.pMin;
    else {
      prices[g] = def.pMax - ((stock - def.sMin) / (def.sMax - def.sMin)) * (def.pMax - def.pMin);
    }
  }

  return prices;
}
