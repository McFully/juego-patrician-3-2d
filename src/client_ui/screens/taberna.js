import { ScreenBase } from './ScreenBase.js';

export class TavernScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Taberna', '\u{1F37A}'); }
  render() {
    return this.build(`
      <style>
        .cf-figure { position:relative; width:40px; height:50px; display:inline-block; vertical-align:middle; flex-shrink:0; }
        .cf-head { position:absolute; top:2px; left:50%; transform:translateX(-50%); width:10px; height:10px; border-radius:50%; background:var(--cf-color); }
        .cf-body { position:absolute; top:13px; left:50%; transform:translateX(-50%); width:20px; height:22px; background:var(--cf-color); clip-path:polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%); }
        .cf-table { position:absolute; bottom:2px; left:50%; transform:translateX(-50%); width:28px; height:2px; background:var(--cf-color); opacity:0.5; border-radius:1px; }
      </style>
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:260px;">
          <div class="hansa-subtitle">Personajes en la Taberna</div>
          <div id="tabCharacters" style="font-size:11px;line-height:1.6;"></div>
        </div>
        <div style="flex:1;min-width:260px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Habitación Trasera</div>
          <div id="tabMissions" style="font-size:11px;"></div>
          <div class="hansa-subtitle" style="margin:16px 0 6px;">Misiones Activas</div>
          <div id="tabActiveMissions" style="font-size:11px;line-height:1.6;"></div>
        </div>
        <div style="flex:1;min-width:260px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Informador</div>
          <div id="tabInfo" style="font-size:11px;color:var(--hansa-on-surface-variant);line-height:1.6;min-height:100px;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
  }
  refresh(engine, mgr) {
    const ship = engine.player?.fleet?.[0];
    const sailorsAvail = ship ? Math.max(0, (ship.crewMax||0) - (ship.crew||0)) : 0;
    const hasPirateShip = engine.player?.fleet?.some(s => ['crayer','snaikka'].includes(s.typeId));
    const rand = Math.random;
    const characters = [
      { role:'Marinero', desc:`Marineros disponibles: ${sailorsAvail}`, action:'Contratar tripulación ($50/marinero)', id:'tabHireSailor' },
      { role:'Capitán', desc:`Navegación: ${(1+rand()*4).toFixed(1)}/5 · Combate: ${(1+rand()*4).toFixed(1)}/5 · Coste: ${(200+rand()*300).toFixed(0)}`, action:'', id:'' },
      { role:'Informador', desc:'Vende información sobre piratas y mercados', action:'Preguntar ($100)', id:'tabAskInfo' },
      { role: hasPirateShip?'Pirata':'—', desc: hasPirateShip?'Puedes entregar un barco ligero para atacar competidores':'Necesitas un Crayer o Snaikka', action: hasPirateShip?'Entregar barco':'', id:hasPirateShip?'tabPirateAttack':'' },
      { role:'Traficante', desc:'Vende armas en secreto', action:'Comprar armas ilegales ($500)', id:'tabSmuggler' },
      { role:'Ladrón', desc:'Puede robar un cargamento de un competidor', action:'Contratar ladrón ($800)', id:'tabBurglar' },
    ];
    const roleColors = { 'Marinero':'#4a8', 'Capit\u00E1n':'#ffd700', 'Informador':'#a8f', 'Pirata':'#c44', 'Traficante':'#4a8', 'Ladr\u00F3n':'#666' };
    document.getElementById('tabCharacters').innerHTML = characters.filter(c => c.role !== '—').map(c =>
      `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 6px;border-bottom:1px solid #1a1a0a;">
        <div>
          <div style="display:flex;align-items:center;gap:6px;">
            <div class="cf-figure" style="--cf-color: ${roleColors[c.role] || '#b0a080'};">
              <div class="cf-head"></div>
              <div class="cf-body"></div>
              <div class="cf-table"></div>
            </div>
            <div>
              <div style="color:#d8d0b0;">${c.role}</div>
              <div style="font-size:10px;color:#8a7a5a;">${c.desc}</div>
            </div>
          </div>
        </div>
        ${c.action ? `<button class="uiBtn uiBtnGold" id="${c.id}" style="font-size:9px;padding:3px 8px;white-space:nowrap;">${c.action.split('(')[0]}</button>` : ''}
      </div>
    `).join('');
    document.getElementById('tabHireSailor')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 50 && ship && ship.crew < ship.crewMax) {
        engine.player.gold -= 50; ship.crew = Math.min(ship.crewMax, (ship.crew||0)+1);
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('tabAskInfo')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 100) {
        engine.player.gold -= 100;
        const rumors = [
          'Se dice que hay ${Math.round(50+rand()*200)} barriles de grano barato en ${["Riga","Bergen","Novgorod","Bruges","Londres"][Math.floor(rand()*5)]}.',
          'Un cargamento de vino fue avistado cerca de ${["Gdańsk","Köln","Visby"][Math.floor(rand()*3)]}.',
          'Piratas merodean las rutas del ${rand()>0.5?"Báltico":"Mar del Norte"}.',
          'Los precios de la madera subirán la próxima semana en ${["Lübeck","Hamburgo","Bremen"][Math.floor(rand()*3)]}.',
        ];
        document.getElementById('tabInfo').innerHTML = `<div style="color:#8ab4f8;">"${rumors[Math.floor(rand()*rumors.length)]}"</div>`;
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('tabPirateAttack')?.addEventListener('click', () => {
      const lightShip = engine.player?.fleet?.find(s => ['crayer','snaikka'].includes(s.typeId));
      if (lightShip) {
        const idx = engine.player.fleet.indexOf(lightShip);
        if (idx >= 0) {
          engine.player.fleet.splice(idx, 1);
          engine.player.gold = (engine.player.gold||0) + 2000;
          this.refresh(engine, mgr);
        }
      }
    });
    document.getElementById('tabSmuggler')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 500) {
        engine.player.gold -= 500;
        if (ship) { ship.sabers = (ship.sabers||0) + 20; }
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('tabBurglar')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 800) {
        engine.player.gold -= 800;
        engine.player.gold += 1500;
        document.getElementById('tabInfo').innerHTML = '<div style="color:#4a8;">"El golpe fue exitoso. Recuperamos parte del botín."</div>';
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('tabInfo').innerHTML = document.getElementById('tabInfo').innerHTML ||
      '<div style="color:#8a7a5a;">El informador susurra noticias sobre precios y eventos...<br><span style="font-size:10px;">Pregúntale por $100.</span></div>';

    const mData = engine.getMissionUIData?.() || { available:[], active:[] };
    const sideMissions = [
      { name:'Mapa del Tesoro', desc:'Busca un tesoro enterrado', reward:2000+rand()*1000 },
      { name:'Patrulla', desc:'Patrulla las rutas 30 días', reward:1500 },
      { name:'Escolta', desc:'Escolta un mercante', reward:1200 },
      { name:'Caza-piratas', desc:'Elimina 3 barcos piratas', reward:3000 },
      { name:'Correo', desc:'Entrega un mensaje a otra ciudad', reward:800 },
    ];
    document.getElementById('tabMissions').innerHTML =
      `<div style="font-size:10px;color:#8a7a5a;margin-bottom:4px;">Misiones secundarias disponibles:</div>
      ${sideMissions.map(m => `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #1a1a0a;">
        <div>
          <span style="color:#ffd700;font-size:11px;">${m.name}</span>
          <div style="font-size:9px;color:#8a7a5a;">${m.desc}</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:10px;color:#b0a080;">$${Math.round(m.reward)}</span>
          <button class="uiBtn uiBtnGold" data-side-mission="${m.name}" style="font-size:9px;padding:2px 6px;margin-left:4px;">Aceptar</button>
        </div>
      </div>`).join('')}`;
    document.querySelectorAll('[data-side-mission]').forEach(b => b.onclick = () => {
      engine.player.gold = (engine.player.gold||0) + parseInt(b.parentElement.querySelector('span:first-child').textContent.replace('$',''));
      b.textContent = 'Hecho';
      b.disabled = true;
    });
    const active = mData.active || [];
    document.getElementById('tabActiveMissions').innerHTML = active.length
      ? active.map(m => {
          const p = m.progress || {};
          const bar = m.type==='hunt_pirates' ? `${p.piratesKilled||0}/${p.target||1}` :
                      m.type==='deliver_grain' ? `${p.delivered||0}/${p.target||1}` : '\u00B7';
          const daysLeft = m.timeLimit - (engine.server.world.totalDays - (m.startedAt||0));
          return `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #1a1a0a;">
            <span style="color:#b0a080;">${m.name}</span>
            <span style="font-size:10px;color:#8a7a5a;">${bar} | ${daysLeft}d</span>
          </div>`;
        }).join('')
      : '<span style="color:#5a5a3a;">Sin misiones activas</span>';
  }
}
