import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';

export class StockExchangeScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Bolsa de Valores', '\u{1F4C8}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:280px;">
          <div class="hansa-subtitle" style="margin:0 0 8px;">Cotizaciones</div>
          <div style="font-size:10px;color:var(--hansa-outline);margin-bottom:6px;">Compañías cotizadas en la Bolsa Hanseática</div>
          <div id="seStocks" style="font-size:11px;max-height:40vh;overflow-y:auto;"></div>
        </div>
        <div style="flex:1;min-width:280px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle" style="margin:0 0 8px;">Tu Cartera</div>
          <div id="sePortfolio" style="font-size:11px;line-height:1.8;"></div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">OPA Hostil</div>
          <div style="font-size:11px;color:#8a7a5a;line-height:1.6;">
            <div>Acumula más del 50% de una compañía para lanzar una OPA.</div>
            <div style="margin-top:6px;">
              <select id="seOPATarget" class="hansa-select" style="width:100%;"></select>
            </div>
            <button class="uiBtn uiBtnGold" id="btnOPA" style="margin-top:6px;font-size:10px;">Lanzar OPA ($50,000)</button>
            <div id="seOPAResult" style="font-size:11px;margin-top:4px;"></div>
          </div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('btnOPA')?.addEventListener('click', () => {
      const target = document.getElementById('seOPATarget')?.value;
      if ((engine.player?.gold||0) >= 50000) {
        engine.player.gold -= 50000;
        const shares = engine.player.stocks?.[target];
        if (shares) shares.owned = (shares.owned||0) + 51;
        document.getElementById('seOPAResult').textContent = '\u2714 OPA lanzada sobre ' + target;
        this.refresh(engine, mgr);
      }
    });
  }
  refresh(engine, mgr) {
    const companies = [
      { id:'hansa_1', name:'Compañía Hanseática del Norte', city:'lübeck', basePrice:120 },
      { id:'hansa_2', name:'Comerciantes Bálticos', city:'gdansk', basePrice:85 },
      { id:'hansa_3', name:'Gremio de Novgorod', city:'novgorod', basePrice:65 },
      { id:'hansa_4', name:'Ruta del Mar del Norte', city:'hamburg', basePrice:105 },
      { id:'hansa_5', name:'Comerciantes de Brujas', city:'bruges', basePrice:140 },
      { id:'hansa_6', name:'Liga de Bergen', city:'bergen', basePrice:75 },
    ];
    engine.player.stocks = engine.player.stocks || {};
    const yourStocks = engine.player.stocks;

    companies.forEach(c => {
      if (!yourStocks[c.id]) yourStocks[c.id] = { owned:0, avgPrice: c.basePrice };
    });

    const totalShares = 100;
    const sel = document.getElementById('seOPATarget');
    sel.innerHTML = companies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    document.getElementById('seStocks').innerHTML =
      `<div style="display:flex;padding:5px 6px;font-size:9px;color:#6a6a4a;text-transform:uppercase;border-bottom:1px solid #2a2a1a;">
        <span style="flex:1;">Compañía</span>
        <span style="width:60px;text-align:right;">Precio</span>
        <span style="width:50px;text-align:right;">Var.</span>
        <span style="width:60px;text-align:right;">Disp.</span>
        <span style="width:50px;"></span>
      </div>
      ${companies.map(c => {
        const volatility = Math.sin(Date.now()/10000 + companies.indexOf(c)*2) * 20;
        const price = Math.max(10, c.basePrice + volatility);
        const change = volatility;
        const available = totalShares - (yourStocks[c.id]?.owned||0);
        const changeColor = change > 0 ? '#4a8' : '#c44';
        return `<div style="display:flex;align-items:center;padding:5px 6px;border-bottom:1px solid #1a1a0a;font-size:11px;">
          <span style="flex:1;color:#b0a080;">${c.name}</span>
          <span style="width:60px;text-align:right;color:#ffd700;">$${price.toFixed(2)}</span>
          <span style="width:50px;text-align:right;color:${changeColor};">${change > 0 ? '+':''}${change.toFixed(1)}%</span>
          <span style="width:60px;text-align:right;color:#8a7a5a;">${available}</span>
          <button class="uiBtn uiBtnGold" data-buy="${c.id}" data-price="${price}" style="font-size:9px;padding:2px 6px;${available>0?'':'opacity:0.4;cursor:default;'}" ${available>0?'':'disabled'}>Comprar</button>
        </div>`;
      }).join('')}`;

    document.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
      const id = b.dataset.buy;
      const price = parseFloat(b.dataset.price);
      const cost = price * 10;
      if ((engine.player?.gold||0) >= cost && (yourStocks[id]?.owned||0) < totalShares) {
        engine.player.gold -= cost;
        yourStocks[id].owned = (yourStocks[id].owned||0) + 1;
        this.refresh(engine, mgr);
      }
    });

    const owned = Object.entries(yourStocks).filter(([,s]) => s.owned > 0);
    document.getElementById('sePortfolio').innerHTML = owned.length
      ? owned.map(([id, s]) => {
          const c = companies.find(x => x.id === id);
          const currentPrice = c ? c.basePrice + Math.sin(Date.now()/10000 + companies.indexOf(c)*2)*20 : 0;
          const value = s.owned * currentPrice * 10;
          const pct = Math.round((s.owned / totalShares) * 100);
          return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;">
            <div>
              <span style="color:#b0a080;">${c?.name||id}</span>
              <div style="font-size:9px;color:#6a6a4a;">${s.owned} acc. (${pct}%) - Precio medio: $${(s.avgPrice||0).toFixed(2)}</div>
            </div>
            <div style="text-align:right;">
              <span style="color:#ffd700;">$${value.toFixed(0)}</span>
            </div>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">No posees acciones todavía</span>';
  }
}
