import { useState, useMemo, useEffect } from 'react'
import { useLocation, useRoute } from 'wouter'
import { useGame, usePlayer, useSimulationState } from '../engine/GameProvider'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import db from '../database/index'
import { ASSETS } from '../utils/proceduralAssets'
import { audioManager } from '../client_ui/audio'

const { CITIES } = db

export function CityOverview() {
  const [, setLocation] = useLocation()
  const [, cityRouteParams] = useRoute('/city/:cityId')
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const sim = useSimulationState()
  const currentCityId = player?.currentCityId || 'lubeck'

  useEffect(() => {
    const routeCityId = cityRouteParams?.cityId
    if (routeCityId && routeCityId !== player?.currentCityId) {
      engine.setCurrentCity(routeCityId)
    }
  }, [cityRouteParams?.cityId, engine, player?.currentCityId])

  const cityState = useMemo(() => sim?.cities?.[currentCityId], [sim, currentCityId])
  const cityDef = useMemo(() => CITIES.find((c: any) => c.id === currentCityId), [currentCityId])

  useEffect(() => {
    if (cityDef) {
      audioManager.playCityAmbience(cityDef.draft === 'deep' ? 'deep' : 'shallow')
    }
    return () => audioManager.stopAll()
  }, [cityDef])

  // ESC key listener to close panels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedElement(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Selected element to show on the persistent right sidebar
  // Options: null (general city info), 'cathedral', 'market', 'town_hall', 'warehouse', 'mill', 'forge', 'citizen'
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  
  // Local state for Cathedral donations
  const [donateGold, setDonateGold] = useState(500)
  const [cathedralMsg, setCathedralMsg] = useState('')

  // Citizen rumor fallback
  const [selectedCitizenRumor, setSelectedCitizenRumor] = useState(
    'La Hansa Báltica prospera gracias a las rutas de grano hacia el este.'
  )

  if (!player) return null

  const population = cityState?.population || 0
  const stability = cityState?.reputation || 50
  const cityName = cityDef?.name || currentCityId.toUpperCase()

  // Bribe councillor in Town Hall
  const handleBribe = (index: number) => {
    const cost = 1000
    if (player.gold >= cost) {
      const ok = engine.bribeCouncillor(currentCityId, index, cost)
      if (ok) {
        showCathedralMsg('Concejal sobornado con éxito.')
      } else {
        showCathedralMsg('Error al procesar soborno.')
      }
    } else {
      showCathedralMsg('Fondos insuficientes.')
    }
  }

  // Cathedral actions
  const handleDonate = () => {
    if (player.gold >= donateGold) {
      const rep = engine.donateToCathedral(donateGold)
      if (rep > 0) {
        showCathedralMsg(`✓ Donados ${donateGold} DUC. Reputación +${rep.toFixed(1)}`)
      }
    } else {
      showCathedralMsg('Oro insuficiente.')
    }
  }

  const showCathedralMsg = (text: string) => {
    setCathedralMsg(text)
    setTimeout(() => setCathedralMsg(''), 4000)
  }

  // Quick buy/sell from the persistent Sidebar Lonja (Market)
  const handleMarketBuy = (goodId: string) => {
    engine.buyGood(goodId, 5)
  }

  const handleMarketSell = (goodId: string) => {
    engine.sellGood(goodId, 5)
  }

  return (
    <div className="w-full h-[95vh] mt-[5vh] flex flex-col lg:flex-row overflow-hidden bg-[#070b13] text-on-surface select-none">
      
      {/* ── SECTOR IZQUIERDO: EL AREA DE LA CIUDAD (75% ANCHO) ── */}
      <div className="w-full lg:w-[75%] h-full flex flex-col relative border-r border-white/5 bg-[#141b12]">
        
        {/* Decorative Grid overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b2f19]/30 via-transparent to-black/60 pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-20 pointer-events-none isometric-grid z-0" />

        {/* --- HEADER --- */}
        <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-lg">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/world-map')}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-bold rounded-lg transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">public</span>
              Mapa Báltico
            </button>
            <h1 className="text-lg font-black text-amber-400 uppercase tracking-widest font-serif">{cityName}</h1>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 border border-amber-500/30 rounded-full font-bold">
              {cityDef?.draft === 'deep' ? 'Puerto de Mar' : 'Ría Poco Profunda'}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Player details */}
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Tesorería</span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {Math.floor(player.gold).toLocaleString()} DUC
              </span>
            </div>
          </div>
        </header>

        {/* --- MAP CONTAINER --- */}
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedElement(null)
            }
          }}
          className="flex-1 flex items-center justify-center relative z-10"
        >
          
          {/* Main City Grid */}
          <div className="relative max-w-[850px] w-full aspect-[850/550] bg-black/10 rounded-3xl border border-white/5 shadow-2xl overflow-hidden p-6 flex flex-col justify-between">
            
            {/* Background River/Sea Shore Vector Graphic */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 850 550">
              <path d="M 0 450 C 300 480, 500 350, 850 420 L 850 550 L 0 550 Z" fill="#1b2a47" fillOpacity="0.4" stroke="#f0c040" strokeOpacity="0.1" strokeWidth="4" />
              <text x="700" y="500" fill="#f0c040" fillOpacity="0.3" className="text-xs font-bold tracking-widest uppercase">Canal de Acceso</text>
            </svg>

            {/* 1. DISTRITO INDUSTRIAL (Superior Izquierda) */}
            <div className="absolute left-[6%] top-[12%] flex flex-col gap-1.5 z-10 bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[9px] text-[#f0c040] font-black uppercase tracking-widest block border-b border-white/10 pb-0.5 w-fit">Zona Industrial</span>
              <div className="flex gap-2">
                {/* Molino de Grano */}
                <button 
                  onClick={() => setSelectedElement('mill')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">water_mill</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Molino</span>
                  {selectedElement === 'mill' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Fragua de Hierro */}
                <button 
                  onClick={() => setSelectedElement('forge')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">factory</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Fragua</span>
                  {selectedElement === 'forge' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>
              </div>
            </div>

            {/* 2. DISTRITO ADMINISTRATIVO Y RELIGIOSO (Superior Derecha) */}
            <div className="absolute right-[6%] top-[10%] flex flex-col gap-1.5 z-10 items-end bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[9px] text-[#f0c040] font-black uppercase tracking-widest block border-b border-white/10 pb-0.5 w-fit">Sede de la Liga</span>
              <div className="flex gap-2">
                {/* Catedral */}
                <button 
                  onClick={() => setSelectedElement('cathedral')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-300">church</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Catedral</span>
                  {selectedElement === 'cathedral' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Ayuntamiento */}
                <button 
                  onClick={() => setSelectedElement('town_hall')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-300">account_balance</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Consejo</span>
                  {selectedElement === 'town_hall' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Gremio de Mercaderes */}
                <button 
                  onClick={() => setSelectedElement('merchant_guild')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-300">stars</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Gremio</span>
                  {selectedElement === 'merchant_guild' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Baños Públicos */}
                <button 
                  onClick={() => setSelectedElement('bath_house')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-300">bathtub</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Baños</span>
                  {selectedElement === 'bath_house' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>
              </div>
            </div>

            {/* 3. DISTRITO COMERCIAL (Centro del Mapa) */}
            <div className="absolute left-[22%] top-[38%] flex flex-col gap-1.5 z-10 items-center bg-black/45 p-2.5 rounded-xl border border-white/5">
              <span className="text-[9px] text-[#f0c040] font-black uppercase tracking-widest block border-b border-white/10 pb-0.5 w-fit">Plaza Mayor Comercial</span>
              <div className="flex gap-2">
                {/* Lonja del Mercado */}
                <button 
                  onClick={() => setSelectedElement('market')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">storefront</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Lonja</span>
                  {selectedElement === 'market' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Almacén Principal */}
                <button 
                  onClick={() => setSelectedElement('warehouse')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">inventory</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Almacén</span>
                  {selectedElement === 'warehouse' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Oficina comercial */}
                <button 
                  onClick={() => setSelectedElement('trading_office')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">business_center</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Oficina</span>
                  {selectedElement === 'trading_office' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Prestamista */}
                <button 
                  onClick={() => setSelectedElement('money_lender')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">payments</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Banco</span>
                  {selectedElement === 'money_lender' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Taberna */}
                <button 
                  onClick={() => setSelectedElement('tavern')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">sports_bar</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Taberna</span>
                  {selectedElement === 'tavern' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>
              </div>
            </div>

            {/* 4. DISTRITO DEL PUERTO Y EMBARCACIONES (Fila Inferior / Ribera) */}
            <div className="absolute left-[10%] bottom-[6%] flex flex-col gap-1.5 z-10 bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[9px] text-[#f0c040] font-black uppercase tracking-widest block border-b border-white/10 pb-0.5 w-fit">Astillero & Muelles</span>
              <div className="flex gap-4 items-end">
                {/* Astillero */}
                <button 
                  onClick={() => setSelectedElement('shipyard')}
                  className="w-20 h-20 relative group bg-slate-900/60 hover:bg-slate-900/90 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-3xl text-amber-400">sailing</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Astillero</span>
                  {selectedElement === 'shipyard' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Armero */}
                <button 
                  onClick={() => setSelectedElement('weapon_smith')}
                  className="w-16 h-18 relative group bg-slate-900/60 hover:bg-slate-900 border border-amber-500/10 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-400">shield</span>
                  <span className="text-[8px] text-white/70 font-bold mt-1 uppercase">Armero</span>
                  {selectedElement === 'weapon_smith' && <div className="absolute -inset-1 border border-amber-500 rounded-xl shadow-[0_0_8px_rgba(240,192,64,0.3)]" />}
                </button>

                {/* Barco del Jugador atracado */}
                {player.fleet && player.fleet.length > 0 && (
                  <button 
                    onClick={() => setSelectedElement('ship')}
                    className="w-18 h-18 relative group bg-slate-900/30 hover:bg-slate-900/60 border border-blue-500/20 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center p-1 transition-all hover:scale-105"
                  >
                    <span className="material-symbols-outlined text-2xl text-blue-400">directions_boat</span>
                    <span className="text-[8px] text-white/70 font-mono mt-0.5 truncate max-w-[60px]">{player.fleet[0].name}</span>
                    <span className="text-[8px] text-emerald-400 font-bold font-mono">100% PV</span>
                    {selectedElement === 'ship' && <div className="absolute -inset-1 border border-blue-500 rounded-xl shadow-[0_0_8px_rgba(59,130,246,0.3)]" />}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── SECTOR DERECHO: EL PANEL LATERAL PERSISTENTE DE ACCIÓN (25% ANCHO) ── */}
      <div className="w-full lg:w-[25%] h-full bg-[#0a101d] border-l border-amber-500/20 shadow-2xl flex flex-col p-4 overflow-y-auto relative z-30 font-montserrat">
        
        {/* A. Tactical Minimap Component (P3 Style) */}
        <div className="w-full aspect-[4/3] bg-black/40 rounded-lg border border-amber-500/30 overflow-hidden relative mb-4">
          <svg className="w-full h-full bg-[#141b12]/90 pointer-events-none" viewBox="0 0 200 150">
            {/* River water path */}
            <path d="M 0 120 C 80 130, 120 100, 200 115 L 200 150 L 0 150 Z" fill="#1b2a47" opacity="0.6" />
            {/* Dots representing city buildings */}
            <circle cx="30" cy="40" r="4" fill="#f59e0b" />
            <circle cx="50" cy="45" r="4" fill="#f59e0b" />
            <circle cx="160" cy="35" r="4.5" fill="#ef4444" />
            <circle cx="140" cy="40" r="4" fill="#ef4444" />
            <circle cx="90" cy="75" r="5" fill="#3b82f6" />
            <circle cx="110" cy="80" r="4" fill="#3b82f6" />
            {/* Harbor ships */}
            <rect x="40" y="115" width="6" height="3" fill="#10b981" />
            <text x="10" y="20" fill="#f0c040" fontSize="8" fontWeight="bold" opacity="0.5">MINIMAPA TÁCTICO</text>
          </svg>
        </div>

        {/* B. View Mode Tabs (P3 Style: Ciudad / Mapa del Báltico) */}
        <div className="grid grid-cols-2 gap-1 bg-black/50 p-1 rounded-lg border border-amber-500/20 mb-4 text-center">
          <button 
            onClick={() => setSelectedElement(null)}
            className="py-1 rounded text-[10px] font-black tracking-wider uppercase bg-amber-500 text-black cursor-pointer"
          >
            Ciudad
          </button>
          <button 
            onClick={() => setLocation('/world-map')}
            className="py-1 rounded text-[10px] font-bold tracking-wider uppercase text-amber-500/60 hover:text-amber-400 cursor-pointer"
          >
            Báltico
          </button>
        </div>

        {/* C. VISTA GENERAL DE LA CIUDAD (Si no hay nada seleccionado) */}
        {selectedElement === null && (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="border-b border-amber-500/20 pb-2">
                <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Información Urbana</p>
                <h2 className="text-lg font-black text-white font-serif uppercase mt-0.5">{cityName}</h2>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-white/50 font-bold">
                    <span>Censo Ciudadano</span>
                    <span className="text-white font-mono">{population.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full" style={{ width: `${Math.min((population/12000)*100, 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-white/50 font-bold">
                    <span>Estabilidad Política</span>
                    <span className="text-white font-mono">{stability}%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full" style={{ width: `${stability}%` }} />
                  </div>
                </div>
              </div>

              {/* Abastecimiento de mercado */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Mercado Local</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'grain', name: 'Grano', stock: cityState?.prices?.grain?.stock ?? 0, icon: 'grass' },
                    { id: 'fish', name: 'Pescado', stock: cityState?.prices?.fish?.stock ?? 0, icon: 'set_meal' },
                    { id: 'beer', name: 'Cerveza', stock: cityState?.prices?.beer?.stock ?? 0, icon: 'sports_bar' },
                    { id: 'salt', name: 'Sal', stock: cityState?.prices?.salt?.stock ?? 0, icon: 'texture' },
                  ].map(r => (
                    <div key={r.id} className="bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1.5 text-white/40 mb-1">
                        <span className="material-symbols-outlined text-[14px]">{r.icon}</span>
                        <span className="text-[9px] uppercase font-bold">{r.name}</span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${r.stock > 60 ? 'text-emerald-400' : r.stock > 15 ? 'text-amber-400' : 'text-red-400'}`}>
                        {Math.floor(r.stock)} t
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={() => setLocation('/world-map')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer border-0"
              >
                Abrir Mapa del Báltico
              </button>
              <div className="mt-4 text-center text-[10px] text-white/25">
                © 2026 Aritz Bahamonde Larxé. All rights reserved.
              </div>
            </div>
          </div>
        )}

        {/* B. INSPECCIÓN DEL MARKET (LONJA) */}
        {selectedElement === 'market' && (
          <div className="flex flex-col h-full justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Lonja Municipal</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Comercio Local</h2>
                </div>
                <button 
                  onClick={() => setSelectedElement(null)} 
                  className="w-7 h-7 bg-red-700 hover:bg-red-600 text-white font-black rounded-lg flex items-center justify-center cursor-pointer text-sm shadow border border-red-800"
                  title="Cerrar ventana [ESC]"
                >
                  X
                </button>
              </div>

              <p className="text-[10px] text-white/40 leading-relaxed">Haz transacciones comerciales en tiempo real con el mercado de la ciudad.</p>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {[
                  { id: 'grain', name: 'Grano' },
                  { id: 'fish', name: 'Pescado' },
                  { id: 'beer', name: 'Cerveza' },
                  { id: 'salt', name: 'Sal' },
                  { id: 'wood', name: 'Madera' },
                  { id: 'cloth', name: 'Telas' },
                  { id: 'bricks', name: 'Ladrillos' },
                  { id: 'tools', name: 'Herramientas' },
                ].map(g => {
                  const pInfo = cityState?.prices?.[g.id];
                  const stock = Math.floor(pInfo?.stock ?? 0);
                  const bPrice = Math.floor(pInfo?.buyPrice ?? 15);
                  const sPrice = Math.floor(pInfo?.sellPrice ?? 12);
                  return (
                    <div key={g.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-between gap-1.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{g.name}</span>
                        <span className="text-[8px] text-white/40 font-mono">Stock: {stock}t</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => engine.buyGood(g.id, 5)}
                          className="px-2 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-black font-black text-[9px] cursor-pointer"
                        >
                          C {bPrice}g
                        </button>
                        <button 
                          onClick={() => engine.sellGood(g.id, 5)}
                          className="px-2 py-1.5 rounded bg-rose-500/10 hover:bg-rose-50 border border-rose-500/30 text-rose-400 hover:text-black font-black text-[9px] cursor-pointer"
                        >
                          V {sPrice}g
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Wooden door P3 theme exit button */}
            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={() => setSelectedElement(null)}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 border border-amber-900 text-amber-100 hover:text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">door_open</span>
                Volver a la ciudad
              </button>
            </div>

          </div>
        )}

        {/* C. INSPECCIÓN DE LA CATEDRAL */}
        {selectedElement === 'cathedral' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Inspeccionar</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Catedral</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              {cathedralMsg && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center rounded font-semibold animate-pulse">
                  {cathedralMsg}
                </div>
              )}

              <p className="text-[10px] text-white/40 leading-relaxed">Donar oro para acoger a mendigos, huérfanos y aumentar tu reputación eclesiástica.</p>

              {/* Donation Slider */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center text-xs font-bold text-white/70">
                  <span>Ofrenda</span>
                  <span className="font-mono text-amber-400">{donateGold} DUC</span>
                </div>
                <input 
                  type="range" 
                  min={100} 
                  max={Math.min(player.gold, 5000)} 
                  step={100}
                  value={donateGold}
                  onChange={e => setDonateGold(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer bg-white/10 h-1 rounded-lg"
                />
                <button 
                  onClick={handleDonate}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-lg cursor-pointer transition-all border-0 shadow-lg"
                >
                  Confirmar Donación
                </button>
              </div>

              <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl text-center space-y-1">
                <div className="text-[10px] text-white/40">Feligreses Activos</div>
                <div className="text-sm font-bold text-white">420 Almas</div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (player.gold >= 15000) {
                  player.gold -= 15000;
                  showCathedralMsg('✓ Construcción de ampliación financiada.');
                } else {
                  showCathedralMsg('Oro insuficiente.');
                }
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-black font-black text-xs uppercase cursor-pointer"
            >
              Financiar Ampliación (15.000 DUC)
            </button>
          </div>
        )}

        {/* D. INSPECCIÓN DEL CONCEJO (TOWN HALL) */}
        {selectedElement === 'town_hall' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Inspeccionar</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Ayuntamiento</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              {cathedralMsg && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center rounded font-semibold">
                  {cathedralMsg}
                </div>
              )}

              <p className="text-[10px] text-white/40 leading-relaxed">Concejales activos del ayuntamiento. Puedes sobornarlos por 1.000 DUC para ganar sus votos en los decretos.</p>

              {/* Councillors list */}
              <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1 custom-scrollbar">
                {(worldState?.politics?.councillors || []).map((c: any, index: number) => (
                  <div key={index} className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-between gap-1.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{c.name}</span>
                      <span className={`text-[8px] font-bold ${c.bribed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {c.bribed ? 'LEAL' : 'ESCÉPTICO'}
                      </span>
                    </div>
                    {!c.bribed && (
                      <button 
                        onClick={() => handleBribe(index)}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500 border border-amber-500/35 hover:text-black font-black text-[9px] cursor-pointer"
                      >
                        Bribe
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] text-white/40 font-bold uppercase">Decreto de Votación</span>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5 text-xs text-white/60">
                <div>Impuesto de defensa: +5%</div>
                <div className="text-[10px] text-white/40 mt-1">Apoyo estimado: 40%</div>
              </div>
            </div>
          </div>
        )}

        {/* E. INSPECCIÓN DEL ALMACÉN (WAREHOUSE) */}
        {selectedElement === 'warehouse' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#f0c040]/20 pb-3">
                <div>
                  <p className="text-[9px] text-[#f0c040] font-bold uppercase tracking-widest">Inspeccionar</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Almacén</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              <p className="text-[10px] text-white/40">Inventario local y capacidad de almacenamiento del jugador.</p>

              <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-1.5">
                <div className="flex justify-between text-xs text-white/60">
                  <span>Capacidad Utilizada</span>
                  <span className="font-mono text-white">450 / 5.000 t</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '9%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-900/30 border border-white/5 rounded-lg text-center">
                  <div className="text-[9px] text-white/40">Grano</div>
                  <div className="text-xs font-bold text-white font-mono">250 t</div>
                </div>
                <div className="p-2 bg-slate-900/30 border border-white/5 rounded-lg text-center">
                  <div className="text-[9px] text-white/40">Sal</div>
                  <div className="text-xs font-bold text-white font-mono">120 t</div>
                </div>
              </div>
            </div>

            {/* Transfer to ship button */}
            <button 
              onClick={() => {
                showCathedralMsg('Mercancías transferidas al barco principal.');
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-black font-black text-xs uppercase cursor-pointer"
            >
              Transferir todo al barco
            </button>
          </div>
        )}

        {/* F. INSPECCIÓN DE INDUSTRIAS (MOLINO / FRAGUA) */}
        {(selectedElement === 'mill' || selectedElement === 'forge') && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#f0c040]/20 pb-3">
                <div>
                  <p className="text-[9px] text-[#f0c040] font-bold uppercase tracking-widest">Inspeccionar</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">
                    {selectedElement === 'mill' ? 'Molino de Grano' : 'Fragua de Hierro'}
                  </h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/5 text-xs text-white/60">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>Estado Operativo</span>
                  <span className="text-emerald-400 font-bold">ACTIVO</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>Trabajadores</span>
                  <span className="font-mono text-white">12 / 30</span>
                </div>
                <div className="flex justify-between">
                  <span>Producción diaria</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {selectedElement === 'mill' ? '+4.2t Grano' : '+2.5t Herramientas'}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                showCathedralMsg('Fábrica configurada con éxito.');
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase cursor-pointer"
            >
              Detener Producción
            </button>
          </div>
        )}

        {/* G. INSPECCIÓN DE BARCO */}
        {selectedElement === 'ship' && player.fleet && player.fleet.length > 0 && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-blue-500/30 pb-3">
                <div>
                  <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Navío Activo</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">{player.fleet[0].name}</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/5 text-xs text-white/60">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>Tipo de Navío</span>
                  <span className="font-bold text-white uppercase">{player.fleet[0].typeId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>Capacidad de Carga</span>
                  <span className="font-mono text-white">{player.fleet[0].cargoCapacity} t</span>
                </div>
                <div className="flex justify-between">
                  <span>Tripulación</span>
                  <span className="font-mono text-white">{player.fleet[0].crew} / {player.fleet[0].crewMax}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setLocation('/trade-route')}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase cursor-pointer border-0"
            >
              Editar Ruta de Comercio
            </button>
          </div>
        )}

        {/* H. INSPECCIÓN DE ASTILLERO */}
        {selectedElement === 'shipyard' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#f0c040]/20 pb-3">
                <div>
                  <p className="text-[9px] text-[#f0c040] font-bold uppercase tracking-widest">Astillero</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Construcción</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              {cathedralMsg && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center rounded font-semibold">
                  {cathedralMsg}
                </div>
              )}

              <p className="text-[10px] text-white/40">Comisiona barcos ligeros o mercantes pesados en el puerto.</p>

              <div className="space-y-2">
                {[
                  { id: 'snaikka', name: 'Snaikka', gold: 3000, buildTime: '3 días' },
                  { id: 'crayer', name: 'Crayer', gold: 5000, buildTime: '5 días' },
                  { id: 'cog', name: 'Cogge', gold: 8000, buildTime: '8 días' },
                  { id: 'hulk', name: 'Hulk', gold: 12000, buildTime: '12 días' },
                ].map(s => (
                  <div key={s.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{s.name}</div>
                      <div className="text-[8px] text-white/45">{s.buildTime}</div>
                    </div>
                    <button 
                      onClick={() => {
                        if (player.gold >= s.gold) {
                          player.gold -= s.gold;
                          engine.commissionShip(currentCityId, s.id);
                          showCathedralMsg(`✓ ${s.name} comisionado.`);
                        } else {
                          showCathedralMsg('Oro insuficiente.');
                        }
                      }}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500 border border-amber-500/35 hover:text-black font-black text-[9px] cursor-pointer"
                    >
                      {s.gold} DUC
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* I. TABERNA (TAVERN) */}
        {selectedElement === 'tavern' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Taberna Local</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">El Refugio de Visby</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              {cathedralMsg && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center rounded font-semibold">
                  {cathedralMsg}
                </div>
              )}

              <p className="text-[10px] text-white/40">Contrata marineros o capitanes legendarios para tus convoyes.</p>

              <button 
                onClick={() => {
                  if (engine.CONTRATARSailors(5, 0)) {
                    showCathedralMsg('✓ 5 marineros contratados para el convoy.');
                  } else {
                    showCathedralMsg('Fondos o espacio de tripulación insuficientes.');
                  }
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Contratar 5 Marineros (500 DUC)
              </button>

              <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl space-y-1">
                <span className="text-[8px] text-white/40 font-bold uppercase block">Capitanes Disponibles</span>
                <div className="text-xs text-white font-bold">Almirante Van Der Meer</div>
                <div className="text-[8px] text-amber-400">Navegación V · Combate IV</div>
              </div>
            </div>
          </div>
        )}

        {/* J. PRESTAMISTA (MONEY LENDER) */}
        {selectedElement === 'money_lender' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#f0c040]/20 pb-3">
                <div>
                  <p className="text-[9px] text-[#f0c040] font-bold uppercase tracking-widest">Prestamista</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Banca Comercial</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              {cathedralMsg && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center rounded font-semibold">
                  {cathedralMsg}
                </div>
              )}

              <p className="text-[10px] text-white/40">Solicita crédito de liquidez rápida o paga tus deudas activas.</p>

              <div className="space-y-2">
                <button 
                  onClick={() => {
                    player.gold += 5000;
                    showCathedralMsg('✓ Préstamo de 5.000 DUC concedido.');
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Pedir Préstamo (5.000 DUC - 4% Int)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* K. GREMIO DE MERCADERES (MERCHANT GUILD) */}
        {selectedElement === 'merchant_guild' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Gremio Imperial</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Gremio Comercial</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              <p className="text-[10px] text-white/40">Consulta las subastas marítimas y los rankings comerciales de la liga.</p>

              <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl text-xs space-y-1.5">
                <div className="text-[8px] text-white/40 font-bold uppercase">Subastas Activas</div>
                <div className="text-white font-bold">El Gran Grifo (Kogge)</div>
                <div className="text-[10px] text-amber-400">Oferta: 85.200 DUC</div>
              </div>
            </div>
          </div>
        )}

        {/* L. BAÑOS PÚBLICOS (BATH HOUSE) */}
        {selectedElement === 'bath_house' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Baños Públicos</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Cámara de Vapor</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              <p className="text-[10px] text-white/40">Infiltra rumores secretos y soborna concejales influyentes.</p>

              <button 
                onClick={() => {
                  if (player.gold >= 500) {
                    player.gold -= 500;
                    showCathedralMsg('✓ Favor político reclamado.');
                  }
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-emerald-400 font-bold text-xs rounded-xl cursor-pointer"
              >
                Reclamar Favor Político (500 DUC)
              </button>
            </div>
          </div>
        )}

        {/* M. OFICINA COMERCIAL (TRADING OFFICE) */}
        {selectedElement === 'trading_office' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#f0c040]/20 pb-3">
                <div>
                  <p className="text-[9px] text-[#f0c040] font-bold uppercase tracking-widest">Oficina Comercial</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Autocomercio</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              {cathedralMsg && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center rounded font-semibold">
                  {cathedralMsg}
                </div>
              )}

              <p className="text-[10px] text-white/40">Aplica mandatos comerciales automatizados de compra y venta para la oficina local.</p>

              {player.tradingOffices?.[currentCityId] ? (
                <div className="space-y-3 p-3 bg-slate-900/60 rounded-xl border border-white/5">
                  <div className="text-xs text-white/60">Políticas automáticas activas en {cityName}.</div>
                  <button 
                    onClick={() => {
                      showCathedralMsg('Políticas de autocomercio actualizadas.');
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-lg cursor-pointer"
                  >
                    Guardar Configuración
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-white/50">No posees ninguna oficina comercial en esta ciudad para automatizar el comercio.</p>
                  <button 
                    onClick={() => {
                      const success = engine.engine.buildTradingOffice();
                      if (success) {
                        showCathedralMsg('✓ Oficina comercial construida con éxito.');
                      } else {
                        showCathedralMsg('Error: Se requieren 60t Ladrillos, 20t Madera y 10t Herramientas en tu barco.');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase cursor-pointer border-0"
                  >
                    Construir Oficina
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* N. ARMERO (WEAPON SMITH) */}
        {selectedElement === 'weapon_smith' && (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#f0c040]/20 pb-3">
                <div>
                  <p className="text-[9px] text-[#f0c040] font-bold uppercase tracking-widest">Armero</p>
                  <h2 className="text-base font-black text-white font-serif uppercase">Arsenal Naval</h2>
                </div>
                <button onClick={() => setSelectedElement(null)} className="text-white/40 hover:text-white text-xs cursor-pointer font-bold bg-transparent border-0">[VOLVER]</button>
              </div>

              {cathedralMsg && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center rounded font-semibold">
                  {cathedralMsg}
                </div>
              )}

              <p className="text-[10px] text-white/40">Abastécete de armamento pesado y guarnición de defensa contra asaltos piratas.</p>

              <div className="space-y-2">
                {[
                  { id: 'cannons', name: 'Cañones ligeros', price: 1500 },
                  { id: 'muskets', name: 'Mosquetes de abordaje', price: 800 },
                ].map(w => (
                  <div key={w.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{w.name}</span>
                    <button 
                      onClick={() => {
                        if (player.gold >= w.price) {
                          player.gold -= w.price;
                          showCathedralMsg(`✓ Armamento comprado.`);
                        } else {
                          showCathedralMsg('Oro insuficiente.');
                        }
                      }}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500 border border-amber-500/35 hover:text-black font-black text-[9px] cursor-pointer"
                    >
                      {w.price} DUC
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .isometric-grid {
            background-image: 
                linear-gradient(30deg, rgba(212, 175, 55, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(212, 175, 55, 0.03) 87.5%, rgba(212, 175, 55, 0.03)),
                linear-gradient(150deg, rgba(212, 175, 55, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(212, 175, 55, 0.03) 87.5%, rgba(212, 175, 55, 0.03)),
                linear-gradient(30deg, rgba(212, 175, 55, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(212, 175, 55, 0.03) 87.5%, rgba(212, 175, 55, 0.03)),
                linear-gradient(150deg, rgba(212, 175, 55, 0.03) 12%, transparent 12.5%, transparent 87%, rgba(212, 175, 55, 0.03) 87.5%, rgba(212, 175, 55, 0.03)),
                linear-gradient(60deg, rgba(212, 175, 55, 0.01) 25%, transparent 25.5%, transparent 75%, rgba(212, 175, 55, 0.01) 75.5%, rgba(212, 175, 55, 0.01)),
                linear-gradient(60deg, rgba(212, 175, 55, 0.01) 25%, transparent 25.5%, transparent 75%, rgba(212, 175, 55, 0.01) 75.5%, rgba(212, 175, 55, 0.01));
            background-size: 80px 140px;
        }
      `}</style>
    </div>
  )
}
