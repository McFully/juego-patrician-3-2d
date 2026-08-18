/**
 * Balance Verification — mathematical accuracy vs Patrician III original data.
 * Validates: pricing function P(S), marginal buy/sell totals,
 * production ratios, consumption rates, ship parameters.
 */

import { pricePerUnit, totalBuyCost, totalSellRevenue, Market } from '../src/sim_engine/Market.js';
import { GOODS } from '../src/database/goods.js';
import { FACTORIES, getSeasonalOutput, getRegionalMultiplier, getAgglomerationBonus, WINTER_MONTHS } from '../src/database/factories.js';
import { calculateDemand, CONSUMPTION_RATES } from '../src/database/consumption.js';
import { calculateDemandDOD, batchPrices } from '../src/sim_engine/DODEngine.js';
import DATA from '../src/database/index.js';

console.log('=== PATRICIAN III 2D — BALANCE VERIFICATION ===\n');

function verify(condition, label) {
  if (condition) {
    console.log(`  [PASS] ${label}`);
  } else {
    console.log(`  [FAIL] ${label}`);
  }
  return condition;
}

// ============================================================
// 1. Pricing Function P(S) — exact mathematical verification
// ============================================================
console.log('1. Pricing function P(S):');
const grain = GOODS.find(g => g.id === 'grain');
verify(typeof grain !== 'undefined', 'Grain good definition exists');

// At sMin, price = pMax
const priceAtMin = pricePerUnit(grain, grain.sMin);
verify(Math.abs(priceAtMin - grain.pMax) < 0.001, `P(Smin) = Pmax → ${priceAtMin.toFixed(2)} = ${grain.pMax}`);

// At sMax, price = pMin
const priceAtMax = pricePerUnit(grain, grain.sMax);
verify(Math.abs(priceAtMax - grain.pMin) < 0.001, `P(Smax) = Pmin → ${priceAtMax.toFixed(2)} = ${grain.pMin}`);

// At midpoint, price = (pMax + pMin) / 2
const sMid = (grain.sMin + grain.sMax) / 2;
const priceMid = pricePerUnit(grain, sMid);
const expectedMid = grain.pMax - ((sMid - grain.sMin) / (grain.sMax - grain.sMin)) * (grain.pMax - grain.pMin);
verify(Math.abs(priceMid - expectedMid) < 0.001, `P(Smid) linear → ${priceMid.toFixed(2)} = ${expectedMid.toFixed(2)}`);

// Below sMin, price clamped to pMax
const priceBelow = pricePerUnit(grain, grain.sMin - 10);
verify(Math.abs(priceBelow - grain.pMax) < 0.001, `P(S < Smin) = Pmax → ${priceBelow.toFixed(2)}`);

// Above sMax, price clamped to pMin
const priceAbove = pricePerUnit(grain, grain.sMax + 10);
verify(Math.abs(priceAbove - grain.pMin) < 0.001, `P(S > Smax) = Pmin → ${priceAbove.toFixed(2)}`);

// ============================================================
// 2. Marginal Pricing — buy/sell edge cases
// ============================================================
console.log('\n2. Marginal pricing:');
const beer = GOODS.find(g => g.id === 'beer');
const mkt = new Market();

// Single unit buy
const buy1 = totalBuyCost(beer, beer.sMin, 1);
verify(Math.abs(buy1.total - beer.pMax) < 0.001, `Buy 1 unit at Smin → cost = Pmax = ${beer.pMax} (got ${buy1.total.toFixed(2)})`);

// Single unit sell at stock = sMax
const sell1 = totalSellRevenue(beer, beer.sMax, 1);
verify(Math.abs(sell1.total - beer.pMin) < 0.001, `Sell 1 unit at Smax → revenue = Pmin = ${beer.pMin} (got ${sell1.total.toFixed(2)})`);

// Bulk buy: sum of marginal prices differs from linear (each unit changes price)
const buyBulk = totalBuyCost(beer, beer.sMin + 100, 20);
const priceAtStart = pricePerUnit(beer, beer.sMin + 100);
const naiveCost = priceAtStart * 20;
// Buying reduces stock → price rises, so marginal bulk > linear
verify(Math.abs(buyBulk.total - naiveCost) > 1.0, `Marginal bulk != linear cost (${buyBulk.total.toFixed(2)} vs ${naiveCost.toFixed(2)})`);

