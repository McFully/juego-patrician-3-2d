import { ScreenBase } from './ScreenBase.js';
import { FACTORIES } from '../../database/factories.js';
import { CITIES } from '../../database/cities.js';

export class ConstructionScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Construcción', '\u{1F3D7}'); }
  render() {
    return this.build(`
      <div class="flex gap-base">
        <div style="flex:1;">
          <div class="hansa-subtitle">Industrias</div>
          <select id="conCity" class="hansa-select" style="width:100%;margin-bottom:10px;"></select>
          <div id="conIndustries" style="font-size:12px;line-height:1.6;"></div>
        </div>
        <div style="flex:1;border-left:1px solid rgba(228,228,204,0.08);padding-left:16px;">
          <div class="hansa-subtitle">Edificios Cívicos</div>
          <div id="conCivic" style="font-size:12px;line-height:2;"></div>
          <div class="hansa-subtitle" style="margin:16px 0 8px;">Viviendas</div>
          <div id="conHousing" style="font-size:12px;line-height:1.8;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('conCity')?.addEventListener('change', () => this.refresh(engine,mgr));
  }
  refresh(engine, mgr) {
    const sel = document.getElementById('conCity');
    if (sel.options.length === 0) {
      CITIES.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    }
    sel.value = engine.player?.currentCityId || 'lubeck';
    const city = engine.server.world.getCity(sel.value);
    if (!city) return;
    const industrias = FACTORIES.filter(f => !city.factories.find(cf => cf.id === f.id)?.built);
    document.getElementById('conIndustries').innerHTML = industrias.length
      ? industrias.map(f => {
          const inputs = f.inputs?.map(i => `${i.amount} ${i.goodId}`).join(', ') || 'ninguno';
          const outputs = f.outputs?.map(o => `${o.amount} ${o.goodId}`).join(', ') || 'ninguno';
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #1a1a0a;">
            <div><span style="color:#d8d0b0;">${f.name}</span><br><span style="font-size:10px;color:#8a7a5a;">Consume: ${inputs} | Produce: ${outputs}</span></div>
            <button class="uiBtn uiBtnGold" data-factory="${f.id}">Construir ($2000)</button>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">Todas las industrias construidas</span>';
    document.querySelectorAll('#conIndustries button[data-factory]').forEach(b => b.onclick = () => {
      const id = b.dataset.factory;
      if ((engine.player?.gold||0) >= 2000) {
        engine.player.gold -= 2000;
        const factory = city.factories.find(f => f.id === id);
        if (factory) { factory.built = true; factory.workers = 0; }
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('conCivic').innerHTML =
      `<div style="display:flex;justify-content:space-between;padding:4px 0;">
        <span>Pozo <span style="color:${city.hasWell?'#4a8':'#844'};">[${city.hasWell?'Construido':'Disponible'}]</span></span>
        ${!city.hasWell ? '<button class="uiBtn" id="buildWell">Construir ($500)</button>' : '<span style="color:#4a8;">\u2713</span>'}
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;">
        <span>Hospital <span style="color:${city.hasHospital?'#4a8':'#844'};">[${city.hasHospital?'Construido':'Disponible'}]</span></span>
        ${!city.hasHospital ? '<button class="uiBtn" id="buildHospital">Construir ($1500)</button>' : '<span style="color:#4a8;">\u2713</span>'}
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;">
        <span>Baños <span style="color:${city.hasBathHouse?'#4a8':'#844'};">[${city.hasBathHouse?'Construido':'Disponible'}]</span></span>
        ${!city.hasBathHouse ? '<button class="uiBtn" id="buildBath">Construir ($1000)</button>' : '<span style="color:#4a8;">\u2713</span>'}
      </div>`;
    document.getElementById('buildWell')?.addEventListener('click', () => { if((engine.player?.gold||0)>=500){engine.player.gold-=500;city.hasWell=true;this.refresh(engine,mgr);} });
    document.getElementById('buildHospital')?.addEventListener('click', () => { if((engine.player?.gold||0)>=1500){engine.player.gold-=1500;city.hasHospital=true;this.refresh(engine,mgr);} });
    document.getElementById('buildBath')?.addEventListener('click', () => { if((engine.player?.gold||0)>=1000){engine.player.gold-=1000;city.hasBathHouse=true;this.refresh(engine,mgr);} });
    document.getElementById('conHousing').innerHTML =
      `Viviendas pobres: <span style="color:#b0a080;">${city.housingPoor||0} (${Math.round(city.housingOccupancyPoor*100)||0}% ocupado)</span>
      <div>Viviendas medias: <span style="color:#b0a080;">${city.housingMiddle||0} (${Math.round(city.housingOccupancyMiddle*100)||0}%)</span></div>
      <div>Viviendas ricas: <span style="color:#b0a080;">${city.housingRich||0} (${Math.round(city.housingOccupancyRich*100)||0}%)</span></div>`;
  }
}
