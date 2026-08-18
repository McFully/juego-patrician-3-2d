import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';

export class LoanScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Prestamista', '\u{1F4B0}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:280px;">
          <div class="hansa-subtitle">Solicitar Préstamo</div>
          <div style="font-size:12px;line-height:2;">
            <div>Tasa de interés: <span style="color:var(--hansa-tertiary-fixed);">10%</span></div>
            <div class="flex gap-sm flex-wrap" style="align-items:center;margin-top:8px;">
              <input type="number" id="loanAmount" value="1000" min="100" max="50000" step="100"
                style="flex:1;min-width:80px;background:rgba(0,31,63,0.4);border:1px solid #3a2a1a;color:#e0d8c0;font-family:inherit;font-size:12px;padding:4px 8px;border-radius:2px;">
              <button class="uiBtn uiBtnGold" id="btnTakeLoan" style="font-size:10px;">Pedir préstamo</button>
            </div>
            <div style="font-size:10px;color:var(--hansa-outline);margin-top:4px;">Plazo: 90 días · Interés total: <span id="loanInterestPreview">$1,100</span></div>
          </div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Préstamos Activos</div>
          <div id="loanActive" style="font-size:11px;line-height:1.8;max-height:20vh;overflow-y:auto;"></div>
        </div>
        <div style="flex:1;min-width:280px;border-left:1px solid rgba(228,228,204,0.08);padding-left:16px;">
          <div class="hansa-subtitle">Emitir Crédito</div>
          <div style="font-size:12px;line-height:2;">
            <div>Concede un préstamo a nobles y comerciantes al <span style="color:var(--hansa-tertiary-fixed);">15%</span> de interés.</div>
            <div style="font-size:10px;color:var(--hansa-outline);">Si no pagan, puedes embargar sus bienes o barcos.</div>
            <div class="flex gap-sm flex-wrap" style="align-items:center;margin-top:8px;">
              <select id="creditTarget" style="flex:1;min-width:100px;" class="hansa-select">
                ${CITIES.slice(0,8).map(c => `<option value="${c.id}">Noble de ${c.name}</option>`).join('')}
              </select>
              <input type="number" id="creditAmount" value="1000" min="100" max="10000" step="100"
                style="width:80px;background:rgba(0,31,63,0.4);border:1px solid #3a2a1a;color:#e0d8c0;font-family:inherit;font-size:12px;padding:4px 6px;border-radius:2px;">
              <button class="uiBtn uiBtnGold" id="btnIssueCredit" style="font-size:10px;">Emitir</button>
            </div>
          </div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Créditos Emitidos</div>
          <div id="loanCredits" style="font-size:11px;line-height:1.8;max-height:20vh;overflow-y:auto;"></div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Balance Financiero</div>
          <div id="loanBalance" style="font-size:12px;line-height:1.8;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('loanAmount')?.addEventListener('input', function() {
      const v = parseInt(this.value) || 0;
      document.getElementById('loanInterestPreview').textContent = '$' + Math.round(v * 1.1).toLocaleString();
    });
    document.getElementById('btnTakeLoan')?.addEventListener('click', () => {
      const amt = parseInt(document.getElementById('loanAmount')?.value) || 1000;
      engine.player.gold = (engine.player.gold||0) + amt;
      engine.player.loans = engine.player.loans||[];
      engine.player.loans.push({ amount: amt * 1.1, takenDay: engine.server.world.totalDays });
      this.refresh(engine, mgr);
    });
    document.getElementById('btnIssueCredit')?.addEventListener('click', () => {
      const amt = parseInt(document.getElementById('creditAmount')?.value) || 1000;
      const target = document.getElementById('creditTarget')?.value || 'lubeck';
      if ((engine.player?.gold||0) >= amt) {
        engine.player.gold -= amt;
        engine.player.credits = engine.player.credits||[];
        engine.player.credits.push({ amount: amt * 1.15, issuedDay: engine.server.world.totalDays, target, defaultRisk: Math.random() });
        this.refresh(engine, mgr);
      }
    });
  }
  refresh(engine, mgr) {
    const loans = engine.player?.loans || [];
    const credits = engine.player?.credits || [];
    document.getElementById('loanActive').innerHTML = loans.length
      ? loans.map((l, i) => {
          const daysLeft = 90 - (engine.server.world.totalDays - (l.takenDay||0));
          return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;font-size:10px;">
            <span style="color:#844;">Deuda #${i+1}</span>
            <span style="color:#ffd700;">$${(l.amount||0).toFixed(0)}</span>
            <span style="color:${daysLeft>0?'#8a7a5a':'#c66'};">${daysLeft>0?daysLeft+'d':'VENCIDO'}</span>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">Sin préstamos activos</span>';
    document.getElementById('loanCredits').innerHTML = credits.length
      ? credits.map((c, i) => {
          const daysLeft = 120 - (engine.server.world.totalDays - (c.issuedDay||0));
          const defaulted = c.defaultRisk < 0.1;
          return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;font-size:10px;">
            <span style="color:#4a8;">Crédito #${i+1}</span>
            <span style="color:#ffd700;">$${(c.amount||0).toFixed(0)}</span>
            <span style="color:${defaulted?'#c66':'#8a7a5a'};">${defaulted?'Impago':'${daysLeft>0?daysLeft+"d":"Vence"}'}</span>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">Ningún crédito emitido</span>';
    document.getElementById('loanBalance').innerHTML =
      `Oro disponible: <span style="color:#ffd700;">$${(engine.player?.gold||0).toFixed(0)}</span>
      <div>Créditos emitidos: <span style="color:#4a8;">$${credits.reduce((s,c) => s + (c.amount||0), 0).toFixed(0)}</span></div>
      <div>Deudas: <span style="color:#844;">$${loans.reduce((s,l) => s + (l.amount||0), 0).toFixed(0)}</span></div>
      <div style="margin-top:6px;font-size:10px;color:#6a6a4a;">
        Balance neto: <span style="color:${(engine.player?.gold||0) - loans.reduce((s,l)=>s+(l.amount||0),0) >= 0 ? '#4a8' : '#c66'};">
          $${((engine.player?.gold||0) - loans.reduce((s,l) => s + (l.amount||0), 0)).toFixed(0)}
        </span>
      </div>`;
  }
}
