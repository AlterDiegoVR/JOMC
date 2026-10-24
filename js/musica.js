// ==========================================================================
// JUST ONE MORE CHEST — musica.js — VERSIÓN 0.41
// Música del juego: las piezas elegidas por el jugador (F menú, I inicio de bucle, A tienda de tratos, J tienda del Duende, K cerrojo final, G final bueno, H final malo).
// Se generan con WebAudio (sin archivos). Un "director" mira cada medio segundo qué pantalla hay y cambia de pieza con fundido.
// Volumen general: DATOS_JUEGO.SONIDO.MUSICA.VOLUMEN (0.7 = el del artefacto de pruebas). Cofres con música de bucle: MUSICA.BUCLE_COFRES.
// ==========================================================================
(function () {
'use strict';
function mtof(m){ return 440 * Math.pow(2, (m - 69) / 12); }

/* ---------- efectos ---------- */
function impulse(c, sec, dark){
  var n = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, n, c.sampleRate);
  for (var ch = 0; ch < 2; ch++){
    var d = b.getChannelData(ch), lp = 0;
    for (var i = 0; i < n; i++){ var x = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4); lp += (x - lp) * dark; d[i] = lp; }
  }
  return b;
}
/* ---------- efectos: reverb de convolución (con eco opcional) y compresor; la salida va al volumen general del juego ---------- */
const _irCache = {};
function impulse(c, sec, dark){
  const key = sec + '_' + dark;
  if (_irCache[key] && _irCache[key].sampleRate === c.sampleRate) return _irCache[key];
  const n = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, n, c.sampleRate);
  for (let ch = 0; ch < 2; ch++){
    const d = b.getChannelData(ch); let lp = 0;
    for (let i = 0; i < n; i++){ const x = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4); lp += (x - lp) * dark; d[i] = lp; }
  }
  return (_irCache[key] = b);
}
function makeFx(c, p, level, outNode){
  const master = c.createGain(), comp = c.createDynamicsCompressor(), vol = c.createGain(), duck = c.createGain();   // duck: baja la música mientras hay un puzle musical
  comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.03; comp.release.value = 0.4;
  vol.gain.value = 0.0001;
  master.connect(comp); comp.connect(vol); vol.connect(duck); duck.connect(outNode);
  const inp = c.createGain();
  const dry = c.createGain(); dry.gain.value = 1 - (p.rev.wet * 0.35); inp.connect(dry); dry.connect(master);
  const conv = c.createConvolver(); conv.buffer = impulse(c, p.rev.sec, p.rev.dark);
  const wet = c.createGain(); wet.gain.value = p.rev.wet; inp.connect(conv); conv.connect(wet); wet.connect(master);
  if (p.delay){
    const dl = c.createDelay(2.5), fb = c.createGain(), dm = c.createGain();
    dl.delayTime.value = p.delay.time; fb.gain.value = p.delay.fb; dm.gain.value = p.delay.mix;
    inp.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(dm); dm.connect(master); dm.connect(conv);
  }
  return { inp: inp, vol: vol, duck: duck, target: level * (p.lvl || 1) };
}
/* ---------- voces ---------- */
function V(c, out, o){
  var t = o.t, dur = o.dur, a = o.a == null ? 0.01 : o.a, d = Math.max(0.001, o.d == null ? 0.1 : o.d), s = o.s == null ? 1 : o.s, r = o.r == null ? 0.3 : o.r, vol = o.vol || 0.1;
  var g = c.createGain(), hold = t + Math.max(dur, a + d), sus = Math.max(0.0001, vol * s);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + a);
  g.gain.exponentialRampToValueAtTime(sus, t + a + d);
  g.gain.setValueAtTime(sus, hold);
  g.gain.exponentialRampToValueAtTime(0.0001, hold + r);
  var mix = c.createGain(), last = mix;
  if (o.lp){
    var f = c.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = o.q || 0.7; f.frequency.setValueAtTime(o.lp, t);
    if (o.lpEnd) f.frequency.exponentialRampToValueAtTime(o.lpEnd, t + Math.max(dur, 0.1));
    last.connect(f); last = f;
  }
  last.connect(g); g.connect(out);
  var end = hold + r + 0.1, lfo = null, vg = null;
  if (o.vib){
    lfo = c.createOscillator(); lfo.frequency.value = o.vib.rate; vg = c.createGain();
    vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(o.vib.depth, t + (o.vib.delay || 0.8));
    lfo.connect(vg); lfo.start(t); lfo.stop(end);
  }
  (o.det || [0]).forEach(function(dc){
    var os = c.createOscillator(); os.type = o.type || 'sine';
    os.frequency.value = o.f; os.detune.value = dc;
    if (vg) vg.connect(os.frequency);
    os.connect(mix); os.start(t); os.stop(end);
  });
}
function bell(c, out, t, f, vol, dec){
  [1, 2.76, 5.4].forEach(function(k, i){
    var os = c.createOscillator(), g = c.createGain(); os.type = 'sine'; os.frequency.value = f * k;
    var v = vol / (1 + i * 1.6), d = dec / (1 + i * 0.7);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    os.connect(g); g.connect(out); os.start(t); os.stop(t + d + 0.1);
  });
}
function distCurve(k){ var n = 1024, cv = new Float32Array(n); for (var i = 0; i < n; i++){ var x = i * 2 / n - 1; cv[i] = Math.tanh(x * k); } return cv; }
function trem(c, out, t, dur, midi, vol){
  var base = mtof(midi), g = c.createGain(), mix = c.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
  g.gain.setValueAtTime(vol, t + dur - 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.1);
  var sh = c.createWaveShaper(); sh.curve = distCurve(5);
  var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 220;
  var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; lp.Q.value = 0.9;
  var am = c.createGain(); am.gain.value = 0.55;
  var lfo = c.createOscillator(), lg = c.createGain(); lfo.type = 'sawtooth'; lfo.frequency.value = 10.5; lg.gain.value = -0.5; lfo.connect(lg); lg.connect(am.gain);
  mix.connect(sh); sh.connect(hp); hp.connect(lp); lp.connect(am); am.connect(g); g.connect(out);
  var end = t + dur + 0.2; lfo.start(t); lfo.stop(end);
  [[0, -7, 1], [0, 7, 1], [7, 0, 0.55]].forEach(function(x){
    var os = c.createOscillator(), og = c.createGain(); os.type = 'sawtooth'; os.frequency.value = base * Math.pow(2, x[0] / 12); os.detune.value = x[1]; og.gain.value = x[2] * 0.5;
    os.connect(og); og.connect(mix); os.start(t); os.stop(end);
  });
}

/* ---------- piezas: cada una devuelve eventos {t, f} con tiempos absolutos ---------- */
function ev(list, t, fn){ list.push({ t: t, f: fn }); }

