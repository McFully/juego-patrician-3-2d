import { useState } from 'react'
import { useLocation } from 'wouter'
import { useGame, usePlayer } from '../engine/GameProvider'

const BLESSING_OPTIONS = [
  { id: 'prayer', name: 'Oración y Bendición', cost: 0, effect: '+2 Reputación, +5 Moral de tripulación', icon: 'self_improvement', color: 'amber' },
  { id: 'alms',   name: 'Limosnas al Pueblo',  cost: 200, effect: '+8 Popularidad, +3 Reputación',         icon: 'volunteer_activism', color: 'emerald' },
  { id: 'grain',  name: 'Donar Grano',         cost: 0,   effect: 'Dona 10t de grano. +12 Popularidad',   icon: 'grass',              color: 'green' },
]

const REFUGEES = [
  { origin: 'Grupo de Visby', type: 'Refugiados', souls: 14, icon: 'groups', urgent: false },
  { origin: 'Hambruna Norteña', type: 'Hambrientos', souls: 42, icon: 'emergency', urgent: true },
  { origin: 'Marineros Desplazados', type: 'Ex-tripulantes', souls: 8, icon: 'sailing', urgent: false },
]

const EXPANSION_PHASES = [
  { phase: 1, name: 'Campanario Principal', cost: 8000, completed: true },
  { phase: 2, name: 'Nave Central (Ampliación)', cost: 15000, completed: true },
  { phase: 3, name: 'Cripta y Sacristía', cost: 12000, completed: false },
  { phase: 4, name: 'Torres Gemelas', cost: 22000, completed: false },
]

