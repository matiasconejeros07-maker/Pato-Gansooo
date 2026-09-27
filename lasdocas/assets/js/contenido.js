/*
 * CONTENIDO DEL SITIO — Las Docas
 * ------------------------------------------------------------
 * Este es el único archivo que hay que editar para actualizar
 * reseñas, fotos, horario y datos de contacto. El diseño se
 * adapta solo: si un dato queda vacío, su bloque no se muestra.
 */
window.LAS_DOCAS = {
  instagram: "lasdocas",

  // Enlace a la ficha de Google con todas las reseñas.
  googleResenasUrl: "https://share.google/XBlJ7LUigOHjRZoLj",

  // Datos de contacto. Deja "" o [] para ocultarlos.
  direccion: "",
  comoLlegarUrl: "",      // enlace de Google Maps
  whatsapp: "",           // solo números, ej: "56912345678"
  horario: [
    // { dias: "Lunes a viernes", horas: "08:00 – 20:00" },
  ],

  // Fotos del local y los productos (guárdalas en assets/fotos/).
  // La primera se usa en la portada. Si la lista está vacía se
  // muestra la ilustración y la galería queda oculta.
  fotos: [
    // { src: "assets/fotos/01.jpg", alt: "Capuchino con arte latte" },
  ],

  // Reseñas de clientes. Solo se muestran las de 5 estrellas.
  // Las marcadas con `ejemplo: true` son de muestra y llevan
  // una etiqueta visible; reemplázalas por las reseñas reales.
  resenas: [
    {
      nombre: "Nombre del cliente",
      estrellas: 5,
      fecha: "",
      texto: "Aquí va el texto de una reseña real de 5 estrellas, copiado tal como aparece en Google.",
      ejemplo: true
    },
    {
      nombre: "Nombre del cliente",
      estrellas: 5,
      fecha: "",
      texto: "Reseña de muestra de largo medio. Sirve para comprobar cómo se ve el carrusel cuando las opiniones tienen distinto largo, y que todas las tarjetas queden alineadas a la misma altura.",
      ejemplo: true
    },
    {
      nombre: "Nombre del cliente",
      estrellas: 5,
      fecha: "",
      texto: "Reseña de muestra larga. Cuando un cliente escribe mucho, la tarjeta muestra las primeras líneas y un botón «Leer más» para ver el texto completo sin romper el diseño. Así el carrusel se mantiene ordenado en el celular, que es donde la mayoría de las personas va a ver la página. Este texto se reemplaza por una reseña real.",
      ejemplo: true
    },
    {
      nombre: "Nombre del cliente",
      estrellas: 5,
      fecha: "",
      texto: "Reseña corta de muestra.",
      ejemplo: true
    }
  ]
};