// Symmetry: buy then sell back same qty returns to original stock
const initStock = 400;
const qty = 5;
const buyResult = totalBuyCost(beer, initStock, qty);
const sellResult = totalSellRevenue(beer, buyResult.endStock, qty);
verify(Math.abs(sellResult.endStock - initStock) < 0.001, `Buy+Sell symmetry → stock returns to ${initStock} (got ${sellResult.endStock})`);

// ============================================================
// 3. All 20 goods have valid price ranges
// ============================================================
console.log('\n3. Goods database integrity:');
let goodsOk = 0;
for (const g of GOODS) {
  const valid = g.pMin < g.pMax && g.sMin < g.sMax && g.baseCost > 0 && g.volumeUnits > 0;
  if (valid) goodsOk++;
  verify(valid, `${g.name}: pMin=${g.pMin} < pMax=${g.pMax}, sMin=${g.sMin} < sMax=${g.sMax}, volume=${g.volumeUnits}`);
}
verify(goodsOk === 20, `All 20 goods valid (${goodsOk}/20)`);

// ============================================================
// 4. Consumption rates per 1000 population
// ============================================================
console.log('\n4. Consumption rates:');
const demand1k = calculateDemand(1000, 0, 0);
verify(demand1k.bread > 0, '1000 poor consume bread');
verify(demand1k.beer > 0, '1000 poor consume beer');
verify(demand1k.wine === undefined || demand1k.wine === 0, '1000 poor do NOT consume wine');

const demandRich = calculateDemand(0, 0, 1000);
verify(demandRich.wine > 0, '1000 rich consume wine');
verify(demandRich.cloth > 0, '1000 rich consume cloth');
verify(demandRich.candles > 0, '1000 rich consume candles');

// DOD vs object equivalence (daily vs daily)
const dodDemand = calculateDemandDOD(500, 300, 200);
const objDemand = calculateDemand(500, 300, 200);
const dodBeerDaily = dodDemand[0];
const objBeerDaily = (objDemand.beer || 0) / 7; // convert weekly→daily
verify(Math.abs(dodBeerDaily - objBeerDaily) < 0.01, `DOD == Object demand (daily): beer ${dodBeerDaily.toFixed(4)} vs ${objBeerDaily.toFixed(4)}`);

// ============================================================
// 5. Factory production ratios
// ============================================================
console.log('\n5. Factory production:');
const bakery = FACTORIES.find(f => f.id === 'bakery');
verify(bakery.inputs[0].goodId === 'grain', `Bakery input: grain`);
verify(bakery.outputs[0].goodId === 'bread', `Bakery output: bread`);
verify(bakery.outputs[0].amount / bakery.inputs[0].amount >= 3, `Bakery ratio: ${bakery.outputs[0].amount / bakery.inputs[0].amount}x grain→bread`);

const brewery = FACTORIES.find(f => f.id === 'brewery');
verify(brewery.inputs.length === 2, `Brewery has 2 inputs`);
verify(brewery.outputs[0].goodId === 'beer', `Brewery output: beer`);

// Whale fishery double-precision verification (Section I detail)
const whaler = FACTORIES.find(f => f.id === 'whale_fishery');
verify(whaler !== undefined, 'Whale Fishery exists');
verify(Math.abs(whaler.inputs[0].amount - 13.068) < 0.001, `Whale salt consumption: 13.068 (got ${whaler.inputs[0].amount})`);
verify(Math.abs(whaler.inputs[1].amount - 0.603) < 0.001, `Whale hemp consumption: 0.603 (got ${whaler.inputs[1].amount})`);

// ============================================================
// 6. Seasonal production modifiers
// ============================================================
console.log('\n6. Seasonal modifiers:');
verify(getSeasonalOutput(FACTORIES[0], 1) === 1.0, 'Bakery unaffected by winter');
verify(Math.abs(getSeasonalOutput(FACTORIES.find(f => f.id === 'farm'), 1) - 0.67) < 0.01, 'Farm winter penalty → 0.67');
verify(Math.abs(getSeasonalOutput(FACTORIES.find(f => f.id === 'vineyard'), 1) - 0.50) < 0.01, 'Vineyard winter penalty → 0.50');
verify(Math.abs(getSeasonalOutput(FACTORIES.find(f => f.id === 'hemp_farm'), 1) - 0.50) < 0.01, 'Hemp farm winter penalty → 0.50');
verify(getSeasonalOutput(FACTORIES.find(f => f.id === 'farm'), 6) === 1.0, 'Farm summer → 1.0');