function buildA(c, pb, T){            // Dungeon synth: cripta
  var E = [];
  var chords = [[45, 52, 57, 60, 64], [43, 50, 55, 59, 62], [41, 48, 53, 57, 60], [40, 47, 52, 56, 59]];
  for (var k = 0; k < 8; k++) (function(k){
    var ch = chords[k % 4], t0 = T + k * 8;
    ev(E, t0, function(){
      ch.forEach(function(m, i){ V(c, pb, { t: t0, dur: 7, a: 3, d: 1, s: 0.9, r: 3.5, f: mtof(m), type: 'sawtooth', det: [-9, 9], lp: 650 + i * 60, vol: 0.045 }); });
      V(c, pb, { t: t0, dur: 7.5, a: 1.5, d: 1, s: 0.9, r: 2.5, f: mtof(ch[0] - 12), type: 'sine', vol: 0.16 });
    });
  })(k);
  var mel = [[1, 76, 3], [4.5, 72, 2.5], [9, 74, 3], [12.5, 71, 3], [17, 72, 3], [20.5, 69, 3], [25, 71, 2.5], [28, 68, 2], [30, 71, 1.5],
             [33, 81, 3], [36.5, 76, 3], [41, 79, 2.5], [44, 74, 3], [49, 77, 3], [52.5, 72, 3], [57, 76, 3], [60, 71, 1.5], [61.5, 68, 2.5]];
  mel.forEach(function(n){ ev(E, T + n[0], function(){
    V(c, pb, { t: T + n[0], dur: n[2], a: 0.35, d: 0.4, s: 0.75, r: 1.6, f: mtof(n[1]), type: 'triangle', det: [-4, 4], lp: 2400, vib: { rate: 5, depth: 3, delay: 1.2 }, vol: 0.08 });
  }); });
  return E;
}
function buildB(c, pb, T){            // Black metal atmosférico: bosque helado
  var E = [];
  var riffs = { 1: [62, 65, 69, 70, 69, 65, 62, 60], 2: [58, 62, 65, 67, 65, 62, 58, 57], 3: [57, 60, 64, 65, 64, 60, 57, 55] };
  var order = [1, 1, 2, 2, 3, 3, 1, 2, 1, 1, 3, 3, 2, 2, 3, 1];
  order.forEach(function(r, b){
    riffs[r].forEach(function(m, i){
      var t0 = T + b * 4 + i * 0.5;
      ev(E, t0, function(){ trem(c, pb, t0, 0.5, m, 0.05); });
    });
  });
  ev(E, T, function(){ V(c, pb, { t: T, dur: 61, a: 4, d: 1, s: 1, r: 3, f: mtof(38), type: 'sawtooth', det: [-5, 5], lp: 240, vol: 0.09 }); });
  var choir = [[50, 57, 62], [46, 53, 58], [48, 55, 60], [45, 52, 57]];
  choir.forEach(function(ch, k){
    var t0 = T + k * 16;
    ev(E, t0, function(){ ch.forEach(function(m){ V(c, pb, { t: t0, dur: 14.5, a: 4, d: 1, s: 0.9, r: 4, f: mtof(m), type: 'triangle', det: [-6, 6], lp: 1800, vib: { rate: 4.6, depth: 4, delay: 2 }, vol: 0.05 }); }); });
  });
  return E;
}
function buildC(c, pb, T){            // Post-rock: amanecer
  var E = [], beat = 60 / 76, s8 = beat / 2;
  var chords = [[59, 64, 67, 71], [60, 64, 67, 72], [59, 62, 67, 71], [57, 62, 66, 69]];
  var roots = [40, 36, 43, 38], pat = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 1, 3, 2];
  var cyc = 16 * s8 * 4;
  for (var cy = 0; cy < 3; cy++) for (var k = 0; k < 4; k++) (function(cy, k){
    var ch = chords[k], t0 = T + cy * cyc + k * 16 * s8, lvl = [0.6, 0.85, 1][cy];
    pat.forEach(function(ix, i){
      var tt = t0 + i * s8;
      ev(E, tt, function(){
        V(c, pb, { t: tt, dur: 0.4, a: 0.004, d: 0.45, s: 0.0001, r: 0.15, f: mtof(ch[ix]), type: 'triangle', lp: 3200, vol: 0.1 * lvl });
        V(c, pb, { t: tt, dur: 0.3, a: 0.004, d: 0.3, s: 0.0001, r: 0.1, f: mtof(ch[ix] + 12), type: 'sine', vol: 0.03 * lvl });
      });
    });
    if (cy >= 1) ev(E, t0, function(){
      V(c, pb, { t: t0, dur: 16 * s8 - 0.3, a: 0.01, d: 0.8, s: 0.55, r: 0.6, f: mtof(roots[k]), type: 'sine', vol: 0.16 });
      ch.slice(0, 3).forEach(function(m){ V(c, pb, { t: t0, dur: 16 * s8, a: 2.2, d: 1, s: 0.9, r: 2.2, f: mtof(m - 12), type: 'sawtooth', det: [-8, 8], lp: 1100, vol: 0.022 * (cy === 2 ? 1.3 : 1) }); });
    });
    if (cy === 2) ev(E, t0, function(){
      V(c, pb, { t: t0 + 0.5, dur: 16 * s8 - 1.2, a: 0.5, d: 0.5, s: 0.8, r: 2, f: mtof([83, 79, 83, 81][k]), type: 'sine', det: [-3, 3], vib: { rate: 5.2, depth: 4, delay: 1 }, vol: 0.07 });
    });
  })(cy, k);
  return E;
}
function buildD(c, pb, T){            // Drone: notas largas
  var E = [];
  function seq(notes, step, off, o){ notes.forEach(function(m, i){ var t0 = T + off + i * step; ev(E, t0, function(){ V(c, pb, Object.assign({ t: t0, f: mtof(m) }, o)); }); }); }
  seq([38, 36, 41, 38, 38], 16, 0, { dur: 17, a: 6, d: 1, s: 1, r: 7, type: 'sine', vol: 0.12 });
  seq([57, 55, 60, 57], 20, 6, { dur: 17, a: 5, d: 1, s: 1, r: 7, type: 'triangle', lp: 700, vol: 0.06, vib: { rate: 0.3, depth: 1.5, delay: 3 } });
  seq([62, 60, 65, 62], 20, 12, { dur: 17, a: 5, d: 1, s: 1, r: 7, type: 'sawtooth', det: [-7, 7], lp: 520, vol: 0.026 });
  seq([74, 72, 77, 76, 74, 72], 13, 3, { dur: 11, a: 4.5, d: 1, s: 1, r: 6, type: 'sine', det: [-3, 3], vol: 0.03 });
  [[5, 86], [14, 81], [29, 84], [38, 79], [52, 86], [61, 88], [70, 81]].forEach(function(b){
    var t0 = T + b[0]; ev(E, t0, function(){ bell(c, pb, t0, mtof(b[1]), 0.06, 6); });
  });
  return E;
}
function buildE(c, pb, T){            // Arpa y flauta: medieval
  var E = [], beat = 60 / 66, s8 = beat / 2;
  var chords = [[50, 57, 62, 65, 69, 65, 62, 57], [48, 55, 60, 64, 67, 64, 60, 55], [46, 53, 58, 62, 65, 62, 58, 53], [48, 55, 60, 64, 67, 64, 60, 55],
                [50, 57, 62, 65, 69, 65, 62, 57], [48, 55, 60, 64, 67, 64, 60, 55], [45, 52, 57, 60, 64, 60, 57, 52], [50, 57, 62, 65, 69, 65, 62, 57]];
  var n = 16;
  for (var k = 0; k < n; k++) (function(k){
    var ch = chords[k % 8], t0 = T + k * 8 * s8;
    ch.forEach(function(m, i){
      var tt = t0 + i * s8;
      ev(E, tt, function(){
        V(c, pb, { t: tt, dur: 0.5, a: 0.004, d: 1.5, s: 0.0001, r: 0.2, f: mtof(m), type: 'triangle', lp: 4200, vol: 0.12 });
        V(c, pb, { t: tt, dur: 0.3, a: 0.003, d: 0.7, s: 0.0001, r: 0.1, f: mtof(m + 12), type: 'sine', vol: 0.035 });
      });
    });
    if (k % 2 === 0) ev(E, t0, function(){
      ch.slice(0, 3).forEach(function(m){ V(c, pb, { t: t0, dur: 16 * s8 - 1, a: 3, d: 1, s: 0.9, r: 3, f: mtof(m), type: 'sawtooth', det: [-7, 7], lp: 800, vol: 0.017 }); });
    });
  })(k);
  var cyc = 64 * s8;
  [[74, 0, 3.4], [76, 3.6, 3.4], [77, 7.4, 3.4], [76, 11, 3.2], [74, 14.6, 3.6], [72, 18.4, 3.4], [74, 22, 3.4], [69, 25.6, 3.6]].forEach(function(nn){
    var t0 = T + cyc / 2 + nn[1] * 1.0; ev(E, t0, function(){
      V(c, pb, { t: t0, dur: nn[2], a: 0.18, d: 0.3, s: 0.8, r: 1.1, f: mtof(nn[0]), type: 'sine', det: [-3, 3], vib: { rate: 5, depth: 3, delay: 0.8 }, vol: 0.06 });
    });
  });
  return E;
}

