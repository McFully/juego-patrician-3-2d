# PLAN DE IMPLEMENTACIÓN TOTAL - HANSEATIC STRATEGOS
## Recreación completa de 44 pantallas desde cero

**Proyecto:** `c:\Users\Aritz\Desktop\Proyectos OpenCode\Patrician 3 2D`  
**Stack:** React + TypeScript + Vite + Tailwind CSS + Wouter (routing)  
**Fuente de verdad visual:** carpeta `copia/` (PNG de referencia por cada pantalla)

---

## 0. CONTEXTO TÉCNICO CRÍTICO

### Arquitectura del motor de render

```tsx
// App.tsx - el contenedor raíz SIEMPRE es 1920×1080 escalado
<div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none">
  <div 
    className="relative origin-center flex-shrink-0 bg-background overflow-hidden"
    style={{ width: '1920px', height: '1080px', transform: `scale(${scale})` }}
  >
    <HUD />
    <Switch>
      {/* rutas aquí */}
    </Switch>
    <NavigationFooter />
  </div>
</div>
```

**REGLA DE ORO:** Cada pantalla DEBE usar `w-full h-full` como raíz, nunca `w-screen h-screen`. El motor escala el contenedor 1920×1080 para adaptarse a cualquier resolución.

### Rutas existentes (App.tsx)
| Ruta | Componente |
|------|-----------|
| `/` | TitleScreen |
| `/world-map` | WorldMap |
| `/city-overview` | CityOverview |
| `/new-campaign` | CharacterCampaignCreation |
| `/settings` | SettingsCareerLog |
| `/tavern` | Tavern |
| `/shipyard` | Shipyard |
| `/trading-office` | TradingOffice |
| `/town-hall` | TownHall |
| `/ledger` | FinancialLedger |
| `/merchant-guild` | MerchantGuild |
| `/market` | MarketHall |
| `/money-lender` | MoneyLender |
| `/cathedral` | Cathedral |
| `/bath-house` | TheBathHouse |
| `/weapon-smith` | WeaponSmith |
| `/trade-routes` | TradeRouteEditor |
| `/trade-routes-mobile` | TradeRouteEditorMobile |
| `/convoy-manager` | ConvoyManagerModal |
| `/inspection` | VesselInspection |
| `/warehouse` | WarehouseStockManagement |
| `/missions` | HanseaticLeagueMissionBoard |
| `/expedition` | ExpeditionMap |
| `/encounter` | AtSeaEncounterMenu |
| `/alerts` | AlertsEventOverlays |
| `/messages` | GlobalMessageCenter |
| `/building-place` | BuildingPlacementInteraction |
| `/building-stats` | BuildingStatistics |
| `/construction` | ConstructionActionWheel |
| `/architects-guild` | ArchitectsGuildResearch |
| `/diet-hall` | TheHanseaticDietHall |
| `/siege` | CitySiegeDefense |
| `/combat` | CombatArena |
| `/strategy` | HanseaticMerchantStrategySystem |
| `/exile` | PoliticalExileState |
| `/bankruptcy` | BankruptcyLiquidationState |
| `/victory` | VictoryHistoricalSummary |
| `/legacy` | TheMerchantSLegacy |
| `/winter` | BalticWinterLogistics |
| `/cathedral-works` | CathedralWorksCharity |
| `/landing` | OfficialLandingPage |
| `/guide` | MerchantGuideOnboarding |
| `/council-mobile` | CouncilHallMobile |

---

## 1. SISTEMA DE DISEÑO COMPLETO

### Paleta de colores exacta
```
FONDOS:
  bg-main:          #0a0e1a   (negro azulado profundo - fondo de todas las pantallas)
  bg-panel:         #0d1526   (panel primario)
  bg-panel-raised:  #111c35   (panel elevado / card)
  bg-panel-input:   #0a1428   (inputs, sliders, áreas de entrada)
  bg-topbar:        #060d1a   (barra superior)
  bg-bottombar:     #060d1a   (barra inferior)

DORADO / ACENTO:
  gold-primary:     #f0c040   (texto dorado, iconos, bordes activos)
  gold-secondary:   #e8b820   (botones dorado hover)
  gold-btn-bg:      #f0c040   (fondo botón primario)
  gold-dim:         rgba(240,192,64,0.15)  (bordes de panel)
  gold-dim2:        rgba(240,192,64,0.2)   (bordes topbar/bottombar)
  gold-dim3:        rgba(240,192,64,0.3)   (bordes card hover)

TEXTO:
  text-cream:       #e8dcc8   (texto principal - crema cálido)
  text-muted:       #8a9ab8   (texto secundario - gris azulado)
  text-white:       #ffffff   (títulos grandes de énfasis)

ESTADOS:
  green:            #22c55e   (positivo, income, activo)
  green-dark:       #15803d   (fondo badge verde)
  red:              #ef4444   (negativo, urgente, peligro)
  red-dark:         #991b1b   (fondo badge rojo)
  amber:            #f59e0b   (warning, moderado)
  blue-badge:       #1e3a5f   (badge azul neutro)

BORDES:
  border-panel:     border border-[rgba(240,192,64,0.15)]
  border-active:    border border-[#f0c040]
  border-subtle:    border border-white/10
```

### Tipografía
```
Font: Montserrat (ya cargada globalmente)

Clases de texto:
  título pantalla:    text-4xl font-black text-[#f0c040] tracking-tight
  título sección:     text-2xl font-bold text-[#f0c040]
  subtítulo:          text-sm text-[#8a9ab8] uppercase tracking-widest
  label caps:         text-xs font-semibold text-[#8a9ab8] uppercase tracking-wider
  body text:          text-sm text-[#e8dcc8]
  body muted:         text-xs text-[#8a9ab8]
  número grande:      text-3xl font-black text-[#f0c040]
  número verde:       text-xl font-bold text-[#22c55e]
  número rojo:        text-xl font-bold text-[#ef4444]
```

### Componentes reutilizables

#### TopNav (estándar)
```tsx
// Usar en TODAS las pantallas excepto: TitleScreen, PoliticalExileState, BankruptcyLiquidationState
<nav className="w-full h-12 bg-[#060d1a] border-b border-[rgba(240,192,64,0.2)] flex items-center justify-between px-6 flex-shrink-0 z-10">
  {/* Logo */}
  <span className="text-[#f0c040] font-black text-xl tracking-tight font-montserrat">
    Hanseatic Strategos
  </span>
  {/* Links centrales - varían por pantalla */}
  <div className="flex items-center gap-8 text-sm font-medium">
    <button onClick={() => setLocation('/world-map')} className="text-[#8a9ab8] hover:text-[#f0c040] transition-colors">Mapa Mundial</button>
    <button onClick={() => setLocation('/ledger')} className="text-[#8a9ab8] hover:text-[#f0c040] transition-colors">Libro Mayor</button>
    {/* link activo: */}
    <button className="text-[#f0c040] font-semibold border-b-2 border-[#f0c040] pb-1">Convoy</button>
    <button onClick={() => setLocation('/market')} className="text-[#8a9ab8] hover:text-[#f0c040] transition-colors">Mercado</button>
  </div>
  {/* Iconos derecha */}
  <div className="flex items-center gap-3">
    <button className="text-[#8a9ab8] hover:text-[#f0c040] text-lg">🔔</button>
    <button className="text-[#8a9ab8] hover:text-[#f0c040] text-lg">❓</button>
    <button className="text-[#8a9ab8] hover:text-[#f0c040] text-lg">⚙️</button>
    {/* Avatar */}
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0a1a2e] border border-[rgba(240,192,64,0.3)]" />
  </div>
</nav>
```

#### BottomNav (estándar)
```tsx
// 5 ítems: Mapa Mundial, Libro Mayor, Convoy (o Centro Urbano), Mercado, Concejo
// El ítem activo tiene: bg-[#f0c040] text-[#0a0e1a] rounded-xl
<nav className="w-full h-16 bg-[#060d1a] border-t border-[rgba(240,192,64,0.2)] flex items-center justify-around flex-shrink-0">
  {/* ítem inactivo */}
  <button onClick={() => setLocation('/world-map')} className="flex flex-col items-center gap-1 px-4 py-2 text-[#8a9ab8] hover:text-[#f0c040] transition-colors">
    <span className="text-xl">🌐</span>
    <span className="text-xs font-semibold">Mapa Mundial</span>
  </button>
  {/* ítem activo */}
  <button className="flex flex-col items-center gap-1 px-4 py-2 bg-[#f0c040] text-[#0a0e1a] rounded-xl font-bold">
    <span className="text-xl">⚓</span>
    <span className="text-xs font-semibold">Convoy</span>
  </button>
</nav>
```

#### Estructura de pantalla (template obligatorio)
```tsx
import { useLocation } from 'wouter'

export function NombrePantalla() {
  const [, setLocation] = useLocation()

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0e1a] overflow-hidden font-montserrat">
      {/* TopNav aquí si aplica */}
      <nav className="w-full h-12 bg-[#060d1a] border-b border-[rgba(240,192,64,0.2)] flex items-center justify-between px-6 flex-shrink-0">
        {/* ... */}
      </nav>

      {/* Contenido principal - SIEMPRE flex-1 overflow-hidden */}
      <main className="flex-1 overflow-hidden relative">
        {/* contenido */}
      </main>

      {/* BottomNav si aplica */}
      <nav className="w-full h-16 bg-[#060d1a] border-t border-[rgba(240,192,64,0.2)] flex items-center justify-around flex-shrink-0">
        {/* ... */}
      </nav>
    </div>
  )
}
```

#### Panel card estándar
```tsx
<div className="bg-[#0d1526] border border-[rgba(240,192,64,0.15)] rounded-xl p-4">
  {/* contenido */}
</div>
```

#### Botón primario (dorado)
```tsx
<button className="bg-[#f0c040] text-[#0a0e1a] font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#e8b820] transition-colors">
  TEXTO BOTÓN
</button>
```

#### Botón secundario (borde)
```tsx
<button className="border border-[#f0c040] text-[#f0c040] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[rgba(240,192,64,0.1)] transition-colors">
  Texto Botón
</button>
```

#### Botón ghost (gris)
```tsx
<button className="border border-[#8a9ab8] text-[#e8dcc8] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-white/5 transition-colors">
  Texto Botón
</button>
```

#### Barra de progreso
```tsx
<div className="w-full h-1.5 bg-[#0a1428] rounded-full overflow-hidden">
  <div className="h-full bg-[#f0c040] rounded-full" style={{ width: '65%' }} />
</div>
// variantes de color: bg-[#22c55e] (verde), bg-[#ef4444] (rojo), bg-[#f59e0b] (amarillo)
```

#### Avatar / Portrait placeholder
```tsx
// Pequeño (lista)
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0a1a2e] border-2 border-[rgba(240,192,64,0.3)] flex items-center justify-center text-[#f0c040] text-lg flex-shrink-0">
  ⚓
</div>

// Mediano (card de personaje)
<div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#1a2a4a] to-[#0a1220] border border-[rgba(240,192,64,0.2)] flex items-center justify-center text-[#f0c040] text-3xl">
  🧑
</div>

// Grande (portrait de personaje principal)
<div className="w-full h-full bg-gradient-to-b from-[#0d2040] to-[#060d1a] flex items-center justify-center rounded-lg">
  <span className="text-[#f0c040] opacity-30 text-9xl">🧑</span>
</div>
```

