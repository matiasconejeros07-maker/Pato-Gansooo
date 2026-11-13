/*
 * CARTA KRUTZ — contenido
 * ------------------------------------------------------------
 * Este es el único archivo que hay que editar para cambiar
 * productos, precios, fotos o descripciones.
 *
 * Campos de cada producto:
 *   nombre       Nombre tal como aparece en la carta.
 *   precio       Número en pesos, sin puntos (ej: 7990).
 *   detalle      Tamaño o porción (ej: "35 cm", "12 oz · 300 ml").
 *   descripcion  Ingredientes o descripción. Si queda "" no se
 *                muestra nada (para completar más adelante).
 *   foto         Ruta a la foto en assets/fotos/. Si queda "" se
 *                muestra un espacio reservado elegante.
 *   etiqueta     "Favorito", "Especialidad" o "Recomendado".
 *                Déjalo "" hasta que se apruebe.
 *   napoletana   true si admite la opción «Hazla Napoletana».
 */
window.KRUTZ = {
  marca: "KRUTZ",
  sitio: "https://krutz.cl",
  correo: "contacto@krutz.cl",
  instagram: "https://www.instagram.com/krutz.cl/",
  instagramUsuario: "@krutz.cl",

  // Portada: video en loop (sin sonido) y su imagen de respaldo.
  // Si ambos quedan vacíos se muestra la portada tipográfica.
  videoPortada: "assets/video/horno.mp4",
  fotoPortada: "assets/video/horno-poster.jpg",

  // Pizza destacada bajo la portada (nombre exacto de un producto).
  destacado: "Pesto Burrata",

  napoletana: {
    titulo: "Hazla Napoletana",
    precio: 5000,
    texto: "Reemplaza el Pomodoro KRUTZ y la mozzarella fior di latte por tomate San Marzano DOP y una mozzarella di bufala completa de 125 g.",
    disponible: "Disponible solo para Margherita, Prosciutto Cotto e Funghi y Diavola KRUTZ."
  },

  categorias: [
    {
      id: "portafoglio",
      nombre: "Pizza Portafoglio",
      italiano: "Pizza a portafoglio",
      estilo: "destacado",
      productos: [
        { nombre: "Portafoglio Margherita", precio: 3990, detalle: "", descripcion: "", foto: "", etiqueta: "" },
        { nombre: "Portafoglio Pepperoni", precio: 4490, detalle: "", descripcion: "", foto: "", etiqueta: "" }
      ]
    },
    {
      id: "pizzas",
      nombre: "Pizzas de 35 cm",
      italiano: "Le pizze",
      estilo: "destacado",
      napoletana: true,
      productos: [
        { nombre: "Margherita", precio: 7990, detalle: "35 cm", descripcion: "", foto: "assets/fotos/margherita.jpg", etiqueta: "", napoletana: true },
        { nombre: "Pepperoni", precio: 9990, detalle: "35 cm", descripcion: "", foto: "assets/fotos/pepperoni.jpg", etiqueta: "" },
        { nombre: "Pollo BBQ", precio: 12990, detalle: "35 cm", descripcion: "", foto: "assets/fotos/pollo-bbq.jpg", etiqueta: "" },
        { nombre: "Prosciutto Cotto e Funghi", precio: 13990, detalle: "35 cm", descripcion: "", foto: "", etiqueta: "", napoletana: true },
        { nombre: "Pesto Burrata", precio: 16990, detalle: "35 cm", descripcion: "", foto: "assets/fotos/pesto-burrata.jpg", etiqueta: "" },
        { nombre: "Burrata e Pomodorini", precio: 16990, detalle: "35 cm", descripcion: "", foto: "", etiqueta: "" },
        { nombre: "Diavola KRUTZ", precio: 13990, detalle: "35 cm", descripcion: "", foto: "", etiqueta: "", napoletana: true }
      ]
    },
    {
      id: "papas",
      nombre: "Papas fritas",
      italiano: "Patatine",
      estilo: "tarjetas",
      nota: "Cada porción incluye una salsa básica a elección: ketchup o mostaza.",
      productos: [
        { nombre: "Pequeña", precio: 2490, detalle: "120 g", descripcion: "", foto: "", etiqueta: "" },
        { nombre: "Mediana", precio: 3990, detalle: "240 g", descripcion: "", foto: "", etiqueta: "" }
      ]
    },
    {
      id: "salsas",
      nombre: "Salsas",
      italiano: "Le salse",
      estilo: "lista",
      productos: [
        { nombre: "Real Mayo", precio: 1000, detalle: "30 ml", descripcion: "" },
        { nombre: "Maionese all’aglio", precio: 1000, detalle: "30 ml", descripcion: "" },
        { nombre: "Smokey BBQ", precio: 1000, detalle: "30 ml", descripcion: "" },
        { nombre: "Pomodoro KRUTZ", precio: 1000, detalle: "30 ml", descripcion: "" },
        { nombre: "Mostaza dulce", precio: 1200, detalle: "20 ml", descripcion: "" },
        { nombre: "Pesto Genovese", precio: 1200, detalle: "20 g", descripcion: "" }
      ]
    },
    {
      id: "dulces",
      nombre: "Bollería y minitortas",
      italiano: "Dolci e lievitati",
      estilo: "tarjetas",
      productos: [
        { nombre: "Medialuna", precio: 1990, detalle: "", descripcion: "", foto: "", etiqueta: "" },
        { nombre: "Croissant de mantequilla", precio: 2490, detalle: "", descripcion: "", foto: "", etiqueta: "" },
        { nombre: "Rollito de canela", precio: 2490, detalle: "", descripcion: "", foto: "", etiqueta: "" },
        { nombre: "Minitorta", precio: 5490, detalle: "", descripcion: "Sabores sujetos a disponibilidad: Carrot Cake, Tres Leches, Cheesecake de frambuesa y Choco Naranja.", foto: "", etiqueta: "" }
      ]
    },
    {
      id: "cafe",
      nombre: "Café y bebidas calientes",
      italiano: "Caffetteria",
      estilo: "lista",
      productos: [
        { nombre: "Americano", precio: 2000, detalle: "12 oz · 300 ml", descripcion: "" },
        { nombre: "Té o infusión", precio: 2000, detalle: "12 oz · 300 ml", descripcion: "" },
        { nombre: "Cappuccino Vainilla", precio: 2500, detalle: "8 oz · 180 ml", descripcion: "" },
        { nombre: "Mocaccino", precio: 2500, detalle: "8 oz · 180 ml", descripcion: "" },
        { nombre: "Chocolate caliente", precio: 2500, detalle: "8 oz · 180 ml", descripcion: "" }
      ]
    },
    {
      id: "combos",
      nombre: "Combos",
      italiano: "Combinazioni",
      estilo: "combos",
      productos: [
        { nombre: "Americano + medialuna", precio: 3490, detalle: "", descripcion: "" },
        { nombre: "Bebida caliente especial + medialuna", precio: 3990, detalle: "", descripcion: "Bebidas especiales: Cappuccino Vainilla, Mocaccino o Chocolate caliente." }
      ]
    },
    {
      id: "bebidas",
      nombre: "Bebidas frías",
      italiano: "Bevande fredde",
      estilo: "lista",
      productos: [
        { nombre: "Bebida en lata", precio: 1800, detalle: "", descripcion: "" },
        { nombre: "San Pellegrino variedades", precio: 2800, detalle: "", descripcion: "" }
      ]
    }
  ]
};
