// ==========================================================================
// JUST ONE MORE CHEST — datos.js — VERSIÓN 0.101
// DATOS_JUEGO: configuración y balance
// ==========================================================================

/* ==========================================================================
   JUST ONE MORE CHEST - ARCHIVO DE CONFIGURACIÓN Y BALANCE (DATOS_JUEGO)
   ========================================================================== */

const DATOS_JUEGO = {
  // [0.088] Versión visible en pantalla (esquina inferior central) para que las capturas la incluyan
  VERSION: '0.101',

  // [0.089] Avisos "+N" / "-N" de herramientas. ESPERAR_PANTALLA_LIBRE:true = recupera la idea anterior (esperar a que no haya
  // banners, tiendas ni diálogos encima). Con false salen siempre, por encima de todo.
  AVISOS_LLAVES: { ESPERAR_PANTALLA_LIBRE: false, DURACION_MS: 1450, DURACION_RAPIDA_MS: 800 },

  // [0.089] Las válvulas no salen en botín ni objetos hasta este nivel (los tratos solo dan herramientas de puzles ya desbloqueados)
  VALVULAS_NIVEL_MIN_BOTIN: 4,

  // [0.089] Mensajes (al azar) cuando un objeto intenta cambiar el ambiente de la sala mientras hay una maldición activa
  TEXTOS_AMBIENTE_MALDICION: [
    'Esta maldición lo impregna todo, como si fuese sangre. Nada más puede teñir esta sala.',
    'La sala ya está empapada de la maldición. Lo que acabas de tocar se apaga sin dejar rastro.',
    'Intentas cambiar la luz, pero la maldición lo cubre todo como sangre seca.'
  ],

  // [0.090] Modo test (menú del engranaje): clave de LONGITUD flechas. Solo se guarda su huella (SAL + 2000 rondas de SHA-256), no la secuencia.
  MODO_TEST: { LONGITUD: 6, SAL: 'JOMC-7f3a91c2', HUELLA: 'a24aa5d1538936c292ebb6434c149919f1996175a0a06724d40f9e2e3cf7bdbc' },

  // [0.090] Golpe de Game Over (antes de que hable el Trapero)
  // [0.092] Pantalla de subida de nivel: fanfarria + cartel, ruleta de wildcards (pasos, ms entre cambios al inicio/final, curva de frenado) y 3 mejoras como cofres abiertos
  SUBIDA_NIVEL: {
    LLUVIA_PIEZAS: 46, LLUVIA_MS: 1400, SACUDIDA_PX: 9, SACUDIDA_MS: 520,   // [0.093] espectáculo del cartel de nivel
    RULETA_PASOS: 20, RULETA_MS_INICIAL: 50, RULETA_MS_FINAL: 340, RULETA_CURVA: 2.5, RULETA_MS_FINAL_PAUSA: 520, PAUSA_TRAS_RULETA_MS: 450, ESCALONADO_COFRES_MS: 260 },
  GAME_OVER: { GOLPE: { DURACION_MS: 3600, SACUDIDA_PX: 16, SACUDIDA_MS: 650, CAIDA_MS: 320, ESCALONADO_MS: 90, PAUSA_PALABRAS_MS: 170 } },   // [0.091] 3 s; las letras caen escalonadas (el golpe final suena al caer la última)

  // [0.090] Ayudas de las primeras veces (por partida)
  // [0.091] Ganzúa táctil: el anillo gira la aguja de forma RELATIVA (mueves el dedo en horizontal y gira lo mismo que la barra x SENSIBILIDAD_ANILLO; <1 = más fino)
  // y avisa del punto dulce (real o falso por igual) con vibración (móvil) o un leve temblor de pantalla (PC) que crece al acercarse.
  GANZUA_TACTIL: {
    GRAB_GRADOS: 32,   // [0.093] margen angular (°) para agarrar la aguja con el dedo
    SENSIBILIDAD_ANILLO: 1.8,   // [0.092] antes 0.8 (casi inusable)
    ANILLO_CENTRO: { ACTIVAR: true },   // [0.096] el centro del dial 'respira' (anillo tenue) para indicar que se puede pulsar y mantener; se atenúa mientras se mantiene
    HAPTICA: { ACTIVAR: true, INTENSIDAD_MAX: 0.55, RECORDATORIO_ACTIVAR: true, RECORDATORIO_MS: 1200, RECORDATORIO_ON_MS: 10, ZONA_GRADOS: 20, PERIODO_MS: 110, ON_MIN_MS: 4, CURVA: 2.6, TEMBLOR_PX_MIN: 0.4, TEMBLOR_PX_MAX: 2.6 }   // [0.096] máximo del temblor de escritorio 1,8 -> 2,6   // [0.093] INTENSIDAD_MAX (0-1) = fuerza máxima de la vibración del móvil; más sutil
  },
  // [0.095] Post-its en blanco donde escribe el jugador. COFRES = cofres tras los que aparece el post-it vacío; en el bucle siguiente
  // el texto sale en el cofre anterior (COFRE-1). MAX_CARACTERES = límite al escribir.
  NOTAS_JUGADOR: { COFRES: [13, 37], MAX_CARACTERES: 60, ANCHO_PX: 210 },
  AYUDAS: { GANZUA_TACTIL: { VECES: 3, ANILLO: 'AGARRA LA GANZÚA Y ARRÁSTRALA', CENTRO: 'MANTÉN EL CENTRO' }, PISTONES_TOQUE: { VECES: 3, TEXTO: 'También puedes tocar cualquier punto de la pantalla para fijar el pistón.' } },

  // [0.090] Enfado del Duende al NO comprar en la tienda especial (cofres 85/88/90): sacudida (px, ms) y nivel de sonido 1-3
  ENFADO_DUENDE: { 85: { SACUDIDA_PX: 5, MS: 380, NIVEL: 1 }, 88: { SACUDIDA_PX: 9, MS: 560, NIVEL: 2 }, 90: { SACUDIDA_PX: 15, MS: 900, NIVEL: 3 }, DEFAULT: { SACUDIDA_PX: 5, MS: 380, NIVEL: 1 } },

  // [0.089b] El pitido suena mientras la carta palpite (MAX_REPETICIONES: 0 = sin límite). Se pausa con banners/ventanas encima.
  PITIDO_CARTAS: { ACTIVAR: true, CADA_MS: 2000, MAX_REPETICIONES: 0 },

  // [0.090] Sonido por perfil. PEQUENOS = clics y avisos, BOTIN = fanfarrias y caja registradora, GENERAL = todo. Se elige solo: móvil/táctil o escritorio.
  // CANAL_VIVO: ruido casi inaudible y continuo que mantiene despierto el canal de los auriculares Bluetooth (pon ACTIVAR:false para quitarlo).
  SONIDO: {
    PERFILES: {
      escritorio: { GENERAL: 1, PEQUENOS: 1, BOTIN: 1 },
      movil:      { GENERAL: 1, PEQUENOS: 2.0, BOTIN: 0.5 }
    },
    CANAL_VIVO: { ACTIVAR: true, NIVEL: 0.0015 }
  },

  // [0.089b] Zumbido grave que muta despacio, solo cuando el cofre seleccionado es legendario (se calla al empezar el puzle y con el botón de silencio)
  ZUMBIDO_LEGENDARIO: { ACTIVAR: true, VOLUMEN: 0.05, FUNDIDO_S: 1.5, RESPIRACION_S: 8, RESPIRACION_PROFUNDIDAD: 0.5, CORTE_HZ: 1500, NOTAS_HZ: [220, 330, 440, 554.4], CAMPANILLA: { ACTIVAR: true, VOLUMEN: 0.03, CADA_MIN_S: 4, CADA_MAX_S: 8, COLA_S: 1.8, NOTAS_HZ: [880, 988, 1109, 1319, 1480, 1760] } },   // [0.092] aura luminosa que respira + destello de campanilla

  // [0.089b] Pantalla previa de las cartas: solo en pantallas táctiles (SOLO_TACTIL:false = también en PC)
  CARTAS_PANTALLA_PREVIA: { ACTIVAR: true, SOLO_TACTIL: true },

  // [0.089b] Maldición: melodía al empezar / terminar y transición gradual del tinte (espera a que se vea la pantalla principal)
  MALDICION_TRANSICION: { ACTIVAR: true, DURACION_MS: 2600 },

  // [0.089b] Botón "Aceptar" retardado en mensajes de clic compulsivo: solo las primeras VECES por tipo de mensaje y por partida
  ACEPTAR_RETARDADO: { ACTIVAR: true, VECES: 2, RETARDO_MS: 2000 },

  // [0.088] Aviso "gira el móvil": sale solo en pantallas táctiles apaisadas y bajas; el juego se pausa. Frases al azar (voz del Duende).
  AVISO_GIRAR: {
    TITULO: '¡EH, EH! ¡AL REVÉS!',
    FRASES: [
      'Así no hay quien cuente monedas, forastero. Gira ese cacharro y ponlo de pie. Los cofres no se abren tumbados... y yo no cobro por esperar.',
      '¡Cuidado, que se me caen las monedas! Pon el aparato derecho y volvemos al negocio.'
    ]
  },

  // 🟢 CONFIGURACIÓN E INVENTARIO INICIAL
  CONFIG_INICIAL: {
    NIVEL: 1,
    GANZUAS: 3,
    PINES: 0,
    USB: 0,
    VALVULAS: 0,
    ORO: 0
  },

  // 🎨 GRÁFICOS (0.085): marco vertical, fondo de celda, sprites y portada
  GRAFICOS: {
    ACTIVAR_ARTE: true,          // false = vuelve al dibujo provisional (sin sprites ni portada)
    MOSTRAR_PORTADA: true,       // pantalla de inicio antes de "Continuar / Nueva partida"
    COFRE_ANCHO_PCT: 0.46,       // ancho del sprite del cofre respecto al ancho del marco
    COFRE_SUBE_MOVIL_MULTI: 0.07,   // [0.088] en móvil, con varios cofres, el cofre sube este % del alto para dejar hueco al selector
    COFRE_Y_PCT: 0.50,           // altura del centro del cofre respecto al alto del marco
    ESCALA_UI_MAX: 1.6,          // tope del zoom de la interfaz en pantallas grandes (HUD y tarjeta del cofre)

    // [0.101] Tiendas con arte propio (Duende y Trapero)
    TIENDAS: {
      CONFIRMAR_CON_SEGUNDO_TOQUE: true,   // 1er toque: elige la tarjeta · 2º toque: confirma (como la cerradura del cofre)
      APERTURA: { ACTIVAR: true, SACUDIDA_MS: 450, SUBIDA_MS: 1300 },   // la persiana del Duende se sacude y sube al entrar
      FRASES_DUENDE: ['¡SOLO UNO MÁS!', '¿QUÉ SE LLEVA?', 'MIRE, MIRE...', 'NADA ES GRATIS', 'ESTO LE HARÁ FALTA', 'UNO MÁS NO HACE DAÑO'],
      FRASES_SIN_ORO: ['EL ORO NO SE ESTIRA...', 'VUELVA CON MÁS ORO', 'ESO NO LE ALCANZA', 'SIN ORO NO HAY TRATO'],
      FRASES_SIN_GANZUAS: ['FALTAN GANZÚAS', 'NO TIENE SUFICIENTES', 'TRAIGA MÁS GANZÚAS'],
      FRASES_COMPRA: ['¡EXCELENTE ELECCIÓN!', '¡ASÍ SE HACE!', 'UNO MÁS... SIEMPRE UNO MÁS', 'HE AHÍ, HE AHÍ'],
      FRASES_ROBO: ['...ME HA PARECIDO VER ALGO', '¿DÓNDE HA IDO MI MERCANCÍA?', 'QUÉ MANOS TAN LISTAS'],
      FRASES_RECICLAJE: ['EL TALLER LO AGRADECE', 'DE LATÓN A ACERO', 'BUEN CANJE'],
      FRASE_ESPECIAL: ['SOLO UNA COSITA...', 'NO SE VAYA SIN NADA', 'SE LO PONGO FÁCIL'],
      ETIQUETAS_TRAPERO: {
        vender_ganzuas: 'VENTA', vender_avanzada: 'VENTA', canje_directo: 'CANJE',
        pacto_sangre: 'PACTO', pacto_sombra: 'PACTO', amor_arte: 'PACTO', dedos_rotos: 'PACTO',
        contrato_leonino: 'CONTRATO', purga_maldicion: 'PURGA', empujon_siniestro: 'EMPUJÓN',
        cambio_trabajo: 'CAMBIO', maestria_doble_filo: 'DOBLE FILO', contador_cofres_trapero: 'CONTADOR'
      }
    },

    // [0.101] Imagen de fondo de cada puzle (VELO: 0 = imagen limpia, 1 = negro)
    FONDOS_PUZLES: { ACTIVAR: true, VELO: 0.5 },

    // [0.086] Texto un poco más grande (post-its, descripciones, etiquetas). false = tamaños de la 0.085.
    TEXTO_GRANDE: true,

    // [0.086] Tinte rojo de la sala según el tier narrativo (0 = nada, 1 = opaco). Tier 5 ≈ el tinte de la 0.085.
    // [0.087b] Tiers 1-3: nada. Del último cofre del tier 3 al primero del tier 5 el tinte crece de forma lineal hasta el valor del tier 5.
    TINTE_ROJO_POR_TIER: { 1: 0, 2: 0, 3: 0, 4: 'progresivo', 5: 0.28 },

    // [0.086] Halo del cofre por rareza: a = opacidad (hex), r = radio (× ancho del sprite), anillo = aro exterior pulsante
    HALO_RAREZA: {
      normal:     { a: '33', r: 0.85, anillo: false },
      raro:       { a: 'a8', r: 1.00, anillo: false },
      epico:      { a: 'c4', r: 1.12, anillo: false },
      legendario: { a: 'e0', r: 1.28, anillo: false }
    },

    // [0.086] Abrir tocando la cerradura del cofre. SOLO en pantalla ancha (en móvil tapa el selector de cofres).
    // El botón "Forzar cerradura" sigue existiendo siempre.
    TOCAR_CERRADURA: {
      ACTIVAR: true,
      SOLO_PANTALLA_ANCHA: false,   // [0.088] también en móvil (con varios cofres el selector baja y el cofre sube)
      ANCHO_MIN_LATERAL_PX: 160,   // pantalla ancha = la ventana supera al marco en al menos esto (se ven marquesinas)
      RADIO_MIN_PX: 26             // la zona táctil mide al menos 2×radio (≥ 48 px de diámetro)
    },
    // [0.087] Flecha + "TOCA EL CERROJO PARA ABRIR" en los primeros cofres abiertos con éxito de cada tipo (solo pantalla ancha).
    // El contador se reinicia al empezar partida nueva y al cambiar de bucle.
    FLECHA_CERROJO: { ACTIVAR: true, COFRES_POR_TIPO: 2, TEXTO: 'TOCA EL CERROJO PARA ABRIR', MENSAJE_SOLO_TIPOS: ['wooden'], COFRES_POR_TIPO_TOCA_OTRA_VEZ: 5 },   // [0.087b] 2 primeros por tipo; mensaje solo en madera

    // [0.089b] Escala de las ventanas informativas en PC: ancho del marco / ANCHO_BASE, con tope MAX. Los puzles (minigameModal) no se escalan.
    ESCALA_VENTANAS: { ACTIVAR: true, ANCHO_BASE: 390, MAX: 1.7 },

    // [0.089] Doble toque también con un solo cofre; el botón "Forzar cerradura" comparte el estado "armado" con la cerradura
    BOTON_ARMADO_TEXTO: 'PULSA DE NUEVO',

    // [0.087] Filtro granate (color del Trapero) mientras hay una maldición activa. El tinte por tier siempre tiene prioridad.
    TINTE_MALDICION: { ACTIVAR: true, RGB: '200,16,28', ALFA: 0.50, PULSO: 0.09, VINETA: 0.55, VINETA_RGB: '90,0,8' },   // [0.090] rojo vivo y rotundo, pulso marcado y viñeta roja (el tinte del tier 5 manda; el del tier 4 se suma)

    // [0.087] Vibración (ms) al cargar y al abrir la cerradura (solo móviles que la soporten)
    VIBRACION: { CARGAR: 35, ABRIR: 12 },

    // [0.090] Vapor animado del Cofre de Vapor: se borra el humo dibujado en el sprite (zona BORRAR, en píxeles del sprite) y salen bocanadas de la boquilla
    CHISPAS_LEGENDARIO: { ACTIVAR: true, CANTIDAD: 9, CICLO_MS: 2600, ALTURA: 1.1 },   // [0.097] prueba
    VAPOR_ANIMADO: { ACTIVAR: true, BORRAR: { x0: 20, y0: 0, x1: 38, y1: 7 }, BOQUILLA: { x: 23.5, y: 8 }, BOCANADAS: 9, CICLO_MS: 3000, ALTURA: 14, DERIVA: 6, TAM_MIN: 2, TAM_MAX: 6, COLOR: '236,228,205' },
    // [0.091] Animaciones de los cofres (coordenadas en píxeles del sprite de 56x48). Se pintan sobre el sprite, igual en todas las rarezas.
    ANIMACION_COFRES: {
      ACTIVAR: true,
      PISTONES: { ACTIVAR: true, X: [13, 21, 29, 37], PERIODOS_S: [2.6, 3.4, 2.1, 3.0], FASES: [0, 1.3, 2.2, 0.7], Y_MIN: 29, Y_MAX: 38 },
      DIGITAL: { ACTIVAR: true, CAMBIO_MS: 1900, BARAJA_MS: 420, LEDS_PERIODOS_S: [1.1, 1.7, 2.3] },
      AGUJA: { ACTIVAR: true, CICLO_S: 10, SUBIDA_S: 1.4, ANGULO_REPOSO: -45, ANGULO_PRESION: 46, TEMBLOR_GRADOS: 6 }
    },

    // Zona de la cerradura por tipo de cofre, como fracción del sprite (x, y desde la esquina sup. izq.; r = radio × ancho)
    CERRADURAS: {
      wooden:    { x: 0.50, y: 0.55, r: 0.20 },
      piston:    { x: 0.50, y: 0.69, r: 0.22 },
      cyber:     { x: 0.50, y: 0.75, r: 0.20 },
      hydraulic: { x: 0.46, y: 0.74, r: 0.18 }
    }
  },

  // [0.087] TEXTOS DE AYUDA (tooltip al pasar el ratón + banner al pulsar). {min} y {n} se sustituyen solos.
  TEXTOS_AYUDA: {
    racha: "Racha de apertura: cofres seguidos sin fallar un puzle. Desde {min} seguidos ganas GP extra en cada cofre. Un fallo la rompe.",
    maldicion: "Maldición: sufres un -50% de ganancias en GP y XP durante los próximos {n} cofres.",
    ganzuas: "Ganzúas: abren los Cofres de Madera. Solo se gastan cuando la ganzúa se rompe.",
    pines: "Pines de Acero: abren las Cajas de Acero. Los cofres legendarios piden más de uno.",
    usb: "Llaves USB: abren las Arcas Digitales. Los cofres legendarios piden más de una.",
    valvulas: "Válvulas: abren los Cofres de Vapor. Los cofres legendarios piden más de una.",
    sinXp: "Por Amor al Arte: no ganas experiencia durante los próximos {n} cofres.",
    xpExtra: "Impulso de Trabajo: +25% de experiencia durante los próximos {n} cofres.",
    xpPermanente: "Pacto de la Sombra: +25% de experiencia permanente.",
    cartas: {
      auto: "Carta AUTO: abre al instante el cofre activo, sin puzle.",
      double: "Carta 2X: duplica la recompensa del siguiente cofre que abras.",
      shield: "Carta ESCUDO: si fallas el siguiente puzle, no pierdes la herramienta.",
      riskPot: "Carta APUESTA: activa el Bote de Riesgo (Doble o Nada). Cobra el bote cuando quieras con «Cobrar Bote».",
      perdedor: "Carta PERDEDOR: tras 5 fallos (seguidos o no), el botín del siguiente cofre será Legendario x2.",
      summonDuende: "Carta DUENDE: invoca al Duende y su tienda al momento."
    }
  },

  // 🏆 LOGROS (textos y condiciones ajustables). Se guardan aparte de la partida: sobreviven a "Nueva partida".
  // condicion.tipo disponible: 'COFRES_ABIERTOS' (valor = nº de cofres abiertos en la partida actual)
  LOGROS: {
    DURACION_BANNER_MS: 4000,
    LISTA: [
      { id: 'un_gran_paso', icono: '🏆', titulo: 'UN GRAN PASO', descripcion: 'Abre tu primer cofre', condicion: { tipo: 'COFRES_ABIERTOS', valor: 1 } }
    ]
  },

  // 🟢 PROGRESIÓN Y CURVA DE EXPERIENCIA
  PROGRESIÓN: {
    XP_BASE_NIVELES: { 1: 100, 2: 160, 3: 250, 4: 340, 5: 500 },
    XP_MULTIPLICADOR_POST_5: 1.10,
    INTERVALOS_VISITAS: {
      TRAPERO_PRIMER_COFRE: 7,
      TRAPERO_INTERVALO: 8,
      DUENDE_INTERVALO: 5
    },
    SECUENCIA_HISTORIA: {
      COFRE_INICIO_TRAPERO: 79,
      COFRE_CONSEJO_NO_COMPRAR: 84,
      COFRE_OFERTA_1: 85,
      COFRE_ADVERTENCIA_1: 86,
      COFRE_REFUERZO: 87,
      COFRE_OFERTA_2: 88,
      COFRE_EVALUACION: 89,
      COFRE_OFERTA_3: 90,
      COFRE_CLIMAX_INICIO: 91,
      COFRE_AUTO_OPEN_INICIO: 101,
      COFRE_AUTO_OPEN_FIN: 110,
      COFRE_COLAPSO_FINAL: 110
    }
  },

  // 🟢 ECONOMÍA, TIENDA Y RECOMPENSAS
  ECONOMIA: {
    TIENDA_DUENDE: {
      pack_ganzuas: 20,
      pack_pines: 30,
      pack_usb: 35,
      pack_valvulas: 35,
      carta_auto_open: 90,
      carta_escudo: 40,
      carta_apuesta: 50,
      contador_cofres: 100,
      aumento_precio_por_compra: 5
    },
    RECICLAJE: {
      ganzuas_requeridas: 3,
      herramientas_otorgadas: 1
    },
    TRAPERO: {
      gp_por_dos_ganzuas: 15,
      gp_por_herramienta_avanzada: 15,
      gp_contrato_leonino: 45,
      // [CAMBIO] Qué pasa con la XP al subir de nivel con el Empujón Siniestro:
      //   "conservar" = no se toca la XP actual (por defecto)
      //   "perder" = la XP actual se pone a 0
      //   "restar_con_minimo_cero" = se resta la XP de un nivel, sin bajar de 0
      empujon_siniestro_xp: "conservar"
    },
    RECOMPENSAS_BASE: {
      gp_min: 2,
      gp_max: 5,
      xp_min: 6,
      xp_max: 10
    },
    MULTIPLICADORES_RAREZA: {
      normal: 1.0,
      raro: 2.5,
      epico: 5.0,
      legendario: 10.0,
      especial: 4.0
    },
    RACHAS_APERTURA: {
      MINIMO_PARA_BONUS: 3,
      NIVEL_3: { fixedGp: 1, pctGp: 0.15 },
      NIVEL_5: { fixedGp: 3, pctGp: 0.20 },
      BONUS_PERK_BOLSILLO: { fixedExtra: 1, pctExtra: 0.15 }
    },
    PORCENTAJE_MAESTRIA_TORPEZA_BASE: 0.15,
    INCREMENTO_MAESTRIA_TORPEZA_POR_NIVEL: 0.05,
    MALDICION_SALVAMENTO: {
      DURACION_BASE: 10,
      INCREMENTO_POR_TRATO: 5,
      PENALIZACION_MULTIPLICADOR: 0.50
    },
    // [CAMBIO] Regateador: descuento base + incremento por nivel (como las maestrías), con un precio mínimo de seguridad
    REGATEADOR: {
      base: 0.15,
      incremento: 0.05,
      precio_minimo_pct: 0.40
    },
    // [CAMBIO] Wildcard Maldición de la Codicia: penalización de GP en cofres Épicos/Legendarios
    MALDICION_CODICIA_PENALIZACION: 0.50
  },

  // 🟢 PROBABILIDADES Y DROP RATES
  PROBABILIDADES: {
    RAREZAS_COFRES_POR_NIVEL: {
      1: { normal: 0.90, raro: 0.10, epico: 0.00, legendario: 0.00 },
      2: { normal: 0.65, raro: 0.30, epico: 0.05, legendario: 0.00 },
      3: { normal: 0.50, raro: 0.40, epico: 0.10, legendario: 0.00 },
      4: { normal: 0.40, raro: 0.30, epico: 0.20, legendario: 0.10 }
    },
    COFRE_ESPECIAL_CHANCE: 0.15,
    HERRAMIENTA_EXTRA_CHANCE: 0.25,
    // [0.082] Con el trato Dedos Rotos activo, probabilidad fija de +1 Ganzúa en un cofre Normal de madera
    DEDOS_ROTOS_GANZUA_CHANCE: 0.15,
    ADORNO_SALA_CHANCE: 0.20,
    MULTIPLICADOR_DROP_PERIODO_GRACIA: 2.0,
    // [CAMBIO] Probabilidad de que el wildcard de subida de nivel sea PERJUDICIAL, según el bucle
    WILDCARD_MALA_POR_BUCLE: { 1: 0.20, 2: 0.40, 3: 0.60 }
  },

  // 🟢 CONFIGURACIÓN DE MINIJUEGOS (ADAPTADO A RAREZA DE COFRE - BUCLE 1/2)
  MINIJUEGOS: {
    LOCKPICK: {
      TIEMPO_BASE_SEGUNDOS: 8,
      SALUD_INICIAL: 100,
      TOLERANCIA_NORMAL: 14,
      TOLERANCIA_DIFICIL: 8,
      PROB_DECOYS_POR_RAREZA: {
        normal: 0.00,
        raro: 0.40,
        epico: 0.90,
        legendario: 1.00
      },
      PROB_TRAMPA_LEGENDARIO: 0.03, // 3% de cofre insalvable/troll en Legendario
      // [0.084] Mensajes del cofre troll: salen SIEMPRE que se falla en una cerradura trampa (por rotura, tiempo o abandono)
      MENSAJES_TRAMPA: {
        ROTURA: "🎭 ¡CERRADURA TRAMPA! Esta cerradura era un engaño absoluto y ha destruido tu herramienta.",
        TIEMPO: "🎭 Era una CERRADURA TRAMPA: no tenía solución. Ningún punto era el bueno.",
        ABANDONO: "🎭 Era una CERRADURA TRAMPA: no tenía solución. Hiciste bien en desconfiar."
      },
      DECAY_SALUD_DECOY: 2.5,
      DECAY_SALUD_ERROR: 1.8,
      VELOCIDAD_CILINDRO_ACIERTO: 3,
      VELOCIDAD_CILINDRO_ERROR: 1.5,
      VELOCIDAD_CILINDRO_DECOY: 1.0,
      RETORNO_DESCENTRO: 8
    },

    TUMBLER: {
      TIEMPOS_POR_PIN: {
        3: 7,
        4: 9,
        5: 11
      },
      PINS_POR_RAREZA: {
        normal: 3,
        raro: 4,
        epico: 5,
        legendario: 5
      },
      VELOCIDAD_FPS_REFERENCIA: 90,   // [0.091] las velocidades de abajo se aplican como si la pantalla fuera a estos fps (movimiento por tiempo real, igual en 60/90/144 Hz). Sube = pistones más rápidos
      VELOCIDAD_BASE_NORMAL: 0.48,
      VELOCIDAD_BASE_DIFICIL: 0.70,
      VELOCIDAD_LEGENDARIA: 0.85,
      BONO_MANO_FIRME: 1.5,    // [0.085] tolerancia extra por nivel de Mano Firme (antes 3)
      TOLERANCIA_NORMAL: 9,    // [0.086] ±% del carril (0.085: 7); la banda verde dibujada = zona de acierto real
      TOLERANCIA_DIFICIL: 5,   // [0.086] (0.085: 4)
      MARGEN_INVISIBLE_PCT: 2.5,   // [0.088] margen NO visible, simétrico (arriba y abajo), que se suma a la tolerancia al juzgar el acierto
      MULT_VELOCIDAD_RAREZA: { epico: 0.9, legendario: 0.9 }  // [0.086] pistones un 10 % más lentos en épico y legendario
    },

    HACK: {
      INTENTOS_NORMAL: 4,
      INTENTOS_DIFICIL: 3,
      TIEMPO_LEGENDARIO_SEGUNDOS: 15,
      // [0.082] Longitudes posibles por rareza (también en Bucle 1): las palabras de 7 letras ya se usan.
      // En un mismo puzle TODAS las opciones comparten longitud. Normal conserva wordLength de CONFIG_POR_RAREZA.
      LONGITUD_BASE_POR_RAREZA: {
        raro: [6, 7],
        epico: [7, 8],
        legendario: [8]
      },
      CONFIG_POR_RAREZA: {
        normal: { wordLength: 6, displayCount: 6 },
        raro: { wordLength: 6, displayCount: 8 },
        epico: { wordLength: 8, displayCount: 8 },
        legendario: { wordLength: 8, displayCount: 8, hasTimer: true }
      },
      BOLSA_PALABRAS: {
        6: ["DUENDE", "TRATOS", "NOCHES", "HÚMEDO", "SOMBRA", "ESCAPE", "ESPEJO", "PUERTA", "COFRES", "MADERA", "OSCURO", "PISTÓN", "COMPRA", "AYUDAR", "OCULTO", "SALIDA", "ENGAÑO"],
        7: ["CERRADO", "TERMINA", "OCULTOS", "MEMORIA", "ENTRADA", "SALIDAS", "DIÁLOGO", "PRISIÓN", "SECRETO", "BARRERA", "DESTINO", "TRAPERO", "BLOQUEO", "CODICIA", "ESCALAR", "ABIERTO", "COMPRAR"],
        8: ["ENGAÑADO", "BLOQUEOS", "MENSAJES", "CILINDRO", "PANTALLA", "INTERFAZ", "PERFECTO", "PROTOCOL", "EXTERIOR", "PALABRAS", "INSECTOS", "TELÉFONO", "VALIENTE", "PRECIOSO", "CUADERNO"]
      }
    },

    PIPE: {
      TIEMPO_BASE_SEGUNDOS: 12,
      TIEMPO_LEGENDARIO_SEGUNDOS: 9,
      BOMBAS_ACTIVAS: false,
      CONFIG_POR_RAREZA: {
        normal: { size: 3, obstacles: 0 },
        raro: { size: 4, obstacles: 1 },
        epico: { size: 4, obstacles: 2 },
        legendario: { size: 5, obstacles: 3 }
      }
    },

    // ======================================================================
    // [0.082] MINIJUEGOS AVANZADOS (BUCLE 2 y 3)
    // Se aplican SOLO a cofres Raro / Épico / Legendario cuando el bucle actual
    // está en BUCLES_ACTIVOS. Los cofres Normales siguen con la versión base.
    // Todos los valores son editables aquí.
    // ======================================================================
    AVANZADO: {
      BUCLES_ACTIVOS: [2, 3],
      RAREZAS: ['raro', 'epico', 'legendario'],

      // --- GANZÚA: el "tanteo" (apretar y soltar el botón) se penaliza ---
      LOCKPICK: {
        PENALIZACION_TANTEO: 0.30,          // -30% GP y XP del cofre (una sola vez por cofre)
        ETIQUETA_RECIBO: "🫳 Tanteo (-30%)",
        // El Trapero lo explica UNA vez por bucle, la primera vez que ocurre. [FRASES DE EJEMPLO: para afinar]
        FRASE_TRAPERO: {
          2: "Te he visto tantear. Apretar, soltar, apretar, soltar... ¿tan poco confías en tus manos? Cada duda tiene su precio: un treinta por ciento menos. Aprende a decidirte. {sonrisa}",
          3: "Ese temblor en los dedos... ¿a quién crees que engañas? Cada vez que sueltas, el cofre lo sabe. Yo también. Treinta por ciento menos, y ya no queda nadie a quien reclamar. {amenaza}"
        }
      },

      // --- PISTONES: fase final "sellado": al fijar el último, todos suben juntos hasta la línea azul ---
      TUMBLER: {
        SEGUNDOS_EXTRA: 2,                  // +2 s de tiempo total (solo Raro/Épico/Legendario)
        VERDE_RANGO: [66, 78],              // línea verde SIEMPRE en el tercio inferior (% desde arriba)
        AZUL_RANGO: [18, 44],               // línea azul por encima de la verde
        TOLERANCIA_AZUL: 5,                 // % de altura (no estricta); se puede ampliar con Mano Firme
        VELOCIDAD_SUBIDA_FINAL: 37.5,         // % de altura por segundo (Pistones Lentos también la reduce)
        TEXTO_AYUDA_FINAL: "¡Sellado! Pulsa para <span class=\"text-sky-400 font-bold\">detener los pistones</span> en la <span class=\"text-sky-400 font-bold\">línea azul</span>.",
        TEXTO_BOTON_FINAL: "¡DETENER AHORA!"
      },

      // --- TERMINAL: letras O números, nunca mezclados ---
      HACK: {
        PROB_NUMEROS: 0.30,                 // 70% palabras / 30% números
        LONGITUD_NUMEROS_POR_RAREZA: { raro: 4, epico: 5, legendario: 6 }, // dígitos del código (4, 5 o 6)
        OPCIONES_NUMEROS: { raro: 5, epico: 6, legendario: 6 }, // [0.085] nº de opciones en pantalla en modo números, por rareza
        LONGITUD_POR_RAREZA: {
          raro: [6, 7],                     // se elige una de las dos y TODAS las opciones comparten longitud
          epico: [7, 8],
          legendario: [8]
        },
        GRUPO_DIGITOS: [2, 3],              // números agrupados en bloques de 2-3 dígitos
        BANCOS_PALABRAS: {                  // [BANCOS DE EJEMPLO: para afinar] más paranoia / inquietud, por bucle y longitud
          2: {
            6: ["VIGILA", "MIRADA", "ESPÍAS", "CULPAS", "AHOGAS", "ZUMBAN", "ESCAPA", "RECELO", "ACECHO", "SIGUEN", "RASCAN"],
            7: ["OBSERVA", "SUSURRO", "ZUMBIDO", "SOLEDAD", "AGUJERO", "VIGILAS", "SEÑALES", "PERSIGO", "ESPERAS", "ACECHAS", "TEMBLOR"],
            8: ["OBSERVAN", "ATRAPADO", "ENCIERRO", "INSOMNIO", "SILENCIO", "VIGILADO", "ESCUCHAN", "ACECHADO", "SEGUIDOS", "ENCERRAR"]
          },
          3: {
            6: ["LATIDO", "CADENA", "MORDER", "PODRIR", "GRITOS", "HUESOS", "DIENTE", "CARNES", "AGONÍA", "CULPAS", "ARAÑAN"],
            7: ["PODRIDO", "CADENAS", "LATIDOS", "CONDENA", "ASFIXIA", "SUDORES", "ATADURA", "CADÁVER", "AGONÍAS", "MORDIDA", "MORBOSO"],
            8: ["ENTRAÑAS", "CONDENAS", "GRITARÁS", "VÍSCERAS", "MORDIDOS", "PODRIDOS", "ENTIERRO", "DESANGRE", "ASFIXIAR", "CULPABLE", "INSOMNIO"]
          }
        }
      },

      // --- HIDRÁULICA: bombas, botón VALIDAR (un solo uso), sin pintado en tiempo real ---
      PIPE: {
        TIEMPO_SEGUNDOS: 20,                // Normal sigue en TIEMPO_BASE_SEGUNDOS (12)
        PESO_CENTRAL: 3,                    // [0.096] Las casillas malas (bombas/obstáculos) salen más hacia el centro: 1 = uniforme; mayor = más centradas
        CONFIG_POR_RAREZA: {
          raro: { size: 4, obstacles: 0, bombs: 1 },
          epico: { size: 4, obstacles: 1, bombs: 1 },
          // [0.096] PRUEBA: legendario 5x5 con 2 bombas + 1 obstáculo. Para revertir: { size: 4, obstacles: 0, bombs: 2 }
          legendario: { size: 5, obstacles: 1, bombs: 2 }
        }
      }
    }
  },

  // 🟢 CATÁLOGO DE COFRES
  COFRES: {
    ESTANDAR: [
      { id: "wooden", nombre: "COFRE DE MADERA", juego: "lockpick", consumible: "picks", minNivel: 1, desc: "Cerradura Básica • Solo se gasta al romper" },
      { id: "piston", nombre: "CAJA DE ACERO", juego: "tumbler", consumible: "proPicks", minNivel: 2, desc: "Mecanismo Pistonado • Requiere Pin de Acero" },
      { id: "cyber", nombre: "ARCA DIGITAL", juego: "hack", consumible: "usb", minNivel: 3, desc: "Terminal Encriptada • Requiere Llave USB" },
      { id: "hydraulic", nombre: "COFRE DE VAPOR", juego: "pipe", consumible: "valves", minNivel: 5, desc: "Red Hidráulica • Requiere Válvula" }
    ],
    INQUIETANTES: [
      { id: "organico", nombre: "COFRE PULSANTE", tipo: "sacrificio", desc: "Palpita suavemente. Abrirlo cuesta 5 GP o 2 turnos de maldición." },
      { id: "espejo", nombre: "COFRE ESPEJO", tipo: "invertido", desc: "Cristal oscuro. Invierte controles pero da botín x2." }, 
      { id: "susurrante", nombre: "COFRE SUSURRANTE", tipo: "narrativo", desc: "Muestra pensamientos del personaje en tiempo real." },
      { id: "mimic", nombre: "FALSO COFRE (MIMIC)", tipo: "trampa", desc: "Parece Legendario. Si fallas se traga tu herramienta." }
    ]
  },

  // 🟢 TEXTOS Y DIÁLOGOS NARRATIVOS
  NARRATIVA: {
    UMBRALES_TIERS: {
      tier_1: 10,
      tier_2: 25,
      tier_3: 45,
      tier_4: 65,
      tier_5: 66
    },

    POST_ITS: {
      BUCLE_1: {
        1: [
          "Buen trabajo.", "El siguiente puede ser mejor.", "No parece tan difícil.", "Solo uno más.",
          "Huele a madera recién cortada.", "Una cerradura limpia.", "Sigue probando.", "Cuestión de ritmo.", "Leche, huevos, yogures...", "Curioso.",
          "Estas ganzúas son de calidad.", "Bonita decoración.", "Es mi primera vez.", "Ese clic es hermoso.", "Vendo Opel Corsa.", "Por suerte me traje el taco de post-its.",
          "Guau.", "¿Se te da bien?", "Una cerradura como las de antes.", "Nunca había abierto uno antes.", "Clic.", "La satisfacción del trabajo bien hecho.", "Valdrá la pena seguir.",
          "Ese Trapero me hiela la sangre.", "¿Un duende con una tienda en un cofre?", "Hay cofres diferentes.", "Las ganzúas no se rompen si lo haces bien.", "Espero no volver a ver a ese tipo oscuro.",
          "¡Qué tipo tan siniestro!", "El duende me ha ayudado mucho.", "Necesito ver otra vez al duende.", "ORO.", "Más monedas.", "Se te da bien.", "Ojalá ese duende vendiese chuches.",
          "No sé que poner", "Easy.", "No hay muchos cofres de donde yo vengo", "password:3457654", "Nunca había visto un duende", "Ese Trapero...no sé.", "Estas ganzúas resisten, si lo hago bien",
          "Abrí ese cofre de metal y el pin se echó a perder", "Estoy en racha!"
        ],
        2: [
          "Ya llevas unos cuantos.", "No te cuesta seguir, ¿verdad?", "Otro más tampoco cambia nada.",
          "Las manos trabajan solas.", "El tiempo vuela aquí dentro.", "Un tintineo muy satisfactorio.",
          "Casi ni piensas en ello.", "Un cofre tras otro.", "Ese sonido es guay.", "Aquí estoy seguro.",
          "Al menos esto es predecible.", "¿Y si este es mi sitio?", "Sigue.", "¿Hoy es lunes?", "Otro.",
          "¿Hay alguien ahí?", "Húmedo y oscuro.", "No tengo ni que pensarlo.", "Parece que lo llevas haciendo toda la vida.",
          "Yo también he escuchado eso.", "Si alguien me lee: hierba fresca, cofres...", "Abrir, cobrar, abrir, cobrar...",
          "El cofre es el juego.", "¿Has visto a ese duende?", "Esos pistones requieren mi atención.",
          "¿Estoy aquí por las monedas o por los cofres?", "Los pines se gastan en cada cofre.", "Alinea esos pistones.",
          "El Trapero quiere algo de mí.", "Ese trato ha sido unfair.", "El duende tiene buenos precios.",
          "Eres un experto ya.", "Noto una corriente fría.", "No tengo ganas de dejarlo.",
          "Puedo dejarlo cuando quiera.", "Quizás haya oro en el siguiente cofre.", "Ese duende ama el oro más que yo los cofres.", "El duende tiene objetos muy útiles.",
          "Señor Trapero, Mal Agüero", "Mister Duende, todo por el cliente", "Esos dos necesitan mejor marketing.", "Debería saber cuantos cofre llevo ya.",
          "Duende y Trapero, expertos usureros", "Los cofres esconden algo", "Dentro de los cofres a veces hay objetos.", "Estos objetos decoran la habitación.",
          "Nunca acierto a la primera al meter el USB", "Siempre se me dió bien la informática.", "El Taller de Reciclaje es una buena forma de no quedarme sin lo que necesito."
        ],
        3: [
          "¿Por qué empezaste?", "Seguro que te acuerdas.", "Abre otro.", "Ya descansarás después.",
          "¿Escuchaste eso en la pared?", "El techo parece más bajo hoy.", "Tus dedos no tiemblan, eso es bueno.",
          "Nadie te espera fuera.", "No recuerdas la puerta.", "¿Había una puerta?", "¿Cómo llegué hasta aquí?",
          "No importa.", "Creo que ayer fue mi cumpleaños.", "¿Esto se acaba en algún momento?", "Me ha parecido ver algo ahí detrás.",
          "Este cofre es lo mejor que me ha pasado.", "¿Recuerdas cómo era todo antes?", "Un tintineo muy placentero, muy placentero.",
          "Termina con todo, rompe esas ganzúas.", "¿Qué fue lo último que dijo el Trapero?", "Si cierro los ojos veo cofres.",
          "Debí dejarlo antes.", "El Duende se lleva todo mi oro.", "Necesito cofres para tener oro y oro para abrir cofres.",
          "El Trapero oculta algo.", "Debí traerme un libro.", "Me pregunto si lloverá fuera.", "Nadie te está buscando.",
          "Mis dedos no parecen los mismos.", "¿Qué hora es?", "Falta poco.", "Qué cofres tan modernos.", "Cofres con USB.",
          "Cofres con USB y Wi-Fi.", "Siempre fui malo con las palabras.", "La decoración me ayuda.", "No se acaba este taco de post-its. ¡Qué raro!",
          "¿Recuerdas la hierba fresca bajo tus pies?", "Espero que no me rescaten pronto, todavía quedan cofres.", "¡Ah, para esto era el USB!",
          "¡Qué moderno!", "Estoy seguro de que puedo hackear este sistema.", "Necesito más oro para abrir cofres.", "Necesito más cofres para conseguir oro.",
          "Si salgo de aquí pienso comprarme un buen cofre.", "¿El duende no puede salir de su cofre?", "Al duende parece gustarle mucho el oro.",
          "Me pregunto por qué el duende no recoge él mismo el oro.", "El duende y el trapero no parecen llevarse bien.", "Hoy no le compré nada al duende y su cara cambió",
          "Nunca he visto a ese duende fuera de su cofre", "El Trapero me da miedo.", "Parece querer engañarme siempre.", "El interior de los cofres no huele bien.",
          "¿Cómo era todo antes de los cofres?", "Me gustaría saber cuantos cofres llevo abiertos"
        ],
        4: [
          "¿Qué había fuera?", "Cuesta recordarlo.", "El sonido de la cerradura es reconfortante.",
          "¿Cuántas horas han pasado?", "Las paredes respiran si miras fijo.", "No hay nada más que esto.",
          "Solo la llave y el cerrojo.", "La sala te cuida.", "No mires atrás.", "Esto es precioso.", "Aquí estoy a salvo.",
          "Solo se espera de mí que abra otro cofre.", "¿Cómo era todo fuera?", "Es como si no fuesen mis manos.", "¿Quién soy?", "¿Quién era?",
          "El Duende ahora me regala cosas. :)", "¿Si hubiese una puerta la cruzarías?", "Quédate conmigo.", "Abrir cofres es mi sitio.",
          "¿Ese cofre me mira?", "Lo peor de los cofres es que se van cuando los abres.", "El mundo es un gran cofre.", "¿Quién los ha puesto aquí?",
          "Alguien me ha susurrado: abre otro.", "Podría hacer esto ETERNAMENTE.", "Los cofres hablan entre ellos.", "¿Qué le dice un cofre de madera a uno de vapor?",
          "Me encanta el olor a cofre por la mañana.", "Creo que me estoy volviendo loco.", "Nunca me había pasado.", "¿Es siempre el mismo Duende?",
          "Mis manos no parecen mías.", "Me encanta abrir cofres con los pies.", "¿Adónde van los cofres?", "Esta sala es confortable.", "Estoy solo. Casi.",
          "Ahora soy fontanero...", "Las tuberías se me dan bien.", "¿Cuántos tipos de cofre hay?", "Me encantan esos cofres dorados.", "Las válvulas son caras, necesito cofres.",
          "¡Soy yo, el de los cofres!", "Mamma mía.", "Estoy SEGURO de que alguien me ha robado un cofre.", "Mi tesoro.",
          "Mi ganzúa Wilson se ha enfadado conmigo.", "Wilson no me habla.", "Si Wilson se rompiese... no quiero pensarlo.", "Hoy Wilson ha estado brillante.",
          "Wilson es la mejor ganzúa, tiene muy buenas ocurrencias.", "Wilson es una ganzúa especial, hoy la pillé absorta mirando un cofre de vapor.",
          "A veces Wilson es insoportable.", "No necesito dormir.", "No recuerdo el hambre.", "NECESITO escuchar ese clic o...", "¿Quién ha tocado mis cosas?",
          "¿Hay alguna forma de saber cuantos cofres he abierto ya?", "El duende empieza a parecer enfermo por el ORO", "El Trapero parece saber más",
          "Hoy el duende dijo `ya me falta poco para tenerlo todo`.", "Me quedé mirando al duende antes de irme: contaba cada moneda", "El Trapero me dijo que iba bien.",
          "Necesito más ORO para el Duende", "El duende me está regalando cosas..."
        ],
        5: [
          "Sabíamos que llegarías.", "Gracias por continuar.", "El siguiente también lo abrirás.",
          "Ya no hay prisa alguna.", "La sala siempre fue tu sitio.", "Abre. Abre. Abre.",
          "El último jamás existe.", "Siempre queda uno más.", "Aquí nunca llego tarde.",
          "Aquí no puedo decepcionar a nadie.", "Wilson, ya no pintas nada aquí.", "Siento paz.",
          "¿Tú también te sientes bien?", "Los cofres no se terminan. Esa es la mejor parte.",
          "Cofres, cofres, cofres...", "Clic, clic, clic...", "Nunca me iré de aquí. Espero.",
          "Nada importaba.", "Siempre fue todo sobre los cofres.", "¡Diversión infinita!",
          "No saben lo que se pierden.", "Ven con nosotros.", "Cofre cerrado, cofre que abro.",
          "Estoy conectado al cofreverso.", "Este sitio es lo mejor.", "...", "...", "...otro",
          "...cofre.", "Clic.", "No tengas prisa.", "Praise the chest.", "¡Eh, más oro!",
          "Me siento como si flotara.", "Qué afortunado soy.", "¡Nunca se acaban!",
          "Valió la pena llegar hasta aquí."
        ]
      },

      BUCLE_2: {
        1: [
          "Buen trabajo.", "El siguiente puede ser mejor.", "No parece tan difícil.", "Solo uno más (mentira)",
          "Una cerradura limpia.", "Sigue probando.", "Cuestión de ritmo.", "Curioso.",
          "Estas ganzúas son de calidad.", "Es mi primera vez...creo.", "Ese clic es hermoso.", "Valioso taco de post-its.",
          "Guau.", "¿Se te da bien?", "Una cerradura como las de antes.", "Nunca había abierto uno antes, ¿o sí?.", "La satisfacción del trabajo bien hecho.", "Valdrá la pena seguir.",
          "Ese Trapero me hiela la sangre.", "¿Un duende con una tienda en un cofre?", "Hay cofres diferentes.", "Las ganzúas no se rompen si lo haces bien.", "Espero no volver a ver a ese tipo oscuro.",
          "¡Qué tipo tan siniestro!", "El duende me ha ayudado mucho.", "Necesito ver otra vez al duende.", "Se te da bien.", "Ojalá ese duende vendiese chuches.",
          "Easy.", "No hay muchos cofres de donde yo vengo", "password:46872398", "Nunca había visto un duende", "Ese Trapero...no sé.", "Estas ganzúas resisten, si lo hago bien",
          "Abrí ese cofre de metal y el pin se echó a perder", "Estoy en racha!", "Ah allá vamos de nuevo", "Esto es extrañamente familiar", "Nadie hace caso a los post-its",
          "Debes aprender de los post-its", "Todo está ocurriendo de nuevo", "Dejavu", "¿He estado aquí antes?"
        ],
        2: [
          "Ya llevas unos cuantos.", "No te cuesta seguir, ¿verdad?", "Otro más tampoco cambia nada.",
          "Las manos trabajan solas.", "El tiempo vuela aquí dentro.", "Un tintineo muy satisfactorio.",
          "Casi ni piensas en ello.", "Un cofre tras otro.", "Ese sonido es guay.", "Aquí no estás seguro.",
          "Otra vez está ocurriendo LO MISMO", "¿Y si este es mi sitio?", "Sigue.", "¿Hoy es jueves?",
          "¿Hay alguien ahí?", "Húmedo y oscuro.", "No tengo ni que pensarlo.", "Parece que lo llevas haciendo toda la vida.",
          "Abrir, cobrar, abrir, cobrar...", "Los post-its",
          "El cofre es el juego.", "Esos pistones requieren mi atención.", "Es como un sueño, no puedo detenerlo",
          "¿Estoy aquí por las monedas o por los cofres?", "Los pines se gastan en cada cofre.", "Alinea esos pistones.",
          "El Trapero quiere algo de mí.", "Ese trato ha sido unfair.", "El duende tiene buenos precios.",
          "Eres un experto ya.", "No tengo ganas de dejarlo.", "Como el río hacia la mar",
          "Puedo dejarlo cuando quiera.", "Quizás haya oro en el siguiente cofre.", "Ese duende ama el oro más que yo los cofres.", "El duende tiene objetos muy útiles.",
          "Señor Trapero, Mal Agüero", "Mister Duende, todo por el cliente", "Esos dos necesitan mejor marketing.", "Debería saber cuantos cofre llevo ya.",
          "Duende y Trapero, expertos usureros", "Los cofres esconden algo", "Dentro de los cofres a veces hay objetos.", "Estos objetos decoran la habitación.",
          "Nunca acierto a la primera al meter el USB", "Siempre se me dió bien la informática.", "El Taller de Reciclaje es una buena forma de no quedarme sin lo que necesito.",
          "Todo se repite, todo", "Tristes alas del destino"
        ],
        3: [
          "¿Por qué empezaste otra vez?", "¿Recuerdas la anterior vez?", "Abre otro.", "Ya descansarás después.",
          "El techo parece más bajo hoy.", "Tus dedos no tiemblan, eso es bueno.",
          "Nadie te espera fuera.", "No recuerdas la puerta.", "¿Había una puerta?", "¿Cómo llegué hasta aquí?",
          "Creo que ayer fue mi cumpleaños.", "¿Esto se acaba en algún momento? ¿O vuelve a empezar?", "Soy yo, o era yo",
          "Este cofre es lo mejor que me ha pasado.", "¿Recuerdas cómo era todo antes?", "Un tintineo muy placentero, muy placentero.",
          "Termina con todo, rompe esas ganzúas.", "¿Qué fue lo último que dijo el Trapero?", "Si cierro los ojos veo cofres.",
          "Debí dejarlo antes.", "El Duende se lleva todo mi oro.", "Necesito cofres para tener oro y oro para abrir cofres.",
          "El Trapero oculta algo.", "Debí traerme un libro.", "Me pregunto si lloverá fuera.", "Nadie te está buscando ya.",
          "Mis dedos no parecen los mismos.", "¿Qué hora es?", "Falta poco.", "Qué cofres tan modernos.", "Cofres con USB.",
          "Cofres con USB y Wi-Fi.", "Siempre fui malo con las palabras.", "La decoración me ayuda.", "No se acaba este taco de post-its. ¡Qué raro!",
          "¿Recuerdas la hierba fresca bajo tus pies?", "Espero que no me rescaten pronto, todavía quedan cofres.", "¡Ah, para esto era el USB!",
          "¡Qué moderno!", "Estoy seguro de que puedo hackear este sistema.", "Necesito más oro para abrir cofres.", "Necesito más cofres para conseguir oro.",
          "Si salgo de aquí pienso comprarme un buen cofre.", "¿El duende no puede salir de su cofre?", "Al duende parece gustarle mucho el oro.",
          "Me pregunto por qué el duende no recoge él mismo el oro.", "El duende y el trapero no parecen llevarse bien.", "Hoy no le compré nada al duende y su cara cambió",
          "Nunca he visto a ese duende fuera de su cofre", "El Trapero me da miedo.", "Parece querer engañarme siempre.", "El interior de los cofres no huele bien.",
          "¿Cómo era todo antes de los cofres?", "Me gustaría saber cuantos cofres llevo abiertos", "Ahora lo recuerdo...no, creo que lo soñé",
          "Si vuelvo...¿estos post-its seguirán aquí?", "El Trapero parece querer manejarlo todo", "Estoy SEGURO de que esto ya ocurrió antes"
        ],
        4: [
          "¿Qué había fuera?", "Cuesta recordarlo.", "El sonido de la cerradura es reconfortante.",
          "¿Cuántas horas han pasado? ¿días?", "No hay nada más que esto.", "Va a volver a ocurrir",
          "Solo la llave y el cerrojo.", "La sala te cuida", "No mires atrás.", "Esto es precioso.", "Aquí estoy a salvo.",
          "Solo se espera de mí que abra otro cofre.", "¿Cómo era todo fuera?", "Es como si no fuesen mis manos.", "¿Quién soy?", "¿Quién era?",
          "El Duende ahora me regala cosas. :)", "¿Si hubiese una puerta la cruzarías?", "Quédate conmigo.", "Abrir cofres es mi lugar seguro.",
          "¿Ese cofre me mira?", "Lo peor de los cofres es que se van cuando los abres.", "El mundo es un gran cofre.", "¿Quién los ha puesto aquí?",
          "Alguien me ha susurrado: abre otro.", "Podría hacer esto ETERNAMENTE.", "Los cofres hablan entre ellos.", "¿Qué le dice un cofre de madera a uno de vapor?",
          "Me encanta el olor a cofre por la mañana.", "Creo que me estoy volviendo loco.", "Nunca me había pasado. Y sin embargo...", "¿Es siempre el mismo Duende?",
          "Mis manos no parecen mías.", "Me encanta abrir cofres con los pies.", "¿Adónde van los cofres?", "Esta sala es confortable.", "Estoy solo. Casi.",
          "Ahora soy fontanero...", "Las tuberías se me dan bien.", "¿Cuántos tipos de cofre hay?", "Me encantan esos cofres dorados.", "Las válvulas son caras, necesito cofres.",
          "¡Soy yo, el de los cofres!", "Mamma mía.", "Estoy SEGURO de que alguien me ha robado un cofre.", "Mi tesoro.",
          "Mi ganzúa Wilson se ha enfadado conmigo.", "Wilson no me habla.", "Si Wilson se rompiese... no quiero pensarlo.", "Hoy Wilson ha estado brillante.",
          "Wilson es la mejor ganzúa, tiene muy buenas ocurrencias.", "Wilson es una ganzúa especial, hoy la pillé absorta mirando un cofre de vapor.",
          "A veces Wilson es insoportable.", "No necesito dormir.", "No recuerdo el hambre.", "NECESITO escuchar ese clic o...", "¿Quién ha tocado mis cosas?",
          "¿Hay alguna forma de saber cuantos cofres he abierto ya?", "El duende empieza a parecer enfermo por el ORO", "El Trapero parece saber más",
          "Hoy el duende dijo `ya me falta poco para tenerlo todo`.", "Me quedé mirando al duende antes de irme: contaba cada moneda", "El Trapero me dijo que iba bien.",
          "Necesito más ORO para el Duende", "El duende me está regalando cosas...", "He visto al duende a los ojos y esa mirada la he visto antes.",
          "El Trapero parece calcular cada palabra.", "Va a volver a pasar, lo recuerdo, no lo recuerdo, pero...", "El Trapero me ha visto escribir y se ha reído de mi",
          "¿Es esto un bucle?"
        ],
        5: [
          "La sala siempre fue tu sitio.", "Abre. Abre. Abre.",
          "El último jamás existe.", "Siempre queda uno más.", "Está pasando...otra vez",
          "Wilson, ya no pintas nada aquí.", "Siento paz, pero es mentira",
          "¿Tú también te sientes bien?", "Los cofres no se terminan. Esa es la mejor parte.",
          "Cofres, cofres, cofres...", "Clic, clic, clic...", "Nunca me iré de aquí. Espero.",
          "Nada importaba.", "Siempre fue todo sobre los cofres.", "¡Diversión infinita!",
          "No saben lo que se pierden.", "Cofre cerrado, cofre que abro.",
          "Estoy conectado al cofreverso.", "Este sitio es lo mejor.",
          "...cofre.", "Clic.", "No tengas prisa.", "Praise the chest.", "¡Eh, más oro!",
          "Me siento como si flotara.", "Qué afortunado soy.", "¡Nunca se acaban!",
          "Valió la pena llegar hasta aquí.", "No quiero empezar de nuevo", "Tengo que estar atento la próxima vez.",
          "Tiene que haber una manera de romper el bucle", "Sabía lo que el Trapero me iba a decir, de alguna manera"
        ]
      }
    },

    // [0.087] Mensajes del Trapero cuando se acaba una maldición (se elige uno al azar, sea cual sea el tier)
    // [0.090] El Trapero al quedarte sin recursos: la primera vez explica qué pasa; después, variantes cortas (editables)
    TRAPERO_GAME_OVER: {
      PRIMERA: [   // [0.092] primera vez: una de estas tres al azar (tono críptico, sin lenguaje de comercio)
        "Sin llaves, el cofre no se abre. Pero la sala aún te necesita... y yo conozco un camino. Tiene un precio: la maldición te acompañará unos cofres. {sonrisa}",
        "Qué pronto vacías las manos. Yo puedo devolverte lo que la sala te quitó. Nada es gratis aquí: algo oscuro te seguirá unos cofres. {conspira}",
        "Aquí nada termina de verdad. Acepta mi trato y sigue. A cambio, la maldición se queda contigo unos cofres. {sonrisa}"
      ],
      OTRAS: [
        "Otra vez con las manos vacías. Sabía que volverías. Mismo precio, misma maldición. {conspira}",
        "Se acabaron las llaves, y se acaba el juego. A no ser que me dejes ayudarte... otra vez. {codicia}",
        "No me mires así. Yo no te empujé al borde: solo te proporciono la cuerda y ya está. ¿Seguimos? {sonrisa}"
      ]
    },

    TRAPERO_FIN_MALDICION: [
      "La maldición se ha ido. Todo se acaba... salvo lo que tú no sueltas. {sonrisa}",
      "Tus hombros pesan menos. No me des las gracias: volverás a cargar algo peor. {conspira}",
      "Libre de la losa... por ahora. ¿Cuánto tardarás en pedirme otra? {trato}"
    ],

    DUENDE_TIENDA_FRASES: {
      1: [
        "¡Bienvenido! Echa un ojo a mis herramientas de madera y ganzúas. {saludo}",
        "El oro guardado no abre cofres. ¡Echa un vistazo a la mercancía! {picardia}",
        "Tengo justo lo que necesitas para no quedarte atrancado hoy. {alegre}",
        "¡Qué bien verte por aquí! Si necesitas cualquier cosa aquí estaré. {saludo}"
      ],
      2: [
        "¡Cosas de acero para manos expertas! Mira mis nuevos precios. {alegre}",
        "¿Monedas por herramientas? El trato de siempre, sin engaños. {conciliador}",
        "Veo que le vas cogiendo el truco. Pasa y compra algo de calidad. {alegre}",
        "El Trapero no debería estar aquí. Céntrate en mi tienda. {sospechoso}",
        "Echa un ojo al Taller de Reciclaje, está abierto ahora {saludo}"
      ],
      3: [
        "Cosas modernas para cofres digitales. Sin TRUCOS. {sospechoso}",
        "El oro vuela aquí dentro, ¿tienes más? {codicia}",
        "¿Que por qué no abro yo los cofres y cojo el Oro? No deberías hacer esas preguntas. {enfadado}",
        "¿Has traído más oro? Necesit... te ofrezco los mejores productos. {codicia}",
        "¿Si nunca salgo de mi cofre? Calla y compra, amigo. {enfadado}",
        "Así que has hecho tratos con el Trapero, ¿eh? Tú mismo, ¿has traído oro? {sospechoso}",
        "Las válvulas son caras, pero quedarse atascado sale más caro {conciliador}"
      ],
      4: [
        "Sigues aquí... me gusta tu fidelidad. Mira lo que me ha llegado. {picardia}",
        "Tú me das oro, yo te doy supervivencia. Me necesitas. {codicia}",
        "No preguntes de dónde saco los repuestos, dame ese reluciente ORO. {sospechoso}",
        "Parece que llevas toda la vida aquí trayéndome precioso ORO. {codicia}",
        "Chico, no toques el género si no vas a comprar, ¿vale? {enfadado}",
        "Al fin...solo tráeme un poco de oro más y podré largarme de aquí {triste}",
        "Aún queda ORO ahí fuera, humano, ¿a qué esperas? {codicia}"
      ],
      5: [
        "¡Oro, oro, oro! Tú abres, yo vendo. ¡El ciclo perfecto! {enamorado}",
        "¡Praise the chest! Pasa a la tienda y gástate lo que llevas encima. {risa}",
        "Al fin... solo tráeme un poco de oro más y podré largarme de aquí. {triste}",
        "Aún queda ORO ahí fuera, humano, ¿a qué esperas? {codicia}",
        "Ese ORO brilla como el ORO...Gástalo en mi tienda! {mareado}"
      ]
    },

    DUENDE_FRASES: {
      1: [
        "¡Casi lo tienes! Toma esto, el siguiente cofre guarda algo grande. {alegre}",
        "¡Estás cogiendo un ritmo excelente! Te regalo esto para que no pares. {saludo}",
        "¡Sigue así! Cada cofre abierto te acerca a mayores tesoros. {alegre}"
      ],
      2: [
        "¡Impresionante racha! Toma esta herramienta, te la has ganado a pulso. {alegre}",
        "¡Ni se te ocurra frenar ahora! Aquí tienes ayuda para abrir el siguiente. {alegre}",
        "¡Eso es! El sonido de los cerrojos rompiéndose es música. ¡Sigue adelante! {risa}"
      ],
      3: [
        "¡Estás imparable! Te regalo esto, demuestra de qué estás hecho. {alegre}",
        "¡Un empujoncito más! El próximo cofre puede tener mucho ORO. ¡Abre otro! {picardia}",
        "¡No aflojes ahora que estás en lo mejor! Un regalo de la casa para ti. {alegre}"
      ],
      4: [
        "¡La casa invita! Solo recuérdalo cuando quieras deshacerte de tu ORO. {picardia}",
        "¡Que nada te detenga! Te traigo supplies frescos para que continúes recolectando mi ORO. {codicia}",
        "¡Un verdadero aventurero jamás se rinde! ¡Vamos, a por más ORO! {alegre}",
        "¿El Trapero te ha regalado algo alguna vez? Tenlo en cuenta. Tu amigo el duende te cuida. {sospechoso}",
        "Toma esto, la gloria te espera tras la siguiente tapa. No te quedes todo el ORO. {conciliador}",
        "¡Abre otro! Ya queda poco, necesito un poco más de ese ORO... {codicia}"
      ],
      5: [
        "¡El tesoro definitivo está a tu alcance! No te detengas por nada. ¡AHORA NO! {ira}",
        "Toma, rápido, sigue abriendo cofres, estoy tan cerca... tan cerca... {asustado}",
        "No te quedes ahí pasmado, toma y tráeme ese ORO. {enfadado}"
      ]
    },

    DUENDE_DESBLOQUEOS: {
      nivel_2: "¡Eh, chico! A partir de ahora verás Cajas de Acero. Toma este Pin de muestra... a la primera invita la casa. {alegre}",
      nivel_3: "¡Oigo chispas al fondo! Son Arcas Digitales. Prueba esta Llave USB, a ver si logras descifrar lo que ocultan. {sorpresa}",
      nivel_5: "Huele a humo y aceite... Tuberías de vapor. Quédate con esta Válvula, presiento que la vas a necesitar muy pronto. {sospechoso}"
    },

    FRASES_CULPA_ROBO: [
      "No me está mirando... ¿verdad?",
      "Él se lo quita a otros creo, yo se lo quito a él. Es justo.",
      "Siento el ítem robado pesando en el bolsillo como si fuera de plomo.",
      "El Duende me ha mirado fijamente a las manos. Sabe algo.",
      "Cogerlo ha sido facilísimo. Demasiado fácil.",
      "Mis dedos se movieron solos antes de que pudiera pensarlo.",
      "Si me descubre, me dejará sin herramientas...",
      "Me tiemblan las manos, pero el ítem ya es mío.",
      "Un día de estos se va a dar cuenta de que falta mercancía.",
      "No es robar si él se lo encontró en un cofre, ¿no?"
    ],

    TRAPERO_FRASES: {
      1: [
        "No entiendes nada, ¿verdad? Te propongo un trato. {trato}", "La primera herramienta siempre parece gratis. {sonrisa}", "Mis tratos no son los mejores, en apariencia. {trato}",
        "Veo que aún tienes luz en los ojos. {sonrisa}", "Guarda tu oro, pronto lo necesitarás más. {conspira}"
      ],
      2: [
        "Veo que has vuelto. {sonrisa}", "Siempre vuelven. {sonrisa}", "No confíes demasiado en el Duende. {conspira}",
        "Él te vende la llave, yo te vendo la esperanza. {trato}", "Tengo tratos que no figuran en ningún libro. {conspira}"
      ],
      3: [
        "Ya llevas demasiados. {alerta}", "Empiezas a parecerte a los otros. {alerta}", "No me gusta esa mirada. {amenaza}",
        "El vicio del cerrojo te tiene atrapado. {base}", "Acepta una maldición, total... ¿qué tienes que perder? {sonrisa}",
        "Aún estás a tiempo. {triste}", "¿Por qué el duende no recoge él mismo el oro? Piénsalo. {conspira}", "Todo el mundo quiere salir de aquí, de lo contrario has perdido. {base}"
      ],
      4: [
        "Voy a contarte algo. Yo también abría cofres. {triste}", "Creía que podía parar cuando quisiera. {triste}",
        "Ahora solo me quedan trozos de herramientas y tratos leoninos. {triste}", "No mires los cofres como un objetivo. {alerta}", "Si no quieres salir, te convertirás en otro. {amenaza}",
        "Creo que ya es demasiado tarde, pero aún puedes volver atrás. {triste}", "Aquí solo puede salir uno cada vez. Te lo advertí. {alerta}"
      ],
      5: [
        "Escúchame. {alerta}", "Todavía puede haber una salida. {conspira}", "La única forma es volver al principio. {alerta}",
        "Solo puede salir uno, no dejes que sea el Duende. {conspira}", "Hay que romper el ciclo. {alerta}", "Nunca eres rico si portas la losa de la CODICIA. {amenaza}"
      ]
    },

    PENSAMIENTOS_COFRE_SUSURRANTE: [
      "Siento que este cofre ya lo he abierto cien veces...",
      "Tiene tierra fresca bajo la bisagra. ¿De dónde sale?",
      "¿Es el mismo cofre siempre?...",
      "Esta llave encaja demasiado bien. Como si estuviera hecha para mí.",
      "No quiero mirar lo que hay dentro, pero no puedo parar."
    ],

    // 🟢 SECUENCIA NARRATIVA DE LA HISTORIA (COFRES 79 AL 90)
    HISTORIA_SECUENCIA: {
      COFRE_79_TRAPERO: "Aún hay una manera, pero debes hacerme caso. {conspira}",
      COFRE_84_TRAPERO: "La próxima vez no le compres NADA al Duende. Es la ÚNICA forma. {alerta}",
      COFRE_85_DUENDE: "¡Bienvenido! Echa un ojo a mi mercancía... {alegre}",
      COFRE_86_TRAPERO: "¿Es que la codicia te ciega? Aún tienes UNA ÚLTIMA oportunidad... {amenaza}",
      COFRE_87_TRAPERO: "Sigue así. No le des el ORO. {conspira}",
      COFRE_88_DUENDE: "No escuches a ese maldito Trapero... {enfadado}",
      COFRE_89_TRAPERO_CONDENA: "Tu codicia te ha condenado. Disfruta de tu prisión de cofres eterna. {amenaza}",
      COFRE_89_TRAPERO_PRECLIMAX: "Ya casi lo tienes, está fuera de sí. NO COMPRES. {alerta}",
      COFRE_90_DUENDE: "Por favor, te haré descuento, pero tienes que traerme ese ORO... {asustado}"
    },

    // 🟢 REACCIONES DEL DUENDE AL ELEGIR "NO COMPRAR NADA"
    REACCIONES_DUENDE_NO_COMPRAR: {
      85: "¡No seas tacaño! Necesito ese ORO... {enfadado}",
      88: "Maldito seas, estoy viendo tu ORO... ¡dame ese ORO! {ira}",
      90: "¡No sabes lo que estás haciendo, NO TIENES NI IDEA! {ira}",
      DEFAULT: "¡Tacaño! ¡El ORO es para gastar! {enfadado}",
      COMPRA_EXITOSA: "¡Sí! ¡Eso es! Dame más de tu precioso ORO... {enamorado}"
    },

    // 🟢 FRASES DE RECIBO DE LA TIENDA DEL DUENDE
    FRASES_RECIBO_DUENDE: {
      DEFAULT: "«¡Buena elección! Esas herramientas te mantendrán con vida un rato más.»",
      ALTO_ORO: "«¡Un placer hacer negocios! Vuelve pronto con más de ese reluciente ORO...»",
      SOLO_RECICLAJE: "«Veo que aprovechas todo el metal viejo. ¡Así se economiza en la mazmorra!»",
      CONTADOR_RESPUESTA: "¿Y para qué quieres saber eso? Nunca se acaban... {sospechoso}",
      // [0.087b] Frases de la factura según tier narrativo (se elige una al azar). ALTO_ORO y SOLO_RECICLAJE siguen mandando cuando se cumplen.
      POR_TIER: {
        1: ["«¡Buena compra! Con esto no te quedarás atascado hoy.»", "«Gracias, amigo. Vuelve cuando quieras, la tienda siempre está abierta.»", "«Todo lo que ves aquí es de primera. Cuídalo bien.»"],
        2: ["«Veo que ya sabes lo que necesitas. Así da gusto.»", "«Esto te durará un buen rato... si no tienes prisa por romperlo.»", "«Ojo con el Trapero: ese solo te vende esperanza.»"],
        3: ["«Buena elección. Aunque ya no recuerdo cuánto oro me has traído...»", "«Más herramientas, más cofres. Más cofres, más oro. ¿Ves qué bonito?»", "«No preguntes de dónde saco el género. Tú solo paga.»"],
        4: ["«Eso, eso... gasta. Que el oro está mejor en MIS manos.»", "«Cada compra me acerca un poco más a la salida...»", "«Tú abre, que yo me encargo del resto. Siempre ha sido así.»"],
        5: ["«¡Oro, oro, oro! El ciclo no se detiene.»", "«Un cofre más. Solo uno más. Siempre uno más.»", "«Gracias, gracias... no mires atrás, humano.»"]
      }
    },

    // 🟢 MENSAJES DE TRANSICIÓN DEL ECO FINAL
    ECOS_FINALES: {
      MENSAJE_1: "Se ha ido",
      MENSAJE_2: "Volverá"
    }
  },

  // 🟢 CARTAS DE SUBIDA DE NIVEL
  CARTAS_NIVEL: {
    PASIVAS: [
      { id: "mano_firme", titulo: "MANO FIRME", tipo: "PERK", icono: "fa-hand-sparkles", desc: "+20% Margen de error en puzles." },
      { id: "ojo_cazador", titulo: "OJO DE CAZADOR", tipo: "PERK", icono: "fa-eye", desc: "+15% Probabilidad de cofres Raros y Épicos." },
      { id: "regateador", titulo: "REGATEADOR", tipo: "PERK", icono: "fa-tags", desc: "-15% en los precios del Duende (+5% por nivel)." },
      { id: "pistones_lentos", titulo: "PISTONES LENTOS", tipo: "PERK", icono: "fa-tachometer-alt", desc: "-20% Velocidad en minijuego de pistones." },
      { id: "fondo_bolsillo", titulo: "FONDO DE BOLSILLO", tipo: "PERK", icono: "fa-coins", desc: "+1 GP fijo y +15% extra en racha de aperturas." },
      { id: "hombre_tranquilo", titulo: "HOMBRE TRANQUILO", tipo: "PERK", icono: "fa-user-clock", desc: "+2 segundos en todas las aperturas.", efecto: "TIEMPO_EXTRA", valor: 2 },
      { id: "oido_clinico", titulo: "OÍDO CLÍNICO", tipo: "PERK", icono: "fa-ear-listen", desc: "Muestra la advertencia visual de Falso Punto Dulce." },
      { id: "ladron", titulo: "LADRÓN", tipo: "PERK", icono: "fa-mask", desc: "El primer ítem de la tienda del Duende es gratis.", efecto: "ROBO_TIENDA", valor: 1 },
      { id: "tipo_con_suerte", titulo: "TIPO CON SUERTE", tipo: "PERK", icono: "fa-clover", desc: "15% de probabilidad de duplicar el botín al abrir un cofre.", efecto: "PROB_DOBLE_BOTIN", valor: 0.15 },
      { id: "clasico", titulo: "CLÁSICO", tipo: "PERK", icono: "fa-box", desc: "Maestría en Madera: Bonus de botín y EXP." },
      { id: "mecanico", titulo: "MECÁNICO", tipo: "PERK", icono: "fa-cogs", desc: "Maestría en Acero: Bonus de botín y EXP." },
      { id: "informatico", titulo: "INFORMÁTICO", tipo: "PERK", icono: "fa-microchip", desc: "Maestría en Digital: Bonus de botín y EXP." },
      { id: "fontanero", titulo: "FONTANERO", tipo: "PERK", icono: "fa-faucet", desc: "Maestría en Vapor: Bonus de botín y EXP." }
    ],

    TACTICAS: [
      { id: "auto_open", titulo: "AUTO-OPEN", tipo: "TÁCTICO", icono: "fa-wand-magic-sparkles", desc: "Abre un cofre al instante sin puzle." },
      { id: "doble_2x", titulo: "DOBLE 2X", tipo: "TÁCTICO", icono: "fa-bolt", desc: "Multiplica x2 el botín del próximo cofre." },
      { id: "escudo", titulo: "ESCUDO PROTECTOR", tipo: "TÁCTICO", icono: "fa-shield-halved", desc: "Protege tus herramientas contra 1 fallo." },
      { id: "apuesta_riesgo", titulo: "DOBLE O NADA", tipo: "TÁCTICO", icono: "fa-dice", desc: "Acumula ganancias exponenciales por racha.", efecto: "MODO_BOTE_RIESGO", valor: 0.50 },
      { id: "carta_perdedor", titulo: "PERDEDOR", tipo: "TÁCTICO", icono: "fa-skull-crossbones", desc: "Tras 5 fallos (seguidos o no), el botín del siguiente cofre será Legendario x2.", efecto: "RACHA_FALLOS_LEGENDARIA", valor: 5 },
      { id: "invocar_duende", titulo: "INVOCA AL DUENDE", tipo: "TÁCTICO", icono: "fa-hat-wizard", desc: "Invoca al Duende de inmediato para abrir su tienda.", efecto: "INVOCAR_TIENDA", valor: 1 }
    ]
  },

  // 🟢 EVENTOS ALEATORIOS (WILDCARDS)
  // [CAMBIO] Cada wildcard es UNA línea. 'efecto' + 'valor' definen qué hace (ver applyWildcard):
  //   PERDER_ORO (n) · DAR_ORO (n) · DAR_XP (n) · DAR_XP_PCT_NIVEL (fracción de la XP del nivel) · DAR_HERRAMIENTAS ({propiedad: cantidad})
  //   DAR_CARTA ({habilidad: cantidad}) · COFRES_PESADOS (n cofres) · MALDICION_CODICIA (n cofres)
  //   PUZLES_EXIGENTES (n cofres) · OTORGAR_CARTA_TACTICA_AZAR · OTORGAR_CONSUMIBLE_DOBLE_AZAR (n consumibles)
  //   PERDER_HERRAMIENTAS ({propiedad: cantidad}; nunca deja menos de 1)
  // Para añadir un wildcard nuevo que reutilice uno de estos efectos basta con añadir una línea aquí.
  // [0.093] Modificadores "game changer" de los wildcards (todo ajustable aquí). 'cofres' = duración en cofres abiertos.
  //   ESCALA_ORO_POR_NIVEL: los premios/pérdidas fijos de GP de los wildcards se multiplican por (1 + esto x (nivel-1)).
  MODS_WILDCARD: {
    ESCALA_ORO_POR_NIVEL: 0.35,
    FIEBRE_ORO:   { GP_MULT: 2, HERRAMIENTAS_EXTRA: 1 },
    HAMBRE_XP:    { XP_MULT: 2, GP_MULT: 0 },
    SOLITARIOS:   { XP_PCT: 0.5 },
    NIEBLA:       { BOTIN_PCT: 0.4 },
    RELOJ_BUENO:  { TIEMPO_MULT: 1.5 },
    RELOJ_MALO:   { TIEMPO_MULT: 0.7 },
    DESTINO_RAREZAS: ['normal', 'raro', 'epico']
  },
  WILDCARDS: [
    { id: "cofres_pesados", nombre: "Cofres Pesados", tipo: "PERJUDICIAL", desc: "Próximos 5 cofres Raros+ piden +1 herramienta extra.", efecto: "COFRES_PESADOS", valor: 5 },
    { id: "impuesto_trapero", nombre: "Impuesto del Trapero", tipo: "PERJUDICIAL", desc: "Pérdida inmediata de {10} Monedas GP.", efecto: "PERDER_ORO", valor: 10 },
    { id: "maldicion_codicia", nombre: "Maldición de la Codicia", tipo: "PERJUDICIAL", desc: "-50% GP en cofres Épicos/Legendarios durante 5 cofres.", efecto: "MALDICION_CODICIA", valor: 5 },
    { id: "dedos_torpes", nombre: "Dedos Torpes", tipo: "PERJUDICIAL", desc: "Minijuegos un 25% más exigentes durante 5 cofres.", efecto: "PUZLES_EXIGENTES", valor: 5 },
    { id: "hallazgo_sombra", nombre: "Hallazgo de Sombra", tipo: "BENEFICIOSO", desc: "Recibes +1 Ganzúa y +1 Pin de Acero gratis.", efecto: "DAR_HERRAMIENTAS", valor: { picks: 1, proPicks: 1 } },
    { id: "bono_experiencia", nombre: "Bono de Experiencia", tipo: "BENEFICIOSO", desc: "Recibes por sorpresa el 20% de la XP que exige tu nivel.", efecto: "DAR_XP_PCT_NIVEL", valor: 0.20 },
    { id: "sombra_favorable", nombre: "Sombra Favorable", tipo: "BENEFICIOSO", desc: "Obtienes +1 Carta Auto-Open inmediata.", efecto: "DAR_CARTA", valor: { auto: 1 } },
    { id: "regalo_tactico", nombre: "Hallazgo Táctico", tipo: "BENEFICIOSO", desc: "Encuentras un pergamino ajado: obtienes 1 Carta Táctica aleatoria.", efecto: "OTORGAR_CARTA_TACTICA_AZAR", valor: 1 },
    { id: "suministros_inesperados", nombre: "Suministros Inesperados", tipo: "BENEFICIOSO", desc: "Encuentras una pequeña bolsa en un rincón: obtienes x2 consumibles al azar.", efecto: "OTORGAR_CONSUMIBLE_DOBLE_AZAR", valor: 2 },
    // [0.092] Más wildcards (cada una es UNA línea; 'peso' opcional = probabilidad relativa dentro de su grupo, por defecto 1)
    { id: "bolsa_olvidada", nombre: "Bolsa Olvidada", tipo: "BENEFICIOSO", desc: "Alguien dejó una bolsa de monedas tras una piedra suelta: +{30} GP.", efecto: "DAR_ORO", valor: 30 },
    { id: "ganzuas_cortesia", nombre: "Ganzúas de Cortesía", tipo: "BENEFICIOSO", desc: "Un gancho oxidado asoma de la pared... y no está solo: +3 Ganzúas.", efecto: "DAR_HERRAMIENTAS", valor: { picks: 3 } },
    { id: "chispa_genio", nombre: "Chispa de Genio", tipo: "BENEFICIOSO", desc: "Una idea te ilumina de golpe: recibes el 35% de la XP que exige tu nivel.", efecto: "DAR_XP_PCT_NIVEL", valor: 0.35, peso: 0.5 },
    { id: "fortuna_doble", nombre: "Fortuna Doble", tipo: "BENEFICIOSO", desc: "Sientes que hoy todo vale el doble: obtienes +1 Carta Doble o Nada.", efecto: "DAR_CARTA", valor: { double: 1 } },
    { id: "escudo_prestado", nombre: "Escudo Prestado", tipo: "BENEFICIOSO", desc: "Algo invisible te cubre las espaldas: obtienes +1 Carta Escudo.", efecto: "DAR_CARTA", valor: { shield: 1 } },
    { id: "recado_duende", nombre: "Recado del Duende", tipo: "BENEFICIOSO", desc: "Un papelito arrugado con un sello conocido: obtienes +1 Carta Invoca al Duende.", efecto: "DAR_CARTA", valor: { summonDuende: 1 }, peso: 0.6 },
    { id: "peaje_sombras", nombre: "Peaje de las Sombras", tipo: "PERJUDICIAL", desc: "Algo te vacía los bolsillos al pasar: pierdes {20} GP.", efecto: "PERDER_ORO", valor: 20 },
    { id: "pulso_tembloroso", nombre: "Pulso Tembloroso", tipo: "PERJUDICIAL", desc: "Te tiemblan las manos: minijuegos un 25% más exigentes durante 3 cofres.", efecto: "PUZLES_EXIGENTES", valor: 3 },
    { id: "cerrojos_oxidados", nombre: "Cerrojos Oxidados", tipo: "PERJUDICIAL", desc: "Los cerrojos se han agarrotado: próximos 3 cofres Raros+ piden +1 herramienta extra.", efecto: "COFRES_PESADOS", valor: 3 },
    // [0.093] Game changers con duración (efecto MODIFICADOR: valor = {id, cofres}); 'minNivel' opcional
    { id: "fiebre_oro", nombre: "Fiebre del Oro", tipo: "BENEFICIOSO", desc: "Durante 8 cofres ganas el DOBLE de GP... pero cada cofre pide +1 herramienta.", efecto: "MODIFICADOR", valor: { id: "fiebre", cofres: 8 }, minNivel: 2 },
    { id: "manos_seda", nombre: "Manos de Seda", tipo: "BENEFICIOSO", desc: "Los próximos 5 fallos en un puzle NO te cuestan ninguna herramienta.", efecto: "MODIFICADOR", valor: { id: "seda", usos: 5 } },
    { id: "cofres_solitarios", nombre: "Cofres Solitarios", tipo: "BENEFICIOSO", desc: "Durante 8 cofres solo aparece 1 cofre por pantalla, pero da +50% XP.", efecto: "MODIFICADOR", valor: { id: "solitario", cofres: 8 } },
    { id: "niebla_botin", nombre: "Niebla Espesa", tipo: "BENEFICIOSO", desc: "Durante 6 cofres no ves su rareza, pero su botín es un 40% mayor.", efecto: "MODIFICADOR", valor: { id: "niebla", cofres: 6 }, minNivel: 2 },
    { id: "racha_congelada", nombre: "Racha Congelada", tipo: "BENEFICIOSO", desc: "Tus próximos 6 fallos en un puzle NO rompen tu racha.", efecto: "MODIFICADOR", valor: { id: "congelada", usos: 6 } },
    { id: "reloj_lento", nombre: "Reloj Lento", tipo: "BENEFICIOSO", desc: "Durante 6 cofres tienes un 50% más de tiempo en los puzles.", efecto: "MODIFICADOR", valor: { id: "relojBueno", cofres: 6 } },
    { id: "hambre_xp", nombre: "Hambre de XP", tipo: "BENEFICIOSO", desc: "Durante 5 cofres tu XP se DUPLICA... pero no ganas nada de GP.", efecto: "MODIFICADOR", valor: { id: "hambre", cofres: 5 }, minNivel: 2 },
    { id: "cofre_destino", nombre: "Cofre del Destino", tipo: "BENEFICIOSO", desc: "La próxima pantalla muestra 3 cofres de distinta rareza: tú eliges cuál abrir.", efecto: "MODIFICADOR", valor: { id: "destino", cofres: 1 }, minNivel: 2, peso: 0.7 },
    { id: "reloj_roto", nombre: "Reloj Roto", tipo: "PERJUDICIAL", desc: "Durante 5 cofres tienes un 30% menos de tiempo en los puzles.", efecto: "MODIFICADOR", valor: { id: "relojMalo", cofres: 5 } },
    { id: "ganzua_perdida", nombre: "Ganzúa Perdida", tipo: "PERJUDICIAL", desc: "Se te cae una ganzúa por una rendija: pierdes 1 Ganzúa (si tienes más de 1).", efecto: "PERDER_HERRAMIENTAS", valor: { picks: 1 } }
  ],

  // 🟢 TRATOS DEL TRAPERO
  TRATOS_TRAPERO: {
    INICIALES: [
      { id: "vender_ganzuas", titulo: "Vender 2 Ganzúas", desc: "+15 GP inmediatos por tus ganzúas." },
      { id: "vender_avanzada", titulo: "Vender 1 Herramienta Avanzada", desc: "+15 GP por una herramienta avanzada." },
      { id: "canje_directo", titulo: "Canje Directo", desc: "Intercambia 2 Ganzúas por 1 Pin de Acero." }
    ],
    OSCUROS: [
      { id: "purga_maldicion", titulo: "Purga de Maldición", desc: "Entrega 1 herramienta avanzada para reducir -4 turnos de Maldición." },
      { id: "contrato_leonino", titulo: "Contrato Leonino", desc: "+45 GP inmediatos, pero próximos 10 cofres cuestan +1 herramienta." },
      { id: "pacto_sangre", titulo: "Pacto de Sangre", desc: "+3 de todas las herramientas avanzadas por 12 turnos de Maldición." },
      { id: "pacto_sombra", titulo: "Pacto de la Sombra", desc: "+25% XP permanente, pero puzles más exigentes." },
      { id: "amor_arte", titulo: "Por Amor al Arte", desc: "+2 de todas las herramientas avanzadas, pero no ganas XP durante 5 turnos." },
      { id: "empujon_siniestro", titulo: "Empujón Siniestro", desc: "Reduce tus GP a 30 pero subes un nivel inmediato. (Requiere >100 GP)" },
      { id: "dedos_rotos", titulo: "Dedos Rotos", desc: "Obtén +10 Ganzúas, pero a partir de ahora se rompen al usarse." },
      { id: "cambio_trabajo", titulo: "Cambio de Trabajo", desc: "+25% XP durante 10 turnos y +35 GP, pero pierdes 1 modificación positiva al azar." },
      { id: "maestria_doble_filo", titulo: "Maestría de Doble Filo", desc: "Otorga un nivel de Maestría, pero aplica un nivel de Torpeza." }
    ]
  },

  // 🟢 DECORACIONES DE SALA
  DECORACIONES_SALA: {
    TOQUE_EXTRA_PX: 24,   // [0.091] radio de toque extra alrededor de cada adorno (antes 14)
    FILA_SUPERIOR_Y: 350,      // [0.087b] altura máx. (px) de la fila superior de adornos; la central y la inferior se reparten a igual distancia
    AMBIENTE_APAGADO_COFRES: 10, // [0.086] cofres que dura la celda a oscuras tras tocar el adorno "bombilla"
    // [0.086] Ambientes que puede dar un adorno secreto (tinte suave). 'normal' devuelve el color original.
    AMBIENTES: {
      normal:  { tinte: null },
      sepia:   { tinte: 'rgba(120,72,20,0.22)',  fondo: ['#2e1c0c', '#1a0e05', '#050200'] },
      neon:    { tinte: 'rgba(0,150,110,0.22)',  fondo: ['#022c22', '#061727', '#020617'] },
      hielo:   { tinte: 'rgba(70,130,220,0.22)', fondo: ['#0b1d33', '#08111f', '#02060d'] },
      violeta: { tinte: 'rgba(130,70,200,0.22)', fondo: ['#1f0f33', '#120a22', '#05020b'] }
    },
    AMBIENTES_AZAR: ['sepia', 'neon', 'hielo', 'violeta', 'normal', 'apagado'],
    ICONOS: [
      { nombre: "Telaraña", icono: "🕸️", sprite: "telarana" },
      { nombre: "Muñeco Maldito", icono: "🧸", sprite: "muneco" },
      { nombre: "Cráneo", icono: "💀", sprite: "craneo" },
      { nombre: "Vela Negra", icono: "🕯️", sprite: "vela" },
      { nombre: "Libro Prohibido", icono: "📕", sprite: "libro" },
      { nombre: "Reloj Roto", icono: "⌛", sprite: "reloj" },
      { nombre: "Cuervo Inmóvil", icono: "🐦‍⬛", sprite: "cuervo" },
      { nombre: "Espejo Turbio", icono: "🪞", sprite: "espejo" },
      { nombre: "Jaula Vacía", icono: "🪤", sprite: "jaula" },
      { nombre: "Grillete Oxidado", icono: "⛓️", sprite: "grillete" },
      { nombre: "Ojo Pintado", icono: "👁️", sprite: "ojo" },
      { nombre: "Pergamino Quemado", icono: "📜", sprite: "pergamino" }
    ],
    ADJETIVOS: ["frío", "ceniza", "hueco", "cobrizo", "lejano", "latido", "sombra", "eco", "polvo", "hierro", "ciego", "mudo"]
  }
};
