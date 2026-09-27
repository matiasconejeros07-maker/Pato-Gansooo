/*
 * CONTENIDO DEL SITIO — Las Docas
 * ------------------------------------------------------------
 * Este es el único archivo que hay que editar para actualizar
 * reseñas, fotos, horario y datos de contacto. El diseño se
 * adapta solo: si un dato queda vacío, su bloque no se muestra.
 */
window.LAS_DOCAS = {
  instagram: "lasdocas",

  // Ficha de Google Maps (reseñas) y nota promedio que muestra Google.
  googleResenasUrl: "https://www.google.com/maps/search/?api=1&query=Las+Docas+Cafeteria&query_place_id=ChIJXWRlz2g_YpYR1PK-apgdmAw",
  notaGoogle: "4,9",

  // Datos de contacto. Deja "" o [] para ocultarlos.
  direccion: "Av. Gabriela Mistral 1283, Las Cruces, El Tabo",
  comoLlegarUrl: "https://www.google.com/maps/search/?api=1&query=Las+Docas+Cafeteria&query_place_id=ChIJXWRlz2g_YpYR1PK-apgdmAw",
  whatsapp: "56934578219",  // solo números
  telefono: "+56 9 3457 8219",
  horarioTitulo: "Horario de invierno",
  horario: [
    { dias: "Domingo y lunes", horas: "9:30 – 19:00" },
    { dias: "Martes", horas: "Cerrado" },
    { dias: "Miércoles y jueves", horas: "9:30 – 19:00" },
    { dias: "Viernes y sábado", horas: "9:30 – 21:00" }
  ],

  // Fotos del local y los productos (guárdalas en assets/fotos/).
  // La primera se usa en la portada y el resto en la galería.
  // Si la lista está vacía se muestra la ilustración.
  fotos: [
    { src: "assets/fotos/torta-de-flores-playa.jpg", alt: "Torta de flores de Las Docas frente al mar de Las Cruces" },
    { src: "assets/fotos/fachada-cafeteria-noche.jpg", alt: "Fachada iluminada de la Cafetería Las Docas al anochecer" },
    { src: "assets/fotos/pie-de-limon.jpg", alt: "Pie de limón con merengue de Las Docas" },
    { src: "assets/fotos/cupcakes-de-flores.jpg", alt: "Caja de cupcakes decorados con flores en la playa" }
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
