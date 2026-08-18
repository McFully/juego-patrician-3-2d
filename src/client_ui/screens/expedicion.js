import { ScreenBase } from './ScreenBase.js';

const MED_CITIES = [
  { id:'lubeck', name:'Lübeck', x:580, y:220, discovered:true, type:'hansa' },
  { id:'hamburg', name:'Hamburgo', x:540, y:240, discovered:true, type:'hansa' },
  { id:'bremen', name:'Bremen', x:510, y:260, discovered:true, type:'hansa' },
  { id:'london', name:'Londres', x:370, y:290, discovered:true, type:'hansa' },
  { id:'bruges', name:'Brujas', x:420, y:310, discovered:true, type:'hansa' },
  { id:'koln', name:'Köln', x:470, y:300, discovered:true, type:'hansa' },
  { id:'bergen', name:'Bergen', x:470, y:140, discovered:true, type:'hansa' },
  { id:'novgorod', name:'Nóvgorod', x:820, y:170, discovered:true, type:'hansa' },
  { id:'gdansk', name:'Gdansk', x:700, y:230, discovered:true, type:'hansa' },
  // 12 Mediterranean cities
  { id:'venice', name:'Venecia', x:530, y:460, discovered:false, type:'med', pop:45000 },
  { id:'genoa', name:'Génova', x:470, y:465, discovered:false, type:'med', pop:38000 },
  { id:'constantinople', name:'Constantinopla', x:690, y:490, discovered:false, type:'med', pop:60000 },
  { id:'alexandria', name:'Alejandría', x:630, y:550, discovered:false, type:'med', pop:35000 },
  { id:'tunis', name:'Túnez', x:510, y:540, discovered:false, type:'med', pop:20000 },
  { id:'barcelona', name:'Barcelona', x:420, y:490, discovered:false, type:'med', pop:25000 },
  { id:'lisbon', name:'Lisboa', x:340, y:480, discovered:false, type:'med', pop:28000 },
  { id:'naples', name:'Nápoles', x:560, y:500, discovered:false, type:'med', pop:30000 },
  { id:'palermo', name:'Palermo', x:550, y:530, discovered:false, type:'med', pop:18000 },
  { id:'ragusa', name:'Ragusa', x:600, y:470, discovered:false, type:'med', pop:12000 },
  { id:'tripoli', name:'Trípoli', x:580, y:560, discovered:false, type:'med', pop:15000 },
  { id:'smyrna', name:'Esmirna', x:640, y:510, discovered:false, type:'med', pop:16000 },
  // 3 American settlements
  { id:'cuba', name:'La Habana', x:130, y:400, discovered:false, type:'america', pop:8000 },
  { id:'haiti', name:'La Española', x:170, y:430, discovered:false, type:'america', pop:10000 },
  { id:'carthagena', name:'Cartagena', x:200, y:500, discovered:false, type:'america', pop:12000 },
];

