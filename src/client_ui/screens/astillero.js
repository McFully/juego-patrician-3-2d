import { ScreenBase } from './ScreenBase.js';
import { CITIES, isShallowCity } from '../../database/cities.js';
import { Ship } from '../../data_models/Ship.js';

export class ShipyardScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Astillero y Dique Seco', '\u{1F6A2}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:300px;">
          <div class="flex gap-base mb-base">
            <button class="hansa-tab active" id="syTabBuild" style="flex:1;">Construir</button>
            <button class="hansa-tab" id="syTabRepair" style="flex:1;">Reparar</button>
            <button class="hansa-tab" id="syTabUpgrade" style="flex:1;">Mejorar</button>
          </div>
          <div id="syTabContent"></div>
        </div>
        <div style="flex:1;min-width:250px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Astillero</div>
          <select id="syCity" class="hansa-select" style="margin-bottom:10px;"></select>
          <div id="syInfo" class="text-sm text-muted" style="line-height:1.6;"></div>
          <div class="hansa-subtitle" style="margin-top:16px;">Flota Actual</div>
          <div id="syFleet" style="font-size:11px;line-height:1.8;max-height:25vh;overflow-y:auto;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('syCity')?.addEventListener('change', () => this.refresh(engine,mgr));
    document.getElementById('syTabBuild')?.addEventListener('click', () => { this._tab='build'; this.refresh(engine,mgr); });
    document.getElementById('syTabRepair')?.addEventListener('click', () => { this._tab='repair'; this.refresh(engine,mgr); });
    document.getElementById('syTabUpgrade')?.addEventListener('click', () => { this._tab='upgrade'; this.refresh(engine,mgr); });
    this._tab = 'build';
  }
  refresh(engine, mgr) {
    const sel = document.getElementById('syCity');
    if (sel.options.length === 0) {
      CITIES.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    }
    sel.value = engine.player?.currentCityId || 'lubeck';
    const city = engine.server.world.getCity(sel.value);
    const shallow = isShallowCity(sel.value);
    document.getElementById('syInfo').innerHTML =
      `Ciudad: <span style="color:#b0a080;">${sel.options[sel.selectedIndex]?.textContent||''}</span>
      <div>Calado: <span style="color:${shallow?'#c66':'#4a8'};">${shallow?'Fluvial (solo barcos ligeros)':'Marítimo'}</span></div>`;
    const tabContent = document.getElementById('syTabContent');
    if (this._tab === 'build') {
      const SHIP_DEFS = [
        { id:'snaikka', name:'Snaikka (Velero ligero)', gold:800, timber:20, hemp:10, tools:5, days:10, draft:'shallow', cargoMax:60, crewMax:15, hpMax:60, speed:12 },
        { id:'crayer', name:'Crayer (Velero mediano)', gold:2000, timber:40, iron:10, hemp:15, tools:10, days:20, draft:'deep', cargoMax:120, crewMax:25, hpMax:100, speed:10 },
        { id:'cog', name:'Cog (Mercante armado)', gold:5000, timber:80, iron:30, hemp:25, tools:15, bricks:20, days:35, draft:'deep', cargoMax:250, crewMax:40, hpMax:180, speed:8 },
        { id:'hulk', name:'Hulk (Galeón pesado)', gold:12000, timber:200, iron:80, hemp:50, tools:20, bricks:60, days:60, draft:'deep', cargoMax:500, crewMax:70, hpMax:350, speed:6 },
      ];
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Tipos de Barco</div>
        ${SHIP_DEFS.filter(sd => !shallow || sd.draft === 'shallow').map(sd => {
          const ship = engine.player?.fleet?.find(s => s.typeId === sd.id);
          const canAfford = (engine.player?.gold||0) >= sd.gold;
          const costStr = Object.entries(sd).filter(([k]) => !['id','name','days','draft','cargoMax','crewMax','hpMax','speed'].includes(k)).map(([k,v]) => k==='gold'?`$${v}`:`${v} ${k}`).join(', ');
          return `<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:8px 0;border-bottom:1px solid #1a1a0a;">
            <div style="flex:1;">
              <div style="color:${canAfford?'#d8d0b0':'#6a5a3a'};font-size:12px;">${sd.name}</div>
              <div style="font-size:10px;color:#8a7a5a;">
                Coste: ${costStr} | Tiempo: ${sd.days}d | Calado: ${sd.draft}
              </div>
              <div style="font-size:9px;color:#6a6a4a;">
                Carga: ${sd.cargoMax} | Trip: ${sd.crewMax} | HP: ${sd.hpMax} | Vel: ${sd.speed}n
              </div>
            </div>
            <button class="uiBtn uiBtnGold" data-ship="${sd.id}" ${canAfford?'':'disabled'} style="${canAfford?'':'opacity:0.4;cursor:default;'};margin-left:8px;white-space:nowrap;">Construir</button>
          </div>`;
        }).join('')}`;
      document.querySelectorAll('#syTabContent button[data-ship]').forEach(b => b.onclick = () => {
        const id = b.dataset.ship;
        const def = SHIP_DEFS.find(d => d.id === id);
        if (!def || (engine.player?.gold||0) < def.gold) return;
        const ship = new Ship(id, 'Nuevo ' + (id.charAt(0).toUpperCase() + id.slice(1)));
        ship.currentCityId = engine.player.currentCityId;
        ship.cargoCapacity = def.cargoMax;
        ship.crewMax = def.crewMax;
        ship.hpMax = def.hpMax;
        ship.hp = def.hpMax;
        ship.speed = def.speed;
        ship.draft = def.draft;
        engine.player.fleet.push(ship);
        engine.player.gold -= def.gold;
        this.refresh(engine, mgr);
      });
    } else if (this._tab === 'repair') {
      const fleet = engine.player?.fleet || [];
      const docked = fleet.filter(s => !s.inTransit);
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Barcos en Puerto</div>
        ${docked.length
          ? docked.map(s => {
              const hpPct = s.hpMax > 0 ? Math.round((s.hp||0)/s.hpMax*100) : 0;
              const repairCost = Math.round((s.hpMax - (s.hp||0)) * 1.5);
              return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1a1a0a;">
                <div>
                  <div style="color:#8ab4f8;font-size:11px;">${s.name}</div>
                  <div style="font-size:10px;color:#8a7a5a;">
                    HP: <span style="color:${hpPct>50?'#4a8':'#c66'};">${Math.round(s.hp||0)}/${s.hpMax||100} (${hpPct}%)</span>
                  </div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:10px;color:#ffd700;">$${repairCost}</div>
                  <button class="uiBtn uiBtnGold" data-repair="${s.name}" style="font-size:10px;padding:2px 8px;">Reparar</button>
                </div>
              </div>`;
            }).join('')
          : '<span style="color:#5a5a3a;">Sin barcos atracados</span>'}`;
      document.querySelectorAll('[data-repair]').forEach(b => b.onclick = () => {
        const s = fleet.find(ship => ship.name === b.dataset.repair && !ship.inTransit);
        if (!s) return;
        const repairCost = Math.round((s.hpMax - (s.hp||0)) * 1.5);
        if ((engine.player?.gold||0) >= repairCost && s.hp < s.hpMax) {
          engine.player.gold -= repairCost;
          s.hp = s.hpMax;
          this.refresh(engine, mgr);
        }
      });
    } else if (this._tab === 'upgrade') {
      const fleet = engine.player?.fleet || [];
      const upgradable = fleet.filter(s => (s.upgradeLevel||1) < 3);
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Mejoras de Barco</div>
        <div style="font-size:10px;color:#6a6a4a;margin-bottom:8px;">
          Mejorar un barco sacrifica un 15% de capacidad de carga pero añade +1 ranura de artillería.
        </div>
        ${upgradable.length
          ? upgradable.map(s => {
              const newLevel = (s.upgradeLevel||1) + 1;
              const newCargo = Math.round((s.cargoCapacity||0) * 0.85);
              const cost = newLevel * 1000;
              return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1a1a0a;">
                <div>
                  <div style="color:#8ab4f8;font-size:11px;">${s.name} (Nv.${s.upgradeLevel||1})</div>
                  <div style="font-size:10px;color:#8a7a5a;">
                    ${s.cargoCapacity||0} → ${newCargo} barriles | Armas: ${s.weaponSlots||0} → ${(s.weaponSlots||0)+1}
                  </div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:10px;color:#ffd700;">$${cost}</div>
                  <button class="uiBtn uiBtnGold" data-upgrade="${s.name}" style="font-size:10px;padding:2px 8px;">Nv.${newLevel}</button>
                </div>
              </div>`;
            }).join('')
          : '<span style="color:#5a5a3a;">Todos los barcos están en nivel máximo (3).</span>'}`;
      document.querySelectorAll('[data-upgrade]').forEach(b => b.onclick = () => {
        const s = fleet.find(ship => ship.name === b.dataset.upgrade);
        if (!s || (s.upgradeLevel||1) >= 3) return;
        const cost = ((s.upgradeLevel||1) + 1) * 1000;
        if ((engine.player?.gold||0) >= cost) {
          engine.player.gold -= cost;
          s.upgradeLevel = (s.upgradeLevel||1) + 1;
          s.cargoCapacity = Math.round((s.cargoCapacity||0) * 0.85);
          s.weaponSlots = (s.weaponSlots||0) + 1;
          this.refresh(engine, mgr);
        }
      });
    }
    const fleet = engine.player?.fleet || [];
    document.getElementById('syFleet').innerHTML = fleet.length
      ? fleet.map(s => `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #1a1a0a;">
          <span style="color:#8ab4f8;">${s.name}</span>
          <span style="color:#b0a080;font-size:10px;">Lv.${s.upgradeLevel||1} | ${s.cargoUsed||0}/${s.cargoCapacity||0} | ${Math.round(s.hp||0)}HP</span>
        </div>`).join('')
      : '<span style="color:#5a5a3a;">Flota vacía</span>';
  }
}
