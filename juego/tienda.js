// Catálogo de la tienda y reglas de la economía. Los precios están en pesos ($).
// Si cambias algo aquí, ejecuta `node juego/herramientas/generar-reglas.js` y vuelve a pegar `firebase-rules.json` en
// Firebase (las reglas también validan precios y recompensas, por eso deben coincidir con este archivo).
window.TIENDA = {
  // Economía: cada punto vale $1 del punto 1 al 99, $2 del 100 al 199, $3 del 200 al 299… (sube un peso por cada 100 puntos)
  eco: { tier: 100, msPorRebote: 450, holguraMs: 3000, hMax: 500 },

  // Personajes: el rival que te devuelve el billete. Cada uno tiene su carpeta con las capas del ángel y del demonio.
  ch: [
    { id: 'tio', n: 'Tío Pato',   price: 0,   dir: 'pato/',    name: 'el Tío Pato', g: 'm',
      css: { wl: '43.5% 64.5%', wr: '59% 63.7%', tr: '60.3% 35.5%', tail: '40% 76%', steam: '58% 22%', avW: '142px', avL: '-47px', avT: '-56px' }, note: 'El de siempre' },
    // Skins de imagen suelta (sin alas ni aureola): se enojan con temblor, brillo rojo y vapor. stat2 = dibujo enojado al que cambian cuando el personaje se enoja. av = recorte de la cara para el avatar.
    { id: 'conejo',  n: 'Pato Conejo',    price: 50,  stat: 'trajes/conejo.webp', stat2: 'trajes/conejo-enojado.webp', asp: 1.92, asp2: 1.65, name: 'el Pato Conejo', g: 'm',
      av: { w: 78, fx: .53, fy: .40 }, av2: { w: 78, fx: .55, fy: .39 }, css: { steam: '66% 12%' }, note: 'Se enoja cuando avanzas' },
    { id: 'bigotes', n: 'Pato Bigotes',   price: 150, stat: 'trajes/bigotes.webp',        asp: 1.92, name: 'el Pato Bigotes',   g: 'm', av: { w: 76, fx: .47, fy: .375 }, css: { steam: '64% 12%' }, note: 'Bigote, sombrero de copa y bata' },
    { id: 'conejita', n: 'Patita Conejita', price: 50, stat: 'trajes/conejita.webp',   asp: 1.63, name: 'la Patita Conejita', g: 'f', av: { w: 84, fx: .58, fy: .36 },  css: { steam: '70% 16%' }, note: 'La Tía Patita con orejas de conejo' },
    { id: 'tia', n: 'Tía Patita', price: 500, dir: 'patita/',  name: 'la Tía Patita', g: 'f',
      css: { wl: '42% 64.2%', wr: '60.3% 62.8%', tr: '65.6% 39.2%', tail: '39.5% 78.4%', steam: '58% 26%', avW: '166px', avL: '-50px', avT: '-67px' }, note: 'Ángel que se vuelve demonio' }
  ],

  bg: [
    { id: 'clasico',   n: 'Clásico',          price: 0,   base: '#fff6c0', note: 'Cambia de color con tus puntos' },
    { id: 'atardecer', n: 'Atardecer',        price: 100, base: '#ffb199', note: 'Tonos difuminados' },
    { id: 'cristal',   n: 'Cristal helado',   price: 120, base: '#dcecff', note: 'Azules translúcidos' },
    { id: 'aurora',    n: 'Aurora boreal',    price: 200, base: '#0b1b34', dark: true, note: 'Luces que flotan' },
    { id: 'galaxia',   n: 'Galaxia',          price: 300, base: '#0a0a1f', dark: true, note: 'Nebulosa y estrellas' },
    { id: 'holo',      n: 'Holográfico',      price: 350, base: '#e9c8ff', note: 'Reflejos iridiscentes' },
    { id: 'synth',     n: 'Synthwave',        price: 450, base: '#3d0a6b', dark: true, note: 'Sol neón y cuadrícula' }
  ],

  // Barras: cada una con sus propios efectos (brillos, chispas, anillos al rebotar).
  pad: [
    { id: 'clasica',  n: 'Clásica',      price: 0,   note: 'Negra y sencilla' },
    { id: 'dorada',   n: 'Oro líquido',  price: 120, note: 'Metal con destellos' },
    { id: 'fuego',    n: 'Llamarada',    price: 180, note: 'Fuego vivo y chispas' },
    { id: 'cristal',  n: 'Cristal',      price: 200, note: 'Vidrio con prisma' },
    { id: 'neon',     n: 'Neón',         price: 250, note: 'Brilla y cambia de color' },
    { id: 'galaxia',  n: 'Galaxia',      price: 300, note: 'Estrellas en movimiento' },
    { id: 'arcoiris', n: 'Arcoíris',     price: 350, note: 'Colores que fluyen' },
    { id: 'holo',     n: 'Holográfica',  price: 400, note: 'Iridiscente con destellos' }
  ],

  // Pelotas: monedas y billetes chilenos. fx = cómo se mueve (spin: la moneda gira en el sentido del reloj · flutter: el billete revolotea). w = ancho relativo.
  ball: [
    { id: 'peso1',   n: 'Moneda $1',      price: 0,     img: 'skins/peso1.webp',   fx: 'spin',    w: 1,    trail: '#d5dbe8', note: 'La moneda de inicio' },
    { id: 'peso10',  n: 'Moneda $10',     price: 10,    img: 'skins/peso10.webp',  fx: 'spin',    w: 1,    trail: '#f2c66a' },
    { id: 'peso50',  n: 'Moneda $50',     price: 50,    img: 'skins/peso50.webp',  fx: 'spin',    w: 1,    trail: '#e0b060' },
    { id: 'peso100', n: 'Moneda $100',    price: 100,   img: 'skins/peso100.webp', fx: 'spin',    w: 1,    trail: '#ffe08a' },
    { id: 'peso500', n: 'Moneda $500',    price: 500,   img: 'skins/peso500.webp', fx: 'spin',    w: 1.05, trail: '#f5f0d0' },
    { id: 'b1000',   n: 'Billete $1.000', price: 1000,  img: 'skins/b1000.webp',   fx: 'flutter', w: 1.6,  trail: '#8fe08f' },
    { id: 'b2000',   n: 'Billete $2.000', price: 2000,  img: 'skins/b2000.webp',   fx: 'flutter', w: 1.6,  trail: '#c9a6ee' },
    { id: 'b5000',   n: 'Billete $5.000', price: 5000,  img: 'skins/b5000.webp',   fx: 'flutter', w: 1.6,  trail: '#f08a94' },
    { id: 'b10000',  n: 'Billete $10.000',price: 10000, img: 'skins/b10000.webp',  fx: 'flutter', w: 1.6,  trail: '#7cc4f0' },
    { id: 'b20000',  n: 'Billete $20.000',price: 20000, img: 'skins/b20000.webp',  fx: 'flutter', w: 1.6,  trail: '#f0a070' }
  ]
};