// ============================================================
// 7. Regional & agglomeration modifiers
// ============================================================
console.log('\n7. Regional & agglomeration:');
verify(getRegionalMultiplier('low') === 0.75, 'Low production → 0.75');
verify(getRegionalMultiplier('high') === 1.15, 'High production → 1.15');
verify(getRegionalMultiplier('medium') === 1.0, 'Medium production → 1.0');
verify(getAgglomerationBonus(1) === 1.0, '1 factory → 1.0');
verify(getAgglomerationBonus(4) === 1.03, '4 factories → 1.03');
verify(getAgglomerationBonus(7) === 1.06, '7 factories → 1.06');
verify(getAgglomerationBonus(10) === 1.10, '10 factories → 1.10');

// ============================================================
// 8. Ship parameters
// ============================================================
console.log('\n8. Ship data:');
for (const ship of DATA.SHIPS) {
  verify(ship.cargo > 0 && ship.crewMax > 0 && ship.speed > 0 && ship.hpMax > 0,
    `${ship.name}: cargo=${ship.cargo} crew=${ship.crewMax} speed=${ship.speed} hp=${ship.hpMax}`);
}
verify(DATA.SHIPS[0].id === 'snaikka' && DATA.SHIPS[0].draft === 'shallow', 'Snaikka shallow draft');
verify(DATA.SHIPS[2].id === 'cog' && DATA.SHIPS[2].draft === 'deep', 'Cog deep draft');

// ============================================================
// 9. Political ranks
// ============================================================
console.log('\n9. Political ranks:');
verify(DATA.RANKS.length === 8, `8 ranks (got ${DATA.RANKS.length})`);
verify(DATA.RANKS[0] === 'Shopkeeper', 'Rank 0: Shopkeeper');
verify(DATA.RANKS[3] === 'Itinerant Merchant', 'Rank 3: Itinerant Merchant');
verify(DATA.RANKS[6] === 'Lord Mayor', 'Rank 6: Lord Mayor');
verify(DATA.RANKS[7] === 'Alderman', 'Rank 7: Alderman');
verify(DATA.RANK_REQUIREMENTS[7].gold === 1000000, 'Alderman requires 1M gold');

// ============================================================
// 10. Cities — shallow draft verification
// ============================================================
console.log('\n10. City data:');
verify(DATA.CITIES.length === 24, `24 cities (got ${DATA.CITIES.length})`);
const SHALLOW = DATA.CITIES.filter(c => c.draft === 'shallow');
verify(SHALLOW.length === 4, '4 shallow draft cities');
const shallowIds = SHALLOW.map(c => c.id);
verify(shallowIds.includes('koln'), 'Köln shallow');
verify(shallowIds.includes('torun'), 'Toruń shallow');
verify(shallowIds.includes('ladoga'), 'Ladoga shallow');
verify(shallowIds.includes('novgorod'), 'Novgorod shallow');

// ============================================================
// 11. Batch pricing consistency
// ============================================================
console.log('\n11. Batch pricing:');
const testMarket = new Market();
const batchP = batchPrices(testMarket, GOODS);
verify(batchP.length === GOODS.length, `Batch prices length = ${GOODS.length}`);
for (let i = 0; i < GOODS.length; i++) {
  const single = pricePerUnit(GOODS[i], testMarket.goods[GOODS[i].id].stock);
  verify(Math.abs(batchP[i] - single) < 0.01, `${GOODS[i].name}: batch=${batchP[i].toFixed(2)} == single=${single.toFixed(2)}`);
}

// ============================================================
// 12. Elasticity — buy depletes stock, sell replenishes
// ============================================================
console.log('\n12. Market elasticity:');
const bread = GOODS.find(g => g.id === 'bread');
let stockE = bread.sMin + 50;
const buyE = totalBuyCost(bread, stockE, 10);
verify(buyE.endStock < stockE, `Buy reduces stock (${stockE} → ${buyE.endStock})`);
verify(buyE.total > 0, 'Buy cost > 0');
const sellE = totalSellRevenue(bread, buyE.endStock, 10);
verify(sellE.endStock > buyE.endStock, `Sell increases stock (${buyE.endStock} → ${sellE.endStock})`);
verify(sellE.total > 0, 'Sell revenue > 0');
// Should be approximately symmetric (market friction)
const buyThenSell = buyE.total - sellE.total;
verify(Math.abs(buyThenSell) < buyE.total * 0.3, `Buy-sell friction reasonable (loss: ${buyThenSell.toFixed(2)})`);

console.log('\n=== BALANCE VERIFICATION COMPLETE ===');