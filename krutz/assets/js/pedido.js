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
  var K_CUENTA = "krutz.cuenta.v1";
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
  if (!cuenta || !cuenta.nombre) cuenta = null;

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
    $("cart-empty").hidden = n > 0;
    $("cart-form").hidden = n === 0;
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
  function pintarCuenta() {
    var etiqueta = $("account-label");
    etiqueta.textContent = cuenta ? "Hola, " + cuenta.nombre.split(" ")[0] : "Crear cuenta";
    $("cart-who").hidden = !cuenta;
    $("cart-guest").hidden = !!cuenta;
    if (cuenta) {
      $("cart-who-name").textContent = cuenta.nombre;
      $("cart-who-phone").textContent = cuenta.telefono || "";
    }
    $("account-title").textContent = cuenta ? "Mi cuenta" : "Crea tu cuenta";
    $("account-logout").hidden = !cuenta;
    $("account-save").textContent = cuenta ? "Guardar cambios" : "Crear cuenta";
  }
  function limpiarTelefono(t) { return String(t || "").replace(/[^\d+ ]/g, "").replace(/\s+/g, " ").trim().slice(0, 20); }
  function limpiarNombre(t) { return String(t || "").replace(/\s+/g, " ").trim().slice(0, 60); }

  function abrirCuenta() {
    $("acc-name").value = cuenta ? cuenta.nombre : "";
    $("acc-phone").value = cuenta ? (cuenta.telefono || "") : "";
    $("account-error").hidden = true;
    abrir(dCuenta);
    setTimeout(function () { $("acc-name").focus(); }, 30);
  }
  $("account-btn").addEventListener("click", abrirCuenta);
  $("cart-who-edit").addEventListener("click", abrirCuenta);
  $("account-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = limpiarNombre($("acc-name").value);
    if (nombre.length < 2) {
      $("account-error").textContent = "Escribe tu nombre para crear la cuenta.";
      $("account-error").hidden = false;
      return;
    }
    cuenta = { nombre: nombre, telefono: limpiarTelefono($("acc-phone").value) };
    guardar(K_CUENTA, cuenta);
    pintarCuenta();
    cerrar(dCuenta);
    aviso("Cuenta lista: " + nombre.split(" ")[0]);
  });
  $("account-logout").addEventListener("click", function () {
    cuenta = null;
    guardar(K_CUENTA, null);
    pintarCuenta();
    cerrar(dCuenta);
    aviso("Tus datos se borraron de este dispositivo");
  });

  /* ---------- Mensaje de WhatsApp ---------- */
  function mensaje(nombre, telefono) {
    var r = [];
    r.push("Hola KRUTZ, quiero hacer un pedido.");
    r.push("");
    r.push("*Nombre:* " + nombre);
    if (telefono) r.push("*Teléfono:* " + telefono);
    r.push("");
    r.push("*Pedido*");
    pedido.lineas.forEach(function (l) {
      var p = productos[l.id];
      r.push("• " + l.cant + " × " + nombreDe(p) + " — " + precio(unitario(l) * l.cant));
      var det = detalleDe(l);
      if (det) r.push("   " + det);
    });
    r.push("");
    r.push("*Total: " + precio(totalPesos()) + "*");
    var com = (pedido.comentario || "").trim();
    if (com) {
      r.push("");
      r.push("*Comentarios:*");
      r.push(com);
    }
    return r.join("\n");
  }

  $("cart-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!pedido.lineas.length) return;
    var nombre, telefono;
    if (cuenta) { nombre = cuenta.nombre; telefono = cuenta.telefono; }
    else {
      nombre = limpiarNombre($("guest-name").value);
      telefono = limpiarTelefono($("guest-phone").value);
      if (nombre.length < 2) {
        $("cart-error").textContent = "Escribe tu nombre para que sepamos de quién es el pedido.";
        $("cart-error").hidden = false;
        $("guest-name").focus();
        return;
      }
      // Lo que escribió queda como su cuenta para los próximos pedidos.
      cuenta = { nombre: nombre, telefono: telefono };
      guardar(K_CUENTA, cuenta);
    }
    $("cart-error").hidden = true;
    var url = "https://wa.me/" + data.whatsapp + "?text=" + encodeURIComponent(mensaje(nombre, telefono));
    var w = window.open(url, "_blank");
    if (w) { try { w.opener = null; } catch (err) {} } else location.href = url;
    $("cart-sent").hidden = false;
    pintar();
    $("cart-sent").scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  $("cart-clear").addEventListener("click", function () {
    pedido = { lineas: [], comentario: "" };
    comentario.value = "";
    persistir();
    $("cart-sent").hidden = true;
    pintar();
    cerrar(dCarro);
  });
  $("cart-keep").addEventListener("click", function () { $("cart-sent").hidden = true; });

  function abrirCarro() { $("cart-sent").hidden = true; $("cart-error").hidden = true; abrir(dCarro); }
  document.querySelectorAll("[data-open-cart]").forEach(function (b) { b.addEventListener("click", abrirCarro); });

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
