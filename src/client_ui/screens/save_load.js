import { ScreenBase } from './ScreenBase.js';

export class SaveLoadScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Guardar / Cargar', '\u{1F4BE}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:260px;">
          <div class="hansa-subtitle">Guardar Partida</div>
          <div style="font-size:12px;line-height:2;">
            <div class="flex gap-sm flex-wrap" style="align-items:center;">
              <input type="text" id="saveName" value="Partida_001"
                style="flex:1;min-width:80px;background:rgba(0,31,63,0.4);border:1px solid #3a2a1a;color:#e0d8c0;font-family:inherit;font-size:12px;padding:4px 8px;border-radius:2px;">
              <button class="uiBtn uiBtnGold" id="btnSave">Guardar</button>
            </div>
            <div id="saveResult" style="font-size:11px;color:var(--hansa-secondary);margin-top:4px;"></div>
          </div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Guardados Existentes</div>
          <div id="existingSaves" style="font-size:11px;line-height:1.8;max-height:25vh;overflow-y:auto;"></div>
        </div>
        <div style="flex:1;min-width:260px;border-left:1px solid rgba(228,228,204,0.08);padding-left:16px;">
          <div class="hansa-subtitle">Cargar Partida</div>
          <div id="loadList" style="font-size:11px;max-height:40vh;overflow-y:auto;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('btnSave')?.addEventListener('click', () => {
      const name = document.getElementById('saveName')?.value || 'partida';
      const result = engine.saveGame?.(name);
      document.getElementById('saveResult').textContent = result ? '\u2714 Partida guardada correctamente' : '\u26A0 Error al guardar';
      this.refresh(engine, mgr);
    });
  }
  refresh(engine, mgr) {
    const savesDiv = document.getElementById('existingSaves');
    const loadDiv = document.getElementById('loadList');
    const saves = engine.saveManager?.listSaves?.() || [];
    if (saves.length) {
      const html = saves.map(s =>
        `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;font-size:10px;">
          <span style="color:#b0a080;">${s.name}</span>
          <span style="color:#6a6a4a;">${(s.size/1024).toFixed(1)}KB</span>
        </div>`
      ).join('');
      savesDiv.innerHTML = html;
      loadDiv.innerHTML = saves.map(s =>
        `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;">
          <span style="color:#b0a080;">${s.name}</span>
          <button class="uiBtn uiBtnGold" data-load="${s.name}" style="font-size:9px;padding:2px 8px;">Cargar</button>
        </div>`
      ).join('');
      document.querySelectorAll('[data-load]').forEach(b => b.onclick = () => {
        engine.loadGame?.(b.dataset.load);
        document.getElementById('saveResult').textContent = '\u2714 Partida cargada';
        mgr.closeAll();
      });
    } else {
      savesDiv.innerHTML = '<span style="color:#5a5a3a;">Sin partidas guardadas</span>';
      loadDiv.innerHTML = '<span style="color:#5a5a3a;">No hay partidas para cargar</span>';
    }
  }
}
