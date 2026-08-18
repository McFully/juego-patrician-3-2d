import { ScreenBase } from './ScreenBase.js';
import { CITIES } from '../../database/cities.js';

export class NavalCombatScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Combate Naval', '\u{1F6A2}'); }
  render() {
    return this.build(`
      <div class="flex gap-base">
        <div style="flex:1;position:relative;">
          <canvas id="combatCanvas" style="width:100%;height:400px;background:#0a1a2a;border:1px solid #3a2a1a;border-radius:4px;"></canvas>
          <div id="combatLog" style="position:absolute;bottom:8px;left:8px;right:8px;background:rgba(0,0,0,0.7);padding:6px 10px;font-size:10px;color:var(--hansa-on-surface-variant);border-radius:3px;max-height:60px;overflow-y:auto;"></div>
        </div>
        <div style="width:220px;font-size:12px;">
          <div class="hansa-subtitle" style="margin:0 0 6px;">Flota Aliada</div>
          <div id="combatFriendly" style="line-height:1.6;"></div>
          <div class="hansa-subtitle" style="margin:10px 0 4px;">Flota Enemiga</div>
          <div id="combatEnemy" style="line-height:1.6;"></div>
          <div class="hansa-subtitle" style="margin:10px 0 4px;">Viento</div>
          <div id="combatWind" style="font-size:12px;"></div>
          <div class="flex gap-sm flex-wrap" style="margin-top:10px;">
            <button class="uiBtn uiBtnBuy" id="btnCannonVolley">Andanada</button>
            <button class="uiBtn uiBtnGold" id="btnBoard">Abordaje</button>
            <button class="uiBtn uiBtnSell" id="btnRetreat">Retirada</button>
            <button class="uiBtn" id="btnAutoResolve">Auto-Resolución</button>
          </div>
        </div>
      </div>
    `);
  }

  bindEvents(engine, mgr) {
    document.getElementById('btnCannonVolley')?.addEventListener('click', () => this.cannonVolley(engine, mgr));
    document.getElementById('btnBoard')?.addEventListener('click', () => this.boarding(engine, mgr));
    document.getElementById('btnRetreat')?.addEventListener('click', () => this.retreat(engine, mgr));
    document.getElementById('btnAutoResolve')?.addEventListener('click', () => this.autoResolve(engine, mgr));
  }

  refresh(engine, mgr) {
    const canvas = document.getElementById('combatCanvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const W = canvas.offsetWidth, H = canvas.offsetHeight;

    const fleet = engine.player?.fleet || [];
    const pirates = engine.combatManager?.fleetAI?.pirateFleets || [];

    // Sea
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a1a3a');
    grad.addColorStop(0.4, '#0a2a4a');
    grad.addColorStop(0.6, '#0d2d4d');
    grad.addColorStop(1, '#1a3a5a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Waves
    const time = Date.now() / 1500;
    ctx.strokeStyle = 'rgba(40,100,140,0.15)';
    ctx.lineWidth = 1;
    for (let row = 0; row < 15; row++) {
      ctx.beginPath();
      for (let x = 0; x < W; x += 5) {
        const y = row * (H/15) + Math.sin(x * 0.02 + time + row) * 4;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Wind arrow
    const windAngle = Math.PI / 4 + Math.sin(time * 0.3) * 0.3;
    this.drawCannonArcs(ctx, W, H, fleet);
    this.drawWindArrow(ctx, W - 60, 30, windAngle);

    // Friendly ships (left side)
    fleet.forEach((ship, i) => {
      const sx = 60 + i * 50, sy = H/2 - 40 + Math.sin(time + i) * 5;
      this.drawCombatShip(ctx, sx, sy, ship, '#4a8');
    });

    // Pirate ships (right side)
    pirates.forEach((pf, pi) => {
      (pf.ships || []).forEach((ps, si) => {
        const sx = W - 80 - (pi * 60 + si * 40), sy = H/2 + 30 + Math.sin(time * 0.8 + pi + si) * 5;
        this.drawCombatShip(ctx, sx, sy, ps, '#c44');
      });
    });

    // Cannon fire animation if active
    if (this.cannonAnim > 0) {
      this.drawCannonFire(ctx, W, H, this.cannonAnim);
      this.cannonAnim -= 0.02;
    }

    const friendlyHP = fleet.reduce((s, sh) => s + (sh.hp || 0), 0);
    const friendlyMaxHP = fleet.reduce((s, sh) => s + (sh.hpMax || 100), 0);
    const enemyShips = pirates.reduce((a, pf) => a.concat(pf.ships || []), []);
    const enemyHP = enemyShips.reduce((s, sh) => s + (sh.hp || 0), 0);
    const enemyMaxHP = enemyShips.reduce((s, sh) => s + (sh.hpMax || 100), 0);
    const pirateCount = pirates.reduce((s, pf) => s + (pf.ships || []).filter(ps => ps.hp > 0).length, 0);

    document.getElementById('combatFriendly').innerHTML =
      `Barcos: <span style="color:#b0a080;">${fleet.length}</span>
      <div>Salud: <span style="color:#4a8;">${Math.round(friendlyHP)}/${Math.round(friendlyMaxHP)}</span></div>
      <div>Tripulación: <span style="color:#b0a080;">${fleet.reduce((s,sh)=>s+(sh.crew||0),0)}/${fleet.reduce((s,sh)=>s+(sh.crewMax||0),0)}</span></div>`;

    document.getElementById('combatEnemy').innerHTML =
      `Naves piratas: <span style="color:#b0a080;">${pirateCount}</span>
      <div>Salud: <span style="color:#c44;">${Math.round(enemyHP)}/${Math.round(enemyMaxHP)}</span></div>`;

    const windDir = Math.round(windAngle * 180 / Math.PI);
    const windSpeed = (Math.sin(time * 0.3) * 0.3 + 0.5).toFixed(1);
    document.getElementById('combatWind').innerHTML =
      `Dirección: <span style="color:#8ab4f8;">${windDir}°</span>
      <div>Velocidad: <span style="color:#b0a080;">${windSpeed} nudos</span></div>`;
    this.windAngle = windAngle;
  }

  drawCombatShip(ctx, x, y, ship, color) {
    ctx.save();
    ctx.translate(x, y);
    const w = 28, h = 18;

    // Hull
    ctx.fillStyle = '#4a2a1a';
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/3, -h/3);
    ctx.lineTo(w/3, -h/3);
    ctx.lineTo(w/2, 0);
    ctx.lineTo(w/3, h/3);
    ctx.lineTo(-w/3, h/3);
    ctx.closePath();
    ctx.fill();

    // Deck
    ctx.fillStyle = '#5a3a2a';
    ctx.fillRect(-w/4, -h/6, w/2, h/3);

    // Mast
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -h/4);
    ctx.lineTo(0, -h/1.2);
    ctx.stroke();

    // Sail
    ctx.fillStyle = '#f0e8d0';
    ctx.beginPath();
    ctx.moveTo(0, -h/1.1);
    ctx.lineTo(w/3, -h/2);
    ctx.lineTo(0, -h/4);
    ctx.closePath();
    ctx.fill();

    // HP bar
    const hpRatio = (ship.hp || 0) / (ship.hpMax || 100);
    ctx.fillStyle = hpRatio > 0.5 ? '#4a8' : hpRatio > 0.25 ? '#ca4' : '#c44';
    ctx.fillRect(-12, h/2 + 4, 24 * hpRatio, 3);
    ctx.strokeStyle = '#2a2a1a';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(-12, h/2 + 4, 24, 3);

    // Flag
    ctx.fillStyle = color || '#ffd700';
    ctx.fillRect(w/3 - 2, -h/1.3, 6, 4);

    ctx.restore();
  }

  drawCannonArcs(ctx, W, H, fleet) {
    // Draw range arcs for each cannon-equipped ship
    fleet.forEach((ship, i) => {
      const weaponCount = ship.weapons?.length || ship.weaponSlots || 0;
      if (weaponCount <= 0) return;
      const sx = 60 + i * 50;
      const sy = H * 0.6;
      const range = 80 + weaponCount * 15;
      // Horizontal range arc
      ctx.strokeStyle = 'rgba(255,200,50,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(sx, sy, range, -0.6, 0.6);
      ctx.stroke();
      // Vertical range arc
      ctx.strokeStyle = 'rgba(255,100,50,0.1)';
      ctx.beginPath();
      ctx.arc(sx, sy, range * 0.6, -1.2, 1.2);
      ctx.stroke();
      ctx.setLineDash([]);
      // Range label
      ctx.fillStyle = 'rgba(255,200,50,0.2)';
      ctx.font = '7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`R:${Math.round(range)}`, sx, sy - range - 5);
    });
  }

  drawWindArrow(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.strokeStyle = '#8ab4f8';
    ctx.fillStyle = '#8ab4f8';
    ctx.lineWidth = 2;

    // Arrow line
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(10, -5);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#6a8aaa';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIENTO', 0, -12);

    ctx.restore();
  }

  drawCannonFire(ctx, W, H, anim) {
    const intensity = Math.max(0, anim);
    // Flash
    ctx.fillStyle = `rgba(255,200,50,${intensity * 0.3})`;
    ctx.fillRect(0, 0, W, H);
    // Fire balls
    for (let i = 0; i < 6; i++) {
      const fx = W * (0.2 + Math.random() * 0.6);
      const fy = H * (0.2 + Math.random() * 0.6);
      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 15 * intensity);
      grad.addColorStop(0, `rgba(255,200,50,${intensity})`);
      grad.addColorStop(0.5, `rgba(255,100,20,${intensity * 0.5})`);
      grad.addColorStop(1, 'rgba(255,50,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fx, fy, 15 * intensity, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  cannonVolley(engine, mgr) {
    const log = document.getElementById('combatLog');
    if (!log) return;
    this.cannonAnim = 1;
    const fleet = engine.player?.fleet || [];
    const pirates = engine.combatManager?.fleetAI?.pirateFleets || [];
    let damage = 0;
    let hits = 0;
    for (const ship of fleet) {
      const shipDmg = (ship.upgradeLevel || 1) * 10 + Math.random() * 15;
      damage += shipDmg;
      hits++;
    }
    let enemyHits = 0;
    for (const pf of pirates) {
      for (const ps of pf.ships || []) {
        ps.hp = (ps.hp || 0) - damage / Math.max(1, pirates.reduce((a, pf) => a + (pf.ships?.length || 0), 0));
        if (damage > 0) enemyHits++;
      }
    }
    const totalDmg = damage.toFixed(1);
    log.innerHTML += `<div style="color:#ffd700;">» Andanada! ${hits} barcos disparan. ${totalDmg} de daño.</div>`;
    if (log.children.length > 5) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
    this.refresh(engine, mgr);
  }

  boarding(engine, mgr) {
    const log = document.getElementById('combatLog');
    if (!log) return;
    this.cannonAnim = 0.5;
    const fleet = engine.player?.fleet || [];
    const pirates = engine.combatManager?.fleetAI?.pirateFleets || [];
    const totalSabers = fleet.reduce((s, sh) => s + (sh.sabers || 0), 0);
    const totalCrew = fleet.reduce((s, sh) => s + (sh.crew || 0), 0);
    const boardPower = totalSabers * 0.5 + totalCrew * 1.2;
    const result = boardPower > 50 + Math.random() * 80 ? 'Victoria en el abordaje!' : 'Abordaje repelido!';
    log.innerHTML += `<div style="color:#${result.includes('Victoria')?'4a8':'c44'};">» ${result} (Poder: ${boardPower.toFixed(0)})</div>`;
    if (result.includes('Victoria')) {
      for (const pf of pirates) {
        for (const ps of pf.ships || []) ps.hp = 0;
      }
    }
    if (log.children.length > 5) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
    this.refresh(engine, mgr);
  }

  retreat(engine, mgr) {
    const log = document.getElementById('combatLog');
    if (!log) return;
    log.innerHTML += `<div style="color:#8ab4f8;">» Flota en retirada. Combate evadido.</div>`;
    if (log.children.length > 5) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  }

  autoResolve(engine, mgr) {
    const log = document.getElementById('combatLog');
    if (!log) return;
    this.cannonAnim = 1.5;
    const fleet = engine.player?.fleet || [];
    const pirates = engine.combatManager?.fleetAI?.pirateFleets || [];
    let friendlyPower = fleet.reduce((s, sh) => s + (sh.hp || 0) * 0.5 + (sh.crew || 0) * 0.3 + (sh.upgradeLevel || 1) * 10, 0);
    let enemyPower = 0;
    for (const pf of pirates) {
      for (const ps of pf.ships || []) {
        enemyPower += (ps.hp || 0) * 0.4 + (ps.crew || 0) * 0.2 + (ps.upgradeLevel || 1) * 8;
      }
    }
    const totalPower = friendlyPower + enemyPower;
    const winChance = totalPower > 0 ? friendlyPower / totalPower : 0.5;
    const roll = Math.random();
    if (roll < winChance) {
      log.innerHTML += `<div style="color:#4a8;">» Victoria! Flota enemiga destruida.</div>`;
      for (const pf of pirates) { for (const ps of pf.ships || []) ps.hp = 0; }
      engine.player.reputation = (engine.player.reputation || 0) + 5;
      engine.onPirateKilled?.();
    } else {
      log.innerHTML += `<div style="color:#c44;">» Derrota! Flota aliada severamente dañada.</div>`;
      for (const ship of fleet) { ship.hp = Math.max(1, (ship.hp || 0) * 0.3); }
    }
    if (log.children.length > 5) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
    this.refresh(engine, mgr);
  }
}
