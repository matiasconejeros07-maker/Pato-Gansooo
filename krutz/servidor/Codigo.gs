/**
 * KRUTZ · Servidor de pedidos (Google Apps Script)
 * ------------------------------------------------------------
 * Recibe los pedidos de la carta web, los guarda en esta planilla
 * (hojas «Pedidos» y «Clientes») y envía el pedido al WhatsApp del
 * local mediante CallMeBot. Si el WhatsApp falla, envía un correo
 * de respaldo al dueño de la planilla.
 *
 * Configuración (Proyecto ▸ Configuración ▸ Propiedades del script):
 *   WHATSAPP_NUMERO   Número que recibe los pedidos, ej: +56953730459
 *   CALLMEBOT_APIKEY  Clave que entrega CallMeBot al activar el número
 *
 * Instrucciones completas en LEEME.md.
 */

var HOJA_PEDIDOS = "Pedidos";
var HOJA_CLIENTES = "Clientes";
var PREFIJO = "KR-";
var ZONA = "America/Santiago";
var ESPERA_ENTRE_PEDIDOS_SEG = 45; // mismo RUT
// Carta oficial publicada: los precios SIEMPRE se toman de aquí, nunca del cliente.
var CARTA_URL = "https://matiasconejeros07-maker.github.io/Pato-Gansooo/krutz/assets/js/carta.js";

var COLS_PEDIDOS = ["N° pedido", "Fecha", "Nombre", "RUT", "Teléfono", "Pedido", "Comentarios", "Total", "WhatsApp", "Estado"];
var COLS_CLIENTES = ["RUT", "Nombre", "Teléfono", "Creado", "Último pedido", "N° pedidos"];

/* ---------- Entrada ---------- */

function doGet() {
  return json_({ ok: true, servicio: "KRUTZ pedidos" });
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // Campo trampa: los humanos no lo ven; los bots lo llenan.
    if (body.web) return json_({ ok: true, numero: PREFIJO + "0000" });

    if (body.accion === "cuenta") {
      var c = validarCliente_(body.cliente);
      conBloqueo_(function () { guardarCliente_(c, false); });
      return json_({ ok: true });
    }
    if (body.accion === "pedido") return json_(registrarPedido_(body));
    return json_({ ok: false, error: "Acción desconocida" });
  } catch (err) {
    if (!(err && err.publico)) console.error(err && err.stack || err);
    return json_({ ok: false, error: err && err.publico ? err.message : "No se pudo procesar el pedido" });
  }
}

/* ---------- Pedido ---------- */

function registrarPedido_(body) {
  var cliente = validarCliente_(body.cliente);
  var lineas = validarLineas_(body.lineas, catalogo_());
  var total = lineas.reduce(function (a, l) { return a + l.subtotal; }, 0);
  // Si la página del cliente mostraba otro total (precios antiguos o manipulados), no se acepta.
  if (Number(body.total) !== total) throw publico_("Los precios de la carta se actualizaron. Recarga la página y vuelve a pedir.");
  var comentario = texto_(body.comentario, 500);

  // Evita pedidos duplicados por doble toque.
  var cache = CacheService.getScriptCache();
  var claveCache = "rut:" + cliente.rut;
  if (cache.get(claveCache)) throw publico_("Ya recibimos un pedido tuyo hace un momento. Espera unos segundos.");

  var ahora = new Date();
  var fecha = Utilities.formatDate(ahora, ZONA, "dd-MM-yyyy HH:mm");
  var numero;

  conBloqueo_(function () {
    var props = PropertiesService.getScriptProperties();
    var n = Number(props.getProperty("SIGUIENTE") || "1");
    props.setProperty("SIGUIENTE", String(n + 1));
    numero = PREFIJO + ("000" + n).slice(-4);

    hoja_(HOJA_PEDIDOS, COLS_PEDIDOS).appendRow(seguro_([
      numero, fecha, cliente.nombre, cliente.rut, cliente.telefono,
      lineas.map(lineaTexto_).join("\n"), comentario, total, "Enviando…", "Pendiente"
    ]));
    guardarCliente_(cliente, true, fecha);
  });
  cache.put(claveCache, "1", ESPERA_ENTRE_PEDIDOS_SEG);

  // Mensaje para el local.
  var m = ["*NUEVO PEDIDO " + numero + "*", fecha, "",
    "*Cliente:* " + cliente.nombre, "*RUT:* " + cliente.rut, "*Teléfono:* " + cliente.telefono, "", "*Pedido*"];
  lineas.forEach(function (l) {
    m.push("• " + l.cant + " × " + l.nombre + " — " + pesos_(l.subtotal));
    if (l.detalle) m.push("   " + l.detalle);
  });
  m.push("", "*Total: " + pesos_(total) + "*");
  if (comentario) m.push("", "*Comentarios:*", comentario);
  var mensaje = m.join("\n");

  var estado = enviarWhatsApp_(mensaje);
  if (estado !== "Enviado") estado += correoRespaldo_(numero, mensaje);
  marcarEstado_(numero, estado);

  return {
    ok: true, numero: numero, fecha: fecha, total: total,
    lineas: lineas.map(function (l) { return { cant: l.cant, nombre: l.nombre, detalle: l.detalle, subtotal: l.subtotal }; })
  };
}

