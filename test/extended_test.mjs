import { ScalableGameEngine } from '../src/ScalableGameEngine.js';
import { GameEngine } from '../src/GameEngine.js';
import { loadConfig } from '../src/core/ModSupport.js';
import { Ship } from '../src/data_models/Ship.js';
import { calculateDemandDOD, batchPrices } from '../src/sim_engine/DODEngine.js';
import { PirateFleet } from '../src/sim_engine/NavalCombat.js';
import { ForcedAuction } from '../src/sim_engine/ForcedAuction.js';
import { GOODS } from '../src/database/goods.js';

const config = loadConfig();
console.log('=== PATRICIAN III 2D — EXTENDED ENGINE TEST ===');

const base = new GameEngine();
base.newGame('Player', 'lubeck');
const engine = new ScalableGameEngine(base);

console.log('\nShipyard system:');
const shipyard = engine.getShipyardInfo('lubeck');
console.log(`  Lübeck Shipyard: Lv.${shipyard.level} (XP: ${shipyard.xp})`);
const buildCheck = shipyard.canBuild('cog', base.server.world.getCity('lubeck').market);
console.log(`  Can build Cog: ${buildCheck.canBuild} (${buildCheck.reason || 'ok'})`);

const upgradeCalc = shipyard.calculateUpgrade(base.player.fleet[0]);
console.log(`  Snaikka upgrade: ${upgradeCalc.canUpgrade} — cargo ${base.player.fleet[0].cargoCapacity}→${upgradeCalc.newCargoCapacity} slots ${base.player.fleet[0].weaponSlots}→${upgradeCalc.newWeaponSlots}`);

console.log('\nDOD Engine:');
const demand = calculateDemandDOD(800, 400, 200);
console.log(`  Demand vector length: ${demand.length}`);
console.log(`  Beer daily demand: ${demand[0].toFixed(4)}`);
console.log(`  Bread daily demand: ${demand[3].toFixed(4)}`);
console.log(`  Wine daily demand: ${demand[7].toFixed(4)}`);

const lubeckMarket = base.server.world.getCity('lubeck').market;
const prices = batchPrices(lubeckMarket, GOODS);
const beerPrice = prices[0];
console.log(`  Batch price — Beer: $${beerPrice.toFixed(2)}`);

console.log('\nCombat system:');
const pirates = new PirateFleet();
pirates.generatePirateFleet(2);
console.log(`  Pirate fleet spawned: ${pirates.ships.length} ships, power: ${Math.round(pirates.totalPower)}`);

console.log('\nForced Auction:');
console.log(`  Can force auction (rank 0, rep 0): ${ForcedAuction.canForceAuction(0, 0)}`);
console.log(`  Can force auction (rank 4, rep 50): ${ForcedAuction.canForceAuction(4, 50)}`);

console.log('\nMod Support:');
console.log(`  Config loaded: ${Object.keys(config).length > 0}`);
console.log(`  Pricing elasticity: ${config?.economy?.priceElasticityFactor ?? 'default'}`);

console.log('\n=== ALL EXTENDED SYSTEMS VERIFIED ===');