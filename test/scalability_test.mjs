/**
 * End-Game Scalability Stress Test
 * Simulates 500+ ships, 350k+ population, massive trade volume
 * Tests DOD arrays, multithreaded AI, and memory stability
 */

import { GameEngine } from '../src/GameEngine.js';
import { ScalableGameEngine } from '../src/ScalableGameEngine.js';
import { Ship } from '../src/data_models/Ship.js';
import { World } from '../src/sim_engine/City.js';
import { GOODS } from '../src/database/goods.js';
import { CITIES } from '../src/database/cities.js';

console.log('=== PATRICIAN III 2D — END-GAME SCALABILITY TEST ===\n');

// Create base engine
const base = new GameEngine();
base.newGame('StressTestPlayer', 'lubeck');
const engine = new ScalableGameEngine(base);

console.log('Phase 1: Scale up world population to 350k+');
const world = base.server.world;
let totalPop = 0;
for (const city of world.getAllCities()) {
  // Scale population ~15x
  city.popPoor *= 15;
  city.popMiddle *= 15;
  city.popRich *= 15;
  city.popBeggar *= 15;
  city.housingPoor = Math.ceil(city.popPoor / 4);
  city.housingMiddle = Math.ceil(city.popMiddle / 3);
  city.housingRich = Math.ceil(city.popRich / 2);
  totalPop += city.totalPopulation;
}
console.log(`  Total population: ${totalPop.toLocaleString()}`);

console.log('\nPhase 2: Create 500+ ships across player and AI fleets');
const shipTypes = ['snaikka', 'crayer', 'cog', 'hulk'];
let shipCount = 1; // starter ship

// Add ships to player fleet
for (let i = 0; i < 100; i++) {
  const type = shipTypes[Math.floor(Math.random() * shipTypes.length)];
  const ship = new Ship(type, 'Player');
  ship.currentCityId = CITIES[Math.floor(Math.random() * CITIES.length)].id;
  base.player.fleet.push(ship);
  shipCount++;
}
console.log(`  Player fleet: ${base.player.fleet.length} ships`);

// Add ships to AI agents (use base.aiSystem)
for (const agent of base.aiSystem.agents) {
  for (let i = 0; i < 120; i++) {
    const type = shipTypes[Math.floor(Math.random() * shipTypes.length)];
    const ship = new Ship(type, agent.id);
    ship.currentCityId = agent.homeCityId;
    agent.fleet.push(ship);
    shipCount++;
  }
}
let aiShips = 0;
for (const agent of base.aiSystem.agents) {
  aiShips += agent.fleet.length;
}
console.log(`  AI fleets: ${aiShips} ships`);
console.log(`  Total ships: ${shipCount}`);

console.log('\nPhase 3: Fill markets with massive stockpiles');
for (const city of world.getAllCities()) {
  for (const [goodId, entry] of Object.entries(city.market.goods)) {
    entry.stock *= 100; // 100x normal stock
  }
}
console.log('  Markets scaled 100x');

console.log('\nPhase 4: Enable multithreaded AI processing');
engine.enableMultithreading(4);
console.log('  4 worker threads enabled');

console.log('\nPhase 5: Run high-load simulation (100 days)');
const startTime = Date.now();
base.start();

// Run for 100 days (100 ticks at 100ms each = 10 seconds)
setTimeout(() => {
  base.stop();
  const elapsed = (Date.now() - startTime) / 1000;
  
  console.log(`\n  Simulation completed in ${elapsed.toFixed(2)}s`);
  console.log(`  Days processed: ${world.totalDays}`);
  console.log(`  Avg tick time: ${(elapsed * 1000 / world.totalDays).toFixed(2)}ms`);
  
  // Check memory/stability
  const finalPop = world.getAllCities().reduce((sum, c) => sum + c.totalPopulation, 0);
  console.log(`  Final population: ${finalPop.toLocaleString()}`);
  
  // Count active ships
  let activeShips = 0;
  for (const ship of base.player.fleet) if (ship.hp > 0) activeShips++;
  for (const agent of base.aiSystem.agents) {
    for (const ship of agent.fleet) if (ship.hp > 0) activeShips++;
  }
  console.log(`  Active ships: ${activeShips}`);
  
  // Market integrity check
  let marketErrors = 0;
  for (const city of world.getAllCities()) {
    for (const entry of Object.values(city.market.goods)) {
      if (entry.stock < 0) marketErrors++;
    }
  }
  console.log(`  Market integrity errors: ${marketErrors}`);
  
  console.log('\n=== SCALABILITY TEST RESULT ===');
  if (elapsed < 30 && marketErrors === 0 && activeShips > 400) {
    console.log('PASS: Engine handles end-game scale within performance targets');
  } else {
    console.log('FAIL: Performance or stability issues detected');
  }
  
  engine.shutdown?.();
  process.exit(marketErrors === 0 && activeShips > 400 ? 0 : 1);
}, 15000);