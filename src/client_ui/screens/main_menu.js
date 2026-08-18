import { ScreenBase } from './ScreenBase.js';

export class MainMenuScreen extends ScreenBase {
  constructor(engine, uiManager) {
    super('main_menu', 'PATRICIAN III', '⚓', {
      width: '600px',
      height: 'auto',
      closeable: false,
    });
    this.engine = engine;
    this.uiManager = uiManager;
  }

  render() {
    return `
      <div style="text-align:center;padding:24px 16px;">
        <div style="font-size:48px;margin-bottom:8px;">⚓</div>
        <h1 style="font-family:'Montserrat',sans-serif;font-size:36px;font-weight:800;color:#ffe088;margin:0 0 4px;letter-spacing:2px;text-shadow:0 0 24px rgba(234,195,73,0.4);">
          PATRICIAN III
        </h1>
        <p style="color:#a0a080;font-size:14px;margin:0 0 24px;font-weight:500;">Liga Hanseática — Edición 2D</p>

        <div id="menuButtons" style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">
          <button class="hansa-navbtn" id="btnNewGame" style="width:100%;font-size:16px;padding:14px 24px;background:linear-gradient(135deg,rgba(234,195,73,0.15),rgba(234,195,73,0.05));">
            <span style="font-weight:700;">Nueva Partida</span>
            <span style="font-size:11px;color:#a0a080;margin-left:8px;">Comienza tu imperio comercial</span>
          </button>
          <button class="hansa-navbtn" id="btnLoadGame" style="width:100%;font-size:16px;padding:14px 24px;">
            <span style="font-weight:700;">Cargar Partida</span>
            <span style="font-size:11px;color:#a0a080;margin-left:8px;">Continúa una partida guardada</span>
          </button>
          <button class="hansa-navbtn" id="btnSettings" style="width:100%;font-size:16px;padding:14px 24px;">
            <span style="font-weight:700;">Ajustes</span>
            <span style="font-size:11px;color:#a0a080;margin-left:8px;">Audio, gráficos, juego</span>
          </button>
          <button class="hansa-navbtn" id="btnCredits" style="width:100%;font-size:16px;padding:14px 24px;">
            <span style="font-weight:700;">Créditos</span>
            <span style="font-size:11px;color:#a0a080;margin-left:8px;">Equipo y referencias</span>
          </button>
          <button class="hansa-navbtn" id="btnQuit" style="width:100%;font-size:16px;padding:14px 24px;opacity:0.7;">
            <span style="font-weight:700;">Salir</span>
          </button>
        </div>

        <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(228,228,204,0.1);color:#6a6a4a;font-size:11px;">
          <div>Basado en Patrician III (Ascaron, 2003)</div>
          <div style="margin-top:4px;">Estilo visual: <a href="#" style="color:#eac349;">stitch_hansa_vector_ui_implementation</a></div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const btnNewGame = document.getElementById('btnNewGame');
    const btnLoadGame = document.getElementById('btnLoadGame');
    const btnSettings = document.getElementById('btnSettings');
    const btnCredits = document.getElementById('btnCredits');
    const btnQuit = document.getElementById('btnQuit');

    btnNewGame?.addEventListener('click', () => this.startNewGame());
    btnLoadGame?.addEventListener('click', () => this.showLoadGame());
    btnSettings?.addEventListener('click', () => this.showSettings());
    btnCredits?.addEventListener('click', () => this.showCredits());
    btnQuit?.addEventListener('click', () => this.quitGame());
  }

  startNewGame() {
    this.uiManager.toggleScreen('main_menu');
    this.uiManager.toggleScreen('nueva');
  }

  showLoadGame() {
    this.uiManager.toggleScreen('main_menu');
    this.uiManager.toggleScreen('guardar');
  }

  showSettings() {
    // TODO: implement settings screen
    alert('Ajustes - próximamente');
  }

  showCredits() {
    // TODO: implement credits screen
    alert('Patrician III 2D Clone\n\nDesarrollado como homenaje a Patrician III\nEstilo visual: Maritime Glassmorphism\nReferencia: stitch_hansa_vector_ui_implementation\n\nTecnologías: Vanilla JS, Vite, Canvas 2D, Web Audio API');
  }

  quitGame() {
    if (confirm('¿Salir del juego?')) {
      window.close();
    }
  }

  onShow() {
    // Reset any game state if needed
    window._gameOverShown = false;
  }

  refresh() {
    // No dynamic content to refresh
  }
}