#### Barco / Ship placeholder
```tsx
<div className="w-full h-full bg-gradient-to-b from-[#0a1e3a] to-[#050c18] flex items-center justify-center rounded-lg">
  <span className="text-[#f0c040] opacity-25 text-8xl">⛵</span>
</div>
```

#### Badge de estado
```tsx
// Verde (positivo)
<span className="bg-[#15803d] text-[#22c55e] text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">ACTIVO</span>
// Rojo (urgente)
<span className="bg-[#991b1b] text-[#ef4444] text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">URGENTE</span>
// Dorado (neutral/info)
<span className="bg-[rgba(240,192,64,0.15)] text-[#f0c040] text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">INFO</span>
// Gris azulado (normal)
<span className="bg-[#1e3a5f] text-[#8a9ab8] text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">NEUTRO</span>
```

---

## 2. INSTRUCCIONES ABSOLUTAS

1. **NUNCA** usar imágenes externas - todo es CSS/gradientes/SVG/emojis
2. **NUNCA** scroll - `overflow-hidden` en todos los contenedores
3. **TODO** en español de España
4. **SIEMPRE** `w-full h-full flex flex-col` como raíz
5. **SIEMPRE** `flex-1 overflow-hidden` en el `<main>`
6. Exportar con `export function NombrePantalla()` - sin `default`
7. Importar `useLocation` de `wouter` para navegación
8. Después de cada archivo: ejecutar `npm run build` para validar

---

## 3. DESCRIPCIÓN DETALLADA DE CADA PANTALLA

### PANTALLA 01 - TitleScreen.tsx
**Ruta:** `/`  
**Archivo:** `src/screens/TitleScreen.tsx`  
**Sin TopNav, sin BottomNav**

**Layout:**
- Fondo: gradiente diagonal `from-[#060d1a] via-[#0a1428] to-[#060a12]` con overlay de niebla (pseudo-elemento con gradiente radial dorado tenue en esquina inferior derecha)
- Dos columnas: izquierda con menú (30% ancho), derecha vacía decorativa (70%)

**Columna izquierda (panel de menú):**
```
- Etiqueta pequeña uppercase: "EL IMPERIO MERCANTIL DEL BÁLTICO" (text-xs tracking-widest text-[#8a9ab8])
- Título grande dos líneas: "HANSEATIC" / "STRATEGOS" (text-6xl font-black text-[#f0c040] leading-none)
- Separador dorado (hr 2px bg-[#f0c040] w-16 my-6)
- Botón 1 - "Continuar Crónica" (botón dorado grande ancho completo):
    icono ▶ + texto + subtexto "Última partida: 1422, Distrito de Visby" (text-xs)
    onClick → setLocation('/city-overview')
- Botón 2 - "Nueva Campaña" (secundario borde) → setLocation('/new-campaign')
- Botón 3 - "Multijugador" (ghost gris)
- Botón 4 - "Crónicas" (ghost gris) → setLocation('/settings')
- Botón 5 - "Ajustes" (ghost gris) → setLocation('/settings')
- Separador
- Footer: "VERSIÓN 1.4.0-BETA" izquierda + "© 1400 CONSEJO HANSEÁTICO" derecha (text-xs text-[#8a9ab8]/50)
```