export function Cathedral() {
  const [, setLocation] = useLocation()
  const { engine, state: worldState } = useGame()
  const player = usePlayer()
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'>('ok')
  const [activeTab, setActiveTab] = useState<'altar'|'charity'|'expansion'>('altar')
  const [donateGold, setDonateGold] = useState(500)

  const currentCityId = player?.currentCityId || 'lubeck'
  const cityData = worldState?.simulation?.world?.cities?.[currentCityId]
  const cathedralInfo = cityData?.cathedral || { totalDonated: 0, upgradeLevel: 0 }

  if (!player) return null

  const flash = (text: string, type: 'ok'|'err' = 'ok') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleBlessing = (option: typeof BLESSING_OPTIONS[0]) => {
    if (option.cost > 0 && player.gold < option.cost) {
      flash(`Fondos insuficientes. Necesitas ${option.cost} DUC`, 'err')
      return
    }
    // We can use donateToCathedral for alms too
    if (option.id === 'alms') {
      engine.donateToCathedral(200)
    }
    flash(`✓ ${option.name}: ${option.effect}`, 'ok')
  }

  const handleDonate = () => {
    if (player.gold < donateGold) {
      flash('Fondos insuficientes para la donación', 'err')
      return
    }
    const repGain = engine.donateToCathedral(donateGold)
    if (repGain > 0) {
      flash(`✓ Has donado ${donateGold} DUC. Reputación en ${currentCityId.toUpperCase()} +${repGain.toFixed(1)}.`, 'ok')
    } else {
      flash('Error al procesar la donación.', 'err')
    }
  }

  const handleFund = (phase: typeof EXPANSION_PHASES[0]) => {
    // Upgrades are currently automatic in the engine checkUpgrade() based on cityChest
    // but we can simulate a player contribution here.
    if (player.gold < phase.cost) {
      flash(`Fondos insuficientes. Necesitas ${phase.cost.toLocaleString()} DUC`, 'err')
      return
    }
    engine.donateToCathedral(phase.cost)
    flash(`✓ Has contribuido ${phase.cost.toLocaleString()} DUC a la expansión: ${phase.name}.`, 'ok')
  }

  const TABS = [
    { id: 'altar', label: 'Altar y Oración', icon: 'self_improvement' },
    { id: 'charity', label: 'Caridad', icon: 'volunteer_activism' },
    { id: 'expansion', label: 'Expansión', icon: 'church' },
  ] as const

  const getPhaseStatus = (phase: number) => {
    if (phase <= cathedralInfo.upgradeLevel) return true;
    return false;
  }

  return (
    <main className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900 flex flex-col select-none">

      {/* ── HEADER ── */}
      <header className="flex-none px-6 py-3 border-b border-amber-500/20 bg-black/40 backdrop-blur-sm flex flex-wrap items-center gap-4">
        <button
          onClick={() => setLocation('/city-overview')}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-white/70 hover:text-white text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">church</span>
          <h1 className="text-xl font-bold text-amber-300 tracking-wide">Catedral de Santa María</h1>
          <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">Lübeck · Diócesis Báltica</span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-purple-300">
            <span className="material-symbols-outlined text-base">stars</span>
            <span className="text-xs">Devoción: 78/100</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span className="font-mono font-bold">{player.gold.toLocaleString()} DUC</span>
          </div>
        </div>
      </header>

      {/* ── TOAST ── */}
      {msg && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${msgType === 'ok' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {msg}
        </div>
      )}

      {/* ── BODY ── */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 p-4">

        {/* LEFT: TABS + CONTENT */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/10">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-semibold transition-all border-b-2 ${
                  activeTab === t.id
                    ? 'border-amber-500 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ALTAR */}
          {activeTab === 'altar' && (
            <div className="space-y-3">
              <p className="text-white/40 text-sm">Acércate al altar para recibir bendiciones y reforzar tu fe.</p>
              {BLESSING_OPTIONS.map(b => (
                <div key={b.id} className="glass-panel rounded-xl p-5 flex items-center gap-4">
                  <div className={`flex-none w-12 h-12 rounded-xl flex items-center justify-center ${b.color === 'amber' ? 'bg-amber-500/20 text-amber-400' : b.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : b.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    <span className="material-symbols-outlined">{b.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{b.name}</div>
                    <div className="text-white/40 text-sm mt-0.5">{b.effect}</div>
                  </div>
                  <div className="text-right">
                    {b.cost > 0 ? (
                      <div className="text-amber-300 font-mono font-bold text-sm mb-1">{b.cost} DUC</div>
                    ) : (
                      <div className="text-emerald-400 text-sm font-semibold mb-1">Gratuito</div>
                    )}
                    <button
                      onClick={() => handleBlessing(b)}
                      className="px-4 py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm font-bold transition-all"
                    >REALIZAR</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CARIDAD */}
          {activeTab === 'charity' && (
            <div className="space-y-4">
              <p className="text-white/40 text-sm">Los refugiados y necesitados aguardan tu ayuda. La caridad es vista por toda la ciudad.</p>

              {/* Refugees */}
              <div className="space-y-2">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Personas en Necesidad</h3>
                {REFUGEES.map((r, i) => (
                  <div key={i} className={`glass-panel rounded-xl p-4 flex items-center gap-4 ${r.urgent ? 'border border-red-500/30' : ''}`}>
                    <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center ${r.urgent ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      <span className="material-symbols-outlined text-base">{r.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{r.origin}</div>
                      <div className="text-white/40 text-xs">{r.type} · {r.souls} almas</div>
                    </div>
                    {r.urgent && (
                      <span className="text-xs text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-full">URGENTE</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Donation */}
              <div className="glass-panel rounded-xl p-5 space-y-4">
                <h3 className="text-amber-300 font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">volunteer_activism</span>
                  Donación en Oro
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={100}
                    max={Math.min(player.gold, 10000)}
                    step={100}
                    value={donateGold}
                    onChange={e => setDonateGold(Number(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-amber-300 font-mono font-bold w-24 text-right">{donateGold.toLocaleString()} DUC</span>
                </div>
                <div className="text-white/40 text-xs">
                  Impacto estimado: <span className="text-emerald-400">+{Math.round(donateGold / 100)} Popularidad</span>
                  {' · '}
                  <span className="text-purple-400">+{Math.round(donateGold / 200)} Reputación</span>
                </div>
                <button
                  onClick={handleDonate}
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
                >DONAR AL PUEBLO</button>
              </div>
            </div>
          )}

          {/* EXPANSIÓN */}
          {activeTab === 'expansion' && (
            <div className="space-y-3">
              <p className="text-white/40 text-sm">Financia la construcción y ampliación de la catedral para aumentar la devoción de la ciudad.</p>
              {EXPANSION_PHASES.map(ph => {
                const isCompleted = getPhaseStatus(ph.phase)
                return (
                  <div key={ph.phase} className={`glass-panel rounded-xl p-5 flex items-center gap-4 ${isCompleted ? 'opacity-60' : ''}`}>
                    <div className={`flex-none w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      <span className="material-symbols-outlined">{isCompleted ? 'check_circle' : 'construction'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">Fase {ph.phase}: {ph.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">
                        {isCompleted ? 'Completada' : `Requiere: ${ph.cost.toLocaleString()} DUC`}
                      </div>
                    </div>
                    {!isCompleted && (
                      <button
                        onClick={() => handleFund(ph)}
                        className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-sm font-bold transition-all"
                      >FINANCIAR</button>
                    )}
                    {isCompleted && (
                      <span className="text-emerald-400 text-sm font-semibold">✓ Construido</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="w-full md:w-60 flex flex-col gap-3">
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-indigo-300 font-bold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">bar_chart</span>
              Tu Fe y Reputación
            </h3>
            {[
              { label: 'Devoción', value: 78, color: 'bg-indigo-500' },
              { label: 'Popularidad', value: 62, color: 'bg-amber-500' },
              { label: 'Reputación',  value: 85, color: 'bg-purple-500' },
            ].map(s => (
              <div key={s.label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">{s.label}</span>
                  <span className="text-white/70">{s.value}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-xl p-4 flex-1">
            <h3 className="text-amber-300 font-bold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">format_quote</span>
              Escrituras del Día
            </h3>
            <p className="text-white/40 text-xs italic leading-relaxed">
              "El comerciante justo prospera con la bendición de Dios. Aquel que da al necesitado, presta al Señor."
            </p>
            <p className="text-amber-400/60 text-xs mt-2">— Proverbios 19:17</p>
          </div>
        </div>
      </div>
    </main>
  )
}
