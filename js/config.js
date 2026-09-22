/**
 * Flores amarillas — personaliza tu carta aquí.
 *
 * Cambia los textos, el nombre, el color y los botones.
 * Guarda el archivo y recarga la página.
 *
 * - Si dejas nombre como "TU NOMBRE", no se muestra.
 *   Cuando escribas un nombre real, aparecerá al cierre de la tarjeta.
 * - Puedes usar {nombre} dentro de cualquier texto.
 * - mensajePersonalDestacado tiene que estar escrito igual dentro de mensajePersonal.
 * - La música no suena sola. Coloca tu archivo music.mp3 junto a index.html.
 * - Si cambias titulo o subtitulo, actualiza también las etiquetas de vista previa
 *   en index.html para que WhatsApp muestre el texto nuevo al compartir el enlace.
 */
const config = {
  nombre: "ISA 💘",

  titulo: "Tengo algo para ti 🌻",
  subtitulo: "Pero primero tienes que descubrirlo...",

  fechaLinea1: "Hoy es 21 de septiembre...",
  fechaLinea2: "y dicen que hoy se regalan flores amarillas.",

  detalleLinea1: "Así que preparé esto especialmente para ti...",
  detalleLinea2:
    "Porque aunque una flor pueda marchitarse, hay detalles que uno quisiera que permanecieran.",

  mensajePrincipal: [
    "Feliz día de las flores amarillas 🌻",
    "No sabía muy bien cómo regalarte flores desde aquí, así que decidí hacerlo de una manera un poquito diferente.",
    "Solo quería recordarte que eres alguien muy especial para mí y que me alegra muchísimo haberte encontrado.",
  ],

  mensajePersonalIntro: "Y hay algo más...",
  mensajePersonal: "Espero que pronto pueda verte y darte estas flores en persona.",
  mensajePersonalDestacado: "pronto pueda verte",
  mensajePersonalCierre: "Mientras tanto, considéralas mi pequeño detalle para ti hoy. 🌻",

  mensajeFinalIntro: "Para alguien especial...",
  mensajeFinalTitulo: "Feliz 21 de septiembre 🌻",
  mensajeFinal: "Nos vemos pronto.",

  colorPrincipal: "#E2B33C",
  musica: "music.mp3",

  botones: {
    abrir: "Abrir sorpresa",
    mas: "Pero yo quería darte algo más",
    sigue: "Sigue...",
    continuar: "Continuar",
    sorpresa: "Tengo una última sorpresa...",
  },

  // Espera después del mensaje principal, antes de pasar solo a la tarjeta.
  // Pon 0 si quieres que solo avance al tocar "Continuar".
  esperaAntesDeLaTarjeta: 9000,
};