function lineaTexto_(l) {
  return l.cant + " × " + l.nombre + (l.detalle ? " (" + l.detalle + ")" : "") + " — " + pesos_(l.subtotal);
}

/* ---------- WhatsApp y respaldo ---------- */

function enviarWhatsApp_(texto) {
  var props = PropertiesService.getScriptProperties();
  var numero = props.getProperty("WHATSAPP_NUMERO");
  var clave = props.getProperty("CALLMEBOT_APIKEY");
  if (!numero || !clave) return "Sin configurar";
  try {
    var url = "https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(numero) +
      "&text=" + encodeURIComponent(texto) + "&apikey=" + encodeURIComponent(clave);
    var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var cuerpo = r.getContentText() || "";
    if (r.getResponseCode() === 200 && !/error|invalid|not active/i.test(cuerpo)) return "Enviado";
    console.warn("CallMeBot " + r.getResponseCode() + ": " + cuerpo.slice(0, 300));
    return "Error " + r.getResponseCode();
  } catch (err) {
    console.warn(err);
    return "Error de conexión";
  }
}

function correoRespaldo_(numero, mensaje) {
  try {
    var para = Session.getEffectiveUser().getEmail();
    if (!para) return "";
    MailApp.sendEmail(para, "KRUTZ · Pedido " + numero + " (respaldo)", mensaje.replace(/\*/g, ""));
    return " · correo enviado";
  } catch (err) {
    console.warn(err);
    return "";
  }
}

function marcarEstado_(numero, estado) {
  var h = hoja_(HOJA_PEDIDOS, COLS_PEDIDOS);
  var f = h.getRange(1, 1, h.getLastRow(), 1).createTextFinder(numero).matchEntireCell(true).findNext();
  if (f) h.getRange(f.getRow(), COLS_PEDIDOS.indexOf("WhatsApp") + 1).setValue(estado);
}

/* ---------- Clientes ---------- */

function guardarCliente_(c, conPedido, fecha) {
  var h = hoja_(HOJA_CLIENTES, COLS_CLIENTES);
  var hoy = fecha || Utilities.formatDate(new Date(), ZONA, "dd-MM-yyyy HH:mm");
  var f = h.getLastRow() > 1
    ? h.getRange(2, 1, h.getLastRow() - 1, 1).createTextFinder(c.rut).matchEntireCell(true).findNext()
    : null;
  if (!f) {
    h.appendRow(seguro_([c.rut, c.nombre, c.telefono, hoy, conPedido ? hoy : "", conPedido ? 1 : 0]));
    return;
  }
  var fila = f.getRow();
  var actual = h.getRange(fila, 1, 1, COLS_CLIENTES.length).getValues()[0];
  h.getRange(fila, 1, 1, COLS_CLIENTES.length).setValues([seguro_([
    c.rut, c.nombre, c.telefono, actual[3],
    conPedido ? hoy : actual[4],
    (Number(actual[5]) || 0) + (conPedido ? 1 : 0)
  ])]);
}

/* ---------- Validación ---------- */

