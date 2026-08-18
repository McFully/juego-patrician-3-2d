export interface City {
  id: string
  name: string
  population: number
  stability: number
  hasWarehouse: boolean
  warehouseLevel: number
  resources: CityResource[]
  buildings: Building[]
}

export interface CityResource {
  id: string
  name: string
  icon: string
  production: number
  demand: number
  price: number
  inventory: number
}

export interface Building {
  id: string
  name: string
  type: string
  level: number
  icon: string
  production?: number
  consumption?: number
}

export interface Convoy {
  id: string
  name: string
  capacity: number
  usedCapacity: number
  speed: number
  range: number
  currentPort: string
  stops: ConvoyStop[]
  status: 'docked' | 'sailing' | 'loading' | 'idle'
}

export interface ConvoyStop {
  cityId: string
  cityName: string
  order: number
  buyThresholds: Record<string, number>
  sellThresholds: Record<string, number>
}

export interface TradeRoute {
  id: string
  name: string
  convoyId: string
  stops: string[]
  isActive: boolean
  profitMargin: number
  totalValue: number
}

export interface Player {
  name: string
  title: string
  gold: number
  reputation: number
  fleetSize: number
  tradeRoutes: number
  citiesUnlocked: number
  date: string
  season: 'spring' | 'summer' | 'autumn' | 'winter'
}

export interface GameState {
  player: Player
  cities: City[]
  convoys: Convoy[]
  tradeRoutes: TradeRoute[]
  currentCityId: string | null
  selectedConvoyId: string | null
  selectedRouteId: string | null
  notifications: number
}
