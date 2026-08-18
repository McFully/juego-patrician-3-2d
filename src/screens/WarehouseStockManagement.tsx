import { useLocation } from 'wouter'
import { useState } from 'react'
import { useGame } from '../engine/GameProvider'
import { ASSETS } from '../utils/proceduralAssets'
import db from '../database/index'
const { GOODS } = db

const ICONS = ['science', 'forest', 'apparel', 'grain', 'liquor', 'bakery_dining', 'iron', 'hive', 'hardware', 'water', 'diamond', 'local_shipping', 'construction', 'set_meal', 'skillet', 'factory', 'workspace_premium', 'inventory_2', 'format_color_fill', 'grass']

export function WarehouseStockManagement() {
  const [, setLocation] = useLocation()
  const { state, engine } = useGame()
  const sim = state?.simulation
  const currentCityId = state?.player?.currentCityId || 'lubeck'
  const cityState = sim?.cities?.[currentCityId]
  const prices = cityState?.prices || {}
  const [sliders, setSliders] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState('')

  const warehouseGoods = GOODS.slice(0, 6)

  const handleSliderChange = (goodId: string, value: number) => {
    setSliders({...sliders, [goodId]: value})
  }

  const handleBuy = (goodId: string) => {
    try {
      const result = engine.buyGood(goodId, Math.round((sliders[goodId] || 10) / 10) + 1)
      setFeedback(typeof result === 'string' ? result : 'Compra exitosa')
    } catch { setFeedback('Error al comprar') }
  }

  const handleVender = (goodId: string) => {
    try {
      const qty = Math.max(1, Math.round((sliders[goodId] || 10) / 10))
      const result = engine.sellGood(goodId, qty)
      setFeedback(result ? 'Venta exitosa' : 'Error: No hay suficiente stock')
    } catch { setFeedback('Error al vender') }
  }

  return (
    <>
    
<img alt="Vista del Puerto Estratégico" className="harbor-bg" data-alt="Una vista cinematográfica del puerto oscuro por la noche bajo un cielo báltico frío, con siluetas de cogas hanseáticas atracadas en un muelle de piedra. El agua azul profundo refleja la luz dorada parpadeante de los faroles distantes de los almacenes y una pálida luna creciente. La atmósfera es misteriosa y tranquila, con espesa niebla rodando desde el mar, capturando perfectamente la estética glassmorphism marítima de un imperio mercante medieval." src={ASSETS.CITY_BG}/>

<nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-base bg-primary-container/60 dark:bg-primary-container/60 backdrop-blur-xl border-b border-on-surface/10 shadow-xl">
<div className="flex items-center gap-sm">
<span className="font-headline-lg text-headline-lg font-black text-tertiary-fixed tracking-tight">Hanseatic Strategos</span>
</div>
<div className="hidden md:flex gap-lg items-center">
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 cursor-pointer" onClick={() => setLocation('/world-map')}>Mapa Mundial</button>
<button className="text-tertiary-fixed font-bold border-b-2 border-tertiary-fixed pb-1 cursor-pointer" onClick={() => setLocation('/ledger')}>Libro Mayor</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 cursor-pointer" onClick={() => setLocation('/convoy-manager')}>Convoy</button>
<button className="text-on-surface-variant font-medium hover:text-tertiary-fixed transition-colors duration-200 cursor-pointer" onClick={() => setLocation('/market')}>Mercado</button>
</div>
<div className="flex items-center gap-md">
<button className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform" data-icon="notifications" aria-label="Notificaciones">notifications</button>
<button className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform" data-icon="help" aria-label="Ayuda">help</button>
<button className="material-symbols-outlined text-tertiary-fixed scale-105 active:scale-95 transition-transform" data-icon="settings" aria-label="Configuración">settings</button>
<div className="w-10 h-10 rounded-full border-2 border-tertiary-fixed overflow-hidden">
<img alt="Retrato del Gobernador" src={ASSETS.GOVERNOR}/>
</div>
</div>
</nav>

<main className="max-w-7xl mx-auto px-margin space-y-gutter h-screen overflow-hidden pt-[72px] overflow-x-hidden">

<header className="flex flex-col md:flex-row justify-between items-end gap-md">
<div>
<h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Almacén Central</h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Gestiona tus reservas en el Puerto de Lübeck. Controla el deterioro y asigna recursos para el consumo local o el comercio exterior.</p>
</div>
<div className="glass-panel rounded-xl p-md flex flex-wrap gap-lg min-w-0 md:min-w-[320px]">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">CAPACIDAD DE ALMACENAMIENTO</span>
<div className="flex items-center gap-base mt-xs">
<div className="w-32 h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-secondary w-[78%] transition-all duration-1000"></div>
</div>
<span className="font-title-md text-title-md text-on-surface">78%</span>
</div>
<span className="font-label-sm text-label-sm text-secondary mt-1">1,560 / 2,000 Toneladas</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">RIESGO DE DETERIORO</span>
<div className="flex items-center gap-xs mt-xs text-error">
<span className="material-symbols-outlined" data-icon="warning">warning</span>
<span className="font-title-md text-title-md">MODERADO</span>
</div>
</div>
</div>
</header>

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<div className="md:col-span-4 glass-panel-active rounded-xl p-md flex flex-col justify-between hover:scale-[1.01] transition-transform cursor-pointer">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-sm">
<div className="w-12 h-12 rounded-lg bg-tertiary-fixed/20 flex items-center justify-center text-tertiary-fixed">
<span className="material-symbols-outlined text-[32px]" data-icon="science">science</span>
</div>
<div>
<h3 className="font-title-md text-title-md text-tertiary-fixed">Sal</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">MINAS DE LUNEBURGO</span>
</div>
</div>
<span className="px-sm py-xs bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm">ESTABLE</span>
</div>
<div className="space-y-sm mb-lg">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface-variant">Reservas:</span>
<span className="text-on-surface font-bold">450 Unidades</span>
</div>
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface-variant">Valor de Mercado:</span>
<span className="text-tertiary-fixed font-bold">12.4 Oro/Unidad</span>
</div>
</div>
<div className="space-y-base">
<div className="flex justify-between items-center mb-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Uso Personal</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Venta al Mercado</span>
</div>
<input className="custom-slider" max="100" min="0" type="range" value="30" aria-label="Distribución de sal entre uso personal y venta al mercado"/>
<p className="font-label-sm text-label-sm text-center text-on-surface-variant mt-2 italic">30% Reservado para Salazón</p>
</div>
</div>

<div className="md:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between hover:scale-[1.01] transition-transform">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-sm">
<div className="w-12 h-12 rounded-lg bg-on-surface-variant/10 flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-[32px]" data-icon="forest">forest</span>
</div>
<div>
<h3 className="font-title-md text-title-md text-on-surface">Madera Dura</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">MADERA NÓRDICA</span>
</div>
</div>
<span className="px-sm py-xs bg-surface-variant text-on-surface-variant rounded-full font-label-sm text-label-sm">SECO</span>
</div>
<div className="space-y-sm mb-lg">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface-variant">Existencias:</span>
<span className="text-on-surface font-bold">820 Unidades</span>
</div>
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface-variant">Demanda del Astillero:</span>
<span className="text-secondary font-bold">ALTA</span>
</div>
</div>
<div className="space-y-base">
<div className="flex justify-between items-center mb-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Bloquear</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Vender</span>
</div>
<input className="custom-slider" max="100" min="0" type="range" value="80" aria-label="Distribución de madera entre bloqueo y venta"/>
<p className="font-label-sm text-label-sm text-center text-on-surface-variant mt-2 italic">80% Bloqueado para Expansión de la Flota</p>
</div>
</div>

<div className="md:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between hover:scale-[1.01] transition-transform">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-sm">
<div className="w-12 h-12 rounded-lg bg-on-surface-variant/10 flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-[32px]" data-icon="apparel">apparel</span>
</div>
<div>
<h3 className="font-title-md text-title-md text-on-surface">Lana</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">IMPORTACIONES FLAMENCAS</span>
</div>
</div>
<span className="px-sm py-xs bg-error-container text-on-error-container rounded-full font-label-sm text-label-sm">RIESGO DE HUMEDAD</span>
</div>
<div className="space-y-sm mb-lg">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface-variant">Existencias:</span>
<span className="text-on-surface font-bold">120 Unidades</span>
</div>
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface-variant">Tasa de Deterioro:</span>
<span className="text-error font-bold">2.1% / Semana</span>
</div>
</div>
<div className="space-y-base">
<div className="flex justify-between items-center mb-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Bloquear</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Vender</span>
</div>
<input className="custom-slider" max="100" min="0" type="range" value="10" aria-label="Distribución de lana entre bloqueo y venta"/>
<p className="font-label-sm text-label-sm text-center text-on-surface-variant mt-2 italic">Liquidando Existencias Húmedas Inmediatamente</p>
</div>
</div>

<div className="md:col-span-8 glass-panel rounded-xl p-md relative overflow-hidden group">
<div className="absolute top-0 right-0 p-md opacity-20 group-hover:opacity-40 transition-opacity">
<span className="material-symbols-outlined text-[120px]" data-icon="bakery_dining">bakery_dining</span>
</div>
<div className="relative z-10 flex flex-col h-full">
<div className="flex justify-between items-start mb-lg">
<div className="flex items-center gap-sm">
<div className="w-12 h-12 rounded-lg bg-on-surface-variant/10 flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-[32px]" data-icon="grain">grain</span>
</div>
<div>
<h3 className="font-title-md text-title-md text-on-surface">Grano</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">EXISTENCIAS DE LA CUENCA DEL VÍSTULA</span>
</div>
</div>
<div className="flex gap-base">
<button className="bg-tertiary text-on-tertiary px-md py-xs rounded-lg font-label-sm text-label-sm font-bold uppercase hover:scale-105 transition-transform">Distribución de Emergencia</button>
</div>
</div>
<div className="grid grid-cols-3 gap-md mb-xl">
<div className="bg-surface-container rounded-lg p-sm border border-outline-variant/30">
<span className="font-label-sm text-label-sm text-on-surface-variant block mb-xs uppercase">Existencias</span>
<span className="font-headline-lg text-headline-lg text-on-surface">1,200 <span className="text-body-md text-on-surface-variant">Toneladas</span></span>
</div>
<div className="bg-surface-container rounded-lg p-sm border border-outline-variant/30">
<span className="font-label-sm text-label-sm text-on-surface-variant block mb-xs uppercase">Consumo</span>
<span className="font-headline-lg text-headline-lg text-secondary">-45 <span className="text-body-md text-on-surface-variant">T/S</span></span>
</div>
<div className="bg-surface-container rounded-lg p-sm border border-outline-variant/30">
<span className="font-label-sm text-label-sm text-on-surface-variant block mb-xs uppercase">Días Restantes</span>
<span className="font-headline-lg text-headline-lg text-on-surface">26 <span className="text-body-md text-on-surface-variant">Días</span></span>
</div>
</div>
<div className="mt-auto">
<div className="flex justify-between items-center mb-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Consumo Interno</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Ventas de Exportación</span>
</div>
<input className="custom-slider" max="100" min="0" type="range" value="55" aria-label="Distribución de grano entre consumo interno y exportación"/>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-sm">Balance: 55% reservado para producción local de pan. 45% destinado a la ruta comercial de Danzig.</p>
</div>
</div>
</div>

<div className="md:col-span-4 space-y-gutter">
<div className="glass-panel rounded-xl p-md border-l-4 border-tertiary">
<h4 className="font-title-md text-title-md text-on-surface mb-sm">Órdenes de Logística</h4>
<div className="space-y-sm">
<button className="w-full flex justify-between items-center p-sm bg-surface-variant/30 rounded-lg hover:bg-surface-variant/50 transition-all text-left">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary" data-icon="local_shipping">local_shipping</span>
<span className="font-label-sm text-label-sm">Acelerar Carga del Barco</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="chevron_right" aria-hidden="true">chevron_right</span>
</button>
<button className="w-full flex justify-between items-center p-sm bg-surface-variant/30 rounded-lg hover:bg-surface-variant/50 transition-all text-left">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary" data-icon="pest_control">pest_control</span>
<span className="font-label-sm text-label-sm">Inspección de Plagas</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="chevron_right" aria-hidden="true">chevron_right</span>
</button>
<button className="w-full flex justify-between items-center p-sm bg-surface-variant/30 rounded-lg hover:bg-surface-variant/50 transition-all text-left">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-tertiary" data-icon="architecture">architecture</span>
<span className="font-label-sm text-label-sm">Ampliar Granero (Nivel 3)</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant" data-icon="chevron_right" aria-hidden="true">chevron_right</span>
</button>
</div>
</div>
<div className="glass-panel rounded-xl p-md flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-secondary text-[48px] mb-sm" data-icon="verified">verified</span>
<h4 className="font-title-md text-title-md text-on-surface">Eficiencia: 92%</h4>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Operaciones funcionando sin problemas. No se detectan cuellos de botella importantes.</p>
</div>
</div>
</div>
</main>


    <style>{`
.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(0, 31, 63, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(228, 228, 204, 0.1);
        }
        .glass-panel-active {
            background: rgba(0, 31, 63, 0.85);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
        body {
            background-color: #131407;
            color: #e4e4cc;
            font-family: 'Montserrat', sans-serif;
            overflow-x: hidden;
        }
        .custom-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            background: #343625;
            border-radius: 2px;
            outline: none;
        }
        .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #D4AF37;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid #001f3f;
        }
        .harbor-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            object-fit: cover;
            filter: brightness(0.4) contrast(1.1);
        }
    `}</style>
  </>
  )
}