/* ---------- batería y guitarra (piezas F, G y H) ---------- */
function noiseBuf(c){ if (!c._mnb){ var n = c.sampleRate * 2, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; c._mnb = b; } return c._mnb; }
function noiseHit(c, out, t, o){
  var src = c.createBufferSource(); src.buffer = noiseBuf(c);
  var f = c.createBiquadFilter(); f.type = o.type; f.frequency.value = o.f; f.Q.value = o.q || 0.8;
  var g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
  src.connect(f); f.connect(g); g.connect(out); src.start(t, Math.random()); src.stop(t + o.d + 0.1);
}
function kick(c, out, t, vol){
  var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.35);
}
function snare(c, out, t, vol){
  noiseHit(c, out, t, { type: 'bandpass', f: 1900, q: 0.7, vol: vol, d: 0.22 });
  var o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(210, t); o.frequency.exponentialRampToValueAtTime(130, t + 0.1);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * 0.6, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.2);
}
function hat(c, out, t, vol){ noiseHit(c, out, t, { type: 'highpass', f: 7500, vol: vol, d: 0.05 }); }
function crash(c, out, t, vol){ noiseHit(c, out, t, { type: 'highpass', f: 4200, vol: vol, d: 2.6, q: 0.5 }); }
function tom(c, out, t, vol, f0){
  var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.6, t + 0.25);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.5);
}
// guitarra con distorsión: acorde de potencia (fundamental, quinta y octava) sostenido, sin trémolo
function power(c, out, t, dur, midi, vol, k, lp, o){
  o = o || {};
  var mix = c.createGain(), sh = c.createWaveShaper(); sh.curve = distCurve(k);
  var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 110;
  var lpf = c.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = lp; lpf.Q.value = 0.8;
  var g = c.createGain(), a = o.a || 0.04, r = o.r || 1.4;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(vol * (o.s || 0.7), t + Math.min(dur, 1.2)); g.gain.setValueAtTime(vol * (o.s || 0.7), t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + r);
  mix.connect(sh); sh.connect(hp); hp.connect(lpf); lpf.connect(g); g.connect(out);
  var end = t + dur + r + 0.1;
  [[0, -9, 1], [0, 9, 1], [7, -5, 0.8], [7, 6, 0.8], [12, 0, 0.55]].forEach(function(x){
    var os = c.createOscillator(), og = c.createGain(); os.type = 'sawtooth'; os.frequency.value = mtof(midi + x[0]); os.detune.value = x[1]; og.gain.value = x[2] * 0.3;
    os.connect(og); og.connect(mix); os.start(t); os.stop(end);
  });
}
function bassN(c, out, t, dur, m, vol){
  V(c, out, { t: t, dur: dur, a: 0.01, d: 0.15, s: 0.7, r: 0.12, f: mtof(m), type: 'sawtooth', det: [-7, 7], lp: 520, vol: vol });
  V(c, out, { t: t, dur: dur, a: 0.01, d: 0.1, s: 0.8, r: 0.12, f: mtof(m), type: 'sine', vol: vol * 1.1 });
}
function lead(c, out, t, dur, m, vol, lpf){
  V(c, out, { t: t, dur: dur, a: 0.25, d: 0.4, s: 0.75, r: 1.4, f: mtof(m), type: 'triangle', det: [-5, 5], lp: lpf || 2600, vib: { rate: 5, depth: 4, delay: 1 }, vol: vol });
}

/* ---------- F · Catedral: gothic rock + dungeon synth (menú) ---------- */
function buildF(c, pb, T){
  var E = [], beat = 60 / 100, cyc = 16 * beat, N = 7;
  var ch = [{ b: 40, ar: [52, 55, 59, 64] }, { b: 36, ar: [52, 55, 60, 64] }, { b: 33, ar: [57, 60, 64, 69] }, { b: 35, ar: [59, 63, 66, 71] }];
  var mel = [[0, 76, 2], [2, 79, 1], [3, 78, 1], [4, 72, 3], [7, 76, 1], [8, 69, 3], [11, 72, 1], [12, 71, 2], [14, 68, 2]];
  for (var cy = 0; cy < N; cy++) for (var k = 0; k < 4; k++) (function(cy, k){
    var o = ch[k], t0 = T + cy * cyc + k * 4 * beat, dr = cy >= 1, gt = cy >= 2;
    // bajo a corcheas, el motor del género
    for (var i = 0; i < 8; i++) (function(i){ var tt = t0 + i * beat / 2; ev(E, tt, function(){ bassN(c, pb, tt, beat * 0.45, o.b + (i % 4 === 3 ? 12 : 0), 0.13); }); })(i);
    // guitarra limpia con chorus: arpegio de corcheas
    for (var j = 0; j < 8; j++) (function(j){ var tt = t0 + j * beat / 2, m = o.ar[[0, 1, 2, 3, 2, 1, 2, 3][j]];
      ev(E, tt, function(){ V(c, pb, { t: tt, dur: 0.3, a: 0.005, d: 0.5, s: 0.0001, r: 0.15, f: mtof(m + 12), type: 'triangle', det: [-9, 9], lp: 3600, vol: gt ? 0.075 : 0.05 }); }); })(j);
    // guitarra rítmica con distorsión suave a partir de la tercera vuelta
    if (gt) ev(E, t0, function(){ power(c, pb, t0, 4 * beat - 0.05, o.b + 12, 0.1, 3, 1800, { s: 0.8, r: 0.4 }); });
    // batería de caja de ritmos: bombo, caja con eco y charles
    if (dr) { [0, 2, 2.5].forEach(function(b){ var tt = t0 + b * beat; ev(E, tt, function(){ kick(c, pb, tt, 0.34); }); });
      [1, 3].forEach(function(b){ var tt = t0 + b * beat; ev(E, tt, function(){ snare(c, pb, tt, 0.17); }); });
      for (var h = 0; h < 8; h++) (function(h){ var tt = t0 + h * beat / 2; ev(E, tt, function(){ hat(c, pb, tt, h % 2 ? 0.035 : 0.055); }); })(h); }
    // cuerdas de Dungeon Synth y coro grave
    if (k === 0 || k === 2) ev(E, t0, function(){ o.ar.slice(0, 3).forEach(function(m){ V(c, pb, { t: t0, dur: 8 * beat, a: 2.2, d: 1, s: 0.9, r: 2, f: mtof(m - 12), type: 'sawtooth', det: [-8, 8], lp: 820, vol: 0.026 }); }); });
  })(cy, k);
  // melodía de flauta de sintetizador, y una segunda voz grave tipo barítono
  for (var cy2 = 1; cy2 < N; cy2++) mel.forEach(function(n){
    var tt = T + cy2 * cyc + n[0] * beat, mm = n[1] + (cy2 % 3 === 2 ? 12 : 0);
    ev(E, tt, function(){ lead(c, pb, tt, n[2] * beat, mm, 0.06, 2800); if (cy2 % 2 === 0) lead(c, pb, tt, n[2] * beat, n[1] - 24, 0.05, 900); });
  });
  ev(E, T + cyc * (N - 1) + 15 * beat, function(){ crash(c, pb, T + cyc * (N - 1) + 15 * beat, 0.05); });
  return E;
}

/* ---------- G · Alba: post-rock con dungeon synth (final bueno) ---------- */
function buildG(c, pb, T){
  var E = [], beat = 60 / 72, s8 = beat / 2, cyc = 16 * beat, N = 5;
  var ch = [{ b: 35, ar: [59, 62, 66, 71] }, { b: 31, ar: [55, 59, 62, 67] }, { b: 38, ar: [54, 57, 62, 66] }, { b: 33, ar: [57, 61, 64, 69] }];
  var pat = [0, 1, 2, 3, 2, 1, 3, 2];
  var lead2 = [[83, 0, 3], [81, 3, 1], [78, 4, 4], [79, 8, 3], [78, 11, 1], [74, 12, 4]];
  for (var cy = 0; cy < N; cy++) for (var k = 0; k < 4; k++) (function(cy, k){
    var o = ch[k], t0 = T + cy * cyc + k * 4 * beat, lvl = [0.55, 0.75, 0.9, 1, 1][cy];
    // arpegio de guitarra limpia con eco, siempre presente y cada vez más abierto
    for (var i = 0; i < 8; i++) (function(i){ var tt = t0 + i * s8, m = o.ar[pat[i]] + (cy >= 3 && i % 4 === 3 ? 12 : 0);
      ev(E, tt, function(){
        V(c, pb, { t: tt, dur: 0.4, a: 0.004, d: 0.55, s: 0.0001, r: 0.15, f: mtof(m), type: 'triangle', lp: 3400, vol: 0.095 * lvl });
        V(c, pb, { t: tt, dur: 0.3, a: 0.004, d: 0.3, s: 0.0001, r: 0.1, f: mtof(m + 12), type: 'sine', vol: 0.03 * lvl });
      }); })(i);
    // capa de Dungeon Synth: cuerdas anchas y coro lento
    ev(E, t0, function(){
      o.ar.slice(0, 3).forEach(function(m, q){ V(c, pb, { t: t0, dur: 4 * beat, a: 2.4, d: 1, s: 0.9, r: 2.4, f: mtof(m - 12), type: 'sawtooth', det: [-8, 8], lp: 950, vol: 0.022 * (cy + 1) / 3 }); });
      if (cy >= 1) V(c, pb, { t: t0, dur: 4 * beat, a: 1.4, d: 1, s: 0.9, r: 2, f: mtof(o.ar[2]), type: 'triangle', det: [-4, 4], lp: 1600, vib: { rate: 4.8, depth: 4, delay: 1.5 }, vol: 0.03 });
    });
    if (cy >= 1) ev(E, t0, function(){ V(c, pb, { t: t0, dur: 4 * beat - 0.3, a: 0.01, d: 0.8, s: 0.55, r: 0.6, f: mtof(o.b), type: 'sine', vol: 0.15 }); });
    // batería: toms y platillo al crecer, caja suave al final
    if (cy >= 2) { [0, 2].forEach(function(b){ var tt = t0 + b * beat; ev(E, tt, function(){ kick(c, pb, tt, 0.26); }); });
      if (cy >= 3) [1, 3].forEach(function(b){ var tt = t0 + b * beat; ev(E, tt, function(){ snare(c, pb, tt, 0.1); }); });
      if (k === 0) ev(E, t0, function(){ crash(c, pb, t0, 0.04); }); }
    else if (cy === 1 && k === 3) [2, 2.5, 3, 3.5].forEach(function(b, q){ var tt = t0 + b * beat; ev(E, tt, function(){ tom(c, pb, tt, 0.16, 150 - q * 14); }); });
  })(cy, k);
  // melodía de flauta de sintetizador que entra en las dos últimas vueltas
  for (var cy2 = 3; cy2 < N; cy2++) lead2.forEach(function(n){ var tt = T + cy2 * cyc + n[1] * beat;
    ev(E, tt, function(){ V(c, pb, { t: tt, dur: n[2] * beat, a: 0.4, d: 0.4, s: 0.8, r: 2, f: mtof(n[0]), type: 'sine', det: [-3, 3], vib: { rate: 5.2, depth: 4, delay: 1 }, vol: 0.075 }); }); });
  [[1, 86], [6, 90], [11, 83]].forEach(function(b){ var tt = T + (N - 1) * cyc + b[0] * beat * 1.3; ev(E, tt, function(){ bell(c, pb, tt, mtof(b[1]), 0.05, 5); }); });
  return E;
}

