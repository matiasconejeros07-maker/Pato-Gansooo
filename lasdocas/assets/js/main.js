(function () {
  "use strict";

  var data = window.LAS_DOCAS || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  var STAR = '<svg viewBox="0 0 20 20" width="18" height="18" fill="#D6AE63" aria-hidden="true"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z"/></svg>';
  var QUOTE = '<svg class="review__quote" viewBox="0 0 40 40" width="40" height="40" fill="#E5DBCB" aria-hidden="true"><path d="M17 10C9.7 12 6 17.3 6 25.4V32h11V21h-5.5c.3-4.5 2.3-7.3 6.2-8.7L17 10Zm17 0c-7.3 2-11 7.3-11 15.4V32h11V21h-5.5c.3-4.5 2.3-7.3 6.2-8.7L34 10Z"/></svg>';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function starsHTML(n) {
    var out = "";
    for (var i = 0; i < n; i++) out += STAR;
    return out;
  }

  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "★";
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  }

  document.querySelectorAll(".stars:empty").forEach(function (node) {
    node.innerHTML = starsHTML(5);
  });

  /* ---------- Navegación ---------- */
  var nav = document.getElementById("nav");
  var menu = document.getElementById("menu");
  var toggle = document.getElementById("menu-toggle");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("is-open") && !nav.contains(e.target)) setMenu(false);
  });

  /* ---------- Portada y galería ---------- */
  var fotos = (data.fotos || []).filter(function (f) { return f && f.src; });

  function photoImg(f, className, eager) {
    var img = el("img", className);
    img.src = f.src;
    img.alt = f.alt || f.titulo || "Las Docas";
    img.decoding = "async";
    if (!eager) img.loading = "lazy";
    if (f.pos) img.style.objectPosition = f.pos;
    return img;
  }

  if (fotos.length) {
    initHeroSlides();

    photoCarousel(fotos, "gallery", "galeria");
  }
  photoCarousel((data.pizzas || []).filter(function (f) { return f && f.src; }), "pizzas", "pizzas");

  // Carrusel de fotos con leyenda (galería y pizzas).
  function photoCarousel(list, prefix, sectionId) {
    if (!list.length) return;
    var photoTrack = document.getElementById(prefix + "-track");
    list.forEach(function (f, i) {
      var li = el("li", "photo");
      li.setAttribute("role", "group");
      li.setAttribute("aria-roledescription", "foto");
      li.setAttribute("aria-label", (i + 1) + " de " + list.length);
      var fig = el("figure", "photo__frame");
      fig.appendChild(photoImg(f, "photo__img"));
      if (f.titulo) fig.appendChild(el("figcaption", "photo__caption", f.titulo));
      li.appendChild(fig);
      photoTrack.appendChild(li);
    });
    document.getElementById(sectionId).hidden = false;
    initCarousel({
      carousel: document.getElementById(prefix + "-carousel"),
      track: photoTrack,
      dots: document.getElementById(prefix + "-dots"),
      controls: document.getElementById(prefix + "-controls"),
      itemLabel: "foto",
      interval: 5000
    });
  }

  // Portada: carrusel automático dentro del arco (una foto cada 3,5 s,
  // con transición suave). También se puede deslizar con el dedo.
  function initHeroSlides() {
    var art = document.getElementById("hero-art");
    var stage = el("div", "hero__slides");
    stage.setAttribute("role", "region");
    stage.setAttribute("aria-roledescription", "carrusel");
    stage.setAttribute("aria-label", "Fotos de Las Docas");
    var caption = el("span", "hero__caption");
    caption.setAttribute("aria-live", "polite");
    var slides = fotos.map(function (f, i) {
      var img = photoImg(f, "hero__slide", i === 0);
      if (i === 0) img.fetchPriority = "high";
      stage.appendChild(img);
      return img;
    });
    stage.appendChild(caption);
    art.querySelector(".hero__illustration").replaceWith(stage);

    var current = 0;
    var pausedUntil = 0;
    var INTERVAL = 3500;

    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (img, j) {
        img.classList.toggle("is-active", j === current);
        img.setAttribute("aria-hidden", String(j !== current));
      });
      caption.textContent = fotos[current].titulo || "";
      caption.hidden = !fotos[current].titulo;
      // Precarga la siguiente para que el cambio sea instantáneo.
      var next = slides[(current + 1) % slides.length];
      if (next.loading === "lazy") next.loading = "eager";
    }

    function hold() { pausedUntil = Date.now() + INTERVAL * 2; }

    var startX = null;
    stage.addEventListener("pointerdown", function (e) { startX = e.clientX; hold(); });
    stage.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener("pointercancel", function () { startX = null; });
    // En celulares el toque simula "mouse encima" y nunca sale, por eso
    // la pausa al pasar el cursor aplica solo a un mouse real.
    art.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") pausedUntil = Infinity; });
    art.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") pausedUntil = Date.now() + 1500; });

    show(0);
    if (slides.length > 1) {
      setInterval(function () {
        if (document.hidden || Date.now() < pausedUntil) return;
        show(current + 1);
      }, INTERVAL);
    }
  }

  /* ---------- Reseñas de pizzas (rotan solas) ---------- */
  var resenasPizzas = (data.resenasPizzas || []).filter(function (r) { return r && r.texto; });
  var quotesWrap = document.getElementById("pizza-quotes");
  if (quotesWrap && resenasPizzas.length) {
    quotesWrap.replaceChildren();
    var quotes = resenasPizzas.map(function (r, i) {
      var q = el("blockquote", "pizzas__quote" + (i === 0 ? " is-active" : ""));
      q.setAttribute("aria-hidden", String(i !== 0));
      q.appendChild(el("p", null, "“" + String(r.texto).trim() + "”"));
      var foot = el("footer", null, (r.nombre || "Cliente") + " · " + (r.detalle ? r.detalle + " · " : "") + "Reseña en Google ");
      var st = el("span", "stars");
      st.setAttribute("aria-label", "5 de 5 estrellas");
      st.innerHTML = starsHTML(5);
      foot.appendChild(st);
      q.appendChild(foot);
      quotesWrap.appendChild(q);
      return q;
    });
    if (quotes.length > 1) {
      var qi = 0;
      setInterval(function () {
        if (document.hidden) return;
        quotes[qi].classList.remove("is-active");
        quotes[qi].setAttribute("aria-hidden", "true");
        qi = (qi + 1) % quotes.length;
        quotes[qi].classList.add("is-active");
        quotes[qi].setAttribute("aria-hidden", "false");
      }, 6000);
    }
  }

  /* ---------- Menú de pizzas ---------- */
  var menuPizzas = (data.menuPizzas || []).filter(function (p) { return p && p.nombre; });
  var menuDialog = document.getElementById("pizza-menu");
  var menuOpeners = document.querySelectorAll("[data-open-pizza-menu]");

  if (menuPizzas.length && menuDialog && menuDialog.showModal) {
    var menuList = document.getElementById("pizza-menu-list");
    menuPizzas.forEach(function (p) {
      var li = el("li", "menu-list__item");
      li.appendChild(el("h3", "menu-list__name", p.nombre));
      if (p.ingredientes) li.appendChild(el("p", "menu-list__desc", p.ingredientes));
      menuList.appendChild(li);
    });
    var nota = document.getElementById("pizza-menu-note");
    if (data.menuPizzasNota) nota.textContent = data.menuPizzasNota;
    else nota.hidden = true;

    menuOpeners.forEach(function (btn) {
      btn.addEventListener("click", function () {
        menuDialog.showModal();
        root.classList.add("has-dialog");
      });
    });
    menuDialog.addEventListener("close", function () { root.classList.remove("has-dialog"); });
    menuDialog.addEventListener("click", function (e) {
      // Cierra al tocar fuera de la tarjeta o en el botón de cerrar.
      if (e.target === menuDialog || e.target.closest("[data-close-dialog]")) menuDialog.close();
    });
  } else {
    menuOpeners.forEach(function (btn) { btn.hidden = true; });
  }

  /* ---------- Visítanos ---------- */
  var horario = (data.horario || []).filter(function (h) { return h && h.dias; });
  var hasContact = Boolean(data.direccion || horario.length || data.whatsapp);

  if (hasContact) {
    var visit = document.getElementById("visit");

    if (data.direccion) {
      var dir = el("div", "visit__card reveal");
      dir.appendChild(el("h3", null, "Dirección"));
      dir.appendChild(el("p", null, data.direccion));
      if (data.comoLlegarUrl) {
        var go = el("a", "btn btn--ghost btn--sm", "Cómo llegar");
        go.href = data.comoLlegarUrl;
        go.target = "_blank";
        go.rel = "noopener";
        dir.appendChild(go);
      }
      visit.appendChild(dir);
    }

    if (horario.length) {
      var hrs = el("div", "visit__card reveal");
      hrs.appendChild(el("h3", null, data.horarioTitulo || "Horario"));
      var list = el("ul", "visit__hours");
      horario.forEach(function (h) {
        var li = el("li");
        li.appendChild(el("span", null, h.dias));
        li.appendChild(el("strong", null, h.horas || ""));
        list.appendChild(li);
      });
      hrs.appendChild(list);
      visit.appendChild(hrs);
    }

    if (data.whatsapp) {
      var wa = el("div", "visit__card reveal");
      wa.appendChild(el("h3", null, "Contacto"));
      wa.appendChild(el("p", null, "Escríbenos para pedidos, tortas por encargo o cualquier consulta."));
      var waBtn = el("a", "btn btn--primary btn--sm", "Escribir por WhatsApp");
      waBtn.href = "https://wa.me/" + String(data.whatsapp).replace(/\D/g, "");
      waBtn.target = "_blank";
      waBtn.rel = "noopener";
      wa.appendChild(waBtn);
      if (data.telefono) {
        var tel = el("a", "visit__tel", "o llama al " + data.telefono);
        tel.href = "tel:" + String(data.telefono).replace(/[^\d+]/g, "");
        wa.appendChild(tel);
      }
      visit.appendChild(wa);
    }

    document.getElementById("visitanos").hidden = false;
  }

  document.querySelectorAll("[data-nota-google]").forEach(function (node) {
    if (data.notaGoogle) node.textContent = data.notaGoogle;
    else node.closest("[data-nota-wrap]").hidden = true;
  });

  document.querySelectorAll("[data-requires]").forEach(function (link) {
    var need = link.getAttribute("data-requires");
    var ok = need === "fotos" ? fotos.length > 0 : need === "contacto" ? hasContact : true;
    if (!ok) link.hidden = true;
  });

  /* ---------- Reseñas ---------- */
  var resenas = (data.resenas || []).filter(function (r) {
    return r && Number(r.estrellas) === 5 && String(r.texto || "").trim();
  });

  var section = document.getElementById("resenas");
  var track = document.getElementById("carousel-track");

  if (!resenas.length) {
    section.hidden = true;
    document.querySelectorAll('a[href="#resenas"]').forEach(function (a) { a.hidden = true; });
  } else {
    resenas.forEach(function (r, i) {
      var li = el("li", "review");
      li.setAttribute("role", "group");
      li.setAttribute("aria-roledescription", "reseña");
      li.setAttribute("aria-label", (i + 1) + " de " + resenas.length);
      li.insertAdjacentHTML("beforeend", QUOTE);

      if (r.ejemplo) li.appendChild(el("span", "review__badge", "Ejemplo"));

      var stars = el("div", "stars");
      stars.setAttribute("role", "img");
      stars.setAttribute("aria-label", "5 de 5 estrellas");
      stars.innerHTML = starsHTML(5);
      li.appendChild(stars);

      var body = el("div", "review__body");
      var text = el("p", "review__text is-clamped", "“" + String(r.texto).trim() + "”");
      text.id = "resena-" + i;
      body.appendChild(text);
      var more = el("button", "review__more", "Leer más");
      more.type = "button";
      more.setAttribute("aria-expanded", "false");
      more.setAttribute("aria-controls", text.id);
      body.appendChild(more);
      li.appendChild(body);

      var author = el("div", "review__author");
      author.appendChild(el("span", "review__avatar", initials(r.nombre)));
      var who = el("div");
      who.appendChild(el("p", "review__name", r.nombre || "Cliente"));
      who.appendChild(el("p", "review__meta", r.detalle ? r.detalle + " · Google" : "Reseña en Google"));
      author.appendChild(who);
      li.appendChild(author);

      track.appendChild(li);
    });

    if (data.googleResenasUrl) {
      var moreWrap = document.getElementById("reviews-more");
      moreWrap.querySelector("a").href = data.googleResenasUrl;
      moreWrap.hidden = false;
    }

    var reviewsCarousel = initCarousel({
      carousel: document.getElementById("carousel"),
      track: track,
      dots: document.getElementById("carousel-dots"),
      controls: document.getElementById("carousel-controls"),
      itemLabel: "reseña",
      interval: 6000,
      onMeasure: checkClamps
    });

    // "Leer más": solo aparece si el texto realmente se corta.
    function checkClamps() {
      track.querySelectorAll(".review").forEach(function (card) {
        var text = card.querySelector(".review__text");
        var btn = card.querySelector(".review__more");
        if (btn.getAttribute("aria-expanded") === "true") return;
        btn.hidden = text.scrollHeight <= text.clientHeight + 2;
      });
    }

    track.addEventListener("click", function (e) {
      var btn = e.target.closest(".review__more");
      if (!btn) return;
      var text = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") !== "true";
      text.classList.toggle("is-clamped", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Leer menos" : "Leer más";
      reviewsCarousel.hold(open);
      if (!open) checkClamps();
    });
  }

  // Carrusel deslizable (galería y reseñas): flechas, puntos, teclado
  // y avance automático que se pausa cuando la persona interactúa.
  function initCarousel(o) {
    var carousel = o.carousel;
    var track = o.track;
    var dotsWrap = o.dots;
    var controls = o.controls;
    var prev = controls.querySelector('[data-dir="-1"]');
    var next = controls.querySelector('[data-dir="1"]');
    var cards = Array.prototype.slice.call(track.children);
    var stops = [];
    var active = 0;
    var pausedUntil = 0;
    var hovering = false;
    var inView = false;
    var INTERVAL = o.interval || 6000;

    track.style.position = "relative";

    // Posiciones de parada únicas (en escritorio se ven 3 a la vez,
    // así que las últimas tarjetas comparten la misma parada).
    function measure() {
      var padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      var max = track.scrollWidth - track.clientWidth;
      stops = [];
      cards.forEach(function (card) {
        var pos = Math.min(Math.max(card.offsetLeft - padLeft, 0), max);
        if (!stops.length || Math.abs(pos - stops[stops.length - 1]) > 4) stops.push(pos);
      });
      buildDots();
      updateActive();
      if (o.onMeasure) o.onMeasure();
    }

    function buildDots() {
      dotsWrap.replaceChildren();
      var show = stops.length > 1;
      dotsWrap.hidden = !show;
      controls.hidden = !show;
      if (!show) return;
      stops.forEach(function (_, i) {
        var dot = el("button", "carousel__dot");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Ir a la " + (o.itemLabel || "diapositiva") + " " + (i + 1));
        dot.addEventListener("click", function () { userPause(); goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function nearest() {
      var x = track.scrollLeft;
      var best = 0;
      stops.forEach(function (pos, i) {
        if (Math.abs(pos - x) < Math.abs(stops[best] - x)) best = i;
      });
      return best;
    }

    function updateActive() {
      active = nearest();
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.setAttribute("aria-selected", String(i === active));
        dot.tabIndex = i === active ? 0 : -1;
      });
      prev.disabled = active <= 0;
      next.disabled = active >= stops.length - 1;
    }

    function goTo(i) {
      if (!stops.length) return;
      var idx = Math.max(0, Math.min(i, stops.length - 1));
      track.scrollTo({ left: stops[idx], behavior: reduceMotion ? "auto" : "smooth" });
    }

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { updateActive(); ticking = false; });
    }, { passive: true });

    controls.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-dir]");
      if (!btn) return;
      userPause();
      goTo(active + Number(btn.getAttribute("data-dir")));
    });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        userPause();
        goTo(active + (e.key === "ArrowRight" ? 1 : -1));
      }
    });

    // Avance automático: se pausa al tocar, al pasar el mouse, con foco
    // dentro del carrusel, fuera de pantalla o con la pestaña oculta.
    function userPause() { pausedUntil = Math.max(pausedUntil, Date.now() + INTERVAL * 2); }

    function tick() {
      if (hovering || !inView || document.hidden || Date.now() < pausedUntil) return;
      if (carousel.contains(document.activeElement)) return;
      goTo(active >= stops.length - 1 ? 0 : active + 1);
    }

    carousel.addEventListener("pointerdown", userPause, { passive: true });
    carousel.addEventListener("touchstart", userPause, { passive: true });
    carousel.addEventListener("wheel", userPause, { passive: true });
    carousel.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
    carousel.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hovering = false; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
      }, { threshold: 0.5 }).observe(carousel);
    } else {
      inView = true;
    }

    setInterval(tick, INTERVAL);

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
    return {
      hold: function (on) { pausedUntil = on ? Infinity : Date.now() + INTERVAL; }
    };
  }

  /* ---------- Scroll: barra y aparición ---------- */
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var revealTargets = document.querySelectorAll(
    ".section__head, .split, .value, .offer__item, .board, .order, .ig-card, .reviews__more, .visit__card"
  );
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealTargets.forEach(function (node) {
      node.classList.add("reveal");
      io.observe(node);
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
