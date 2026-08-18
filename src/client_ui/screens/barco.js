import { ScreenBase } from './ScreenBase.js';
import { GOODS } from '../../database/goods.js';
import { CITIES } from '../../database/cities.js';

export class ShipScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Gestor de Flotas y Rutas', '\u{2693}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:220px;">
          <div class="flex gap-xs mb-base flex-wrap">
            <button class="hansa-tab active" id="shipTabInfo" style="flex:1;">Información</button>
            <button class="hansa-tab" id="shipTabCrew" style="flex:1;">Tripulación</button>
            <button class="hansa-tab" id="shipTabRoute" style="flex:1;">Ruta Auto</button>
          </div>
          <div id="shipTabContent" style="font-size:11px;line-height:1.6;"></div>
        </div>
        <div style="flex:1;min-width:240px;border-left:1px solid rgba(228,228,204,0.08);padding-left:10px;">
          <div class="hansa-subtitle">Flota</div>
          <select id="shipSelect" class="hansa-select" style="margin-bottom:6px;"></select>
          <div id="shipDetail" style="font-size:11px;line-height:1.8;"></div>
        </div>
        <div style="flex:1;min-width:240px;border-left:1px solid rgba(228,228,204,0.08);padding-left:10px;">
          <div class="hansa-subtitle">Carga</div>
          <div id="shipCargo" style="font-size:10px;line-height:1.6;max-height:25vh;overflow-y:auto;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('shipSelect')?.addEventListener('change', () => this.refresh(engine,mgr));
    document.getElementById('shipTabInfo')?.addEventListener('click', () => { this._tab='info'; this.refresh(engine,mgr); });
    document.getElementById('shipTabCrew')?.addEventListener('click', () => { this._tab='crew'; this.refresh(engine,mgr); });
    document.getElementById('shipTabRoute')?.addEventListener('click', () => { this._tab='route'; this.refresh(engine,mgr); });
    this._tab = 'info';
  }
  refresh(engine, mgr) {
    const fleet = engine.player?.fleet || [];
    const sel = document.getElementById('shipSelect');
    const prevVal = sel.value;
    sel.innerHTML = '';
    fleet.forEach((s,i) => {
      const o = document.createElement('option'); o.value = i;
      o.textContent = `${s.name} (${s.typeId})${s.inTransit?'\u{1F6EB}':''}`;
      sel.appendChild(o);
    });
    if (prevVal && sel.querySelector(`option[value="${prevVal}"]`)) sel.value = prevVal;
    if (!sel.value && sel.options.length > 0) sel.value = '0';
    const ship = fleet[parseInt(sel.value)];
    if (!ship) { document.getElementById('shipDetail').textContent = 'Sin barcos en la flota'; return; }
    const shipTypes = { snaikka:'Snaikka', crayer:'Crayer', cog:'Cog', hulk:'Hulk' };
    const hpPct = ship.hpMax > 0 ? Math.round((ship.hp||0)/ship.hpMax*100) : 0;
    const cargoPct = ship.cargoCapacity > 0 ? Math.round((ship.cargoUsed||0)/ship.cargoCapacity*100) : 0;
    document.getElementById('shipDetail').innerHTML =
      `<div style="color:#8ab4f8;font-size:13px;">${ship.name}</div>
      <div>Tipo: <span style="color:#b0a080;">${shipTypes[ship.typeId]||ship.typeId}</span></div>
      <div>Nivel: <span style="color:#ffd700;">${ship.upgradeLevel||1} / 3</span></div>
      <div style="margin-top:4px;">
        <div style="display:flex;justify-content:space-between;font-size:10px;">
          <span style="color:#8a7a5a;">HP</span>
          <span style="color:${hpPct>50?'#4a8':'#c66'};">${Math.round(ship.hp||0)}/${ship.hpMax||100}</span>
        </div>
        <div style="height:6px;background:#1a1a0a;border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${hpPct}%;background:${hpPct>50?'linear-gradient(90deg,#4a8,#6a8)':'linear-gradient(90deg,#c44,#c66)'};border-radius:3px;"></div>
        </div>
      </div>
      <div style="margin-top:4px;">
        <div style="display:flex;justify-content:space-between;font-size:10px;">
          <span style="color:#8a7a5a;">Carga</span>
          <span style="color:#b0a080;">${ship.cargoUsed||0}/${ship.cargoCapacity||0}</span>
        </div>
        <div style="height:6px;background:#1a1a0a;border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${cargoPct}%;background:linear-gradient(90deg,#4a6a2a,#6a8a3a);border-radius:3px;"></div>
        </div>
      </div>
      <div style="margin-top:6px;font-size:10px;color:#8a7a5a;">
        <div>Velocidad: <span style="color:#b0a080;">${ship.speed||0} nudos</span></div>
        <div>Calado: <span style="color:#b0a080;">${ship.draft||'medio'}</span></div>
        <div>Ranuras artillería: <span style="color:#b0a080;">${ship.weaponSlots||0}</span></div>
        <div>Mantenimiento: <span style="color:#ffd700;">$${Math.round((ship.hpMax||100)*0.05)}/semana</span></div>
        ${ship.inTransit ? '<div style="color:#8ab4f8;">\u{1F6EB} En tránsito: '+Math.round((ship.transitProgress||0)*100)+'%</div>' : '<div style="color:#5a5a3a;">\u{2693} Atracado</div>'}
      </div>`;
    const cargo = Object.entries(ship.cargo || {}).filter(([,v]) => v > 0);
    document.getElementById('shipCargo').innerHTML = cargo.length
      ? cargo.map(([id, q]) => {
          const g = GOODS.find(x => x.id === id);
          const volIcon = g?.volume === 'cargo' ? '\u25A3' : '\u25CF';
          return `<div style="display:flex;justify-content:space-between;padding:3px 4px;border-bottom:1px solid #1a1a0a;">
            <span>${volIcon} ${g?.name||id}</span>
            <span style="color:#b0a080;">${q}</span>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">Vacío</span>';
    const tabContent = document.getElementById('shipTabContent');
    if (this._tab === 'info') {
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Información del Barco</div>
        <div style="font-size:11px;line-height:1.8;">
          <div>HP máximo: <span style="color:#b0a080;">${ship.hpMax||100}</span></div>
          <div>Tripulación: <span style="color:#b0a080;">${ship.crew||0}/${ship.crewMax||0}</span></div>
          <div>Capacidad de carga: <span style="color:#b0a080;">${ship.cargoCapacity||0} unidades</span></div>
          <div>Sables: <span style="color:#b0a080;">${ship.sabers||0}</span></div>
          <div>Armas: <span style="color:#b0a080;">${ship.weapons?.length||0}/${ship.weaponSlots||0}</span></div>
          <div>Habilidad combate: <span style="color:#b0a080;">${(ship.fightingSkill||0).toFixed(1)}</span></div>
          <div>Habilidad navegación: <span style="color:#b0a080;">${(ship.sailingSkill||0).toFixed(1)}</span></div>
        </div>`;
    } else if (this._tab === 'crew') {
      const weaponSlots = ship.weapons || [];
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Asignar Tripulación</div>
        <div style="font-size:11px;line-height:1.8;">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span>Marineros: <span style="color:#b0a080;">${ship.crew||0}/${ship.crewMax||0}</span></span>
            <button class="uiBtn uiBtnGold" id="btnAddCrew" style="font-size:9px;">+1 ($50)</button>
            <button class="uiBtn uiBtnSell" id="btnRemoveCrew" style="font-size:9px;">-1</button>
          </div>
          <div style="margin-top:4px;font-size:10px;color:#6a6a4a;">Se necesita 1 sable por marinero para abordaje máximo.</div>
        </div>
        <div class="hansa-subtitle" style="margin-top:16px;">Equipar Armas</div>
        <div style="font-size:11px;line-height:1.8;">
          <div>Ranuras de armas: <span style="color:#b0a080;">${ship.weaponSlots||0}</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
            ${Array.from({length: ship.weaponSlots||0}, (_, i) => {
              const w = weaponSlots[i];
              return `<div style="width:32px;height:32px;border:1px solid ${w?'#6a8a3a':'#3a2a1a'};background:${w?'rgba(74,138,74,0.2)':'rgba(20,20,10,0.4)'};border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:14px;color:${w?'#4a8':'#3a3a1a'};">${w?'\u25A0':'\u25CB'}</div>`;
            }).join('')}
          </div>
          <div style="margin-top:4px;color:#8a7a5a;font-size:10px;">Sables: ${ship.sabers||0} (necesarios: ${ship.crew||0} para abordaje)</div>
          <div style="margin-top:4px;font-size:10px;color:${(ship.sabers||0) >= (ship.crew||0) ? '#4a8' : '#c66'};">
            ${(ship.sabers||0) >= (ship.crew||0) ? '\u2714 Ratio de abordaje óptimo' : '\u26A0 Necesitas más sables para abordaje máximo'}
          </div>
        </div>`;
      document.getElementById('btnAddCrew')?.addEventListener('click', () => {
        if ((engine.player?.gold||0) >= 50 && ship.crew < ship.crewMax) { engine.player.gold -= 50; ship.crew = (ship.crew||0)+1; this.refresh(engine,mgr); }
      });
      document.getElementById('btnRemoveCrew')?.addEventListener('click', () => {
        if (ship.crew > 0) { ship.crew--; this.refresh(engine,mgr); }
      });
    } else if (this._tab === 'route') {
      ship.autoRoute = ship.autoRoute || { waypoints: [], alertEnabled: true, autoRepairThreshold: 0.92, omitStops: false };
      const route = ship.autoRoute;
      const allCities = CITIES.sort((a,b) => a.name.localeCompare(b.name));
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Ruta Comercial Automática</div>
        <div style="font-size:10px;color:#6a6a4a;margin-bottom:6px;">Configura paradas y acciones para cada ciudad.</div>
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
          <select id="routeCityAdd" style="flex:1;min-width:80px;background:#0a0a06;border:1px solid #3a2a1a;color:#e0d8c0;font-family:inherit;font-size:10px;padding:3px 4px;border-radius:2px;">
            ${allCities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <button class="uiBtn uiBtnGold" id="routeAddCity" style="font-size:9px;">Añadir parada</button>
          <button class="uiBtn uiBtnSell" id="routeClear" style="font-size:9px;">Limpiar ruta</button>
        </div>
        <div id="routeWaypoints" style="font-size:10px;max-height:30vh;overflow-y:auto;border:1px solid #1a1a0a;padding:4px;background:rgba(0,0,0,0.2);" ondragover="event.preventDefault()" ondrop="handleRouteDrop(event)">
          ${route.waypoints.length > 0
            ? route.waypoints.map((wp, idx) => {
                const cityDef = allCities.find(c => c.id === wp.cityId);
                return `<div draggable="true" data-route-idx="${idx}" style="display:flex;flex-direction:column;padding:5px 4px;border-bottom:1px solid #2a2a1a;background:rgba(60,50,30,0.15);margin-bottom:4px;border-radius:2px;cursor:grab;transition:all 0.2s;" ondragstart="event.dataTransfer.setData('text/plain', '${idx}');this.style.opacity='0.4'" ondragend="this.style.opacity='1'" onmouseenter="this.style.borderColor='#5a4a2a'" onmouseleave="this.style.borderColor='transparent'">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:#8ab4f8;font-weight:bold;">${idx+1}. ${cityDef?.name||wp.cityId}</span>
                    <div style="display:flex;gap:2px;">
                      <button class="uiBtn" data-route-up="${idx}" style="font-size:8px;padding:1px 4px;">\u25B2</button>
                      <button class="uiBtn" data-route-down="${idx}" style="font-size:8px;padding:1px 4px;">\u25BC</button>
                      <button class="uiBtn uiBtnSell" data-route-del="${idx}" style="font-size:8px;padding:1px 4px;">\u2716</button>
                    </div>
                  </div>
                  <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                    <label style="color:#6a6a4a;font-size:9px;"><input type="checkbox" data-action="${idx}" data-act="load" ${wp.actions?.load?'checked':''} style="accent-color:#4a8;"> Cargar</label>
                    <label style="color:#6a6a4a;font-size:9px;"><input type="checkbox" data-action="${idx}" data-act="unload" ${wp.actions?.unload?'checked':''} style="accent-color:#c66;"> Descargar</label>
                    <label style="color:#6a6a4a;font-size:9px;"><input type="checkbox" data-action="${idx}" data-act="buy" ${wp.actions?.buy?'checked':''} style="accent-color:#4a8;"> Comprar</label>
                    <label style="color:#6a6a4a;font-size:9px;"><input type="checkbox" data-action="${idx}" data-act="sell" ${wp.actions?.sell?'checked':''} style="accent-color:#c66;"> Vender</label>
                  </div>
                  <div style="display:flex;gap:4px;margin-top:2px;flex-wrap:wrap;align-items:center;">
                    <span style="color:#6a6a4a;font-size:9px;">Precio mín:</span>
                    <input type="number" data-min-price="${idx}" value="${wp.minPrice||0}" min="0" max="9999" style="width:45px;background:#0a0a06;border:1px solid #2a1a0a;color:#e0d8c0;padding:1px 3px;text-align:center;font-size:9px;font-family:inherit;">
                    <span style="color:#6a6a4a;font-size:9px;">Precio máx:</span>
                    <input type="number" data-max-price="${idx}" value="${wp.maxPrice||999}" min="0" max="9999" style="width:45px;background:#0a0a06;border:1px solid #2a1a0a;color:#e0d8c0;padding:1px 3px;text-align:center;font-size:9px;font-family:inherit;">
                    <span style="color:#6a6a4a;font-size:9px;">Cantidad:</span>
                    <input type="number" data-qty="${idx}" value="${wp.qty||1}" min="1" max="999" style="width:35px;background:#0a0a06;border:1px solid #2a1a0a;color:#e0d8c0;padding:1px 3px;text-align:center;font-size:9px;font-family:inherit;">
                  </div>
                </div>`;
              }).join('')
            : '<span style="color:#5a5a3a;font-size:10px;">Sin paradas. Añade ciudades a la ruta.</span>'
          }
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;align-items:center;">
          <label style="font-size:10px;color:#8a7a5a;display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="routeAlert" ${route.alertEnabled?'checked':''} style="accent-color:#ffd700;">
            Notificar fin de viaje
          </label>
          <label style="font-size:10px;color:#8a7a5a;display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="routeOmit" ${route.omitStops?'checked':''} style="accent-color:#c66;">
            Omitir paradas (sin notificar)
          </label>
          <label style="font-size:10px;color:#8a7a5a;display:flex;align-items:center;gap:4px;">
            <input type="checkbox" id="routeAutoRepair" ${route.autoRepairEnabled?'checked':''} style="accent-color:#4a8;">
            Reparación automática
          </label>
          <label style="font-size:10px;color:#8a7a5a;display:flex;align-items:center;gap:4px;">
            Umbral HP: ${Math.round((route.autoRepairThreshold||0.92)*100)}%
            <input type="range" id="routeRepairThreshold" min="50" max="95" value="${Math.round((route.autoRepairThreshold||0.92)*100)}" style="width:60px;">
          </label>
        </div>
        <button class="uiBtn uiBtnGold" id="routeSave" style="margin-top:8px;font-size:10px;">Guardar ruta</button>
        <div id="routeStatus" style="margin-top:6px;font-size:10px;color:#8a7a5a;"></div>`;

      window.handleRouteDrop = function(e) {
        e.preventDefault();
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
        const toIdx = parseInt(e.target.closest('[data-route-idx]')?.dataset?.routeIdx);
        if (!isNaN(fromIdx) && !isNaN(toIdx) && fromIdx !== toIdx && route.waypoints[fromIdx] && route.waypoints[toIdx]) {
          const [removed] = route.waypoints.splice(fromIdx, 1);
          route.waypoints.splice(toIdx, 0, removed);
          this.refresh(engine, mgr);
        }
      }.bind(this);
      document.getElementById('routeAddCity')?.addEventListener('click', () => {
        const cid = document.getElementById('routeCityAdd')?.value;
        if (cid) {
          route.waypoints.push({ cityId: cid, actions: {}, minPrice: 0, maxPrice: 999, qty: 1 });
          this.refresh(engine, mgr);
        }
      });
      document.getElementById('routeClear')?.addEventListener('click', () => {
        route.waypoints = [];
        this.refresh(engine, mgr);
      });
      document.querySelectorAll('[data-route-up]').forEach(b => {
        b.onclick = () => {
          const idx = parseInt(b.dataset.routeUp);
          if (idx > 0) { [route.waypoints[idx-1], route.waypoints[idx]] = [route.waypoints[idx], route.waypoints[idx-1]]; this.refresh(engine, mgr); }
        };
      });
      document.querySelectorAll('[data-route-down]').forEach(b => {
        b.onclick = () => {
          const idx = parseInt(b.dataset.routeDown);
          if (idx < route.waypoints.length - 1) { [route.waypoints[idx], route.waypoints[idx+1]] = [route.waypoints[idx+1], route.waypoints[idx]]; this.refresh(engine, mgr); }
        };
      });
      document.querySelectorAll('[data-route-del]').forEach(b => {
        b.onclick = () => {
          const idx = parseInt(b.dataset.routeDel);
          route.waypoints.splice(idx, 1);
          this.refresh(engine, mgr);
        };
      });
      document.getElementById('routeSave')?.addEventListener('click', () => {
        route.alertEnabled = document.getElementById('routeAlert')?.checked || false;
        route.omitStops = document.getElementById('routeOmit')?.checked || false;
        route.autoRepairEnabled = document.getElementById('routeAutoRepair')?.checked || false;
        route.autoRepairThreshold = (parseInt(document.getElementById('routeRepairThreshold')?.value) || 92) / 100;
        document.querySelectorAll('[data-action]').forEach(cb => {
          const idx = parseInt(cb.dataset.action);
          const act = cb.dataset.act;
          if (route.waypoints[idx]) {
            route.waypoints[idx].actions = route.waypoints[idx].actions || {};
            route.waypoints[idx].actions[act] = cb.checked;
          }
        });
        document.querySelectorAll('[data-min-price]').forEach(inp => {
          const idx = parseInt(inp.dataset.minPrice);
          if (route.waypoints[idx]) route.waypoints[idx].minPrice = parseInt(inp.value) || 0;
        });
        document.querySelectorAll('[data-max-price]').forEach(inp => {
          const idx = parseInt(inp.dataset.maxPrice);
          if (route.waypoints[idx]) route.waypoints[idx].maxPrice = parseInt(inp.value) || 999;
        });
        document.querySelectorAll('[data-qty]').forEach(inp => {
          const idx = parseInt(inp.dataset.qty);
          if (route.waypoints[idx]) route.waypoints[idx].qty = parseInt(inp.value) || 1;
        });
        ship.autoRoute = route;
        document.getElementById('routeStatus').innerHTML = '<span style="color:#4a8;">\u2714 Ruta guardada correctamente.</span>';
        this.refresh(engine, mgr);
      });
    }
  }
}
