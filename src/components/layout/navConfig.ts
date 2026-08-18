export interface NavItemConfig {
  id: string
  label: string
  icon: string
  path: string
  badge?: string | number
}

export const NAV_ITEMS: NavItemConfig[] = [
  { id: 'city', label: 'Ciudad', icon: 'location_city', path: '/city-overview' },
  { id: 'trading', label: 'Lonja', icon: 'storefront', path: '/trading-office' },
  { id: 'town-hall', label: 'Ayuntamiento', icon: 'gavel', path: '/town-hall' },
  { id: 'shipyard', label: 'Astillero', icon: 'anchor', path: '/shipyard' },
  { id: 'tavern', label: 'Taberna', icon: 'sports_bar', path: '/tavern' },
  { id: 'weapon-smith', label: 'Armero', icon: 'security', path: '/weapon-smith' },
  { id: 'church', label: 'Iglesia', icon: 'church', path: '/cathedral' },
  { id: 'guild', label: 'Gremio', icon: 'groups', path: '/merchant-guild' },
  { id: 'bath-house', label: 'Baños', icon: 'hot_tub', path: '/bath-house' },
  { id: 'money-lender', label: 'Prestamista', icon: 'account_balance', path: '/money-lender' },
  { id: 'expedition', label: 'Expedición', icon: 'explore', path: '/expedition' },
  { id: 'combat', label: 'Combate', icon: 'swords', path: '/combat' },
]

export const MOBILE_NAV_ITEMS: NavItemConfig[] = [
  { id: 'world-map', label: 'Mapa Mundial', icon: 'public', path: '/world-map' },
  { id: 'city', label: 'Centro Urbano', icon: 'home_app_logo', path: '/city-overview' },
  { id: 'fleet', label: 'Flota', icon: 'sailing', path: '/inspection' },
  { id: 'ledger', label: 'Libro Mayor', icon: 'account_balance', path: '/ledger' },
]
