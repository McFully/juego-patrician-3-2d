import { GameEngine } from '../GameEngine'

export type GameEventCallback = (data: any) => void

export interface EngineAdapter {
  engine: GameEngine
  startNewGame: (playerName: string, homeCity: string) => void
  loadGame: (saveName: string) => any
  saveGame: (saveName: string) => any
  buyGood: (goodId: string, amount: number) => any
  sellGood: (goodId: string, amount: number) => any
  setTickRate: (rate: number) => void
  stepDay: () => void
  setCurrentCity: (cityId: string) => boolean
  updateTradingOfficeRules: (cityId: string, rules: any) => boolean
  buildTradingOffice: (cityId: string) => boolean
  hireOfficeManager: (cityId: string) => boolean
  transferOfficeBudget: (cityId: string, amount: number) => boolean
  commissionShip: (cityId: string, shipTypeId: string) => any
  CONTRATARSailors: (count: number, shipIndex: number) => boolean
  CONTRATARCaptain: (captainId: string, shipIndex: number) => boolean
  donateToCathedral: (amount: number) => number
  takeLoan: (amount: number, weeks: number) => any
  repayLoan: (id: number) => boolean
  bribeCouncillor: (cityId: string, councillorIndex: number, amount: number) => boolean
  setPlayerRoute: (cityIds: string[], options: any) => void
  buildFactory: (cityId: string, factoryId: string) => boolean
  hireWorkers: (factoryId: string, count: number) => number | false
  resolveEncounter: (action: 'fight' | 'flee' | 'surrender') => any
  startMission: (missionId: string) => any
  on: (event: string, cb: GameEventCallback) => void
  off: (event: string, cb: GameEventCallback) => void
  getState: () => any
  getStatus: () => any
  buyWeapons: (type: 'saber' | 'cannon', count: number, shipIndex: number) => boolean
  repairShip: (cityId: string, shipIndex: number) => any
}

export function createEngineAdapter(): EngineAdapter {
  const engine = new GameEngine()
  const listeners: Record<string, GameEventCallback[]> = {}

  return {
    engine,

    startNewGame(playerName, homeCity) {
      engine.newGame(playerName, homeCity)
    },

    loadGame(saveName) {
      return engine.loadGame(saveName)
    },

    saveGame(saveName) {
      return engine.saveGame(saveName)
    },

    buyGood(goodId, amount) {
      return engine.playerBuy(goodId, amount)
    },

    sellGood(goodId, amount) {
      return engine.playerSell(goodId, amount)
    },

    setTickRate(rate) {
      engine.server.tickRate = 1000 / rate
      if (engine.server.running) {
        engine.server.stop()
        engine.server.start()
      }
    },

    stepDay() {
      engine.stepDay()
    },

    setCurrentCity(cityId) {
      return engine.setCurrentCity(cityId)
    },

    updateTradingOfficeRules(cityId, rules) {
      if (!engine.player) return false
      const office = engine.player.tradingOffices[cityId]
      if (!office) return false
      office.autoBuyRules = { ...office.autoBuyRules, ...rules.autoBuyRules }
      office.autoSellRules = { ...office.autoSellRules, ...rules.autoSellRules }
      return true
    },

    buildTradingOffice(cityId) {
      if (engine.player?.currentCityId !== cityId) {
        engine.setCurrentCity(cityId)
      }
      return engine.buildTradingOffice()
    },

    hireOfficeManager(cityId) {
      return engine.hireOfficeManager(cityId)
    },

    transferOfficeBudget(cityId, amount) {
      return engine.transferOfficeBudget(cityId, amount)
    },

    commissionShip(cityId, shipTypeId) {
      return engine.buildShip(cityId, shipTypeId).success
    },

    CONTRATARSailors(count, shipIndex) {
      return !!engine.hireSailors(count, shipIndex)
    },

    CONTRATARCaptain(captainId, shipIndex) {
      return engine.hireCaptain(captainId, shipIndex)
    },

    donateToCathedral(amount) {
      return engine.donateToCathedral(amount)
    },

    takeLoan(amount, weeks) {
      return engine.takeLoan(amount, weeks)
    },

    repayLoan(id) {
      return engine.repayLoan(id)
    },

    bribeCouncillor(cityId, councillorIndex, amount) {
      return engine.bribeCouncillor(cityId, councillorIndex, amount)
    },

    setPlayerRoute(cityIds, options) {
      engine.setPlayerRoute(cityIds, options)
    },

    buildFactory(cityId, factoryId) {
      // Note: cityId is ignored in original engine but passed for consistency
      return engine.buildFactory(factoryId)
    },

    hireWorkers(factoryId, count) {
      return engine.hireWorkers(factoryId, count)
    },

    resolveEncounter(action) {
      return engine.resolveEncounter(action)
    },

    startMission(missionId) {
      return engine.startMission(missionId)
    },

    getState() {
      return engine.getGameState()
    },

    getStatus() {
      return engine.getGameStatus()
    },

    buyWeapons(type, count, shipIndex) {
      return engine.buyWeapons(type, count, shipIndex)
    },

    repairShip(cityId, shipIndex) {
      return engine.repairShip(cityId, shipIndex)
    },

    on(event, cb) {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(cb)
      engine.server.eventBus.on(event, cb)
    },

    off(event, cb) {
      if (!listeners[event]) return
      listeners[event] = listeners[event].filter((l) => l !== cb)
      engine.server.eventBus.off(event, cb)
    },
  }
}
