(function () {
  "use strict";

  var data = window.LAS_DOCAS || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  var STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z"/></svg>';
  var QUOTE = '<svg class="review__quote" viewBox="0 0 40 40" aria-hidden="true"><path d="M17 10C9.7 12 6 17.3 6 25.4V32h11V21h-5.5c.3-4.5 2.3-7.3 6.2-8.7L17 10Zm17 0c-7.3 2-11 7.3-11 15.4V32h11V21h-5.5c.3-4.5 2.3-7.3 6.2-8.7L34 10Z"/></svg>';

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

  if (fotos.length) {
    var art = document.getElementById("hero-art");
    var heroImg = el("img", "hero__photo");
    heroImg.src = fotos[0].src;
    heroImg.alt = fotos[0].alt || "Las Docas";
    heroImg.width = 800;
    heroImg.height = 1000;
    heroImg.fetchPriority = "high";
    art.querySelector(".hero__illustration").replaceWith(heroImg);

    // Mosaico sin huecos: 1 destacada + grupos de 4 (máx. 9 fotos).
    // Con menos de 5 fotos se usa una grilla simple.
    var gallery = document.getElementById("gallery");
    var galleryFotos = fotos.length >= 5
      ? fotos.slice(0, Math.min(9, 1 + Math.floor((fotos.length - 1) / 4) * 4))
      : fotos.slice(0, 4);
    if (galleryFotos.length < 5) {
      gallery.classList.add("gallery--simple");
      gallery.style.setProperty("--cols", galleryFotos.length === 3 ? 3 : Math.min(galleryFotos.length, 2));
    }
    galleryFotos.forEach(function (f) {
      var fig = el("figure", "gallery__item reveal");
      var img = el("img");
      img.src = f.src;
      img.alt = f.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      fig.appendChild(img);
      gallery.appendChild(fig);
    });
    document.getElementById("galeria").hidden = false;
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
      hrs.appendChild(el("h3", null, "Horario"));
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
      visit.appendChild(wa);
    }

    document.getElementById("visitanos").hidden = false;
  }

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
      who.appendChild(el("p", "review__meta", r.fecha ? "Google · " + r.fecha : "Reseña en Google"));
      author.appendChild(who);
      li.appendChild(author);

      track.appendChild(li);
    });

    if (data.googleResenasUrl) {
      var moreWrap = document.getElementById("reviews-more");
      moreWrap.querySelector("a").href = data.googleResenasUrl;
      moreWrap.hidden = false;
    }

    initCarousel();
  }

  function initCarousel() {
    var carousel = document.getElementById("carousel");
    var dotsWrap = document.getElementById("carousel-dots");
    var controls = document.getElementById("carousel-controls");
    var prev = controls.querySelector('[data-dir="-1"]');
    var next = controls.querySelector('[data-dir="1"]');
    var cards = Array.prototype.slice.call(track.children);
    var stops = [];
    var active = 0;
    var timer = null;
    var pausedUntil = 0;
    var hovering = false;
    var inView = false;
    var INTERVAL = 6000;

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
      checkClamps();
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
        dot.setAttribute("aria-label", "Ir a la reseña " + (i + 1));
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
      if (open) pausedUntil = Infinity;
      else pausedUntil = Date.now() + INTERVAL;
      if (!open) checkClamps();
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
    carousel.addEventListener("mouseenter", function () { hovering = true; });
    carousel.addEventListener("mouseleave", function () { hovering = false; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
      }, { threshold: 0.5 }).observe(carousel);
    } else {
      inView = true;
    }

    if (!reduceMotion) timer = setInterval(tick, INTERVAL);

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
    return timer;
  }

  /* ---------- Scroll: barra y aparición ---------- */
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var revealTargets = document.querySelectorAll(
    ".section__head, .split, .value, .offer__item, .ig-card, .reviews__more, .gallery__item, .visit__card"
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
