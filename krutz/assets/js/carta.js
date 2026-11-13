/*
 * CARTA KRUTZ — contenido
 * ------------------------------------------------------------
 * Único archivo que hay que editar para cambiar productos,
 * precios, fotos o textos. Contenido tomado de krutz.cl/menu.
 *
 * Producto:
 *   nombre       Nombre en la carta.
 *   precio       Número en pesos, sin puntos (ej: 7990).
 *   detalle      Tamaño o porción (ej: "120 g", "12 oz / 300 ml").
 *   descripcion  Ingredientes o descripción ("" = no se muestra).
 *   foto         Ruta a la foto en assets/fotos/ ("" = sin foto).
 *   napoletana   true si admite «Hazla DOP».
 */
window.KRUTZ = {
  sitio: "https://krutz.cl",
  correo: "contacto@krutz.cl",
  whatsapp: "56953730459",
  whatsappTexto: "+56 9 5373 0459",
  instagram: "https://www.instagram.com/krutz.cl/",
  ubicacion: "San Bernardo, Región Metropolitana",

  // Portada: video en loop (sin sonido) y su imagen de respaldo.
  videoPortada: "assets/video/horno.mp4",
  fotoPortada: "assets/video/horno-poster.jpg",

  napoletana: {
    kicker: "Extra especial",
    titulo: "Hazla DOP",
    precio: 5000,
    texto: "Si eres de los más puristas y quieres vivir la experiencia completa reemplazamos nuestro Pomodoro KRUTZ y fior di latte por tomate San Marzano DOP y una mozzarella di bufala completa de 125 g.",
    notas: [
      "Disponible únicamente para Margherita, Prosciutto Cotto e Funghi y Diavola KRUTZ.",
      "DOP: Denominación de Origen Protegida."
    ]
  },

  categorias: [
    {
      id: "portafoglio",
      menu: "Portafoglio",
      kicker: "Para comer al paso",
      nombre: "Pizza Portafoglio",
      intro: "Pizza individual elaborada con bollo de 150 g, pensada para doblar y disfrutar al paso.",
      notas: ["La PIZZA PORTAFOGLIO solo se vende al paso o para retiro en local."],
      productos: [
        { nombre: "Portafoglio Margherita", precio: 3990, descripcion: "Pomodoro KRUTZ, mozzarella fior di latte, albahaca y aceite de oliva." },
        { nombre: "Portafoglio Pepperoni", precio: 4490, descripcion: "Pomodoro KRUTZ, mozzarella fior di latte y pepperoni." }
      ]
    },
    {
      id: "pizzas",
      menu: "Pizzas Estilo Napoletano",
      kicker: "Nuestra especialidad",
      nombre: "Pizzas Estilo Napoletano",
      ancho: true,
      dosColumnas: true,
      intro: "Elaboradas con bollos de masa de fermentación prolongada, salsa pomodoro KRUTZ de origen italiano y mozzarella fior di latte, al estilo napoletano.",
      notas: [
        "Tamaño para toda la familia, y por qué no, también para uno.",
        "Grana Padano: Queso maduro de vaca, similar al parmigiano reggiano pero más suave.",
        "Parmigiano Reggiano: Queso maduro de vaca."
      ],
      productos: [
        { nombre: "Margherita", precio: 7990, napoletana: true, foto: "assets/fotos/margherita.jpg", descripcion: "Pomodoro KRUTZ, mozzarella fior di latte, grana padano, albahaca y aceite de oliva." },
        { nombre: "Pepperoni", precio: 9990, foto: "assets/fotos/pepperoni.jpg", descripcion: "Pomodoro KRUTZ, mozzarella fior di latte y pepperoni." },
        { nombre: "Pollo BBQ", precio: 12990, foto: "assets/fotos/pollo-bbq.jpg", descripcion: "Salsa BBQ, mozzarella fior di latte, pollo, bacon y cebolla morada." },
        { nombre: "Prosciutto Cotto e Funghi", precio: 13990, napoletana: true, descripcion: "Pomodoro KRUTZ, mozzarella fior di latte, jamón cocido, champiñones y aceite de oliva." },
        { nombre: "Pesto Burrata", precio: 16990, foto: "assets/fotos/pesto-burrata.jpg", descripcion: "Pesto genovese, mozzarella fior di latte, mortadella al pistacchio, burrata, tomate cherry, parmesano, albahaca y aceite de oliva." },
        { nombre: "Burrata e Pomodorini", precio: 16990, descripcion: "Pomodoro KRUTZ, tomate cherry, parmesano, albahaca y burrata." },
        { nombre: "Diavola KRUTZ", precio: 13990, napoletana: true, descripcion: "Pomodoro KRUTZ, mozzarella fior di latte, ventricina piccante, pepperoncini y aceite de oliva." }
      ]
    },
    {
      id: "papas",
      menu: "Papas y salsas",
      kicker: "Para acompañar",
      nombre: "Papas fritas",
      intro: "Cada porción incluye una salsa básica a elección: ketchup o mostaza.",
      productos: [
        { nombre: "Pequeña", precio: 2490, detalle: "120 g" },
        { nombre: "Mediana", precio: 3990, detalle: "240 g" },
        { nombre: "Salsa básica adicional", precio: 500, descripcion: "Ketchup o mostaza." }
      ]
    },
    {
      id: "salsas",
      kicker: "Para untar",
      nombre: "Salsas premium",
      introHTML: "Si quieres darle un toque <b>PREMIUM</b> a tus papas o <b>ROMPER LAS REGLAS DEL DISCIPLINARE ITALIANO</b> prueba nuestras exquisitas salsas, cuidadosamente seleccionadas.",
      dosColumnas: true,
      aviso: { titulo: "Alérgenos:", texto: "el pesto contiene lácteos y puede contener frutos secos. Consulta por otros alérgenos." },
      productos: [
        { nombre: "Real Mayo", precio: 1000, detalle: "30 ml" },
        { nombre: "Maionese all’aglio", precio: 1000, detalle: "30 ml" },
        { nombre: "Smokey BBQ", precio: 1000, detalle: "30 ml" },
        { nombre: "Pomodoro KRUTZ", precio: 1000, detalle: "30 ml" },
        { nombre: "Mostaza dulce", precio: 1200, detalle: "20 ml" },
        { nombre: "Pesto Genovese", precio: 1200, detalle: "20 ml" }
      ]
    },
    {
      id: "bolleria",
      menu: "Bollería",
      kicker: "Algo dulce",
      nombre: "Bollería y minitortas",
      notas: ["En bollería el glaseado es opcional, avísale a quien toma tu pedido."],
      productos: [
        { nombre: "Medialuna", precio: 1990 },
        { nombre: "Croissant de mantequilla", precio: 2490 },
        { nombre: "Rollito de canela", precio: 2490 },
        { nombre: "Minitorta", precio: 5490, descripcion: "Carrot Cake, Tres Leches, Cheesecake de frambuesa, Matilde o Choco Naranja, según disponibilidad." }
      ]
    },
    {
      id: "cafe",
      menu: "Café",
      kicker: "Bebidas calientes",
      nombre: "Café y algo más",
      productos: [
        { nombre: "Americano", precio: 2000, detalle: "12 oz / 300 ml" },
        { nombre: "Té o infusión", precio: 2000, detalle: "12 oz / 300 ml" },
        { nombre: "Cappuccino Vainilla", precio: 2500, detalle: "8 oz / 180 ml" },
        { nombre: "Mocaccino", precio: 2500, detalle: "8 oz / 180 ml" },
        { nombre: "Chocolate caliente", precio: 2500, detalle: "8 oz / 180 ml" }
      ]
    },
    {
      id: "combos",
      menu: "Combos",
      kicker: "Combos de lanzamiento",
      nombre: "Elige tu pausa",
      destacado: true,
      productos: [
        { nombre: "Americano + medialuna", precio: 3490 },
        { nombre: "Bebida caliente especial + medialuna", precio: 3990, descripcion: "Elige Cappuccino Vainilla, Mocaccino o Chocolate caliente." }
      ]
    },
    {
      id: "bebidas",
      menu: "Bebidas frías",
      kicker: "Para tomar",
      nombre: "Bebidas frías",
      productos: [
        { nombre: "Bebida en lata", precio: 1800, descripcion: "Coca Cola, Coca Cola Sin Azúcar, Sprite, Limón Soda." },
        { nombre: "San Pellegrino variedades", precio: 2800, descripcion: "Limonata, Aranciata Rossa, Agua Mineral c/gas embotellada en los Alpes italianos." },
        { nombre: "Agua purificada", precio: 1800, descripcion: "Agua Benedictino con o sin gas." }
      ]
    }
  ]
};
