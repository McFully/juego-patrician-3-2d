import { create } from 'zustand'
import { GameState, Player, City, Convoy, TradeRoute } from './types'

const defaultPlayer: Player = {
  name: 'Erik von Handel',
  title: 'Governor',
  gold: 12450,
  reputation: 72,
  fleetSize: 4,
  tradeRoutes: 3,
  citiesUnlocked: 6,
  date: 'October 15, 1452',
  season: 'autumn',
}

const defaultCities: City[] = [
  {
    id: 'lubeck',
    name: 'Lübeck',
    population: 2480,
    stability: 84,
    hasWarehouse: true,
    warehouseLevel: 2,
    resources: [
      { id: 'fish', name: 'Fish', icon: 'set_meal', production: 12.4, demand: 8.2, price: 4, inventory: 240 },
      { id: 'wood', name: 'Wood', icon: 'forest', production: 5.2, demand: 11.8, price: 6, inventory: 120 },
      { id: 'grain', name: 'Grain', icon: 'grain', production: 8.9, demand: 6.5, price: 3, inventory: 340 },
      { id: 'cloth', name: 'Cloth', icon: 'checkroom', production: -2.1, demand: 7.2, price: 14, inventory: 60 },
    ],
    buildings: [
      { id: 'warehouse', name: 'Warehouse', type: 'storage', level: 2, icon: 'inventory' },
      { id: 'mill', name: 'Grain Mill', type: 'production', level: 1, icon: 'mill', production: 8.9 },
    ],
  },
  {
    id: 'visby',
    name: 'Visby',
    population: 1840,
    stability: 76,
    hasWarehouse: true,
    warehouseLevel: 1,
    resources: [
      { id: 'salt', name: 'Fine Salt', icon: 'grain', production: 15.6, demand: 4.2, price: 12, inventory: 560 },
      { id: 'wood', name: 'Hardwood', icon: 'forest', production: 8.1, demand: 5.5, price: 8, inventory: 340 },
      { id: 'iron', name: 'Iron Ore', icon: 'hardware', production: 6.3, demand: 9.8, price: 18, inventory: 180 },
    ],
    buildings: [
      { id: 'warehouse', name: 'Warehouse', type: 'storage', level: 1, icon: 'inventory' },
      { id: 'forge', name: 'Iron Forge', type: 'production', level: 2, icon: 'forge', production: 6.3 },
    ],
  },
  {
    id: 'riga',
    name: 'Riga',
    population: 1620,
    stability: 68,
    hasWarehouse: false,
    warehouseLevel: 0,
    resources: [
      { id: 'wax', name: 'Beeswax', icon: 'candle', production: 9.8, demand: 3.6, price: 22, inventory: 290 },
      { id: 'fur', name: 'Fur', icon: 'pets', production: 7.4, demand: 6.1, price: 28, inventory: 160 },
    ],
    buildings: [],
  },
]

const defaultConvoys: Convoy[] = [
  {
    id: 'convoy-042',
    name: 'The Northern Star',
    capacity: 800,
    usedCapacity: 295,
    speed: 12,
    range: 1200,
    currentPort: 'Lübeck',
    status: 'docked',
    stops: [
      { cityId: 'lubeck', cityName: 'Lübeck', order: 1, buyThresholds: {}, sellThresholds: {} },
      { cityId: 'visby', cityName: 'Visby', order: 2, buyThresholds: {}, sellThresholds: {} },
      { cityId: 'riga', cityName: 'Riga', order: 3, buyThresholds: {}, sellThresholds: {} },
    ],
  },
]

const defaultTradeRoutes: TradeRoute[] = [
  {
    id: 'route-001',
    name: 'Baltic Triangle',
    convoyId: 'convoy-042',
    stops: ['lubeck', 'visby', 'riga'],
    isActive: true,
    profitMargin: 14,
    totalValue: 12450,
  },
]

interface GameStore extends GameState {
  setPlayer: (player: Partial<Player>) => void
  setCurrentCity: (cityId: string | null) => void
  setSelectedConvoy: (convoyId: string | null) => void
  addGold: (amount: number) => void
  deductGold: (amount: number) => boolean
  updateCity: (cityId: string, updates: Partial<City>) => void
  updateConvoy: (convoyId: string, updates: Partial<Convoy>) => void
  toggleRouteActive: (routeId: string) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: defaultPlayer,
  cities: defaultCities,
  convoys: defaultConvoys,
  tradeRoutes: defaultTradeRoutes,
  currentCityId: 'lubeck',
  selectedConvoyId: 'convoy-042',
  selectedRouteId: 'route-001',
  notifications: 3,

  setPlayer: (updates) => set((state) => ({
    player: { ...state.player, ...updates },
  })),

  setCurrentCity: (cityId) => set({ currentCityId: cityId }),

  setSelectedConvoy: (convoyId) => set({ selectedConvoyId: convoyId }),

  addGold: (amount) => set((state) => ({
    player: { ...state.player, gold: state.player.gold + amount },
  })),

  deductGold: (amount) => {
    const state = get()
    if (state.player.gold < amount) return false
    set({ player: { ...state.player, gold: state.player.gold - amount } })
    return true
  },

  updateCity: (cityId, updates) => set((state) => ({
    cities: state.cities.map((c) => c.id === cityId ? { ...c, ...updates } : c),
  })),

  updateConvoy: (convoyId, updates) => set((state) => ({
    convoys: state.convoys.map((c) => c.id === convoyId ? { ...c, ...updates } : c),
  })),

  toggleRouteActive: (routeId) => set((state) => ({
    tradeRoutes: state.tradeRoutes.map((r) =>
      r.id === routeId ? { ...r, isActive: !r.isActive } : r
    ),
  })),
}))
