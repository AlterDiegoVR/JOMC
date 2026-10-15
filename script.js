// ==========================================================================
// JUST ONE MORE CHEST — script.js — VERSIÓN 0.089b
// ==========================================================================
/* ==========================================================================
   JUST ONE MORE CHEST - ARCHIVO DE CONFIGURACIÓN Y BALANCE (DATOS_JUEGO)
   ========================================================================== */

const DATOS_JUEGO = {
  // [0.088] Versión visible en pantalla (esquina inferior central) para que las capturas la incluyan
  VERSION: '0.091',

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
  GAME_OVER: { GOLPE: { DURACION_MS: 3000, SACUDIDA_PX: 16, SACUDIDA_MS: 650, CAIDA_MS: 320, ESCALONADO_MS: 90, PAUSA_PALABRAS_MS: 170 } },   // [0.091] 3 s; las letras caen escalonadas (el golpe final suena al caer la última)

  // [0.090] Ayudas de las primeras veces (por partida)
  // [0.091] Ganzúa táctil: el anillo gira la aguja de forma RELATIVA (mueves el dedo en horizontal y gira lo mismo que la barra x SENSIBILIDAD_ANILLO; <1 = más fino)
  // y avisa del punto dulce (real o falso por igual) con vibración (móvil) o un leve temblor de pantalla (PC) que crece al acercarse.
  GANZUA_TACTIL: {
    SENSIBILIDAD_ANILLO: 0.8,
    HAPTICA: { ACTIVAR: true, ZONA_GRADOS: 35, PERIODO_MS: 110, ON_MIN_MS: 6, CURVA: 1.6, TEMBLOR_PX_MIN: 0.6, TEMBLOR_PX_MAX: 3.2 }
  },
  AYUDAS: { GANZUA_TACTIL: { VECES: 3, ANILLO: 'ARRASTRA EL ANILLO', CENTRO: 'MANTÉN EL CENTRO' }, PISTONES_TOQUE: { VECES: 3, TEXTO: 'También puedes tocar cualquier punto de la pantalla para fijar el pistón.' } },

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
  ZUMBIDO_LEGENDARIO: { ACTIVAR: true, VOLUMEN: 0.04, FUNDIDO_S: 1.0, BASE_HZ: 2300, BATIDO_HZ: 3.5, TREMOLO_HZ: 1.7, TREMOLO_PROFUNDIDAD: 0.45, CORTE_HZ: 5200 },   // [0.091] zumbido agudo continuo (más agudo que una flauta) con temblor lento de volumen y leve batido entre dos tonos

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
      perdedor: "Carta PERDEDOR: al acumular 5 fallos (aunque no sean seguidos), el botín de tu siguiente cofre abierto será Legendario x2.",
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
        CONFIG_POR_RAREZA: {
          raro: { size: 4, obstacles: 0, bombs: 1 },
          epico: { size: 4, obstacles: 1, bombs: 1 },
          legendario: { size: 4, obstacles: 0, bombs: 2 }
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
      PRIMERA: "Sin llaves no hay cofre. Pero yo no dejo marchar a un buen cliente con las manos vacías: te doy lo que necesitas, y la maldición se queda contigo unos cuantos cofres. {sonrisa}",
      OTRAS: [
        "Otra vez con las manos vacías. Sabía que volverías. Mismo precio, misma maldición. {conspira}",
        "Se acabaron las llaves, y se acaba el juego. A no ser que me dejes ayudarte... otra vez. {codicia}",
        "No me mires así. Yo no te empujé al borde: solo vendo la cuerda. ¿Seguimos? {sonrisa}"
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
      { id: "carta_perdedor", titulo: "PERDEDOR", tipo: "TÁCTICO", icono: "fa-skull-crossbones", desc: "Al activarla te da un empujón si la partida va mal: tras acumular 5 fallos (aunque no sean seguidos), el botín (GP y XP) del siguiente cofre que abras será Legendario x2. Después se agota.", efecto: "RACHA_FALLOS_LEGENDARIA", valor: 5 },
      { id: "invocar_duende", titulo: "INVOCA AL DUENDE", tipo: "TÁCTICO", icono: "fa-hat-wizard", desc: "Invoca al Duende de inmediato para abrir su tienda.", efecto: "INVOCAR_TIENDA", valor: 1 }
    ]
  },

  // 🟢 EVENTOS ALEATORIOS (WILDCARDS)
  // [CAMBIO] Cada wildcard es UNA línea. 'efecto' + 'valor' definen qué hace (ver applyWildcard):
  //   PERDER_ORO (n) · DAR_ORO (n) · DAR_XP (n) · DAR_XP_PCT_NIVEL (fracción de la XP del nivel) · DAR_HERRAMIENTAS ({propiedad: cantidad})
  //   DAR_CARTA ({habilidad: cantidad}) · COFRES_PESADOS (n cofres) · MALDICION_CODICIA (n cofres)
  //   PUZLES_EXIGENTES (n cofres) · OTORGAR_CARTA_TACTICA_AZAR · OTORGAR_CONSUMIBLE_DOBLE_AZAR (n consumibles)
  // Para añadir un wildcard nuevo que reutilice uno de estos efectos basta con añadir una línea aquí.
  WILDCARDS: [
    { id: "cofres_pesados", nombre: "Cofres Pesados", tipo: "PERJUDICIAL", desc: "Próximos 5 cofres Raros+ piden +1 herramienta extra.", efecto: "COFRES_PESADOS", valor: 5 },
    { id: "impuesto_trapero", nombre: "Impuesto del Trapero", tipo: "PERJUDICIAL", desc: "Pérdida inmediata de 10 Monedas GP.", efecto: "PERDER_ORO", valor: 10 },
    { id: "maldicion_codicia", nombre: "Maldición de la Codicia", tipo: "PERJUDICIAL", desc: "-50% GP en cofres Épicos/Legendarios durante 5 cofres.", efecto: "MALDICION_CODICIA", valor: 5 },
    { id: "dedos_torpes", nombre: "Dedos Torpes", tipo: "PERJUDICIAL", desc: "Minijuegos un 25% más exigentes durante 5 cofres.", efecto: "PUZLES_EXIGENTES", valor: 5 },
    { id: "hallazgo_sombra", nombre: "Hallazgo de Sombra", tipo: "BENEFICIOSO", desc: "Recibes +1 Ganzúa y +1 Pin de Acero gratis.", efecto: "DAR_HERRAMIENTAS", valor: { picks: 1, proPicks: 1 } },
    { id: "bono_experiencia", nombre: "Bono de Experiencia", tipo: "BENEFICIOSO", desc: "Recibes por sorpresa el 20% de la XP que exige tu nivel.", efecto: "DAR_XP_PCT_NIVEL", valor: 0.20 },
    { id: "sombra_favorable", nombre: "Sombra Favorable", tipo: "BENEFICIOSO", desc: "Obtienes +1 Carta Auto-Open inmediata.", efecto: "DAR_CARTA", valor: { auto: 1 } },
    { id: "regalo_tactico", nombre: "Hallazgo Táctico", tipo: "BENEFICIOSO", desc: "Encuentras un pergamino ajado: obtienes 1 Carta Táctica aleatoria.", efecto: "OTORGAR_CARTA_TACTICA_AZAR", valor: 1 },
    { id: "suministros_inesperados", nombre: "Suministros Inesperados", tipo: "BENEFICIOSO", desc: "Encuentras una pequeña bolsa en un rincón: obtienes x2 consumibles al azar.", efecto: "OTORGAR_CONSUMIBLE_DOBLE_AZAR", valor: 2 }
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

/* ==========================================================================
   MOTOR PRINCIPAL Y LÓGICA DEL JUEGO
   ========================================================================== */

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
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
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
    else { this._tone(170, 270, 0.1, 'triangle', 0.14); this._noise(0.03, 0.08, 0, 2500); }
  }
  // Abrir (segundo toque / único cofre / botón): sonido más grave y "resolutivo"
  playLockOpen(typeId) {
    if (!this.ctx || this.muted) return;
    if (typeId === 'piston') { this._tone(320, 110, 0.16, 'square', 0.1); this._tone(1250, 900, 0.22, 'triangle', 0.06, 0.03); this._noise(0.04, 0.08, 0, 2000); }
    else if (typeId === 'cyber') { [660, 880, 1320].forEach((f, i) => this._tone(f, f * 1.01, 0.11, 'triangle', 0.3, i * 0.06)); }
    else if (typeId === 'hydraulic') { this._noise(0.3, 0.1, 0, 900); this._tone(95, 55, 0.28, 'sawtooth', 0.08); }
    else {   // [0.090] madera: vuelve el "barril" de la 0.089 (el ajuste de la 0.089b se descartó)
      this._tone(150, 62, 0.14, 'sine', 0.2); this._noise(0.05, 0.1, 0, 1500); this._tone(300, 180, 0.06, 'triangle', 0.08, 0.04);
    }
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
  // [0.091] Zumbido legendario: tono agudo continuo (dos osciladores casi iguales, que "baten" levemente) con un temblor lento de volumen.
  setLegendHum(on, cfg) {
    if (!this.ctx) return;
    const c = this.ctx;
    if (!this._hum && on) {
      const g = c.createGain(); g.gain.value = 0;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cfg.CORTE_HZ || 5200; lp.Q.value = 0.7;
      const depth = Math.max(0, Math.min(0.95, cfg.TREMOLO_PROFUNDIDAD != null ? cfg.TREMOLO_PROFUNDIDAD : 0.45));
      const trem = c.createGain(); trem.gain.value = 1 - depth / 2;
      const lfo = c.createOscillator(), lfoG = c.createGain();
      lfo.frequency.value = cfg.TREMOLO_HZ || 1.7; lfoG.gain.value = depth / 2; lfo.connect(lfoG); lfoG.connect(trem.gain); lfo.start();
      const f0 = cfg.BASE_HZ || 2300;
      const o1 = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain();
      o1.type = 'sine'; o2.type = 'triangle'; o1.frequency.value = f0; o2.frequency.value = f0 + (cfg.BATIDO_HZ != null ? cfg.BATIDO_HZ : 3.5);
      g2.gain.value = 0.5; o1.connect(trem); o2.connect(g2); g2.connect(trem); trem.connect(lp); lp.connect(g); g.connect(this.master || c.destination);
      o1.start(); o2.start();
      this._hum = { g };
    }
    const h = this._hum; if (!h) return;
    const vol = (!on || this.muted) ? 0 : (cfg.VOLUMEN || 0.04);
    h.g.gain.setTargetAtTime(vol, c.currentTime, (cfg.FUNDIDO_S || 1) / 3);
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
  playGameOverStrike() {
    if (!this.ctx || this.muted) return;
    this._tone(90, 28, 0.55, 'sine', 0.35);
    this._noise(0.22, 0.28, 0, 400);
    this._tone(55, 40, 1.6, 'sawtooth', 0.09, 0.05);
    [392, 370, 311].forEach((f, i) => this._tone(f, f * 0.97, 0.45, 'triangle', 0.13, 0.25 + i * 0.3));
    this._tone(233, 220, 0.9, 'sawtooth', 0.05, 0.3);
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
    [0.34, 0.41, 0.47, 0.56, 0.62].forEach((d, i) => this._tone(3200 + (i % 3) * 500, 2600 + (i % 2) * 400, 0.06, 'triangle', 0.045, d));
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
['playClick', 'playPaperRustle', 'playDecoyBuzz', 'playBreak', 'playUnlockFanfare', 'playLockCharge', 'playLockOpen', 'playGameOver', 'playDarkOut', 'playLightOn', 'playDecorTap', 'playKeyPickup', 'playKeySpend', 'playCardBeep', 'playCashRegister', 'playCurseStart', 'playCurseEnd', 'playDialogueMelody', 'playIntro', 'playDuendeAngry', 'playSwoosh', 'playGameOverStrike'].forEach(n => {
  const f = AudioEngine.prototype[n];
  AudioEngine.prototype[n] = function (...a) { this.lastSound = performance.now(); return f.apply(this, a); };
});
// [0.090] Categorías de volumen: los sonidos pequeños (clics, avisos) y los de botín pasan por su bus, con volumen distinto en escritorio y móvil
[[ 'busSmall', ['playClick', 'playUiClick', 'playDecoyBuzz', 'playPaperRustle', 'playLockCharge', 'playDecorTap', 'playCardBeep', 'playKeyPickup', 'playKeySpend', 'playSwoosh'] ],
 [ 'busLoot', ['playUnlockFanfare', 'playCashRegister'] ]].forEach(([bus, names]) => names.forEach(n => {
  const f = AudioEngine.prototype[n];
  AudioEngine.prototype[n] = function (...a) { const prev = this._bus; this._bus = this[bus] || null; try { return f.apply(this, a); } finally { this._bus = prev; } };
}));
window.addEventListener('resize', () => { try { audio.applyProfile(); } catch (e) {} });

function getXpForLevel(lvl) {
  const baseMap = DATOS_JUEGO.PROGRESIÓN.XP_BASE_NIVELES;
  if (baseMap[lvl]) return baseMap[lvl];
  return Math.floor(baseMap[5] * Math.pow(DATOS_JUEGO.PROGRESIÓN.XP_MULTIPLICADOR_POST_5, lvl - 5));
}

const STATE = {
  currentLoop: 1, // Control de Bucle (1 o 2)
  level: DATOS_JUEGO.CONFIG_INICIAL.NIVEL,
  xp: 0,
  xpNext: getXpForLevel(DATOS_JUEGO.CONFIG_INICIAL.NIVEL),
  gold: DATOS_JUEGO.CONFIG_INICIAL.ORO,
  chestsOpened: 0,
  chestsAtLevelUp: 0,
  chestCounterUnlocked: false,
  cleanStreak: 0,
  paranoiaStage: 0,
  traperoVisits: 0,
  lastTraperoChest: 0,

  eventQueue: [],
  
  salvageDealsCount: 0,
  salvageCurseActive: false,

  picks: DATOS_JUEGO.CONFIG_INICIAL.GANZUAS,
  proPicks: DATOS_JUEGO.CONFIG_INICIAL.PINES,
  usb: DATOS_JUEGO.CONFIG_INICIAL.USB,
  valves: DATOS_JUEGO.CONFIG_INICIAL.VALVULAS,

  noXpChestsLeft: 0,
  picksBrokenOnUse: false,
  tanteoExplainedLoop: 0,   // [0.082] bucle en el que el Trapero ya explicó la penalización por tanteo
  pendingTanteoPhrase: null, // [0.082] frase del Trapero pendiente de mostrarse al recoger el botín
  xpBoostChestsLeft: 0,
  torpezas: {
    madera: 0,
    acero: 0,
    digital: 0,
    vapor: 0
  },

  seqStage: 0,
  traperoStrikes: 0,
  boughtInCurrentShop: false,
  climaxPhase: false,
  sequenceBroken: false,

  shopSession: null,
  currentShopOffer: null,

  perks: {
    sweetSpot: 0,
    rarityBonus: 0,
    discount: 0,
    slowerPistons: 0,
    goldStreak: 0,
    extraTime: 0,
    oidoClinico: 0,
    shopStealFree: false,
    luckyLootChance: 0,
    bonusMadera: 0,
    bonusAcero: 0,
    bonusDigital: 0,
    bonusVapor: 0
  },

  abilities: { auto: 0, double: 0, shield: 0, reveal: 0, riskPot: 0, perdedor: 0, summonDuende: 0 },
  active2XMultiplier: false,
  activeShield: false,
  
  riskModeActive: false,
  riskPot: 0,

  perdedorActive: false,
  perdedorLootPending: false,   // [0.085] el siguiente cofre abierto da botín (XP y GP) legendario x2
  fallosConsecutivos: 0,

  heavyChestsLeft: 0,
  greedCurseLeft: 0,
  harderPuzzlesLeft: 0,
  traperoBuffs: { bonusXp: false, harderMinigames: false, shortPipeTimer: false, doubleGold: false },
  cursedChestsLeft: 0,

  screenChests: [],
  activeChestIdx: 0,
  roomDecorations: [],
  roomThemeFilter: 'normal',
  stats: null,   // [0.090] estadísticas de la partida actual (se guardan con la partida)
  hintUses: {},   // [0.090] veces que se ha mostrado cada ayuda de las primeras veces (por partida)
  acceptDelayUses: {},   // [0.089b] veces que se ha retardado el botón Aceptar, por tipo de mensaje (por partida)
  opensByType: {},   // [0.087] cofres abiertos con éxito por tipo (para la flecha del cerrojo)
  roomDarkUntil: 0   // [0.086] la celda está a oscuras mientras chestsOpened < roomDarkUntil
};

// 🟢 CANDADO GLOBAL ANTI-DUPLICACIÓN DE BOTÍN
let isLootProcessing = false;

const CHEST_RARITIES = [
  { id: 'normal', name: 'NORMAL', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.normal, border: 'border-slate-600', color: '#94a3b8' },
  { id: 'raro', name: 'RARO', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.raro, border: 'border-blue-500', color: '#3b82f6' },
  { id: 'epico', name: 'ÉPICO', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.epico, border: 'border-purple-500', color: '#a855f7' },
  { id: 'legendario', name: 'LEGENDARIO', multiplier: DATOS_JUEGO.ECONOMIA.MULTIPLICADORES_RAREZA.legendario, border: 'border-amber-500', color: '#f59e0b' }
];

function getMasteryTorpezaPct(level) {
  if (!level || level <= 0) return 0;
  const base = DATOS_JUEGO.ECONOMIA.PORCENTAJE_MAESTRIA_TORPEZA_BASE;
  const inc = DATOS_JUEGO.ECONOMIA.INCREMENTO_MAESTRIA_TORPEZA_POR_NIVEL;
  return base + ((level - 1) * inc);
}

function getNarrativeTier() {
  const co = STATE.chestsOpened;
  const umbrales = DATOS_JUEGO.NARRATIVA.UMBRALES_TIERS;
  if (co <= umbrales.tier_1) return 1;
  if (co <= umbrales.tier_2) return 2;
  if (co <= umbrales.tier_3) return 3;
  if (co <= umbrales.tier_4) return 4;
  return 5;
}

function processNextQueuedEvent() {
  if (STATE.eventQueue.length > 0) {
    const nextEvent = STATE.eventQueue.shift();
    setTimeout(() => nextEvent(), 250);
  }
}

/* ==========================================================================
   [CAMBIO] SISTEMAS AÑADIDOS EN ESTA VERSIÓN
   Estado de minijuego, banner, Regateador, silencio, wildcards, guardado y
   confirmación de reinicio. Todo vive en el JS (no exige tocar HTML ni CSS).
   ========================================================================== */

// Estado de ejecución (no se guarda)
let minigameInProgress = false;
let specialShopOpen = false;

// El banner de feedback cuelga del marco de juego (#gameFrame) para quedar por encima de los modales
(function relocateFeedbackBanner() {
  const banner = document.getElementById('persistentFeedbackBanner');
  if (banner && banner.parentElement !== uiHost()) uiHost().appendChild(banner);
})();

/* ---------- Regateador: 15% base + 5% por nivel, con precio mínimo ---------- */
function getDiscountPct() {
  const lvl = STATE.perks.discount || 0;
  if (lvl <= 0) return 0;
  const cfg = DATOS_JUEGO.ECONOMIA.REGATEADOR;
  const maxPct = 1 - cfg.precio_minimo_pct;
  return Math.min(maxPct, cfg.base + (lvl - 1) * cfg.incremento);
}

function getDiscountMultiplier() {
  return 1 - getDiscountPct();
}

/* ---------- Botón de silencio ---------- */
function updateMuteButton() {
  const btn = document.getElementById('muteBtn');
  if (!btn) return;
  btn.innerHTML = audio.muted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';
}

(function setupMuteButton() {
  const btn = document.getElementById('muteBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    audio.applyProfile();   // [0.090] el canal vivo se apaga con el silencio
    if (!audio.muted) {
      audio.init();
      audio.playClick(0.6);
    }
    updateMuteButton();
    if (audio.muted) {
      showPersistentFeedback("🔇 El sonido forma parte de la experiencia al abrir cofres: te recomendamos jugar con él activado.");
    }
    scheduleSave();
  });
})();

/* ---------- Minijuegos: cierre limpio y abandono ---------- */
function hideAllMinigameUI() {
  stopMinigameTimer();
  lpState.isTension = false;
  if (tumblerAnimationFrameId) {
    cancelAnimationFrame(tumblerAnimationFrameId);
    tumblerAnimationFrameId = null;
  }
  const minigameModal = document.getElementById('minigameModal');
  if (minigameModal) minigameModal.classList.add('hidden');
  ['lockpickContainer', 'tumblerContainer', 'hackContainer', 'pipeContainer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

// [0.084] ¿El puzle en curso es la cerradura trampa (cofre troll) de madera?
function isTrapLockpickActive() {
  const active = STATE.screenChests[STATE.activeChestIdx];
  return !!(active && active.type.juego === 'lockpick' && lpState.isTrapChest);
}

// La X de los puzles cuenta como fallo: cobra la herramienta (en la ganzúa, ganzúa rota)
function abandonCurrentMinigame() {
  if (!minigameInProgress) {
    hideAllMinigameUI();
    return;
  }
  audio.playBreak();
  hideAllMinigameUI();
  showPersistentFeedback("🚪 Has abandonado el puzle: cuenta como fallo y pierdes la herramienta.");
  if (isTrapLockpickActive()) showPersistentFeedback(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.ABANDONO, 'trampa');
  handleFailure(currentPuzzleConsumable);
}

/* ---------- Wildcards de subida de nivel ---------- */
const TACTICA_A_HABILIDAD = {
  auto_open: 'auto',
  doble_2x: 'double',
  escudo: 'shield',
  apuesta_riesgo: 'riskPot',
  carta_perdedor: 'perdedor',
  invocar_duende: 'summonDuende'
};

function getWildcardBadChance() {
  const table = DATOS_JUEGO.PROBABILIDADES.WILDCARD_MALA_POR_BUCLE;
  const loop = Math.min(STATE.currentLoop || 1, 3);
  return table[loop] !== undefined ? table[loop] : table[1];
}

function getUnlockedConsumables() {
  const list = [{ prop: 'picks', name: 'Ganzúa' }];
  if (STATE.level >= 2) list.push({ prop: 'proPicks', name: 'Pin de Acero' });
  if (STATE.level >= 3) list.push({ prop: 'usb', name: 'Llave USB' });
  if (STATE.level >= 5) list.push({ prop: 'valves', name: 'Válvula' });
  return list;
}

// Aplica el efecto de un wildcard según su 'efecto' y 'valor'. Devuelve un texto extra para el banner.
function applyWildcard(wc) {
  let extra = '';
  switch (wc.efecto) {
    case 'PERDER_ORO': {
      const lost = Math.min(STATE.gold, wc.valor);
      STATE.gold -= lost;
      extra = `-${lost} GP`;
      break;
    }
    case 'DAR_ORO':
      STATE.gold += wc.valor;
      extra = `+${wc.valor} GP`;
      break;
    case 'DAR_XP':
      STATE.xp += wc.valor;
      extra = `+${wc.valor} XP`;
      break;
    case 'DAR_XP_PCT_NIVEL': {
      // [0.084] Escala con el nivel: % de la XP que exige el nivel actual (valor = 0.20 -> 20%)
      const xpGain = Math.max(1, Math.round(STATE.xpNext * wc.valor));
      STATE.xp += xpGain;
      extra = `+${xpGain} XP`;
      break;
    }
    case 'DAR_HERRAMIENTAS':
      Object.keys(wc.valor).forEach(prop => { STATE[prop] += wc.valor[prop]; });
      break;
    case 'DAR_CARTA':
      Object.keys(wc.valor).forEach(prop => { STATE.abilities[prop] += wc.valor[prop]; });
      break;
    case 'COFRES_PESADOS':
      STATE.heavyChestsLeft += wc.valor;
      break;
    case 'MALDICION_CODICIA':
      STATE.greedCurseLeft += wc.valor;
      break;
    case 'PUZLES_EXIGENTES':
      STATE.harderPuzzlesLeft += wc.valor;
      break;
    case 'OTORGAR_CARTA_TACTICA_AZAR': {
      const tacticas = DATOS_JUEGO.CARTAS_NIVEL.TACTICAS;
      const card = tacticas[Math.floor(Math.random() * tacticas.length)];
      const prop = TACTICA_A_HABILIDAD[card.id];
      if (prop) STATE.abilities[prop]++;
      extra = `Carta: ${card.titulo}`;
      break;
    }
    case 'OTORGAR_CONSUMIBLE_DOBLE_AZAR': {
      const pool = getUnlockedConsumables();
      const got = {};
      for (let i = 0; i < wc.valor; i++) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        STATE[pick.prop]++;
        got[pick.name] = (got[pick.name] || 0) + 1;
      }
      extra = Object.keys(got).map(n => `+${got[n]} ${n}`).join(', ');
      break;
    }
    default:
      console.warn('Wildcard sin efecto conocido:', wc.id);
  }
  return extra;
}

// Tira el wildcard de la subida de nivel, lo aplica y lo muestra en el banner (encima de las 3 cartas)
function rollWildcard() {
  const banner = document.getElementById('wildcardBanner');
  const wcList = DATOS_JUEGO.WILDCARDS || [];
  if (!banner || wcList.length === 0) {
    if (banner) banner.classList.add('hidden');
    return;
  }

  const wantBad = Math.random() < getWildcardBadChance();
  let pool = wcList.filter(w => (w.tipo === 'PERJUDICIAL') === wantBad);
  if (pool.length === 0) pool = wcList;
  const wc = pool[Math.floor(Math.random() * pool.length)];
  const extra = applyWildcard(wc);
  const isBad = wc.tipo === 'PERJUDICIAL';

  banner.className = 'w-full max-w-xs p-3 rounded-2xl border font-mono text-xs mb-4 text-center shadow-lg transition-all ' +
    (isBad ? 'bg-rose-950/80 border-rose-500/60 text-rose-200' : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200');
  banner.innerHTML = `
    <div class="font-black uppercase tracking-wider mb-1">${isBad ? '⚠️' : '✨'} ${wc.nombre}</div>
    <div class="opacity-90">${wc.desc}</div>
    ${extra ? `<div class="mt-1 font-bold">${extra}</div>` : ''}
  `;

  if (isBad) audio.playBreak(); else audio.playClick(0.9);
  updateUI();
}

/* ---------- Guardado de partida (autoguardado en una ranura) ---------- */
const SAVE_KEY = 'justOneMoreChest_save_v1';
const SAVE_VERSION = 1;
const SAVE_KEYS = [
  'currentLoop', 'level', 'xp', 'gold', 'chestsOpened', 'chestsAtLevelUp', 'chestCounterUnlocked',
  'cleanStreak', 'paranoiaStage', 'traperoVisits', 'lastTraperoChest', 'salvageDealsCount', 'salvageCurseActive',
  'picks', 'proPicks', 'usb', 'valves', 'noXpChestsLeft', 'picksBrokenOnUse', 'tanteoExplainedLoop', 'xpBoostChestsLeft', 'torpezas',
  'seqStage', 'traperoStrikes', 'climaxPhase', 'sequenceBroken', 'perks', 'abilities',
  'active2XMultiplier', 'activeShield', 'riskModeActive', 'riskPot', 'perdedorActive', 'perdedorLootPending', 'fallosConsecutivos',
  'heavyChestsLeft', 'greedCurseLeft', 'harderPuzzlesLeft', 'traperoBuffs', 'cursedChestsLeft',
  'roomDecorations', 'roomThemeFilter', 'roomDarkUntil', 'opensByType', 'acceptDelayUses', 'hintUses', 'stats'
];

let autosaveEnabled = false;
let saveDirty = false;

// Si el navegador bloquea el almacenamiento (p. ej. dentro de CodePen), el juego sigue funcionando sin guardar
function storageGet(key) {
  try { return window.localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
  try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
}
function storageRemove(key) {
  try { window.localStorage.removeItem(key); } catch (e) { /* sin almacenamiento */ }
}

/* ---------- Logros (guardado propio, independiente de la partida) ---------- */
const ACHIEVEMENTS_KEY = 'justOneMoreChest_logros_v1';
let achievementsUnlocked = {};
let achievementBannerQueue = [];
let achievementBannerBusy = false;

function loadAchievements() {
  try {
    const raw = storageGet(ACHIEVEMENTS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    achievementsUnlocked = (data && typeof data === 'object') ? data : {};
  } catch (e) { achievementsUnlocked = {}; }
}
function saveAchievements() { storageSet(ACHIEVEMENTS_KEY, JSON.stringify(achievementsUnlocked)); }
function clearAchievements() { achievementsUnlocked = {}; storageRemove(ACHIEVEMENTS_KEY); }


/* ---------- [0.090] Estadísticas: PARTIDA ACTUAL (se guardan con la partida) y ACUMULADO (permanentes por navegador) ---------- */
const LIFESTATS_KEY = 'justOneMoreChest_stats_v1';
function blankStats() {
  return { chests: 0, goldEarned: 0, goldSpent: 0, picksBroken: 0, bestStreak: 0, maxLevel: 1, maxLoop: 1,
    puz: { lockpick: { ok: 0, fail: 0 }, tumbler: { ok: 0, fail: 0 }, hack: { ok: 0, fail: 0 }, pipe: { ok: 0, fail: 0 } } };
}
function normStats(o) {
  const b = blankStats();
  if (!o || typeof o !== 'object') return b;
  Object.keys(b).forEach(k => { if (k === 'puz') { Object.keys(b.puz).forEach(t => { const q = (o.puz || {})[t] || {}; b.puz[t].ok = +q.ok || 0; b.puz[t].fail = +q.fail || 0; }); } else b[k] = +o[k] || b[k]; });
  return b;
}
let lifeStats = blankStats();
try { lifeStats = normStats(JSON.parse(window.localStorage.getItem(LIFESTATS_KEY) || 'null')); } catch (e) { lifeStats = blankStats(); }
let lifeStatsDirty = false, statsGoldPrev = null;
function saveLifeStats() { if (!lifeStatsDirty) return; lifeStatsDirty = false; try { window.localStorage.setItem(LIFESTATS_KEY, JSON.stringify(lifeStats)); } catch (e) {} }
setInterval(saveLifeStats, 3000);
window.addEventListener('pagehide', saveLifeStats);
let statsPaused = false;   // el Modo test (puzles en serie) no cuenta para las estadísticas
function statsAdd(key, n) {
  if (statsPaused) return;
  if (!STATE.stats) STATE.stats = blankStats();
  STATE.stats[key] = (STATE.stats[key] || 0) + n; lifeStats[key] = (lifeStats[key] || 0) + n; lifeStatsDirty = true;
}
function statsPuzzle(juego, ok) {
  if (statsPaused || !juego) return;
  if (!STATE.stats) STATE.stats = blankStats();
  [STATE.stats, lifeStats].forEach(S => { if (S.puz[juego]) S.puz[juego][ok ? 'ok' : 'fail']++; });
  lifeStatsDirty = true;
}
function trackStats() {
  if (statsPaused) { statsGoldPrev = STATE.gold; return; }
  if (!STATE.stats) STATE.stats = normStats(null);
  if (statsGoldPrev !== null) {
    const d = STATE.gold - statsGoldPrev;
    if (d > 0) statsAdd('goldEarned', d); else if (d < 0) statsAdd('goldSpent', -d);
  }
  statsGoldPrev = STATE.gold;
  [[STATE.stats, 'cur'], [lifeStats, 'life']].forEach(([S]) => {
    if (STATE.level > S.maxLevel) { S.maxLevel = STATE.level; lifeStatsDirty = true; }
    if ((STATE.currentLoop || 1) > S.maxLoop) { S.maxLoop = STATE.currentLoop || 1; lifeStatsDirty = true; }
    if (STATE.cleanStreak > S.bestStreak) { S.bestStreak = STATE.cleanStreak; lifeStatsDirty = true; }
  });
}
let puzzleStat = null;   // tipo de puzle en curso (para contar acierto/fallo)

function isAchievementMet(logro) {
  const c = logro.condicion || {};
  if (c.tipo === 'COFRES_ABIERTOS') return STATE.chestsOpened >= c.valor;
  return false;
}

function checkAchievements() {
  const cfg = DATOS_JUEGO.LOGROS;
  if (!cfg || !cfg.LISTA) return;
  let changed = false;
  cfg.LISTA.forEach(l => {
    if (achievementsUnlocked[l.id]) return;
    if (isAchievementMet(l)) {
      achievementsUnlocked[l.id] = Date.now();
      changed = true;
      achievementBannerQueue.push(l);
    }
  });
  if (changed) saveAchievements();
  showNextAchievementBanner();
}

function showNextAchievementBanner() {
  if (achievementBannerBusy || !achievementBannerQueue.length) return;
  achievementBannerBusy = true;
  const l = achievementBannerQueue.shift();
  let el = document.getElementById('achievementBanner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'achievementBanner';
    el.className = 'fixed left-1/2 bottom-4 z-[9998] -translate-x-1/2 pointer-events-none';
    el.style.transition = 'opacity .35s ease, transform .35s ease';
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%, 20px)';
    uiHost().appendChild(el);
  }
  el.innerHTML = `<div class="flex items-center gap-3 bg-slate-950/95 border-2 border-amber-400 rounded-xl px-4 py-2 shadow-2xl font-mono">
    <span class="text-2xl">${l.icono || '🏆'}</span>
    <div><div class="text-[10px] text-amber-400 tracking-widest uppercase">Logro desbloqueado</div>
    <div class="text-sm font-black text-white">${l.titulo}</div>
    <div class="text-xs text-slate-300">${l.descripcion}</div></div></div>`;
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translate(-50%, 0)'; });
  try { audio.playUnlockFanfare('epico'); } catch (e) {}
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => { achievementBannerBusy = false; showNextAchievementBanner(); }, 400);
  }, DATOS_JUEGO.LOGROS.DURACION_BANNER_MS || 4000);
}
loadAchievements();

function readSave() {
  const raw = storageGet(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== SAVE_VERSION || !data.state) return null;
    return data;
  } catch (e) {
    return null;
  }
}

function clearSave() {
  storageRemove(SAVE_KEY);
}

function saveGame() {
  const snapshot = {};
  SAVE_KEYS.forEach(k => { snapshot[k] = STATE[k]; });
  storageSet(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), state: snapshot, muted: audio.muted }));
}

function loadGame() {
  const data = readSave();
  if (!data) return false;
  const saved = data.state;
  SAVE_KEYS.forEach(k => {
    if (!(k in saved)) return;
    const current = STATE[k];
    const value = saved[k];
    if (current && typeof current === 'object' && !Array.isArray(current) && value && typeof value === 'object') {
      Object.assign(current, value);
    } else {
      STATE[k] = value;
    }
  });
  STATE.xpNext = getXpForLevel(STATE.level);
  keysBaseline = null;
  STATE.eventQueue = [];
  STATE.shopSession = null;
  STATE.currentShopOffer = null;
  STATE.boughtInCurrentShop = false;
  if (typeof data.muted === 'boolean') audio.muted = data.muted;
  updateMuteButton();
  return true;
}

function scheduleSave() {
  saveDirty = true;
}

// Solo se guarda cuando no hay ningún puzle, diálogo ni modal abierto
// [0.089b] "Pantalla principal visible": nada encima (ventanas, banners, recibo, portada)
function mainScreenFree() {
  if (!isGameIdle()) return false;
  const b = document.getElementById('persistentFeedbackBanner');
  if (b && !b.classList.contains('hidden')) return false;
  if (document.getElementById('coverScreen')) return false;
  return true;
}
function isGameIdle() {
  if (isLootProcessing || minigameInProgress || STATE.eventQueue.length > 0) return false;
  const blockers = ['minigameModal', 'dialogueModal', 'lootModal', 'levelUpModal', 'merchantModal', 'traperoShopModal', 'traperoModal', 'unfairDealModal', 'gameOverModal'];
  for (const id of blockers) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) return false;
  }
  const overlays = ['duendeReceiptModal', 'diffuseEchoOverlay', 'resumeGameModal', 'resetConfirmModal', 'cardPreModal'];
  for (const id of overlays) {
    if (document.getElementById(id)) return false;
  }
  return true;
}

function trySaveNow() {
  if (autosaveEnabled && saveDirty && isGameIdle()) {
    saveGame();
    saveDirty = false;
  }
}

setInterval(trySaveNow, 1200);
document.addEventListener('visibilitychange', () => { if (document.hidden) trySaveNow(); });
window.addEventListener('pagehide', trySaveNow);

function showResumePrompt(data) {
  const s = data.state;
  const modal = document.createElement('div');
  modal.id = 'resumeGameModal';
  modal.className = 'fixed inset-0 z-[10001] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-5 font-sans';
  modal.innerHTML = `
    <div class="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
      <div class="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-500 flex items-center justify-center text-2xl text-amber-400"><i class="fa-solid fa-floppy-disk"></i></div>
      <h3 class="text-xl font-black text-amber-300 font-retro">PARTIDA GUARDADA</h3>
      <div class="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-300 space-y-1.5">
        ${(s.currentLoop || 1) >= 2 ? `<div class="flex justify-between"><span>Bucle:</span><span class="text-amber-400 font-bold">${s.currentLoop}</span></div>` : ''}
        <div class="flex justify-between"><span>Nivel:</span><span class="text-indigo-400 font-bold">${s.level}</span></div>
        <div class="flex justify-between"><span>Cofres abiertos:</span><span class="text-amber-400 font-bold">${s.chestsOpened}</span></div>
        <div class="flex justify-between"><span>Oro:</span><span class="text-yellow-400 font-bold">${s.gold} GP</span></div>
      </div>
      <button id="resumeContinueBtn" class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 active:from-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg cursor-pointer">CONTINUAR PARTIDA</button>
      <button id="resumeNewBtn" class="w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">NUEVA PARTIDA</button>
    </div>
  `;
  uiHost().appendChild(modal);

  document.getElementById('resumeContinueBtn').addEventListener('click', () => {
    modal.remove();
    if (loadGame()) {
      // [0.082] Modo pruebas: las opciones DEV prevalecen sobre la partida cargada
      if (typeof applyDevStart === 'function') applyDevStart();
      generateScreenChests();
      updateUI();
      if (STATE.xp >= STATE.xpNext) processLevelUp();
    }
    autosaveEnabled = true;
  });

  document.getElementById('resumeNewBtn').addEventListener('click', () => {
    modal.remove();
    clearSave();
    resetGame();
    autosaveEnabled = true;
  });
}

/* ---------- Confirmación del botón Reiniciar ---------- */
function showResetConfirm() {
  if (document.getElementById('resetConfirmModal')) return;
  const modal = document.createElement('div');
  modal.id = 'resetConfirmModal';
  modal.className = 'fixed inset-0 z-[10001] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5 font-sans';
  modal.innerHTML = `
    <div class="bg-slate-900 border-2 border-rose-700/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
      <div class="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500 flex items-center justify-center text-2xl text-rose-400"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <h3 class="text-xl font-black text-rose-300 font-retro">¿EMPEZAR DE CERO?</h3>
      <p class="text-xs text-slate-300">Perderás todo tu progreso y la partida guardada.</p>
      <button id="resetConfirmYesBtn" class="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 active:from-rose-500 text-white font-black text-sm rounded-xl shadow-lg cursor-pointer">SÍ, BORRAR PARTIDA</button>
      <button id="resetConfirmNoBtn" class="w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cancelar</button>
    </div>
  `;
  uiHost().appendChild(modal);

  document.getElementById('resetConfirmYesBtn').addEventListener('click', () => {
    modal.remove();
    resetGame();
    showCover();   // [0.087b] vuelve la pantalla de título
  });
  document.getElementById('resetConfirmNoBtn').addEventListener('click', () => {
    modal.remove();
  });
}


/* ==========================================================================
   REINICIO DE PARTIDA Y DEV CHEAT
   ========================================================================== */

function resetGame(keepLoop) {
  // [CAMBIO] keepLoop === true conserva el bucle actual (lo usa la transición del Bucle 1 al 2)
  if (keepLoop !== true) STATE.currentLoop = 1;
  minigameInProgress = false;
  specialShopOpen = false;
  hideAllMinigameUI();
  clearSave();
  STATE.level = DATOS_JUEGO.CONFIG_INICIAL.NIVEL;
  STATE.xp = 0;
  STATE.xpNext = getXpForLevel(DATOS_JUEGO.CONFIG_INICIAL.NIVEL);
  STATE.gold = DATOS_JUEGO.CONFIG_INICIAL.ORO;
  STATE.chestsOpened = 0;
  STATE.chestsAtLevelUp = 0;
  STATE.chestCounterUnlocked = false;
  STATE.cleanStreak = 0;
  STATE.paranoiaStage = 0;
  STATE.traperoVisits = 0;
  STATE.lastTraperoChest = 0;
  STATE.eventQueue = [];
  STATE.salvageDealsCount = 0;
  STATE.salvageCurseActive = false;

  STATE.picks = DATOS_JUEGO.CONFIG_INICIAL.GANZUAS;
  STATE.proPicks = DATOS_JUEGO.CONFIG_INICIAL.PINES;
  STATE.usb = DATOS_JUEGO.CONFIG_INICIAL.USB;
  STATE.valves = DATOS_JUEGO.CONFIG_INICIAL.VALVULAS;

  STATE.noXpChestsLeft = 0;
  STATE.picksBrokenOnUse = false;
  STATE.pendingTanteoPhrase = null;
  STATE.xpBoostChestsLeft = 0;
  STATE.torpezas = { madera: 0, acero: 0, digital: 0, vapor: 0 };

  STATE.seqStage = 0;
  STATE.traperoStrikes = 0;
  STATE.boughtInCurrentShop = false;
  STATE.climaxPhase = false;
  STATE.sequenceBroken = false;
  STATE.shopSession = null;
  STATE.currentShopOffer = null;

  STATE.perks = {
    sweetSpot: 0, rarityBonus: 0, discount: 0, slowerPistons: 0, goldStreak: 0, extraTime: 0,
    oidoClinico: 0, shopStealFree: false, luckyLootChance: 0, bonusMadera: 0, bonusAcero: 0,
    bonusDigital: 0, bonusVapor: 0
  };

  STATE.abilities = { auto: 0, double: 0, shield: 0, reveal: 0, riskPot: 0, perdedor: 0, summonDuende: 0 };
  STATE.active2XMultiplier = false;
  STATE.activeShield = false;
  STATE.riskModeActive = false;
  STATE.riskPot = 0;
  STATE.perdedorActive = false;
  STATE.perdedorLootPending = false;
  STATE.fallosConsecutivos = 0;

  STATE.heavyChestsLeft = 0;
  STATE.greedCurseLeft = 0;
  STATE.harderPuzzlesLeft = 0;
  STATE.traperoBuffs = { bonusXp: false, harderMinigames: false, shortPipeTimer: false, doubleGold: false };
  STATE.cursedChestsLeft = 0;
  STATE.roomDecorations = [];
  STATE.roomThemeFilter = 'normal';
  STATE.roomDarkUntil = 0;
  roomDarkPrev = false;
  keysBaseline = null;
  puzzleToolPaid = null;
  gameOverSeq = false;
  STATE.opensByType = {};
  STATE.acceptDelayUses = {};
  STATE.hintUses = {};
  STATE.stats = blankStats(); statsGoldPrev = null; statsPaused = false;

  const notesContainer = document.getElementById('notesContainer');
  if (notesContainer) notesContainer.innerHTML = '';

  const modals = [
    'gameOverModal', 'unfairDealModal', 'minigameModal', 
    'merchantModal', 'traperoModal', 'traperoShopModal', 
    'lootModal', 'dialogueModal', 'levelUpModal', 'persistentFeedbackBanner',
    'duendeReceiptModal'
  ];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'duendeReceiptModal') el.remove();
      else el.classList.add('hidden');
    }
  });

  // [0.082] Modo pruebas: las opciones DEV sobreviven a los reinicios
  if (typeof applyDevStart === 'function') applyDevStart();

  generateScreenChests();
  updateUI();
}
window.resetGame = resetGame;

window.goToChest = function(targetChestNumber) {
  STATE.chestsOpened = targetChestNumber - 1;
  STATE.picks = Math.max(10, STATE.picks);
  STATE.proPicks = Math.max(5, STATE.proPicks);
  STATE.usb = Math.max(5, STATE.usb);
  STATE.valves = Math.max(5, STATE.valves);

  if (targetChestNumber >= 79 && targetChestNumber <= 90) {
    STATE.seqStage = 1;
    STATE.sequenceBroken = false;
  }
  if (targetChestNumber >= 91) {
    STATE.climaxPhase = true;
  }

  generateScreenChests();
  updateUI();
  showPersistentFeedback(`🚀 Teletransporte al Cofre ${targetChestNumber}. Listo para abrir.`);
};

function closeTraperoShop() {
  const traperoModals = ['traperoModal', 'traperoShopModal', 'dialogueModal'];
  traperoModals.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  processNextQueuedEvent();
}
window.closeTraperoShop = closeTraperoShop;

/* ==========================================================================
   CANVAS Y RENDERIZADO DE LA SALA
   ========================================================================== */

/* ASSETS-BEGIN: imágenes pixel art incrustadas (data URI). Para cambiar un arte, sustituye el valor de la clave. Si una clave falta, el juego usa el dibujo provisional. */
const ASSETS = {
  celda: 'data:image/png;base64,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',
  marquesinaIzq: 'data:image/png;base64,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',
  marquesinaDer: 'data:image/png;base64,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',
  portada: 'data:image/png;base64,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',
  celdaParpadeo1: 'data:image/png;base64,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',
  celdaParpadeo2: 'data:image/png;base64,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',
  celdaApagada: 'data:image/png;base64,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',
  cofres: {
    wooden: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACPElEQVR4nO2ZMU/CQBTHH8aljQZYWIiBRCCBhbgRNmYSWUj4Ck4mbHwENxInv4KJiwZnJomjLkACKsSwGBIkUTsZnFpPeO3dK9dWyP2mo7y++7/e3bt3LYBCoVAoFArFphISMdK1yMJrIW74Mt65+m0N2KAatbwsTVI5u3y02nbBohd1LbJo1PLQG88hFCvA8Ol5xeZw/w0Gkxmk41FhQevYO+kAALi+H6FB7gj3tqGsBKhrkUWlkAxAynpUCkk0V5BGsFpOWe3BZCZBljtYHTxIAV7dDq02ZS3JhtXBw5c1GORo+xIgNtrZRNhqe/kAAsuivfHcans53V0nmSBhdbAzAWOX4piyuAEALs6LQnYnpx2SX1YHOxMwSAGKkE2ErU77dw+y3ZORvgZ5T9RvfE0ypXoXSvWun12uFtvL5Y6m7aE3GsYH13m7mfvz2wzO7roTojqWC250DeYOfjPTy/QbdczarIuILxEd3dfV5YEGmI5HrWSROXI+prCwCcZu814ePbM/O8wjk5MO0wYLUOoa5CWYdjPn+xr0vZLBRtBLtv7AS9roq+UUqZpptaaClrrjv9lEGPqGOx2elmrDT2fh1Hc0bnQENkV5RTKLU/LiHbU8CVDkfOe0nVCC580ATwKkTDvMVmY9KzVAypMHADguJmV2jyL1wEt98jedEcleVAeL67dqVGS+d6HoQLeJwWRmCcrE8BtFBC/bYPeI+uHpsPOz9ZWMCnDT2foAbb8P+i1EBiJffBWKf8YPvyPgfvyZ+ZsAAAAASUVORK5CYII=',
    piston: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACSElEQVR4nO2ZMUzCQBRAv8YFJgYNg4kDMKglRhcGCCHOJoRBE8ImK4MbM6Nxc3B1kzCYSEicjTE6sGgMGAcgLh0aGJx0s07U9npt7x/XWvTe1P5/d/2//f33fwsgkUgkEolEMq8ssAyKRmK634bw8PH57mm/4wCzU416RZRNQmmcNI1jJ2epwmgkppeKZRgMRz6ZJp5ev0t1cvE3jAmSJVIQjcT0tJKxyDRNDcwgDPH4qnGcVjLQ63d18inaHGRZLAyw3nRUiO7vpbiMEQnWBuYnCABweT1w1ff6XePYHOai5Cw2kAhPMs2dTaq8VCwLGY9FuIOVxxeqvN1pCRmPBRWiXpDhJFrOw59PMigHsS+4H2BtYA7RsG72XjA5GLZNHoOtOA1ra8QKU6mWVjKQSibmqpsAsBYIU/5fN+EF7S4B/Oxdfus1TbXkBPKchMlBMlxXlq0LjifWDNuoV0DZWDPODw6PLXpyPgmpz2XzxvVz2byrbSRMDvK8ixdXbzZZKplwfEJutDst4P3CgNoHZ90unAwcT6xr16oFWwSY55rrVK+iPLQNLy0CNE2FVDKBWmeusijPTebqJmghFCSYXpG7XaKFUBhBh6ioTntWjnafmcahs2i704Lt9dm+dPOGuDnBnN5sMc3xJYuend/aNmQSnhAfDEfoLEp1UNNUdP9nHl+rFuDp9ctR7zXfTU9z0G2u0G8yQXD/cIcaT+0H3WpFsu6cMp3jt96N8US19YNoB8MMzcG5qmR4cPw/GLQhImD54yuRhIxvQb/wBK1ppfUAAAAASUVORK5CYII=',
    cyber: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAChElEQVR4nO2ZQUvjQBTH/5WCJOshh0pWahE8qlAWxNN+gGUP0ttKP4HsyYMfw4Mn8ROIR/EgnsXTIoiw61FY1qKlPaTQNuwpHurUaTIzSZrXJFPyO4WXtP3/572Zl5kCBQW5ppS1gGk5XK97Xz9/wu3rAEdPD9r6UNL8se+FPbOQhpAsKQzqTmFQd8pRHjINK3S1yitSg7ypxu5eOmqmgOkcuo6wFwqDpmF5W5s7aLdbs9RGSqfbEpqMVKIM267SKUpAnIEPGDQNy1uuyI04tcp0qoiw/nWF8eVKFZ0uPH8WY2UQAJ6vr8bXjdPjwP2L/QNp3P8ZFlPF/VibOxGVjohtkMcvJExk4/Q4YIoNiChOAVkfjCKKSnQcEmWQITKnyia7JytRShIblGVOlS1+PrLrWZlN9VVtVllSQVKiUfGvsGnMyUDnZ33QtquBhmrbVfz+82vmooBgttlgqN6wRG8zqWYwDlTZjW1wK2ajzRphiWYhhIpIJSqbg3mn0w3qnfsd/dwbzO0qyiMqPYZqawckNCjaALfbLbI4z9mXDTTvHz92ILt7uLg8D9WoTYk27x8BfPTHKOYALoNJ2oNTqwh32lTxsDJUUQZG5n6urE3cuInxJbJjBKp4Eibm4MnLXwDvfZD8p7Ih0SIjexGgijNUqygwWcL+c1JtVtHVb9+FGtgh2OJ2Hauo83Fv6DolLfogMHmaJ+L/3cM40/xgkLQJ2VkpVTwJwgz2Bz30n3qhH7YxKi1+9esPemRxhmEsKXXwz/rRptFPy3jvZBqWN3SdkmlYXtiI5RXX7QMYzcHn6ysMXac0zqDs7yfdEe7odc4gq0KWMOn/g+lKo2Feq7BgrnkD284wDI7o9I8AAAAASUVORK5CYII=',
    hydraulic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAD4UlEQVR4nO1ZP2gTURz+KpLSUDBWCRksBIUKNWQptCGjAUN3dSidShWxi6WdbhGX4lBxqghKxy5dHISQoaIg4SwE8UgLDVoCjRBC21SJLa3Qcwjv8u7u3Xt3yb00SL8luffevff77vf/DugAamVV78Q5LFyQfYB+tK0DbJK1sqrT4/rRtu73w5BO8GCvavynCdXKqh66EjbGydriVsHX83t83Y2BWlnVidCjydsmwjQuX0tIkeWijE2BpoYO9qoGMRY5vzVmhRQTpckBsBEjpMjvWGpamiVJ0yAhVdwqYOhmzBgnpJxMkpi0X6SlPTna98ZS0z1f1t7qAPBN+46Hs8+l+z6BlIPuTz7Ryzsl01ju07uOkaIhxQet5M4Srp5qsC/kOflquWXEk1PeJfKAw6MDofyOC2hSq7Mxp2VninsvmynGiSxzMNgX0ldnY1A1dlLuRrxYqzJJSksTNLKVKHM8HSlJP9sWZIJ9IX0uFW55w0TcfK8TOdGcCJnisel6LhVmxgquBhPxsGGmmeIxxod6hQeT9VbhlUDddL1w0m9a51WbbmQBBARpH3TaUEScEIstzZvHZxYBNInKQtt5kEWOaEUJ1BFbmreRAxqEJ75uGg+gHXPlwfdE71bQeHIKWm65pXu9QFoUXXnzyHGOJhdbmscKgIkHr01r3Pq8CFwNWiOVH2BpjgWez3sBl6DoCXo9rDCz6IocD1612pYPej2MFWxkQ9pLJ6tPtbJWZCHWooIF3wm2U36lIyWT0CILcVMr24rTVlojFmK3RgHwoynQ1F5hY92PY20FN5PgXCpsKtNYEM1bc5qVqNUsvWje6WxWRyHMg06bqVqVS/LpnUOoWtUg6uRnp7+3TKbI25PMeWnjhARVrYrE5BSgvWfO8e4DGprhtksRs5/x9vz78RQjuGpc5wd2OZI30JF+sN2+L1uJQgnUsXDSb/wCgLLfKNZ5+/sWRd2EbBGc0gJNigYhzINQg9lKFNnFDwCCjNmo8fRo03qVOxRtCwB4nGzsSerOZ3cHbSY6sn+V21ItnPRD2Xc2V2kmeuP6MHf+x/am8Z8EGSf/o7X0ufIHSsS9HEKC6UippSDjJ2gNKhF7k8wzU+nfB73CD1+m0ZF2qbCx7rpSsVpFfmCXqyElUOemC66Jjg/1ug4yIpDSrRVY0wMBGUujRYJ+wQs5ViWTjpSQRyPvAU2fyw/s4rT401Ys0OiKIEO/nuDtyTJFUcfBJJgpHiNT3DGuExzB2gF9v4zXI4BEE6Xz3FmC2S4ND146C1naxubOL1u71HV50G/89wQdvw92WhA/4OaL7znO0WX4BxOd6WnHmsIlAAAAAElFTkSuQmCC',
  },
  cofresRareza: {
    wooden: {
      raro: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACx0lEQVR4nO2ZP2gTURzHvxUp3IHkOtjBUhKwDSQI0kVCtg5FpME4VOru4iBicBF0EpwDTuKog4MdWolQyFCX1oIOIkdaSdQrJQ5aSOO/TBqnHE/v9+69d313l5b7TI97/76/9+f33u8dkJCQkJCQkJBwWBmRKVSt7ffDFhKESskS6j/OyzANyzXq+1JZlyatsBp/9fZJY8mPpmH1by+exdZOFyPjBbQ+fPSUOX3iC5rtDqYnxqQFHaS8nw4AWNl0SCOPSfd2SPEYaBpWv1zIxCDlYJQLmX+W7AClGVyYn3LTzXZHg6xgsDpEKBm49KLlplX2km5YHSIi2YNxznYkBlKznUun3HSYAxCbF93a6brpMJd7YCcTJ6wOdiVQcG8yFCqbGwAePihKlbt2Y0OpXVYHuxIolAyUIZdOuZ1ur7/V3bwy2vegaESjJlInM1tpYLbSiLJLeomeu/USAPC5bsN+coWsaPd+AAAau/wZu7mYlxKxsulw8wbtG8aeJ+/uYxsAsFy38fpRiaxPGrhct4Wi8pP+3ksFmbY+7f32fGN15idT5GBznYzzpgYAOD9X8g1TWFgHwzu816reWfU7BwchU3aGDpcGOosTY6SB5B489e46rk6/QnF0ldsxhcjBrFXzWvdgb/0eiqOrOPn1KbdM5DcZagbD5MgHvEoH/cL8lNJtplbzej4a0zc3l05huxdMR6hXtdZPf+GqbzRBdMS2REWXZBY/5yUKtUIxUCa+8ztOVIwXrYBQDFRZdlRZnfdZrQaqjDwAXCxmdHZPojXgVR355xuOUnlZHSyBX9VU0fnuoqKDPCaa7Y4rKDtOV5QR/H8Zqo5sOyIdvHY8b/mmYfXvP3OEnQ4jdy5nPP8nhOHSpbkzZPg0bN95kDPIxmfZmQtkmPLn23vpTnQgo6Ox2/XM4JG/bHP/D0YtRAe8n6AJCUPMX4s7Iax9CWOhAAAAAElFTkSuQmCC',
      epico: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAC2klEQVR4nO2Zz2sTQRTHvy0e3IWSzaUXCQk0DSYX6S2GeigiViLmEhD/AenF1oJ4FI8qQqlepP+Alx6sJCCK1lJsezNCTSOJmiK5SCBpUXPS9SBZ1uzbnZnt7CYp+zlNdt/OfN/8eDNvAgQEBAQEBAQEDCsjPEYPcju610LccHstzdRvazAbXxhIp+x4UVsmfTlBPVQVTc9Ml7C3f4CR8TRqn79YbCbGvqPaaGHyVJhbxFHsnXQAgNrQ9F+dtsXJUe7WhhSLg6qi6bl0rA9SjkYuHYOqaJZlJTSC+WzcKFcbLQmy3GHWwULIwdVizSiLrCXZmHWw8GUN9nO0fXGQGu1kNGSUveyAvkXRvf0Do+zldHcdZPqJWYd5JlCQG70dIosbAJ48ynDZzc1vCdVr1mGeCRRCDvKQjIaMRivvSrKrF0b6GmT1qN/4GmRmFsuYWSz72SQ9ReevvQUAnGxVcP9Vnvxwt/MDAFD+Zj9iN6+muESs7dRt33XrV5Sm5V3h3i4AYLNYwd2Xs+T3pIObxQpTVCriHL1E4Knra/O35ZlZZyoSIjvbNsi8+fgUAHDxwmXHNMWMOcDYbd7rS9ZRddoHuylTYopOl7o6JyNh0kFyDb4/nENmuoRwZMO2YQpWgFlfSkldg6uNOwhHNtAcfWZr4/tJhhpBLzn2Ca/QRp/PxoVOM4WCNfLRqI5vk9EQKh13Ojw9qtV+OgsXvaNxo6NvU5R1SDbjFLxYqZYnDvLkd07biYjzrBngiYMi046ylXmeleqgSM8DwJVMTGbzJFITXtGef75VF7Ln1WHG9a2aKDLvXUR0kNtEtdEyBCXG6Q95BPfaUN/w1sPSYVeP5S5fVTT99XKd2eggcn4hht7/J5jp0rnsaTJ9GrTndlhGcHulrd94eMb4nZi6RKYpfw4/cTciAx4dj299wNnr2n8+HfvDNvmn4fZKWwf+zelhoBszekcvIGAI+AvInCEcdjhxRAAAAABJRU5ErkJggg==',
      legendario: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAC40lEQVR4nO2ZPWgUQRTHX0TFPZQ9G5sYbtHkYLcJ1x1XJYWIBAxIIKIIltoEYyFileqENAGxsPNiLZLIpbFJGmMqEZG7nDnvNmhEJCHeYbwi6FrILSPzdj72Zj+M+6uG3dmd/5v35u28WYCEhISEhIColSwnag0snPaCf321kuU47QUn7kb2RNjG9eSR/5U+kU779mwsZ/aIcYer/7DXjZSWdo26P7OkSpNSSI0/Ot9QY9GLKS3t3J0chupmC/pO5aH+oUH1OXviK2xs7cJQ/0lhQb30Z+kAAFhcs1EjDwmP9o9CGZjS0s543ohASm+M542/QraLlAcnxgbd9sbWrgJZ/iB18JAy8OlS3W3LrCXVkDp4hLIGo/R2KAZi3jYzutsOcgIiy6LVzZbbDjLcfSeZKCF1kJGA4bmTwZBZ3AAAjx4UhPrdmFqVei+pg4wEDCkDRTAzujvo+ss3ql8vjfI1yJvRsAk1yYxOV2B0uhLmkHiIPnl8BQAAGislKNwuow++63wHAIDKR2+P3Zq0hEQsrtme97rv17Rt6t6X11OuztzNz+jzqIGNlRJXlDXAzl4yiLyruf2TukbqtAZ0dLI9k8x8+c+MnD93mVmmkJAJxuvjvTxHe5X1HeyWTNkcVi59cnUO9RuogeganJk/CseOD0Nzx/AcGIOXYJbnLKVr8NrD09DcMeDFW+8ICH0ng3kwSA58wSv1oZ8YG5TazZTLdObDSTHvmhkd1jv+dAS6VavvsYXLntH40RFZiPI2ySSs5MUrtQIxUKS+Y31OZIznRUAgBsqEHdZX5X5WqYEyMw8AcLFgqBweRWnBKzvzz1dtqf6iOkh8n6rJovLcRUYHddSd0tJOq3pPmZgw0c0idXzPrSayl4rw/hltcNyue0F5cN+edUTKpThyZuQ69UsN9eDV4p7bzuYuoOXSr3ZNtT4mIjpejdDPHfjNNvp/kPyjq5vF8NT4gEyIIn98ExJixm/C8iO3kFgDEgAAAABJRU5ErkJggg==',
    },
    piston: {
      raro: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAChklEQVR4nO2ZMUzbQBSGX1GXZMpAlaFSVSUZColQuzCAEOrABEIZigTZyspQsTDQhQWJrWJg6dCtVdQiYUUwMaCuAakIOahDQFk8WMnAVAYkwhT3fH5n3zvOrlPdN9nv7uz/+Z7f3bMBDAaDwWAwGIaVJzKdPh3e9OMWosL6Qi5S/1NRQzaT85y6O93UpUkrrMY/tzeos6gxm8n1q4vL0L66jkubduxWE3Vy5F+ISZJAiGYzuX6lPOmzua6TmCAK+fxz77hSngS71ezzsyh8B8MulgZkHzopRN/Nl5TE6ISqQXoGAQD2j9qh7Xar6R2zYa7LLqOBR3uS+fZmHLVXF5e19Kei3cHar0vUbjXqWvpTIYVoFHw46bar8N8nGZKD1Bc8DqgapEM0rYt9FFIOpm2Rp4A6uLL1HQAAnGMbTj8vJCqIwvaPDgAAWCE6UQetY9s71pnRdMPrZDcIA4Qh2jk7BACAfAzCdBKlM1A/DaqJUrGA1oPYUwL4O9Nxt7uu48sJ7DlWE0olGd7ZZ6P+pNPt+TPs1kYNymMvvPOl9zu+dn48D98+PTXj3X96aiZUG4+UgyqV/deDTsBWKhaEMxSG1aiD6hcG0jr42OVCJLDb8197bXU2EAHsWHafGrUpT23Bi0WA6zpQKhZI1xmqbzIqD1mpmsBCKEkotaJyuYSFUBohh6iuSvuxfHh7IdWPnEWtRh1ev6opCwNQD3E2weyeTEiNiSWL7n35GViQeVRCvH11Tc6iqIOu65DrP7b/2uosnP++F7ZHjQ9rxxwMG4vuRQdlyLDxceml3F6ULUOqcxXfeVrtItAZjNoMp5VuzwnM4FDtZFQQ/h9MWogORD9BDYYU8wDJvhIM4/kesQAAAABJRU5ErkJggg==',
      epico: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACmklEQVR4nO2ZP0gbURzHfxWXZDrE4lAoktygjRSLINUQgrgIgjq0ELLVwcUhm1tBcCndMnRx6NYapNAYCIigIkGULEpJSoYoLhkOHTJVXXoOkvPu3bu793u+i3fyPtO73/uT7+/eL7/3fgmARCKRSCQSSVh5wTLo6/yx7rcQHla23nvqdxwwo+YC6ZQT28081ZdemjEaUfS+sVtonp37q0og0Yii/7tu25zseQox3cS2g9GIoo8kxi02TWt1TRCGgYFXRnskMQ61etW2i9QQ9VosCLC+dFSIfphVucSIBKuBeQcBAH6Vm679tXrVaJvDXJSdRQOJ8CTz890bqn1hLiNkPBbhDmZP/lLtxVJByHgsqBD1ggwn0XYenn2SQTmI/YL7AVYDc4gG9bD3gsnBoB3yGKgO5pc2AQCgctOA1Z2ZrgrCsJu/AACAStlZJ9XBSrlhtEVmNNGQOs0XhA6OIbpX37hvKMJ1CcVLp61+6lQTajxGrQdpbwngYaf97te0liUnmJ9r9SpwVROksy/7rUnn8sqaYVdXspAYfm08f/z0xdJPzich+5OTKePzk5MpV20kTA7yVPY/fl/YbGo85rhDbhRLBViYy3DpQJ2Djz0unAReXlnXXl5M2yLAPNd8T/W6lAe24KVFgKa1QI3HUOuE6jcZnpfMVU3QQqibYGpF7nKJFkJBBB2ioirtx5Kb+sM0Dp1Fi6UCjA5luYUB8Ie4OcHk998yzfEli377fmA7kEl4Qrx5do7OolQHNa2Frv/M45cX03Da+O/Y7zXfrZ/moNtc6l20U4aEjencINtd1FyGpGaHLM9BtTth28Gj9baeWUsyLxAkCp8PYWJJsfgUqpsMD9Q/DY/W2zrAfUyHgU7OIHdPIgkBd6VYEIh/kUInAAAAAElFTkSuQmCC',
      legendario: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACqElEQVR4nO2ZMWhTQRjHv4odkqUZKh0UKUmQJinFLh1aihXEpVCKWCiZqps4uHUoCE5BuoiDq8ZByVD0EXQ2VVyyCJJYWtJHlgiPdtAOOnQ4pzzv3d17777LvdeLvt/08t29l/93973v7nsHkJCQkJAQEfvVIjlrDUGQE0td3361SMiJRUx3ciDidm6gGflfGZHpdNrdNnJkRyc3Q/Wf92tIpzKuU09edDVJ0gut8dfvH0JnhcZ0KkNWV9ahc2hHpU07rXZT6OS5sxATJ1yIplMZMl2a89gcpxebIAwTExfd6+nSHLTaTcLOou87GPQwE5AddFSI3l7OK4nRCVaD9AwCAOy87wS2t9pN95oOc112GQ0s2pPM69mi0L66sq6lPxbtDpa/fBParXpNS38sqBANgw0n3XYV/vkkg3IQ+4JHAVaDdIiautiHIeWgaYs8BqGDn3duAACA3fgIs/e+xyoIw8+9LQAAsBtVX51CB+1G1b3WmdF0w+qkNwh9fEP05bv+iFzSrUsrYTq5+qlfTeRzWWE9KBolgL8zHXW74/Q8OYH+LaoJpZIM6+yFcW/SOTr2ZthHm2UoFS67v9fuPPa0s/ezsO0L84vu/y/MLwZqY5FyUKWyf/W2y9nyuazvDAVh1Wug+oUBtQ4Oulz4CTw69j77/t1rXATQ99L71LBNubEFrygCHKcH+VwW9Zyh+iajMshK1YQohOIEUysql0uiEDIRdIjqqrQH5cH1r1L90FnUqtfg6lRZWRiAeojTCebphxmpeyLJos+e73ILMotKiHcObXQWFW7V+rv0YWOsUJHbqtG79Cu3KnDwhnfYNLsf3AyedrcJ7eAwkV3a4I7UhDN486HUsaFxdD7xtqHayaggnCr6RHesUIlPjQJ0QpQ58U1IMIw/rAgVM4H8x8YAAAAASUVORK5CYII=',
    },
    cyber: {
      raro: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACwklEQVR4nO2Zz2sTQRTHv5GAbOphDymrpEXxaANBkJ68ClKK5FKU/AXFk4IHQa/eBHsqxaOCCF6ClFLoTTzZQinEHkvFhhqSwwbyA0/rYZl0dndmdrf79pfs57S8Tdrvd97b93YmQEFBpimlLeCyvLjdsO5fn8P3P2O8PTnKrQ8lrcfrlt9nriQhJE0Kg3mnMJh3ArXXd9umb7dKi+erutJDWXajoukzU/sfX1JqIoXpnExNoVFhsKLpVn1pGb1eN05tpPQHXaFJaQZFGEaNTlEEwiy8x2BF0635qtyIuVi9nCoi9N8DYXy+WkN/AMudxVAZBICz3Z3ZdXNrw3O/vf5MGnd/h8VUcTf60nJApTahDfK4hfiJbG5teEyxBRHFKSCbg0FEUYkOQ6QMMkTmVNlk92QlSklkg7LMqbLFP4/sOi6zib6qxZUlFSQlGhR3h03imfRMfjYHDaPmGaiGUUPn54/YRQHebLPFUL1hid5mEs1gGKiyG9pgPeSgTRthib75cgoAaO91sP9+NWlNgRHpDFSi7b3O7Fr1Xpo2bp39gffZlJbo6cF2PKqI8dMZqotmnVx1UR5R6TH8HqFIBkUb4F6vSxbn+XT3DlqHxxc7kEdP0P762Vdjbk7VWofHAC7mYxBzAJdB/pApLOZiVbjTpopH6eRlwDb39MZNx41vIf6I7BiBKh4FxzO4ef4LgL1iBvm/SodITUY2RqjiDFUXBZwl7D4nzU0XXXi4ItTADsGu3mtgAQ0+bk2mZikXcxBwnuaJ+HtwNMs0vxgkY0J2VkoVj4Iwg6PxEKOToe+XDdilxXe/0XhIFmdo2jWlDv6zboQGX3/oiMKZ59XaLU+sDNgdZ/PcPvauaLrFb0OaD+qObUlW4zKEuwm/ksgq0+kIgN1kznZ3MJmapf/OIKtCNgelvw8mK40G2Y+gBQUZ5h8mDGz7Wl6fIQAAAABJRU5ErkJggg==',
      epico: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAC6klEQVR4nO2az2sTQRTHv5GAbOphDymrJMUiHsQGgiAFQU+9hCram5I/QIqXePDg0WMRD+2lhP4B1WMpbQmCPVihIkIppLUHKYoNNSTIBvJDT+thmXSzM7M/spP9UfZzWt5ONu877817O5MAMTGhJhG0A8Py4lpeu3t5DJ9+d/DmeD+yOiwpPp7X7MZc8MORIIkFRp1YYNRJOhn0+tFn22oVCH+BVZQth3D7R+F6KZyiOFS+LzG1MCOYkmTtj/wN9XpttF4JJCXJWrenUiIdpShBUTLiPPKAm4mnBKYkWRtP84WoE+nhvBKE/KvJtI+nM2g0QUXRVQQB4KSy1b+eKy9S99fmn3Pt5s8Qm5XdjDw17dBTHdcCjZgdsXNyrrxIiSITwrKLQFgfdOKUKKfd4CmCBJY4q2iSe7wUFYlngbzIWUXLuB7J9ajE+vqqNqooWSEkRZ1irrB+rEmq85M+qCgZqqEqSgbVgy8jdwqgo00mIzc1zW30jWYNnvugX4iKrmuBOZeNNmiYKfph6QcAYGfzCK/eF/z2yTEsPx2l6M7mUf/a6r00aMx+Npr02uSm6PbB29F4JRg7P11V0bATqSpqhJV6BLsl5EkgawNcr9eE2Y2s3rqJ4t7h2Q7k4ROsrb+z9TEyp2rFvUMAZ/3RiTjAEMGUJA99yKROpJk7bVF2L5U8Cejinl25OnDjo4uH8I4RRNm9MLAGl09/AtBnTBH+VcHgqcjw2ogoO8GqigKDKUyWGmkXkami2cIs0wdyCHbxdh5Z5I12rdtTE5Hog8DgaR6Lf1/3+5E2ToaQNsE7KxVl9wIzgu1OC+3jlu2HFeipZax+7U5LmJ0gSZcs/TCONcMUuLFQtXxgWJkpTVK2JKBXnOVT/dg7JcmacRty7/6NgW1JWO08qN3E7oqqPXiZc/yAMLGxUMVMaRLZwixOKlvo9tREZN5FndLtqQkiDuD8ALq7omoAO6fDCDm6uPNUPp9/CIo5z/wHmc1tcFF8vJ4AAAAASUVORK5CYII=',
      legendario: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAC7UlEQVR4nO2Zv2sTYRjHvycVSQR7Q8opSVE6VJoWQkE6iINj6SChi5KlHauTiCj0D8hQHDpJx7iIkwSR0rGok4iloJGKhIqNNiTDWTBBOpxDeNP37t73vXt7b+6H5DMdz11y3+/7vO/z/jhgyJBYo0Ut4LQ8nChYNy6ex7vDP3hS302sDyGl2yuW1zNnwhASJUKDe5W8ZwvFHa7BvUremlws/xcmuYRtzjqqSr0v8Bi8ulwLtTppF4rK3+frD4/312LbTc9eeST0MMK7kU7pfVNLj+sqNSmF6Ox0TaZRZjCd0q2Z6Tk0m41BalNKq91gmuRmkIVhZNUpCoBMw7sMplO6NZbhGzHHM6dTpQj9R5sZH8tk0WrDcmZRKoMAcLC12b8ubqy77ldX7nPjzt+QmCjuRJ+e86m0h7RBGqcQL5HFjXWXKdIgrLgKlK1F/YhSJVqGQBkksMyJsknu8bqoSgIb5GVOlC16PJLrQZkNdbs0qCyJUNJF/eKssGGMSdfMT+ZBw8i6JlTDyOLT5/cDFwW4s00aQ7TCYq1mQs2gDKqyK21wRnKijRpmF/39ZRUAUN+uYPbuz9BF+YWl01cXrW9X+teidWnUOHW22u6xye2iz16TzMXXIOCtU6qKxp1EVVEaVtcjeA2hQAZZG+Bms6EsTvN8No/STu1kB3LrDqqvXnhqTMzJdmmnBuBkfvRjDqAySB8yyWKOZ5g7bVXxIJV8BOiZu3fpsu3GG4k/4R0jqIoHwTYGn/76DqDXYobyV0VDoCLDm0ZUxQmiKgrYu7DznDQxVTQ3v8DUQA7Bzl0rIIcCHbc6XVNLxDwI2E/zWPz9sNvPNN0YSqYJ3lmpqngQmBn89nZJ+YvCYHSq7Ip57iYmF8v4+nLV9Uzc4jz6C9N0Src6XVM73l+zaINJYuLmMkanysjNL+BgaxO2IkOvwq8/OIpGYUAOP7pjiVmL+qXTNTWSPYDzfZD+ossauHGCHFsA3l97hwyJIf8ACtZnLEtrvdsAAAAASUVORK5CYII=',
    },
    hydraulic: {
      raro: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAEFUlEQVR4nO1aT0hUQRj/GaG4CK0Wyx4SlgQDW7xIungwaKlF8NChOognMYm8JEqH7RAdkg5GJyMqOnrx4kGQRQyKkM2SaFkFl5QFN5BFXQtT9ODrsMzbee/Nm3lvd2bdwN/l7cy8N9/3m+/PfPPeAmVALhPXyiGHhTOqBWgH6xrAJpnLxDW6XztY12QvhnKCu9tZ/TdNKJeJa97zPr2f3JtaTUqVXyV1NgZymbhGlG7vvG4gTKP+YkiJLmdVTAoULLS7ndWJscjJtpgZSlyUJgfAQoyQIteO8IAyT1JmQUIqtZpE8+Wg3k9I2bkkcWlZpJWtHB17HeGBqi/z7zQA+JH4icHh58pjn0CJoLt9D7XMRtrQt/BxumykaCiJQTO5k4SjVX05s3tilQgPwz1eof62ScZT69VJNS/0yNJJKmgd9w92mWSZnZ5arzY1HEQ8wd6UKxEv5rNMksq2CRqxzQCzP+JPK5dtSTKeWq82EvYVPWGo1fisHTnRmAizqUNDeyTsM7gsAdeCoVaf7qazqUN0N9cIBZP7zcpHq/cM7bGjOsN9bq3pRBdAQJCOQbsJRcQJseDEqLF/aBxAgagqlLwPssgRq0Sr9xCcGLWQA/KEe7+v6AtQirvyIH2jd6poa2c/Egvvi3rWDZRl0cm3923HaHLBiVFMAui999pwj9OYF4FrQXOmkgGW5VjgxbwbcAmKVtCtsOTQuCNyPLi1akkx6FYYK9mohrKXTuaYKuZekYeYiwoWpBMspfyK+NMGpUUe4qRWthSnnlqv9mwqDQCYnkvi65viThLBK+0A+NkUKFgvubzoWgZLT3PBzSR4dXBGb3et9TMnp8s4Fsx7mpmo2S3dWJ7I/tRUSFhda/3ME4XtPpj+lif56BqbSDyR5ZJ8cnMf8URWJ2oXZ8d/Vg2uyJuTjNHjRM+uejYPpgVHwj6DoFBfP5CYsTzs9Lwo67jUtnPB0F5q2DK0XVlQJko998U2A4hW72HsqE6/AkB0J1+s8+aXlkWdpGwR7LYFmhQNQpgHoQVjmwHExj8A8DBGA/rq0e76amFfNC0A4EFnfk5Sdz693Whx+7adC9wj1dhRHaI7VnclUOaiTZdauONr6yv6b5Jk7GKattLnzb+I+p3rISQY8adLTjKlgrZg1G89JPPcVPn3QbeQEcs0ynJcSi4vOq5UzF6x1LDFtVC0es82/gCBi3Y31zhOMiKQ0q0YmLcHAtIXQZEEZcENOVYlE/GnsYT8vgcUYm6pYQvHqV+A374or4gkQ7+e4M3JckXRiYNJcDZ1iNnUht4OcRQrBfTzKl6PAILj0v+Gx3cCzmrR6bnCHwNu3Qga2pXabwemBVsazzmeoJKwsvHbYsGK2+hlw/b7YLkVkQG7j6CnOEUF4x8VJhQoOGcIQwAAAABJRU5ErkJggg==',
      epico: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAEJ0lEQVR4nO1ZX0hTURj/WWFsGCyTsYeCUWFRwx4iXUIvDZrRQy/hg0gPYRGJVCg97CV7kQh7kDCiooce7LWgUAOFMnQJIxwzcpQMWiDD3KilKOTtYZzrufeee8692z1rgr+X3fPnnu/7ne/P+c4dUAZk01GlHHJY2CZbgLIyrwBsktl0VKH7lZV5xenNkE4w9zOjPtOEsumo4tnjVfvJ3ORcwlH5VY6uxkA2HVWI0o3NpzWEaezeG5Siyw4ZiwIbFsr9zKjEWOSctpgeUlyUJgfAQIyQIr9NoQ5pniTNgoRUci6B+kMBtZ+QMnNJ4tJOkZa2c3TsNYU6qj6OPVUAYCb+FVdu3pUe+wRSBLW231DS31Oavsl3L8tGioaUGNST+5+wtKv3zv+/SoSHW6/ER4vphJaD1yuSlBlGvg4wuTCzqNvlUbpaY4jG2YdyJeL9D4+yvJIzkJR2TNAYXfAz+8O+lHTZhiTjdnmU7pC36AWDDdp3zciJxkQYTq5q2t0hL9wujyGsuBYMNnhVNx1OruJs/U6hYDJfr3ykOq9p963VaObZtaYVXQABQToGzRYUESfEAoM92v7OfgAbRGWh5HOQRY5YJVKdR2Cwx0AOKBBu+/RZ3YBS3JUHxw96q4o2NF9CfPJZUe/agbQsOvTkqukYTS4w2IMhAG2XH2nmWI15EbgW1GcqJ8CyHAu8mLcDLkHRDtoVlujst0SOB7tWLSkG7QpjJRvZkPbRSR9TxcwVeYi+qGDBcYKllF9hX0qjtMhDrNTKhuLU7fIoYwMpAMDEmy/ofdtiU80CAkcbAfCzKbBhvcTstG0ZLD31BTeTYO+ZEbX9++9F5uJ0GceC/kzTE9W7pR3LE9m7tj/X6Hl/LGMgaHoOjs++AAB0tbKJROMZLsnbZ5YRjWdUomZxtv5rTuOKvDXJGD1O9DxxmM2DacHukFcjKNh+CYi/Nrxs9b7o1HXp+FKdph2rXdS0bVnQSZR67xtd8CNSnUffWo36CwCRpUKxzlvfsSxqJWWLYHYs0KRoEMI8CC04uuDHaP84ADdj1K/uHu2uDyeXRcsCAK41F9YkdeedC/sMbn98qY57pepbq0FkyeiuBNJc9MD+I9zxb/Of1WeSZMximrbSh4U/iPis6yEkGPalSk4ypYK2YMRnvCTz3FT6/4N24UQs0yjLdSkxO225UtF7Rax2kWuhSHXeNP4AgYuerd9pOcmIQEq3YqA/HghIXxhFEnQKdsixKpmwL4UYCucesBFzsdpFrCd/AD7zorwikgz9eYK3JssVRTcOJsHh5CqGk9/VdpCjWCmg35fxeQQQXJc2G0LX/dZq0Yk3X9TnU+cOa9qV2m8GgwWnHueUrv5jlheoJDzomcHJKx4Np4o76J0G80/Dqcc5BSj49GYAyRl6621hC5sA/wAnOxZ5AZFlsgAAAABJRU5ErkJggg==',
      legendario: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAEQklEQVR4nO1ZS2gTQRj+6qPSUDRWCUEUgkLFGgoiaKgXMWDwJiIetAcpFXxclBaRvYiXHKTiqSoqEkG8KFJEkAqKgtRYKIVQKwkYAkYpoTa19IFVHA9hNrO7szO7m9kYwe+SnZndf/5v/+dkgTqgXEyTeuzDwwq/NyBLeQLwSZaLacLOk6U8Uf0yfCc4+62kX7OEysU0CW4I6fP03lx2Qun+TUqlcVAupglVek/XAQNhFus3x3zRZZUfQoGqhWa/lXRiPHKqLWaGLy7KkgNgIUZJ0d+98V7fPElIMJvq8BzwlJTZQnS8fnOsaW+8t8lMrlxMk/cv7zral8wNeU9I2VQHIXNDxCtJqihVll7fvn6priVD6BrZVAfZfnLStfsc6z5Pip8LhrmRN0NSOWRuiDStPazUXYUu6oUcAJjJOYVqcoDDMvGzcPWvdSIirI5clOpvWyYCLUGd1IvbT1XppBSsjotLs1yy3MlAS5A8uhBFOsMvyo2Iay9LXJK+FXoWw1MR7nwiXPB9b0uSCbQESV885FlgrNP4rB052ZoMz3M/DOO+eMjgshRCC8Y6Q7qbPs/9wKH2NdKN6f1m5bXmecM4udxquM+tNZ3oAkgIsjFoJ1BGnBKLDvYb588NAKgS9Qs196I8ctQqWvM8ooP9FnJAhfDx8Un9BdTiriIob7adKtrZ1YPMyD1Pz7qBb1n04Z3TtmssuehgPx4COH7qluEepzEvg9CC5kylAjzL8SCKeTcQEpS9QbebTZwbcEROBLdWrSkG3W7GSzZ+w7c/ncwx5eVemYeYmwoelBOspf1KhAsGpWUe4qRXtjSngZYg+f5RAwDkX6ew68xXt3oCAKI79wAQZ1Ogar2JD6Ou9+DpaW64uQTHb27Sxw8e/+IKZ9s4Hsw1zUzU7JZuLE/37j5arXIPHv/inihs6+D9Z5U3sq+Tf2xKZ0pCkpcPLiKdKelE7eLs91zW4IoimXSNXad6rgQ/HrkW7IuHDBvFunuAzDPLw07Pi6qOS7tnNhrGY23ThrErC6pEree+4akItOZ5JJdb9V8A0GYqzbpIvrIs6iRly2BXFlhSLChhEaQWHJ6KYHjgFYAAZzWivz3WXW+MLMrEAgDOdlVk0r7zytEtFrffPbNReKRKLrdCm7G6K4VvLrpta4dw/VN+Ur+mScYuplkrvZ1agBZ2roeUYCJcqDnJ1ArWglrYekgWuanv3wfdQkUss6jLcWniw6jjTsXsFWNt00ILac3ztvEHSFz0UPsax0lGBtq6eYG5PFDQuQQ8ElQFN+R4nUwiXMAYKnUPqMbcWNs0fue+AGH7prwhkgz794RIJs8VZScO4WniX8O6HUlnrVr+dUq/bj+SRO6JlXCjzdvBYsGfhauEJfgvYev+k5ZPalwLnkgu1EcjxXi33zrXcIVeNbjfB9kvuut2JOunjQewCdHJF9//+I8Gwx+zICznAqSgZAAAAABJRU5ErkJggg==',
    },
  },
  decoraciones: {
    telarana: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABa0lEQVR4nM1VsY6DMAx9VN3K0H9guRGpHareTzD1C/oRqNON+YAb+QDExMLe5SQGkDre0O4dGWDmJkdOSELo6aSzhOQ4wc9+dhzgv8km3I5/6rzKxbgEZOXreBNuxyJLFZvPv4HN4dB3ATkhx6ezAAc5nQUAYOi7gP83Gy3RUOVC6vTxtb7vTZ/uiL7n/To+79eJnQPpvpw1IDoetxKPW4koTtA2tVxzIfp0kLUp+iJLJb/kmAutCUTf987AlMluf5D2tqkRxYkEsmWhRM+553yTXuViUguu67VYcee+meiRu7KQ/cv7GwB2+wPapp7oX98h3t965xkSquMiei4fn5ImF0WUgaRo6LuA31QTBVRgJTKL0I327qIoTpT2jOIERZYqbUztzceFAmDLgrcm2X0zmYg+i0w862PDNSqcIKZ5VB6PE9uvBp0NyLS/CITrc+OZzpucux8HAyh/fABg9oFZIq+8yS+BLDn/A0M7mhfyaBz5AAAAAElFTkSuQmCC',
    muneco: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABh0lEQVR4nM1WvWrDMBD+HEqWeDCBQGlDCXRLM7hLX6BLwdD0OTrkFYLXDBk89Dm6ZPQcyFIPDoRAwRQTOhkNydKh7lDkWqcfO6aFfiAsne++051Oh4A/hqX70bGdnM8Pe9ZY70RnNL09K9Z+iJzqHPbMUulRJ5JHasRxc9UV1l4QQ6XnhzshEmUElLg76Evy5byPLEmxWmdG+1YTco7uoC9FRqE8vI7t5IvJyEheBo+EpgeoSFGWpPCCuFgv53cAgHbUwof7iXbUwrvzBkDOPYcxRRyv0bOwpuQm1HJw6T4A+I4oS9KC/JRdVNpWVtFiMpJkfOeNIzjsmVXOvRfEWK0z4VuGF8TG2y6gYzt5eczGw3w2HhZz1bc8KJ9FyVW3U4f7cxebKMG2xwoZraZah6zDJkoqdRo7YNeP2PaYsHsVlM0OgLKRcWIAcF6eBLkf7gDILVsqU96GdeSUmNpS2VEpMpHroL0HPOQ60PUhrYPfxP9y4Ic7HJM6wPCqAMQXA/BTJTq5Cl+nZsZyBh42IgAAAABJRU5ErkJggg==',
    craneo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABI0lEQVR4nO1VOw6CQBB9GDsouAOdhSHRwmNQ0dh6CI/AIWxNjBWNvSUFJMTCSnpLCqjXxjW4zOyHxM7XLLMD7zFvZ3eBH8OzeckPQkHN911r/F77giRu6hwAEMXJ51nGJiE24QehGJINSdX5KE5YkZkLuURVFl9xU+esjSNVEzlAVyHn1UrICqaQc/hSU/9eLiIA0ncqp1bBVjAkUGNdToXRouNyMSlnLbC93SflSIG+a70oTlCVxcjzYUzlqrIgu2iuU+cWtqlz604aWdR3rZfustFm0qEqC6S7jNzNZAVvEXE+7AEAq/WGJQbAkgMWh530l4OOHLDoIhernOEHofCDUDwfV3K8nDLBHXISxgpkt3CjCc6HnSuMV57JAptr8w8tXpgJqhasgd4fAAAAAElFTkSuQmCC',
    vela: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABDklEQVR4nGNgIAFw8wj8x8enCHDzCPx/sFLvP8xQdD7ZhqJbgG4JITOY8Bl+da4cAzePwH8YW1TPB0XN1y8fGAlZgtOCr18+MGonP2L4+uUDI7ocusX4LMFpAcwSZP5nVjcUX+BzBFEWoAPe37sIOgId4JVEBujBQMhgkizg5hH4r2/sgCJ28ewBoiwhqICbR+C/d0ACAwMDA8OFc8dQ5J4+ukXQEpLigBxAtgUiolK0tYBYQJYFxLqebAtIAWRb8Ob1M9paQCwgywJiXc/AwMDAgkuC2IoEpg5XhsNqATePwP/8khY4/86dO1gNR1YzsafmPzZLsNqKrewhBHCVTTSPZJwFFamVObHFN9UBAHwodto+kv2oAAAAAElFTkSuQmCC',
    libro: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABHUlEQVR4nGNgGAUEACO6ADePwH9KDPz65QOKmSgcbh6B/0v1tCgxnyH60jUUS5goMg0LuHthA0oosGBzAQzEKxuRZHjd2joMMar7gGQL7FzuEjQEnxqMIEIHh/Yow9llVW9Q5LraRDDUkGwBsuEwA/GJkWUBzCBkH3S1iWCI/Tibh6EXIx/Yq/ETYycKmFaOqkc7+RE8L1AtFWknP8IqjhFEB299hLOR8wH+OHjDcHWuHHEW4ALo4Q0TIwTgFuAq5Oxc7sKTIS4DT5z6yHBojzJSTg6AyzHBDM8vacGqGV8aJ0YNPJIn9tQQNIgcwITP9dQAjAwMkCD6+uUDI3o8kFqaMjAwMCy8ew6lPoAzYD6hNKjQazQUQGl1OSAAAHTQbhggLZjBAAAAAElFTkSuQmCC',
    reloj: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABU0lEQVR4nGNgoDFgRBfg5hH4T4mBX798QDEThcPNI/B/bokXJeYzJPdsQ7GEBV3BoyfPKLIAHTBR1TQsAGscJNjJMzAwMDAI100kypC3TfkMDAwMDAsOPcSIA4wgQga9LgEMdy9swGu4skEAA8xB2ABeC2AGFO/ZwKC1Oh5D7lroQkLaCVvw9csHxl6XgP/FezZgyPW6BBC0gOxI7nUJwAhvsi2A+oIshxAMIjRL/l+dK8egnfyI4euXD4zE5HqygwjZ8AWHHlJuATePADyisUU4xRbgA/jyAVEWwFyf9DCPgYEBkoKI9QXBSEYOGhi4OleOQZvIVEXQBzDDYa5nYGBg0E5+xHB1rhxRviArDq7OlSNaLV4LsLkeGSQ9zCPoC4warT7CgGjXYQONKy6gFCFUr3CuzpVDyYQYPrBX4yfL4DhHBoZF+xkYDt76iOIDmrcqANclfBSUAPdTAAAAAElFTkSuQmCC',
    cuervo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABPklEQVR4nGNgGOqAkVyN3DwC/5H5X798wGoWWRZw8wj8l5ZTQxF7+ugWVkuYqGE4AwMDg7ScGoavSLYAl+H4LCHaAmyuY2BgYNjkoAJnN3m+hKuFYaLigJDL0S1ABizUMhwdJM/8SNgCmOEGRlYo4hfOHSNoMCxF4QwiZMNhBsLYyGIw8PTRLRSDYQBrJGMLFmyGIgNcwYjVB9w8Av/1jR0Y3rx+htNAbABbZsPwAcxwagG8+UBEVIq6FlDb9SgW4DKcWF9QrbAjxXAGBmgqgrn+4tkDWA3Al5Nh6R8ZIFsGZ3DzCPyvjzDAadCcY98YmjxfMtRtF2dgYICUO48+KmJV27jiAtwSlKLi4bP3OC1wVYDRP4lSDwNwC75++cC44BAD1iIZBmw1+RkWHHqIwUYHuOKDIECuE3DVD3QHAIPjiU9qIuEZAAAAAElFTkSuQmCC',
    espejo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABUUlEQVR4nK2WPW7CQBCFnyM6W8IHQLlAKiQ3qThBytQptkB0uQCykC9Ah1y4SJlbJFUapFRwgIgDgAS1U0Rjjcc7u5OE1/hnl/fNj7VDAqPSLG/58+V8TCy/G1mNm/m4997VaC2g4GKa5a00lnL1KQhRF6T5ZvLcW18c1ibIzW/MZ/dTbJerAbCZjwc9IkV7sH98wYw9F1XZQRwDaBpkwKOXZXn/+FSNtCy8JbKaWtQDhL4aAm2XKxRViaIqAaC7Av4s1AxkeUhkSKDQ3iCAi0cvQTGZAGRuNeWKfqYU9V/MAUMGvKESehWABrVCVAA/a2KQ0N4e4HI+Jq4+eTf6IpaZ+A49c4m0JseaPwDwLBaHNV4fpkEDKo92ZEczeNs8dfeyTLE+AWzgpFne8giuNXASMts1t7hzXwhBfDKPTJkBfw/4hv5Pn/419H0gkvVvyzdpGrG1FZIEpgAAAABJRU5ErkJggg==',
    jaula: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA/0lEQVR4nGNkIAJw8wj8zy9pQRGb2FPD8PXLB0ZCepmINXxiTw2K4fklLQzcPAL/KbIAm+GkWkLQB5QCjDAkxtv4AHq8oHCwRSapAD3yaR5EGICbR+D/1hUd/7l5BP6Tw4ZhvD44eoOHbLa+sQODvrEDPC5pHkRD3wKMZKpv7EAVgy+ePYC9rOLmEfhf1TAFnhpIZVvZB/y3sg/4PxrJRAMWQgryYnQY8mI2IPER7Ik9hC0g6INJS67glLt7YQMK/+uXD4wXzx5ASUEoFuAqqpUNAhiUDQIYJi25gsHGph85eTIiS1JaVMMAcpGNEgcH9u+higXIgP5FBTUMRY4DAMzknXcLaWSRAAAAAElFTkSuQmCC',
    grillete: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABL0lEQVR4nGNgoDFgJFYhN4/Af2T+1y8fiNJLUBHM4PySFhTxiT01RFmEV5KbR+A/zOAD+/egyDk4usAtwmcJCyHDYQZfPHsAq7r8khaGiT01/4kNMrjhVQ1T/lvZB/zn5hH4jx7+MDXcPAL/rewD/lc1TMGqhoGBgYGJGAuxuQ5ZTOD8NKIdD3d9l78WTlehq8fnC5w+2PBBjXhX4QF4g6jeWQoj/VPVgsa9z4jOULgAhmbkjHVg/x6cyRMG9I0dGBwcXXBmPBQON4/A/1VzKihxMENYSgeKJRgZ7egNHpyaJ/bUYBQZhABR+QAGSDWcgQFPHBAyHBbm6AA9DjCCCFuqwWUpMSmMpCAiB5BlAaEimmILSAEkVZn6xg5w/sWzBwZHHBDlA+Sqk4FhkMUBAFMiin4bBG4mAAAAAElFTkSuQmCC',
    ojo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABUklEQVR4nNWVsUoDQRCG/0i6u2Lf4ToLCSTFlQp5gFQ2AStJKwSLIJYiKSRgG1IJNql8AEGxSqEgV6TzHa5I6rNxjrndmdv1TAr/am927/9mZu92gf+uVsiiKDaFFN9ucu/7tQvIeLmYiPOn51MvSJ2IYlOQcbeXims+3lclSIOIQTLXjCWQBnECmvnq7KrynD7cBkEOmmZuA7u9FMvFxPkgKgAASN4y1WyYrTHM1l44V1lOFJvi6/MJAJDP5jDjkWPO9Xh0CMBtFQAknUHZKqcCADDjEfLZ/FeZahIBBNkrgEQtoJbwMW+PVnGbBttN3ko6g3IfJHEIF98z3v+gCuxM7Rg3lyT+aHVV1MnOHhAq+GnVTsxFQBOIZg4EHtdayyiJRsc1AS4ubwAAry/Plbnjkz4A4P7uuhbQ1iZItrEvbivoM/2LvHeqdh+TQu7lveobcfWZXxsb03oAAAAASUVORK5CYII=',
    pergamino: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA9ElEQVR4nGNgoDFgROZw8wj8p4ahX798gJsLZ3DzCPyvjzBg0HbxoMjwq3t2MDSuuAC3hIki04gANLcAaxzcvbCBLMOUDQIYGBhQ44AFWcHXLx8YkSP67JkTRBlsbGKBYgayHAuGahwayQV4LSDkA2IcMLh9QIwjBr8PCDlk8Prg96RNcLbFojac6hjRBbh5BP4Tyskn4qowxCwWtTEoGwSQltGQfQALLpjhGgYKDDcuPMBrKUEL8MXBjQsPGHZ95WBw4/6BzwjU0pTUCgeb4ehmkFXhIEcwDLDm+TEwMFCpwoEZhouPDPDGASmW4AI0r/RpDgC8KGDUMtQ89QAAAABJRU5ErkJggg==',
  },
  duende: {
    alegre: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABp0lEQVR4nOWWv0vDQBTHv9GCIkKUguB0HdzUioMiIhQUhPYvcKrOHVyCjg4da7s4dFY3/wARHARRSomDqLg59CZBCDWL4BSni4l395rrD0T8Lsm9y/t+8t7lkgD/WqVCNSgVqgF1Tapb46TXDvXDfHNxWws0ApjcuTGgk7muCuMWqTQzPa+dSwTopjWJAb2YA4BFTVJPh06X9ycxTyVAGFO9Venl9UmCxADFSi443b+2xLmJeTRPnAOKNTA17pQrATj3uoIUK7mAc0+KS2vQSwXAd6uEpArKrI0ya4fji1pLaxad+5mnBVBGnHsQbaDAUUmv6wM+GRvnnUxoxlga0T7nnYw2TwtQKQq5O7KxtNuKmVNSbrTSwnoAAM9rb2AsTRpw7mH2dgoAUH+4kvzIClLnwLg9jAlnTDn/XvtAygdgEx7k7UWMAIQgMU4iJUCUupGZS7QnVK0R6ssHh5LRX4VJa4QGXsHAAeQXDQCybDVc6EfesHQxnX6ngtZZNmi6PgBg73gkjN/UR9F0/VjscOcTK8s2mq6PrRqX/KSAMBdJpkcV5G/rC+AEtpNq1LYqAAAAAElFTkSuQmCC',
    asustado: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABsUlEQVR4nOVVP0gCURz+LoKixUAQms4hcEmjJaIGoSDQsSkItNlVco1W81bndGtpDYICiUJcxGwRGnxTIAgehNAQ1xDveuf7c/cuJaJvuR/f7/e+773f+3PAv0YhW3EK2YqjqpkPKxy0dm4a4vsbeamhloHOzLUN/MRlq9BukQirK0lpLpBBmNYENviJOAAYqqTqdMhw0655NIUGVFjVWxFeXruciccgV0479VLDoLGOODuOxoBgD3SF/cZyBoQMQ5nkymmHkCHHc3vAipcPzly+dHUKPx74bhUFt4J6qWGwRcmdvHDGk/zkOArf17T7UHNjtgUsr4L0Hsj2gZAhTDPK8aLZAwGfimur78ZUnOVUkLaItsM0o8gU45xgphj31MmgfCr24mtOIhLDcnFJmB9ZY/TsAW77z1IdYaKwvusAQM8eIBGJuTw1Glljl2Nrqp07Tm8q/wMVZm4g3OS3o4+voOrl2dYI6zt8buYrCHSKVAh1ilikzG33Rj+RR0PGyfA7LepfppxmywYAnFwsuPx9dRHNlu3hzo/fsbUZQbNl49AinB5HUHE6SPcrMvnb+AQVPcbnTNM/QwAAAABJRU5ErkJggg==',
    banyo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABp0lEQVR4nOWWv0vDQBTHv9GCIkKUguB0HdzUioMiIhQUhPYvcKrOHVyCjg4da7s4dFY3/wARHARRSomDqLg59CZBCDWL4BSni4l395rrD0T8Lsm9y/t+8t7lkgD/WqVCNSgVqgF1Tapb46TXDvXDfHNxWws0ApjcuTGgk7muCuMWqTQzPa+dSwTopjWJAb2YA4BFTVJPh06X9ycxTyVAGFO9Venl9UmCxADFSi443b+2xLmJeTRPnAOKNTA17pQrATj3uoIUK7mAc0+KS2vQSwXAd6uEpArKrI0ya4fji1pLaxad+5mnBVBGnHsQbaDAUUmv6wM+GRvnnUxoxlga0T7nnYw2TwtQKQq5O7KxtNuKmVNSbrTSwnoAAM9rb2AsTRpw7mH2dgoAUH+4kvzIClLnwLg9jAlnTDn/XvtAygdgEx7k7UWMAIQgMU4iJUCUupGZS7QnVK0R6ssHh5LRX4VJa4QGXsHAAeQXDQCybDVc6EfesHQxnX6ngtZZNmi6PgBg73gkjN/UR9F0/VjscOcTK8s2mq6PrRqX/KSAMBdJpkcV5G/rC+AEtpNq1LYqAAAAAElFTkSuQmCC',
    base: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABl0lEQVR4nOVVP0vDQBx9EUFxqVAoOKWD0EUrLiIuBQXBfgJBqM5Zi36I2qyd1c1PIAgKIkjIIlURCg65SSgUGpSCg5yDXExyf5JLWkR8S4/3u3vvd++uF+Bfw6q3qVVvU9Wc6azCaedOjUN8e3VfaqhloNO5tkGSuGwX2hGJsLiwLK2lMsgSTWqDPOIAYKiKqtshw+X9aURTaMCEVdmK8PL6yJlEDBqtGj07ujHYWEc8vI6NAcEZ6AonreUMCBlkMmm0apSQAcdzZ5BnB8BPVFKDuNGF7QEAdprlSD3Ox4UZtP7JhAwgikGFxOc63LlpFgOD+I4yGzCwSADgGW/5DVinplkEIO84KTLlU7FVXqKVQgnzzTlhfWiP0PP7uPKepDrCgrWySQGg5/dRKZQCnhkN7VHAhed0utec3li+BypM3EB4yO97n9+DTpQPRyOc3+VrE99BqlukQqZbFEbV3AgevwdyZ8g4GX4nIu+8Sh3XBwAcnswE/G1nFo7rR7jjgw+srxXguD52bcLpcQQTZ4t0f0UmfxtfGPO7GOVorNkAAAAASUVORK5CYII=',
    capucha: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABpUlEQVR4nGNgGAXDHjASq9BfTO0/NvGNr27hNYOJEsMJyTEwEPBBlZrl/6sf3hLjBgYGBuy+wekDfzE1FMO1BYQJWoDNN0QFEQMDAwMpPiHLAnIBfS2I67LHCMP73z8ShXGZwYJuYFyX/f9FZQfhqcGgVoMol37seU7YBwwMDAwPH77F6hNyAYoFi8oOMsrLE06O+ACy7xkYsAQRTAEsTQdt+M3AwMDAsC6AFUUdLnF0QFIqevjwLcPDh6TlBwwfoANkF8rLCzM8fPiWYXvvAwaGYgXqWAAD23sfEKuUPAs88bj44cO3DALkWsCzlJlBoJgLq9yH3m8MNz++Yjj44AojrmIbayRn6TuhKP7Q+43hQ+83nHx09QQtoCbAaYG0pAzDFy42og2SlpTBWuFgjYMv0X8hjGmo4sjBglX9RUw5mgcR3jrZWUHnvzq/GF4Dbn58xbD3wRWc5hBstujJW8FTyKWHxxhxieECAxNED1bq/T9xClJLlS5gh4sfnsbBcOLURxSx7oSfDBZm/AwnTn1kiOh9iGEehgDMcJgmUmlslgxtAACPo8PtpsdlEQAAAABJRU5ErkJggg==',
    codicia: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABuElEQVR4nOWVP0vDQBjGn4qguMRSKIhDMghdasWhIi4FC0L7CZyqc4QuRccOjrVZBDurm59AEBSKIKUO4p+l4JAbRCgUm6XgFAe52GvuLrm2UsRnSXjv7vnlfd+7C/CvZearrpmvurI508Mah507NQ7zrdUdIVAJoPLlyoAgc1EWyiXiaWlhWTgWCjBMaUIDRjEHgIhsULY7RLp6OGM8uQBqLKstT6/vzz4IAyhUMu75QT1C31XM+9fRd4DTA1XjoLU+ACGdoSCFSsYlpOOL+3owSgbAT6mEgEHQof4BACiTKDM+GB80plI6yYR0wCuDTIGAMokiXXQAALoe8+LpouPLiqdQ/4NcycClZQMA7o81pIs2ciUjzFJxDzJ7SRdgv5onWrL6yQvXS3pVZI2km9DimC/Ncce7Vg8tp41rm28uBJgrmy4AtJw2Elrci1NQ1+p5sf45tccbn5+QnDWSzHlYNGPM1nyrsbtJlMVYfjgyheqBTEE9+PUMJlsiAEjpG16zn8hdRBQTaTIZ2Bcpt9H8vn/2T2e8+G1tFo2mw8SOdj+xvqah0XSwbZHgc0DN6SLVJw/yt/UFPW7AtpV9LbgAAAAASUVORK5CYII=',
    conciliador: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABkklEQVR4nOVVMUvDQBh9EUFxqSAITskguGjFRcSloCC0v8CpOmcN+iNqszqrm79AEBxEkJBFUBEKDrlJKAQalIKDxOnOJnffJddWiviWJN93995977vLAf8abqOduo12qhszPSxx2bFT4yDf2zggBY0ETFZuLFBETlVhbJEKy0trZK6UwDDWlBYYhRwALF1StzsoXD+cZziVApxY560Kr29PkkhGoNmqpRfHtxZ/NyEfnMffAUUPTImL5koCjMWZgYzFYCyWyPLxZquWqsZJPRilAuDHKlIgL3TlRwCAuudk8vl4npjD6CRTdulQKDC4ctteIHMUSt0Hdc8RlgDAC95LkWsFuBV81RRhkWXaX8Wus5quVBYx780p8z2/j07SxU30TPKICviuUe2Gnt8HACHEv1XI80gWues74hx0ki5JRM35wFcmN5YLR4dSPdChqAe/XsFkLQKAqr0tGvjI7i0qRmEyFUSX1TQIEwDA0dmMiN+dziIIk0zs5PATW5sVBGGCfZ9JfFKAk/NJpk+VyN/GN9BYxFw5IhRJAAAAAElFTkSuQmCC',
    duerme: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABpklEQVR4nOVVv0vDQBh9EUFxqVAoOKWD0EUrLiIuBQXB/gWCpdq1a9E/ojZrZ3UpgntBUBBBQhepilBwyE1CodCgFBzkHMrFxPuRXNoi4ltyvO+79/J9d/kC/GuU8zVazteoKmc6rnDU3KlxiG+v7ksNtQx03lzbIExcVoV2i0RYXFiWxiIZxGlNZINRxAHAUAVVt0OGy/vTgKbQgAmreivCy+sjZxIwKFZz9OzoxmBrHXH/PrYGBGegKxy2lzMgpBfLpFjNUUJ6HM+dwSgVAN+tkhrENfopzBD6HTQtB03LATBsH2uDn1chdFzvVNLe2jSTnoGfV0FrFjUtB88XbwCAUqGBUqERukdaASE9mGYywMneWnR7GJSjYiu9RDOJFOYrc8J43xqg43Zx5TxJdYSB8somBYCO20UmkfJ4ZtS3Bh7nz6m3rzm9sfwPVJi4gfCQ3/c+h4t6kPe3Rpjf5mMTryDSLVIh1i3yI2tueDPpgdwZMk6G32mRc56ldssFAByezHj8bX0WdssNcMcHH1hfS8Buudi1CKfHEUycbdJ9ikz+Nr4A6RXAPiP389AAAAAASUVORK5CYII=',
    enamorado: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABu0lEQVR4nGNgGNEgy6vnf5ZXz398aljINZhYtUzUMNzNMB6nhSRZQIrLSbaAkOG4fEFyEGEDKpK6OOWIsoCcoCHaAkoMZ2BgYGDEJ4kvdeACu84vRDETqwUwg/GFLTZw5/llDEtQLIjrsv+/qOwgI4xNiuHI+mBsBgYscUCqwYT0Yljw8OFbsiyJ67L///DhWwxxFAsWlR1klJcXhvOrHkij0ITE5eWFGZCDh4EBS2GHHgfohqBbgq4Prw/QQZvCUxT64cO3DA8fvsUQxwfwWpB0jpuhTeEpw/beBwwMDJAggAHbtUfhavABnBkNPaJhlsCAZ7ECCh9XEOGscB4+fIviYnQD0dXiAniLCmcFnf/q/GIMAsVcWOU/9H5juPnxFcPeB1dwmoNVIkvf6T8DAwPDzY+vGNT5xeDiMIs+9H6DiyGrmXZxH4Z5VKkP8AGaW4A1kr9E/4UwpqGKIwcNVvUXMeVo7gOiUhE+QFYqQgZ68lbwDHfp4TFGXGK4wMAE0YOVev9PnPrIwMDAwFC6gB0ufngaB8OJUx9RxLoTfjJYmPEznDj1kSGi9yGGeRgCMMNhmkilsVkytAEAfgDL1YWPU2oAAAAASUVORK5CYII=',
    enfadado: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABtElEQVR4nOVVu0oDQRQ9K4JiE0EIWCWFkCZGbERsFgwI5gsEIVrHMuhHxGxparXzCwKCQhAkpBEfCAGLnUoILGRRAhYyNs5mH3dmd5KIiKfZ4c6dc+6cO7MD/GtUSnVeKdW5Kmd6VOKkuVOTIN9a3ZMKagnoVK4tEEcu24W2RRSWFpelc4kERrEmscA45ABgqCZVp0OGy7uzACcpIIhV3lJ4eX2MiAQEyjWTnx+1DDHWIfevE2OA6IEucdzaiABjjpfYtGw0LVtK6J8v10zOmBPJifSAqqJp2diuZmNjwNAqqUBYSFRICfjjYWIBrZvMmAPKBhVif9eiQn8vnvFG2gMMdy52lOg90OlBGNIemAd5DgCZzIKSQFjWOnkyKiubHAAa99f0RQujmM3zXCqN+eocOd+3Bui6PVzZNLlUQCR33R5yqbQXF0J9a+DF/DlhcmBC74EKIz36YVCVKwXedz+/VwbjfmuS4ncsEpekmM2P9ZoBMccUAAqZDU/kgd0aspgMP24RqW5fFHi74wIADk9nvPhNYxbtjhuIHe9/YH0thXbHxY7FInyRgCAXi3S/lMjfxhdxJ9O0vy3spQAAAABJRU5ErkJggg==',
    ira: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABu0lEQVR4nOVVu0oDQRQ9EUGxiSAErJJCSBMTbERsAgkI+gVW0cZm2xA/Ism0adKoYOEXLAgKIkhIIxqbgMVOJQQC2SZgNRYyk93MY3fWgIin2eU+zrlz751d4F/DOWoz56jNTDHLSYnjxi4tgvxg50QraCVgU7m1QBS57hTWLVJha3Nb64slkKQ1sQV+Qg4AKZPTtB063D5fhjiVApzY1FsV3j8GkkhIoNYss6vzhxR/tyEP5vF3QDEDW+KoXEmA0rEIdIkHl3hawqC/1iwzSsdSjDQDVRUu8XBYz0XagFmrtALzQrxClUDQPk/MYXWTKR1D1QYTIj/XvEKXeDhrfa9ttzFQtieRQBDdxsAm3CzAW5HNbgCQZzAfp4PxU1HNFVg+ncF6fU3pn5Aphv4Id96blkfpcEoVBgBDf4R8OiPsXGhCpsIWjOm83Et80hZx8iRQ5YoZiAt2PaukmivEEuPxTqnCOA+/F9IJVMfkmJBpqD1xchfyyzQh1haZkGiLgihm98UcXulTSmfT4Xda5N0UWa/vAwAaFyvC/thZRa/vh2yt00/s7abR6/s4JlTikwycnCfZPlUifxtfOxzb2SIsrgIAAAAASUVORK5CYII=',
    malabar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABpElEQVR4nOVWv0vDQBh9VUERoZZCwSkdhC5acRFxKSgI9i8QhOqctejYwbE2a2YtOPgXCA6CCBK6SBUEwaE3iCAEG5SCg8Tpq633I3exRcS35PLdfe9937tcEuBfwy7WQrtYC1VrxuIS664dGQT5+uK2VNBIwKRyY4EoclkXxhaJMDszL53TEohjjbbAT8gBIKGaVD0dMpxdH/VxCgWIWOWtCA9Pt5xIn0CpWgjrexcJGpuQ9+bRGBDsgSlxVC4nwJgfS6RULYSM+Vyc2wMR+anTAgBslLPKGPBlFYF72e1bLwCACktFFS3Mq3+La71NqUqywLLSXOUycHtQYSmuerLDstJcTJUHGHTQS3iHV+0OhAfNXlgNAeBt60OLZOp4FADgNs85PmUHj66PXDKD6fKkcL7tdHAfPCOXzEg5tCxqOx0A6ArRvQ6EAtTqWnZO68CJrCEM5IOjgtFfhYk1hKF3MHQB5RcNAPLWSnejb9hVQhaT4Xc6aJ3kQ68RAAB2D8e78Ut3Al4j6Isd7LxjeSkJrxFg02EcHxcgckoyvYpE/jY+ARtKsqGF3RlDAAAAAElFTkSuQmCC',
    mareado: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABqUlEQVR4nOVVz0sCQRh9G0HRxUAQOq2HwEsaXSLqIBQE+hcEgXb2KvlHmHv1nN76C4SgQKIQL2F2ETrsnAJBcCGEDjEdYrZZ54c7mxLRu8zs+755b+abj1ngX6OUr9FSvkZ1OctRhcPmLs1D/HinqDQ0MjDZubHBLHHVKYxLJMPmRloZC2UQpTShDX4iDgCWLqjrDhWuHxsBTakBE9bVVoaX175gEjAoVLO0WWlbbG4izq9jc0ByB6bCs9YKBoSMIpkUqllKyEjghTvgxVuO6/O5chKzeOC7VAzCCZqVtsWS+vcN6W5lPL+Oh/Y1TR8UA9+sBNO8DlqD6ePbdhyEjAReB6O3qOW4sO144A4iG0x3RMtxkSsn/VGXy0P7VBwlt2gqlsB6eU0aHzsTDLwhbtxnpY40UNo+pAAw8IZIxRI+z4zGzsTn+Jx671bQm8v/QIeFG0jb9O3042tSD/J8aaT5PTG28BOE6iIdInURj4y97z9+T+TBUnEq/E6J3KsM7XQ9AMD55YrP39VX0el6Ae7i7B17uzF0uh5OHCLoCQQTZ4tMR5nJ38YnPs3Gczeie/UAAAAASUVORK5CYII=',
    pensando: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABk0lEQVR4nGNgGNEgy6vnf5ZXz398aljINZhYtUzUMNzNMB6nhSRZQIrLSbaAkOG4fEFyEGEDKpK6OOWIsoCcoCHaAkoMZ2BgYGDEJ4kvdeACu84vRDETqwUwg/GFLTZw5/llDEtQLIjrsv+/qOwgI4xNiuHI+mBsBgYscUCswdt7HzBs731AUC+GDx4+fMsgLy8MNwQGPIsVcFoEk4PpRfYBRhxgcwXMInRLsIkjG87AgKWwozQO0AFRpSlyEDAwMMCDEFewIQOSigpscUMIEF0fEBPhJFmAnJoIGQoLOmwAb1HhrKDzX51fjEGgmAur/Ifebww3P75i2PvgCk5zsEpk6Tv9Z2BgYLj58RWDOr8YXBxm0Yfeb3AxZDXTLu7DMI8q9QE+QHMLsEbyl+i/EMY0VHHkoMGq/iKmHM19QFQqwgfISkXIQE/eCl4mXXp4jBGXGC4wMEH0YKXe/xOnPjIwMDAwlC5gh4sfnsbBcOLURxSx7oSfDBZm/AwnTn1kiOh9iGEehgDMcJgmUmlslgxtAACB1sLgzDmNWAAAAABJRU5ErkJggg==',
    picardia: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABq0lEQVR4nOVWv0vDQBh9VUERoYpQcEoHoYtWXERcCgpC+xcIQnXuGnR06FibtbMWHAT3goMggpQuooIgOPQbRBBCG5SCg8Tpoun9yF1/IOJbcvnuvvfyvS+XC/CvUciV/UKu7KvWjPVKrLt2ZBDkm8s7UkEjAZMnNxaIIpdVYWyRCPNzi9I5LYFerNEW6IccAGKqSdXbIcP5zXGIUyjAiFXeivD0cs+JhATypYxf3b+MsbEJ+c88NgYEPTAljsrlPhVErpZIzWkG46ydRL6U8YlcWNZsaB3Xg34qAL6tYuAqKFotAMABzSiJWAVZOxnKq3ati9wHNacZkBG5IHKjUkIwtojIxcPZW/Dk3Yi0SIbupjIUrZbSTuFGKyyt+wDwvv2pJT51MgoAqNxecHzKCp4rLlLxBKbtSeF82+ng0XtFKp6QcmhZ1HY6ABAIsXsdCAVYqRvJBa09IbKGYSAHjgpGfxUm1jAMvYKhCyhPNABIW2tBo+/oOiaLyfA7FTRP03694QEA9o7Gg/hVZQL1hheKHe5+YHUljnrDw5ZDHB8XYOQsyfQqEvnb+AK9O7fhgaqeegAAAABJRU5ErkJggg==',
    rey: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABp0lEQVR4nO1VMUvDQBh9lYIiQiyFLg7J1qXUqSIuBTv1F+gkzhW6BB0cOjhWMliwo4iT3UUnhSJIqYsWQbrlBpdKsRksOMVBLiS575qkpRShb8nl3d17ed/d5YA55pg6vt+P7ShtPxaCDD47N5HakQ0mRSxogNnISuO7oe10SK3QCV7OVpz2hVojeQqBCa51NVSCXYORWnH3y141b18dNWO8DQC3YdQBAEzQAIgSceFxQM0VDBjrj2WyV83bjPUFXqjbJAkAwF0e0sBvdKJ+AQAqLOHp9/N+YY5IB42xPqgyjEKgQYUlkCtbAABVTTp8rmwJqSjEA0cAKOoa7gwTAPBcU5ArmyjqWpip8jXIH2RswPvVFHjJmudvpNbIk1zQMnZaSWFVXyb7B8YQXauHe5MWlxqU1rdtAOhaPaSVlMNzo4ExdDj3mPrrg6AndS5oGc95WCslPVvzo+7dTbIUs70P+BqMQtAaTD3B7K/MrLrlLHaHPcVknAyzSWA2snar/ff/ObxcdPjH+hJabcvDne7/YHNDQattkdemQHBxPinqU3Y3/1/8AjDqwmEopnDEAAAAAElFTkSuQmCC',
    risa: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABoklEQVR4nOVVv0vDQBh9FUFxqVOpk4EKXWzFRUSHgoLQjkJBEFrnrkFXca3N2lnd/AsKgoIIUrqUqkvBITcJhUIDUnCQc5CLSe9HcmmLiG/J8b7vey/33ZcL8K9RKdRopVCjqpzZqMJhc2cmIb63XpYaahnovLm2QZC4bBfaLRJhZSkjjYUyiNKa0AbjiANATBVUTYcMN+1Ln6bQgAmreivC69szZ+IzKFVz9OrkPsbWOuLeOrYGBGegKxxUyxkQ0o9kUqrmKCF9jufOYJwdAD+tkhqIjBqWjbxp+OKj3KgwQ+B34BUipA/WhrxpoGHZQeXB13XeNFDdP5NET8c3AIDMdllqHgRpi0QTUUymUEymQuUyKK+KXWOVpuMJLJoLwvjAGqLr9HBrv0h1hIHK2g4FgK7TQzqecHlmNLCGLufNqXfuOL2J/A9UmLqBcIreDz+/F3U/722NML/Dx6a+g1BTpEKkKfIiu7zl3klP5DEm42T4nRbZ11nabDkAgOOLOZd/qM+j2XJ83PnRBzY34mi2HBxYhNPjCCbOinSfIpO/jS9A2bvjBIxPmQAAAABJRU5ErkJggg==',
    saludo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABtUlEQVR4nOWVP0vDQBjGn4iguEQQCk7NIHSpFQdFXAIWhPYTCEJ1ruBS9EPUZhHsrG5+goKgUAQpdRD/LAWH3CQUAg1IwUHOxYuX5C7JpRURnyXHe/c+v7v37nLAv1a13KDVcoNGjZlMa5x07MQ4zDeXd6RAJYDKzJUBceayVSiXSKSF+UVpXyJAmtIkBoxiDgBaVGfU6ZDp8v7M5ykEMOOo2or08voUgvgAlbpJzw/bGmurmPN5rA0I9kDVOC43BCDESQWp1E1KiBOKh/ZglBUA36WSAkSglmWjVDN8/cFY0Jgp9h7wRoQ4YGUo1Qy0LDsuPR7AG2Wzc0Iwr0rdpPzqE70HPOTuWMfKvthcJOkemHt5ys84SoQ4aJ88a9WlDQoAzYdr8UULqmjkaU7PYLY2I+wfWEP03D6ubLG5FMAG99w+cnrGizPQwBp6MX5M0BwY03sQpVSPflCimUcC3rY/vjL9cb40SfU7JWLXvmjkR/ovATHHFAAK2XUP8khuNVlMph8vkZBuXxRop+sCAA5Op7z4TXMana7rix3tvmNtVUen62LLIiG/UICZsyTVrwjyt/UJkHzM5Y3sDtwAAAAASUVORK5CYII=',
    sorpresa: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABr0lEQVR4nGNgGNEgy6vnf5ZXz398aljINZhYtUzUMNzNMB6nhSRZQIrLSbaAkOG4fEFyEGEDKpK6OOWIsoCcoCHaAkoMZ2BgYGDEJ4kvdeACu84vRDETqwUwg/GFLTZw5/llDEtQLIjrsv+/qOwgI4xNiuHI+mBsBgYsORlZwfbeB3Bxz2IFFHXY5LA5CsMHDx++ZZCXFybF8XAA04vsA4w4QHZFV1AjXLxsXT0DIXEGBgYUwxkYsCTTRWUHGZEV6VrHY3Utuji6PhggWJpeProQzn748C1WcXwAZz7AlYpwxRE21zMwkFgWbe99wHBtzWdStOC2ADk4CAF8avEWFc4KOv/V+cUYBIq5sMp/6P3GcPPjK4a9D67gNAerRJa+038GBgaGmx9fMajzi8HFYRZ96P0GF0NWM+3iPgzzqFIf4AM0twBrPvgS/RfCmIYqjhw0WNVfxJSjuQ+ISkX4AFmpCBnoyVvBc/Slh8cYcYnhAgMTRA9W6v0/ceojAwMDA0PpAna4+OFpHAwnTn1EEetO+MlgYcbPcOLUR4aI3ocY5mEIwAyHaSKVxmbJ0AYATKvK6VnewWMAAAAASUVORK5CYII=',
    sospechoso: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABmklEQVR4nOVVP0vDQBx9EUFxqVAoOKWD0EUrLiIugoJgP4EgqHPWoh9CmzWzuvkJCoKCCBKySNWl0CE3CYVAA1JwkDjIxUvvT+5ii4hvyfF+v3sv9+5yAf41nEYrcRqtRNUzXVRYt3dqHOI7q4dSQyMDkzc3NsgTl63COCIRFheWpTUtgyLRaBv8RBwALFVRdTpkuH68yGgKDaiwKlsReq/PnEnG4OB0M7k8ubPo2EScnUfHgGAPTIXz5nIGhETaJm03RNsNU3FCIq6H2wNWnE4GgN1mlRMf5YDvqKQGIiMdjApT5H4HbAyERKAxsLwKudc1G4Ntl0FIJI2nkAGFaj8KGdAobLusFBWdHBbKq2K7upTUShXMN+eE9YE7RDfu4yZ8keoIC87KVgIA3biPWqmS8tRo4A5Tju3xOrec3lj+BypM3EC4yW/7H18DL8uz0Qj7O3xt4ivQOkUqFDpFLOr2RnonPZEHS8bJ8DsRhVf1xA9iAMDx+UzK33uz8IM4w50dvWN9rQQ/iLHnEk6PI6g4nWT6FJn8bXwCIH7IS+9mTakAAAAASUVORK5CYII=',
    triste: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABtklEQVR4nOVWv0vDQBj9KoLiEkEoODWD0EUrLiIuBQUh/QsEobq2a9DVvfbWztZNcOkUEBRUkNJFqiIUHO4moVBoUAoOEge549L77pr0ByK+Jcf7vnsv93K5BOBfo5grB8VcOTD1TA8rHLV3ahziO2v7WsNYBnHuPLbBIHHdKmJHhGFpcUVbi2QwTDSRDUYRBwBImIqm3aHD5UM1pIkacGFTthhe354Uk5BBvpQNzo5uEnwcR1yex8cAyDPAhD1CFUGMw+YqBox1Qo0eoeC4tiLmuHbIJF/KBox1lD7lGUQRl9HfI8eDGmBGUdAvzDHwPfAIFVEw1gEeg8ybMNCgUKuKCFKpBcE7rg2FWnV0AxkeofBy8R5nit6AR0Fvj4W449rK7pF7MRiPim17OUhbSZh359B6l/Sg5bfhij5rddBCcXUrAABo+W1IW0nBc6Mu6QlO7qk0rxW9sXwPTJi4AfpX8bH39TOohHk5GrS/qdYmvoJIu8iEoXaRjExqU5xJj+w+oeN0+J2I6HkmqDd8AAA4PJ0R/F1lFuoNP8SdHHzCxroF9YYPu4QpegrBxfmkuFfM5G/jG5eU1XVmbbjRAAAAAElFTkSuQmCC',
  },
  trapero: {
    alerta: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABpUlEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDhgYGBiW6mnh5ZNlATFhTEgN0T4gBmxd0fF/64oOFAuJtiD60jW8fFyAZB/cvbCBJPVEpSJkoGwQgFXcX0zt/6y8eRg5nCgL0JPj/e8fGRQ5+YlyEMEguvrhLdxQcgBVUhEsqWIrADGCiNhCjFhA1XyA1wJsmYQUgKt+YMrSd/rPwMDAcPQGD8PRGzwMG1/dYpSWlCHXHgzAyMDAwFDVMAXF5W0NOYxeRvIYvolzhNCL9mMatO3cQ6w+YGFgYGA4sH8PhgTrE3YU/v3vHxmWP4Gk/SfQfDBxMgdDfu4PvD6Ax8HuGVoMy7Lu4VVMDsCaishJqrj0wC14fWkLSQZOnMyBQuMC8FSEDIhNRdrJjwiqYWRgYGCwsg9AsUT0OmZZj1zA4SrscBYVDo4uKIJXsVhALmBhYGBg+LB+HcO0i/vgtlOzPMKaOci1gNjmJIolpNJEA24egf/cPAL/SWGTZAG1AADlNJil3zscpwAAAABJRU5ErkJggg==',
    amenaza: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABvUlEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDhgYGBjOxnkxLNXTwmBTZAFyGN+48IABG5tQPBAVRAwMDAzRl65hsKkaROQCpix9p/8MDAwMVQ1T/lc1TPnPwMDAABNDBncvbMBKEwKMMMORBdsachgZGCDhqy0gzDDx2XWsmmFBhC9XszAwMDAc2L8HryvQw/r+948Mipz8hBzPwMCAFAe7Z2gxLMu6h6Hg6oe3cEPJATSPZHgyfX1pC1yQ2IIMXT22uGDClmKkJWVIciU+wMjAwMBgZR+AYono9WsYCpEjFlckY/MBCwMDA4ODowuKYNvBDYykBhMugDP9ehnJY1gQ5wihF+1HFWd9ws7AwIAjDnBZwPqEHQU/uf2DYflidobliyFs1ifsDNPK+eGGMzAwMGxd0YHhKKILO3wgbVISAwMDA4N3RAVxPiA3/LH5AGscYLMAPRVtmiMOl8vP/cHAwEBiHBADtJMfEVRDtg+IzQe0r3AGjQXIQUJsXYAXwOKBVJpowM0j8J+bR+A/KWzKvUUGAADaxrCNB98obgAAAABJRU5ErkJggg==',
    baile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABuklEQVR4nO1VPUgCYRh+TowshQ4kIQoiggYFjUaXUpxachdaggIx2pucxFWMqMbAclTIKclamktIQSghpMEIcsm2a7g+ub/vvu+uA5ee5bt7ed/3+e553pcD/sGAwJu4FViRlO/Vfoer1mWnOS1mi8CsEQ8JkyAk+lkppnDzJNW/+obxxHSAWcvlAUEpHFSdPDAlUGpcCgeRarYAAKlma0TC8oH7C0hz2jsA1Mp5qVbOqwi5CJ4fKobx0/szZq07HYlLx483wmH2SAKAXDYjkBhJWl5NGpLsRXeZBAIAkOYEuWxGAGR9Q6Ifhbe2YTGZomq/IxAvtBvuBoDbRt30Ftpx7A4HWJqaYd4eUHhwfRLERfpFl/D0+TFqageW9oAGmjyAYpPfm1e6AifgSkfiumbzcwtO9ZenKLqeVJHMtvVLpDSWZjJVoo1YQhXM3VUEp2Si/pU21xZ1BNsx+TxvqOMTvUkADJO1IEUE3eEAlz1Zlt6vRIWiBwf739TbAw6NqWUCR8fUbmGh6FGdjhMAQGjnlZljOEVGEtndg/GYPBYCpSS8/wJTEB+sntzw+kTJ6xMlK89//ywb+AH64aYU/JYaJwAAAABJRU5ErkJggg==',
    base: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABqUlEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDigBeC1ADuOleloMS/W0MNiE4oGoIGJgYGCIvnQNgz34g2hIWEBUHKCH9f3vHxkUOfmJsoCgD65+eAs3lBxA/yAithDDpgdbCUu/VLR1Rcf/rSs6SHY9QQuy9J3+MzAwMBy9wcNw9AYPw8ZXtxilJWWoZgEjAwMDQ1XDFBSXtzXkMHoZyWP4Js4RQi/ajyrO+oSdgYEBexywMDAwMBzYvwfDZpgmGLj//SPD8ieQtP8Emg8mTuZgyM/9AVezdUXHf++IChRL4Klo9wwthteXtjBETVPCsIwQSJuUxMDAwMCAbjgDA45URE5SZWCA+ABdDO6D15e2kGTYxMkccDo/dx4DAwOOfABLRciA2FSknfyIoBpGBgYGBiv7ABRLRK9fw1CIXMDhKuxwpiIHRxcUwatYLCAXsDAwMDB8WL+OYdrFfXDbyY1kbABr849cC4htTqJYQipNNODmEfjPzSPwnxQ2SRZQCwAAMESYeHhwydcAAAAASUVORK5CYII=',
    codicia: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAAB1ElEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSAgdfr1f9f7BS7/+DlXpwi1mI0bjn2yus4i5cYij815e2YKghKg5IBSdOfSROob+Y2v8qNcv/3DwC/2HeR2b7i6n9JxQPRPsA2fvYgoKBgYFh64qO/1tXdKBYSFQc3L2wgUHZIADO105+BBdPt0rDq5coC5QNAhjuXtiAIU7IcKItgFmCDpBTkb+Y2v9ZefMwcjhRFqAnx/vfPzIocvIT5TCCkXz1w1u4oeQAquQDWFLFVgBiBBGxhRixgCY5GasF2DIJVSzI0nf6z8DAwHD0Bg/D0Rs8DBtf3WKUlpShmgWMDAwMDFUNU1Bc3taQw+hlJI/hmzhHCL1oP6o46xN2BgYGPJF8YP8eDJthmmDg/vePDMufQNL+E2g+mDiZgyE/9wdeH8DjYPcMLYZlWffwKiYHYE1F1EyqcAtwFcG4wMTJHCg0TgtgqQgZEJuKYMU2PsDIwMDAYGUfgGKJ6PVrGAqRCzhchR3OVOTg6IIieBWLBeQCFgYGBoYP69cxTLu4D247NSMZa/OPXAuIbU6iWEIqTTTg5hH4z80j8J8UNkkWUAsAAKT6vbT4Dv5NAAAAAElFTkSuQmCC',
    conspira: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABxklEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDhgYGBjilY3w8smyADmM3bh/MCzV02JgYGBgWKqnxeDG/QNDDTZAVBAxMDAwRF+6BmdbLGpjUDYIoG4QwcCqORVwOm1SEvUtIBVQbIG2gDBDlZolznggKg7Qw/rsmRNEOwBveYKcQu5//8igyMmPwkbOhG23jmM1i+hUhA1c/fAWxTHYCkAMC4gtxIgF9EtFW1d0/N+6ooOqrmdgYGBgytJ3+s/AwMBw9AYPw9EbPAwbX91ilJaUoZoFjAwMDAxVDVNQXN7WkMPoZSSP4Zs4Rwi9aD+qOOsTdgYGBuy1HAsDAwPDgf17MGyGaYKB+98/Mix/AkmmT6DJdOJkDob83B94fQCPg90ztBiWZd3Dq5gcgDUVUTOpwi14fWkLSRonTuZAoXFaAEtFyIDYVKSd/IigGkYGBgYGK/sAFEtEr1/DUIitLEIHOFORg6MLiuBVLBaQC1gYGBgYPqxfxzDt4j647dSMZKxFLLkWENucRLGEVJpowM0j8J+bR+A/KWySLKAWAACLuZks4EYblgAAAABJRU5ErkJggg==',
    duerme: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABtUlEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDigBeC1ADuN4ZSOGeGUjDDaheCAqiBgYGBgW3j2HwR78QYQNrJpTQVsLwlI6SFJPVBygh/X97x8ZFDn5ibKAoA+ufngLN5QcQPNIxggiYgsxbHqwlbD0S6ZbV3T837qig2TXE7QgS9/pPwMDA8PRGzwMR2/wMGx8dYtRWlKGahYwMjAwMFQ1TEFxeVtDDqOXkTyGb+IcIfSi/ajirE/YGRgYsMcBCwMDA8OB/XswbIZpgoH73z8yLH8CSftPoPlg4mQOhvzcH3A1W1d0/PeOqECxBJ6Kds/QYnh9aQtD1DQlDMsIgbRJSQwMDAwM6IYzMOBIReQkVQYGiA/QxeA+eH1pC0mGTZzMAafzc+cxMDDgyAewVIQMiE1F2smPCKphZGBgYLCyD0CxRPT6NQyFyAUcrsIOZypycHRBEbyKxQJyAQsDAwPDh/XrGKZd3Ae3ndxIxgawNv/ItYDY5iSKJaTSRANuHoH/3DwC/0lhk2QBtQAAogia5vBmpOoAAAAASUVORK5CYII=',
    farol_susto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABsUlEQVR4nO1VPUhCURT+nhhaCgmREAURgYNCQaNLGU4ttgcuQYH0szs5iasoEQ0NQeX4hJySrK3RhAwCE8LJCHLJtttgV97zvp/j84FL33LPO5xzvvvOd+69wD9MIFEDY/4AU34X26+kXIeV4no+SwRGhSgkpgQh34xZiCGclKDyd1vTH53ym+aSNACARlXG5UpQsEciUPb4MZ6Elm2mA/kPKCgVMqxUyKgISRoAwE6tLtgkDRKrmwwAkqk8S6byDAC4bxCNqoxGVabuCQDgPHm6k3hhTpROHZBPOEfMH2BnR+fCCXcCwH2lbJjMW7Ef3gMALEsuLE1Ok4j7It+eBnGVeBMCnr8+AQDNbodUUJdgFPBR1boA+1P0UbsREuyAQ2ti5ucW7Krfew/C69sqktmXuhDY7Hb6wiptJXRbtBGJqpzpB1myq0268761tigQxCO99aKi9k+0XABMRB4ET+Jodju4bvXa0vprUTbnxvHhj+7uAZsvOzKBrWNqNTGbc6tW2wkAILT7bhqjOUVaLbJ6DsYj8lgIlC2hvgWG4DoMu5Lh8fqYx+tjw9ij/5YF/AIumJ9k0bKrUwAAAABJRU5ErkJggg==',
    malabar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAAByElEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMSoYwEDAwPDUj0tBgYGBoboS9fg7Pl33hDUhzeIiAljQmqI9kH0pWsYbGKCiKhkevfCBqziM4/NIqiXKB8oGwRgtSTdKo06FsAsQQdUS0XoBt3//pFBkZOfKIcRjIOrH97CDSUHEBXJ5IKtKzr+YwQRsYUYLj3opSzRkUyOZQwMSEG0dUXH/60rOkh2PQxsfHWLEVsdwZSl7/SfgYGB4egNHoajN3gYNr66xSgtKUOuPXCLNr66xegdUcHIyMDAwFDVMAXF5W0NOYxeRvIYvolzhNCL9mMavO3cQ6w1HAsDAwPDgf17MCRYn7Cj8O9//8iw/Akk7T+B5oOJkzkY8nN/4PURPA52z9BiWJZ1D69icgDWfEBpUsVqwetLW0gycOJkDhQaF4CnImRAbCrSTn5EUA0jAwMDg5V9AIolotevYShELuBwFXbY8gELAwMDg4OjC4rgVSwWkAtYGBgYGD6sX8cw7eI+uO3kRDIugDVzkGsBsc1JFEtIpYkG3DwC/7l5BP6TwibJAmoBAKwAp9MYcH+cAAAAAElFTkSuQmCC',
    risa: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAAB30lEQVR4nO2WPUhCURTH/y+MLIUESYiCqMFBwaDRpQynGgxaIqGhwCAS12gQcQhXM6KpIZBc+hB0SrLFvR5oIoQQTkqgS7a9BnsXn+/j3veyrf9y3z2cc37vvHPuVeBfFHGsjgGHU+jfZ5s1ptgRI8nVbIYAWolYIFSA22anuWjKxOJU+Gwq2v0TDmosUw9EpT0uycoiTUD/N057XAjyFQBAkK8QCK0PzBWIydX2amLqAQC8Pd/LbPve0PAAABDfjJPn6E2UKUZXk41I87gHHE7BbbOj3P6Q2OvdDubHJ8le69qgViAmr3c7NFdjgN9K1mTWS0wpRulT/XkFBJDPJIR8JqH77amAg8VVAQBKVStKVSuyzRo3Mz07NAAHAMexM8mbn8QOubWlOVk1O77eelWU2kcbYwCUe2ACgKdiQUYWg0TVux1cN3qz3/g5B8mUGZHwF/HJZxLC+taRBEKm6OHChRafw/b5ggxGU+h0FwAwmBxQmSIjowr0Khi0kQpafE5XsmTKTNZI+BKAyjkQp6hfrFPk3nun+nAA4F3ekECmXuU/Jv0X3OBlJ0p1ilZ8fomxrAAwKhMAtO9ucf7ySOhGm6wkxXvcKID176QEondllsVqEyxWm6DnWRdgWPoG6+KpGezIrn0AAAAASUVORK5CYII=',
    sombrero: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABuUlEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDigBeC1ADuOleloMS/W0MNiE4oGoIGJgYGCIvnQNgz0ogohoHzAwMDCsmlMBZ4eldFDfAmINJdkC9LC+//0jgyInP1EWEIyDqx/ewg0lB9A/koktxLDpwVbC0i8nb13R8X/rig6SXU/Qgix9p/8MDAwMR2/wMBy9wcOw8dUtRmlJGapZwMjAwMBQ1TAFxeVtDTmMXkbyGL6Jc4TQi/ajirM+YWdgYMAeBywMDAwMB/bvwbAZpgkG7n//yLD8CSTtP4Hmg4mTORjyc3/A1Wxd0fHfO6ICxRJ4Kto9Q4vh9aUtDFHTlDAsIwTSJiUxMDAwMKAbzsCAIxWRk1QZGCA+QBeD++D1pS0kGTZxMgeczs+dx8DAgCMfwFIRMiA2FWknPyKohpGBgYHByj4AxRLR69cwFCIXcLgKO5ypyMHRBUXwKhYLyAUsDAwMDB/Wr2OYdnEf3HZyIxkbwNr8I9cCYpuTKJaQShMNuHkE/nPzCPwnhU2SBdQCAIPcnL4cQQYnAAAAAElFTkSuQmCC',
    sonrisa: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABxklEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDigBeC1ADuOleloMS/W0MNiE4oGoIGJgYGCIvnQNg021ILp7YQNW8ZnHZlHHAmWDALglyHS6VRp1LIBZgo0mBIiKA/Swvv/9I4MiJz9RFhD0wdUPb+GGkgNong8wgojYQgybHmwlLP1y8tYVHf+3rugg2fUELcjSd/rPwMDAcPQGD8PRGzwMG1/dYpSWlKGaBYwMDAwMVQ1TUFze1pDD6GUkj+GbOEcIvWg/qjjrE3YGBgbsccDCwMDAcGD/HgybYZpg4P73jwzLn0DS/hNoPpg4mYMhP/cHXM3WFR3/vSMqUCyBp6LdM7QYXl/awhA1TQnDMkIgbVISAwMDAwO64QwMOFIROUmVgQHiA3QxuA9eX9pCkmETJ3PA6fzceQwMDDjyASwVIQNiU5F28iOCahgZGBgYrOwDUCwRvX4NQyFyAYersMOZihwcXVAEr2KxgFzAwsDAwPBh/TqGaRf3wW0nN5KxAazNP3ItILY5iWIJqTTRgJtH4D83j8B/UtgkWUAtAAA+xqd4By1vswAAAABJRU5ErkJggg==',
    sorpresa: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABxElEQVR4nO2WP0gCURzHvxeGmgcKkRAFIYGDQkE1hEsZTi22By5BgfRnFSencBUjIqQhqMShEnJKskVoLEEToYRwMgJdsu0a7OSu+/e768a+y/vdu9/vfd57v997POBfGmKojmG3lxN+59sNUuyQkcGV+gwB1AaiQDQBfteolouqLBSn4mdbtj804taMJeUAAF4er3E245PYfwII9/ghEoecrZUH8gooKmSTXCGbFAFJOQCA9UpNYpuaAwDIZWLIZWJ6QugrAID5hUXFf2G3lzvePZGccBKA34qtwCYAYJqxwmN3kialuUXVzgcAoNnrkgbUDaCIL1W5C1CyRdRLjCpTz4EqQO6QmAKIzq5wAFCusyjXWeTbDWZifNI0AAMA8cSBaOb7iW1mdW5KsppIsN+elsT9wy0rAJUk35eKEjIfxKvZ6+Ki1a/9Vq8Lj92JVNqGvZ0v1RUMcnB75MN59FXV2Yhkq8jMUh0A3is3ugJTaZuoVQTwVSQUtYr8G2+aPgwABJbWRJCx55rEsfmT2N+2UIpVtBwMiTqrMgCjsgBA5+oSh093A7qZSZZ9/hkFUJ+TIojeliwH6+IcrIvTY+sCmKVvisWdi1EjkvUAAAAASUVORK5CYII=',
    trato: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABsklEQVR4nGNgGAUEACOxCv3F1P4j8ze+ukWUXiZyDMclRpYF+AwixhKCFmgLCBNSghewEKNoz7dXWMVduMQI6iUqDigBeC1ADuOleloMS/W0MNiE4oGoIGJgYGCIvnQNgz34gwgZ3L2wAStNNQuUDQKw0oQAUXGAHtb3v39kUOTkJ8oCgj64+uEt3FByAE0jeeuKjv8YQURsIYZLD3opS3Q+IMcyBgakINq6ouP/1hUdJLseBja+usWIrY5gytJ3+s/AwMBw9AYPw9EbPAwbX91ilJaUIdceuEUbX91i9I6oYGRkYGBgqGqYguLytoYcRi8jeQzfxDlC6EX7MQ3edu4h1hqOhYGBgeHA/j0YEqxP2FH4979/ZFj+BJL2n0DzwcTJHAz5uT/w+ggeB7tnaDEsy7qHVzE5AGs+oDSpYrXg9aUtJBk4cTIHCo0LwFMRMiA2FWknPyKohpGBgYHByj4AxRLR69cwFCIXcLgKO2z5gIWBgYHBwdEFRfAqFgvIBSwMDAwMH9avY5h2cR/cdnIiGRfAmjnItYDY5iSKJaTSRANuHoH/3DwC/0lhk2QBtQAAS9ik+V4iZw4AAAAASUVORK5CYII=',
    triste: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAAB4klEQVR4nO2WP0gCURzHvxdGVkKCJURBVOCQQ+AStPQHpxp0imgoKGmIxFUawiluaTBDCiSoJXEoBJ2SagmahARLgjDCSQl0ybZrsDt8d+e9d6c09V3evR+/9/u8P7/fjwP+RRHH6uixO4TmebL8yrS2y0jwVjZDAK1ALBAqwGm10Vw0ZWJxynyVVe3uPjt1LdMbtCNNgPyONyZdxKjmowsgD37+lgUAnL9lCUhHAIOn+5rztgEAkIgFkYgFAQCHbm9nATPvj1jx8Vjx8RKERZrl7rE7BKfVhnz1k7AX6zWM9w5Ic622QT2BGLxYr9FcjQHalaKSWZuY2hq1q/q7Sk7HeSEd53XvngrYmV4UAOChYMFDwYJk+ZUbGR7tGIADgL3QMbHzg9Aut+QaU5xmfaExXtyR9u5SDwD1NzABwP1dRkEWF4kq1mu4LDVyv/RbB+GIGQH/t+STjvPC8mqQgEhZdHMyhUouhbXohAJG0/bRJgBAHhxokUVGUhVonEBuk05QyaV0BQtHzNIY8J8BaFEHYhY1izWLnFsfVB8OAGbnvARk6OVZ4djc4OTNTlTLLJpfcBPGvArAqEwAUL2+QvTpVqIbfWQ1qfZxowDW30kCondkVr/FKvRbrIKeb12ATukHcBurLfCFLXIAAAAASUVORK5CYII=',
  },
};
/* ASSETS-END */

// [0.085] Carga de imágenes y utilidades gráficas
const ART_ON = !!(DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.ACTIVAR_ARTE);
const ART = {};
function loadArt(key, src) {
  const im = new Image();
  // [0.090] Cofre de Vapor: el humo del sprite se borra al cargar (en memoria, el original sigue en ASSETS para miniaturas) y se anima aparte en renderRoom
  if (/^cofre_hydraulic/.test(key) && ((DATOS_JUEGO.GRAFICOS || {}).VAPOR_ANIMADO || {}).ACTIVAR) {
    im.onload = function () {
      if (im._steamless) return;
      try {
        const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
        const cx2 = c.getContext('2d'); cx2.drawImage(im, 0, 0);
        const v = DATOS_JUEGO.GRAFICOS.VAPOR_ANIMADO.BORRAR;   // zona del humo en píxeles del sprite
        cx2.clearRect(v.x0, v.y0, v.x1 - v.x0 + 1, v.y1 - v.y0 + 1);
        im._steamless = true; im.src = c.toDataURL();
      } catch (e) {}
    };
  }
  im.src = src; ART[key] = im;
}
if (ART_ON) {
  loadArt('celda', ASSETS.celda);
  Object.keys(ASSETS.cofres).forEach(k => loadArt('cofre_' + k, ASSETS.cofres[k]));
  // [0.086] Cofres por rareza, adornos pixel art y fotogramas de la celda a oscuras
  Object.keys(ASSETS.cofresRareza || {}).forEach(k => Object.keys(ASSETS.cofresRareza[k]).forEach(r => loadArt('cofre_' + k + '_' + r, ASSETS.cofresRareza[k][r])));
  Object.keys(ASSETS.decoraciones || {}).forEach(k => loadArt('deco_' + k, ASSETS.decoraciones[k]));
  ['celdaParpadeo1', 'celdaParpadeo2', 'celdaApagada'].forEach(k => { if (ASSETS[k]) loadArt(k, ASSETS[k]); });
}
// [0.086] Sprite de cofre según tipo y rareza (la normal usa el sprite base)
function chestSpriteSrc(type, rarity) {
  if (!ART_ON || !type) return null;
  const r = rarity && rarity.id;
  const byRar = ASSETS.cofresRareza && ASSETS.cofresRareza[type.id];
  if (r && r !== 'normal' && byRar && byRar[r]) return byRar[r];
  return ASSETS.cofres[type.id] || null;
}
function chestSpriteKey(type, rarity) {
  const r = rarity && rarity.id;
  if (r && r !== 'normal' && artReady('cofre_' + type.id + '_' + r)) return 'cofre_' + type.id + '_' + r;
  return 'cofre_' + type.id;
}
// [0.086] Texto un poco mayor (CSS: html.texto-grande). Reversible con GRAFICOS.TEXTO_GRANDE = false
document.documentElement.classList.toggle('texto-grande', !!(DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.TEXTO_GRANDE));
// [0.086] ¿Pantalla ancha? (se ven las marquesinas laterales). Solo ahí se puede abrir tocando la cerradura
function isWideLayout() {
  const fr = document.getElementById('gameFrame');
  const cfg = DATOS_JUEGO.GRAFICOS.TOCAR_CERRADURA || {};
  if (!fr) return false;
  return (window.innerWidth - fr.clientWidth) >= (cfg.ANCHO_MIN_LATERAL_PX || 160);
}
let CHEST_LOCK_ZONE = null;     // [0.087] zona de la cerradura aunque haya un modal abierto
let CHEST_LOCK = null;          // zona táctil de la cerradura del cofre activo (se recalcula cada fotograma)
let lockArmedChest = null;      // con varios cofres: el primer toque arma, el segundo abre
let lockArmedAt = 0;
let lockShakeUntil = 0;
let darkFlickerT0 = 0;
let lightOnT0 = 0;            // [0.087b] inicio de la animación de encendido de la luz
let roomDarkPrev = null;      // para detectar el paso oscuro → encendido
let npcHideUntil = 0;         // [0.087b] el cofre no se dibuja mientras entra el Duende / Trapero
let chestFade = 1;            // opacidad actual del cofre (fundido)
let keysBaseline = null;      // [0.087b] avisos "+N" de llaves
const keyToastQueue = [];
let keyToastBusy = false;
function artReady(key) { const im = ART[key]; return !!(ART_ON && im && im.complete && im.naturalWidth > 0); }
// Contenedor para modales creados por script (dentro del marco, no sobre las marquesinas)
function uiHost() { return document.getElementById('gameFrame') || document.body; }

const canvas = document.getElementById('roomCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  const frame = document.getElementById('gameFrame');
  canvas.width = frame ? frame.clientWidth : window.innerWidth;
  canvas.height = frame ? frame.clientHeight : window.innerHeight;
  // Zoom de la interfaz en pantallas grandes (el marco crece, la UI proporcionalmente)
  const maxZ = (DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.ESCALA_UI_MAX) || 1;
  const z = Math.max(1, Math.min(maxZ, canvas.width / 430));
  document.documentElement.style.setProperty('--uiz', z.toFixed(3));
  // [0.089b] Escala de las ventanas informativas (botín, tiendas, tratos, recibo, diálogos...) solo en pantalla ancha. No afecta a los puzles.
  const wm = DATOS_JUEGO.GRAFICOS.ESCALA_VENTANAS || {};
  const mz = (wm.ACTIVAR !== false && isWideLayout()) ? Math.max(1, Math.min(wm.MAX || 1.7, canvas.width / (wm.ANCHO_BASE || 390))) : 1;
  document.documentElement.style.setProperty('--mz', mz.toFixed(3));
  document.documentElement.classList.toggle('narrow-layout', !isWideLayout());   // [0.088] ajustes solo para móvil / ventanas estrechas
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
if (window.ResizeObserver && document.getElementById('gameFrame')) new ResizeObserver(resizeCanvas).observe(document.getElementById('gameFrame'));

function spawnParticles(x, y, color, count = 35, isRainbow = false) {
  for (let i = 0; i < count; i++) {
    const particleColor = isRainbow ? `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)` : color;
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 2,
      radius: Math.random() * 5 + 2,
      color: particleColor,
      alpha: 1,
      decay: Math.random() * 0.025 + 0.015
    });
  }
}

// [0.086] Posición vertical efectiva de un adorno (los guardados con la fila antigua y=210 pasan a la nueva fila superior)
// [0.087] Opacidad de un adorno que está siendo reemplazado (fundido de 0,7 s)
// [0.088] Telón oscuro: entre cerrar el botín y abrirse la tienda/diálogo no se ve la habitación
let sceneVeilEl = null, sceneVeilTimer = null;
function showSceneVeil() {
  if (!sceneVeilEl) {
    sceneVeilEl = document.createElement('div');
    sceneVeilEl.id = 'sceneVeil';
    sceneVeilEl.style.cssText = 'position:absolute;inset:0;z-index:49;background:#020617;pointer-events:none;opacity:1;transition:opacity .22s ease';
    uiHost().appendChild(sceneVeilEl);
  }
  sceneVeilEl.style.transition = 'none';
  sceneVeilEl.style.opacity = '1';
  clearInterval(sceneVeilTimer);
  const t0 = Date.now();
  sceneVeilTimer = setInterval(() => {
    const open = ['dialogueModal', 'merchantModal', 'traperoShopModal', 'traperoModal', 'levelUpModal', 'unfairDealModal', 'gameOverModal'].some(modalVisible);
    if (open || Date.now() - t0 > 1300) hideSceneVeil();
  }, 50);
}
function hideSceneVeil() {
  clearInterval(sceneVeilTimer); sceneVeilTimer = null;
  if (!sceneVeilEl) return;
  const el = sceneVeilEl;
  el.style.transition = 'opacity .22s ease';
  setTimeout(() => { el.style.opacity = '0'; }, 120);
}
// [0.087b] ¿Está entrando el Duende o el Trapero (o hay uno en pantalla)?
function npcSceneActive() {
  if (Date.now() < npcHideUntil) return true;
  const ids = ['dialogueModal', 'merchantModal', 'traperoShopModal', 'traperoModal'];
  for (const id of ids) { const e = document.getElementById(id); if (e && !e.classList.contains('hidden')) return true; }
  return false;
}
let chestUiLast = -1;
function setChestUiOpacity(v) {
  const q = Math.round(v * 20) / 20;
  if (q === chestUiLast) return;
  chestUiLast = q;
  ['chestActionCard', 'multiChestGrid'].forEach(id => {
    const e = document.getElementById(id);
    if (e) { e.style.opacity = String(q); e.style.pointerEvents = q < 0.5 ? 'none' : ''; }
  });
  const ob = document.getElementById('openChestBtn'); if (ob) ob.style.pointerEvents = q < 0.5 ? 'none' : '';   // [0.091] la tarjeta deja pasar los toques; solo el botón los recoge
}
// [0.091] Fuente hexadecimal 5x7 para la pantalla del Arca Digital
const HEX_FONT = {
  '0': ['01110','10001','10011','10101','11001','10001','01110'], '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'], '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'], '5': ['11111','10000','11110','00001','00001','10001','01110'],
  '6': ['00110','01000','10000','11110','10001','10001','01110'], '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'], '9': ['01110','10001','10001','01111','00001','00010','01100'],
  'A': ['01110','10001','10001','11111','10001','10001','10001'], 'B': ['11110','10001','10001','11110','10001','10001','11110'],
  'C': ['01110','10001','10000','10000','10000','10001','01110'], 'D': ['11110','10001','10001','10001','10001','10001','11110'],
  'E': ['11111','10000','10000','11110','10000','10000','11111'], 'F': ['11111','10000','10000','11110','10000','10000','10000']
};
const HEX_CHARS = '0123456789ABCDEF';
function seededHex(seed, n) { let h = (seed * 2654435761) >>> 0, out = ''; for (let i = 0; i < n; i++) { h = (Math.imul(h ^ (h >>> 15), 2246822519) + 374761393) >>> 0; out += HEX_CHARS[h % 16]; } return out; }
function drawChestAnim(typeId, R, aco, ctx, ox, oy, px) {
  const t = Date.now() / 1000;
  if (typeId === 'piston' && aco.PISTONES && aco.PISTONES.ACTIVAR) {
    const P = aco.PISTONES;
    P.X.forEach((X, i) => {
      const k = (Math.sin(t * Math.PI * 2 / P.PERIODOS_S[i] + P.FASES[i]) + 1) / 2;
      const h = Math.round(P.Y_MIN + (P.Y_MAX - P.Y_MIN) * k);
      R(X, 29, 4, 12, '#1f1d2b');                         // hueco vacío
      R(X, h, 1, 1, '#8a7f6a'); R(X + 1, h, 3, 1, '#b5a888');   // cabeza del pistón
      R(X, h + 1, 1, 40 - h, '#8a7f6a'); R(X + 1, h + 1, 3, 40 - h, '#5a5768');   // cuerpo
    });
  } else if (typeId === 'cyber' && aco.DIGITAL && aco.DIGITAL.ACTIVAR) {
    const D = aco.DIGITAL, now = Date.now();
    const cyc = Math.floor(now / D.CAMBIO_MS), ph = now % D.CAMBIO_MS;
    const target = seededHex(cyc + 11, 4);
    R(12, 15, 32, 9, '#0a0910');                            // fondo de la pantalla
    for (let i = 0; i < 4; i++) {
      const settle = 120 + i * (D.BARAJA_MS - 120) / 3;
      const scr = ph < settle;
      const ch = scr ? seededHex(Math.floor(now / 55) * 7 + i * 31, 1) : target[i];
      const col = scr ? '#3f8a8a' : '#5aa1a0';
      HEX_FONT[ch].forEach((row, ry) => { for (let rx = 0; rx < 5; rx++) if (row[rx] === '1') R(15 + i * 6 + rx, 15 + ry, 1, 1, col); });
    }
    if (Math.floor(now / 450) % 2 === 0) R(39, 22, 4, 1, '#5aa1a0');   // cursor parpadeante
    const LED = ['#b03a3a', '#5fd08a', '#5a5768', '#c9983a', '#1a1a26'];
    [42, 44, 46].forEach((X, i) => {
      const col = LED[Math.floor(t / D.LEDS_PERIODOS_S[i] + i * 1.7) % LED.length];
      R(X, 30, 1, 1, col);
      if (col !== '#1a1a26' && col !== '#5a5768') {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.22; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(ox + (X + 0.5) * px, oy + 30.5 * px, px * 2.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    });
  } else if (typeId === 'hydraulic' && aco.AGUJA && aco.AGUJA.ACTIVAR) {
    const A = aco.AGUJA, tt = t % A.CICLO_S;
    let ang;
    if (tt < A.SUBIDA_S) { const u = tt / A.SUBIDA_S, e = 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2); ang = A.ANGULO_REPOSO + (A.ANGULO_PRESION - A.ANGULO_REPOSO) * e; }
    else ang = A.ANGULO_PRESION + A.TEMBLOR_GRADOS * Math.sin((tt - A.SUBIDA_S) * 2.9) * Math.min(1, (tt - A.SUBIDA_S) / 1.2) + 1.8 * Math.sin(tt * 14);
    [[28, 20], [29, 19], [30, 18], [31, 17]].forEach(([x, y]) => R(x, y, 1, 1, '#dccfae'));   // borra la aguja original
    const rad = ang * Math.PI / 180, dx = Math.sin(rad), dy = -Math.cos(rad), seen = {};
    for (let sLen = 0.6; sLen <= 5.6; sLen += 0.35) {
      const x = Math.floor(27.5 + dx * sLen), y = Math.floor(21.5 + dy * sLen), key = x + ',' + y;
      if (!seen[key]) { seen[key] = 1; R(x, y, 1, 1, '#0a0910'); }
    }
    R(27, 21, 1, 1, '#b03a3a');                              // eje rojo
  }
}
function decorFadeAlpha(d) {
  if (!d.fading) return 1;
  return Math.max(0, 1 - (Date.now() - d.fading) / 700);
}
// [0.087b] Las tres filas de adornos (arriba, centro, abajo) mantienen siempre la misma separación entre sí
function decorRowY(row) {
  const h = canvas ? canvas.height : 600;
  const top = Math.min(DATOS_JUEGO.DECORACIONES_SALA.FILA_SUPERIOR_Y || 350, h * 0.32);
  const bottom = h - 210;
  if (row === 'top') return top;
  if (row === 'bot') return bottom;
  return (top + bottom) / 2;
}
function decorY(d) {
  if (d.row) return decorRowY(d.row);
  return (d.y === 210 || d.y === 270) ? decorRowY('top') : d.y;   // adornos guardados con la fila antigua
}

const TOOL_COLORS = { picks: '#fbbf24', proPicks: '#cbd5e1', usb: '#22d3ee', valves: '#fb923c' };

// [0.086] Indicador pegado a la cerradura: coste en herramientas (color de la herramienta) o "faltan N" en rojo
function drawLockOverlay(lx, ly, lr, chest) {
  const now = Date.now();
  const req = getRequiredToolCount(chest.rarity);
  const have = STATE[chest.type.consumible] || 0;
  const missing = Math.max(0, req - have);
  const armed = lockArmedChest === chest && (now - lockArmedAt) < 4000;
  const shake = now < lockShakeUntil ? Math.sin(now * 0.06) * 5 : 0;
  const fs = Math.max(13, Math.round(canvas.width * 0.028));
  ctx.save();
  ctx.translate(shake, 0);
  // aro de la zona táctil (más visible mientras dura la flecha de ayuda)
  const flc = DATOS_JUEGO.GRAFICOS.FLECHA_CERROJO || {};
  const openedN = (STATE.opensByType || {})[chest.type.id] || 0;
  const showArrow = !!flc.ACTIVAR && openedN < (flc.COFRES_POR_TIPO || 2);
  ctx.globalAlpha = armed ? 0.9 : (showArrow ? 0.75 + Math.sin(now * 0.005) * 0.2 : 0.30 + Math.sin(now * 0.004) * 0.12);
  ctx.strokeStyle = missing ? '#ef4444' : (armed ? '#ffffff' : '#fde68a');
  ctx.lineWidth = armed || showArrow ? 3 : 2;
  ctx.setLineDash(armed ? [] : [5, 5]);
  ctx.beginPath(); ctx.arc(lx, ly, lr * (armed ? 0.95 + Math.sin(now * 0.012) * 0.05 : 1), 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  // etiqueta de coste: solo si hacen falta 2+ herramientas o si faltan (con 1 sola no se pinta)
  if (req > 1 || missing > 0) {
    const label = missing ? `faltan ${missing}` : `x${req}`;
    ctx.font = `bold ${fs}px monospace`;
    const tw = ctx.measureText(label).width + 14;
    const bx = lx - tw / 2, by = ly - lr - fs - 12;
    ctx.fillStyle = 'rgba(2,6,23,0.85)';
    ctx.strokeStyle = missing ? '#ef4444' : (TOOL_COLORS[chest.type.consumible] || '#fbbf24');
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, tw, fs + 8, 6); else ctx.rect(bx, by, tw, fs + 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = missing ? '#fca5a5' : (TOOL_COLORS[chest.type.consumible] || '#fbbf24');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, lx, by + (fs + 8) / 2 + 1);
  }
  // flecha + mensaje en los primeros cofres de cada tipo (o aviso de "toca otra vez" con varios cofres)
  const fl = flc;
  const showMsg = showArrow && (fl.MENSAJE_SOLO_TIPOS || ['wooden']).includes(chest.type.id);
  if (armed || showArrow) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const bounce = Math.sin(now * 0.008) * 4;
    if (showArrow && !armed) {
      // flecha apuntando hacia arriba, hacia el cerrojo
      const tipY = ly + lr + 4 + bounce;
      ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, tipY); ctx.lineTo(lx + 11, tipY + 14); ctx.lineTo(lx + 4, tipY + 14); ctx.lineTo(lx + 4, tipY + 26);
      ctx.lineTo(lx - 4, tipY + 26); ctx.lineTo(lx - 4, tipY + 14); ctx.lineTo(lx - 11, tipY + 14); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    const armedMsg = armed && openedN < (fl.COFRES_POR_TIPO_TOCA_OTRA_VEZ || 5);   // [0.089] se quita tras 5 aciertos por tipo
    if (armedMsg || showMsg) {
    const txt = armedMsg ? 'TOCA OTRA VEZ PARA ABRIR' : (fl.TEXTO || 'TOCA EL CERROJO PARA ABRIR');
    const ty = ly + lr + (armedMsg ? 8 : 36);
    ctx.font = `bold ${fs}px monospace`;
    const hw = ctx.measureText(txt).width + 16;
    ctx.fillStyle = 'rgba(2,6,23,0.88)';
    ctx.fillRect(lx - hw / 2, ty, hw, fs + 10);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
    ctx.strokeRect(lx - hw / 2, ty, hw, fs + 10);
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(txt, lx, ty + (fs + 10) / 2 + 1);
    }
  }
  ctx.restore();
}

// [0.089] Estado "armado" compartido entre la cerradura y el botón: el primer toque carga, el segundo abre (también con un solo cofre)
function lockIsArmed(active) { return !!active && lockArmedChest === active && (Date.now() - lockArmedAt) < 4000; }
function armLock(active) {
  const vib = DATOS_JUEGO.GRAFICOS.VIBRACION || {};
  lockArmedChest = active; lockArmedAt = Date.now();
  audio.playLockCharge(active.type.id);
  if (navigator.vibrate && vib.CARGAR) navigator.vibrate(vib.CARGAR);
}
// [0.086] Toque sobre la cerradura. Primer toque: arma (sonido propio del tipo + vibración); segundo toque: abre.
function handleLockTap() {
  const tl = DATOS_JUEGO.GRAFICOS.TOCAR_CERRADURA || {};
  if (!tl.ACTIVAR || !CHEST_LOCK) return false;
  if (tl.SOLO_PANTALLA_ANCHA && !isWideLayout()) return false;
  const btn = document.getElementById('openChestBtn') || document.getElementById('openActiveChestBtn');
  if (!btn || btn.disabled || !isGameIdle() || minigameInProgress) return false;
  const active = STATE.screenChests[STATE.activeChestIdx];
  if (!active) return false;
  audio.init();
  const vib = DATOS_JUEGO.GRAFICOS.VIBRACION || {};
  const hasTools = (STATE[active.type.consumible] || 0) >= getRequiredToolCount(active.rarity);
  if (hasTools && !lockIsArmed(active)) { armLock(active); return true; }
  lockArmedChest = null;
  if (navigator.vibrate && vib.ABRIR) navigator.vibrate(vib.ABRIR);
  if (!hasTools) lockShakeUntil = Date.now() + 450;
  openActiveChest();
  return true;
}

// [0.089] El botón "Forzar cerradura" cambia de texto, palpita y se enmarca con el color de la rareza mientras está armado
let armedBtnShown = false, armedBtnPrevText = '', armedBtnTextSet = '';
function syncOpenButtonArmed() {
  const btn = document.getElementById('openChestBtn');
  if (!btn) return;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const armed = lockIsArmed(active) && !minigameInProgress;
  const t = document.getElementById('openChestBtnText');
  if (armed && !armedBtnShown) {
    armedBtnShown = true;
    btn.classList.add('btn-armed');
    btn.style.setProperty('--armc', (active.rarity && active.rarity.color) || '#ffffff');
    if (t) { armedBtnPrevText = t.textContent; armedBtnTextSet = DATOS_JUEGO.GRAFICOS.BOTON_ARMADO_TEXTO || 'PULSA DE NUEVO'; t.textContent = armedBtnTextSet; }
  } else if (!armed && armedBtnShown) {
    armedBtnShown = false;
    btn.classList.remove('btn-armed');
    if (t && t.textContent === armedBtnTextSet) t.textContent = armedBtnPrevText;
  }
}

// [0.089b] Nivel visual de la maldición: sube al empezar (con melodía lúgubre) y baja al terminar (melodía con nota final aguda).
// Solo avanza cuando se ve la pantalla principal; si hay un banner o una tienda encima, espera.
let curseLevel = 0, curseLvlT = 0, curseStartTune = false, curseEndTune = false;
function updateCurseLevel() {
  const cfg = DATOS_JUEGO.MALDICION_TRANSICION || {};
  const now = performance.now(), dt = curseLvlT ? Math.min(100, now - curseLvlT) : 16; curseLvlT = now;
  if (cfg.ACTIVAR === false) return STATE.cursedChestsLeft > 0 ? 1 : 0;
  const want = STATE.cursedChestsLeft > 0 ? 1 : 0;
  if (curseLevel === want) { if (want) curseEndTune = false; else curseStartTune = false; return curseLevel; }
  if (!mainScreenFree()) return curseLevel;
  if (want && !curseStartTune) { curseStartTune = true; curseEndTune = false; audio.init(); audio.playCurseStart(); }
  if (!want && !curseEndTune) { curseEndTune = true; curseStartTune = false; audio.init(); audio.playCurseEnd(); }
  const step = dt / (cfg.DURACION_MS || 2600);
  curseLevel = want ? Math.min(1, curseLevel + step) : Math.max(0, curseLevel - step);
  return curseLevel;
}
function renderRoom() {
  if (!canvas || !ctx) return;
  syncOpenButtonArmed();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 20;

  const rtier = getNarrativeTier();
  let redAlpha = (DATOS_JUEGO.GRAFICOS.TINTE_ROJO_POR_TIER || {})[rtier] || 0;
  if (rtier === 4) {
    // [0.087b] progresivo: 0 al acabar el tier 3 → valor del tier 5 al llegar al tier 5
    const U = DATOS_JUEGO.NARRATIVA.UMBRALES_TIERS;
    const maxA = (DATOS_JUEGO.GRAFICOS.TINTE_ROJO_POR_TIER || {})[5] || 0.28;
    redAlpha = Math.max(0, Math.min(1, (STATE.chestsOpened - U.tier_3) / (U.tier_4 + 1 - U.tier_3))) * maxA;
  }
  const ambientes = DATOS_JUEGO.DECORACIONES_SALA.AMBIENTES;
  const amb = (rtier >= 5 || STATE.cursedChestsLeft > 0) ? null : ambientes[STATE.roomThemeFilter];   // [0.089] maldición (y Tier 5) tienen prioridad sobre el ambiente de los objetos
  const roomDark = (STATE.roomDarkUntil || 0) > STATE.chestsOpened;
  if (roomDarkPrev === null) roomDarkPrev = roomDark;
  if (roomDark !== roomDarkPrev) {
    // [0.087b] La luz vuelve con la animación inversa del parpadeo y un acorde suave
    if (!roomDark) { lightOnT0 = Date.now(); audio.playLightOn(); }
    roomDarkPrev = roomDark;
  }
  let bgGradient = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width);
  let bgStops;
  if (amb && amb.fondo) bgStops = amb.fondo;
  else if (rtier >= 5) bgStops = ['#450a0a', '#180202', '#000000'];
  else bgStops = ['#111827', '#0f172a', '#030712'];
  bgGradient.addColorStop(0, bgStops[0]);
  bgGradient.addColorStop(0.6, bgStops[1]);
  bgGradient.addColorStop(1, bgStops[2]);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // [0.085] Fondo de la celda (pixel art, escalado "cover") + tinte según el ambiente
  if (artReady('celda')) {
    // [0.086] Celda a oscuras: parpadeo de la bombilla al apagarse y luego fotograma apagado
    let cellKey = 'celda';
    if (roomDark && artReady('celdaApagada')) {
      cellKey = 'celdaApagada';
      const ft = Date.now() - darkFlickerT0;
      if (ft >= 0 && ft < 1500) {
        const seq = ['celda', 'celdaParpadeo1', 'celdaApagada', 'celdaParpadeo2', 'celdaApagada', 'celdaParpadeo1', 'celdaApagada'];
        const k = seq[Math.min(seq.length - 1, Math.floor(ft / 215))];
        if (artReady(k)) cellKey = k;
      }
    } else if (!roomDark && lightOnT0 && Date.now() - lightOnT0 < 1500 && artReady('celdaApagada')) {
      const lt = Date.now() - lightOnT0;
      const seq = ['celdaApagada', 'celdaParpadeo1', 'celdaApagada', 'celdaParpadeo2', 'celda', 'celdaParpadeo1', 'celda'];
      const k = seq[Math.min(seq.length - 1, Math.floor(lt / 215))];
      if (artReady(k)) cellKey = k;
    }
    const im = ART[cellKey];
    const sc = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
    const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(im, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    // [0.086] Tinte suave del ambiente + tinte rojo según el tier narrativo
    if (amb && amb.tinte) { ctx.fillStyle = amb.tinte; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    if (redAlpha > 0) { ctx.fillStyle = `rgba(140,12,12,${redAlpha})`; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    // [0.090] Maldición activa: rojo rotundo con viñeta. El tinte del tier 5 manda siempre (no se añade); el progresivo del tier 4 se SUMA a la maldición.
    {
      const tm = DATOS_JUEGO.GRAFICOS.TINTE_MALDICION || {};
      const lvl = updateCurseLevel();   // 0..1, sube/baja despacio y solo con la pantalla principal visible
      if (tm.ACTIVAR && lvl > 0 && rtier < 5) {
        const pa = (tm.ALFA + Math.sin(Date.now() * 0.0022) * (tm.PULSO || 0)) * lvl;
        ctx.fillStyle = `rgba(${tm.RGB},${pa.toFixed(3)})`; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (tm.VINETA) {
          const vg = ctx.createRadialGradient(cx, canvas.height / 2, canvas.width * 0.25, cx, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.75);
          vg.addColorStop(0, `rgba(${tm.VINETA_RGB || '90,0,8'},0)`);
          vg.addColorStop(1, `rgba(${tm.VINETA_RGB || '90,0,8'},${(tm.VINETA * lvl).toFixed(3)})`);
          ctx.fillStyle = vg; ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }

  STATE.roomDecorations.forEach(decor => {
    ctx.save();
    ctx.translate(decor.x, decorY(decor));
    const fa = decorFadeAlpha(decor);
    ctx.globalAlpha = fa;
    const dspr = decor.sprite || ((DATOS_JUEGO.DECORACIONES_SALA.ICONOS.find(i => i.nombre === decor.name) || {}).sprite);
    const di = dspr && artReady('deco_' + dspr) ? ART['deco_' + dspr] : null;
    if (di) {
      // [0.086] Adorno pixel art: brillo suave si sigue sin inspeccionar; atenuado si ya se usó
      const ds = decor.size * 1.9;
      ctx.imageSmoothingEnabled = false;
      if (!decor.used) {
        const pulse = 0.55 + Math.sin(Date.now() * 0.003 + decor.x) * 0.2;
        const gl = ctx.createRadialGradient(0, 0, 2, 0, 0, ds * 0.8);
        gl.addColorStop(0, `rgba(245,158,11,${(0.28 * pulse).toFixed(3)})`);
        gl.addColorStop(1, 'rgba(245,158,11,0)');
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, ds * 0.8, 0, Math.PI * 2); ctx.fill();
      } else ctx.globalAlpha = 0.3 * fa;
      ctx.drawImage(di, -ds / 2, -ds / 2, ds, ds);
    } else {
      ctx.fillStyle = decor.color;
      ctx.font = `${decor.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(decor.icono, 0, 0);
      if (decor.used) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.arc(0, 0, decor.size / 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  });
  // [0.087] Los adornos reemplazados terminan de desvanecerse y se eliminan
  if (STATE.roomDecorations.some(d => d.fading && decorFadeAlpha(d) <= 0)) STATE.roomDecorations = STATE.roomDecorations.filter(d => !d.fading || decorFadeAlpha(d) > 0);

  const useArt = artReady('celda');
  if (!useArt) {
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 90, 160, 42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const activeChest = STATE.screenChests && STATE.screenChests[STATE.activeChestIdx];
  const chestImgKey = activeChest && activeChest.type ? chestSpriteKey(activeChest.type, activeChest.rarity) : null;
  CHEST_LOCK = null;
  // [0.087b] El cofre (y su tarjeta) se ocultan mientras entra el Duende o el Trapero y vuelven con un fundido
  const npcOn = false;   // [0.088] ya no se oculta el cofre: lo tapa el telón de transición
  chestFade += ((npcOn ? 0 : 1) - chestFade) * 0.18;
  if (npcOn && chestFade < 0.02) chestFade = 0;
  if (!npcOn && chestFade > 0.98) chestFade = 1;
  setChestUiOpacity(chestFade);
  ctx.save();
  ctx.globalAlpha = chestFade;
  if (chestFade > 0) {
  if (useArt && activeChest && activeChest.rarity && chestImgKey && artReady(chestImgKey)) {
    // [0.085] Cofre con sprite: brillo del color de rareza + sprite pixelado
    // [0.086] Halo reforzado por rareza (más grande y opaco; aro exterior en épico y legendario)
    const g = DATOS_JUEGO.GRAFICOS;
    const im = ART[chestImgKey];
    const sc = Math.min((canvas.width * g.COFRE_ANCHO_PCT) / im.naturalWidth, (canvas.height * 0.24) / im.naturalHeight);
    const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    const mobileMulti = !isWideLayout() && STATE.screenChests.length > 1;
    const ccx = canvas.width / 2, ccy = canvas.height * (g.COFRE_Y_PCT - (mobileMulti ? (g.COFRE_SUBE_MOVIL_MULTI || 0) : 0));
    const bob = Math.sin(Date.now() * 0.002) * 2;
    const halo = (g.HALO_RAREZA || {})[activeChest.rarity.id] || { a: '88', r: 0.85, anillo: false };
    const glowR = dw * halo.r + Math.sin(Date.now() * 0.003) * 6;
    const rcol = activeChest.rarity.color || '#f59e0b';
    ctx.save();
    if (activeChest.rarity.id !== 'normal') ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(ccx, ccy, 8, ccx, ccy, glowR);
    glow.addColorStop(0, rcol + halo.a);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(ccx, ccy, glowR, 0, Math.PI * 2); ctx.fill();
    if (halo.anillo) {
      ctx.globalAlpha = 0.35 + Math.sin(Date.now() * 0.004) * 0.15;
      ctx.strokeStyle = rcol; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ccx, ccy, glowR * 0.86, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(ccx, ccy + dh / 2 + 4, dw * 0.46, dh * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(im, ccx - dw / 2, ccy - dh / 2 + bob, dw, dh);
    // [0.090] Vapor animado (solo Cofre de Vapor): bocanadas pixeladas que suben, crecen y se desvanecen
    const vap = g.VAPOR_ANIMADO;
    if (vap && vap.ACTIVAR && activeChest.type.id === 'hydraulic' && im._steamless) {
      const t0 = Date.now(), px = dw / im.naturalWidth, ox = ccx - dw / 2, oy = ccy - dh / 2 + bob;
      for (let i = 0; i < vap.BOCANADAS; i++) {
        const ph = ((t0 / vap.CICLO_MS) + i / vap.BOCANADAS) % 1;
        const sz = vap.TAM_MIN + (vap.TAM_MAX - vap.TAM_MIN) * ph;
        const wob = Math.sin(ph * 6 + i * 1.7) * 1.2;
        const sxp = vap.BOQUILLA.x + (vap.DERIVA * ph) + wob + ((i * 37) % 5 - 2) * 0.35;
        const syp = vap.BOQUILLA.y - vap.ALTURA * ph;
        const a = Math.min(1, ph * 8) * Math.min(1, (1 - ph) * 2.2) * 0.92;
        const q = px / 2;   // rejilla de medio píxel del sprite (se ve pixel art)
        const x = Math.round((ox + sxp * px) / q) * q, y = Math.round((oy + syp * px) / q) * q, w = Math.max(q, Math.round(sz * px / q) * q);
        ctx.fillStyle = `rgba(${vap.COLOR},${a.toFixed(3)})`;
        ctx.fillRect(x - w / 2, y - w / 2, w, w);
        ctx.fillRect(x - w * 0.9, y - w * 0.1, w * 0.55, w * 0.55);
        ctx.fillRect(x + w * 0.35, y - w * 0.7, w * 0.6, w * 0.6);
      }
    }
    // [0.091] Animaciones de cofre: pistones (Acero), pantalla y leds (Digital), aguja de presión (Vapor)
    const aco = g.ANIMACION_COFRES;
    if (aco && aco.ACTIVAR && im.naturalWidth === 56) {
      const pxs = dw / im.naturalWidth, oxs = ccx - dw / 2, oys = ccy - dh / 2 + bob;
      const R = (X, Y, W, H, col) => { const x0 = Math.round(oxs + X * pxs), y0 = Math.round(oys + Y * pxs); ctx.fillStyle = col; ctx.fillRect(x0, y0, Math.round(oxs + (X + W) * pxs) - x0, Math.round(oys + (Y + H) * pxs) - y0); };
      drawChestAnim(activeChest.type.id, R, aco, ctx, oxs, oys, pxs);
    }

    // [0.086] Cerradura táctil (solo pantalla ancha)
    const tl = g.TOCAR_CERRADURA || {};
    const L = (g.CERRADURAS || {})[activeChest.type.id];
    CHEST_LOCK_ZONE = null;
    if (tl.ACTIVAR && L && (!tl.SOLO_PANTALLA_ANCHA || isWideLayout())) {
      const lx = ccx - dw / 2 + L.x * dw, ly = ccy - dh / 2 + bob + L.y * dh;
      const lr = Math.max(tl.RADIO_MIN_PX || 26, L.r * dw);
      CHEST_LOCK_ZONE = { x: lx, y: ly, r: lr };   // [0.087] siempre disponible (los post-its la esquivan)
      if (!minigameInProgress && chestFade > 0.95 && isGameIdle()) {
        CHEST_LOCK = CHEST_LOCK_ZONE;
        drawLockOverlay(lx, ly, lr, activeChest);
      }
    }
  } else if (activeChest && activeChest.rarity && activeChest.type) {
    ctx.save();
    ctx.translate(cx, cy);

    const glowRadius = 55 + Math.sin(Date.now() * 0.003) * 8;
    const glow = ctx.createRadialGradient(0, -10, 10, 0, -10, glowRadius);
    const colorHex = activeChest.rarity.color || '#f59e0b';
    glow.addColorStop(0, colorHex + 'aa');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, -10, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colorHex;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-42, -48, 84, 58, 10);
    } else {
      ctx.rect(-42, -48, 84, 58);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-37, -32, 74, 6);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -16, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  }   // fin de "if (chestFade > 0)"
  ctx.restore();

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(renderRoom);
}
if (canvas) requestAnimationFrame(renderRoom);

if (canvas) {
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // [0.086] La cerradura tiene prioridad sobre los adornos secretos
    if (CHEST_LOCK && Math.hypot(clickX - CHEST_LOCK.x, clickY - CHEST_LOCK.y) <= CHEST_LOCK.r) {
      if (handleLockTap()) return;
    }

    for (let decor of STATE.roomDecorations) {
      if (!decor.used && !decor.fading && Math.hypot(clickX - decor.x, clickY - decorY(decor)) < decor.size + (DATOS_JUEGO.DECORACIONES_SALA.TOQUE_EXTRA_PX != null ? DATOS_JUEGO.DECORACIONES_SALA.TOQUE_EXTRA_PX : 14)) {
        decor.used = true;
        audio.init(); audio.playDecorTap();   // [0.087b] sonido al pulsar un adorno
        triggerSecretDecorationReward(decor);
        return;
      }
    }
  });
}

function spawnSpookyPerimeterDecoration() {
  const spookyDecorList = DATOS_JUEGO.DECORACIONES_SALA.ICONOS;
  const chosenDecor = spookyDecorList[Math.floor(Math.random() * spookyDecorList.length)];
  const descriptor = DATOS_JUEGO.DECORACIONES_SALA.ADJETIVOS[Math.floor(Math.random() * DATOS_JUEGO.DECORACIONES_SALA.ADJETIVOS.length)];

  const w = canvas ? canvas.width : 800;
  const h = canvas ? canvas.height : 600;

  const anchorZones = [
    { x: 60, row: 'top' },
    { x: w - 60, row: 'top' },
    { x: 60, row: 'mid' },
    { x: w - 60, row: 'mid' },
    { x: 60, row: 'bot' },
    { x: w - 60, row: 'bot' }
  ];

  const spot = anchorZones[Math.floor(Math.random() * anchorZones.length)];
  spot.y = decorRowY(spot.row);

  // [0.087] Si la posición ya está ocupada, el adorno anterior se desvanece en vez de acumularse
  STATE.roomDecorations.forEach(d => {
    if (!d.fading && Math.abs(d.x - spot.x) < 4 && Math.abs(decorY(d) - spot.y) < 4) d.fading = Date.now();
  });
  STATE.roomDecorations.push({
    x: spot.x, y: spot.y, row: spot.row, size: 28, 
    icono: chosenDecor.icono, 
    sprite: chosenDecor.sprite || null,
    name: chosenDecor.nombre,
    descriptor: descriptor, color: '#f59e0b', used: false
  });

  return `${chosenDecor.icono} ${chosenDecor.nombre} — "${descriptor}"`;
}

// [0.088] Cambio de ambiente en espera: se ejecuta cuando el banner de feedback ya está cerrado
let pendingAmbient = null;
setInterval(() => {
  if (!pendingAmbient) return;
  const b = document.getElementById('persistentFeedbackBanner');
  if (b && !b.classList.contains('hidden')) return;
  const fn = pendingAmbient; pendingAmbient = null;
  setTimeout(fn, 150);
}, 200);
function triggerSecretDecorationReward(decor) {
  const roll = Math.random() * 100;
  let msg = `Inspeccionaste ${decor.name}. "${decor.descriptor.toUpperCase()}"`;

  if (roll < 20) {
    const themes = DATOS_JUEGO.DECORACIONES_SALA.AMBIENTES_AZAR;
    const chosen = themes[Math.floor(Math.random() * themes.length)];
    // [0.088] El efecto no se aplica hasta cerrar el banner (con el banner delante, la sala está difuminada y no se vería)
    const cursedNow = STATE.cursedChestsLeft > 0;
    const finalTier = getNarrativeTier() >= 5;
    if (chosen !== 'apagado' && (cursedNow || finalTier)) {
      // [0.089] El efecto de color del objeto se cancela: la maldición (o la narrativa final desde el Tier 5) manda. La oscuridad sí convive.
      if (cursedNow && !finalTier) {
        const lst = DATOS_JUEGO.TEXTOS_AMBIENTE_MALDICION || [];
        if (lst.length) msg += ' ' + lst[Math.floor(Math.random() * lst.length)];
      }
    } else if (chosen === 'apagado') {
      pendingAmbient = () => {
        STATE.roomDarkUntil = STATE.chestsOpened + (DATOS_JUEGO.DECORACIONES_SALA.AMBIENTE_APAGADO_COFRES || 10);
        darkFlickerT0 = Date.now();
        setTimeout(() => audio.playDarkOut(), 120);   // [0.087b] progresión de notas graves
      };
      msg += " (¡La bombilla se funde! La celda queda a oscuras un buen rato.)";
    } else {
      pendingAmbient = () => {
        // [0.087b] Cualquier cambio de ambiente enciende la luz si estaba apagada
        if ((STATE.roomDarkUntil || 0) > STATE.chestsOpened) STATE.roomDarkUntil = 0;
        STATE.roomThemeFilter = chosen;
      };
      msg += chosen === 'normal' ? " (La sala recupera su color original.)" : " (¡El ambiente de la sala ha cambiado!)";
    }
    audio.playClick(0.9);
  } else if (roll >= 20 && roll < 35) {
    generateScreenChests();
    msg += " (¡Luz misteriosa! Los cofres mutan).";
    audio.playUnlockFanfare('raro');
  } else if (roll >= 35 && roll < 45) {
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (active && active.rarity.id !== 'legendario') {
      active.rarity = CHEST_RARITIES[3];
      updateChestSelectionUI();
      msg += " (¡Un rayo de sombra eleva el cofre a LEGENDARIO!)";
      audio.playUnlockFanfare('legendario');
    } else {
      STATE.gold += 5;
      msg += " (+5 GP descubiertos)";
    }
  } else if (roll >= 45 && roll < 65) { STATE.gold += 2; msg += " (+2 GP secretos)"; }
  else if (roll >= 65 && roll < 80) { STATE.picks += 1; msg += " (+1 Ganzúa hallada)"; }
  else if (roll >= 80 && roll < 90) { STATE.usb += 1; msg += " (+1 USB hallado)"; }
  else if (roll >= 90 && roll < 97) {
    if (STATE.level >= (DATOS_JUEGO.VALVULAS_NIVEL_MIN_BOTIN || 4)) { STATE.valves += 1; msg += " (+1 Válvula hallada)"; }
    else { STATE.gold += 2; msg += " (+2 GP secretos)"; }   // [0.089] sin válvulas antes del nivel mínimo
  }
  else {
    msg += " (¡Vibración sísmica en la sala!)";
    const appBody = document.getElementById('appBody');
    if (appBody) appBody.classList.add('shake-screen');
    setTimeout(() => { if (appBody) appBody.classList.remove('shake-screen'); }, 600);
  }

  updateUI();
  showPersistentFeedback(msg);
}

function generateScreenChests() {
  STATE.screenChests = [];
  const chestCount = STATE.chestsOpened < 4 ? 1 : (Math.random() < 0.6 ? 2 : 3);

  for (let i = 0; i < chestCount; i++) {
    const availableTypes = DATOS_JUEGO.COFRES.ESTANDAR.filter(t => {
      if (t.minNivel === 1) return true;
      if (STATE.level < t.minNivel) return false;
      
      const chestsSinceLevelUp = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
      if (STATE.level === t.minNivel && chestsSinceLevelUp < 3) {
        return false;
      }
      return true;
    });

    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    let rarity = CHEST_RARITIES[0];
    if (STATE.chestsOpened >= 3) {
      const levelKey = Math.min(STATE.level, 4);
      const probMap = DATOS_JUEGO.PROBABILIDADES.RAREZAS_COFRES_POR_NIVEL[levelKey] || DATOS_JUEGO.PROBABILIDADES.RAREZAS_COFRES_POR_NIVEL[4];

      let pNormal = probMap.normal;
      let pRaro = probMap.raro;
      let pEpico = probMap.epico;
      let pLegendario = probMap.legendario;

      if (STATE.perks.rarityBonus > 0) {
        const bonus = STATE.perks.rarityBonus * 0.10;
        pNormal = Math.max(0.10, pNormal - bonus);

        if (pLegendario > 0) {
          pLegendario += bonus * 0.4;
          pEpico += bonus * 0.4;
          pRaro += bonus * 0.2;
        } else if (pEpico > 0) {
          pEpico += bonus * 0.6;
          pRaro += bonus * 0.4;
        } else if (pRaro > 0) {
          pRaro += bonus;
        }
      }

      const roll = Math.random();
      if (roll < pLegendario) rarity = CHEST_RARITIES[3];
      else if (roll < pLegendario + pEpico) rarity = CHEST_RARITIES[2];
      else if (roll < pLegendario + pEpico + pRaro) rarity = CHEST_RARITIES[1];
      else rarity = CHEST_RARITIES[0];
    }

    STATE.screenChests.push({ type: randomType, rarity });
  }

  STATE.activeChestIdx = 0;
  updateChestSelectionUI();
}

function isClimaxActive() {
  const co = STATE.chestsOpened;
  const seqConfig = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;
  return STATE.climaxPhase || (!STATE.sequenceBroken && co >= (seqConfig.COFRE_CLIMAX_INICIO - 1));
}

function getRequiredToolCount(rarity) {
  if (isClimaxActive()) return 0;

  let base = rarity.id === 'legendario' ? 2 : 1;
  if (STATE.heavyChestsLeft > 0 && rarity.id !== 'normal') {
    base += 1;
  }
  return base;
}

function updateChestSelectionUI() {
  const multiGrid = document.getElementById('multiChestGrid');
  if (multiGrid) {
    multiGrid.innerHTML = '';

    if (STATE.screenChests.length > 1) {
      multiGrid.classList.remove('hidden');
      STATE.screenChests.forEach((c, idx) => {
        const btn = document.createElement('button');
        const isSelected = idx === STATE.activeChestIdx;
        btn.className = `p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${c.rarity.border} ${isSelected ? 'bg-slate-800 scale-105 ring-2 ring-amber-400' : 'bg-slate-900/80 opacity-70'}`;
        btn.innerHTML = `
          <span class="text-[9px] font-extrabold font-mono" style="color: ${c.rarity.color}">${c.rarity.name}</span>
          ${ART_ON && ASSETS.cofres[c.type.id] ? `<img src="${chestSpriteSrc(c.type, c.rarity)}" alt="" style="image-rendering:pixelated;width:44px;height:auto">` : '<i class="fa-solid fa-box text-sm"></i>'}
        `;
        btn.addEventListener('click', () => {
          audio.init();
          if (STATE.activeChestIdx !== idx) audio.playSwoosh(); else audio.playClick(0.5);   // [0.090] swoosh al cambiar de cofre
          STATE.activeChestIdx = idx;
          updateChestSelectionUI();
        });
        multiGrid.appendChild(btn);
      });
    } else {
      multiGrid.classList.add('hidden');
    }
  }

  const active = STATE.screenChests[STATE.activeChestIdx];
  if (active) {
    const badge = document.getElementById('chestRarityBadge');
    if (badge) {
      badge.textContent = active.rarity.name;
      badge.style.borderColor = active.rarity.color;
      badge.style.color = active.rarity.color;
    }

    const title = document.getElementById('chestTitle');
    if (title) title.textContent = active.type.nombre;

    const subtitle = document.getElementById('chestSubtitle');
    if (subtitle) subtitle.textContent = active.type.desc;

    const reqCount = getRequiredToolCount(active.rarity);
    // [0.088] singular y plural correctos ("1 PIN DE ACERO", "2 PINES DE ACERO")
    let toolTitle = reqCount === 1 ? "GANZÚA" : "GANZÚAS";
    if (active.type.consumible === 'proPicks') toolTitle = reqCount === 1 ? "PIN DE ACERO" : "PINES DE ACERO";
    if (active.type.consumible === 'usb') toolTitle = reqCount === 1 ? "LLAVE USB" : "LLAVES USB";
    if (active.type.consumible === 'valves') toolTitle = reqCount === 1 ? "VÁLVULA" : "VÁLVULAS";

    const reqEl = document.getElementById('chestCostRequirement');
    if (reqEl) {
      if (isClimaxActive()) {
        reqEl.className = "text-[10px] font-extrabold text-emerald-400 mb-3 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500 animate-pulse";
        reqEl.textContent = "REQUIERE: 0 (LIBRE)";
      } else if (active.rarity.id === 'legendario' || reqCount > 1) {
        reqEl.className = "text-[10px] font-extrabold text-amber-300 mb-3 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-400 animate-pulse";
        reqEl.textContent = `REQUIERE: ${reqCount} ${toolTitle}`;
      } else {
        reqEl.className = "text-[10px] font-bold text-amber-400 mb-3 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800";
        reqEl.textContent = `REQUIERE: ${reqCount} ${toolTitle}`;
      }
    }

    const btnText = document.getElementById('openChestBtnText');
    if (btnText) {
      if (active.type.juego === 'lockpick') btnText.textContent = `FORZAR CERRADURA (${reqCount})`;
      if (active.type.juego === 'tumbler') btnText.textContent = `USAR PIN (${reqCount})`;
      if (active.type.juego === 'hack') btnText.textContent = `CONECTAR USB (${reqCount})`;
      if (active.type.juego === 'pipe') btnText.textContent = `GIRAR VÁLVULA (${reqCount})`;
    }
  }

  updateUI();
}

// [0.087] Etiqueta al pasar el ratón + banner al pulsar (igual que las pasivas). El texto se actualiza en cada refresco.
function helpText(key, vars = {}) {
  let t = (DATOS_JUEGO.TEXTOS_AYUDA || {})[key] || '';
  t = t.replace('{min}', DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA.MINIMO_PARA_BONUS).replace('{n}', vars.n != null ? vars.n : '');
  return t;
}
function setHelp(el, text) {
  el.title = text;
  el.dataset.helpText = text;
  el.classList.add('cursor-pointer');
  if (!el.dataset.helpBound) {
    el.dataset.helpBound = '1';
    el.addEventListener('click', () => { if (el.dataset.helpText) showPersistentFeedback(`ℹ️ ${el.dataset.helpText}`); });
  }
}

// [0.089b] delayKey (opcional): tipo de mensaje de "clic compulsivo". Las primeras VECES de cada tipo, por partida, el botón de cerrar aparece tras RETARDO_MS.
let acceptDelayTimer = null;
function showPersistentFeedback(message, delayKey = null) {
  const banner = document.getElementById('persistentFeedbackBanner');
  const txt = document.getElementById('feedbackText');
  const wasVisible = !!(banner && !banner.classList.contains('hidden'));
  const dBtn = document.getElementById('dismissFeedbackBtn');
  const dcfg = DATOS_JUEGO.ACEPTAR_RETARDADO || {};
  if (!wasVisible && dBtn) { clearTimeout(acceptDelayTimer); dBtn.style.visibility = ''; }
  if (!wasVisible && delayKey && dBtn && dcfg.ACTIVAR) {
    STATE.acceptDelayUses = STATE.acceptDelayUses || {};
    const used = STATE.acceptDelayUses[delayKey] || 0;
    if (used < (dcfg.VECES || 2)) {
      STATE.acceptDelayUses[delayKey] = used + 1;
      dBtn.style.visibility = 'hidden';
      acceptDelayTimer = setTimeout(() => { dBtn.style.visibility = ''; }, dcfg.RETARDO_MS || 2000);
    }
  }
  // [0.084] Si el banner ya está visible, el mensaje nuevo se añade debajo en lugar de taparlo
  // (así el aviso del cofre troll no lo pisan Perdedor / Escudo / Apuesta)
  const visible = banner && !banner.classList.contains('hidden');
  if (txt) {
    txt.style.whiteSpace = 'pre-line';
    if (visible && txt.textContent && txt.textContent !== message && !txt.textContent.includes(message)) txt.textContent = txt.textContent + '\n\n' + message;
    else txt.textContent = message;
  }
  if (banner) banner.classList.remove('hidden');
}

const dismissBtn = document.getElementById('dismissFeedbackBtn');
if (dismissBtn) {
  dismissBtn.addEventListener('click', () => {
    const banner = document.getElementById('persistentFeedbackBanner');
    if (banner) banner.classList.add('hidden');
  });
}

function triggerSequentialDialogue(speaker, speechText, iconClass, subtitleText, titleColorClass, giftObj = null, onComplete = null) {
  // [0.086] Las frases llevan su mood al final: "texto {alegre}". Se separa aquí y manda sobre el subtítulo.
  let taggedMood = null;
  if (typeof speechText === 'string') {
    const mm = speechText.match(/\s*\{([a-z_]+)\}\s*$/);
    if (mm) { taggedMood = mm[1]; speechText = speechText.slice(0, mm.index); }
  }
  try { audio.init(); audio.playDialogueMelody(speaker); } catch (e) {}   // [0.089b]
  const npcName = document.getElementById('npcName');
  if (npcName) {
    npcName.textContent = speaker;
    npcName.className = `text-xl font-black font-retro tracking-wide ${titleColorClass}`;
  }

  const npcSub = document.getElementById('npcSubtitle');
  if (npcSub) npcSub.textContent = subtitleText;

  const npcSpeech = document.getElementById('npcSpeechText');
  if (npcSpeech) npcSpeech.textContent = speechText;

  const npcIcon = document.getElementById('npcIcon');
  if (npcIcon) npcIcon.className = `fa-solid ${iconClass}`;

  const avatar = document.getElementById('npcAvatar');
  const speechBox = document.getElementById('npcSpeechText');
  const closeBtn = document.getElementById('closeDialogueBtn');

  if (avatar && speechBox && closeBtn) {
    if (speaker === "EL TRAPERO") {
      avatar.className = "w-14 h-14 rounded-2xl bg-rose-950 border border-rose-500 flex items-center justify-center text-2xl text-rose-400 shadow-xl";
      avatar.style.background = '#0b1d3f';   // [0.089b] fondo azul oscuro (la túnica es granate)
      speechBox.className = "w-full text-lg sm:text-xl font-mono leading-relaxed italic bg-rose-950/60 border border-rose-800/80 p-5 rounded-2xl shadow-inner text-center text-rose-200";
      closeBtn.className = "w-full py-4 bg-gradient-to-r from-rose-700 to-amber-700 active:from-rose-600 text-white font-extrabold text-sm rounded-2xl shadow-2xl border border-rose-500/40 cursor-pointer";
    } else {
      avatar.className = "w-14 h-14 rounded-2xl bg-purple-950 border border-purple-500 flex items-center justify-center text-2xl text-purple-400 shadow-xl";
      avatar.style.background = '';
      speechBox.className = "w-full text-lg sm:text-xl font-mono leading-relaxed italic bg-purple-950/60 border border-purple-800/80 p-5 rounded-2xl shadow-inner text-center text-purple-200";
      closeBtn.className = "w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 active:from-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-2xl border border-purple-400/40 cursor-pointer";
    }
  }

  // [0.085] Retrato pixel art del personaje (expresión según el contexto); sin arte, se queda el icono
  if (avatar) {
    const isTrap = speaker === "EL TRAPERO";
    const mood = isTrap
      ? ({ 'Condena Eterna': 'amenaza', 'Último Aviso': 'amenaza', 'Advertencia': 'alerta', 'Pre-Clímax': 'alerta', 'Sobre tu pulso': 'sonrisa' }[subtitleText] || 'base')
      : ({ 'Encuentro Casual': 'alegre' }[subtitleText] || 'base');
    const bank = isTrap ? ASSETS.trapero : ASSETS.duende;
    const src = ART_ON ? ((taggedMood && bank[taggedMood]) || bank[mood] || bank.base) : null;
    let img = document.getElementById('npcPortraitImg');
    if (src) {
      if (!img) {
        img = document.createElement('img');
        img.id = 'npcPortraitImg';
        img.alt = '';
        img.style.cssText = 'image-rendering:pixelated;width:100%;height:100%;object-fit:contain';
        avatar.appendChild(img);
      }
      img.src = src;
      img.style.display = '';
      if (npcIcon) npcIcon.style.display = 'none';
      avatar.style.width = '84px'; avatar.style.height = '112px'; avatar.style.padding = '4px';
    } else {
      if (img) img.style.display = 'none';
      if (npcIcon) npcIcon.style.display = '';
      avatar.style.width = ''; avatar.style.height = ''; avatar.style.padding = '';
    }
  }

  const giftContainer = document.getElementById('npcGiftContainer');
  if (giftContainer) {
    if (giftObj) {
      const giftTxt = document.getElementById('npcGiftText');
      if (giftTxt) giftTxt.textContent = `REGALO: ${giftObj.name}`;
      giftContainer.classList.remove('hidden');
    } else {
      giftContainer.classList.add('hidden');
    }
  }

  const modal = document.getElementById('dialogueModal');
  if (modal) modal.classList.remove('hidden');

  if (closeBtn) {
    const newBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newBtn, closeBtn);

    newBtn.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
      if (giftContainer) giftContainer.classList.add('hidden');
      if (typeof onComplete === 'function') {
        onComplete();
      } else {
        processNextQueuedEvent();
      }
    });
  }
}

// [0.087] El Trapero comenta que la maldición ha terminado (frase al azar de NARRATIVA.TRAPERO_FIN_MALDICION)
function queueCurseEndMessage() {
  const list = DATOS_JUEGO.NARRATIVA.TRAPERO_FIN_MALDICION || [];
  if (!list.length) return;
  const phrase = list[Math.floor(Math.random() * list.length)];
  STATE.eventQueue.push(() => triggerSequentialDialogue("EL TRAPERO", phrase, "fa-mask", "Maldición rota", "text-rose-400", null, () => processNextQueuedEvent()));
}

// [0.087] Coloca un post-it en cualquier punto de la sala (por debajo del HUD), esquivando solo la cerradura táctil
function placeStickyNote(note, container) {
  const cr = container.getBoundingClientRect();
  const hud = document.getElementById('persistentHUD');
  const topMin = hud ? Math.max(0, hud.getBoundingClientRect().bottom - cr.top) + 8 : cr.height * 0.22;
  const nw = note.offsetWidth, nh = note.offsetHeight;
  const xMax = Math.max(6, cr.width - nw - 6);
  const yMax = Math.max(topMin, cr.height * 0.80 - nh);
  const zone = CHEST_LOCK_ZONE;
  let x = 6, y = topMin;
  for (let i = 0; i < 25; i++) {
    x = 6 + Math.random() * (xMax - 6);
    y = topMin + Math.random() * (yMax - topMin);
    if (!zone) break;
    const nx = Math.max(x, Math.min(zone.x, x + nw)), ny = Math.max(y, Math.min(zone.y, y + nh));
    if (Math.hypot(nx - zone.x, ny - zone.y) > zone.r + 10) break;
  }
  note.style.left = `${Math.round(x)}px`;
  note.style.top = `${Math.round(y)}px`;
}

function spawnStickyNote() {
  if (STATE.climaxPhase || document.querySelectorAll('.sticky-note').length >= 5) return;

  const container = document.getElementById('notesContainer');
  if (!container) return;

  const note = document.createElement('div');
  note.className = 'sticky-note absolute p-2.5 rounded-lg text-[11px] font-bold font-mono pointer-events-auto cursor-pointer border border-amber-300 shadow-2xl z-20';
  
  const tier = getNarrativeTier();
  const loopKey = STATE.currentLoop === 2 ? 'BUCLE_2' : 'BUCLE_1';
  const list = DATOS_JUEGO.NARRATIVA.POST_ITS[loopKey][tier];
  const randomText = list[Math.floor(Math.random() * list.length)];
  note.textContent = `"${randomText}"`;

  note.style.visibility = 'hidden';

  note.addEventListener('click', () => {
    audio.playPaperRustle();
    note.classList.add('crumple-anim');
    setTimeout(() => note.remove(), 350);
  });

  container.appendChild(note);
  placeStickyNote(note, container);   // [0.087] posición libre por toda la sala (se mide una vez añadido)
  note.style.visibility = '';
}

/* ==========================================================================
   BOTÍN Y RECOMPENSAS
   ========================================================================== */

function triggerLootExplosion() {
  if (TEST_SERIES.active) { testPuzzleResult(true); return; }   // [0.090] Modo test: sin botín, pasa al siguiente puzle
  // 🟢 CERROJO ANTI-DUPLICACIÓN
  if (isLootProcessing) return;
  isLootProcessing = true;
  humHoldChest = STATE.screenChests[STATE.activeChestIdx] || null;   // [0.091] sin zumbido en la pantalla de botín

  try {
    minigameInProgress = false;
    stopMinigameTimer();
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (!active) return;

    audio.playUnlockFanfare(active.rarity.id);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    const appBody = document.getElementById('appBody');
    if (appBody) appBody.classList.add('shake-screen');
    setTimeout(() => { if (appBody) appBody.classList.remove('shake-screen'); }, 400);

    const cx = canvas ? canvas.width / 2 : 400;
    const cy = canvas ? canvas.height / 2 : 300;
    spawnParticles(cx, cy, active.rarity.color, active.rarity.id === 'legendario' ? 100 : 50, active.rarity.id === 'legendario');

    STATE.chestsOpened++;
    statsAdd('chests', 1); if (puzzleStat) { statsPuzzle(puzzleStat, true); puzzleStat = null; }   // [0.090]
    STATE.opensByType = STATE.opensByType || {};
    STATE.opensByType[active.type.id] = (STATE.opensByType[active.type.id] || 0) + 1;
    STATE.cleanStreak++;
    checkAchievements();

    // CONSUMO DE GANZÚA POR TRATO "DEDOS ROTOS"
    if (active.type.consumible === 'picks' && STATE.picksBrokenOnUse) {
      const reqCount = getRequiredToolCount(active.rarity);
      STATE.picks = Math.max(0, STATE.picks - reqCount);
    }

    if (STATE.cursedChestsLeft > 0) {
      STATE.cursedChestsLeft--;
      if (STATE.cursedChestsLeft === 0) {
        STATE.salvageCurseActive = false;
        STATE.curseEndPending = true;   // [0.088] se encola al cobrar el botín
      }
    }
    // [CAMBIO] La Maldición de la Codicia se evalúa ANTES de descontar el contador, para que afecte a los 5 cofres
    const greedActive = STATE.greedCurseLeft > 0 && (active.rarity.id === 'epico' || active.rarity.id === 'legendario');
    if (STATE.heavyChestsLeft > 0) STATE.heavyChestsLeft--;
    if (STATE.greedCurseLeft > 0) STATE.greedCurseLeft--;
    if (STATE.harderPuzzlesLeft > 0) STATE.harderPuzzlesLeft--;

    let baseGpMin = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.gp_min;
    let baseGpMax = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.gp_max;
    let baseXpMin = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.xp_min;
    let baseXpMax = DATOS_JUEGO.ECONOMIA.RECOMPENSAS_BASE.xp_max;

    // [0.085] Carta Perdedor: el botín se calcula como Legendario y se duplica (solo GP y XP)
    const perdedorLoot = !!STATE.perdedorLootPending;
    STATE.perdedorLootPending = false;
    const lootMultiplier = perdedorLoot ? CHEST_RARITIES[3].multiplier : active.rarity.multiplier;
    const lootRarityName = perdedorLoot ? CHEST_RARITIES[3].name : active.rarity.name;

    let baseGp = Math.floor((Math.random() * (baseGpMax - baseGpMin) + baseGpMin) * lootMultiplier);
    let baseXp = Math.floor((Math.random() * (baseXpMax - baseXpMin) + baseXpMin) * lootMultiplier);

    let gpLines = [];
    gpLines.push({ label: `Base ${lootRarityName}`, val: `+${baseGp} GP` });
    let finalGp = baseGp;

    const configRachas = DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA;
    if (STATE.cleanStreak >= configRachas.MINIMO_PARA_BONUS) {
      let fixedBonus = STATE.cleanStreak >= 5 ? configRachas.NIVEL_5.fixedGp : configRachas.NIVEL_3.fixedGp;
      let pctBonus = STATE.cleanStreak >= 5 ? configRachas.NIVEL_5.pctGp : configRachas.NIVEL_3.pctGp;
      if (STATE.perks.goldStreak > 0) {
        fixedBonus += configRachas.BONUS_PERK_BOLSILLO.fixedExtra;
        pctBonus += configRachas.BONUS_PERK_BOLSILLO.pctExtra;
      }
      let streakBonusGp = fixedBonus + Math.floor(baseGp * pctBonus);
      finalGp += streakBonusGp;
      gpLines.push({ 
        label: `<span class="flex items-center gap-1.5"><i class="fa-solid fa-fire text-amber-500"></i> Racha x${STATE.cleanStreak}</span>`, 
        val: `+${streakBonusGp} GP` 
      });
    }

    let masteryLevel = 0;
    let torpezaLevel = 0;

    if (active.type.id === 'wooden') {
      masteryLevel = STATE.perks.bonusMadera || 0;
      torpezaLevel = STATE.torpezas.madera || 0;
    } else if (active.type.id === 'piston') {
      masteryLevel = STATE.perks.bonusAcero || 0;
      torpezaLevel = STATE.torpezas.acero || 0;
    } else if (active.type.id === 'cyber') {
      masteryLevel = STATE.perks.bonusDigital || 0;
      torpezaLevel = STATE.torpezas.digital || 0;
    } else if (active.type.id === 'hydraulic') {
      masteryLevel = STATE.perks.bonusVapor || 0;
      torpezaLevel = STATE.torpezas.vapor || 0;
    }

    if (masteryLevel > 0) {
      const pctM = getMasteryTorpezaPct(masteryLevel);
      let mGp = Math.floor(finalGp * pctM);
      finalGp += mGp;
      gpLines.push({ label: `⚙️ Maestría Lv.${masteryLevel} (+${Math.round(pctM * 100)}%)`, val: `+${mGp} GP` });
    }

    if (torpezaLevel > 0) {
      const pctT = getMasteryTorpezaPct(torpezaLevel);
      let tGp = Math.floor(finalGp * pctT);
      finalGp = Math.max(1, finalGp - tGp);
      gpLines.push({ label: `⚠️ Torpeza Lv.${torpezaLevel} (-${Math.round(pctT * 100)}%)`, val: `-${tGp} GP` });
    }

    if (STATE.perks.luckyLootChance > 0 && Math.random() <= STATE.perks.luckyLootChance) {
      finalGp *= 2;
      gpLines.push({ label: "🍀 Tipo con Suerte", val: "x2 GP" });
    }

    if (STATE.active2XMultiplier) {
      finalGp *= 2;
      gpLines.push({ label: "⚡ Bonus 2X", val: "x2 GP" });
    }

    if (perdedorLoot) {
      finalGp *= 2;
      gpLines.push({ label: "💀 Premio del Perdedor", val: "x2 GP" });
    }

    if (STATE.cursedChestsLeft > 0) {
      let penaltyGp = Math.floor(finalGp * DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.PENALIZACION_MULTIPLICADOR);
      finalGp = Math.max(1, finalGp - penaltyGp);
      gpLines.push({ label: "💀 Maldición (-50%)", val: `-${penaltyGp} GP` });
    }

    // [CAMBIO] Wildcard Maldición de la Codicia
    if (greedActive) {
      let penaltyGreed = Math.floor(finalGp * DATOS_JUEGO.ECONOMIA.MALDICION_CODICIA_PENALIZACION);
      finalGp = Math.max(1, finalGp - penaltyGreed);
      gpLines.push({ label: "🪙 Maldición de la Codicia (-50%)", val: `-${penaltyGreed} GP` });
    }

    // [0.082] Penalización por tanteo (Ganzúa, Bucle 2/3, Raro+): -30% GP y XP en una línea propia
    const tanteoPenalty = (active.type.juego === 'lockpick' && lpState.tanteoActive && lpState.tanteoUsed)
      ? DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.PENALIZACION_TANTEO : 0;
    lpState.tanteoUsed = false;
    if (tanteoPenalty > 0) {
      let tanteoGp = Math.floor(finalGp * tanteoPenalty);
      finalGp = Math.max(1, finalGp - tanteoGp);
      gpLines.push({ label: DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.ETIQUETA_RECIBO, val: `-${tanteoGp} GP` });
      const loopNow = Math.min(STATE.currentLoop || 1, 3);
      if (STATE.tanteoExplainedLoop !== loopNow) {
        STATE.tanteoExplainedLoop = loopNow;
        STATE.pendingTanteoPhrase = DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.FRASE_TRAPERO[loopNow] || null;
      }
    }

    if (STATE.riskModeActive) {
      const aporteRiesgo = Math.floor(finalGp * 1.5);
      STATE.riskPot += aporteRiesgo;
      gpLines.push({ label: "🎲 Bote de Riesgo", val: `+${aporteRiesgo} GP (Total: ${STATE.riskPot})` });
    }

    let xpLines = [];
    xpLines.push({ label: `Base ${lootRarityName}`, val: `+${baseXp} XP` });
    let finalXp = baseXp;

    if (masteryLevel > 0) {
      const pctM = getMasteryTorpezaPct(masteryLevel);
      let mXp = Math.floor(finalXp * pctM);
      finalXp += mXp;
      xpLines.push({ label: `⚙️ Maestría Lv.${masteryLevel} (+${Math.round(pctM * 100)}%)`, val: `+${mXp} XP` });
    }

    if (torpezaLevel > 0) {
      const pctT = getMasteryTorpezaPct(torpezaLevel);
      let tXp = Math.floor(finalXp * pctT);
      finalXp = Math.max(0, finalXp - tXp);
      xpLines.push({ label: `⚠️ Torpeza Lv.${torpezaLevel} (-${Math.round(pctT * 100)}%)`, val: `-${tXp} XP` });
    }

    if (STATE.traperoBuffs.bonusXp) {
      const pctS = getMasteryTorpezaPct(1);
      let sXp = Math.floor(finalXp * pctS);
      finalXp += sXp;
      xpLines.push({ label: "👁️ Pacto Sombra (+25%)", val: `+${sXp} XP` });
    }

    if (STATE.xpBoostChestsLeft > 0) {
      STATE.xpBoostChestsLeft--;
      const pctC = getMasteryTorpezaPct(1);
      let cXp = Math.floor(finalXp * pctC);
      finalXp += cXp;
      xpLines.push({ label: "✨ Impulso Trabajo (+25%)", val: `+${cXp} XP` });
    }

    if (STATE.active2XMultiplier) {
      finalXp *= 2;
      xpLines.push({ label: "⚡ Bonus 2X", val: "x2 XP" });
    }

    if (perdedorLoot) {
      finalXp *= 2;
      xpLines.push({ label: "💀 Premio del Perdedor", val: "x2 XP" });
    }

    if (STATE.cursedChestsLeft > 0) {
      let penaltyXp = Math.floor(finalXp * DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.PENALIZACION_MULTIPLICADOR);
      finalXp = Math.max(0, finalXp - penaltyXp);
      xpLines.push({ label: "💀 Maldición (-50%)", val: `-${penaltyXp} XP` });
    }

    if (tanteoPenalty > 0) {
      let tanteoXp = Math.floor(finalXp * tanteoPenalty);
      finalXp = Math.max(0, finalXp - tanteoXp);
      xpLines.push({ label: DATOS_JUEGO.MINIJUEGOS.AVANZADO.LOCKPICK.ETIQUETA_RECIBO, val: `-${tanteoXp} XP` });
    }

    if (STATE.noXpChestsLeft > 0) {
      STATE.noXpChestsLeft--;
      finalXp = 0;
      xpLines = [{ label: "🎨 Por Amor al Arte", val: "0 XP" }];
    }

    STATE.active2XMultiplier = false;
    STATE.gold += finalGp;
    STATE.xp += finalXp;

    let gpLinesHTML = gpLines.map(l => `<div class="flex justify-between items-center text-xs font-mono text-amber-200/90"><span>${l.label}</span><span class="font-bold text-amber-300 whitespace-nowrap pl-2">${l.val}</span></div>`).join('');
    let xpLinesHTML = xpLines.map(l => `<div class="flex justify-between items-center text-xs font-mono text-indigo-200/90"><span>${l.label}</span><span class="font-bold text-indigo-300 whitespace-nowrap pl-2">${l.val}</span></div>`).join('');

    let extraLootHTML = "";
    let toolDropChance = DATOS_JUEGO.PROBABILIDADES.HERRAMIENTA_EXTRA_CHANCE;
    const chestsSinceLevelUp = STATE.chestsOpened - (STATE.chestsAtLevelUp || 0);
    const inGracePeriod = chestsSinceLevelUp < 3 && (STATE.level === 2 || STATE.level === 3 || STATE.level === 5);

    if (inGracePeriod) toolDropChance *= DATOS_JUEGO.PROBABILIDADES.MULTIPLICADOR_DROP_PERIODO_GRACIA;

    // [0.082] Dedos Rotos activo: en un cofre NORMAL de madera la ganzúa extra baja a un % fijo (silencioso).
    // No se duplica en periodo de gracia; la herramienta nueva del periodo de gracia conserva su probabilidad original.
    const dedosRotosDrop = STATE.picksBrokenOnUse && active.rarity.id === 'normal' && active.type.id === 'wooden';
    let forcedDrop = null;      // si no es null, sustituye a la tirada normal
    let dropHappens;
    const GANZUA_DROP = { name: 'Ganzúa Básica', prop: 'picks', icon: 'fa-key', color: 'text-amber-400' };
    if (dedosRotosDrop) {
      const graceTool = inGracePeriod ? (
        STATE.level === 2 ? { name: 'Pin de Acero', prop: 'proPicks', icon: 'fa-screwdriver', color: 'text-emerald-400' } :
        STATE.level === 3 ? { name: 'Llave USB', prop: 'usb', icon: 'fa-microchip', color: 'text-cyan-400' } :
        { name: 'Válvula Hidráulica', prop: 'valves', icon: 'fa-faucet', color: 'text-rose-400' }
      ) : null;
      // Probabilidad original de la herramienta nueva en gracia: (25% x2) repartido entre 2 opciones = 25%
      const graceToolChance = graceTool ? toolDropChance / 2 : 0;
      // Una sola tirada: [0, graceToolChance) = herramienta nueva; el tramo siguiente = Ganzúa (así ambas conservan su % exacto)
      const dropRoll = Math.random();
      if (dropRoll < graceToolChance) forcedDrop = graceTool;
      else if (dropRoll < graceToolChance + DATOS_JUEGO.PROBABILIDADES.DEDOS_ROTOS_GANZUA_CHANCE) forcedDrop = GANZUA_DROP;
      dropHappens = forcedDrop !== null;
    } else {
      dropHappens = Math.random() < toolDropChance;
    }

    if (dropHappens) {
      let availableDrops = [];
      if (active.rarity.id === 'normal') {
        availableDrops = [{ name: 'Ganzúa Básica', prop: 'picks', icon: 'fa-key', color: 'text-amber-400' }];
      } else {
        availableDrops = [
          { name: 'Ganzúa Básica', prop: 'picks', icon: 'fa-key', color: 'text-amber-400' },
          { name: 'Pin de Acero', prop: 'proPicks', icon: 'fa-screwdriver', color: 'text-emerald-400' },
          { name: 'Llave USB', prop: 'usb', icon: 'fa-microchip', color: 'text-cyan-400' },
          { name: 'Válvula Hidráulica', prop: 'valves', icon: 'fa-faucet', color: 'text-rose-400' }
        ];
      }

      // [0.089] Sin válvulas en el botín hasta el nivel mínimo
      availableDrops = availableDrops.filter(d => d.prop !== 'valves' || STATE.level >= (DATOS_JUEGO.VALVULAS_NIVEL_MIN_BOTIN || 4));

      if (inGracePeriod) {
        if (STATE.level === 2) availableDrops.push({ name: 'Pin de Acero', prop: 'proPicks', icon: 'fa-screwdriver', color: 'text-emerald-400' });
        if (STATE.level === 3) availableDrops.push({ name: 'Llave USB', prop: 'usb', icon: 'fa-microchip', color: 'text-cyan-400' });
        if (STATE.level === 5) availableDrops.push({ name: 'Válvula Hidráulica', prop: 'valves', icon: 'fa-faucet', color: 'text-rose-400' });
      }

      const chosenDrop = forcedDrop || availableDrops[Math.floor(Math.random() * availableDrops.length)];
      STATE[chosenDrop.prop]++;
      extraLootHTML += `
        <div class="flex items-center justify-between ${chosenDrop.color} font-bold text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <span class="flex items-center gap-2"><i class="fa-solid ${chosenDrop.icon}"></i> ${chosenDrop.name}</span>
          <span class="text-sm font-black">+1</span>
        </div>
      `;
    }

    if (active.rarity.id === 'epico' || active.rarity.id === 'legendario' || Math.random() < DATOS_JUEGO.PROBABILIDADES.ADORNO_SALA_CHANCE) {
      const decorTextStr = spawnSpookyPerimeterDecoration();
      extraLootHTML += `
        <div class="flex items-center justify-between text-purple-300 font-bold text-xs bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30">
          <span class="flex items-center gap-2 text-sm">${decorTextStr}</span>
        </div>
      `;
    }

    const lootList = document.getElementById('lootList');
    if (lootList) {
      lootList.innerHTML = `
        <div class="bg-amber-950/40 border border-amber-500/50 p-3 rounded-xl space-y-1">
          <div class="flex justify-between items-center text-amber-400 font-black text-xs border-b border-amber-500/30 pb-1 mb-1">
            <span class="flex items-center gap-1.5 whitespace-nowrap"><i class="fa-solid fa-coins"></i> MONEDAS DE ORO (GP)</span>
            <span class="text-sm font-black text-amber-300 whitespace-nowrap">+${finalGp} GP</span>
          </div>
          ${gpLinesHTML}
        </div>

        <div class="bg-indigo-950/40 border border-indigo-500/50 p-3 rounded-xl space-y-1">
          <div class="flex justify-between items-center text-indigo-400 font-black text-xs border-b border-indigo-500/30 pb-1 mb-1">
            <span class="flex items-center gap-1.5 whitespace-nowrap"><i class="fa-solid fa-star"></i> EXPERIENCIA (XP)</span>
            <span class="text-sm font-black text-indigo-300 whitespace-nowrap">+${finalXp} XP</span>
          </div>
          ${xpLinesHTML}
        </div>

        ${extraLootHTML}
      `;
    }

    const lootTitle = document.getElementById('lootHeaderTitle');
    if (lootTitle) lootTitle.textContent = `¡BOTÍN ${active.rarity.name}!`;

    const lootModal = document.getElementById('lootModal');
    if (lootModal) lootModal.classList.remove('hidden');

    const seqConfig = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;
    if (!STATE.sequenceBroken && STATE.chestsOpened >= seqConfig.COFRE_AUTO_OPEN_INICIO && STATE.chestsOpened <= seqConfig.COFRE_AUTO_OPEN_FIN) {
      setTimeout(() => {
        const claimBtn = document.getElementById('claimLootBtn');
        if (claimBtn) claimBtn.click();
      }, 450);
    }

    spawnStickyNote();
    updateUI();
  } finally {
    setTimeout(() => {
      isLootProcessing = false;
    }, 300);
  }
}

function processLevelUp(fromDeal) {
  // [CAMBIO] Si viene del Empujón Siniestro (fromDeal === true) la XP se trata según DATOS_JUEGO.ECONOMIA.TRAPERO.empujon_siniestro_xp
  if (fromDeal === true) {
    const modoXp = DATOS_JUEGO.ECONOMIA.TRAPERO.empujon_siniestro_xp;
    if (modoXp === 'perder') STATE.xp = 0;
    else if (modoXp === 'restar_con_minimo_cero') STATE.xp = Math.max(0, STATE.xp - STATE.xpNext);
    // 'conservar': la XP actual no cambia
  } else {
    STATE.xp -= STATE.xpNext;
  }
  STATE.xp = Math.max(0, STATE.xp);
  STATE.level++;
  STATE.chestsAtLevelUp = STATE.chestsOpened;
  STATE.xpNext = getXpForLevel(STATE.level);

  const unlockKey = `nivel_${STATE.level}`;
  if (DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS[unlockKey]) {
    let giftObj = null;
    if (STATE.level === 2) { STATE.proPicks += 1; giftObj = { name: "Pin de Acero", icon: "fa-screwdriver" }; }
    else if (STATE.level === 3) { STATE.usb += 1; giftObj = { name: "Llave USB", icon: "fa-microchip" }; }
    else if (STATE.level === 5) { STATE.valves += 1; giftObj = { name: "Válvula Hidráulica", icon: "fa-faucet" }; }

    const speechText = DATOS_JUEGO.NARRATIVA.DUENDE_DESBLOQUEOS[unlockKey];
    triggerSequentialDialogue(
      "EL DUENDE",
      speechText,
      "fa-hat-wizard",
      `¡DESBLOQUEO DE NIVEL ${STATE.level}!`,
      "text-purple-300",
      giftObj,
      () => {
        updateUI();
        triggerLevelUpChoice();
      }
    );
  } else {
    triggerLevelUpChoice();
  }
}

const claimLootBtn = document.getElementById('claimLootBtn');
if (claimLootBtn) {
  claimLootBtn.addEventListener('click', () => {
    const lootModal = document.getElementById('lootModal');
    showSceneVeil();   // [0.088] el telón entra antes de cerrar el botín (sin destello de la habitación)
    if (lootModal) lootModal.classList.add('hidden');

    STATE.eventQueue = [];
    // [0.088] El mensaje de fin de maldición se encola al abrir el cofre; antes se borraba aquí
    if (STATE.curseEndPending) { STATE.curseEndPending = false; queueCurseEndMessage(); }

    // [0.082] Explicación del Trapero sobre el tanteo (una vez por bucle), antes que cualquier otro evento
    if (STATE.pendingTanteoPhrase) {
      const tanteoPhrase = STATE.pendingTanteoPhrase;
      STATE.pendingTanteoPhrase = null;
      STATE.eventQueue.push(() => triggerSequentialDialogue("EL TRAPERO", tanteoPhrase, "fa-mask", "Sobre tu pulso", "text-rose-400"));
    }

    const isLevelUpPending = (STATE.xp >= STATE.xpNext);
    if (isLevelUpPending) {
      STATE.eventQueue.push(() => processLevelUp());
    }

    const co = STATE.chestsOpened;
    const seqHist = DATOS_JUEGO.NARRATIVA.HISTORIA_SECUENCIA;
    const seqConfig = DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA;

    if (!STATE.sequenceBroken) {
      if (co === seqConfig.COFRE_INICIO_TRAPERO) {
        STATE.seqStage = 1;
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_79_TRAPERO, "fa-mask", "Advertencia", "text-rose-400");
        });
      } else if (co === seqConfig.COFRE_CONSEJO_NO_COMPRAR) {
        STATE.seqStage = 2;
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_84_TRAPERO, "fa-mask", "Instrucción", "text-rose-400");
        });
      } else if (co === seqConfig.COFRE_OFERTA_1) {
        STATE.eventQueue.push(() => triggerSpecialMerchantShop());
      } else if (co === seqConfig.COFRE_ADVERTENCIA_1 && STATE.traperoStrikes === 1) {
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_86_TRAPERO, "fa-mask", "Último Aviso", "text-rose-500");
        });
      } else if (co === seqConfig.COFRE_REFUERZO && STATE.traperoStrikes === 0) {
        STATE.eventQueue.push(() => {
          triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_87_TRAPERO, "fa-mask", "Refuerzo", "text-rose-400");
        });
      } else if (co === seqConfig.COFRE_OFERTA_2) {
        STATE.eventQueue.push(() => triggerSpecialMerchantShop());
      } else if (co === seqConfig.COFRE_EVALUACION) {
        if (STATE.traperoStrikes >= 2) {
          STATE.sequenceBroken = true;
          STATE.eventQueue.push(() => {
            triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_89_TRAPERO_CONDENA, "fa-mask", "Condena Eterna", "text-rose-700");
          });
        } else {
          STATE.eventQueue.push(() => {
            triggerSequentialDialogue("EL TRAPERO", seqHist.COFRE_89_TRAPERO_PRECLIMAX, "fa-mask", "Pre-Clímax", "text-rose-400");
          });
        }
      } else if (co === seqConfig.COFRE_OFERTA_3) {
        STATE.eventQueue.push(() => triggerSpecialMerchantShop());
      } else if (co === seqConfig.COFRE_CLIMAX_INICIO) {
        STATE.climaxPhase = true;
      } else if (co === seqConfig.COFRE_COLAPSO_FINAL) {
        triggerSensoryOverloadCollapse();
        return;
      }
    }

    if (!STATE.climaxPhase && co < seqConfig.COFRE_CLIMAX_INICIO) {
      const duendeFreq = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS.DUENDE_INTERVALO;
      const isDuendeChest = (co % duendeFreq === 0) && ![seqConfig.COFRE_OFERTA_1, seqConfig.COFRE_OFERTA_2, seqConfig.COFRE_OFERTA_3].includes(co);

      if (isDuendeChest && (co < seqConfig.COFRE_INICIO_TRAPERO || STATE.sequenceBroken)) {
        if (co < 30) {
          STATE.eventQueue.push(() => triggerMerchantShopModalSequence());
        } else {
          const cycle = co / duendeFreq;
          if (cycle % 2 === 0) STATE.eventQueue.push(() => triggerMerchantShopModalSequence());
          else STATE.eventQueue.push(() => triggerDuendeNarrativeVisit());
        }
      }

      const primerTrapero = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS.TRAPERO_PRIMER_COFRE;
      const intervaloTrapero = DATOS_JUEGO.PROGRESIÓN.INTERVALOS_VISITAS.TRAPERO_INTERVALO;
      const isFirstTrapero = (co === primerTrapero);
      const isSubsequentTrapero = (STATE.lastTraperoChest > 0 && (co - STATE.lastTraperoChest >= intervaloTrapero));

      if ((isFirstTrapero || isSubsequentTrapero) && (co < seqConfig.COFRE_INICIO_TRAPERO || STATE.sequenceBroken) && !isDuendeChest) {
        STATE.lastTraperoChest = co;
        if (STATE.paranoiaStage === 0) STATE.paranoiaStage = 1;
        STATE.eventQueue.push(() => triggerTraperoShopSequence());
      }
    }

    if (!STATE.eventQueue.length) hideSceneVeil();   // [0.088] sin eventos, el telón se retira enseguida
    processNextQueuedEvent();
    generateScreenChests();

    if (!STATE.sequenceBroken && co >= 100 && co < seqConfig.COFRE_AUTO_OPEN_FIN) {
      setTimeout(() => {
        openActiveChest();   // [0.089] apertura automática: directa, sin doble toque
      }, 350);
    }
  });
}

/* ==========================================================================
   TIENDA ESPECIAL 'NO COMPRAR NADA' (85, 88 Y 90)
   ========================================================================== */

function triggerSpecialMerchantShop() {
  const co = STATE.chestsOpened;
  const seqHist = DATOS_JUEGO.NARRATIVA.HISTORIA_SECUENCIA;
  let speech = "";

  if (co === DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_OFERTA_1) speech = seqHist.COFRE_85_DUENDE;
  else if (co === DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_OFERTA_2) speech = seqHist.COFRE_88_DUENDE;
  else if (co === DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_OFERTA_3) speech = seqHist.COFRE_90_DUENDE;

  triggerSequentialDialogue("EL DUENDE", speech, "fa-hat-wizard", "Tienda", "text-purple-300", null, () => {
    openSpecialShopModal();
  });
}

// [CAMBIO] Lógica de "NO COMPRAR NADA" compartida: también la usan los botones Salir y X de la tienda especial
function handleSpecialShopNoBuy() {
  specialShopOpen = false;
  STATE.boughtInCurrentShop = false;
  const merchantModal = document.getElementById('merchantModal');
  if (merchantModal) merchantModal.classList.add('hidden');

  const co = STATE.chestsOpened;
  const reac = DATOS_JUEGO.NARRATIVA.REACCIONES_DUENDE_NO_COMPRAR;
  let reactionText = reac[co] || reac.DEFAULT;
  {   // [0.090] Enfado: sonido y sacudida de pantalla, más fuertes cuanto más avanzado el final
    const ec = DATOS_JUEGO.ENFADO_DUENDE || {}; const e = ec[co] || ec.DEFAULT;
    if (e) { try { audio.init(); audio.playDuendeAngry(e.NIVEL); } catch (x) {} screenShake(e.SACUDIDA_PX, e.MS); if (e.NIVEL >= 2) flashScreen('rgba(190,20,30,.35)', 450); }
  }

  triggerSequentialDialogue(
    "EL DUENDE",
    reactionText,
    "fa-hat-wizard",
    "Desesperación",
    "text-purple-300",
    null,
    () => processNextQueuedEvent()
  );
}

function openSpecialShopModal() {
  const shopGrid = document.getElementById('merchantItemsGrid') || document.getElementById('shopItemsList');
  if (!shopGrid) return;
  shopGrid.innerHTML = '';
  STATE.boughtInCurrentShop = false;
  specialShopOpen = true;
  // [CAMBIO] La mesa de reciclaje no aplica en esta tienda: se vacía para que no queden botones de una visita anterior
  const staleRecycle = document.getElementById('recycleList');
  if (staleRecycle) staleRecycle.innerHTML = '';

  const discountMult = getDiscountMultiplier();
  let catalog = [
    { id: 'pack_ganzuas', name: '+3 Ganzúas Básicas', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_ganzuas * discountMult), icon: 'fa-key', prop: 'picks', qty: 3 },
    { id: 'pack_pines', name: '+2 Pines de Acero', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_pines * discountMult), icon: 'fa-screwdriver', prop: 'proPicks', qty: 2, minLvl: 2 },
    { id: 'pack_usb', name: '+2 Llaves USB', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_usb * discountMult), icon: 'fa-microchip', prop: 'usb', qty: 2, minLvl: 3 },
    { id: 'pack_valvulas', name: '+1 Válvula Hidráulica', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_valvulas * discountMult), icon: 'fa-faucet', prop: 'valves', qty: 1, minLvl: 5 },
    { id: 'carta_auto_open', name: 'Carta Auto-Open', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_auto_open * discountMult), icon: 'fa-wand-magic-sparkles', abilityProp: 'auto' },
    { id: 'carta_escudo', name: 'Carta Escudo Protector', cost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_escudo * discountMult), icon: 'fa-shield-halved', abilityProp: 'shield' }
  ];

  const availableCatalog = catalog.filter(item => !item.minLvl || STATE.level >= item.minLvl);
  const offeredItems = [...availableCatalog].sort(() => 0.5 - Math.random()).slice(0, 2);

  offeredItems.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-md";
    card.innerHTML = `
      <div>
        <div class="text-amber-400 font-black text-xs flex items-center gap-1.5 mb-0.5">
          <i class="fa-solid ${item.icon}"></i> ${item.name}
        </div>
        <div class="text-[10px] font-mono">Precio: <span class="text-yellow-400 font-bold">${item.cost} GP</span></div>
      </div>
      <button class="w-full py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 active:scale-95 text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer">
        COMPRAR (${item.cost} GP)
      </button>
    `;

    const btn = card.querySelector('button');
    btn.addEventListener('click', () => {
      if (STATE.gold >= item.cost) {
        STATE.gold -= item.cost;
        if (item.prop) STATE[item.prop] += item.qty;
        if (item.abilityProp) STATE.abilities[item.abilityProp]++;

        STATE.boughtInCurrentShop = true;
        STATE.traperoStrikes++;
        specialShopOpen = false;

        updateUI();
        const merchantModal = document.getElementById('merchantModal');
        if (merchantModal) merchantModal.classList.add('hidden');

        triggerSequentialDialogue(
          "EL DUENDE",
          DATOS_JUEGO.NARRATIVA.REACCIONES_DUENDE_NO_COMPRAR.COMPRA_EXITOSA,
          "fa-hat-wizard",
          "Codicia Satisfactoria",
          "text-purple-300",
          null,
          () => processNextQueuedEvent()
        );
      }
    });

    shopGrid.appendChild(card);
  });

  const noBuyCard = document.createElement('div');
  noBuyCard.className = "bg-amber-950/80 border-2 border-amber-400 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-xl animate-pulse";
  noBuyCard.innerHTML = `
    <div>
      <div class="text-amber-300 font-black text-xs flex items-center gap-1.5 mb-0.5">
        <i class="fa-solid fa-hand"></i> NO COMPRAR
      </div>
      <div class="text-[10px] text-amber-200/80 font-mono">Rechazar tentación</div>
    </div>
    <button id="noBuySpecialBtn" class="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-[11px] rounded-lg shadow-lg active:scale-95 transition-all border border-yellow-200 cursor-pointer">
      NO COMPRAR NADA
    </button>
  `;

  noBuyCard.querySelector('#noBuySpecialBtn').addEventListener('click', handleSpecialShopNoBuy);

  shopGrid.appendChild(noBuyCard);

  const merchantModal = document.getElementById('merchantModal');
  if (merchantModal) merchantModal.classList.remove('hidden');
}

/* ==========================================================================
   COLAPSO SENSORIAL Y SECUENCIA FINAL
   ========================================================================== */

function triggerSensoryOverloadCollapse() {
  stopMinigameTimer();
  const modals = ['merchantModal', 'traperoModal', 'minigameModal', 'dialogueModal', 'lootModal', 'persistentFeedbackBanner', 'duendeReceiptModal'];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'duendeReceiptModal') el.remove();
      else el.classList.add('hidden');
    }
  });

  const appBody = document.getElementById('appBody') || document.body;
  appBody.classList.add('shake-screen');

  let bursts = 0;
  const overloadInterval = setInterval(() => {
    bursts++;
    if (typeof audio !== 'undefined' && audio.playUnlockFanfare) audio.playUnlockFanfare('legendario');
    
    if (typeof spawnParticles === 'function') {
      const cx = Math.random() * window.innerWidth;
      const cy = Math.random() * window.innerHeight;
      spawnParticles(cx, cy, bursts % 2 === 0 ? '#c084fc' : '#f43f5e', 50, true);
    }

    if (bursts >= 35) {
      clearInterval(overloadInterval);
      appBody.classList.remove('shake-screen');
      executeDiffuseEchoTransition();
    }
  }, 100);
}

function executeDiffuseEchoTransition() {
  if (typeof audio !== 'undefined' && audio.ctx) audio.ctx.suspend();

  let overlay = document.getElementById('diffuseEchoOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'diffuseEchoOverlay';
    overlay.className = 'fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center p-8 transition-opacity duration-1000 opacity-0 pointer-events-none text-center';
    uiHost().appendChild(overlay);
  }

  const ecos = DATOS_JUEGO.NARRATIVA.ECOS_FINALES;

  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
  }, 100);

  setTimeout(() => {
    overlay.innerHTML = `
      <div id="echoMsg1" class="text-2xl sm:text-4xl font-mono font-bold tracking-widest text-[#c084fc] blur-[0.6px] drop-shadow-[0_0_15px_rgba(192,132,252,0.6)] transition-opacity duration-700 opacity-0 select-none">
        ${ecos.MENSAJE_1}
      </div>
    `;
    const msg1 = document.getElementById('echoMsg1');
    setTimeout(() => { if (msg1) msg1.classList.remove('opacity-0'); }, 50);

    setTimeout(() => {
      if (msg1) msg1.classList.add('opacity-0');

      setTimeout(() => {
        overlay.innerHTML = `
          <div id="echoMsg2" class="text-2xl sm:text-4xl font-mono font-bold tracking-widest text-[#f43f5e] blur-[0.6px] drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] transition-opacity duration-700 opacity-0 select-none">
            ${ecos.MENSAJE_2}
          </div>
        `;
        const msg2 = document.getElementById('echoMsg2');
        setTimeout(() => { if (msg2) msg2.classList.remove('opacity-0'); }, 50);

        setTimeout(() => {
          if (msg2) msg2.classList.add('opacity-0');
          overlay.classList.add('opacity-0');

          setTimeout(() => {
            overlay.remove();
            if (typeof audio !== 'undefined' && audio.ctx) audio.ctx.resume();
            
            // 🟢 TRANSICIÓN AL BUCLE 2
            STATE.currentLoop = 2;
            resetGame(true);
            // [0.084] Sin ningún aviso sobre el bucle: el jugador lo deduce por lo que ve y por las pistas de tenderos y post-its
          }, 1000);
        }, 2000);

      }, 600);
    }, 2000);

  }, 1000);
}

function triggerDuendeNarrativeVisit() {
  const tier = getNarrativeTier();
  const phrases = DATOS_JUEGO.NARRATIVA.DUENDE_FRASES[tier];
  const speech = phrases[Math.floor(Math.random() * phrases.length)];

  const smallGifts = [
    { prop: 'picks', name: '+1 Ganzúa Básica', icon: 'fa-key' },
    { prop: 'proPicks', name: '+1 Pin de Acero', icon: 'fa-screwdriver' },
    { prop: 'usb', name: '+1 Llave USB', icon: 'fa-microchip' },
    { prop: 'valves', name: '+1 Válvula Hidráulica', icon: 'fa-faucet' }
  ];

  const gift = smallGifts[Math.floor(Math.random() * smallGifts.length)];
  STATE[gift.prop]++;

  triggerSequentialDialogue("EL DUENDE", speech, "fa-hat-wizard", "Encuentro Casual", "text-purple-300", gift, () => {
    updateUI();
    processNextQueuedEvent();
  });
}

/* [0.089b] En pantallas táctiles, tocar una carta abre primero una pantalla con su descripción y los botones USAR / VOLVER
   (en PC se mantiene el clic directo + tooltip). Se intercepta en fase de captura, antes de los manejadores de cada carta. */
(function () {
  const ids = { abilityAutoBtn: 'auto', ability2xBtn: 'double', abilityShieldBtn: 'shield', abilityRiskBtn: 'riskPot', abilityPerdedorBtn: 'perdedor', abilitySummonDuendeBtn: 'summonDuende' };
  const NOMBRES = { auto: 'AUTO', double: '2X', shield: 'ESCUDO', riskPot: 'APUESTA', perdedor: 'PERDEDOR', summonDuende: 'DUENDE' };
  let bypass = false;
  document.addEventListener('click', (e) => {
    const cfg = DATOS_JUEGO.CARTAS_PANTALLA_PREVIA || {};
    if (!cfg.ACTIVAR || bypass) return;
    const btn = e.target.closest && e.target.closest(Object.keys(ids).map(i => '#' + i).join(','));
    if (!btn || btn.disabled) return;
    const isTouch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    if (cfg.SOLO_TACTIL && !isTouch) return;
    e.stopImmediatePropagation(); e.preventDefault();
    if (document.getElementById('cardPreModal')) return;
    const key = ids[btn.id];
    const m = document.createElement('div');
    m.id = 'cardPreModal';
    m.className = 'fixed inset-0 z-[9990] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5 font-sans';
    m.innerHTML = `
      <div class="bg-slate-900 border-2 border-amber-500/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
        <h3 class="text-xl font-black text-amber-300 font-retro">CARTA ${NOMBRES[key]}</h3>
        <p class="text-sm font-mono text-slate-200 leading-relaxed">${((DATOS_JUEGO.TEXTOS_AYUDA.cartas || {})[key]) || ''}</p>
        <button id="cardPreUse" class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm rounded-xl shadow-lg cursor-pointer">USAR</button>
        <button id="cardPreBack" class="w-full py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">VOLVER</button>
      </div>`;
    (uiHost() || document.body).appendChild(m);
    m.querySelector('#cardPreBack').addEventListener('click', () => m.remove());
    m.querySelector('#cardPreUse').addEventListener('click', () => { m.remove(); bypass = true; try { btn.click(); } finally { bypass = false; } });
  }, true);
})();

/* HABILIDADES TÁCTICAS */
const btnAuto = document.getElementById('abilityAutoBtn');
if (btnAuto) {
  btnAuto.addEventListener('click', () => {
    if (STATE.abilities.auto > 0) {
      STATE.abilities.auto--;
      stopMinigameTimer();
      const minigameModal = document.getElementById('minigameModal');
      if (minigameModal) minigameModal.classList.add('hidden');
      audio.playUnlockFanfare('epico');
      
      const active = STATE.screenChests[STATE.activeChestIdx];
      const reqCount = getRequiredToolCount(active.rarity);
      if (active.type.consumible !== 'picks' && !puzzleToolPaid) {   // [0.090] si ya se pagó al entrar, no se cobra otra vez
        STATE[active.type.consumible] = Math.max(0, STATE[active.type.consumible] - reqCount);
      }
      puzzleToolPaid = null; puzzleStat = null;   // [0.090] la carta AUTO no cuenta como puzle superado

      triggerLootExplosion();
      updateUI();
    }
  });
}

const btn2x = document.getElementById('ability2xBtn');
if (btn2x) {
  btn2x.addEventListener('click', () => {
    if (STATE.abilities.double > 0 && !STATE.active2XMultiplier) {
      STATE.abilities.double--;
      STATE.active2XMultiplier = true;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("⚡ ¡Doble Recompensa 2X activada!");
    }
  });
}

const btnShield = document.getElementById('abilityShieldBtn');
if (btnShield) {
  btnShield.addEventListener('click', () => {
    if (STATE.abilities.shield > 0 && !STATE.activeShield) {
      STATE.abilities.shield--;
      STATE.activeShield = true;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("🛡️ ¡ESCUDO activado!");
    }
  });
}

const btnRisk = document.getElementById('abilityRiskBtn');
if (btnRisk) {
  btnRisk.addEventListener('click', () => {
    if (STATE.abilities.riskPot > 0 && !STATE.riskModeActive) {
      STATE.abilities.riskPot--;
      STATE.riskModeActive = true;
      STATE.riskPot = 0;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("🎲 ¡Modo Apuesta Doble o Nada activado!");
    }
  });
}

const claimRiskBtn = document.getElementById('claimRiskPotBtn');
if (claimRiskBtn) {
  claimRiskBtn.addEventListener('click', () => {
    if (STATE.riskModeActive && STATE.riskPot > 0) {
      audio.init(); audio.playCashRegister();   // [0.089]
      STATE.gold += STATE.riskPot;
      showPersistentFeedback(`💰 ¡Has cobrado el Bote de Riesgo de ${STATE.riskPot} GP!`);
      STATE.riskPot = 0;
      STATE.riskModeActive = false;
      updateUI();
    }
  });
}

const btnPerdedor = document.getElementById('abilityPerdedorBtn');
if (btnPerdedor) {
  btnPerdedor.addEventListener('click', () => {
    if (STATE.abilities.perdedor > 0 && !STATE.perdedorActive) {
      STATE.perdedorActive = true;
      STATE.fallosConsecutivos = 0;
      audio.playClick(0.8);
      updateUI();
      showPersistentFeedback("💀 Carta PERDEDOR equipada: al acumular 5 fallos (aunque no sean seguidos) el botín de tu siguiente cofre abierto será Legendario x2.");
    }
  });
}

const btnSummon = document.getElementById('abilitySummonDuendeBtn');
if (btnSummon) {
  btnSummon.addEventListener('click', () => {
    if (STATE.abilities.summonDuende > 0) {
      STATE.abilities.summonDuende--;
      audio.playClick(0.9);
      updateUI();
      triggerMerchantShopModalSequence();
    }
  });
}

let globalPuzzleTimerInterval = null;
let globalPuzzleTimeLeft = 10;
let currentPuzzleConsumable = 'picks';
let TEST_SERIES = { active: false };   // [0.090] Modo test: puzles en serie
let puzzleToolPaid = null;   // [0.090] herramienta avanzada pagada al entrar al puzle en curso

function startMinigameTimer(seconds, consumableName) {
  stopMinigameTimer();
  // [CAMBIO] Se fija ANTES del return para los puzles sin tiempo (hack no legendario); si no, la X cobraba la herramienta equivocada
  currentPuzzleConsumable = consumableName;
  
  const timerEl = document.getElementById('puzzleTimerDisplay');

  if (seconds === null) {
    if (timerEl) {
      timerEl.textContent = `⏱️ ∞ SIN TIEMPO`;
      timerEl.className = "bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-full";
    }
    return;
  }

  let adjustedSeconds = seconds + STATE.perks.extraTime;
  globalPuzzleTimeLeft = adjustedSeconds;
  currentPuzzleConsumable = consumableName;

  if (timerEl) {
    timerEl.textContent = `⏱️ ${globalPuzzleTimeLeft}s`;
    timerEl.className = "bg-rose-950/90 text-rose-300 border border-rose-500/60 font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-full animate-pulse";
  }

  globalPuzzleTimerInterval = setInterval(() => {
    if (typeof rotateBlocked !== 'undefined' && rotateBlocked) return;   // [0.088] pausa mientras se pide girar el móvil
    globalPuzzleTimeLeft--;
    if (timerEl) timerEl.textContent = `⏱️ ${globalPuzzleTimeLeft}s`;

    if (globalPuzzleTimeLeft <= 0) {
      audio.playBreak();
      hideAllMinigameUI();
      showPersistentFeedback("⏱️ ¡TIEMPO AGOTADO! Fallo en el puzle.");
      if (isTrapLockpickActive()) showPersistentFeedback(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.TIEMPO, 'trampa');
      handleFailure(currentPuzzleConsumable);
    }
  }, 1000);
}

function stopMinigameTimer() {
  if (globalPuzzleTimerInterval) {
    clearInterval(globalPuzzleTimerInterval);
    globalPuzzleTimerInterval = null;
  }
}

function handleFailure(toolName = 'picks', reasonText = "Fallo en el puzle.") {
  if (TEST_SERIES.active) { testPuzzleResult(false); return; }   // [0.090] Modo test: no se gasta nada, pasa al siguiente puzle
  humHoldChest = null;   // [0.091] tras fallar, el cofre sigue ahí y el zumbido puede volver
  if (puzzleStat) { statsPuzzle(puzzleStat, false); puzzleStat = null; }   // [0.090]
  minigameInProgress = false;
  stopMinigameTimer();
  STATE.cleanStreak = 0;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const reqCount = getRequiredToolCount(active.rarity);

  if (STATE.riskModeActive && !STATE.activeShield) {   // [0.087b] el escudo también protege el bote de la Apuesta
    STATE.riskPot = 0;
    STATE.riskModeActive = false;
    // [0.082] El oro solo cae a 30 si el jugador tenía más de 30; si tenía menos, no se toca
    if (STATE.gold > 30) {
      STATE.gold = 30;
      showPersistentFeedback("💥 ¡Has fallado en Modo Apuesta! Has perdido todo el Bote y tu oro cae a 30 GP.");
    } else {
      showPersistentFeedback("💥 ¡Has fallado en Modo Apuesta! Has perdido todo el Bote.");
    }
  }

  if (STATE.perdedorActive) {
    STATE.fallosConsecutivos++;
    if (STATE.fallosConsecutivos >= 5) {
      STATE.perdedorActive = false;
      STATE.abilities.perdedor = Math.max(0, STATE.abilities.perdedor - 1);
      STATE.fallosConsecutivos = 0;
      audio.playUnlockFanfare('legendario');
      
      // [0.085] El cofre no cambia: solo su botín (XP y GP) pasará a ser legendario x2 al abrir el siguiente con éxito
      STATE.perdedorLootPending = true;
      showPersistentFeedback("💀 ¡5 Fallos completados! El botín (GP y XP) de tu siguiente cofre abierto será LEGENDARIO x2.");
    } else {
      showPersistentFeedback(`💀 Fallo registrado (${STATE.fallosConsecutivos}/5) para la carta PERDEDOR.`);
    }
  }

  if (STATE.activeShield) {
    STATE.activeShield = false;
    showPersistentFeedback(STATE.riskModeActive ? "🛡️ ¡Tu ESCUDO te ha salvado! Herramientas y Bote de Riesgo intactos." : "🛡️ ¡Tu ESCUDO te ha salvado! Herramientas intactas.");
    if (puzzleToolPaid) { STATE[puzzleToolPaid.prop] += puzzleToolPaid.n; puzzleToolPaid = null; }   // [0.090] el Escudo devuelve la herramienta pagada al entrar
    updateUI();
    return;
  }

  // [0.090] Si la herramienta ya se pagó al entrar, no se descuenta de nuevo
  if (puzzleToolPaid && puzzleToolPaid.prop === toolName) puzzleToolPaid = null;
  else STATE[toolName] = Math.max(0, STATE[toolName] - reqCount);
  if (toolName === 'picks') statsAdd('picksBroken', reqCount);   // [0.090]
  updateUI();
  
  if (!checkCanOpenAnyChestOnScreen()) {
    checkGameOver();
  }
}

function checkCanOpenAnyChestOnScreen() {
  if (STATE.abilities.auto > 0 || isClimaxActive()) return true;

  return STATE.screenChests.some(chest => {
    const req = getRequiredToolCount(chest.rarity);
    return STATE[chest.type.consumible] >= req;
  });
}

// [0.090] Secuencia de Game Over / Trato Injusto: (1) golpe con letras pixel art sangrientas, (2) diálogo del Trapero, (3) ventana del trato
let gameOverSeq = false;
const PIXEL_FONT = {
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001']
};
function whenBannerClosed(cb) {
  const tick = () => {
    const b = document.getElementById('persistentFeedbackBanner');
    if ((b && !b.classList.contains('hidden')) || modalVisible('dialogueModal') || modalVisible('lootModal')) setTimeout(tick, 200);
    else cb();
  };
  tick();
}
function runGameOverStrike(done) {
  // [0.091] Letras pixel art con volumen (bandas de rojo, borde negro grueso, brillos) que CAEN y rebotan; después gotean.
  const cfg = (DATOS_JUEGO.GAME_OVER || {}).GOLPE || {};
  const host = uiHost();
  const ov = document.createElement('div');
  ov.id = 'gameOverStrike';
  ov.style.cssText = 'position:absolute;inset:0;z-index:10030;background:rgba(0,0,0,.88);pointer-events:auto;opacity:0;transition:opacity .12s ease-out';
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated';
  ov.appendChild(cv); host.appendChild(ov);
  const W = host.clientWidth || 390, H = host.clientHeight || 700;
  cv.width = W; cv.height = H;
  const c2 = cv.getContext('2d');
  const uW = 23, sc = Math.max(4, Math.floor((W * 0.82) / uW));
  const ox = Math.round((W - uW * sc) / 2), oy = Math.round(H * 0.36 - 8.5 * sc);
  const fallMs = cfg.CAIDA_MS || 320, stagger = cfg.ESCALONADO_MS || 90, wordGap = cfg.PAUSA_PALABRAS_MS || 170;
  const ROW_COL = ['#ff6a5c', '#ff3a3a', '#d6142c', '#d6142c', '#b00d22', '#8a0818', '#6a0012'];
  const letters = [];
  ['GAME', 'OVER'].forEach((word, li) => {
    word.split('').forEach((ch, ci) => {
      const g = PIXEL_FONT[ch], set = new Set(), px = [];
      g.forEach((row, ry) => row.split('').forEach((v, rx) => { if (v === '1') { set.add(rx + ',' + ry); px.push([rx, ry]); } }));
      const drips = [];
      for (let rx = 0; rx < 5; rx++) if (g[6][rx] === '1' && Math.random() < 0.55) drips.push({ x: rx, len: 2 + Math.floor(Math.random() * 7), delay: Math.random() * 0.35 });
      const start = li * (3 * stagger + fallMs * 0.25 + wordGap) + ci * stagger;
      letters.push({ px, set, drips, x0: ci * 6, y0: li * 10, start, land: start + fallMs, dist: oy + (li * 10 + 8) * sc });
    });
  });
  const lastLand = letters[letters.length - 1].land, midLand = letters[3].land;
  const total = cfg.DURACION_MS || 3000;
  ov.style.opacity = '0';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });
  audio.init();
  setTimeout(() => { screenShake(Math.round((cfg.SACUDIDA_PX || 16) * 0.4), 220); }, midLand);
  setTimeout(() => {   // golpe final: sacudida, destello rojo y sonido grave
    try { audio.playGameOverStrike(); } catch (e) {}
    screenShake(cfg.SACUDIDA_PX || 16, cfg.SACUDIDA_MS || 650);
    flashScreen('rgba(200,0,20,.55)', 600);
  }, lastLand);
  const t0 = performance.now();
  const fr = v => Math.round(v);
  (function frame() {
    const t = performance.now() - t0;
    c2.clearRect(0, 0, W, H);
    letters.forEach(L => {
      const p = (t - L.start) / fallMs;
      if (p < 0) return;
      let dy = 0;
      if (p < 1) dy = -L.dist * (1 - p * p);
      else { const b = (t - L.land) / 260; if (b < 1) dy = -Math.abs(Math.sin(b * Math.PI * 1.5)) * sc * 0.9 * (1 - b); }
      const X = u => fr(ox + (L.x0 + u) * sc), Y = u => fr(oy + dy + (L.y0 + u) * sc), S = u => Math.max(1, fr(u * sc));
      // 1) borde negro grueso
      c2.fillStyle = '#000';
      L.px.forEach(([x, y]) => c2.fillRect(X(x - 0.55), Y(y - 0.55), S(2.1), S(2.1)));
      // 2) gotas (tras caer): borde, cuerpo oscuro, brillo y gota redonda al final
      const gk = Math.min(1, Math.max(0, (t - L.land - 150) / 1100));
      L.drips.forEach(d => {
        const len = Math.floor(d.len * Math.min(1, Math.max(0, (gk - d.delay) / (1 - d.delay))));
        if (len <= 0) return;
        c2.fillStyle = '#000'; c2.fillRect(X(d.x + 0.05), Y(7 - 0.4), S(0.9), S(len + 0.4 + 0.45));
        c2.fillStyle = '#a10018'; c2.fillRect(X(d.x + 0.2), Y(7 - 0.4), S(0.6), S(len + 0.2));
        c2.fillStyle = '#e03a48'; c2.fillRect(X(d.x + 0.2), Y(7), S(0.18), S(len));
        c2.fillStyle = '#000'; c2.fillRect(X(d.x + 0.05), Y(7 + len - 0.3), S(0.9), S(0.9));
        c2.fillStyle = '#c0001e'; c2.fillRect(X(d.x + 0.17), Y(7 + len - 0.2), S(0.66), S(0.66));
      });
      // 3) relleno en bandas + brillos y sombras de borde
      L.px.forEach(([x, y]) => { c2.fillStyle = ROW_COL[y]; c2.fillRect(X(x), Y(y), S(1) + 1, S(1) + 1); });
      L.px.forEach(([x, y]) => {
        if (!L.set.has(x + ',' + (y - 1))) { c2.fillStyle = '#ffc7b8'; c2.fillRect(X(x), Y(y), S(1) + 1, S(0.26)); }
        if (!L.set.has((x - 1) + ',' + y)) { c2.fillStyle = '#ff9a8a'; c2.fillRect(X(x), Y(y), S(0.2), S(1) + 1); }
        if (!L.set.has(x + ',' + (y + 1))) { c2.fillStyle = '#3d000b'; c2.fillRect(X(x), Y(y + 0.72), S(1) + 1, S(0.28) + 1); }
        if (!L.set.has((x + 1) + ',' + y)) { c2.fillStyle = '#58000d'; c2.fillRect(X(x + 0.8), Y(y), S(0.2) + 1, S(1) + 1); }
      });
    });
    if (t < total) requestAnimationFrame(frame);
    else { ov.style.transition = 'opacity .35s ease-in'; ov.style.opacity = '0'; setTimeout(() => { ov.remove(); done(); }, 380); }
  })();
}
function showFinalGameOver() {
  gameOverSeq = false;
  const goChests = document.getElementById('goChests'); if (goChests) goChests.textContent = STATE.chestsOpened;
  const goLvl = document.getElementById('goLevel'); if (goLvl) goLvl.textContent = STATE.level;
  // El bucle solo se nombra si se muere en el segundo o posteriores (en el primero el jugador no sabe que hay bucles)
  const goLoopRow = document.getElementById('goLoopRow'), goLoop = document.getElementById('goLoop');
  if (goLoopRow) { goLoopRow.classList.toggle('hidden', (STATE.currentLoop || 1) < 2); if (goLoop) goLoop.textContent = STATE.currentLoop; }
  const goModal = document.getElementById('gameOverModal'); if (goModal) goModal.classList.remove('hidden');
  audio.init(); audio.playGameOver();
  clearSave();
}
function checkGameOver() {
  if (checkCanOpenAnyChestOnScreen()) return;
  if (gameOverSeq) return;
  gameOverSeq = true;
  whenBannerClosed(() => runGameOverStrike(() => {
    if (STATE.salvageCurseActive && STATE.cursedChestsLeft > 0) { showFinalGameOver(); return; }
    openUnfairDeal();
  }));
}
function openUnfairDeal() {
  const active = STATE.screenChests[STATE.activeChestIdx];
  const reqCount = getRequiredToolCount(active.rarity);
  let toolTitle = 'Ganzúa Básica';
  if (active.type.consumible === 'proPicks') toolTitle = 'Pin de Acero';
  if (active.type.consumible === 'usb') toolTitle = 'Llave USB';
  if (active.type.consumible === 'valves') toolTitle = 'Válvula Hidráulica';

  const curseBase = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.DURACION_BASE;
  const curseInc = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.INCREMENTO_POR_TRATO;
  const curseDuration = curseBase + (STATE.salvageDealsCount * curseInc);

  const offerTxt = document.getElementById('unfairOfferText');
  if (offerTxt) {
    offerTxt.innerHTML = `
      • Recibes <span class="text-amber-400 font-bold">+${reqCount} ${toolTitle}</span> y <span class="text-amber-400 font-bold">+2 Ganzúas</span>.<br>
      • Sufres Maldición durante <span class="text-rose-400 font-bold">${curseDuration} cofres</span> (-50% GP y XP).
    `;
  }
  const showDeal = () => { const dealModal = document.getElementById('unfairDealModal'); if (dealModal) dealModal.classList.remove('hidden'); };
  // Diálogo del Trapero (la primera vez más explicativo)
  const fr = (DATOS_JUEGO.NARRATIVA.TRAPERO_GAME_OVER || {});
  const first = STATE.salvageDealsCount === 0;
  const pool = first ? [fr.PRIMERA] : (fr.OTRAS || []);
  const phrase = (pool.filter(Boolean).length ? pool.filter(Boolean)[Math.floor(Math.random() * pool.filter(Boolean).length)] : '');
  if (phrase) triggerSequentialDialogue("EL TRAPERO", phrase, "fa-mask", "Última oportunidad", "text-rose-400", null, showDeal);
  else showDeal();
}

const acceptDealBtn = document.getElementById('acceptDealBtn');
if (acceptDealBtn) {
  acceptDealBtn.addEventListener('click', () => {
    const dealModal = document.getElementById('unfairDealModal');
    if (dealModal) dealModal.classList.add('hidden');
    gameOverSeq = false;
    STATE.salvageDealsCount++;
    STATE.salvageCurseActive = true;
    
    const curseBase = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.DURACION_BASE;
    const curseInc = DATOS_JUEGO.ECONOMIA.MALDICION_SALVAMENTO.INCREMENTO_POR_TRATO;
    STATE.cursedChestsLeft = curseBase + (STATE.salvageDealsCount - 1) * curseInc;

    STATE.picks += 2;
    const active = STATE.screenChests[STATE.activeChestIdx];
    const reqCount = getRequiredToolCount(active.rarity);
    STATE[active.type.consumible] = Math.max(reqCount, STATE[active.type.consumible] + reqCount);

    audio.playUnlockFanfare('epico');
    showPersistentFeedback(`📜 Trato Injusto #${STATE.salvageDealsCount} aceptado. Maldición activada por ${STATE.cursedChestsLeft} cofres.`);
    updateUI();
  });
}

const declineDealBtn = document.getElementById('declineDealBtn');
if (declineDealBtn) {
  declineDealBtn.addEventListener('click', () => {
    const dealModal = document.getElementById('unfairDealModal'); if (dealModal) dealModal.classList.add('hidden');
    showFinalGameOver();
  });
}

function updateUI() {
  trackStats();   // [0.090]
  const levelEl = document.getElementById('playerLevel'); if (levelEl) levelEl.textContent = STATE.level;
  
  const xpBar = document.getElementById('xpBar'); 
  if (xpBar) {
    xpBar.style.width = `${Math.min(100, (STATE.xp / STATE.xpNext) * 100)}%`;
    const xpContainer = xpBar.parentElement;
    if (xpContainer && !xpContainer.dataset.hasClickListener) {
      xpContainer.dataset.hasClickListener = 'true';
      xpContainer.classList.add('cursor-pointer');
      xpContainer.addEventListener('click', () => {
        showPersistentFeedback(`⭐ EXPERIENCIA: ${STATE.xp} / ${STATE.xpNext} XP (Faltan ${STATE.xpNext - STATE.xp} XP para Nivel ${STATE.level + 1})`);
      });
    }
  }

  const goldEl = document.getElementById('goldText'); if (goldEl) goldEl.textContent = STATE.gold;
  const pickEl = document.getElementById('pickText'); if (pickEl) pickEl.textContent = STATE.picks;
  const proPickEl = document.getElementById('proPickText'); if (proPickEl) proPickEl.textContent = STATE.proPicks;
  const usbEl = document.getElementById('usbText'); if (usbEl) usbEl.textContent = STATE.usb;
  const valveEl = document.getElementById('valveText'); if (valveEl) valveEl.textContent = STATE.valves;

  let chestCounterEl = document.getElementById('loopCounterDisplay');
  const abilitiesBar = document.getElementById('abilitiesBar') || document.getElementById('tacticalCardsContainer') || document.getElementById('abilityAutoBtn')?.parentElement;

  if (STATE.chestCounterUnlocked) {
    if (!chestCounterEl) {
      chestCounterEl = document.createElement('div');
      chestCounterEl.id = 'loopCounterDisplay';
      chestCounterEl.className = 'bg-amber-950/80 border border-amber-500/60 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 font-mono text-xs text-amber-300 backdrop-blur-md shrink-0 animate-fade-in select-none';
      chestCounterEl.innerHTML = `<i class="fa-solid fa-stopwatch text-amber-400 text-sm"></i> <span class="font-bold text-amber-400/80">COFRES:</span> <span id="loopCounterValue" class="font-black text-amber-200 text-sm">0</span>`;
    }

    // [0.087b] Lugar fijo: siempre al final (extremo derecho) de la fila de cartas
    chestCounterEl.classList.add('ml-auto');
    if (abilitiesBar && (chestCounterEl.parentElement !== abilitiesBar || abilitiesBar.lastElementChild !== chestCounterEl)) {
      abilitiesBar.appendChild(chestCounterEl);
    }

    chestCounterEl.classList.remove('hidden');
    const valEl = document.getElementById('loopCounterValue');
    if (valEl) valEl.textContent = STATE.chestsOpened;
  } else if (chestCounterEl) {
    chestCounterEl.classList.add('hidden');
  }

  const riskBar = document.getElementById('riskPotBar');
  if (riskBar) {
    if (STATE.riskModeActive) {
      riskBar.classList.remove('hidden');
      const potEl = document.getElementById('riskPotText');
      if (potEl) potEl.textContent = STATE.riskPot;
    } else {
      riskBar.classList.add('hidden');
    }
  }

  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
    if (STATE.cleanStreak >= DATOS_JUEGO.ECONOMIA.RACHAS_APERTURA.MINIMO_PARA_BONUS) {
      streakBadge.classList.remove('hidden');
      const streakText = document.getElementById('streakText');
      if (streakText) streakText.textContent = `x${STATE.cleanStreak}`;
      setHelp(streakBadge, helpText('racha'));
    } else {
      streakBadge.classList.add('hidden');
    }
  }

  // [0.087b] Efecto "Por Amor al Arte": sin XP durante N cofres
  const noXpBadge = document.getElementById('noXpBadge');
  if (noXpBadge) {
    if (STATE.noXpChestsLeft > 0) {
      noXpBadge.classList.remove('hidden');
      noXpBadge.innerHTML = `<i class="fa-solid fa-ban"></i> x${STATE.noXpChestsLeft}`;
      setHelp(noXpBadge, helpText('sinXp', { n: STATE.noXpChestsLeft }));
    } else noXpBadge.classList.add('hidden');
  }

  const curseBadge = document.getElementById('curseBadge');
  if (curseBadge) {
    if (STATE.cursedChestsLeft > 0) {
      curseBadge.classList.remove('hidden');
      curseBadge.innerHTML = `<i class="fa-solid fa-skull"></i> x${STATE.cursedChestsLeft}`;
      setHelp(curseBadge, helpText('maldicion', { n: STATE.cursedChestsLeft }), true);
    } else {
      curseBadge.classList.add('hidden');
    }
  }

  // [0.087] Etiquetas y banners de las llaves consumibles
  [['pickText', 'ganzuas'], ['proPickChip', 'pines'], ['usbChip', 'usb'], ['valveChip', 'valvulas']].forEach(([id, key]) => {
    let el = document.getElementById(id);
    if (el && id === 'pickText') el = el.parentElement;
    if (el) setHelp(el, helpText(key));
  });
  // y de las cartas consumibles (tooltip; al pulsarlas ya muestran su propio aviso al activarse)
  [['abilityAutoBtn', 'auto'], ['ability2xBtn', 'double'], ['abilityShieldBtn', 'shield'], ['abilityRiskBtn', 'riskPot'], ['abilityPerdedorBtn', 'perdedor'], ['abilitySummonDuendeBtn', 'summonDuende']].forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.title = ((DATOS_JUEGO.TEXTOS_AYUDA.cartas || {})[key]) || '';
  });

  const proChip = document.getElementById('proPickChip'); if (proChip && STATE.level >= 2) proChip.classList.remove('hidden');
  const usbChip = document.getElementById('usbChip'); if (usbChip && STATE.level >= 3) usbChip.classList.remove('hidden');
  const valveChip = document.getElementById('valveChip'); if (valveChip && STATE.level >= 4) valveChip.classList.remove('hidden');

  
  // ACTUALIZACIÓN DE PERKS Y PASIVAS
  const perksBar = document.getElementById('perksBar');
  if (perksBar) {
    perksBar.innerHTML = '';

    // [0.084] Maestría + Torpeza del mismo tipo: los niveles se anulan 1 con 1
    reconcileMasteryTorpeza();

    const perkList = [
      { active: STATE.perks.sweetSpot > 0, text: `🎯 Firme x${STATE.perks.sweetSpot}`, shortText: `🎯 x${STATE.perks.sweetSpot}`, desc: "Mano Firme: +20% margen de error en puzles.", isTorpeza: false },
      { active: STATE.perks.rarityBonus > 0, text: `👁️ Cazador x${STATE.perks.rarityBonus}`, shortText: `👁️ x${STATE.perks.rarityBonus}`, desc: "Ojo de Cazador: Mayor probabilidad de cofres Raros, Épicos y Legendarios.", isTorpeza: false },
      { active: STATE.perks.discount > 0, text: `🏷️ Regateador x${STATE.perks.discount}`, shortText: `🏷️ x${STATE.perks.discount}`, desc: `Regateador: -${Math.round(getDiscountPct() * 100)}% en los precios del Duende.`, isTorpeza: false },
      { active: STATE.perks.slowerPistons > 0, text: `⚙️ Lentos x${STATE.perks.slowerPistons}`, shortText: `⚙️ x${STATE.perks.slowerPistons}`, desc: "Pistones Lentos: -20% velocidad en minijuego de pistones.", isTorpeza: false },
      { active: STATE.perks.goldStreak > 0, text: `💰 Bolsillo x${STATE.perks.goldStreak}`, shortText: `💰 x${STATE.perks.goldStreak}`, desc: "Fondo de Bolsillo: +1 GP fijo y +15% extra en racha de aperturas.", isTorpeza: false },
      { active: STATE.perks.extraTime > 0, text: `⏱️ Tranquilo (+${STATE.perks.extraTime}s)`, shortText: `⏱️ +${STATE.perks.extraTime}s`, desc: "Hombre Tranquilo: Segundos extra en temporizadores de puzle.", isTorpeza: false },
      { active: STATE.perks.oidoClinico > 0, text: `👂 Oído Clínico`, shortText: `👂`, desc: "Oído Clínico: Advertencia visual de Falso Punto Dulce.", isTorpeza: false },
      { active: STATE.perks.bonusMadera > 0, text: `📦 Clásico Lv.${STATE.perks.bonusMadera} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusMadera) * 100)}%)`, shortText: `📦 Lv.${STATE.perks.bonusMadera}`, desc: `Clásico: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusMadera) * 100)}% botín y EXP en cofres de Madera.`, isTorpeza: false },
      { active: STATE.perks.bonusAcero > 0, text: `⚙️ Mecánico Lv.${STATE.perks.bonusAcero} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusAcero) * 100)}%)`, shortText: `⚙️ Lv.${STATE.perks.bonusAcero}`, desc: `Mecánico: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusAcero) * 100)}% botín y EXP en cofres de Acero.`, isTorpeza: false },
      { active: STATE.perks.bonusDigital > 0, text: `💻 Informático Lv.${STATE.perks.bonusDigital} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusDigital) * 100)}%)`, shortText: `💻 Lv.${STATE.perks.bonusDigital}`, desc: `Informático: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusDigital) * 100)}% botín y EXP en cofres Digitales (USB).`, isTorpeza: false },
      { active: STATE.perks.bonusVapor > 0, text: `🚰 Fontanero Lv.${STATE.perks.bonusVapor} (+${Math.round(getMasteryTorpezaPct(STATE.perks.bonusVapor) * 100)}%)`, shortText: `🚰 Lv.${STATE.perks.bonusVapor}`, desc: `Fontanero: +${Math.round(getMasteryTorpezaPct(STATE.perks.bonusVapor) * 100)}% botín y EXP en cofres de Vapor.`, isTorpeza: false },
      { active: STATE.perks.shopStealFree, text: `🎭 Ladrón`, shortText: `🎭`, desc: "Ladrón: El primer ítem de la tienda del Duende es gratis.", isTorpeza: false },
      { active: STATE.perks.luckyLootChance > 0, text: `🍀 Suerte 15%`, shortText: `🍀 15%`, desc: "Tipo con Suerte: 15% de probabilidad de duplicar botín.", isTorpeza: false },
      
      // TORPEZAS
      { active: STATE.torpezas.madera > 0, text: `⚠️ Torpeza Madera Lv.${STATE.torpezas.madera} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.madera) * 100)}%)`, shortText: `⚠️📦 ${STATE.torpezas.madera}`, desc: `Torpeza en Madera: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.madera) * 100)}% botín y EXP en cofres de Madera.`, isTorpeza: true },
      { active: STATE.torpezas.acero > 0, text: `⚠️ Torpeza Acero Lv.${STATE.torpezas.acero} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.acero) * 100)}%)`, shortText: `⚠️⚙️ ${STATE.torpezas.acero}`, desc: `Torpeza en Acero: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.acero) * 100)}% botín y EXP en cofres de Acero.`, isTorpeza: true },
      { active: STATE.torpezas.digital > 0, text: `⚠️ Torpeza Digital Lv.${STATE.torpezas.digital} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.digital) * 100)}%)`, shortText: `⚠️💻 ${STATE.torpezas.digital}`, desc: `Torpeza en Digital: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.digital) * 100)}% botín y EXP en cofres Digitales (USB).`, isTorpeza: true },
      { active: STATE.torpezas.vapor > 0, text: `⚠️ Torpeza Vapor Lv.${STATE.torpezas.vapor} (-${Math.round(getMasteryTorpezaPct(STATE.torpezas.vapor) * 100)}%)`, shortText: `⚠️🚰 ${STATE.torpezas.vapor}`, desc: `Torpeza en Vapor: -${Math.round(getMasteryTorpezaPct(STATE.torpezas.vapor) * 100)}% botín y EXP en cofres de Vapor.`, isTorpeza: true }
    ];

    // [0.089b] Efectos temporales / penalizaciones de los tratos del Trapero, en la misma barra
    const tempXp = STATE.xpBoostChestsLeft > 0, permXp = !!(STATE.traperoBuffs && STATE.traperoBuffs.bonusXp);
    perkList.push(
      { active: tempXp, text: `⭐ XP x${STATE.xpBoostChestsLeft}`, shortText: `⭐ x${STATE.xpBoostChestsLeft}`, desc: helpText('xpExtra', { n: STATE.xpBoostChestsLeft }), isTorpeza: false, isBoost: true },
      { active: permXp, text: `⭐ XP ∞`, shortText: `⭐ ∞`, desc: helpText('xpPermanente'), isTorpeza: false, isBoost: true },
      { active: STATE.harderPuzzlesLeft > 0, text: `💀 Puzles duros x${STATE.harderPuzzlesLeft}`, shortText: `💀 x${STATE.harderPuzzlesLeft}`, desc: `Pacto de la Sombra: los puzles son más difíciles durante los próximos ${STATE.harderPuzzlesLeft} cofres.`, isTorpeza: true },
      { active: !!(STATE.traperoBuffs && STATE.traperoBuffs.harderMinigames), text: `💀 Puzles duros ∞`, shortText: `💀 ∞`, desc: `Los puzles son más difíciles de forma permanente.`, isTorpeza: true },
      { active: !!STATE.picksBrokenOnUse, text: `🩹 Dedos Rotos`, shortText: `🩹`, desc: `Dedos Rotos: las ganzúas se rompen al usarse hasta que empiece el siguiente bucle.`, isTorpeza: true },
      { active: STATE.heavyChestsLeft > 0, text: `📜 Contrato x${STATE.heavyChestsLeft}`, shortText: `📜 x${STATE.heavyChestsLeft}`, desc: `Contrato Leonino: los próximos ${STATE.heavyChestsLeft} cofres Raros o superiores piden +1 herramienta.`, isTorpeza: true }
    );
    const activePerks = perkList.filter(p => p.active);
    const activePerksCount = activePerks.length;
    const isCompact = activePerksCount >= 4;

    activePerks.forEach(p => {
      const badge = document.createElement('span');
      if (p.isTorpeza) {
        badge.className = "perk-badge bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-700 cursor-pointer select-none font-mono whitespace-nowrap shrink-0 transition-transform hover:scale-105";
      } else if (p.isBoost) {
        badge.className = "perk-badge bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-600 cursor-pointer select-none font-mono whitespace-nowrap shrink-0 transition-transform hover:scale-105";
      } else {
        badge.className = "perk-badge bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700 cursor-pointer select-none font-mono whitespace-nowrap shrink-0 transition-transform hover:scale-105";
      }
      badge.title = p.desc;
      badge.textContent = isCompact ? p.shortText : p.text;
      
      badge.addEventListener('click', () => {
        showPersistentFeedback(`ℹ️ ${p.desc}`);
      });

      perksBar.appendChild(badge);
    });

    if (activePerksCount > 0) perksBar.classList.remove('hidden');
    else perksBar.classList.add('hidden');
  }

  const cntAuto = document.getElementById('cntAuto'); if (cntAuto) cntAuto.textContent = `x${STATE.abilities.auto}`;
  const cnt2x = document.getElementById('cnt2x'); if (cnt2x) cnt2x.textContent = `x${STATE.abilities.double}`;
  const cntShield = document.getElementById('cntShield'); if (cntShield) cntShield.textContent = `x${STATE.abilities.shield}`;
  const cntRisk = document.getElementById('cntRisk'); if (cntRisk) cntRisk.textContent = `x${STATE.abilities.riskPot}`;
  const cntPerdedor = document.getElementById('cntPerdedor'); if (cntPerdedor) cntPerdedor.textContent = `x${STATE.abilities.perdedor}`;
  const cntSummon = document.getElementById('cntSummon'); if (cntSummon) cntSummon.textContent = `x${STATE.abilities.summonDuende}`;

  const btnAutoEl = document.getElementById('abilityAutoBtn');
  const btn2xEl = document.getElementById('ability2xBtn');
  const btnShieldEl = document.getElementById('abilityShieldBtn');
  const btnRiskEl = document.getElementById('abilityRiskBtn');
  const btnPerdedorEl = document.getElementById('abilityPerdedorBtn');
  const btnSummonEl = document.getElementById('abilitySummonDuendeBtn');

  if (btnAutoEl) { if (STATE.abilities.auto <= 0) btnAutoEl.classList.add('hidden'); else btnAutoEl.classList.remove('hidden'); btnAutoEl.disabled = STATE.abilities.auto <= 0; }
  if (btn2xEl) { if (STATE.abilities.double <= 0) btn2xEl.classList.add('hidden'); else btn2xEl.classList.remove('hidden'); btn2xEl.disabled = STATE.abilities.double <= 0 || STATE.active2XMultiplier; }
  if (btnShieldEl) { if (STATE.abilities.shield <= 0) btnShieldEl.classList.add('hidden'); else btnShieldEl.classList.remove('hidden'); btnShieldEl.disabled = STATE.abilities.shield <= 0 || STATE.activeShield; }
  if (btnRiskEl) { if (STATE.abilities.riskPot <= 0) btnRiskEl.classList.add('hidden'); else btnRiskEl.classList.remove('hidden'); btnRiskEl.disabled = STATE.abilities.riskPot <= 0 || STATE.riskModeActive; }
  if (btnPerdedorEl) { if (STATE.abilities.perdedor <= 0) btnPerdedorEl.classList.add('hidden'); else btnPerdedorEl.classList.remove('hidden'); btnPerdedorEl.disabled = STATE.abilities.perdedor <= 0 || STATE.perdedorActive; }
  if (btnSummonEl) { if (STATE.abilities.summonDuende <= 0) btnSummonEl.classList.add('hidden'); else btnSummonEl.classList.remove('hidden'); btnSummonEl.disabled = STATE.abilities.summonDuende <= 0; }

  // [0.087b] Las cartas AUTO y DUENDE palpitan cuando ningún cofre en pantalla se puede abrir con las llaves actuales
  const blockedNow = STATE.screenChests.length > 0 && !isClimaxActive() && !STATE.screenChests.some(c => (STATE[c.type.consumible] || 0) >= getRequiredToolCount(c.rarity));   // [0.088] ya no cuenta la propia carta AUTO
  ['abilityAutoBtn', 'abilitySummonDuendeBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('card-pulse', !!blockedNow && !el.disabled && !el.classList.contains('hidden'));
  });

  fitHudTitle();
  trackKeyGains();
  updateShopResourcesUI();
  scheduleSave();
}

// [0.089b] Si el título no cabe junto a las insignias, pasa a "JOMC" en vez de partirse en dos líneas
function fitHudTitle() {
  const root = document.documentElement;
  const t = document.querySelector('.title-full');
  if (!t) return;
  root.classList.remove('title-compact');
  const box = t.parentElement;
  if (box && box.scrollWidth > box.clientWidth + 1) root.classList.add('title-compact');
}
window.addEventListener('resize', () => { try { fitHudTitle(); } catch (e) {} });

function updateShopResourcesUI() {
  const resHTML = `
    <span class="text-yellow-400 font-black"><i class="fa-solid fa-coins"></i> ${STATE.gold} GP</span>
    <span class="text-amber-400 font-black"><i class="fa-solid fa-key"></i> ${STATE.picks}</span>
    <span class="text-emerald-400 font-black"><i class="fa-solid fa-screwdriver"></i> ${STATE.proPicks}</span>
    <span class="text-cyan-400 font-black"><i class="fa-solid fa-microchip"></i> ${STATE.usb}</span>
    <span class="text-rose-400 font-black"><i class="fa-solid fa-faucet"></i> ${STATE.valves}</span>
  `;
  const mBar = document.getElementById('merchantResourceBar');
  const tBar = document.getElementById('traperoResourceBar');
  const curseHTML = STATE.cursedChestsLeft > 0 ? `<span class="text-rose-300 font-black" title="Cofres de maldición restantes"><i class="fa-solid fa-skull"></i> ${STATE.cursedChestsLeft}</span>` : '';
  if (mBar) mBar.innerHTML = resHTML;
  if (tBar) tBar.innerHTML = resHTML + curseHTML;   // [0.087b] el Trapero muestra los turnos de maldición
}

/* ==========================================================================
   MINIJUEGO 1: GANZÚA BÁSICA (LOCKPICK) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let lpState = {
  angle: 0, screwdriver: 0, sweetSpot: 0, decoySpots: [], tolerance: 14, health: 100, isTension: false, isBreaking: false,
  isCompleted: false, isTrapChest: false,
  tanteoActive: false, // [0.082] ¿penaliza el tanteo en este cofre? (Bucle 2/3 y rareza Raro+)
  tanteoUsed: false    // [0.082] ¿el jugador ha soltado la tensión alguna vez en este intento?
};

// [0.082] ¿Aplican las reglas avanzadas (Bucle 2/3) a un cofre de esta rareza?
function isAdvancedLoopFor(rarityId) {
  const A = DATOS_JUEGO.MINIJUEGOS.AVANZADO;
  const loop = Math.min(STATE.currentLoop || 1, 3);
  return A.BUCLES_ACTIVOS.includes(loop) && A.RAREZAS.includes(rarityId);
}

function startLockpickGame() {
  const configLP = DATOS_JUEGO.MINIJUEGOS.LOCKPICK;
  startMinigameTimer(configLP.TIEMPO_BASE_SEGUNDOS, 'picks');

  lpState.angle = 0;
  lpState.screwdriver = 0;
  lpState.sweetSpot = (Math.random() - 0.5) * 150;
  lpState.health = configLP.SALUD_INICIAL;
  lpState.isTension = false;
  lpState.isBreaking = false;
  lpState.isCompleted = false;
  lpState.isTrapChest = false;

  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';
  lpState.tanteoActive = isAdvancedLoopFor(rarityId);
  lpState.tanteoUsed = false;

  let baseTol = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configLP.TOLERANCIA_DIFICIL : configLP.TOLERANCIA_NORMAL;
  baseTol += (STATE.perks.sweetSpot * 3);
  lpState.tolerance = baseTol;

  if (rarityId === 'legendario' && Math.random() < configLP.PROB_TRAMPA_LEGENDARIO) {
    lpState.isTrapChest = true;
  }

  lpState.decoySpots = [];
  const decoyChance = configLP.PROB_DECOYS_POR_RAREZA[rarityId] || 0.0;
  
  if (Math.random() < decoyChance || lpState.isTrapChest) {
    let count = rarityId === 'legendario' ? 3 : (rarityId === 'epico' ? 2 : 1);
    if (lpState.isTrapChest) count = 4;
    // [CAMBIO] Los señuelos se separan del punto real según la tolerancia (Mano Firme la amplía), para que sus zonas no se solapen
    const minSep = (lpState.tolerance * 2) + 6;
    for (let d = 0; d < count; d++) {
      const dist = minSep + Math.random() * 25;
      const sign = (d % 2 === 0 ? 1 : -1);
      let pos = lpState.sweetSpot + sign * dist;
      if (pos > 85 || pos < -85) pos = lpState.sweetSpot - sign * dist;
      lpState.decoySpots.push(Math.max(-85, Math.min(85, pos)));
    }
  }

  const angleSlider = document.getElementById('angleSlider');
  if (angleSlider) angleSlider.value = 0;
  const readout = document.getElementById('angleReadout'); if (readout) readout.textContent = "0°";
  const lpContainer = document.getElementById('lockpickContainer'); if (lpContainer) lpContainer.classList.remove('hidden');

  updateLockpickProximityVisuals();
  if (window.showLockTouchHints) window.showLockTouchHints();   // [0.090]
}

function updateLockpickProximityVisuals() {
  const diffReal = Math.abs(lpState.angle - lpState.sweetSpot);
  let minDiff = diffReal;
  let isNearDecoy = false;

  lpState.decoySpots.forEach(ds => {
    const diffDecoy = Math.abs(lpState.angle - ds);
    if (diffDecoy < minDiff) {
      minDiff = diffDecoy;
      isNearDecoy = true;
    }
  });

  const proximityRatio = Math.max(0, 1 - (minDiff / 90));

  const proxBar = document.getElementById('proximityBar');
  const proxText = document.getElementById('proximityText');
  const proxGlow = document.getElementById('proximityGlow');

  if (proxBar) proxBar.style.width = `${Math.round(proximityRatio * 100)}%`;

  if (proxText && proxBar && proxGlow) {
    if (proximityRatio > 0.85) {
      if (isNearDecoy && STATE.perks.oidoClinico > 0) {
        if (lpState.isTension) {
          proxText.textContent = "¡FALSO PUNTO DULCE!";
          proxText.className = "text-rose-600 font-bold animate-bounce";
          proxGlow.style.borderColor = "#ef4444";
          proxBar.className = "h-full bg-rose-600 rounded-full transition-all duration-100";
        } else {
          proxText.textContent = "VERDE (PUNTO DULCE)";
          proxText.className = "text-emerald-400 font-bold animate-pulse";
          proxBar.className = "h-full bg-emerald-400 rounded-full transition-all duration-100";
          proxGlow.style.borderColor = "#34d399";
        }
      } else {
        proxText.textContent = "VERDE (PUNTO DULCE)";
        proxText.className = "text-emerald-400 font-bold animate-pulse";
        proxBar.className = "h-full bg-emerald-400 rounded-full transition-all duration-100";
        proxGlow.style.borderColor = "#34d399";
      }
    } else if (proximityRatio > 0.5) {
      proxText.textContent = "NARANJA (CERCA)";
      proxText.className = "text-amber-400 font-bold";
      proxBar.className = "h-full bg-amber-400 rounded-full transition-all duration-100";
      proxGlow.style.borderColor = "#fbbf24";
    } else {
      proxText.textContent = "ROJO (LEJOS)";
      proxText.className = "text-rose-500 font-bold";
      proxBar.className = "h-full bg-rose-500 rounded-full transition-all duration-100";
      proxGlow.style.borderColor = "#ef4444";
    }
  }

  const needle = document.getElementById('pickNeedle');
  if (needle) needle.style.transform = `rotate(${lpState.angle}deg)`;

  const maxAllowedRotation = proximityRatio * 90;
  const currentRotation = (lpState.screwdriver / 90) * maxAllowedRotation;
  const cylinder = document.getElementById('cylinderGraphic');
  if (cylinder) cylinder.style.transform = `rotate(${currentRotation}deg)`;

  if (lpState.isTension && isNearDecoy && proximityRatio > 0.85) {
    audio.playDecoyBuzz();
  } else if (lpState.isTension) {
    audio.playClick(proximityRatio);
  }
}

function tickLockpick() {
  const lpContainer = document.getElementById('lockpickContainer');
  const configLP = DATOS_JUEGO.MINIJUEGOS.LOCKPICK;
  
  if (!lpContainer || lpContainer.classList.contains('hidden') || lpState.isBreaking || lpState.isCompleted) return;

  if (lpState.isTension) {
    if (lpState.isTrapChest) {
      lpState.health -= configLP.DECAY_SALUD_DECOY * 1.5;
      if (lpState.health <= 0) {
        triggerPickBreakSequence(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.ROTURA, 'trampa');
        return;
      }
    } else {
      const diffReal = Math.abs(lpState.angle - lpState.sweetSpot);
      // [CAMBIO] El punto dulce real tiene prioridad sobre los señuelos
      const nearDecoy = !(diffReal <= lpState.tolerance) && lpState.decoySpots.some(ds => Math.abs(lpState.angle - ds) <= lpState.tolerance);

      if (nearDecoy) {
        lpState.health -= configLP.DECAY_SALUD_DECOY;
        lpState.screwdriver = Math.min(15, lpState.screwdriver + configLP.VELOCIDAD_CILINDRO_DECOY);
        if (lpState.health <= 0) {
          triggerPickBreakSequence("⚠️ Ganzúa rota: Falso punto dulce.", 'falsoDulce');
          return;
        }
      } else if (diffReal <= lpState.tolerance) {
        lpState.screwdriver = Math.min(90, lpState.screwdriver + configLP.VELOCIDAD_CILINDRO_ACIERTO);
        
        if (lpState.screwdriver >= 90) {
          lpState.isCompleted = true;
          lpState.isTension = false;

          const minigameModal = document.getElementById('minigameModal'); 
          if (minigameModal) minigameModal.classList.add('hidden');
          if (lpContainer) lpContainer.classList.add('hidden');

          triggerLootExplosion();
          return;
        }
      } else {
        lpState.screwdriver = Math.min(60, lpState.screwdriver + configLP.VELOCIDAD_CILINDRO_ERROR);
        lpState.health -= configLP.DECAY_SALUD_ERROR;
        if (lpState.health <= 0) {
          triggerPickBreakSequence("⚠️ Ganzúa rota: Ángulo equivocado.");
          return;
        }
      }
    }
  } else {
    lpState.screwdriver = Math.max(0, lpState.screwdriver - configLP.RETORNO_DESCENTRO);
  }

  updateLockpickProximityVisuals();
  requestAnimationFrame(tickLockpick);
}

function triggerPickBreakSequence(reasonText, delayKey = null) {
  lpState.isBreaking = true;
  lpState.isTension = false;
  audio.playBreak();

  const minigameModal = document.getElementById('minigameModal');
  if (minigameModal) minigameModal.classList.add('hidden');
  const lpContainer = document.getElementById('lockpickContainer');
  if (lpContainer) lpContainer.classList.add('hidden');

  showPersistentFeedback(reasonText, delayKey);
  handleFailure('picks', reasonText);
}

const angleSlider = document.getElementById('angleSlider');
if (angleSlider) {
  angleSlider.addEventListener('input', (e) => {
    if (lpState.isBreaking) return;
    lpState.angle = parseFloat(e.target.value);
    const readout = document.getElementById('angleReadout'); if (readout) readout.textContent = `${Math.round(lpState.angle)}°`;
    updateLockpickProximityVisuals();
  });
}

const forceLockBtn = document.getElementById('forceLockBtn');
const startTension = (e) => { e.preventDefault(); if (!lpState.isBreaking && !lpState.isCompleted) { lpState.isTension = true; tickLockpick(); } };
const stopTension = (e) => {
  e.preventDefault();
  // [0.082] Bucle 2/3 (Raro+): cualquier tensión mantenida y luego soltada cuenta como tanteo
  if (lpState.isTension && lpState.tanteoActive && !lpState.isBreaking && !lpState.isCompleted) {
    lpState.tanteoUsed = true;
  }
  lpState.isTension = false;
};

if (forceLockBtn) {
  forceLockBtn.addEventListener('mousedown', startTension);
  forceLockBtn.addEventListener('mouseup', stopTension);
  forceLockBtn.addEventListener('touchstart', startTension);
  forceLockBtn.addEventListener('touchend', stopTension);
}

/* ==========================================================================
   MINIJUEGO 2: PISTONES DE ACERO (TUMBLER) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let tumblerAnimationFrameId = null;
let tumblerPinsData = [];
let activePinIdx = 0;
let targetShearPosY = 50;
let tumblerAdvanced = false;       // [0.082] ¿este intento usa la fase de sellado (Bucle 2/3, Raro+)?
let tumblerPhase = 'pins';         // 'pins' | 'seal' | 'done'
let tumblerSeal = null;            // estado de la fase de sellado
let tumblerOriginalHelpHTML = null;
let tumblerOriginalBtnHTML = null;

// [0.082] Limpia la UI de la fase de sellado (línea azul, textos) al empezar un intento
function resetTumblerSealUI() {
  const oldLine = document.getElementById('sealLine');
  if (oldLine) oldLine.remove();
  const tc = document.getElementById('tumblerContainer');
  const help = tc ? tc.querySelector('p') : null;
  const btn = document.getElementById('tapPinBtn');
  if (help && tumblerOriginalHelpHTML === null) tumblerOriginalHelpHTML = help.innerHTML;
  if (btn && tumblerOriginalBtnHTML === null) tumblerOriginalBtnHTML = btn.innerHTML;
  if (help && tumblerOriginalHelpHTML !== null) help.innerHTML = tumblerOriginalHelpHTML;
  if (btn && tumblerOriginalBtnHTML !== null) btn.innerHTML = tumblerOriginalBtnHTML;
  tumblerSeal = null;
}

// [0.084] Alinea las líneas verde/azul con la posición REAL de los pistones.
// Los pistones se mueven en % de su carril (más corto que la caja por la luz superior),
// así que las líneas se colocan en píxeles a partir del carril medido.
let tumblerShearTol = 6;
function layoutTumblerLines() {
  const shear = document.getElementById('shearLine');
  const notch = document.getElementById('pinNotch-0');
  if (!shear || !notch || !notch.parentElement || !shear.parentElement) return;
  const box = shear.parentElement;
  const track = notch.parentElement;
  const tr = track.getBoundingClientRect();
  const br = box.getBoundingClientRect();
  if (!tr.height || !br.height) return;
  const notchH = notch.offsetHeight || 16;
  const place = (el, pct, tol, minH) => {
    if (!el) return;
    const h = Math.max(minH, 2 * tol * tr.height / 100);
    const centre = (tr.top - br.top - box.clientTop) + (pct / 100) * tr.height + notchH / 2;
    el.style.top = `${centre - h / 2}px`;
    el.style.height = `${h}px`;
  };
  place(shear, targetShearPosY, tumblerShearTol, 10);
  if (tumblerSeal) place(document.getElementById('sealLine'), tumblerSeal.blueY, tumblerSeal.tol, 10);
}
window.addEventListener('resize', () => { try { layoutTumblerLines(); } catch (e) {} });

// [0.084] Anulación 1 a 1 entre Maestría (perks.bonusX) y Torpeza (torpezas.x)
function reconcileMasteryTorpeza() {
  const names = { madera: 'Madera', acero: 'Acero', digital: 'Digital', vapor: 'Vapor' };
  const msgs = [];
  Object.keys(names).forEach(t => {
    const key = 'bonus' + names[t];
    const m = STATE.perks[key] || 0;
    const q = STATE.torpezas[t] || 0;
    if (m > 0 && q > 0) {
      const n = Math.min(m, q);
      STATE.perks[key] = m - n;
      STATE.torpezas[t] = q - n;
      msgs.push(`${names[t]}: ${n} nivel${n > 1 ? 'es' : ''} de Maestría y Torpeza se anulan entre sí.`);
    }
  });
  if (msgs.length && typeof showPersistentFeedback === 'function') {
    showPersistentFeedback(`⚖️ Maestría y Torpeza se compensan. ${msgs.join(' ')}`);
  }
}

function startTumblerGame() {
  if (tumblerAnimationFrameId) {
    cancelAnimationFrame(tumblerAnimationFrameId);
    tumblerAnimationFrameId = null;
  }

  const configT = DATOS_JUEGO.MINIJUEGOS.TUMBLER;
  tumblerStartedAt = Date.now();
  const tumblerContainer = document.getElementById('tumblerContainer'); if (tumblerContainer) tumblerContainer.classList.remove('hidden');
  {   // [0.090] Aviso de "tocar la pantalla" solo las primeras veces
    const th = document.getElementById('tumblerTapHint'), hc = (DATOS_JUEGO.AYUDAS || {}).PISTONES_TOQUE;
    STATE.hintUses = STATE.hintUses || {};
    const used = STATE.hintUses.pistonTap || 0;
    if (th) {
      if (hc && used < hc.VECES) { th.textContent = hc.TEXTO; th.classList.remove('hidden'); STATE.hintUses.pistonTap = used + 1; }
      else th.classList.add('hidden');
    }
  }
  const pinsContainer = document.getElementById('tumblerPins'); if (!pinsContainer) return;
  pinsContainer.innerHTML = '';

  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';

  // [0.082] Bucle 2/3 (Raro+): fase de sellado con línea azul; la verde siempre en el tercio inferior
  tumblerAdvanced = isAdvancedLoopFor(rarityId);
  tumblerPhase = 'pins';
  resetTumblerSealUI();
  if (tumblerAdvanced) {
    const [vMin, vMax] = DATOS_JUEGO.MINIJUEGOS.AVANZADO.TUMBLER.VERDE_RANGO;
    targetShearPosY = vMin + Math.random() * (vMax - vMin);
  } else {
    targetShearPosY = Math.floor(Math.random() * 40) + 30;
  }
  const shearLine = document.getElementById('shearLine'); if (shearLine) shearLine.style.top = `${targetShearPosY}%`;

  const pinCount = configT.PINS_POR_RAREZA[rarityId] || 3;
  let dynamicTime = configT.TIEMPOS_POR_PIN[pinCount] || 7;
  if (tumblerAdvanced) dynamicTime += DATOS_JUEGO.MINIJUEGOS.AVANZADO.TUMBLER.SEGUNDOS_EXTRA;

  startMinigameTimer(dynamicTime, 'proPicks');

  tumblerPinsData = [];
  let baseSpeed = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configT.VELOCIDAD_BASE_DIFICIL : configT.VELOCIDAD_BASE_NORMAL;
  if (rarityId === 'legendario') baseSpeed = configT.VELOCIDAD_LEGENDARIA;
  baseSpeed *= ((configT.MULT_VELOCIDAD_RAREZA || {})[rarityId] || 1); // [0.086]

  baseSpeed *= Math.max(0.4, (1 - STATE.perks.slowerPistons * 0.20));

  for (let i = 0; i < pinCount; i++) {
    tumblerPinsData.push({
      posY: Math.random() * 60 + 10,
      speed: (Math.random() * 0.25 + baseSpeed) * (Math.random() > 0.5 ? 1 : -1),
      locked: false
    });
  }
  activePinIdx = 0;

  let allowedTolerance = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configT.TOLERANCIA_DIFICIL : configT.TOLERANCIA_NORMAL;
  allowedTolerance += (STATE.perks.sweetSpot * (configT.BONO_MANO_FIRME || 1.5));
  tumblerShearTol = allowedTolerance;
  if (shearLine) shearLine.style.height = `${Math.max(10, allowedTolerance * 1.8)}px`;

  tumblerPinsData.forEach((pin, i) => {
    const pinCol = document.createElement('div');
    pinCol.className = 'flex-1 h-full bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden flex flex-col items-center justify-start';
    pinCol.id = `pinCol-${i}`;
    pinCol.innerHTML = `
      <div id="pinLight-${i}" class="w-2.5 h-2.5 rounded-full my-1 bg-slate-800 border border-slate-700"></div>
      <div class="w-3 flex-1 bg-slate-900 rounded relative overflow-hidden">
        <div id="pinNotch-${i}" class="w-full h-4 bg-amber-400 rounded border border-yellow-200 shadow-md absolute inset-x-0" style="top: 10%;"></div>
      </div>
    `;
    pinsContainer.appendChild(pinCol);
  });

  updateSequentialPinLights();
  layoutTumblerLines();
  requestAnimationFrame(layoutTumblerLines);
  setTimeout(layoutTumblerLines, 120);
  tumblerPinsLastTs = null;
  animateSequentialTumblerPins();
}

function updateSequentialPinLights() {
  tumblerPinsData.forEach((pin, i) => {
    const light = document.getElementById(`pinLight-${i}`);
    const col = document.getElementById(`pinCol-${i}`);
    if (!light || !col) return;

    if (pin.locked) {
      light.className = "w-2.5 h-2.5 rounded-full my-1 bg-emerald-400 border border-emerald-200 shadow-sm";
      col.className = "flex-1 h-full bg-slate-900/80 border border-emerald-500/40 rounded-lg relative overflow-hidden flex flex-col items-center justify-start opacity-90";
    } else if (i === activePinIdx) {
      light.className = "w-2.5 h-2.5 rounded-full my-1 bg-amber-400 border border-amber-200 animate-ping";
      col.className = "flex-1 h-full bg-slate-900 border-2 border-amber-500/60 rounded-lg relative overflow-hidden flex flex-col items-center justify-start shadow-lg";
    } else {
      light.className = "w-2.5 h-2.5 rounded-full my-1 bg-slate-800 border border-slate-700";
      col.className = "flex-1 h-full bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden flex flex-col items-center justify-start opacity-50";
    }
  });
}

let humHoldChest = null;   // [0.091] cofre legendario para el que el zumbido se calló al empezar el puzle; no vuelve en el botín
let tumblerPinsLastTs = null;
function animateSequentialTumblerPins(ts) {
  const tumblerContainer = document.getElementById('tumblerContainer');
  if (!tumblerContainer || tumblerContainer.classList.contains('hidden')) return;
  if (tumblerPhase !== 'pins') return;

  if (typeof ts !== 'number') ts = performance.now();
  const dtPins = tumblerPinsLastTs === null ? 0 : Math.min(0.05, (ts - tumblerPinsLastTs) / 1000);   // [0.091] tiempo real
  tumblerPinsLastTs = ts;
  const fpsRef = DATOS_JUEGO.MINIJUEGOS.TUMBLER.VELOCIDAD_FPS_REFERENCIA || 90;
  tumblerPinsData.forEach((pin, i) => {
    if (!pin.locked) {
      pin.posY += pin.speed * dtPins * fpsRef;
      if (pin.posY >= 82 || pin.posY <= 8) pin.speed *= -1;
      const notch = document.getElementById(`pinNotch-${i}`);
      if (notch) notch.style.top = `${pin.posY}%`;
    }
  });

  tumblerAnimationFrameId = requestAnimationFrame(animateSequentialTumblerPins);
}

// [0.082] Cierre común de éxito / fallo de los pistones
function finishTumblerSuccess() {
  minigameInProgress = false;
  stopMinigameTimer();
  setTimeout(() => {
    const minigameModal = document.getElementById('minigameModal'); if (minigameModal) minigameModal.classList.add('hidden');
    const tumblerContainer = document.getElementById('tumblerContainer'); if (tumblerContainer) tumblerContainer.classList.add('hidden');
    const active = STATE.screenChests[STATE.activeChestIdx];
    const reqCount = getRequiredToolCount(active.rarity);
    puzzleToolPaid = null;   // [0.090] ya pagada al entrar
    triggerLootExplosion();
  }, 300);
}

function failTumbler(message) {
  tumblerPhase = 'done';
  if (tumblerAnimationFrameId) { cancelAnimationFrame(tumblerAnimationFrameId); tumblerAnimationFrameId = null; }
  audio.playBreak();
  const minigameModal = document.getElementById('minigameModal'); if (minigameModal) minigameModal.classList.add('hidden');
  const tumblerContainer = document.getElementById('tumblerContainer'); if (tumblerContainer) tumblerContainer.classList.add('hidden');
  showPersistentFeedback(message);
  handleFailure('proPicks');
}

// [0.082] FASE DE SELLADO: todos los pistones encajan en la línea verde (clic) y suben juntos hasta la línea azul
function startTumblerSealPhase() {
  const cfg = DATOS_JUEGO.MINIJUEGOS.AVANZADO.TUMBLER;
  if (tumblerAnimationFrameId) { cancelAnimationFrame(tumblerAnimationFrameId); tumblerAnimationFrameId = null; }
  tumblerPhase = 'seal';
  audio.playClick(1);
  if (navigator.vibrate) navigator.vibrate(30);

  // Todos los pistones encajan sobre la verde
  tumblerPinsData.forEach((pin, i) => {
    pin.posY = targetShearPosY;
    const notch = document.getElementById(`pinNotch-${i}`);
    if (notch) {
      notch.style.top = `${targetShearPosY}%`;
      notch.className = "w-full h-4 bg-sky-400 rounded border border-sky-200 shadow-md absolute inset-x-0";
    }
  });

  let tol = cfg.TOLERANCIA_AZUL + (STATE.perks.sweetSpot * 1);
  const [bMin, bMax] = cfg.AZUL_RANGO;
  const blueY = bMin + Math.random() * (bMax - bMin);

  const shearLine = document.getElementById('shearLine');
  if (shearLine && shearLine.parentElement) {
    const line = document.createElement('div');
    line.id = 'sealLine';
    line.className = 'absolute left-0 right-0 bg-sky-500/50 border-y border-sky-300 z-10 pointer-events-none flex items-center justify-start pl-2';
    line.style.top = `${blueY}%`;
    line.style.height = `${Math.max(10, tol * 1.8)}px`;
    line.innerHTML = '<span class="text-[9px] font-mono text-sky-200 font-bold tracking-widest uppercase bg-slate-950/80 px-1 rounded">SELLO</span>';
    shearLine.parentElement.appendChild(line);
  }

  const tc = document.getElementById('tumblerContainer');
  const help = tc ? tc.querySelector('p') : null;
  if (help) help.innerHTML = cfg.TEXTO_AYUDA_FINAL;
  const btn = document.getElementById('tapPinBtn');
  if (btn) btn.innerHTML = `<i class="fa-solid fa-hand"></i> ${cfg.TEXTO_BOTON_FINAL}`;

  const speedFactor = Math.max(0.4, (1 - STATE.perks.slowerPistons * 0.20));
  tumblerSeal = { y: targetShearPosY, blueY, tol, speed: cfg.VELOCIDAD_SUBIDA_FINAL * speedFactor, lastTs: null };
  layoutTumblerLines();
  tumblerAnimationFrameId = requestAnimationFrame(animateTumblerSeal);
}

function animateTumblerSeal(ts) {
  const tc = document.getElementById('tumblerContainer');
  if (!tc || tc.classList.contains('hidden') || tumblerPhase !== 'seal' || !tumblerSeal) return;

  const dt = tumblerSeal.lastTs === null ? 0 : Math.min(0.05, (ts - tumblerSeal.lastTs) / 1000);
  tumblerSeal.lastTs = ts;
  tumblerSeal.y -= tumblerSeal.speed * dt;

  tumblerPinsData.forEach((pin, i) => {
    pin.posY = tumblerSeal.y;
    const notch = document.getElementById(`pinNotch-${i}`);
    if (notch) notch.style.top = `${tumblerSeal.y}%`;
  });

  // Si los pistones superan la zona azul sin que el jugador pulse, se ha fallado el sellado
  if (tumblerSeal.y < tumblerSeal.blueY - tumblerSeal.tol - (DATOS_JUEGO.MINIJUEGOS.TUMBLER.MARGEN_INVISIBLE_PCT || 0)) {
    failTumbler("⚠️ Sellado fallido: los pistones pasaron de largo la línea azul.");
    return;
  }
  tumblerAnimationFrameId = requestAnimationFrame(animateTumblerSeal);
}

function handleTumblerSealClick() {
  if (tumblerPhase !== 'seal' || !tumblerSeal) return;
  tumblerPhase = 'done';
  if (tumblerAnimationFrameId) { cancelAnimationFrame(tumblerAnimationFrameId); tumblerAnimationFrameId = null; }
  const diff = Math.abs(tumblerSeal.y - tumblerSeal.blueY);
  if (diff <= tumblerSeal.tol + (DATOS_JUEGO.MINIJUEGOS.TUMBLER.MARGEN_INVISIBLE_PCT || 0)) {
    audio.playClick(0.9);
    tumblerPinsData.forEach((pin, i) => {
      const notch = document.getElementById(`pinNotch-${i}`);
      if (notch) notch.className = "w-full h-4 bg-emerald-400 rounded border border-emerald-200 shadow-md absolute inset-x-0";
    });
    finishTumblerSuccess();
  } else {
    failTumbler("⚠️ Sellado fallido: no frenaste los pistones en la línea azul.");
  }
}

function triggerFixActivePin() {
  if (tumblerPhase === 'seal') { handleTumblerSealClick(); return; }
  if (tumblerPhase !== 'pins') return;
  if (activePinIdx >= tumblerPinsData.length) return;

  const configT = DATOS_JUEGO.MINIJUEGOS.TUMBLER;
  const currentPin = tumblerPinsData[activePinIdx];
  const diff = Math.abs(currentPin.posY - targetShearPosY);
  let allowedTolerance = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configT.TOLERANCIA_DIFICIL : configT.TOLERANCIA_NORMAL;
  allowedTolerance += (STATE.perks.sweetSpot * (configT.BONO_MANO_FIRME || 1.5));
  const margenInv = configT.MARGEN_INVISIBLE_PCT || 0;   // [0.088] margen no visible, el mismo por arriba y por abajo

  if (diff <= allowedTolerance + margenInv) {
    audio.playClick(0.9);
    currentPin.locked = true;
    currentPin.posY = targetShearPosY;
    
    const notch = document.getElementById(`pinNotch-${activePinIdx}`);
    if (notch) {
      notch.style.top = `${targetShearPosY}%`;
      notch.className = "w-full h-4 bg-emerald-400 rounded border border-emerald-200 shadow-md absolute inset-x-0";
    }

    activePinIdx++;
    updateSequentialPinLights();

    if (activePinIdx >= tumblerPinsData.length) {
      if (tumblerAdvanced) {
        startTumblerSealPhase();
      } else {
        tumblerPhase = 'done';
        finishTumblerSuccess();
      }
    }
  } else {
    failTumbler("⚠️ Pistón desalineado. Pin destruido.");
  }
}

const tapPinBtn = document.getElementById('tapPinBtn');
if (tapPinBtn) tapPinBtn.addEventListener('click', triggerFixActivePin);

// [0.089] Cualquier pulsación dentro del puzle de pistones también los para (el botón sigue siendo la forma "oficial").
// Se ignoran los botones (la X, el propio botón: ese ya dispara con su clic) y los primeros 350 ms para no contar el toque que abrió el puzle.
let tumblerStartedAt = 0;
(function () {
  const mm = document.getElementById('minigameModal');
  if (!mm) return;
  mm.addEventListener('pointerdown', (e) => {
    const tc = document.getElementById('tumblerContainer');
    if (!tc || tc.classList.contains('hidden') || !minigameInProgress) return;
    if (tumblerPhase !== 'pins' && tumblerPhase !== 'seal') return;
    if (e.target.closest && e.target.closest('button, a, [role="button"]')) return;
    if (Date.now() - tumblerStartedAt < 350) return;
    triggerFixActivePin();
  });
})();

/* ==========================================================================
   MINIJUEGO 3: TERMINAL DIGITAL (HACK) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let targetWord = "";
let hackAttemptsLeft = 4;

function startHackGame() {
  const configH = DATOS_JUEGO.MINIJUEGOS.HACK;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';
  const cfgRar = configH.CONFIG_POR_RAREZA[rarityId] || configH.CONFIG_POR_RAREZA.normal;

  if (cfgRar.hasTimer) {
    startMinigameTimer(configH.TIEMPO_LEGENDARIO_SEGUNDOS, 'usb');
  } else {
    startMinigameTimer(null, 'usb');
  }

  const hackContainer = document.getElementById('hackContainer'); if (hackContainer) hackContainer.classList.remove('hidden');
  
  hackAttemptsLeft = (STATE.traperoBuffs.harderMinigames || STATE.harderPuzzlesLeft > 0) ? configH.INTENTOS_DIFICIL : configH.INTENTOS_NORMAL;
  const attemptsEl = document.getElementById('hackAttempts'); if (attemptsEl) attemptsEl.textContent = hackAttemptsLeft;

  const history = document.getElementById('hackHistory'); if (history) history.innerHTML = '<div>> MATRIZ DE LONGITUD UNIFORME...</div>';

  const grid = document.getElementById('hackWordGrid'); if (!grid) return;
  grid.innerHTML = '';

  const displayCount = cfgRar.displayCount;
  const advanced = isAdvancedLoopFor(rarityId);
  const loopNow = Math.min(STATE.currentLoop || 1, 3);

  // [0.082] Longitud: Raro 6-7, Épico 7-8, Legendario 8 (Normal conserva la suya). Misma longitud en todo el puzle.
  const advCfg = DATOS_JUEGO.MINIJUEGOS.AVANZADO.HACK;
  const lengthOptions = advanced
    ? (advCfg.LONGITUD_POR_RAREZA[rarityId] || [cfgRar.wordLength])
    : (configH.LONGITUD_BASE_POR_RAREZA[rarityId] || [cfgRar.wordLength]);
  // [0.082] Bucle 2/3 (Raro+): 70% palabras / 30% números; nunca mezclados
  const numericMode = advanced && Math.random() < advCfg.PROB_NUMEROS;
  // [0.084] En modo números la longitud es de 4, 5 o 6 dígitos según rareza
  const chosenLength = numericMode
    ? (advCfg.LONGITUD_NUMEROS_POR_RAREZA[rarityId] || 4)
    : lengthOptions[Math.floor(Math.random() * lengthOptions.length)];

  const labelEl = document.getElementById('hackWordLength') ? document.getElementById('hackWordLength').parentElement : null;
  if (labelEl) {
    labelEl.innerHTML = numericMode
      ? `CÓDIGOS DE <span id="hackWordLength" class="text-amber-400">${chosenLength}</span> DÍGITOS:`
      : `PALABRAS DE LONGITUD <span id="hackWordLength" class="text-amber-400">${chosenLength}</span>:`;
  }

  let options;
  let numberGroups = null;
  if (numericMode) {
    const built = buildHackNumberOptions(chosenLength, (advCfg.OPCIONES_NUMEROS && advCfg.OPCIONES_NUMEROS[rarityId]) || displayCount, advCfg.GRUPO_DIGITOS);
    options = built.values;
    numberGroups = built.groups;
    targetWord = options[Math.floor(Math.random() * options.length)];
  } else {
    let pool;
    if (advanced) {
      const bank = advCfg.BANCOS_PALABRAS[loopNow] || advCfg.BANCOS_PALABRAS[2];
      pool = bank[chosenLength];
    }
    if (!pool || pool.length < displayCount) pool = configH.BOLSA_PALABRAS[chosenLength] || configH.BOLSA_PALABRAS[6];
    options = [...pool].sort(() => 0.5 - Math.random()).slice(0, displayCount);
    targetWord = options[Math.floor(Math.random() * options.length)];
  }

  options.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'px-2 py-1.5 bg-emerald-950/60 border border-emerald-600/40 active:bg-emerald-800/50 rounded text-emerald-300 font-mono text-[11px] text-left';
    // Los números se muestran agrupados en bloques de 2-3 dígitos (el valor interno va sin separadores)
    btn.textContent = numericMode ? `> ${formatHackNumber(word, numberGroups)}` : `> ${word}`;
    btn.addEventListener('click', () => submitHackWord(word, btn));
    grid.appendChild(btn);
  });
}

// [0.082] Agrupa una cadena de dígitos en bloques (p. ej. "482915" -> "482 915")
function formatHackNumber(str, groups) {
  let out = [], pos = 0;
  (groups || [str.length]).forEach(g => { out.push(str.slice(pos, pos + g)); pos += g; });
  return out.join(' ');
}

// [0.082] Genera opciones numéricas "parecidas" (comparten parte de los dígitos con el objetivo)
// y comparten la misma agrupación de bloques de 2-3 dígitos. Devuelve { values: [cadenas de dígitos], groups: [tamaños] }.
function buildHackNumberOptions(length, count, groupSizes) {
  const sizes = (groupSizes && groupSizes.length) ? groupSizes : [2, 3];
  // composición aleatoria de bloques que sume exactamente `length`
  let groups = [];
  for (let tries = 0; tries < 50; tries++) {
    groups = []; let left = length;
    while (left > 0) {
      const valid = sizes.filter(g => g <= left && (left - g === 0 || left - g >= Math.min(...sizes)));
      if (!valid.length) { groups = null; break; }
      const g = valid[Math.floor(Math.random() * valid.length)];
      groups.push(g); left -= g;
    }
    if (groups) break;
  }
  if (!groups) groups = [length];

  // [0.085] Generación por columnas: cada posición solo usa 2 dígitos posibles, así los dígitos se repiten entre
  // opciones y el aviso "DENEGADO (k/n)" siempre permite descartar. Se repite el sorteo hasta que el conjunto cumple:
  //  - tanteando CUALQUIER opción, el aviso deja como mucho 2 candidatos con el mismo resultado
  //  - ninguna columna es igual en todas las opciones, ni distinta en todas (no aportaría información)
  const matchCount = (a, b) => { let k = 0; for (let i = 0; i < a.length; i++) if (a[i] === b[i]) k++; return k; };
  const worstClass = (set) => {
    let worst = 0;
    set.forEach(g => {
      const c = {};
      set.forEach(t => { if (t !== g) { const k = matchCount(g, t); c[k] = (c[k] || 0) + 1; worst = Math.max(worst, c[k]); } });
    });
    return worst;
  };
  const columnsOk = (set) => {
    for (let c = 0; c < length; c++) {
      const n = new Set(set.map(x => x[c])).size;
      if (n === 1 || n === set.length) return false;
    }
    return true;
  };
  const digits = '0123456789'.split('');
  let best = null, bestScore = Infinity;
  for (let attempt = 0; attempt < 3000; attempt++) {
    const cols = [];
    for (let c = 0; c < length; c++) cols.push([...digits].sort(() => Math.random() - 0.5).slice(0, 2));
    const set = new Set();
    let guard = 0;
    while (set.size < count && guard++ < 200) {
      let v = '';
      for (let c = 0; c < length; c++) v += cols[c][Math.floor(Math.random() * 2)];
      set.add(v);
    }
    if (set.size < count) continue;
    const arr = [...set];
    const score = worstClass(arr) + (columnsOk(arr) ? 0 : 10);
    if (score < bestScore) { bestScore = score; best = arr; }
    if (score <= 2) break;
  }
  if (!best) { // último recurso (casi imposible): opciones aleatorias distintas
    const set = new Set();
    while (set.size < count) { let v = ''; for (let i = 0; i < length; i++) v += digits[Math.floor(Math.random() * 10)]; set.add(v); }
    best = [...set];
  }
  return { values: best.sort(() => 0.5 - Math.random()), groups };
}

function submitHackWord(word, btn) { 
  audio.playClick(0.5); 
  btn.disabled = true; 
  btn.classList.add('opacity-40');

  const history = document.getElementById('hackHistory');

  // Normalizamos ambas palabras para ignorar diacríticos (tildes/acentos) en la comparación
  const cleanWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cleanTarget = targetWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (cleanWord === cleanTarget) { 
    if (history) history.innerHTML += `<div class="text-emerald-400 font-bold">> ¡ACCESO CONCEDIDO!</div>`; 
    minigameInProgress = false; stopMinigameTimer();
    setTimeout(() => { 
      const minigameModal = document.getElementById('minigameModal'); 
      if (minigameModal) minigameModal.classList.add('hidden'); 
      
      const hackContainer = document.getElementById('hackContainer'); 
      if (hackContainer) hackContainer.classList.add('hidden'); 

      const active = STATE.screenChests[STATE.activeChestIdx]; 
      const reqCount = getRequiredToolCount(active.rarity); 
      puzzleToolPaid = null;   // [0.090] ya pagada al entrar
      triggerLootExplosion(); 
    }, 400); 
  } else { 
    let matches = 0; 
    for (let i = 0; i < Math.min(cleanWord.length, cleanTarget.length); i++) { 
      if (cleanWord[i] === cleanTarget[i]) matches++; 
    }

    hackAttemptsLeft--; 
    const attemptsEl = document.getElementById('hackAttempts'); 
    if (attemptsEl) attemptsEl.textContent = hackAttemptsLeft; 
    if (history) history.innerHTML += `<div>> DENEGADO (${matches}/${cleanTarget.length})</div>`;

    if (hackAttemptsLeft <= 0) { 
      audio.playBreak(); 
      const minigameModal = document.getElementById('minigameModal'); 
      if (minigameModal) minigameModal.classList.add('hidden'); 
      
      const hackContainer = document.getElementById('hackContainer'); 
      if (hackContainer) hackContainer.classList.add('hidden'); 

      showPersistentFeedback("⚠️ Límite de intentos alcanzado. Terminal bloqueada."); 
      handleFailure('usb'); 
    } 
  } 
}

/* ==========================================================================
   MINIJUEGO 4: RED HIDRÁULICA DE VAPOR (PIPE) - ESCALADO POR RAREZA DE COFRE
   ========================================================================== */

let pipeGridData = [];
let pipeGridSize = 3;
let pipeAdvancedActive = false;  // [0.082] ¿este intento usa bombas + VALIDAR?
let pipeValidated = false;       // [0.082] el botón VALIDAR es de un solo uso

// [0.082] Prepara (o limpia) el texto de ayuda y el botón VALIDAR del puzle hidráulico
function setupPipeAdvancedUI(advanced) {
  const pipeContainer = document.getElementById('pipeContainer');
  if (!pipeContainer) return;
  const oldBtn = document.getElementById('pipeValidateBtn');
  if (oldBtn) oldBtn.remove();
  const oldHelp = document.getElementById('pipeAdvancedHelp');
  if (oldHelp) oldHelp.remove();
  if (!advanced) return;

  const grid = document.getElementById('pipeGrid');
  const help = document.createElement('div');
  help.id = 'pipeAdvancedHelp';
  help.className = 'text-[10px] text-center text-rose-300 font-mono leading-snug';
  help.innerHTML = '<i class="fa-solid fa-bomb"></i> Evita las bombas. El fluido no se ve hasta que pulses <span class="text-sky-300 font-bold">VALIDAR</span> (un solo intento).';
  pipeContainer.insertBefore(help, grid);

  const btn = document.createElement('button');
  btn.id = 'pipeValidateBtn';
  btn.className = 'w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 active:from-sky-500 text-white font-extrabold text-sm rounded-xl shadow-lg border border-sky-400/40 flex items-center justify-center gap-2';
  btn.innerHTML = '<i class="fa-solid fa-play"></i> VALIDAR';
  btn.addEventListener('click', validatePipeAdvanced);
  pipeContainer.appendChild(btn);
}

// [0.082] Índice vecino de una celda por un lado (0 arriba, 1 derecha, 2 abajo, 3 izquierda); -1 si fuera del tablero
function pipeNeighborIndex(idx, side, size) {
  const row = Math.floor(idx / size);
  const col = idx % size;
  if (side === 0 && row > 0) return idx - size;
  if (side === 1 && col < size - 1) return idx + 1;
  if (side === 2 && row < size - 1) return idx + size;
  if (side === 3 && col > 0) return idx - 1;
  return -1;
}

// [0.082] Simula el flujo desde la celda 0. rotKey: 'rot' (estado actual) o 'requiredRot' (solución).
// Reglas: obstáculos / fuera de tablero / tubo no conectado detienen el fluido; una bomba acepta fluido por sus 4 lados.
function simulatePipeFlow(data, size, rotKey) {
  const total = size * size;
  const visited = new Set();
  const bombs = new Set();
  const queue = [];
  if (data[0] && data[0].type !== 'stone' && data[0].type !== 'bomb') { visited.add(0); queue.push(0); }
  while (queue.length) {
    const curr = queue.shift();
    const item = data[curr];
    getPipeSides(item.type, item[rotKey]).forEach(side => {
      const n = pipeNeighborIndex(curr, side, size);
      if (n === -1) return;
      const nItem = data[n];
      if (nItem.type === 'stone') return;
      if (nItem.type === 'bomb') { bombs.add(n); return; }
      if (visited.has(n)) return;
      if (getPipeSides(nItem.type, nItem[rotKey]).includes((side + 2) % 4)) { visited.add(n); queue.push(n); }
    });
  }
  return { visited, bombs, goal: visited.has(total - 1) };
}

// [0.082] Generador: SIEMPRE devuelve un tablero con solución que llega a la salida sin tocar bombas
function generatePipeBoardAdvanced(size, nObstacles, nBombs) {
  const total = size * size;
  const lastIdx = total - 1;

  const buildPathData = (blocked, bombSet, tProb) => {
    const path = [];
    const seen = new Set();
    const dfs = (curr) => {
      path.push(curr); seen.add(curr);
      if (curr === lastIdx) return true;
      const nbs = [];
      [0, 1, 2, 3].forEach(sd => { const n = pipeNeighborIndex(curr, sd, size); if (n !== -1) nbs.push(n); });
      nbs.sort(() => Math.random() - 0.5);
      for (const n of nbs) {
        if (!seen.has(n) && !blocked.has(n)) { if (dfs(n)) return true; }
      }
      path.pop();
      return false;
    };
    if (!dfs(0)) return null;

    const data = new Array(total);
    for (let i = 0; i < total; i++) {
      if (blocked.has(i)) { data[i] = { type: bombSet.has(i) ? 'bomb' : 'stone', rot: 0, requiredRot: 0 }; }
    }
    path.forEach((curr, i) => {
      let enterSide = 0, exitSide = 2;
      if (i > 0) { const prev = path[i - 1]; if (curr === prev - size) enterSide = 2; else if (curr === prev + 1) enterSide = 3; else if (curr === prev + size) enterSide = 0; else enterSide = 1; }
      if (i < path.length - 1) { const nx = path[i + 1]; if (nx === curr - size) exitSide = 0; else if (nx === curr + 1) exitSide = 1; else if (nx === curr + size) exitSide = 2; else exitSide = 3; }
      let type = 'straight';
      if ((enterSide % 2) !== (exitSide % 2)) type = 'corner';
      else if (Math.random() < tProb) type = 't_junction';
      const good = [];
      for (let rot = 0; rot < 4; rot++) { const sd = getPipeSides(type, rot); if (sd.includes(enterSide) && sd.includes(exitSide)) good.push(rot); }
      const r = good[Math.floor(Math.random() * good.length)];
      data[curr] = { type, rot: r, requiredRot: r };
    });
    const types = ['straight', 'corner', 't_junction'];
    for (let i = 0; i < total; i++) {
      if (!data[i]) { const r = Math.floor(Math.random() * 4); data[i] = { type: types[Math.floor(Math.random() * 3)], rot: r, requiredRot: r }; }
    }
    return data;
  };

  const scramble = (data) => {
    for (let t = 0; t < 30; t++) {
      data.forEach(c => { if (c.type !== 'stone' && c.type !== 'bomb') c.rot = Math.floor(Math.random() * 4); });
      const sim = simulatePipeFlow(data, size, 'rot');
      if (!(sim.goal && sim.bombs.size === 0)) return; // no empieza ya resuelto
    }
  };

  for (let attempt = 0; attempt < 400; attempt++) {
    const slots = [];
    for (let i = 1; i < lastIdx; i++) slots.push(i);
    slots.sort(() => Math.random() - 0.5);
    const bombSet = new Set(slots.slice(0, nBombs));
    const blocked = new Set(slots.slice(0, nBombs + nObstacles));
    const data = buildPathData(blocked, bombSet, attempt < 200 ? 0.25 : 0);
    if (!data) continue;
    const sol = simulatePipeFlow(data, size, 'requiredRot');
    if (sol.goal && sol.bombs.size === 0) { scramble(data); return data; }
  }

  // Último recurso (determinista): camino por el borde, bloqueos en el interior, sin T en el camino
  const blocked = new Set(), bombSet = new Set();
  const interior = [];
  for (let r = 1; r < size - 1; r++) for (let c = 1; c < size - 1; c++) interior.push(r * size + c);
  interior.slice(0, nBombs + nObstacles).forEach((idx, k) => { blocked.add(idx); if (k < nBombs) bombSet.add(idx); });
  for (let tries = 0; tries < 200; tries++) {
    const data = buildPathData(blocked, bombSet, 0);
    if (data) {
      const sol = simulatePipeFlow(data, size, 'requiredRot');
      if (sol.goal && sol.bombs.size === 0) { scramble(data); return data; }
    }
  }
  return null;
}

// [0.082] Botón VALIDAR (un solo uso): llega a la salida sin bombas = éxito; bomba alcanzada = EXPLOSIÓN; sin salida = fallo
function validatePipeAdvanced() {
  if (pipeValidated || !minigameInProgress) return;
  pipeValidated = true;
  stopMinigameTimer();

  const btn = document.getElementById('pipeValidateBtn');
  if (btn) { btn.disabled = true; btn.classList.add('opacity-50'); btn.innerHTML = '<i class="fa-solid fa-droplet"></i> ...'; }

  const size = pipeGridSize;
  const total = size * size;
  const sim = simulatePipeFlow(pipeGridData, size, 'rot');
  const exploded = sim.bombs.size > 0;
  const success = sim.goal && !exploded;

  // Mostramos el recorrido del fluido
  for (let i = 0; i < total; i++) {
    const svgEl = document.getElementById(`pipeSvg-${i}`);
    const item = pipeGridData[i];
    if (svgEl && item.type !== 'stone' && item.type !== 'bomb') {
      const on = sim.visited.has(i);
      svgEl.style.color = on ? (exploded ? '#fb7185' : (success ? '#34d399' : '#fbbf24')) : '#64748b';
      svgEl.className = `w-full h-full ${on ? 'text-amber-400' : 'text-slate-500'} transition-colors`;
    }
  }
  sim.bombs.forEach(b => {
    const t = document.getElementById(`pipeTile-${b}`);
    if (t) { t.classList.add('animate-pulse'); t.style.background = '#be123c'; t.innerHTML += '<span class="absolute inset-0 flex items-center justify-center text-xl">💥</span>'; }
  });

  if (exploded) {
    audio.playBreak();
    const appBody = document.getElementById('appBody');
    if (appBody) { appBody.classList.add('shake-screen'); setTimeout(() => appBody.classList.remove('shake-screen'), 400); }
    if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
  } else if (success) {
    audio.playClick(0.9);
  } else {
    audio.playBreak();
  }

  setTimeout(() => {
    if (!minigameInProgress) return; // el jugador abandonó mientras se mostraba el resultado
    const minigameModal = document.getElementById('minigameModal'); if (minigameModal) minigameModal.classList.add('hidden');
    const pipeContainer = document.getElementById('pipeContainer'); if (pipeContainer) pipeContainer.classList.add('hidden');
    if (success) {
      minigameInProgress = false;
      const active = STATE.screenChests[STATE.activeChestIdx];
      const reqCount = getRequiredToolCount(active.rarity);
      puzzleToolPaid = null;   // [0.090] ya pagada al entrar
      triggerLootExplosion();
    } else if (exploded) {
      showPersistentFeedback("💥 ¡EXPLOSIÓN! El fluido ha llegado a una bomba. La válvula queda destruida.");
      handleFailure('valves');
    } else {
      showPersistentFeedback("💧 El fluido no ha llegado a la salida. La válvula se pierde.");
      handleFailure('valves');
    }
  }, 1100);
}

function getPipeSides(type, rot) {
  if (type === 'straight') return (rot % 2 === 0) ? [0, 2] : [1, 3];
  if (type === 'corner') return [rot, (rot + 1) % 4];
  if (type === 't_junction') return [rot, (rot + 1) % 4, (rot + 2) % 4];
  return [];
}

function startPipeGame() {
  const configP = DATOS_JUEGO.MINIJUEGOS.PIPE;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const rarityId = active ? active.rarity.id : 'normal';
  // [0.082] Bucle 2/3 (Raro+): bombas, botón VALIDAR de un solo uso y 20 s
  const pipeAdvanced = isAdvancedLoopFor(rarityId);
  const advPipe = DATOS_JUEGO.MINIJUEGOS.AVANZADO.PIPE;
  const cfgRar = pipeAdvanced
    ? advPipe.CONFIG_POR_RAREZA[rarityId]
    : (configP.CONFIG_POR_RAREZA[rarityId] || configP.CONFIG_POR_RAREZA.normal);

  let dynamicTime = rarityId === 'legendario' ? configP.TIEMPO_LEGENDARIO_SEGUNDOS : configP.TIEMPO_BASE_SEGUNDOS;
  if (pipeAdvanced) dynamicTime = advPipe.TIEMPO_SEGUNDOS;
  startMinigameTimer(dynamicTime, 'valves');

  pipeAdvancedActive = pipeAdvanced;
  pipeValidated = false;
  const pipeContainer = document.getElementById('pipeContainer'); if (pipeContainer) pipeContainer.classList.remove('hidden');
  setupPipeAdvancedUI(pipeAdvanced);

  const grid = document.getElementById('pipeGrid'); if (!grid) return;
  grid.innerHTML = '';

  pipeGridSize = cfgRar.size;
  const totalTiles = pipeGridSize * pipeGridSize;
  grid.style.gridTemplateColumns = `repeat(${pipeGridSize}, minmax(0, 1fr))`;

  let generatedAndValid = false;
  let generateAttempts = 0;

  if (pipeAdvanced) {
    // [0.082] Tablero con bombas / obstáculos y solución garantizada
    pipeGridData = generatePipeBoardAdvanced(pipeGridSize, cfgRar.obstacles, cfgRar.bombs);
    generatedAndValid = true;
  }

  while (!generatedAndValid && generateAttempts < 100) {
    generateAttempts++;
    pipeGridData = [];

    let obstacleIndices = new Set();
    while (obstacleIndices.size < cfgRar.obstacles && obstacleIndices.size < totalTiles - 2) {
      const idx = Math.floor(Math.random() * (totalTiles - 2)) + 1;
      obstacleIndices.add(idx);
    }

    for (let i = 0; i < totalTiles; i++) {
      if (obstacleIndices.has(i)) {
        pipeGridData.push({ type: 'stone', rot: 0, requiredRot: 0 });
      } else {
        pipeGridData.push({ type: 'straight', rot: 0, requiredRot: 0 });
      }
    }

    const path = [];
    const visitedPath = new Set();

    function findPath(curr) {
      path.push(curr);
      visitedPath.add(curr);

      if (curr === totalTiles - 1) return true;

      const neighbors = [];
      const r = Math.floor(curr / pipeGridSize);
      const c = curr % pipeGridSize;

      if (r > 0) neighbors.push({ idx: curr - pipeGridSize, enterSide: 2, exitSide: 0 });
      if (c < pipeGridSize - 1) neighbors.push({ idx: curr + 1, enterSide: 3, exitSide: 1 });
      if (r < pipeGridSize - 1) neighbors.push({ idx: curr + pipeGridSize, enterSide: 0, exitSide: 2 });
      if (c > 0) neighbors.push({ idx: curr - 1, enterSide: 1, exitSide: 3 });

      neighbors.sort(() => Math.random() - 0.5);

      for (let n of neighbors) {
        if (!visitedPath.has(n.idx) && !obstacleIndices.has(n.idx)) {
          if (findPath(n.idx)) return true;
        }
      }

      path.pop();
      return false;
    }

    if (!findPath(0)) continue;

    for (let i = 0; i < path.length; i++) {
      const curr = path[i];
      let enterSide = -1;
      let exitSide = -1;

      if (i > 0) {
        const prev = path[i - 1];
        if (curr === prev - pipeGridSize) enterSide = 2;
        else if (curr === prev + 1) enterSide = 3;
        else if (curr === prev + pipeGridSize) enterSide = 0;
        else if (curr === prev - 1) enterSide = 1;
      } else {
        enterSide = 0;
      }

      if (i < path.length - 1) {
        const next = path[i + 1];
        if (next === curr - pipeGridSize) exitSide = 0;
        else if (next === curr + 1) exitSide = 1;
        else if (next === curr + pipeGridSize) exitSide = 2;
        else if (next === curr - 1) exitSide = 3;
      } else {
        exitSide = 2;
      }

      let type = 'straight';
      if ((enterSide % 2) !== (exitSide % 2)) type = 'corner';
      else if (Math.random() < 0.25) type = 't_junction';

      let correctRot = 0;
      for (let rot = 0; rot < 4; rot++) {
        const sides = getPipeSides(type, rot);
        if (sides.includes(enterSide) && sides.includes(exitSide)) {
          correctRot = rot;
          break;
        }
      }

      pipeGridData[curr] = { type, rot: correctRot, requiredRot: correctRot };
    }

    const pathSet = new Set(path);
    for (let i = 0; i < totalTiles; i++) {
      if (!pathSet.has(i) && !obstacleIndices.has(i)) {
        const types = ['straight', 'corner', 't_junction'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomRot = Math.floor(Math.random() * 4);
        pipeGridData[i] = { type: randomType, rot: randomRot, requiredRot: randomRot };
      }
    }

    for (let i = 0; i < totalTiles; i++) {
      if (!obstacleIndices.has(i)) {
        pipeGridData[i].rot = Math.floor(Math.random() * 4);
      }
    }

    generatedAndValid = validateBoardBFS(totalTiles);
  }

  for (let i = 0; i < totalTiles; i++) {
    const item = pipeGridData[i];
    const tile = document.createElement('button');
    const tileSizeClass = pipeGridSize === 3 ? 'w-14 h-14' : (pipeGridSize === 4 ? 'w-11 h-11' : 'w-9 h-9');

    let borderClass = 'border-slate-700 bg-slate-800';
    if (item.type === 'stone') borderClass = 'border-amber-600/80 bg-amber-950/40';
    if (item.type === 'bomb') borderClass = 'border-rose-600/80 bg-rose-950/50';

    tile.className = `${tileSizeClass} ${borderClass} border-2 rounded-lg flex items-center justify-center p-1 transition-all relative`;
    tile.id = `pipeTile-${i}`;

    let label = '';
    if (i === 0) label = '<span class="absolute top-0.5 left-1 text-[8px] font-mono font-bold text-emerald-400">IN</span>';
    if (i === totalTiles - 1) label = '<span class="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-rose-400">OUT</span>';
    if (item.type === 'stone') label += '<span class="absolute top-0.5 right-1 text-[9px] text-amber-500"><i class="fa-solid fa-cube"></i></span>';
    if (item.type === 'bomb') label += '<span class="absolute inset-0 flex items-center justify-center text-lg text-rose-400"><i class="fa-solid fa-bomb"></i></span>';

    let svgContent = '';
    if (item.type === 'straight') {
      svgContent = `<line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`;
    } else if (item.type === 'corner') {
      svgContent = `<path d="M 20,0 A 20,20 0 0,1 40,20" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`;
    } else if (item.type === 't_junction') {
      svgContent = `<line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><line x1="20" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`;
    } else {
      svgContent = `<div class="w-4 h-4 bg-amber-800 rounded border border-amber-600"></div>`;
    }

    tile.innerHTML = `
      ${label}
      <svg id="pipeSvg-${i}" class="w-full h-full ${(item.type === 'stone' || item.type === 'bomb') ? 'hidden' : 'text-slate-500'} transition-colors" viewBox="0 0 40 40" style="transform: rotate(${item.rot * 90}deg)">
        ${svgContent}
      </svg>
    `;

    if (item.type !== 'stone' && item.type !== 'bomb') {
      tile.addEventListener('click', () => {
        if (pipeAdvanced && pipeValidated) return; // tras VALIDAR el tablero queda bloqueado
        audio.playClick(0.5);
        item.rot = (item.rot + 1) % 4;
        const svg = document.getElementById(`pipeSvg-${i}`);
        if (svg) svg.style.transform = `rotate(${item.rot * 90}deg)`;
        // [0.082] En la versión avanzada NO se pinta el fluido en tiempo real ni hay victoria automática
        if (!pipeAdvanced) evaluatePipeFlow();
      });
    }

    grid.appendChild(tile);
  }

  if (!pipeAdvanced) evaluatePipeFlow();
}

function validateBoardBFS(totalTiles) {
  let visited = new Set();
  let queue = [];

  const item0 = pipeGridData[0];
  if (item0 && item0.type !== 'stone') {
    visited.add(0);
    queue.push(0);
  }

  const getNeighborIndex = (idx, side) => {
    const row = Math.floor(idx / pipeGridSize);
    const col = idx % pipeGridSize;
    if (side === 0 && row > 0) return idx - pipeGridSize;
    if (side === 1 && col < pipeGridSize - 1) return idx + 1;
    if (side === 2 && row < pipeGridSize - 1) return idx + pipeGridSize;
    if (side === 3 && col > 0) return idx - 1;
    return -1;
  };

  while (queue.length > 0) {
    const curr = queue.shift();
    const item = pipeGridData[curr];
    if (item.type === 'stone') continue;

    const currSides = getPipeSides(item.type, item.requiredRot);
    currSides.forEach(side => {
      const n = getNeighborIndex(curr, side);
      if (n !== -1 && !visited.has(n)) {
        const nItem = pipeGridData[n];
        if (nItem.type !== 'stone') {
          const nSides = getPipeSides(nItem.type, nItem.requiredRot);
          if (nSides.includes((side + 2) % 4)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }
    });
  }

  return visited.has(totalTiles - 1);
}

function evaluatePipeFlow() {
  const totalTiles = pipeGridSize * pipeGridSize;
  let visited = new Set();
  let queue = [];

  const item0 = pipeGridData[0];
  if (item0 && item0.type !== 'stone') {
    visited.add(0);
    queue.push(0);
  }

  const getNeighborIndex = (idx, side) => {
    const row = Math.floor(idx / pipeGridSize);
    const col = idx % pipeGridSize;
    if (side === 0 && row > 0) return idx - pipeGridSize;
    if (side === 1 && col < pipeGridSize - 1) return idx + 1;
    if (side === 2 && row < pipeGridSize - 1) return idx + pipeGridSize;
    if (side === 3 && col > 0) return idx - 1;
    return -1;
  };

  while (queue.length > 0) {
    const curr = queue.shift();
    const item = pipeGridData[curr];
    if (item.type === 'stone') continue;

    const currSides = getPipeSides(item.type, item.rot);
    currSides.forEach(side => {
      const n = getNeighborIndex(curr, side);
      if (n !== -1 && !visited.has(n)) {
        const nItem = pipeGridData[n];
        if (nItem.type !== 'stone') {
          const nSides = getPipeSides(nItem.type, nItem.rot);
          if (nSides.includes((side + 2) % 4)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }
    });
  }

  for (let i = 0; i < totalTiles; i++) {
    const svgEl = document.getElementById(`pipeSvg-${i}`);
    if (svgEl && pipeGridData[i].type !== 'stone') {
      if (visited.has(i)) {
        svgEl.style.color = '#fbbf24';
        svgEl.className = "w-full h-full text-amber-400 transition-colors";
      } else {
        svgEl.style.color = '#64748b';
        svgEl.className = "w-full h-full text-slate-500 transition-colors";
      }
    }
  }

  const outConnected = visited.has(totalTiles - 1);

  const tileOut = document.getElementById(`pipeTile-${totalTiles - 1}`);
  if (tileOut) {
    if (outConnected) {
      tileOut.className = tileOut.className.replace('border-slate-700 bg-slate-800', 'border-emerald-500 bg-emerald-950/60 shadow-lg shadow-emerald-900/40');
      const outSvg = document.getElementById(`pipeSvg-${totalTiles - 1}`);
      if (outSvg) {
        outSvg.style.color = '#34d399';
        outSvg.className = "w-full h-full text-emerald-400 transition-colors";
      }
      
      minigameInProgress = false;
      stopMinigameTimer();
      setTimeout(() => {
        const minigameModal = document.getElementById('minigameModal');
        if (minigameModal) minigameModal.classList.add('hidden');
        const pipeContainer = document.getElementById('pipeContainer');
        if (pipeContainer) pipeContainer.classList.add('hidden');

        const active = STATE.screenChests[STATE.activeChestIdx];
        const reqCount = getRequiredToolCount(active.rarity);
        puzzleToolPaid = null;   // [0.090] ya pagada al entrar
        triggerLootExplosion();
      }, 400);
    } else {
      tileOut.className = tileOut.className.replace('border-emerald-500 bg-emerald-950/60 shadow-lg shadow-emerald-900/40', 'border-slate-700 bg-slate-800');
    }
  }
}

/* ==========================================================================
   TIENDA DEL DUENDE Y MESA DE RECICLAJE
   ========================================================================== */

function triggerMerchantShopModalSequence() {
  const tier = getNarrativeTier();
  const phrases = DATOS_JUEGO.NARRATIVA.DUENDE_TIENDA_FRASES[tier];
  const speech = phrases[Math.floor(Math.random() * phrases.length)];

  triggerSequentialDialogue(
    "EL DUENDE",
    speech,
    "fa-hat-wizard",
    "Tienda Ambulante & Taller",
    "text-purple-300",
    null,
    () => {
      openMerchantShop();
    }
  );
}

function resetShopSession() {
  STATE.shopSession = {
    items: [],
    totalGold: 0,
    totalPicksRecycled: 0
  };
}

function showShopReceipt(onCloseCallback) {
  const persistentBanner = document.getElementById('persistentFeedbackBanner');
  if (persistentBanner) persistentBanner.classList.add('hidden');

  const session = STATE.shopSession;
  const validItems = session ? (session.items || []).filter(item => !item.isStolen) : [];

  // [0.084] Frase de culpa por robo: aparece DESPUÉS del recibo, ya fuera de la tienda
  const guiltText = session && session.guiltPhrase ? session.guiltPhrase : null;
  if (session) session.guiltPhrase = null;
  const originalCallback = onCloseCallback;
  onCloseCallback = () => {
    if (originalCallback) originalCallback();
    if (guiltText) showPersistentFeedback(`🎭 "${guiltText}"`);
  };

  if (!session || validItems.length === 0) {
    if (onCloseCallback) onCloseCallback();
    return;
  }

  const oldReceipt = document.getElementById('duendeReceiptModal');
  if (oldReceipt) oldReceipt.remove();

  const frasesRecibo = DATOS_JUEGO.NARRATIVA.FRASES_RECIBO_DUENDE;
  let duendeQuote = frasesRecibo.DEFAULT;
  const bankTier = (frasesRecibo.POR_TIER || {})[getNarrativeTier()];
  if (bankTier && bankTier.length) duendeQuote = bankTier[Math.floor(Math.random() * bankTier.length)];
  if (session.totalGold >= 80) {
    duendeQuote = frasesRecibo.ALTO_ORO;
  } else if (session.totalGold === 0 && session.totalPicksRecycled > 0) {
    duendeQuote = frasesRecibo.SOLO_RECICLAJE;
  }

  const itemsHTML = validItems.map(item => `
    <div class="flex items-center justify-between bg-slate-900 border border-amber-500/30 px-3 py-3 rounded-xl text-xs font-mono">
      <span class="flex items-center gap-2 text-amber-200">
        <i class="fa-solid ${item.icon || 'fa-box'} text-amber-400"></i> ${item.name}
      </span>
      <span class="text-amber-400 font-black">${item.costText}</span>
    </div>
  `).join('');

  const receiptModal = document.createElement('div');
  receiptModal.id = 'duendeReceiptModal';
  receiptModal.className = 'fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans';
  receiptModal.innerHTML = `
    <div class="bg-slate-950 border-2 border-amber-500/60 w-full max-w-md p-5 rounded-2xl shadow-2xl flex flex-col gap-4 text-white relative animate-fade-in">
      <div class="flex items-center gap-3 border-b border-amber-500/30 pb-3">
        <div class="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300 text-xl shadow-inner">
          <i class="fa-solid fa-receipt"></i>
        </div>
        <div>
          <h3 class="text-base font-black tracking-wide text-amber-400 uppercase">Recibo de la Visita</h3>
          <p class="text-[11px] font-mono text-slate-400">Tienda del Duende Mercader</p>
        </div>
      </div>

      <div class="receipt-quote bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl text-xs italic text-purple-200 leading-relaxed font-serif">
        ${duendeQuote}
      </div>

      <div class="space-y-1.5 max-h-48 overflow-y-auto">
        ${itemsHTML}
      </div>

      <div class="bg-slate-900 border border-amber-500/30 px-3 py-3 rounded-xl flex flex-col gap-2 text-xs font-mono">
        <span class="text-slate-400 font-bold uppercase">Balance Final:</span>
        ${session.totalGold > 0 ? `<div class="flex items-center justify-between"><span class="text-slate-300">GP gastados</span><span class="text-amber-400 font-black"><i class="fa-solid fa-coins"></i> -${session.totalGold} GP</span></div>` : ''}
        ${session.totalPicksRecycled > 0 ? `<div class="flex items-center justify-between"><span class="text-slate-300">Ganzúas recicladas</span><span class="text-amber-300 font-black"><i class="fa-solid fa-screwdriver"></i> -${session.totalPicksRecycled} Ganzúas</span></div>` : ''}
      </div>

      <button id="closeReceiptBtn" class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer">
        Continuar
      </button>
    </div>
  `;

  uiHost().appendChild(receiptModal);

  document.getElementById('closeReceiptBtn').addEventListener('click', () => {
    receiptModal.remove();
    if (persistentBanner) persistentBanner.classList.add('hidden');
    resetShopSession();
    if (onCloseCallback) onCloseCallback();
  });
}

function openMerchantShop() {
  if (!STATE.shopSession) {
    resetShopSession();
  }

  const shopGrid = document.getElementById('shopItemsList') || document.getElementById('merchantItemsGrid'); 
  if (!shopGrid) return;

  const discountMult = getDiscountMultiplier();

  if (!STATE.currentShopOffer) {
    let catalog = [
      { id: 'pack_ganzuas', name: '+3 Ganzúas Básicas', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_ganzuas * discountMult), icon: 'fa-key', prop: 'picks', qty: 3 },
      { id: 'pack_pines', name: '+2 Pines de Acero', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_pines * discountMult), icon: 'fa-screwdriver', prop: 'proPicks', qty: 2, minLvl: 2 },
      { id: 'pack_usb', name: '+2 Llaves USB', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_usb * discountMult), icon: 'fa-microchip', prop: 'usb', qty: 2, minLvl: 3 },
      { id: 'pack_valvulas', name: '+1 Válvula Hidráulica', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.pack_valvulas * discountMult), icon: 'fa-faucet', prop: 'valves', qty: 1, minLvl: 5 },
      { id: 'carta_auto_open', name: 'Carta Auto-Open', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_auto_open * discountMult), icon: 'fa-wand-magic-sparkles', abilityProp: 'auto' },
      { id: 'carta_escudo', name: 'Carta Escudo Protector', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_escudo * discountMult), icon: 'fa-shield-halved', abilityProp: 'shield' },
      { id: 'carta_apuesta', name: 'Carta Doble o Nada', baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.carta_apuesta * discountMult), icon: 'fa-dice', abilityProp: 'riskPot' }
    ];

    if (!STATE.chestCounterUnlocked) {
      catalog.push({
        id: 'contador_cofres',
        name: 'Contador de Cofres',
        baseCost: Math.round(DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.contador_cofres * discountMult),
        icon: 'fa-stopwatch',
        isChestCounter: true
      });
    }

    const availableCatalog = catalog.filter(item => !item.minLvl || STATE.level >= item.minLvl);
    STATE.currentShopOffer = [...availableCatalog].sort(() => 0.5 - Math.random()).slice(0, 3).map(item => ({
      ...item,
      purchaseCount: 0
    }));
  }

  renderMerchantShopGrid();
}

function renderMerchantShopGrid() {
  const shopGrid = document.getElementById('shopItemsList') || document.getElementById('merchantItemsGrid'); 
  if (!shopGrid || !STATE.currentShopOffer) return;
  shopGrid.innerHTML = '';

  function grantItem(item) {
    if (item.isChestCounter) {
      STATE.chestCounterUnlocked = true;
      // [0.087b] La respuesta la dice el Duende con su retrato (el diálogo se pone por encima de la tienda)
      const dm = document.getElementById('dialogueModal');
      if (dm) dm.style.zIndex = '60';
      triggerSequentialDialogue("EL DUENDE", DATOS_JUEGO.NARRATIVA.FRASES_RECIBO_DUENDE.CONTADOR_RESPUESTA, "fa-hat-wizard", "Contador de cofres", "text-purple-300", null, () => { if (dm) dm.style.zIndex = ''; });
    } else if (item.prop) {
      STATE[item.prop] += item.qty;
    } else if (item.abilityProp) {
      STATE.abilities[item.abilityProp]++;
    }
  }

  const aumentoPrecio = DATOS_JUEGO.ECONOMIA.TIENDA_DUENDE.aumento_precio_por_compra;

  STATE.currentShopOffer.forEach(item => {
    const currentPrice = item.baseCost + (item.purchaseCount * aumentoPrecio);
    const isStealAvailable = STATE.perks.shopStealFree;

    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-md";

    card.innerHTML = `
      <div>
        <div class="text-amber-400 font-black text-xs flex items-center gap-1.5 mb-0.5">
          <i class="fa-solid ${item.icon}"></i> ${item.name}
        </div>
        <div class="text-[10px] font-mono">
          ${isStealAvailable 
            ? '<span class="text-rose-400 font-bold uppercase">¡GRATIS (ROBO)!</span>' 
            : `Precio: <span class="text-yellow-400 font-bold">${currentPrice} GP</span> ${item.purchaseCount > 0 ? `<span class="text-slate-500 text-[9px]">(+${item.purchaseCount * aumentoPrecio}GP)</span>` : ''}`}
        </div>
      </div>
      <button class="w-full py-1 ${isStealAvailable ? 'bg-gradient-to-r from-rose-600 to-red-700' : 'bg-gradient-to-r from-purple-600 to-indigo-600'} active:scale-95 text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer">
        ${isStealAvailable ? 'ROBAR' : `COMPRAR (${currentPrice} GP)`}
      </button>
    `;

    const btn = card.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        if (!STATE.shopSession) resetShopSession();

        if (STATE.perks.shopStealFree) {
          STATE.perks.shopStealFree = false;
          grantItem(item);

          STATE.shopSession.items.push({ name: item.name, costText: 'GRATIS (ROBO)', icon: item.icon, isStolen: true });

          // [0.084] Al robar solo suena el efecto; la frase de culpa se muestra al salir de la tienda, tras el recibo
          const culpaList = DATOS_JUEGO.NARRATIVA.FRASES_CULPA_ROBO;
          STATE.shopSession.guiltPhrase = culpaList[Math.floor(Math.random() * culpaList.length)];

          audio.playUnlockFanfare('raro');
          updateUI();
          renderMerchantShopGrid();

        } else {
          if (STATE.gold >= currentPrice) {
            STATE.gold -= currentPrice;
            grantItem(item);

            STATE.shopSession.items.push({ name: item.name, costText: `${currentPrice} GP`, icon: item.icon, isStolen: false });
            STATE.shopSession.totalGold += currentPrice;

            item.purchaseCount++;

            // [0.082] Sin mensaje frontal al comprar (el recibo del Duende se muestra al salir)
            audio.playUnlockFanfare('raro');
            updateUI();
            renderMerchantShopGrid();
          } else {
            audio.playBreak();
            showPersistentFeedback("⚠️ No tienes suficiente oro.");
          }
        }
      });
    }

    shopGrid.appendChild(card);
  });

  const recycleListContainer = document.getElementById('recycleList');
  if (recycleListContainer) {
    recycleListContainer.innerHTML = '';
    
    let recycleTargets = [ 
      { name: "Pin de Acero", prop: "proPicks", icon: "fa-screwdriver", color: "emerald", minLvl: 2 }, 
      { name: "Llave USB", prop: "usb", icon: "fa-microchip", color: "cyan", minLvl: 3 }, 
      { name: "Válvula Hidráulica", prop: "valves", icon: "fa-faucet", color: "rose", minLvl: 5 } 
    ].filter(t => STATE.level >= t.minLvl);
    
    if (recycleTargets.length === 0) { 
      recycleTargets = [{ name: "Pin de Acero", prop: "proPicks", icon: "fa-screwdriver", color: "emerald", minLvl: 1 }]; 
    }
    
    const reqGanzuasReciclaje = DATOS_JUEGO.ECONOMIA.RECICLAJE.ganzuas_requeridas;
    
    recycleTargets.forEach(target => {
      const card = document.createElement('div');
      card.className = "bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-md";
      
      card.innerHTML = `
        <div>
          <div class="text-${target.color}-400 font-black text-xs flex items-center gap-1.5 mb-0.5">
            <i class="fa-solid ${target.icon}"></i> ${target.name}
          </div>
          <div class="text-[10px] font-mono text-slate-400">
            Canje: <span class="text-amber-300 font-bold">${reqGanzuasReciclaje} Ganzúas</span> ➔ <span class="text-white font-bold">1 ${target.name}</span>
          </div>
        </div>
        <button class="w-full py-1 bg-gradient-to-r from-emerald-600 to-teal-700 active:scale-95 text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer">
          RECICLAR (${reqGanzuasReciclaje} Ganzúas)
        </button>
      `;
      
      const btn = card.querySelector('button');
      btn.addEventListener('click', () => {
        if (!STATE.shopSession) resetShopSession();
        if (STATE.picks >= reqGanzuasReciclaje) {
          STATE.picks -= reqGanzuasReciclaje;
          STATE[target.prop] += 1;

          STATE.shopSession.items.push({ name: `Reciclaje: ${target.name}`, costText: `${reqGanzuasReciclaje} Ganzúas`, icon: target.icon, isStolen: false });
          STATE.shopSession.totalPicksRecycled += reqGanzuasReciclaje;

          audio.playClick(0.9);
          showPersistentFeedback(`♻️ Recicladas ${reqGanzuasReciclaje} Ganzúas Básicas por 1 ${target.name}.`);
          updateUI();
          renderMerchantShopGrid();
        } else {
          audio.playBreak();
          showPersistentFeedback(`⚠️ Necesitas al menos ${reqGanzuasReciclaje} Ganzúas Básicas para reciclar.`);
        }
      });
      
      recycleListContainer.appendChild(card);
    });
  }

  const merchantModal = document.getElementById('merchantModal'); 
  if (merchantModal) merchantModal.classList.remove('hidden');
}

const closeMerchantBtns = [
  document.getElementById('closeMerchantBtn'),
  document.getElementById('leaveShopBtn')
];
closeMerchantBtns.forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      if (specialShopOpen) { handleSpecialShopNoBuy(); return; }
      STATE.currentShopOffer = null;
      const merchantModal = document.getElementById('merchantModal'); 
      if (merchantModal) merchantModal.classList.add('hidden');
      showShopReceipt(() => processNextQueuedEvent());
    });
  }
});

/* ==========================================================================
   TRATOS DEL TRAPERO
   ========================================================================== */

function triggerTraperoShopSequence() {
  const tier = getNarrativeTier();
  const phrases = DATOS_JUEGO.NARRATIVA.TRAPERO_FRASES[tier];
  const speech = phrases[Math.floor(Math.random() * phrases.length)];

  triggerSequentialDialogue(
    "EL TRAPERO",
    speech,
    "fa-mask",
    "Tratos Oscuros",
    "text-rose-400",
    null,
    () => {
      openTraperoShop();
    }
  );
}

function showTraperoDealFeedback(dealTitle, summaryText, onClose) {
  triggerSequentialDialogue(
    "EL TRAPERO",
    summaryText,
    "fa-handshake",
    `TRATO ACEPTADO: ${dealTitle.toUpperCase()}`,
    "text-rose-400",
    null,
    () => {
      if (typeof onClose === 'function') onClose();
      else closeTraperoShop();
    }
  );
}

// [0.089] Herramientas avanzadas "descubiertas" = las de los cofres cuyo puzle ya está desbloqueado por nivel
function unlockedAdvancedTools() {
  return DATOS_JUEGO.COFRES.ESTANDAR.filter(t => t.consumible !== 'picks' && STATE.level >= t.minNivel).map(t => t.consumible);
}

function openTraperoShop() {
  const grid = document.getElementById('traperoDealsGrid') || document.getElementById('traperoItemsList'); 
  if (!grid) return;
  grid.innerHTML = '';

  let deals = [...DATOS_JUEGO.TRATOS_TRAPERO.INICIALES, ...DATOS_JUEGO.TRATOS_TRAPERO.OSCUROS];

  deals = deals.filter(deal => {
    if (deal.id === 'empujon_siniestro' && STATE.gold <= 100) return false;
    // [0.082] Dedos Rotos ya aceptado: no vuelve a aparecer hasta el siguiente bucle (resetGame lo desactiva)
    if (deal.id === 'dedos_rotos' && STATE.picksBrokenOnUse) return false;
    // [0.089] Los tratos que dan "+N de cada herramienta avanzada" no se ofrecen si aún no hay ninguna desbloqueada
    if ((deal.id === 'amor_arte' || deal.id === 'pacto_sangre') && unlockedAdvancedTools().length === 0) return false;
    return true;
  });

  if (STATE.chestsOpened >= 30 && !STATE.chestCounterUnlocked) {
    deals.push({
      id: 'contador_cofres_trapero',
      titulo: 'Contador de Cofres',
      desc: 'Entrega 5 Ganzúas Básicas para saber más.',
      isChestCounterTrapero: true
    });
  }

  const selectedDeals = deals.sort(() => 0.5 - Math.random()).slice(0, 3);

  selectedDeals.forEach(deal => {
    const card = document.createElement('div');
    card.className = "bg-slate-900 border border-rose-900/60 p-2.5 rounded-xl flex flex-col justify-between gap-1.5 text-left shadow-md";
    card.innerHTML = `
      <div>
        <div class="text-rose-400 font-black text-xs flex items-center gap-1.5 mb-0.5">
          <i class="fa-solid fa-skull"></i> ${deal.titulo}
        </div>
        <div class="text-[10px] text-slate-400 font-mono">${deal.desc}</div>
      </div>
      <button class="w-full py-1 bg-gradient-to-r from-rose-900 to-amber-900 active:scale-95 text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer">
        ACEPTAR TRATO
      </button>
    `;

    const btn = card.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        const traperoModal = document.getElementById('traperoModal') || document.getElementById('traperoShopModal');

        if (deal.isChestCounterTrapero) {
          if (STATE.picks >= 5) {
            STATE.picks -= 5;
            STATE.chestCounterUnlocked = true;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playUnlockFanfare('epico');
            updateUI();
            showTraperoDealFeedback("Contador de Cofres", "Entregaste 5 Ganzúas. El Contador de Cofres ha sido instalado en tu interfaz.");
          } else {
            audio.playBreak();
            showPersistentFeedback("⚠️ Necesitas 5 Ganzúas Básicas para este trato.");
          }
        } else if (deal.id === 'vender_ganzuas') {
          if (STATE.picks >= 2) {
            STATE.picks -= 2;
            STATE.gold += DATOS_JUEGO.ECONOMIA.TRAPERO.gp_por_dos_ganzuas;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Vender 2 Ganzúas", `Entregaste 2 Ganzúas a cambio de +${DATOS_JUEGO.ECONOMIA.TRAPERO.gp_por_dos_ganzuas} GP inmediatos.`);
          } else {
            showPersistentFeedback("⚠️ Necesitas al menos 2 Ganzúas.");
          }
        } else if (deal.id === 'vender_avanzada') {
          // [CAMBIO] Vender 1 Herramienta Avanzada: se entrega una al azar entre las que tengas y paga gp_por_herramienta_avanzada
          const disponibles = [];
          if (STATE.proPicks >= 1) disponibles.push({ prop: 'proPicks', name: 'Pin de Acero' });
          if (STATE.usb >= 1) disponibles.push({ prop: 'usb', name: 'Llave USB' });
          if (STATE.valves >= 1) disponibles.push({ prop: 'valves', name: 'Válvula Hidráulica' });
          if (disponibles.length > 0) {
            const vendida = disponibles[Math.floor(Math.random() * disponibles.length)];
            const gpVenta = DATOS_JUEGO.ECONOMIA.TRAPERO.gp_por_herramienta_avanzada;
            STATE[vendida.prop] -= 1;
            STATE.gold += gpVenta;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Vender 1 Herramienta Avanzada", `El Trapero se lleva tu ${vendida.name} a cambio de +${gpVenta} GP inmediatos.`);
          } else {
            showPersistentFeedback("⚠️ Necesitas al menos 1 herramienta avanzada (Pin, USB o Válvula).");
          }
        } else if (deal.id === 'canje_directo') {
          if (STATE.picks >= 2) {
            STATE.picks -= 2;
            STATE.proPicks += 1;
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Canje Directo", "Intercambiaste 2 Ganzúas por 1 Pin de Acero.");
          } else {
            showPersistentFeedback("⚠️ Necesitas al menos 2 Ganzúas.");
          }
        } else if (deal.id === 'purga_maldicion') {
          const hasAdvancedTool = (STATE.proPicks >= 1 || STATE.usb >= 1 || STATE.valves >= 1);
          if (hasAdvancedTool && STATE.cursedChestsLeft > 0) {
            if (STATE.proPicks >= 1) STATE.proPicks--;
            else if (STATE.usb >= 1) STATE.usb--;
            else if (STATE.valves >= 1) STATE.valves--;

            STATE.cursedChestsLeft = Math.max(0, STATE.cursedChestsLeft - 4);
            if (STATE.cursedChestsLeft === 0) { STATE.salvageCurseActive = false; queueCurseEndMessage(); }
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playClick(0.8);
            updateUI();
            showTraperoDealFeedback("Purga de Maldición", "Entregaste 1 herramienta avanzada. La duración de tu maldición se ha reducido en 4 cofres.");
          } else {
            showPersistentFeedback("⚠️ Necesitas 1 herramienta avanzada y estar maldecido.");
          }
        } else if (deal.id === 'contrato_leonino') {
          STATE.gold += DATOS_JUEGO.ECONOMIA.TRAPERO.gp_contrato_leonino;
          STATE.heavyChestsLeft += 10;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Contrato Leonino", `Recibes +${DATOS_JUEGO.ECONOMIA.TRAPERO.gp_contrato_leonino} GP inmediatos. Cuidado: los próximos 10 cofres Raros+ requerirán +1 herramienta extra.`);
        } else if (deal.id === 'pacto_sangre') {
          unlockedAdvancedTools().forEach(p => { STATE[p] += 3; });   // [0.089] solo las ya desbloqueadas
          STATE.cursedChestsLeft += 12;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de Sangre", "Obtienes +3 de cada herramienta avanzada que ya has desbloqueado, pero sufres 12 turnos de Maldición (-50% GP y XP).");
        } else if (deal.id === 'pacto_sombra') {
          STATE.harderPuzzlesLeft += 10;
          STATE.traperoBuffs.bonusXp = true;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de la Sombra", "+25% Experiencia permanente activado. Los minijuegos de los próximos 10 cofres serán más exigentes.");
        } else if (deal.id === 'amor_arte') {
          unlockedAdvancedTools().forEach(p => { STATE[p] += 2; });   // [0.089] solo las ya desbloqueadas
          STATE.noXpChestsLeft += 5;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Por Amor al Arte", "Obtienes +2 de cada herramienta avanzada que ya has desbloqueado. No ganarás experiencia durante los próximos 5 cofres.");
        } else if (deal.id === 'empujon_siniestro') {
          STATE.gold = 30;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          // [CAMBIO] Primero se muestra el trato y, al continuar, se sube de nivel (evita que los diálogos se pisen)
          showTraperoDealFeedback("Empujón Siniestro", "Tus GP han caído a 30, pero ascenderás un nivel inmediatamente.", () => {
            ['traperoModal', 'traperoShopModal', 'dialogueModal'].forEach(mid => {
              const el = document.getElementById(mid);
              if (el) el.classList.add('hidden');
            });
            processLevelUp(true);
          });
        } else if (deal.id === 'dedos_rotos') {
          STATE.picks += 10;
          STATE.picksBrokenOnUse = true;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Dedos Rotos", "Recibes +10 Ganzúas Básicas. ¡Atención! A partir de ahora tus ganzúas se consumirán aunque resuelvas el puzle.");
        } else if (deal.id === 'cambio_trabajo') {
          let lostPerkText = 'una modificación positiva';
          const activePerksList = [];
          if (STATE.perks.sweetSpot > 0) activePerksList.push('sweetSpot');
          if (STATE.perks.rarityBonus > 0) activePerksList.push('rarityBonus');
          if (STATE.perks.discount > 0) activePerksList.push('discount');
          if (STATE.perks.slowerPistons > 0) activePerksList.push('slowerPistons');
          if (STATE.perks.goldStreak > 0) activePerksList.push('goldStreak');
          if (STATE.perks.extraTime > 0) activePerksList.push('extraTime');
          if (STATE.perks.oidoClinico > 0) activePerksList.push('oidoClinico');
          if (STATE.perks.shopStealFree) activePerksList.push('shopStealFree');
          if (STATE.perks.luckyLootChance > 0) activePerksList.push('luckyLootChance');
          if (STATE.perks.bonusMadera > 0) activePerksList.push('bonusMadera');
          if (STATE.perks.bonusAcero > 0) activePerksList.push('bonusAcero');
          if (STATE.perks.bonusDigital > 0) activePerksList.push('bonusDigital');
          if (STATE.perks.bonusVapor > 0) activePerksList.push('bonusVapor');

          if (activePerksList.length === 0) {
            if (traperoModal) traperoModal.classList.add('hidden');
            audio.playBreak();
            triggerSequentialDialogue(
              "EL TRAPERO",
              "¿De verdad pensaste que podías engañarme?",
              "fa-mask",
              "TRATO NO SELLADO",
              "text-rose-500",
              null,
              () => { closeTraperoShop(); }
            );
            showPersistentFeedback("Trato no sellado: no tienes modificaciones activas.");
            return;
          }

          const chosenPerk = activePerksList[Math.floor(Math.random() * activePerksList.length)];
          // [0.089] Nombre de lo que se pierde, para decirlo en la frase del Trapero
          const PERK_NOMBRES = { sweetSpot: 'Mano Firme', rarityBonus: 'Ojo de Cazador', discount: 'Regateador', slowerPistons: 'Pistones Lentos', goldStreak: 'Fondo de Bolsillo', extraTime: 'Hombre Tranquilo (-2 s de margen)', oidoClinico: 'Oído Clínico', shopStealFree: 'Ladrón', luckyLootChance: 'Tipo con Suerte', bonusMadera: 'Clásico (maestría de Madera)', bonusAcero: 'Mecánico (maestría de Acero)', bonusDigital: 'Informático (maestría Digital)', bonusVapor: 'Fontanero (maestría de Vapor)' };
          const lostLevelled = !['shopStealFree', 'luckyLootChance', 'oidoClinico', 'extraTime'].includes(chosenPerk) && (STATE.perks[chosenPerk] || 0) > 1;
          lostPerkText = (lostLevelled ? '1 nivel de ' : '') + (PERK_NOMBRES[chosenPerk] || chosenPerk);
          if (chosenPerk === 'shopStealFree') STATE.perks.shopStealFree = false;
          else if (chosenPerk === 'extraTime') STATE.perks.extraTime = Math.max(0, STATE.perks.extraTime - 2);
          else if (chosenPerk === 'luckyLootChance') STATE.perks.luckyLootChance = 0;
          else if (chosenPerk.startsWith('bonus')) STATE.perks[chosenPerk] = Math.max(0, STATE.perks[chosenPerk] - 1);
          else STATE.perks[chosenPerk] = Math.max(0, STATE.perks[chosenPerk] - 1);

          STATE.gold += 35;
          STATE.xpBoostChestsLeft += 10;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Cambio de Trabajo", `Has perdido: ${lostPerkText}. Recibes +35 GP y +25% XP extra durante 10 cofres.`);
        } else if (deal.id === 'maestria_doble_filo') {
          const chestTypes = ['madera', 'acero', 'digital', 'vapor'];
          const maestriaType = chestTypes[Math.floor(Math.random() * chestTypes.length)];
          const remainingTypes = chestTypes.filter(t => t !== maestriaType);
          const torpezaType = remainingTypes[Math.floor(Math.random() * remainingTypes.length)];

          let isAnulacion = false;

          const perkKeyM = 'bonus' + maestriaType.charAt(0).toUpperCase() + maestriaType.slice(1);
          if (STATE.torpezas[maestriaType] > 0) {
            STATE.torpezas[maestriaType] = Math.max(0, STATE.torpezas[maestriaType] - 1);
            isAnulacion = true;
          } else {
            STATE.perks[perkKeyM] = (STATE.perks[perkKeyM] || 0) + 1;
          }

          const perkKeyT = 'bonus' + torpezaType.charAt(0).toUpperCase() + torpezaType.slice(1);
          if (STATE.perks[perkKeyT] > 0) {
            STATE.perks[perkKeyT] = Math.max(0, STATE.perks[perkKeyT] - 1);
            isAnulacion = true;
          } else {
            STATE.torpezas[torpezaType] = (STATE.torpezas[torpezaType] || 0) + 1;
          }

          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();

          if (isAnulacion) {
            showTraperoDealFeedback("Maestría de Doble Filo", "Se ha reducido un nivel de conflicto entre tu torpeza y maestría para uno de los tipos de cofre.");
          } else {
            showTraperoDealFeedback("Maestría de Doble Filo", `Has recibido +1 Nivel de Maestría en ${maestriaType.toUpperCase()}, pero sufres +1 Nivel de Torpeza en ${torpezaType.toUpperCase()}.`);
          }
        } else {
          STATE.gold += 20;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playClick(0.8);
          updateUI();
          showTraperoDealFeedback(deal.titulo, "Trato cerrado. Revisa tu inventario y efectos activos.");
        }
      });
    }

    grid.appendChild(card);
  });

  const traperoModal = document.getElementById('traperoModal') || document.getElementById('traperoShopModal'); 
  if (traperoModal) traperoModal.classList.remove('hidden');
}

/* ==========================================================================
   CARTAS DE SUBIDA DE NIVEL
   ========================================================================== */

function triggerLevelUpChoice() {
  const lvlNum = document.getElementById('levelUpNum'); 
  if (lvlNum) {
    lvlNum.textContent = `NIVEL ${STATE.level}`;
  }
  
  const modalHeader = document.querySelector('#levelUpModal h2, #levelUpModal .modal-title, #levelUpModal h3');
  if (modalHeader) {
    modalHeader.innerHTML = `<span class="text-xs font-mono font-bold text-indigo-400 block tracking-widest uppercase mb-1">¡HAS SUBIDO DE NIVEL!</span><span class="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider font-retro">NIVEL ${STATE.level}</span>`;
  }

  const grid = document.getElementById('levelUpCardsGrid') || document.getElementById('chestChoicesGrid'); 
  if (!grid) return;
  grid.innerHTML = '';

  // [CAMBIO] Wildcard obligatorio arriba y, debajo, las 3 cartas a elegir (todo en la misma pantalla)
  rollWildcard();

  const pool = [...DATOS_JUEGO.CARTAS_NIVEL.PASIVAS, ...DATOS_JUEGO.CARTAS_NIVEL.TACTICAS].sort(() => 0.5 - Math.random()).slice(0, 3);

  pool.forEach(cardData => {
    let currentLvl = 0;
    if (cardData.id === 'clasico') currentLvl = STATE.perks.bonusMadera || 0;
    if (cardData.id === 'mecanico') currentLvl = STATE.perks.bonusAcero || 0;
    if (cardData.id === 'informatico') currentLvl = STATE.perks.bonusDigital || 0;
    if (cardData.id === 'fontanero') currentLvl = STATE.perks.bonusVapor || 0;

    let descText = cardData.desc;
    let titleText = cardData.titulo;

    if (currentLvl > 0) {
      const nextLvl = currentLvl + 1;
      const nextPct = Math.round(getMasteryTorpezaPct(nextLvl) * 100);
      descText = `Sube a Nivel ${nextLvl} (+${nextPct}% botín y EXP).`;
      titleText = `${cardData.titulo} (Lv.${currentLvl} ➔ ${nextLvl})`;
    } else if (['clasico', 'mecanico', 'informatico', 'fontanero'].includes(cardData.id)) {
      const basePct = Math.round(DATOS_JUEGO.ECONOMIA.PORCENTAJE_MAESTRIA_TORPEZA_BASE * 100);
      descText = `Nivel 1: +${basePct}% de botín y EXP en sus cofres.`;
    }

    const cardEl = document.createElement('button');
    cardEl.className = "bg-slate-900 border border-indigo-500/50 p-3 rounded-2xl flex flex-col items-center text-center gap-2 active:scale-95 transition-all shadow-xl hover:border-indigo-400 group cursor-pointer";
    cardEl.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500 flex items-center justify-center text-indigo-400 text-lg group-hover:scale-110 transition-transform">
        <i class="fa-solid ${cardData.icono}"></i>
      </div>
      <div>
        <span class="text-[9px] font-extrabold font-mono uppercase px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800">${cardData.tipo}</span>
        <div class="text-white font-black text-xs mt-1">${titleText}</div>
        <div class="text-[10px] text-slate-400 font-mono mt-0.5">${descText}</div>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      audio.playUnlockFanfare('raro');
      
      if (cardData.tipo === 'PERK') {
        if (cardData.id === 'mano_firme') STATE.perks.sweetSpot++;
        if (cardData.id === 'ojo_cazador') STATE.perks.rarityBonus++;
        if (cardData.id === 'regateador') STATE.perks.discount++;
        if (cardData.id === 'pistones_lentos') STATE.perks.slowerPistons++;
        if (cardData.id === 'fondo_bolsillo') STATE.perks.goldStreak++;
        if (cardData.id === 'hombre_tranquilo') STATE.perks.extraTime += cardData.valor;
        if (cardData.id === 'oido_clinico') STATE.perks.oidoClinico = 1;
        if (cardData.id === 'ladron') STATE.perks.shopStealFree = true;
        if (cardData.id === 'tipo_con_suerte') STATE.perks.luckyLootChance = cardData.valor;
        if (cardData.id === 'clasico') STATE.perks.bonusMadera = (STATE.perks.bonusMadera || 0) + 1;
        if (cardData.id === 'mecanico') STATE.perks.bonusAcero = (STATE.perks.bonusAcero || 0) + 1;
        if (cardData.id === 'informatico') STATE.perks.bonusDigital = (STATE.perks.bonusDigital || 0) + 1;
        if (cardData.id === 'fontanero') STATE.perks.bonusVapor = (STATE.perks.bonusVapor || 0) + 1;
      } else {
        if (cardData.id === 'auto_open') STATE.abilities.auto++;
        if (cardData.id === 'doble_2x') STATE.abilities.double++;
        if (cardData.id === 'escudo') STATE.abilities.shield++;
        if (cardData.id === 'apuesta_riesgo') STATE.abilities.riskPot++;
        if (cardData.id === 'carta_perdedor') STATE.abilities.perdedor++;
        if (cardData.id === 'invocar_duende') STATE.abilities.summonDuende++;
      }

      const levelUpModal = document.getElementById('levelUpModal'); if (levelUpModal) levelUpModal.classList.add('hidden');
      updateUI();

      if (STATE.xp >= STATE.xpNext) {
        STATE.eventQueue.unshift(() => processLevelUp());
      }
      processNextQueuedEvent();
    });

    grid.appendChild(cardEl);
  });

  const levelUpModal = document.getElementById('levelUpModal'); if (levelUpModal) levelUpModal.classList.remove('hidden');
}

/* ==========================================================================
   INTERACCIÓN PRINCIPAL ("FORZAR CERRADURA")
   ========================================================================== */

const openChestBtn = document.getElementById('openChestBtn') || document.getElementById('openActiveChestBtn');

// [0.089] Lógica de apertura (antes dentro del clic del botón). La usan el segundo toque, la cerradura y la apertura automática.
function openActiveChest() {
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (!active) return;

    audio.init();
    audio.playLockOpen(active.type.id);   // [0.087] sonido al abrir (botón o cerradura táctil), propio de cada tipo

    const co = STATE.chestsOpened;

    if (co >= 95 && co < DATOS_JUEGO.PROGRESIÓN.SECUENCIA_HISTORIA.COFRE_COLAPSO_FINAL && STATE.climaxPhase) {
      const containers = ['lockpickContainer', 'tumblerContainer', 'hackContainer', 'pipeContainer'];
      containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      const minigameModal = document.getElementById('minigameModal');
      if (minigameModal) minigameModal.classList.add('hidden');

      triggerLootExplosion();
      return;
    }

    const reqCount = getRequiredToolCount(active.rarity);
    const toolProp = active.type.consumible;

    if (STATE[toolProp] < reqCount) {
      if (checkCanOpenAnyChestOnScreen()) {
        showPersistentFeedback(`⚠️ No tienes suficientes herramientas para este cofre. Selecciona otro o usa una carta táctica.`);
      } else {
        checkGameOver();
      }
      return;
    }

    const containers = ['lockpickContainer', 'tumblerContainer', 'hackContainer', 'pipeContainer'];
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const minigameTitle = document.getElementById('minigameTitle');
    if (minigameTitle) minigameTitle.textContent = active.type.nombre;

    if (active.type.juego === 'lockpick') startLockpickGame();
    else if (active.type.juego === 'tumbler') startTumblerGame();
    else if (active.type.juego === 'hack') startHackGame();
    else if (active.type.juego === 'pipe') startPipeGame();
    minigameInProgress = true;
    humHoldChest = active;   // [0.091] el zumbido se calla con este cofre hasta fallar o hasta que salga otro

    // [0.090] Herramientas avanzadas (no madera): se pagan AL ENTRAR al puzle (se ve el "-N" al empezar). Ganar no vuelve a cobrar; fallar tampoco; el Escudo las devuelve.
    puzzleToolPaid = null; puzzleStat = active.type.juego;   // [0.090]
    if (toolProp !== 'picks') {
      STATE[toolProp] = Math.max(0, STATE[toolProp] - reqCount);
      puzzleToolPaid = { prop: toolProp, n: reqCount };
      updateUI();
    }

    const minigameModal = document.getElementById('minigameModal');
    if (minigameModal) minigameModal.classList.remove('hidden');
}

if (openChestBtn) {
  openChestBtn.addEventListener('click', () => {
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (!active) return;
    const hasTools = (STATE[active.type.consumible] || 0) >= getRequiredToolCount(active.rarity);
    if (hasTools && !lockIsArmed(active) && !minigameInProgress) { audio.init(); armLock(active); return; }
    lockArmedChest = null;
    openActiveChest();
  });
}

const closeMinigameBtn = document.getElementById('closeMinigameBtn');
if (closeMinigameBtn) {
  // [CAMBIO] La X cuenta como fallo del puzle: cobra la herramienta (en la ganzúa, ganzúa rota)
  closeMinigameBtn.addEventListener('click', abandonCurrentMinigame);
}

/* ==========================================================================
   DELEGADOR GLOBAL DE EVENTOS (INTERCEPTOR UNIFICADO)
   ========================================================================== */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button, [role="button"]');
  if (!btn) return;

  const id = btn.id || '';
  const text = (btn.textContent || '').toUpperCase();

  // [CAMBIO] El botón Reiniciar de la cabecera pide confirmación antes de borrar la partida
  if (id === 'resetGameBtn') {
    showResetConfirm();
    return;
  }

  if (
    ['restartGameBtn', 'retryGameBtn', 'resetHeaderBtn', 'resetGameHeaderBtn', 'resetBtn'].includes(id) ||
    text.includes('REINICIAR') || text.includes('REINTENTAR')
  ) {
    resetGame();
    showCover();   // [0.087b] vuelve la pantalla de título
  }

  if (
    ['closeTraperoBtn', 'closeTraperoShopBtn', 'declineTraperoBtn'].includes(id) ||
    (btn.closest('#traperoModal, #traperoShopModal') && (text.includes('RECHAZAR') || text.includes('CERRAR') || text.includes('VOLVER') || text.includes('SALIR')))
  ) {
    closeTraperoShop();
  }
});

// [0.087b] Al tocar la portada: clic + melodía ascendente de dungeon synth
let coverTemplate = null;
function attachCoverClose(cover) {
  cover.addEventListener('click', () => {
    cover.style.opacity = '0';
    setTimeout(() => cover.remove(), 450);
    try { audio.init(); audio.playClick(0.8); audio.playIntro(); } catch (e) {}
    try { requestGameFullscreen(); } catch (e) {}   // [0.088]
  }, { once: true });
}

// [0.085] Arte del marco: marquesinas laterales, retratos de las tiendas y portada de inicio
(function initArtFrame() {
  if (!ART_ON) return;
  const setBg = (id, src) => { const el = document.getElementById(id); if (el && src) el.style.backgroundImage = `url('${src}')`; };
  setBg('marqueeL', ASSETS.marquesinaIzq);
  setBg('marqueeR', ASSETS.marquesinaDer);
  document.body.classList.add('art-on');
  const portrait = (id, src) => {
    const el = document.getElementById(id);
    if (el && src) el.innerHTML = `<img src="${src}" alt="" style="image-rendering:pixelated;width:100%;height:100%;object-fit:contain">`;
  };
  portrait('merchantPortrait', ASSETS.duende.base);
  portrait('traperoPortrait', ASSETS.trapero.base);

  const cover = document.getElementById('coverScreen');
  if (cover && DATOS_JUEGO.GRAFICOS.MOSTRAR_PORTADA) {
    coverTemplate = cover.cloneNode(true);
    cover.style.backgroundImage = `url('${ASSETS.portada}')`;
    cover.classList.remove('hidden');
    attachCoverClose(cover);
  } else if (cover) {
    cover.remove();
  }
})();

// INICIALIZACIÓN DE LA PARTIDA
generateScreenChests();
updateUI();
updateMuteButton();

// [CAMBIO] Guardado: si hay una partida guardada, se ofrece continuarla
(function initSave() {
  const data = readSave();
  if (data && data.state && data.state.chestsOpened > 0) {
    showResumePrompt(data);
  } else {
    autosaveEnabled = true;
  }
})();

/* ==========================================================================
   [0.090] El antiguo bloque DEV (DEV_CONFIG y botón "cofre 79") desaparece: ahora todo está en el MODO TEST del menú del engranaje.
   applyDevStart queda vacía para no romper las llamadas que existían.
   ========================================================================== */
function applyDevStart() {}

/* ==========================================================================
   [0.087] SONIDO DE INTERFAZ Y MISCELÁNEA
   ========================================================================== */
// Clic suave en los botones que no tenían sonido (se salta los que ya suenan y el interior de los puzles)
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('button, [role="button"]');
  if (!btn || btn.disabled) return;
  if (btn.id === 'openChestBtn' || btn.id === 'openActiveChestBtn' || btn.id === 'muteBtn') return;
  if (btn.closest('#minigameModal') || btn.closest('#multiChestGrid')) return;
  if (btn.id && btn.id.indexOf('ability') === 0) return;
  audio.init();
  if (audio.lastSound && performance.now() - audio.lastSound < 80) return;
  audio.playUiClick();
});

// Terminal digital: el historial se desplaza hacia arriba con cada línea para que "ACCESO CONCEDIDO" siempre se vea
(function () {
  const h = document.getElementById('hackHistory');
  if (!h || !window.MutationObserver) return;
  new MutationObserver(() => { h.scrollTop = h.scrollHeight; }).observe(h, { childList: true, subtree: true, characterData: true });
})();


/* ==========================================================================
   [0.087b] AVISOS "+N" DE LLAVES (esquina inferior derecha)
   ========================================================================== */
const KEY_TOAST_STYLE = {
  picks:    { icon: 'fa-key',         color: '#fbbf24' },
  proPicks: { icon: 'fa-screwdriver', color: '#34d399' },
  usb:      { icon: 'fa-microchip',   color: '#22d3ee' },
  valves:   { icon: 'fa-faucet',      color: '#fb7185' }
};
// [0.090] Efectos de pantalla compartidos: sacudida del marco y destello de color
function screenShake(px = 6, ms = 400) {
  const f = document.getElementById('gameFrame');
  if (!f || !f.animate) return;
  const n = Math.max(4, Math.round(ms / 40)), kf = [];
  for (let i = 0; i < n; i++) { const k = 1 - i / n; kf.push({ transform: `translate3d(${((Math.random() * 2 - 1) * px * k).toFixed(1)}px,${((Math.random() * 2 - 1) * px * k).toFixed(1)}px,0)` }); }
  kf.push({ transform: 'translate3d(0,0,0)' });
  try { f.animate(kf, { duration: ms, easing: 'linear' }); } catch (e) {}
}
function flashScreen(color = 'rgba(255,0,0,.4)', ms = 500) {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;inset:0;z-index:10040;pointer-events:none;background:${color};opacity:1;transition:opacity ${ms}ms ease-out`;
  uiHost().appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '0'; }));
  setTimeout(() => el.remove(), ms + 100);
}
function modalVisible(id) { const e = document.getElementById(id); return !!(e && !e.classList.contains('hidden')); }
// [0.089] Compara las llaves con la última lectura y apunta ganancias (+N) y gastos (-N). Solo la tienda del Duende queda excluida.
function trackKeyGains() {
  if (TEST_SERIES.active) { keysBaseline = null; keyToastQueue.length = 0; return; }   // [0.091] el Modo test no genera avisos de llaves
  const cur = { picks: STATE.picks, proPicks: STATE.proPicks, usb: STATE.usb, valves: STATE.valves };
  if (!keysBaseline) { keysBaseline = cur; return; }
  const inDuendeShop = modalVisible('merchantModal') || specialShopOpen;
  Object.keys(cur).forEach(k => {
    const d = cur[k] - keysBaseline[k];
    if (d !== 0 && !inDuendeShop) {
      const ex = keyToastQueue.find(q => q.k === k && Math.sign(q.d) === Math.sign(d));
      if (ex) ex.d += d; else keyToastQueue.push({ k, d });
    }
  });
  keysBaseline = cur;
}
function showKeyToast(k, d, done) {
  const host = uiHost();
  const st = KEY_TOAST_STYLE[k] || KEY_TOAST_STYLE.picks;
  const neg = d < 0;
  const cfgK = DATOS_JUEGO.AVISOS_LLAVES || {};
  const visibleMs = keyToastQueue.length ? (cfgK.DURACION_RAPIDA_MS || 800) : (cfgK.DURACION_MS || 1450);
  const el = document.createElement('div');
  // Esquina superior derecha, justo bajo la fila de cartas (donde está el contador de cofres)
  let topPx = 150;
  try {
    const row = (document.getElementById('loopCounterDisplay') || document.getElementById('abilityAutoBtn') || {}).parentElement;
    const fr = host.getBoundingClientRect();
    if (row) topPx = Math.round(row.getBoundingClientRect().bottom - fr.top + 10);
    const lc = document.getElementById('loopCounterDisplay');
    if (lc && !lc.classList.contains('hidden')) topPx = Math.round(lc.getBoundingClientRect().bottom - fr.top + 10);
  } catch (e) {}
  // [0.089b] z-index 10050: por encima de modales (z-50), tiendas, banners (9999) y recibo (10001); antes el banner del Trato Injusto tapaba el +N
  el.style.cssText = `position:absolute;right:14px;top:${topPx}px;z-index:10050;pointer-events:none;display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:12px;background:${neg ? 'rgba(69,10,10,.92)' : 'rgba(2,6,23,.88)'};border:2px solid ${neg ? '#ef4444' : st.color};color:${st.color};font:800 18px 'Outfit',sans-serif;opacity:0;transform:translateY(-14px);transition:opacity .25s ease,transform .25s ease`;
  el.innerHTML = `<span>${neg ? '-' : '+'}${Math.abs(d)}</span><i class="fa-solid ${st.icon}"></i>`;
  host.appendChild(el);
  audio.init(); if (neg) audio.playKeySpend(); else audio.playKeyPickup();
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; }, visibleMs);
  setTimeout(() => { el.remove(); done(); }, visibleMs + 300);
}
// Los avisos salen de uno en uno. Con ESPERAR_PANTALLA_LIBRE:true esperan a que no haya ninguna pantalla encima.
setInterval(() => {
  if (keyToastBusy || !keyToastQueue.length) return;
  const cfgK = DATOS_JUEGO.AVISOS_LLAVES || {};
  if (document.getElementById('resumeGameModal') || document.getElementById('coverScreen')) return;
  if (cfgK.ESPERAR_PANTALLA_LIBRE) {
    const blockers = ['lootModal', 'dialogueModal', 'levelUpModal', 'merchantModal', 'traperoShopModal', 'traperoModal', 'unfairDealModal', 'gameOverModal', 'minigameModal'];
    if (blockers.some(modalVisible) || document.getElementById('duendeReceiptModal')) return;
  }
  const q = keyToastQueue.shift();
  keyToastBusy = true;
  showKeyToast(q.k, q.d, () => { keyToastBusy = false; });
}, 250);

// [0.089] Pitido suave mientras las cartas AUTO / DUENDE palpitan: uno solo para ambas, se calla en pantallas encima y tras unas repeticiones
let cardBeepCount = 0;
// [0.089b] Zumbido legendario: suena mientras el cofre seleccionado sea legendario; se calla al empezar el puzle o con el silencio
(function () {
  const cfg = DATOS_JUEGO.ZUMBIDO_LEGENDARIO || {};
  if (!cfg.ACTIVAR) return;
  setInterval(() => {
    if (!audio.ctx) return;
    const a = STATE.screenChests && STATE.screenChests[STATE.activeChestIdx];
    const on = !!(a && a.rarity && a.rarity.id === 'legendario') && a !== humHoldChest && !isLootProcessing && !minigameInProgress && !modalVisible('minigameModal') && !modalVisible('gameOverModal') && !document.getElementById('coverScreen');
    audio.setLegendHum(on, cfg);
  }, 250);
})();
(function () {
  const cfg = DATOS_JUEGO.PITIDO_CARTAS || {};
  if (!cfg.ACTIVAR) return;
  setInterval(() => {
    const pulsing = ['abilityAutoBtn', 'abilitySummonDuendeBtn'].some(id => { const e = document.getElementById(id); return !!(e && e.classList.contains('card-pulse')); });
    if (!pulsing) { cardBeepCount = 0; return; }
    if (cfg.MAX_REPETICIONES && cardBeepCount >= cfg.MAX_REPETICIONES) return;
    if (!mainScreenFree() || minigameInProgress || rotateBlocked) return;   // [0.089b] se pausa con banners/ventanas y se reanuda después
    if (!audio.ctx) return;
    audio.playCardBeep(); cardBeepCount++;
  }, cfg.CADA_MS || 2000);
})();

/* ==========================================================================
   [0.087b] PORTADA: se vuelve a mostrar al reiniciar la partida
   ========================================================================== */
function showCover() {
  if (document.getElementById('coverScreen') || !coverTemplate) return;
  const c = coverTemplate.cloneNode(true);
  c.style.opacity = '1';
  c.classList.remove('hidden');
  c.style.backgroundImage = `url('${ASSETS.portada}')`;
  uiHost().appendChild(c);
  attachCoverClose(c);
}


/* ==========================================================================
   [0.088] VERSIÓN VISIBLE, AVISO "GIRA EL MÓVIL" Y PANTALLA COMPLETA
   ========================================================================== */
(function initVersionTag() {
  const el = document.getElementById('versionTag');
  if (el) el.textContent = 'v' + (DATOS_JUEGO.VERSION || '');
})();

// Aviso de girar: solo pantalla táctil + apaisada + poca altura (nunca en PC). El juego se pausa mientras está visible.
let rotateBlocked = false;
(function initRotateNotice() {
  const mq = window.matchMedia ? window.matchMedia('(orientation: landscape) and (pointer: coarse) and (max-height: 520px)') : null;
  const notice = document.getElementById('rotateNotice');
  if (!mq || !notice) return;
  const apply = () => {
    rotateBlocked = mq.matches;
    document.documentElement.classList.toggle('rotate-block', rotateBlocked);
    if (rotateBlocked) {
      const cfg = DATOS_JUEGO.AVISO_GIRAR || {};
      const list = cfg.FRASES || [];
      const t = document.getElementById('rotateTitle'); if (t) t.textContent = cfg.TITULO || '';
      const m = document.getElementById('rotateText'); if (m && list.length) m.textContent = list[Math.floor(Math.random() * list.length)];
    }
  };
  (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply));
  apply();
})();

// Pantalla completa (solo táctil y si el navegador lo permite). Se pide al tocar la portada; el botón sirve para volver a entrar.
function fullscreenSupported() {
  const d = document.documentElement;
  return !!(d.requestFullscreen || d.webkitRequestFullscreen) && !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
}
function isFullscreenNow() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
function requestGameFullscreen() {
  if (!fullscreenSupported() || isFullscreenNow()) return;
  const d = document.documentElement;
  try {
    const p = (d.requestFullscreen || d.webkitRequestFullscreen).call(d);
    const lockPortrait = () => { try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(() => {}); } catch (e) {} };
    if (p && p.then) p.then(lockPortrait).catch(() => {}); else lockPortrait();
  } catch (e) {}
}
(function initFullscreenButton() {
  const btn = document.getElementById('fsBtn');
  if (!btn || !fullscreenSupported()) return;
  btn.classList.remove('hidden');
  const icon = () => { btn.innerHTML = isFullscreenNow() ? '<i class="fa-solid fa-compress"></i>' : '<i class="fa-solid fa-expand"></i>'; };
  icon();
  document.addEventListener('fullscreenchange', icon);
  document.addEventListener('webkitfullscreenchange', icon);
  btn.addEventListener('click', () => {
    audio.init(); audio.playClick(0.6);
    if (isFullscreenNow()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
    else requestGameFullscreen();
  });
})();

// SHA-256 en JS puro (mismo resultado que hashlib); se usa para comprobar la clave del Modo test sin guardarla en claro
function sha256hex(str) {
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes = []; for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i) & 0xff);
  const l = bytes.length; bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
  const hi = Math.floor(l * 8 / 4294967296), lo = (l * 8) >>> 0;
  bytes.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < bytes.length; o += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) w[i] = ((bytes[o + 4 * i] << 24) | (bytes[o + 4 * i + 1] << 16) | (bytes[o + 4 * i + 2] << 8) | bytes[o + 4 * i + 3]) >>> 0;
    for (let i = 16; i < 64; i++) { const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0; }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g), t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h = [(h[0] + a) >>> 0, (h[1] + b) >>> 0, (h[2] + c) >>> 0, (h[3] + d) >>> 0, (h[4] + e) >>> 0, (h[5] + f) >>> 0, (h[6] + g) >>> 0, (h[7] + hh) >>> 0];
  }
  return h.map(x => ('00000000' + x.toString(16)).slice(-8)).join('');
}
// Huella de una secuencia de flechas (U/D/L/R): sal + 2000 rondas de SHA-256
function testKeyHash(seq, salt) {
  let h = sha256hex(salt + seq);
  for (let i = 0; i < 2000; i++) h = sha256hex(h + salt);
  return h;
}


/* ==========================================================================
   [0.090] MENÚ DE OPCIONES (engranaje), ESTADÍSTICAS Y MODO TEST
   ========================================================================== */
(function () {
  const css = document.createElement('style');
  css.textContent = `
    @keyframes chalkIn { from { clip-path: inset(0 100% 0 0); opacity:.2 } to { clip-path: inset(0 0 0 0); opacity:1 } }
    @keyframes keyShake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-9px) } 40% { transform: translateX(8px) } 60% { transform: translateX(-6px) } 80% { transform: translateX(4px) } }
    @keyframes tmBlink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
    .jm-chalk { font-family: 'VT323', monospace; color: #eef3ea; text-shadow: 0 0 3px rgba(255,255,255,.45), 1px 1px 0 rgba(0,0,0,.35); }
    .jm-chalk-row { animation: chalkIn .45s ease-out both; }
    .jm-shake { animation: keyShake .45s ease-in-out; }
    .tm-root { font-family: 'VT323', monospace; color: #e8e8e8; background: #000; letter-spacing: .02em; }
    .tm-root::after { content:''; position:absolute; inset:0; pointer-events:none; background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0, rgba(255,255,255,.035) 1px, transparent 1px, transparent 3px); }
    .tm-row { display:flex; align-items:center; gap:6px; padding:2px 6px 2px 20px; position:relative; min-height:42px; font-size:23px; cursor:pointer; }
    .tm-row.sel { background: rgba(255,255,255,.07); }
    .tm-row.sel::before { content:'▶'; color:#ff2a2a; position:absolute; left:3px; top:50%; transform:translateY(-50%); font-size:19px; }
    .tm-lbl { flex:1; min-width:0; }
    .tm-val { min-width:78px; text-align:center; color:#ffe14a; }
    .tm-val.off { color:#8a8a8a; }
    .tm-arr { width:44px; height:38px; border:1px solid #666; background:#111; color:#fff; font-size:20px; line-height:1; display:flex; align-items:center; justify-content:center; user-select:none; touch-action:manipulation; }
    .tm-arr:active { background:#333; }
    .tm-btn { flex:1; height:46px; border:2px solid #aaa; background:#0a0a0a; color:#fff; font-family:'VT323',monospace; font-size:23px; letter-spacing:.06em; }
    .tm-btn:active { background:#2a2a2a; }
    .tm-btn.go { border-color:#39e75f; color:#39e75f; }
    .tm-btn.warn { border-color:#ff5a5a; color:#ff5a5a; }
  `;
  document.head.appendChild(css);

  // ---- utilidades ----
  const host = () => uiHost();
  function overlay(id, z) {
    const old = document.getElementById(id); if (old) old.remove();
    const el = document.createElement('div');
    el.id = id;
    el.className = 'fixed inset-0 flex items-center justify-center p-5 font-sans';
    el.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:' + (z || 10020);
    host().appendChild(el);
    return el;
  }
  function close(id) { const e = document.getElementById(id); if (e) e.remove(); }
  AudioEngine.prototype.playChalk = function () {
    if (!this.ctx || this.muted) return;
    const prev = this._bus; this._bus = this.busSmall || null;
    try { [0, 0.09, 0.2].forEach((d, i) => { this._noise(0.07 + i * 0.01, 0.05, d, 3000 + i * 600); this._tone(2300 + i * 300, 1800, 0.04, 'triangle', 0.015, d); }); } finally { this._bus = prev; }
  };
  AudioEngine.prototype.playTestDenied = function () {
    if (!this.ctx || this.muted) return;
    const prev = this._bus; this._bus = this.busSmall || null;
    try { this._tone(140, 90, 0.2, 'square', 0.12); this._tone(120, 80, 0.25, 'square', 0.1, 0.12); } finally { this._bus = prev; }
  };

  // ---- confirmación genérica ----
  function confirmBox(title, text, yesLabel, onYes) {
    const o = overlay('confirmModal', 10040);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    o.innerHTML = `
      <div class="bg-slate-900 border-2 border-rose-700/70 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center flex flex-col items-center gap-3">
        <div class="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500 flex items-center justify-center text-2xl text-rose-400"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <h3 class="text-xl font-black text-rose-300 font-retro">${title}</h3>
        <p class="text-xs text-slate-300">${text}</p>
        <button id="cfmYes" class="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 active:from-rose-500 text-white font-black text-sm rounded-xl shadow-lg cursor-pointer">${yesLabel}</button>
        <button id="cfmNo" class="w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cancelar</button>
      </div>`;
    o.querySelector('#cfmYes').addEventListener('click', () => { close('confirmModal'); onYes(); });
    o.querySelector('#cfmNo').addEventListener('click', () => close('confirmModal'));
  }

  // ---- menú de opciones ----
  window.openOptionsMenu = function () {
    audio.init();
    const o = overlay('optionsModal', 10020);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    const b = (id, icon, label, cls) => `<button id="${id}" class="w-full py-3 ${cls || 'bg-slate-800 active:bg-slate-700 text-slate-200'} font-extrabold text-xs rounded-xl border border-slate-600/60 flex items-center justify-center gap-2 cursor-pointer"><i class="fa-solid ${icon}"></i> ${label}</button>`;
    o.innerHTML = `
      <div class="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 w-full max-w-xs shadow-2xl flex flex-col gap-2.5">
        <h3 class="text-center text-2xl font-black text-amber-300 font-retro tracking-wide mb-1"><i class="fa-solid fa-gear"></i> OPCIONES</h3>
        ${b('optStats', 'fa-chart-simple', 'ESTADÍSTICAS', 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white')}
        ${b('optList', 'fa-trophy', 'LOGROS', 'bg-gradient-to-r from-amber-800 to-amber-700 text-white')}
        ${b('optAch', 'fa-trophy', 'RESETEAR LOGROS')}
        ${b('optCnt', 'fa-eraser', 'RESETEAR CONTADORES')}
        ${b('optNew', 'fa-rotate-left', 'EMPEZAR DE NUEVO', 'bg-rose-950/80 active:bg-rose-900 text-rose-200')}
        ${b('optTest', 'fa-flask', 'MODO TEST', 'bg-slate-950 text-slate-400')}
        <button id="optClose" class="mt-1 w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cerrar</button>
      </div>`;
    const q = id => o.querySelector('#' + id);
    q('optClose').addEventListener('click', () => close('optionsModal'));
    q('optStats').addEventListener('click', () => { close('optionsModal'); openStatsBoard(); });
    q('optList').addEventListener('click', () => { close('optionsModal'); openAchievementsList(); });
    q('optNew').addEventListener('click', () => { close('optionsModal'); showResetConfirm(); });
    q('optAch').addEventListener('click', () => { close('optionsModal'); confirmBox('¿RESETEAR LOGROS?', 'Se borrarán los logros desbloqueados en este navegador. La partida no se toca.', 'SÍ, BORRAR LOGROS', () => { clearAchievements(); showPersistentFeedback('🏆 Logros reseteados.'); }); });
    q('optCnt').addEventListener('click', () => { close('optionsModal'); confirmBox('¿RESETEAR CONTADORES?', 'Se pondrá a cero el apartado ACUMULADO de las estadísticas. La partida no se toca.', 'SÍ, PONER A CERO', () => { lifeStats = blankStats(); lifeStatsDirty = true; saveLifeStats(); showPersistentFeedback('🧮 Contadores acumulados a cero.'); }); });
    q('optTest').addEventListener('click', () => { close('optionsModal'); openTestKeyGate(); });
  };
  (function () {
    const btn = document.getElementById('optionsBtn');
    if (btn) btn.addEventListener('click', () => window.openOptionsMenu());
  })();

  // ---- estadísticas: pizarra con tiza ----
  window.openStatsBoard = function () {
    audio.init(); try { audio.playChalk(); } catch (e) {}
    const o = overlay('statsModal', 10020);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    const C = STATE.stats || blankStats(), L = lifeStats;
    const pz = (S, t) => { const q = S.puz[t], tot = q.ok + q.fail; return tot ? `<span>${q.ok}/${tot}</span> <span style="font-size:15px;opacity:.85">${Math.round(q.ok * 100 / tot)}%</span>` : '—'; };
    const rows = [
      ['COFRES ABIERTOS', C.chests, L.chests],
      ['NIVEL MÁXIMO', C.maxLevel, L.maxLevel]
    ];
    if (Math.max(C.maxLoop, L.maxLoop, STATE.currentLoop || 1) >= 2) rows.push(['BUCLE MÁXIMO', C.maxLoop, L.maxLoop]);   // el bucle solo se nombra a partir del segundo
    rows.push(['ORO GANADO', C.goldEarned, L.goldEarned], ['ORO GASTADO', C.goldSpent, L.goldSpent], ['GANZÚAS ROTAS', C.picksBroken, L.picksBroken], ['MEJOR RACHA', C.bestStreak, L.bestStreak]);
    rows.push(['#H', 'PUZLES SUPERADOS']);
    [['lockpick', 'MADERA'], ['tumbler', 'ACERO'], ['hack', 'DIGITAL'], ['pipe', 'VAPOR']].forEach(([t, n]) => rows.push([n, pz(C, t), pz(L, t)]));
    const html = rows.map((r, i) => r[0] === '#H'
      ? `<div class="jm-chalk jm-chalk-row" style="animation-delay:${i * 70}ms;font-size:19px;text-align:center;margin-top:8px;border-top:2px dashed rgba(238,243,234,.35);padding-top:6px;letter-spacing:.12em">${r[1]}</div>`
      : `<div class="jm-chalk jm-chalk-row" style="animation-delay:${i * 70}ms;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr);gap:5px;font-size:19px;line-height:1.25;white-space:nowrap;border-bottom:1px dotted rgba(238,243,234,.18)"><span style="opacity:.92">${r[0]}</span><span style="text-align:right;color:#ffe9a8">${r[1]}</span><span style="text-align:right;color:#bfe9ff">${r[2]}</span></div>`).join('');
    o.innerHTML = `
      <div style="width:100%;max-width:23rem;background:#5b3a1e;border:3px solid #3c2412;border-radius:14px;padding:10px;box-shadow:0 10px 40px rgba(0,0,0,.7), inset 0 0 0 2px #7a5230">
        <div style="background:radial-gradient(ellipse at 30% 20%, #2a3c34 0, #1b2a24 60%, #15211c 100%);border-radius:6px;padding:14px 12px 12px;box-shadow:inset 0 0 28px rgba(0,0,0,.65)">
          <div class="jm-chalk jm-chalk-row" style="font-size:30px;text-align:center;letter-spacing:.14em;margin-bottom:2px">ESTADÍSTICAS</div>
          <div class="jm-chalk" style="display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr);gap:5px;font-size:15px;opacity:.9;margin:6px 0 4px;border-bottom:2px solid rgba(238,243,234,.4);padding-bottom:3px"><span></span><span style="text-align:right;color:#ffe9a8">PARTIDA<br>ACTUAL</span><span style="text-align:right;color:#bfe9ff">ACUMULADO</span></div>
          ${html}
        </div>
        <button id="statsClose" class="mt-3 w-full py-2.5 bg-amber-700/90 active:bg-amber-600 text-amber-50 font-extrabold text-xs rounded-xl cursor-pointer" style="border:1px solid #c69a5a">CERRAR</button>
      </div>`;
    o.querySelector('#statsClose').addEventListener('click', () => close('statsModal'));
    [0.25, 0.7, 1.2].forEach(d => setTimeout(() => { if (document.getElementById('statsModal')) try { audio.playChalk(); } catch (e) {} }, d * 1000));
  };

  // ---- [0.091] lista de logros desbloqueados ----
  window.openAchievementsList = function () {
    audio.init(); try { audio.playUiClick(); } catch (e) {}
    const o = overlay('achievementsModal', 10020);
    o.className += ' bg-slate-950/90 backdrop-blur-md';
    const all = (DATOS_JUEGO.LOGROS && DATOS_JUEGO.LOGROS.LISTA) || [];
    const got = all.filter(l => achievementsUnlocked[l.id]).sort((a, b) => achievementsUnlocked[a.id] - achievementsUnlocked[b.id]);
    const rowsHtml = got.length ? got.map(l => `
        <div style="display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:12px;background:rgba(2,6,23,.7);border:1px solid rgba(245,158,11,.35)">
          <div style="font-size:26px;line-height:1">${l.icono || '🏆'}</div>
          <div style="min-width:0"><div class="font-retro" style="color:#fcd34d;font-size:19px;letter-spacing:.06em;line-height:1.1">${l.titulo}</div><div style="color:#cbd5e1;font-size:12px;line-height:1.25">${l.descripcion || ''}</div></div>
        </div>`).join('') : `<div style="text-align:center;color:#94a3b8;font-size:13px;padding:18px 6px">Aún no has desbloqueado ningún logro.</div>`;
    o.innerHTML = `
      <div class="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 w-full max-w-xs shadow-2xl flex flex-col gap-2.5" style="max-height:86vh">
        <h3 class="text-center text-2xl font-black text-amber-300 font-retro tracking-wide"><i class="fa-solid fa-trophy"></i> LOGROS</h3>
        <div style="text-align:center;color:#94a3b8;font-size:11px;margin-top:-4px">${got.length} desbloqueado${got.length === 1 ? '' : 's'}</div>
        <div style="display:flex;flex-direction:column;gap:7px;overflow-y:auto;min-height:0">${rowsHtml}</div>
        <button id="achClose" class="mt-1 w-full py-2.5 bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cerrar</button>
      </div>`;
    o.querySelector('#achClose').addEventListener('click', () => close('achievementsModal'));
  };

  // ---- clave de flechas del Modo test ----
  let keyFails = 0, keyLockUntil = 0;
  window.openTestKeyGate = function () {
    audio.init();
    const cfg = DATOS_JUEGO.MODO_TEST || {};
    const len = cfg.LONGITUD || 6;
    const o = overlay('testKeyModal', 10040);
    o.className += ' bg-black/90';
    o.innerHTML = `
      <div id="tkBox" class="tm-root" style="position:relative;width:100%;max-width:18rem;border:2px solid #777;padding:16px 14px;text-align:center">
        <div style="font-size:26px;color:#ffe14a;letter-spacing:.1em">CLAVE</div>
        <div id="tkDots" style="font-size:28px;letter-spacing:.35em;margin:10px 0 12px;min-height:34px"></div>
        <div style="display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(3,56px);gap:6px;justify-content:center">
          <span></span><button class="tm-arr tk" data-k="U" style="width:64px;height:56px">▲</button><span></span>
          <button class="tm-arr tk" data-k="L" style="width:64px;height:56px">◀</button><span></span><button class="tm-arr tk" data-k="R" style="width:64px;height:56px">▶</button>
          <span></span><button class="tm-arr tk" data-k="D" style="width:64px;height:56px">▼</button><span></span>
        </div>
        <button id="tkBack" class="tm-btn" style="margin-top:14px;width:100%;flex:none">VOLVER</button>
      </div>`;
    let seq = '';
    const dots = () => { o.querySelector('#tkDots').textContent = '●'.repeat(seq.length) + '○'.repeat(len - seq.length); };
    dots();
    const press = k => {
      if (performance.now() < keyLockUntil) { try { audio.playTestDenied(); } catch (e) {} return; }   // bloqueado tras fallar
      seq += k; dots(); try { audio.playUiClick(); } catch (e) {}
      if (seq.length < len) return;
      const ok = testKeyHash(seq, cfg.SAL || '') === cfg.HUELLA;
      seq = '';
      if (ok) { keyFails = 0; document.removeEventListener('keydown', onKey, true); close('testKeyModal'); try { audio.playUnlockFanfare('normal'); } catch (e) {} openTestMenu(); return; }
      keyFails++;
      keyLockUntil = performance.now() + Math.min(60000, 1500 * Math.pow(2, keyFails - 1));   // 1,5 s, 3 s, 6 s... hasta 60 s
      try { audio.playTestDenied(); } catch (e) {}
      const box = o.querySelector('#tkBox'); box.classList.remove('jm-shake'); void box.offsetWidth; box.classList.add('jm-shake');
      dots();
    };
    const onKey = e => {
      const m = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' }[e.key];
      if (!m) return; e.preventDefault(); e.stopPropagation(); press(m);
    };
    document.addEventListener('keydown', onKey, true);
    o.querySelectorAll('.tk').forEach(b => b.addEventListener('click', () => press(b.dataset.k)));
    o.querySelector('#tkBack').addEventListener('click', () => { document.removeEventListener('keydown', onKey, true); close('testKeyModal'); });
  };

  // ---- menú de servicio (estilo arcade) ----
  const TM_PAGES = [
    { title: 'AJUSTES DE PARTIDA', rows: [
      { id: 'chest', label: 'IR AL COFRE', kind: 'num', min: 1, max: 100, def: 78 },
      { id: 'loop', label: 'BUCLE', kind: 'list', opts: [1, 2, 3] },
      { id: 'level', label: 'NIVEL', kind: 'num', min: 1, max: 30, def: 5 },
      { id: 'gold', label: 'ORO (GP)', kind: 'num', min: 0, max: 9999, step: 50, def: 500 },
      { id: 'picks', label: 'GANZÚAS', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'proPicks', label: 'PINES DE ACERO', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'usb', label: 'LLAVES USB', kind: 'num', min: 0, max: 99, def: 20 },
      { id: 'valves', label: 'VÁLVULAS', kind: 'num', min: 0, max: 99, def: 20 }
    ] },
    { title: 'CARTAS Y EXTRAS', rows: [
      { id: 'ab_auto', label: 'CARTA AUTO', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_double', label: 'CARTA x2', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_shield', label: 'CARTA ESCUDO', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_reveal', label: 'CARTA REVELAR', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_riskPot', label: 'CARTA APUESTA', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_perdedor', label: 'CARTA PERDEDOR', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'ab_summonDuende', label: 'CARTA DUENDE', kind: 'num', min: 0, max: 9, def: 3 },
      { id: 'curse', label: 'MALDICIÓN (COFRES)', kind: 'num', min: 1, max: 30, def: 10 },
      { id: 'clearAch', label: 'BORRAR LOGROS', kind: 'bool' }
    ] },
    { title: 'PROBAR UN PUZLE (SOLO)', puzzle: true, rows: [
      { id: 'pType', label: 'PUZLE', kind: 'list', opts: ['MADERA', 'ACERO', 'DIGITAL', 'VAPOR'], always: true },
      { id: 'pVar', label: 'VARIANTE', kind: 'list', opts: ['RANDOM', '1x1', '1x2', '1x3', '1x4', '2x1', '2x2', '2x3', '2x4', '3x1', '3x2', '3x3', '3x4'], always: true }
    ] }
  ];
  const tmVals = { pType: 'MADERA', pVar: 'RANDOM' };
  function fmtVal(r) {
    const v = tmVals[r.id];
    if (r.kind === 'bool') return v ? 'ON' : 'OFF';
    if (v === undefined || v === null) return 'OFF';
    return String(v);
  }
  function stepVal(r, dir, fast) {
    const v = tmVals[r.id];
    if (r.kind === 'bool') { tmVals[r.id] = dir > 0; return; }
    if (r.kind === 'list') {
      const i = (v === undefined || v === null) ? -1 : r.opts.indexOf(v);
      let n = i + dir;
      if (r.always) n = (n + r.opts.length) % r.opts.length;
      else if (n < 0) { tmVals[r.id] = null; return; }
      else n = Math.min(r.opts.length - 1, n);
      tmVals[r.id] = r.opts[n]; return;
    }
    const st = (r.step || 1) * (fast ? 5 : 1);
    if (v === undefined || v === null) { if (dir > 0) tmVals[r.id] = r.def; return; }
    const n = v + dir * st;
    if (n < r.min) { tmVals[r.id] = (v === r.min || dir < 0) ? null : r.min; return; }
    tmVals[r.id] = Math.min(r.max, n);
  }
  function applyTestCheats() {
    const v = tmVals; let any = false;
    const set = (cond, fn) => { if (cond) { fn(); any = true; } };
    set(v.loop != null, () => { STATE.currentLoop = v.loop; });
    set(v.chest != null, () => { window.goToChest(v.chest); });
    set(v.level != null, () => { STATE.level = v.level; STATE.xp = 0; STATE.xpNext = getXpForLevel(v.level); STATE.chestsAtLevelUp = Math.max(0, STATE.chestsOpened - 3); STATE.chestsOpened = Math.max(STATE.chestsOpened, 3); });
    set(v.gold != null, () => { STATE.gold = v.gold; });
    ['picks', 'proPicks', 'usb', 'valves'].forEach(k => set(v[k] != null, () => { STATE[k] = v[k]; }));
    ['auto', 'double', 'shield', 'reveal', 'riskPot', 'perdedor', 'summonDuende'].forEach(k => set(v['ab_' + k] != null, () => { STATE.abilities[k] = v['ab_' + k]; }));
    set(v.curse != null, () => { STATE.cursedChestsLeft = v.curse; });
    set(!!v.clearAch, () => { clearAchievements(); });
    if (any) {
      statsPaused = true; statsGoldPrev = null;   // una partida con trucos no cuenta para las estadísticas
      Object.keys(tmVals).forEach(k => { if (k !== 'pType' && k !== 'pVar') tmVals[k] = (k === 'clearAch') ? false : null; });
      generateScreenChests(); keysBaseline = null; keyToastQueue.length = 0; updateUI();   // [0.091] sin avisos por los ajustes de test
      showPersistentFeedback('🛠️ [MODO TEST] Ajustes aplicados. Esta partida ya no cuenta para las estadísticas.');
    }
    return any;
  }
  let tmPage = 0, tmCursor = 0, tmKeyHandler = null;
  window.openTestMenu = function () {
    audio.init();
    const o = overlay('testMenuModal', 10040);
    o.style.padding = '0';
    o.innerHTML = `<div class="tm-root" style="position:relative;width:100%;height:100%;display:flex;flex-direction:column;padding:10px 8px;overflow-y:auto">
      <div style="text-align:center;color:#ffe14a;font-size:26px;letter-spacing:.1em;line-height:1">— MODO TEST —</div>
      <div style="text-align:center;color:#999;font-size:17px;margin-bottom:6px">JOMC v${DATOS_JUEGO.VERSION} · <span id="tmPg"></span></div>
      <div id="tmRows" style="flex:1"></div>
      <div id="tmNote" style="color:#8fd6ff;font-size:17px;min-height:42px;padding:4px 6px"></div>
      <div style="display:flex;gap:6px;margin-top:4px"><button class="tm-btn" id="tmNext">NEXT PAGE ▶</button><button class="tm-btn go" id="tmGo">VALIDAR</button></div>
      <div style="display:flex;gap:6px;margin-top:6px"><button class="tm-btn warn" id="tmExit">SALIR</button></div>
    </div>`;
    const rowsEl = o.querySelector('#tmRows');
    const draw = () => {
      const pg = TM_PAGES[tmPage];
      o.querySelector('#tmPg').textContent = `PAGE ${tmPage + 1}/${TM_PAGES.length} · ${pg.title}`;
      tmCursor = Math.min(tmCursor, pg.rows.length - 1);
      rowsEl.innerHTML = pg.rows.map((r, i) => `<div class="tm-row ${i === tmCursor ? 'sel' : ''}" data-i="${i}"><span class="tm-lbl">${r.label}</span><span class="tm-arr" data-d="-1">◀</span><span class="tm-val ${(fmtVal(r) === 'OFF') ? 'off' : ''}">${fmtVal(r)}</span><span class="tm-arr" data-d="1">▶</span></div>`).join('');
      o.querySelector('#tmGo').textContent = pg.puzzle ? 'LANZAR PUZLE' : 'VALIDAR';
      o.querySelector('#tmNote').textContent = pg.puzzle ? 'Se prueba SOLO este puzle, en serie, con herramientas infinitas. VARIANTE = bucle x rareza (1x3 = bucle 1, épico). Se sale desde la barra superior.' : 'Los ajustes activados se aplican UNA vez a la partida en curso. OFF = no tocar.';
      // flechas: pulsación y mantener
      rowsEl.querySelectorAll('.tm-row').forEach(rowEl => {
        const i = +rowEl.dataset.i, r = pg.rows[i];
        rowEl.addEventListener('click', e => { if (e.target.closest('.tm-arr')) return; tmCursor = i; draw(); try { audio.playUiClick(); } catch (x) {} });
        rowEl.querySelectorAll('.tm-arr').forEach(a => {
          let tm = null, iv = null, n = 0;
          const stop = () => { clearTimeout(tm); clearInterval(iv); };
          const act = () => { n++; stepVal(r, +a.dataset.d, n > 12); const vEl = rowEl.querySelector('.tm-val'); vEl.textContent = fmtVal(r); vEl.classList.toggle('off', fmtVal(r) === 'OFF'); };
          a.addEventListener('pointerdown', e => { e.preventDefault(); tmCursor = i; rowsEl.querySelectorAll('.tm-row').forEach((x, j) => x.classList.toggle('sel', j === i)); try { audio.playUiClick(); } catch (x) {} act(); tm = setTimeout(() => { iv = setInterval(act, 80); }, 420); });
          ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => a.addEventListener(ev, stop));
        });
      });
    };
    draw();
    o.querySelector('#tmNext').addEventListener('click', () => { tmPage = (tmPage + 1) % TM_PAGES.length; tmCursor = 0; draw(); try { audio.playUiClick(); } catch (e) {} });
    const exit = () => { if (tmKeyHandler) document.removeEventListener('keydown', tmKeyHandler, true); tmKeyHandler = null; close('testMenuModal'); };
    o.querySelector('#tmExit').addEventListener('click', exit);
    o.querySelector('#tmGo').addEventListener('click', () => {
      const pg = TM_PAGES[tmPage];
      if (pg.puzzle) { exit(); startTestSeries(tmVals.pType, tmVals.pVar); return; }
      if (applyTestCheats()) exit();
      else { o.querySelector('#tmNote').textContent = 'No hay ningún ajuste activado (todo en OFF).'; try { audio.playTestDenied(); } catch (e) {} }
    });
    // teclado (PC): ↑↓ elegir fila, ←→ cambiar valor, Enter valida
    tmKeyHandler = e => {
      const pg = TM_PAGES[tmPage];
      if (e.key === 'ArrowUp') tmCursor = (tmCursor + pg.rows.length - 1) % pg.rows.length;
      else if (e.key === 'ArrowDown') tmCursor = (tmCursor + 1) % pg.rows.length;
      else if (e.key === 'ArrowLeft') stepVal(pg.rows[tmCursor], -1, e.shiftKey);
      else if (e.key === 'ArrowRight') stepVal(pg.rows[tmCursor], 1, e.shiftKey);
      else if (e.key === 'Enter') { o.querySelector('#tmGo').click(); return; }
      else return;
      e.preventDefault(); e.stopPropagation(); draw();
    };
    document.addEventListener('keydown', tmKeyHandler, true);
  };

  /* ---- Puzles en serie (Modo test): un puzle concreto, repetido; al acabar (éxito o error) sale el siguiente ---- */
  const JUEGO_TIPO = { MADERA: 'wooden', ACERO: 'piston', DIGITAL: 'cyber', VAPOR: 'hydraulic' };
  window.startTestSeries = function (typeName, variant) {
    if (TEST_SERIES.active) return;
    const snap = { state: {}, chests: STATE.screenChests, idx: STATE.activeChestIdx, autosave: autosaveEnabled, statsPaused };
    SAVE_KEYS.forEach(k => { try { snap.state[k] = JSON.parse(JSON.stringify(STATE[k])); } catch (e) { snap.state[k] = STATE[k]; } });
    Object.assign(TEST_SERIES, { active: true, typeId: JUEGO_TIPO[typeName] || 'wooden', typeName, variant, snap, n: 0, ok: 0, fail: 0 });
    autosaveEnabled = false; statsPaused = true;
    makeSeriesBar();
    testPuzzleNext();
  };
  function makeSeriesBar() {
    const old = document.getElementById('testSeriesBar'); if (old) old.remove();
    const bar = document.createElement('div');
    bar.id = 'testSeriesBar';
    bar.style.cssText = "position:absolute;top:4px;left:50%;transform:translateX(-50%);z-index:10045;display:flex;gap:6px;align-items:center;background:rgba(0,0,0,.88);border:1px solid #39e75f;color:#39e75f;font:17px 'VT323',monospace;padding:2px 6px;border-radius:6px;white-space:nowrap";
    bar.innerHTML = `<span id="tsInfo"></span><button id="tsExit" style="border:1px solid #ff5a5a;color:#ff5a5a;background:#000;padding:0 8px;font:inherit">SALIR</button>`;
    uiHost().appendChild(bar);
    bar.querySelector('#tsExit').addEventListener('click', stopTestSeries);
  }
  function updateSeriesBar(label) {
    const i = document.getElementById('tsInfo'); if (!i) return;
    i.textContent = `TEST ${TEST_SERIES.typeName} · ${label} · #${TEST_SERIES.n} ✔${TEST_SERIES.ok} ✘${TEST_SERIES.fail}`;
  }
  window.testPuzzleNext = function () {
    if (!TEST_SERIES.active) return;
    let loop, rar;
    const v = TEST_SERIES.variant;
    if (v === 'RANDOM') { loop = 1 + Math.floor(Math.random() * 3); rar = 1 + Math.floor(Math.random() * 4); }
    else { loop = +v[0]; rar = +v[2]; }
    TEST_SERIES.n++;
    const type = DATOS_JUEGO.COFRES.ESTANDAR.find(t => t.id === TEST_SERIES.typeId);
    STATE.currentLoop = loop; STATE.level = Math.max(STATE.level, 6);
    STATE.chestsOpened = Math.max(STATE.chestsOpened, 20);
    STATE.picks = STATE.proPicks = STATE.usb = STATE.valves = 99;
    STATE.abilities.auto = 0; STATE.activeShield = false; STATE.riskModeActive = false; STATE.cursedChestsLeft = 0;
    STATE.screenChests = [{ type, rarity: CHEST_RARITIES[rar - 1] }]; STATE.activeChestIdx = 0;
    isLootProcessing = false; minigameInProgress = false; puzzleToolPaid = null;
    updateChestSelectionUI(); updateUI();
    updateSeriesBar(`${loop}x${rar}`);
    setTimeout(() => { if (TEST_SERIES.active) openActiveChest(); }, 350);
  };
  window.testPuzzleResult = function (ok) {
    if (!TEST_SERIES.active) return;
    minigameInProgress = false; stopMinigameTimer(); hideAllMinigameUI(); isLootProcessing = false;
    if (ok) TEST_SERIES.ok++; else TEST_SERIES.fail++;
    flashScreen(ok ? 'rgba(57,231,95,.28)' : 'rgba(255,60,60,.3)', 500);
    updateSeriesBar(ok ? 'SUPERADO' : 'FALLADO');
    whenBannerClosed(() => setTimeout(() => { if (TEST_SERIES.active) testPuzzleNext(); }, 650));
  };
  window.stopTestSeries = function () {
    if (!TEST_SERIES.active) return;
    const s = TEST_SERIES.snap;
    TEST_SERIES.active = false;
    minigameInProgress = false; stopMinigameTimer(); hideAllMinigameUI(); isLootProcessing = false; puzzleToolPaid = null; puzzleStat = null;
    SAVE_KEYS.forEach(k => { STATE[k] = s.state[k]; });
    STATE.screenChests = s.chests; STATE.activeChestIdx = s.idx;
    autosaveEnabled = s.autosave; statsPaused = s.statsPaused; statsGoldPrev = null;
    const bar = document.getElementById('testSeriesBar'); if (bar) bar.remove();
    keysBaseline = null; keyToastQueue.length = 0;   // [0.091] al volver, sin avisos de llaves
    updateChestSelectionUI(); updateUI();
  };
})();


/* ==========================================================================
   [0.090] GANZÚA TÁCTIL: arrastrar el anillo del dial gira la ganzúa; mantener el centro prueba girar (como el botón).
   El deslizador y el botón de abajo se conservan. Con dos dedos se puede girar y mantener a la vez.
   ========================================================================== */
(function () {
  const glow = document.getElementById('proximityGlow');
  if (!glow) return;
  const dial = glow.parentElement;
  dial.style.touchAction = 'none'; dial.style.userSelect = 'none'; dial.style.position = 'relative';
  const roles = {};   // pointerId -> 'ring' | 'center'
  const ringDrag = {};   // pointerId -> { x0, a0 } (arrastre relativo del anillo)
  let hintRing = null, hintCenter = null;
  const fake = { preventDefault() {} };
  function geom(e) {
    const r = dial.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    return { dist: Math.hypot(dx, dy) / R, ang: Math.atan2(dx, -dy) * 180 / Math.PI };
  }
  function setAngle(a) {
    if (lpState.isBreaking || lpState.isCompleted) return;
    a = Math.max(-85, Math.min(85, a));
    lpState.angle = a;
    const sl = document.getElementById('angleSlider'); if (sl) sl.value = a;
    const ro = document.getElementById('angleReadout'); if (ro) ro.textContent = `${Math.round(a)}°`;
    updateLockpickProximityVisuals();
  }
  const clampAng = t => (t > 85 && t <= 180) ? 85 : (t < -85 && t >= -180) ? -85 : t;
  dial.addEventListener('pointerdown', e => {
    if (lpState.isBreaking || lpState.isCompleted) return;
    const g = geom(e);
    const role = g.dist < 0.58 ? 'center' : 'ring';
    roles[e.pointerId] = role;
    if (role === 'ring') ringDrag[e.pointerId] = { x0: e.clientX, a0: lpState.angle };   // [0.091] control relativo
    try { dial.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault();
    if (role === 'center') { startTension(fake); if (hintCenter) { hintCenter.remove(); hintCenter = null; } }
    else { if (hintRing) { hintRing.remove(); hintRing = null; } }
  });
  dial.addEventListener('pointermove', e => {
    if (roles[e.pointerId] !== 'ring') return;
    const dr = ringDrag[e.pointerId]; if (!dr) return;
    // [0.091] grados por píxel = los de la barra (170° a lo ancho de la barra) x SENSIBILIDAD_ANILLO
    const sl = document.getElementById('angleSlider');
    const slW = (sl && sl.getBoundingClientRect().width) || (dial.getBoundingClientRect().width * 1.6) || 250;
    const sens = ((DATOS_JUEGO.GANZUA_TACTIL || {}).SENSIBILIDAD_ANILLO) || 0.8;
    setAngle(dr.a0 + (e.clientX - dr.x0) * (170 / slW) * sens);
  });
  const up = e => {
    const role = roles[e.pointerId]; delete roles[e.pointerId]; delete ringDrag[e.pointerId];
    if (role === 'center') stopTension(fake);
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => dial.addEventListener(ev, up));

  // Ayuda visual en las primeras veces de madera (por partida)
  window.showLockTouchHints = function () {
    [hintRing, hintCenter].forEach(h => { if (h) h.remove(); }); hintRing = hintCenter = null;
    const hc = (DATOS_JUEGO.AYUDAS || {}).GANZUA_TACTIL; if (!hc) return;
    STATE.hintUses = STATE.hintUses || {};
    const used = STATE.hintUses.lockTouch || 0;
    if (used >= hc.VECES) return;
    STATE.hintUses.lockTouch = used + 1;
    const mk = html => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:5'; d.innerHTML = html; dial.appendChild(d); return d; };
    hintRing = mk(`
      <svg viewBox="0 0 192 192" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible">
        <defs><marker id="lhArr" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#fbbf24"/></marker></defs>
        <path d="M92,14 A82,82 0 0 0 26,66" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#lhArr)" style="animation:tmBlink 1.4s steps(2) infinite"/>
        <path d="M100,14 A82,82 0 0 1 166,66" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#lhArr)" style="animation:tmBlink 1.4s steps(2) infinite"/>
      </svg>
      <div style="position:absolute;left:0;right:0;bottom:-2px;text-align:center;font:700 11px Outfit,sans-serif;color:#fbbf24;text-shadow:0 1px 2px #000">${hc.ANILLO}</div>`);
    hintCenter = mk(`
      <div style="position:absolute;left:50%;top:50%;width:112px;height:112px;margin:-56px 0 0 -56px;border:3px dashed #34d399;border-radius:50%;animation:cardPulse 1.1s ease-in-out infinite"></div>
      <div style="position:absolute;left:0;right:0;top:50%;margin-top:34px;text-align:center;font:700 10px Outfit,sans-serif;color:#34d399;text-shadow:0 1px 2px #000">${hc.CENTRO}</div>`);
  };

  // [0.091] Háptica del punto dulce: la intensidad sube al acercarse al punto dulce MÁS CERCANO (real o falso, sin distinguirlos).
  const hapCfg = (DATOS_JUEGO.GANZUA_TACTIL || {}).HAPTICA || {};
  if (hapCfg.ACTIVAR) {
    const touchVib = !!(navigator.vibrate && window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    let wasVib = false;
    setInterval(() => {
      const box = document.getElementById('lockpickContainer');
      const active = !!(box && !box.classList.contains('hidden')) && minigameInProgress && !lpState.isBreaking && !lpState.isCompleted;
      if (!active) { if (wasVib) { try { navigator.vibrate(0); } catch (e) {} wasVib = false; } return; }
      let d = Math.abs(lpState.angle - lpState.sweetSpot);
      (lpState.decoySpots || []).forEach(ds => { d = Math.min(d, Math.abs(lpState.angle - ds)); });
      const zone = hapCfg.ZONA_GRADOS || 35, tol = lpState.tolerance || 0;
      let r = d <= tol ? 1 : Math.max(0, 1 - (d - tol) / zone);
      r = Math.pow(r, hapCfg.CURVA || 1.6);
      if (r < 0.03) { if (wasVib) { try { navigator.vibrate(0); } catch (e) {} wasVib = false; } return; }
      const per = hapCfg.PERIODO_MS || 110;
      if (touchVib) {
        const on = Math.round((hapCfg.ON_MIN_MS || 6) + (per - (hapCfg.ON_MIN_MS || 6)) * r);
        try { navigator.vibrate(on); wasVib = true; } catch (e) {}
      } else {
        const px = (hapCfg.TEMBLOR_PX_MIN || 0.6) + ((hapCfg.TEMBLOR_PX_MAX || 3.2) - (hapCfg.TEMBLOR_PX_MIN || 0.6)) * r;
        screenShake(px, per);
      }
    }, (hapCfg.PERIODO_MS || 110));
  }
})();
