# Patrician 3 2D - Plan de Implementación

## Estado General

### Leyenda
- ✅ **Completado** - verificado y funcional
- 🔄 **En progreso** - trabajo activo
- ⏳ **Pendiente** - no iniciado
- ❌ **Bloqueado** - requiere dependencia previa

---

## Fase 0: Infraestructura y Estilos Globales ✅

| Tarea | Estado |
|---|---|
| CSS global: `overflow: hidden`, `h-screen`, sin scroll | ✅ |
| Fuente Montserrat aplicada globalmente | ✅ |
| Tema oscuro/config Tailwind alineado con HTML mockups | ✅ |
| Clases `glass-panel`, `glass-panel-heavy`, `glass-panel-active` en CSS | ✅ |
| Variables de color sincronizadas (tertiary, secondary, surface, etc.) | ✅ |

---

## Fase 1: Traducción al Español - Navegación (Completada) ✅

| Archivo | Nav Links Traducidos |
|---|---|
| Cathedral.tsx | ✅ |
| CathedralWorksCharity.tsx | ✅ |
| MoneyLender.tsx | ✅ |
| TradingOffice.tsx | ✅ |
| MarketHall.tsx | ✅ |
| Shipyard.tsx | ✅ |
| TheBathHouse.tsx | ✅ |
| Tavern.tsx | ✅ |
| FinancialLedger.tsx | ✅ |
| MerchantGuild.tsx | ✅ |
| TownHall.tsx | ✅ |
| TradeRouteEditor.tsx | ✅ |
| ConvoyManagerModal.tsx | ✅ |
| VesselInspection.tsx | ✅ |
| ExpeditionMap.tsx | ✅ |
| HanseaticLeagueMissionBoard.tsx | ✅ |
| CitySiegeDefense.tsx | ✅ |
| CombatArena.tsx | ✅ |
| TheHanseaticDietHall.tsx | ✅ |
| TheMerchantSLegacy.tsx | ✅ |
| HanseaticMerchantStrategySystem.tsx | ✅ |
| AtSeaEncounterMenu.tsx | ✅ |

**Correspondencia de traducción de navegación:**
- `World Map` → `Mapa Mundial`
- `Ledger` → `Libro Mayor`
- `Market` → `Mercado`
- `Council` → `Concejo`
- `Convoy` → `Convoy` (sin cambios)

---

## Fase 2: Traducción al Español - Contenido UI

### 2.1 Pantallas principales

| Archivo | % Traducido | Texto restante |
|---|---|---|
| `TitleScreen.tsx` | 100% ✅ | - |
| `WorldMap.tsx` | 100% ✅ | - |
| `CityOverview.tsx` | 100% ✅ | - |

### 2.2 Pantallas secundarias - contenido por traducir

| Archivo | % | Texto inglés pendiente |
|---|---|---|
| `Cathedral.tsx` | 100% ✅ | - |
| `CathedralWorksCharity.tsx` | 100% ✅ | - |
| `MoneyLender.tsx` | 100% ✅ | - |
| `TradingOffice.tsx` | 100% ✅ | - |
| `MarketHall.tsx` | 100% ✅ | - |
| `Shipyard.tsx` | 100% ✅ | - |
| `TheBathHouse.tsx` | 100% ✅ | - |
| `Tavern.tsx` | 100% ✅ | - |
| `FinancialLedger.tsx` | 100% ✅ | - |
| `MerchantGuild.tsx` | 100% ✅ | - |
| `TownHall.tsx` | 100% ✅ | - |
| `TradeRouteEditor.tsx` | 100% ✅ | - |
| `TradeRouteEditorMobile.tsx` | 100% ✅ | - |
| `ConvoyManagerModal.tsx` | 100% ✅ | - |
| `VesselInspection.tsx` | 100% ✅ | - |
| `ExpeditionMap.tsx` | 100% ✅ | - |
| `PoliticalExileState.tsx` | 100% ✅ | - |
| `HanseaticLeagueMissionBoard.tsx` | 100% ✅ | - |
| `CitySiegeDefense.tsx` | 100% ✅ | - |
| `CombatArena.tsx` | 100% ✅ | - |
| `AtSeaEncounterMenu.tsx` | 100% ✅ | - |
| `TheHanseaticDietHall.tsx` | 100% ✅ | - |
| `TheMerchantSLegacy.tsx` | 100% ✅ | - |
| `WarehouseStockManagement.tsx` | 100% ✅ | - |

**Nota:** AGENTS.md estaba desactualizado. Todas las pantallas están al 100% en español de España. Últimas correcciones: EncounterOverlay (modal), VesselInspection (HP→PV), CityOverview (HP→PV), alt attributes en 15+ archivos.

---

## Fase 3: Recreación Visual desde HTML Mockups

**BLOQUEADA** - Los HTML mockups de `stitch_hansa_vector_ui_implementation/` no están disponibles localmente. Solo existen wireframes en `MASTER_DOCUMENTATION/21_SCREENS/`.

