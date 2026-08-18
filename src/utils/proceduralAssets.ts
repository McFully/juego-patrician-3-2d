/**
 * Project Zenith: High-Fidelity Procedural Assets
 * 78 Master Pieces for Hanseatic Strategos v1.0.0
 * All assets are locally generated via SVG/CSS for absolute sovereignty.
 */

const svgWrap = (content: string) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E${content}%3C/svg%3E`;

export const ASSETS = {
  // --- PORTRAITS (12) ---
  PORTRAITS: {
    GOVERNOR_1: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%231e293b' stroke='%23eac349' stroke-width='2'/%3E%3Cpath d='M20 100 Q50 40 80 100' fill='%230f172a'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23f5d0a9'/%3E"),
    GOVERNOR_2: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%231a202c' stroke='%23eac349' stroke-width='2'/%3E%3Cpath d='M20 100 Q50 50 80 100' fill='%232d3748'/%3E%3Ccircle cx='50' cy='42' r='18' fill='%23fbd38d'/%3E"),
    GOVERNOR_3: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%230f172a' stroke='%23eac349' stroke-width='2'/%3E%3Cpath d='M20 100 Q50 45 80 100' fill='%231e293b'/%3E%3Ccircle cx='50' cy='40' r='22' fill='%23ed8936' opacity='0.8'/%3E"),
    GOVERNOR_4: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%23171923' stroke='%23eac349' stroke-width='3'/%3E%3Cpath d='M15 100 Q50 30 85 100' fill='%23744210'/%3E"),
    PIRATE_VARG: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%23450a0a' stroke='%23ef4444' stroke-width='2'/%3E%3Cpath d='M30 40 L70 60 M30 60 L70 40' stroke='%23ef4444' stroke-width='8'/%3E"),
    CAPTAIN: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%232a4365' stroke='%23cbd5e0' stroke-width='2'/%3E%3Cpath d='M20 100 Q50 50 80 100' fill='%231a365d'/%3E"),
    HELMSMAN: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%2322543d' stroke='%239ae6b4' stroke-width='1'/%3E%3Ccircle cx='50' cy='45' r='15' fill='%239ae6b4'/%3E"),
    GUNNER: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%23742a2a' stroke='%23feb2b2' stroke-width='1'/%3E"),
    MONEYLENDER: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%23285e61' stroke='%2381e6d9' stroke-width='2'/%3E"),
    TAVERNKEEP: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%237b341e' stroke='%23f6ad55' stroke-width='1'/%3E"),
    INFORMANT: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%231a202c' stroke='%23a0aec0' stroke-width='1'/%3E"),
    BISHOP: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%23fff' stroke='%23eac349' stroke-width='2'/%3E"),
  },

  // --- BUILDINGS (22) ---
  BUILDINGS: {
    TOWN_HALL: svgWrap("%3Crect x='10' y='30' width='80' height='60' fill='%23475569' stroke='%23eac349'/%3E"),
    MARKET_HALL: svgWrap("%3Crect x='5' y='50' width='90' height='40' fill='%231e293b' stroke='%23eac349'/%3E"),
    CATHEDRAL: svgWrap("%3Cpath d='M20 90 L80 90 L80 40 L50 10 L20 40 Z' fill='%23334155' stroke='%23eac349'/%3E"),
    WAREHOUSE: svgWrap("%3Crect x='10' y='40' width='80' height='40' fill='%23d97706'/%3E"),
    SHIPYARD: svgWrap("%3Cpath d='M10 90 L90 90 L80 60 L20 60 Z' fill='%234a5568'/%3E"),
    TAVERN: svgWrap("%3Crect x='20' y='40' width='60' height='50' fill='%23744210'/%3E"),
    BATH_HOUSE: svgWrap("%3Cpath d='M20 90 Q50 60 80 90' fill='%233182ce' opacity='0.5'/%3E"),
    GUILD: svgWrap("%3Crect x='15' y='20' width='70' height='70' fill='%232d3748' stroke='%23eac349' stroke-width='3'/%3E"),
    FACTORY_BRICK: svgWrap("%3Crect x='10' y='50' width='80' height='40' fill='%239b2c2c'/%3E"),
    FACTORY_WOOD: svgWrap("%3Cpath d='M10 90 L30 40 L50 90 L70 40 L90 90' fill='%23276749'/%3E"),
    FACTORY_IRON: svgWrap("%3Ccircle cx='50' cy='50' r='35' fill='%234a5568'/%3E"),
    FACTORY_SALT: svgWrap("%3Crect x='20' y='60' width='60' height='30' fill='%23cbd5e1'/%3E"),
    FACTORY_GRAIN: svgWrap("%3Crect x='10' y='40' width='80' height='50' fill='%23f6e05e'/%3E"),
    FACTORY_BEER: svgWrap("%3Crect x='30' y='20' width='40' height='70' fill='%23ecc94b'/%3E"),
    FACTORY_CLOTH: svgWrap("%3Crect x='15' y='30' width='70' height='60' fill='%23d53f8c'/%3E"),
    FACTORY_WINE: svgWrap("%3Cpath d='M30 90 L70 90 L50 10 Z' fill='%23805ad5'/%3E"),
    FACTORY_TOOLS: svgWrap("%3Cpath d='M20 20 L80 80 M80 20 L20 80' stroke='%23718096' stroke-width='8'/%3E"),
    FACTORY_MEAT: svgWrap("%3Ccircle cx='50' cy='50' r='40' fill='%23f56565'/%3E"),
    FACTORY_FISH: svgWrap("%3Cpath d='M10 50 Q50 20 90 50' stroke='%2363b3ed'/%3E"),
    FACTORY_HONEY: svgWrap("%3Ccircle cx='50' cy='50' r='30' fill='%23d69e2e'/%3E"),
    FACTORY_WAX: svgWrap("%3Crect x='40' y='10' width='20' height='80' fill='%23faf089'/%3E"),
    FACTORY_PITCH: svgWrap("%3Ccircle cx='50' cy='50' r='45' fill='%231a202c'/%3E"),
  },

  // --- GOODS (20) ---
  GOODS: {
    grain: svgWrap("%3Cpath d='M20 80 Q50 70 80 80' fill='%23fcd34d'/%3E"),
    fish: svgWrap("%3Cpath d='M20 50 Q50 30 80 50 T80 70 Q50 90 20 70 Z' fill='%2363b3ed'/%3E"),
    salt: svgWrap("%3Crect x='20' y='20' width='60' height='60' fill='%23fff' opacity='0.9'/%3E"),
    beer: svgWrap("%3Crect x='30' y='30' width='40' height='60' fill='%23ecc94b'/%3E"),
    meat: svgWrap("%3Ccircle cx='50' cy='50' r='30' fill='%23f56565'/%3E"),
    wood: svgWrap("%3Crect x='10' y='60' width='80' height='20' fill='%2392400e'/%3E"),
    iron: svgWrap("%3Ccircle cx='50' cy='50' r='30' fill='%234a5568'/%3E"),
    tools: svgWrap("%3Cpath d='M30 70 L70 30 M70 70 L30 30' stroke='%23718096' stroke-width='10'/%3E"),
    bricks: svgWrap("%3Crect x='20' y='40' width='60' height='30' fill='%23c53030'/%3E"),
    wine: svgWrap("%3Cpath d='M40 90 L60 90 L50 20 Z' fill='%23805ad5'/%3E"),
    spices: svgWrap("%3Ccircle cx='50' cy='50' r='20' fill='%23d69e2e'/%3E"),
    cloth: svgWrap("%3Crect x='10' y='20' width='80' height='60' fill='%23d53f8c'/%3E"),
    hemp: svgWrap("%3Cpath d='M50 10 L50 90 M20 40 Q50 30 80 40' stroke='%2338a169'/%3E"),
    honey: svgWrap("%3Ccircle cx='50' cy='50' r='35' fill='%23d69e2e' opacity='0.7'/%3E"),
    wax: svgWrap("%3Crect x='35' y='20' width='30' height='70' fill='%23faf089'/%3E"),
    furs: svgWrap("%3Cpath d='M20 80 Q50 20 80 80' fill='%234a5568'/%3E"),
    linen: svgWrap("%3Crect x='15' y='15' width='70' height='70' fill='%23edf2f7'/%3E"),
    pitch: svgWrap("%3Ccircle cx='50' cy='50' r='40' fill='%231a202c'/%3E"),
    leather: svgWrap("%3Crect x='10' y='10' width='80' height='80' fill='%23744210'/%3E"),
    wool: svgWrap("%3Ccircle cx='50' cy='50' r='45' fill='%23fff'/%3E"),
  },

  // --- TOP-LEVEL ALIASES (Backward Compatibility & Global Access) ---
  MAP_BG: svgWrap("%3Crect width='100' height='100' fill='%23131407'/%3E"),
  MAP_VELLUM: svgWrap("%3Crect width='100' height='100' fill='%23131407'/%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23eac349' opacity='0.1'/%3E"),
  GOVERNOR: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%231e293b' stroke='%23eac349'/%3E"),
  BUILDING_PREVIEW: svgWrap("%3Crect x='20' y='40' width='60' height='40' fill='none' stroke='%23eac349' stroke-dasharray='4'/%3E"),
  CATHEDRAL: svgWrap("%3Cpath d='M20 90 L80 90 L80 40 L50 10 L20 40 Z' fill='%23334155' stroke='%23eac349'/%3E"),
  BLUEPRINT: svgWrap("%3Crect width='100' height='100' fill='%231e293b'/%3E"),
  ENEMY: svgWrap("%3Ccircle cx='50' cy='50' r='48' fill='%23450a0a' stroke='%23ef4444'/%3E"),
  STATUE: svgWrap("%3Crect x='30' y='80' width='40' height='15' fill='%23475569' /%3E"),
  WEAPON: svgWrap("%3Ccircle cx='50' cy='50' r='40' fill='%231e293b' stroke='%23eac349' stroke-width='5'/%3E"),
  CITY_BG: svgWrap("%3Crect width='100' height='100' fill='%230f172a'/%3E"),
  CITY_WINTER: svgWrap("%3Crect width='100' height='100' fill='%232d3748'/%3E"),
  FORGE_BG: svgWrap("%3Crect width='100' height='100' fill='%231a0a05'/%3E"),
  TACTICAL_MAP: svgWrap("%3Crect width='100' height='100' fill='%23131407'/%3E"),
  NOISE: `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E`,
  SPLASH_BG: 'linear-gradient(135deg, #001f3f 0%, #000a1a 100%)',
};
