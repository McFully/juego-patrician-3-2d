/**
 * AI Worker Thread
 * Offloads non-critical AI computations to a background thread.
 * Processes market evaluation for AI agents independently.
 * Using standard Web Workers for production compatibility.
 */

self.onmessage = function(event) {
  const msg = event.data;

  if (msg.type === 'evaluate') {
    const results = evaluateMarkets(msg.agents, msg.cities);
    self.postMessage({ type: 'results', data: results, jobId: msg.jobId });
  }

  if (msg.type === 'shutdown') {
    // In Web Workers, we don't necessarily need to exit, but we can stop processing.
    // self.close(); 
  }
};

function evaluateMarkets(agents, cities) {
  const results = [];
  if (!agents || !cities) return results;

  for (const agent of agents) {
    if (!agent || !agent.active) continue;
    const city = cities[agent.homeCityId];
    if (!city || !city.market) continue;

    const decisions = [];
    const goods = city.market.goods || {};

    for (const [goodId, entry] of Object.entries(goods)) {
      if (entry.stock <= 100) {
        decisions.push({ action: 'buy', goodId, priority: 'high' });
      }
      if (entry.stock >= 800) {
        decisions.push({ action: 'sell', goodId, priority: 'low' });
      }
    }

    results.push({
      agentId: agent.id,
      homeCityId: agent.homeCityId,
      decisions,
      timestamp: Date.now(),
    });
  }
  return results;
}
