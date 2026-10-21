// ==========================================================================
// JUST ONE MORE CHEST — audio.js — VERSIÓN 0.3
// motor de audio
// ==========================================================================

/* ==========================================================================
   MOTOR PRINCIPAL Y LÓGICA DEL JUEGO
   ========================================================================== */

// [0.105] Síntesis de los sonidos nuevos (cristal irreal, pistón, persiana, campanas del Trapero, pad suave)
function _nbuf(c){ if (!c._nb){ const n = c.sampleRate * 4, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; c._nb = b; } return c._nb; }
function _N(c, out, t, dur, o){
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), a = Math.min(o.a || 0.003, dur * 0.9);
  s.buffer = _nbuf(c); f.type = o.type || 'bandpass'; f.Q.value = o.q || 1; f.frequency.setValueAtTime(o.f, t);
  if (o.fEnd) f.frequency.exponentialRampToValueAtTime(o.fEnd, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 1.4); s.stop(t + dur + 0.05);
}
function _T(c, out, t, f, dur, vol, o){
  o = o || {};
  const os = c.createOscillator(), g = c.createGain(), a = Math.min(o.a || 0.003, dur * 0.9);
  os.type = o.type || 'sine'; os.frequency.setValueAtTime(f, t);
  if (o.fEnd) os.frequency.exponentialRampToValueAtTime(o.fEnd, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  os.connect(g); g.connect(out); os.start(t); os.stop(t + dur + 0.05);
}
function _ring(c, out, t, f, dur, vol){ [1, 2.76, 5.4].forEach((k, i) => _T(c, out, t, f * k, dur / (1 + i * 0.6), vol / (1 + i * 1.5))); }
// [0.209] La respuesta del eco se genera UNA vez por contexto y duración (antes se recalculaba entera, 250.000 muestras con pow, cada vez que sonaba el cristal o el pad: un tirón justo al romperse)
function _irGet(c, sec){
  c._ir = c._ir || {};
  if (c._ir[sec]) return c._ir[sec];
  const n = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, n, c.sampleRate);
  for (let ch = 0; ch < 2; ch++){ const d = b.getChannelData(ch); let lp = 0; for (let i = 0; i < n; i++){ lp += ((Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4) - lp) * 0.4; d[i] = lp; } }
  return (c._ir[sec] = b);
}
function _reverb(c, out, sec, wet){
  const b = _irGet(c, sec);
  const cv = c.createConvolver(), w = c.createGain(); cv.buffer = b; w.gain.value = wet; cv.connect(w); w.connect(out); return cv;
}
function _tinkles(c, out, t, count, spread, fLo, fHi, dMin, dVar, vol){
  for (let i = 0; i < count; i++){
    const u = Math.pow(Math.random(), 1.6), tt = t + 0.04 + u * spread, f = fLo + Math.random() * (fHi - fLo);
    _T(c, out, tt, f, dMin + Math.random() * dVar, vol * (0.5 + Math.random() * 0.5) * (1 - u * 0.55), { type: i % 3 ? 'sine' : 'triangle', a: 0.001 });
  }
}

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      // [0.090] Buses de volumen por categoría (perfil escritorio / móvil) y canal "vivo" para auriculares Bluetooth
      this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
      this.busSmall = this.ctx.createGain(); this.busSmall.connect(this.master);
      this.busLoot = this.ctx.createGain(); this.busLoot.connect(this.master);
      this._startKeepAlive();
      this.applyProfile();
      setTimeout(() => { try { _nbuf(this.ctx); _irGet(this.ctx, 2.6); } catch (e) {} }, 4000);   // [0.209] se preparan en un momento tranquilo, no justo cuando suena el cristal
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  // [0.209] Silencio general con fundido (sin congelar el reloj de audio) y vuelta al volumen del perfil
  fadeOutAll(tc = 0.12) { if (!this.ctx || !this.master) return; const t = this.ctx.currentTime; this.master.gain.cancelScheduledValues(t); this.master.gain.setTargetAtTime(0, t, tc); }
  restoreAll() { if (!this.ctx || !this.master) return; this.master.gain.cancelScheduledValues(this.ctx.currentTime); this.applyProfile(); }
  // Salida activa: la categoría en curso (pequeños / botín) o el master
  dest() { return this._bus || this.master || this.ctx.destination; }
  isMobileProfile() {
    try { return document.documentElement.classList.contains('narrow-layout') || !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); } catch (e) { return false; }
  }
  // Volúmenes por perfil: se leen de DATOS_JUEGO.SONIDO.PERFILES (escritorio / movil)
  applyProfile() {
    if (!this.ctx || !this.master) return;
    const cfg = (DATOS_JUEGO.SONIDO || {}).PERFILES || {};
    const pr = (this.isMobileProfile() ? cfg.movil : cfg.escritorio) || { GENERAL: 1, PEQUENOS: 1, BOTIN: 1 };
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(pr.GENERAL, t, 0.05);
    this.busSmall.gain.setTargetAtTime(pr.PEQUENOS, t, 0.05);
    this.busLoot.gain.setTargetAtTime(pr.BOTIN, t, 0.05);
    this.profileName = this.isMobileProfile() ? 'movil' : 'escritorio';
    if (this._ka) {
      const kc = (DATOS_JUEGO.SONIDO || {}).CANAL_VIVO || {};
      this._ka.gain.setTargetAtTime((kc.ACTIVAR === false || this.muted) ? 0 : (kc.NIVEL || 0.0015), t, 0.2);
    }
  }
  // Ruido casi inaudible y continuo: evita que los auriculares Bluetooth "duerman" el canal y se coman el inicio de los sonidos cortos
  _startKeepAlive() {
    const kc = (DATOS_JUEGO.SONIDO || {}).CANAL_VIVO || {};
    if (kc.ACTIVAR === false) return;
    const c = this.ctx, n = c.sampleRate * 2, buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
    const g = c.createGain(); g.gain.value = 0;
    src.connect(lp); lp.connect(g); g.connect(c.destination); src.start();
    this._ka = g;
  }
  playClick(proximityRatio = 0) {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 250 + (proximityRatio * 750);
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.dest());
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }
  // [0.087] Utilidades de síntesis y sonidos de la cerradura (uno propio por tipo de cofre)
  _tone(f0, f1, dur, type = 'sine', vol = 0.12, delay = 0) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g); g.connect(this.dest());
    osc.start(t); osc.stop(t + dur + 0.02);
  }
  _noise(dur, vol = 0.1, delay = 0, hp = 0) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + delay;
    const n = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    let last = src;
    if (hp) { const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; src.connect(f); last = f; }
    last.connect(g); g.connect(this.dest());
    src.start(t);
  }
  // Cargar la cerradura (primer toque con varios cofres): sonido corto y "tenso"
  playLockCharge(typeId) {
    if (!this.ctx || this.muted) return;
    if (typeId === 'piston') { this._tone(520, 980, 0.12, 'square', 0.07); this._tone(1400, 1400, 0.05, 'triangle', 0.05, 0.08); }
    else if (typeId === 'cyber') { this._tone(880, 880, 0.06, 'triangle', 0.3); this._tone(1320, 1320, 0.08, 'triangle', 0.3, 0.07); }
    else if (typeId === 'hydraulic') { this._noise(0.16, 0.08, 0, 1800); this._tone(110, 190, 0.16, 'sawtooth', 0.05); }
    else if (typeId === 'neon') { this._tone(1046, 1046, 0.05, 'square', 0.05); this._tone(1568, 1568, 0.07, 'square', 0.05, 0.06); }   // [0.201]
    else if (typeId === 'electric') { this._noise(0.05, 0.07, 0, 4500); this._tone(220, 1400, 0.09, 'sawtooth', 0.04); }   // [0.203] chisporroteo
    else { this._tone(170, 270, 0.1, 'triangle', 0.14); this._noise(0.03, 0.08, 0, 2500); }
  }
  // Abrir (segundo toque / único cofre / botón): sonido más grave y "resolutivo"
  playLockOpen(typeId) {
    if (!this.ctx || this.muted) return;
    if (typeId === 'piston') { this._tone(320, 110, 0.16, 'square', 0.1); this._tone(1250, 900, 0.22, 'triangle', 0.06, 0.03); this._noise(0.04, 0.08, 0, 2000); }
    else if (typeId === 'cyber') { [660, 880, 1320].forEach((f, i) => this._tone(f, f * 1.01, 0.11, 'triangle', 0.3, i * 0.06)); }
    else if (typeId === 'hydraulic') { this._noise(0.3, 0.1, 0, 900); this._tone(95, 55, 0.28, 'sawtooth', 0.08); }
    else if (typeId === 'electric') { this._noise(0.12, 0.09, 0, 5000); [262, 392, 523, 784].forEach((f, i) => this._tone(f, f, 0.08, 'sawtooth', 0.04, i * 0.045)); this._tone(60, 60, 0.25, 'square', 0.05, 0.02); }   // [0.203] descarga y zumbido
    else if (typeId === 'neon') { [523, 784, 1046].forEach((f, i) => this._tone(f, f, 0.1, 'square', 0.05, i * 0.05)); this._tone(2093, 2093, 0.18, 'sine', 0.03, 0.12); }   // [0.201] Arca de Neón: arpegio eléctrico
    else {   // [0.090] madera: vuelve el "barril" de la 0.089 (el ajuste de la 0.089b se descartó)
      this._tone(150, 62, 0.14, 'sine', 0.2); this._noise(0.05, 0.1, 0, 1500); this._tone(300, 180, 0.06, 'triangle', 0.08, 0.04);
    }
  }
  // [0.201] Puzle SECUENCIA: nota de cada luz (cuadrada, suave), fallo grave y acorde de victoria
  playSeqNote(i, dur = 0.22, vol = 0.09) {
    if (!this.ctx || this.muted) return;
    const hz = DATOS_JUEGO.MINIJUEGOS.SECUENCIA.NOTAS_HZ[i] || 261.63;
    this._tone(hz, hz, dur, 'square', vol);
  }
  // [0.205] Fusibles resueltos: chisporroteo y zumbido eléctrico de ~1,3 s que sube de tono
  playFuseBuzz() {
    if (!this.ctx || this.muted) return;
    this._noise(0.12, 0.1, 0, 5200);
    this._tone(100, 140, 1.3, 'sawtooth', 0.05);
    this._tone(200, 280, 1.2, 'square', 0.025, 0.05);
    [0.15, 0.4, 0.62, 0.9].forEach(t => this._noise(0.05, 0.08, t, 4500));
    this._tone(880, 1760, 0.35, 'triangle', 0.04, 0.9);
  }
  playSeqFail() { if (!this.ctx || this.muted) return; this._tone(110, 90, 0.6, 'sawtooth', 0.1); }
  playSeqWin() {
    if (!this.ctx || this.muted) return;
    const N = DATOS_JUEGO.MINIJUEGOS.SECUENCIA.NOTAS_HZ;
    [0, 1, 2, 3, 3].forEach((v, k) => this._tone(N[v], N[v], 0.26, 'square', 0.08, 0.3 + k * 0.17));
    this._tone(N[0], N[0], 0.9, 'triangle', 0.07, 1.25); this._tone(N[2], N[2], 0.9, 'triangle', 0.06, 1.25);
  }
  // [0.089b] Maldición: melodía lúgubre al empezar, y de cierre con nota final aguda al terminar
  playCurseStart() {
    if (!this.ctx || this.muted) return;
    [196, 185, 165, 123].forEach((f, i) => this._tone(f, f * 0.995, 0.7, 'triangle', 0.14, i * 0.42));
    this._tone(55, 50, 2.2, 'sawtooth', 0.04);
  }
  playCurseEnd() {
    if (!this.ctx || this.muted) return;
    [247, 294, 370, 494].forEach((f, i) => this._tone(f, f * 1.003, 0.6, 'sine', 0.12, i * 0.3));
    this._tone(988, 988, 1.4, 'sine', 0.09, 1.2);
  }
  // [0.089b] Melodías de 4 notas para los diálogos: una para el Trapero (grave, menor) y otra para el Duende (traviesa, aguda)
  playDialogueMelody(who) {
    if (!this.ctx || this.muted) return;
    if (who === 'EL TRAPERO') [196, 233, 175, 147].forEach((f, i) => { this._tone(f, f, 0.32, 'triangle', 0.13, i * 0.17); this._tone(f * 2, f * 2, 0.2, 'sine', 0.03, i * 0.17); });
    else [523, 659, 587, 784].forEach((f, i) => this._tone(f, f * 1.01, 0.2, 'sine', 0.09, i * 0.11));
  }
  // [0.092] Aura del cofre legendario: colchón cálido y suave de pocas notas que "respira" (volumen que sube y baja muy despacio)
  // y, de vez en cuando, un destello de campanilla/celesta. Sin batido ni agudos molestos. Todo ajustable en DATOS_JUEGO.ZUMBIDO_LEGENDARIO.
  setLegendHum(on, cfg) {
    if (!this.ctx) return;
    const c = this.ctx;
    if (!this._hum && on) {
      const g = c.createGain(); g.gain.value = 0;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cfg.CORTE_HZ || 1500; lp.Q.value = 0.5;
      const depth = Math.max(0, Math.min(0.95, cfg.RESPIRACION_PROFUNDIDAD != null ? cfg.RESPIRACION_PROFUNDIDAD : 0.5));
      const breath = c.createGain(); breath.gain.value = 1 - depth / 2;
      const lfo = c.createOscillator(), lfoG = c.createGain();
      lfo.frequency.value = 1 / (cfg.RESPIRACION_S || 8); lfoG.gain.value = depth / 2; lfo.connect(lfoG); lfoG.connect(breath.gain); lfo.start();
      (cfg.NOTAS_HZ || [220, 330, 440, 554.4]).forEach((f, i) => {
        [-1, 1].forEach(sg => {
          const o = c.createOscillator(), og = c.createGain();
          o.type = 'sine'; o.frequency.value = f; o.detune.value = sg * (3 + i);
          og.gain.value = 0.25 / (1 + i * 0.35); o.connect(og); og.connect(breath); o.start();
        });
      });
      breath.connect(lp); lp.connect(g); g.connect(this.master || c.destination);
      this._hum = { g, next: 0 };
    }
    const h = this._hum; if (!h) return;
    const vol = (!on || this.muted) ? 0 : (cfg.VOLUMEN || 0.05);
    h.g.gain.setTargetAtTime(vol, c.currentTime, (cfg.FUNDIDO_S || 1.5) / 3);
    // Destello de campanilla (celesta): nota alta de una escala pentatónica, ataque rápido y cola larga
    const ch = cfg.CAMPANILLA || {};
    if (on && !this.muted && ch.ACTIVAR !== false) {
      const now = performance.now();
      if (!h.next) h.next = now + 2500 + Math.random() * 2500;
      if (now >= h.next) {
        h.next = now + 1000 * ((ch.CADA_MIN_S || 4) + Math.random() * ((ch.CADA_MAX_S || 8) - (ch.CADA_MIN_S || 4)));
        const notes = ch.NOTAS_HZ || [880, 988, 1109, 1319, 1480, 1760];
        const f = notes[Math.floor(Math.random() * notes.length)], t = c.currentTime, v = ch.VOLUMEN != null ? ch.VOLUMEN : 0.03;
        [[1, 1], [2.76, 0.22], [5.4, 0.08]].forEach(([m, a]) => {
          const o = c.createOscillator(), og = c.createGain();
          o.type = 'sine'; o.frequency.value = f * m;
          og.gain.setValueAtTime(0.0001, t); og.gain.linearRampToValueAtTime(v * a, t + 0.008); og.gain.exponentialRampToValueAtTime(0.0001, t + (ch.COLA_S || 1.8) / m);
          o.connect(og); og.connect(this.master || c.destination); o.start(t); o.stop(t + (ch.COLA_S || 1.8) + 0.05);
        });
      }
    } else if (h) { h.next = 0; }
  }
  // [0.090] Swoosh leve al elegir otro cofre en el selector (barrido de ruido que sube)
  playSwoosh() {
    if (!this.ctx || this.muted) return;
    const c = this.ctx, t = c.currentTime, n = Math.floor(c.sampleRate * 0.16), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(500, t); bp.frequency.exponentialRampToValueAtTime(2600, t + 0.14);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    src.connect(bp); bp.connect(g); g.connect(this.dest()); src.start(t);
  }
  // [0.087b] Más sonidos: oscuridad, luz, adornos, llaves y melodía de inicio
  playDarkOut() {   // progresión de notas graves al apagarse la bombilla
    if (!this.ctx || this.muted) return;
    [110, 98, 82, 65].forEach((f, i) => this._tone(f, f * 0.97, 0.5, 'triangle', 0.2, i * 0.22));
    this._tone(45, 38, 1.6, 'sawtooth', 0.06);
  }
  playLightOn() {   // acorde suave ascendente al encenderse la luz
    if (!this.ctx || this.muted) return;
    [262, 330, 392, 523].forEach((f, i) => this._tone(f, f * 1.003, 0.7, 'sine', 0.09, i * 0.09));
  }
  playDecorTap() {  // al pulsar un adorno secreto
    if (!this.ctx || this.muted) return;
    this._tone(740, 1100, 0.1, 'triangle', 0.11);
    this._tone(1480, 1480, 0.18, 'sine', 0.05, 0.05);
    this._tone(220, 160, 0.18, 'sine', 0.1, 0.02);
  }
  playKeyPickup() { // "+1" de llave
    if (!this.ctx || this.muted) return;
    this._tone(880, 1320, 0.09, 'triangle', 0.1);
    this._tone(1320, 1760, 0.12, 'sine', 0.08, 0.07);
  }
  playKeySpend() {  // "-1" de llave: dos notas descendentes
    if (!this.ctx || this.muted) return;
    this._tone(620, 400, 0.1, 'triangle', 0.1);
    this._tone(400, 250, 0.14, 'sine', 0.08, 0.07);
  }
  // [0.090] Enfado del Duende: gruñido agudo y desagradable; nivel 1-3 (más golpes y más grave)
  playDuendeAngry(level = 1) {
    if (!this.ctx || this.muted) return;
    this._tone(620, 190, 0.28 + 0.08 * level, 'sawtooth', 0.11 + 0.03 * level);
    this._tone(640, 200, 0.28 + 0.08 * level, 'square', 0.05 + 0.02 * level, 0.01);
    this._noise(0.06, 0.12, 0, 1800);
    for (let i = 1; i < level + 1; i++) { this._tone(480 - i * 40, 150, 0.16, 'sawtooth', 0.1, 0.22 * i + 0.1); this._noise(0.05, 0.1, 0.22 * i + 0.1, 1500); }
    if (level >= 3) { this._tone(70, 40, 1.0, 'sawtooth', 0.12, 0.1); this._tone(140, 60, 0.7, 'square', 0.06, 0.15); }
  }
  // [0.090] Golpe de Game Over: impacto grave, ruido, sting disonante corto (versión corta de la melodía de Game Over)
  playChestMutate() {   // [0.096] "plop" corto: seno 400→180 Hz ~90 ms + ruido leve, volumen bajo
    if (!this.ctx || this.muted) return;
    this._tone(400, 180, 0.09, 'sine', 0.10);
    this._noise(0.05, 0.02, 0, 800);
  }
  playGameOverStrike() {
    if (!this.ctx || this.muted) return;
    this._tone(90, 28, 0.55, 'sine', 0.35);
    this._noise(0.22, 0.28, 0, 400);
    this._tone(55, 40, 1.6, 'sawtooth', 0.09, 0.05);
    [392, 370, 311].forEach((f, i) => this._tone(f, f * 0.97, 0.45, 'triangle', 0.13, 0.25 + i * 0.3));
    this._tone(233, 220, 0.9, 'sawtooth', 0.05, 0.3);
  }
  // [0.092] Subida de nivel: fanfarria 8/16 bits (arpegio de onda cuadrada, bajo triangular y remate largo)
  // [0.103] Cuenta atrás de los puzles (Variante D "Latido"): golpe grave que sube de tono + clic agudo. i = 0..4 (5 s … 1 s)
  playCountdownBeep(i = 0) {
    if (!this.ctx || this.muted) return;
    const f = [70, 78, 88, 100, 115][Math.max(0, Math.min(4, i))];
    this._tone(f, f * 0.55, 0.2, 'sine', 0.5);
    this._tone(1800 + i * 250, 1800 + i * 250, 0.02, 'square', 0.05, 0.02);
  }
  // [0.103] Subida de nivel rápida (durante la secuencia final, sin parar el juego): cuatro notas muy cortas
  playLevelUpQuick() {
    if (!this.ctx || this.muted) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this._tone(f, f, 0.08, 'square', 0.07, i * 0.06));
  }
  playLevelUpFanfare() {
    if (!this.ctx || this.muted) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this._tone(f, f, 0.11, 'square', 0.07, i * 0.09));
    [659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this._tone(f, f, 0.11, 'square', 0.07, 0.42 + i * 0.09));
    this._tone(1046.5, 1046.5, 0.7, 'square', 0.08, 0.82); this._tone(1318.5, 1318.5, 0.7, 'square', 0.05, 0.82); this._tone(1568, 1568, 0.7, 'triangle', 0.07, 0.82);
    [131, 165, 196, 262].forEach((f, i) => this._tone(f, f, 0.2, 'triangle', 0.16, i * 0.2));
    this._tone(262, 262, 0.8, 'triangle', 0.16, 0.82);
    // [0.093] Más espectáculo: platillazo, arpegio brillante, acorde largo y golpe de bombo
    this._noise(0.5, 0.10, 0.82, 6500);
    [1046.5, 1318.5, 1568, 2093, 2637, 3136].forEach((f, i) => this._tone(f, f, 0.12, 'square', 0.045, 1.0 + i * 0.075));
    [523.25, 659.25, 783.99, 1046.5].forEach(f => this._tone(f, f, 1.2, 'triangle', 0.07, 1.5));
    [3136, 3951].forEach((f, i) => this._tone(f, f, 0.9, 'sine', 0.035, 1.55 + i * 0.08));
    this._tone(110, 45, 0.35, 'sine', 0.22, 0); this._tone(110, 45, 0.45, 'sine', 0.22, 0.82);
    this._tone(131, 131, 1.2, 'triangle', 0.14, 1.5);
  }
  // [0.092] "Ruidito" de la ruleta: clic agudo corto; el tono sube un poco y se alarga al frenar (p = 0..1)
  playRouletteTick(p = 0) {
    if (!this.ctx || this.muted) return;
    const f = 760 + 380 * p + (Math.random() * 40);
    this._tone(f, f * 0.72, 0.045 + 0.04 * p, 'square', 0.07);
  }
  // [0.092] Un cofre abierto deja salir su carta (destello ascendente)
  playCardRise() {
    if (!this.ctx || this.muted) return;
    this._tone(520, 1040, 0.12, 'triangle', 0.09);
    this._tone(1560, 2080, 0.16, 'sine', 0.05, 0.05);
  }
  playCardBeep() {  // pitido suave y corto de las cartas que palpitan
    if (!this.ctx || this.muted) return;
    this._tone(1175, 1175, 0.09, 'sine', 0.05);
    this._tone(1568, 1568, 0.07, 'sine', 0.03, 0.06);
  }
  playCashRegister() {  // [0.089] "¡cha-ching!": clic mecánico, campanilla y monedas
    if (!this.ctx || this.muted) return;
    this._noise(0.035, 0.12, 0, 2500);
    this._tone(220, 90, 0.07, 'square', 0.07);
    this._noise(0.05, 0.09, 0.07, 3500);
    [1568, 2093].forEach(f => this._tone(f, f, 0.65, 'sine', 0.09, 0.12));
    this._tone(3136, 3136, 0.45, 'sine', 0.035, 0.12);
    // [0.097b] Monedas: tintineos metálicos SIN tono descendente (antes sonaban a pajaritos): golpe de ruido agudo + parciales inarmónicos fijos, caída rápida
    [0.34, 0.41, 0.47, 0.56, 0.62].forEach((d, i) => {
      this._noise(0.035, 0.07, d, 4200);
      const f = 1850 + (i % 3) * 230;
      this._tone(f, f, 0.08, 'sine', 0.05, d);
      this._tone(f * 1.52, f * 1.52, 0.06, 'sine', 0.03, d);
      this._tone(f * 0.34, f * 0.34, 0.07, 'sine', 0.035, d);
    });
  }
  playIntro() {     // dungeon synth ascendente al empezar (reverso del game over)
    if (!this.ctx || this.muted) return;
    [185, 196, 233, 277, 311, 370, 392].forEach((f, i) => this._tone(f, f * 1.01, 0.6, 'triangle', 0.1, i * 0.3));
    this._tone(98, 130, 2.6, 'sawtooth', 0.04);
    this._tone(392, 392, 1.2, 'sine', 0.07, 2.1);
  }
  // Clic suave de interfaz para botones que no sonaban
  playUiClick() {
    if (!this.ctx || this.muted) return;
    this._tone(540, 360, 0.035, 'sine', 0.07);
  }
  // Game over: notas descendentes inquietantes sobre un zumbido grave
  playGameOver() {
    if (!this.ctx || this.muted) return;
    [392, 370, 311, 277, 233, 196, 185].forEach((f, i) => this._tone(f, f * 0.985, 0.55, 'triangle', 0.11, i * 0.42));
    this._tone(55, 40, 3.4, 'sawtooth', 0.05);
    this._tone(58, 41, 3.4, 'sine', 0.06, 0.1);
  }
  playPaperRustle() {
    if (!this.ctx || this.muted) return;
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    noise.connect(gain);
    gain.connect(this.dest());
    noise.start();
  }
  playDecoyBuzz() {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.dest());

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }
  // [0.105] Sonidos nuevos. _fx crea una salida con ganancia propia y ejecuta la síntesis
  _fx(g, fn) {
    if (!this.ctx || this.muted) return;
    const c = this.ctx, o = c.createGain(); o.gain.value = g; o.connect(this.dest());
    fn(c, c.currentTime + 0.03, o);
  }
  playGlassIrreal() {   // cristal roto del colapso final: silbido que sube, rotura y nota larga con eco
    this._fx(0.8, (c, t, o) => {
      const bus = c.createGain(); bus.connect(o); bus.connect(_reverb(c, o, 2.6, 0.7));
      _N(c, bus, t, 0.8, { f: 300, fEnd: 7000, q: 2, vol: 0.4, a: 0.7 });
      const k = t + 0.8; _N(c, bus, k, 0.06, { type: 'highpass', f: 1800, vol: 0.55, a: 0.001 }); _T(c, bus, k, 170, 0.2, 0.45, { fEnd: 50 });
      _tinkles(c, bus, k, 30, 1.8, 1200, 4600, 0.15, 0.4, 0.09);
      _T(c, bus, k, 392, 2.4, 0.09, { a: 0.05, fEnd: 366 }); _T(c, bus, k, 587, 2.2, 0.05, { a: 0.05, fEnd: 560 });
    });
  }
  playPistonSeal() {   // pistones sellados en la línea azul: matraca y campanilla
    this._fx(1, (c, t, o) => {
      for (let i = 0; i < 3; i++) _N(c, o, t + i * 0.045, 0.02, { f: 2200 + i * 500, q: 6, vol: 0.3, a: 0.001 });
      _T(c, o, t + 0.14, 100, 0.1, 0.3, { fEnd: 60 }); _ring(c, o, t + 0.14, 1400, 0.4, 0.2);
    });
  }
  playShutter() {   // persiana de la tienda del Duende: tablillas pesadas y golpe final ([0.2] ganancia 1.4 → 1.0)
    this._fx(1.0, (c, t, o) => {
      let tt = t;
      for (let i = 0; i < 16; i++) { _N(c, o, tt, 0.045, { f: 1500 + Math.random() * 1200, q: 3, vol: 0.4 + Math.random() * 0.15, a: 0.001 }); _T(c, o, tt, 190 + Math.random() * 60, 0.07, 0.4, { fEnd: 90, a: 0.001 }); tt += 0.055 + 0.07 * Math.abs(Math.cos(i / 16 * Math.PI)); }
      _N(c, o, t, tt - t + 0.1, { type: 'lowpass', f: 220, vol: 0.2, a: 0.1 });
      _T(c, o, tt, 80, 0.35, 0.9, { fEnd: 38, a: 0.002 }); _N(c, o, tt, 0.18, { type: 'lowpass', f: 700, vol: 0.6, a: 0.002 }); _N(c, o, tt, 0.04, { type: 'highpass', f: 2500, vol: 0.4, a: 0.001 });
    });
  }
  playDealBell(i = 0) {   // cada uno de los 3 tratos del Trapero: campana descendente (la, fa#, re)
    this._fx(1.5, (c, t, o) => _ring(c, o, t, [440, 370, 294][i % 3], 0.9, 0.22));
  }
  playSoftPad() {   // fundido de ambiente / fin de maldición: pad con quinta
    this._fx(0.9, (c, t, o) => {
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(o);
      const bus = c.createGain(); bus.connect(lp); bus.connect(_reverb(c, o, 2.6, 0.55));
      [[196, 0], [293.7, 4], [196, -5]].forEach(p => { const os = c.createOscillator(), g = c.createGain(); os.type = 'triangle'; os.frequency.value = p[0]; os.detune.value = p[1]; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6); os.connect(g); g.connect(bus); os.start(t); os.stop(t + 2.7); });
    });
  }
  playBreak() {
    if (!this.ctx || this.muted) return;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    noise.connect(gain);
    gain.connect(this.dest());
    noise.start();
  }
  playUnlockFanfare(tier = 'normal') {
    if (!this.ctx || this.muted) return;
    let notes = [523.25, 659.25, 783.99, 1046.50];
    if (tier === 'epico' || tier === 'legendario') {
      notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    }
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.35);
      osc.connect(gain);
      gain.connect(this.dest());
      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.35);
    });
  }
}
const audio = new AudioEngine();
// [0.087] Registro del último sonido para que el clic de interfaz no se solape con sonidos propios
['playClick', 'playSeqNote', 'playSeqFail', 'playSeqWin', 'playPaperRustle', 'playDecoyBuzz', 'playBreak', 'playUnlockFanfare', 'playLockCharge', 'playLockOpen', 'playGameOver', 'playDarkOut', 'playLightOn', 'playDecorTap', 'playKeyPickup', 'playKeySpend', 'playCardBeep', 'playCashRegister', 'playCurseStart', 'playCurseEnd', 'playDialogueMelody', 'playIntro', 'playDuendeAngry', 'playSwoosh', 'playGameOverStrike', 'playLevelUpFanfare', 'playLevelUpQuick', 'playRouletteTick', 'playCardRise', 'playChestMutate'].forEach(n => {
  const f = AudioEngine.prototype[n];
  AudioEngine.prototype[n] = function (...a) { this.lastSound = performance.now(); return f.apply(this, a); };
});
// [0.090] Categorías de volumen: los sonidos pequeños (clics, avisos) y los de botín pasan por su bus, con volumen distinto en escritorio y móvil
[[ 'busSmall', ['playClick', 'playChestMutate', 'playUiClick', 'playDecoyBuzz', 'playPaperRustle', 'playLockCharge', 'playDecorTap', 'playCardBeep', 'playKeyPickup', 'playKeySpend', 'playSwoosh', 'playRouletteTick', 'playCardRise'] ],
 [ 'busLoot', ['playUnlockFanfare', 'playCashRegister', 'playLevelUpFanfare', 'playLevelUpQuick'] ]].forEach(([bus, names]) => names.forEach(n => {
  const f = AudioEngine.prototype[n];
  AudioEngine.prototype[n] = function (...a) { const prev = this._bus; this._bus = this[bus] || null; try { return f.apply(this, a); } finally { this._bus = prev; } };
}));
window.addEventListener('resize', () => { try { audio.applyProfile(); } catch (e) {} });