/* ---------- H · Hielo: atmospheric black metal sin trémolo (final malo) ---------- */
function buildH(c, pb, T){
  var E = [], beat = 60 / 76, bar = 4 * beat, N = 20;
  var prog = [{ r: 50, ar: [62, 65, 69] }, { r: 46, ar: [58, 62, 65] }, { r: 43, ar: [55, 58, 62] }, { r: 45, ar: [57, 61, 64] }];
  for (var b = 0; b < N; b++) (function(b){
    var o = prog[b % 4], t0 = T + b * bar, sec = Math.floor(b / 4);
    // guitarra distorsionada: acordes largos que respiran, golpeados solo al empezar el compás y a mitad
    ev(E, t0, function(){ power(c, pb, t0, 2 * beat - 0.05, o.r, 0.11, 9, 2400, { s: 0.75, r: 0.5 }); power(c, pb, t0 + 2 * beat, 2 * beat - 0.05, o.r + (b % 4 === 3 ? 2 : 0), 0.11, 9, 2400, { s: 0.75, r: 1.4 }); });
    // sub-bajo y teclado de coro helado
    ev(E, t0, function(){ V(c, pb, { t: t0, dur: bar, a: 0.6, d: 1, s: 0.9, r: 1.5, f: mtof(o.r - 12), type: 'sine', vol: 0.15 });
      o.ar.forEach(function(m){ V(c, pb, { t: t0, dur: bar, a: 2.2, d: 1, s: 0.9, r: 2.4, f: mtof(m), type: 'triangle', det: [-6, 6], lp: 1700, vib: { rate: 4.6, depth: 4, delay: 1.5 }, vol: 0.04 }); }); });
    // batería lenta en tiempo medio: bombo y caja con mucho eco; platillo cada cuatro compases
    if (sec >= 1) { [0, 2.5].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ kick(c, pb, tt, 0.3); }); });
      var ts = t0 + 2 * beat; ev(E, ts, function(){ snare(c, pb, ts, 0.2); });
      if (sec >= 2 && b % 2 === 1) [3, 3.25, 3.5, 3.75].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ kick(c, pb, tt, 0.22); }); }); }
    if (b % 4 === 0 && sec >= 1) ev(E, t0, function(){ crash(c, pb, t0, 0.06); });
  })(b);
  // guitarra solista: notas largas y frías, con vibrato, sin trémolo
  var solo = [[8, 74, 7], [16, 72, 5], [22, 70, 6], [30, 69, 7], [40, 77, 7], [48, 76, 5], [54, 74, 6], [62, 73, 9], [72, 81, 5], [77, 79, 6]];
  solo.forEach(function(n){ var tt = T + n[0] * beat; ev(E, tt, function(){ power(c, pb, tt, n[2] * beat * 0.8, n[1] - 12, 0.05, 4, 3200, { a: 0.3, s: 0.85, r: 1.8 }); }); });
  [[19, 93], [43, 88], [67, 91]].forEach(function(b){ var tt = T + b[0] * beat; ev(E, tt, function(){ bell(c, pb, tt, mtof(b[1]), 0.04, 6); }); });
  return E;
}

/* ---------- I · Catedral en calma: menú ambiental (inicio de cada bucle) ---------- */
function buildI(c, pb, T){
  var E = [], beat = 60 / 100, cyc = 16 * beat, N = 6;
  var ch = [{ b: 40, ar: [52, 55, 59, 64] }, { b: 36, ar: [52, 55, 60, 64] }, { b: 33, ar: [57, 60, 64, 69] }, { b: 35, ar: [59, 63, 66, 71] }];
  for (var cy = 0; cy < N; cy++) for (var k = 0; k < 4; k++) (function(cy, k){
    var o = ch[k], t0 = T + cy * cyc + k * 4 * beat;
    ev(E, t0, function(){
      o.ar.slice(0, 3).forEach(function(m){ V(c, pb, { t: t0, dur: 4 * beat, a: 2.6, d: 1, s: 0.9, r: 2.8, f: mtof(m - 12), type: 'sawtooth', det: [-8, 8], lp: 780, vol: 0.034 }); });
      V(c, pb, { t: t0, dur: 4 * beat, a: 1.8, d: 1, s: 0.9, r: 2.5, f: mtof(o.b), type: 'sine', vol: 0.15 });
      V(c, pb, { t: t0, dur: 4 * beat, a: 2.2, d: 1, s: 0.9, r: 2.5, f: mtof(o.ar[2]), type: 'triangle', det: [-4, 4], lp: 1500, vib: { rate: 4.6, depth: 3, delay: 1.8 }, vol: 0.022 });
    });
    [0, 2.5, 5, 7.5].forEach(function(x, q){ var tt = t0 + x * beat, m = o.ar[[0, 2, 3, 1][q]] + 12;
      ev(E, tt, function(){ V(c, pb, { t: tt, dur: 0.4, a: 0.006, d: 0.9, s: 0.0001, r: 0.2, f: mtof(m), type: 'triangle', det: [-7, 7], lp: 3000, vol: 0.05 }); }); });
    if (k === 1 && cy % 2 === 1) { var tb = t0 + 1.5 * beat; ev(E, tb, function(){ bell(c, pb, tb, mtof(o.ar[3] + 12), 0.04, 6); }); }
  })(cy, k);
  [[8, 76, 6], [20, 72, 6], [32, 69, 6], [44, 71, 5]].forEach(function(n){ for (var cy2 = 1; cy2 < N; cy2 += 2) { var tt = T + cy2 * cyc + (n[0] % 16) * beat; if (n[0] >= 16 && cy2 % 2 === 0) continue;
    ev(E, tt, function(){ lead(c, pb, tt, n[2] * beat, n[1], 0.045, 2200); }); } });
  return E;
}

