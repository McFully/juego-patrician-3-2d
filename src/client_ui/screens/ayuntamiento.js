import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';

export class TownHallScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Ayuntamiento', '\u{1F3DB}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:220px;">
          <div class="flex gap-xs mb-base flex-wrap">
            <button class="hansa-tab active" id="thTabInfo" style="flex:1;">Tesorería</button>
            <button class="hansa-tab" id="thTabTax" style="flex:1;">Impuestos</button>
            <button class="hansa-tab" id="thTabWalls" style="flex:1;">Murallas</button>
          </div>
          <div id="thTabContent" style="font-size:12px;line-height:1.8;"></div>
        </div>
        <div style="flex:1;min-width:220px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Política</div>
          <select id="thCity" class="hansa-select" style="margin-bottom:6px;"></select>
          <div id="thPolitics" style="font-size:11px;line-height:1.8;"></div>
          <div class="hansa-subtitle" style="margin-top:16px;">Elecciones Alcalde</div>
          <div id="thElections" style="font-size:11px;"></div>
        </div>
        <div style="flex:1;min-width:220px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Tu Rango</div>
          <div id="thRank" style="font-size:11px;line-height:1.8;"></div>
          <div class="hansa-subtitle" style="margin-top:16px;">Alderman</div>
          <div id="thAlderman" style="font-size:11px;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('thCity')?.addEventListener('change', (e) => { engine.player.currentCityId = e.target.value; this.refresh(engine,mgr); });
    document.getElementById('thTabInfo')?.addEventListener('click', () => { this._tab='treasury'; this.refresh(engine,mgr); });
    document.getElementById('thTabTax')?.addEventListener('click', () => { this._tab='tax'; this.refresh(engine,mgr); });
    document.getElementById('thTabWalls')?.addEventListener('click', () => { this._tab='walls'; this.refresh(engine,mgr); });
    this._tab = 'treasury';
  }
  refresh(engine, mgr) {
    const sel = document.getElementById('thCity');
    if (sel.options.length === 0) {
      CITIES.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    }
    sel.value = engine.player?.currentCityId || 'lubeck';
    const city = engine.server.world.getCity(sel.value);
    if (!city) return;
    const pol = engine.politicalSystem;
    const rep = pol.reputationByCity?.[city.id] || 50;
    document.getElementById('thPolitics').innerHTML =
      `Tu reputación: <span style="color:#ffd700;">${Math.round(rep)}</span>
      <div>Concejales: <span style="color:#b0a080;">${pol.councillors?.[city.id]?.length || 0}</span></div>
      <div>Votos comprados: <span style="color:#b0a080;">${pol.councillors?.[city.id]?.filter(c=>c.bribed)?.length || 0}/${pol.councillors?.[city.id]?.length || 0}</span></div>
      <button class="uiBtn uiBtnGold" id="btnBribeTH" style="margin-top:6px;font-size:10px;">Sobornar concejales ($500)</button>`;
    document.getElementById('btnBribeTH')?.addEventListener('click', () => {
      if (engine.player.gold >= 500) { engine.player.gold -= 500; pol.bribeCouncillors(city.id, 6); this.refresh(engine,mgr); }
    });
    const tabContent = document.getElementById('thTabContent');
    if (this._tab === 'treasury') {
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Tesorería Municipal</div>
        <div style="font-size:11px;color:#8a9a7a;">
          <div>Arca: <span style="color:#ffd700;">$${(city.cityChest||0).toFixed(0)}</span></div>
          <div>Tu oro: <span style="color:#ffd700;">$${(engine.player?.gold||0).toFixed(0)}</span></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <input type="number" id="thDonateAmount" value="1000" min="1" max="999999" style="width:100px;background:#0a0a06;border:1px solid #3a2a1a;color:#e0d8c0;padding:4px;text-align:center;font-family:inherit;font-size:11px;border-radius:2px;">
          <button class="uiBtn uiBtnGold" id="thDonate" style="font-size:10px;">Donar (+rep)</button>
          <button class="uiBtn uiBtnSell" id="thExtract" style="font-size:10px;">Extraer (-rep)</button>
        </div>
        <div style="margin-top:8px;font-size:10px;color:#6a6a4a;">
          Donar aumenta tu reputación local. Extraer la daña pero te da oro.
        </div>
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid #2a2a1a;">
          <div class="hansa-subtitle">Edificios cívicos</div>
          <div>Murallas: <span style="color:#b0a080;">Nivel ${city.wallLevel||0}</span></div>
          <div>Pozo: <span style="color:${city.hasWell?'#4a8':'#844'};">${city.hasWell?'Sí':'No'}</span></div>
          <div>Hospital: <span style="color:${city.hasHospital?'#4a8':'#844'};">${city.hasHospital?'Sí':'No'}</span></div>
          <div>Baños: <span style="color:${city.hasBathHouse?'#4a8':'#844'};">${city.hasBathHouse?'Sí':'No'}</span></div>
          <div>Guardias: <span style="color:#b0a080;">${city.townGuards||0}</span></div>
        </div>`;
      document.getElementById('thDonate')?.addEventListener('click', () => {
        const amt = parseInt(document.getElementById('thDonateAmount')?.value) || 0;
        if (amt > 0 && (engine.player?.gold||0) >= amt) {
          engine.player.gold -= amt; city.cityChest = (city.cityChest||0) + amt;
          pol.reputationByCity[city.id] = Math.min(100, (pol.reputationByCity[city.id]||50) + amt/500);
          this.refresh(engine, mgr);
        }
      });
      document.getElementById('thExtract')?.addEventListener('click', () => {
        const amt = parseInt(document.getElementById('thDonateAmount')?.value) || 0;
        if (amt > 0 && (city.cityChest||0) >= amt) {
          city.cityChest -= amt; engine.player.gold += amt;
          pol.reputationByCity[city.id] = Math.max(0, (pol.reputationByCity[city.id]||50) - amt/200);
          this.refresh(engine, mgr);
        }
      });
    } else if (this._tab === 'tax') {
      city.propertyTax = city.propertyTax ?? 4;
      city.capitationTax = city.capitationTax ?? 0;
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Configuración de Impuestos</div>
        <div style="font-size:11px;line-height:2;">
          <div>Impuesto a la propiedad (recomendado 4%):
            <input type="range" id="thPropTax" min="0" max="10" value="${city.propertyTax}" step="0.5" style="width:120px;vertical-align:middle;">
            <span id="thPropTaxVal" style="color:#ffd700;font-size:12px;">${city.propertyTax}%</span>
          </div>
          <div>Capitatio (impuesto por cabeza):
            <input type="range" id="thCapTax" min="0" max="5" value="${city.capitationTax}" step="0.5" style="width:120px;vertical-align:middle;">
            <span id="thCapTaxVal" style="color:#ffd700;font-size:12px;">$${city.capitationTax}</span>
          </div>
        </div>
        <div style="margin-top:8px;font-size:10px;color:#6a6a4a;">
          Impuestos altos aumentan el arca municipal pero reducen la población y tu popularidad.
        </div>
        <button class="uiBtn uiBtnGold" id="thSaveTax" style="margin-top:8px;font-size:10px;">Aplicar impuestos</button>`;
      document.getElementById('thPropTax')?.addEventListener('input', function() {
        document.getElementById('thPropTaxVal').textContent = this.value + '%';
      });
      document.getElementById('thCapTax')?.addEventListener('input', function() {
        document.getElementById('thCapTaxVal').textContent = '$' + this.value;
      });
      document.getElementById('thSaveTax')?.addEventListener('click', () => {
        city.propertyTax = parseFloat(document.getElementById('thPropTax')?.value) || 4;
        city.capitationTax = parseFloat(document.getElementById('thCapTax')?.value) || 0;
        this.refresh(engine, mgr);
      });
    } else if (this._tab === 'walls') {
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Ampliación de Murallas</div>
        <div style="font-size:11px;color:#8a9a7a;">
          <div>Nivel actual: <span style="color:#b0a080;">${city.wallLevel||0}</span></div>
          <div>Coste siguiente nivel: <span style="color:#ffd700;">$${((city.wallLevel||0)+1)*1000}</span></div>
          <div>Requiere aprobación del concejo.</div>
        </div>
        <button class="uiBtn uiBtnGold" id="thExpandWall" style="margin-top:8px;font-size:10px;">Votar ampliación</button>
        <div class="hansa-subtitle" style="margin-top:16px;">Reclutar Guardias</div>
        <div style="font-size:11px;color:#8a9a7a;">
          <div>Guardias: <span style="color:#b0a080;">${city.townGuards||0}</span></div>
          <div>Coste: $200 + 5 herramientas por 5 guardias</div>
        </div>
        <button class="uiBtn uiBtnGold" id="thRecruitGuards" style="margin-top:6px;font-size:10px;">Reclutar 5 guardias</button>`;
      document.getElementById('thExpandWall')?.addEventListener('click', () => {
        const cost = ((city.wallLevel||0)+1)*1000;
        if ((engine.player?.gold||0) >= cost && (city.wallLevel||0) < 3) {
          engine.player.gold -= cost; city.wallLevel = (city.wallLevel||0) + 1;
          this.refresh(engine, mgr);
        }
      });
      document.getElementById('thRecruitGuards')?.addEventListener('click', () => {
        if ((engine.player?.gold||0) >= 200 && (city.market.goods?.tools?.stock||0) >= 5) {
          engine.player.gold -= 200; city.market.removeStock('tools', 5);
          city.townGuards = (city.townGuards||0) + 5;
          this.refresh(engine, mgr);
        }
      });
    }
    document.getElementById('thElections').innerHTML =
      `<div>Próximas elecciones: <span style="color:#b0a080;">Diciembre ${new Date().getFullYear()}</span></div>
      <div style="margin-top:6px;font-size:10px;color:#8a7a5a;">Candidatos por popularidad:</div>
      ${[1,2,3,4,5].map(i => {
        const pop = 50 - i*8 + Math.sin(i*7)*10;
        return `<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:10px;border-bottom:1px solid #1a1a0a;">
          <span style="color:#b0a080;">Candidato ${i}</span>
          <span style="color:${pop>50?'#4a8':'#844'};">${Math.round(pop)}% popularidad</span>
        </div>`;
      }).join('')}`;
    document.getElementById('thRank').innerHTML =
      `Rango actual: <span style="color:#ffd700;">${pol.getRankName()}</span>
      <div>Reputación global: <span style="color:#b0a080;">${Math.round(engine.player?.reputation||0)}</span></div>`;
    document.getElementById('thAlderman').innerHTML = pol.canBecomeAlderman
      ? (pol.canBecomeAlderman(engine.missionSystem?.completedMissions||[])
        ? `<span style="color:#4a8;">\u2713 Puedes optar a Alderman</span>
          <div style="margin-top:6px;font-size:10px;color:#8a7a5a;">Misiones federales:</div>
          <div style="font-size:10px;line-height:1.6;">
            <div>• Crear nueva ciudad (1000 hab. en 2 años)</div>
            <div>• Detener pirata infame (1 mes)</div>
            <div>• Destruir guarida pirata</div>
            <div>• Llevar ciudad a la prosperidad</div>
            <div>• Crear ruta comercial terrestre</div>
          </div>`
        : '<span style="color:#844;">Requisitos para Alderman no cumplidos</span>')
      : '<span style="color:#844;">Información no disponible</span>';
  }
}
