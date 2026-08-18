import { Route, Switch, useLocation } from 'wouter'
import { useState, useEffect, useCallback, lazy, Suspense, ComponentType } from 'react'
import { TitleScreen } from './screens/TitleScreen'
import { CityOverview } from './screens/CityOverview'
import { WorldMap } from './screens/WorldMap'
import { HUD } from './screens/HUD'
import { MaritimeSplashScreen } from './screens/MaritimeSplashScreen'
import { TechnicalWiki } from './screens/TechnicalWiki'
import { SaveLoadManager } from './screens/SaveLoadManager'
import { LegacyCredits } from './screens/LegacyCredits'

function named<T extends ComponentType<any>>(loader: () => Promise<{ [key: string]: T }>, name: string) {
  return lazy(() => loader().then(m => ({ default: m[name] })))
}

const TradeRouteEditor = named(() => import('./screens/TradeRouteEditor'), 'TradeRouteEditor')
const TradeRouteEditorMobile = named(() => import('./screens/TradeRouteEditorMobile'), 'TradeRouteEditorMobile')
const Shipyard = named(() => import('./screens/Shipyard'), 'Shipyard')
const TradingOffice = named(() => import('./screens/TradingOffice'), 'TradingOffice')
const TownHall = named(() => import('./screens/TownHall'), 'TownHall')
const Tavern = named(() => import('./screens/Tavern'), 'Tavern')
const Cathedral = named(() => import('./screens/Cathedral'), 'Cathedral')
const MoneyLender = named(() => import('./screens/MoneyLender'), 'MoneyLender')
const MerchantGuild = named(() => import('./screens/MerchantGuild'), 'MerchantGuild')
const WeaponSmith = named(() => import('./screens/WeaponSmith'), 'WeaponSmith')
const FinancialLedger = named(() => import('./screens/FinancialLedger'), 'FinancialLedger')
const VesselInspection = named(() => import('./screens/VesselInspection'), 'VesselInspection')
const CombatArena = named(() => import('./screens/CombatArena'), 'CombatArena')
const ExpeditionMap = named(() => import('./screens/ExpeditionMap'), 'ExpeditionMap')
const AlertsEventOverlays = named(() => import('./screens/AlertsEventOverlays'), 'AlertsEventOverlays')
const ArchitectsGuildResearch = named(() => import('./screens/ArchitectsGuildResearch'), 'ArchitectsGuildResearch')
const AtSeaEncounterMenu = named(() => import('./screens/AtSeaEncounterMenu'), 'AtSeaEncounterMenu')
const BalticWinterLogistics = named(() => import('./screens/BalticWinterLogistics'), 'BalticWinterLogistics')
const BankruptcyLiquidationState = named(() => import('./screens/BankruptcyLiquidationState'), 'BankruptcyLiquidationState')
const BuildingPlacementInteraction = named(() => import('./screens/BuildingPlacementInteraction'), 'BuildingPlacementInteraction')
const BuildingStatistics = named(() => import('./screens/BuildingStatistics'), 'BuildingStatistics')
const CathedralWorksCharity = named(() => import('./screens/CathedralWorksCharity'), 'CathedralWorksCharity')
const CharacterCampaignCreation = named(() => import('./screens/CharacterCampaignCreation'), 'CharacterCampaignCreation')
const CitySiegeDefense = named(() => import('./screens/CitySiegeDefense'), 'CitySiegeDefense')
const ConstructionActionWheel = named(() => import('./screens/ConstructionActionWheel'), 'ConstructionActionWheel')
const ConvoyManagerModal = named(() => import('./screens/ConvoyManagerModal'), 'ConvoyManagerModal')
const CouncilHallMobile = named(() => import('./screens/CouncilHallMobile'), 'CouncilHallMobile')
const HanseaticLeagueMissionBoard = named(() => import('./screens/HanseaticLeagueMissionBoard'), 'HanseaticLeagueMissionBoard')
const HanseaticMerchantStrategySystem = named(() => import('./screens/HanseaticMerchantStrategySystem'), 'HanseaticMerchantStrategySystem')
const MarketHall = named(() => import('./screens/MarketHall'), 'MarketHall')
const PoliticalExileState = named(() => import('./screens/PoliticalExileState'), 'PoliticalExileState')
const SettingsCareerLog = named(() => import('./screens/SettingsCareerLog'), 'SettingsCareerLog')
const TheBathHouse = named(() => import('./screens/TheBathHouse'), 'TheBathHouse')
const TheHanseaticDietHall = named(() => import('./screens/TheHanseaticDietHall'), 'TheHanseaticDietHall')
const TheMerchantSLegacy = named(() => import('./screens/TheMerchantSLegacy'), 'TheMerchantSLegacy')
const VictoryHistoricalSummary = named(() => import('./screens/VictoryHistoricalSummary'), 'VictoryHistoricalSummary')
const WarehouseStockManagement = named(() => import('./screens/WarehouseStockManagement'), 'WarehouseStockManagement')
const OfficialLandingPage = named(() => import('./screens/OfficialLandingPage'), 'OfficialLandingPage')
const MerchantGuideOnboarding = named(() => import('./screens/MerchantGuideOnboarding'), 'MerchantGuideOnboarding')
const GlobalMessageCenter = named(() => import('./screens/GlobalMessageCenter'), 'GlobalMessageCenter')

