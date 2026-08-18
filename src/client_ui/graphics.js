/**
 * Graphics Engine — enhanced 2D rendering.
 * Procedural assets, terrain, weather, particles, animations.
 */

import { CITIES } from '../database/cities.js';
import DATA from '../database/index.js';
import { GOODS } from '../database/goods.js';

const SEA_COLORS = ['#1a4a3a', '#1d5040', '#2d6a5a', '#2a6050', '#3a7a6a'];
const LAND_COLORS = ['#3a6a3a', '#4a7a3a', '#5a8a3a', '#4a7a4a', '#6a9a4a'];
const SHALLOW_COLOR = '#4a9a6a';

export class ProceduralAssets {
  constructor(ctx) {
    this.ctx = ctx;
    this.cache = {};
  }
}

export class TerrainRenderer {
  constructor(width, height, tileSize = 20) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.cols = Math.ceil(width / tileSize) + 1;
    this.rows = Math.ceil(height / tileSize) + 1;
    this.seed = Date.now();
    this.waveOffset = 0;
  }

  generateHeightMap(cities) {
    const hm = new Float32Array(this.cols * this.rows);
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const wx = x * this.tileSize;
        const wy = y * this.tileSize;
        let val = 0.3;
        for (const c of cities) {
          const dx = (wx - c.x) / 80;
          const dy = (wy - c.y) / 80;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 1.5) val = Math.max(val, 0.7 - d * 0.3);
        }
        hm[y * this.cols + x] = Math.min(1, val + Math.random() * 0.05);
      }
    }
    return hm;
  }

  drawTerrain(ctx, cities, cameraX, cameraY, zoom) {
    const w = this.width;
    const h = this.height;
    const hm = this.generateHeightMap(cities);

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const sx = x * this.tileSize * zoom - (cameraX * zoom % (this.tileSize * zoom));
        const sy = y * this.tileSize * zoom - (cameraY * zoom % (this.tileSize * zoom));
        const val = hm[y * this.cols + x];
        const ts = this.tileSize * zoom + 1;

        if (sx < -ts || sx > w + ts || sy < -ts || sy > h + ts) continue;

        if (val < 0.35) {
          // Sea with wave animation
          const wave = Math.sin((sx * 0.05 + this.waveOffset) * 0.5 + (sy * 0.03)) * 15;
          const shade = Math.floor((val * 2 + wave * 0.003) * 60) + 40;
          ctx.fillStyle = `rgb(${shade + 30}, ${shade + 60}, ${shade + 30})`;
        } else if (val < 0.45) {
          // Coast / shallow
          ctx.fillStyle = SHALLOW_COLOR;
        } else if (val < 0.6) {
          // Grassland
          const g = Math.floor(80 + (val - 0.4) * 100);
          ctx.fillStyle = `rgb(50, ${g}, 40)`;
        } else if (val < 0.75) {
          // Forest
          ctx.fillStyle = `rgb(30, ${Math.floor(80 + val * 30)}, 25)`;
        } else {
          // Hills / high ground
          ctx.fillStyle = `rgb(80, ${Math.floor(90 + val * 20)}, 50)`;
        }

        ctx.fillRect(sx, sy, ts, ts);

        // Subtle grid lines
        if (zoom > 0.8) {
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          ctx.fillRect(sx, sy, ts, 1);
          ctx.fillRect(sx, sy, 1, ts);
        }
      }
    }
  }

  updateWaves(delta) {
    this.waveOffset += delta * 0.02;
  }
}

export class CityRenderer {
  drawCity(ctx, city, screenX, screenY, zoom, isSelected) {
    const size = Math.max(6, Math.min(18, 6 + city.totalPopulation / 300) * zoom);
    const isShallow = city.draft === 'shallow';

    // City base
    const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size);
    if (isShallow) {
      grad.addColorStop(0, '#80b080');
      grad.addColorStop(0.7, '#5a8a5a');
      grad.addColorStop(1, '#3a6a3a');
    } else {
      grad.addColorStop(0, '#e0c080');
      grad.addColorStop(0.7, '#c0a060');
      grad.addColorStop(1, '#a08040');
    }

    ctx.beginPath();
    ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // City walls (if has wall)
    if (city.wallLevel > 0) {
      ctx.strokeStyle = '#8a7a5a';
      ctx.lineWidth = 2 * zoom;
      ctx.strokeRect(screenX - size * 0.8, screenY - size * 0.8, size * 1.6, size * 1.6);
    }

    // Population indicator — inner circle
    const popRatio = city.totalPopulation / 2000;
    ctx.beginPath();
    ctx.arc(screenX, screenY, size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${Math.min(1, popRatio)})`;
    ctx.fill();

    // Selection ring
    if (isSelected) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2 * zoom;
      ctx.setLineDash([4 * zoom, 4 * zoom]);
      ctx.beginPath();
      ctx.arc(screenX, screenY, size + 4 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // City name
    ctx.fillStyle = '#f0e0c0';
    ctx.font = `bold ${Math.max(10, 12 * zoom)}px 'Goudy Bookletter 1911', Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 4;
    ctx.fillText(city.name, screenX, screenY - size - 3);
    ctx.shadowBlur = 0;
  }
}

