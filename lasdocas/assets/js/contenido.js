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
  // Se muestran en el carrusel de la portada y en la galería.
  // `titulo` es la leyenda; `pos` (opcional) elige qué parte de la
  // foto queda visible cuando se recorta, ej: "30% 50%".
  fotos: [
    // Primero el local…
    { src: "assets/fotos/paraguas-cielo.jpg", titulo: "Nuestra terraza", alt: "Paraguas de colores colgados sobre la terraza de Las Docas" },
    { src: "assets/fotos/terraza-mesas.jpg", titulo: "Mesas al sol", alt: "Mesas con manteles floreados bajo los paraguas de colores, rodeadas de plantas" },
    { src: "assets/fotos/terraza-paraguas.jpg", titulo: "El mesón", pos: "32% 50%", alt: "Mesón de Las Docas con la gatita anfitriona, paraguas de colores y la pizarra del menú" },
    { src: "assets/fotos/meson-helados-pizza.jpg", titulo: "Helados y pizzas", alt: "Mesón de helados artesanales junto al letrero de pizza" },
    { src: "assets/fotos/fachada-cafeteria-noche.jpg", titulo: "Al caer la tarde", alt: "Fachada iluminada de la Cafetería Las Docas al anochecer" },
    // …y después las delicias.
    { src: "assets/fotos/torta-de-flores-playa.jpg", titulo: "Torta de flores", alt: "Torta de flores de Las Docas frente al mar de Las Cruces" },
    { src: "assets/fotos/pizza-jamon-tabla.jpg", titulo: "Pizza napolitana", alt: "Pizza napolitana de jamón y mozzarella recién salida del horno, sobre una tabla de madera" },
    { src: "assets/fotos/donas-y-brownie.jpg", titulo: "Café, donas y brownie", alt: "Cafés con leche, donas glaseadas y brownie con nueces" },
    { src: "assets/fotos/cafe-y-cheesecake.jpg", titulo: "Cheesecake de frambuesa", alt: "Capuchino con arte latte y cheesecake de frambuesa" },
    { src: "assets/fotos/pizza-albahaca-pesto.jpg", titulo: "Pizza Margarita", alt: "Pizza Margarita con mozzarella gratinada, pesto y hojas de albahaca fresca" },
    { src: "assets/fotos/pie-de-limon.jpg", titulo: "Pie de limón", alt: "Pie de limón con merengue de Las Docas" },
    { src: "assets/fotos/cheesecake-frutos-rojos.jpg", titulo: "Cheesecake de frutos rojos", alt: "Cheesecake entero cubierto de frutos rojos" },
    { src: "assets/fotos/cupcakes-de-flores.jpg", titulo: "Cupcakes de flores", alt: "Caja de cupcakes decorados con flores en la playa" }
  ],



  // Fotos para la sección de pizzas napolitanas (carrusel propio).
  pizzas: [
    { src: "assets/fotos/pizza-jamon-tabla.jpg", titulo: "Jamón y mozzarella", alt: "Pizza napolitana de jamón y mozzarella con borde inflado y tostado" },
    { src: "assets/fotos/pizza-albahaca-pesto.jpg", titulo: "Margarita", alt: "Pizza Margarita con pesto casero y hojas de albahaca fresca" },
    { src: "assets/fotos/pizzas-para-llevar.jpg", titulo: "Hawaiana", alt: "Dos pizzas napolitanas en sus cajas, una de jamón y otra de jamón con piña" },
    { src: "assets/fotos/pizza-en-caja.jpg", titulo: "Para llevar", alt: "Pizza napolitana de jamón en su caja, lista para llevar" }
  ],

  // Reseñas de 5 estrellas sobre las pizzas (carrusel automático
  // en la sección de pizzas). Texto tal como aparece en Google.
  resenasPizzas: [
    { nombre: "Rocío Acevedo", texto: "Es el mejor lugar para comer pizza en todo el litoral central" },
    { nombre: "Sergio Steinmeyer", detalle: "Local Guide", texto: "Pedimos unas pizzas y la verdad es que son de las mejores que hemos probado en el litoral central. Atención muy amable y personalizada, atendido por sus propios dueños. Realmente un imperdible en Las Cruces." },
    { nombre: "Andres Wong", detalle: "Local Guide", texto: "La pizza estaba deliciosa de masa suave y crujiente, el café estaba muy bueno y los pasteles maravillosos, un 7.0 y los dueños muy simpáticos, muy recomendable." },
    { nombre: "Rodrigo Roa", texto: "Muy ricas las pizzas, las mejores. Buen café, buenos helados y exquisito el Kuchen de nuez. Excelente atención, volveremos!" }
  ],

  // Menú de pizzas (copiado de la pizarra del local).
  menuPizzasNota: "Tamaño 32 cm · Estilo napolitano",
  menuPizzas: [
    { nombre: "Margarita", ingredientes: "Salsa pomodoro, mozzarella y pesto" },
    { nombre: "Pepperoni", ingredientes: "Salsa pomodoro, mozzarella y pepperoni" },
    { nombre: "Teresita", ingredientes: "Salsa pomodoro, mozzarella, pepperoni y jamón" },
    { nombre: "Clemente", ingredientes: "Salsa pomodoro, mozzarella, jamón y tocino" },
    { nombre: "Alvarito", ingredientes: "Salsa pomodoro, mozzarella, pepperoni, jamón, tocino y aceitunas" },
    { nombre: "Vegetariana", ingredientes: "Salsa pomodoro, mozzarella, choclo, tomate y aceitunas" },
    { nombre: "Hawaiana", ingredientes: "Crema, mozzarella, piña y tocino" },
    { nombre: "La Negra", ingredientes: "Salsa pomodoro, mozzarella, cebolla caramelizada y camarones" },
    { nombre: "Lorelai", ingredientes: "Salsa pomodoro, crema, mozzarella, zucchinis y tocino" }
  ],

  // Reseñas de clientes, copiadas tal cual desde Google Maps.
  // Solo se muestran las de 5 estrellas. `detalle` es opcional.
  resenas: [
    {
      nombre: "Tania Vargas Piña",
      estrellas: 5,
      texto: "Cafetería Las Docas es un lugar acogedor en Las Cruces ! Sus pizzas, desayunos, cheesecake son una maravilla, preparado por sus propios dueños. La atención es cercana, cariñosa y familiar, como si te recibieran en casa 🤍 y su ubicación cerca de la playa lo hace perfecto para desconectar 100% recomendado. 😍🍕🧁"
    },
    {
      nombre: "Carlos Moraga",
      estrellas: 5,
      texto: "Pocas veces me he topado con el equilibrio perfecto entre calidad de sabores, agradable atención y precios accesibles.\n100% recomendado, una experiencia única que vale la pena probar."
    },
    {
      nombre: "Javiera Pérez",
      estrellas: 5,
      detalle: "Local Guide",
      texto: "Una excelente experiencia. Es un espacio muy bonito y acogedor para disfrutar un café en familia, con amigas o en pareja. El café es muy bueno y los pasteles ricos y frescos. Además, el lugar está limpio, económico, atendido por su encantadora gatita, y los dueños son muy amables"
    },
    {
      nombre: "nicolas vera",
      estrellas: 5,
      detalle: "Local Guide",
      texto: "Excelente lugar, ambiente acogedor y las pizzas son otra cosa, masa 100% artesanal hecha en casa, productos naturales, el café y los pasteles de primer nivel, la atención es de sus dueños, muy amables y gentiles, en definitiva si están en las cruces venir a esta cafetería, 100% recomendado!!!"
    },
    {
      nombre: "Klga. Alejandra Silva",
      estrellas: 5,
      detalle: "Local Guide",
      texto: "Excelente lugar para tomar café de calidad. Los dueños son muy simpáticos, te sientes en casa. Los pasteles y pizza 10/10. Ultra recomendado."
    },
    {
      nombre: "Ingrid",
      estrellas: 5,
      detalle: "Local Guide",
      texto: "Si pasas por las cruces, debes ir a esta cafetería familiar!!! Tiene desde helados artesanales, pizzas , pasteles , hasta menú completo de almuerzo, y todo de calidad!!!\nAtendido por sus simpáticos y atentos dueños, que te hacen sentir como si estuvieras en casa.\nPreocupados de los detalles y presentación en cada una de sus preparaciones.\nLos precios súper razonables!!!\nPetfriendly"
    },
    {
      nombre: "Sofía",
      estrellas: 5,
      detalle: "Local Guide",
      texto: "Todo es maravilloso. Los dueños son muy amables y atentos y la comida es 10/10. Hemos pedido el menú de almuerzo y pizza, y siempre es rico. El ambiente es muy hogareño y tranquilo, como para venir a relajarse. Muuuy recomendado 😊✨"
    },
    {
      nombre: "Saturno Riquelme",
      estrellas: 5,
      texto: "Es un local increíblemente acogedor, entrega mucha paz y tranquilidad. Los cafés estaban exquisitos y el cheesecake de frambuesa es uno de los mejores que hemos probado hasta ahora. Un lugar mágico🤎"
    },
    {
      nombre: "Jocelyn Gomez Pastene",
      estrellas: 5,
      texto: "Una cafetería de 5 estrellas, pedimos un desayuno que estaba delicioso entregan una excelente atención y el lugar es muy bonito aparte del desayuno pedimos unos cupcakes para llevar que también estaban deliciosos 100 % recomendados esperamos volver nuevamente"
    },
    {
      nombre: "Sandra Sepulveda",
      estrellas: 5,
      detalle: "Local Guide",
      texto: "Un lugar digno para hacer un stop en la vida. Recomiendo los exquisitos café helados y una torta de zanahoria de los dioses.\nFELICITACIONES A LA MANO DE MONJA que es la dueña y al dueño por su buena recepción. Un gran anfitrión.\nTodo exquisito y valores acordé a lo que se come (nada de mini porciones).\nGran detalle es que utilizan solo leche sin lactosa y vegetal 🥰\n\nY con una anfitriona adicional para todos los de alma gatuna 😻.\n\nNota de 1 a 7, un 7,5.... Muy agradecidos y prometemos volver."
    }
  ]
};
