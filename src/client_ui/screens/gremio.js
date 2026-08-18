import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';
import { GOODS } from '../../database/goods.js';

export class GuildScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Gremio', '\u{1F3F0}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:240px;">
          <div class="flex gap-sm flex-wrap" style="margin-bottom:8px;">
            <button class="hansa-tab active" id="guildTabStats" style="flex:1;">Estadísticas</button>
            <button class="hansa-tab" id="guildTabAuctions" style="flex:1;">Subastas</button>
            <button class="hansa-tab" id="guildTabContracts" style="flex:1;">Contratos</button>
          </div>
          <div id="guildTabContent" style="font-size:11px;line-height:1.6;"></div>
        </div>
        <div style="flex:1;min-width:240px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Membresía y Miembros</div>
          <div id="guildMembership" style="font-size:11px;line-height:1.8;"></div>
          <div class="hansa-subtitle" style="margin:16px 0 8px;">Expediciones</div>
          <div id="guildExpeditions" style="font-size:11px;color:#8a7a5a;line-height:1.6;"></div>
        </div>
        <div style="flex:1;min-width:240px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Gráfico de Producción</div>
          <div id="guildGraph" style="font-size:11px;"></div>
          <div class="hansa-subtitle" style="margin:16px 0 8px;">Lista de Reputación</div>
          <div id="guildRepList" style="font-size:11px;max-height:20vh;overflow-y:auto;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('guildTabStats')?.addEventListener('click', () => { this._tab='stats'; this.refresh(engine,mgr); });
    document.getElementById('guildTabAuctions')?.addEventListener('click', () => { this._tab='auctions'; this.refresh(engine,mgr); });
    document.getElementById('guildTabContracts')?.addEventListener('click', () => { this._tab='contracts'; this.refresh(engine,mgr); });
    this._tab = 'stats';
  }
  refresh(engine, mgr) {
    const pol = engine.politicalSystem;
    const world = engine.server.world;
    const allCities = world.getAllCities();
    const totalPop = allCities.reduce((s,c) => s + c.totalPopulation, 0);
    const totalFactories = allCities.reduce((s,c) => s + c.factories.filter(f=>f.built).length, 0);
    document.getElementById('guildMembership').innerHTML =
      `Miembro del gremio: <span style="color:#4a8;">Sí</span>
      <div>Rango: <span style="color:#ffd700;">${pol.getRankName()}</span></div>
      <div>Tu flota: <span style="color:#b0a080;">${engine.player?.fleet?.length || 0} barcos</span></div>
      <div>Oro: <span style="color:#ffd700;">$${(engine.player?.gold||0).toFixed(0)}</span></div>`;
    document.getElementById('guildExpeditions').innerHTML =
      `<div class="hansa-subtitle">Expediciones disponibles:</div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;">
        <span>Expedición Mediterráneo</span>
        <span style="color:#ffd700;">$5,000</span>
        <button class="uiBtn uiBtnGold" id="guildMedExped" style="font-size:9px;padding:2px 6px;">Solicitar</button>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;">
        <span>Expedición América</span>
        <span style="color:#ffd700;">$15,000</span>
        <button class="uiBtn uiBtnGold" id="guildAmeExped" style="font-size:9px;padding:2px 6px;">Solicitar</button>
      </div>`;
    document.getElementById('guildMedExped')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 5000) { engine.player.gold -= 5000; document.getElementById('guildExpeditions').innerHTML += '<div style="color:#4a8;">Expedición al Mediterráneo iniciada.</div>'; }
    });
    document.getElementById('guildAmeExped')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 15000) { engine.player.gold -= 15000; document.getElementById('guildExpeditions').innerHTML += '<div style="color:#4a8;">Expedición a América iniciada.</div>'; }
    });

    document.getElementById('guildGraph').innerHTML = (() => {
      const chains = [
        { nodes: [
          { x: 60, w: 85, label: 'Granja \u2192 Trigo' },
          { x: 175, w: 100, label: 'Panader\u00EDa \u2192 Pan' },
          { x: 305, w: 80, label: 'Consumidores', end: true },
        ]},
        { nodes: [
          { x: 120, w: 85, label: 'Vi\u00F1edo \u2192 Vino' },
          { x: 245, w: 80, label: 'Consumidores', end: true },
        ]},
        { nodes: [
          { x: 55, w: 105, label: 'Granja Ovina \u2192 Lana' },
          { x: 195, w: 85, label: 'Telar \u2192 Tela' },
          { x: 315, w: 80, label: 'Consumidores', end: true },
        ]},
        { nodes: [
          { x: 115, w: 95, label: 'Serrer\u00EDa \u2192 Madera' },
          { x: 250, w: 85, label: 'Varias f\u00E1bricas', end: true },
        ]},
        { nodes: [
          { x: 110, w: 110, label: 'Ladrillera \u2192 Ladrillos' },
          { x: 260, w: 80, label: 'Construcci\u00F3n', end: true },
        ]},
      ];
      const rowH = 48, nodeH = 26, svgH = chains.length * rowH + 20;
      let svg = `<svg width="450" height="${svgH}" viewBox="0 0 450 ${svgH}" style="display:block;background:rgba(0,15,30,0.5);border:1px solid #2a2a1a;border-radius:4px;">
        <defs><marker id="arrowG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffd700" opacity="0.6"/></marker></defs>`;
      chains.forEach((ch, ri) => {
        const cy = 12 + ri * rowH;
        ch.nodes.forEach((n, ni) => {
          const fill = n.end ? 'rgba(20,50,20,0.6)' : 'rgba(0,31,63,0.8)';
          const stroke = n.end ? '#6a8a3a' : '#ffd700';
          svg += `<rect x="${n.x}" y="${cy}" width="${n.w}" height="${nodeH}" rx="5" ry="5" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
<text x="${n.x + n.w/2}" y="${cy + nodeH/2 + 3}" text-anchor="middle" fill="#ffd700" font-size="9" font-family="monospace">${n.label}</text>`;
          if (ni < ch.nodes.length - 1) {
            const nx = ch.nodes[ni + 1].x;
            svg += `<line x1="${n.x + n.w}" y1="${cy + nodeH/2}" x2="${nx}" y2="${cy + nodeH/2}" stroke="#ffd700" stroke-width="1" opacity="0.5" marker-end="url(#arrowG)"/>`;
          }
        });
      });
      svg += '</svg>';
      return `<div style="font-size:10px;color:#8a7a5a;margin-bottom:4px;">Cadena de producci\u00F3n:</div>${svg}`;
    })();

    const repList = allCities.map(c => ({
      id: c.id,
      name: CITIES.find(x => x.id === c.id)?.name || c.id,
      rep: pol.reputationByCity?.[c.id] || 50,
      pop: c.totalPopulation,
    })).sort((a, b) => b.rep - a.rep);
    document.getElementById('guildRepList').innerHTML =
      `<div style="font-size:10px;color:#6a6a4a;border-bottom:1px solid #2a2a1a;padding:3px 0;display:flex;">
        <span style="flex:1;">Ciudad</span><span style="width:40px;text-align:right;">Rep</span><span style="width:50px;text-align:right;">Población</span>
      </div>
      ${repList.map(r => `<div style="display:flex;padding:2px 0;border-bottom:1px solid #1a1a0a;font-size:10px;">
        <span style="flex:1;">${r.name}</span>
        <span style="width:40px;text-align:right;color:${r.rep>60?'#4a8':r.rep>40?'#b0a080':'#c66'};">${Math.round(r.rep)}</span>
        <span style="width:50px;text-align:right;color:#8a7a5a;">${r.pop.toLocaleString()}</span>
      </div>`).join('')}`;

    const tabContent = document.getElementById('guildTabContent');
    if (this._tab === 'stats') {
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Estadísticas Globales</div>
        <div>Ciudades hanseáticas: <span style="color:#b0a080;">${CITIES.length}</span></div>
        <div>Población total: <span style="color:#b0a080;">${totalPop.toLocaleString()}</span></div>
        <div>Fábricas activas: <span style="color:#b0a080;">${totalFactories}</span></div>
        <div>Tus barcos: <span style="color:#b0a080;">${engine.player?.fleet?.length || 0}</span></div>
        <div style="margin-top:8px;font-size:10px;color:#6a6a4a;">Valor de compañía estimado: <span style="color:#ffd700;">$${((engine.player?.gold||0) + (engine.player?.fleet?.length||0)*5000).toLocaleString()}</span></div>`;
    } else if (this._tab === 'auctions') {
      const auctions = engine.auctionManager?.auctions;
      const auctionList = auctions ? Object.values(auctions) : [];
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Subastas de Barcos y Edificios</div>
        ${auctionList.length
          ? auctionList.map(a => `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #1a1a0a;">
              <div>
                <span style="color:#ffd700;">${a.description||'Barco embargado'}</span>
                <div style="font-size:10px;color:#8a7a5a;">Puja actual: $${(a.currentBid||0).toLocaleString()}</div>
              </div>
              <button class="uiBtn uiBtnGold" data-auction="${a.id||'0'}" style="font-size:10px;">Pujar $${Math.round((a.currentBid||0)*1.1).toLocaleString()}</button>
            </div>`).join('')
          : '<span style="color:#5a5a3a;">No hay subastas activas en este momento.</span>'}`;
      document.querySelectorAll('[data-auction]').forEach(b => b.onclick = () => {
        if ((engine.player?.gold||0) >= 5000) { engine.player.gold -= 5000; this.refresh(engine,mgr); }
      });
    } else if (this._tab === 'contracts') {
      tabContent.innerHTML =
        `<div class="hansa-subtitle">Contratos de Expedición</div>
        <div style="font-size:10px;color:#6a6a4a;margin-bottom:6px;">Requisitos de importación de ciudades del Mediterráneo:</div>
        ${[
          { city:'Constantinopla', needs:'Vino, Aceite, Miel' },
          { city:'Venecia', needs:'Lana, Telas, Sal' },
          { city:'Génova', needs:'Pieles, Madera, Cáñamo' },
          { city:'Alejandría', needs:'Gran, Especias, Cerveza' },
          { city:'Trebisonda', needs:'Hierro, Herramientas, Sables' },
        ].map(ct => `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a0a;font-size:10px;">
          <span style="color:#b0a080;">${ct.city}</span>
          <span style="color:#8a7a5a;">Demanda: ${ct.needs}</span>
        </div>`).join('')}
        <div style="margin-top:8px;font-size:10px;color:#8a7a5a;">
          Cumple estos contratos para obtener reputación y acceso a mercados mediterráneos.
        </div>`;
    }
  }
}
