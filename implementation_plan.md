# Recreación Total de Pantallas - Hanseatic Strategos

## Descripción

Reconstruir desde cero las **42 pantallas** del juego para que coincidan exactamente con las imágenes de referencia de `copia/`. Todo en español de España, sin scroll, sin imágenes externas (todo generado con CSS/SVG), eliminando las imágenes de `copia/` al finalizar.

## Sistema de Diseño Identificado

Del análisis de las imágenes de referencia se extraen estos tokens de diseño:

| Token | Valor |
|---|---|
| Fondo principal | `#0a0e1a` (negro azulado muy oscuro) |
| Fondo secundario (panels) | `#0d1526` / `#111c35` |
| Fondo panel elevado | `#162040` |
| Color dorado / acento | `#f0c040` / `#e8b820` |
| Color texto principal | `#e8dcc8` (crema cálido) |
| Color texto secundario | `#8a9ab8` (gris azulado) |
| Color verde positivo | `#4caf50` / `#22c55e` |
| Color rojo negativo | `#ef4444` / `#f87171` |
| Borde panel | `rgba(240,192,64,0.15)` |
| Font título | `Montserrat` Bold/ExtraBold |
| Font cuerpo | `Montserrat` Regular/Medium |
| Topbar altura | `48px` (fija) |
| Bottom nav altura | `64px` (fija) |
| Border radius panel | `8px` / `12px` |

## User Review Required

> [!IMPORTANT]
> Las pantallas se reconstruirán **completamente desde cero** con CSS+JSX puro, sin imágenes externas (salvo los fondos atmosféricos que se recrearán con gradientes CSS). Toda la carpeta `copia/` será eliminada al final del proceso.

> [!WARNING]
> Las imágenes de personajes, barcos, y edificios de las referencias son imágenes generadas por IA que no existen en el proyecto. Se sustituirán por avatares CSS con gradientes y placeholders estilizados coherentes con el diseño.

## Open Questions

> [!IMPORTANT]  
> ¿Quieres que las imágenes de personajes/barcos/edificios (como las de la Taberna, Astillero, etc.) sean generadas como imágenes reales con IA, o prefieres que se usen placeholders CSS estilizados?

## Pantallas a Recrear (42 total)

### Grupo 1 - Pantallas Principales (alta prioridad)

| # | Archivo | Imagen ref | Descripción |
|---|---|---|---|
| 1 | `TitleScreen.tsx` | `pantalla_titulo_menu_principal.png` | Menú principal con fondo puerto medieval |
| 2 | `WorldMap.tsx` | `mapa_macro_hansa.png` | Mapa estratégico báltico con HUD |
| 3 | `CityOverview.tsx` | `vision_ciudad.png` | Vista cuadrícula de ciudad con edificios |
| 4 | `CharacterCampaignCreation.tsx` | `creacion_personaje_campana.png` | Creación de personaje/campaña |
| 5 | `SettingsCareerLog.tsx` | `ajustes_registro_carrera.png` | Ajustes + registro de carrera |

### Grupo 2 - Edificios de Ciudad

| # | Archivo | Imagen ref |
|---|---|---|
| 6 | `Tavern.tsx` | `taberna_centro.png` |
| 7 | `Shipyard.tsx` | `arbol_tecnologico_astillero.png` |
| 8 | `TradingOffice.tsx` | `oficina_comercio_modal.png` |
| 9 | `TownHall.tsx` | `panel_concejo.png` |
| 10 | `FinancialLedger.tsx` | `libro_mayor_financiero.png` |
| 11 | `MerchantGuild.tsx` | `gremio_mercaderes.png` |
| 12 | `MarketHall.tsx` | `lonja_mercado_modal.png` |
| 13 | `MoneyLender.tsx` | `oficina_prestamista.png` |
| 14 | `Cathedral.tsx` | `distrito_catedral.png` |
| 15 | `TheBathHouse.tsx` | `casa_banos.png` |
| 16 | `WeaponSmith.tsx` | `herrero_armas.png` |

### Grupo 3 - Convoy y Comercio

| # | Archivo | Imagen ref |
|---|---|---|
| 17 | `TradeRouteEditor.tsx` | `editor_rutas_comercio.png` |
| 18 | `ConvoyManagerModal.tsx` | `gestor_convoy_modal.png` |
| 19 | `VesselInspection.tsx` | `inspeccion_detallada_barco.png` |
| 20 | `TradeRouteEditorMobile.tsx` | `editor_rutas_comercio_movil.png` |
| 21 | `WarehouseStockManagement.tsx` | `gestion_stock_almacen.png` |