export class ExpeditionScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Mapa de Expediciones', '\u{1F30D}'); }

  render() {
    return this.build(`
      <div class="flex gap-base">
        <div style="flex:1;position:relative;">
          <canvas id="expCanvas" style="width:100%;height:420px;background:#1a2a3a;border:1px solid #3a2a1a;border-radius:4px;"></canvas>
          <div id="expTooltip" style="position:absolute;display:none;background:rgba(10,8,4,0.92);border:1px solid #5a4a2a;padding:6px 10px;font-size:11px;color:#e0d8c0;pointer-events:none;border-radius:3px;z-index:10;"></div>
        </div>
        <div style="width:200px;font-size:12px;">
          <div class="hansa-subtitle" style="margin:0 0 6px;">Expediciones</div>
          <div id="expInfo" style="line-height:1.8;"></div>
          <div id="expCities" style="font-size:11px;line-height:1.6;max-height:250px;overflow-y:auto;margin-top:8px;"></div>
          <button class="uiBtn uiBtnGold" id="btnExploreMed" style="margin-top:8px;width:100%;">Explorar Mediterráneo ($5000)</button>
          <button class="uiBtn uiBtnGold" id="btnExploreAmerica" style="margin-top:4px;width:100%;">Explorar América ($15000)</button>
        </div>
      </div>
    `);
  }

  bindEvents(engine, mgr) {
    document.getElementById('btnExploreMed')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 5000) {
        engine.player.gold -= 5000;
        this.discoverRegion('med');
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('btnExploreAmerica')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 15000) {
        engine.player.gold -= 15000;
        this.discoverRegion('america');
        this.refresh(engine, mgr);
      }
    });
  }

  discoverRegion(type) {
    MED_CITIES.forEach(c => { if (c.type === type) c.discovered = true; });
  }

  refresh(engine, mgr) {
    const canvas = document.getElementById('expCanvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = canvas.offsetWidth, H = canvas.offsetHeight;

    ctx.clearRect(0, 0, W, H);
    this.drawMap(ctx, W, H);
    this.drawCities(ctx, W, H, engine);
    this.drawRoutes(ctx, W, H);
    this.drawFog(ctx, W, H);

    // Tooltip
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const tip = document.getElementById('expTooltip');
      let found = null;
      for (const c of MED_CITIES) {
        if (!c.discovered) continue;
        const cx = c.x / 900 * W, cy = c.y / 600 * H;
        if (Math.hypot(mx - cx, my - cy) < 10) { found = c; break; }
      }
      if (found) {
        tip.style.display = 'block';
        tip.style.left = (mx + 10) + 'px';
        tip.style.top = (my + 10) + 'px';
        const typeLabels = { hansa:'Liga Hanseática', med:'Mediterráneo', america:'Nuevo Mundo' };
        tip.innerHTML = `<b style="color:#ffd700;">${found.name}</b><br>
          <span style="color:#8a9a7a;">${typeLabels[found.type]||'Desconocido'}</span>`;
      } else {
        tip.style.display = 'none';
      }
    };

    const discoveredMed = MED_CITIES.filter(c => c.type === 'med' && c.discovered).length;
    const discoveredAme = MED_CITIES.filter(c => c.type === 'america' && c.discovered).length;
    const totalMed = MED_CITIES.filter(c => c.type === 'med').length;
    const totalAme = MED_CITIES.filter(c => c.type === 'america').length;

    document.getElementById('expInfo').innerHTML =
      `Oro: <span style="color:#ffd700;">$${(engine.player?.gold||0).toFixed(0)}</span>
      <div style="margin-top:4px;">Mediterráneo: <span style="color:#b0a080;">${discoveredMed}/${totalMed} descubierto</span></div>
      <div>América: <span style="color:#b0a080;">${discoveredAme}/${totalAme} descubierto</span></div>`;

    document.getElementById('expCities').innerHTML = MED_CITIES.filter(c => c.discovered).map(c => {
      const typeLabels = { hansa:'⚓', med:'\u{1F3F4}', america:'\u{1F3F3}' };
      return `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #1a1a0a;">
        <span>${typeLabels[c.type]||'■'} ${c.name}</span>
        <span style="color:#8a9a7a;font-size:10px;">${c.type === 'hansa' ? 'Comercio' : c.type === 'med' ? 'Exótico' : 'Colonial'}</span>
      </div>`;
    }).join('');
  }

  drawMap(ctx, W, H) {
    const grad = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, W*0.6);
    grad.addColorStop(0, '#1a3a5a');
    grad.addColorStop(0.5, '#1a2a4a');
    grad.addColorStop(1, '#0a1a2a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Land masses
    ctx.fillStyle = '#2a4a2a';
    // Europe
    ctx.beginPath();
    ctx.ellipse(W*0.5, H*0.35, W*0.25, H*0.15, 0, 0, Math.PI*2);
    ctx.fill();

    // British Isles
    ctx.beginPath();
    ctx.ellipse(W*0.35, H*0.3, W*0.05, H*0.08, 0.2, 0, Math.PI*2);
    ctx.fill();

    // Scandinavia
    ctx.beginPath();
    ctx.ellipse(W*0.55, H*0.18, W*0.08, H*0.1, -0.3, 0, Math.PI*2);
    ctx.fill();

    // Mediterranean
    ctx.fillStyle = '#1a3a2a';
    ctx.beginPath();
    ctx.ellipse(W*0.5, H*0.7, W*0.2, H*0.1, 0, 0, Math.PI*2);
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.ellipse(W*0.5, H*0.85, W*0.15, H*0.08, 0, 0, Math.PI*2);
    ctx.fill();

    // America
    ctx.fillStyle = '#2a4a2a';
    ctx.beginPath();
    ctx.ellipse(W*0.15, H*0.55, W*0.08, H*0.12, -0.4, 0, Math.PI*2);
    ctx.fill();

    // Ocean grid
    ctx.strokeStyle = 'rgba(30,60,90,0.15)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Title
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(10, 8, 240, 22);
    ctx.fillStyle = '#8ab4f8';
    ctx.font = 'bold 12px "Goudy Bookletter 1911", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('Mapa del Mundo conocido — 1300 d.C.', 16, 23);
  }

  drawCities(ctx, W, H, engine) {
    for (const c of MED_CITIES) {
      if (!c.discovered) continue;
      const cx = c.x / 900 * W, cy = c.y / 600 * H;

      // City icon
      const colors = { hansa:'#ffd700', med:'#ff8844', america:'#44cc88' };
      const color = colors[c.type] || '#888';
      ctx.beginPath();
      ctx.arc(cx, cy, c.type === 'hansa' ? 5 : 4, 0, Math.PI*2);
      ctx.fillStyle = color;
      ctx.fill();

      if (c.type === 'hansa') {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Hanseatic cross for Hansa cities
      if (c.type === 'hansa') {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 7); ctx.lineTo(cx, cy + 7);
        ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy);
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = '#e0d8c0';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.name, cx, cy - 10);
    }
  }

  drawRoutes(ctx, W, H) {
    const routeColor = 'rgba(255,215,0,0.12)';
    ctx.strokeStyle = routeColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);

    // Known trade routes
    const routes = [
      ['lubeck','hamburg'], ['lubeck','bergen'], ['lubeck','gdansk'],
      ['hamburg','bremen'], ['bremen','koln'], ['koln','bruges'],
      ['bruges','london'], ['london','bristol'], ['gdansk','novgorod'],
      // Mediterranean routes (appear when discovered)
      ['genoa','venice'], ['venice','constantinople'], ['genoa','barcelona'],
      ['barcelona','lisbon'], ['genoa','naples'], ['naples','palermo'],
      ['palermo','tunis'], ['tunis','tripoli'], ['alexandria','constantinople'],
      ['alexandria','tripoli'], ['ragusa','venice'], ['smyrna','constantinople'],
      // America routes
      ['cuba','haiti'], ['haiti','carthagena'], ['lisbon','cuba'],
      ['barcelona','cuba'], ['lisbon','haiti'],
    ];
    for (const [fromId, toId] of routes) {
      const from = MED_CITIES.find(c => c.id === fromId);
      const to = MED_CITIES.find(c => c.id === toId);
      if (!from || !to || !from.discovered || !to.discovered) continue;
      ctx.beginPath();
      ctx.moveTo(from.x / 900 * W, from.y / 600 * H);
      ctx.lineTo(to.x / 900 * W, to.y / 600 * H);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Animated ships on routes
    const time = Date.now() / 4000;
    for (let i = 0; i < routes.length; i++) {
      const from = MED_CITIES.find(c => c.id === routes[i][0]);
      const to = MED_CITIES.find(c => c.id === routes[i][1]);
      if (!from || !to || !from.discovered || !to.discovered) continue;
      const progress = (Math.sin(time + i * 2.1) + 1) / 2;
      const sx = (from.x + (to.x - from.x) * progress) / 900 * W;
      const sy = (from.y + (to.y - from.y) * progress) / 600 * H;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI*2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
    }
  }

  drawFog(ctx, W, H) {
    for (const c of MED_CITIES) {
      if (c.discovered) continue;
      const cx = c.x / 900 * W, cy = c.y / 600 * H;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      grad.addColorStop(0, 'rgba(10,15,25,0.95)');
      grad.addColorStop(0.5, 'rgba(10,15,25,0.8)');
      grad.addColorStop(1, 'rgba(10,15,25,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI*2);
      ctx.fill();

      // Question mark for undiscovered
      ctx.fillStyle = 'rgba(100,130,160,0.4)';
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', cx, cy);
    }
  }
}
