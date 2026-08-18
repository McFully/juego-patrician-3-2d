import { ScreenBase } from './ScreenBase.js';

export class ChurchScreen extends ScreenBase {
  constructor(mgr) { super(mgr, 'Iglesia', '\u{26EA}'); }
  render() {
    return this.build(`
      <div class="flex gap-sm flex-wrap">
        <div style="flex:1;min-width:280px;">
          <div class="hansa-subtitle">Donaciones a los Pobres</div>
          <div style="font-size:12px;line-height:2;">
            <div style="font-size:11px;color:var(--hansa-on-surface-variant);">Dona comida para atraer mendigos (futuros trabajadores) y aumentar tu reputación.</div>
            <div class="flex gap-sm flex-wrap" style="align-items:center;margin-top:6px;">
              <select id="churchGood" class="hansa-select">
                <option value="bread">Pan</option>
                <option value="grain">Grano</option>
                <option value="fish">Pescado</option>
                <option value="beer">Cerveza</option>
              </select>
              <input type="number" id="churchQty" value="10" min="1" max="999" style="width:70px;background:rgba(0,31,63,0.4);border:1px solid #3a2a1a;color:#e0d8c0;padding:4px;text-align:center;font-family:inherit;font-size:12px;border-radius:2px;">
              <button class="uiBtn uiBtnGold" id="btnDonate" style="font-size:10px;">Donar</button>
              <button class="uiBtn uiBtnGold" id="btnDonateGenerous" style="font-size:10px;border-color:#c8a040;">Donación generosa (×3)</button>
            </div>
            <div id="churchDonationResult" style="font-size:11px;color:var(--hansa-secondary);margin-top:4px;"></div>
          </div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Rezar</div>
          <div style="font-size:12px;line-height:1.8;">
            <div style="color:var(--hansa-on-surface-variant);font-size:11px;">Rezar evita multas por herejía y otorga bendiciones.</div>
            <button class="uiBtn uiBtnGold" id="btnPray" style="margin-top:6px;font-size:10px;">Rezar ($100)</button>
          </div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Ampliación del Templo</div>
          <div style="font-size:12px;">
            <div style="color:var(--hansa-on-surface-variant);font-size:11px;">Contribuye al fondo de reconstrucción arquitectónica.</div>
            <div class="flex gap-sm flex-wrap" style="align-items:center;margin-top:6px;">
              <input type="number" id="churchAmplifyAmount" value="500" min="1" max="99999" style="width:80px;background:rgba(0,31,63,0.4);border:1px solid #3a2a1a;color:#e0d8c0;padding:4px;text-align:center;font-family:inherit;font-size:12px;border-radius:2px;">
              <button class="uiBtn uiBtnGold" id="btnAmplify" style="font-size:10px;">Donar al templo</button>
            </div>
            <div id="churchAmplifyStatus" style="font-size:11px;color:var(--hansa-on-surface-variant);margin-top:4px;">Fondo: $0 / $10,000</div>
          </div>
        </div>
        <div style="flex:1;min-width:220px;border-left:1px solid rgba(228,228,204,0.08);padding-left:12px;">
          <div class="hansa-subtitle">Reputación Local</div>
          <div id="churchRep" style="font-size:12px;line-height:1.8;"></div>
          <div class="hansa-subtitle" style="margin:20px 0 8px;">Mendigos</div>
          <div id="churchBeggars" style="font-size:12px;"></div>
        </div>
      </div>
    `);
  }
  bindEvents(engine, mgr) {
    super.bindEvents(engine, mgr);
    document.getElementById('btnDonate')?.addEventListener('click', () => this._donate(1, engine, mgr));
    document.getElementById('btnDonateGenerous')?.addEventListener('click', () => this._donate(3, engine, mgr));
    document.getElementById('btnPray')?.addEventListener('click', () => {
      if ((engine.player?.gold||0) >= 100) {
        engine.player.gold -= 100;
        engine.player.reputation = (engine.player.reputation||0) + 3;
        engine.player.blessing = true;
        document.getElementById('churchDonationResult').innerHTML = '\u2714 Has recibido una bendición divina.';
        this.refresh(engine, mgr);
      }
    });
    document.getElementById('btnAmplify')?.addEventListener('click', () => {
      const amt = parseInt(document.getElementById('churchAmplifyAmount')?.value) || 0;
      if (amt > 0 && (engine.player?.gold||0) >= amt) {
        engine.player.gold -= amt;
        const city = engine.server.world.getCity(engine.player?.currentCityId);
        city.churchFund = (city.churchFund||0) + amt;
        engine.player.reputation = (engine.player.reputation||0) + Math.floor(amt/200);
        engine.politicalSystem.reputationByCity[engine.player.currentCityId] =
          Math.min(100, (engine.politicalSystem.reputationByCity[engine.player.currentCityId]||50) + amt/300);
        this.refresh(engine, mgr);
      }
    });
  }
  _donate(mult, engine, mgr) {
    const goodId = document.getElementById('churchGood')?.value || 'bread';
    const qty = parseInt(document.getElementById('churchQty')?.value) || 10;
    const city = engine.server.world.getCity(engine.player?.currentCityId);
    if (!city) return;
    const needed = qty * mult;
    if (city.market.goods[goodId]?.stock >= needed) {
      city.market.removeStock(goodId, needed);
      const repGain = mult * 2;
      engine.player.reputation = (engine.player.reputation||0) + repGain;
      const beggarGain = Math.floor(needed * (mult === 3 ? 0.3 : 0.2)) + 1;
      city.popBeggar = (city.popBeggar||0) + beggarGain;
      engine.politicalSystem.reputationByCity[engine.player.currentCityId] =
        Math.min(100, (engine.politicalSystem.reputationByCity[engine.player.currentCityId]||50) + repGain);
      const msg = mult === 3 ? '\u2B50 Donación extremadamente generosa! Los mendigos llegan en masa!' : '\u2714 Donación realizada.';
      document.getElementById('churchDonationResult').innerHTML = msg;
      this.refresh(engine, mgr);
    }
  }
  refresh(engine, mgr) {
    const city = engine.server.world.getCity(engine.player?.currentCityId);
    if (!city) return;
    const rep = engine.politicalSystem?.reputationByCity?.[city.id] || 50;
    document.getElementById('churchRep').innerHTML =
      `Reputación en ${city.name}: <span style="color:#ffd700;">${Math.round(rep)}</span>
      <div style="margin-top:4px;font-size:11px;">Reputación global: <span style="color:#b0a080;">${Math.round(engine.player?.reputation||0)}</span></div>
      <div style="margin-top:6px;">Bendición activa: <span style="color:${engine.player?.blessing?'#4a8':'#844'};">${engine.player?.blessing?'Sí':'No'}</span></div>`;
    document.getElementById('churchBeggars').innerHTML =
      `<div style="font-size:14px;color:#b0a080;">${city.popBeggar||0}</div>
      <div style="font-size:10px;color:#6a6a4a;">mendigos en las calles</div>
      <div style="margin-top:6px;font-size:10px;color:#8a7a5a;">Los mendigos se convierten en trabajadores cuando hay viviendas disponibles.</div>`;
    document.getElementById('churchAmplifyStatus').textContent = `Fondo: $${(city.churchFund||0).toFixed(0)} / $10,000`;
  }
}
