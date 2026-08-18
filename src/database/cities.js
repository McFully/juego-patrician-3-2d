export const CITIES = [
  { id: 'lubeck', name: 'Lübeck', x: 600, y: 350, draft: 'deep', production: 'high', popPoor: 800, popMiddle: 400, popRich: 200, popBeggar: 100 },
  { id: 'hamburg', name: 'Hamburg', x: 550, y: 380, draft: 'deep', production: 'high', popPoor: 700, popMiddle: 350, popRich: 180, popBeggar: 90 },
  { id: 'bremen', name: 'Bremen', x: 520, y: 410, draft: 'deep', production: 'medium', popPoor: 600, popMiddle: 300, popRich: 150, popBeggar: 80 },
  { id: 'rostock', name: 'Rostock', x: 630, y: 360, draft: 'deep', production: 'medium', popPoor: 500, popMiddle: 250, popRich: 120, popBeggar: 70 },
  { id: 'stralsund', name: 'Stralsund', x: 660, y: 370, draft: 'deep', production: 'medium', popPoor: 450, popMiddle: 220, popRich: 100, popBeggar: 65 },
  { id: 'gdansk', name: 'Gdańsk', x: 720, y: 380, draft: 'deep', production: 'high', popPoor: 750, popMiddle: 380, popRich: 180, popBeggar: 95 },
  { id: 'visby', name: 'Visby', x: 700, y: 320, draft: 'deep', production: 'medium', popPoor: 400, popMiddle: 200, popRich: 100, popBeggar: 50 },
  { id: 'riga', name: 'Riga', x: 780, y: 340, draft: 'deep', production: 'medium', popPoor: 500, popMiddle: 250, popRich: 120, popBeggar: 70 },
  { id: 'reval', name: 'Reval', x: 800, y: 330, draft: 'deep', production: 'low', popPoor: 350, popMiddle: 170, popRich: 80, popBeggar: 50 },
  { id: 'novgorod', name: 'Novgorod', x: 850, y: 310, draft: 'shallow', production: 'high', popPoor: 900, popMiddle: 450, popRich: 220, popBeggar: 120 },
  { id: 'ladoga', name: 'Ladoga', x: 850, y: 290, draft: 'shallow', production: 'low', popPoor: 300, popMiddle: 150, popRich: 70, popBeggar: 40 },
  { id: 'bergen', name: 'Bergen', x: 480, y: 280, draft: 'deep', production: 'high', popPoor: 600, popMiddle: 300, popRich: 150, popBeggar: 80 },
  { id: 'oslo', name: 'Oslo', x: 500, y: 300, draft: 'deep', production: 'medium', popPoor: 400, popMiddle: 200, popRich: 100, popBeggar: 55 },
  { id: 'torsberg', name: 'Tønsberg', x: 520, y: 310, draft: 'deep', production: 'low', popPoor: 250, popMiddle: 120, popRich: 60, popBeggar: 35 },
  { id: 'kopenhagen', name: 'Kopenhagen', x: 620, y: 400, draft: 'deep', production: 'medium', popPoor: 550, popMiddle: 270, popRich: 130, popBeggar: 75 },
  { id: 'malmo', name: 'Malmö', x: 650, y: 400, draft: 'deep', production: 'low', popPoor: 350, popMiddle: 170, popRich: 80, popBeggar: 45 },
  { id: 'stettin', name: 'Stettin', x: 690, y: 390, draft: 'deep', production: 'medium', popPoor: 450, popMiddle: 220, popRich: 110, popBeggar: 60 },
  { id: 'torun', name: 'Toruń', x: 740, y: 400, draft: 'shallow', production: 'medium', popPoor: 400, popMiddle: 200, popRich: 100, popBeggar: 55 },
  { id: 'elbing', name: 'Elbing', x: 750, y: 390, draft: 'deep', production: 'medium', popPoor: 350, popMiddle: 170, popRich: 80, popBeggar: 45 },
  { id: 'koln', name: 'Köln', x: 480, y: 460, draft: 'shallow', production: 'high', popPoor: 850, popMiddle: 420, popRich: 200, popBeggar: 110 },
  { id: 'magdeburg', name: 'Magdeburg', x: 550, y: 440, draft: 'deep', production: 'medium', popPoor: 500, popMiddle: 250, popRich: 120, popBeggar: 65 },
  { id: 'bristol', name: 'Bristol', x: 350, y: 450, draft: 'deep', production: 'medium', popPoor: 500, popMiddle: 250, popRich: 120, popBeggar: 70 },
  { id: 'london', name: 'London', x: 380, y: 440, draft: 'deep', production: 'high', popPoor: 800, popMiddle: 400, popRich: 200, popBeggar: 100 },
  { id: 'bruges', name: 'Bruges', x: 430, y: 470, draft: 'deep', production: 'high', popPoor: 700, popMiddle: 350, popRich: 180, popBeggar: 90 },
];

export const SHALLOW_CITIES = new Set(['koln', 'torun', 'ladoga', 'novgorod']);

export function isShallowCity(cityId) {
  return SHALLOW_CITIES.has(cityId);
}