function NavigationFooter() {
  const [location, setLocation] = useLocation()

  // No mostrar en la pantalla de título, landing ni creación de campaña
  if (location === '/' || location === '/landing' || location === '/new-campaign') {
    return null
  }

  const navItems = [
    { name: 'Mapa Mundial', icon: 'public', path: '/world-map' },
    { name: 'Libro Mayor', icon: 'account_balance', path: '/ledger' },
    { name: 'Centro Urbano', icon: 'home_app_logo', path: '/city-overview' },
    { name: 'Mercado', icon: 'storefront', path: '/market' },
    { name: 'Concejo', icon: 'gavel', path: '/town-hall' },
  ]

  return (
    <footer role="navigation" className="absolute bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin py-sm bg-primary-container/60 backdrop-blur-xl border-t border-on-surface/10 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] rounded-t-xl" aria-label="Navegación inferior">
      {navItems.map((item) => {
        const isActive = location === item.path
        return (
          <button
            key={item.path}
            onClick={() => setLocation(item.path)}
            className={`flex flex-col items-center justify-center px-md py-xs rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-tertiary-fixed text-on-tertiary-fixed scale-102 font-bold'
                : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-tertiary'
            }`}
            aria-label={item.name}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={`material-symbols-outlined ${isActive ? 'text-on-tertiary-fixed' : ''}`} aria-hidden="true">
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.name}</span>
          </button>
        )
      })}
    </footer>
  )
}

import { useHotkeys } from './hooks/useHotkeys'

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <span className="material-symbols-outlined text-tertiary-fixed animate-spin text-6xl">progress_activity</span>
      <p className="text-on-surface-variant font-label-lg">Cargando...</p>
    </div>
  </div>
)

export default function App() {
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [location] = useLocation()
  useHotkeys() // Enable Professional Hotkeys

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920
      const targetHeight = 1080
      const widthScale = window.innerWidth / targetWidth
      const heightScale = window.innerHeight / targetHeight
      const newScale = Math.min(widthScale, heightScale)
      setScale(newScale)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLoadingComplete = useCallback(() => setLoading(false), [])

  if (loading) {
    return <MaritimeSplashScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none">
      <div 
        className="relative origin-center flex-shrink-0 bg-background overflow-hidden"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
        }}
      >
        {location !== '/' && location !== '/landing' && location !== '/new-campaign' && <HUD />}
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            <Route path="/" component={TitleScreen} />
            <Route path="/landing" component={OfficialLandingPage} />
            <Route path="/new-campaign" component={CharacterCampaignCreation} />
            
            <Route path="/city-overview" component={CityOverview} />
            <Route path="/city/:cityId" component={CityOverview} />
            <Route path="/world-map" component={WorldMap} />
            <Route path="/trade-route" component={TradeRouteEditor} />
            <Route path="/trade-routes" component={TradeRouteEditor} />
            <Route path="/trade-route-mobile" component={TradeRouteEditorMobile} />
            <Route path="/shipyard" component={Shipyard} />
            <Route path="/trading-office" component={TradingOffice} />
            <Route path="/town-hall" component={TownHall} />
            <Route path="/tavern" component={Tavern} />
            <Route path="/cathedral" component={Cathedral} />
            <Route path="/money-lender" component={MoneyLender} />
            <Route path="/merchant-guild" component={MerchantGuild} />
            <Route path="/weapon-smith" component={WeaponSmith} />
            <Route path="/bath-house" component={TheBathHouse} />
            <Route path="/ledger" component={FinancialLedger} />
            <Route path="/inspection" component={VesselInspection} />
            <Route path="/market" component={MarketHall} />
            <Route path="/settings" component={SettingsCareerLog} />
            <Route path="/messages" component={GlobalMessageCenter} />
            <Route path="/wiki" component={TechnicalWiki} />
            <Route path="/save-load" component={SaveLoadManager} />
            <Route path="/credits" component={LegacyCredits} />
            <Route path="/architects-guild" component={ArchitectsGuildResearch} />
            <Route path="/combat" component={CombatArena} />
            <Route path="/expedition" component={ExpeditionMap} />
            <Route path="/expedition-map" component={ExpeditionMap} />
            <Route path="/alerts" component={AlertsEventOverlays} />
            <Route path="/winter" component={BalticWinterLogistics} />
            <Route path="/convoy-manager" component={ConvoyManagerModal} />
            <Route path="/diet-hall" component={TheHanseaticDietHall} />
            <Route path="/legacy" component={TheMerchantSLegacy} />
            <Route path="/at-sea" component={AtSeaEncounterMenu} />
            <Route path="/bankruptcy" component={BankruptcyLiquidationState} />
            <Route path="/building-placement" component={BuildingPlacementInteraction} />
            <Route path="/building-statistics" component={BuildingStatistics} />
            <Route path="/cathedral-works" component={CathedralWorksCharity} />
            <Route path="/city-siege" component={CitySiegeDefense} />
            <Route path="/construction" component={ConstructionActionWheel} />
            <Route path="/council-hall" component={CouncilHallMobile} />
            <Route path="/mission-board" component={HanseaticLeagueMissionBoard} />
            <Route path="/hanseatic-merchant" component={HanseaticMerchantStrategySystem} />
            <Route path="/political-exile" component={PoliticalExileState} />
            <Route path="/warehouse" component={WarehouseStockManagement} />
            <Route path="/onboarding" component={MerchantGuideOnboarding} />
            <Route path="/victory" component={VictoryHistoricalSummary} />
          </Switch>
        </Suspense>
      </div>
    </div>
  )
}
