/* ============================================================================
   i18n.js — IDIOMA (español / inglés)
   - El juego está escrito en español (datos.js y el resto). La versión inglesa traduce AL MOSTRAR:
     tr(texto) busca el texto en el diccionario (js/i18n_dict.js) y un observador traduce lo que sale en pantalla.
   - Idioma: si el navegador está en cualquier variante de español -> español; si no -> inglés.
     La elección manual (menú de opciones) manda siempre y se guarda en localStorage ('jomc_lang').
   ============================================================================ */
(function () {
  'use strict';
  var G = window;

  function detect() {
    try { var s = G.localStorage.getItem('jomc_lang'); if (s === 'es' || s === 'en') return s; } catch (e) {}
    var n = String(G.navigator.language || (G.navigator.languages && G.navigator.languages[0]) || 'es').toLowerCase();
    return /^es($|[-_])/.test(n) ? 'es' : 'en';
  }
  G.LANG = detect();
  try { document.documentElement.lang = G.LANG; } catch (e) {}

  G.setLang = function (l) {
    if (l !== 'es' && l !== 'en') return;
    try { G.localStorage.setItem('jomc_lang', l); } catch (e) {}
    try { if (typeof trySaveNow === 'function') trySaveNow(); } catch (e) {}
    G.location.reload();
  };

  var DATA = G.I18N_DATA || { exact: {}, kw: {}, hack: {}, adv: {}, pw: {} };
  var EN = G.LANG === 'en';

  // ---- Diccionario ----
  var E = new Map(), CI = new Map(), TPL = [];
  var TAGRE = /\s*\{[a-z_]+\}\s*$/;
  function esc(s) { return s.replace(/[.*+?^$()|[\]\\]/g, '\\$&'); }
  if (EN) {
    Object.keys(DATA.exact).forEach(function (es) {
      var en = DATA.exact[es];
      E.set(es, en);
      if (!CI.has(es.toLowerCase())) CI.set(es.toLowerCase(), en);
      if (/\{\w+\}/.test(es)) {
        var map = {}, gi = 0;
        var src = esc(es).replace(/\{(\w+)\}/g, function (_, n) { if (map[n] == null) map[n] = gi; gi++; return '(.*?)'; });
        try { TPL.push({ re: new RegExp('^' + src + '$'), en: en, map: map, len: es.length }); } catch (e) {}
      }
    });
    TPL.sort(function (a, b) { return b.len - a.len; });
  }

  var memo = new Map();
  function core(s, depth) {
    if (depth > 4) return s;
    var raw = s;
    // varias líneas: cada línea por separado
    if (s.indexOf('\n') >= 0) {
      var parts = s.split(/(\n+)/), ch = false;
      var outp = parts.map(function (p, i) { if (i % 2) return p; var t = core(p, depth + 1); if (t !== p) ch = true; return t; });
      return ch ? outp.join('') : raw;
    }
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var lead = m[1], body = m[2], trail = m[3];
    if (!body || !/[A-Za-zÀ-ÿ]/.test(body)) return raw;
    // texto entre comillas ("frase"): se traduce lo de dentro
    var qm = body.match(/^(["“«])([\s\S]+?)(["”»])$/);
    if (qm && depth < 4) { var qi = core(qm[2], depth + 1); return qi !== qm[2] ? lead + qm[1] + qi + qm[3] + trail : raw; }
    var norm = body.replace(/\s+/g, ' ');
    var tag = '', mt = norm.match(TAGRE);
    if (mt && mt.index > 0) { tag = mt[0]; norm = norm.slice(0, mt.index); }
    var res = lookup(norm, depth);
    if (res == null) {
      // prefijo de símbolos / emojis: "⚠️ Texto", "• Texto", "> Texto"
      var pm = norm.match(/^([^A-Za-zÀ-ÿ0-9¡¿]+)([\s\S]+)$/);
      if (pm) { var r2 = lookup(pm[2], depth); if (r2 != null) res = pm[1] + r2; }
    }
    if (res == null && norm === norm.toUpperCase() && norm !== norm.toLowerCase()) {
      // mismo texto en MAYÚSCULAS (carteles): se busca sin distinguir mayúsculas y se devuelve en mayúsculas
      var ci = CI.get(norm.toLowerCase()); if (ci != null) res = ci.toUpperCase();
    }
    if (res == null) {
      // varias frases seguidas ("Frase uno. Frase dos.")
      var sen = norm.split(/(?<=[.!?…])\s+/);
      if (sen.length > 1) {
        var any = false, outs = sen.map(function (x) { var r = lookup(x, depth); if (r == null) return x; any = true; return r; });
        if (any) res = outs.join(' ');
      }
    }
    if (res == null) return raw;
    return lead + res + tag + trail;
  }
  function lookup(norm, depth) {
    var v = E.get(norm);
    if (v != null) return v;
    for (var i = 0; i < TPL.length; i++) {
      var t = TPL[i], mm = t.re.exec(norm);
      if (mm) {
        return t.en.replace(/\{(\w+)\}/g, function (_, n) {
          var g = t.map[n]; if (g == null) return '{' + n + '}';
          var val = mm[g + 1]; return core(val, depth + 1);
        });
      }
    }
    return null;
  }

  G.tr = function (s) {
    if (!EN || typeof s !== 'string' || !s) return s;
    var c = memo.get(s);
    if (c !== undefined) return c;
    var r = core(s, 0);
    if (memo.size > 6000) memo.clear();
    memo.set(s, r);
    return r;
  };
  // plural/ayudas
  G.I18N = { en: EN, data: DATA };

  if (!EN) return;

  // ---- Bolsas de palabras del minijuego de hackeo (misma longitud que las originales) ----
  try {
    var MJ = DATOS_JUEGO.MINIJUEGOS;
    if (DATA.hack) { MJ.HACK.BOLSA_PALABRAS = DATA.hack; }
    if (DATA.adv && MJ.AVANZADO && MJ.AVANZADO.HACK) { MJ.AVANZADO.HACK.BANCOS_PALABRAS = DATA.adv; }
  } catch (e) {}

  // ---- DOM: observador ----
  var SKIPTAG = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  var ATTRS = ['title', 'placeholder', 'alt', 'aria-label'];
  function skipEl(el) { return !!(el && el.closest && el.closest('.tm-root,[data-noi18n]')); }
  function trText(n) {
    var v = n.nodeValue;
    if (n.__t === v) return;
    var t = G.tr(v);
    if (t !== v) n.nodeValue = t;
    n.__t = n.nodeValue;
  }
  function trAttrs(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i], v = el.getAttribute(a);
      if (v) { var t = G.tr(v); if (t !== v) el.setAttribute(a, t); }
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!skipEl(root.parentNode)) trText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (SKIPTAG[root.tagName] || skipEl(root)) return; trAttrs(root); }
    var tw = document.createTreeWalker(root, 1 | 4, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return (SKIPTAG[n.tagName] || n.classList.contains('tm-root') || n.hasAttribute('data-noi18n')) ? 2 : 1;
        return 1;
      }
    });
    var n;
    while ((n = tw.nextNode())) { if (n.nodeType === 3) trText(n); else trAttrs(n); }
  }
  G.i18nWalk = walk;

  var mo = null;
  function onMut(list) {
    mo.disconnect();
    try {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === 'childList') { for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]); }
        else if (m.type === 'characterData') { if (!skipEl(m.target.parentNode)) trText(m.target); }
        else if (m.type === 'attributes') { if (!skipEl(m.target)) trAttrs(m.target); }
      }
    } catch (e) {}
    mo.observe(document.documentElement, OPTS);
  }
  var OPTS = { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS };
  function start() {
    mo = new MutationObserver(onMut);
    walk(document.body || document.documentElement);
    mo.observe(document.documentElement, OPTS);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  // el HTML estático se traduce al terminar de cargar (por si algún nodo llegó antes del observador)
  window.addEventListener('load', function () { try { walk(document.body); } catch (e) {} });
})();
