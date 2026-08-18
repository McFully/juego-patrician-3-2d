import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';
import { FACTORIES } from '../../database/factories.js';
import { GOODS } from '../../database/goods.js';

export class CityViewScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Vista de Ciudad', '\u{1F3D8}'); }

  render() {
    const div = this.build(`
      <div class="flex gap-base">
        <div style="flex:1;position:relative;">
          <canvas id="cityViewCanvas" style="width:100%;height:400px;background:#2a3a1a;border:1px solid #3a2a1a;border-radius:4px;"></canvas>
          <div id="cityViewTooltip" style="position:absolute;display:none;background:rgba(10,8,4,0.92);border:1px solid #5a4a2a;padding:6px 10px;font-size:11px;color:#e0d8c0;pointer-events:none;border-radius:3px;z-index:10;"></div>
        </div>
        <div style="width:220px;font-size:12px;">
          <select id="cvCity" class="hansa-select" style="width:100%;margin-bottom:8px;"></select>
          <div id="cvInfo" style="line-height:1.8;"></div>
          <div class="hansa-subtitle" style="margin:10px 0 4px;">Edificios</div>
          <div id="cvBuildings" style="font-size:11px;line-height:1.6;max-height:200px;overflow-y:auto;"></div>
          <button class="uiBtn uiBtnGold" id="cvClose" style="margin-top:8px;width:100%;">Cerrar Vista</button>
        </div>
      </div>
    `);
    return div;
  }

  bindEvents(engine, mgr) {
    document.getElementById('cvClose')?.addEventListener('click', () => mgr.closeAll());
    document.getElementById('cvCity')?.addEventListener('change', () => this.refresh(engine, mgr));
  }

  refresh(engine, mgr) {
    const sel = document.getElementById('cvCity');
    if (sel.options.length === 0) {
      CITIES.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
    }
    sel.value = engine.player?.currentCityId || 'lubeck';
    const city = engine.server.world.getCity(sel.value);
    if (!city) return;
    const canvas = document.getElementById('cityViewCanvas');
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = canvas.offsetWidth, H = canvas.offsetHeight;

    const isShallow = city.draft === 'shallow';
    const pop = city.totalPopulation;

    ctx.clearRect(0, 0, W, H);
    this.drawTerrain(ctx, W, H, isShallow);
    this.drawHarbor(ctx, W, H, isShallow);
    this.drawWalls(ctx, W, H, city.wallLevel || 0);
    this.drawRoads(ctx, W, H);
    this.drawHouses(ctx, W, H, city.housingPoor, city.housingMiddle, city.housingRich, pop);
    this.drawFactories(ctx, W, H, city.factories);
    this.drawCivicBuildings(ctx, W, H, city);
    this.drawMarket(ctx, W, H);
    this.drawShips(ctx, W, H, engine.player?.fleet?.filter(s => s.currentCityId === city.id) || []);
    this.drawNPCs(ctx, W, H, pop);
    this.drawCityAlerts(ctx, W, H, city, engine);
    this.drawHousingBars(ctx, W, H, city);
    this.drawCityLabel(ctx, W, H, city.name);

    // Tooltip on hover
    canvas.onmousemove = (e) => {
      const rect2 = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect2.left), my = (e.clientY - rect2.top);
      const tip = document.getElementById('cityViewTooltip');
      let found = false;
      // Check church click area
      if (mx >= W/2 - 18 && mx <= W/2 + 18 && my >= 6 && my <= 43) {
        tip.style.display = 'block';
        tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
        tip.innerHTML = `<b style="color:#ffd700;">Iglesia</b><br>Haz clic para donar o rezar`;
        found = true;
      }
      // Check town hall
      if (!found && mx >= W/2 + 37 && mx <= W/2 + 71 && my >= 12 && my <= 42) {
        tip.style.display = 'block';
        tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
        tip.innerHTML = `<b style="color:#ffd700;">Ayuntamiento</b><br>Haz clic para administrar la ciudad`;
        found = true;
      }
      // Check market
      if (!found && mx >= 40 && mx <= 120 && my >= 85 && my <= 140) {
        tip.style.display = 'block';
        tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
        tip.innerHTML = `<b style="color:#ffd700;">Mercado (Lonja)</b><br>Compra y venta de bienes`;
        found = true;
      }
      // Check well
      if (!found && city.hasWell && mx >= W/2 - 58 && mx <= W/2 - 42 && my >= 17 && my <= 33) {
        tip.style.display = 'block';
        tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
        tip.innerHTML = `<b style="color:#4a8a7a;">Pozo</b><br>Abastece de agua a la ciudad`;
        found = true;
      }
      // Check hospital
      if (!found && city.hasHospital && mx >= W/2 + 80 && mx <= W/2 + 100 && my >= 20 && my <= 41) {
        tip.style.display = 'block';
        tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
        tip.innerHTML = `<b style="color:#e0d8d0;">Hospital</b><br>Reduce el riesgo de peste`;
        found = true;
      }
      // Check bath house
      if (!found && city.hasBathHouse && mx >= W/2 - 90 && mx <= W/2 - 68 && my >= 18 && my <= 38) {
        tip.style.display = 'block';
        tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
        tip.innerHTML = `<b style="color:#7a8a8a;">Casa de Baños</b><br>Soborna concejales`;
        found = true;
      }
      // Check factories
      if (!found) {
        const built = city.factories.filter(f => f.built);
        for (let i = 0; i < built.length; i++) {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const fx = 40 + col * 45;
          const fy = 160 + row * 40;
          if (mx >= fx && mx <= fx + 35 && my >= fy && my <= fy + 32) {
            const f = built[i];
            const hpct = Math.round((city.housingOccupancyPoor||0)*100);
            const mpct = Math.round((city.housingOccupancyMiddle||0)*100);
            const rpct = Math.round((city.housingOccupancyRich||0)*100);
            tip.style.display = 'block';
            tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
            tip.innerHTML = `<b style="color:#ffd700;">${f.name}</b><br>Trabs: ${f.workers}/${f.maxWorkers} (${(f.workers/f.maxWorkers*100).toFixed(0)}%)<br>Viviendas: P${hpct}% M${mpct}% R${rpct}%<br>Haz clic para gestionar`;
            found = true; break;
          }
        }
      }
      // Check houses
      if (!found) {
        const houseTypes = [
          { x: 20, y: 50, label: 'Viviendas pobres', w: 120, h: 40, pct: Math.round((city.housingOccupancyPoor||0)*100) },
          { x: 150, y: 48, label: 'Viviendas medias', w: 96, h: 35, pct: Math.round((city.housingOccupancyMiddle||0)*100) },
          { x: 260, y: 52, label: 'Viviendas ricas', w: 132, h: 30, pct: Math.round((city.housingOccupancyRich||0)*100) },
        ];
        for (const ht of houseTypes) {
          if (mx >= ht.x && mx <= ht.x + ht.w && my >= ht.y && my <= ht.y + ht.h) {
            tip.style.display = 'block';
            tip.style.left = (mx + 10) + 'px'; tip.style.top = (my + 10) + 'px';
            tip.innerHTML = `<b style="color:var(--hansa-tertiary);">${ht.label}</b><br>Ocupación: ${ht.pct}%${ht.pct >= 95 ? ' \u26A0 Listo para expandir' : ''}`;
            found = true; break;
          }
        }
      }
      if (!found) {
        if (mx > W - 140 && my < 80) {
          tip.style.display = 'block';
          tip.style.left = (mx - 100) + 'px'; tip.style.top = (my + 10) + 'px';
          tip.innerHTML = `<b style="color:#8ab4f8;">Puerto</b><br>Barcos: ${engine.player?.fleet?.filter(s => s.currentCityId === city.id).length || 0}`;
          found = true;
        }
      }
      if (!found) tip.style.display = 'none';
    };

    // Click handlers - open screen modals
    canvas.onclick = (e) => {
      if (mgr.activeScreen) return;
      const rect2 = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect2.left), my = (e.clientY - rect2.top);
      // Church
      if (mx >= W/2 - 18 && mx <= W/2 + 18 && my >= 6 && my <= 43) { mgr.toggleScreen('iglesia'); return; }
      // Town Hall
      if (mx >= W/2 + 37 && mx <= W/2 + 71 && my >= 12 && my <= 42) { mgr.toggleScreen('ayuntamiento'); return; }
      // Market (Lonja)
      if (mx >= 40 && mx <= 120 && my >= 85 && my <= 140) { mgr.toggleScreen('lonja'); return; }
      // Bath house
      if (city.hasBathHouse && mx >= W/2 - 90 && mx <= W/2 - 68 && my >= 18 && my <= 38) { mgr.toggleScreen('banos'); return; }
      // Hospital
      if (city.hasHospital && mx >= W/2 + 80 && mx <= W/2 + 100 && my >= 20 && my <= 41) { mgr.toggleScreen('construccion'); return; }
      // Factories - toggle construction screen
      const built = city.factories.filter(f => f.built);
      for (let i = 0; i < built.length; i++) {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const fx = 40 + col * 45;
        const fy = 160 + row * 40;
        if (mx >= fx && mx <= fx + 35 && my >= fy && my <= fy + 32) { mgr.toggleScreen('construccion'); return; }
      }
      // Harbor - open ship screen
      if (mx > W - 140 && my < 80) { mgr.toggleScreen('barco'); return; }
    };

    document.getElementById('cvInfo').innerHTML =
      `<div style="color:#d8d0b0;font-size:14px;">${city.name}</div>
      <div>Población: <span style="color:#b0a080;">${pop.toLocaleString()}</span></div>
      <div>Calado: <span style="color:#b0a080;">${isShallow ? 'Poco profundo' : 'Profundo'}</span></div>
      <div>Producción: <span style="color:#b0a080;">${city.production}</span></div>
      <div>Arca: <span style="color:#ffd700;">$${(city.cityChest||0).toFixed(0)}</span></div>
      <div style="margin-top:6px;padding-top:6px;border-top:1px solid #2a2a1a;">
        <div>Pobres: ${city.popPoor}</div>
        <div>Medios: ${city.popMiddle}</div>
        <div>Ricos: ${city.popRich}</div>
        <div>Mendigos: ${city.popBeggar}</div>
      </div>`;

    const builtFactories = city.factories.filter(f => f.built);
    document.getElementById('cvBuildings').innerHTML = builtFactories.length
      ? builtFactories.map(f => `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #1a1a0a;">
          <span style="color:#b0d080;">▦ ${f.name}</span>
          <span style="color:#8a9a7a;">${f.workers}/${f.maxWorkers}</span>
        </div>`).join('')
      : '<span style="color:#5a5a3a;">Sin industrias</span>';

    // Redraw on resize
    const resizeHandler = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      this.refresh(engine, mgr);
    };
    window.removeEventListener('cvresize', resizeHandler);
    window.addEventListener('cvresize', resizeHandler);
  }

  drawTerrain(ctx, W, H, isShallow) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, isShallow ? '#3a5a3a' : '#4a6a3a');
    grad.addColorStop(0.6, isShallow ? '#4a6a3a' : '#5a7a4a');
    grad.addColorStop(1, '#3a5a2a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Grass texture
    ctx.fillStyle = 'rgba(60,90,50,0.3)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random()*W, Math.random()*H, 1+Math.random()*3, 0, Math.PI*2);
      ctx.fill();
    }
  }

  drawHarbor(ctx, W, H, isShallow) {
    const hx = W - 140, hy = 0, hw = 140, hh = 80;
    const grad = ctx.createLinearGradient(hx, hy, hx, hy+hh);
    grad.addColorStop(0, '#5a7a6a');
    grad.addColorStop(0.5, '#3a5a4a');
    grad.addColorStop(1, '#2a4a3a');
    ctx.fillStyle = grad;
    ctx.fillRect(hx, hy, hw, hh);

    // Docks
    ctx.fillStyle = '#5a4a2a';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(hx + 10 + i * 40, hy + hh - 12, 30, 12);
    }

    // Water
    ctx.fillStyle = 'rgba(20,80,70,0.4)';
    ctx.fillRect(hx, hy + hh, hw, 30);
    // Waves
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(100,180,160,${0.1 + Math.sin(Date.now()/1000 + i)*0.05})`;
      ctx.fillRect(hx + i*25 + Math.sin(Date.now()/800 + i)*5, hy + hh + 5 + i*4, 20, 3);
    }
  }

  drawWalls(ctx, W, H, level) {
    if (level <= 0) return;
    const m = 15;
    ctx.strokeStyle = level > 1 ? '#8a7a5a' : '#6a5a3a';
    ctx.lineWidth = level > 1 ? 4 : 2;
    ctx.strokeRect(m, m, W - m - 140, H - m * 2);
    // Towers
    ctx.fillStyle = '#7a6a4a';
    for (let i = 0; i < 4; i++) {
      const tx = i < 2 ? m : W - 140 - m;
      const ty = i % 2 === 0 ? m : H - m;
      ctx.fillRect(tx - 4, ty - 4, 8, 8);
    }
    if (level >= 3) {
      ctx.strokeStyle = '#9a8a6a';
      ctx.lineWidth = 2;
      ctx.strokeRect(m - 5, m - 5, W - m - 130, H - m * 2 + 10);
    }
  }

  drawRoads(ctx, W, H) {
    ctx.fillStyle = '#6a5a3a';
    // Main road
    for (let x = 20; x < W - 140; x += 4) {
      for (let y = 100; y < 120; y += 4) {
        if (Math.random() > 0.3) ctx.fillRect(x, y, 3, 3);
      }
    }
    // Vertical road
    for (let y = 120; y < H - 20; y += 4) {
      for (let x = W/2 - 10; x < W/2 + 10; x += 4) {
        if (Math.random() > 0.3) ctx.fillRect(x, y, 3, 3);
      }
    }
    // Secondary roads
    ctx.fillStyle = '#5a4a2a';
    for (let x = 30; x < W - 150; x += 80) {
      for (let y = 130; y < 145; y += 3) {
        if (Math.random() > 0.5) ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  drawHouses(ctx, W, H, poor, middle, rich) {
    // Poor houses - brown clustered
    ctx.fillStyle = '#6a4a2a';
    for (let i = 0; i < Math.min(20, poor/20); i++) {
      const x = 25 + (i % 10) * 12;
      const y = 50 + Math.floor(i / 10) * 25;
      ctx.fillRect(x, y, 10, 18);
      ctx.fillStyle = '#5a3a1a';
      ctx.fillRect(x + 1, y + 2, 8, 8);
      ctx.fillStyle = '#7a5a3a';
      // Roof
      ctx.beginPath();
      ctx.moveTo(x - 1, y + 2);
      ctx.lineTo(x + 5, y - 3);
      ctx.lineTo(x + 11, y + 2);
      ctx.fillStyle = '#8a4a2a';
      ctx.fill();
      ctx.fillStyle = '#6a4a2a';
    }

    // Middle houses - timber
    ctx.fillStyle = '#7a5a3a';
    for (let i = 0; i < Math.min(12, middle/20); i++) {
      const x = 150 + (i % 6) * 16;
      const y = 48 + Math.floor(i / 6) * 28;
      ctx.fillRect(x, y, 14, 22);
      ctx.fillStyle = '#5a3a2a';
      ctx.fillRect(x + 1, y + 3, 12, 8);
      // Timber frame
      ctx.strokeStyle = '#3a2a1a';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, 14, 22);
      ctx.fillStyle = '#7a5a3a';
    }

    // Rich houses - brick
    ctx.fillStyle = '#b08050';
    for (let i = 0; i < Math.min(6, rich/20); i++) {
      const x = 265 + i * 22;
      const y = 52;
      ctx.fillRect(x, y, 18, 26);
      ctx.fillStyle = '#c09060';
      ctx.fillRect(x + 2, y + 4, 14, 10);
      ctx.fillStyle = '#d0a070';
      // Window
      ctx.fillRect(x + 4, y + 6, 4, 4);
      ctx.fillRect(x + 10, y + 6, 4, 4);
      // Roof tile
      ctx.fillStyle = '#8a3a1a';
      ctx.beginPath();
      ctx.moveTo(x - 2, y + 3);
      ctx.lineTo(x + 9, y - 4);
      ctx.lineTo(x + 20, y + 3);
      ctx.fill();
      ctx.fillStyle = '#b08050';
    }
  }

  drawFactories(ctx, W, H, factories) {
    const built = factories.filter(f => f.built);
    built.forEach((f, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const fx = 40 + col * 45;
      const fy = 160 + row * 40;

      // Building
      ctx.fillStyle = '#5a6a3a';
      ctx.fillRect(fx, fy, 35, 28);

      // Roof
      ctx.fillStyle = '#4a3a1a';
      ctx.beginPath();
      ctx.moveTo(fx - 2, fy + 2);
      ctx.lineTo(fx + 17, fy - 5);
      ctx.lineTo(fx + 37, fy + 2);
      ctx.fill();

      // Door
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(fx + 12, fy + 16, 10, 12);

      // Worker indicator
      const ratio = f.workers / (f.maxWorkers || 100);
      ctx.fillStyle = ratio > 0.5 ? '#4a8' : '#c44';
      ctx.fillRect(fx + 24, fy + 2, 8, 4);

      // Label
      ctx.fillStyle = '#b0d080';
      ctx.font = '7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f.name.slice(0, 6), fx + 17, fy + 38);
    });
  }

  drawCivicBuildings(ctx, W, H, city) {
    // Church
    ctx.fillStyle = '#8a7a5a';
    ctx.fillRect(W/2 - 15, 15, 30, 28);
    ctx.fillStyle = '#6a4a2a';
    ctx.beginPath();
    ctx.moveTo(W/2 - 18, 18);
    ctx.lineTo(W/2, 6);
    ctx.lineTo(W/2 + 18, 18);
    ctx.fill();
    // Cross
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(W/2 - 1, 8, 2, 10);
    ctx.fillRect(W/2 - 4, 11, 8, 2);
    ctx.fillStyle = '#e0d8c0';
    ctx.font = '6px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Iglesia', W/2, 43);

    // Town Hall if has councillors
    ctx.fillStyle = '#8a7a5a';
    ctx.fillRect(W/2 + 40, 18, 28, 22);
    ctx.fillStyle = '#6a4a2a';
    ctx.beginPath();
    ctx.moveTo(W/2 + 37, 21);
    ctx.lineTo(W/2 + 54, 12);
    ctx.lineTo(W/2 + 71, 21);
    ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.font = '5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ayuntamiento', W/2 + 54, 42);

    // Well
    if (city.hasWell) {
      ctx.fillStyle = '#4a6a7a';
      ctx.beginPath();
      ctx.arc(W/2 - 50, 25, 8, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#6a8a9a';
      ctx.beginPath();
      ctx.arc(W/2 - 50, 25, 5, 0, Math.PI*2);
      ctx.fill();
    }

    // Hospital
    if (city.hasHospital) {
      ctx.fillStyle = '#e0d8d0';
      ctx.fillRect(W/2 + 80, 20, 20, 18);
      ctx.fillStyle = '#c44';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', W/2 + 90, 33);
      ctx.fillStyle = '#e0d8c0';
      ctx.font = '5px sans-serif';
      ctx.fillText('Hospital', W/2 + 90, 41);
    }

    // Bath house
    if (city.hasBathHouse) {
      ctx.fillStyle = '#7a8a8a';
      ctx.fillRect(W/2 - 90, 18, 22, 20);
      ctx.fillStyle = '#8a9a9a';
      ctx.beginPath();
      ctx.arc(W/2 - 79, 28, 6, 0, Math.PI);
      ctx.fill();
    }
  }

  drawMarket(ctx, W, H) {
    const mx = 40, my = 85, mw = 80, mh = 55;
    ctx.fillStyle = '#5a4a2a';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = '#6a5a3a';
    ctx.lineWidth = 1;
    ctx.strokeRect(mx, my, mw, mh);
    ctx.fillStyle = '#ffd700';
    ctx.font = '7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MERCADO', mx + mw/2, my + 12);
    ctx.fillStyle = '#b0a080';
    ctx.font = '6px sans-serif';
    ctx.fillText('Compra/Venta', mx + mw/2, my + 24);
    // Market stalls
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 ? '#7a5a3a' : '#6a4a2a';
      ctx.fillRect(mx + 5 + i*18, my + 30, 14, 18);
    }
  }

  drawShips(ctx, W, H, ships) {
    ships.forEach((ship, i) => {
      const sx = W - 120 + i * 35;
      const sy = 30;

      ctx.save();
      ctx.translate(sx, sy);
      // Hull
      ctx.fillStyle = '#5a3a2a';
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(12, 3);
      ctx.lineTo(20, 5);
      ctx.lineTo(22, 10);
      ctx.lineTo(16, 14);
      ctx.lineTo(2, 14);
      ctx.closePath();
      ctx.fill();

      // Mast
      ctx.strokeStyle = '#3a2a1a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(12, 8);
      ctx.lineTo(12, -2);
      ctx.stroke();

      // Sail
      ctx.fillStyle = '#f0e8d0';
      ctx.beginPath();
      ctx.moveTo(12, -1);
      ctx.lineTo(22, 4);
      ctx.lineTo(12, 7);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#8ab4f8';
      ctx.font = '5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ship.name.slice(0, 8), 11, 20);
      ctx.restore();
    });
  }

  drawNPCs(ctx, W, H, pop) {
    const count = Math.min(30, Math.floor(pop / 50));
    ctx.fillStyle = '#d0c0a0';
    for (let i = 0; i < count; i++) {
      const x = 20 + (i * 17 + Math.sin(i * 2.7 + Date.now()/3000) * 10) % (W - 170);
      const y = 110 + Math.sin(i + Date.now()/2000 + x/50) * 5 + (i % 8) * 8;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.fillRect(x - 1, y + 2, 1, 3);
      ctx.fillRect(x + 1, y + 2, 1, 3);
    }
  }

  drawCityLabel(ctx, W, H, name) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, H - 25, 170, 20);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 14px "Goudy Bookletter 1911", Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`\u{1F3D8} ${name}`, 18, H - 15);
  }

  drawCityAlerts(ctx, W, H, city) {
    const events = city.events || {};
    let xOff = 10;
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if (events.famine) {
      ctx.fillStyle = '#c44';
      ctx.fillText('\uD83C\uDF5E\u26D4', xOff, 5);
      ctx.fillStyle = 'rgba(180,60,60,0.8)';
      ctx.font = '8px sans-serif';
      ctx.fillText('HAMBRE', xOff, 22);
      xOff += 40;
    }
    if (events.plague) {
      ctx.fillStyle = '#222';
      ctx.fillText('\u271D\uFE0F', xOff, 5);
      ctx.fillStyle = 'rgba(30,30,30,0.8)';
      ctx.font = '8px sans-serif';
      ctx.fillText('PESTE', xOff, 22);
      xOff += 40;
    }
    if (events.siege) {
      ctx.fillStyle = '#c44';
      ctx.fillText('\uD83C\uDFF0', xOff, 5);
      ctx.fillStyle = 'rgba(180,60,60,0.8)';
      ctx.font = '8px sans-serif';
      ctx.fillText('ASEDIO', xOff, 22);
      xOff += 40;
    }
  }

  drawHousingBars(ctx, W, H, city) {
    const types = [
      { label: 'P', pct: city.housingOccupancyPoor || 0, x: 20, y: H - 60, color: '#8a6a3a' },
      { label: 'M', pct: city.housingOccupancyMiddle || 0, x: 80, y: H - 60, color: '#a08050' },
      { label: 'R', pct: city.housingOccupancyRich || 0, x: 140, y: H - 60, color: '#c0a060' },
    ];
    types.forEach(t => {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(t.x, t.y, 50, 8);
      const barW = Math.min(50, t.pct * 50);
      const isFull = t.pct >= 0.95;
      ctx.fillStyle = isFull ? '#ffd700' : t.color;
      ctx.fillRect(t.x, t.y, barW, 8);
      if (isFull) {
        ctx.fillStyle = '#ffd700';
        ctx.font = '8px sans-serif';
        ctx.fillText('\u26A1', t.x + 52, t.y);
      }
      ctx.fillStyle = '#e0d8c0';
      ctx.font = '7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${t.label}:${Math.round(t.pct*100)}%`, t.x + 25, t.y + 7);
    });
  }
}
