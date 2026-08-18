
import { test, expect } from 'vitest';
import { GameEngine } from '../src/GameEngine';

test('Longevity Stress Test (50-year simulation)', async () => {
    console.log("Starting Longevity Stress Test...");
    const engine = new GameEngine();
    engine.newGame('StressTester', 'lubeck');
    
    const world = engine.server.world;
    const YEARS = 50;
    const DAYS_PER_YEAR = 360;
    const TOTAL_DAYS = YEARS * DAYS_PER_YEAR;

    const report = [];
    const startTime = Date.now();
    let lastTime = startTime;

    for (let day = 1; day <= TOTAL_DAYS; day++) {
        // Advance world
        world.advanceDay();
        
        // State for tick
        const state = engine.server.getState();
        
        // Process tick
        engine.processTick(state);

        if (day % DAYS_PER_YEAR === 0) {
            const now = Date.now();
            const year = day / DAYS_PER_YEAR;
            const elapsed = now - lastTime;
            lastTime = now;

            const cities = world.getAllCities();
            const totalPop = cities.reduce((s, c) => s + c.totalPopulation, 0);
            const totalPirates = engine.combatManager?.fleetAI.getTotalPirateShips() || 0;
            
            const avgPrices = {
                grain: cities.reduce((s, c) => s + c.market.getPrice('grain'), 0) / cities.length,
                beer: cities.reduce((s, c) => s + c.market.getPrice('beer'), 0) / cities.length,
                iron: cities.reduce((s, c) => s + c.market.getPrice('iron'), 0) / cities.length,
            };

            const avgStock = {
                grain: cities.reduce((s, c) => s + c.market.goods['grain']?.stock || 0, 0) / cities.length,
                beer: cities.reduce((s, c) => s + c.market.goods['beer']?.stock || 0, 0) / cities.length,
                iron: cities.reduce((s, c) => s + c.market.goods['iron']?.stock || 0, 0) / cities.length,
            };

            console.log(`Year ${year.toString().padStart(2)}: Pop=${Math.round(totalPop).toString().padStart(6)} Pirates=${totalPirates.toString().padStart(2)} GrainP=${avgPrices.grain.toFixed(1).padStart(5)} Time=${elapsed}ms`);
            
            report.push({
                year,
                totalPop,
                totalPirates,
                avgPrices,
                avgStock,
                tickTime: elapsed / DAYS_PER_YEAR
            });
        }
    }

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    
    console.log(`\nSimulation Finished in ${totalTime.toFixed(2)}s`);
    
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const saveData = engine.saveGame('longevity_final');
    const saveStr = JSON.stringify(saveData);
    const saveSizeKB = Buffer.byteLength(saveStr) / 1024;

    console.log(`Final Memory: ${memUsage.toFixed(2)} MB`);
    console.log(`Estimated Save Size: ${saveSizeKB.toFixed(2)} KB`);

    // Analysis
    const initialPop = report[0].totalPop;
    const finalPop = report[report.length - 1].totalPop;
    const popGrowth = (finalPop / initialPop - 1) * 100;

    const initialGrain = report[0].avgPrices.grain;
    const finalGrain = report[report.length - 1].avgPrices.grain;
    const grainDrift = (finalGrain / initialGrain - 1) * 100;

    console.log(`\n--- STABILITY REPORT ---`);
    console.log(`Population Growth: ${popGrowth.toFixed(2)}%`);
    console.log(`Grain Price Drift: ${grainDrift.toFixed(2)}%`);
    
    const priceStability = report.every(r => r.avgPrices.grain < 300 && r.avgPrices.grain > 10);
    console.log(`Economic Stability: ${priceStability ? 'STABLE' : 'UNSTABLE'}`);
    
    const pirateGrowth = report[report.length - 1].totalPirates - report[0].totalPirates;
    console.log(`Pirate Fleet Growth: ${pirateGrowth > 50 ? 'AGGRESSIVE' : 'STABLE'}`);
    
    const perfDegradation = (report[report.length - 1].tickTime / report[0].tickTime - 1) * 100;
    console.log(`Performance Degradation: ${perfDegradation.toFixed(2)}%`);

    expect(priceStability).toBe(true);
}, 600000); // 10 minutes timeout