### Grupo 4 - Eventos y Misiones

| # | Archivo | Imagen ref |
|---|---|---|
| 22 | `HanseaticLeagueMissionBoard.tsx` | `tablero_misiones_liga_hanseatica.png` |
| 23 | `ExpeditionMap.tsx` | `mapa_expedicion.png` |
| 24 | `AtSeaEncounterMenu.tsx` | `menu_encuentros_mar.png` |
| 25 | `AlertsEventOverlays.tsx` | `alertas_eventos.png` |
| 26 | `GlobalMessageCenter.tsx` | `centro_mensajes_global.png` |

### Grupo 5 - Construcción

| # | Archivo | Imagen ref |
|---|---|---|
| 27 | `BuildingPlacementInteraction.tsx` | `interaccion_colocacion_edificios.png` |
| 28 | `BuildingStatistics.tsx` | `estadisticas_edificios.png` |
| 29 | `ConstructionActionWheel.tsx` | `rueda_acciones_construccion.png` |
| 30 | `ArchitectsGuildResearch.tsx` | `gremio_arquitectos_investigacion.png` |

### Grupo 6 - Política y Combate

| # | Archivo | Imagen ref |
|---|---|---|
| 31 | `TheHanseaticDietHall.tsx` | `sala_dieta_hanseatica.png` |
| 32 | `CitySiegeDefense.tsx` | `defensa_asedio_ciudad.png` |
| 33 | `CombatArena.tsx` | `arena_combate_naval.png` |
| 34 | `HanseaticMerchantStrategySystem.tsx` | *(sin imagen directa)* |

### Grupo 7 - Estado Final y Especiales

| # | Archivo | Imagen ref |
|---|---|---|
| 35 | `PoliticalExileState.tsx` | `estado_exilio_politico.png` |
| 36 | `BankruptcyLiquidationState.tsx` | `estado_bancarrota_liquidacion.png` |
| 37 | `VictoryHistoricalSummary.tsx` | `resumen_historico_victoria.png` |
| 38 | `TheMerchantSLegacy.tsx` | `legado_mercader.png` |
| 39 | `BalticWinterLogistics.tsx` | `logistica_invernal_baltico.png` |

### Grupo 8 - Informativos

| # | Archivo | Imagen ref |
|---|---|---|
| 40 | `CathedralWorksCharity.tsx` | `obras_catedral_caridad.png` |
| 41 | `OfficialLandingPage.tsx` | `pagina_aterrizaje_oficial.png` |
| 42 | `MerchantGuideOnboarding.tsx` | `guia_mercader_onboarding.png` |

---

## Proposed Changes

### Shared Design System (shared CSS variables)

#### [MODIFY] [tailwind.config.js](file:///c:/Users/Aritz/Desktop/Proyectos%20OpenCode/Patrician%203%202D/tailwind.config.js)
Añadir tokens de color del sistema de diseño identificado.

#### [MODIFY] [src/styles/](file:///c:/Users/Aritz/Desktop/Proyectos%20OpenCode/Patrician%203%202D/src/styles/)
Actualizar CSS global con las variables y clases de glass-panel del sistema Hanseatic.

---

### Shared Components

#### [NEW] `src/components/shared/TopNav.tsx`
Barra de navegación superior reutilizable (logo + links + iconos + avatar).

#### [NEW] `src/components/shared/BottomNav.tsx`  
Barra de navegación inferior reutilizable (5 íconos).

---

### Screens (rewrite)

Cada pantalla se reescribe completamente para coincidir con su imagen de referencia. Las pantallas usarán:
- `w-full h-full` (sin scroll)
- Paleta de color Hanseatic (oscuro azul/dorado)
- Todo el texto en español de España
- CSS puro, sin imágenes externas
- TopNav y BottomNav reutilizables donde corresponda

---

## Estrategia de Ejecución

**Orden de ejecución** (batches para mantener estabilidad):

1. **Batch A**: Sistema de diseño + componentes compartidos (TopNav, BottomNav)
2. **Batch B**: Pantallas Grupo 1 (las 5 más críticas)
3. **Batch C**: Grupo 2 (edificios) 
4. **Batch D**: Grupo 3 (convoy)
5. **Batch E**: Grupos 4-8 (restantes)
6. **Final**: Build de validación + eliminación de carpeta `copia/`

## Verification Plan

### Automated Tests
```
npm run build
```
Build debe completarse sin errores TypeScript.

### Manual Verification
- Abrir http://localhost:5173/
- Navegar por cada pantalla verificando que coincide con la imagen de referencia
- Verificar ausencia de scroll vertical/horizontal
- Verificar que todo el texto está en español