function validarCliente_(c) {
  c = c || {};
  var nombre = texto_(c.nombre, 60);
  var rut = rut_(c.rut);
  var tel = telefono_(c.telefono);
  if (nombre.length < 3) throw publico_("Falta tu nombre.");
  if (!rut) throw publico_("El RUT no es válido.");
  if (!tel) throw publico_("El teléfono no es válido.");
  return { nombre: nombre, rut: rut, telefono: tel };
}

// Cada línea llega solo con: id del producto, cantidad, opciones elegidas y si es «Hazla DOP».
// Nombre, precio y opciones válidas salen de la carta oficial.
function validarLineas_(lineas, cat) {
  if (!Array.isArray(lineas) || !lineas.length || lineas.length > 60) throw publico_("El pedido está vacío.");
  return lineas.map(function (l) {
    var p = cat.productos[String(l && l.id)];
    if (!p) throw publico_("La carta cambió. Recarga la página y vuelve a pedir.");
    var cant = Number(l.cant);
    if (!(cant >= 1 && cant <= 50 && cant % 1 === 0)) throw publico_("Cantidad no válida.");

    var elegidas = Array.isArray(l.elecciones) ? l.elecciones.map(function (e) { return String(e); }) : [];
    if (elegidas.length !== p.opciones.length) throw publico_("Falta elegir una opción en " + p.nombre + ".");
    var detalle = p.opciones.map(function (g, i) {
      if (g.valores.indexOf(elegidas[i].replace(g.nombre + ": ", "")) < 0 || elegidas[i].indexOf(g.nombre + ": ") !== 0)
        throw publico_("Opción no válida en " + p.nombre + ".");
      return elegidas[i];
    });

    var dop = l.dop === true;
    if (dop && !p.napoletana) throw publico_(p.nombre + " no tiene opción DOP.");
    var unitario = p.precio + (dop ? cat.dop : 0);
    if (dop) detalle.push("Hazla DOP (+" + pesos_(cat.dop) + ")");
    return { cant: cant, nombre: p.nombre, detalle: detalle.join(" · "), unitario: unitario, subtotal: cant * unitario };
  });
}

/* ---------- Carta oficial ---------- */

