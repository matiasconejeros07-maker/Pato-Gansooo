/*
 * PEDIDO KRUTZ — carrito, cuenta y envío por WhatsApp
 * ------------------------------------------------------------
 * El pedido y los datos del cliente se guardan solo en el
 * dispositivo del cliente (localStorage). Al enviar se abre
 * WhatsApp con el mensaje listo para el número de KRUTZ.
 */
(function () {
  "use strict";

  var data = window.KRUTZ;
  if (!data) return;

  var K_PEDIDO = "krutz.pedido.v1";
  var K_CUENTA = "krutz.cuenta.v2";
  var DOP = data.napoletana;

  /* ---------- Utilidades ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function precio(n) { return "$" + Number(n).toLocaleString("es-CL"); }
  function leer(k, def) {
    try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; }
  }
  function guardar(k, v) {
    try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  // Catálogo por id (los ids los asigna app.js: "<categoria>-<n>").
  var productos = {};
  data.categorias.forEach(function (c) {
    c.productos.forEach(function (p) { p.categoria = c.id; productos[p.id] = p; });
  });

  function nombreDe(p) { return p.nombrePedido || p.nombre; }
  function unitario(l) { var p = productos[l.id]; return p.precio + (l.dop ? DOP.precio : 0); }
  function detalleDe(l) {
    var partes = (l.elecciones || []).slice();
    if (l.dop) partes.push(DOP.titulo + " (+" + precio(DOP.precio) + ")");
    return partes.join(" · ");
  }

  /* ---------- Estado ---------- */
  var pedido = leer(K_PEDIDO, { lineas: [], comentario: "" });
  if (!pedido || !Array.isArray(pedido.lineas)) pedido = { lineas: [], comentario: "" };
  // Descarta productos que ya no están en la carta.
  pedido.lineas = pedido.lineas.filter(function (l) { return l && productos[l.id] && l.cant > 0; });
  var cuenta = leer(K_CUENTA, null);
  if (!cuenta || !cuenta.nombre || !cuenta.rut || !cuenta.telefono) cuenta = null;
  var recibo = null; // último pedido enviado (se muestra como comprobante)

  function persistir() { guardar(K_PEDIDO, pedido); }
  function totalUnidades() { return pedido.lineas.reduce(function (a, l) { return a + l.cant; }, 0); }
  function totalPesos() { return pedido.lineas.reduce(function (a, l) { return a + unitario(l) * l.cant; }, 0); }

  function agregar(id, elecciones, dop, cant) {
    var clave = id + "|" + elecciones.join("|") + "|" + (dop ? 1 : 0);
    var l = pedido.lineas.filter(function (x) { return x.clave === clave; })[0];
    if (l) l.cant += cant;
    else pedido.lineas.push({ clave: clave, id: id, elecciones: elecciones, dop: !!dop, cant: cant });
    persistir();
    pintar();
    aviso(cant + " × " + nombreDe(productos[id]) + " agregado");
  }

  /* ---------- Diálogos ---------- */
  function abrir(d) {
    var t = document.getElementById("toast");
    if (t) t.classList.remove("show");
    if (!d.open) {
      if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    }
    document.documentElement.classList.add("has-dialog");
  }
  function cerrar(d) {
    if (d.close) d.close(); else d.removeAttribute("open");
  }
  document.querySelectorAll("dialog.sheet").forEach(function (d) {
    d.addEventListener("close", function () {
      if (!document.querySelector("dialog.sheet[open]")) document.documentElement.classList.remove("has-dialog");
    });
    // Tocar fuera del panel lo cierra.
    d.addEventListener("click", function (e) { if (e.target === d) cerrar(d); });
    d.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { cerrar(d); }); });
  });

  /* ---------- Elegir opciones de un producto ---------- */
  var dOpc = $("opt-dialog");
  var opcProducto = null;
  var opcCant = 1;

  function abrirOpciones(p) {
    opcProducto = p; opcCant = 1;
    $("opt-title").textContent = p.nombre;
    $("opt-desc").textContent = p.descripcion || p.detalle || "";
    var cuerpo = $("opt-groups");
    cuerpo.textContent = "";
    (p.opciones || []).forEach(function (g, gi) {
      var fs = el("fieldset", "opt-group");
      var lg = el("legend", null, g.nombre);
      if (g.nota) lg.appendChild(el("small", null, " · " + g.nota));
      fs.appendChild(lg);
      g.valores.forEach(function (v) {
        var lab = el("label", "choice");
        var inp = el("input");
        inp.type = "radio"; inp.name = "g" + gi; inp.value = v;
        lab.append(inp, el("span", null, v));
        fs.appendChild(lab);
      });
      cuerpo.appendChild(fs);
    });
    if (p.napoletana && DOP) {
      var fs = el("fieldset", "opt-group");
      fs.appendChild(el("legend", null, "Extra especial"));
      var lab = el("label", "choice choice-dop");
      var inp = el("input");
      inp.type = "checkbox"; inp.name = "dop";
      var txt = el("span");
      txt.append(el("b", null, DOP.titulo + " +" + precio(DOP.precio)), el("small", null, "Tomate San Marzano DOP y mozzarella di bufala completa de 125 g."));
      lab.append(inp, txt);
      fs.appendChild(lab);
      cuerpo.appendChild(fs);
    }
    $("opt-error").hidden = true;
    pintarOpciones();
    abrir(dOpc);
  }
  function pintarOpciones() {
    var dop = dOpc.querySelector("input[name=dop]");
    var u = opcProducto.precio + (dop && dop.checked ? DOP.precio : 0);
    $("opt-qty").textContent = opcCant;
    $("opt-add").textContent = "Agregar " + opcCant + " · " + precio(u * opcCant);
  }
  dOpc.addEventListener("change", function () { $("opt-error").hidden = true; pintarOpciones(); });
  $("opt-minus").addEventListener("click", function () { if (opcCant > 1) { opcCant--; pintarOpciones(); } });
  $("opt-plus").addEventListener("click", function () { if (opcCant < 50) { opcCant++; pintarOpciones(); } });
  $("opt-add").addEventListener("click", function () {
    var p = opcProducto, elecciones = [], falta = null;
    (p.opciones || []).forEach(function (g, gi) {
      var r = dOpc.querySelector("input[name=g" + gi + "]:checked");
      if (r) elecciones.push(g.nombre + ": " + r.value);
      else if (!falta) falta = g.nombre;
    });
    if (falta) {
      var e = $("opt-error");
      e.textContent = "Elige una opción en «" + falta + "».";
      e.hidden = false;
      return;
    }
    var dop = dOpc.querySelector("input[name=dop]");
    agregar(p.id, elecciones, dop && dop.checked, opcCant);
    cerrar(dOpc);
  });

  // Botones «Agregar» de la carta.
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-add]");
    if (!b) return;
    var p = productos[b.dataset.add];
    if (!p) return;
    if ((p.opciones && p.opciones.length) || p.napoletana) abrirOpciones(p);
    else agregar(p.id, [], false, 1);
  });

  /* ---------- Carrito ---------- */
  var dCarro = $("cart-dialog");
  var lista = $("cart-lines");
  var comentario = $("cart-note");
  comentario.value = pedido.comentario || "";
  comentario.addEventListener("input", function () { pedido.comentario = comentario.value; persistir(); });

  function pintar() {
    var n = totalUnidades(), t = totalPesos();

    // Contadores en la página.
    document.querySelectorAll("[data-cart-count]").forEach(function (x) { x.textContent = n; });
    var barra = $("cart-bar");
    barra.hidden = n === 0;
    $("cart-bar-text").textContent = n + (n === 1 ? " producto" : " productos") + " · " + precio(t);
    var contacto = document.querySelector(".float-contact");
    if (contacto) contacto.hidden = n > 0;
    document.querySelectorAll("[data-add]").forEach(function (b) {
      var c = pedido.lineas.reduce(function (a, l) { return a + (l.id === b.dataset.add ? l.cant : 0); }, 0);
      b.classList.toggle("in-cart", c > 0);
      b.innerHTML = c > 0 ? 'Agregar <span aria-hidden="true">+</span><em>' + c + "</em>" : 'Agregar <span aria-hidden="true">+</span>';
    });

    // Líneas del pedido.
    lista.textContent = "";
    $("cart-empty").hidden = n > 0 || !!recibo;
    $("cart-form").hidden = n === 0;
    $("cart-done").hidden = !recibo;
    pedido.lineas.forEach(function (l, i) {
      var p = productos[l.id];
      var li = el("li", "line");
      var txt = el("div", "line-text");
      txt.appendChild(el("b", null, nombreDe(p)));
      var det = detalleDe(l);
      if (det) txt.appendChild(el("small", null, det));
      var qty = el("div", "qty");
      var menos = el("button", null, l.cant === 1 ? "×" : "−");
      menos.type = "button";
      menos.setAttribute("aria-label", l.cant === 1 ? "Quitar " + p.nombre : "Una unidad menos de " + p.nombre);
      menos.addEventListener("click", function () {
        l.cant--;
        if (l.cant <= 0) pedido.lineas.splice(i, 1);
        persistir(); pintar();
      });
      var cant = el("span", null, l.cant);
      cant.setAttribute("aria-label", l.cant + " unidades");
      var mas = el("button", null, "+");
      mas.type = "button";
      mas.setAttribute("aria-label", "Una unidad más de " + p.nombre);
      mas.addEventListener("click", function () { if (l.cant < 50) { l.cant++; persistir(); pintar(); } });
      qty.append(menos, cant, mas);
      li.append(txt, qty, el("span", "line-price", precio(unitario(l) * l.cant)));
      lista.appendChild(li);
    });
    $("cart-total").textContent = precio(t);
    $("cart-send-total").textContent = precio(t);

    // Aviso de la Portafoglio (solo al paso o retiro en local).
    var porta = pedido.lineas.some(function (l) { return productos[l.id].categoria === "portafoglio"; });
    $("cart-porta").hidden = !porta;

    pintarCuenta();
  }

  /* ---------- Cuenta ---------- */
  var dCuenta = $("account-dialog");
  var volverAlCarro = false;

  // RUT chileno: valida dígito verificador (módulo 11) y lo deja como 12.345.678-5.
  function formatearRut(t) {
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
  function limpiarTelefono(t) {
    var d = String(t || "").replace(/\D/g, "");
    if (d.length === 9 && d[0] === "9") d = "56" + d;          // 9 1234 5678
    if (d.length === 8) d = "569" + d;                         // 1234 5678
    if (!/^56\d{9}$/.test(d)) return null;
    return "+56 " + d.slice(2, 3) + " " + d.slice(3, 7) + " " + d.slice(7);
  }
  function limpiarNombre(t) { return String(t || "").replace(/\s+/g, " ").trim().slice(0, 60); }

  function pintarCuenta() {
    $("account-label").textContent = cuenta ? "Hola, " + cuenta.nombre.split(" ")[0] : "Crear cuenta";
    $("cart-who").hidden = !cuenta;
    $("cart-guest").hidden = !!cuenta;
    if (cuenta) {
      $("cart-who-name").textContent = cuenta.nombre;
      $("cart-who-data").textContent = "RUT " + cuenta.rut + " · " + cuenta.telefono;
    }
    $("account-title").textContent = cuenta ? "Mi cuenta" : "Crea tu cuenta";
    $("account-logout").hidden = !cuenta;
    $("account-save").textContent = cuenta ? "Guardar cambios" : "Crear cuenta";
  }

  function abrirCuenta(desdeCarro) {
    volverAlCarro = desdeCarro === true;
    if (volverAlCarro && dCarro.open) cerrar(dCarro);
    $("acc-name").value = cuenta ? cuenta.nombre : "";
    $("acc-rut").value = cuenta ? cuenta.rut : "";
    $("acc-phone").value = cuenta ? cuenta.telefono : "";
    $("account-error").hidden = true;
    abrir(dCuenta);
    setTimeout(function () { $("acc-name").focus(); }, 30);
  }
  $("account-btn").addEventListener("click", function () { abrirCuenta(false); });
  dCuenta.addEventListener("close", function () { setTimeout(function () { volverAlCarro = false; }, 0); });
  $("cart-who-edit").addEventListener("click", function () { abrirCuenta(true); });
  $("cart-create").addEventListener("click", function () { abrirCuenta(true); });
  $("acc-rut").addEventListener("blur", function () { var r = formatearRut(this.value); if (r) this.value = r; });

  function errorCuenta(t, campo) {
    $("account-error").textContent = t;
    $("account-error").hidden = false;
    $(campo).focus();
  }
  $("account-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = limpiarNombre($("acc-name").value);
    var rut = formatearRut($("acc-rut").value);
    var tel = limpiarTelefono($("acc-phone").value);
    if (nombre.length < 3 || nombre.indexOf(" ") < 0) return errorCuenta("Escribe tu nombre y apellido.", "acc-name");
    if (!rut) return errorCuenta("Revisa tu RUT: no es válido (ej. 12.345.678-5).", "acc-rut");
    if (!tel) return errorCuenta("Escribe un celular chileno válido (ej. +56 9 1234 5678).", "acc-phone");
    var nueva = !cuenta;
    cuenta = { nombre: nombre, rut: rut, telefono: tel };
    guardar(K_CUENTA, cuenta);
    pintarCuenta();
    cerrar(dCuenta);
    aviso(nueva ? "Cuenta creada: " + nombre.split(" ")[0] : "Datos actualizados");
    // Registra la cuenta en la planilla del local (si está configurada).
    if (data.pedidosURL) enviarServidor({ accion: "cuenta", cliente: cuenta }).catch(function () {});
    if (volverAlCarro) { volverAlCarro = false; abrirCarro(); }
  });
  $("account-logout").addEventListener("click", function () {
    cuenta = null;
    guardar(K_CUENTA, null);
    pintarCuenta();
    cerrar(dCuenta);
    aviso("Tus datos se borraron de este dispositivo");
  });

  /* ---------- Pedido ---------- */
  function lineasPedido() {
    return pedido.lineas.map(function (l) {
      var p = productos[l.id];
      return { id: l.id, cant: l.cant, nombre: nombreDe(p), detalle: detalleDe(l), unitario: unitario(l), subtotal: unitario(l) * l.cant };
    });
  }

  function mensaje() {
    var r = ["Hola KRUTZ, quiero hacer un pedido.", "", "*Nombre:* " + cuenta.nombre, "*RUT:* " + cuenta.rut, "*Teléfono:* " + cuenta.telefono, "", "*Pedido*"];
    lineasPedido().forEach(function (l) {
      r.push("• " + l.cant + " × " + l.nombre + " — " + precio(l.subtotal));
      if (l.detalle) r.push("   " + l.detalle);
    });
    r.push("", "*Total: " + precio(totalPesos()) + "*");
    var com = (pedido.comentario || "").trim();
    if (com) r.push("", "*Comentarios:*", com);
    return r.join("\n");
  }

  // text/plain evita la verificación previa (CORS) de Google Apps Script.
  function enviarServidor(cuerpo) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = ctrl && setTimeout(function () { ctrl.abort(); }, 25000);
    return fetch(data.pedidosURL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(cuerpo),
      redirect: "follow",
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (t) clearTimeout(t);
      if (!j || !j.ok) { var er = new Error((j && j.error) || "Error del servidor"); er.servidor = !!(j && j.error); throw er; }
      return j;
    }, function (err) { if (t) clearTimeout(t); throw err; });
  }

  function errorCarro(t) {
    $("cart-error").textContent = t;
    $("cart-error").hidden = false;
    $("cart-error").scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  var enviando = false;
  $("cart-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!pedido.lineas.length || enviando) return;
    if (!cuenta) { errorCarro("Crea tu cuenta para hacer el pedido."); return; }
    $("cart-error").hidden = true;

    // Sin servidor configurado: el cliente envía el pedido desde su WhatsApp.
    if (!data.pedidosURL) {
      var url = "https://wa.me/" + data.whatsapp + "?text=" + encodeURIComponent(mensaje());
      // Botón de respaldo por si el navegador bloquea la apertura automática.
      $("cart-wa-link").href = url;
      var w = null;
      try { w = window.open(url, "_blank"); } catch (err) {}
      if (w) { try { w.opener = null; } catch (err) {} }
      else if (window.top === window) location.href = url;
      $("cart-sent").hidden = false;
      $("cart-sent").scrollIntoView({ block: "nearest", behavior: "smooth" });
      return;
    }

    var boton = $("cart-submit");
    var lineas = lineasPedido(), total = totalPesos();
    enviando = true;
    boton.disabled = true;
    boton.textContent = "Enviando pedido…";
    enviarServidor({
      accion: "pedido",
      cliente: cuenta,
      lineas: lineas,
      total: total,
      comentario: (pedido.comentario || "").trim(),
      web: $("hp-web") ? $("hp-web").value : ""
    }).then(function (j) {
      recibo = { numero: j.numero, fecha: j.fecha || new Date().toLocaleString("es-CL"), lineas: lineas, total: total };
      pedido = { lineas: [], comentario: "" };
      comentario.value = "";
      persistir();
      pintarRecibo();
      pintar();
      $("cart-done").scrollIntoView({ block: "start" });
    }).catch(function (err) {
      errorCarro(err && err.servidor ? err.message : "No pudimos enviar tu pedido. Revisa tu conexión e inténtalo de nuevo.");
    }).then(function () {
      enviando = false;
      boton.disabled = false;
      boton.innerHTML = 'Pedir al local · <span id="cart-send-total">' + precio(totalPesos()) + "</span>";
    });
  });

  function pintarRecibo() {
    $("done-num").textContent = recibo.numero;
    $("done-name").textContent = cuenta ? cuenta.nombre : "";
    $("done-date").textContent = recibo.fecha;
    var ul = $("done-lines");
    ul.textContent = "";
    recibo.lineas.forEach(function (l) {
      var li = el("li", "line");
      var txt = el("div", "line-text");
      txt.appendChild(el("b", null, l.cant + " × " + l.nombre));
      if (l.detalle) txt.appendChild(el("small", null, l.detalle));
      li.append(txt, el("span", "line-price", precio(l.subtotal)));
      ul.appendChild(li);
    });
    $("done-total").textContent = precio(recibo.total);
  }

  $("cart-clear").addEventListener("click", function () {
    pedido = { lineas: [], comentario: "" };
    comentario.value = "";
    persistir();
    $("cart-sent").hidden = true;
    pintar();
    cerrar(dCarro);
  });
  $("cart-keep").addEventListener("click", function () { $("cart-sent").hidden = true; });

  function abrirCarro() {
    $("cart-sent").hidden = true;
    $("cart-error").hidden = true;
    if (recibo && pedido.lineas.length) recibo = null;
    pintar();
    abrir(dCarro);
  }
  dCarro.addEventListener("close", function () { if (recibo) { recibo = null; pintar(); } });
  document.querySelectorAll("[data-open-cart]").forEach(function (b) { b.addEventListener("click", abrirCarro); });

  // Texto del botón e indicación según cómo se envía el pedido.
  $("cart-hint").textContent = data.pedidosURL
    ? "Tu pedido llega directo al local."
    : "Se abrirá WhatsApp con tu pedido escrito. Solo tienes que tocar Enviar.";

  /* ---------- Aviso breve ---------- */
  var toast = $("toast"), tId;
  function aviso(t) {
    toast.textContent = t;
    toast.classList.add("show");
    clearTimeout(tId);
    tId = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  pintar();
})();
