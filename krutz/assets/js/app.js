(function () {
  "use strict";

  var data = window.KRUTZ || { categorias: [] };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function precio(n) { return "$" + Number(n).toLocaleString("es-CL"); }
  function dos(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Portada: video del horno ---------- */
  var hero = document.getElementById("hero-media");
  var frame = el("div", "frame");
  if (data.fotoPortada) frame.style.backgroundImage = "url('" + data.fotoPortada + "')";
  frame.setAttribute("role", "img");
  frame.setAttribute("aria-label", "Pizza horneándose en el horno de KRUTZ");
  if (data.videoPortada && !reduceMotion) {
    var v = el("video");
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    if (data.fotoPortada) v.poster = data.fotoPortada;
    v.src = data.videoPortada;
    frame.appendChild(v);
    var pr = v.play && v.play();
    if (pr && pr.catch) pr.catch(function () {});
  }
  hero.insertBefore(frame, hero.firstChild);

  /* ---------- Carta ---------- */
  var grid = document.getElementById("menu-grid");
  var cats = document.getElementById("cats");

  function item(p) {
    var a = el("article", "item");
    a.appendChild(el("h3", null, p.nombre));
    a.appendChild(el("div", "price", precio(p.precio)));
    if (p.detalle) a.appendChild(el("p", "meta", p.detalle));
    if (p.descripcion) a.appendChild(el("p", null, p.descripcion));
    if (p.napoletana) a.appendChild(el("span", "tag-dop", "Disponible DOP"));
    return a;
  }

  function feature(n) {
    var box = el("aside", "feature");
    box.setAttribute("aria-labelledby", "dop-title");
    var left = el("div");
    left.appendChild(el("div", "section-kicker", n.kicker));
    var h = el("h2", null, n.titulo);
    h.id = "dop-title";
    left.appendChild(h);
    left.appendChild(el("p", "feature-price", "Por solo " + precio(n.precio)));
    var right = el("div", "feature-copy");
    right.appendChild(el("p", null, n.texto));
    (n.notas || []).forEach(function (t) { right.appendChild(el("small", null, t)); });
    box.append(left, right);
    return box;
  }

  var num = 0;
  data.categorias.forEach(function (c) {
    num++;
    var sec = el("section", "menu-section" + (c.ancho ? " full" : "") + (c.destacado ? " launch" : ""));
    sec.id = c.id;
    sec.setAttribute("aria-labelledby", c.id + "-t");
    sec.appendChild(el("div", "section-kicker", dos(num) + " / " + c.kicker));
    var h2 = el("h2", null, c.nombre);
    h2.id = c.id + "-t";
    sec.appendChild(h2);
    if (c.intro) sec.appendChild(el("p", "section-intro", c.intro));
    if (c.introHTML) { var ih = el("p", "section-intro"); ih.innerHTML = c.introHTML; sec.appendChild(ih); }

    // Fotos reales de los productos que tienen
    var conFoto = c.productos.filter(function (p) { return p.foto; });
    if (conFoto.length) {
      var shots = el("div", "shots");
      shots.setAttribute("role", "list");
      shots.setAttribute("aria-label", "Fotos de " + c.nombre);
      conFoto.forEach(function (p) {
        var f = el("figure", "shot");
        f.setAttribute("role", "listitem");
        var img = el("img");
        img.src = p.foto; img.alt = p.nombre; img.loading = "lazy"; img.decoding = "async";
        img.width = 960; img.height = 1200;
        var cap = el("figcaption");
        cap.append(el("b", null, p.nombre), el("span", null, precio(p.precio)));
        f.append(img, cap);
        shots.appendChild(f);
      });
      sec.appendChild(shots);
    }

    var list = el("div", c.dosColumnas ? "cols-2" : "items");
    c.productos.forEach(function (p) { list.appendChild(item(p)); });
    sec.appendChild(list);

    (c.notas || []).forEach(function (t) { sec.appendChild(el("p", "availability", t)); });
    if (c.aviso) {
      var nt = el("p", "sauce-note");
      nt.append(el("strong", null, c.aviso.titulo), document.createTextNode(" " + c.aviso.texto));
      sec.appendChild(nt);
    }
    grid.appendChild(sec);
    if (c.id === "pizzas" && data.napoletana) grid.appendChild(feature(data.napoletana));

    if (c.menu) {
      var a = el("a", null, c.menu);
      a.href = "#" + c.id;
      cats.appendChild(a);
    }
  });

  /* ---------- WhatsApp con mensaje ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + data.whatsapp + "?text=" + encodeURIComponent("Hola KRUTZ, quisiera hacer un pedido");
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Categoría activa y aparición ---------- */
  var links = Array.prototype.slice.call(cats.querySelectorAll("a"));
  var nav = cats.parentElement;
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!vis) return;
      links.forEach(function (l) {
        var on = l.getAttribute("href") === "#" + vis.target.id;
        l.classList.toggle("is-active", on);
        if (on) nav.scrollTo({ left: l.offsetLeft - 18, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }, { rootMargin: "-15% 0px -70%", threshold: [0, .2, .5] });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute("href")); if (s) spy.observe(s); });

    if (!reduceMotion) {
      document.documentElement.classList.add("js");
      var targets = document.querySelectorAll(".menu-section, .feature");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
      }, { threshold: .1, rootMargin: "0px 0px -35px" });
      targets.forEach(function (t, i) {
        t.classList.add("reveal");
        // Lo que ya está en pantalla al cargar se muestra de inmediato.
        if (t.getBoundingClientRect().top < window.innerHeight) t.classList.add("is-visible");
        else io.observe(t);
      });
    }
  }
})();
