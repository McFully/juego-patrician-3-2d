export class AudioManager {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.ambientNodes = [];
    this.musicPlaying = false;
    this._init();
  }

  _init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.15;
      this.musicGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.3;
      this.sfxGain.connect(this.ctx.destination);
    } catch(e) { 
      console.warn("AudioContext not supported", e);
      this.ctx = null; 
    }
  }

  resume() { 
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _noise(len) {
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  playSeaAmbience() {
    if (!this.ctx) return;
    this.resume();
    const buf = this._noise(this.ctx.sampleRate * 4);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 400;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.08;
    src.connect(lp); lp.connect(gain); gain.connect(this.musicGain);
    src.start();
    this.ambientNodes.push({ src, gain, lp });

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 80 + Math.random() * 20;
    const og = this.ctx.createGain();
    og.gain.value = 0.02;
    osc.connect(og); og.connect(this.musicGain);
    osc.start();
    this.ambientNodes.push({ src: osc, gain: og });

    this._ambienceInterval = setInterval(() => {
      if (og.gain) og.gain.value = 0.01 + Math.random() * 0.03;
    }, 2000);
  }

  playClick() {
    if (!this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;
    const g = this.ctx.createGain();
    g.gain.value = 0.1;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(g); g.connect(this.sfxGain);
    osc.start(); osc.stop(this.ctx.currentTime + 0.08);
  }

  playCoin() {
    if (!this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1200;
    const g = this.ctx.createGain();
    g.gain.value = 0.12;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(g); g.connect(this.sfxGain);
    osc.start(); osc.stop(this.ctx.currentTime + 0.15);
    setTimeout(() => {
      if (!this.ctx) return;
      const o2 = this.ctx.createOscillator();
      o2.type = 'sine'; o2.frequency.value = 1600;
      const g2 = this.ctx.createGain();
      g2.gain.value = 0.1;
      g2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      o2.connect(g2); g2.connect(this.sfxGain);
      o2.start(); o2.stop(this.ctx.currentTime + 0.12);
    }, 80);
  }

  playHorn() {
    if (!this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 150;
    const g = this.ctx.createGain();
    g.gain.value = 0.15;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    osc.connect(g); g.connect(this.sfxGain);
    osc.start(); osc.stop(this.ctx.currentTime + 1.2);
  }

  playTick() {
    if (!this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 400;
    const g = this.ctx.createGain();
    g.gain.value = 0.05;
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(g); g.connect(this.sfxGain);
    osc.start(); osc.stop(this.ctx.currentTime + 0.05);
  }

  playTavernMusic() {
    if (!this.ctx || this.musicPlaying) return;
    this.resume();
    this.musicPlaying = true;
    const notes = [262, 294, 330, 349, 392, 349, 330, 294, 262, 330, 392, 440, 392, 349, 330, 294];
    let i = 0;
    this._tavernInterval = setInterval(() => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = notes[i % notes.length] * 0.5;
      const g = this.ctx.createGain();
      g.gain.value = 0.08;
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(g); g.connect(this.musicGain);
      osc.start(); osc.stop(this.ctx.currentTime + 0.4);
      i++;
    }, 500);
  }

  stopTavernMusic() {
    if (this._tavernInterval) { clearInterval(this._tavernInterval); this._tavernInterval = null; }
    this.musicPlaying = false;
  }

  playCityAmbience(cityType = 'deep') {
    if (!this.ctx) return;
    this.stopAll();
    this.resume();

    // 1. Base Wind/Atmosphere
    const windBuf = this._noise(this.ctx.sampleRate * 4);
    const windSrc = this.ctx.createBufferSource();
    windSrc.buffer = windBuf;
    windSrc.loop = true;
    const windLp = this.ctx.createBiquadFilter();
    windLp.type = 'lowpass'; windLp.frequency.value = cityType === 'deep' ? 300 : 600;
    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.05;
    windSrc.connect(windLp); windLp.connect(windGain); windGain.connect(this.musicGain);
    windSrc.start();
    this.ambientNodes.push({ src: windSrc, gain: windGain });

    // 2. City Specific Layer
    if (cityType === 'deep') {
      // Coastal: Rhythmic Olas
      const waveOsc = this.ctx.createOscillator();
      waveOsc.type = 'sine';
      waveOsc.frequency.value = 40;
      const waveGain = this.ctx.createGain();
      waveGain.gain.value = 0;
      waveOsc.connect(waveGain); waveGain.connect(this.musicGain);
      waveOsc.start();
      this.ambientNodes.push({ src: waveOsc, gain: waveGain });

      this._cityInterval = setInterval(() => {
        if (waveGain.gain) {
          const t = this.ctx.currentTime;
          waveGain.gain.setTargetAtTime(0.02, t, 1);
          waveGain.gain.setTargetAtTime(0, t + 4, 1);
        }
      }, 8000);
    } else {
      // Inland: Market Bells
      this._cityInterval = setInterval(() => {
        if (!this.ctx) return;
        const bell = this.ctx.createOscillator();
        bell.type = 'sine';
        bell.frequency.value = 1200 + Math.random() * 200;
        const bg = this.ctx.createGain();
        bg.gain.value = 0.02;
        bg.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
        bell.connect(bg); bg.connect(this.musicGain);
        bell.start(); bell.stop(this.ctx.currentTime + 1.5);
      }, 15000);
    }
  }

  stopAll() {
    this.ambientNodes.forEach(n => { try { n.src.stop(); } catch(e) {} });
    this.ambientNodes = [];
    if (this._ambienceInterval) { clearInterval(this._ambienceInterval); this._ambienceInterval = null; }
    if (this._cityInterval) { clearInterval(this._cityInterval); this._cityInterval = null; }
    this.stopTavernMusic();
  }
}

export const audioManager = new AudioManager();