export class ShipRenderer {
  drawShip(ctx, ship, x, y, zoom, angle = 0) {
    const size = 8 * zoom;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle || 0);

    // Hull
    ctx.fillStyle = '#5a3a2a';
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, size * 0.3);
    ctx.lineTo(size * 0.3, size * 0.6);
    ctx.lineTo(-size * 0.3, size * 0.6);
    ctx.lineTo(-size * 0.6, size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a1a0a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Mast
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 1.5 * zoom;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.1);
    ctx.lineTo(0, -size * 1.2);
    ctx.stroke();

    // Sail
    ctx.fillStyle = '#f0e8d0';
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.1);
    ctx.lineTo(size * 0.6, -size * 0.6);
    ctx.lineTo(0, -size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Upgrade level indicator
    if (ship.upgradeLevel > 1) {
      ctx.fillStyle = '#ffd700';
      ctx.font = `${8 * zoom}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('★'.repeat(ship.upgradeLevel - 1), 0, size * 0.8);
    }

    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count, config = {}) {
    const {
      color = '#ffd700',
      life = 60,
      speed = 2,
      size = 4,
      spread = 1,
    } = config;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * speed * spread,
        vy: -Math.random() * speed,
        life: life * (0.5 + Math.random() * 0.5),
        maxLife: life,
        size: size * (0.5 + Math.random()),
        color,
        alpha: 1,
      });
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 0.1 * delta; // gravity
      p.life -= delta;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

export class WeatherSystem {
  constructor() {
    this.drops = [];
    this.particles = [];
    this.currentWeather = 'clear';
    this.intensity = 0;
  }

  setWeather(type, intensity = 0.5) {
    this.currentWeather = type;
    this.intensity = intensity;
  }

  updateFromSeason(month) {
    if (month >= 11 || month <= 2) {
      this.setWeather('snow', 0.3 + Math.random() * 0.3);
    } else if (month >= 4 && month <= 6) {
      this.setWeather('rain', 0.2 + Math.random() * 0.2);
    } else {
      this.setWeather('clear', 0);
    }
  }

  update(canvasW, canvasH) {
    const targetCount = Math.floor(this.intensity * 200);
    while (this.drops.length < targetCount && this.drops.length < 400) {
      this.drops.push({
        x: Math.random() * canvasW * 1.2 - canvasW * 0.1,
        y: Math.random() * canvasH * 1.2 - canvasH * 0.1,
        speed: 4 + Math.random() * 4,
        size: 1 + Math.random() * 2,
        wind: -0.5 + Math.random(),
      });
    }

    for (const d of this.drops) {
      d.y += d.speed;
      d.x += d.wind;
      if (d.y > canvasH + 10) { d.y = -10; d.x = Math.random() * canvasW; }
      if (d.x < -10) d.x = canvasW + 10;
      if (d.x > canvasW + 10) d.x = -10;
    }
  }

  draw(ctx) {
    if (this.currentWeather === 'clear' || this.drops.length === 0) return;

    ctx.strokeStyle = this.currentWeather === 'snow' ? 'rgba(255,255,255,0.6)' : 'rgba(180,200,255,0.4)';
    ctx.lineWidth = 1;

    for (const d of this.drops) {
      ctx.beginPath();
      if (this.currentWeather === 'snow') {
        ctx.arc(d.x, d.y, d.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
      } else {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.wind * 3, d.y + d.size * 3);
        ctx.stroke();
      }
    }
  }
}

export class DayNightCycle {
  constructor() {
    this.hour = 8;
    this.dayLength = 60; // ticks per full day cycle
  }

  update() {
    this.hour = (this.hour + 24 / this.dayLength) % 24;
  }

  get tint() {
    if (this.hour >= 6 && this.hour < 18) return null; // daytime
    const nightDepth = this.hour < 6
      ? (6 - this.hour) / 6
      : (this.hour - 18) / 6;
    return Math.min(0.5, nightDepth * 0.4);
  }

  drawTint(ctx, w, h) {
    const t = this.tint;
    if (!t || t <= 0) return;
    ctx.fillStyle = `rgba(10, 5, 30, ${t})`;
    ctx.fillRect(0, 0, w, h);

    // Stars
    if (t > 0.2) {
      ctx.fillStyle = `rgba(255,255,255,${t * 0.8})`;
      const seed = 12345;
      for (let i = 0; i < 50; i++) {
        const sx = ((seed * (i + 1) * 7) % w);
        const sy = ((seed * (i + 1) * 13) % (h * 0.6));
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }
  }
}

export class TradeRouteRenderer {
  drawRoutes(ctx, cities, routes, zoom, cameraX, cameraY) {
    if (!routes || routes.length === 0) return;

    const time = Date.now() / 2000;

    for (const route of routes) {
      const from = cities.find(c => c.id === route.from);
      const to = cities.find(c => c.id === route.to);
      if (!from || !to) continue;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len;
      const ny = dx / len;

      // Route line
      const sx = (from.x - cameraX) * zoom + 300;
      const sy = (from.y - cameraY) * zoom + 200;
      const ex = (to.x - cameraX) * zoom + 300;
      const ey = (to.y - cameraY) * zoom + 200;

      ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 + Math.sin(time + route.from.length) * 0.1})`;
      ctx.lineWidth = 1.5 * zoom;
      ctx.setLineDash([4 * zoom, 6 * zoom]);
      ctx.beginPath();
      ctx.moveTo(sx + nx * 5, sy + ny * 5);
      ctx.lineTo(ex + nx * 5, ey + ny * 5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Moving dot
      const progress = (Math.sin(time + route.from.charCodeAt(0)) + 1) / 2;
      const mx = sx + (ex - sx) * progress;
      const my = sy + (ey - sy) * progress;
      ctx.beginPath();
      ctx.arc(mx, my, 2.5 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
    }
  }
}

export class PriceHistoryChart {
  constructor(maxPoints = 30) {
    this.history = {}; // { goodId: [price, ...] }
    this.maxPoints = maxPoints;
  }

  recordPrices(prices) {
    for (const [goodId, price] of Object.entries(prices)) {
      if (!this.history[goodId]) this.history[goodId] = [];
      this.history[goodId].push(price);
      if (this.history[goodId].length > this.maxPoints) {
        this.history[goodId].shift();
      }
    }
  }

  drawChart(ctx, goodId, x, y, width, height) {
    const data = this.history[goodId];
    if (!data || data.length < 2) return;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(max - min, 1);

    ctx.fillStyle = 'rgba(15, 26, 42, 0.6)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = 'rgba(74, 106, 58, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, width, height);

    ctx.beginPath();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < data.length; i++) {
      const px = x + (i / (data.length - 1)) * width;
      const py = y + height - ((data[i] - min) / range) * height * 0.8 - height * 0.1;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current price label
    ctx.fillStyle = '#ffd700';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`$${data[data.length - 1].toFixed(1)}`, x + width - 2, y + 10);
  }

  drawAllCharts(ctx, x, y, width, height, goods) {
    const chartH = Math.max(15, height / goods.length);
    for (let i = 0; i < goods.length; i++) {
      this.drawChart(ctx, goods[i].id, x, y + i * chartH, width, chartH - 1);
    }
  }
}