/* ---------- J · Taller del Duende: música de tienda juguetona ---------- */
function buildJ(c, pb, T){
  var E = [], beat = 0.5, bar = 4 * beat, cyc = 8 * bar, N = 4;
  var roots = [36, 33, 29, 31, 36, 33, 29, 31], tri = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62], [60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
  var mel = [[0, 72, .5], [.5, 76, .5], [1, 79, 1], [2, 76, .5], [2.5, 79, .5], [3, 84, 1], [4, 81, .5], [4.5, 79, .5], [5, 76, 1], [6, 72, .5], [6.5, 76, .5], [7, 81, 1],
             [8, 77, .5], [8.5, 81, .5], [9, 84, 1], [10, 81, .5], [10.5, 77, .5], [11, 72, 1], [12, 74, .5], [12.5, 77, .5], [13, 79, 1], [14, 77, .5], [14.5, 74, .5], [15, 71, 1],
             [16, 72, .5], [16.5, 76, .5], [17, 79, .5], [17.5, 84, .5], [18, 83, 1], [19, 79, 1], [20, 81, .5], [20.5, 84, .5], [21, 81, 1], [22, 76, 1], [23, 72, 1],
             [24, 77, 1], [25, 79, .5], [25.5, 81, .5], [26, 84, 1], [27, 81, 1], [28, 83, .5], [28.5, 81, .5], [29, 79, .5], [29.5, 77, .5], [30, 79, 1]];
  for (var cy = 0; cy < N; cy++) for (var b = 0; b < 8; b++) (function(cy, b){
    var t0 = T + cy * cyc + b * bar, r = roots[b], tr = tri[b];
    // bajo pizzicato saltarín
    [[0, r], [1, r + 7], [2, r + 12], [3, r + 7]].forEach(function(x){ var tt = t0 + x[0] * beat; ev(E, tt, function(){ V(c, pb, { t: tt, dur: 0.18, a: 0.004, d: 0.2, s: 0.0001, r: 0.05, f: mtof(x[1]), type: 'triangle', lp: 700, vol: 0.2 }); }); });
    // acordes a contratiempo, como una marimba
    [1.5, 3.5].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ tr.forEach(function(m){ V(c, pb, { t: tt, dur: 0.12, a: 0.004, d: 0.3, s: 0.0001, r: 0.08, f: mtof(m + 12), type: 'sine', vol: 0.04 }); V(c, pb, { t: tt, dur: 0.1, a: 0.003, d: 0.12, s: 0.0001, r: 0.05, f: mtof(m + 24), type: 'triangle', vol: 0.016 }); }); }); });
    // percusión menuda: bloque de madera, charles y bombo suave
    [0, 2].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ kick(c, pb, tt, 0.18); }); });
    [1, 3].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ V(c, pb, { t: tt, dur: 0.03, a: 0.002, d: 0.06, s: 0.0001, r: 0.02, f: 980, type: 'square', lp: 2200, vol: 0.05 }); }); });
    for (var h = 0; h < 8; h++) (function(h){ var tt = t0 + h * beat / 2; ev(E, tt, function(){ hat(c, pb, tt, h % 2 ? 0.02 : 0.03); }); })(h);
  })(cy, b);
  // melodía principal tipo xilófono; la segunda vuelta la dobla una octava arriba y la tercera lleva contramelodía
  for (var cy2 = 0; cy2 < N; cy2++) mel.forEach(function(n){
    var tt = T + cy2 * cyc + n[0] * beat;
    ev(E, tt, function(){
      V(c, pb, { t: tt, dur: n[2] * beat * 0.8, a: 0.004, d: 0.35, s: 0.0001, r: 0.1, f: mtof(n[1] + (cy2 % 2 ? 12 : 0)), type: 'triangle', lp: 4800, vol: 0.1 });
      V(c, pb, { t: tt, dur: n[2] * beat * 0.5, a: 0.003, d: 0.2, s: 0.0001, r: 0.06, f: mtof(n[1] + (cy2 % 2 ? 24 : 12)), type: 'sine', vol: 0.035 });
      if (cy2 >= 2) V(c, pb, { t: tt, dur: n[2] * beat, a: 0.01, d: 0.3, s: 0.0001, r: 0.08, f: mtof(n[1] - 12), type: 'square', lp: 1400, vol: 0.022 });
    });
  });
  [[7, 91], [15, 88], [23, 93], [31, 86]].forEach(function(b){ for (var cy3 = 0; cy3 < N; cy3 += 2) { var tt = T + cy3 * cyc + b[0] * beat * 2 + 0.01; ev(E, tt, function(){ bell(c, pb, tt, mtof(b[1]), 0.03, 2.5); }); } });
  return E;
}

/* ---------- K · Cerrojo: música movida para los 6 puzles finales ---------- */
function buildK(c, pb, T){
  var E = [], beat = 60 / 148, bar = 4 * beat, cyc = 4 * bar, N = 10;
  var ch = [{ r: 38, ar: [62, 65, 69, 74] }, { r: 34, ar: [58, 62, 65, 70] }, { r: 36, ar: [60, 64, 67, 72] }, { r: 33, ar: [57, 61, 64, 69] }];
  var mel = [[0, 74, 1], [1, 77, 1], [2, 81, 1.5], [3.5, 79, .5], [4, 77, 2], [6, 74, 2], [8, 72, 1], [9, 76, 1], [10, 79, 2], [12, 81, 1], [13, 80, 1], [14, 81, 2]];
  for (var cy = 0; cy < N; cy++) for (var k = 0; k < 4; k++) (function(cy, k){
    var o = ch[k], t0 = T + cy * cyc + k * bar, hard = cy >= 2;
    // bajo a corcheas con empuje
    for (var i = 0; i < 8; i++) (function(i){ var tt = t0 + i * beat / 2; ev(E, tt, function(){ bassN(c, pb, tt, beat * 0.42, o.r + (i === 7 ? 12 : 0), 0.14); }); })(i);
    // arpegio de sintetizador a semicorcheas con eco
    for (var j = 0; j < 16; j++) (function(j){ var tt = t0 + j * beat / 4, m = o.ar[[0, 1, 2, 3, 2, 1, 3, 2, 0, 1, 2, 3, 2, 1, 2, 3][j]];
      ev(E, tt, function(){ V(c, pb, { t: tt, dur: 0.1, a: 0.003, d: 0.2, s: 0.0001, r: 0.05, f: mtof(m + (cy >= 4 ? 12 : 0)), type: 'sawtooth', lp: 2600, vol: cy >= 1 ? 0.04 : 0.028 }); }); })(j);
    // guitarra en acordes cortos con distorsión (sin trémolo): golpes a corcheas con acentos
    if (hard) [0, 1.5, 2, 3.5].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ power(c, pb, tt, beat * 0.35, o.r + 12, 0.1, 7, 2300, { a: 0.01, s: 0.8, r: 0.2 }); }); });
    // batería a doble tempo
    [0, 1.5, 2, 3.5].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ kick(c, pb, tt, 0.3); }); });
    [1, 3].forEach(function(x){ var tt = t0 + x * beat; ev(E, tt, function(){ snare(c, pb, tt, 0.17); }); });
    for (var h = 0; h < 8; h++) (function(h){ var tt = t0 + h * beat / 2; ev(E, tt, function(){ hat(c, pb, tt, h % 2 ? 0.03 : 0.05); }); })(h);
    if (k === 0) ev(E, t0, function(){ crash(c, pb, t0, 0.05); V(c, pb, { t: t0, dur: 4 * bar, a: 1.5, d: 1, s: 0.9, r: 2, f: mtof(o.r + 12), type: 'sawtooth', det: [-8, 8], lp: 900, vol: 0.026 }); });
  })(cy, k);
  for (var cy2 = 1; cy2 < N; cy2++) mel.forEach(function(n){ var tt = T + cy2 * cyc + n[0] * beat, m = n[1] + (cy2 >= 5 ? 12 : 0);
    ev(E, tt, function(){ lead(c, pb, tt, n[2] * beat, m, 0.06, 3000); }); });
  return E;
}

function buildIslow(c, pb, T){
  var E = [], beat = 60 / 68, cyc = 16 * beat, N = 6;
  var ch = [{ b: 40, ar: [52, 55, 59, 64] }, { b: 36, ar: [52, 55, 60, 64] }, { b: 33, ar: [57, 60, 64, 69] }, { b: 35, ar: [59, 63, 66, 71] }];
  for (var cy = 0; cy < N; cy++) for (var k = 0; k < 4; k++) (function(cy, k){
    var o = ch[k], t0 = T + cy * cyc + k * 4 * beat;
    ev(E, t0, function(){
      o.ar.slice(0, 3).forEach(function(m){ V(c, pb, { t: t0, dur: 4 * beat, a: 2.6, d: 1, s: 0.9, r: 2.8, f: mtof(m - 12), type: 'sawtooth', det: [-8, 8], lp: 780, vol: 0.034 }); });
      V(c, pb, { t: t0, dur: 4 * beat, a: 1.8, d: 1, s: 0.9, r: 2.5, f: mtof(o.b), type: 'sine', vol: 0.15 });
      V(c, pb, { t: t0, dur: 4 * beat, a: 2.2, d: 1, s: 0.9, r: 2.5, f: mtof(o.ar[2]), type: 'triangle', det: [-4, 4], lp: 1500, vib: { rate: 4.6, depth: 3, delay: 1.8 }, vol: 0.022 });
    });
    [0, 2.5, 5, 7.5].forEach(function(x, q){ var tt = t0 + x * beat, m = o.ar[[0, 2, 3, 1][q]] + 12;
      ev(E, tt, function(){ V(c, pb, { t: tt, dur: 0.4, a: 0.006, d: 0.9, s: 0.0001, r: 0.2, f: mtof(m), type: 'triangle', det: [-7, 7], lp: 3000, vol: 0.05 }); }); });
    if (k === 1 && cy % 2 === 1) { var tb = t0 + 1.5 * beat; ev(E, tb, function(){ bell(c, pb, tb, mtof(o.ar[3] + 12), 0.04, 6); }); }
  })(cy, k);
  [[8, 76, 6], [20, 72, 6], [32, 69, 6], [44, 71, 5]].forEach(function(n){ for (var cy2 = 1; cy2 < N; cy2 += 2) { var tt = T + cy2 * cyc + (n[0] % 16) * beat; if (n[0] >= 16 && cy2 % 2 === 0) continue;
    ev(E, tt, function(){ lead(c, pb, tt, n[2] * beat, n[1], 0.045, 2200); }); } });
  return E;
}

