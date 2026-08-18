import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';

export class NewGameScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Nueva Partida', '\u{1F3AE}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap" style="justify-content:center;">
        <div style="flex:1;min-width:300px;max-width:400px;">
          <div class="hansa-subtitle" style="font-size:14px;margin:0 0 12px;text-align:center;letter-spacing:2px;">Configura tu Imperio</div>
          <div style="font-size:13px;line-height:2.2;">
            <div>
              <span style="color:#8a7a5a;">Nombre del comerciante:</span>
              <input type="text" id="ngName" value="Comerciante" style="width:100%;background:rgba(0,31,63,0.4);border:1px solid #3a2a1a;color:#e0d8c0;font-family:inherit;font-size:13px;padding:5px 10px;border-radius:2px;margin-top:2px;">
            </div>
            <div style="margin-top:10px;">
              <span style="color:#8a7a5a;">Ciudad natal:</span>
              <select id="ngCity" class="hansa-select" style="width:100%;margin-top:2px;">
                ${CITIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div style="margin-top:10px;">
              <span style="color:#8a7a5a;">Dificultad:</span>
              <div class="flex gap-base" style="margin-top:4px;">
                <label style="flex:1;text-align:center;padding:6px;background:rgba(60,50,30,0.3);border:1px solid #3a2a1a;border-radius:3px;cursor:pointer;">
                  <input type="radio" name="ngDiff" value="easy" style="accent-color:#4a8;"> Fácil
                </label>
                <label style="flex:1;text-align:center;padding:6px;background:rgba(60,50,30,0.3);border:1px solid #c8a040;border-radius:3px;cursor:pointer;">
                  <input type="radio" name="ngDiff" value="normal" checked style="accent-color:#ffd700;"> Normal
                </label>
                <label style="flex:1;text-align:center;padding:6px;background:rgba(60,50,30,0.3);border:1px solid #3a2a1a;border-radius:3px;cursor:pointer;">
                  <input type="radio" name="ngDiff" value="hard" style="accent-color:#c44;"> Difícil
                </label>
              </div>
            </div>
            <div style="margin-top:10px;">
              <span style="color:#8a7a5a;">Capital inicial:</span>
              <select id="ngGold" class="hansa-select" style="width:100%;margin-top:2px;">
                <option value="5000">$5,000 (Modesto)</option>
                <option value="15000" selected>$15,000 (Comerciante)</option>
                <option value="50000">$50,000 (Adinerado)</option>
              </select>
            </div>
          </div>
          <button class="uiBtn uiBtnGold" id="btnNewGame" style="width:100%;margin-top:20px;padding:10px;font-size:14px;letter-spacing:2px;">COMENZAR NUEVA PARTIDA</button>
          <div id="ngResult" style="text-align:center;margin-top:8px;font-size:12px;color:var(--hansa-secondary);"></div>
        </div>
        <div style="flex:1;min-width:200px;max-width:300px;border-left:1px solid rgba(228,228,204,0.08);padding-left:16px;">
          <div class="hansa-subtitle" style="margin:0 0 8px;">Consejos Iniciales</div>
          <div style="font-size:11px;color:#8a7a5a;line-height:1.8;">
            <div>\u{1F4B0} Compra barato, vende caro</div>
            <div>\u{2693} Comienza comerciando con ciudades cercanas</div>
            <div>\u{1F3EC} La Lonja muestra precios en cada ciudad</div>
            <div>\u{1F3D7} Construye fábricas para producción local</div>
            <div>\u{1F4C8} Aumenta tu rango para desbloquear misiones</div>
            <div>\u{1F6A2} Protege tus barcos de los piratas</div>
            <div style="margin-top:10px;color:var(--hansa-outline);font-size:10px;">
              El objetivo es convertirte en el comerciante más rico y poderoso de la Liga Hanseática. Gana reputación, construye tu imperio y conviértete en Lord Mayor.
            </div>
          </div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('btnNewGame')?.addEventListener('click', () => {
      const name = document.getElementById('ngName')?.value || 'Comerciante';
      const city = document.getElementById('ngCity')?.value || 'lubeck';
      const diffEl = document.querySelector('input[name="ngDiff"]:checked');
      const diff = diffEl?.value || 'normal';
      const gold = parseInt(document.getElementById('ngGold')?.value) || 15000;
      engine.newGame(name, city);
      engine.player.gold = gold;
      if (diff === 'easy') engine.player.gold *= 2;
      if (diff === 'hard') engine.player.gold = Math.floor(engine.player.gold * 0.5);
      engine.start();
      document.getElementById('ngResult').textContent = '\u2714 Nuevo imperio fundado en ' + (CITIES.find(c=>c.id===city)?.name||city);
      setTimeout(() => mgr.closeAll(), 1500);
    });
  }
  refresh(engine, mgr) {}
}
