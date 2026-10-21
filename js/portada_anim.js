// ==========================================================================
// JUST ONE MORE CHEST — portada_anim.js — VERSIÓN 0.41
// [0.40] Animación de la portada: los rayos de luz giran alrededor del cofre, la luz recorre al Duende, le brillan los ojos con "brillo de dinero",
// destellan las monedas y titilan chispas. Se dibuja en un canvas a 2x sobre la imagen ASSETS.portada (108x192) y se alinea con background-size:cover.
// Todos los números están en PORTADA_ANIM (abajo). Si algo falla, la portada se queda como imagen fija.
// ==========================================================================

const PORTADA_ANIM = {
  ACTIVA: true,
  PERIODO_MS: 5040,        // duración de una vuelta de la animación
  FPS: 15,
  HACES: 8,                // número de haces de luz
  VUELTA_PASOS: 2,         // cuántos haces avanza el giro en una vuelta de la animación (2 de 8 = giro lento)
  SCALE: 2                 // resolución del canvas respecto a la imagen original (2 = tramado fino)
};

function coverAnimate(cover) {
  if (!PORTADA_ANIM.ACTIVA || !cover || typeof ASSETS === 'undefined' || !ASSETS.portada) return;
  const P = PORTADA_ANIM, S = P.SCALE;
  const img = new Image();
  img.onload = () => { try { coverAnimStart(cover, img, P, S); } catch (e) { /* se queda la imagen fija */ } };
  img.src = ASSETS.portada;
}