function catalogo_() {
  var cache = CacheService.getScriptCache();
  var guardado = cache.get("catalogo");
  if (guardado) return JSON.parse(guardado);
  var url = PropertiesService.getScriptProperties().getProperty("CARTA_URL") || CARTA_URL;
  var r = UrlFetchApp.fetch(url + "?t=" + Date.now(), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw publico_("No pudimos leer la carta. Intenta de nuevo en un minuto.");
  var cat = parsearCarta_(r.getContentText());
  cache.put("catalogo", JSON.stringify(cat), 300); // 5 minutos
  return cat;
}

// Lee carta.js como texto (sin ejecutarlo). Requiere un producto por línea.
function parsearCarta_(js) {
  var STR = '"((?:[^"\\\\]|\\\\.)*)"';
  function cadena(t) { return JSON.parse('"' + t + '"'); }
  function valores(t) {
    var out = [], re = new RegExp(STR, "g"), m;
    while ((m = re.exec(t))) out.push(cadena(m[1]));
    return out;
  }
  var reGrupo = new RegExp("\\{\\s*nombre:\\s*" + STR + "[^\\[]*?valores:\\s*\\[([^\\]]*)\\]", "g");
  function grupos(t) {
    var out = [], m;
    reGrupo.lastIndex = 0;
    while ((m = reGrupo.exec(t))) out.push({ nombre: cadena(m[1]), valores: valores(m[2]) });
    return out;
  }

  var constantes = {}, productos = {}, dop = null, categoria = null, idx = 0, enCategorias = false, enNapo = false;
  js.split("\n").forEach(function (linea) {
    var t = linea.trim(), m;
    if ((m = t.match(/^var\s+([A-Z_]+)\s*=\s*(\{.*\});?$/))) { constantes[m[1]] = grupos(m[2])[0]; return; }
    if (/^napoletana:\s*\{/.test(t)) { enNapo = true; return; }
    if (enNapo && (m = t.match(/^precio:\s*(\d+)/))) { dop = Number(m[1]); enNapo = false; return; }
    if (/^categorias:\s*\[/.test(t)) { enCategorias = true; return; }
    if (!enCategorias) return;
    if ((m = t.match(/^id:\s*"([^"]+)"/))) { categoria = m[1]; idx = 0; return; }
    if (!categoria || !(m = t.match(new RegExp("^\\{\\s*nombre:\\s*" + STR + "(.*)$")))) return;
    var resto = m[2];
    var pr = resto.match(/^,\s*(?:nombrePedido:\s*"(?:[^"\\]|\\.)*",\s*)?precio:\s*(\d+)/);
    if (!pr) throw new Error("Producto sin precio: " + t);
    var np = resto.match(new RegExp("^,\\s*nombrePedido:\\s*" + STR));
    var op = [], mo = resto.match(/opciones:\s*\[(.*)\]\s*\},?$/);
    if (mo) {
      var interior = mo[1];
      (interior.match(/(^|[\s,])([A-Z_]+)(?=[\s,]|$)/g) || []).forEach(function (k) {
        var g = constantes[k.replace(/[\s,]/g, "")];
        if (!g) throw new Error("Opción desconocida: " + k);
        op.push(g);
      });
      op = op.concat(grupos(interior));
    }
    productos[categoria + "-" + idx] = {
      nombre: np ? cadena(np[1]) : cadena(m[1]),
      precio: Number(pr[1]),
      napoletana: /[,{]\s*napoletana:\s*true/.test(resto),
      opciones: op
    };
    idx++;
  });
  if (!dop || !Object.keys(productos).length) throw new Error("No se pudo leer la carta");
  return { productos: productos, dop: dop };
}

function rut_(t) {
  var c = String(t || "").replace(/[^0-9kK]/g, "").toUpperCase();
  if (c.length < 2) return null;
  var cuerpo = c.slice(0, -1), dv = c.slice(-1);
  if (!/^\d{6,8}$/.test(cuerpo)) return null;
  var suma = 0, m = 2;
  for (var i = cuerpo.length - 1; i >= 0; i--) { suma += Number(cuerpo[i]) * m; m = m === 7 ? 2 : m + 1; }
  var r = 11 - (suma % 11);
  var esperado = r === 11 ? "0" : r === 10 ? "K" : String(r);
  if (dv !== esperado) return null;
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
}

function telefono_(t) {
  var d = String(t || "").replace(/\D/g, "");
  if (!/^56\d{9}$/.test(d)) return null;
  return "+56 " + d.slice(2, 3) + " " + d.slice(3, 7) + " " + d.slice(7);
}

function texto_(t, max) {
  return String(t == null ? "" : t).replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim().slice(0, max);
}

/* ---------- Utilidades ---------- */

function hoja_(nombre, columnas) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(nombre);
  if (!h) {
    h = ss.insertSheet(nombre);
    h.appendRow(columnas);
    h.getRange(1, 1, 1, columnas.length).setFontWeight("bold").setBackground("#000000").setFontColor("#f4aa09");
    h.setFrozenRows(1);
    // Columnas de texto (RUT, teléfono…) hasta antes de la primera numérica.
    var texto = columnas.indexOf(nombre === HOJA_PEDIDOS ? "Total" : "N° pedidos");
    h.getRange(1, 1, h.getMaxRows(), texto).setNumberFormat("@");
  }
  return h;
}

// Evita que un texto que empieza con = + - @ se interprete como fórmula.
function seguro_(fila) {
  return fila.map(function (v) { return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v; });
}

function conBloqueo_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function pesos_(n) {
  return "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function publico_(m) { var e = new Error(m); e.publico = true; return e; }

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Para probar desde el editor ---------- */

// Ejecuta esta función una vez: crea las hojas y te manda un WhatsApp de prueba.
function probarConfiguracion() {
  hoja_(HOJA_PEDIDOS, COLS_PEDIDOS);
  hoja_(HOJA_CLIENTES, COLS_CLIENTES);
  var estado = enviarWhatsApp_("Prueba KRUTZ: el servidor de pedidos está funcionando.");
  console.log("WhatsApp: " + estado);
  if (estado !== "Enviado") console.log("Correo de respaldo:" + correoRespaldo_("PRUEBA", "Prueba KRUTZ: el WhatsApp aún no funciona (" + estado + "), pero el correo de respaldo sí."));
}
