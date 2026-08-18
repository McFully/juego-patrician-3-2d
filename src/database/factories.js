export const FACTORIES = [
  { id: 'bakery', name: 'Panadería', built: false, workers: 0, maxWorkers: 100,
    inputs: [{ goodId: 'grain', amount: 1 }],
    outputs: [{ goodId: 'bread', amount: 20 }],
    minWorkers: 30 },
  { id: 'brewery', name: 'Cervecería', built: false, workers: 0, maxWorkers: 100,
    inputs: [{ goodId: 'grain', amount: 0.5 }, { goodId: 'timber', amount: 1.2 }],
    outputs: [{ goodId: 'beer', amount: 9 }],
    minWorkers: 30 },
  { id: 'butcher', name: 'Carnicería', built: false, workers: 0, maxWorkers: 80,
    inputs: [{ goodId: 'grain', amount: 1.5 }],
    outputs: [{ goodId: 'meat', amount: 2.5 }, { goodId: 'wool', amount: 1.5 }], // Carne + Lana en lugar de solo carne
    minWorkers: 30 },
  { id: 'weaver', name: 'Telar', built: false, workers: 0, maxWorkers: 80,
    inputs: [{ goodId: 'wool', amount: 2 }],
    outputs: [{ goodId: 'cloth', amount: 3 }],
    minWorkers: 30 },
  { id: 'carpenter', name: 'Carpintería', built: false, workers: 0, maxWorkers: 60,
    inputs: [{ goodId: 'timber', amount: 3 }],
    outputs: [{ goodId: 'tools', amount: 2 }],
    minWorkers: 30 },
  { id: 'smelter', name: 'Fundición', built: false, workers: 0, maxWorkers: 80,
    inputs: [{ goodId: 'iron', amount: 2 }, { goodId: 'timber', amount: 1 }],
    outputs: [{ goodId: 'tools', amount: 3 }],
    minWorkers: 30 },
  { id: 'sawmill', name: 'Aserradero', built: false, workers: 0, maxWorkers: 60,
    inputs: [],
    outputs: [{ goodId: 'timber', amount: 8 }],
    minWorkers: 30 },
  { id: 'farm', name: 'Granja de Grano', built: false, workers: 0, maxWorkers: 100,
    inputs: [],
    outputs: [{ goodId: 'grain', amount: 6 }],
    minWorkers: 30 },
  { id: 'vineyard', name: 'Viñedo', built: false, workers: 0, maxWorkers: 80,
    inputs: [],
    outputs: [{ goodId: 'wine', amount: 1.5 }],
    minWorkers: 30 },
  { id: 'sheep_farm', name: 'Granja Ovina', built: false, workers: 0, maxWorkers: 80,
    inputs: [],
    outputs: [{ goodId: 'wool', amount: 4 }],
    minWorkers: 30 },
  { id: 'hemp_farm', name: 'Plantación de Cáñamo', built: false, workers: 0, maxWorkers: 70,
    inputs: [],
    outputs: [{ goodId: 'hemp', amount: 4 }],
    minWorkers: 30 },
  { id: 'apiary', name: 'Colmenar', built: false, workers: 0, maxWorkers: 60,
    inputs: [],
    outputs: [{ goodId: 'honey', amount: 3 }, { goodId: 'wax', amount: 1 }],
    minWorkers: 30 },
  { id: 'brickworks', name: 'Ladrillera', built: false, workers: 0, maxWorkers: 100,
    inputs: [{ goodId: 'timber', amount: 3.5 }],
    outputs: [{ goodId: 'bricks', amount: 5 }],
    minWorkers: 30 },
  { id: 'saltworks', name: 'Salina', built: false, workers: 0, maxWorkers: 80,
    inputs: [{ goodId: 'timber', amount: 3.5 }],
    outputs: [{ goodId: 'salt', amount: 6 }],
    minWorkers: 30 },
  { id: 'tannery', name: 'Peletería', built: false, workers: 0, maxWorkers: 60,
    inputs: [{ goodId: 'salt', amount: 1 }],
    outputs: [{ goodId: 'ropes', amount: 2 }],
    minWorkers: 30 },
  { id: 'tarworks', name: 'Fábrica de Brea', built: false, workers: 0, maxWorkers: 60,
    inputs: [{ goodId: 'timber', amount: 0.7 }],
    outputs: [{ goodId: 'tar', amount: 1.2 }],
    minWorkers: 30 },
  { id: 'chandler', name: 'Candelero', built: false, workers: 0, maxWorkers: 50,
    inputs: [{ goodId: 'wax', amount: 2 }],
    outputs: [{ goodId: 'candles', amount: 5 }],
    minWorkers: 30 },
  { id: 'potter', name: 'Alfarero', built: false, workers: 0, maxWorkers: 60,
    inputs: [{ goodId: 'timber', amount: 1 }],
    outputs: [{ goodId: 'pottery', amount: 6 }],
    minWorkers: 30 },
  { id: 'whale_fishery', name: 'Pesquería de Ballenas', built: false, workers: 0, maxWorkers: 50,
    inputs: [{ goodId: 'salt', amount: 1 }, { goodId: 'hemp', amount: 0.5 }],
    outputs: [{ goodId: 'fish', amount: 2.5 }, { goodId: 'wine', amount: 0.5 }],
    minWorkers: 30 },
];
export const WINTER_MONTHS = new Set([12, 1, 2]);
export function getSeasonalOutput(factory, month) {
  if (!WINTER_MONTHS.has(month)) return 1.0;
  if (factory.id === 'farm') return 0.5;
  if (['vineyard', 'hemp_farm', 'apiary'].includes(factory.id)) return 0.5;
  return 1.0;
}
export function getRegionalMultiplier(cityProduction) {
  if (cityProduction === 'low') return 0.75;
  if (cityProduction === 'high') return 1.15;
  return 1.0;
}
export function getAgglomerationBonus(factoryCount) {
  if (factoryCount >= 9) return 1.10;
  if (factoryCount >= 6) return 1.06;
  if (factoryCount >= 3) return 1.03;
  return 1.0;
}
