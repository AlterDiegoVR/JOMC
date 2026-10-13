// ==========================================================================
// JUST ONE MORE CHEST — script.js — VERSIÓN 0.085
// ==========================================================================
/* ==========================================================================
   JUST ONE MORE CHEST - ARCHIVO DE CONFIGURACIÓN Y BALANCE (DATOS_JUEGO)
   ========================================================================== */

const DATOS_JUEGO = {
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
    COFRE_Y_PCT: 0.50,           // altura del centro del cofre respecto al alto del marco
    ESCALA_UI_MAX: 1.6           // tope del zoom de la interfaz en pantallas grandes (HUD y tarjeta del cofre)
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
      VELOCIDAD_BASE_NORMAL: 0.48,
      VELOCIDAD_BASE_DIFICIL: 0.70,
      VELOCIDAD_LEGENDARIA: 0.85,
      BONO_MANO_FIRME: 1.5,    // [0.085] tolerancia extra por nivel de Mano Firme (antes 3)
      TOLERANCIA_NORMAL: 7,    // [0.085] ±% del carril (antes 15); la banda verde dibujada = zona de acierto real
      TOLERANCIA_DIFICIL: 4
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
          2: "Te he visto tantear. Apretar, soltar, apretar, soltar... ¿tan poco confías en tus manos? Cada duda tiene su precio: un treinta por ciento menos. Aprende a decidirte.",
          3: "Ese temblor en los dedos... ¿a quién crees que engañas? Cada vez que sueltas, el cofre lo sabe. Yo también. Treinta por ciento menos, y ya no queda nadie a quien reclamar."
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

    DUENDE_TIENDA_FRASES: {
      1: [
        "¡Bienvenido! Echa un ojo a mis herramientas de madera y ganzúas.",
        "El oro guardado no abre cofres. ¡Echa un vistazo a la mercancía!",
        "Tengo justo lo que necesitas para no quedarte atrancado hoy.",
        "¡Qué bien verte por aquí! Si necesitas cualquier cosa aquí estaré."
      ],
      2: [
        "¡Cosas de acero para manos expertas! Mira mis nuevos precios.",
        "¿Monedas por herramientas? El trato de siempre, sin engaños.",
        "Veo que le vas cogiendo el truco. Pasa y compra algo de calidad.",
        "El Trapero no debería estar aquí. Céntrate en mi tienda.",
        "Echa un ojo al Taller de Reciclaje, está abierto ahora"
      ],
      3: [
        "Cosas modernas para cofres digitales. Sin TRUCOS.",
        "El oro vuela aquí dentro, ¿tienes más?",
        "¿Que por qué no abro yo los cofres y cojo el Oro? No deberías hacer esas preguntas.",
        "¿Has traído más oro? Necesit... te ofrezco los mejores productos.",
        "¿Si nunca salgo de mi cofre? Calla y compra, amigo.",
        "Así que has hecho tratos con el Trapero, ¿eh? Tú mismo, ¿has traído oro?",
        "Las válvulas son caras, pero quedarse atascado sale más caro"
      ],
      4: [
        "Sigues aquí... me gusta tu fidelidad. Mira lo que me ha llegado.",
        "Tú me das oro, yo te doy supervivencia. Me necesitas.",
        "No preguntes de dónde saco los repuestos, dame ese reluciente ORO.",
        "Parece que llevas toda la vida aquí trayéndome precioso ORO.",
        "Chico, no toques el género si no vas a comprar, ¿vale?",
        "Al fin...solo tráeme un poco de oro más y podré largarme de aquí",
        "Aún queda ORO ahí fuera, humano, ¿a qué esperas?"
      ],
      5: [
        "¡Oro, oro, oro! Tú abres, yo vendo. ¡El ciclo perfecto!",
        "¡Praise the chest! Pasa a la tienda y gástate lo que llevas encima.",
        "Al fin... solo tráeme un poco de oro más y podré largarme de aquí.",
        "Aún queda ORO ahí fuera, humano, ¿a qué esperas?",
        "Ese ORO brilla como el ORO...Gástalo en mi tienda!"
      ]
    },

    DUENDE_FRASES: {
      1: [
        "¡Casi lo tienes! Toma esto, el siguiente cofre guarda algo grande.",
        "¡Estás cogiendo un ritmo excelente! Te regalo esto para que no pares.",
        "¡Sigue así! Cada cofre abierto te acerca a mayores tesoros."
      ],
      2: [
        "¡Impresionante racha! Toma esta herramienta, te la has ganado a pulso.",
        "¡Ni se te ocurra frenar ahora! Aquí tienes ayuda para abrir el siguiente.",
        "¡Eso es! El sonido de los cerrojos rompiéndose es música. ¡Sigue adelante!"
      ],
      3: [
        "¡Estás imparable! Te regalo esto, demuestra de qué estás hecho.",
        "¡Un empujoncito más! El próximo cofre puede tener mucho ORO. ¡Abre otro!",
        "¡No aflojes ahora que estás en lo mejor! Un regalo de la casa para ti."
      ],
      4: [
        "¡La casa invita! Solo recuérdalo cuando quieras deshacerte de tu ORO.",
        "¡Que nada te detenga! Te traigo supplies frescos para que continúes recolectando mi ORO.",
        "¡Un verdadero aventurero jamás se rinde! ¡Vamos, a por más ORO!",
        "¿El Trapero te ha regalado algo alguna vez? Tenlo en cuenta. Tu amigo el duende te cuida.",
        "Toma esto, la gloria te espera tras la siguiente tapa. No te quedes todo el ORO.",
        "¡Abre otro! Ya queda poco, necesito un poco más de ese ORO..."
      ],
      5: [
        "¡El tesoro definitivo está a tu alcance! No te detengas por nada. ¡AHORA NO!",
        "Toma, rápido, sigue abriendo cofres, estoy tan cerca... tan cerca...",
        "No te quedes ahí pasmado, toma y tráeme ese ORO."
      ]
    },

    DUENDE_DESBLOQUEOS: {
      nivel_2: "¡Eh, chico! A partir de ahora verás Cajas de Acero. Toma este Pin de muestra... a la primera invita la casa.",
      nivel_3: "¡Oigo chispas al fondo! Son Arcas Digitales. Prueba esta Llave USB, a ver si logras descifrar lo que ocultan.",
      nivel_5: "Huele a humo y aceite... Tuberías de vapor. Quédate con esta Válvula, presiento que la vas a necesitar muy pronto."
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
        "No entiendes nada, ¿verdad? Te propongo un trato.", "La primera herramienta siempre parece gratis.", "Mis tratos no son los mejores, en apariencia.",
        "Veo que aún tienes luz en los ojos.", "Guarda tu oro, pronto lo necesitarás más."
      ],
      2: [
        "Veo que has vuelto.", "Siempre vuelven.", "No confíes demasiado en el Duende.",
        "Él te vende la llave, yo te vendo la esperanza.", "Tengo tratos que no figuran en ningún libro."
      ],
      3: [
        "Ya llevas demasiados.", "Empiezas a parecerte a los otros.", "No me gusta esa mirada.",
        "El vicio del cerrojo te tiene atrapado.", "Acepta una maldición, total... ¿qué tienes que perder?",
        "Aún estás a tiempo.", "¿Por qué el duende no recoge él mismo el oro? Piénsalo.", "Todo el mundo quiere salir de aquí, de lo contrario has perdido."
      ],
      4: [
        "Voy a contarte algo. Yo también abría cofres.", "Creía que podía parar cuando quisiera.",
        "Ahora solo me quedan trozos de herramientas y tratos leoninos.", "No mires los cofres como un objetivo.", "Si no quieres salir, te convertirás en otro.",
        "Creo que ya es demasiado tarde, pero aún puedes volver atrás.", "Aquí solo puede salir uno cada vez. Te lo advertí."
      ],
      5: [
        "Escúchame.", "Todavía puede haber una salida.", "La única forma es volver al principio.",
        "Solo puede salir uno, no dejes que sea el Duende.", "Hay que romper el ciclo.", "Nunca eres rico si portas la losa de la CODICIA."
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
      COFRE_79_TRAPERO: "Aún hay una manera, pero debes hacerme caso.",
      COFRE_84_TRAPERO: "La próxima vez no le compres NADA al Duende. Es la ÚNICA forma.",
      COFRE_85_DUENDE: "¡Bienvenido! Echa un ojo a mi mercancía...",
      COFRE_86_TRAPERO: "¿Es que la codicia te ciega? Aún tienes UNA ÚLTIMA oportunidad...",
      COFRE_87_TRAPERO: "Sigue así. No le des el ORO.",
      COFRE_88_DUENDE: "No escuches a ese maldito Trapero...",
      COFRE_89_TRAPERO_CONDENA: "Tu codicia te ha condenado. Disfruta de tu prisión de cofres eterna.",
      COFRE_89_TRAPERO_PRECLIMAX: "Ya casi lo tienes, está fuera de sí. NO COMPRES.",
      COFRE_90_DUENDE: "Por favor, te haré descuento, pero tienes que traerme ese ORO..."
    },

    // 🟢 REACCIONES DEL DUENDE AL ELEGIR "NO COMPRAR NADA"
    REACCIONES_DUENDE_NO_COMPRAR: {
      85: "¡No seas tacaño! Necesito ese ORO...",
      88: "Maldito seas, estoy viendo tu ORO... ¡dame ese ORO!",
      90: "¡No sabes lo que estás haciendo, NO TIENES NI IDEA!",
      DEFAULT: "¡Tacaño! ¡El ORO es para gastar!",
      COMPRA_EXITOSA: "¡Sí! ¡Eso es! Dame más de tu precioso ORO..."
    },

    // 🟢 FRASES DE RECIBO DE LA TIENDA DEL DUENDE
    FRASES_RECIBO_DUENDE: {
      DEFAULT: "«¡Buena elección! Esas herramientas te mantendrán con vida un rato más.»",
      ALTO_ORO: "«¡Un placer hacer negocios! Vuelve pronto con más de ese reluciente ORO...»",
      SOLO_RECICLAJE: "«Veo que aprovechas todo el metal viejo. ¡Así se economiza en la mazmorra!»",
      CONTADOR_RESPUESTA: "Duende: «¿Y para qué quieres saber eso? Nunca se acaban»"
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
    ICONOS: [
      { nombre: "Telaraña", icono: "🕸️" },
      { nombre: "Muñeco Maldito", icono: "🧸" },
      { nombre: "Cráneo", icono: "💀" },
      { nombre: "Vela Negra", icono: "🕯️" },
      { nombre: "Libro Prohibido", icono: "📕" },
      { nombre: "Reloj Roto", icono: "⌛" }
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
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
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
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
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
    gain.connect(this.ctx.destination);
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
    gain.connect(this.ctx.destination);

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
    gain.connect(this.ctx.destination);
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
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.35);
    });
  }
}
const audio = new AudioEngine();

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
  roomThemeFilter: 'normal'
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
  if (isTrapLockpickActive()) showPersistentFeedback(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.ABANDONO);
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
  'roomDecorations', 'roomThemeFilter'
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
function isGameIdle() {
  if (isLootProcessing || minigameInProgress || STATE.eventQueue.length > 0) return false;
  const blockers = ['minigameModal', 'dialogueModal', 'lootModal', 'levelUpModal', 'merchantModal', 'traperoShopModal', 'traperoModal', 'unfairDealModal', 'gameOverModal'];
  for (const id of blockers) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) return false;
  }
  const overlays = ['duendeReceiptModal', 'diffuseEchoOverlay', 'resumeGameModal', 'resetConfirmModal'];
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
        <div class="flex justify-between"><span>Bucle:</span><span class="text-amber-400 font-bold">${s.currentLoop || 1}</span></div>
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
  cofres: {
    wooden: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACPElEQVR4nO2ZMU/CQBTHH8aljQZYWIiBRCCBhbgRNmYSWUj4Ck4mbHwENxInv4KJiwZnJomjLkACKsSwGBIkUTsZnFpPeO3dK9dWyP2mo7y++7/e3bt3LYBCoVAoFArFphISMdK1yMJrIW74Mt65+m0N2KAatbwsTVI5u3y02nbBohd1LbJo1PLQG88hFCvA8Ol5xeZw/w0Gkxmk41FhQevYO+kAALi+H6FB7gj3tqGsBKhrkUWlkAxAynpUCkk0V5BGsFpOWe3BZCZBljtYHTxIAV7dDq02ZS3JhtXBw5c1GORo+xIgNtrZRNhqe/kAAsuivfHcans53V0nmSBhdbAzAWOX4piyuAEALs6LQnYnpx2SX1YHOxMwSAGKkE2ErU77dw+y3ZORvgZ5T9RvfE0ypXoXSvWun12uFtvL5Y6m7aE3GsYH13m7mfvz2wzO7roTojqWC250DeYOfjPTy/QbdczarIuILxEd3dfV5YEGmI5HrWSROXI+prCwCcZu814ePbM/O8wjk5MO0wYLUOoa5CWYdjPn+xr0vZLBRtBLtv7AS9roq+UUqZpptaaClrrjv9lEGPqGOx2elmrDT2fh1Hc0bnQENkV5RTKLU/LiHbU8CVDkfOe0nVCC580ATwKkTDvMVmY9KzVAypMHADguJmV2jyL1wEt98jedEcleVAeL67dqVGS+d6HoQLeJwWRmCcrE8BtFBC/bYPeI+uHpsPOz9ZWMCnDT2foAbb8P+i1EBiJffBWKf8YPvyPgfvyZ+ZsAAAAASUVORK5CYII=',
    piston: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAACSElEQVR4nO2ZMUzCQBRAv8YFJgYNg4kDMKglRhcGCCHOJoRBE8ImK4MbM6Nxc3B1kzCYSEicjTE6sGgMGAcgLh0aGJx0s07U9npt7x/XWvTe1P5/d/2//f33fwsgkUgkEolEMq8ssAyKRmK634bw8PH57mm/4wCzU416RZRNQmmcNI1jJ2epwmgkppeKZRgMRz6ZJp5ev0t1cvE3jAmSJVIQjcT0tJKxyDRNDcwgDPH4qnGcVjLQ63d18inaHGRZLAyw3nRUiO7vpbiMEQnWBuYnCABweT1w1ff6XePYHOai5Cw2kAhPMs2dTaq8VCwLGY9FuIOVxxeqvN1pCRmPBRWiXpDhJFrOw59PMigHsS+4H2BtYA7RsG72XjA5GLZNHoOtOA1ra8QKU6mWVjKQSibmqpsAsBYIU/5fN+EF7S4B/Oxdfus1TbXkBPKchMlBMlxXlq0LjifWDNuoV0DZWDPODw6PLXpyPgmpz2XzxvVz2byrbSRMDvK8ixdXbzZZKplwfEJutDst4P3CgNoHZ90unAwcT6xr16oFWwSY55rrVK+iPLQNLy0CNE2FVDKBWmeusijPTebqJmghFCSYXpG7XaKFUBhBh6ioTntWjnafmcahs2i704Lt9dm+dPOGuDnBnN5sMc3xJYuend/aNmQSnhAfDEfoLEp1UNNUdP9nHl+rFuDp9ctR7zXfTU9z0G2u0G8yQXD/cIcaT+0H3WpFsu6cMp3jt96N8US19YNoB8MMzcG5qmR4cPw/GLQhImD54yuRhIxvQb/wBK1ppfUAAAAASUVORK5CYII=',
    cyber: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAAChElEQVR4nO2ZQUvjQBTH/5WCJOshh0pWahE8qlAWxNN+gGUP0ttKP4HsyYMfw4Mn8ROIR/EgnsXTIoiw61FY1qKlPaTQNuwpHurUaTIzSZrXJFPyO4WXtP3/572Zl5kCBQW5ppS1gGk5XK97Xz9/wu3rAEdPD9r6UNL8se+FPbOQhpAsKQzqTmFQd8pRHjINK3S1yitSg7ypxu5eOmqmgOkcuo6wFwqDpmF5W5s7aLdbs9RGSqfbEpqMVKIM267SKUpAnIEPGDQNy1uuyI04tcp0qoiw/nWF8eVKFZ0uPH8WY2UQAJ6vr8bXjdPjwP2L/QNp3P8ZFlPF/VibOxGVjohtkMcvJExk4/Q4YIoNiChOAVkfjCKKSnQcEmWQITKnyia7JytRShIblGVOlS1+PrLrWZlN9VVtVllSQVKiUfGvsGnMyUDnZ33QtquBhmrbVfz+82vmooBgttlgqN6wRG8zqWYwDlTZjW1wK2ajzRphiWYhhIpIJSqbg3mn0w3qnfsd/dwbzO0qyiMqPYZqawckNCjaALfbLbI4z9mXDTTvHz92ILt7uLg8D9WoTYk27x8BfPTHKOYALoNJ2oNTqwh32lTxsDJUUQZG5n6urE3cuInxJbJjBKp4Eibm4MnLXwDvfZD8p7Ih0SIjexGgijNUqygwWcL+c1JtVtHVb9+FGtgh2OJ2Hauo83Fv6DolLfogMHmaJ+L/3cM40/xgkLQJ2VkpVTwJwgz2Bz30n3qhH7YxKi1+9esPemRxhmEsKXXwz/rRptFPy3jvZBqWN3SdkmlYXtiI5RXX7QMYzcHn6ysMXac0zqDs7yfdEe7odc4gq0KWMOn/g+lKo2Feq7BgrnkD284wDI7o9I8AAAAASUVORK5CYII=',
    hydraulic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAYAAABE1blzAAADwElEQVR4nO1ZS0gbURQ9lhIxCBWRkI0QWlGwISBCCW6FBulOWijSlVAodSW6KLMp3YgLS1eWQsGlCEJWlZBFSxdFghACQxQMaQlIIQSRtqQWLThdhDe+mXmf+bwZQ/Fsknnfe979vHtngAixs7VqRLkfANyIYpN6JW8AwNjYKICrIRoaCLl6JW/UK3mDkCPtonmyMV0DIiiPnF2j9vFB0BN0AR7qlbxxeFgzzdLt/wePX/TQc0cmZkOT0TdoswScmpO1q4Ty06lX8sbIxGwPEZanlZ2tVYNojjVetVxKEFRzYUTXUDQIWH2L+BHRLhlLa7Grfc4Ot1eBfXwYcHVa8b4BzwLouxvITM17l8gDTv/8kMrPHUCT2l5Mq5JJKR69qZr/eWSZjfG+AWN7MY2S3gpJNPV4/bHFJHkzis2LzRSzPZdshL63I9mO9w0YS9MJ3wtmM9a5PHKyPhkKtTPL89J0ghkrhBrMZhKmmRZqZ5gZ7ZVuTMbbhddibcvzynm/ZZxXbbqRBZAQpH2Qt6CMOCGWXl+2ti+sAbgkGhYC14MsckQrWqyN9PqygxzQITxXOTAPIIi5iqC84HUraGZqHvruhq+5XhBaFN18/4zbR5NLry9jE8Dc03eWMW59XgahBu2RSgVYmmNB5PNeICQoO0Gvm1UX1lyRE8GrVgP5oNfNWMEmbIT2Vs3uU37GyizEnlSwoJxgkPQrl2xYhJZZiJtc2ZGc+imNWEjfvQdAHE2BS+1V9/dUbOtIuJkEl6YTljSNBVm//U6zE7WbpRfN8/ZmVRTSe5C3WElvCUm+vH+Kkt4yifL87OLXocUURWuSPi9lnJRgSW8h+2Qe0D8w+0TzgI5mhOVS0upnojX/fr7AJIbM5/LgsUDyDiKpB4PWfcVmClqsjZXzfvMXALSTTrIuWl9ZFHUTsmXgXQs0KRqEsAhSDRabKRTXPgGIM3pT5unRpvV291S2LADg+VRnTZJ3vno47DDRyZMhYUm1ct4P7YRvrqGZ6J3b48L+r98OzP8kyPD8j9bSl+ZvaEn3ckgJ5pINX0FGJWgNaklnkSwy00g+gHqBCl+mEUm5VN3fc52p2K2iPHgs1JAWawuvC6GJzoz2ug4yMpDUzQ/s1wMBacvBJ0FV8EKOlcnkkg2U0bn3gEufKw8e46L23ZEs0OiKIEO/nhCtyTJFWcXBJFionaFQOzKfswLBgoCeH8brESBEE6XvuasEs1waH751FbIExsHRT0e51HX3oGr89wS53wejFkQF3HzxvcY1ugz/AA4RJPLfw44BAAAAAElFTkSuQmCC',
  },
  duende: {
    base: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABl0lEQVR4nOVVP0vDQBx9EUFxqVAoOKWD0EUrLiIuBQXBfgJBqM5Zi36I2qyd1c1PIAgKIkjIIlURCg65SSgUGpSCg5yDXExyf5JLWkR8S4/3u3vvd++uF+Bfw6q3qVVvU9Wc6azCaedOjUN8e3VfaqhloNO5tkGSuGwX2hGJsLiwLK2lMsgSTWqDPOIAYKiKqtshw+X9aURTaMCEVdmK8PL6yJlEDBqtGj07ujHYWEc8vI6NAcEZ6AonreUMCBlkMmm0apSQAcdzZ5BnB8BPVFKDuNGF7QEAdprlSD3Ox4UZtP7JhAwgikGFxOc63LlpFgOD+I4yGzCwSADgGW/5DVinplkEIO84KTLlU7FVXqKVQgnzzTlhfWiP0PP7uPKepDrCgrWySQGg5/dRKZQCnhkN7VHAhed0utec3li+BypM3EB4yO97n9+DTpQPRyOc3+VrE99BqlukQqZbFEbV3AgevwdyZ8g4GX4nIu+8Sh3XBwAcnswE/G1nFo7rR7jjgw+srxXguD52bcLpcQQTZ4t0f0UmfxtfGPO7GOVorNkAAAAASUVORK5CYII=',
    alegre: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABp0lEQVR4nOWWv0vDQBTHv9GCIkKUguB0HdzUioMiIhQUhPYvcKrOHVyCjg4da7s4dFY3/wARHARRSomDqLg59CZBCDWL4BSni4l395rrD0T8Lsm9y/t+8t7lkgD/WqVCNSgVqgF1Tapb46TXDvXDfHNxWws0ApjcuTGgk7muCuMWqTQzPa+dSwTopjWJAb2YA4BFTVJPh06X9ycxTyVAGFO9Venl9UmCxADFSi443b+2xLmJeTRPnAOKNTA17pQrATj3uoIUK7mAc0+KS2vQSwXAd6uEpArKrI0ya4fji1pLaxad+5mnBVBGnHsQbaDAUUmv6wM+GRvnnUxoxlga0T7nnYw2TwtQKQq5O7KxtNuKmVNSbrTSwnoAAM9rb2AsTRpw7mH2dgoAUH+4kvzIClLnwLg9jAlnTDn/XvtAygdgEx7k7UWMAIQgMU4iJUCUupGZS7QnVK0R6ssHh5LRX4VJa4QGXsHAAeQXDQCybDVc6EfesHQxnX6ngtZZNmi6PgBg73gkjN/UR9F0/VjscOcTK8s2mq6PrRqX/KSAMBdJpkcV5G/rC+AEtpNq1LYqAAAAAElFTkSuQmCC',
    enfadado: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABtElEQVR4nOVVu0oDQRQ9K4JiE0EIWCWFkCZGbERsFgwI5gsEIVrHMuhHxGxparXzCwKCQhAkpBEfCAGLnUoILGRRAhYyNs5mH3dmd5KIiKfZ4c6dc+6cO7MD/GtUSnVeKdW5Kmd6VOKkuVOTIN9a3ZMKagnoVK4tEEcu24W2RRSWFpelc4kERrEmscA45ABgqCZVp0OGy7uzACcpIIhV3lJ4eX2MiAQEyjWTnx+1DDHWIfevE2OA6IEucdzaiABjjpfYtGw0LVtK6J8v10zOmBPJifSAqqJp2diuZmNjwNAqqUBYSFRICfjjYWIBrZvMmAPKBhVif9eiQn8vnvFG2gMMdy52lOg90OlBGNIemAd5DgCZzIKSQFjWOnkyKiubHAAa99f0RQujmM3zXCqN+eocOd+3Bui6PVzZNLlUQCR33R5yqbQXF0J9a+DF/DlhcmBC74EKIz36YVCVKwXedz+/VwbjfmuS4ncsEpekmM2P9ZoBMccUAAqZDU/kgd0aspgMP24RqW5fFHi74wIADk9nvPhNYxbtjhuIHe9/YH0thXbHxY7FInyRgCAXi3S/lMjfxhdxJ9O0vy3spQAAAABJRU5ErkJggg==',
    codicia: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABuElEQVR4nOWVP0vDQBjGn4qguMRSKIhDMghdasWhIi4FC0L7CZyqc4QuRccOjrVZBDurm59AEBSKIKUO4p+l4JAbRCgUm6XgFAe52GvuLrm2UsRnSXjv7vnlfd+7C/CvZearrpmvurI508Mah507NQ7zrdUdIVAJoPLlyoAgc1EWyiXiaWlhWTgWCjBMaUIDRjEHgIhsULY7RLp6OGM8uQBqLKstT6/vzz4IAyhUMu75QT1C31XM+9fRd4DTA1XjoLU+ACGdoSCFSsYlpOOL+3owSgbAT6mEgEHQof4BACiTKDM+GB80plI6yYR0wCuDTIGAMokiXXQAALoe8+LpouPLiqdQ/4NcycClZQMA7o81pIs2ciUjzFJxDzJ7SRdgv5onWrL6yQvXS3pVZI2km9DimC/Ncce7Vg8tp41rm28uBJgrmy4AtJw2Elrci1NQ1+p5sf45tccbn5+QnDWSzHlYNGPM1nyrsbtJlMVYfjgyheqBTEE9+PUMJlsiAEjpG16zn8hdRBQTaTIZ2Bcpt9H8vn/2T2e8+G1tFo2mw8SOdj+xvqah0XSwbZHgc0DN6SLVJw/yt/UFPW7AtpV9LbgAAAAASUVORK5CYII=',
    conciliador: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABkklEQVR4nOVVMUvDQBh9EUFxqSAITskguGjFRcSloCC0v8CpOmcN+iNqszqrm79AEBxEkJBFUBEKDrlJKAQalIKDxOnOJnffJddWiviWJN93995977vLAf8abqOduo12qhszPSxx2bFT4yDf2zggBY0ETFZuLFBETlVhbJEKy0trZK6UwDDWlBYYhRwALF1StzsoXD+cZziVApxY560Kr29PkkhGoNmqpRfHtxZ/NyEfnMffAUUPTImL5koCjMWZgYzFYCyWyPLxZquWqsZJPRilAuDHKlIgL3TlRwCAuudk8vl4npjD6CRTdulQKDC4ctteIHMUSt0Hdc8RlgDAC95LkWsFuBV81RRhkWXaX8Wus5quVBYx780p8z2/j07SxU30TPKICviuUe2Gnt8HACHEv1XI80gWues74hx0ki5JRM35wFcmN5YLR4dSPdChqAe/XsFkLQKAqr0tGvjI7i0qRmEyFUSX1TQIEwDA0dmMiN+dziIIk0zs5PATW5sVBGGCfZ9JfFKAk/NJpk+VyN/GN9BYxFw5IhRJAAAAAElFTkSuQmCC',
    ira: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABu0lEQVR4nOVVu0oDQRQ9EUGxiSAErJJCSBMTbERsAgkI+gVW0cZm2xA/Ism0adKoYOEXLAgKIkhIIxqbgMVOJQQC2SZgNRYyk93MY3fWgIin2eU+zrlz751d4F/DOWoz56jNTDHLSYnjxi4tgvxg50QraCVgU7m1QBS57hTWLVJha3Nb64slkKQ1sQV+Qg4AKZPTtB063D5fhjiVApzY1FsV3j8GkkhIoNYss6vzhxR/tyEP5vF3QDEDW+KoXEmA0rEIdIkHl3hawqC/1iwzSsdSjDQDVRUu8XBYz0XagFmrtALzQrxClUDQPk/MYXWTKR1D1QYTIj/XvEKXeDhrfa9ttzFQtieRQBDdxsAm3CzAW5HNbgCQZzAfp4PxU1HNFVg+ncF6fU3pn5Aphv4Id96blkfpcEoVBgBDf4R8OiPsXGhCpsIWjOm83Et80hZx8iRQ5YoZiAt2PaukmivEEuPxTqnCOA+/F9IJVMfkmJBpqD1xchfyyzQh1haZkGiLgihm98UcXulTSmfT4Xda5N0UWa/vAwAaFyvC/thZRa/vh2yt00/s7abR6/s4JlTikwycnCfZPlUifxtfOxzb2SIsrgIAAAAASUVORK5CYII=',
  },
  trapero: {
    base: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABpUlEQVR4nGNgGAUEACOxCq3sA/4j848d3ECUXiZyDMclRpYF+AwixhKCFsjIKhBSghewEKPo4tkDWMX1jR0I6iUqDigBeC1ADuOleloMS/W0MNiE4oGoIGJgYGCIvnQNg61vLEZQ38AG0ZCwgKg4QE+Ob14/YxARlSLKAoI+ePL4AdxQcgD9g4jYQgybHmwlLP1S0dYVHf+3rugg2fUELcjSd/rPwMDAcPQGD8PRGzwMxw5uYDT48IlqFjAyMDAwVDVMQXF5W0MOo5eRPIZv4hwh9KL9qOIfeA0ZGBiwxwELAwMDw4H9ezBshmmCgTevnzFMOgNJ+29+QPLBsqx7DFHTlOBqtq7o+O8dUYFiCTwV7Z6hxfD60hYUDcSC6kwLBgYGBgZ0wxkYcKQicpIqAwPEB+hicB+8vrSFJMOWZd2D01HTIGJY8wEsFSEDYlORdvIjgmoYGRiICxLkAg5XYYczFTk4uqAIYktV5AIWBgYGhg/r1zFMu7gPbju5kYwNMDEwMKAYjgsgBwmxdQFeAPMFqTTRgJtH4D83j8B/UtiUe4sMAAAv4JzkqCMQ8wAAAABJRU5ErkJggg==',
    alerta: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABpElEQVR4nGNgGAUEACOxCq3sA/4j848d3ECUXiZyDMclRpYF+AwixhKCFsjIKhBSghewEKPo4tkDWMX1jR0I6iUqDhgYGBiW6mnh5ZNlATFhTEgN0T4gBmxd0fF/64oOFAuJtiD60jW8fFyAZB/cvbCBJPVEpSJkoGwQgFXcyj7gf+v0Exg5nCgL0JPjm9fPGEREpYhyEMEgevL4AdxQcgBVUhEsqWIrADGCiNhCjFhA1XyA1wJsmYQUgKt+YMrSd/rPwMDAcPQGD8PRGzwMxw5uYDT48IlcezAAIwMDA0NVwxQUl7c15DB6Gclj+CbOEUIv2o9p0LZzD7H6gIWBgYHhwP49GBIfeA1R+G9eP2OYdAaS9t/8gOSDZVn3GKKmKUFVPMTqA3gc7J6hxbAs6x5WRZQArKmInKSKSw/cgteXtpBkIMy3hHwNT0XIgNhUpJ38iKAaRgYG4oIEuYDDVdjhLCocHF1QBLGlKnIBCwMDA8OH9esYpl3cB7edmuUREwMDA4rhuABykBBbF+AFMF+QShMNuHkE/nPzCPwnhU25t8gAALcKnyLdKA9hAAAAAElFTkSuQmCC',
    amenaza: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABt0lEQVR4nO1Vv0tCURT+nrhp4FANoSSOBr3KJVrSaLKlMQxcmhL/gLDlTeIcIo0RJI4OORVoS1OCOURLIhUuOkhT22143cfTd9+9910RGvqWe97h/LjnO+fcB/xDAE3WcGf3kNi/Hx/qUr4+leBuOqUEvEAySYQJwpGoyIQLv4zRc7vF1OuJpNBXqgcA0M6mcbMed8gzJbBz/NrpgyWL+iBFEQAcd18csp5YFvpJU6QKX07fIwBQMMqkYJQJAFCdHW+dOvMUQaPB7cqikdcAk99wJIpG/YrpTKeIt9V+AGg177m3mB7H0XCAxaUVrg+F1YO7yziquZ7D4POjbwVVwdybbI3psHtrKWUfsml7Vi98rInZGH95uiUP1rSIDO2NdWsyqwI/ACRT+xPKopHXvNLkBtf5TW+tOhJkU+Z53ZzUjxc2AXAqYIE6UYyGA1w8/VL0bVJUzfWQqcQsm0atRA6OziaSSD92PJyfbgMApoMDLnugyn+jVnL4KVdAt96kydQx90A1AQCsnbwLbZQryFRi0BMx6/ZumP8P588ksD8Nsv8CLuioej2lEQiGSCAYIl7k2ctSwA+Q/qQamOZkSAAAAABJRU5ErkJggg==',
    sonrisa: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABwUlEQVR4nO1VMUgCYRT+Lty8wKEaoihqM1DLJVrSaKpFmsKgxSlpaIxanMIxIqSlJVCczEGnInXQqSAdwiWJCpdzkKa2azjuuPP+u//daU19y/t9vPe+e+99/y/wDw4EauDaekzW/27UiqTcMTfFrXyuCOwKUUi4BDOz87wQW3goQc2nKtMfDEe4uaQdDANbAv2MswE/sgG/6czbA2lEALDXejGdg+Epbh5pRK/PRaa/cH00GoLFUEwj0dudxPloCFQSluWBtINBOfakLiYmp0kE3A4+P960om7w6/fANCLqI8bKYb2wf3eTy/m0XM6nHX89lyAZ3JABoN4WUW+LaNSKQqj/NTICAQBOUpeGLz9LHQpbK3Ombvajir2pGP398WUA7B14AKBauTcxq0kqelIXF4+K9nvfyj3IJTuIZxa0mHI+LW/vHhtINBXdXfkhtUqGBCpOD1YBAIPFAQsVuZEqoHQw6NM6kFolR8VyyY5m4xnFx7wHqor0oKpoKfHOjREA2kj0D5zVY2epokh00+BkqcotPADQvy0g03zQ2N0umYUxAIbiVtCPhPpfYAu1C6eWDK/ok72iT3ZyHr4tF/gBJuSr5Ak9+SAAAAAASUVORK5CYII=',
    trato: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAABr0lEQVR4nGNgGAUEACOxCq3sA/4j848d3ECUXiZyDMclRpYF+AwixhKCFsjIKhBSghewEKPo4tkDWMX1jR0I6iUqDigBeC1ADuOleloMS/W0MNiE4oGoIGJgYGCIvnQNg61vLEZQ38AGETK4e2EDVppqFigbBGClCQGi4gA9Ob55/YxBRFSKKAsI+uDJ4wdwQ8kBNI3krSs6/mMEEbGFGC496KUs0fmAHMsYGJCCaOuKjv9bV3SQ7HoYOHZwAyO2OoIlS9/p/7SL+xiP3uCBK8zSd/p/QYCPbItgbO+DGyA1WlXDFBSXtzXkMHoZyWP4Js4RQi/aj2nwtnMPsdZwLAwMDAwH9u/BkPjAa4jCf/P6GcOkM5C0/+YHJB8sy7rHEDVNCariIVYfweNg9wwthmVZ97AqogRgzQeUJlWsFry+tIUkA2G+JeRrpix9JwybDT58IsoS7eRHBNUwMjAQFyTIBRyuwg5rPmBgYGBwcHRBEcSWqsgFLAwMDAwf1q9jmHZxH9x2ciIZF2BiYGBAMRwXQA4SYusCvADmC1JpogE3j8B/bh6B/6SwKfcWGQAA3Gyn91pVg1AAAAAASUVORK5CYII=',
  }
};
/* ASSETS-END */

