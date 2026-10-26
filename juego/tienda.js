// Catálogo de la tienda: lo que se puede comprar con las monedas (1 rebote = 1 moneda).
// Si cambias precios o agregas cosas, ejecuta `node juego/herramientas/generar-reglas.js` y vuelve a pegar
// `firebase-rules.json` en Firebase (las reglas también validan los precios).
// Cada entrada: id (sin espacios), n (nombre), price (monedas), dark (el fondo es oscuro), base (color para la barra del navegador).
window.TIENDA = {
  bg: [
    { id: 'clasico',   n: 'Clásico',          price: 0,   base: '#fff6c0', note: 'Cambia de color con tus rebotes' },
    { id: 'atardecer', n: 'Atardecer',        price: 100, base: '#ffb199', note: 'Tonos difuminados' },
    { id: 'cristal',   n: 'Cristal helado',   price: 120, base: '#dcecff', note: 'Azules translúcidos' },
    { id: 'aurora',    n: 'Aurora boreal',    price: 200, base: '#0b1b34', dark: true, note: 'Luces que flotan' },
    { id: 'galaxia',   n: 'Galaxia',          price: 300, base: '#0a0a1f', dark: true, note: 'Nebulosa y estrellas' },
    { id: 'holo',      n: 'Holográfico',      price: 350, base: '#e9c8ff', note: 'Reflejos iridiscentes' },
    { id: 'synth',     n: 'Synthwave',        price: 450, base: '#3d0a6b', dark: true, note: 'Sol neón y cuadrícula' }
  ],
  pad: [
    { id: 'clasica', n: 'Clásica',      price: 0,   note: 'Negra y sencilla' },
    { id: 'dorada',  n: 'Dorada',       price: 120, note: 'Metal brillante' },
    { id: 'fuego',   n: 'Fuego',        price: 180, note: 'Degradado ardiente' },
    { id: 'cristal', n: 'Cristal',      price: 200, note: 'Vidrio translúcido' },
    { id: 'neon',    n: 'Neón',         price: 250, note: 'Brilla en la oscuridad' },
    { id: 'holo',    n: 'Holográfica',  price: 400, note: 'Iridiscente animada' }
  ],
  ball: [
    { id: 'billete',  n: 'Billete volador', price: 0,   e: '💸' },
    { id: 'moneda',   n: 'Moneda de oro',   price: 80,  e: '🪙' },
    { id: 'estrella', n: 'Estrella',        price: 120, e: '⭐' },
    { id: 'diamante', n: 'Diamante',        price: 200, e: '💎' },
    { id: 'esfera',   n: 'Esfera mística',  price: 260, e: '🔮' }
  ]
};
