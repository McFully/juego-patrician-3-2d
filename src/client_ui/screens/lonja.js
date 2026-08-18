import { ScreenBase } from './ScreenBase.js';
import { GOODS } from '../../database/goods.js';
import { calculateDemand } from '../../database/consumption.js';
import { CITIES } from '../../database/cities.js';

export class MarketScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Lonja Municipal', '\u{1F3EC}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:2;min-width:480px;">
          <div class="flex gap-base mb-base items-center flex-wrap">
            <select id="marketCity" class="hansa-select" style="width:180px;"></select>
            <span class="text-muted text-sm">Arca:</span>
            <span id="marketChest" class="text-gold text-sm"></span>
            <span class="text-muted text-sm" style="margin-left:12px;">Población total:</span>
            <span id="marketTotalPop" class="text-muted text-sm"></span>
          </div>
          <div id="marketGoods" style="max-height:48vh;overflow-y:auto;border:1px solid rgba(228,228,204,0.05);background:rgba(0,31,63,0.3);border-radius:8px;"></div>
        </div>
        <div style="flex:1;min-width:200px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="flex gap-base mb-base">
            <button class="hansa-tab active" id="tabConsumption" style="flex:1;">Consumo</button>
            <button class="hansa-tab" id="tabPopulation" style="flex:1;">Población</button>
          </div>
          <div id="marketDetail" class="text-sm text-muted" style="line-height:1.8;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('marketCity')?.addEventListener('change', (e) => {
      engine.player.currentCityId = e.target.value;
      this.refresh(engine, mgr);
    });
    document.getElementById('tabConsumption')?.addEventListener('click', () => {
      this._detailTab = 'consumption';
      this.refresh(engine, mgr);
    });
    document.getElementById('tabPopulation')?.addEventListener('click', () => {
      this._detailTab = 'population';
      this.refresh(engine, mgr);
    });
    this._detailTab = 'consumption';
  }
  refresh(engine, mgr) {
    const state = engine.getGameState();
    if (!state) return;
    const sel = document.getElementById('marketCity');
    if (sel.options.length === 0) {
      CITIES.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    }
    sel.value = engine.player?.currentCityId || 'lubeck';
    const city = engine.server.world.getCity(sel.value);
    if (!city) return;
    document.getElementById('marketChest').textContent = `$${(city.cityChest||0).toFixed(0)}`;
    document.getElementById('marketTotalPop').textContent = city.totalPopulation.toLocaleString();

    const fleet = engine.player?.fleet || [];
    const shipIdx = 0;
    const ship = fleet[shipIdx];

    const sorted = [...GOODS];
    const header = `<div style="display:flex;padding:6px 8px;background:rgba(30,24,16,0.6);border-bottom:1px solid #2a2a1a;font-size:10px;color:#6a6a4a;letter-spacing:1px;text-transform:uppercase;font-weight:normal;">
      <span style="width:24px;"></span>
      <span style="flex:1;">Bien</span>
      <span style="width:70px;text-align:right;">Stock local</span>
      <span style="width:80px;text-align:right;">Compra (V)</span>
      <span style="width:80px;text-align:right;">Venta (C)</span>
      <span style="width:70px;text-align:right;">En barco</span>
      <span style="width:60px;text-align:center;">Vol</span>
      <span style="width:90px;text-align:right;">Acción</span>
    </div>`;
    const rows = sorted.map(g => {
      const price = city.market.getPrice(g.id);
      const stock = Math.round(city.market.goods[g.id]?.stock || 0);
      const buyPrice = price * 1.08;
      const sellPrice = price * 0.92;
      const shipStock = ship?.cargo?.[g.id] || 0;
      const volIcon = g.volume === 'cargo' ? '\u25A3' : '\u25CF';
      const volLabel = g.volume === 'cargo' ? '10ud' : '1b';
      const trend = stock < (g.sMin||100) ? '\u26A1' : stock > (g.sMax||500) ? '\u25BD' : '\u00B7';
      const trendColor = stock < (g.sMin||100) ? '#c44' : stock > (g.sMax||500) ? '#4a8' : '#6a6a4a';
      return `<div style="display:flex;align-items:center;padding:5px 8px;border-bottom:1px solid #1a1a0a;font-size:11px;">
        <span style="width:24px;font-size:14px;color:${trendColor};">${trend}</span>
        <span style="flex:1;color:#d8d0b0;">${volIcon} ${g.name}</span>
        <span style="width:70px;text-align:right;color:#8a9a7a;">${stock}</span>
        <span style="width:80px;text-align:right;color:#c66;">$${sellPrice.toFixed(2)}</span>
        <span style="width:80px;text-align:right;color:#4a8;">$${buyPrice.toFixed(2)}</span>
        <span style="width:70px;text-align:right;color:#b0a080;">${shipStock}</span>
        <span style="width:60px;text-align:center;color:#6a6a4a;font-size:9px;">${volLabel}</span>
        <span style="width:90px;display:flex;gap:2px;justify-content:flex-end;">
          <button class="uiBtn uiBtnBuy" data-g="${g.id}" data-q="1" style="font-size:9px;padding:2px 5px;">C1</button>
          <button class="uiBtn uiBtnBuy" data-g="${g.id}" data-q="10" style="font-size:9px;padding:2px 5px;">C10</button>
          <button class="uiBtn uiBtnSell" data-g="${g.id}" data-q="1" style="font-size:9px;padding:2px 5px;">V1</button>
          <button class="uiBtn uiBtnSell" data-g="${g.id}" data-q="10" style="font-size:9px;padding:2px 5px;">V10</button>
        </span>
      </div>`;
    }).join('');
    document.getElementById('marketGoods').innerHTML = header + rows;
    document.querySelectorAll('#marketGoods .uiBtnBuy').forEach(b => b.onclick = () => { engine.playerBuy(b.dataset.g, parseInt(b.dataset.q)); this.refresh(engine,mgr); });
    document.querySelectorAll('#marketGoods .uiBtnSell').forEach(b => b.onclick = () => { engine.playerSell(b.dataset.g, parseInt(b.dataset.q)); this.refresh(engine,mgr); });

    const detail = document.getElementById('marketDetail');
    if (this._detailTab === 'consumption') {
      const demand = calculateDemand(city.popPoor, city.popMiddle, city.popRich);
      const goodsList = GOODS.slice(0, 6);
      detail.innerHTML = `<div class="hansa-subtitle">Consumo población</div>
        ${goodsList.map(g => {
          const d = demand[g.id] || 0;
          return `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #1a1a0a;padding:2px 0;">
            <span>${g.name}</span><span style="color:#b0a080;">${(d/7).toFixed(1)}/día</span>
          </div>`;
        }).join('')}
        <div class="hansa-subtitle" style="margin-top:12px;">Consumo fábricas</div>
        ${city.factories.filter(f=>f.built).slice(0,6).map(f => {
          const inputs = f.inputs?.map(i => `${Math.round((i.amount||0)/7*10)/10} ${i.goodId}`).join(', ') || '—';
          return `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #1a1a0a;padding:2px 0;font-size:10px;">
            <span style="color:#8ab4f8;">${f.name}</span><span style="color:#8a7a5a;">${inputs}</span>
          </div>`;
        }).join('')}
        <div class="hansa-subtitle" style="margin-top:12px;">Desglose por clase</div>
        <div style="font-size:10px;color:#8a7a5a;">
          <div>Pobres (${city.popPoor}): ${(city.popPoor*(0.02+0.018+0.012+0.008)).toFixed(1)} ud/día</div>
          <div>Clase media (${city.popMiddle}): ${(city.popMiddle*(0.035+0.025+0.02+0.015+0.01)).toFixed(1)} ud/día</div>
          <div>Ricos (${city.popRich}): ${(city.popRich*(0.04+0.03+0.025+0.02+0.015+0.01+0.005)).toFixed(1)} ud/día</div>
        </div>`;
    } else {
      detail.innerHTML =
        `<div class="hansa-subtitle">Población de ${city.name}</div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #1a1a0a;padding:3px 0;">
          <span>Pobres</span><span style="color:#b0a080;">${city.popPoor}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #1a1a0a;padding:3px 0;">
          <span>Clase media</span><span style="color:#b0a080;">${city.popMiddle}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #1a1a0a;padding:3px 0;">
          <span>Ricos</span><span style="color:#b0a080;">${city.popRich}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #1a1a0a;padding:3px 0;">
          <span>Mendigos</span><span style="color:#b0a080;">${city.popBeggar||0}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #1a1a0a;">
          <span>Total</span><span style="color:#ffd700;">${city.totalPopulation}</span>
        </div>
        <div style="margin-top:8px;font-size:10px;color:#6a6a4a;">
          <div>Viviendas pobres: ${city.housingPoor||0} (${Math.round((city.housingOccupancyPoor||0)*100)}%)</div>
          <div>Viviendas medias: ${city.housingMiddle||0} (${Math.round((city.housingOccupancyMiddle||0)*100)}%)</div>
          <div>Viviendas ricas: ${city.housingRich||0} (${Math.round((city.housingOccupancyRich||0)*100)}%)</div>
        </div>`;
    }
  }
}
