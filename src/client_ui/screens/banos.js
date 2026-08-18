import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';

export class BathHouseScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Casa de Baños', '\u{1F6BF}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:280px;">
          <div class="hansa-subtitle">Consejeros en los Baños</div>
          <select id="bhCity" style="width:100%;margin-bottom:10px;" class="hansa-select"></select>
          <div id="bhCouncillors" style="font-size:11px;line-height:1.8;"></div>
        </div>
        <div style="flex:1;min-width:280px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Sobornos</div>
          <div style="font-size:12px;line-height:1.8;">
            <div style="color:var(--hansa-on-surface-variant);font-size:11px;">Utiliza el deslizador para elegir la cantidad. Sobornos altos compran votos para las elecciones.</div>
            <div style="margin-top:10px;">
              <div style="display:flex;justify-content:space-between;font-size:11px;">
                <span>Cantidad del soborno:</span>
                <span id="bhBribeAmount" style="color:var(--hansa-tertiary-fixed);font-weight:bold;">$25,000</span>
              </div>
              <input type="range" id="bhBribeSlider" min="25000" max="50000" value="25000" step="1000" style="width:100%;margin:8px 0;">
              <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--hansa-outline);">
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
            </div>
            <button class="uiBtn uiBtnGold" id="btnBribeBH" style="margin-top:10px;font-size:11px;padding:6px 16px;">Sobornar concejales</button>
            <div id="bhBribeResult" style="font-size:11px;margin-top:6px;"></div>
          </div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Influencia Política</div>
          <div id="bhInfluence" style="font-size:12px;line-height:1.8;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('bhCity')?.addEventListener('change', () => this.refresh(engine,mgr));
    document.getElementById('bhBribeSlider')?.addEventListener('input', function() {
      document.getElementById('bhBribeAmount').textContent = '$' + parseInt(this.value).toLocaleString();
    });
    document.getElementById('btnBribeBH')?.addEventListener('click', () => {
      const cityId = document.getElementById('bhCity')?.value || engine.player?.currentCityId;
      const amt = parseInt(document.getElementById('bhBribeSlider')?.value) || 25000;
      if ((engine.player?.gold||0) >= amt) {
        engine.player.gold -= amt;
        const pol = engine.politicalSystem;
        if (pol) {
          const influenceMonths = Math.floor(amt / 5000) * 2;
          pol.bribeCouncillors(cityId, influenceMonths);
          const repGain = Math.floor(amt / 10000);
          pol.reputationByCity[cityId] = Math.min(100, (pol.reputationByCity[cityId]||50) + repGain);
        }
        document.getElementById('bhBribeResult').innerHTML =
          `<span style="color:#4a8;">\u2714 Soborno de $${amt.toLocaleString()} realizado en los baños. ${Math.floor(amt / 5000) * 2} meses de influencia.</span>`;
        this.refresh(engine, mgr);
      } else {
        document.getElementById('bhBribeResult').innerHTML = '<span style="color:#c44;">No tienes suficiente oro.</span>';
      }
    });
  }
  refresh(engine, mgr) {
    const sel = document.getElementById('bhCity');
    if (sel.options.length === 0) {
      CITIES.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    }
    sel.value = engine.player?.currentCityId || 'lubeck';
    const pol = engine.politicalSystem;
    const councillors = pol.councillors?.[sel.value] || [];
    document.getElementById('bhCouncillors').innerHTML = councillors.length
      ? councillors.map((c,i) => {
          const bribed = c.bribed;
          const remaining = c.remainingMonths || 0;
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 6px;border-bottom:1px solid #1a1a0a;">
            <div style="display:flex;align-items:center;gap:8px;">
              <svg width="40" height="30" viewBox="0 0 40 30" style="display:block;">
                <rect x="5" y="12" width="30" height="12" rx="4" fill="none" stroke="${bribed ? '#ffd700' : '#6a6a4a'}" stroke-width="1.5"/>
                <rect x="8" y="24" width="4" height="4" rx="1" fill="${bribed ? '#ffd700' : '#6a6a4a'}"/>
                <rect x="28" y="24" width="4" height="4" rx="1" fill="${bribed ? '#ffd700' : '#6a6a4a'}"/>
                ${bribed ? `
                <circle cx="20" cy="9" r="5" fill="#ffd700"/>
                <rect x="7" y="16" width="26" height="5" rx="2" fill="rgba(255,215,0,0.25)"/>
                <path d="M 17 9.5 Q 20 12 23 9.5" fill="none" stroke="#0a0a06" stroke-width="0.7"/>
                ` : `
                <circle cx="33" cy="6" r="4" fill="#6a6a4a"/>
                <rect x="31" y="10" width="4" height="10" rx="2" fill="#6a6a4a"/>
                `}
              </svg>
              <div>
                <div style="color:#d8d0b0;">Concejal ${i+1}</div>
                <div style="font-size:10px;color:${bribed?'#4a8':'#8a7a5a'};">${bribed?'Sobornado ('+remaining+' meses)':'Neutral — disponible'}</div>
              </div>
            </div>
            <span style="color:${bribed?'#ffd700':'#6a6a4a'};font-size:10px;">${bribed?'\u2713':'·'}</span>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">Sin concejales en esta ciudad</span>';
    const rep = pol.reputationByCity?.[sel.value] || 50;
    const bribedCount = councillors.filter(c=>c.bribed).length;
    document.getElementById('bhInfluence').innerHTML =
      `Tu reputación: <span style="color:#ffd700;">${Math.round(rep)}</span>
      <div>Concejales sobornados: <span style="color:#b0a080;">${bribedCount}/${councillors.length}</span></div>
      <div>Próximas elecciones: <span style="color:#b0a080;">Diciembre</span></div>
      ${bribedCount > councillors.length/2 ? '<div style="color:#4a8;font-size:11px;margin-top:4px;">\u2B50 Mayoría asegurada en el concejo</div>' : ''}`;
  }
}
