(function () {
  "use strict";

  var data = window.KRUTZ || { categorias: [] };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  // Íconos de línea para los espacios reservados de fotos (Lucide, ISC).
  var ICONOS = {
    pizza: '<path d="m12 14-1 1"/><path d="m13.75 18.25-1.25 1.42"/><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12"/><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7"/><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"/>',
    papas: '<path d="M7 9h10l-1.2 11H8.2L7 9Z"/><path d="M9 9V4M12 9V3M15 9V4M10.5 9 10 5M13.5 9l.5-4"/>',
    dulce: '<path d="M16 13H3"/><path d="M16 17H3"/><path d="m7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6"/><circle cx="9" cy="7" r="2"/>',
    cafe: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>'
  };
  var ICONO_CATEGORIA = { portafoglio: "pizza", pizzas: "pizza", papas: "papas", dulces: "dulce", cafe: "cafe", combos: "cafe", bebidas: "cafe", salsas: "pizza" };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function precio(n) {
    return "$" + Number(n).toLocaleString("es-CL");
  }

  function icono(nombre, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONOS[nombre] || ICONOS.pizza) + "</svg>";
  }

  // Foto del producto o espacio reservado elegante.
  function media(prod, catId, cls) {
    var box = el("div", cls);
    if (prod.foto) {
      var img = el("img");
      img.src = prod.foto;
      img.alt = prod.nombre;
      img.loading = "lazy";
      img.decoding = "async";
      box.appendChild(img);
    } else {
      box.classList.add("is-empty");
      box.innerHTML = icono(ICONO_CATEGORIA[catId], 34) + '<span>Fotografía próximamente</span>';
    }
    return box;
  }

  /* ---------- Portada: video del horno (o foto de respaldo) ---------- */
  var hm = document.getElementById("hero-media");
  if (data.videoPortada || data.fotoPortada) {
    document.getElementById("inicio").classList.add("has-photo");
    if (data.fotoPortada) hm.style.backgroundImage = "url('" + data.fotoPortada + "')";
    if (data.videoPortada && !reduceMotion) {
      var v = el("video", "hero__video");
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.preload = "auto";
      if (data.fotoPortada) v.poster = data.fotoPortada;
      v.src = data.videoPortada;
      hm.appendChild(v);
      var p = v.play && v.play();
      if (p && p.catch) p.catch(function () { /* sin autoplay: queda la foto */ });
    }
  }

  /* ---------- Pizza destacada ---------- */
  var destacada = null;
  data.categorias.forEach(function (c) {
    c.productos.forEach(function (p) { if (p.nombre === data.destacado && p.foto) destacada = { cat: c, prod: p }; });
  });
  var spot = document.getElementById("spotlight");
  if (destacada && spot) {
    var fig = el("figure", "spot__media reveal");
    var simg = el("img");
    simg.src = destacada.prod.foto; simg.alt = destacada.prod.nombre; simg.decoding = "async";
    fig.appendChild(simg);
    var sc = el("div", "spot__copy reveal");
    sc.appendChild(el("p", "spot__kicker", "In primo piano"));
    sc.appendChild(el("h2", "spot__title", destacada.prod.nombre));
    if (destacada.prod.detalle) sc.appendChild(el("p", "spot__detail", "Pizza · " + destacada.prod.detalle));
    if (destacada.prod.descripcion) sc.appendChild(el("p", "spot__desc", destacada.prod.descripcion));
    var row = el("div", "spot__row");
    row.appendChild(el("span", "spot__price", precio(destacada.prod.precio)));
    var go = el("a", "btn btn--olive", "Ver todas las pizzas");
    go.href = "#" + destacada.cat.id;
    row.appendChild(go);
    sc.appendChild(row);
    spot.querySelector(".spot__inner").append(fig, sc);
    spot.hidden = false;
  }

  /* ---------- Carta ---------- */
  var carta = document.getElementById("carta");
  var catsList = document.getElementById("cats-list");
  var todos = [];

  data.categorias.forEach(function (cat, ci) {
    var sec = el("section", "cat cat--" + (cat.estilo || "lista"));
    sec.id = cat.id;
    sec.setAttribute("aria-labelledby", cat.id + "-t");

    var head = el("header", "cat__head reveal");
    head.appendChild(el("span", "cat__num", ROMANOS[ci] || String(ci + 1)));
    var ht = el("div", "cat__titles");
    if (cat.italiano) ht.appendChild(el("p", "cat__it", cat.italiano));
    var h2 = el("h2", "cat__title", cat.nombre);
    h2.id = cat.id + "-t";
    ht.appendChild(h2);
    head.appendChild(ht);
    sec.appendChild(head);
    if (cat.nota) sec.appendChild(el("p", "cat__note reveal", cat.nota));

    var estilo = cat.estilo || "lista";
    var list = el("ul", estilo === "lista" ? "menu-list" : estilo === "combos" ? "combos" : "cards");

    cat.productos.forEach(function (p) {
      todos.push({ cat: cat, prod: p });
      var li = el("li", "reveal");

      if (estilo === "lista") {
        li.className = "menu-row reveal";
        var line = el("div", "menu-row__line");
        line.appendChild(el("span", "menu-row__name", p.nombre));
        line.appendChild(el("span", "menu-row__dots"));
        line.appendChild(el("span", "price", precio(p.precio)));
        li.appendChild(line);
        if (p.detalle) li.appendChild(el("p", "menu-row__detail", p.detalle));
        if (p.descripcion) li.appendChild(el("p", "menu-row__desc", p.descripcion));
      } else if (estilo === "combos") {
        li.className = "combo reveal";
        var parts = p.nombre.split(" + ");
        var nm = el("h3", "combo__name");
        parts.forEach(function (part, i) {
          if (i) nm.appendChild(el("span", "combo__plus", "+"));
          nm.appendChild(el("span", null, part));
        });
        li.appendChild(nm);
        if (p.descripcion) li.appendChild(el("p", "combo__desc", p.descripcion));
        li.appendChild(el("p", "price price--lg", precio(p.precio)));
      } else {
        li.className = "card reveal";
        var btn = el("button", "card__btn");
        btn.type = "button";
        btn.setAttribute("aria-label", p.nombre + ", " + precio(p.precio) + ". Ver detalle");
        btn.appendChild(media(p, cat.id, "card__media"));
        if (p.etiqueta) btn.appendChild(el("span", "tag", p.etiqueta));
        var body = el("div", "card__body");
        var top = el("div", "card__top");
        top.appendChild(el("h3", "card__name", p.nombre));
        top.appendChild(el("span", "price", precio(p.precio)));
        body.appendChild(top);
        if (p.detalle) body.appendChild(el("p", "card__detail", p.detalle));
        if (p.descripcion) body.appendChild(el("p", "card__desc", p.descripcion));
        if (p.napoletana) body.appendChild(el("span", "napo-chip", "Disponible Napoletana"));
        btn.appendChild(body);
        btn.addEventListener("click", function () { abrir(cat, p); });
        li.appendChild(btn);
      }
      list.appendChild(li);
    });
    sec.appendChild(list);

    if (cat.napoletana && data.napoletana) sec.appendChild(bloqueNapoletana(data.napoletana));
    carta.appendChild(sec);

    var navLi = el("li");
    var a = el("a", "cats__link", cat.nombre);
    a.href = "#" + cat.id;
    navLi.appendChild(a);
    catsList.appendChild(navLi);
  });

  function bloqueNapoletana(n) {
    var box = el("aside", "napo reveal");
    box.setAttribute("aria-label", n.titulo);
    var seal = el("div", "napo__seal");
    seal.innerHTML = '<span>San Marzano</span><strong>DOP</strong><span>Bufala 125 g</span>';
    box.appendChild(seal);
    var copy = el("div", "napo__copy");
    copy.appendChild(el("p", "napo__kicker", "Opción especial"));
    var t = el("h3", "napo__title");
    t.appendChild(document.createTextNode("Hazla "));
    t.appendChild(el("em", null, "Napoletana"));
    copy.appendChild(t);
    copy.appendChild(el("p", "napo__text", n.texto));
    copy.appendChild(el("p", "napo__avail", n.disponible));
    box.appendChild(copy);
    box.appendChild(el("p", "napo__price", "+" + precio(n.precio)));
    return box;
  }

  /* ---------- Ficha de producto (ventana) ---------- */
  var sheet = document.getElementById("sheet");
  function abrir(cat, p) {
    if (!sheet.showModal) return;
    var m = document.getElementById("sheet-media");
    m.replaceWith(media(p, cat.id, "sheet__media"));
    document.querySelector(".sheet__media").id = "sheet-media";
    document.getElementById("sheet-cat").textContent = cat.nombre;
    document.getElementById("sheet-title").textContent = p.nombre;
    var d = document.getElementById("sheet-detail");
    d.textContent = p.detalle || "";
    d.hidden = !p.detalle;
    var desc = document.getElementById("sheet-desc");
    desc.textContent = p.descripcion || "";
    desc.hidden = !p.descripcion;
    var napo = document.getElementById("sheet-napo");
    if (p.napoletana && data.napoletana) {
      napo.replaceChildren(
        el("strong", null, "Hazla Napoletana +" + precio(data.napoletana.precio)),
        el("span", null, data.napoletana.texto)
      );
      napo.hidden = false;
    } else {
      napo.hidden = true;
    }
    document.getElementById("sheet-price").textContent = precio(p.precio);
    sheet.showModal();
    document.documentElement.classList.add("no-scroll");
  }
  sheet.addEventListener("close", function () { document.documentElement.classList.remove("no-scroll"); });
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet || e.target.closest("[data-close]")) sheet.close();
  });

  /* ---------- Navegación por categorías ---------- */
  var links = Array.prototype.slice.call(catsList.querySelectorAll("a"));
  var bar = document.getElementById("bar");

  function marcar(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      if (on) {
        var nav = catsList.parentElement;
        var target = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
        nav.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var visibles = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visibles[en.target.id] = en.isIntersecting; });
      var primero = data.categorias.filter(function (c) { return visibles[c.id]; })[0];
      if (primero) marcar(primero.id);
    }, { rootMargin: "-40% 0px -55% 0px" });
    data.categorias.forEach(function (c) { spy.observe(document.getElementById(c.id)); });

    if (!reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
      document.querySelectorAll(".reveal").forEach(function (n) { io.observe(n); });
      document.documentElement.classList.add("anim");
    }
  }

  function onScroll() {
    var y = window.scrollY;
    bar.classList.toggle("is-solid", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
