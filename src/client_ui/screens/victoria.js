import { ScreenBase } from './ScreenBase.js';

export class VictoryScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Fin de la Partida', '🏆'); }
  render() {
    return this.build(`
      <div style="text-align:center;padding:20px;">
        <div id="victoryContent" style="font-size:14px;line-height:2;"></div>
        <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;">
          <button class="btn btn-gold" id="btnNewGameTimeline" style="padding:8px 24px;font-size:13px;">Nueva Partida</button>
          <button class="btn" id="btnContinueTimeline" style="padding:8px 24px;font-size:13px;">Continuar</button>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('btnNewGameTimeline')?.addEventListener('click', () => {
      mgr.closeAll();
      mgr.toggleScreen('nueva');
    });
    document.getElementById('btnContinueTimeline')?.addEventListener('click', () => {
      mgr.closeAll();
    });
  }
  refresh(engine, mgr) {
    const status = engine.getGameStatus?.() || {};
    const content = document.getElementById('victoryContent');
    if (status.victory) {
      content.innerHTML = `
        <div style="font-size:36px;margin-bottom:16px;">🎉👑🎉</div>
        <div class="hansa-subtitle" style="font-size:20px;margin-bottom:12px;">¡Victoria Hanseática!</div>
        <div style="color:var(--hansa-on-surface-variant);margin-bottom:16px;">
          Has alcanzado el rango de <span style="color:var(--hansa-tertiary-fixed);font-weight:bold;">Alderman</span> de la Liga Hanseática.
          <br><br>
          Tu nombre será recordado por siglos como el más grande mercader del Báltico.
          <br><br>
          <span style="font-size:12px;">
            Oro final: <span style="color:var(--hansa-tertiary-fixed);">$${Math.round(engine.player?.gold||0).toLocaleString()}</span><br>
            Reputación: <span style="color:var(--hansa-tertiary-fixed);">${Math.round(engine.player?.reputation||0)}</span><br>
            Barcos: <span style="color:var(--hansa-tertiary-fixed);">${engine.player?.fleet?.length||0}</span>
          </span>
        </div>
      `;
    } else if (status.gameOver === 'defeat_bankruptcy') {
      content.innerHTML = `
        <div style="font-size:36px;margin-bottom:16px;">💀📉💀</div>
        <div class="hansa-subtitle" style="font-size:20px;color:var(--hansa-error);margin-bottom:12px;">Bancarrota</div>
        <div style="color:var(--hansa-on-surface-variant);margin-bottom:16px;">
          Has acumulado demasiadas deudas. Tus acreedores han confiscado tus bienes.
          <br><br>
          La Liga Hanseática te ha expulsado. Tu carrera como mercader ha terminado.
        </div>
      `;
    } else if (status.gameOver === 'defeat_exile') {
      content.innerHTML = `
        <div style="font-size:36px;margin-bottom:16px;">🚫🏛️🚫</div>
        <div class="hansa-subtitle" style="font-size:20px;color:var(--hansa-error);margin-bottom:12px;">Exilio Político</div>
        <div style="color:var(--hansa-on-surface-variant);margin-bottom:16px;">
          Has perdido toda tu reputación en todas las ciudades. Nadie hará negocios contigo.
          <br><br>
          El exilio es tu único destino. La Liga te ha dado la espalda.
        </div>
      `;
    } else {
      content.innerHTML = `
        <div style="font-size:36px;margin-bottom:16px;">⏳</div>
        <div class="hansa-subtitle" style="font-size:20px;">Línea de Tiempo</div>
        <div style="color:var(--hansa-on-surface-variant);margin-bottom:16px;">
          Tu viaje como mercader aún continúa...
          <br><br>
          <span style="font-size:12px;">
            Rango actual: <span style="color:var(--hansa-tertiary-fixed);">${status.rank}</span><br>
            Próximo objetivo: <span style="color:var(--hansa-secondary);">Alderman (1M oro, 200 rep)</span>
          </span>
        </div>
      `;
    }
  }
}