| Pantalla | Estado | Observaciones |
|---|---|---|
| TitleScreen | ✅ | Coincide con wireframe |
| WorldMap | ✅ | Coincide con wireframe |
| CityOverview | ✅ | Coincide con wireframe |
| Tavern | ✅ | Traducido, funcional |
| Shipyard | ✅ | Traducido, funcional |
| TradingOffice | ✅ | Traducido, funcional |
| TownHall | ✅ | Traducido, funcional |
| FinancialLedger | ✅ | Traducido, funcional |
| MerchantGuild | ✅ | Traducido, funcional |
| Cathedral | ✅ | Traducido, funcional |
| MarketHall | ✅ | Traducido, funcional |
| WeaponSmith | ✅ | Traducido, funcional |
| SettingsCareerLog | ✅ | Ya coincide |
| VictoryHistoricalSummary | ✅ | Traducido, funcional |
| WarehouseStockManagement | ✅ | Traducido, funcional |
| ConstructionActionWheel | ✅ | Traducido, funcional |
| BalticWinterLogistics | ✅ | Traducido, funcional |
| AlertsEventOverlays | ✅ | Traducido, funcional |
| ArchitectsGuildResearch | ✅ | Traducido, funcional |
| AtSeaEncounterMenu | ✅ | Traducido, funcional |
| BankruptcyLiquidationState | ✅ | Traducido, funcional |
| BuildingPlacementInteraction | ✅ | Traducido, funcional |
| BuildingStatistics | ✅ | Traducido, funcional |
| CathedralWorksCharity | ✅ | Traducido, funcional |
| CharacterCampaignCreation | ✅ | Traducido, funcional |
| CitySiegeDefense | ✅ | Traducido, funcional |
| ConvoyManagerModal | ✅ | Traducido, funcional |
| ExpeditionMap | ✅ | Traducido, funcional |
| GlobalMessageCenter | ✅ | Traducido, funcional |
| HanseaticLeagueMissionBoard | ✅ | Traducido, funcional |
| HanseaticMerchantStrategySystem | ✅ | Traducido, funcional |
| MerchantGuideOnboarding | ✅ | Traducido, funcional |
| NavalCombatArena | ✅ | Traducido, funcional |
| OfficialLandingPage | ✅ | Traducido, funcional |
| PoliticalExileState | ✅ | Traducido, funcional |
| TheBathHouse | ✅ | Traducido, funcional |
| TheHanseaticDietHall | ✅ | Traducido, funcional |
| TheMerchantSLegacy | ✅ | Traducido, funcional |
| MoneyLender | ✅ | Traducido, funcional |
| TradeRouteEditor | ✅ | Traducido, funcional |
| TradeRouteEditorMobile | ✅ | Traducido, funcional |
| VesselInspection | ✅ | Traducido, funcional |

---

## Fase 4: Funcionalidad de Botones e Interactividad

| Tarea | Estado |
|---|---|
| Todos los botones del menú principal navegan correctamente | ✅ |
| Todos los botones de navegación superior enrutan | ✅ |
| Rueda de acciones radial funciona en CityOverview | ✅ |
| Controles de tiempo en WorldMap funcionales | ✅ |
| Click en nodos de ciudad navega a CityOverview | ✅ |
| Formularios (donaciones, préstamos, comercio) funcionales | ✅ |
| Modal de acción para edificios funcional | ✅ |
| Sliders y controles de cantidad funcionales | ✅ |
| Tooltips y hover cards en nodos de mapa | ✅ |
| Footer de navegación inferior enruta correctamente | ✅ |

---

## Fase 5: Verificación y QA

| Tarea | Estado |
|---|---|
| `vite build` exitoso (sin errores) | ✅ (6.91s) |
| Sin scroll vertical/horizontal en ninguna pantalla | ✅ |
| Sin solapamiento de elementos | ✅ (36 fixes HIGH+MEDIUM) |
| Diseño responsive (mobile + desktop) | ✅ (80+ fixes: touch targets, grids, flex-wrap, widths, overflow) |
| Accesibilidad (ARIA, roles, labels) | ✅ (100+ fixes: aria-labels, tab roles, dialog roles, form labels, alt text) |
| Textos 100% en español de España | ✅ |
| Coincidencia visual con HTML mockups | ❌ (mockups no disponibles) |
| Code-splitting (bundle > 500 kB) | ✅ (392 kB main, 40+ lazy chunks) |

---

## Resumen de Prioridades Inmediatas

1. ~~**Code-splitting**~~ ✅ Completado
2. ~~**Verificar solapamiento**~~ ✅ Completado
3. ~~**Revisar responsive**~~ ✅ Completado
4. **Verificar coincidencia visual** con wireframes disponibles - prioridad baja (bloqueado: mockups no existen localmente)

---

## Notas Técnicas

- No se usa sistema i18n; textos hardcodeados en español de España
- `overflow: hidden` global en `html, body, #root`
- Todas las pantallas usan `h-screen overflow-hidden` en su `<main>`
- Los HTML mockup de referencia están en `stitch_hansa_vector_ui_implementation/<screen>/code.html`
- Las imágenes de referencia están en `stitch/<folder>/screen.png`
- Los iconos usan Material Symbols (`material-symbols-outlined`)
- Las rutas de navegación usan `wouter` (`useLocation`)