**Área derecha:**
- Texto decorativo: "ESTADO DEL SERVIDOR" + "● CONECTADO AL HUB DE LÜBECK" (text-xs text-[#f0c040]) en esquina inferior derecha

---

### PANTALLA 02 - WorldMap.tsx
**Ruta:** `/world-map`  
**TopNav:** logo + "Mapa Mundial" (activo), "Libro Mayor", "Convoy", "Mercado" + iconos derecha  
**Sin BottomNav estándar** (tiene barra de tiempo propia)

**Layout:** pantalla completa con sidebars y área de mapa central

**Sidebar izquierdo (280px, h-full, bg-[#060d1a] border-r border-[rgba(240,192,64,0.2)]):**
```
Panel Tesoro:
  - Icono banco + label "TESORO" (text-xs uppercase text-[#8a9ab8])
  - Cifra: "142.500" (text-3xl font-black text-[#f0c040])
  - Subtexto: "gulden" + "+1.240 / mes" text-[#22c55e]

Dos tarjetas fila:
  - "CONVOYES ACTIVOS 12/15" + "KONTORS 08" (text-xs bg-[#111c35] rounded)

Alerta roja:
  - Badge "⚠ AVISO ACTUAL" rojo
  - Texto: "Escasez de sal en Lübeck. Se esperan disturbios en 3 meses."
  - Botón "Tratar el Problema" (dorado)
```

**Área central del mapa (flex-1):**
```
Fondo: gradiente azul marino oscuro con textura sutil
  background: radial-gradient(ellipse at 40% 60%, #0a1e3a 0%, #060d1a 70%)

Nodos de ciudad (círculos con halo):
  - Lübeck (grande, dorado): izq-centro
    <div className="absolute left-[30%] top-[45%] cursor-pointer" onClick={() => setLocation('/city-overview')}>
      <div className="w-5 h-5 rounded-full bg-[#f0c040] shadow-[0_0_20px_rgba(240,192,64,0.6)]" />
      <span className="text-[#f0c040] text-xs font-bold mt-1 block text-center">Lübeck</span>
    </div>
  - Visby (gris): derecho
  - Riga (gris): derecho arriba
  - Danzig (gris): abajo derecha
  - Líneas de ruta: SVG con línea discontinua dorada entre ciudades

Barra de tiempo (bottom del área mapa, h-12, bg-[#060d1a]/80 backdrop-blur):
  - << ▷ >> controles
  - "OCTUBRE 1358" + "Alto Otoño" texto central
  - Badge "1x" selector velocidad
  - Icono reloj
```

**Sidebar derecho (240px, bg-[#060d1a] border-l border-[rgba(240,192,64,0.2)]):**
```
Label "PRECIOS DE MERCADO" + icono filtro
Lista:
  - Arenque · 12g · -2% (rojo)
  - Vino · 45g · +14% (verde)
  - Madera · 08g · 0%
Control zoom: 🔍- [ZOOM: 45%] 🔍+
```

**Botón flotante inferior derecha:**
```
<button className="absolute bottom-16 right-4 bg-[#f0c040] text-[#0a0e1a] font-bold px-4 py-2 rounded-lg flex items-center gap-2">
  ⚓ ESTABLECER RUTA COMERCIAL
</button>
```

---

### PANTALLA 03 - CityOverview.tsx
**Ruta:** `/city-overview`  
**TopNav:** logo + "Centro Urbano" (activo), "Recursos", "Diplomacia" + badge moneda "12.450 ƒ" + iconos  
**BottomNav:** Mapa Mundial, Libro Mayor, Centro Urbano (activo), Mercado, Concejo

**Layout:**
```
Fondo: cuadrícula isométrica verde oscura (usar clase .isometric-grid del CSS global)
  + overlay: bg-gradient-to-b from-[#0a1428]/80 to-[#0a0e1a]/60
```

**Sidebar izquierdo (280px, bg-[#060d1a]/90 backdrop-blur border-r border-[rgba(240,192,64,0.1)]):**
```
Título: "Distrito de Lübeck" (text-xl font-bold text-[#f0c040])
Separador dorado (border-b-2 border-[#f0c040] w-16 my-2)

Stats:
  - "POBLACIÓN" label + "2.480" valor + barra verde 74%
  - "ESTABILIDAD" label + "84%" valor + barra amarilla 84%

Grid 2×2 recursos:
  - PESCA: +12.4 (verde)
  - MADERA: +5.2 (verde)
  - GRANO: +8.9 (verde)
  - TELA: -2.1 (rojo)

Botón: "⊕ CONSTRUIR NUEVO" (dorado ancho completo)
```

**Área central (flex-1, relative):**
```
Grid 3×3 de celdas de ciudad (cada celda ~160×140px):
  - Celda con Almacén: icono edificio dorado + label "Almacén Nv.2" + efecto hover glow
  - Celda con Molino: icono molino + "Molino de Grano"
  - Celda con Forja: icono forja + "Forja de Hierro"
  - Celda con Plaza: icono plaza + "Plaza Municipal"
  - 2-3 celdas vacías: borde discontinuo dorado, hover → cursor pointer

Los edificios en cada celda son divs con gradiente que simulan vista isométrica:
<div className="w-full h-full bg-gradient-to-br from-[#1a2a1a] to-[#0d1a0d] rounded-lg border border-[rgba(240,192,64,0.1)] hover:border-[rgba(240,192,64,0.4)] hover:shadow-[0_0_20px_rgba(240,192,64,0.2)] transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
  <span className="text-[#f0c040] text-3xl">🏛️</span>
  <span className="text-[#e8dcc8] text-xs font-semibold">Almacén Nv.2</span>
</div>
```

---

### PANTALLA 04 - CharacterCampaignCreation.tsx
**Ruta:** `/new-campaign`  
**TopNav mínimo:** solo logo + iconos (sin links de nav)  
**Sin BottomNav**

**Fondo:** gradiente pergamino `from-[#1a1408] via-[#0d0e1a] to-[#0a0e1a]` con textura de mapa antiguo simulada

**Layout - Grid 2×2 de paneles:**

**Panel superior izquierdo - "RETRATO DEL PERSONAJE"** (label dorado uppercase xs)
```
- Placeholder grande portrait (70% del alto del panel):
  bg-gradient-to-b from-[#0d2040] to-[#060a14] rounded-lg border border-[rgba(240,192,64,0.2)]
  centrado: emoji de mercader grande opacity-20
- Navegación: < "Señor Mercader" > (flechas doradas a ambos lados)
- Sección ESCUDO FAMILIAR + botón ALEATORIZAR:
  - 4 iconos seleccionables (cuadros 44×44): ⚓ 🏰 ⚓ 🛡️
  - Seleccionado: border-2 border-[#f0c040] bg-[rgba(240,192,64,0.1)]
```

**Panel superior derecho - "SELECCIÓN DE CIUDAD DE ORIGEN"** (label dorado uppercase xs)
```
- 3 tarjetas de ciudad en fila (placeholder imagen oscura + nombre + bonus):
  - "Lübeck" + "+15% Poder Comercial" → seleccionada: border-2 border-[#f0c040] + checkmark dorado
  - "Visby" + "+10% Durabilidad del Barco"
  - "Danzig" + "+20% Capacidad de Almacenamiento"
```

**Panel inferior izquierdo - "ESPECIALIZACIÓN MERCANTIL"** (label dorado uppercase xs)
```
- 3 opciones radio estilo card:
  - "Navegante" / "Viajes más rápidos y descubrimiento de rutas" → seleccionado: bg-[rgba(240,192,64,0.15)] border-[#f0c040]
  - "Negociador" / "Mejores precios y favor político"
  - "Arquitecto" / "Menores costes de construcción"
```

**Panel inferior derecho - "CONFIGURACIÓN DE CAMPAÑA"**
```
- "AGRESIÓN IA" · MODERADA (label + valor derecha + slider)
- "RIQUEZA INICIAL" · 2.500 G (slider)
- "ABUNDANCIA DE RECURSOS" · HISTÓRICO (slider)
- Checkbox "MODO HOMBRE DE HIERRO (SIN RECARGAS)"
```

**Footer:**
```
Botón ghost "VOLVER AL MENÚ" → setLocation('/')
Badge "DIFICULTAD ACTUAL: ESTRATEGA" (text-[#22c55e])
Botón dorado "ESTABLECER DINASTÍA"
```

---

### PANTALLA 05 - SettingsCareerLog.tsx
**Ruta:** `/settings`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado", "Concejo" (activo)  
**BottomNav:** estándar con Concejo activo

**Layout - Dos columnas:**

**Columna izquierda (350px) - Panel del personaje:**
```
- Avatar circular grande (100px) con borde dorado
- Título "Consejero" (text-2xl font-bold text-[#f0c040])
- Subtexto "Jefe del Gremio Mercantil de Lübeck y Gran Almirante del Báltico" (centrado)
- Barra "Progreso de Prestigio" · 8.450 / 10.000

Panel "Reputación en el Gremio":
  - ⚓ Influencia Comercial · A+ (text-[#22c55e])
  - 🛡️ Poder Militar · B

Dos botones en cabecera: "Registro de Carrera" (activo, fondo blanco/texto oscuro) y "Configuración Global"
```

**Columna derecha - "Acumulación Total de Riqueza":**
```
- Cifra grande: "4.281.090" (text-4xl font-black text-[#22c55e])
- "GULDEN" · "+12% desde el último trimestre" (verde)
- Gráfico de barras (7 barras: ENE-JUL):
  Barras SVG o divs con height proporcional:
  ENE: h-1/3 verde oscuro, FEB: h-2/5, MAR: h-1/2, ABR: h-2/3, MAY: h-3/4, JUN: h-5/6 verde, JUL: h-full dorado
- "Hitos de Carrera":
  - Línea de tiempo: ⚙ Anno 1358 "El Reconocimiento de Hansetag" / descripción
  - ⛵ Anno 1356 "Príncipe Mercader del Norte" / descripción
  - 💰 Anno 1350 "Primer Millón de Gulden" / descripción
```

---

### PANTALLA 06 - Tavern.tsx
**Ruta:** `/tavern`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado", "Concejo" (activo)  
**Sin BottomNav**

**Fondo:** negro profundo con gradiente cálido naranja/dorado tenue en esquinas (simula antorchas)

**Layout:**
```
Header (no topnav de navegación, sino cabecera de pantalla):
  - "La Taberna" (text-4xl font-black text-[#f0c040])
  - Subtexto descriptivo (text-sm text-[#8a9ab8] max-w-xl)

Fila de 3 tarjetas de personajes (horizontal, cada una ~320px):
  Cada tarjeta:
    - Avatar circular grande (80px) placeholder
    - Nombre ("Capitán Klaus el Férreo") en text-lg font-bold text-[#f0c040]
    - Badge rol ("EL RENEGADO") en text-xs uppercase bg-[#1e3a5f]
    - Cita en cursiva text-xs text-[#8a9ab8]
    - Botón específico: "Preguntar" / "Comprar Secretos" / "Contratar Tripulación"

DOS PANELES DERECHA (sidebar de 300px):
  Panel "Centro de Reclutamiento":
    - "Tripulación Veterana" · Coste: 450 Oro · botón "RECLUTAR" dorado
    - "Navegante Experto" · Coste: 1.200 Oro · botón "CONTRATAR" dorado

  Panel "Capitanes Legendarios":
    - Placeholder imagen grande (fondo oscuro azul)
    - "Almirante Van Der Meer" (text-lg bold text-[#f0c040])
    - "DISPONIBLE POR 5.000 ORO" badge
    - Botón "CONTRATAR CAPITÁN"

Sección inferior "La Sala Secreta" - 3 tarjetas en fila:
  TESORO - "El Tesoro de Visby" - "2.500 Oro de Recompensa" - icono →
  RECOMPENSA - "Hundimiento del 'El Kraken'" - "4.000 Oro de Recompensa" - icono →
  CONTRATO - "El Monopolio del Ámbar" - "+15% Beneficio Comercial" - icono →
```

---

### PANTALLA 07 - Shipyard.tsx
**Ruta:** `/shipyard`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor" (activo), "Convoy"  
**BottomNav:** estándar con Libro Mayor activo

**Layout - modal/contenedor central grande:**
```
Contenedor redondeado (mx-8 my-4, bg-[#0d1526] border border-[rgba(240,192,64,0.2)] rounded-2xl):
  Header:
    - "ASTILLERO REAL" (text-xs uppercase text-[#8a9ab8] tracking-widest)
    - "Astillero y Armería Naval - Prefectura de Lübeck" (text-2xl font-bold text-[#f0c040])
    - Botón X esquina derecha (text-[#8a9ab8] hover:text-[#f0c040])

  Fila de 4 tarjetas de barco (selector tipo):
    Cada tarjeta (seleccionado con borde dorado):
    - Badge "NIVEL I" (bg-[#f0c040] text-[#0a0e1a] rounded text-xs)
    - Icono barco placeholder (⛵ en dorado)
    - Nombre ("Snaikka")
    - Subtítulo ("Explorador rápido / Carga pequeña")

  Sección inferior dos columnas:
    Izquierda:
      - "⛵ Snaikka" (text-xl bold text-[#f0c040])
      - Descripción párrafo
      - Stats en fila: LADRILLOS 20 · MADERA 120 · HERRAMIENTAS 10 · ORO 1.500 · TIEMPO 14 Días
      - Badges: "Capacidad de Carga: 150 Toneladas" + "Velocidad Máx.: 8.5 Nudos"
      - Barra "Calidad de Construcción Proyectada · 92%"
      - Botón "ENCARGAR EMBARCACIÓN" (dorado ancho completo)
    Derecha:
      - Placeholder barco grande (SVG/div con silueta)
```

---

### PANTALLA 08 - TradingOffice.tsx
**Ruta:** `/trading-office`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Mercado" (activo)  
**BottomNav:** estándar con Mercado activo

**Layout - Dos columnas iguales:**

**Columna izquierda - "Inventario del Almacén":**
```
Subtítulo: "Hub de Lübeck · Capacidad: 840/1200 t"
Grid 4×3 de mercancías (cada celda ~100×80px):
  - Icono (emoji de categoría)
  - Nombre abreviado
  - Cantidad (ej: "320t")
  - Celda activa (Grano): borde dorado + fondo dorado tenue
  - Celda vacía: borde discontinuo gris
Footer stats dos badges:
  "VALOR TOTAL · 45.210 ƒ" y "BENEFICIO NETO · +2.150 ƒ"
  Botón "ABRIR LIBRO MAYOR"
```

**Columna derecha - "Estrategia: Grano":**
```
Subtítulo: "Políticas de Comercio Automatizado"
PROTOCOLO DE COMPRA:
  - "Precio Máx. Compra (por t)" + controles [-] [125] [+]
  - "Cantidad Objetivo de Stock" + controles [-] [500] [+]
PROTOCOLO DE VENTAS:
  - "Precio Mín. Venta (por t)" + controles [-] [165] [+]
  - "Stock de Reserva (Sin Venta)" + controles [-] [100] [+]
Toggles:
  - "AUTO-COMERCIO ACTIVADO" (pill verde con punto blanco)
  - "PRIORIZAR GREMIO" (pill gris off)
Botones:
  - "DESCARTAR" (borde/ghost)
  - "APLICAR MANDATO" (dorado)
```

---

### PANTALLA 09 - TownHall.tsx
**Ruta:** `/town-hall`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Concejo" (activo)  
**Sin BottomNav**

**Fondo:** imagen de ciudad medieval simulada (gradiente `from-[#1a0a0a] via-[#0d1020] to-[#0a0e1a]`)

**Layout:**
```
Header:
  - "Ayuntamiento" (text-4xl font-black text-white)
  - Subtexto descripción
  - Badge derecha: "ESTABILIDAD 92%" (bg-[rgba(240,192,64,0.15)] border border-[#f0c040] text-[#f0c040])

Dos columnas:
  Izquierda - "Asignación del Tesoro":
    - Gráfico donut (SVG circular):
      Radio exterior: stroke dorado (Defensa Naval 60%)
      Radio medio: stroke verde (Infraestructura 25%)
      Radio interior: stroke azul claro (Diplomacia 15%)
    - "1.2M DUCATS" centrado dentro
    - Leyenda con círculos de color

  Derecha - "Candidatos Actuales" + "PRÓXIMAS ELECCIONES: 14 DÍAS":
    - Tarjeta grande: avatar + "Albrecht Voigt" + badge "FAVORITO"
      Barras: Patricios [████░░] 68%, Gremios [███░░░] 52%, Plebeyos [██░░░░] 34%
    - Tarjeta pequeña: "Erik Schanz" + barras
    - Fila mini: Heinrich K. 32% · Otto W. 18% · Lars V. 12%

Sección inferior - "Decreto de Impuestos Activo":
  - Texto debate
  - Botones: "APOYAR DECRETO" (dorado) + "VETAR DECRETO" (ghost)
  - Barras: PRO-GRAVAMEN 58% (dorado) · ANTI-GRAVAMEN 34% (rojo) · ABSTENIDOS 8% (gris)
  - Panel "Análisis de Impacto Económico" (bg-[#111c35] p-3 rounded text-xs)
```

---

### PANTALLA 10 - FinancialLedger.tsx
**Ruta:** `/ledger`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor" (activo), "Convoy", "Mercado", "Concejo"  
**Sin BottomNav**

**Layout:**
```
Header:
  - "SUPERVISIÓN FINANCIERA" (label xs uppercase dorado)
  - "Libro Mayor Imperial" (text-3xl bold texto-blanco)
  - Panel derecha: "Activos del Tesoro Líquido" + "842.500 GULDEN" (text-3xl text-[#f0c040]) + "+12.4% desde el último mes" (verde)

Dos columnas:
  Izquierda - "Asignación de Capital":
    - "IMPORTE DEL PRÉSTAMO · 50.000 Gulden" + slider
    - "TASA DE INTERÉS · 4.5%" + slider
    - Stats: "Rendimiento Proyectado +2.250 G" y "Período de Maduración 12 Ciclos"
    - Botón "OFRECER CAPITAL" (dorado)
    Sección "LÍNEAS DEL LIBRO ACTIVAS":
      - "Astillero de Lübeck" · "REEMBOLSO VENCE: 2 DÍAS" · "+1.200 G" (verde)
      - "Comerciantes de Sal de Visby" · "VENCIDO" (rojo) · "15.000 G"

  Derecha - "Buscadores de Crédito Mercantil":
    Tabs: "TODAS LAS CIUDADES" (activo) · "ALTO RIESGO"
    Grid 2×2 tarjetas:
      - Hans Jörgen · RIESGO BAJO (verde) · botón "REVISAR"
      - Klaus Van Dyck · RIESGO ALTO (rojo) · botón "REVISAR"
      - Elias Brandt · RIESGO MEDIO (amarillo) · botón "REVISAR"
      - Marta Lunn · RIESGO BAJO (verde) · botón "REVISAR"
```

---

### PANTALLA 11 - MerchantGuild.tsx
**Ruta:** `/merchant-guild`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Concejo" (activo), "Mercado"  
**Sin BottomNav**

**Layout:**
```
Header:
  - "Gremio del Comercio" (text-3xl bold text-[#f0c040])
  - "Gremio Imperial de Comercio y Estrategia Marítima" (subtitle)
  - Badges: "BALANCE DEL GREMIO · 428.500 DUC" + "RANGO DE MERCADO · #4 Global" (verde)

Dos columnas:
  Izquierda - "Dominio Comercial":
    - Círculo de mapa (placeholder div circular bg-[#0d1526] con "64% RUTAS DEL NORTE" centrado)
    - Top 3 mercantes:
      1. Sindicato de Lübeck · Exportaciones de Sal y Pieles · +12.4% (verde)
      2. Coalición de Danzig · Logística de Grano · +8.1% (verde)
      3. Exploradores de Visby · Comercio de Madera · -2.3% (rojo)

  Derecha - "Subastas en Directo" (badge LIVE pulsante rojo):
    - Tarjeta grande: placeholder barco + "El Gran Grifo" / "Cog Nivel IV"
      "PUJA ACTUAL · 85.200 DUC" + botón "PUJAR" (dorado)
      Countdown: "Termina en: 04:12:09" (text-[#ef4444])
    - Tarjeta pequeña: "Almacén de Riga #12" / "12k DUC"

Tabla "Contratos de Expedición Activos":
  Botón "Nueva Expedición" derecha
  Columnas: CONTRATO/FLOTA · DESTINO · INTEGRIDAD CARGA · PROGRESO · LLEGADA EST. · ACCIÓN
  Filas:
    - "Ruta de Sal del Báltico" / "Flota Alfa" / Estocolmo / ●98% (verde) / barra / "22 Oct" / "Gestionar"
    - "Convoy de Seda y Especias" / "Flota Omega" / Constantinopla / ●42% (rojo) / barra / "25 Oct" / "Gestionar"
```

---

### PANTALLA 12 - MarketHall.tsx
**Ruta:** `/market`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Mercado" (activo), "Concejo"  
**Sin BottomNav** (modal sobre fondo mapa)

**Fondo:** gradiente azul-verde marino muy oscuro simulando mapa báltico

**Modal central (mx-12 my-6, bg-[#0d1526] border border-[rgba(240,192,64,0.15)] rounded-2xl):**
```
Header:
  - 🏪 "LONJA MUNICIPAL" (label caps dorado) · "Lonja Municipal de Lübeck · Centro Comercial"
  - Badge: "TESORO ACTUAL · 45.290 ƒ"
  - Botón X

Tabs: "Todas las Mercancías" (activo, bg-[#f0c040] text-[#0a0e1a]) · "Materias Primas" · "Lujos Acabados"
Buscador: input "Buscar mercancías..." (bg-[#0a1428] border border-[rgba(240,192,64,0.2)] rounded)

Tabla:
  Columnas: BIEN · NIVEL DE STOCK · PRECIO COMPRA · PRECIO VENTA · CONSUMO
  Filas:
    🪵 Madera · High 840/1200 · 12.50 ƒ · 10.20 ƒ · +4.2% ↑ verde
    🌾 Grano · Crítico 120/800 · 42.80 ƒ · 38.40 ƒ · -1.8% ↓ rojo
    ⛏️ Mineral de Hierro · Estable 225/500 · 85.00 ƒ · 78.10 ƒ · 0.0%
    🌶️ Especias Exóticas · Escaso 5/50 · 412.00 ƒ · 395.20 ƒ · +12.4% ↑ verde
    🧵 Linos · Bueno 360/600 · 55.30 ƒ · 49.00 ƒ · -0.2%

Footer: ⓘ texto ayuda · botón "CERRAR LONJA" (ghost) · botón "ABRIR LIBRO MAYOR" (dorado)
```

---

### PANTALLA 13 - MoneyLender.tsx
**Ruta:** `/money-lender`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor" (activo), "Convoy", "Mercado", "Concejo"  
**Sin BottomNav**

**Fondo:** gradiente cálido (`from-[#1a0e00] via-[#0d1020] to-[#0a0e1a]`)

**Layout:**
```
Header:
  - "LA CASA DE RECUENTO DEL USURERO" (label xs caps dorado)
  - "Crédito y Deuda Mercantil" (text-3xl bold texto-blanco)
  - Badge: "Calificación Crediticia Global · A- [FIABLE]" (text-[#f0c040] bg-[rgba(240,192,64,0.1)] border)

Dos columnas:
  Izquierda - "Libro de Deudas Activas" · "4 Contratos Activos":
    Tarjeta 1: "Préstamo Astillero de Lübeck"
      "Principal: 12.500 Oro · Interés: 8.5%" · "-14.230 Oro" (rojo) · "Vence: 12 Nov, 1402"
    Tarjeta 2 (borde rojo urgente): "Bono de Guerra Orden Teutónica"
      "-50.400 Oro" · badge "URGENTE"
    Tarjeta 3: "Crédito Monopolio de Especias" · "-5.210 Oro"
    Tarjeta oferta (bg-[#111c35]): "Préstamo del Gremio Mercantil" badge "Nueva Oferta" + botón "VER"
    Tarjeta bloqueada: "Línea de Crédito Veneciana" + icono 🔒 + "Requiere: Patricio"

  Derecha - dos paneles:
    "Liquidación de Activos":
      Barra "Valor Total de Liquidez · 142.500 Oro" (dorado, 85%)
      Badge alerta: "⚠ Colateral en Riesgo: Almacén de Lübeck"
      Botón "Liquidar Activos Menores" (ghost)

    "Situación Crediticia":
      Sindicato de Lübeck · Excelente (verde)
      Hansa Báltica · Neutral (amarillo)
      Corona Danesa · Hostil (rojo)
      Badge "Próxima Revisión en: 14 Días"

Calculadora inferior:
  "Importe del Préstamo (Oro) · 25.000" + slider
  "Duración (Meses) · 12" + slider
  Panel: "Reembolso Total Estimado: 29.400 Oro" / "Pago Mensual · 2.450g" / "Riesgo de Impago · 4.2%"
  Botón "EMITIR CONTRATO" (dorado)
```

---

### PANTALLA 14 - Cathedral.tsx
**Ruta:** `/cathedral`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado", "Concejo" (activo)  
**Sin BottomNav**

**Fondo:** gradiente gótico (`from-[#0a0808] via-[#0d1020] to-[#0a0e1a]`) con textura piedra simulada

**Layout:**
```
Header con fondo tenue:
  - "CORAZÓN ESPIRITUAL DE LÜBECK" (label xs caps dorado)
  - "Concejo de la Catedral" (text-3xl bold texto-blanco)
  - Badge "ORACIÓN Y BENDICIÓN"
  - Stats: "Piedad: 840" + "Trabajadores: 1.240"

Dos columnas:
  Izquierda - "Limosnas y Caridad":
    Subtítulo: "Atraer refugiados y mendigos para labor"
    "Distribución de Grano": input [Amt] + botón "DONAR" (dorado)
    "Oro para Limosnas": input [Amt] + botón "OFRECER" (dorado)

    "MENDIGOS ENTRANTES (POTENCIAL LABORAL)":
    - Grupo de Visby · +14 Almas (badge verde)
    - Refugiados de Hambruna · +42 Almas (badge verde)
    - Marineros Desplazados · +08 Almas (badge verde)

  Derecha - "Expansión":
    Placeholder imagen construcción catedral (div con gradiente gris oscuro + emoji 🏗️)
    "Fase III Chapiteles Occidentales" (text-lg bold text-[#f0c040])
    "Progreso de Construcción · 68%" + barra verde
    Input "Contribuir Recursos (Oro)" con valor "5.000"
    Botón "FINANCIAR ARQUITECTURA" (dorado ancho completo)
    Texto cursiva: "Expandir la Catedral aumenta la Estabilidad y el prestigio de la ciudad." (text-xs text-[#8a9ab8] italic)

Decretos recientes 3 columnas:
  ADOPTADO (verde): "Exención del Diezmo" + descripción
  PENDIENTE (amarillo): "Financiación de la Cruzada" + descripción
  RECHAZADO (rojo): "Prohibición del Mercado Dominical" + descripción
```

---

### PANTALLA 15 - TheBathHouse.tsx
**Ruta:** `/bath-house`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado", "Concejo" (activo)  
**Sin BottomNav estándar** (tiene footer propio)

**Layout:**
```
Header:
  - "Casa de Baños" (text-3xl bold text-[#f0c040])
  - Subtexto descriptivo
  - Badge derecha: "💰 12.450 ORO EN TESORO"

Dos columnas:
  Izquierda - "Concejales Presentes" (grid 2×2):
    Cada tarjeta (bg-[#0d1526] border rounded-xl p-4):
      - Avatar circular placeholder (48px)
      - Nombre en text-lg bold text-[#f0c040]
      - "LVL X INFLUENCIA" (text-xs text-[#8a9ab8])
      - Badge estado: TRANQUILO (bg-[#15803d]) / SOSPECHOSA (bg-[#92400e] text-amber) / BORRACHO (rojo) / NEUTRAL (azul)
      - Cita en cursiva text-xs
      - "PROGRESO SOBORNO · X%" + barra (color según %)
      - Slider "Ofrecer Incentivo" + botón "ENVIAR" (dorado pequeño)

  Derecha - "Susurros Políticos":
    3 tarjetas verticales:
      RUMOR (label xs caps + "HACE 2 DÍAS"):
        Texto rumor + botón "INVESTIGAR" (borde dorado)
      FAVOR DISPONIBLE (label xs caps verde + "NUEVO"):
        Texto favor + botón "RECLAMAR (500 ORO)" (dorado)
      AMENAZA (label xs caps rojo + "URGENTE"):
        Texto amenaza + botón "SILENCIAR CRÍTICOS" (borde)
    
    Panel candado (bg-[#111c35] rounded-xl p-4 mt-4):
      🔒 "Infiltrar el Concejo"
      "Gana 500 puntos más de Influencia para desbloquear el mecanismo de Chantaje."
      Botón "AUMENTAR POSICIÓN" (dorado ancho completo)

Footer propio:
  "← VOLVER A LA CIUDAD" (ghost, izquierda)
  "VER LIBRO MAYOR" (ghost, centro)
  "CONVOCAR SESIÓN DE EMERGENCIA" (dorado, derecha)
```

---

### PANTALLA 16 - WeaponSmith.tsx
**Ruta:** `/weapon-smith`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado" (activo), "Concejo"  
**Sin BottomNav**

**Fondo:** gradiente cálido herrería (`from-[#120800] via-[#0d1020] to-[#0a0e1a]`)

**Layout - 3 columnas:**
```
Col izquierda (180px) - sidebar categorías:
  - "Armero" (text-xl bold text-[#f0c040])
  - "Artillería" (activo: bg-[rgba(240,192,64,0.1)] border-l-2 border-[#f0c040] text-[#f0c040])
  - "Armas Ligeras" (inactivo)
  - "Defensa" (inactivo)
  - Badge inferior: "Fondos del Mercader Gold Florins · 14.250"

Col central - "Colección de Artillería":
  Controles: filtro ≡ + grid ⊞
  Grid 2×2 tarjetas arma:
    Cada tarjeta (seleccionado = borde dorado):
      - Icono (dorado: ⚙️/💣/⚓/🎯)
      - Nombre en bold
      - Categoría en xs muted
      - Precio con icono 💰

Col derecha (300px) - detalle (Falconete seleccionado):
  - Placeholder imagen (div bg-[#0d1a2a] h-40 rounded-lg flex items-center justify-center ⚙️ grande)
  - Badge "En Stock: 12" (verde, esquina)
  - "Falconete" (text-xl bold)
  - Descripción párrafo texto-muted xs
  - "ESPECIFICACIONES TÁCTICAS" (label xs caps)
  - Daño 45/100 + barra amarilla
  - Alcance 78/100 + barra amarilla
  - Velocidad de Recarga 65/100 + barra verde
  - "Coste de Compra · 850 Florines"
  - Botón "ADQUIRIR ARMAMENTO" (dorado ancho completo)
```

---

### PANTALLA 17 - TradeRouteEditor.tsx
**Ruta:** `/trade-routes`  
**TopNav:** logo + flecha atrás + "CONVOY #042 - 'THE NORTHERN STAR'" label xs + "Trade Route Editor" título + botones "GUARDAR CAMBIOS" + "▶ LANZAR RUTA" (dorado)  
**BottomNav:** estándar con Convoy activo

**Layout - Dos columnas:**
```
Izquierda (280px) - "Paradas de Ruta":
  Botón + (añadir parada)
  Lista de paradas (tarjetas con número circulado):
    1. "Lübeck" / "Puerto de Origen · 244nm desde Visby" (borde dorado, activo)
    2. "Visby" / "Centro Industrial · 182nm desde Riga"
    3. "Riga" / "Mercado de Exportación · Tramo Final"

Derecha - "Órdenes de Mercado: Lübeck":
  Subtítulo: "Define el comportamiento comercial para este destino"
  Badge: "SALDO ACTUAL · 12.450 ƒ"

  3 tarjetas de mercancía:
    Sal Fina (inventario 240/800t):
      Umbral de Compra [12 ƒ] · Umbral de Venta [28 ƒ]
      Botones "Descargar Todo" + "Llenar Capacidad"
    Madera Dura (0/800t):
      Umbral de Compra [5 ƒ] · Umbral de Venta [15 ƒ]
    Vino Francés (55/800t):
      Umbral de Compra [45 ƒ] · Umbral de Venta [90 ƒ]

  Footer barra:
    "La demanda local de Sal es ALTA. Margen de beneficio estimado: +14%"
    Badge "● SIMULACIÓN ACTIVA" (verde)
```

---

### PANTALLA 18 - ConvoyManagerModal.tsx
**Ruta:** `/convoy-manager`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy" (activo), "Mercado"  
**Sin BottomNav** (pantalla de fondo negro con modal central)

**Modal central (mx-auto my-auto w-3/4 max-h-[85%] bg-[#0d1526] border border-[rgba(240,192,64,0.15)] rounded-xl):**
```
Header modal:
  ⛵ "Convoy: Estrella del Norte"
  "Clase: Cog | Tamaño de Flota: 3 Barcos"
  Botón X

Tabs: "CARGA" (activo, subrayado dorado) · "ARMAMENTO" · "RUTA"

Tab CARGA:
  Dos columnas:
    Izquierda - "CARGA DEL BARCO (450/600 T)":
      Barra de capacidad (dorado, 75%)
      Grid 3 celdas:
        - "Grano x200" (bg-[#1a1a0d] border rounded flex+icon)
        - "Vino x50" (igual)
        - Celda vacía (borde discontinuo gris)
    
    Centro - flechas > y < para transfer:
      Botón circular dorado con >
      Botón circular dorado con <
    
    Derecha - "ALMACÉN DE LÜBECK":
      Grid:
        - "Hierro x120"
        - "Tela x80"

Footer modal:
  "CANCELAR" (ghost) + "GUARDAR PLAN DE CONVOY" (dorado)
```

---

### PANTALLA 19 - VesselInspection.tsx
**Ruta:** `/inspection`  
**TopNav:** logo + "Mapa Mundial", "Convoy" (activo), "Libro Mayor" + iconos  
**BottomNav:** estándar con Convoy activo

**Layout - Dos columnas:**
```
Izquierda (60%) - panel barco principal:
  - "CLASE DE EMBARCACIÓN: HANSEATIC COG" (label xs caps dorado)
  - "El Grifo Báltico" (text-3xl bold texto-blanco)
  - Badge "⚓ Anclado (Lübeck)" (verde)
  
  Área imagen barco:
    - Placeholder grande (div h-80 bg-gradient from-[#0a1e3a] to-[#060d1a] rounded-xl)
    - Inside: ⛵ emoji opacity-20 text-8xl
    - Badge overlay izq: "Condición de Velas · 94%"
    - Badge overlay der: "Integridad del Casco · 82%"
  
  Stats fila inferior:
    - 👥 Moral de Tripulación + barra verde
    - 🛡️ Armamento + barra amarilla
    - ⚡ Velocidad Máx. · 6.2 Nudos
    - 📦 Capacidad de Carga · 120 / 150

Derecha (40%) - dos paneles:
  Panel "Bodega de Carga" + "Organizar" botón:
    Grid 4×3 (12 celdas):
      - Celda con ícono+cantidad: Herramientas x20, Grano x15, Madera x40
      - 9 celdas vacías
    Aviso: "⚠ Advertencia de Consumibles: El agua potable durará 4 días más al nivel de moral actual."

  Panel "Estado del Convoy":
    - "La Estrella del Norte" · Crayer · Escolta · ✓ (verde)
    - "El Grifo Báltico" · Cog · Buque Insignia · 👁 (dorado, seleccionado, borde)
    - "Iron Tide" · Snaikka · Mercante · ⚠ (amarillo)
    Botón "GESTIONAR CONVOY" (dorado ancho completo)
```

---

### PANTALLA 20 - WarehouseStockManagement.tsx
**Ruta:** `/warehouse`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor" (activo), "Convoy", "Mercado"  
**BottomNav:** estándar con Libro Mayor activo

**Layout:**
```
Header:
  - "Almacén Central" (text-3xl bold texto-blanco)
  - Subtexto: "Gestiona tus reservas en el Puerto de Lübeck."
  Badge derecha: "CAPACIDAD DE ALMACENAMIENTO · 78%" + barra verde
               + "RIESGO DE DETERIORO · ⚠ MODERADO"

Grid 2×2 de tarjetas de mercancía + panel lateral:
  Tarjeta Sal (bg-[#0d1526] border):
    🧂 "Sal" · "MINAS DE LUNEBURG" · badge "ESTABLE" verde
    Reservas: 450 Uds · Valor de Mercado: 12.4 Oro/Ud
    Slider "Uso Personal ←→ Venta al Mercado"
    "30% Reservado para Salar Pescado"

  Tarjeta Madera Dura:
    🌲 "Madera Dura" · "MADERA NÓRDICA" · badge "SECO" azul
    Reservas: 820 Uds · Demanda del Astillero: ALTA (verde)
    Slider · "80% Bloqueado para Expansión de la Flota"

  Tarjeta Lana:
    🧶 "Lana" · "IMPORTACIONES FLAMENCAS" · badge "RIESGO HUMEDAD" rojo
    Reservas: 120 Uds · Tasa de Deterioro: 2.1% / Semana (rojo)
    Slider · "Liquidando Existencias Húmedas Inmediatamente"

  Tarjeta Grano (grande, full width):
    🌾 "Grano" · "STOCK DE LA CUENCA DEL VÍSTULA" · badge "DISTRIBUIR DE EMERGENCIA" dorado
    3 stats: STOCK 1.200 Tons · CONSUMO -45 T/S · DÍAS RESTANTES 26 Días
    Slider "Consumo Interno ←→ Ventas de Exportación"

Panel derecho (sidebar):
  "Órdenes Logísticas":
    - Acelerar Carga de Barcos →
    - Inspección de Control de Plagas →
    - Expandir Granero (Nivel 3) →
  
  "Eficiencia: 92%" (badge verde circular) + "Operaciones funcionando sin problemas."
```

---

### PANTALLA 21 - HanseaticLeagueMissionBoard.tsx
**Ruta:** `/missions`  
**TopNav:** logo + "Mapa Mundial", "Concejo" (activo), "Convoy", "Mercado" + iconos  
**BottomNav:** estándar con Concejo activo

**Layout:**
```
Header:
  - "REGISTRO CENTRAL DE LÜBECK" (label xs caps dorado)
  - "Tablero de Misiones" (text-3xl bold texto-blanco)
  Badges: "REPUTACIÓN · Excelso" (dorado) + "RESERVAS DE ORO · 42.850" 

Grid 2×2 de misiones:
  Tarjeta grande izquierda (bg-[#0d1526] border rounded-xl):
    Icono 🚢 en badge rojo + "Azote del Skagerrak"
    "Caza de Piratas · Alto Peligro"
    Badge "Caduca: 04:12:44"
    Cita cursiva: descripción misión
    Footer: 💰 12.000 Oro · ⭐ +500 Reputación · 🤝 +2 Favor
    Botón "Aceptar Contrato" (dorado grande)

  Tarjeta derecha (bg-[#0d1526]):
    Icono 📦 verde + "Suministro Crítico de Sal"
    "ENTREGA · MEDIO"
    Descripción
    "Recompensa · 4.500 Oro" (text-[#f0c040])
    Barra progreso verde
    "32 Días Restantes"
    Botón "Inspeccionar" (ghost)

  Tarjeta inferior izquierda:
    Icono 🛡️ + "Convoy del Gremio"
    "ESCOLTA · EQUILIBRADO"
    Descripción

  Tarjeta inferior derecha (bg-[#111c35]):
    "Inteligencia del Mercado Negro" + badge "Contrato Secreto"
    Cita cursiva
    "BENEFICIO POTENCIAL · 25.000+ Oro"
    Botón 🔒 (circular, bloqueado)
```

---

### PANTALLA 22 - ExpeditionMap.tsx
**Ruta:** `/expedition`  
**TopNav:** logo + "Mapa Mundial" (activo), "Libro Mayor", "Convoy", "Concejo"  
**BottomNav:** estándar con Mapa Mundial activo

**Layout:**
```
Fondo: mapa del mundo sombreado (div bg-[#060d1a] con gradiente topográfico oscuro)

Panel superior derecho (overlay, bg-[#0d1526]/90 border rounded-xl w-72):
  "Progreso de Expedición" (label xs caps)
  "Maestría Mediterránea · 84%" + barra verde
  "Descubrimiento del Nuevo Mundo · 22%" + barra amarilla
  Tarjeta: "Activo: Santa María II · ETA: 4d 12h a Santo Domingo"

Panel stats (bg-[#0d1526]/90 border rounded-xl bajo el anterior):
  "Nodos de Oro · 12" | "Naufragios · 03"

Área mapa central:
  - Puntos de expedición (círculos dorados pulsantes) en posiciones absolutas
  - Puntos grises (descubiertos pero inactivos)
  - 2 puntos dorados activos en el Atlántico

Brújula (esquina inferior izquierda):
  Círculo oscuro con N/E/W + aguja dorada

Botón flotante (esquina inferior derecha):
  Círculo dorado con ⊕ o 📍
```

---

### PANTALLA 23 - AtSeaEncounterMenu.tsx
**Ruta:** `/encounter`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor" + badge "4.820" + badge "⛵ 12/15" + iconos  
**Sin BottomNav**

**Fondo:** negro/gris tormenta (`from-[#0a0a0a] via-[#080d14] to-[#040810]`)

**Layout - Modal central grande (3 columnas):**
```
Modal (mx-8 my-6 bg-[#0d1526] border border-[rgba(240,192,64,0.15)] rounded-2xl):

Columna izquierda - "TU FLOTA":
  - Label "TU FLOTA" (xs caps dorado)
  - "Vanguardia de Lübeck" (text-2xl bold texto-blanco)
  - "Fuerza de Combate · 840" (badge bg-[#111c35])
  - "Salud del Navío" + barra verde
  - Cita cursiva: "The wind is in our favor, Governor. They look heavy with cargo."

Columna central:
  Badge: "Tus Probabilidades · Alta (verde) | Nivel de Riesgo · Bajo"
  Círculo grande (imagen barco placeholder - div circular bg-[#0a1428] border-4 border-[rgba(240,192,64,0.3)] w-64 h-64):
    ⛵ emoji grande opacity-20
  Badge inferior: "CORSARIO: 'EL AGARRE DEL NORTE'"
  Fila de 3 botones acción:
    - "Ignorar" (bg-[#111c35] border text-[#e8dcc8])
    - "Parlamentar" (bg-[#111c35] border text-[#e8dcc8])
    - "Abordar el Barco" (bg-[#f0c040] text-[#0a0e1a] font-bold)

Columna derecha - "OPONENTE":
  - Label "OPONENTE" (xs caps dorado)
  - "Capt. Erik Varg" (text-2xl bold texto-blanco)
  - Badge "BUSCADO" (rojo)
  - Avatar placeholder (80px cuadrado bg-[#1a0808] border border-red-900 rounded)
  - "420 · Fuerza de la Flota" badge
  - "CARGA CONOCIDA": badges "Especias Finas" + "Arenque Salado" + "Mineral de Hierro"
  - Cita cursiva: "Drop your sails or feed the eels, Lübecker."
```

---

### PANTALLA 24 - AlertsEventOverlays.tsx
**Ruta:** `/alerts`  
**TopNav:** logo + "Mapa Mundial" (activo), "Libro Mayor", "Convoy", "Mercado"  
**BottomNav:** estándar con Mapa Mundial activo

**Layout:**
```
Fondo: mapa báltico tenue (similar a WorldMap pero más oscuro)

Panel stats izquierda (esquina sup-izq, bg-[#0d1526]/90):
  💰 1.240.500 · 👥 84.200 · 📅 JUNIO 1358

Modal central (resultados batalla, bg-[#0d1526] border border-[rgba(240,192,64,0.15)] rounded-xl mx-auto mt-24 w-2/3):
  Header imagen (h-48 bg-gradient-to-b from-[#1a0808] to-[#0a0e1a] rounded-t-xl):
    "Victoria Naval" (text-3xl bold text-[#f0c040] text-center mt-auto)
    "Batalla del Estrecho de Skagerrak" (subtitle)
  
  Contenido:
    3 stats fila: "BAJAS DE BARCOS · 1 Cog" + "CARGA RECUPERADA · 420 Tons" (verde) + "PRESTIGIO GANADO · +150" (dorado)
    "REGISTRO DE COMBATE":
      - 14:20 · Contacto inicial realizado por el Convoy Alfa 👁
      - 14:45 · Bergantín enemigo 'El Cuervo Negro' desarbolado ⚡
      - 15:10 · Hostiles restantes retroceden hacia el noreste 🏃
    Botones: "Informe Completo" (ghost) + "Aceptar y Continuar" (dorado)

Notificaciones panel derecho (3 tarjetas verticales, bg-[#0d1526]/90):
  🔴 PELIGRO CRÍTICO: "¡El Convoy Alfa bajo ataque pirata! Cerca de Jutlandia" + "Intervenir" link
  🔵 ALERTA EPIDÉMICA: "Brote de plaga en Danzig. Cuarentena requerida" + "Ver Mapa"
  🟡 EVENTO POLÍTICO: "Nuevas elecciones del Alcalde comienzan. Ayuntamiento de Lübeck" + "Emitir Voto"
  Botón "Limpiar Todas las Notificaciones"
```

---

### PANTALLA 25 - GlobalMessageCenter.tsx
**Ruta:** `/messages`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado", "Concejo" (activo)  
**Sin BottomNav**

**Layout - Dos columnas:**
```
Izquierda (35%) - lista mensajes:
  "Centro de Mensajes" (text-2xl bold text-[#f0c040])
  Tabs filtro: "Todos" (activo, bg-[#f0c040] text-[#0a0e1a]) · "Logística" · "Política" · "Urgente"
  
  Lista mensajes (tarjetas):
    "INFORME URGENTE · 10m atrás" (label rojo)
    "Avistamiento: Los Piratas del 'Black Gale'" (bold)
    "El Capitán Erik informa de un navío sospechoso..." (truncado)
    [separador]
    "ALERTA DE MERCADO · 2h atrás"
    "Los precios de la Sal aumentan en Riga"
    "Las nevadas han cerrado las rutas terrestres..."
    [etc]

Derecha (65%) - mensaje abierto:
  Badge urgente: "⚠ BRECHA DE SEGURIDAD - ACCIÓN INMEDIATA REQUERIDA" (rojo)
  "Avistamiento Pirata: El 'Black Gale' cerca de Gotland" (text-2xl bold texto-blanco)
  "Enviado por: Capitán Erik von Strohm | Flota: Estrella del Norte"
  
  Cita del mensaje (bg-[#111c35] border-l-4 border-[#f0c040] p-4 italic text-[#e8dcc8]):
    Texto completo del mensaje

  Dos stats:
    "NIVEL DE INTELIGENCIA · Alta" + barra verde
    "PELIGRO ESTIMADO · Severo (Grado IV)" (rojo)

  Área imagen (placeholder mapa zona afectada, div bg-[#060d1a] h-24 rounded)

  Botones: "Descartar Informe" (ghost) + "Despachar Escolta Naval" (dorado)
```

---

### PANTALLA 26 - TheHanseaticDietHall.tsx
**Ruta:** `/diet-hall`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado", "Concejo" (activo)  
**Sin BottomNav**

**Layout:**
```
Título centrado grande:
  - "La Dieta de Lübeck" (text-4xl font-black text-[#f0c040] text-center)
  - Subtexto centrado: "Elección del Gran Alcalde de la Liga Hanseática. Cada voto remodela el futuro del comercio báltico."

Dos columnas:
  Izquierda - Panel con mapa y stats:
    Panel "Mapa de Influencia Urbana" (bg-[#0d1526] border rounded-xl):
      Badge "● SESIÓN EN DIRECTO" (verde pulsante)
      Mapa placeholder (div bg-[#060d1a] h-64 rounded-lg relative):
        Punto dorado grande en Lübeck "Lübeck (24%)"
        Punto pequeño gris en Danzig "Danzig (18%)"
      
      Dos paneles inferiores fila:
        "Distribución de Peso":
          POSICIÓN MERCANTIL · ALTA + barra dorada
          CONTRIBUCIÓN MILITAR · MODERADA + barra verde
          FAVOR POLÍTICO · MÁX + barra blanca
        
        Panel centrado:
          Estrella ⭐ dorada
          "1.450" (text-3xl bold text-[#f0c040])
          "PUNTUACIÓN DE REPUTACIÓN GLOBAL"
          "Tu voto cuenta como el 12,5% del peso total de la Dieta."

  Derecha - "Candidatos a la Elección":
    3 tarjetas candidato:
      Tarjeta 1: avatar placeholder + "Magnus von Visby" + "Política Aislacionista · 32% Apoyo"
      Tarjeta 2 (seleccionada, borde dorado): avatar + "Janos de Riga" (bold dorado) + "Política Expansionista · 48% Apoyo"
        Cita: "La unidad trae riqueza. Una moneda báltica única bajo la tutela de Riga asegurará mil años de prosperidad."
      Tarjeta 3: avatar + "Henrik de Estocolmo" + "Política Neutral · 20% Apoyo"
    
    Botón grande "⚖ EMITIR TU VOTO" (dorado ancho completo)
    Nota: "Los votos son definitivos una vez enviados."
```

---

### PANTALLA 27 - CitySiegeDefense.tsx
**Ruta:** `/siege`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Concejo" (activo) + badge moneda "42.850"  
**BottomNav:** estándar con Concejo activo

**Fondo:** imagen aérea ciudad medieval asediada (div bg-[#0a0808] con gradient overlay oscuro + texto BREACH IMMINENT en rojo)

**Layout:**
```
Panel superior izquierdo (bg-[#0d1526]/90 border rounded-xl):
  "INTEGRIDAD DE LA MURALLA · 68%" (text-[#ef4444] font-bold)
  Barra larga roja (68%)
  "⚠ BRECHA INMINENTE EN EL SECTOR NORTE" (texto rojo pequeño)

Badge superior derecho:
  "ESTADO DE EMBARGO · COMERCIO CORTADO" (rojo, border rounded-xl)
  "Duración del Asedio: Día 14" (badge bajo)

Centro pantalla - Grid 3 tarjetas de defensa:
  1. Icono 🏰 + "Torres de Arqueros" + badge "LVL 4" (dorado) + "ACTIVO" (verde)
  2. Icono 🔥 + "Aceite Hirviendo" + badge "3 USOS" + "LISTO" (verde)
  3. Icono 🚪 + "Refuerzo de la Puerta" + badge + (azul) + "MEJORA"

Panel inferior fila 3 cols:
  "Registro Táctico" (bg-[#0d1526]/90 border rounded-xl):
    [14:22] Torre de asedio del príncipe acercándose a la Cortina Este.
    [14:18] Concejo autoriza levantamiento de emergencia. +50 Milicia.
    [14:05] Suministros de hierro agotados. Reparaciones de murallas enlentecidas.
  
  Panel Moral (bg-[#0d1526]/90 border-2 border-[#f0c040]):
    "MORAL · 82%" (text-[#22c55e] text-xl)
    Barra verde
  
  Botón grande dorado: "⚖ CONVOCAR CONCEJO" (bg-[#f0c040] text-[#0a0e1a] font-black text-xl)
```

---

### PANTALLA 28 - CombatArena.tsx
**Ruta:** `/combat`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Combate Naval" (activo), "Concejo"  
**Sin BottomNav**

**Fondo:** negro/oscuro con gradiente marino y ondas sutiles simuladas

**Layout:**
```
Panel superior derecho (bg-[#0d1526] border rounded-xl w-56):
  "DIRECCIÓN DEL VIENTO" (label xs caps)
  Icono flecha dorada girada 45° ➤
  "14 NUDOS NE" (text-[#f0c040] font-bold)

Panel izquierdo (bg-[#0d1526] border rounded-xl w-72):
  "ESTADO DEL BUQUE INSIGNIA" (label xs caps text-[#f0c040])
  Icono verificado ✓ verde
  "TRIPULACIÓN · 142/150"
  "VELOCIDAD · 8.2 knt"
  "INTEGRIDAD DEL CASCO" + "EXCELENTE" (verde) + barra verde
  "MORAL" + "ESTABLE" (dorado) + barra dorada
  Botón "DESCARGA DE ANDANADA" (bg-[#f0c040] text-[#0a0e1a] font-black w-full)

Área central mapa naval:
  Fondo: gradiente azul marino oscuro con ondas CSS
  Círculo grande (200px) - "HMS AEGIS (85%)":
    Icono barco ⛵ dorado en anillo dorado
    Barra de integridad verde (85%) debajo
  Línea discontinua conectando al enemigo
  Círculo rojo (150px) - "BRICBARCA PIRATA (42%)":
    Icono barco rojo en anillo rojo

Panel derecho - "REGISTRO DE COMBATE" (bg-[#0d1526] border rounded-xl w-72):
  Badge pulsante rojo ●
  Líneas de log con timestamp:
    [14:02] HMS Aegis recargó cañones de babor.
    [14:03] ¡Impacto directo en el Bricbarca enemigo! -42 HP (rojo)
    [14:04] El enemigo maniobra para flanquear.
    [14:05] Viento girado al NE. Velocidad aumentada. (verde)
```

---

### PANTALLA 29 - PoliticalExileState.tsx
**Ruta:** `/exile`  
**Sin TopNav** (pantalla de estado especial)  
**Sin BottomNav**

**Fondo:** muy oscuro, ladrillo y arco gris (`from-[#080404] via-[#0a0808] to-[#040408]`) - gradiente cálido-oscuro

**Layout - todo centrado:**
```
Badge superior izquierda:
  "⚠ ESTADO: EXCOMULGADO" (bg-transparent border border-[#ef4444] text-[#ef4444] rounded px-3 py-1)

Badge superior derecha:
  "OCTUBRE 1422" (bg-[#111c35] border text-[#e8dcc8]) + "EL MAR BÁLTICO" (igual)

Centro vertical:
  Icono ⚖️ o martillo judicial (dorado grande, 48px)
  "EXILIADO DE LA HANSA" (text-6xl font-black text-[#f0c040] uppercase text-center)
  Separador dorado (hr w-32 mx-auto my-4 bg-[#f0c040] h-0.5)
  
  Párrafo descripción (text-base text-[#e8dcc8] text-center max-w-2xl mx-auto):
    "El Concejo de Lübeck ha hablado. Tu influencia política se ha marchitado, y tu reputación yace en ruinas en los libros de contabilidad manchados de sal del Báltico. Con el sello de la Hansa revocado, tienes prohibido comerciar dentro de estos muros."

3 tarjetas horizontales (centro, bg-[#0d1526]/80 border):
  REPUTACIÓN (label xs caps text-[#8a9ab8]) · ↘ icono rojo
    "PARIA" (text-4xl font-black text-[#ef4444])
    Separador rojo
    "Los mercaderes escupen tu nombre en cada Kontor."
  
  ASIENTO EN EL CONCEJO (label xs caps):
    "REVOCADO" (text-4xl font-black text-[#e8dcc8])
    Icono 🚫 rojo grande
    "Tu voz es un fantasma en el Salón del Concejo."
  
  ACTIVOS FINALES (label xs caps):
    "428 M" (text-4xl font-black text-[#e8dcc8])
    "Una miseria para sobrevivir a los próximos vientos de invierno."

Botones:
  "📜 REESCRIBIR TU LEGADO" (bg-[#f0c040] text-[#0a0e1a] font-bold px-8 py-4 rounded-lg mx-auto block)
  "RETIRARTE A LAS ORILLAS" (bg-transparent border border-[#e8dcc8]/30 text-[#e8dcc8] px-8 py-4 rounded-lg mx-auto block mt-3)
```

---

### PANTALLA 30 - BankruptcyLiquidationState.tsx
**Ruta:** `/bankruptcy`  
**Sin TopNav ni BottomNav** (pantalla de estado especial)

**Fondo:** muy oscuro, negro con textura sala de subasta (`from-[#060606] to-[#0a0808]`)

**Layout - todo centrado:**
```
Badge superior izquierdo:
  "FIN DE SESIÓN · 14:21:05 - Oct 1388"

"EL LIBRO MAYOR ESTÁ CERRADO" (text-xs uppercase text-[#8a9ab8] text-center mt-8)
"LIQUIDACIÓN" (text-8xl font-black text-white leading-none text-center)
"FORZADA" (text-8xl font-black text-[#f0c040] leading-none text-center)

Cita:
  "«La fortuna es como el cristal; cuando brilla, se rompe.» - El Concejo de Lübeck"
  (text-base text-[#8a9ab8] italic text-center my-6 max-w-lg mx-auto)

3 tarjetas stats (fila central, bg-[#0d1526] border rounded-xl):
  ⛵ "04 · COGS RECUPERADOS" (label xs caps text-[#8a9ab8])
  🏛️ "- 142.500 · DUCADOS CONFISCADOS" (text-[#f0c040] - tarjeta más grande/elevada)
  🏗️ "12 · ALMACENES PERDIDOS"

Tabla fila datos:
  Columna izquierda: "Estado Mercantil" / "Derechos de Convoy" / "Membresía del Gremio"
  Columna central: "REVOCADO" / "CANCELADO" / "EXPULSADO" (todos en texto bold rojo/naranja)
  Columna derecha: "Volumen Final de Comercio 241.5t" / "Años Activo 14 Años" / "Causa del Impago Préstamos Sobre-apalancados"

Botones:
  "↺ Aceptar Destino y Reiniciar" (dorado, rounded-full)
  "Volver al Título" (ghost rounded-full)
```

---

### PANTALLA 31 - VictoryHistoricalSummary.tsx
**Ruta:** `/victory`  
**TopNav mínimo:** solo logo + iconos derecha (sin links)  
**Sin BottomNav**

**Fondo:** negro oscuro con tenue imagen ciudad hanseática victoriana

**Layout:**
```
Badge: "CAMPAÑA COMPLETADA" (dorado, border rounded-full, centrado)
Título: "El Ascenso del Patricio" (text-4xl font-black text-[#f0c040] text-center)
Subtexto centrado descripción

Dos columnas:
  Izquierda (60%) - "Legado Histórico":
    Tabla stats:
      "Rango Mercantil" → "Señor Patricio" (bold texto-blanco)
      "Riqueza Total" → "4.280.500 Ducados" (text-[#22c55e])
      "Poder de la Flota" → "142 Navíos" (bold texto-blanco)
    Stats en fila: "CIUDADES CONTROLADAS 12" + "RUTAS COMERCIALES 84" + "AÑOS ACTIVO 45"
    
    Dos paneles fila:
      "FLOTA CONVOY":
        ⛵ Clase Cog 64
        ⛵ Clase Hulk 48
        ⛵ Clase Kraier 30
      
      Panel circular de reputación:
        Donut SVG "FAVOR 98%" (dorado grande centrado)
        "Hegemonía del Concejo" (title)
        Cita
        Badges: "POSICIÓN ALDERMAN" (verde) + "PODER DE VETO DESBLOQUEADO"

  Derecha (40%) - "CRECIMIENTO ECONÓMICO":
    Gráfico de barras (8 barras escalonadas: HUCKSTER→PATRICIO):
      Barras SVG con heights proporcionales (verdes, última dorada)
      Labels debajo
    Descripción texto

Botones:
  "Revisar Crónica 📊" (dorado) + "Menú Principal 🏠" (ghost)
```

---

### PANTALLA 32 - TheMerchantSLegacy.tsx
**Ruta:** `/legacy`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Convoy", "Mercado", "Concejo" (activo)  
**Sin BottomNav**

**Layout:**
```
Título centrado: "Fin de la Era Dorada" (text-3xl bold text-[#f0c040])
Subtexto centrado descripción

Fila badges: "IMPACTO HISTÓRICO · 9.420" + "TÍTULO CONFERIDO · Archi-Magnate" (dos tarjetas)

Dos columnas:
  Izquierda - "Linaje de la Casa von Stratos":
    Panel bg-[#0d1526] border rounded-xl:
      Árbol genealógico (layout flex-col items-center):
        Nodo raíz: avatar pixel + "Erik I · EL FUNDADOR" (bg-[#1e3a5f] border-[#f0c040])
        Línea vertical CSS descendente
        Dos nodos hijo: "Klaus von S. 1340-1388" + "Lena von S. 1342-1395"
      Icono ✍️ dorado decorativo (pergamino/escudo)

  Derecha - "Monumento al Mérito":
    Placeholder imagen monumento (div bg-[#111c35] h-48 rounded-xl)
    Badge "EL SOBERANO ETERNO" (dorado)
    Cita en cursiva

Panel "Museo de Logros":
  Fila de 6 logros (iconos circulares, cada uno con nombre):
    ⛵ Almirante de la Flota · 💰 Acumulador de Oro · 🏰 Rey de la Metrópolis
    🌍 Cartógrafo · 🤝 Diplomático · 🏪 Monopolista
  (Algunos completados = borde dorado, algunos en gris = incompletos)

Panel "El Camino de la Conquista" (línea temporal):
  4 hitos en línea horizontal:
    ● 1356: Carta de Lübeck (activo, dorado)
    ● 1372: Dominación Báltica (activo, dorado)
    ● 1388: Favor Imperial (activo, dorado, grande)
    ○ 1400: El Gran Epílogo (gris, futuro)

Botones: "↺ Comenzar Nuevo Linaje" (dorado) + "↗ Registrar en Crónicas" (ghost)
```

---

### PANTALLA 33 - BalticWinterLogistics.tsx
**Ruta:** `/winter`  
**TopNav:** logo + "Mapa Mundial", "Crisis Invernal" (activo, subrayado), "Almirantazgo" + badge rojo "❄ HELADA SEVERA"  
**BottomNav:** estándar con Convoy activo

**Fondo:** imagen hielo báltico (div bg-[#030a0f] con textura de placas de hielo simulada en gris muy oscuro)

**Layout:**
```
Panel izquierdo superior (bg-[#0d1526]/90 border rounded-xl):
  "Reservas de Recursos" (text-xl bold text-[#f0c040]) · "MES 4 DE INVIERNO"
  "GRANO Y PESCADO SALADO · -124 / Día" + barra verde (75%)
    "Agotamiento estimado: 18 días"
  "LANA Y LEÑA · -82 / Día" + barra amarilla (60%)
    "Malestar social en aumento en Lübeck"
  Botón "💰 Distribuir Grano de Emergencia" (dorado)

Centro - Cuenta regresiva circular:
  Círculo grande (200px) bg-[#0a1428] border-4 border-[rgba(240,192,64,0.3)]:
    "CUENTA REGRESIVA DEL DESHIELO" (label xs caps)
    "22:14:06" (text-4xl font-black text-[#f0c040])
    "Días hasta la Primavera" (text-xs text-[#8a9ab8])

Panel derecho - "Rutas Congeladas":
  Mapa báltico mini (div bg-[#060d1a] h-44 rounded-xl relative):
    Punto rojo "● Bloqueado por Hielo" en Finlandia
    Punto verde "● Paso Abierto" en Dinamarca
    Etiquetas leyenda
  
  Dos stats: "Estado de la Flota · 12 OCIOSOS" + "Profundidad del Hielo · 1.4m"

Fila inferior dos botones:
  "⛵ Gestor de Flota · Convoy Rompehielos" (bg-[#111c35] border rounded-xl)
  "📢 Diplomacia · Consejo de Invierno" (bg-[#111c35] border rounded-xl)

Badge inferior derecho:
  "TEMP. LÜBECK · -18°C" + "NIVEL DE MALESTAR · CRÍTICO" (rojo)
Botón circular alerta: "!" (bg-[#f0c040] rounded-full, floating)
```

---

### PANTALLA 34 - CathedralWorksCharity.tsx
**Ruta:** `/cathedral-works`  
**TopNav:** logo + "Mapa Mundial", "Libro Mayor", "Concejo" (activo), "Mercado"  
**BottomNav:** estándar con Concejo activo

**Layout:**
```
Imagen hero superior (h-48 bg-gradient-to-b from-[#1a0e00] via-[#0d1428] to-[#0d1526] rounded-xl mx-6 mt-4 relative):
  "HITO CÍVICO" (label xs caps dorado, esquina inferior izq)
  "Catedral de San Magnus" (text-3xl bold texto-blanco, izq baja)
  "Fase 3 de 5: El Chapitel Sur. Tus contribuciones inmortalizarán tu linaje en los libros de historia báltica."
  Panel "Favor Público · 78/100" + "+2.4 Crecimiento Semanal" (esquina derecha)

Dos columnas:
  Izquierda - "Comisiones Sagradas":
    Grid 2×2 de tarjetas comisión:
      "Comisión del Chapitel" · descripción · "12.500 Guldens" · botón "Financiar" (dorado)
      "Festival del Solsticio de Invierno" · descripción · "4.200 Guldens" · botón "Patrocinar" (dorado)
      "Ala del Hospital de la Plaga" · descripción · "8.000 Guldens" · botón "Fundar" (dorado)
      "Tríptico del Altar" · descripción · "15.000 Guldens" · botón "Encargar" (dorado)

  Derecha - "Dinámica Social":
    "Los Pobres · +12% Felicidad" (verde) + barra + cita
    "Comerciantes Ricos · +5% Efic. Comercial" + barra + cita
    "Patricios · +2 Votos del Concejo" + barra + cita
    Botón "↻ Ver Libro de Donaciones" (ghost)

    Panel "PROYECTO ACTIVO":
      Icono 🏗️ + "Arbotantes Volantes de la Catedral"
      "Finalización: 14 Días"
      Barra progreso dorada (15%)
```

---

### PANTALLA 35 - OfficialLandingPage.tsx
**Ruta:** `/landing`  
**Sin TopNav / BottomNav del juego** (landing page pública)

**Layout landing page (con scroll, esta es la única pantalla CON scroll):**
```
Header: "Hanseatic Strategos" logo + nav links + "Jugar Ahora" botón dorado
Hero: título enorme "Domina el Comercio del Báltico" + subtítulo + dos botones
Features: grid de características del juego
Footer: copyright
(Esta pantalla puede tener overflow-y-auto ya que es una landing page, no una pantalla de juego)
```

---

### PANTALLA 36 - MerchantGuideOnboarding.tsx
**Ruta:** `/guide`  
**TopNav mínimo:** logo + "Saltar Guía" botón  
**Sin BottomNav**

**Layout - onboarding por pasos:**
```
Indicador de pasos (dots): ●●○○○ (paso 2 de 5)
Panel grande central con ilustración + título del paso + descripción + botón "Siguiente"
Botón ghost "Saltar Guía" arriba derecha
```

---

### PANTALLA 37 - TradeRouteEditorMobile.tsx
**Ruta:** `/trade-routes-mobile`  
**Versión móvil** del TradeRouteEditor con BottomNav

```
Panel superior: lista paradas compacta
Panel inferior: mercancías con controles "COMPRAR POR DEBAJO" y "VENDER SOBRE" en chips
Botón "+ Añadir Nueva Parada"
```

---

### PANTALLAS RESTANTES (38-44)

**ArchitectsGuildResearch.tsx** (`/architects-guild`):
- Similar a Shipyard pero para investigación de edificios
- Grid árbol de tecnología con nodos conectados
- Panel derecho de detalles del edificio seleccionado

**BuildingPlacementInteraction.tsx** (`/building-place`):
- Vista de ciudad con grid interactivo
- Panel lateral de selección de edificio
- Celdas con cursor de colocación activo

**BuildingStatistics.tsx** (`/building-stats`):
- Stats detalladas de un edificio seleccionado
- Gráficas de producción
- Botones de mejora/demolición

**ConstructionActionWheel.tsx** (`/construction`):
- Rueda radial de acciones de construcción (8 sectores)
- Centro con imagen del edificio seleccionado
- Opciones: Mejorar, Demoler, Reparar, Inspeccionar, etc.

**HanseaticMerchantStrategySystem.tsx** (`/strategy`):
- Dashboard de estrategia comercial avanzada
- Mapa de rutas con estadísticas de rentabilidad
- Tabla de prioridades de productos

**CouncilHallMobile.tsx** (`/council-mobile`):
- Versión compacta del TownHall
- Para pantallas pequeñas

---

## 4. ORDEN DE EJECUCIÓN RECOMENDADO

```
Batch 1 (críticas):
  1. TitleScreen.tsx
  2. WorldMap.tsx  
  3. CityOverview.tsx

Batch 2 (edificios más importantes):
  4. Tavern.tsx
  5. Shipyard.tsx
  6. TradingOffice.tsx
  7. TownHall.tsx
  8. FinancialLedger.tsx

Batch 3 (más edificios):
  9. MerchantGuild.tsx
  10. MarketHall.tsx
  11. MoneyLender.tsx
  12. Cathedral.tsx
  13. TheBathHouse.tsx
  14. WeaponSmith.tsx

Batch 4 (convoy y comercio):
  15. TradeRouteEditor.tsx
  16. ConvoyManagerModal.tsx
  17. VesselInspection.tsx
  18. WarehouseStockManagement.tsx

Batch 5 (eventos y combate):
  19. HanseaticLeagueMissionBoard.tsx
  20. AtSeaEncounterMenu.tsx
  21. AlertsEventOverlays.tsx
  22. CitySiegeDefense.tsx
  23. CombatArena.tsx
  24. ExpeditionMap.tsx
  25. GlobalMessageCenter.tsx

Batch 6 (estados finales y especiales):
  26. PoliticalExileState.tsx
  27. BankruptcyLiquidationState.tsx
  28. VictoryHistoricalSummary.tsx
  29. TheMerchantSLegacy.tsx
  30. BalticWinterLogistics.tsx
  31. TheHanseaticDietHall.tsx

Batch 7 (resto):
  32. CathedralWorksCharity.tsx
  33. CharacterCampaignCreation.tsx
  34. SettingsCareerLog.tsx
  35. TradeRouteEditorMobile.tsx
  36. ArchitectsGuildResearch.tsx
  37. BuildingPlacementInteraction.tsx
  38. BuildingStatistics.tsx
  39. ConstructionActionWheel.tsx
  40. HanseaticMerchantStrategySystem.tsx
  41. CouncilHallMobile.tsx
  42. OfficialLandingPage.tsx
  43. MerchantGuideOnboarding.tsx

Batch 8 (limpieza final):
  44. npm run build → validar 0 errores
  45. Eliminar carpeta copia/ completa
```

---

## 5. VALIDACIÓN DESPUÉS DE CADA BATCH

```bash
npm run build
# Debe completarse sin errores TypeScript
# Tiempo esperado: ~15-20 segundos
```

Si hay error TypeScript, corregirlo antes de continuar al siguiente batch.

---

## 6. NOTAS IMPORTANTES

### Sobre el HUD.tsx
El proyecto tiene un componente `HUD` que se renderiza sobre todas las pantallas en App.tsx. Si causa conflictos visuales, verificar que no interfiera con el layout de las pantallas.

### Sobre el NavigationFooter en App.tsx
App.tsx ya incluye un `NavigationFooter` global que aparece en todas las rutas excepto `/` y `/landing`. Sin embargo, cada pantalla que necesite una barra de navegación **debe implementar la suya propia** dentro de su estructura `flex-col`, ya que el NavigationFooter global puede tener un diseño diferente al de las referencias. Se recomienda deshabilitar el NavigationFooter global en App.tsx y que cada pantalla maneje su propia barra.

Para deshabilitar el footer global:
```tsx
// En App.tsx, línea 164 - comentar o eliminar:
{/* <NavigationFooter /> */}
```

### Sobre los emojis vs iconos
Las imágenes de referencia usan iconos de Material Symbols. En esta implementación se usarán emojis Unicode como placeholders visuales. Si se quiere fidelidad exacta, usar la clase `.glyph` del CSS global para los iconos de Material Symbols que ya están cargados.

### Material Symbols disponibles (para usar con clase `.glyph`)
```
public (🌐), account_balance (🏛️), home_app_logo (🏠), storefront (🏪), 
gavel (⚖️), sailing (⛵), notifications (🔔), settings (⚙️), help (❓),
anchor (⚓), shield (🛡️), sword (⚔️), grain (🌾), forest (🌲), 
water (💧), fire (🔥), lock (🔒), star (⭐), arrow_back (←)
```

Sintaxis: `<span className="glyph">public</span>`

---

## 7. CHECKLIST FINAL

- [ ] Todas las pantallas usan `w-full h-full flex flex-col overflow-hidden`
- [ ] Ninguna pantalla tiene scroll vertical u horizontal
- [ ] Todo el texto está en español de España
- [ ] No hay imágenes externas (solo CSS/gradientes/emojis)
- [ ] `npm run build` pasa sin errores
- [ ] Navegación entre pantallas funciona con wouter
- [ ] Los botones de navegación de TopNav y BottomNav son correctos para cada pantalla
- [ ] La carpeta `copia/` ha sido eliminada
- [ ] Los colores coinciden con la paleta especificada (#0a0e1a, #f0c040, #e8dcc8, etc.)
