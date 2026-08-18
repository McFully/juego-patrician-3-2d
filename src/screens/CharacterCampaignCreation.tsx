import { useLocation } from 'wouter'
import { useState } from 'react'
import { useGame } from '../engine/GameProvider'

const PORTRAITS = [
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=80', // Mercader veterano
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80', // Consejero noble
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', // Patricio de la liga
]

const HISTORICAL_NAMES = [
  'Hendrik van der Porten',
  'Gottfried Wulbrand',
  'Wulf Wulflam',
  'Johann Lüneburg',
  'Lutbert von Lubeck',
  'Arnold de Visby',
  'Hinrich Castorp'
]

// 24 Hansa cities listing from Patrician III
const HANS_CITIES = [
  { id: 'lubeck', name: 'Lübeck' },
  { id: 'hamburg', name: 'Hamburgo' },
  { id: 'gdansk', name: 'Danzig' },
  { id: 'visby', name: 'Visby' },
  { id: 'riga', name: 'Riga' },
  { id: 'rostock', name: 'Rostock' },
  { id: 'stettin', name: 'Stettin' },
  { id: 'reval', name: 'Reval' },
  { id: 'london', name: 'Londres' },
  { id: 'bruges', name: 'Brujas' },
  { id: 'cologne', name: 'Colonia' },
  { id: 'bremen', name: 'Bremen' },
  { id: 'alborg', name: 'Alborg' },
  { id: 'oslo', name: 'Oslo' },
  { id: 'stockholm', name: 'Estocolmo' },
  { id: 'novgorod', name: 'Novgorod' },
  { id: 'torn', name: 'Torn' },
  { id: 'elbing', name: 'Elbing' },
  { id: 'konigsberg', name: 'Königsberg' },
  { id: 'pernau', name: 'Pernau' },
  { id: 'windau', name: 'Windau' },
  { id: 'ladoga', name: 'Ladoga' },
  { id: 'bergen', name: 'Bergen' },
  { id: 'malmo', name: 'Malmö' }
]

const SPECIALTIES = [
  { id: 'navigator', name: 'Navegante', desc: 'Comienza con mayor velocidad náutica y +2 Habilidad de Navegación', icon: 'explore' },
  { id: 'negotiator', name: 'Negociador', desc: 'Comienza con menores precios de compra y +2 Habilidad de Comercio', icon: 'handshake' },
  { id: 'mercenary', name: 'Mercenario', desc: 'Comienza con mayor puntería de cañones y +2 Habilidad de Combate', icon: 'shield_heart' },
]

const DIFFICULTY_LEVELS = [
  { id: 'trainee', name: 'Aprendiz', desc: 'IA lenta, piratas poco agresivos, abundantes recursos.' },
  { id: 'merchant', name: 'Mercader', desc: 'IA competitiva, eventos normales.' },
  { id: 'patrician', name: 'Patricio', desc: 'Dificultad difícil. Desafío económico real.' },
  { id: 'lord_mayor', name: 'Alcalde', desc: 'IA extremadamente agresiva, eventos muy frecuentes.' },
  { id: 'custom', name: 'Personalizada', desc: 'Ajusta los sliders inferiores a tu propio criterio.' }
]

const HERALDIC_COLORS = [
  { name: 'Rojo Imperial', hex: '#b91c1c' },
  { name: 'Azul Báltico', hex: '#1d4ed8' },
  { name: 'Verde Bosque', hex: '#047857' },
  { name: 'Amarillo Trigo', hex: '#d97706' },
  { name: 'Púrpura Real', hex: '#7c3aed' },
  { name: 'Negro Carbón', hex: '#1f2937' },
  { name: 'Blanco Nieve', hex: '#f3f4f6' },
  { name: 'Marrón Tierra', hex: '#78350f' }
]

const EMBLEMS = [
  { icon: 'sailing', name: 'Águila Imperial' },
  { icon: 'castle', name: 'León Guerrero' },
  { icon: 'anchor', name: 'Corona de la Liga' },
  { icon: 'shield', name: 'Barco Mercante' },
  { icon: 'shield_heart', name: 'Escudo de Armas' }
]

