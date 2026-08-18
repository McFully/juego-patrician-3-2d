import { ScreenBase } from './ScreenBase.js';
import { GOODS } from '../../database/goods.js';

export class ArmoryScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Armero', '\u{2694}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:280px;">
          <div class="hansa-subtitle">Armas Navales</div>
          <div id="armWeapons" style="font-size:12px;line-height:2;"></div>
          <div class="hansa-subtitle" style="margin:16px 0 8px;">Sables</div>
          <div id="armSabers" style="font-size:12px;"></div>
          <div style="margin-top:4px;font-size:10px;color:var(--hansa-outline);">1 sable por marinero para abordaje máximo</div>
        </div>
        <div style="flex:1;min-width:280px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Armamento del Barco</div>
          <select id="armShipSelect" style="width:100%;margin-bottom:8px;" class="hansa-select"></select>
          <div class="flex gap-sm flex-wrap" style="margin-bottom:8px;">
            <span style="font-size:10px;color:#8a7a5a;">Ranuras:</span>
            <span id="armSlots" style="color:var(--hansa-on-surface-variant);font-size:10px;">0</span>
            <span style="font-size:10px;color:#8a7a5a;">| Sables:</span>
            <span id="armSabersCount" style="color:var(--hansa-on-surface-variant);font-size:10px;">0</span>
          </div>
          <div id="armShipWeapons" style="font-size:11px;line-height:1.8;"></div>
          <div class="hansa-subtitle" style="margin:16px 0 8px;">Armas de Mano</div>
          <div id="armHand" style="font-size:12px;line-height:1.8;"></div>
          <div style="font-size:10px;color:var(--hansa-outline);margin-top:4px;">Solo visible si eres Alcalde. Materiales necesarios: Cuero, Cáñamo, Madera, Hierro.</div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('armShipSelect')?.addEventListener('change', () => this.refresh(engine,mgr));
  }
  refresh(engine, mgr) {
    const WEAPONS = [
      { id:'catapult', name:'Catapulta', cost:300, damage:15, mats:{ timber:5, hemp:3 } },
      { id:'ballesta', name:'Ballesta', cost:500, damage:25, mats:{ timber:8, hemp:5, iron:2 } },
      { id:'bombarda', name:'Bombarda', cost:1200, damage:45, mats:{ timber:15, iron:8, hemp:5 } },
      { id:'canon', name:'Cañón', cost:2000, damage:60, mats:{ timber:20, iron:15, tools:3 } },
    ];
    document.getElementById('armWeapons').innerHTML = WEAPONS.map(w => {
      const matsStr = Object.entries(w.mats).map(([k,v]) => `${v} ${k}`).join(', ');
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #1a1a0a;">
        <div>
          <span style="color:#d8d0b0;">${w.name}</span>
          <span style="font-size:10px;color:#8a7a5a;">(daño: ${w.damage})</span>
          <div style="font-size:9px;color:#6a6a4a;">Materiales: ${matsStr}</div>
        </div>
        <div style="text-align:right;">
          <span style="color:#ffd700;font-size:11px;">$${w.cost}</span>
          <button class="uiBtn uiBtnGold" data-weapon="${w.id}" style="margin-left:6px;font-size:10px;">Comprar</button>
        </div>
      </div>`;
    }).join('');
    document.querySelectorAll('#armWeapons button[data-weapon]').forEach(b => b.onclick = () => {
      const w = WEAPONS.find(x => x.id === b.dataset.weapon);
      if (!w || (engine.player?.gold||0) < w.cost) return;
      const sel = document.getElementById('armShipSelect');
      const fleet = engine.player?.fleet || [];
      const ship = fleet[parseInt(sel?.value)] || fleet[0];
      if (ship && (ship.weaponSlots||0) > (ship.weapons?.length||0)) {
        engine.player.gold -= w.cost;
        ship.weapons = ship.weapons||[];
        ship.weapons.push({ id: w.id, hp: 100 });
        this.refresh(engine, mgr);
      }
    });
    const fleet = engine.player?.fleet || [];
    const sel = document.getElementById('armShipSelect');
    const prevVal = sel.value;
    sel.innerHTML = '';
    fleet.forEach((s,i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${s.name} (Lv.${s.upgradeLevel||1})`; sel.appendChild(o); });
    if (prevVal && sel.querySelector(`option[value="${prevVal}"]`)) sel.value = prevVal;
    if (!sel.value && sel.options.length > 0) sel.value = '0';
    const ship = fleet[parseInt(sel.value)];
    document.getElementById('armSlots').textContent = `${ship?.weapons?.length||0}/${ship?.weaponSlots||0}`;
    document.getElementById('armSabersCount').textContent = ship?.sabers||0;

    document.getElementById('armShipWeapons').innerHTML = ship?.weapons?.length
      ? ship.weapons.map(w => {
          const def = WEAPONS.find(x => x.id === w.id);
          return `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #1a1a0a;font-size:10px;">
            <span style="color:#b0a080;">\u25A0 ${def?.name||w.id}</span>
            <span style="color:#8a7a5a;">daño: ${def?.damage||'?'}</span>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">Sin armas equipadas</span>';
    document.getElementById('armSabers').innerHTML =
      `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span>Sables en ${ship?.name||'barco'}: <span style="color:#b0a080;">${ship?.sabers||0}</span></span>
        <button class="uiBtn uiBtnGold" id="btnBuySabers" style="font-size:10px;">Comprar 10 sables ($100)</button>
        <button class="uiBtn uiBtnSell" id="btnSellSabers" style="font-size:10px;">Vender 10 sables ($50)</button>
      </div>`;
    document.getElementById('btnBuySabers')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 100 && ship) { engine.player.gold -= 100; ship.sabers = (ship.sabers||0)+10; this.refresh(engine,mgr); }
    });
    document.getElementById('btnSellSabers')?.addEventListener('click', () => {
      if (ship && (ship.sabers||0) >= 10) { engine.player.gold += 50; ship.sabers -= 10; this.refresh(engine,mgr); }
    });
    document.getElementById('armHand').innerHTML =
      `<div style="color:#8a7a5a;">Armas de mano para guardias municipales:</div>
      <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;">
        <button class="uiBtn" id="armHandLance" style="font-size:10px;">Lanzas ($200, 5 madera)</button>
        <button class="uiBtn" id="armHandSword" style="font-size:10px;">Espadas ($500, 3 hierro, 2 cuero)</button>
        <button class="uiBtn" id="armHandCrossbow" style="font-size:10px;">Ballestas ($800, 4 madera, 2 cáñamo)</button>
      </div>
      <div id="armHandInfo" style="font-size:10px;color:#6a6a4a;margin-top:4px;"></div>`;
    document.getElementById('armHandLance')?.addEventListener('click', () => {
      const city = engine.server.world.getCity(engine.player?.currentCityId);
      if (city && (engine.player?.gold||0) >= 200 && (city.market.goods?.timber?.stock||0) >= 5) {
        engine.player.gold -= 200; city.market.removeStock('timber', 5);
        city.townGuards = (city.townGuards||0) + 5;
        document.getElementById('armHandInfo').textContent = '5 lanzas equipadas a guardias.';
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('armHandSword')?.addEventListener('click', () => {
      const city = engine.server.world.getCity(engine.player?.currentCityId);
      if (city && (engine.player?.gold||0) >= 500 && (city.market.goods?.iron?.stock||0) >= 3 && (city.market.goods?.wool?.stock||0) >= 2) {
        engine.player.gold -= 500; city.market.removeStock('iron', 3); city.market.removeStock('wool', 2);
        city.townGuards = (city.townGuards||0) + 3;
        document.getElementById('armHandInfo').textContent = '3 espadas equipadas a guardias.';
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('armHandCrossbow')?.addEventListener('click', () => {
      const city = engine.server.world.getCity(engine.player?.currentCityId);
      if (city && (engine.player?.gold||0) >= 800 && (city.market.goods?.timber?.stock||0) >= 4 && (city.market.goods?.hemp?.stock||0) >= 2) {
        engine.player.gold -= 800; city.market.removeStock('timber', 4); city.market.removeStock('hemp', 2);
        city.townGuards = (city.townGuards||0) + 2;
        document.getElementById('armHandInfo').textContent = '2 ballestas equipadas a guardias.';
        this.refresh(engine, mgr);
      }
    });
  }
}