// [0.085] Carga de imágenes y utilidades gráficas
const ART_ON = !!(DATOS_JUEGO.GRAFICOS && DATOS_JUEGO.GRAFICOS.ACTIVAR_ARTE);
const ART = {};
function loadArt(key, src) { const im = new Image(); im.src = src; ART[key] = im; }
if (ART_ON) {
  loadArt('celda', ASSETS.celda);
  Object.keys(ASSETS.cofres).forEach(k => loadArt('cofre_' + k, ASSETS.cofres[k]));
}
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

function renderRoom() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 20;

  let bgGradient;
  if (STATE.roomThemeFilter === 'sepia') {
    bgGradient = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width);
    bgGradient.addColorStop(0, '#2e1c0c');
    bgGradient.addColorStop(0.6, '#1a0e05');
    bgGradient.addColorStop(1, '#050200');
  } else if (STATE.roomThemeFilter === 'neon') {
    bgGradient = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width);
    bgGradient.addColorStop(0, '#022c22');
    bgGradient.addColorStop(0.6, '#061727');
    bgGradient.addColorStop(1, '#020617');
  } else if (STATE.paranoiaStage === 0) {
    bgGradient = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width);
    bgGradient.addColorStop(0, '#111827');
    bgGradient.addColorStop(0.6, '#0f172a');
    bgGradient.addColorStop(1, '#030712');
  } else {
    bgGradient = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width);
    bgGradient.addColorStop(0, '#450a0a');
    bgGradient.addColorStop(0.6, '#180202');
    bgGradient.addColorStop(1, '#000000');
  }
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // [0.085] Fondo de la celda (pixel art, escalado "cover") + tinte según el ambiente
  if (artReady('celda')) {
    const im = ART.celda;
    const sc = Math.max(canvas.width / im.naturalWidth, canvas.height / im.naturalHeight);
    const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(im, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    let tint = null;
    if (STATE.roomThemeFilter === 'sepia') tint = 'rgba(120,72,20,0.30)';
    else if (STATE.roomThemeFilter === 'neon') tint = 'rgba(0,150,110,0.22)';
    else if (STATE.paranoiaStage !== 0) tint = 'rgba(140,12,12,0.28)';
    if (tint) { ctx.fillStyle = tint; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  }

  STATE.roomDecorations.forEach(decor => {
    ctx.save();
    ctx.translate(decor.x, decor.y);
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
    ctx.restore();
  });

  const useArt = artReady('celda');
  if (!useArt) {
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 90, 160, 42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const activeChest = STATE.screenChests && STATE.screenChests[STATE.activeChestIdx];
  const chestImgKey = activeChest && activeChest.type ? 'cofre_' + activeChest.type.id : null;
  if (useArt && activeChest && activeChest.rarity && chestImgKey && artReady(chestImgKey)) {
    // [0.085] Cofre con sprite: brillo del color de rareza + sprite pixelado
    const g = DATOS_JUEGO.GRAFICOS;
    const im = ART[chestImgKey];
    const sc = Math.min((canvas.width * g.COFRE_ANCHO_PCT) / im.naturalWidth, (canvas.height * 0.24) / im.naturalHeight);
    const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    const ccx = canvas.width / 2, ccy = canvas.height * g.COFRE_Y_PCT;
    const bob = Math.sin(Date.now() * 0.002) * 2;
    const glowR = dw * 0.85 + Math.sin(Date.now() * 0.003) * 6;
    const glow = ctx.createRadialGradient(ccx, ccy, 8, ccx, ccy, glowR);
    glow.addColorStop(0, (activeChest.rarity.color || '#f59e0b') + (activeChest.rarity.id === 'normal' ? '33' : '88'));
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(ccx, ccy, glowR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(ccx, ccy + dh / 2 + 4, dw * 0.46, dh * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(im, ccx - dw / 2, ccy - dh / 2 + bob, dw, dh);
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

    for (let decor of STATE.roomDecorations) {
      if (!decor.used && Math.hypot(clickX - decor.x, clickY - decor.y) < decor.size + 14) {
        decor.used = true;
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

  const safeYTop = 210;
  const safeYBottom = h - 210;
  const midY = (safeYTop + safeYBottom) / 2;

  const anchorZones = [
    { x: 60, y: safeYTop },
    { x: w - 60, y: safeYTop },
    { x: 60, y: midY },
    { x: w - 60, y: midY },
    { x: 60, y: safeYBottom },
    { x: w - 60, y: safeYBottom }
  ];

  const spot = anchorZones[Math.floor(Math.random() * anchorZones.length)];

  STATE.roomDecorations.push({
    x: spot.x, y: spot.y, size: 28, 
    icono: chosenDecor.icono, 
    name: chosenDecor.nombre,
    descriptor: descriptor, color: '#f59e0b', used: false
  });

  return `${chosenDecor.icono} ${chosenDecor.nombre} — "${descriptor}"`;
}

function triggerSecretDecorationReward(decor) {
  const roll = Math.random() * 100;
  let msg = `Inspeccionaste ${decor.name}. "${decor.descriptor.toUpperCase()}"`;

  if (roll < 20) {
    const themes = ['sepia', 'neon', 'normal'];
    STATE.roomThemeFilter = themes[Math.floor(Math.random() * themes.length)];
    msg += " (¡El ambiente de la sala ha cambiado!)";
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
  else if (roll >= 90 && roll < 97) { STATE.valves += 1; msg += " (+1 Válvula hallada)"; }
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
          ${ART_ON && ASSETS.cofres[c.type.id] ? `<img src="${ASSETS.cofres[c.type.id]}" alt="" style="image-rendering:pixelated;width:44px;height:auto">` : '<i class="fa-solid fa-box text-sm"></i>'}
        `;
        btn.addEventListener('click', () => {
          audio.playClick(0.5);
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
    let toolTitle = "GANZÚAS";
    if (active.type.consumible === 'proPicks') toolTitle = "PINES DE ACERO";
    if (active.type.consumible === 'usb') toolTitle = "LLAVES USB";
    if (active.type.consumible === 'valves') toolTitle = "VÁLVULAS";

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
        reqEl.textContent = `REQUIERE: ${reqCount} ${toolTitle.slice(0, -1)}`;
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

function showPersistentFeedback(message) {
  const banner = document.getElementById('persistentFeedbackBanner');
  const txt = document.getElementById('feedbackText');
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
      speechBox.className = "w-full text-lg sm:text-xl font-mono leading-relaxed italic bg-rose-950/60 border border-rose-800/80 p-5 rounded-2xl shadow-inner text-center text-rose-200";
      closeBtn.className = "w-full py-4 bg-gradient-to-r from-rose-700 to-amber-700 active:from-rose-600 text-white font-extrabold text-sm rounded-2xl shadow-2xl border border-rose-500/40 cursor-pointer";
    } else {
      avatar.className = "w-14 h-14 rounded-2xl bg-purple-950 border border-purple-500 flex items-center justify-center text-2xl text-purple-400 shadow-xl";
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
    const src = ART_ON ? (isTrap ? ASSETS.trapero[mood] : ASSETS.duende[mood]) : null;
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

  note.style.left = `${Math.random() * 50 + 12}%`;
  note.style.top = `${Math.random() * 15 + 38}%`;

  note.addEventListener('click', () => {
    audio.playPaperRustle();
    note.classList.add('crumple-anim');
    setTimeout(() => note.remove(), 350);
  });

  container.appendChild(note);
}

/* ==========================================================================
   BOTÍN Y RECOMPENSAS
   ========================================================================== */

function triggerLootExplosion() {
  // 🟢 CERROJO ANTI-DUPLICACIÓN
  if (isLootProcessing) return;
  isLootProcessing = true;

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
      xpLines = [{ label: "🎨 Por Amor al Arte (0 XP)", val: "0 XP" }];
    }

    STATE.active2XMultiplier = false;
    STATE.gold += finalGp;
    STATE.xp += finalXp;

    let gpLinesHTML = gpLines.map(l => `<div class="flex justify-between items-center text-xs font-mono text-amber-200/90"><span>${l.label}</span><span class="font-bold text-amber-300">${l.val}</span></div>`).join('');
    let xpLinesHTML = xpLines.map(l => `<div class="flex justify-between items-center text-xs font-mono text-indigo-200/90"><span>${l.label}</span><span class="font-bold text-indigo-300">${l.val}</span></div>`).join('');

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
    if (lootModal) lootModal.classList.add('hidden');

    STATE.eventQueue = [];

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

    processNextQueuedEvent();
    generateScreenChests();

    if (!STATE.sequenceBroken && co >= 100 && co < seqConfig.COFRE_AUTO_OPEN_FIN) {
      setTimeout(() => {
        const btnOpen = document.getElementById('openChestBtn') || document.getElementById('openActiveChestBtn');
        if (btnOpen) btnOpen.click();
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
      if (active.type.consumible !== 'picks') {
        STATE[active.type.consumible] = Math.max(0, STATE[active.type.consumible] - reqCount);
      }

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
    globalPuzzleTimeLeft--;
    if (timerEl) timerEl.textContent = `⏱️ ${globalPuzzleTimeLeft}s`;

    if (globalPuzzleTimeLeft <= 0) {
      audio.playBreak();
      hideAllMinigameUI();
      showPersistentFeedback("⏱️ ¡TIEMPO AGOTADO! Fallo en el puzle.");
      if (isTrapLockpickActive()) showPersistentFeedback(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.TIEMPO);
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
  minigameInProgress = false;
  stopMinigameTimer();
  STATE.cleanStreak = 0;
  const active = STATE.screenChests[STATE.activeChestIdx];
  const reqCount = getRequiredToolCount(active.rarity);

  if (STATE.riskModeActive) {
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
    showPersistentFeedback("🛡️ ¡Tu ESCUDO te ha salvado! Herramientas intactas.");
    updateUI();
    return;
  }

  STATE[toolName] = Math.max(0, STATE[toolName] - reqCount);
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

function checkGameOver() {
  if (checkCanOpenAnyChestOnScreen()) return;

  if (STATE.salvageCurseActive && STATE.cursedChestsLeft > 0) {
    const goChests = document.getElementById('goChests'); if (goChests) goChests.textContent = STATE.chestsOpened;
    const goLvl = document.getElementById('goLevel'); if (goLvl) goLvl.textContent = STATE.level;
    const goModal = document.getElementById('gameOverModal'); if (goModal) goModal.classList.remove('hidden');
    clearSave();
  } else {
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
    const dealModal = document.getElementById('unfairDealModal');
    if (dealModal) dealModal.classList.remove('hidden');
  }
}

const acceptDealBtn = document.getElementById('acceptDealBtn');
if (acceptDealBtn) {
  acceptDealBtn.addEventListener('click', () => {
    const dealModal = document.getElementById('unfairDealModal');
    if (dealModal) dealModal.classList.add('hidden');
    
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
    const goChests = document.getElementById('goChests'); if (goChests) goChests.textContent = STATE.chestsOpened;
    const goLvl = document.getElementById('goLevel'); if (goLvl) goLvl.textContent = STATE.level;
    const goModal = document.getElementById('gameOverModal'); if (goModal) goModal.classList.remove('hidden');
    clearSave();
  });
}

function updateUI() {
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

    if (abilitiesBar && chestCounterEl.parentElement !== abilitiesBar) {
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
    } else {
      streakBadge.classList.add('hidden');
    }
  }

  const curseBadge = document.getElementById('curseBadge');
  if (curseBadge) {
    if (STATE.cursedChestsLeft > 0) {
      curseBadge.classList.remove('hidden');
      curseBadge.textContent = `MALDECIDO (${STATE.cursedChestsLeft})`;
      curseBadge.classList.add('cursor-pointer');
      if (!curseBadge.dataset.hasClickListener) {
        curseBadge.dataset.hasClickListener = 'true';
        curseBadge.addEventListener('click', () => {
          showPersistentFeedback(`💀 MALDECIDO: Sufres un -50% de ganancias en GP y XP durante los próximos ${STATE.cursedChestsLeft} cofres.`);
        });
      }
    } else {
      curseBadge.classList.add('hidden');
    }
  }

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

    const activePerks = perkList.filter(p => p.active);
    const activePerksCount = activePerks.length;
    const isCompact = activePerksCount >= 4;

    activePerks.forEach(p => {
      const badge = document.createElement('span');
      if (p.isTorpeza) {
        badge.className = "bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-700 cursor-pointer select-none text-xs font-mono transition-transform hover:scale-105";
      } else {
        badge.className = "bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700 cursor-pointer select-none text-xs font-mono transition-transform hover:scale-105";
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

  updateShopResourcesUI();
  scheduleSave();
}

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
  if (mBar) mBar.innerHTML = resHTML;
  if (tBar) tBar.innerHTML = resHTML;
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
        triggerPickBreakSequence(DATOS_JUEGO.MINIJUEGOS.LOCKPICK.MENSAJES_TRAMPA.ROTURA);
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
          triggerPickBreakSequence("⚠️ Ganzúa rota: Falso punto dulce.");
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

function triggerPickBreakSequence(reasonText) {
  lpState.isBreaking = true;
  lpState.isTension = false;
  audio.playBreak();

  const minigameModal = document.getElementById('minigameModal');
  if (minigameModal) minigameModal.classList.add('hidden');
  const lpContainer = document.getElementById('lockpickContainer');
  if (lpContainer) lpContainer.classList.add('hidden');

  showPersistentFeedback(reasonText);
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
  const tumblerContainer = document.getElementById('tumblerContainer'); if (tumblerContainer) tumblerContainer.classList.remove('hidden');
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

function animateSequentialTumblerPins() {
  const tumblerContainer = document.getElementById('tumblerContainer');
  if (!tumblerContainer || tumblerContainer.classList.contains('hidden')) return;
  if (tumblerPhase !== 'pins') return;

  tumblerPinsData.forEach((pin, i) => {
    if (!pin.locked) {
      pin.posY += pin.speed;
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
    STATE.proPicks = Math.max(0, STATE.proPicks - reqCount);
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
  if (tumblerSeal.y < tumblerSeal.blueY - tumblerSeal.tol) {
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
  if (diff <= tumblerSeal.tol) {
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

  if (diff <= allowedTolerance) {
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
      STATE.usb = Math.max(0, STATE.usb - reqCount); 
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
      STATE.valves = Math.max(0, STATE.valves - reqCount);
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
        STATE.valves = Math.max(0, STATE.valves - reqCount);
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
  if (session.totalGold >= 80) {
    duendeQuote = frasesRecibo.ALTO_ORO;
  } else if (session.totalGold === 0 && session.totalPicksRecycled > 0) {
    duendeQuote = frasesRecibo.SOLO_RECICLAJE;
  }

  const itemsHTML = validItems.map(item => `
    <div class="flex items-center justify-between bg-slate-900/80 border border-amber-500/20 px-3 py-2 rounded-lg text-xs font-mono">
      <span class="flex items-center gap-2 text-amber-200">
        <i class="fa-solid ${item.icon || 'fa-box'} text-amber-400"></i> ${item.name}
      </span>
      <span class="text-amber-400/80 font-bold">${item.costText}</span>
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

      <div class="bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl text-xs italic text-purple-200 leading-relaxed font-serif">
        ${duendeQuote}
      </div>

      <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        ${itemsHTML}
      </div>

      <div class="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs font-mono border-t border-amber-500/30">
        <span class="text-slate-400 font-bold uppercase">Balance Final:</span>
        <div class="flex items-center gap-3">
          ${session.totalGold > 0 ? `<span class="text-amber-400 font-black"><i class="fa-solid fa-coins"></i> -${session.totalGold} GP</span>` : ''}
          ${session.totalPicksRecycled > 0 ? `<span class="text-amber-300 font-black"><i class="fa-solid fa-screwdriver"></i> -${session.totalPicksRecycled} Ganzúas</span>` : ''}
        </div>
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
      showPersistentFeedback(DATOS_JUEGO.NARRATIVA.FRASES_RECIBO_DUENDE.CONTADOR_RESPUESTA);
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

function openTraperoShop() {
  const grid = document.getElementById('traperoDealsGrid') || document.getElementById('traperoItemsList'); 
  if (!grid) return;
  grid.innerHTML = '';

  let deals = [...DATOS_JUEGO.TRATOS_TRAPERO.INICIALES, ...DATOS_JUEGO.TRATOS_TRAPERO.OSCUROS];

  deals = deals.filter(deal => {
    if (deal.id === 'empujon_siniestro' && STATE.gold <= 100) return false;
    // [0.082] Dedos Rotos ya aceptado: no vuelve a aparecer hasta el siguiente bucle (resetGame lo desactiva)
    if (deal.id === 'dedos_rotos' && STATE.picksBrokenOnUse) return false;
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
          STATE.proPicks += 3;
          STATE.usb += 3;
          STATE.valves += 3;
          STATE.cursedChestsLeft += 12;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de Sangre", "Obtienes +3 de cada herramienta avanzada, pero sufres 12 turnos de Maldición (-50% GP y XP).");
        } else if (deal.id === 'pacto_sombra') {
          STATE.harderPuzzlesLeft += 10;
          STATE.traperoBuffs.bonusXp = true;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Pacto de la Sombra", "+25% Experiencia permanente activado. Los minijuegos de los próximos 10 cofres serán más exigentes.");
        } else if (deal.id === 'amor_arte') {
          STATE.proPicks += 2;
          STATE.usb += 2;
          STATE.valves += 2;
          STATE.noXpChestsLeft += 5;
          if (traperoModal) traperoModal.classList.add('hidden');
          audio.playUnlockFanfare('epico');
          updateUI();
          showTraperoDealFeedback("Por Amor al Arte", "Obtienes +2 de cada herramienta avanzada. No ganarás experiencia durante los próximos 5 cofres.");
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
          showTraperoDealFeedback("Cambio de Trabajo", "Has perdido 1 modificación positiva al azar. Recibes +35 GP y +25% XP extra durante 10 cofres.");
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

if (openChestBtn) {
  openChestBtn.addEventListener('click', () => {
    const active = STATE.screenChests[STATE.activeChestIdx];
    if (!active) return;

    audio.init();

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

    const minigameModal = document.getElementById('minigameModal'); 
    if (minigameModal) minigameModal.classList.remove('hidden');
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
  }

  if (
    ['closeTraperoBtn', 'closeTraperoShopBtn', 'declineTraperoBtn'].includes(id) ||
    (btn.closest('#traperoModal, #traperoShopModal') && (text.includes('RECHAZAR') || text.includes('CERRAR') || text.includes('VOLVER') || text.includes('SALIR')))
  ) {
    closeTraperoShop();
  }
});

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
    cover.style.backgroundImage = `url('${ASSETS.portada}')`;
    cover.classList.remove('hidden');
    const closeCover = () => {
      cover.style.opacity = '0';
      setTimeout(() => cover.remove(), 450);
      try { if (typeof audio !== 'undefined' && audio.playClick) audio.playClick(0.8); } catch (e) {}
    };
    cover.addEventListener('click', closeCover, { once: true });
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
   BLOQUE DE PRUEBAS DEV (COFRE 79, BUCLE 2 Y RECURSOS DEV)
   ========================================================================== */
// [0.082] Opciones de pruebas (ponlas a true para activarlas). Se reaplican tras Continuar / Nueva partida / Reiniciar.
var DEV_CONFIG = {
  ACTIVAR_MODO_PRUEBAS: false,   // muestra el cuadro de pruebas y permite el resto de opciones
  ARRANCAR_EN_BUCLE_2: false,    // fuerza el Bucle 2 (activa las mecánicas avanzadas en cofres Raro+)
  BORRAR_LOGROS: false,          // borra los logros guardados al cargar (para volver a probarlos)
  RECURSOS_INFINITOS_DEV: false  // 1000 GP, 99 de cada herramienta, nivel 5 y 3 cofres abiertos (para que ya salgan Raro+ y los 4 tipos)
};

function applyDevStart() {
  if (!DEV_CONFIG.ACTIVAR_MODO_PRUEBAS) return;
  if (DEV_CONFIG.BORRAR_LOGROS && !window.__logrosBorrados) { window.__logrosBorrados = true; clearAchievements(); }
  if (DEV_CONFIG.ARRANCAR_EN_BUCLE_2) STATE.currentLoop = 2;
  if (DEV_CONFIG.RECURSOS_INFINITOS_DEV) {
    STATE.gold = 1000;
    STATE.picks = 99;
    STATE.proPicks = 99;
    STATE.usb = 99;
    STATE.valves = 99;
    if (STATE.level < 5) { STATE.level = 5; STATE.xp = 0; STATE.xpNext = getXpForLevel(5); }
    STATE.chestsOpened = Math.max(STATE.chestsOpened, 3); // a partir de 3 cofres abiertos ya se sortean rarezas
    STATE.chestsAtLevelUp = 0;
  }
}

(function createDevTestWidget() {
  const ACTIVAR_MODO_PRUEBAS = DEV_CONFIG.ACTIVAR_MODO_PRUEBAS;

  const oldWidget = document.getElementById('devTestWidget');
  if (oldWidget) oldWidget.remove();

  if (!ACTIVAR_MODO_PRUEBAS) return;

  // Si no hay diálogo de "Partida guardada" pendiente, se aplica ya y se refresca la pantalla
  applyDevStart();
  if (!document.getElementById('resumeGameModal')) {
    generateScreenChests();
    updateUI();
  }

  const widget = document.createElement('div');
  widget.id = 'devTestWidget';
  widget.className = 'fixed top-4 right-4 z-[9999] bg-slate-950/90 border-2 border-amber-400 p-3 rounded-2xl shadow-2xl flex flex-col items-center gap-2 font-mono backdrop-blur-md';
  widget.innerHTML = `
    <div class="text-[10px] font-black tracking-widest text-amber-400 uppercase flex items-center gap-1"> 🛠️ MODO PRUEBAS (BUCLE ${STATE.currentLoop}) </div> 
    <button id="devJump79Btn" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer border border-yellow-200"> 🚀 IR AL COFRE 79 (500 GP + 20 Tools) </button>
  `;
  document.body.appendChild(widget);

  document.getElementById('devJump79Btn').addEventListener('click', () => {
    if (typeof STATE === 'undefined') { alert('⚠️ Error: No se ha encontrado el objeto STATE.'); return; }
    
    STATE.chestsOpened = 78;
    STATE.gold = 500;
    STATE.picks = 20;
    STATE.proPicks = 20;
    STATE.usb = 20;
    STATE.valves = 20;
    STATE.level = Math.max(STATE.level, 5);

    STATE.seqStage = 1;
    STATE.sequenceBroken = false;
    STATE.climaxPhase = false;

    if (typeof generateScreenChests === 'function') generateScreenChests();
    if (typeof updateUI === 'function') updateUI();
    if (typeof showPersistentFeedback === 'function') {
      showPersistentFeedback("🚀 [MODO TEST] Salto al Cofre 79 completado | 500 GP | 20 Herramientas");
    }
  });
})();