/* ===== [0.51] Maldición, subida de nivel y Duende ambiental ===== */
function revBell(c, out, t, f, vol, dur){
  [1, 2.76, 5.4].forEach(function(k, i){ var os = c.createOscillator(), g = c.createGain(); os.type = 'sine'; os.frequency.value = f * k;
    var v = vol / (1 + i * 1.6); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.06);
    os.connect(g); g.connect(out); os.start(t); os.stop(t + dur + 0.1); });
}
function glideNote(c, out, t, m, dur, vol){   // nota que se hunde sola, como una cinta que se frena
  var os = c.createOscillator(), g = c.createGain(); os.type = 'sine'; os.frequency.setValueAtTime(mtof(m), t); os.frequency.exponentialRampToValueAtTime(mtof(m) * 0.9, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  os.connect(g); g.connect(out); os.start(t); os.stop(t + dur + 0.1);
}
/* La MISMA pieza I (mismas notas, mismo tono), pero a 68 ppm en vez de 100: más lenta y tendida, con el filtro más cerrado.
   En cada vuelta se sortean 6 de 8 momentos raros, repartidos por la pieza con holgura. */
function buildIcurse(c, pb, T){
  var pb2 = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 950; lp.Q.value = 0.6; pb2.connect(lp); lp.connect(pb);
  var E = buildIslow(c, pb2, T);
  var kinds = [0, 1, 2, 3, 4, 5, 6, 7].sort(function(){ return Math.random() - 0.5; }).slice(0, 6);
  kinds.forEach(function(k, i){
    var t = T + 7 + i * 13.2 + Math.random() * 4;
    if (k === 0) ev(E, t, function(){ [50, 56].forEach(function(m){ V(c, pb2, { t: t, dur: 5, a: 2.5, d: 1, s: 0.9, r: 4, f: mtof(m), type: 'sine', det: [-48, 48], vol: 0.05 }); }); });          // dos notas desafinadas
    if (k === 1) ev(E, t, function(){ revBell(c, pb2, t, mtof(74), 0.07, 3.2); });                                                                                                            // campana al revés
    if (k === 2) ev(E, t, function(){ pb2.gain.cancelScheduledValues(t); pb2.gain.setValueAtTime(1, t); pb2.gain.linearRampToValueAtTime(0.0001, t + 0.12); pb2.gain.setValueAtTime(0.0001, t + 1.8); pb2.gain.linearRampToValueAtTime(1, t + 2.8); });   // corte de silencio
    if (k === 3) ev(E, t, function(){ V(c, pb2, { t: t, dur: 1.4, a: 0.01, d: 1.2, s: 0.0001, r: 0.3, f: mtof(31), type: 'sine', vol: 0.28 }); });                                           // golpe grave
    if (k === 4) ev(E, t, function(){ V(c, pb2, { t: t, dur: 2.6, a: 0.6, d: 0.5, s: 0.7, r: 2, f: mtof(76.5), type: 'triangle', vib: { rate: 6, depth: 9, delay: 0.3 }, vol: 0.05 }); });     // flauta fuera de tono
    if (k === 5) ev(E, t, function(){ glideNote(c, pb2, t, 69, 4, 0.06); glideNote(c, pb2, t + 0.5, 76, 3.5, 0.04); });                                                                          // notas que se hunden
    if (k === 6) ev(E, t, function(){ [0, 0.16, 0.34, 0.6, 0.95].forEach(function(dt, j){ V(c, pb2, { t: t + dt, dur: 0.08, a: 0.004, d: 0.3, s: 0.0001, r: 0.1, f: mtof(72), type: 'triangle', lp: 2500, vol: 0.07 / (1 + j * 0.5) }); }); });   // tartamudeo de una nota
    if (k === 7) ev(E, t, function(){ V(c, pb2, { t: t, dur: 2, a: 1.2, d: 0.5, s: 0.8, r: 2, f: mtof(88), type: 'sine', det: [-35, 35], vib: { rate: 5, depth: 14, delay: 0.2 }, vol: 0.022 }); });   // chillido lejano
  });
  return E;
}

/* Subida de nivel: pulso rápido y alegre del mismo mundo que la Catedral (F): mismos acordes, 150 ppm, sin silencios. */
function buildL(c, pb, T){
  var E = [], beat = 60 / 150, cyc = 16 * beat, N = 4;
  var ch = [{ b: 40, ar: [52, 55, 59, 64] }, { b: 36, ar: [52, 55, 60, 64] }, { b: 33, ar: [57, 60, 64, 69] }, { b: 35, ar: [59, 63, 66, 71] }];
  var mel = [[0, 76, 1], [1, 79, .5], [1.5, 83, .5], [2, 81, 1], [3, 79, 1], [4, 76, 1], [5, 79, .5], [5.5, 84, .5], [6, 83, 1], [7, 79, 1],
             [8, 81, 1], [9, 84, .5], [9.5, 88, .5], [10, 86, 1], [11, 84, 1], [12, 83, 1], [13, 80, .5], [13.5, 83, .5], [14, 88, 2]];
  for (var cy = 0; cy < N; cy++) for (var k = 0; k < 4; k++) (function(cy, k){
    var o = ch[k], t0 = T + cy * cyc + k * 4 * beat;
    for (var i = 0; i < 8; i++) (function(i){ var tt = t0 + i * beat / 2; ev(E, tt, function(){ bassN(c, pb, tt, beat * 0.45, o.b + (i % 4 === 3 ? 12 : 0), 0.13); }); })(i);
    for (var j = 0; j < 8; j++) (function(j){ var tt = t0 + j * beat / 2, m = o.ar[[0, 1, 2, 3, 2, 1, 2, 3][j]];
      ev(E, tt, function(){ V(c, pb, { t: tt, dur: 0.25, a: 0.005, d: 0.4, s: 0.0001, r: 0.12, f: mtof(m + 12), type: 'triangle', det: [-9, 9], lp: 3800, vol: 0.075 }); }); })(j);
    ev(E, t0, function(){ power(c, pb, t0, 4 * beat - 0.05, o.b + 12, 0.09, 3, 1900, { s: 0.8, r: 0.4 }); });
    [0, 2, 2.5].forEach(function(b){ var tt = t0 + b * beat; ev(E, tt, function(){ kick(c, pb, tt, 0.3); }); });
    [1, 3].forEach(function(b){ var tt = t0 + b * beat; ev(E, tt, function(){ snare(c, pb, tt, 0.16); }); });
    for (var h = 0; h < 8; h++) (function(h){ var tt = t0 + h * beat / 2; ev(E, tt, function(){ hat(c, pb, tt, h % 2 ? 0.035 : 0.055); }); })(h);
  })(cy, k);
  for (var cy2 = 0; cy2 < N; cy2++) mel.forEach(function(n){
    var tt = T + cy2 * cyc + n[0] * beat;
    ev(E, tt, function(){ lead(c, pb, tt, n[2] * beat, n[1], 0.06, 3000); });
  });
  return E;
}
/* Duende ambiental: LAS MISMAS NOTAS y tempo que J (Taller del Duende), pero sostenidas y difusas: sin percusión ni bajo saltarín. */
function buildJ2(c, pb, T){
  var E = [], beat = 0.5, bar = 4 * beat, cyc = 8 * bar, N = 4;
  var roots = [36, 33, 29, 31, 36, 33, 29, 31], tri = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62], [60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
  var mel = [[0, 72, .5], [.5, 76, .5], [1, 79, 1], [2, 76, .5], [2.5, 79, .5], [3, 84, 1], [4, 81, .5], [4.5, 79, .5], [5, 76, 1], [6, 72, .5], [6.5, 76, .5], [7, 81, 1],
             [8, 77, .5], [8.5, 81, .5], [9, 84, 1], [10, 81, .5], [10.5, 77, .5], [11, 72, 1], [12, 74, .5], [12.5, 77, .5], [13, 79, 1], [14, 77, .5], [14.5, 74, .5], [15, 71, 1],
             [16, 72, .5], [16.5, 76, .5], [17, 79, .5], [17.5, 84, .5], [18, 83, 1], [19, 79, 1], [20, 81, .5], [20.5, 84, .5], [21, 81, 1], [22, 76, 1], [23, 72, 1],
             [24, 77, 1], [25, 79, .5], [25.5, 81, .5], [26, 84, 1], [27, 81, 1], [28, 83, .5], [28.5, 81, .5], [29, 79, .5], [29.5, 77, .5], [30, 79, 1]];
  for (var cy = 0; cy < N; cy++) for (var b = 0; b < 8; b++) (function(cy, b){
    var t0 = T + cy * cyc + b * bar;
    ev(E, t0, function(){
      tri[b].forEach(function(m){ V(c, pb, { t: t0, dur: bar, a: 0.9, d: 0.6, s: 0.8, r: 1.4, f: mtof(m), type: 'triangle', det: [-6, 6], lp: 1300, vol: 0.03 }); });
      V(c, pb, { t: t0, dur: bar, a: 0.7, d: 0.6, s: 0.9, r: 1.4, f: mtof(roots[b]), type: 'sine', vol: 0.09 });
    });
  })(cy, b);
  for (var cy2 = 0; cy2 < N; cy2++) mel.forEach(function(n){
    var tt = T + cy2 * cyc + n[0] * beat, m = n[1] + (cy2 % 2 ? 12 : 0);
    ev(E, tt, function(){
      V(c, pb, { t: tt, dur: n[2] * beat + 0.4, a: 0.06, d: 0.5, s: 0.4, r: 1.2, f: mtof(m), type: 'sine', lp: 2600, vol: 0.07 });
      V(c, pb, { t: tt, dur: n[2] * beat, a: 0.08, d: 0.4, s: 0.2, r: 0.9, f: mtof(m + 12), type: 'sine', vol: 0.015 });
    });
  });
  return E;
}

var PIECES = [
  { id: 'A', n: 'Cripta', tags: 'Dungeon synth', d: 'Cuerdas lentas de sintetizador y una flauta que baja y sube por escala menor. Es el clásico: oscuro, antiguo, solemne.', len: 64, build: buildA, rev: { sec: 5, dark: 0.35, wet: 0.5 }, lvl: 0.95 },
  { id: 'B', n: 'Bosque helado', tags: 'Black metal atmosférico', d: 'Guitarra en trémolo rápido con distorsión, sin batería, sobre un zumbido grave y un coro lejano. Es la más intensa y la más fría.', len: 64, build: buildB, rev: { sec: 6, dark: 0.3, wet: 0.55 }, lvl: 1.15 },
  { id: 'C', n: 'Amanecer', tags: 'Post-rock', d: 'Arpegio limpio con eco que crece en tres vueltas: primero solo la guitarra, luego bajo y cuerdas, y al final una melodía aguda. Es la más emotiva.', len: 76, build: buildC, rev: { sec: 4, dark: 0.45, wet: 0.45 }, delay: { time: 0.592, fb: 0.45, mix: 0.4 }, lvl: 2.4 },
  { id: 'D', n: 'Notas que respiran', tags: 'Drone / ambient', d: 'Notas muy largas que se solapan y cambian despacio, con campanas sueltas. No hay ritmo ni melodía clara: solo atmósfera, ideal para escenas de espera.', len: 80, build: buildD, rev: { sec: 7, dark: 0.3, wet: 0.75 }, lvl: 0.75 },
  { id: 'E', n: 'Arpa del bosque', tags: 'Medieval / folk oscuro', d: 'Arpegio de arpa con cuerdas suaves de fondo. En la segunda mitad entra una flauta con melodía. Es la más cálida y la más clara.', len: 58, build: buildE, rev: { sec: 3.5, dark: 0.5, wet: 0.4 }, lvl: 2.1 },
  { id: 'F', n: 'Catedral', tags: 'Menú · Gothic rock con Dungeon Synth', d: 'Bajo a corcheas, guitarra limpia con chorus, caja de ritmos y cuerdas de sintetizador. En la tercera vuelta entra una guitarra con distorsión suave y una flauta con una segunda voz grave. Es la más rítmica.', len: 67.2, build: buildF, rev: { sec: 4, dark: 0.4, wet: 0.4 }, delay: { time: 0.45, fb: 0.3, mix: 0.2 }, lvl: 0.9 },
  { id: 'G', n: 'Alba', tags: 'Final bueno · Post-rock con Dungeon Synth', d: 'Arpegio de guitarra limpia con eco que crece en cinco vueltas: se suman cuerdas, bajo, toms, caja suave y al final una flauta aguda y campanas. Es la más luminosa.', len: 66.7, build: buildG, rev: { sec: 5, dark: 0.45, wet: 0.5 }, delay: { time: 0.625, fb: 0.45, mix: 0.4 }, lvl: 1.7 },
  { id: 'H', n: 'Hielo', tags: 'Final malo · Atmospheric black metal sin trémolo', d: 'Acordes largos de guitarra con distorsión fuerte, sub-bajo, coro helado de teclado y batería en tiempo medio con mucho eco y platillos. La solista toca notas largas con vibrato. Es la más oscura y pesada.', len: 63, build: buildH, rev: { sec: 6, dark: 0.3, wet: 0.55 }, lvl: 0.95 },
  { id: 'I', n: 'Catedral en calma', tags: 'Inicio de bucle · Menú ambiental', d: 'La misma música del menú sin batería ni bajo marcado: cuerdas lentas, notas sueltas de guitarra con eco y una flauta lejana. Para los primeros cofres de cada bucle.', len: 57.6, build: buildI, rev: { sec: 5, dark: 0.4, wet: 0.5 }, delay: { time: 0.6, fb: 0.35, mix: 0.25 }, lvl: 1.55 },
  { id: 'J', n: 'Taller del Duende', tags: 'Tienda del Duende · Juguetona', d: 'Bajo saltarín, acordes a contratiempo tipo marimba, bloque de madera y una melodía pegadiza que se repite subiendo de octava. Pensada como la risa del Duende contando monedas.', len: 64, build: buildJ, rev: { sec: 2.5, dark: 0.55, wet: 0.3 }, lvl: 2.4 },
  { id: 'K', n: 'Cerrojo', tags: 'Los 6 puzles finales · Movida', d: 'Doble tempo: bajo a corcheas, arpegios rápidos de sintetizador, batería marcada y, desde la tercera vuelta, golpes cortos de guitarra con distorsión. La flauta sube una octava a mitad. Es la más tensa.', len: 65, build: buildK, rev: { sec: 3.5, dark: 0.4, wet: 0.35 }, delay: { time: 0.405, fb: 0.3, mix: 0.18 }, lvl: 0.7 }  ,
  { id: 'Imal', n: 'Catedral en calma (maldición)', tags: 'Maldición · variación de I', d: 'La misma pieza I, más lenta (68 ppm) y con el filtro cerrado. En cada vuelta se sortean 6 de 8 rarezas: notas desafinadas, campana al revés, corte de silencio, golpe grave, flauta fuera de tono, notas que se hunden, nota que tartamudea y chillido lejano.', len: 84.7, build: buildIcurse, rev: { sec: 7, dark: 0.3, wet: 0.65 }, delay: { time: 0.6, fb: 0.35, mix: 0.25 }, lvl: 1.55 },
  { id: 'L', n: 'Pulso de subida de nivel', tags: 'Subida de nivel · Gothic rock rápido', d: 'Los mismos acordes de la Catedral a 150 ppm, con bajo a corcheas, arpegio, batería y flauta de sintetizador. Suena con la fanfarria durante la ruleta y la elección de cartas.', len: 25.6, build: buildL, rev: { sec: 3, dark: 0.4, wet: 0.35 }, delay: { time: 0.4, fb: 0.3, mix: 0.18 }, lvl: 0.9 },
  { id: 'J2', n: 'Taller del Duende ambiental', tags: 'Duende fuera de la tienda · Ambiental', d: 'Las mismas notas, tempo y acordes de la música de su tienda, pero sostenidos y difusos: sin percusión ni bajo saltarín.', len: 64, build: buildJ2, rev: { sec: 5, dark: 0.45, wet: 0.65 }, delay: { time: 0.75, fb: 0.35, mix: 0.25 }, lvl: 2.6 }
];


/* ---------- reproducción dentro del juego ---------- */
const MUS = { cur: null, force: null, want: null, chain: null, lastBusy: 0, hint: null, hintUntil: 0 };
function musCfg() { return ((typeof DATOS_JUEGO !== 'undefined' && DATOS_JUEGO.SONIDO) || {}).MUSICA || {}; }
function musStopCur(fade) {
  const m = MUS.cur; if (!m) return; MUS.cur = null;
  clearInterval(m.timer);
  const c = m.c, t = c.currentTime, f = Math.max(0.05, fade == null ? 1.5 : fade);
  try { m.fx.vol.gain.cancelScheduledValues(t); m.fx.vol.gain.setValueAtTime(Math.max(0.0001, m.fx.vol.gain.value), t); m.fx.vol.gain.linearRampToValueAtTime(0.0001, t + f); } catch (e) {}
  setTimeout(() => { try { m.fx.vol.disconnect(); } catch (e) {} }, f * 1000 + 600);
}
function musStart(id) {
  const p = PIECES.find(x => x.id === id), c = audio.ctx; if (!p || !c) return;
  if (MUS.cur && MUS.cur.id === id) return;
  musStopCur(musCfg().FUNDIDO_CAMBIO != null ? musCfg().FUNDIDO_CAMBIO : 1);
  const level = (musCfg().VOLUMEN != null ? musCfg().VOLUMEN : 0.7) * ((musCfg().NIVELES || {})[id] != null ? musCfg().NIVELES[id] : 1);   // NIVELES: volumen propio de cada pieza (más bajas las de fondo y las tiendas)
  const fx = makeFx(c, p, level, audio.master || c.destination);
  // [0.51b] "Lejanía": filtro que quita agudos + menos volumen; solo se cierra cuando coinciden oscuridad y maldición
  try {
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.5; lp.frequency.value = 18000;
    const fg = c.createGain(); fg.gain.value = 1;
    fx.vol.disconnect(); fx.vol.connect(lp); lp.connect(fg); fg.connect(audio.master || c.destination);
    fx.far = { lp, fg, on: false };
  } catch (e) { fx.far = null; }
  const T0 = c.currentTime + 0.15; let passes = 0, queue = [];
  fx.vol.gain.setValueAtTime(0.0001, c.currentTime); fx.vol.gain.linearRampToValueAtTime(fx.target, c.currentTime + 1.2);
  function enqueue() {
    const T = T0 + passes * p.len, pb = c.createGain();
    pb.gain.setValueAtTime(0.0001, T); pb.gain.linearRampToValueAtTime(1, T + 1.5);
    pb.gain.setValueAtTime(1, T + p.len - 3); pb.gain.linearRampToValueAtTime(0.0001, T + p.len);
    pb.connect(fx.inp);
    queue = queue.concat(p.build(c, pb, T)).sort((a, b) => a.t - b.t);
    passes++;
  }
  const m = { id, c, fx, timer: 0 };
  function tick() {
    if (MUS.cur !== m) return;
    if (c.currentTime > T0 + passes * p.len - 12) enqueue();
    while (queue.length && queue[0].t < c.currentTime + 3) { const e = queue.shift(); if (!audio.muted) { try { e.f(); } catch (x) {} } }
  }
  MUS.cur = m; m.duckV = 1; fx.duck.gain.value = musDucked(); m.duckV = fx.duck.gain.value; enqueue(); tick(); m.timer = setInterval(tick, 250);
}
function musVisible(id) { try { return typeof modalVisible === 'function' ? modalVisible(id) : !!(document.getElementById(id) && !document.getElementById(id).classList.contains('hidden')); } catch (e) { return false; } }
// Qué pieza toca ahora según lo que hay en pantalla (null = silencio)
function musWanted() {
  if (!audio.ctx || audio.muted) return null;
  if (MUS.force) return MUS.force;
  const cover = document.getElementById('coverScreen');
  if (cover && cover.style.opacity !== '0') return 'F';
  if (musVisible('gameOverModal')) return null;
  const now = performance.now(), S = (typeof STATE !== 'undefined') ? STATE : null;
  // [0.51] Las escenas de los personajes forman una "cadena" (Trapero = A, tienda del Duende = J) que no se corta entre pantallas: solo se suelta tras 2 s sin ninguna escena en pantalla
  const busy = ['dialogueModal', 'traperoShopModal', 'merchantModal', 'duendeReceiptModal', 'lootModal', 'levelUpModal', 'unfairDealModal'].some(musVisible);   // [0.55] el recibo del Duende también cuenta como escena
  if (busy) MUS.lastBusy = now; else if (MUS.chain && now - (MUS.lastBusy || 0) > 900) MUS.chain = null;   // [0.55] antes 2000 ms: la música de la sala tardaba en volver tras la tienda del Duende
  const hint = MUS.hint && now < MUS.hintUntil ? MUS.hint : null;
  if (!hint) MUS.hint = null;
  if (musVisible('traperoShopModal') || hint === 'A') MUS.chain = 'T';
  if (musVisible('merchantModal')) MUS.chain = 'D';
  if (musVisible('levelUpModal')) return 'L';   // subida de nivel: la fanfarria y, encima, el pulso alegre (ruleta de wildcards y elección de cartas)
  if (musVisible('traperoShopModal') || hint === 'A') return 'A';
  if (musVisible('merchantModal')) return 'J';
  if (S && !S.finalPhase && musVisible('dialogueModal')) {
    const dm = document.getElementById('dialogueModal'), npc = dm && dm.dataset ? dm.dataset.npc : '';
    if (npc === 'EL TRAPERO' && MUS.chain === 'T') return 'A';
    if (npc === 'EL DUENDE') return MUS.chain === 'D' ? 'J' : 'J2';   // tras la tienda sigue J; en el resto de visitas, la versión ambiental
  }
  if (MUS.chain === 'T') return 'A';
  if (MUS.chain === 'D') return 'J';
  // [0.55] con el final armado (último cofre normal antes de los dos cofres definitivos) la sala suena como siempre; en cuanto salen los dos cofres entra la pieza del Cerrojo
  const finArmed = !!(S && S.finalPhase && S.finalPhase.stage === 'armed' && !musVisible('dialogueModal'));
  if (S && (!S.finalPhase || finArmed)) {
    const dark = (S.roomDarkUntil || 0) > (S.chestsOpened || 0), cursed = (S.cursedChestsLeft || 0) > 0 || (typeof curseHold !== 'undefined' && curseHold);
    MUS.far = dark && cursed;   // [0.51b] oscuridad + maldición: suena la maldición sorda y lejana; solo oscuridad: silencio
    if (dark && !cursed) return null;   // apagón: la música se calla
    if (cursed) return 'Imal';   // maldición: variación de I
    return 'I';   // música de fondo de toda la partida
  }
  return null;
}
// [0.38] El Simón dice es un puzle musical: mientras está en pantalla la música casi desaparece (MUSICA.BAJA_EN_SIMON, 0 = no bajar)
function musDucked() {
  const lv = musCfg().BAJA_EN_SIMON != null ? musCfg().BAJA_EN_SIMON : 0.04;
  const sq = document.getElementById('sequenceContainer');
  return (sq && !sq.classList.contains('hidden') && musVisible('minigameModal')) ? lv : 1;
}
function musDirector() {
  let w = null; try { w = musWanted(); } catch (e) {}
  const m = MUS.cur;
  if (m && m.fx.far) { try { const on = !!MUS.far && m.id === 'Imal'; if (m.fx.far.on !== on) { m.fx.far.on = on; const t = m.c.currentTime; m.fx.far.lp.frequency.setTargetAtTime(on ? 380 : 18000, t, 0.5); m.fx.far.fg.gain.setTargetAtTime(on ? 0.45 : 1, t, 0.5); } } catch (e) {} }
  if (m) { try { const d = musDucked(); if (m.duckV !== d) { m.duckV = d; m.fx.duck.gain.setTargetAtTime(d, m.c.currentTime, 0.12); } } catch (e) {} }
  if (w === (m && m.id) || (!w && !m)) return;
  if (!w) { musStopCur(musCfg().FUNDIDO_SALIDA != null ? musCfg().FUNDIDO_SALIDA : 0.8); return; }
  try { musStart(w); } catch (e) {}
}
setInterval(musDirector, 250);

// Los finales piden su pieza a la fuerza (musicForce) hasta que se libera (musicRelease)
AudioEngine.prototype.musicHint = function (id, ms) { MUS.hint = id; MUS.hintUntil = performance.now() + (ms || 5000); musDirector(); };   // [0.51] adelanta una pieza unos segundos (A al empezar la visita del Trapero)
AudioEngine.prototype.musicForce = function (id) { MUS.force = id; musDirector(); };
AudioEngine.prototype.musicRelease = function () { MUS.force = null; musDirector(); };
AudioEngine.prototype.musicDuck = function () { return MUS.cur ? MUS.cur.duckV : null; };
AudioEngine.prototype.musicFar = function () { const f = MUS.cur && MUS.cur.fx.far; return f ? { on: f.on, hz: Math.round(f.lp.frequency.value), g: +f.fg.gain.value.toFixed(2) } : null; };
AudioEngine.prototype.musicNow = function () { return MUS.cur ? MUS.cur.id : null; };
AudioEngine.prototype.musicSwell = function () {};   // [0.38] ya no existe el crescendo de la 0.37
AudioEngine.prototype.musicStop = function (fade) { MUS.force = null; musStopCur(fade); };
})();