function coverAnimStart(cover, img, P, S) {
  const W = img.width, H = img.height;
  if (W !== 108 || H !== 192) return;   // la animación está medida para esta imagen
  const oc = document.createElement('canvas'); oc.width = W; oc.height = H;
  const ox = oc.getContext('2d'); ox.drawImage(img, 0, 0);
  const base = ox.getImageData(0, 0, W, H).data;
  const px = (x, y) => (y * W + x) * 4;
  const near = (i, r, g, b) => base[i] === r && base[i + 1] === g && base[i + 2] === b;

  // --- máscaras sobre la imagen original ---
  const raysM = new Uint8Array(W * H), gobM = new Uint8Array(W * H), tealM = new Uint8Array(W * H), chestM = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = px(x, y), k = y * W + x;
    const gold = near(i, 201, 152, 58) || near(i, 245, 215, 122) || near(i, 255, 246, 196) || near(i, 125, 76, 38);
    if (gold && y >= 62 && y <= 125 && !(x >= 26 && x <= 82 && y >= 117)) raysM[k] = 1;
    const lum = (base[i] + base[i + 1] + base[i + 2]) / 3;
    if (x >= 34 && x <= 75 && y >= 76 && y <= 122 && lum > 55) gobM[k] = 1;
    if (x >= 26 && x <= 82 && y >= 117 && y <= 170) chestM[k] = 1;
    if (near(i, 32, 65, 73) || near(i, 25, 49, 56) || near(i, 38, 81, 90)) tealM[k] = 1;
  }

  // --- imagen "limpia" (sin los rayos estáticos) a escala S ---
  const WW = W * S, HH = H * S, N = WW * HH;
  const clean = new Float32Array(N * 3);
  for (let Y = 0; Y < HH; Y++) for (let X = 0; X < WW; X++) {
    const x = (X / S) | 0, y = (Y / S) | 0, i = px(x, y), o = (Y * WW + X) * 3;
    if (raysM[y * W + x]) { clean[o] = 32; clean[o + 1] = 29; clean[o + 2] = 27; }
    else { clean[o] = base[i]; clean[o + 1] = base[i + 1]; clean[o + 2] = base[i + 2]; }
  }

  // --- precálculos por píxel ---
  const cx = 54.0, cy = 116.0, fg = new Uint8Array(N);
  const sky = [], skyC8 = [], skyS8 = [], skyFall = [], skyDist = [], skyThr = [];
  const gobList = [], tealList = [], tealCb = [], tealSb = [], eyeList = [], glowList = [], glowG = [];
  const bayer = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const eyesC = [[47.5, 107.5], [59.5, 107.5]];
  const eyeRect = (x, y) => y >= 106 && y < 110 && ((x >= 46 && x < 50) || (x >= 58 && x < 62));
  for (let Y = 0; Y < HH; Y++) for (let X = 0; X < WW; X++) {
    const x = (X / S) | 0, y = (Y / S) | 0, k = y * W + x, o = Y * WW + X;
    const Xn = (X + 0.5) / S, Yn = (Y + 0.5) / S;
    const isFg = gobM[k] || chestM[k]; fg[o] = isFg ? 1 : 0;
    if (!isFg && Yn < 158) {
      const ang = Math.atan2(Yn - cy, Xn - cx), dist = Math.hypot(Xn - cx, Yn - cy);
      sky.push(o); skyC8.push(Math.cos(P.HACES * ang)); skyS8.push(Math.sin(P.HACES * ang));
      skyFall.push(Math.pow(Math.max(0, Math.min(1, 1 - dist / 62)), 0.9)); skyDist.push(dist);
      // umbral de tramado en bloques de 2x2 pixeles del canvas (aspecto píxel)
      skyThr.push(bayer[(Y >> 1) & 3][(X >> 1) & 3] / 16);
    }
    if (gobM[k]) gobList.push(o);
    if (tealM[k]) { tealList.push(o); const b = Yn / 16; tealCb.push(Math.cos(b)); tealSb.push(Math.sin(b)); }
    if (eyeRect(x, y)) eyeList.push(o);
    else {
      for (const [ex, ey] of eyesC) {
        const d = Math.hypot(Xn - ex, Yn - ey);
        if (d < 7) { glowList.push(o); glowG.push(Math.pow(1 - d / 7, 2)); }
      }
    }
  }
  // monedas y chispas (posiciones fijas, azar con semilla)
  let seed = 5; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const coins = [];
  for (let x = 0; x < W; x++) for (let y = 170; y < H; y++) {
    if (near(px(x, y), 224, 169, 46) && coins.every(c => Math.abs(x - c[0]) + Math.abs(y - c[1]) > 7)) coins.push([x, y, rnd()]);
  }
  const twinkles = []; for (let n = 0; n < 14; n++) twinkles.push([14 + rnd() * 80, 66 + rnd() * 58, rnd()]);

  // --- canvas visible, alineado con background-size:cover ---
  const cv = document.createElement('canvas'); cv.width = WW; cv.height = HH;
  cv.style.cssText = 'position:absolute;left:50%;top:50%;z-index:-1;pointer-events:none;image-rendering:pixelated;transform:translate(-50%,-50%)';
  cover.insertBefore(cv, cover.firstChild);
  const ctx = cv.getContext('2d'), out = ctx.createImageData(WW, HH), d = out.data;
  const fit = () => { const r = cover.getBoundingClientRect(); if (!r.width || !r.height) return; const sc = Math.max(r.width / W, r.height / H); cv.style.width = (W * sc) + 'px'; cv.style.height = (H * sc) + 'px'; };
  fit(); window.addEventListener('resize', fit);

  const add = (o, r, g, b, a) => { const q = o * 4; d[q] += r * a; d[q + 1] += g * a; d[q + 2] += b * a; };
  const star = (sx, sy, r, col, k) => {
    const pxs = Math.round(sx * S), pys = Math.round(sy * S);
    for (let dd = -r * S; dd <= r * S; dd++) {
      const a = k * (1 - Math.abs(dd) / (r * S + 1));
      for (const [x, y] of [[pxs + dd, pys], [pxs, pys + dd]]) {
        for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) {
          const X = Math.min(x + dx, WW - 1), Y = Math.min(y + dy, HH - 1); if (X < 0 || Y < 0) continue;
          const q = (Y * WW + X) * 4;
          d[q] = d[q] * (1 - a) + col[0] * a; d[q + 1] = d[q + 1] * (1 - a) + col[1] * a; d[q + 2] = d[q + 2] * (1 - a) + col[2] * a;
        }
      }
    }
  };

  const frame = (t) => {
    // 1) imagen limpia
    for (let i = 0, o = 0; i < N; i++, o += 3) { const q = i * 4; d[q] = clean[o]; d[q + 1] = clean[o + 1]; d[q + 2] = clean[o + 2]; d[q + 3] = 255; }
    // 2) rayos giratorios
    const phi = 2 * Math.PI * t * (P.VUELTA_PASOS / P.HACES), cp = Math.cos(P.HACES * phi), sp = Math.sin(P.HACES * phi);
    const pulse = 0.85 + 0.15 * Math.sin(2 * Math.PI * t * 2), glowK = 0.18 + 0.08 * Math.sin(2 * Math.PI * t * 2);
    for (let n = 0; n < sky.length; n++) {
      const o = sky[n], q = o * 4, beam = skyC8[n] * cp + skyS8[n] * sp;
      let lit = false;
      if (beam > 0.30) {
        const inten = Math.pow(Math.min(1, (beam - 0.30) / 0.70), 1.3), fall = skyFall[n], a = inten * fall * pulse;
        if (a > skyThr[n] * 0.9) { d[q] = 215 + 40 * fall; d[q + 1] = 150 + 70 * fall; d[q + 2] = 40 + 60 * fall; lit = true; }
      }
      if (!lit) {
        const dist = skyDist[n]; if (dist < 34) { const g = Math.pow(1 - dist / 34, 2) * glowK; d[q] += g * 255; d[q + 1] += g * 190; d[q + 2] += g * 80; }
      }
    }
    // 3) la luz de los rayos recorre al Duende
    const L = 0.5 + 0.5 * Math.sin(2 * Math.PI * t * 2);
    for (const o of gobList) add(o, 22, 16, 3, L);
    // 4) haces azules inferiores
    const sa = Math.sin(2 * Math.PI * t), ca = Math.cos(2 * Math.PI * t);
    for (let n = 0; n < tealList.length; n++) { const kt = 0.5 + 0.5 * (sa * tealCb[n] - ca * tealSb[n]); add(tealList[n], 40, 80, 85, kt); }
    // 5) ojos con brillo de dinero
    const e = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t * 3) + 0.6);
    for (const o of eyeList) { const q = o * 4, k = 0.55 * e; d[q] = d[q] * (1 - k) + 255 * k; d[q + 1] = d[q + 1] * (1 - k) + 236 * k; d[q + 2] = d[q + 2] * (1 - k) + 140 * k; }
    const gk = 0.25 + 0.35 * e;
    for (let n = 0; n < glowList.length; n++) add(glowList[n], 255, 200, 60, glowG[n] * gk);
    // 6) destellos en los ojos, monedas y chispas
    for (const [t0, ex, ey] of [[0.12, 47, 107], [0.45, 60, 107], [0.80, 47, 107]]) {
      const dt = Math.abs((((t - t0 + 0.5) % 1) + 1) % 1 - 0.5);
      if (dt < 0.06) star(ex, ey, dt < 0.025 ? 7 : 4, [255, 250, 210], 1 - dt / 0.06);
    }
    for (const [x, y, ph] of coins) { const dt = Math.abs((((t - ph + 0.5) % 1) + 1) % 1 - 0.5); if (dt < 0.04) star(x, y, 3, [255, 245, 190], 1 - dt / 0.04); }
    for (const [x, y, ph] of twinkles) { const dt = Math.abs((((t * 2 - ph + 0.5) % 1) + 1) % 1 - 0.5); if (dt < 0.08) star(x, y, 2, [255, 235, 160], 1 - dt / 0.08); }
    ctx.putImageData(out, 0, 0);
  };

  let last = 0;
  const loop = (now) => {
    if (!cover.isConnected) { window.removeEventListener('resize', fit); return; }
    if (!document.hidden && now - last >= 1000 / P.FPS) { last = now; try { frame((now % P.PERIODO_MS) / P.PERIODO_MS); } catch (e) { return; } }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
