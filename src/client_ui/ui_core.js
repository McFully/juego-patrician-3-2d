import { MarketScreen } from './screens/lonja.js';
import { TownHallScreen } from './screens/ayuntamiento.js';
import { ShipScreen } from './screens/barco.js';
import { ShipyardScreen } from './screens/astillero.js';
import { TavernScreen } from './screens/taberna.js';
import { ArmoryScreen } from './screens/armero.js';
import { ChurchScreen } from './screens/iglesia.js';
import { GuildScreen } from './screens/gremio.js';
import { BathHouseScreen } from './screens/banos.js';
import { LoanScreen } from './screens/prestamista.js';
import { ConstructionScreen } from './screens/construccion.js';
import { TradingOfficeScreen } from './screens/oficina.js';
import { CityViewScreen } from './screens/ciudad.js';
import { ExpeditionScreen } from './screens/expedicion.js';
import { NavalCombatScreen } from './screens/combate_naval.js';
import { SaveLoadScreen } from './screens/save_load.js';
import { NewGameScreen } from './screens/nueva_partida.js';
import { StockExchangeScreen } from './screens/bolsa.js';
import { VictoryScreen } from './screens/victoria.js';
import { MainMenuScreen } from './screens/main_menu.js';

export class UIManager {
  constructor(engine, renderer, container) {
    this.engine = engine;
    this.renderer = renderer;
    this.container = container;
    this.activeScreen = null;
    this.currentInstance = null;
    this.sidebarVisible = true;
    this.initOverlay();
    this.initNavBar();
    this.registerScreens();
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .uiBtn {
        background:rgba(0,31,63,0.4);border:1px solid rgba(228,228,204,0.15);
        color:var(--hansa-on-surface);padding:5px 12px;
        font-family:var(--hansa-font);font-size:11px;font-weight:500;
        cursor:pointer;border-radius:var(--hansa-radius);
        transition:var(--hansa-transition);letter-spacing:0.3px;
      }
      .uiBtn:hover { background:rgba(0,31,63,0.6);border-color:rgba(228,228,204,0.3); }
      .uiBtn:active { transform:scale(0.97); }
      .uiBtn:disabled { opacity:0.4;cursor:default; }
      .uiBtnGold { color:var(--hansa-tertiary-fixed);border-color:var(--hansa-tertiary-container); }
      .uiBtnGold:hover { border-color:var(--hansa-tertiary-fixed-dim); }
      .uiBtnBuy { color:var(--hansa-secondary);border-color:var(--hansa-secondary-container); }
      .uiBtnBuy:hover { border-color:var(--hansa-secondary); }
      .uiBtnSell { color:var(--hansa-error);border-color:var(--hansa-error-container); }
      .uiBtnSell:hover { border-color:var(--hansa-error); }
      #screenBody::-webkit-scrollbar { width:5px; }
      #screenBody::-webkit-scrollbar-track { background:var(--hansa-surface-container-lowest); }
      #screenBody::-webkit-scrollbar-thumb { background:var(--hansa-tertiary);border-radius:3px; }
      #marketGoods::-webkit-scrollbar { width:5px; }
      #marketGoods::-webkit-scrollbar-track { background:var(--hansa-surface-container-lowest); }
      #marketGoods::-webkit-scrollbar-thumb { background:var(--hansa-tertiary);border-radius:3px; }
    `;
    document.head.appendChild(style);
  }

  initOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'screenOverlay';
    this.overlay.addEventListener('click', (e) => { if (e.target === this.overlay) this.closeAll(); });
    this.container.appendChild(this.overlay);

    this.screenContainer = document.createElement('div');
    this.screenContainer.id = 'screenContainer';
    this.overlay.appendChild(this.screenContainer);
  }

  initNavBar() {
    if (document.getElementById('navBar')) return;
    this.navBar = document.createElement('div');
    this.navBar.className = 'hansa-topbar';
    this.navBar.id = 'navBar';

    const brand = document.createElement('span');
    brand.className = 'hansa-navbrand';
    brand.textContent = '⚓ Hanseatic';
    this.navBar.appendChild(brand);

    this.container.prepend(this.navBar);
  }

  registerScreens() {
    const screenDefs = [
      { id:'main_menu',    label:'Menú Principal', icon:'\u{2693}', cls: MainMenuScreen, showInNav: false },
      { id:'lonja',        label:'Lonja',        icon:'\u{1F3EC}', cls: MarketScreen },
      { id:'ayuntamiento', label:'Ayuntamiento', icon:'\u{1F3DB}', cls: TownHallScreen },
      { id:'barco',        label:'Barco',        icon:'\u{2693}',  cls: ShipScreen },
      { id:'astillero',    label:'Astillero',    icon:'\u{1F6A2}', cls: ShipyardScreen },
      { id:'taberna',      label:'Taberna',      icon:'\u{1F37A}', cls: TavernScreen },
      { id:'armero',       label:'Armero',       icon:'\u{2694}',  cls: ArmoryScreen },
      { id:'iglesia',      label:'Iglesia',      icon:'\u{26EA}',  cls: ChurchScreen },
      { id:'gremio',       label:'Gremio',       icon:'\u{1F3F0}', cls: GuildScreen },
      { id:'banos',        label:'Baños',        icon:'\u{1F6BF}', cls: BathHouseScreen },
      { id:'prestamista',  label:'Prestamista',  icon:'\u{1F4B0}', cls: LoanScreen },
      { id:'construccion', label:'Construir',    icon:'\u{1F3D7}', cls: ConstructionScreen },
      { id:'oficina',      label:'Oficina',      icon:'\u{1F4CB}', cls: TradingOfficeScreen },
      { id:'ciudad',       label:'Ciudad',       icon:'\u{1F3D8}', cls: CityViewScreen },
      { id:'expedicion',   label:'Expedición',   icon:'\u{1F30D}', cls: ExpeditionScreen },
      { id:'combate',      label:'Combate',      icon:'\u{1F6A2}', cls: NavalCombatScreen },
      { id:'guardar',      label:'Guardar',      icon:'\u{1F4BE}', cls: SaveLoadScreen },
      { id:'nueva',        label:'Nueva Partida', icon:'\u{1F3AE}', cls: NewGameScreen },
      { id:'bolsa',        label:'Bolsa',        icon:'\u{1F4C8}', cls: StockExchangeScreen },
      { id:'victoria',     label:'Historial',     icon:'\u{1F3C6}', cls: VictoryScreen },
    ];

    this.screenMap = {};
    for (const s of screenDefs) {
      this.screenMap[s.id] = s;
      if (s.showInNav === false) continue;
      const btn = document.createElement('button');
      btn.className = 'hansa-navbtn';
      btn.dataset.screen = s.id;
      btn.innerHTML = `${s.icon} ${s.label}`;
      btn.title = s.label;
      btn.onclick = () => this.toggleScreen(s.id);
      this.navBar.appendChild(btn);
    }

    const sep = document.createElement('span');
    sep.style.cssText = 'flex:1;';
    this.navBar.appendChild(sep);
    const info = document.createElement('span');
    info.className = 'hansa-navinfo';
    info.id = 'navInfo';
    info.textContent = '$0';
    this.navBar.appendChild(info);
  }

  toggleScreen(id) {
    if (!this.screenMap[id]) return;
    if (this.activeScreen === id) { this.closeAll(); return; }
    this.closeAll();
    this.activeScreen = id;
    const def = this.screenMap[id];
    this.overlay.style.display = 'block';
    this.screenContainer.innerHTML = '';
    const instance = new def.cls(this);
    const el = instance.render();
    this.screenContainer.appendChild(el);
    instance.bindEvents(this.engine, this);
    setTimeout(() => instance.refresh(this.engine, this), 50);
    this.currentInstance = instance;
    document.querySelectorAll('[data-screen]').forEach(b => {
      const active = b.dataset.screen === id;
      b.dataset.active = active ? 'true' : 'false';
      b.classList.toggle('active', active);
    });
  }

  closeAll() {
    this.activeScreen = null;
    this.overlay.style.display = 'none';
    this.screenContainer.innerHTML = '';
    this.currentInstance = null;
    document.querySelectorAll('[data-screen]').forEach(b => {
      b.dataset.active = 'false';
      b.classList.remove('active');
    });
  }

  toggleSidebar() {
    const panel = document.getElementById('uiPanel');
    if (!panel) return;
    this.sidebarVisible = !this.sidebarVisible;
    panel.style.display = this.sidebarVisible ? '' : 'none';
  }

  update() {
    if (this.currentInstance && typeof this.currentInstance.refresh === 'function') {
      this.currentInstance.refresh(this.engine, this);
    }
  }

  updateNavGold() {
    const info = document.getElementById('navInfo');
    if (info && this.engine.player) {
      info.textContent = `$${this.engine.player.gold.toFixed(0)}`;
    }
  }
}
