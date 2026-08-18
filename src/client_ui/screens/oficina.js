import { ScreenBase } from './ScreenBase.js';
import { GOODS } from '../../database/goods.js';
import { CITIES } from '../../database/cities.js';

export class TradingOfficeScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Oficina Comercial', '\u{1F4CB}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:300px;">
          <div class="flex gap-base" style="margin-bottom:8px;">
            <button class="hansa-tab active" id="ofTabWarehouse" style="flex:1;">Almacén</button>
            <button class="hansa-tab" id="ofTabManager" style="flex:1;">Administrador</button>
            <button class="hansa-tab" id="ofTabDeposit" style="flex:1;">Depósito</button>
          </div>
          <div id="ofTabContent"></div>
        </div>
        <div style="flex:1;min-width:300px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Oficinas</div>
          <select id="ofCity" style="width:100%;margin-bottom:10px;" class="hansa-select"></select>
          <div id="ofOfficeList" style="font-size:11px;line-height:1.8;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('ofCity')?.addEventListener('change', () => this.refresh(engine,mgr));
    document.getElementById('ofTabWarehouse')?.addEventListener('click', () => { this._tab='warehouse'; this.refresh(engine,mgr); });
    document.getElementById('ofTabManager')?.addEventListener('click', () => { this._tab='manager'; this.refresh(engine,mgr); });
    document.getElementById('ofTabDeposit')?.addEventListener('click', () => { this._tab='deposit'; this.refresh(engine,mgr); });
    this._tab = 'warehouse';
  }
  refresh(engine, mgr) {
    const sel = document.getElementById('ofCity');
    if (sel.options.length === 0) {
      CITIES.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    }
    sel.value = engine.player?.currentCityId || 'lubeck';
    const offices = engine.player?.tradingOffices || {};
    const office = offices[sel.value];
    document.getElementById('ofOfficeList').innerHTML = office
      ? `<div style="color:#4a8;">\u2713 Oficina establecida</div>
        <div>Administrador: <span style="color:${office.managerHired?'#4a8':'#844'};">${office.managerHired?'Contratado':'Disponible'}</span></div>
        <div>Capacidad: <span style="color:#b0a080;">${Object.values(office.inventory||{}).reduce((s,v)=>s+v,0)}/${office.storageLimit||5000}</span></div>
        <div>Presupuesto: <span style="color:#ffd700;">$${(office.budget||0).toFixed(0)}</span></div>
        ${!office.managerHired ? '<button class="uiBtn uiBtnGold" id="ofHireMgr" style="margin-top:6px;">Contratar administrador ($300)</button>' : ''}
        <button class="uiBtn uiBtnGold" id="ofDepositBtn" style="margin-top:4px;">Depositar $1,000</button>
        <button class="uiBtn uiBtnSell" id="ofWithdrawBtn" style="margin-top:4px;">Retirar $1,000</button>`
      : `<span style="color:#5a5a3a;">Sin oficina</span>
        <div style="font-size:10px;color:#6a5a3a;margin:4px 0;">Necesitas 60 ladrillos, 20 madera, 10 herramientas</div>
        <button class="uiBtn uiBtnGold" id="ofBuild">Construir oficina</button>`;
    document.getElementById('ofHireMgr')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 300 && office) { engine.player.gold -= 300; office.managerHired = true; engine.player.tradingOffices[sel.value] = office; this.refresh(engine,mgr); }
    });
    document.getElementById('ofDepositBtn')?.addEventListener('click', () => {
      if (office && (engine.player?.gold||0) >= 1000) { engine.player.gold -= 1000; office.budget = (office.budget||0) + 1000; engine.player.tradingOffices[sel.value] = office; this.refresh(engine,mgr); }
    });
    document.getElementById('ofWithdrawBtn')?.addEventListener('click', () => {
      if (office && (office.budget||0) >= 1000) { office.budget -= 1000; engine.player.gold += 1000; engine.player.tradingOffices[sel.value] = office; this.refresh(engine,mgr); }
    });
    document.getElementById('ofBuild')?.addEventListener('click', () => {
      const ship = engine.player?.fleet?.[0];
      if (ship) {
        const bricks = ship.cargo?.bricks || 0;
        const timber = ship.cargo?.timber || 0;
        const tools = ship.cargo?.tools || 0;
        if (bricks >= 60 && timber >= 20 && tools >= 10) {
          ship.unloadCargo?.('bricks', 60); ship.unloadCargo?.('timber', 20); ship.unloadCargo?.('tools', 10);
          engine.player.tradingOffices[sel.value] = { built:true, managerHired:false, autoBuyRules:{}, autoSellRules:{}, reserves:{}, storageLimit:5000, inventory:{}, budget:0 };
          this.refresh(engine, mgr);
        }
      }
    });
    if (!office) { document.getElementById('ofTabContent').innerHTML = ''; return; }
    const tabContent = document.getElementById('ofTabContent');
    if (this._tab === 'warehouse') {
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Inventario en ${sel.options[sel.selectedIndex]?.textContent||''}</div>
        <div style="max-height:30vh;overflow-y:auto;font-size:11px;">${
          Object.keys(office.inventory||{}).length
            ? Object.entries(office.inventory).filter(([,v])=>v>0).map(([id,q]) => {
                const g = GOODS.find(x=>x.id===id);
                const volIcon = g?.volume==='cargo' ? '\u25A3' : '\u25CF';
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 6px;border-bottom:1px solid #1a1a0a;">
                  <span>${volIcon} ${g?.name||id}</span>
                  <span style="color:#b0a080;">${q}</span>
                </div>`;
              }).join('')
            : '<span style="color:#5a5a3a;">Vacío</span>'
        }</div>`;
    } else if (this._tab === 'manager') {
      if (!office.managerHired) {
        tabContent.innerHTML = '<span style="color:#5a5a3a;">Contrata un administrador primero.</span>';
        return;
      }
      office.autoBuyRules = office.autoBuyRules||{};
      office.autoSellRules = office.autoSellRules||{};
      office.reserves = office.reserves||{};
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Reglas Automáticas</div>
        <div style="font-size:10px;color:#6a6a4a;margin-bottom:6px;">Configura compra/venta automática. La columna "Reserva" protege inventario de rutas.</div>
        <div style="max-height:40vh;overflow-y:auto;">
          <div style="display:flex;padding:4px 6px;font-size:9px;color:#6a6a4a;text-transform:uppercase;border-bottom:1px solid #2a2a1a;">
            <span style="flex:1;">Bien</span>
            <span style="width:50px;text-align:center;">Comprar</span>
            <span style="width:60px;text-align:center;">Precio lím.</span>
            <span style="width:60px;text-align:center;">Cant. obj.</span>
            <span style="width:50px;text-align:center;">Vender</span>
            <span style="width:60px;text-align:center;">Precio mín.</span>
            <span style="width:60px;text-align:center;">Reserva</span>
          </div>
          ${GOODS.map(g => {
            const buy = office.autoBuyRules[g.id];
            const sell = office.autoSellRules[g.id];
            const reserve = office.reserves[g.id] || 0;
            return `<div style="display:flex;align-items:center;padding:4px 6px;border-bottom:1px solid #1a1a0a;font-size:11px;">
              <span style="flex:1;color:#d8d0b0;">${g.name}</span>
              <span style="width:50px;text-align:center;">
                <input type="checkbox" data-auto-buy="${g.id}" ${buy?'checked':''} style="accent-color:#4a8;">
              </span>
              <span style="width:60px;text-align:center;">
                <input type="number" data-buy-limit="${g.id}" value="${buy?.maxPrice||999}" min="0" max="9999" style="width:50px;background:#0a0a06;border:1px solid #2a1a0a;color:#e0d8c0;padding:2px;text-align:center;font-size:10px;font-family:inherit;">
              </span>
              <span style="width:60px;text-align:center;">
                <input type="number" data-buy-target="${g.id}" value="${buy?.targetStock||100}" min="0" max="9999" style="width:50px;background:#0a0a06;border:1px solid #2a1a0a;color:#e0d8c0;padding:2px;text-align:center;font-size:10px;font-family:inherit;">
              </span>
              <span style="width:50px;text-align:center;">
                <input type="checkbox" data-auto-sell="${g.id}" ${sell?'checked':''} style="accent-color:#c66;">
              </span>
              <span style="width:60px;text-align:center;">
                <input type="number" data-sell-min="${g.id}" value="${sell?.minPrice||0}" min="0" max="9999" style="width:50px;background:#0a0a06;border:1px solid #2a1a0a;color:#e0d8c0;padding:2px;text-align:center;font-size:10px;font-family:inherit;">
              </span>
              <span style="width:60px;text-align:center;">
                <input type="number" data-reserve="${g.id}" value="${reserve}" min="0" max="9999" style="width:50px;background:#0a0a06;border:1px solid #2a1a0a;color:#e0d8c0;padding:2px;text-align:center;font-size:10px;font-family:inherit;border-color:#6a5a2a;" title="Reserva: cantidad que no deben tocar las rutas automáticas">
              </span>
            </div>`;
          }).join('')}
        </div>
        <button class="uiBtn uiBtnGold" id="ofSaveAuto" style="margin-top:8px;">Guardar configuración</button>`;
      document.getElementById('ofSaveAuto')?.addEventListener('click', () => {
        const rulesBuy = {}, rulesSell = {}, reserves = {};
        document.querySelectorAll('[data-auto-buy]').forEach(cb => {
          if (cb.checked) {
            const gid = cb.dataset.autoBuy;
            const maxP = parseInt(document.querySelector(`[data-buy-limit="${gid}"]`)?.value) || 999;
            const target = parseInt(document.querySelector(`[data-buy-target="${gid}"]`)?.value) || 100;
            rulesBuy[gid] = { maxPrice: maxP, targetStock: target };
          }
        });
        document.querySelectorAll('[data-auto-sell]').forEach(cb => {
          if (cb.checked) {
            const gid = cb.dataset.autoSell;
            const minP = parseInt(document.querySelector(`[data-sell-min="${gid}"]`)?.value) || 0;
            rulesSell[gid] = { minPrice: minP, reserveStock: 0 };
          }
        });
        document.querySelectorAll('[data-reserve]').forEach(inp => {
          const v = parseInt(inp.value) || 0;
          if (v > 0) reserves[inp.dataset.reserve] = v;
        });
        office.autoBuyRules = rulesBuy;
        office.autoSellRules = rulesSell;
        office.reserves = reserves;
        engine.player.tradingOffices[sel.value] = office;
        this.refresh(engine, mgr);
      });
    } else if (this._tab === 'deposit') {
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Gestionar Oro</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <input type="number" id="ofDepositAmount" value="1000" min="1" max="999999" style="width:120px;background:#0a0a06;border:1px solid #3a2a1a;color:#e0d8c0;padding:4px 8px;font-family:inherit;font-size:12px;border-radius:2px;">
          <button class="uiBtn uiBtnGold" id="ofDepositCustom">Depositar</button>
          <button class="uiBtn uiBtnSell" id="ofWithdrawCustom">Retirar</button>
        </div>
        <div style="margin-top:12px;font-size:11px;color:#8a9a7a;">
          <div>Presupuesto oficina: <span style="color:#ffd700;">$${(office.budget||0).toFixed(0)}</span></div>
          <div>Tu oro: <span style="color:#ffd700;">$${(engine.player?.gold||0).toFixed(0)}</span></div>
        </div>
        <div style="margin-top:8px;font-size:10px;color:#6a6a4a;">
          El administrador usará el presupuesto para compras automáticas. Las ventas automáticas incrementan el presupuesto.
        </div>`;
      document.getElementById('ofDepositCustom')?.addEventListener('click', () => {
        const amt = parseInt(document.getElementById('ofDepositAmount')?.value) || 0;
        if (amt > 0 && (engine.player?.gold||0) >= amt && office) {
          engine.player.gold -= amt; office.budget = (office.budget||0) + amt;
          engine.player.tradingOffices[sel.value] = office; this.refresh(engine,mgr);
        }
      });
      document.getElementById('ofWithdrawCustom')?.addEventListener('click', () => {
        const amt = parseInt(document.getElementById('ofDepositAmount')?.value) || 0;
        if (amt > 0 && (office.budget||0) >= amt && office) {
          office.budget -= amt; engine.player.gold += amt;
          engine.player.tradingOffices[sel.value] = office; this.refresh(engine,mgr);
        }
      });
    }
  }
}