export class SplashScreen {
  constructor() {
    this.active = true;
    this.alpha = 1;
    this.fadeOut = false;
    this.duration = 120;
    this.timer = 0;
  }

  draw(ctx, w, h) {
    if (!this.active) return;
    if (this.fadeOut) {
      this.alpha = Math.max(0, 1 - this.timer / 30);
      if (this.alpha <= 0) { this.active = false; return; }
    }

    ctx.fillStyle = `rgba(10, 15, 20, ${this.alpha})`;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = `rgba(255, 215, 0, ${this.alpha})`;
    ctx.font = `bold ${Math.min(48, w * 0.06)}px 'Goudy Bookletter 1911', Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;

    // Hanseatic cog
    const cx = w / 2;
    const cy = h / 2 - 60;
    ctx.fillStyle = `rgba(180, 140, 80, ${this.alpha})`;
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 20);
    ctx.lineTo(cx - 30, cy - 10);
    ctx.lineTo(cx, cy - 30);
    ctx.lineTo(cx + 30, cy - 10);
    ctx.lineTo(cx + 40, cy + 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 215, 0, ${this.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillText('PATRICIAN III 2D', cx, h / 2 + 10);
    ctx.font = `${Math.min(18, w * 0.025)}px 'Goudy Bookletter 1911', Georgia, serif`;
    ctx.fillStyle = `rgba(160, 200, 160, ${this.alpha * 0.7})`;
    ctx.fillText('Hanseatic League — Economic Simulator', cx, h / 2 + 50);
    ctx.font = `${Math.min(14, w * 0.018)}px sans-serif`;
    ctx.fillStyle = `rgba(200, 180, 140, ${this.alpha * 0.5})`;
    ctx.fillText('Click anywhere to start', cx, h / 2 + 100);

    ctx.shadowBlur = 0;
  }

  update() {
    if (!this.active) return;
    this.timer++;
    if (this.timer > this.duration && !this.fadeOut) {
      this.fadeOut = true;
      this.timer = 0;
    }
  }

  dismiss() {
    this.fadeOut = true;
    this.timer = 0;
  }
}