export function CharacterCampaignCreation() {
  const [, setLocation] = useLocation()
  const { engine } = useGame()
  
  // Basic attributes
  const [playerName, setPlayerName] = useState('Hendrik')
  const [playerSurname, setPlayerSurname] = useState('van der Porten')
  const [gender, setGender] = useState<'male' | 'female'>('male')

  // Heraldry
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedEmblem, setSelectedEmblem] = useState(0)

  // Town & specs
  const [selectedCity, setSelectedCity] = useState(0)
  const [selectedSpec, setSelectedSpec] = useState(1) // Negociador default
  const [difficultyType, setDifficultyType] = useState('merchant')

  // Custom sliders
  const [pirateAggression, setPirateAggression] = useState(30)
  const [iaTradeSkill, setIaTradeSkill] = useState(40)
  const [disasterFrequency, setDisasterFrequency] = useState(30)
  const [industryCost, setIndustryCost] = useState(50)
  const [startingGold, setStartingGold] = useState(30000)

  const handleStartGame = () => {
    const name = `${playerName} ${playerSurname}`.trim() || 'Comerciante'
    const city = HANS_CITIES[selectedCity].id

    // Start baseline game state via adapter
    engine.startNewGame(name, city)

    // Customize game properties directly in simulation reference
    const player = engine.engine.player as any
    if (player) {
      player.gold = difficultyType === 'custom' ? startingGold : (difficultyType === 'trainee' ? 50000 : difficultyType === 'merchant' ? 30000 : difficultyType === 'patrician' ? 15000 : 10000)
      player.specialty = SPECIALTIES[selectedSpec].id
      const p = player as any
      p['skills'] = {
        sailing: SPECIALTIES[selectedSpec].id === 'navigator' ? 5 : 2,
        trading: SPECIALTIES[selectedSpec].id === 'negotiator' ? 5 : 2,
        combat: SPECIALTIES[selectedSpec].id === 'mercenary' ? 5 : 2
      };

      // Add difficulty flags to server state
      (engine.engine.server.world as any).difficulty = {
        pirateAggression: difficultyType === 'custom' ? pirateAggression : (difficultyType === 'trainee' ? 10 : difficultyType === 'merchant' ? 40 : difficultyType === 'patrician' ? 70 : 100),
        iaTradeSkill: difficultyType === 'custom' ? iaTradeSkill : (difficultyType === 'trainee' ? 20 : difficultyType === 'merchant' ? 50 : difficultyType === 'patrician' ? 80 : 100),
        disasterFrequency: difficultyType === 'custom' ? disasterFrequency : (difficultyType === 'trainee' ? 10 : difficultyType === 'merchant' ? 40 : difficultyType === 'patrician' ? 70 : 100),
        industryCost: difficultyType === 'custom' ? industryCost : (difficultyType === 'trainee' ? 30 : difficultyType === 'merchant' ? 60 : difficultyType === 'patrician' ? 90 : 100),
      }
    }

    setLocation('/city-overview')
  }

  const handleRandomizeName = () => {
    const randomIdx = Math.floor(Math.random() * HISTORICAL_NAMES.length)
    const split = HISTORICAL_NAMES[randomIdx].split(' ')
    setPlayerName(split[0])
    setPlayerSurname(split.slice(1).join(' '))
  }

  const [selectedPortrait, setSelectedPortrait] = useState(0)

  return (
    <main className="w-full h-full bg-[#030408] flex items-center justify-center overflow-hidden select-none">
      
      {/* 16:9 Responsive Game Canvas Scaling Container */}
      <div 
        className="relative w-full h-full bg-cover bg-center shadow-2xl flex flex-col justify-between p-8"
        style={{ backgroundImage: "url('/images/campana_creacion.png')" }}
      >
        <div className="absolute inset-0 bg-slate-950/85 pointer-events-none" />

        {/* --- HEADER --- */}
        <header className="relative z-10 flex justify-between items-center border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-2xl">demography</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-amber-300 tracking-widest font-serif uppercase">Nueva Partida / Campaña</h1>
              <p className="text-white/40 text-[10px] mt-0.5">Establece los cimientos y condiciones de tu dinastía comercial en la Hansa.</p>
            </div>
          </div>
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-bold transition-all uppercase cursor-pointer"
          >
            Volver
          </button>
        </header>

        {/* --- THREE COLUMN GRID --- */}
        <div className="relative z-10 flex-1 my-4 grid grid-cols-12 gap-5 overflow-hidden items-stretch">
          
          {/* COLUMN 1: DATOS PERSONALES & RETRATO & SELLO */}
          <section className="col-span-4 bg-slate-950/80 border border-amber-500/20 rounded-xl p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <h2 className="text-amber-400 text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">badge</span> 1. Identidad y Retrato
              </h2>

              <div className="flex items-center gap-4">
                <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-amber-500/30 bg-black/40 flex-shrink-0">
                  <img className="w-full h-full object-cover" src={PORTRAITS[selectedPortrait]} alt="Retrato" />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                    <button onClick={() => setSelectedPortrait(prev => (prev - 1 + PORTRAITS.length) % PORTRAITS.length)} className="w-5 h-5 rounded bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer text-xs" aria-label="Retrato anterior">&lt;</button>
                    <button onClick={() => setSelectedPortrait(prev => (prev + 1) % PORTRAITS.length)} className="w-5 h-5 rounded bg-black/70 border border-white/20 text-white flex items-center justify-center cursor-pointer text-xs" aria-label="Siguiente retrato">&gt;</button>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <label className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mb-0.5">Nombre</label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                      className="w-full bg-slate-900 border border-amber-500/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      aria-label="Nombre del personaje"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mb-0.5">Apellido</label>
                    <input
                      type="text"
                      value={playerSurname}
                      onChange={e => setPlayerSurname(e.target.value)}
                      className="w-full bg-slate-900 border border-amber-500/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      aria-label="Apellido del personaje"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-black/30 p-2 rounded border border-white/5">
                <span className="text-[10px] text-white/40 font-bold uppercase">Género</span>
                <div className="flex gap-2">
                  <button onClick={() => setGender('male')} className={`px-2.5 py-1 rounded text-xs cursor-pointer ${gender === 'male' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-white/60'}`}>Masc.</button>
                  <button onClick={() => setGender('female')} className={`px-2.5 py-1 rounded text-xs cursor-pointer ${gender === 'female' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-white/60'}`}>Fem.</button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <button onClick={handleRandomizeName} className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider cursor-pointer rounded">
                  [ Generar Nombre Histórico ]
                </button>
              </div>
            </div>

            {/* Sello Familiar */}
            <div className="space-y-3 mt-4 border-t border-white/10 pt-3">
              <h3 className="text-[10px] text-white/50 font-bold uppercase tracking-wider">2. Sello Heráldico</h3>
              
              <div>
                <label className="text-[8px] text-white/40 font-bold uppercase block mb-1">Color Principal</label>
                <div className="grid grid-cols-8 gap-1">
                  {HERALDIC_COLORS.map((c, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      style={{ backgroundColor: c.hex }}
                      className={`h-6 rounded cursor-pointer border ${selectedColor === idx ? 'border-amber-300 ring-1 ring-amber-400 scale-105 shadow' : 'border-black/40 hover:scale-105'}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[8px] text-white/40 font-bold uppercase block mb-1">Emblema Central</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {EMBLEMS.map((e, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedEmblem(idx)}
                      className={`p-1.5 rounded cursor-pointer border flex items-center justify-center ${selectedEmblem === idx ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-black/30 border-white/5 hover:bg-black/50 text-white/40'}`}
                      title={e.name}
                    >
                      <span className="material-symbols-outlined text-base">{e.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* COLUMN 2: CIUDAD NATAL & HABILIDAD */}
          <section className="col-span-4 bg-slate-950/80 border border-amber-500/20 rounded-xl p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <h2 className="text-amber-400 text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">home_pin</span> 3. Oficina/Puerto Natal
              </h2>

              <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {HANS_CITIES.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCity(idx)}
                    className={`text-left px-2 py-1.5 rounded border transition-all cursor-pointer text-xs font-semibold truncate
                      ${selectedCity === idx 
                        ? 'bg-amber-500/10 border-amber-400 text-amber-200' 
                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 mt-4 border-t border-white/10 pt-3">
              <h3 className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2">4. Habilidad Familiar</h3>
              <div className="space-y-2">
                {SPECIALTIES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSpec(idx)}
                    className={`w-full text-left p-2.5 rounded border transition-all cursor-pointer flex gap-2.5 items-center
                      ${selectedSpec === idx 
                        ? 'bg-amber-500/10 border-amber-400 text-amber-200' 
                        : 'bg-black/30 border-white/5 text-white/60 hover:bg-black/50'
                      }`}
                  >
                    <span className="material-symbols-outlined text-base text-amber-400">{s.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold">{s.name}</div>
                      <div className="text-[8px] text-white/40 leading-normal mt-0.5">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* COLUMN 3: DIFICULTAD Y CONFIGURACIÓN */}
          <section className="col-span-4 bg-slate-950/80 border border-amber-500/20 rounded-xl p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <h2 className="text-amber-400 text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">tune</span> 5. Nivel de Dificultad
              </h2>

              <div className="grid grid-cols-2 gap-1.5">
                {DIFFICULTY_LEVELS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDifficultyType(d.id)}
                    className={`px-2.5 py-1.5 rounded border text-[10px] font-bold tracking-wider cursor-pointer uppercase transition-all
                      ${difficultyType === d.id
                        ? 'bg-amber-500 text-black font-black border-amber-400 shadow'
                        : 'bg-black/30 border-white/5 text-white/60 hover:bg-black/50'
                      }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              <p className="text-[9px] text-white/40 leading-relaxed bg-black/20 p-2 rounded border border-white/5">
                {DIFFICULTY_LEVELS.find(d => d.id === difficultyType)?.desc}
              </p>
            </div>

            {/* Custom Sliders Section */}
            {difficultyType === 'custom' && (
              <div className="space-y-3 mt-4 border-t border-white/10 pt-3">
                <h3 className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Parámetros Personalizados</h3>
                
                {/* Pirate Aggression */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[8px] font-bold text-white/40">
                    <span>AGRESIVIDAD PIRATA</span>
                    <span className="text-amber-300">{pirateAggression}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={pirateAggression} onChange={e => setPirateAggression(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-1 rounded bg-white/10" aria-label="Agresividad pirata" />
                </div>

                {/* IA trade skill */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[8px] font-bold text-white/40">
                    <span>EFICIENCIA COMERCIAL IA</span>
                    <span className="text-amber-300">{iaTradeSkill}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={iaTradeSkill} onChange={e => setIaTradeSkill(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-1 rounded bg-white/10" aria-label="Eficiencia comercial IA" />
                </div>

                {/* Disaster Frequency */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[8px] font-bold text-white/40">
                    <span>FRECUENCIA DESASTRES</span>
                    <span className="text-amber-300">{disasterFrequency}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={disasterFrequency} onChange={e => setDisasterFrequency(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-1 rounded bg-white/10" aria-label="Frecuencia de desastres" />
                </div>

                {/* Production Cost */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[8px] font-bold text-white/40">
                    <span>COSTES DE PRODUCCIÓN</span>
                    <span className="text-amber-300">{industryCost}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={industryCost} onChange={e => setIndustryCost(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-1 rounded bg-white/10" aria-label="Costes de producción" />
                </div>

                {/* Gold */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[8px] font-bold text-white/40">
                    <span>ORO INICIAL</span>
                    <span className="text-amber-300">{startingGold.toLocaleString()} G</span>
                  </div>
                  <input type="range" min="10000" max="100000" step="5000" value={startingGold} onChange={e => setStartingGold(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-1 rounded bg-white/10" aria-label="Oro inicial" />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* --- FOOTER --- */}
        <footer className="relative z-10 flex justify-between items-center border-t border-amber-500/20 pt-3">
          <div className="text-white/40 text-[10px] font-medium">
            Dinastía <span className="text-amber-300 font-bold font-serif">{playerName} {playerSurname}</span> natal de <span className="text-amber-300 font-bold">{HANS_CITIES[selectedCity].name}</span> · Sello: <span className="text-amber-300 font-bold">{HERALDIC_COLORS[selectedColor].name}</span>
          </div>
          <button 
            onClick={handleStartGame}
            className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs tracking-widest transition-all uppercase cursor-pointer border-0 shadow-lg shadow-amber-950/60"
          >
            Comenzar Campaña
          </button>
        </footer>
      </div>
    </main>
  )
}
